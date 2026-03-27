package main

import (
	"encoding/binary"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// Tile represents a single map tile from the AMD file.
type Tile struct {
	X                int16 `json:"x"`
	Y                int16 `json:"y"`
	TileSprite       int16 `json:"tileSprite"`
	TileSpriteFrame  int16 `json:"tileSpriteFrame"`
	ObjectSprite     int16 `json:"objectSprite"`
	ObjectSpriteFrame int16 `json:"objectSpriteFrame"`
	Walkable         bool  `json:"walkable"`
	Teleport         bool  `json:"teleport"`
	Farm             bool  `json:"farm"`
	Water            bool  `json:"water"`
}

// MapData is the output JSON structure for a converted map.
type MapData struct {
	Name           string    `json:"name"`
	Width          int       `json:"width"`
	Height         int       `json:"height"`
	Tiles          []Tile    `json:"tiles"`
	CollisionGrid  [][]int8  `json:"collisionGrid"`
	TeleportTiles  []TilePos `json:"teleportTiles"`
}

// TilePos is a simple x,y coordinate.
type TilePos struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func main() {
	inputPath := flag.String("input", "", "Path to AMD file or directory")
	outputDir := flag.String("output", "output", "Output directory for JSON maps")
	flag.Parse()

	if *inputPath == "" {
		fmt.Fprintf(os.Stderr, "Usage: amdconvert -input <file_or_dir> [-output <dir>]\n")
		os.Exit(1)
	}

	if err := os.MkdirAll(*outputDir, 0o755); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output dir: %v\n", err)
		os.Exit(1)
	}

	info, err := os.Stat(*inputPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	if info.IsDir() {
		entries, err := os.ReadDir(*inputPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading dir: %v\n", err)
			os.Exit(1)
		}
		for _, entry := range entries {
			if strings.ToLower(filepath.Ext(entry.Name())) == ".amd" {
				amdPath := filepath.Join(*inputPath, entry.Name())
				if err := convertAMD(amdPath, *outputDir); err != nil {
					fmt.Fprintf(os.Stderr, "Warning: %s: %v\n", entry.Name(), err)
				}
			}
		}
	} else {
		if err := convertAMD(*inputPath, *outputDir); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
	}
}

func convertAMD(amdPath, outputDir string) error {
	data, err := os.ReadFile(amdPath)
	if err != nil {
		return fmt.Errorf("read: %w", err)
	}

	if len(data) < 256 {
		return fmt.Errorf("file too small: %d bytes", len(data))
	}

	// Parse 256-byte ASCII header to extract MAPSIZEX and MAPSIZEY.
	// Header is null-padded; replace nulls with spaces for tokenizing.
	header := make([]byte, 256)
	copy(header, data[:256])
	for i := range header {
		if header[i] == 0 {
			header[i] = ' '
		}
	}
	headerStr := string(header)

	width, height, err := parseHeaderDimensions(headerStr)
	if err != nil {
		return fmt.Errorf("parse header: %w", err)
	}

	expectedDataSize := 256 + width*height*10
	if len(data) < expectedDataSize {
		return fmt.Errorf("file too small for %dx%d map: need %d bytes, have %d",
			width, height, expectedDataSize, len(data))
	}

	baseName := strings.TrimSuffix(filepath.Base(amdPath), filepath.Ext(amdPath))
	fmt.Printf("Converting %s: %dx%d\n", baseName, width, height)

	// Parse tile data: row-major (y outer, x inner), 10 bytes per tile.
	tiles := make([]Tile, 0, width*height)
	collisionGrid := make([][]int8, height)
	var teleportTiles []TilePos

	offset := 256
	for y := 0; y < height; y++ {
		collisionGrid[y] = make([]int8, width)
		for x := 0; x < width; x++ {
			tileData := data[offset : offset+10]
			offset += 10

			tileSprite := int16(binary.LittleEndian.Uint16(tileData[0:2]))
			tileSpriteFrame := int16(binary.LittleEndian.Uint16(tileData[2:4]))
			objectSprite := int16(binary.LittleEndian.Uint16(tileData[4:6]))
			objectSpriteFrame := int16(binary.LittleEndian.Uint16(tileData[6:8]))
			flags := tileData[8]

			walkable := (flags & 0x80) == 0
			teleport := (flags & 0x40) != 0
			farm := (flags & 0x20) != 0
			// Water detection: tileSprite == 19 (from Map.cpp)
			water := tileSprite == 19

			tile := Tile{
				X:                 int16(x),
				Y:                 int16(y),
				TileSprite:        tileSprite,
				TileSpriteFrame:   tileSpriteFrame,
				ObjectSprite:      objectSprite,
				ObjectSpriteFrame: objectSpriteFrame,
				Walkable:          walkable,
				Teleport:          teleport,
				Farm:              farm,
				Water:             water,
			}
			tiles = append(tiles, tile)

			if walkable {
				collisionGrid[y][x] = 0
			} else {
				collisionGrid[y][x] = 1
			}

			if teleport {
				teleportTiles = append(teleportTiles, TilePos{X: x, Y: y})
			}
		}
	}

	mapData := MapData{
		Name:          baseName,
		Width:         width,
		Height:        height,
		Tiles:         tiles,
		CollisionGrid: collisionGrid,
		TeleportTiles: teleportTiles,
	}

	jsonData, err := json.Marshal(mapData)
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}

	outPath := filepath.Join(outputDir, baseName+".json")
	if err := os.WriteFile(outPath, jsonData, 0o644); err != nil {
		return fmt.Errorf("write: %w", err)
	}

	blocked := 0
	for _, row := range collisionGrid {
		for _, v := range row {
			if v == 1 {
				blocked++
			}
		}
	}

	fmt.Printf("  %d tiles, %d blocked (%.1f%%), %d teleports -> %s\n",
		width*height, blocked, float64(blocked)/float64(width*height)*100,
		len(teleportTiles), outPath)

	return nil
}

func parseHeaderDimensions(header string) (width, height int, err error) {
	// Tokenize the header string to find MAPSIZEX and MAPSIZEY values.
	fields := strings.Fields(header)
	for i := 0; i < len(fields); i++ {
		switch fields[i] {
		case "MAPSIZEX":
			// Skip "=" if present
			j := i + 1
			for j < len(fields) && fields[j] == "=" {
				j++
			}
			if j < len(fields) {
				width, err = strconv.Atoi(fields[j])
				if err != nil {
					return 0, 0, fmt.Errorf("parse MAPSIZEX: %w", err)
				}
			}
		case "MAPSIZEY":
			j := i + 1
			for j < len(fields) && fields[j] == "=" {
				j++
			}
			if j < len(fields) {
				height, err = strconv.Atoi(fields[j])
				if err != nil {
					return 0, 0, fmt.Errorf("parse MAPSIZEY: %w", err)
				}
			}
		}
	}

	if width <= 0 || height <= 0 {
		return 0, 0, fmt.Errorf("invalid dimensions: %dx%d", width, height)
	}
	return width, height, nil
}
