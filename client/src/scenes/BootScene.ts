import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // TODO: Load sprite atlases, map tile sheets, UI elements
    // For now, we'll use placeholder graphics
  }

  create(): void {
    this.scene.start('LoginScene');
  }
}
