package skills

import mrand "math/rand"

// SkillID identifies a skill type.
type SkillID int

const (
	SkillAttack     SkillID = 1
	SkillMagic      SkillID = 2
	SkillArchery    SkillID = 3
	SkillDefense    SkillID = 4
	SkillShield     SkillID = 5
	SkillMining     SkillID = 6
	SkillFishing    SkillID = 7
	SkillFarming    SkillID = 8
	SkillAlchemy    SkillID = 9
	SkillBlacksmith SkillID = 10
	SkillCooking    SkillID = 11
	SkillTailoring  SkillID = 12
	SkillTaming     SkillID = 13
	SkillHandCombat SkillID = 14
	SkillSword      SkillID = 15
	SkillAxe        SkillID = 16
	SkillHammer     SkillID = 17
	SkillStaff      SkillID = 18
	SkillDagger     SkillID = 19
	SkillBow        SkillID = 20
	SkillPretend    SkillID = 21
	SkillManaMastery SkillID = 22
	SkillStealth    SkillID = 23
	SkillHerblore   SkillID = 24
)

// MaxMastery is the maximum mastery per skill.
const MaxMastery = 100

// MasteryCap is the total mastery across all skills.
const MasteryCap = 700

// SkillDef defines a skill.
type SkillDef struct {
	ID          SkillID
	Name        string
	Description string
	Category    string // "combat", "gathering", "crafting", "passive"
}

// SkillDefs contains all skill definitions.
var SkillDefs = map[SkillID]*SkillDef{
	SkillAttack:      {ID: SkillAttack, Name: "Attack", Description: "Melee attack proficiency", Category: "combat"},
	SkillMagic:       {ID: SkillMagic, Name: "Magic", Description: "Spell casting proficiency", Category: "combat"},
	SkillArchery:     {ID: SkillArchery, Name: "Archery", Description: "Ranged combat with bows", Category: "combat"},
	SkillDefense:     {ID: SkillDefense, Name: "Defense", Description: "Damage reduction", Category: "combat"},
	SkillShield:      {ID: SkillShield, Name: "Shield", Description: "Shield blocking", Category: "combat"},
	SkillMining:      {ID: SkillMining, Name: "Mining", Description: "Mine ores from mineral deposits", Category: "gathering"},
	SkillFishing:     {ID: SkillFishing, Name: "Fishing", Description: "Catch fish from water", Category: "gathering"},
	SkillFarming:     {ID: SkillFarming, Name: "Farming", Description: "Plant and harvest crops", Category: "gathering"},
	SkillAlchemy:     {ID: SkillAlchemy, Name: "Alchemy", Description: "Create potions and elixirs", Category: "crafting"},
	SkillBlacksmith:  {ID: SkillBlacksmith, Name: "Blacksmithing", Description: "Forge weapons and armor", Category: "crafting"},
	SkillCooking:     {ID: SkillCooking, Name: "Cooking", Description: "Prepare food items", Category: "crafting"},
	SkillTailoring:   {ID: SkillTailoring, Name: "Tailoring", Description: "Craft cloth armor and capes", Category: "crafting"},
	SkillTaming:      {ID: SkillTaming, Name: "Taming", Description: "Tame wild creatures", Category: "gathering"},
	SkillHandCombat:  {ID: SkillHandCombat, Name: "Hand Combat", Description: "Unarmed fighting", Category: "combat"},
	SkillSword:       {ID: SkillSword, Name: "Swordsmanship", Description: "Sword proficiency", Category: "combat"},
	SkillAxe:         {ID: SkillAxe, Name: "Axe Mastery", Description: "Axe proficiency", Category: "combat"},
	SkillHammer:      {ID: SkillHammer, Name: "Hammer Mastery", Description: "Hammer proficiency", Category: "combat"},
	SkillStaff:       {ID: SkillStaff, Name: "Staff Mastery", Description: "Staff proficiency", Category: "combat"},
	SkillDagger:      {ID: SkillDagger, Name: "Dagger Mastery", Description: "Dagger proficiency", Category: "combat"},
	SkillBow:         {ID: SkillBow, Name: "Bow Mastery", Description: "Bow proficiency", Category: "combat"},
	SkillPretend:     {ID: SkillPretend, Name: "Pretend", Description: "Disguise and deception", Category: "passive"},
	SkillManaMastery: {ID: SkillManaMastery, Name: "Mana Mastery", Description: "Reduced mana costs", Category: "passive"},
	SkillStealth:     {ID: SkillStealth, Name: "Stealth", Description: "Move undetected", Category: "passive"},
	SkillHerblore:    {ID: SkillHerblore, Name: "Herblore", Description: "Identify and use herbs", Category: "gathering"},
}

// GetSkillDef returns a skill definition by ID.
func GetSkillDef(id SkillID) *SkillDef {
	return SkillDefs[id]
}

// PlayerSkills tracks a player's skill masteries.
type PlayerSkills struct {
	Masteries map[SkillID]int // skill -> mastery level (0-100)
}

// NewPlayerSkills creates a new skill tracker.
func NewPlayerSkills() *PlayerSkills {
	return &PlayerSkills{
		Masteries: make(map[SkillID]int),
	}
}

// GetMastery returns the mastery level for a skill.
func (ps *PlayerSkills) GetMastery(skill SkillID) int {
	return ps.Masteries[skill]
}

// TotalMastery returns the sum of all skill masteries.
func (ps *PlayerSkills) TotalMastery() int {
	total := 0
	for _, m := range ps.Masteries {
		total += m
	}
	return total
}

// CanGainMastery checks if a skill can gain more mastery points.
func (ps *PlayerSkills) CanGainMastery(skill SkillID) bool {
	if ps.Masteries[skill] >= MaxMastery {
		return false
	}
	return ps.TotalMastery() < MasteryCap
}

// GainMastery attempts to increase mastery for a skill by 1.
// Returns the new mastery level and whether it increased.
func (ps *PlayerSkills) GainMastery(skill SkillID) (int, bool) {
	if !ps.CanGainMastery(skill) {
		return ps.Masteries[skill], false
	}
	ps.Masteries[skill]++
	return ps.Masteries[skill], true
}

// SetMastery sets the mastery level for a skill (for loading from DB).
func (ps *PlayerSkills) SetMastery(skill SkillID, level int) {
	if level < 0 {
		level = 0
	}
	if level > MaxMastery {
		level = MaxMastery
	}
	ps.Masteries[skill] = level
}

// SkillCheck performs a skill check: roll 1d100 vs mastery.
// Returns true if the roll is <= mastery (success).
// difficulty is subtracted from mastery for harder checks.
func SkillCheck(mastery, difficulty int) bool {
	effective := mastery - difficulty
	if effective < 1 {
		effective = 1
	}
	if effective > 99 {
		effective = 99
	}
	return randInt(100) < effective
}

// randInt is overridable for testing.
var randInt = defaultRandInt

func defaultRandInt(n int) int {
	return mrand.Intn(n)
}
