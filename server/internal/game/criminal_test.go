package game

import "testing"

func TestGetCriminalStatusInnocent(t *testing.T) {
	status := GetCriminalStatus(0)
	if status.Tier != CriminalTierInnocent {
		t.Errorf("Expected tier %d (innocent), got %d", CriminalTierInnocent, status.Tier)
	}
	if status.Name != "Innocent" {
		t.Errorf("Expected name 'Innocent', got %q", status.Name)
	}
}

func TestGetCriminalStatusSuspect(t *testing.T) {
	for _, pk := range []int{1, 2} {
		status := GetCriminalStatus(pk)
		if status.Tier != CriminalTierSuspect {
			t.Errorf("PKCount %d: expected tier %d (suspect), got %d", pk, CriminalTierSuspect, status.Tier)
		}
		if status.Name != "Suspect" {
			t.Errorf("PKCount %d: expected name 'Suspect', got %q", pk, status.Name)
		}
	}
}

func TestGetCriminalStatusCriminal(t *testing.T) {
	for _, pk := range []int{3, 5, 7} {
		status := GetCriminalStatus(pk)
		if status.Tier != CriminalTierCriminal {
			t.Errorf("PKCount %d: expected tier %d (criminal), got %d", pk, CriminalTierCriminal, status.Tier)
		}
		if status.Name != "Criminal" {
			t.Errorf("PKCount %d: expected name 'Criminal', got %q", pk, status.Name)
		}
	}
}

func TestGetCriminalStatusMurderer(t *testing.T) {
	for _, pk := range []int{8, 10, 11} {
		status := GetCriminalStatus(pk)
		if status.Tier != CriminalTierMurderer {
			t.Errorf("PKCount %d: expected tier %d (murderer), got %d", pk, CriminalTierMurderer, status.Tier)
		}
		if status.Name != "Murderer" {
			t.Errorf("PKCount %d: expected name 'Murderer', got %q", pk, status.Name)
		}
	}
}

func TestGetCriminalStatusSlaughterer(t *testing.T) {
	for _, pk := range []int{12, 20, 100} {
		status := GetCriminalStatus(pk)
		if status.Tier != CriminalTierSlaughterer {
			t.Errorf("PKCount %d: expected tier %d (slaughterer), got %d", pk, CriminalTierSlaughterer, status.Tier)
		}
		if status.Name != "Slaughterer" {
			t.Errorf("PKCount %d: expected name 'Slaughterer', got %q", pk, status.Name)
		}
	}
}

func TestGetCriminalStatusNegativePK(t *testing.T) {
	status := GetCriminalStatus(-5)
	if status.Tier != CriminalTierInnocent {
		t.Errorf("Negative PK should be innocent, got tier %d", status.Tier)
	}
}

func TestIsCriminalThreshold(t *testing.T) {
	if IsCriminal(0) {
		t.Error("0 PK should not be criminal")
	}
	if IsCriminal(2) {
		t.Error("2 PK should not be criminal")
	}
	if !IsCriminal(3) {
		t.Error("3 PK should be criminal")
	}
	if !IsCriminal(12) {
		t.Error("12 PK should be criminal")
	}
}

func TestMaxLevelCap(t *testing.T) {
	p := makeTestPlayer()
	p.Level = MaxLevel - 1
	p.LUPool = 0
	p.Experience = XPForLevel(MaxLevel) + 1000

	changed := CheckLevelUp(p)
	if !changed {
		t.Error("Should have leveled up to MaxLevel")
	}
	if p.Level != MaxLevel {
		t.Errorf("Expected level %d, got %d", MaxLevel, p.Level)
	}

	// Give more XP - should NOT level past MaxLevel
	p.Experience = XPForLevel(MaxLevel) + XPForLevel(MaxLevel+1) + 999999
	changed = CheckLevelUp(p)
	if p.Level != MaxLevel {
		t.Errorf("Should not exceed level %d, got %d", MaxLevel, p.Level)
	}
}

func TestGizonPointConversion(t *testing.T) {
	p := makeTestPlayer()
	p.Level = MaxLevel
	p.GizonPoints = 0
	baseXP := XPForLevel(MaxLevel)
	// Give 35000 excess XP -> 3 Gizon points, 5000 remainder
	p.Experience = baseXP + 35000

	changed := CheckLevelUp(p)
	if !changed {
		t.Error("Should return true when Gizon points are awarded")
	}
	if p.GizonPoints != 3 {
		t.Errorf("Expected 3 Gizon points, got %d", p.GizonPoints)
	}
	if p.Level != MaxLevel {
		t.Errorf("Level should remain at %d, got %d", MaxLevel, p.Level)
	}
	expectedRemainderXP := baseXP + 5000
	if p.Experience != expectedRemainderXP {
		t.Errorf("Expected remainder XP %d, got %d", expectedRemainderXP, p.Experience)
	}
}

func TestGizonPointNoConversionBelowThreshold(t *testing.T) {
	p := makeTestPlayer()
	p.Level = MaxLevel
	p.GizonPoints = 0
	baseXP := XPForLevel(MaxLevel)
	// Give 9999 excess XP - not enough for 1 Gizon point
	p.Experience = baseXP + 9999

	changed := CheckLevelUp(p)
	if changed {
		t.Error("Should not return true when no Gizon points are awarded")
	}
	if p.GizonPoints != 0 {
		t.Errorf("Expected 0 Gizon points, got %d", p.GizonPoints)
	}
}

func TestGizonPointAccumulation(t *testing.T) {
	p := makeTestPlayer()
	p.Level = MaxLevel
	p.GizonPoints = 10
	baseXP := XPForLevel(MaxLevel)
	p.Experience = baseXP + 20000 // 2 more points

	CheckLevelUp(p)
	if p.GizonPoints != 12 {
		t.Errorf("Expected 12 Gizon points (10 + 2), got %d", p.GizonPoints)
	}
}

func TestStatCapMaxValue(t *testing.T) {
	if MaxStatValue != 200 {
		t.Errorf("MaxStatValue should be 200, got %d", MaxStatValue)
	}
}

func TestCalcDayNightBonusDayPhase(t *testing.T) {
	p := makeTestPlayer()

	// No weapon - no bonus
	bonus := CalcDayNightBonus(p, 0)
	if bonus != 0 {
		t.Errorf("Unarmed should have no day/night bonus, got %d", bonus)
	}
}

func TestCalcDayNightBonusNightPhase(t *testing.T) {
	p := makeTestPlayer()

	// No weapon - no bonus
	bonus := CalcDayNightBonus(p, 2)
	if bonus != 0 {
		t.Errorf("Unarmed should have no day/night bonus, got %d", bonus)
	}
}
