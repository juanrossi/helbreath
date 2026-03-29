import Phaser from 'phaser';
import { HBSpriteFile, SpriteType } from '../game/assets/HBSprite';
import { getAssets, AssetType, type AssetData } from '../constants/Assets';
import { ASSET_BASE } from '../env';

/**
 * BootScene: Loads all game assets (SPR sprite files, AMD maps, music, sounds)
 * and displays a progress bar. Transitions to CharSelectScene when complete.
 */
export class BootScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Progress bar UI
    const { width, height } = this.cameras.main;
    const barWidth = 400;
    const barHeight = 30;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;

    // Background bar
    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x222222, 1);
    bgBar.fillRect(barX, barY, barWidth, barHeight);

    this.progressBar = this.add.graphics();
    this.progressText = this.add.text(width / 2, barY + barHeight + 20, '0%', {
      fontSize: '16px', color: '#ffffff',
    }).setOrigin(0.5);
    this.statusText = this.add.text(width / 2, barY - 20, 'Loading assets...', {
      fontSize: '14px', color: '#aaaaaa',
    }).setOrigin(0.5);

    this.add.text(width / 2, barY - 60, 'Helbreath Online', {
      fontSize: '24px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Load progress callback
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x3498db, 1);
      this.progressBar.fillRect(barX, barY, barWidth * value, barHeight);
      this.progressText.setText(`${Math.round(value * 100)}%`);
    });

    // Queue all assets for loading
    const allAssets = getAssets();

    // Load SPR files as binary (ArrayBuffer)
    const spriteAssets = allAssets.filter(
      a => a.assetType === AssetType.SPRITE || a.assetType === AssetType.TILE_SPRITE
    );
    for (const asset of spriteAssets) {
      this.load.binary(asset.key, `${ASSET_BASE}/assets/sprites/${asset.fileName}`);
    }

    // Load AMD map files as binary — only preload starter maps, rest loaded on-demand
    const mapAssets = allAssets.filter(a => a.assetType === AssetType.MAP && a.preload);
    for (const asset of mapAssets) {
      this.load.binary(asset.fileName, `${ASSET_BASE}/assets/maps/${asset.fileName}`);
    }

    // Load music files
    const musicAssets = allAssets.filter(a => a.assetType === AssetType.MUSIC);
    for (const asset of musicAssets) {
      this.load.audio(asset.key, `${ASSET_BASE}/assets/music/${asset.fileName}`);
    }

    // Load sound files
    const soundAssets = allAssets.filter(a => a.assetType === AssetType.SOUND);
    for (const asset of soundAssets) {
      this.load.audio(asset.key, `${ASSET_BASE}/assets/sounds/${asset.fileName}`);
    }

    // Load item-ground sprite atlases (pre-packed PNG + JSON)
    this.load.atlas('item-ground', `${ASSET_BASE}/assets/spritesheets/item-ground.png`, `${ASSET_BASE}/assets/spritesheets/item-ground.json`);
    this.load.atlas('item2-ground', `${ASSET_BASE}/assets/spritesheets/item2-ground.png`, `${ASSET_BASE}/assets/spritesheets/item2-ground.json`);
  }

  async create(): Promise<void> {
    this.statusText.setText('Processing sprites...');
    this.progressText.setText('');

    const allAssets = getAssets();
    const spriteAssets = allAssets.filter(
      a => a.assetType === AssetType.SPRITE || a.assetType === AssetType.TILE_SPRITE
    );

    // Process SPR files: parse binary, create textures and animations
    let processed = 0;
    for (const asset of spriteAssets) {
      const buffer = this.cache.binary.get(asset.key) as ArrayBuffer | undefined;
      if (!buffer) {
        console.warn(`Missing binary for sprite: ${asset.key}`);
        continue;
      }

      try {
        const spriteFile = new HBSpriteFile(
          asset.fileName.replace('.spr', ''),
          asset.spriteType ?? SpriteType.Tiles,
          asset.tileStartIndex,
        );
        await spriteFile.load(this, buffer);
      } catch (err) {
        console.warn(`Failed to load sprite ${asset.key}:`, err);
      }

      // Remove raw binary from cache to free memory
      this.cache.binary.remove(asset.key);

      processed++;
      const pct = Math.round((processed / spriteAssets.length) * 100);
      this.statusText.setText(`Processing sprites... ${processed}/${spriteAssets.length}`);
      this.progressBar.clear();
      this.progressBar.fillStyle(0x2ecc71, 1);
      this.progressBar.fillRect(
        (this.cameras.main.width - 400) / 2,
        this.cameras.main.height / 2,
        400 * (processed / spriteAssets.length),
        30,
      );

      // Yield to browser every 5 sprites to keep UI responsive
      if (processed % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    console.log(`All sprites processed: ${processed}/${spriteAssets.length}`);
    this.statusText.setText('Ready!');

    // Short delay so user can see "Ready!" text
    await new Promise(resolve => setTimeout(resolve, 300));

    this.scene.start('CharSelectScene');
  }
}
