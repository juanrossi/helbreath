package main

import (
	"encoding/binary"
	"encoding/json"
	"flag"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"io"
	"math"
	"os"
	"path/filepath"
	"strings"
)

// Brush represents per-frame offset and dimension data from the PAK file.
type Brush struct {
	SX  int16
	SY  int16
	SZX int16 // frame width
	SZY int16 // frame height
	PVX int16 // pivot X
	PVY int16 // pivot Y
}

// extractedFrame holds a decoded frame image and its metadata.
type extractedFrame struct {
	Image       *image.RGBA
	SpriteIndex int
	FrameIndex  int
	Width       int
	Height      int
	PivotX      int
	PivotY      int
}

// AtlasFrame is the Phaser-compatible atlas JSON frame entry.
type AtlasFrame struct {
	Frame            AtlasRect  `json:"frame"`
	Rotated          bool       `json:"rotated"`
	Trimmed          bool       `json:"trimmed"`
	SpriteSourceSize AtlasRect  `json:"spriteSourceSize"`
	SourceSize       AtlasSize  `json:"sourceSize"`
	Pivot            AtlasPoint `json:"pivot"`
}

type AtlasRect struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type AtlasSize struct {
	W int `json:"w"`
	H int `json:"h"`
}

type AtlasPoint struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// PhaserAtlas is the top-level Phaser JSON Hash atlas format.
type PhaserAtlas struct {
	Frames map[string]AtlasFrame `json:"frames"`
	Meta   AtlasMeta             `json:"meta"`
}

type AtlasMeta struct {
	Image   string `json:"image"`
	Format  string `json:"format"`
	Size    AtlasSize `json:"size"`
	Scale   string `json:"scale"`
}

const maxAtlasWidth = 4096
const maxAtlasHeight = 8192

var noColorKey bool

func main() {
	inputPath := flag.String("input", "", "Path to PAK/APK file or directory")
	outputDir := flag.String("output", "output", "Output directory for sprite atlases")
	flag.BoolVar(&noColorKey, "no-colorkey", false, "Disable color key transparency (for map tiles, UI)")
	flag.Parse()

	if *inputPath == "" {
		fmt.Fprintf(os.Stderr, "Usage: pakextract -input <file_or_dir> [-output <dir>]\n")
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
		success, failed, totalFrames := 0, 0, 0
		for _, entry := range entries {
			name := entry.Name()
			ext := strings.ToLower(filepath.Ext(name))
			if ext == ".pak" || ext == ".apk" {
				pakPath := filepath.Join(*inputPath, name)
				n, err := extractPAKToAtlas(pakPath, *outputDir)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Warning: %s: %v\n", name, err)
					failed++
				} else {
					success++
					totalFrames += n
				}
			}
		}
		fmt.Printf("\nDone: %d PAK files, %d frames, %d failed\n", success, totalFrames, failed)
	} else {
		if _, err := extractPAKToAtlas(*inputPath, *outputDir); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
	}
}

// extractPAKToAtlas extracts all frames from a PAK file and packs them into
// one or more texture atlas sprite sheets with Phaser-compatible JSON.
func extractPAKToAtlas(pakPath, outputDir string) (int, error) {
	f, err := os.Open(pakPath)
	if err != nil {
		return 0, fmt.Errorf("open: %w", err)
	}
	defer f.Close()

	fileInfo, err := f.Stat()
	if err != nil {
		return 0, fmt.Errorf("stat: %w", err)
	}
	fileSize := fileInfo.Size()

	baseName := strings.TrimSuffix(filepath.Base(pakPath), filepath.Ext(pakPath))

	// Read sprite index table starting at offset 24
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
		if offset == 0 || int64(offset) >= fileSize || int64(offset) < 24 {
			break
		}
		spriteOffsets = append(spriteOffsets, offset)
		indexOffset += 8
	}

	if len(spriteOffsets) == 0 {
		return 0, fmt.Errorf("no sprites found")
	}

	// Extract all frames into memory
	var allFrames []extractedFrame

	for sprIdx, offset := range spriteOffsets {
		frames, err := extractSpriteFrames(f, fileSize, sprIdx, offset)
		if err != nil {
			continue
		}
		allFrames = append(allFrames, frames...)
	}

	if len(allFrames) == 0 {
		return 0, fmt.Errorf("no frames extracted")
	}

	fmt.Printf("Packing %s: %d sprites, %d frames", baseName, len(spriteOffsets), len(allFrames))

	// Pack frames into atlas(es)
	atlasCount := packAndSaveAtlases(baseName, allFrames, outputDir)
	fmt.Printf(" -> %d atlas(es)\n", atlasCount)

	return len(allFrames), nil
}

// packAndSaveAtlases packs frames into one or more atlas images.
// Uses a simple row-packing algorithm with max width constraint.
func packAndSaveAtlases(baseName string, frames []extractedFrame, outputDir string) int {
	// Find max frame dimensions for padding
	maxW, maxH := 0, 0
	for _, fr := range frames {
		if fr.Width > maxW {
			maxW = fr.Width
		}
		if fr.Height > maxH {
			maxH = fr.Height
		}
	}

	// Add 1px padding between frames
	cellW := maxW + 1
	cellH := maxH + 1

	// Calculate grid layout
	cols := maxAtlasWidth / cellW
	if cols < 1 {
		cols = 1
	}
	if cols > len(frames) {
		cols = len(frames)
	}

	// Split into atlas pages if needed
	maxFramesPerPage := cols * (maxAtlasHeight / cellH)
	if maxFramesPerPage < 1 {
		maxFramesPerPage = 1
	}

	pageCount := int(math.Ceil(float64(len(frames)) / float64(maxFramesPerPage)))
	if pageCount < 1 {
		pageCount = 1
	}

	for page := 0; page < pageCount; page++ {
		startIdx := page * maxFramesPerPage
		endIdx := startIdx + maxFramesPerPage
		if endIdx > len(frames) {
			endIdx = len(frames)
		}
		pageFrames := frames[startIdx:endIdx]

		pageCols := cols
		if pageCols > len(pageFrames) {
			pageCols = len(pageFrames)
		}
		pageRows := int(math.Ceil(float64(len(pageFrames)) / float64(pageCols)))

		atlasW := pageCols * cellW
		atlasH := pageRows * cellH

		atlasImg := image.NewRGBA(image.Rect(0, 0, atlasW, atlasH))

		phaserFrames := make(map[string]AtlasFrame)

		for i, fr := range pageFrames {
			col := i % pageCols
			row := i / pageCols
			x := col * cellW
			y := row * cellH

			// Draw frame onto atlas
			if fr.Image != nil {
				draw.Draw(atlasImg, image.Rect(x, y, x+fr.Width, y+fr.Height),
					fr.Image, image.Point{0, 0}, draw.Over)
			}

			// Frame key: "spr{spriteIndex}_f{frameIndex}"
			key := fmt.Sprintf("spr%d_f%d", fr.SpriteIndex, fr.FrameIndex)
			pvx := 0.5
			pvy := 0.5
			if fr.Width > 0 {
				pvx = float64(fr.PivotX) / float64(fr.Width)
			}
			if fr.Height > 0 {
				pvy = float64(fr.PivotY) / float64(fr.Height)
			}

			phaserFrames[key] = AtlasFrame{
				Frame:            AtlasRect{X: x, Y: y, W: fr.Width, H: fr.Height},
				Rotated:          false,
				Trimmed:          false,
				SpriteSourceSize: AtlasRect{X: 0, Y: 0, W: fr.Width, H: fr.Height},
				SourceSize:       AtlasSize{W: fr.Width, H: fr.Height},
				Pivot:            AtlasPoint{X: pvx, Y: pvy},
			}
		}

		// Determine file names
		suffix := ""
		if pageCount > 1 {
			suffix = fmt.Sprintf("_%d", page)
		}
		pngName := baseName + suffix + ".png"
		jsonName := baseName + suffix + ".json"

		atlas := PhaserAtlas{
			Frames: phaserFrames,
			Meta: AtlasMeta{
				Image:  pngName,
				Format: "RGBA8888",
				Size:   AtlasSize{W: atlasW, H: atlasH},
				Scale:  "1",
			},
		}

		// Save PNG
		pngPath := filepath.Join(outputDir, pngName)
		pngFile, err := os.Create(pngPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "  create PNG %s: %v\n", pngName, err)
			continue
		}
		if err := png.Encode(pngFile, atlasImg); err != nil {
			pngFile.Close()
			fmt.Fprintf(os.Stderr, "  encode PNG %s: %v\n", pngName, err)
			continue
		}
		pngFile.Close()

		// Save JSON
		jsonData, err := json.Marshal(atlas)
		if err != nil {
			fmt.Fprintf(os.Stderr, "  marshal JSON %s: %v\n", jsonName, err)
			continue
		}
		jsonPath := filepath.Join(outputDir, jsonName)
		if err := os.WriteFile(jsonPath, jsonData, 0o644); err != nil {
			fmt.Fprintf(os.Stderr, "  write JSON %s: %v\n", jsonName, err)
			continue
		}
	}

	return pageCount
}

func extractSpriteFrames(f *os.File, fileSize int64, spriteIndex int, offset uint32) ([]extractedFrame, error) {
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

	bmpOffset := int64(offset) + 108 + int64(totalFrames)*12

	bmpImg, colorKey, err := parseBMP(f, fileSize, bmpOffset)
	if err != nil {
		return nil, fmt.Errorf("parse BMP: %w", err)
	}

	var frames []extractedFrame
	for i := int32(0); i < totalFrames; i++ {
		b := brushes[i]
		if b.SZX <= 0 || b.SZY <= 0 {
			// Still add a 1x1 transparent placeholder so frame indices stay consistent
			frames = append(frames, extractedFrame{
				Image:       image.NewRGBA(image.Rect(0, 0, 1, 1)),
				SpriteIndex: spriteIndex,
				FrameIndex:  int(i),
				Width:       1,
				Height:      1,
				PivotX:      0,
				PivotY:      0,
			})
			continue
		}

		frameImg := extractFrame(bmpImg, b, colorKey)
		if frameImg == nil {
			frames = append(frames, extractedFrame{
				Image:       image.NewRGBA(image.Rect(0, 0, 1, 1)),
				SpriteIndex: spriteIndex,
				FrameIndex:  int(i),
				Width:       1,
				Height:      1,
			})
			continue
		}

		frames = append(frames, extractedFrame{
			Image:       frameImg,
			SpriteIndex: spriteIndex,
			FrameIndex:  int(i),
			Width:       int(b.SZX),
			Height:      int(b.SZY),
			PivotX:      int(b.PVX),
			PivotY:      int(b.PVY),
		})
	}

	return frames, nil
}

func parseBMP(f *os.File, fileSize, offset int64) (*image.RGBA, color.RGBA, error) {
	if offset+14 > fileSize {
		return nil, color.RGBA{}, fmt.Errorf("BMP header out of bounds at offset %d", offset)
	}
	if _, err := f.Seek(offset, io.SeekStart); err != nil {
		return nil, color.RGBA{}, fmt.Errorf("seek BMP: %w", err)
	}

	var bfType uint16
	var bfSize uint32
	var bfReserved1, bfReserved2 uint16
	var bfOffBits uint32

	binary.Read(f, binary.LittleEndian, &bfType)
	binary.Read(f, binary.LittleEndian, &bfSize)
	binary.Read(f, binary.LittleEndian, &bfReserved1)
	binary.Read(f, binary.LittleEndian, &bfReserved2)
	binary.Read(f, binary.LittleEndian, &bfOffBits)

	if bfType != 0x4D42 {
		return parseDIB(f, fileSize, offset)
	}

	return parseBMPInfo(f, fileSize, offset+14, offset+int64(bfOffBits))
}

func parseDIB(f *os.File, fileSize, offset int64) (*image.RGBA, color.RGBA, error) {
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

	topDown := biHeight < 0
	absHeight := biHeight
	if absHeight < 0 {
		absHeight = -absHeight
	}
	if absHeight <= 0 || absHeight > 16384 {
		return nil, color.RGBA{}, fmt.Errorf("invalid BMP height: %d", biHeight)
	}

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
			binary.Read(f, binary.LittleEndian, &a)
			palette[i] = color.RGBA{R: r, G: g, B: b, A: 255}
		}
	}

	bitsPerRow := int(biWidth) * int(biBitCount)
	bytesPerRow := (bitsPerRow + 7) / 8
	stride := ((bytesPerRow + 3) / 4) * 4

	if pixelDataOffset > 0 {
		if _, err := f.Seek(pixelDataOffset, io.SeekStart); err != nil {
			return nil, color.RGBA{}, fmt.Errorf("seek pixels: %w", err)
		}
	}

	totalPixelBytes := stride * int(absHeight)
	pixelData := make([]byte, totalPixelBytes)
	n, err := io.ReadFull(f, pixelData)
	if err != nil && n == 0 {
		return nil, color.RGBA{}, fmt.Errorf("read pixels: %w (read %d of %d)", err, n, totalPixelBytes)
	}

	img := image.NewRGBA(image.Rect(0, 0, int(biWidth), int(absHeight)))

	for y := 0; y < int(absHeight); y++ {
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
						c.A = 255
					}
				}
			}

			img.SetRGBA(x, dstY, c)
		}
	}

	colorKey := img.RGBAAt(0, 0)

	return img, colorKey, nil
}

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
				frameImg.SetRGBA(dx, dy, color.RGBA{0, 0, 0, 0})
				continue
			}

			c := bmpImg.RGBAAt(srcX, srcY)

			if !noColorKey && c.R == colorKey.R && c.G == colorKey.G && c.B == colorKey.B {
				frameImg.SetRGBA(dx, dy, color.RGBA{0, 0, 0, 0})
			} else {
				frameImg.SetRGBA(dx, dy, c)
			}
		}
	}

	return frameImg
}
