package guild

import (
	"fmt"
	"sync"
)

// Rank levels for guild members.
const (
	RankMember  = 1
	RankOfficer = 2
	RankMaster  = 3
)

// MinLevel is the minimum player level to create a guild.
const MinLevel = 20

// MinCHR is the minimum CHR stat to create a guild.
const MinCHR = 20

// MaxMembers is the maximum guild size.
const MaxMembers = 50

// Member represents a guild member.
type Member struct {
	CharacterID int
	Name        string
	Rank        int
	Level       int
	Online      bool
}

// Guild represents a player guild.
type Guild struct {
	ID       int
	Name     string
	Side     int // 1=Aresden, 2=Elvine
	MasterID int // character ID of guild master
	Members  map[int]*Member // character ID -> member
	mu       sync.RWMutex
}

// NewGuild creates a new guild.
func NewGuild(id int, name string, side int, masterID int, masterName string, masterLevel int) *Guild {
	g := &Guild{
		ID:       id,
		Name:     name,
		Side:     side,
		MasterID: masterID,
		Members:  make(map[int]*Member),
	}
	g.Members[masterID] = &Member{
		CharacterID: masterID,
		Name:        masterName,
		Rank:        RankMaster,
		Level:       masterLevel,
		Online:      true,
	}
	return g
}

// AddMember adds a member to the guild.
func (g *Guild) AddMember(charID int, name string, level int) error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if len(g.Members) >= MaxMembers {
		return fmt.Errorf("guild is full")
	}
	if _, exists := g.Members[charID]; exists {
		return fmt.Errorf("already in guild")
	}
	g.Members[charID] = &Member{
		CharacterID: charID,
		Name:        name,
		Rank:        RankMember,
		Level:       level,
		Online:      true,
	}
	return nil
}

// RemoveMember removes a member from the guild.
func (g *Guild) RemoveMember(charID int) error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if charID == g.MasterID {
		return fmt.Errorf("cannot remove guild master")
	}
	if _, exists := g.Members[charID]; !exists {
		return fmt.Errorf("not in guild")
	}
	delete(g.Members, charID)
	return nil
}

// Promote promotes a member to officer.
func (g *Guild) Promote(charID int) error {
	g.mu.Lock()
	defer g.mu.Unlock()

	m, exists := g.Members[charID]
	if !exists {
		return fmt.Errorf("not in guild")
	}
	if m.Rank >= RankOfficer {
		return fmt.Errorf("already officer or higher")
	}
	m.Rank = RankOfficer
	return nil
}

// Demote demotes an officer to member.
func (g *Guild) Demote(charID int) error {
	g.mu.Lock()
	defer g.mu.Unlock()

	m, exists := g.Members[charID]
	if !exists {
		return fmt.Errorf("not in guild")
	}
	if m.Rank != RankOfficer {
		return fmt.Errorf("not an officer")
	}
	m.Rank = RankMember
	return nil
}

// GetMember returns a member by character ID.
func (g *Guild) GetMember(charID int) *Member {
	g.mu.RLock()
	defer g.mu.RUnlock()
	return g.Members[charID]
}

// MemberCount returns the number of members.
func (g *Guild) MemberCount() int {
	g.mu.RLock()
	defer g.mu.RUnlock()
	return len(g.Members)
}

// GetMasterName returns the name of the guild master.
func (g *Guild) GetMasterName() string {
	g.mu.RLock()
	defer g.mu.RUnlock()
	m := g.Members[g.MasterID]
	if m == nil {
		return ""
	}
	return m.Name
}

// MemberList returns a snapshot of all members.
func (g *Guild) MemberList() []*Member {
	g.mu.RLock()
	defer g.mu.RUnlock()
	list := make([]*Member, 0, len(g.Members))
	for _, m := range g.Members {
		list = append(list, &Member{
			CharacterID: m.CharacterID,
			Name:        m.Name,
			Rank:        m.Rank,
			Level:       m.Level,
			Online:      m.Online,
		})
	}
	return list
}

// SetOnline marks a member as online/offline.
func (g *Guild) SetOnline(charID int, online bool) {
	g.mu.Lock()
	defer g.mu.Unlock()
	if m, exists := g.Members[charID]; exists {
		m.Online = online
	}
}

// GuildRegistry manages all guilds in the game.
type GuildRegistry struct {
	guilds     map[int]*Guild    // guild ID -> guild
	byName     map[string]*Guild // guild name -> guild
	byCharID   map[int]*Guild    // character ID -> guild
	nextGuildID int
	mu         sync.RWMutex
}

// NewGuildRegistry creates a new guild registry.
func NewGuildRegistry() *GuildRegistry {
	return &GuildRegistry{
		guilds:      make(map[int]*Guild),
		byName:      make(map[string]*Guild),
		byCharID:    make(map[int]*Guild),
		nextGuildID: 1,
	}
}

// CreateGuild creates a new guild and adds the creator as master.
func (r *GuildRegistry) CreateGuild(name string, side int, masterCharID int, masterName string, masterLevel int) (*Guild, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.byName[name]; exists {
		return nil, fmt.Errorf("guild name already taken")
	}
	if _, exists := r.byCharID[masterCharID]; exists {
		return nil, fmt.Errorf("already in a guild")
	}

	id := r.nextGuildID
	r.nextGuildID++

	g := NewGuild(id, name, side, masterCharID, masterName, masterLevel)
	r.guilds[id] = g
	r.byName[name] = g
	r.byCharID[masterCharID] = g

	return g, nil
}

// GetGuild returns a guild by ID.
func (r *GuildRegistry) GetGuild(id int) *Guild {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.guilds[id]
}

// GetGuildByName returns a guild by name.
func (r *GuildRegistry) GetGuildByName(name string) *Guild {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.byName[name]
}

// GetPlayerGuild returns the guild a character belongs to.
func (r *GuildRegistry) GetPlayerGuild(charID int) *Guild {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.byCharID[charID]
}

// JoinGuild adds a character to a guild.
func (r *GuildRegistry) JoinGuild(guildID int, charID int, name string, level int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.byCharID[charID]; exists {
		return fmt.Errorf("already in a guild")
	}

	g, exists := r.guilds[guildID]
	if !exists {
		return fmt.Errorf("guild not found")
	}

	if err := g.AddMember(charID, name, level); err != nil {
		return err
	}

	r.byCharID[charID] = g
	return nil
}

// LeaveGuild removes a character from their guild.
func (r *GuildRegistry) LeaveGuild(charID int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	g, exists := r.byCharID[charID]
	if !exists {
		return fmt.Errorf("not in a guild")
	}

	if err := g.RemoveMember(charID); err != nil {
		return err
	}

	delete(r.byCharID, charID)
	return nil
}

// DisbandGuild removes a guild entirely.
func (r *GuildRegistry) DisbandGuild(guildID int, requestorCharID int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	g, exists := r.guilds[guildID]
	if !exists {
		return fmt.Errorf("guild not found")
	}
	if g.MasterID != requestorCharID {
		return fmt.Errorf("only the guild master can disband")
	}

	// Remove all member -> guild mappings
	for charID := range g.Members {
		delete(r.byCharID, charID)
	}
	delete(r.guilds, guildID)
	delete(r.byName, g.Name)
	return nil
}
