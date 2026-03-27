# Phase 2 — Monster AI & Spawning

## Goal

Port the full C++ NPC behavior state machine, faction-aware targeting, NPC spellcasting, boss mechanics, and configurable spawn system. The current Go AI is a basic 5-state machine (Idle/Wander/Chase/Attack/Dead) with nearest-player aggro and no faction awareness.

---

## Context

### Current Go Implementation (`server/internal/npc/npc.go`, `server/internal/game/engine.go`)

- 5 AI states: Idle, Wander, Chase, Attack, Dead
- Aggro: find nearest player within `AggroRange`
- Movement: 8-directional, speed-limited by `MoveSpeed`, bounded to `WanderRange`
- Chase gives up at 2x WanderRange from spawn
- Respawn: fixed 15 seconds for all NPCs
- No faction filtering, no invisibility checks, no NPC spellcasting
- Spawn points hardcoded in `engine.go`

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

- [ ] **Implement `NpcBehavior_Flee` state** — New AI state where NPC moves away from danger. Triggered when NPC HP drops below a threshold (e.g., 20%).
- [ ] **Port danger value calculation** — `iGetDangerValue()` (`Game.cpp:12287`) scans surrounding tiles and sums up threat from nearby players/NPCs. NPC flees when cumulative danger exceeds its threshold.
- [ ] **Add flee-capable NPC flag** — Not all NPCs flee. In C++, chickens and weak creatures use flee behavior. Add a `CanFlee` or `FleeThreshold` field to NPC type definitions.
- [ ] **Flee destination selection** — NPC moves in the direction opposite to the highest danger source. If cornered, pick random safe direction.

### 2.2 — Faction-Aware Targeting

- [ ] **Port the NPC side/faction system** — NPCs have a `Side` field:
  - Side 0-3: Won't attack same-side players unless criminal
  - Side 10: Monster faction, attacks opposing factions
  - Side 4: Won't attack Side 10 mobs (special alliance)
- [ ] **Filter targets by faction in TargetSearch** — When scanning for aggro targets, exclude players of the same side, admin players (`AdminLevel != 0`), and invisible players (`cMagicEffectStatus[INVISIBILITY]`).
- [ ] **Implement criminal override** — Players flagged as criminal (PKCount >= 3) can be attacked by same-side NPCs (guards).
- [ ] **Add admin immunity** — NPCs never target players with `AdminLevel > 0`.

### 2.3 — Advanced Target Search

- [ ] **Port `TargetSearch()`** — Close-range scan within `cTargetSearchRange`. Iterates grid cells around NPC, evaluates each entity against faction/visibility/admin rules, returns closest valid target. Reference: `Game.cpp:11147`.
- [ ] **Port `FarTargetSearch()`** — Long-range scan within `m_iAttackRange`. Has a 1/4 probability to lock onto a target at exact max range (simulates spotting at distance). Reference: `Game.cpp:11062`.
- [ ] **Target priority system** — When multiple valid targets exist, prefer:
  1. Criminal players (for guard NPCs)
  2. Closest player
  3. Lowest HP player (for smart monsters)
- [ ] **Target memory** — NPCs should remember their target across ticks (already partially done via `TargetPlayerID` in Go, but needs faction filtering).

### 2.4 — Attack AI Patterns

- [ ] **Implement EXCHANGEATTACK pattern** — Hit-and-run: NPC attacks once then moves away, attacks again next cycle. Used by ranged/skirmisher NPCs.
- [ ] **Implement TWOBYONEATTACK pattern** — NPC coordinates with nearby ally NPCs to flank target from two directions.
- [ ] **Implement basic ranged attack** — NPCs with `AttackRange > 1` should attack from distance without chasing into melee. Stop at attack range and fire.
- [ ] **Add attack pattern field to NPC types** — Each NPC type specifies which attack AI pattern to use (basic melee, exchange, ranged, etc.).

### 2.5 — NPC Spellcasting

- [ ] **Add mana pool to NPCs** — `Mana` and `MaxMana` fields on NPC types. Mana regenerates over time.
- [ ] **Port `NpcMagicHandler()`** — NPCs can cast spells from a configured spell list. Each NPC type defines which spells it knows and the `MagicHitRatio` for landing them. Reference: `Game.cpp:20654`.
- [ ] **Spell selection logic** — NPC chooses spell based on:
  - Distance to target (AoE for groups, single-target for isolated)
  - Mana availability (prefer cheap spells when low)
  - Cooldowns
- [ ] **NPC healing** — Some NPCs (priests, bosses) can cast healing spells on themselves or allies when HP is low.
- [ ] **NPC buff/debuff** — Boss NPCs cast buffs on themselves (berserk, protection) and debuffs on players (slow, silence).

### 2.6 — Waypoint Pathing

- [ ] **Implement waypoint system** — NPCs can follow a sequence of waypoints instead of random wandering. Useful for patrol routes and guard NPCs.
- [ ] **Port `CalcNextWayPointDestination()`** — Calculates the next point on the NPC's path. Every 5 behavior turns, check if destination reached and recalculate. Reference: `Game.cpp:29764`.
- [ ] **Add waypoint definitions to spawn config** — Spawn points can optionally include a list of patrol waypoints.

### 2.7 — Boss Mechanics

- [ ] **Add boss NPC type flag** — `iNpcBossType` field: 0 = regular, 1 = boss. Bosses have unique loot tables, higher stats, and special abilities.
- [ ] **Boss spawn system** — Bosses spawn on specific triggers (timer, player activity, admin command) rather than fixed respawn.
- [ ] **Admin boss commands** — `AdminOrder_UnsummonBoss()` to despawn, `AdminOrder_SetBossAdjust()` to modify boss parameters at runtime.
- [ ] **Boss special abilities** — NPC Special Ability flags:
  - Ability 7: Explosive death — triggers AoE damage spell (magic 30) on death
  - Ability 8: Critical explosive death — triggers stronger AoE (magic 61) on death
- [ ] **Boss aggro table** — Bosses track damage dealt by each player and target the highest-damage dealer (not just nearest).

### 2.8 — Configurable Spawn System

- [ ] **Move spawn definitions out of code** — Replace hardcoded spawn lists in `engine.go` with a config file (JSON/TOML) per map. Each entry: NPC type, count, spawn area (x, y, radius), respawn delay, wander range.
- [ ] **Variable respawn timers** — Different NPC types have different respawn delays (currently fixed 15s). Bosses: 5-30 minutes. Regular mobs: 15-60 seconds based on difficulty.
- [ ] **Spawn groups** — Multiple NPCs linked to one spawn event (e.g., an orc patrol of 3-5 orcs spawns together).
- [ ] **Activity-based spawning** — Port sector activity tracking: divide map into 20x20 sectors (`m_stTempSectorInfo`), track player activity per sector, spawn more monsters in active sectors. Reference: `Game.cpp — iMonsterActivity`.
- [ ] **Spawn caps per area** — Maximum number of NPCs alive per spawn point. Don't spawn new ones until existing ones die.

### 2.9 — Taming System

- [ ] **Implement taming skill check** — Player uses Taming skill on NPC. Success based on skill mastery vs NPC difficulty. Reference: C++ `m_dwTamingTime`.
- [ ] **Tamed NPC follow mode** — Tamed NPCs follow their owner (behavior mode = FOLLOW instead of RANDOM).
- [ ] **Tamed NPC combat** — Tamed NPCs attack what their owner attacks (assist mode).
- [ ] **Tame duration** — Taming is temporary, tracked by `m_dwTamingTime`. NPC reverts to wild when timer expires.
- [ ] **Tame immunity** — Tamed mobs are immune to `NpcBehavior_Move` random wandering.

---

## Validation

After implementing Phase 2, verify:
1. Guard NPCs attack criminal players but ignore innocent same-faction players
2. Weak NPCs (chickens, slimes at low HP) flee from players
3. Boss NPCs cast spells, self-heal, and use AoE when multiple players are nearby
4. NPCs with ranged attacks stop at range instead of chasing into melee
5. Spawn config files correctly populate maps on server start
6. Variable respawn timers work — bosses take minutes, regular mobs take seconds
7. Tamed NPCs follow their owner and assist in combat
