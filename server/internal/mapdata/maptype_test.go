package mapdata

import "testing"

func TestMapTypeForName(t *testing.T) {
	tests := []struct {
		name     string
		expected MapType
	}{
		// Safe zones
		{"aresden", MapTypeSafeZone},
		{"elvine", MapTypeSafeZone},
		{"cityhall_1", MapTypeSafeZone},
		{"cityhall_2", MapTypeSafeZone},
		{"bsmith_1", MapTypeSafeZone},
		{"bsmith_2", MapTypeSafeZone},
		{"gshop_1", MapTypeSafeZone},
		{"gshop_2", MapTypeSafeZone},
		{"arewrhus", MapTypeSafeZone},
		{"elvwrhus", MapTypeSafeZone},
		{"wzdtwr_1", MapTypeSafeZone},
		{"wzdtwr_2", MapTypeSafeZone},
		{"areuni", MapTypeSafeZone},
		{"elvuni", MapTypeSafeZone},
		{"resurr1", MapTypeSafeZone},
		{"resurr2", MapTypeSafeZone},
		{"market", MapTypeSafeZone},

		// Arena / event maps
		{"ArGEvent", MapTypeArena},
		{"NewEvent", MapTypeArena},
		{"evento13", MapTypeArena},
		{"evento14", MapTypeArena},

		// Normal maps
		{"middleland", MapTypeNormal},
		{"huntzone1", MapTypeNormal},
		{"huntzone2", MapTypeNormal},
		{"huntzone3", MapTypeNormal},
		{"huntzone4", MapTypeNormal},
		{"dglv2", MapTypeNormal},
		{"dglv3", MapTypeNormal},
		{"dglv4", MapTypeNormal},
		{"aresdend1", MapTypeNormal},
		{"elvined1", MapTypeNormal},
		{"2ndmiddle", MapTypeNormal},
		{"unknown_map", MapTypeNormal},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := MapTypeForName(tt.name)
			if got != tt.expected {
				t.Errorf("MapTypeForName(%q) = %d, expected %d", tt.name, got, tt.expected)
			}
		})
	}
}

func TestMapTypeConstants(t *testing.T) {
	// Verify the enum values are distinct
	if MapTypeNormal == MapTypeSafeZone {
		t.Error("MapTypeNormal should not equal MapTypeSafeZone")
	}
	if MapTypeNormal == MapTypeArena {
		t.Error("MapTypeNormal should not equal MapTypeArena")
	}
	if MapTypeSafeZone == MapTypeArena {
		t.Error("MapTypeSafeZone should not equal MapTypeArena")
	}
}

func TestGameMapTypeSetOnLoad(t *testing.T) {
	// Test that GameMap struct includes the Type field
	gm := &GameMap{
		Name: "aresden",
		Type: MapTypeForName("aresden"),
	}
	if gm.Type != MapTypeSafeZone {
		t.Errorf("aresden GameMap type should be SafeZone, got %d", gm.Type)
	}

	gm2 := &GameMap{
		Name: "middleland",
		Type: MapTypeForName("middleland"),
	}
	if gm2.Type != MapTypeNormal {
		t.Errorf("middleland GameMap type should be Normal, got %d", gm2.Type)
	}
}
