package game

import (
	"context"
	"log"

	"github.com/juanrossi/hbonline/server/internal/db"
	"github.com/juanrossi/hbonline/server/internal/items"
	"github.com/juanrossi/hbonline/server/internal/player"
)

// serializePlayerInventory converts a player's inventory and equipment into
// JSON strings suitable for database storage.
func serializePlayerInventory(p *player.Player) (inventoryJSON, equipmentJSON string) {
	invData := &db.InventoryData{}

	for i := 0; i < items.MaxInventorySlots; i++ {
		item := p.Inventory.Slots[i]
		if item == nil {
			continue
		}
		invData.Items = append(invData.Items, db.SavedItem{
			DefID:      item.DefID,
			Count:      item.Count,
			Durability: item.Durability,
			Attribute:  item.Attribute,
			Slot:       i,
		})
	}

	for i := 1; i <= items.MaxEquipSlots; i++ {
		item := p.Inventory.Equipment[i]
		if item == nil {
			continue
		}
		invData.Equipment = append(invData.Equipment, db.SavedItem{
			DefID:      item.DefID,
			Count:      item.Count,
			Durability: item.Durability,
			Attribute:  item.Attribute,
			Slot:       i,
		})
	}

	inventoryJSON = db.SerializeInventory(&db.InventoryData{Items: invData.Items})
	equipmentJSON = db.SerializeInventory(&db.InventoryData{Equipment: invData.Equipment})
	return
}

// savePlayerToDB persists all player state (stats, position, inventory) to the database.
func savePlayerToDB(store db.DataStore, ctx context.Context, p *player.Player) error {
	invJSON, eqJSON := serializePlayerInventory(p)
	return store.SaveCharacter(ctx, p.CharacterID, p.MapName, p.X, p.Y, p.Direction,
		p.Level, p.Experience, p.HP, p.MP, p.SP,
		p.STR, p.VIT, p.DEX, p.INT, p.MAG, p.CHR, p.LUPool,
		p.Side, p.Gold, p.PKCount, p.EKCount, p.Hunger,
		invJSON, eqJSON)
}

// loadPlayerInventory restores a player's inventory and equipment from the
// serialized JSON fields in a CharacterRow.
func loadPlayerInventory(p *player.Player, row *db.CharacterRow) {
	// Load inventory items
	if row.InventoryJSON != "" {
		invData, err := db.DeserializeInventory(row.InventoryJSON)
		if err != nil {
			log.Printf("Warning: failed to deserialize inventory for char %d: %v", row.ID, err)
		} else {
			for _, si := range invData.Items {
				if si.Slot < 0 || si.Slot >= items.MaxInventorySlots {
					continue
				}
				def := items.GetItemDef(si.DefID)
				if def == nil {
					log.Printf("Warning: unknown item def %d in inventory for char %d, skipping", si.DefID, row.ID)
					continue
				}
				p.Inventory.Slots[si.Slot] = &items.Item{
					DefID:      si.DefID,
					Count:      si.Count,
					Durability: si.Durability,
					Attribute:  si.Attribute,
				}
			}
		}
	}

	// Load equipment
	if row.EquipmentJSON != "" {
		eqData, err := db.DeserializeInventory(row.EquipmentJSON)
		if err != nil {
			log.Printf("Warning: failed to deserialize equipment for char %d: %v", row.ID, err)
		} else {
			for _, si := range eqData.Equipment {
				if si.Slot < 1 || si.Slot > items.MaxEquipSlots {
					continue
				}
				def := items.GetItemDef(si.DefID)
				if def == nil {
					log.Printf("Warning: unknown item def %d in equipment for char %d, skipping", si.DefID, row.ID)
					continue
				}
				p.Inventory.Equipment[si.Slot] = &items.Item{
					DefID:      si.DefID,
					Count:      si.Count,
					Durability: si.Durability,
					Attribute:  si.Attribute,
				}
			}
		}
	}

	// Update appearance and combat stats from loaded equipment
	p.SyncEquipmentAppearance()
	p.RecalcCombatStats()
}
