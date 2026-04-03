package game

import (
	"fmt"
	"log"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/world"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// Admin levels
const (
	AdminLevelNone        = 0
	AdminLevelBasicGM     = 1
	AdminLevelGM          = 2
	AdminLevelSeniorGM    = 3
	AdminLevelSuperGM     = 4
	AdminLevelServerAdmin = 5
)

// getRequiredLevel returns the minimum admin level required for a command.
func getRequiredLevel(cmd string) int {
	switch cmd {
	// Level 1+ (Basic GM)
	case "who", "tp", "teleport", "goto":
		return AdminLevelBasicGM

	// Level 2+ (Standard GM)
	case "kill", "revive", "setinvi", "setzerk", "setfreeze",
		"god", "summonplayer", "kick", "shutup", "heal", "givexp":
		return AdminLevelGM

	// Level 3+ (Senior GM)
	case "summon", "weather", "clearnpc":
		return AdminLevelSeniorGM

	// Level 4+ (Super GM)
	case "createitem", "setstat", "setgold", "setadmin":
		return AdminLevelSuperGM

	// Level 5 (Server Admin only)
	case "shutdown":
		return AdminLevelServerAdmin

	default:
		return AdminLevelServerAdmin + 1 // unreachable level = unknown command
	}
}

// handleAdminCommand checks if a message is an admin command and dispatches it.
// Returns true if the message was handled as a command (should not be broadcast).
func (e *Engine) handleAdminCommand(p *player.Player, message string) bool {
	if !strings.HasPrefix(message, "/") {
		return false
	}

	parts := strings.Fields(message[1:]) // remove "/" and split
	if len(parts) == 0 {
		return false
	}

	cmd := strings.ToLower(parts[0])
	args := parts[1:]

	// Player-level commands (no admin required)
	switch cmd {
	case "joinparty":
		e.playerJoinParty(p, args)
		return true
	case "leaveparty":
		e.playerLeaveParty(p)
		return true
	}

	// Check admin level for the command
	requiredLevel := getRequiredLevel(cmd)
	if p.AdminLevel < requiredLevel {
		if p.AdminLevel > 0 {
			e.sendNotification(p, "Insufficient admin level for this command", 2)
			return true
		}
		return false // not an admin or not recognized command
	}

	// Dispatch
	switch cmd {
	case "who":
		e.adminWho(p)
	case "tp", "teleport":
		e.adminTeleport(p, args)
	case "goto":
		e.adminGoto(p, args)
	case "kill":
		e.adminKill(p, args)
	case "revive":
		e.adminRevive(p, args)
	case "setinvi":
		e.adminSetInvi(p, args)
	case "setzerk":
		e.adminSetZerk(p, args)
	case "setfreeze":
		e.adminSetFreeze(p, args)
	case "god":
		e.adminGod(p)
	case "summonplayer":
		e.adminSummonPlayer(p, args)
	case "kick":
		e.adminKick(p, args)
	case "shutup":
		e.adminShutup(p, args)
	case "heal":
		e.adminHeal(p)
	case "givexp":
		e.adminGiveXP(p, args)
	case "summon":
		e.adminSummon(p, args)
	case "weather":
		e.adminWeather(p, args)
	case "clearnpc":
		e.adminClearNPC(p)
	case "createitem":
		e.adminCreateItem(p, args)
	case "setstat":
		e.adminSetStat(p, args)
	case "setgold":
		e.adminSetGold(p, args)
	case "setadmin":
		e.adminSetAdmin(p, args)
	case "shutdown":
		e.adminShutdown(p, args)
	default:
		e.sendNotification(p, "Unknown admin command: /"+cmd, 2)
	}

	log.Printf("[ADMIN] %s (level %d) used /%s %s", p.Name, p.AdminLevel, cmd, strings.Join(args, " "))
	return true
}

// findPlayerByName searches all online players by name (case-insensitive).
func (e *Engine) findPlayerByName(name string) *player.Player {
	var found *player.Player
	e.players.Range(func(_, val interface{}) bool {
		p := val.(*player.Player)
		if strings.EqualFold(p.Name, name) {
			found = p
			return false
		}
		return true
	})
	return found
}

// ============================================================
// Level 1+ commands
// ============================================================

// adminWho lists all online players.
func (e *Engine) adminWho(p *player.Player) {
	count := 0
	var names []string
	e.players.Range(func(_, val interface{}) bool {
		other := val.(*player.Player)
		names = append(names, fmt.Sprintf("%s (Lv%d, %s)", other.Name, other.Level, other.MapName))
		count++
		return true
	})
	e.sendNotification(p, fmt.Sprintf("Online: %d players - %s", count, strings.Join(names, ", ")), 1)
}

// adminTeleport teleports the admin to a map location.
func (e *Engine) adminTeleport(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /tp <map> [x] [y]", 2)
		return
	}

	mapName := args[0]
	destMap, ok := e.maps[mapName]
	if !ok {
		e.sendNotification(p, fmt.Sprintf("Map %q not found", mapName), 2)
		return
	}

	// Default to map center
	destX := destMap.Width / 2
	destY := destMap.Height / 2

	if len(args) >= 3 {
		x, err1 := strconv.Atoi(args[1])
		y, err2 := strconv.Atoi(args[2])
		if err1 != nil || err2 != nil {
			e.sendNotification(p, "Invalid coordinates", 2)
			return
		}
		destX = x
		destY = y
	}

	// Reuse the teleport handler
	srcMap, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	dest := mapdata.TeleportDest{
		DestMap: mapName,
		DestX:   destX,
		DestY:   destY,
	}
	e.handleTeleport(p, srcMap, dest)
	e.sendNotification(p, fmt.Sprintf("Teleported to %s (%d, %d)", mapName, destX, destY), 1)
}

// adminGoto teleports the admin to another player's location.
func (e *Engine) adminGoto(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /goto <player>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	srcMap, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	dest := mapdata.TeleportDest{
		DestMap: target.MapName,
		DestX:   target.X,
		DestY:   target.Y,
	}
	e.handleTeleport(p, srcMap, dest)
	e.sendNotification(p, fmt.Sprintf("Teleported to %s at %s (%d, %d)", target.Name, target.MapName, target.X, target.Y), 1)
}

// ============================================================
// Level 2+ commands
// ============================================================

// adminKill kills a player (sets HP to 0).
func (e *Engine) adminKill(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /kill <player>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	target.HP = 0
	e.sendStatUpdate(target)
	e.handlePlayerDeath(target, p.ObjectID, p.Name, false)
	e.sendNotification(p, fmt.Sprintf("Killed %s", target.Name), 1)
	e.sendNotification(target, "You were killed by a GM", 2)
}

// adminRevive revives a dead player.
func (e *Engine) adminRevive(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /revive <player>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	if target.HP > 0 {
		e.sendNotification(p, fmt.Sprintf("%s is not dead", target.Name), 2)
		return
	}

	target.HP = target.MaxHP
	target.MP = target.MaxMP
	target.SP = target.MaxSP
	e.sendStatUpdate(target)
	e.sendNotification(p, fmt.Sprintf("Revived %s", target.Name), 1)
	e.sendNotification(target, "You have been revived by a GM", 1)
}

// adminSetInvi toggles invisibility on self or a target.
func (e *Engine) adminSetInvi(p *player.Player, args []string) {
	target := p
	if len(args) >= 1 {
		target = e.findPlayerByName(args[0])
		if target == nil {
			e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
			return
		}
	}

	if target.Effects != nil {
		// Toggle: remove if present, add if not
		if target.Effects.HasEffect(magic.EffectInvisibility) {
			target.Effects.RemoveEffect(magic.EffectInvisibility)
			e.sendNotification(p, fmt.Sprintf("Invisibility OFF for %s", target.Name), 1)
		} else {
			target.Effects.AddEffect(&magic.ActiveEffect{
				Type:      magic.EffectInvisibility,
				Level:     100,
				ExpiresAt: time.Now().Add(10 * time.Minute),
			})
			e.sendNotification(p, fmt.Sprintf("Invisibility ON for %s", target.Name), 1)
		}
	}
}

// adminSetZerk toggles berserk on self or a target.
func (e *Engine) adminSetZerk(p *player.Player, args []string) {
	target := p
	if len(args) >= 1 {
		target = e.findPlayerByName(args[0])
		if target == nil {
			e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
			return
		}
	}

	if target.Effects != nil {
		if target.Effects.HasEffect(magic.EffectBerserk) {
			target.Effects.RemoveEffect(magic.EffectBerserk)
			e.sendNotification(p, fmt.Sprintf("Berserk OFF for %s", target.Name), 1)
		} else {
			target.Effects.AddEffect(&magic.ActiveEffect{
				Type:      magic.EffectBerserk,
				Level:     100,
				ExpiresAt: time.Now().Add(10 * time.Minute),
			})
			e.sendNotification(p, fmt.Sprintf("Berserk ON for %s", target.Name), 1)
		}
	}
}

// adminSetFreeze toggles ice/frozen effect on self or a target.
func (e *Engine) adminSetFreeze(p *player.Player, args []string) {
	target := p
	if len(args) >= 1 {
		target = e.findPlayerByName(args[0])
		if target == nil {
			e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
			return
		}
	}

	if target.Effects != nil {
		if target.Effects.HasEffect(magic.EffectIce) {
			target.Effects.RemoveEffect(magic.EffectIce)
			e.sendNotification(p, fmt.Sprintf("Freeze OFF for %s", target.Name), 1)
		} else {
			target.Effects.AddEffect(&magic.ActiveEffect{
				Type:      magic.EffectIce,
				Level:     100,
				ExpiresAt: time.Now().Add(10 * time.Minute),
			})
			e.sendNotification(p, fmt.Sprintf("Freeze ON for %s", target.Name), 1)
		}
	}
}

// adminGod toggles god mode for the admin.
func (e *Engine) adminGod(p *player.Player) {
	p.GodMode = !p.GodMode
	if p.GodMode {
		e.sendNotification(p, "God mode ON - Invulnerable, max damage", 1)
	} else {
		e.sendNotification(p, "God mode OFF", 1)
	}
}

// adminSummonPlayer teleports another player to the admin's location.
func (e *Engine) adminSummonPlayer(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /summonplayer <player>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	srcMap, ok := e.maps[target.MapName]
	if !ok {
		return
	}

	dest := mapdata.TeleportDest{
		DestMap: p.MapName,
		DestX:   p.X,
		DestY:   p.Y,
	}
	e.handleTeleport(target, srcMap, dest)
	e.sendNotification(p, fmt.Sprintf("Summoned %s to your location", target.Name), 1)
	e.sendNotification(target, "You have been summoned by a GM", 1)
}

// adminKick disconnects a player.
func (e *Engine) adminKick(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /kick <player>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	e.sendNotification(target, "You have been kicked by a GM", 2)
	if target.Client != nil {
		target.Client.Close()
	}
	e.sendNotification(p, fmt.Sprintf("Kicked %s", target.Name), 1)
}

// adminShutup mutes a player for a specified number of minutes.
func (e *Engine) adminShutup(p *player.Player, args []string) {
	if len(args) < 2 {
		e.sendNotification(p, "Usage: /shutup <player> <minutes>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	minutes, err := strconv.Atoi(args[1])
	if err != nil || minutes <= 0 {
		e.sendNotification(p, "Invalid duration (must be positive integer minutes)", 2)
		return
	}

	target.MutedUntil = time.Now().Add(time.Duration(minutes) * time.Minute)
	e.sendNotification(p, fmt.Sprintf("Muted %s for %d minutes", target.Name, minutes), 1)
	e.sendNotification(target, fmt.Sprintf("You have been muted for %d minutes", minutes), 2)
}

// adminHeal fully heals the admin.
func (e *Engine) adminHeal(p *player.Player) {
	p.HP = p.MaxHP
	p.MP = p.MaxMP
	p.SP = p.MaxSP
	e.sendStatUpdate(p)
	e.sendNotification(p, "Fully healed", 1)
}

// adminGiveXP gives XP to the admin.
func (e *Engine) adminGiveXP(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /givexp <amount>", 2)
		return
	}

	amount, err := strconv.ParseInt(args[0], 10, 64)
	if err != nil || amount <= 0 {
		e.sendNotification(p, "Invalid XP amount", 2)
		return
	}

	p.Experience += amount
	leveledUp := CheckLevelUp(p)
	e.sendStatUpdate(p)

	msg := fmt.Sprintf("Gained %d XP (total: %d)", amount, p.Experience)
	if leveledUp {
		msg += fmt.Sprintf(" - Now level %d!", p.Level)
	}
	e.sendNotification(p, msg, 1)
}

// ============================================================
// Level 3+ commands
// ============================================================

// adminSummon spawns NPCs at the admin's location.
func (e *Engine) adminSummon(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /summon <npc_type_id> [count]", 2)
		return
	}

	typeID, err := strconv.Atoi(args[0])
	if err != nil {
		e.sendNotification(p, "Invalid NPC type ID", 2)
		return
	}

	npcType, ok := npc.NpcTypes[typeID]
	if !ok {
		e.sendNotification(p, fmt.Sprintf("NPC type %d not found", typeID), 2)
		return
	}

	count := 1
	if len(args) >= 2 {
		c, err := strconv.Atoi(args[1])
		if err == nil && c > 0 && c <= 50 {
			count = c
		}
	}

	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	for i := 0; i < count; i++ {
		// Spawn near the admin with some randomness
		x := p.X + rand.Intn(5) - 2
		y := p.Y + rand.Intn(5) - 2
		if !gm.IsWalkable(x, y) {
			x, y = e.findWalkable(gm, x, y)
		}

		objectID := e.nextObjID.Add(1)
		n := npc.NewNPC(objectID, npcType, p.MapName, x, y)
		e.npcs.Store(objectID, n)

		// Broadcast NPC appear to nearby players
		appear := n.ToNpcAppear()
		e.broadcastToNearby(gm, x, y, -1, network.MsgNpcAppear, appear)
	}

	e.sendNotification(p, fmt.Sprintf("Summoned %d x %s (type %d)", count, npcType.Name, typeID), 1)
}

// adminWeather changes the server weather.
func (e *Engine) adminWeather(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /weather <clear|rain|snow|fog>", 2)
		return
	}

	var weatherType int
	switch strings.ToLower(args[0]) {
	case "clear":
		weatherType = world.WeatherClear
	case "rain":
		weatherType = world.WeatherRain
	case "snow":
		weatherType = world.WeatherSnow
	case "fog":
		weatherType = world.WeatherFog
	default:
		e.sendNotification(p, "Invalid weather type. Use: clear, rain, snow, fog", 2)
		return
	}

	duration := 30 * time.Minute
	if weatherType == world.WeatherClear {
		duration = 1 * time.Millisecond // expire immediately for clear
	}
	e.worldState.SetWeather(weatherType, duration)
	e.broadcastWorldState()
	e.sendNotification(p, fmt.Sprintf("Weather set to %s", args[0]), 1)
}

// adminClearNPC kills all monsters on the current map (except shop NPCs).
func (e *Engine) adminClearNPC(p *player.Player) {
	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	killed := 0
	e.npcs.Range(func(key, val interface{}) bool {
		n := val.(*npc.NPC)
		if n.MapName != p.MapName {
			return true
		}
		if npc.IsShopNPC(n.Type.ID) {
			return true // skip shop NPCs
		}
		if !n.IsAlive() {
			return true
		}

		n.TakeDamage(n.HP + 1) // kill it

		// Clear from map
		gm.ClearOwner(n.X, n.Y)

		// Broadcast NPC disappear (same pattern as handleNPCDeath)
		disappear := &pb.NpcDisappear{ObjectId: n.ObjectID}
		e.broadcastToNearby(gm, n.X, n.Y, -1, network.MsgNpcDisappear, disappear)

		killed++
		return true
	})

	e.sendNotification(p, fmt.Sprintf("Killed %d monsters on %s", killed, p.MapName), 1)
}

// ============================================================
// Level 4+ commands
// ============================================================

// adminCreateItem creates items in a player's inventory.
func (e *Engine) adminCreateItem(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /createitem <item_id> [count] [player]", 2)
		return
	}

	itemID, err := strconv.Atoi(args[0])
	if err != nil {
		e.sendNotification(p, "Invalid item ID", 2)
		return
	}

	def := items.GetItemDef(itemID)
	if def == nil {
		e.sendNotification(p, fmt.Sprintf("Item %d not found", itemID), 2)
		return
	}

	count := 1
	if len(args) >= 2 {
		c, err := strconv.Atoi(args[1])
		if err == nil && c > 0 {
			count = c
		}
	}

	target := p
	if len(args) >= 3 {
		target = e.findPlayerByName(args[2])
		if target == nil {
			e.sendNotification(p, fmt.Sprintf("Player %q not found", args[2]), 2)
			return
		}
	}

	item := items.NewItem(def, count)
	slot := target.Inventory.AddItem(item)
	if slot < 0 {
		e.sendNotification(p, "Target inventory is full", 2)
		return
	}

	e.sendInventoryUpdate(target)
	e.sendNotification(p, fmt.Sprintf("Created %s x%d for %s", def.Name, count, target.Name), 1)
	if target != p {
		e.sendNotification(target, fmt.Sprintf("A GM gave you %s x%d", def.Name, count), 1)
	}
}

// adminSetStat modifies a player's stats.
func (e *Engine) adminSetStat(p *player.Player, args []string) {
	if len(args) < 3 {
		e.sendNotification(p, "Usage: /setstat <player> <str|vit|dex|int|mag|chr|level> <value>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	value, err := strconv.Atoi(args[2])
	if err != nil {
		e.sendNotification(p, "Invalid value", 2)
		return
	}

	stat := strings.ToLower(args[1])
	switch stat {
	case "str":
		target.STR = clamp(value, 1, MaxStatValue)
	case "vit":
		target.VIT = clamp(value, 1, MaxStatValue)
		target.MaxHP = 30 + (target.Level-1)*3 + target.VIT*2
		if target.HP > target.MaxHP {
			target.HP = target.MaxHP
		}
	case "dex":
		target.DEX = clamp(value, 1, MaxStatValue)
	case "int":
		target.INT = clamp(value, 1, MaxStatValue)
	case "mag":
		target.MAG = clamp(value, 1, MaxStatValue)
		target.MaxMP = 10 + (target.Level-1)*2 + target.MAG*2
		if target.MP > target.MaxMP {
			target.MP = target.MaxMP
		}
	case "chr":
		target.CHR = clamp(value, 1, MaxStatValue)
	case "level":
		target.Level = clamp(value, 1, MaxLevel)
		target.MaxHP = 30 + (target.Level-1)*3 + target.VIT*2
		target.MaxMP = 10 + (target.Level-1)*2 + target.MAG*2
		target.MaxSP = 30 + target.Level*2
		target.HP = target.MaxHP
		target.MP = target.MaxMP
		target.SP = target.MaxSP
	default:
		e.sendNotification(p, "Unknown stat. Use: str, vit, dex, int, mag, chr, level", 2)
		return
	}

	target.RecalcCombatStats()
	e.sendStatUpdate(target)
	e.sendNotification(p, fmt.Sprintf("Set %s's %s to %d", target.Name, stat, value), 1)
	e.sendNotification(target, fmt.Sprintf("A GM set your %s to %d", stat, value), 1)
}

// adminSetGold sets a player's gold amount.
func (e *Engine) adminSetGold(p *player.Player, args []string) {
	if len(args) < 2 {
		e.sendNotification(p, "Usage: /setgold <player> <amount>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	amount, err := strconv.ParseInt(args[1], 10, 64)
	if err != nil || amount < 0 {
		e.sendNotification(p, "Invalid gold amount", 2)
		return
	}

	target.Gold = amount
	e.sendStatUpdate(target)
	e.sendNotification(p, fmt.Sprintf("Set %s's gold to %d", target.Name, amount), 1)
	e.sendNotification(target, fmt.Sprintf("A GM set your gold to %d", amount), 1)
}

// adminSetAdmin sets a player's admin level.
func (e *Engine) adminSetAdmin(p *player.Player, args []string) {
	if len(args) < 2 {
		e.sendNotification(p, "Usage: /setadmin <player> <level 0-5>", 2)
		return
	}

	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found", args[0]), 2)
		return
	}

	level, err := strconv.Atoi(args[1])
	if err != nil || level < 0 || level > AdminLevelServerAdmin {
		e.sendNotification(p, fmt.Sprintf("Invalid admin level (0-%d)", AdminLevelServerAdmin), 2)
		return
	}

	// Only level 5 can set level 4+
	if level >= AdminLevelSuperGM && p.AdminLevel < AdminLevelServerAdmin {
		e.sendNotification(p, "Only Server Admins (level 5) can set admin level 4+", 2)
		return
	}

	target.AdminLevel = level
	e.sendNotification(p, fmt.Sprintf("Set %s's admin level to %d", target.Name, level), 1)
	e.sendNotification(target, fmt.Sprintf("Your admin level has been set to %d", level), 1)
}

// ============================================================
// Level 5 commands (Server Admin)
// ============================================================

// adminShutdown initiates a graceful server shutdown with a countdown.
func (e *Engine) adminShutdown(p *player.Player, args []string) {
	seconds := 30 // default countdown
	if len(args) > 0 {
		if n, err := strconv.Atoi(args[0]); err == nil && n > 0 && n <= 300 {
			seconds = n
		}
	}
	e.sendNotification(p, fmt.Sprintf("Shutdown initiated with %d second countdown", seconds), 1)
	go e.initiateShutdown(seconds)
}

// initiateShutdown broadcasts countdown warnings, saves all players, and signals main to exit.
func (e *Engine) initiateShutdown(seconds int) {
	// Mark as shutting down so new logins are rejected
	e.shuttingDown.Store(true)

	for remaining := seconds; remaining > 0; remaining-- {
		// Broadcast every second for last 10, every 10 seconds before that
		if remaining <= 10 || remaining%10 == 0 {
			msg := fmt.Sprintf("Server shutting down in %d seconds!", remaining)
			e.broadcastNotification(msg, 3) // type 3 = system
		}
		time.Sleep(1 * time.Second)
	}

	e.broadcastNotification("Server is shutting down NOW. Goodbye!", 3)
	time.Sleep(500 * time.Millisecond) // let the message flush

	log.Println("Shutdown: saving all players...")
	e.SaveAllPlayers()

	log.Println("Shutdown: disconnecting all clients...")
	e.disconnectAllClients()

	log.Println("Shutdown: signaling main goroutine to exit.")
	if e.shutdownChan != nil {
		close(e.shutdownChan)
	}
}

// broadcastNotification sends a notification message to all connected players.
func (e *Engine) broadcastNotification(msg string, notifType int32) {
	notif := &pb.Notification{Message: msg, Type: notifType}
	data, err := network.Encode(network.MsgNotification, notif)
	if err != nil {
		return
	}
	e.players.Range(func(_, value any) bool {
		p := value.(*player.Player)
		p.Send(data)
		return true
	})
}

// disconnectAllClients gracefully closes every player's connection.
// It closes the send channel first so the WritePump flushes pending messages,
// then closes the underlying WebSocket.
func (e *Engine) disconnectAllClients() {
	e.players.Range(func(_, value any) bool {
		p := value.(*player.Player)
		if p.Client != nil {
			p.Client.CloseGracefully()
		}
		return true
	})
}

// =========================================================================
// Player-level commands (no admin required)
// =========================================================================

// playerJoinParty handles /joinparty <name> — requests to join a player's party.
func (e *Engine) playerJoinParty(p *player.Player, args []string) {
	if len(args) < 1 {
		e.sendNotification(p, "Usage: /joinparty <name>", 2)
		return
	}
	target := e.findPlayerByName(args[0])
	if target == nil {
		e.sendNotification(p, fmt.Sprintf("Player %q not found or offline", args[0]), 2)
		return
	}
	if target.ObjectID == p.ObjectID {
		e.sendNotification(p, "You cannot join your own party", 2)
		return
	}

	// Check if target is in a party; if so, request to join. If not, invite them.
	existingParty := e.parties.GetPlayerParty(p.ObjectID)
	if existingParty != nil {
		e.sendNotification(p, "You are already in a party. Use /leaveparty first.", 2)
		return
	}

	// Send invite request to the target — reuse the party invite protocol
	err := e.parties.InvitePlayer(target.ObjectID, p.ObjectID)
	if err != nil {
		e.sendNotification(p, err.Error(), 2)
		return
	}

	// Notify both players
	e.sendNotification(p, fmt.Sprintf("Party invite sent to %s", target.Name), 3)
	inviteMsg := &pb.PartyInvite{
		InviterObjectId: target.ObjectID,
		InviterName:     p.Name,
	}
	data, _ := network.Encode(network.MsgPartyInviteMsg, inviteMsg)
	target.Send(data)
}

// playerLeaveParty handles /leaveparty — leaves the current party.
func (e *Engine) playerLeaveParty(p *player.Player) {
	party := e.parties.GetPlayerParty(p.ObjectID)
	if party == nil {
		e.sendNotification(p, "You are not in a party", 2)
		return
	}

	err := e.parties.LeaveParty(p.ObjectID)
	if err != nil {
		e.sendNotification(p, err.Error(), 2)
		return
	}
	e.sendNotification(p, "You left the party", 3)

	// Notify remaining members
	for _, memberID := range party.GetMemberIDs() {
		if val, ok := e.players.Load(memberID); ok {
			mp := val.(*player.Player)
			e.sendNotification(mp, fmt.Sprintf("%s left the party", p.Name), 3)
		}
	}
}
