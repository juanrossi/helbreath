package items

import "math/rand"

// LootEntry defines a possible drop from an NPC.
type LootEntry struct {
	ItemID     int
	DropChance float64 // 0.0 to 1.0
	MinCount   int
	MaxCount   int
}

// NpcLootTables maps NPC type ID to loot entries.
var NpcLootTables = map[int][]LootEntry{
	1: { // Slime
		{ItemID: 100, DropChance: 0.30, MinCount: 1, MaxCount: 1}, // Small HP Potion
	},
	2: { // Skeleton
		{ItemID: 100, DropChance: 0.20, MinCount: 1, MaxCount: 2}, // Small HP Potion
		{ItemID: 103, DropChance: 0.15, MinCount: 1, MaxCount: 1}, // Small MP Potion
		{ItemID: 6, DropChance: 0.08, MinCount: 1, MaxCount: 1},   // Dagger
		{ItemID: 30, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // Leather Cap
	},
	3: { // Orc
		{ItemID: 101, DropChance: 0.25, MinCount: 1, MaxCount: 2}, // HP Potion
		{ItemID: 104, DropChance: 0.15, MinCount: 1, MaxCount: 1}, // MP Potion
		{ItemID: 1, DropChance: 0.10, MinCount: 1, MaxCount: 1},   // Short Sword
		{ItemID: 20, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // Wooden Shield
		{ItemID: 40, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // Leather Armor
		{ItemID: 50, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // Leather Leggings
		{ItemID: 60, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // Leather Boots
	},
	4: { // Demon
		{ItemID: 102, DropChance: 0.30, MinCount: 1, MaxCount: 3}, // Large HP Potion
		{ItemID: 105, DropChance: 0.20, MinCount: 1, MaxCount: 2}, // Large MP Potion
		{ItemID: 2, DropChance: 0.12, MinCount: 1, MaxCount: 1},   // Long Sword
		{ItemID: 3, DropChance: 0.08, MinCount: 1, MaxCount: 1},   // Battle Axe
		{ItemID: 21, DropChance: 0.10, MinCount: 1, MaxCount: 1},  // Iron Shield
		{ItemID: 41, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // Chain Mail
		{ItemID: 31, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // Iron Helm
		{ItemID: 51, DropChance: 0.07, MinCount: 1, MaxCount: 1},  // Chain Leggings
		{ItemID: 71, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // Silk Mantle
	},
}

// RollLoot determines which items drop from an NPC kill.
func RollLoot(npcTypeID int) []*Item {
	entries, ok := NpcLootTables[npcTypeID]
	if !ok {
		return nil
	}

	var drops []*Item
	for _, entry := range entries {
		if rand.Float64() < entry.DropChance {
			def := GetItemDef(entry.ItemID)
			if def == nil {
				continue
			}
			count := entry.MinCount
			if entry.MaxCount > entry.MinCount {
				count += rand.Intn(entry.MaxCount - entry.MinCount + 1)
			}
			drops = append(drops, NewItem(def, count))
		}
	}
	return drops
}

// ShopInventory defines what items each shop NPC sells.
// Map from NPC type ID to list of sellable item IDs.
var ShopInventories = map[int][]int{
	// Weapon shop NPC (type 10)
	10: {1, 2, 3, 4, 5, 6},
	// Armor shop NPC (type 11)
	11: {20, 21, 22, 30, 31, 32, 40, 41, 42, 50, 51, 52, 60, 61, 70, 71},
	// Potion shop NPC (type 12)
	12: {100, 101, 102, 103, 104, 105, 106},
}
