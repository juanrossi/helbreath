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
// Item IDs reference the original Helbreath Item.cfg (via itemdefs_gen.go).
var NpcLootTables = map[int][]LootEntry{
	1: { // Slime
		{ItemID: 91, DropChance: 0.30, MinCount: 1, MaxCount: 1}, // RedPotion
	},
	2: { // Skeleton
		{ItemID: 91, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // RedPotion
		{ItemID: 93, DropChance: 0.15, MinCount: 1, MaxCount: 1},  // BluePotion
		{ItemID: 1, DropChance: 0.08, MinCount: 1, MaxCount: 1},   // Dagger
		{ItemID: 600, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // Helm
	},
	3: { // Orc
		{ItemID: 92, DropChance: 0.25, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 8, DropChance: 0.10, MinCount: 1, MaxCount: 1},   // ShortSword
		{ItemID: 79, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // WoodShield
		{ItemID: 453, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // Shirt(M)
		{ItemID: 459, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // Trousers(M)
		{ItemID: 450, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // Shoes
	},
	4: { // Demon
		{ItemID: 92, DropChance: 0.30, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 8, DropChance: 0.12, MinCount: 1, MaxCount: 1},   // ShortSword
		{ItemID: 50, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // GreatSword
		{ItemID: 80, DropChance: 0.10, MinCount: 1, MaxCount: 1},  // LeatherShield
		{ItemID: 454, DropChance: 0.08, MinCount: 1, MaxCount: 1}, // Hauberk(M)
		{ItemID: 600, DropChance: 0.08, MinCount: 1, MaxCount: 1}, // Helm
		{ItemID: 461, DropChance: 0.07, MinCount: 1, MaxCount: 1}, // ChainHose(M)
		{ItemID: 402, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // Cape
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
// Low difficulty (XP < 30): basic potions, medium (30-80): big potions, high (80+): big potions.
// Uses original Helbreath potion IDs from Item.cfg.
func PotionTierByDifficulty(npcXP int) int {
	if npcXP >= 80 {
		// Big potions
		if rand.Intn(2) == 0 {
			return 92 // BigHealthPotion
		}
		return 94 // BigManaPotion
	}
	if npcXP >= 30 {
		// Big potions
		if rand.Intn(2) == 0 {
			return 92 // BigHealthPotion
		}
		return 94 // BigManaPotion
	}
	// Basic potions
	if rand.Intn(2) == 0 {
		return 91 // RedPotion
	}
	return 93 // BluePotion
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
		rareItems := []int{50, 4, 81, 456, 600, 461} // GreatSword, Dagger+1, TargeShield, ChainMail(M), Helm, ChainHose(M)
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
// Uses original Helbreath Item.cfg IDs.
var BossLootTable = []LootEntry{
	{ItemID: 92, DropChance: 1.0, MinCount: 2, MaxCount: 5},   // BigHealthPotion (guaranteed)
	{ItemID: 94, DropChance: 1.0, MinCount: 1, MaxCount: 3},   // BigManaPotion (guaranteed)
	{ItemID: 4, DropChance: 0.50, MinCount: 1, MaxCount: 1},   // Dagger+1
	{ItemID: 50, DropChance: 0.50, MinCount: 1, MaxCount: 1},  // GreatSword
	{ItemID: 81, DropChance: 0.40, MinCount: 1, MaxCount: 1},  // TargeShield
	{ItemID: 456, DropChance: 0.35, MinCount: 1, MaxCount: 1}, // ChainMail(M)
	{ItemID: 600, DropChance: 0.30, MinCount: 1, MaxCount: 1}, // Helm
	{ItemID: 461, DropChance: 0.25, MinCount: 1, MaxCount: 1}, // ChainHose(M)
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
// Map from NPC type ID to list of sellable item IDs (from original Item.cfg).
// NPC type IDs match the C++ NPC.cfg: 15=ShopKeeper-W, 24=Tom, 20=Howard, etc.
var ShopInventories = map[int][]int{
	// ShopKeeper-W (type 15) — general shop, sells everything
	15: {
		1, 8, 34, 402, // Dagger, ShortSword, Rapier, Cape
		79, 80, 450, 451, // WoodShield, LeatherShield, Shoes, LongBoots
		453, 454, 456, 459, 460, // Shirt(M), Hauberk(M), ChainMail(M), Trousers(M), KneeTrousers(M)
		471, 472, 476, 479, 480, // Shirt(W), Hauberk(W), ChainMail(W), Skirt(W), Trousers(W)
		600, // Helm
		91, 92, 93, 94, 95, 96, // Potions
	},
	// Tom the Blacksmith (type 24) — weapons and armor
	24: {
		1,   // Dagger
		8,   // ShortSword
		10,  // MainGauche
		17,  // Gradius+2
		26,  // KnightScimitar
		30,  // Falchion+2
		34,  // Rapier
		402, // Cape
		79,  // WoodShield
		80,  // LeatherShield
		453, 454, 456, // Shirt(M), Hauberk(M), ChainMail(M)
		471, 472, 476, // Shirt(W), Hauberk(W), ChainMail(W)
		459, 460, // Trousers(M), KneeTrousers(M)
		479, 480, // Skirt(W), Trousers(W)
		450, 451, // Shoes, LongBoots
		600, // Helm
	},
	// Howard the Warehouse Keeper (type 20) — potions and supplies
	20: {
		91, // RedPotion (HP)
		92, // BigHealthPotion
		93, // BluePotion (MP)
		94, // BigManaPotion
		95, // GreenPotion (SP)
		96, // BigRevitPotion
	},
}
