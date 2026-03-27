import type { Scene } from 'phaser';
import { HIGH_DEPTH } from '../../Config';

export interface FloatingTextConfig {
    x: number;
    y: number;
    text: string;
    color?: string;
    fontSize?: string;
    fontStyle?: string;
    duration?: number;
    floatDistance?: number;
}

/**
 * A floating text that drifts upward and fades out.
 * Used for damage numbers, healing, experience gain, etc.
 */
export class FloatingText {
    private textObj: Phaser.GameObjects.Text;

    constructor(scene: Scene, config: FloatingTextConfig) {
        const {
            x, y, text,
            color = '#ffffff',
            fontSize = '12px',
            fontStyle = 'normal',
            duration = 1000,
            floatDistance = 30,
        } = config;

        this.textObj = scene.add.text(x, y, text, {
            fontSize,
            color,
            fontStyle,
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5, 1).setDepth(HIGH_DEPTH + 1000);

        scene.tweens.add({
            targets: this.textObj,
            y: y - floatDistance,
            alpha: 0,
            duration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.textObj.destroy();
            },
        });
    }
}

/**
 * Convenience function to show a damage number above a target.
 */
export function showDamageNumber(
    scene: Scene,
    x: number,
    y: number,
    damage: number,
    options?: { miss?: boolean; critical?: boolean },
): void {
    const miss = options?.miss ?? false;
    const critical = options?.critical ?? false;

    const text = miss ? 'MISS' : (critical ? `${damage}!` : `${damage}`);
    const color = miss ? '#aaaaaa' : (critical ? '#ff4444' : '#ffffff');
    const fontSize = critical ? '14px' : '12px';
    const fontStyle = critical ? 'bold' : 'normal';

    new FloatingText(scene, { x, y, text, color, fontSize, fontStyle });
}

/**
 * Shows a healing number (green, floats up).
 */
export function showHealNumber(scene: Scene, x: number, y: number, amount: number): void {
    new FloatingText(scene, {
        x, y,
        text: `+${amount}`,
        color: '#44ff44',
        fontSize: '13px',
        fontStyle: 'bold',
    });
}

/**
 * Shows an experience gain number (gold, floats up).
 */
export function showExpGain(scene: Scene, x: number, y: number, amount: number): void {
    new FloatingText(scene, {
        x, y,
        text: `+${amount} XP`,
        color: '#FFD700',
        fontSize: '11px',
    });
}
