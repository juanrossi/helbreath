package db

import "encoding/json"

// SavedItem represents a single item for JSON persistence.
type SavedItem struct {
	DefID      int    `json:"d"`
	Count      int    `json:"c"`
	Durability int    `json:"dur"`
	Attribute  uint32 `json:"attr,omitempty"`
	Slot       int    `json:"s"` // inventory slot index or equipment slot
}

// InventoryData holds the full serializable inventory state.
type InventoryData struct {
	Items     []SavedItem `json:"items"`
	Equipment []SavedItem `json:"equip"`
}

// SerializeInventory converts InventoryData to a JSON string.
func SerializeInventory(data *InventoryData) string {
	b, _ := json.Marshal(data)
	return string(b)
}

// DeserializeInventory parses a JSON string back into InventoryData.
func DeserializeInventory(raw string) (*InventoryData, error) {
	if raw == "" {
		return &InventoryData{}, nil
	}
	var data InventoryData
	err := json.Unmarshal([]byte(raw), &data)
	return &data, err
}
