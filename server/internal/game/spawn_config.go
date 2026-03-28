package game

import (
	"encoding/json"
	"os"
	"time"

	"github.com/juanrossi/hbonline/server/internal/npc"
)

// SpawnEntry defines a single NPC spawn point in the configuration.
type SpawnEntry struct {
	MapName      string `json:"map_name"`
	NpcTypeID    int    `json:"npc_type_id"`
	Count        int    `json:"count"`         // number of NPCs to spawn (0 or 1 = single spawn)
	SpawnX       int    `json:"spawn_x"`
	SpawnY       int    `json:"spawn_y"`
	SpawnRadius  int    `json:"spawn_radius"`  // random offset radius from SpawnX/SpawnY (0 = exact position)
	RespawnDelay int    `json:"respawn_delay"` // override respawn delay in seconds (0 = use NpcType default)
}

// SpawnConfig holds the full spawn configuration for the server.
type SpawnConfig struct {
	Spawns []SpawnEntry `json:"spawns"`
}

// LoadSpawnConfig attempts to load spawn configuration from a JSON file.
// Returns nil if the file does not exist (caller should use defaults).
func LoadSpawnConfig(path string) (*SpawnConfig, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil // no config file, use defaults
		}
		return nil, err
	}

	var cfg SpawnConfig
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

// ToSpawnPoints converts a SpawnConfig into a flat list of npc.SpawnPoint entries,
// expanding Count and SpawnRadius into individual spawn points.
func (cfg *SpawnConfig) ToSpawnPoints() []npc.SpawnPoint {
	var points []npc.SpawnPoint
	for _, entry := range cfg.Spawns {
		count := entry.Count
		if count <= 0 {
			count = 1
		}
		for i := 0; i < count; i++ {
			points = append(points, npc.SpawnPoint{
				NpcTypeID: entry.NpcTypeID,
				MapName:   entry.MapName,
				X:         entry.SpawnX,
				Y:         entry.SpawnY,
			})
		}
	}
	return points
}

// RespawnDelayFor returns the respawn delay override for a given spawn entry,
// or zero (meaning use the NpcType default).
func (entry *SpawnEntry) RespawnDelayDuration() time.Duration {
	if entry.RespawnDelay > 0 {
		return time.Duration(entry.RespawnDelay) * time.Second
	}
	return 0
}

// DefaultSpawnConfig returns the hardcoded default spawn configuration
// matching the original SpawnNPCs() definitions.
func DefaultSpawnConfig() *SpawnConfig {
	return &SpawnConfig{
		Spawns: []SpawnEntry{
			// ================================================================
			// DEFAULT MAP (starter zone)
			// ================================================================
			{MapName: "default", NpcTypeID: 1, Count: 8, SpawnX: 55, SpawnY: 55, SpawnRadius: 15},  // Slimes
			{MapName: "default", NpcTypeID: 2, Count: 3, SpawnX: 60, SpawnY: 60, SpawnRadius: 10},  // Skeletons
			{MapName: "default", NpcTypeID: 3, Count: 2, SpawnX: 65, SpawnY: 50, SpawnRadius: 8},   // Orcs
			// Shop NPCs
			{MapName: "default", NpcTypeID: 10, SpawnX: 82, SpawnY: 82},
			{MapName: "default", NpcTypeID: 11, SpawnX: 84, SpawnY: 82},
			{MapName: "default", NpcTypeID: 12, SpawnX: 86, SpawnY: 82},

			// ================================================================
			// ARESDEN (city) — outdoor shops + guards
			// ================================================================
			{MapName: "aresden", NpcTypeID: 10, SpawnX: 160, SpawnY: 190}, // Weapon Smith
			{MapName: "aresden", NpcTypeID: 11, SpawnX: 162, SpawnY: 190}, // Armorer
			{MapName: "aresden", NpcTypeID: 12, SpawnX: 164, SpawnY: 190}, // Potion Merchant
			{MapName: "aresden", NpcTypeID: 14, Count: 4, SpawnX: 140, SpawnY: 140, SpawnRadius: 30}, // Guards

			// ================================================================
			// ARESDEN BUILDINGS — positions from original map config files
			// ================================================================
			// Blacksmith 1 (bsmith_1 waypoint 49,33)
			{MapName: "bsmith_1", NpcTypeID: 21, SpawnX: 49, SpawnY: 33},   // Tom
			// General Shop 1 (gshop_1 waypoint 59,42)
			{MapName: "gshop_1", NpcTypeID: 10, SpawnX: 59, SpawnY: 42},    // ShopKeeper-W
			// General Shop 1f — expanded shop (gshop_1f waypoints 65,41 / 43,37 / 60,37)
			{MapName: "gshop_1f", NpcTypeID: 10, SpawnX: 65, SpawnY: 41},   // ShopKeeper-W
			{MapName: "gshop_1f", NpcTypeID: 16, SpawnX: 43, SpawnY: 37},   // Kennedy
			{MapName: "gshop_1f", NpcTypeID: 15, SpawnX: 60, SpawnY: 37},   // William
			// Warehouse 1 (wrhus_1 waypoint 66,38)
			{MapName: "wrhus_1", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},    // Howard
			// Warehouse Aresden West (arewrhus waypoint 66,38)
			{MapName: "arewrhus", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},   // Howard
			// Wizard Tower 1 (wzdtwr_1 waypoint 49,33)
			{MapName: "wzdtwr_1", NpcTypeID: 19, SpawnX: 49, SpawnY: 33},   // Gandlf
			// Command Hall 1 (CmdHall_1 waypoint 57,50)
			{MapName: "cmdhall_1", NpcTypeID: 23, SpawnX: 57, SpawnY: 50},  // Gail

			// ================================================================
			// ELVINE (city) — outdoor shops + guards
			// ================================================================
			{MapName: "elvine", NpcTypeID: 10, SpawnX: 232, SpawnY: 105}, // Weapon Smith
			{MapName: "elvine", NpcTypeID: 11, SpawnX: 234, SpawnY: 105}, // Armorer
			{MapName: "elvine", NpcTypeID: 12, SpawnX: 236, SpawnY: 105}, // Potion Merchant
			{MapName: "elvine", NpcTypeID: 14, Count: 4, SpawnX: 140, SpawnY: 140, SpawnRadius: 30}, // Guards

			// ================================================================
			// ELVINE BUILDINGS — positions from original map config files
			// ================================================================
			// Blacksmith 2 (bsmith_2 waypoint 49,33)
			{MapName: "bsmith_2", NpcTypeID: 21, SpawnX: 49, SpawnY: 33},   // Tom
			// General Shop 2 (gshop_2 waypoint 59,42)
			{MapName: "gshop_2", NpcTypeID: 10, SpawnX: 59, SpawnY: 42},    // ShopKeeper-W
			// General Shop 2f — expanded shop (gshop_2f waypoints 65,41 / 43,37 / 60,37)
			{MapName: "gshop_2f", NpcTypeID: 10, SpawnX: 65, SpawnY: 41},   // ShopKeeper-W
			{MapName: "gshop_2f", NpcTypeID: 16, SpawnX: 43, SpawnY: 37},   // Kennedy
			{MapName: "gshop_2f", NpcTypeID: 15, SpawnX: 60, SpawnY: 37},   // William
			// Warehouse 2 (wrhus_2 waypoint 66,38)
			{MapName: "wrhus_2", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},    // Howard
			// Warehouse Elvine (elvwrhus waypoints 66,38)
			{MapName: "elvwrhus", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},   // Howard
			{MapName: "elvwrhus", NpcTypeID: 15, SpawnX: 66, SpawnY: 38},   // William
			// Command Hall 2 (CmdHall_2 waypoint 57,50)
			{MapName: "cmdhall_2", NpcTypeID: 23, SpawnX: 57, SpawnY: 50},  // Gail

			// ================================================================
			// MIDDLELAND (open PvP zone — higher density, radius spread)
			// ================================================================
			// South (near Aresden) — low level
			{MapName: "middleland", NpcTypeID: 1, Count: 10, SpawnX: 165, SpawnY: 480, SpawnRadius: 20}, // Slimes
			{MapName: "middleland", NpcTypeID: 1, Count: 10, SpawnX: 345, SpawnY: 475, SpawnRadius: 20}, // Slimes
			{MapName: "middleland", NpcTypeID: 2, Count: 8, SpawnX: 220, SpawnY: 400, SpawnRadius: 25},  // Skeletons
			{MapName: "middleland", NpcTypeID: 2, Count: 8, SpawnX: 290, SpawnY: 410, SpawnRadius: 25},  // Skeletons
			// Center — mid level
			{MapName: "middleland", NpcTypeID: 3, Count: 6, SpawnX: 250, SpawnY: 300, SpawnRadius: 20},  // Orcs
			{MapName: "middleland", NpcTypeID: 3, Count: 6, SpawnX: 260, SpawnY: 280, SpawnRadius: 20},  // Orcs
			{MapName: "middleland", NpcTypeID: 4, Count: 3, SpawnX: 250, SpawnY: 250, SpawnRadius: 15},  // Demons
			// North (near Elvine) — low level
			{MapName: "middleland", NpcTypeID: 1, Count: 10, SpawnX: 115, SpawnY: 45, SpawnRadius: 20},  // Slimes
			{MapName: "middleland", NpcTypeID: 1, Count: 10, SpawnX: 315, SpawnY: 45, SpawnRadius: 20},  // Slimes
			{MapName: "middleland", NpcTypeID: 2, Count: 8, SpawnX: 210, SpawnY: 110, SpawnRadius: 25},  // Skeletons

			// ================================================================
			// HUNT ZONES — denser spawns for leveling
			// ================================================================
			// Huntzone1 (near Aresden)
			{MapName: "huntzone1", NpcTypeID: 1, Count: 12, SpawnX: 100, SpawnY: 100, SpawnRadius: 30}, // Slimes
			{MapName: "huntzone1", NpcTypeID: 2, Count: 8, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},  // Skeletons
			{MapName: "huntzone1", NpcTypeID: 3, Count: 4, SpawnX: 120, SpawnY: 80, SpawnRadius: 20},   // Orcs
			// Huntzone2 (near Elvine)
			{MapName: "huntzone2", NpcTypeID: 1, Count: 12, SpawnX: 100, SpawnY: 100, SpawnRadius: 30}, // Slimes
			{MapName: "huntzone2", NpcTypeID: 2, Count: 8, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},  // Skeletons
			{MapName: "huntzone2", NpcTypeID: 3, Count: 4, SpawnX: 80, SpawnY: 120, SpawnRadius: 20},   // Orcs
			// Huntzone3
			{MapName: "huntzone3", NpcTypeID: 2, Count: 10, SpawnX: 100, SpawnY: 100, SpawnRadius: 30}, // Skeletons
			{MapName: "huntzone3", NpcTypeID: 3, Count: 6, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},  // Orcs
			{MapName: "huntzone3", NpcTypeID: 4, Count: 3, SpawnX: 100, SpawnY: 100, SpawnRadius: 20},  // Demons
			// Huntzone4
			{MapName: "huntzone4", NpcTypeID: 2, Count: 10, SpawnX: 100, SpawnY: 100, SpawnRadius: 30}, // Skeletons
			{MapName: "huntzone4", NpcTypeID: 3, Count: 6, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},  // Orcs

			// ================================================================
			// DUNGEONS — packed with monsters
			// ================================================================
			// Aresdend1
			{MapName: "aresdend1", NpcTypeID: 2, Count: 8, SpawnX: 70, SpawnY: 70, SpawnRadius: 25},   // Skeletons
			{MapName: "aresdend1", NpcTypeID: 3, Count: 5, SpawnX: 100, SpawnY: 100, SpawnRadius: 20},  // Orcs
			{MapName: "aresdend1", NpcTypeID: 4, Count: 2, SpawnX: 95, SpawnY: 50, SpawnRadius: 15},    // Demons
			// Elvined1
			{MapName: "elvined1", NpcTypeID: 2, Count: 8, SpawnX: 90, SpawnY: 90, SpawnRadius: 25},    // Skeletons
			{MapName: "elvined1", NpcTypeID: 3, Count: 5, SpawnX: 100, SpawnY: 130, SpawnRadius: 20},   // Orcs
			{MapName: "elvined1", NpcTypeID: 4, Count: 2, SpawnX: 100, SpawnY: 50, SpawnRadius: 15},    // Demons
			// Deep dungeons (dglv2-4) — mostly Orcs and Demons
			{MapName: "dglv2", NpcTypeID: 3, Count: 15, SpawnX: 200, SpawnY: 200, SpawnRadius: 80},    // Orcs
			{MapName: "dglv2", NpcTypeID: 4, Count: 8, SpawnX: 300, SpawnY: 300, SpawnRadius: 60},     // Demons
			{MapName: "dglv3", NpcTypeID: 3, Count: 10, SpawnX: 200, SpawnY: 150, SpawnRadius: 50},    // Orcs
			{MapName: "dglv3", NpcTypeID: 4, Count: 6, SpawnX: 200, SpawnY: 200, SpawnRadius: 40},     // Demons
			{MapName: "dglv4", NpcTypeID: 4, Count: 10, SpawnX: 200, SpawnY: 200, SpawnRadius: 50},    // Demons

			// ================================================================
			// 2NDMIDDLE (secondary continent)
			// ================================================================
			{MapName: "2ndmiddle", NpcTypeID: 3, Count: 8, SpawnX: 130, SpawnY: 130, SpawnRadius: 25},  // Orcs
			{MapName: "2ndmiddle", NpcTypeID: 4, Count: 4, SpawnX: 140, SpawnY: 110, SpawnRadius: 20},  // Demons
		},
	}
}
