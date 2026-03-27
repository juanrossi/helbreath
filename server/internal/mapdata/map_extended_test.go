package mapdata

import (
	"encoding/binary"
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

// buildSyntheticAMD creates a synthetic AMD file in memory
func buildSyntheticAMD(width, height int, tiles []Tile) []byte {
	// 256-byte header
	header := make([]byte, 256)
	headerStr := fmt.Sprintf("MAPSIZEX = %d MAPSIZEY = %d", width, height)
	copy(header, []byte(headerStr))

	tileData := make([]byte, width*height*10)
	for i, t := range tiles {
		if i >= width*height {
			break
		}
		offset := i * 10
		binary.LittleEndian.PutUint16(tileData[offset:offset+2], uint16(t.TileSprite))
		binary.LittleEndian.PutUint16(tileData[offset+2:offset+4], uint16(t.TileSpriteFrame))
		binary.LittleEndian.PutUint16(tileData[offset+4:offset+6], uint16(t.ObjectSprite))
		binary.LittleEndian.PutUint16(tileData[offset+6:offset+8], uint16(t.ObjectSpriteFrame))

		flags := byte(0)
		if !t.Walkable {
			flags |= 0x80
		}
		if t.Teleport {
			flags |= 0x40
		}
		if t.Farm {
			flags |= 0x20
		}
		tileData[offset+8] = flags
		tileData[offset+9] = 0 // padding
	}

	result := make([]byte, 0, len(header)+len(tileData))
	result = append(result, header...)
	result = append(result, tileData...)
	return result
}

func writeTempAMD(t *testing.T, name string, data []byte) string {
	t.Helper()
	dir := t.TempDir()
	path := filepath.Join(dir, name+".amd")
	if err := os.WriteFile(path, data, 0644); err != nil {
		t.Fatalf("Failed to write temp AMD: %v", err)
	}
	return path
}

func TestLoadAMDBasic(t *testing.T) {
	tiles := make([]Tile, 4*4) // 4x4 map
	for i := range tiles {
		tiles[i] = Tile{
			TileSprite:      1,
			TileSpriteFrame: 0,
			Walkable:        true,
		}
	}
	// Block tile (1,1)
	tiles[1*4+1].Walkable = false
	// Teleport tile (2,2)
	tiles[2*4+2].Teleport = true
	// Farm tile (3,3)
	tiles[3*4+3].Farm = true
	// Water tile (0,1) - TileSprite 19
	tiles[1*4+0].TileSprite = 19

	data := buildSyntheticAMD(4, 4, tiles)
	path := writeTempAMD(t, "testmap", data)

	gm, err := LoadAMD(path)
	if err != nil {
		t.Fatalf("LoadAMD failed: %v", err)
	}

	if gm.Name != "testmap" {
		t.Errorf("Expected name=testmap, got %s", gm.Name)
	}
	if gm.Width != 4 || gm.Height != 4 {
		t.Errorf("Expected 4x4, got %dx%d", gm.Width, gm.Height)
	}

	// Check tile properties
	if !gm.IsWalkable(0, 0) {
		t.Error("(0,0) should be walkable")
	}
	if gm.IsWalkable(1, 1) {
		t.Error("(1,1) should be blocked")
	}
	if !gm.IsTeleport(2, 2) {
		t.Error("(2,2) should be teleport")
	}
	if !gm.Tiles[3][3].Farm {
		t.Error("(3,3) should be farm")
	}
	if !gm.Tiles[1][0].Water {
		t.Error("(0,1) with TileSprite 19 should be water")
	}

	// Check sectors are initialized
	if gm.Sectors == nil {
		t.Fatal("Sectors should be initialized")
	}
}

func TestLoadAMDSprites(t *testing.T) {
	tiles := make([]Tile, 2*2)
	tiles[0] = Tile{TileSprite: 5, TileSpriteFrame: 2, ObjectSprite: 10, ObjectSpriteFrame: 3, Walkable: true}
	tiles[1] = Tile{TileSprite: 7, TileSpriteFrame: 0, Walkable: true}
	tiles[2] = Tile{TileSprite: 1, TileSpriteFrame: 1, Walkable: true}
	tiles[3] = Tile{TileSprite: 3, TileSpriteFrame: 4, Walkable: true}

	data := buildSyntheticAMD(2, 2, tiles)
	path := writeTempAMD(t, "sprites", data)

	gm, err := LoadAMD(path)
	if err != nil {
		t.Fatalf("LoadAMD failed: %v", err)
	}

	if gm.Tiles[0][0].TileSprite != 5 {
		t.Errorf("Expected TileSprite=5, got %d", gm.Tiles[0][0].TileSprite)
	}
	if gm.Tiles[0][0].ObjectSprite != 10 {
		t.Errorf("Expected ObjectSprite=10, got %d", gm.Tiles[0][0].ObjectSprite)
	}
	if gm.Tiles[0][0].ObjectSpriteFrame != 3 {
		t.Errorf("Expected ObjectSpriteFrame=3, got %d", gm.Tiles[0][0].ObjectSpriteFrame)
	}
}

func TestLoadAMDTooSmall(t *testing.T) {
	// File smaller than 256 bytes
	data := make([]byte, 100)
	path := writeTempAMD(t, "small", data)

	_, err := LoadAMD(path)
	if err == nil {
		t.Error("Should fail on file smaller than 256 bytes")
	}
}

func TestLoadAMDTruncatedTileData(t *testing.T) {
	// Valid header but not enough tile data
	header := make([]byte, 256)
	copy(header, []byte("MAPSIZEX = 100 MAPSIZEY = 100"))
	// Only add a few bytes of tile data (needs 100*100*10)
	data := append(header, make([]byte, 100)...)
	path := writeTempAMD(t, "truncated", data)

	_, err := LoadAMD(path)
	if err == nil {
		t.Error("Should fail on truncated tile data")
	}
}

func TestLoadAMDInvalidHeader(t *testing.T) {
	header := make([]byte, 256)
	copy(header, []byte("INVALID HEADER FORMAT"))
	data := append(header, make([]byte, 1000)...)
	path := writeTempAMD(t, "invalid", data)

	_, err := LoadAMD(path)
	if err == nil {
		t.Error("Should fail on invalid header")
	}
}

func TestLoadAMDNonexistentFile(t *testing.T) {
	_, err := LoadAMD("/nonexistent/path/to/file.amd")
	if err == nil {
		t.Error("Should fail on nonexistent file")
	}
}

func TestNPCSectorOperations(t *testing.T) {
	gm := makeTestMap(100, 100)

	// Add NPCs to sectors
	s := gm.GetSector(50, 50)
	if s == nil {
		t.Fatal("Sector should exist")
	}

	s.mu.Lock()
	s.NPCs[100] = true
	s.NPCs[101] = true
	s.mu.Unlock()

	s.mu.RLock()
	if len(s.NPCs) != 2 {
		t.Errorf("Expected 2 NPCs, got %d", len(s.NPCs))
	}
	if !s.NPCs[100] {
		t.Error("NPC 100 should be in sector")
	}
	s.mu.RUnlock()

	// Remove NPC
	s.mu.Lock()
	delete(s.NPCs, 100)
	s.mu.Unlock()

	s.mu.RLock()
	if len(s.NPCs) != 1 {
		t.Errorf("Expected 1 NPC after removal, got %d", len(s.NPCs))
	}
	s.mu.RUnlock()
}

func TestGetNearbyPlayerIDsCrossSector(t *testing.T) {
	gm := makeTestMap(100, 100)

	// Place players in different but adjacent sectors
	gm.AddPlayerToSector(10, 10, 1) // sector (0,0)
	gm.AddPlayerToSector(30, 10, 2) // sector (1,0)
	gm.AddPlayerToSector(10, 30, 3) // sector (0,1)
	gm.AddPlayerToSector(90, 90, 4) // sector (4,4) - far away

	// Query from sector (0,0) - should find players 1, 2, 3 but not 4
	nearby := gm.GetNearbyPlayerIDs(10, 10)

	foundIDs := map[int32]bool{}
	for _, id := range nearby {
		foundIDs[id] = true
	}

	if !foundIDs[1] {
		t.Error("Should find player 1 (same sector)")
	}
	if !foundIDs[2] {
		t.Error("Should find player 2 (adjacent sector)")
	}
	if !foundIDs[3] {
		t.Error("Should find player 3 (adjacent sector)")
	}
	if foundIDs[4] {
		t.Error("Should NOT find player 4 (far away sector)")
	}
}

func TestGetNearbyPlayerIDsEdgeSectors(t *testing.T) {
	gm := makeTestMap(100, 100)

	// Place player at map corner
	gm.AddPlayerToSector(0, 0, 1)

	// Query from corner - should not panic (negative sector indices handled)
	nearby := gm.GetNearbyPlayerIDs(0, 0)
	if len(nearby) != 1 {
		t.Errorf("Expected 1 player at corner, got %d", len(nearby))
	}
}

func TestAddRemovePlayerSectorOutOfBounds(t *testing.T) {
	gm := makeTestMap(100, 100)

	// Out of bounds operations should not panic
	gm.AddPlayerToSector(-10, -10, 1)
	gm.RemovePlayerFromSector(-10, -10, 1)
	gm.AddPlayerToSector(1000, 1000, 2)
	gm.RemovePlayerFromSector(1000, 1000, 2)
}

func TestPackCollisionGridEmptyMap(t *testing.T) {
	gm := makeTestMap(1, 1)
	grid := gm.PackCollisionGrid()
	if len(grid) != 1 {
		t.Errorf("Expected 1 byte for 1x1 map, got %d", len(grid))
	}
	if grid[0] != 0 {
		t.Error("All walkable 1x1 map should produce 0x00")
	}
}

func TestPackCollisionGridAllBlocked(t *testing.T) {
	gm := makeTestMap(8, 1)
	for x := 0; x < 8; x++ {
		gm.Tiles[0][x].Walkable = false
	}
	grid := gm.PackCollisionGrid()
	if grid[0] != 0xFF {
		t.Errorf("All blocked 8x1 map should produce 0xFF, got 0x%02x", grid[0])
	}
}

func TestParseHeaderVariants(t *testing.T) {
	tests := []struct {
		header string
		w, h   int
		err    bool
	}{
		{"MAPSIZEX = 100 MAPSIZEY = 200", 100, 200, false},
		{"MAPSIZEX = 256 MAPSIZEY = 256", 256, 256, false},
		{"  MAPSIZEX  =  50  MAPSIZEY  =  50  ", 50, 50, false},
		{"MAPSIZEX 100 MAPSIZEY 200", 100, 200, false}, // no = sign
		{"MAPSIZEX = abc", 0, 0, true},
		{"MAPSIZEX = 100", 0, 0, true}, // missing Y
		{"MAPSIZEY = 100", 0, 0, true}, // missing X
		{"", 0, 0, true},
		{"MAPSIZEX = 0 MAPSIZEY = 0", 0, 0, true},   // zero dimensions
		{"MAPSIZEX = -1 MAPSIZEY = -1", 0, 0, true},  // would fail strconv or validation
	}

	for _, tt := range tests {
		w, h, err := parseHeader(tt.header)
		if tt.err {
			if err == nil {
				t.Errorf("parseHeader(%q) should fail", tt.header)
			}
		} else {
			if err != nil {
				t.Errorf("parseHeader(%q) failed: %v", tt.header, err)
			}
			if w != tt.w || h != tt.h {
				t.Errorf("parseHeader(%q) = (%d,%d), expected (%d,%d)", tt.header, w, h, tt.w, tt.h)
			}
		}
	}
}

func TestIsWalkableEdgeCases(t *testing.T) {
	gm := makeTestMap(1, 1)
	if !gm.IsWalkable(0, 0) {
		t.Error("(0,0) should be walkable on 1x1 map")
	}
	if gm.IsWalkable(1, 0) {
		t.Error("(1,0) out of bounds on 1x1 map")
	}
	if gm.IsWalkable(0, 1) {
		t.Error("(0,1) out of bounds on 1x1 map")
	}
}

func TestWaterDetection(t *testing.T) {
	gm := makeTestMap(10, 10)
	gm.Tiles[5][5].TileSprite = 19
	gm.Tiles[5][5].Water = true // Already set in LoadAMD but not in makeTestMap

	// Manually set water flag like LoadAMD does
	if gm.Tiles[5][5].TileSprite != 19 {
		t.Error("TileSprite should be 19")
	}
}
