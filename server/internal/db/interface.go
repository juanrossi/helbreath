package db

import "context"

// DataStore defines the persistence interface used by the game engine.
type DataStore interface {
	CreateAccount(ctx context.Context, username, passwordHash string) (int, error)
	GetAccountByUsername(ctx context.Context, username string) (int, string, error)
	UpdateLastLogin(ctx context.Context, accountID int) error

	GetCharactersByAccount(ctx context.Context, accountID int) ([]CharacterRow, error)
	GetCharacterByID(ctx context.Context, charID, accountID int) (*CharacterRow, error)
	CreateCharacter(ctx context.Context, accountID int, name string, gender, skinColor, hairStyle, hairColor, underwearColor, str, vit, dex, intStat, mag, chr int) (int, error)
	DeleteCharacter(ctx context.Context, charID, accountID int) error
	SaveCharacterPosition(ctx context.Context, charID int, mapName string, x, y, direction int) error
	CountCharacters(ctx context.Context, accountID int) (int, error)
}

// Verify *Store satisfies DataStore at compile time.
var _ DataStore = (*Store)(nil)
