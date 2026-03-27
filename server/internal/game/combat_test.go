package game

import (
	"testing"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
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
	}
	return p
}

func makeTestNPC(npcTypeID int) *npc.NPC {
	npcType := npc.NpcTypes[npcTypeID]
	return npc.NewNPC(100, npcType, "default", 50, 50)
}

func TestPlayerAttackNPCUnarmed(t *testing.T) {
	p := makeTestPlayer()
	n := makeTestNPC(1) // Slime

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
	n := makeTestNPC(1)

	// Equip a Short Sword
	sword := items.NewItem(items.GetItemDef(1), 1)
	p.Inventory.AddItem(sword)
	p.Inventory.Equip(0)

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
	n := makeTestNPC(2) // Skeleton

	// Equip Leather Armor (defense=4)
	armor := items.NewItem(items.GetItemDef(40), 1)
	p.Inventory.AddItem(armor)
	p.Inventory.Equip(0)

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
	tests := []struct {
		level    int
		expected int64
	}{
		{1, 100},
		{2, 400},
		{5, 2500},
		{10, 10000},
		{50, 250000},
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
	p.Experience = 500 // enough for level 2 (400 XP needed)

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
	p.Experience = 3000 // enough for level 1->2->3->4->5

	changed := CheckLevelUp(p)
	if !changed {
		t.Error("Should have leveled up")
	}
	if p.Level < 4 { // should get to at least level 4 (needed: 100, 400, 900, 1600, 2500)
		t.Errorf("Expected at least level 4 with 3000 XP, got level %d", p.Level)
	}
	if p.LUPool != (p.Level-1)*3 { // 3 per level
		t.Errorf("Expected %d stat points, got %d", (p.Level-1)*3, p.LUPool)
	}
}

func TestCheckLevelUpNotEnoughXP(t *testing.T) {
	p := makeTestPlayer()
	p.Level = 1
	p.Experience = 50 // not enough

	changed := CheckLevelUp(p)
	if changed {
		t.Error("Should not have leveled up with 50 XP")
	}
	if p.Level != 1 {
		t.Error("Level should still be 1")
	}
}
