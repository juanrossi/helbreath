package db

import (
	"context"
	"fmt"
	"sync"
)

// MemoryStore is an in-memory DataStore for development without PostgreSQL.
type MemoryStore struct {
	mu            sync.RWMutex
	accounts      map[int]*memAccount   // by account ID
	accountsByName map[string]int        // username -> account ID
	characters    map[int]*CharacterRow // by character ID
	nextAccountID int
	nextCharID    int
}

type memAccount struct {
	ID           int
	Username     string
	PasswordHash string
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		accounts:       make(map[int]*memAccount),
		accountsByName: make(map[string]int),
		characters:     make(map[int]*CharacterRow),
		nextAccountID:  1,
		nextCharID:     1,
	}
}

var _ DataStore = (*MemoryStore)(nil)

func (m *MemoryStore) CreateAccount(_ context.Context, username, passwordHash string) (int, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.accountsByName[username]; exists {
		return 0, fmt.Errorf("username already taken")
	}

	id := m.nextAccountID
	m.nextAccountID++
	m.accounts[id] = &memAccount{ID: id, Username: username, PasswordHash: passwordHash}
	m.accountsByName[username] = id
	return id, nil
}

func (m *MemoryStore) GetAccountByUsername(_ context.Context, username string) (int, string, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	id, ok := m.accountsByName[username]
	if !ok {
		return 0, "", fmt.Errorf("account not found")
	}
	acc := m.accounts[id]
	return acc.ID, acc.PasswordHash, nil
}

func (m *MemoryStore) UpdateLastLogin(_ context.Context, _ int) error {
	return nil
}

func (m *MemoryStore) GetCharactersByAccount(_ context.Context, accountID int) ([]CharacterRow, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var chars []CharacterRow
	for _, c := range m.characters {
		if c.AccountID == accountID {
			chars = append(chars, *c)
		}
	}
	return chars, nil
}

func (m *MemoryStore) GetCharacterByID(_ context.Context, charID, accountID int) (*CharacterRow, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, ok := m.characters[charID]
	if !ok || c.AccountID != accountID {
		return nil, fmt.Errorf("character not found")
	}
	cp := *c
	return &cp, nil
}

func (m *MemoryStore) CreateCharacter(_ context.Context, accountID int, name string, gender, skinColor, hairStyle, hairColor, underwearColor, str, vit, dex, intStat, mag, chr int) (int, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Check unique name
	for _, c := range m.characters {
		if c.Name == name {
			return 0, fmt.Errorf("character name already taken")
		}
	}

	id := m.nextCharID
	m.nextCharID++
	m.characters[id] = &CharacterRow{
		ID:             id,
		AccountID:      accountID,
		Name:           name,
		Gender:         gender,
		SkinColor:      skinColor,
		HairStyle:      hairStyle,
		HairColor:      hairColor,
		UnderwearColor: underwearColor,
		STR:            str,
		VIT:            vit,
		DEX:            dex,
		INT:            intStat,
		MAG:            mag,
		CHR:            chr,
		Level:          1,
		HP:             30,
		MP:             10,
		SP:             30,
		MapName:        "default",
		PosX:           50,
		PosY:           50,
		Direction:      5,
		Hunger:         100,
		AdminLevel:     4, // Dev mode: all characters start as Super GM
	}
	return id, nil
}

func (m *MemoryStore) DeleteCharacter(_ context.Context, charID, accountID int) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	c, ok := m.characters[charID]
	if !ok || c.AccountID != accountID {
		return fmt.Errorf("character not found")
	}
	delete(m.characters, charID)
	return nil
}

func (m *MemoryStore) SaveCharacterPosition(_ context.Context, charID int, mapName string, x, y, direction int) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	c, ok := m.characters[charID]
	if !ok {
		return fmt.Errorf("character not found")
	}
	c.MapName = mapName
	c.PosX = x
	c.PosY = y
	c.Direction = direction
	return nil
}

func (m *MemoryStore) SaveCharacter(_ context.Context, charID int, mapName string, x, y, direction int,
	level int, experience int64, hp, mp, sp int,
	str, vit, dex, intStat, mag, chr, luPool int,
	side int, gold int64, pkCount, ekCount, hunger int,
	inventoryJSON, equipmentJSON string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	c, ok := m.characters[charID]
	if !ok {
		return fmt.Errorf("character not found")
	}
	c.MapName = mapName
	c.PosX = x
	c.PosY = y
	c.Direction = direction
	c.Level = level
	c.Experience = experience
	c.HP = hp
	c.MP = mp
	c.SP = sp
	c.STR = str
	c.VIT = vit
	c.DEX = dex
	c.INT = intStat
	c.MAG = mag
	c.CHR = chr
	c.LUPool = luPool
	c.Side = side
	c.Gold = gold
	c.PKCount = pkCount
	c.EKCount = ekCount
	c.Hunger = hunger
	c.InventoryJSON = inventoryJSON
	c.EquipmentJSON = equipmentJSON
	return nil
}

func (m *MemoryStore) CountCharacters(_ context.Context, accountID int) (int, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	count := 0
	for _, c := range m.characters {
		if c.AccountID == accountID {
			count++
		}
	}
	return count, nil
}
