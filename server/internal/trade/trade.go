package trade

import (
	"fmt"
	"sync"
)

// MaxTradeSlots is the maximum number of items in a trade.
const MaxTradeSlots = 8

// TradeItem represents an item offered in a trade.
type TradeItem struct {
	InventorySlot int
	ItemDefID     int
	Name          string
	Count         int
}

// TradeSession represents an active trade between two players.
type TradeSession struct {
	Player1ID int32
	Player2ID int32

	Items1 []*TradeItem // items offered by player 1
	Items2 []*TradeItem // items offered by player 2
	Gold1  int64        // gold offered by player 1
	Gold2  int64        // gold offered by player 2

	Confirmed1 bool
	Confirmed2 bool

	mu sync.RWMutex
}

// NewTradeSession creates a trade session between two players.
func NewTradeSession(p1ID, p2ID int32) *TradeSession {
	return &TradeSession{
		Player1ID: p1ID,
		Player2ID: p2ID,
		Items1:    make([]*TradeItem, 0),
		Items2:    make([]*TradeItem, 0),
	}
}

// SetItem adds or updates an item in a player's trade offer.
func (t *TradeSession) SetItem(playerID int32, slot int, itemDefID int, name string, count int) error {
	t.mu.Lock()
	defer t.mu.Unlock()

	// Reset confirmations when items change
	t.Confirmed1 = false
	t.Confirmed2 = false

	items := t.getItemsPtr(playerID)
	if items == nil {
		return fmt.Errorf("player not in this trade")
	}

	// Remove existing item from same inventory slot
	filtered := make([]*TradeItem, 0, len(*items))
	for _, item := range *items {
		if item.InventorySlot != slot {
			filtered = append(filtered, item)
		}
	}

	if count > 0 {
		if len(filtered) >= MaxTradeSlots {
			return fmt.Errorf("trade slots full")
		}
		filtered = append(filtered, &TradeItem{
			InventorySlot: slot,
			ItemDefID:     itemDefID,
			Name:          name,
			Count:         count,
		})
	}

	*items = filtered
	return nil
}

// SetGold sets the gold offered by a player.
func (t *TradeSession) SetGold(playerID int32, gold int64) error {
	t.mu.Lock()
	defer t.mu.Unlock()

	t.Confirmed1 = false
	t.Confirmed2 = false

	if playerID == t.Player1ID {
		t.Gold1 = gold
	} else if playerID == t.Player2ID {
		t.Gold2 = gold
	} else {
		return fmt.Errorf("player not in this trade")
	}
	return nil
}

// Confirm sets a player's confirmed status.
func (t *TradeSession) Confirm(playerID int32, confirmed bool) error {
	t.mu.Lock()
	defer t.mu.Unlock()

	if playerID == t.Player1ID {
		t.Confirmed1 = confirmed
	} else if playerID == t.Player2ID {
		t.Confirmed2 = confirmed
	} else {
		return fmt.Errorf("player not in this trade")
	}
	return nil
}

// BothConfirmed returns true if both players have confirmed.
func (t *TradeSession) BothConfirmed() bool {
	t.mu.RLock()
	defer t.mu.RUnlock()
	return t.Confirmed1 && t.Confirmed2
}

// GetOtherPlayer returns the other player's ID.
func (t *TradeSession) GetOtherPlayer(playerID int32) int32 {
	if playerID == t.Player1ID {
		return t.Player2ID
	}
	return t.Player1ID
}

// GetPlayerItems returns the items offered by a player.
func (t *TradeSession) GetPlayerItems(playerID int32) []*TradeItem {
	t.mu.RLock()
	defer t.mu.RUnlock()
	if playerID == t.Player1ID {
		return t.Items1
	}
	return t.Items2
}

// GetPlayerGold returns the gold offered by a player.
func (t *TradeSession) GetPlayerGold(playerID int32) int64 {
	t.mu.RLock()
	defer t.mu.RUnlock()
	if playerID == t.Player1ID {
		return t.Gold1
	}
	return t.Gold2
}

func (t *TradeSession) getItemsPtr(playerID int32) *[]*TradeItem {
	if playerID == t.Player1ID {
		return &t.Items1
	}
	if playerID == t.Player2ID {
		return &t.Items2
	}
	return nil
}

// TradeManager manages active trade sessions and requests.
type TradeManager struct {
	sessions map[int32]*TradeSession // player object ID -> session
	requests map[int32]int32         // target ID -> requester ID
	mu       sync.RWMutex
}

// NewTradeManager creates a new trade manager.
func NewTradeManager() *TradeManager {
	return &TradeManager{
		sessions: make(map[int32]*TradeSession),
		requests: make(map[int32]int32),
	}
}

// RequestTrade records a trade request.
func (tm *TradeManager) RequestTrade(requesterID, targetID int32) error {
	tm.mu.Lock()
	defer tm.mu.Unlock()

	if _, exists := tm.sessions[requesterID]; exists {
		return fmt.Errorf("already in a trade")
	}
	if _, exists := tm.sessions[targetID]; exists {
		return fmt.Errorf("target is already trading")
	}
	tm.requests[targetID] = requesterID
	return nil
}

// AcceptTrade accepts a trade request and creates a session.
func (tm *TradeManager) AcceptTrade(targetID int32) (*TradeSession, error) {
	tm.mu.Lock()
	defer tm.mu.Unlock()

	requesterID, exists := tm.requests[targetID]
	if !exists {
		return nil, fmt.Errorf("no pending trade request")
	}
	delete(tm.requests, targetID)

	if _, exists := tm.sessions[requesterID]; exists {
		return nil, fmt.Errorf("requester is already trading")
	}

	session := NewTradeSession(requesterID, targetID)
	tm.sessions[requesterID] = session
	tm.sessions[targetID] = session
	return session, nil
}

// DeclineTrade declines a trade request.
func (tm *TradeManager) DeclineTrade(targetID int32) {
	tm.mu.Lock()
	defer tm.mu.Unlock()
	delete(tm.requests, targetID)
}

// GetSession returns the trade session for a player.
func (tm *TradeManager) GetSession(playerID int32) *TradeSession {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	return tm.sessions[playerID]
}

// EndTrade removes a trade session.
func (tm *TradeManager) EndTrade(playerID int32) {
	tm.mu.Lock()
	defer tm.mu.Unlock()

	session, exists := tm.sessions[playerID]
	if !exists {
		return
	}
	delete(tm.sessions, session.Player1ID)
	delete(tm.sessions, session.Player2ID)
}

// HasPendingRequest checks if a player has a pending trade request.
func (tm *TradeManager) HasPendingRequest(targetID int32) bool {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	_, exists := tm.requests[targetID]
	return exists
}

// GetRequester returns the requester ID for a pending trade.
func (tm *TradeManager) GetRequester(targetID int32) (int32, bool) {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	id, exists := tm.requests[targetID]
	return id, exists
}
