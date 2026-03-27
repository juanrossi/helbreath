package party

import (
	"fmt"
	"sync"
)

// MaxPartySize is the maximum number of members in a party.
const MaxPartySize = 8

// Member represents a party member.
type Member struct {
	ObjectID int32
	Name     string
	HP       int
	MaxHP    int
	Level    int
}

// Party represents a group of players.
type Party struct {
	ID       int32
	LeaderID int32 // object ID of party leader
	Members  map[int32]*Member
	mu       sync.RWMutex
}

// NewParty creates a new party with the given leader.
func NewParty(id int32, leaderID int32, leaderName string, hp, maxHP, level int) *Party {
	p := &Party{
		ID:       id,
		LeaderID: leaderID,
		Members:  make(map[int32]*Member),
	}
	p.Members[leaderID] = &Member{
		ObjectID: leaderID,
		Name:     leaderName,
		HP:       hp,
		MaxHP:    maxHP,
		Level:    level,
	}
	return p
}

// AddMember adds a member to the party.
func (p *Party) AddMember(objectID int32, name string, hp, maxHP, level int) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if len(p.Members) >= MaxPartySize {
		return fmt.Errorf("party is full")
	}
	if _, exists := p.Members[objectID]; exists {
		return fmt.Errorf("already in party")
	}
	p.Members[objectID] = &Member{
		ObjectID: objectID,
		Name:     name,
		HP:       hp,
		MaxHP:    maxHP,
		Level:    level,
	}
	return nil
}

// RemoveMember removes a member from the party.
func (p *Party) RemoveMember(objectID int32) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if _, exists := p.Members[objectID]; !exists {
		return fmt.Errorf("not in party")
	}
	delete(p.Members, objectID)

	// If leader left and party still has members, assign new leader
	if objectID == p.LeaderID && len(p.Members) > 0 {
		for id := range p.Members {
			p.LeaderID = id
			break
		}
	}
	return nil
}

// IsLeader returns whether the given object ID is the party leader.
func (p *Party) IsLeader(objectID int32) bool {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return p.LeaderID == objectID
}

// MemberCount returns the number of members.
func (p *Party) MemberCount() int {
	p.mu.RLock()
	defer p.mu.RUnlock()
	return len(p.Members)
}

// HasMember checks if an object ID is in the party.
func (p *Party) HasMember(objectID int32) bool {
	p.mu.RLock()
	defer p.mu.RUnlock()
	_, exists := p.Members[objectID]
	return exists
}

// GetMemberIDs returns a slice of all member object IDs.
func (p *Party) GetMemberIDs() []int32 {
	p.mu.RLock()
	defer p.mu.RUnlock()
	ids := make([]int32, 0, len(p.Members))
	for id := range p.Members {
		ids = append(ids, id)
	}
	return ids
}

// GetMembers returns a snapshot of all members.
func (p *Party) GetMembers() []*Member {
	p.mu.RLock()
	defer p.mu.RUnlock()
	list := make([]*Member, 0, len(p.Members))
	for _, m := range p.Members {
		list = append(list, &Member{
			ObjectID: m.ObjectID,
			Name:     m.Name,
			HP:       m.HP,
			MaxHP:    m.MaxHP,
			Level:    m.Level,
		})
	}
	return list
}

// UpdateMemberStats updates a member's HP/MaxHP/Level.
func (p *Party) UpdateMemberStats(objectID int32, hp, maxHP, level int) {
	p.mu.Lock()
	defer p.mu.Unlock()
	if m, exists := p.Members[objectID]; exists {
		m.HP = hp
		m.MaxHP = maxHP
		m.Level = level
	}
}

// PartyManager manages all active parties.
type PartyManager struct {
	parties    map[int32]*Party  // party ID -> party
	byPlayerID map[int32]*Party  // object ID -> party
	invites    map[int32]int32   // invited object ID -> inviter object ID
	nextID     int32
	mu         sync.RWMutex
}

// NewPartyManager creates a new party manager.
func NewPartyManager() *PartyManager {
	return &PartyManager{
		parties:    make(map[int32]*Party),
		byPlayerID: make(map[int32]*Party),
		invites:    make(map[int32]int32),
		nextID:     1,
	}
}

// CreateParty creates a new party with the given leader.
func (pm *PartyManager) CreateParty(leaderID int32, leaderName string, hp, maxHP, level int) *Party {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	id := pm.nextID
	pm.nextID++

	p := NewParty(id, leaderID, leaderName, hp, maxHP, level)
	pm.parties[id] = p
	pm.byPlayerID[leaderID] = p
	return p
}

// GetPlayerParty returns the party a player belongs to.
func (pm *PartyManager) GetPlayerParty(objectID int32) *Party {
	pm.mu.RLock()
	defer pm.mu.RUnlock()
	return pm.byPlayerID[objectID]
}

// InvitePlayer records a party invite.
func (pm *PartyManager) InvitePlayer(inviterID, targetID int32) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	if _, exists := pm.byPlayerID[targetID]; exists {
		return fmt.Errorf("player is already in a party")
	}
	if _, exists := pm.invites[targetID]; exists {
		return fmt.Errorf("player already has a pending invite")
	}
	pm.invites[targetID] = inviterID
	return nil
}

// AcceptInvite accepts a party invite.
func (pm *PartyManager) AcceptInvite(targetID int32, targetName string, hp, maxHP, level int) (*Party, error) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	inviterID, exists := pm.invites[targetID]
	if !exists {
		return nil, fmt.Errorf("no pending invite")
	}
	delete(pm.invites, targetID)

	party := pm.byPlayerID[inviterID]
	if party == nil {
		return nil, fmt.Errorf("inviter is no longer in a party")
	}

	if err := party.AddMember(targetID, targetName, hp, maxHP, level); err != nil {
		return nil, err
	}
	pm.byPlayerID[targetID] = party
	return party, nil
}

// DeclineInvite declines a party invite.
func (pm *PartyManager) DeclineInvite(targetID int32) {
	pm.mu.Lock()
	defer pm.mu.Unlock()
	delete(pm.invites, targetID)
}

// LeaveParty removes a player from their party.
func (pm *PartyManager) LeaveParty(objectID int32) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	party, exists := pm.byPlayerID[objectID]
	if !exists {
		return fmt.Errorf("not in a party")
	}

	if err := party.RemoveMember(objectID); err != nil {
		return err
	}
	delete(pm.byPlayerID, objectID)

	// Disband if only 1 member left
	if party.MemberCount() <= 1 {
		for id := range party.Members {
			delete(pm.byPlayerID, id)
		}
		delete(pm.parties, party.ID)
	}

	return nil
}

// KickMember kicks a member from a party (only leader can kick).
func (pm *PartyManager) KickMember(leaderID, targetID int32) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	party, exists := pm.byPlayerID[leaderID]
	if !exists {
		return fmt.Errorf("not in a party")
	}
	if !party.IsLeader(leaderID) {
		return fmt.Errorf("only party leader can kick")
	}
	if leaderID == targetID {
		return fmt.Errorf("cannot kick yourself")
	}

	if err := party.RemoveMember(targetID); err != nil {
		return err
	}
	delete(pm.byPlayerID, targetID)

	if party.MemberCount() <= 1 {
		for id := range party.Members {
			delete(pm.byPlayerID, id)
		}
		delete(pm.parties, party.ID)
	}

	return nil
}

// HasPendingInvite checks if a player has a pending invite.
func (pm *PartyManager) HasPendingInvite(objectID int32) bool {
	pm.mu.RLock()
	defer pm.mu.RUnlock()
	_, exists := pm.invites[objectID]
	return exists
}

// GetInviter returns the inviter for a pending invite.
func (pm *PartyManager) GetInviter(targetID int32) (int32, bool) {
	pm.mu.RLock()
	defer pm.mu.RUnlock()
	id, exists := pm.invites[targetID]
	return id, exists
}
