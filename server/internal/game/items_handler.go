package game

import (
	"log"
	"math/rand"
	"time"

	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/mapdata"
	"github.com/juanrossi/hbonline/server/internal/network"
	"github.com/juanrossi/hbonline/server/internal/npc"
	"github.com/juanrossi/hbonline/server/internal/player"
	pb "github.com/juanrossi/hbonline/server/pkg/proto"
)

// sendInventoryUpdate sends the full inventory state to a player.
func (e *Engine) sendInventoryUpdate(p *player.Player) {
	update := p.ToInventoryUpdate()
	data, _ := network.Encode(network.MsgInventoryUpdate, update)
	p.Send(data)
}

// dropGroundItem places an item on the map and notifies nearby players.
func (e *Engine) dropGroundItem(item *items.Item, mapName string, x, y int, gm *mapdata.GameMap) {
	def := item.Def()
	if def == nil {
		return
	}

	groundID := e.nextGroundID.Add(1)
	gi := &items.GroundItem{
		GroundID: groundID,
		Item:     item,
		MapName:  mapName,
		X:        x,
		Y:        y,
		DropTime: time.Now().Unix(),
	}
	e.groundItems.Store(groundID, gi)

	// Broadcast to nearby players
	appear := &pb.GroundItemAppear{
		GroundId: groundID,
		ItemId:   int32(item.DefID),
		Name:     def.Name,
		Count:    int32(item.Count),
		Position: &pb.Vec2{X: int32(x), Y: int32(y)},
	}
	e.broadcastToNearby(gm, x, y, -1, network.MsgGroundItemAppear, appear)
}

// sendNearbyGroundItems sends all ground items near a player.
func (e *Engine) sendNearbyGroundItems(p *player.Player, gm *mapdata.GameMap) {
	e.groundItems.Range(func(key, value any) bool {
		gi := value.(*items.GroundItem)
		if gi.MapName != p.MapName {
			return true
		}
		dx := gi.X - p.X
		dy := gi.Y - p.Y
		if dx < 0 {
			dx = -dx
		}
		if dy < 0 {
			dy = -dy
		}
		if dx > 40 || dy > 40 {
			return true
		}

		def := gi.Item.Def()
		if def == nil {
			return true
		}
		appear := &pb.GroundItemAppear{
			GroundId: gi.GroundID,
			ItemId:   int32(gi.Item.DefID),
			Name:     def.Name,
			Count:    int32(gi.Item.Count),
			Position: &pb.Vec2{X: int32(gi.X), Y: int32(gi.Y)},
		}
		data, _ := network.Encode(network.MsgGroundItemAppear, appear)
		p.Send(data)
		return true
	})
}

// handleItemPickup picks up a ground item.
func (e *Engine) handleItemPickup(client *network.Client, req *pb.ItemPickupRequest) {
	p := e.getPlayerByClient(client)
	if p == nil || p.HP <= 0 {
		return
	}

	val, ok := e.groundItems.Load(req.GroundId)
	if !ok {
		return
	}
	gi := val.(*items.GroundItem)

	// Check same map and proximity
	if gi.MapName != p.MapName {
		return
	}
	dx := gi.X - p.X
	dy := gi.Y - p.Y
	if dx < 0 {
		dx = -dx
	}
	if dy < 0 {
		dy = -dy
	}
	if dx > 2 || dy > 2 {
		e.sendNotification(p, "Too far to pick up", 2)
		return
	}

	// Add to inventory
	slot := p.Inventory.AddItem(gi.Item)
	if slot < 0 {
		e.sendNotification(p, "Inventory full", 2)
		return
	}

	// Remove from ground
	e.groundItems.Delete(req.GroundId)

	// Notify all nearby players
	gm, ok := e.maps[p.MapName]
	if ok {
		disappear := &pb.GroundItemDisappear{GroundId: req.GroundId}
		e.broadcastToNearby(gm, gi.X, gi.Y, -1, network.MsgGroundItemDisappear, disappear)
	}

	// Send updated inventory
	e.sendInventoryUpdate(p)

	def := gi.Item.Def()
	name := "item"
	if def != nil {
		name = def.Name
	}
	log.Printf("Player %s picked up %s x%d", p.Name, name, gi.Item.Count)
}

// handleItemUse uses a consumable item (potion).
func (e *Engine) handleItemUse(client *network.Client, req *pb.ItemUseRequest) {
	p := e.getPlayerByClient(client)
	if p == nil || p.HP <= 0 {
		return
	}

	item := p.Inventory.GetItem(int(req.SlotIndex))
	if item == nil {
		return
	}
	def := item.Def()
	if def == nil {
		return
	}

	if def.Type != items.ItemTypePotion {
		if def.EquipSlot != items.EquipNone {
			// Redirect: "Use" on equipment means "Equip"
			e.handleItemEquip(client, &pb.ItemEquipRequest{
				SlotIndex: req.SlotIndex,
				EquipSlot: 0,
			})
			return
		}
		e.sendNotification(p, "Cannot use this item", 2)
		return
	}

	// Apply potion effects
	if def.HPRestore > 0 {
		p.HP += def.HPRestore
		if p.HP > p.MaxHP {
			p.HP = p.MaxHP
		}
	}
	if def.MPRestore > 0 {
		p.MP += def.MPRestore
		if p.MP > p.MaxMP {
			p.MP = p.MaxMP
		}
	}
	if def.SPRestore > 0 {
		p.SP += def.SPRestore
		if p.SP > p.MaxSP {
			p.SP = p.MaxSP
		}
	}

	// Consume one item
	p.Inventory.RemoveItem(int(req.SlotIndex), 1)

	// Send updates
	e.sendInventoryUpdate(p)
	e.sendStatUpdate(p)
}

// handleItemEquip equips or unequips an item.
func (e *Engine) handleItemEquip(client *network.Client, req *pb.ItemEquipRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	if req.SlotIndex >= 0 {
		// Equip from inventory
		item := p.Inventory.GetItem(int(req.SlotIndex))
		if item == nil {
			return
		}
		def := item.Def()
		if def == nil {
			return
		}

		// Check requirements
		if !p.MeetsRequirements(def) {
			e.sendNotification(p, "You don't meet the requirements for this item", 2)
			return
		}

		err := p.Inventory.Equip(int(req.SlotIndex))
		if err != nil {
			e.sendNotification(p, err.Error(), 2)
			return
		}
	} else {
		// Unequip
		eqSlot := items.EquipSlot(req.EquipSlot)
		err := p.Inventory.Unequip(eqSlot)
		if err != nil {
			e.sendNotification(p, err.Error(), 2)
			return
		}
	}

	// Update appearance and recalculate combat stats
	p.SyncEquipmentAppearance()
	p.RecalcCombatStats()

	// Send updated inventory
	e.sendInventoryUpdate(p)
	e.sendStatUpdate(p)

	// Send appearance to self so client can update equipment sprites
	selfAppear := p.ToPlayerAppear()
	selfData, _ := network.Encode(network.MsgPlayerAppear, selfAppear)
	p.Send(selfData)

	// Broadcast appearance change to nearby players
	gm, ok := e.maps[p.MapName]
	if ok {
		appear := p.ToPlayerAppear()
		e.broadcastToNearby(gm, p.X, p.Y, p.ObjectID, network.MsgPlayerAppear, appear)
	}
}

// handleItemDrop drops an item on the ground.
func (e *Engine) handleItemDrop(client *network.Client, req *pb.ItemDropRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	item := p.Inventory.GetItem(int(req.SlotIndex))
	if item == nil {
		return
	}

	count := int(req.Count)
	if count <= 0 {
		count = item.Count
	}
	if count > item.Count {
		count = item.Count
	}

	// Create ground item
	dropItem := &items.Item{
		DefID:      item.DefID,
		Count:      count,
		Durability: item.Durability,
	}

	// Remove from inventory
	p.Inventory.RemoveItem(int(req.SlotIndex), count)

	// Drop on ground
	gm, ok := e.maps[p.MapName]
	if ok {
		e.dropGroundItem(dropItem, p.MapName, p.X, p.Y, gm)
	}

	e.sendInventoryUpdate(p)
}

// isProtectedItem returns true if the item should never be dropped on death.
// Matches original C++ logic: hero armors (398-428 except cape 402) and executor items (700-710).
func isProtectedItem(defID int) bool {
	if defID >= 398 && defID <= 428 && defID != 402 {
		return true
	}
	if defID >= 700 && defID <= 710 {
		return true
	}
	return false
}

// ZemItemID is the Zemstone of Sacrifice — drops instead of gear on death.
const ZemItemID = 650

// penaltyItemDrop drops items from a player's inventory on death.
// penaltyLevel determines how many items can drop (1-12).
// Ported from C++ _PenaltyItemDrop in Game.cpp:27283.
func (e *Engine) penaltyItemDrop(p *player.Player, penaltyLevel int, gm *mapdata.GameMap) {
	inv := p.Inventory
	if inv == nil {
		return
	}

	// Priority: Zem (Zemstone of Sacrifice) — if carried, only the Zem drops.
	// This protects all other items. Matches C++ AlterItemDrop logic.
	for i := 0; i < items.MaxInventorySlots; i++ {
		item := inv.Slots[i]
		if item != nil && item.DefID == ZemItemID {
			dropItem := &items.Item{
				DefID:      item.DefID,
				Count:      1,
				Durability: item.Durability,
				Attribute:  item.Attribute,
			}
			inv.RemoveItem(i, 1)
			e.dropGroundItem(dropItem, p.MapName, p.X, p.Y, gm)
			e.sendInventoryUpdate(p)
			log.Printf("Player %s death: Zem sacrificed (protected other items)", p.Name)
			return
		}
	}

	// Normal item drop loop — drop up to penaltyLevel items.
	type dropCandidate struct {
		invSlot int // 0-49 for inventory, -1 means equipment
		eqSlot  items.EquipSlot
		item    *items.Item
	}

	droppedAny := false
	for i := 0; i < penaltyLevel; i++ {
		var eligible []dropCandidate

		// Scan inventory slots
		for j := 0; j < items.MaxInventorySlots; j++ {
			item := inv.Slots[j]
			if item == nil {
				continue
			}
			if isProtectedItem(item.DefID) {
				continue
			}
			eligible = append(eligible, dropCandidate{invSlot: j, eqSlot: 0, item: item})
		}

		// Scan equipment slots
		for j := 1; j <= items.MaxEquipSlots; j++ {
			item := inv.Equipment[j]
			if item == nil {
				continue
			}
			if isProtectedItem(item.DefID) {
				continue
			}
			eligible = append(eligible, dropCandidate{invSlot: -1, eqSlot: items.EquipSlot(j), item: item})
		}

		if len(eligible) == 0 {
			break
		}

		pick := eligible[rand.Intn(len(eligible))]

		var dropItem *items.Item
		if pick.invSlot >= 0 {
			// Inventory item — drop entire stack
			dropItem = &items.Item{
				DefID:      pick.item.DefID,
				Count:      pick.item.Count,
				Durability: pick.item.Durability,
				Attribute:  pick.item.Attribute,
			}
			inv.Slots[pick.invSlot] = nil
		} else {
			// Equipped item — remove from equipment
			dropItem = &items.Item{
				DefID:      pick.item.DefID,
				Count:      1,
				Durability: pick.item.Durability,
				Attribute:  pick.item.Attribute,
			}
			inv.Equipment[pick.eqSlot] = nil
		}

		e.dropGroundItem(dropItem, p.MapName, p.X, p.Y, gm)
		droppedAny = true

		def := dropItem.Def()
		name := "item"
		if def != nil {
			name = def.Name
		}
		log.Printf("Player %s death: dropped %s x%d", p.Name, name, dropItem.Count)
	}

	if droppedAny {
		p.SyncEquipmentAppearance()
		p.RecalcCombatStats()
		e.sendInventoryUpdate(p)
	}
}

// handleShopBuy handles buying an item from a shop NPC.
func (e *Engine) handleShopBuy(client *network.Client, req *pb.ShopBuyRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	// Verify NPC exists and is nearby
	npcVal, ok := e.npcs.Load(req.NpcId)
	if !ok {
		return
	}
	n := npcVal.(*npc.NPC)
	if !npc.IsShopNPC(n.Type.ID) {
		return
	}
	if n.DistanceTo(p.X, p.Y) > 3 {
		e.sendShopResponse(p, false, "Too far from shop")
		return
	}

	// Check item is in shop inventory
	shopItems, ok := items.ShopInventories[n.Type.ID]
	if !ok {
		return
	}
	found := false
	for _, id := range shopItems {
		if id == int(req.ItemId) {
			found = true
			break
		}
	}
	if !found {
		e.sendShopResponse(p, false, "Item not available")
		return
	}

	def := items.GetItemDef(int(req.ItemId))
	if def == nil {
		return
	}

	count := int(req.Count)
	if count <= 0 {
		count = 1
	}

	totalCost := def.Price * int64(count)
	if p.Gold < totalCost {
		e.sendShopResponse(p, false, "Not enough gold")
		return
	}

	if !p.Inventory.HasSpace() {
		e.sendShopResponse(p, false, "Inventory full")
		return
	}

	// Deduct gold and add item
	p.Gold -= totalCost
	newItem := items.NewItem(def, count)
	p.Inventory.AddItem(newItem)

	e.sendShopResponse(p, true, "")
	e.sendInventoryUpdate(p)
	e.sendStatUpdate(p)

	log.Printf("Player %s bought %s x%d for %d gold", p.Name, def.Name, count, totalCost)
}

// handleShopSell handles selling an item to a shop NPC.
func (e *Engine) handleShopSell(client *network.Client, req *pb.ShopSellRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	// Verify NPC exists and is nearby
	npcVal, ok := e.npcs.Load(req.NpcId)
	if !ok {
		return
	}
	n := npcVal.(*npc.NPC)
	if !npc.IsShopNPC(n.Type.ID) {
		return
	}
	if n.DistanceTo(p.X, p.Y) > 3 {
		e.sendShopResponse(p, false, "Too far from shop")
		return
	}

	item := p.Inventory.GetItem(int(req.SlotIndex))
	if item == nil {
		e.sendShopResponse(p, false, "No item in that slot")
		return
	}

	def := item.Def()
	if def == nil {
		return
	}

	count := int(req.Count)
	if count <= 0 {
		count = 1
	}
	if count > item.Count {
		count = item.Count
	}

	// Sell at 40% of buy price
	sellPrice := def.Price * 40 / 100
	if sellPrice < 1 {
		sellPrice = 1
	}
	totalGold := sellPrice * int64(count)

	p.Gold += totalGold
	p.Inventory.RemoveItem(int(req.SlotIndex), count)

	e.sendShopResponse(p, true, "")
	e.sendInventoryUpdate(p)
	e.sendStatUpdate(p)

	log.Printf("Player %s sold %s x%d for %d gold", p.Name, def.Name, count, totalGold)
}

// handleStatAlloc handles allocating stat points from LU pool.
func (e *Engine) handleStatAlloc(client *network.Client, req *pb.StatAllocRequest) {
	p := e.getPlayerByClient(client)
	if p == nil {
		return
	}

	points := int(req.Points)
	if points <= 0 || points > p.LUPool {
		e.sendNotification(p, "Not enough stat points", 2)
		return
	}

	// Helper to enforce stat cap: returns actual points that can be allocated
	capPoints := func(current, requested int) int {
		room := MaxStatValue - current
		if room <= 0 {
			return 0
		}
		if requested > room {
			return room
		}
		return requested
	}

	var allocated int
	switch req.StatType {
	case 1:
		allocated = capPoints(p.STR, points)
		if allocated == 0 {
			e.sendNotification(p, "STR is already at maximum", 2)
			return
		}
		p.STR += allocated
	case 2:
		allocated = capPoints(p.VIT, points)
		if allocated == 0 {
			e.sendNotification(p, "VIT is already at maximum", 2)
			return
		}
		p.VIT += allocated
		p.MaxHP = 30 + (p.Level-1)*3 + p.VIT*2
		if p.HP > p.MaxHP {
			p.HP = p.MaxHP
		}
	case 3:
		allocated = capPoints(p.DEX, points)
		if allocated == 0 {
			e.sendNotification(p, "DEX is already at maximum", 2)
			return
		}
		p.DEX += allocated
	case 4:
		allocated = capPoints(p.INT, points)
		if allocated == 0 {
			e.sendNotification(p, "INT is already at maximum", 2)
			return
		}
		p.INT += allocated
	case 5:
		allocated = capPoints(p.MAG, points)
		if allocated == 0 {
			e.sendNotification(p, "MAG is already at maximum", 2)
			return
		}
		p.MAG += allocated
		p.MaxMP = 10 + (p.Level-1)*2 + p.MAG*2
		if p.MP > p.MaxMP {
			p.MP = p.MaxMP
		}
	case 6:
		allocated = capPoints(p.CHR, points)
		if allocated == 0 {
			e.sendNotification(p, "CHR is already at maximum", 2)
			return
		}
		p.CHR += allocated
	default:
		e.sendNotification(p, "Invalid stat", 2)
		return
	}

	p.LUPool -= allocated
	p.RecalcCombatStats()
	e.sendStatUpdate(p)
}

// sendNotification sends a notification message to a player.
func (e *Engine) sendNotification(p *player.Player, msg string, msgType int32) {
	notif := &pb.Notification{Message: msg, Type: msgType}
	data, _ := network.Encode(network.MsgNotification, notif)
	p.Send(data)
}

// sendShopResponse sends shop transaction result.
func (e *Engine) sendShopResponse(p *player.Player, success bool, errMsg string) {
	resp := &pb.ShopResponse{Success: success, Error: errMsg}
	data, _ := network.Encode(network.MsgShopResponse, resp)
	p.Send(data)
}

// getPlayerByClient gets the player associated with a network client.
func (e *Engine) getPlayerByClient(client *network.Client) *player.Player {
	if client.ObjectID == 0 {
		return nil
	}
	val, ok := e.players.Load(client.ObjectID)
	if !ok {
		return nil
	}
	return val.(*player.Player)
}

// handleNPCInteract handles clicking on a shop NPC to open shop.
func (e *Engine) handleNPCInteract(p *player.Player, n *npc.NPC) {
	if !npc.IsShopNPC(n.Type.ID) {
		return
	}

	shopItemIDs, ok := items.ShopInventories[n.Type.ID]
	if !ok {
		return
	}

	var shopItems []*pb.ShopItem
	for _, itemID := range shopItemIDs {
		def := items.GetItemDef(itemID)
		if def == nil {
			continue
		}
		shopItems = append(shopItems, &pb.ShopItem{
			ItemId:   int32(def.ID),
			Name:     def.Name,
			Price:    def.Price,
			ItemType: int32(def.Type),
		})
	}

	shop := &pb.ShopOpen{
		NpcId:    n.ObjectID,
		ShopName: n.Type.Name,
		Items:    shopItems,
	}
	data, _ := network.Encode(network.MsgShopOpen, shop)
	p.Send(data)
}
