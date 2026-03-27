package items

import "testing"

func TestRollLoot(t *testing.T) {
	// Run multiple rolls to verify we get results
	gotSomething := false
	for i := 0; i < 100; i++ {
		drops := RollLoot(1) // Slime
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
