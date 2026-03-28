// Command magicimport parses Helbreath Magic.cfg and generates Go source
// code containing spell definitions for the magic package.
//
// Usage:
//
//	go run ./server/tools/magicimport/ > server/internal/magic/spelldefs_gen.go
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

// rawSpell holds all fields parsed from a single "magic = " line.
//
// Format from Magic.cfg header:
//
//	magic = Num Name Type Delay Last Mana Range1 Range2
//	        Effect1 Effect2 Effect3  Effect4 Effect5 Effect6  Effect7 Effect8 Effect9
//	        Int Cost Cat Attr
type rawSpell struct {
	ID   int
	Name string // with hyphens replaced by spaces

	CfgType int // original Type field from cfg
	Delay   int // cooldown in seconds (0 = instant)
	Last    int // duration in seconds
	Mana    int // mana cost

	Range1 int // range value 1
	Range2 int // range value 2

	// Three groups of three effect values each
	Eff1, Eff2, Eff3 int // effect group 1 (dice throws, dice range, bonus)
	Eff4, Eff5, Eff6 int // effect group 2
	Eff7, Eff8, Eff9 int // effect group 3

	ReqINT int // required INT/MAG stat
	Cost   int // gold cost to learn (-1 = not purchasable)
	Cat    int // category (0=none, 1=offensive, 2=defensive)
	Attr   int // attribute/element (0=none, 1=earth, 2=light, 3=fire, 4=ice)
}

func main() {
	repoRoot := os.Getenv("REPO_ROOT")
	if repoRoot == "" {
		cwd, _ := os.Getwd()
		repoRoot = findRepoRoot(cwd)
		if repoRoot == "" {
			log.Fatal("Cannot determine repo root. Set REPO_ROOT env variable.")
		}
	}

	path := filepath.Join(repoRoot, "helbreath-v3.82-master/Server/Core/Magic.cfg")
	spells, err := parseCfgFile(path)
	if err != nil {
		log.Fatalf("parsing %s: %v", path, err)
	}

	sort.Slice(spells, func(i, j int) bool { return spells[i].ID < spells[j].ID })

	fmt.Fprintf(os.Stderr, "Parsed %d spells from Magic.cfg\n", len(spells))

	generate(spells)
}

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

func parseCfgFile(path string) ([]rawSpell, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var spells []rawSpell
	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024*1024), 1024*1024)

	for scanner.Scan() {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)
		if trimmed == "" || strings.HasPrefix(trimmed, "//") || strings.HasPrefix(trimmed, "[") {
			continue
		}

		if !strings.HasPrefix(trimmed, "magic") {
			continue
		}

		spell, err := parseMagicLine(trimmed)
		if err != nil {
			fmt.Fprintf(os.Stderr, "WARN: skipping: %v: %q\n", err, trimmed)
			continue
		}
		spells = append(spells, spell)
	}

	return spells, scanner.Err()
}

func parseMagicLine(line string) (rawSpell, error) {
	rest := strings.TrimPrefix(line, "magic")
	rest = strings.TrimSpace(rest)
	if len(rest) == 0 || rest[0] != '=' {
		return rawSpell{}, fmt.Errorf("missing '=' after magic")
	}
	rest = rest[1:]
	rest = strings.TrimSpace(rest)

	fields := strings.Fields(rest)
	// ID + Name + 19 numeric fields = 21 minimum
	// Fields: Type Delay Last Mana Range1 Range2 Eff1..Eff9 Int Cost Cat Attr
	if len(fields) < 21 {
		return rawSpell{}, fmt.Errorf("expected >=21 fields, got %d", len(fields))
	}

	id, err := atoi(fields[0])
	if err != nil {
		return rawSpell{}, fmt.Errorf("bad ID %q: %w", fields[0], err)
	}
	name := fields[1]

	nums := make([]int, 0, 19)
	for i := 2; i < len(fields) && len(nums) < 19; i++ {
		n, err := atoi(fields[i])
		if err != nil {
			return rawSpell{}, fmt.Errorf("field[%d] %q: %w", i, fields[i], err)
		}
		nums = append(nums, n)
	}

	if len(nums) < 19 {
		return rawSpell{}, fmt.Errorf("expected 19 numeric fields, got %d", len(nums))
	}

	return rawSpell{
		ID:      id,
		Name:    name,
		CfgType: nums[0],  // Type
		Delay:   nums[1],  // Delay
		Last:    nums[2],  // Last (duration)
		Mana:    nums[3],  // Mana
		Range1:  nums[4],  // Range1
		Range2:  nums[5],  // Range2
		Eff1:    nums[6],  // Effect group 1
		Eff2:    nums[7],
		Eff3:    nums[8],
		Eff4:    nums[9],  // Effect group 2
		Eff5:    nums[10],
		Eff6:    nums[11],
		Eff7:    nums[12], // Effect group 3
		Eff8:    nums[13],
		Eff9:    nums[14],
		ReqINT:  nums[15], // Int requirement
		Cost:    nums[16], // Gold cost
		Cat:     nums[17], // Category
		Attr:    nums[18], // Attribute/Element
	}, nil
}

func atoi(s string) (int, error) {
	return strconv.Atoi(strings.TrimSpace(s))
}

// ---------------------------------------------------------------------------
// Spell type classification
// ---------------------------------------------------------------------------

// mapSpellType converts the original Helbreath CfgType to our SpellType string.
func mapSpellType(s rawSpell) string {
	switch s.CfgType {
	// Direct damage spells
	case 1: // Magic Missile, Lightning Arrow, Mass Lightning Arrow
		return "SpellTypeDamage"
	case 3: // Energy Bolt, Fire Ball, Fire Strike, Meteor Strike, etc.
		return "SpellTypeDamage"
	case 5: // Staminar Drain
		return "SpellTypeDamage"
	case 24: // Lightning (single target)
		return "SpellTypeDamage"
	case 37: // Lightning Arrow (alt)
		return "SpellTypeDamage"

	// Heal spells
	case 2: // Heal, Great Heal, Critical Heal, Regenerate
		return "SpellTypeHeal"
	case 27: // Mass Heal
		return "SpellTypeHeal"

	// Buff spells
	case 11: // Defense Shield, Protection From Arrow, Protection From Magic, etc.
		return "SpellTypeBuff"
	case 51: // Mantles (Wood, Bloody, Magic)
		return "SpellTypeBuff"
	case 60: // Warrior Spirit
		return "SpellTypeBuff"

	// Debuff spells
	case 12: // Hold Person, Paralyze, Entangle, Medusa Kiss
		return "SpellTypeDebuff"
	case 15: // Possession
		return "SpellTypeDebuff"
	case 16: // Confuse Language, Confusion, Illusion, etc.
		return "SpellTypeDebuff"
	case 17: // Poison, Cure (Cure is special, but categorize under debuff for now)
		if s.Eff1 == 0 && s.Eff2 == 0 && s.Eff3 == 0 {
			return "SpellTypeHeal" // Cure removes poison
		}
		return "SpellTypeDebuff"
	case 28: // Armor Break
		return "SpellTypeDebuff"
	case 29: // Cancellation
		return "SpellTypeDebuff"
	case 31: // Inhibition Casting
		return "SpellTypeDebuff"
	case 50: // Magic Drain
		return "SpellTypeDebuff"

	// AoE spells
	case 14: // Fire Wall, Fire Field, Poison Cloud, Spike Field, Ice Storm, Cloud Kill
		return "SpellTypeAOE"
	case 19: // Lightning Bolt (AoE), Bloody Shock Wave
		return "SpellTypeAOE"
	case 21: // Energy Strike, Abaddons (AoE area damage)
		return "SpellTypeAOE"
	case 22: // Tremor
		return "SpellTypeAOE"
	case 23: // Chill Wind, Ice Strike, Mass Chill Wind, Mass Ice Strike
		return "SpellTypeAOE"
	case 25: // Earthworm Strike
		return "SpellTypeAOE"
	case 26: // Blizzard, Mass Blizzard
		return "SpellTypeAOE"
	case 30: // Earth Shock Wave
		return "SpellTypeAOE"
	case 52: // Explosion
		return "SpellTypeAOE"

	// Summon
	case 9: // Summon Creature
		return "SpellTypeSummon"

	// Teleport
	case 8: // Recall
		return "SpellTypeTeleport"

	// Special/utility
	case 10: // Create Food
		return "SpellTypeBuff"
	case 13: // Invisibility, Detect Invisibility
		return "SpellTypeBuff"
	case 18: // Peace, Prayer, Berserk, Trance
		return "SpellTypeBuff"
	case 20: // Polymorph
		return "SpellTypeBuff"
	case 32: // Resurrection
		return "SpellTypeHeal"
	case 33: // Scan
		return "SpellTypeBuff"

	// Stamina recovery
	case 7: // Staminar Recovery, Great Staminar Recovery, Mass Staminar Recovery
		return "SpellTypeHeal"

	default:
		return "SpellTypeDamage" // fallback
	}
}

// mapElement converts the Attr field to our element constant.
// Original: 0=none, 1=earth, 2=light/lightning, 3=fire, 4=ice
func mapElement(attr int) string {
	switch attr {
	case 1:
		return "ElementEarth"
	case 2:
		return "ElementLight"
	case 3:
		return "ElementFire"
	case 4:
		return "ElementIce"
	default:
		return "ElementNone"
	}
}

// mapApplyEffect determines which status effect a spell should apply.
func mapApplyEffect(s rawSpell) (effectName string, level int) {
	switch s.CfgType {
	case 12: // Hold/Paralyze/Entangle/Medusa
		level = s.Eff1
		if level <= 0 {
			level = 1
		}
		return "EffectIce", level // Hold = frozen in place
	case 13: // Invisibility
		if s.Eff1 > 0 && s.Eff2 == 0 { // regular invis (not detect)
			return "EffectInvisibility", s.Eff1
		}
		return "", 0
	case 16: // Confusion/Illusion
		level = s.Eff1
		if level <= 0 {
			level = 1
		}
		return "EffectConfusion", level
	case 17: // Poison (only if applying poison, not cure)
		if s.Eff1 > 0 && s.Eff2 > 0 {
			return "EffectPoison", 1
		}
		return "", 0
	case 11: // Defense shields
		level = s.Eff1
		if level <= 0 {
			level = 1
		}
		switch {
		case level >= 5:
			return "EffectMagicProtection", 3 // Absolute Magic Protection
		case level >= 3 || level == 2:
			return "EffectMagicProtection", level // Protection From Magic
		default:
			return "EffectDefenseShield", level
		}
	case 18: // Berserk/Trance/Prayer
		nameUp := strings.ToUpper(s.Name)
		if strings.Contains(nameUp, "BERSERK") {
			return "EffectBerserk", 1
		}
		if strings.Contains(nameUp, "TRANCE") {
			return "EffectBerserk", 2
		}
		return "", 0
	case 28: // Armor Break
		return "", 0 // Direct damage effect, not status
	case 29: // Cancellation
		return "", 0
	case 31: // Inhibition Casting
		return "EffectInhibition", s.Eff1
	case 50: // Magic Drain
		return "", 0
	case 51: // Mantles
		return "EffectDefenseShield", s.Eff1
	}
	return "", 0
}

// calcDamage extracts min/max damage from the effect groups.
// Damage spells use dice notation: Eff1 * d(Eff2) + Eff3.
func calcDamage(s rawSpell) (minDmg, maxDmg int) {
	spType := mapSpellType(s)
	if spType != "SpellTypeDamage" && spType != "SpellTypeAOE" {
		return 0, 0
	}

	// Sum damage from all three effect groups where the dice values > 0.
	// Each group: dice_count(Eff_n), dice_range(Eff_n+1), bonus(Eff_n+2)
	// The "7" prefix in many fields means "use magic-level scaling" (e.g., 7 6 17).
	// We compute base damage from the dice notation.
	groups := [][3]int{
		{s.Eff1, s.Eff2, s.Eff3},
		{s.Eff4, s.Eff5, s.Eff6},
		{s.Eff7, s.Eff8, s.Eff9},
	}

	for _, g := range groups {
		diceCount, diceRange, bonus := g[0], g[1], g[2]
		if diceCount <= 0 || diceRange <= 0 {
			// Some spells use bonus-only or are non-damage effect groups
			if bonus > 0 && diceCount > 0 {
				minDmg += diceCount + bonus
				maxDmg += diceCount + bonus
			}
			continue
		}
		minDmg += diceCount + bonus
		maxDmg += diceCount*diceRange + bonus
	}

	return minDmg, maxDmg
}

// calcHealAmount extracts healing value from the spell.
func calcHealAmount(s rawSpell) int {
	spType := mapSpellType(s)
	if spType != "SpellTypeHeal" {
		return 0
	}

	// For heal spells, effect group 1 is typically: dice_count, dice_range, bonus
	diceCount, diceRange, bonus := s.Eff1, s.Eff2, s.Eff3
	if diceCount <= 0 {
		return 0
	}
	if diceRange <= 0 {
		return diceCount + bonus
	}
	// Average heal = (min + max) / 2; min = count + bonus, max = count*range + bonus
	avg := (diceCount + bonus + diceCount*diceRange + bonus) / 2
	if avg <= 0 {
		avg = diceCount + bonus
	}

	// Add second effect group if present
	if s.Eff4 > 0 && s.Eff5 > 0 {
		avg2 := (s.Eff4 + s.Eff6 + s.Eff4*s.Eff5 + s.Eff6) / 2
		avg += avg2
	}

	return avg
}

// calcRadius determines AoE radius from range values and effect groups.
func calcRadius(s rawSpell) int {
	spType := mapSpellType(s)
	if spType != "SpellTypeAOE" {
		return 0
	}

	// For AoE spells, the range determines how far the caster can cast,
	// and some effect groups contain area info.
	// Use Range1 as the radius for AoE spells, capped reasonably.
	r := s.Range1
	if r > 5 {
		r = 5
	}
	if r < 1 {
		r = 1
	}
	return r
}

// calcRange determines the casting range in tiles.
func calcRange(s rawSpell) int {
	// Range values in cfg: typically Range1 and Range2 are the same.
	// For self-targeted spells (buffs on self), range is 0.
	spType := mapSpellType(s)

	switch spType {
	case "SpellTypeHeal":
		// Most heals are self-targeted in original HB
		if s.Range1 <= 1 {
			return 0
		}
		return s.Range1
	case "SpellTypeBuff":
		if s.Range1 <= 1 {
			return 0
		}
		return s.Range1
	case "SpellTypeTeleport":
		return 0
	case "SpellTypeSummon":
		return s.Range1
	}

	// For offensive spells, use the range value, minimum 1
	r := s.Range1
	if r < 1 {
		r = 1
	}
	return r
}

// calcCooldown returns cooldown in ms from the Delay field (seconds).
func calcCooldown(s rawSpell) int {
	if s.Delay <= 0 {
		// Default cooldowns based on spell type
		spType := mapSpellType(s)
		switch spType {
		case "SpellTypeDamage":
			return 2000
		case "SpellTypeAOE":
			return 4000
		case "SpellTypeHeal":
			return 3000
		case "SpellTypeBuff":
			return 10000
		case "SpellTypeDebuff":
			return 8000
		case "SpellTypeSummon":
			return 30000
		case "SpellTypeTeleport":
			return 60000
		default:
			return 5000
		}
	}
	return s.Delay * 1000
}

// calcCastTime returns cast time in ms based on spell tier.
func calcCastTime(s rawSpell) int {
	if s.Mana <= 20 {
		return 500
	}
	if s.Mana <= 40 {
		return 700
	}
	if s.Mana <= 60 {
		return 900
	}
	if s.Mana <= 100 {
		return 1100
	}
	if s.Mana <= 150 {
		return 1300
	}
	return 1500
}

// calcDuration returns duration in seconds from the Last field.
func calcDuration(s rawSpell) int {
	if s.Last > 0 {
		return s.Last
	}
	// Some buffs have implicit duration
	spType := mapSpellType(s)
	switch spType {
	case "SpellTypeBuff":
		return 60
	case "SpellTypeDebuff":
		return 30
	}
	return 0
}

// cleanName converts hyphenated name to spaces and handles special chars.
func cleanName(name string) string {
	n := strings.ReplaceAll(name, "-", " ")
	n = strings.ReplaceAll(n, ".", "")
	n = strings.ReplaceAll(n, "'", "'")
	// Fix "s " at beginning from possessives like "Forge s Breath" -> "Forge's Breath"
	n = strings.ReplaceAll(n, " s ", "'s ")
	return n
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

func generate(spells []rawSpell) {
	p := func(format string, args ...any) {
		fmt.Printf(format, args...)
	}

	p("// Code generated by tools/magicimport; DO NOT EDIT.\n")
	p("//\n")
	p("// Source: helbreath-v3.82-master/Server/Core/Magic.cfg\n")
	p("// Contains all %d original Helbreath spells.\n", len(spells))
	p("package magic\n\n")
	p("// initGeneratedSpells registers all spells parsed from the original Magic.cfg.\n")
	p("// Spells are only added if the ID is not already present in SpellDB,\n")
	p("// allowing hand-written definitions to take precedence.\n")
	p("func init() {\n")

	for _, s := range spells {
		spType := mapSpellType(s)
		element := mapElement(s.Attr)
		minDmg, maxDmg := calcDamage(s)
		healAmt := calcHealAmount(s)
		radius := calcRadius(s)
		rng := calcRange(s)
		cooldown := calcCooldown(s)
		castTime := calcCastTime(s)
		duration := calcDuration(s)
		effectName, effectLevel := mapApplyEffect(s)

		name := cleanName(s.Name)

		// Tick damage for poison spells
		tickDmg := 0
		tickInterval := 0
		if effectName == "EffectPoison" {
			tickDmg = s.Eff2 // dice range as tick damage
			if tickDmg <= 0 {
				tickDmg = 5
			}
			tickInterval = 3000
		}

		// Buff stats for buff spells
		buffStat := 0
		buffAmount := 0
		if spType == "SpellTypeBuff" {
			switch s.CfgType {
			case 11: // Defense buffs
				// EffectValue is the buff amount
				if s.Eff2 > 0 {
					buffStat = 2 // VIT
					buffAmount = s.Eff2 / 10
					if buffAmount < 1 {
						buffAmount = s.Eff1
					}
				}
			case 18: // Prayer/Berserk
				nameUp := strings.ToUpper(s.Name)
				if strings.Contains(nameUp, "BERSERK") || strings.Contains(nameUp, "TRANCE") {
					buffStat = 1 // STR
					buffAmount = s.Eff1
				} else if strings.Contains(nameUp, "PRAYER") {
					buffStat = 2 // VIT
					buffAmount = s.Eff2
				}
			}
		}
		if spType == "SpellTypeDebuff" {
			switch s.CfgType {
			case 12: // Hold/Paralyze
				buffStat = 3 // DEX
				buffAmount = -s.Eff1 * 5
				if buffAmount == 0 {
					buffAmount = -10
				}
			}
		}

		// Cost to learn: -1 means not purchasable (quest/special)
		learnCost := s.Cost
		if learnCost < 0 {
			learnCost = 0
		}

		// ReqLevel approximation from ReqINT
		reqLevel := 0
		if s.ReqINT <= 20 {
			reqLevel = 1
		} else if s.ReqINT <= 30 {
			reqLevel = 5
		} else if s.ReqINT <= 50 {
			reqLevel = 10
		} else if s.ReqINT <= 80 {
			reqLevel = 15
		} else if s.ReqINT <= 120 {
			reqLevel = 20
		} else if s.ReqINT <= 160 {
			reqLevel = 25
		} else if s.ReqINT <= 200 {
			reqLevel = 30
		} else {
			reqLevel = 35
		}

		// SpriteID = spell ID (client can map these)
		spriteID := s.ID
		// SoundID based on element
		soundID := 1
		switch s.Attr {
		case 3: // fire
			soundID = 4
		case 4: // ice
			soundID = 46
		case 2: // lightning
			soundID = 5
		case 1: // earth
			soundID = 7
		}
		if spType == "SpellTypeHeal" {
			soundID = 45
		}

		p("\tif SpellDB[%d] == nil {\n", s.ID)
		p("\t\tSpellDB[%d] = &SpellDef{\n", s.ID)
		p("\t\t\tID: %d, Name: %q,\n", s.ID, name)
		p("\t\t\tType: %s, Element: %s,\n", spType, element)
		p("\t\t\tManaCost: %d, CastTime: %d, Cooldown: %d, Range: %d,\n",
			s.Mana, castTime, cooldown, rng)

		if radius > 0 {
			p("\t\t\tRadius: %d,\n", radius)
		}
		if minDmg > 0 || maxDmg > 0 {
			p("\t\t\tMinDamage: %d, MaxDamage: %d,\n", minDmg, maxDmg)
		}
		if healAmt > 0 {
			p("\t\t\tHealAmount: %d,\n", healAmt)
		}
		if duration > 0 {
			p("\t\t\tDuration: %d,\n", duration)
		}
		if buffStat > 0 {
			p("\t\t\tBuffStat: %d, BuffAmount: %d,\n", buffStat, buffAmount)
		}
		p("\t\t\tReqLevel: %d, ReqMAG: %d, ReqINT: %d,\n",
			reqLevel, s.ReqINT, s.ReqINT)
		p("\t\t\tSpriteID: %d, SoundID: %d,\n", spriteID, soundID)

		if effectName != "" && effectLevel > 0 {
			p("\t\t\tApplyEffect: %s, EffectLevel: %d,\n", effectName, effectLevel)
		}
		if tickDmg > 0 {
			p("\t\t\tTickDamage: %d, TickIntervalMs: %d,\n", tickDmg, tickInterval)
		}

		p("\t\t}\n")
		p("\t}\n\n")
	}

	p("}\n")
}
