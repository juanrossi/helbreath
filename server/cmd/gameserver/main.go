package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/game"
	"github.com/juanrossi/hbonline/server/internal/network"
)

func main() {
	addr := flag.String("addr", ":8080", "Server listen address")
	dbURL := flag.String("db", "postgres://hbonline:hbonline@localhost:5432/hbonline?sslmode=disable", "PostgreSQL connection URL")
	mapDir := flag.String("maps", "assets/MAPDATA", "Directory containing AMD map files")
	memDB := flag.Bool("memdb", false, "Use in-memory store instead of PostgreSQL (for development)")
	flag.Parse()

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

	// Create game engine
	engine := game.NewEngine(store)

	// Load maps
	if err := engine.LoadMaps(*mapDir); err != nil {
		log.Fatalf("Failed to load maps: %v", err)
	}

	// Spawn NPCs
	engine.SpawnNPCs()

	// Start game loop
	go engine.Run(ctx)

	// Set up WebSocket server
	wsServer := network.NewServer(engine)

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", wsServer.HandleWebSocket)
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})

	httpServer := &http.Server{Addr: *addr, Handler: mux}

	// Graceful shutdown
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigCh
		log.Println("Shutting down...")
		cancel()
		engine.SaveAllPlayers()
		httpServer.Close()
	}()

	log.Printf("HB Online server starting on %s", *addr)
	if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("HTTP server error: %v", err)
	}
	log.Println("Server stopped")
}
