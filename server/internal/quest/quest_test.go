package quest

import (
	"testing"
)

func TestQuestDBLoaded(t *testing.T) {
	if len(QuestDB) == 0 {
		t.Fatal("no quests loaded")
	}
	if QuestDB[1] == nil || QuestDB[1].Name != "Slime Slayer" {
		t.Fatal("quest 1 not loaded correctly")
	}
}

func TestGetQuestDef(t *testing.T) {
	def := GetQuestDef(1)
	if def == nil {
		t.Fatal("expected quest def")
	}
	if def.Type != QuestTypeHunt {
		t.Fatal("expected hunt type")
	}
	if GetQuestDef(999) != nil {
		t.Fatal("expected nil for nonexistent quest")
	}
}

func TestAcceptQuest(t *testing.T) {
	qt := NewQuestTracker()
	err := qt.AcceptQuest(1, 1) // Slime Slayer, minLevel 1
	if err != nil {
		t.Fatal(err)
	}
	if qt.ActiveQuestCount() != 1 {
		t.Fatal("expected 1 active quest")
	}
}

func TestAcceptQuestLevelTooLow(t *testing.T) {
	qt := NewQuestTracker()
	err := qt.AcceptQuest(3, 1) // Orc Hunter, minLevel 10
	if err == nil {
		t.Fatal("expected level error")
	}
}

func TestAcceptQuestDuplicate(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	err := qt.AcceptQuest(1, 10)
	if err == nil {
		t.Fatal("expected duplicate error")
	}
}

func TestAcceptQuestPrereq(t *testing.T) {
	qt := NewQuestTracker()
	// Quest 2 requires quest 1 to be completed
	err := qt.AcceptQuest(2, 20)
	if err == nil {
		t.Fatal("expected prereq error")
	}
}

func TestAcceptQuestAfterPrereq(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	// Manually complete quest 1 by killing enough slimes
	for i := 0; i < 10; i++ {
		qt.OnNPCKill(1)
	}
	qt.TurnInQuest(1)
	// Now quest 2 should be available
	err := qt.AcceptQuest(2, 10)
	if err != nil {
		t.Fatal(err)
	}
}

func TestOnNPCKill(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10) // Kill 10 slimes

	// Kill 9 slimes - not complete
	for i := 0; i < 9; i++ {
		completed := qt.OnNPCKill(1)
		if len(completed) > 0 {
			t.Fatal("should not be complete yet")
		}
	}

	// 10th kill
	completed := qt.OnNPCKill(1)
	if len(completed) != 1 || completed[0] != 1 {
		t.Fatal("expected quest 1 to be completed")
	}

	// Check state
	quests := qt.GetActiveQuests()
	for _, pq := range quests {
		if pq.QuestID == 1 && pq.State != QuestStateCompleted {
			t.Fatal("expected completed state")
		}
	}
}

func TestOnNPCKillWrongType(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10) // Kill slimes (type 1)
	completed := qt.OnNPCKill(2) // Kill skeleton (type 2)
	if len(completed) > 0 {
		t.Fatal("should not complete from wrong NPC type")
	}
}

func TestOnItemCollect(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(4, 10) // Collect 5 Red Herbs (item 200)

	completed := qt.OnItemCollect(200, 3)
	if len(completed) > 0 {
		t.Fatal("should not be complete yet")
	}

	completed = qt.OnItemCollect(200, 2)
	if len(completed) != 1 || completed[0] != 4 {
		t.Fatal("expected quest 4 to be completed")
	}
}

func TestTurnInQuest(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	for i := 0; i < 10; i++ {
		qt.OnNPCKill(1)
	}

	def, err := qt.TurnInQuest(1)
	if err != nil {
		t.Fatal(err)
	}
	if def.RewardXP != 500 {
		t.Fatalf("expected 500 XP reward, got %d", def.RewardXP)
	}

	if qt.ActiveQuestCount() != 0 {
		t.Fatal("expected no active quests")
	}
	if !qt.HasCompletedQuest(1) {
		t.Fatal("expected quest 1 to be completed")
	}
}

func TestTurnInNotCompleted(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	qt.OnNPCKill(1) // only 1/10
	_, err := qt.TurnInQuest(1)
	if err == nil {
		t.Fatal("expected error: quest not completed")
	}
}

func TestTurnInNotActive(t *testing.T) {
	qt := NewQuestTracker()
	_, err := qt.TurnInQuest(999)
	if err == nil {
		t.Fatal("expected error: quest not active")
	}
}

func TestAcceptAlreadyCompleted(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	for i := 0; i < 10; i++ {
		qt.OnNPCKill(1)
	}
	qt.TurnInQuest(1)
	err := qt.AcceptQuest(1, 10)
	if err == nil {
		t.Fatal("expected error: already completed")
	}
}

func TestGetAvailableQuests(t *testing.T) {
	qt := NewQuestTracker()
	available := qt.GetAvailableQuests(1)
	// Should include quest 1 (minLevel 1) but not quest 2 (prereq quest 1), not quest 3 (minLevel 10)
	found := false
	for _, id := range available {
		if id == 1 {
			found = true
		}
		if id == 2 {
			t.Fatal("quest 2 should not be available (prereq)")
		}
		if id == 3 {
			t.Fatal("quest 3 should not be available (level)")
		}
	}
	if !found {
		t.Fatal("quest 1 should be available")
	}
}

func TestGetAvailableQuestsExcludesActive(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	available := qt.GetAvailableQuests(10)
	for _, id := range available {
		if id == 1 {
			t.Fatal("quest 1 should not be available (already active)")
		}
	}
}

func TestGetActiveQuests(t *testing.T) {
	qt := NewQuestTracker()
	qt.AcceptQuest(1, 10)
	qt.AcceptQuest(4, 10)
	quests := qt.GetActiveQuests()
	if len(quests) != 2 {
		t.Fatalf("expected 2 active quests, got %d", len(quests))
	}
}
