import Phaser from 'phaser';
import { WebSocketClient } from '../network/WebSocketClient';
import { MessageHandler, CharacterSummary, EnterGameResponse } from '../network/MessageHandler';
import * as Proto from '../network/Protocol';
import type { AuthResult } from '../login';
import { WS_BASE } from '../env';

export class CharSelectScene extends Phaser.Scene {
  private msgHandler!: MessageHandler;
  private characters: CharacterSummary[] = [];
  private formDiv: HTMLDivElement | null = null;

  constructor() {
    super({ key: 'CharSelectScene' });
  }

  create(): void {
    // Check if ws/msgHandler already exist in registry (returning from CharCreate/Game)
    let ws = this.registry.get('ws') as WebSocketClient | undefined;
    let msgHandler = this.registry.get('msgHandler') as MessageHandler | undefined;

    if (!ws || !msgHandler) {
      // First time: create WebSocket connection with auth token
      const token = localStorage.getItem('hb_token') || '';
      const wsUrl = `${WS_BASE}/ws?token=${encodeURIComponent(token)}`;

      ws = new WebSocketClient(wsUrl, (type, data) => {
        this.msgHandler.handleMessage(type, data);
      });
      msgHandler = new MessageHandler(ws);

      // Store references for other scenes
      this.registry.set('ws', ws);
      this.registry.set('msgHandler', msgHandler);

      ws.connect();
    }

    this.msgHandler = msgHandler;

    // Load characters from registry (set by main.ts from HTTP auth, or updated by CharCreate)
    const authData = (window as any).__hb_auth as AuthResult | undefined;
    const registryChars = this.registry.get('characters') as CharacterSummary[] | undefined;
    this.characters = registryChars || (authData?.characters as any as CharacterSummary[]) || [];

    this.renderUI();

    // Handle enter game response
    this.msgHandler.off(Proto.MSG_ENTER_GAME_RESPONSE);
    this.msgHandler.on(Proto.MSG_ENTER_GAME_RESPONSE, (resp: EnterGameResponse) => {
      this.registry.set('enterGameData', resp);
      this.cleanup();
      this.scene.start('GameScene');
    });

    // Handle create character response (in case we're receiving it after returning)
    this.msgHandler.off(Proto.MSG_CREATE_CHAR_RESPONSE);
    this.msgHandler.on(Proto.MSG_CREATE_CHAR_RESPONSE, (resp: any) => {
      if (resp.success && resp.characters) {
        this.characters = resp.characters;
        this.registry.set('characters', resp.characters);
      }
    });
  }

  private renderUI(): void {
    const centerX = this.cameras.main.width / 2;

    this.add.text(centerX, 30, 'Select Character', {
      fontSize: '24px', color: '#FFD700',
    }).setOrigin(0.5);

    // Display character slots (max 4)
    for (let i = 0; i < 4; i++) {
      const y = 100 + i * 80;
      const char = this.characters[i];

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
          this.cleanup();
          this.scene.start('CharCreateScene');
        });
      }
    }

    // Create new character button
    if (this.characters.length < 4) {
      this.add.text(centerX, 430, 'Create New Character', {
        fontSize: '14px', color: '#4CAF50', backgroundColor: '#222',
        padding: { x: 15, y: 8 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.cleanup();
          this.scene.start('CharCreateScene');
        });
    }

    // Logout button
    this.add.text(centerX, 460, 'Logout', {
      fontSize: '12px', color: '#888', backgroundColor: '#222',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        localStorage.removeItem('hb_token');
        window.location.reload();
      });
  }

  private enterGame(characterId: number): void {
    this.msgHandler.sendMessage(Proto.MSG_ENTER_GAME_REQUEST, {
      characterId,
    });
  }

  private cleanup(): void {
    if (this.formDiv) {
      this.formDiv.remove();
      this.formDiv = null;
    }
  }
}
