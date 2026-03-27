package network

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
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

// Server manages WebSocket connections.
type Server struct {
	handler MessageHandler
	clients sync.Map // map[*Client]bool
}

func NewServer(handler MessageHandler) *Server {
	return &Server{handler: handler}
}

func (s *Server) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	client := NewClient(conn, s)
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
	conn     *websocket.Conn
	server   *Server
	sendChan chan []byte
	mu       sync.Mutex

	// Set by game engine after auth
	AccountID   int
	CharacterID int
	ObjectID    int32
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
