package network

import (
	"fmt"

	pb "github.com/juanrossi/hbonline/server/pkg/proto"
	"google.golang.org/protobuf/proto"
)

// Message type IDs (client -> server)
const (
	MsgLoginRequest           byte = 0x01
	MsgCreateCharacterRequest byte = 0x02
	MsgEnterGameRequest       byte = 0x03
	MsgMotionRequest          byte = 0x04
	MsgChatRequest            byte = 0x05
	MsgDeleteCharacterRequest byte = 0x06
	MsgAttackRequest          byte = 0x07
	MsgItemPickupRequest      byte = 0x08
	MsgItemUseRequest         byte = 0x09
	MsgItemEquipRequest       byte = 0x0A
	MsgItemDropRequest        byte = 0x0B
	MsgShopBuyRequest         byte = 0x0C
	MsgShopSellRequest        byte = 0x0D
	MsgStatAllocRequest       byte = 0x0E
	MsgSpellCastRequest       byte = 0x0F
	MsgLearnSpellRequest      byte = 0x10
	MsgSkillUseRequest        byte = 0x11
	MsgCraftRequest           byte = 0x12
	MsgFactionSelectRequest   byte = 0x13
	MsgGuildCreateRequest     byte = 0x14
	MsgGuildActionRequest     byte = 0x15
	MsgPartyActionRequest     byte = 0x16
	MsgPartyInviteResponse    byte = 0x17
	MsgTradeRequest           byte = 0x18
	MsgTradeResponse          byte = 0x19
	MsgTradeSetItem           byte = 0x1A
	MsgTradeSetGold           byte = 0x1B
	MsgTradeConfirm           byte = 0x1C
	MsgQuestAcceptRequest     byte = 0x1D
	MsgQuestTurnInRequest     byte = 0x1E
	MsgLogoutRequest          byte = 0x1F
)

// Message type IDs (server -> client)
const (
	MsgLoginResponse      byte = 0x81
	MsgEnterGameResponse  byte = 0x82
	MsgMotionEvent        byte = 0x83
	MsgChatMessage        byte = 0x84
	MsgPlayerAppear       byte = 0x85
	MsgPlayerDisappear    byte = 0x86
	MsgNpcAppear          byte = 0x87
	MsgNpcDisappear       byte = 0x88
	MsgNpcMotion          byte = 0x89
	MsgNotification       byte = 0x8A
	MsgPlayerContents     byte = 0x8B
	MsgMapChangeResponse  byte = 0x8C
	MsgCreateCharResponse byte = 0x8D
	MsgDeleteCharResponse byte = 0x8E
	MsgDamageEvent        byte = 0x8F
	MsgStatUpdate         byte = 0x90
	MsgDeathEvent         byte = 0x91
	MsgRespawnEvent       byte = 0x92
	MsgInventoryUpdate    byte = 0x93
	MsgGroundItemAppear   byte = 0x94
	MsgGroundItemDisappear byte = 0x95
	MsgShopOpen           byte = 0x96
	MsgShopResponse       byte = 0x97
	MsgSpellEffect        byte = 0x98
	MsgBuffUpdate         byte = 0x99
	MsgSpellList          byte = 0x9A
	MsgSkillList          byte = 0x9B
	MsgSkillResult        byte = 0x9C
	MsgCraftResult        byte = 0x9D
	MsgFactionSelectResponse byte = 0x9E
	MsgGuildInfo          byte = 0x9F
	MsgGuildActionResponse byte = 0xA0
	MsgPartyUpdate        byte = 0xA1
	MsgPartyInviteMsg     byte = 0xA2
	MsgPartyActionResponse byte = 0xA3
	MsgTradeIncoming      byte = 0xA4
	MsgTradeUpdate        byte = 0xA5
	MsgTradeComplete      byte = 0xA6
	MsgPKStatusUpdate     byte = 0xA7
	MsgQuestListUpdate    byte = 0xA8
	MsgQuestProgress      byte = 0xA9
	MsgQuestReward        byte = 0xAA
	MsgWorldState         byte = 0xAB
	MsgLogoutResponse     byte = 0xAC
)

// Encode wraps a protobuf message with a type byte prefix.
func Encode(msgType byte, msg proto.Message) ([]byte, error) {
	payload, err := proto.Marshal(msg)
	if err != nil {
		return nil, err
	}
	data := make([]byte, 1+len(payload))
	data[0] = msgType
	copy(data[1:], payload)
	return data, nil
}

// Decode reads the type byte and unmarshals the protobuf payload.
func Decode(data []byte) (byte, proto.Message, error) {
	if len(data) < 1 {
		return 0, nil, fmt.Errorf("empty message")
	}

	msgType := data[0]
	payload := data[1:]

	var msg proto.Message
	switch msgType {
	case MsgLoginRequest:
		msg = &pb.LoginRequest{}
	case MsgCreateCharacterRequest:
		msg = &pb.CreateCharacterRequest{}
	case MsgEnterGameRequest:
		msg = &pb.EnterGameRequest{}
	case MsgMotionRequest:
		msg = &pb.MotionRequest{}
	case MsgChatRequest:
		msg = &pb.ChatRequest{}
	case MsgDeleteCharacterRequest:
		msg = &pb.DeleteCharacterRequest{}
	case MsgAttackRequest:
		msg = &pb.MotionRequest{} // reuse MotionRequest with action=3 and target_id
	case MsgItemPickupRequest:
		msg = &pb.ItemPickupRequest{}
	case MsgItemUseRequest:
		msg = &pb.ItemUseRequest{}
	case MsgItemEquipRequest:
		msg = &pb.ItemEquipRequest{}
	case MsgItemDropRequest:
		msg = &pb.ItemDropRequest{}
	case MsgShopBuyRequest:
		msg = &pb.ShopBuyRequest{}
	case MsgShopSellRequest:
		msg = &pb.ShopSellRequest{}
	case MsgStatAllocRequest:
		msg = &pb.StatAllocRequest{}
	case MsgSpellCastRequest:
		msg = &pb.SpellCastRequest{}
	case MsgLearnSpellRequest:
		msg = &pb.LearnSpellRequest{}
	case MsgSkillUseRequest:
		msg = &pb.SkillUseRequest{}
	case MsgCraftRequest:
		msg = &pb.CraftRequest{}
	case MsgFactionSelectRequest:
		msg = &pb.FactionSelectRequest{}
	case MsgGuildCreateRequest:
		msg = &pb.GuildCreateRequest{}
	case MsgGuildActionRequest:
		msg = &pb.GuildActionRequest{}
	case MsgPartyActionRequest:
		msg = &pb.PartyActionRequest{}
	case MsgPartyInviteResponse:
		msg = &pb.PartyInviteResponse{}
	case MsgTradeRequest:
		msg = &pb.TradeRequest{}
	case MsgTradeResponse:
		msg = &pb.TradeResponse{}
	case MsgTradeSetItem:
		msg = &pb.TradeSetItem{}
	case MsgTradeSetGold:
		msg = &pb.TradeSetGold{}
	case MsgTradeConfirm:
		msg = &pb.TradeConfirm{}
	case MsgQuestAcceptRequest:
		msg = &pb.QuestAcceptRequest{}
	case MsgQuestTurnInRequest:
		msg = &pb.QuestTurnInRequest{}
	case MsgLogoutRequest:
		msg = &pb.LogoutRequest{}
	default:
		return msgType, nil, fmt.Errorf("unknown message type: 0x%02x", msgType)
	}

	if err := proto.Unmarshal(payload, msg); err != nil {
		return msgType, nil, fmt.Errorf("unmarshal 0x%02x: %w", msgType, err)
	}
	return msgType, msg, nil
}
