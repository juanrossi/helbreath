package magic

// SpellType categorizes spells.
type SpellType int

const (
	SpellTypeDamage   SpellType = 1 // Direct damage (single target)
	SpellTypeAOE      SpellType = 2 // Area of effect damage
	SpellTypeHeal     SpellType = 3 // Healing
	SpellTypeBuff     SpellType = 4 // Positive buff
	SpellTypeDebuff   SpellType = 5 // Negative debuff
	SpellTypeSummon   SpellType = 6 // Summon creature
	SpellTypeTeleport SpellType = 7 // Teleport
)

// SpellElement defines the elemental affinity.
type SpellElement int

const (
	ElementNone  SpellElement = 0
	ElementFire  SpellElement = 1
	ElementIce   SpellElement = 2
	ElementLight SpellElement = 3
	ElementEarth SpellElement = 4
)

// SpellDef is a static spell definition.
type SpellDef struct {
	ID          int
	Name        string
	Type        SpellType
	Element     SpellElement
	ManaCost    int
	CastTime    int // ms
	Cooldown    int // ms
	Range       int // tiles (0 = self)
	Radius      int // AOE radius (0 = single target)
	MinDamage   int
	MaxDamage   int
	HealAmount  int
	Duration    int // buff/debuff duration in seconds
	BuffStat    int // which stat to buff (1=STR, 2=VIT, etc.)
	BuffAmount  int
	ReqLevel    int
	ReqMAG      int
	ReqINT      int
	SpriteID    int // client spell effect sprite
	SoundID     int // client sound effect
}

// SpellDB is the global spell definition registry.
var SpellDB = map[int]*SpellDef{}

// GetSpellDef looks up a spell definition by ID.
func GetSpellDef(id int) *SpellDef {
	return SpellDB[id]
}

func init() {
	// === DAMAGE SPELLS ===
	SpellDB[1] = &SpellDef{ID: 1, Name: "Energy Bolt", Type: SpellTypeDamage, Element: ElementLight,
		ManaCost: 8, CastTime: 500, Cooldown: 1500, Range: 6,
		MinDamage: 5, MaxDamage: 15, ReqLevel: 1, ReqMAG: 10, SpriteID: 1, SoundID: 2}

	SpellDB[2] = &SpellDef{ID: 2, Name: "Magic Missile", Type: SpellTypeDamage, Element: ElementLight,
		ManaCost: 15, CastTime: 600, Cooldown: 2000, Range: 8,
		MinDamage: 10, MaxDamage: 25, ReqLevel: 5, ReqMAG: 14, SpriteID: 2, SoundID: 3}

	SpellDB[3] = &SpellDef{ID: 3, Name: "Fireball", Type: SpellTypeDamage, Element: ElementFire,
		ManaCost: 25, CastTime: 800, Cooldown: 3000, Range: 7,
		MinDamage: 20, MaxDamage: 45, ReqLevel: 10, ReqMAG: 18, ReqINT: 14, SpriteID: 3, SoundID: 4}

	SpellDB[4] = &SpellDef{ID: 4, Name: "Lightning Bolt", Type: SpellTypeDamage, Element: ElementLight,
		ManaCost: 30, CastTime: 700, Cooldown: 2500, Range: 9,
		MinDamage: 25, MaxDamage: 55, ReqLevel: 15, ReqMAG: 22, ReqINT: 16, SpriteID: 4, SoundID: 5}

	SpellDB[5] = &SpellDef{ID: 5, Name: "Ice Strike", Type: SpellTypeDamage, Element: ElementIce,
		ManaCost: 20, CastTime: 600, Cooldown: 2000, Range: 6,
		MinDamage: 15, MaxDamage: 35, ReqLevel: 8, ReqMAG: 16, SpriteID: 5, SoundID: 46}

	// === AOE SPELLS ===
	SpellDB[10] = &SpellDef{ID: 10, Name: "Fire Wall", Type: SpellTypeAOE, Element: ElementFire,
		ManaCost: 40, CastTime: 1000, Cooldown: 5000, Range: 5, Radius: 2,
		MinDamage: 15, MaxDamage: 30, ReqLevel: 12, ReqMAG: 20, ReqINT: 15, SpriteID: 10, SoundID: 4}

	SpellDB[11] = &SpellDef{ID: 11, Name: "Blizzard", Type: SpellTypeAOE, Element: ElementIce,
		ManaCost: 50, CastTime: 1200, Cooldown: 6000, Range: 6, Radius: 3,
		MinDamage: 20, MaxDamage: 40, ReqLevel: 18, ReqMAG: 24, ReqINT: 18, SpriteID: 11, SoundID: 47}

	SpellDB[12] = &SpellDef{ID: 12, Name: "Meteor Strike", Type: SpellTypeAOE, Element: ElementFire,
		ManaCost: 80, CastTime: 1500, Cooldown: 8000, Range: 7, Radius: 3,
		MinDamage: 40, MaxDamage: 80, ReqLevel: 25, ReqMAG: 30, ReqINT: 22, SpriteID: 12, SoundID: 4}

	// === HEAL SPELLS ===
	SpellDB[20] = &SpellDef{ID: 20, Name: "Heal", Type: SpellTypeHeal,
		ManaCost: 10, CastTime: 500, Cooldown: 2000, Range: 0,
		HealAmount: 30, ReqLevel: 1, ReqMAG: 10, SpriteID: 20, SoundID: 45}

	SpellDB[21] = &SpellDef{ID: 21, Name: "Greater Heal", Type: SpellTypeHeal,
		ManaCost: 25, CastTime: 800, Cooldown: 3000, Range: 0,
		HealAmount: 80, ReqLevel: 8, ReqMAG: 16, SpriteID: 21, SoundID: 45}

	SpellDB[22] = &SpellDef{ID: 22, Name: "Divine Heal", Type: SpellTypeHeal,
		ManaCost: 50, CastTime: 1000, Cooldown: 5000, Range: 0,
		HealAmount: 200, ReqLevel: 18, ReqMAG: 24, SpriteID: 22, SoundID: 45}

	// === BUFF SPELLS ===
	SpellDB[30] = &SpellDef{ID: 30, Name: "Protection", Type: SpellTypeBuff,
		ManaCost: 15, CastTime: 600, Cooldown: 10000, Range: 0,
		Duration: 60, BuffStat: 2, BuffAmount: 5, // VIT +5 for 60s
		ReqLevel: 3, ReqMAG: 12, SpriteID: 30, SoundID: 1}

	SpellDB[31] = &SpellDef{ID: 31, Name: "Strength", Type: SpellTypeBuff,
		ManaCost: 15, CastTime: 600, Cooldown: 10000, Range: 0,
		Duration: 60, BuffStat: 1, BuffAmount: 5, // STR +5 for 60s
		ReqLevel: 5, ReqMAG: 14, SpriteID: 31, SoundID: 1}

	SpellDB[32] = &SpellDef{ID: 32, Name: "Haste", Type: SpellTypeBuff,
		ManaCost: 20, CastTime: 600, Cooldown: 15000, Range: 0,
		Duration: 45, BuffStat: 3, BuffAmount: 5, // DEX +5 for 45s
		ReqLevel: 8, ReqMAG: 16, SpriteID: 32, SoundID: 1}

	// === DEBUFF SPELLS ===
	SpellDB[40] = &SpellDef{ID: 40, Name: "Slow", Type: SpellTypeDebuff, Element: ElementIce,
		ManaCost: 12, CastTime: 500, Cooldown: 8000, Range: 5,
		Duration: 30, BuffStat: 3, BuffAmount: -5, // DEX -5 for 30s
		ReqLevel: 5, ReqMAG: 14, SpriteID: 40, SoundID: 46}

	SpellDB[41] = &SpellDef{ID: 41, Name: "Weaken", Type: SpellTypeDebuff,
		ManaCost: 12, CastTime: 500, Cooldown: 8000, Range: 5,
		Duration: 30, BuffStat: 1, BuffAmount: -5, // STR -5 for 30s
		ReqLevel: 7, ReqMAG: 16, SpriteID: 41, SoundID: 1}
}
