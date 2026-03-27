# Phase 1 — Core Combat Fidelity

## Goal

Replace the simplified Go combat model with the original C++ dice-based system. This is the foundation for all other phases — monster AI, status effects, and PvP all depend on accurate damage and hit calculations.

---

## Context

### Current Go Implementation (`server/internal/game/combat.go`)

- **Damage**: `rand(weapon.Min, weapon.Max) + STR/3 + Level`
- **Defense**: `VIT/5 + armorDefense`, capped at 80% of base damage
- **Hit chance**: `50 + (attackerDEX - targetDEX) * 2`, clamped 10-95%
- **Critical**: Flat 10% chance, 1.5x multiplier
- **No weapon skill integration, no separate dice for creature sizes, no armor/shield/cape absorption layers**

### Original C++ Implementation (`Game.cpp:60905 — iCalculateAttackEffect`)

- **Damage**: `iDice(DiceThrow, DiceRange) + AttackBonus`, then `damage += damage * (STR / 500.0)` (multiplicative scaling)
- **Two dice sets per weapon**: `DiceThrow_SM / DiceRange_SM` (small/medium creatures) and `DiceThrow_L / DiceRange_L` (large creatures)
- **Defense**: Separate `DefenseRatio`, `AP_Abs_Armor`, `AP_Abs_Shield`, `AP_Abs_Cape` — each subtracted independently
- **Hit ratio**: `AttackerHitRatio` (base + weapon skill mastery + equipment bonuses) vs `TargetDefenseRatio`
- **Critical**: `AttackMode >= 20` triggers critical, bonus = `level/100` percentage
- **Weapon skill mastery**: Each weapon type (sword, axe, hammer, bow, staff, dagger) has a mastery level that adds to hit ratio

---

## Checklist

### 1.1 — Dice System

- [ ] **Implement `iDice(n, sides)` function** — Roll `n` dice each with `sides` faces, return sum. This is the core randomizer used everywhere in C++ (`Game.cpp` throughout).
- [ ] **Add SM/L dice fields to weapon definitions** — Each weapon needs `DiceThrow_SM`, `DiceRange_SM`, `DiceThrow_L`, `DiceRange_L`. Reference: C++ weapon config loading.
- [ ] **Add creature size field to NPC types** — NPCs need a `Size` field (Small/Medium vs Large) to select which dice set to use.
- [ ] **Replace `rand(min, max)` damage with `iDice()` calls** in `PlayerAttackNPC()`, `NPCAttackPlayer()`, `PlayerAttackPlayer()`.

### 1.2 — Damage Formula

- [ ] **Port multiplicative STR scaling** — Change from `STR/3` (additive) to `damage * (STR / 500.0)` (multiplicative). The C++ formula: `iDamage += (iDamage * (iStr + iAngelicStr) / 500.0)`. Reference: `Game.cpp:~60950`.
- [ ] **Add AttackBonus field** — Weapons have a flat `AttackBonus` added after dice roll, before STR scaling.
- [ ] **Implement NPC dice-based damage** — NPCs in C++ also use `iDice(AttackDiceThrow, AttackDiceRange)` instead of `rand(MinDamage, MaxDamage)`. Port this to `NPCAttackPlayer()`.

### 1.3 — Defense Model

- [ ] **Separate defense into layers** — Replace single `VIT/5 + armorDefense` with:
  - `DefenseRatio` — base dodge/mitigation ratio (from DEX, equipment, skills)
  - `AP_Abs_Armor` — flat damage absorbed by body armor
  - `AP_Abs_Shield` — flat damage absorbed by shield
  - `AP_Abs_Cape` — flat damage absorbed by cape
- [ ] **Add defense values per equipment slot** — Each armor piece needs its own absorption value, not just a single "defense" stat.
- [ ] **Port defense ratio calculation** — `TargetDefenseRatio` in C++ considers DEX, shield skill, armor penalties, and equipment bonuses. Reference: `Game.cpp — CalcTotalItemEffect:34964`.

### 1.4 — Hit Ratio System

- [ ] **Replace percentage hit chance with ratio comparison** — C++ uses `AttackerHitRatio vs TargetDefenseRatio` to determine hit/miss, not a flat `50 + DEX_diff * 2`.
- [ ] **Implement weapon skill mastery contribution to hit ratio** — Each weapon type skill (sword, axe, etc.) adds its mastery level to `AttackerHitRatio`. Reference: `Game.cpp — m_cSkillMastery[]` arrays.
- [ ] **Add equipment hit bonuses** — Hero Armor (+25), Chevalier Class (+25), special item bonuses all add to hit ratio.
- [ ] **Implement armor penalty to hit** — C++ applies a +25 base to compensate for armor penalties on the attacker side.

### 1.5 — Critical Hit System

- [ ] **Replace flat 10% crit with AttackMode system** — C++ triggers criticals when `iAttackMode >= 20`, not a random percentage.
- [ ] **Port critical damage formula** — Critical bonus = `level / 100` as a percentage multiplier on damage (not a flat 1.5x).
- [ ] **Implement Super Attack counter** — `m_iSuperAttackLeft` tracks remaining combo attacks (max = `level / 10`). Decrements per critical. Reference: `Game.cpp:~60920`.

### 1.6 — Weapon Skill Mastery in Combat

- [ ] **Wire skill mastery into hit ratio** — `m_cSkillMastery[weaponSkillIndex]` adds directly to attacker hit ratio.
- [ ] **Implement skill XP gain on attack** — Each successful attack has a chance to increase the corresponding weapon skill mastery. C++ uses `_iCalcSkillSSNpoint()` for the required XP curve.
- [ ] **Add skill mastery caps** — 0-99 per skill, with `m_sCharSkillLimit` total across all skills.

### 1.7 — Weapon Special Properties

- [ ] **Flying NPC attack modifier** — Base -30 to hit flying NPCs, modified by weapon type: Long Sword +20, Axe +30, Hammer +50, Bow -100, Monk Special +70. Reference: `Game.cpp:~61000+`.
- [ ] **Dual wield (Main Gauche)** — Secondary weapon attacks using `m_iHitRatio3 + skillMastery[20]`. Triggers as a bonus attack when main-hand hits.
- [ ] **Sting-Dart vs Orcs** — 2x damage multiplier + potential berserk trigger.
- [ ] **DemonSlayer vs Demons** — +100 hit ratio, +`iDice(1, 2*AP_L/3)` bonus damage.
- [ ] **Dark Executor (night)** — +4 damage when `m_cDayOrNight == 2`.
- [ ] **Lightning Blade (day)** — +4 damage when `m_cDayOrNight == 1`.
- [ ] **Kloness weapons** — Additional misc damage bonus from necklace: `cKlonessNeckDamageBonus - (reputation/100)`.
- [ ] **Sharp attribute** — Item attribute bits 20-23 value 7: increased dice ranges.
- [ ] **Ancient attribute** — Item attribute bits 20-23 value 9: increased dice ranges.

### 1.8 — Equipment Stat Recalculation

- [ ] **Port `CalcTotalItemEffect()`** — Full stat recalculation on every equip/unequip. Updates hit ratio, defense ratio, HP, SP, attack dice. Reference: `Game.cpp:34964`.
- [ ] **Add stat requirements for equipment** — STR/DEX/INT minimums to equip items. Gender/class/level restrictions. Reference: `Game.cpp:13510 — bEquipItemHandler`.
- [ ] **Add equipment positions** — Expand from 7 slots to 10: add Neck, Finger, TwoHand distinction (TwoHand blocks both RHand and LHand).

---

## Validation

After implementing Phase 1, verify:
1. Damage output for a Level 10 player with a Long Sword vs a Slime matches C++ expected ranges
2. Hit/miss rates for equal-level combatants are approximately 50-60%
3. Critical hits trigger only on combo/special attacks, not randomly
4. Equipping/unequipping items correctly recalculates all derived stats
5. Weapon skill mastery increases over time with use
