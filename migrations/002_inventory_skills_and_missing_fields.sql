-- Migration 002: Add inventory persistence, skills, and missing character fields
-- Maps fields from C++ character file format (Gem[GM].txt) to PostgreSQL columns
--
-- Reference: helbreath-v3.82-master/Server/Core/Character/AscII71/Gem[GM].txt
-- Reference: Game.cpp _iComposePlayerDataFileContents (line ~8314)

-- =============================================================================
-- 1. Inventory & Equipment (JSON serialized)
-- Replaces: [ITEMLIST] section character-item lines
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS inventory_data TEXT DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS equipment_data TEXT DEFAULT '';

-- =============================================================================
-- 2. Bank / Warehouse storage (JSON serialized)
-- Replaces: [ITEMLIST] section character-bank-item lines
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS bank_data TEXT DEFAULT '';

-- =============================================================================
-- 3. Skills & Magic (JSON serialized)
-- Replaces: [MAGIC-SKILL-MASTERY] section
--   magic-mastery = 111111111... (100 chars, one digit per magic type)
--   skill-mastery = 100 100 0 ... (60 space-separated values)
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS skill_data TEXT DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS magic_mastery TEXT DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS spell_data TEXT DEFAULT '';

-- =============================================================================
-- 4. Quest tracking (JSON serialized)
-- Replaces: character-quest-number, character-quest-ID, current-quest-count,
--           quest-reward-type, quest-reward-amount, character-quest-completed
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS quest_data TEXT DEFAULT '';

-- =============================================================================
-- 5. Reputation & Rating
-- Replaces: character-RATING
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS reputation INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS rating INT DEFAULT 0;

-- =============================================================================
-- 6. Guild membership
-- Replaces: character-guild-name, character-guild-GUID, character-guild-rank
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS guild_name VARCHAR(20) DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS guild_id INT DEFAULT -1;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS guild_rank INT DEFAULT -1;

-- =============================================================================
-- 7. Gizon system (post-level-100 progression)
-- Replaces: gizon-item-upgade-left
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS gizon_points BIGINT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS gizon_upgrades_left INT DEFAULT 0;

-- =============================================================================
-- 8. War & Crusade system
-- Replaces: character-contribution, character-war-contribution, construct-point,
--           crusade-GUID, heldenian-GUID, crusade-job
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS contribution INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS war_contribution INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS construct_points INT DEFAULT 0;

-- =============================================================================
-- 9. Combat state
-- Replaces: super-attack-left, character-downskillindex, CrasyKiller-Count
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS super_attack_left INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS down_skill_index INT DEFAULT -1;

-- =============================================================================
-- 10. Additional C++ character fields
-- Replaces: character-LUCK, character-profile, special-event-id, limited-user
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS luck INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS profile VARCHAR(200) DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS special_event_id INT DEFAULT 0;

-- =============================================================================
-- 11. Timers & Penalties
-- Replaces: locked-map-name, locked-map-time, dead-penalty-time,
--           timeleft-shutup, penalty-block-date
-- =============================================================================
ALTER TABLE characters ADD COLUMN IF NOT EXISTS locked_map VARCHAR(30) DEFAULT '';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS locked_map_time INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS dead_penalty_time INT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS muted_until TIMESTAMPTZ;

-- =============================================================================
-- Summary of C++ Gem[GM].txt field mapping:
--
-- C++ Field                    -> PostgreSQL Column
-- -------------------------    -------------------------
-- character-name               -> name (exists)
-- account-name                 -> via accounts.username join (exists)
-- character-location           -> side (exists, 0=neutral, 1=aresden, 2=elvine)
-- character-guild-name         -> guild_name (NEW)
-- character-guild-GUID         -> guild_id (NEW)
-- character-guild-rank         -> guild_rank (NEW)
-- character-loc-map            -> map_name (exists)
-- character-loc-x/y            -> pos_x, pos_y (exists)
-- character-HP/MP/SP           -> hp, mp, sp (exists)
-- character-LEVEL              -> level (exists)
-- character-RATING             -> rating (NEW)
-- character-STR/INT/VIT/etc    -> str, vit, dex, int_stat, mag, charisma (exist)
-- character-LUCK               -> luck (NEW)
-- character-EXP                -> experience (exists)
-- character-LU_Pool            -> lu_pool (exists)
-- admin-user-level             -> admin_level (exists)
-- character-EK-Count           -> ek_count (exists)
-- character-PK-Count           -> pk_count (exists)
-- CrasyKiller-Count            -> pk_count covers this
-- character-reward-gold        -> reward_gold (exists)
-- sex-status                   -> gender (exists)
-- skin/hair/underwear-status   -> skin_color, hair_style, hair_color, underwear_color (exist)
-- hunger-status                -> hunger (exists)
-- timeleft-shutup              -> muted_until (NEW, as timestamp)
-- character-quest-*            -> quest_data JSON (NEW)
-- character-contribution       -> contribution (NEW)
-- super-attack-left            -> super_attack_left (NEW)
-- character-war-contribution   -> war_contribution (NEW)
-- construct-point              -> construct_points (NEW)
-- gizon-item-upgade-left       -> gizon_upgrades_left (NEW)
-- character-profile            -> profile (NEW)
-- special-event-id             -> special_event_id (NEW)
-- locked-map-name/time         -> locked_map, locked_map_time (NEW)
-- dead-penalty-time            -> dead_penalty_time (NEW)
-- character-downskillindex     -> down_skill_index (NEW)
-- [ITEMLIST]                   -> inventory_data, equipment_data, bank_data JSON (NEW)
-- [MAGIC-SKILL-MASTERY]        -> skill_data, magic_mastery, spell_data JSON (NEW)
-- [ITEM-EQUIP-STATUS]          -> encoded in equipment_data JSON (NEW)
-- gold (from item list)        -> gold (exists)
-- =============================================================================
