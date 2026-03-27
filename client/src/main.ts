import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LoginScene } from './scenes/LoginScene';
import { CharSelectScene } from './scenes/CharSelectScene';
import { CharCreateScene } from './scenes/CharCreateScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  pixelArt: true,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, LoginScene, CharSelectScene, CharCreateScene, GameScene],
};

const game = new Phaser.Game(config);
(window as any).__PHASER_GAME__ = game;
