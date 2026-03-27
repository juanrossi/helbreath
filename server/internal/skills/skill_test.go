package skills

import "testing"

func TestGetSkillDef(t *testing.T) {
	def := GetSkillDef(SkillAttack)
	if def == nil {
		t.Fatal("Expected to find Attack skill")
	}
	if def.Name != "Attack" {
		t.Errorf("Expected name=Attack, got %s", def.Name)
	}
	if def.Category != "combat" {
		t.Errorf("Expected category=combat, got %s", def.Category)
	}
}

func TestGetSkillDefAll(t *testing.T) {
	// Verify all 24 skills exist
	if len(SkillDefs) != 24 {
		t.Errorf("Expected 24 skills, got %d", len(SkillDefs))
	}

	for id, def := range SkillDefs {
		if def.ID != id {
			t.Errorf("Skill %d has mismatched ID=%d", id, def.ID)
		}
		if def.Name == "" {
			t.Errorf("Skill %d has empty name", id)
		}
		if def.Category == "" {
			t.Errorf("Skill %d has empty category", id)
		}
	}
}

func TestGetSkillDefNotFound(t *testing.T) {
	if GetSkillDef(999) != nil {
		t.Error("Expected nil for non-existent skill")
	}
}

func TestNewPlayerSkills(t *testing.T) {
	ps := NewPlayerSkills()
	if ps == nil {
		t.Fatal("NewPlayerSkills returned nil")
	}
	if ps.TotalMastery() != 0 {
		t.Errorf("Expected 0 total mastery, got %d", ps.TotalMastery())
	}
}

func TestGetSetMastery(t *testing.T) {
	ps := NewPlayerSkills()
	ps.SetMastery(SkillAttack, 50)

	if ps.GetMastery(SkillAttack) != 50 {
		t.Errorf("Expected mastery=50, got %d", ps.GetMastery(SkillAttack))
	}
	if ps.GetMastery(SkillMagic) != 0 {
		t.Errorf("Expected unset mastery=0, got %d", ps.GetMastery(SkillMagic))
	}
}

func TestSetMasteryClamped(t *testing.T) {
	ps := NewPlayerSkills()
	ps.SetMastery(SkillAttack, -10)
	if ps.GetMastery(SkillAttack) != 0 {
		t.Errorf("Negative mastery should clamp to 0, got %d", ps.GetMastery(SkillAttack))
	}

	ps.SetMastery(SkillAttack, 200)
	if ps.GetMastery(SkillAttack) != MaxMastery {
		t.Errorf("Mastery above 100 should clamp to %d, got %d", MaxMastery, ps.GetMastery(SkillAttack))
	}
}

func TestTotalMastery(t *testing.T) {
	ps := NewPlayerSkills()
	ps.SetMastery(SkillAttack, 50)
	ps.SetMastery(SkillDefense, 30)
	ps.SetMastery(SkillMining, 20)

	if ps.TotalMastery() != 100 {
		t.Errorf("Expected total mastery=100, got %d", ps.TotalMastery())
	}
}

func TestGainMastery(t *testing.T) {
	ps := NewPlayerSkills()
	ps.SetMastery(SkillAttack, 49)

	newLevel, gained := ps.GainMastery(SkillAttack)
	if !gained {
		t.Error("Should gain mastery")
	}
	if newLevel != 50 {
		t.Errorf("Expected new mastery=50, got %d", newLevel)
	}
}

func TestGainMasteryAtMax(t *testing.T) {
	ps := NewPlayerSkills()
	ps.SetMastery(SkillAttack, MaxMastery)

	_, gained := ps.GainMastery(SkillAttack)
	if gained {
		t.Error("Should not gain mastery at max")
	}
}

func TestGainMasteryAtCap(t *testing.T) {
	ps := NewPlayerSkills()
	// Fill up to cap
	ps.SetMastery(SkillAttack, 100)
	ps.SetMastery(SkillDefense, 100)
	ps.SetMastery(SkillMagic, 100)
	ps.SetMastery(SkillArchery, 100)
	ps.SetMastery(SkillShield, 100)
	ps.SetMastery(SkillSword, 100)
	ps.SetMastery(SkillAxe, 100)

	if ps.TotalMastery() != 700 {
		t.Errorf("Expected total=700, got %d", ps.TotalMastery())
	}

	_, gained := ps.GainMastery(SkillMining)
	if gained {
		t.Error("Should not gain mastery when at cap")
	}
}

func TestCanGainMastery(t *testing.T) {
	ps := NewPlayerSkills()
	if !ps.CanGainMastery(SkillAttack) {
		t.Error("Should be able to gain mastery at 0")
	}

	ps.SetMastery(SkillAttack, 100)
	if ps.CanGainMastery(SkillAttack) {
		t.Error("Should not gain mastery at max")
	}
}

func TestSkillCheck(t *testing.T) {
	// Override randInt for deterministic testing
	oldRandInt := randInt
	defer func() { randInt = oldRandInt }()

	// Roll 0 - always succeeds when mastery > 0
	randInt = func(n int) int { return 0 }
	if !SkillCheck(50, 0) {
		t.Error("Roll 0 should succeed with mastery 50")
	}

	// Roll 99 - always fails unless mastery-difficulty >= 99
	randInt = func(n int) int { return 99 }
	if SkillCheck(50, 0) {
		t.Error("Roll 99 should fail with mastery 50")
	}

	// Effective clamped to 1 minimum
	randInt = func(n int) int { return 0 }
	if !SkillCheck(0, 100) {
		t.Error("Roll 0 should succeed even with 0 effective mastery (clamped to 1)")
	}

	// Effective clamped to 99 maximum
	randInt = func(n int) int { return 98 }
	if !SkillCheck(200, 0) {
		t.Error("Roll 98 should succeed with effective 99 (clamped)")
	}
}

func TestSkillCategories(t *testing.T) {
	combatSkills := []SkillID{SkillAttack, SkillMagic, SkillArchery, SkillDefense, SkillShield,
		SkillHandCombat, SkillSword, SkillAxe, SkillHammer, SkillStaff, SkillDagger, SkillBow}
	for _, id := range combatSkills {
		def := GetSkillDef(id)
		if def.Category != "combat" {
			t.Errorf("Skill %s should be combat, got %s", def.Name, def.Category)
		}
	}

	gatherSkills := []SkillID{SkillMining, SkillFishing, SkillFarming, SkillTaming, SkillHerblore}
	for _, id := range gatherSkills {
		def := GetSkillDef(id)
		if def.Category != "gathering" {
			t.Errorf("Skill %s should be gathering, got %s", def.Name, def.Category)
		}
	}

	craftSkills := []SkillID{SkillAlchemy, SkillBlacksmith, SkillCooking, SkillTailoring}
	for _, id := range craftSkills {
		def := GetSkillDef(id)
		if def.Category != "crafting" {
			t.Errorf("Skill %s should be crafting, got %s", def.Name, def.Category)
		}
	}
}
