package items

import "testing"

func TestRollLoot(t *testing.T) {
	// Run multiple rolls to verify we get results
	gotSomething := false
	for i := 0; i < 100; i++ {
		drops := RollLoot(10) // Slime (type 10)
		if len(drops) > 0 {
			gotSomething = true
			for _, drop := range drops {
				if drop.DefID == 0 {
					t.Error("Got drop with DefID=0")
				}
				if drop.Count < 1 {
					t.Errorf("Got drop with Count=%d", drop.Count)
				}
			}
		}
	}
	if !gotSomething {
		t.Error("Expected at least one drop from 100 rolls on Slime")
	}
}

func TestRollLootNonExistent(t *testing.T) {
	drops := RollLoot(9999) // non-existent NPC type
	if drops != nil && len(drops) > 0 {
		t.Error("Expected no drops for non-existent NPC type")
	}
}

func TestLootTablesValid(t *testing.T) {
	for npcTypeID, entries := range NpcLootTables {
		for _, entry := range entries {
			def := GetItemDef(entry.ItemID)
			if def == nil {
				t.Errorf("NPC type %d has loot entry for non-existent item %d", npcTypeID, entry.ItemID)
			}
			if entry.DropChance <= 0 || entry.DropChance > 1.0 {
				t.Errorf("NPC type %d, item %d: invalid drop chance %f", npcTypeID, entry.ItemID, entry.DropChance)
			}
			if entry.MinCount < 1 {
				t.Errorf("NPC type %d, item %d: min count must be >= 1", npcTypeID, entry.ItemID)
			}
			if entry.MaxCount < entry.MinCount {
				t.Errorf("NPC type %d, item %d: max count < min count", npcTypeID, entry.ItemID)
			}
		}
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

// === Phase 4: Multi-tier Loot Tests ===

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

func TestPotionTierByDifficulty(t *testing.T) {
	// Low difficulty
	lowPotions := map[int]bool{91: true, 93: true}
	for i := 0; i < 50; i++ {
		id := PotionTierByDifficulty(10)
		if !lowPotions[id] {
			t.Errorf("Low difficulty potion should be basic (91 or 93), got %d", id)
		}
	}

	// Medium difficulty — basic potions
	basicPotions := map[int]bool{91: true, 93: true}
	for i := 0; i < 50; i++ {
		id := PotionTierByDifficulty(50)
		if !basicPotions[id] {
			t.Errorf("Medium difficulty potion should be basic (91 or 93), got %d", id)
		}
	}

	// High difficulty (XP >= 500) — big potions
	bigPotions := map[int]bool{92: true, 94: true}
	for i := 0; i < 50; i++ {
		id := PotionTierByDifficulty(1000)
		if !bigPotions[id] {
			t.Errorf("High difficulty potion should be big (92 or 94), got %d", id)
		}
	}
}

func TestRollMultiTierLoot(t *testing.T) {
	// Run many rolls to verify structure
	gotPotion := false
	gotEquipment := false
	for i := 0; i < 500; i++ {
		drops := RollMultiTierLoot(11, 262) // Skeleton (type 11, XP 262)
		for _, drop := range drops {
			def := drop.Def()
			if def == nil {
				t.Error("Got drop with nil definition")
				continue
			}
			if def.Type == ItemTypePotion {
				gotPotion = true
			}
			if def.Type >= ItemTypeWeapon && def.Type <= ItemTypeCape {
				gotEquipment = true
			}
		}
	}
	if !gotPotion {
		t.Error("Expected at least one potion drop from 500 multi-tier rolls")
	}
	if !gotEquipment {
		t.Error("Expected at least one equipment drop from 500 multi-tier rolls")
	}
}

func TestRollMultiTierLootNonExistentNPC(t *testing.T) {
	// Should still potentially get potions even for non-existent NPC tables
	gotPotion := false
	for i := 0; i < 100; i++ {
		drops := RollMultiTierLoot(9999, 50)
		for _, drop := range drops {
			def := drop.Def()
			if def != nil && def.Type == ItemTypePotion {
				gotPotion = true
			}
		}
	}
	if !gotPotion {
		t.Error("Expected at least one potion from tier-2 roll even with no NPC loot table")
	}
}

func TestHellclawLoot(t *testing.T) {
	// Hellclaw (49) has guaranteed potion drops — should always get potions
	gotPotions := false
	gotEquip := false
	for i := 0; i < 50; i++ {
		drops := RollLoot(49)
		for _, drop := range drops {
			def := drop.Def()
			if def == nil {
				continue
			}
			if def.Type == ItemTypePotion {
				gotPotions = true
			}
			if def.Type >= ItemTypeWeapon && def.Type <= ItemTypeCape {
				gotEquip = true
			}
		}
	}
	if !gotPotions {
		t.Error("Hellclaw loot should always drop potions (100% chance)")
	}
	if !gotEquip {
		t.Error("Expected at least some equipment from 50 Hellclaw rolls")
	}
}

func TestAllLootTablesValid(t *testing.T) {
	for npcID, entries := range NpcLootTables {
		for _, entry := range entries {
			def := GetItemDef(entry.ItemID)
			if def == nil {
				t.Errorf("NPC %d loot table references non-existent item %d", npcID, entry.ItemID)
			}
			if entry.DropChance <= 0 || entry.DropChance > 1.0 {
				t.Errorf("NPC %d item %d: invalid drop chance %f", npcID, entry.ItemID, entry.DropChance)
			}
			if entry.MinCount < 1 {
				t.Errorf("NPC %d item %d: min count must be >= 1", npcID, entry.ItemID)
			}
			if entry.MaxCount < entry.MinCount {
				t.Errorf("NPC %d item %d: max count < min count", npcID, entry.ItemID)
			}
		}
	}
}
