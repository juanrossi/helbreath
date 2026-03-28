package magic

import "time"

// Buff represents an active buff or debuff on a player.
type Buff struct {
	SpellID   int
	Name      string
	StatType  int // 1=STR, 2=VIT, 3=DEX, 4=INT, 5=MAG
	Amount    int // positive for buff, negative for debuff
	ExpiresAt time.Time
}

// IsExpired returns true if the buff has expired.
func (b *Buff) IsExpired() bool {
	return time.Now().After(b.ExpiresAt)
}

// RemainingSeconds returns seconds until expiration.
func (b *Buff) RemainingSeconds() int {
	remaining := time.Until(b.ExpiresAt).Seconds()
	if remaining < 0 {
		return 0
	}
	return int(remaining)
}

// BuffTracker manages active buffs/debuffs on a player.
type BuffTracker struct {
	Buffs []*Buff
}

// NewBuffTracker creates a new buff tracker.
func NewBuffTracker() *BuffTracker {
	return &BuffTracker{}
}

// AddBuff adds or replaces a buff. If a buff from the same spell exists, it's replaced.
func (bt *BuffTracker) AddBuff(spellID int, name string, statType, amount, durationSec int) *Buff {
	// Remove existing buff from same spell
	bt.RemoveBySpell(spellID)

	buff := &Buff{
		SpellID:   spellID,
		Name:      name,
		StatType:  statType,
		Amount:    amount,
		ExpiresAt: time.Now().Add(time.Duration(durationSec) * time.Second),
	}
	bt.Buffs = append(bt.Buffs, buff)
	return buff
}

// RemoveBySpell removes a buff by spell ID. Returns the removed buff or nil.
func (bt *BuffTracker) RemoveBySpell(spellID int) *Buff {
	for i, b := range bt.Buffs {
		if b.SpellID == spellID {
			removed := bt.Buffs[i]
			bt.Buffs = append(bt.Buffs[:i], bt.Buffs[i+1:]...)
			return removed
		}
	}
	return nil
}

// CleanExpired removes expired buffs and returns them.
func (bt *BuffTracker) CleanExpired() []*Buff {
	var expired []*Buff
	var active []*Buff
	for _, b := range bt.Buffs {
		if b.IsExpired() {
			expired = append(expired, b)
		} else {
			active = append(active, b)
		}
	}
	bt.Buffs = active
	return expired
}

// GetStatModifier returns the total modifier for a given stat from all active buffs.
func (bt *BuffTracker) GetStatModifier(statType int) int {
	total := 0
	for _, b := range bt.Buffs {
		if b.StatType == statType && !b.IsExpired() {
			total += b.Amount
		}
	}
	return total
}

// Count returns the number of active buffs.
func (bt *BuffTracker) Count() int {
	return len(bt.Buffs)
}

// ClearAll removes all buffs.
func (bt *BuffTracker) ClearAll() {
	bt.Buffs = nil
}

// HasBuff returns true if a buff from the given spell is active.
func (bt *BuffTracker) HasBuff(spellID int) bool {
	for _, b := range bt.Buffs {
		if b.SpellID == spellID && !b.IsExpired() {
			return true
		}
	}
	return false
}
