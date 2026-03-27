// Message type IDs matching server/internal/network/codec.go

// Client -> Server
export const MSG_LOGIN_REQUEST = 0x01;
export const MSG_CREATE_CHARACTER_REQUEST = 0x02;
export const MSG_ENTER_GAME_REQUEST = 0x03;
export const MSG_MOTION_REQUEST = 0x04;
export const MSG_CHAT_REQUEST = 0x05;
export const MSG_DELETE_CHARACTER_REQUEST = 0x06;

// Server -> Client
export const MSG_LOGIN_RESPONSE = 0x81;
export const MSG_ENTER_GAME_RESPONSE = 0x82;
export const MSG_MOTION_EVENT = 0x83;
export const MSG_CHAT_MESSAGE = 0x84;
export const MSG_PLAYER_APPEAR = 0x85;
export const MSG_PLAYER_DISAPPEAR = 0x86;
export const MSG_NPC_APPEAR = 0x87;
export const MSG_NPC_DISAPPEAR = 0x88;
export const MSG_NPC_MOTION = 0x89;
export const MSG_NOTIFICATION = 0x8a;
export const MSG_PLAYER_CONTENTS = 0x8b;
export const MSG_MAP_CHANGE_RESPONSE = 0x8c;
export const MSG_CREATE_CHAR_RESPONSE = 0x8d;
export const MSG_DELETE_CHAR_RESPONSE = 0x8e;
