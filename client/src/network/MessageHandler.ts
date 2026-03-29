import { WebSocketClient } from './WebSocketClient';
import * as Proto from './Protocol';
import { hbonline } from '../proto/messages.js';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Appearance {
  gender: number;
  skinColor: number;
  hairStyle: number;
  hairColor: number;
  underwearColor: number;
  bodyArmor: number;
  armArmor: number;
  leggings: number;
  helm: number;
  weapon: number;
  shield: number;
  cape: number;
  boots: number;
  apprColor: number;
}

export interface CharacterSummary {
  id: number;
  name: string;
  level: number;
  gender: number;
  side: number;
  mapName: string;
  appearance?: Appearance;
}

export interface PlayerContents {
  objectId: number;
  name: string;
  mapName: string;
  position: Vec2;
  direction: number;
  appearance: Appearance;
  level: number;
  experience: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sp: number;
  maxSp: number;
  str: number;
  vit: number;
  dex: number;
  intStat: number;
  mag: number;
  charisma: number;
  luPool: number;
  side: number;
  gold: number;
  pkCount: number;
  ekCount: number;
  hunger: number;
  adminLevel: number;
}

export interface MotionEvent {
  objectId: number;
  ownerType: number;
  action: number;
  direction: number;
  position: Vec2;
  destination?: Vec2;
  speed: number;
  appearance?: Appearance;
  name: string;
  status: number;
}

export interface ChatMessageData {
  objectId: number;
  senderName: string;
  type: number;
  message: string;
  position: Vec2;
}

export interface EntityInfo {
  objectId: number;
  entityType: number;
  name: string;
  position: Vec2;
  direction: number;
  action: number;
  status: number;
  appearance?: Appearance;
  npcType: number;
  level: number;
  side: number;
}

export interface DamageEventData {
  attackerId: number;
  targetId: number;
  targetType: number;
  damage: number;
  critical: boolean;
  miss: boolean;
  targetHp: number;
  targetMaxHp: number;
}

export interface StatUpdateData {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sp: number;
  maxSp: number;
  experience: number;
  level: number;
  luPool: number;
  str: number;
  vit: number;
  dex: number;
  intStat: number;
  mag: number;
  charisma: number;
  gold: number;
}

export interface DeathEventData {
  objectId: number;
  objectType: number;
  killerId: number;
  killerName: string;
  position: Vec2;
}

export interface RespawnEventData {
  position: Vec2;
  direction: number;
  mapName: string;
  hp: number;
  mp: number;
  sp: number;
}

export interface NpcAppearData {
  objectId: number;
  name: string;
  npcType: number;
  position: Vec2;
  direction: number;
  action: number;
  status: number;
}

export interface NpcMotionData {
  objectId: number;
  action: number;
  direction: number;
  position: Vec2;
  destination?: Vec2;
  speed: number;
  name: string;
  npcType: number;
}

export interface ItemInstanceData {
  itemId: number;
  name: string;
  count: number;
  durability: number;
  maxDurability: number;
  slotIndex: number;
}

export interface InventoryUpdateData {
  items: ItemInstanceData[];
  equipment: ItemInstanceData[];
  gold: number;
}

export interface GroundItemAppearData {
  groundId: number;
  itemId: number;
  name: string;
  count: number;
  position: Vec2;
}

export interface GroundItemDisappearData {
  groundId: number;
}

export interface ShopItemData {
  itemId: number;
  name: string;
  price: number;
  itemType: number;
}

export interface ShopOpenData {
  npcId: number;
  shopName: string;
  items: ShopItemData[];
}

export interface ShopResponseData {
  success: boolean;
  error: string;
}

export interface SpellEffectData {
  casterId: number;
  spellId: number;
  targetId: number;
  casterPosition: Vec2;
  targetPosition: Vec2;
  damage: number;
  healAmount: number;
  miss: boolean;
  spriteId: number;
  soundId: number;
}

export interface BuffUpdateData {
  objectId: number;
  spellId: number;
  name: string;
  statType: number;
  amount: number;
  remainingSeconds: number;
  removed: boolean;
}

export interface LearnedSpellData {
  spellId: number;
  name: string;
  manaCost: number;
  cooldownMs: number;
  spellType: number;
  spriteId: number;
}

export interface SpellListData {
  spells: LearnedSpellData[];
}

export interface SkillEntryData {
  skillId: number;
  name: string;
  mastery: number;
}

export interface SkillListData {
  skills: SkillEntryData[];
  totalMastery: number;
  masteryCap: number;
}

export interface SkillResultData {
  skillId: number;
  success: boolean;
  message: string;
  newMastery: number;
  itemGainedId: number;
}

export interface CraftResultData {
  success: boolean;
  message: string;
  itemId: number;
  count: number;
}

export interface FactionSelectResponseData {
  success: boolean;
  error: string;
  side: number;
}

export interface GuildInfoData {
  guildId: number;
  name: string;
  side: number;
  members: GuildMemberData[];
  masterName: string;
}

export interface GuildMemberData {
  name: string;
  rank: number;
  level: number;
  online: boolean;
}

export interface GuildActionResponseData {
  success: boolean;
  message: string;
}

export interface PartyUpdateData {
  members: PartyMemberData[];
  leaderObjectId: number;
}

export interface PartyMemberData {
  objectId: number;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
}

export interface PartyInviteData {
  inviterObjectId: number;
  inviterName: string;
}

export interface PartyActionResponseData {
  success: boolean;
  message: string;
}

export interface TradeIncomingData {
  requesterId: number;
  requesterName: string;
}

export interface TradeUpdateData {
  myItems: TradeSlotData[];
  theirItems: TradeSlotData[];
  myGold: number;
  theirGold: number;
  myConfirmed: boolean;
  theirConfirmed: boolean;
}

export interface TradeSlotData {
  itemId: number;
  name: string;
  count: number;
  slotIndex: number;
}

export interface TradeCompleteData {
  success: boolean;
  message: string;
}

export interface PKStatusData {
  pkCount: number;
  ekCount: number;
  criminal: boolean;
  criminalTimer: number;
}

export interface QuestEntryData {
  questId: number;
  name: string;
  description: string;
  questType: number;
  state: number;
  progress: number;
  targetCount: number;
  rewardXp: number;
  rewardGold: number;
}

export interface QuestListData {
  activeQuests: QuestEntryData[];
  availableQuestIds: number[];
}

export interface QuestProgressData {
  questId: number;
  progress: number;
  targetCount: number;
  completed: boolean;
}

export interface QuestRewardData {
  questId: number;
  questName: string;
  xpGained: number;
  goldGained: number;
  itemId: number;
  itemCount: number;
}

export interface LogoutResponseData {
  secondsRemaining: number;
  cancelled: boolean;
  reason: string;
}

export interface MapInfo {
  name: string;
  width: number;
  height: number;
  collisionGrid: Uint8Array;
}

export interface EnterGameResponse {
  player: PlayerContents;
  mapInfo: MapInfo;
  nearbyPlayers: EntityInfo[];
  nearbyNpcs: EntityInfo[];
}

export interface LoginResponse {
  success: boolean;
  error: string;
  characters: CharacterSummary[];
  token: string;
}

export interface CreateCharacterResponse {
  success: boolean;
  error: string;
  characters: CharacterSummary[];
}

export type MessageListener = (data: any) => void;

// Map from server message type to pre-compiled protobuf decoder
const decoderMap: Record<number, { decode: (reader: Uint8Array) => any }> = {
  [Proto.MSG_LOGIN_RESPONSE]: hbonline.LoginResponse,
  [Proto.MSG_ENTER_GAME_RESPONSE]: hbonline.EnterGameResponse,
  [Proto.MSG_MOTION_EVENT]: hbonline.MotionEvent,
  [Proto.MSG_CHAT_MESSAGE]: hbonline.ChatMessage,
  [Proto.MSG_PLAYER_APPEAR]: hbonline.PlayerAppear,
  [Proto.MSG_PLAYER_DISAPPEAR]: hbonline.PlayerDisappear,
  [Proto.MSG_NPC_APPEAR]: hbonline.NpcAppear,
  [Proto.MSG_NPC_DISAPPEAR]: hbonline.NpcDisappear,
  [Proto.MSG_NPC_MOTION]: hbonline.NpcMotion,
  [Proto.MSG_NOTIFICATION]: hbonline.Notification,
  [Proto.MSG_MAP_CHANGE_RESPONSE]: hbonline.MapChangeResponse,
  [Proto.MSG_CREATE_CHAR_RESPONSE]: hbonline.CreateCharacterResponse,
  [Proto.MSG_DELETE_CHAR_RESPONSE]: hbonline.DeleteCharacterResponse,
  [Proto.MSG_DAMAGE_EVENT]: hbonline.DamageEvent,
  [Proto.MSG_STAT_UPDATE]: hbonline.StatUpdate,
  [Proto.MSG_DEATH_EVENT]: hbonline.DeathEvent,
  [Proto.MSG_RESPAWN_EVENT]: hbonline.RespawnEvent,
  [Proto.MSG_INVENTORY_UPDATE]: hbonline.InventoryUpdate,
  [Proto.MSG_GROUND_ITEM_APPEAR]: hbonline.GroundItemAppear,
  [Proto.MSG_GROUND_ITEM_DISAPPEAR]: hbonline.GroundItemDisappear,
  [Proto.MSG_SHOP_OPEN]: hbonline.ShopOpen,
  [Proto.MSG_SHOP_RESPONSE]: hbonline.ShopResponse,
  [Proto.MSG_SPELL_EFFECT]: hbonline.SpellEffectEvent,
  [Proto.MSG_BUFF_UPDATE]: hbonline.BuffUpdate,
  [Proto.MSG_SPELL_LIST]: hbonline.SpellListUpdate,
  [Proto.MSG_SKILL_LIST]: hbonline.SkillListUpdate,
  [Proto.MSG_SKILL_RESULT]: hbonline.SkillResultEvent,
  [Proto.MSG_CRAFT_RESULT]: hbonline.CraftResult,
  [Proto.MSG_FACTION_SELECT_RESPONSE]: hbonline.FactionSelectResponse,
  [Proto.MSG_GUILD_INFO]: hbonline.GuildInfo,
  [Proto.MSG_GUILD_ACTION_RESPONSE]: hbonline.GuildActionResponse,
  [Proto.MSG_PARTY_UPDATE]: hbonline.PartyUpdate,
  [Proto.MSG_PARTY_INVITE]: hbonline.PartyInvite,
  [Proto.MSG_PARTY_ACTION_RESPONSE]: hbonline.PartyActionResponse,
  [Proto.MSG_TRADE_INCOMING]: hbonline.TradeIncoming,
  [Proto.MSG_TRADE_UPDATE]: hbonline.TradeUpdate,
  [Proto.MSG_TRADE_COMPLETE]: hbonline.TradeComplete,
  [Proto.MSG_PK_STATUS_UPDATE]: hbonline.PKStatusUpdate,
  [Proto.MSG_QUEST_LIST_UPDATE]: hbonline.QuestListUpdate,
  [Proto.MSG_QUEST_PROGRESS]: hbonline.QuestProgressUpdate,
  [Proto.MSG_QUEST_REWARD]: hbonline.QuestRewardNotification,
  [Proto.MSG_LOGOUT_RESPONSE]: hbonline.LogoutResponse,
};

// Map from client message type to pre-compiled protobuf encoder
const encoderMap: Record<number, { create: (data: any) => any; encode: (msg: any) => { finish: () => Uint8Array } }> = {
  [Proto.MSG_LOGIN_REQUEST]: hbonline.LoginRequest,
  [Proto.MSG_CREATE_CHARACTER_REQUEST]: hbonline.CreateCharacterRequest,
  [Proto.MSG_ENTER_GAME_REQUEST]: hbonline.EnterGameRequest,
  [Proto.MSG_MOTION_REQUEST]: hbonline.MotionRequest,
  [Proto.MSG_CHAT_REQUEST]: hbonline.ChatRequest,
  [Proto.MSG_DELETE_CHARACTER_REQUEST]: hbonline.DeleteCharacterRequest,
  [Proto.MSG_ATTACK_REQUEST]: hbonline.MotionRequest,
  [Proto.MSG_ITEM_PICKUP_REQUEST]: hbonline.ItemPickupRequest,
  [Proto.MSG_ITEM_USE_REQUEST]: hbonline.ItemUseRequest,
  [Proto.MSG_ITEM_EQUIP_REQUEST]: hbonline.ItemEquipRequest,
  [Proto.MSG_ITEM_DROP_REQUEST]: hbonline.ItemDropRequest,
  [Proto.MSG_SHOP_BUY_REQUEST]: hbonline.ShopBuyRequest,
  [Proto.MSG_SHOP_SELL_REQUEST]: hbonline.ShopSellRequest,
  [Proto.MSG_STAT_ALLOC_REQUEST]: hbonline.StatAllocRequest,
  [Proto.MSG_SPELL_CAST_REQUEST]: hbonline.SpellCastRequest,
  [Proto.MSG_LEARN_SPELL_REQUEST]: hbonline.LearnSpellRequest,
  [Proto.MSG_SKILL_USE_REQUEST]: hbonline.SkillUseRequest,
  [Proto.MSG_CRAFT_REQUEST]: hbonline.CraftRequest,
  [Proto.MSG_FACTION_SELECT_REQUEST]: hbonline.FactionSelectRequest,
  [Proto.MSG_GUILD_CREATE_REQUEST]: hbonline.GuildCreateRequest,
  [Proto.MSG_GUILD_ACTION_REQUEST]: hbonline.GuildActionRequest,
  [Proto.MSG_PARTY_ACTION_REQUEST]: hbonline.PartyActionRequest,
  [Proto.MSG_PARTY_INVITE_RESPONSE]: hbonline.PartyInviteResponse,
  [Proto.MSG_TRADE_REQUEST]: hbonline.TradeRequest,
  [Proto.MSG_TRADE_RESPONSE]: hbonline.TradeResponse,
  [Proto.MSG_TRADE_SET_ITEM]: hbonline.TradeSetItem,
  [Proto.MSG_TRADE_SET_GOLD]: hbonline.TradeSetGold,
  [Proto.MSG_TRADE_CONFIRM]: hbonline.TradeConfirm,
  [Proto.MSG_QUEST_ACCEPT_REQUEST]: hbonline.QuestAcceptRequest,
  [Proto.MSG_QUEST_TURNIN_REQUEST]: hbonline.QuestTurnInRequest,
  [Proto.MSG_LOGOUT_REQUEST]: hbonline.LogoutRequest,
};

export class MessageHandler {
  private listeners: Map<number, MessageListener[]> = new Map();
  private ws: WebSocketClient;
  // Buffer for messages that arrive before handlers are registered (scene transitions)
  private pendingMessages: Map<number, any[]> = new Map();

  constructor(ws: WebSocketClient) {
    this.ws = ws;
  }

  on(msgType: number, listener: MessageListener): void {
    if (!this.listeners.has(msgType)) {
      this.listeners.set(msgType, []);
    }
    this.listeners.get(msgType)!.push(listener);

    // Replay any buffered messages for this type
    const pending = this.pendingMessages.get(msgType);
    if (pending && pending.length > 0) {
      console.log(`[MSG] Replaying ${pending.length} buffered messages for 0x${msgType.toString(16)}`);
      for (const decoded of pending) {
        try { listener(decoded); } catch (e) { console.error('Error replaying buffered message:', e); }
      }
      this.pendingMessages.delete(msgType);
    }
  }

  /** Remove all listeners for a specific message type. */
  off(msgType: number): void {
    this.listeners.delete(msgType);
  }

  /** Remove all listeners for all message types. Call before re-registering. */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  handleMessage(msgType: number, payload: Uint8Array): void {
    const listeners = this.listeners.get(msgType);
    if (!listeners || listeners.length === 0) {
      // Buffer the message so it can be replayed when a handler is registered
      const decoded = this.decode(msgType, payload);
      if (decoded) {
        if (!this.pendingMessages.has(msgType)) {
          this.pendingMessages.set(msgType, []);
        }
        this.pendingMessages.get(msgType)!.push(decoded);
        console.log(`[MSG] Buffered message type 0x${msgType.toString(16)} (no handler yet)`);
      }
      return;
    }

    const decoded = this.decode(msgType, payload);
    if (decoded) {
      // Log incoming messages for debugging
      const msgName = Object.entries(Proto).find(([, v]) => v === msgType)?.[0] || `0x${msgType.toString(16)}`;
      if (msgType === Proto.MSG_ENTER_GAME_RESPONSE) {
        console.log(`[MSG] ${msgName}: player=${decoded.player?.name}, nearbyPlayers=${decoded.nearbyPlayers?.length ?? 0}, nearbyNpcs=${decoded.nearbyNpcs?.length ?? 0}`);
      } else if (msgType === Proto.MSG_PLAYER_APPEAR) {
        console.log(`[MSG] ${msgName}: ${decoded.name} (obj=${decoded.objectId}) at (${decoded.position?.x}, ${decoded.position?.y})`);
      } else if (msgType === Proto.MSG_NPC_APPEAR) {
        console.log(`[MSG] ${msgName}: ${decoded.name} (obj=${decoded.objectId}) type=${decoded.npcType} at (${decoded.position?.x}, ${decoded.position?.y})`);
      } else if (msgType === Proto.MSG_NPC_MOTION) {
        // Don't log NPC motion (too noisy), but log auto-creates
      } else if (msgType === Proto.MSG_MOTION_EVENT) {
        // Don't log motion events (too noisy)
      } else {
        console.log(`[MSG] ${msgName}`);
      }

      // Ensure collisionGrid is a Uint8Array for EnterGameResponse
      if (msgType === Proto.MSG_ENTER_GAME_RESPONSE && decoded.mapInfo?.collisionGrid) {
        const grid = decoded.mapInfo.collisionGrid;
        if (!(grid instanceof Uint8Array)) {
          decoded.mapInfo.collisionGrid = new Uint8Array(grid);
        }
      }

      for (const listener of listeners) {
        listener(decoded);
      }
    }
  }

  private decode(msgType: number, payload: Uint8Array): any {
    const MsgClass = decoderMap[msgType];
    if (!MsgClass) {
      console.warn(`Unknown message type for decode: 0x${msgType.toString(16)}`);
      return null;
    }

    try {
      return MsgClass.decode(payload);
    } catch (e) {
      console.error(`Failed to decode message 0x${msgType.toString(16)}:`, e);
      return null;
    }
  }

  encode(msgType: number, data: Record<string, any>): Uint8Array | null {
    const MsgClass = encoderMap[msgType];
    if (!MsgClass) {
      console.warn(`Unknown message type for encode: 0x${msgType.toString(16)}`);
      return null;
    }

    try {
      const msg = MsgClass.create(data);
      return MsgClass.encode(msg).finish();
    } catch (e) {
      console.error(`Failed to encode message 0x${msgType.toString(16)}:`, e);
      return null;
    }
  }

  sendMessage(msgType: number, data: Record<string, any>): void {
    const payload = this.encode(msgType, data);
    if (payload) {
      this.ws.send(msgType, payload);
    }
  }
}
