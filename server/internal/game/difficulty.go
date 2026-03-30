package game

// Difficulty multipliers — adjust these to make the game easier or harder.
// Set via environment variable DIFFICULTY_MULTIPLIER (default "3" for 3x easier).
// A value of 1.0 = original C++ difficulty. Higher = easier for players.
var (
	// HitBonus is added to hit chance percentage (0 = no bonus).
	// At 3x easier: +30 hit chance makes most attacks land.
	HitBonus = 30

	// DamageMultiplier scales player damage output.
	// At 3x easier: players deal 3x damage.
	DamageMultiplier = 3

	// DropRateMultiplier scales loot drop chances.
	// At 3x easier: 3x more likely to get item drops.
	DropRateMultiplier = 3.0

	// XPMultiplier scales experience gained from kills.
	// At 3x easier: 3x faster leveling.
	XPMultiplier = 3.0

	// NPCDamageReduction reduces damage NPCs deal to players.
	// At 3x easier: NPCs deal 1/3 damage.
	NPCDamageReduction = 3
)
