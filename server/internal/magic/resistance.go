package magic

import "math/rand"

// CheckMagicResistance returns true if the target resists the spell.
// Base chance: 50 + (targetINT - attackerMAG) * 2, clamped to 5-95%.
// Higher target INT makes them more likely to resist.
// Higher attacker MAG makes the spell harder to resist.
func CheckMagicResistance(attackerMAG, targetINT, spellLevel int) bool {
	resistChance := 50 + (targetINT-attackerMAG)*2

	// Spell level makes resistance harder (higher level spells are harder to resist)
	resistChance -= spellLevel * 3

	// Clamp to 5-95%
	if resistChance < 5 {
		resistChance = 5
	}
	if resistChance > 95 {
		resistChance = 95
	}

	return rand.Intn(100)+1 <= resistChance
}

// CalcMagicDamageReduction calculates the percentage of magic damage reduced
// by the MagicProtection effect. Level 1 = 15%, level 2 = 25%, level 3 = 35%.
func CalcMagicDamageReduction(protLevel int) int {
	if protLevel <= 0 {
		return 0
	}
	return 5 + protLevel*10
}

// CalcDefenseShieldAbsorb calculates the flat damage absorbed by DefenseShield.
// Level 1 = 5, level 2 = 10, level 3 = 15.
func CalcDefenseShieldAbsorb(shieldLevel int) int {
	if shieldLevel <= 0 {
		return 0
	}
	return shieldLevel * 5
}
