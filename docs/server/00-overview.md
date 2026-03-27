# Server Implementation Gap Analysis — Overview

This document set captures the differences between the original Helbreath C++ server (`Game.cpp`, 67,539 lines) and the current Go rewrite (`server/`). Each phase document contains a checklist of mechanics to implement, ordered by dependency and gameplay impact.

## Reference Files

- **C++ Source**: `ep_client_final/sources_ep_gserver/Game.cpp`
- **Go Server**: `server/internal/game/`, `server/internal/npc/`, `server/internal/items/`, `server/internal/magic/`, `server/internal/skills/`

## Phases

| Phase | Focus | Description |
|-------|-------|-------------|
| [Phase 1](phase1-combat-fidelity.md) | Core Combat Fidelity | Port the C++ damage/hit formulas, dice system, weapon skills, and defense model |
| [Phase 2](phase2-monster-ai.md) | Monster AI & Spawning | Flee behavior, faction targeting, NPC spellcasting, attack patterns, boss spawns |
| [Phase 3](phase3-status-effects-magic.md) | Status Effects & Magic | All 13+ status effects, spell resistance, knockback, metamorphosis |
| [Phase 4](phase4-death-loot-economy.md) | Death, Loot & Economy | PK penalties, item drops on death, loot tables, reputation, item enchantments |
| [Phase 5](phase5-endgame-pvp.md) | Endgame & PvP Systems | Gizon points, guild wars, crusade mode, map rules, day/night effects |

## How to Use These Documents

Each phase document contains:
1. A **context section** explaining what the C++ does and what the Go server currently has
2. A **checklist** with implementable tasks, each with a brief description of the expected behavior
3. **C++ reference** line numbers and function names for cross-referencing

Phases are ordered by dependency — Phase 1 must be done before Phase 3 (status effects depend on the combat model), and Phase 4 depends on both Phase 1 and Phase 2.

```
Phase 1 (Combat) ──┐
                    ├── Phase 3 (Effects/Magic) ──┐
Phase 2 (AI) ──────┤                              ├── Phase 5 (Endgame/PvP)
                    └── Phase 4 (Death/Loot) ──────┘
```
