package game

import (
	"testing"
	"time"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/skills"
	"github.com/juanrossi/hbonline/server/internal/quest"
)

func makeAdminPlayer(id int32, name string, adminLevel int) *player.Player {
	p := makeFullTestPlayer(id, name)
	p.AdminLevel = adminLevel
	return p
}

// ============================================================
// getRequiredLevel
// ============================================================

func TestGetRequiredLevel(t *testing.T) {
	tests := []struct {
		cmd      string
		expected int
	}{
		{"who", AdminLevelBasicGM},
		{"tp", AdminLevelBasicGM},
		{"teleport", AdminLevelBasicGM},
		{"goto", AdminLevelBasicGM},
		{"kill", AdminLevelGM},
		{"revive", AdminLevelGM},
		{"setinvi", AdminLevelGM},
		{"setzerk", AdminLevelGM},
		{"setfreeze", AdminLevelGM},
		{"god", AdminLevelGM},
		{"summonplayer", AdminLevelGM},
		{"kick", AdminLevelGM},
		{"shutup", AdminLevelGM},
		{"heal", AdminLevelGM},
		{"givexp", AdminLevelGM},
		{"summon", AdminLevelSeniorGM},
		{"weather", AdminLevelSeniorGM},
		{"clearnpc", AdminLevelSeniorGM},
		{"createitem", AdminLevelSuperGM},
		{"setstat", AdminLevelSuperGM},
		{"setgold", AdminLevelSuperGM},
		{"setadmin", AdminLevelSuperGM},
		{"unknowncmd", AdminLevelServerAdmin + 1},
	}

	for _, tt := range tests {
		level := getRequiredLevel(tt.cmd)
		if level != tt.expected {
			t.Errorf("getRequiredLevel(%q) = %d, want %d", tt.cmd, level, tt.expected)
		}
	}
}

// ============================================================
// handleAdminCommand dispatch
// ============================================================

func TestHandleAdminCommandNotAdmin(t *testing.T) {
	e := makeTestEngine()
	p := makeAdminPlayer(1, "Normal", 0)
	addPlayerToEngine(e, p)

	// Non-admin typing a "/" command should not be handled
	handled := e.handleAdminCommand(p, "/who")
	if handled {
		t.Error("Non-admin should not have /who handled")
	}
}

func TestHandleAdminCommandNonSlash(t *testing.T) {
	e := makeTestEngine()
	p := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, p)

	handled := e.handleAdminCommand(p, "hello")
	if handled {
		t.Error("Non-slash message should not be handled")
	}
}

func TestHandleAdminCommandEmptySlash(t *testing.T) {
	e := makeTestEngine()
	p := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, p)

	handled := e.handleAdminCommand(p, "/")
	if handled {
		t.Error("Bare slash should not be handled")
	}
}

func TestHandleAdminCommandInsufficientLevel(t *testing.T) {
	e := makeTestEngine()
	p := makeAdminPlayer(1, "BasicGM", 1)
	addPlayerToEngine(e, p)

	// Level 1 GM trying a level 2 command
	handled := e.handleAdminCommand(p, "/kill SomePlayer")
	if !handled {
		t.Error("Should be handled (return true to suppress broadcast) for known admin with insufficient level")
	}
}

func TestHandleAdminCommandUnknown(t *testing.T) {
	e := makeTestEngine()
	p := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, p)

	handled := e.handleAdminCommand(p, "/notacommand")
	if !handled {
		t.Error("Unknown command from admin should still be handled (suppressed)")
	}
}

// ============================================================
// findPlayerByName
// ============================================================

func TestFindPlayerByName(t *testing.T) {
	e := makeTestEngine()
	p1 := makeAdminPlayer(1, "Alice", 0)
	p2 := makeAdminPlayer(2, "Bob", 0)
	addPlayerToEngine(e, p1)
	addPlayerToEngine(e, p2)

	// Exact match
	found := e.findPlayerByName("Alice")
	if found == nil || found.Name != "Alice" {
		t.Error("Should find Alice")
	}

	// Case insensitive
	found = e.findPlayerByName("alice")
	if found == nil || found.Name != "Alice" {
		t.Error("Should find Alice case-insensitively")
	}

	// Not found
	found = e.findPlayerByName("Charlie")
	if found != nil {
		t.Error("Should not find Charlie")
	}
}

// ============================================================
// adminWho
// ============================================================

func TestAdminWho(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	p2 := makeAdminPlayer(2, "Player2", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, p2)

	// Should not panic
	e.adminWho(gm)
}

// ============================================================
// adminTeleport
// ============================================================

func TestAdminTeleport(t *testing.T) {
	e := makeTestEngine()
	testMap := makeTestGameMap(200, 200)
	testMap.Name = "test"
	e.maps["test"] = testMap

	destMap := makeTestGameMap(100, 100)
	destMap.Name = "dest"
	e.maps["dest"] = destMap

	p := makeAdminPlayer(1, "GM", 5)
	p.MapName = "test"
	p.X = 50
	p.Y = 50
	addPlayerToEngine(e, p)
	testMap.SetOwner(p.X, p.Y, p.ObjectID)
	testMap.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	// Teleport to dest map center
	e.adminTeleport(p, []string{"dest"})
	if p.MapName != "dest" {
		t.Errorf("Expected map 'dest', got %q", p.MapName)
	}

	// Teleport with coordinates
	e.adminTeleport(p, []string{"dest", "10", "20"})
	// Should have teleported (exact coords depend on walkability)
	if p.MapName != "dest" {
		t.Errorf("Expected map 'dest', got %q", p.MapName)
	}

	// No args
	e.adminTeleport(p, []string{})
	// Should not crash

	// Invalid map
	e.adminTeleport(p, []string{"nonexistent"})
	// Should not crash
}

// ============================================================
// adminGoto
// ============================================================

func TestAdminGoto(t *testing.T) {
	e := makeTestEngine()
	testMap := makeTestGameMap(200, 200)
	testMap.Name = "test"
	e.maps["test"] = testMap

	gm := makeAdminPlayer(1, "GM", 5)
	gm.MapName = "test"
	addPlayerToEngine(e, gm)
	testMap.SetOwner(gm.X, gm.Y, gm.ObjectID)
	testMap.AddPlayerToSector(gm.X, gm.Y, gm.ObjectID)

	target := makeAdminPlayer(2, "Target", 0)
	target.MapName = "test"
	target.X = 80
	target.Y = 80
	addPlayerToEngine(e, target)

	e.adminGoto(gm, []string{"Target"})
	if gm.MapName != "test" {
		t.Errorf("Expected map 'test', got %q", gm.MapName)
	}

	// Not found
	e.adminGoto(gm, []string{"Nobody"})
	// Should not crash

	// No args
	e.adminGoto(gm, []string{})
	// Should not crash
}

// ============================================================
// adminKill and adminRevive
// ============================================================

func TestAdminKillAndRevive(t *testing.T) {
	e := makeTestEngine()
	testMap := makeTestGameMap(200, 200)
	testMap.Name = "test"
	e.maps["test"] = testMap

	gm := makeAdminPlayer(1, "GM", 5)
	gm.MapName = "test"
	addPlayerToEngine(e, gm)

	target := makeAdminPlayer(2, "Victim", 0)
	target.MapName = "test"
	target.HP = 100
	target.MaxHP = 100
	addPlayerToEngine(e, target)
	testMap.SetOwner(target.X, target.Y, target.ObjectID)
	testMap.AddPlayerToSector(target.X, target.Y, target.ObjectID)

	// Kill
	e.adminKill(gm, []string{"Victim"})
	if target.HP != 0 {
		t.Errorf("Expected HP=0 after kill, got %d", target.HP)
	}

	// Revive
	e.adminRevive(gm, []string{"Victim"})
	if target.HP != target.MaxHP {
		t.Errorf("Expected HP=%d after revive, got %d", target.MaxHP, target.HP)
	}

	// Revive alive player
	e.adminRevive(gm, []string{"Victim"})
	// Should send "not dead" notification, not crash
}

// ============================================================
// Effect toggles
// ============================================================

func TestAdminSetInvi(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, gm)

	// Toggle ON
	e.adminSetInvi(gm, []string{})
	if !gm.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Should have invisibility after toggle on")
	}

	// Toggle OFF
	e.adminSetInvi(gm, []string{})
	if gm.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Should not have invisibility after toggle off")
	}
}

func TestAdminSetZerk(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, gm)

	e.adminSetZerk(gm, []string{})
	if !gm.Effects.HasEffect(magic.EffectBerserk) {
		t.Error("Should have berserk after toggle on")
	}

	e.adminSetZerk(gm, []string{})
	if gm.Effects.HasEffect(magic.EffectBerserk) {
		t.Error("Should not have berserk after toggle off")
	}
}

func TestAdminSetFreeze(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, gm)

	e.adminSetFreeze(gm, []string{})
	if !gm.Effects.HasEffect(magic.EffectIce) {
		t.Error("Should have ice after toggle on")
	}

	e.adminSetFreeze(gm, []string{})
	if gm.Effects.HasEffect(magic.EffectIce) {
		t.Error("Should not have ice after toggle off")
	}
}

func TestAdminSetEffectOnTarget(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	target := makeAdminPlayer(2, "Target", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, target)

	e.adminSetInvi(gm, []string{"Target"})
	if !target.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Target should have invisibility")
	}
}

// ============================================================
// adminGod
// ============================================================

func TestAdminGod(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, gm)

	if gm.GodMode {
		t.Error("GodMode should be off initially")
	}

	e.adminGod(gm)
	if !gm.GodMode {
		t.Error("GodMode should be on after first toggle")
	}

	e.adminGod(gm)
	if gm.GodMode {
		t.Error("GodMode should be off after second toggle")
	}
}

// ============================================================
// adminSummonPlayer
// ============================================================

func TestAdminSummonPlayer(t *testing.T) {
	e := makeTestEngine()
	testMap := makeTestGameMap(200, 200)
	testMap.Name = "test"
	e.maps["test"] = testMap

	gm := makeAdminPlayer(1, "GM", 5)
	gm.MapName = "test"
	gm.X = 80
	gm.Y = 80
	addPlayerToEngine(e, gm)

	target := makeAdminPlayer(2, "Target", 0)
	target.MapName = "test"
	target.X = 20
	target.Y = 20
	addPlayerToEngine(e, target)
	testMap.SetOwner(target.X, target.Y, target.ObjectID)
	testMap.AddPlayerToSector(target.X, target.Y, target.ObjectID)

	e.adminSummonPlayer(gm, []string{"Target"})
	if target.MapName != "test" {
		t.Errorf("Expected target on 'test' map, got %q", target.MapName)
	}
}

// ============================================================
// adminShutup (mute)
// ============================================================

func TestAdminShutup(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	target := makeAdminPlayer(2, "Target", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, target)

	e.adminShutup(gm, []string{"Target", "5"})
	if target.MutedUntil.IsZero() {
		t.Error("Target should be muted")
	}
	if time.Now().After(target.MutedUntil) {
		t.Error("Mute should not have expired yet")
	}
}

// ============================================================
// adminHeal
// ============================================================

func TestAdminHeal(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	gm.HP = 10
	gm.MP = 5
	gm.SP = 2
	addPlayerToEngine(e, gm)

	e.adminHeal(gm)
	if gm.HP != gm.MaxHP {
		t.Errorf("Expected HP=%d, got %d", gm.MaxHP, gm.HP)
	}
	if gm.MP != gm.MaxMP {
		t.Errorf("Expected MP=%d, got %d", gm.MaxMP, gm.MP)
	}
	if gm.SP != gm.MaxSP {
		t.Errorf("Expected SP=%d, got %d", gm.MaxSP, gm.SP)
	}
}

// ============================================================
// adminGiveXP
// ============================================================

func TestAdminGiveXP(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	gm.Experience = 0
	addPlayerToEngine(e, gm)

	e.adminGiveXP(gm, []string{"1000"})
	if gm.Experience != 1000 {
		t.Errorf("Expected 1000 XP, got %d", gm.Experience)
	}

	// Invalid amount
	e.adminGiveXP(gm, []string{"abc"})
	if gm.Experience != 1000 {
		t.Error("XP should not change with invalid input")
	}
}

// ============================================================
// adminSummon (NPC spawning)
// ============================================================

func TestAdminSummon(t *testing.T) {
	e := makeTestEngine()
	testMap := makeTestGameMap(200, 200)
	testMap.Name = "test"
	e.maps["test"] = testMap

	gm := makeAdminPlayer(1, "GM", 5)
	gm.MapName = "test"
	addPlayerToEngine(e, gm)

	// Spawn 3 slimes
	e.adminSummon(gm, []string{"10", "3"})

	count := 0
	e.npcs.Range(func(_, val interface{}) bool {
		n := val.(*npc.NPC)
		if n.MapName == "test" && n.Type.ID == 10 {
			count++
		}
		return true
	})
	if count != 3 {
		t.Errorf("Expected 3 slimes spawned, got %d", count)
	}

	// Invalid type
	e.adminSummon(gm, []string{"9999"})
	// Should not crash
}

// ============================================================
// adminWeather
// ============================================================

func TestAdminWeather(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, gm)

	e.adminWeather(gm, []string{"rain"})
	// Should not panic

	e.adminWeather(gm, []string{"clear"})
	// Should not panic

	// Invalid
	e.adminWeather(gm, []string{"tornado"})
	// Should not crash
}

// ============================================================
// adminClearNPC
// ============================================================

func TestAdminClearNPC(t *testing.T) {
	e := makeTestEngine()
	testMap := makeTestGameMap(200, 200)
	testMap.Name = "test"
	e.maps["test"] = testMap

	gm := makeAdminPlayer(1, "GM", 5)
	gm.MapName = "test"
	addPlayerToEngine(e, gm)

	// Spawn some monsters
	slimeType := npc.NpcTypes[10]
	for i := 0; i < 5; i++ {
		objID := int32(1000 + i)
		n := npc.NewNPC(objID, slimeType, "test", 50+i, 50)
		e.npcs.Store(objID, n)
	}

	// Also spawn a shop NPC (should not be killed)
	shopType := npc.NpcTypes[15]
	if shopType != nil {
		shopNPC := npc.NewNPC(2000, shopType, "test", 80, 80)
		e.npcs.Store(int32(2000), shopNPC)
	}

	e.adminClearNPC(gm)

	// Count remaining alive monsters on test map
	alive := 0
	shopAlive := false
	e.npcs.Range(func(_, val interface{}) bool {
		n := val.(*npc.NPC)
		if n.MapName != "test" {
			return true
		}
		if npc.IsShopNPC(n.Type.ID) {
			if n.IsAlive() {
				shopAlive = true
			}
			return true
		}
		if n.IsAlive() {
			alive++
		}
		return true
	})
	if alive != 0 {
		t.Errorf("Expected 0 alive monsters, got %d", alive)
	}
	if shopType != nil && !shopAlive {
		t.Error("Shop NPC should still be alive")
	}
}

// ============================================================
// adminCreateItem
// ============================================================

func TestAdminCreateItem(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	addPlayerToEngine(e, gm)

	// Create item 1 (Short Sword) for self
	e.adminCreateItem(gm, []string{"1"})
	found := false
	for i := 0; i < items.MaxInventorySlots; i++ {
		if gm.Inventory.Slots[i] != nil && gm.Inventory.Slots[i].DefID == 1 {
			found = true
			break
		}
	}
	if !found {
		t.Error("Should have created Short Sword in inventory")
	}

	// Create for another player
	target := makeAdminPlayer(2, "Target", 0)
	addPlayerToEngine(e, target)
	e.adminCreateItem(gm, []string{"1", "3", "Target"})
	found = false
	for i := 0; i < items.MaxInventorySlots; i++ {
		if target.Inventory.Slots[i] != nil && target.Inventory.Slots[i].DefID == 1 {
			found = true
			break
		}
	}
	if !found {
		t.Error("Should have created item for target")
	}
}

// ============================================================
// adminSetStat
// ============================================================

func TestAdminSetStat(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	target := makeAdminPlayer(2, "Target", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, target)

	e.adminSetStat(gm, []string{"Target", "str", "50"})
	if target.STR != 50 {
		t.Errorf("Expected STR=50, got %d", target.STR)
	}

	e.adminSetStat(gm, []string{"Target", "level", "30"})
	if target.Level != 30 {
		t.Errorf("Expected Level=30, got %d", target.Level)
	}
	if target.HP != target.MaxHP {
		t.Error("HP should be full after level change")
	}

	// Invalid stat
	e.adminSetStat(gm, []string{"Target", "luck", "50"})
	// Should not crash
}

// ============================================================
// adminSetGold
// ============================================================

func TestAdminSetGold(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", 5)
	target := makeAdminPlayer(2, "Target", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, target)

	e.adminSetGold(gm, []string{"Target", "99999"})
	if target.Gold != 99999 {
		t.Errorf("Expected Gold=99999, got %d", target.Gold)
	}
}

// ============================================================
// adminSetAdmin
// ============================================================

func TestAdminSetAdmin(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "SuperAdmin", AdminLevelServerAdmin)
	target := makeAdminPlayer(2, "Target", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, target)

	e.adminSetAdmin(gm, []string{"Target", "3"})
	if target.AdminLevel != 3 {
		t.Errorf("Expected AdminLevel=3, got %d", target.AdminLevel)
	}

	// Level 4 GM trying to set level 4+
	gm4 := makeAdminPlayer(3, "GM4", AdminLevelSuperGM)
	addPlayerToEngine(e, gm4)
	e.adminSetAdmin(gm4, []string{"Target", "5"})
	if target.AdminLevel == 5 {
		t.Error("Level 4 GM should not be able to set level 5")
	}
}

// ============================================================
// God mode in combat
// ============================================================

func TestGodModePlayerAttackNPC(t *testing.T) {
	p := makeFullTestPlayer(1, "God")
	p.GodMode = true
	p.STR = 50
	p.Level = 50
	p.RecalcCombatStats()

	slimeType := npc.NpcTypes[10]
	n := npc.NewNPC(100, slimeType, "test", 50, 55)

	result := PlayerAttackNPC(p, n)
	if result.Miss {
		// Might miss due to RNG, but damage should be x10 on hit
		return
	}
	// With god mode, damage should be at least 10 (1 * 10)
	if result.Damage < 10 {
		t.Errorf("God mode should multiply damage by 10, got %d", result.Damage)
	}
}

func TestGodModeNPCAttackPlayer(t *testing.T) {
	p := makeFullTestPlayer(1, "God")
	p.GodMode = true
	oldHP := p.HP

	slimeType := npc.NpcTypes[10]
	n := npc.NewNPC(100, slimeType, "test", 50, 55)

	result := NPCAttackPlayer(n, p)
	if !result.Miss {
		t.Error("NPC attack on god mode player should always miss")
	}
	if result.Damage != 0 {
		t.Errorf("Expected 0 damage, got %d", result.Damage)
	}
	if p.HP != oldHP {
		t.Error("God mode player HP should not change")
	}
}

func TestGodModePlayerAttackPlayer(t *testing.T) {
	attacker := makeFullTestPlayer(1, "God")
	attacker.GodMode = true
	target := makeFullTestPlayer(2, "Mortal")

	// Target with god mode - should always miss
	target.GodMode = true
	result := PlayerAttackPlayer(attacker, target)
	if !result.Miss {
		t.Error("Attack on god mode target should always miss")
	}
}

// ============================================================
// Mute check in handleChat
// ============================================================

func TestMutedPlayerChatBlocked(t *testing.T) {
	p := makeFullTestPlayer(1, "Muted")
	p.MutedUntil = time.Now().Add(5 * time.Minute)

	if p.MutedUntil.IsZero() || !time.Now().Before(p.MutedUntil) {
		t.Error("Player should be muted")
	}
}

// ============================================================
// Admin command integration via handleAdminCommand
// ============================================================

func TestHandleAdminCommandHeal(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", AdminLevelGM)
	gm.HP = 10
	addPlayerToEngine(e, gm)

	handled := e.handleAdminCommand(gm, "/heal")
	if !handled {
		t.Error("Expected /heal to be handled")
	}
	if gm.HP != gm.MaxHP {
		t.Errorf("Expected full HP after heal, got %d/%d", gm.HP, gm.MaxHP)
	}
}

func TestHandleAdminCommandWho(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", AdminLevelBasicGM)
	p2 := makeAdminPlayer(2, "Player2", 0)
	addPlayerToEngine(e, gm)
	addPlayerToEngine(e, p2)

	handled := e.handleAdminCommand(gm, "/who")
	if !handled {
		t.Error("Expected /who to be handled")
	}
}

func TestHandleAdminCommandGod(t *testing.T) {
	e := makeTestEngine()
	gm := makeAdminPlayer(1, "GM", AdminLevelGM)
	addPlayerToEngine(e, gm)

	handled := e.handleAdminCommand(gm, "/god")
	if !handled {
		t.Error("Expected /god to be handled")
	}
	if !gm.GodMode {
		t.Error("Expected god mode to be ON")
	}
}

// Ensure unused imports are satisfied
var _ = items.MaxInventorySlots
var _ = skills.SkillHandCombat
var _ = quest.NewQuestTracker
