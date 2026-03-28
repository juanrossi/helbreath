# Phase 5 — Endgame & PvP Systems

## Goal

Implement large-scale PvP infrastructure, Gizon post-max-level progression, criminal status tiers, map type rules, day/night gameplay effects, and stat caps.

**Depends on**: Phase 1 (combat), Phase 2 (boss/spawning), Phase 3 (effects), Phase 4 (reputation/penalties)

---

## Context

### Current Go Implementation

**PvP**: Faction system (0=neutral, 1=Aresden, 2=Elvine), PKCount/EKCount, reputation system (±10000), criminal status tiers, PK decay over time.

**Guilds**: Create, invite, kick, promote, demote, leave, disband, guild chat.

**World**: Day/night cycle (30 min), weather (rain/snow/fog/clear), **fog reduces NPC aggro by 30%**, **day/night weapon bonuses**.

**Max level**: Capped at 100. Post-100 XP converts to Gizon points.

**Stat caps**: Each stat capped at 100.

---

## Checklist

### 5.1 — Gizon Post-Max-Level Progression

- [x] **Set max player level** — `MaxLevel = 100` constant in `combat.go`. `CheckLevelUp()` stops at level 100.
- [x] **XP to Gizon conversion** — After level 100, excess XP converts to Gizon points at 1 point per 10,000 XP. Remainder preserved.
- [x] **Gizon item upgrades** — `Player.GizonItemUpgradeLeft` field added for future item upgrade system.
- [ ] **Alchemy item upgrades** — Deferred: requires alchemy integration.
- [ ] **Gizon stat allocation** — Deferred: could allow further stat growth beyond 100.
- [x] **Stat caps enforcement** — Each stat (STR, VIT, DEX, INT, MAG, CHR) capped at `MaxStatValue = 100`. Enforced in `handleStatAlloc()`.

### 5.2 — Criminal Status Tiers

- [x] **Implement tiered criminal status** — `criminal.go` with `GetCriminalStatus()`:
  | PKCount | Tier | Name |
  |---------|------|------|
  | 0 | 0 | Innocent |
  | 1-2 | 1 | Suspect |
  | 3-7 | 2 | Criminal |
  | 8-11 | 3 | Murderer |
  | 12+ | 4 | Slaughterer |
- [x] **PK decay over time** — Every 10 minutes of online play, PKCount decrements by 1. Tracked via `Player.LastPKDecayTime`.
- [ ] **Criminal flag broadcast** — Name color rendering based on tier. Deferred: needs client-side update.
- [ ] **Guard NPC behavior** — Town guards attacking criminals. Partially done: faction-aware targeting from Phase 2 attacks players with PKCount >= 3.

### 5.3 — PvP Kill Rewards

- [x] **Port `PK_KillRewardHandler()`** — Criminal kill: gold bounty = victim.Level * 10, reputation +20. Done in Phase 4.
- [x] **Port `EnemyKillRewardHandler()`** — Enemy faction kill: gold = victim.Level * 5, EKCount++, reputation +10. Done in Phase 4.
- [ ] **Bounty system** — Visible bounty on high-PK players. Deferred.

### 5.4 — Map Type Rules

- [x] **Define map type enum** — `MapTypeNormal`, `MapTypeSafeZone`, `MapTypeArena`. Done in Phase 4.
- [x] **Assign map types** — Cities = SafeZone, event maps = Arena, combat zones = Normal. Done in Phase 4.
- [x] **Wire map type into death handler** — XP penalty skipped on SafeZone/Arena. Done in Phase 4.

### 5.5 — Crusade Mode (Siege Warfare)

- [ ] **Crusade state machine** — Deferred: massive feature requiring dedicated effort.
- [ ] **Faction scoring** — Deferred.
- [ ] **Destructible structures** — Deferred.
- [ ] **Construction points** — Deferred.
- [ ] **War contribution tracking** — Deferred.
- [ ] **Crusade-specific XP rules** — Deferred.
- [ ] **Crusade respawn rules** — Deferred.

### 5.6 — Energy Spheres

- [ ] **Implement energy sphere objects** — Deferred.
- [ ] **Capture mechanic** — Deferred.
- [ ] **Sphere scoring** — Deferred.
- [ ] **Sphere defense** — Deferred.

### 5.7 — Heldenian War

- [ ] **Heldenian event state** — Deferred.
- [ ] **Tower objectives** — Deferred.
- [ ] **Mana collection** — Deferred.
- [ ] **Heldenian scoring** — Deferred.
- [ ] **Heldenian rewards** — Deferred.

### 5.8 — Guild War System

- [ ] **Guild vs Guild declaration** — Deferred.
- [ ] **Guild targeting override** — Deferred.
- [ ] **Guild war contribution** — Deferred.
- [ ] **Guild construction points** — Deferred.
- [ ] **Guild war resolution** — Deferred.
- [ ] **Guild war rewards** — Deferred.

### 5.9 — Day/Night Gameplay Effects

- [x] **Weapon bonuses by time of day** — `ItemDef.DayBonus` and `ItemDef.NightBonus` fields. `CalcDayNightBonus()` checks equipped weapon and world phase. Applied in NPC and PvP attack handlers.
- [ ] **NPC behavior by time** — Undead more active at night. Deferred.
- [ ] **Visibility effects** — Night reduces visibility. Deferred: needs client integration.
- [x] **Wire time of day into combat** — Engine caches `CurrentWorldPhase` from world state, used by combat handlers.

### 5.10 — Weather Gameplay Effects

- [ ] **Rain: ranged accuracy** — -10% hit. Deferred: no ranged combat yet.
- [ ] **Snow: movement speed** — -15% for all. Deferred.
- [x] **Fog: aggro range** — NPC aggro range reduced by 30% during fog. Applied in `processNPCTick()`.
- [ ] **Weather-specific spells** — Ice stronger in snow, fire weaker in rain. Deferred.
- [x] **Weather broadcast** — Engine caches `CurrentWeather` from world state.

### 5.11 — Arena System

- [ ] **Arena map rules** — Arena maps have no death penalty (done via MapTypeArena in Phase 4).
- [ ] **Arena matchmaking** — Deferred.
- [ ] **Arena scoring** — Deferred.
- [ ] **Arena rewards** — Deferred.
- [ ] **Arena modes** — Deferred.

### 5.12 — Sector Activity Tracking

- [ ] **Port sector system** — Deferred.
- [ ] **Activity calculation** — Deferred.
- [ ] **Dynamic spawning** — Deferred.
- [ ] **Performance optimization** — Deferred.

---

## Validation

After implementing Phase 5, verify:
1. ✅ Players at level 100 stop leveling and earn Gizon points instead
2. ✅ Criminal status tiers correctly categorize players by PKCount
3. ✅ PK decay reduces PKCount by 1 every 10 minutes of online time
4. ✅ Stat allocation enforces cap of 100 per stat
5. ✅ Day/Night weapon bonus infrastructure works (DayBonus/NightBonus on items)
6. ✅ Fog weather reduces NPC aggro range by 30%
7. ✅ 698 tests pass (14 new tests)
