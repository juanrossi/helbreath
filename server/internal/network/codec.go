package network

import (
	"fmt"

	pb "github.com/juanrossi/hbonline/server/pkg/proto"
	"google.golang.org/protobuf/proto"
)

// Message type IDs (client -> server)
const (
	MsgLoginRequest          byte = 0x01
	MsgCreateCharacterRequest byte = 0x02
	MsgEnterGameRequest      byte = 0x03
	MsgMotionRequest         byte = 0x04
	MsgChatRequest           byte = 0x05
	MsgDeleteCharacterRequest byte = 0x06
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
	default:
		return msgType, nil, fmt.Errorf("unknown message type: 0x%02x", msgType)
	}

	if err := proto.Unmarshal(payload, msg); err != nil {
		return msgType, nil, fmt.Errorf("unmarshal 0x%02x: %w", msgType, err)
	}
	return msgType, msg, nil
}
