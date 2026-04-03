// Command itemimport parses Helbreath Item.cfg files and generates Go source
// code containing item definitions for the items package.
//
// Usage:
//
//	go run ./server/tools/itemimport/ > server/internal/items/itemdefs_gen.go
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

// rawItem holds all 24 fields parsed from a single "Item = " line, matching
// the C++ CGame config reader field order exactly (cases 3-26 in Game.cpp).
type rawItem struct {
	ID   int
	Name string

	// case 3:  m_cItemType
	ItemType int
	// case 4:  m_cEquipPos
	EquipPos int
	// case 5:  m_sItemEffectType
	EffectType int
	// case 6:  m_sItemEffectValue1
	EffectValue1 int
	// case 7:  m_sItemEffectValue2
	EffectValue2 int
	// case 8:  m_sItemEffectValue3
	EffectValue3 int
	// case 9:  m_sItemEffectValue4
	EffectValue4 int
	// case 10: m_sItemEffectValue5
	EffectValue5 int
	// case 11: m_sItemEffectValue6
	EffectValue6 int
	// case 12: m_wMaxLifeSpan
	MaxLifeSpan int
	// case 13: m_sSpecialEffect
	SpecialEffect int
	// case 14: m_sSprite
	Sprite int
	// case 15: m_sSpriteFrame
	SpriteFrame int
	// case 16: m_wPrice (abs value stored; negative = not for sale)
	Price    int
	ForSale  bool
	RawPrice int // original signed value
	// case 17: m_wWeight
	Weight int
	// case 18: m_cApprValue
	ApprValue int
	// case 19: m_cSpeed
	Speed int
	// case 20: m_sLevelLimit
	LevelLimit int
	// case 21: m_cGenderLimit
	GenderLimit int
	// case 22: m_sSpecialEffectValue1 (comment says "SM_HitRatio")
	SpecialEffectValue1 int
	// case 23: m_sSpecialEffectValue2 (comment says "L_HitRatio")
	SpecialEffectValue2 int
	// case 24: m_sRelatedSkill
	RelatedSkill int
	// case 25: m_cCategory
	Category int
	// case 26: m_cItemColor
	ItemColor int
}

// cfg file paths relative to the repository root.
var cfgFiles = []string{
	"helbreath-v3.82-master/Server/Core/Item.cfg",
	"helbreath-v3.82-master/Server/Core/Item2.cfg",
	"helbreath-v3.82-master/Server/Core/Item3.cfg",
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

	var items []rawItem

	for _, rel := range cfgFiles {
		path := filepath.Join(repoRoot, rel)
		parsed, err := parseCfgFile(path)
		if err != nil {
			log.Fatalf("parsing %s: %v", path, err)
		}
		items = append(items, parsed...)
	}

	// Sort by ID for stable output.
	sort.Slice(items, func(i, j int) bool { return items[i].ID < items[j].ID })

	// Deduplicate (later files override earlier ones if same ID).
	items = dedup(items)

	fmt.Fprintf(os.Stderr, "Parsed %d unique items\n", len(items))

	generate(items)
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

// parseCfgFile reads a single .cfg file and returns parsed items.
func parseCfgFile(path string) ([]rawItem, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var items []rawItem
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
		// Only process "Item = " or "Item  = " lines.
		if !strings.HasPrefix(trimmed, "Item") {
			continue
		}

		item, err := parseItemLine(trimmed)
		if err != nil {
			fmt.Fprintf(os.Stderr, "WARN: skipping line in %s: %v: %q\n",
				filepath.Base(path), err, trimmed)
			continue
		}
		items = append(items, item)
	}

	return items, scanner.Err()
}

// parseItemLine parses "Item = ID Name <24 numeric fields>".
func parseItemLine(line string) (rawItem, error) {
	// Strip "Item" prefix, whitespace, "=".
	rest := strings.TrimPrefix(line, "Item")
	rest = strings.TrimSpace(rest)
	if len(rest) == 0 || rest[0] != '=' {
		return rawItem{}, fmt.Errorf("missing '=' after Item")
	}
	rest = rest[1:]
	rest = strings.TrimSpace(rest)

	fields := strings.Fields(rest)
	if len(fields) < 26 { // ID + Name + 24 numeric
		return rawItem{}, fmt.Errorf("expected >=26 fields, got %d", len(fields))
	}

	id, err := atoi(fields[0])
	if err != nil {
		return rawItem{}, fmt.Errorf("bad ID %q: %w", fields[0], err)
	}
	name := fields[1]

	// Parse 24 numeric fields starting at index 2.
	nums := make([]int, 0, 24)
	for i := 2; i < len(fields) && len(nums) < 24; i++ {
		n, err := atoi(fields[i])
		if err != nil {
			return rawItem{}, fmt.Errorf("field[%d] %q: %w", i, fields[i], err)
		}
		nums = append(nums, n)
	}

	if len(nums) < 24 {
		return rawItem{}, fmt.Errorf("expected 24 numeric fields, got %d", len(nums))
	}

	rawPrice := nums[13]
	price := rawPrice
	forSale := true
	if price < 0 {
		price = -price
		forSale = false
	}

	return rawItem{
		ID:                  id,
		Name:                name,
		ItemType:            nums[0],  // m_cItemType
		EquipPos:            nums[1],  // m_cEquipPos
		EffectType:          nums[2],  // m_sItemEffectType
		EffectValue1:        nums[3],  // m_sItemEffectValue1
		EffectValue2:        nums[4],  // m_sItemEffectValue2
		EffectValue3:        nums[5],  // m_sItemEffectValue3
		EffectValue4:        nums[6],  // m_sItemEffectValue4
		EffectValue5:        nums[7],  // m_sItemEffectValue5
		EffectValue6:        nums[8],  // m_sItemEffectValue6
		MaxLifeSpan:         nums[9],  // m_wMaxLifeSpan
		SpecialEffect:       nums[10], // m_sSpecialEffect
		Sprite:              nums[11], // m_sSprite
		SpriteFrame:         nums[12], // m_sSpriteFrame
		Price:               price,
		ForSale:             forSale,
		RawPrice:            rawPrice,
		Weight:              nums[14], // m_wWeight
		ApprValue:           nums[15], // m_cApprValue
		Speed:               nums[16], // m_cSpeed
		LevelLimit:          nums[17], // m_sLevelLimit
		GenderLimit:         nums[18], // m_cGenderLimit
		SpecialEffectValue1: nums[19], // m_sSpecialEffectValue1
		SpecialEffectValue2: nums[20], // m_sSpecialEffectValue2
		RelatedSkill:        nums[21], // m_sRelatedSkill
		Category:            nums[22], // m_cCategory
		ItemColor:           nums[23], // m_cItemColor
	}, nil
}

func atoi(s string) (int, error) {
	return strconv.Atoi(strings.TrimSpace(s))
}

func dedup(items []rawItem) []rawItem {
	seen := map[int]int{}
	var result []rawItem
	for _, it := range items {
		if idx, ok := seen[it.ID]; ok {
			result[idx] = it
		} else {
			seen[it.ID] = len(result)
			result = append(result, it)
		}
	}
	return result
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

func generate(items []rawItem) {
	p := func(format string, args ...any) {
		fmt.Printf(format, args...)
	}

	p("// Code generated by tools/itemimport; DO NOT EDIT.\n")
	p("//\n")
	p("// Source: helbreath-v3.82-master/Server/Core/Item*.cfg\n")
	p("package items\n\n")
	p("func init() {\n")

	for _, it := range items {
		itemType := mapItemType(it)
		equipSlot := mapEquipSlot(it)
		twoHanded := it.EquipPos == 9

		// MaxStack: equipment = 1, consumables/misc = 20.
		maxStack := 1
		if equipSlot == "EquipNone" {
			maxStack = 20
		}

		// Durability from MaxLifeSpan for equipment.
		durability := 0
		if equipSlot != "EquipNone" {
			durability = it.MaxLifeSpan
		}

		// Level requirement: negative means absolute min.
		reqLevel := it.LevelLimit
		if reqLevel < 0 {
			reqLevel = -reqLevel
		}

		// Weapon dice values.
		// For weapon effect types (1=slash, 3=ranged, 13=magic staff, 19=blood,
		// 20=stab/rapier, 24=xelima, 25=merien):
		//   EffectValue1 = dice throw count SM
		//   EffectValue2 = dice range SM
		//   EffectValue3 = flat bonus
		//   EffectValue4 = dice throw count L
		//   EffectValue5 = dice range L
		//   EffectValue6 = (extra)
		diceThrowSM, diceRangeSM := 0, 0
		diceThrowL, diceRangeL := 0, 0
		attackBonus := 0
		minDamage, maxDamage := 0, 0
		attackSpeed := 0
		weaponSkillID := 0
		dayBonus, nightBonus := 0, 0

		if isWeapon(it) {
			diceThrowSM = it.EffectValue1
			diceRangeSM = it.EffectValue2
			attackBonus = it.EffectValue3
			diceThrowL = it.EffectValue4
			diceRangeL = it.EffectValue5

			minDamage = diceThrowSM + attackBonus
			maxDamage = diceThrowSM*diceRangeSM + attackBonus

			// Speed: stored as a small number (0-40ish); multiply for ms.
			attackSpeed = it.Speed * 100

			weaponSkillID = mapWeaponSkill(it.Category)
			dayBonus = it.SpecialEffectValue1
			nightBonus = it.SpecialEffectValue2
		}

		// Defense for armor/shields: EffectValue1 is defense value when
		// EffectType == 2 (defense) or 14 (special defense) or 25 (merien).
		defense := 0
		if isArmor(it) || isShield(it) {
			defense = it.EffectValue1
		}

		// Potion effects.
		hpRestore, mpRestore, spRestore := mapPotionEffects(it)

		// SpriteID for client.
		spriteID := it.Sprite

		p("\tItemDB[%d] = &ItemDef{\n", it.ID)
		p("\t\tID: %d, Name: %q,\n", it.ID, it.Name)
		p("\t\tType: %s, EquipSlot: %s,\n", itemType, equipSlot)
		p("\t\tWeight: %d, Price: %d, MaxStack: %d, Durability: %d,\n",
			it.Weight, it.Price, maxStack, durability)
		p("\t\tSpriteID: %d,\n", spriteID)

		if isWeapon(it) {
			p("\t\tMinDamage: %d, MaxDamage: %d, AttackSpeed: %d,\n",
				minDamage, maxDamage, attackSpeed)
			p("\t\tDiceThrowSM: %d, DiceRangeSM: %d, DiceThrowL: %d, DiceRangeL: %d, AttackBonus: %d,\n",
				diceThrowSM, diceRangeSM, diceThrowL, diceRangeL, attackBonus)
			p("\t\tWeaponSkillID: %d, TwoHanded: %v,\n", weaponSkillID, twoHanded)
			if dayBonus != 0 || nightBonus != 0 {
				p("\t\tDayBonus: %d, NightBonus: %d,\n", dayBonus, nightBonus)
			}
		}

		if defense != 0 {
			p("\t\tDefense: %d,\n", defense)
		}

		if hpRestore != 0 || mpRestore != 0 || spRestore != 0 {
			p("\t\tHPRestore: %d, MPRestore: %d, SPRestore: %d,\n",
				hpRestore, mpRestore, spRestore)
		}

		if reqLevel != 0 {
			p("\t\tReqLevel: %d,\n", reqLevel)
		}

		p("\t\tApprIndex: %d,\n", it.ApprValue)
		p("\t}\n\n")
	}

	p("}\n")
}

// ---------------------------------------------------------------------------
// Classification helpers
// ---------------------------------------------------------------------------

func isWeapon(it rawItem) bool {
	if it.ItemType != 1 {
		return false
	}
	return it.EquipPos == 8 || it.EquipPos == 9
}

func isArmor(it rawItem) bool {
	if it.ItemType != 1 {
		return false
	}
	switch it.EquipPos {
	case 1, 2, 3, 4, 5, 12, 13:
		return true
	}
	return false
}

func isShield(it rawItem) bool {
	return it.ItemType == 1 && it.EquipPos == 7
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

func mapItemType(it rawItem) string {
	if it.ItemType == 1 {
		switch it.EquipPos {
		case 8, 9:
			return "ItemTypeWeapon"
		case 7:
			return "ItemTypeShield"
		case 1:
			return "ItemTypeHelm"
		case 2:
			return "ItemTypeBodyArmor"
		case 3:
			return "ItemTypeBodyArmor" // hauberk
		case 4:
			return "ItemTypeLeggings"
		case 5:
			return "ItemTypeBoots"
		case 12:
			return "ItemTypeCape"
		case 13:
			return "ItemTypeBodyArmor" // full outfit
		case 6:
			return "ItemTypeNecklace"
		case 10, 11:
			return "ItemTypeRing"
		}
	}

	switch it.ItemType {
	case 7:
		return "ItemTypePotion"
	}
	return "ItemTypeMaterial"
}

func mapEquipSlot(it rawItem) string {
	if it.ItemType != 1 {
		return "EquipNone"
	}
	switch it.EquipPos {
	case 8, 9:
		return "EquipWeapon"
	case 7:
		return "EquipShield"
	case 1:
		return "EquipHelm"
	case 2:
		return "EquipBody"
	case 3:
		return "EquipBody" // hauberk
	case 4:
		return "EquipLeggings"
	case 5:
		return "EquipBoots"
	case 12:
		return "EquipCape"
	case 13:
		return "EquipBody" // full outfit
	case 6:
		return "EquipNecklace"
	case 10:
		return "EquipRingLeft"
	case 11:
		return "EquipRingRight"
	default:
		return "EquipNone"
	}
}

// mapWeaponSkill maps the cfg m_cCategory to our WeaponSkillID.
func mapWeaponSkill(category int) int {
	switch category {
	case 1: // sword
		return 15
	case 3: // bow
		return 20
	case 5: // shield / dual-wield offhand
		return 11
	case 8: // staff / wand
		return 18
	case 9: // rapier / special
		return 19
	case 10: // axe
		return 16
	case 14: // hammer
		return 17
	default:
		return 14 // hand combat
	}
}

// mapPotionEffects returns HP, MP, SP restore values for consumable items.
// Only applies to CfgType 7 (food/potion).
//
// EffectType meanings for potions:
//
//	4 = HP restore (red potion) -- EffValue1 * EffValue2 dice
//	5 = MP restore (blue potion)
//	6 = SP restore (green potion)
//	7 = food (HP restore) -- EffValue1 * EffValue2
//	22 = all-stat restore (songpyon, ginseng, power green)
//	11 = special buff potion (summon, ogre, zerk, etc.)
//	12 = cosmetic
//	23 = potion of wonders
//	28 = unfreeze
//	33 = critical potion
func mapPotionEffects(it rawItem) (hp, mp, sp int) {
	if it.ItemType != 7 {
		return 0, 0, 0
	}
	switch it.EffectType {
	case 4: // red potion - HP
		hp = it.EffectValue1 * it.EffectValue2
		if hp == 0 {
			hp = it.EffectValue1
		}
	case 5: // blue potion - MP
		mp = it.EffectValue1 * it.EffectValue2
		if mp == 0 {
			mp = it.EffectValue1
		}
	case 6: // green potion - SP
		sp = it.EffectValue1 * it.EffectValue2
		if sp == 0 {
			sp = it.EffectValue1
		}
	case 7: // food - HP restore
		hp = it.EffectValue1 * it.EffectValue2
		if hp == 0 {
			hp = it.EffectValue1
		}
	case 22: // all-restore
		hp = it.EffectValue1
		mp = it.EffectValue1
		sp = it.EffectValue1
	}
	return
}
