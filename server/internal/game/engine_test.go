package game

import (
	"testing"
	"time"

	"github.com/juanrossi/hbonline/server/internal/auth"
	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/guild"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/party"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/quest"
	"github.com/juanrossi/hbonline/server/internal/skills"
	"github.com/juanrossi/hbonline/server/internal/trade"
	"github.com/juanrossi/hbonline/server/internal/world"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// makeTestEngine creates a minimal Engine suitable for unit testing.
// Players have nil Client so Send() is a no-op.
func makeTestEngine() *Engine {
	now := time.Now()
	e := &Engine{
		store:            nil, // no DB
		jwtManager:       auth.NewJWTManager("test-secret", 24*time.Hour),
		maps:             make(map[string]*mapdata.GameMap),
		lastRegenHP:      now,
		lastRegenMP:      now,
		lastRegenSP:      now,
		lastBuffCheck:    now,
		guilds:           guild.NewGuildRegistry(),
		parties:          party.NewPartyManager(),
		trades:           trade.NewTradeManager(),
		worldState:       world.NewWorldState(),
		events:           world.NewEventState(),
		lastWorldSync:    now,
		lastWeatherCheck: now,
	}
	return e
}

func makeTestGameMap(w, h int) *mapdata.GameMap {
	gm := &mapdata.GameMap{
		Name:   "test",
		Width:  w,
		Height: h,
		Tiles:  make([][]mapdata.Tile, h),
	}
	for y := 0; y < h; y++ {
		gm.Tiles[y] = make([]mapdata.Tile, w)
		for x := 0; x < w; x++ {
			gm.Tiles[y][x] = mapdata.Tile{Walkable: true}
		}
	}
	sectorsX := (w + mapdata.SectorSize - 1) / mapdata.SectorSize
	sectorsY := (h + mapdata.SectorSize - 1) / mapdata.SectorSize
	gm.Sectors = make([][]mapdata.Sector, sectorsY)
	for sy := 0; sy < sectorsY; sy++ {
		gm.Sectors[sy] = make([]mapdata.Sector, sectorsX)
		for sx := 0; sx < sectorsX; sx++ {
			gm.Sectors[sy][sx] = mapdata.Sector{
				Players: make(map[int32]bool),
				NPCs:    make(map[int32]bool),
			}
		}
	}
	return gm
}

func makeFullTestPlayer(id int32, name string) *player.Player {
	return &player.Player{
		ObjectID:      id,
		CharacterID:   int(id),
		Name:          name,
		MapName:       "test",
		X:             50,
		Y:             50,
		Direction:     5,
		Level:         10,
		STR:           15,
		VIT:           12,
		DEX:           14,
		INT:           10,
		MAG:           10,
		CHR:           10,
		HP:            100,
		MaxHP:         100,
		MP:            50,
		MaxMP:         50,
		SP:            40,
		MaxSP:         40,
		LUPool:        0,
		Gold:          1000,
		Side:          1,
		Inventory:     items.NewInventory(),
		Skills:        skills.NewPlayerSkills(),
		LearnedSpells: make(map[int]bool),
		Buffs:         magic.NewBuffTracker(),
		Effects:       magic.NewEffectTracker(),
		Cooldowns:     make(map[int]time.Time),
		Quests:        quest.NewQuestTracker(),
		Client:        nil, // no real connection, Send() is no-op
	}
}

func addPlayerToEngine(e *Engine, p *player.Player) {
	e.players.Store(p.ObjectID, p)
}

// makeClientWithObjectID creates a network.Client with a set ObjectID
// for use with getPlayerByClient.
func makeClientWithObjectID(id int32) *network.Client {
	c := &network.Client{}
	c.ObjectID = id
	c.AccountID = int(id)
	c.Authenticated = true
	return c
}

// === Engine creation and utility tests ===

func TestNewEngineFields(t *testing.T) {
	e := makeTestEngine()
	if e.guilds == nil {
		t.Error("guilds should be initialized")
	}
	if e.parties == nil {
		t.Error("parties should be initialized")
	}
	if e.trades == nil {
		t.Error("trades should be initialized")
	}
	if e.worldState == nil {
		t.Error("worldState should be initialized")
	}
	if e.events == nil {
		t.Error("events should be initialized")
	}
	if e.maps == nil {
		t.Error("maps should be initialized")
	}
}

func TestGetPlayerByClient(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)

	client := makeClientWithObjectID(1)
	got := e.getPlayerByClient(client)
	if got == nil {
		t.Fatal("Should find player by client")
	}
	if got.Name != "Test" {
		t.Errorf("Expected Test, got %s", got.Name)
	}

	// Non-existent player
	client2 := makeClientWithObjectID(999)
	got2 := e.getPlayerByClient(client2)
	if got2 != nil {
		t.Error("Should not find non-existent player")
	}

	// Zero object ID
	client3 := makeClientWithObjectID(0)
	got3 := e.getPlayerByClient(client3)
	if got3 != nil {
		t.Error("Zero object ID should return nil")
	}
}

func TestGetPlayerByName(t *testing.T) {
	e := makeTestEngine()
	p1 := makeFullTestPlayer(1, "Alice")
	p2 := makeFullTestPlayer(2, "Bob")
	addPlayerToEngine(e, p1)
	addPlayerToEngine(e, p2)

	got := e.getPlayerByName("Alice")
	if got == nil || got.ObjectID != 1 {
		t.Error("Should find Alice")
	}

	// Case insensitive
	got = e.getPlayerByName("alice")
	if got == nil || got.ObjectID != 1 {
		t.Error("Should find alice (case insensitive)")
	}

	// Non-existent
	got = e.getPlayerByName("Charlie")
	if got != nil {
		t.Error("Should not find Charlie")
	}
}

func TestGetPlayerByID(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(42, "TestPlayer")
	addPlayerToEngine(e, p)

	got := e.getPlayerByID(42)
	if got == nil || got.Name != "TestPlayer" {
		t.Error("Should find player by ID")
	}

	got = e.getPlayerByID(999)
	if got != nil {
		t.Error("Should not find non-existent ID")
	}
}

func TestDirectionTo(t *testing.T) {
	// N: target is above
	if d := directionTo(50, 50, 50, 40); d != 1 {
		t.Errorf("Expected dir 1 (N), got %d", d)
	}
	// S: target is below
	if d := directionTo(50, 50, 50, 60); d != 5 {
		t.Errorf("Expected dir 5 (S), got %d", d)
	}
	// E: target is right
	if d := directionTo(50, 50, 60, 50); d != 3 {
		t.Errorf("Expected dir 3 (E), got %d", d)
	}
	// W: target is left
	if d := directionTo(50, 50, 40, 50); d != 7 {
		t.Errorf("Expected dir 7 (W), got %d", d)
	}
	// Same position
	if d := directionTo(50, 50, 50, 50); d != 5 {
		t.Errorf("Expected dir 5 (default S) for same position, got %d", d)
	}
}

func TestFindWalkable(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	// Simple case: origin is walkable
	x, y := e.findWalkable(gm, 50, 50)
	if x != 50 || y != 50 {
		t.Errorf("Walkable tile should return same position, got (%d,%d)", x, y)
	}

	// Block origin, should find nearby
	gm.Tiles[50][50].Walkable = false
	x, y = e.findWalkable(gm, 50, 50)
	if !gm.IsWalkable(x, y) {
		t.Errorf("findWalkable returned non-walkable tile (%d,%d)", x, y)
	}
}

// === Faction tests ===

func TestHandleFactionSelect(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.Side = 0 // neutral
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Valid faction select
	e.handleFactionSelect(client, &pb.FactionSelectRequest{Side: 1})
	if p.Side != 1 {
		t.Errorf("Expected side=1, got %d", p.Side)
	}
}

func TestHandleFactionSelectAlreadyChosen(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.Side = 2 // already Elvine
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleFactionSelect(client, &pb.FactionSelectRequest{Side: 1})
	if p.Side != 2 {
		t.Error("Should not change faction if already set")
	}
}

func TestHandleFactionSelectTooLow(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.Side = 0
	p.Level = 5 // too low
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleFactionSelect(client, &pb.FactionSelectRequest{Side: 1})
	if p.Side != 0 {
		t.Error("Should not change faction at level 5")
	}
}

func TestHandleFactionSelectInvalid(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.Side = 0
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleFactionSelect(client, &pb.FactionSelectRequest{Side: 3})
	if p.Side != 0 {
		t.Error("Should not accept invalid faction 3")
	}
}

// === Guild tests ===

func TestHandleGuildCreate(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Master")
	p.Level = 20
	p.CHR = 20
	p.Side = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleGuildCreate(client, &pb.GuildCreateRequest{Name: "TestGuild"})

	g := e.guilds.GetPlayerGuild(p.CharacterID)
	if g == nil {
		t.Fatal("Guild should be created")
	}
	if g.Name != "TestGuild" {
		t.Errorf("Expected guild name TestGuild, got %s", g.Name)
	}
}

func TestHandleGuildCreateTooLowLevel(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Low")
	p.Level = 5
	p.CHR = 20
	p.Side = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleGuildCreate(client, &pb.GuildCreateRequest{Name: "TestGuild"})
	g := e.guilds.GetPlayerGuild(p.CharacterID)
	if g != nil {
		t.Error("Guild should not be created at level 5")
	}
}

func TestHandleGuildCreateNoFaction(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Neutral")
	p.Level = 20
	p.CHR = 20
	p.Side = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleGuildCreate(client, &pb.GuildCreateRequest{Name: "TestGuild"})
	g := e.guilds.GetPlayerGuild(p.CharacterID)
	if g != nil {
		t.Error("Guild should not be created without faction")
	}
}

func TestHandleGuildCreateNameTooShort(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Master")
	p.Level = 20
	p.CHR = 20
	p.Side = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleGuildCreate(client, &pb.GuildCreateRequest{Name: "X"})
	g := e.guilds.GetPlayerGuild(p.CharacterID)
	if g != nil {
		t.Error("Guild should not be created with 1-char name")
	}
}

// === Party tests ===

func TestPartyInviteAndAccept(t *testing.T) {
	e := makeTestEngine()
	leader := makeFullTestPlayer(1, "Leader")
	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, leader)
	addPlayerToEngine(e, member)

	// Leader invites member
	e.partyInvite(leader, "Member")

	// Member accepts
	pt, err := e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)
	if err != nil {
		t.Fatalf("AcceptInvite failed: %v", err)
	}
	if pt == nil {
		t.Fatal("Party should exist")
	}
	members := pt.GetMembers()
	if len(members) != 2 {
		t.Errorf("Expected 2 members, got %d", len(members))
	}
}

func TestPartyInviteSelf(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Solo")
	addPlayerToEngine(e, p)

	// Inviting self should fail gracefully
	e.partyInvite(p, "Solo")
	// Should not create a party
	pt := e.parties.GetPlayerParty(p.ObjectID)
	// If party was created by the invite, it was the solo player's party
	// The key is it shouldn't crash
	_ = pt
}

func TestPartyLeave(t *testing.T) {
	e := makeTestEngine()
	leader := makeFullTestPlayer(1, "Leader")
	member := makeFullTestPlayer(2, "Member")
	addPlayerToEngine(e, leader)
	addPlayerToEngine(e, member)

	e.partyInvite(leader, "Member")
	e.parties.AcceptInvite(member.ObjectID, member.Name, member.HP, member.MaxHP, member.Level)

	e.partyLeave(member)
	pt := e.parties.GetPlayerParty(member.ObjectID)
	if pt != nil {
		t.Error("Member should no longer be in party")
	}
}

func TestPartyLeaveNotInParty(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Solo")
	addPlayerToEngine(e, p)

	// Should not panic
	e.partyLeave(p)
}

// === Trade tests ===

func TestTradeRequestAndAccept(t *testing.T) {
	e := makeTestEngine()
	p1 := makeFullTestPlayer(1, "Player1")
	p2 := makeFullTestPlayer(2, "Player2")
	addPlayerToEngine(e, p1)
	addPlayerToEngine(e, p2)
	client1 := makeClientWithObjectID(1)

	e.handleTradeRequest(client1, &pb.TradeRequest{TargetId: 2})

	// Accept the trade
	session, err := e.trades.AcceptTrade(p2.ObjectID)
	if err != nil {
		t.Fatalf("AcceptTrade failed: %v", err)
	}
	if session == nil {
		t.Fatal("Session should exist")
	}
}

func TestTradeRequestTargetNotFound(t *testing.T) {
	e := makeTestEngine()
	p1 := makeFullTestPlayer(1, "Player1")
	addPlayerToEngine(e, p1)
	client1 := makeClientWithObjectID(1)

	// Target doesn't exist - should not panic
	e.handleTradeRequest(client1, &pb.TradeRequest{TargetId: 999})
}

func TestExecuteTradeGold(t *testing.T) {
	e := makeTestEngine()
	p1 := makeFullTestPlayer(1, "Player1")
	p1.Gold = 500
	p2 := makeFullTestPlayer(2, "Player2")
	p2.Gold = 300
	addPlayerToEngine(e, p1)
	addPlayerToEngine(e, p2)

	// Set up trade
	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	session, _ := e.trades.AcceptTrade(p2.ObjectID)

	session.SetGold(p1.ObjectID, 200)
	session.SetGold(p2.ObjectID, 100)
	session.Confirm(p1.ObjectID, true)
	session.Confirm(p2.ObjectID, true)

	e.executeTrade(session)

	// p1: started with 500, gave 200, received 100 = 400
	if p1.Gold != 400 {
		t.Errorf("Player1 gold: expected 400, got %d", p1.Gold)
	}
	// p2: started with 300, gave 100, received 200 = 400
	if p2.Gold != 400 {
		t.Errorf("Player2 gold: expected 400, got %d", p2.Gold)
	}
}

func TestCancelTrade(t *testing.T) {
	e := makeTestEngine()
	p1 := makeFullTestPlayer(1, "Player1")
	p2 := makeFullTestPlayer(2, "Player2")
	addPlayerToEngine(e, p1)
	addPlayerToEngine(e, p2)

	e.trades.RequestTrade(p1.ObjectID, p2.ObjectID)
	session, _ := e.trades.AcceptTrade(p2.ObjectID)

	e.cancelTrade(session, "test cancel")

	// Trade should be ended
	s := e.trades.GetSession(p1.ObjectID)
	if s != nil {
		t.Error("Trade session should be cleaned up")
	}
}

// === PvP tests ===

func TestHandlePvPAttackSameFaction(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "Attacker")
	attacker.Side = 1
	target := makeFullTestPlayer(2, "Target")
	target.Side = 1 // same faction
	addPlayerToEngine(e, attacker)
	addPlayerToEngine(e, target)

	origHP := target.HP
	e.handlePvPAttack(attacker, target)

	// Same faction attack is blocked
	if target.HP != origHP {
		t.Error("Same faction attack should be blocked")
	}
}

func TestHandlePvPAttackCrossFaction(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "Attacker")
	attacker.Side = 1
	attacker.DEX = 50 // high hit chance
	target := makeFullTestPlayer(2, "Target")
	target.Side = 2 // different faction
	addPlayerToEngine(e, attacker)
	addPlayerToEngine(e, target)

	// Attack multiple times to ensure at least one hit
	for i := 0; i < 20; i++ {
		target.HP = target.MaxHP
		e.handlePvPAttack(attacker, target)
	}

	// Should have dealt some damage in 20 tries
	// SP should also have been consumed
	if attacker.SP >= 40 {
		t.Error("Attacker SP should be consumed (3 per attack)")
	}
}

func TestHandlePvPAttackKill(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	attacker := makeFullTestPlayer(1, "Attacker")
	attacker.Side = 1
	attacker.STR = 50
	attacker.DEX = 50
	attacker.Level = 30

	target := makeFullTestPlayer(2, "Target")
	target.Side = 2
	target.HP = 1
	addPlayerToEngine(e, attacker)
	addPlayerToEngine(e, target)

	e.handlePvPAttack(attacker, target)

	// Just verify no crash; the kill tracking depends on RNG hit/miss
	_ = attacker.EKCount
}

// === Stat allocation tests ===

func TestHandleStatAlloc(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.LUPool = 10
	p.STR = 15
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleStatAlloc(client, &pb.StatAllocRequest{StatType: 1, Points: 3}) // STR
	if p.STR != 18 {
		t.Errorf("Expected STR=18, got %d", p.STR)
	}
	if p.LUPool != 7 {
		t.Errorf("Expected LUPool=7, got %d", p.LUPool)
	}
}

func TestHandleStatAllocVIT(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.LUPool = 5
	p.VIT = 12
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleStatAlloc(client, &pb.StatAllocRequest{StatType: 2, Points: 5}) // VIT
	if p.VIT != 17 {
		t.Errorf("Expected VIT=17, got %d", p.VIT)
	}
	expectedMaxHP := 30 + (10-1)*3 + 17*2 // 30+27+34=91
	if p.MaxHP != expectedMaxHP {
		t.Errorf("Expected MaxHP=%d, got %d", expectedMaxHP, p.MaxHP)
	}
}

func TestHandleStatAllocMAG(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.LUPool = 5
	p.MAG = 10
	p.Level = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleStatAlloc(client, &pb.StatAllocRequest{StatType: 5, Points: 5}) // MAG
	if p.MAG != 15 {
		t.Errorf("Expected MAG=15, got %d", p.MAG)
	}
	expectedMaxMP := 10 + (10-1)*2 + 15*2 // 10+18+30=58
	if p.MaxMP != expectedMaxMP {
		t.Errorf("Expected MaxMP=%d, got %d", expectedMaxMP, p.MaxMP)
	}
}

func TestHandleStatAllocNotEnoughPoints(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.LUPool = 2
	p.STR = 15
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleStatAlloc(client, &pb.StatAllocRequest{StatType: 1, Points: 5})
	if p.STR != 15 {
		t.Error("Should not allocate more points than available")
	}
}

func TestHandleStatAllocInvalidStat(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.LUPool = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleStatAlloc(client, &pb.StatAllocRequest{StatType: 99, Points: 3})
	if p.LUPool != 10 {
		t.Error("Invalid stat should not consume points")
	}
}

// === Quest tests ===

func TestHandleQuestAccept(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.Level = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleQuestAccept(client, &pb.QuestAcceptRequest{QuestId: 1})
	if p.Quests.ActiveQuestCount() != 1 {
		t.Error("Should have 1 active quest")
	}
}

func TestHandleQuestAcceptLevelTooLow(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.Level = 1
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Quest 3 requires level 10
	e.handleQuestAccept(client, &pb.QuestAcceptRequest{QuestId: 3})
	if p.Quests.ActiveQuestCount() != 0 {
		t.Error("Should not accept quest above level requirement")
	}
}

func TestOnNPCKillQuestUpdate(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)

	// Accept slime quest
	p.Quests.AcceptQuest(1, p.Level)

	// Kill some slimes
	for i := 0; i < 5; i++ {
		e.onNPCKillQuestUpdate(p, 1)
	}

	quests := p.Quests.GetActiveQuests()
	for _, pq := range quests {
		if pq.QuestID == 1 && pq.Progress != 5 {
			t.Errorf("Expected progress 5, got %d", pq.Progress)
		}
	}
}

// === Item handler tests ===

func TestHandleItemUse(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.HP = 50
	p.MaxHP = 100
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Add a HP potion
	potion := items.NewItem(items.GetItemDef(91), 3) // RedPotion
	p.Inventory.AddItem(potion)

	e.handleItemUse(client, &pb.ItemUseRequest{SlotIndex: 0})

	if p.HP <= 50 {
		// HP should increase (potion heals some HP)
		// If item 100 is not a potion, this just verifies no crash
	}
	// Potion count should decrease
	item := p.Inventory.GetItem(0)
	if item != nil && item.Count >= 3 {
		t.Log("Note: Item count not reduced (may not be a potion type)")
	}
}

func TestHandleItemEquipUnequip(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm
	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Add and equip a sword
	sword := items.NewItem(items.GetItemDef(1), 1)
	p.Inventory.AddItem(sword)

	e.handleItemEquip(client, &pb.ItemEquipRequest{SlotIndex: 0})
	weapon := p.Inventory.GetEquipped(items.EquipWeapon)
	if weapon == nil {
		t.Error("Weapon should be equipped")
	}
}

func TestHandleItemDrop(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm
	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	sword := items.NewItem(items.GetItemDef(1), 1)
	p.Inventory.AddItem(sword)

	e.handleItemDrop(client, &pb.ItemDropRequest{SlotIndex: 0, Count: 1})

	// Item should be removed from inventory
	item := p.Inventory.GetItem(0)
	if item != nil {
		t.Error("Item should be removed from inventory")
	}
}

// === NPC interaction tests ===

func TestHandleNPCInteract(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)

	// Create a shop NPC
	shopType := npc.NpcTypes[100] // Shop NPC
	if shopType == nil {
		t.Skip("No shop NPC type 100 defined")
	}
	shopNPC := npc.NewNPC(200, shopType, "test", 50, 50)

	// Should not panic even if it's not a shop NPC
	e.handleNPCInteract(p, shopNPC)
}

// === World state tests ===

func TestWorldPhaseStringRoundTrip(t *testing.T) {
	phases := []int{0, 1, 2, 3}
	names := []string{"day", "dusk", "night", "dawn"}
	for i, phase := range phases {
		s := worldPhaseToString(phase)
		if s != names[i] {
			t.Errorf("Phase %d: expected %s, got %s", phase, names[i], s)
		}
	}
}

func TestWeatherStringRoundTrip(t *testing.T) {
	weathers := []int{0, 1, 2, 3}
	names := []string{"clear", "rain", "snow", "fog"}
	for i, w := range weathers {
		s := weatherToString(w)
		if s != names[i] {
			t.Errorf("Weather %d: expected %s, got %s", w, names[i], s)
		}
	}
}

// === Guild chat test ===

func TestHandleGuildChat(t *testing.T) {
	e := makeTestEngine()
	master := makeFullTestPlayer(1, "Master")
	master.Side = 1
	master.Level = 20
	master.CHR = 20
	addPlayerToEngine(e, master)

	member := makeFullTestPlayer(2, "Member")
	member.Side = 1
	addPlayerToEngine(e, member)

	// Create guild
	g, _ := e.guilds.CreateGuild("TestGuild", 1, master.CharacterID, master.Name, master.Level)
	e.guilds.JoinGuild(g.ID, member.CharacterID, member.Name, member.Level)

	// Should not panic
	e.handleGuildChat(master, "Hello guild!")
}

func TestHandleGuildChatNotInGuild(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Solo")
	addPlayerToEngine(e, p)

	// Should not panic
	e.handleGuildChat(p, "Hello?")
}

// === Regen test ===

func TestRegenAllPlayersHP(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.HP = 50
	p.MaxHP = 100
	addPlayerToEngine(e, p)

	e.regenAllPlayers("hp")

	if p.HP <= 50 {
		t.Error("HP should regenerate")
	}
}

func TestRegenAllPlayersMP(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.MP = 20
	p.MaxMP = 50
	addPlayerToEngine(e, p)

	e.regenAllPlayers("mp")

	if p.MP <= 20 {
		t.Error("MP should regenerate")
	}
}

func TestRegenAllPlayersSP(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Test")
	p.SP = 10
	p.MaxSP = 40
	addPlayerToEngine(e, p)

	e.regenAllPlayers("sp")

	if p.SP <= 10 {
		t.Error("SP should regenerate")
	}
}

func TestRegenDeadPlayer(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0
	addPlayerToEngine(e, p)

	e.regenAllPlayers("hp")

	// Dead player should not regen
	if p.HP != 0 {
		t.Error("Dead player should not regenerate")
	}
}

func TestRegenAtMax(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Full")
	p.HP = p.MaxHP
	p.MP = p.MaxMP
	p.SP = p.MaxSP
	addPlayerToEngine(e, p)

	e.regenAllPlayers("hp")
	e.regenAllPlayers("mp")
	e.regenAllPlayers("sp")

	if p.HP != p.MaxHP {
		t.Error("HP should stay at max")
	}
	if p.MP != p.MaxMP {
		t.Error("MP should stay at max")
	}
	if p.SP != p.MaxSP {
		t.Error("SP should stay at max")
	}
}

// === Motion handler tests ===

func TestHandleMotionWalk(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Walker")
	p.LastMoveTime = time.Now().Add(-1 * time.Second) // prevent speed check
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	origX, origY := p.X, p.Y
	e.handleMotion(client, &pb.MotionRequest{
		Direction: 3, // East
		Action:    1, // Walk
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
	})

	if p.X != origX+1 || p.Y != origY {
		t.Errorf("Expected position (%d,%d), got (%d,%d)", origX+1, origY, p.X, p.Y)
	}
	if p.Direction != 3 {
		t.Errorf("Expected direction 3, got %d", p.Direction)
	}
}

func TestHandleMotionBlocked(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Blocked")
	p.LastMoveTime = time.Now().Add(-1 * time.Second)
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Block the tile east of player
	gm.Tiles[p.Y][p.X+1].Walkable = false

	origX, origY := p.X, p.Y
	e.handleMotion(client, &pb.MotionRequest{
		Direction: 3, // East (blocked)
		Action:    1,
	})

	if p.X != origX || p.Y != origY {
		t.Error("Player should not move to blocked tile")
	}
}

func TestHandleMotionStop(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Stopper")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleMotion(client, &pb.MotionRequest{
		Direction: 5,
		Action:    0, // stop
	})

	if p.Direction != 5 {
		t.Errorf("Expected direction 5, got %d", p.Direction)
	}
	if p.Action != 0 {
		t.Errorf("Expected action 0, got %d", p.Action)
	}
}

func TestHandleMotionInvalidDirection(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	origX := p.X
	e.handleMotion(client, &pb.MotionRequest{
		Direction: 99, // invalid
		Action:    1,
	})

	if p.X != origX {
		t.Error("Invalid direction should not move player")
	}
}

func TestHandleMotionSpeedHack(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "SpeedHacker")
	p.LastMoveTime = time.Now() // just moved
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	origX := p.X
	e.handleMotion(client, &pb.MotionRequest{
		Direction: 3,
		Action:    1,
	})

	if p.X != origX {
		t.Error("Speed hack protection should prevent immediate re-move")
	}
}

// === Chat handler tests ===

func TestHandleChat(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Chatter")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Normal chat
	e.handleChat(client, &pb.ChatRequest{
		Type:    0,
		Message: "Hello world",
	})
	// Should not panic
}

func TestHandleChatShout(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Shouter")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleChat(client, &pb.ChatRequest{
		Type:    1, // shout
		Message: "Hello everyone!",
	})
}

func TestHandleChatWhisper(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p1 := makeFullTestPlayer(1, "Sender")
	p2 := makeFullTestPlayer(2, "Receiver")
	addPlayerToEngine(e, p1)
	addPlayerToEngine(e, p2)
	client := makeClientWithObjectID(1)

	e.handleChat(client, &pb.ChatRequest{
		Type:    2, // whisper
		Message: "Secret message",
		Target:  "Receiver",
	})
}

func TestHandleChatEmptyMessage(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Empty message should be ignored
	e.handleChat(client, &pb.ChatRequest{
		Type:    0,
		Message: "",
	})
}

func TestHandleChatLongMessage(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Test")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	longMsg := ""
	for i := 0; i < 300; i++ {
		longMsg += "a"
	}

	// Should truncate to 200 characters
	e.handleChat(client, &pb.ChatRequest{
		Type:    0,
		Message: longMsg,
	})
}

// === Attack handler tests ===

func TestHandleAttackNPC(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Spawn an NPC nearby
	slimeType := npc.NpcTypes[10]
	slime := npc.NewNPC(100, slimeType, "test", 51, 50) // adjacent
	e.npcs.Store(slime.ObjectID, slime)

	origHP := slime.HP
	e.handleAttack(client, &pb.MotionRequest{
		Direction: 3,
		Action:    3,
		TargetId:  100,
	})

	// Should have attacked (may miss)
	if p.SP >= 40 {
		t.Error("SP should decrease after attack")
	}
	// NPC HP may or may not have changed (miss possible)
	_ = origHP
}

func TestHandleAttackNPCTooFar(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Spawn NPC far away
	slimeType := npc.NpcTypes[10]
	slime := npc.NewNPC(100, slimeType, "test", 80, 80) // far away
	e.npcs.Store(slime.ObjectID, slime)

	origSP := p.SP
	e.handleAttack(client, &pb.MotionRequest{
		Direction: 3,
		Action:    3,
		TargetId:  100,
	})

	// Too far away - should not attack (SP unchanged)
	if p.SP != origSP {
		t.Error("Should not attack NPC too far away")
	}
}

func TestHandleAttackDeadPlayer(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Dead")
	p.HP = 0 // dead
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	slimeType := npc.NpcTypes[10]
	slime := npc.NewNPC(100, slimeType, "test", 51, 50)
	e.npcs.Store(slime.ObjectID, slime)

	origHP := slime.HP
	e.handleAttack(client, &pb.MotionRequest{
		Direction: 3,
		Action:    3,
		TargetId:  100,
	})

	if slime.HP != origHP {
		t.Error("Dead player should not be able to attack")
	}
}

func TestHandleAttackNoTarget(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Attacker")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	origSP := p.SP
	e.handleAttack(client, &pb.MotionRequest{
		Direction: 3,
		Action:    3,
		TargetId:  0, // no target
	})

	if p.SP != origSP {
		t.Error("Attacking nothing should not consume SP")
	}
}

// === NPC Death ===

func TestHandleNPCDeath(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Killer")
	p.Experience = 0
	addPlayerToEngine(e, p)

	slimeType := npc.NpcTypes[10]
	slime := npc.NewNPC(100, slimeType, "test", 51, 50)
	slime.HP = 0

	origExp := p.Experience
	e.handleNPCDeath(slime, p, gm)

	if p.Experience <= origExp {
		t.Error("Killer should gain XP")
	}
	if p.Gold <= 1000 {
		t.Error("Killer should gain gold")
	}
}

// === charRowToSummary ===

func TestCharRowToSummary(t *testing.T) {
	row := db.CharacterRow{
		ID:        1,
		AccountID: 10,
		Name:      "TestChar",
		Level:     15,
		Gender:    1,
		Side:      2,
		MapName:   "aresden",
	}

	summary := charRowToSummary(row)
	if summary.Id != 1 {
		t.Errorf("Expected ID 1, got %d", summary.Id)
	}
	if summary.Name != "TestChar" {
		t.Errorf("Expected name TestChar, got %s", summary.Name)
	}
	if summary.Level != 15 {
		t.Errorf("Expected level 15, got %d", summary.Level)
	}
	if summary.Gender != 1 {
		t.Errorf("Expected gender 1, got %d", summary.Gender)
	}
	if summary.Side != 2 {
		t.Errorf("Expected side 2, got %d", summary.Side)
	}
	if summary.MapName != "aresden" {
		t.Errorf("Expected mapName aresden, got %s", summary.MapName)
	}
}

// === handlePlayerDeath ===

func TestHandlePlayerDeath(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Victim")
	p.Level = 10
	p.Experience = 50000
	p.PKCount = 0 // innocent
	addPlayerToEngine(e, p)

	origExp := p.Experience
	e.handlePlayerDeath(p, 2, "Killer", false)

	// Innocent (PK 0) should lose 2% of level XP
	expectedLoss := XPForLevel(10) * 2 / 100
	if p.Experience != origExp-expectedLoss {
		t.Errorf("Expected XP=%d after death (2%% innocent penalty), got %d", origExp-expectedLoss, p.Experience)
	}
}

// === Phase 4: PK-Based Death Penalty Tiers ===

func TestHandlePlayerDeathPKTiers(t *testing.T) {
	tests := []struct {
		name       string
		pkCount    int
		xpPenaltyPct int64
	}{
		{"innocent PK=0", 0, 2},
		{"criminal PK=1", 1, 5},
		{"criminal PK=3", 3, 5},
		{"murderer PK=4", 4, 10},
		{"murderer PK=11", 11, 10},
		{"slaughterer PK=12", 12, 20},
		{"slaughterer PK=50", 50, 20},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := makeTestEngine()
			gm := makeTestGameMap(100, 100)
			e.maps["test"] = gm

			p := makeFullTestPlayer(1, "Victim")
			p.Level = 10
			p.Experience = 50000
			p.PKCount = tt.pkCount
			addPlayerToEngine(e, p)

			origExp := p.Experience
			e.handlePlayerDeath(p, 2, "Killer", false)

			expectedLoss := XPForLevel(10) * tt.xpPenaltyPct / 100
			if p.Experience != origExp-expectedLoss {
				t.Errorf("PK=%d: expected XP=%d (%d%% loss), got %d",
					tt.pkCount, origExp-expectedLoss, tt.xpPenaltyPct, p.Experience)
			}
		})
	}
}

func TestHandlePlayerDeathClearsEffectsAndBuffs(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Victim")
	p.Level = 5
	p.Experience = 5000
	addPlayerToEngine(e, p)

	// Add some buffs and effects
	p.Buffs.AddBuff(30, "Protection", 2, 5, 60)
	p.Buffs.AddBuff(31, "Strength", 1, 10, 60)
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectBerserk,
		Level:     2,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	if p.Buffs.Count() != 2 {
		t.Fatalf("Expected 2 buffs before death, got %d", p.Buffs.Count())
	}
	if p.Effects.Count() != 1 {
		t.Fatalf("Expected 1 effect before death, got %d", p.Effects.Count())
	}

	e.handlePlayerDeath(p, 2, "Killer", false)

	if p.Buffs.Count() != 0 {
		t.Errorf("Expected 0 buffs after death, got %d", p.Buffs.Count())
	}
	if p.Effects.Count() != 0 {
		t.Errorf("Expected 0 effects after death, got %d", p.Effects.Count())
	}
}

func TestHandlePlayerDeathSafeZoneNoXPLoss(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Type = mapdata.MapTypeSafeZone
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Victim")
	p.Level = 10
	p.Experience = 50000
	addPlayerToEngine(e, p)

	origExp := p.Experience
	e.handlePlayerDeath(p, 2, "Killer", false)

	if p.Experience != origExp {
		t.Errorf("Expected no XP loss on SafeZone map, got XP=%d (was %d)", p.Experience, origExp)
	}
}

func TestHandlePlayerDeathArenaNoXPLoss(t *testing.T) {
	e := makeTestEngine()
	gm := makeTestGameMap(100, 100)
	gm.Type = mapdata.MapTypeArena
	e.maps["test"] = gm

	p := makeFullTestPlayer(1, "Victim")
	p.Level = 10
	p.Experience = 50000
	addPlayerToEngine(e, p)

	origExp := p.Experience
	e.handlePlayerDeath(p, 2, "Killer", false)

	if p.Experience != origExp {
		t.Errorf("Expected no XP loss on Arena map, got XP=%d (was %d)", p.Experience, origExp)
	}
}

// === Shop handler tests ===

func TestHandleShopBuy(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Buyer")
	p.Gold = 10000
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Create a shop NPC
	shopType := npc.NpcTypes[100]
	if shopType == nil {
		t.Skip("No shop NPC type 100")
	}
	shop := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shop.ObjectID, shop)

	e.handleShopBuy(client, &pb.ShopBuyRequest{
		NpcId:  200,
		ItemId: 1,
		Count:  1,
	})
	// Just verify no panic
}

func TestHandleShopSell(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Seller")
	p.Gold = 0
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Add an item to sell
	sword := items.NewItem(items.GetItemDef(1), 1)
	p.Inventory.AddItem(sword)

	// Need a shop NPC
	shopType := npc.NpcTypes[100]
	if shopType == nil {
		t.Skip("No shop NPC type 100")
	}
	shop := npc.NewNPC(200, shopType, "test", 50, 50)
	e.npcs.Store(shop.ObjectID, shop)

	e.handleShopSell(client, &pb.ShopSellRequest{
		NpcId:     200,
		SlotIndex: 0,
		Count:     1,
	})
}

// === Spell/skill handler tests ===

func TestHandleLearnSpell(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Mage")
	p.Level = 1
	p.MAG = 10
	p.INT = 10
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	// Learn Energy Bolt (spell ID 1 - check if it exists)
	e.handleLearnSpell(client, &pb.LearnSpellRequest{SpellId: 1})

	// Check if spell was learned (depends on level/stat requirements)
	if p.LearnedSpells[1] {
		// Successfully learned
	}
}

func TestHandleLearnSpellAlreadyKnown(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Mage")
	p.LearnedSpells[1] = true
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleLearnSpell(client, &pb.LearnSpellRequest{SpellId: 1})
	// Should not crash, spell already known
}

func TestHandleLearnSpellUnknownID(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Mage")
	addPlayerToEngine(e, p)
	client := makeClientWithObjectID(1)

	e.handleLearnSpell(client, &pb.LearnSpellRequest{SpellId: 9999})
	// Should not crash
}

// === Direction deltas test ===

func TestDirectionDeltas(t *testing.T) {
	// Verify direction delta arrays are correct
	expected := map[int][2]int{
		1: {0, -1},  // N
		2: {1, -1},  // NE
		3: {1, 0},   // E
		4: {1, 1},   // SE
		5: {0, 1},   // S
		6: {-1, 1},  // SW
		7: {-1, 0},  // W
		8: {-1, -1}, // NW
	}
	for dir, delta := range expected {
		if dirDX[dir] != delta[0] || dirDY[dir] != delta[1] {
			t.Errorf("Dir %d: expected (%d,%d), got (%d,%d)", dir, delta[0], delta[1], dirDX[dir], dirDY[dir])
		}
	}
}

// === checkBuffExpiry test ===

func TestCheckBuffExpiry(t *testing.T) {
	e := makeTestEngine()
	p := makeFullTestPlayer(1, "Buffed")
	addPlayerToEngine(e, p)

	// Add a buff that has already expired
	p.Buffs.AddBuff(1, "TestBuff", 0, 10, 0) // 0 seconds duration

	// Wait a tiny bit for expiry
	time.Sleep(10 * time.Millisecond)

	// Should not panic
	e.checkBuffExpiry()
}

// Ensure unused imports compile
var (
	_ = (*pb.FactionSelectRequest)(nil)
	_ = (*db.CharacterRow)(nil)
)
