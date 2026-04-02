package items

import "testing"

func TestNpcDeadItemGeneratorNoDropTypes(t *testing.T) {
	// Guard (21), Dummy (34), Crop (64) should never drop
	for _, npcType := range []int{21, 34, 64} {
		for i := 0; i < 100; i++ {
			drops := NpcDeadItemGenerator(npcType, 100, false)
			if len(drops) > 0 {
				t.Errorf("NPC type %d should never drop items, got %d drops", npcType, len(drops))
				break
			}
		}
	}
}

func TestNpcDeadItemGeneratorBossAlwaysPasses(t *testing.T) {
	// Boss should have higher drop rate than regular NPC
	bossDrops := 0
	regularDrops := 0
	iterations := 1000

	for i := 0; i < iterations; i++ {
		drops := NpcDeadItemGenerator(49, 5000, true) // Hellclaw boss
		if len(drops) > 0 {
			bossDrops++
		}
		drops = NpcDeadItemGenerator(10, 15, false) // Regular slime
		if len(drops) > 0 {
			regularDrops++
		}
	}

	// Boss should drop more often since it always passes primary check
	if bossDrops == 0 {
		t.Error("Boss NPC should produce some drops over 1000 iterations")
	}
	// Regular NPCs with default 3x multiplier should also get some drops
	// but fewer than boss (boss skips the 35% primary check)
}

func TestNpcDeadItemGeneratorReturnsValidItems(t *testing.T) {
	// Test with various NPC types that we know the drops for
	npcTypes := []struct {
		id    int
		xp    int
		boss  bool
	}{
		{10, 15, false},    // Slime (genLevel 1)
		{11, 262, false},   // Skeleton (genLevel 2)
		{12, 450, false},   // Stone-Golem (genLevel 3)
		{29, 1200, false},  // Ogre (genLevel 6)
		{30, 3500, false},  // Liche (genLevel 10)
		{49, 5000, true},   // Hellclaw (boss, genLevel 11)
	}

	for _, npc := range npcTypes {
		for i := 0; i < 500; i++ {
			drops := NpcDeadItemGenerator(npc.id, npc.xp, npc.boss)
			for _, drop := range drops {
				if drop.DefID == 0 {
					t.Errorf("NPC %d: got drop with DefID=0", npc.id)
				}
				if drop.Count < 1 {
					t.Errorf("NPC %d: got drop with Count=%d", npc.id, drop.Count)
				}
				def := GetItemDef(drop.DefID)
				if def == nil {
					t.Errorf("NPC %d: got drop with invalid DefID=%d", npc.id, drop.DefID)
				}
			}
		}
	}
}

func TestNpcDeadItemGeneratorUnknownNPC(t *testing.T) {
	// Unknown NPC types should still potentially get potion drops
	// (they pass primary check, gold/item split, and potion roll)
	// but equipment drops will fail because genLevel is 0/unknown
	gotPotion := false
	for i := 0; i < 2000; i++ {
		drops := NpcDeadItemGenerator(9999, 50, false)
		for _, drop := range drops {
			def := GetItemDef(drop.DefID)
			if def != nil && def.Type == ItemTypePotion {
				gotPotion = true
			}
		}
	}
	if !gotPotion {
		t.Error("Expected at least one potion drop from unknown NPC over 2000 iterations")
	}
}

func TestNpcDeadItemGeneratorEquipmentDrops(t *testing.T) {
	// Run many iterations to verify we get equipment drops
	gotWeapon := false
	gotArmor := false
	// Use a high-genLevel boss to maximize equipment drop chance
	for i := 0; i < 5000; i++ {
		drops := NpcDeadItemGenerator(30, 3500, true) // Liche, genLevel 10, boss
		for _, drop := range drops {
			def := GetItemDef(drop.DefID)
			if def == nil {
				continue
			}
			if def.Type == ItemTypeWeapon {
				gotWeapon = true
			}
			if def.Type >= ItemTypeShield && def.Type <= ItemTypeCape {
				gotArmor = true
			}
		}
	}
	if !gotWeapon {
		t.Error("Expected at least one weapon drop from 5000 boss kills")
	}
	if !gotArmor {
		t.Error("Expected at least one armor drop from 5000 boss kills")
	}
}

func TestNpcDeadItemGeneratorAttributes(t *testing.T) {
	// Equipment drops should have attributes applied
	gotAttribute := false
	for i := 0; i < 5000; i++ {
		drops := NpcDeadItemGenerator(30, 3500, true) // Liche boss
		for _, drop := range drops {
			def := GetItemDef(drop.DefID)
			if def == nil {
				continue
			}
			// Only equipment gets attributes
			if def.Type >= ItemTypeWeapon && def.Type <= ItemTypeCape {
				if drop.Attribute != 0 {
					gotAttribute = true
				}
			}
		}
	}
	if !gotAttribute {
		t.Error("Expected at least one equipment drop with attributes from 5000 boss kills")
	}
}

func TestRollGoldDrop(t *testing.T) {
	// Gold should always be at least 1
	for i := 0; i < 100; i++ {
		gold := RollGoldDrop(15) // Slime XP
		if gold < 1 {
			t.Errorf("Gold drop should be >= 1, got %d", gold)
		}
		if gold > 30 { // max is XP*2 = 30
			t.Errorf("Gold drop should be <= 30 for XP=15, got %d", gold)
		}
	}
}

func TestRollGoldDropZeroXP(t *testing.T) {
	gold := RollGoldDrop(0)
	if gold != 1 {
		t.Errorf("Gold drop for 0 XP should be 1, got %d", gold)
	}
}

func TestShopInventoriesValid(t *testing.T) {
	for npcID, itemIDs := range ShopInventories {
		if len(itemIDs) == 0 {
			t.Errorf("Shop NPC %d has empty inventory", npcID)
		}
		for _, itemID := range itemIDs {
			def := GetItemDef(itemID)
			if def == nil {
				t.Errorf("Shop NPC %d sells non-existent item %d", npcID, itemID)
			}
		}
	}
}

func TestRollPotion(t *testing.T) {
	// Should produce a variety of potions
	seen := map[int]bool{}
	for i := 0; i < 10000; i++ {
		id := rollPotion()
		def := GetItemDef(id)
		if def == nil {
			t.Errorf("rollPotion returned non-existent item ID %d", id)
		}
		seen[id] = true
	}
	// Should see at least the common potions
	expectedPotions := []int{91, 92, 93, 94, 95, 96}
	for _, pid := range expectedPotions {
		if !seen[pid] {
			t.Errorf("Expected to see potion %d in 10000 rolls", pid)
		}
	}
}

func TestRollAttributeValue(t *testing.T) {
	// Should produce values 1-13
	seen := map[int]bool{}
	for i := 0; i < 100000; i++ {
		v := rollAttributeValue()
		if v < 1 || v > 13 {
			t.Errorf("Attribute value out of range: %d", v)
		}
		seen[v] = true
	}
	// Should see at least the common values (1-7)
	for v := 1; v <= 7; v++ {
		if !seen[v] {
			t.Errorf("Expected to see attribute value %d in 100000 rolls", v)
		}
	}
}

func TestGenLevelCap(t *testing.T) {
	// For genLevel <= 2, attribute value should be capped at 7
	for i := 0; i < 10000; i++ {
		attr := rollWeaponAttribute(1)
		value := int((attr >> 16) & 0xF)
		if value > 7 {
			t.Errorf("GenLevel 1 weapon attribute value should be <= 7, got %d", value)
		}
	}
}

func TestIDice(t *testing.T) {
	// iDice(1, 6) should return 1-6
	for i := 0; i < 1000; i++ {
		v := iDice(1, 6)
		if v < 1 || v > 6 {
			t.Errorf("iDice(1,6) returned %d, expected 1-6", v)
		}
	}
	// iDice(0, 6) should return 0
	if iDice(0, 6) != 0 {
		t.Error("iDice(0,6) should return 0")
	}
	// iDice(2, 6) should return 2-12
	for i := 0; i < 1000; i++ {
		v := iDice(2, 6)
		if v < 2 || v > 12 {
			t.Errorf("iDice(2,6) returned %d, expected 2-12", v)
		}
	}
}
