# Phase 6: Endgame & Events Specification

## Overview
Phase 6 adds the quest system, Crusade war (faction-wide PvP event), Heldenian tower defense, Apocalypse events, day/night cycle, weather system, arena/Bleeding Isle, and post-max-level progression.

---

## 6.1 Quest System

### Quest Types
| ID | Type | Description |
|----|------|-------------|
| 1 | Monster Hunt | Kill X of a specific monster type |
| 2 | Monster Hunt (Timed) | Kill X monsters within time limit |
| 3 | Assassination | Kill a specific named NPC |
| 4 | Delivery | Bring item to location/NPC |
| 5 | Escort | Protect NPC during travel |
| 6 | Guard | Defend NPC from attackers for duration |
| 7 | Go Place | Travel to specific map location |
| 8 | Build Structure | Construct building (crusade) |
| 9 | Supply Structure | Supply materials to building (crusade) |
| 10 | Strategic Strike | Attack specific crusade target |
| 11 | Send to Battle | Deploy units (crusade) |
| 12 | Set Occupy Flag | Place occupation markers (crusade) |

### Quest Structure
```
Quest {
  id, name
  type: QuestType (1-12)
  from: NPC type that gives quest
  targetName: target NPC/location
  maxCount: required kill/delivery count
  range: distance for go-place quests
  rewardType[4]: up to 4 reward types
  rewardAmount[4]: corresponding amounts
  contribution: faction contribution points
  contributionLimit: max contribution from this quest
  responseMode: 0=auto, 1=accept/decline, 2=next-step
}
```

### Quest Tracking (per player)
- `quest`: Current quest index
- `questID`: Quest instance ID
- `curQuestCount`: Progress counter
- `questMatchFlag_Loc`: Player in correct location flag
- `isQuestCompleted`: Completion flag
- `questRewardType/Amount`: Pending rewards

### Monster Hunt Completion
1. Player must be in correct location (`questMatchFlag_Loc = true`)
2. Each target monster killed increments `curQuestCount`
3. Only non-summoned NPCs count
4. Completion when `curQuestCount >= quest.maxCount`

### Go Place Completion
1. Player enters target map
2. Player position within `quest.range` tiles of target coordinates
3. Completes immediately on arrival

### Quest Rewards
- **XP**: Direct experience grant
- **Gold**: Currency reward
- **Items**: Specific item(s) added to inventory
- **Contribution**: Faction contribution points
- Delivered via NPC dialog on quest turn-in

---

## 6.2 Crusade War System

### Overview
Large-scale faction war between Aresden and Elvine, fought primarily on Middleland map. Guilds participate with assigned roles, building structures and launching grand magic attacks.

### Activation
- `m_bIsCrusadeMode` flag set by server/admin
- `m_dwCrusadeGUID` unique instance identifier
- Time-limited event with start/end triggers

### Crusade Roles
| Role | Duty ID | Function |
|------|---------|----------|
| Summoner | 1 | Summons war units using collected mana |
| Constructor | 2 | Builds defensive/offensive structures |
| Strategist | 3 | Manages Grand Magic Generator, launches meteor strikes |

### Crusade Structures
Loaded from `CrusadeStructureConfig`:
- Placed on Middleland map during crusade
- Each has: type, position, HP, defense rating
- Types include:
  - **Guard Towers**: Defensive, attacks nearby enemies
  - **Mana Collectors**: Gathers mana for Grand Magic
  - **Detectors**: Reveals enemy positions
  - **Magic Generators**: Powers grand magic attacks
  - **Principal Buildings**: Must be destroyed for victory

### Grand Magic Generator (GMG)
- **Mana collection**: `m_iCollectedMana[]` tracked per faction
- **Faction mana pools**: `m_iAresdenMana`, `m_iElvineMana`
- **Meteor strikes**: Launched using accumulated mana
  - Target: enemy structures (up to 4 strike points configured)
  - Damage: calculated per structure HP
  - `MeteorStrikeHandler()` and `DoMeteorStrikeDamageHandler()`

### War Contribution Points
- Killing enemy faction NPCs grants construction points
- Killing enemy players grants war contribution
- Special NPC types grant bonus points
- Friendly kills REDUCE points

### Victory Conditions
- **Primary**: Destroy all enemy principal buildings
- **Alternative**: Reduce enemy mana to zero
- **Time limit**: If neither side wins, draw declared

### Crusade Effects on Gameplay
- XP from kills divided by 3 during crusade
- Crusade damage bonuses apply (see Phase 5 PvP modifiers)
- Executors cannot enter cities during crusade
- Special teleport rules for guild members

---

## 6.3 Heldenian Tower Defense

### Overview
Tower defense-style PvP event separate from Crusade.

### Mechanics
- `m_bIsHeldenianMode`: Active flag
- `m_dwHeldenianGUID`: Instance ID
- `m_dwHeldenianWarStartTime` / `m_dwHeldenianFinishTime`: Duration

### Event Flow
1. `HeldenianWarStarter()`: Initializes event, sets up towers
2. `HeldenianStartWarNow()`: Begins active combat phase
3. Players defend faction towers while attacking enemy towers
4. Towers have HP and can be destroyed
5. `HeldenianVictoryNow()`: Declares winner based on remaining towers
6. `HeldenianWarEnder()`: Cleanup

### Tracking
- Per-faction statistics: dead count, flags, towers remaining
- Special NPC behavior for Heldenian gates (`m_cActionLimit = 8`)
- Summon limit capped at 5 during Heldenian
- Player teleportation to tower positions

---

## 6.4 Apocalypse Event

### Overview
Special server-wide PvE event with boss monsters.

### Mechanics
- Controlled by `m_dwApocalypseGUID`
- `GlobalStartApocalypseMode()`: Activates event
- `GlobalEndApocalypseMode()`: Deactivates event

### Features
- Special gate mechanics (open/close map transitions)
- Boss generation: `GenerateApocalypseBoss()` spawns unique boss NPCs
- Mass mob spawns: `GenerateSlime()` and other generators
- Specific mob types and spawn locations per event phase

---

## 6.5 Arena / Bleeding Isle

### Entry Requirements
- Ticket item required (consumed on entry)
- Level restrictions per arena tier
- Teleport to Bleeding Isle map (`bisle`)

### Rules
- Full PvP: all players hostile
- No death penalties (XP loss, item drop)
- No faction restrictions
- Timed rounds with victory conditions

---

## 6.6 Day/Night Cycle

### Server-Side Timing
```
if currentMinute >= 40:
    dayOrNight = 2  // Night
else:
    dayOrNight = 1  // Day
```
- Based on system clock minutes (not game-time)
- `DEF_NIGHTTIME = 40` (40-minute mark triggers night)

### Effects
- **NPC spawns**: Some NPCs only spawn at night (`m_cDayOfWeekLimit`)
- **Visual rendering**: Client adjusts lighting/color palette
- **Map overrides**: `m_bIsFixedDayMode` forces specific lighting per map
- **Weapon bonuses**: Some weapons have day/night damage modifiers
- **Communicated to clients** on login and map change

---

## 6.7 Weather System

### Weather Types
| Type | Visual | Gameplay Effect |
|------|--------|----------------|
| Clear | Normal | None |
| Fog | Reduced visibility | -5% archery, -4% magic |
| Rain | Rain particles | -10% archery, -8% magic |
| Heavy Rain | Dense rain | -25% archery |
| Snow | Snowfall | -2.5% archery, -20% magic |
| Sandstorm | Sand particles | -12.5% archery |
| Wind | Wind effects | -5% archery, -5% magic |

### Admin Control
- `AdminOrder_Weather()`: Set weather condition
- `AdminOrder_Thunder()`: Trigger thunder/storm effect
- Weather state persists until changed

### Effects on Combat
- **Archery penalties**: Reduced hit ratio per weather type
- **Magic penalties**: Reduced casting success per weather type
- Weather bonus can apply to some spells via `iGetWhetherMagicBonusEffect()`

---

## 6.8 Berserk / Metamorphosis Forms

### Berserk Status
- Damage bonus: `berserkLevel * 10`% (max level 10 = +100%)
- Duration varies by class
- Flying NPC attack chance reduced by 10

### Metamorphosis Forms
| Form | Damage SM | Damage L | Bonus |
|------|-----------|----------|-------|
| GodBlade | dice(4,11) | dice(4,12) | +2% per meta level |
| Vampire | dice(3,11)+1 | dice(3,12)+2 | +2% per meta level |
| Black Shadow | dice(2,13)+3 | dice(2,14)+3 | +2% per meta level |
| GiS | dice(2,11)+3 | dice(2,12)+3 | +2% per meta level |

### Metamorphosis Mechanics
- Replaces normal weapon damage with form-specific dice
- Duration from spell config
- Visual appearance changes on client

---

## 6.9 Post-Max-Level Progression (Gizon Points)

### Overview
After reaching maximum level, players earn Gizon points for additional stat upgrades.

### Mechanics
- Gizon points earned from special quests/achievements at max level
- Each point can be allocated to a stat (similar to LU Pool)
- Provides incremental power growth beyond level cap
- Angelic stats: `AngelicSTR`, `AngelicDEX`, etc. add to base stats

---

## 6.10 Special Items

### Ancient Slates (Type 31)
| Variant | Effect | Duration |
|---------|--------|----------|
| Invincible (1) | Complete damage immunity | 600 seconds |
| Berserk (2) | +200% damage | 600 seconds |
| Mana (3) | MP recovery over time | 600 seconds |
| Experience (4) | XP gain boost | 600 seconds |
| Full Crits (5) | All attacks are critical + max stats | 600 seconds |

### Lottery Items (Type 23)
12 random outcomes when used:
HP restore, MP restore, SP restore, food, recall, invisibility, summon, trance, PFM, PFA, Abaddon Fury, teleport

---

## 6.11 Verification Checklist

- [x] Quest NPC offers quest with correct requirements *(hunt, delivery, collect quests implemented)*
- [x] Monster hunt quest tracks kills correctly
- [ ] Go-place quest completes on arrival *(not implemented)*
- [x] Quest rewards granted on turn-in *(XP, gold, items)*
- [ ] Crusade mode activatable by admin *(EventState tracking exists but no admin commands or gameplay)*
- [ ] Crusade structures placeable and destructible *(not implemented)*
- [ ] Grand Magic Generator collects mana and launches meteors *(not implemented)*
- [ ] Crusade victory when enemy structures destroyed *(not implemented)*
- [ ] Heldenian event: towers attackable/defensible *(not implemented)*
- [ ] Apocalypse boss spawns and has unique behavior *(not implemented — no boss NPCs)*
- [ ] Arena entry with ticket, no death penalties *(arena state tracking exists but no ticket/gameplay)*
- [x] Day/night cycle changes at minute 40 *(30-min cycle with 4 phases implemented)*
- [ ] Weather affects archery and magic per tables *(weather system exists but no combat effects)*
- [ ] Berserk form provides correct damage bonus *(not implemented)*
- [ ] Metamorphosis changes damage dice correctly *(not implemented)*
- [ ] Ancient Slates apply correct 600-second buffs *(not implemented)*
