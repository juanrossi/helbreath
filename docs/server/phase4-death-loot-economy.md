# Phase 4 — Death, Loot & Economy

## Goal

Port the C++ death penalty system (PK-tiered), complex loot tables with boss drop rates, reputation system, item attributes/enchantments, and equipment restrictions. The current Go implementation has a flat 5% XP penalty on death and simple percentage-based loot drops.

**Depends on**: Phase 1 (combat/item model), Phase 2 (boss NPCs, NPC types)

---

## Context

### Current Go Implementation

**Player Death** (`server/internal/game/engine.go:621`):
- XP penalty: flat 5% of current level XP
- Respawn after 3 seconds at map spawn center
- Respawn HP: MaxHP/2, MP: MaxMP/2, SP: MaxSP
- No item drops, no reputation impact, no PK-tier scaling

**NPC Death** (`server/internal/game/engine.go:1451`):
- Award XP = `npc.Type.XP` (flat)
- Award gold = `rand(1, XP)`
- Loot: simple percentage per item (e.g., Slime: 30% Small HP Potion)
- No boss drop tables, no reputation modifier, no extra drop bonuses

**Items** (`server/internal/items/item.go`):
- 6 weapons, 3 shields, 3 helms, 3 body, 3 legs, 2 boots, 2 capes, 8 potions, 5 materials
- No item attributes, enchantments, stat requirements, or level restrictions
- Durability: -1 per hit (weapon) or per hit taken (armor)

### Original C++ Implementation

**Death penalties** scale with PK count (0 = light, 12+ = extreme). Items can drop on death based on criminal status. Reputation system (±10000) affects drop rates and PK interactions.

**Loot generation** (`Game.cpp:54255 — NpcDeadItemGenerator`) uses multi-tier roll system: gold (60% at 10000 dice), potions (35%), rare items (1%), boss items (100% with extreme rates modified by 1/10000 base).

**Item attributes** stored as bit flags in `dwAttribute` (bits 20-23): Sharp (7) and Ancient (9) modify dice ranges. Equipment has gender/class/level/stat restrictions.

---

## Checklist

### 4.1 — PK-Based Death Penalties

- [ ] **Implement penalty tiers based on PKCount** — Replace flat 5% XP loss with tiered system:
  | PKCount | Status | Penalty Level |
  |---------|--------|--------------|
  | 0 | Innocent | 1-2 (light) |
  | 1-3 | Criminal | 3 (medium) |
  | 4-11 | Murderer | 6 (heavy) |
  | 12+ | Slaughterer | 12 (extreme) |
  Reference: `Game.cpp:16338 — ClientKilledHandler`.
- [ ] **Define penalty level effects** — Each penalty level determines: XP loss percentage, item drop chance, gold loss, stat penalty duration.
- [ ] **Super Attack victim check** — `bIsSAattacked` flag: if victim was killed during a super attack, penalty is reduced by one tier. Reference: `Game.cpp — ApplyCombatKilledPenalty`.
- [ ] **Clear all magic effects on death** — All entries in `MagicEffectStatus[]` set to 0. Unequip incompatible items. Clear exchange/trade mode.

### 4.2 — Item Drops on Player Death

- [ ] **Implement item drop on death** — Criminal and murderer players have a chance to drop equipped and inventory items on death.
  - Innocent (PK 0): No item drops
  - Criminal (PK 1-3): Low chance per item slot
  - Murderer (PK 4-11): Medium chance per item slot
  - Slaughterer (PK 12+): High chance per item slot
- [ ] **Drop items on ground** — Dropped items appear as ground loot at the death location, available for pickup by any player.
- [ ] **Protected item slots** — Certain quest items or bound items cannot be dropped.
- [ ] **Gold drop on death** — Percentage of carried gold drops based on criminal status.

### 4.3 — Map-Type Death Rules

- [ ] **Implement map type flags** — Each map has a type that modifies death behavior:
  - `NOPENALTY_NOREWARD`: Safe zones — no XP loss, no item drops, no PK credit
  - `NOPCDROP_NOPK`: Limited PvP — PK allowed but no item drops
  - Normal: Full PvP with all penalties
- [ ] **Wire map type into death handler** — Check map type before applying any death penalties. Reference: C++ `DEF_MAPTYPE_*` constants.
- [ ] **Safe zone identification** — Cities, starting areas, and specific maps are safe zones by default.

### 4.4 — Reputation System

- [ ] **Add Reputation field to player** — Integer value, range ±10000. Starts at 0.
- [ ] **Reputation changes on kills**:
  - Kill innocent player (same faction): Large reputation loss
  - Kill criminal player: Small reputation gain
  - Kill enemy faction player: Reputation gain
  - Kill unicorn: -5 reputation (special case)
  - Capped at ±10000
- [ ] **Reputation affects drop rates** — `m_iClientPrimaryDropRate` modified by reputation. Higher reputation = better drops from monsters.
- [ ] **Reputation affects NPC pricing** — Shops may charge more or less based on reputation (optional, not confirmed in C++ but logical extension).
- [ ] **Reputation display** — Broadcast reputation status to client for UI display.

### 4.5 — Complex Loot Tables

- [ ] **Port multi-tier loot generation** — Replace simple percentage drops with the C++ system:
  1. **Gold roll**: 60% chance on a `iDice(1, 10000)` roll. Amount scales with NPC level.
  2. **Potion roll**: 35% chance. Type depends on NPC level (weak mobs drop small potions, strong mobs drop large).
  3. **Equipment roll**: 1-5% chance for standard items. Type depends on NPC difficulty tier.
  4. **Rare roll**: 0.01-0.1% chance for rare/unique items.
  Reference: `Game.cpp:54255-55324 — NpcDeadItemGenerator`.
- [ ] **Boss loot tables** — Boss NPCs (`iNpcBossType == 1`) have 100% drop with extreme rates. Base rate: 1/10000 for best items, scaling up for lesser items.
- [ ] **Drop rate modifiers**:
  - Player reputation: `m_iClientPrimaryDropRate`
  - Map extra drop bonus: `m_iExtraDrop`
  - NPC boss type multiplier
- [ ] **Loot table configuration** — Define loot tables in config files (JSON/TOML) per NPC type, not hardcoded. Each entry: item ID, weight, min/max quantity.

### 4.6 — XP Calculation Refinement

- [ ] **Port C++ XP formula** — Replace `npc.Type.XP` flat award with `m_pNpcList[iNpcH]->m_iExp / 3` base. Reference: `Game.cpp — NpcKilledHandler:12028`.
- [ ] **Weapon bonus XP** — +20% XP if player has `m_iAddExp` set (from special equipment). Add `AddExpPercent` field to weapon definitions.
- [ ] **Crusade mode XP penalty** — During crusade/war events, XP gain is divided by 3.
- [ ] **XP overflow protection** — Prevent XP from going negative due to integer overflow on very high values.
- [ ] **Port C++ level XP curve** — Replace `level² × 100` with the recursive formula: `XP(n) = XP(n-1) + n * (50 + (n/17)²)`. This produces a much steeper curve at high levels.

### 4.7 — Item Attributes & Enchantments

- [ ] **Add attribute bit field to items** — `dwAttribute` field with bit flags. Bits 20-23 encode special properties:
  - Value 7 = Sharp: Increases weapon dice range
  - Value 9 = Ancient: Increases weapon dice range further
- [ ] **Attribute effects on dice** — Sharp weapons get +1 to DiceRange, Ancient weapons get +2 to DiceRange (or similar scaling from C++ values).
- [ ] **Item generation with attributes** — When items drop from NPCs, they have a small chance to roll with Sharp or Ancient attribute.
- [ ] **Display attributes** — Item name shows prefix: "Sharp Long Sword", "Ancient War Hammer".

### 4.8 — Equipment Restrictions

- [ ] **Stat requirements** — Each equipment piece can require minimum STR, DEX, INT, MAG, or Level to equip. Reference: `Game.cpp:13510 — bEquipItemHandler`.
- [ ] **Gender restrictions** — Some armor is gender-locked (male/female only).
- [ ] **Class restrictions** — Warrior-class items vs mage-class items (if class system is implemented).
- [ ] **Level requirements** — Minimum character level to equip certain items.
- [ ] **Enforce on equip** — `bEquipItemHandler` validates all restrictions before allowing equip. Return error to client if requirements not met.
- [ ] **Enforce on level change** — If a debuff or effect reduces stats below equipment requirements, unequip the item.

### 4.9 — Equipment Slot Expansion

- [ ] **Add Neck slot** — Necklace/amulet equipment (Kloness Necklace, etc.).
- [ ] **Add Finger slot** — Ring equipment with stat bonuses.
- [ ] **Two-handed weapon logic** — Two-handed weapons occupy both RHand and LHand, preventing shield use. Auto-unequip shield when equipping two-hander.
- [ ] **Update `CalcTotalItemEffect()`** — Include new slots in the stat recalculation.

### 4.10 — Durability Depth

- [ ] **Special attack durability cost** — Special/critical attacks cost 10-20 durability instead of 1. Reference: C++ `m_wCurLifeSpan` reduction.
- [ ] **Magic weapon durability** — Weapons that trigger magic effects lose 9-10 durability per activation.
- [ ] **Item breakage** — When durability reaches 0, item breaks and becomes unusable (but stays in inventory as broken). Can be repaired at blacksmith NPC.
- [ ] **Repair system** — Blacksmith NPCs offer repair service for gold. Cost scales with item quality and damage.

### 4.11 — Kill Rewards

- [ ] **Port `PK_KillRewardHandler()`** — Rewards for killing criminal players: gold and/or reputation gain. Reference: `Game.cpp:27112`.
- [ ] **Port `EnemyKillRewardHandler()`** — Rewards for killing enemy faction players: reputation gain, contribution points. Reference: `Game.cpp:27127`.
- [ ] **Quest credit on kill** — NPC kills increment `m_iCurQuestCount` for matching quest targets. (Partially implemented in Go already.)
- [ ] **War contribution on kill** — During war events, kills award `m_iWarContribution` points used for faction scoring.
- [ ] **Construction points** — Boss kills during crusade grant construction resources for faction buildings.

---

## Validation

After implementing Phase 4, verify:
1. Innocent players lose minimal XP on death; slaughterers lose massive XP
2. Criminal players drop items on death; innocent players do not
3. Safe zone maps prevent all death penalties
4. Reputation increases when killing criminals, decreases when killing innocents
5. Boss NPCs drop loot 100% of the time with proper rare item rates
6. Sharp and Ancient weapons have visibly higher damage than normal versions
7. Players cannot equip items they don't meet requirements for
8. Items break at 0 durability and can be repaired
9. Level XP curve matches C++ progression (steep at high levels)
