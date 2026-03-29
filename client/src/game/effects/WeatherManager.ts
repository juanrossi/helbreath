import type { Scene } from 'phaser';
import { WEATHER_MAX_PARTICLES } from '../../Config';
import type { SoundManager } from '../../audio/SoundManager';
import { RAIN_SOUND } from '../../audio/SoundFileNames';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog';
export type WeatherIntensity = 'light' | 'medium' | 'heavy';
export type TimeOfDay = 'day' | 'dusk' | 'night' | 'dawn';

const TIME_TINTS: Record<TimeOfDay, { color: number; alpha: number }> = {
    day:   { color: 0x000000, alpha: 0.0 },
    dusk:  { color: 0x1a0a2e, alpha: 0.25 },
    night: { color: 0x0a0a2e, alpha: 0.45 },
    dawn:  { color: 0x2e1a0a, alpha: 0.15 },
};

export class WeatherManager {
    private scene: Scene;
    private soundManager: SoundManager | null;
    private currentWeather: WeatherType = 'clear';
    private currentIntensity: WeatherIntensity = 'medium';
    private currentTimeOfDay: TimeOfDay = 'day';

    // Track ALL created game objects so clearWeather destroys everything
    private weatherObjects: Phaser.GameObjects.GameObject[] = [];
    private fogOverlay: Phaser.GameObjects.Rectangle | null = null;
    private fogPulseTime: number = 0;
    private ambientOverlay: Phaser.GameObjects.Rectangle | null = null;
    private rainSoundId: number = -1;

    constructor(scene: Scene, soundManager: SoundManager | null) {
        this.scene = scene;
        this.soundManager = soundManager;
    }

    setWeather(weather: WeatherType, intensity: WeatherIntensity = 'medium'): void {
        // Always clear first, even if setting the same weather
        this.clearWeather();

        this.currentWeather = weather;
        this.currentIntensity = intensity;

        if (weather === 'clear') return;

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
        }
    }

    setTimeOfDay(time: TimeOfDay): void {
        if (this.currentTimeOfDay === time) return;
        this.currentTimeOfDay = time;
        this.updateAmbientLighting();
    }

    getTimeOfDay(): TimeOfDay { return this.currentTimeOfDay; }
    getWeather(): WeatherType { return this.currentWeather; }

    update(delta: number): void {
        if (this.fogOverlay && this.currentWeather === 'fog') {
            this.fogPulseTime += delta * 0.001;
            this.fogOverlay.setAlpha(0.35 + Math.sin(this.fogPulseTime * 0.5) * 0.08);
        }
    }

    destroy(): void {
        this.clearWeather();
        this.clearAmbientLighting();
    }

    private clearWeather(): void {
        // Destroy ALL weather game objects
        for (const obj of this.weatherObjects) {
            try { obj.destroy(); } catch { /* already destroyed */ }
        }
        this.weatherObjects = [];
        this.fogOverlay = null;
        this.stopRainSound();
        this.currentWeather = 'clear';
    }

    private track<T extends Phaser.GameObjects.GameObject>(obj: T): T {
        this.weatherObjects.push(obj);
        return obj;
    }

    private startRain(maxParticles: number): void {
        if (!this.scene.textures.exists('rain-particle')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xaaccff, 0.6);
            gfx.fillRect(0, 0, 2, 8);
            gfx.generateTexture('rain-particle', 2, 8);
            gfx.destroy();
        }

        const cam = this.scene.cameras.main;

        const emitter = this.track(this.scene.add.particles(0, 0, 'rain-particle', {
            x: { min: -100, max: cam.width + 100 },
            y: -20,
            lifespan: 600,
            speedY: { min: 400, max: 600 },
            speedX: { min: -60, max: -20 },
            quantity: Math.ceil(maxParticles / 30),
            alpha: { start: 0.7, end: 0.15 },
            scaleY: { min: 0.8, max: 1.4 },
            blendMode: 'ADD',
        }));
        emitter.setScrollFactor(0);
        emitter.setDepth(999990);

        // Slight darkening during rain
        const overlay = this.track(this.scene.add.rectangle(
            cam.width / 2, cam.height / 2, cam.width, cam.height, 0x111122, 0.15,
        ));
        overlay.setScrollFactor(0);
        overlay.setDepth(999980);
    }

    private startSnow(maxParticles: number): void {
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

        // Small fast snowflakes
        const smEmitter = this.track(this.scene.add.particles(0, 0, 'snow-particle-sm', {
            x: { min: -50, max: cam.width + 50 },
            y: -10,
            lifespan: 4000,
            speedY: { min: 20, max: 60 },
            speedX: { min: -15, max: 15 },
            quantity: Math.ceil(maxParticles / 100),
            alpha: { start: 0.7, end: 0.1 },
            scale: { min: 0.6, max: 1.0 },
            rotate: { min: 0, max: 360 },
        }));
        smEmitter.setScrollFactor(0);
        smEmitter.setDepth(999990);

        // Large slow snowflakes
        const lgEmitter = this.track(this.scene.add.particles(0, 0, 'snow-particle-lg', {
            x: { min: -50, max: cam.width + 50 },
            y: -10,
            lifespan: 5000,
            speedY: { min: 15, max: 40 },
            speedX: { min: -25, max: 25 },
            quantity: Math.ceil(maxParticles / 200),
            alpha: { start: 0.9, end: 0.2 },
            scale: { min: 0.8, max: 1.5 },
            rotate: { min: 0, max: 360 },
        }));
        lgEmitter.setScrollFactor(0);
        lgEmitter.setDepth(999991);
    }

    private startFog(): void {
        const cam = this.scene.cameras.main;

        this.fogOverlay = this.track(this.scene.add.rectangle(
            cam.width / 2, cam.height / 2, cam.width, cam.height, 0xcccccc, 0.35,
        )) as Phaser.GameObjects.Rectangle;
        this.fogOverlay.setScrollFactor(0);
        this.fogOverlay.setDepth(999985);
        this.fogPulseTime = 0;

        if (!this.scene.textures.exists('fog-particle')) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(0xdddddd, 0.3);
            gfx.fillCircle(8, 8, 8);
            gfx.generateTexture('fog-particle', 16, 16);
            gfx.destroy();
        }

        const fogWisps = this.track(this.scene.add.particles(0, 0, 'fog-particle', {
            x: { min: -50, max: cam.width + 50 },
            y: { min: 0, max: cam.height },
            lifespan: 8000,
            speedX: { min: -8, max: 8 },
            speedY: { min: -3, max: 3 },
            quantity: 1,
            frequency: 500,
            alpha: { start: 0.15, end: 0.0 },
            scale: { min: 2, max: 6 },
        }));
        fogWisps.setScrollFactor(0);
        fogWisps.setDepth(999986);
    }

    private updateAmbientLighting(): void {
        const tint = TIME_TINTS[this.currentTimeOfDay];
        const cam = this.scene.cameras.main;

        if (tint.alpha <= 0) {
            this.clearAmbientLighting();
            return;
        }

        if (!this.ambientOverlay) {
            this.ambientOverlay = this.scene.add.rectangle(
                cam.width / 2, cam.height / 2, cam.width, cam.height, tint.color, tint.alpha,
            );
            this.ambientOverlay.setScrollFactor(0);
            this.ambientOverlay.setDepth(999980);
        } else {
            this.ambientOverlay.setFillStyle(tint.color, tint.alpha);
        }
    }

    private clearAmbientLighting(): void {
        if (this.ambientOverlay) {
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
