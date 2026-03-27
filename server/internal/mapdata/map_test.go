package mapdata

import (
	"testing"
)

func makeTestMap(w, h int) *GameMap {
	gm := &GameMap{
		Name:   "test",
		Width:  w,
		Height: h,
		Tiles:  make([][]Tile, h),
	}
	for y := 0; y < h; y++ {
		gm.Tiles[y] = make([]Tile, w)
		for x := 0; x < w; x++ {
			gm.Tiles[y][x] = Tile{Walkable: true}
		}
	}
	// Initialize sectors
	sectorsX := (w + SectorSize - 1) / SectorSize
	sectorsY := (h + SectorSize - 1) / SectorSize
	gm.Sectors = make([][]Sector, sectorsY)
	for sy := 0; sy < sectorsY; sy++ {
		gm.Sectors[sy] = make([]Sector, sectorsX)
		for sx := 0; sx < sectorsX; sx++ {
			gm.Sectors[sy][sx] = Sector{
				Players: make(map[int32]bool),
				NPCs:    make(map[int32]bool),
			}
		}
	}
	return gm
}

func TestIsWalkable(t *testing.T) {
	gm := makeTestMap(100, 100)

	if !gm.IsWalkable(50, 50) {
		t.Error("Empty tile should be walkable")
	}

	// Out of bounds
	if gm.IsWalkable(-1, 0) {
		t.Error("Negative x should not be walkable")
	}
	if gm.IsWalkable(0, -1) {
		t.Error("Negative y should not be walkable")
	}
	if gm.IsWalkable(100, 50) {
		t.Error("x=width should not be walkable")
	}
	if gm.IsWalkable(50, 100) {
		t.Error("y=height should not be walkable")
	}

	// Blocked tile
	gm.Tiles[10][10].Walkable = false
	if gm.IsWalkable(10, 10) {
		t.Error("Blocked tile should not be walkable")
	}

	// Owned tile
	gm.Tiles[20][20].Owner = 42
	if gm.IsWalkable(20, 20) {
		t.Error("Owned tile should not be walkable")
	}
}

func TestIsTeleport(t *testing.T) {
	gm := makeTestMap(100, 100)

	if gm.IsTeleport(50, 50) {
		t.Error("Non-teleport tile should return false")
	}

	gm.Tiles[10][10].Teleport = true
	if !gm.IsTeleport(10, 10) {
		t.Error("Teleport tile should return true")
	}

	// Out of bounds
	if gm.IsTeleport(-1, -1) {
		t.Error("Out of bounds should return false")
	}
}

func TestSetOwnerClearOwner(t *testing.T) {
	gm := makeTestMap(100, 100)

	gm.SetOwner(10, 10, 42)
	if gm.Tiles[10][10].Owner != 42 {
		t.Errorf("Expected owner=42, got %d", gm.Tiles[10][10].Owner)
	}

	gm.ClearOwner(10, 10)
	if gm.Tiles[10][10].Owner != 0 {
		t.Errorf("Expected owner=0 after clear, got %d", gm.Tiles[10][10].Owner)
	}

	// Out of bounds should not panic
	gm.SetOwner(-1, -1, 99)
	gm.ClearOwner(-1, -1)
}

func TestSectorOperations(t *testing.T) {
	gm := makeTestMap(100, 100)

	// Add player to sector
	gm.AddPlayerToSector(50, 50, 1)
	gm.AddPlayerToSector(55, 55, 2)

	nearby := gm.GetNearbyPlayerIDs(50, 50)
	if len(nearby) < 1 {
		t.Error("Should find at least 1 nearby player")
	}

	found1, found2 := false, false
	for _, id := range nearby {
		if id == 1 {
			found1 = true
		}
		if id == 2 {
			found2 = true
		}
	}
	if !found1 {
		t.Error("Should find player 1")
	}
	if !found2 {
		t.Error("Should find player 2 (same sector)")
	}

	// Remove player
	gm.RemovePlayerFromSector(50, 50, 1)
	nearby = gm.GetNearbyPlayerIDs(50, 50)
	for _, id := range nearby {
		if id == 1 {
			t.Error("Player 1 should have been removed")
		}
	}
}

func TestPackCollisionGrid(t *testing.T) {
	gm := makeTestMap(8, 1)
	// Block tile (3,0)
	gm.Tiles[0][3].Walkable = false

	grid := gm.PackCollisionGrid()
	if len(grid) != 1 {
		t.Fatalf("Expected 1 byte for 8x1 map, got %d", len(grid))
	}

	// Bit 3 should be set
	if grid[0]&(1<<3) == 0 {
		t.Error("Bit 3 should be set for blocked tile at (3,0)")
	}
	// Other bits should be 0
	if grid[0]&(1<<0) != 0 {
		t.Error("Bit 0 should not be set")
	}
}

func TestPackCollisionGridLarger(t *testing.T) {
	gm := makeTestMap(16, 16)
	// Block some tiles
	gm.Tiles[0][0].Walkable = false
	gm.Tiles[1][5].Walkable = false

	grid := gm.PackCollisionGrid()
	expectedBytes := (16 * 16 + 7) / 8
	if len(grid) != expectedBytes {
		t.Fatalf("Expected %d bytes, got %d", expectedBytes, len(grid))
	}

	// Check (0,0) is blocked - bit 0 of byte 0
	if grid[0]&1 == 0 {
		t.Error("(0,0) should be blocked")
	}

	// Check (5,1) is blocked - index = 1*16+5 = 21, byte 2, bit 5
	idx := 1*16 + 5
	byteIdx := idx / 8
	bitIdx := idx % 8
	if grid[byteIdx]&(1<<bitIdx) == 0 {
		t.Errorf("(5,1) should be blocked at byte %d bit %d", byteIdx, bitIdx)
	}
}

func TestParseHeader(t *testing.T) {
	w, h, err := parseHeader("MAPSIZEX = 100 MAPSIZEY = 200")
	if err != nil {
		t.Fatalf("parseHeader failed: %v", err)
	}
	if w != 100 || h != 200 {
		t.Errorf("Expected 100x200, got %dx%d", w, h)
	}
}

func TestParseHeaderInvalid(t *testing.T) {
	_, _, err := parseHeader("nothing useful here")
	if err == nil {
		t.Error("Should fail on header without dimensions")
	}
}

func TestGetSectorBounds(t *testing.T) {
	gm := makeTestMap(100, 100)

	s := gm.GetSector(0, 0)
	if s == nil {
		t.Error("Should get sector at (0,0)")
	}

	s = gm.GetSector(99, 99)
	if s == nil {
		t.Error("Should get sector at (99,99)")
	}

	// Very large negative coords should return nil
	s = gm.GetSector(-100, -100)
	if s != nil {
		t.Error("Should return nil for large negative coords")
	}
}
