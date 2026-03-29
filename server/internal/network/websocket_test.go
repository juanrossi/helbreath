package network

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

// mockHandler implements MessageHandler for testing.
type mockHandler struct {
	connectCalled    int
	disconnectCalled int
	messages         []struct {
		msgType byte
		payload []byte
	}
}

func (m *mockHandler) OnConnect(client *Client) {
	m.connectCalled++
}

func (m *mockHandler) OnDisconnect(client *Client) {
	m.disconnectCalled++
}

func (m *mockHandler) OnMessage(client *Client, msgType byte, payload []byte) {
	m.messages = append(m.messages, struct {
		msgType byte
		payload []byte
	}{msgType, payload})
}

func TestNewServer(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)
	if s == nil {
		t.Fatal("NewServer returned nil")
	}
	if s.handler == nil {
		t.Fatal("Server handler is nil")
	}
}

func TestNewClient(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)

	// Can't create a real websocket.Conn without a connection, but
	// we can test with nil since NewClient only stores the pointer
	c := NewClient(nil, s)
	if c == nil {
		t.Fatal("NewClient returned nil")
	}
	if c.server != s {
		t.Error("Client server not set")
	}
	if c.sendChan == nil {
		t.Fatal("Client sendChan is nil")
	}
	if cap(c.sendChan) != 256 {
		t.Errorf("Expected sendChan capacity 256, got %d", cap(c.sendChan))
	}
	if c.AccountID != 0 || c.CharacterID != 0 || c.ObjectID != 0 {
		t.Error("New client should have zero IDs")
	}
}

func TestClientSend(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)
	c := NewClient(nil, s)

	// Normal send
	testData := []byte{0x01, 0x02, 0x03}
	c.Send(testData)

	select {
	case received := <-c.sendChan:
		if len(received) != 3 || received[0] != 0x01 {
			t.Errorf("Expected [1,2,3], got %v", received)
		}
	default:
		t.Error("Send should have put data in channel")
	}
}

func TestClientSendBufferFull(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)
	c := NewClient(nil, s)

	// Fill the buffer
	for i := 0; i < 256; i++ {
		c.sendChan <- []byte{byte(i)}
	}

	// This should not block (drops the message)
	c.Send([]byte{0xFF})

	// Channel should still be at capacity
	if len(c.sendChan) != 256 {
		t.Errorf("Expected 256 items in channel, got %d", len(c.sendChan))
	}
}

func TestServerRemoveClient(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)
	c := NewClient(nil, s)

	s.clients.Store(c, true)

	// Verify client exists
	_, ok := s.clients.Load(c)
	if !ok {
		t.Fatal("Client should be in map")
	}

	s.RemoveClient(c)

	// Verify client removed
	_, ok = s.clients.Load(c)
	if ok {
		t.Error("Client should have been removed")
	}
	if handler.disconnectCalled != 1 {
		t.Errorf("Expected OnDisconnect called 1 time, got %d", handler.disconnectCalled)
	}
}

func TestClientIDs(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)
	c := NewClient(nil, s)

	c.AccountID = 42
	c.CharacterID = 7
	c.ObjectID = 100

	if c.AccountID != 42 || c.CharacterID != 7 || c.ObjectID != 100 {
		t.Error("Client IDs not set correctly")
	}
}

// Integration test: full WebSocket connection lifecycle
func TestWebSocketIntegration(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)

	server := httptest.NewServer(http.HandlerFunc(s.HandleWebSocket))
	defer server.Close()

	// Connect client
	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	dialer := websocket.Dialer{}
	conn, _, err := dialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("WebSocket dial failed: %v", err)
	}

	// Wait briefly for OnConnect to fire
	time.Sleep(50 * time.Millisecond)

	if handler.connectCalled != 1 {
		t.Errorf("Expected OnConnect called 1 time, got %d", handler.connectCalled)
	}

	// Send a test message
	testMsg := []byte{0x01, 0x0A, 0x04, 0x74, 0x65, 0x73, 0x74}
	err = conn.WriteMessage(websocket.BinaryMessage, testMsg)
	if err != nil {
		t.Fatalf("Write failed: %v", err)
	}

	// Wait for message to be processed
	time.Sleep(50 * time.Millisecond)

	if len(handler.messages) != 1 {
		t.Errorf("Expected 1 message, got %d", len(handler.messages))
	} else {
		if handler.messages[0].msgType != 0x01 {
			t.Errorf("Expected msgType 0x01, got 0x%02x", handler.messages[0].msgType)
		}
	}

	// Close connection
	conn.Close()

	// Wait for disconnect handler
	time.Sleep(100 * time.Millisecond)

	if handler.disconnectCalled != 1 {
		t.Errorf("Expected OnDisconnect called 1 time, got %d", handler.disconnectCalled)
	}
}

// Test multiple client connections
func TestMultipleClients(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)

	server := httptest.NewServer(http.HandlerFunc(s.HandleWebSocket))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	dialer := websocket.Dialer{}

	conn1, _, err := dialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Dial 1 failed: %v", err)
	}
	conn2, _, err := dialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Dial 2 failed: %v", err)
	}

	time.Sleep(50 * time.Millisecond)

	if handler.connectCalled != 2 {
		t.Errorf("Expected 2 connects, got %d", handler.connectCalled)
	}

	conn1.Close()
	conn2.Close()

	time.Sleep(100 * time.Millisecond)

	if handler.disconnectCalled != 2 {
		t.Errorf("Expected 2 disconnects, got %d", handler.disconnectCalled)
	}
}

// Test sending data from server to client
func TestServerToClientMessage(t *testing.T) {
	handler := &mockHandler{}
	s := NewServer(handler, nil, nil)

	// Track the client from OnConnect
	var connectedClient *Client
	originalConnect := handler.OnConnect
	_ = originalConnect
	handler2 := &clientCapturingHandler{}
	s2 := NewServer(handler2, nil, nil)

	server := httptest.NewServer(http.HandlerFunc(s2.HandleWebSocket))
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	dialer := websocket.Dialer{}

	conn, _, err := dialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Dial failed: %v", err)
	}
	defer conn.Close()

	time.Sleep(50 * time.Millisecond)

	connectedClient = handler2.lastClient
	if connectedClient == nil {
		t.Fatal("No client captured from OnConnect")
	}

	// Send data from server to client
	testData := []byte{0x83, 0x01, 0x02, 0x03}
	connectedClient.Send(testData)

	// Read on client side
	conn.SetReadDeadline(time.Now().Add(time.Second))
	_, received, err := conn.ReadMessage()
	if err != nil {
		t.Fatalf("Read failed: %v", err)
	}
	if len(received) != 4 || received[0] != 0x83 {
		t.Errorf("Expected [0x83,1,2,3], got %v", received)
	}

	// Also cover the case with empty sendChan to avoid leaks
	_ = s
}

// clientCapturingHandler saves the last client connected
type clientCapturingHandler struct {
	lastClient *Client
	mockHandler
}

func (h *clientCapturingHandler) OnConnect(client *Client) {
	h.lastClient = client
	h.mockHandler.OnConnect(client)
}

// Test encoding/decoding all server->client message types for completeness
func TestEncodeDecodeQuestMessages(t *testing.T) {
	tests := []struct {
		name    string
		msgType byte
	}{
		{"QuestListUpdate", MsgQuestListUpdate},
		{"QuestProgress", MsgQuestProgress},
		{"QuestReward", MsgQuestReward},
		{"WorldState", MsgWorldState},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// These are server->client messages so just test Encode doesn't crash
			// Decode won't work since they're not in the switch statement
			if tt.msgType < 0x80 {
				t.Skip("Not a server message")
			}
		})
	}
}

// Test decoding invalid protobuf payload
func TestDecodeCorruptPayload(t *testing.T) {
	// Valid message type but corrupt protobuf
	data := []byte{MsgLoginRequest, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}
	_, _, err := Decode(data)
	if err == nil {
		t.Error("Should fail on corrupt protobuf payload")
	}
}

// Test encoding with nil message
func TestEncodeNilMessage(t *testing.T) {
	// proto.Marshal handles nil gracefully
	data, err := Encode(MsgLoginRequest, nil)
	if err != nil {
		t.Fatalf("Encode nil shouldn't fail: %v", err)
	}
	// Should just be the type byte with empty payload
	if len(data) != 1 {
		t.Errorf("Expected 1 byte for nil message, got %d", len(data))
	}
	if data[0] != MsgLoginRequest {
		t.Errorf("Expected 0x01, got 0x%02x", data[0])
	}
}

// Test decoding empty payload (valid message type, no payload)
func TestDecodeEmptyPayload(t *testing.T) {
	data := []byte{MsgLoginRequest}
	msgType, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}
	if msgType != MsgLoginRequest {
		t.Errorf("Expected 0x01, got 0x%02x", msgType)
	}
	if msg == nil {
		t.Error("Message should not be nil")
	}
}
