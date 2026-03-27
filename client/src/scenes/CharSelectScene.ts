import Phaser from 'phaser';
import { MessageHandler, CharacterSummary, EnterGameResponse } from '../network/MessageHandler';
import * as Proto from '../network/Protocol';

export class CharSelectScene extends Phaser.Scene {
  private msgHandler!: MessageHandler;

  constructor() {
    super({ key: 'CharSelectScene' });
  }

  create(): void {
    this.msgHandler = this.registry.get('msgHandler') as MessageHandler;
    const characters = (this.registry.get('characters') || []) as CharacterSummary[];

    const centerX = this.cameras.main.width / 2;

    this.add.text(centerX, 30, 'Select Character', {
      fontSize: '24px', color: '#FFD700',
    }).setOrigin(0.5);

    // Display character slots (max 4)
    for (let i = 0; i < 4; i++) {
      const y = 100 + i * 80;
      const char = characters[i];

      if (char) {
        const label = `${char.name}  Lv.${char.level}  ${['Neutral', 'Aresden', 'Elvine'][char.side || 0]}`;
        const btn = this.add.text(centerX, y, label, {
          fontSize: '16px', color: '#fff', backgroundColor: '#333',
          padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
          this.enterGame(char.id);
        });

        btn.on('pointerover', () => btn.setStyle({ color: '#FFD700' }));
        btn.on('pointerout', () => btn.setStyle({ color: '#fff' }));
      } else {
        const btn = this.add.text(centerX, y, '[ Empty Slot ]', {
          fontSize: '16px', color: '#666', backgroundColor: '#222',
          padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
          this.scene.start('CharCreateScene');
        });
      }
    }

    // Create new character button
    if (characters.length < 4) {
      this.add.text(centerX, 430, 'Create New Character', {
        fontSize: '14px', color: '#4CAF50', backgroundColor: '#222',
        padding: { x: 15, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.start('CharCreateScene'));
    }

    // Handle enter game response
    this.msgHandler.on(Proto.MSG_ENTER_GAME_RESPONSE, (resp: EnterGameResponse) => {
      this.registry.set('enterGameData', resp);
      this.scene.start('GameScene');
    });
  }

  private enterGame(characterId: number): void {
    this.msgHandler.sendMessage(Proto.MSG_ENTER_GAME_REQUEST, {
      characterId,
    });
  }
}
