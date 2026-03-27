import Phaser from 'phaser';
import {
  MessageHandler, EnterGameResponse, MotionEvent, ChatMessageData, EntityInfo,
  DamageEventData, StatUpdateData, DeathEventData, RespawnEventData,
  NpcAppearData, NpcMotionData,
  InventoryUpdateData, ItemInstanceData, GroundItemAppearData, GroundItemDisappearData,
  ShopOpenData, ShopItemData, ShopResponseData,
  SpellEffectData, BuffUpdateData, SpellListData, LearnedSpellData,
  SkillListData, SkillEntryData, SkillResultData, CraftResultData,
  FactionSelectResponseData, GuildInfoData, GuildMemberData, GuildActionResponseData,
  PartyUpdateData, PartyMemberData, PartyInviteData, PartyActionResponseData,
  TradeIncomingData, TradeUpdateData, TradeSlotData, TradeCompleteData, PKStatusData,
  QuestListData, QuestEntryData, QuestProgressData, QuestRewardData,
} from '../network/MessageHandler';
import * as Proto from '../network/Protocol';
import { HBMap, TILE_SIZE } from '../game/assets/HBMap';
import { GameAsset } from '../game/objects/GameAsset';
import { AnimationType } from '../game/objects/GameAsset';
import { DEPTH_MULTIPLIER } from '../Config';
import {
  PlayerState,
  HUMAN_SPRITESHEET_BASE,
  ARMOUR_SPRITESHEET_BASE,
  PLAYER_ANIMATION_FRAME_COUNT,
  getHumanSpriteName,
  type GearConfig,
} from '../game/PlayerAppearanceManager';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlayerAssets {
  layers: GameAsset[];
  gear: GearConfig;
}

interface RemotePlayer {
  objectId: number;
  name: string;
  tileX: number;
  tileY: number;
  visualX: number;
  visualY: number;
  direction: number;
  action: number;
  assets: PlayerAssets | null;
  nameText: Phaser.GameObjects.Text;
  targetTileX: number;
  targetTileY: number;
  moveStartTime: number;
  moveDuration: number;
  moveStartX: number;
  moveStartY: number;
  isMoving: boolean;
  gender: number;
  skinColor: number;
  hairStyle: number;
  underwearColor: number;
}

interface GameNPC {
  objectId: number;
  name: string;
  npcType: number;
  tileX: number;
  tileY: number;
  visualX: number;
  visualY: number;
  direction: number;
  action: number;
  hp: number;
  maxHp: number;
  asset: GameAsset | null;
  fallbackSprite: Phaser.GameObjects.Ellipse | null;
  nameText: Phaser.GameObjects.Text;
  hpBar: Phaser.GameObjects.Graphics;
  targetTileX: number;
  targetTileY: number;
  moveStartTime: number;
  moveDuration: number;
  moveStartX: number;
  moveStartY: number;
  isMoving: boolean;
}

// NPC type -> sprite file name mapping
const NPC_SPRITE_MAP: Record<number, string> = {
  1: 'slm',     // Slime
  2: 'ske',     // Skeleton
  3: 'orc',     // Orc
  4: 'demon',   // Demon
  10: 'guard',  // Weapon Smith
  11: 'guard',  // Armorer
  12: 'guard',  // Potion Merchant
};

// Fallback colors if sprite fails to load
const NPC_COLORS: Record<number, number> = {
  1: 0x44ff44,  // Slime - green
  2: 0xcccccc,  // Skeleton - gray
  3: 0x886644,  // Orc - brown
  4: 0xff4444,  // Demon - red
  10: 0x4488ff, // Weapon Smith - blue
  11: 0x4488ff, // Armorer - blue
  12: 0x4488ff, // Potion Merchant - blue
};

interface GroundItemDisplay {
  groundId: number;
  itemId: number;
  name: string;
  count: number;
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
}

// Direction deltas indexed by direction 1-8
const DIR_DX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
const DIR_DY = [0, -1, -1, 0, 1, 1, 1, 0, -1];

const WALK_SPEED = 490; // ms per tile
const RUN_SPEED = 350;  // ms per tile
const MOVE_THROTTLE = 100; // ms between mouse direction checks

// ---------------------------------------------------------------------------
// GameScene
// ---------------------------------------------------------------------------

export class GameScene extends Phaser.Scene {
  private msgHandler!: MessageHandler;

  // Local player state
  private playerObjectId = 0;
  private tileX = 0;
  private tileY = 0;
  private visualX = 0;
  private visualY = 0;
  private playerDirection = 5;
  private playerName = '';
  private playerGender = 0;
  private playerSkinColor = 0;
  private playerHairStyle = 0;
  private playerUnderwearColor = 0;
  private playerAssets: PlayerAssets | null = null;
  private playerNameText!: Phaser.GameObjects.Text;
  private playerState: PlayerState = PlayerState.IdlePeace;

  // Smooth movement
  private isMoving = false;
  private moveStartX = 0;
  private moveStartY = 0;
  private moveTargetX = 0;
  private moveTargetY = 0;
  private moveStartTime = 0;
  private moveDuration = WALK_SPEED;

  // Mouse movement
  private isMouseDown = false;
  private lastMoveTime = 0;
  private isRunning = false;

  // Map
  private mapWidth = 0;
  private mapHeight = 0;
  private collisionGrid: Uint8Array = new Uint8Array();
  private hbMap: HBMap | null = null;
  private currentMapName = '';

  // Remote players
  private remotePlayers: Map<number, RemotePlayer> = new Map();

  // NPCs
  private npcs: Map<number, GameNPC> = new Map();

  // Player stats (live)
  private playerHP = 0;
  private playerMaxHP = 0;
  private playerMP = 0;
  private playerMaxMP = 0;
  private playerSP = 0;
  private playerMaxSP = 0;
  private playerLevel = 1;
  private playerExp: number = 0;
  private playerGold: number = 0;
  private isDead = false;

  // Combat
  private lastAttackTime = 0;
  private attackCooldown = 800; // ms between attacks

  // Chat
  private chatBubbles: { text: Phaser.GameObjects.Text; expiry: number; objectId: number }[] = [];

  // Minimap
  private minimapTexture: Phaser.GameObjects.RenderTexture | null = null;
  private minimapPlayerDot: Phaser.GameObjects.Graphics | null = null;
  private minimapContainer: Phaser.GameObjects.Container | null = null;
  private minimapBorder: Phaser.GameObjects.Graphics | null = null;

  // Idle timer
  private idleTimer: ReturnType<typeof setTimeout> | null = null;

  // Inventory & Equipment
  private inventoryItems: ItemInstanceData[] = [];
  private equipmentItems: ItemInstanceData[] = [];
  private inventoryOpen = false;
  private inventoryDiv: HTMLDivElement | null = null;

  // Ground items
  private groundItems: Map<number, GroundItemDisplay> = new Map();

  // Shop
  private shopOpen = false;
  private shopDiv: HTMLDivElement | null = null;
  private currentShopNpcId = 0;
  private currentShopItems: ShopItemData[] = [];

  // Spells & Skills
  private learnedSpells: LearnedSpellData[] = [];
  private playerSkills: SkillEntryData[] = [];
  private activeBuffs: Map<number, BuffUpdateData> = new Map();
  private spellBarOpen = false;
  private spellBarDiv: HTMLDivElement | null = null;
  private skillsOpen = false;
  private skillsDiv: HTMLDivElement | null = null;
  private selectedSpellId = 0;

  // Social
  private guildInfo: GuildInfoData | null = null;
  private guildDiv: HTMLDivElement | null = null;
  private guildOpen = false;
  private partyMembers: PartyMemberData[] = [];
  private partyLeaderId = 0;
  private partyDiv: HTMLDivElement | null = null;
  private partyOpen = false;
  private tradeOpen = false;
  private tradeDiv: HTMLDivElement | null = null;
  private pkCount = 0;
  private ekCount = 0;
  private criminal = false;

  // Quests
  private questList: QuestEntryData[] = [];
  private availableQuestIds: number[] = [];
  private questOpen = false;
  private questDiv: HTMLDivElement | null = null;

  // World
  private timeOfDay = 'day';
  private weather = 'clear';

  // Stat allocation
  private playerLUPool = 0;
  private playerSTR = 10;
  private playerVIT = 10;
  private playerDEX = 10;
  private playerINT = 10;
  private playerMAG = 10;
  private playerCHR = 10;

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

    const pd = enterData.player;
    this.playerObjectId = pd.objectId;
    this.tileX = pd.position.x;
    this.tileY = pd.position.y;
    this.visualX = pd.position.x * TILE_SIZE;
    this.visualY = pd.position.y * TILE_SIZE;
    this.playerDirection = pd.direction;
    this.playerName = pd.name;
    this.playerGender = pd.appearance?.gender ?? 0;
    this.playerSkinColor = pd.appearance?.skinColor ?? 0;
    this.playerHairStyle = pd.appearance?.hairStyle ?? 0;
    this.playerUnderwearColor = pd.appearance?.underwearColor ?? 0;
    this.currentMapName = pd.mapName;
    this.playerHP = pd.hp;
    this.playerMaxHP = pd.maxHp;
    this.playerMP = pd.mp;
    this.playerMaxMP = pd.maxMp;
    this.playerSP = pd.sp;
    this.playerMaxSP = pd.maxSp;
    this.playerLevel = pd.level;
    this.playerExp = pd.experience ?? 0;
    this.playerGold = pd.gold ?? 0;
    this.playerLUPool = pd.luPool ?? 0;
    this.playerSTR = pd.str ?? 10;
    this.playerVIT = pd.vit ?? 10;
    this.playerDEX = pd.dex ?? 10;
    this.playerINT = pd.intStat ?? 10;
    this.playerMAG = pd.mag ?? 10;
    this.playerCHR = pd.charisma ?? 10;
    this.isDead = false;

    // Parse collision grid
    this.mapWidth = enterData.mapInfo.width;
    this.mapHeight = enterData.mapInfo.height;
    this.collisionGrid = new Uint8Array(enterData.mapInfo.collisionGrid);

    // Load and render map
    this.loadMap(enterData.mapInfo.name || pd.mapName);

    // Create local player sprites
    this.createLocalPlayer();

    // Add existing nearby players
    console.log(`[ENTER] Received ${(enterData.nearbyPlayers || []).length} nearby players, ${(enterData.nearbyNpcs || []).length} nearby NPCs`);
    for (const entity of enterData.nearbyPlayers || []) {
      console.log(`[ENTER]   Adding remote player: ${entity.name} (obj=${entity.objectId}) at (${entity.position?.x}, ${entity.position?.y})`);
      this.addRemotePlayer(entity);
    }

    // Add existing nearby NPCs
    for (const entity of enterData.nearbyNpcs || []) {
      console.log(`[ENTER]   Adding NPC: ${entity.name} (obj=${entity.objectId}) type=${entity.npcType} at (${entity.position?.x}, ${entity.position?.y})`);
      this.addNPC(entity);
    }

    // Camera
    this.cameras.main.scrollX = this.visualX - this.cameras.main.width / 2 + TILE_SIZE / 2;
    this.cameras.main.scrollY = this.visualY - this.cameras.main.height / 2 + TILE_SIZE / 2;

    // Mouse input for movement and combat
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isDead) return;
      if (pointer.rightButtonDown()) {
        // Right-click: attack nearest NPC
        this.handleAttackClick(pointer);
      } else if (pointer.leftButtonDown()) {
        this.isMouseDown = true;
        this.handleMouseMove(pointer);
      }
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isMouseDown && !this.isDead) {
        this.handleMouseMove(pointer);
      }
    });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) {
        this.isMouseDown = false;
      }
    });

    // Disable right-click context menu on canvas
    this.game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Shift key for run toggle
    this.input.keyboard!.on('keydown-SHIFT', () => { this.isRunning = true; });
    this.input.keyboard!.on('keyup-SHIFT', () => { this.isRunning = false; });

    // Network handlers
    this.msgHandler.on(Proto.MSG_MOTION_EVENT, (evt: MotionEvent) => this.onMotionEvent(evt));
    this.msgHandler.on(Proto.MSG_PLAYER_APPEAR, (data: any) => this.addRemotePlayer(data));
    this.msgHandler.on(Proto.MSG_PLAYER_DISAPPEAR, (data: any) => this.removeRemotePlayer(data.objectId));
    this.msgHandler.on(Proto.MSG_CHAT_MESSAGE, (data: ChatMessageData) => this.onChatMessage(data));
    this.msgHandler.on(Proto.MSG_NPC_APPEAR, (data: NpcAppearData) => this.addNPC(data));
    this.msgHandler.on(Proto.MSG_NPC_DISAPPEAR, (data: any) => this.removeNPC(data.objectId));
    this.msgHandler.on(Proto.MSG_NPC_MOTION, (data: NpcMotionData) => this.onNpcMotion(data));
    this.msgHandler.on(Proto.MSG_DAMAGE_EVENT, (data: DamageEventData) => this.onDamageEvent(data));
    this.msgHandler.on(Proto.MSG_STAT_UPDATE, (data: StatUpdateData) => this.onStatUpdate(data));
    this.msgHandler.on(Proto.MSG_DEATH_EVENT, (data: DeathEventData) => this.onDeathEvent(data));
    this.msgHandler.on(Proto.MSG_RESPAWN_EVENT, (data: RespawnEventData) => this.onRespawnEvent(data));
    this.msgHandler.on(Proto.MSG_NOTIFICATION, (data: any) => this.onNotification(data));
    this.msgHandler.on(Proto.MSG_INVENTORY_UPDATE, (data: InventoryUpdateData) => this.onInventoryUpdate(data));
    this.msgHandler.on(Proto.MSG_GROUND_ITEM_APPEAR, (data: GroundItemAppearData) => this.onGroundItemAppear(data));
    this.msgHandler.on(Proto.MSG_GROUND_ITEM_DISAPPEAR, (data: GroundItemDisappearData) => this.onGroundItemDisappear(data));
    this.msgHandler.on(Proto.MSG_SHOP_OPEN, (data: ShopOpenData) => this.onShopOpen(data));
    this.msgHandler.on(Proto.MSG_SHOP_RESPONSE, (data: ShopResponseData) => this.onShopResponse(data));
    this.msgHandler.on(Proto.MSG_SPELL_EFFECT, (data: SpellEffectData) => this.onSpellEffect(data));
    this.msgHandler.on(Proto.MSG_BUFF_UPDATE, (data: BuffUpdateData) => this.onBuffUpdate(data));
    this.msgHandler.on(Proto.MSG_SPELL_LIST, (data: SpellListData) => this.onSpellList(data));
    this.msgHandler.on(Proto.MSG_SKILL_LIST, (data: SkillListData) => this.onSkillList(data));
    this.msgHandler.on(Proto.MSG_SKILL_RESULT, (data: SkillResultData) => this.onSkillResult(data));
    this.msgHandler.on(Proto.MSG_CRAFT_RESULT, (data: CraftResultData) => this.onCraftResult(data));
    this.msgHandler.on(Proto.MSG_FACTION_SELECT_RESPONSE, (data: FactionSelectResponseData) => this.onFactionResponse(data));
    this.msgHandler.on(Proto.MSG_GUILD_INFO, (data: GuildInfoData) => this.onGuildInfo(data));
    this.msgHandler.on(Proto.MSG_GUILD_ACTION_RESPONSE, (data: GuildActionResponseData) => this.onGuildActionResponse(data));
    this.msgHandler.on(Proto.MSG_PARTY_UPDATE, (data: PartyUpdateData) => this.onPartyUpdate(data));
    this.msgHandler.on(Proto.MSG_PARTY_INVITE, (data: PartyInviteData) => this.onPartyInvite(data));
    this.msgHandler.on(Proto.MSG_PARTY_ACTION_RESPONSE, (data: PartyActionResponseData) => this.onPartyActionResponse(data));
    this.msgHandler.on(Proto.MSG_TRADE_INCOMING, (data: TradeIncomingData) => this.onTradeIncoming(data));
    this.msgHandler.on(Proto.MSG_TRADE_UPDATE, (data: TradeUpdateData) => this.onTradeUpdate(data));
    this.msgHandler.on(Proto.MSG_TRADE_COMPLETE, (data: TradeCompleteData) => this.onTradeComplete(data));
    this.msgHandler.on(Proto.MSG_PK_STATUS_UPDATE, (data: PKStatusData) => this.onPKStatus(data));
    this.msgHandler.on(Proto.MSG_QUEST_LIST_UPDATE, (data: QuestListData) => this.onQuestList(data));
    this.msgHandler.on(Proto.MSG_QUEST_PROGRESS, (data: QuestProgressData) => this.onQuestProgress(data));
    this.msgHandler.on(Proto.MSG_QUEST_REWARD, (data: QuestRewardData) => this.onQuestReward(data));
    this.msgHandler.on(Proto.MSG_MAP_CHANGE_RESPONSE, (data: any) => this.onMapChange(data));

    // Keyboard shortcuts for UI
    this.input.keyboard!.on('keydown-I', () => this.toggleInventory());
    this.input.keyboard!.on('keydown-C', () => this.toggleStats());
    this.input.keyboard!.on('keydown-M', () => this.toggleSpellBar());
    this.input.keyboard!.on('keydown-K', () => this.toggleSkills());
    this.input.keyboard!.on('keydown-G', () => this.toggleGuild());
    this.input.keyboard!.on('keydown-P', () => this.toggleParty());
    this.input.keyboard!.on('keydown-J', () => this.toggleQuests());

    // Chat UI
    this.createChatUI();
    this.createHUD(pd);

    // Minimap
    this.createMinimap();
  }

  update(time: number, delta: number): void {
    // Update smooth movement interpolation for local player
    this.updateLocalMovement(time);

    // Update camera to follow interpolated position
    this.cameras.main.scrollX = this.visualX - this.cameras.main.width / 2 + TILE_SIZE / 2;
    this.cameras.main.scrollY = this.visualY - this.cameras.main.height / 2 + TILE_SIZE / 2;

    // Update entity positions
    this.updateLocalPlayerPosition();
    for (const rp of this.remotePlayers.values()) {
      this.updateRemoteMovement(rp, time);
      this.updateRemotePlayerPosition(rp);
    }

    // Update NPC positions
    for (const npcEntity of this.npcs.values()) {
      this.updateNPCMovement(npcEntity, time);
      this.updateNPCPosition(npcEntity);
    }

    // Update minimap player dot
    this.updateMinimapDot();

    // Clean up expired chat bubbles
    const now = Date.now();
    this.chatBubbles = this.chatBubbles.filter(cb => {
      if (now > cb.expiry) {
        cb.text.destroy();
        return false;
      }
      // Update bubble position to follow moving entities
      if (cb.objectId === this.playerObjectId) {
        cb.text.setPosition(this.visualX + TILE_SIZE / 2, this.visualY - 20);
      } else {
        const rp = this.remotePlayers.get(cb.objectId);
        if (rp) {
          cb.text.setPosition(rp.visualX + TILE_SIZE / 2, rp.visualY - 20);
        }
      }
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // Map loading
  // ---------------------------------------------------------------------------

  private loadMap(mapName: string): void {
    if (this.hbMap) {
      this.hbMap.destroyMapObjects();
      this.hbMap.destroyMapTiles(this);
    }

    const fileName = mapName.toLowerCase().replace(/\.amd$/i, '') + '.amd';

    try {
      this.hbMap = new HBMap(fileName);
      this.hbMap.load(this);
      this.hbMap.renderMapTiles(this);
      this.hbMap.renderMapObjects(this, false);
      this.hbMap.renderMapObjects(this, true);
      console.log(`Map loaded and rendered: ${fileName}`);
    } catch (err) {
      console.error(`Failed to load map ${fileName}:`, err);
    }
  }

  // ---------------------------------------------------------------------------
  // Map change (teleport)
  // ---------------------------------------------------------------------------

  private onMapChange(data: any): void {
    const mapName = data.mapName as string;
    const pos = data.position;
    const dir = data.direction as number;

    console.log(`Map change: teleporting to ${mapName} (${pos?.x}, ${pos?.y})`);

    // Show loading overlay
    const overlay = this.add.rectangle(
      this.cameras.main.scrollX + this.cameras.main.width / 2,
      this.cameras.main.scrollY + this.cameras.main.height / 2,
      this.cameras.main.width, this.cameras.main.height,
      0x000000, 1,
    ).setDepth(999999).setScrollFactor(0).setOrigin(0.5);
    const loadText = this.add.text(
      this.cameras.main.width / 2, this.cameras.main.height / 2,
      `Entering ${mapName}...`,
      { fontSize: '18px', color: '#ffffff', fontStyle: 'bold' },
    ).setDepth(999999).setScrollFactor(0).setOrigin(0.5);

    // Clear all remote players and NPCs from current map
    for (const [id] of this.remotePlayers) {
      this.removeRemotePlayer(id);
    }
    for (const [id] of this.npcs) {
      this.removeNPC(id);
    }

    // Clear ground items
    for (const [, gi] of this.groundItems) {
      gi.sprite.destroy();
      gi.label.destroy();
    }
    this.groundItems.clear();

    // Load new map
    this.currentMapName = mapName;
    this.loadMap(mapName);

    // Update player position
    if (pos) {
      this.tileX = pos.x;
      this.tileY = pos.y;
    }
    if (dir > 0) {
      this.playerDirection = dir;
    }

    // Update visual position
    const TILE_SIZE = 32;
    this.visualX = this.tileX * TILE_SIZE + TILE_SIZE / 2;
    this.visualY = this.tileY * TILE_SIZE + TILE_SIZE / 2;
    if (this.playerAssets) {
      this.setPlayerAssetsPosition(this.playerAssets, this.visualX, this.visualY, this.tileY);
    }
    this.cameras.main.centerOn(this.visualX, this.visualY);

    // Update map name in HUD
    const mapLabel = document.getElementById('hud-map');
    if (mapLabel) mapLabel.textContent = `Map: ${mapName}`;

    // Recreate minimap for new map
    if (this.minimapContainer) {
      this.minimapContainer.destroy();
      this.minimapContainer = null as any;
    }
    if (this.minimapBorder) {
      this.minimapBorder.destroy();
      this.minimapBorder = null as any;
    }
    if (this.minimapPlayerDot) {
      this.minimapPlayerDot.destroy();
      this.minimapPlayerDot = null as any;
    }

    // Update map dimensions from the loaded map
    if (this.hbMap) {
      this.mapWidth = this.hbMap.sizeX;
      this.mapHeight = this.hbMap.sizeY;
    }

    // Recreate minimap with new terrain data
    this.createMinimap();

    // Fade out overlay after map is loaded
    this.tweens.add({
      targets: [overlay, loadText],
      alpha: 0,
      duration: 400,
      delay: 200,
      onComplete: () => {
        overlay.destroy();
        loadText.destroy();
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Player sprite creation
  // ---------------------------------------------------------------------------

  private createLocalPlayer(): void {
    const gear = this.buildGearConfig(this.playerGender, this.playerSkinColor, this.playerHairStyle, this.playerUnderwearColor);
    const dir = Math.max(0, this.playerDirection - 1);
    const state = PlayerState.IdlePeace;

    const layers = this.createPlayerLayers(gear, dir, state);
    this.playerAssets = { layers, gear };

    this.setPlayerAssetsPosition(this.playerAssets, this.visualX, this.visualY, this.tileY);

    this.playerNameText = this.add.text(this.visualX + TILE_SIZE / 2, this.visualY - 4, this.playerName, {
      fontSize: '10px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(this.tileY * DEPTH_MULTIPLIER + 50);

    this.playerState = state;
  }

  private createPlayerLayers(gear: GearConfig, direction: number, state: PlayerState): GameAsset[] {
    const layers: GameAsset[] = [];
    const framesPerDirection = PLAYER_ANIMATION_FRAME_COUNT[state] ?? 8;

    // Layer 1: Human body
    const bodySheetIndex = HUMAN_SPRITESHEET_BASE[state] + direction;
    const bodyAnimKey = `${gear.human}-${bodySheetIndex}`;

    if (this.anims.exists(bodyAnimKey)) {
      const body = new GameAsset(this, {
        x: 0, y: 0,
        spriteName: gear.human,
        spriteSheetIndex: bodySheetIndex,
        animationType: AnimationType.FullFrame,
      });
      layers.push(body);
    }

    // Layer 2: Hair
    const isFemale = gear.human === 'ww' || gear.human === 'yw' || gear.human === 'bw';
    const hairSprite = isFemale ? 'whr' : 'mhr';
    const hairStyleIndex = gear.hairStyleIndex ?? 0;
    const hairSheetIndex = hairStyleIndex * 12 + ARMOUR_SPRITESHEET_BASE[state];
    const hairAnimKey = `${hairSprite}-${hairSheetIndex}`;

    if (this.anims.exists(hairAnimKey)) {
      const hair = new GameAsset(this, {
        x: 0, y: 0,
        spriteName: hairSprite,
        spriteSheetIndex: hairSheetIndex,
        direction,
        framesPerDirection,
        animationType: AnimationType.DirectionalSubFrame,
      });
      layers.push(hair);
    }

    // Layer 3: Underwear
    const underwearSprite = isFemale ? 'wpt' : 'mpt';
    const underwearColorIndex = gear.underwearColorIndex ?? 0;
    const underwearSheetIndex = underwearColorIndex * 12 + ARMOUR_SPRITESHEET_BASE[state];
    const underwearAnimKey = `${underwearSprite}-${underwearSheetIndex}`;

    if (this.anims.exists(underwearAnimKey)) {
      const underwear = new GameAsset(this, {
        x: 0, y: 0,
        spriteName: underwearSprite,
        spriteSheetIndex: underwearSheetIndex,
        direction,
        framesPerDirection,
        animationType: AnimationType.DirectionalSubFrame,
      });
      layers.push(underwear);
    }

    return layers;
  }

  private buildGearConfig(gender: number, skinColor: number, hairStyle: number, underwearColor: number): GearConfig {
    return {
      human: getHumanSpriteName(gender, skinColor),
      hairStyleIndex: hairStyle,
      underwearColorIndex: underwearColor,
    };
  }

  private setPlayerAssetsPosition(assets: PlayerAssets, worldX: number, worldY: number, tileY: number): void {
    const baseDepth = tileY * DEPTH_MULTIPLIER;
    for (let i = 0; i < assets.layers.length; i++) {
      assets.layers[i].setPosition(worldX, worldY);
      assets.layers[i].setDepth(baseDepth + i);
    }
  }

  private updatePlayerAnimation(assets: PlayerAssets, state: PlayerState, direction: number): void {
    const gear = assets.gear;
    const framesPerDirection = PLAYER_ANIMATION_FRAME_COUNT[state] ?? 8;
    const isFemale = gear.human === 'ww' || gear.human === 'yw' || gear.human === 'bw';

    if (assets.layers[0]) {
      const bodySheetIndex = HUMAN_SPRITESHEET_BASE[state] + direction;
      const bodyAnimKey = `${gear.human}-${bodySheetIndex}`;
      assets.layers[0].playAnimationWithDirection(
        bodyAnimKey, 0, 10, undefined, undefined, framesPerDirection, AnimationType.FullFrame,
      );
    }

    if (assets.layers[1]) {
      const hairSprite = isFemale ? 'whr' : 'mhr';
      const hairSheetIndex = (gear.hairStyleIndex ?? 0) * 12 + ARMOUR_SPRITESHEET_BASE[state];
      const hairAnimKey = `${hairSprite}-${hairSheetIndex}`;
      assets.layers[1].playAnimationWithDirection(
        hairAnimKey, direction, 10, undefined, undefined, framesPerDirection, AnimationType.DirectionalSubFrame,
      );
    }

    if (assets.layers[2]) {
      const underwearSprite = isFemale ? 'wpt' : 'mpt';
      const underwearSheetIndex = (gear.underwearColorIndex ?? 0) * 12 + ARMOUR_SPRITESHEET_BASE[state];
      const underwearAnimKey = `${underwearSprite}-${underwearSheetIndex}`;
      assets.layers[2].playAnimationWithDirection(
        underwearAnimKey, direction, 10, undefined, undefined, framesPerDirection, AnimationType.DirectionalSubFrame,
      );
    }
  }

  private destroyPlayerAssets(assets: PlayerAssets | null): void {
    if (!assets) return;
    for (const layer of assets.layers) {
      layer.destroy();
    }
    assets.layers = [];
  }

  // ---------------------------------------------------------------------------
  // Smooth movement interpolation
  // ---------------------------------------------------------------------------

  private updateLocalMovement(time: number): void {
    if (!this.isMoving) {
      this.visualX = this.tileX * TILE_SIZE;
      this.visualY = this.tileY * TILE_SIZE;
      return;
    }

    const elapsed = time - this.moveStartTime;
    const t = Math.min(elapsed / this.moveDuration, 1);

    this.visualX = this.moveStartX + (this.moveTargetX - this.moveStartX) * t;
    this.visualY = this.moveStartY + (this.moveTargetY - this.moveStartY) * t;

    if (t >= 1) {
      this.isMoving = false;
      this.visualX = this.moveTargetX;
      this.visualY = this.moveTargetY;

      // If mouse is still held, try to continue moving
      if (this.isMouseDown) {
        const pointer = this.input.activePointer;
        this.handleMouseMove(pointer);
      }
    }
  }

  private updateRemoteMovement(rp: RemotePlayer, time: number): void {
    if (!rp.isMoving) {
      rp.visualX = rp.tileX * TILE_SIZE;
      rp.visualY = rp.tileY * TILE_SIZE;
      return;
    }

    const elapsed = time - rp.moveStartTime;
    const t = Math.min(elapsed / rp.moveDuration, 1);

    rp.visualX = rp.moveStartX + (rp.targetTileX * TILE_SIZE - rp.moveStartX) * t;
    rp.visualY = rp.moveStartY + (rp.targetTileY * TILE_SIZE - rp.moveStartY) * t;

    if (t >= 1) {
      rp.isMoving = false;
      rp.tileX = rp.targetTileX;
      rp.tileY = rp.targetTileY;
      rp.visualX = rp.tileX * TILE_SIZE;
      rp.visualY = rp.tileY * TILE_SIZE;
    }
  }

  // ---------------------------------------------------------------------------
  // Position updates
  // ---------------------------------------------------------------------------

  private updateLocalPlayerPosition(): void {
    if (!this.playerAssets) return;
    this.setPlayerAssetsPosition(this.playerAssets, this.visualX, this.visualY, this.tileY);
    this.playerNameText.setPosition(this.visualX + TILE_SIZE / 2, this.visualY - 4);
    this.playerNameText.setDepth(this.tileY * DEPTH_MULTIPLIER + 50);
  }

  private updateRemotePlayerPosition(rp: RemotePlayer): void {
    if (!rp.assets) return;
    this.setPlayerAssetsPosition(rp.assets, rp.visualX, rp.visualY, rp.tileY);
    rp.nameText.setPosition(rp.visualX + TILE_SIZE / 2, rp.visualY - 4);
    rp.nameText.setDepth(rp.tileY * DEPTH_MULTIPLIER + 50);
  }

  // ---------------------------------------------------------------------------
  // Mouse-based movement
  // ---------------------------------------------------------------------------

  private handleMouseMove(pointer: Phaser.Input.Pointer): void {
    if (this.isMoving) return; // wait for current move to finish

    const now = this.time.now;
    if (now - this.lastMoveTime < MOVE_THROTTLE) return;

    // Get mouse world position
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

    // Calculate direction from player center to mouse
    const playerCenterX = this.visualX + TILE_SIZE / 2;
    const playerCenterY = this.visualY + TILE_SIZE / 2;
    const dx = worldPoint.x - playerCenterX;
    const dy = worldPoint.y - playerCenterY;

    // Dead zone - don't move if clicking very close to player
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < TILE_SIZE * 0.5) return;

    // Calculate 8-direction from angle
    const dir = this.angleToDirection(dx, dy);
    if (dir === 0) return;

    this.tryMove(dir, now);
  }

  private angleToDirection(dx: number, dy: number): number {
    // atan2 gives angle in radians, convert to 8 directions
    // Directions: 1=N, 2=NE, 3=E, 4=SE, 5=S, 6=SW, 7=W, 8=NW
    const angle = Math.atan2(dy, dx); // -PI to PI, 0 = right
    // Convert to 0-360 with 0 = north, clockwise
    let degrees = ((angle * 180 / Math.PI) + 90 + 360) % 360;

    // Map to 8 sectors (each 45 degrees)
    // 0=N center at 0, NE at 45, E at 90, etc.
    const sector = Math.round(degrees / 45) % 8;
    // sector: 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW
    const dirMap = [1, 2, 3, 4, 5, 6, 7, 8];
    return dirMap[sector];
  }

  private tryMove(dir: number, time: number): void {
    const newX = this.tileX + DIR_DX[dir];
    const newY = this.tileY + DIR_DY[dir];

    if (!this.isWalkable(newX, newY)) return;

    const oldDir = this.playerDirection;
    this.playerDirection = dir;
    this.lastMoveTime = time;

    const speed = this.isRunning ? RUN_SPEED : WALK_SPEED;
    const action = this.isRunning ? 2 : 1;
    const animState = this.isRunning ? PlayerState.Run : PlayerState.WalkPeace;

    // Start smooth interpolation
    this.moveStartX = this.visualX;
    this.moveStartY = this.visualY;
    this.moveTargetX = newX * TILE_SIZE;
    this.moveTargetY = newY * TILE_SIZE;
    this.moveStartTime = time;
    this.moveDuration = speed;
    this.isMoving = true;

    // Update tile position immediately (client-side prediction)
    this.tileX = newX;
    this.tileY = newY;

    // Update animation
    const spriteDir = dir - 1;
    if (this.playerAssets && (this.playerState !== animState || oldDir !== dir)) {
      this.playerState = animState;
      this.updatePlayerAnimation(this.playerAssets, animState, spriteDir);
    }

    // Send to server
    this.msgHandler.sendMessage(Proto.MSG_MOTION_REQUEST, {
      direction: dir,
      action,
      position: { x: newX, y: newY },
    });

    // Set idle timer
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if ((this.playerState === PlayerState.WalkPeace || this.playerState === PlayerState.Run) && this.playerAssets) {
        this.playerState = PlayerState.IdlePeace;
        this.updatePlayerAnimation(this.playerAssets, PlayerState.IdlePeace, this.playerDirection - 1);
      }
    }, speed + 200);
  }

  private isWalkable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.mapWidth || y >= this.mapHeight) return false;
    const idx = y * this.mapWidth + x;
    const byteIdx = Math.floor(idx / 8);
    const bitIdx = idx % 8;
    if (byteIdx >= this.collisionGrid.length) return false;
    return (this.collisionGrid[byteIdx] & (1 << bitIdx)) === 0;
  }

  // ---------------------------------------------------------------------------
  // Remote players
  // ---------------------------------------------------------------------------

  private addRemotePlayer(info: EntityInfo | any): void {
    if (!info) { console.warn('[addRemotePlayer] null info'); return; }
    if (this.remotePlayers.has(info.objectId)) { console.log(`[addRemotePlayer] skip duplicate obj=${info.objectId}`); return; }
    if (info.objectId === this.playerObjectId) { console.log(`[addRemotePlayer] skip self obj=${info.objectId}`); return; }
    // Don't add NPCs as remote players
    if (this.npcs.has(info.objectId)) { console.log(`[addRemotePlayer] skip NPC obj=${info.objectId}`); return; }
    console.log(`[addRemotePlayer] Creating player ${info.name} obj=${info.objectId} at (${info.position?.x}, ${info.position?.y})`);

    const gender = info.appearance?.gender ?? 0;
    const skinColor = info.appearance?.skinColor ?? 0;
    const hairStyle = info.appearance?.hairStyle ?? 0;
    const underwearColor = info.appearance?.underwearColor ?? 0;

    const gear = this.buildGearConfig(gender, skinColor, hairStyle, underwearColor);
    const dir = Math.max(0, (info.direction ?? 5) - 1);
    const state = PlayerState.IdlePeace;

    let assets: PlayerAssets | null = null;
    try {
      const layers = this.createPlayerLayers(gear, dir, state);
      assets = { layers, gear };
    } catch (err) {
      console.warn(`Failed to create sprites for remote player ${info.name}:`, err);
    }

    const px = info.position?.x ?? 0;
    const py = info.position?.y ?? 0;
    const worldX = px * TILE_SIZE;
    const worldY = py * TILE_SIZE;

    const nameText = this.add.text(worldX + TILE_SIZE / 2, worldY - 4, info.name || '???', {
      fontSize: '10px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5, 1);

    const rp: RemotePlayer = {
      objectId: info.objectId,
      name: info.name || '',
      tileX: px,
      tileY: py,
      visualX: worldX,
      visualY: worldY,
      direction: info.direction ?? 5,
      action: info.action ?? 0,
      assets,
      nameText,
      targetTileX: px,
      targetTileY: py,
      moveStartTime: 0,
      moveDuration: WALK_SPEED,
      moveStartX: worldX,
      moveStartY: worldY,
      isMoving: false,
      gender, skinColor, hairStyle, underwearColor,
    };

    if (assets) {
      this.setPlayerAssetsPosition(assets, worldX, worldY, rp.tileY);
    }
    nameText.setDepth(rp.tileY * DEPTH_MULTIPLIER + 50);

    this.remotePlayers.set(info.objectId, rp);
  }

  private removeRemotePlayer(objectId: number): void {
    const rp = this.remotePlayers.get(objectId);
    if (rp) {
      this.destroyPlayerAssets(rp.assets);
      rp.nameText.destroy();
      this.remotePlayers.delete(objectId);
    }
  }

  // ---------------------------------------------------------------------------
  // Network event handlers
  // ---------------------------------------------------------------------------

  private onMotionEvent(evt: MotionEvent): void {
    // Ignore NPC motion events - they come via MSG_NPC_MOTION
    if (evt.ownerType === 2) return;

    if (evt.objectId === this.playerObjectId) {
      // Server correction
      if (evt.action === 0) {
        this.tileX = evt.position.x;
        this.tileY = evt.position.y;
        this.visualX = evt.position.x * TILE_SIZE;
        this.visualY = evt.position.y * TILE_SIZE;
        this.isMoving = false;
        this.playerDirection = evt.direction;
        if (this.playerAssets) {
          this.playerState = PlayerState.IdlePeace;
          this.updatePlayerAnimation(this.playerAssets, PlayerState.IdlePeace, evt.direction - 1);
        }
      }
      return;
    }

    let rp = this.remotePlayers.get(evt.objectId);
    if (!rp) {
      this.addRemotePlayer({
        objectId: evt.objectId,
        name: evt.name,
        position: evt.position,
        direction: evt.direction,
        action: evt.action,
        appearance: evt.appearance,
      });
      rp = this.remotePlayers.get(evt.objectId);
    }

    if (rp) {
      rp.direction = evt.direction;
      rp.action = evt.action;

      if (evt.action === 1 || evt.action === 2) {
        // Walking or running - smooth interpolation
        rp.moveStartX = rp.visualX;
        rp.moveStartY = rp.visualY;
        rp.targetTileX = evt.position.x;
        rp.targetTileY = evt.position.y;
        rp.moveDuration = evt.speed || WALK_SPEED;
        rp.moveStartTime = this.time.now;
        rp.isMoving = true;

        if (rp.assets) {
          const spriteDir = Math.max(0, evt.direction - 1);
          const animState = evt.action === 2 ? PlayerState.Run : PlayerState.WalkPeace;
          this.updatePlayerAnimation(rp.assets, animState, spriteDir);
        }
      } else {
        // Stopped
        rp.tileX = evt.position.x;
        rp.tileY = evt.position.y;
        rp.visualX = evt.position.x * TILE_SIZE;
        rp.visualY = evt.position.y * TILE_SIZE;
        rp.isMoving = false;

        if (rp.assets) {
          const spriteDir = Math.max(0, evt.direction - 1);
          this.updatePlayerAnimation(rp.assets, PlayerState.IdlePeace, spriteDir);
        }
      }
    }
  }

  private onChatMessage(data: ChatMessageData): void {
    let worldX: number, worldY: number;

    if (data.objectId === this.playerObjectId) {
      worldX = this.visualX + TILE_SIZE / 2;
      worldY = this.visualY - 20;
    } else {
      const rp = this.remotePlayers.get(data.objectId);
      if (rp) {
        worldX = rp.visualX + TILE_SIZE / 2;
        worldY = rp.visualY - 20;
      } else {
        worldX = this.visualX + TILE_SIZE / 2;
        worldY = this.visualY - 60;
      }
    }

    const color = data.type === 1 ? '#FFD700' : data.type === 2 ? '#9b59b6' : '#ffffff';
    const chatText = this.add.text(worldX, worldY, `${data.senderName}: ${data.message}`, {
      fontSize: '11px', color,
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 },
      stroke: '#000000', strokeThickness: 1,
    }).setOrigin(0.5, 1).setDepth(10000);

    this.chatBubbles.push({ text: chatText, expiry: Date.now() + 5000, objectId: data.objectId });
  }

  // ---------------------------------------------------------------------------
  // Minimap
  // ---------------------------------------------------------------------------

  private createMinimap(): void {
    const MINIMAP_SIZE = 140;
    const padding = 10;

    // Create a container fixed to the camera
    this.minimapContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(20000);

    // Border background
    this.minimapBorder = this.add.graphics().setScrollFactor(0);
    this.minimapBorder.fillStyle(0x000000, 0.8);
    this.minimapBorder.fillRect(
      this.cameras.main.width - MINIMAP_SIZE - padding - 4,
      this.cameras.main.height - MINIMAP_SIZE - padding - 4,
      MINIMAP_SIZE + 8,
      MINIMAP_SIZE + 8,
    );
    this.minimapBorder.lineStyle(1, 0x888888, 1);
    this.minimapBorder.strokeRect(
      this.cameras.main.width - MINIMAP_SIZE - padding - 4,
      this.cameras.main.height - MINIMAP_SIZE - padding - 4,
      MINIMAP_SIZE + 8,
      MINIMAP_SIZE + 8,
    );
    this.minimapBorder.setDepth(20000);

    // Create a canvas texture for the minimap
    const canvas = document.createElement('canvas');
    canvas.width = this.mapWidth;
    canvas.height = this.mapHeight;
    const ctx = canvas.getContext('2d')!;

    // Terrain color mapping based on tile sprite IDs
    // These colors approximate the actual terrain types in Helbreath maps
    const getTerrainColor = (tileSprite: number, objSprite: number, blocked: boolean): [number, number, number] => {
      // Water tiles (sprite 19)
      if (tileSprite === 19) return [30, 60, 140];
      // Buildings/walls (blocked tiles with object sprites)
      if (blocked && objSprite > 0) return [90, 70, 55];
      // Blocked terrain (rocks, cliffs)
      if (blocked) return [70, 65, 55];
      // Road/path tiles (common road sprite IDs)
      if (tileSprite >= 10 && tileSprite <= 14) return [140, 130, 100];
      // Sand/desert tiles
      if (tileSprite >= 15 && tileSprite <= 18) return [160, 145, 95];
      // Snow/ice tiles
      if (tileSprite >= 22 && tileSprite <= 25) return [190, 200, 210];
      // Dark ground/dungeon tiles
      if (tileSprite >= 26 && tileSprite <= 30) return [50, 45, 40];
      // Farmland
      if (tileSprite >= 5 && tileSprite <= 9) return [65, 100, 40];
      // Default grass (most common)
      if (tileSprite >= 1 && tileSprite <= 4) return [45, 95, 35];
      // Trees/dense objects on walkable ground
      if (objSprite > 0 && !blocked) return [30, 75, 25];
      // Fallback walkable
      if (!blocked) return [50, 90, 40];
      // Fallback blocked
      return [60, 55, 50];
    };

    // Draw terrain using tile sprite data from the loaded map
    const imageData = ctx.createImageData(this.mapWidth, this.mapHeight);
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const idx = y * this.mapWidth + x;
        const byteIdx = Math.floor(idx / 8);
        const bitIdx = idx % 8;
        const blocked = byteIdx < this.collisionGrid.length && (this.collisionGrid[byteIdx] & (1 << bitIdx)) !== 0;

        // Get tile sprite data from the loaded HBMap if available
        let tileSprite = 0;
        let objSprite = 0;
        if (this.hbMap && this.hbMap.tiles && y < this.hbMap.tiles.length && x < this.hbMap.tiles[y].length) {
          const tile = this.hbMap.tiles[y][x];
          tileSprite = tile.sprite;
          objSprite = tile.objectSprite;
        }

        const [r, g, b] = getTerrainColor(tileSprite, objSprite, blocked);
        const pixelIdx = (y * this.mapWidth + x) * 4;
        imageData.data[pixelIdx] = r;
        imageData.data[pixelIdx + 1] = g;
        imageData.data[pixelIdx + 2] = b;
        imageData.data[pixelIdx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Add the minimap texture
    const texKey = 'minimap-' + this.currentMapName;
    if (this.textures.exists(texKey)) this.textures.remove(texKey);
    this.textures.addCanvas(texKey, canvas);

    const minimapX = this.cameras.main.width - MINIMAP_SIZE - padding;
    const minimapY = this.cameras.main.height - MINIMAP_SIZE - padding;

    const minimapImg = this.add.image(minimapX, minimapY, texKey)
      .setOrigin(0, 0)
      .setDisplaySize(MINIMAP_SIZE, MINIMAP_SIZE)
      .setScrollFactor(0)
      .setDepth(20001);

    // Player dot
    this.minimapPlayerDot = this.add.graphics().setScrollFactor(0).setDepth(20002);

    this.minimapContainer.add([minimapImg]);
  }

  private updateMinimapDot(): void {
    if (!this.minimapPlayerDot) return;

    const MINIMAP_SIZE = 140;
    const padding = 10;

    this.minimapPlayerDot.clear();

    // Player dot (white)
    const dotX = this.cameras.main.width - MINIMAP_SIZE - padding + (this.tileX / this.mapWidth) * MINIMAP_SIZE;
    const dotY = this.cameras.main.height - MINIMAP_SIZE - padding + (this.tileY / this.mapHeight) * MINIMAP_SIZE;
    this.minimapPlayerDot.fillStyle(0xffffff, 1);
    this.minimapPlayerDot.fillCircle(dotX, dotY, 2);

    // Remote player dots (cyan)
    for (const rp of this.remotePlayers.values()) {
      const rpX = this.cameras.main.width - MINIMAP_SIZE - padding + (rp.tileX / this.mapWidth) * MINIMAP_SIZE;
      const rpY = this.cameras.main.height - MINIMAP_SIZE - padding + (rp.tileY / this.mapHeight) * MINIMAP_SIZE;
      this.minimapPlayerDot.fillStyle(0x00ffff, 1);
      this.minimapPlayerDot.fillCircle(rpX, rpY, 1.5);
    }
  }

  // ---------------------------------------------------------------------------
  // NPC management
  // ---------------------------------------------------------------------------

  private addNPC(data: EntityInfo | NpcAppearData | any): void {
    if (!data) { console.warn('[addNPC] null data'); return; }
    if (this.npcs.has(data.objectId)) { console.log(`[addNPC] skip duplicate obj=${data.objectId}`); return; }
    console.log(`[addNPC] Creating NPC ${data.name} obj=${data.objectId} type=${data.npcType} at (${data.position?.x}, ${data.position?.y})`);

    const px = data.position?.x ?? 0;
    const py = data.position?.y ?? 0;
    const worldX = px * TILE_SIZE;
    const worldY = py * TILE_SIZE;
    const npcTypeId = data.npcType ?? 1;
    const dir = data.direction ?? 5;

    // Try to create a GameAsset with the monster sprite
    const spriteName = NPC_SPRITE_MAP[npcTypeId];
    let asset: GameAsset | null = null;
    let fallbackSprite: Phaser.GameObjects.Ellipse | null = null;

    if (spriteName) {
      // Monster sprites have sprite sheet 0 with directional frames
      const textureKey = `${spriteName}-0`;
      if (this.textures.exists(textureKey)) {
        try {
          asset = new GameAsset(this, {
            x: worldX,
            y: worldY,
            spriteName: spriteName,
            spriteSheetIndex: 0,
            direction: Math.max(0, dir - 1), // convert 1-8 to 0-7
            framesPerDirection: 8,
            frameRate: 6,
            animationType: AnimationType.DirectionalSubFrame,
          });
          asset.setDepth(py * DEPTH_MULTIPLIER + 1);
        } catch (err) {
          console.warn(`Failed to create NPC sprite for type ${npcTypeId} (${spriteName}):`, err);
          asset = null;
        }
      }
    }

    // Fallback to colored ellipse if sprite creation failed
    if (!asset) {
      const color = NPC_COLORS[npcTypeId] ?? 0xff00ff;
      fallbackSprite = this.add.ellipse(worldX + TILE_SIZE / 2, worldY + TILE_SIZE / 2, 24, 24, color, 0.9)
        .setDepth(py * DEPTH_MULTIPLIER + 1);
    }

    const nameText = this.add.text(worldX + TILE_SIZE / 2, worldY - 2, data.name || 'NPC', {
      fontSize: '9px', color: '#ff6666',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(py * DEPTH_MULTIPLIER + 50);

    const hpBar = this.add.graphics().setDepth(py * DEPTH_MULTIPLIER + 51);

    const npcEntity: GameNPC = {
      objectId: data.objectId,
      name: data.name || 'NPC',
      npcType: npcTypeId,
      tileX: px,
      tileY: py,
      visualX: worldX,
      visualY: worldY,
      direction: dir,
      action: data.action ?? 0,
      hp: -1, // unknown until hit
      maxHp: -1,
      asset,
      fallbackSprite,
      nameText,
      hpBar,
      targetTileX: px,
      targetTileY: py,
      moveStartTime: 0,
      moveDuration: 800,
      moveStartX: worldX,
      moveStartY: worldY,
      isMoving: false,
    };

    this.npcs.set(data.objectId, npcEntity);
  }

  private removeNPC(objectId: number): void {
    const npcEntity = this.npcs.get(objectId);
    if (npcEntity) {
      if (npcEntity.asset) npcEntity.asset.destroy();
      if (npcEntity.fallbackSprite) npcEntity.fallbackSprite.destroy();
      npcEntity.nameText.destroy();
      npcEntity.hpBar.destroy();
      this.npcs.delete(objectId);
    }
  }

  private updateNPCMovement(npcEntity: GameNPC, time: number): void {
    if (!npcEntity.isMoving) {
      npcEntity.visualX = npcEntity.tileX * TILE_SIZE;
      npcEntity.visualY = npcEntity.tileY * TILE_SIZE;
      return;
    }

    const elapsed = time - npcEntity.moveStartTime;
    const t = Math.min(elapsed / npcEntity.moveDuration, 1);

    npcEntity.visualX = npcEntity.moveStartX + (npcEntity.targetTileX * TILE_SIZE - npcEntity.moveStartX) * t;
    npcEntity.visualY = npcEntity.moveStartY + (npcEntity.targetTileY * TILE_SIZE - npcEntity.moveStartY) * t;

    if (t >= 1) {
      npcEntity.isMoving = false;
      npcEntity.tileX = npcEntity.targetTileX;
      npcEntity.tileY = npcEntity.targetTileY;
      npcEntity.visualX = npcEntity.tileX * TILE_SIZE;
      npcEntity.visualY = npcEntity.tileY * TILE_SIZE;
    }
  }

  private updateNPCPosition(npcEntity: GameNPC): void {
    const cx = npcEntity.visualX + TILE_SIZE / 2;
    const cy = npcEntity.visualY + TILE_SIZE / 2;
    const baseDepth = npcEntity.tileY * DEPTH_MULTIPLIER + 1;

    if (npcEntity.asset) {
      npcEntity.asset.setPosition(npcEntity.visualX, npcEntity.visualY);
      npcEntity.asset.setDepth(baseDepth);
    } else if (npcEntity.fallbackSprite) {
      npcEntity.fallbackSprite.setPosition(cx, cy);
      npcEntity.fallbackSprite.setDepth(baseDepth);
    }

    npcEntity.nameText.setPosition(cx, npcEntity.visualY - 2);
    npcEntity.nameText.setDepth(npcEntity.tileY * DEPTH_MULTIPLIER + 50);

    // Draw HP bar if we know HP
    npcEntity.hpBar.clear();
    if (npcEntity.hp >= 0 && npcEntity.maxHp > 0) {
      const barWidth = 28;
      const barHeight = 3;
      const barX = cx - barWidth / 2;
      const barY = npcEntity.visualY - 6;
      // Background
      npcEntity.hpBar.fillStyle(0x333333, 0.8);
      npcEntity.hpBar.fillRect(barX, barY, barWidth, barHeight);
      // HP fill
      const ratio = Math.max(0, npcEntity.hp / npcEntity.maxHp);
      const fillColor = ratio > 0.5 ? 0x44ff44 : ratio > 0.25 ? 0xffff00 : 0xff4444;
      npcEntity.hpBar.fillStyle(fillColor, 0.9);
      npcEntity.hpBar.fillRect(barX, barY, barWidth * ratio, barHeight);
      npcEntity.hpBar.setDepth(npcEntity.tileY * DEPTH_MULTIPLIER + 51);
    }
  }

  private onNpcMotion(data: NpcMotionData): void {
    const npcEntity = this.npcs.get(data.objectId);
    if (!npcEntity) return;

    if (data.action === 1) {
      // Movement
      npcEntity.moveStartX = npcEntity.visualX;
      npcEntity.moveStartY = npcEntity.visualY;
      npcEntity.targetTileX = data.position?.x ?? npcEntity.tileX;
      npcEntity.targetTileY = data.position?.y ?? npcEntity.tileY;
      npcEntity.moveDuration = data.speed || 800;
      npcEntity.moveStartTime = this.time.now;
      npcEntity.isMoving = true;
      npcEntity.direction = data.direction;

      // Update sprite animation direction
      if (npcEntity.asset && data.direction >= 1 && data.direction <= 8) {
        const spriteName = NPC_SPRITE_MAP[npcEntity.npcType];
        if (spriteName) {
          const animKey = `${spriteName}-0`;
          npcEntity.asset.playAnimationWithDirection(
            animKey, data.direction - 1, 6, undefined, undefined, 8,
            AnimationType.DirectionalSubFrame,
          );
        }
      }
    } else {
      npcEntity.tileX = data.position?.x ?? npcEntity.tileX;
      npcEntity.tileY = data.position?.y ?? npcEntity.tileY;
      npcEntity.isMoving = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Combat
  // ---------------------------------------------------------------------------

  private handleAttackClick(pointer: Phaser.Input.Pointer): void {
    const now = this.time.now;
    if (now - this.lastAttackTime < this.attackCooldown) return;

    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

    // Find nearest NPC within 2 tiles
    let closestNPC: GameNPC | null = null;
    let closestDist = Infinity;

    for (const npcEntity of this.npcs.values()) {
      const npcCenterX = npcEntity.visualX + TILE_SIZE / 2;
      const npcCenterY = npcEntity.visualY + TILE_SIZE / 2;
      const dx = worldPoint.x - npcCenterX;
      const dy = worldPoint.y - npcCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestDist = dist;
        closestNPC = npcEntity;
      }
    }

    if (!closestNPC) return;

    // Check if NPC is within attack range (2 tiles)
    const tileDist = Math.max(
      Math.abs(this.tileX - closestNPC.tileX),
      Math.abs(this.tileY - closestNPC.tileY),
    );
    if (tileDist > 2) return;

    this.lastAttackTime = now;

    // If a spell is selected, cast it instead of melee attacking
    if (this.selectedSpellId > 0) {
      this.castSpellOnTarget(closestNPC.objectId, closestNPC.tileX, closestNPC.tileY);
      return;
    }

    // Face the NPC
    const dir = this.angleToDirection(
      closestNPC.tileX * TILE_SIZE - this.visualX,
      closestNPC.tileY * TILE_SIZE - this.visualY,
    );

    this.playerDirection = dir;

    // Play attack animation
    if (this.playerAssets) {
      this.playerState = PlayerState.MeleeAttack;
      this.updatePlayerAnimation(this.playerAssets, PlayerState.MeleeAttack, dir - 1);

      // Return to idle after attack animation
      setTimeout(() => {
        if (this.playerState === PlayerState.MeleeAttack && this.playerAssets) {
          this.playerState = PlayerState.IdlePeace;
          this.updatePlayerAnimation(this.playerAssets, PlayerState.IdlePeace, this.playerDirection - 1);
        }
      }, 600);
    }

    // Send attack to server
    this.msgHandler.sendMessage(Proto.MSG_ATTACK_REQUEST, {
      direction: dir,
      action: 3,
      position: { x: this.tileX, y: this.tileY },
      targetId: closestNPC.objectId,
    });
  }

  private onDamageEvent(data: DamageEventData): void {
    // Update NPC HP if target is NPC
    if (data.targetType === 2) {
      const npcEntity = this.npcs.get(data.targetId);
      if (npcEntity) {
        npcEntity.hp = data.targetHp;
        npcEntity.maxHp = data.targetMaxHp;
      }
    }

    // Show floating damage number
    let targetX: number, targetY: number;
    if (data.targetType === 2) {
      const npcEntity = this.npcs.get(data.targetId);
      if (npcEntity) {
        targetX = npcEntity.visualX + TILE_SIZE / 2;
        targetY = npcEntity.visualY - 10;
      } else {
        return;
      }
    } else {
      if (data.targetId === this.playerObjectId) {
        targetX = this.visualX + TILE_SIZE / 2;
        targetY = this.visualY - 10;
      } else {
        const rp = this.remotePlayers.get(data.targetId);
        if (rp) {
          targetX = rp.visualX + TILE_SIZE / 2;
          targetY = rp.visualY - 10;
        } else {
          return;
        }
      }
    }

    const text = data.miss ? 'MISS' : (data.critical ? `${data.damage}!` : `${data.damage}`);
    const color = data.miss ? '#aaaaaa' : (data.critical ? '#ff4444' : '#ffffff');
    const fontSize = data.critical ? '14px' : '12px';

    const dmgText = this.add.text(targetX, targetY, text, {
      fontSize, color,
      stroke: '#000000', strokeThickness: 2,
      fontStyle: data.critical ? 'bold' : 'normal',
    }).setOrigin(0.5, 1).setDepth(30000);

    // Float up and fade
    this.tweens.add({
      targets: dmgText,
      y: targetY - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => dmgText.destroy(),
    });
  }

  private onStatUpdate(data: StatUpdateData): void {
    this.playerHP = data.hp;
    this.playerMaxHP = data.maxHp;
    this.playerMP = data.mp;
    this.playerMaxMP = data.maxMp;
    this.playerSP = data.sp;
    this.playerMaxSP = data.maxSp;
    this.playerLevel = data.level;
    this.playerExp = data.experience ?? 0;
    this.playerGold = data.gold ?? 0;
    this.playerLUPool = data.luPool ?? this.playerLUPool;
    this.playerSTR = data.str ?? this.playerSTR;
    this.playerVIT = data.vit ?? this.playerVIT;
    this.playerDEX = data.dex ?? this.playerDEX;
    this.playerINT = data.intStat ?? this.playerINT;
    this.playerMAG = data.mag ?? this.playerMAG;
    this.playerCHR = data.charisma ?? this.playerCHR;

    // Update HUD
    this.updateHUD();
  }

  private onDeathEvent(data: DeathEventData): void {
    if (data.objectType === 2) {
      // NPC died - flash and remove
      const npcEntity = this.npcs.get(data.objectId);
      if (npcEntity) {
        if (npcEntity.asset) {
          npcEntity.asset.setAlpha(0.3);
        } else if (npcEntity.fallbackSprite) {
          npcEntity.fallbackSprite.setFillStyle(0xff0000, 0.5);
        }
        this.time.delayedCall(500, () => {
          this.removeNPC(data.objectId);
        });
      }
      return;
    }

    if (data.objectId === this.playerObjectId) {
      this.isDead = true;
      this.isMouseDown = false;

      // Show death message
      const deathText = this.add.text(
        this.cameras.main.width / 2, this.cameras.main.height / 2,
        `You were killed by ${data.killerName}\nRespawning...`,
        { fontSize: '20px', color: '#ff4444', align: 'center', stroke: '#000', strokeThickness: 3 },
      ).setOrigin(0.5).setScrollFactor(0).setDepth(50000);

      this.time.delayedCall(3000, () => deathText.destroy());
    }
  }

  private onRespawnEvent(data: RespawnEventData): void {
    this.isDead = false;
    this.tileX = data.position.x;
    this.tileY = data.position.y;
    this.visualX = data.position.x * TILE_SIZE;
    this.visualY = data.position.y * TILE_SIZE;
    this.isMoving = false;
    this.playerHP = data.hp;
    this.playerMP = data.mp;
    this.playerSP = data.sp;

    if (this.playerAssets) {
      this.playerState = PlayerState.IdlePeace;
      this.updatePlayerAnimation(this.playerAssets, PlayerState.IdlePeace, this.playerDirection - 1);
    }

    this.updateHUD();
  }

  private onNotification(data: any): void {
    const log = document.getElementById('chat-log');
    if (log) {
      const line = document.createElement('div');
      line.textContent = `[SYSTEM] ${data.message}`;
      line.style.color = '#FFD700';
      line.style.fontWeight = 'bold';
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    }
  }

  private updateHUD(): void {
    // Text values
    const hpEl = document.getElementById('hud-hp');
    const mpEl = document.getElementById('hud-mp');
    const spEl = document.getElementById('hud-sp');
    const lvlEl = document.getElementById('hud-level');
    const goldEl = document.getElementById('hud-gold');
    const luEl = document.getElementById('hud-lupool');
    const coordsEl = document.getElementById('hud-coords');

    if (hpEl) hpEl.textContent = `${this.playerHP}/${this.playerMaxHP}`;
    if (mpEl) mpEl.textContent = `${this.playerMP}/${this.playerMaxMP}`;
    if (spEl) spEl.textContent = `${this.playerSP}/${this.playerMaxSP}`;
    if (lvlEl) lvlEl.textContent = `Lv.${this.playerLevel}`;
    if (goldEl) goldEl.textContent = `${this.playerGold} G`;
    if (coordsEl) coordsEl.textContent = `${this.tileX},${this.tileY}`;
    if (luEl) {
      if (this.playerLUPool > 0) {
        luEl.style.display = 'block';
        luEl.textContent = `+${this.playerLUPool} pts`;
      } else {
        luEl.style.display = 'none';
      }
    }

    // Bar widths
    const hpBar = document.getElementById('hud-hp-bar');
    const mpBar = document.getElementById('hud-mp-bar');
    const spBar = document.getElementById('hud-sp-bar');
    if (hpBar) hpBar.style.width = `${this.playerMaxHP > 0 ? Math.round((this.playerHP / this.playerMaxHP) * 100) : 0}%`;
    if (mpBar) mpBar.style.width = `${this.playerMaxMP > 0 ? Math.round((this.playerMP / this.playerMaxMP) * 100) : 0}%`;
    if (spBar) spBar.style.width = `${this.playerMaxSP > 0 ? Math.round((this.playerSP / this.playerMaxSP) * 100) : 0}%`;
  }

  // ---------------------------------------------------------------------------
  // Chat UI
  // ---------------------------------------------------------------------------

  private createChatUI(): void {
    const chatHtml = `
      <div id="chat-container" style="position:fixed; bottom:68px; left:10px; z-index:100;">
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
        let type = 0;
        let target = '';
        let text = msg;

        if (msg.startsWith('!')) {
          type = 1;
          text = msg.slice(1).trim();
        } else if (msg.startsWith('@')) {
          type = 2;
          const spaceIdx = msg.indexOf(' ');
          if (spaceIdx > 0) {
            target = msg.slice(1, spaceIdx);
            text = msg.slice(spaceIdx + 1).trim();
          }
        }

        if (text) {
          this.msgHandler.sendMessage(Proto.MSG_CHAT_REQUEST, { type, message: text, target });
          const log = document.getElementById('chat-log');
          if (log) {
            const line = document.createElement('div');
            line.textContent = `${this.playerName}: ${text}`;
            log.appendChild(line);
            log.scrollTop = log.scrollHeight;
          }
        }
        chatInput.value = '';
        e.stopPropagation();
      }
    });

    chatInput.addEventListener('focus', () => { this.input.keyboard!.enabled = false; });
    chatInput.addEventListener('blur', () => { this.input.keyboard!.enabled = true; });

    this.msgHandler.on(Proto.MSG_CHAT_MESSAGE, (data: ChatMessageData) => {
      if (data.objectId === this.playerObjectId) return;
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

    this.events.on('shutdown', () => { div.remove(); });
  }

  // ---------------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------------

  private createHUD(playerData: any): void {
    const hudHtml = `
      <div id="hud-bar" style="
        position:fixed; bottom:0; left:0; right:0; z-index:100;
        height:60px; background:linear-gradient(to bottom, #2a2a2a, #1a1a1a);
        border-top:2px solid #444; display:flex; align-items:center;
        padding:0 10px; gap:8px; font-family:'Segoe UI',Arial,sans-serif;
        user-select:none;
      ">
        <!-- Player info -->
        <div style="display:flex; flex-direction:column; min-width:100px; margin-right:4px;">
          <div style="color:#FFD700; font-size:12px; font-weight:bold;">${playerData.name}</div>
          <div id="hud-level" style="color:#aaa; font-size:10px;">Lv.${playerData.level}</div>
          <div id="hud-map" style="color:#777; font-size:9px;">Map: ${playerData.mapName}</div>
        </div>

        <!-- HP/MP/SP Bars -->
        <div style="display:flex; flex-direction:column; gap:3px; min-width:180px; flex:1; max-width:280px;">
          <!-- HP Bar -->
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="color:#e74c3c; font-size:10px; font-weight:bold; width:18px;">HP</span>
            <div style="flex:1; height:12px; background:#333; border:1px solid #555; border-radius:2px; position:relative; overflow:hidden;">
              <div id="hud-hp-bar" style="height:100%; background:linear-gradient(to bottom,#e74c3c,#c0392b); width:${Math.round((playerData.hp/playerData.maxHp)*100)}%; transition:width 0.3s;"></div>
            </div>
            <span id="hud-hp" style="color:#e74c3c; font-size:9px; min-width:55px; text-align:right;">${playerData.hp}/${playerData.maxHp}</span>
          </div>
          <!-- MP Bar -->
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="color:#3498db; font-size:10px; font-weight:bold; width:18px;">MP</span>
            <div style="flex:1; height:12px; background:#333; border:1px solid #555; border-radius:2px; position:relative; overflow:hidden;">
              <div id="hud-mp-bar" style="height:100%; background:linear-gradient(to bottom,#3498db,#2980b9); width:${Math.round((playerData.mp/playerData.maxMp)*100)}%; transition:width 0.3s;"></div>
            </div>
            <span id="hud-mp" style="color:#3498db; font-size:9px; min-width:55px; text-align:right;">${playerData.mp}/${playerData.maxMp}</span>
          </div>
          <!-- SP Bar -->
          <div style="display:flex; align-items:center; gap:4px;">
            <span style="color:#2ecc71; font-size:10px; font-weight:bold; width:18px;">SP</span>
            <div style="flex:1; height:12px; background:#333; border:1px solid #555; border-radius:2px; position:relative; overflow:hidden;">
              <div id="hud-sp-bar" style="height:100%; background:linear-gradient(to bottom,#2ecc71,#27ae60); width:${Math.round((playerData.sp/playerData.maxSp)*100)}%; transition:width 0.3s;"></div>
            </div>
            <span id="hud-sp" style="color:#2ecc71; font-size:9px; min-width:55px; text-align:right;">${playerData.sp}/${playerData.maxSp}</span>
          </div>
        </div>

        <!-- Gold & Stat Points -->
        <div style="display:flex; flex-direction:column; gap:2px; min-width:70px; margin:0 4px;">
          <div id="hud-gold" style="color:#FFD700; font-size:11px;">${playerData.gold ?? 0} G</div>
          <div id="hud-lupool" style="color:#9b59b6; font-size:10px; display:none;">+0 pts</div>
          <div style="color:#555; font-size:8px;">Coords: <span id="hud-coords">${playerData.posX ?? 0},${playerData.posY ?? 0}</span></div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; gap:3px; margin-left:auto;">
          <button id="btn-inventory" class="hud-btn" title="Inventory (I)">
            <div style="font-size:16px;">&#x1F392;</div><div style="font-size:8px;">Bag</div>
          </button>
          <button id="btn-stats" class="hud-btn" title="Stats (C)">
            <div style="font-size:16px;">&#x1F4CA;</div><div style="font-size:8px;">Stats</div>
          </button>
          <button id="btn-spells" class="hud-btn" title="Spells (M)">
            <div style="font-size:16px;">&#x2728;</div><div style="font-size:8px;">Magic</div>
          </button>
          <button id="btn-skills" class="hud-btn" title="Skills (K)">
            <div style="font-size:16px;">&#x2694;</div><div style="font-size:8px;">Skills</div>
          </button>
          <button id="btn-guild" class="hud-btn" title="Guild (G)">
            <div style="font-size:16px;">&#x1F3F0;</div><div style="font-size:8px;">Guild</div>
          </button>
          <button id="btn-party" class="hud-btn" title="Party (P)">
            <div style="font-size:16px;">&#x1F465;</div><div style="font-size:8px;">Party</div>
          </button>
        </div>
      </div>
      <style>
        .hud-btn {
          width:42px; height:42px; display:flex; flex-direction:column;
          align-items:center; justify-content:center; cursor:pointer;
          background:linear-gradient(to bottom,#3a3a3a,#252525);
          border:1px solid #555; border-radius:4px; color:#ccc;
          padding:2px; transition:all 0.15s;
        }
        .hud-btn:hover { background:linear-gradient(to bottom,#4a4a4a,#353535); color:#fff; border-color:#777; }
        .hud-btn:active { background:#222; transform:scale(0.95); }
      </style>
    `;
    const div = document.createElement('div');
    div.innerHTML = hudHtml;
    document.body.appendChild(div);

    document.getElementById('btn-inventory')?.addEventListener('click', () => this.toggleInventory());
    document.getElementById('btn-stats')?.addEventListener('click', () => this.toggleStats());
    document.getElementById('btn-spells')?.addEventListener('click', () => this.toggleSpellBar());
    document.getElementById('btn-skills')?.addEventListener('click', () => this.toggleSkills());
    document.getElementById('btn-guild')?.addEventListener('click', () => this.toggleGuild());
    document.getElementById('btn-party')?.addEventListener('click', () => this.toggleParty());

    this.events.on('shutdown', () => { div.remove(); });
  }

  // ---------------------------------------------------------------------------
  // Inventory UI
  // ---------------------------------------------------------------------------

  private onInventoryUpdate(data: InventoryUpdateData): void {
    this.inventoryItems = data.items || [];
    this.equipmentItems = data.equipment || [];
    if (data.gold !== undefined) this.playerGold = Number(data.gold);
    this.updateHUD();
    if (this.inventoryOpen) this.renderInventoryUI();
  }

  private toggleInventory(): void {
    if (this.shopOpen) return; // don't open inventory while in shop
    this.inventoryOpen = !this.inventoryOpen;
    if (this.inventoryOpen) {
      this.renderInventoryUI();
    } else {
      this.closeInventoryUI();
    }
  }

  private renderInventoryUI(): void {
    this.closeInventoryUI();
    const div = document.createElement('div');
    div.id = 'inventory-panel';
    div.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:200; background:rgba(20,20,30,0.95); color:#fff; padding:15px; font-size:12px; min-width:420px; border:1px solid #555; border-radius:4px;';

    let html = '<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><strong>Inventory</strong><button id="inv-close" style="cursor:pointer;">X</button></div>';

    // Equipment section
    html += '<div style="margin-bottom:10px; padding:8px; background:rgba(0,0,0,0.3); border-radius:3px;"><div style="color:#aaa; margin-bottom:5px;">Equipment</div>';
    const slotNames = ['', 'Weapon', 'Shield', 'Helm', 'Body', 'Legs', 'Boots', 'Cape'];
    for (let i = 1; i <= 7; i++) {
      const eq = this.equipmentItems.find(e => e.slotIndex === i);
      if (eq) {
        html += `<div style="display:flex; justify-content:space-between; padding:2px 0;"><span style="color:#3498db;">[${slotNames[i]}] ${eq.name}</span>`;
        html += `<button class="unequip-btn" data-slot="${i}" style="font-size:10px; cursor:pointer;">Unequip</button></div>`;
        if (eq.maxDurability > 0) {
          html += `<div style="font-size:10px; color:#888; padding-left:10px;">Durability: ${eq.durability}/${eq.maxDurability}</div>`;
        }
      } else {
        html += `<div style="color:#555; padding:2px 0;">[${slotNames[i]}] Empty</div>`;
      }
    }
    html += '</div>';

    // Inventory grid
    html += '<div style="max-height:250px; overflow-y:auto;">';
    if (this.inventoryItems.length === 0) {
      html += '<div style="color:#666; text-align:center; padding:20px;">Empty</div>';
    }
    for (const item of this.inventoryItems) {
      html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:3px 5px; border-bottom:1px solid #333;">`;
      html += `<span>${item.name} ${item.count > 1 ? 'x' + item.count : ''}</span>`;
      html += `<span style="display:flex; gap:3px;">`;
      // Show durability for equipment
      if (item.maxDurability > 0) {
        html += `<span style="font-size:10px; color:#888;">${item.durability}/${item.maxDurability}</span>`;
      }
      html += `<button class="use-btn" data-slot="${item.slotIndex}" style="font-size:10px; cursor:pointer;">Use</button>`;
      html += `<button class="equip-btn" data-slot="${item.slotIndex}" style="font-size:10px; cursor:pointer;">Equip</button>`;
      html += `<button class="drop-btn" data-slot="${item.slotIndex}" style="font-size:10px; cursor:pointer;">Drop</button>`;
      html += `</span></div>`;
    }
    html += '</div>';
    html += `<div style="margin-top:8px; color:#FFD700; font-size:11px;">Gold: ${this.playerGold}</div>`;

    div.innerHTML = html;
    document.body.appendChild(div);
    this.inventoryDiv = div;

    // Event handlers
    div.querySelector('#inv-close')?.addEventListener('click', () => this.toggleInventory());
    div.querySelectorAll('.use-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt((btn as HTMLElement).dataset.slot || '0');
        this.msgHandler.sendMessage(Proto.MSG_ITEM_USE_REQUEST, { slotIndex: slot });
      });
    });
    div.querySelectorAll('.equip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt((btn as HTMLElement).dataset.slot || '0');
        this.msgHandler.sendMessage(Proto.MSG_ITEM_EQUIP_REQUEST, { slotIndex: slot, equipSlot: 0 });
      });
    });
    div.querySelectorAll('.drop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt((btn as HTMLElement).dataset.slot || '0');
        this.msgHandler.sendMessage(Proto.MSG_ITEM_DROP_REQUEST, { slotIndex: slot, count: 1 });
      });
    });
    div.querySelectorAll('.unequip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const eqSlot = parseInt((btn as HTMLElement).dataset.slot || '0');
        this.msgHandler.sendMessage(Proto.MSG_ITEM_EQUIP_REQUEST, { slotIndex: -1, equipSlot: eqSlot });
      });
    });
  }

  private closeInventoryUI(): void {
    if (this.inventoryDiv) {
      this.inventoryDiv.remove();
      this.inventoryDiv = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Ground Items
  // ---------------------------------------------------------------------------

  private onGroundItemAppear(data: GroundItemAppearData): void {
    if (this.groundItems.has(data.groundId)) return;

    const worldX = data.position.x * TILE_SIZE + TILE_SIZE / 2;
    const worldY = data.position.y * TILE_SIZE + TILE_SIZE / 2;

    const sprite = this.add.rectangle(worldX, worldY, 12, 12, 0xFFD700, 0.8)
      .setDepth(data.position.y * DEPTH_MULTIPLIER + 1)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(worldX, worldY - 14, data.count > 1 ? `${data.name} x${data.count}` : data.name, {
      fontSize: '9px', color: '#FFD700',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(data.position.y * DEPTH_MULTIPLIER + 2);

    sprite.on('pointerdown', () => {
      this.msgHandler.sendMessage(Proto.MSG_ITEM_PICKUP_REQUEST, { groundId: data.groundId });
    });

    this.groundItems.set(data.groundId, {
      groundId: data.groundId,
      itemId: data.itemId,
      name: data.name,
      count: data.count,
      x: data.position.x,
      y: data.position.y,
      sprite,
      label,
    });
  }

  private onGroundItemDisappear(data: GroundItemDisappearData): void {
    const gi = this.groundItems.get(data.groundId);
    if (gi) {
      gi.sprite.destroy();
      gi.label.destroy();
      this.groundItems.delete(data.groundId);
    }
  }

  // ---------------------------------------------------------------------------
  // Shop UI
  // ---------------------------------------------------------------------------

  private onShopOpen(data: ShopOpenData): void {
    this.currentShopNpcId = data.npcId;
    this.currentShopItems = data.items || [];
    this.shopOpen = true;
    this.renderShopUI(data.shopName);
  }

  private onShopResponse(data: ShopResponseData): void {
    if (!data.success && data.error) {
      this.onNotification({ message: data.error, type: 2 });
    }
  }

  private renderShopUI(shopName: string): void {
    this.closeShopUI();
    const div = document.createElement('div');
    div.id = 'shop-panel';
    div.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:200; background:rgba(20,20,30,0.95); color:#fff; padding:15px; font-size:12px; min-width:380px; border:1px solid #555; border-radius:4px;';

    let html = `<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><strong>${shopName}</strong><button id="shop-close" style="cursor:pointer;">X</button></div>`;
    html += `<div style="color:#FFD700; margin-bottom:8px;">Your Gold: ${this.playerGold}</div>`;

    // Buy section
    html += '<div style="margin-bottom:10px;"><div style="color:#3498db; margin-bottom:5px;">Buy Items:</div>';
    html += '<div style="max-height:200px; overflow-y:auto;">';
    for (const item of this.currentShopItems) {
      html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:3px 5px; border-bottom:1px solid #333;">`;
      html += `<span>${item.name}</span>`;
      html += `<span><span style="color:#FFD700;">${item.price}g</span> <button class="buy-btn" data-id="${item.itemId}" style="font-size:10px; cursor:pointer; margin-left:5px;">Buy</button></span>`;
      html += `</div>`;
    }
    html += '</div></div>';

    // Sell section
    html += '<div><div style="color:#e74c3c; margin-bottom:5px;">Sell Items (40% value):</div>';
    html += '<div style="max-height:150px; overflow-y:auto;">';
    for (const item of this.inventoryItems) {
      const sellPrice = Math.max(1, Math.floor((item as any).price * 0.4 || 1));
      html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:3px 5px; border-bottom:1px solid #333;">`;
      html += `<span>${item.name} ${item.count > 1 ? 'x' + item.count : ''}</span>`;
      html += `<button class="sell-btn" data-slot="${item.slotIndex}" style="font-size:10px; cursor:pointer;">Sell</button>`;
      html += `</div>`;
    }
    if (this.inventoryItems.length === 0) {
      html += '<div style="color:#666; text-align:center; padding:10px;">No items to sell</div>';
    }
    html += '</div></div>';

    div.innerHTML = html;
    document.body.appendChild(div);
    this.shopDiv = div;

    div.querySelector('#shop-close')?.addEventListener('click', () => this.closeShop());
    div.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = parseInt((btn as HTMLElement).dataset.id || '0');
        this.msgHandler.sendMessage(Proto.MSG_SHOP_BUY_REQUEST, {
          npcId: this.currentShopNpcId, itemId, count: 1,
        });
      });
    });
    div.querySelectorAll('.sell-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt((btn as HTMLElement).dataset.slot || '0');
        this.msgHandler.sendMessage(Proto.MSG_SHOP_SELL_REQUEST, {
          npcId: this.currentShopNpcId, slotIndex: slot, count: 1,
        });
      });
    });
  }

  private closeShop(): void {
    this.shopOpen = false;
    this.closeShopUI();
  }

  private closeShopUI(): void {
    if (this.shopDiv) {
      this.shopDiv.remove();
      this.shopDiv = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Stats / Stat Allocation UI
  // ---------------------------------------------------------------------------

  private toggleStats(): void {
    const existing = document.getElementById('stats-panel');
    if (existing) {
      existing.remove();
      return;
    }
    this.renderStatsUI();
  }

  private renderStatsUI(): void {
    const old = document.getElementById('stats-panel');
    if (old) old.remove();

    const div = document.createElement('div');
    div.id = 'stats-panel';
    div.style.cssText = 'position:fixed; top:50%; right:180px; transform:translateY(-50%); z-index:200; background:rgba(20,20,30,0.95); color:#fff; padding:15px; font-size:12px; min-width:200px; border:1px solid #555; border-radius:4px;';

    const stats = [
      { key: 1, name: 'STR', val: this.playerSTR },
      { key: 2, name: 'VIT', val: this.playerVIT },
      { key: 3, name: 'DEX', val: this.playerDEX },
      { key: 4, name: 'INT', val: this.playerINT },
      { key: 5, name: 'MAG', val: this.playerMAG },
      { key: 6, name: 'CHR', val: this.playerCHR },
    ];

    let html = '<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><strong>Character Stats</strong><button id="stats-close" style="cursor:pointer;">X</button></div>';
    html += `<div style="margin-bottom:8px;">Level: ${this.playerLevel} | XP: ${this.playerExp}</div>`;
    html += `<div style="margin-bottom:8px; color:#9b59b6;">Stat Points: ${this.playerLUPool}</div>`;

    for (const stat of stats) {
      html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:3px 0;">`;
      html += `<span>${stat.name}: <strong>${stat.val}</strong></span>`;
      if (this.playerLUPool > 0) {
        html += `<button class="stat-alloc-btn" data-stat="${stat.key}" style="font-size:10px; cursor:pointer;">+1</button>`;
      }
      html += `</div>`;
    }

    html += `<div style="margin-top:10px; border-top:1px solid #333; padding-top:8px; font-size:11px;">`;
    html += `<div>HP: ${this.playerHP}/${this.playerMaxHP}</div>`;
    html += `<div>MP: ${this.playerMP}/${this.playerMaxMP}</div>`;
    html += `<div>SP: ${this.playerSP}/${this.playerMaxSP}</div>`;
    html += `</div>`;

    div.innerHTML = html;
    document.body.appendChild(div);

    div.querySelector('#stats-close')?.addEventListener('click', () => div.remove());
    div.querySelectorAll('.stat-alloc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const statType = parseInt((btn as HTMLElement).dataset.stat || '0');
        this.msgHandler.sendMessage(Proto.MSG_STAT_ALLOC_REQUEST, { statType, points: 1 });
        // Re-render after a short delay for server response
        setTimeout(() => this.renderStatsUI(), 200);
      });
    });

    this.events.on('shutdown', () => div.remove());
  }

  // =========================================================================
  // Phase 4: Spells, Skills, Buffs
  // =========================================================================

  private onSpellList(data: SpellListData): void {
    this.learnedSpells = data.spells || [];
    if (this.spellBarOpen) {
      this.renderSpellBarUI();
    }
  }

  private onSkillList(data: SkillListData): void {
    this.playerSkills = data.skills || [];
    if (this.skillsOpen) {
      this.renderSkillsUI();
    }
  }

  private onSpellEffect(data: SpellEffectData): void {
    // Show spell visual at target position
    const tx = data.targetPosition?.x ?? 0;
    const ty = data.targetPosition?.y ?? 0;
    const screenX = tx * TILE_SIZE + TILE_SIZE / 2;
    const screenY = ty * TILE_SIZE + TILE_SIZE / 2;

    // Flash circle effect at target
    const colors: Record<number, number> = {
      1: 0xff4400, // fire
      2: 0x00aaff, // ice
      3: 0xffff00, // light
      4: 0x88ff44, // earth
    };
    const color = colors[data.spriteId] || 0xffffff;

    const circle = this.add.circle(screenX, screenY, 20, color, 0.7);
    circle.setDepth(99999);
    this.tweens.add({
      targets: circle,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 600,
      onComplete: () => circle.destroy(),
    });

    // Show damage/heal number
    if (data.damage > 0) {
      const dmgText = this.add.text(screenX, screenY - 20, `-${data.damage}`, {
        fontSize: '14px', color: '#ff4444', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(99999);
      this.tweens.add({
        targets: dmgText,
        y: screenY - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => dmgText.destroy(),
      });
    } else if (data.healAmount > 0) {
      const healText = this.add.text(screenX, screenY - 20, `+${data.healAmount}`, {
        fontSize: '14px', color: '#44ff44', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(99999);
      this.tweens.add({
        targets: healText,
        y: screenY - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => healText.destroy(),
      });
    }
  }

  private onBuffUpdate(data: BuffUpdateData): void {
    if (data.removed) {
      this.activeBuffs.delete(data.spellId);
    } else {
      this.activeBuffs.set(data.spellId, data);
    }
    this.updateBuffDisplay();
  }

  private onSkillResult(data: SkillResultData): void {
    if (data.message) {
      this.showSystemMessage(data.message);
    }
  }

  private onCraftResult(data: CraftResultData): void {
    if (data.message) {
      this.showSystemMessage(data.message);
    }
  }

  private showSystemMessage(msg: string): void {
    const text = this.add.text(
      this.cameras.main.scrollX + this.cameras.main.width / 2,
      this.cameras.main.scrollY + this.cameras.main.height / 2 - 80,
      msg,
      { fontSize: '13px', color: '#ffff88', backgroundColor: '#00000088', padding: { x: 8, y: 4 } }
    ).setOrigin(0.5).setDepth(99999);

    this.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 2500,
      onComplete: () => text.destroy(),
    });
  }

  // --- Spell Bar ---

  private toggleSpellBar(): void {
    this.spellBarOpen = !this.spellBarOpen;
    if (this.spellBarOpen) {
      this.renderSpellBarUI();
    } else {
      this.spellBarDiv?.remove();
      this.spellBarDiv = null;
    }
  }

  private renderSpellBarUI(): void {
    this.spellBarDiv?.remove();

    const div = document.createElement('div');
    div.id = 'spell-bar';
    div.style.cssText = 'position:fixed; bottom:60px; left:50%; transform:translateX(-50%); background:#1a1a2e; border:1px solid #555; border-radius:6px; padding:10px; z-index:1000; color:#fff; font-size:12px; min-width:300px; max-width:500px;';
    this.spellBarDiv = div;

    let html = '<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><strong>Spell Book (M)</strong><button id="spell-close" style="cursor:pointer;">X</button></div>';

    if (this.learnedSpells.length === 0) {
      html += '<div style="color:#888;">No spells learned yet.</div>';
    } else {
      html += '<div style="display:flex; flex-wrap:wrap; gap:6px;">';
      const typeNames: Record<number, string> = { 1: 'DMG', 2: 'AOE', 3: 'HEAL', 4: 'BUFF', 5: 'DEBUFF' };
      const typeColors: Record<number, string> = { 1: '#ff6644', 2: '#ff8800', 3: '#44ff44', 4: '#4488ff', 5: '#aa44ff' };
      for (const spell of this.learnedSpells) {
        const color = typeColors[spell.spellType] || '#fff';
        const typeName = typeNames[spell.spellType] || '???';
        const selected = this.selectedSpellId === spell.spellId;
        const border = selected ? '2px solid #fff' : '1px solid #444';
        html += `<div class="spell-btn" data-spell="${spell.spellId}" style="cursor:pointer; padding:6px 10px; border:${border}; border-radius:4px; background:#2a2a3e; text-align:center; min-width:70px;">`;
        html += `<div style="color:${color}; font-weight:bold; font-size:11px;">${spell.name}</div>`;
        html += `<div style="font-size:9px; color:#aaa;">${typeName} | ${spell.manaCost} MP</div>`;
        html += `</div>`;
      }
      html += '</div>';
    }

    if (this.selectedSpellId > 0) {
      html += `<div style="margin-top:8px; font-size:11px; color:#aaa;">Selected spell active. Click a target to cast.</div>`;
    }

    div.innerHTML = html;
    document.body.appendChild(div);

    div.querySelector('#spell-close')?.addEventListener('click', () => this.toggleSpellBar());
    div.querySelectorAll('.spell-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const spellId = parseInt((btn as HTMLElement).dataset.spell || '0');
        this.selectedSpellId = spellId;
        this.renderSpellBarUI();
      });
    });

    this.events.on('shutdown', () => div.remove());
  }

  private castSpellOnTarget(targetId: number, targetX?: number, targetY?: number): void {
    if (this.selectedSpellId <= 0) return;

    this.msgHandler.sendMessage(Proto.MSG_SPELL_CAST_REQUEST, {
      spellId: this.selectedSpellId,
      targetId: targetId,
      targetPosition: { x: targetX ?? 0, y: targetY ?? 0 },
    });
  }

  // --- Skills Panel ---

  private toggleSkills(): void {
    this.skillsOpen = !this.skillsOpen;
    if (this.skillsOpen) {
      this.renderSkillsUI();
    } else {
      this.skillsDiv?.remove();
      this.skillsDiv = null;
    }
  }

  private renderSkillsUI(): void {
    this.skillsDiv?.remove();

    const div = document.createElement('div');
    div.id = 'skills-panel';
    div.style.cssText = 'position:fixed; top:100px; right:10px; background:#1a1a2e; border:1px solid #555; border-radius:6px; padding:12px; z-index:1000; color:#fff; font-size:12px; width:260px; max-height:500px; overflow-y:auto;';
    this.skillsDiv = div;

    let html = '<div style="display:flex; justify-content:space-between; margin-bottom:8px;"><strong>Skills (K)</strong><button id="skills-close" style="cursor:pointer;">X</button></div>';

    // Sort skills by category
    const categories: Record<string, SkillEntryData[]> = { combat: [], gathering: [], crafting: [], passive: [] };
    const catMap: Record<number, string> = {};
    // Simple mapping based on skill IDs from server
    const combatIds = [1, 2, 3, 4, 5, 14, 15, 16, 17, 18, 19, 20];
    const gatherIds = [6, 7, 8, 13, 24];
    const craftIds = [9, 10, 11, 12];
    const passiveIds = [21, 22, 23];
    for (const id of combatIds) catMap[id] = 'combat';
    for (const id of gatherIds) catMap[id] = 'gathering';
    for (const id of craftIds) catMap[id] = 'crafting';
    for (const id of passiveIds) catMap[id] = 'passive';

    for (const skill of this.playerSkills) {
      const cat = catMap[skill.skillId] || 'passive';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(skill);
    }

    const catLabels: Record<string, string> = {
      combat: 'Combat', gathering: 'Gathering', crafting: 'Crafting', passive: 'Passive',
    };

    for (const [cat, catSkills] of Object.entries(categories)) {
      if (catSkills.length === 0) continue;
      html += `<div style="margin-top:6px; color:#aaa; font-weight:bold; font-size:11px;">${catLabels[cat] || cat}</div>`;
      for (const skill of catSkills) {
        const pct = skill.mastery;
        const barColor = pct >= 80 ? '#44ff44' : pct >= 40 ? '#ffaa00' : '#4488ff';
        html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:2px 0;">`;
        html += `<span style="flex:1;">${skill.name}</span>`;
        html += `<div style="width:60px; height:8px; background:#333; border-radius:4px; margin:0 6px;">`;
        html += `<div style="width:${pct}%; height:100%; background:${barColor}; border-radius:4px;"></div></div>`;
        html += `<span style="width:30px; text-align:right; font-size:10px;">${skill.mastery}</span>`;
        html += `</div>`;
      }
    }

    div.innerHTML = html;
    document.body.appendChild(div);

    div.querySelector('#skills-close')?.addEventListener('click', () => this.toggleSkills());
    this.events.on('shutdown', () => div.remove());
  }

  // --- Buff Display ---

  private updateBuffDisplay(): void {
    // Remove old buff indicators
    const oldBuffs = document.getElementById('buff-display');
    if (oldBuffs) oldBuffs.remove();

    if (this.activeBuffs.size === 0) return;

    const div = document.createElement('div');
    div.id = 'buff-display';
    div.style.cssText = 'position:fixed; top:10px; left:50%; transform:translateX(-50%); display:flex; gap:4px; z-index:900;';

    for (const [, buff] of this.activeBuffs) {
      const isDebuff = buff.amount < 0;
      const bgColor = isDebuff ? '#442222' : '#224422';
      const borderColor = isDebuff ? '#ff4444' : '#44ff44';
      const chip = document.createElement('div');
      chip.style.cssText = `background:${bgColor}; border:1px solid ${borderColor}; border-radius:4px; padding:3px 8px; color:#fff; font-size:10px; text-align:center;`;
      chip.innerHTML = `<div style="font-weight:bold;">${buff.name}</div><div>${buff.remainingSeconds}s</div>`;
      div.appendChild(chip);
    }

    document.body.appendChild(div);
  }

  // ===== SOCIAL: Faction =====

  private onFactionResponse(data: FactionSelectResponseData): void {
    if (data.success) {
      this.showSystemMessage(`Joined faction ${data.side === 1 ? 'Aresden' : 'Elvine'}!`);
    } else {
      this.showSystemMessage(data.error);
    }
  }

  // ===== SOCIAL: Guild =====

  private onGuildInfo(data: GuildInfoData): void {
    this.guildInfo = data;
    if (this.guildOpen) {
      this.renderGuildUI();
    }
  }

  private onGuildActionResponse(data: GuildActionResponseData): void {
    this.showSystemMessage(data.message);
  }

  private toggleGuild(): void {
    this.guildOpen = !this.guildOpen;
    if (this.guildOpen) {
      this.renderGuildUI();
    } else {
      this.guildDiv?.remove();
      this.guildDiv = null;
    }
  }

  private renderGuildUI(): void {
    this.guildDiv?.remove();
    const div = document.createElement('div');
    this.guildDiv = div;
    div.id = 'guild-panel';
    div.style.cssText = 'position:fixed; top:60px; right:10px; width:280px; background:rgba(0,0,0,0.9); border:2px solid #aa8833; border-radius:8px; padding:12px; color:#fff; font-family:monospace; z-index:1000; max-height:500px; overflow-y:auto;';

    if (!this.guildInfo) {
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="font-weight:bold; color:#aa8833;">Guild</span>
          <span id="guild-close" style="cursor:pointer; color:#888;">X</span>
        </div>
        <p style="color:#888;">Not in a guild</p>
        <div style="margin-top:10px;">
          <input id="guild-create-name" type="text" placeholder="Guild name" style="width:160px; padding:4px; background:#222; border:1px solid #555; color:#fff;" />
          <button id="guild-create-btn" style="padding:4px 8px; background:#aa8833; border:none; color:#fff; cursor:pointer;">Create</button>
        </div>`;
    } else {
      const membersHtml = (this.guildInfo.members || []).map(m => {
        const rankName = m.rank === 3 ? 'Master' : m.rank === 2 ? 'Officer' : 'Member';
        const onlineColor = m.online ? '#44ff44' : '#888';
        return `<div style="display:flex; justify-content:space-between; padding:2px 0;">
          <span style="color:${onlineColor};">${m.name}</span>
          <span style="color:#aaa;">${rankName} Lv${m.level}</span>
        </div>`;
      }).join('');

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="font-weight:bold; color:#aa8833;">${this.guildInfo.name}</span>
          <span id="guild-close" style="cursor:pointer; color:#888;">X</span>
        </div>
        <div style="color:#888; margin-bottom:8px;">Master: ${this.guildInfo.masterName} | Side: ${this.guildInfo.side === 1 ? 'Aresden' : 'Elvine'}</div>
        <div style="font-weight:bold; margin-bottom:4px;">Members:</div>
        ${membersHtml}
        <div style="margin-top:10px; display:flex; gap:4px;">
          <input id="guild-target" type="text" placeholder="Player name" style="flex:1; padding:4px; background:#222; border:1px solid #555; color:#fff;" />
          <button id="guild-invite-btn" style="padding:4px 6px; background:#448844; border:none; color:#fff; cursor:pointer;">Invite</button>
        </div>
        <div style="margin-top:6px; display:flex; gap:4px;">
          <button id="guild-leave-btn" style="padding:4px 8px; background:#884444; border:none; color:#fff; cursor:pointer;">Leave</button>
        </div>`;
    }

    document.body.appendChild(div);

    div.querySelector('#guild-close')?.addEventListener('click', () => this.toggleGuild());
    div.querySelector('#guild-create-btn')?.addEventListener('click', () => {
      const input = div.querySelector('#guild-create-name') as HTMLInputElement;
      if (input?.value) {
        this.msgHandler.sendMessage(Proto.MSG_GUILD_CREATE_REQUEST, { name: input.value });
      }
    });
    div.querySelector('#guild-invite-btn')?.addEventListener('click', () => {
      const input = div.querySelector('#guild-target') as HTMLInputElement;
      if (input?.value) {
        this.msgHandler.sendMessage(Proto.MSG_GUILD_ACTION_REQUEST, { action: 1, targetName: input.value });
      }
    });
    div.querySelector('#guild-leave-btn')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_GUILD_ACTION_REQUEST, { action: 5, targetName: '' });
    });
  }

  // ===== SOCIAL: Party =====

  private onPartyUpdate(data: PartyUpdateData): void {
    this.partyMembers = data.members || [];
    this.partyLeaderId = data.leaderObjectId;
    if (this.partyOpen) {
      this.renderPartyUI();
    }
  }

  private onPartyInvite(data: PartyInviteData): void {
    this.showSystemMessage(`${data.inviterName} invited you to a party`);
    // Auto-show a simple accept/decline
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.95); border:2px solid #4488ff; border-radius:8px; padding:20px; color:#fff; font-family:monospace; z-index:2000; text-align:center;';
    div.innerHTML = `
      <p>${data.inviterName} invited you to a party</p>
      <button id="party-accept" style="padding:6px 16px; background:#448844; border:none; color:#fff; cursor:pointer; margin:4px;">Accept</button>
      <button id="party-decline" style="padding:6px 16px; background:#884444; border:none; color:#fff; cursor:pointer; margin:4px;">Decline</button>`;
    document.body.appendChild(div);

    div.querySelector('#party-accept')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_PARTY_INVITE_RESPONSE, { accept: true });
      div.remove();
    });
    div.querySelector('#party-decline')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_PARTY_INVITE_RESPONSE, { accept: false });
      div.remove();
    });
  }

  private onPartyActionResponse(data: PartyActionResponseData): void {
    this.showSystemMessage(data.message);
  }

  private toggleParty(): void {
    this.partyOpen = !this.partyOpen;
    if (this.partyOpen) {
      this.renderPartyUI();
    } else {
      this.partyDiv?.remove();
      this.partyDiv = null;
    }
  }

  private renderPartyUI(): void {
    this.partyDiv?.remove();
    const div = document.createElement('div');
    this.partyDiv = div;
    div.id = 'party-panel';
    div.style.cssText = 'position:fixed; top:60px; left:10px; width:220px; background:rgba(0,0,0,0.9); border:2px solid #4488ff; border-radius:8px; padding:12px; color:#fff; font-family:monospace; z-index:1000;';

    if (this.partyMembers.length === 0) {
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-weight:bold; color:#4488ff;">Party</span>
          <span id="party-close" style="cursor:pointer; color:#888;">X</span>
        </div>
        <p style="color:#888;">Not in a party</p>
        <div style="margin-top:8px;">
          <input id="party-invite-name" type="text" placeholder="Player name" style="width:120px; padding:4px; background:#222; border:1px solid #555; color:#fff;" />
          <button id="party-invite-btn" style="padding:4px 8px; background:#4488ff; border:none; color:#fff; cursor:pointer;">Invite</button>
        </div>`;
    } else {
      const membersHtml = this.partyMembers.map(m => {
        const hpPct = m.maxHp > 0 ? (m.hp / m.maxHp * 100) : 0;
        const isLeader = m.objectId === this.partyLeaderId;
        return `<div style="margin-bottom:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span>${isLeader ? '★ ' : ''}${m.name}</span>
            <span style="color:#aaa;">Lv${m.level}</span>
          </div>
          <div style="background:#333; height:6px; border-radius:3px; margin-top:2px;">
            <div style="background:#44ff44; height:100%; width:${hpPct}%; border-radius:3px;"></div>
          </div>
          <div style="font-size:10px; color:#aaa;">${m.hp}/${m.maxHp}</div>
        </div>`;
      }).join('');

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-weight:bold; color:#4488ff;">Party</span>
          <span id="party-close" style="cursor:pointer; color:#888;">X</span>
        </div>
        ${membersHtml}
        <button id="party-leave-btn" style="padding:4px 8px; background:#884444; border:none; color:#fff; cursor:pointer; margin-top:4px;">Leave</button>`;
    }

    document.body.appendChild(div);

    div.querySelector('#party-close')?.addEventListener('click', () => this.toggleParty());
    div.querySelector('#party-invite-btn')?.addEventListener('click', () => {
      const input = div.querySelector('#party-invite-name') as HTMLInputElement;
      if (input?.value) {
        this.msgHandler.sendMessage(Proto.MSG_PARTY_ACTION_REQUEST, { action: 1, targetName: input.value });
      }
    });
    div.querySelector('#party-leave-btn')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_PARTY_ACTION_REQUEST, { action: 3, targetName: '' });
    });
  }

  // ===== SOCIAL: Trade =====

  private onTradeIncoming(data: TradeIncomingData): void {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.95); border:2px solid #aaaa44; border-radius:8px; padding:20px; color:#fff; font-family:monospace; z-index:2000; text-align:center;';
    div.innerHTML = `
      <p>${data.requesterName} wants to trade with you</p>
      <button id="trade-accept" style="padding:6px 16px; background:#448844; border:none; color:#fff; cursor:pointer; margin:4px;">Accept</button>
      <button id="trade-decline" style="padding:6px 16px; background:#884444; border:none; color:#fff; cursor:pointer; margin:4px;">Decline</button>`;
    document.body.appendChild(div);

    div.querySelector('#trade-accept')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_TRADE_RESPONSE, { accept: true });
      div.remove();
    });
    div.querySelector('#trade-decline')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_TRADE_RESPONSE, { accept: false });
      div.remove();
    });
  }

  private onTradeUpdate(data: TradeUpdateData): void {
    this.tradeOpen = true;
    this.renderTradeUI(data);
  }

  private onTradeComplete(data: TradeCompleteData): void {
    this.tradeOpen = false;
    this.tradeDiv?.remove();
    this.tradeDiv = null;
    this.showSystemMessage(data.message);
  }

  private renderTradeUI(data: TradeUpdateData): void {
    this.tradeDiv?.remove();
    const div = document.createElement('div');
    this.tradeDiv = div;
    div.id = 'trade-panel';
    div.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:500px; background:rgba(0,0,0,0.95); border:2px solid #aaaa44; border-radius:8px; padding:16px; color:#fff; font-family:monospace; z-index:1500;';

    const renderItems = (items: TradeSlotData[], label: string) => {
      if (!items || items.length === 0) return `<p style="color:#888;">No items</p>`;
      return items.map(i => `<div style="padding:2px 0;">${i.name} x${i.count}</div>`).join('');
    };

    const myConfirmedStyle = data.myConfirmed ? 'color:#44ff44;' : 'color:#ff4444;';
    const theirConfirmedStyle = data.theirConfirmed ? 'color:#44ff44;' : 'color:#ff4444;';

    div.innerHTML = `
      <div style="text-align:center; font-weight:bold; color:#aaaa44; margin-bottom:10px;">Trade</div>
      <div style="display:flex; gap:16px;">
        <div style="flex:1; border:1px solid #555; padding:8px; border-radius:4px;">
          <div style="font-weight:bold; margin-bottom:4px;">Your Offer</div>
          ${renderItems(data.myItems, 'My')}
          <div style="margin-top:6px; color:#ffdd44;">Gold: ${data.myGold || 0}</div>
          <div style="margin-top:4px; ${myConfirmedStyle}">${data.myConfirmed ? '✓ Confirmed' : '○ Not confirmed'}</div>
        </div>
        <div style="flex:1; border:1px solid #555; padding:8px; border-radius:4px;">
          <div style="font-weight:bold; margin-bottom:4px;">Their Offer</div>
          ${renderItems(data.theirItems, 'Their')}
          <div style="margin-top:6px; color:#ffdd44;">Gold: ${data.theirGold || 0}</div>
          <div style="margin-top:4px; ${theirConfirmedStyle}">${data.theirConfirmed ? '✓ Confirmed' : '○ Not confirmed'}</div>
        </div>
      </div>
      <div style="margin-top:12px; display:flex; gap:8px; justify-content:center;">
        <div style="display:flex; align-items:center; gap:4px;">
          <label style="font-size:12px;">Gold:</label>
          <input id="trade-gold" type="number" min="0" value="${data.myGold || 0}" style="width:80px; padding:4px; background:#222; border:1px solid #555; color:#fff;" />
          <button id="trade-set-gold" style="padding:4px 8px; background:#aaaa44; border:none; color:#000; cursor:pointer;">Set</button>
        </div>
        <button id="trade-confirm" style="padding:6px 16px; background:#448844; border:none; color:#fff; cursor:pointer;">Confirm</button>
        <button id="trade-cancel" style="padding:6px 16px; background:#884444; border:none; color:#fff; cursor:pointer;">Cancel</button>
      </div>`;

    document.body.appendChild(div);

    div.querySelector('#trade-set-gold')?.addEventListener('click', () => {
      const input = div.querySelector('#trade-gold') as HTMLInputElement;
      const gold = parseInt(input?.value || '0', 10);
      this.msgHandler.sendMessage(Proto.MSG_TRADE_SET_GOLD, { gold });
    });
    div.querySelector('#trade-confirm')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_TRADE_CONFIRM, { confirmed: true });
    });
    div.querySelector('#trade-cancel')?.addEventListener('click', () => {
      this.msgHandler.sendMessage(Proto.MSG_TRADE_CONFIRM, { confirmed: false });
      this.tradeOpen = false;
      this.tradeDiv?.remove();
      this.tradeDiv = null;
    });
  }

  // ===== SOCIAL: PK Status =====

  private onPKStatus(data: PKStatusData): void {
    this.pkCount = data.pkCount;
    this.ekCount = data.ekCount;
    this.criminal = data.criminal;
    if (data.criminal) {
      this.showSystemMessage(`Criminal status! PK: ${data.pkCount} EK: ${data.ekCount}`);
    }
  }

  // ===== QUESTS =====

  private onQuestList(data: QuestListData): void {
    this.questList = data.activeQuests || [];
    this.availableQuestIds = data.availableQuestIds || [];
    if (this.questOpen) {
      this.renderQuestUI();
    }
  }

  private onQuestProgress(data: QuestProgressData): void {
    this.showSystemMessage(`Quest progress: ${data.progress}/${data.targetCount}${data.completed ? ' - COMPLETED!' : ''}`);
    // Update local state
    for (const q of this.questList) {
      if (q.questId === data.questId) {
        q.progress = data.progress;
        if (data.completed) q.state = 2;
        break;
      }
    }
    if (this.questOpen) {
      this.renderQuestUI();
    }
  }

  private onQuestReward(data: QuestRewardData): void {
    let msg = `Quest "${data.questName}" complete! +${data.xpGained} XP, +${data.goldGained} gold`;
    if (data.itemCount > 0) {
      msg += `, +${data.itemCount} item(s)`;
    }
    this.showSystemMessage(msg);
  }

  private toggleQuests(): void {
    this.questOpen = !this.questOpen;
    if (this.questOpen) {
      this.renderQuestUI();
    } else {
      this.questDiv?.remove();
      this.questDiv = null;
    }
  }

  private renderQuestUI(): void {
    this.questDiv?.remove();
    const div = document.createElement('div');
    this.questDiv = div;
    div.id = 'quest-panel';
    div.style.cssText = 'position:fixed; top:60px; left:50%; transform:translateX(-50%); width:400px; background:rgba(0,0,0,0.95); border:2px solid #cc8844; border-radius:8px; padding:16px; color:#fff; font-family:monospace; z-index:1000; max-height:500px; overflow-y:auto;';

    const activeHtml = this.questList.length === 0
      ? '<p style="color:#888;">No active quests</p>'
      : this.questList.map(q => {
          const stateLabel = q.state === 2 ? '<span style="color:#44ff44;">[COMPLETE]</span>' : '';
          const progressBar = q.targetCount > 0
            ? `<div style="background:#333; height:8px; border-radius:4px; margin-top:4px;">
                <div style="background:#cc8844; height:100%; width:${q.progress / q.targetCount * 100}%; border-radius:4px;"></div>
              </div>
              <div style="font-size:10px; color:#aaa;">${q.progress}/${q.targetCount}</div>`
            : '';
          return `<div style="border:1px solid #555; border-radius:4px; padding:8px; margin-bottom:6px;">
            <div style="display:flex; justify-content:space-between;">
              <span style="font-weight:bold;">${q.name}</span>
              ${stateLabel}
            </div>
            <div style="font-size:11px; color:#aaa; margin-top:2px;">${q.description}</div>
            ${progressBar}
            <div style="font-size:10px; color:#cc8844; margin-top:2px;">Reward: ${q.rewardXp} XP, ${q.rewardGold} gold</div>
            ${q.state === 2 ? `<button class="quest-turnin" data-id="${q.questId}" style="margin-top:4px; padding:3px 10px; background:#448844; border:none; color:#fff; cursor:pointer; border-radius:3px;">Turn In</button>` : ''}
          </div>`;
        }).join('');

    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span style="font-weight:bold; color:#cc8844;">Quests (J)</span>
        <span id="quest-close" style="cursor:pointer; color:#888;">X</span>
      </div>
      <div style="font-weight:bold; margin-bottom:6px;">Active Quests</div>
      ${activeHtml}`;

    document.body.appendChild(div);

    div.querySelector('#quest-close')?.addEventListener('click', () => this.toggleQuests());
    div.querySelectorAll('.quest-turnin').forEach(btn => {
      btn.addEventListener('click', () => {
        const questId = parseInt((btn as HTMLElement).dataset.id || '0', 10);
        this.msgHandler.sendMessage(Proto.MSG_QUEST_TURNIN_REQUEST, { questId });
      });
    });
  }
}
