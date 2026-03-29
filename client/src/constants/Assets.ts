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
    // --- Base character (underwear + hair) ---
    { key: 'mpt', fileName: 'mpt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wpt', fileName: 'wpt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhr', fileName: 'mhr.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whr', fileName: 'whr.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Swords (msw = multi-weapon sprite with startSpriteSheetIndex offsets) ---
    { key: 'msw', fileName: 'msw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wsw', fileName: 'wsw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'msw2', fileName: 'msw2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wsw2', fileName: 'wsw2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'msw3', fileName: 'msw3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wsw3', fileName: 'wsw3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mswx', fileName: 'mswx.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wswx', fileName: 'wswx.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Axes ---
    { key: 'maxe1', fileName: 'maxe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'waxe1', fileName: 'waxe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'maxe2', fileName: 'maxe2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'waxe2', fileName: 'waxe2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'maxe3', fileName: 'maxe3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'waxe3', fileName: 'waxe3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'maxe4', fileName: 'maxe4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'waxe4', fileName: 'waxe4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'maxe5', fileName: 'maxe5.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'waxe5', fileName: 'waxe5.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'maxe6', fileName: 'maxe6.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'waxe6', fileName: 'waxe6.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Hammers ---
    { key: 'mhammer', fileName: 'mhammer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'whammer', fileName: 'whammer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mbhammer', fileName: 'mbhammer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wbhammer', fileName: 'wbhammer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mbabhammer', fileName: 'mbabhammer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wbabhammer', fileName: 'wbabhammer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Staves / Wands ---
    { key: 'mstaff1', fileName: 'mstaff1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wstaff1', fileName: 'wstaff1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mstaff2', fileName: 'mstaff2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wstaff2', fileName: 'wstaff2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mstaff3', fileName: 'mstaff3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wstaff3', fileName: 'wstaff3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mstaff4', fileName: 'mstaff4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wstaff4', fileName: 'wstaff4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mberserkwand', fileName: 'mberserkwand.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wberserkwand', fileName: 'wberserkwand.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mremagicwand', fileName: 'mremagicwand.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wremagicwand', fileName: 'wremagicwand.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mklonesswand', fileName: 'mklonesswand.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wklonesswand', fileName: 'wklonesswand.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Bows ---
    { key: 'mbo', fileName: 'mbo.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wbo', fileName: 'wbo.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mdirectbow', fileName: 'mdirectbow.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wdirectbow', fileName: 'wdirectbow.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mfirebow', fileName: 'mfirebow.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wfirebow', fileName: 'wfirebow.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Special weapons ---
    { key: 'mstormbringer', fileName: 'mstormbringer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wstormbringer', fileName: 'wstormbringer.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mbshadowsword', fileName: 'mbshadowsword.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wbshadowsword', fileName: 'wbshadowsword.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mdebastator', fileName: 'mdebastator.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wdebastator', fileName: 'wdebastator.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mdarkexec', fileName: 'mdarkexec.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wdarkexec', fileName: 'wdarkexec.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mlightblade', fileName: 'mlightblade.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wlightblade', fileName: 'wlightblade.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mdragonblade', fileName: 'mdragonblade.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wdragonblade', fileName: 'wdragonblade.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mklonessblade', fileName: 'mklonessblade.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wklonessblade', fileName: 'wklonessblade.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mklonessaxe', fileName: 'mklonessaxe.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wklonessaxe', fileName: 'wklonessaxe.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mklonessastock', fileName: 'mklonessastock.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wklonessastock', fileName: 'wklonessastock.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Tools ---
    { key: 'mpickaxe1', fileName: 'mpickaxe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'wpickaxe1', fileName: 'wpickaxe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'mhoe', fileName: 'mhoe.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },
    { key: 'whoe', fileName: 'whoe.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Weapons },

    // --- Body Armor (standard) ---
    { key: 'mshirt', fileName: 'mshirt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wshirt', fileName: 'wshirt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhauberk', fileName: 'mhauberk.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whauberk', fileName: 'whauberk.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mlarmor', fileName: 'mlarmor.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wlarmor', fileName: 'wlarmor.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mcmail', fileName: 'mcmail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wcmail', fileName: 'wcmail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'msmail', fileName: 'msmail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wsmail', fileName: 'wsmail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mpmail', fileName: 'mpmail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wpmail', fileName: 'wpmail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mtunic', fileName: 'mtunic.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wchemiss', fileName: 'wchemiss.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wbodice1', fileName: 'wbodice1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wbodice2', fileName: 'wbodice2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mrobe1', fileName: 'mrobe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wrobe1', fileName: 'wrobe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'msanta', fileName: 'msanta.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wsanta', fileName: 'wsanta.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Body Armor (hero / special) ---
    { key: 'mhpmail1', fileName: 'mhpmail1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whpmail1', fileName: 'whpmail1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhpmail2', fileName: 'mhpmail2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whpmail2', fileName: 'whpmail2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhlarmor1', fileName: 'mhlarmor1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whlarmor1', fileName: 'whlarmor1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhlarmor2', fileName: 'mhlarmor2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whlarmor2', fileName: 'whlarmor2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhhauberk1', fileName: 'mhhauberk1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whhauberk1', fileName: 'whhauberk1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhhauberk2', fileName: 'mhhauberk2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whhauberk2', fileName: 'whhauberk2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhbplate1', fileName: 'mhbplate1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whbplate1', fileName: 'whbplate1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhbplate2', fileName: 'mhbplate2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whbplate2', fileName: 'whbplate2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhrobe1', fileName: 'mhrobe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whrobe1', fileName: 'whrobe1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhrobe2', fileName: 'mhrobe2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whrobe2', fileName: 'whrobe2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Leggings ---
    { key: 'mtrouser', fileName: 'mtrouser.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wtrouser', fileName: 'wtrouser.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhtrouser', fileName: 'mhtrouser.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whtrouser', fileName: 'whtrouser.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mchoses', fileName: 'mchoses.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wchoses', fileName: 'wchoses.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mleggings', fileName: 'mleggings.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wleggings', fileName: 'wleggings.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wskirt', fileName: 'wskirt.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhleggings1', fileName: 'mhleggings1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whleggings1', fileName: 'whleggings1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhleggings2', fileName: 'mhleggings2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whleggings2', fileName: 'whleggings2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Helms (standard) ---
    { key: 'mhelm1', fileName: 'mhelm1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whelm1', fileName: 'whelm1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhelm2', fileName: 'mhelm2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhelm3', fileName: 'mhelm3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhelm4', fileName: 'mhelm4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whelm4', fileName: 'whelm4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Helms (horned / winged / wizard) ---
    { key: 'nmhelm1', fileName: 'nmhelm1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nwhelm1', fileName: 'nwhelm1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nmhelm2', fileName: 'nmhelm2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nwhelm2', fileName: 'nwhelm2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nmhelm3', fileName: 'nmhelm3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nwhelm3', fileName: 'nwhelm3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nmhelm4', fileName: 'nmhelm4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'nwhelm4', fileName: 'nwhelm4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Helms (hero / caps / hoods) ---
    { key: 'mhhelm1', fileName: 'mhhelm1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whhelm1', fileName: 'whhelm1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhhelm2', fileName: 'mhhelm2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whhelm2', fileName: 'whhelm2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhcap1', fileName: 'mhcap1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whcap1', fileName: 'whcap1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhcap2', fileName: 'mhcap2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whcap2', fileName: 'whcap2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mbcap', fileName: 'mbcap.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wbcap', fileName: 'wbcap.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhhood1', fileName: 'mhhood1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whhood1', fileName: 'whhood1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mhhood2', fileName: 'mhhood2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'whhood2', fileName: 'whhood2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Capes (all 6 variants) ---
    { key: 'mmantle01', fileName: 'mmantle01.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle01', fileName: 'wmantle01.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mmantle02', fileName: 'mmantle02.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle02', fileName: 'wmantle02.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mmantle03', fileName: 'mmantle03.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle03', fileName: 'wmantle03.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mmantle04', fileName: 'mmantle04.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle04', fileName: 'wmantle04.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mmantle05', fileName: 'mmantle05.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle05', fileName: 'wmantle05.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mmantle06', fileName: 'mmantle06.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wmantle06', fileName: 'wmantle06.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Boots ---
    { key: 'mshoes', fileName: 'mshoes.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wshoes', fileName: 'wshoes.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'mlboots', fileName: 'mlboots.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'wlboots', fileName: 'wlboots.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },

    // --- Shields (all variants in one file) ---
    { key: 'msh', fileName: 'msh.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Shields },
    { key: 'wsh', fileName: 'wsh.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Shields },

    // --- Accessories (angelic pendants) ---
    { key: 'tutelarangel1', fileName: 'tutelarangel1.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'tutelarangel2', fileName: 'tutelarangel2.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'tutelarangel3', fileName: 'tutelarangel3.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
    { key: 'tutelarangel4', fileName: 'tutelarangel4.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.EquipmentPack },
];

// ---------------------------------------------------------------------------
// Monster / NPC Sprites — all monster .spr files in assets/sprites/
// ---------------------------------------------------------------------------

// Register all monster / NPC sprites whose files exist in assets/sprites/.
// Keys match the NPC_SPRITE_MAP in GameScene.ts; SpriteType IDs match NPC.cfg.
const MONSTER_SPRITE_ASSETS: AssetData[] = [
    // ---- Starter area (Level 10-20) ----
    { key: 'slm', fileName: 'slm.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 10 - Slime
    { key: 'bunny', fileName: 'bunny.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 55 - Rabbit
    { key: 'cat', fileName: 'cat.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 56 - Cat
    { key: 'ant', fileName: 'ant.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 16 - Giant-Ant
    { key: 'amp', fileName: 'amp.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 22 - Amphis
    { key: 'orc', fileName: 'orc.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 14 - Orc

    // ---- Level 20-40 ----
    { key: 'zom', fileName: 'zom.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 18 - Zombie
    { key: 'scp', fileName: 'scp.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 17 - Scorpion
    { key: 'ske', fileName: 'ske.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 11 - Skeleton

    // ---- Level 40-50 ----
    { key: 'cla', fileName: 'cla.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 23 - Clay-Golem
    { key: 'gol', fileName: 'gol.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 12 - Stone-Golem
    { key: 'helb', fileName: 'helb.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },         // 27 - Hellbound
    { key: 'giantfrog', fileName: 'giantfrog.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 57 - Frog
    { key: 'rudolph', fileName: 'rudolph.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 61 - Rudolph

    // ---- Level 50-60 ----
    { key: 'troll', fileName: 'troll.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 28 - Troll
    { key: 'cyc', fileName: 'cyc.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 13 - Cyclops
    { key: 'icegolem', fileName: 'icegolem.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 65 - Ice-Golem

    // ---- Level 60-90 ----
    { key: 'beholder', fileName: 'beholder.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 53 - Beholder
    { key: 'giantplant', fileName: 'giantplant.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 60 - Plant / 76 - Giant-Tree (shared sprite)
    { key: 'orge', fileName: 'orge.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },         // 29 - Ogre
    { key: 'mtgiant', fileName: 'mtgiant.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 58 - Mountain-Giant
    { key: 'direboar', fileName: 'direboar.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 62 - DireBoar
    { key: 'tentocle', fileName: 'tentocle.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 80 - Tentocle
    { key: 'giantcrayfish', fileName: 'giantcrayfish.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 74 - Giant-Crayfish

    // ---- Level 90+ ----
    { key: 'liche', fileName: 'liche.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 30 - Liche
    { key: 'stalker', fileName: 'stalker.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 48 - Stalker
    { key: 'werewolf', fileName: 'werewolf.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 33 - WereWolf
    { key: 'darkelf', fileName: 'darkelf.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 54 - Dark-Elf
    { key: 'frost', fileName: 'frost.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 63 - Frost
    { key: 'clawturtle', fileName: 'clawturtle.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 72 - Claw-Turtle
    { key: 'giantlizard', fileName: 'giantlizard.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 75 - Giant-Lizard

    // ---- Level 140+ (endgame) ----
    { key: 'ettin', fileName: 'ettin.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 59 - Ettin
    { key: 'mastermageorc', fileName: 'mastermageorc.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 77 - MasterMage-Orc
    { key: 'nizie', fileName: 'nizie.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 79 - Nizie
    { key: 'minotaurs', fileName: 'minotaurs.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 78 - Minotaurs
    { key: 'centaurus', fileName: 'centaurus.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 71 - Centaurus
    { key: 'unicorn', fileName: 'unicorn.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 32 - Unicorn
    { key: 'demon', fileName: 'demon.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 31 - Demon
    { key: 'gagoyle', fileName: 'gagoyle.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 52 - Gagoyle

    // ---- Boss monsters ----
    { key: 'hellclaw', fileName: 'hellclaw.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 49 - Hellclaw
    { key: 'tigerworm', fileName: 'tigerworm.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 50 - Tigerworm
    { key: 'wyvern', fileName: 'wyvern.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },     // 66 - Wyvern
    { key: 'firewyvern', fileName: 'firewyvern.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 73 - Fire-Wyvern

    // ---- Town NPCs ----
    { key: 'shopkpr', fileName: 'shopkpr.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 15 - ShopKeeper-W
    { key: 'gandlf', fileName: 'gandlf.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },     // 19 - Gandlf
    { key: 'howard', fileName: 'howard.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },     // 20 - Howard
    { key: 'guard', fileName: 'guard.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 21 - Guard
    { key: 'tom', fileName: 'tom.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },           // 24 - Tom
    { key: 'william', fileName: 'william.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 25 - William
    { key: 'kennedy', fileName: 'kennedy.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },   // 26 - Kennedy
    { key: 'mcgaffin', fileName: 'mcgaffin.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster }, // 67 - McGaffin
    { key: 'perry', fileName: 'perry.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 68 - Perry
    { key: 'devlin', fileName: 'devlin.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },     // 69 - Devlin
    { key: 'gail', fileName: 'gail.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },         // 90 - Gail

    // ---- Misc ----
    { key: 'dummy', fileName: 'dummy.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },       // 34 - Dummy
    { key: 'crop', fileName: 'crop.spr', assetType: AssetType.SPRITE, spriteType: SpriteType.Monster },         // 64 - Crops
];

// ---------------------------------------------------------------------------
// Music — MP3 files in assets/music/ (converted from WAV for 64% size reduction)
// ---------------------------------------------------------------------------

const MUSIC_ASSETS: AssetData[] = [
    { key: 'music-aresden', fileName: 'aresden.mp3', assetType: AssetType.MUSIC },
    { key: 'music-elvine', fileName: 'elvine.mp3', assetType: AssetType.MUSIC },
    { key: 'music-middleland', fileName: 'middleland.mp3', assetType: AssetType.MUSIC },
    { key: 'music-default', fileName: 'MainTm.mp3', assetType: AssetType.MUSIC },
    { key: 'music-dungeon', fileName: 'dungeon.mp3', assetType: AssetType.MUSIC },
    { key: 'music-abaddon', fileName: 'abaddon.mp3', assetType: AssetType.MUSIC },
    { key: 'music-druncncity', fileName: 'druncncity.mp3', assetType: AssetType.MUSIC },
];

// ---------------------------------------------------------------------------
// Sounds — MP3 files in assets/sounds/ (converted from WAV)
// ---------------------------------------------------------------------------

const SOUND_ASSETS: AssetData[] = [
    // Movement
    { key: 'sound-walk', fileName: 'C8.mp3', assetType: AssetType.SOUND },
    { key: 'sound-run', fileName: 'C10.mp3', assetType: AssetType.SOUND },

    // Melee combat
    { key: 'sound-melee-attack', fileName: 'C18.mp3', assetType: AssetType.SOUND },
    { key: 'sound-damage-blade', fileName: 'C6.mp3', assetType: AssetType.SOUND },

    // Ranged
    { key: 'sound-bow-attack', fileName: 'C19.mp3', assetType: AssetType.SOUND },

    // Magic
    { key: 'sound-cast', fileName: 'C16.mp3', assetType: AssetType.SOUND },
    { key: 'sound-energy-bolt', fileName: 'E1.mp3', assetType: AssetType.SOUND },

    // Critical / death
    { key: 'sound-male-critical', fileName: 'C23.mp3', assetType: AssetType.SOUND },
    { key: 'sound-female-critical', fileName: 'C24.mp3', assetType: AssetType.SOUND },
    { key: 'sound-male-death', fileName: 'C14.mp3', assetType: AssetType.SOUND },
    { key: 'sound-female-death', fileName: 'C15.mp3', assetType: AssetType.SOUND },

    // Items
    { key: 'sound-item-equip', fileName: 'E28.mp3', assetType: AssetType.SOUND },
    { key: 'sound-item-drop', fileName: 'E12.mp3', assetType: AssetType.SOUND },
    { key: 'sound-item-pickup', fileName: 'E20.mp3', assetType: AssetType.SOUND },

    // Effects
    { key: 'sound-explosion', fileName: 'E4.mp3', assetType: AssetType.SOUND },
    { key: 'sound-energy-explosion', fileName: 'E2.mp3', assetType: AssetType.SOUND },
    { key: 'sound-level-up', fileName: 'E5.mp3', assetType: AssetType.SOUND },

    // Spells
    { key: 'sound-lightning', fileName: 'E40.mp3', assetType: AssetType.SOUND },

    // Weather
    { key: 'sound-rain', fileName: 'E38.mp3', assetType: AssetType.SOUND },

    // UI
    { key: 'sound-button-click', fileName: 'C1.mp3', assetType: AssetType.SOUND },
];

// ---------------------------------------------------------------------------
// Combined static registry
// ---------------------------------------------------------------------------

// Boot assets — only essentials (tiles, human base sprites, audio)
// Equipment and monster sprites are loaded on-demand to prevent WebGL context loss
const ASSETS: AssetData[] = [
    ...MAP_ASSETS,
    ...TILE_SPRITE_ASSETS,
    ...CHARACTER_SPRITE_ASSETS,
    ...MUSIC_ASSETS,
    ...SOUND_ASSETS,
];

// Deferred assets — loaded on-demand by GameScene when first needed
const DEFERRED_ASSETS: AssetData[] = [
    ...EQUIPMENT_SPRITE_ASSETS,
    ...MONSTER_SPRITE_ASSETS,
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns essential assets loaded at boot (tiles, human base, sounds).
 */
export function getAssets(): AssetData[] {
    return ASSETS;
}

/**
 * Returns deferred assets (equipment, monsters) loaded on-demand to save GPU memory.
 */
export function getDeferredAssets(): AssetData[] {
    return DEFERRED_ASSETS;
}

/** Returns all assets matching the given AssetType (from both essential and deferred). */
export function getAssetsByType(type: AssetType): AssetData[] {
    return [...ASSETS, ...DEFERRED_ASSETS].filter((a) => a.assetType === type);
}

/** Returns a single asset by its unique key (searches both essential and deferred). */
export function getAssetByKey(key: string): AssetData | undefined {
    return ASSETS.find((a) => a.key === key) || DEFERRED_ASSETS.find((a) => a.key === key);
}

/** Returns all map assets (convenience shorthand). */
export function getMapAssets(): AssetData[] {
    return getAssetsByType(AssetType.MAP);
}
