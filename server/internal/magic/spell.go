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

	// Status effect fields (for spells that apply effects)
	ApplyEffect EffectType // which status effect to apply (0 = none)
	EffectLevel int        // intensity of the effect (1-3)
	TickDamage  int        // for poison: damage per tick
	TickIntervalMs int     // for poison: ms between ticks
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

	// === STATUS EFFECT SPELLS ===

	// Poison Cloud: applies poison (5 damage every 3 seconds for 15 seconds)
	SpellDB[50] = &SpellDef{ID: 50, Name: "Poison Cloud", Type: SpellTypeDebuff, Element: ElementEarth,
		ManaCost: 18, CastTime: 600, Cooldown: 10000, Range: 6,
		Duration: 15, ReqLevel: 6, ReqMAG: 14, SpriteID: 50, SoundID: 7,
		ApplyEffect: EffectPoison, EffectLevel: 1, TickDamage: 5, TickIntervalMs: 3000}

	// Toxic Cloud: stronger poison (8 damage every 3 seconds for 21 seconds)
	SpellDB[51] = &SpellDef{ID: 51, Name: "Toxic Cloud", Type: SpellTypeDebuff, Element: ElementEarth,
		ManaCost: 35, CastTime: 800, Cooldown: 12000, Range: 7,
		Duration: 21, ReqLevel: 15, ReqMAG: 22, ReqINT: 16, SpriteID: 51, SoundID: 7,
		ApplyEffect: EffectPoison, EffectLevel: 2, TickDamage: 8, TickIntervalMs: 3000}

	// Freeze: applies ice effect (slows movement and reduces defense)
	SpellDB[52] = &SpellDef{ID: 52, Name: "Freeze", Type: SpellTypeDebuff, Element: ElementIce,
		ManaCost: 20, CastTime: 500, Cooldown: 8000, Range: 6,
		Duration: 10, ReqLevel: 8, ReqMAG: 16, SpriteID: 52, SoundID: 46,
		ApplyEffect: EffectIce, EffectLevel: 1}

	// Deep Freeze: stronger ice effect
	SpellDB[53] = &SpellDef{ID: 53, Name: "Deep Freeze", Type: SpellTypeDebuff, Element: ElementIce,
		ManaCost: 40, CastTime: 700, Cooldown: 12000, Range: 7,
		Duration: 15, ReqLevel: 18, ReqMAG: 24, ReqINT: 18, SpriteID: 53, SoundID: 46,
		ApplyEffect: EffectIce, EffectLevel: 2}

	// Berserk: self-buff that increases damage but reduces defense
	SpellDB[54] = &SpellDef{ID: 54, Name: "Berserk", Type: SpellTypeBuff,
		ManaCost: 25, CastTime: 500, Cooldown: 30000, Range: 0,
		Duration: 30, ReqLevel: 12, ReqMAG: 18, SpriteID: 54, SoundID: 8,
		ApplyEffect: EffectBerserk, EffectLevel: 1}

	// Greater Berserk: stronger berserk
	SpellDB[55] = &SpellDef{ID: 55, Name: "Greater Berserk", Type: SpellTypeBuff,
		ManaCost: 45, CastTime: 700, Cooldown: 45000, Range: 0,
		Duration: 30, ReqLevel: 22, ReqMAG: 26, SpriteID: 55, SoundID: 8,
		ApplyEffect: EffectBerserk, EffectLevel: 2}

	// Invisibility: self-buff that hides from NPCs (breaks on attack/damage)
	SpellDB[56] = &SpellDef{ID: 56, Name: "Invisibility", Type: SpellTypeBuff,
		ManaCost: 30, CastTime: 800, Cooldown: 60000, Range: 0,
		Duration: 20, ReqLevel: 10, ReqMAG: 18, ReqINT: 14, SpriteID: 56, SoundID: 9,
		ApplyEffect: EffectInvisibility, EffectLevel: 1}

	// Silence: prevents target from casting spells
	SpellDB[57] = &SpellDef{ID: 57, Name: "Silence", Type: SpellTypeDebuff,
		ManaCost: 22, CastTime: 600, Cooldown: 15000, Range: 6,
		Duration: 8, ReqLevel: 10, ReqMAG: 18, ReqINT: 14, SpriteID: 57, SoundID: 10,
		ApplyEffect: EffectInhibition, EffectLevel: 1}

	// Defense Shield: self-buff that absorbs physical damage
	SpellDB[58] = &SpellDef{ID: 58, Name: "Defense Shield", Type: SpellTypeBuff,
		ManaCost: 20, CastTime: 600, Cooldown: 20000, Range: 0,
		Duration: 45, ReqLevel: 6, ReqMAG: 14, SpriteID: 58, SoundID: 11,
		ApplyEffect: EffectDefenseShield, EffectLevel: 1}

	// Greater Defense Shield
	SpellDB[59] = &SpellDef{ID: 59, Name: "Greater Defense Shield", Type: SpellTypeBuff,
		ManaCost: 40, CastTime: 800, Cooldown: 30000, Range: 0,
		Duration: 60, ReqLevel: 16, ReqMAG: 22, SpriteID: 59, SoundID: 11,
		ApplyEffect: EffectDefenseShield, EffectLevel: 2}

	// Magic Protection: self-buff that reduces spell damage
	SpellDB[60] = &SpellDef{ID: 60, Name: "Magic Protection", Type: SpellTypeBuff,
		ManaCost: 25, CastTime: 600, Cooldown: 25000, Range: 0,
		Duration: 45, ReqLevel: 8, ReqMAG: 16, ReqINT: 12, SpriteID: 60, SoundID: 12,
		ApplyEffect: EffectMagicProtection, EffectLevel: 1}

	// Greater Magic Protection
	SpellDB[61] = &SpellDef{ID: 61, Name: "Greater Magic Protection", Type: SpellTypeBuff,
		ManaCost: 45, CastTime: 800, Cooldown: 35000, Range: 0,
		Duration: 60, ReqLevel: 18, ReqMAG: 24, ReqINT: 18, SpriteID: 61, SoundID: 12,
		ApplyEffect: EffectMagicProtection, EffectLevel: 2}
}
