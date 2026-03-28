package magic

import "testing"

func TestCheckMagicResistanceBalanced(t *testing.T) {
	// Equal MAG and INT: base 50%, spell level 0 => 50% resist
	resistCount := 0
	trials := 10000
	for i := 0; i < trials; i++ {
		if CheckMagicResistance(20, 20, 0) {
			resistCount++
		}
	}

	rate := float64(resistCount) / float64(trials) * 100
	if rate < 40 || rate > 60 {
		t.Errorf("Expected ~50%% resist rate with equal stats, got %.1f%%", rate)
	}
}

func TestCheckMagicResistanceHighINT(t *testing.T) {
	// Target has much higher INT: 50 + (30-10)*2 = 90% base
	resistCount := 0
	trials := 10000
	for i := 0; i < trials; i++ {
		if CheckMagicResistance(10, 30, 0) {
			resistCount++
		}
	}

	rate := float64(resistCount) / float64(trials) * 100
	if rate < 80 {
		t.Errorf("Expected high resist rate with high INT, got %.1f%%", rate)
	}
}

func TestCheckMagicResistanceHighMAG(t *testing.T) {
	// Attacker has much higher MAG: 50 + (10-30)*2 = 10% base
	resistCount := 0
	trials := 10000
	for i := 0; i < trials; i++ {
		if CheckMagicResistance(30, 10, 0) {
			resistCount++
		}
	}

	rate := float64(resistCount) / float64(trials) * 100
	if rate > 20 {
		t.Errorf("Expected low resist rate with high MAG, got %.1f%%", rate)
	}
}

func TestCheckMagicResistanceClamped(t *testing.T) {
	// Extreme case: should clamp to 5-95%
	resistCount := 0
	trials := 10000
	for i := 0; i < trials; i++ {
		// 50 + (100-0)*2 = 250 -> clamped to 95
		if CheckMagicResistance(0, 100, 0) {
			resistCount++
		}
	}
	rate := float64(resistCount) / float64(trials) * 100
	if rate < 90 {
		t.Errorf("Expected ~95%% (clamped high), got %.1f%%", rate)
	}

	// 50 + (0-100)*2 = -150 -> clamped to 5
	resistCount = 0
	for i := 0; i < trials; i++ {
		if CheckMagicResistance(100, 0, 0) {
			resistCount++
		}
	}
	rate = float64(resistCount) / float64(trials) * 100
	if rate > 15 {
		t.Errorf("Expected ~5%% (clamped low), got %.1f%%", rate)
	}
}

func TestCheckMagicResistanceSpellLevel(t *testing.T) {
	// Spell level reduces resist chance: 50 - 10*3 = 20%
	resistCount := 0
	trials := 10000
	for i := 0; i < trials; i++ {
		if CheckMagicResistance(20, 20, 10) {
			resistCount++
		}
	}

	rate := float64(resistCount) / float64(trials) * 100
	if rate < 12 || rate > 28 {
		t.Errorf("Expected ~20%% resist with spell level 10, got %.1f%%", rate)
	}
}

func TestCalcMagicDamageReduction(t *testing.T) {
	tests := []struct {
		level    int
		expected int
	}{
		{0, 0},
		{1, 15},
		{2, 25},
		{3, 35},
		{-1, 0},
	}

	for _, tt := range tests {
		got := CalcMagicDamageReduction(tt.level)
		if got != tt.expected {
			t.Errorf("CalcMagicDamageReduction(%d) = %d, expected %d", tt.level, got, tt.expected)
		}
	}
}

func TestCalcDefenseShieldAbsorb(t *testing.T) {
	tests := []struct {
		level    int
		expected int
	}{
		{0, 0},
		{1, 5},
		{2, 10},
		{3, 15},
		{-1, 0},
	}

	for _, tt := range tests {
		got := CalcDefenseShieldAbsorb(tt.level)
		if got != tt.expected {
			t.Errorf("CalcDefenseShieldAbsorb(%d) = %d, expected %d", tt.level, got, tt.expected)
		}
	}
}
