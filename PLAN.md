# Helbreath Online - Web MMORPG Rewrite: Complete Specification

## Context

Rewriting the classic Helbreath MMORPG (C++/DirectDraw/WinSock) as a web game. Original source in `ep_client_final/sources_ep_client/` (client) and `ep_client_final/sources_ep_gserver/` (server). Game assets in `assets/` folder (446 sprite .pak/.apk files, 83 .amd maps, 231 sound WAVs, 11 music WAVs, 7 font files).

**Stack:** Go server, Phaser 3 + TypeScript client, PostgreSQL, WebSocket + Protobuf.

**MVP:** Registration, login, character creation, movement with collision, other players visible, chat, static NPCs. Full specs for all features documented below.

---

## 1. Project Structure

```
hbonline/
├── server/
│   ├── cmd/
│   │   ├── gameserver/main.go
│   │   └── assetpipeline/main.go       # PAK/AMD converter
│   ├── internal/
│   │   ├── game/engine.go               # Game loop (10 ticks/sec)
│   │   ├── game/world.go                # World state, entity manager
│   │   ├── network/websocket.go         # WS connection manager
│   │   ├── network/codec.go             # Protobuf encode/decode
│   │   ├── player/player.go             # Player entity + state
│   │   ├── player/auth.go               # Registration + login
│   │   ├── player/movement.go           # Movement validation
│   │   ├── player/appearance.go         # Sprite composition data
│   │   ├── npc/npc.go                   # NPC entity
│   │   ├── npc/behavior.go              # AI state machine (Phase 3+)
│   │   ├── npc/spawner.go               # Mob generators (Phase 3+)
│   │   ├── mapdata/loader.go            # AMD binary parser
│   │   ├── mapdata/map.go               # Map struct, tile access
│   │   ├── mapdata/collision.go         # Walkability checks
│   │   ├── mapdata/teleport.go          # Teleport system
│   │   ├── mapdata/sector.go            # Sector-based spatial indexing
│   │   ├── combat/                      # Phase 3+
│   │   ├── items/                       # Phase 3+
│   │   ├── magic/                       # Phase 4+
│   │   ├── skills/                      # Phase 4+
│   │   ├── guild/                       # Phase 5+
│   │   ├── quest/                       # Phase 4+
│   │   └── db/
│   │       ├── postgres.go              # Connection pool
│   │       ├── accounts.go              # Account CRUD
│   │       └── characters.go            # Character CRUD
│   ├── pkg/proto/                       # Generated Protobuf Go code
│   └── go.mod
├── client/
│   ├── src/
│   │   ├── scenes/
│   │   │   ├── BootScene.ts             # Asset preloading
│   │   │   ├── LoginScene.ts            # Login/register forms
│   │   │   ├── CharSelectScene.ts       # Character selection
│   │   │   ├── CharCreateScene.ts       # Character creation
│   │   │   └── GameScene.ts             # Main game
│   │   ├── network/
│   │   │   ├── WebSocketClient.ts       # WS connection + reconnect
│   │   │   └── MessageHandler.ts        # Route incoming messages
│   │   ├── sprites/
│   │   │   ├── CharacterComposer.ts     # Layer equipment sprites
│   │   │   ├── SpriteRegistry.ts        # Sprite ID -> atlas mapping
│   │   │   └── AnimationManager.ts      # Frame timing per action
│   │   ├── map/
│   │   │   ├── TileRenderer.ts          # Tile background/objects
│   │   │   ├── CollisionGrid.ts         # Client-side walkability
│   │   │   └── MapTransition.ts         # Teleport handling
│   │   ├── entities/
│   │   │   ├── Player.ts               # Local + remote players
│   │   │   ├── Npc.ts                   # NPC entities
│   │   │   └── EntityManager.ts         # Track all entities
│   │   ├── ui/
│   │   │   ├── ChatUI.ts               # Chat input/display
│   │   │   ├── HUD.ts                  # HP/MP/SP bars
│   │   │   └── Minimap.ts              # Minimap overlay
│   │   ├── audio/
│   │   │   ├── SoundManager.ts          # WAV playback with distance
│   │   │   └── MusicManager.ts          # Background music
│   │   └── main.ts
│   ├── public/assets/                   # Converted assets
│   │   ├── spritesheets/                # PNG atlas + JSON manifest
│   │   ├── maps/                        # Converted AMD -> JSON
│   │   ├── sounds/                      # WAV files (served as-is)
│   │   └── music/                       # WAV/MP3 files
│   ├── package.json
│   └── tsconfig.json
├── proto/                               # Protobuf definitions
│   ├── auth.proto
│   ├── game.proto
│   ├── chat.proto
│   └── common.proto
├── tools/
│   ├── pakextract/                      # PAK -> PNG sprite sheets
│   └── amdconvert/                      # AMD -> JSON map data
├── migrations/                          # SQL migrations
├── data/                                # Game data (JSON configs)
│   ├── items.json
│   ├── spells.json
│   ├── skills.json
│   ├── npcs.json
│   ├── crafting.json
│   └── quests.json
└── assets/                              # Original game assets (source)
    ├── SPRITES/  (446 .pak/.apk files)
    ├── MAPDATA/  (83 .amd files)
    ├── SOUNDS/   (231 .WAV files)
    ├── MUSIC/    (11 .wav files)
    └── FONTS/    (7 .FNT files)
```

---

## 2. Asset Pipeline (PAK -> Web)

### 2.1 PAK Binary Format

From `Sprite.cpp` lines 22-46:

```
PAK File Layout:
  Offset 0:     File header (24 bytes, reserved/magic)
  Offset 24:    Sprite index table (8 bytes per sprite entry)
                  - Bytes 0-3: uint32 absolute offset to sprite data (iASDstart)
                  - Bytes 4-7: reserved

Per Sprite (at iASDstart):
  Offset +0:    100 bytes reserved metadata
  Offset +100:  int32 m_iTotalFrame (total animation frames)
  Offset +104:  4 bytes reserved
  Offset +108:  stBrush[m_iTotalFrame] (12 bytes each):
                  int16 sx   - source X offset
                  int16 sy   - source Y offset
                  int16 szx  - frame width (pixels)
                  int16 szy  - frame height (pixels)
                  int16 pvx  - pivot X (anchor point)
                  int16 pvy  - pivot Y (anchor point)
  After brushes: BMP data (BITMAPFILEHEADER + BITMAPINFOHEADER + palette + pixels)
                 Supports: 1-bit, 4-bit, 8-bit indexed, 24-bit RGB
                 First pixel = color key (transparent)
```

### 2.2 PAK Extractor Implementation

**Input:** `assets/SPRITES/*.pak` and `*.apk` (446 files)
**Output per PAK:**
- Directory of PNG frames: `public/assets/spritesheets/{pakname}/frame_{N}.png`
- Phaser atlas JSON: `public/assets/spritesheets/{pakname}.json` (TexturePacker format)
- Manifest JSON: `public/assets/spritesheets/{pakname}_manifest.json` with brush offsets

**Implementation steps:**
1. Open PAK file, read 24-byte header
2. Read sprite index entries at offset 24 (iterate until EOF or invalid pointer)
3. For each sprite entry:
   a. Seek to `iASDstart + 100`, read `m_iTotalFrame`
   b. Read `m_iTotalFrame` brush entries (12 bytes each)
   c. Calculate bitmap offset: `iASDstart + 108 + (12 * m_iTotalFrame)`
   d. Parse BMP: read BITMAPFILEHEADER (14 bytes), BITMAPINFOHEADER (40+ bytes)
   e. If indexed color: read palette
   f. Read pixel data (bottom-up row order, padded to 4-byte boundary)
   g. Apply color key transparency (first pixel color -> alpha=0)
   h. For each frame: extract sub-image using brush `{sx, sy, szx, szy}`
   i. Save as PNG with alpha channel
4. Combine frames into sprite sheet atlas
5. Output JSON manifest with frame rects and pivot points (pvx, pvy)

**Sprite file categorization (from SpriteID.h and file names):**

| Category | Files | Sprite ID Range | Description |
|----------|-------|-----------------|-------------|
| Male body/underwear | Ym.pak | 1400+ | Base male character |
| Female body/underwear | Yw.pak | 11400+ | Base female character |
| Male hair | Mhr.pak | 1600+ | 13 hair styles |
| Female hair | Whr.pak | 11600+ | 13 hair styles |
| Male body armor | MHHauberk*.pak, MPMail.pak, MCMail.pak, etc. | 1800+ | 19 armor types |
| Female body armor | WHHauberk*.pak, WPMail.pak, WCMail.pak, etc. | 11800+ | 19 armor types |
| Male leggings | MHLeggings*.pak, MLeggings.pak, MCHoses.pak | 2300+ | 13 types |
| Female leggings | WHLeggings*.pak, WLeggings.pak, WCHoses.pak | 12300+ | 13 types |
| Male boots | MLBoots.pak, MShoes.pak | 2500+ | 6 types |
| Female boots | WLBoots.pak, WShoes.pak | 12500+ | 6 types |
| Male capes | Mmantle01-06.pak | 2600+ | 10 types |
| Female capes | Wmantle01-06.pak | 12600+ | 10 types |
| Male helmets | MHelm1-4.pak, NMHelm1-4.pak, MHCap*.pak | 2750+ | 16 types |
| Female helmets | WHelm1,4.pak, NWHelm1-4.pak, WHCap*.pak | 12750+ | 16 types |
| Male weapons | Msw.pak, Msw2-3.pak, MAxe1-6.pak, MStaff1-3.pak, etc. | 3000+ | 54 types |
| Female weapons | Wsw.pak, Wsw2-3.pak, WAxe1-6.pak, WStaff1-3.pak, etc. | 13000+ | 54 types |
| Male shields | Msh.pak | 6500+ | Multiple types |
| Female shields | Wsh.pak | 16500+ | Multiple types |
| Monsters | SKE.PAK, SLM.PAK, Orc.pak, Demon.pak, etc. | 17000+ | 40+ monster types |
| Map tiles | maptiles1-6.pak, Tile*.pak, whousetiles.pak | Various | Background tiles |
| Objects | Objects1-7.pak, Structures1.pak | Various | Map objects (walls, trees) |
| Effects | EFFECT*.PAK, Effect*.pak, frost.pak, etc. | Various | Spell/combat effects |
| Items | item-equipM/W.pak, item-ground.pak, item-pack.pak | Various | Item sprites |
| UI | GameDialog.pak, New-Dialog*.pak, interface*.pak | Various | UI elements |
| Login | LoginDialog*.apk, selectchar*.apk, newchar*.apk | Various | Login/char screens |

### 2.3 AMD Map Converter

**Input:** `assets/MAPDATA/*.amd` (83 map files)
**Output per map:** `public/assets/maps/{mapname}.json`

**AMD binary format (from MapData.cpp lines 1037-1080):**
```
Byte 0-255:   ASCII header (null-padded):
                "MAPSIZEX={width}" and "MAPSIZEY={height}"
Byte 256+:    Tile data, row-major order (y outer, x inner)
              Per tile: 10 bytes:
                int16 tileSprite        (background sprite ID)
                int16 tileSpriteFrame   (background frame)
                int16 objectSprite      (object sprite ID: walls, trees, buildings)
                int16 objectSpriteFrame (object frame)
                byte  flags:
                  bit 7 (0x80): NOT walkable (inverted: set = blocked)
                  bit 6 (0x40): teleport location
                  bit 5 (0x20): farm tile
                byte  padding
```

**Output JSON format:**
```json
{
  "name": "aresden",
  "width": 256,
  "height": 256,
  "tiles": [
    {
      "x": 0, "y": 0,
      "tileSprite": 5, "tileSpriteFrame": 0,
      "objectSprite": 0, "objectSpriteFrame": 0,
      "walkable": true, "teleport": false, "farm": false, "water": false
    }
  ],
  "collisionGrid": [[1,1,0,0,...]],
  "teleportTiles": [{"x": 10, "y": 20}]
}
```

Water detection: `tileSprite == 19` (from Map.cpp line 618).

**Map list (83 maps):**
- Cities: aresden, elvine, city
- Dungeons: aresdend1, elvined1, dglv2-4, dm, cath_1-2, towerofh, Toh1-3
- Hunt zones: huntzone1-4, fightzone1-9
- Shops: gshop_1-2, bsmith_1-2, whouse, whouse2
- Special: middleland, 2ndmiddle, bisle, icebound, procella, Extreme
- Government: cityhall_1-2, Cmdhall_1-2, wrhus_1-2, wzdtwr_1-2
- University: areuni, elvuni
- Jails: arejail, elvjail
- Barracks: ABarracks, EBarracks, MBarracks
- Events: EventMap, EventDk, NewEvent, ArGEvent, avaevent, evento13-14, masacre
- Special areas: Abaddon, WorldMap, BTField, FightMap, Counter, MapaVip, VipMap1
- Starting: default, resurr1-2, market

---

## 3. Networking Protocol (Protobuf over WebSocket)

### 3.1 Connection Flow

```
1. Client opens WebSocket to ws://server:port/ws
2. Server assigns temporary connection ID
3. Client sends LoginRequest (username + password)
4. Server validates -> sends LoginResponse with character list
5. Client sends EnterGameRequest (character_id)
6. Server loads character, places on map -> sends EnterGameResponse with:
   - PlayerContents (full character data)
   - MapData (nearby tiles, players, NPCs)
7. Game loop: bidirectional MotionRequest/MotionEvent + ChatRequest/ChatMessage
8. On disconnect: server saves character state, removes from world
```

### 3.2 Message Envelope

Every WebSocket message is a binary frame containing:
```
byte 0:     message type ID (uint8)
bytes 1-N:  protobuf-encoded payload
```

**Message type IDs (client -> server):**
```
0x01 = LoginRequest
0x02 = CreateCharacterRequest
0x03 = EnterGameRequest
0x04 = MotionRequest
0x05 = ChatRequest
0x06 = DeleteCharacterRequest
0x10 = CommandRequest (generic action: equip, use item, etc.)
```

**Message type IDs (server -> client):**
```
0x81 = LoginResponse
0x82 = EnterGameResponse
0x83 = MotionEvent
0x84 = ChatMessage
0x85 = PlayerAppear
0x86 = PlayerDisappear
0x87 = NpcAppear
0x88 = NpcDisappear
0x89 = NpcMotion
0x8A = Notification
0x8B = PlayerContents
0x8C = MapChangeResponse
```

### 3.3 Movement Protocol Detail

**Client sends MotionRequest every movement tick:**
```protobuf
message MotionRequest {
  int32 direction = 1;   // 1=N, 2=NE, 3=E, 4=SE, 5=S, 6=SW, 7=W, 8=NW
  int32 action = 2;      // 0=stop, 1=walk, 2=run, 3=attack, 4=magic, 5=getitem
  Vec2 position = 3;     // client-reported tile position
  int32 target_id = 4;   // target object ID (for attack/magic)
  int32 spell_id = 5;    // spell ID (for magic action)
}
```

**Server validates:**
1. Check movement speed (anti-hack): walk=~490ms/tile, run=~350ms/tile
2. Check destination tile walkability via collision grid
3. Check distance moved (max 1 tile per tick for walk, 1 for run)
4. If valid: update player position, broadcast MotionEvent to nearby players
5. If invalid: send correction MotionEvent back to client with authoritative position

**Server broadcasts MotionEvent to all players within 20-tile radius:**
```protobuf
message MotionEvent {
  int32 object_id = 1;
  int32 owner_type = 2;   // 1=player, 2=npc
  int32 action = 3;       // same as MotionRequest.action
  int32 direction = 4;
  Vec2 position = 5;
  Vec2 destination = 6;   // for interpolation
  int32 speed = 7;        // ms per tile
  Appearance appearance = 8;
  string name = 9;
  int32 status = 10;      // alive, dead, invisible, etc.
}
```

**Direction deltas (from Map.cpp):**
```
Dir 1 (N):  dx=0,  dy=-1
Dir 2 (NE): dx=1,  dy=-1
Dir 3 (E):  dx=1,  dy=0
Dir 4 (SE): dx=1,  dy=1
Dir 5 (S):  dx=0,  dy=1
Dir 6 (SW): dx=-1, dy=1
Dir 7 (W):  dx=-1, dy=0
Dir 8 (NW): dx=-1, dy=-1
```

---

## 4. Server Implementation Detail

### 4.1 Game Engine (100ms tick)

```go
type Engine struct {
    maps       map[string]*GameMap    // loaded maps
    players    map[int32]*Player      // connected players by object ID
    npcs       map[int32]*NPC         // active NPCs by object ID
    msgQueue   chan IncomingMessage    // from WebSocket handlers
    ticker     *time.Ticker           // 100ms game loop
    nextObjID  int32                  // incrementing object ID counter
    db         *pgxpool.Pool
}

func (e *Engine) Run() {
    for {
        select {
        case <-e.ticker.C:
            e.processTick()
        case msg := <-e.msgQueue:
            e.handleMessage(msg)
        }
    }
}

func (e *Engine) processTick() {
    now := time.Now()
    // Phase 2: nothing beyond message processing
    // Phase 3+: NPC AI, regen timers, weather, day/night
}
```

### 4.2 Map Loading

```go
type GameMap struct {
    Name      string
    Width     int
    Height    int
    Tiles     [][]Tile          // [y][x]
    Sectors   [][]Sector        // spatial index (20x20 tile sectors)
    Teleports []TeleportLoc
    Spawns    []SpawnPoint      // player spawn points
    PKMode    int               // 0=all, 1=no-same-faction, 2=cross-faction, 3=none
    XPRate    int               // percentage (100 = normal)
}

type Tile struct {
    TileSprite      int16
    TileSpriteFrame int16
    ObjectSprite    int16
    ObjectSpriteFrame int16
    Walkable        bool
    Teleport        bool
    Farm            bool
    Water           bool
    // Runtime state:
    Owner           int32   // player/NPC object ID on this tile
    Items           []GroundItem  // items on ground
    DynamicObject   int16   // fire, chest, etc.
}

type TeleportLoc struct {
    SrcX, SrcY     int
    DestMap        string
    DestX, DestY   int
    Direction      int
}
```

Parse AMD: read 256-byte header, extract MAPSIZEX/Y, then read `width*height*10` bytes of tile data.

### 4.3 Sector-Based Spatial Indexing

Divide each map into 20x20 tile sectors. Each sector tracks which player/NPC object IDs are present.

```go
type Sector struct {
    Players map[int32]bool
    NPCs    map[int32]bool
}

// Get all entities near a position (check 3x3 sector grid around player)
func (m *GameMap) GetNearbyEntities(x, y int) (players []int32, npcs []int32)
```

When a player moves between sectors, compute diff of visible entities and send `PlayerAppear`/`PlayerDisappear` events.

### 4.4 Player State

```go
type Player struct {
    ObjectID    int32
    AccountID   int
    CharacterID int
    Name        string

    // Position
    MapName     string
    X, Y        int
    Direction   int       // 1-8
    Action      int       // current action

    // Appearance (sent to other players)
    Gender      int
    SkinColor   int
    HairStyle   int       // 0-12
    HairColor   int
    UnderwearColor int
    BodyArmor   int       // equipment sprite index
    ArmArmor    int
    Leggings    int
    Helm        int
    Weapon      int
    Shield      int
    Cape        int
    Boots       int
    ApprColor   int       // dye color

    // Stats (Phase 3+)
    Level       int
    Exp         int64
    HP, MaxHP   int
    MP, MaxMP   int
    SP, MaxSP   int
    STR, VIT, DEX, INT, MAG, CHR int
    LUPool      int       // unspent stat points
    Side        int       // 0=neutral, 1=aresden, 2=elvine

    // Anti-hack
    LastMoveTime time.Time
    MoveCount    int      // moves per second limiter

    // Connection
    Conn        *websocket.Conn
    SendChan    chan []byte
}
```

### 4.5 Authentication

**Registration:**
1. Client sends username (3-20 chars, alphanumeric) + password (6-30 chars)
2. Server validates uniqueness
3. Hash password with bcrypt (cost 12)
4. Insert into `accounts` table
5. Return success + empty character list

**Login:**
1. Client sends username + password
2. Server looks up account, verify bcrypt hash
3. Load character list (max 4 per account) from `characters` table
4. Return character summaries (name, level, gender, side, map)

**Character creation:**
1. Client sends: name (3-10 chars), gender (0/1), skin_color (0-2), hair_style (0-12), hair_color (0-7), underwear_color (0-7), stat allocation (STR/VIT/DEX/INT/MAG/CHR)
2. Server validates: name unique, total stat points = 70 (10 base * 6 stats + 10 bonus), each stat >= 10
3. Insert into `characters` table with default map="default", position from map spawn points
4. Return updated character list

---

## 5. Client Implementation Detail

### 5.1 Phaser Configuration

```typescript
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,           // WebGL with Canvas fallback
    width: 640,                  // original viewport width
    height: 480,                 // original viewport height
    pixelArt: true,              // disable anti-aliasing for sprites
    scale: {
        mode: Phaser.Scale.FIT,  // scale to fit browser window
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, LoginScene, CharSelectScene, CharCreateScene, GameScene],
};
```

### 5.2 Tile Rendering

The game uses a top-down tile system with 32x32 pixel tiles (NOT true isometric despite the visual style - the original uses orthogonal grid with isometric-looking sprites).

```typescript
class TileRenderer {
    private tilemap: Phaser.GameObjects.Container;
    private viewportWidth = 21;   // tiles visible horizontally
    private viewportHeight = 16;  // tiles visible vertically

    renderViewport(playerX: number, playerY: number, mapData: MapData) {
        // Clear previous tiles
        // Calculate visible tile range centered on player
        const startX = playerX - Math.floor(this.viewportWidth / 2);
        const startY = playerY - Math.floor(this.viewportHeight / 2);

        for (let dy = 0; dy < this.viewportHeight; dy++) {
            for (let dx = 0; dx < this.viewportWidth; dx++) {
                const tileX = startX + dx;
                const tileY = startY + dy;
                const tile = mapData.getTile(tileX, tileY);

                // Draw background tile sprite
                if (tile.tileSprite > 0) {
                    this.drawSprite(tile.tileSprite, tile.tileSpriteFrame,
                                   dx * 32, dy * 32);
                }
                // Draw object sprite (walls, trees, buildings) on top
                if (tile.objectSprite > 0) {
                    this.drawSprite(tile.objectSprite, tile.objectSpriteFrame,
                                   dx * 32, dy * 32);
                }
            }
        }
    }
}
```

### 5.3 Character Sprite Composition

Characters are rendered by layering multiple sprites. The drawing order varies by direction.

```typescript
class CharacterComposer {
    // Drawing order indexed by direction [dir] => 0=before body, 1=after body
    static DRAW_ORDER = [0, 1, 0, 0, 0, 0, 0, 1, 1]; // dir 0-8
    static MANTLE_ORDER = [0, 1, 1, 1, 0, 0, 0, 2, 2]; // cape special order

    // Sprite ID bases (from SpriteID.h)
    static SPRITE_BASES = {
        UNDIES_M: 1400, UNDIES_W: 11400,
        HAIR_M: 1600,   HAIR_W: 11600,    // +style*120 (13 styles, 120 frames each)
        ARMOR_M: 1800,  ARMOR_W: 11800,   // +type*120 (19 types)
        BERK_M: 2100,   BERK_W: 12100,    // +type*120 (13 types)
        LEGG_M: 2300,   LEGG_W: 12300,    // +type*120
        BOOT_M: 2500,   BOOT_W: 12500,    // +type*120
        MANTLE_M: 2600, MANTLE_W: 12600,  // +type*120
        HEAD_M: 2750,   HEAD_W: 12750,    // +type*120
        WEAPON_M: 3000, WEAPON_W: 13000,  // +type*120
        SHIELD_M: 6500, SHIELD_W: 16500,
        MOB: 17000,                        // +mobType*120
    };

    // Each sprite has 120 frames: 8 directions * 15 action frames
    // Frame index = (direction-1)*15 + actionFrame

    compose(appearance: Appearance, direction: number, action: number, frame: number): Phaser.GameObjects.Container {
        const layers: SpriteLayer[] = [];
        const isMale = appearance.gender === 0;
        const base = isMale ? 'M' : 'W';

        // 1. Body/underwear (always drawn first)
        layers.push({ spriteId: isMale ? 1400 : 11400, zIndex: 0 });

        // 2. Body armor (if equipped)
        if (appearance.bodyArmor > 0) {
            const armorBase = isMale ? 1800 : 11800;
            layers.push({ spriteId: armorBase + appearance.bodyArmor * 120, zIndex: 1 });
        }

        // 3. Leggings
        if (appearance.leggings > 0) {
            layers.push({ spriteId: (isMale ? 2300 : 12300) + appearance.leggings * 120, zIndex: 2 });
        }

        // 4. Boots
        if (appearance.boots > 0) {
            layers.push({ spriteId: (isMale ? 2500 : 12500) + appearance.boots * 120, zIndex: 3 });
        }

        // 5. Hair (always drawn, index = hairStyle * 120)
        layers.push({ spriteId: (isMale ? 1600 : 11600) + appearance.hairStyle * 120, zIndex: 4 });

        // 6. Helmet (replaces/overlays hair)
        if (appearance.helm > 0) {
            layers.push({ spriteId: (isMale ? 2750 : 12750) + appearance.helm * 120, zIndex: 5 });
        }

        // 7. Cape/mantle (draw order depends on direction)
        if (appearance.cape > 0) {
            const mantleOrder = CharacterComposer.MANTLE_ORDER[direction];
            layers.push({ spriteId: (isMale ? 2600 : 12600) + appearance.cape * 120,
                         zIndex: mantleOrder === 0 ? -1 : mantleOrder === 2 ? 10 : 6 });
        }

        // 8. Weapon
        if (appearance.weapon > 0) {
            const weaponOrder = CharacterComposer.DRAW_ORDER[direction];
            layers.push({ spriteId: (isMale ? 3000 : 13000) + appearance.weapon * 120,
                         zIndex: weaponOrder === 0 ? -2 : 7 });
        }

        // 9. Shield
        if (appearance.shield > 0) {
            layers.push({ spriteId: (isMale ? 6500 : 16500) + appearance.shield * 120, zIndex: 8 });
        }

        // Sort by zIndex and render
        layers.sort((a, b) => a.zIndex - b.zIndex);
        // Calculate frame: (direction-1) * framesPerAction + currentFrame
        const frameIndex = (direction - 1) * getFrameCount(action) + frame;
        return this.renderLayers(layers, frameIndex);
    }
}
```

### 5.4 Animation Timing

From the original `m_stFrame` table (MapData.cpp):

```typescript
const ANIMATION_FRAMES: Record<string, {frames: number, duration: number}> = {
    // Player animations (per direction)
    'player_stop':    { frames: 1, duration: 400 },   // idle: 1 keyframe, loop
    'player_walk':    { frames: 7, duration: 70 },    // 7 frames @ 70ms = 490ms total
    'player_run':     { frames: 7, duration: 50 },    // 7 frames @ 50ms = 350ms total
    'player_attack':  { frames: 7, duration: 78 },    // 7 frames @ 78ms = 546ms
    'player_magic':   { frames: 7, duration: 78 },
    'player_getitem': { frames: 3, duration: 100 },
    'player_damage':  { frames: 3, duration: 80 },
    'player_dying':   { frames: 7, duration: 120 },

    // Monster animations (examples)
    'slime_stop':     { frames: 3, duration: 240 },
    'slime_walk':     { frames: 7, duration: 120 },
    'slime_attack':   { frames: 7, duration: 100 },
    'skeleton_stop':  { frames: 3, duration: 150 },
    'skeleton_walk':  { frames: 7, duration: 90 },
    'skeleton_attack':{ frames: 7, duration: 90 },
};
```

### 5.5 Sound System

**Sound categories (from SoundID.h):**

| Prefix | Files | Purpose |
|--------|-------|---------|
| C*.WAV | C1-C24 (24 files) | Character sounds |
| E*.WAV | E1-E53 (53 files) | Effect/environmental sounds |
| M*.WAV | M1-M156 (156 files) | Monster/misc sounds |

**Key sound mappings:**
```typescript
const SOUND_MAP = {
    // Character sounds (C prefix)
    SHORT_SWORD_ATTACK: 'C1',
    LONG_SWORD_ATTACK: 'C2',
    BOW_AIM: 'C3',
    BOW_SHOOT: 'C4',
    AXE_ATTACK: 'C5',
    MALE_DAMAGE: 'C6',
    FEMALE_DAMAGE: 'C7',
    WALK_LAND: 'C8',
    WALK_GLASS: 'C9',
    RUN_LAND: 'C10',
    RUN_GLASS: 'C11',
    MALE_DYING: 'C12',
    FEMALE_DYING: 'C13',
    BAREHAND_HIT: 'C14',
    SWORD_HIT: 'C15',
    MACE_HIT: 'C16',
    ARROW_HIT: 'C17',

    // Effect sounds (E prefix)
    PROTECTION_SPELL: 'E1',
    ENERGY_BOLT: 'E2',
    MAGIC_MISSILE: 'E3',
    FIREBALL: 'E4',
    GOLD_DROP: 'E12',
    UI_CLICK: 'E14',
    HEAL_SPELL: 'E45',
    ICE_SPELL: 'E46',
    BLIZZARD: 'E47',
    WEATHER_LOOP: 'E38',
};
```

**Distance-based volume (from Game.cpp):**
```typescript
function calculateVolume(playerX: number, playerY: number, soundX: number, soundY: number): number {
    const dist = Math.max(Math.abs(playerX - soundX), Math.abs(playerY - soundY));
    if (dist > 10) return 0; // too far to hear
    return Math.max(0, 1.0 - (dist * 0.1)); // linear falloff
}
```

**Background music files:**
```typescript
const MUSIC_MAP: Record<string, string> = {
    'aresden': 'aresden.wav',
    'elvine': 'elvine.wav',
    'middleland': 'middleland.wav',
    'default': 'MainTm.wav',
    'dungeon': 'dungeon.wav',     // catacombs, dglv*, towerofh
    'city': 'druncncity.wav',
    'abaddon': 'abaddon.wav',
    // Carol*.wav for holiday events
};
```

---

## 6. Database Schema

```sql
CREATE TABLE accounts (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email         VARCHAR(255),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    last_login    TIMESTAMPTZ,
    is_banned     BOOLEAN DEFAULT FALSE
);

CREATE TABLE characters (
    id              SERIAL PRIMARY KEY,
    account_id      INT REFERENCES accounts(id) ON DELETE CASCADE,
    name            VARCHAR(10) UNIQUE NOT NULL,
    gender          SMALLINT NOT NULL DEFAULT 0,
    skin_color      SMALLINT DEFAULT 0,
    hair_style      SMALLINT DEFAULT 0,       -- 0-12
    hair_color      SMALLINT DEFAULT 0,       -- 0-7
    underwear_color SMALLINT DEFAULT 0,       -- 0-7
    side            SMALLINT DEFAULT 0,       -- 0=neutral, 1=aresden, 2=elvine
    level           INT DEFAULT 1,
    experience      BIGINT DEFAULT 0,
    str             INT DEFAULT 10,
    vit             INT DEFAULT 10,
    dex             INT DEFAULT 10,
    int_stat        INT DEFAULT 10,
    mag             INT DEFAULT 10,
    charisma        INT DEFAULT 10,
    lu_pool         INT DEFAULT 0,
    hp              INT DEFAULT 30,
    mp              INT DEFAULT 10,
    sp              INT DEFAULT 30,
    map_name        VARCHAR(30) DEFAULT 'default',
    pos_x           INT DEFAULT 0,
    pos_y           INT DEFAULT 0,
    direction       SMALLINT DEFAULT 5,
    admin_level     SMALLINT DEFAULT 0,
    pk_count        INT DEFAULT 0,
    ek_count        INT DEFAULT 0,
    reward_gold     INT DEFAULT 0,
    hunger          INT DEFAULT 100,
    gold            BIGINT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    last_played     TIMESTAMPTZ
);

-- Phase 3+
CREATE TABLE character_items (
    id              SERIAL PRIMARY KEY,
    character_id    INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    item_name       VARCHAR(30) NOT NULL,
    count           INT DEFAULT 1,
    cur_lifespan    INT DEFAULT 0,
    max_lifespan    INT DEFAULT 0,
    attribute       BIGINT DEFAULT 0,
    location        SMALLINT DEFAULT 0,   -- 0=inventory, 1=equipped, 2=bank, 3=ground
    slot_index      SMALLINT DEFAULT -1,
    equip_pos       SMALLINT DEFAULT 0,
    effect_type     SMALLINT DEFAULT 0,
    effect_value1   INT DEFAULT 0,
    effect_value2   INT DEFAULT 0
);

CREATE TABLE character_skills (
    character_id    INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    skill_id        SMALLINT NOT NULL,
    mastery         INT DEFAULT 0,
    ssn             INT DEFAULT 0,
    PRIMARY KEY (character_id, skill_id)
);

CREATE TABLE character_magic (
    character_id    INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    magic_id        SMALLINT NOT NULL,
    mastery         INT DEFAULT 0,
    PRIMARY KEY (character_id, magic_id)
);

CREATE TABLE guilds (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(20) UNIQUE NOT NULL,
    side            SMALLINT NOT NULL,
    master_char_id  INT REFERENCES characters(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guild_members (
    guild_id        INT NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
    character_id    INT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    rank            SMALLINT DEFAULT 1,
    PRIMARY KEY (guild_id, character_id)
);
```

---

## 7. Implementation Phases

### Phase 1: Foundation
1. Build `pakextract` tool in Go - parse PAK/APK binary files, output PNG + atlas JSON
2. Build `amdconvert` tool in Go - parse AMD binary files, output JSON with collision grids
3. Set up Go project with WebSocket server (gorilla/websocket)
4. Set up Phaser 3 + TypeScript project with Vite bundler
5. Define Protobuf schemas, generate Go + TypeScript code
6. Create PostgreSQL migrations, set up connection pool

### Phase 2: MVP (Movement + Chat + NPCs)
1. Account registration + login (bcrypt, JWT session)
2. Character creation with appearance selection
3. Character select screen (show up to 4 characters)
4. Load AMD map data on server, send tile data to client
5. Render tile map in Phaser (background + objects)
6. Player movement: client-side prediction + server validation + collision
7. Camera follows player with smooth scrolling
8. Other players appear/disappear/move in real-time
9. Character sprite composition (layered equipment rendering)
10. Chat system (normal + shout, bubble above character head)
11. Static NPCs visible on map (shopkeepers, guards, quest givers)
12. Map transitions via teleport tiles
13. Save/load character position on login/logout
14. Walking/running sound effects
15. Background music per map

### Phase 3: Combat & Items
1. Melee combat with hit/miss roll (1d100 vs HitRatio-DefenseRatio)
2. Damage calculation (dice + STR scaling + armor reduction, capped at 80%)
3. Critical hits (Level% bonus damage)
4. Combo system (0-4 consecutive hits)
5. NPC AI state machine (stop, move, attack, flee, dead)
6. NPC pathfinding (A* on collision grid)
7. NPC aggro system (detection range, target selection)
8. HP/MP/SP bars and regeneration (HP:15s, MP:20s, SP:10s)
9. Death and respawn (return to home city spawn)
10. Experience gain from NPC kills (with level scaling)
11. Level up: +3 stat points, stat allocation UI
12. Item drop system (NPC loot tables)
13. Ground items (render on map, pick up on walk-over or click)
14. Inventory UI (50 slots, drag and drop)
15. Equipment system (13 slots, changes character appearance)
16. Item durability (cur/max lifespan, degrades on use)
17. Shops: NPC shop UI, buy/sell with gold
18. Potions (HP/MP/SP recovery, instant use)
19. Combat sound effects (weapon hit, damage, death)
20. Combat visual effects (hit flash, death animation)

### Phase 4: Skills & Magic
1. Skill system: 24 skills with mastery levels (0-100)
2. Skill learning: buy manual from shop, use to learn
3. Skill advancement: mastery increases through use
4. Skill cap: total 700 mastery across all skills
5. Mining: click mineral spots with PickAxe equipped, roll skill check, get ore
6. Fishing: click fish spots with FishingRod, roll skill check, get fish
7. Farming: use Hoe on farm tiles, plant seeds, wait for growth, harvest
8. Crafting/Alchemy: combine materials at anvil/bowl, skill check, produce item
9. 102 crafting recipes (see data/crafting.json for full list)
10. Magic system: 98 spells with INT requirements and mana costs
11. Spell casting: select spell, target location/entity, animation + effect
12. Spell categories: damage (spot/area/linear), heal, buff, debuff, summon, teleport
13. Area of effect: calculate tiles in radius, apply damage/effect to entities
14. Spell visual effects (from effect PAK files)
15. Buff/debuff system: timed status effects (protection, poison, berserk, etc.)
16. Potion crafting and use
17. Ranged combat: bows with arrow ammunition, distance damage falloff
18. Taming: attempt to tame wild monsters

### Phase 5: Social & PvP
1. Faction selection at Cityhall NPC (level 10+, irreversible)
2. Faction effects: home city, respawn point, hero equipment access
3. Guild creation: CHR >= 20, Level >= 20, name selection
4. Guild management: invite/kick members, ranks, guild chat
5. Party system: invite up to 8 players, shared XP (with proximity bonus)
6. Whisper chat (private messages by character name)
7. Guild chat channel
8. PvP: hit other players based on map PK mode
9. PK/EK tracking and criminal status
10. Death penalties: XP loss (% of level), random item drop chance
11. 7-second protection after PvP death
12. Safe zones: no-attack rectangles within maps
13. Trade between players: request, offer items, confirm

### Phase 6: Endgame & Events
1. Quest system: monster hunt, delivery, assassination, escort
2. Quest rewards: XP, gold, items, contribution points
3. Crusade war: faction-wide PvP event with roles (soldier/constructor/commander)
4. Crusade buildings: guard towers, mana collectors, detectors, magic generators
5. Crusade victory: destroy all enemy principal buildings
6. Arena/Bleeding Isle: organized PvP with ticket entry
7. Day/night cycle: server-wide, affects spawns and weapon bonuses
8. Weather system: snow/rain visual effects
9. Summoned creatures: summon spells create temporary NPC allies (5-10 min)
10. Boss monsters: special NPCs with unique abilities
11. Special events: Heldenian tower defense, Apocalypse mode
12. Post-max-level progression: Gizon points for extra stat upgrades

---

## 8. Verification Plan

### Phase 1
- Run pakextract on all 446 PAK/APK files -> verify PNG output with correct transparency
- Run amdconvert on all 83 AMD files -> verify JSON output, spot-check walkability against screenshots
- Start Go server -> verify WebSocket accepts connections
- Load Phaser client -> verify sprite sheet loads and single frame renders correctly

### Phase 2 (MVP)
- Register account via web form -> verify bcrypt hash in PostgreSQL
- Create 4 characters with different appearances -> verify all saved correctly
- Enter game -> verify map renders with correct tiles from AMD data
- Walk around Aresden city -> verify collision blocks at buildings/walls/water
- Walk to edge of map -> verify teleport to connected map works
- Open second browser -> verify both players see each other and movement syncs
- Type chat -> verify bubble appears above character head for other player
- Walk near NPC -> verify NPC sprite renders at correct position
- Disconnect -> reconnect -> verify character at same position
- Verify walking sound plays on each step, music plays per map
