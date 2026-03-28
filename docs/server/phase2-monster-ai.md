# Phase 2 — Monster AI & Spawning

## Goal

Port the full C++ NPC behavior state machine, faction-aware targeting, NPC spellcasting, boss mechanics, and configurable spawn system. The current Go AI is a basic 5-state machine (Idle/Wander/Chase/Attack/Dead) with nearest-player aggro and no faction awareness.

---

## Context

### Current Go Implementation (`server/internal/npc/npc.go`, `server/internal/game/engine.go`)

- 6 AI states: Idle, Wander, Chase, Attack, Dead, **Flee**
- Aggro: find nearest player within `AggroRange`, **filtered by faction and admin immunity**
- Movement: 8-directional, speed-limited by `MoveSpeed`, bounded to `WanderRange`
- Chase gives up at 2x WanderRange from spawn
- Respawn: **per-NPC-type configurable** (Slime=10s, Skeleton=15s, Orc=20s, Demon=30s)
- **Faction filtering, admin immunity, criminal targeting implemented**
- **Spawn points configurable via JSON** (`data/spawns.json`) with fallback to hardcoded defaults

### Original C++ Implementation

- **NpcBehavior_Move()** (`Game.cpp:10933`): Waypoint pathing, tamed mob immunity, follow/random modes, 5-turn recalculation
- **NpcBehavior_Attack()** (`Game.cpp:11262`): Multiple attack AI patterns (EXCHANGEATTACK, TWOBYONEATTACK), target search within range
- **NpcBehavior_Flee()** (`Game.cpp:12321`): Danger value calculation, flee threshold, used for vulnerable NPCs
- **NpcBehavior_Stop()** (`Game.cpp:30521`): Fixed merchants, dummy NPCs, crops
- **NpcBehavior_Dead()** (`Game.cpp:63114`): Death state with respawn timer
- **TargetSearch()** (`Game.cpp:11147`): Faction-aware, excludes admins/invisible/same-side
- **FarTargetSearch()** (`Game.cpp:11062`): Long-range targeting with probabilistic lock
- **NpcMagicHandler()** (`Game.cpp:20654`): NPCs cast spells using mana pool

---

## Checklist

### 2.1 — Flee Behavior

- [x] **Implement `NpcBehavior_Flee` state** — `StateFlee` added to AI state machine in `engine.go:processNPCTick()`. NPC moves away from danger when HP drops below threshold. Transitions to `StateWander` after fleeing 5+ tiles or losing target.
- [ ] **Port danger value calculation** — `iGetDangerValue()` scans surrounding tiles. Deferred: current implementation uses simple HP% threshold instead.
- [x] **Add flee-capable NPC flag** — `NpcType.CanFlee` and `NpcType.FleeHPPct` fields. Orc set to flee at 15% HP. `NPC.ShouldFlee()` method checks these.
- [x] **Flee destination selection** — `NPC.DirectionAwayFrom()` moves opposite to danger source. If blocked by terrain, tries random adjacent direction.

### 2.2 — Faction-Aware Targeting

- [x] **Port the NPC side/faction system** — `NpcType.Side` field: `SideNeutral=0`, `SideAresden=1`, `SideElvine=2`, `SideSpecial=3`, `SideMonster=10`. `npcCanTarget()` method implements faction rules.
- [x] **Filter targets by faction in TargetSearch** — `findNearestPlayer()` now calls `npcCanTarget()` to exclude same-side players, admin players, and respect faction rules.
- [x] **Implement criminal override** — Players with `PKCount >= 3` can be attacked by same-side NPCs (guard behavior).
- [x] **Add admin immunity** — `findNearestPlayer()` skips players with `AdminLevel > 0`.

### 2.3 — Advanced Target Search

- [ ] **Port `TargetSearch()`** — Close-range grid scan. Deferred: current implementation uses distance-based scan which is functionally equivalent.
- [ ] **Port `FarTargetSearch()`** — Long-range targeting with probabilistic lock. Deferred: requires ranged NPC types.
- [ ] **Target priority system** — Criminal priority, closest, lowest HP. Deferred: current implementation uses closest valid target.
- [x] **Target memory** — NPCs remember target via `TargetID` field across ticks, with faction filtering applied.

### 2.4 — Attack AI Patterns

- [ ] **Implement EXCHANGEATTACK pattern** — Hit-and-run. Deferred: requires attack pattern field on NPC types.
- [ ] **Implement TWOBYONEATTACK pattern** — Flanking coordination. Deferred: complex multi-NPC coordination.
- [ ] **Implement basic ranged attack** — NPCs with AttackRange > 1. Deferred: requires ranged NPC types.
- [ ] **Add attack pattern field to NPC types** — Deferred: no ranged/skirmisher NPCs defined yet.

### 2.5 — NPC Spellcasting

- [ ] **Add mana pool to NPCs** — Fields exist (`Mana`, `MaxMana`, `MagicHitRatio` on NpcType) but no spell logic yet. Deferred to Phase 3.
- [ ] **Port `NpcMagicHandler()`** — Deferred to Phase 3 (requires status effects system).
- [ ] **Spell selection logic** — Deferred to Phase 3.
- [ ] **NPC healing** — Deferred to Phase 3.
- [ ] **NPC buff/debuff** — Deferred to Phase 3.

### 2.6 — Waypoint Pathing

- [ ] **Implement waypoint system** — Deferred: no patrol route NPCs needed for MVP.
- [ ] **Port `CalcNextWayPointDestination()`** — Deferred.
- [ ] **Add waypoint definitions to spawn config** — Deferred.

### 2.7 — Boss Mechanics

- [x] **Add boss NPC type flag** — `NpcType.BossType` field (0=regular, 1=boss). `NpcType.SpecialAbility` string field for death effects.
- [ ] **Boss spawn system** — Timer/trigger based spawning. Deferred: requires event system.
- [ ] **Admin boss commands** — Summon/unsummon. Deferred: requires admin command system.
- [ ] **Boss special abilities** — Explosive death, AoE on death. Deferred to Phase 3.
- [ ] **Boss aggro table** — Damage tracking per player. Deferred: no boss NPCs defined yet.

### 2.8 — Configurable Spawn System

- [x] **Move spawn definitions out of code** — `spawn_config.go` with `SpawnConfig`/`SpawnEntry` structs. Loads from `data/spawns.json` with fallback to `DefaultSpawnConfig()`. Each entry has: map_name, npc_type_id, count, spawn_x, spawn_y, spawn_radius, respawn_delay.
- [x] **Variable respawn timers** — Per-NPC-type delays: Slime=10s, Skeleton=15s, Orc=20s, Demon=30s. `NpcType.RespawnDelay` field used by `NewNPC()`. Spawn config entries can override with `respawn_delay`.
- [ ] **Spawn groups** — Multiple NPCs linked to one spawn event. Deferred: spawn config supports `count` per entry but no group coordination.
- [ ] **Activity-based spawning** — Sector activity tracking. Deferred to Phase 5.
- [ ] **Spawn caps per area** — Maximum alive per spawn point. Deferred.

### 2.9 — Taming System

- [ ] **Implement taming skill check** — Deferred: requires dedicated client interaction.
- [ ] **Tamed NPC follow mode** — Deferred.
- [ ] **Tamed NPC combat** — Deferred.
- [ ] **Tame duration** — Deferred.
- [ ] **Tame immunity** — Deferred.

---

## Validation

After implementing Phase 2, verify:
1. ✅ Faction-aware NPCs (SideMonster) attack all players; non-aggressive NPCs never target
2. ✅ Orcs flee when HP drops below 15%
3. ✅ Admin players are never targeted by NPCs
4. ✅ Criminal players (PKCount >= 3) can be attacked by same-faction NPCs
5. ✅ Spawn config loadable from JSON with fallback to defaults
6. ✅ Variable respawn timers per NPC type
7. ✅ All 591 tests pass
