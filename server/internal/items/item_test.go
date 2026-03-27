package items

import "testing"

func TestItemDB(t *testing.T) {
	// Verify all items in the DB are valid
	if len(ItemDB) == 0 {
		t.Fatal("ItemDB should not be empty")
	}

	for id, def := range ItemDB {
		if def.ID != id {
			t.Errorf("Item ID mismatch: key=%d, def.ID=%d", id, def.ID)
		}
		if def.Name == "" {
			t.Errorf("Item %d has empty name", id)
		}
		if def.MaxStack < 1 {
			t.Errorf("Item %d (%s) has invalid MaxStack=%d", id, def.Name, def.MaxStack)
		}
		if def.Price < 0 {
			t.Errorf("Item %d (%s) has negative Price", id, def.Name)
		}
	}
}

func TestGetItemDef(t *testing.T) {
	def := GetItemDef(1) // Short Sword
	if def == nil {
		t.Fatal("Expected Short Sword (ID=1) to exist")
	}
	if def.Name != "Short Sword" {
		t.Errorf("Expected 'Short Sword', got %q", def.Name)
	}
	if def.Type != ItemTypeWeapon {
		t.Errorf("Expected weapon type, got %d", def.Type)
	}
	if def.EquipSlot != EquipWeapon {
		t.Errorf("Expected weapon equip slot, got %d", def.EquipSlot)
	}

	// Non-existent
	if GetItemDef(9999) != nil {
		t.Error("Expected nil for non-existent item")
	}
}

func TestNewItem(t *testing.T) {
	def := GetItemDef(100) // Small HP Potion
	if def == nil {
		t.Fatal("Small HP Potion should exist")
	}

	item := NewItem(def, 5)
	if item.DefID != 100 {
		t.Errorf("Expected DefID=100, got %d", item.DefID)
	}
	if item.Count != 5 {
		t.Errorf("Expected Count=5, got %d", item.Count)
	}
	if item.Durability != 0 {
		t.Errorf("Potions should have Durability=0, got %d", item.Durability)
	}
}

func TestItemStackable(t *testing.T) {
	// Potion (MaxStack=20)
	potDef := GetItemDef(100)
	pot := NewItem(potDef, 1)
	if !pot.IsStackable() {
		t.Error("Potion should be stackable")
	}

	// Weapon (MaxStack=1)
	swordDef := GetItemDef(1)
	sword := NewItem(swordDef, 1)
	if sword.IsStackable() {
		t.Error("Weapon should not be stackable")
	}
}

func TestPotionEffects(t *testing.T) {
	tests := []struct {
		id        int
		name      string
		hpRestore int
		mpRestore int
		spRestore int
	}{
		{100, "Small HP Potion", 30, 0, 0},
		{101, "HP Potion", 80, 0, 0},
		{102, "Large HP Potion", 200, 0, 0},
		{103, "Small MP Potion", 0, 20, 0},
		{104, "MP Potion", 0, 50, 0},
		{105, "Large MP Potion", 0, 120, 0},
		{106, "SP Potion", 0, 0, 40},
	}

	for _, tt := range tests {
		def := GetItemDef(tt.id)
		if def == nil {
			t.Errorf("Item %d (%s) should exist", tt.id, tt.name)
			continue
		}
		if def.HPRestore != tt.hpRestore {
			t.Errorf("%s: expected HPRestore=%d, got %d", tt.name, tt.hpRestore, def.HPRestore)
		}
		if def.MPRestore != tt.mpRestore {
			t.Errorf("%s: expected MPRestore=%d, got %d", tt.name, tt.mpRestore, def.MPRestore)
		}
		if def.SPRestore != tt.spRestore {
			t.Errorf("%s: expected SPRestore=%d, got %d", tt.name, tt.spRestore, def.SPRestore)
		}
	}
}

func TestWeaponStats(t *testing.T) {
	sword := GetItemDef(1)
	if sword.MinDamage != 3 || sword.MaxDamage != 7 {
		t.Errorf("Short Sword: expected 3-7 damage, got %d-%d", sword.MinDamage, sword.MaxDamage)
	}

	axe := GetItemDef(3)
	if axe.MinDamage != 8 || axe.MaxDamage != 18 {
		t.Errorf("Battle Axe: expected 8-18 damage, got %d-%d", axe.MinDamage, axe.MaxDamage)
	}
}

func TestArmorStats(t *testing.T) {
	leather := GetItemDef(40)
	if leather.Defense != 4 {
		t.Errorf("Leather Armor: expected Defense=4, got %d", leather.Defense)
	}

	plate := GetItemDef(42)
	if plate.Defense != 14 {
		t.Errorf("Plate Mail: expected Defense=14, got %d", plate.Defense)
	}
}
