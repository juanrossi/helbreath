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
)

// NpcType defines a type of NPC/monster with base stats.
type NpcType struct {
	ID          int
	Name        string
	SpriteType  int // sprite type ID for client rendering
	HP          int
	MinDamage   int
	MaxDamage   int
	Defense     int
	DEX         int // affects hit/dodge
	XP          int // experience reward
	AggroRange  int // tiles to detect players
	MoveSpeed   int // ms per tile movement
	AttackSpeed int // ms between attacks
	WanderRange int // max tiles from spawn to wander
}

// Predefined NPC types for MVP
var NpcTypes = map[int]*NpcType{
	// Monsters
	1: {ID: 1, Name: "Slime", SpriteType: 1, HP: 30, MinDamage: 2, MaxDamage: 5, Defense: 2, DEX: 8, XP: 15, AggroRange: 5, MoveSpeed: 800, AttackSpeed: 1500, WanderRange: 8},
	2: {ID: 2, Name: "Skeleton", SpriteType: 2, HP: 60, MinDamage: 5, MaxDamage: 12, Defense: 5, DEX: 12, XP: 35, AggroRange: 7, MoveSpeed: 600, AttackSpeed: 1200, WanderRange: 10},
	3: {ID: 3, Name: "Orc", SpriteType: 3, HP: 100, MinDamage: 8, MaxDamage: 20, Defense: 10, DEX: 10, XP: 60, AggroRange: 8, MoveSpeed: 500, AttackSpeed: 1000, WanderRange: 12},
	4: {ID: 4, Name: "Demon", SpriteType: 4, HP: 200, MinDamage: 15, MaxDamage: 35, Defense: 20, DEX: 14, XP: 120, AggroRange: 10, MoveSpeed: 450, AttackSpeed: 900, WanderRange: 15},
	// Shop NPCs (non-aggressive: AggroRange=0, WanderRange=0)
	10: {ID: 10, Name: "Weapon Smith", SpriteType: 10, HP: 9999, MinDamage: 0, MaxDamage: 0, Defense: 100, DEX: 0, XP: 0, AggroRange: 0, MoveSpeed: 0, AttackSpeed: 0, WanderRange: 0},
	11: {ID: 11, Name: "Armorer", SpriteType: 11, HP: 9999, MinDamage: 0, MaxDamage: 0, Defense: 100, DEX: 0, XP: 0, AggroRange: 0, MoveSpeed: 0, AttackSpeed: 0, WanderRange: 0},
	12: {ID: 12, Name: "Potion Merchant", SpriteType: 12, HP: 9999, MinDamage: 0, MaxDamage: 0, Defense: 100, DEX: 0, XP: 0, AggroRange: 0, MoveSpeed: 0, AttackSpeed: 0, WanderRange: 0},
}

// IsShopNPC returns true if this NPC type is a shop vendor.
func IsShopNPC(npcTypeID int) bool {
	return npcTypeID >= 10 && npcTypeID <= 12
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

	// Path
	PathX, PathY int // next tile to move to (simple 1-step pathfinding)
}

// NewNPC creates a new NPC from a spawn point.
func NewNPC(objectID int32, npcType *NpcType, mapName string, x, y int) *NPC {
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
		RespawnDelay: 15 * time.Second,
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
