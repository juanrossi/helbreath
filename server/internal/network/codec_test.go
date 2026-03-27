package network

import (
	"testing"

	pb "github.com/juanrossi/hbonline/server/pkg/proto"
	"google.golang.org/protobuf/proto"
)

func TestEncodeDecodLoginRequest(t *testing.T) {
	req := &pb.LoginRequest{
		Username: "testuser",
		Password: "password123",
		Register: true,
	}

	data, err := Encode(MsgLoginRequest, req)
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	if data[0] != MsgLoginRequest {
		t.Errorf("First byte should be MsgLoginRequest (0x01), got 0x%02x", data[0])
	}

	msgType, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}
	if msgType != MsgLoginRequest {
		t.Errorf("Expected message type 0x01, got 0x%02x", msgType)
	}

	decoded := msg.(*pb.LoginRequest)
	if decoded.Username != "testuser" {
		t.Errorf("Expected username=testuser, got %s", decoded.Username)
	}
	if decoded.Password != "password123" {
		t.Errorf("Expected password=password123, got %s", decoded.Password)
	}
	if !decoded.Register {
		t.Error("Expected register=true")
	}
}

func TestEncodeDecodeMotionRequest(t *testing.T) {
	req := &pb.MotionRequest{
		Direction: 3,
		Action:    1,
		Position:  &pb.Vec2{X: 50, Y: 60},
	}

	data, err := Encode(MsgMotionRequest, req)
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}

	decoded := msg.(*pb.MotionRequest)
	if decoded.Direction != 3 {
		t.Errorf("Expected direction=3, got %d", decoded.Direction)
	}
	if decoded.Action != 1 {
		t.Errorf("Expected action=1, got %d", decoded.Action)
	}
	if decoded.Position.X != 50 || decoded.Position.Y != 60 {
		t.Errorf("Expected position (50,60), got (%d,%d)", decoded.Position.X, decoded.Position.Y)
	}
}

func TestEncodeDecodeAttackRequest(t *testing.T) {
	req := &pb.MotionRequest{
		Direction: 5,
		Action:    3,
		TargetId:  42,
	}

	data, err := Encode(MsgAttackRequest, req)
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}

	decoded := msg.(*pb.MotionRequest)
	if decoded.TargetId != 42 {
		t.Errorf("Expected targetId=42, got %d", decoded.TargetId)
	}
}

func TestEncodeDecodeChatRequest(t *testing.T) {
	req := &pb.ChatRequest{
		Type:    1,
		Message: "Hello World!",
		Target:  "player2",
	}

	data, err := Encode(MsgChatRequest, req)
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}

	decoded := msg.(*pb.ChatRequest)
	if decoded.Message != "Hello World!" {
		t.Errorf("Expected 'Hello World!', got %q", decoded.Message)
	}
}

func TestEncodeDecodeItemRequests(t *testing.T) {
	// ItemPickupRequest
	{
		req := &pb.ItemPickupRequest{GroundId: 100}
		data, _ := Encode(MsgItemPickupRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode ItemPickupRequest failed: %v", err)
		}
		decoded := msg.(*pb.ItemPickupRequest)
		if decoded.GroundId != 100 {
			t.Errorf("Expected groundId=100, got %d", decoded.GroundId)
		}
	}

	// ItemUseRequest
	{
		req := &pb.ItemUseRequest{SlotIndex: 5}
		data, _ := Encode(MsgItemUseRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode ItemUseRequest failed: %v", err)
		}
		decoded := msg.(*pb.ItemUseRequest)
		if decoded.SlotIndex != 5 {
			t.Errorf("Expected slotIndex=5, got %d", decoded.SlotIndex)
		}
	}

	// ItemEquipRequest
	{
		req := &pb.ItemEquipRequest{SlotIndex: 3, EquipSlot: 1}
		data, _ := Encode(MsgItemEquipRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode ItemEquipRequest failed: %v", err)
		}
		decoded := msg.(*pb.ItemEquipRequest)
		if decoded.SlotIndex != 3 || decoded.EquipSlot != 1 {
			t.Errorf("Expected slot=3 equip=1, got %d %d", decoded.SlotIndex, decoded.EquipSlot)
		}
	}

	// ItemDropRequest
	{
		req := &pb.ItemDropRequest{SlotIndex: 2, Count: 10}
		data, _ := Encode(MsgItemDropRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode ItemDropRequest failed: %v", err)
		}
		decoded := msg.(*pb.ItemDropRequest)
		if decoded.Count != 10 {
			t.Errorf("Expected count=10, got %d", decoded.Count)
		}
	}

	// ShopBuyRequest
	{
		req := &pb.ShopBuyRequest{NpcId: 50, ItemId: 1, Count: 1}
		data, _ := Encode(MsgShopBuyRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode ShopBuyRequest failed: %v", err)
		}
		decoded := msg.(*pb.ShopBuyRequest)
		if decoded.NpcId != 50 || decoded.ItemId != 1 {
			t.Errorf("Expected npcId=50 itemId=1, got %d %d", decoded.NpcId, decoded.ItemId)
		}
	}

	// ShopSellRequest
	{
		req := &pb.ShopSellRequest{NpcId: 50, SlotIndex: 3, Count: 1}
		data, _ := Encode(MsgShopSellRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode ShopSellRequest failed: %v", err)
		}
		decoded := msg.(*pb.ShopSellRequest)
		if decoded.SlotIndex != 3 {
			t.Errorf("Expected slotIndex=3, got %d", decoded.SlotIndex)
		}
	}

	// StatAllocRequest
	{
		req := &pb.StatAllocRequest{StatType: 1, Points: 3}
		data, _ := Encode(MsgStatAllocRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode StatAllocRequest failed: %v", err)
		}
		decoded := msg.(*pb.StatAllocRequest)
		if decoded.StatType != 1 || decoded.Points != 3 {
			t.Errorf("Expected stat=1 points=3, got %d %d", decoded.StatType, decoded.Points)
		}
	}
}

func TestDecodeEmpty(t *testing.T) {
	_, _, err := Decode([]byte{})
	if err == nil {
		t.Error("Should fail on empty data")
	}
}

func TestDecodeUnknownType(t *testing.T) {
	_, _, err := Decode([]byte{0xFF, 0x00})
	if err == nil {
		t.Error("Should fail on unknown message type")
	}
}

func TestEncodeDecodeSpellCastRequest(t *testing.T) {
	req := &pb.SpellCastRequest{
		SpellId:        3,
		TargetId:       42,
		TargetPosition: &pb.Vec2{X: 10, Y: 20},
	}
	data, err := Encode(MsgSpellCastRequest, req)
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}
	decoded := msg.(*pb.SpellCastRequest)
	if decoded.SpellId != 3 {
		t.Errorf("Expected spellId=3, got %d", decoded.SpellId)
	}
	if decoded.TargetId != 42 {
		t.Errorf("Expected targetId=42, got %d", decoded.TargetId)
	}
}

func TestEncodeDecodeLearnSpellRequest(t *testing.T) {
	req := &pb.LearnSpellRequest{SpellId: 20}
	data, _ := Encode(MsgLearnSpellRequest, req)
	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}
	decoded := msg.(*pb.LearnSpellRequest)
	if decoded.SpellId != 20 {
		t.Errorf("Expected spellId=20, got %d", decoded.SpellId)
	}
}

func TestEncodeDecodeSkillUseRequest(t *testing.T) {
	req := &pb.SkillUseRequest{
		SkillId:        6,
		TargetPosition: &pb.Vec2{X: 50, Y: 60},
	}
	data, _ := Encode(MsgSkillUseRequest, req)
	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}
	decoded := msg.(*pb.SkillUseRequest)
	if decoded.SkillId != 6 {
		t.Errorf("Expected skillId=6, got %d", decoded.SkillId)
	}
}

func TestEncodeDecodeCraftRequest(t *testing.T) {
	req := &pb.CraftRequest{RecipeId: 10}
	data, _ := Encode(MsgCraftRequest, req)
	_, msg, err := Decode(data)
	if err != nil {
		t.Fatalf("Decode failed: %v", err)
	}
	decoded := msg.(*pb.CraftRequest)
	if decoded.RecipeId != 10 {
		t.Errorf("Expected recipeId=10, got %d", decoded.RecipeId)
	}
}

func TestEncodeDecodeSocialRequests(t *testing.T) {
	// FactionSelectRequest
	{
		req := &pb.FactionSelectRequest{Side: 1}
		data, _ := Encode(MsgFactionSelectRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode FactionSelectRequest failed: %v", err)
		}
		decoded := msg.(*pb.FactionSelectRequest)
		if decoded.Side != 1 {
			t.Errorf("Expected side=1, got %d", decoded.Side)
		}
	}

	// GuildCreateRequest
	{
		req := &pb.GuildCreateRequest{Name: "TestGuild"}
		data, _ := Encode(MsgGuildCreateRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode GuildCreateRequest failed: %v", err)
		}
		decoded := msg.(*pb.GuildCreateRequest)
		if decoded.Name != "TestGuild" {
			t.Errorf("Expected name=TestGuild, got %s", decoded.Name)
		}
	}

	// GuildActionRequest
	{
		req := &pb.GuildActionRequest{Action: 1, TargetName: "Player1"}
		data, _ := Encode(MsgGuildActionRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode GuildActionRequest failed: %v", err)
		}
		decoded := msg.(*pb.GuildActionRequest)
		if decoded.Action != 1 || decoded.TargetName != "Player1" {
			t.Errorf("Expected action=1 target=Player1, got %d %s", decoded.Action, decoded.TargetName)
		}
	}

	// PartyActionRequest
	{
		req := &pb.PartyActionRequest{Action: 1, TargetName: "Player2"}
		data, _ := Encode(MsgPartyActionRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode PartyActionRequest failed: %v", err)
		}
		decoded := msg.(*pb.PartyActionRequest)
		if decoded.Action != 1 || decoded.TargetName != "Player2" {
			t.Errorf("Expected action=1 target=Player2, got %d %s", decoded.Action, decoded.TargetName)
		}
	}

	// PartyInviteResponse
	{
		req := &pb.PartyInviteResponse{Accept: true}
		data, _ := Encode(MsgPartyInviteResponse, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode PartyInviteResponse failed: %v", err)
		}
		decoded := msg.(*pb.PartyInviteResponse)
		if !decoded.Accept {
			t.Error("Expected accept=true")
		}
	}

	// TradeRequest
	{
		req := &pb.TradeRequest{TargetId: 42}
		data, _ := Encode(MsgTradeRequest, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode TradeRequest failed: %v", err)
		}
		decoded := msg.(*pb.TradeRequest)
		if decoded.TargetId != 42 {
			t.Errorf("Expected targetId=42, got %d", decoded.TargetId)
		}
	}

	// TradeResponse
	{
		req := &pb.TradeResponse{Accept: true}
		data, _ := Encode(MsgTradeResponse, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode TradeResponse failed: %v", err)
		}
		decoded := msg.(*pb.TradeResponse)
		if !decoded.Accept {
			t.Error("Expected accept=true")
		}
	}

	// TradeSetItem
	{
		req := &pb.TradeSetItem{InventorySlot: 5, Count: 3}
		data, _ := Encode(MsgTradeSetItem, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode TradeSetItem failed: %v", err)
		}
		decoded := msg.(*pb.TradeSetItem)
		if decoded.InventorySlot != 5 || decoded.Count != 3 {
			t.Errorf("Expected slot=5 count=3, got %d %d", decoded.InventorySlot, decoded.Count)
		}
	}

	// TradeSetGold
	{
		req := &pb.TradeSetGold{Gold: 1000}
		data, _ := Encode(MsgTradeSetGold, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode TradeSetGold failed: %v", err)
		}
		decoded := msg.(*pb.TradeSetGold)
		if decoded.Gold != 1000 {
			t.Errorf("Expected gold=1000, got %d", decoded.Gold)
		}
	}

	// TradeConfirm
	{
		req := &pb.TradeConfirm{Confirmed: true}
		data, _ := Encode(MsgTradeConfirm, req)
		_, msg, err := Decode(data)
		if err != nil {
			t.Fatalf("Decode TradeConfirm failed: %v", err)
		}
		decoded := msg.(*pb.TradeConfirm)
		if !decoded.Confirmed {
			t.Error("Expected confirmed=true")
		}
	}
}

func TestEncodeServerMessages(t *testing.T) {
	// Test encoding server->client messages
	{
		msg := &pb.MotionEvent{
			ObjectId:  1,
			OwnerType: 1,
			Action:    1,
			Direction: 3,
			Position:  &pb.Vec2{X: 10, Y: 20},
			Speed:     490,
			Name:      "Test",
		}
		data, err := Encode(MsgMotionEvent, msg)
		if err != nil {
			t.Fatalf("Encode MotionEvent failed: %v", err)
		}
		if data[0] != MsgMotionEvent {
			t.Errorf("Expected type byte 0x83, got 0x%02x", data[0])
		}
	}

	{
		msg := &pb.DamageEvent{
			AttackerId: 1, TargetId: 2, Damage: 15, Critical: true,
		}
		data, err := Encode(MsgDamageEvent, msg)
		if err != nil {
			t.Fatalf("Encode DamageEvent failed: %v", err)
		}
		if data[0] != MsgDamageEvent {
			t.Errorf("Expected type byte 0x8F, got 0x%02x", data[0])
		}
	}

	{
		msg := &pb.InventoryUpdate{Gold: 500}
		data, err := Encode(MsgInventoryUpdate, msg)
		if err != nil {
			t.Fatalf("Encode InventoryUpdate failed: %v", err)
		}
		if data[0] != MsgInventoryUpdate {
			t.Errorf("Expected type byte 0x93, got 0x%02x", data[0])
		}
	}
}

func TestEncodeServerSocialMessages(t *testing.T) {
	tests := []struct {
		name    string
		msgType byte
		msg     proto.Message
	}{
		{"FactionSelectResponse", MsgFactionSelectResponse, &pb.FactionSelectResponse{Success: true, Side: 1}},
		{"GuildInfo", MsgGuildInfo, &pb.GuildInfo{GuildId: 1, Name: "TestGuild", Side: 1}},
		{"GuildActionResponse", MsgGuildActionResponse, &pb.GuildActionResponse{Success: true, Message: "ok"}},
		{"PartyUpdate", MsgPartyUpdate, &pb.PartyUpdate{LeaderObjectId: 100}},
		{"PartyInvite", MsgPartyInviteMsg, &pb.PartyInvite{InviterObjectId: 100, InviterName: "Leader"}},
		{"PartyActionResponse", MsgPartyActionResponse, &pb.PartyActionResponse{Success: true}},
		{"TradeIncoming", MsgTradeIncoming, &pb.TradeIncoming{RequesterId: 1, RequesterName: "P1"}},
		{"TradeUpdate", MsgTradeUpdate, &pb.TradeUpdate{MyGold: 100, TheirGold: 200}},
		{"TradeComplete", MsgTradeComplete, &pb.TradeComplete{Success: true, Message: "done"}},
		{"PKStatusUpdate", MsgPKStatusUpdate, &pb.PKStatusUpdate{PkCount: 3, EkCount: 5, Criminal: true}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			data, err := Encode(tt.msgType, tt.msg)
			if err != nil {
				t.Fatalf("Encode %s failed: %v", tt.name, err)
			}
			if data[0] != tt.msgType {
				t.Errorf("Expected type 0x%02x, got 0x%02x", tt.msgType, data[0])
			}
		})
	}
}
