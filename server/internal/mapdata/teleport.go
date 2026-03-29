package mapdata

// TeleportDest defines a destination for a teleport tile.
type TeleportDest struct {
	DestMap  string
	DestX    int
	DestY    int
	Dir      int // direction player faces after teleport (0 = keep current)
}

// TeleportConfig maps "mapName:x:y" keys to destinations.
// Multiple source tiles can point to the same destination.
type TeleportConfig map[string]TeleportDest

// TeleportKey creates a lookup key for a source tile.
func TeleportKey(mapName string, x, y int) string {
	// Use a simple format: "map:x:y"
	return mapName + ":" + itoa(x) + ":" + itoa(y)
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	neg := false
	if n < 0 {
		neg = true
		n = -n
	}
	buf := [20]byte{}
	i := len(buf)
	for n > 0 {
		i--
		buf[i] = byte('0' + n%10)
		n /= 10
	}
	if neg {
		i--
		buf[i] = '-'
	}
	return string(buf[i:])
}

// NoAttackArea defines a rectangular no-attack zone on a map.
type NoAttackArea struct {
	X1, Y1, X2, Y2 int
}

// BuildNoAttackAreas returns a map of map name to list of rectangular no-attack zones,
// sourced from the C++ no-attack-area config entries.
func BuildNoAttackAreas() map[string][]NoAttackArea {
	areas := map[string][]NoAttackArea{}

	// aresden no-attack areas
	areas["aresden"] = []NoAttackArea{
		{27, 20, 35, 28},
		{252, 20, 264, 29},
		{137, 47, 144, 53},
		{167, 142, 174, 149},
		{65, 122, 72, 129},
		{137, 202, 144, 208},
		{113, 242, 120, 248},
	}

	// elvine no-attack areas
	areas["elvine"] = []NoAttackArea{
		{21, 270, 30, 277},
		{248, 268, 260, 277},
		{137, 47, 144, 53},
		{167, 142, 174, 149},
		{65, 122, 72, 129},
		{137, 202, 144, 208},
		{113, 242, 120, 248},
	}

	// middleland no-attack areas
	areas["middleland"] = []NoAttackArea{
		{147, 495, 158, 503},
		{344, 489, 356, 503},
		{99, 20, 107, 28},
		{309, 20, 320, 28},
	}

	// Buildings are generally safe zones (entire interiors)
	for _, bldg := range []string{
		"cityhall_1", "cityhall_2",
		"bsmith_1", "bsmith_2",
		"wrhus_1", "wrhus_2",
		"gshop_1", "gshop_2",
		"wzdtwr_1", "wzdtwr_2",
		"cath_1", "cath_2",
		"CmdHall_1", "CmdHall_2",
		"arefarm", "elvfarm",
	} {
		areas[bldg] = []NoAttackArea{
			{0, 0, 300, 300},
		}
	}

	return areas
}

// BuildTeleportConfig creates the master teleport table from hardcoded data
// based on the original Helbreath C++ server configuration.
func BuildTeleportConfig() TeleportConfig {
	tc := make(TeleportConfig)

	addRange := func(srcMap string, x1, x2, y1, y2 int, dest TeleportDest) {
		for y := y1; y <= y2; y++ {
			for x := x1; x <= x2; x++ {
				tc[TeleportKey(srcMap, x, y)] = dest
			}
		}
	}

	// ================================================================
	// All coordinates sourced from original C++ Helbreath map configs.
	// ================================================================

	// =====================================================================
	// === ARESDEN (from aresden.txt) ===
	// =====================================================================

	// North exits -> Middleland
	// teleport-loc = middleland 152 496 (tiles 27-35, y=20)
	addRange("aresden", 27, 35, 20, 20, TeleportDest{DestMap: "middleland", DestX: 152, DestY: 496})
	// teleport-loc = middleland 356 497 (tiles 252-264, y=20)
	addRange("aresden", 252, 264, 20, 20, TeleportDest{DestMap: "middleland", DestX: 356, DestY: 497})

	// South exits -> Huntzone1
	addRange("aresden", 26, 39, 279, 279, TeleportDest{DestMap: "huntzone1", DestX: 173, DestY: 23})

	// East exits -> Aresdend1 dungeon
	// teleport-loc = aresdend1 96 39
	addRange("aresden", 279, 279, 203, 211, TeleportDest{DestMap: "aresdend1", DestX: 96, DestY: 39})

	// West exit -> Areuni
	addRange("aresden", 78, 80, 209, 211, TeleportDest{DestMap: "areuni", DestX: 85, DestY: 23})

	// Building entrances (from aresden.txt teleport-loc entries)
	// cityhall_1
	addRange("aresden", 135, 137, 128, 129, TeleportDest{DestMap: "cityhall_1", DestX: 55, DestY: 38})
	addRange("aresden", 145, 146, 122, 123, TeleportDest{DestMap: "cityhall_1", DestX: 55, DestY: 38})

	// bsmith_1: two doors
	// teleport-loc = bsmith_1 34 37 (tiles 167-169, y=194-195)
	addRange("aresden", 167, 169, 194, 195, TeleportDest{DestMap: "bsmith_1", DestX: 34, DestY: 37})
	// teleport-loc = bsmith_1 43 32 (tiles 157-158, y=200-201)
	addRange("aresden", 157, 158, 200, 201, TeleportDest{DestMap: "bsmith_1", DestX: 43, DestY: 32})

	// wrhus_1: teleport-loc = wrhus_1 56 36
	addRange("aresden", 101, 107, 183, 185, TeleportDest{DestMap: "wrhus_1", DestX: 56, DestY: 36})

	// gshop_1: teleport-loc = gshop_1 50 39
	addRange("aresden", 126, 131, 166, 167, TeleportDest{DestMap: "gshop_1", DestX: 50, DestY: 39})

	// cath_1: teleport-loc = cath_1 34 42
	addRange("aresden", 137, 144, 47, 53, TeleportDest{DestMap: "cath_1", DestX: 34, DestY: 42})

	// wzdtwr_1
	addRange("aresden", 55, 57, 117, 118, TeleportDest{DestMap: "wzdtwr_1", DestX: 40, DestY: 29})

	// CmdHall_1: two doors
	// teleport-loc = CmdHall_1 51 50 (tiles 97-98, y=161)
	addRange("aresden", 97, 98, 161, 161, TeleportDest{DestMap: "CmdHall_1", DestX: 51, DestY: 50})
	// teleport-loc = CmdHall_1 40 52 (tiles 91-92, y=155-156)
	addRange("aresden", 91, 92, 155, 156, TeleportDest{DestMap: "CmdHall_1", DestX: 40, DestY: 52})

	// arefarm: teleport-loc = arefarm 23 27
	addRange("aresden", 65, 72, 122, 129, TeleportDest{DestMap: "arefarm", DestX: 23, DestY: 27})

	// =====================================================================
	// === ELVINE (from elvine.txt) ===
	// =====================================================================

	// South exits -> Middleland
	// teleport-loc = middleland 103 26 (tiles 21-26, y=277)
	addRange("elvine", 21, 26, 277, 277, TeleportDest{DestMap: "middleland", DestX: 103, DestY: 26})
	// teleport-loc = middleland 314 27 (tiles 250-257, y=274)
	addRange("elvine", 250, 257, 274, 274, TeleportDest{DestMap: "middleland", DestX: 314, DestY: 27})

	// North exits -> Huntzone2
	addRange("elvine", 218, 230, 20, 20, TeleportDest{DestMap: "huntzone2", DestX: 70, DestY: 23})

	// East exits -> Elvined1 dungeon
	// teleport-loc = elvined1 106 160
	addRange("elvine", 277, 277, 192, 199, TeleportDest{DestMap: "elvined1", DestX: 106, DestY: 160})

	// West exit -> Elvuni
	addRange("elvine", 258, 260, 81, 83, TeleportDest{DestMap: "elvuni", DestX: 173, DestY: 23})

	// Building entrances (from elvine.txt teleport-loc entries)
	// cityhall_2
	addRange("elvine", 135, 137, 132, 133, TeleportDest{DestMap: "cityhall_2", DestX: 55, DestY: 38})
	addRange("elvine", 144, 146, 126, 127, TeleportDest{DestMap: "cityhall_2", DestX: 55, DestY: 38})

	// bsmith_2: two doors
	// teleport-loc = bsmith_2 34 37 (tiles 239-241, y=106-107)
	addRange("elvine", 239, 241, 106, 107, TeleportDest{DestMap: "bsmith_2", DestX: 34, DestY: 37})
	// teleport-loc = bsmith_2 43 32 (tiles 229-230, y=112-113)
	addRange("elvine", 229, 230, 112, 113, TeleportDest{DestMap: "bsmith_2", DestX: 43, DestY: 32})

	// wrhus_2: teleport-loc = wrhus_2 56 36
	addRange("elvine", 197, 203, 127, 129, TeleportDest{DestMap: "wrhus_2", DestX: 56, DestY: 36})

	// gshop_2: teleport-loc = gshop_2 50 39
	addRange("elvine", 225, 230, 151, 152, TeleportDest{DestMap: "gshop_2", DestX: 50, DestY: 39})

	// cath_2: teleport-loc = cath_2 40 40
	addRange("elvine", 137, 144, 47, 53, TeleportDest{DestMap: "cath_2", DestX: 40, DestY: 40})

	// wzdtwr_2
	addRange("elvine", 180, 181, 76, 77, TeleportDest{DestMap: "wzdtwr_2", DestX: 40, DestY: 29})

	// CmdHall_2: two doors
	// teleport-loc = CmdHall_2 51 50
	addRange("elvine", 216, 217, 89, 89, TeleportDest{DestMap: "CmdHall_2", DestX: 51, DestY: 50})
	// teleport-loc = CmdHall_2 40 52
	addRange("elvine", 210, 211, 83, 84, TeleportDest{DestMap: "CmdHall_2", DestX: 40, DestY: 52})

	// elvfarm: teleport-loc = elvfarm 23 149
	addRange("elvine", 87, 93, 174, 176, TeleportDest{DestMap: "elvfarm", DestX: 23, DestY: 149})

	// =====================================================================
	// === MIDDLELAND (from middleland.txt) ===
	// =====================================================================

	// South exits -> Aresden
	// teleport-loc = aresden 31 28 (tiles 147-158, y=503)
	addRange("middleland", 147, 158, 503, 503, TeleportDest{DestMap: "aresden", DestX: 31, DestY: 28})
	// teleport-loc = aresden 256 26 (tiles 344-356, y=503)
	addRange("middleland", 344, 356, 503, 503, TeleportDest{DestMap: "aresden", DestX: 256, DestY: 26})

	// North exits -> Elvine
	// teleport-loc = elvine 27 271 (tiles 99-107, y=20)
	addRange("middleland", 99, 107, 20, 20, TeleportDest{DestMap: "elvine", DestX: 27, DestY: 271})
	// teleport-loc = elvine 254 267 (tiles 309-320, y=20)
	addRange("middleland", 309, 320, 20, 20, TeleportDest{DestMap: "elvine", DestX: 254, DestY: 267})

	// Dungeon entrance -> middled1x
	// teleport-loc = middled1x 70 108
	addRange("middleland", 199, 200, 234, 235, TeleportDest{DestMap: "middled1x", DestX: 70, DestY: 108})

	// Tower of Helbreath entrance
	// teleport-loc = toh1 145 31
	addRange("middleland", 268, 270, 125, 127, TeleportDest{DestMap: "toh1", DestX: 145, DestY: 31})

	// Icebound entrance
	// teleport-loc = icebound 264 260
	addRange("middleland", 452, 453, 281, 282, TeleportDest{DestMap: "icebound", DestX: 264, DestY: 260})

	// Internal loops within middleland
	// (179,290) -> (237,174) and back
	addRange("middleland", 178, 180, 289, 291, TeleportDest{DestMap: "middleland", DestX: 237, DestY: 174})
	addRange("middleland", 236, 238, 173, 175, TeleportDest{DestMap: "middleland", DestX: 179, DestY: 290})

	// East dungeon entrances
	addRange("middleland", 386, 387, 277, 278, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})

	// =====================================================================
	// === 2NDMIDDLE (secondary continent) ===
	// =====================================================================
	addRange("2ndmiddle", 121, 131, 21, 21, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("2ndmiddle", 135, 146, 228, 228, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// =====================================================================
	// === HUNT ZONES ===
	// =====================================================================

	// Huntzone1: north -> middleland, west -> huntzone4, south -> aresden
	addRange("huntzone1", 171, 176, 20, 20, TeleportDest{DestMap: "middleland", DestX: 152, DestY: 497})
	addRange("huntzone1", 20, 20, 48, 56, TeleportDest{DestMap: "huntzone4", DestX: 176, DestY: 95})
	addRange("huntzone1", 115, 116, 114, 115, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})
	addRange("huntzone1", 44, 58, 179, 179, TeleportDest{DestMap: "aresden", DestX: 32, DestY: 275})

	// Huntzone2: north -> elvine, east -> huntzone3, south -> middleland
	addRange("huntzone2", 66, 74, 20, 20, TeleportDest{DestMap: "elvine", DestX: 224, DestY: 23})
	addRange("huntzone2", 179, 179, 100, 104, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})
	// teleport-loc to aresdend1/elvined1 from huntzone2
	addRange("huntzone2", 103, 104, 106, 107, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	addRange("huntzone2", 110, 122, 179, 179, TeleportDest{DestMap: "middleland", DestX: 314, DestY: 23})

	// Huntzone3 -> middleland
	addRange("huntzone3", 45, 50, 168, 168, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// Huntzone4 -> huntzone1
	addRange("huntzone4", 20, 20, 91, 99, TeleportDest{DestMap: "huntzone1", DestX: 23, DestY: 52})

	// =====================================================================
	// === DUNGEONS ===
	// =====================================================================

	// --- Aresdend1 (Aresden dungeon, from aresdend1.txt) ---
	// Exit to aresden: teleport-loc = aresden 79 205
	addRange("aresdend1", 37, 39, 33, 34, TeleportDest{DestMap: "aresden", DestX: 79, DestY: 205})
	// To dglv2: teleport-loc = dglv2 464 460
	addRange("aresdend1", 99, 100, 38, 39, TeleportDest{DestMap: "dglv2", DestX: 464, DestY: 460})
	// To huntzone2: teleport-loc = huntzone2 102 105
	addRange("aresdend1", 97, 99, 85, 86, TeleportDest{DestMap: "huntzone2", DestX: 102, DestY: 105})
	// To catacombs: teleport-loc = catacombs 145 97
	addRange("aresdend1", 72, 73, 112, 113, TeleportDest{DestMap: "catacombs", DestX: 145, DestY: 97})
	// Additional dglv2/dglv4 exits
	addRange("aresdend1", 96, 97, 128, 129, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})

	// --- Elvined1 (Elvine dungeon, from elvined1.txt) ---
	// Exit to elvine: teleport-loc = elvine 258 78
	addRange("elvined1", 96, 97, 40, 41, TeleportDest{DestMap: "elvine", DestX: 258, DestY: 78})
	// To dglv2: teleport-loc = dglv2 35 38
	addRange("elvined1", 85, 87, 93, 94, TeleportDest{DestMap: "dglv2", DestX: 35, DestY: 38})
	// To huntzone2: teleport-loc = huntzone2 41 87
	addRange("elvined1", 103, 105, 157, 158, TeleportDest{DestMap: "huntzone2", DestX: 41, DestY: 87})

	// --- Middled1n (middleland dungeon north) ---
	addRange("middled1n", 31, 33, 33, 34, TeleportDest{DestMap: "middleland", DestX: 200, DestY: 237})
	addRange("middled1n", 183, 185, 122, 123, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})

	// --- Middled1x (middleland dungeon exit) ---
	addRange("middled1x", 67, 69, 105, 106, TeleportDest{DestMap: "middleland", DestX: 200, DestY: 237})

	// --- Catacombs ---
	addRange("catacombs", 143, 146, 94, 95, TeleportDest{DestMap: "aresdend1", DestX: 73, DestY: 115})
	addRange("catacombs", 50, 52, 175, 176, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})

	// =====================================================================
	// === DEEP DUNGEONS (dglv2-4, from dglv2.txt, dglv3.txt, dglv4.txt) ===
	// =====================================================================

	// --- dglv2 - many exits ---
	// To aresdend1: teleport-loc = aresdend1 39 35
	addRange("dglv2", 210, 211, 108, 109, TeleportDest{DestMap: "aresdend1", DestX: 39, DestY: 35})
	// To elvined1: teleport-loc = elvined1 95 42
	addRange("dglv2", 271, 273, 225, 226, TeleportDest{DestMap: "elvined1", DestX: 95, DestY: 42})
	// To middled1n
	addRange("dglv2", 31, 33, 37, 38, TeleportDest{DestMap: "middled1n", DestX: 33, DestY: 36})
	// To dglv3: teleport-loc = dglv3 187 212
	addRange("dglv2", 180, 181, 38, 39, TeleportDest{DestMap: "dglv3", DestX: 187, DestY: 212})
	addRange("dglv2", 157, 157, 85, 89, TeleportDest{DestMap: "dglv3", DestX: 343, DestY: 194})
	addRange("dglv2", 37, 39, 173, 174, TeleportDest{DestMap: "dglv3", DestX: 61, DestY: 246})
	addRange("dglv2", 80, 81, 195, 198, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("dglv2", 210, 211, 256, 257, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("dglv2", 438, 439, 342, 343, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	// To dglv4
	addRange("dglv2", 122, 122, 190, 194, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv2", 228, 229, 256, 257, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv2", 234, 235, 398, 399, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	// To middleland
	addRange("dglv2", 364, 371, 253, 253, TeleportDest{DestMap: "middleland", DestX: 388, DestY: 280})
	addRange("dglv2", 465, 466, 458, 459, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// To middled1x
	addRange("dglv2", 211, 213, 285, 286, TeleportDest{DestMap: "middled1x", DestX: 70, DestY: 108})
	// To huntzone3
	addRange("dglv2", 264, 265, 256, 257, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})

	// --- dglv3 ---
	// To dglv2: teleport-loc = dglv2 226 258
	addRange("dglv3", 192, 193, 87, 88, TeleportDest{DestMap: "dglv2", DestX: 226, DestY: 258})
	addRange("dglv3", 189, 190, 210, 211, TeleportDest{DestMap: "dglv2", DestX: 40, DestY: 176})
	addRange("dglv3", 60, 61, 243, 244, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	// To dglv4: three exits
	addRange("dglv3", 342, 343, 191, 192, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv3", 100, 101, 300, 301, TeleportDest{DestMap: "dglv4", DestX: 340, DestY: 232})
	addRange("dglv3", 250, 251, 350, 351, TeleportDest{DestMap: "dglv4", DestX: 64, DestY: 240})

	// --- dglv4 ---
	// To dglv3: three exits
	addRange("dglv4", 207, 208, 93, 94, TeleportDest{DestMap: "dglv3", DestX: 343, DestY: 194})
	addRange("dglv4", 339, 340, 229, 230, TeleportDest{DestMap: "dglv3", DestX: 101, DestY: 303})
	addRange("dglv4", 63, 64, 237, 238, TeleportDest{DestMap: "dglv3", DestX: 251, DestY: 353})

	// =====================================================================
	// === TOWER OF HELBREATH (toh1-3) ===
	// =====================================================================

	// toh1 (floor 1)
	addRange("toh1", 146, 147, 29, 30, TeleportDest{DestMap: "toh2", DestX: 274, DestY: 29})
	addRange("toh1", 218, 219, 213, 214, TeleportDest{DestMap: "middleland", DestX: 269, DestY: 128})
	addRange("toh1", 37, 38, 218, 219, TeleportDest{DestMap: "middleland", DestX: 269, DestY: 128})
	// toh2 (floor 2)
	addRange("toh2", 273, 274, 26, 27, TeleportDest{DestMap: "toh3", DestX: 148, DestY: 33})
	addRange("toh2", 40, 41, 36, 37, TeleportDest{DestMap: "toh1", DestX: 147, DestY: 32})
	addRange("toh2", 252, 253, 240, 241, TeleportDest{DestMap: "toh1", DestX: 147, DestY: 32})
	addRange("toh2", 102, 103, 268, 269, TeleportDest{DestMap: "middleland", DestX: 269, DestY: 128})
	// toh3 (floor 3)
	addRange("toh3", 147, 148, 30, 31, TeleportDest{DestMap: "middleland", DestX: 269, DestY: 128})
	addRange("toh3", 93, 94, 38, 39, TeleportDest{DestMap: "toh2", DestX: 42, DestY: 39})
	addRange("toh3", 40, 41, 248, 249, TeleportDest{DestMap: "toh2", DestX: 42, DestY: 39})

	// =====================================================================
	// === ICEBOUND ===
	// =====================================================================
	addRange("icebound", 260, 269, 264, 264, TeleportDest{DestMap: "middleland", DestX: 453, DestY: 282})

	// =====================================================================
	// === BUILDING EXITS ===
	// =====================================================================

	// --- Cityhall 1 -> Aresden ---
	addRange("cityhall_1", 58, 59, 41, 42, TeleportDest{DestMap: "aresden", DestX: 136, DestY: 131})

	// --- Cityhall 2 -> Elvine ---
	addRange("cityhall_2", 58, 59, 41, 42, TeleportDest{DestMap: "elvine", DestX: 136, DestY: 135})

	// --- Blacksmith 1 -> Aresden ---
	// Exit door 1: teleport-loc = aresden 171 197
	addRange("bsmith_1", 32, 33, 34, 35, TeleportDest{DestMap: "aresden", DestX: 171, DestY: 197})
	// Exit door 2: teleport-loc = aresden 154 203
	addRange("bsmith_1", 43, 44, 29, 30, TeleportDest{DestMap: "aresden", DestX: 154, DestY: 203})

	// --- Blacksmith 2 -> Elvine ---
	// Exit door 1: teleport-loc = elvine 244 110
	addRange("bsmith_2", 32, 33, 34, 35, TeleportDest{DestMap: "elvine", DestX: 244, DestY: 110})
	// Exit door 2: teleport-loc = elvine 227 116
	addRange("bsmith_2", 43, 44, 29, 30, TeleportDest{DestMap: "elvine", DestX: 227, DestY: 116})

	// --- General Shop 1 -> Aresden ---
	// teleport-loc = aresden 128 169
	addRange("gshop_1", 49, 51, 36, 37, TeleportDest{DestMap: "aresden", DestX: 128, DestY: 169})
	addRange("gshop_1", 58, 59, 34, 34, TeleportDest{DestMap: "aresden", DestX: 128, DestY: 169})

	// --- General Shop 2 -> Elvine ---
	// teleport-loc = elvine 222 155
	addRange("gshop_2", 49, 51, 36, 37, TeleportDest{DestMap: "elvine", DestX: 222, DestY: 155})
	addRange("gshop_2", 58, 59, 34, 34, TeleportDest{DestMap: "elvine", DestX: 222, DestY: 155})

	// --- Warehouse 1 -> Aresden (wrhus_1.txt) ---
	// Exit door 1: teleport-loc = aresden 106 186
	addRange("wrhus_1", 53, 55, 33, 34, TeleportDest{DestMap: "aresden", DestX: 106, DestY: 186})
	// Exit door 2: teleport-loc = aresden 96 180
	addRange("wrhus_1", 61, 61, 34, 35, TeleportDest{DestMap: "aresden", DestX: 96, DestY: 180})

	// --- Warehouse 2 -> Elvine (wrhus_2.txt) ---
	// Exit door 1: teleport-loc = elvine 202 132
	addRange("wrhus_2", 53, 55, 33, 34, TeleportDest{DestMap: "elvine", DestX: 202, DestY: 132})
	// Exit door 2: teleport-loc = elvine 195 126
	addRange("wrhus_2", 61, 61, 34, 35, TeleportDest{DestMap: "elvine", DestX: 195, DestY: 126})

	// --- Legacy warehouse names (same layout) ---
	addRange("arewrhus", 53, 55, 33, 34, TeleportDest{DestMap: "aresden", DestX: 106, DestY: 186})
	addRange("arewrhus", 61, 61, 34, 35, TeleportDest{DestMap: "aresden", DestX: 96, DestY: 180})
	addRange("elvwrhus", 53, 55, 33, 34, TeleportDest{DestMap: "elvine", DestX: 202, DestY: 132})
	addRange("elvwrhus", 61, 61, 34, 35, TeleportDest{DestMap: "elvine", DestX: 195, DestY: 126})

	// --- Wizard Tower 1 -> Aresden ---
	addRange("wzdtwr_1", 40, 41, 32, 33, TeleportDest{DestMap: "aresden", DestX: 56, DestY: 120})

	// --- Wizard Tower 2 -> Elvine ---
	addRange("wzdtwr_2", 40, 41, 32, 33, TeleportDest{DestMap: "elvine", DestX: 181, DestY: 79})

	// --- Cathedral 1 -> Aresden (initial-point from aresden.txt: 170,146) ---
	addRange("cath_1", 36, 38, 38, 40, TeleportDest{DestMap: "aresden", DestX: 170, DestY: 146})

	// --- Cathedral 2 -> Elvine (initial-point from elvine.txt: 170,146) ---
	addRange("cath_2", 36, 38, 38, 40, TeleportDest{DestMap: "elvine", DestX: 170, DestY: 146})

	// --- CmdHall_1 -> Aresden ---
	// Exit door 1: teleport-loc = aresden 97 161
	addRange("CmdHall_1", 49, 51, 47, 48, TeleportDest{DestMap: "aresden", DestX: 97, DestY: 161})
	// Exit door 2: teleport-loc = aresden 98 161
	addRange("CmdHall_1", 38, 40, 49, 50, TeleportDest{DestMap: "aresden", DestX: 98, DestY: 161})

	// --- CmdHall_2 -> Elvine ---
	// Exit: teleport-loc = elvine 216 89
	addRange("CmdHall_2", 49, 51, 47, 48, TeleportDest{DestMap: "elvine", DestX: 216, DestY: 89})
	addRange("CmdHall_2", 38, 40, 49, 50, TeleportDest{DestMap: "elvine", DestX: 216, DestY: 89})

	// --- Whouse -> Aresden ---
	addRange("whouse", 40, 41, 38, 39, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	addRange("whouse", 52, 53, 38, 39, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})

	// --- Whouse2 -> Elvine ---
	addRange("whouse2", 40, 41, 38, 39, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})
	addRange("whouse2", 52, 53, 38, 39, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})

	// --- Arefarm -> Aresden ---
	addRange("arefarm", 20, 25, 24, 29, TeleportDest{DestMap: "aresden", DestX: 68, DestY: 125})

	// --- Elvfarm -> Elvine ---
	addRange("elvfarm", 20, 25, 146, 151, TeleportDest{DestMap: "elvine", DestX: 90, DestY: 177})

	// =====================================================================
	// === UNIVERSITIES ===
	// =====================================================================
	// Areuni -> Aresden
	addRange("areuni", 78, 95, 20, 20, TeleportDest{DestMap: "aresden", DestX: 80, DestY: 212})
	// Elvuni -> Elvine
	addRange("elvuni", 176, 176, 20, 28, TeleportDest{DestMap: "elvine", DestX: 260, DestY: 84})

	// =====================================================================
	// === BARRACKS ===
	// =====================================================================
	addRange("ABarracks", 38, 39, 29, 30, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("EBarracks", 38, 39, 29, 30, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("MBarracks", 64, 65, 32, 33, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("MBarracks", 82, 83, 100, 101, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// =====================================================================
	// === RESURRECTION CHAMBERS ===
	// =====================================================================
	addRange("resurr1", 38, 39, 33, 34, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr1", 158, 159, 33, 34, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr1", 38, 39, 113, 114, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr1", 158, 159, 113, 114, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr2", 38, 39, 33, 34, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("resurr2", 158, 159, 33, 34, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("resurr2", 38, 39, 113, 114, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("resurr2", 158, 159, 113, 114, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})

	// =====================================================================
	// === CITY MAP ===
	// =====================================================================
	addRange("city", 84, 87, 79, 79, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("city", 290, 293, 407, 407, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// =====================================================================
	// === MARKET ===
	// =====================================================================
	addRange("market", 106, 106, 79, 80, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})

	// =====================================================================
	// === COUNTER ===
	// =====================================================================
	addRange("Counter", 103, 104, 59, 60, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// =====================================================================
	// === MAPAVIP ===
	// =====================================================================
	addRange("MapaVip", 53, 55, 143, 144, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// =====================================================================
	// === WORLD MAP / EVENTS ===
	// =====================================================================
	addRange("WorldMap", 34, 36, 116, 117, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("WorldMap", 71, 73, 116, 117, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("evento13", 34, 36, 116, 117, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("evento13", 71, 73, 116, 117, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("evento14", 34, 36, 116, 117, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("evento14", 71, 73, 116, 117, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	// ArGEvent
	addRange("ArGEvent", 37, 37, 25, 26, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 65, 65, 26, 27, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 58, 60, 27, 27, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 54, 54, 28, 29, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 97, 98, 36, 37, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 36, 37, 55, 55, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 24, 24, 56, 57, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("ArGEvent", 53, 53, 58, 59, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// NewEvent
	addRange("NewEvent", 139, 142, 211, 215, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("NewEvent", 193, 196, 211, 215, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// =====================================================================
	// === DEFAULT MAP -> CITIES ===
	// =====================================================================
	// C++ default.txt routes through cathedrals -> "lost" map, but we skip that.
	// Go directly to cities using initial-point coordinates.
	addRange("default", 80, 82, 75, 76, TeleportDest{DestMap: "aresden", DestX: 170, DestY: 146})
	addRange("default", 127, 129, 78, 79, TeleportDest{DestMap: "elvine", DestX: 170, DestY: 146})

	return tc
}
