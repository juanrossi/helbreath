package db

import (
	"context"
	"testing"
)

func TestMemoryStoreCreateAccount(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	id, err := store.CreateAccount(ctx, "testuser", "hashedpw", "")
	if err != nil {
		t.Fatalf("CreateAccount failed: %v", err)
	}
	if id <= 0 {
		t.Errorf("Expected positive ID, got %d", id)
	}

	// Duplicate should fail
	_, err = store.CreateAccount(ctx, "testuser", "hashedpw", "")
	if err == nil {
		t.Error("Duplicate username should fail")
	}
}

func TestMemoryStoreGetAccount(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	store.CreateAccount(ctx, "user1", "hash1", "")

	id, hash, uuid, err := store.GetAccountByUsername(ctx, "user1")
	if err != nil {
		t.Fatalf("GetAccount failed: %v", err)
	}
	if id != 1 {
		t.Errorf("Expected ID=1, got %d", id)
	}
	if hash != "hash1" {
		t.Errorf("Expected hash=hash1, got %s", hash)
	}
	if uuid == "" {
		t.Error("Expected non-empty UUID")
	}

	// Non-existent
	_, _, _, err = store.GetAccountByUsername(ctx, "nobody")
	if err == nil {
		t.Error("Non-existent account should fail")
	}
}

func TestMemoryStoreUpdateLastLogin(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	err := store.UpdateLastLogin(ctx, 1)
	if err != nil {
		t.Errorf("UpdateLastLogin should not fail: %v", err)
	}
}

func TestMemoryStoreCreateCharacter(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	accID, _ := store.CreateAccount(ctx, "user1", "hash", "")

	charID, err := store.CreateCharacter(ctx, accID, "Hero", 0, 0, 0, 0, 0, 12, 12, 12, 12, 12, 10)
	if err != nil {
		t.Fatalf("CreateCharacter failed: %v", err)
	}
	if charID <= 0 {
		t.Errorf("Expected positive char ID, got %d", charID)
	}

	// Duplicate name should fail
	_, err = store.CreateCharacter(ctx, accID, "Hero", 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)
	if err == nil {
		t.Error("Duplicate character name should fail")
	}
}

func TestMemoryStoreGetCharacters(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	accID, _ := store.CreateAccount(ctx, "user1", "hash", "")
	store.CreateCharacter(ctx, accID, "Char1", 0, 0, 0, 0, 0, 12, 12, 12, 12, 12, 10)
	store.CreateCharacter(ctx, accID, "Char2", 1, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)

	chars, err := store.GetCharactersByAccount(ctx, accID)
	if err != nil {
		t.Fatalf("GetCharactersByAccount failed: %v", err)
	}
	if len(chars) != 2 {
		t.Errorf("Expected 2 characters, got %d", len(chars))
	}
}

func TestMemoryStoreGetCharacterByID(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	accID, _ := store.CreateAccount(ctx, "user1", "hash", "")
	charID, _ := store.CreateCharacter(ctx, accID, "Hero", 0, 1, 3, 2, 0, 15, 12, 13, 10, 10, 10)

	char, err := store.GetCharacterByID(ctx, charID, accID)
	if err != nil {
		t.Fatalf("GetCharacterByID failed: %v", err)
	}
	if char.Name != "Hero" {
		t.Errorf("Expected name=Hero, got %s", char.Name)
	}
	if char.STR != 15 {
		t.Errorf("Expected STR=15, got %d", char.STR)
	}
	if char.Level != 1 {
		t.Errorf("Expected Level=1, got %d", char.Level)
	}

	// Wrong account should fail
	_, err = store.GetCharacterByID(ctx, charID, 999)
	if err == nil {
		t.Error("Wrong account ID should fail")
	}

	// Non-existent
	_, err = store.GetCharacterByID(ctx, 999, accID)
	if err == nil {
		t.Error("Non-existent char should fail")
	}
}

func TestMemoryStoreDeleteCharacter(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	accID, _ := store.CreateAccount(ctx, "user1", "hash", "")
	charID, _ := store.CreateCharacter(ctx, accID, "Hero", 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)

	err := store.DeleteCharacter(ctx, charID, accID)
	if err != nil {
		t.Fatalf("DeleteCharacter failed: %v", err)
	}

	_, err = store.GetCharacterByID(ctx, charID, accID)
	if err == nil {
		t.Error("Deleted character should not be found")
	}

	// Delete non-existent
	err = store.DeleteCharacter(ctx, 999, accID)
	if err == nil {
		t.Error("Deleting non-existent should fail")
	}

	// Wrong account
	charID2, _ := store.CreateCharacter(ctx, accID, "Hero2", 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)
	err = store.DeleteCharacter(ctx, charID2, 999)
	if err == nil {
		t.Error("Wrong account should fail")
	}
}

func TestMemoryStoreSavePosition(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	accID, _ := store.CreateAccount(ctx, "user1", "hash", "")
	charID, _ := store.CreateCharacter(ctx, accID, "Hero", 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)

	err := store.SaveCharacterPosition(ctx, charID, "aresden", 100, 200, 3)
	if err != nil {
		t.Fatalf("SaveCharacterPosition failed: %v", err)
	}

	char, _ := store.GetCharacterByID(ctx, charID, accID)
	if char.MapName != "aresden" {
		t.Errorf("Expected map=aresden, got %s", char.MapName)
	}
	if char.PosX != 100 || char.PosY != 200 {
		t.Errorf("Expected (100,200), got (%d,%d)", char.PosX, char.PosY)
	}
	if char.Direction != 3 {
		t.Errorf("Expected direction=3, got %d", char.Direction)
	}

	// Non-existent
	err = store.SaveCharacterPosition(ctx, 999, "test", 0, 0, 1)
	if err == nil {
		t.Error("Non-existent char should fail")
	}
}

func TestMemoryStoreCountCharacters(t *testing.T) {
	store := NewMemoryStore()
	ctx := context.Background()

	accID, _ := store.CreateAccount(ctx, "user1", "hash", "")
	count, _ := store.CountCharacters(ctx, accID)
	if count != 0 {
		t.Errorf("Expected 0 characters, got %d", count)
	}

	store.CreateCharacter(ctx, accID, "C1", 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)
	store.CreateCharacter(ctx, accID, "C2", 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10)

	count, _ = store.CountCharacters(ctx, accID)
	if count != 2 {
		t.Errorf("Expected 2 characters, got %d", count)
	}

	// Different account
	accID2, _ := store.CreateAccount(ctx, "user2", "hash", "")
	count, _ = store.CountCharacters(ctx, accID2)
	if count != 0 {
		t.Errorf("Expected 0 characters for user2, got %d", count)
	}
}
