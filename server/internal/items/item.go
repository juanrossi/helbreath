package items

// ItemType categorizes items.
type ItemType int

const (
	ItemTypeWeapon    ItemType = 1
	ItemTypeShield    ItemType = 2
	ItemTypeHelm      ItemType = 3
	ItemTypeBodyArmor ItemType = 4
	ItemTypeLeggings  ItemType = 5
	ItemTypeBoots     ItemType = 6
	ItemTypeCape      ItemType = 7
	ItemTypePotion    ItemType = 8
	ItemTypeMaterial  ItemType = 9
)

// EquipSlot identifies where an item can be equipped.
type EquipSlot int

const (
	EquipNone     EquipSlot = 0
	EquipWeapon   EquipSlot = 1
	EquipShield   EquipSlot = 2
	EquipHelm     EquipSlot = 3
	EquipBody     EquipSlot = 4
	EquipLeggings EquipSlot = 5
	EquipBoots    EquipSlot = 6
	EquipCape     EquipSlot = 7
)

// ItemDef is a static item definition (template).
type ItemDef struct {
	ID          int
	Name        string
	Type        ItemType
	EquipSlot   EquipSlot
	Weight      int
	Price       int64
	MaxStack    int // 1 for equipment, >1 for consumables
	Durability  int // max durability (0 = indestructible/consumable)
	SpriteID    int // client sprite index

	// Weapon stats
	MinDamage   int
	MaxDamage   int
	AttackSpeed int // ms between swings

	// Armor stats
	Defense int

	// Potion effects
	HPRestore int
	MPRestore int
	SPRestore int

	// Requirements
	ReqLevel int
	ReqSTR   int
	ReqDEX   int
	ReqINT   int
	ReqMAG   int

	// Appearance index (which sprite variant to show when equipped)
	ApprIndex int
}

// Item is a runtime item instance (in inventory or on ground).
type Item struct {
	DefID      int
	Count      int
	Durability int
}

// NewItem creates an item from a definition.
func NewItem(def *ItemDef, count int) *Item {
	return &Item{
		DefID:      def.ID,
		Count:      count,
		Durability: def.Durability,
	}
}

// Def looks up the item definition from the global registry.
func (it *Item) Def() *ItemDef {
	return GetItemDef(it.DefID)
}

// IsStackable returns true if the item can stack (potions, materials).
func (it *Item) IsStackable() bool {
	def := it.Def()
	return def != nil && def.MaxStack > 1
}

// GroundItem is an item sitting on the map floor.
type GroundItem struct {
	GroundID int32
	Item     *Item
	MapName  string
	X, Y     int
	DropTime int64 // unix timestamp, for expiry
}

// ItemDB is the global item definition registry.
var ItemDB = map[int]*ItemDef{}

// GetItemDef looks up an item definition by ID.
func GetItemDef(id int) *ItemDef {
	return ItemDB[id]
}

func init() {
	// === WEAPONS ===
	ItemDB[1] = &ItemDef{ID: 1, Name: "Short Sword", Type: ItemTypeWeapon, EquipSlot: EquipWeapon,
		Weight: 10, Price: 150, MaxStack: 1, Durability: 100, SpriteID: 1,
		MinDamage: 3, MaxDamage: 7, AttackSpeed: 800, ReqLevel: 1, ApprIndex: 1}

	ItemDB[2] = &ItemDef{ID: 2, Name: "Long Sword", Type: ItemTypeWeapon, EquipSlot: EquipWeapon,
		Weight: 15, Price: 500, MaxStack: 1, Durability: 120, SpriteID: 2,
		MinDamage: 5, MaxDamage: 12, AttackSpeed: 900, ReqLevel: 5, ReqSTR: 12, ApprIndex: 2}

	ItemDB[3] = &ItemDef{ID: 3, Name: "Battle Axe", Type: ItemTypeWeapon, EquipSlot: EquipWeapon,
		Weight: 25, Price: 800, MaxStack: 1, Durability: 100, SpriteID: 3,
		MinDamage: 8, MaxDamage: 18, AttackSpeed: 1100, ReqLevel: 8, ReqSTR: 15, ApprIndex: 3}

	ItemDB[4] = &ItemDef{ID: 4, Name: "War Hammer", Type: ItemTypeWeapon, EquipSlot: EquipWeapon,
		Weight: 30, Price: 1200, MaxStack: 1, Durability: 150, SpriteID: 4,
		MinDamage: 10, MaxDamage: 22, AttackSpeed: 1200, ReqLevel: 12, ReqSTR: 18, ApprIndex: 4}

	ItemDB[5] = &ItemDef{ID: 5, Name: "Staff", Type: ItemTypeWeapon, EquipSlot: EquipWeapon,
		Weight: 8, Price: 300, MaxStack: 1, Durability: 80, SpriteID: 5,
		MinDamage: 2, MaxDamage: 6, AttackSpeed: 850, ReqLevel: 3, ReqMAG: 12, ApprIndex: 5}

	ItemDB[6] = &ItemDef{ID: 6, Name: "Dagger", Type: ItemTypeWeapon, EquipSlot: EquipWeapon,
		Weight: 5, Price: 80, MaxStack: 1, Durability: 60, SpriteID: 6,
		MinDamage: 2, MaxDamage: 5, AttackSpeed: 600, ReqLevel: 1, ApprIndex: 6}

	// === SHIELDS ===
	ItemDB[20] = &ItemDef{ID: 20, Name: "Wooden Shield", Type: ItemTypeShield, EquipSlot: EquipShield,
		Weight: 8, Price: 100, MaxStack: 1, Durability: 80, SpriteID: 20,
		Defense: 3, ReqLevel: 1, ApprIndex: 1}

	ItemDB[21] = &ItemDef{ID: 21, Name: "Iron Shield", Type: ItemTypeShield, EquipSlot: EquipShield,
		Weight: 15, Price: 400, MaxStack: 1, Durability: 120, SpriteID: 21,
		Defense: 6, ReqLevel: 5, ReqSTR: 12, ApprIndex: 2}

	ItemDB[22] = &ItemDef{ID: 22, Name: "Tower Shield", Type: ItemTypeShield, EquipSlot: EquipShield,
		Weight: 25, Price: 900, MaxStack: 1, Durability: 160, SpriteID: 22,
		Defense: 10, ReqLevel: 10, ReqSTR: 16, ApprIndex: 3}

	// === HELMS ===
	ItemDB[30] = &ItemDef{ID: 30, Name: "Leather Cap", Type: ItemTypeHelm, EquipSlot: EquipHelm,
		Weight: 3, Price: 60, MaxStack: 1, Durability: 60, SpriteID: 30,
		Defense: 1, ReqLevel: 1, ApprIndex: 1}

	ItemDB[31] = &ItemDef{ID: 31, Name: "Iron Helm", Type: ItemTypeHelm, EquipSlot: EquipHelm,
		Weight: 8, Price: 250, MaxStack: 1, Durability: 100, SpriteID: 31,
		Defense: 3, ReqLevel: 5, ReqSTR: 11, ApprIndex: 2}

	ItemDB[32] = &ItemDef{ID: 32, Name: "Full Helm", Type: ItemTypeHelm, EquipSlot: EquipHelm,
		Weight: 12, Price: 600, MaxStack: 1, Durability: 140, SpriteID: 32,
		Defense: 5, ReqLevel: 10, ReqSTR: 14, ApprIndex: 3}

	// === BODY ARMOR ===
	ItemDB[40] = &ItemDef{ID: 40, Name: "Leather Armor", Type: ItemTypeBodyArmor, EquipSlot: EquipBody,
		Weight: 12, Price: 200, MaxStack: 1, Durability: 80, SpriteID: 40,
		Defense: 4, ReqLevel: 1, ApprIndex: 1}

	ItemDB[41] = &ItemDef{ID: 41, Name: "Chain Mail", Type: ItemTypeBodyArmor, EquipSlot: EquipBody,
		Weight: 25, Price: 700, MaxStack: 1, Durability: 120, SpriteID: 41,
		Defense: 8, ReqLevel: 8, ReqSTR: 14, ApprIndex: 2}

	ItemDB[42] = &ItemDef{ID: 42, Name: "Plate Mail", Type: ItemTypeBodyArmor, EquipSlot: EquipBody,
		Weight: 40, Price: 1500, MaxStack: 1, Durability: 180, SpriteID: 42,
		Defense: 14, ReqLevel: 15, ReqSTR: 18, ApprIndex: 3}

	// === LEGGINGS ===
	ItemDB[50] = &ItemDef{ID: 50, Name: "Leather Leggings", Type: ItemTypeLeggings, EquipSlot: EquipLeggings,
		Weight: 8, Price: 120, MaxStack: 1, Durability: 70, SpriteID: 50,
		Defense: 2, ReqLevel: 1, ApprIndex: 1}

	ItemDB[51] = &ItemDef{ID: 51, Name: "Chain Leggings", Type: ItemTypeLeggings, EquipSlot: EquipLeggings,
		Weight: 18, Price: 450, MaxStack: 1, Durability: 100, SpriteID: 51,
		Defense: 5, ReqLevel: 6, ReqSTR: 13, ApprIndex: 2}

	ItemDB[52] = &ItemDef{ID: 52, Name: "Plate Leggings", Type: ItemTypeLeggings, EquipSlot: EquipLeggings,
		Weight: 30, Price: 1000, MaxStack: 1, Durability: 150, SpriteID: 52,
		Defense: 9, ReqLevel: 12, ReqSTR: 16, ApprIndex: 3}

	// === BOOTS ===
	ItemDB[60] = &ItemDef{ID: 60, Name: "Leather Boots", Type: ItemTypeBoots, EquipSlot: EquipBoots,
		Weight: 4, Price: 80, MaxStack: 1, Durability: 60, SpriteID: 60,
		Defense: 1, ReqLevel: 1, ApprIndex: 1}

	ItemDB[61] = &ItemDef{ID: 61, Name: "Iron Boots", Type: ItemTypeBoots, EquipSlot: EquipBoots,
		Weight: 10, Price: 300, MaxStack: 1, Durability: 100, SpriteID: 61,
		Defense: 3, ReqLevel: 6, ReqSTR: 12, ApprIndex: 2}

	// === CAPES ===
	ItemDB[70] = &ItemDef{ID: 70, Name: "Cloth Cape", Type: ItemTypeCape, EquipSlot: EquipCape,
		Weight: 3, Price: 100, MaxStack: 1, Durability: 50, SpriteID: 70,
		Defense: 1, ReqLevel: 1, ApprIndex: 1}

	ItemDB[71] = &ItemDef{ID: 71, Name: "Silk Mantle", Type: ItemTypeCape, EquipSlot: EquipCape,
		Weight: 5, Price: 500, MaxStack: 1, Durability: 80, SpriteID: 71,
		Defense: 3, ReqLevel: 8, ApprIndex: 2}

	// === POTIONS ===
	ItemDB[100] = &ItemDef{ID: 100, Name: "Small HP Potion", Type: ItemTypePotion,
		Weight: 2, Price: 30, MaxStack: 20, SpriteID: 100, HPRestore: 30}

	ItemDB[101] = &ItemDef{ID: 101, Name: "HP Potion", Type: ItemTypePotion,
		Weight: 2, Price: 80, MaxStack: 20, SpriteID: 101, HPRestore: 80}

	ItemDB[102] = &ItemDef{ID: 102, Name: "Large HP Potion", Type: ItemTypePotion,
		Weight: 3, Price: 200, MaxStack: 20, SpriteID: 102, HPRestore: 200}

	ItemDB[103] = &ItemDef{ID: 103, Name: "Small MP Potion", Type: ItemTypePotion,
		Weight: 2, Price: 40, MaxStack: 20, SpriteID: 103, MPRestore: 20}

	ItemDB[104] = &ItemDef{ID: 104, Name: "MP Potion", Type: ItemTypePotion,
		Weight: 2, Price: 100, MaxStack: 20, SpriteID: 104, MPRestore: 50}

	ItemDB[105] = &ItemDef{ID: 105, Name: "Large MP Potion", Type: ItemTypePotion,
		Weight: 3, Price: 250, MaxStack: 20, SpriteID: 105, MPRestore: 120}

	ItemDB[106] = &ItemDef{ID: 106, Name: "SP Potion", Type: ItemTypePotion,
		Weight: 2, Price: 50, MaxStack: 20, SpriteID: 106, SPRestore: 40}

	// Cooked food (from cooking recipes)
	ItemDB[107] = &ItemDef{ID: 107, Name: "Stamina Stew", Type: ItemTypePotion,
		Weight: 3, Price: 60, MaxStack: 10, SpriteID: 107, SPRestore: 60, HPRestore: 20}

	// === MATERIALS ===
	ItemDB[200] = &ItemDef{ID: 200, Name: "Red Herb", Type: ItemTypeMaterial,
		Weight: 1, Price: 10, MaxStack: 50, SpriteID: 200}

	ItemDB[201] = &ItemDef{ID: 201, Name: "Blue Herb", Type: ItemTypeMaterial,
		Weight: 1, Price: 12, MaxStack: 50, SpriteID: 201}

	ItemDB[210] = &ItemDef{ID: 210, Name: "Iron Ore", Type: ItemTypeMaterial,
		Weight: 5, Price: 20, MaxStack: 50, SpriteID: 210}

	ItemDB[211] = &ItemDef{ID: 211, Name: "Coal", Type: ItemTypeMaterial,
		Weight: 3, Price: 15, MaxStack: 50, SpriteID: 211}

	ItemDB[212] = &ItemDef{ID: 212, Name: "Leather", Type: ItemTypeMaterial,
		Weight: 2, Price: 18, MaxStack: 50, SpriteID: 212}

	ItemDB[220] = &ItemDef{ID: 220, Name: "Raw Fish", Type: ItemTypeMaterial,
		Weight: 2, Price: 8, MaxStack: 50, SpriteID: 220}

	ItemDB[230] = &ItemDef{ID: 230, Name: "Spell Scroll", Type: ItemTypeMaterial,
		Weight: 1, Price: 500, MaxStack: 1, SpriteID: 230}
}
