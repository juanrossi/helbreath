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
}

// Predefined NPC types
var NpcTypes = map[int]*NpcType{
	// Monsters
	// Movement/attack speeds aligned with original Server.cpp m_dwActionTime
	// Original minimum action time: 600ms. Values here are per-tile move and per-attack intervals.
	1: {ID: 1, Name: "Slime", SpriteType: 1, HP: 30, MinDamage: 2, MaxDamage: 5, Defense: 2, DEX: 8, INT: 3, XP: 15,
		AggroRange: 5, MoveSpeed: 1200, AttackSpeed: 1800, WanderRange: 8,
		DiceThrow: 1, DiceRange: 4, AttackBonus: 1, Size: SizeSmall, Side: SideMonster,
		CanFlee: false, RespawnDelay: 15 * time.Second},

	2: {ID: 2, Name: "Skeleton", SpriteType: 2, HP: 60, MinDamage: 5, MaxDamage: 12, Defense: 5, DEX: 12, INT: 8, XP: 35,
		AggroRange: 7, MoveSpeed: 900, AttackSpeed: 1400, WanderRange: 10,
		DiceThrow: 2, DiceRange: 4, AttackBonus: 3, Size: SizeMedium, Side: SideMonster,
		CanFlee: false, RespawnDelay: 20 * time.Second},

	3: {ID: 3, Name: "Orc", SpriteType: 3, HP: 100, MinDamage: 8, MaxDamage: 20, Defense: 10, DEX: 10, INT: 6, XP: 60,
		AggroRange: 8, MoveSpeed: 800, AttackSpeed: 1200, WanderRange: 12,
		DiceThrow: 2, DiceRange: 6, AttackBonus: 6, Size: SizeLarge, Side: SideMonster,
		CanFlee: true, FleeHPPct: 15, RespawnDelay: 25 * time.Second},

	4: {ID: 4, Name: "Demon", SpriteType: 4, HP: 200, MinDamage: 15, MaxDamage: 35, Defense: 20, DEX: 14, INT: 18, XP: 120,
		AggroRange: 10, MoveSpeed: 700, AttackSpeed: 1000, WanderRange: 15,
		DiceThrow: 3, DiceRange: 7, AttackBonus: 12, Size: SizeLarge, Side: SideMonster,
		CanFlee: false, RespawnDelay: 30 * time.Second},

	// Shop NPCs (non-aggressive, stationary: AggroRange=0, WanderRange=0, MoveSpeed=0)
	10: {ID: 10, Name: "Weapon Smith", SpriteType: 10, HP: 9999, MinDamage: 0, MaxDamage: 0, Defense: 100, DEX: 0, XP: 0,
		AggroRange: 0, MoveSpeed: 0, AttackSpeed: 0, WanderRange: 0,
		Size: SizeMedium, Side: SideNeutral},

	11: {ID: 11, Name: "Armorer", SpriteType: 11, HP: 9999, MinDamage: 0, MaxDamage: 0, Defense: 100, DEX: 0, XP: 0,
		AggroRange: 0, MoveSpeed: 0, AttackSpeed: 0, WanderRange: 0,
		Size: SizeMedium, Side: SideNeutral},

	12: {ID: 12, Name: "Potion Merchant", SpriteType: 12, HP: 9999, MinDamage: 0, MaxDamage: 0, Defense: 100, DEX: 0, XP: 0,
		AggroRange: 0, MoveSpeed: 0, AttackSpeed: 0, WanderRange: 0,
		Size: SizeMedium, Side: SideNeutral},

	// Named town NPCs (stationary, non-aggressive)
	// CityHall
	15: {ID: 15, Name: "William", SpriteType: 15, HP: 9999, Defense: 100, Side: SideNeutral},   // Cityhall clerk (Aresden)
	16: {ID: 16, Name: "Kennedy", SpriteType: 16, HP: 9999, Defense: 100, Side: SideNeutral},   // Cityhall clerk (Elvine)
	// Warehouse
	20: {ID: 20, Name: "Howard", SpriteType: 20, HP: 9999, Defense: 100, Side: SideNeutral},    // Warehouse keeper
	// Blacksmith
	21: {ID: 21, Name: "Tom", SpriteType: 21, HP: 9999, Defense: 100, Side: SideNeutral},       // Blacksmith NPC
	// General shop
	22: {ID: 22, Name: "Perry", SpriteType: 22, HP: 9999, Defense: 100, Side: SideNeutral},     // General shop keeper
	// Wizard tower
	19: {ID: 19, Name: "Gandlf", SpriteType: 19, HP: 9999, Defense: 100, Side: SideNeutral},    // Magic teacher
	// Cathedral
	23: {ID: 23, Name: "Gail", SpriteType: 23, HP: 9999, Defense: 100, Side: SideNeutral},      // Cathedral priest

	// Guards (stationary, faction-based)
	14: {ID: 14, Name: "Guard", SpriteType: 14, HP: 5000, MinDamage: 30, MaxDamage: 60, Defense: 50, DEX: 20, XP: 0,
		AggroRange: 10, MoveSpeed: 400, AttackSpeed: 800, WanderRange: 3,
		DiceThrow: 3, DiceRange: 10, AttackBonus: 20, Size: SizeMedium, Side: SideNeutral},
}

// IsShopNPC returns true if this NPC type is a shop vendor or town NPC.
func IsShopNPC(npcTypeID int) bool {
	return npcTypeID >= 10 && npcTypeID <= 23
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
