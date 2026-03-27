package magic

import (
	"testing"
	"time"
)

func TestNewBuffTracker(t *testing.T) {
	bt := NewBuffTracker()
	if bt == nil {
		t.Fatal("NewBuffTracker returned nil")
	}
	if bt.Count() != 0 {
		t.Errorf("Expected 0 buffs, got %d", bt.Count())
	}
}

func TestAddBuff(t *testing.T) {
	bt := NewBuffTracker()
	buff := bt.AddBuff(30, "Protection", 2, 5, 60)
	if buff == nil {
		t.Fatal("AddBuff returned nil")
	}
	if bt.Count() != 1 {
		t.Errorf("Expected 1 buff, got %d", bt.Count())
	}
	if buff.SpellID != 30 {
		t.Errorf("Expected spellID=30, got %d", buff.SpellID)
	}
	if buff.StatType != 2 {
		t.Errorf("Expected statType=2, got %d", buff.StatType)
	}
	if buff.Amount != 5 {
		t.Errorf("Expected amount=5, got %d", buff.Amount)
	}
}

func TestAddBuffReplace(t *testing.T) {
	bt := NewBuffTracker()
	bt.AddBuff(30, "Protection", 2, 5, 60)
	bt.AddBuff(30, "Protection", 2, 5, 120) // same spell replaces

	if bt.Count() != 1 {
		t.Errorf("Expected 1 buff after replacement, got %d", bt.Count())
	}

	// The remaining buff should be longer duration
	remaining := bt.Buffs[0].RemainingSeconds()
	if remaining < 100 {
		t.Errorf("Expected ~120s remaining, got %d", remaining)
	}
}

func TestMultipleBuffs(t *testing.T) {
	bt := NewBuffTracker()
	bt.AddBuff(30, "Protection", 2, 5, 60)
	bt.AddBuff(31, "Strength", 1, 5, 60)
	bt.AddBuff(32, "Haste", 3, 5, 45)

	if bt.Count() != 3 {
		t.Errorf("Expected 3 buffs, got %d", bt.Count())
	}
}

func TestRemoveBySpell(t *testing.T) {
	bt := NewBuffTracker()
	bt.AddBuff(30, "Protection", 2, 5, 60)
	bt.AddBuff(31, "Strength", 1, 5, 60)

	removed := bt.RemoveBySpell(30)
	if removed == nil {
		t.Fatal("Expected to remove Protection buff")
	}
	if removed.Name != "Protection" {
		t.Errorf("Expected removed buff name=Protection, got %s", removed.Name)
	}
	if bt.Count() != 1 {
		t.Errorf("Expected 1 buff remaining, got %d", bt.Count())
	}

	// Remove non-existent
	removed = bt.RemoveBySpell(999)
	if removed != nil {
		t.Error("Expected nil for non-existent buff removal")
	}
}

func TestGetStatModifier(t *testing.T) {
	bt := NewBuffTracker()
	bt.AddBuff(30, "Protection", 2, 5, 60)   // VIT +5
	bt.AddBuff(31, "Strength", 1, 5, 60)     // STR +5
	bt.AddBuff(40, "Slow", 3, -5, 30)        // DEX -5

	if bt.GetStatModifier(1) != 5 {
		t.Errorf("STR modifier: expected 5, got %d", bt.GetStatModifier(1))
	}
	if bt.GetStatModifier(2) != 5 {
		t.Errorf("VIT modifier: expected 5, got %d", bt.GetStatModifier(2))
	}
	if bt.GetStatModifier(3) != -5 {
		t.Errorf("DEX modifier: expected -5, got %d", bt.GetStatModifier(3))
	}
	if bt.GetStatModifier(4) != 0 {
		t.Errorf("INT modifier: expected 0, got %d", bt.GetStatModifier(4))
	}
}

func TestStackingStatModifiers(t *testing.T) {
	bt := NewBuffTracker()
	// Two different buffs affecting the same stat
	bt.AddBuff(31, "Strength", 1, 5, 60)
	bt.AddBuff(100, "Potion Strength", 1, 3, 30) // hypothetical

	if bt.GetStatModifier(1) != 8 {
		t.Errorf("Stacked STR modifier: expected 8, got %d", bt.GetStatModifier(1))
	}
}

func TestHasBuff(t *testing.T) {
	bt := NewBuffTracker()
	bt.AddBuff(30, "Protection", 2, 5, 60)

	if !bt.HasBuff(30) {
		t.Error("Should have Protection buff")
	}
	if bt.HasBuff(31) {
		t.Error("Should not have Strength buff")
	}
}

func TestBuffExpiry(t *testing.T) {
	bt := NewBuffTracker()

	// Add an already-expired buff
	buff := &Buff{
		SpellID:   99,
		Name:      "Expired",
		StatType:  1,
		Amount:    5,
		ExpiresAt: time.Now().Add(-1 * time.Second),
	}
	bt.Buffs = append(bt.Buffs, buff)
	bt.AddBuff(30, "Protection", 2, 5, 60) // not expired

	if !buff.IsExpired() {
		t.Error("Buff should be expired")
	}

	expired := bt.CleanExpired()
	if len(expired) != 1 {
		t.Errorf("Expected 1 expired buff, got %d", len(expired))
	}
	if expired[0].SpellID != 99 {
		t.Errorf("Expected expired spell ID=99, got %d", expired[0].SpellID)
	}
	if bt.Count() != 1 {
		t.Errorf("Expected 1 active buff remaining, got %d", bt.Count())
	}
}

func TestCleanExpiredMultiple(t *testing.T) {
	bt := NewBuffTracker()
	past := time.Now().Add(-10 * time.Second)

	bt.Buffs = append(bt.Buffs,
		&Buff{SpellID: 1, Name: "A", ExpiresAt: past},
		&Buff{SpellID: 2, Name: "B", ExpiresAt: past},
	)
	bt.AddBuff(3, "C", 1, 5, 300) // still active

	expired := bt.CleanExpired()
	if len(expired) != 2 {
		t.Errorf("Expected 2 expired, got %d", len(expired))
	}
	if bt.Count() != 1 {
		t.Errorf("Expected 1 remaining, got %d", bt.Count())
	}
}

func TestRemainingSeconds(t *testing.T) {
	buff := &Buff{
		ExpiresAt: time.Now().Add(30 * time.Second),
	}
	remaining := buff.RemainingSeconds()
	if remaining < 28 || remaining > 31 {
		t.Errorf("Expected ~30 remaining seconds, got %d", remaining)
	}

	expired := &Buff{
		ExpiresAt: time.Now().Add(-10 * time.Second),
	}
	if expired.RemainingSeconds() != 0 {
		t.Errorf("Expired buff should have 0 remaining, got %d", expired.RemainingSeconds())
	}
}

func TestGetStatModifierIgnoresExpired(t *testing.T) {
	bt := NewBuffTracker()
	bt.Buffs = append(bt.Buffs, &Buff{
		SpellID:   99,
		StatType:  1,
		Amount:    10,
		ExpiresAt: time.Now().Add(-1 * time.Second),
	})
	bt.AddBuff(31, "Strength", 1, 5, 60)

	// Only the non-expired buff should count
	if bt.GetStatModifier(1) != 5 {
		t.Errorf("Expected STR modifier=5 (ignoring expired), got %d", bt.GetStatModifier(1))
	}
}
