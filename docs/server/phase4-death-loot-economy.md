# Phase 4 — Death, Loot & Economy

## Goal

Port the C++ death penalty system (PK-tiered), complex loot tables with boss drop rates, reputation system, item attributes/enchantments, and map type rules.

**Depends on**: Phase 1 (combat/item model), Phase 2 (boss NPCs, NPC types)

---

## Context

### Current Go Implementation

**Player Death** (`server/internal/game/engine.go`):
- XP penalty: **PK-tiered** (2% innocent, 5% criminal, 10% murderer, 20% slaughterer)
- **Clears all effects and buffs on death**, recalculates combat stats
- **Skips penalty on SafeZone and Arena maps**
- Respawn after 3 seconds at map spawn center

**NPC Death** (`server/internal/game/engine.go`):
- Award XP = `npc.Type.XP`
- **Multi-tier loot**: gold always drops, 35% potion, equipment from loot tables, 0.1% rare
- **Boss loot tables**: 100% drop rate with better items
- **Item attributes**: 5% Sharp, 1% Ancient on equipment drops

**Reputation** (`server/internal/game/social_handler.go`):
- Same faction innocent kill: -50 reputation
- Criminal kill (PK >= 3): +20 reputation, gold bounty
- Enemy faction kill: +10 reputation, gold reward

---

## Checklist

### 4.1 — PK-Based Death Penalties

- [x] **Implement penalty tiers based on PKCount** — Tiered XP loss: PK 0=2%, PK 1-3=5%, PK 4-11=10%, PK 12+=20%.
- [x] **Clear all magic effects on death** — `p.Effects.ClearAll()` and `p.Buffs.ClearAll()` called in `handlePlayerDeath()`.
- [x] **Recalculate combat stats on death** — `p.RecalcCombatStats()` called after clearing effects.
- [ ] **Super Attack victim check** — `bIsSAattacked` flag reducing penalty by one tier. Deferred.

### 4.2 — Item Drops on Player Death

- [ ] **Implement item drop on death** — Criminal/murderer players drop items. Deferred: complex inventory interaction.
- [ ] **Drop items on ground** — Deferred.
- [ ] **Protected item slots** — Deferred.
- [ ] **Gold drop on death** — Deferred.

### 4.3 — Map-Type Death Rules

- [x] **Implement map type flags** — `mapdata.MapType` enum: `MapTypeNormal`, `MapTypeSafeZone`, `MapTypeArena`. `MapTypeForName()` maps names to types.
- [x] **Wire map type into death handler** — XP loss skipped on SafeZone and Arena maps.
- [x] **Safe zone identification** — Default, Aresden, Elvine, cityhalls, shops = SafeZone. ArGEvent, NewEvent = Arena. Middleland, dungeons = Normal.

### 4.4 — Reputation System

- [x] **Add Reputation field to player** — Already existed from Phase 1 (`Player.Reputation int`).
- [x] **Reputation changes on kills** — Same faction innocent: -50. Criminal kill: +20. Enemy faction: +10. Clamped ±10000.
- [ ] **Reputation affects drop rates** — Deferred: needs integration with loot system.
- [ ] **Reputation affects NPC pricing** — Deferred.
- [ ] **Reputation display** — Deferred: needs proto update.

### 4.5 — Complex Loot Tables

- [x] **Port multi-tier loot generation** — `RollMultiTierLoot()` with 4 tiers: gold (always), potion (35%), equipment (table-based), rare (0.1%).
- [x] **Boss loot tables** — `BossLootTable` with 100% drop rate. `RollBossLoot()` used when `NpcType.BossType > 0`.
- [ ] **Drop rate modifiers** — Reputation, map bonus. Deferred.
- [ ] **Loot table configuration** — Config files per NPC type. Deferred.

### 4.6 — XP Calculation Refinement

- [ ] **Port C++ XP formula** — `npc.Exp / 3` base. Skipped: current XP values are already tuned.
- [ ] **Weapon bonus XP** — +20% from special equipment. Deferred.
- [ ] **Crusade mode XP penalty** — XP / 3 during war. Deferred to Phase 5.
- [x] **XP overflow protection** — XP cannot go below 0 (clamped in death penalty).
- [x] **Port C++ level XP curve** — Done in Phase 1: `XP(n) = XP(n-1) + n * (50 + (n/17)^2)`.

### 4.7 — Item Attributes & Enchantments

- [x] **Add attribute bit field to items** — `Item.Attribute uint32` field exists. `GetAttribute()` extracts bits 20-23.
- [x] **Attribute effects on dice** — Sharp: +1 dice range. Ancient: +2 dice range. Applied in `RecalcCombatStats()`.
- [x] **Item generation with attributes** — Equipment drops: 5% Sharp, 1% Ancient. Rare tier always Ancient.
- [x] **Display attributes** — Attribute stored on item instance (visible in inventory data).

### 4.8 — Equipment Restrictions

- [x] **Stat requirements** — Already existed: `ItemDef.ReqLevel/ReqSTR/ReqDEX/ReqINT/ReqMAG`.
- [x] **Enforce on equip** — `MeetsRequirements()` checked in `handleItemEquip()`.
- [ ] **Gender restrictions** — Deferred: no gender-locked items.
- [ ] **Class restrictions** — Deferred: no class system yet.
- [ ] **Enforce on level change** — Deferred: debuffs reducing stats below requirements.

### 4.9 — Equipment Slot Expansion

- [ ] **Add Neck slot** — Deferred: needs proto/client/DB changes.
- [ ] **Add Finger slot** — Deferred.
- [ ] **Two-handed weapon logic** — Deferred.

### 4.10 — Durability Depth

- [x] **Special attack durability cost** — Critical attacks cost 15 durability vs 1 for normal. `DegradeWeaponBy()` in combat.go.
- [ ] **Magic weapon durability** — Deferred.
- [ ] **Item breakage** — Items currently disappear at 0 durability. Deferred: broken state + repair.
- [ ] **Repair system** — Blacksmith NPC repair service. Deferred.

### 4.11 — Kill Rewards

- [x] **Port `PK_KillRewardHandler()`** — Criminal kill: gold bounty = victim.Level * 10.
- [x] **Port `EnemyKillRewardHandler()`** — Enemy faction kill: gold = victim.Level * 5, EKCount++.
- [x] **Quest credit on kill** — Already existed in NPC death handler.
- [ ] **War contribution on kill** — Deferred to Phase 5.
- [ ] **Construction points** — Deferred to Phase 5.

---

## Validation

After implementing Phase 4, verify:
1. ✅ Innocent players lose 2% XP; slaughterers lose 20% XP on death
2. ✅ Safe zone maps skip all death penalties
3. ✅ Effects and buffs cleared on death
4. ✅ Reputation changes on PvP kills (±50/20/10 based on context)
5. ✅ Criminal kills award gold bounty
6. ✅ Multi-tier loot drops from monsters (gold + potions + equipment + rare)
7. ✅ Boss NPCs use special loot table with 100% drops
8. ✅ Sharp/Ancient attributes randomly roll on equipment drops
9. ✅ 684 tests pass (55 new tests)
