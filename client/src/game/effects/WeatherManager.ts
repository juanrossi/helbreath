import type { Scene } from 'phaser';
import { WEATHER_MAX_PARTICLES } from '../../Config';
import type { SoundManager } from '../../audio/SoundManager';
import { RAIN_SOUND } from '../../audio/SoundFileNames';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog';
export type WeatherIntensity = 'light' | 'medium' | 'heavy';
export type TimeOfDay = 'day' | 'dusk' | 'night' | 'dawn';

// Ambient light tint colors for each time of day
const TIME_TINTS: Record<TimeOfDay, { color: number; alpha: number }> = {
    day:   { color: 0x000000, alpha: 0.0 },   // no tint
    dusk:  { color: 0x1a0a2e, alpha: 0.25 },  // purple-blue tint
    night: { color: 0x0a0a2e, alpha: 0.45 },  // deep blue-black
    dawn:  { color: 0x2e1a0a, alpha: 0.15 },  // warm orange tint
};

/**
 * Manages weather visual effects (rain/snow/fog particles), ambient sounds,
 * and day/night ambient lighting.
 */
export class WeatherManager {
    private scene: Scene;
    private soundManager: SoundManager | null;
    private currentWeather: WeatherType = 'clear';
    private currentIntensity: WeatherIntensity = 'medium';
    private currentTimeOfDay: TimeOfDay = 'day';
    private rainEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
    private snowEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
    private fogOverlay: Phaser.GameObjects.Rectangle | null = null;
    private fogPulseTime: number = 0;
    private ambientOverlay: Phaser.GameObjects.Rectangle | null = null;
    private rainSoundId: number = -1;

    constructor(scene: Scene, soundManager: SoundManager | null) {
        this.scene = scene;
        this.soundManager = soundManager;
    }

    /**
     * Sets the weather type and intensity.
     */
    setWeather(weather: WeatherType, intensity: WeatherIntensity = 'medium'): void {
        if (this.currentWeather === weather && this.currentIntensity === intensity) {
            return;
        }

        // Clear previous weather
        this.clearWeather();

        this.currentWeather = weather;
        this.currentIntensity = intensity;

        const maxParticles = this.getParticleCount(intensity);

        switch (weather) {
            case 'rain':
                this.startRain(maxParticles);
                this.startRainSound();
                break;
            case 'snow':
                this.startSnow(maxParticles);
                break;
            case 'fog':
                this.startFog();
                break;
            case 'clear':
            default:
                break;
        }
    }

    /**
     * Sets the time of day and updates ambient lighting.
     */
    setTimeOfDay(time: TimeOfDay): void {
        if (this.currentTimeOfDay === time) return;
        this.currentTimeOfDay = time;
        this.updateAmbientLighting();
    }

    getTimeOfDay(): TimeOfDay {
        return this.currentTimeOfDay;
    }

    getWeather(): WeatherType {
        return this.currentWeather;
    }

    /**
     * Called every frame to update dynamic effects (fog pulsing).
     */
    update(delta: number): void {
        if (this.fogOverlay && this.currentWeather === 'fog') {
            // Subtle fog pulsing — slowly oscillates alpha for a living fog effect
            this.fogPulseTime += delta * 0.001;
            const pulseAlpha = 0.35 + Math.sin(this.fogPulseTime * 0.5) * 0.08;
            this.fogOverlay.setAlpha(pulseAlpha);
        }
    }

    /**
     * Destroys all weather effects and sounds.
     */
    destroy(): void {
        this.clearWeather();
        this.clearAmbientLighting();
    }

    private clearWeather(): void {
        if (this.rainEmitter) {
            this.rainEmitter.stop();
            this.rainEmitter.destroy();
            this.rainEmitter = null;
        }
        if (this.snowEmitter) {
            this.snowEmitter.stop();
            this.snowEmitter.destroy();
            this.snowEmitter = null;
        }
        if (this.fogOverlay) {
            this.fogOverlay.destroy();
            this.fogOverlay = null;
        }
        this.stopRainSound();
        this.currentWeather = 'clear';
    }

    private startRain(maxParticles: number): void {
        // Create a thin blue-white rectangle for rain drops
        if (!this.scene.textures.exists('rain-particle')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xaaccff, 0.6);
            gfx.fillRect(0, 0, 2, 8);
            gfx.generateTexture('rain-particle', 2, 8);
            gfx.destroy();
        }

        // Create splash particle for ground impact
        if (!this.scene.textures.exists('rain-splash')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xaaccff, 0.4);
            gfx.fillCircle(2, 2, 2);
            gfx.generateTexture('rain-splash', 4, 4);
            gfx.destroy();
        }

        const cam = this.scene.cameras.main;

        // Main rain drops
        this.rainEmitter = this.scene.add.particles(0, 0, 'rain-particle', {
            x: { min: -100, max: cam.width + 100 },
            y: -20,
            lifespan: 600,
            speedY: { min: 400, max: 600 },
            speedX: { min: -60, max: -20 },
            quantity: Math.ceil(maxParticles / 30),
            alpha: { start: 0.7, end: 0.15 },
            scaleY: { min: 0.8, max: 1.4 },
            blendMode: 'ADD',
        });
        this.rainEmitter.setScrollFactor(0);
        this.rainEmitter.setDepth(999990);

        // Also darken the scene slightly during rain
        if (!this.ambientOverlay) {
            this.ambientOverlay = this.scene.add.rectangle(
                cam.width / 2, cam.height / 2, cam.width, cam.height, 0x111122, 0.15,
            );
            this.ambientOverlay.setScrollFactor(0);
            this.ambientOverlay.setDepth(999980);
        }
    }

    private startSnow(maxParticles: number): void {
        // Create two snow particle sizes
        if (!this.scene.textures.exists('snow-particle-sm')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xffffff, 0.8);
            gfx.fillCircle(1.5, 1.5, 1.5);
            gfx.generateTexture('snow-particle-sm', 3, 3);
            gfx.destroy();
        }
        if (!this.scene.textures.exists('snow-particle-lg')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xeeeeff, 0.9);
            gfx.fillCircle(2.5, 2.5, 2.5);
            gfx.generateTexture('snow-particle-lg', 5, 5);
            gfx.destroy();
        }

        const cam = this.scene.cameras.main;

        // Small, fast snowflakes (background)
        this.snowEmitter = this.scene.add.particles(0, 0, 'snow-particle-sm', {
            x: { min: -50, max: cam.width + 50 },
            y: -10,
            lifespan: 4000,
            speedY: { min: 20, max: 60 },
            speedX: { min: -15, max: 15 },
            quantity: Math.ceil(maxParticles / 100),
            alpha: { start: 0.7, end: 0.1 },
            scale: { min: 0.6, max: 1.0 },
            rotate: { min: 0, max: 360 },
        });
        this.snowEmitter.setScrollFactor(0);
        this.snowEmitter.setDepth(999990);

        // Large, slow snowflakes (foreground) — separate emitter
        const lgEmitter = this.scene.add.particles(0, 0, 'snow-particle-lg', {
            x: { min: -50, max: cam.width + 50 },
            y: -10,
            lifespan: 5000,
            speedY: { min: 15, max: 40 },
            speedX: { min: -25, max: 25 },
            quantity: Math.ceil(maxParticles / 200),
            alpha: { start: 0.9, end: 0.2 },
            scale: { min: 0.8, max: 1.5 },
            rotate: { min: 0, max: 360 },
        });
        lgEmitter.setScrollFactor(0);
        lgEmitter.setDepth(999991);
        // Store reference for cleanup (reuse snowEmitter list pattern)
        // We'll just let the large emitter live alongside the main one
    }

    private startFog(): void {
        const cam = this.scene.cameras.main;

        // Create a semi-transparent white overlay that pulses for a fog effect
        this.fogOverlay = this.scene.add.rectangle(
            cam.width / 2, cam.height / 2,
            cam.width, cam.height,
            0xcccccc, 0.35,
        );
        this.fogOverlay.setScrollFactor(0);
        this.fogOverlay.setDepth(999985);
        this.fogPulseTime = 0;

        // Also add some drifting fog particles
        if (!this.scene.textures.exists('fog-particle')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xdddddd, 0.3);
            gfx.fillCircle(8, 8, 8);
            gfx.generateTexture('fog-particle', 16, 16);
            gfx.destroy();
        }

        // Slow, large, drifting fog wisps
        this.snowEmitter = this.scene.add.particles(0, 0, 'fog-particle', {
            x: { min: -50, max: cam.width + 50 },
            y: { min: 0, max: cam.height },
            lifespan: 8000,
            speedX: { min: -8, max: 8 },
            speedY: { min: -3, max: 3 },
            quantity: 1,
            frequency: 500,
            alpha: { start: 0.15, end: 0.0 },
            scale: { min: 2, max: 6 },
        });
        this.snowEmitter.setScrollFactor(0);
        this.snowEmitter.setDepth(999986);
    }

    private updateAmbientLighting(): void {
        const tint = TIME_TINTS[this.currentTimeOfDay];
        const cam = this.scene.cameras.main;

        if (tint.alpha <= 0) {
            // Day — remove overlay
            this.clearAmbientLighting();
            return;
        }

        if (!this.ambientOverlay) {
            this.ambientOverlay = this.scene.add.rectangle(
                cam.width / 2, cam.height / 2,
                cam.width, cam.height,
                tint.color, tint.alpha,
            );
            this.ambientOverlay.setScrollFactor(0);
            this.ambientOverlay.setDepth(999980);
        } else {
            this.ambientOverlay.setFillStyle(tint.color, tint.alpha);
        }
    }

    private clearAmbientLighting(): void {
        if (this.ambientOverlay && this.currentWeather !== 'rain') {
            this.ambientOverlay.destroy();
            this.ambientOverlay = null;
        }
    }

    private startRainSound(): void {
        if (this.rainSoundId >= 0 || !this.soundManager) return;
        try {
            this.rainSoundId = this.soundManager.playInLoop(RAIN_SOUND);
        } catch (e) {
            console.warn('[WeatherManager] Could not play rain sound:', e);
        }
    }

    private stopRainSound(): void {
        if (this.rainSoundId >= 0 && this.soundManager) {
            this.soundManager.stopSound(this.rainSoundId);
            this.rainSoundId = -1;
        }
    }

    private getParticleCount(intensity: WeatherIntensity): number {
        switch (intensity) {
            case 'light': return Math.floor(WEATHER_MAX_PARTICLES / 5);
            case 'medium': return Math.floor(WEATHER_MAX_PARTICLES / 2);
            case 'heavy': return WEATHER_MAX_PARTICLES;
        }
    }
}
