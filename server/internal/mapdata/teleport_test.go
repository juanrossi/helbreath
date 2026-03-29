package mapdata

import "testing"

func TestTeleportKey(t *testing.T) {
	key := TeleportKey("aresden", 135, 128)
	if key != "aresden:135:128" {
		t.Errorf("Expected 'aresden:135:128', got %q", key)
	}

	key = TeleportKey("default", 0, 0)
	if key != "default:0:0" {
		t.Errorf("Expected 'default:0:0', got %q", key)
	}
}

func TestBuildTeleportConfig(t *testing.T) {
	tc := BuildTeleportConfig()

	if len(tc) == 0 {
		t.Fatal("Teleport config should not be empty")
	}

	// Test Aresden -> Middleland teleport (north exit, y=20)
	key := TeleportKey("aresden", 30, 20)
	dest, ok := tc[key]
	if !ok {
		t.Fatal("Should find teleport at aresden (30,20)")
	}
	if dest.DestMap != "middleland" {
		t.Errorf("Expected dest map 'middleland', got %q", dest.DestMap)
	}
	if dest.DestX != 152 || dest.DestY != 496 {
		t.Errorf("Expected dest (152,496), got (%d,%d)", dest.DestX, dest.DestY)
	}

	// Test Middleland -> Aresden teleport
	key = TeleportKey("middleland", 150, 503)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at middleland (150,503)")
	}
	if dest.DestMap != "aresden" {
		t.Errorf("Expected dest map 'aresden', got %q", dest.DestMap)
	}

	// Test Elvine -> Middleland
	key = TeleportKey("elvine", 23, 277)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at elvine (23,277)")
	}
	if dest.DestMap != "middleland" {
		t.Errorf("Expected dest map 'middleland', got %q", dest.DestMap)
	}

	// Test building exit: cityhall_1 -> aresden (actual AMD tile at 58,41)
	key = TeleportKey("cityhall_1", 58, 41)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at cityhall_1 (58,41)")
	}
	if dest.DestMap != "aresden" {
		t.Errorf("Expected dest map 'aresden', got %q", dest.DestMap)
	}

	// Test default -> Aresden portal (80-82, 75-76)
	key = TeleportKey("default", 81, 75)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at default (81,75)")
	}
	if dest.DestMap != "aresden" {
		t.Errorf("Expected dest map 'aresden', got %q", dest.DestMap)
	}

	// Test default -> Elvine portal (127-129, 78-79)
	key = TeleportKey("default", 128, 78)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at default (128,78)")
	}
	if dest.DestMap != "elvine" {
		t.Errorf("Expected dest map 'elvine', got %q", dest.DestMap)
	}

	// Test non-existent teleport
	key = TeleportKey("aresden", 0, 0)
	_, ok = tc[key]
	if ok {
		t.Error("Should not find teleport at aresden (0,0)")
	}

	// Test bsmith_1 exit -> aresden with corrected coords
	key = TeleportKey("bsmith_1", 32, 34)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at bsmith_1 (32,34)")
	}
	if dest.DestMap != "aresden" || dest.DestX != 171 || dest.DestY != 197 {
		t.Errorf("Expected bsmith_1 exit to aresden (171,197), got %s (%d,%d)", dest.DestMap, dest.DestX, dest.DestY)
	}

	// Test wrhus_1 exit -> aresden
	key = TeleportKey("wrhus_1", 54, 33)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at wrhus_1 (54,33)")
	}
	if dest.DestMap != "aresden" || dest.DestX != 106 || dest.DestY != 186 {
		t.Errorf("Expected wrhus_1 exit to aresden (106,186), got %s (%d,%d)", dest.DestMap, dest.DestX, dest.DestY)
	}

	// Test CmdHall_1 exit -> aresden
	key = TeleportKey("CmdHall_1", 50, 47)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at CmdHall_1 (50,47)")
	}
	if dest.DestMap != "aresden" || dest.DestX != 97 || dest.DestY != 161 {
		t.Errorf("Expected CmdHall_1 exit to aresden (97,161), got %s (%d,%d)", dest.DestMap, dest.DestX, dest.DestY)
	}

	// Test aresdend1 exit -> aresden with corrected coords
	key = TeleportKey("aresdend1", 38, 33)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at aresdend1 (38,33)")
	}
	if dest.DestMap != "aresden" || dest.DestX != 79 || dest.DestY != 205 {
		t.Errorf("Expected aresdend1 exit to aresden (79,205), got %s (%d,%d)", dest.DestMap, dest.DestX, dest.DestY)
	}

	// Test elvined1 exit -> elvine with corrected coords
	key = TeleportKey("elvined1", 96, 40)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at elvined1 (96,40)")
	}
	if dest.DestMap != "elvine" || dest.DestX != 258 || dest.DestY != 78 {
		t.Errorf("Expected elvined1 exit to elvine (258,78), got %s (%d,%d)", dest.DestMap, dest.DestX, dest.DestY)
	}

	// Test gshop_2 exit -> elvine
	key = TeleportKey("gshop_2", 50, 36)
	dest, ok = tc[key]
	if !ok {
		t.Fatal("Should find teleport at gshop_2 (50,36)")
	}
	if dest.DestMap != "elvine" || dest.DestX != 222 || dest.DestY != 155 {
		t.Errorf("Expected gshop_2 exit to elvine (222,155), got %s (%d,%d)", dest.DestMap, dest.DestX, dest.DestY)
	}
}

func TestBuildNoAttackAreas(t *testing.T) {
	areas := BuildNoAttackAreas()

	if len(areas) == 0 {
		t.Fatal("No-attack areas should not be empty")
	}

	// Test aresden has no-attack areas
	aresAreas, ok := areas["aresden"]
	if !ok {
		t.Fatal("Should have no-attack areas for aresden")
	}
	if len(aresAreas) != 7 {
		t.Errorf("Expected 7 no-attack areas for aresden, got %d", len(aresAreas))
	}

	// Test buildings are safe zones
	_, ok = areas["bsmith_1"]
	if !ok {
		t.Fatal("Should have no-attack area for bsmith_1")
	}
}

func TestItoa(t *testing.T) {
	tests := []struct {
		input    int
		expected string
	}{
		{0, "0"},
		{1, "1"},
		{42, "42"},
		{100, "100"},
		{-5, "-5"},
	}
	for _, tt := range tests {
		got := itoa(tt.input)
		if got != tt.expected {
			t.Errorf("itoa(%d) = %q, want %q", tt.input, got, tt.expected)
		}
	}
}
