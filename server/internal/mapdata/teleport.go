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

// BuildTeleportConfig creates the master teleport table from hardcoded data
// based on the original Helbreath server configuration.
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
	// All coordinates sourced from actual AMD teleport tile data.
	// ================================================================

	// === ARESDEN ===
	// North exits -> Middleland
	addRange("aresden", 27, 35, 20, 20, TeleportDest{DestMap: "middleland", DestX: 152, DestY: 500})
	addRange("aresden", 258, 266, 20, 20, TeleportDest{DestMap: "middleland", DestX: 353, DestY: 500})
	// South exits -> Huntzone1
	addRange("aresden", 26, 39, 279, 279, TeleportDest{DestMap: "huntzone1", DestX: 173, DestY: 23})
	// East exits -> Aresdend1 dungeon
	addRange("aresden", 279, 279, 203, 211, TeleportDest{DestMap: "aresdend1", DestX: 40, DestY: 36})
	// West exit -> Areuni
	addRange("aresden", 78, 80, 209, 211, TeleportDest{DestMap: "areuni", DestX: 85, DestY: 23})
	// Building entrances
	addRange("aresden", 135, 137, 128, 129, TeleportDest{DestMap: "cityhall_1", DestX: 55, DestY: 38})
	addRange("aresden", 145, 146, 122, 123, TeleportDest{DestMap: "cityhall_1", DestX: 55, DestY: 38})
	addRange("aresden", 167, 169, 194, 195, TeleportDest{DestMap: "bsmith_1", DestX: 34, DestY: 31})
	addRange("aresden", 157, 158, 200, 201, TeleportDest{DestMap: "bsmith_1", DestX: 43, DestY: 26})
	addRange("aresden", 101, 107, 183, 185, TeleportDest{DestMap: "arewrhus", DestX: 54, DestY: 30})
	addRange("aresden", 217, 223, 132, 134, TeleportDest{DestMap: "arewrhus", DestX: 54, DestY: 30})
	addRange("aresden", 55, 57, 117, 118, TeleportDest{DestMap: "wzdtwr_1", DestX: 40, DestY: 29})
	addRange("aresden", 126, 131, 166, 167, TeleportDest{DestMap: "gshop_1", DestX: 50, DestY: 33})

	// === ELVINE ===
	// South exits -> Middleland
	addRange("elvine", 21, 26, 277, 277, TeleportDest{DestMap: "middleland", DestX: 103, DestY: 23})
	addRange("elvine", 250, 257, 274, 274, TeleportDest{DestMap: "middleland", DestX: 314, DestY: 23})
	// North exits -> Huntzone2
	addRange("elvine", 218, 230, 20, 20, TeleportDest{DestMap: "huntzone2", DestX: 70, DestY: 23})
	// East exits -> Elvined1 dungeon
	addRange("elvine", 277, 277, 192, 199, TeleportDest{DestMap: "elvined1", DestX: 97, DestY: 43})
	// West exit -> Elvuni
	addRange("elvine", 258, 260, 81, 83, TeleportDest{DestMap: "elvuni", DestX: 173, DestY: 23})
	// Building entrances
	addRange("elvine", 135, 137, 132, 133, TeleportDest{DestMap: "cityhall_2", DestX: 55, DestY: 38})
	addRange("elvine", 144, 146, 126, 127, TeleportDest{DestMap: "cityhall_2", DestX: 55, DestY: 38})
	addRange("elvine", 239, 241, 106, 107, TeleportDest{DestMap: "bsmith_2", DestX: 34, DestY: 31})
	addRange("elvine", 229, 230, 112, 113, TeleportDest{DestMap: "bsmith_2", DestX: 43, DestY: 26})
	addRange("elvine", 197, 203, 127, 129, TeleportDest{DestMap: "elvwrhus", DestX: 54, DestY: 30})
	addRange("elvine", 87, 93, 174, 176, TeleportDest{DestMap: "elvwrhus", DestX: 54, DestY: 30})
	addRange("elvine", 180, 181, 76, 77, TeleportDest{DestMap: "wzdtwr_2", DestX: 40, DestY: 29})
	addRange("elvine", 225, 230, 151, 152, TeleportDest{DestMap: "gshop_2", DestX: 50, DestY: 33})

	// === MIDDLELAND ===
	// South exits -> Aresden
	addRange("middleland", 147, 158, 503, 503, TeleportDest{DestMap: "aresden", DestX: 31, DestY: 28})
	addRange("middleland", 344, 356, 503, 503, TeleportDest{DestMap: "aresden", DestX: 259, DestY: 23})
	// North exits -> Elvine
	addRange("middleland", 99, 107, 20, 20, TeleportDest{DestMap: "elvine", DestX: 27, DestY: 271})
	addRange("middleland", 309, 320, 20, 20, TeleportDest{DestMap: "elvine", DestX: 254, DestY: 267})
	// Dungeon entrance -> middled1x
	addRange("middleland", 199, 200, 234, 235, TeleportDest{DestMap: "middled1x", DestX: 70, DestY: 108})
	// East dungeon entrances
	addRange("middleland", 386, 387, 277, 278, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	addRange("middleland", 452, 453, 281, 282, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})

	// === 2NDMIDDLE (secondary continent) ===
	// North exit
	addRange("2ndmiddle", 121, 131, 21, 21, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// South exit
	addRange("2ndmiddle", 135, 146, 228, 228, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// === HUNT ZONES ===
	// Huntzone1: north -> middleland, west -> huntzone4, south -> aresden
	addRange("huntzone1", 171, 176, 20, 20, TeleportDest{DestMap: "middleland", DestX: 152, DestY: 497})
	addRange("huntzone1", 20, 20, 48, 56, TeleportDest{DestMap: "huntzone4", DestX: 176, DestY: 95})
	addRange("huntzone1", 115, 116, 114, 115, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})
	addRange("huntzone1", 44, 58, 179, 179, TeleportDest{DestMap: "aresden", DestX: 32, DestY: 275})
	// Huntzone2: north -> elvine, east -> huntzone3, south -> middleland
	addRange("huntzone2", 66, 74, 20, 20, TeleportDest{DestMap: "elvine", DestX: 224, DestY: 23})
	addRange("huntzone2", 179, 179, 100, 104, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})
	addRange("huntzone2", 103, 104, 106, 107, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	addRange("huntzone2", 110, 122, 179, 179, TeleportDest{DestMap: "middleland", DestX: 314, DestY: 23})
	// Huntzone3 -> middleland
	addRange("huntzone3", 45, 50, 168, 168, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// Huntzone4 -> huntzone1
	addRange("huntzone4", 20, 20, 91, 99, TeleportDest{DestMap: "huntzone1", DestX: 23, DestY: 52})

	// === DUNGEONS ===
	// Aresdend1 (Aresden dungeon)
	addRange("aresdend1", 37, 39, 33, 34, TeleportDest{DestMap: "aresden", DestX: 277, DestY: 206})
	addRange("aresdend1", 99, 100, 38, 39, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	addRange("aresdend1", 97, 99, 85, 86, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("aresdend1", 72, 73, 112, 113, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	addRange("aresdend1", 96, 97, 128, 129, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	// Elvined1 (Elvine dungeon)
	addRange("elvined1", 96, 97, 40, 41, TeleportDest{DestMap: "elvine", DestX: 274, DestY: 195})
	addRange("elvined1", 85, 87, 93, 94, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	addRange("elvined1", 103, 105, 157, 158, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	// Middled1n (middleland dungeon north)
	addRange("middled1n", 31, 33, 33, 34, TeleportDest{DestMap: "middleland", DestX: 200, DestY: 237})
	addRange("middled1n", 183, 185, 122, 123, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	// Middled1x (middleland dungeon exit)
	addRange("middled1x", 67, 69, 105, 106, TeleportDest{DestMap: "middleland", DestX: 200, DestY: 237})

	// === DEEP DUNGEONS (dglv2-4) ===
	// dglv2 - many exits (large dungeon with multiple connections)
	addRange("dglv2", 31, 33, 37, 38, TeleportDest{DestMap: "middled1n", DestX: 33, DestY: 36})
	addRange("dglv2", 180, 181, 38, 39, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("dglv2", 157, 157, 85, 89, TeleportDest{DestMap: "dglv3", DestX: 343, DestY: 194})
	addRange("dglv2", 210, 211, 108, 109, TeleportDest{DestMap: "aresdend1", DestX: 100, DestY: 41})
	addRange("dglv2", 37, 39, 173, 174, TeleportDest{DestMap: "dglv3", DestX: 61, DestY: 246})
	addRange("dglv2", 122, 122, 190, 194, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv2", 80, 81, 195, 198, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("dglv2", 271, 273, 225, 226, TeleportDest{DestMap: "elvined1", DestX: 86, DestY: 96})
	addRange("dglv2", 364, 371, 253, 253, TeleportDest{DestMap: "middleland", DestX: 388, DestY: 280})
	addRange("dglv2", 210, 211, 256, 257, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("dglv2", 228, 229, 256, 257, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv2", 264, 265, 256, 257, TeleportDest{DestMap: "huntzone3", DestX: 47, DestY: 165})
	addRange("dglv2", 211, 213, 285, 286, TeleportDest{DestMap: "middled1x", DestX: 70, DestY: 108})
	addRange("dglv2", 438, 439, 342, 343, TeleportDest{DestMap: "dglv3", DestX: 193, DestY: 90})
	addRange("dglv2", 234, 235, 398, 399, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv2", 465, 466, 458, 459, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// dglv3
	addRange("dglv3", 192, 193, 87, 88, TeleportDest{DestMap: "dglv2", DestX: 181, DestY: 41})
	addRange("dglv3", 342, 343, 191, 192, TeleportDest{DestMap: "dglv4", DestX: 208, DestY: 96})
	addRange("dglv3", 189, 190, 210, 211, TeleportDest{DestMap: "dglv2", DestX: 40, DestY: 176})
	addRange("dglv3", 60, 61, 243, 244, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})
	// dglv4
	addRange("dglv4", 207, 208, 93, 94, TeleportDest{DestMap: "dglv3", DestX: 343, DestY: 194})
	addRange("dglv4", 339, 340, 229, 230, TeleportDest{DestMap: "dglv2", DestX: 123, DestY: 193})
	addRange("dglv4", 63, 64, 237, 238, TeleportDest{DestMap: "dglv2", DestX: 33, DestY: 40})

	// === TOWER OF HELBREATH ===
	// Toh1 (floor 1)
	addRange("Toh1", 146, 147, 29, 30, TeleportDest{DestMap: "Toh2", DestX: 274, DestY: 29})
	addRange("Toh1", 218, 219, 213, 214, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("Toh1", 37, 38, 218, 219, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// Toh2 (floor 2)
	addRange("Toh2", 273, 274, 26, 27, TeleportDest{DestMap: "Toh3", DestX: 148, DestY: 33})
	addRange("Toh2", 40, 41, 36, 37, TeleportDest{DestMap: "Toh1", DestX: 147, DestY: 32})
	addRange("Toh2", 252, 253, 240, 241, TeleportDest{DestMap: "Toh1", DestX: 147, DestY: 32})
	addRange("Toh2", 102, 103, 268, 269, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	// Toh3 (floor 3)
	addRange("Toh3", 147, 148, 30, 31, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("Toh3", 93, 94, 38, 39, TeleportDest{DestMap: "Toh2", DestX: 42, DestY: 39})
	addRange("Toh3", 40, 41, 248, 249, TeleportDest{DestMap: "Toh2", DestX: 42, DestY: 39})

	// === BUILDING EXITS ===
	// Cityhall 1 -> Aresden
	addRange("cityhall_1", 58, 59, 41, 42, TeleportDest{DestMap: "aresden", DestX: 136, DestY: 131})
	// Cityhall 2 -> Elvine
	addRange("cityhall_2", 58, 59, 41, 42, TeleportDest{DestMap: "elvine", DestX: 136, DestY: 135})
	// Blacksmith 1 -> Aresden
	addRange("bsmith_1", 32, 33, 34, 35, TeleportDest{DestMap: "aresden", DestX: 168, DestY: 197})
	addRange("bsmith_1", 43, 44, 29, 30, TeleportDest{DestMap: "aresden", DestX: 158, DestY: 203})
	// Blacksmith 2 -> Elvine
	addRange("bsmith_2", 32, 33, 34, 35, TeleportDest{DestMap: "elvine", DestX: 240, DestY: 109})
	addRange("bsmith_2", 43, 44, 29, 30, TeleportDest{DestMap: "elvine", DestX: 230, DestY: 115})
	// General Shop 1 -> Aresden
	addRange("gshop_1", 49, 51, 36, 37, TeleportDest{DestMap: "aresden", DestX: 129, DestY: 169})
	addRange("gshop_1", 58, 59, 34, 34, TeleportDest{DestMap: "aresden", DestX: 129, DestY: 169})
	// General Shop 2 -> Elvine
	addRange("gshop_2", 49, 51, 36, 37, TeleportDest{DestMap: "elvine", DestX: 228, DestY: 154})
	addRange("gshop_2", 58, 59, 34, 34, TeleportDest{DestMap: "elvine", DestX: 228, DestY: 154})
	// Warehouse Aresden -> Aresden
	addRange("arewrhus", 53, 55, 33, 34, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	addRange("arewrhus", 61, 61, 34, 35, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	// Warehouse Elvine -> Elvine
	addRange("elvwrhus", 53, 55, 33, 34, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})
	addRange("elvwrhus", 61, 61, 34, 35, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})
	// Wrhus_1 -> Aresden (same layout as arewrhus)
	addRange("wrhus_1", 53, 55, 33, 34, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	addRange("wrhus_1", 61, 61, 34, 35, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	// Wrhus_2 -> Elvine
	addRange("wrhus_2", 53, 55, 33, 34, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})
	addRange("wrhus_2", 61, 61, 34, 35, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})
	// Wizard Tower 1 -> Aresden
	addRange("wzdtwr_1", 40, 41, 32, 33, TeleportDest{DestMap: "aresden", DestX: 56, DestY: 120})
	// Wizard Tower 2 -> Elvine
	addRange("wzdtwr_2", 40, 41, 32, 33, TeleportDest{DestMap: "elvine", DestX: 181, DestY: 79})
	// Cathedral 1 -> Aresden
	addRange("cath_1", 36, 38, 38, 40, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	// Cathedral 2 -> Elvine
	addRange("cath_2", 36, 38, 38, 40, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	// Command Hall 1 -> Aresden
	addRange("Cmdhall_1", 49, 51, 47, 48, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("Cmdhall_1", 38, 40, 49, 50, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	// Command Hall 2 -> Elvine
	addRange("Cmdhall_2", 49, 51, 47, 48, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("Cmdhall_2", 38, 40, 49, 50, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	// Whouse -> Aresden
	addRange("whouse", 40, 41, 38, 39, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	addRange("whouse", 52, 53, 38, 39, TeleportDest{DestMap: "aresden", DestX: 104, DestY: 186})
	// Whouse2 -> Elvine
	addRange("whouse2", 40, 41, 38, 39, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})
	addRange("whouse2", 52, 53, 38, 39, TeleportDest{DestMap: "elvine", DestX: 200, DestY: 130})

	// === UNIVERSITIES ===
	// Areuni -> Aresden
	addRange("areuni", 78, 95, 20, 20, TeleportDest{DestMap: "aresden", DestX: 80, DestY: 212})
	// Elvuni -> Elvine
	addRange("elvuni", 176, 176, 20, 28, TeleportDest{DestMap: "elvine", DestX: 260, DestY: 84})

	// === BARRACKS ===
	addRange("ABarracks", 38, 39, 29, 30, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("EBarracks", 38, 39, 29, 30, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("MBarracks", 64, 65, 32, 33, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("MBarracks", 82, 83, 100, 101, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// === ICEBOUND ===
	addRange("icebound", 260, 269, 264, 264, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// === RESURRECTION CHAMBERS ===
	addRange("resurr1", 38, 39, 33, 34, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr1", 158, 159, 33, 34, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr1", 38, 39, 113, 114, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr1", 158, 159, 113, 114, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("resurr2", 38, 39, 33, 34, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("resurr2", 158, 159, 33, 34, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("resurr2", 38, 39, 113, 114, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})
	addRange("resurr2", 158, 159, 113, 114, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})

	// === CITY MAP ===
	addRange("city", 84, 87, 79, 79, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})
	addRange("city", 290, 293, 407, 407, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// === MARKET ===
	addRange("market", 106, 106, 79, 80, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})

	// === COUNTER ===
	addRange("Counter", 103, 104, 59, 60, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// === MAPAVIP ===
	addRange("MapaVip", 53, 55, 143, 144, TeleportDest{DestMap: "middleland", DestX: 250, DestY: 250})

	// === WORLD MAP / EVENTS ===
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

	// === DEFAULT MAP -> CITIES (starter zone exits) ===
	addRange("default", 80, 82, 75, 76, TeleportDest{DestMap: "aresden", DestX: 140, DestY: 140})
	addRange("default", 127, 129, 78, 79, TeleportDest{DestMap: "elvine", DestX: 140, DestY: 140})

	return tc
}
