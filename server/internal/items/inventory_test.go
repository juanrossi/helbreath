package items

import "testing"

func TestInventoryAddItem(t *testing.T) {
	inv := NewInventory()
	def := GetItemDef(1) // Short Sword

	item := NewItem(def, 1)
	slot := inv.AddItem(item)
	if slot < 0 {
		t.Fatal("Failed to add item to inventory")
	}
	if slot != 0 {
		t.Errorf("Expected first slot (0), got %d", slot)
	}

	// Verify item is in slot
	got := inv.GetItem(slot)
	if got == nil || got.DefID != 1 {
		t.Error("Item not found in slot after add")
	}
}

func TestInventoryStacking(t *testing.T) {
	inv := NewInventory()
	def := GetItemDef(91) // RedPotion (MaxStack=20)

	// Add 10 potions
	slot := inv.AddItem(NewItem(def, 10))
	if slot < 0 {
		t.Fatal("Failed to add potions")
	}

	// Add 5 more - should stack
	slot2 := inv.AddItem(NewItem(def, 5))
	if slot2 != slot {
		t.Errorf("Potions should stack: first slot=%d, second=%d", slot, slot2)
	}

	item := inv.GetItem(slot)
	if item.Count != 15 {
		t.Errorf("Expected 15 potions, got %d", item.Count)
	}

	// Add 10 more - should exceed stack limit and overflow
	inv.AddItem(NewItem(def, 10))
	// First slot should be full (20), rest in new slot
	if inv.GetItem(slot).Count != 20 {
		t.Errorf("Expected 20 in first slot, got %d", inv.GetItem(slot).Count)
	}
}

func TestInventoryRemoveItem(t *testing.T) {
	inv := NewInventory()
	def := GetItemDef(91)
	inv.AddItem(NewItem(def, 10))

	// Remove 5
	ok := inv.RemoveItem(0, 5)
	if !ok {
		t.Fatal("Failed to remove items")
	}
	if inv.GetItem(0).Count != 5 {
		t.Errorf("Expected 5 remaining, got %d", inv.GetItem(0).Count)
	}

	// Remove all remaining
	ok = inv.RemoveItem(0, 5)
	if !ok {
		t.Fatal("Failed to remove remaining items")
	}
	if inv.GetItem(0) != nil {
		t.Error("Slot should be nil after removing all items")
	}

	// Remove from empty slot
	ok = inv.RemoveItem(0, 1)
	if ok {
		t.Error("Should fail to remove from empty slot")
	}

	// Remove more than available
	inv.AddItem(NewItem(def, 3))
	ok = inv.RemoveItem(0, 5)
	if ok {
		t.Error("Should fail to remove more than available")
	}
}

func TestInventoryEquip(t *testing.T) {
	inv := NewInventory()
	sword := GetItemDef(1) // Short Sword
	inv.AddItem(NewItem(sword, 1))

	err := inv.Equip(0)
	if err != nil {
		t.Fatalf("Failed to equip: %v", err)
	}

	// Inventory slot should be empty
	if inv.GetItem(0) != nil {
		t.Error("Inventory slot should be empty after equip")
	}

	// Equipment slot should have the sword
	eq := inv.GetEquipped(EquipWeapon)
	if eq == nil || eq.DefID != 1 {
		t.Error("Weapon slot should have Short Sword")
	}
}

func TestInventoryEquipSwap(t *testing.T) {
	inv := NewInventory()
	dagger := GetItemDef(1)    // Dagger
	shortSwd := GetItemDef(8)  // ShortSword

	inv.AddItem(NewItem(dagger, 1))
	inv.Equip(0)

	// Now add ShortSword and equip it - should swap
	inv.AddItem(NewItem(shortSwd, 1))
	err := inv.Equip(0)
	if err != nil {
		t.Fatalf("Failed to equip swap: %v", err)
	}

	// Weapon slot should have ShortSword
	eq := inv.GetEquipped(EquipWeapon)
	if eq == nil || eq.DefID != 8 {
		t.Error("Weapon slot should have ShortSword after swap")
	}

	// Inventory should have Dagger
	item := inv.GetItem(0)
	if item == nil || item.DefID != 1 {
		t.Error("Inventory should have Dagger after swap")
	}
}

func TestInventoryUnequip(t *testing.T) {
	inv := NewInventory()
	sword := GetItemDef(1)
	inv.AddItem(NewItem(sword, 1))
	inv.Equip(0)

	err := inv.Unequip(EquipWeapon)
	if err != nil {
		t.Fatalf("Failed to unequip: %v", err)
	}

	if inv.GetEquipped(EquipWeapon) != nil {
		t.Error("Weapon slot should be empty after unequip")
	}

	found := false
	for i := 0; i < MaxInventorySlots; i++ {
		if inv.GetItem(i) != nil && inv.GetItem(i).DefID == 1 {
			found = true
			break
		}
	}
	if !found {
		t.Error("Sword should be back in inventory after unequip")
	}
}

func TestInventoryUnequipFull(t *testing.T) {
	inv := NewInventory()

	// Fill all inventory slots
	potDef := GetItemDef(91)
	for i := 0; i < MaxInventorySlots; i++ {
		inv.Slots[i] = NewItem(potDef, 1)
	}

	// Equip something
	inv.Equipment[EquipWeapon] = NewItem(GetItemDef(1), 1)

	err := inv.Unequip(EquipWeapon)
	if err == nil {
		t.Error("Should fail to unequip when inventory is full")
	}
}

func TestInventoryEquipNonEquippable(t *testing.T) {
	inv := NewInventory()
	potDef := GetItemDef(91)
	inv.AddItem(NewItem(potDef, 5))

	err := inv.Equip(0)
	if err == nil {
		t.Error("Should fail to equip a potion")
	}
}

func TestInventoryHasSpace(t *testing.T) {
	inv := NewInventory()
	if !inv.HasSpace() {
		t.Error("Empty inventory should have space")
	}

	// Fill all slots
	for i := 0; i < MaxInventorySlots; i++ {
		inv.Slots[i] = NewItem(GetItemDef(1), 1)
	}
	if inv.HasSpace() {
		t.Error("Full inventory should not have space")
	}
}

func TestTotalDefense(t *testing.T) {
	inv := NewInventory()
	if inv.TotalDefense() != 0 {
		t.Error("Empty equipment should have 0 defense")
	}

	// Equip Hauberk(M) (defense=8) and Helm (defense=5)
	inv.Equipment[EquipBody] = NewItem(GetItemDef(454), 1)
	inv.Equipment[EquipHelm] = NewItem(GetItemDef(600), 1)

	expected := 8 + 5
	if inv.TotalDefense() != expected {
		t.Errorf("Expected total defense=%d, got %d", expected, inv.TotalDefense())
	}
}

func TestWeaponDamage(t *testing.T) {
	inv := NewInventory()

	// Unarmed
	min, max := inv.WeaponDamage()
	if min != 1 || max != 3 {
		t.Errorf("Unarmed should be 1-3, got %d-%d", min, max)
	}

	// Equip Dagger (1-5)
	inv.Equipment[EquipWeapon] = NewItem(GetItemDef(1), 1)
	min, max = inv.WeaponDamage()
	if min != 1 || max != 5 {
		t.Errorf("Dagger should be 1-5, got %d-%d", min, max)
	}
}

func TestDegradeWeapon(t *testing.T) {
	inv := NewInventory()
	sword := NewItem(GetItemDef(1), 1) // Dagger, durability=300
	inv.Equipment[EquipWeapon] = sword

	inv.DegradeWeapon()
	if sword.Durability != 299 {
		t.Errorf("Expected durability 299 after degrade, got %d", sword.Durability)
	}

	// Degrade to 0 - weapon should break
	sword.Durability = 1
	inv.DegradeWeapon()
	if inv.Equipment[EquipWeapon] != nil {
		t.Error("Weapon should break when durability reaches 0")
	}
}

func TestDegradeArmor(t *testing.T) {
	inv := NewInventory()
	armor := NewItem(GetItemDef(453), 1) // Shirt(M), durability=300
	inv.Equipment[EquipBody] = armor

	inv.DegradeArmor()
	if armor.Durability != 299 {
		t.Errorf("Expected durability 299, got %d", armor.Durability)
	}

	// Degrade to 0 - armor breaks
	armor.Durability = 1
	inv.DegradeArmor()
	if inv.Equipment[EquipBody] != nil {
		t.Error("Armor should break at 0 durability")
	}

	// No armor - should not panic
	inv.DegradeArmor()
}

func TestGetItemOutOfBounds(t *testing.T) {
	inv := NewInventory()
	if inv.GetItem(-1) != nil {
		t.Error("Negative index should return nil")
	}
	if inv.GetItem(50) != nil {
		t.Error("Index >= max should return nil")
	}
}

func TestGetEquippedOutOfBounds(t *testing.T) {
	inv := NewInventory()
	if inv.GetEquipped(0) != nil {
		t.Error("Slot 0 should return nil")
	}
	if inv.GetEquipped(8) != nil {
		t.Error("Slot 8 should return nil")
	}
}

func TestInventoryFull(t *testing.T) {
	inv := NewInventory()
	swordDef := GetItemDef(1)
	for i := 0; i < MaxInventorySlots; i++ {
		slot := inv.AddItem(NewItem(swordDef, 1))
		if slot < 0 {
			t.Fatalf("Failed to add item at slot %d", i)
		}
	}
	// Now inventory is full
	slot := inv.AddItem(NewItem(swordDef, 1))
	if slot != -1 {
		t.Errorf("Expected -1 for full inventory, got %d", slot)
	}
}

func TestHasItemsEmpty(t *testing.T) {
	inv := NewInventory()
	if inv.HasItems() {
		t.Error("Empty inventory should return false for HasItems")
	}
}

func TestHasItemsWithSlotItem(t *testing.T) {
	inv := NewInventory()
	inv.AddItem(NewItem(GetItemDef(91), 1))
	if !inv.HasItems() {
		t.Error("Inventory with slot item should return true")
	}
}

func TestHasItemsWithEquipment(t *testing.T) {
	inv := NewInventory()
	inv.Equipment[EquipWeapon] = NewItem(GetItemDef(1), 1)
	if !inv.HasItems() {
		t.Error("Inventory with equipped item should return true")
	}
}

func TestCountItem(t *testing.T) {
	inv := NewInventory()
	potDef := GetItemDef(91)

	inv.AddItem(NewItem(potDef, 10))
	inv.AddItem(NewItem(potDef, 5))

	if inv.CountItem(91) != 15 {
		t.Errorf("Expected 15 potions total, got %d", inv.CountItem(91))
	}
	if inv.CountItem(999) != 0 {
		t.Error("Non-existent item should count as 0")
	}
}
