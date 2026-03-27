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
    /** Weapon sprite name and sheet multiplier */
    weapon?: { spriteName: string; sheetMultiplier: number };
    /** Shield sprite name and sheet multiplier */
    shield?: { spriteName: string; sheetMultiplier: number };
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
                    configs.push({
                        x: 0, y: 0,
                        spriteName: gear.weapon.spriteName,
                        spriteSheetIndex: gear.weapon.sheetMultiplier * 12 + ARMOUR_SPRITESHEET_BASE[state],
                        direction,
                        framesPerDirection,
                        animationType: AnimationType.DirectionalSubFrame,
                    });
                }
                break;

            case 'shield':
                if (!hideWeaponShield && gear.shield) {
                    configs.push({
                        x: 0, y: 0,
                        spriteName: gear.shield.spriteName,
                        spriteSheetIndex: gear.shield.sheetMultiplier * 12 + ARMOUR_SPRITESHEET_BASE[state],
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
                        spriteSheetIndex: equipData.sheetMultiplier * 12 + ARMOUR_SPRITESHEET_BASE[state],
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
