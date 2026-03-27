import type { SoundManager } from './SoundManager';

/**
 * Tracks sound playback per game-object state.
 * When the state changes (e.g. idle -> run), the previous loop sound
 * is stopped automatically, preventing audio leaks.
 */
export class SoundTracker {
    private soundManager: SoundManager;
    /** Maps a state key to its currently playing sound ID. */
    private activeSounds: Map<string, number> = new Map();

    constructor(soundManager: SoundManager) {
        this.soundManager = soundManager;
    }

    /**
     * Plays a looping sound for a given state.
     * If a sound for a different state is already playing, it is stopped first.
     *
     * @param stateKey - Identifier for the state (e.g. "run", "walk")
     * @param soundKey - Phaser audio cache key
     * @param animationDurationMs - Optional animation duration for rate sync
     * @returns The sound ID
     */
    playInLoop(stateKey: string, soundKey: string, animationDurationMs?: number): number {
        // Stop any existing sound for a different state
        this.stopAllExcept(stateKey);

        // If same state already has this sound playing, skip
        if (this.activeSounds.has(stateKey)) {
            return this.activeSounds.get(stateKey)!;
        }

        const id = this.soundManager.playInLoop(soundKey, animationDurationMs);
        if (id >= 0) {
            this.activeSounds.set(stateKey, id);
        }
        return id;
    }

    /**
     * Plays a one-shot sound (not tracked for state transitions).
     * Useful for attack impacts, damage sounds, etc.
     */
    playOnce(soundKey: string, animationDurationMs?: number, spatial?: any): number {
        return this.soundManager.playOnce(soundKey, animationDurationMs, spatial);
    }

    /**
     * Stops the sound associated with a specific state.
     */
    stopState(stateKey: string): void {
        const id = this.activeSounds.get(stateKey);
        if (id !== undefined) {
            this.soundManager.stopSound(id);
            this.activeSounds.delete(stateKey);
        }
    }

    /**
     * Stops all tracked sounds except for the given state key.
     */
    stopAllExcept(stateKey: string): void {
        for (const [key, id] of this.activeSounds) {
            if (key !== stateKey) {
                this.soundManager.stopSound(id);
                this.activeSounds.delete(key);
            }
        }
    }

    /**
     * Stops all tracked sounds.
     */
    stopAll(): void {
        for (const [, id] of this.activeSounds) {
            this.soundManager.stopSound(id);
        }
        this.activeSounds.clear();
    }

    /**
     * Destroys the tracker and stops all sounds.
     */
    destroy(): void {
        this.stopAll();
    }
}
