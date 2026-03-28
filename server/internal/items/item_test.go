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
	def := GetItemDef(1) // Dagger
	if def == nil {
		t.Fatal("Expected Dagger (ID=1) to exist")
	}
	if def.Name != "Dagger" {
		t.Errorf("Expected 'Dagger', got %q", def.Name)
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
	def := GetItemDef(91) // RedPotion
	if def == nil {
		t.Fatal("RedPotion should exist")
	}

	item := NewItem(def, 5)
	if item.DefID != 91 {
		t.Errorf("Expected DefID=91, got %d", item.DefID)
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
	potDef := GetItemDef(91) // RedPotion
	pot := NewItem(potDef, 1)
	if !pot.IsStackable() {
		t.Error("Potion should be stackable")
	}

	// Weapon (MaxStack=1)
	swordDef := GetItemDef(1) // Dagger
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
		{91, "RedPotion", 24, 0, 0},
		{92, "BigHealthPotion", 24, 0, 0},
		{93, "BluePotion", 0, 24, 0},
		{94, "BigManaPotion", 0, 32, 0},
		{95, "GreenPotion", 0, 0, 24},
		{96, "BigRevitPotion", 0, 0, 32},
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
	// ID 1 = Dagger (from Item.cfg)
	dagger := GetItemDef(1)
	if dagger == nil {
		t.Fatal("Item ID 1 (Dagger) should exist")
	}
	if dagger.Type != ItemTypeWeapon {
		t.Errorf("Dagger: expected weapon type, got %d", dagger.Type)
	}
	if dagger.MinDamage <= 0 {
		t.Errorf("Dagger: expected positive min damage, got %d", dagger.MinDamage)
	}
}

func TestArmorStats(t *testing.T) {
	// ID 454 = Hauberk(M) from original Item.cfg
	hauberk := GetItemDef(454)
	if hauberk == nil {
		t.Fatal("Item ID 454 (Hauberk(M)) should exist")
	}
	if hauberk.Defense <= 0 {
		t.Errorf("Hauberk(M): expected positive defense, got %d", hauberk.Defense)
	}
}
