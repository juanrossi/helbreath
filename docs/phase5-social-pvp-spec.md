# Phase 5: Social & PvP Specification

## Overview
Phase 5 adds faction selection, guild system, party system, PvP combat with criminal/PK tracking, whisper/guild chat channels, player trading, and death penalties.

---

## 5.1 Faction System

### Factions
| ID | Name | Home City | Spawn Map |
|----|------|-----------|-----------|
| 0 | Neutral/Traveller | None | default |
| 1 | Aresden | Aresden | aresden |
| 2 | Elvine | Elvine | elvine |

### Faction Selection
- Available at Cityhall NPC
- **Requirements**: Level >= 10
- **Irreversible**: Cannot change faction once selected
- Choosing a faction:
  - Sets `m_cSide` to 1 or 2
  - Changes home city and respawn point
  - Unlocks faction-specific quests and equipment
  - Enables cross-faction PvP in contested areas

### Faction Effects
- **Home city access**: Players cannot normally enter enemy city
  - Entering enemy city triggers force recall timer
  - Executors have special access restrictions during crusade
- **Respawn location**: Death respawns at faction home city
- **Shop access**: Faction-specific items at faction shops
- **Quest access**: Faction quests from cityhall/guild NPCs

### Map Access Rules
- `iGetMapLocationForbiddenSide()` determines which faction is blocked per map
- Aresden cities block Elvine players
- Elvine cities block Aresden players
- Middleland, hunt zones, dungeons: open to all

---

## 5.2 Criminal/PK System

### PK Count Tracking
- `m_iPKCount`: Incremented when killing innocent (0 PK) same-faction players
- Killing enemy faction: increments `m_iEKCount` (Enemy Kill, no penalty)
- Killing criminal players: no PK penalty for attacker

### Criminal Status Tiers
| PK Count | Status | Effects |
|----------|--------|---------|
| 0 | Innocent | Normal gameplay |
| 1-3 | Criminal | Attackable by anyone, 3% death XP loss |
| 4-11 | Murderer | 6% death XP loss, restricted from some NPCs |
| 12+ | Slaughterer | 12% death XP loss, KOS by guards |

### PK Penalties
- Criminal status visible to other players (name color change)
- Same-faction players can attack criminals without PK penalty
- Guard NPCs target criminals on sight
- Higher death penalties (XP loss scaling)

### Rating System
- `m_iRating`: Reputation score
- Killing criminals: +rating
- Killing innocents: -rating
- High rating (3000+): up to 4x item drops from NPCs
- Righteous weapons scale damage with `(attacker_rating - target_rating) / 50`

---

## 5.3 Guild System

### Guild Creation Requirements
1. **Level >= 20**
2. **Charisma >= 20**
3. **Not already in a guild** (`guildRank == -1`)
4. **In guild city** (player location matches city map)
   - OR Equilibrium mode enabled

### Guild Structure
- **Guild Name**: 20 chars max, unique
- **Guild GUID**: Unique identifier
- **Faction**: Must match creator's faction

### Guild Ranks
| Rank | Name | Permissions |
|------|------|------------|
| 0 | Guild Master | Full control: invite, kick, promote, disband |
| 1-11 | Officers | Varies by rank |
| 12+ | Members | Basic membership |

### Guild Master Requirements
- Must maintain CHR >= 20 (checked periodically)
- If CHR drops below 20: guild master demotion

### Guild Features
- **Invite**: Guild master sends invite, target accepts/declines
- **Kick**: Guild master removes member
- **Disband**: Guild master dissolves guild
- **Guild chat**: Faction-wide for guild members
- **Guild hall teleport**: Teleport to guild headquarters
- **Construction points**: Earned through crusade participation
- **Guild wars**: Declared during crusade events

---

## 5.4 Party System

### Party Formation
- Leader invites up to 7 other players (8 total)
- Invited player must accept
- Must be on same map

### Party Benefits
- **Shared XP**: XP multiplied by party bonus, then divided equally
- **Proximity bonus**: Only members within sector range get XP

### Party XP Table
| Members | Multiplier | Per Player |
|---------|-----------|------------|
| 1 | 1.00x | 100% |
| 2 | 1.10x | 55% |
| 3 | 1.10x | 36.7% |
| 4 | 1.15x | 28.75% |
| 5 | 1.15x | 23% |
| 6 | 1.20x | 20% |
| 7 | 1.20x | 17.1% |
| 8 | 1.20x | 15% |

### Party Chat
- Party members have private chat channel
- Visible only to party members

---

## 5.5 Chat Channels

### Channel Types
| Type | Command | Range | Color | Access |
|------|---------|-------|-------|--------|
| Normal | (default) | 3x3 sectors | White | All players |
| Shout | `!message` | Entire map | Gold | All players |
| Whisper | `@name message` | Direct | Purple | Sender + recipient |
| Guild | `/g message` | All guild members | Green | Guild members only |
| Party | `/p message` | All party members | Cyan | Party members only |

### Chat Restrictions
- Max 200 characters per message
- Rate limiting: max 5 messages per 10 seconds
- Muted players cannot send (admin action)

---

## 5.6 PvP Combat

### PvP Rules by Map Type
| Map Type | PvP Rules |
|----------|-----------|
| Cities (aresden, elvine) | No PvP in safe zones, criminal attacks allowed |
| Hunt zones | Cross-faction PvP allowed |
| Middleland | Full PvP, all factions hostile |
| Fight zones | Full PvP, +33% damage bonus |
| Dungeons | Varies by dungeon config |
| Arenas | Full PvP, no penalties |

### Safe Attack Mode
When attacking another player, server checks:
1. **Same guild**: No damage dealt
2. **Allied guild** (in fight zone): 50% damage
3. **Allied guild** (elsewhere): No damage
4. **Criminal target**: Full damage, no PK penalty for attacker
5. **Enemy faction**: Full damage, +1 EK count
6. **Innocent same-faction**: Full damage, +1 PK count (criminal penalty)

### PvP Death Penalties
- XP loss based on PK status (2-12%, see section 5.2)
- Random item drop chance (non-safe maps)
- 7-second immunity after respawn
- Respawn at faction home city

### PvP Damage Modifiers
- Fight zone: +33% damage
- Crusade duty vs players:
  - Level 1-80: +100%
  - Level 81-100: +70%
  - Level 100+: +33%

---

## 5.7 Player Trading

### Trade Flow
1. Player A initiates trade request to Player B (click + trade action)
2. Player B accepts/declines
3. Trade window opens for both:
   - Each player places items and/or gold in their offer
   - Both players see each other's offers
4. Both players must click "Confirm"
5. On double-confirm: items and gold exchanged atomically
6. If either cancels or moves away: trade cancelled

### Trade Restrictions
- Both players must be adjacent (within 2 tiles)
- Cannot trade quest items or bound items
- Weight limit checked for both players
- Inventory space checked for both players
- Trade cancelled if either player moves, attacks, or disconnects

---

## 5.8 Verification Checklist

- [ ] Faction selection at cityhall NPC, level 10+ required
- [ ] Cannot enter enemy city (force recall)
- [ ] PK count increments when killing innocents
- [ ] Criminal status changes name color
- [ ] Guards attack criminals
- [ ] Death XP loss scales with PK status
- [ ] Guild creation with CHR 20+ and Level 20+
- [ ] Guild invite/accept/kick works
- [ ] Guild chat visible only to guild members
- [ ] Party formation up to 8 members
- [ ] Party XP multiplier and division correct
- [ ] Whisper delivers to target only
- [ ] PvP damage modifiers per map type correct
- [ ] 7-second post-respawn immunity works
- [ ] Trade exchange atomic and validated
