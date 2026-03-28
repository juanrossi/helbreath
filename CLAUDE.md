# CLAUDE.md — Project Instructions for HB Online

## Project Overview

HB Online is a web-based rewrite of the classic Helbreath MMORPG.
- **Server**: Go (WebSocket + Protobuf), PostgreSQL
- **Client**: Phaser 3 + TypeScript (Vite build)
- **Reference**: Original C++ in `ep_client_final/sources_ep_gserver/Game.cpp` (67,539 lines)

## Critical Rules

### Never modify these directories
- `helbreath-base-game-master/` — Reference client only. Read for patterns, never edit.
- `helbreath-base-game-master/ARCHITECTURE.md` — Reference only. Architecture of the reference client.
- `helbreath-v3.82-master/` — Original C++ source and configs. Read for reference, never edit.
- `ep_client_final/` — Original C++ server source. Read for reference, never edit.

### Only modify
- `client/` — Our Phaser 3 client
- `server/` — Our Go game server
- `proto/` — Protobuf definitions (regenerate Go+JS after changes)
- `migrations/` — PostgreSQL schema migrations
- `docs/` — Documentation of current and missing implementation.
- `docs/system/` — Documentation of base client.

## Architecture

### Server (`server/`)
- Entry: `cmd/gameserver/main.go`
- Game engine: `internal/game/engine.go` — main loop, message handling, NPC AI
- Combat: `internal/game/combat.go` — dice-based damage (ported from C++)
- Admin: `internal/game/admin.go` — 22 chat commands (`/god`, `/tp`, `/kill`, etc.)
- Items: `internal/items/itemdefs_gen.go` — 656 items from Item.cfg (generated)
- NPCs: `internal/npc/npcdefs_gen.go` — 108 NPC types from NPC.cfg (generated)
- Spells: `internal/magic/spelldefs_gen.go` — 91 spells from Magic.cfg (generated)
- DB: `internal/db/` — PostgreSQL + in-memory store, inventory persistence as JSON
- Effects: `internal/magic/effects.go` — 13 status effect types
- Persistence: `internal/game/persistence.go` — save/load inventory to DB

### Client (`client/`)
- Scenes: `src/scenes/GameScene.ts` — main game scene (~3000 lines)
- Sprites: `src/game/objects/GameAsset.ts` — sprite renderer with animation
- Equipment: `src/game/PlayerAppearanceManager.ts` — player sprite composition
- Items: `src/constants/ItemDefs.ts` — 656 item definitions with sprite mappings
- Assets: `src/constants/Assets.ts` — sprite file registration (175 equipment + 56 monsters)
- Weather: `src/game/effects/WeatherManager.ts` — rain, snow, fog, day/night lighting
- Network: `src/network/MessageHandler.ts` — WebSocket + protobuf, message buffering

### Reference Client (`helbreath-base-game-master/`)
- Architecture doc: `ARCHITECTURE.md` — comprehensive reference, read this first
- Equipment system: `sp-client/src/utils/PlayerAppearanceManager.ts`
- Item definitions: `sp-client/src/constants/Items.ts`
- Monster definitions: `sp-client/src/constants/Monsters.ts`

## Item System

Items are imported from original Helbreath `Item.cfg` files:
```bash
cd server && go run ./tools/itemimport/ > internal/items/itemdefs_gen.go
```

Original item IDs are authoritative. Key IDs:
- Weapons: 1 (Dagger), 8 (ShortSword), 14 (LongSword), 22 (BattleAxe)
- Armor: 453 (Shirt(M)), 471 (Shirt(W)), 454 (Hauberk(M)), 456 (ChainMail(M))
- Shields: 39 (WoodenShield), 79 (WoodShield), 80 (LeatherShield)
- Potions: 91 (RedPotion), 92 (BigHealthPotion), 93 (BluePotion), 94 (BigManaPotion)
- Helms: 600 (Helm), Boots: 450 (Shoes), Cape: 402 (Cape)

## NPC System

NPCs imported from `NPC.cfg`:
```bash
cd server && go run ./tools/npcimport/ > internal/npc/npcdefs_gen.go
```

Monster sprite type IDs map to .spr files in `client/public/assets/sprites/`.

## Spell System

Spells imported from `Magic.cfg`:
```bash
cd server && go run ./tools/magicimport/ > internal/magic/spelldefs_gen.go
```

## Database

### Running migrations
```bash
psql -d hbonline -f migrations/001_initial.sql
psql -d hbonline -f migrations/002_inventory_skills_and_missing_fields.sql
```

### Dev mode (no database)
```bash
cd server && go run ./cmd/gameserver -memdb
```
All characters start as admin level 4 in memdb mode.

## Admin System

Set via DB: `UPDATE characters SET admin_level = 4 WHERE name = 'X';`

Commands (type in chat):
- `/god` — invulnerable + 10x damage
- `/tp <map> [x] [y]` — teleport
- `/createitem <id> [count]` — create items
- `/summon <npc_id> [count]` — spawn NPCs
- `/weather <clear|rain|snow|fog>` — change weather
- `/kill`, `/revive`, `/heal`, `/setstat`, `/setgold`, `/setadmin`

## Building & Testing

### Server
```bash
cd server
go build ./...
go test ./... -count=1  # 730+ tests
```

### Client
```bash
cd client
npm install
npx tsc --noEmit  # type check
npm run dev       # dev server at localhost:3000
```

## Combat System (from C++)

- Dice-based damage: `iDice(n, sides) + AttackBonus`
- Multiplicative STR scaling: `damage * (1 + STR/500)`
- Layered defense: each armor slot absorbs independently
- Hit ratio: `50 + AttackerHitRatio - TargetDefenseRatio`
- Criticals: `AttackMode >= 20` with SuperAttackLeft counter
- 13 status effects: poison, ice, berserk, invisibility, silence, etc.

## Weather System

Server tracks weather and broadcasts via Notification Type 10:
- Format: `"time:day|weather:rain"`
- Weather types: clear, rain, snow, fog
- Time of day: day, dusk, night, dawn
- Admin command: `/weather <type>`
- Fog reduces NPC aggro range by 30%
- Day/night affects weapon bonuses

## Sprite System

Equipment sprites in `client/public/assets/sprites/`:
- Male prefix: `m` (e.g., `msw.spr` = male sword)
- Female prefix: `w` (e.g., `wsw.spr` = female sword)
- Convention: `m{item}.spr` / `w{item}.spr`
- Registered in `client/src/constants/Assets.ts`

Minimap images in `client/public/assets/minimaps/`:
- JPEG files named by map (e.g., `default.jpg`, `aresden.jpg`)
- Loaded dynamically, falls back to generated canvas if missing

## Key Implementation Phases (see docs/server/)

1. **Phase 1**: Combat fidelity (dice, STR scaling, defense layers, criticals)
2. **Phase 2**: Monster AI (flee, faction targeting, configurable spawns)
3. **Phase 3**: Status effects (13 effects, spell resistance)
4. **Phase 4**: Death/loot/economy (PK penalties, reputation, multi-tier loot)
5. **Phase 5**: Endgame (level 100 cap, Gizon points, criminal tiers, stat caps)

## Persistence

Items serialized as JSON in `inventory_data` and `equipment_data` DB columns.
Full character state saved on disconnect via `savePlayerToDB()`.
Message buffering in client prevents data loss during scene transitions.

## Common Pitfalls

- Always call `p.RecalcCombatStats()` after equip/unequip/stat change
- Always call `p.SyncEquipmentAppearance()` after equip/unequip
- Client `buildGearConfig()` needs full appearance object with equipment fields
- GameAsset animations can fail if sprite sheets aren't loaded — always guard with try/catch
- Server sends world state as Notification Type 10, not a dedicated proto message
- Item.cfg IDs are authoritative — don't use arbitrary IDs for items
