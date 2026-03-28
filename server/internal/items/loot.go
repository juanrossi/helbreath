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

// RollGoldDrop returns a random gold amount based on NPC XP value.
// Always produces gold: amount = rand(1, npcXP*2).
func RollGoldDrop(npcXP int) int64 {
	if npcXP <= 0 {
		return 1
	}
	maxGold := npcXP * 2
	return int64(rand.Intn(maxGold) + 1)
}

// PotionTierByDifficulty returns a potion item ID based on NPC difficulty (XP).
// Low difficulty (XP < 30): small potions, medium (30-80): regular, high (80+): large.
func PotionTierByDifficulty(npcXP int) int {
	if npcXP >= 80 {
		// Large potions
		if rand.Intn(2) == 0 {
			return 102 // Large HP Potion
		}
		return 105 // Large MP Potion
	}
	if npcXP >= 30 {
		// Regular potions
		if rand.Intn(2) == 0 {
			return 101 // HP Potion
		}
		return 104 // MP Potion
	}
	// Small potions
	if rand.Intn(2) == 0 {
		return 100 // Small HP Potion
	}
	return 103 // Small MP Potion
}

// RollMultiTierLoot performs multi-tier loot rolling for an NPC kill.
// Tier 1: Gold (always, handled separately via RollGoldDrop)
// Tier 2: Potion (35% chance, tier based on NPC difficulty)
// Tier 3: Equipment (from NpcLootTables, standard roll)
// Tier 4: Rare (0.1% chance, placeholder)
func RollMultiTierLoot(npcTypeID int, npcXP int) []*Item {
	var drops []*Item

	// Tier 2: Potion roll (35% chance)
	if rand.Float64() < 0.35 {
		potionID := PotionTierByDifficulty(npcXP)
		def := GetItemDef(potionID)
		if def != nil {
			drops = append(drops, NewItem(def, 1))
		}
	}

	// Tier 3: Equipment roll from standard loot table
	tableLoot := RollLoot(npcTypeID)
	drops = append(drops, tableLoot...)

	// Tier 4: Rare roll (0.1% chance) — placeholder for future rare items
	if rand.Float64() < 0.001 {
		// Roll a random high-tier equipment piece as rare drop
		rareItems := []int{3, 4, 22, 42, 32, 52} // Battle Axe, War Hammer, Tower Shield, Plate Mail, Full Helm, Plate Leggings
		rareID := rareItems[rand.Intn(len(rareItems))]
		def := GetItemDef(rareID)
		if def != nil {
			item := NewItem(def, 1)
			// Rare drops always get Ancient attribute
			item.Attribute = uint32(AttrAncient) << 20
			drops = append(drops, item)
		}
	}

	return drops
}

// BossLootTable defines guaranteed drops for boss-type NPCs.
// Boss loot has 100% drop rate and better items.
var BossLootTable = []LootEntry{
	{ItemID: 102, DropChance: 1.0, MinCount: 2, MaxCount: 5}, // Large HP Potions (guaranteed)
	{ItemID: 105, DropChance: 1.0, MinCount: 1, MaxCount: 3}, // Large MP Potions (guaranteed)
	{ItemID: 4, DropChance: 0.50, MinCount: 1, MaxCount: 1},  // War Hammer
	{ItemID: 3, DropChance: 0.50, MinCount: 1, MaxCount: 1},  // Battle Axe
	{ItemID: 22, DropChance: 0.40, MinCount: 1, MaxCount: 1}, // Tower Shield
	{ItemID: 42, DropChance: 0.35, MinCount: 1, MaxCount: 1}, // Plate Mail
	{ItemID: 32, DropChance: 0.30, MinCount: 1, MaxCount: 1}, // Full Helm
	{ItemID: 52, DropChance: 0.25, MinCount: 1, MaxCount: 1}, // Plate Leggings
}

// RollBossLoot rolls loot from the boss loot table.
func RollBossLoot() []*Item {
	var drops []*Item
	for _, entry := range BossLootTable {
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
