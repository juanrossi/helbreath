package player

import (
	"time"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/network"
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
