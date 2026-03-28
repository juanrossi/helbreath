package items

import "fmt"

const (
	MaxInventorySlots = 50
	MaxEquipSlots     = 7 // 1-7 (weapon, shield, helm, body, leggings, boots, cape)
)

// Inventory manages a player's items and equipment.
type Inventory struct {
	Slots     [MaxInventorySlots]*Item // inventory slots (nil = empty)
	Equipment [MaxEquipSlots + 1]*Item // equipment slots (index 1-7, 0 unused)
}

// NewInventory creates an empty inventory.
func NewInventory() *Inventory {
	return &Inventory{}
}

// AddItem adds an item to the first available slot. Returns the slot index or -1 if full.
func (inv *Inventory) AddItem(item *Item) int {
	def := item.Def()
	if def == nil {
		return -1
	}

	// Try to stack with existing items first
	if def.MaxStack > 1 {
		for i := 0; i < MaxInventorySlots; i++ {
			if inv.Slots[i] != nil && inv.Slots[i].DefID == item.DefID {
				space := def.MaxStack - inv.Slots[i].Count
				if space >= item.Count {
					inv.Slots[i].Count += item.Count
					return i
				} else if space > 0 {
					inv.Slots[i].Count = def.MaxStack
					item.Count -= space
					// Continue to find another slot for remainder
				}
			}
		}
	}

	// Find first empty slot
	for i := 0; i < MaxInventorySlots; i++ {
		if inv.Slots[i] == nil {
			inv.Slots[i] = item
			return i
		}
	}

	return -1 // inventory full
}

// RemoveItem removes count items from a slot. Returns true if successful.
func (inv *Inventory) RemoveItem(slot int, count int) bool {
	if slot < 0 || slot >= MaxInventorySlots || inv.Slots[slot] == nil {
		return false
	}
	if inv.Slots[slot].Count < count {
		return false
	}
	inv.Slots[slot].Count -= count
	if inv.Slots[slot].Count <= 0 {
		inv.Slots[slot] = nil
	}
	return true
}

// GetItem returns the item at a slot.
func (inv *Inventory) GetItem(slot int) *Item {
	if slot < 0 || slot >= MaxInventorySlots {
		return nil
	}
	return inv.Slots[slot]
}

// GetEquipped returns the item in an equipment slot.
func (inv *Inventory) GetEquipped(slot EquipSlot) *Item {
	if int(slot) < 1 || int(slot) > MaxEquipSlots {
		return nil
	}
	return inv.Equipment[slot]
}

// Equip moves an item from inventory to equipment slot. Returns error if invalid.
func (inv *Inventory) Equip(invSlot int) error {
	item := inv.GetItem(invSlot)
	if item == nil {
		return fmt.Errorf("no item in slot %d", invSlot)
	}
	def := item.Def()
	if def == nil {
		return fmt.Errorf("unknown item")
	}
	if def.EquipSlot == EquipNone {
		return fmt.Errorf("item cannot be equipped")
	}

	eqSlot := def.EquipSlot

	// If something is already equipped, swap it to inventory
	if inv.Equipment[eqSlot] != nil {
		old := inv.Equipment[eqSlot]
		inv.Equipment[eqSlot] = item
		inv.Slots[invSlot] = old
	} else {
		inv.Equipment[eqSlot] = item
		inv.Slots[invSlot] = nil
	}

	return nil
}

// Unequip moves an item from equipment to inventory. Returns error if inventory full.
func (inv *Inventory) Unequip(eqSlot EquipSlot) error {
	if int(eqSlot) < 1 || int(eqSlot) > MaxEquipSlots {
		return fmt.Errorf("invalid equipment slot")
	}
	item := inv.Equipment[eqSlot]
	if item == nil {
		return fmt.Errorf("nothing equipped in slot %d", eqSlot)
	}

	slot := inv.AddItem(item)
	if slot < 0 {
		return fmt.Errorf("inventory full")
	}
	inv.Equipment[eqSlot] = nil
	return nil
}

// HasItems returns true if the inventory or equipment has any items.
func (inv *Inventory) HasItems() bool {
	for i := 0; i < MaxInventorySlots; i++ {
		if inv.Slots[i] != nil {
			return true
		}
	}
	for i := 1; i <= MaxEquipSlots; i++ {
		if inv.Equipment[i] != nil {
			return true
		}
	}
	return false
}

// HasSpace returns true if there's room for at least one more item.
func (inv *Inventory) HasSpace() bool {
	for i := 0; i < MaxInventorySlots; i++ {
		if inv.Slots[i] == nil {
			return true
		}
	}
	return false
}

// CountItem returns total count of an item type across all slots.
func (inv *Inventory) CountItem(itemID int) int {
	total := 0
	for i := 0; i < MaxInventorySlots; i++ {
		if inv.Slots[i] != nil && inv.Slots[i].DefID == itemID {
			total += inv.Slots[i].Count
		}
	}
	return total
}

// TotalDefense returns total defense from all equipped armor (legacy, for backward compat).
func (inv *Inventory) TotalDefense() int {
	total := 0
	for i := 1; i <= MaxEquipSlots; i++ {
		if inv.Equipment[i] != nil {
			def := inv.Equipment[i].Def()
			if def != nil {
				total += def.Defense
			}
		}
	}
	return total
}

// ArmorAbsorption returns the flat defense from the equipped body armor.
func (inv *Inventory) ArmorAbsorption() int {
	item := inv.Equipment[EquipBody]
	if item == nil {
		return 0
	}
	def := item.Def()
	if def == nil {
		return 0
	}
	return def.Defense
}

// ShieldAbsorption returns the flat defense from the equipped shield.
func (inv *Inventory) ShieldAbsorption() int {
	item := inv.Equipment[EquipShield]
	if item == nil {
		return 0
	}
	def := item.Def()
	if def == nil {
		return 0
	}
	return def.Defense
}

// CapeAbsorption returns the flat defense from the equipped cape.
func (inv *Inventory) CapeAbsorption() int {
	item := inv.Equipment[EquipCape]
	if item == nil {
		return 0
	}
	def := item.Def()
	if def == nil {
		return 0
	}
	return def.Defense
}

// HelmAbsorption returns the flat defense from the equipped helm.
func (inv *Inventory) HelmAbsorption() int {
	item := inv.Equipment[EquipHelm]
	if item == nil {
		return 0
	}
	def := item.Def()
	if def == nil {
		return 0
	}
	return def.Defense
}

// LeggingsAbsorption returns the flat defense from the equipped leggings.
func (inv *Inventory) LeggingsAbsorption() int {
	item := inv.Equipment[EquipLeggings]
	if item == nil {
		return 0
	}
	def := item.Def()
	if def == nil {
		return 0
	}
	return def.Defense
}

// BootsAbsorption returns the flat defense from the equipped boots.
func (inv *Inventory) BootsAbsorption() int {
	item := inv.Equipment[EquipBoots]
	if item == nil {
		return 0
	}
	def := item.Def()
	if def == nil {
		return 0
	}
	return def.Defense
}

// WeaponDamage returns the min/max damage of equipped weapon. Returns (1,3) for unarmed.
func (inv *Inventory) WeaponDamage() (int, int) {
	weapon := inv.Equipment[EquipWeapon]
	if weapon == nil {
		return 1, 3 // unarmed
	}
	def := weapon.Def()
	if def == nil {
		return 1, 3
	}
	return def.MinDamage, def.MaxDamage
}

// DegradeWeapon reduces durability of equipped weapon by 1.
func (inv *Inventory) DegradeWeapon() {
	inv.DegradeWeaponBy(1)
}

// DegradeWeaponBy reduces durability of equipped weapon by the given amount.
func (inv *Inventory) DegradeWeaponBy(amount int) {
	weapon := inv.Equipment[EquipWeapon]
	if weapon != nil && weapon.Durability > 0 {
		weapon.Durability -= amount
		if weapon.Durability <= 0 {
			inv.Equipment[EquipWeapon] = nil // weapon broke
		}
	}
}

// DegradeArmor reduces durability of a random equipped armor piece by 1.
func (inv *Inventory) DegradeArmor() {
	armorSlots := []EquipSlot{EquipShield, EquipHelm, EquipBody, EquipLeggings, EquipBoots, EquipCape}
	for _, slot := range armorSlots {
		if inv.Equipment[slot] != nil && inv.Equipment[slot].Durability > 0 {
			inv.Equipment[slot].Durability--
			if inv.Equipment[slot].Durability <= 0 {
				inv.Equipment[slot] = nil // armor broke
			}
			return
		}
	}
}
