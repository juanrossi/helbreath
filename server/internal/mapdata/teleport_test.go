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

	// Test Aresden -> Middleland teleport
	key := TeleportKey("aresden", 30, 20)
	dest, ok := tc[key]
	if !ok {
		t.Fatal("Should find teleport at aresden (30,20)")
	}
	if dest.DestMap != "middleland" {
		t.Errorf("Expected dest map 'middleland', got %q", dest.DestMap)
	}
	if dest.DestX != 152 || dest.DestY != 500 {
		t.Errorf("Expected dest (152,500), got (%d,%d)", dest.DestX, dest.DestY)
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
