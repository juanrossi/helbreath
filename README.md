# HB Online

A web-based rewrite of the classic Helbreath MMORPG. Go server, Phaser 3 + TypeScript client, PostgreSQL, WebSocket + Protobuf.

## Prerequisites

- **Go** 1.25+
- **Node.js** 18+ and npm
- **Docker** (for PostgreSQL) or a local PostgreSQL 16 instance
- Original game assets in `assets/` (SPRITES, MAPDATA, SOUNDS, MUSIC)

## Quick Start

### 1. Start the Database

```bash
docker compose up -d
```

This starts PostgreSQL 16 on port 5432 and auto-applies migrations from `migrations/`.

Connection string: `postgres://hbonline:hbonline@localhost:5432/hbonline?sslmode=disable`

To verify it's healthy:

```bash
docker compose ps
```

### 2. Start the Server

```bash
cd server
go run ./cmd/gameserver
```

The server starts on **port 8080** by default. It will:
- Connect to PostgreSQL
- Load all `.amd` map files from `assets/MAPDATA`
- Spawn NPCs across maps (monsters + shop vendors)
- Start the game loop (10 ticks/second)
- Listen for WebSocket connections at `ws://localhost:8080/ws`

#### Server Flags

| Flag | Default | Description |
|------|---------|-------------|
| `-addr` | `:8080` | Server listen address |
| `-db` | `postgres://hbonline:hbonline@localhost:5432/hbonline?sslmode=disable` | PostgreSQL connection URL |
| `-maps` | `assets/MAPDATA` | Directory containing `.amd` map files |
| `-memdb` | `false` | Use in-memory store (no PostgreSQL needed, data lost on restart) |

**Example with custom port and in-memory DB (no Docker needed):**

```bash
go run ./cmd/gameserver -addr :9090 -memdb
```

### 3. Start the Client

```bash
cd client
npm install
npm run dev
```

The Vite dev server starts on **http://localhost:3000** with automatic WebSocket proxying to the Go server.

Open your browser to **http://localhost:3000** to play.

### 4. Play

1. **Register** an account (username + password)
2. **Create a character** (name, gender, appearance, stat allocation — total 70 points, each stat min 10)
3. **Enter the game** — you spawn on the default map with starter equipment
4. **Move** with arrow keys, hold **Shift** to run
5. **Chat** by pressing Enter (prefix `!` for shout, `@name` for whisper)
6. **Attack** by right-clicking on monsters
7. **Open inventory** with `I`, stats with `C`, spells with `M`, skills with `K`

## Project Structure

```
hbonline/
├── server/                    # Go game server
│   ├── cmd/gameserver/        # Server entry point
│   ├── internal/
│   │   ├── game/              # Game engine, tick loop, all handlers
│   │   ├── player/            # Player entity, stats, appearance
│   │   ├── npc/               # NPC types, AI state machine
│   │   ├── mapdata/           # AMD map parser, collision, teleports
│   │   ├── items/             # Item definitions, inventory system
│   │   ├── combat/            # Damage formulas
│   │   ├── magic/             # Spell system (98 spells)
│   │   ├── skills/            # Skill system (24 skills)
│   │   ├── guild/             # Guild management
│   │   ├── party/             # Party system
│   │   ├── quest/             # Quest system
│   │   ├── trade/             # Player trading
│   │   ├── world/             # World state, weather, events
│   │   ├── network/           # WebSocket server, protobuf codec
│   │   └── db/                # PostgreSQL data store
│   └── pkg/proto/             # Generated protobuf Go code
├── client/                    # Phaser 3 + TypeScript client
│   ├── src/
│   │   ├── scenes/            # Phaser scenes (Boot, Login, CharSelect, Game)
│   │   ├── game/assets/       # HBMap and HBSprite parsers
│   │   ├── network/           # WebSocket client, message handler
│   │   └── proto/             # Generated protobuf JS code
│   └── public/assets/         # Converted game assets
│       ├── maps/              # .amd map files + .json metadata
│       ├── sprites/           # .spr sprite files
│       ├── spritesheets/      # Extracted sprite sheets
│       ├── sounds/            # WAV sound effects
│       └── music/             # WAV/MP3 music
├── proto/                     # Protobuf definitions (.proto files)
├── migrations/                # SQL migrations (auto-applied by Docker)
├── assets/                    # Original game assets (source)
│   ├── SPRITES/               # 446 .pak/.apk files
│   ├── MAPDATA/               # 83 .amd map files
│   ├── SOUNDS/                # 231 .WAV files
│   └── MUSIC/                 # 11 .wav files
├── tools/                     # Asset pipeline binaries
│   ├── pakextract             # PAK -> PNG/spritesheet converter
│   └── amdconvert             # AMD -> JSON map converter
├── docker-compose.yml         # PostgreSQL container
└── docs/                      # Phase specification documents
```

## Architecture

```
┌──────────────┐  WebSocket/Protobuf  ┌──────────────┐
│  Go Server   │◄────────────────────►│ Phaser Client │
│  (port 8080) │                      │ (port 3000)   │
└──────┬───────┘                      └───────────────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
│  (port 5432) │
└──────────────┘
```

- **Server**: Authoritative game state. Validates all movement, combat, and item actions. Runs at 10 ticks/second.
- **Client**: Renders the game using Phaser 3. Loads `.amd` map files and `.spr` sprite files directly. Communicates via binary WebSocket (1-byte type prefix + protobuf payload).
- **Database**: Stores accounts and characters. Schema auto-created via `migrations/001_initial.sql`.

## Network Protocol

All messages are binary WebSocket frames: `[1-byte type ID][protobuf payload]`.

**Client -> Server** (`0x01`-`0x1E`): Login, character CRUD, movement, chat, combat, items, spells, skills, trading, guilds, parties, quests.

**Server -> Client** (`0x81`-`0xAB`): Responses, entity appear/disappear/motion, damage, stats, inventory, map changes, notifications.

See `proto/*.proto` for full message definitions.

## Game Features

### Implemented
- Account registration/login with bcrypt
- Character creation with appearance customization
- Map rendering from original .amd files with collision
- Real-time multiplayer movement with server validation
- Chat (normal, shout, whisper, guild, party)
- NPC monsters with AI (idle, wander, chase, attack, respawn)
- Melee combat with hit/miss/damage/critical formulas
- Item system (equipment, potions, materials, ground drops)
- Shop NPCs (buy/sell)
- Spell system (damage, heal, buff, debuff, area effects)
- Skill system (mining, fishing, alchemy, crafting)
- Faction selection (Aresden/Elvine)
- Guild system (create, invite, kick, ranks, chat)
- Party system (up to 8 members)
- Player trading
- PK/criminal tracking
- Quest system (hunt, collect, turn-in)
- Map teleportation between zones
- Day/night cycle and weather system
- Starting equipment for new characters
- Minimap with terrain colors
- HUD with HP/MP/SP bars

### Maps
Cities (Aresden, Elvine), hunt zones, dungeons, middleland (PvP), buildings (blacksmiths, shops, cityhalls, warehouses, wizard towers), and more — 82 maps total.

## Development

### Run Tests

```bash
# Server tests (591 tests)
cd server
go test ./... -count=1

# With coverage
go test ./... -count=1 -coverprofile=cover.out
go tool cover -func=cover.out
```

### Build for Production

```bash
# Server binary
cd server
go build -o hbonline-server ./cmd/gameserver

# Client static files
cd client
npm run build
# Output in client/dist/
```

### In-Memory Mode (No Database)

For quick testing without Docker/PostgreSQL:

```bash
go run ./cmd/gameserver -memdb
```

Data is stored in memory and lost on server restart.

### Asset Pipeline

The `tools/` directory contains pre-built binaries for converting original game assets:

- **`pakextract`** — Extracts sprites from `.pak`/`.apk` files to PNG spritesheets
- **`amdconvert`** — Converts `.amd` map files to JSON format

The client loads `.amd` and `.spr` files directly, so conversion is optional for development.

### Protobuf

Message definitions are in `proto/`. If you modify them:

```bash
# Regenerate Go code
protoc --go_out=server/pkg/proto --go_opt=paths=source_relative proto/*.proto

# Regenerate JS code
cd client
npx pbjs -t static-module -w es6 -o src/proto/messages.js ../proto/*.proto
npx pbts -o src/proto/messages.d.ts src/proto/messages.js
```

## Environment Variables

| Variable | Used By | Default | Description |
|----------|---------|---------|-------------|
| `POSTGRES_USER` | Docker | `hbonline` | Database user |
| `POSTGRES_PASSWORD` | Docker | `hbonline` | Database password |
| `POSTGRES_DB` | Docker | `hbonline` | Database name |

Server configuration is done via CLI flags (see [Server Flags](#server-flags)).

## Ports

| Service | Port | Protocol |
|---------|------|----------|
| Go game server | 8080 | HTTP + WebSocket |
| Vite dev server | 3000 | HTTP (proxies WS to 8080) |
| PostgreSQL | 5432 | TCP |

## License

Private project. Original Helbreath assets are property of their respective owners.
