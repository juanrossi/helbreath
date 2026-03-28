package mapdata

// MapType categorizes maps for gameplay rule variations.
type MapType int

const (
	MapTypeNormal   MapType = iota // standard PvP and death penalties
	MapTypeSafeZone                // city maps: no PvP consequences
	MapTypeArena                   // arena maps: no death penalty
)

// MapTypeForName returns the MapType for a given map name.
// City maps (aresden, elvine and their buildings) are SafeZone.
// Middleland and hunt zones are Normal.
func MapTypeForName(name string) MapType {
	switch name {
	// City maps
	case "aresden", "elvine":
		return MapTypeSafeZone
	// City buildings
	case "cityhall_1", "cityhall_2",
		"bsmith_1", "bsmith_2",
		"gshop_1", "gshop_2",
		"arewrhus", "elvwrhus",
		"wrhus_1", "wrhus_2",
		"wzdtwr_1", "wzdtwr_2",
		"cath_1", "cath_2",
		"Cmdhall_1", "Cmdhall_2",
		"whouse", "whouse2",
		"areuni", "elvuni",
		"ABarracks", "EBarracks",
		"resurr1", "resurr2",
		"market":
		return MapTypeSafeZone
	// Arena / event maps
	case "ArGEvent", "NewEvent", "evento13", "evento14":
		return MapTypeArena
	default:
		return MapTypeNormal
	}
}
