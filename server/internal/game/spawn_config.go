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
			// DEFAULT MAP (starter zone) — NPC Type IDs match NPC.cfg
			// ================================================================
			{MapName: "default", NpcTypeID: 10, Count: 8, SpawnX: 55, SpawnY: 55, SpawnRadius: 15},  // Slimes
			{MapName: "default", NpcTypeID: 11, Count: 3, SpawnX: 60, SpawnY: 60, SpawnRadius: 10},  // Skeletons
			{MapName: "default", NpcTypeID: 14, Count: 2, SpawnX: 65, SpawnY: 50, SpawnRadius: 8},   // Orcs
			// Shop NPCs
			{MapName: "default", NpcTypeID: 15, SpawnX: 82, SpawnY: 82}, // ShopKeeper
			{MapName: "default", NpcTypeID: 15, SpawnX: 84, SpawnY: 82}, // ShopKeeper
			{MapName: "default", NpcTypeID: 15, SpawnX: 86, SpawnY: 82}, // ShopKeeper

			// ================================================================
			// ARESDEN (city) — guards + spot mobs from aresden.txt
			// ================================================================
			{MapName: "aresden", NpcTypeID: 21, Count: 6, SpawnX: 240, SpawnY: 150, SpawnRadius: 25}, // Guard-Elvine patrol
			{MapName: "aresden", NpcTypeID: 21, Count: 6, SpawnX: 130, SpawnY: 180, SpawnRadius: 30}, // Guard-Aresden patrol
			{MapName: "aresden", NpcTypeID: 10, Count: 10, SpawnX: 252, SpawnY: 207, SpawnRadius: 12}, // Slime pit 1
			{MapName: "aresden", NpcTypeID: 10, Count: 10, SpawnX: 139, SpawnY: 242, SpawnRadius: 12}, // Slime pit 2
			{MapName: "aresden", NpcTypeID: 22, Count: 10, SpawnX: 114, SpawnY: 38, SpawnRadius: 14},  // Amphis pit 1
			{MapName: "aresden", NpcTypeID: 22, Count: 10, SpawnX: 163, SpawnY: 40, SpawnRadius: 12},  // Amphis pit 2
			{MapName: "aresden", NpcTypeID: 17, Count: 10, SpawnX: 210, SpawnY: 237, SpawnRadius: 20}, // Scorpion pit

			// ================================================================
			// ARESDEN BUILDINGS — positions from original MapData .txt files
			// ================================================================
			{MapName: "bsmith_1", NpcTypeID: 24, SpawnX: 49, SpawnY: 33},    // Tom
			{MapName: "gshop_1", NpcTypeID: 15, SpawnX: 59, SpawnY: 42},     // ShopKeeper-W
			{MapName: "gshop_1f", NpcTypeID: 15, SpawnX: 65, SpawnY: 41},    // ShopKeeper-W
			{MapName: "gshop_1f", NpcTypeID: 26, SpawnX: 43, SpawnY: 37},    // Kennedy
			{MapName: "gshop_1f", NpcTypeID: 25, SpawnX: 60, SpawnY: 37},    // William
			{MapName: "wrhus_1", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},     // Howard
			{MapName: "arewrhus", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},    // Howard
			{MapName: "wzdtwr_1", NpcTypeID: 19, SpawnX: 49, SpawnY: 33},    // Gandlf
			{MapName: "cmdhall_1", NpcTypeID: 90, SpawnX: 57, SpawnY: 50},   // Gail

			// ================================================================
			// ELVINE (city) — guards + spot mobs
			// ================================================================
			{MapName: "elvine", NpcTypeID: 21, Count: 6, SpawnX: 150, SpawnY: 150, SpawnRadius: 30}, // Guards
			{MapName: "elvine", NpcTypeID: 10, Count: 10, SpawnX: 100, SpawnY: 100, SpawnRadius: 20}, // Slimes
			{MapName: "elvine", NpcTypeID: 22, Count: 10, SpawnX: 200, SpawnY: 200, SpawnRadius: 15}, // Amphis

			// ================================================================
			// ELVINE BUILDINGS
			// ================================================================
			{MapName: "bsmith_2", NpcTypeID: 24, SpawnX: 49, SpawnY: 33},    // Tom
			{MapName: "gshop_2", NpcTypeID: 15, SpawnX: 59, SpawnY: 42},     // ShopKeeper-W
			{MapName: "gshop_2f", NpcTypeID: 15, SpawnX: 65, SpawnY: 41},    // ShopKeeper-W
			{MapName: "gshop_2f", NpcTypeID: 26, SpawnX: 43, SpawnY: 37},    // Kennedy
			{MapName: "gshop_2f", NpcTypeID: 25, SpawnX: 60, SpawnY: 37},    // William
			{MapName: "wrhus_2", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},     // Howard
			{MapName: "elvwrhus", NpcTypeID: 20, SpawnX: 66, SpawnY: 38},    // Howard
			{MapName: "elvwrhus", NpcTypeID: 25, SpawnX: 66, SpawnY: 38},    // William
			{MapName: "cmdhall_2", NpcTypeID: 90, SpawnX: 57, SpawnY: 50},   // Gail

			// ================================================================
			// MIDDLELAND — progressive difficulty zones
			// ================================================================
			// South (near Aresden) — Slimes + Scorpions
			{MapName: "middleland", NpcTypeID: 10, Count: 10, SpawnX: 165, SpawnY: 480, SpawnRadius: 20},
			{MapName: "middleland", NpcTypeID: 10, Count: 10, SpawnX: 345, SpawnY: 475, SpawnRadius: 20},
			{MapName: "middleland", NpcTypeID: 17, Count: 8, SpawnX: 220, SpawnY: 400, SpawnRadius: 25},
			{MapName: "middleland", NpcTypeID: 17, Count: 8, SpawnX: 290, SpawnY: 410, SpawnRadius: 25},
			// Mid — Skeletons + Orcs
			{MapName: "middleland", NpcTypeID: 11, Count: 8, SpawnX: 200, SpawnY: 300, SpawnRadius: 25},
			{MapName: "middleland", NpcTypeID: 14, Count: 6, SpawnX: 250, SpawnY: 300, SpawnRadius: 20},
			{MapName: "middleland", NpcTypeID: 14, Count: 6, SpawnX: 260, SpawnY: 280, SpawnRadius: 20},
			// Center — Trolls + Ogres
			{MapName: "middleland", NpcTypeID: 28, Count: 4, SpawnX: 250, SpawnY: 250, SpawnRadius: 15},
			{MapName: "middleland", NpcTypeID: 29, Count: 3, SpawnX: 260, SpawnY: 240, SpawnRadius: 15},
			// North (near Elvine)
			{MapName: "middleland", NpcTypeID: 10, Count: 10, SpawnX: 115, SpawnY: 45, SpawnRadius: 20},
			{MapName: "middleland", NpcTypeID: 10, Count: 10, SpawnX: 315, SpawnY: 45, SpawnRadius: 20},
			{MapName: "middleland", NpcTypeID: 11, Count: 8, SpawnX: 210, SpawnY: 110, SpawnRadius: 25},

			// ================================================================
			// HUNT ZONES — dense leveling areas
			// ================================================================
			{MapName: "huntzone1", NpcTypeID: 10, Count: 12, SpawnX: 100, SpawnY: 100, SpawnRadius: 30},
			{MapName: "huntzone1", NpcTypeID: 17, Count: 8, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},
			{MapName: "huntzone1", NpcTypeID: 14, Count: 4, SpawnX: 120, SpawnY: 80, SpawnRadius: 20},
			{MapName: "huntzone2", NpcTypeID: 10, Count: 12, SpawnX: 100, SpawnY: 100, SpawnRadius: 30},
			{MapName: "huntzone2", NpcTypeID: 11, Count: 8, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},
			{MapName: "huntzone2", NpcTypeID: 14, Count: 4, SpawnX: 80, SpawnY: 120, SpawnRadius: 20},
			{MapName: "huntzone3", NpcTypeID: 11, Count: 10, SpawnX: 100, SpawnY: 100, SpawnRadius: 30},
			{MapName: "huntzone3", NpcTypeID: 28, Count: 6, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},
			{MapName: "huntzone3", NpcTypeID: 29, Count: 3, SpawnX: 100, SpawnY: 100, SpawnRadius: 20},
			{MapName: "huntzone4", NpcTypeID: 14, Count: 10, SpawnX: 100, SpawnY: 100, SpawnRadius: 30},
			{MapName: "huntzone4", NpcTypeID: 28, Count: 6, SpawnX: 100, SpawnY: 100, SpawnRadius: 25},

			// ================================================================
			// DUNGEONS
			// ================================================================
			{MapName: "aresdend1", NpcTypeID: 11, Count: 8, SpawnX: 70, SpawnY: 70, SpawnRadius: 25},
			{MapName: "aresdend1", NpcTypeID: 14, Count: 5, SpawnX: 100, SpawnY: 100, SpawnRadius: 20},
			{MapName: "aresdend1", NpcTypeID: 28, Count: 2, SpawnX: 95, SpawnY: 50, SpawnRadius: 15},
			{MapName: "elvined1", NpcTypeID: 11, Count: 8, SpawnX: 90, SpawnY: 90, SpawnRadius: 25},
			{MapName: "elvined1", NpcTypeID: 14, Count: 5, SpawnX: 100, SpawnY: 130, SpawnRadius: 20},
			{MapName: "elvined1", NpcTypeID: 28, Count: 2, SpawnX: 100, SpawnY: 50, SpawnRadius: 15},
			// Deep dungeons — higher tier monsters
			{MapName: "dglv2", NpcTypeID: 28, Count: 10, SpawnX: 200, SpawnY: 200, SpawnRadius: 80},
			{MapName: "dglv2", NpcTypeID: 29, Count: 5, SpawnX: 300, SpawnY: 300, SpawnRadius: 60},
			{MapName: "dglv2", NpcTypeID: 48, Count: 3, SpawnX: 250, SpawnY: 250, SpawnRadius: 40},
			{MapName: "dglv3", NpcTypeID: 29, Count: 8, SpawnX: 200, SpawnY: 150, SpawnRadius: 50},
			{MapName: "dglv3", NpcTypeID: 30, Count: 4, SpawnX: 200, SpawnY: 200, SpawnRadius: 40},
			{MapName: "dglv3", NpcTypeID: 48, Count: 3, SpawnX: 150, SpawnY: 150, SpawnRadius: 30},
			{MapName: "dglv4", NpcTypeID: 30, Count: 5, SpawnX: 200, SpawnY: 200, SpawnRadius: 50},
			{MapName: "dglv4", NpcTypeID: 59, Count: 3, SpawnX: 250, SpawnY: 250, SpawnRadius: 40},
			{MapName: "dglv4", NpcTypeID: 31, Count: 2, SpawnX: 200, SpawnY: 200, SpawnRadius: 30},

			// ================================================================
			// 2NDMIDDLE (secondary continent)
			// ================================================================
			{MapName: "2ndmiddle", NpcTypeID: 14, Count: 8, SpawnX: 130, SpawnY: 130, SpawnRadius: 25},
			{MapName: "2ndmiddle", NpcTypeID: 28, Count: 4, SpawnX: 140, SpawnY: 110, SpawnRadius: 20},
			{MapName: "2ndmiddle", NpcTypeID: 29, Count: 3, SpawnX: 120, SpawnY: 100, SpawnRadius: 20},
		},
	}
}
