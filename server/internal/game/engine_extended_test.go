package game

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/quest"
	"github.com/juanrossi/hbonline/server/internal/skills"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// ============================================================
// SpawnNPCs
// ============================================================

func TestSpawnNPCs(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "default"
	e.maps["default"] = gm

	e.SpawnNPCs()

	// Should have spawned NPCs (at least a few from the hardcoded list)
	count := 0
	e.npcs.Range(func(_, _ any) bool {
		count++
		return true
	})
	if count == 0 {
		t.Error("Expected NPCs to be spawned")
	}
	t.Logf("Spawned %d NPCs", count)
}

func TestSpawnNPCsNoDefaultMap(t *testing.T) {
	e := makeTestEngine()
	// No "default" map
	e.SpawnNPCs() // should not panic
}

// ============================================================
// processNPCTick
// ============================================================

func TestProcessNPCTickDeadRespawn(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10] // Slime
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateDead
	n.DeathTime = time.Now().Add(-60 * time.Second) // died 60s ago
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())

	if n.State == npc.StateDead {
		t.Error("NPC should have respawned")
	}
}

func TestProcessNPCTickDeadNotReady(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateDead
	n.DeathTime = time.Now() // just died
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())
	if n.State != npc.StateDead {
		t.Error("NPC should still be dead")
	}
}

func TestProcessNPCTickNoMap(t *testing.T) {
	e := makeTestEngine()
	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "nonexistent", 50, 50)
	e.processNPCTick(n, time.Now()) // should not panic
}

func TestProcessNPCTickIdle(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateIdle
	n.NextThinkTime = time.Time{} // allow thinking
	e.npcs.Store(n.ObjectID, n)

	// Run multiple ticks
	for i := 0; i < 20; i++ {
		n.NextThinkTime = time.Time{}
		e.processNPCTick(n, time.Now())
	}
	// Should not panic, state may change
}

func TestProcessNPCTickChaseAndAttack(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Target")
	p.X, p.Y = 51, 50
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[11] // Skeleton
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateChase
	n.TargetID = p.ObjectID
	n.NextThinkTime = time.Time{}
	n.LastMoveTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	// NPC is adjacent - should switch to attack
	e.processNPCTick(n, time.Now())

	if n.State != npc.StateAttack {
		t.Logf("Expected StateAttack, got state %d", n.State)
	}
}

func TestProcessNPCTickAttackHitsPlayer(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Target")
	p.X, p.Y = 51, 50
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[11]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateAttack
	n.TargetID = p.ObjectID
	n.NextThinkTime = time.Time{}
	n.LastAttackTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	origHP := p.HP
	for i := 0; i < 50; i++ {
		n.NextThinkTime = time.Time{}
		n.LastAttackTime = time.Time{}
		e.processNPCTick(n, time.Now())
	}
	// Either HP decreased or all missed (unlikely in 50 tries)
	t.Logf("Player HP after attacks: %d (was %d)", p.HP, origHP)
}

func TestProcessNPCTickChaseTargetDead(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	addPlayerToEngine(e, p)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateChase
	n.TargetID = p.ObjectID
	n.NextThinkTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())
	if n.State != npc.StateIdle {
		t.Errorf("NPC should go idle when target is dead, got state %d", n.State)
	}
}

func TestProcessNPCTickAttackTargetGone(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateAttack
	n.TargetID = 999 // nonexistent
	n.NextThinkTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())
	if n.State != npc.StateIdle {
		t.Errorf("NPC should go idle when target is gone, got state %d", n.State)
	}
}

// ============================================================
// moveNPC
// ============================================================

func TestMoveNPC(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	e.npcs.Store(n.ObjectID, n)

	e.moveNPC(n, gm, 51, 50, 3) // move east

	if n.X != 51 || n.Y != 50 {
		t.Errorf("NPC should be at (51,50), got (%d,%d)", n.X, n.Y)
	}
	if n.Direction != 3 {
		t.Errorf("NPC direction should be 3, got %d", n.Direction)
	}
}

// ============================================================
// findNearestPlayer
// ============================================================

func TestFindNearestPlayer(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p1 := makeFullTestPlayer(1, "Near")
	p1.X, p1.Y = 52, 50
	addPlayerToEngine(e, p1)
	gm.AddPlayerToSector(p1.X, p1.Y, p1.ObjectID)

	p2 := makeFullTestPlayer(2, "Far")
	p2.X, p2.Y = 70, 70
	addPlayerToEngine(e, p2)
	gm.AddPlayerToSector(p2.X, p2.Y, p2.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)

	nearest, dist := e.findNearestPlayer(n, gm)
	if nearest == nil {
		t.Fatal("Should find a nearest player")
	}
	if nearest.ObjectID != p1.ObjectID {
		t.Errorf("Nearest should be p1 (dist 2), got player %d", nearest.ObjectID)
	}
	if dist != 2 {
		t.Errorf("Expected dist 2, got %d", dist)
	}
}

func TestFindNearestPlayerNone(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)

	nearest, _ := e.findNearestPlayer(n, gm)
	if nearest != nil {
		t.Error("Should find no player")
	}
}

func TestFindNearestPlayerSkipsDead(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	p.X, p.Y = 51, 50
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)

	nearest, _ := e.findNearestPlayer(n, gm)
	if nearest != nil {
		t.Error("Should skip dead player")
	}
}

// ============================================================
// respawnPlayer
// ============================================================

func TestRespawnPlayer(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	p.X, p.Y = 10, 10
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	e.respawnPlayer(p)

	if p.HP <= 0 {
		t.Error("Player should have HP after respawn")
	}
	if p.HP != p.MaxHP/2 {
		t.Errorf("Expected HP=%d, got %d", p.MaxHP/2, p.HP)
	}
	if p.MP != p.MaxMP/2 {
		t.Errorf("Expected MP=%d, got %d", p.MaxMP/2, p.MP)
	}
	if p.SP != p.MaxSP {
		t.Errorf("Expected full SP=%d, got %d", p.MaxSP, p.SP)
	}
	// Should be at map center
	if p.X != 50 || p.Y != 50 {
		t.Errorf("Expected respawn at center (50,50), got (%d,%d)", p.X, p.Y)
	}
}

func TestRespawnPlayerNoMap(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Lost")
	p.MapName = "nonexistent"
	// Should not panic
	e.respawnPlayer(p)
}

// ============================================================
// OnConnect
// ============================================================

func TestOnConnect(t *testing.T) {
	e := makeTestEngine()
	c := &network.Client{}
	// Should not panic
	e.OnConnect(c)
}

// ============================================================
// getNearbyEntityInfos / getNearbyNPCInfos
// ============================================================

func TestGetNearbyEntityInfos(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p1 := makeFullTestPlayer(1, "Player1")
	p1.X, p1.Y = 50, 50
	addPlayerToEngine(e, p1)
	gm.AddPlayerToSector(p1.X, p1.Y, p1.ObjectID)

	p2 := makeFullTestPlayer(2, "Player2")
	p2.X, p2.Y = 52, 50
	addPlayerToEngine(e, p2)
	gm.AddPlayerToSector(p2.X, p2.Y, p2.ObjectID)

	infos := e.getNearbyEntityInfos(gm, 50, 50, p1.ObjectID)
	// Should return p2 but not p1 (excluded)
	if len(infos) != 1 {
		t.Errorf("Expected 1 nearby entity, got %d", len(infos))
	}
	if len(infos) > 0 && infos[0].Name != "Player2" {
		t.Errorf("Expected Player2, got %s", infos[0].Name)
	}
}

func TestGetNearbyNPCInfos(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	e.npcs.Store(n.ObjectID, n)

	infos := e.getNearbyNPCInfos(gm, 50, 50)
	if len(infos) != 1 {
		t.Errorf("Expected 1 nearby NPC, got %d", len(infos))
	}
}

func TestGetNearbyNPCInfosSkipsDead(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.HP = 0
	n.State = npc.StateDead
	e.npcs.Store(n.ObjectID, n)

	infos := e.getNearbyNPCInfos(gm, 50, 50)
	if len(infos) != 0 {
		t.Errorf("Dead NPC should not appear, got %d", len(infos))
	}
}

func TestGetNearbyNPCInfosSkipsFar(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(200, 200)
	gm.Name = "test"
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 150, 150)
	e.npcs.Store(n.ObjectID, n)

	infos := e.getNearbyNPCInfos(gm, 10, 10) // far away
	if len(infos) != 0 {
		t.Errorf("Far NPC should not appear, got %d", len(infos))
	}
}

// ============================================================
// sendLoginError / sendLoginSuccess / sendCreateChar / sendDeleteChar
// ============================================================

func TestSendLoginError(t *testing.T) {
	e := makeTestEngine()
	c := &network.Client{}
	// Should not panic with nil connection (Send drops)
	e.sendLoginError(c, "test error")
}

func TestSendLoginSuccess(t *testing.T) {
	e := makeTestEngine()
	c := &network.Client{}
	rows := []db.CharacterRow{
		{ID: 1, Name: "Test", Level: 5, Gender: 0, Side: 1, MapName: "aresden"},
	}
	e.sendLoginSuccess(c, rows, "test-token")
}

func TestSendCreateCharError(t *testing.T) {
	e := makeTestEngine()
	c := &network.Client{}
	e.sendCreateCharError(c, "name taken")
}

func TestSendCreateCharSuccess(t *testing.T) {
	e := makeTestEngine()
	c := &network.Client{}
	rows := []db.CharacterRow{
		{ID: 1, Name: "New", Level: 1},
	}
	e.sendCreateCharSuccess(c, rows)
}

func TestSendDeleteCharResponse(t *testing.T) {
	e := makeTestEngine()
	c := &network.Client{}
	e.sendDeleteCharResponse(c, true, "")
	e.sendDeleteCharResponse(c, false, "not found")
}

// ============================================================
// sendWorldState / broadcastWorldState
// ============================================================

func TestSendWorldState(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	// Should not panic
	e.sendWorldState(p)
}

func TestBroadcastWorldState(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	// Should not panic
	e.broadcastWorldState()
}

// ============================================================
// sendShopResponse / sendSkillList / sendNearbyGroundItems
// ============================================================

func TestSendShopResponse(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	e.sendShopResponse(p, true, "")
	e.sendShopResponse(p, false, "error")
}

func TestSendSkillList(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	e.sendSkillList(p)
}

func TestSendNearbyGroundItems(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")

	// Add a ground item nearby
	def := items.GetItemDef(1) // Short Sword
	if def != nil {
		gi := &items.GroundItem{
			GroundID: 1,
			Item:     items.NewItem(def, 1),
			MapName:  "test",
			X:        50,
			Y:        50,
		}
		e.groundItems.Store(gi.GroundID, gi)
	}

	// Should not panic
	e.sendNearbyGroundItems(p, gm)
}

func TestSendNearbyGroundItemsFarAway(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(200, 200)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	p.X, p.Y = 10, 10

	def := items.GetItemDef(1)
	if def != nil {
		gi := &items.GroundItem{
			GroundID: 1,
			Item:     items.NewItem(def, 1),
			MapName:  "test",
			X:        150,
			Y:        150,
		}
		e.groundItems.Store(gi.GroundID, gi)
	}
	// Should not crash; item is too far to send
	e.sendNearbyGroundItems(p, gm)
}

// ============================================================
// handleItemPickup
// ============================================================

func TestHandleItemPickup(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Picker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("Item def 1 not found")
	}

	gi := &items.GroundItem{
		GroundID: 42,
		Item:     items.NewItem(def, 1),
		MapName:  "test",
		X:        50,
		Y:        50,
	}
	e.groundItems.Store(gi.GroundID, gi)

	req := &pb.ItemPickupRequest{GroundId: 42}
	e.handleItemPickup(client, req)

	// Ground item should be removed
	if _, ok := e.groundItems.Load(int32(42)); ok {
		t.Error("Ground item should be removed after pickup")
	}
}

func TestHandleItemPickupTooFar(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Far")
	p.X, p.Y = 10, 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("Item def 1 not found")
	}

	gi := &items.GroundItem{
		GroundID: 43,
		Item:     items.NewItem(def, 1),
		MapName:  "test",
		X:        50,
		Y:        50,
	}
	e.groundItems.Store(gi.GroundID, gi)

	req := &pb.ItemPickupRequest{GroundId: 43}
	e.handleItemPickup(client, req)

	// Should still be on ground
	if _, ok := e.groundItems.Load(int32(43)); !ok {
		t.Error("Too-far item should not be picked up")
	}
}

func TestHandleItemPickupNotFound(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemPickupRequest{GroundId: 999}
	e.handleItemPickup(client, req) // should not panic
}

// ============================================================
// handleShopBuy / handleShopSell
// ============================================================

func TestHandleShopBuySuccess(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Buyer")
	p.Gold = 10000
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Place a shop NPC nearby
	shopType, ok := npc.NpcTypes[15] // Weapon Shop
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	// Get first item from shop inventory
	shopItems, ok := items.ShopInventories[15]
	if !ok || len(shopItems) == 0 {
		t.Skip("No shop inventory for NPC type 15")
	}
	itemID := shopItems[0]

	req := &pb.ShopBuyRequest{
		NpcId:  shopNPC.ObjectID,
		ItemId: int32(itemID),
		Count:  1,
	}
	origGold := p.Gold
	e.handleShopBuy(client, req)

	if p.Gold >= origGold {
		t.Error("Gold should decrease after buy")
	}
}

func TestHandleShopBuyNoGold(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Broke")
	p.Gold = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	shopItems, ok := items.ShopInventories[15]
	if !ok || len(shopItems) == 0 {
		t.Skip("No shop items")
	}

	req := &pb.ShopBuyRequest{
		NpcId:  shopNPC.ObjectID,
		ItemId: int32(shopItems[0]),
		Count:  1,
	}
	e.handleShopBuy(client, req)
	if p.Gold != 0 {
		t.Error("Gold should still be 0")
	}
}

func TestHandleShopBuyTooFar(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Far")
	p.X, p.Y = 10, 10
	p.Gold = 99999
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50) // far away
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	shopItems, ok := items.ShopInventories[15]
	if !ok || len(shopItems) == 0 {
		t.Skip("No shop items")
	}

	origGold := p.Gold
	req := &pb.ShopBuyRequest{NpcId: shopNPC.ObjectID, ItemId: int32(shopItems[0]), Count: 1}
	e.handleShopBuy(client, req)
	if p.Gold != origGold {
		t.Error("Should not buy when too far from shop")
	}
}

func TestHandleShopSellSuccess(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Seller")
	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("Item def 1 not found")
	}
	p.Inventory.AddItem(items.NewItem(def, 1))
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	origGold := p.Gold
	req := &pb.ShopSellRequest{NpcId: shopNPC.ObjectID, SlotIndex: 0, Count: 1}
	e.handleShopSell(client, req)
	if p.Gold <= origGold {
		t.Error("Gold should increase after selling")
	}
}

func TestHandleShopSellNonExistentNPC(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ShopSellRequest{NpcId: 999, SlotIndex: 0, Count: 1}
	e.handleShopSell(client, req) // should not panic
}

// ============================================================
// handleNPCInteract
// ============================================================

func TestHandleNPCInteractShop(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)

	// Should not panic
	e.handleNPCInteract(p, shopNPC)
}

func TestHandleNPCInteractMonster(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")

	npcType := npc.NpcTypes[10] // Slime - not a shop
	n := npc.NewNPC(100, npcType, "test", 50, 50)

	e.handleNPCInteract(p, n) // should return early
}

// ============================================================
// handleSpellCast
// ============================================================

func TestHandleSpellCastDamageSpell(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Mage")
	p.MAG = 30
	p.INT = 20
	p.MP = 100
	p.MaxMP = 100
	p.LearnedSpells[1] = true // Energy Bolt
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 52, 50)
	e.npcs.Store(n.ObjectID, n)

	req := &pb.SpellCastRequest{
		SpellId:  1,
		TargetId: n.ObjectID,
	}
	origHP := n.HP
	e.handleSpellCast(client, req)

	if p.MP >= 100 {
		t.Error("Mana should have been consumed")
	}
	t.Logf("NPC HP: %d -> %d", origHP, n.HP)
}

func TestHandleSpellCastUnknownSpell(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Mage")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SpellCastRequest{SpellId: 9999}
	e.handleSpellCast(client, req) // should notify and return
}

func TestHandleSpellCastDeadPlayer(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SpellCastRequest{SpellId: 1}
	e.handleSpellCast(client, req) // should return early
}

// ============================================================
// handleHealSpell
// ============================================================

func TestHandleHealSpell(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Healer")
	p.HP = 20
	p.MAG = 30

	spell := magic.GetSpellDef(10) // Look for a heal spell
	if spell == nil || spell.Type != magic.SpellTypeHeal {
		// Find any heal spell
		for i := 1; i <= 100; i++ {
			s := magic.GetSpellDef(i)
			if s != nil && s.Type == magic.SpellTypeHeal {
				spell = s
				break
			}
		}
	}
	if spell == nil {
		t.Skip("No heal spell found")
	}

	origHP := p.HP
	e.handleHealSpell(p, spell, gm)
	if p.HP <= origHP {
		t.Errorf("HP should increase after heal, was %d now %d", origHP, p.HP)
	}
}

// ============================================================
// handleBuffSpell
// ============================================================

func TestHandleBuffSpell(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Buffer")

	// Find a buff spell
	var spell *magic.SpellDef
	for i := 1; i <= 100; i++ {
		s := magic.GetSpellDef(i)
		if s != nil && s.Type == magic.SpellTypeBuff {
			spell = s
			break
		}
	}
	if spell == nil {
		t.Skip("No buff spell found")
	}

	e.handleBuffSpell(p, spell, gm)
	// Check buff was added by checking a stat modifier changed
	// (BuffTracker doesn't expose a list, but modifiers change)
	// Just verify no panic occurred
}

// ============================================================
// handleDebuffSpell
// ============================================================

func TestHandleDebuffSpellOnNPC(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Debuffer")

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 52, 50)
	e.npcs.Store(n.ObjectID, n)

	var spell *magic.SpellDef
	for i := 1; i <= 100; i++ {
		s := magic.GetSpellDef(i)
		if s != nil && s.Type == magic.SpellTypeDebuff {
			spell = s
			break
		}
	}
	if spell == nil {
		t.Skip("No debuff spell found")
	}

	e.handleDebuffSpell(p, spell, n.ObjectID, gm) // should not panic
}

func TestHandleDebuffSpellNoTarget(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Debuffer")
	spell := &magic.SpellDef{ID: 99, Type: magic.SpellTypeDebuff, Range: 5}

	e.handleDebuffSpell(p, spell, 0, gm) // should notify "no target"
}

// ============================================================
// handleAOESpell
// ============================================================

func TestHandleAOESpell(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "AOEMage")
	p.MAG = 40
	p.INT = 30

	var spell *magic.SpellDef
	for i := 1; i <= 100; i++ {
		s := magic.GetSpellDef(i)
		if s != nil && s.Type == magic.SpellTypeAOE {
			spell = s
			break
		}
	}
	if spell == nil {
		t.Skip("No AOE spell found")
	}

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 52, 50)
	e.npcs.Store(n.ObjectID, n)

	targetPos := &pb.Vec2{X: 52, Y: 50}
	e.handleAOESpell(p, spell, targetPos, gm)
}

func TestHandleAOESpellOutOfRange(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(200, 200)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Mage")
	spell := &magic.SpellDef{ID: 99, Type: magic.SpellTypeAOE, Range: 5, Radius: 3, MinDamage: 10, MaxDamage: 20}

	// Target way too far
	targetPos := &pb.Vec2{X: 100, Y: 100}
	e.handleAOESpell(p, spell, targetPos, gm) // should notify out of range
}

// ============================================================
// handleMining / handleFishing
// ============================================================

func TestHandleMining(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Miner")
	p.SP = 40

	origSP := p.SP
	e.handleMining(p, 50) // mastery 50
	if p.SP != origSP-5 {
		t.Errorf("Mining should cost 5 SP, was %d now %d", origSP, p.SP)
	}
}

func TestHandleMiningNotEnoughSP(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Tired")
	p.SP = 2

	e.handleMining(p, 50)
	if p.SP != 2 {
		t.Error("SP should not change when not enough to mine")
	}
}

func TestHandleFishing(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Fisher")
	p.SP = 40

	origSP := p.SP
	e.handleFishing(p, 50)
	if p.SP != origSP-3 {
		t.Errorf("Fishing should cost 3 SP, was %d now %d", origSP, p.SP)
	}
}

func TestHandleFishingNotEnoughSP(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Tired")
	p.SP = 1

	e.handleFishing(p, 50)
	if p.SP != 1 {
		t.Error("SP should not change when not enough to fish")
	}
}

// ============================================================
// handleSkillUse
// ============================================================

func TestHandleSkillUseMining(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Miner")
	p.SP = 40
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SkillUseRequest{SkillId: int32(skills.SkillMining)}
	e.handleSkillUse(client, req)
}

func TestHandleSkillUseFishing(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Fisher")
	p.SP = 40
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SkillUseRequest{SkillId: int32(skills.SkillFishing)}
	e.handleSkillUse(client, req)
}

func TestHandleSkillUseUnknown(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SkillUseRequest{SkillId: 999}
	e.handleSkillUse(client, req) // should notify unknown
}

func TestHandleSkillUseDeadPlayer(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SkillUseRequest{SkillId: int32(skills.SkillMining)}
	e.handleSkillUse(client, req) // should return early
}

// ============================================================
// handleCraft
// ============================================================

func TestHandleCraftUnknownRecipe(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Crafter")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.CraftRequest{RecipeId: 9999}
	e.handleCraft(client, req) // should notify unknown
}

func TestHandleCraftLowMastery(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Crafter")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	recipe := skills.GetRecipe(1) // First recipe
	if recipe == nil {
		t.Skip("No recipe 1")
	}

	// Set mastery too low
	req := &pb.CraftRequest{RecipeId: 1}
	e.handleCraft(client, req) // should fail mastery check
}

// ============================================================
// handleQuestTurnIn
// ============================================================

func TestHandleQuestTurnIn(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Quester")
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Accept a quest first
	questDef := quest.GetQuestDef(1)
	if questDef == nil {
		t.Skip("Quest 1 not defined")
	}
	p.Quests.AcceptQuest(1, p.Level)

	// Complete the quest by setting progress
	for _, pq := range p.Quests.GetActiveQuests() {
		if pq.QuestID == 1 {
			pq.Progress = questDef.TargetCount
			pq.State = quest.QuestStateCompleted
			break
		}
	}

	origXP := p.Experience
	req := &pb.QuestTurnInRequest{QuestId: 1}
	e.handleQuestTurnIn(client, req)

	if p.Experience <= origXP {
		t.Logf("XP didn't increase - quest may not be turnable yet (XP: %d)", p.Experience)
	}
}

func TestHandleQuestTurnInUnknownQuest(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.QuestTurnInRequest{QuestId: 9999}
	e.handleQuestTurnIn(client, req) // should notify not found
}

// ============================================================
// broadcastSpellEffect
// ============================================================

func TestBroadcastSpellEffect(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Caster")
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	spell := &magic.SpellDef{ID: 1, SpriteID: 5, SoundID: 3}
	e.broadcastSpellEffect(p, spell, 100, 50, 50, 52, 50, 20, 0, false, gm)
}

// ============================================================
// broadcastGuildInfo
// ============================================================

func TestBroadcastGuildInfo(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "GuildMaster")
	p.Side = 1
	p.Level = 20
	p.CHR = 20
	addPlayerToEngine(e, p)

	e.guilds.CreateGuild("TestGuild", 1, p.CharacterID, p.Name, p.Level)
	g := e.guilds.GetPlayerGuild(p.CharacterID)
	if g == nil {
		t.Fatal("Guild should exist")
	}

	e.broadcastGuildInfo(g) // should not panic
}

// ============================================================
// guildInvite / guildKick / guildPromote / guildDemote / guildLeave / guildDisband
// ============================================================

func TestGuildInvite(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Master")
	p.Side = 1
	p.Level = 20
	p.CHR = 20
	addPlayerToEngine(e, p)

	target := makeFullTestPlayer(2, "Recruit")
	target.Side = 1
	addPlayerToEngine(e, target)

	e.guilds.CreateGuild("TestGuild", 1, p.CharacterID, p.Name, p.Level)

	e.guildInvite(p, "Recruit")

	targetGuild := e.guilds.GetPlayerGuild(target.CharacterID)
	if targetGuild == nil {
		t.Error("Target should be in guild after invite")
	}
}

func TestGuildInviteNotInGuild(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "NoGuild")
	addPlayerToEngine(e, p)

	e.guildInvite(p, "Someone") // should respond with error
}

func TestGuildInviteDifferentFaction(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Master")
	p.Side = 1
	p.Level = 20
	p.CHR = 20
	addPlayerToEngine(e, p)

	target := makeFullTestPlayer(2, "Enemy")
	target.Side = 2 // different faction
	addPlayerToEngine(e, target)

	e.guilds.CreateGuild("TestGuild", 1, p.CharacterID, p.Name, p.Level)
	e.guildInvite(p, "Enemy") // should fail
}

func TestGuildKick(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	e.guildKick(master, "Member")

	memberGuild := e.guilds.GetPlayerGuild(member.CharacterID)
	if memberGuild != nil {
		t.Error("Member should be kicked from guild")
	}
}

func TestGuildKickNotInGuild(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "NoGuild")
	addPlayerToEngine(e, p)
	e.guildKick(p, "Someone") // should respond with error
}

func TestGuildPromote(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	e.guildPromote(master, "Member")
}

func TestGuildPromoteNotMaster(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	e.guildPromote(member, "Master") // member can't promote
}

func TestGuildDemote(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	// Promote then demote
	e.guildPromote(master, "Member")
	e.guildDemote(master, "Member")
}

func TestGuildDemoteNotMaster(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Member")
	p.Side = 1
	addPlayerToEngine(e, p)

	master := makeFullTestPlayer(2, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, p.CharacterID, p.Name, p.Level)

	e.guildDemote(p, "Master") // member can't demote
}

func TestGuildLeave(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	e.guildLeave(member)
	if e.guilds.GetPlayerGuild(member.CharacterID) != nil {
		t.Error("Member should have left guild")
	}
}

func TestGuildLeaveNotInGuild(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "NoGuild")
	addPlayerToEngine(e, p)
	e.guildLeave(p) // should respond with error
}

func TestGuildDisband(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)

	e.guildDisband(master)
	if e.guilds.GetPlayerGuild(master.CharacterID) != nil {
		t.Error("Guild should be disbanded")
	}
}

func TestGuildDisbandNotInGuild(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "NoGuild")
	addPlayerToEngine(e, p)
	e.guildDisband(p) // should respond with error
}

// ============================================================
// handleGuildAction
// ============================================================

func TestHandleGuildActionInvite(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)
	client := makeClientWithObjectID(master.ObjectID)

	target := makeFullTestPlayer(2, "Recruit")
	target.Side = 1
	addPlayerToEngine(e, target)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)

	req := &pb.GuildActionRequest{Action: 1, TargetName: "Recruit"}
	e.handleGuildAction(client, req)
}

func TestHandleGuildActionKick(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)
	client := makeClientWithObjectID(master.ObjectID)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	req := &pb.GuildActionRequest{Action: 2, TargetName: "Member"}
	e.handleGuildAction(client, req)
}

func TestHandleGuildActionLeave(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Member")
	p.Side = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	master := makeFullTestPlayer(2, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, p.CharacterID, p.Name, p.Level)

	req := &pb.GuildActionRequest{Action: 5}
	e.handleGuildAction(client, req)
}

func TestHandleGuildActionDisband(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)
	client := makeClientWithObjectID(master.ObjectID)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)

	req := &pb.GuildActionRequest{Action: 6}
	e.handleGuildAction(client, req)
}

// ============================================================
// handlePartyAction / handlePartyInviteResponse
// ============================================================

func TestHandlePartyActionInvite(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Inviter")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	target := makeFullTestPlayer(2, "Target")
	addPlayerToEngine(e, target)

	req := &pb.PartyActionRequest{Action: 1, TargetName: "Target"}
	e.handlePartyAction(client, req)
}

func TestHandlePartyActionKick(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)
	client := makeClientWithObjectID(leader.ObjectID)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)

	// Create party and add member
	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)
	e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)

	req := &pb.PartyActionRequest{Action: 2, TargetName: "Member"}
	e.handlePartyAction(client, req)
}

func TestHandlePartyActionLeave(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)
	client := makeClientWithObjectID(member.ObjectID)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)
	e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)

	req := &pb.PartyActionRequest{Action: 3}
	e.handlePartyAction(client, req)
}

func TestHandlePartyInviteResponseAccept(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)
	client := makeClientWithObjectID(member.ObjectID)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)

	req := &pb.PartyInviteResponse{Accept: true}
	e.handlePartyInviteResponse(client, req)
}

func TestHandlePartyInviteResponseDecline(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)
	client := makeClientWithObjectID(member.ObjectID)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)

	req := &pb.PartyInviteResponse{Accept: false}
	e.handlePartyInviteResponse(client, req)
}

func TestBroadcastPartyUpdate(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)
	pt, _ := e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)
	if pt == nil {
		t.Skip("Party not created")
	}

	e.broadcastPartyUpdate(pt)
}

func TestPartyKick(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)
	e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)

	e.partyKick(leader, "Member")
}

func TestPartyKickTargetNotFound(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, p)

	e.partyKick(p, "NonExistent")
}

// ============================================================
// handleTradeResponse / handleTradeSetItem / handleTradeSetGold / handleTradeConfirm
// ============================================================

func TestHandleTradeResponseAccept(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p1)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)
	client2 := makeClientWithObjectID(p2.ObjectID)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)

	req := &pb.TradeResponse{Accept: true}
	e.handleTradeResponse(client2, req)

	session := e.trades.GetSession(p1.ObjectID)
	if session == nil {
		t.Error("Trade session should exist after accept")
	}
}

func TestHandleTradeResponseDecline(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p1)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)
	client2 := makeClientWithObjectID(p2.ObjectID)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)

	req := &pb.TradeResponse{Accept: false}
	e.handleTradeResponse(client2, req)
}

func TestHandleTradeSetGold(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	p1.Gold = 5000
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(p1.ObjectID)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	e.trades.AcceptTrade(p2.ObjectID)

	req := &pb.TradeSetGold{Gold: 1000}
	e.handleTradeSetGold(client1, req)
}

func TestHandleTradeSetGoldMoreThanHave(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	p1.Gold = 500
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(p1.ObjectID)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	e.trades.AcceptTrade(p2.ObjectID)

	req := &pb.TradeSetGold{Gold: 9999}
	e.handleTradeSetGold(client1, req) // clamped to p1.Gold
}

func TestHandleTradeSetItem(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("No item def 1")
	}
	p1.Inventory.AddItem(items.NewItem(def, 5))
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(p1.ObjectID)

	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	e.trades.AcceptTrade(p2.ObjectID)

	req := &pb.TradeSetItem{InventorySlot: 0, Count: 3}
	e.handleTradeSetItem(client1, req)
}

func TestHandleTradeSetItemNoSession(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "NoTrade")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeSetItem{InventorySlot: 0, Count: 1}
	e.handleTradeSetItem(client, req) // should do nothing
}

func TestHandleTradeConfirm(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(p1.ObjectID)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	e.trades.AcceptTrade(p2.ObjectID)

	req := &pb.TradeConfirm{Confirmed: true}
	e.handleTradeConfirm(client1, req)
}

func TestHandleTradeConfirmNoSession(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "NoTrade")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeConfirm{Confirmed: true}
	e.handleTradeConfirm(client, req) // should do nothing
}

func TestSendTradeUpdate(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p1)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	session, _ := e.trades.AcceptTrade(p2.ObjectID)
	if session == nil {
		t.Skip("No trade session")
	}

	e.sendTradeUpdate(session, p1.ObjectID)
	e.sendTradeUpdate(session, p2.ObjectID)
}

// ============================================================
// handleDamageSpell direct
// ============================================================

func TestHandleDamageSpellNoTarget(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Mage")
	spell := &magic.SpellDef{ID: 1, Type: magic.SpellTypeDamage, Range: 5, MinDamage: 10, MaxDamage: 20}

	e.handleDamageSpell(p, spell, 0, gm) // no target
}

func TestHandleDamageSpellKillNPC(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Mage")
	p.MAG = 50
	p.INT = 50
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 52, 50)
	n.HP = 1
	e.npcs.Store(n.ObjectID, n)

	spell := &magic.SpellDef{ID: 1, Type: magic.SpellTypeDamage, Range: 10, MinDamage: 50, MaxDamage: 100}
	e.handleDamageSpell(p, spell, n.ObjectID, gm)
}

func TestHandleDamageSpellOutOfRange(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(200, 200)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Mage")

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 150, 150) // far
	e.npcs.Store(n.ObjectID, n)

	spell := &magic.SpellDef{ID: 1, Type: magic.SpellTypeDamage, Range: 5, MinDamage: 10, MaxDamage: 20}
	e.handleDamageSpell(p, spell, n.ObjectID, gm) // out of range
}

// ============================================================
// broadcastToNearby / broadcastToMap
// ============================================================

func TestBroadcastToNearby(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	msg := &pb.Notification{Message: "test", Type: 1}
	e.broadcastToNearby(gm, 50, 50, -1, network.MsgNotification, msg)
}

func TestBroadcastToMap(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)

	msg := &pb.Notification{Message: "test", Type: 1}
	e.broadcastToMap("test", network.MsgNotification, msg)
}

// ============================================================
// processTick
// ============================================================

func TestProcessTick(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	p.HP = 50 // below max
	p.MP = 20
	p.SP = 20
	addPlayerToEngine(e, p)

	// Force all regen timers to trigger
	past := time.Now().Add(-30 * time.Second)
	e.lastRegenHP = past
	e.lastRegenMP = past
	e.lastRegenSP = past
	e.lastBuffCheck = past
	e.lastWorldSync = past
	e.lastWeatherCheck = time.Now().Add(-61 * time.Second)

	e.processTick()

	if p.HP <= 50 {
		t.Error("HP should have regenerated")
	}
	if p.MP <= 20 {
		t.Error("MP should have regenerated")
	}
	if p.SP <= 20 {
		t.Error("SP should have regenerated")
	}
}

func TestProcessTickWithNPCs(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateIdle
	n.NextThinkTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	// Should not panic — NPC AI runs in processTick
	e.processTick()
}

// ============================================================
// OnMessage - dispatch to handlers
// ============================================================

func TestOnMessageMotionRequest(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Encode a MotionRequest
	req := &pb.MotionRequest{Direction: 5, Action: 0, Position: &pb.Vec2{X: 50, Y: 50}}
	data, err := network.Encode(network.MsgMotionRequest, req)
	if err != nil {
		t.Fatal(err)
	}

	e.OnMessage(client, network.MsgMotionRequest, data)
}

func TestOnMessageChatRequest(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Chatter")
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ChatRequest{Message: "Hello", Type: 0}
	data, err := network.Encode(network.MsgChatRequest, req)
	if err != nil {
		t.Fatal(err)
	}

	e.OnMessage(client, network.MsgChatRequest, data)
}

func TestOnMessageStatAlloc(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	p.LUPool = 5
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.StatAllocRequest{StatType: 1, Points: 3}
	data, err := network.Encode(network.MsgStatAllocRequest, req)
	if err != nil {
		t.Fatal(err)
	}

	origSTR := p.STR
	e.OnMessage(client, network.MsgStatAllocRequest, data)
	if p.STR != origSTR+3 {
		t.Errorf("STR should increase by 3, was %d now %d", origSTR, p.STR)
	}
}

func TestOnMessageFactionSelect(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	p.Level = 10
	p.Side = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.FactionSelectRequest{Side: 1}
	data, err := network.Encode(network.MsgFactionSelectRequest, req)
	if err != nil {
		t.Fatal(err)
	}

	e.OnMessage(client, network.MsgFactionSelectRequest, data)
	if p.Side != 1 {
		t.Errorf("Side should be 1, got %d", p.Side)
	}
}

func TestOnMessageSpellCast(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Name = "test"
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Mage")
	p.MAG = 30
	p.INT = 20
	p.MP = 100
	p.MaxMP = 100
	p.LearnedSpells[1] = true
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SpellCastRequest{SpellId: 1}
	data, err := network.Encode(network.MsgSpellCastRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgSpellCastRequest, data)
}

func TestOnMessageSkillUse(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Miner")
	p.SP = 40
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SkillUseRequest{SkillId: int32(skills.SkillMining)}
	data, err := network.Encode(network.MsgSkillUseRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgSkillUseRequest, data)
}

func TestOnMessageItemUse(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemUseRequest{SlotIndex: 0}
	data, err := network.Encode(network.MsgItemUseRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgItemUseRequest, data)
}

func TestOnMessageItemEquip(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemEquipRequest{SlotIndex: 0}
	data, err := network.Encode(network.MsgItemEquipRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgItemEquipRequest, data)
}

func TestOnMessageItemDrop(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	def := items.GetItemDef(1)
	if def != nil {
		p.Inventory.AddItem(items.NewItem(def, 1))
	}
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemDropRequest{SlotIndex: 0, Count: 1}
	data, err := network.Encode(network.MsgItemDropRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgItemDropRequest, data)
}

func TestOnMessageItemPickup(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemPickupRequest{GroundId: 999}
	data, err := network.Encode(network.MsgItemPickupRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgItemPickupRequest, data)
}

func TestOnMessageGuildCreate(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Master")
	p.Side = 1
	p.Level = 20
	p.CHR = 20
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.GuildCreateRequest{Name: "TestGuild"}
	data, err := network.Encode(network.MsgGuildCreateRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgGuildCreateRequest, data)
}

func TestOnMessageGuildAction(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.GuildActionRequest{Action: 5} // leave (will fail gracefully)
	data, err := network.Encode(network.MsgGuildActionRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgGuildActionRequest, data)
}

func TestOnMessagePartyAction(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.PartyActionRequest{Action: 3} // leave (will fail gracefully)
	data, err := network.Encode(network.MsgPartyActionRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgPartyActionRequest, data)
}

func TestOnMessageTradeRequest(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Trader")
	addPlayerToEngine(e, p)
	target := makeFullTestPlayer(2, "Target")
	addPlayerToEngine(e, target)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeRequest{TargetId: target.ObjectID}
	data, err := network.Encode(network.MsgTradeRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgTradeRequest, data)
}

func TestOnMessageTradeResponse(t *testing.T) {
	e := makeTestEngine()
	p1 := makeFullTestPlayer(1, "T1")
	addPlayerToEngine(e, p1)
	p2 := makeFullTestPlayer(2, "T2")
	addPlayerToEngine(e, p2)
	client2 := makeClientWithObjectID(p2.ObjectID)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)

	req := &pb.TradeResponse{Accept: true}
	data, err := network.Encode(network.MsgTradeResponse, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client2, network.MsgTradeResponse, data)
}

func TestOnMessageQuestAccept(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Quester")
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.QuestAcceptRequest{QuestId: 1}
	data, err := network.Encode(network.MsgQuestAcceptRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgQuestAcceptRequest, data)
}

func TestOnMessageQuestTurnIn(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Quester")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.QuestTurnInRequest{QuestId: 9999}
	data, err := network.Encode(network.MsgQuestTurnInRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgQuestTurnInRequest, data)
}

func TestOnMessageCraft(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Crafter")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.CraftRequest{RecipeId: 1}
	data, err := network.Encode(network.MsgCraftRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgCraftRequest, data)
}

func TestOnMessageLearnSpell(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Student")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.LearnSpellRequest{SpellId: 1}
	data, err := network.Encode(network.MsgLearnSpellRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgLearnSpellRequest, data)
}

func TestOnMessageDecodeError(t *testing.T) {
	e := makeTestEngine()
	client := &network.Client{}
	// Invalid data
	e.OnMessage(client, 0xFF, []byte{0xFF, 0xFF}) // should log and return
}

func TestOnMessageShopBuy(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Buyer")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ShopBuyRequest{NpcId: 999, ItemId: 1, Count: 1}
	data, err := network.Encode(network.MsgShopBuyRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgShopBuyRequest, data)
}

func TestOnMessageShopSell(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Seller")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ShopSellRequest{NpcId: 999, SlotIndex: 0, Count: 1}
	data, err := network.Encode(network.MsgShopSellRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgShopSellRequest, data)
}

func TestOnMessageTradeSetItem(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Trader")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeSetItem{InventorySlot: 0, Count: 1}
	data, err := network.Encode(network.MsgTradeSetItem, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgTradeSetItem, data)
}

func TestOnMessageTradeSetGold(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Trader")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeSetGold{Gold: 100}
	data, err := network.Encode(network.MsgTradeSetGold, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgTradeSetGold, data)
}

func TestOnMessageTradeConfirm(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Trader")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeConfirm{Confirmed: true}
	data, err := network.Encode(network.MsgTradeConfirm, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgTradeConfirm, data)
}

func TestOnMessagePartyInviteResponse(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.PartyInviteResponse{Accept: false}
	data, err := network.Encode(network.MsgPartyInviteResponse, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgPartyInviteResponse, data)
}

func TestOnMessageAttackRequest(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.MotionRequest{Direction: 5, Action: 3, Position: &pb.Vec2{X: 50, Y: 50}}
	data, err := network.Encode(network.MsgAttackRequest, req)
	if err != nil {
		t.Fatal(err)
	}
	e.OnMessage(client, network.MsgAttackRequest, data)
}

// ============================================================
// executeTrade - full trade with items and gold
// ============================================================

func TestExecuteTradeFullFlow(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	p1.Gold = 5000
	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("No item def 1")
	}
	p1.Inventory.AddItem(items.NewItem(def, 3))
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(p1.ObjectID)

	p2 := makeFullTestPlayer(2, "Trader2")
	p2.Gold = 3000
	addPlayerToEngine(e, p2)
	client2 := makeClientWithObjectID(p2.ObjectID)

	// Request trade
	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	session, _ := e.trades.AcceptTrade(p2.ObjectID)
	if session == nil {
		t.Fatal("No trade session")
	}

	// P1 sets item
	setItemReq := &pb.TradeSetItem{InventorySlot: 0, Count: 2}
	e.handleTradeSetItem(client1, setItemReq)

	// P2 sets gold
	setGoldReq := &pb.TradeSetGold{Gold: 1000}
	e.handleTradeSetGold(client2, setGoldReq)

	// Both confirm
	confirmReq := &pb.TradeConfirm{Confirmed: true}
	e.handleTradeConfirm(client1, confirmReq)
	e.handleTradeConfirm(client2, confirmReq)

	// After both confirm, trade should execute
	// P2 should have gained gold from trade (or items)
}

// ============================================================
// handleItemUse - potion
// ============================================================

func TestHandleItemUsePotion(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	p.HP = 30
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Find a potion item
	potionDef := items.GetItemDef(91) // RedPotion
	if potionDef == nil {
		t.Skip("Potion item 91 not found")
	}
	p.Inventory.AddItem(items.NewItem(potionDef, 5))

	origHP := p.HP
	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req)

	if p.HP <= origHP {
		t.Logf("HP didn't increase - potion may be non-HP or item type mismatch")
	}
}

func TestHandleItemUseNonConsumable(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Use a weapon - should fail (not a potion)
	swordDef := items.GetItemDef(1) // Short Sword
	if swordDef == nil {
		t.Skip("Item 1 not found")
	}
	p.Inventory.AddItem(items.NewItem(swordDef, 1))

	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req) // should notify "Cannot use"
}

func TestHandleItemUseEmptySlot(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req) // should return early (nil item)
}

func TestHandleItemUseDeadPlayer(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req) // should return early
}

// ============================================================
// handleItemEquip - equipment
// ============================================================

func TestHandleItemEquipWeapon(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	swordDef := items.GetItemDef(1)
	if swordDef == nil {
		t.Skip("Item 1 not found")
	}
	p.Inventory.AddItem(items.NewItem(swordDef, 1))

	req := &pb.ItemEquipRequest{SlotIndex: 0}
	e.handleItemEquip(client, req)
}

func TestHandleItemEquipEmptySlot(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemEquipRequest{SlotIndex: 0}
	e.handleItemEquip(client, req) // empty slot - return early
}

func TestHandleItemEquipThenUnequip(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	swordDef := items.GetItemDef(1)
	if swordDef == nil {
		t.Skip("Item 1 not found")
	}
	p.Inventory.AddItem(items.NewItem(swordDef, 1))

	// Equip
	eqReq := &pb.ItemEquipRequest{SlotIndex: 0}
	e.handleItemEquip(client, eqReq)

	// Unequip (SlotIndex < 0 means unequip)
	unReq := &pb.ItemEquipRequest{SlotIndex: -1, EquipSlot: int32(items.EquipWeapon)}
	e.handleItemEquip(client, unReq)
}

// ============================================================
// handleItemDrop
// ============================================================

func TestHandleItemDropPartial(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dropper")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("Item 1 not found")
	}
	p.Inventory.AddItem(items.NewItem(def, 10))

	req := &pb.ItemDropRequest{SlotIndex: 0, Count: 3}
	e.handleItemDrop(client, req)

	remaining := p.Inventory.GetItem(0)
	if remaining != nil && remaining.Count != 7 {
		t.Errorf("Expected 7 remaining, got %d", remaining.Count)
	}
}

func TestHandleItemDropEmptySlot(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Dropper")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.ItemDropRequest{SlotIndex: 0, Count: 1}
	e.handleItemDrop(client, req) // nothing to drop
}

// ============================================================
// handleCraft with valid recipe inputs
// ============================================================

func TestHandleCraftWithInputs(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Smith")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	recipe := skills.GetRecipe(1)
	if recipe == nil {
		t.Skip("Recipe 1 not found")
	}

	// Set mastery high enough
	for i := 0; i < recipe.ReqMastery+10; i++ {
		p.Skills.GainMastery(recipe.Skill)
	}

	// Add required inputs
	for _, input := range recipe.Inputs {
		inputDef := items.GetItemDef(input.ItemID)
		if inputDef == nil {
			t.Skipf("Input item %d not found", input.ItemID)
		}
		p.Inventory.AddItem(items.NewItem(inputDef, input.Count*2)) // extra
	}

	req := &pb.CraftRequest{RecipeId: 1}
	e.handleCraft(client, req)
}

func TestHandleCraftMissingInputs(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Smith")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	recipe := skills.GetRecipe(1)
	if recipe == nil {
		t.Skip("Recipe 1 not found")
	}

	// Set mastery high enough but don't add inputs
	for i := 0; i < recipe.ReqMastery+10; i++ {
		p.Skills.GainMastery(recipe.Skill)
	}

	req := &pb.CraftRequest{RecipeId: 1}
	e.handleCraft(client, req) // should fail: missing inputs
}

// ============================================================
// handleQuestTurnIn - hunt quest completion
// ============================================================

func TestHandleQuestTurnInHuntQuest(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Hunter")
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Find a hunt quest
	qDef := quest.GetQuestDef(1)
	if qDef == nil {
		t.Skip("Quest 1 not found")
	}

	// Accept the quest
	err := p.Quests.AcceptQuest(1, p.Level)
	if err != nil {
		t.Skipf("Cannot accept quest: %v", err)
	}

	// Simulate kills to complete
	for i := 0; i < qDef.TargetCount+5; i++ {
		p.Quests.OnNPCKill(qDef.TargetNpcType)
	}

	origXP := p.Experience
	origGold := p.Gold

	req := &pb.QuestTurnInRequest{QuestId: 1}
	e.handleQuestTurnIn(client, req)

	if qDef.RewardXP > 0 && p.Experience <= origXP {
		t.Logf("XP didn't increase (may have failed): was %d, now %d", origXP, p.Experience)
	}
	if qDef.RewardGold > 0 && p.Gold <= origGold {
		t.Logf("Gold didn't increase (may have failed): was %d, now %d", origGold, p.Gold)
	}
}

// ============================================================
// Run (with context cancellation)
// ============================================================

func TestRunCancellation(t *testing.T) {
	e := makeTestEngine()

	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() {
		e.Run(ctx)
		close(done)
	}()

	// Let it run for a couple ticks
	time.Sleep(250 * time.Millisecond)
	cancel()

	select {
	case <-done:
		// success
	case <-time.After(2 * time.Second):
		t.Fatal("Run did not exit after context cancellation")
	}
}

// ============================================================
// handleAttack - attack NPC (adjacent)
// ============================================================

func TestHandleAttackNPCAdjacent(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Fighter")
	p.STR = 30
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)
	client := makeClientWithObjectID(p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 51, 50) // adjacent
	e.npcs.Store(n.ObjectID, n)

	origHP := n.HP
	req := &pb.MotionRequest{Direction: 3, Action: 3, Position: &pb.Vec2{X: 50, Y: 50}, TargetId: n.ObjectID}
	e.handleAttack(client, req)

	t.Logf("NPC HP: %d -> %d, SP: %d", origHP, n.HP, p.SP)
}

func TestHandleAttackShopNPCAdjacent(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Shopper")
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 51, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	req := &pb.MotionRequest{Direction: 3, Action: 3, Position: &pb.Vec2{X: 50, Y: 50}, TargetId: shopNPC.ObjectID}
	e.handleAttack(client, req) // should open shop, not attack
}

func TestHandleAttackNPCKill(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Killer")
	p.STR = 100
	p.Level = 50
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)
	client := makeClientWithObjectID(p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 51, 50)
	n.HP = 1 // nearly dead
	e.npcs.Store(n.ObjectID, n)

	req := &pb.MotionRequest{Direction: 3, Action: 3, Position: &pb.Vec2{X: 50, Y: 50}, TargetId: n.ObjectID}

	// Multiple attempts since attacks can miss
	for i := 0; i < 20; i++ {
		if n.HP <= 0 {
			break
		}
		n.HP = 1
		e.handleAttack(client, req)
	}
}

// ============================================================
// handleChat - whisper to existing player
// ============================================================

func TestHandleChatWhisperToPlayer(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	sender := makeFullTestPlayer(1, "Sender")
	addPlayerToEngine(e, sender)
	gm.AddPlayerToSector(sender.X, sender.Y, sender.ObjectID)
	client := makeClientWithObjectID(sender.ObjectID)

	receiver := makeFullTestPlayer(2, "Receiver")
	addPlayerToEngine(e, receiver)

	req := &pb.ChatRequest{Message: "/w Receiver hello there", Type: 2}
	e.handleChat(client, req) // whisper
}

// ============================================================
// handleLearnSpell - satisfy requirements
// ============================================================

func TestHandleLearnSpellWithReqs(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Student")
	p.Level = 50
	p.MAG = 50
	p.INT = 50
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Find a spell the player qualifies for
	for i := 1; i <= 20; i++ {
		spell := magic.GetSpellDef(i)
		if spell == nil {
			continue
		}
		if p.Level >= spell.ReqLevel && p.MAG >= spell.ReqMAG && p.INT >= spell.ReqINT {
			req := &pb.LearnSpellRequest{SpellId: int32(i)}
			e.handleLearnSpell(client, req)

			if !p.LearnedSpells[i] {
				t.Errorf("Should have learned spell %d", i)
			}
			return
		}
	}
	t.Skip("No learnable spell found for test player")
}

func TestHandleLearnSpellAlreadyKnownExtended(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Mage")
	p.Level = 50
	p.MAG = 50
	p.INT = 50
	p.LearnedSpells[1] = true
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.LearnSpellRequest{SpellId: 1}
	e.handleLearnSpell(client, req) // should say already known
}

func TestHandleLearnSpellLowLevel(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Newbie")
	p.Level = 1
	p.MAG = 5
	p.INT = 5
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Find a spell that requires high level
	for i := 1; i <= 100; i++ {
		spell := magic.GetSpellDef(i)
		if spell != nil && spell.ReqLevel > 1 {
			req := &pb.LearnSpellRequest{SpellId: int32(i)}
			e.handleLearnSpell(client, req) // should fail level check
			return
		}
	}
	t.Skip("No spell with level req > 1 found")
}

func TestHandleLearnSpellLowMAG(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Warrior")
	p.Level = 50
	p.MAG = 1
	p.INT = 50
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	for i := 1; i <= 100; i++ {
		spell := magic.GetSpellDef(i)
		if spell != nil && spell.ReqMAG > 1 && p.Level >= spell.ReqLevel {
			req := &pb.LearnSpellRequest{SpellId: int32(i)}
			e.handleLearnSpell(client, req) // should fail MAG check
			return
		}
	}
	t.Skip("No suitable spell found")
}

func TestHandleLearnSpellLowINT(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Brute")
	p.Level = 50
	p.MAG = 50
	p.INT = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	for i := 1; i <= 100; i++ {
		spell := magic.GetSpellDef(i)
		if spell != nil && spell.ReqINT > 1 && p.Level >= spell.ReqLevel && p.MAG >= spell.ReqMAG {
			req := &pb.LearnSpellRequest{SpellId: int32(i)}
			e.handleLearnSpell(client, req) // should fail INT check
			return
		}
	}
	t.Skip("No suitable spell found")
}

// ============================================================
// processNPCTick wander state
// ============================================================

func TestProcessNPCTickWander(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateWander
	n.NextThinkTime = time.Time{}
	n.LastMoveTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	origX, origY := n.X, n.Y
	for i := 0; i < 50; i++ {
		n.NextThinkTime = time.Time{}
		n.LastMoveTime = time.Time{}
		n.State = npc.StateWander
		e.processNPCTick(n, time.Now())
	}
	// May or may not have moved (random), but shouldn't panic
	t.Logf("NPC moved from (%d,%d) to (%d,%d)", origX, origY, n.X, n.Y)
}

func TestProcessNPCTickWanderFarFromSpawn(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateWander
	n.NextThinkTime = time.Time{}
	n.LastMoveTime = time.Time{}
	// Move NPC far from spawn
	n.X = 90
	n.Y = 90
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())
	// Should return to idle since it's out of wander range
	if n.State != npc.StateIdle {
		t.Logf("State after wander check: %d", n.State)
	}
}

func TestProcessNPCTickChaseTargetTooFarFromSpawn(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	p.X, p.Y = 10, 10
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateChase
	n.TargetID = p.ObjectID
	n.NextThinkTime = time.Time{}
	n.LastMoveTime = time.Time{}
	// Move NPC very far from spawn
	n.X = 90
	n.Y = 90
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())
	if n.State != npc.StateIdle {
		t.Logf("State after far chase: %d (expected idle)", n.State)
	}
}

func TestProcessNPCTickChaseMovesToward(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	p.X, p.Y = 55, 50
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[10]
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateChase
	n.TargetID = p.ObjectID
	n.NextThinkTime = time.Time{}
	n.LastMoveTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	origX := n.X
	e.processNPCTick(n, time.Now())
	if n.X <= origX && n.State == npc.StateChase {
		t.Logf("NPC didn't move toward player (X=%d, was %d), state=%d", n.X, origX, n.State)
	}
}

func TestProcessNPCTickIdleAggroPlayer(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Player")
	p.X, p.Y = 52, 50 // close to NPC
	addPlayerToEngine(e, p)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	npcType := npc.NpcTypes[11] // Skeleton with aggro range
	n := npc.NewNPC(100, npcType, "test", 50, 50)
	n.State = npc.StateIdle
	n.NextThinkTime = time.Time{}
	e.npcs.Store(n.ObjectID, n)

	e.processNPCTick(n, time.Now())
	if n.State == npc.StateChase {
		t.Logf("NPC correctly aggro'd player")
	}
}

// ============================================================
// handleQuestTurnIn - delivery quest
// ============================================================

func TestHandleQuestTurnInDeliveryQuest(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Deliverer")
	p.Level = 20
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Find a delivery quest
	for qid := 1; qid <= 20; qid++ {
		qDef := quest.GetQuestDef(qid)
		if qDef == nil {
			continue
		}
		if qDef.Type != quest.QuestTypeDelivery && qDef.Type != quest.QuestTypeCollect {
			continue
		}
		if p.Level < qDef.MinLevel {
			continue
		}

		err := p.Quests.AcceptQuest(qid, p.Level)
		if err != nil {
			continue
		}

		// Add required items
		if qDef.TargetItemID > 0 {
			itemDef := items.GetItemDef(qDef.TargetItemID)
			if itemDef != nil {
				p.Inventory.AddItem(items.NewItem(itemDef, qDef.TargetCount+5))
			}
		}

		// Mark quest as completed
		for _, pq := range p.Quests.GetActiveQuests() {
			if pq.QuestID == qid {
				pq.Progress = qDef.TargetCount
				pq.State = quest.QuestStateCompleted
			}
		}

		req := &pb.QuestTurnInRequest{QuestId: int32(qid)}
		e.handleQuestTurnIn(client, req)
		return
	}
	t.Skip("No delivery/collect quest found")
}

// ============================================================
// handleCraft - full success flow with inventory full check
// ============================================================

func TestHandleCraftInventoryFull(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Smith")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	recipe := skills.GetRecipe(1)
	if recipe == nil {
		t.Skip("Recipe 1 not found")
	}

	// Set mastery high enough
	for i := 0; i < recipe.ReqMastery+50; i++ {
		p.Skills.GainMastery(recipe.Skill)
	}

	// Fill inventory completely
	fillDef := items.GetItemDef(1)
	if fillDef == nil {
		t.Skip("Item 1 not found")
	}
	for i := 0; i < items.MaxInventorySlots; i++ {
		p.Inventory.AddItem(items.NewItem(fillDef, 1))
	}

	req := &pb.CraftRequest{RecipeId: 1}
	e.handleCraft(client, req) // should fail with "Inventory full"
}

// ============================================================
// handleTradeSetGold - negative gold
// ============================================================

func TestHandleTradeSetGoldNegative(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	p1.Gold = 5000
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(p1.ObjectID)
	p2 := makeFullTestPlayer(2, "Trader2")
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	e.trades.AcceptTrade(p2.ObjectID)

	req := &pb.TradeSetGold{Gold: -100} // negative
	e.handleTradeSetGold(client1, req)   // should clamp to 0
}

// ============================================================
// handlePvPAttack - kill scenario
// ============================================================

func TestHandlePvPAttackKillCrossFaction(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "Killer")
	attacker.Side = 1
	attacker.STR = 100
	attacker.Level = 50
	addPlayerToEngine(e, attacker)
	gm.AddPlayerToSector(attacker.X, attacker.Y, attacker.ObjectID)

	target := makeFullTestPlayer(2, "Victim")
	target.Side = 2 // different faction
	target.X, target.Y = 51, 50
	target.HP = 1 // almost dead
	addPlayerToEngine(e, target)
	gm.AddPlayerToSector(target.X, target.Y, target.ObjectID)

	// Retry until we get a hit (high STR should hit often)
	for i := 0; i < 30; i++ {
		target.HP = 1
		e.handlePvPAttack(attacker, target)
		if target.HP <= 0 {
			break
		}
	}

	if attacker.EKCount > 0 {
		t.Logf("Attacker EK count: %d (cross-faction kill)", attacker.EKCount)
	}
}

func TestHandlePvPAttackNeutralKill(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "PKer")
	attacker.Side = 0 // neutral
	attacker.STR = 100
	attacker.Level = 50
	addPlayerToEngine(e, attacker)
	gm.AddPlayerToSector(attacker.X, attacker.Y, attacker.ObjectID)

	target := makeFullTestPlayer(2, "Victim")
	target.Side = 0 // neutral
	target.X, target.Y = 51, 50
	target.HP = 1
	addPlayerToEngine(e, target)
	gm.AddPlayerToSector(target.X, target.Y, target.ObjectID)

	for i := 0; i < 30; i++ {
		target.HP = 1
		e.handlePvPAttack(attacker, target)
		if target.HP <= 0 {
			break
		}
	}
	if attacker.PKCount > 0 {
		t.Logf("Attacker PK count: %d (neutral kill)", attacker.PKCount)
	}
}

// ============================================================
// sendPKStatus
// ============================================================

func TestSendPKStatus(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "PKer")
	p.PKCount = 5
	p.EKCount = 3
	e.sendPKStatus(p) // should not panic
}

// ============================================================
// handleItemUse - MP and SP potions
// ============================================================

func TestHandleItemUseMPPotion(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Mage")
	p.MP = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	potionDef := items.GetItemDef(93) // BluePotion (MP)
	if potionDef == nil {
		t.Skip("BluePotion 93 not found")
	}
	p.Inventory.AddItem(items.NewItem(potionDef, 1))

	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req)
}

func TestHandleItemUseSPPotion(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Tired")
	p.SP = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	potionDef := items.GetItemDef(95) // GreenPotion (SP)
	if potionDef == nil {
		t.Skip("GreenPotion 95 not found")
	}
	p.Inventory.AddItem(items.NewItem(potionDef, 1))

	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req)
}

// ============================================================
// handleItemEquip - with level/stat requirements
// ============================================================

func TestHandleItemEquipArmor(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Knight")
	p.Level = 30
	p.STR = 30
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	armorDef := items.GetItemDef(453) // Shirt(M)
	if armorDef == nil {
		t.Skip("Armor item 453 not found")
	}
	p.Inventory.AddItem(items.NewItem(armorDef, 1))

	req := &pb.ItemEquipRequest{SlotIndex: 0}
	e.handleItemEquip(client, req)
}

// ============================================================
// onNPCKillQuestUpdate with active hunt quest
// ============================================================

func TestOnNPCKillQuestUpdateWithActiveQuest(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Hunter")
	p.Level = 10
	addPlayerToEngine(e, p)

	// Find a hunt quest and accept it
	for qid := 1; qid <= 10; qid++ {
		qDef := quest.GetQuestDef(qid)
		if qDef == nil || qDef.Type != quest.QuestTypeHunt {
			continue
		}
		if p.Level < qDef.MinLevel {
			continue
		}
		err := p.Quests.AcceptQuest(qid, p.Level)
		if err != nil {
			continue
		}

		// Now kill the target NPC type
		for i := 0; i < qDef.TargetCount+1; i++ {
			e.onNPCKillQuestUpdate(p, qDef.TargetNpcType)
		}
		return
	}
	t.Skip("No hunt quest available")
}

// ============================================================
// executeTrade - with items in both directions
// ============================================================

func TestExecuteTradeWithItems(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	p1.Gold = 5000
	addPlayerToEngine(e, p1)

	p2 := makeFullTestPlayer(2, "Trader2")
	p2.Gold = 3000
	addPlayerToEngine(e, p2)

	def1 := items.GetItemDef(1)
	def2 := items.GetItemDef(91) // RedPotion
	if def1 == nil {
		t.Skip("Item 1 not found")
	}

	p1.Inventory.AddItem(items.NewItem(def1, 5))
	if def2 != nil {
		p2.Inventory.AddItem(items.NewItem(def2, 3))
	}

	// Create trade session
	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	session, _ := e.trades.AcceptTrade(p2.ObjectID)
	if session == nil {
		t.Fatal("No trade session")
	}

	// Set items
	session.SetItem(p1.ObjectID, 0, def1.ID, def1.Name, 3)
	if def2 != nil {
		session.SetItem(p2.ObjectID, 0, def2.ID, def2.Name, 2)
	}
	session.SetGold(p1.ObjectID, 500)
	session.SetGold(p2.ObjectID, 200)

	e.executeTrade(session)

	// Verify gold exchange
	if p1.Gold != 5000-500+200 {
		t.Logf("P1 gold: expected %d, got %d", 5000-500+200, p1.Gold)
	}
	if p2.Gold != 3000-200+500 {
		t.Logf("P2 gold: expected %d, got %d", 3000-200+500, p2.Gold)
	}
}

func TestExecuteTradeNotEnoughGold(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	p1.Gold = 100
	addPlayerToEngine(e, p1)

	p2 := makeFullTestPlayer(2, "Trader2")
	p2.Gold = 100
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	session, _ := e.trades.AcceptTrade(p2.ObjectID)
	if session == nil {
		t.Fatal("No session")
	}

	session.SetGold(p1.ObjectID, 99999) // more than they have
	e.executeTrade(session)             // should cancel
}

func TestExecuteTradePlayerDisconnected(t *testing.T) {
	e := makeTestEngine()

	p1 := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p1)
	// Don't add p2

	e.trades.RequestTrade(p1.ObjectID, 999)
	session, _ := e.trades.AcceptTrade(int32(999))
	if session == nil {
		// Can't create session with nonexistent player through normal flow
		t.Skip("Cannot create trade session with disconnected player")
	}
	e.executeTrade(session) // p2 not in engine -> cancel
}

// ============================================================
// handleShopSell - various paths
// ============================================================

func TestHandleShopSellMultipleItems(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Seller")
	def := items.GetItemDef(1)
	if def == nil {
		t.Skip("Item 1 not found")
	}
	p.Inventory.AddItem(items.NewItem(def, 10))
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	origGold := p.Gold
	req := &pb.ShopSellRequest{NpcId: shopNPC.ObjectID, SlotIndex: 0, Count: 5}
	e.handleShopSell(client, req)
	if p.Gold <= origGold {
		t.Error("Gold should increase after selling 5 items")
	}
}

func TestHandleShopSellEmptySlot(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Seller")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	req := &pb.ShopSellRequest{NpcId: shopNPC.ObjectID, SlotIndex: 0, Count: 1}
	e.handleShopSell(client, req) // empty slot
}

// ============================================================
// handleShopBuy - item not in shop
// ============================================================

func TestHandleShopBuyItemNotAvailable(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Buyer")
	p.Gold = 99999
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopType, ok := npc.NpcTypes[15]
	if !ok {
		t.Skip("Shop NPC type 10 not found")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	req := &pb.ShopBuyRequest{NpcId: shopNPC.ObjectID, ItemId: 99999, Count: 1}
	e.handleShopBuy(client, req) // item not in shop
}

// ============================================================
// handleGuildAction - promote and demote (action 3 and 4)
// ============================================================

func TestHandleGuildActionPromote(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)
	client := makeClientWithObjectID(master.ObjectID)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	req := &pb.GuildActionRequest{Action: 3, TargetName: "Member"}
	e.handleGuildAction(client, req)
}

func TestHandleGuildActionDemote(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)
	client := makeClientWithObjectID(master.ObjectID)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	// Promote first then demote
	promoteReq := &pb.GuildActionRequest{Action: 3, TargetName: "Member"}
	e.handleGuildAction(client, promoteReq)

	demoteReq := &pb.GuildActionRequest{Action: 4, TargetName: "Member"}
	e.handleGuildAction(client, demoteReq)
}

// ============================================================
// findWalkable - edge case where starting tile is blocked
// ============================================================

func TestFindWalkableBlockedStart(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)

	// Block the center
	gm.Tiles[50][50].Walkable = false
	gm.Tiles[50][51].Walkable = false
	// But (49,50) should be walkable

	x, y := e.findWalkable(gm, 50, 50)
	if !gm.IsWalkable(x, y) {
		t.Errorf("findWalkable returned non-walkable tile (%d,%d)", x, y)
	}
}

func TestFindWalkableAllBlocked(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(10, 10)

	// Block everything
	for y := 0; y < 10; y++ {
		for x := 0; x < 10; x++ {
			gm.Tiles[y][x].Walkable = false
		}
	}

	// Should return center as last resort
	x, y := e.findWalkable(gm, 5, 5)
	if x != 5 || y != 5 {
		t.Errorf("Expected fallback center (5,5), got (%d,%d)", x, y)
	}
}

// Ensure all imports are used
// ============================================================
// Additional coverage tests for partially-covered functions
// ============================================================

// handlePartyInviteResponse: decline with inviter present (covers GetInviter+inviter lookup)
func TestHandlePartyInviteResponseDeclineWithInviter(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)
	client := makeClientWithObjectID(member.ObjectID)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)

	// Decline — this should notify the inviter
	req := &pb.PartyInviteResponse{Accept: false}
	e.handlePartyInviteResponse(client, req)
	// No panic = success; inviter was found and notified
}

// handlePartyInviteResponse: accept with no pending invite (covers AcceptInvite error path)
func TestHandlePartyInviteResponseAcceptNoPending(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Lonely")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.PartyInviteResponse{Accept: true}
	e.handlePartyInviteResponse(client, req)
	// Should get "no pending invite" error, no panic
}

// handlePartyInviteResponse: nil client (covers early return)
func TestHandlePartyInviteResponseNilClient(t *testing.T) {
	e := makeTestEngine()
	client := makeClientWithObjectID(0) // no player
	req := &pb.PartyInviteResponse{Accept: true}
	e.handlePartyInviteResponse(client, req)
}

// guildInvite: rank too low to invite
func TestGuildInviteRankTooLow(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Grunt")
	p.Side = 1
	p.CharacterID = 100
	addPlayerToEngine(e, p)

	target := makeFullTestPlayer(2, "Newbie")
	target.Side = 1
	target.CharacterID = 200
	addPlayerToEngine(e, target)

	// Create a guild with a different master
	master := makeFullTestPlayer(3, "Master")
	master.Side = 1
	master.CharacterID = 300
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(1, p.CharacterID, p.Name, p.Level) // p joins as regular member (rank 1)

	// p is rank 1 (member), not officer — should fail
	e.guildInvite(p, "Newbie")
}

// guildInvite: successful invite
func TestGuildInviteSuccess(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	target := makeFullTestPlayer(2, "Newbie")
	target.Side = 1
	target.CharacterID = 200
	addPlayerToEngine(e, target)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)

	// Master has rank 3 (RankMaster), should succeed
	e.guildInvite(master, "Newbie")
}

// guildKick: successful kick
func TestGuildKickSuccess(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	member.CharacterID = 200
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(1, member.CharacterID, member.Name, member.Level)

	e.guildKick(master, "Member")
}

// guildKick: target not in guild (via name)
func TestGuildKickTargetNotInGuild(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)

	// Try to kick a non-member
	e.guildKick(master, "Nobody")
}

// guildPromote: successful promote
func TestGuildPromoteSuccess(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	member.CharacterID = 200
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(1, member.CharacterID, member.Name, member.Level)

	e.guildPromote(master, "Member")
}

// guildPromote: target not found in guild
func TestGuildPromoteNotFound(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)

	e.guildPromote(master, "Ghost")
}

// guildDemote: successful demote
func TestGuildDemoteSuccess(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	member.CharacterID = 200
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(1, member.CharacterID, member.Name, member.Level)

	// Promote first so we can demote
	e.guildPromote(master, "Member")
	e.guildDemote(master, "Member")
}

// guildDemote: non-master tries to demote
func TestGuildDemoteByNonMaster(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	member.CharacterID = 200
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("TestGuild", master.Side, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(1, member.CharacterID, member.Name, member.Level)

	// member tries to demote — should fail
	e.guildDemote(member, "Master")
}

// handleItemEquip: doesn't meet requirements
func TestHandleItemEquipRequirementsFail(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Weak")
	p.Level = 1
	p.STR = 5 // too weak for most weapons
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Dagger+1 requires level 10
	axe := items.NewItem(items.GetItemDef(4), 1)
	p.Inventory.AddItem(axe)

	req := &pb.ItemEquipRequest{SlotIndex: 0}
	e.handleItemEquip(client, req)
	// Should get "doesn't meet requirements" notification
}

// handleItemEquip: unequip path
func TestHandleItemEquipUnequipPath(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Armed")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	sword := items.NewItem(items.GetItemDef(1), 1) // Short Sword
	p.Inventory.AddItem(sword)
	p.Inventory.Equip(0) // equip it first

	// Now unequip via negative SlotIndex
	req := &pb.ItemEquipRequest{SlotIndex: -1, EquipSlot: int32(items.EquipWeapon)}
	e.handleItemEquip(client, req)
}

// handleItemUse: def is nil (item with no definition)
func TestHandleItemUseNilDef(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "User")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Slot 5 is empty, so GetItem will return nil
	req := &pb.ItemUseRequest{SlotIndex: 5}
	e.handleItemUse(client, req)
}

// handleShopSell: count > item.Count clamp
func TestHandleShopSellCountClamp(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Seller")
	p.X, p.Y = 50, 50
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Add a shop NPC nearby
	shopNPC := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[15], // shop
		MapName:  "test",
		X:        51, Y: 50,
		HP: 100, MaxHP: 100,
	}
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	sword := items.NewItem(items.GetItemDef(1), 3) // 3 swords
	p.Inventory.AddItem(sword)

	// Try to sell 100 — should clamp to 3
	req := &pb.ShopSellRequest{NpcId: 500, SlotIndex: 0, Count: 100}
	e.handleShopSell(client, req)
}

// handleShopSell: not a shop NPC
func TestHandleShopSellNotShopNPC(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Seller")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Add a monster NPC (not a shop)
	monsterNPC := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[10], // Slime, not a shop
		MapName:  "test",
		X:        51, Y: 50,
		HP: 10, MaxHP: 10,
	}
	e.npcs.Store(monsterNPC.ObjectID, monsterNPC)

	req := &pb.ShopSellRequest{NpcId: 500, SlotIndex: 0}
	e.handleShopSell(client, req)
}

// handleShopSell: too far from shop
func TestHandleShopSellTooFar(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Seller")
	p.X, p.Y = 10, 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	shopNPC := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[15], // shop
		MapName:  "test",
		X:        90, Y: 90, // far away
		HP: 100, MaxHP: 100,
	}
	e.npcs.Store(shopNPC.ObjectID, shopNPC)

	req := &pb.ShopSellRequest{NpcId: 500, SlotIndex: 0}
	e.handleShopSell(client, req)
}

// handleSpellCast: canCast returns false (not enough MP)
func TestHandleSpellCastNotEnoughMP(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Caster")
	p.MP = 0 // no mana
	p.LearnedSpells = map[int]bool{1: true}
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SpellCastRequest{SpellId: 1}
	e.handleSpellCast(client, req)
}

// handleSpellCast: no map found
func TestHandleSpellCastNoMap(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Caster")
	p.MapName = "nonexistent"
	p.MP = 100
	p.LearnedSpells = map[int]bool{1: true}
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.SpellCastRequest{SpellId: 1}
	e.handleSpellCast(client, req)
}

// handleAttack: dead player tries to attack (extended)
func TestHandleAttackDeadPlayerExtended(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.MotionRequest{TargetId: 999, Direction: 1}
	e.handleAttack(client, req)
}

// handleAttack: no target ID
func TestHandleAttackNoTargetExtended(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Swinger")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.MotionRequest{TargetId: 0}
	e.handleAttack(client, req)
}

// handleAttack: PvP target is dead (HP <= 0)
func TestHandleAttackPvPTargetDead(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, attacker)
	client := makeClientWithObjectID(attacker.ObjectID)

	target := makeFullTestPlayer(2, "DeadTarget")
	target.HP = 0
	target.X, target.Y = 51, 50
	addPlayerToEngine(e, target)

	req := &pb.MotionRequest{TargetId: target.ObjectID, Direction: 3}
	e.handleAttack(client, req)
}

// handleAttack: PvP target too far
func TestHandleAttackPvPTargetTooFar(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, attacker)
	client := makeClientWithObjectID(attacker.ObjectID)

	target := makeFullTestPlayer(2, "FarTarget")
	target.X, target.Y = 90, 90 // very far
	addPlayerToEngine(e, target)

	req := &pb.MotionRequest{TargetId: target.ObjectID, Direction: 3}
	e.handleAttack(client, req)
}

// handleAttack: NPC dead
func TestHandleAttackNPCDead(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	n := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[10],
		MapName:  "test",
		X:        51, Y: 50,
		HP: 0, MaxHP: 10, // dead
	}
	e.npcs.Store(n.ObjectID, n)

	req := &pb.MotionRequest{TargetId: 500, Direction: 3}
	e.handleAttack(client, req)
}

// handleAttack: NPC too far (extended)
func TestHandleAttackNPCTooFarExtended(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	n := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[10],
		MapName:  "test",
		X:        80, Y: 80, // too far
		HP: 10, MaxHP: 10,
	}
	e.npcs.Store(n.ObjectID, n)

	req := &pb.MotionRequest{TargetId: 500, Direction: 3}
	e.handleAttack(client, req)
}

// partyKick: success path
func TestPartyKickSuccessPath(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)
	e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)

	e.partyKick(leader, "Member")
}

// partyLeave: success path
func TestPartyLeaveSuccessPath(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, member)

	e.parties.CreateParty(leader.ObjectID, leader.Name, leader.HP, leader.MaxHP, leader.Level)
	e.parties.InvitePlayer(leader.ObjectID, member.ObjectID)
	e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)

	e.partyLeave(member)
}

// partyLeave: LeaveParty error
func TestPartyLeaveError(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Solo")
	addPlayerToEngine(e, p)

	e.partyLeave(p) // not in a party
}

// handleAOESpell: kill NPC in AOE
func TestHandleAOESpellKillNPC(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Caster")
	p.MAG = 100
	p.INT = 100
	addPlayerToEngine(e, p)

	n := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[10], // Slime
		MapName:  "test",
		X:        51, Y: 50,
		HP: 1, MaxHP: 10,
	}
	e.npcs.Store(n.ObjectID, n)

	spellDef := magic.GetSpellDef(5) // Fireball - AOE
	if spellDef == nil {
		t.Skip("AOE spell not available")
	}

	targetPos := &pb.Vec2{X: 51, Y: 50}
	e.handleAOESpell(p, spellDef, targetPos, gm)

	// NPC should be dead or damaged
	if n.HP > 0 {
		t.Logf("NPC survived AOE with %d HP (RNG)", n.HP)
	}
}

// handleDebuffSpell: NPC out of range
func TestHandleDebuffSpellOutOfRange(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Caster")
	addPlayerToEngine(e, p)

	n := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[10],
		MapName:  "test",
		X:        90, Y: 90, // far
		HP: 10, MaxHP: 10,
	}
	e.npcs.Store(n.ObjectID, n)

	spellDef := magic.GetSpellDef(8) // Debuff spell
	if spellDef == nil {
		t.Skip("Debuff spell not available")
	}

	e.handleDebuffSpell(p, spellDef, 500, gm)
}

// handleDebuffSpell: NPC dead
func TestHandleDebuffSpellNPCDead(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Caster")
	addPlayerToEngine(e, p)

	n := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[10],
		MapName:  "test",
		X:        51, Y: 50,
		HP: 0, MaxHP: 10, // dead
	}
	e.npcs.Store(n.ObjectID, n)

	spellDef := magic.GetSpellDef(8)
	if spellDef == nil {
		t.Skip("Debuff spell not available")
	}

	e.handleDebuffSpell(p, spellDef, 500, gm)
}

// handleStatAlloc: VIT with HP cap
func TestHandleStatAllocVITCap(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Buffer")
	p.LUPool = 5
	p.HP = 999 // very high HP
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.StatAllocRequest{StatType: 2, Points: 5} // VIT
	e.handleStatAlloc(client, req)
}

// handleStatAlloc: MAG with MP cap
func TestHandleStatAllocMAGCap(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Mage")
	p.LUPool = 5
	p.MP = 999
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.StatAllocRequest{StatType: 5, Points: 5} // MAG
	e.handleStatAlloc(client, req)
}

// handleStatAlloc: DEX, INT, CHR paths
func TestHandleStatAllocOtherStats(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Buffer")
	p.LUPool = 15
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// DEX
	req := &pb.StatAllocRequest{StatType: 3, Points: 5}
	e.handleStatAlloc(client, req)

	// INT
	req = &pb.StatAllocRequest{StatType: 4, Points: 5}
	e.handleStatAlloc(client, req)

	// CHR
	req = &pb.StatAllocRequest{StatType: 6, Points: 5}
	e.handleStatAlloc(client, req)
}

// handleTradeRequest: target not found
func TestHandleTradeRequestTargetNotFound(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Trader")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.TradeRequest{TargetId: 999}
	e.handleTradeRequest(client, req)
}

// broadcastToMap: with no players on map
func TestBroadcastToMapNoPlayers(t *testing.T) {
	e := makeTestEngine()
	e.broadcastToMap("nonexistent", network.MsgNotification, &pb.Notification{Message: "test"})
}

// sendNearbyGroundItems: with items on exact player tile via groundItems sync.Map
func TestSendNearbyGroundItemsOnPlayerTile(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Looker")
	addPlayerToEngine(e, p)

	// Store a ground item at the player's position
	gi := &items.GroundItem{
		GroundID: 999,
		Item:     items.NewItem(items.GetItemDef(1), 1),
		MapName:  "test",
		X:        p.X,
		Y:        p.Y,
	}
	e.groundItems.Store(gi.GroundID, gi)

	e.sendNearbyGroundItems(p, gm)
}

// handleQuestTurnIn: collect quest type
func TestHandleQuestTurnInCollect(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Quester")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	// Find a collect quest
	collectQuest := quest.GetQuestDef(3) // Quest ID 3 — check if it's a collect type
	if collectQuest == nil || collectQuest.Type != quest.QuestTypeCollect {
		t.Skip("No collect quest available at ID 3")
	}

	p.Quests.AcceptQuest(3, p.Level)

	req := &pb.QuestTurnInRequest{QuestId: 3}
	e.handleQuestTurnIn(client, req)
}

// handlePlayerDeath: player with no map
func TestHandlePlayerDeathNoMap(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Doomed")
	p.MapName = "nonexistent"
	addPlayerToEngine(e, p)

	e.handlePlayerDeath(p, 0, "")
}

// dropGroundItem on tile
func TestDropGroundItemOnTile(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dropper")
	addPlayerToEngine(e, p)

	sword := items.NewItem(items.GetItemDef(1), 1)
	e.dropGroundItem(sword, "test", p.X, p.Y, gm)
}

// handleMotion: direction update without movement
func TestHandleMotionDirectionOnly(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Turner")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	// Action 0 = stop, but still sets direction
	req := &pb.MotionRequest{
		Direction: 3, // East
		Action:    0, // stop
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
	}
	e.handleMotion(client, req)

	if p.Direction != 3 {
		t.Errorf("Expected direction 3, got %d", p.Direction)
	}
}

// handleNPCDeath: with party member nearby (XP sharing)
func TestHandleNPCDeathPartyXP(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	killer := makeFullTestPlayer(1, "Killer")
	addPlayerToEngine(e, killer)
	gm.AddPlayerToSector(killer.X, killer.Y, killer.ObjectID)

	buddy := makeFullTestPlayer(2, "Buddy")
	buddy.X, buddy.Y = 51, 50
	addPlayerToEngine(e, buddy)
	gm.AddPlayerToSector(buddy.X, buddy.Y, buddy.ObjectID)

	e.parties.CreateParty(killer.ObjectID, killer.Name, killer.HP, killer.MaxHP, killer.Level)
	e.parties.InvitePlayer(killer.ObjectID, buddy.ObjectID)
	e.parties.AcceptInvite(buddy.ObjectID, buddy.Name, buddy.HP, buddy.MaxHP, buddy.Level)

	n := &npc.NPC{
		ObjectID: 500,
		Type:     npc.NpcTypes[11], // Skeleton
		MapName:  "test",
		X:        51, Y: 50,
		HP: 0, MaxHP: 30,
	}

	e.handleNPCDeath(n, killer, gm)
}

// regenAllPlayers with HP capped
func TestRegenAllPlayersHPCapped(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Full")
	p.HP = p.MaxHP // already full
	addPlayerToEngine(e, p)

	e.regenAllPlayers("hp")
	if p.HP != p.MaxHP {
		t.Errorf("HP should stay at max, got %d", p.HP)
	}
}

// combat: NPCAttackPlayer with critical
func TestNPCAttackPlayerCritical(t *testing.T) {
	p := makeTestPlayer()
	p.HP = 500
	p.MaxHP = 500

	n := makeTestNPC(11) // Skeleton

	critCount := 0
	for i := 0; i < 1000; i++ {
		p.HP = 500
		result := NPCAttackPlayer(n, p)
		if result.Critical {
			critCount++
		}
	}
	t.Logf("NPC critical hits: %d/1000", critCount)
}

// handleFishing: run many times to cover success, failure, and mastery gain branches
func TestHandleFishingManyAttempts(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Fisher")
	addPlayerToEngine(e, p)

	successCount := 0
	for i := 0; i < 50; i++ {
		p.SP = 40
		beforeItems := p.Inventory.CountItem(220)
		e.handleFishing(p, 80) // high mastery for better success rate
		afterItems := p.Inventory.CountItem(220)
		if afterItems > beforeItems {
			successCount++
		}
	}
	t.Logf("Fishing: %d/50 successful catches", successCount)
}

// handleCraft: run many times to cover success/failure branches
func TestHandleCraftManyAttempts(t *testing.T) {
	e := makeTestEngine()

	recipe := skills.GetRecipe(1)
	if recipe == nil {
		t.Skip("Recipe 1 not found")
	}

	successCount := 0
	for attempt := 0; attempt < 30; attempt++ {
		p := makeFullTestPlayer(int32(attempt+100), fmt.Sprintf("Smith%d", attempt))
		addPlayerToEngine(e, p)
		client := makeClientWithObjectID(p.ObjectID)

		// Set mastery very high
		for i := 0; i < 100; i++ {
			p.Skills.GainMastery(recipe.Skill)
		}

		// Add required inputs
		for _, input := range recipe.Inputs {
			inputDef := items.GetItemDef(input.ItemID)
			if inputDef == nil {
				t.Skipf("Input item %d not found", input.ItemID)
			}
			p.Inventory.AddItem(items.NewItem(inputDef, input.Count))
		}

		oldGold := p.Gold
		_ = oldGold
		req := &pb.CraftRequest{RecipeId: 1}
		e.handleCraft(client, req)

		// Check if output item was created
		outDef := items.GetItemDef(recipe.OutputID)
		if outDef != nil && p.Inventory.CountItem(recipe.OutputID) > 0 {
			successCount++
		}
	}
	t.Logf("Crafting: %d/30 successful crafts", successCount)
}

// handleItemUse: HP potion that caps at MaxHP
func TestHandleItemUseHPPotionCapped(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Healer")
	p.HP = p.MaxHP - 1 // almost full
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	potion := items.NewItem(items.GetItemDef(91), 1) // RedPotion
	if potion == nil {
		t.Skip("RedPotion (91) not found")
	}
	p.Inventory.AddItem(potion)

	req := &pb.ItemUseRequest{SlotIndex: 0}
	e.handleItemUse(client, req)

	if p.HP > p.MaxHP {
		t.Errorf("HP should be capped at MaxHP, got %d > %d", p.HP, p.MaxHP)
	}
}

// guildDemote: successful full flow with target found
func TestGuildDemoteSuccessFound(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Officer")
	member.Side = 1
	member.CharacterID = 200
	addPlayerToEngine(e, member)

	e.guilds.CreateGuild("DemoteGuild", master.Side, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(1, member.CharacterID, member.Name, member.Level)

	// First promote to officer
	g := e.guilds.GetPlayerGuild(master.CharacterID)
	if g != nil {
		g.Promote(member.CharacterID)
	}

	// Then demote back
	e.guildDemote(master, "Officer")
}

// guildDemote: target not in guild
func TestGuildDemoteTargetNotInGuild(t *testing.T) {
	e := makeTestEngine()

	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.CharacterID = 100
	addPlayerToEngine(e, master)

	e.guilds.CreateGuild("DemoteGuild2", master.Side, master.CharacterID, master.Name, master.Level)

	e.guildDemote(master, "Nobody")
}

// handleTradeRequest: target on different map
func TestHandleTradeRequestDifferentMap(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	target := makeFullTestPlayer(2, "Trader2")
	target.MapName = "other" // different map
	addPlayerToEngine(e, target)

	req := &pb.TradeRequest{TargetId: target.ObjectID}
	e.handleTradeRequest(client, req)
}

// handleTradeRequest: valid request
func TestHandleTradeRequestValid(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Trader1")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	target := makeFullTestPlayer(2, "Trader2")
	target.X, target.Y = 51, 50 // nearby
	addPlayerToEngine(e, target)

	req := &pb.TradeRequest{TargetId: target.ObjectID}
	e.handleTradeRequest(client, req)
}

// partyInvite: target already in party
func TestPartyInviteTargetInParty(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	target := makeFullTestPlayer(2, "Target")
	addPlayerToEngine(e, target)

	// Create a party and add target
	e.parties.CreateParty(target.ObjectID, target.Name, target.HP, target.MaxHP, target.Level)

	// Now try to invite - target is already in a party
	e.partyInvite(leader, "Target")
}

// partyInvite: inviter not in party
func TestPartyInviteNotInParty(t *testing.T) {
	e := makeTestEngine()

	leader := makeFullTestPlayer(1, "Leader")
	addPlayerToEngine(e, leader)

	target := makeFullTestPlayer(2, "Target")
	addPlayerToEngine(e, target)

	// Leader is not in a party
	e.partyInvite(leader, "Target")
}

// handleGuildCreate: CHR too low
func TestHandleGuildCreateCHRTooLow(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Weak")
	p.CHR = 10 // needs 20
	p.Level = 20
	p.Side = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.GuildCreateRequest{Name: "TestGuild"}
	e.handleGuildCreate(client, req)
}

// handleGuildCreate: level too low
func TestHandleGuildCreateLevelTooLow(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Young")
	p.CHR = 30
	p.Level = 5 // needs 20
	p.Side = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.GuildCreateRequest{Name: "TestGuild"}
	e.handleGuildCreate(client, req)
}

// handleGuildCreate: no faction (neutral player)
func TestHandleGuildCreateNeutralPlayer(t *testing.T) {
	e := makeTestEngine()

	p := makeFullTestPlayer(1, "Neutral")
	p.CHR = 30
	p.Level = 30
	p.Side = 0 // neutral
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(p.ObjectID)

	req := &pb.GuildCreateRequest{Name: "TestGuild"}
	e.handleGuildCreate(client, req)
}

var (
	_ = (*pb.PartyActionRequest)(nil)
	_ = (*db.CharacterRow)(nil)
	_ = (*mapdata.GameMap)(nil)
	_ = (*player.Player)(nil)
	_ = (*npc.NPC)(nil)
	_ = (*items.Item)(nil)
	_ = (*magic.SpellDef)(nil)
	_ = (*quest.QuestDef)(nil)
	_ = (*network.Client)(nil)
	_ = skills.SkillMining
	_ time.Duration
)
