export const TILE_SIZE = 32;
export const DEPTH_MULTIPLIER = 100;
export const HIGH_DEPTH = 5000000;

// ---------------------------------------------------------------------------
// Movement
// ---------------------------------------------------------------------------

/** Default movement speed slider value (0-100). Higher = faster.
 *  At 56: run≈350ms, walk≈490ms — matches original Helbreath feel. */
export const DEFAULT_MOVEMENT_SPEED = 56;

/** Minimum / maximum duration (ms) for a single tile movement (run speed). */
export const MOVEMENT_MIN_DURATION_MS = 150;
export const MOVEMENT_MAX_DURATION_MS = 600;

/** Minimum / maximum animation frame rate. */
export const MOVEMENT_MIN_FPS = 5;
export const MOVEMENT_MAX_FPS = 30;

/** Default idle animation frame rate. */
export const IDLE_ANIMATION_FPS = 10;

/** Walk mode multiplier – walk duration is this many times the run duration.
 *  Original Helbreath: walk=490ms, run=350ms → ratio ~1.4 */
export const WALK_DURATION_MULTIPLIER = 1.4;

/** Delay (ms) between mouse-held movement commands. */
export const MOVEMENT_COMMAND_THROTTLE_MS = 100;

// ---------------------------------------------------------------------------
// Combat
// ---------------------------------------------------------------------------

/** Minimum delay between attacks (ms). */
export const ATTACK_COOLDOWN_MS = 800;

/** Default melee attack range in tiles (Chebyshev distance). */
export const DEFAULT_ATTACK_RANGE = 2;

// ---------------------------------------------------------------------------
// Knockback & Stunlock
// ---------------------------------------------------------------------------

/** Duration of the knockback visual interpolation (ms). */
export const KNOCKBACK_DURATION_MS = 300;

/** Duration the player/entity is stunlocked after taking damage (ms). */
export const PLAYER_STUNLOCK_DURATION_MS = 100;

/** Duration monsters are stunlocked after taking damage (ms). */
export const MONSTER_STUNLOCK_DURATION_MS = 500;

// ---------------------------------------------------------------------------
// Spatial Audio
// ---------------------------------------------------------------------------

/** Maximum distance (in tiles) at which spatial sounds are still audible. */
export const MAX_SPATIAL_AUDIO_DISTANCE = 20;

// ---------------------------------------------------------------------------
// Health Bars
// ---------------------------------------------------------------------------

export const PLAYER_HEALTH_BAR_WIDTH = 30;
export const PLAYER_HEALTH_BAR_HEIGHT = 3;

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

/** Maximum particles for weather effects. */
export const WEATHER_MAX_PARTICLES = 200;

// ---------------------------------------------------------------------------
// Debug
// ---------------------------------------------------------------------------

/** Sprites that should render a shadow beneath them (tree indices). */
export const SPRITES_WITH_SHADOWS = ['map-tile-223'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the movement duration (ms) for one tile given a speed slider value.
 * speed=0 → MAX_DURATION, speed=100 → MIN_DURATION.
 */
export function movementDurationFromSpeed(speed: number): number {
  const clamped = Math.max(0, Math.min(100, speed));
  return MOVEMENT_MAX_DURATION_MS - (clamped / 100) * (MOVEMENT_MAX_DURATION_MS - MOVEMENT_MIN_DURATION_MS);
}

/**
 * Calculates the animation frame rate for a given speed slider value.
 * speed=0 → MIN_FPS, speed=100 → MAX_FPS.
 */
export function animationFpsFromSpeed(speed: number): number {
  const clamped = Math.max(0, Math.min(100, speed));
  return MOVEMENT_MIN_FPS + (clamped / 100) * (MOVEMENT_MAX_FPS - MOVEMENT_MIN_FPS);
}
