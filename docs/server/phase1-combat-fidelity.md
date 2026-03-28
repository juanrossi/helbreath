# Phase 1 — Core Combat Fidelity

## Goal

Replace the simplified Go combat model with the original C++ dice-based system. This is the foundation for all other phases — monster AI, status effects, and PvP all depend on accurate damage and hit calculations.

---

## Context

### Current Go Implementation (`server/internal/game/combat.go`)

- **Damage**: `iDice(DiceThrow, DiceRange) + AttackBonus`, then `damage * (STR / 500)` (multiplicative)
- **Defense**: Layered absorption — body armor, shield, cape, helm, leggings, boots each subtracted independently
- **Hit chance**: `50 + (AttackerHitRatio - TargetDefenseRatio)`, clamped 5-95%
- **Critical**: `AttackMode >= 20` with `SuperAttackLeft` counter, bonus = `level/100` percentage
- **Weapon skill mastery affects hit ratio, trains on attack (20% chance per hit)**

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

- [x] **Implement `iDice(n, sides)` function** — `server/internal/game/dice.go`. Rolls `n` dice each with `sides` faces, returns sum.
- [x] **Add SM/L dice fields to weapon definitions** — `items.ItemDef` now has `DiceThrowSM`, `DiceRangeSM`, `DiceThrowL`, `DiceRangeL` fields. All 6 weapons updated with dice values.
- [x] **Add creature size field to NPC types** — `npc.NpcType` now has `Size` field (`SizeSmall`, `SizeMedium`, `SizeLarge`). All 4 monster types assigned sizes.
- [x] **Replace `rand(min, max)` damage with `iDice()` calls** — `PlayerAttackNPC()`, `NPCAttackPlayer()`, `PlayerAttackPlayer()` all use dice-based damage.

### 1.2 — Damage Formula

- [x] **Port multiplicative STR scaling** — `damage += damage * STR / 500` in all three attack functions. Matches C++ formula.
- [x] **Add AttackBonus field** — `items.ItemDef.AttackBonus` and `npc.NpcType.AttackBonus` added. Flat bonus added after dice roll.
- [x] **Implement NPC dice-based damage** — `NPCAttackPlayer()` uses `iDice(n.Type.DiceThrow, n.Type.DiceRange) + n.Type.AttackBonus` with fallback to MinDamage/MaxDamage.

### 1.3 — Defense Model

- [x] **Separate defense into layers** — Player now has `ArmorAbs`, `ShieldAbs`, `CapeAbs`, `HelmAbs`, `LeggingsAbs`, `BootsAbs`. Each subtracted independently in combat.
- [x] **Add defense values per equipment slot** — `inventory.go` has `ArmorAbsorption()`, `ShieldAbsorption()`, `CapeAbsorption()`, `HelmAbsorption()`, `LeggingsAbsorption()`, `BootsAbsorption()`.
- [x] **Port defense ratio calculation** — `Player.DefenseRatio = EffectiveDEX + defenseSkillMastery/2 + shieldSkillMastery/3`. Calculated in `RecalcCombatStats()`.

### 1.4 — Hit Ratio System

- [x] **Replace percentage hit chance with ratio comparison** — `hitChance = 50 + (attackerHitRatio - targetDefenseRatio)`, clamped 5-95%.
- [x] **Implement weapon skill mastery contribution to hit ratio** — `Player.HitRatio = EffectiveDEX + weaponMastery/2`. Recalculated in `RecalcCombatStats()`.
- [ ] **Add equipment hit bonuses** — Hero Armor (+25), Chevalier Class (+25), special item bonuses. Deferred: requires new item types not yet defined.
- [ ] **Implement armor penalty to hit** — C++ applies a +25 base to compensate for armor penalties. Deferred: requires armor penalty system.

### 1.5 — Critical Hit System

- [x] **Replace flat 10% crit with AttackMode system** — Criticals trigger only when `AttackMode >= 20 && SuperAttackLeft > 0`.
- [x] **Port critical damage formula** — `damage += damage * level / 100` (percentage bonus, not flat 1.5x).
- [x] **Implement Super Attack counter** — `Player.SuperAttackLeft = level / 10`. Decrements per critical hit. Resets `AttackMode` to 0 when exhausted.

### 1.6 — Weapon Skill Mastery in Combat

- [x] **Wire skill mastery into hit ratio** — Weapon skill mastery / 2 added to `HitRatio` in `RecalcCombatStats()`.
- [x] **Implement skill XP gain on attack** — `trainWeaponSkill()` called after every attack. 20% chance to gain mastery for weapon skill + general Attack skill. Defense/Shield skills also train when player is hit.
- [x] **Add skill mastery caps** — Already existed: `MaxMastery=100` per skill, `MasteryCap=700` total across all skills.

### 1.7 — Weapon Special Properties

- [ ] **Flying NPC attack modifier** — Base -30 to hit flying NPCs, modified by weapon type. Deferred: no flying NPC types yet.
- [ ] **Dual wield (Main Gauche)** — Secondary weapon attacks. Deferred: requires second weapon slot.
- [ ] **Sting-Dart vs Orcs** — 2x damage multiplier. Deferred: weapon not defined yet.
- [ ] **DemonSlayer vs Demons** — +100 hit ratio, bonus damage. Deferred: weapon not defined yet.
- [ ] **Dark Executor (night)** — +4 damage at night. Deferred to Phase 5 (day/night effects).
- [ ] **Lightning Blade (day)** — +4 damage during day. Deferred to Phase 5.
- [ ] **Kloness weapons** — Necklace damage bonus. Deferred: equipment not defined yet.
- [x] **Sharp attribute** — `items.AttrSharp` (bits 20-23 value 7): +1 dice range. Applied in `RecalcCombatStats()`.
- [x] **Ancient attribute** — `items.AttrAncient` (bits 20-23 value 9): +2 dice range. Applied in `RecalcCombatStats()`.

### 1.8 — Equipment Stat Recalculation

- [x] **Port `CalcTotalItemEffect()`** — `Player.RecalcCombatStats()` recalculates all derived stats: HitRatio, DefenseRatio, all absorption layers, weapon dice, attribute bonuses. Called after equip/unequip, level up, stat allocation.
- [x] **Add stat requirements for equipment** — Already existed: `ItemDef.ReqLevel/ReqSTR/ReqDEX/ReqINT/ReqMAG` and `Player.MeetsRequirements()`. Enforced in `handleItemEquip()`.
- [ ] **Add equipment positions** — Expand from 7 slots to 10: add Neck, Finger, TwoHand distinction. Deferred: requires proto/client/DB changes.

### 1.9 — XP Formula (Bonus)

- [x] **Port C++ XP curve** — `XPForLevel()` now uses the recursive formula `XP(n) = XP(n-1) + n * (50 + (n/17)^2)` instead of `n^2 * 100`. Steeper curve at high levels.
- [x] **DegradeWeaponBy(amount)** — Special attacks cost 15 durability (critical hits) vs 1 for normal attacks.

---

## Validation

After implementing Phase 1, verify:
1. ✅ Damage uses dice rolls (`iDice`) with STR multiplicative scaling
2. ✅ Hit/miss rates use HitRatio vs DefenseRatio comparison (50 base, clamped 5-95%)
3. ✅ Critical hits trigger only on AttackMode >= 20, not randomly
4. ✅ Equipping/unequipping items correctly recalculates all derived stats via `RecalcCombatStats()`
5. ✅ Weapon skill mastery increases over time with use (20% chance per attack)
6. ✅ All 591 tests pass
