package items

import "math/rand"

// LootDropMultiplier scales all item drop chances. Set by the game engine's difficulty config.
// Default 3.0 = 3x more likely to drop items.
var LootDropMultiplier = 3.0

// LootEntry defines a possible drop from an NPC.
type LootEntry struct {
	ItemID     int
	DropChance float64 // 0.0 to 1.0
	MinCount   int
	MaxCount   int
}

// NpcLootTables maps NPC type ID (matching npc.go) to loot entries.
// Item IDs reference the original Helbreath Item.cfg (via itemdefs_gen.go).
// Keys are the actual NPC type IDs from npc.go (10=Slime, 11=Skeleton, etc.)
var NpcLootTables = map[int][]LootEntry{

	// ================================================================
	// Tier 1: Level 1-20 (starter mobs)
	// ================================================================

	10: { // Slime
		{ItemID: 91, DropChance: 0.25, MinCount: 1, MaxCount: 1}, // RedPotion
	},
	55: { // Rabbit
		{ItemID: 91, DropChance: 0.15, MinCount: 1, MaxCount: 1}, // RedPotion
	},
	56: { // Cat
		{ItemID: 91, DropChance: 0.20, MinCount: 1, MaxCount: 1}, // RedPotion
		{ItemID: 1, DropChance: 0.05, MinCount: 1, MaxCount: 1},   // Dagger
	},
	16: { // Giant-Ant
		{ItemID: 91, DropChance: 0.20, MinCount: 1, MaxCount: 1}, // RedPotion
		{ItemID: 1, DropChance: 0.06, MinCount: 1, MaxCount: 1},   // Dagger
		{ItemID: 450, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Shoes
	},
	22: { // Amphis
		{ItemID: 91, DropChance: 0.20, MinCount: 1, MaxCount: 1},  // RedPotion
		{ItemID: 93, DropChance: 0.10, MinCount: 1, MaxCount: 1},  // BluePotion
		{ItemID: 8, DropChance: 0.06, MinCount: 1, MaxCount: 1},    // ShortSword
		{ItemID: 79, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // WoodShield
	},
	14: { // Orc
		{ItemID: 91, DropChance: 0.20, MinCount: 1, MaxCount: 1},  // RedPotion
		{ItemID: 93, DropChance: 0.10, MinCount: 1, MaxCount: 1},  // BluePotion
		{ItemID: 8, DropChance: 0.08, MinCount: 1, MaxCount: 1},    // ShortSword
		{ItemID: 79, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // WoodShield
		{ItemID: 454, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Hauberk(M)
		{ItemID: 450, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Shoes
	},

	// ================================================================
	// Tier 2: Level 20-40
	// ================================================================

	18: { // Zombie
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 1},  // BigHealthPotion
		{ItemID: 93, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // BluePotion
		{ItemID: 8, DropChance: 0.08, MinCount: 1, MaxCount: 1},    // ShortSword
		{ItemID: 80, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // LeatherShield
		{ItemID: 454, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // Hauberk(M)
		{ItemID: 472, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // Hauberk(W)
		{ItemID: 600, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Helm
	},
	17: { // Scorpion
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 1},  // BigHealthPotion
		{ItemID: 93, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // BluePotion
		{ItemID: 331, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // Rapier
		{ItemID: 80, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // LeatherShield
		{ItemID: 402, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Cape
		{ItemID: 451, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // LongBoots
	},
	11: { // Skeleton
		{ItemID: 92, DropChance: 0.18, MinCount: 1, MaxCount: 1},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 50, DropChance: 0.05, MinCount: 1, MaxCount: 1},   // GreatSword
		{ItemID: 81, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TargeShield
		{ItemID: 456, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // ChainMail(M)
		{ItemID: 476, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // ChainMail(W)
		{ItemID: 461, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // ChainHose(M)
		{ItemID: 600, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Helm
	},
	1001: { // Orc-Mage
		{ItemID: 94, DropChance: 0.20, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 92, DropChance: 0.15, MinCount: 1, MaxCount: 1},  // BigHealthPotion
		{ItemID: 259, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // WandMShield
		{ItemID: 456, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainMail(M)
		{ItemID: 402, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // Cape
	},

	// ================================================================
	// Tier 3: Level 40-50
	// ================================================================

	23: { // Clay-Golem
		{ItemID: 92, DropChance: 0.18, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 50, DropChance: 0.06, MinCount: 1, MaxCount: 1},   // GreatSword
		{ItemID: 81, DropChance: 0.06, MinCount: 1, MaxCount: 1},  // TargeShield
		{ItemID: 456, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainMail(M)
		{ItemID: 461, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainHose(M)
		{ItemID: 482, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainHose(W)
	},
	12: { // Stone-Golem
		{ItemID: 92, DropChance: 0.18, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 68, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // DoubleAxe
		{ItemID: 87, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 458, DropChance: 0.03, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.03, MinCount: 1, MaxCount: 1}, // PlateMail(W)
	},
	27: { // Hellbound
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 50, DropChance: 0.06, MinCount: 1, MaxCount: 1},   // GreatSword
		{ItemID: 458, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 462, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 337, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RubyRing
	},
	57: { // Frog
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // BigManaPotion
		{ItemID: 456, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainMail(M)
		{ItemID: 476, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainMail(W)
		{ItemID: 402, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // Cape
	},

	// ================================================================
	// Tier 4: Level 50-60
	// ================================================================

	28: { // Troll
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 71, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // WarAxe
		{ItemID: 87, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 458, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateMail(W)
		{ItemID: 462, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 483, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(W)
		{ItemID: 337, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RubyRing
	},
	13: { // Cyclops
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 560, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // BattleAxe
		{ItemID: 87, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 458, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 462, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 632, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfOgrePower
		{ItemID: 259, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // WandMShield
	},
	65: { // Ice-Golem
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 458, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateMail(W)
		{ItemID: 642, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // NecklaceOfIcePotion
		{ItemID: 643, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // NecklaceOfIceEl
	},

	// ================================================================
	// Tier 5: Level 60-90
	// ================================================================

	29: { // Ogre
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 74, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // GoldenAxe
		{ItemID: 87, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 458, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(W)
		{ItemID: 462, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 483, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateLeggings(W)
		{ItemID: 632, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfOgrePower
		{ItemID: 656, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // XelimaStone
	},
	33: { // WereWolf
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 458, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(W)
		{ItemID: 87, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 462, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 633, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfDemonPower
		{ItemID: 657, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // MerienStone
		{ItemID: 305, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // MagicNecklaceDM+1
	},
	48: { // Stalker
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 458, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 87, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 462, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 483, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // PlateLeggings(W)
		{ItemID: 634, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfWizard
		{ItemID: 311, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // MagicNecklaceDF+10
		{ItemID: 656, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // XelimaStone
	},
	53: { // Beholder
		{ItemID: 92, DropChance: 0.18, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 259, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // WandMShield
		{ItemID: 635, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfMage
		{ItemID: 305, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // MagicNecklaceDM+1
	},
	60: { // Plant
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 458, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 87, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 634, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfWizard
		{ItemID: 641, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // NecklaceOfMedusa
	},
	58: { // Mountain-Giant
		{ItemID: 92, DropChance: 0.20, MinCount: 1, MaxCount: 3},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 911, DropChance: 0.04, MinCount: 1, MaxCount: 1}, // GreatAxe
		{ItemID: 458, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 462, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 632, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfOgrePower
	},
	80: { // Tentocle
		{ItemID: 92, DropChance: 0.18, MinCount: 1, MaxCount: 2},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.15, MinCount: 1, MaxCount: 2},  // BigManaPotion
		{ItemID: 456, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // ChainMail(M)
		{ItemID: 311, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // MagicNecklaceDF+10
	},

	// ================================================================
	// Tier 6: Level 90+ (endgame)
	// ================================================================

	30: { // Liche
		{ItemID: 92, DropChance: 0.20, MinCount: 2, MaxCount: 4},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.18, MinCount: 1, MaxCount: 3},  // BigManaPotion
		{ItemID: 458, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // PlateMail(W)
		{ItemID: 462, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 87, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 635, DropChance: 0.03, MinCount: 1, MaxCount: 1}, // RingOfMage
		{ItemID: 656, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // XelimaStone
		{ItemID: 657, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // MerienStone
		{ItemID: 858, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // NecklaceOfMerien
	},
	59: { // Ettin
		{ItemID: 92, DropChance: 0.20, MinCount: 2, MaxCount: 4},  // BigHealthPotion
		{ItemID: 94, DropChance: 0.18, MinCount: 1, MaxCount: 3},  // BigManaPotion
		{ItemID: 458, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // PlateMail(M)
		{ItemID: 478, DropChance: 0.06, MinCount: 1, MaxCount: 1}, // PlateMail(W)
		{ItemID: 87, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // TowerShield
		{ItemID: 462, DropChance: 0.05, MinCount: 1, MaxCount: 1}, // PlateLeggings(M)
		{ItemID: 735, DropChance: 0.02, MinCount: 1, MaxCount: 1}, // RingOfDragonPower
		{ItemID: 656, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // XelimaStone
		{ItemID: 860, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // NecklaceOfXelima
	},

	// ================================================================
	// Boss mobs (Hellclaw, Tigerworm, etc.)
	// ================================================================

	49: { // Hellclaw — drops from original Helbreath wiki
		// Armor (uncommon)
		{ItemID: 458, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // PlateMail(M)
		{ItemID: 478, DropChance: 0.12, MinCount: 1, MaxCount: 1},  // PlateMail(W)
		{ItemID: 454, DropChance: 0.10, MinCount: 1, MaxCount: 1},  // Hauberk(M)
		{ItemID: 472, DropChance: 0.10, MinCount: 1, MaxCount: 1},  // Hauberk(W)
		{ItemID: 87, DropChance: 0.10, MinCount: 1, MaxCount: 1},   // TowerShield
		{ItemID: 462, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // PlateLeggings(M)
		{ItemID: 483, DropChance: 0.08, MinCount: 1, MaxCount: 1},  // PlateLeggings(W)
		// Uncommon accessories
		{ItemID: 656, DropChance: 0.06, MinCount: 1, MaxCount: 1},   // XelimaStone
		{ItemID: 657, DropChance: 0.06, MinCount: 1, MaxCount: 1},   // MerienStone
		{ItemID: 311, DropChance: 0.05, MinCount: 1, MaxCount: 1},   // MagicNecklaceDF+10
		{ItemID: 305, DropChance: 0.05, MinCount: 1, MaxCount: 1},   // MagicNecklaceDM+1
		{ItemID: 632, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // RingOfOgrePower
		{ItemID: 634, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // RingOfWizard
		{ItemID: 337, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // RubyRing
		{ItemID: 259, DropChance: 0.04, MinCount: 1, MaxCount: 1},   // WandMShield
		{ItemID: 633, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // RingOfDemonPower
		{ItemID: 635, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // RingOfMage
		{ItemID: 735, DropChance: 0.03, MinCount: 1, MaxCount: 1},  // RingOfDragonPower
		// Rares
		{ItemID: 335, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // EmeraldRing
		{ItemID: 636, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // RingOfGrandMage
		{ItemID: 620, DropChance: 0.01, MinCount: 1, MaxCount: 1},  // MerienShield
		{ItemID: 614, DropChance: 0.01, MinCount: 1, MaxCount: 1},   // IceElementalSword
		{ItemID: 642, DropChance: 0.01, MinCount: 1, MaxCount: 1},   // NecklaceOfIcePotion
		{ItemID: 643, DropChance: 0.01, MinCount: 1, MaxCount: 1},   // NecklaceOfIceEl
		{ItemID: 858, DropChance: 0.01, MinCount: 1, MaxCount: 1},   // NecklaceOfMerien
		{ItemID: 860, DropChance: 0.01, MinCount: 1, MaxCount: 1},   // NecklaceOfXelima
		{ItemID: 641, DropChance: 0.01, MinCount: 1, MaxCount: 1},   // NecklaceOfMedusa
		// Potions (guaranteed)
		{ItemID: 92, DropChance: 1.0, MinCount: 3, MaxCount: 5},    // BigHealthPotion
		{ItemID: 94, DropChance: 1.0, MinCount: 2, MaxCount: 4},    // BigManaPotion
	},
	50: { // Tigerworm (ultra-rare boss)
		{ItemID: 92, DropChance: 1.0, MinCount: 3, MaxCount: 5},    // BigHealthPotion
		{ItemID: 94, DropChance: 1.0, MinCount: 2, MaxCount: 4},    // BigManaPotion
		{ItemID: 458, DropChance: 0.15, MinCount: 1, MaxCount: 1},  // PlateMail(M)
		{ItemID: 478, DropChance: 0.15, MinCount: 1, MaxCount: 1},  // PlateMail(W)
		{ItemID: 87, DropChance: 0.12, MinCount: 1, MaxCount: 1},   // TowerShield
		{ItemID: 735, DropChance: 0.05, MinCount: 1, MaxCount: 1},  // RingOfDragonPower
		{ItemID: 636, DropChance: 0.04, MinCount: 1, MaxCount: 1},  // RingOfGrandMage
		{ItemID: 614, DropChance: 0.03, MinCount: 1, MaxCount: 1},   // IceElementalSword
		{ItemID: 620, DropChance: 0.02, MinCount: 1, MaxCount: 1},  // MerienShield
		{ItemID: 860, DropChance: 0.02, MinCount: 1, MaxCount: 1},   // NecklaceOfXelima
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
		chance := entry.DropChance * LootDropMultiplier
		if chance > 1.0 {
			chance = 1.0
		}
		if rand.Float64() < chance {
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
func PotionTierByDifficulty(npcXP int) int {
	if npcXP >= 500 {
		if rand.Intn(2) == 0 {
			return 92 // BigHealthPotion
		}
		return 94 // BigManaPotion
	}
	if rand.Intn(2) == 0 {
		return 91 // RedPotion
	}
	return 93 // BluePotion
}

// RollMultiTierLoot performs multi-tier loot rolling for an NPC kill.
// Tier 1: Gold (always, handled separately via RollGoldDrop)
// Tier 2: Potion (35% chance, tier based on NPC difficulty)
// Tier 3: Equipment (from NpcLootTables, standard roll)
// Tier 4: Rare (0.1% chance, random high-tier drop with Ancient attribute)
func RollMultiTierLoot(npcTypeID int, npcXP int) []*Item {
	var drops []*Item

	// Tier 2: Potion roll (35% base, scaled by drop multiplier)
	// Skip if the NPC already has potions in its loot table (avoids double potions)
	if _, hasTable := NpcLootTables[npcTypeID]; !hasTable {
		potionChance := 0.35 * LootDropMultiplier
		if potionChance > 1.0 {
			potionChance = 1.0
		}
		if rand.Float64() < potionChance {
			potionID := PotionTierByDifficulty(npcXP)
			def := GetItemDef(potionID)
			if def != nil {
				drops = append(drops, NewItem(def, 1))
			}
		}
	}

	// Tier 3: Equipment roll from standard loot table
	tableLoot := RollLoot(npcTypeID)
	drops = append(drops, tableLoot...)

	// Tier 4: Rare roll (0.1% base, scaled by drop multiplier)
	rareChance := 0.001 * LootDropMultiplier
	if rand.Float64() < rareChance {
		rareItems := []int{614, 620, 656, 657, 335, 735, 636} // IceElementalSword, MerienShield, stones, rings
		rareID := rareItems[rand.Intn(len(rareItems))]
		def := GetItemDef(rareID)
		if def != nil {
			item := NewItem(def, 1)
			item.Attribute = uint32(AttrAncient) << 20
			drops = append(drops, item)
		}
	}

	return drops
}

// ShopInventory defines what items each shop NPC sells.
var ShopInventories = map[int][]int{
	// ShopKeeper-W (type 15) — general shop
	15: {
		1, 8, 34, 402,       // Dagger, ShortSword, Rapier, Cape
		79, 80, 450, 451,    // WoodShield, LeatherShield, Shoes, LongBoots
		454, 456, 472, 476,  // Hauberk(M), ChainMail(M), Hauberk(W), ChainMail(W)
		600,                  // Helm
		91, 92, 93, 94,      // Potions (HP, BigHP, MP, BigMP)
	},
	// Tom the Blacksmith (type 24)
	24: {
		1, 8, 34, 50,        // Dagger, ShortSword, Rapier, GreatSword
		68, 71,               // DoubleAxe, WarAxe
		79, 80, 81,           // WoodShield, LeatherShield, TargeShield
		454, 456, 458,        // Hauberk(M), ChainMail(M), PlateMail(M)
		472, 476, 478,        // Hauberk(W), ChainMail(W), PlateMail(W)
		461, 462,             // ChainHose(M), PlateLeggings(M)
		482, 483,             // ChainHose(W), PlateLeggings(W)
		450, 451, 402,        // Shoes, LongBoots, Cape
		600,                   // Helm
	},
	// Howard the Warehouse Keeper (type 20) — potions and supplies
	20: {
		91, 92,  // RedPotion, BigHealthPotion
		93, 94,  // BluePotion, BigManaPotion
	},
}
