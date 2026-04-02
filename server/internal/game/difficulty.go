package game

// Difficulty multipliers — adjust these to make the game easier or harder.
// Set via environment variable DIFFICULTY_MULTIPLIER (default "3" for 3x easier).
// A value of 1.0 = original C++ difficulty. Higher = easier for players.
var (
	// HitBonus is added to hit chance percentage (0 = no bonus).
	HitBonus = 50

	// DamageMultiplier scales player damage output.
	DamageMultiplier = 4

	// DropRateMultiplier scales loot drop chances.
	// Medium drop rate: 2x base.
	DropRateMultiplier = 2.0

	// XPMultiplier scales experience gained from kills.
	// High XP rate: 5x base for faster leveling to 180 cap.
	XPMultiplier = 5.0

	// NPCDamageReduction reduces damage NPCs deal to players.
	NPCDamageReduction = 3

	// EKMultiplier scales Enemy Kill point rewards.
	// Tiered: x10 base, x20 in crusade, x30 in special events.
	EKMultiplierBase    = 10
	EKMultiplierCrusade = 20
	EKMultiplierEvent   = 30
)
