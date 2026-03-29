import { authenticateUser, type AuthResult } from './login';

async function main() {
  // Step 1: Authenticate via HTTP FIRST (no Phaser, no asset loading)
  const auth: AuthResult = await authenticateUser();

  // Step 2: Store auth data globally for scenes to access
  (window as any).__hb_auth = auth;

  // Step 3: NOW initialize Phaser (triggers asset loading via BootScene)
  const Phaser = (await import('phaser')).default;
  const { BootScene } = await import('./scenes/BootScene');
  const { CharSelectScene } = await import('./scenes/CharSelectScene');
  const { CharCreateScene } = await import('./scenes/CharCreateScene');
  const { GameScene } = await import('./scenes/GameScene');

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
    scene: [BootScene, CharSelectScene, CharCreateScene, GameScene],
  };

  const game = new Phaser.Game(config);
  (window as any).__PHASER_GAME__ = game;

  // Store auth in registry once the game is ready
  game.events.once('ready', () => {
    game.registry.set('authToken', auth.token);
    game.registry.set('characters', auth.characters);
  });
}

main();
