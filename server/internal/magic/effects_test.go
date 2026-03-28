package magic

import (
	"testing"
	"time"
)

func TestNewEffectTracker(t *testing.T) {
	et := NewEffectTracker()
	if et == nil {
		t.Fatal("NewEffectTracker returned nil")
	}
	if et.Count() != 0 {
		t.Errorf("Expected 0 effects, got %d", et.Count())
	}
}

func TestAddEffect(t *testing.T) {
	et := NewEffectTracker()
	eff := &ActiveEffect{
		Type:      EffectPoison,
		Level:     1,
		ExpiresAt: time.Now().Add(30 * time.Second),
		SourceID:  100,
	}
	et.AddEffect(eff)

	if et.Count() != 1 {
		t.Errorf("Expected 1 effect, got %d", et.Count())
	}
	if !et.HasEffect(EffectPoison) {
		t.Error("Should have poison effect")
	}
	if et.GetEffectLevel(EffectPoison) != 1 {
		t.Errorf("Expected level 1, got %d", et.GetEffectLevel(EffectPoison))
	}
}

func TestAddEffectHigherLevelReplaces(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectPoison,
		Level:     1,
		ExpiresAt: time.Now().Add(30 * time.Second),
		SourceID:  100,
	})
	et.AddEffect(&ActiveEffect{
		Type:      EffectPoison,
		Level:     2,
		ExpiresAt: time.Now().Add(20 * time.Second),
		SourceID:  200,
	})

	if et.Count() != 1 {
		t.Errorf("Expected 1 effect (replaced), got %d", et.Count())
	}
	if et.GetEffectLevel(EffectPoison) != 2 {
		t.Errorf("Expected level 2 after replacement, got %d", et.GetEffectLevel(EffectPoison))
	}
	if et.GetEffect(EffectPoison).SourceID != 200 {
		t.Errorf("Expected source 200, got %d", et.GetEffect(EffectPoison).SourceID)
	}
}

func TestAddEffectLowerLevelIgnored(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectPoison,
		Level:     3,
		ExpiresAt: time.Now().Add(30 * time.Second),
		SourceID:  100,
	})
	et.AddEffect(&ActiveEffect{
		Type:      EffectPoison,
		Level:     1,
		ExpiresAt: time.Now().Add(60 * time.Second),
		SourceID:  200,
	})

	if et.GetEffectLevel(EffectPoison) != 3 {
		t.Errorf("Expected level 3 (lower ignored), got %d", et.GetEffectLevel(EffectPoison))
	}
	if et.GetEffect(EffectPoison).SourceID != 100 {
		t.Errorf("Expected source 100, got %d", et.GetEffect(EffectPoison).SourceID)
	}
}

func TestAddEffectSameLevelLongerDuration(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     2,
		ExpiresAt: time.Now().Add(10 * time.Second),
		SourceID:  100,
	})
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     2,
		ExpiresAt: time.Now().Add(30 * time.Second),
		SourceID:  200,
	})

	// Should replace because longer duration
	if et.GetEffect(EffectIce).SourceID != 200 {
		t.Errorf("Expected source 200 (longer duration), got %d", et.GetEffect(EffectIce).SourceID)
	}
}

func TestAddEffectSameLevelShorterDuration(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     2,
		ExpiresAt: time.Now().Add(30 * time.Second),
		SourceID:  100,
	})
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     2,
		ExpiresAt: time.Now().Add(10 * time.Second),
		SourceID:  200,
	})

	// Should NOT replace because shorter duration
	if et.GetEffect(EffectIce).SourceID != 100 {
		t.Errorf("Expected source 100 (shorter duration ignored), got %d", et.GetEffect(EffectIce).SourceID)
	}
}

func TestRemoveEffect(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectPoison,
		Level:     1,
		ExpiresAt: time.Now().Add(30 * time.Second),
	})
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     1,
		ExpiresAt: time.Now().Add(30 * time.Second),
	})

	et.RemoveEffect(EffectPoison)
	if et.HasEffect(EffectPoison) {
		t.Error("Should not have poison after removal")
	}
	if !et.HasEffect(EffectIce) {
		t.Error("Should still have ice")
	}
	if et.Count() != 1 {
		t.Errorf("Expected 1 effect, got %d", et.Count())
	}
}

func TestHasEffectExpired(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectPoison,
		Level:     1,
		ExpiresAt: time.Now().Add(-1 * time.Second), // already expired
	})

	if et.HasEffect(EffectPoison) {
		t.Error("Expired effect should not be considered active")
	}
	if et.GetEffectLevel(EffectPoison) != 0 {
		t.Errorf("Expired effect level should be 0, got %d", et.GetEffectLevel(EffectPoison))
	}
}

func TestProcessTickExpiresEffects(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     1,
		ExpiresAt: time.Now().Add(-1 * time.Second), // already expired
	})
	et.AddEffect(&ActiveEffect{
		Type:      EffectBerserk,
		Level:     1,
		ExpiresAt: time.Now().Add(30 * time.Second), // still active
	})

	events := et.ProcessTick(time.Now())

	// Should have one expired event for ice
	expiredCount := 0
	for _, ev := range events {
		if ev.EventType == EffectEventExpired && ev.EffectType == EffectIce {
			expiredCount++
		}
	}
	if expiredCount != 1 {
		t.Errorf("Expected 1 ice expired event, got %d", expiredCount)
	}

	// Ice should be removed
	if et.Count() != 1 {
		t.Errorf("Expected 1 effect remaining, got %d", et.Count())
	}
	if et.GetEffect(EffectIce) != nil {
		t.Error("Ice should have been removed")
	}
	if et.GetEffect(EffectBerserk) == nil {
		t.Error("Berserk should still be active")
	}
}

func TestProcessTickPoisonDamage(t *testing.T) {
	now := time.Now()
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:         EffectPoison,
		Level:        1,
		ExpiresAt:    now.Add(30 * time.Second),
		TickDamage:   5,
		TickInterval: 3 * time.Second,
		LastTick:     now.Add(-4 * time.Second), // 4 seconds since last tick
	})

	events := et.ProcessTick(now)

	poisonDmgCount := 0
	for _, ev := range events {
		if ev.EventType == EffectEventPoisonDamage {
			poisonDmgCount++
			if ev.Damage != 5 {
				t.Errorf("Expected poison damage=5, got %d", ev.Damage)
			}
		}
	}
	if poisonDmgCount != 1 {
		t.Errorf("Expected 1 poison damage event, got %d", poisonDmgCount)
	}
}

func TestProcessTickPoisonNotReady(t *testing.T) {
	now := time.Now()
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{
		Type:         EffectPoison,
		Level:        1,
		ExpiresAt:    now.Add(30 * time.Second),
		TickDamage:   5,
		TickInterval: 3 * time.Second,
		LastTick:     now.Add(-1 * time.Second), // only 1 second since last tick
	})

	events := et.ProcessTick(now)

	for _, ev := range events {
		if ev.EventType == EffectEventPoisonDamage {
			t.Error("Should not have poison damage yet (only 1s elapsed, need 3s)")
		}
	}
}

func TestMultipleEffects(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{Type: EffectPoison, Level: 1, ExpiresAt: time.Now().Add(30 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectIce, Level: 2, ExpiresAt: time.Now().Add(20 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectBerserk, Level: 1, ExpiresAt: time.Now().Add(45 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectInvisibility, Level: 1, ExpiresAt: time.Now().Add(60 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectInhibition, Level: 1, ExpiresAt: time.Now().Add(15 * time.Second)})

	if et.Count() != 5 {
		t.Errorf("Expected 5 effects, got %d", et.Count())
	}

	if !et.HasEffect(EffectPoison) {
		t.Error("Should have poison")
	}
	if !et.HasEffect(EffectIce) {
		t.Error("Should have ice")
	}
	if !et.HasEffect(EffectBerserk) {
		t.Error("Should have berserk")
	}
	if !et.HasEffect(EffectInvisibility) {
		t.Error("Should have invisibility")
	}
	if !et.HasEffect(EffectInhibition) {
		t.Error("Should have inhibition/silence")
	}
	if et.HasEffect(EffectDefenseShield) {
		t.Error("Should not have defense shield")
	}
}

func TestClearAll(t *testing.T) {
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{Type: EffectPoison, Level: 1, ExpiresAt: time.Now().Add(30 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectIce, Level: 2, ExpiresAt: time.Now().Add(20 * time.Second)})

	et.ClearAll()
	if et.Count() != 0 {
		t.Errorf("Expected 0 effects after ClearAll, got %d", et.Count())
	}
}

func TestEffectRemainingSeconds(t *testing.T) {
	eff := &ActiveEffect{
		ExpiresAt: time.Now().Add(45 * time.Second),
	}
	remaining := eff.RemainingSeconds()
	if remaining < 43 || remaining > 46 {
		t.Errorf("Expected ~45 remaining, got %d", remaining)
	}

	expired := &ActiveEffect{
		ExpiresAt: time.Now().Add(-5 * time.Second),
	}
	if expired.RemainingSeconds() != 0 {
		t.Errorf("Expired should have 0 remaining, got %d", expired.RemainingSeconds())
	}
}

func TestProcessTickMultipleExpired(t *testing.T) {
	now := time.Now()
	et := NewEffectTracker()
	et.AddEffect(&ActiveEffect{Type: EffectPoison, Level: 1, ExpiresAt: now.Add(-2 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectIce, Level: 1, ExpiresAt: now.Add(-1 * time.Second)})
	et.AddEffect(&ActiveEffect{Type: EffectBerserk, Level: 1, ExpiresAt: now.Add(30 * time.Second)})

	events := et.ProcessTick(now)

	expiredCount := 0
	for _, ev := range events {
		if ev.EventType == EffectEventExpired {
			expiredCount++
		}
	}
	if expiredCount != 2 {
		t.Errorf("Expected 2 expired events, got %d", expiredCount)
	}
	if et.Count() != 1 {
		t.Errorf("Expected 1 remaining effect, got %d", et.Count())
	}
}

func TestGetEffectNil(t *testing.T) {
	et := NewEffectTracker()
	if et.GetEffect(EffectPoison) != nil {
		t.Error("Expected nil for non-existent effect")
	}
}

func TestEffectTypes(t *testing.T) {
	// Verify all effect type constants are unique and sequential
	types := []EffectType{
		EffectPoison, EffectIce, EffectBerserk, EffectConfusion,
		EffectInvisibility, EffectIllusion, EffectMetamorphosis,
		EffectDefenseShield, EffectMagicProtection, EffectReflection,
		EffectInhibition, EffectPolymorph, EffectHeroArmor,
	}

	seen := make(map[EffectType]bool)
	for _, et := range types {
		if seen[et] {
			t.Errorf("Duplicate effect type: %d", et)
		}
		seen[et] = true
	}

	if len(types) != 13 {
		t.Errorf("Expected 13 effect types, got %d", len(types))
	}
}

func TestHasEffectAtTime(t *testing.T) {
	et := NewEffectTracker()
	now := time.Now()
	et.AddEffect(&ActiveEffect{
		Type:      EffectIce,
		Level:     1,
		ExpiresAt: now.Add(10 * time.Second),
	})

	if !et.HasEffectAt(EffectIce, now) {
		t.Error("Should have ice at current time")
	}
	if et.HasEffectAt(EffectIce, now.Add(15*time.Second)) {
		t.Error("Should not have ice 15 seconds later")
	}
	if !et.HasEffectAt(EffectIce, now.Add(5*time.Second)) {
		t.Error("Should have ice 5 seconds later")
	}
}

func TestGetEffectLevelAtTime(t *testing.T) {
	et := NewEffectTracker()
	now := time.Now()
	et.AddEffect(&ActiveEffect{
		Type:      EffectBerserk,
		Level:     2,
		ExpiresAt: now.Add(10 * time.Second),
	})

	if et.GetEffectLevelAt(EffectBerserk, now) != 2 {
		t.Errorf("Expected level 2, got %d", et.GetEffectLevelAt(EffectBerserk, now))
	}
	if et.GetEffectLevelAt(EffectBerserk, now.Add(15*time.Second)) != 0 {
		t.Errorf("Expected level 0 after expiry, got %d", et.GetEffectLevelAt(EffectBerserk, now.Add(15*time.Second)))
	}
}
