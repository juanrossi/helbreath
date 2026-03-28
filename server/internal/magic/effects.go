package magic

import "time"

// EffectType categorizes status effects.
type EffectType int

const (
	EffectPoison          EffectType = iota + 1
	EffectIce                        // Frozen/slowed
	EffectBerserk                    // Increased damage, reduced defense
	EffectConfusion                  // Movement randomization (future)
	EffectInvisibility               // Hidden from NPCs
	EffectIllusion                   // Decoy (future)
	EffectMetamorphosis              // Form change (future)
	EffectDefenseShield              // Absorb physical damage
	EffectMagicProtection            // Reduce spell damage
	EffectReflection                 // Reflect damage (future)
	EffectInhibition                 // Silence: cannot cast spells
	EffectPolymorph                  // Visual change (future)
	EffectHeroArmor                  // Hero equipment bonus (future)
)

// EffectEventType describes what happened during a tick.
type EffectEventType int

const (
	EffectEventPoisonDamage EffectEventType = iota + 1
	EffectEventExpired
)

// EffectEvent is returned by ProcessTick to describe what happened.
type EffectEvent struct {
	EventType  EffectEventType
	EffectType EffectType
	Damage     int
}

// ActiveEffect represents a status effect currently active on a character.
type ActiveEffect struct {
	Type         EffectType
	Level        int           // intensity (1-3 typically)
	ExpiresAt    time.Time
	SourceID     int32         // who applied it
	TickDamage   int           // for poison: damage per tick
	TickInterval time.Duration // for poison: time between ticks
	LastTick     time.Time     // for poison: last tick timestamp
}

// IsExpired returns true if the effect has expired.
func (e *ActiveEffect) IsExpired(now time.Time) bool {
	return now.After(e.ExpiresAt)
}

// RemainingSeconds returns seconds until expiration.
func (e *ActiveEffect) RemainingSeconds() int {
	remaining := time.Until(e.ExpiresAt).Seconds()
	if remaining < 0 {
		return 0
	}
	return int(remaining)
}

// EffectTracker manages active status effects on a character.
type EffectTracker struct {
	Effects map[EffectType]*ActiveEffect
}

// NewEffectTracker creates a new effect tracker.
func NewEffectTracker() *EffectTracker {
	return &EffectTracker{
		Effects: make(map[EffectType]*ActiveEffect),
	}
}

// AddEffect adds or replaces an effect. Higher level wins; equal or lower
// level refreshes only if the new duration is longer.
func (et *EffectTracker) AddEffect(eff *ActiveEffect) {
	existing, ok := et.Effects[eff.Type]
	if ok {
		// Higher level always replaces
		if eff.Level > existing.Level {
			et.Effects[eff.Type] = eff
			return
		}
		// Same level: replace only if new duration is longer
		if eff.Level == existing.Level && eff.ExpiresAt.After(existing.ExpiresAt) {
			et.Effects[eff.Type] = eff
			return
		}
		// Lower level: ignore
		return
	}
	et.Effects[eff.Type] = eff
}

// RemoveEffect removes an effect by type.
func (et *EffectTracker) RemoveEffect(t EffectType) {
	delete(et.Effects, t)
}

// HasEffect returns true if an effect of the given type is active and not expired.
func (et *EffectTracker) HasEffect(t EffectType) bool {
	eff, ok := et.Effects[t]
	if !ok {
		return false
	}
	return !eff.IsExpired(time.Now())
}

// GetEffectLevel returns the level of an active effect, or 0 if not present/expired.
func (et *EffectTracker) GetEffectLevel(t EffectType) int {
	eff, ok := et.Effects[t]
	if !ok {
		return 0
	}
	if eff.IsExpired(time.Now()) {
		return 0
	}
	return eff.Level
}

// GetEffect returns the active effect of the given type, or nil.
func (et *EffectTracker) GetEffect(t EffectType) *ActiveEffect {
	return et.Effects[t]
}

// Count returns the number of active effects.
func (et *EffectTracker) Count() int {
	return len(et.Effects)
}

// ProcessTick processes periodic effects and removes expired ones.
// Returns a list of events for the engine to handle.
func (et *EffectTracker) ProcessTick(now time.Time) []EffectEvent {
	var events []EffectEvent

	for t, eff := range et.Effects {
		// Check expiration first
		if eff.IsExpired(now) {
			events = append(events, EffectEvent{
				EventType:  EffectEventExpired,
				EffectType: t,
			})
			delete(et.Effects, t)
			continue
		}

		// Process periodic effects
		switch t {
		case EffectPoison:
			if eff.TickDamage > 0 && eff.TickInterval > 0 {
				if now.Sub(eff.LastTick) >= eff.TickInterval {
					eff.LastTick = now
					events = append(events, EffectEvent{
						EventType:  EffectEventPoisonDamage,
						EffectType: EffectPoison,
						Damage:     eff.TickDamage,
					})
				}
			}
		}
	}

	return events
}

// ClearAll removes all effects.
func (et *EffectTracker) ClearAll() {
	et.Effects = make(map[EffectType]*ActiveEffect)
}

// HasEffectAt checks if an effect is active at a specific time (for testing).
func (et *EffectTracker) HasEffectAt(t EffectType, now time.Time) bool {
	eff, ok := et.Effects[t]
	if !ok {
		return false
	}
	return !eff.IsExpired(now)
}

// GetEffectLevelAt returns the level at a specific time (for testing).
func (et *EffectTracker) GetEffectLevelAt(t EffectType, now time.Time) int {
	eff, ok := et.Effects[t]
	if !ok {
		return 0
	}
	if eff.IsExpired(now) {
		return 0
	}
	return eff.Level
}
