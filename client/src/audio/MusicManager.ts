import type { Scene } from 'phaser';

/**
 * Manages background music playback with map-based auto-switching.
 * Only one music track plays at a time; switching maps automatically
 * transitions to the appropriate track.
 */
export class MusicManager {
    private scene: Scene;
    private currentMusicKey: string | null = null;
    private currentMusic: Phaser.Sound.BaseSound | null = null;
    private volume: number = 50; // 0-100

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Plays a music track by key. Skips restart if the same track is already playing.
     * Stops the previous track before starting the new one.
     *
     * @param key - Phaser audio cache key (e.g. "music-aresden")
     */
    playMusic(key: string): void {
        // Skip if same music is already playing
        if (this.currentMusicKey === key && this.currentMusic) {
            return;
        }

        // Stop current music
        this.stop();

        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`[MusicManager] Music key "${key}" not found in cache`);
            return;
        }

        try {
            this.currentMusic = this.scene.sound.add(key, {
                loop: true,
                volume: this.volume / 100,
            });
            this.currentMusic.play();
            this.currentMusicKey = key;
        } catch (e) {
            console.warn(`[MusicManager] Could not play music "${key}":`, e);
        }
    }

    /**
     * Plays the music associated with the given map name.
     * Uses the music mapping from Assets.ts (mapName -> music key).
     *
     * @param mapMusicKey - The music key from the map asset data (e.g. "aresden", "dungeon")
     */
    playMapMusic(mapMusicKey: string): void {
        if (!mapMusicKey) return;
        this.playMusic(`music-${mapMusicKey}`);
    }

    /**
     * Stops the currently playing music.
     */
    stop(): void {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.destroy();
            this.currentMusic = null;
            this.currentMusicKey = null;
        }
    }

    /**
     * Sets the music volume (0-100). Applied immediately.
     */
    setVolume(vol: number): void {
        this.volume = Math.max(0, Math.min(100, vol));
        if (this.currentMusic && 'setVolume' in this.currentMusic) {
            (this.currentMusic as any).setVolume(this.volume / 100);
        }
    }

    /** Gets the current volume (0-100). */
    getVolume(): number {
        return this.volume;
    }

    /** Gets the key of the currently playing track, or null. */
    getCurrentTrack(): string | null {
        return this.currentMusicKey;
    }

    /**
     * Destroys the manager and stops all music.
     */
    destroy(): void {
        this.stop();
    }
}
