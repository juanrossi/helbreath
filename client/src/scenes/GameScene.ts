import Phaser from 'phaser';
import { MessageHandler, EnterGameResponse, MotionEvent, ChatMessageData, EntityInfo } from '../network/MessageHandler';
import * as Proto from '../network/Protocol';

const TILE_SIZE = 32;
const VIEWPORT_TILES_X = 21;
const VIEWPORT_TILES_Y = 16;

interface RemotePlayer {
  objectId: number;
  name: string;
  x: number;
  y: number;
  direction: number;
  action: number;
  sprite: Phaser.GameObjects.Rectangle;
  nameText: Phaser.GameObjects.Text;
  targetX: number;
  targetY: number;
  moveSpeed: number;
}

export class GameScene extends Phaser.Scene {
  private msgHandler!: MessageHandler;
  private player!: {
    objectId: number;
    x: number;
    y: number;
    direction: number;
    name: string;
    sprite: Phaser.GameObjects.Rectangle;
    nameText: Phaser.GameObjects.Text;
  };
  private mapWidth = 0;
  private mapHeight = 0;
  private collisionGrid: Uint8Array = new Uint8Array();
  private remotePlayers: Map<number, RemotePlayer> = new Map();
  private tileLayer!: Phaser.GameObjects.Container;
  private entityLayer!: Phaser.GameObjects.Container;
  private uiLayer!: Phaser.GameObjects.Container;
  private chatMessages: { text: Phaser.GameObjects.Text; expiry: number }[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private lastMoveTime = 0;
  private moveInterval = 490; // walk speed ms

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.msgHandler = this.registry.get('msgHandler') as MessageHandler;
    const enterData = this.registry.get('enterGameData') as EnterGameResponse;

    if (!enterData) {
      this.scene.start('LoginScene');
      return;
    }

    // Set up layers
    this.tileLayer = this.add.container(0, 0);
    this.entityLayer = this.add.container(0, 0);
    this.uiLayer = this.add.container(0, 0);

    // Parse map data
    this.mapWidth = enterData.mapInfo.width;
    this.mapHeight = enterData.mapInfo.height;
    this.collisionGrid = new Uint8Array(enterData.mapInfo.collisionGrid);

    // Create local player
    const pd = enterData.player;
    const playerSprite = this.add.rectangle(0, 0, 28, 40, 0x3498db);
    const playerName = this.add.text(0, 0, pd.name, {
      fontSize: '10px', color: '#fff',
    }).setOrigin(0.5, 1);

    this.player = {
      objectId: pd.objectId,
      x: pd.position.x,
      y: pd.position.y,
      direction: pd.direction,
      name: pd.name,
      sprite: playerSprite,
      nameText: playerName,
    };

    this.entityLayer.add([playerSprite, playerName]);

    // Add existing nearby players
    for (const entity of enterData.nearbyPlayers || []) {
      this.addRemotePlayer(entity);
    }

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Register message handlers
    this.msgHandler.on(Proto.MSG_MOTION_EVENT, (evt: MotionEvent) => this.onMotionEvent(evt));
    this.msgHandler.on(Proto.MSG_PLAYER_APPEAR, (data: any) => this.onPlayerAppear(data));
    this.msgHandler.on(Proto.MSG_PLAYER_DISAPPEAR, (data: any) => this.onPlayerDisappear(data));
    this.msgHandler.on(Proto.MSG_CHAT_MESSAGE, (data: ChatMessageData) => this.onChatMessage(data));

    // Chat input
    this.createChatUI();

    // Initial render
    this.renderViewport();

    // HUD
    this.createHUD(enterData.player);
  }

  update(time: number, delta: number): void {
    // Handle keyboard movement
    if (time - this.lastMoveTime >= this.moveInterval) {
      const dir = this.getInputDirection();
      if (dir > 0) {
        this.tryMove(dir, time);
      }
    }

    // Update remote player positions (lerp)
    for (const rp of this.remotePlayers.values()) {
      if (rp.x !== rp.targetX || rp.y !== rp.targetY) {
        rp.x = rp.targetX;
        rp.y = rp.targetY;
      }
    }

    // Update all entity screen positions relative to player
    this.updateEntityPositions();

    // Clean up expired chat bubbles
    const now = Date.now();
    this.chatMessages = this.chatMessages.filter(cm => {
      if (now > cm.expiry) {
        cm.text.destroy();
        return false;
      }
      return true;
    });
  }

  private getInputDirection(): number {
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;

    if (up && !left && !right) return 1;       // N
    if (up && right) return 2;                  // NE
    if (right && !up && !down) return 3;        // E
    if (down && right) return 4;                // SE
    if (down && !left && !right) return 5;      // S
    if (down && left) return 6;                 // SW
    if (left && !up && !down) return 7;         // W
    if (up && left) return 8;                   // NW
    return 0;
  }

  private tryMove(dir: number, time: number): void {
    const dx = [0, 0, 1, 1, 1, 0, -1, -1, -1];
    const dy = [0, -1, -1, 0, 1, 1, 1, 0, -1];

    const newX = this.player.x + dx[dir];
    const newY = this.player.y + dy[dir];

    // Client-side collision check
    if (!this.isWalkable(newX, newY)) return;

    this.player.x = newX;
    this.player.y = newY;
    this.player.direction = dir;
    this.lastMoveTime = time;

    // Send to server
    this.msgHandler.sendMessage(Proto.MSG_MOTION_REQUEST, {
      direction: dir,
      action: 1, // walk
      position: { x: newX, y: newY },
    });

    this.renderViewport();
  }

  private isWalkable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) return false;
    const idx = y * this.mapWidth + x;
    const byteIdx = Math.floor(idx / 8);
    const bitIdx = idx % 8;
    if (byteIdx >= this.collisionGrid.length) return false;
    return (this.collisionGrid[byteIdx] & (1 << bitIdx)) === 0;
  }

  private renderViewport(): void {
    this.tileLayer.removeAll(true);

    const startX = this.player.x - Math.floor(VIEWPORT_TILES_X / 2);
    const startY = this.player.y - Math.floor(VIEWPORT_TILES_Y / 2);

    for (let dy = 0; dy < VIEWPORT_TILES_Y; dy++) {
      for (let dx = 0; dx < VIEWPORT_TILES_X; dx++) {
        const tileX = startX + dx;
        const tileY = startY + dy;
        const screenX = dx * TILE_SIZE;
        const screenY = dy * TILE_SIZE;

        if (tileX < 0 || tileY < 0 || tileX >= this.mapWidth || tileY >= this.mapHeight) {
          // Out of bounds - dark tile
          const tile = this.add.rectangle(screenX + 16, screenY + 16, TILE_SIZE, TILE_SIZE, 0x111111);
          this.tileLayer.add(tile);
          continue;
        }

        // Walkable = green-ish ground, blocked = dark brown
        const walkable = this.isWalkable(tileX, tileY);
        const color = walkable ? 0x2d5a1e : 0x3b2507;

        const tile = this.add.rectangle(screenX + 16, screenY + 16, TILE_SIZE, TILE_SIZE, color);
        this.tileLayer.add(tile);

        // Draw grid lines
        const border = this.add.rectangle(screenX + 16, screenY + 16, TILE_SIZE, TILE_SIZE);
        border.setStrokeStyle(1, 0x000000, 0.1);
        this.tileLayer.add(border);
      }
    }
  }

  private updateEntityPositions(): void {
    const halfVX = Math.floor(VIEWPORT_TILES_X / 2);
    const halfVY = Math.floor(VIEWPORT_TILES_Y / 2);

    // Local player is always centered
    const playerScreenX = halfVX * TILE_SIZE + TILE_SIZE / 2;
    const playerScreenY = halfVY * TILE_SIZE + TILE_SIZE / 2;
    this.player.sprite.setPosition(playerScreenX, playerScreenY);
    this.player.nameText.setPosition(playerScreenX, playerScreenY - 24);

    // Remote players relative to local player
    for (const rp of this.remotePlayers.values()) {
      const relX = rp.x - this.player.x;
      const relY = rp.y - this.player.y;
      const screenX = (halfVX + relX) * TILE_SIZE + TILE_SIZE / 2;
      const screenY = (halfVY + relY) * TILE_SIZE + TILE_SIZE / 2;

      rp.sprite.setPosition(screenX, screenY);
      rp.nameText.setPosition(screenX, screenY - 24);

      // Hide if off-screen
      const visible = Math.abs(relX) <= halfVX + 1 && Math.abs(relY) <= halfVY + 1;
      rp.sprite.setVisible(visible);
      rp.nameText.setVisible(visible);
    }
  }

  private addRemotePlayer(info: EntityInfo | any): void {
    if (this.remotePlayers.has(info.objectId)) return;

    const sprite = this.add.rectangle(0, 0, 28, 40, 0xe74c3c);
    const nameText = this.add.text(0, 0, info.name || '???', {
      fontSize: '10px', color: '#fff',
    }).setOrigin(0.5, 1);

    this.entityLayer.add([sprite, nameText]);

    const rp: RemotePlayer = {
      objectId: info.objectId,
      name: info.name || '',
      x: info.position?.x ?? 0,
      y: info.position?.y ?? 0,
      direction: info.direction ?? 5,
      action: info.action ?? 0,
      sprite,
      nameText,
      targetX: info.position?.x ?? 0,
      targetY: info.position?.y ?? 0,
      moveSpeed: 490,
    };

    this.remotePlayers.set(info.objectId, rp);
  }

  private removeRemotePlayer(objectId: number): void {
    const rp = this.remotePlayers.get(objectId);
    if (rp) {
      rp.sprite.destroy();
      rp.nameText.destroy();
      this.remotePlayers.delete(objectId);
    }
  }

  // Network event handlers

  private onMotionEvent(evt: MotionEvent): void {
    if (evt.objectId === this.player.objectId) {
      // Server correction
      if (evt.action === 0) {
        this.player.x = evt.position.x;
        this.player.y = evt.position.y;
        this.player.direction = evt.direction;
        this.renderViewport();
      }
      return;
    }

    let rp = this.remotePlayers.get(evt.objectId);
    if (!rp) {
      // New player appeared via motion
      this.addRemotePlayer({
        objectId: evt.objectId,
        name: evt.name,
        position: evt.position,
        direction: evt.direction,
        action: evt.action,
      });
      rp = this.remotePlayers.get(evt.objectId);
    }

    if (rp) {
      rp.targetX = evt.position.x;
      rp.targetY = evt.position.y;
      rp.x = evt.position.x;
      rp.y = evt.position.y;
      rp.direction = evt.direction;
      rp.action = evt.action;
      rp.moveSpeed = evt.speed || 490;
    }
  }

  private onPlayerAppear(data: any): void {
    this.addRemotePlayer(data);
  }

  private onPlayerDisappear(data: any): void {
    this.removeRemotePlayer(data.objectId);
  }

  private onChatMessage(data: ChatMessageData): void {
    // Find the entity that sent the message
    const halfVX = Math.floor(VIEWPORT_TILES_X / 2);
    const halfVY = Math.floor(VIEWPORT_TILES_Y / 2);

    let screenX: number, screenY: number;

    if (data.objectId === this.player.objectId) {
      screenX = halfVX * TILE_SIZE + TILE_SIZE / 2;
      screenY = halfVY * TILE_SIZE - 30;
    } else {
      const rp = this.remotePlayers.get(data.objectId);
      if (rp) {
        const relX = rp.x - this.player.x;
        const relY = rp.y - this.player.y;
        screenX = (halfVX + relX) * TILE_SIZE + TILE_SIZE / 2;
        screenY = (halfVY + relY) * TILE_SIZE - 30;
      } else {
        screenX = halfVX * TILE_SIZE;
        screenY = 20;
      }
    }

    const chatText = this.add.text(screenX, screenY, `${data.senderName}: ${data.message}`, {
      fontSize: '11px',
      color: data.type === 1 ? '#FFD700' : '#fff',
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 1).setDepth(1000);

    this.chatMessages.push({
      text: chatText,
      expiry: Date.now() + 5000,
    });
  }

  private createChatUI(): void {
    const chatHtml = `
      <div id="chat-container" style="position:fixed; bottom:10px; left:10px; z-index:100;">
        <div id="chat-log" style="width:300px; height:100px; overflow-y:auto; background:rgba(0,0,0,0.7); color:#fff; font-size:12px; padding:5px; margin-bottom:5px;"></div>
        <input id="chat-input" type="text" maxlength="200" placeholder="Press Enter to chat..."
               style="width:300px; padding:5px; font-size:12px; background:rgba(0,0,0,0.7); color:#fff; border:1px solid #555;">
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = chatHtml;
    document.body.appendChild(div);

    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && chatInput.value.trim()) {
        const msg = chatInput.value.trim();
        let type = 0; // normal
        let target = '';
        let text = msg;

        // Shout with ! prefix
        if (msg.startsWith('!')) {
          type = 1;
          text = msg.slice(1).trim();
        }
        // Whisper with @name
        else if (msg.startsWith('@')) {
          type = 2;
          const spaceIdx = msg.indexOf(' ');
          if (spaceIdx > 0) {
            target = msg.slice(1, spaceIdx);
            text = msg.slice(spaceIdx + 1).trim();
          }
        }

        if (text) {
          this.msgHandler.sendMessage(Proto.MSG_CHAT_REQUEST, {
            type,
            message: text,
            target,
          });

          // Show locally in chat log
          const log = document.getElementById('chat-log');
          if (log) {
            const line = document.createElement('div');
            line.textContent = `${this.player.name}: ${text}`;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
          }
        }

        chatInput.value = '';
        e.stopPropagation();
      }
    });

    // Prevent game input when typing in chat
    chatInput.addEventListener('focus', () => {
      this.input.keyboard!.enabled = false;
    });
    chatInput.addEventListener('blur', () => {
      this.input.keyboard!.enabled = true;
    });

    // Register chat message handler for log
    this.msgHandler.on(Proto.MSG_CHAT_MESSAGE, (data: ChatMessageData) => {
      if (data.objectId === this.player.objectId) return; // already shown locally
      const log = document.getElementById('chat-log');
      if (log) {
        const line = document.createElement('div');
        const prefix = data.type === 1 ? '[SHOUT] ' : data.type === 2 ? '[WHISPER] ' : '';
        line.textContent = `${prefix}${data.senderName}: ${data.message}`;
        line.style.color = data.type === 1 ? '#FFD700' : data.type === 2 ? '#9b59b6' : '#fff';
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
      }
    });

    this.events.on('shutdown', () => {
      div.remove();
    });
  }

  private createHUD(playerData: any): void {
    const hudHtml = `
      <div id="hud" style="position:fixed; top:10px; right:10px; z-index:100; background:rgba(0,0,0,0.7); color:#fff; padding:10px; font-size:12px; min-width:150px;">
        <div><strong>${playerData.name}</strong> Lv.${playerData.level}</div>
        <div style="margin-top:5px;">
          <div>HP: <span style="color:#e74c3c;">${playerData.hp}/${playerData.maxHp}</span></div>
          <div>MP: <span style="color:#3498db;">${playerData.mp}/${playerData.maxMp}</span></div>
          <div>SP: <span style="color:#2ecc71;">${playerData.sp}/${playerData.maxSp}</span></div>
        </div>
        <div style="margin-top:5px; font-size:11px; color:#999;">
          Map: ${playerData.mapName}
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = hudHtml;
    document.body.appendChild(div);

    this.events.on('shutdown', () => {
      div.remove();
    });
  }
}
