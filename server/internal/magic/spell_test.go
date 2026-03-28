package magic

import "testing"

func TestGetSpellDef(t *testing.T) {
	// Existing spell
	spell := GetSpellDef(1)
	if spell == nil {
		t.Fatal("Expected to find Energy Bolt (ID=1)")
	}
	if spell.Name != "Energy Bolt" {
		t.Errorf("Expected name=Energy Bolt, got %s", spell.Name)
	}
	if spell.Type != SpellTypeDamage {
		t.Errorf("Expected type=Damage, got %d", spell.Type)
	}
	if spell.Element != ElementLight {
		t.Errorf("Expected element=Light, got %d", spell.Element)
	}
	if spell.ManaCost != 8 {
		t.Errorf("Expected mana cost=8, got %d", spell.ManaCost)
	}

	// Non-existent
	if GetSpellDef(999) != nil {
		t.Error("Expected nil for non-existent spell")
	}
}

func TestSpellTypes(t *testing.T) {
	// Check all spell types exist in DB
	tests := []struct {
		id       int
		name     string
		spType   SpellType
		element  SpellElement
	}{
		{1, "Energy Bolt", SpellTypeDamage, ElementLight},
		{3, "Fireball", SpellTypeDamage, ElementFire},
		{5, "Ice Strike", SpellTypeDamage, ElementIce},
		{10, "Fire Wall", SpellTypeAOE, ElementFire},
		{11, "Blizzard", SpellTypeAOE, ElementIce},
		{12, "Meteor Strike", SpellTypeAOE, ElementFire},
		{20, "Heal", SpellTypeHeal, ElementNone},
		{21, "Greater Heal", SpellTypeHeal, ElementNone},
		{22, "Divine Heal", SpellTypeHeal, ElementNone},
		{30, "Protection", SpellTypeBuff, ElementNone},
		{31, "Strength", SpellTypeBuff, ElementNone},
		{32, "Haste", SpellTypeBuff, ElementNone},
		{40, "Slow", SpellTypeDebuff, ElementIce},
		{41, "Weaken", SpellTypeDebuff, ElementNone},
	}

	for _, tt := range tests {
		spell := GetSpellDef(tt.id)
		if spell == nil {
			t.Errorf("Spell %d (%s) not found", tt.id, tt.name)
			continue
		}
		if spell.Name != tt.name {
			t.Errorf("ID %d: expected name=%s, got %s", tt.id, tt.name, spell.Name)
		}
		if spell.Type != tt.spType {
			t.Errorf("ID %d: expected type=%d, got %d", tt.id, tt.spType, spell.Type)
		}
		if spell.Element != tt.element {
			t.Errorf("ID %d: expected element=%d, got %d", tt.id, tt.element, spell.Element)
		}
	}
}

func TestSpellRequirements(t *testing.T) {
	// Fireball has level and MAG/INT requirements
	fb := GetSpellDef(3)
	if fb.ReqLevel != 10 {
		t.Errorf("Fireball ReqLevel: expected 10, got %d", fb.ReqLevel)
	}
	if fb.ReqMAG != 18 {
		t.Errorf("Fireball ReqMAG: expected 18, got %d", fb.ReqMAG)
	}
	if fb.ReqINT != 14 {
		t.Errorf("Fireball ReqINT: expected 14, got %d", fb.ReqINT)
	}
}

func TestSpellAOERadius(t *testing.T) {
	// Damage spells have no radius
	eb := GetSpellDef(1)
	if eb.Radius != 0 {
		t.Errorf("Energy Bolt should have radius=0, got %d", eb.Radius)
	}

	// AOE spells have radius
	fw := GetSpellDef(10)
	if fw.Radius != 2 {
		t.Errorf("Fire Wall should have radius=2, got %d", fw.Radius)
	}

	ms := GetSpellDef(12)
	if ms.Radius != 3 {
		t.Errorf("Meteor Strike should have radius=3, got %d", ms.Radius)
	}
}

func TestHealSpellAmounts(t *testing.T) {
	heal := GetSpellDef(20)
	if heal.HealAmount != 30 {
		t.Errorf("Heal amount: expected 30, got %d", heal.HealAmount)
	}

	gheal := GetSpellDef(21)
	if gheal.HealAmount != 80 {
		t.Errorf("Greater Heal amount: expected 80, got %d", gheal.HealAmount)
	}

	dheal := GetSpellDef(22)
	if dheal.HealAmount != 200 {
		t.Errorf("Divine Heal amount: expected 200, got %d", dheal.HealAmount)
	}
}

func TestBuffSpellStats(t *testing.T) {
	prot := GetSpellDef(30)
	if prot.BuffStat != 2 || prot.BuffAmount != 5 {
		t.Errorf("Protection: expected stat=2 amount=5, got stat=%d amount=%d", prot.BuffStat, prot.BuffAmount)
	}
	if prot.Duration != 60 {
		t.Errorf("Protection duration: expected 60, got %d", prot.Duration)
	}

	str := GetSpellDef(31)
	if str.BuffStat != 1 || str.BuffAmount != 5 {
		t.Errorf("Strength: expected stat=1 amount=5, got stat=%d amount=%d", str.BuffStat, str.BuffAmount)
	}

	slow := GetSpellDef(40)
	if slow.BuffStat != 3 || slow.BuffAmount != -5 {
		t.Errorf("Slow: expected stat=3 amount=-5, got stat=%d amount=%d", slow.BuffStat, slow.BuffAmount)
	}
}

func TestSpellDBCount(t *testing.T) {
	if len(SpellDB) < 26 {
		t.Errorf("Expected at least 26 spells in SpellDB, got %d", len(SpellDB))
	}
}

func TestStatusEffectSpells(t *testing.T) {
	tests := []struct {
		id          int
		name        string
		effectType  EffectType
		effectLevel int
	}{
		{50, "Poison Cloud", EffectPoison, 1},
		{51, "Toxic Cloud", EffectPoison, 2},
		{52, "Freeze", EffectIce, 1},
		{53, "Deep Freeze", EffectIce, 2},
		{54, "Berserk", EffectBerserk, 1},
		{55, "Greater Berserk", EffectBerserk, 2},
		{56, "Invisibility", EffectInvisibility, 1},
		{57, "Silence", EffectInhibition, 1},
		{58, "Defense Shield", EffectDefenseShield, 1},
		{59, "Greater Defense Shield", EffectDefenseShield, 2},
		{60, "Magic Protection", EffectMagicProtection, 1},
		{61, "Greater Magic Protection", EffectMagicProtection, 2},
	}

	for _, tt := range tests {
		spell := GetSpellDef(tt.id)
		if spell == nil {
			t.Errorf("Spell %d (%s) not found", tt.id, tt.name)
			continue
		}
		if spell.Name != tt.name {
			t.Errorf("ID %d: expected name=%s, got %s", tt.id, tt.name, spell.Name)
		}
		if spell.ApplyEffect != tt.effectType {
			t.Errorf("ID %d: expected effect type=%d, got %d", tt.id, tt.effectType, spell.ApplyEffect)
		}
		if spell.EffectLevel != tt.effectLevel {
			t.Errorf("ID %d: expected effect level=%d, got %d", tt.id, tt.effectLevel, spell.EffectLevel)
		}
	}
}

func TestPoisonSpellHasTickDamage(t *testing.T) {
	pc := GetSpellDef(50) // Poison Cloud
	if pc.TickDamage != 5 {
		t.Errorf("Poison Cloud tick damage: expected 5, got %d", pc.TickDamage)
	}
	if pc.TickIntervalMs != 3000 {
		t.Errorf("Poison Cloud tick interval: expected 3000ms, got %d", pc.TickIntervalMs)
	}
	if pc.Duration != 15 {
		t.Errorf("Poison Cloud duration: expected 15s, got %d", pc.Duration)
	}

	tc := GetSpellDef(51) // Toxic Cloud
	if tc.TickDamage != 8 {
		t.Errorf("Toxic Cloud tick damage: expected 8, got %d", tc.TickDamage)
	}
	if tc.EffectLevel != 2 {
		t.Errorf("Toxic Cloud effect level: expected 2, got %d", tc.EffectLevel)
	}
}

func TestBuffSpellsWithEffects(t *testing.T) {
	// Berserk should be a buff type with an effect
	berserk := GetSpellDef(54)
	if berserk.Type != SpellTypeBuff {
		t.Errorf("Berserk should be buff type, got %d", berserk.Type)
	}
	if berserk.ApplyEffect != EffectBerserk {
		t.Errorf("Berserk should apply EffectBerserk, got %d", berserk.ApplyEffect)
	}

	// Defense Shield should be a buff type
	ds := GetSpellDef(58)
	if ds.Type != SpellTypeBuff {
		t.Errorf("Defense Shield should be buff type, got %d", ds.Type)
	}
	if ds.ApplyEffect != EffectDefenseShield {
		t.Errorf("Defense Shield should apply EffectDefenseShield, got %d", ds.ApplyEffect)
	}

	// Magic Protection should be a buff type
	mp := GetSpellDef(60)
	if mp.Type != SpellTypeBuff {
		t.Errorf("Magic Protection should be buff type, got %d", mp.Type)
	}
	if mp.ApplyEffect != EffectMagicProtection {
		t.Errorf("Magic Protection should apply EffectMagicProtection, got %d", mp.ApplyEffect)
	}
}

func TestDebuffSpellsWithEffects(t *testing.T) {
	// Freeze should be a debuff
	freeze := GetSpellDef(52)
	if freeze.Type != SpellTypeDebuff {
		t.Errorf("Freeze should be debuff type, got %d", freeze.Type)
	}
	if freeze.Element != ElementIce {
		t.Errorf("Freeze should be ice element, got %d", freeze.Element)
	}

	// Silence should be a debuff
	silence := GetSpellDef(57)
	if silence.Type != SpellTypeDebuff {
		t.Errorf("Silence should be debuff type, got %d", silence.Type)
	}
	if silence.ApplyEffect != EffectInhibition {
		t.Errorf("Silence should apply EffectInhibition, got %d", silence.ApplyEffect)
	}
}
