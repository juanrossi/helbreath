package game

import (
	"log"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/quest"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

func (e *Engine) handleQuestAccept(client *network.Client, req *pb.QuestAcceptRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	err := p.Quests.AcceptQuest(int(req.QuestId), p.Level)
	if err != nil {
		e.sendNotification(p, "Cannot accept quest: "+err.Error(), 2)
		return
	}

	def := quest.GetQuestDef(int(req.QuestId))
	e.sendNotification(p, "Quest accepted: "+def.Name, 3)
	e.sendQuestList(p)
}

func (e *Engine) handleQuestTurnIn(client *network.Client, req *pb.QuestTurnInRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	questID := int(req.QuestId)
	def := quest.GetQuestDef(questID)
	if def == nil {
		e.sendNotification(p, "Quest not found", 2)
		return
	}

	// For delivery/collect quests, check and consume items
	if def.Type == quest.QuestTypeDelivery || def.Type == quest.QuestTypeCollect {
		// Check if player has enough items
		count := p.Inventory.CountItem(def.TargetItemID)
		if count < def.TargetCount {
			e.sendNotification(p, "You need more items to complete this quest", 2)
			return
		}
		// Consume the items
		remaining := def.TargetCount
		for i := 0; i < items.MaxInventorySlots && remaining > 0; i++ {
			item := p.Inventory.Slots[i]
			if item == nil || item.DefID != def.TargetItemID {
				continue
			}
			if item.Count <= remaining {
				remaining -= item.Count
				p.Inventory.RemoveItem(i, item.Count)
			} else {
				p.Inventory.RemoveItem(i, remaining)
				remaining = 0
			}
		}
	}

	rewardDef, err := p.Quests.TurnInQuest(questID)
	if err != nil {
		e.sendNotification(p, "Cannot turn in: "+err.Error(), 2)
		return
	}

	// Apply rewards
	p.Experience += rewardDef.RewardXP
	p.Gold += rewardDef.RewardGold

	if rewardDef.RewardItemID > 0 && rewardDef.RewardCount > 0 {
		p.Inventory.AddItem(&items.Item{
			DefID:      rewardDef.RewardItemID,
			Count:      rewardDef.RewardCount,
			Durability: 100,
		})
		e.sendInventoryUpdate(p)
	}

	leveledUp := CheckLevelUp(p)
	e.sendStatUpdate(p)

	// Send reward notification
	reward := &pb.QuestRewardNotification{
		QuestId:   int32(questID),
		QuestName: rewardDef.Name,
		XpGained:  rewardDef.RewardXP,
		GoldGained: rewardDef.RewardGold,
		ItemId:    int32(rewardDef.RewardItemID),
		ItemCount: int32(rewardDef.RewardCount),
	}
	data, _ := network.Encode(network.MsgQuestReward, reward)
	p.Send(data)

	if leveledUp {
		notif := &pb.Notification{
			Message: "Level up! You are now level " + string(rune('0'+p.Level%10)) + "!",
			Type:    3,
		}
		data, _ := network.Encode(network.MsgNotification, notif)
		p.Send(data)
	}

	e.sendQuestList(p)
	log.Printf("Player %s completed quest %s (+%d XP, +%d gold)", p.Name, rewardDef.Name, rewardDef.RewardXP, rewardDef.RewardGold)
}

// onNPCKillQuestUpdate updates quest progress when a player kills an NPC.
func (e *Engine) onNPCKillQuestUpdate(p *player.Player, npcTypeID int) {
	completed := p.Quests.OnNPCKill(npcTypeID)

	// Send progress update for each hunt quest
	for _, pq := range p.Quests.GetActiveQuests() {
		def := quest.GetQuestDef(pq.QuestID)
		if def == nil || def.Type != quest.QuestTypeHunt || def.TargetNpcType != npcTypeID {
			continue
		}
		progress := &pb.QuestProgressUpdate{
			QuestId:     int32(pq.QuestID),
			Progress:    int32(pq.Progress),
			TargetCount: int32(def.TargetCount),
			Completed:   pq.State == quest.QuestStateCompleted,
		}
		data, _ := network.Encode(network.MsgQuestProgress, progress)
		p.Send(data)
	}

	if len(completed) > 0 {
		for _, qid := range completed {
			def := quest.GetQuestDef(qid)
			if def != nil {
				e.sendNotification(p, "Quest completed: "+def.Name+"! Turn it in to claim rewards.", 3)
			}
		}
	}
}

func (e *Engine) sendQuestList(p *player.Player) {
	update := &pb.QuestListUpdate{}

	// Active quests
	for _, pq := range p.Quests.GetActiveQuests() {
		def := quest.GetQuestDef(pq.QuestID)
		if def == nil {
			continue
		}
		update.ActiveQuests = append(update.ActiveQuests, &pb.QuestEntry{
			QuestId:     int32(pq.QuestID),
			Name:        def.Name,
			Description: def.Description,
			QuestType:   int32(def.Type),
			State:       int32(pq.State),
			Progress:    int32(pq.Progress),
			TargetCount: int32(def.TargetCount),
			RewardXp:    int32(def.RewardXP),
			RewardGold:  def.RewardGold,
		})
	}

	// Available quests
	available := p.Quests.GetAvailableQuests(p.Level)
	for _, qid := range available {
		update.AvailableQuestIds = append(update.AvailableQuestIds, int32(qid))
	}

	data, _ := network.Encode(network.MsgQuestListUpdate, update)
	p.Send(data)
}

// World state

func (e *Engine) sendWorldState(p *player.Player) {
	state := &pb.Notification{
		Message: "time:" + worldPhaseToString(e.worldState.GetTimeOfDay()) + "|weather:" + weatherToString(e.worldState.GetWeather()),
		Type:    10, // world state type
	}
	data, _ := network.Encode(network.MsgNotification, state)
	p.Send(data)
}

func (e *Engine) broadcastWorldState() {
	msg := "time:" + worldPhaseToString(e.worldState.GetTimeOfDay()) + "|weather:" + weatherToString(e.worldState.GetWeather())
	state := &pb.Notification{
		Message: msg,
		Type:    10,
	}
	data, _ := network.Encode(network.MsgNotification, state)
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		p.Send(data)
		return true
	})
}

func worldPhaseToString(phase int) string {
	switch phase {
	case 0:
		return "day"
	case 1:
		return "dusk"
	case 2:
		return "night"
	case 3:
		return "dawn"
	default:
		return "day"
	}
}

func weatherToString(w int) string {
	switch w {
	case 0:
		return "clear"
	case 1:
		return "rain"
	case 2:
		return "snow"
	case 3:
		return "fog"
	default:
		return "clear"
	}
}
