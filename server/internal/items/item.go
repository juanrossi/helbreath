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

// Item attribute values (encoded in bits 20-23 of the Attribute field).
const (
	AttrNone    = 0
	AttrSharp   = 7 // +1 dice range
	AttrAncient = 9 // +2 dice range
)

// ItemDef is a static item definition (template).
type ItemDef struct {
	ID        int
	Name      string
	Type      ItemType
	EquipSlot EquipSlot
	Weight    int
	Price     int64
	MaxStack  int // 1 for equipment, >1 for consumables
	Durability int // max durability (0 = indestructible/consumable)
	SpriteID  int // client sprite index

	// Weapon stats (legacy range, kept for UI display)
	MinDamage   int
	MaxDamage   int
	AttackSpeed int // ms between swings

	// Dice-based weapon damage (C++ port — authoritative for combat)
	DiceThrowSM int // number of dice vs small/medium creatures
	DiceRangeSM int // sides per die vs small/medium creatures
	DiceThrowL  int // number of dice vs large creatures
	DiceRangeL  int // sides per die vs large creatures
	AttackBonus int // flat damage added after dice roll

	// Weapon classification
	WeaponSkillID int  // skill ID this weapon trains (15=sword,16=axe,17=hammer,18=staff,19=dagger,20=bow,14=hand)
	TwoHanded     bool // blocks shield slot when equipped

	// Item attributes (bit field — bits 20-23 for special properties)
	Attribute uint32

	// Day/Night weapon bonuses (endgame PvP system)
	DayBonus   int // bonus damage during day phase
	NightBonus int // bonus damage during night phase

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

// GetAttribute extracts the special attribute value from bits 20-23.
func (def *ItemDef) GetAttribute() int {
	return int((def.Attribute >> 20) & 0xF)
}

// Item is a runtime item instance (in inventory or on ground).
type Item struct {
	DefID      int
	Count      int
	Durability int
	Attribute  uint32 // per-instance attribute (can differ from def for dropped loot)
}

// NewItem creates an item from a definition.
func NewItem(def *ItemDef, count int) *Item {
	return &Item{
		DefID:      def.ID,
		Count:      count,
		Durability: def.Durability,
		Attribute:  def.Attribute,
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

// GetAttribute extracts the special attribute value from the item instance.
func (it *Item) GetAttribute() int {
	return int((it.Attribute >> 20) & 0xF)
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

// Item definitions are loaded from the generated file itemdefs_gen.go
// which contains 656 items parsed from the original Helbreath Item.cfg files.
// To regenerate: go run ./tools/itemimport/ > internal/items/itemdefs_gen.go
