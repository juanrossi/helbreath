package npc

import (
	"math/rand"
	"time"

	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// AIState represents the current behavior state of an NPC.
type AIState int

const (
	StateIdle   AIState = iota // Standing still
	StateWander               // Randomly walking around spawn
	StateChase                // Moving toward aggro target
	StateAttack               // Attacking target
	StateDead                 // Dead, waiting to respawn
	StateFlee                 // Retreating from danger
)

// Creature size categories (determines which weapon dice set is used).
const (
	SizeSmall  = 0
	SizeMedium = 1
	SizeLarge  = 2
)

// NPC faction sides.
const (
	SideNeutral  = 0
	SideAresden  = 1
	SideElvine   = 2
	SideSpecial  = 3
	SideMonster  = 10
)

// NpcType defines a type of NPC/monster with base stats.
type NpcType struct {
	ID          int
	Name        string
	SpriteType  int // sprite type ID for client rendering
	HP          int
	MinDamage   int // legacy range (kept for fallback)
	MaxDamage   int
	Defense     int
	DEX         int // affects hit/dodge
	INT         int // intelligence, affects magic resistance
	XP          int // experience reward
	AggroRange  int // tiles to detect players
	MoveSpeed   int // ms per tile movement
	AttackSpeed int // ms between attacks
	WanderRange int // max tiles from spawn to wander

	// Dice-based damage (C++ port — authoritative for combat)
	DiceThrow   int // number of dice for attack
	DiceRange   int // sides per die
	AttackBonus int // flat bonus added to dice roll

	// Classification
	Size int // SizeSmall, SizeMedium, SizeLarge
	Side int // faction: SideNeutral, SideMonster, etc.

	// AI behavior
	CanFlee      bool          // whether this NPC can flee
	FleeHPPct    int           // flee when HP% drops below this (e.g. 20)
	RespawnDelay time.Duration // time to wait before respawning after death

	// Boss flag
	BossType       int    // 0=regular, 1=boss (special loot, abilities)
	SpecialAbility string // death effect or special ability identifier (for future use)

	// NPC spellcasting (Phase 3)
	Mana          int
	MaxMana       int
	MagicHitRatio int

	// Attack range in tiles (1 = melee, 2+ = ranged)
	AttackRange int
}

// Predefined NPC types — all stats from original NPC.cfg
// (helbreath-v3.82-master/Server/Core/NPC.cfg)
// HP = HitDice * 10, ActionTime = MoveSpeed = AttackSpeed
var NpcTypes = map[int]*NpcType{
	// ================================================================
	// Level 10-20 (starter area)
	// ================================================================
	10: {ID: 10, Name: "Slime", SpriteType: 10, HP: 20, MinDamage: 1, MaxDamage: 4, Defense: 20, DEX: 30, XP: 45,
		AggroRange: 2, MoveSpeed: 2100, AttackSpeed: 2100, WanderRange: 8,
		DiceThrow: 1, DiceRange: 4, Size: SizeSmall, Side: SideMonster, RespawnDelay: 5 * time.Second},
	55: {ID: 55, Name: "Rabbit", SpriteType: 55, HP: 40, MinDamage: 1, MaxDamage: 5, Defense: 20, DEX: 35, XP: 37,
		AggroRange: 0, MoveSpeed: 1500, AttackSpeed: 1500, WanderRange: 8,
		DiceThrow: 1, DiceRange: 5, Size: SizeSmall, Side: SideMonster, CanFlee: true, FleeHPPct: 50, RespawnDelay: 5 * time.Second},
	56: {ID: 56, Name: "Cat", SpriteType: 56, HP: 40, MinDamage: 2, MaxDamage: 8, Defense: 40, DEX: 45, XP: 105,
		AggroRange: 5, MoveSpeed: 1500, AttackSpeed: 1500, WanderRange: 8,
		DiceThrow: 2, DiceRange: 4, Size: SizeSmall, Side: SideMonster, RespawnDelay: 5 * time.Second},
	16: {ID: 16, Name: "Giant-Ant", SpriteType: 16, HP: 30, MinDamage: 2, MaxDamage: 6, Defense: 30, DEX: 40, XP: 98,
		AggroRange: 2, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 2, DiceRange: 3, Size: SizeSmall, Side: SideMonster, RespawnDelay: 5 * time.Second},

	// ================================================================
	// Level 10-20 (snakes / amphibians)
	// ================================================================
	22: {ID: 22, Name: "Amphis", SpriteType: 22, HP: 40, MinDamage: 2, MaxDamage: 8, Defense: 60, DEX: 50, XP: 115,
		AggroRange: 3, MoveSpeed: 1000, AttackSpeed: 1000, WanderRange: 8,
		DiceThrow: 2, DiceRange: 4, Size: SizeMedium, Side: SideMonster, RespawnDelay: 5 * time.Second},
	14: {ID: 14, Name: "Orc", SpriteType: 14, HP: 40, MinDamage: 3, MaxDamage: 9, Defense: 75, DEX: 70, XP: 126,
		AggroRange: 5, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 3, DiceRange: 3, Size: SizeLarge, Side: SideMonster, RespawnDelay: 5 * time.Second},

	// ================================================================
	// Level 20-40
	// ================================================================
	18: {ID: 18, Name: "Zombie", SpriteType: 18, HP: 100, MinDamage: 4, MaxDamage: 16, Defense: 80, DEX: 90, XP: 189,
		AggroRange: 6, MoveSpeed: 1500, AttackSpeed: 1500, WanderRange: 8,
		DiceThrow: 4, DiceRange: 4, Size: SizeMedium, Side: SideMonster, RespawnDelay: 5 * time.Second},
	17: {ID: 17, Name: "Scorpion", SpriteType: 17, HP: 60, MinDamage: 5, MaxDamage: 15, Defense: 70, DEX: 80, XP: 161,
		AggroRange: 4, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 5, DiceRange: 3, Size: SizeMedium, Side: SideMonster, RespawnDelay: 5 * time.Second},
	11: {ID: 11, Name: "Skeleton", SpriteType: 11, HP: 80, MinDamage: 5, MaxDamage: 20, Defense: 80, DEX: 100, XP: 262,
		AggroRange: 5, MoveSpeed: 800, AttackSpeed: 800, WanderRange: 10,
		DiceThrow: 5, DiceRange: 4, Size: SizeMedium, Side: SideMonster, RespawnDelay: 5 * time.Second},

	// ================================================================
	// Level 40-50
	// ================================================================
	23: {ID: 23, Name: "Clay-Golem", SpriteType: 23, HP: 300, MinDamage: 7, MaxDamage: 28, Defense: 100, DEX: 150, XP: 542,
		AggroRange: 5, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 7, DiceRange: 4, Size: SizeLarge, Side: SideMonster, RespawnDelay: 10 * time.Second},
	12: {ID: 12, Name: "Stone-Golem", SpriteType: 12, HP: 250, MinDamage: 7, MaxDamage: 28, Defense: 110, DEX: 150, XP: 542,
		AggroRange: 5, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 7, DiceRange: 4, Size: SizeLarge, Side: SideMonster, RespawnDelay: 10 * time.Second},
	27: {ID: 27, Name: "Hellbound", SpriteType: 27, HP: 350, MinDamage: 7, MaxDamage: 35, Defense: 90, DEX: 170, XP: 892,
		AggroRange: 7, MoveSpeed: 900, AttackSpeed: 900, WanderRange: 8,
		DiceThrow: 7, DiceRange: 5, Size: SizeLarge, Side: SideMonster, INT: 50, MaxMana: 250, MagicHitRatio: 20, RespawnDelay: 10 * time.Second},
	57: {ID: 57, Name: "Frog", SpriteType: 57, HP: 350, MinDamage: 7, MaxDamage: 35, Defense: 90, DEX: 170, XP: 945,
		AggroRange: 7, MoveSpeed: 900, AttackSpeed: 900, WanderRange: 8,
		DiceThrow: 7, DiceRange: 5, Size: SizeLarge, Side: SideMonster, AttackRange: 2, RespawnDelay: 10 * time.Second},
	61: {ID: 61, Name: "Rudolph", SpriteType: 61, HP: 400, MinDamage: 7, MaxDamage: 35, Defense: 100, DEX: 180, XP: 980,
		AggroRange: 5, MoveSpeed: 1000, AttackSpeed: 1000, WanderRange: 8,
		DiceThrow: 7, DiceRange: 5, Size: SizeLarge, Side: SideMonster, INT: 50, RespawnDelay: 10 * time.Second},

	// ================================================================
	// Level 50-60
	// ================================================================
	28: {ID: 28, Name: "Troll", SpriteType: 28, HP: 550, MinDamage: 8, MaxDamage: 40, Defense: 85, DEX: 200, XP: 1260,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 5, Size: SizeLarge, Side: SideMonster, RespawnDelay: 10 * time.Second},
	13: {ID: 13, Name: "Cyclops", SpriteType: 13, HP: 600, MinDamage: 8, MaxDamage: 48, Defense: 100, DEX: 180, XP: 1100,
		AggroRange: 7, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 8, DiceRange: 6, Size: SizeLarge, Side: SideMonster, INT: 50, MaxMana: 450, MagicHitRatio: 50, AttackRange: 3, RespawnDelay: 10 * time.Second},
	65: {ID: 65, Name: "Ice-Golem", SpriteType: 65, HP: 600, MinDamage: 8, MaxDamage: 48, Defense: 100, DEX: 180, XP: 1120,
		AggroRange: 7, MoveSpeed: 1200, AttackSpeed: 1200, WanderRange: 8,
		DiceThrow: 8, DiceRange: 6, Size: SizeLarge, Side: SideMonster, INT: 110, MaxMana: 150, MagicHitRatio: 200, RespawnDelay: 10 * time.Second},

	// ================================================================
	// Level 60-90
	// ================================================================
	53: {ID: 53, Name: "Beholder", SpriteType: 53, HP: 1000, MinDamage: 8, MaxDamage: 64, Defense: 100, DEX: 450, XP: 2380,
		AggroRange: 7, MoveSpeed: 800, AttackSpeed: 800, WanderRange: 8,
		DiceThrow: 8, DiceRange: 8, Size: SizeLarge, Side: SideMonster, MagicHitRatio: 200, AttackRange: 4, RespawnDelay: 10 * time.Second},
	60: {ID: 60, Name: "Plant", SpriteType: 60, HP: 900, MinDamage: 8, MaxDamage: 56, Defense: 80, DEX: 230, XP: 2425,
		AggroRange: 7, MoveSpeed: 800, AttackSpeed: 800, WanderRange: 8,
		DiceThrow: 8, DiceRange: 7, Size: SizeLarge, Side: SideMonster, INT: 50, MaxMana: 550, MagicHitRatio: 65, AttackRange: 2, RespawnDelay: 10 * time.Second},
	29: {ID: 29, Name: "Ogre", SpriteType: 29, HP: 1150, MinDamage: 8, MaxDamage: 56, Defense: 150, DEX: 230, XP: 2500,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 7, Size: SizeLarge, Side: SideMonster, AttackRange: 3, RespawnDelay: 10 * time.Second},
	58: {ID: 58, Name: "Mountain-Giant", SpriteType: 58, HP: 1000, MinDamage: 8, MaxDamage: 56, Defense: 250, DEX: 230, XP: 2500,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 7, Size: SizeLarge, Side: SideMonster, AttackRange: 2, RespawnDelay: 10 * time.Second},
	62: {ID: 62, Name: "DireBoar", SpriteType: 62, HP: 1300, MinDamage: 8, MaxDamage: 64, Defense: 80, DEX: 230, XP: 2450,
		AggroRange: 7, MoveSpeed: 800, AttackSpeed: 800, WanderRange: 8,
		DiceThrow: 8, DiceRange: 8, Size: SizeLarge, Side: SideMonster, RespawnDelay: 10 * time.Second},
	80: {ID: 80, Name: "Tentocle", SpriteType: 80, HP: 800, MinDamage: 7, MaxDamage: 42, Defense: 150, DEX: 180, XP: 2100,
		AggroRange: 5, MoveSpeed: 400, AttackSpeed: 400, WanderRange: 8,
		DiceThrow: 7, DiceRange: 6, Size: SizeLarge, Side: SideMonster, INT: 60, MaxMana: 500, MagicHitRatio: 80, AttackRange: 3, RespawnDelay: 10 * time.Second},
	74: {ID: 74, Name: "Giant-Crayfish", SpriteType: 74, HP: 700, MinDamage: 7, MaxDamage: 49, Defense: 150, DEX: 200, XP: 1400,
		AggroRange: 5, MoveSpeed: 400, AttackSpeed: 400, WanderRange: 8,
		DiceThrow: 7, DiceRange: 7, Size: SizeLarge, Side: SideMonster, AttackRange: 2, RespawnDelay: 10 * time.Second},

	// ================================================================
	// Level 90+
	// ================================================================
	76: {ID: 76, Name: "Giant-Tree", SpriteType: 76, HP: 1000, MinDamage: 8, MaxDamage: 48, Defense: 120, DEX: 200, XP: 2225,
		AggroRange: 5, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 6, Size: SizeLarge, Side: SideMonster, AttackRange: 2, RespawnDelay: 10 * time.Second},
	30: {ID: 30, Name: "Liche", SpriteType: 30, HP: 1300, MinDamage: 8, MaxDamage: 48, Defense: 300, DEX: 230, XP: 3850,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 6, Size: SizeLarge, Side: SideMonster, INT: 60, MaxMana: 1000, MagicHitRatio: 80, AttackRange: 4, RespawnDelay: 10 * time.Second},
	48: {ID: 48, Name: "Stalker", SpriteType: 48, HP: 1300, MinDamage: 8, MaxDamage: 72, Defense: 200, DEX: 300, XP: 3150,
		AggroRange: 7, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 8, DiceRange: 9, Size: SizeLarge, Side: SideMonster, AttackRange: 3, RespawnDelay: 10 * time.Second},
	33: {ID: 33, Name: "WereWolf", SpriteType: 33, HP: 1400, MinDamage: 8, MaxDamage: 64, Defense: 180, DEX: 300, XP: 3045,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 8, Size: SizeLarge, Side: SideMonster, RespawnDelay: 10 * time.Second},
	54: {ID: 54, Name: "Dark-Elf", SpriteType: 54, HP: 1400, MinDamage: 8, MaxDamage: 32, Defense: 200, DEX: 450, XP: 3500,
		AggroRange: 8, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 4, Size: SizeMedium, Side: SideMonster, AttackRange: 8, RespawnDelay: 10 * time.Second},
	63: {ID: 63, Name: "Frost", SpriteType: 63, HP: 1300, MinDamage: 8, MaxDamage: 48, Defense: 300, DEX: 230, XP: 3675,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 6, Size: SizeLarge, Side: SideMonster, INT: 100, MaxMana: 700, MagicHitRatio: 80, AttackRange: 3, RespawnDelay: 10 * time.Second},
	72: {ID: 72, Name: "Claw-Turtle", SpriteType: 72, HP: 1200, MinDamage: 8, MaxDamage: 72, Defense: 200, DEX: 280, XP: 2975,
		AggroRange: 5, MoveSpeed: 500, AttackSpeed: 500, WanderRange: 8,
		DiceThrow: 8, DiceRange: 9, Size: SizeLarge, Side: SideMonster, AttackRange: 2, RespawnDelay: 10 * time.Second},

	// ================================================================
	// Level 140+ (endgame)
	// ================================================================
	59: {ID: 59, Name: "Ettin", SpriteType: 59, HP: 1800, MinDamage: 8, MaxDamage: 72, Defense: 350, DEX: 350, XP: 4500,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 8, DiceRange: 9, Size: SizeLarge, Side: SideMonster, AttackRange: 3, RespawnDelay: 10 * time.Second},
	77: {ID: 77, Name: "MasterMage-Orc", SpriteType: 77, HP: 2500, MinDamage: 8, MaxDamage: 56, Defense: 300, DEX: 300, XP: 6000,
		AggroRange: 5, MoveSpeed: 500, AttackSpeed: 500, WanderRange: 8,
		DiceThrow: 8, DiceRange: 7, Size: SizeLarge, Side: SideMonster, INT: 70, MaxMana: 1500, MagicHitRatio: 80, AttackRange: 3, RespawnDelay: 10 * time.Second},
	79: {ID: 79, Name: "Nizie", SpriteType: 79, HP: 2800, MinDamage: 10, MaxDamage: 100, Defense: 300, DEX: 300, XP: 6000,
		AggroRange: 5, MoveSpeed: 500, AttackSpeed: 500, WanderRange: 8,
		DiceThrow: 10, DiceRange: 10, Size: SizeLarge, Side: SideMonster, INT: 100, MaxMana: 2000, MagicHitRatio: 80, AttackRange: 3, RespawnDelay: 10 * time.Second},
	78: {ID: 78, Name: "Minotaurs", SpriteType: 78, HP: 3400, MinDamage: 13, MaxDamage: 143, Defense: 500, DEX: 500, XP: 10500,
		AggroRange: 5, MoveSpeed: 500, AttackSpeed: 500, WanderRange: 8,
		DiceThrow: 13, DiceRange: 11, Size: SizeLarge, Side: SideMonster, AttackRange: 2, RespawnDelay: 10 * time.Second},
	71: {ID: 71, Name: "Centaurus", SpriteType: 71, HP: 3500, MinDamage: 12, MaxDamage: 132, Defense: 450, DEX: 500, XP: 15000,
		AggroRange: 5, MoveSpeed: 500, AttackSpeed: 500, WanderRange: 8,
		DiceThrow: 12, DiceRange: 11, Size: SizeLarge, Side: SideMonster, INT: 80, MaxMana: 2000, MagicHitRatio: 80, AttackRange: 3, RespawnDelay: 10 * time.Second},
	75: {ID: 75, Name: "Giant-Lizard", SpriteType: 75, HP: 4500, MinDamage: 10, MaxDamage: 100, Defense: 400, DEX: 400, XP: 15000,
		AggroRange: 5, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 10, DiceRange: 10, Size: SizeLarge, Side: SideMonster, INT: 80, MaxMana: 700, MagicHitRatio: 80, AttackRange: 2, RespawnDelay: 10 * time.Second},
	32: {ID: 32, Name: "Unicorn", SpriteType: 32, HP: 5000, MinDamage: 10, MaxDamage: 100, Defense: 450, DEX: 500, XP: 45,
		AggroRange: 7, MoveSpeed: 700, AttackSpeed: 700, WanderRange: 8,
		DiceThrow: 10, DiceRange: 10, Size: SizeLarge, Side: SideMonster, INT: 80, MaxMana: 2000, MagicHitRatio: 250, AttackRange: 4, RespawnDelay: 60 * time.Second},
	31: {ID: 31, Name: "Demon", SpriteType: 31, HP: 3400, MinDamage: 10, MaxDamage: 100, Defense: 450, DEX: 500, XP: 14450,
		AggroRange: 7, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 10, DiceRange: 10, Size: SizeLarge, Side: SideMonster, INT: 70, MaxMana: 2000, MagicHitRatio: 250, AttackRange: 4, RespawnDelay: 60 * time.Second},
	52: {ID: 52, Name: "Gagoyle", SpriteType: 52, HP: 5500, MinDamage: 15, MaxDamage: 150, Defense: 450, DEX: 500, XP: 21000,
		AggroRange: 7, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 15, DiceRange: 10, Size: SizeLarge, Side: SideMonster, INT: 70, MaxMana: 2000, MagicHitRatio: 250, AttackRange: 5, RespawnDelay: 60 * time.Second},

	// ================================================================
	// Boss monsters
	// ================================================================
	49: {ID: 49, Name: "Hellclaw", SpriteType: 49, HP: 12500, MinDamage: 15, MaxDamage: 210, Defense: 450, DEX: 1000, XP: 30000,
		AggroRange: 7, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 15, DiceRange: 14, Size: SizeLarge, Side: SideMonster, INT: 70, AttackRange: 5, RespawnDelay: 60 * time.Second, BossType: 1},
	50: {ID: 50, Name: "Tigerworm", SpriteType: 50, HP: 20000, MinDamage: 18, MaxDamage: 306, Defense: 550, DEX: 1200, XP: 75000,
		AggroRange: 7, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 18, DiceRange: 17, Size: SizeLarge, Side: SideMonster, INT: 90, MaxMana: 16000, MagicHitRatio: 250, AttackRange: 6, RespawnDelay: 60 * time.Second, BossType: 1},
	66: {ID: 66, Name: "Wyvern", SpriteType: 66, HP: 25000, MinDamage: 20, MaxDamage: 360, Defense: 450, DEX: 1000, XP: 45000,
		AggroRange: 8, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 20, DiceRange: 18, Size: SizeLarge, Side: SideMonster, INT: 120, MaxMana: 16000, MagicHitRatio: 250, AttackRange: 7, RespawnDelay: 60 * time.Second, BossType: 1},
	73: {ID: 73, Name: "Fire-Wyvern", SpriteType: 73, HP: 30000, MinDamage: 20, MaxDamage: 360, Defense: 450, DEX: 1000, XP: 225000,
		AggroRange: 8, MoveSpeed: 600, AttackSpeed: 600, WanderRange: 8,
		DiceThrow: 20, DiceRange: 18, Size: SizeLarge, Side: SideMonster, INT: 70, MaxMana: 16000, MagicHitRatio: 250, AttackRange: 7, RespawnDelay: 60 * time.Second, BossType: 1},
	81: {ID: 81, Name: "Abaddon", SpriteType: 81, HP: 150000, MinDamage: 20, MaxDamage: 400, Defense: 999, DEX: 999, XP: 999500,
		AggroRange: 8, MoveSpeed: 500, AttackSpeed: 500, WanderRange: 8,
		DiceThrow: 20, DiceRange: 20, Size: SizeLarge, Side: SideMonster, INT: 130, MaxMana: 20000, MagicHitRatio: 300, AttackRange: 7, RespawnDelay: 60 * time.Second, BossType: 1},

	// ================================================================
	// Town NPCs (stationary, non-aggressive)
	// ================================================================
	15: {ID: 15, Name: "ShopKeeper-W", SpriteType: 15, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	19: {ID: 19, Name: "Gandlf", SpriteType: 19, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	20: {ID: 20, Name: "Howard", SpriteType: 20, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	24: {ID: 24, Name: "Tom", SpriteType: 24, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	25: {ID: 25, Name: "William", SpriteType: 25, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	26: {ID: 26, Name: "Kennedy", SpriteType: 26, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	67: {ID: 67, Name: "McGaffin", SpriteType: 67, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	68: {ID: 68, Name: "Perry", SpriteType: 68, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	69: {ID: 69, Name: "Devlin", SpriteType: 69, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},
	90: {ID: 90, Name: "Gail", SpriteType: 90, HP: 100, Defense: 10, DEX: 20, Side: SideNeutral},

	// ================================================================
	// Guards (faction-based, aggressive to enemies)
	// ================================================================
	21: {ID: 21, Name: "Guard", SpriteType: 21, HP: 1550, MinDamage: 3, MaxDamage: 24, Defense: 150, DEX: 330, XP: 0,
		AggroRange: 8, MoveSpeed: 1000, AttackSpeed: 1000, WanderRange: 3,
		DiceThrow: 3, DiceRange: 8, Size: SizeLarge, Side: SideNeutral, INT: 100, MaxMana: 1000, MagicHitRatio: 130, AttackRange: 5, RespawnDelay: 10 * time.Second},

	// ================================================================
	// Miscellaneous
	// ================================================================
	34: {ID: 34, Name: "Dummy", SpriteType: 34, HP: 100, Defense: 15, DEX: 300, XP: 227, Side: SideNeutral,
		MoveSpeed: 2100, AttackSpeed: 2100, RespawnDelay: 3 * time.Second},
	64: {ID: 64, Name: "Crops", SpriteType: 64, HP: 20000, Defense: 10, DEX: 10, XP: 1, Side: SideNeutral,
		RespawnDelay: 3 * time.Second},
}

// NpcTypeByName returns the first NpcType with the given name, or nil if none found.
// This is useful for faction-variant NPCs that share a SpriteType (e.g. "Guard-Aresden").
func NpcTypeByName(name string) *NpcType {
	for _, t := range NpcTypes {
		if t.Name == name {
			return t
		}
	}
	return nil
}

// IsShopNPC returns true if this NPC type is a shop vendor or town NPC.
func IsShopNPC(npcTypeID int) bool {
	switch npcTypeID {
	case 15, 19, 20, 24, 25, 26, 67, 68, 69, 90: // Town NPCs
		return true
	default:
		return false
	}
}

// SpawnPoint defines where an NPC spawns.
type SpawnPoint struct {
	NpcTypeID int
	MapName   string
	X, Y      int
}

// NPC represents an active NPC/monster in the game world.
type NPC struct {
	ObjectID  int32
	Type      *NpcType
	MapName   string
	X, Y      int
	SpawnX    int // original spawn position
	SpawnY    int
	Direction int
	Action    int // 0=idle, 1=walk, 3=attack
	HP        int
	MaxHP     int
	State     AIState

	// AI state
	TargetID       int32     // object ID of aggro target (player)
	LastMoveTime   time.Time // for movement rate limiting
	LastAttackTime time.Time // for attack rate limiting
	NextThinkTime  time.Time // next AI decision time
	DeathTime      time.Time // when the NPC died (for respawn timer)
	RespawnDelay   time.Duration

	// Flee tracking
	FleeStartX int // X position when flee began (to measure flee distance)
	FleeStartY int // Y position when flee began

	// Path
	PathX, PathY int // next tile to move to (simple 1-step pathfinding)
}

// NewNPC creates a new NPC from a spawn point.
func NewNPC(objectID int32, npcType *NpcType, mapName string, x, y int) *NPC {
	respawnDelay := npcType.RespawnDelay
	if respawnDelay <= 0 {
		respawnDelay = 15 * time.Second // fallback default
	}
	return &NPC{
		ObjectID:     objectID,
		Type:         npcType,
		MapName:      mapName,
		X:            x,
		Y:            y,
		SpawnX:       x,
		SpawnY:       y,
		Direction:    1 + rand.Intn(8), // random initial direction
		HP:           npcType.HP,
		MaxHP:        npcType.HP,
		State:        StateIdle,
		RespawnDelay: respawnDelay,
	}
}

// IsAlive returns true if the NPC has HP > 0.
func (n *NPC) IsAlive() bool {
	return n.State != StateDead && n.HP > 0
}

// TakeDamage reduces HP and returns true if the NPC died.
func (n *NPC) TakeDamage(damage int) bool {
	n.HP -= damage
	if n.HP <= 0 {
		n.HP = 0
		n.State = StateDead
		n.DeathTime = time.Now()
		n.TargetID = 0
		return true
	}
	return false
}

// ShouldFlee returns true if this NPC should enter flee state.
func (n *NPC) ShouldFlee() bool {
	if !n.Type.CanFlee || n.Type.FleeHPPct <= 0 {
		return false
	}
	hpPct := n.HP * 100 / n.MaxHP
	return hpPct < n.Type.FleeHPPct
}

// Respawn resets the NPC to its spawn point with full HP.
func (n *NPC) Respawn() {
	n.HP = n.MaxHP
	n.X = n.SpawnX
	n.Y = n.SpawnY
	n.Direction = 1 + rand.Intn(8)
	n.State = StateIdle
	n.TargetID = 0
	n.Action = 0
}

// ReadyToRespawn returns true if enough time has passed since death.
func (n *NPC) ReadyToRespawn() bool {
	return n.State == StateDead && time.Since(n.DeathTime) >= n.RespawnDelay
}

// ToNpcAppear creates the protobuf message for client rendering.
func (n *NPC) ToNpcAppear() *pb.NpcAppear {
	return &pb.NpcAppear{
		ObjectId:  n.ObjectID,
		Name:      n.Type.Name,
		NpcType:   int32(n.Type.SpriteType),
		Position:  &pb.Vec2{X: int32(n.X), Y: int32(n.Y)},
		Direction: int32(n.Direction),
		Action:    int32(n.Action),
	}
}

// ToEntityInfo creates an EntityInfo for initial world state.
func (n *NPC) ToEntityInfo() *pb.EntityInfo {
	return &pb.EntityInfo{
		ObjectId:   n.ObjectID,
		EntityType: 2, // NPC
		Name:       n.Type.Name,
		Position:   &pb.Vec2{X: int32(n.X), Y: int32(n.Y)},
		Direction:  int32(n.Direction),
		Action:     int32(n.Action),
		NpcType:    int32(n.Type.SpriteType),
		Level:      int32(n.MaxHP / 10), // approximate level indicator
	}
}

// DistanceTo returns Chebyshev distance to a position.
func (n *NPC) DistanceTo(x, y int) int {
	dx := n.X - x
	dy := n.Y - y
	if dx < 0 {
		dx = -dx
	}
	if dy < 0 {
		dy = -dy
	}
	if dx > dy {
		return dx
	}
	return dy
}

// DirectionAwayFrom returns the 8-direction (1-8) moving away from a position.
func (n *NPC) DirectionAwayFrom(tx, ty int) int {
	dx := n.X - tx
	dy := n.Y - ty

	// Clamp to -1, 0, 1
	if dx > 0 {
		dx = 1
	} else if dx < 0 {
		dx = -1
	}
	if dy > 0 {
		dy = 1
	} else if dy < 0 {
		dy = -1
	}

	// If on top of target, pick a random direction
	if dx == 0 && dy == 0 {
		return 1 + rand.Intn(8)
	}

	// Map (dx, dy) to direction 1-8
	switch {
	case dx == 0 && dy == -1:
		return 1
	case dx == 1 && dy == -1:
		return 2
	case dx == 1 && dy == 0:
		return 3
	case dx == 1 && dy == 1:
		return 4
	case dx == 0 && dy == 1:
		return 5
	case dx == -1 && dy == 1:
		return 6
	case dx == -1 && dy == 0:
		return 7
	case dx == -1 && dy == -1:
		return 8
	default:
		return n.Direction
	}
}

// FleeDistance returns Chebyshev distance from where the NPC started fleeing.
func (n *NPC) FleeDistance() int {
	dx := n.X - n.FleeStartX
	dy := n.Y - n.FleeStartY
	if dx < 0 {
		dx = -dx
	}
	if dy < 0 {
		dy = -dy
	}
	if dx > dy {
		return dx
	}
	return dy
}

// DirectionTo returns the 8-direction (1-8) toward a target position.
func (n *NPC) DirectionTo(tx, ty int) int {
	dx := tx - n.X
	dy := ty - n.Y

	// Clamp to -1, 0, 1
	if dx > 0 {
		dx = 1
	} else if dx < 0 {
		dx = -1
	}
	if dy > 0 {
		dy = 1
	} else if dy < 0 {
		dy = -1
	}

	// Map (dx, dy) to direction 1-8
	// 1=N(0,-1), 2=NE(1,-1), 3=E(1,0), 4=SE(1,1), 5=S(0,1), 6=SW(-1,1), 7=W(-1,0), 8=NW(-1,-1)
	switch {
	case dx == 0 && dy == -1:
		return 1
	case dx == 1 && dy == -1:
		return 2
	case dx == 1 && dy == 0:
		return 3
	case dx == 1 && dy == 1:
		return 4
	case dx == 0 && dy == 1:
		return 5
	case dx == -1 && dy == 1:
		return 6
	case dx == -1 && dy == 0:
		return 7
	case dx == -1 && dy == -1:
		return 8
	default:
		return n.Direction // no change if on same tile
	}
}
