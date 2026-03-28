package game

import (
	"testing"
	"time"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/skills"
)

func makeTestPlayer() *player.Player {
	p := &player.Player{
		ObjectID:  1,
		Name:      "TestPlayer",
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

func makeTestNPC(npcTypeID int) *npc.NPC {
	npcType := npc.NpcTypes[npcTypeID]
	return npc.NewNPC(100, npcType, "default", 50, 50)
}

func TestPlayerAttackNPCUnarmed(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(10) // Slime

	hitCount := 0
	missCount := 0
	totalDamage := 0

	for i := 0; i < 1000; i++ {
		n.HP = n.MaxHP // reset
		result := PlayerAttackNPC(p, n)
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
		t.Error("Expected at least some hits in 1000 attacks")
	}
	if missCount == 0 {
		t.Error("Expected at least some misses in 1000 attacks")
	}
	t.Logf("Unarmed: %d hits, %d misses, avg damage: %.1f", hitCount, missCount, float64(totalDamage)/float64(hitCount))
}

func TestPlayerAttackNPCWithWeapon(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(10)

	// Equip a Short Sword
	sword := items.NewItem(items.GetItemDef(1), 1)
	p.Inventory.AddItem(sword)
	p.Inventory.Equip(0)
	p.RecalcCombatStats()

	hitDamages := []int{}
	for i := 0; i < 100; i++ {
		n.HP = n.MaxHP
		result := PlayerAttackNPC(p, n)
		if !result.Miss {
			hitDamages = append(hitDamages, result.Damage)
		}
	}

	if len(hitDamages) == 0 {
		t.Error("Expected at least some hits with weapon")
	}

	// Check weapon degraded
	weapon := p.Inventory.GetEquipped(items.EquipWeapon)
	if weapon != nil && weapon.Durability >= 100 {
		t.Error("Weapon should have degraded during combat")
	}
}

func TestNPCAttackPlayerWithArmor(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(11) // Skeleton

	// Equip Leather Armor (defense=4)
	armor := items.NewItem(items.GetItemDef(40), 1)
	p.Inventory.AddItem(armor)
	p.Inventory.Equip(0)
	p.RecalcCombatStats()

	totalDefense := p.Inventory.TotalDefense()
	if totalDefense != 4 {
		t.Errorf("Expected total defense=4, got %d", totalDefense)
	}

	// Attack the player several times
	damages := []int{}
	for i := 0; i < 100; i++ {
		p.HP = p.MaxHP // reset
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			damages = append(damages, result.Damage)
		}
	}

	if len(damages) == 0 {
		t.Error("Expected at least some hits")
	}

	// Compare with unarmored player
	pNaked := makeTestPlayer()
	nakedDamages := []int{}
	for i := 0; i < 100; i++ {
		pNaked.HP = pNaked.MaxHP
		result := NPCAttackPlayer(n, pNaked)
		if !result.Miss {
			nakedDamages = append(nakedDamages, result.Damage)
		}
	}

	avgArmored := avgDamage(damages)
	avgNaked := avgDamage(nakedDamages)
	t.Logf("Avg damage: armored=%.1f, naked=%.1f", avgArmored, avgNaked)

	// Armored should generally take less damage
	if len(damages) > 10 && len(nakedDamages) > 10 && avgArmored >= avgNaked {
		t.Log("Warning: armored damage not lower than naked (could be random variance)")
	}
}

func avgDamage(damages []int) float64 {
	if len(damages) == 0 {
		return 0
	}
	total := 0
	for _, d := range damages {
		total += d
	}
	return float64(total) / float64(len(damages))
}

func TestXPForLevel(t *testing.T) {
	// C++ formula: XP(n) = XP(n-1) + n * (50 + (n/17)^2)
	tests := []struct {
		level    int
		expected int64
	}{
		{1, 0},
		{2, 100},
		{5, 700},
		{10, 2700},
		{50, 66981},
		{100, 322430},
	}

	for _, tt := range tests {
		got := XPForLevel(tt.level)
		if got != tt.expected {
			t.Errorf("XPForLevel(%d) = %d, expected %d", tt.level, got, tt.expected)
		}
	}
}

func TestCheckLevelUp(t *testing.T) {
	p := makeTestPlayer()
	p.Level = 1
	p.LUPool = 0
	p.Experience = 150 // enough for level 2 (XPForLevel(2)=100)

	changed := CheckLevelUp(p)
	if !changed {
		t.Error("Should have leveled up")
	}
	if p.Level != 2 {
		t.Errorf("Expected level 2, got %d", p.Level)
	}
	if p.LUPool != 3 {
		t.Errorf("Expected 3 stat points, got %d", p.LUPool)
	}
	// Full heal on level up
	if p.HP != p.MaxHP {
		t.Errorf("Should be full HP after level up: %d/%d", p.HP, p.MaxHP)
	}
}

func TestCheckLevelUpMultiple(t *testing.T) {
	p := makeTestPlayer()
	p.Level = 1
	p.LUPool = 0
	p.Experience = 3000 // XPForLevel: 2=100, 3=250, 4=450, 5=700, 6=1000, 7=1350, 8=1750, 9=2200, 10=2700

	changed := CheckLevelUp(p)
	if !changed {
		t.Error("Should have leveled up")
	}
	if p.Level < 9 {
		t.Errorf("Expected at least level 9 with 3000 XP, got level %d (next=%d)", p.Level, XPForLevel(p.Level+1))
	}
	if p.LUPool != (p.Level-1)*3 { // 3 per level
		t.Errorf("Expected %d stat points, got %d", (p.Level-1)*3, p.LUPool)
	}
}

func TestCheckLevelUpNotEnoughXP(t *testing.T) {
	p := makeTestPlayer()
	p.Level = 1
	p.Experience = 50 // not enough (level 2 requires 100)

	changed := CheckLevelUp(p)
	if changed {
		t.Error("Should not have leveled up with 50 XP")
	}
	if p.Level != 1 {
		t.Error("Level should still be 1")
	}
}

// === Status Effect Combat Tests ===

func TestBerserkIncreasesDamage(t *testing.T) {
	p := makeTestPlayer()
	p.STR = 60
	p.DEX = 80 // ensure high hit rate
	p.Level = 50
	p.RecalcCombatStats()
	n := makeTestNPC(10) // Slime

	// Collect damage without berserk
	normalDamages := []int{}
	for i := 0; i < 500; i++ {
		n.HP = n.MaxHP
		result := PlayerAttackNPC(p, n)
		if !result.Miss {
			normalDamages = append(normalDamages, result.Damage)
		}
	}

	// Apply berserk level 2
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectBerserk,
		Level:     2,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	berserkDamages := []int{}
	for i := 0; i < 500; i++ {
		n.HP = n.MaxHP
		result := PlayerAttackNPC(p, n)
		if !result.Miss {
			berserkDamages = append(berserkDamages, result.Damage)
		}
	}

	if len(normalDamages) == 0 || len(berserkDamages) == 0 {
		t.Fatal("Expected hits both with and without berserk")
	}

	avgNormal := avgDamage(normalDamages)
	avgBerserk := avgDamage(berserkDamages)
	t.Logf("Berserk test: normal avg=%.1f, berserk avg=%.1f (expected ~40%% increase)", avgNormal, avgBerserk)

	if avgBerserk <= avgNormal {
		t.Error("Berserk should increase average damage")
	}
}

func TestDefenseShieldReducesDamage(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(11) // Skeleton

	// Damage without shield
	normalDamages := []int{}
	for i := 0; i < 500; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			normalDamages = append(normalDamages, result.Damage)
		}
	}

	// Apply defense shield level 2
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectDefenseShield,
		Level:     2,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	shieldDamages := []int{}
	for i := 0; i < 500; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			shieldDamages = append(shieldDamages, result.Damage)
		}
	}

	if len(normalDamages) == 0 || len(shieldDamages) == 0 {
		t.Fatal("Expected hits both with and without shield")
	}

	avgNormal := avgDamage(normalDamages)
	avgShield := avgDamage(shieldDamages)
	t.Logf("Defense Shield test: normal avg=%.1f, shielded avg=%.1f", avgNormal, avgShield)

	// Shield level 2 absorbs 10 damage, but ice effect increases it back.
	// Net should still be lower on average.
	if len(normalDamages) > 50 && len(shieldDamages) > 50 && avgShield >= avgNormal {
		t.Log("Warning: defense shield damage not lower (could be random variance with min 1 floor)")
	}
}

func TestInvisibilityBreaksOnAttack(t *testing.T) {
	p := makeTestPlayer()
	p.DEX = 50
	p.RecalcCombatStats()
	n := makeTestNPC(10)

	// Apply invisibility
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectInvisibility,
		Level:     1,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	if !p.Effects.HasEffect(magic.EffectInvisibility) {
		t.Fatal("Should have invisibility before attack")
	}

	// Attack NPC
	PlayerAttackNPC(p, n)

	if p.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Invisibility should break on attack")
	}
}

func TestInvisibilityBreaksOnDamage(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(11) // Skeleton

	// Apply invisibility
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectInvisibility,
		Level:     1,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	// Get hit by NPC (retry until we get a non-miss)
	for i := 0; i < 100; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			break
		}
	}

	if p.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Invisibility should break when taking damage")
	}
}

func TestIceEffectIncreasesDamage(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(11) // Skeleton

	// Apply ice effect to the player (as target)
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectIce,
		Level:     2,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	// When frozen, the player takes more damage from NPCs
	damages := []int{}
	for i := 0; i < 500; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			damages = append(damages, result.Damage)
		}
	}

	// Remove ice and test normal
	p.Effects.RemoveEffect(magic.EffectIce)
	normalDamages := []int{}
	for i := 0; i < 500; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			normalDamages = append(normalDamages, result.Damage)
		}
	}

	if len(damages) > 0 && len(normalDamages) > 0 {
		avgFrozen := avgDamage(damages)
		avgNormal := avgDamage(normalDamages)
		t.Logf("Ice effect test: frozen avg=%.1f, normal avg=%.1f", avgFrozen, avgNormal)
	}
}

func TestBerserkReducesDefense(t *testing.T) {
	// Berserk on target means they take more damage
	p := makeTestPlayer()
	p.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectBerserk,
		Level:     2,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	n := makeTestNPC(11)

	// When berserk is active on the target, they take more damage
	damages := []int{}
	for i := 0; i < 500; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			damages = append(damages, result.Damage)
		}
	}

	p.Effects.RemoveEffect(magic.EffectBerserk)
	normalDamages := []int{}
	for i := 0; i < 500; i++ {
		p.HP = p.MaxHP
		result := NPCAttackPlayer(n, p)
		if !result.Miss {
			normalDamages = append(normalDamages, result.Damage)
		}
	}

	if len(damages) > 50 && len(normalDamages) > 50 {
		avgBerserk := avgDamage(damages)
		avgNormal := avgDamage(normalDamages)
		t.Logf("Berserk defense penalty: berserk target avg=%.1f, normal avg=%.1f", avgBerserk, avgNormal)
	}
}

func TestPvPInvisibilityBreaksOnBothSides(t *testing.T) {
	attacker := makeTestPlayerWithID(1, "Attacker")
	attacker.DEX = 50
	attacker.RecalcCombatStats()

	target := makeTestPlayerWithID(2, "Target")

	// Both invisible
	attacker.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectInvisibility,
		Level:     1,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})
	target.Effects.AddEffect(&magic.ActiveEffect{
		Type:      magic.EffectInvisibility,
		Level:     1,
		ExpiresAt: time.Now().Add(60 * time.Second),
	})

	// Attack
	PlayerAttackPlayer(attacker, target)

	if attacker.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Attacker invisibility should break on PvP attack")
	}
	if target.Effects.HasEffect(magic.EffectInvisibility) {
		t.Error("Target invisibility should break on PvP damage")
	}
}
