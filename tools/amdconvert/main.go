package main

import (
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// CompactMapData is the web-optimized output format.
// Tile data uses flat int16 arrays (row-major: y*width+x).
// Collision is a base64-encoded packed bitfield.
type CompactMapData struct {
	Name      string   `json:"name"`
	Width     int      `json:"width"`
	Height    int      `json:"height"`
	Tiles     []int16  `json:"tiles"`     // flat: [tileSprite, tileSpriteFrame, objSprite, objSpriteFrame, ...] 4 values per tile
	Collision string   `json:"collision"` // base64 packed bitfield (1=blocked)
	Teleports [][2]int `json:"teleports"` // [[x,y], ...]
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
		success, failed := 0, 0
		for _, entry := range entries {
			if strings.ToLower(filepath.Ext(entry.Name())) == ".amd" {
				amdPath := filepath.Join(*inputPath, entry.Name())
				if err := convertAMD(amdPath, *outputDir); err != nil {
					fmt.Fprintf(os.Stderr, "Warning: %s: %v\n", entry.Name(), err)
					failed++
				} else {
					success++
				}
			}
		}
		fmt.Printf("\nDone: %d converted, %d failed\n", success, failed)
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

	header := make([]byte, 256)
	copy(header, data[:256])
	for i := range header {
		if header[i] == 0 {
			header[i] = ' '
		}
	}

	width, height, err := parseHeaderDimensions(string(header))
	if err != nil {
		return fmt.Errorf("parse header: %w", err)
	}

	expectedDataSize := 256 + width*height*10
	if len(data) < expectedDataSize {
		return fmt.Errorf("file too small for %dx%d map: need %d bytes, have %d",
			width, height, expectedDataSize, len(data))
	}

	baseName := strings.TrimSuffix(filepath.Base(amdPath), filepath.Ext(amdPath))
	fmt.Printf("Converting %s: %dx%d", baseName, width, height)

	totalTiles := width * height
	tiles := make([]int16, totalTiles*4)
	collisionBits := make([]byte, (totalTiles+7)/8)
	var teleports [][2]int
	blocked := 0

	offset := 256
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			tileData := data[offset : offset+10]
			offset += 10

			idx := (y*width + x) * 4
			tiles[idx+0] = int16(binary.LittleEndian.Uint16(tileData[0:2]))
			tiles[idx+1] = int16(binary.LittleEndian.Uint16(tileData[2:4]))
			tiles[idx+2] = int16(binary.LittleEndian.Uint16(tileData[4:6]))
			tiles[idx+3] = int16(binary.LittleEndian.Uint16(tileData[6:8]))
			flags := tileData[8]

			tileIndex := y*width + x
			if (flags & 0x80) != 0 {
				collisionBits[tileIndex/8] |= 1 << (uint(tileIndex) % 8)
				blocked++
			}

			if (flags & 0x40) != 0 {
				teleports = append(teleports, [2]int{x, y})
			}
		}
	}

	mapData := CompactMapData{
		Name:      baseName,
		Width:     width,
		Height:    height,
		Tiles:     tiles,
		Collision: base64.StdEncoding.EncodeToString(collisionBits),
		Teleports: teleports,
	}

	jsonData, err := json.Marshal(mapData)
	if err != nil {
		return fmt.Errorf("marshal: %w", err)
	}

	outPath := filepath.Join(outputDir, baseName+".json")
	if err := os.WriteFile(outPath, jsonData, 0o644); err != nil {
		return fmt.Errorf("write: %w", err)
	}

	fmt.Printf(" -> %s (%.1f%% blocked, %d teleports, %.0fKB)\n",
		outPath, float64(blocked)/float64(totalTiles)*100,
		len(teleports), float64(len(jsonData))/1024)

	return nil
}

func parseHeaderDimensions(header string) (width, height int, err error) {
	fields := strings.Fields(header)
	for i := 0; i < len(fields); i++ {
		switch fields[i] {
		case "MAPSIZEX":
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
