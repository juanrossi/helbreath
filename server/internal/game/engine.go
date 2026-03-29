package game

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"math/rand"

	"github.com/juanrossi/hbonline/server/internal/auth"
	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/guild"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/party"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/trade"
	"github.com/juanrossi/hbonline/server/internal/world"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/protobuf/proto"
)

// Direction deltas: index by direction (1=N through 8=NW)
var dirDX = [9]int{0, 0, 1, 1, 1, 0, -1, -1, -1}
var dirDY = [9]int{0, -1, -1, 0, 1, 1, 1, 0, -1}

var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9]{3,20}$`)
var charNameRegex = regexp.MustCompile(`^[a-zA-Z0-9]{3,10}$`)

type Engine struct {
	store      db.DataStore
	jwtManager *auth.JWTManager
	maps       map[string]*mapdata.GameMap
	players   sync.Map // map[int32]*player.Player (by object ID)
	npcs      sync.Map // map[int32]*npc.NPC (by object ID)
	nextObjID atomic.Int32
	mu        sync.RWMutex

	// Ground items
	groundItems   sync.Map // map[int32]*items.GroundItem
	nextGroundID  atomic.Int32

	// Regen timers
	lastRegenHP     time.Time
	lastRegenMP     time.Time
	lastRegenSP     time.Time
	lastBuffCheck   time.Time
	lastEffectCheck time.Time

	// Social systems
	guilds  *guild.GuildRegistry
	parties *party.PartyManager
	trades  *trade.TradeManager

	// World state
	worldState    *world.WorldState
	events        *world.EventState
	lastWorldSync time.Time
	lastWeatherCheck time.Time

	// Current world phase and weather cached for combat checks
	CurrentWorldPhase int // world.DayPhase, DuskPhase, NightPhase, DawnPhase
	CurrentWeather    int // world.WeatherClear, WeatherRain, WeatherSnow, WeatherFog

	// PK decay timer
	lastPKDecayCheck time.Time

	// Teleport config
	teleports mapdata.TeleportConfig

	// Graceful shutdown channel
	shutdownChan chan struct{}
}

func NewEngine(store db.DataStore, jwtManager *auth.JWTManager) *Engine {
	now := time.Now()
	e := &Engine{
		store:       store,
		jwtManager:  jwtManager,
		maps:        make(map[string]*mapdata.GameMap),
		lastRegenHP:   now,
		lastRegenMP:   now,
		lastRegenSP:   now,
		lastBuffCheck:   now,
		lastEffectCheck: now,
		guilds:           guild.NewGuildRegistry(),
		parties:          party.NewPartyManager(),
		trades:           trade.NewTradeManager(),
		worldState:       world.NewWorldState(),
		events:           world.NewEventState(),
		lastWorldSync:    now,
		lastWeatherCheck: now,
		lastPKDecayCheck: now,
		teleports:        mapdata.BuildTeleportConfig(),
		shutdownChan:     make(chan struct{}),
	}
	e.nextObjID.Store(1000) // start IDs above reserved range
	return e
}

// ShutdownChan returns a channel that is closed when the admin /shutdown command completes.
func (e *Engine) ShutdownChan() <-chan struct{} {
	return e.shutdownChan
}

func (e *Engine) LoadMaps(dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read map dir: %w", err)
	}

	for _, entry := range entries {
		if strings.ToLower(filepath.Ext(entry.Name())) != ".amd" {
			continue
		}
		path := filepath.Join(dir, entry.Name())
		gm, err := mapdata.LoadAMD(path)
		if err != nil {
			log.Printf("Warning: failed to load map %s: %v", entry.Name(), err)
			continue
		}
		e.maps[gm.Name] = gm
		log.Printf("Loaded map: %s (%dx%d)", gm.Name, gm.Width, gm.Height)
	}

	log.Printf("Loaded %d maps", len(e.maps))
	return nil
}

func (e *Engine) Run(ctx context.Context) {
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			e.processTick()
		}
	}
}

func (e *Engine) processTick() {
	now := time.Now()

	// HP regen every 15 seconds
	if now.Sub(e.lastRegenHP) >= 15*time.Second {
		e.lastRegenHP = now
		e.regenAllPlayers("hp")
	}
	// MP regen every 20 seconds
	if now.Sub(e.lastRegenMP) >= 20*time.Second {
		e.lastRegenMP = now
		e.regenAllPlayers("mp")
	}
	// SP regen every 10 seconds
	if now.Sub(e.lastRegenSP) >= 10*time.Second {
		e.lastRegenSP = now
		e.regenAllPlayers("sp")
	}

	// Buff expiry check every second
	if now.Sub(e.lastBuffCheck) >= 1*time.Second {
		e.lastBuffCheck = now
		e.checkBuffExpiry()
	}

	// Effect tick processing every second
	if now.Sub(e.lastEffectCheck) >= 1*time.Second {
		e.lastEffectCheck = now
		e.processEffectTicks(now)
	}

	// World state sync every 30 seconds
	if now.Sub(e.lastWorldSync) >= 30*time.Second {
		e.lastWorldSync = now
		e.broadcastWorldState()
	}

	// Weather check every 60 seconds
	if now.Sub(e.lastWeatherCheck) >= 60*time.Second {
		e.lastWeatherCheck = now
		if e.worldState.RandomWeather() {
			e.broadcastWorldState()
		}
	}

	// Update cached world phase and weather for combat checks
	e.CurrentWorldPhase = e.worldState.GetTimeOfDay()
	e.CurrentWeather = e.worldState.GetWeather()

	// PK decay: every 60 seconds, check each player for 10-minute online decay
	if now.Sub(e.lastPKDecayCheck) >= 60*time.Second {
		e.lastPKDecayCheck = now
		e.processPKDecay(now)
	}

	// Process pending logouts
	e.processLogouts(now)

	// NPC AI tick
	e.npcs.Range(func(key, value any) bool {
		n := value.(*npc.NPC)
		e.processNPCTick(n, now)
		return true
	})
}

func (e *Engine) regenAllPlayers(stat string) {
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		changed := false
		switch stat {
		case "hp":
			if p.HP < p.MaxHP && p.HP > 0 {
				regen := 1 + p.VIT/10
				p.HP += regen
				if p.HP > p.MaxHP {
					p.HP = p.MaxHP
				}
				changed = true
			}
		case "mp":
			if p.MP < p.MaxMP {
				regen := 1 + p.MAG/10
				p.MP += regen
				if p.MP > p.MaxMP {
					p.MP = p.MaxMP
				}
				changed = true
			}
		case "sp":
			if p.SP < p.MaxSP {
				p.SP += 2
				if p.SP > p.MaxSP {
					p.SP = p.MaxSP
				}
				changed = true
			}
		}
		if changed {
			e.sendStatUpdate(p)
		}
		return true
	})
}

// processPKDecay reduces PKCount by 1 for each player who has been online
// for at least 10 minutes since their last PK decay. This encourages good behavior.
func (e *Engine) processPKDecay(now time.Time) {
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if p.PKCount > 0 && now.Sub(p.LastPKDecayTime) >= 10*time.Minute {
			p.PKCount--
			p.LastPKDecayTime = now
			e.sendPKStatus(p)
			e.sendStatUpdate(p)
		}
		return true
	})
}

// SpawnNPCs creates initial NPCs across all loaded maps.
// It attempts to load spawn configuration from a JSON file; if none exists,
// falls back to the hardcoded default configuration.
func (e *Engine) SpawnNPCs() {
	e.SpawnNPCsWithConfigPath("data/spawns.json")
}

// SpawnNPCsWithConfigPath loads spawn config from the given path (or defaults)
// and creates all initial NPCs.
func (e *Engine) SpawnNPCsWithConfigPath(configPath string) {
	cfg, err := LoadSpawnConfig(configPath)
	if err != nil {
		log.Printf("Warning: failed to load spawn config from %s: %v (using defaults)", configPath, err)
		cfg = nil
	}
	if cfg == nil {
		cfg = DefaultSpawnConfig()
		log.Printf("Using default spawn configuration (%d entries)", len(cfg.Spawns))
	} else {
		log.Printf("Loaded spawn configuration from %s (%d entries)", configPath, len(cfg.Spawns))
	}

	for i := range cfg.Spawns {
		entry := &cfg.Spawns[i]
		count := entry.Count
		if count <= 0 {
			count = 1
		}

		npcType, ok := npc.NpcTypes[entry.NpcTypeID]
		if !ok {
			log.Printf("Warning: unknown NPC type %d in spawn config, skipping", entry.NpcTypeID)
			continue
		}

		gm, ok := e.maps[entry.MapName]
		if !ok {
			continue // skip spawns for maps not loaded
		}

		for j := 0; j < count; j++ {
			// Calculate spawn position with optional radius offset
			x, y := entry.SpawnX, entry.SpawnY
			if entry.SpawnRadius > 0 {
				x += rand.Intn(entry.SpawnRadius*2+1) - entry.SpawnRadius
				y += rand.Intn(entry.SpawnRadius*2+1) - entry.SpawnRadius
			}

			if !gm.IsWalkable(x, y) {
				x, y = e.findWalkable(gm, x, y)
			}

			objectID := e.nextObjID.Add(1)
			n := npc.NewNPC(objectID, npcType, entry.MapName, x, y)

			// Apply respawn delay override from spawn config
			overrideDelay := entry.RespawnDelayDuration()
			if overrideDelay > 0 {
				n.RespawnDelay = overrideDelay
			}

			e.npcs.Store(objectID, n)
			log.Printf("Spawned NPC %s (ID: %d) at %s (%d,%d)", npcType.Name, objectID, entry.MapName, x, y)
		}
	}
}

// giveStartingItems equips a new character with basic starter gear.
func (e *Engine) giveStartingItems(p *player.Player) {
	// Starting equipment using original Helbreath item IDs (from Item.cfg):
	// Dagger(1), Shirt(453M/471W), Trousers(459M)/Skirt(479W),
	// Helm(600), Cape(402), Shoes(450), RedPotion(91) x5
	isMale := p.Gender == 1
	bodyID := 471 // Shirt(W)
	legsID := 479 // Skirt(W)
	if isMale {
		bodyID = 453 // Shirt(M)
		legsID = 459 // Trousers(M)
	}
	starterGear := []struct {
		itemID int
		equip  bool
	}{
		{1, true},       // Dagger -> equip weapon
		{bodyID, true},  // Shirt -> equip body
		{legsID, true},  // Trousers/Skirt -> equip legs
		{600, true},     // Helm -> equip helm
		{402, true},     // Cape -> equip cape
		{450, true},     // Shoes -> equip boots
		{91, false},     // 5x RedPotion (HP) -> inventory
	}

	for _, sg := range starterGear {
		def := items.GetItemDef(sg.itemID)
		if def == nil {
			continue
		}
		count := 1
		if sg.itemID == 91 {
			count = 5
		}
		item := items.NewItem(def, count)
		if sg.equip && def.EquipSlot != items.EquipNone {
			p.Inventory.Equipment[def.EquipSlot] = item
		} else {
			p.Inventory.AddItem(item)
		}
	}

	// Update appearance and combat stats to reflect equipped gear
	p.SyncEquipmentAppearance()
	p.RecalcCombatStats()
	log.Printf("Gave starting items to new character %s", p.Name)
}

func (e *Engine) processNPCTick(n *npc.NPC, now time.Time) {
	gm, ok := e.maps[n.MapName]
	if !ok {
		return
	}

	// Handle respawn
	if n.State == npc.StateDead {
		if n.ReadyToRespawn() {
			n.Respawn()
			if gm.IsWalkable(n.X, n.Y) {
				gm.SetOwner(n.X, n.Y, n.ObjectID)
			}
			// Broadcast NPC appear to nearby players
			appear := n.ToNpcAppear()
			e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgNpcAppear, appear)
			log.Printf("NPC %s respawned at (%d,%d)", n.Type.Name, n.X, n.Y)
		}
		return
	}

	// Throttle AI decisions
	if now.Before(n.NextThinkTime) {
		return
	}
	n.NextThinkTime = now.Add(200 * time.Millisecond)

	// Find nearest player in aggro range
	nearestPlayer, nearestDist := e.findNearestPlayer(n, gm)

	// Calculate effective aggro range (fog reduces it by 30%)
	aggroRange := n.Type.AggroRange
	if e.CurrentWeather == world.WeatherFog {
		aggroRange = aggroRange * 7 / 10
		if aggroRange < 1 && n.Type.AggroRange > 0 {
			aggroRange = 1
		}
	}

	switch n.State {
	case npc.StateIdle:
		if nearestPlayer != nil && nearestDist <= aggroRange {
			n.TargetID = nearestPlayer.ObjectID
			n.State = npc.StateChase
		} else if rand.Intn(5) == 0 {
			// Random wander
			n.State = npc.StateWander
		}

	case npc.StateWander:
		if nearestPlayer != nil && nearestDist <= aggroRange {
			n.TargetID = nearestPlayer.ObjectID
			n.State = npc.StateChase
			return
		}

		if now.Sub(n.LastMoveTime) < time.Duration(n.Type.MoveSpeed)*time.Millisecond {
			return
		}

		// Random direction
		dir := 1 + rand.Intn(8)
		newX := n.X + dirDX[dir]
		newY := n.Y + dirDY[dir]

		// Stay within wander range of spawn
		dx := newX - n.SpawnX
		dy := newY - n.SpawnY
		if dx < 0 {
			dx = -dx
		}
		if dy < 0 {
			dy = -dy
		}
		if dx > n.Type.WanderRange || dy > n.Type.WanderRange {
			n.State = npc.StateIdle
			return
		}

		if gm.IsWalkable(newX, newY) {
			e.moveNPC(n, gm, newX, newY, dir)
		}
		n.LastMoveTime = now

		// Go back to idle randomly
		if rand.Intn(3) == 0 {
			n.State = npc.StateIdle
		}

	case npc.StateChase:
		// Check if NPC should flee instead of continuing chase
		if n.ShouldFlee() {
			n.State = npc.StateFlee
			n.FleeStartX = n.X
			n.FleeStartY = n.Y
			return
		}

		target := e.getPlayerByID(n.TargetID)
		if target == nil || target.HP <= 0 || target.MapName != n.MapName {
			n.TargetID = 0
			n.State = npc.StateIdle
			return
		}

		dist := n.DistanceTo(target.X, target.Y)

		// Give up if too far from spawn
		spawnDist := n.DistanceTo(n.SpawnX, n.SpawnY)
		if spawnDist > n.Type.WanderRange*2 {
			n.TargetID = 0
			n.State = npc.StateIdle
			return
		}

		if dist <= 1 {
			// Adjacent - attack
			n.State = npc.StateAttack
			return
		}

		// Move toward target
		if now.Sub(n.LastMoveTime) < time.Duration(n.Type.MoveSpeed)*time.Millisecond {
			return
		}

		dir := n.DirectionTo(target.X, target.Y)
		newX := n.X + dirDX[dir]
		newY := n.Y + dirDY[dir]

		if gm.IsWalkable(newX, newY) {
			e.moveNPC(n, gm, newX, newY, dir)
		}
		n.LastMoveTime = now

	case npc.StateAttack:
		// Check if NPC should flee instead of continuing attack
		if n.ShouldFlee() {
			n.State = npc.StateFlee
			n.FleeStartX = n.X
			n.FleeStartY = n.Y
			return
		}

		target := e.getPlayerByID(n.TargetID)
		if target == nil || target.HP <= 0 || target.MapName != n.MapName {
			n.TargetID = 0
			n.State = npc.StateIdle
			return
		}

		dist := n.DistanceTo(target.X, target.Y)
		if dist > 1 {
			n.State = npc.StateChase
			return
		}

		// Attack rate limiting
		if now.Sub(n.LastAttackTime) < time.Duration(n.Type.AttackSpeed)*time.Millisecond {
			return
		}
		n.LastAttackTime = now

		// Face the target
		n.Direction = n.DirectionTo(target.X, target.Y)

		// Ensure target player knows about this NPC (send NpcAppear)
		appear := n.ToNpcAppear()
		appearData, _ := network.Encode(network.MsgNpcAppear, appear)
		target.Send(appearData)

		// Calculate damage
		result := NPCAttackPlayer(n, target)

		// Broadcast attack motion
		attackMotion := &pb.MotionEvent{
			ObjectId:  n.ObjectID,
			OwnerType: 2,
			Action:    3, // attack
			Direction: int32(n.Direction),
			Position:  &pb.Vec2{X: int32(n.X), Y: int32(n.Y)},
			Name:      n.Type.Name,
		}
		e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgMotionEvent, attackMotion)

		// Send damage event
		dmgEvent := &pb.DamageEvent{
			AttackerId:  n.ObjectID,
			TargetId:    target.ObjectID,
			TargetType:  1, // player
			Damage:      int32(result.Damage),
			Critical:    result.Critical,
			Miss:        result.Miss,
			TargetHp:    int32(target.HP),
			TargetMaxHp: int32(target.MaxHP),
		}
		e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgDamageEvent, dmgEvent)

		// Update player stats
		e.sendStatUpdate(target)

		// Cancel logout if the player was hit
		if !result.Miss {
			e.cancelLogoutOnDamage(target)
		}

		// Handle player death
		if result.Killed {
			e.handlePlayerDeath(target, n.ObjectID, n.Type.Name)
		}

	case npc.StateFlee:
		target := e.getPlayerByID(n.TargetID)

		// Stop fleeing if: fled 5+ tiles, or target gone/out of aggro range
		targetGone := target == nil || target.HP <= 0 || target.MapName != n.MapName
		fleeDistReached := n.FleeDistance() >= 5
		outOfSight := !targetGone && n.DistanceTo(target.X, target.Y) > n.Type.AggroRange

		if targetGone || fleeDistReached || outOfSight {
			n.TargetID = 0
			n.State = npc.StateWander
			return
		}

		// Move away from target
		if now.Sub(n.LastMoveTime) < time.Duration(n.Type.MoveSpeed)*time.Millisecond {
			return
		}

		dir := n.DirectionAwayFrom(target.X, target.Y)
		newX := n.X + dirDX[dir]
		newY := n.Y + dirDY[dir]

		if gm.IsWalkable(newX, newY) {
			e.moveNPC(n, gm, newX, newY, dir)
		} else {
			// If blocked, try a random adjacent direction
			altDir := 1 + rand.Intn(8)
			altX := n.X + dirDX[altDir]
			altY := n.Y + dirDY[altDir]
			if gm.IsWalkable(altX, altY) {
				e.moveNPC(n, gm, altX, altY, altDir)
			}
		}
		n.LastMoveTime = now
	}
}

func (e *Engine) moveNPC(n *npc.NPC, gm *mapdata.GameMap, newX, newY, dir int) {
	gm.ClearOwner(n.X, n.Y)
	n.X = newX
	n.Y = newY
	n.Direction = dir
	n.Action = 1
	gm.SetOwner(n.X, n.Y, n.ObjectID)

	// Broadcast NPC movement
	motionEvent := &pb.NpcMotion{
		ObjectId:  n.ObjectID,
		Action:    1,
		Direction: int32(dir),
		Position:  &pb.Vec2{X: int32(n.X), Y: int32(n.Y)},
		Speed:     int32(n.Type.MoveSpeed),
		Name:      n.Type.Name,
		NpcType:   int32(n.Type.SpriteType),
	}
	e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgNpcMotion, motionEvent)
}

func (e *Engine) findNearestPlayer(n *npc.NPC, gm *mapdata.GameMap) (*player.Player, int) {
	nearbyIDs := gm.GetNearbyPlayerIDs(n.X, n.Y)
	var nearest *player.Player
	nearestDist := 999

	for _, id := range nearbyIDs {
		val, ok := e.players.Load(id)
		if !ok {
			continue
		}
		p := val.(*player.Player)
		if p.HP <= 0 || p.MapName != n.MapName {
			continue
		}

		// Admin immunity: skip players with AdminLevel > 0
		if p.AdminLevel > 0 {
			continue
		}

		// Invisibility: skip invisible players
		if p.Effects != nil && p.Effects.HasEffect(magic.EffectInvisibility) {
			continue
		}

		// Faction-aware targeting
		if !e.npcCanTarget(n, p) {
			continue
		}

		dist := n.DistanceTo(p.X, p.Y)
		if dist < nearestDist {
			nearestDist = dist
			nearest = p
		}
	}
	return nearest, nearestDist
}

// npcCanTarget returns true if the NPC should be hostile toward the player
// based on faction rules.
func (e *Engine) npcCanTarget(n *npc.NPC, p *player.Player) bool {
	// Monsters (Side=10) attack everyone
	if n.Type.Side == npc.SideMonster {
		return true
	}

	// Non-aggressive NPCs (shop NPCs, neutrals with no aggro)
	if n.Type.AggroRange <= 0 {
		return false
	}

	// For faction NPCs (Aresden/Elvine/Special guards):
	// Attack players of different side, or criminals (PKCount >= 3)
	if n.Type.Side != p.Side || p.PKCount >= 3 {
		return true
	}

	return false
}

func (e *Engine) getPlayerByID(objectID int32) *player.Player {
	val, ok := e.players.Load(objectID)
	if !ok {
		return nil
	}
	return val.(*player.Player)
}

func (e *Engine) sendStatUpdate(p *player.Player) {
	update := &pb.StatUpdate{
		Hp:         int32(p.HP),
		MaxHp:      int32(p.MaxHP),
		Mp:         int32(p.MP),
		MaxMp:      int32(p.MaxMP),
		Sp:         int32(p.SP),
		MaxSp:      int32(p.MaxSP),
		Experience: p.Experience,
		Level:      int32(p.Level),
		LuPool:     int32(p.LUPool),
		Str:        int32(p.STR),
		Vit:        int32(p.VIT),
		Dex:        int32(p.DEX),
		IntStat:    int32(p.INT),
		Mag:        int32(p.MAG),
		Charisma:   int32(p.CHR),
		Gold:       p.Gold,
	}
	data, _ := network.Encode(network.MsgStatUpdate, update)
	p.Send(data)
}

func (e *Engine) handlePlayerDeath(p *player.Player, killerID int32, killerName string) {
	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	// Broadcast death event
	deathEvt := &pb.DeathEvent{
		ObjectId:   p.ObjectID,
		ObjectType: 1, // player
		KillerId:   killerID,
		KillerName: killerName,
		Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
	}
	e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgDeathEvent, deathEvt)

	// XP penalty based on PK tier (matches original Helbreath death penalties)
	var xpPenaltyPct int64
	switch {
	case p.PKCount >= 12: // slaughterer
		xpPenaltyPct = 20
	case p.PKCount >= 4: // murderer
		xpPenaltyPct = 10
	case p.PKCount >= 1: // criminal
		xpPenaltyPct = 5
	default: // innocent
		xpPenaltyPct = 2
	}

	// Skip XP loss on safe zone and arena maps
	if gm.Type == mapdata.MapTypeNormal {
		xpLoss := XPForLevel(p.Level) * xpPenaltyPct / 100
		p.Experience -= xpLoss
		if p.Experience < 0 {
			p.Experience = 0
		}
	}

	// Clear all magic effects and buffs on death
	if p.Effects != nil {
		p.Effects.ClearAll()
	}
	if p.Buffs != nil {
		p.Buffs.ClearAll()
	}

	// Reset derived stats after clearing buffs
	p.RecalcCombatStats()

	// Respawn after 3 seconds
	go func() {
		time.Sleep(3 * time.Second)
		e.respawnPlayer(p)
	}()
}

func (e *Engine) respawnPlayer(p *player.Player) {
	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	// Clear old position
	gm.ClearOwner(p.X, p.Y)
	gm.RemovePlayerFromSector(p.X, p.Y, p.ObjectID)

	// Respawn at map spawn point (near center or saved spawn)
	spawnX, spawnY := gm.Width/2, gm.Height/2
	if !gm.IsWalkable(spawnX, spawnY) {
		spawnX, spawnY = e.findWalkable(gm, spawnX, spawnY)
	}

	p.X = spawnX
	p.Y = spawnY
	p.HP = p.MaxHP / 2
	p.MP = p.MaxMP / 2
	p.SP = p.MaxSP

	gm.SetOwner(p.X, p.Y, p.ObjectID)
	gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	// Send respawn event to player
	respawnEvt := &pb.RespawnEvent{
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Direction: int32(p.Direction),
		MapName:   p.MapName,
		Hp:        int32(p.HP),
		Mp:        int32(p.MP),
		Sp:        int32(p.SP),
	}
	data, _ := network.Encode(network.MsgRespawnEvent, respawnEvt)
	p.Send(data)

	// Broadcast player appear at new location
	appear := p.ToPlayerAppear()
	e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgPlayerAppear, appear)

	// Send stat update
	e.sendStatUpdate(p)
}

// OnConnect implements network.MessageHandler.
func (e *Engine) OnConnect(client *network.Client) {
	log.Println("Client connected")
}

// OnDisconnect implements network.MessageHandler.
func (e *Engine) OnDisconnect(client *network.Client) {
	if client.ObjectID == 0 {
		return
	}

	if val, ok := e.players.Load(client.ObjectID); ok {
		p := val.(*player.Player)
		log.Printf("Player %s disconnected", p.Name)

		// Save all player state including inventory
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := savePlayerToDB(e.store, ctx, p); err != nil {
			log.Printf("Failed to save player %s on disconnect: %v", p.Name, err)
		}

		// Remove from map
		if gm, ok := e.maps[p.MapName]; ok {
			gm.ClearOwner(p.X, p.Y)
			gm.RemovePlayerFromSector(p.X, p.Y, p.ObjectID)

			// Notify nearby players
			disappear := &pb.PlayerDisappear{ObjectId: p.ObjectID}
			e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgPlayerDisappear, disappear)
		}

		e.players.Delete(client.ObjectID)
	}
}

// LogoutCountdownSeconds is how long a player must wait before logging out.
const LogoutCountdownSeconds = 10

func (e *Engine) handleLogout(client *network.Client, req *pb.LogoutRequest) {
	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return
	}
	p := val.(*player.Player)

	if req.Cancel {
		if p.CancelLogout() {
			resp := &pb.LogoutResponse{SecondsRemaining: 0, Cancelled: true, Reason: "Cancelled"}
			data, _ := network.Encode(network.MsgLogoutResponse, resp)
			p.Send(data)
		}
		return
	}

	// Start logout countdown
	p.LogoutPending = true
	p.LogoutTime = time.Now().Add(time.Duration(LogoutCountdownSeconds) * time.Second)

	resp := &pb.LogoutResponse{SecondsRemaining: int32(LogoutCountdownSeconds)}
	data, _ := network.Encode(network.MsgLogoutResponse, resp)
	p.Send(data)
}

// processLogouts checks all players for completed logout countdowns and disconnects them.
func (e *Engine) processLogouts(now time.Time) {
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if !p.LogoutPending {
			return true
		}
		if now.Before(p.LogoutTime) {
			return true
		}
		// Countdown finished — disconnect the player
		p.LogoutPending = false
		log.Printf("Player %s logged out via countdown", p.Name)
		resp := &pb.LogoutResponse{SecondsRemaining: 0}
		data, _ := network.Encode(network.MsgLogoutResponse, resp)
		p.Send(data)
		// Close the connection, which triggers OnDisconnect for cleanup
		if p.Client != nil {
			p.Client.Close()
		}
		return true
	})
}

// cancelLogoutOnDamage cancels a player's pending logout when they take damage.
func (e *Engine) cancelLogoutOnDamage(p *player.Player) {
	if p.CancelLogout() {
		resp := &pb.LogoutResponse{SecondsRemaining: 0, Cancelled: true, Reason: "You were attacked!"}
		data, _ := network.Encode(network.MsgLogoutResponse, resp)
		p.Send(data)
	}
}

// OnMessage implements network.MessageHandler.
func (e *Engine) OnMessage(client *network.Client, msgType byte, rawData []byte) {
	_, msg, err := network.Decode(rawData)
	if err != nil {
		log.Printf("Decode error: %v", err)
		return
	}

	// Login is always allowed; everything else requires authentication
	if msgType != network.MsgLoginRequest && !client.Authenticated {
		log.Printf("Unauthenticated client attempted message type 0x%02x, ignoring", msgType)
		return
	}

	switch msgType {
	case network.MsgLoginRequest:
		e.handleLogin(client, msg.(*pb.LoginRequest))
	case network.MsgCreateCharacterRequest:
		e.handleCreateCharacter(client, msg.(*pb.CreateCharacterRequest))
	case network.MsgDeleteCharacterRequest:
		e.handleDeleteCharacter(client, msg.(*pb.DeleteCharacterRequest))
	case network.MsgEnterGameRequest:
		e.handleEnterGame(client, msg.(*pb.EnterGameRequest))
	case network.MsgMotionRequest:
		e.handleMotion(client, msg.(*pb.MotionRequest))
	case network.MsgChatRequest:
		e.handleChat(client, msg.(*pb.ChatRequest))
	case network.MsgAttackRequest:
		e.handleAttack(client, msg.(*pb.MotionRequest))
	case network.MsgItemPickupRequest:
		e.handleItemPickup(client, msg.(*pb.ItemPickupRequest))
	case network.MsgItemUseRequest:
		e.handleItemUse(client, msg.(*pb.ItemUseRequest))
	case network.MsgItemEquipRequest:
		e.handleItemEquip(client, msg.(*pb.ItemEquipRequest))
	case network.MsgItemDropRequest:
		e.handleItemDrop(client, msg.(*pb.ItemDropRequest))
	case network.MsgShopBuyRequest:
		e.handleShopBuy(client, msg.(*pb.ShopBuyRequest))
	case network.MsgShopSellRequest:
		e.handleShopSell(client, msg.(*pb.ShopSellRequest))
	case network.MsgStatAllocRequest:
		e.handleStatAlloc(client, msg.(*pb.StatAllocRequest))
	case network.MsgSpellCastRequest:
		e.handleSpellCast(client, msg.(*pb.SpellCastRequest))
	case network.MsgLearnSpellRequest:
		e.handleLearnSpell(client, msg.(*pb.LearnSpellRequest))
	case network.MsgSkillUseRequest:
		e.handleSkillUse(client, msg.(*pb.SkillUseRequest))
	case network.MsgCraftRequest:
		e.handleCraft(client, msg.(*pb.CraftRequest))
	case network.MsgFactionSelectRequest:
		e.handleFactionSelect(client, msg.(*pb.FactionSelectRequest))
	case network.MsgGuildCreateRequest:
		e.handleGuildCreate(client, msg.(*pb.GuildCreateRequest))
	case network.MsgGuildActionRequest:
		e.handleGuildAction(client, msg.(*pb.GuildActionRequest))
	case network.MsgPartyActionRequest:
		e.handlePartyAction(client, msg.(*pb.PartyActionRequest))
	case network.MsgPartyInviteResponse:
		e.handlePartyInviteResponse(client, msg.(*pb.PartyInviteResponse))
	case network.MsgTradeRequest:
		e.handleTradeRequest(client, msg.(*pb.TradeRequest))
	case network.MsgTradeResponse:
		e.handleTradeResponse(client, msg.(*pb.TradeResponse))
	case network.MsgTradeSetItem:
		e.handleTradeSetItem(client, msg.(*pb.TradeSetItem))
	case network.MsgTradeSetGold:
		e.handleTradeSetGold(client, msg.(*pb.TradeSetGold))
	case network.MsgTradeConfirm:
		e.handleTradeConfirm(client, msg.(*pb.TradeConfirm))
	case network.MsgQuestAcceptRequest:
		e.handleQuestAccept(client, msg.(*pb.QuestAcceptRequest))
	case network.MsgQuestTurnInRequest:
		e.handleQuestTurnIn(client, msg.(*pb.QuestTurnInRequest))
	case network.MsgLogoutRequest:
		e.handleLogout(client, msg.(*pb.LogoutRequest))
	}
}

func (e *Engine) handleLogin(client *network.Client, req *pb.LoginRequest) {
	ctx := context.Background()

	if !usernameRegex.MatchString(req.Username) {
		e.sendLoginError(client, "Username must be 3-20 alphanumeric characters")
		return
	}
	if len(req.Password) < 6 || len(req.Password) > 30 {
		e.sendLoginError(client, "Password must be 6-30 characters")
		return
	}

	if req.Register {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
		if err != nil {
			e.sendLoginError(client, "Internal error")
			return
		}
		accountID, err := e.store.CreateAccount(ctx, req.Username, string(hash))
		if err != nil {
			e.sendLoginError(client, "Username already taken")
			return
		}
		client.AccountID = accountID
		client.Username = req.Username
		client.Authenticated = true

		// Get UUID for JWT generation
		uuid, err := e.store.GetAccountUUID(ctx, accountID)
		if err != nil {
			log.Printf("Failed to get UUID for new account %d: %v", accountID, err)
			e.sendLoginSuccess(client, nil, "")
			return
		}
		token, err := e.jwtManager.GenerateToken(req.Username, uuid)
		if err != nil {
			log.Printf("Failed to generate JWT for account %d: %v", accountID, err)
		}
		client.AuthToken = token
		e.sendLoginSuccess(client, nil, token)
		return
	}

	// Login
	accountID, hash, uuid, err := e.store.GetAccountByUsername(ctx, req.Username)
	if err != nil {
		e.sendLoginError(client, "Invalid username or password")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		e.sendLoginError(client, "Invalid username or password")
		return
	}

	client.AccountID = accountID
	client.Username = req.Username
	client.Authenticated = true
	e.store.UpdateLastLogin(ctx, accountID)

	// Generate JWT
	token, err := e.jwtManager.GenerateToken(req.Username, uuid)
	if err != nil {
		log.Printf("Failed to generate JWT for account %d: %v", accountID, err)
	}
	client.AuthToken = token

	chars, err := e.store.GetCharactersByAccount(ctx, accountID)
	if err != nil {
		e.sendLoginError(client, "Failed to load characters")
		return
	}
	e.sendLoginSuccess(client, chars, token)
}

func (e *Engine) handleCreateCharacter(client *network.Client, req *pb.CreateCharacterRequest) {
	ctx := context.Background()

	if client.AccountID == 0 {
		return
	}

	if !charNameRegex.MatchString(req.Name) {
		e.sendCreateCharError(client, "Name must be 3-10 alphanumeric characters")
		return
	}

	// Validate stats: each >= 10, total = 70
	stats := []int32{req.Str, req.Vit, req.Dex, req.IntStat, req.Mag, req.Charisma}
	total := int32(0)
	for _, s := range stats {
		if s < 10 {
			e.sendCreateCharError(client, "Each stat must be at least 10")
			return
		}
		total += s
	}
	if total != 70 {
		e.sendCreateCharError(client, "Total stat points must equal 70")
		return
	}

	// Max 4 characters per account
	count, err := e.store.CountCharacters(ctx, client.AccountID)
	if err != nil || count >= 4 {
		e.sendCreateCharError(client, "Maximum 4 characters per account")
		return
	}

	// Validate appearance ranges
	if req.Gender < 0 || req.Gender > 1 || req.SkinColor < 0 || req.SkinColor > 2 ||
		req.HairStyle < 0 || req.HairStyle > 12 || req.HairColor < 0 || req.HairColor > 7 ||
		req.UnderwearColor < 0 || req.UnderwearColor > 7 {
		e.sendCreateCharError(client, "Invalid appearance values")
		return
	}

	_, err = e.store.CreateCharacter(ctx, client.AccountID, req.Name,
		int(req.Gender), int(req.SkinColor), int(req.HairStyle), int(req.HairColor),
		int(req.UnderwearColor), int(req.Str), int(req.Vit), int(req.Dex),
		int(req.IntStat), int(req.Mag), int(req.Charisma))
	if err != nil {
		e.sendCreateCharError(client, "Character name already taken")
		return
	}

	chars, _ := e.store.GetCharactersByAccount(ctx, client.AccountID)
	e.sendCreateCharSuccess(client, chars)
}

func (e *Engine) handleDeleteCharacter(client *network.Client, req *pb.DeleteCharacterRequest) {
	ctx := context.Background()
	if client.AccountID == 0 {
		return
	}

	err := e.store.DeleteCharacter(ctx, int(req.CharacterId), client.AccountID)
	if err != nil {
		e.sendDeleteCharResponse(client, false, "Failed to delete character")
		return
	}

	chars, _ := e.store.GetCharactersByAccount(ctx, client.AccountID)
	e.sendDeleteCharResponse(client, true, "")
	_ = chars
}

func (e *Engine) handleEnterGame(client *network.Client, req *pb.EnterGameRequest) {
	ctx := context.Background()
	if client.AccountID == 0 {
		return
	}

	// Verify JWT token's UUID resolves to the same account for extra security
	if client.AuthToken != "" && e.jwtManager != nil {
		claims, err := e.jwtManager.ValidateToken(client.AuthToken)
		if err != nil {
			log.Printf("Token validation failed for %s: %v", client.Username, err)
			return
		}
		resolvedID, err := e.store.GetAccountIDByUUID(ctx, claims.UUID)
		if err != nil || resolvedID != client.AccountID {
			log.Printf("Token UUID mismatch for %s (uuid=%s, expected account %d, got %d)",
				client.Username, claims.UUID, client.AccountID, resolvedID)
			return
		}
	}

	charRow, err := e.store.GetCharacterByID(ctx, int(req.CharacterId), client.AccountID)
	if err != nil {
		log.Printf("EnterGame: character not found: %v", err)
		return
	}

	objectID := e.nextObjID.Add(1)
	p := player.FromDB(charRow, objectID, client)
	client.ObjectID = objectID
	client.CharacterID = charRow.ID

	log.Printf("[ENTER] Loaded character %s (ID=%d): Level=%d, XP=%d, HP=%d, Gold=%d, AdminLevel=%d",
		p.Name, charRow.ID, charRow.Level, charRow.Experience, charRow.HP, charRow.Gold, charRow.AdminLevel)

	// Load saved inventory from database
	loadPlayerInventory(p, charRow)

	// Give starting items to new characters (level 1 with empty inventory)
	if p.Level == 1 && !p.Inventory.HasItems() {
		e.giveStartingItems(p)
	}

	gm, ok := e.maps[p.MapName]
	if !ok {
		// Fallback to default map
		p.MapName = "default"
		gm = e.maps["default"]
		if gm == nil {
			log.Printf("No default map loaded!")
			return
		}
	}

	// Find a walkable position near the saved position
	if !gm.IsWalkable(p.X, p.Y) {
		p.X, p.Y = e.findWalkable(gm, p.X, p.Y)
	}

	gm.SetOwner(p.X, p.Y, objectID)
	gm.AddPlayerToSector(p.X, p.Y, objectID)
	e.players.Store(objectID, p)

	// Send EnterGameResponse
	nearbyPlayers := e.getNearbyEntityInfos(gm, p.X, p.Y, objectID)
	nearbyNPCs := e.getNearbyNPCInfos(gm, p.X, p.Y)

	log.Printf("[ENTER] Player %s (obj=%d) at (%d,%d) on map %s, sector=(%d,%d). Found %d nearby players, %d nearby NPCs",
		p.Name, objectID, p.X, p.Y, p.MapName, p.X/mapdata.SectorSize, p.Y/mapdata.SectorSize,
		len(nearbyPlayers), len(nearbyNPCs))
	for _, np := range nearbyPlayers {
		log.Printf("[ENTER]   nearby player: %s (obj=%d) at (%d,%d)", np.Name, np.ObjectId, np.Position.X, np.Position.Y)
	}
	for _, nn := range nearbyNPCs {
		log.Printf("[ENTER]   nearby NPC: %s (obj=%d) at (%d,%d) type=%d", nn.Name, nn.ObjectId, nn.Position.X, nn.Position.Y, nn.NpcType)
	}

	resp := &pb.EnterGameResponse{
		Player: p.ToContents(),
		MapInfo: &pb.MapInfo{
			Name:          gm.Name,
			Width:         int32(gm.Width),
			Height:        int32(gm.Height),
			CollisionGrid: gm.PackCollisionGrid(),
		},
		NearbyPlayers: nearbyPlayers,
		NearbyNpcs:    nearbyNPCs,
	}

	data, _ := network.Encode(network.MsgEnterGameResponse, resp)
	client.Send(data)

	// Notify nearby players about this player
	appear := p.ToPlayerAppear()
	e.broadcastToNearby(gm, p.X, p.Y, objectID, network.MsgPlayerAppear, appear)
	log.Printf("[ENTER] Broadcast PlayerAppear for %s to nearby players", p.Name)

	// Send inventory state
	e.sendInventoryUpdate(p)

	// Send spell and skill lists
	e.sendSpellList(p)
	e.sendSkillList(p)

	// Send guild info if in a guild
	e.sendGuildInfo(p)

	// Send quest list and world state
	e.sendQuestList(p)
	e.sendWorldState(p)

	// Send nearby ground items
	e.sendNearbyGroundItems(p, gm)

	log.Printf("Player %s entered game on map %s at (%d,%d)", p.Name, p.MapName, p.X, p.Y)
}

func (e *Engine) handleMotion(client *network.Client, req *pb.MotionRequest) {
	if client.ObjectID == 0 {
		return
	}

	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return
	}
	p := val.(*player.Player)

	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	dir := int(req.Direction)
	action := int(req.Action)

	if dir < 1 || dir > 8 {
		return
	}

	if action == 1 || action == 2 { // walk or run
		// Anti-speed-hack: check time since last move
		now := time.Now()
		minInterval := 250 * time.Millisecond // run speed (relaxed for latency)
		if action == 1 {
			minInterval = 300 * time.Millisecond // walk speed (relaxed for latency)
		}
		// Ice effect: increase move delay by 50% per level
		if p.Effects != nil {
			iceLevel := p.Effects.GetEffectLevel(magic.EffectIce)
			if iceLevel > 0 {
				extraMs := int64(minInterval.Milliseconds()) * int64(iceLevel) * 50 / 100
				minInterval += time.Duration(extraMs) * time.Millisecond
			}
		}
		if !p.LastMoveTime.IsZero() && now.Sub(p.LastMoveTime) < minInterval {
			// Too fast - send correction
			log.Printf("[MOTION] Speed correction for %s: interval=%dms, min=%dms",
				p.Name, now.Sub(p.LastMoveTime).Milliseconds(), minInterval.Milliseconds())
			e.sendMotionCorrection(p, gm)
			return
		}

		newX := p.X + dirDX[dir]
		newY := p.Y + dirDY[dir]

		// Check walkability - ignore owner check for movement (only check terrain)
		if newX < 0 || newY < 0 || newX >= gm.Width || newY >= gm.Height || !gm.Tiles[newY][newX].Walkable {
			log.Printf("[MOTION] Walkability correction for %s: (%d,%d) not walkable", p.Name, newX, newY)
			e.sendMotionCorrection(p, gm)
			return
		}

		// Check for teleport
		if gm.IsTeleport(newX, newY) {
			key := mapdata.TeleportKey(p.MapName, newX, newY)
			if dest, ok := e.teleports[key]; ok {
				e.handleTeleport(p, gm, dest)
				return
			}
		}

		// Update position
		oldSectorX := p.X / mapdata.SectorSize
		oldSectorY := p.Y / mapdata.SectorSize

		gm.ClearOwner(p.X, p.Y)
		p.X = newX
		p.Y = newY
		p.Direction = dir
		p.Action = action
		p.LastMoveTime = now
		gm.SetOwner(p.X, p.Y, p.ObjectID)

		// Update sector if changed
		newSectorX := p.X / mapdata.SectorSize
		newSectorY := p.Y / mapdata.SectorSize
		if oldSectorX != newSectorX || oldSectorY != newSectorY {
			oldX := p.X - dirDX[dir]
			oldY := p.Y - dirDY[dir]

			// Get players visible from old sector before moving
			oldNearby := gm.GetNearbyPlayerIDs(oldX, oldY)
			oldSet := make(map[int32]bool, len(oldNearby))
			for _, id := range oldNearby {
				oldSet[id] = true
			}

			// Move sector registration
			gm.RemovePlayerFromSector(oldX, oldY, p.ObjectID)
			gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)

			// Get players visible from new sector
			newNearby := gm.GetNearbyPlayerIDs(p.X, p.Y)
			newSet := make(map[int32]bool, len(newNearby))
			for _, id := range newNearby {
				newSet[id] = true
			}

			appear := p.ToPlayerAppear()
			appearData, _ := network.Encode(network.MsgPlayerAppear, appear)
			disappear := &pb.PlayerDisappear{ObjectId: p.ObjectID}
			disappearData, _ := network.Encode(network.MsgPlayerDisappear, disappear)

			// Send PlayerAppear to players newly in range (in new but not old)
			for _, id := range newNearby {
				if id == p.ObjectID || oldSet[id] {
					continue
				}
				if val, ok := e.players.Load(id); ok {
					other := val.(*player.Player)
					// Tell the new-in-range player about us
					other.Send(appearData)
					// Tell us about the new-in-range player
					otherAppear := other.ToPlayerAppear()
					otherData, _ := network.Encode(network.MsgPlayerAppear, otherAppear)
					p.Send(otherData)
				}
			}

			// Send PlayerDisappear to players no longer in range (in old but not new)
			for _, id := range oldNearby {
				if id == p.ObjectID || newSet[id] {
					continue
				}
				if val, ok := e.players.Load(id); ok {
					other := val.(*player.Player)
					// Tell out-of-range player we disappeared
					other.Send(disappearData)
					// Tell us the out-of-range player disappeared
					otherDisappear := &pb.PlayerDisappear{ObjectId: id}
					otherDisappearData, _ := network.Encode(network.MsgPlayerDisappear, otherDisappear)
					p.Send(otherDisappearData)
				}
			}

			// Also send NPC appear/disappear for sector crossing
			e.npcs.Range(func(key, value any) bool {
				n := value.(*npc.NPC)
				if n.MapName != gm.Name || !n.IsAlive() {
					return true
				}
				oldDist := n.DistanceTo(oldX, oldY)
				newDist := n.DistanceTo(p.X, p.Y)
				if oldDist > 40 && newDist <= 40 {
					// NPC now in range — send NpcAppear
					npcAppear := n.ToNpcAppear()
					npcData, _ := network.Encode(network.MsgNpcAppear, npcAppear)
					p.Send(npcData)
				} else if oldDist <= 40 && newDist > 40 {
					// NPC now out of range — send NpcDisappear
					npcDisappear := &pb.NpcDisappear{ObjectId: n.ObjectID}
					npcData, _ := network.Encode(network.MsgNpcDisappear, npcDisappear)
					p.Send(npcData)
				}
				return true
			})
		}

		// Broadcast movement to nearby players
		speed := int32(490)
		if action == 2 {
			speed = 350
		}

		motionEvent := &pb.MotionEvent{
			ObjectId:  p.ObjectID,
			OwnerType: 1, // player
			Action:    int32(action),
			Direction: int32(dir),
			Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
			Speed:     speed,
			Name:      p.Name,
		}
		e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgMotionEvent, motionEvent)
	} else if action == 0 { // stop
		p.Direction = dir
		p.Action = 0

		motionEvent := &pb.MotionEvent{
			ObjectId:  p.ObjectID,
			OwnerType: 1,
			Action:    0,
			Direction: int32(dir),
			Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
			Name:      p.Name,
		}
		e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgMotionEvent, motionEvent)
	}
}

// handleTeleport moves a player to a different map.
func (e *Engine) handleTeleport(p *player.Player, srcMap *mapdata.GameMap, dest mapdata.TeleportDest) {
	destMap, ok := e.maps[dest.DestMap]
	if !ok {
		log.Printf("Teleport: destination map %q not loaded", dest.DestMap)
		return
	}

	// Remove from current map
	srcMap.ClearOwner(p.X, p.Y)
	srcMap.RemovePlayerFromSector(p.X, p.Y, p.ObjectID)

	// Broadcast disappear to players on old map
	disappear := &pb.PlayerDisappear{ObjectId: p.ObjectID}
	e.broadcastToNearby(srcMap, p.X, p.Y, p.ObjectID, network.MsgPlayerDisappear, disappear)

	// Determine destination position
	destX, destY := dest.DestX, dest.DestY
	if destX < 0 || destY < 0 {
		// -1,-1 means use map center
		destX = destMap.Width / 2
		destY = destMap.Height / 2
	}
	// Find walkable tile near destination
	if !destMap.IsWalkable(destX, destY) {
		destX, destY = e.findWalkable(destMap, destX, destY)
	}

	// Update player position
	oldMap := p.MapName
	p.MapName = dest.DestMap
	p.X = destX
	p.Y = destY
	if dest.Dir > 0 {
		p.Direction = dest.Dir
	}

	// Place on new map
	destMap.SetOwner(p.X, p.Y, p.ObjectID)
	destMap.AddPlayerToSector(p.X, p.Y, p.ObjectID)

	// Send map change to the teleporting player with new map info
	mapChangeResp := &pb.MapChangeResponse{
		MapName:   dest.DestMap,
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Direction: int32(p.Direction),
	}
	data, _ := network.Encode(network.MsgMapChangeResponse, mapChangeResp)
	p.Send(data)

	// Send new map info (collision grid)
	enterResp := &pb.EnterGameResponse{
		Player: p.ToContents(),
		MapInfo: &pb.MapInfo{
			Name:          destMap.Name,
			Width:         int32(destMap.Width),
			Height:        int32(destMap.Height),
			CollisionGrid: destMap.PackCollisionGrid(),
		},
		NearbyPlayers: e.getNearbyEntityInfos(destMap, p.X, p.Y, p.ObjectID),
		NearbyNpcs:    e.getNearbyNPCInfos(destMap, p.X, p.Y),
	}
	enterData, _ := network.Encode(network.MsgEnterGameResponse, enterResp)
	p.Send(enterData)

	// Send inventory, spells, etc.
	e.sendInventoryUpdate(p)
	e.sendNearbyGroundItems(p, destMap)

	// Broadcast appear to players on new map
	appear := p.ToPlayerAppear()
	e.broadcastToNearby(destMap, p.X, p.Y, p.ObjectID, network.MsgPlayerAppear, appear)

	log.Printf("Player %s teleported from %s to %s (%d,%d)", p.Name, oldMap, dest.DestMap, p.X, p.Y)
}

func (e *Engine) handleChat(client *network.Client, req *pb.ChatRequest) {
	if client.ObjectID == 0 {
		return
	}

	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return
	}
	p := val.(*player.Player)

	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	// Limit message length
	msg := req.Message
	if len(msg) > 200 {
		msg = msg[:200]
	}
	if len(msg) == 0 {
		return
	}

	// Check for admin commands (messages starting with "/")
	if strings.HasPrefix(msg, "/") {
		if e.handleAdminCommand(p, msg) {
			return // command handled, don't broadcast
		}
	}

	// Check if player is muted
	if !p.MutedUntil.IsZero() && time.Now().Before(p.MutedUntil) {
		e.sendNotification(p, "You are muted", 2)
		return
	}

	chatMsg := &pb.ChatMessage{
		ObjectId:   p.ObjectID,
		SenderName: p.Name,
		Type:       req.Type,
		Message:    msg,
		Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
	}

	switch req.Type {
	case 0: // normal - nearby players
		e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgChatMessage, chatMsg)
	case 1: // shout - all players on map
		e.broadcastToMap(p.MapName, network.MsgChatMessage, chatMsg)
	case 2: // whisper - specific player
		e.sendWhisper(req.Target, chatMsg)
	case 3: // guild chat
		e.handleGuildChat(p, msg)
	}
}

func (e *Engine) handleAttack(client *network.Client, req *pb.MotionRequest) {
	if client.ObjectID == 0 {
		return
	}

	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return
	}
	p := val.(*player.Player)

	log.Printf("[ATTACK] Player %s (obj=%d) attacking targetId=%d dir=%d", p.Name, p.ObjectID, req.TargetId, req.Direction)

	if p.HP <= 0 {
		log.Printf("[ATTACK] Player %s is dead, ignoring", p.Name)
		return // dead players can't attack
	}

	gm, ok := e.maps[p.MapName]
	if !ok {
		log.Printf("[ATTACK] Map %s not found", p.MapName)
		return
	}

	targetID := req.TargetId
	if targetID == 0 {
		log.Printf("[ATTACK] No target ID")
		return
	}

	// Update player direction toward target
	if req.Direction >= 1 && req.Direction <= 8 {
		p.Direction = int(req.Direction)
	}

	// Check if target is another player (PvP)
	if targetPlayer := e.getPlayerByID(targetID); targetPlayer != nil {
		if targetPlayer.MapName == p.MapName && targetPlayer.HP > 0 {
			dist := abs(p.X-targetPlayer.X) + abs(p.Y-targetPlayer.Y)
			if dist <= 2 {
				p.Direction = directionTo(p.X, p.Y, targetPlayer.X, targetPlayer.Y)
				e.handlePvPAttack(p, targetPlayer)
			}
		}
		return
	}

	// Check if target is an NPC
	npcVal, isNPC := e.npcs.Load(targetID)
	if isNPC {
		n := npcVal.(*npc.NPC)
		log.Printf("[ATTACK] Found NPC %s (obj=%d) at (%d,%d), alive=%v, map=%s, dist=%d",
			n.Type.Name, n.ObjectID, n.X, n.Y, n.IsAlive(), n.MapName, n.DistanceTo(p.X, p.Y))

		// Shop NPC interaction
		if npc.IsShopNPC(n.Type.ID) {
			if n.DistanceTo(p.X, p.Y) <= 3 {
				e.handleNPCInteract(p, n)
			}
			return
		}

		if !n.IsAlive() || n.MapName != p.MapName {
			log.Printf("[ATTACK] NPC not alive or wrong map")
			return
		}

		// Check range (must be adjacent, distance <= 2)
		dist := n.DistanceTo(p.X, p.Y)
		if dist > 2 {
			log.Printf("[ATTACK] NPC too far: dist=%d", dist)
			return
		}

		// Face the target
		p.Direction = directionTo(p.X, p.Y, n.X, n.Y)

		// Broadcast attack animation
		attackMotion := &pb.MotionEvent{
			ObjectId:  p.ObjectID,
			OwnerType: 1,
			Action:    3, // attack
			Direction: int32(p.Direction),
			Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
			Name:      p.Name,
		}
		e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgMotionEvent, attackMotion)

		// Calculate damage
		result := PlayerAttackNPC(p, n)

		// Apply day/night weapon bonus
		if !result.Miss {
			dayNightBonus := CalcDayNightBonus(p, e.CurrentWorldPhase)
			if dayNightBonus > 0 {
				result.Damage += dayNightBonus
				// Apply bonus damage to NPC
				if n.IsAlive() {
					killed := n.TakeDamage(dayNightBonus)
					if killed && !result.Killed {
						result.Killed = true
					}
				}
			}
		}

		// Send damage event to nearby
		dmgEvent := &pb.DamageEvent{
			AttackerId:  p.ObjectID,
			TargetId:    n.ObjectID,
			TargetType:  2, // NPC
			Damage:      int32(result.Damage),
			Critical:    result.Critical,
			Miss:        result.Miss,
			TargetHp:    int32(n.HP),
			TargetMaxHp: int32(n.MaxHP),
		}
		e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgDamageEvent, dmgEvent)

		// NPC aggroes attacker
		if n.IsAlive() && n.TargetID == 0 {
			n.TargetID = p.ObjectID
			n.State = npc.StateChase
		}

		// Handle NPC death
		if result.Killed {
			e.handleNPCDeath(n, p, gm)
		}

		// Consume SP
		p.SP -= 2
		if p.SP < 0 {
			p.SP = 0
		}
		e.sendStatUpdate(p)
	}
}

func (e *Engine) handleNPCDeath(n *npc.NPC, killer *player.Player, gm *mapdata.GameMap) {
	// Clear NPC from map
	gm.ClearOwner(n.X, n.Y)

	// Broadcast death event
	deathEvt := &pb.DeathEvent{
		ObjectId:   n.ObjectID,
		ObjectType: 2, // NPC
		KillerId:   killer.ObjectID,
		KillerName: killer.Name,
		Position:   &pb.Vec2{X: int32(n.X), Y: int32(n.Y)},
	}
	e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgDeathEvent, deathEvt)

	// Broadcast NPC disappear
	disappear := &pb.NpcDisappear{ObjectId: n.ObjectID}
	e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgNpcDisappear, disappear)

	// Update quest progress
	e.onNPCKillQuestUpdate(killer, n.Type.ID)

	// Award XP to killer
	killer.Experience += int64(n.Type.XP)
	leveledUp := CheckLevelUp(killer)

	// Award gold (multi-tier: always drops, amount based on NPC XP)
	goldDrop := items.RollGoldDrop(n.Type.XP)
	killer.Gold += goldDrop

	// Roll loot based on NPC type (boss vs regular)
	var lootDrops []*items.Item
	if n.Type.BossType > 0 {
		lootDrops = items.RollBossLoot()
	} else {
		lootDrops = items.RollMultiTierLoot(n.Type.ID, n.Type.XP)
	}

	// Apply random attributes to equipment drops (4.6)
	for _, drop := range lootDrops {
		def := drop.Def()
		if def == nil {
			continue
		}
		// Only equipment (weapons + armor, not potions/materials) can get attributes
		if def.Type >= items.ItemTypeWeapon && def.Type <= items.ItemTypeCape {
			roll := rand.Float64()
			switch {
			case roll < 0.01: // 1% Ancient
				drop.Attribute = uint32(items.AttrAncient) << 20
			case roll < 0.06: // 5% Sharp (cumulative: 1%+5%=6% total, but 5% of the remaining)
				drop.Attribute = uint32(items.AttrSharp) << 20
			}
		}
	}

	for _, drop := range lootDrops {
		e.dropGroundItem(drop, n.MapName, n.X, n.Y, gm)
	}

	// Send stat update to killer
	e.sendStatUpdate(killer)

	if leveledUp {
		// Notify of level up
		notif := &pb.Notification{
			Message: fmt.Sprintf("Level up! You are now level %d!", killer.Level),
			Type:    3, // system
		}
		data, _ := network.Encode(network.MsgNotification, notif)
		killer.Send(data)
	}

	log.Printf("NPC %s killed by %s (+%d XP, +%d gold)", n.Type.Name, killer.Name, n.Type.XP, goldDrop)
}

func directionTo(fromX, fromY, toX, toY int) int {
	dx := toX - fromX
	dy := toY - fromY
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
		return 5
	}
}

// Helper functions

func (e *Engine) sendLoginError(client *network.Client, errMsg string) {
	resp := &pb.LoginResponse{Success: false, Error: errMsg}
	data, _ := network.Encode(network.MsgLoginResponse, resp)
	client.Send(data)
}

func (e *Engine) sendLoginSuccess(client *network.Client, chars []db.CharacterRow, token string) {
	resp := &pb.LoginResponse{Success: true, Token: token}
	for _, c := range chars {
		resp.Characters = append(resp.Characters, charRowToSummary(c))
	}
	data, _ := network.Encode(network.MsgLoginResponse, resp)
	client.Send(data)
}

func (e *Engine) sendCreateCharError(client *network.Client, errMsg string) {
	resp := &pb.CreateCharacterResponse{Success: false, Error: errMsg}
	data, _ := network.Encode(network.MsgCreateCharResponse, resp)
	client.Send(data)
}

func (e *Engine) sendCreateCharSuccess(client *network.Client, chars []db.CharacterRow) {
	resp := &pb.CreateCharacterResponse{Success: true}
	for _, c := range chars {
		resp.Characters = append(resp.Characters, charRowToSummary(c))
	}
	data, _ := network.Encode(network.MsgCreateCharResponse, resp)
	client.Send(data)
}

func (e *Engine) sendDeleteCharResponse(client *network.Client, success bool, errMsg string) {
	resp := &pb.DeleteCharacterResponse{Success: success, Error: errMsg}
	data, _ := network.Encode(network.MsgDeleteCharResponse, resp)
	client.Send(data)
}

func (e *Engine) sendMotionCorrection(p *player.Player, gm *mapdata.GameMap) {
	motionEvent := &pb.MotionEvent{
		ObjectId:  p.ObjectID,
		OwnerType: 1,
		Action:    0, // force stop
		Direction: int32(p.Direction),
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Name:      p.Name,
	}
	data, _ := network.Encode(network.MsgMotionEvent, motionEvent)
	p.Send(data)
}

func (e *Engine) broadcastToNearby(gm *mapdata.GameMap, x, y int, excludeID int32, msgType byte, msg proto.Message) {
	data, err := network.Encode(msgType, msg)
	if err != nil {
		return
	}

	nearbyIDs := gm.GetNearbyPlayerIDs(x, y)
	for _, id := range nearbyIDs {
		if id == excludeID {
			continue
		}
		if val, ok := e.players.Load(id); ok {
			val.(*player.Player).Send(data)
		}
	}
}

func (e *Engine) broadcastToMap(mapName string, msgType byte, msg proto.Message) {
	data, err := network.Encode(msgType, msg)
	if err != nil {
		return
	}

	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if p.MapName == mapName {
			p.Send(data)
		}
		return true
	})
}

func (e *Engine) sendWhisper(targetName string, msg *pb.ChatMessage) {
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if p.Name == targetName {
			data, _ := network.Encode(network.MsgChatMessage, msg)
			p.Send(data)
			return false // stop iterating
		}
		return true
	})
}

func (e *Engine) getNearbyEntityInfos(gm *mapdata.GameMap, x, y int, excludeID int32) []*pb.EntityInfo {
	nearbyIDs := gm.GetNearbyPlayerIDs(x, y)
	var infos []*pb.EntityInfo

	for _, id := range nearbyIDs {
		if id == excludeID {
			continue
		}
		if val, ok := e.players.Load(id); ok {
			p := val.(*player.Player)
			infos = append(infos, &pb.EntityInfo{
				ObjectId:   p.ObjectID,
				EntityType: 1,
				Name:       p.Name,
				Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
				Direction:  int32(p.Direction),
				Action:     int32(p.Action),
				Appearance: p.ToAppearance(),
				Level:      int32(p.Level),
				Side:       int32(p.Side),
			})
		}
	}
	return infos
}

func (e *Engine) getNearbyNPCInfos(gm *mapdata.GameMap, x, y int) []*pb.EntityInfo {
	var infos []*pb.EntityInfo
	total := 0
	sameMap := 0
	alive := 0
	e.npcs.Range(func(key, value any) bool {
		n := value.(*npc.NPC)
		total++
		if n.MapName != gm.Name {
			return true
		}
		sameMap++
		if !n.IsAlive() {
			return true
		}
		alive++
		dist := n.DistanceTo(x, y)
		if dist <= 40 { // visibility range
			infos = append(infos, n.ToEntityInfo())
		}
		return true
	})
	log.Printf("[NPC-QUERY] Looking for NPCs near (%d,%d) on %s: total=%d, sameMap=%d, alive=%d, inRange=%d",
		x, y, gm.Name, total, sameMap, alive, len(infos))
	return infos
}

func (e *Engine) findWalkable(gm *mapdata.GameMap, startX, startY int) (int, int) {
	// Spiral search for nearest walkable tile
	for radius := 0; radius < 50; radius++ {
		for dy := -radius; dy <= radius; dy++ {
			for dx := -radius; dx <= radius; dx++ {
				if dx != -radius && dx != radius && dy != -radius && dy != radius {
					continue // only check border of current radius
				}
				x, y := startX+dx, startY+dy
				if gm.IsWalkable(x, y) {
					return x, y
				}
			}
		}
	}
	// Last resort: center of map
	return gm.Width / 2, gm.Height / 2
}

func (e *Engine) SaveAllPlayers() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if err := savePlayerToDB(e.store, ctx, p); err != nil {
			log.Printf("Failed to save player %s: %v", p.Name, err)
		} else {
			log.Printf("Saved player %s", p.Name)
		}
		return true
	})
}

func charRowToSummary(c db.CharacterRow) *pb.CharacterSummary {
	return &pb.CharacterSummary{
		Id:      int32(c.ID),
		Name:    c.Name,
		Level:   int32(c.Level),
		Gender:  int32(c.Gender),
		Side:    int32(c.Side),
		MapName: c.MapName,
		Appearance: &pb.Appearance{
			Gender:         int32(c.Gender),
			SkinColor:      int32(c.SkinColor),
			HairStyle:      int32(c.HairStyle),
			HairColor:      int32(c.HairColor),
			UnderwearColor: int32(c.UnderwearColor),
		},
	}
}
