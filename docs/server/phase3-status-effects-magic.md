# Phase 3 — Status Effects & Magic System

## Goal

Port the full C++ status effect system (13+ effects) and advanced magic mechanics including spell resistance, elemental interactions, and combat integration. The current Go implementation has basic buffs (+STR/VIT/DEX) and debuffs (-STR/DEX) with timed expiry, but lacks the depth of the original.

**Depends on**: Phase 1 (combat formulas, defense model)

---

## Context

### Current Go Implementation

**Effects** (`server/internal/magic/effects.go`):
- EffectTracker stores `map[EffectType]*ActiveEffect` with 13 defined effect types
- ActiveEffect has: Type, Level, ExpiresAt, SourceID, TickDamage, TickInterval, LastTick
- Methods: AddEffect (higher level wins), RemoveEffect, HasEffect, GetEffectLevel, ProcessTick, ClearAll
- ProcessTick handles poison damage ticks and effect expiration, returns EffectEvents

**Resistance** (`server/internal/magic/resistance.go`):
- CheckMagicResistance: `50 + (targetINT - attackerMAG) * 2 - spellLevel * 3`, clamped 5-95%
- CalcMagicDamageReduction: 15/25/35% by protection level
- CalcDefenseShieldAbsorb: 5/10/15 flat by shield level

**Spells** (`server/internal/magic/spell.go`):
- 28 spells total: 5 damage, 3 AoE, 3 heal, 3 buff, 2 debuff, **12 status effect spells**
- Status effect spells: Poison Cloud, Toxic Cloud, Freeze, Deep Freeze, Berserk, Greater Berserk, Invisibility, Silence, Defense Shield, Greater Defense Shield, Magic Protection, Greater Magic Protection

---

## Checklist

### 3.1 — Status Effect Infrastructure

- [x] **Create effect type enum** — `magic/effects.go`: 13 effect types defined (Poison, Ice, Berserk, Confusion, Invisibility, Illusion, Metamorphosis, DefenseShield, MagicProtection, Reflection, Inhibition, Polymorph, HeroArmor).
- [x] **Extend buff tracker to support behavioral effects** — `EffectTracker` created with `map[EffectType]*ActiveEffect`. Independent from BuffTracker (stat modifiers).
- [x] **Implement effect level system** — `ActiveEffect.Level` determines intensity. `AddEffect` replaces only if new level is higher.
- [x] **Add delay event list** — `ProcessTick()` handles periodic effects (poison ticks) and expiration events. Returns `[]EffectEvent` for engine processing.
- [x] **Effect stacking rules** — Same effect: higher level wins, duration refreshes. Different effects stack independently.

### 3.2 — Poison Effect

- [x] **Implement poison application** — Poison Cloud (level 1, 5 dmg/3s) and Toxic Cloud (level 2, 8 dmg/2s) spells defined.
- [x] **Poison damage over time** — `ProcessTick()` applies `TickDamage` every `TickInterval`. Returns `EffectEvent{Type: "poison_damage", Damage: N}`.
- [x] **Poison resistance check** — Magic resistance checked before applying poison debuff in `handleDebuffSpell()`.
- [ ] **Poison cure** — Cure potion not yet defined. Effect expires after duration (30s).
- [ ] **Visual indicator** — No client-side poison rendering yet.

### 3.3 — Ice/Frozen Effect

- [x] **Implement ice application** — Freeze (level 1) and Deep Freeze (level 2) spells defined.
- [x] **Movement speed reduction** — Ice effect slows player movement by 50% per level in `handleMotion()` (moveDelay *= 1 + level*0.5).
- [ ] **Attack speed reduction** — Not yet wired into attack cooldown.
- [x] **Ice resistance check** — Magic resistance checked before applying in `handleDebuffSpell()`.
- [ ] **Frozen break on damage** — Fire damage does not remove ice (no element interaction yet).

### 3.4 — Berserk Effect

- [x] **Implement berserk application** — Berserk (level 1) and Greater Berserk (level 2) buff spells defined.
- [x] **Damage multiplier in combat** — `damage * (100 + berserkLevel*20) / 100` in PlayerAttackNPC, PlayerAttackPlayer.
- [x] **Defense penalty while berserk** — Same formula applied when berserk player is the target: takes 20% more damage per level.
- [ ] **NPC berserk** — Boss NPCs entering berserk at low HP not yet implemented.

### 3.5 — Invisibility Effect

- [x] **Implement invisibility application** — Invisibility spell (level 1, 60s duration) defined.
- [x] **NPC targeting exclusion** — `findNearestPlayer()` skips invisible players.
- [x] **Break on action** — Invisibility removed on: attacking (PlayerAttackNPC, PlayerAttackPlayer), taking damage (NPCAttackPlayer, PlayerAttackPlayer), casting debuff spells.
- [ ] **Player visibility** — Other players can still see invisible players (no client-side hiding yet).
- [ ] **Stealth skill integration** — Stealth mastery does not affect duration yet.

### 3.6 — Silence (Inhibition) Effect

- [x] **Implement silence application** — Silence spell (level 1, 30s duration) defined as debuff.
- [x] **Spell block** — `CanCastSpell()` checks for `EffectInhibition` and returns "You are silenced".
- [ ] **NPC silence** — NPC spellcasters not yet implemented (Phase 2.5 deferred).

### 3.7 — Defense Shield Effect

- [x] **Implement defense shield** — Defense Shield (level 1, absorbs 5) and Greater Defense Shield (level 2, absorbs 10) spells defined.
- [x] **Damage absorption** — `CalcDefenseShieldAbsorb()` returns flat absorption. Subtracted in NPCAttackPlayer and PlayerAttackPlayer.
- [ ] **Shield HP depletion** — Currently unlimited absorption for duration. Should track total absorbed and expire when depleted.

### 3.8 — Magic Protection Effect

- [x] **Implement magic protection** — Magic Protection (level 1, 15% reduction) and Greater Magic Protection (level 2, 25% reduction) defined.
- [x] **Spell damage reduction** — `CalcMagicDamageReduction()` returns percentage. Applied in spell damage handlers.
- [ ] **Block low-level spells** — Complete block of weak spells not implemented.

### 3.9 — Illusion Effect

- [ ] **Implement illusion** — Evasion bonus effect. Deferred: requires integration with hit ratio system.

### 3.10 — Confusion Effect

- [ ] **Implement confusion** — AI disruption for NPCs, direction randomization for players. Deferred: complex behavioral change.

### 3.11 — Metamorphosis Effect

- [ ] **Implement metamorphosis** — Form transformation with altered dice. Deferred: requires sprite system.

### 3.12 — Reflection Effect

- [ ] **Implement reflection** — Projectile/spell bounce back. Deferred: requires attack redirect logic.

### 3.13 — Polymorph Effect

- [ ] **Implement polymorph** — Visual type change. Deferred: requires visual system.

### 3.14 — Hero Armor Effect

- [ ] **Implement hero armor** — +25 hit ratio from Hero-class sets. Deferred: hero equipment not defined.

### 3.15 — Spell Resistance System

- [x] **Port `bCheckResistingMagicSuccess()`** — `CheckMagicResistance()` in `resistance.go`. Uses attacker MAG, target INT, spell level. Base 50% + (INT-MAG)*2 - spellLevel*3.
- [ ] **Port ice-specific resistance** — Not separate from general magic resistance yet.
- [ ] **Port poison-specific resistance** — Not separate from general magic resistance yet.
- [ ] **Elemental resistance stats** — Per-element resistance values not added to player/NPC stats yet.
- [x] **Magic hit ratio for NPCs** — `NpcType.INT` field added (Slime=3, Skeleton=8, Orc=6, Demon=18) for resistance checks.

### 3.16 — Advanced Spell Effects

- [ ] **Knockback spells** — Displacement on hit. Deferred: requires position change + collision.
- [ ] **Mana drain** — MP damage spells. Deferred.
- [ ] **Mana restore** — MP healing spells. Deferred.
- [ ] **SP drain** — Stamina damage. Deferred.
- [ ] **Explosion damage** — True AoE with falloff. Deferred.
- [ ] **Area heal** — AoE healing. Deferred.

### 3.17 — Spell Scaling

- [ ] **Magic mastery affects spell power** — Deferred.
- [ ] **Spell level requirements** — Deferred.
- [ ] **Mana cost scaling** — Deferred.

---

## Validation

After implementing Phase 3, verify:
1. ✅ Poisoned players take periodic damage (5 or 8 per tick, configurable)
2. ✅ Frozen players move at reduced speed (50% per ice level)
3. ✅ Invisible players are not targeted by NPCs; invisibility breaks on attack/damage
4. ✅ Berserk increases damage by 20% per level AND reduces defense by same amount
5. ✅ Silenced players cannot cast spells
6. ✅ Defense Shield absorbs flat damage from attacks
7. ✅ Magic resistance checks prevent some debuffs from landing
8. ✅ 629 tests pass (38 new tests for effects, resistance, and combat integration)
