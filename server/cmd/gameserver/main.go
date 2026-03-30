package main

import (
	"bufio"
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/juanrossi/hbonline/server/internal/auth"
	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/game"
	"github.com/juanrossi/hbonline/server/internal/network"
)

func main() {
	// Load .env file if it exists (before flag parsing so env vars are available)
	loadEnvFile("../../.env") // from server/cmd/gameserver/ → project root
	loadEnvFile(".env")       // also check current directory

	addr := flag.String("addr", envOrDefault("ADDR", ":8080"), "Server listen address")
	dbURL := flag.String("db", envOrDefault("DATABASE_URL", "postgres://hbonline:hbonline@localhost:5432/hbonline?sslmode=disable"), "PostgreSQL connection URL")
	mapDir := flag.String("maps", envOrDefault("MAP_DIR", "assets/MAPDATA"), "Directory containing AMD map files")
	memDB := flag.Bool("memdb", envOrDefault("MEMDB", "false") == "true", "Use in-memory store (development)")
	jwtSecret := flag.String("jwt-secret", envOrDefault("JWT_SECRET", "helbreath-xyz-secret-change-me"), "Secret key for JWT signing")
	jwtExpiryStr := flag.String("jwt-expiry", envOrDefault("JWT_EXPIRY", "24h"), "JWT token expiration duration")
	flag.Parse()

	jwtExpiry, err := time.ParseDuration(*jwtExpiryStr)
	if err != nil {
		log.Fatalf("Invalid jwt-expiry duration %q: %v", *jwtExpiryStr, err)
	}

	// Warn if using default secret
	if *jwtSecret == "helbreath-xyz-secret-change-me" {
		log.Println("WARNING: Using default JWT secret. Set JWT_SECRET in .env for production!")
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var store db.DataStore

	if *memDB {
		store = db.NewMemoryStore()
		log.Println("Using in-memory store (no PostgreSQL required)")
	} else {
		pool, err := db.Connect(ctx, *dbURL)
		if err != nil {
			log.Fatalf("Database connection failed: %v", err)
		}
		defer pool.Close()
		log.Println("Connected to database")
		store = db.NewStore(pool)
	}

	// Create JWT manager
	jwtManager := auth.NewJWTManager(*jwtSecret, jwtExpiry)

	// Create game engine
	engine := game.NewEngine(store, jwtManager)

	// Load maps
	if err := engine.LoadMaps(*mapDir); err != nil {
		log.Fatalf("Failed to load maps: %v", err)
	}

	// Spawn NPCs
	engine.SpawnNPCs()

	// Start game loop
	go engine.Run(ctx)

	// Set up WebSocket server with UUID resolver for token validation on upgrade
	uuidResolver := func(uuid string) (int, error) {
		return store.GetAccountIDByUUID(context.Background(), uuid)
	}
	wsServer := network.NewServer(engine, jwtManager, uuidResolver)

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", wsServer.HandleWebSocket)
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})

	// HTTP auth endpoints (pre-WebSocket authentication)
	mux.HandleFunc("/api/login", engine.HandleHTTPLogin)
	mux.HandleFunc("/api/characters", engine.HandleHTTPCharacters)
	mux.HandleFunc("/api/characters/create", engine.HandleHTTPCreateCharacter)
	mux.HandleFunc("/api/characters/delete", engine.HandleHTTPDeleteCharacter)

	// Wrap with CORS middleware
	allowedOrigins := envOrDefault("ALLOWED_ORIGINS", "http://localhost:3000,https://helbreath.xyz,https://www.helbreath.xyz")
	handler := corsMiddleware(mux, allowedOrigins)
	httpServer := &http.Server{Addr: *addr, Handler: handler}

	// Graceful shutdown
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		select {
		case <-sigCh:
			log.Println("OS signal received, shutting down...")
			// Block new WebSocket connections immediately
			wsServer.SetShuttingDown()
			// Run full shutdown: 5s countdown, notify players, save, disconnect
			engine.GracefulShutdown(5)
		case <-engine.ShutdownChan():
			log.Println("Admin shutdown completed...")
		}
		cancel()
		// Gracefully shut down HTTP server (give in-flight requests 2s to finish)
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer shutdownCancel()
		httpServer.Shutdown(shutdownCtx)
	}()

	log.Printf("Helbreath.xyz server starting on %s", *addr)
	if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("HTTP server error: %v", err)
	}
	log.Println("Server stopped")
}

// corsMiddleware adds CORS headers. allowedOrigins is a comma-separated list.
func corsMiddleware(next http.Handler, allowedOrigins string) http.Handler {
	origins := make(map[string]bool)
	for _, o := range strings.Split(allowedOrigins, ",") {
		o = strings.TrimSpace(o)
		if o != "" {
			origins[o] = true
		}
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origins[origin] || origins["*"] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// envOrDefault returns the environment variable value or a default.
func envOrDefault(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}

// loadEnvFile reads a .env file and sets environment variables (does not override existing).
func loadEnvFile(path string) {
	f, err := os.Open(path)
	if err != nil {
		return // file doesn't exist, skip silently
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])
		// Don't override existing env vars
		if os.Getenv(key) == "" {
			os.Setenv(key, val)
		}
	}
}
