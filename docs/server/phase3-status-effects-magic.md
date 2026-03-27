# Phase 3 — Status Effects & Magic System

## Goal

Port the full C++ status effect system (13+ effects) and advanced magic mechanics including spell resistance, knockback, elemental interactions, and metamorphosis. The current Go implementation has basic buffs (+STR/VIT/DEX) and debuffs (-STR/DEX) with timed expiry, but lacks the depth of the original.

**Depends on**: Phase 1 (combat formulas, defense model)

---

## Context

### Current Go Implementation

**Buffs** (`server/internal/magic/buff.go`):
- BuffTracker stores: SpellID, Name, StatType (STR/VIT/DEX/INT/MAG), Amount, ExpiresAt
- Methods: AddBuff, RemoveBySpell, CleanExpired, GetStatModifier, HasBuff
- Only modifies flat stat values — no behavioral effects

**Spells** (`server/internal/magic/spell.go`):
- 16 spells: 5 damage, 3 AoE, 3 heal, 3 buff, 2 debuff
- Damage: `MinDmg + rand(MaxDmg-MinDmg) + MAG/3 + INT/4`
- Defense vs spells: 50% of NPC defense, capped at 60% reduction
- Elements defined (Fire, Ice, Light, Earth, None) but not used in calculations

### Original C++ Implementation

**Status effects** stored in `m_cMagicEffectStatus[DEF_MAXMAGICEFFECTS]` array. Values: 0 (inactive), 1-2 (active at level), 99+ (indefinite). Timed via `m_pDelayEventList`.

**13+ distinct effects** each with dedicated Set/Clear functions and gameplay integration into combat, AI, and movement.

**Spell resistance** uses directional calculations, attacker/target stat comparison, and per-element resistance checks.

---

## Checklist

### 3.1 — Status Effect Infrastructure

- [ ] **Create effect type enum** — Define all effect types as constants:
  ```
  Poison, Ice, Berserk, Confusion, Invisibility, Illusion,
  Metamorphosis, DefenseShield, MagicProtection, Reflection,
  Inhibition (Silence), Polymorph, HeroArmor
  ```
- [ ] **Extend buff tracker to support behavioral effects** — Current BuffTracker only tracks stat modifiers. Add an `ActiveEffects` map that stores effect type → level + expiry + source. Each effect type needs its own behavior hooks.
- [ ] **Implement effect level system** — Effects have levels (1, 2, 3, etc.) that determine intensity. Level stored in the status array. Higher-level spells produce higher-level effects.
- [ ] **Add delay event list** — Port `m_pDelayEventList` concept: a priority queue of timed events (effect expiry, periodic damage ticks, etc.) processed each game tick.
- [ ] **Effect stacking rules** — Same effect from different sources: higher level wins, duration refreshes. Same effect same source: duration refreshes only.

### 3.2 — Poison Effect

- [ ] **Implement `SetPoisonFlag()`** — Applies poison status. Tracks via hunger status in C++ (`m_iHungerStatus`). Reference: `Game.cpp:49917`.
- [ ] **Poison damage over time** — Every N seconds (configurable tick rate), poisoned entity takes damage. Damage scales with poison level.
- [ ] **Poison resistance check** — `bCheckResistingPoisonSuccess()` — percentage-based mitigation. Higher VIT/resistance reduces chance of being poisoned.
- [ ] **Poison cure** — Certain spells/potions remove poison. Effect expires after duration.
- [ ] **Visual indicator** — Broadcast poison status to nearby clients for green tint / particle effect.

### 3.3 — Ice/Frozen Effect

- [ ] **Implement `SetIceFlag()`** — Applies frozen/slowed status. Reference: `Game.cpp:49891`.
- [ ] **Movement speed reduction** — Frozen entities move at reduced speed (50% or 25% depending on level).
- [ ] **Attack speed reduction** — Frozen entities attack slower (increased cooldown between attacks).
- [ ] **Ice resistance check** — `bCheckResistingIceSuccess()` — separate from general magic resistance. Reference: `Game.cpp:33030`.
- [ ] **Frozen break on damage** — Optional: taking fire damage removes ice effect.

### 3.4 — Berserk Effect

- [ ] **Implement `SetBerserkFlag()`** — Applies berserk damage multiplier. Reference: `Game.cpp:49865`.
- [ ] **Damage multiplier in combat** — When berserk is active, damage output is multiplied by `(1 + berserkLevel * modifier)`. Wire this into `PlayerAttackNPC()`, `PlayerAttackPlayer()`, `NPCAttackPlayer()`.
- [ ] **Defense penalty while berserk** — Berserk increases damage dealt but reduces defense (trade-off).
- [ ] **NPC berserk** — Boss NPCs can enter berserk mode at low HP (special ability trigger).

### 3.5 — Confusion Effect

- [ ] **Implement `SetConfusionFlag()`** — Disrupts AI and player controls.
- [ ] **NPC confusion** — Confused NPCs attack random targets (including allies) or move in random directions instead of toward their target.
- [ ] **Player confusion** — Confused players have their movement direction randomized (client-side visual + server validates).
- [ ] **Duration and resistance** — INT-based resistance check. Effect lasts 5-15 seconds depending on spell level.

### 3.6 — Invisibility Effect

- [ ] **Implement `SetInvisibilityFlag()`** — Player becomes invisible to NPCs and other players. Reference: `Game.cpp:49798`.
- [ ] **NPC targeting exclusion** — Invisible players are excluded from `TargetSearch()` and `FarTargetSearch()`. NPCs with existing aggro on the player lose their target.
- [ ] **Break on action** — Invisibility breaks when the player attacks, casts an offensive spell, or takes damage.
- [ ] **Player visibility** — Other players cannot see invisible players unless they have detection (admin, special item, or spell).
- [ ] **Stealth skill integration** — Stealth skill mastery affects invisibility duration and detection difficulty.

### 3.7 — Illusion Effect

- [ ] **Implement `SetIllusionFlag()`** — Increases evasion.
- [ ] **Evasion bonus** — Adds a flat or percentage bonus to the target's defense ratio, making attacks more likely to miss.
- [ ] **Integration with hit ratio** — Wire into the hit/miss calculation from Phase 1: illusion bonus adds to `TargetDefenseRatio`.

### 3.8 — Metamorphosis Effect

- [ ] **Implement `SetMetamorphosisFlag()`** — Transforms player into a different form with altered combat stats.
- [ ] **Form definitions** — Each metamorphosis form has unique dice ranges:
  - Gis form: specific DiceThrow/DiceRange
  - Black Shadow: specific dice
  - Vampire: specific dice
  - GodBlade: 4d11 / 4d12 (highest tier)
- [ ] **Damage scaling** — `damage *= (1 + metamorphosisLevel * 2 / 100)`. Reference: `Game.cpp` metamorphosis damage section.
- [ ] **Visual transformation** — Broadcast new sprite/appearance to nearby clients.
- [ ] **Form restrictions** — Certain actions may be restricted while transformed (e.g., can't use items, can't trade).

### 3.9 — Defense Shield Effect

- [ ] **Implement `SetDefenseShieldFlag()`** — Flat damage absorption shield.
- [ ] **Damage absorption** — Absorbs a fixed amount of damage per hit. Shield has total HP that depletes as it absorbs. When depleted, effect ends.
- [ ] **Integration with combat** — Wire into the defense calculation: subtract shield absorption after armor absorption but before final damage.

### 3.10 — Magic Protection Effect

- [ ] **Implement `SetMagicProtectionFlag()`** — Reduces incoming spell damage.
- [ ] **Spell damage reduction** — Reduces magic damage by a percentage (based on effect level). Applied during `Effect_Damage_Spot()`.
- [ ] **Blocks certain spells** — Some low-level spells are completely blocked by magic protection.

### 3.11 — Reflection Effect

- [ ] **Implement `SetReflexionFlag()`** — Reflects projectile attacks and some spells.
- [ ] **Reflection chance** — `1/18 + magic_level` probability to reflect an incoming attack back at the attacker.
- [ ] **Reflected damage** — Reflected attacks deal full damage to the original attacker.
- [ ] **Spell reflection** — Some single-target spells can be reflected back.

### 3.12 — Inhibition (Silence) Effect

- [ ] **Implement `SetInhibitionCastingFlag()`** — Prevents target from casting spells.
- [ ] **Spell block** — While silenced, all spell cast attempts fail. Server rejects magic handler calls for silenced players.
- [ ] **Duration** — Typically 10-30 seconds. Can be dispelled.
- [ ] **NPC silence** — If NPC spellcasters are silenced, they fall back to melee attacks.

### 3.13 — Polymorph Effect

- [ ] **Implement Polymorph** — Temporarily changes target's visual type (`m_sType` override).
- [ ] **Stat modification** — Polymorphed form may have different base stats (weaker or stronger depending on form).
- [ ] **Duration** — Timed, cannot be refreshed by recasting.

### 3.14 — Hero Armor Effect

- [ ] **Implement Hero Armor bonus** — `cHeroArmourBonus` adds +25 to hit ratio.
- [ ] **Triggered by special equipment** — Only active when wearing Hero-class armor sets.
- [ ] **Integration with hit system** — Adds flat bonus to `AttackerHitRatio` in combat calculations.

### 3.15 — Spell Resistance System

- [ ] **Port `bCheckResistingMagicSuccess()`** — General magic resistance check. Uses attacker direction, target info, hit ratio comparison. Returns true if target resists. Reference: `Game.cpp:32949`.
- [ ] **Port `bCheckResistingIceSuccess()`** — Ice-specific resistance. Separate from general magic resistance. Reference: `Game.cpp:33030`.
- [ ] **Port `bCheckResistingPoisonSuccess()`** — Poison-specific resistance with percentage mitigation.
- [ ] **Elemental resistance stats** — Add per-element resistance values to player/NPC stats. Equipment can grant elemental resistances.
- [ ] **Magic hit ratio for NPCs** — `iMagicHitRatio` field on NPC types affects their spell accuracy.

### 3.16 — Advanced Spell Effects

- [ ] **Knockback spells** — Port `Effect_Damage_Spot_DamageMove()` (`Game.cpp:31965`). Spell deals damage AND displaces target 1-2 tiles away from caster.
- [ ] **Mana drain** — Port `Effect_ManaDown_Spot()` (`Game.cpp:31391`). Spell reduces target's MP instead of HP.
- [ ] **Mana restore** — Port `Effect_SpUp_Spot()` (`Game.cpp:32917`). Spell restores target's MP.
- [ ] **SP drain** — Port `Effect_SpDown_Spot()` (`Game.cpp:32886`). Spell reduces target's stamina.
- [ ] **Explosion damage** — Port `Effect_Damage_Explosion()` (`Game.cpp:32548`). True AoE with damage falloff from epicenter.
- [ ] **Area heal** — Port `Effect_HpUp_Spot()` (`Game.cpp:32851`). AoE healing around caster.

### 3.17 — Spell Scaling

- [ ] **Magic mastery affects spell power** — Spell damage/healing should scale with the caster's magic skill mastery, not just MAG/INT stats.
- [ ] **Spell level requirements** — Higher-tier spells require minimum magic skill mastery to learn/cast.
- [ ] **Mana cost scaling** — Some spells have reduced mana cost at higher mastery levels.

---

## Validation

After implementing Phase 3, verify:
1. Poisoned players take periodic damage and can cure with potions
2. Frozen players move and attack at reduced speed
3. Invisible players are not targeted by NPCs; invisibility breaks on attack
4. Berserk increases damage but reduces defense
5. Silenced players cannot cast spells
6. Reflection bounces projectile damage back to attacker
7. Metamorphosis changes combat dice and visual appearance
8. Spell resistance checks prevent some spells from landing based on target stats
9. Knockback spells displace targets on the map
10. All effects expire correctly and can be dispelled
