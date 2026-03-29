package network

import (
	"log"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	"github.com/juanrossi/hbonline/server/internal/auth"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin:     func(r *http.Request) bool { return true }, // allow all origins in dev
}

// MessageHandler processes decoded client messages.
type MessageHandler interface {
	OnConnect(client *Client)
	OnDisconnect(client *Client)
	OnMessage(client *Client, msgType byte, payload []byte)
}

// UUIDResolver resolves a UUID string to an internal account ID.
type UUIDResolver func(uuid string) (int, error)

// Server manages WebSocket connections.
type Server struct {
	handler      MessageHandler
	clients      sync.Map // map[*Client]bool
	jwtManager   *auth.JWTManager
	uuidResolver UUIDResolver
	shuttingDown atomic.Bool
}

func NewServer(handler MessageHandler, jwtManager *auth.JWTManager, resolver UUIDResolver) *Server {
	return &Server{handler: handler, jwtManager: jwtManager, uuidResolver: resolver}
}

// SetShuttingDown marks the server as shutting down, rejecting new WS connections.
func (s *Server) SetShuttingDown() {
	s.shuttingDown.Store(true)
}

func (s *Server) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	if s.shuttingDown.Load() {
		http.Error(w, "Server is shutting down", http.StatusServiceUnavailable)
		return
	}

	// Check for JWT token in query parameter (pre-authenticated via HTTP)
	token := r.URL.Query().Get("token")
	var claims *auth.Claims
	if token != "" && s.jwtManager != nil {
		var err error
		claims, err = s.jwtManager.ValidateToken(token)
		if err != nil {
			http.Error(w, "Invalid auth token", http.StatusUnauthorized)
			return
		}
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	client := NewClient(conn, s)

	// If pre-authenticated via HTTP, resolve UUID → account_id and set auth fields
	if claims != nil && s.uuidResolver != nil {
		accountID, err := s.uuidResolver(claims.UUID)
		if err != nil {
			log.Printf("WebSocket: failed to resolve UUID %s: %v", claims.UUID, err)
			conn.Close()
			return
		}
		client.AccountID = accountID
		client.Username = claims.Username
		client.AuthToken = token
		client.Authenticated = true
		log.Printf("WebSocket client pre-authenticated as %s (uuid=%s)", claims.Username, claims.UUID)
	}

	s.clients.Store(client, true)
	s.handler.OnConnect(client)

	go client.ReadPump()
	go client.WritePump()
}

func (s *Server) RemoveClient(client *Client) {
	s.clients.Delete(client)
	s.handler.OnDisconnect(client)
}

// Client represents a single WebSocket connection.
type Client struct {
	conn      *websocket.Conn
	server    *Server
	sendChan  chan []byte
	closeOnce sync.Once
	mu        sync.Mutex

	// Set by game engine after auth
	AccountID     int
	CharacterID   int
	ObjectID      int32
	Authenticated bool
	AuthToken     string
	Username      string
}

func NewClient(conn *websocket.Conn, server *Server) *Client {
	return &Client{
		conn:     conn,
		server:   server,
		sendChan: make(chan []byte, 256),
	}
}

func (c *Client) Send(data []byte) {
	select {
	case c.sendChan <- data:
	default:
		log.Printf("Client %d send buffer full, dropping", c.ObjectID)
	}
}

func (c *Client) Close() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.conn.Close()
}

// CloseGracefully closes the send channel so WritePump drains all pending
// messages, then closes the underlying WebSocket connection.
func (c *Client) CloseGracefully() {
	c.closeOnce.Do(func() { close(c.sendChan) })
	// Give WritePump a moment to flush remaining messages
	time.Sleep(100 * time.Millisecond)
	c.Close()
}

func (c *Client) ReadPump() {
	defer func() {
		c.server.RemoveClient(c)
		c.Close()
	}()

	c.conn.SetReadLimit(8192)

	for {
		_, data, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
				log.Printf("WebSocket read error: %v", err)
			}
			return
		}

		if len(data) < 1 {
			continue
		}
		c.server.handler.OnMessage(c, data[0], data)
	}
}

func (c *Client) WritePump() {
	defer c.Close()

	for data := range c.sendChan {
		c.mu.Lock()
		err := c.conn.WriteMessage(websocket.BinaryMessage, data)
		c.mu.Unlock()
		if err != nil {
			log.Printf("WebSocket write error: %v", err)
			return
		}
	}
}
