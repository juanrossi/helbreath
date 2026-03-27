package quest

import (
	"fmt"
	"sync"
)

// Quest types
const (
	QuestTypeHunt     = 1 // Kill N monsters of type X
	QuestTypeDelivery = 2 // Deliver item to NPC
	QuestTypeCollect  = 3 // Collect N items of type X
)

// Quest states
const (
	QuestStateAvailable  = 0
	QuestStateActive     = 1
	QuestStateCompleted  = 2
	QuestStateTurnedIn   = 3
)

// QuestDef defines a quest template.
type QuestDef struct {
	ID          int
	Name        string
	Description string
	Type        int
	MinLevel    int
	// Requirements
	TargetNpcType int // for hunt quests: NPC type ID to kill
	TargetItemID  int // for delivery/collect quests: item ID
	TargetCount   int // number of kills/items needed
	TurnInNpcID   int // NPC type to turn quest in to
	// Rewards
	RewardXP     int64
	RewardGold   int64
	RewardItemID int // 0 = no item reward
	RewardCount  int
	// Prerequisite
	PrereqQuestID int // 0 = no prerequisite
}

// PlayerQuest tracks a player's progress on a quest.
type PlayerQuest struct {
	QuestID  int
	State    int
	Progress int // current kill/collect count
}

// QuestDB holds all quest definitions.
var QuestDB = map[int]*QuestDef{}

func init() {
	QuestDB[1] = &QuestDef{
		ID: 1, Name: "Slime Slayer", Description: "Kill 10 slimes",
		Type: QuestTypeHunt, MinLevel: 1,
		TargetNpcType: 1, TargetCount: 10, TurnInNpcID: 10,
		RewardXP: 500, RewardGold: 100,
	}
	QuestDB[2] = &QuestDef{
		ID: 2, Name: "Skeleton Bane", Description: "Kill 15 skeletons",
		Type: QuestTypeHunt, MinLevel: 5,
		TargetNpcType: 2, TargetCount: 15, TurnInNpcID: 10,
		RewardXP: 1500, RewardGold: 300, PrereqQuestID: 1,
	}
	QuestDB[3] = &QuestDef{
		ID: 3, Name: "Orc Hunter", Description: "Kill 20 orcs",
		Type: QuestTypeHunt, MinLevel: 10,
		TargetNpcType: 3, TargetCount: 20, TurnInNpcID: 10,
		RewardXP: 3000, RewardGold: 500, PrereqQuestID: 2,
	}
	QuestDB[4] = &QuestDef{
		ID: 4, Name: "Herb Gathering", Description: "Collect 5 Red Herbs",
		Type: QuestTypeCollect, MinLevel: 3,
		TargetItemID: 200, TargetCount: 5, TurnInNpcID: 12,
		RewardXP: 300, RewardGold: 50, RewardItemID: 100, RewardCount: 3,
	}
	QuestDB[5] = &QuestDef{
		ID: 5, Name: "Mining Apprentice", Description: "Collect 10 Iron Ore",
		Type: QuestTypeCollect, MinLevel: 8,
		TargetItemID: 210, TargetCount: 10, TurnInNpcID: 11,
		RewardXP: 1000, RewardGold: 200,
	}
	QuestDB[6] = &QuestDef{
		ID: 6, Name: "Fish Delivery", Description: "Deliver 3 Raw Fish to the Potion Merchant",
		Type: QuestTypeDelivery, MinLevel: 5,
		TargetItemID: 220, TargetCount: 3, TurnInNpcID: 12,
		RewardXP: 400, RewardGold: 80,
	}
	QuestDB[7] = &QuestDef{
		ID: 7, Name: "Demon Extermination", Description: "Kill 10 demons",
		Type: QuestTypeHunt, MinLevel: 20,
		TargetNpcType: 4, TargetCount: 10, TurnInNpcID: 10,
		RewardXP: 5000, RewardGold: 1000, PrereqQuestID: 3,
	}
	QuestDB[8] = &QuestDef{
		ID: 8, Name: "Blue Herb Collection", Description: "Collect 5 Blue Herbs",
		Type: QuestTypeCollect, MinLevel: 5,
		TargetItemID: 201, TargetCount: 5, TurnInNpcID: 12,
		RewardXP: 500, RewardGold: 100, RewardItemID: 101, RewardCount: 2,
	}
}

// GetQuestDef returns a quest definition by ID.
func GetQuestDef(id int) *QuestDef {
	return QuestDB[id]
}

// QuestTracker manages a player's quests.
type QuestTracker struct {
	Quests    map[int]*PlayerQuest // quest ID -> player quest
	Completed map[int]bool         // quest IDs that have been turned in
	mu        sync.RWMutex
}

// NewQuestTracker creates a new quest tracker.
func NewQuestTracker() *QuestTracker {
	return &QuestTracker{
		Quests:    make(map[int]*PlayerQuest),
		Completed: make(map[int]bool),
	}
}

// AcceptQuest starts a quest for the player.
func (qt *QuestTracker) AcceptQuest(questID int, playerLevel int) error {
	qt.mu.Lock()
	defer qt.mu.Unlock()

	def := QuestDB[questID]
	if def == nil {
		return fmt.Errorf("quest not found")
	}
	if playerLevel < def.MinLevel {
		return fmt.Errorf("level too low (need %d)", def.MinLevel)
	}
	if _, exists := qt.Quests[questID]; exists {
		return fmt.Errorf("quest already accepted")
	}
	if qt.Completed[questID] {
		return fmt.Errorf("quest already completed")
	}
	if def.PrereqQuestID > 0 && !qt.Completed[def.PrereqQuestID] {
		return fmt.Errorf("prerequisite quest not completed")
	}

	qt.Quests[questID] = &PlayerQuest{
		QuestID:  questID,
		State:    QuestStateActive,
		Progress: 0,
	}
	return nil
}

// OnNPCKill updates kill-quest progress when a player kills an NPC.
func (qt *QuestTracker) OnNPCKill(npcTypeID int) []int {
	qt.mu.Lock()
	defer qt.mu.Unlock()

	var completed []int
	for _, pq := range qt.Quests {
		if pq.State != QuestStateActive {
			continue
		}
		def := QuestDB[pq.QuestID]
		if def == nil || def.Type != QuestTypeHunt {
			continue
		}
		if def.TargetNpcType == npcTypeID {
			pq.Progress++
			if pq.Progress >= def.TargetCount {
				pq.State = QuestStateCompleted
				completed = append(completed, pq.QuestID)
			}
		}
	}
	return completed
}

// OnItemCollect updates collect-quest progress.
func (qt *QuestTracker) OnItemCollect(itemID int, count int) []int {
	qt.mu.Lock()
	defer qt.mu.Unlock()

	var completed []int
	for _, pq := range qt.Quests {
		if pq.State != QuestStateActive {
			continue
		}
		def := QuestDB[pq.QuestID]
		if def == nil || def.Type != QuestTypeCollect {
			continue
		}
		if def.TargetItemID == itemID {
			pq.Progress += count
			if pq.Progress >= def.TargetCount {
				pq.Progress = def.TargetCount
				pq.State = QuestStateCompleted
				completed = append(completed, pq.QuestID)
			}
		}
	}
	return completed
}

// TurnInQuest completes a quest and marks it as turned in.
func (qt *QuestTracker) TurnInQuest(questID int) (*QuestDef, error) {
	qt.mu.Lock()
	defer qt.mu.Unlock()

	pq, exists := qt.Quests[questID]
	if !exists {
		return nil, fmt.Errorf("quest not active")
	}

	def := QuestDB[questID]
	if def == nil {
		return nil, fmt.Errorf("quest definition not found")
	}

	// Delivery/collect quests can be turned in once items are in inventory
	// Hunt quests must be in completed state
	if def.Type == QuestTypeHunt && pq.State != QuestStateCompleted {
		return nil, fmt.Errorf("quest not completed (progress: %d/%d)", pq.Progress, def.TargetCount)
	}

	delete(qt.Quests, questID)
	qt.Completed[questID] = true
	return def, nil
}

// GetActiveQuests returns all active/completed quests.
func (qt *QuestTracker) GetActiveQuests() []*PlayerQuest {
	qt.mu.RLock()
	defer qt.mu.RUnlock()
	result := make([]*PlayerQuest, 0, len(qt.Quests))
	for _, pq := range qt.Quests {
		result = append(result, &PlayerQuest{
			QuestID:  pq.QuestID,
			State:    pq.State,
			Progress: pq.Progress,
		})
	}
	return result
}

// GetAvailableQuests returns quest IDs available for a player at a given level.
func (qt *QuestTracker) GetAvailableQuests(playerLevel int) []int {
	qt.mu.RLock()
	defer qt.mu.RUnlock()

	var available []int
	for id, def := range QuestDB {
		if playerLevel < def.MinLevel {
			continue
		}
		if _, active := qt.Quests[id]; active {
			continue
		}
		if qt.Completed[id] {
			continue
		}
		if def.PrereqQuestID > 0 && !qt.Completed[def.PrereqQuestID] {
			continue
		}
		available = append(available, id)
	}
	return available
}

// HasCompletedQuest checks if a quest was completed and turned in.
func (qt *QuestTracker) HasCompletedQuest(questID int) bool {
	qt.mu.RLock()
	defer qt.mu.RUnlock()
	return qt.Completed[questID]
}

// ActiveQuestCount returns the number of active quests.
func (qt *QuestTracker) ActiveQuestCount() int {
	qt.mu.RLock()
	defer qt.mu.RUnlock()
	return len(qt.Quests)
}
