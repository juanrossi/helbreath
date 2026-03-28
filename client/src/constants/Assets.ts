import { SpriteType } from '../game/assets/HBSprite';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export enum AssetType {
    MAP = 'MAP',
    TILE_SPRITE = 'TILE_SPRITE',
    SPRITE = 'SPRITE',
    MUSIC = 'MUSIC',
    SOUND = 'SOUND',
}

export interface AssetData {
    key: string;
    fileName: string;
    assetType: AssetType;
    mapName?: string;
    music?: string;
    spriteType?: SpriteType;
    tileStartIndex?: number;
    /** If true, load at boot. If false/undefined for MAPs, load on-demand. */
    preload?: boolean;
}

// ---------------------------------------------------------------------------
// Maps — every .amd file in client/public/assets/maps/
// ---------------------------------------------------------------------------

const MAP_ASSETS: AssetData[] = [
    // Towns — preloaded at boot (starter maps)
    { key: 'aresden', fileName: 'aresden.amd', assetType: AssetType.MAP, mapName: 'aresden', music: 'aresden', preload: true },
    { key: 'elvine', fileName: 'elvine.amd', assetType: AssetType.MAP, mapName: 'elvine', music: 'elvine', preload: true },
    { key: 'middleland', fileName: 'middleland.amd', assetType: AssetType.MAP, mapName: 'middleland', music: 'middleland', preload: true },
    { key: '2ndmiddle', fileName: '2ndmiddle.amd', assetType: AssetType.MAP, mapName: '2ndmiddle', music: 'middleland' },
    { key: 'default', fileName: 'default.amd', assetType: AssetType.MAP, mapName: 'default', music: 'default', preload: true },
    { key: 'druncncity', fileName: 'druncncity.amd', assetType: AssetType.MAP, mapName: 'druncncity', music: 'druncncity' },

    // Town dungeons
    { key: 'aresdend1', fileName: 'aresdend1.amd', assetType: AssetType.MAP, mapName: 'aresdend1', music: 'dungeon' },
    { key: 'elvined1', fileName: 'elvined1.amd', assetType: AssetType.MAP, mapName: 'elvined1', music: 'dungeon' },

    // Hunt zones
    { key: 'huntzone1', fileName: 'huntzone1.amd', assetType: AssetType.MAP, mapName: 'huntzone1', music: 'middleland' },
    { key: 'huntzone2', fileName: 'huntzone2.amd', assetType: AssetType.MAP, mapName: 'huntzone2', music: 'middleland' },
    { key: 'huntzone3', fileName: 'huntzone3.amd', assetType: AssetType.MAP, mapName: 'huntzone3', music: 'middleland' },
    { key: 'huntzone4', fileName: 'huntzone4.amd', assetType: AssetType.MAP, mapName: 'huntzone4', music: 'middleland' },

    // Fight zones
    { key: 'fightzone1', fileName: 'fightzone1.amd', assetType: AssetType.MAP, mapName: 'fightzone1', music: 'middleland' },
    { key: 'fightzone2', fileName: 'fightzone2.amd', assetType: AssetType.MAP, mapName: 'fightzone2', music: 'middleland' },
    { key: 'fightzone3', fileName: 'fightzone3.amd', assetType: AssetType.MAP, mapName: 'fightzone3', music: 'middleland' },
    { key: 'fightzone4', fileName: 'fightzone4.amd', assetType: AssetType.MAP, mapName: 'fightzone4', music: 'middleland' },
    { key: 'fightzone5', fileName: 'fightzone5.amd', assetType: AssetType.MAP, mapName: 'fightzone5', music: 'middleland' },
    { key: 'fightzone6', fileName: 'fightzone6.amd', assetType: AssetType.MAP, mapName: 'fightzone6', music: 'middleland' },
    { key: 'fightzone7', fileName: 'fightzone7.amd', assetType: AssetType.MAP, mapName: 'fightzone7', music: 'middleland' },
    { key: 'fightzone8', fileName: 'fightzone8.amd', assetType: AssetType.MAP, mapName: 'fightzone8', music: 'middleland' },
    { key: 'fightzone9', fileName: 'fightzone9.amd', assetType: AssetType.MAP, mapName: 'fightzone9', music: 'middleland' },

    // Deep dungeons
    { key: 'dglv2', fileName: 'dglv2.amd', assetType: AssetType.MAP, mapName: 'dglv2', music: 'dungeon' },
    { key: 'dglv3', fileName: 'dglv3.amd', assetType: AssetType.MAP, mapName: 'dglv3', music: 'dungeon' },
    { key: 'dglv4', fileName: 'dglv4.amd', assetType: AssetType.MAP, mapName: 'dglv4', music: 'dungeon' },

    // Aresden buildings
    { key: 'bsmith_1', fileName: 'bsmith_1.amd', assetType: AssetType.MAP, mapName: 'bsmith_1', music: 'default' },
    { key: 'bsmith_1f', fileName: 'bsmith_1f.amd', assetType: AssetType.MAP, mapName: 'bsmith_1f', music: 'default' },
    { key: 'gshop_1', fileName: 'gshop_1.amd', assetType: AssetType.MAP, mapName: 'gshop_1', music: 'default' },
    { key: 'gshop_1f', fileName: 'gshop_1f.amd', assetType: AssetType.MAP, mapName: 'gshop_1f', music: 'default' },
    { key: 'wrhus_1', fileName: 'wrhus_1.amd', assetType: AssetType.MAP, mapName: 'wrhus_1', music: 'default' },
    { key: 'wrhus_1f', fileName: 'wrhus_1f.amd', assetType: AssetType.MAP, mapName: 'wrhus_1f', music: 'default' },
    { key: 'arewrhus', fileName: 'arewrhus.amd', assetType: AssetType.MAP, mapName: 'arewrhus', music: 'default' },
    { key: 'cityhall_1', fileName: 'cityhall_1.amd', assetType: AssetType.MAP, mapName: 'cityhall_1', music: 'default' },
    { key: 'cmdhall_1', fileName: 'cmdhall_1.amd', assetType: AssetType.MAP, mapName: 'cmdhall_1', music: 'default' },
    { key: 'cath_1', fileName: 'cath_1.amd', assetType: AssetType.MAP, mapName: 'cath_1', music: 'default' },
    { key: 'wzdtwr_1', fileName: 'wzdtwr_1.amd', assetType: AssetType.MAP, mapName: 'wzdtwr_1', music: 'default' },
    { key: 'gldhall_1', fileName: 'gldhall_1.amd', assetType: AssetType.MAP, mapName: 'gldhall_1', music: 'default' },

    // Elvine buildings
    { key: 'bsmith_2', fileName: 'bsmith_2.amd', assetType: AssetType.MAP, mapName: 'bsmith_2', music: 'default' },
    { key: 'bsmith_2f', fileName: 'bsmith_2f.amd', assetType: AssetType.MAP, mapName: 'bsmith_2f', music: 'default' },
    { key: 'gshop_2', fileName: 'gshop_2.amd', assetType: AssetType.MAP, mapName: 'gshop_2', music: 'default' },
    { key: 'gshop_2f', fileName: 'gshop_2f.amd', assetType: AssetType.MAP, mapName: 'gshop_2f', music: 'default' },
    { key: 'wrhus_2', fileName: 'wrhus_2.amd', assetType: AssetType.MAP, mapName: 'wrhus_2', music: 'default' },
    { key: 'wrhus_2f', fileName: 'wrhus_2f.amd', assetType: AssetType.MAP, mapName: 'wrhus_2f', music: 'default' },
    { key: 'elvwrhus', fileName: 'elvwrhus.amd', assetType: AssetType.MAP, mapName: 'elvwrhus', music: 'default' },
    { key: 'cityhall_2', fileName: 'cityhall_2.amd', assetType: AssetType.MAP, mapName: 'cityhall_2', music: 'default' },
    { key: 'cmdhall_2', fileName: 'cmdhall_2.amd', assetType: AssetType.MAP, mapName: 'cmdhall_2', music: 'default' },
    { key: 'cath_2', fileName: 'cath_2.amd', assetType: AssetType.MAP, mapName: 'cath_2', music: 'default' },
    { key: 'wzdtwr_2', fileName: 'wzdtwr_2.amd', assetType: AssetType.MAP, mapName: 'wzdtwr_2', music: 'default' },
    { key: 'gldhall_2', fileName: 'gldhall_2.amd', assetType: AssetType.MAP, mapName: 'gldhall_2', music: 'default' },

    // Farms, universities, jails
    { key: 'arefarm', fileName: 'arefarm.amd', assetType: AssetType.MAP, mapName: 'arefarm', music: 'aresden' },
    { key: 'elvfarm', fileName: 'elvfarm.amd', assetType: AssetType.MAP, mapName: 'elvfarm', music: 'elvine' },
    { key: 'areuni', fileName: 'areuni.amd', assetType: AssetType.MAP, mapName: 'areuni', music: 'aresden' },
    { key: 'elvuni', fileName: 'elvuni.amd', assetType: AssetType.MAP, mapName: 'elvuni', music: 'elvine' },
    { key: 'arejail', fileName: 'arejail.amd', assetType: AssetType.MAP, mapName: 'arejail', music: 'aresden' },
    { key: 'elvjail', fileName: 'elvjail.amd', assetType: AssetType.MAP, mapName: 'elvjail', music: 'elvine' },

    // Aresden barracks
    { key: 'arebrk11', fileName: 'arebrk11.amd', assetType: AssetType.MAP, mapName: 'arebrk11', music: 'aresden' },
    { key: 'arebrk12', fileName: 'arebrk12.amd', assetType: AssetType.MAP, mapName: 'arebrk12', music: 'aresden' },
    { key: 'arebrk21', fileName: 'arebrk21.amd', assetType: AssetType.MAP, mapName: 'arebrk21', music: 'aresden' },
    { key: 'arebrk22', fileName: 'arebrk22.amd', assetType: AssetType.MAP, mapName: 'arebrk22', music: 'aresden' },

    // Elvine barracks
    { key: 'elvbrk11', fileName: 'elvbrk11.amd', assetType: AssetType.MAP, mapName: 'elvbrk11', music: 'elvine' },
    { key: 'elvbrk12', fileName: 'elvbrk12.amd', assetType: AssetType.MAP, mapName: 'elvbrk12', music: 'elvine' },
    { key: 'elvbrk21', fileName: 'elvbrk21.amd', assetType: AssetType.MAP, mapName: 'elvbrk21', music: 'elvine' },
    { key: 'elvbrk22', fileName: 'elvbrk22.amd', assetType: AssetType.MAP, mapName: 'elvbrk22', music: 'elvine' },

    // Special / event maps
    { key: 'bisle', fileName: 'bisle.amd', assetType: AssetType.MAP, mapName: 'bisle', music: 'middleland' },
    { key: 'resurr1', fileName: 'resurr1.amd', assetType: AssetType.MAP, mapName: 'resurr1', music: 'dungeon' },
    { key: 'resurr2', fileName: 'resurr2.amd', assetType: AssetType.MAP, mapName: 'resurr2', music: 'dungeon' },
    { key: 'middled1n', fileName: 'middled1n.amd', assetType: AssetType.MAP, mapName: 'middled1n', music: 'dungeon' },
    { key: 'middled1x', fileName: 'middled1x.amd', assetType: AssetType.MAP, mapName: 'middled1x', music: 'dungeon' },
    { key: 'inferniaA', fileName: 'inferniaA.amd', assetType: AssetType.MAP, mapName: 'inferniaA', music: 'dungeon' },
    { key: 'inferniaB', fileName: 'inferniaB.amd', assetType: AssetType.MAP, mapName: 'inferniaB', music: 'dungeon' },

    // Endgame / event maps
    { key: 'abaddon', fileName: 'abaddon.amd', assetType: AssetType.MAP, mapName: 'abaddon', music: 'abaddon' },
    { key: 'icebound', fileName: 'icebound.amd', assetType: AssetType.MAP, mapName: 'icebound', music: 'dungeon' },
    { key: 'procella', fileName: 'procella.amd', assetType: AssetType.MAP, mapName: 'procella', music: 'dungeon' },
    { key: 'toh1', fileName: 'toh1.amd', assetType: AssetType.MAP, mapName: 'toh1', music: 'dungeon' },
    { key: 'toh2', fileName: 'toh2.amd', assetType: AssetType.MAP, mapName: 'toh2', music: 'dungeon' },
    { key: 'toh3', fileName: 'toh3.amd', assetType: AssetType.MAP, mapName: 'toh3', music: 'dungeon' },
    { key: 'btfield', fileName: 'btfield.amd', assetType: AssetType.MAP, mapName: 'btfield', music: 'middleland' },
    { key: 'godh', fileName: 'godh.amd', assetType: AssetType.MAP, mapName: 'godh', music: 'dungeon' },
    { key: 'HRampart', fileName: 'HRampart.amd', assetType: AssetType.MAP, mapName: 'HRampart', music: 'middleland' },
    { key: 'maze', fileName: 'maze.amd', assetType: AssetType.MAP, mapName: 'maze', music: 'dungeon' },
    { key: 'hbsh6', fileName: 'hbsh6.amd', assetType: AssetType.MAP, mapName: 'hbsh6', music: 'dungeon' },
];

// ---------------------------------------------------------------------------
// Tile Sprites
// ---------------------------------------------------------------------------

const TILE_SPRITE_ASSETS: AssetData[] = [
    { key: 'maptiles1', fileName: 'maptiles1.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 0 },
    { key: 'structures1', fileName: 'structures1.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 50 },
    { key: 'sinside1', fileName: 'sinside1.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 70 },
    { key: 'trees1', fileName: 'trees1.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 100 },
    { key: 'treeshadows', fileName: 'treeshadows.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 150 },
    { key: 'objects1', fileName: 'objects1.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 200 },
    { key: 'objects2', fileName: 'objects2.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 211 },
    { key: 'objects3', fileName: 'objects3.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 216 },
    { key: 'objects4', fileName: 'objects4.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 220 },
    { key: 'tile223-225', fileName: 'tile223-225.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 223 },
    { key: 'tile226-229', fileName: 'tile226-229.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 226 },
    { key: 'objects5', fileName: 'objects5.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 230 },
    { key: 'objects6', fileName: 'objects6.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 238 },
    { key: 'objects7', fileName: 'objects7.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 242 },
    { key: 'maptiles2', fileName: 'maptiles2.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 300 },
    { key: 'maptiles4', fileName: 'maptiles4.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 320 },
    { key: 'maptiles5', fileName: 'maptiles5.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 330 },
    { key: 'maptiles6', fileName: 'maptiles6.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 349 },
    { key: 'maptiles353-361', fileName: 'maptiles353-361.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 353 },
    { key: 'tile363-366', fileName: 'tile363-366.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 363 },
    { key: 'tile367-367', fileName: 'tile367-367.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 367 },
    { key: 'tile370-381', fileName: 'tile370-381.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 370 },
    { key: 'tile382-387', fileName: 'tile382-387.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 382 },
    { key: 'tile388-402', fileName: 'tile388-402.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 388 },
    { key: 'tile403-405', fileName: 'tile403-405.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 403 },
    { key: 'tile406-421', fileName: 'tile406-421.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 406 },
    { key: 'tile422-429', fileName: 'tile422-429.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 422 },
    { key: 'tile430-443', fileName: 'tile430-443.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 430 },
    { key: 'tile444-444', fileName: 'tile444-444.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 444 },
    { key: 'tile445-461', fileName: 'tile445-461.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 445 },
    { key: 'tile462-473', fileName: 'tile462-473.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 462 },
    { key: 'tile474-478', fileName: 'tile474-478.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 474 },
    { key: 'tile479-488', fileName: 'tile479-488.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 479 },
    { key: 'tile489-522', fileName: 'tile489-522.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 489 },
    { key: 'tile523-530', fileName: 'tile523-530.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 523 },
    { key: 'tile531-540', fileName: 'tile531-540.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 531 },
    { key: 'tile541-545', fileName: 'tile541-545.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 541 },
    { key: 'newmaps', fileName: 'newmaps.spr', assetType: AssetType.TILE_SPRITE, spriteType: SpriteType.Tiles, tileStartIndex: 550 },
];

// ---------------------------------------------------------------------------
// Character Sprites
// ---------------------------------------------------------------------------

const CHARACTER_SPRITE_ASSETS: AssetData[] = [
    // Male body sprites (light, tanned, dark skin)
    { key: 'wm', fileName: 'wm.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Human },
    { key: 'ym', fileName: 'ym.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Human },
    { key: 'bm', fileName: 'bm.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Human },

    // Female body sprites (light, tanned, dark skin)
    { key: 'ww', fileName: 'ww.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Human },
    { key: 'yw', fileName: 'yw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Human },
    { key: 'bw', fileName: 'bw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Human },
];

// ---------------------------------------------------------------------------
// Equipment Sprites
// ---------------------------------------------------------------------------

const EQUIPMENT_SPRITE_ASSETS: AssetData[] = [
    // Underwear (male / female)
    { key: 'mpt', fileName: 'mpt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wpt', fileName: 'wpt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Hair (male / female)
    { key: 'mhr', fileName: 'mhr.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whr', fileName: 'whr.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Swords (male / female) — starter weapon
    { key: 'msw', fileName: 'msw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wsw', fileName: 'wsw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // Leather armor (male / female) — starter armor
    { key: 'mlarmor', fileName: 'mlarmor.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wlarmor', fileName: 'wlarmor.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Leggings (male / female) — starter leggings
    { key: 'mleggings', fileName: 'mleggings.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wleggings', fileName: 'wleggings.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Caps (male / female) — starter helm
    { key: 'mhcap1', fileName: 'mhcap1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whcap1', fileName: 'whcap1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Capes/mantles (male / female) — starter cape
    { key: 'mmantle01', fileName: 'mmantle01.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle01', fileName: 'wmantle01.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Boots (male / female) — starter boots
    { key: 'mlboots', fileName: 'mlboots.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wlboots', fileName: 'wlboots.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // Shields (male / female)
    { key: 'msh', fileName: 'msh.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Shields },
    { key: 'wsh', fileName: 'wsh.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Shields },
];

// ---------------------------------------------------------------------------
// Monster / NPC Sprites — all monster .spr files in assets/sprites/
// ---------------------------------------------------------------------------

// Only load sprites for NPC types actually spawned by the server.
// Additional monster sprites can be loaded on-demand when new NPC types are added.
const MONSTER_SPRITE_ASSETS: AssetData[] = [
    // Currently spawned monsters (NpcType IDs 1-4)
    { key: 'slm', fileName: 'slm.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // ID 1 - Slime
    { key: 'ske', fileName: 'ske.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // ID 2 - Skeleton
    { key: 'orc', fileName: 'orc.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // ID 3 - Orc
    { key: 'demon', fileName: 'demon.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // ID 4 - Demon

    // Shop / town NPCs (IDs 10-12)
    { key: 'guard', fileName: 'guard.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },
    { key: 'shopkpr', fileName: 'shopkpr.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },
];

// ---------------------------------------------------------------------------
// Music — all .wav files in assets/music/
// ---------------------------------------------------------------------------

const MUSIC_ASSETS: AssetData[] = [
    { key: 'music-aresden', fileName: 'aresden.wav', assetType: AssetType.MUSIC },
    { key: 'music-elvine', fileName: 'elvine.wav', assetType: AssetType.MUSIC },
    { key: 'music-middleland', fileName: 'middleland.wav', assetType: AssetType.MUSIC },
    { key: 'music-default', fileName: 'MainTm.wav', assetType: AssetType.MUSIC },
    { key: 'music-dungeon', fileName: 'dungeon.wav', assetType: AssetType.MUSIC },
    { key: 'music-abaddon', fileName: 'abaddon.wav', assetType: AssetType.MUSIC },
    { key: 'music-druncncity', fileName: 'druncncity.wav', assetType: AssetType.MUSIC },
];

// ---------------------------------------------------------------------------
// Sounds
// ---------------------------------------------------------------------------

const SOUND_ASSETS: AssetData[] = [
    // Movement
    { key: 'sound-walk', fileName: 'C8.WAV', assetType: AssetType.SOUND },
    { key: 'sound-run', fileName: 'C10.WAV', assetType: AssetType.SOUND },

    // Melee combat
    { key: 'sound-melee-attack', fileName: 'C18.WAV', assetType: AssetType.SOUND },
    { key: 'sound-damage-blade', fileName: 'C6.WAV', assetType: AssetType.SOUND },

    // Ranged
    { key: 'sound-bow-attack', fileName: 'C19.WAV', assetType: AssetType.SOUND },

    // Magic
    { key: 'sound-cast', fileName: 'C16.WAV', assetType: AssetType.SOUND },
    { key: 'sound-energy-bolt', fileName: 'E1.WAV', assetType: AssetType.SOUND },

    // Critical / death
    { key: 'sound-male-critical', fileName: 'C23.WAV', assetType: AssetType.SOUND },
    { key: 'sound-female-critical', fileName: 'C24.WAV', assetType: AssetType.SOUND },
    { key: 'sound-male-death', fileName: 'C14.WAV', assetType: AssetType.SOUND },
    { key: 'sound-female-death', fileName: 'C15.WAV', assetType: AssetType.SOUND },

    // Items
    { key: 'sound-item-equip', fileName: 'E28.WAV', assetType: AssetType.SOUND },
    { key: 'sound-item-drop', fileName: 'E12.WAV', assetType: AssetType.SOUND },
    { key: 'sound-item-pickup', fileName: 'E20.WAV', assetType: AssetType.SOUND },

    // Effects
    { key: 'sound-explosion', fileName: 'E4.WAV', assetType: AssetType.SOUND },
    { key: 'sound-energy-explosion', fileName: 'E2.WAV', assetType: AssetType.SOUND },
    { key: 'sound-level-up', fileName: 'E5.WAV', assetType: AssetType.SOUND },

    // Spells
    { key: 'sound-lightning', fileName: 'E40.WAV', assetType: AssetType.SOUND },

    // Weather
    { key: 'sound-rain', fileName: 'E38.WAV', assetType: AssetType.SOUND },

    // UI
    { key: 'sound-button-click', fileName: 'C1.WAV', assetType: AssetType.SOUND },
];

// ---------------------------------------------------------------------------
// Combined static registry
// ---------------------------------------------------------------------------

const ASSETS: AssetData[] = [
    ...MAP_ASSETS,
    ...TILE_SPRITE_ASSETS,
    ...CHARACTER_SPRITE_ASSETS,
    ...EQUIPMENT_SPRITE_ASSETS,
    ...MONSTER_SPRITE_ASSETS,
    ...MUSIC_ASSETS,
    ...SOUND_ASSETS,
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all assets that need to be loaded.
 */
export function getAssets(): AssetData[] {
    return ASSETS;
}

/** Returns all assets matching the given AssetType. */
export function getAssetsByType(type: AssetType): AssetData[] {
    return ASSETS.filter((a) => a.assetType === type);
}

/** Returns a single asset by its unique key, or undefined if not found. */
export function getAssetByKey(key: string): AssetData | undefined {
    return ASSETS.find((a) => a.key === key);
}

/** Returns all map assets (convenience shorthand). */
export function getMapAssets(): AssetData[] {
    return getAssetsByType(AssetType.MAP);
}
