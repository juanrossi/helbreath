package trade

import (
	"testing"
)

func TestNewTradeSession(t *testing.T) {
	s := NewTradeSession(1, 2)
	if s.Player1ID != 1 || s.Player2ID != 2 {
		t.Fatal("unexpected player IDs")
	}
	if len(s.Items1) != 0 || len(s.Items2) != 0 {
		t.Fatal("expected empty items")
	}
}

func TestSetItem(t *testing.T) {
	s := NewTradeSession(1, 2)
	err := s.SetItem(1, 0, 100, "Sword", 1)
	if err != nil {
		t.Fatal(err)
	}
	items := s.GetPlayerItems(1)
	if len(items) != 1 || items[0].Name != "Sword" {
		t.Fatal("expected 1 item")
	}
}

func TestSetItemReplace(t *testing.T) {
	s := NewTradeSession(1, 2)
	s.SetItem(1, 0, 100, "Sword", 1)
	s.SetItem(1, 0, 101, "Shield", 1)
	items := s.GetPlayerItems(1)
	if len(items) != 1 || items[0].Name != "Shield" {
		t.Fatal("expected item to be replaced")
	}
}

func TestSetItemRemove(t *testing.T) {
	s := NewTradeSession(1, 2)
	s.SetItem(1, 0, 100, "Sword", 1)
	s.SetItem(1, 0, 100, "Sword", 0) // count 0 = remove
	items := s.GetPlayerItems(1)
	if len(items) != 0 {
		t.Fatal("expected item to be removed")
	}
}

func TestSetItemFull(t *testing.T) {
	s := NewTradeSession(1, 2)
	for i := 0; i < MaxTradeSlots; i++ {
		s.SetItem(1, i, 100+i, "Item", 1)
	}
	err := s.SetItem(1, MaxTradeSlots, 200, "Extra", 1)
	if err == nil {
		t.Fatal("expected error when trade slots full")
	}
}

func TestSetGold(t *testing.T) {
	s := NewTradeSession(1, 2)
	s.SetGold(1, 500)
	if s.GetPlayerGold(1) != 500 {
		t.Fatal("expected 500 gold")
	}
	if s.GetPlayerGold(2) != 0 {
		t.Fatal("expected 0 gold for player 2")
	}
}

func TestConfirm(t *testing.T) {
	s := NewTradeSession(1, 2)
	s.Confirm(1, true)
	if s.BothConfirmed() {
		t.Fatal("should not be both confirmed")
	}
	s.Confirm(2, true)
	if !s.BothConfirmed() {
		t.Fatal("should be both confirmed")
	}
}

func TestConfirmResetsOnItemChange(t *testing.T) {
	s := NewTradeSession(1, 2)
	s.Confirm(1, true)
	s.Confirm(2, true)
	s.SetItem(1, 0, 100, "Sword", 1)
	if s.BothConfirmed() {
		t.Fatal("confirmations should reset on item change")
	}
}

func TestConfirmResetsOnGoldChange(t *testing.T) {
	s := NewTradeSession(1, 2)
	s.Confirm(1, true)
	s.Confirm(2, true)
	s.SetGold(1, 100)
	if s.BothConfirmed() {
		t.Fatal("confirmations should reset on gold change")
	}
}

func TestGetOtherPlayer(t *testing.T) {
	s := NewTradeSession(1, 2)
	if s.GetOtherPlayer(1) != 2 {
		t.Fatal("expected player 2")
	}
	if s.GetOtherPlayer(2) != 1 {
		t.Fatal("expected player 1")
	}
}

func TestSetItemInvalidPlayer(t *testing.T) {
	s := NewTradeSession(1, 2)
	err := s.SetItem(3, 0, 100, "Sword", 1)
	if err == nil {
		t.Fatal("expected error for invalid player")
	}
}

func TestSetGoldInvalidPlayer(t *testing.T) {
	s := NewTradeSession(1, 2)
	err := s.SetGold(3, 100)
	if err == nil {
		t.Fatal("expected error for invalid player")
	}
}

// TradeManager tests

func TestManagerRequestAccept(t *testing.T) {
	tm := NewTradeManager()
	if err := tm.RequestTrade(1, 2); err != nil {
		t.Fatal(err)
	}
	if !tm.HasPendingRequest(2) {
		t.Fatal("expected pending request")
	}
	session, err := tm.AcceptTrade(2)
	if err != nil {
		t.Fatal(err)
	}
	if session.Player1ID != 1 || session.Player2ID != 2 {
		t.Fatal("unexpected session players")
	}
	if tm.GetSession(1) == nil || tm.GetSession(2) == nil {
		t.Fatal("expected both players in session")
	}
}

func TestManagerDecline(t *testing.T) {
	tm := NewTradeManager()
	tm.RequestTrade(1, 2)
	tm.DeclineTrade(2)
	if tm.HasPendingRequest(2) {
		t.Fatal("expected no pending request")
	}
}

func TestManagerEndTrade(t *testing.T) {
	tm := NewTradeManager()
	tm.RequestTrade(1, 2)
	tm.AcceptTrade(2)
	tm.EndTrade(1)
	if tm.GetSession(1) != nil || tm.GetSession(2) != nil {
		t.Fatal("expected sessions to be cleared")
	}
}

func TestManagerAlreadyTrading(t *testing.T) {
	tm := NewTradeManager()
	tm.RequestTrade(1, 2)
	tm.AcceptTrade(2)
	err := tm.RequestTrade(1, 3)
	if err == nil {
		t.Fatal("expected error: already trading")
	}
}

func TestManagerGetRequester(t *testing.T) {
	tm := NewTradeManager()
	tm.RequestTrade(1, 2)
	id, ok := tm.GetRequester(2)
	if !ok || id != 1 {
		t.Fatal("expected requester 1")
	}
	_, ok = tm.GetRequester(3)
	if ok {
		t.Fatal("expected no requester for 3")
	}
}
