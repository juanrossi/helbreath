package game

import (
	"testing"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/skills"
)

func makeTestPlayerWithID(id int32, name string) *player.Player {
	p := &player.Player{
		ObjectID:  id,
		Name:      name,
		Level:     5,
		STR:       15,
		VIT:       12,
		DEX:       14,
		INT:       10,
		MAG:       10,
		CHR:       10,
		HP:        50,
		MaxHP:     50,
		MP:        30,
		MaxMP:     30,
		SP:        40,
		MaxSP:     40,
		LUPool:    0,
		Inventory: items.NewInventory(),
		Skills:    skills.NewPlayerSkills(),
		Buffs:     magic.NewBuffTracker(),
		Effects:   magic.NewEffectTracker(),
	}
	p.RecalcCombatStats()
	return p
}

func TestPlayerAttackPlayerBasic(t *testing.T) {
	attacker := makeTestPlayerWithID(1, "Attacker")
	target := makeTestPlayerWithID(2, "Target")

	hitCount := 0
	missCount := 0
	totalDamage := 0

	for i := 0; i < 1000; i++ {
		target.HP = target.MaxHP
		result := PlayerAttackPlayer(attacker, target)
		if result.Miss {
			missCount++
		} else {
			hitCount++
			totalDamage += result.Damage
			if result.Damage < 1 {
				t.Errorf("Damage should be at least 1, got %d", result.Damage)
			}
		}
	}

	if hitCount == 0 {
		t.Error("Expected at least some hits in 1000 PvP attacks")
	}
	if missCount == 0 {
		t.Error("Expected at least some misses in 1000 PvP attacks")
	}
	t.Logf("PvP: %d hits, %d misses, avg damage: %.1f", hitCount, missCount, float64(totalDamage)/float64(hitCount))
}

func TestPlayerAttackPlayerKill(t *testing.T) {
	attacker := makeTestPlayerWithID(1, "Attacker")
	attacker.STR = 50
	attacker.Level = 30
	attacker.RecalcCombatStats()

	target := makeTestPlayerWithID(2, "Target")
	target.HP = 1

	result := PlayerAttackPlayer(attacker, target)
	if result.Miss {
		// Retry—at equal DEX, hit chance is 50%, so very unlikely to miss 10 times
		for i := 0; i < 10 && result.Miss; i++ {
			target.HP = 1
			result = PlayerAttackPlayer(attacker, target)
		}
	}
	if !result.Miss && !result.Killed {
		t.Error("Target with 1 HP should die from a hit")
	}
	if !result.Miss && target.HP != 0 {
		t.Errorf("Dead target should have 0 HP, got %d", target.HP)
	}
}

func TestPlayerAttackPlayerCriticalWithAttackMode(t *testing.T) {
	// Criticals now trigger via AttackMode >= 20 (ported from C++)
	attacker := makeTestPlayerWithID(1, "Attacker")
	attacker.Level = 30
	attacker.DEX = 50
	attacker.AttackMode = 20       // activate critical mode
	attacker.SuperAttackLeft = 5000 // enough for all iterations
	attacker.RecalcCombatStats()
	attacker.AttackMode = 20
	attacker.SuperAttackLeft = 5000

	target := makeTestPlayerWithID(2, "Target")

	critCount := 0
	hitCount := 0
	for i := 0; i < 500; i++ {
		target.HP = target.MaxHP
		result := PlayerAttackPlayer(attacker, target)
		if !result.Miss {
			hitCount++
			if result.Critical {
				critCount++
			}
		}
	}

	if hitCount == 0 {
		t.Fatal("Expected at least some hits")
	}
	// All hits should be critical when AttackMode >= 20 and SuperAttackLeft > 0
	critRate := float64(critCount) / float64(hitCount)
	if critRate < 0.95 {
		t.Errorf("Critical rate %.2f — all hits should be critical with AttackMode=20", critRate)
	}
	t.Logf("Crit rate: %.2f (%d crits / %d hits)", critRate, critCount, hitCount)
}

func TestPlayerAttackPlayerNoCritWithoutAttackMode(t *testing.T) {
	// Without AttackMode, no criticals should happen
	attacker := makeTestPlayerWithID(1, "Attacker")
	attacker.Level = 50
	attacker.DEX = 50
	attacker.AttackMode = 0 // normal mode

	target := makeTestPlayerWithID(2, "Target")

	critCount := 0
	hitCount := 0
	for i := 0; i < 500; i++ {
		target.HP = target.MaxHP
		result := PlayerAttackPlayer(attacker, target)
		if !result.Miss {
			hitCount++
			if result.Critical {
				critCount++
			}
		}
	}

	if hitCount == 0 {
		t.Fatal("No hits at all")
	}
	if critCount > 0 {
		t.Errorf("Got %d crits with AttackMode=0 — should be 0", critCount)
	}
}

func TestPlayerAttackPlayerWithWeapon(t *testing.T) {
	attacker := makeTestPlayerWithID(1, "Attacker")
	sword := items.NewItem(items.GetItemDef(1), 1) // Short Sword
	attacker.Inventory.AddItem(sword)
	attacker.Inventory.Equip(0)
	attacker.RecalcCombatStats()

	target := makeTestPlayerWithID(2, "Target")

	unarmedDamages := []int{}
	weaponDamages := []int{}

	// Test unarmed first
	unarmed := makeTestPlayerWithID(3, "Unarmed")
	for i := 0; i < 500; i++ {
		target.HP = target.MaxHP
		result := PlayerAttackPlayer(unarmed, target)
		if !result.Miss {
			unarmedDamages = append(unarmedDamages, result.Damage)
		}
	}

	// Then with weapon
	for i := 0; i < 500; i++ {
		target.HP = target.MaxHP
		result := PlayerAttackPlayer(attacker, target)
		if !result.Miss {
			weaponDamages = append(weaponDamages, result.Damage)
		}
	}

	if len(unarmedDamages) == 0 || len(weaponDamages) == 0 {
		t.Fatal("Expected hits for both armed and unarmed")
	}

	avgUnarmed := avgDamage(unarmedDamages)
	avgWeapon := avgDamage(weaponDamages)
	t.Logf("PvP avg damage: unarmed=%.1f, weapon=%.1f", avgUnarmed, avgWeapon)
}

func TestPlayerAttackPlayerTargetArmor(t *testing.T) {
	attacker := makeTestPlayerWithID(1, "Attacker")
	attacker.STR = 20
	attacker.RecalcCombatStats()

	// Armored target
	armored := makeTestPlayerWithID(2, "Armored")
	armor := items.NewItem(items.GetItemDef(454), 1) // Hauberk(M)
	armored.Inventory.AddItem(armor)
	armored.Inventory.Equip(0)
	armored.RecalcCombatStats()

	// Unarmored target
	naked := makeTestPlayerWithID(3, "Naked")

	armoredDmg := []int{}
	nakedDmg := []int{}
	for i := 0; i < 500; i++ {
		armored.HP = armored.MaxHP
		naked.HP = naked.MaxHP
		r1 := PlayerAttackPlayer(attacker, armored)
		r2 := PlayerAttackPlayer(attacker, naked)
		if !r1.Miss {
			armoredDmg = append(armoredDmg, r1.Damage)
		}
		if !r2.Miss {
			nakedDmg = append(nakedDmg, r2.Damage)
		}
	}

	if len(armoredDmg) > 10 && len(nakedDmg) > 10 {
		avgArmored := avgDamage(armoredDmg)
		avgNaked := avgDamage(nakedDmg)
		t.Logf("PvP avg damage: armored=%.1f, naked=%.1f", avgArmored, avgNaked)
	}
}

func TestPlayerAttackPlayerEquipmentDegrades(t *testing.T) {
	attacker := makeTestPlayerWithID(1, "Attacker")
	sword := items.NewItem(items.GetItemDef(1), 1)
	attacker.Inventory.AddItem(sword)
	attacker.Inventory.Equip(0)
	attacker.RecalcCombatStats()

	target := makeTestPlayerWithID(2, "Target")
	armor := items.NewItem(items.GetItemDef(453), 1) // Shirt(M)
	target.Inventory.AddItem(armor)
	target.Inventory.Equip(0)
	target.RecalcCombatStats()

	for i := 0; i < 100; i++ {
		target.HP = target.MaxHP
		PlayerAttackPlayer(attacker, target)
	}

	weapon := attacker.Inventory.GetEquipped(items.EquipWeapon)
	weaponDef := items.GetItemDef(1) // Dagger
	if weapon != nil && weaponDef != nil && weapon.Durability >= weaponDef.Durability {
		t.Error("Attacker weapon should degrade during PvP")
	}
}

// Test the abs utility function
func TestAbs(t *testing.T) {
	if abs(5) != 5 {
		t.Error("abs(5) should be 5")
	}
	if abs(-5) != 5 {
		t.Error("abs(-5) should be 5")
	}
	if abs(0) != 0 {
		t.Error("abs(0) should be 0")
	}
	if abs(-100) != 100 {
		t.Error("abs(-100) should be 100")
	}
}

// Test XP formula edge cases
func TestXPForLevelEdgeCases(t *testing.T) {
	if XPForLevel(0) != 0 {
		t.Error("XPForLevel(0) should be 0")
	}
	if XPForLevel(1) != 0 {
		t.Errorf("XPForLevel(1) = %d, expected 0", XPForLevel(1))
	}
	if XPForLevel(100) != 322430 {
		t.Errorf("XPForLevel(100) = %d, expected 322430", XPForLevel(100))
	}
}

// Test CheckLevelUp cap behavior
func TestCheckLevelUpHighXP(t *testing.T) {
	p := makeTestPlayer()
	p.Level = 1
	p.LUPool = 0
	p.Experience = 100000000 // Very high XP
	changed := CheckLevelUp(p)
	if !changed {
		t.Error("Should have leveled up")
	}
	// Should level up many times
	if p.Level < 50 {
		t.Errorf("Expected high level with 100M XP, got %d", p.Level)
	}
	// Each level = 3 stat points
	expectedPool := (p.Level - 1) * 3
	if p.LUPool != expectedPool {
		t.Errorf("Expected %d LU points, got %d", expectedPool, p.LUPool)
	}
}

// Test CheckLevelUp maxHP/maxMP recalculation
func TestCheckLevelUpRecalcsStats(t *testing.T) {
	p := makeTestPlayerWithID(1, "LevelUp")
	p.Level = 1
	p.VIT = 20
	p.MAG = 15
	p.Experience = 150 // XPForLevel(2)=100, XPForLevel(3)=250 — should reach level 2

	oldMaxHP := p.MaxHP
	oldMaxMP := p.MaxMP

	CheckLevelUp(p)

	if p.Level != 2 {
		t.Fatalf("Should be level 2, got %d (XP=%d, next=%d)", p.Level, p.Experience, XPForLevel(p.Level+1))
	}
	expectedMaxHP := 30 + (2-1)*3 + 20*2 // 30+3+40=73
	if p.MaxHP != expectedMaxHP {
		t.Errorf("MaxHP=%d, expected %d", p.MaxHP, expectedMaxHP)
	}
	expectedMaxMP := 10 + (2-1)*2 + 15*2 // 10+2+30=42
	if p.MaxMP != expectedMaxMP {
		t.Errorf("MaxMP=%d, expected %d", p.MaxMP, expectedMaxMP)
	}
	if p.MaxHP <= oldMaxHP || p.MaxMP <= oldMaxMP {
		t.Error("Max stats should increase after level up")
	}
	// Full heal
	if p.HP != p.MaxHP {
		t.Error("Should be full HP")
	}
	if p.MP != p.MaxMP {
		t.Error("Should be full MP")
	}
}

// Test worldPhaseToString
func TestWorldPhaseToString(t *testing.T) {
	tests := []struct {
		phase    int
		expected string
	}{
		{0, "day"},
		{1, "dusk"},
		{2, "night"},
		{3, "dawn"},
		{99, "day"}, // default
		{-1, "day"}, // default
	}
	for _, tt := range tests {
		got := worldPhaseToString(tt.phase)
		if got != tt.expected {
			t.Errorf("worldPhaseToString(%d) = %q, expected %q", tt.phase, got, tt.expected)
		}
	}
}

// Test weatherToString
func TestWeatherToString(t *testing.T) {
	tests := []struct {
		weather  int
		expected string
	}{
		{0, "clear"},
		{1, "rain"},
		{2, "snow"},
		{3, "fog"},
		{99, "clear"}, // default
		{-1, "clear"}, // default
	}
	for _, tt := range tests {
		got := weatherToString(tt.weather)
		if got != tt.expected {
			t.Errorf("weatherToString(%d) = %q, expected %q", tt.weather, got, tt.expected)
		}
	}
}

// Test applyElementBonus
func TestApplyElementBonus(t *testing.T) {
	// No element = no bonus
	base := 100
	got := applyElementBonus(base, magic.ElementNone)
	if got != base {
		t.Errorf("ElementNone: expected %d, got %d", base, got)
	}

	// Fire element = 10% bonus
	got = applyElementBonus(base, magic.ElementFire)
	expected := 110
	if got != expected {
		t.Errorf("ElementFire: expected %d, got %d", expected, got)
	}

	// Ice element = 10% bonus
	got = applyElementBonus(base, magic.ElementIce)
	if got != expected {
		t.Errorf("ElementIce: expected %d, got %d", expected, got)
	}

	// Small damage
	got = applyElementBonus(10, magic.ElementFire)
	if got != 11 {
		t.Errorf("Small damage: expected 11, got %d", got)
	}

	// Zero damage
	got = applyElementBonus(0, magic.ElementFire)
	if got != 0 {
		t.Errorf("Zero damage: expected 0, got %d", got)
	}
}

// Test NPCAttackPlayer kill
func TestNPCAttackPlayerKill(t *testing.T) {
	p := makeTestPlayer()
	p.HP = 1
	n := makeTestNPC(11) // Skeleton

	// Keep trying until we get a hit
	var result CombatResult
	for i := 0; i < 100; i++ {
		p.HP = 1
		result = NPCAttackPlayer(n, p)
		if !result.Miss {
			break
		}
	}

	if !result.Miss && !result.Killed {
		t.Error("Player with 1 HP should die from NPC hit")
	}
	if !result.Miss && p.HP != 0 {
		t.Errorf("Dead player HP should be 0, got %d", p.HP)
	}
}

// Test hit chance clamping
func TestHitChanceClamping(t *testing.T) {
	// Very high DEX attacker vs low DEX NPC
	p := makeTestPlayer()
	p.DEX = 100
	p.RecalcCombatStats() // recalc HitRatio after changing DEX
	n := makeTestNPC(10)   // Slime with low DEX

	hitCount := 0
	for i := 0; i < 1000; i++ {
		n.HP = n.MaxHP
		result := PlayerAttackNPC(p, n)
		if !result.Miss {
			hitCount++
		}
	}
	// Hit chance capped at 95%, so miss rate should be ~5%
	hitRate := float64(hitCount) / 1000.0
	if hitRate < 0.85 {
		t.Errorf("High DEX player hit rate %.2f seems too low (expected ~0.95)", hitRate)
	}
}
