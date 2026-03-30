# Helbreath.xyz

A web-based rewrite of the classic Helbreath MMORPG (2001). Play in your browser — no download required.

**Tech Stack**: Go server, Phaser 3 + TypeScript client, PostgreSQL, WebSocket + Protobuf.

**Live**: [https://www.helbreath.xyz](https://www.helbreath.xyz)

## Prerequisites

- **Go** 1.21+
- **Node.js** 18+ and npm
- **PostgreSQL 16** (via Docker or local install)
- Original game assets in `assets/` (SPRITES, MAPDATA, SOUNDS, MUSIC)

## Quick Start

### 1. Database

```bash
docker compose up -d

# Apply migrations
psql -d hbonline -f migrations/001_initial.sql
psql -d hbonline -f migrations/002_inventory_skills_and_missing_fields.sql
psql -d hbonline -f migrations/003_auth_and_uuid.sql
```

### 2. Server Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key settings in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | (change me) | Secret key for JWT token signing |
| `JWT_EXPIRY` | `24h` | Token expiration duration |
| `DATABASE_URL` | `postgres://hbonline:hbonline@localhost:5432/hbonline` | PostgreSQL URL |
| `ADDR` | `:8080` | Server listen address |
| `MEMDB` | `false` | Use in-memory store (dev only) |
| `ALLOWED_ORIGINS` | `http://localhost:3000,...` | CORS allowed origins |

### 3. Start the Server

```bash
cd server
go run ./cmd/gameserver
```

### 4. Start the Client

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:3000** to play.

### 5. Play

1. **Register** an account (username, password, email)
2. **Create a character** (name, gender, appearance, stats)
3. **Enter the game** — spawn on the default map with starter gear
4. **Move** by clicking / holding mouse. Hold **Shift** to run
5. **Attack** by left-clicking on monsters (right-click also attacks)
6. **Chat** by pressing Enter. Prefix `!` for shout, `@name` for whisper
7. **Hotkeys**: `I` inventory, `C` stats, `M` spells, `K` skills, `G` guild, `P` party, `J` quests

## Authentication

Authentication uses **HTTP REST + JWT tokens** — login happens before Phaser loads any assets.

**Flow:**
```
Browser → HTML login form (no Phaser)
       → POST /api/login (username, password)
       ← JWT token + character list
       → Initialize Phaser + load assets
       → WebSocket connects with ?token=JWT
       ← Server validates JWT on upgrade
```

- Token stored in `localStorage` (survives refresh)
- Character ownership validated: JWT UUID → account_id → SQL `WHERE account_id = $2`
- All WebSocket messages require `client.Authenticated = true`
- `beforeunload` warns before closing while in-game

**HTTP Auth Endpoints:**
- `POST /api/login` — Login or register
- `GET /api/characters` — List characters (Bearer token)
- `POST /api/characters/create` — Create character (Bearer token)
- `POST /api/characters/delete` — Delete character (Bearer token)

## Production Deployment

### Build

```bash
# Server
cd server && go build -o hbonline-server ./cmd/gameserver

# Client (uses .env.production for API/WS/CDN URLs)
cd client && npm run build   # Output: client/dist/
```

### Client Environment (`client/.env.production`)

```
VITE_API_BASE=https://api.helbreath.xyz
VITE_WS_BASE=wss://api.helbreath.xyz
VITE_ASSET_BASE=https://cdn.helbreath.xyz
```

### Run Production Server

```bash
JWT_SECRET=your-64-char-secret-here \
DATABASE_URL=postgres://user:pass@host:5432/hbonline \
ALLOWED_ORIGINS=https://helbreath.xyz,https://www.helbreath.xyz \
./hbonline-server -addr :8080
```

## Admin System

Type commands in chat starting with `/`. Not broadcast to other players.

### Activating Admin

```sql
UPDATE characters SET admin_level = 4 WHERE name = 'YourName';
```

In `-memdb` mode, all new characters start as admin level 4.

### Admin Levels

| Level | Title | Description |
|-------|-------|-------------|
| 0 | Player | No commands |
| 1 | Basic GM | Teleport, /who |
| 2 | Standard GM | Kill, revive, god mode, effects, kick |
| 3 | Senior GM | Summon NPCs, weather, clear mobs |
| 4 | Super GM | Create items, modify stats, set gold |
| 5 | Server Admin | Full control, /shutdown |

### Commands

| Command | Level | Description |
|---------|-------|-------------|
| `/who` | 1 | List online players |
| `/tp <map> [x] [y]` | 1 | Teleport to map |
| `/goto <player>` | 1 | Teleport to player |
| `/god` | 2 | Toggle invulnerability + 10x damage |
| `/heal` | 2 | Full HP/MP/SP restore |
| `/kill <player>` | 2 | Kill player |
| `/revive <player>` | 2 | Revive player |
| `/setinvi [player]` | 2 | Toggle invisibility |
| `/setzerk [player]` | 2 | Toggle berserk |
| `/setfreeze [player]` | 2 | Toggle freeze |
| `/summonplayer <player>` | 2 | Teleport player to you |
| `/kick <player>` | 2 | Disconnect player |
| `/shutup <player> <min>` | 2 | Mute chat |
| `/givexp <amount>` | 2 | Give self XP |
| `/summon <npc_id> [count]` | 3 | Spawn NPCs (max 20) |
| `/weather <type>` | 3 | Set weather: clear/rain/snow/fog |
| `/clearnpc` | 3 | Kill all monsters on map |
| `/createitem <id> [count]` | 4 | Create items |
| `/setstat <player> <stat> <val>` | 4 | Set stat |
| `/setgold <player> <amount>` | 4 | Set gold |
| `/setadmin <player> <level>` | 4 | Set admin level |
| `/shutdown [seconds]` | 5 | Graceful shutdown with countdown |

## Game Systems

### Combat
- **Dice-based damage** ported from C++ `iCalculateAttackEffect`
- Multiplicative STR scaling: `damage * (1 + STR/500)`
- Layered defense: body, shield, cape, helm, leggings, boots
- Hit ratio: `attackerHitRatio / defenderRatio * 50`
- Critical via AttackMode system with SuperAttackLeft counter
- Weapon skill mastery trains on attack (20% chance)
- **Difficulty multiplier**: 3x easier (configurable in `difficulty.go`)

### Items (656 items from Item.cfg)
- Imported from original Helbreath Item.cfg/Item2.cfg/Item3.cfg
- Sharp (+1 dice) and Ancient (+2 dice) attributes on drops
- Ground items render from `item-ground` spritesheet atlas
- Equipment sprites lazy-loaded on demand to save GPU memory
- Full persistence: inventory + equipment saved as JSON in DB

### NPCs & Monsters (166 types from NPC.cfg)
- 6 AI states: Idle, Wander, Chase, Attack, Dead, Flee
- Faction-aware targeting (monsters vs players, criminal detection)
- Admin immunity, flee behavior, configurable spawns via JSON
- Variable respawn timers per NPC type
- Shop NPCs: left-click to interact (open shop), no attack animation

### Spells (91 from Magic.cfg)
- 13 status effects: poison, ice, berserk, invisibility, silence, defense shield, magic protection
- Spell resistance: `50 + (targetINT - attackerMAG) * 2`
- Poison DoT, ice movement slow, berserk damage/defense trade-off

### Death & Economy
- PK-tiered death penalties: 2% (innocent) to 20% (slaughterer)
- Map types: SafeZone (no penalty), Arena, Normal
- Reputation system (±10000)
- Multi-tier loot: gold + potions + equipment + rare (0.3% at 3x)
- Criminal tiers with PK decay (-1 per 10 min online)

### World
- Day/night cycle (30 min): ambient lighting (dusk/night/dawn)
- Weather: rain (particles + sound), snow (dual layers), fog (overlay + wisps)
- Weather synced from server, disabled indoors
- Minimap from JPEG images (`assets/minimaps/`), hidden indoors
- Minimap toggle in Controls panel

### Teleportation
- 83 maps with interconnections from original C++ configs
- Cities: Aresden, Elvine with buildings (blacksmith, shop, warehouse, cityhall)
- Dungeons: aresdend1 → dglv2 → dglv3 → dglv4
- Hunt zones, Tower of Helbreath, Icebound, event maps
- No-attack areas at city gates and building interiors

### Equipment Rendering
- Gender-specific sprites (male/female variants)
- Weapon: FullFrame animation with `startSpriteSheetIndex + armState * 8 + direction`
- Shield: DirectionalSubFrame with armament state index
- Armor/helm/leggings/boots/cape: DirectionalSubFrame with `ARMOUR_SPRITESHEET_BASE[state]`
- Lazy loading: equipment sprites loaded on-demand, player/NPC visuals refresh when ready
- Custom cursor from `interface.spr`: pointer, grab, attack (sword)

### Controls Panel
- Music volume slider + mute
- Sound effects volume slider + mute
- Minimap show/hide toggle

### Keyboard Shortcuts
Disabled while typing in input fields (chat, party invite, etc.)

| Key | Action |
|-----|--------|
| I | Inventory |
| C | Stats |
| M | Spells |
| K | Skills |
| G | Guild |
| P | Party |
| J | Quests |
| Shift | Run (hold) |
| Enter | Chat |

## Project Structure

```
hbonline/
├── server/                    # Go game server
│   ├── cmd/gameserver/        # Entry point + .env loader
│   ├── internal/
│   │   ├── auth/              # JWT token generation/validation
│   │   ├── game/              # Engine, combat, admin, spawns, persistence, difficulty
│   │   ├── player/            # Player struct, stats, equipment
│   │   ├── npc/               # 166 NPC types, AI states
│   │   ├── items/             # 656 items, inventory, loot tables
│   │   ├── magic/             # 91 spells, effects, resistance
│   │   ├── skills/            # 24 skills, mastery
│   │   ├── mapdata/           # Map loading, teleports, no-attack areas
│   │   ├── db/                # PostgreSQL + in-memory store
│   │   ├── network/           # WebSocket, JWT-on-upgrade, protobuf
│   │   └── world/             # Day/night, weather
│   ├── tools/                 # Import tools (itemimport, npcimport, magicimport)
│   └── pkg/proto/             # Generated protobuf Go code
├── client/                    # Phaser 3 + TypeScript client
│   ├── src/
│   │   ├── scenes/            # Boot, CharSelect, CharCreate, Game
│   │   ├── game/              # GameAsset, HBSprite, HBMap, PlayerAppearanceManager
│   │   ├── constants/         # Assets, ItemDefs, ItemGroundSprites
│   │   ├── network/           # WebSocket, MessageHandler (with buffering)
│   │   ├── audio/             # SoundManager, MusicManager
│   │   └── login.ts           # Pre-Phaser HTTP auth
│   └── public/assets/
│       ├── sprites/           # 361 .spr files
│       ├── spritesheets/      # item-ground atlas, interface
│       ├── minimaps/          # 35 JPEG minimaps
│       ├── sounds/            # 129 MP3 sound effects
│       └── music/             # 11 MP3 music tracks
├── proto/                     # Protobuf definitions
├── migrations/                # 3 SQL migration files
├── .env.example               # Server config template
├── CLAUDE.md                  # AI assistant instructions
└── docs/server/               # Phase implementation docs
```

## Database Migrations

```bash
psql -d hbonline -f migrations/001_initial.sql              # accounts + characters
psql -d hbonline -f migrations/002_inventory_skills_and_missing_fields.sql  # inventory, skills, guild, reputation
psql -d hbonline -f migrations/003_auth_and_uuid.sql         # UUID for JWT
```

## Development

### Tests

```bash
cd server
go test ./... -count=1    # 736+ tests across 22 packages
```

### In-Memory Mode

```bash
cd server
go run ./cmd/gameserver -memdb    # No PostgreSQL, all characters start as admin 4
```

### Import Tools

Regenerate item/NPC/spell definitions from original C++ configs:

```bash
cd server
go run ./tools/itemimport/ > internal/items/itemdefs_gen.go      # 656 items
go run ./tools/npcimport/ > internal/npc/npcdefs_gen.go          # 108 NPCs
go run ./tools/magicimport/ > internal/magic/spelldefs_gen.go    # 63 spells
```

## License

The source code of this project is released under the MIT License. Original Helbreath assets are property of Siementech Co. Ltd.