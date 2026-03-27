# Phase 5 — Endgame & PvP Systems

## Goal

Implement the large-scale PvP events (crusade, Heldenian war), guild war mechanics, Gizon post-max-level progression, map type rules, and day/night gameplay effects. These are the endgame systems that give high-level players long-term goals.

**Depends on**: Phase 1 (combat), Phase 2 (boss/spawning), Phase 3 (effects), Phase 4 (reputation/penalties)

---

## Context

### Current Go Implementation

**PvP**: Basic faction system (0=neutral, 1=Aresden, 2=Elvine), PKCount/EKCount tracking, same-faction attack restriction. No tiered criminal system, no rewards, no war events.

**Guilds** (`server/internal/guild/guild.go`): Create, invite, kick, promote, demote, leave, disband. No guild wars, no war contribution, no construction.

**World** (`server/internal/world/world.go`): Day/night cycle (30 min), weather (rain/snow/fog/clear), crusade flag exists but does nothing. Arena open/closed flag.

**Max level**: No explicit cap, no post-100 progression.

### Original C++ Implementation

**Crusade Mode**: Full siege warfare with destructible structures (gates, towers, mana stones), energy spheres as objectives, construction points for building, war contribution scoring.

**Heldenian War**: Tower destruction objectives, mana stone collection, special map rules.

**Guild Wars**: Guild GUID targeting, faction war contribution, guild-level construction points from boss kills.

**Gizon System**: Post-level-100 progression where XP converts to item upgrade points and alchemy resources.

**Day/Night**: Affects weapon bonuses (Dark Executor night, Lightning Blade day) and potentially visibility.

---

## Checklist

### 5.1 — Gizon Post-Max-Level Progression

- [ ] **Set max player level** — Cap at 100 (Evil side at 90). Reference: `Game.cpp — m_iPlayerMaxLevel, m_sEvilMaxPlayerLevel`.
- [ ] **XP to Gizon conversion** — After reaching max level, XP no longer increases level. Instead, accumulated XP converts to Gizon points at defined thresholds.
- [ ] **Gizon item upgrades** — `m_iGizonItemUpgradeLeft`: Points that can be spent to upgrade item stats (increase dice, add attributes).
- [ ] **Alchemy item upgrades** — `m_iAlchimyItemUpgradeEnabled`: Enables alchemy-based item enhancement using Gizon points + materials.
- [ ] **Gizon stat allocation** — Gizon upgrades grant 3 stat points per upgrade (same as level-up), allowing continued stat growth beyond level 100.
- [ ] **Stat caps enforcement** — Each stat (STR, DEX, VIT, INT, MAG, CHR) has a hard cap (DEF_CHARPOINTLIMIT). Stats cannot exceed this even with Gizon points.

### 5.2 — Criminal Status Tiers

- [ ] **Implement tiered criminal status** — Display and enforce based on PKCount:
  | PKCount | Status | Visual | Behavior |
  |---------|--------|--------|----------|
  | 0 | Innocent | Normal name | Protected by guards |
  | 1-2 | Suspect | Yellow name | Guards warn |
  | 3-7 | Criminal | Orange name | Guards attack, reduced shop access |
  | 8-11 | Murderer | Red name | Guards attack on sight, item drops on death |
  | 12+ | Slaughterer | Dark red name | Maximum penalties, hunted by all |
- [ ] **PK decay over time** — PKCount decreases by 1 every N minutes of online play (reward good behavior).
- [ ] **Criminal flag broadcast** — Send PK status to nearby clients for name color rendering.
- [ ] **Guard NPC behavior** — Town guard NPCs target and attack players with Criminal status or above.

### 5.3 — PvP Kill Rewards

- [ ] **Port `PK_KillRewardHandler()`** — When killing a player with PKCount >= 3 (criminal+), the killer receives:
  - Reputation gain proportional to victim's PKCount
  - Gold bounty based on victim's level
  Reference: `Game.cpp:27112`.
- [ ] **Port `EnemyKillRewardHandler()`** — When killing an enemy faction player:
  - EKCount increment
  - Reputation gain
  - War contribution points (if war active)
  Reference: `Game.cpp:27127`.
- [ ] **Bounty system** — High-PK players have a bounty visible to other players. Killing them awards the bounty.

### 5.4 — Map Type Rules

- [ ] **Define map type enum**:
  - `Normal`: Full PvP, full penalties, full rewards
  - `NoPenaltyNoReward`: Safe zone — no PvP consequences (cities, starting areas)
  - `NoPCDropNoPK`: PvP allowed but no item drops on death
  - `WarZone`: Enhanced PvP rewards, reduced death penalty for attackers
  - `Arena`: No death penalty, no item loss, PvP for sport
- [ ] **Assign map types** — Each map definition includes its type. Default map, Aresden, Elvine = NoPenaltyNoReward. Middleland = Normal. Arena maps = Arena.
- [ ] **Wire map type into all systems**:
  - Death handler: Check map type before applying penalties
  - PK handler: Check map type before incrementing PKCount
  - Reward handler: Check map type before granting rewards
  - NPC behavior: Guards only exist in safe zone maps

### 5.5 — Crusade Mode (Siege Warfare)

- [ ] **Crusade state machine** — Server-wide event with states: Inactive, Preparing, Active, Concluded. Admin or timer triggers state transitions.
- [ ] **Faction scoring** — Each faction (Aresden vs Elvine) accumulates score during crusade from:
  - Enemy player kills (war contribution points)
  - Energy sphere captures
  - Structure destruction
- [ ] **Destructible structures** — Spawn siege structures on crusade maps:
  - **Gates**: High HP barriers that block movement. Destroyed by attacks.
  - **Towers**: Defensive turrets that attack enemy players in range. Destroyed by concentrated fire.
  - **Mana Stones**: Objectives that grant faction-wide buffs when captured.
  Reference: C++ `cActionLimit == 4` (Energy Sphere), `cActionLimit == 8` (Heldenian gates).
- [ ] **Construction points** — Players earn construction points from boss kills and enemy structure destruction. Points are spent to build/repair faction structures.
- [ ] **War contribution tracking** — `m_iWarContribution` score per player. High contributors get special rewards after crusade ends.
- [ ] **Crusade-specific XP rules** — XP gain divided by 3 during active crusade (discourages grinding during war).
- [ ] **Crusade respawn rules** — Special respawn points near faction structures instead of map center.

### 5.6 — Energy Spheres

- [ ] **Implement energy sphere objects** — Special map objects (NPC type with `cActionLimit == 4`) that serve as capture points.
- [ ] **Capture mechanic** — Player interacts with sphere. Capture takes N seconds of uninterrupted channeling. Interrupted by taking damage.
- [ ] **Sphere scoring** — Capturing a sphere awards faction points. Sphere changes color to faction's color.
- [ ] **Sphere defense** — Captured spheres can be recaptured by the opposing faction. NPCs may guard spheres.

### 5.7 — Heldenian War

- [ ] **Heldenian event state** — Separate from crusade. Focused on tower-based objectives on special Heldenian maps (`m_bIsHeldenianMap`).
- [ ] **Tower objectives** — Each faction has towers to defend and enemy towers to destroy. Tower HP tracked server-side.
- [ ] **Mana collection** — Mana stones scattered on the map. Players collect and deliver to their faction's base for points.
- [ ] **Heldenian scoring** — Faction with more towers standing and more mana collected wins.
- [ ] **Heldenian rewards** — Winning faction members receive bonus XP, gold, and reputation.

### 5.8 — Guild War System

- [ ] **Guild vs Guild declaration** — Guild masters can declare war on another guild. Requires minimum guild size.
- [ ] **Guild targeting override** — During guild war, members of opposing guilds can attack each other regardless of faction (even same-faction guilds can war).
- [ ] **Guild war contribution** — Track kills and objectives per guild during war. `m_iGuildGUID` used for targeting validation.
- [ ] **Guild construction points** — Boss kills during guild war grant construction resources for guild structures.
- [ ] **Guild war resolution** — War ends by: mutual agreement, one guild disbands, admin intervention, or time limit.
- [ ] **Guild war rewards** — Winning guild receives gold pool, reputation bonus, and bragging rights.

### 5.9 — Day/Night Gameplay Effects

- [ ] **Weapon bonuses by time of day** — Port from C++:
  - **Dark Executor**: +4 damage when `DayOrNight == Night`
  - **Lightning Blade**: +4 damage when `DayOrNight == Day`
  - Other time-sensitive equipment bonuses
- [ ] **NPC behavior by time** — Some NPCs are more active at night (undead) or day (merchants). Aggro range modifiers.
- [ ] **Visibility effects** — Night reduces visibility range for players (fog of war adjustment). Light level values already tracked in Go world.go (`Day=1.0, Dusk=0.6, Night=0.3, Dawn=0.7`).
- [ ] **Wire time of day into combat** — The combat handler needs access to current time of day to apply weapon bonuses.

### 5.10 — Weather Gameplay Effects

- [ ] **Weather combat modifiers** — Rain: reduces ranged accuracy (-10% hit). Snow: reduces movement speed (-15%). Fog: reduces aggro range (-30%).
- [ ] **Weather-specific spells** — Ice spells are stronger during snow. Fire spells are weaker during rain (optional, thematic).
- [ ] **Weather broadcast** — Already tracked in Go `world.go`. Ensure weather changes are broadcast to clients and integrated into combat calculations.

### 5.11 — Arena System

- [ ] **Arena map rules** — Arena maps have special rules: no death penalty, no item loss, no PK count changes.
- [ ] **Arena matchmaking** — Players enter arena queue. Matched by level range.
- [ ] **Arena scoring** — Track wins/losses per player. Leaderboard.
- [ ] **Arena rewards** — Winners receive arena-specific currency or items.
- [ ] **Arena modes** — 1v1 duel, team battle, free-for-all (optional expansion).

### 5.12 — Sector Activity Tracking

- [ ] **Port sector system** — Divide each map into 20x20 tile sectors. Track `iMonsterActivity` per sector.
- [ ] **Activity calculation** — Player presence, monster kills, and combat events increase sector activity.
- [ ] **Dynamic spawning** — Higher activity sectors get faster monster respawns. Low activity sectors may have monsters despawn.
- [ ] **Performance optimization** — Use sector system for efficient neighbor queries (already partially implemented as sectors in Go mapdata).

---

## Validation

After implementing Phase 5, verify:
1. Players beyond level 100 earn Gizon points instead of XP
2. Criminal players have colored names and are attacked by guards
3. Killing criminals rewards the killer with reputation and gold
4. Safe zone maps prevent all PvP penalties
5. Crusade mode activates faction scoring with destructible structures
6. Energy spheres can be captured and contested
7. Dark Executor deals +4 damage at night, Lightning Blade +4 at day
8. Weather affects ranged accuracy and movement speed
9. Guild wars allow same-faction PvP between warring guilds
10. Arena matches have no death penalties
