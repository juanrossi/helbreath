import { WebSocketClient } from './WebSocketClient';
import * as Proto from './Protocol';
import * as protobuf from 'protobufjs';

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
}

export interface CreateCharacterResponse {
  success: boolean;
  error: string;
  characters: CharacterSummary[];
}

export type MessageListener = (data: any) => void;

export class MessageHandler {
  private listeners: Map<number, MessageListener[]> = new Map();
  private ws: WebSocketClient;
  private root: protobuf.Root | null = null;

  constructor(ws: WebSocketClient) {
    this.ws = ws;
  }

  async init(): Promise<void> {
    // Load proto definitions
    this.root = await protobuf.load([
      '/proto/common.proto',
      '/proto/auth.proto',
      '/proto/game.proto',
      '/proto/chat.proto',
    ]);
  }

  on(msgType: number, listener: MessageListener): void {
    if (!this.listeners.has(msgType)) {
      this.listeners.set(msgType, []);
    }
    this.listeners.get(msgType)!.push(listener);
  }

  handleMessage(msgType: number, payload: Uint8Array): void {
    const listeners = this.listeners.get(msgType);
    if (!listeners || listeners.length === 0) {
      console.warn(`No handler for message type 0x${msgType.toString(16)}`);
      return;
    }

    const decoded = this.decode(msgType, payload);
    if (decoded) {
      for (const listener of listeners) {
        listener(decoded);
      }
    }
  }

  private decode(msgType: number, payload: Uint8Array): any {
    if (!this.root) return null;

    try {
      switch (msgType) {
        case Proto.MSG_LOGIN_RESPONSE:
          return this.root.lookupType('hbonline.LoginResponse').decode(payload);
        case Proto.MSG_ENTER_GAME_RESPONSE:
          return this.root.lookupType('hbonline.EnterGameResponse').decode(payload);
        case Proto.MSG_MOTION_EVENT:
          return this.root.lookupType('hbonline.MotionEvent').decode(payload);
        case Proto.MSG_CHAT_MESSAGE:
          return this.root.lookupType('hbonline.ChatMessage').decode(payload);
        case Proto.MSG_PLAYER_APPEAR:
          return this.root.lookupType('hbonline.PlayerAppear').decode(payload);
        case Proto.MSG_PLAYER_DISAPPEAR:
          return this.root.lookupType('hbonline.PlayerDisappear').decode(payload);
        case Proto.MSG_NPC_APPEAR:
          return this.root.lookupType('hbonline.NpcAppear').decode(payload);
        case Proto.MSG_NPC_DISAPPEAR:
          return this.root.lookupType('hbonline.NpcDisappear').decode(payload);
        case Proto.MSG_NPC_MOTION:
          return this.root.lookupType('hbonline.NpcMotion').decode(payload);
        case Proto.MSG_NOTIFICATION:
          return this.root.lookupType('hbonline.Notification').decode(payload);
        case Proto.MSG_MAP_CHANGE_RESPONSE:
          return this.root.lookupType('hbonline.MapChangeResponse').decode(payload);
        case Proto.MSG_CREATE_CHAR_RESPONSE:
          return this.root.lookupType('hbonline.CreateCharacterResponse').decode(payload);
        case Proto.MSG_DELETE_CHAR_RESPONSE:
          return this.root.lookupType('hbonline.DeleteCharacterResponse').decode(payload);
        default:
          console.warn(`Unknown message type for decode: 0x${msgType.toString(16)}`);
          return null;
      }
    } catch (e) {
      console.error(`Failed to decode message 0x${msgType.toString(16)}:`, e);
      return null;
    }
  }

  encode(msgType: number, data: Record<string, any>): Uint8Array | null {
    if (!this.root) return null;

    try {
      let typeName: string;
      switch (msgType) {
        case Proto.MSG_LOGIN_REQUEST:
          typeName = 'hbonline.LoginRequest';
          break;
        case Proto.MSG_CREATE_CHARACTER_REQUEST:
          typeName = 'hbonline.CreateCharacterRequest';
          break;
        case Proto.MSG_ENTER_GAME_REQUEST:
          typeName = 'hbonline.EnterGameRequest';
          break;
        case Proto.MSG_MOTION_REQUEST:
          typeName = 'hbonline.MotionRequest';
          break;
        case Proto.MSG_CHAT_REQUEST:
          typeName = 'hbonline.ChatRequest';
          break;
        case Proto.MSG_DELETE_CHARACTER_REQUEST:
          typeName = 'hbonline.DeleteCharacterRequest';
          break;
        default:
          return null;
      }

      const msgClass = this.root.lookupType(typeName);
      const err = msgClass.verify(data);
      if (err) {
        console.error(`Verify error for ${typeName}:`, err);
        return null;
      }
      const msg = msgClass.create(data);
      return msgClass.encode(msg).finish();
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
