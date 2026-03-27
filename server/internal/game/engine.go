package game

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/player"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/protobuf/proto"
)

// Direction deltas: index by direction (1=N through 8=NW)
var dirDX = [9]int{0, 0, 1, 1, 1, 0, -1, -1, -1}
var dirDY = [9]int{0, -1, -1, 0, 1, 1, 1, 0, -1}

var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9]{3,20}$`)
var charNameRegex = regexp.MustCompile(`^[a-zA-Z0-9]{3,10}$`)

type Engine struct {
	store     *db.Store
	maps      map[string]*mapdata.GameMap
	players   sync.Map // map[int32]*player.Player (by object ID)
	nextObjID atomic.Int32
	mu        sync.RWMutex
}

func NewEngine(store *db.Store) *Engine {
	e := &Engine{
		store: store,
		maps:  make(map[string]*mapdata.GameMap),
	}
	e.nextObjID.Store(1000) // start IDs above reserved range
	return e
}

func (e *Engine) LoadMaps(dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read map dir: %w", err)
	}

	for _, entry := range entries {
		if strings.ToLower(filepath.Ext(entry.Name())) != ".amd" {
			continue
		}
		path := filepath.Join(dir, entry.Name())
		gm, err := mapdata.LoadAMD(path)
		if err != nil {
			log.Printf("Warning: failed to load map %s: %v", entry.Name(), err)
			continue
		}
		e.maps[gm.Name] = gm
		log.Printf("Loaded map: %s (%dx%d)", gm.Name, gm.Width, gm.Height)
	}

	log.Printf("Loaded %d maps", len(e.maps))
	return nil
}

func (e *Engine) Run(ctx context.Context) {
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			// Game tick - future: NPC AI, regen, etc.
		}
	}
}

// OnConnect implements network.MessageHandler.
func (e *Engine) OnConnect(client *network.Client) {
	log.Println("Client connected")
}

// OnDisconnect implements network.MessageHandler.
func (e *Engine) OnDisconnect(client *network.Client) {
	if client.ObjectID == 0 {
		return
	}

	if val, ok := e.players.Load(client.ObjectID); ok {
		p := val.(*player.Player)
		log.Printf("Player %s disconnected", p.Name)

		// Save position
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		e.store.SaveCharacterPosition(ctx, p.CharacterID, p.MapName, p.X, p.Y, p.Direction)

		// Remove from map
		if gm, ok := e.maps[p.MapName]; ok {
			gm.ClearOwner(p.X, p.Y)
			gm.RemovePlayerFromSector(p.X, p.Y, p.ObjectID)

			// Notify nearby players
			disappear := &pb.PlayerDisappear{ObjectId: p.ObjectID}
			e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgPlayerDisappear, disappear)
		}

		e.players.Delete(client.ObjectID)
	}
}

// OnMessage implements network.MessageHandler.
func (e *Engine) OnMessage(client *network.Client, msgType byte, rawData []byte) {
	_, msg, err := network.Decode(rawData)
	if err != nil {
		log.Printf("Decode error: %v", err)
		return
	}

	switch msgType {
	case network.MsgLoginRequest:
		e.handleLogin(client, msg.(*pb.LoginRequest))
	case network.MsgCreateCharacterRequest:
		e.handleCreateCharacter(client, msg.(*pb.CreateCharacterRequest))
	case network.MsgDeleteCharacterRequest:
		e.handleDeleteCharacter(client, msg.(*pb.DeleteCharacterRequest))
	case network.MsgEnterGameRequest:
		e.handleEnterGame(client, msg.(*pb.EnterGameRequest))
	case network.MsgMotionRequest:
		e.handleMotion(client, msg.(*pb.MotionRequest))
	case network.MsgChatRequest:
		e.handleChat(client, msg.(*pb.ChatRequest))
	}
}

func (e *Engine) handleLogin(client *network.Client, req *pb.LoginRequest) {
	ctx := context.Background()

	if !usernameRegex.MatchString(req.Username) {
		e.sendLoginError(client, "Username must be 3-20 alphanumeric characters")
		return
	}
	if len(req.Password) < 6 || len(req.Password) > 30 {
		e.sendLoginError(client, "Password must be 6-30 characters")
		return
	}

	if req.Register {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
		if err != nil {
			e.sendLoginError(client, "Internal error")
			return
		}
		accountID, err := e.store.CreateAccount(ctx, req.Username, string(hash))
		if err != nil {
			e.sendLoginError(client, "Username already taken")
			return
		}
		client.AccountID = accountID
		e.sendLoginSuccess(client, nil)
		return
	}

	// Login
	accountID, hash, err := e.store.GetAccountByUsername(ctx, req.Username)
	if err != nil {
		e.sendLoginError(client, "Invalid username or password")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
		e.sendLoginError(client, "Invalid username or password")
		return
	}

	client.AccountID = accountID
	e.store.UpdateLastLogin(ctx, accountID)

	chars, err := e.store.GetCharactersByAccount(ctx, accountID)
	if err != nil {
		e.sendLoginError(client, "Failed to load characters")
		return
	}
	e.sendLoginSuccess(client, chars)
}

func (e *Engine) handleCreateCharacter(client *network.Client, req *pb.CreateCharacterRequest) {
	ctx := context.Background()

	if client.AccountID == 0 {
		return
	}

	if !charNameRegex.MatchString(req.Name) {
		e.sendCreateCharError(client, "Name must be 3-10 alphanumeric characters")
		return
	}

	// Validate stats: each >= 10, total = 70
	stats := []int32{req.Str, req.Vit, req.Dex, req.IntStat, req.Mag, req.Charisma}
	total := int32(0)
	for _, s := range stats {
		if s < 10 {
			e.sendCreateCharError(client, "Each stat must be at least 10")
			return
		}
		total += s
	}
	if total != 70 {
		e.sendCreateCharError(client, "Total stat points must equal 70")
		return
	}

	// Max 4 characters per account
	count, err := e.store.CountCharacters(ctx, client.AccountID)
	if err != nil || count >= 4 {
		e.sendCreateCharError(client, "Maximum 4 characters per account")
		return
	}

	// Validate appearance ranges
	if req.Gender < 0 || req.Gender > 1 || req.SkinColor < 0 || req.SkinColor > 2 ||
		req.HairStyle < 0 || req.HairStyle > 12 || req.HairColor < 0 || req.HairColor > 7 ||
		req.UnderwearColor < 0 || req.UnderwearColor > 7 {
		e.sendCreateCharError(client, "Invalid appearance values")
		return
	}

	_, err = e.store.CreateCharacter(ctx, client.AccountID, req.Name,
		int(req.Gender), int(req.SkinColor), int(req.HairStyle), int(req.HairColor),
		int(req.UnderwearColor), int(req.Str), int(req.Vit), int(req.Dex),
		int(req.IntStat), int(req.Mag), int(req.Charisma))
	if err != nil {
		e.sendCreateCharError(client, "Character name already taken")
		return
	}

	chars, _ := e.store.GetCharactersByAccount(ctx, client.AccountID)
	e.sendCreateCharSuccess(client, chars)
}

func (e *Engine) handleDeleteCharacter(client *network.Client, req *pb.DeleteCharacterRequest) {
	ctx := context.Background()
	if client.AccountID == 0 {
		return
	}

	err := e.store.DeleteCharacter(ctx, int(req.CharacterId), client.AccountID)
	if err != nil {
		e.sendDeleteCharResponse(client, false, "Failed to delete character")
		return
	}

	chars, _ := e.store.GetCharactersByAccount(ctx, client.AccountID)
	e.sendDeleteCharResponse(client, true, "")
	_ = chars
}

func (e *Engine) handleEnterGame(client *network.Client, req *pb.EnterGameRequest) {
	ctx := context.Background()
	if client.AccountID == 0 {
		return
	}

	charRow, err := e.store.GetCharacterByID(ctx, int(req.CharacterId), client.AccountID)
	if err != nil {
		log.Printf("EnterGame: character not found: %v", err)
		return
	}

	objectID := e.nextObjID.Add(1)
	p := player.FromDB(charRow, objectID, client)
	client.ObjectID = objectID
	client.CharacterID = charRow.ID

	gm, ok := e.maps[p.MapName]
	if !ok {
		// Fallback to default map
		p.MapName = "default"
		gm = e.maps["default"]
		if gm == nil {
			log.Printf("No default map loaded!")
			return
		}
	}

	// Find a walkable position near the saved position
	if !gm.IsWalkable(p.X, p.Y) {
		p.X, p.Y = e.findWalkable(gm, p.X, p.Y)
	}

	gm.SetOwner(p.X, p.Y, objectID)
	gm.AddPlayerToSector(p.X, p.Y, objectID)
	e.players.Store(objectID, p)

	// Send EnterGameResponse
	nearbyPlayers := e.getNearbyEntityInfos(gm, p.X, p.Y, objectID)

	resp := &pb.EnterGameResponse{
		Player: p.ToContents(),
		MapInfo: &pb.MapInfo{
			Name:          gm.Name,
			Width:         int32(gm.Width),
			Height:        int32(gm.Height),
			CollisionGrid: gm.PackCollisionGrid(),
		},
		NearbyPlayers: nearbyPlayers,
	}

	data, _ := network.Encode(network.MsgEnterGameResponse, resp)
	client.Send(data)

	// Notify nearby players about this player
	appear := p.ToPlayerAppear()
	e.broadcastToNearby(gm, p.X, p.Y, objectID, network.MsgPlayerAppear, appear)

	log.Printf("Player %s entered game on map %s at (%d,%d)", p.Name, p.MapName, p.X, p.Y)
}

func (e *Engine) handleMotion(client *network.Client, req *pb.MotionRequest) {
	if client.ObjectID == 0 {
		return
	}

	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return
	}
	p := val.(*player.Player)

	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	dir := int(req.Direction)
	action := int(req.Action)

	if dir < 1 || dir > 8 {
		return
	}

	if action == 1 || action == 2 { // walk or run
		// Anti-speed-hack: check time since last move
		now := time.Now()
		minInterval := 350 * time.Millisecond // run speed
		if action == 1 {
			minInterval = 400 * time.Millisecond // walk speed (slightly relaxed)
		}
		if now.Sub(p.LastMoveTime) < minInterval {
			// Too fast - send correction
			e.sendMotionCorrection(p, gm)
			return
		}

		newX := p.X + dirDX[dir]
		newY := p.Y + dirDY[dir]

		if !gm.IsWalkable(newX, newY) {
			e.sendMotionCorrection(p, gm)
			return
		}

		// Check for teleport
		if gm.IsTeleport(newX, newY) {
			// TODO: handle teleport destinations from config
		}

		// Update position
		oldSectorX := p.X / mapdata.SectorSize
		oldSectorY := p.Y / mapdata.SectorSize

		gm.ClearOwner(p.X, p.Y)
		p.X = newX
		p.Y = newY
		p.Direction = dir
		p.Action = action
		p.LastMoveTime = now
		gm.SetOwner(p.X, p.Y, p.ObjectID)

		// Update sector if changed
		newSectorX := p.X / mapdata.SectorSize
		newSectorY := p.Y / mapdata.SectorSize
		if oldSectorX != newSectorX || oldSectorY != newSectorY {
			gm.RemovePlayerFromSector(p.X-dirDX[dir], p.Y-dirDY[dir], p.ObjectID)
			gm.AddPlayerToSector(p.X, p.Y, p.ObjectID)
			// TODO: send appear/disappear for sector boundary crossing
		}

		// Broadcast movement to nearby players
		speed := int32(490)
		if action == 2 {
			speed = 350
		}

		motionEvent := &pb.MotionEvent{
			ObjectId:  p.ObjectID,
			OwnerType: 1, // player
			Action:    int32(action),
			Direction: int32(dir),
			Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
			Speed:     speed,
			Name:      p.Name,
		}
		e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgMotionEvent, motionEvent)
	} else if action == 0 { // stop
		p.Direction = dir
		p.Action = 0

		motionEvent := &pb.MotionEvent{
			ObjectId:  p.ObjectID,
			OwnerType: 1,
			Action:    0,
			Direction: int32(dir),
			Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
			Name:      p.Name,
		}
		e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgMotionEvent, motionEvent)
	}
}

func (e *Engine) handleChat(client *network.Client, req *pb.ChatRequest) {
	if client.ObjectID == 0 {
		return
	}

	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return
	}
	p := val.(*player.Player)

	gm, ok := e.maps[p.MapName]
	if !ok {
		return
	}

	// Limit message length
	msg := req.Message
	if len(msg) > 200 {
		msg = msg[:200]
	}
	if len(msg) == 0 {
		return
	}

	chatMsg := &pb.ChatMessage{
		ObjectId:   p.ObjectID,
		SenderName: p.Name,
		Type:       req.Type,
		Message:    msg,
		Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
	}

	switch req.Type {
	case 0: // normal - nearby players
		e.broadcastToNearby(gm, p.X, p.Y, -1, network.MsgChatMessage, chatMsg)
	case 1: // shout - all players on map
		e.broadcastToMap(p.MapName, network.MsgChatMessage, chatMsg)
	case 2: // whisper - specific player
		e.sendWhisper(req.Target, chatMsg)
	}
}

// Helper functions

func (e *Engine) sendLoginError(client *network.Client, errMsg string) {
	resp := &pb.LoginResponse{Success: false, Error: errMsg}
	data, _ := network.Encode(network.MsgLoginResponse, resp)
	client.Send(data)
}

func (e *Engine) sendLoginSuccess(client *network.Client, chars []db.CharacterRow) {
	resp := &pb.LoginResponse{Success: true}
	for _, c := range chars {
		resp.Characters = append(resp.Characters, charRowToSummary(c))
	}
	data, _ := network.Encode(network.MsgLoginResponse, resp)
	client.Send(data)
}

func (e *Engine) sendCreateCharError(client *network.Client, errMsg string) {
	resp := &pb.CreateCharacterResponse{Success: false, Error: errMsg}
	data, _ := network.Encode(network.MsgCreateCharResponse, resp)
	client.Send(data)
}

func (e *Engine) sendCreateCharSuccess(client *network.Client, chars []db.CharacterRow) {
	resp := &pb.CreateCharacterResponse{Success: true}
	for _, c := range chars {
		resp.Characters = append(resp.Characters, charRowToSummary(c))
	}
	data, _ := network.Encode(network.MsgCreateCharResponse, resp)
	client.Send(data)
}

func (e *Engine) sendDeleteCharResponse(client *network.Client, success bool, errMsg string) {
	resp := &pb.DeleteCharacterResponse{Success: success, Error: errMsg}
	data, _ := network.Encode(network.MsgDeleteCharResponse, resp)
	client.Send(data)
}

func (e *Engine) sendMotionCorrection(p *player.Player, gm *mapdata.GameMap) {
	motionEvent := &pb.MotionEvent{
		ObjectId:  p.ObjectID,
		OwnerType: 1,
		Action:    0, // force stop
		Direction: int32(p.Direction),
		Position:  &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
		Name:      p.Name,
	}
	data, _ := network.Encode(network.MsgMotionEvent, motionEvent)
	p.Send(data)
}

func (e *Engine) broadcastToNearby(gm *mapdata.GameMap, x, y int, excludeID int32, msgType byte, msg proto.Message) {
	data, err := network.Encode(msgType, msg)
	if err != nil {
		return
	}

	nearbyIDs := gm.GetNearbyPlayerIDs(x, y)
	for _, id := range nearbyIDs {
		if id == excludeID {
			continue
		}
		if val, ok := e.players.Load(id); ok {
			val.(*player.Player).Send(data)
		}
	}
}

func (e *Engine) broadcastToMap(mapName string, msgType byte, msg proto.Message) {
	data, err := network.Encode(msgType, msg)
	if err != nil {
		return
	}

	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if p.MapName == mapName {
			p.Send(data)
		}
		return true
	})
}

func (e *Engine) sendWhisper(targetName string, msg *pb.ChatMessage) {
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if p.Name == targetName {
			data, _ := network.Encode(network.MsgChatMessage, msg)
			p.Send(data)
			return false // stop iterating
		}
		return true
	})
}

func (e *Engine) getNearbyEntityInfos(gm *mapdata.GameMap, x, y int, excludeID int32) []*pb.EntityInfo {
	nearbyIDs := gm.GetNearbyPlayerIDs(x, y)
	var infos []*pb.EntityInfo

	for _, id := range nearbyIDs {
		if id == excludeID {
			continue
		}
		if val, ok := e.players.Load(id); ok {
			p := val.(*player.Player)
			infos = append(infos, &pb.EntityInfo{
				ObjectId:   p.ObjectID,
				EntityType: 1,
				Name:       p.Name,
				Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
				Direction:  int32(p.Direction),
				Action:     int32(p.Action),
				Appearance: p.ToAppearance(),
				Level:      int32(p.Level),
				Side:       int32(p.Side),
			})
		}
	}
	return infos
}

func (e *Engine) findWalkable(gm *mapdata.GameMap, startX, startY int) (int, int) {
	// Spiral search for nearest walkable tile
	for radius := 0; radius < 50; radius++ {
		for dy := -radius; dy <= radius; dy++ {
			for dx := -radius; dx <= radius; dx++ {
				if dx != -radius && dx != radius && dy != -radius && dy != radius {
					continue // only check border of current radius
				}
				x, y := startX+dx, startY+dy
				if gm.IsWalkable(x, y) {
					return x, y
				}
			}
		}
	}
	// Last resort: center of map
	return gm.Width / 2, gm.Height / 2
}

func (e *Engine) SaveAllPlayers() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		e.store.SaveCharacterPosition(ctx, p.CharacterID, p.MapName, p.X, p.Y, p.Direction)
		log.Printf("Saved player %s", p.Name)
		return true
	})
}

func charRowToSummary(c db.CharacterRow) *pb.CharacterSummary {
	return &pb.CharacterSummary{
		Id:      int32(c.ID),
		Name:    c.Name,
		Level:   int32(c.Level),
		Gender:  int32(c.Gender),
		Side:    int32(c.Side),
		MapName: c.MapName,
		Appearance: &pb.Appearance{
			Gender:         int32(c.Gender),
			SkinColor:      int32(c.SkinColor),
			HairStyle:      int32(c.HairStyle),
			HairColor:      int32(c.HairColor),
			UnderwearColor: int32(c.UnderwearColor),
		},
	}
}
