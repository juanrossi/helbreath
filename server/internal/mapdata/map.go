package mapdata

import (
	"encoding/binary"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
)

const SectorSize = 20

type Tile struct {
	TileSprite        int16
	TileSpriteFrame   int16
	ObjectSprite      int16
	ObjectSpriteFrame int16
	Walkable          bool
	Teleport          bool
	Farm              bool
	Water             bool

	// Runtime state
	Owner int32 // object ID of player/NPC occupying this tile
}

type Sector struct {
	mu      sync.RWMutex
	Players map[int32]bool
	NPCs    map[int32]bool
}

type GameMap struct {
	Name    string
	Width   int
	Height  int
	Tiles   [][]Tile   // [y][x]
	Sectors [][]Sector // spatial index
}

// LoadAMD reads a single .amd file and returns a GameMap.
func LoadAMD(path string) (*GameMap, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	if len(data) < 256 {
		return nil, fmt.Errorf("file too small: %d bytes", len(data))
	}

	// Parse header
	header := make([]byte, 256)
	copy(header, data[:256])
	for i := range header {
		if header[i] == 0 {
			header[i] = ' '
		}
	}

	width, height, err := parseHeader(string(header))
	if err != nil {
		return nil, err
	}

	expected := 256 + width*height*10
	if len(data) < expected {
		return nil, fmt.Errorf("file too small for %dx%d map", width, height)
	}

	name := strings.TrimSuffix(filepath.Base(path), filepath.Ext(path))
	gm := &GameMap{
		Name:   name,
		Width:  width,
		Height: height,
		Tiles:  make([][]Tile, height),
	}

	// Parse tiles
	offset := 256
	for y := 0; y < height; y++ {
		gm.Tiles[y] = make([]Tile, width)
		for x := 0; x < width; x++ {
			td := data[offset : offset+10]
			offset += 10

			t := Tile{
				TileSprite:        int16(binary.LittleEndian.Uint16(td[0:2])),
				TileSpriteFrame:   int16(binary.LittleEndian.Uint16(td[2:4])),
				ObjectSprite:      int16(binary.LittleEndian.Uint16(td[4:6])),
				ObjectSpriteFrame: int16(binary.LittleEndian.Uint16(td[6:8])),
				Walkable:          (td[8] & 0x80) == 0,
				Teleport:          (td[8] & 0x40) != 0,
				Farm:              (td[8] & 0x20) != 0,
			}
			t.Water = t.TileSprite == 19
			gm.Tiles[y][x] = t
		}
	}

	// Initialize sectors
	sectorsX := (width + SectorSize - 1) / SectorSize
	sectorsY := (height + SectorSize - 1) / SectorSize
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

	return gm, nil
}

func (m *GameMap) IsWalkable(x, y int) bool {
	if x < 0 || y < 0 || x >= m.Width || y >= m.Height {
		return false
	}
	t := &m.Tiles[y][x]
	return t.Walkable && t.Owner == 0
}

func (m *GameMap) IsTeleport(x, y int) bool {
	if x < 0 || y < 0 || x >= m.Width || y >= m.Height {
		return false
	}
	return m.Tiles[y][x].Teleport
}

func (m *GameMap) GetSector(x, y int) *Sector {
	sx := x / SectorSize
	sy := y / SectorSize
	if sx < 0 || sy < 0 || sy >= len(m.Sectors) || sx >= len(m.Sectors[0]) {
		return nil
	}
	return &m.Sectors[sy][sx]
}

func (m *GameMap) SetOwner(x, y int, objectID int32) {
	if x >= 0 && y >= 0 && x < m.Width && y < m.Height {
		m.Tiles[y][x].Owner = objectID
	}
}

func (m *GameMap) ClearOwner(x, y int) {
	if x >= 0 && y >= 0 && x < m.Width && y < m.Height {
		m.Tiles[y][x].Owner = 0
	}
}

// AddPlayerToSector adds a player object ID to the sector containing (x,y).
func (m *GameMap) AddPlayerToSector(x, y int, objectID int32) {
	s := m.GetSector(x, y)
	if s == nil {
		return
	}
	s.mu.Lock()
	s.Players[objectID] = true
	s.mu.Unlock()
}

// RemovePlayerFromSector removes a player from the sector containing (x,y).
func (m *GameMap) RemovePlayerFromSector(x, y int, objectID int32) {
	s := m.GetSector(x, y)
	if s == nil {
		return
	}
	s.mu.Lock()
	delete(s.Players, objectID)
	s.mu.Unlock()
}

// GetNearbyPlayerIDs returns all player object IDs in a 3x3 sector grid around (x,y).
func (m *GameMap) GetNearbyPlayerIDs(x, y int) []int32 {
	cx := x / SectorSize
	cy := y / SectorSize

	var result []int32
	for dy := -1; dy <= 1; dy++ {
		for dx := -1; dx <= 1; dx++ {
			sy := cy + dy
			sx := cx + dx
			if sy < 0 || sx < 0 || sy >= len(m.Sectors) || sx >= len(m.Sectors[0]) {
				continue
			}
			s := &m.Sectors[sy][sx]
			s.mu.RLock()
			for id := range s.Players {
				result = append(result, id)
			}
			s.mu.RUnlock()
		}
	}
	return result
}

// PackCollisionGrid creates a packed bitfield of the collision grid.
func (m *GameMap) PackCollisionGrid() []byte {
	totalBits := m.Width * m.Height
	totalBytes := (totalBits + 7) / 8
	grid := make([]byte, totalBytes)

	for y := 0; y < m.Height; y++ {
		for x := 0; x < m.Width; x++ {
			idx := y*m.Width + x
			if !m.Tiles[y][x].Walkable {
				grid[idx/8] |= 1 << (idx % 8)
			}
		}
	}
	return grid
}

func parseHeader(header string) (int, int, error) {
	fields := strings.Fields(header)
	var width, height int
	for i := 0; i < len(fields); i++ {
		switch fields[i] {
		case "MAPSIZEX":
			j := i + 1
			for j < len(fields) && fields[j] == "=" {
				j++
			}
			if j < len(fields) {
				var err error
				width, err = strconv.Atoi(fields[j])
				if err != nil {
					return 0, 0, err
				}
			}
		case "MAPSIZEY":
			j := i + 1
			for j < len(fields) && fields[j] == "=" {
				j++
			}
			if j < len(fields) {
				var err error
				height, err = strconv.Atoi(fields[j])
				if err != nil {
					return 0, 0, err
				}
			}
		}
	}
	if width <= 0 || height <= 0 {
		return 0, 0, fmt.Errorf("invalid dimensions: %dx%d", width, height)
	}
	return width, height, nil
}
