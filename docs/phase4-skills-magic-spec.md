# Phase 4: Skills & Magic Specification

## Overview
Phase 4 adds the complete 24-skill system with mastery progression, all 98 spells with casting mechanics, crafting/alchemy/mining/fishing/farming, and the taming system.

---

## 4.1 Skill System Overview

### Configuration
- **Total skill slots**: 60 (24 actively used)
- **Mastery per skill**: 0-100%
- **Total mastery cap**: 700 points across all skills
- **Mastery storage**: `uint8 skillMastery[60]`

### Skill Mastery Progression
1. Each successful skill use earns SSN (Skill Success Number) points
2. When SSN exceeds threshold for current mastery level, mastery increases by 1%
3. Threshold increases with mastery level (higher mastery = more SSN needed)

### Attribute-Based Hard Caps
Each skill has a hard cap based on the governing attribute:
```
MaxMastery = GoverningAttribute * 2
```
A skill cannot exceed this cap regardless of SSN earned.

### Total Cap Enforcement (700 points)
When total mastery across all skills exceeds 700:
1. Find lowest skill with mastery > 20
2. Reduce that skill to make room
3. Prevents exploitation through rapid skill switching

---

## 4.2 Complete Skill List

### Combat Skills
| ID | Skill | Attribute | Cap | Description |
|----|-------|-----------|-----|-------------|
| 5 | Boxing/Open Hand | VIT | VIT*2 | Unarmed combat, default when no weapon |
| 6 | Archery | DEX | DEX*2 | Bow/crossbow proficiency |
| 7 | Short Sword | DEX | DEX*2 | Daggers, short swords |
| 8 | Long Sword | DEX | DEX*2 | Longswords, claymores |
| 9 | Fencing | DEX | DEX*2 | Rapiers, estocs |
| 10 | Axe | DEX | DEX*2 | All axe types |
| 11 | Shield | DEX | DEX*2 | Parrying/block with shield |
| 14 | Hammer | STR | STR*2 | Maces, warhammers |
| 20 | Dual-Wielding | DEX | DEX*2 | Two weapons simultaneously |
| 21 | Staff | MAG | MAG*2 | Staff combat (mage weapons) |

### Gathering Skills
| ID | Skill | Attribute | Cap | Description |
|----|-------|-----------|-----|-------------|
| 0 | Mining | STR | STR*2 | Ore extraction from mineral nodes |
| 1 | Fishing | DEX | DEX*2 | Catching fish from water tiles |
| 2 | Farming | VIT | VIT*2 | Planting, growing, harvesting crops |

### Crafting Skills
| ID | Skill | Attribute | Cap | Description |
|----|-------|-----------|-----|-------------|
| 12 | Alchemy | INT | INT*2 | Potion creation |
| 13 | Manufacturing | STR | STR*2 | Item crafting at anvil |
| 18 | Crafting | MAG | MAG*2 | Jewelry, oils, elixirs |

### Magic & Utility Skills
| ID | Skill | Attribute | Cap | Description |
|----|-------|-----------|-----|-------------|
| 3 | Magic Resistance | Level | LVL*2 | Passive magic damage reduction |
| 4 | Magic (Magery) | MAG | MAG*2 | Spellcasting proficiency |
| 19 | Pretend Corpse | VIT | VIT*2 | Fake death to avoid combat |
| 22 | Taming | CHR | CHR*2 | Monster taming |
| 23 | Poison Resistance | VIT | VIT*2 | Passive poison immunity |

---

## 4.3 Mining

### Mechanics
1. Player equips pickaxe (item with `relatedSkill = 0`)
2. Click mineral deposit on map
3. Server rolls skill check
4. On success: ore item added to inventory, SSN incremented
5. Mineral node has finite uses, respawns after timer

### Skill Check
Standard SSN accumulation: 1 point per successful gather
Hard cap: `STR * 2`

---

## 4.4 Fishing

### Mechanics
1. Player equips fishing rod
2. Click on water tile (tileSprite == 19)
3. Server validates water tile: `bGetIsWater()` check

### Success Formula
```
if dice(1, 105) <= FishingSkillMastery -> SUCCESS
```

### Rewards
- Fish item spawned in inventory
- 1-2 XP per successful catch
- SSN incremented on success
- `m_iAllocatedFish` tracks active fishing (prevents duplicate catches)

---

## 4.5 Farming

### Mechanics
1. Equip hoe, click farm tile (flag 0x20 in AMD data)
2. Plant seed item
3. Growth timer: NPC created with crop type data
4. After growth delay: crop NPC becomes harvestable
5. Click to harvest

### Success Formula
```
if (dice(1,100) <= (50 + FarmingSkill - CropSkillRequirement))
   OR (dice(1,100) < 6)  // 5% base chance
   -> SUCCESS
```

### Limits
- Max 200 crops per map (`m_iTotalAgriculture`)
- Skill only increases if player skill <= (crop_skill + 10%)

---

## 4.6 Alchemy (Potion Creation)

### Recipe Structure
```
name: "PotionName"
ingredients: [6 slots of {itemID, count}]
skillLimit: minimum alchemy mastery required
difficulty: affects success rate and purity
```

### Process
1. Player places up to 6 ingredients in alchemy UI
2. Ingredients sorted by item ID (bubble sort) for recipe matching
3. Server matches against `PortionConfigList[]`
4. Skill check applied

### Success Formula
```
skillLevel = AlchemyMastery - Difficulty
if skillLevel <= 0: skillLevel = 1

if dice(1, 100) > skillLevel -> FAIL
```

### Purity Calculation
```
purity = skillLevel + (skillLevel / 2) + dice(1, difficulty)
purity = clamp(purity, 10, 100)
```
Higher purity = stronger potion effect

### Failure Consequences
- Risk level = skillLimit (percentage)
- `dice(1, 100) < riskLevel` -> ingredient items destroyed
- Stackable items reduced by count

### XP Reward
```
XP += dice(1, difficulty)
```

---

## 4.7 Manufacturing (Item Crafting)

### Process
Same recipe matching as alchemy, but uses skill 13 (Manufacturing) at anvil/workbench

### Success Formula
```
if skillLevel < successChances:
    successChances -= (successChances - skillLevel) / 2
else:
    successChances += (skillLevel - successChances) / 2

if dice(1, 100) > successChances -> FAIL
```

### Magic Bonus
```
skillLevel += MAG / 10  // INT contributes to crafting
```

---

## 4.8 Crafting (Jewelry/Oils/Elixirs)

### Uses Skill 18 (Crafting)
- Minimum skill: 20
- Same recipe matching system
- Magic-based attribute cap: `MAG * 2`

### Purity (Oils/Elixirs only)
```
purity = (skillLevel / 2) + dice(1, 100 - skillLevel/2)
purity = clamp(purity, 10, 100)
```

### Neck Crafting (Special)
- Requires 10 contribution points
- Purity = 0 for necks
- Auto-logged by server

---

## 4.9 Magic System Overview

### Spell Configuration (per spell)
- `name` (30 chars), `type` (1-60 enum), `manaCost`
- `intLimit` (INT requirement), `goldCost` (to learn)
- `delayTime` (casting delay, multiple of 3)
- `lastTime` (effect duration ms)
- `value1-12` (spell-specific parameters)
- `attribute` (element: 1=Earth, 2=Air, 3=Fire, 4=Water)
- `category` (0=targetable, 1=ground placement)

### Spell Circles (Tiers)
| Circle | Level Range | Spells |
|--------|------------|--------|
| 1 | 10-19 | Magic Missile, Heal, Create Food |
| 2 | 20-29 | Energy Bolt, Recall, Defense Shield, Staminar Drain/Recovery |
| 3 | 30-39 | Fireball, Great Heal, Tremor, Hold Person, Poison, Protection From Arrow |
| 4 | 40-49 | Fire Strike, Summon, Invisibility, Paralyze, Cure, Lightning Arrow |
| 5 | 50-59 | Fire Wall/Field, Lightning, Chill Wind, Poison Cloud, Triple Energy Bolt |
| 6 | 60-69 | Berserk, Lightning Bolt, Mass Poison, Spike Field, Ice Storm/Strike |
| 7 | 70-79 | Energy Strike, Mass Fire Strike, Confusion, Earthworm Strike, Armor Break |
| 8 | 80-89 | Bloody Shock Wave, Mass Confusion, Mass Ice Strike, Cloud Kill, Lightning Strike, Trance |
| 9 | 90-99 | Illusion, Meteor Strike, Blizzard, Inhibition Casting, Magic Drain |
| 10 | 100+ | Mass Illusion, Mass Blizzard, Mass Armor Break, Mass Lightning Strike, Resurrection |

---

## 4.10 Spell Casting Mechanics

### Success Rate Formula
```
BaseProb = CircleBaseProbability[circle]
  // Circle 1-10: {300, 250, 200, 150, 100, 80, 70, 60, 50, 40}

Result = (MageryMastery / 100) * BaseProb

// INT bonus
if (INT + AngelicINT) > 50:
    Result += (INT - 50) / 2

// Level penalty (casting above your tier)
if CircleLevel > PlayerLevel / 10:
    Penalty = abs(CircleLevel - PlayerLevel/10) * LevelPenalty[circle]
    // LevelPenalty: {5, 5, 8, 8, 10, 14, 28, 32, 36, 40}
    Result -= Penalty

// Level bonus (casting below your tier)
if CircleLevel < PlayerLevel / 10:
    Result += 5 * (PlayerLevel/10 - CircleLevel)
```

### Weather Penalties on Casting
| Weather | Penalty |
|---------|---------|
| Fog | -4% |
| Rain | -8% |
| Snow | -20% |

### Mana Cost Calculation
```
ActualCost = BaseCost * (100 - ManaSaveRatio) / 100
```
ManaSaveRatio from equipment bonuses, max 80%

### Spell Failure
- If `Result < 100`: roll `dice(1,100)`, if roll > Result -> spell fails
- Hunger <= 10 or SP <= 0: additional 10% failure chance
- Failed spell still consumes mana

---

## 4.11 Magic Resistance

### Formula: `bCheckResistingMagicSuccess()`
```
TargetMR = MagicDefenseSkillMastery + ItemMRBonus
if MAG > 50: TargetMR += MAG - 50
TargetMR += SetEffectBonus (up to +100)

DestHitRatio = (CasterHitRatio / TargetMR) * 50
DestHitRatio = clamp(DestHitRatio, 5, 95)
```

### Protection Effects
| Protection Level | Effect |
|-----------------|--------|
| 5 | Complete immunity (spell always resisted) |
| 4 | Great Defense Shield |
| 3 | Defense Shield |
| 2 | Blocks low-ratio hits (< 1000) |

---

## 4.12 Spell Damage Formula

### Base Damage
```
Damage = dice(value4, value5) + value6
Damage += (MAG / 3.3)% of base damage
Damage += ItemMagicalDamageBonus
Damage += ElementBonus[spellElement]  // fire/air/earth/water
```

### Modifiers
- Berserk wand: +25% (or +12.5% for special spells)
- Liche wand: +12.5%
- Hero armor: +4 flat
- Crusade mode: +33% vs enemy faction
- Fight zone: +33%
- Safe mode vs friendlies: -33% or 0

---

## 4.13 Area of Effect (AoE)

### Spell Parameters
- `value2`: Horizontal radius
- `value3`: Vertical radius
- `value11`: Area type (1=wall/line, 2=field/square)

### DAMAGE_AREA (Type 3)
- Center point gets higher damage (bonus resistance penalty)
- Four quadrants scanned outward from center
- Each entity in area gets individual resistance check

### DAMAGE_LINEAR (Type 19)
- Line from caster to target, 2-10 tiles
- Width = 1-2 tiles perpendicular to line
- Used by: Lightning Bolt, Blizzard

### DYNAMIC_OBJECTS (Type 14)
- Creates persistent damage zones (Fire Wall, Poison Cloud, etc.)
- Duration: `lastTime * 1000` milliseconds
- Damages any entity entering the zone

---

## 4.14 Buff/Debuff System

### Active Status Effects
| Effect | Duration | Mechanic |
|--------|----------|----------|
| Protection (Arrow) | Configured | Blocks ranged attacks |
| Protection (Magic) | Configured | Blocks spells |
| Defense Shield | Configured | +DR to defense |
| Paralyze | Configured | Cannot move or act |
| Entangle | Configured | Cannot move, can still act |
| Invisibility | Configured | Invisible to NPCs and players |
| Confusion | Configured | Disoriented, movement/language scrambled |
| Poison | Until cured | Periodic damage, `poisonLevel` per tick |
| Berserk | Class-dependent | +damage% (value * 10%) |
| Ice/Freeze | 5 seconds | Cannot act |
| Medusa Kiss | Instant | Instant freeze (overrides other effects) |
| Cancellation | Instant | Removes all buff/debuffs |
| Inhibition | Variable | Prevents spellcasting |
| Magic Reflexion | Configured | Bounces spells back to caster |
| Metamorphosis | Configured | Transform into different form |

### Berserk Duration by Class
- Mages/Paladins: `delayTime * 1000` ms
- Priests/Druids: `Charisma * 1000` ms
- Damage bonus: `berserkLevel * 10`% (level 10 = +100%)

### Poison Mechanics
- Damage per tick: equal to poison level
- Resisted by separate `bCheckResistingPoisonSuccess()` check
- Cured by Cure spell (type 17, value4 == 0)

---

## 4.15 Summoning System

### Summon Limits
```
MaxSummons = MageryMastery / 20  (1 per 20 mastery)
Heldenian war: max 5
```

### Summon Tables by Class

**Druid** (roll `dice(1, Magery/10)`, cap `Magery/20`):
Rabbit, Giant-Ant, Amphis, Cat, Scorpion, Rudolph, Frog, DireBoar, Plant, Giant-Tree

**Priest**:
Skeleton, Zombie, Liche (Charisma check), Hellbound, Demon

**Mage** (Charisma < INT or CHR <= 29):
Slime, Giant-Ant, Amphis, Orc, Skeleton, Clay-Golem, Stone-Golem, Orc-Mage, Hellbound, Cyclops

**Warrior/Paladin** (Charisma > INT and CHR > 29):
Skeleton, Zombie, Liche, Hellbound

### Summoned NPC Behavior
- Named `_[MapIndex][NamingValue]`
- Movement type: FOLLOW (follows master)
- Duration: until death or master disconnect
- Attacks master's targets

---

## 4.16 Teleportation Spells

### Recall (Spell 12)
- Teleports caster to home town
- Calls `RequestTeleportHandler(clientH, "1   ")`

### Temple Teleport (value4 = 3)
- Aresden side: teleport to `cath_1`
- Elvine side: teleport to `cath_2`

### Bisle Teleport (value4 = 2)
- Teleports to `bisle` map

### Restrictions
- Some maps block teleportation
- Ownership check on self-only teleport

---

## 4.17 Taming System

### Skill Check
```
TamingRange = 2 + (SkillLevel / 20)  // 2-7 tiles
Result = dice(2, SkillLevel)
if Result >= TamingDifficulty -> SUCCESS
```

### Taming Difficulty by Class and Creature

**Druids:**
| Creature | Skill Required |
|----------|---------------|
| Rabbit, Cat | 25-30 |
| Ant, Snake, Scorpion | 30-35 |
| Frog, Rudolph | 50 |
| Giant-Crayfish, Tree | 60-75 |
| Claw-Turtle | 90 |
| Stone King | 100 |
| Dragon | 140 (50% chance) |
| Centaur, Minotaur | 150 |

**Mages:**
| Creature | Skill Required |
|----------|---------------|
| Stone/Clay Golem | 40 |
| Ice Golem | 70 |
| Big Baddy | 100 |
| Demon | 170 |

**Priests:**
| Creature | Skill Required |
|----------|---------------|
| Skeleton, HellHound | 35 |
| Lich | 110 |
| Demon | 160 |
| Unicorn | 100 (requires 0 PK/EK, positive rating) |

### Tamed NPC Behavior
- Duration: `3000 * skillLevel + 120000` ms
- Movement type: FOLLOW
- Neutral creatures (side 0) most commonly tamed

---

## 4.18 Skill Learning

### Methods
1. **Skill Manuals**: Items with `itemType = USE_SKILL`, consumed on use
2. **Special grants**: Magic skill (ID 4) granted at 20% to eligible classes
3. **Cannot learn**: Already-known skills (mastery > 0), or if at 700 total cap

### Learning Process
- Item use triggers skill mastery set
- Some manuals set to specific value, others increment by X points
- Cannot exceed 100 per individual skill

---

## 4.19 Verification Checklist

- [ ] All 24 skills listed in skill UI
- [ ] Skill mastery increases with use
- [ ] 700-point total cap enforced (lowest skill auto-reduced)
- [ ] Attribute caps respected (STR*2, DEX*2, etc.)
- [ ] Mining: pickaxe + mineral node -> ore item
- [ ] Fishing: rod + water tile -> fish item (success rate matches formula)
- [ ] Farming: plant + grow + harvest cycle works
- [ ] Alchemy: correct recipes produce potions with purity
- [ ] Manufacturing: crafting recipes with skill check
- [ ] All 98 spells castable with correct mana cost and INT requirement
- [ ] Spell success rate matches circle probability formula
- [ ] AoE spells affect correct tile radius
- [ ] Buff durations correct per spell config
- [ ] Poison applies periodic damage until cured
- [ ] Summoned creatures follow master and attack targets
- [ ] Taming works per class difficulty table
- [ ] Recall teleports to home town
