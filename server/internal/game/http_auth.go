package game

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// writeJSON sends a JSON response with the given status code and CORS headers.
func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// handleCORS handles preflight OPTIONS requests.
func handleCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return true
	}
	return false
}

// extractBearerToken extracts the JWT token from the Authorization header.
func extractBearerToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if strings.HasPrefix(auth, "Bearer ") {
		return strings.TrimPrefix(auth, "Bearer ")
	}
	return ""
}

// resolveAccountID validates a JWT token and resolves the UUID to an internal account ID.
func (e *Engine) resolveAccountID(w http.ResponseWriter, r *http.Request) (int, bool) {
	token := extractBearerToken(r)
	if token == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]any{"success": false, "error": "Missing auth token"})
		return 0, false
	}
	claims, err := e.jwtManager.ValidateToken(token)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]any{"success": false, "error": "Invalid auth token"})
		return 0, false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	accountID, err := e.store.GetAccountIDByUUID(ctx, claims.UUID)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]any{"success": false, "error": "Account not found"})
		return 0, false
	}
	return accountID, true
}

// HandleHTTPLogin handles POST /api/login for both login and registration.
func (e *Engine) HandleHTTPLogin(w http.ResponseWriter, r *http.Request) {
	if handleCORS(w, r) {
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"success": false, "error": "Method not allowed"})
		return
	}

	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
		Register bool   `json:"register"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Invalid request"})
		return
	}

	if !usernameRegex.MatchString(req.Username) {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Username must be 3-20 alphanumeric characters"})
		return
	}
	if len(req.Password) < 6 || len(req.Password) > 30 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Password must be 6-30 characters"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if req.Register {
		// Validate email for registration
		if req.Email == "" || !strings.Contains(req.Email, "@") || len(req.Email) > 255 {
			writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "A valid email address is required"})
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Internal error"})
			return
		}
		accountID, err := e.store.CreateAccount(ctx, req.Username, string(hash), req.Email)
		if err != nil {
			writeJSON(w, http.StatusConflict, map[string]any{"success": false, "error": "Username already taken"})
			return
		}

		uuid, err := e.store.GetAccountUUID(ctx, accountID)
		if err != nil {
			log.Printf("Failed to get UUID for new account %d: %v", accountID, err)
			writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Internal error"})
			return
		}
		token, err := e.jwtManager.GenerateToken(req.Username, uuid)
		if err != nil {
			log.Printf("Failed to generate JWT for account %d: %v", accountID, err)
			writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Internal error"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"success":    true,
			"token":      token,
			"characters": []any{},
		})
		return
	}

	// Login
	accountID, hash, uuid, err := e.store.GetAccountByUsername(ctx, req.Username)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]any{"success": false, "error": "Invalid username or password"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]any{"success": false, "error": "Invalid username or password"})
		return
	}

	e.store.UpdateLastLogin(ctx, accountID)

	token, err := e.jwtManager.GenerateToken(req.Username, uuid)
	if err != nil {
		log.Printf("Failed to generate JWT for account %d: %v", accountID, err)
		writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Internal error"})
		return
	}

	// Load characters
	chars, err := e.store.GetCharactersByAccount(ctx, accountID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Failed to load characters"})
		return
	}

	charList := make([]map[string]any, 0, len(chars))
	for _, c := range chars {
		charList = append(charList, map[string]any{
			"id":      c.ID,
			"name":    c.Name,
			"level":   c.Level,
			"gender":  c.Gender,
			"side":    c.Side,
			"mapName": c.MapName,
		})
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"success":    true,
		"token":      token,
		"characters": charList,
	})
}

// HandleHTTPCharacters handles GET /api/characters — list characters for the authenticated account.
func (e *Engine) HandleHTTPCharacters(w http.ResponseWriter, r *http.Request) {
	if handleCORS(w, r) {
		return
	}

	accountID, ok := e.resolveAccountID(w, r)
	if !ok {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	chars, err := e.store.GetCharactersByAccount(ctx, accountID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Failed to load characters"})
		return
	}

	charList := make([]map[string]any, 0, len(chars))
	for _, c := range chars {
		charList = append(charList, map[string]any{
			"id":      c.ID,
			"name":    c.Name,
			"level":   c.Level,
			"gender":  c.Gender,
			"side":    c.Side,
			"mapName": c.MapName,
		})
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"success":    true,
		"characters": charList,
	})
}

// HandleHTTPCreateCharacter handles POST /api/characters/create.
func (e *Engine) HandleHTTPCreateCharacter(w http.ResponseWriter, r *http.Request) {
	if handleCORS(w, r) {
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"success": false, "error": "Method not allowed"})
		return
	}

	accountID, ok := e.resolveAccountID(w, r)
	if !ok {
		return
	}

	var req struct {
		Name           string `json:"name"`
		Gender         int    `json:"gender"`
		SkinColor      int    `json:"skinColor"`
		HairStyle      int    `json:"hairStyle"`
		HairColor      int    `json:"hairColor"`
		UnderwearColor int    `json:"underwearColor"`
		Str            int    `json:"str"`
		Vit            int    `json:"vit"`
		Dex            int    `json:"dex"`
		IntStat        int    `json:"intStat"`
		Mag            int    `json:"mag"`
		Charisma       int    `json:"charisma"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Invalid request"})
		return
	}

	if !charNameRegex.MatchString(req.Name) {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Name must be 3-10 alphanumeric characters"})
		return
	}

	// Validate stats
	stats := []int{req.Str, req.Vit, req.Dex, req.IntStat, req.Mag, req.Charisma}
	total := 0
	for _, s := range stats {
		if s < 10 {
			writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Each stat must be at least 10"})
			return
		}
		total += s
	}
	if total != 70 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Total stat points must equal 70"})
		return
	}

	// Validate appearance
	if req.Gender < 0 || req.Gender > 1 || req.SkinColor < 0 || req.SkinColor > 2 ||
		req.HairStyle < 0 || req.HairStyle > 12 || req.HairColor < 0 || req.HairColor > 7 ||
		req.UnderwearColor < 0 || req.UnderwearColor > 7 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Invalid appearance values"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Max 4 characters per account
	count, err := e.store.CountCharacters(ctx, accountID)
	if err != nil || count >= 4 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Maximum 4 characters per account"})
		return
	}

	_, err = e.store.CreateCharacter(ctx, accountID, req.Name,
		req.Gender, req.SkinColor, req.HairStyle, req.HairColor,
		req.UnderwearColor, req.Str, req.Vit, req.Dex,
		req.IntStat, req.Mag, req.Charisma)
	if err != nil {
		writeJSON(w, http.StatusConflict, map[string]any{"success": false, "error": "Character name already taken"})
		return
	}

	chars, err := e.store.GetCharactersByAccount(ctx, accountID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Failed to load characters"})
		return
	}

	charList := make([]map[string]any, 0, len(chars))
	for _, c := range chars {
		charList = append(charList, map[string]any{
			"id":      c.ID,
			"name":    c.Name,
			"level":   c.Level,
			"gender":  c.Gender,
			"side":    c.Side,
			"mapName": c.MapName,
		})
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"success":    true,
		"characters": charList,
	})
}

// HandleHTTPDeleteCharacter handles POST /api/characters/delete.
func (e *Engine) HandleHTTPDeleteCharacter(w http.ResponseWriter, r *http.Request) {
	if handleCORS(w, r) {
		return
	}
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"success": false, "error": "Method not allowed"})
		return
	}

	accountID, ok := e.resolveAccountID(w, r)
	if !ok {
		return
	}

	var req struct {
		CharacterID int `json:"characterId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Invalid request"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := e.store.DeleteCharacter(ctx, req.CharacterID, accountID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"success": false, "error": "Failed to delete character"})
		return
	}

	chars, err := e.store.GetCharactersByAccount(ctx, accountID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{"success": false, "error": "Failed to load characters"})
		return
	}

	charList := make([]map[string]any, 0, len(chars))
	for _, c := range chars {
		charList = append(charList, map[string]any{
			"id":      c.ID,
			"name":    c.Name,
			"level":   c.Level,
			"gender":  c.Gender,
			"side":    c.Side,
			"mapName": c.MapName,
		})
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"success":    true,
		"characters": charList,
	})
}
