import type { Scene } from 'phaser';
import { MAX_SPATIAL_AUDIO_DISTANCE } from '../Config';

/**
 * Spatial audio configuration for positional sounds.
 */
export interface SpatialAudioConfig {
    /** Stereo pan from -1 (left) to 1 (right). */
    pan: number;
    /** Volume multiplier from 0 (silent) to 1 (full) based on distance. */
    distanceVolume: number;
}

let nextSoundId = 1;

/**
 * Manages sound effect playback with support for looping, one-shot, spatial audio,
 * and animation-synced playback rate.
 */
export class SoundManager {
    private scene: Scene;
    private volume: number = 80; // 0-100
    private sounds: Map<number, Phaser.Sound.BaseSound> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Plays a sound in a loop. Returns a unique sound ID for later stopping.
     *
     * @param key - Phaser audio cache key
     * @param animationDurationMs - If provided, adjusts playback rate to match animation duration
     * @param spatial - Optional spatial audio config
     * @returns Sound ID, or -1 if sound could not be played
     */
    playInLoop(key: string, animationDurationMs?: number, spatial?: SpatialAudioConfig): number {
        if (!this.scene.cache.audio.exists(key)) {
            return -1;
        }

        try {
            const sound = this.scene.sound.add(key, {
                loop: true,
                volume: this.computeVolume(spatial),
            });

            if (spatial && 'setPan' in sound) {
                (sound as any).setPan(spatial.pan);
            }

            if (animationDurationMs && animationDurationMs > 0 && 'setRate' in sound) {
                const baseDuration = (sound as any).duration * 1000;
                if (baseDuration > 0) {
                    (sound as any).setRate(baseDuration / animationDurationMs);
                }
            }

            sound.play();

            const id = nextSoundId++;
            this.sounds.set(id, sound);
            return id;
        } catch {
            return -1;
        }
    }

    /**
     * Plays a sound once. Returns a unique sound ID.
     *
     * @param key - Phaser audio cache key
     * @param animationDurationMs - If provided, adjusts playback rate to match animation duration
     * @param spatial - Optional spatial audio config
     * @param onComplete - Optional callback when sound finishes
     * @returns Sound ID, or -1 if sound could not be played
     */
    playOnce(key: string, animationDurationMs?: number, spatial?: SpatialAudioConfig, onComplete?: () => void): number {
        if (!this.scene.cache.audio.exists(key)) {
            return -1;
        }

        try {
            const sound = this.scene.sound.add(key, {
                loop: false,
                volume: this.computeVolume(spatial),
            });

            if (spatial && 'setPan' in sound) {
                (sound as any).setPan(spatial.pan);
            }

            if (animationDurationMs && animationDurationMs > 0 && 'setRate' in sound) {
                const baseDuration = (sound as any).duration * 1000;
                if (baseDuration > 0) {
                    (sound as any).setRate(baseDuration / animationDurationMs);
                }
            }

            sound.once('complete', () => {
                this.sounds.delete(id);
                onComplete?.();
            });

            sound.play();

            const id = nextSoundId++;
            this.sounds.set(id, sound);
            return id;
        } catch {
            return -1;
        }
    }

    /**
     * Stops a sound by its ID.
     */
    stopSound(id: number): void {
        const sound = this.sounds.get(id);
        if (sound) {
            sound.stop();
            sound.destroy();
            this.sounds.delete(id);
        }
    }

    /**
     * Sets the global sound effects volume (0-100).
     * Applies immediately to all currently playing sounds.
     */
    setVolume(vol: number): void {
        this.volume = Math.max(0, Math.min(100, vol));
        const phaserVol = this.volume / 100;
        for (const sound of this.sounds.values()) {
            if ('setVolume' in sound) {
                (sound as any).setVolume(phaserVol);
            }
        }
    }

    /** Gets the current volume (0-100). */
    getVolume(): number {
        return this.volume;
    }

    /**
     * Stops all currently playing sounds.
     */
    stopAll(): void {
        for (const [id, sound] of this.sounds) {
            sound.stop();
            sound.destroy();
            this.sounds.delete(id);
        }
    }

    /**
     * Destroys the manager and cleans up all sounds.
     */
    destroy(): void {
        this.stopAll();
    }

    /**
     * Calculates spatial audio config from source and listener world positions.
     *
     * @param sourceX - Source tile X
     * @param sourceY - Source tile Y
     * @param listenerX - Listener tile X
     * @param listenerY - Listener tile Y
     * @returns SpatialAudioConfig, or undefined if source is out of range
     */
    static computeSpatialConfig(
        sourceX: number, sourceY: number,
        listenerX: number, listenerY: number,
    ): SpatialAudioConfig | undefined {
        const dx = sourceX - listenerX;
        const dy = sourceY - listenerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > MAX_SPATIAL_AUDIO_DISTANCE) {
            return undefined;
        }

        const pan = Math.max(-1, Math.min(1, dx / MAX_SPATIAL_AUDIO_DISTANCE));
        const distanceVolume = 1 - (dist / MAX_SPATIAL_AUDIO_DISTANCE);

        return { pan, distanceVolume };
    }

    private computeVolume(spatial?: SpatialAudioConfig): number {
        const base = this.volume / 100;
        if (spatial) {
            return base * spatial.distanceVolume;
        }
        return base;
    }
}
