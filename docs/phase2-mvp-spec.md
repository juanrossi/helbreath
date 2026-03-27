# Phase 2: MVP Specification (Movement + Chat + NPCs)

## Overview
The MVP delivers: account registration/login, character creation/selection, map rendering with collision, player movement with server validation, other players visible in real-time, chat system, and static NPCs.

---

## 2.1 Account Registration & Login

### Registration Flow
1. Client sends `LoginRequest` with `register=true`, username (3-20 alphanumeric), password (6-30 chars)
2. Server validates username uniqueness against `accounts` table
3. Password hashed with bcrypt cost 12
4. Insert into `accounts`, return `LoginResponse` with empty character list
5. On duplicate username: return error "Username already taken"

### Login Flow
1. Client sends `LoginRequest` with `register=false`
2. Server looks up `accounts` by username where `is_banned=FALSE`
3. Verify bcrypt hash
4. Update `last_login` timestamp
5. Load character list (max 4) from `characters` table
6. Return `LoginResponse` with `CharacterSummary[]` (id, name, level, gender, side, map, appearance)

### Session Management
- No JWT for MVP; session is tied to WebSocket connection lifetime
- `client.AccountID` set on successful login, used for all subsequent requests
- Disconnect = session end, character state saved

---

## 2.2 Character Creation

### Input Validation
| Field | Type | Range | Notes |
|-------|------|-------|-------|
| name | string | 3-10 chars | Alphanumeric, unique across all accounts |
| gender | int | 0-1 | 0=male, 1=female |
| skin_color | int | 0-2 | Light, Medium, Dark |
| hair_style | int | 0-12 | 13 styles per gender |
| hair_color | int | 0-7 | 8 colors |
| underwear_color | int | 0-7 | 8 colors |
| STR, VIT, DEX, INT, MAG, CHR | int | each >= 10 | Total must equal 70 |

### Default Character State
- Level 1, Experience 0
- HP = 30, MP = 10, SP = 30
- Map = "default", position from map spawn point
- Direction = 5 (South)
- Side = 0 (Neutral)
- Gold = 0, Hunger = 100
- Max 4 characters per account

### Max Stat Formulas
```
MaxHP = 30 + (Level-1)*3 + VIT*2
MaxMP = 10 + (Level-1)*2 + MAG*2
MaxSP = 30 + Level*2
```

---

## 2.3 Character Selection Screen
- Display up to 4 character slots showing: name, level, faction, appearance preview
- Click character to enter game (sends `EnterGameRequest`)
- Empty slots show "Create New Character" button
- Delete character with confirmation (sends `DeleteCharacterRequest`)

---

## 2.4 Entering the Game World

### Server-Side Enter Flow
1. Load character from DB by `character_id` + `account_id`
2. Assign unique `ObjectID` (incrementing counter starting at 1000)
3. Load map by `character.map_name`, fallback to "default"
4. If saved position not walkable, spiral-search for nearest walkable tile (up to radius 50)
5. Set tile owner, add player to sector
6. Send `EnterGameResponse`:
   - `PlayerContents` (full character data)
   - `MapInfo` (name, width, height, packed collision bitfield)
   - `nearby_players[]` (EntityInfo for all players in 3x3 sector grid)
   - `nearby_npcs[]` (EntityInfo for static NPCs)
7. Broadcast `PlayerAppear` to all nearby players

### Client-Side Enter Flow
1. Parse collision grid bitfield (1 bit per tile, 1=blocked)
2. Create local player sprite at center of viewport
3. Create remote player sprites from `nearby_players`
4. Render initial viewport tiles
5. Enable keyboard input

---

## 2.5 Map Rendering

### Tile System
- Top-down orthogonal grid, 32x32 pixel tiles
- Viewport: 21 tiles wide x 16 tiles tall (672x512 pixels, scaled to 640x480)
- Camera always centered on local player
- Two layers per tile: background (tileSprite) + object (objectSprite)

### Collision Grid
- Packed bitfield from server: bit index = `y * mapWidth + x`
- Bit set = blocked (buildings, walls, water, trees)
- Client checks locally before sending movement; server validates authoritatively

### For MVP
- Render walkable tiles as green rectangles, blocked as dark brown
- Grid lines for visual clarity
- Sprite-based rendering deferred to Phase 2.5 (after asset pipeline integration)

---

## 2.6 Player Movement

### Client-Side
1. Read arrow key input every frame
2. Calculate 8-directional input: N(1), NE(2), E(3), SE(4), S(5), SW(6), W(7), NW(8)
3. Rate-limit: only send move every 490ms (walk) or 350ms (run)
4. Check destination tile walkable in local collision grid
5. If walkable: update local position immediately (client-side prediction)
6. Send `MotionRequest` with direction, action (1=walk), and client position

### Direction Deltas
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

### Server-Side Validation
1. Verify direction 1-8
2. **Anti-speed-hack**: Check `time.Since(lastMoveTime) >= minInterval`
   - Walk: 400ms minimum (slightly relaxed from 490ms to account for latency)
   - Run: 350ms minimum
3. Calculate destination: `newX = x + dirDX[dir]`, `newY = y + dirDY[dir]`
4. Check `map.IsWalkable(newX, newY)` - must be walkable AND unoccupied
5. If invalid: send correction `MotionEvent` (action=0, authoritative position)
6. If valid:
   - Clear old tile owner, set new tile owner
   - Update player position, direction, lastMoveTime
   - If sector changed: update sector membership
   - Broadcast `MotionEvent` to all nearby players (3x3 sector grid, exclude self)

### MotionEvent Broadcast
```protobuf
MotionEvent {
  object_id, owner_type=1(player), action=1(walk),
  direction, position(newX,newY), speed=490(walk)/350(run), name
}
```

---

## 2.7 Other Players Visible

### Appear/Disappear System
- When player enters another player's 3x3 sector range: send `PlayerAppear`
- When player leaves range: send `PlayerDisappear`
- `PlayerAppear` includes: objectId, name, position, direction, appearance, level, side, pkCount

### Client Rendering
- Remote players rendered as colored rectangles (red) with name text above
- Position updated on each `MotionEvent` received
- Smooth interpolation deferred to sprite phase

### Sector Boundary Crossing
When a player moves between sectors:
1. Compute old sector `(oldX/20, oldY/20)` and new sector `(newX/20, newY/20)`
2. If different: remove from old sector, add to new sector
3. Diff the 3x3 grids around old and new positions
4. Send `PlayerAppear` for newly-visible players (both directions)
5. Send `PlayerDisappear` for no-longer-visible players (both directions)

---

## 2.8 Chat System

### Chat Types
| Type | Prefix | Range | Color |
|------|--------|-------|-------|
| 0 - Normal | (none) | Nearby (3x3 sectors) | White |
| 1 - Shout | `!` | Entire map | Gold |
| 2 - Whisper | `@name` | Direct to player | Purple |

### Client -> Server
`ChatRequest { type, message (max 200 chars), target (for whisper) }`

### Server Processing
- Normal (type 0): broadcast to nearby players via `broadcastToNearby()`
- Shout (type 1): broadcast to all players on same map via `broadcastToMap()`
- Whisper (type 2): find player by name, send directly

### Client Display
- Chat log panel (bottom-left, 300x100px, scrollable)
- Chat input field with Enter to send
- Chat bubbles above character heads (5-second expiry)
- Keyboard input disabled while chat input focused

---

## 2.9 Static NPCs

### MVP NPCs
- Shopkeeper NPCs placed at fixed positions on town maps
- Guard NPCs at city gates
- No AI behavior, no interaction beyond visibility

### NPC Data
```protobuf
NpcAppear {
  object_id, name, npc_type, position, direction=5, action=0, status=0
}
```

### NPC Placement
- Loaded from server-side NPC config file
- Positioned at configured map coordinates
- Client renders as distinct colored rectangle (yellow) with name

---

## 2.10 Map Transitions (Teleport Tiles)

### Teleport Detection
1. After valid movement, check `map.IsTeleport(newX, newY)`
2. Look up teleport destination from teleport config table
3. Config maps source tile -> destination map + coordinates

### Teleport Execution
1. Remove player from current map (clear owner, remove from sector, broadcast `PlayerDisappear`)
2. Load destination map
3. Find walkable position near destination coordinates
4. Add player to new map (set owner, add to sector)
5. Send `MapChangeResponse` to client with new map name, position, direction
6. Send full map data (collision grid) for new map
7. Send `PlayerAppear` to nearby players on new map
8. Client clears old state, re-renders new map viewport

### Teleport Config Format
```
Source: mapName, tileX, tileY
Dest:   mapName, tileX, tileY, direction
```
Loaded from server-side config files (separate from AMD tile data).

---

## 2.11 Character Position Persistence

### Save Triggers
- Player disconnect (WebSocket close)
- Server shutdown (graceful)
- Map transition (save before moving)

### Save Data
`UPDATE characters SET map_name=$2, pos_x=$3, pos_y=$4, direction=$5, last_played=NOW() WHERE id=$1`

### Load on Login
- Character's saved `map_name`, `pos_x`, `pos_y`, `direction` loaded from DB
- If saved map not loaded on server: fallback to "default" map
- If saved position not walkable: spiral search for nearest walkable tile

---

## 2.12 Sound (MVP Placeholder)

### Walking Sound
- Play walking sound effect on each movement tick
- `C8.WAV` for land, `C9.WAV` for glass/stone surface
- `C10.WAV` for running on land, `C11.WAV` for running on glass

### Background Music
- One music file per map loaded from music config
- Key mappings: aresden.wav, elvine.wav, middleland.wav, MainTm.wav (default)
- Loop continuously while on map, crossfade on map change

### Distance-Based Volume
```typescript
function calculateVolume(playerX, playerY, soundX, soundY): number {
  const dist = Math.max(Math.abs(playerX - soundX), Math.abs(playerY - soundY));
  if (dist > 10) return 0;
  return Math.max(0, 1.0 - (dist * 0.1));
}
```

---

## 2.13 Verification Checklist

- [ ] Register account via web form -> bcrypt hash in PostgreSQL
- [ ] Login with wrong password -> error message
- [ ] Create 4 characters with different appearances -> all saved correctly
- [ ] 5th character creation rejected
- [ ] Enter game -> map renders with correct collision
- [ ] Walk around Aresden -> collision blocks at buildings/walls/water
- [ ] Walk to map edge -> teleport to connected map
- [ ] Open second browser -> both players see each other
- [ ] Move in one browser -> movement appears in other
- [ ] Type chat -> bubble appears for other player
- [ ] Shout chat -> visible to all players on map
- [ ] Whisper -> only target player receives
- [ ] NPCs visible at correct positions
- [ ] Disconnect -> reconnect -> character at same position
- [ ] Server shutdown -> all positions saved
- [ ] Anti-speed-hack: rapid movement corrected by server
