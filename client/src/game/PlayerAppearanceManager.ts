import { AnimationType, type GameAssetConfig } from './objects/GameAsset';

// ---------------------------------------------------------------------------
// Player States
// ---------------------------------------------------------------------------

/**
 * Player animation states matching the reference project's state indices.
 * Includes all 15 states from the sp-client reference.
 */
export enum PlayerState {
    IdlePeace = 0,
    IdleCombat = 1,
    WalkPeace = 2,
    WalkCombat = 3,
    Run = 4,
    BowStance = 5,
    MeleeAttack = 6,
    BowAttack = 7,
    Cast = 8,
    PickUp = 9,
    TakeDamage = 10,
    TakeDamageOnMove = 11,
    Die = 12,
    TakeDamageWithKnockback = 13,
    CastReady = 14,
}

// ---------------------------------------------------------------------------
// Sprite Sheet Mapping
// ---------------------------------------------------------------------------

/**
 * Maps PlayerState to the base sprite sheet index for the human body sprite.
 * The human body sprite uses FullFrame animation where each state occupies
 * a contiguous block of 8 frames per direction (8 directions = 64 frames per state,
 * except Cast which has 16 frames per direction).
 */
export const HUMAN_SPRITESHEET_BASE: Record<PlayerState, number> = {
    [PlayerState.IdlePeace]: 0,
    [PlayerState.IdleCombat]: 8,
    [PlayerState.WalkPeace]: 16,
    [PlayerState.WalkCombat]: 24,
    [PlayerState.Run]: 32,
    [PlayerState.BowStance]: 40,
    [PlayerState.MeleeAttack]: 48,
    [PlayerState.BowAttack]: 56,
    [PlayerState.Cast]: 64,
    [PlayerState.PickUp]: 72,
    [PlayerState.TakeDamage]: 80,
    [PlayerState.TakeDamageOnMove]: 80,   // shares sprite sheet with TakeDamage
    [PlayerState.Die]: 88,
    [PlayerState.TakeDamageWithKnockback]: 80, // shares sprite sheet with TakeDamage
    [PlayerState.CastReady]: 8,            // shares sprite sheet with IdleCombat
};

/**
 * Maps PlayerState to the base sprite sheet index for armour/equipment sprites.
 * Equipment sprites use DirectionalSubFrame animation where each state is a
 * separate sprite sheet, and each sheet contains 8 directions with N frames each.
 * Used for armor, helm, leggings, boots, and cape.
 */
export const ARMOUR_SPRITESHEET_BASE: Record<PlayerState, number> = {
    [PlayerState.IdlePeace]: 0,
    [PlayerState.IdleCombat]: 1,
    [PlayerState.WalkPeace]: 2,
    [PlayerState.WalkCombat]: 3,
    [PlayerState.Run]: 4,
    [PlayerState.BowStance]: 5,
    [PlayerState.MeleeAttack]: 6,
    [PlayerState.BowAttack]: 7,
    [PlayerState.Cast]: 8,
    [PlayerState.PickUp]: 9,
    [PlayerState.TakeDamage]: 10,
    [PlayerState.TakeDamageOnMove]: 10,   // shares with TakeDamage
    [PlayerState.Die]: 11,
    [PlayerState.TakeDamageWithKnockback]: 10, // shares with TakeDamage
    [PlayerState.CastReady]: 1,            // shares with IdleCombat
};

/**
 * Maps PlayerState to the armament state index used for weapons and shields.
 * Weapons use FullFrame animation: spriteSheetIndex = base + armamentStateIndex * 8 + direction
 * Shields use DirectionalSubFrame: spriteSheetIndex = base + max(armamentStateIndex, 1)
 * A value of -1 means the armament is hidden in that state.
 */
export const ARMAMENT_STATE_INDEX: Record<PlayerState, number> = {
    [PlayerState.IdlePeace]: 0,
    [PlayerState.IdleCombat]: 1,
    [PlayerState.WalkPeace]: 2,
    [PlayerState.WalkCombat]: 3,
    [PlayerState.Run]: 6,
    [PlayerState.BowStance]: -1,
    [PlayerState.MeleeAttack]: 4,
    [PlayerState.BowAttack]: 4,
    [PlayerState.Cast]: -1,
    [PlayerState.PickUp]: -1,
    [PlayerState.TakeDamage]: 5,
    [PlayerState.TakeDamageOnMove]: 5,
    [PlayerState.Die]: -1,
    [PlayerState.TakeDamageWithKnockback]: 5,
    [PlayerState.CastReady]: 1,
};

/**
 * Maps PlayerState to the number of animation frames per direction.
 * States not listed here default to 8 frames per direction.
 */
export const PLAYER_ANIMATION_FRAME_COUNT: Partial<Record<PlayerState, number>> = {
    [PlayerState.IdlePeace]: 8,
    [PlayerState.IdleCombat]: 8,
    [PlayerState.WalkPeace]: 8,
    [PlayerState.WalkCombat]: 8,
    [PlayerState.Run]: 8,
    [PlayerState.BowStance]: 8,
    [PlayerState.MeleeAttack]: 8,
    [PlayerState.BowAttack]: 8,
    [PlayerState.Cast]: 16,
    [PlayerState.PickUp]: 4,
    [PlayerState.TakeDamage]: 4,
    [PlayerState.TakeDamageOnMove]: 4,
    [PlayerState.Die]: 8,
    [PlayerState.TakeDamageWithKnockback]: 4,
    [PlayerState.CastReady]: 8,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the human body sprite name based on gender and skin color.
 *
 * @param gender - 0 = male, 1 = female
 * @param skinColor - 0 = light, 1 = tanned, 2 = dark
 * @returns Sprite name string (e.g. "wm", "yw", "bm")
 */
export function getHumanSpriteName(gender: number, skinColor: number): string {
    const skinPrefix = ['w', 'y', 'b'][skinColor] ?? 'w';
    const genderSuffix = gender === 1 ? 'w' : 'm';
    return `${skinPrefix}${genderSuffix}`;
}

/**
 * Returns true if the player state is a one-shot (non-looping) animation.
 */
export function isOneShotState(state: PlayerState): boolean {
    return state === PlayerState.MeleeAttack
        || state === PlayerState.BowAttack
        || state === PlayerState.Cast
        || state === PlayerState.PickUp
        || state === PlayerState.TakeDamage
        || state === PlayerState.TakeDamageOnMove
        || state === PlayerState.TakeDamageWithKnockback
        || state === PlayerState.Die;
}

/**
 * Returns true if the given state is a movement state (walk/run).
 */
export function isMovementState(state: PlayerState): boolean {
    return state === PlayerState.WalkPeace
        || state === PlayerState.WalkCombat
        || state === PlayerState.Run;
}

// ---------------------------------------------------------------------------
// Equipment ApprIndex Lookup Tables
// ---------------------------------------------------------------------------

/**
 * Lookup tables mapping server ApprIndex values to sprite names.
 * ApprIndex 0 means no equipment. Each entry is [maleSprite, femaleSprite, sheetMultiplier].
 * For items with separate .spr files per variant, sheetMultiplier is 0.
 * For items packed in a single .spr file (shields, leggings), sheetMultiplier varies.
 */

type EquipSpriteEntry = { male: string; female: string; sheetMultiplier: number };

// ---------------------------------------------------------------------------
// Weapon ApprIndex Lookup
// ---------------------------------------------------------------------------
// Weapons use FullFrame animation. sheetMultiplier encodes startSpriteSheetIndex
// (the byte offset within the .spr file for multi-weapon sprites like msw).
// Derived from C++ MakeSprite registrations and sp-client Items.ts references.
const WEAPON_APPR: Record<number, EquipSpriteEntry> = {
    // --- Swords (msw.spr contains multiple weapon types at 56-frame offsets) ---
    1:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 0 },   // Dagger
    2:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 56 },  // ShortSword
    4:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 168 }, // Sabre
    5:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 224 }, // Scimitar
    6:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 280 }, // Falchion
    7:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 336 }, // Rapier / Esterk / SwordSB
    8:  { male: 'msw',            female: 'wsw',            sheetMultiplier: 392 }, // BloodSword / BroadSword
    9:  { male: 'mswx',           female: 'wswx',           sheetMultiplier: 0 },   // Excalibur
    10: { male: 'msw',            female: 'wsw',            sheetMultiplier: 504 }, // Claymore
    11: { male: 'msw',            female: 'wsw',            sheetMultiplier: 560 }, // GreatSword
    12: { male: 'msw',            female: 'wsw',            sheetMultiplier: 616 }, // Flamberge
    // --- Large / special swords (msw2, msw3 separate files) ---
    13: { male: 'msw2',           female: 'wsw2',           sheetMultiplier: 0 },   // GiantSword / DemonSlayer
    14: { male: 'mstormbringer',  female: 'wstormbringer',  sheetMultiplier: 0 },   // StormBringer / TheVampire
    15: { male: 'msw',            female: 'wsw',            sheetMultiplier: 560 }, // StormBlade (GreatSword base)
    16: { male: 'mdarkexec',      female: 'wdarkexec',      sheetMultiplier: 0 },   // DarkExecutor
    17: { male: 'mklonessblade',  female: 'wklonessblade',  sheetMultiplier: 0 },   // KlonessBlade
    18: { male: 'mklonessastock', female: 'wklonessastock', sheetMultiplier: 0 },   // KlonessEsterk
    19: { male: 'msw',            female: 'wsw',            sheetMultiplier: 560 }, // GodBlade (GreatSword base)
    // --- Axes (maxe1-6 separate files) ---
    20: { male: 'maxe1',          female: 'waxe1',          sheetMultiplier: 0 },   // DoubleAxe
    21: { male: 'maxe2',          female: 'waxe2',          sheetMultiplier: 0 },   // WarAxe
    22: { male: 'maxe3',          female: 'waxe3',          sheetMultiplier: 0 },   // LightAxe
    24: { male: 'maxe5',          female: 'waxe5',          sheetMultiplier: 0 },   // GoldenAxe
    25: { male: 'mpickaxe1',      female: 'wpickaxe1',      sheetMultiplier: 0 },   // PickAxe
    26: { male: 'maxe6',          female: 'waxe6',          sheetMultiplier: 0 },   // BattleAxe
    27: { male: 'mhoe',           female: 'whoe',           sheetMultiplier: 0 },   // Hoe
    28: { male: 'mklonessaxe',    female: 'wklonessaxe',    sheetMultiplier: 0 },   // DefenderAxe / KlonessAxe / GreatAxe
    // --- Special melee ---
    29: { male: 'mlightblade',    female: 'wlightblade',    sheetMultiplier: 0 },   // LightingBlade
    30: { male: 'mdebastator',    female: 'wdebastator',    sheetMultiplier: 0 },   // Penitence / Devastator
    31: { male: 'mhammer',        female: 'whammer',        sheetMultiplier: 0 },   // Hammer
    32: { male: 'mbhammer',       female: 'mbhammer',       sheetMultiplier: 0 },   // BattleHammer / GiantBattleHammer
    33: { male: 'mbshadowsword',  female: 'wbshadowsword',  sheetMultiplier: 0 },   // BlackShadow
    // --- Staves / Wands ---
    34: { male: 'mberserkwand',   female: 'wberserkwand',   sheetMultiplier: 0 },   // BerserkWand / XelimaWandMS0
    35: { male: 'mstaff1',        female: 'wstaff1',        sheetMultiplier: 0 },   // WandMShield / MagicWand2
    36: { male: 'mstaff2',        female: 'wstaff2',        sheetMultiplier: 0 },   // WandMS20 / WandMS10 / MagicWand1
    37: { male: 'mstaff3',        female: 'wstaff3',        sheetMultiplier: 0 },   // WandMS30 / TemplarWand
    38: { male: 'mremagicwand',   female: 'wremagicwand',   sheetMultiplier: 0 },   // ResurWandMS20 / BloodWandMS40
    39: { male: 'mklonesswand',   female: 'wklonesswand',   sheetMultiplier: 0 },   // KlonessMS20 / KlonessMS28
    // --- Bows (mbo.spr contains ShortBow+LongBow at 56-frame offsets) ---
    40: { male: 'mbo',            female: 'wbo',            sheetMultiplier: 0 },   // ShortBow / DarkElfBow
    41: { male: 'mbo',            female: 'wbo',            sheetMultiplier: 56 },  // LongBow / CompositeBow
    42: { male: 'mdirectbow',     female: 'wdirectbow',     sheetMultiplier: 0 },   // Direction-Bow / Storm-Bow
    43: { male: 'mfirebow',       female: 'wfirebow',       sheetMultiplier: 0 },   // Fire-Bow
};

// ---------------------------------------------------------------------------
// Shield ApprIndex Lookup
// ---------------------------------------------------------------------------
// All shields use msh.spr/wsh.spr. Each shield variant occupies 7 sheets
// (7 states per shield). sheetMultiplier = startSpriteSheetIndex = variant*7.
// C++ registration: DEF_SPRID_SHIELD + ApprIndex*8, reads Msh at 7*(ApprIndex-1).
const SHIELD_APPR: Record<number, EquipSpriteEntry> = {
    1: { male: 'msh', female: 'wsh', sheetMultiplier: 0 },  // WoodShield
    2: { male: 'msh', female: 'wsh', sheetMultiplier: 7 },  // LeatherShield
    3: { male: 'msh', female: 'wsh', sheetMultiplier: 14 }, // TargeShield
    4: { male: 'msh', female: 'wsh', sheetMultiplier: 21 }, // NunChaKu / Scooterm
    5: { male: 'msh', female: 'wsh', sheetMultiplier: 28 }, // BlondeShield
    6: { male: 'msh', female: 'wsh', sheetMultiplier: 35 }, // MainGauche / IronShield
    7: { male: 'msh', female: 'wsh', sheetMultiplier: 42 }, // LagiShield / KnightShield
    8: { male: 'msh', female: 'wsh', sheetMultiplier: 49 }, // GMShield
    9: { male: 'msh', female: 'wsh', sheetMultiplier: 56 }, // TowerShield / MasterShield / MerienShield
};

// ---------------------------------------------------------------------------
// Body Armor ApprIndex Lookup
// ---------------------------------------------------------------------------
// C++ registration: DEF_SPRID_BODYARMOR_M/W + ApprIndex*15.
// Male and female share the same ApprIndex but map to different sprite files.
// sheetMultiplier is 0 for all armor (formula is ARMOUR_SPRITESHEET_BASE[state]).
const BODY_ARMOR_APPR: Record<number, EquipSpriteEntry> = {
    1:  { male: 'mlarmor',    female: 'wbodice1',    sheetMultiplier: 0 }, // Leather(M) / Bodice(W)
    2:  { male: 'mcmail',     female: 'wbodice2',    sheetMultiplier: 0 }, // ChainMail(M) / LongBodice(W)
    3:  { male: 'msmail',     female: 'wlarmor',     sheetMultiplier: 0 }, // ScaleMail(M) / Leather(W)
    4:  { male: 'mpmail',     female: 'wcmail',      sheetMultiplier: 0 }, // PlateMail(M) / ChainMail(W)
    5:  { male: 'mtunic',     female: 'wsmail',      sheetMultiplier: 0 }, // Tunic(M) / ScaleMail(W)
    6:  { male: 'mrobe1',     female: 'wpmail',      sheetMultiplier: 0 }, // Robe(M) / PlateMail(W)
    7:  { male: 'msanta',     female: 'wrobe1',      sheetMultiplier: 0 }, // Santa(M) / Robe(W)
    8:  { male: 'mhpmail1',   female: 'wsanta',      sheetMultiplier: 0 }, // eHeroArmor(M) / Santa(W)
    9:  { male: 'mhpmail2',   female: 'whpmail1',    sheetMultiplier: 0 }, // aHeroArmor(M) / eHeroArmor(W)
    10: { male: 'mhrobe1',    female: 'whpmail2',    sheetMultiplier: 0 }, // eHeroRobe(M) / aHeroArmor(W)
    11: { male: 'mhrobe2',    female: 'whrobe1',     sheetMultiplier: 0 }, // aHeroRobe(M) / eHeroRobe(W)
    12: { male: 'mhrobe2',    female: 'whrobe2',     sheetMultiplier: 0 }, // aHeroRobe(W) (male fallback: mhrobe2)
    13: { male: 'mrobe1',     female: 'wrobe1',      sheetMultiplier: 0 }, // DarkMageRobe (robe base fallback)
    14: { male: 'mcmail',     female: 'wcmail',      sheetMultiplier: 0 }, // DarkKnightArmor (chainmail base fallback)
};

// ---------------------------------------------------------------------------
// Hauberk/Arm Armor ApprIndex Lookup
// ---------------------------------------------------------------------------
// Hauberks (arm/shirt layer) use DEF_SPRID_BERK_M/W + ApprIndex*15.
// The server's sAppr3 low nibble encodes this.
// Male: 1=MShirt, 2=MHauberk, 3=MHHauberk1(eHero), 4=MHHauberk2(aHero)
// Female: 1=WChemiss, 2=WShirt, 3=WHauberk, 4=WHHauberk1(eHero), 5=WHHauberk2(aHero)
// NOTE: Currently the hauberk slot is resolved separately from body armor.
// The server packs hauberk in sAppr3 bits 0-3.

// ---------------------------------------------------------------------------
// Helm ApprIndex Lookup
// ---------------------------------------------------------------------------
// C++ registration: DEF_SPRID_HEAD_M/W + ApprIndex*15.
// ApprIndex from sAppr3 bits 4-7.
const HELM_APPR: Record<number, EquipSpriteEntry> = {
    1:  { male: 'mhelm1',   female: 'whelm1',   sheetMultiplier: 0 }, // FullHelm / KnightFullHelm
    3:  { male: 'mhelm3',   female: 'whelm4',   sheetMultiplier: 0 }, // MerienHelm / DrowHelm (mhelm3 = index 3)
    4:  { male: 'mhelm4',   female: 'whelm4',   sheetMultiplier: 0 }, // Helm / ClericSymbol
    5:  { male: 'nmhelm1',  female: 'nwhelm1',  sheetMultiplier: 0 }, // HornedHelm / WarlordHelm2
    6:  { male: 'nmhelm2',  female: 'nwhelm2',  sheetMultiplier: 0 }, // WingedHelm / WarlordHelm1
    7:  { male: 'nmhelm3',  female: 'nwhelm3',  sheetMultiplier: 0 }, // WizardCap / MerienHat / ArchiMageHat1
    8:  { male: 'nmhelm4',  female: 'nwhelm4',  sheetMultiplier: 0 }, // WizardHat / ArchiMageHat2
    9:  { male: 'mhhelm1',  female: 'whhelm1',  sheetMultiplier: 0 }, // eHeroHelm(M/W)
    10: { male: 'mhhelm2',  female: 'whhelm2',  sheetMultiplier: 0 }, // aHeroHelm(M/W)
    11: { male: 'mhcap1',   female: 'whcap1',   sheetMultiplier: 0 }, // eHeroCap(M/W)
    12: { male: 'mhcap2',   female: 'whcap2',   sheetMultiplier: 0 }, // aHeroCap(M/W)
    13: { male: 'mhelm1',   female: 'whelm1',   sheetMultiplier: 0 }, // DarkKnightHelm (FullHelm fallback)
};

// ---------------------------------------------------------------------------
// Leggings ApprIndex Lookup
// ---------------------------------------------------------------------------
// C++ registration: DEF_SPRID_LEGG_M/W + ApprIndex*15.
// Male: 1=MTrouser, 2=MHTrouser, 3=MCHoses, 4=MLeggings, 5=MHLeggings1, 6=MHLeggings2
// Female: 1=WSkirt, 2=WTrouser, 3=WHTrouser, 4=WCHoses, 5=WLeggings, 6=WHLeggings1, 7=WHLeggings2
const LEGGINGS_APPR: Record<number, EquipSpriteEntry> = {
    1: { male: 'mtrouser',     female: 'wskirt',       sheetMultiplier: 0 }, // Trousers(M) / Skirt(W)
    2: { male: 'mhtrouser',    female: 'wtrouser',     sheetMultiplier: 0 }, // KneeTrousers(M) / Trousers(W)
    3: { male: 'mchoses',      female: 'whtrouser',    sheetMultiplier: 0 }, // ChainHose(M) / KneeTrousers(W)
    4: { male: 'mleggings',    female: 'wchoses',      sheetMultiplier: 0 }, // PlateLeggings(M) / ChainHose(W)
    5: { male: 'mhleggings1',  female: 'wleggings',    sheetMultiplier: 0 }, // eHeroLeggings(M) / PlateLeggings(W)
    6: { male: 'mhleggings2',  female: 'whleggings1',  sheetMultiplier: 0 }, // aHeroLeggings(M) / eHeroLeggings(W)
    7: { male: 'mhleggings2',  female: 'whleggings2',  sheetMultiplier: 0 }, // aHeroLeggings(W) (male fallback: mhleggings2)
    8: { male: 'mleggings',    female: 'wleggings',    sheetMultiplier: 0 }, // DarkKnightLeggings (PlateLeggings fallback)
};

// ---------------------------------------------------------------------------
// Boots ApprIndex Lookup
// ---------------------------------------------------------------------------
// C++ registration: DEF_SPRID_BOOT_M/W + ApprIndex*15.
// Male: 1=MShoes, 2=MLBoots  |  Female: 1=WShoes, 2=WLBoots
const BOOTS_APPR: Record<number, EquipSpriteEntry> = {
    1: { male: 'mshoes',  female: 'wshoes',  sheetMultiplier: 0 }, // Shoes
    2: { male: 'mlboots', female: 'wlboots', sheetMultiplier: 0 }, // LongBoots / DrowBoots
};

// ---------------------------------------------------------------------------
// Cape (Mantle) ApprIndex Lookup
// ---------------------------------------------------------------------------
// C++ registration: DEF_SPRID_MANTLE_M/W + ApprIndex*15.
// Male: 1-6 = Mmantle01-06  |  Female: 1-6 = Wmantle01-06
const CAPE_APPR: Record<number, EquipSpriteEntry> = {
    1: { male: 'mmantle01', female: 'wmantle01', sheetMultiplier: 0 }, // RiteCape / AresdenHeroCape
    2: { male: 'mmantle02', female: 'wmantle02', sheetMultiplier: 0 }, // InfameCape / ElvineHeroCape
    3: { male: 'mmantle03', female: 'wmantle03', sheetMultiplier: 0 }, // Cape
    4: { male: 'mmantle04', female: 'wmantle04', sheetMultiplier: 0 }, // AresdenHeroLongCape / AresdenPriceCape
    5: { male: 'mmantle05', female: 'wmantle05', sheetMultiplier: 0 }, // ElvineHeroLongCape / ElvinePriceCape
    6: { male: 'mmantle06', female: 'wmantle06', sheetMultiplier: 0 }, // Cape+1 / DruidCape / EldinielCape / etc.
};

/**
 * Resolves an equipment ApprIndex value to a sprite name and sheet multiplier.
 *
 * @param slot - Equipment slot type
 * @param apprIndex - ApprIndex value from server (0 = none)
 * @param gender - 0 = male, 1 = female
 * @returns Object with spriteName and sheetMultiplier, or undefined if no equipment
 */
export function resolveEquipmentSprite(
    slot: 'weapon' | 'shield' | 'armor' | 'helm' | 'leggings' | 'boots' | 'cape',
    apprIndex: number,
    gender: number,
): { spriteName: string; sheetMultiplier: number; startSpriteSheetIndex?: number } | undefined {
    if (apprIndex <= 0) return undefined;

    const table: Record<number, EquipSpriteEntry> | undefined = {
        weapon: WEAPON_APPR,
        shield: SHIELD_APPR,
        armor: BODY_ARMOR_APPR,
        helm: HELM_APPR,
        leggings: LEGGINGS_APPR,
        boots: BOOTS_APPR,
        cape: CAPE_APPR,
    }[slot];

    if (!table) return undefined;
    const entry = table[apprIndex];
    if (!entry) return undefined;

    const isFemale = gender === 1;
    const result: { spriteName: string; sheetMultiplier: number; startSpriteSheetIndex?: number } = {
        spriteName: isFemale ? entry.female : entry.male,
        sheetMultiplier: entry.sheetMultiplier,
    };

    // Weapons and shields use startSpriteSheetIndex from the sheetMultiplier field
    // (for weapons/shields, sheetMultiplier encodes the start offset within the .spr file)
    if (slot === 'weapon' || slot === 'shield') {
        result.startSpriteSheetIndex = entry.sheetMultiplier;
    }

    return result;
}

// ---------------------------------------------------------------------------
// Gear Configuration
// ---------------------------------------------------------------------------

/** Equipment slot name identifiers. */
export type EquipmentSlot =
    | 'human' | 'hair' | 'underwear'
    | 'armor' | 'hauberk' | 'helm' | 'leggings' | 'boots'
    | 'cape' | 'weapon' | 'shield' | 'accessory';

/**
 * Configuration describing the player's current visual gear for rendering.
 */
export type GearConfig = {
    /** Human body sprite name (e.g. "wm", "bw") from getHumanSpriteName */
    human: string;
    /** Underwear color index (determines which sprite sheet to use) */
    underwearColorIndex?: number;
    /** Hair style index (determines which sprite sheet to use) */
    hairStyleIndex?: number;
    /** Armour sprite name and sheet multiplier */
    armor?: { spriteName: string; sheetMultiplier: number };
    /** Hauberk sprite name and sheet multiplier */
    hauberk?: { spriteName: string; sheetMultiplier: number };
    /** Helm sprite name and sheet multiplier */
    helm?: { spriteName: string; sheetMultiplier: number };
    /** Leggings sprite name and sheet multiplier */
    leggings?: { spriteName: string; sheetMultiplier: number };
    /** Boots sprite name and sheet multiplier */
    boots?: { spriteName: string; sheetMultiplier: number };
    /** Cape sprite name and sheet multiplier */
    cape?: { spriteName: string; sheetMultiplier: number };
    /** Weapon sprite name, sheet multiplier, and optional start sprite sheet index */
    weapon?: { spriteName: string; sheetMultiplier: number; startSpriteSheetIndex?: number };
    /** Shield sprite name, sheet multiplier, and optional start sprite sheet index */
    shield?: { spriteName: string; sheetMultiplier: number; startSpriteSheetIndex?: number };
    /** Accessory sprite name and sheet multiplier */
    accessory?: { spriteName: string; sheetMultiplier: number };
};

// ---------------------------------------------------------------------------
// Direction-Aware Equipment Render Order
// ---------------------------------------------------------------------------

/**
 * Mantle (cape) drawing order indexed by direction (0-7).
 * Determines where the cape renders relative to other equipment layers.
 * Values indicate relative position in the equipment layer stack.
 *   0 = render cape before most equipment (behind body)
 *   1 = render cape after armor (in front)
 */
const MANTLE_DRAWING_ORDER = [1, 1, 1, 0, 0, 0, 1, 1];

/**
 * Returns the equipment layer render order for the given direction and state.
 * Handles weapon/shield swap and cape positioning based on facing direction.
 *
 * @param direction - Direction index 0-7 (N, NE, E, SE, S, SW, W, NW)
 * @param state - Current player animation state
 * @returns Ordered array of equipment slot names (back-to-front)
 */
export function getGearRenderOrder(direction: number, _state: PlayerState): EquipmentSlot[] {
    const mantleBehind = MANTLE_DRAWING_ORDER[direction] === 0;

    // Base body layers always render first
    const order: EquipmentSlot[] = ['human', 'hair', 'underwear'];

    // Cape renders early if behind (directions 3=SE, 4=S, 5=SW)
    if (mantleBehind) {
        order.push('cape');
    }

    // Armor layers
    order.push('hauberk', 'leggings', 'boots', 'helm', 'armor');

    // Weapon/shield order swaps based on direction
    // Directions facing right (1=NE, 2=E, 3=SE): shield before weapon
    // Directions facing left (5=SW, 6=W, 7=NW): weapon before shield
    if (direction >= 1 && direction <= 3) {
        order.push('shield', 'weapon');
    } else {
        order.push('weapon', 'shield');
    }

    // Cape renders late if in front
    if (!mantleBehind) {
        order.push('cape');
    }

    order.push('accessory');
    return order;
}

// ---------------------------------------------------------------------------
// Asset Config Builder
// ---------------------------------------------------------------------------

/**
 * Builds an array of GameAssetConfig objects describing the layered sprite
 * composition for a player character with full equipment support.
 *
 * @param direction - Direction index 0-7
 * @param state - Current player animation state
 * @param gear - The player's current gear configuration
 * @returns Array of GameAssetConfig objects (x and y set to 0)
 */
export function buildPlayerAssetConfigs(
    direction: number,
    state: PlayerState,
    gear: GearConfig,
): GameAssetConfig[] {
    const configs: GameAssetConfig[] = [];
    const framesPerDirection = PLAYER_ANIMATION_FRAME_COUNT[state] ?? 8;
    const isFemale = gear.human === 'ww' || gear.human === 'yw' || gear.human === 'bw';

    const renderOrder = getGearRenderOrder(direction, state);

    // Hide weapon/shield during cast and die states
    const hideWeaponShield = state === PlayerState.Cast || state === PlayerState.Die;

    for (const slot of renderOrder) {
        switch (slot) {
            case 'human':
                configs.push({
                    x: 0, y: 0,
                    spriteName: gear.human,
                    spriteSheetIndex: HUMAN_SPRITESHEET_BASE[state] + direction,
                    animationType: AnimationType.FullFrame,
                });
                break;

            case 'hair': {
                const hairSprite = isFemale ? 'whr' : 'mhr';
                const hairStyleIndex = gear.hairStyleIndex ?? 0;
                configs.push({
                    x: 0, y: 0,
                    spriteName: hairSprite,
                    spriteSheetIndex: hairStyleIndex * 12 + ARMOUR_SPRITESHEET_BASE[state],
                    direction,
                    framesPerDirection,
                    animationType: AnimationType.DirectionalSubFrame,
                });
                break;
            }

            case 'underwear': {
                const underwearSprite = isFemale ? 'wpt' : 'mpt';
                const underwearColorIndex = gear.underwearColorIndex ?? 0;
                configs.push({
                    x: 0, y: 0,
                    spriteName: underwearSprite,
                    spriteSheetIndex: underwearColorIndex * 12 + ARMOUR_SPRITESHEET_BASE[state],
                    direction,
                    framesPerDirection,
                    animationType: AnimationType.DirectionalSubFrame,
                });
                break;
            }

            case 'weapon':
                if (!hideWeaponShield && gear.weapon) {
                    const armStateIdx = ARMAMENT_STATE_INDEX[state] ?? -1;
                    if (armStateIdx >= 0) {
                        const base = gear.weapon.startSpriteSheetIndex ?? 0;
                        const weaponSheetIndex = base + armStateIdx * 8 + direction;
                        configs.push({
                            x: 0, y: 0,
                            spriteName: gear.weapon.spriteName,
                            spriteSheetIndex: weaponSheetIndex,
                            animationType: AnimationType.FullFrame,
                        });
                    }
                }
                break;

            case 'shield':
                if (!hideWeaponShield && gear.shield) {
                    const shieldArmStateIdx = ARMAMENT_STATE_INDEX[state] ?? 1;
                    const effectiveIdx = Math.max(shieldArmStateIdx, 1);
                    const shieldBase = gear.shield.startSpriteSheetIndex ?? 0;
                    const shieldSheetIndex = shieldBase + effectiveIdx;
                    configs.push({
                        x: 0, y: 0,
                        spriteName: gear.shield.spriteName,
                        spriteSheetIndex: shieldSheetIndex,
                        direction,
                        framesPerDirection,
                        animationType: AnimationType.DirectionalSubFrame,
                    });
                }
                break;

            default: {
                // armor, hauberk, helm, leggings, boots, cape, accessory
                const equipData = gear[slot as keyof GearConfig];
                if (equipData && typeof equipData === 'object' && 'spriteName' in equipData) {
                    configs.push({
                        x: 0, y: 0,
                        spriteName: equipData.spriteName,
                        spriteSheetIndex: ARMOUR_SPRITESHEET_BASE[state],
                        direction,
                        framesPerDirection,
                        animationType: AnimationType.DirectionalSubFrame,
                    });
                }
                break;
            }
        }
    }

    return configs;
}
