import type { Scene } from 'phaser';
import { WEATHER_MAX_PARTICLES } from '../../Config';
import type { SoundManager } from '../../audio/SoundManager';
import { RAIN_SOUND } from '../../audio/SoundFileNames';

export type WeatherType = 'clear' | 'rain' | 'snow';
export type WeatherIntensity = 'light' | 'medium' | 'heavy';

/**
 * Manages weather visual effects (rain/snow particles) and ambient sounds.
 */
export class WeatherManager {
    private scene: Scene;
    private soundManager: SoundManager | null;
    private currentWeather: WeatherType = 'clear';
    private currentIntensity: WeatherIntensity = 'medium';
    private rainEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
    private snowEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
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
            case 'clear':
            default:
                break;
        }
    }

    /**
     * Called every frame. Currently a no-op since Phaser manages particle updates.
     */
    update(_delta: number): void {
        // Phaser particles auto-update; nothing needed here for now
    }

    /**
     * Destroys all weather effects and sounds.
     */
    destroy(): void {
        this.clearWeather();
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
        this.stopRainSound();
        this.currentWeather = 'clear';
    }

    private startRain(maxParticles: number): void {
        // Create a tiny white rectangle texture for rain drops
        const gfx = this.scene.add.graphics();
        gfx.fillStyle(0xaaccff, 0.6);
        gfx.fillRect(0, 0, 2, 8);
        gfx.generateTexture('rain-particle', 2, 8);
        gfx.destroy();

        this.rainEmitter = this.scene.add.particles(0, 0, 'rain-particle', {
            x: { min: -100, max: this.scene.cameras.main.width + 100 },
            y: -20,
            lifespan: 800,
            speedY: { min: 300, max: 500 },
            speedX: { min: -50, max: -30 },
            quantity: Math.ceil(maxParticles / 40),
            alpha: { start: 0.6, end: 0.1 },
            scaleY: { min: 0.8, max: 1.2 },
            blendMode: 'ADD',
        });

        this.rainEmitter.setScrollFactor(0);
        this.rainEmitter.setDepth(999990);
    }

    private startSnow(maxParticles: number): void {
        // Create a tiny white circle texture for snowflakes
        const gfx = this.scene.add.graphics();
        gfx.fillStyle(0xffffff, 0.8);
        gfx.fillCircle(2, 2, 2);
        gfx.generateTexture('snow-particle', 4, 4);
        gfx.destroy();

        this.snowEmitter = this.scene.add.particles(0, 0, 'snow-particle', {
            x: { min: -100, max: this.scene.cameras.main.width + 100 },
            y: -20,
            lifespan: 3000,
            speedY: { min: 30, max: 80 },
            speedX: { min: -20, max: 20 },
            quantity: Math.ceil(maxParticles / 80),
            alpha: { start: 0.8, end: 0.2 },
            scale: { min: 0.5, max: 1.5 },
        });

        this.snowEmitter.setScrollFactor(0);
        this.snowEmitter.setDepth(999990);
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
