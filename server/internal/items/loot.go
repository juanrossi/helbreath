package items

import "math/rand"

// LootDropMultiplier scales all item drop chances. Set by the game engine's difficulty config.
// Default 3.0 = 3x more likely to drop items.
var LootDropMultiplier = 3.0

// -----------------------------------------------------------------------
// Attribute type constants for item generation (C++ NpcDeadItemGenerator)
// Encoded as (type << 20) | (value << 16) in the Attribute field.
// -----------------------------------------------------------------------
const (
	AttrCritical = 1  // Critical hit bonus
	AttrPoison   = 2  // Poison damage
	AttrRite     = 3  // Mana drain / holy damage
	AttrWizard   = 4  // Magic damage bonus
	AttrAgile    = 5  // Dexterity bonus
	AttrLight    = 6  // Hit ratio bonus
	// AttrSharp  = 7  // defined in item.go
	AttrStrong = 8 // Strength bonus
	// AttrAncient = 9 // defined in item.go
)

// iDice simulates rolling n dice of 'sides' sides and summing the results.
func iDice(n, sides int) int {
	if n <= 0 || sides <= 0 {
		return 0
	}
	total := 0
	for i := 0; i < n; i++ {
		total += rand.Intn(sides) + 1
	}
	return total
}

// -----------------------------------------------------------------------
// No-drop NPC types
// -----------------------------------------------------------------------
var noDropNPCTypes = map[int]bool{
	21: true, // Guard
	34: true, // Dummy
	64: true, // Crop
}

// -----------------------------------------------------------------------
// GenLevel mapping: NPC type ID -> equipment generation level (1-12)
// -----------------------------------------------------------------------
var npcGenLevel = map[int]int{
	// GenLevel 1: Slime, Giant-Ant, Amphis, Rabbit, Cat
	10: 1, 16: 1, 22: 1, 55: 1, 56: 1,
	// GenLevel 2: Skeleton, Orc, Scorpion, Zombie
	11: 2, 14: 2, 17: 2, 18: 2,
	// GenLevel 3: Stone-Golem, Clay-Golem, Ice-Golem
	12: 3, 23: 3, 65: 3,
	// GenLevel 4: Hellbound, Frog, Rudolph, Giant-Tree, Plant, DireBoar
	27: 4, 57: 4, 61: 4, 76: 4, 60: 4, 62: 4,
	// GenLevel 5: Cyclops, Troll
	13: 5, 28: 5,
	// GenLevel 6: Ogre, WereWolf, Stalker
	29: 6, 33: 6, 48: 6,
	// GenLevel 7: Beholder, MountainGiant, Claw-Turtle, Giant-Crayfish
	53: 7, 58: 7, 72: 7, 74: 7,
	// GenLevel 8: Dark-Elf, Frost
	54: 8, 63: 8,
	// GenLevel 9: Ettin, Dragon, Nizie, MasterMage-Orc
	59: 9, 70: 9, 79: 9, 77: 9,
	// GenLevel 10: Liche, Demon, Unicorn, Gagoyle, Centaurus, etc.
	30: 10, 31: 10, 32: 10, 52: 10, 71: 10, 75: 10, 78: 10,
	95: 10, 96: 10, 97: 10, 98: 10, 99: 10,
	// GenLevel 11: Hellclaw, Tigerworm, Wyvern, Fire-Wyvern, Abaddon
	49: 11, 50: 11, 66: 11, 73: 11, 81: 11,
	// GenLevel 12: Tentocle (small-item table — treated as genLevel 0, skip for now)
	80: 0,
}

// -----------------------------------------------------------------------
// Melee weapon tables by genLevel
// Each entry can contain duplicates to weight the probability.
// -----------------------------------------------------------------------
var meleeWeaponsByGenLevel = map[int][]int{
	1:  {1, 8, 59},                                             // Dagger, ShortSword, LightAxe
	2:  {15, 34, 31, 68, 23, 28},                               // Gradius, Rapier, Esterk, DAxe, Sabre, Falchion
	3:  {16, 37, 46, 50},                                       // Gradius+1, Templar, Claymore, GreatSword
	4:  {35, 35, 36, 32, 37, 37, 38},                           // Rapier+1 x2, Rapier+2, Esterk+1, Templar x2, Templar+1
	5:  {68, 68, 69, 69, 71, 71, 72, 560},                     // DAxe x2, DAxe+1 x2, WarAxe x2, WarAxe+1, BattleAxe
	6:  {17, 33, 38, 39, 29, 51, 54, 54},                      // Gradius+2, Esterk+2, Templar+1, Templar+2, Falchion+1, GS+1, Flam x2
	7:  {70, 70, 72, 72, 72, 30, 30, 760, 760, 560, 560},     // DAxe+2 x2, WarAxe+1 x3, Falchion+2 x2, Hammer x2, BAxe x2
	8:  {36, 39, 52, 55},                                       // Rapier+2, Templar+2, GS+2, Flam+1
	9:  {615, 760, 560, 580, 761},                              // GiantSword, Hammer, BAxe, BAxe+1, BHammer
	10: {615, 909, 580, 761, 911, 910, 762},                    // GiS, Hammer+1, BAxe+1, BHammer, GiAxe, Vampire, GBHammer
	11: {911, 910, 762},                                         // GiAxe, Vampire, GBHammer
}

// -----------------------------------------------------------------------
// Wand tables by genLevel
// -----------------------------------------------------------------------
var wandByGenLevel = map[int]int{
	// GenLevel 1: no wand
	2:  258, // MagicWand MS0
	3:  258, // MagicWand MS0
	4:  257, // MagicWand MS10
	5:  257, // MagicWand MS10
	6:  256, // MagicWand MS20
	7:  256, // MagicWand MS20
	8:  256, // MagicWand MS20
	9:  256, // MagicWand MS20
	10: 256, // MagicWand MS20
	11: 256, // MagicWand MS20
}

// -----------------------------------------------------------------------
// Armor tables by armor roll result (1-11)
// Each entry can contain duplicates to weight the probability.
// -----------------------------------------------------------------------
var armorByRollResult = map[int][]int{
	1:  {79, 81},                                                                  // WoodShield, TargeShield
	2:  {79, 81},                                                                  // WoodShield, TargeShield
	3:  {453, 471, 460, 481, 83, 83, 83, 83, 83, 83, 83, 83},                    // ShirtM, ShirtW, KneeTrousersM, KneeTrousersW, BlondeShield x8
	4:  {454, 472, 461, 482, 85, 453, 471, 460, 481},                             // Hauberk M/W, ChainHose M/W, LagiShield, or basic
	5:  {455, 475, 87, 480, 471, 460, 459, 484, 484, 474, 473, 453, 470},        // LeatherArmor M/W, TowerShield, or cloth variants
	6:  {456, 478, 458, 478, 600, 601, 454, 472, 461, 482, 402},                 // ChainMail M/W, PlateMail M/W, Helm, FullHelm, Hauberk M/W, ChainHose M/W, Cape
	7:  {462, 483, 457, 477, 679},                                                 // PlateLeggings M/W, ScaleMail M/W, KnightFullHelm
	8:  {687, 688, 681, 682, 750, 751, 752, 753},                                 // KnightHauberk M/W, WizardHauberk M/W, HornedHelm, WingedHelm, WizardCap, WizardHat
	9:  {675, 676, 86, 677, 678},                                                  // KnightPlateMail M/W, KnightShield, KnightLeggings M/W
	10: {675, 676, 451, 590, 591, 402},                                            // KnightPlateMail M/W, LongBoots, RobeM, RobeW, Cape
	11: {451},                                                                      // LongBoots
}

// -----------------------------------------------------------------------
// Potion weighted table
// -----------------------------------------------------------------------

// rollPotion returns a potion/consumable item ID using the C++ weighted table.
// Faithful port of the C++ NpcDeadItemGenerator potion branch (cases 1-9).
func rollPotion() int {
	roll := iDice(1, 10000)
	switch {
	case roll <= 2500:
		return 95 // GreenPotion
	case roll <= 4300:
		return 91 // RedPotion
	case roll <= 5900:
		return 93 // BluePotion
	case roll <= 6900:
		return 96 // BigGreenPotion
	case roll <= 7900:
		return 92 // BigRedPotion
	case roll <= 8700:
		return 94 // BigBluePotion
	case roll <= 9000:
		// C++ case 7: iDice(1,4) — 75% PowerGreen, 25% SuperPowerGreen
		if iDice(1, 4) <= 3 {
			return 390 // PowerGreenPotion
		}
		return 391 // SuperPowerGreenPotion
	case roll <= 9200:
		// C++ case 8: Specials — full nested rare item table
		return rollSpecials()
	default:
		// C++ case 9: Candies and XPotions
		return rollCandies()
	}
}

// rollSpecials implements the C++ case 8 nested rare item table.
// iDice(1,20) with sub-rolls for balls, dyes, and very rare items.
func rollSpecials() int {
	switch iDice(1, 20) {
	case 1:
		return 273 // InvisibilityPotion
	case 2:
		return 285 // HHPotion
	case 3:
		return 286 // CyclPotion
	case 4:
		return 287 // TrollPotion
	case 5:
		return 660 // UnfreezePotion
	case 6:
		return 656 // XelimaStone
	case 7:
		return 657 // MerienStone
	case 8, 9:
		return 651 // GreenBall
	case 10, 11:
		// Sub-roll for rarer balls, dyes
		switch iDice(1, 10) {
		case 1, 2, 3:
			return 652 // RedBall
		case 4, 5:
			return 653 // YellowBall
		case 6:
			return 654 // BlueBall
		default: // 7-10
			// Armor dyes or PearlBall
			switch iDice(1, 14) {
			case 1:
				return 881 // ArmorDye(Indigo)
			case 2:
				return 882 // ArmorDye(CrimsonRed)
			case 3:
				return 883 // ArmorDye(Gold)
			case 4:
				return 884 // ArmorDye(Aqua)
			case 5:
				return 885 // ArmorDye(Pink)
			case 6:
				return 886 // ArmorDye(Violet)
			case 7:
				return 887 // ArmorDye(Blue)
			case 8:
				return 888 // ArmorDye(Khaki)
			case 9:
				return 889 // ArmorDye(Yellow)
			case 10:
				return 890 // ArmorDye(Red)
			default:
				return 655 // PearlBall
			}
		}
	default: // 12-20
		return 650 // Zem (ZemstoneOfSacrifice)
	}
}

// rollCandies implements the C++ case 9 candies/XPotions table.
func rollCandies() int {
	switch iDice(1, 6) {
	case 1, 2, 3:
		return 780 // RedCandy
	case 4, 5:
		return 782 // GreenCandy
	default: // 6
		// Sub-roll: XPotions are rare, BlueCandy is common
		switch iDice(1, 30) {
		case 1:
			return 783 // XRedPotion
		case 2:
			return 784 // XBluePotion
		case 3:
			return 785 // XGreenPotion
		default:
			return 781 // BlueCandy
		}
	}
}

// -----------------------------------------------------------------------
// Weapon attribute generation (C++ faithful port)
// -----------------------------------------------------------------------

// rollWeaponAttribute returns an attribute encoded as (type << 20) | (value << 16).
// genLevel caps the maximum attribute value for low-level mobs.
func rollWeaponAttribute(genLevel int) uint32 {
	// Determine attribute type using weighted roll
	typeRoll := iDice(1, 10000)
	var attrType int
	switch {
	case typeRoll <= 300:
		attrType = AttrLight // 3%
	case typeRoll <= 1000:
		attrType = AttrStrong // 7%
	case typeRoll <= 2500:
		attrType = AttrCritical // 15%
	case typeRoll <= 3500:
		attrType = AttrWizard // 10%
	case typeRoll <= 5000:
		attrType = AttrAgile // 15%
	case typeRoll <= 6000:
		attrType = AttrRite // 10%
	case typeRoll <= 7700:
		attrType = AttrPoison // 17%
	case typeRoll <= 9500:
		attrType = AttrSharp // 18%
	default:
		attrType = AttrAncient // 5%
	}

	// Roll attribute value (heavily weighted toward low values)
	value := rollAttributeValue()

	// Cap for low-level mobs
	if genLevel <= 2 && value > 7 {
		value = 7
	}

	return uint32(attrType<<20) | uint32(value<<16)
}

// rollArmorAttribute returns an attribute for armor/defense items.
// Similar distribution but tuned for defensive equipment.
func rollArmorAttribute(genLevel int) uint32 {
	typeRoll := iDice(1, 10000)
	var attrType int
	switch {
	case typeRoll <= 300:
		attrType = AttrLight // 3%
	case typeRoll <= 1000:
		attrType = AttrStrong // 7%
	case typeRoll <= 2500:
		attrType = AttrCritical // 15%
	case typeRoll <= 3500:
		attrType = AttrWizard // 10%
	case typeRoll <= 5000:
		attrType = AttrAgile // 15%
	case typeRoll <= 6000:
		attrType = AttrRite // 10%
	case typeRoll <= 7700:
		attrType = AttrPoison // 17%
	case typeRoll <= 9500:
		attrType = AttrSharp // 18%
	default:
		attrType = AttrAncient // 5%
	}

	value := rollAttributeValue()

	if genLevel <= 2 && value > 7 {
		value = 7
	}

	return uint32(attrType<<20) | uint32(value<<16)
}

// rollAttributeValue returns a value 1-13, heavily weighted toward low values.
// This mimics the C++ weighted distribution.
func rollAttributeValue() int {
	roll := iDice(1, 10000)
	switch {
	case roll <= 5000:
		return 1
	case roll <= 7000:
		return 2
	case roll <= 8000:
		return 3
	case roll <= 8600:
		return 4
	case roll <= 9000:
		return 5
	case roll <= 9300:
		return 6
	case roll <= 9550:
		return 7
	case roll <= 9700:
		return 8
	case roll <= 9820:
		return 9
	case roll <= 9900:
		return 10
	case roll <= 9950:
		return 11
	case roll <= 9980:
		return 12
	default:
		return 13
	}
}

// -----------------------------------------------------------------------
// NpcDeadItemGenerator — faithful port from C++ Game.cpp
// -----------------------------------------------------------------------

// NpcDeadItemGenerator determines what items drop when an NPC dies.
// This is a faithful port of the C++ NpcDeadItemGenerator function.
// Gold drops are handled separately by the engine via RollGoldDrop.
//
// C++ flow: primary check → gold/item split → potion/equipment split
// Gold is always given by the engine; the gold branch here acts as a probability
// gate (60% of primary drops produce gold only, 40% continue to item generation).
//
// Parameters:
//   - npcTypeID: the NPC type identifier (e.g. 10=Slime, 11=Skeleton)
//   - npcXP: the NPC's base experience value (used for gold scaling)
//   - isBoss: whether this NPC has BossType > 0 (guaranteed primary drop)
//
// Returns a slice of items to drop, or nil if nothing drops.
func NpcDeadItemGenerator(npcTypeID int, npcXP int, isBoss bool) []*Item {
	// Step 1: No-drop NPC types
	if noDropNPCTypes[npcTypeID] {
		return nil
	}

	// Step 2: Primary drop rate check
	// C++: iDice(1,10000) >= dTmp2 where dTmp2 = 6500 for regular, 1 for bosses.
	// Bosses always pass. Regular NPCs: ~35% base chance, scaled by LootDropMultiplier.
	if !isBoss {
		// C++ default primaryDropRate = 6500 → need to roll >= 6500 → ~35% chance.
		// With our multiplier: effective chance = 35% * multiplier.
		primaryChance := int(3500 * LootDropMultiplier)
		if primaryChance > 10000 {
			primaryChance = 10000
		}
		if iDice(1, 10000) > primaryChance {
			return nil
		}
	}

	// Step 3: Gold branch gate (C++ m_iGoldDropRate, default 6000)
	// In C++, 60% of drops that pass the primary check are gold-only.
	// Gold itself is always awarded by the engine via RollGoldDrop(), but this
	// probability gate must exist to maintain the correct item rarity.
	// Bosses: 30% gold-only, 70% continue to item generation.
	goldRate := 6000
	if isBoss {
		goldRate = 3000
	}
	if iDice(1, 10000) <= goldRate {
		return nil // Gold-only drop; no item. Gold is awarded separately by the engine.
	}

	// Step 4: Potion vs Equipment split
	// C++ secondaryDropRate: regular = 9000 (90% potion, 10% equipment), boss = 3000 (30% potion, 70% equipment).
	var secondaryDropRate int
	if isBoss {
		secondaryDropRate = 3000
	} else {
		secondaryDropRate = 9000
	}

	if iDice(1, 10000) <= secondaryDropRate {
		// Potion drop
		potionID := rollPotion()
		def := GetItemDef(potionID)
		if def == nil {
			return nil
		}
		return []*Item{NewItem(def, 1)}
	}

	// Step 5: Equipment generation (the "valuable drop")
	return generateEquipmentDrop(npcTypeID)
}

// generateEquipmentDrop handles the equipment generation path of NpcDeadItemGenerator.
func generateEquipmentDrop(npcTypeID int) []*Item {
	// Step 5a: Determine genLevel from NPC type
	genLevel, ok := npcGenLevel[npcTypeID]
	if !ok || genLevel == 0 {
		return nil
	}

	// Step 5b: Weapon vs Armor split — 60% weapon, 40% armor
	if iDice(1, 10000) <= 6000 {
		// Weapon generation
		return generateWeaponDrop(genLevel)
	}
	// Armor generation
	return generateArmorDrop(genLevel)
}

// generateWeaponDrop handles weapon generation for the equipment drop path.
func generateWeaponDrop(genLevel int) []*Item {
	// Step 5c: 80% melee weapon, 20% magic wand
	if iDice(1, 10000) <= 8000 {
		// Melee weapon
		weapons, ok := meleeWeaponsByGenLevel[genLevel]
		if !ok || len(weapons) == 0 {
			return nil
		}
		itemID := weapons[rand.Intn(len(weapons))]
		def := GetItemDef(itemID)
		if def == nil {
			return nil
		}
		item := NewItem(def, 1)
		// Apply weapon attribute
		item.Attribute = rollWeaponAttribute(genLevel)
		return []*Item{item}
	}

	// Magic wand
	wandID, ok := wandByGenLevel[genLevel]
	if !ok {
		return nil // genLevel 1 has no wand
	}
	def := GetItemDef(wandID)
	if def == nil {
		return nil
	}
	item := NewItem(def, 1)
	item.Attribute = rollWeaponAttribute(genLevel)
	return []*Item{item}
}

// generateArmorDrop handles armor generation for the equipment drop path.
func generateArmorDrop(genLevel int) []*Item {
	// Step 5d: Roll iDice(1, genLevel) to determine armor tier
	armorRoll := iDice(1, genLevel)

	armorList, ok := armorByRollResult[armorRoll]
	if !ok || len(armorList) == 0 {
		return nil
	}

	itemID := armorList[rand.Intn(len(armorList))]
	def := GetItemDef(itemID)
	if def == nil {
		return nil
	}

	item := NewItem(def, 1)
	// Apply armor attribute
	item.Attribute = rollArmorAttribute(genLevel)
	return []*Item{item}
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
