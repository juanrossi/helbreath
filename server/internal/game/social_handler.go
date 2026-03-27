package game

import (
	"log"
	"strings"

	"github.com/juanrossi/hbonline/server/internal/guild"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/party"
	"github.com/juanrossi/hbonline/server/internal/player"
	"github.com/juanrossi/hbonline/server/internal/trade"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// getPlayerByName finds a connected player by character name.
func (e *Engine) getPlayerByName(name string) *player.Player {
	var found *player.Player
	e.players.Range(func(key, value any) bool {
		p := value.(*player.Player)
		if strings.EqualFold(p.Name, name) {
			found = p
			return false
		}
		return true
	})
	return found
}

// handleFactionSelect handles faction selection for a player.
func (e *Engine) handleFactionSelect(client *network.Client, req *pb.FactionSelectRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	side := int(req.Side)
	if side != 1 && side != 2 {
		e.sendFactionResponse(p, false, "Invalid faction", 0)
		return
	}
	if p.Side != 0 {
		e.sendFactionResponse(p, false, "You have already chosen a faction", p.Side)
		return
	}
	if p.Level < 10 {
		e.sendFactionResponse(p, false, "You must be level 10 to join a faction", 0)
		return
	}

	p.Side = side
	e.sendFactionResponse(p, true, "", side)
	e.sendStatUpdate(p)
	log.Printf("Player %s joined faction %d", p.Name, side)
}

func (e *Engine) sendFactionResponse(p *player.Player, success bool, errMsg string, side int) {
	resp := &pb.FactionSelectResponse{
		Success: success,
		Error:   errMsg,
		Side:    int32(side),
	}
	data, _ := network.Encode(network.MsgFactionSelectResponse, resp)
	p.Send(data)
}

// handleGuildCreate handles guild creation.
func (e *Engine) handleGuildCreate(client *network.Client, req *pb.GuildCreateRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	name := strings.TrimSpace(req.Name)
	if len(name) < 2 || len(name) > 20 {
		e.sendGuildActionResponse(p, false, "Guild name must be 2-20 characters")
		return
	}
	if p.Level < guild.MinLevel {
		e.sendGuildActionResponse(p, false, "You must be at least level 20 to create a guild")
		return
	}
	if p.CHR < guild.MinCHR {
		e.sendGuildActionResponse(p, false, "You need at least 20 CHR to create a guild")
		return
	}
	if p.Side == 0 {
		e.sendGuildActionResponse(p, false, "You must join a faction first")
		return
	}

	g, err := e.guilds.CreateGuild(name, p.Side, p.CharacterID, p.Name, p.Level)
	if err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}

	e.sendGuildActionResponse(p, true, "Guild created: "+g.Name)
	e.sendGuildInfo(p)
	log.Printf("Player %s created guild %s", p.Name, g.Name)
}

// handleGuildAction handles guild management actions.
func (e *Engine) handleGuildAction(client *network.Client, req *pb.GuildActionRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	action := int(req.Action)
	targetName := strings.TrimSpace(req.TargetName)

	switch action {
	case 1: // invite
		e.guildInvite(p, targetName)
	case 2: // kick
		e.guildKick(p, targetName)
	case 3: // promote
		e.guildPromote(p, targetName)
	case 4: // demote
		e.guildDemote(p, targetName)
	case 5: // leave
		e.guildLeave(p)
	case 6: // disband
		e.guildDisband(p)
	}
}

func (e *Engine) guildInvite(p *player.Player, targetName string) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendGuildActionResponse(p, false, "You are not in a guild")
		return
	}

	member := myGuild.GetMember(p.CharacterID)
	if member == nil || member.Rank < guild.RankOfficer {
		e.sendGuildActionResponse(p, false, "Only officers and the guild master can invite")
		return
	}

	target := e.getPlayerByName(targetName)
	if target == nil {
		e.sendGuildActionResponse(p, false, "Player not found")
		return
	}
	if target.Side != p.Side {
		e.sendGuildActionResponse(p, false, "Player is from a different faction")
		return
	}

	err := e.guilds.JoinGuild(myGuild.ID, target.CharacterID, target.Name, target.Level)
	if err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}

	e.sendGuildActionResponse(p, true, target.Name+" has joined the guild")
	e.sendGuildActionResponse(target, true, "You have joined "+myGuild.Name)
	e.broadcastGuildInfo(myGuild)
}

func (e *Engine) guildKick(p *player.Player, targetName string) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendGuildActionResponse(p, false, "You are not in a guild")
		return
	}

	member := myGuild.GetMember(p.CharacterID)
	if member == nil || member.Rank < guild.RankOfficer {
		e.sendGuildActionResponse(p, false, "Only officers and the guild master can kick members")
		return
	}

	// Find the target member by name
	var targetCharID int
	members := myGuild.MemberList()
	for _, m := range members {
		if strings.EqualFold(m.Name, targetName) {
			targetCharID = m.CharacterID
			break
		}
	}
	if targetCharID == 0 {
		e.sendGuildActionResponse(p, false, "Player not found in guild")
		return
	}

	err := e.guilds.LeaveGuild(targetCharID)
	if err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}

	e.sendGuildActionResponse(p, true, targetName+" has been kicked from the guild")
	if target := e.getPlayerByName(targetName); target != nil {
		e.sendGuildActionResponse(target, true, "You have been kicked from the guild")
	}
	e.broadcastGuildInfo(myGuild)
}

func (e *Engine) guildPromote(p *player.Player, targetName string) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendGuildActionResponse(p, false, "You are not in a guild")
		return
	}
	if myGuild.MasterID != p.CharacterID {
		e.sendGuildActionResponse(p, false, "Only the guild master can promote members")
		return
	}

	var targetCharID int
	members := myGuild.MemberList()
	for _, m := range members {
		if strings.EqualFold(m.Name, targetName) {
			targetCharID = m.CharacterID
			break
		}
	}
	if targetCharID == 0 {
		e.sendGuildActionResponse(p, false, "Player not found in guild")
		return
	}

	if err := myGuild.Promote(targetCharID); err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}
	e.sendGuildActionResponse(p, true, targetName+" has been promoted to officer")
	e.broadcastGuildInfo(myGuild)
}

func (e *Engine) guildDemote(p *player.Player, targetName string) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendGuildActionResponse(p, false, "You are not in a guild")
		return
	}
	if myGuild.MasterID != p.CharacterID {
		e.sendGuildActionResponse(p, false, "Only the guild master can demote members")
		return
	}

	var targetCharID int
	members := myGuild.MemberList()
	for _, m := range members {
		if strings.EqualFold(m.Name, targetName) {
			targetCharID = m.CharacterID
			break
		}
	}
	if targetCharID == 0 {
		e.sendGuildActionResponse(p, false, "Player not found in guild")
		return
	}

	if err := myGuild.Demote(targetCharID); err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}
	e.sendGuildActionResponse(p, true, targetName+" has been demoted to member")
	e.broadcastGuildInfo(myGuild)
}

func (e *Engine) guildLeave(p *player.Player) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendGuildActionResponse(p, false, "You are not in a guild")
		return
	}

	err := e.guilds.LeaveGuild(p.CharacterID)
	if err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}
	e.sendGuildActionResponse(p, true, "You have left the guild")
	e.broadcastGuildInfo(myGuild)
}

func (e *Engine) guildDisband(p *player.Player) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendGuildActionResponse(p, false, "You are not in a guild")
		return
	}

	// Notify all members before disbanding
	members := myGuild.MemberList()

	err := e.guilds.DisbandGuild(myGuild.ID, p.CharacterID)
	if err != nil {
		e.sendGuildActionResponse(p, false, err.Error())
		return
	}

	for _, m := range members {
		if target := e.getPlayerByName(m.Name); target != nil {
			e.sendGuildActionResponse(target, true, "The guild has been disbanded")
		}
	}
}

func (e *Engine) sendGuildActionResponse(p *player.Player, success bool, msg string) {
	resp := &pb.GuildActionResponse{
		Success: success,
		Message: msg,
	}
	data, _ := network.Encode(network.MsgGuildActionResponse, resp)
	p.Send(data)
}

func (e *Engine) sendGuildInfo(p *player.Player) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		return
	}

	info := &pb.GuildInfo{
		GuildId:    int32(myGuild.ID),
		Name:       myGuild.Name,
		Side:       int32(myGuild.Side),
		MasterName: myGuild.GetMasterName(),
	}

	members := myGuild.MemberList()
	for _, m := range members {
		info.Members = append(info.Members, &pb.GuildMemberInfo{
			Name:   m.Name,
			Rank:   int32(m.Rank),
			Level:  int32(m.Level),
			Online: m.Online,
		})
	}

	data, _ := network.Encode(network.MsgGuildInfo, info)
	p.Send(data)
}

func (e *Engine) broadcastGuildInfo(g *guild.Guild) {
	members := g.MemberList()
	for _, m := range members {
		if target := e.getPlayerByName(m.Name); target != nil {
			e.sendGuildInfo(target)
		}
	}
}

// ===== PARTY =====

func (e *Engine) handlePartyAction(client *network.Client, req *pb.PartyActionRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	action := int(req.Action)
	targetName := strings.TrimSpace(req.TargetName)

	switch action {
	case 1: // invite
		e.partyInvite(p, targetName)
	case 2: // kick
		e.partyKick(p, targetName)
	case 3: // leave
		e.partyLeave(p)
	}
}

func (e *Engine) partyInvite(p *player.Player, targetName string) {
	target := e.getPlayerByName(targetName)
	if target == nil {
		e.sendPartyActionResponse(p, false, "Player not found")
		return
	}
	if target.ObjectID == p.ObjectID {
		e.sendPartyActionResponse(p, false, "Cannot invite yourself")
		return
	}

	// Create party if inviter is not in one
	existingParty := e.parties.GetPlayerParty(p.ObjectID)
	if existingParty == nil {
		e.parties.CreateParty(p.ObjectID, p.Name, p.HP, p.MaxHP, p.Level)
	}

	err := e.parties.InvitePlayer(p.ObjectID, target.ObjectID)
	if err != nil {
		e.sendPartyActionResponse(p, false, err.Error())
		return
	}

	// Send invite to target
	invite := &pb.PartyInvite{
		InviterObjectId: p.ObjectID,
		InviterName:     p.Name,
	}
	data, _ := network.Encode(network.MsgPartyInviteMsg, invite)
	target.Send(data)

	e.sendPartyActionResponse(p, true, "Invite sent to "+targetName)
}

func (e *Engine) handlePartyInviteResponse(client *network.Client, req *pb.PartyInviteResponse) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	if !req.Accept {
		e.parties.DeclineInvite(p.ObjectID)
		// Notify inviter
		if inviterID, ok := e.parties.GetInviter(p.ObjectID); ok {
			if inviter := e.getPlayerByID(inviterID); inviter != nil {
				e.sendPartyActionResponse(inviter, false, p.Name+" declined the party invite")
			}
		}
		return
	}

	pt, err := e.parties.AcceptInvite(p.ObjectID, p.Name, p.HP, p.MaxHP, p.Level)
	if err != nil {
		e.sendPartyActionResponse(p, false, err.Error())
		return
	}

	e.broadcastPartyUpdate(pt)
}

func (e *Engine) partyKick(p *player.Player, targetName string) {
	target := e.getPlayerByName(targetName)
	if target == nil {
		e.sendPartyActionResponse(p, false, "Player not found")
		return
	}

	err := e.parties.KickMember(p.ObjectID, target.ObjectID)
	if err != nil {
		e.sendPartyActionResponse(p, false, err.Error())
		return
	}

	e.sendPartyActionResponse(target, true, "You have been kicked from the party")

	// Broadcast updated party info
	pt := e.parties.GetPlayerParty(p.ObjectID)
	if pt != nil {
		e.broadcastPartyUpdate(pt)
	}
}

func (e *Engine) partyLeave(p *player.Player) {
	pt := e.parties.GetPlayerParty(p.ObjectID)
	if pt == nil {
		e.sendPartyActionResponse(p, false, "You are not in a party")
		return
	}

	// Get remaining members before leaving
	memberIDs := pt.GetMemberIDs()

	err := e.parties.LeaveParty(p.ObjectID)
	if err != nil {
		e.sendPartyActionResponse(p, false, err.Error())
		return
	}

	e.sendPartyActionResponse(p, true, "You have left the party")

	// Broadcast updated party to remaining members
	for _, id := range memberIDs {
		if id == p.ObjectID {
			continue
		}
		remainingParty := e.parties.GetPlayerParty(id)
		if remainingParty != nil {
			e.broadcastPartyUpdate(remainingParty)
			break
		}
	}
}

func (e *Engine) sendPartyActionResponse(p *player.Player, success bool, msg string) {
	resp := &pb.PartyActionResponse{
		Success: success,
		Message: msg,
	}
	data, _ := network.Encode(network.MsgPartyActionResponse, resp)
	p.Send(data)
}

func (e *Engine) broadcastPartyUpdate(pt *party.Party) {
	members := pt.GetMembers()
	update := &pb.PartyUpdate{
		LeaderObjectId: pt.LeaderID,
	}
	for _, m := range members {
		update.Members = append(update.Members, &pb.PartyMemberInfo{
			ObjectId: m.ObjectID,
			Name:     m.Name,
			Hp:       int32(m.HP),
			MaxHp:    int32(m.MaxHP),
			Level:    int32(m.Level),
		})
	}

	data, _ := network.Encode(network.MsgPartyUpdate, update)
	for _, m := range members {
		if target := e.getPlayerByID(m.ObjectID); target != nil {
			target.Send(data)
		}
	}
}

// ===== TRADE =====

func (e *Engine) handleTradeRequest(client *network.Client, req *pb.TradeRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	target := e.getPlayerByID(req.TargetId)
	if target == nil || target.MapName != p.MapName {
		e.sendTradeComplete(p, false, "Player not found")
		return
	}

	err := e.trades.RequestTrade(p.ObjectID, target.ObjectID)
	if err != nil {
		e.sendTradeComplete(p, false, err.Error())
		return
	}

	// Send trade incoming to target
	incoming := &pb.TradeIncoming{
		RequesterId:   p.ObjectID,
		RequesterName: p.Name,
	}
	data, _ := network.Encode(network.MsgTradeIncoming, incoming)
	target.Send(data)
}

func (e *Engine) handleTradeResponse(client *network.Client, req *pb.TradeResponse) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	if !req.Accept {
		requesterID, ok := e.trades.GetRequester(p.ObjectID)
		e.trades.DeclineTrade(p.ObjectID)
		if ok {
			if requester := e.getPlayerByID(requesterID); requester != nil {
				e.sendTradeComplete(requester, false, p.Name+" declined the trade")
			}
		}
		return
	}

	session, err := e.trades.AcceptTrade(p.ObjectID)
	if err != nil {
		e.sendTradeComplete(p, false, err.Error())
		return
	}

	// Send initial empty trade update to both
	e.sendTradeUpdate(session, session.Player1ID)
	e.sendTradeUpdate(session, session.Player2ID)
}

func (e *Engine) handleTradeSetItem(client *network.Client, req *pb.TradeSetItem) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	session := e.trades.GetSession(p.ObjectID)
	if session == nil {
		return
	}

	slot := int(req.InventorySlot)
	item := p.Inventory.Slots[slot]
	if item == nil {
		return
	}

	count := int(req.Count)
	if count > item.Count {
		count = item.Count
	}

	def := item.Def()
	name := ""
	defID := 0
	if def != nil {
		name = def.Name
		defID = def.ID
	}

	if err := session.SetItem(p.ObjectID, slot, defID, name, count); err != nil {
		return
	}

	e.sendTradeUpdate(session, session.Player1ID)
	e.sendTradeUpdate(session, session.Player2ID)
}

func (e *Engine) handleTradeSetGold(client *network.Client, req *pb.TradeSetGold) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	session := e.trades.GetSession(p.ObjectID)
	if session == nil {
		return
	}

	gold := req.Gold
	if gold > p.Gold {
		gold = p.Gold
	}
	if gold < 0 {
		gold = 0
	}

	if err := session.SetGold(p.ObjectID, gold); err != nil {
		return
	}

	e.sendTradeUpdate(session, session.Player1ID)
	e.sendTradeUpdate(session, session.Player2ID)
}

func (e *Engine) handleTradeConfirm(client *network.Client, req *pb.TradeConfirm) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	session := e.trades.GetSession(p.ObjectID)
	if session == nil {
		return
	}

	if err := session.Confirm(p.ObjectID, req.Confirmed); err != nil {
		return
	}

	e.sendTradeUpdate(session, session.Player1ID)
	e.sendTradeUpdate(session, session.Player2ID)

	if session.BothConfirmed() {
		e.executeTrade(session)
	}
}

func (e *Engine) executeTrade(session *trade.TradeSession) {
	p1 := e.getPlayerByID(session.Player1ID)
	p2 := e.getPlayerByID(session.Player2ID)
	if p1 == nil || p2 == nil {
		e.cancelTrade(session, "Other player disconnected")
		return
	}

	// Validate gold
	if session.Gold1 > p1.Gold || session.Gold2 > p2.Gold {
		e.cancelTrade(session, "Not enough gold")
		return
	}

	// Exchange gold
	p1.Gold -= session.Gold1
	p1.Gold += session.Gold2
	p2.Gold -= session.Gold2
	p2.Gold += session.Gold1

	// Exchange items: remove from source, add to destination
	for _, tradeItem := range session.Items1 {
		if p1.Inventory.RemoveItem(tradeItem.InventorySlot, tradeItem.Count) {
			p2.Inventory.AddItem(&items.Item{DefID: tradeItem.ItemDefID, Count: tradeItem.Count, Durability: 100})
		}
	}
	for _, tradeItem := range session.Items2 {
		if p2.Inventory.RemoveItem(tradeItem.InventorySlot, tradeItem.Count) {
			p1.Inventory.AddItem(&items.Item{DefID: tradeItem.ItemDefID, Count: tradeItem.Count, Durability: 100})
		}
	}

	e.trades.EndTrade(session.Player1ID)

	e.sendTradeComplete(p1, true, "Trade completed")
	e.sendTradeComplete(p2, true, "Trade completed")
	e.sendInventoryUpdate(p1)
	e.sendInventoryUpdate(p2)
	e.sendStatUpdate(p1)
	e.sendStatUpdate(p2)

	log.Printf("Trade completed between %s and %s", p1.Name, p2.Name)
}

func (e *Engine) cancelTrade(session *trade.TradeSession, reason string) {
	e.trades.EndTrade(session.Player1ID)
	if p1 := e.getPlayerByID(session.Player1ID); p1 != nil {
		e.sendTradeComplete(p1, false, reason)
	}
	if p2 := e.getPlayerByID(session.Player2ID); p2 != nil {
		e.sendTradeComplete(p2, false, reason)
	}
}

func (e *Engine) sendTradeUpdate(session *trade.TradeSession, toPlayerID int32) {
	target := e.getPlayerByID(toPlayerID)
	if target == nil {
		return
	}

	otherID := session.GetOtherPlayer(toPlayerID)

	update := &pb.TradeUpdate{
		MyGold:        session.GetPlayerGold(toPlayerID),
		TheirGold:     session.GetPlayerGold(otherID),
		MyConfirmed:   session.Confirmed1 && toPlayerID == session.Player1ID || session.Confirmed2 && toPlayerID == session.Player2ID,
		TheirConfirmed: session.Confirmed1 && toPlayerID != session.Player1ID || session.Confirmed2 && toPlayerID != session.Player2ID,
	}

	for _, item := range session.GetPlayerItems(toPlayerID) {
		update.MyItems = append(update.MyItems, &pb.TradeSlot{
			ItemId:    int32(item.ItemDefID),
			Name:      item.Name,
			Count:     int32(item.Count),
			SlotIndex: int32(item.InventorySlot),
		})
	}
	for _, item := range session.GetPlayerItems(otherID) {
		update.TheirItems = append(update.TheirItems, &pb.TradeSlot{
			ItemId:    int32(item.ItemDefID),
			Name:      item.Name,
			Count:     int32(item.Count),
			SlotIndex: int32(item.InventorySlot),
		})
	}

	data, _ := network.Encode(network.MsgTradeUpdate, update)
	target.Send(data)
}

func (e *Engine) sendTradeComplete(p *player.Player, success bool, msg string) {
	resp := &pb.TradeComplete{
		Success: success,
		Message: msg,
	}
	data, _ := network.Encode(network.MsgTradeComplete, resp)
	p.Send(data)
}

// ===== PVP =====

// handlePvPAttack processes a player-vs-player attack.
func (e *Engine) handlePvPAttack(attacker, target *player.Player) {
	if attacker.Side == target.Side && attacker.Side != 0 {
		e.sendNotification(attacker, "Cannot attack a member of your own faction", 2)
		return
	}

	gm, ok := e.maps[attacker.MapName]
	if !ok {
		return
	}

	// Calculate PvP damage (similar to NPC but with player defense)
	result := PlayerAttackPlayer(attacker, target)

	// Broadcast attack animation
	attackMotion := &pb.MotionEvent{
		ObjectId:  attacker.ObjectID,
		OwnerType: 1,
		Action:    3,
		Direction: int32(attacker.Direction),
		Position:  &pb.Vec2{X: int32(attacker.X), Y: int32(attacker.Y)},
		Name:      attacker.Name,
	}
	e.broadcastToNearby(gm, attacker.X, attacker.Y, -1, network.MsgMotionEvent, attackMotion)

	// Send damage event
	dmgEvent := &pb.DamageEvent{
		AttackerId:  attacker.ObjectID,
		TargetId:    target.ObjectID,
		TargetType:  1,
		Damage:      int32(result.Damage),
		Critical:    result.Critical,
		Miss:        result.Miss,
		TargetHp:    int32(target.HP),
		TargetMaxHp: int32(target.MaxHP),
	}
	e.broadcastToNearby(gm, target.X, target.Y, -1, network.MsgDamageEvent, dmgEvent)

	e.sendStatUpdate(target)

	if result.Killed {
		// PK tracking
		if target.Side != 0 && attacker.Side != 0 {
			if target.Side == attacker.Side {
				attacker.PKCount++
			} else {
				attacker.EKCount++
			}
		} else {
			attacker.PKCount++
		}

		e.sendPKStatus(attacker)
		e.handlePlayerDeath(target, attacker.ObjectID, attacker.Name)
	}

	// SP cost
	attacker.SP -= 3
	if attacker.SP < 0 {
		attacker.SP = 0
	}
	e.sendStatUpdate(attacker)
}

func (e *Engine) sendPKStatus(p *player.Player) {
	status := &pb.PKStatusUpdate{
		PkCount:       int32(p.PKCount),
		EkCount:       int32(p.EKCount),
		Criminal:      p.PKCount >= 3,
		CriminalTimer: 0,
	}
	data, _ := network.Encode(network.MsgPKStatusUpdate, status)
	p.Send(data)
}

// ===== GUILD CHAT =====

// handleGuildChat sends a chat message to all online guild members.
func (e *Engine) handleGuildChat(p *player.Player, message string) {
	myGuild := e.guilds.GetPlayerGuild(p.CharacterID)
	if myGuild == nil {
		e.sendNotification(p, "You are not in a guild", 2)
		return
	}

	chatMsg := &pb.ChatMessage{
		ObjectId:   p.ObjectID,
		SenderName: p.Name,
		Type:       3, // guild chat type
		Message:    message,
		Position:   &pb.Vec2{X: int32(p.X), Y: int32(p.Y)},
	}
	data, _ := network.Encode(network.MsgChatMessage, chatMsg)

	members := myGuild.MemberList()
	for _, m := range members {
		if target := e.getPlayerByName(m.Name); target != nil {
			target.Send(data)
		}
	}
}
