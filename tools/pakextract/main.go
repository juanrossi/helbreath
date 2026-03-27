package main

import (
	"encoding/binary"
	"encoding/json"
	"flag"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// Brush represents per-frame offset and dimension data from the PAK file.
type Brush struct {
	SX  int16 // source X offset within bitmap
	SY  int16 // source Y offset within bitmap
	SZX int16 // frame width in pixels
	SZY int16 // frame height in pixels
	PVX int16 // pivot X (anchor point for rendering)
	PVY int16 // pivot Y (anchor point for rendering)
}

// SpriteInfo holds extracted sprite metadata.
type SpriteInfo struct {
	Index      int     `json:"index"`
	TotalFrame int32   `json:"totalFrames"`
	Brushes    []Brush `json:"-"`
}

// FrameInfo is output manifest data per frame.
type FrameInfo struct {
	SpriteIndex int    `json:"spriteIndex"`
	FrameIndex  int    `json:"frameIndex"`
	Filename    string `json:"filename"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	PivotX      int    `json:"pivotX"`
	PivotY      int    `json:"pivotY"`
	SourceX     int    `json:"sourceX"`
	SourceY     int    `json:"sourceY"`
}

// AtlasFrame is used for Phaser JSON atlas format.
type AtlasFrame struct {
	Filename string          `json:"filename"`
	Frame    AtlasFrameRect  `json:"frame"`
	Rotated  bool            `json:"rotated"`
	Trimmed  bool            `json:"trimmed"`
	Pivot    AtlasFramePivot `json:"pivot"`
}

type AtlasFrameRect struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type AtlasFramePivot struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

var noColorKey bool

func main() {
	inputPath := flag.String("input", "", "Path to PAK/APK file or directory")
	outputDir := flag.String("output", "output", "Output directory for extracted sprites")
	flag.BoolVar(&noColorKey, "no-colorkey", false, "Disable color key transparency (use for map tiles, UI elements)")
	flag.Parse()

	if *inputPath == "" {
		fmt.Fprintf(os.Stderr, "Usage: pakextract -input <file_or_dir> [-output <dir>]\n")
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
			name := entry.Name()
			ext := strings.ToLower(filepath.Ext(name))
			if ext == ".pak" || ext == ".apk" {
				pakPath := filepath.Join(*inputPath, name)
				if err := extractPAK(pakPath, *outputDir); err != nil {
					fmt.Fprintf(os.Stderr, "Warning: %s: %v\n", name, err)
				}
			}
		}
	} else {
		if err := extractPAK(*inputPath, *outputDir); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
	}
}

func extractPAK(pakPath, outputDir string) error {
	f, err := os.Open(pakPath)
	if err != nil {
		return fmt.Errorf("open: %w", err)
	}
	defer f.Close()

	fileInfo, err := f.Stat()
	if err != nil {
		return fmt.Errorf("stat: %w", err)
	}
	fileSize := fileInfo.Size()

	baseName := strings.TrimSuffix(filepath.Base(pakPath), filepath.Ext(pakPath))
	spriteDir := filepath.Join(outputDir, baseName)
	if err := os.MkdirAll(spriteDir, 0o755); err != nil {
		return fmt.Errorf("mkdir: %w", err)
	}

	// Read sprite index table starting at offset 24.
	// Each entry is 8 bytes: 4-byte offset + 4 bytes reserved.
	// We scan entries until we hit an invalid offset.
	var spriteOffsets []uint32
	indexOffset := int64(24)

	for {
		if indexOffset+8 > fileSize {
			break
		}
		if _, err := f.Seek(indexOffset, io.SeekStart); err != nil {
			break
		}
		var offset uint32
		if err := binary.Read(f, binary.LittleEndian, &offset); err != nil {
			break
		}

		// Validate offset: must be within file and > index area
		if offset == 0 || int64(offset) >= fileSize || int64(offset) < 24 {
			break
		}

		spriteOffsets = append(spriteOffsets, offset)
		indexOffset += 8
	}

	if len(spriteOffsets) == 0 {
		return fmt.Errorf("no sprites found in %s", pakPath)
	}

	fmt.Printf("Extracting %s: %d sprites\n", baseName, len(spriteOffsets))

	var allFrames []FrameInfo

	for sprIdx, offset := range spriteOffsets {
		frames, err := extractSprite(f, fileSize, sprIdx, offset, spriteDir)
		if err != nil {
			fmt.Fprintf(os.Stderr, "  sprite %d: %v\n", sprIdx, err)
			continue
		}
		allFrames = append(allFrames, frames...)
	}

	// Write manifest JSON
	manifestPath := filepath.Join(outputDir, baseName+"_manifest.json")
	manifestData, err := json.MarshalIndent(allFrames, "", "  ")
	if err != nil {
		return fmt.Errorf("marshal manifest: %w", err)
	}
	if err := os.WriteFile(manifestPath, manifestData, 0o644); err != nil {
		return fmt.Errorf("write manifest: %w", err)
	}

	fmt.Printf("  Extracted %d frames -> %s\n", len(allFrames), spriteDir)
	return nil
}

func extractSprite(f *os.File, fileSize int64, spriteIndex int, offset uint32, outputDir string) ([]FrameInfo, error) {
	// Read total frame count at offset + 100
	frameCountOffset := int64(offset) + 100
	if frameCountOffset+4 > fileSize {
		return nil, fmt.Errorf("frame count offset out of bounds")
	}
	if _, err := f.Seek(frameCountOffset, io.SeekStart); err != nil {
		return nil, fmt.Errorf("seek frame count: %w", err)
	}
	var totalFrames int32
	if err := binary.Read(f, binary.LittleEndian, &totalFrames); err != nil {
		return nil, fmt.Errorf("read frame count: %w", err)
	}

	if totalFrames <= 0 || totalFrames > 10000 {
		return nil, fmt.Errorf("invalid frame count: %d", totalFrames)
	}

	// Brushes start at offset+104 (right after frame count at +100).
	// The ReadFile in original code reads sequentially after the frame count.
	// Bitmap data is at offset + 108 + (12 * totalFrames) per the original formula.
	brushOffset := int64(offset) + 104
	brushSize := int64(totalFrames) * 12
	if brushOffset+brushSize > fileSize {
		return nil, fmt.Errorf("brush data out of bounds")
	}
	if _, err := f.Seek(brushOffset, io.SeekStart); err != nil {
		return nil, fmt.Errorf("seek brushes: %w", err)
	}

	brushes := make([]Brush, totalFrames)
	for i := int32(0); i < totalFrames; i++ {
		if err := binary.Read(f, binary.LittleEndian, &brushes[i]); err != nil {
			return nil, fmt.Errorf("read brush %d: %w", i, err)
		}
	}

	// Bitmap data is at offset + 108 + 12*totalFrames (per original Sprite.cpp line 41)
	bmpOffset := int64(offset) + 108 + int64(totalFrames)*12

	// Try to parse as BMP
	bmpImg, colorKey, err := parseBMP(f, fileSize, bmpOffset)
	if err != nil {
		return nil, fmt.Errorf("parse BMP: %w", err)
	}

	// Extract individual frames using brush data
	var frames []FrameInfo
	for i := int32(0); i < totalFrames; i++ {
		b := brushes[i]
		if b.SZX <= 0 || b.SZY <= 0 {
			continue
		}

		frameImg := extractFrame(bmpImg, b, colorKey)
		if frameImg == nil {
			continue
		}

		filename := fmt.Sprintf("spr%d_frame%d.png", spriteIndex, i)
		framePath := filepath.Join(outputDir, filename)
		if err := savePNG(framePath, frameImg); err != nil {
			fmt.Fprintf(os.Stderr, "  save frame %d: %v\n", i, err)
			continue
		}

		frames = append(frames, FrameInfo{
			SpriteIndex: spriteIndex,
			FrameIndex:  int(i),
			Filename:    filename,
			Width:       int(b.SZX),
			Height:      int(b.SZY),
			PivotX:      int(b.PVX),
			PivotY:      int(b.PVY),
			SourceX:     int(b.SX),
			SourceY:     int(b.SY),
		})
	}

	return frames, nil
}

// parseBMP reads a BMP from the file at the given offset.
// Returns the decoded image and the color key (first pixel color for transparency).
func parseBMP(f *os.File, fileSize, offset int64) (*image.RGBA, color.RGBA, error) {
	if offset+14 > fileSize {
		return nil, color.RGBA{}, fmt.Errorf("BMP header out of bounds at offset %d", offset)
	}
	if _, err := f.Seek(offset, io.SeekStart); err != nil {
		return nil, color.RGBA{}, fmt.Errorf("seek BMP: %w", err)
	}

	// Read BITMAPFILEHEADER (14 bytes)
	var bfType uint16
	var bfSize uint32
	var bfReserved1, bfReserved2 uint16
	var bfOffBits uint32

	binary.Read(f, binary.LittleEndian, &bfType)
	binary.Read(f, binary.LittleEndian, &bfSize)
	binary.Read(f, binary.LittleEndian, &bfReserved1)
	binary.Read(f, binary.LittleEndian, &bfReserved2)
	binary.Read(f, binary.LittleEndian, &bfOffBits)

	// BMP magic: "BM" = 0x4D42
	if bfType != 0x4D42 {
		// Try without file header (some PAK sprites embed raw DIB data)
		return parseDIB(f, fileSize, offset)
	}

	// Read BITMAPINFOHEADER (at least 40 bytes)
	return parseBMPInfo(f, fileSize, offset+14, offset+int64(bfOffBits))
}

func parseDIB(f *os.File, fileSize, offset int64) (*image.RGBA, color.RGBA, error) {
	// Try parsing as raw BITMAPINFOHEADER without file header
	if _, err := f.Seek(offset, io.SeekStart); err != nil {
		return nil, color.RGBA{}, err
	}
	return parseBMPInfo(f, fileSize, offset, 0)
}

func parseBMPInfo(f *os.File, fileSize, infoOffset, pixelDataOffset int64) (*image.RGBA, color.RGBA, error) {
	if _, err := f.Seek(infoOffset, io.SeekStart); err != nil {
		return nil, color.RGBA{}, err
	}

	var biSize uint32
	var biWidth, biHeight int32
	var biPlanes, biBitCount uint16
	var biCompression, biSizeImage uint32
	var biXPelsPerMeter, biYPelsPerMeter int32
	var biClrUsed, biClrImportant uint32

	binary.Read(f, binary.LittleEndian, &biSize)
	binary.Read(f, binary.LittleEndian, &biWidth)
	binary.Read(f, binary.LittleEndian, &biHeight)
	binary.Read(f, binary.LittleEndian, &biPlanes)
	binary.Read(f, binary.LittleEndian, &biBitCount)
	binary.Read(f, binary.LittleEndian, &biCompression)
	binary.Read(f, binary.LittleEndian, &biSizeImage)
	binary.Read(f, binary.LittleEndian, &biXPelsPerMeter)
	binary.Read(f, binary.LittleEndian, &biYPelsPerMeter)
	binary.Read(f, binary.LittleEndian, &biClrUsed)
	binary.Read(f, binary.LittleEndian, &biClrImportant)

	if biWidth <= 0 || biWidth > 16384 {
		return nil, color.RGBA{}, fmt.Errorf("invalid BMP width: %d", biWidth)
	}

	// biHeight can be negative (top-down), handle both
	topDown := biHeight < 0
	absHeight := biHeight
	if absHeight < 0 {
		absHeight = -absHeight
	}
	if absHeight <= 0 || absHeight > 16384 {
		return nil, color.RGBA{}, fmt.Errorf("invalid BMP height: %d", biHeight)
	}

	// Read color palette if indexed
	var palette []color.RGBA
	paletteSize := 0

	switch biBitCount {
	case 1:
		paletteSize = 2
	case 4:
		paletteSize = 16
	case 8:
		paletteSize = 256
	case 24, 32:
		paletteSize = 0
	default:
		return nil, color.RGBA{}, fmt.Errorf("unsupported bit depth: %d", biBitCount)
	}

	if biClrUsed > 0 && biClrUsed < uint32(paletteSize) {
		paletteSize = int(biClrUsed)
	}

	if paletteSize > 0 {
		// Seek past any remaining header bytes
		paletteOffset := infoOffset + int64(biSize)
		if _, err := f.Seek(paletteOffset, io.SeekStart); err != nil {
			return nil, color.RGBA{}, fmt.Errorf("seek palette: %w", err)
		}
		palette = make([]color.RGBA, paletteSize)
		for i := 0; i < paletteSize; i++ {
			var b, g, r, a uint8
			binary.Read(f, binary.LittleEndian, &b)
			binary.Read(f, binary.LittleEndian, &g)
			binary.Read(f, binary.LittleEndian, &r)
			binary.Read(f, binary.LittleEndian, &a) // reserved/alpha
			palette[i] = color.RGBA{R: r, G: g, B: b, A: 255}
		}
	}

	// Calculate row stride (padded to 4 bytes)
	bitsPerRow := int(biWidth) * int(biBitCount)
	bytesPerRow := (bitsPerRow + 7) / 8
	stride := ((bytesPerRow + 3) / 4) * 4

	// Seek to pixel data
	if pixelDataOffset > 0 {
		if _, err := f.Seek(pixelDataOffset, io.SeekStart); err != nil {
			return nil, color.RGBA{}, fmt.Errorf("seek pixels: %w", err)
		}
	}
	// If pixelDataOffset == 0, we're already positioned after palette

	// Read pixel data
	totalPixelBytes := stride * int(absHeight)
	pixelData := make([]byte, totalPixelBytes)
	n, err := io.ReadFull(f, pixelData)
	if err != nil && n == 0 {
		return nil, color.RGBA{}, fmt.Errorf("read pixels: %w (read %d of %d)", err, n, totalPixelBytes)
	}

	// Create RGBA image
	img := image.NewRGBA(image.Rect(0, 0, int(biWidth), int(absHeight)))

	for y := 0; y < int(absHeight); y++ {
		// BMP stores bottom-up by default
		srcY := y
		dstY := int(absHeight) - 1 - y
		if topDown {
			dstY = y
		}

		rowStart := srcY * stride
		if rowStart+bytesPerRow > len(pixelData) {
			break
		}

		for x := 0; x < int(biWidth); x++ {
			var c color.RGBA

			switch biBitCount {
			case 1:
				byteIdx := rowStart + x/8
				bitIdx := uint(7 - (x % 8))
				palIdx := (pixelData[byteIdx] >> bitIdx) & 1
				if int(palIdx) < len(palette) {
					c = palette[palIdx]
				}
			case 4:
				byteIdx := rowStart + x/2
				var palIdx byte
				if x%2 == 0 {
					palIdx = (pixelData[byteIdx] >> 4) & 0x0F
				} else {
					palIdx = pixelData[byteIdx] & 0x0F
				}
				if int(palIdx) < len(palette) {
					c = palette[palIdx]
				}
			case 8:
				byteIdx := rowStart + x
				palIdx := pixelData[byteIdx]
				if int(palIdx) < len(palette) {
					c = palette[palIdx]
				}
			case 24:
				byteIdx := rowStart + x*3
				if byteIdx+2 < len(pixelData) {
					c = color.RGBA{
						B: pixelData[byteIdx],
						G: pixelData[byteIdx+1],
						R: pixelData[byteIdx+2],
						A: 255,
					}
				}
			case 32:
				byteIdx := rowStart + x*4
				if byteIdx+3 < len(pixelData) {
					c = color.RGBA{
						B: pixelData[byteIdx],
						G: pixelData[byteIdx+1],
						R: pixelData[byteIdx+2],
						A: pixelData[byteIdx+3],
					}
					if c.A == 0 {
						c.A = 255 // many BMP32 have alpha=0 meaning opaque
					}
				}
			}

			img.SetRGBA(x, dstY, c)
		}
	}

	// Color key is the first pixel (top-left of the final image)
	colorKey := img.RGBAAt(0, 0)

	return img, colorKey, nil
}

// extractFrame cuts a single frame from the full bitmap using brush offsets,
// and applies color key transparency.
func extractFrame(bmpImg *image.RGBA, b Brush, colorKey color.RGBA) *image.RGBA {
	w := int(b.SZX)
	h := int(b.SZY)
	sx := int(b.SX)
	sy := int(b.SY)

	if w <= 0 || h <= 0 {
		return nil
	}

	bounds := bmpImg.Bounds()
	frameImg := image.NewRGBA(image.Rect(0, 0, w, h))

	for dy := 0; dy < h; dy++ {
		for dx := 0; dx < w; dx++ {
			srcX := sx + dx
			srcY := sy + dy

			if srcX < bounds.Min.X || srcX >= bounds.Max.X ||
				srcY < bounds.Min.Y || srcY >= bounds.Max.Y {
				// Out of bounds - transparent
				frameImg.SetRGBA(dx, dy, color.RGBA{0, 0, 0, 0})
				continue
			}

			c := bmpImg.RGBAAt(srcX, srcY)

			// Apply color key transparency (skip for tiles/UI with --no-colorkey)
			if !noColorKey && c.R == colorKey.R && c.G == colorKey.G && c.B == colorKey.B {
				frameImg.SetRGBA(dx, dy, color.RGBA{0, 0, 0, 0})
			} else {
				frameImg.SetRGBA(dx, dy, c)
			}
		}
	}

	return frameImg
}

func savePNG(path string, img *image.RGBA) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	return png.Encode(f, img)
}
