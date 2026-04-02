package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

// Account operations

func (s *Store) CreateAccount(ctx context.Context, username, passwordHash, email string) (int, error) {
	var id int
	err := s.pool.QueryRow(ctx,
		`INSERT INTO accounts (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id`,
		username, passwordHash, email).Scan(&id)
	return id, err
}

func (s *Store) GetAccountByUsername(ctx context.Context, username string) (int, string, string, error) {
	var id int
	var hash string
	var uuid string
	err := s.pool.QueryRow(ctx,
		`SELECT id, password_hash, uuid FROM accounts WHERE username = $1 AND is_banned = FALSE`,
		username).Scan(&id, &hash, &uuid)
	return id, hash, uuid, err
}

func (s *Store) GetAccountUUID(ctx context.Context, accountID int) (string, error) {
	var uuid string
	err := s.pool.QueryRow(ctx,
		`SELECT uuid FROM accounts WHERE id = $1`, accountID).Scan(&uuid)
	return uuid, err
}

func (s *Store) GetAccountIDByUUID(ctx context.Context, uuid string) (int, error) {
	var id int
	err := s.pool.QueryRow(ctx,
		`SELECT id FROM accounts WHERE uuid = $1 AND is_banned = FALSE`, uuid).Scan(&id)
	return id, err
}

func (s *Store) UpdateLastLogin(ctx context.Context, accountID int) error {
	_, err := s.pool.Exec(ctx,
		`UPDATE accounts SET last_login = NOW() WHERE id = $1`, accountID)
	return err
}

// Character operations

type CharacterRow struct {
	ID             int
	AccountID      int
	Name           string
	Gender         int
	SkinColor      int
	HairStyle      int
	HairColor      int
	UnderwearColor int
	Side           int
	Level          int
	Experience     int64
	STR            int
	VIT            int
	DEX            int
	INT            int
	MAG            int
	CHR            int
	LUPool         int
	HP             int
	MP             int
	SP             int
	MapName        string
	PosX           int
	PosY           int
	Direction      int
	AdminLevel     int
	PKCount        int
	EKCount        int
	RewardGold     int
	Hunger         int
	Gold           int64
	InventoryJSON  string // JSON-serialized inventory items
	EquipmentJSON  string // JSON-serialized equipment items
	SpellDataJSON  string // JSON-serialized learned spell IDs
	IntroShown     bool
}

func (s *Store) GetCharactersByAccount(ctx context.Context, accountID int) ([]CharacterRow, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT id, account_id, name, gender, skin_color, hair_style, hair_color,
		        underwear_color, side, level, experience, str, vit, dex, int_stat,
		        mag, charisma, lu_pool, hp, mp, sp, map_name, pos_x, pos_y,
		        direction, admin_level, pk_count, ek_count, reward_gold, hunger, gold,
		        COALESCE(inventory_data, ''), COALESCE(equipment_data, ''),
		        COALESCE(spell_data, ''), COALESCE(intro_shown, false)
		 FROM characters WHERE account_id = $1 ORDER BY id`, accountID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var chars []CharacterRow
	for rows.Next() {
		var c CharacterRow
		err := rows.Scan(&c.ID, &c.AccountID, &c.Name, &c.Gender, &c.SkinColor,
			&c.HairStyle, &c.HairColor, &c.UnderwearColor, &c.Side, &c.Level,
			&c.Experience, &c.STR, &c.VIT, &c.DEX, &c.INT, &c.MAG, &c.CHR,
			&c.LUPool, &c.HP, &c.MP, &c.SP, &c.MapName, &c.PosX, &c.PosY,
			&c.Direction, &c.AdminLevel, &c.PKCount, &c.EKCount, &c.RewardGold,
			&c.Hunger, &c.Gold, &c.InventoryJSON, &c.EquipmentJSON,
			&c.SpellDataJSON, &c.IntroShown)
		if err != nil {
			return nil, err
		}
		chars = append(chars, c)
	}
	return chars, rows.Err()
}

func (s *Store) GetCharacterByID(ctx context.Context, charID, accountID int) (*CharacterRow, error) {
	c := &CharacterRow{}
	err := s.pool.QueryRow(ctx,
		`SELECT id, account_id, name, gender, skin_color, hair_style, hair_color,
		        underwear_color, side, level, experience, str, vit, dex, int_stat,
		        mag, charisma, lu_pool, hp, mp, sp, map_name, pos_x, pos_y,
		        direction, admin_level, pk_count, ek_count, reward_gold, hunger, gold,
		        COALESCE(inventory_data, ''), COALESCE(equipment_data, ''),
		        COALESCE(spell_data, ''), COALESCE(intro_shown, false)
		 FROM characters WHERE id = $1 AND account_id = $2`,
		charID, accountID).Scan(&c.ID, &c.AccountID, &c.Name, &c.Gender, &c.SkinColor,
		&c.HairStyle, &c.HairColor, &c.UnderwearColor, &c.Side, &c.Level,
		&c.Experience, &c.STR, &c.VIT, &c.DEX, &c.INT, &c.MAG, &c.CHR,
		&c.LUPool, &c.HP, &c.MP, &c.SP, &c.MapName, &c.PosX, &c.PosY,
		&c.Direction, &c.AdminLevel, &c.PKCount, &c.EKCount, &c.RewardGold,
		&c.Hunger, &c.Gold, &c.InventoryJSON, &c.EquipmentJSON,
		&c.SpellDataJSON, &c.IntroShown)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (s *Store) CreateCharacter(ctx context.Context, accountID int, name string, gender, skinColor, hairStyle, hairColor, underwearColor, str, vit, dex, intStat, mag, chr int) (int, error) {
	var id int
	err := s.pool.QueryRow(ctx,
		`INSERT INTO characters (account_id, name, gender, skin_color, hair_style, hair_color,
		                         underwear_color, str, vit, dex, int_stat, mag, charisma,
		                         map_name, pos_x, pos_y, direction)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'default',134,37,5) RETURNING id`,
		accountID, name, gender, skinColor, hairStyle, hairColor, underwearColor,
		str, vit, dex, intStat, mag, chr).Scan(&id)
	return id, err
}

func (s *Store) DeleteCharacter(ctx context.Context, charID, accountID int) error {
	_, err := s.pool.Exec(ctx,
		`DELETE FROM characters WHERE id = $1 AND account_id = $2`,
		charID, accountID)
	return err
}

func (s *Store) SaveCharacter(ctx context.Context, charID int, mapName string, x, y, direction int,
	level int, experience int64, hp, mp, sp int,
	str, vit, dex, intStat, mag, chr, luPool int,
	side int, gold int64, pkCount, ekCount, hunger int,
	inventoryJSON, equipmentJSON, spellDataJSON string) error {
	_, err := s.pool.Exec(ctx,
		`UPDATE characters SET map_name = $2, pos_x = $3, pos_y = $4, direction = $5,
		        level = $6, experience = $7, hp = $8, mp = $9, sp = $10,
		        str = $11, vit = $12, dex = $13, int_stat = $14, mag = $15, charisma = $16, lu_pool = $17,
		        side = $18, gold = $19, pk_count = $20, ek_count = $21, hunger = $22,
		        inventory_data = $23, equipment_data = $24, spell_data = $25, last_played = NOW()
		 WHERE id = $1`,
		charID, mapName, x, y, direction,
		level, experience, hp, mp, sp,
		str, vit, dex, intStat, mag, chr, luPool,
		side, gold, pkCount, ekCount, hunger,
		inventoryJSON, equipmentJSON, spellDataJSON)
	return err
}

func (s *Store) MarkIntroShown(ctx context.Context, charID int) error {
	_, err := s.pool.Exec(ctx,
		`UPDATE characters SET intro_shown = true WHERE id = $1`, charID)
	return err
}

func (s *Store) SaveCharacterPosition(ctx context.Context, charID int, mapName string, x, y, direction int) error {
	_, err := s.pool.Exec(ctx,
		`UPDATE characters SET map_name = $2, pos_x = $3, pos_y = $4, direction = $5, last_played = NOW()
		 WHERE id = $1`, charID, mapName, x, y, direction)
	return err
}

func (s *Store) CountCharacters(ctx context.Context, accountID int) (int, error) {
	var count int
	err := s.pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM characters WHERE account_id = $1`, accountID).Scan(&count)
	return count, err
}
