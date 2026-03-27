# Phase 3: Combat & Items Specification

## Overview
Phase 3 adds melee/ranged combat with the original game's formulas, NPC AI with aggro/pathfinding, the complete item system with equipment/inventory/shops, HP/MP/SP regeneration, death/respawn, and experience/leveling.

---

## 3.1 Hit/Miss Calculation

### Hit Ratio Formula
```
AttackerHitRatio = BaseHitRatio + WeaponSkillMastery + ItemHitBonuses
TargetDefenseRatio = DEX * 2 + ArmorDefenseBonuses + ItemDefenseBonuses

DestHitRatio = (AttackerHitRatio / TargetDefenseRatio) * 50
```

### Boundaries
- **Minimum hit chance**: 15%
- **Maximum hit chance**: 99%

### Back Attack Bonus
If attacker's direction equals target's direction (attacking from behind):
```
TargetDefenseRatio = TargetDefenseRatio / 2
```

### Hit Determination
```
roll = random(1, 100)
if (roll <= DestHitRatio) -> HIT
else -> MISS
```

### PvP High-HP Mode Defense
When PvP HP mode is active for close combat vs players:
- Uses reduced defense ratio (`DefenseRatio2 = DEX` instead of `DEX*2`)
- Item defense bonuses halved: `AddDR / 2`
- Critical attacks further reduce defense by 50

---

## 3.2 Melee Damage Calculation

### Base Weapon Damage
```
BaseDamage_SM = dice(AttackDiceThrow_SM, AttackDiceRange_SM) + AttackBonus_SM
BaseDamage_L  = dice(AttackDiceThrow_L,  AttackDiceRange_L)  + AttackBonus_L
```
- SM = Small/Medium targets, L = Large targets
- Each weapon type defines its own dice values in item config

### STR Scaling
```
STRBonus = (STR + AngelicSTR) / 5.0   // percentage
FinalDamage = BaseDamage + (BaseDamage * STRBonus / 100)
```
Example: STR 50 -> 10% bonus to base weapon damage

### Unarmed Combat (Monk/Boxing)
```
Damage_SM = dice(2, VIT/13) + 2
Damage_L  = dice(2, VIT/13) - 2
With NunChaKu in left hand: +dice(1, 15) to both
```

### Bowman Scaling
```
if DEX > STR: Damage += dice(1, (DEX + AngelicDEX) / 13)
if STR >= DEX: Damage += dice(1, (STR + AngelicSTR) / 20)
```

---

## 3.3 Armor Damage Reduction (Physical Armor)

### Hit Location (random roll 1-10000)
| Roll Range | Location | % Chance |
|------------|----------|----------|
| 1-5000 | Body | 50% |
| 5001-7500 | Legs | 25% |
| 7501-9000 | Arms | 15% |
| 9001-10000 | Head | 10% |

### Damage Reduction
```
ArmorPA = Equipment armor value at hit location
ShieldPA = Added if shield bash succeeds (skill 11 check)
CapePA = Added when attacked from behind

TotalPA = min(ArmorPA + ShieldPA + CapePA, 80)  // cap at 80%
FinalDamage = Damage - (Damage * TotalPA / 100)
```

### Special: Hammer vs Armor
Hammers reduce armor PA by 25%: `ArmorPA = ArmorPA - ArmorPA/4`

---

## 3.4 Critical Hit System

### Weapon-Specific Critical Bonuses
| Skill | Weapon Type | SM Bonus | L Bonus | Hit Bonus |
|-------|-------------|----------|---------|-----------|
| 6 | Archery | -10% | +10% | +30 |
| 7 | Short Sword | 2x damage | 2x damage | - |
| 8 | Long Sword | +10% | +10% | +30 |
| 9 | Fencing | none | none | - |
| 10 | Axe | +10% | +20% | - |
| 14 | Hammer | +10% | +20% | +20 |
| 21 | Staff | +20% | +20% | +50 |

### Monk 4th Combo Critical
On 4th consecutive hit during critical: +10 hit, +20% SM, +100% L damage

---

## 3.5 Combo System

### Combo Tracking
- Counter increments on each successful hit
- Resets to 1 after reaching 4: `if combo > 4 then combo = 1`

### Combo Damage Bonus Table (extra flat damage by weapon)
| Combo Count | Boxing | Short Sword | Long Sword | Fencing | Axe | Archery/Hammer |
|-------------|--------|-------------|------------|---------|-----|----------------|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0 | 1 | 1 | 2 | 1 | 0 |
| 3 | 1 | 2 | 3 | 4 | 2 | 0 |
| 4 | 2 | 3 | 5 | 8 | 3 | 0 |

---

## 3.6 Special Weapon Effects

### Effect Types (from item attribute bitfield)
| Type | Name | Effect |
|------|------|--------|
| 1 | Critical+ | Bonus damage, chance to double L damage |
| 2 | Poison | Applies poison status on hit |
| 3 | Righteous | Bonus damage = `(attacker_reputation - target_reputation) / 50`, max 30 |
| 7 | Sharp | +1 to weapon dice range |
| 9 | Ancient | +2 to weapon dice range |
| 11 | Mana Conversion | Adds to mana save ratio (max 20%) |
| 12 | Critical Increase | Adds to critical chance (max 20%) |

---

## 3.7 Ranged Combat (Bows)

### Arrow Mechanics
- Arrows consumed on each shot (decrement stack count)
- When stack reaches 0: arrow item depleted
- `m_cArrowIndex` tracks currently equipped arrow slot

### Weather Effects on Archery
| Weather | Hit Ratio Modifier |
|---------|-------------------|
| Clear | 0% |
| Fog | -5% |
| Rain | -10% |
| Heavy Rain | -25% |
| Snow | -2.5% |
| Sandstorm | -12.5% |
| Wind | -5% |

### Arrow Reflexion
If target has Arrow Reflexion buff: attacker becomes the target of their own arrow

---

## 3.8 PvP vs PvE Differences

### PvP Damage Bonuses
- **Fight zone**: +33% damage
- **Crusade Duty vs players**:
  - Level 1-80: +100% damage
  - Level 81-100: +70% damage
  - Level 100+: +33% damage

### Safe Attack Rules
| Target | Same Guild | Allied Guild (fight zone) | Allied Guild (elsewhere) | Other |
|--------|-----------|--------------------------|--------------------------|-------|
| Damage | 0% | 50% | 0% | 100% |

### Hunger/SP Penalty
If hunger <= 10 or SP <= 0: 10% chance each attack fails outright

---

## 3.9 NPC AI State Machine

### Behavior States
| State | ID | Description |
|-------|----|-------------|
| STOP | 0 | Idle, stationary. Scans for targets periodically |
| MOVE | 1 | Moving toward target or patrol waypoint |
| ATTACK | 2 | Engaging target in melee/ranged combat |
| FLEE | 3 | Running from threats when bravery threshold exceeded |
| DEAD | 4 | Dead, waiting for respawn timer |

### State Transitions
```
STOP -> MOVE (target detected within search range)
STOP -> ATTACK (target adjacent)
MOVE -> ATTACK (reached target)
MOVE -> STOP (lost target or reached waypoint)
ATTACK -> FLEE (HP below bravery threshold)
ATTACK -> DEAD (HP <= 0)
FLEE -> STOP (safe distance reached)
DEAD -> STOP (respawn timer expired)
```

### Movement Types
| Type | ID | Behavior |
|------|----|----------|
| STOP | 0 | Never moves |
| SEQWAYPOINT | 1 | Follows waypoints in sequence |
| RANDOMWAYPOINT | 2 | Random waypoint selection |
| FOLLOW | 3 | Follows a specific target (summoned pets) |
| RANDOMAREA | 4 | Roams within defined rectangular area |
| RANDOM | 5 | Completely random movement |
| GUARD | 6 | Stays near initial position, only moves when attacked |

---

## 3.10 NPC Aggro & Target Selection

### Detection
- Search range: `m_cTargetSearchRange` tiles (configured per NPC type)
- Scans square area: `(range*2+1) x (range*2+1)` centered on NPC
- Closest valid target selected (Manhattan distance)

### Target Priority Rules
1. Skip invisible targets (unless NPC has Special Ability 1: Penetrating Invisibility)
2. Skip GM/admin players
3. Faction checks:
   - Neutral NPCs (side 0): don't attack anyone
   - Guard NPCs (side 3): don't attack sides 0-3 unless criminal
   - NPC side must differ from target side to be hostile
4. Reflexion aura: NPC may flee instead of attack (probability based on NPC magic level)

### Special NPC Abilities
| Ability | ID | Effect |
|---------|----|--------|
| None | 0 | Standard NPC |
| Penetrating Invisibility | 1 | Can detect invisible players |
| Breaking Magic Protection | 2 | Ignores protective spells |
| Absorbing Physical Damage | 3 | Damage reduction |
| Absorbing Magical Damage | 4 | Magic resistance |
| Poisonous | 5 | Applies poison on hit |
| Extremely Poisonous | 6 | Stronger poison |
| Explosive | 7 | Area damage on death |
| Hi-Explosive | 8 | Stronger area explosion |
| Swift | 9 | Faster movement, higher defense/hit |
| Mighty | 10 | More HP, damage, hit |
| Shaman | 11 | Casts powerful spells |
| Crippled | 12 | Slower, easier to kill |

---

## 3.11 NPC Spawn System

### MobGenerator
- Executes every 600ms server tick
- Checks each map's spawn configuration
- Avoids spawning in `rcMobGenAvoidRect` rectangles

### Respawn Timer
- Per-NPC `m_dwRegenTime` (milliseconds) from config
- When `currentTime - deathTime > regenTime`: respawn NPC
- On respawn: create new NPC instance at spawn location, reset HP/state

### NPC Stats (from config)
- `m_iHitDice` - Base HP
- `m_iDefenseRatio` - Defense %
- `m_iHitRatio` - Attack hit %
- `m_iMinBravery` - Flee threshold
- `m_iExpDiceMin/Max` - XP reward range
- `m_iGoldDiceMin/Max` - Gold drop range
- `m_cAttackDiceThrow/Range` - Damage dice
- `m_cSize` - 0=Small/Medium, 1=Large
- `m_dwActionTime` - Attack frequency (ms)
- `m_cResistMagic` - Magic resistance %
- `m_cMagicLevel` - Spell casting level
- `m_cTargetSearchRange` - Aggro range

---

## 3.12 HP/MP/SP Regeneration

### Regeneration Rates (server tick-based)
| Stat | Interval | Amount | Conditions |
|------|----------|--------|------------|
| HP | 15 seconds | 1 + VIT/10 | Not in combat, not poisoned |
| MP | 20 seconds | 1 + MAG/10 | Not in combat |
| SP | 10 seconds | 2 + Level/10 | Always |

### Hunger Effect
- Hunger decreases over time (1 per minute)
- At hunger <= 10: no HP/MP regeneration
- At hunger = 0: gradual HP loss (1 per 30 seconds)
- Food items restore hunger to 100

---

## 3.13 Death & Respawn

### Death Trigger
- HP reaches 0
- All magic effects removed
- Player marked as dead, death timestamp recorded

### XP Loss on Death (PvP)
| PK Count | Status | XP Loss |
|----------|--------|---------|
| 0 | Innocent | 2% of current level XP |
| 1-3 | Criminal | 3% |
| 4-11 | Murderer | 6% |
| 12+ | Slaughterer | 12% |

### Respawn
- Teleport to home city spawn point (Aresden or Elvine based on faction)
- If neutral: respawn at default map
- 7-second protection after PvP death (invulnerable)
- HP restored to MaxHP, MP to MaxMP, SP to MaxSP

---

## 3.14 Experience & Leveling

### XP from NPC Kills
```
BaseXP = NPC_Experience / 3
WeaponBonus = AddExp * (BaseXP / 100)  // ~20% weapon bonus
FinalXP = BaseXP + WeaponBonus + NPC_NoDieRemainExp
```
During Crusade: XP divided by 3

### Level Difference Scaling
```
For level <= 80: XP * (1.025 + 0.025 * (80 - level))
For level 80-99: XP * 0.25 (75% reduction, farm penalty)
For level 100+:  XP * 0.10 (90% reduction)
```

### XP Required Per Level (recursive formula)
```
XP(level) = XP(level-1) + level * (50 + (level * (level/17)^2))
```

### Party XP Division
| Members | Multiplier | Per Player |
|---------|------------|------------|
| 1 | 1.00x | 100% |
| 2 | 1.10x | 55% |
| 3 | 1.10x | 36.7% |
| 4 | 1.15x | 28.75% |
| 5 | 1.15x | 23% |
| 6 | 1.20x | 20% |
| 7 | 1.20x | 17.1% |
| 8 | 1.20x | 15% |

### Level Up Rewards
- +3 stat points to LU Pool (unspent points)
- Player chooses where to allocate via stat allocation UI
- Max stat formulas recalculated

---

## 3.15 Item System

### Item Structure
Each item has these core fields:
- `name` (20 chars), `idNum` (0-5000), `itemType`, `equipPos`
- `effectType`, `effectValue1-6` (primary effect parameters)
- `maxLifeSpan`, `curLifeSpan` (durability)
- `price`, `weight`, `levelLimit`, `genderLimit`
- `relatedSkill`, `category`, `count` (stack count)
- `attribute` (bitfield: enchantments, upgrades)
- `itemColor` (dye)

### Item Types
| ID | Type | Examples |
|----|------|---------|
| 1 | EQUIP | Weapons, armor, shields |
| 3 | USE_DEPLETE | Single-use consumables |
| 5 | CONSUME | Potions (HP/MP/SP) |
| 6 | ARROW | Ammunition |
| 7 | EAT | Food (restores hunger) |
| 8 | USE_SKILL | Skill learning scrolls |
| 12 | MATERIAL | Crafting materials |

### Equipment Slots (15 positions)
| Slot | Name | Item Types |
|------|------|-----------|
| 1 | HEAD | Helmets, caps |
| 2 | BODY | Chest armor |
| 3 | ARMS | Gloves, bracers |
| 4 | PANTS | Leggings |
| 5 | BOOTS | Shoes, boots |
| 6 | NECK | Amulets, necklaces |
| 7 | LHAND | Left-hand weapon/shield |
| 8 | RHAND | Right-hand weapon |
| 9 | TWOHAND | Two-handed weapons |
| 10 | RFINGER | Ring |
| 11 | LFINGER | Ring |
| 12 | BACK | Capes |
| 13 | FULLBODY | Full body armor |

### Inventory
- **50 inventory slots** per character
- **120 bank slots** (accessible at warehouse NPCs)
- **Weight limit**: `(STR + AngelicSTR) * 500 + Level * 500`
- Gold has 1/20 weight reduction (special case)

### Item Durability
- `curLifeSpan` decrements on use or combat
- At 0: item becomes inactive (unequipped, unusable)
- Repair at blacksmith NPC: cost = `(maxLife - curLife) * basePrice / maxLife`

### Equipment Stat Effects (CalcTotalItemEffect)
When equipping/unequipping, recalculate:
- `HitRatio += weapon.relatedSkillMastery`
- `DefenseRatio = DEX * 2 + armor bonuses`
- Damage dice from weapon stats
- Damage absorption per armor slot
- Special effects from enchantments

### Enchantment Attribute Bitfield (DWORD)
```
Bits 28-31: Xelima upgrade level (0-15 bonus damage)
Bits 20-23: Special weapon effect type
Bits 16-19: Special weapon effect value
Bits 12-15: Stat enchantment type (1-12)
Bits 8-11:  Stat enchantment value (multiplied by 7)
Bits 4-7:   Secondary stat type
Bits 0-3:   Secondary stat value
```

### Stat Enchantment Types
| Type | Effect | Formula |
|------|--------|---------|
| 1 | Physical Resistance | +value*7 AR |
| 2 | Hit Accuracy | +value*7 hit ratio |
| 3 | Defense | +value*7 DR |
| 4 | Max HP | +value*7 |
| 5 | Max SP | +value*7 |
| 6 | Max MP | +value*7 |
| 7 | Magic Resistance | +value*7 |
| 8 | Physical Absorption | +value*3 armor |
| 9 | Magic Absorption | +value*3 magic save (max 80%) |
| 10 | Crit Damage | +value |
| 11 | XP Gain | +value*10% |
| 12 | Gold Gain | +value*10% |

---

## 3.16 Potions

### Recovery Formula
```
Amount = dice(effectValue1, effectValue2) + effectValue3
```

### Usage Rules
- 2-second minimum delay between potion uses
- Max 6 potions per 2-second window (speed hack detection)
- Must be on map with `HpMpSpPopoEnabled = true`
- Cannot exceed MaxHP/MaxMP/MaxSP

### Food Items
- `effectType = HPSTOCK`
- Restores hunger to 100
- Restores food stock = 500 units

---

## 3.17 NPC Shops

### Shop Interaction
1. Player walks to shopkeeper NPC and clicks
2. Server sends shop inventory (item list with prices)
3. Player selects buy/sell

### Buy
- Check player has enough gold
- Check inventory has empty slot
- Check weight limit
- Deduct gold, create item in inventory

### Sell
- Item sold at `price / 3` (33% of buy price)
- Remove from inventory, add gold
- Some items cannot be sold (quest items, special)

---

## 3.18 Ground Items

### Item Drop
- NPC drops items on death (from loot table, max 25 items)
- Each item has ~50% drop probability
- Items appear on ground tiles around NPC death location
- Reputation 3000+: up to 4x more item drops

### Pickup
- Walk over item tile or click
- Server validates: player on same tile, inventory space, weight limit
- Transfer item from ground to inventory

### Ground Decay
- Items on ground despawn after 5 minutes
- Gold stacks combine when dropped on same tile

---

## 3.19 Combat Sound Effects

### Sound Mappings
| Action | Sound File |
|--------|-----------|
| Short sword attack | C1.WAV |
| Long sword attack | C2.WAV |
| Bow aim | C3.WAV |
| Bow shoot | C4.WAV |
| Axe attack | C5.WAV |
| Male damage | C6.WAV |
| Female damage | C7.WAV |
| Male dying | C12.WAV |
| Female dying | C13.WAV |
| Barehand hit | C14.WAV |
| Sword hit | C15.WAV |
| Mace hit | C16.WAV |
| Arrow hit | C17.WAV |

---

## 3.20 Verification Checklist

- [x] Attack NPC -> hit/miss rolls match formula
- [x] Damage calculation matches STR scaling formula
- [x] Critical hits apply correct weapon-specific bonuses
- [ ] Combo counter increments 1-4, resets to 1 *(not implemented — no combo tracking system)*
- [x] Armor reduces damage up to 80% cap
- [ ] Back attacks halve target defense *(not implemented)*
- [x] NPC detects player at configured range
- [ ] NPC pathfinds toward target *(1-step movement only, no A\* pathfinding)*
- [x] NPC attacks when adjacent
- [ ] NPC flees when HP below bravery *(no flee state implemented)*
- [x] NPC respawns after configured timer
- [x] HP/MP/SP regenerate at correct intervals
- [x] Death teleports to home city, XP loss applied *(respawns to map center, not faction home city)*
- [x] XP gained from kills matches formula
- [x] Level up grants 3 stat points
- [x] Equipping weapon changes hit ratio and damage
- [x] Potions restore correct HP/MP/SP amount
- [x] Shop buy/sell with gold works
- [x] Ground items appear on NPC death, pickable
- [ ] Inventory weight limit enforced *(no weight system implemented)*
