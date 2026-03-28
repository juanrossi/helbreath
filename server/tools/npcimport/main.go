// Command npcimport parses Helbreath NPC.cfg and generates Go source code
// containing NPC type definitions for the npc package.
//
// Usage:
//
//	go run ./tools/npcimport/ > internal/npc/npcdefs_gen.go
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

// rawNpc holds all fields parsed from a single "Npc = " line in NPC.cfg.
//
// NPC.cfg field order (after Name):
//
//	Type HD DR HR MinBrvy ExpMin ExpMax GoldMin GoldMax ADT ADR Size Side AcLmt ATime RstM Magic Day Chat Search RegenTime Attr AbsM MaxMana MR AtkRge AreaSize PsnR
//
// Index:  0    1  2  3  4       5      6       7       8     9   10  11   12   13    14   15   16    17  18     19    20        21   22   23      24 25     26       27
type rawNpc struct {
	Name      string
	TypeID    int // sprite type ID (the numeric ID used by client)
	HD        int // hit dice -> HP = HD * 10
	DR        int // defense rating
	HR        int // hit ratio (DEX equivalent)
	MinBravey int // min bravery - flee threshold (1-100)
	ExpMin    int // min XP reward
	ExpMax    int // max XP reward
	GoldMin   int // min gold drop
	GoldMax   int // max gold drop
	ADT       int // attack dice throw (number of dice)
	ADR       int // attack dice range (sides per die)
	Size      int // 0=small, 1=medium, 2=large (but cfg uses larger numbers)
	Side      int // 0=neutral, 1=aresden, 2=elvine, 3=special, 4=evil, 10=monster
	AcLmt     int // accuracy limit
	ATime     int // action time (ms) - move/attack speed
	RstM      int // resistance to magic (0-100)
	Magic     int // magic ability level (0=none, higher=more spells)
	Day       int // day/night flag
	Chat      int // chat flags
	Search    int // search range (aggro range in tiles)
	RegenTime int // respawn delay in ms
	Attr      int // attribute (1=earth, 2=air, 3=fire, 4=ice)
	AbsM      int // absorption modifier
	MaxMana   int // max mana for spell casting
	MR        int // magic resistance
	AtkRge    int // attack range in tiles
	AreaSize  int // area of effect size
	PsnR      int // poison resistance
}

// cfgFile is the NPC.cfg path relative to the repository root.
var cfgFile = "helbreath-v3.82-master/Server/Core/NPC.cfg"

func main() {
	repoRoot := os.Getenv("REPO_ROOT")
	if repoRoot == "" {
		cwd, _ := os.Getwd()
		repoRoot = findRepoRoot(cwd)
		if repoRoot == "" {
			log.Fatal("Cannot determine repo root. Set REPO_ROOT env variable.")
		}
	}

	path := filepath.Join(repoRoot, cfgFile)
	npcs, err := parseCfgFile(path)
	if err != nil {
		log.Fatalf("parsing %s: %v", path, err)
	}

	fmt.Fprintf(os.Stderr, "Parsed %d NPC entries from NPC.cfg\n", len(npcs))

	generate(npcs)
}

// findRepoRoot walks up from dir looking for go.mod.
func findRepoRoot(dir string) string {
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return ""
		}
		dir = parent
	}
}

// parseCfgFile reads NPC.cfg and returns all parsed NPC entries.
func parseCfgFile(path string) ([]rawNpc, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var npcs []rawNpc
	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024*1024), 1024*1024)

	for scanner.Scan() {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			continue
		}
		// Skip comments and section markers.
		if trimmed[0] == ';' || trimmed[0] == '[' {
			continue
		}
		if strings.HasPrefix(trimmed, "//") {
			continue
		}
		// Only process "Npc = " lines (not "Np//c" or other commented-out variants).
		if !strings.HasPrefix(trimmed, "Npc") {
			continue
		}
		// Verify it's actually "Npc" followed by space/= and not "Npc" inside a comment.
		afterNpc := strings.TrimPrefix(trimmed, "Npc")
		afterNpc = strings.TrimSpace(afterNpc)
		if len(afterNpc) == 0 || afterNpc[0] != '=' {
			continue
		}

		n, err := parseNpcLine(trimmed)
		if err != nil {
			fmt.Fprintf(os.Stderr, "WARN: skipping line: %v: %q\n", err, trimmed)
			continue
		}
		npcs = append(npcs, n)
	}

	return npcs, scanner.Err()
}

// parseNpcLine parses a single "Npc = Name Type HD DR HR ..." line.
func parseNpcLine(line string) (rawNpc, error) {
	// Strip "Npc" prefix, whitespace, "=".
	rest := strings.TrimPrefix(line, "Npc")
	rest = strings.TrimSpace(rest)
	if len(rest) == 0 || rest[0] != '=' {
		return rawNpc{}, fmt.Errorf("missing '=' after Npc")
	}
	rest = rest[1:]
	rest = strings.TrimSpace(rest)

	fields := strings.Fields(rest)
	// Minimum: Name + Type + 26 numeric fields = 28
	if len(fields) < 28 {
		return rawNpc{}, fmt.Errorf("expected >=28 fields, got %d", len(fields))
	}

	name := fields[0]

	// Parse numeric fields starting at index 1.
	nums := make([]int, 0, 28)
	for i := 1; i < len(fields) && len(nums) < 28; i++ {
		n, err := atoi(fields[i])
		if err != nil {
			return rawNpc{}, fmt.Errorf("field[%d] %q: %w", i, fields[i], err)
		}
		nums = append(nums, n)
	}

	if len(nums) < 27 {
		return rawNpc{}, fmt.Errorf("expected at least 27 numeric fields, got %d", len(nums))
	}

	// Safely get field, defaulting to 0 if not present
	get := func(idx int) int {
		if idx < len(nums) {
			return nums[idx]
		}
		return 0
	}

	return rawNpc{
		Name:      name,
		TypeID:    get(0),  // Type (sprite type)
		HD:        get(1),  // Hit Dice
		DR:        get(2),  // Defense Rating
		HR:        get(3),  // Hit Ratio
		MinBravey: get(4),  // Min Bravery
		ExpMin:    get(5),  // Exp Min
		ExpMax:    get(6),  // Exp Max
		GoldMin:   get(7),  // Gold Min
		GoldMax:   get(8),  // Gold Max
		ADT:       get(9),  // Attack Dice Throw
		ADR:       get(10), // Attack Dice Range
		Size:      get(11), // Size
		Side:      get(12), // Side
		AcLmt:     get(13), // Accuracy Limit
		ATime:     get(14), // Action Time
		RstM:      get(15), // Resistance Magic
		Magic:     get(16), // Magic level
		Day:       get(17), // Day flag
		Chat:      get(18), // Chat flag
		Search:    get(19), // Search (aggro range)
		RegenTime: get(20), // Regen Time (respawn delay in ms)
		Attr:      get(21), // Attribute element
		AbsM:      get(22), // Absorption modifier
		MaxMana:   get(23), // Max Mana
		MR:        get(24), // Magic Resistance
		AtkRge:    get(25), // Attack Range
		AreaSize:  get(26), // Area Size
		PsnR:      get(27), // Poison Resistance
	}, nil
}

func atoi(s string) (int, error) {
	return strconv.Atoi(strings.TrimSpace(s))
}

// existingIDs lists all NPC type IDs already defined in npc.go.
// These will NOT be overwritten by the generated code.
var existingIDs = map[int]bool{
	10: true, // Slime
	11: true, // Skeleton
	12: true, // Stone-Golem
	13: true, // Cyclops
	14: true, // Orc
	15: true, // ShopKeeper-W
	16: true, // Giant-Ant
	17: true, // Scorpion
	18: true, // Zombie
	19: true, // Gandlf
	20: true, // Howard
	21: true, // Guard
	22: true, // Amphis
	23: true, // Clay-Golem
	24: true, // Tom
	25: true, // William
	26: true, // Kennedy
	27: true, // Hellbound
	28: true, // Troll
	29: true, // Ogre
	30: true, // Liche
	31: true, // Demon
	32: true, // Unicorn
	33: true, // WereWolf
	34: true, // Dummy
	48: true, // Stalker
	49: true, // Hellclaw
	50: true, // Tigerworm
	52: true, // Gagoyle
	53: true, // Beholder
	54: true, // Dark-Elf
	55: true, // Rabbit
	56: true, // Cat
	57: true, // Frog
	58: true, // Mountain-Giant
	59: true, // Ettin
	60: true, // Plant
	61: true, // Rudolph
	62: true, // DireBoar
	63: true, // Frost
	64: true, // Crops
	65: true, // Ice-Golem
	66: true, // Wyvern
	67: true, // McGaffin
	68: true, // Perry
	69: true, // Devlin
	71: true, // Centaurus
	72: true, // Claw-Turtle
	73: true, // Fire-Wyvern
	74: true, // Giant-Crayfish
	75: true, // Giant-Lizard
	76: true, // Giant-Tree
	77: true, // MasterMage-Orc
	78: true, // Minotaurs
	79: true, // Nizie
	80: true, // Tentocle
	81: true, // Abaddon
	90: true, // Gail
}

// npcEntry is the resolved entry to generate code for.
type npcEntry struct {
	Key    int    // map key in NpcTypes
	Name   string // display name
	Sprite int    // SpriteType for client
	raw    rawNpc
}

// generate writes the Go source code to stdout.
func generate(npcs []rawNpc) {
	// Build entries: for NPCs whose TypeID is already used, assign unique keys
	// in the 1000+ range (base = 1000 + sequential counter).
	var entries []npcEntry
	nextKey := 1000

	// Deduplicate by name: if multiple entries share the same name, keep the last one.
	nameMap := make(map[string]rawNpc)
	var nameOrder []string
	for _, n := range npcs {
		if _, exists := nameMap[n.Name]; !exists {
			nameOrder = append(nameOrder, n.Name)
		}
		nameMap[n.Name] = n
	}

	for _, name := range nameOrder {
		n := nameMap[name]

		// Skip NPCs already defined in npc.go using their primary TypeID.
		if existingIDs[n.TypeID] {
			// Check if the name matches what we expect for that TypeID.
			// If the name is different (faction variant), it needs its own key.
			if isSameAsExisting(n) {
				fmt.Fprintf(os.Stderr, "  SKIP (existing): %s (type %d)\n", n.Name, n.TypeID)
				continue
			}
		}

		key := n.TypeID
		if existingIDs[key] || isKeyUsed(entries, key) {
			// Assign a unique key in the 1000+ range
			for existingIDs[nextKey] || isKeyUsed(entries, nextKey) {
				nextKey++
			}
			key = nextKey
			nextKey++
		}

		entries = append(entries, npcEntry{
			Key:    key,
			Name:   n.Name,
			Sprite: n.TypeID, // SpriteType always matches the original cfg TypeID
			raw:    n,
		})
	}

	// Sort by key for stable output.
	sort.Slice(entries, func(i, j int) bool { return entries[i].Key < entries[j].Key })

	fmt.Fprintf(os.Stderr, "Generating %d new NPC entries\n", len(entries))

	p := func(format string, args ...any) {
		fmt.Printf(format, args...)
	}

	p("// Code generated by tools/npcimport; DO NOT EDIT.\n")
	p("//\n")
	p("// Source: helbreath-v3.82-master/Server/Core/NPC.cfg\n")
	p("// This file adds NPC types not already defined in npc.go.\n")
	p("package npc\n\n")
	p("import \"time\"\n\n")
	p("func init() {\n")

	for _, e := range entries {
		n := e.raw
		hp := n.HD * 10
		if hp <= 0 {
			hp = 10
		}

		// XP: average of min/max
		xp := (n.ExpMin + n.ExpMax) / 2

		// Min/Max damage from dice
		minDmg := n.ADT // minimum = 1 per die = number of dice
		maxDmg := n.ADT * n.ADR
		if minDmg <= 0 {
			minDmg = 1
		}

		// Derive size category from HP (more reliable than cfg Size field)
		size := mapSizeFromHP(hp)

		// Map side
		side := mapSide(n.Side)

		// Attack speed and move speed from ATime
		moveSpeed := n.ATime
		if moveSpeed <= 0 {
			moveSpeed = 1000
		}
		attackSpeed := n.ATime
		if attackSpeed <= 0 {
			attackSpeed = 1000
		}

		// Aggro range from Search field
		aggroRange := n.Search
		if aggroRange <= 0 && !isNpcNPC(n) && !isStructure(n) {
			aggroRange = 5 // default aggro for monsters
		}

		// Respawn delay: convert from ms. If too high, cap at reasonable value.
		respawnMs := n.RegenTime
		if respawnMs <= 0 {
			respawnMs = 5000
		}
		respawnSec := respawnMs / 1000
		if respawnSec <= 0 {
			respawnSec = 5
		}
		if respawnSec > 120 {
			respawnSec = 120
		}

		// Wander range: monsters get 8, town NPCs get 0, structures get 0
		wanderRange := 8
		if isNpcNPC(n) || isStructure(n) {
			wanderRange = 0
		}

		// Flee behavior: low bravery mobs can flee
		canFlee := n.MinBravey > 0 && n.MinBravey < 50 && !isNpcNPC(n) && !isStructure(n)
		fleeHPPct := 0
		if canFlee {
			// Lower bravery = higher flee threshold
			fleeHPPct = 50 - n.MinBravey*10
			if fleeHPPct < 10 {
				fleeHPPct = 10
			}
			if fleeHPPct > 50 {
				fleeHPPct = 50
			}
		}

		// Boss detection: very high HP or special creatures
		bossType := 0
		if hp >= 10000 {
			bossType = 1
		}

		// Magic stats
		mana := n.MaxMana
		magicHitRatio := n.MR

		// Attack range
		atkRange := n.AtkRge
		if atkRange <= 0 {
			atkRange = 1
		}

		// INT from magic level
		intStat := 0
		if n.Magic > 0 {
			intStat = n.Magic * 10
			if intStat < 50 {
				intStat = 50
			}
		}

		// AbsM for damage absorption
		absM := n.AbsM

		p("\tNpcTypes[%d] = &NpcType{\n", e.Key)
		p("\t\tID: %d, Name: %q, SpriteType: %d,\n", e.Key, e.Name, e.Sprite)
		p("\t\tHP: %d, MinDamage: %d, MaxDamage: %d,\n", hp, minDmg, maxDmg)
		p("\t\tDefense: %d, DEX: %d, XP: %d,\n", n.DR, n.HR, xp)
		p("\t\tAggroRange: %d, MoveSpeed: %d, AttackSpeed: %d, WanderRange: %d,\n",
			aggroRange, moveSpeed, attackSpeed, wanderRange)
		p("\t\tDiceThrow: %d, DiceRange: %d,\n", n.ADT, n.ADR)
		p("\t\tSize: %s, Side: %s,\n", size, side)
		p("\t\tAttackRange: %d,\n", atkRange)
		p("\t\tRespawnDelay: %d * time.Second,\n", respawnSec)

		if canFlee {
			p("\t\tCanFlee: true, FleeHPPct: %d,\n", fleeHPPct)
		}

		if bossType > 0 {
			p("\t\tBossType: %d,\n", bossType)
		}

		if intStat > 0 {
			p("\t\tINT: %d,\n", intStat)
		}

		if mana > 0 {
			p("\t\tMana: %d, MaxMana: %d,\n", mana, mana)
		}

		if magicHitRatio > 0 {
			p("\t\tMagicHitRatio: %d,\n", magicHitRatio)
		}

		_ = absM // AbsM not in NpcType struct yet, future use

		p("\t}\n\n")
	}

	p("}\n")
}

// isSameAsExisting checks whether this NPC from NPC.cfg matches
// what is already defined in npc.go for the same TypeID.
func isSameAsExisting(n rawNpc) bool {
	// Map of TypeID -> expected name in npc.go
	existingNames := map[int]string{
		10: "Slime", 11: "Skeleton", 12: "Stone-Golem", 13: "Cyclops",
		14: "Orc", 15: "ShopKeeper-W", 16: "Giant-Ant", 17: "Scorpion",
		18: "Zombie", 19: "Gandlf", 20: "Howard", 21: "Guard",
		22: "Amphis", 23: "Clay-Golem", 24: "Tom", 25: "William",
		26: "Kennedy", 27: "Hellbound", 28: "Troll", 29: "Ogre",
		30: "Liche", 31: "Demon", 32: "Unicorn", 33: "WereWolf",
		34: "Dummy", 48: "Stalker", 49: "Hellclaw", 50: "Tigerworm",
		52: "Gagoyle", 53: "Beholder", 54: "Dark-Elf", 55: "Rabbit",
		56: "Cat", 57: "Frog", 58: "Mountain-Giant", 59: "Ettin",
		60: "Plant", 61: "Rudolph", 62: "DireBoar", 63: "Frost",
		64: "Crops", 65: "Ice-Golem", 66: "Wyvern", 67: "McGaffin",
		68: "Perry", 69: "Devlin", 71: "Centaurus", 72: "Claw-Turtle",
		73: "Fire-Wyvern", 74: "Giant-Crayfish", 75: "Giant-Lizard",
		76: "Giant-Tree", 77: "MasterMage-Orc", 78: "Minotaurs",
		79: "Nizie", 80: "Tentocle", 81: "Abaddon", 90: "Gail",
	}

	expectedName, ok := existingNames[n.TypeID]
	if !ok {
		return false
	}
	return n.Name == expectedName
}

// isKeyUsed checks if a key is already used in the entries list.
func isKeyUsed(entries []npcEntry, key int) bool {
	for _, e := range entries {
		if e.Key == key {
			return true
		}
	}
	return false
}

// mapSize converts NPC.cfg size values to our SizeSmall/SizeMedium/SizeLarge constants.
// The cfg Size field represents physical area size (0-14), not our damage category.
// We derive the damage-size category from HP (HD * 10) as a better heuristic:
//   - Small:  HP <= 100  (basic mobs like Slime, Rabbit)
//   - Medium: HP <= 600  (mid-tier like Zombie, Skeleton, Scorpion)
//   - Large:  HP > 600   (bosses, golems, endgame)
func mapSize(cfgSize int) string {
	// Not used directly; see mapSizeFromHP below.
	_ = cfgSize
	return "SizeSmall" // placeholder, overridden in generate()
}

// mapSizeFromHP derives the damage size category from HP.
func mapSizeFromHP(hp int) string {
	switch {
	case hp <= 100:
		return "SizeSmall"
	case hp <= 600:
		return "SizeMedium"
	default:
		return "SizeLarge"
	}
}

// mapSide converts NPC.cfg side values to our Side constants.
func mapSide(cfgSide int) string {
	switch cfgSide {
	case 0:
		return "SideNeutral"
	case 1:
		return "SideAresden"
	case 2:
		return "SideElvine"
	case 3:
		return "SideSpecial"
	case 4:
		return "SideMonster" // evil faction treated as monster
	case 10:
		return "SideMonster"
	default:
		return "SideMonster"
	}
}

// isNpcNPC returns true if this NPC is a town NPC (shopkeeper, guard trainer, etc.).
func isNpcNPC(n rawNpc) bool {
	// Town NPCs typically have very low exp, chat flags, and specific names
	names := map[string]bool{
		"ShopKeeper-W": true, "Gandlf": true, "Howard": true,
		"Tom": true, "William": true, "Kennedy": true,
		"McGaffin": true, "Perry": true, "Devlin": true, "Gail": true,
	}
	return names[n.Name]
}

// isStructure returns true if this NPC is a building/structure (not a creature).
func isStructure(n rawNpc) bool {
	names := map[string]bool{
		"AGT-Aresden": true, "AGT-Elvine": true,
		"CGT-Aresden": true, "CGT-Elvine": true,
		"MS-Aresden": true, "MS-Elvine": true,
		"DT-Aresden": true, "DT-Elvine": true,
		"ESG-Aresden": true, "ESG-Elvine": true,
		"GMG-Aresden": true, "GMG-Elvine": true,
		"ManaStone": true,
		"CP-Aresden": true, "CP-Elvine": true,
		"CT-Aresden": true, "CT-Elvine": true,
		"AGC-Aresden": true, "AGC-Elvine": true,
		"gate-a": true, "gate-e": true,
		"Evil-DT": true, "Evil-AGT": true, "Evil-CGT": true,
		"Evil-ManaStone": true,
	}
	return names[n.Name]
}
