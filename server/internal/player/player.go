package player

import (
	"time"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/magic"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/quest"
	"github.com/juanrossi/hbonline/server/internal/skills"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

type Player struct {
	ObjectID    int32
	AccountID   int
	CharacterID int
	Name        string

	// Position
	MapName   string
	X, Y      int
	Direction int
	Action    int

	// Appearance
	Gender         int
	SkinColor      int
	HairStyle      int
	HairColor      int
	UnderwearColor int

	// Equipment appearance
	BodyArmor int
	ArmArmor  int
	Leggings  int
	Helm      int
	Weapon    int
	Shield    int
	Cape      int
	Boots     int
	ApprColor int

	// Stats
	Level      int
	Experience int64
	HP, MaxHP  int
	MP, MaxMP  int
	SP, MaxSP  int
	STR, VIT, DEX, INT, MAG, CHR int
	LUPool     int
	Side       int
	Gold       int64
	PKCount    int
	EKCount    int
	Hunger     int
	AdminLevel int

	// Inventory & Equipment
	Inventory *items.Inventory

	// Skills & Magic
	Skills       *skills.PlayerSkills
	LearnedSpells map[int]bool         // spell IDs the player knows
	Buffs        *magic.BuffTracker
	Cooldowns    map[int]time.Time     // spell ID -> when cooldown expires

	// Quests
	Quests *quest.QuestTracker

	// Anti-hack
	LastMoveTime time.Time

	// Connection
	Client *network.Client
}

// FromDB creates a Player from a database character row.
func FromDB(row *db.CharacterRow, objectID int32, client *network.Client) *Player {
	p := &Player{
		ObjectID:       objectID,
		AccountID:      row.AccountID,
		CharacterID:    row.ID,
		Name:           row.Name,
		MapName:        row.MapName,
		X:              row.PosX,
		Y:              row.PosY,
		Direction:      row.Direction,
		Gender:         row.Gender,
		SkinColor:      row.SkinColor,
		HairStyle:      row.HairStyle,
		HairColor:      row.HairColor,
		UnderwearColor: row.UnderwearColor,
		Level:          row.Level,
		Experience:     row.Experience,
		STR:            row.STR,
		VIT:            row.VIT,
		DEX:            row.DEX,
		INT:            row.INT,
		MAG:            row.MAG,
		CHR:            row.CHR,
		LUPool:         row.LUPool,
		HP:             row.HP,
		MP:             row.MP,
		SP:             row.SP,
		Side:           row.Side,
		Gold:           row.Gold,
		PKCount:        row.PKCount,
		EKCount:        row.EKCount,
		Hunger:         row.Hunger,
		AdminLevel:     row.AdminLevel,
		Inventory:      items.NewInventory(),
		Skills:         skills.NewPlayerSkills(),
		LearnedSpells:  make(map[int]bool),
		Buffs:          magic.NewBuffTracker(),
		Cooldowns:      make(map[int]time.Time),
		Quests:         quest.NewQuestTracker(),
		LastMoveTime:   time.Now(),
		Client:         client,
	}

	// Calculate max stats based on level and VIT/INT
	p.MaxHP = 30 + (p.Level-1)*3 + p.VIT*2
	p.MaxMP = 10 + (p.Level-1)*2 + p.MAG*2
	p.MaxSP = 30 + p.Level*2
	if p.HP > p.MaxHP {
		p.HP = p.MaxHP
	}
	if p.MP > p.MaxMP {
		p.MP = p.MaxMP
	}
	if p.SP > p.MaxSP {
		p.SP = p.MaxSP
	}

	return p
}

func (p *Player) ToContents() *pb.PlayerContents {
	return &pb.PlayerContents{
		ObjectId:   p.ObjectID,
		Name:       p.Name,
		MapName:    p.MapName,
		Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Direction:  int32(p.Direction),
		Appearance: p.ToAppearance(),
		Level:      int32(p.Level),
		Experience: p.Experience,
		Hp:         int32(p.HP),
		MaxHp:      int32(p.MaxHP),
		Mp:         int32(p.MP),
		MaxMp:      int32(p.MaxMP),
		Sp:         int32(p.SP),
		MaxSp:      int32(p.MaxSP),
		Str:        int32(p.STR),
		Vit:        int32(p.VIT),
		Dex:        int32(p.DEX),
		IntStat:    int32(p.INT),
		Mag:        int32(p.MAG),
		Charisma:   int32(p.CHR),
		LuPool:     int32(p.LUPool),
		Side:       int32(p.Side),
		Gold:       p.Gold,
		PkCount:    int32(p.PKCount),
		EkCount:    int32(p.EKCount),
		Hunger:     int32(p.Hunger),
		AdminLevel: int32(p.AdminLevel),
	}
}

func (p *Player) ToAppearance() *pb.Appearance {
	return &pb.Appearance{
		Gender:         int32(p.Gender),
		SkinColor:      int32(p.SkinColor),
		HairStyle:      int32(p.HairStyle),
		HairColor:      int32(p.HairColor),
		UnderwearColor: int32(p.UnderwearColor),
		BodyArmor:      int32(p.BodyArmor),
		ArmArmor:       int32(p.ArmArmor),
		Leggings:       int32(p.Leggings),
		Helm:           int32(p.Helm),
		Weapon:         int32(p.Weapon),
		Shield:         int32(p.Shield),
		Cape:           int32(p.Cape),
		Boots:          int32(p.Boots),
		ApprColor:      int32(p.ApprColor),
	}
}

func (p *Player) ToPlayerAppear() *pb.PlayerAppear {
	return &pb.PlayerAppear{
		ObjectId:   p.ObjectID,
		Name:       p.Name,
		Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Direction:  int32(p.Direction),
		Appearance: p.ToAppearance(),
		Action:     int32(p.Action),
		Level:      int32(p.Level),
		Side:       int32(p.Side),
		PkCount:    int32(p.PKCount),
	}
}

func (p *Player) Send(data []byte) {
	if p.Client != nil {
		p.Client.Send(data)
	}
}

// SyncEquipmentAppearance updates the player's appearance fields from equipped items.
func (p *Player) SyncEquipmentAppearance() {
	getAppr := func(slot items.EquipSlot) int {
		item := p.Inventory.GetEquipped(slot)
		if item == nil {
			return 0
		}
		def := item.Def()
		if def == nil {
			return 0
		}
		return def.ApprIndex
	}
	p.Weapon = getAppr(items.EquipWeapon)
	p.Shield = getAppr(items.EquipShield)
	p.Helm = getAppr(items.EquipHelm)
	p.BodyArmor = getAppr(items.EquipBody)
	p.Leggings = getAppr(items.EquipLeggings)
	p.Boots = getAppr(items.EquipBoots)
	p.Cape = getAppr(items.EquipCape)
}

// ToInventoryUpdate creates the protobuf message for full inventory state.
func (p *Player) ToInventoryUpdate() *pb.InventoryUpdate {
	update := &pb.InventoryUpdate{Gold: p.Gold}

	for i := 0; i < items.MaxInventorySlots; i++ {
		item := p.Inventory.Slots[i]
		if item == nil {
			continue
		}
		def := item.Def()
		if def == nil {
			continue
		}
		update.Items = append(update.Items, &pb.ItemInstance{
			ItemId:        int32(item.DefID),
			Name:          def.Name,
			Count:         int32(item.Count),
			Durability:    int32(item.Durability),
			MaxDurability: int32(def.Durability),
			SlotIndex:     int32(i),
		})
	}

	for i := 1; i <= items.MaxEquipSlots; i++ {
		item := p.Inventory.Equipment[i]
		if item == nil {
			continue
		}
		def := item.Def()
		if def == nil {
			continue
		}
		update.Equipment = append(update.Equipment, &pb.ItemInstance{
			ItemId:        int32(item.DefID),
			Name:          def.Name,
			Count:         int32(item.Count),
			Durability:    int32(item.Durability),
			MaxDurability: int32(def.Durability),
			SlotIndex:     int32(i),
		})
	}

	return update
}

// EffectiveSTR returns STR with buff modifiers.
func (p *Player) EffectiveSTR() int {
	return p.STR + p.Buffs.GetStatModifier(1)
}

// EffectiveVIT returns VIT with buff modifiers.
func (p *Player) EffectiveVIT() int {
	return p.VIT + p.Buffs.GetStatModifier(2)
}

// EffectiveDEX returns DEX with buff modifiers.
func (p *Player) EffectiveDEX() int {
	return p.DEX + p.Buffs.GetStatModifier(3)
}

// EffectiveINT returns INT with buff modifiers.
func (p *Player) EffectiveINT() int {
	return p.INT + p.Buffs.GetStatModifier(4)
}

// EffectiveMAG returns MAG with buff modifiers.
func (p *Player) EffectiveMAG() int {
	return p.MAG + p.Buffs.GetStatModifier(5)
}

// CanCastSpell checks if a player can cast a spell (knows it, has mana, not on cooldown).
func (p *Player) CanCastSpell(spellDef *magic.SpellDef) (bool, string) {
	if !p.LearnedSpells[spellDef.ID] {
		return false, "You haven't learned this spell"
	}
	if p.Level < spellDef.ReqLevel {
		return false, "Your level is too low"
	}
	if p.MAG < spellDef.ReqMAG {
		return false, "Not enough MAG"
	}
	if p.INT < spellDef.ReqINT {
		return false, "Not enough INT"
	}
	if p.MP < spellDef.ManaCost {
		return false, "Not enough mana"
	}
	if cooldownEnd, ok := p.Cooldowns[spellDef.ID]; ok {
		if time.Now().Before(cooldownEnd) {
			return false, "Spell is on cooldown"
		}
	}
	if p.HP <= 0 {
		return false, "You are dead"
	}
	return true, ""
}

// StartCooldown sets a spell's cooldown.
func (p *Player) StartCooldown(spellID int, cooldownMs int) {
	p.Cooldowns[spellID] = time.Now().Add(time.Duration(cooldownMs) * time.Millisecond)
}

// LearnSpell adds a spell to the player's known spells.
func (p *Player) LearnSpell(spellID int) bool {
	if p.LearnedSpells[spellID] {
		return false // already known
	}
	p.LearnedSpells[spellID] = true
	return true
}

// ToSpellList generates the protobuf spell list update.
func (p *Player) ToSpellList() *pb.SpellListUpdate {
	update := &pb.SpellListUpdate{}
	for spellID := range p.LearnedSpells {
		def := magic.GetSpellDef(spellID)
		if def == nil {
			continue
		}
		update.Spells = append(update.Spells, &pb.LearnedSpell{
			SpellId:    int32(def.ID),
			Name:       def.Name,
			ManaCost:   int32(def.ManaCost),
			CooldownMs: int32(def.Cooldown),
			SpellType:  int32(def.Type),
			SpriteId:   int32(def.SpriteID),
		})
	}
	return update
}

// ToSkillList generates the protobuf skill list update.
func (p *Player) ToSkillList() *pb.SkillListUpdate {
	update := &pb.SkillListUpdate{
		TotalMastery: int32(p.Skills.TotalMastery()),
		MasteryCap:   int32(skills.MasteryCap),
	}
	for id, def := range skills.SkillDefs {
		mastery := p.Skills.GetMastery(id)
		update.Skills = append(update.Skills, &pb.SkillEntry{
			SkillId: int32(def.ID),
			Name:    def.Name,
			Mastery: int32(mastery),
		})
	}
	return update
}

// MeetsRequirements checks if the player meets an item's stat requirements.
func (p *Player) MeetsRequirements(def *items.ItemDef) bool {
	if def.ReqLevel > 0 && p.Level < def.ReqLevel {
		return false
	}
	if def.ReqSTR > 0 && p.STR < def.ReqSTR {
		return false
	}
	if def.ReqDEX > 0 && p.DEX < def.ReqDEX {
		return false
	}
	if def.ReqINT > 0 && p.INT < def.ReqINT {
		return false
	}
	if def.ReqMAG > 0 && p.MAG < def.ReqMAG {
		return false
	}
	return true
}
