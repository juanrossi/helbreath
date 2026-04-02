import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace hbonline. */
export namespace hbonline {

    /** Properties of a LoginRequest. */
    interface ILoginRequest {

        /** LoginRequest username */
        username?: (string|null);

        /** LoginRequest password */
        password?: (string|null);

        /** LoginRequest register */
        register?: (boolean|null);
    }

    /** Represents a LoginRequest. */
    class LoginRequest implements ILoginRequest {

        /**
         * Constructs a new LoginRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ILoginRequest);

        /** LoginRequest username. */
        public username: string;

        /** LoginRequest password. */
        public password: string;

        /** LoginRequest register. */
        public register: boolean;

        /**
         * Creates a new LoginRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginRequest instance
         */
        public static create(properties?: hbonline.ILoginRequest): hbonline.LoginRequest;

        /**
         * Encodes the specified LoginRequest message. Does not implicitly {@link hbonline.LoginRequest.verify|verify} messages.
         * @param message LoginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ILoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.LoginRequest;

        /**
         * Gets the default type url for LoginRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginResponse. */
    interface ILoginResponse {

        /** LoginResponse success */
        success?: (boolean|null);

        /** LoginResponse error */
        error?: (string|null);

        /** LoginResponse characters */
        characters?: (hbonline.ICharacterSummary[]|null);

        /** LoginResponse token */
        token?: (string|null);
    }

    /** Represents a LoginResponse. */
    class LoginResponse implements ILoginResponse {

        /**
         * Constructs a new LoginResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ILoginResponse);

        /** LoginResponse success. */
        public success: boolean;

        /** LoginResponse error. */
        public error: string;

        /** LoginResponse characters. */
        public characters: hbonline.ICharacterSummary[];

        /** LoginResponse token. */
        public token: string;

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginResponse instance
         */
        public static create(properties?: hbonline.ILoginResponse): hbonline.LoginResponse;

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link hbonline.LoginResponse.verify|verify} messages.
         * @param message LoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ILoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.LoginResponse;

        /**
         * Gets the default type url for LoginResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CharacterSummary. */
    interface ICharacterSummary {

        /** CharacterSummary id */
        id?: (number|null);

        /** CharacterSummary name */
        name?: (string|null);

        /** CharacterSummary level */
        level?: (number|null);

        /** CharacterSummary gender */
        gender?: (number|null);

        /** CharacterSummary side */
        side?: (number|null);

        /** CharacterSummary mapName */
        mapName?: (string|null);

        /** CharacterSummary appearance */
        appearance?: (hbonline.IAppearance|null);
    }

    /** Represents a CharacterSummary. */
    class CharacterSummary implements ICharacterSummary {

        /**
         * Constructs a new CharacterSummary.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ICharacterSummary);

        /** CharacterSummary id. */
        public id: number;

        /** CharacterSummary name. */
        public name: string;

        /** CharacterSummary level. */
        public level: number;

        /** CharacterSummary gender. */
        public gender: number;

        /** CharacterSummary side. */
        public side: number;

        /** CharacterSummary mapName. */
        public mapName: string;

        /** CharacterSummary appearance. */
        public appearance?: (hbonline.IAppearance|null);

        /**
         * Creates a new CharacterSummary instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharacterSummary instance
         */
        public static create(properties?: hbonline.ICharacterSummary): hbonline.CharacterSummary;

        /**
         * Encodes the specified CharacterSummary message. Does not implicitly {@link hbonline.CharacterSummary.verify|verify} messages.
         * @param message CharacterSummary message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ICharacterSummary, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharacterSummary message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharacterSummary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.CharacterSummary;

        /**
         * Gets the default type url for CharacterSummary
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateCharacterRequest. */
    interface ICreateCharacterRequest {

        /** CreateCharacterRequest name */
        name?: (string|null);

        /** CreateCharacterRequest gender */
        gender?: (number|null);

        /** CreateCharacterRequest skinColor */
        skinColor?: (number|null);

        /** CreateCharacterRequest hairStyle */
        hairStyle?: (number|null);

        /** CreateCharacterRequest hairColor */
        hairColor?: (number|null);

        /** CreateCharacterRequest underwearColor */
        underwearColor?: (number|null);

        /** CreateCharacterRequest str */
        str?: (number|null);

        /** CreateCharacterRequest vit */
        vit?: (number|null);

        /** CreateCharacterRequest dex */
        dex?: (number|null);

        /** CreateCharacterRequest intStat */
        intStat?: (number|null);

        /** CreateCharacterRequest mag */
        mag?: (number|null);

        /** CreateCharacterRequest charisma */
        charisma?: (number|null);
    }

    /** Represents a CreateCharacterRequest. */
    class CreateCharacterRequest implements ICreateCharacterRequest {

        /**
         * Constructs a new CreateCharacterRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ICreateCharacterRequest);

        /** CreateCharacterRequest name. */
        public name: string;

        /** CreateCharacterRequest gender. */
        public gender: number;

        /** CreateCharacterRequest skinColor. */
        public skinColor: number;

        /** CreateCharacterRequest hairStyle. */
        public hairStyle: number;

        /** CreateCharacterRequest hairColor. */
        public hairColor: number;

        /** CreateCharacterRequest underwearColor. */
        public underwearColor: number;

        /** CreateCharacterRequest str. */
        public str: number;

        /** CreateCharacterRequest vit. */
        public vit: number;

        /** CreateCharacterRequest dex. */
        public dex: number;

        /** CreateCharacterRequest intStat. */
        public intStat: number;

        /** CreateCharacterRequest mag. */
        public mag: number;

        /** CreateCharacterRequest charisma. */
        public charisma: number;

        /**
         * Creates a new CreateCharacterRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateCharacterRequest instance
         */
        public static create(properties?: hbonline.ICreateCharacterRequest): hbonline.CreateCharacterRequest;

        /**
         * Encodes the specified CreateCharacterRequest message. Does not implicitly {@link hbonline.CreateCharacterRequest.verify|verify} messages.
         * @param message CreateCharacterRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ICreateCharacterRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateCharacterRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateCharacterRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.CreateCharacterRequest;

        /**
         * Gets the default type url for CreateCharacterRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateCharacterResponse. */
    interface ICreateCharacterResponse {

        /** CreateCharacterResponse success */
        success?: (boolean|null);

        /** CreateCharacterResponse error */
        error?: (string|null);

        /** CreateCharacterResponse characters */
        characters?: (hbonline.ICharacterSummary[]|null);
    }

    /** Represents a CreateCharacterResponse. */
    class CreateCharacterResponse implements ICreateCharacterResponse {

        /**
         * Constructs a new CreateCharacterResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ICreateCharacterResponse);

        /** CreateCharacterResponse success. */
        public success: boolean;

        /** CreateCharacterResponse error. */
        public error: string;

        /** CreateCharacterResponse characters. */
        public characters: hbonline.ICharacterSummary[];

        /**
         * Creates a new CreateCharacterResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateCharacterResponse instance
         */
        public static create(properties?: hbonline.ICreateCharacterResponse): hbonline.CreateCharacterResponse;

        /**
         * Encodes the specified CreateCharacterResponse message. Does not implicitly {@link hbonline.CreateCharacterResponse.verify|verify} messages.
         * @param message CreateCharacterResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ICreateCharacterResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateCharacterResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateCharacterResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.CreateCharacterResponse;

        /**
         * Gets the default type url for CreateCharacterResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterGameRequest. */
    interface IEnterGameRequest {

        /** EnterGameRequest characterId */
        characterId?: (number|null);
    }

    /** Represents an EnterGameRequest. */
    class EnterGameRequest implements IEnterGameRequest {

        /**
         * Constructs a new EnterGameRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IEnterGameRequest);

        /** EnterGameRequest characterId. */
        public characterId: number;

        /**
         * Creates a new EnterGameRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterGameRequest instance
         */
        public static create(properties?: hbonline.IEnterGameRequest): hbonline.EnterGameRequest;

        /**
         * Encodes the specified EnterGameRequest message. Does not implicitly {@link hbonline.EnterGameRequest.verify|verify} messages.
         * @param message EnterGameRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IEnterGameRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterGameRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.EnterGameRequest;

        /**
         * Gets the default type url for EnterGameRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteCharacterRequest. */
    interface IDeleteCharacterRequest {

        /** DeleteCharacterRequest characterId */
        characterId?: (number|null);
    }

    /** Represents a DeleteCharacterRequest. */
    class DeleteCharacterRequest implements IDeleteCharacterRequest {

        /**
         * Constructs a new DeleteCharacterRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IDeleteCharacterRequest);

        /** DeleteCharacterRequest characterId. */
        public characterId: number;

        /**
         * Creates a new DeleteCharacterRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteCharacterRequest instance
         */
        public static create(properties?: hbonline.IDeleteCharacterRequest): hbonline.DeleteCharacterRequest;

        /**
         * Encodes the specified DeleteCharacterRequest message. Does not implicitly {@link hbonline.DeleteCharacterRequest.verify|verify} messages.
         * @param message DeleteCharacterRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IDeleteCharacterRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteCharacterRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteCharacterRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.DeleteCharacterRequest;

        /**
         * Gets the default type url for DeleteCharacterRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteCharacterResponse. */
    interface IDeleteCharacterResponse {

        /** DeleteCharacterResponse success */
        success?: (boolean|null);

        /** DeleteCharacterResponse error */
        error?: (string|null);

        /** DeleteCharacterResponse characters */
        characters?: (hbonline.ICharacterSummary[]|null);
    }

    /** Represents a DeleteCharacterResponse. */
    class DeleteCharacterResponse implements IDeleteCharacterResponse {

        /**
         * Constructs a new DeleteCharacterResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IDeleteCharacterResponse);

        /** DeleteCharacterResponse success. */
        public success: boolean;

        /** DeleteCharacterResponse error. */
        public error: string;

        /** DeleteCharacterResponse characters. */
        public characters: hbonline.ICharacterSummary[];

        /**
         * Creates a new DeleteCharacterResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteCharacterResponse instance
         */
        public static create(properties?: hbonline.IDeleteCharacterResponse): hbonline.DeleteCharacterResponse;

        /**
         * Encodes the specified DeleteCharacterResponse message. Does not implicitly {@link hbonline.DeleteCharacterResponse.verify|verify} messages.
         * @param message DeleteCharacterResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IDeleteCharacterResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteCharacterResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteCharacterResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.DeleteCharacterResponse;

        /**
         * Gets the default type url for DeleteCharacterResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Vec2. */
    interface IVec2 {

        /** Vec2 x */
        x?: (number|null);

        /** Vec2 y */
        y?: (number|null);
    }

    /** Represents a Vec2. */
    class Vec2 implements IVec2 {

        /**
         * Constructs a new Vec2.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IVec2);

        /** Vec2 x. */
        public x: number;

        /** Vec2 y. */
        public y: number;

        /**
         * Creates a new Vec2 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Vec2 instance
         */
        public static create(properties?: hbonline.IVec2): hbonline.Vec2;

        /**
         * Encodes the specified Vec2 message. Does not implicitly {@link hbonline.Vec2.verify|verify} messages.
         * @param message Vec2 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IVec2, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Vec2 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Vec2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.Vec2;

        /**
         * Gets the default type url for Vec2
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Appearance. */
    interface IAppearance {

        /** Appearance gender */
        gender?: (number|null);

        /** Appearance skinColor */
        skinColor?: (number|null);

        /** Appearance hairStyle */
        hairStyle?: (number|null);

        /** Appearance hairColor */
        hairColor?: (number|null);

        /** Appearance underwearColor */
        underwearColor?: (number|null);

        /** Appearance bodyArmor */
        bodyArmor?: (number|null);

        /** Appearance armArmor */
        armArmor?: (number|null);

        /** Appearance leggings */
        leggings?: (number|null);

        /** Appearance helm */
        helm?: (number|null);

        /** Appearance weapon */
        weapon?: (number|null);

        /** Appearance shield */
        shield?: (number|null);

        /** Appearance cape */
        cape?: (number|null);

        /** Appearance boots */
        boots?: (number|null);

        /** Appearance apprColor */
        apprColor?: (number|null);
    }

    /** Represents an Appearance. */
    class Appearance implements IAppearance {

        /**
         * Constructs a new Appearance.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IAppearance);

        /** Appearance gender. */
        public gender: number;

        /** Appearance skinColor. */
        public skinColor: number;

        /** Appearance hairStyle. */
        public hairStyle: number;

        /** Appearance hairColor. */
        public hairColor: number;

        /** Appearance underwearColor. */
        public underwearColor: number;

        /** Appearance bodyArmor. */
        public bodyArmor: number;

        /** Appearance armArmor. */
        public armArmor: number;

        /** Appearance leggings. */
        public leggings: number;

        /** Appearance helm. */
        public helm: number;

        /** Appearance weapon. */
        public weapon: number;

        /** Appearance shield. */
        public shield: number;

        /** Appearance cape. */
        public cape: number;

        /** Appearance boots. */
        public boots: number;

        /** Appearance apprColor. */
        public apprColor: number;

        /**
         * Creates a new Appearance instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Appearance instance
         */
        public static create(properties?: hbonline.IAppearance): hbonline.Appearance;

        /**
         * Encodes the specified Appearance message. Does not implicitly {@link hbonline.Appearance.verify|verify} messages.
         * @param message Appearance message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IAppearance, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Appearance message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Appearance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.Appearance;

        /**
         * Gets the default type url for Appearance
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatRequest. */
    interface IChatRequest {

        /** ChatRequest type */
        type?: (number|null);

        /** ChatRequest message */
        message?: (string|null);

        /** ChatRequest target */
        target?: (string|null);
    }

    /** Represents a ChatRequest. */
    class ChatRequest implements IChatRequest {

        /**
         * Constructs a new ChatRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IChatRequest);

        /** ChatRequest type. */
        public type: number;

        /** ChatRequest message. */
        public message: string;

        /** ChatRequest target. */
        public target: string;

        /**
         * Creates a new ChatRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatRequest instance
         */
        public static create(properties?: hbonline.IChatRequest): hbonline.ChatRequest;

        /**
         * Encodes the specified ChatRequest message. Does not implicitly {@link hbonline.ChatRequest.verify|verify} messages.
         * @param message ChatRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IChatRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ChatRequest;

        /**
         * Gets the default type url for ChatRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatMessage. */
    interface IChatMessage {

        /** ChatMessage objectId */
        objectId?: (number|null);

        /** ChatMessage senderName */
        senderName?: (string|null);

        /** ChatMessage type */
        type?: (number|null);

        /** ChatMessage message */
        message?: (string|null);

        /** ChatMessage position */
        position?: (hbonline.IVec2|null);
    }

    /** Represents a ChatMessage. */
    class ChatMessage implements IChatMessage {

        /**
         * Constructs a new ChatMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IChatMessage);

        /** ChatMessage objectId. */
        public objectId: number;

        /** ChatMessage senderName. */
        public senderName: string;

        /** ChatMessage type. */
        public type: number;

        /** ChatMessage message. */
        public message: string;

        /** ChatMessage position. */
        public position?: (hbonline.IVec2|null);

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatMessage instance
         */
        public static create(properties?: hbonline.IChatMessage): hbonline.ChatMessage;

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link hbonline.ChatMessage.verify|verify} messages.
         * @param message ChatMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ChatMessage;

        /**
         * Gets the default type url for ChatMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterGameResponse. */
    interface IEnterGameResponse {

        /** EnterGameResponse player */
        player?: (hbonline.IPlayerContents|null);

        /** EnterGameResponse mapInfo */
        mapInfo?: (hbonline.IMapInfo|null);

        /** EnterGameResponse nearbyPlayers */
        nearbyPlayers?: (hbonline.IEntityInfo[]|null);

        /** EnterGameResponse nearbyNpcs */
        nearbyNpcs?: (hbonline.IEntityInfo[]|null);
    }

    /** Represents an EnterGameResponse. */
    class EnterGameResponse implements IEnterGameResponse {

        /**
         * Constructs a new EnterGameResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IEnterGameResponse);

        /** EnterGameResponse player. */
        public player?: (hbonline.IPlayerContents|null);

        /** EnterGameResponse mapInfo. */
        public mapInfo?: (hbonline.IMapInfo|null);

        /** EnterGameResponse nearbyPlayers. */
        public nearbyPlayers: hbonline.IEntityInfo[];

        /** EnterGameResponse nearbyNpcs. */
        public nearbyNpcs: hbonline.IEntityInfo[];

        /**
         * Creates a new EnterGameResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterGameResponse instance
         */
        public static create(properties?: hbonline.IEnterGameResponse): hbonline.EnterGameResponse;

        /**
         * Encodes the specified EnterGameResponse message. Does not implicitly {@link hbonline.EnterGameResponse.verify|verify} messages.
         * @param message EnterGameResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IEnterGameResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterGameResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.EnterGameResponse;

        /**
         * Gets the default type url for EnterGameResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerContents. */
    interface IPlayerContents {

        /** PlayerContents objectId */
        objectId?: (number|null);

        /** PlayerContents name */
        name?: (string|null);

        /** PlayerContents mapName */
        mapName?: (string|null);

        /** PlayerContents position */
        position?: (hbonline.IVec2|null);

        /** PlayerContents direction */
        direction?: (number|null);

        /** PlayerContents appearance */
        appearance?: (hbonline.IAppearance|null);

        /** PlayerContents level */
        level?: (number|null);

        /** PlayerContents experience */
        experience?: (number|Long|null);

        /** PlayerContents hp */
        hp?: (number|null);

        /** PlayerContents maxHp */
        maxHp?: (number|null);

        /** PlayerContents mp */
        mp?: (number|null);

        /** PlayerContents maxMp */
        maxMp?: (number|null);

        /** PlayerContents sp */
        sp?: (number|null);

        /** PlayerContents maxSp */
        maxSp?: (number|null);

        /** PlayerContents str */
        str?: (number|null);

        /** PlayerContents vit */
        vit?: (number|null);

        /** PlayerContents dex */
        dex?: (number|null);

        /** PlayerContents intStat */
        intStat?: (number|null);

        /** PlayerContents mag */
        mag?: (number|null);

        /** PlayerContents charisma */
        charisma?: (number|null);

        /** PlayerContents luPool */
        luPool?: (number|null);

        /** PlayerContents side */
        side?: (number|null);

        /** PlayerContents gold */
        gold?: (number|Long|null);

        /** PlayerContents pkCount */
        pkCount?: (number|null);

        /** PlayerContents ekCount */
        ekCount?: (number|null);

        /** PlayerContents hunger */
        hunger?: (number|null);

        /** PlayerContents adminLevel */
        adminLevel?: (number|null);

        /** PlayerContents introShown */
        introShown?: (boolean|null);
    }

    /** Represents a PlayerContents. */
    class PlayerContents implements IPlayerContents {

        /**
         * Constructs a new PlayerContents.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPlayerContents);

        /** PlayerContents objectId. */
        public objectId: number;

        /** PlayerContents name. */
        public name: string;

        /** PlayerContents mapName. */
        public mapName: string;

        /** PlayerContents position. */
        public position?: (hbonline.IVec2|null);

        /** PlayerContents direction. */
        public direction: number;

        /** PlayerContents appearance. */
        public appearance?: (hbonline.IAppearance|null);

        /** PlayerContents level. */
        public level: number;

        /** PlayerContents experience. */
        public experience: (number|Long);

        /** PlayerContents hp. */
        public hp: number;

        /** PlayerContents maxHp. */
        public maxHp: number;

        /** PlayerContents mp. */
        public mp: number;

        /** PlayerContents maxMp. */
        public maxMp: number;

        /** PlayerContents sp. */
        public sp: number;

        /** PlayerContents maxSp. */
        public maxSp: number;

        /** PlayerContents str. */
        public str: number;

        /** PlayerContents vit. */
        public vit: number;

        /** PlayerContents dex. */
        public dex: number;

        /** PlayerContents intStat. */
        public intStat: number;

        /** PlayerContents mag. */
        public mag: number;

        /** PlayerContents charisma. */
        public charisma: number;

        /** PlayerContents luPool. */
        public luPool: number;

        /** PlayerContents side. */
        public side: number;

        /** PlayerContents gold. */
        public gold: (number|Long);

        /** PlayerContents pkCount. */
        public pkCount: number;

        /** PlayerContents ekCount. */
        public ekCount: number;

        /** PlayerContents hunger. */
        public hunger: number;

        /** PlayerContents adminLevel. */
        public adminLevel: number;

        /** PlayerContents introShown. */
        public introShown: boolean;

        /**
         * Creates a new PlayerContents instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerContents instance
         */
        public static create(properties?: hbonline.IPlayerContents): hbonline.PlayerContents;

        /**
         * Encodes the specified PlayerContents message. Does not implicitly {@link hbonline.PlayerContents.verify|verify} messages.
         * @param message PlayerContents message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPlayerContents, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerContents message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerContents
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PlayerContents;

        /**
         * Gets the default type url for PlayerContents
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MapInfo. */
    interface IMapInfo {

        /** MapInfo name */
        name?: (string|null);

        /** MapInfo width */
        width?: (number|null);

        /** MapInfo height */
        height?: (number|null);

        /** MapInfo collisionGrid */
        collisionGrid?: (Uint8Array|null);
    }

    /** Represents a MapInfo. */
    class MapInfo implements IMapInfo {

        /**
         * Constructs a new MapInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IMapInfo);

        /** MapInfo name. */
        public name: string;

        /** MapInfo width. */
        public width: number;

        /** MapInfo height. */
        public height: number;

        /** MapInfo collisionGrid. */
        public collisionGrid: Uint8Array;

        /**
         * Creates a new MapInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MapInfo instance
         */
        public static create(properties?: hbonline.IMapInfo): hbonline.MapInfo;

        /**
         * Encodes the specified MapInfo message. Does not implicitly {@link hbonline.MapInfo.verify|verify} messages.
         * @param message MapInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IMapInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MapInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MapInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.MapInfo;

        /**
         * Gets the default type url for MapInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MotionRequest. */
    interface IMotionRequest {

        /** MotionRequest direction */
        direction?: (number|null);

        /** MotionRequest action */
        action?: (number|null);

        /** MotionRequest position */
        position?: (hbonline.IVec2|null);

        /** MotionRequest targetId */
        targetId?: (number|null);

        /** MotionRequest spellId */
        spellId?: (number|null);
    }

    /** Represents a MotionRequest. */
    class MotionRequest implements IMotionRequest {

        /**
         * Constructs a new MotionRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IMotionRequest);

        /** MotionRequest direction. */
        public direction: number;

        /** MotionRequest action. */
        public action: number;

        /** MotionRequest position. */
        public position?: (hbonline.IVec2|null);

        /** MotionRequest targetId. */
        public targetId: number;

        /** MotionRequest spellId. */
        public spellId: number;

        /**
         * Creates a new MotionRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MotionRequest instance
         */
        public static create(properties?: hbonline.IMotionRequest): hbonline.MotionRequest;

        /**
         * Encodes the specified MotionRequest message. Does not implicitly {@link hbonline.MotionRequest.verify|verify} messages.
         * @param message MotionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IMotionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MotionRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MotionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.MotionRequest;

        /**
         * Gets the default type url for MotionRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MotionEvent. */
    interface IMotionEvent {

        /** MotionEvent objectId */
        objectId?: (number|null);

        /** MotionEvent ownerType */
        ownerType?: (number|null);

        /** MotionEvent action */
        action?: (number|null);

        /** MotionEvent direction */
        direction?: (number|null);

        /** MotionEvent position */
        position?: (hbonline.IVec2|null);

        /** MotionEvent destination */
        destination?: (hbonline.IVec2|null);

        /** MotionEvent speed */
        speed?: (number|null);

        /** MotionEvent appearance */
        appearance?: (hbonline.IAppearance|null);

        /** MotionEvent name */
        name?: (string|null);

        /** MotionEvent status */
        status?: (number|null);
    }

    /** Represents a MotionEvent. */
    class MotionEvent implements IMotionEvent {

        /**
         * Constructs a new MotionEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IMotionEvent);

        /** MotionEvent objectId. */
        public objectId: number;

        /** MotionEvent ownerType. */
        public ownerType: number;

        /** MotionEvent action. */
        public action: number;

        /** MotionEvent direction. */
        public direction: number;

        /** MotionEvent position. */
        public position?: (hbonline.IVec2|null);

        /** MotionEvent destination. */
        public destination?: (hbonline.IVec2|null);

        /** MotionEvent speed. */
        public speed: number;

        /** MotionEvent appearance. */
        public appearance?: (hbonline.IAppearance|null);

        /** MotionEvent name. */
        public name: string;

        /** MotionEvent status. */
        public status: number;

        /**
         * Creates a new MotionEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MotionEvent instance
         */
        public static create(properties?: hbonline.IMotionEvent): hbonline.MotionEvent;

        /**
         * Encodes the specified MotionEvent message. Does not implicitly {@link hbonline.MotionEvent.verify|verify} messages.
         * @param message MotionEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IMotionEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MotionEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MotionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.MotionEvent;

        /**
         * Gets the default type url for MotionEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerAppear. */
    interface IPlayerAppear {

        /** PlayerAppear objectId */
        objectId?: (number|null);

        /** PlayerAppear name */
        name?: (string|null);

        /** PlayerAppear position */
        position?: (hbonline.IVec2|null);

        /** PlayerAppear direction */
        direction?: (number|null);

        /** PlayerAppear appearance */
        appearance?: (hbonline.IAppearance|null);

        /** PlayerAppear action */
        action?: (number|null);

        /** PlayerAppear level */
        level?: (number|null);

        /** PlayerAppear side */
        side?: (number|null);

        /** PlayerAppear status */
        status?: (number|null);

        /** PlayerAppear pkCount */
        pkCount?: (number|null);
    }

    /** Represents a PlayerAppear. */
    class PlayerAppear implements IPlayerAppear {

        /**
         * Constructs a new PlayerAppear.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPlayerAppear);

        /** PlayerAppear objectId. */
        public objectId: number;

        /** PlayerAppear name. */
        public name: string;

        /** PlayerAppear position. */
        public position?: (hbonline.IVec2|null);

        /** PlayerAppear direction. */
        public direction: number;

        /** PlayerAppear appearance. */
        public appearance?: (hbonline.IAppearance|null);

        /** PlayerAppear action. */
        public action: number;

        /** PlayerAppear level. */
        public level: number;

        /** PlayerAppear side. */
        public side: number;

        /** PlayerAppear status. */
        public status: number;

        /** PlayerAppear pkCount. */
        public pkCount: number;

        /**
         * Creates a new PlayerAppear instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerAppear instance
         */
        public static create(properties?: hbonline.IPlayerAppear): hbonline.PlayerAppear;

        /**
         * Encodes the specified PlayerAppear message. Does not implicitly {@link hbonline.PlayerAppear.verify|verify} messages.
         * @param message PlayerAppear message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPlayerAppear, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerAppear message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PlayerAppear;

        /**
         * Gets the default type url for PlayerAppear
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PlayerDisappear. */
    interface IPlayerDisappear {

        /** PlayerDisappear objectId */
        objectId?: (number|null);
    }

    /** Represents a PlayerDisappear. */
    class PlayerDisappear implements IPlayerDisappear {

        /**
         * Constructs a new PlayerDisappear.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPlayerDisappear);

        /** PlayerDisappear objectId. */
        public objectId: number;

        /**
         * Creates a new PlayerDisappear instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerDisappear instance
         */
        public static create(properties?: hbonline.IPlayerDisappear): hbonline.PlayerDisappear;

        /**
         * Encodes the specified PlayerDisappear message. Does not implicitly {@link hbonline.PlayerDisappear.verify|verify} messages.
         * @param message PlayerDisappear message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPlayerDisappear, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerDisappear message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PlayerDisappear;

        /**
         * Gets the default type url for PlayerDisappear
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NpcAppear. */
    interface INpcAppear {

        /** NpcAppear objectId */
        objectId?: (number|null);

        /** NpcAppear name */
        name?: (string|null);

        /** NpcAppear npcType */
        npcType?: (number|null);

        /** NpcAppear position */
        position?: (hbonline.IVec2|null);

        /** NpcAppear direction */
        direction?: (number|null);

        /** NpcAppear action */
        action?: (number|null);

        /** NpcAppear status */
        status?: (number|null);
    }

    /** Represents a NpcAppear. */
    class NpcAppear implements INpcAppear {

        /**
         * Constructs a new NpcAppear.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.INpcAppear);

        /** NpcAppear objectId. */
        public objectId: number;

        /** NpcAppear name. */
        public name: string;

        /** NpcAppear npcType. */
        public npcType: number;

        /** NpcAppear position. */
        public position?: (hbonline.IVec2|null);

        /** NpcAppear direction. */
        public direction: number;

        /** NpcAppear action. */
        public action: number;

        /** NpcAppear status. */
        public status: number;

        /**
         * Creates a new NpcAppear instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NpcAppear instance
         */
        public static create(properties?: hbonline.INpcAppear): hbonline.NpcAppear;

        /**
         * Encodes the specified NpcAppear message. Does not implicitly {@link hbonline.NpcAppear.verify|verify} messages.
         * @param message NpcAppear message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.INpcAppear, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NpcAppear message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NpcAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.NpcAppear;

        /**
         * Gets the default type url for NpcAppear
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NpcDisappear. */
    interface INpcDisappear {

        /** NpcDisappear objectId */
        objectId?: (number|null);
    }

    /** Represents a NpcDisappear. */
    class NpcDisappear implements INpcDisappear {

        /**
         * Constructs a new NpcDisappear.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.INpcDisappear);

        /** NpcDisappear objectId. */
        public objectId: number;

        /**
         * Creates a new NpcDisappear instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NpcDisappear instance
         */
        public static create(properties?: hbonline.INpcDisappear): hbonline.NpcDisappear;

        /**
         * Encodes the specified NpcDisappear message. Does not implicitly {@link hbonline.NpcDisappear.verify|verify} messages.
         * @param message NpcDisappear message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.INpcDisappear, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NpcDisappear message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NpcDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.NpcDisappear;

        /**
         * Gets the default type url for NpcDisappear
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NpcMotion. */
    interface INpcMotion {

        /** NpcMotion objectId */
        objectId?: (number|null);

        /** NpcMotion action */
        action?: (number|null);

        /** NpcMotion direction */
        direction?: (number|null);

        /** NpcMotion position */
        position?: (hbonline.IVec2|null);

        /** NpcMotion destination */
        destination?: (hbonline.IVec2|null);

        /** NpcMotion speed */
        speed?: (number|null);

        /** NpcMotion name */
        name?: (string|null);

        /** NpcMotion npcType */
        npcType?: (number|null);
    }

    /** Represents a NpcMotion. */
    class NpcMotion implements INpcMotion {

        /**
         * Constructs a new NpcMotion.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.INpcMotion);

        /** NpcMotion objectId. */
        public objectId: number;

        /** NpcMotion action. */
        public action: number;

        /** NpcMotion direction. */
        public direction: number;

        /** NpcMotion position. */
        public position?: (hbonline.IVec2|null);

        /** NpcMotion destination. */
        public destination?: (hbonline.IVec2|null);

        /** NpcMotion speed. */
        public speed: number;

        /** NpcMotion name. */
        public name: string;

        /** NpcMotion npcType. */
        public npcType: number;

        /**
         * Creates a new NpcMotion instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NpcMotion instance
         */
        public static create(properties?: hbonline.INpcMotion): hbonline.NpcMotion;

        /**
         * Encodes the specified NpcMotion message. Does not implicitly {@link hbonline.NpcMotion.verify|verify} messages.
         * @param message NpcMotion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.INpcMotion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NpcMotion message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NpcMotion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.NpcMotion;

        /**
         * Gets the default type url for NpcMotion
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Notification. */
    interface INotification {

        /** Notification message */
        message?: (string|null);

        /** Notification type */
        type?: (number|null);
    }

    /** Represents a Notification. */
    class Notification implements INotification {

        /**
         * Constructs a new Notification.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.INotification);

        /** Notification message. */
        public message: string;

        /** Notification type. */
        public type: number;

        /**
         * Creates a new Notification instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Notification instance
         */
        public static create(properties?: hbonline.INotification): hbonline.Notification;

        /**
         * Encodes the specified Notification message. Does not implicitly {@link hbonline.Notification.verify|verify} messages.
         * @param message Notification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.INotification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Notification message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Notification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.Notification;

        /**
         * Gets the default type url for Notification
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MapChangeResponse. */
    interface IMapChangeResponse {

        /** MapChangeResponse mapName */
        mapName?: (string|null);

        /** MapChangeResponse position */
        position?: (hbonline.IVec2|null);

        /** MapChangeResponse direction */
        direction?: (number|null);
    }

    /** Represents a MapChangeResponse. */
    class MapChangeResponse implements IMapChangeResponse {

        /**
         * Constructs a new MapChangeResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IMapChangeResponse);

        /** MapChangeResponse mapName. */
        public mapName: string;

        /** MapChangeResponse position. */
        public position?: (hbonline.IVec2|null);

        /** MapChangeResponse direction. */
        public direction: number;

        /**
         * Creates a new MapChangeResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MapChangeResponse instance
         */
        public static create(properties?: hbonline.IMapChangeResponse): hbonline.MapChangeResponse;

        /**
         * Encodes the specified MapChangeResponse message. Does not implicitly {@link hbonline.MapChangeResponse.verify|verify} messages.
         * @param message MapChangeResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IMapChangeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MapChangeResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MapChangeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.MapChangeResponse;

        /**
         * Gets the default type url for MapChangeResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DamageEvent. */
    interface IDamageEvent {

        /** DamageEvent attackerId */
        attackerId?: (number|null);

        /** DamageEvent targetId */
        targetId?: (number|null);

        /** DamageEvent targetType */
        targetType?: (number|null);

        /** DamageEvent damage */
        damage?: (number|null);

        /** DamageEvent critical */
        critical?: (boolean|null);

        /** DamageEvent miss */
        miss?: (boolean|null);

        /** DamageEvent targetHp */
        targetHp?: (number|null);

        /** DamageEvent targetMaxHp */
        targetMaxHp?: (number|null);
    }

    /** Represents a DamageEvent. */
    class DamageEvent implements IDamageEvent {

        /**
         * Constructs a new DamageEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IDamageEvent);

        /** DamageEvent attackerId. */
        public attackerId: number;

        /** DamageEvent targetId. */
        public targetId: number;

        /** DamageEvent targetType. */
        public targetType: number;

        /** DamageEvent damage. */
        public damage: number;

        /** DamageEvent critical. */
        public critical: boolean;

        /** DamageEvent miss. */
        public miss: boolean;

        /** DamageEvent targetHp. */
        public targetHp: number;

        /** DamageEvent targetMaxHp. */
        public targetMaxHp: number;

        /**
         * Creates a new DamageEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DamageEvent instance
         */
        public static create(properties?: hbonline.IDamageEvent): hbonline.DamageEvent;

        /**
         * Encodes the specified DamageEvent message. Does not implicitly {@link hbonline.DamageEvent.verify|verify} messages.
         * @param message DamageEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IDamageEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DamageEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DamageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.DamageEvent;

        /**
         * Gets the default type url for DamageEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a StatUpdate. */
    interface IStatUpdate {

        /** StatUpdate hp */
        hp?: (number|null);

        /** StatUpdate maxHp */
        maxHp?: (number|null);

        /** StatUpdate mp */
        mp?: (number|null);

        /** StatUpdate maxMp */
        maxMp?: (number|null);

        /** StatUpdate sp */
        sp?: (number|null);

        /** StatUpdate maxSp */
        maxSp?: (number|null);

        /** StatUpdate experience */
        experience?: (number|Long|null);

        /** StatUpdate level */
        level?: (number|null);

        /** StatUpdate luPool */
        luPool?: (number|null);

        /** StatUpdate str */
        str?: (number|null);

        /** StatUpdate vit */
        vit?: (number|null);

        /** StatUpdate dex */
        dex?: (number|null);

        /** StatUpdate intStat */
        intStat?: (number|null);

        /** StatUpdate mag */
        mag?: (number|null);

        /** StatUpdate charisma */
        charisma?: (number|null);

        /** StatUpdate gold */
        gold?: (number|Long|null);
    }

    /** Represents a StatUpdate. */
    class StatUpdate implements IStatUpdate {

        /**
         * Constructs a new StatUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IStatUpdate);

        /** StatUpdate hp. */
        public hp: number;

        /** StatUpdate maxHp. */
        public maxHp: number;

        /** StatUpdate mp. */
        public mp: number;

        /** StatUpdate maxMp. */
        public maxMp: number;

        /** StatUpdate sp. */
        public sp: number;

        /** StatUpdate maxSp. */
        public maxSp: number;

        /** StatUpdate experience. */
        public experience: (number|Long);

        /** StatUpdate level. */
        public level: number;

        /** StatUpdate luPool. */
        public luPool: number;

        /** StatUpdate str. */
        public str: number;

        /** StatUpdate vit. */
        public vit: number;

        /** StatUpdate dex. */
        public dex: number;

        /** StatUpdate intStat. */
        public intStat: number;

        /** StatUpdate mag. */
        public mag: number;

        /** StatUpdate charisma. */
        public charisma: number;

        /** StatUpdate gold. */
        public gold: (number|Long);

        /**
         * Creates a new StatUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StatUpdate instance
         */
        public static create(properties?: hbonline.IStatUpdate): hbonline.StatUpdate;

        /**
         * Encodes the specified StatUpdate message. Does not implicitly {@link hbonline.StatUpdate.verify|verify} messages.
         * @param message StatUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IStatUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StatUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StatUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.StatUpdate;

        /**
         * Gets the default type url for StatUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeathEvent. */
    interface IDeathEvent {

        /** DeathEvent objectId */
        objectId?: (number|null);

        /** DeathEvent objectType */
        objectType?: (number|null);

        /** DeathEvent killerId */
        killerId?: (number|null);

        /** DeathEvent killerName */
        killerName?: (string|null);

        /** DeathEvent position */
        position?: (hbonline.IVec2|null);
    }

    /** Represents a DeathEvent. */
    class DeathEvent implements IDeathEvent {

        /**
         * Constructs a new DeathEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IDeathEvent);

        /** DeathEvent objectId. */
        public objectId: number;

        /** DeathEvent objectType. */
        public objectType: number;

        /** DeathEvent killerId. */
        public killerId: number;

        /** DeathEvent killerName. */
        public killerName: string;

        /** DeathEvent position. */
        public position?: (hbonline.IVec2|null);

        /**
         * Creates a new DeathEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeathEvent instance
         */
        public static create(properties?: hbonline.IDeathEvent): hbonline.DeathEvent;

        /**
         * Encodes the specified DeathEvent message. Does not implicitly {@link hbonline.DeathEvent.verify|verify} messages.
         * @param message DeathEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IDeathEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeathEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeathEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.DeathEvent;

        /**
         * Gets the default type url for DeathEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RespawnEvent. */
    interface IRespawnEvent {

        /** RespawnEvent position */
        position?: (hbonline.IVec2|null);

        /** RespawnEvent direction */
        direction?: (number|null);

        /** RespawnEvent mapName */
        mapName?: (string|null);

        /** RespawnEvent hp */
        hp?: (number|null);

        /** RespawnEvent mp */
        mp?: (number|null);

        /** RespawnEvent sp */
        sp?: (number|null);
    }

    /** Represents a RespawnEvent. */
    class RespawnEvent implements IRespawnEvent {

        /**
         * Constructs a new RespawnEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IRespawnEvent);

        /** RespawnEvent position. */
        public position?: (hbonline.IVec2|null);

        /** RespawnEvent direction. */
        public direction: number;

        /** RespawnEvent mapName. */
        public mapName: string;

        /** RespawnEvent hp. */
        public hp: number;

        /** RespawnEvent mp. */
        public mp: number;

        /** RespawnEvent sp. */
        public sp: number;

        /**
         * Creates a new RespawnEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RespawnEvent instance
         */
        public static create(properties?: hbonline.IRespawnEvent): hbonline.RespawnEvent;

        /**
         * Encodes the specified RespawnEvent message. Does not implicitly {@link hbonline.RespawnEvent.verify|verify} messages.
         * @param message RespawnEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IRespawnEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RespawnEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RespawnEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.RespawnEvent;

        /**
         * Gets the default type url for RespawnEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LogoutRequest. */
    interface ILogoutRequest {

        /** LogoutRequest cancel */
        cancel?: (boolean|null);
    }

    /** Represents a LogoutRequest. */
    class LogoutRequest implements ILogoutRequest {

        /**
         * Constructs a new LogoutRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ILogoutRequest);

        /** LogoutRequest cancel. */
        public cancel: boolean;

        /**
         * Creates a new LogoutRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogoutRequest instance
         */
        public static create(properties?: hbonline.ILogoutRequest): hbonline.LogoutRequest;

        /**
         * Encodes the specified LogoutRequest message. Does not implicitly {@link hbonline.LogoutRequest.verify|verify} messages.
         * @param message LogoutRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ILogoutRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogoutRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogoutRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.LogoutRequest;

        /**
         * Gets the default type url for LogoutRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LogoutResponse. */
    interface ILogoutResponse {

        /** LogoutResponse secondsRemaining */
        secondsRemaining?: (number|null);

        /** LogoutResponse cancelled */
        cancelled?: (boolean|null);

        /** LogoutResponse reason */
        reason?: (string|null);
    }

    /** Represents a LogoutResponse. */
    class LogoutResponse implements ILogoutResponse {

        /**
         * Constructs a new LogoutResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ILogoutResponse);

        /** LogoutResponse secondsRemaining. */
        public secondsRemaining: number;

        /** LogoutResponse cancelled. */
        public cancelled: boolean;

        /** LogoutResponse reason. */
        public reason: string;

        /**
         * Creates a new LogoutResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogoutResponse instance
         */
        public static create(properties?: hbonline.ILogoutResponse): hbonline.LogoutResponse;

        /**
         * Encodes the specified LogoutResponse message. Does not implicitly {@link hbonline.LogoutResponse.verify|verify} messages.
         * @param message LogoutResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ILogoutResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogoutResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogoutResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.LogoutResponse;

        /**
         * Gets the default type url for LogoutResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DismissIntroRequest. */
    interface IDismissIntroRequest {
    }

    /** Represents a DismissIntroRequest. */
    class DismissIntroRequest implements IDismissIntroRequest {

        /**
         * Constructs a new DismissIntroRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IDismissIntroRequest);

        /**
         * Creates a new DismissIntroRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DismissIntroRequest instance
         */
        public static create(properties?: hbonline.IDismissIntroRequest): hbonline.DismissIntroRequest;

        /**
         * Encodes the specified DismissIntroRequest message. Does not implicitly {@link hbonline.DismissIntroRequest.verify|verify} messages.
         * @param message DismissIntroRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IDismissIntroRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DismissIntroRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DismissIntroRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.DismissIntroRequest;

        /**
         * Gets the default type url for DismissIntroRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EntityInfo. */
    interface IEntityInfo {

        /** EntityInfo objectId */
        objectId?: (number|null);

        /** EntityInfo entityType */
        entityType?: (number|null);

        /** EntityInfo name */
        name?: (string|null);

        /** EntityInfo position */
        position?: (hbonline.IVec2|null);

        /** EntityInfo direction */
        direction?: (number|null);

        /** EntityInfo action */
        action?: (number|null);

        /** EntityInfo status */
        status?: (number|null);

        /** EntityInfo appearance */
        appearance?: (hbonline.IAppearance|null);

        /** EntityInfo npcType */
        npcType?: (number|null);

        /** EntityInfo level */
        level?: (number|null);

        /** EntityInfo side */
        side?: (number|null);
    }

    /** Represents an EntityInfo. */
    class EntityInfo implements IEntityInfo {

        /**
         * Constructs a new EntityInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IEntityInfo);

        /** EntityInfo objectId. */
        public objectId: number;

        /** EntityInfo entityType. */
        public entityType: number;

        /** EntityInfo name. */
        public name: string;

        /** EntityInfo position. */
        public position?: (hbonline.IVec2|null);

        /** EntityInfo direction. */
        public direction: number;

        /** EntityInfo action. */
        public action: number;

        /** EntityInfo status. */
        public status: number;

        /** EntityInfo appearance. */
        public appearance?: (hbonline.IAppearance|null);

        /** EntityInfo npcType. */
        public npcType: number;

        /** EntityInfo level. */
        public level: number;

        /** EntityInfo side. */
        public side: number;

        /**
         * Creates a new EntityInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EntityInfo instance
         */
        public static create(properties?: hbonline.IEntityInfo): hbonline.EntityInfo;

        /**
         * Encodes the specified EntityInfo message. Does not implicitly {@link hbonline.EntityInfo.verify|verify} messages.
         * @param message EntityInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IEntityInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EntityInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EntityInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.EntityInfo;

        /**
         * Gets the default type url for EntityInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ItemInstance. */
    interface IItemInstance {

        /** ItemInstance itemId */
        itemId?: (number|null);

        /** ItemInstance name */
        name?: (string|null);

        /** ItemInstance count */
        count?: (number|null);

        /** ItemInstance durability */
        durability?: (number|null);

        /** ItemInstance maxDurability */
        maxDurability?: (number|null);

        /** ItemInstance slotIndex */
        slotIndex?: (number|null);
    }

    /** Represents an ItemInstance. */
    class ItemInstance implements IItemInstance {

        /**
         * Constructs a new ItemInstance.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IItemInstance);

        /** ItemInstance itemId. */
        public itemId: number;

        /** ItemInstance name. */
        public name: string;

        /** ItemInstance count. */
        public count: number;

        /** ItemInstance durability. */
        public durability: number;

        /** ItemInstance maxDurability. */
        public maxDurability: number;

        /** ItemInstance slotIndex. */
        public slotIndex: number;

        /**
         * Creates a new ItemInstance instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemInstance instance
         */
        public static create(properties?: hbonline.IItemInstance): hbonline.ItemInstance;

        /**
         * Encodes the specified ItemInstance message. Does not implicitly {@link hbonline.ItemInstance.verify|verify} messages.
         * @param message ItemInstance message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IItemInstance, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ItemInstance message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemInstance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ItemInstance;

        /**
         * Gets the default type url for ItemInstance
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an InventoryUpdate. */
    interface IInventoryUpdate {

        /** InventoryUpdate items */
        items?: (hbonline.IItemInstance[]|null);

        /** InventoryUpdate equipment */
        equipment?: (hbonline.IItemInstance[]|null);

        /** InventoryUpdate gold */
        gold?: (number|Long|null);
    }

    /** Represents an InventoryUpdate. */
    class InventoryUpdate implements IInventoryUpdate {

        /**
         * Constructs a new InventoryUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IInventoryUpdate);

        /** InventoryUpdate items. */
        public items: hbonline.IItemInstance[];

        /** InventoryUpdate equipment. */
        public equipment: hbonline.IItemInstance[];

        /** InventoryUpdate gold. */
        public gold: (number|Long);

        /**
         * Creates a new InventoryUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InventoryUpdate instance
         */
        public static create(properties?: hbonline.IInventoryUpdate): hbonline.InventoryUpdate;

        /**
         * Encodes the specified InventoryUpdate message. Does not implicitly {@link hbonline.InventoryUpdate.verify|verify} messages.
         * @param message InventoryUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IInventoryUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InventoryUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InventoryUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.InventoryUpdate;

        /**
         * Gets the default type url for InventoryUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GroundItemAppear. */
    interface IGroundItemAppear {

        /** GroundItemAppear groundId */
        groundId?: (number|null);

        /** GroundItemAppear itemId */
        itemId?: (number|null);

        /** GroundItemAppear name */
        name?: (string|null);

        /** GroundItemAppear count */
        count?: (number|null);

        /** GroundItemAppear position */
        position?: (hbonline.IVec2|null);
    }

    /** Represents a GroundItemAppear. */
    class GroundItemAppear implements IGroundItemAppear {

        /**
         * Constructs a new GroundItemAppear.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGroundItemAppear);

        /** GroundItemAppear groundId. */
        public groundId: number;

        /** GroundItemAppear itemId. */
        public itemId: number;

        /** GroundItemAppear name. */
        public name: string;

        /** GroundItemAppear count. */
        public count: number;

        /** GroundItemAppear position. */
        public position?: (hbonline.IVec2|null);

        /**
         * Creates a new GroundItemAppear instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GroundItemAppear instance
         */
        public static create(properties?: hbonline.IGroundItemAppear): hbonline.GroundItemAppear;

        /**
         * Encodes the specified GroundItemAppear message. Does not implicitly {@link hbonline.GroundItemAppear.verify|verify} messages.
         * @param message GroundItemAppear message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGroundItemAppear, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GroundItemAppear message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GroundItemAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GroundItemAppear;

        /**
         * Gets the default type url for GroundItemAppear
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GroundItemDisappear. */
    interface IGroundItemDisappear {

        /** GroundItemDisappear groundId */
        groundId?: (number|null);
    }

    /** Represents a GroundItemDisappear. */
    class GroundItemDisappear implements IGroundItemDisappear {

        /**
         * Constructs a new GroundItemDisappear.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGroundItemDisappear);

        /** GroundItemDisappear groundId. */
        public groundId: number;

        /**
         * Creates a new GroundItemDisappear instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GroundItemDisappear instance
         */
        public static create(properties?: hbonline.IGroundItemDisappear): hbonline.GroundItemDisappear;

        /**
         * Encodes the specified GroundItemDisappear message. Does not implicitly {@link hbonline.GroundItemDisappear.verify|verify} messages.
         * @param message GroundItemDisappear message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGroundItemDisappear, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GroundItemDisappear message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GroundItemDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GroundItemDisappear;

        /**
         * Gets the default type url for GroundItemDisappear
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ItemPickupRequest. */
    interface IItemPickupRequest {

        /** ItemPickupRequest groundId */
        groundId?: (number|null);
    }

    /** Represents an ItemPickupRequest. */
    class ItemPickupRequest implements IItemPickupRequest {

        /**
         * Constructs a new ItemPickupRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IItemPickupRequest);

        /** ItemPickupRequest groundId. */
        public groundId: number;

        /**
         * Creates a new ItemPickupRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemPickupRequest instance
         */
        public static create(properties?: hbonline.IItemPickupRequest): hbonline.ItemPickupRequest;

        /**
         * Encodes the specified ItemPickupRequest message. Does not implicitly {@link hbonline.ItemPickupRequest.verify|verify} messages.
         * @param message ItemPickupRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IItemPickupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ItemPickupRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemPickupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ItemPickupRequest;

        /**
         * Gets the default type url for ItemPickupRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ItemUseRequest. */
    interface IItemUseRequest {

        /** ItemUseRequest slotIndex */
        slotIndex?: (number|null);
    }

    /** Represents an ItemUseRequest. */
    class ItemUseRequest implements IItemUseRequest {

        /**
         * Constructs a new ItemUseRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IItemUseRequest);

        /** ItemUseRequest slotIndex. */
        public slotIndex: number;

        /**
         * Creates a new ItemUseRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemUseRequest instance
         */
        public static create(properties?: hbonline.IItemUseRequest): hbonline.ItemUseRequest;

        /**
         * Encodes the specified ItemUseRequest message. Does not implicitly {@link hbonline.ItemUseRequest.verify|verify} messages.
         * @param message ItemUseRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IItemUseRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ItemUseRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemUseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ItemUseRequest;

        /**
         * Gets the default type url for ItemUseRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ItemEquipRequest. */
    interface IItemEquipRequest {

        /** ItemEquipRequest slotIndex */
        slotIndex?: (number|null);

        /** ItemEquipRequest equipSlot */
        equipSlot?: (number|null);
    }

    /** Represents an ItemEquipRequest. */
    class ItemEquipRequest implements IItemEquipRequest {

        /**
         * Constructs a new ItemEquipRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IItemEquipRequest);

        /** ItemEquipRequest slotIndex. */
        public slotIndex: number;

        /** ItemEquipRequest equipSlot. */
        public equipSlot: number;

        /**
         * Creates a new ItemEquipRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemEquipRequest instance
         */
        public static create(properties?: hbonline.IItemEquipRequest): hbonline.ItemEquipRequest;

        /**
         * Encodes the specified ItemEquipRequest message. Does not implicitly {@link hbonline.ItemEquipRequest.verify|verify} messages.
         * @param message ItemEquipRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IItemEquipRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ItemEquipRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemEquipRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ItemEquipRequest;

        /**
         * Gets the default type url for ItemEquipRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ItemDropRequest. */
    interface IItemDropRequest {

        /** ItemDropRequest slotIndex */
        slotIndex?: (number|null);

        /** ItemDropRequest count */
        count?: (number|null);
    }

    /** Represents an ItemDropRequest. */
    class ItemDropRequest implements IItemDropRequest {

        /**
         * Constructs a new ItemDropRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IItemDropRequest);

        /** ItemDropRequest slotIndex. */
        public slotIndex: number;

        /** ItemDropRequest count. */
        public count: number;

        /**
         * Creates a new ItemDropRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ItemDropRequest instance
         */
        public static create(properties?: hbonline.IItemDropRequest): hbonline.ItemDropRequest;

        /**
         * Encodes the specified ItemDropRequest message. Does not implicitly {@link hbonline.ItemDropRequest.verify|verify} messages.
         * @param message ItemDropRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IItemDropRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ItemDropRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ItemDropRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ItemDropRequest;

        /**
         * Gets the default type url for ItemDropRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a StatAllocRequest. */
    interface IStatAllocRequest {

        /** StatAllocRequest statType */
        statType?: (number|null);

        /** StatAllocRequest points */
        points?: (number|null);
    }

    /** Represents a StatAllocRequest. */
    class StatAllocRequest implements IStatAllocRequest {

        /**
         * Constructs a new StatAllocRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IStatAllocRequest);

        /** StatAllocRequest statType. */
        public statType: number;

        /** StatAllocRequest points. */
        public points: number;

        /**
         * Creates a new StatAllocRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StatAllocRequest instance
         */
        public static create(properties?: hbonline.IStatAllocRequest): hbonline.StatAllocRequest;

        /**
         * Encodes the specified StatAllocRequest message. Does not implicitly {@link hbonline.StatAllocRequest.verify|verify} messages.
         * @param message StatAllocRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IStatAllocRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StatAllocRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StatAllocRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.StatAllocRequest;

        /**
         * Gets the default type url for StatAllocRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShopOpen. */
    interface IShopOpen {

        /** ShopOpen npcId */
        npcId?: (number|null);

        /** ShopOpen shopName */
        shopName?: (string|null);

        /** ShopOpen items */
        items?: (hbonline.IShopItem[]|null);
    }

    /** Represents a ShopOpen. */
    class ShopOpen implements IShopOpen {

        /**
         * Constructs a new ShopOpen.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IShopOpen);

        /** ShopOpen npcId. */
        public npcId: number;

        /** ShopOpen shopName. */
        public shopName: string;

        /** ShopOpen items. */
        public items: hbonline.IShopItem[];

        /**
         * Creates a new ShopOpen instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopOpen instance
         */
        public static create(properties?: hbonline.IShopOpen): hbonline.ShopOpen;

        /**
         * Encodes the specified ShopOpen message. Does not implicitly {@link hbonline.ShopOpen.verify|verify} messages.
         * @param message ShopOpen message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IShopOpen, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShopOpen message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopOpen
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ShopOpen;

        /**
         * Gets the default type url for ShopOpen
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShopItem. */
    interface IShopItem {

        /** ShopItem itemId */
        itemId?: (number|null);

        /** ShopItem name */
        name?: (string|null);

        /** ShopItem price */
        price?: (number|Long|null);

        /** ShopItem itemType */
        itemType?: (number|null);
    }

    /** Represents a ShopItem. */
    class ShopItem implements IShopItem {

        /**
         * Constructs a new ShopItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IShopItem);

        /** ShopItem itemId. */
        public itemId: number;

        /** ShopItem name. */
        public name: string;

        /** ShopItem price. */
        public price: (number|Long);

        /** ShopItem itemType. */
        public itemType: number;

        /**
         * Creates a new ShopItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopItem instance
         */
        public static create(properties?: hbonline.IShopItem): hbonline.ShopItem;

        /**
         * Encodes the specified ShopItem message. Does not implicitly {@link hbonline.ShopItem.verify|verify} messages.
         * @param message ShopItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IShopItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShopItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ShopItem;

        /**
         * Gets the default type url for ShopItem
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShopBuyRequest. */
    interface IShopBuyRequest {

        /** ShopBuyRequest npcId */
        npcId?: (number|null);

        /** ShopBuyRequest itemId */
        itemId?: (number|null);

        /** ShopBuyRequest count */
        count?: (number|null);
    }

    /** Represents a ShopBuyRequest. */
    class ShopBuyRequest implements IShopBuyRequest {

        /**
         * Constructs a new ShopBuyRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IShopBuyRequest);

        /** ShopBuyRequest npcId. */
        public npcId: number;

        /** ShopBuyRequest itemId. */
        public itemId: number;

        /** ShopBuyRequest count. */
        public count: number;

        /**
         * Creates a new ShopBuyRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopBuyRequest instance
         */
        public static create(properties?: hbonline.IShopBuyRequest): hbonline.ShopBuyRequest;

        /**
         * Encodes the specified ShopBuyRequest message. Does not implicitly {@link hbonline.ShopBuyRequest.verify|verify} messages.
         * @param message ShopBuyRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IShopBuyRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShopBuyRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopBuyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ShopBuyRequest;

        /**
         * Gets the default type url for ShopBuyRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShopSellRequest. */
    interface IShopSellRequest {

        /** ShopSellRequest npcId */
        npcId?: (number|null);

        /** ShopSellRequest slotIndex */
        slotIndex?: (number|null);

        /** ShopSellRequest count */
        count?: (number|null);
    }

    /** Represents a ShopSellRequest. */
    class ShopSellRequest implements IShopSellRequest {

        /**
         * Constructs a new ShopSellRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IShopSellRequest);

        /** ShopSellRequest npcId. */
        public npcId: number;

        /** ShopSellRequest slotIndex. */
        public slotIndex: number;

        /** ShopSellRequest count. */
        public count: number;

        /**
         * Creates a new ShopSellRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopSellRequest instance
         */
        public static create(properties?: hbonline.IShopSellRequest): hbonline.ShopSellRequest;

        /**
         * Encodes the specified ShopSellRequest message. Does not implicitly {@link hbonline.ShopSellRequest.verify|verify} messages.
         * @param message ShopSellRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IShopSellRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShopSellRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopSellRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ShopSellRequest;

        /**
         * Gets the default type url for ShopSellRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ShopResponse. */
    interface IShopResponse {

        /** ShopResponse success */
        success?: (boolean|null);

        /** ShopResponse error */
        error?: (string|null);
    }

    /** Represents a ShopResponse. */
    class ShopResponse implements IShopResponse {

        /**
         * Constructs a new ShopResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IShopResponse);

        /** ShopResponse success. */
        public success: boolean;

        /** ShopResponse error. */
        public error: string;

        /**
         * Creates a new ShopResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ShopResponse instance
         */
        public static create(properties?: hbonline.IShopResponse): hbonline.ShopResponse;

        /**
         * Encodes the specified ShopResponse message. Does not implicitly {@link hbonline.ShopResponse.verify|verify} messages.
         * @param message ShopResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IShopResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ShopResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ShopResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.ShopResponse;

        /**
         * Gets the default type url for ShopResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpellCastRequest. */
    interface ISpellCastRequest {

        /** SpellCastRequest spellId */
        spellId?: (number|null);

        /** SpellCastRequest targetId */
        targetId?: (number|null);

        /** SpellCastRequest targetPosition */
        targetPosition?: (hbonline.IVec2|null);
    }

    /** Represents a SpellCastRequest. */
    class SpellCastRequest implements ISpellCastRequest {

        /**
         * Constructs a new SpellCastRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISpellCastRequest);

        /** SpellCastRequest spellId. */
        public spellId: number;

        /** SpellCastRequest targetId. */
        public targetId: number;

        /** SpellCastRequest targetPosition. */
        public targetPosition?: (hbonline.IVec2|null);

        /**
         * Creates a new SpellCastRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpellCastRequest instance
         */
        public static create(properties?: hbonline.ISpellCastRequest): hbonline.SpellCastRequest;

        /**
         * Encodes the specified SpellCastRequest message. Does not implicitly {@link hbonline.SpellCastRequest.verify|verify} messages.
         * @param message SpellCastRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISpellCastRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpellCastRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpellCastRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SpellCastRequest;

        /**
         * Gets the default type url for SpellCastRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpellEffectEvent. */
    interface ISpellEffectEvent {

        /** SpellEffectEvent casterId */
        casterId?: (number|null);

        /** SpellEffectEvent spellId */
        spellId?: (number|null);

        /** SpellEffectEvent targetId */
        targetId?: (number|null);

        /** SpellEffectEvent casterPosition */
        casterPosition?: (hbonline.IVec2|null);

        /** SpellEffectEvent targetPosition */
        targetPosition?: (hbonline.IVec2|null);

        /** SpellEffectEvent damage */
        damage?: (number|null);

        /** SpellEffectEvent healAmount */
        healAmount?: (number|null);

        /** SpellEffectEvent miss */
        miss?: (boolean|null);

        /** SpellEffectEvent spriteId */
        spriteId?: (number|null);

        /** SpellEffectEvent soundId */
        soundId?: (number|null);
    }

    /** Represents a SpellEffectEvent. */
    class SpellEffectEvent implements ISpellEffectEvent {

        /**
         * Constructs a new SpellEffectEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISpellEffectEvent);

        /** SpellEffectEvent casterId. */
        public casterId: number;

        /** SpellEffectEvent spellId. */
        public spellId: number;

        /** SpellEffectEvent targetId. */
        public targetId: number;

        /** SpellEffectEvent casterPosition. */
        public casterPosition?: (hbonline.IVec2|null);

        /** SpellEffectEvent targetPosition. */
        public targetPosition?: (hbonline.IVec2|null);

        /** SpellEffectEvent damage. */
        public damage: number;

        /** SpellEffectEvent healAmount. */
        public healAmount: number;

        /** SpellEffectEvent miss. */
        public miss: boolean;

        /** SpellEffectEvent spriteId. */
        public spriteId: number;

        /** SpellEffectEvent soundId. */
        public soundId: number;

        /**
         * Creates a new SpellEffectEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpellEffectEvent instance
         */
        public static create(properties?: hbonline.ISpellEffectEvent): hbonline.SpellEffectEvent;

        /**
         * Encodes the specified SpellEffectEvent message. Does not implicitly {@link hbonline.SpellEffectEvent.verify|verify} messages.
         * @param message SpellEffectEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISpellEffectEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpellEffectEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpellEffectEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SpellEffectEvent;

        /**
         * Gets the default type url for SpellEffectEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BuffUpdate. */
    interface IBuffUpdate {

        /** BuffUpdate objectId */
        objectId?: (number|null);

        /** BuffUpdate spellId */
        spellId?: (number|null);

        /** BuffUpdate name */
        name?: (string|null);

        /** BuffUpdate statType */
        statType?: (number|null);

        /** BuffUpdate amount */
        amount?: (number|null);

        /** BuffUpdate remainingSeconds */
        remainingSeconds?: (number|null);

        /** BuffUpdate removed */
        removed?: (boolean|null);
    }

    /** Represents a BuffUpdate. */
    class BuffUpdate implements IBuffUpdate {

        /**
         * Constructs a new BuffUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IBuffUpdate);

        /** BuffUpdate objectId. */
        public objectId: number;

        /** BuffUpdate spellId. */
        public spellId: number;

        /** BuffUpdate name. */
        public name: string;

        /** BuffUpdate statType. */
        public statType: number;

        /** BuffUpdate amount. */
        public amount: number;

        /** BuffUpdate remainingSeconds. */
        public remainingSeconds: number;

        /** BuffUpdate removed. */
        public removed: boolean;

        /**
         * Creates a new BuffUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BuffUpdate instance
         */
        public static create(properties?: hbonline.IBuffUpdate): hbonline.BuffUpdate;

        /**
         * Encodes the specified BuffUpdate message. Does not implicitly {@link hbonline.BuffUpdate.verify|verify} messages.
         * @param message BuffUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IBuffUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BuffUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BuffUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.BuffUpdate;

        /**
         * Gets the default type url for BuffUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpellListUpdate. */
    interface ISpellListUpdate {

        /** SpellListUpdate spells */
        spells?: (hbonline.ILearnedSpell[]|null);
    }

    /** Represents a SpellListUpdate. */
    class SpellListUpdate implements ISpellListUpdate {

        /**
         * Constructs a new SpellListUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISpellListUpdate);

        /** SpellListUpdate spells. */
        public spells: hbonline.ILearnedSpell[];

        /**
         * Creates a new SpellListUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpellListUpdate instance
         */
        public static create(properties?: hbonline.ISpellListUpdate): hbonline.SpellListUpdate;

        /**
         * Encodes the specified SpellListUpdate message. Does not implicitly {@link hbonline.SpellListUpdate.verify|verify} messages.
         * @param message SpellListUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISpellListUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpellListUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpellListUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SpellListUpdate;

        /**
         * Gets the default type url for SpellListUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LearnedSpell. */
    interface ILearnedSpell {

        /** LearnedSpell spellId */
        spellId?: (number|null);

        /** LearnedSpell name */
        name?: (string|null);

        /** LearnedSpell manaCost */
        manaCost?: (number|null);

        /** LearnedSpell cooldownMs */
        cooldownMs?: (number|null);

        /** LearnedSpell spellType */
        spellType?: (number|null);

        /** LearnedSpell spriteId */
        spriteId?: (number|null);
    }

    /** Represents a LearnedSpell. */
    class LearnedSpell implements ILearnedSpell {

        /**
         * Constructs a new LearnedSpell.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ILearnedSpell);

        /** LearnedSpell spellId. */
        public spellId: number;

        /** LearnedSpell name. */
        public name: string;

        /** LearnedSpell manaCost. */
        public manaCost: number;

        /** LearnedSpell cooldownMs. */
        public cooldownMs: number;

        /** LearnedSpell spellType. */
        public spellType: number;

        /** LearnedSpell spriteId. */
        public spriteId: number;

        /**
         * Creates a new LearnedSpell instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LearnedSpell instance
         */
        public static create(properties?: hbonline.ILearnedSpell): hbonline.LearnedSpell;

        /**
         * Encodes the specified LearnedSpell message. Does not implicitly {@link hbonline.LearnedSpell.verify|verify} messages.
         * @param message LearnedSpell message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ILearnedSpell, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LearnedSpell message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LearnedSpell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.LearnedSpell;

        /**
         * Gets the default type url for LearnedSpell
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpellCatalog. */
    interface ISpellCatalog {

        /** SpellCatalog spells */
        spells?: (hbonline.ISpellCatalogEntry[]|null);
    }

    /** Represents a SpellCatalog. */
    class SpellCatalog implements ISpellCatalog {

        /**
         * Constructs a new SpellCatalog.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISpellCatalog);

        /** SpellCatalog spells. */
        public spells: hbonline.ISpellCatalogEntry[];

        /**
         * Creates a new SpellCatalog instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpellCatalog instance
         */
        public static create(properties?: hbonline.ISpellCatalog): hbonline.SpellCatalog;

        /**
         * Encodes the specified SpellCatalog message. Does not implicitly {@link hbonline.SpellCatalog.verify|verify} messages.
         * @param message SpellCatalog message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISpellCatalog, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpellCatalog message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpellCatalog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SpellCatalog;

        /**
         * Gets the default type url for SpellCatalog
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpellCatalogEntry. */
    interface ISpellCatalogEntry {

        /** SpellCatalogEntry spellId */
        spellId?: (number|null);

        /** SpellCatalogEntry name */
        name?: (string|null);

        /** SpellCatalogEntry spellType */
        spellType?: (number|null);

        /** SpellCatalogEntry manaCost */
        manaCost?: (number|null);

        /** SpellCatalogEntry reqLevel */
        reqLevel?: (number|null);

        /** SpellCatalogEntry reqMag */
        reqMag?: (number|null);

        /** SpellCatalogEntry reqInt */
        reqInt?: (number|null);

        /** SpellCatalogEntry learned */
        learned?: (boolean|null);
    }

    /** Represents a SpellCatalogEntry. */
    class SpellCatalogEntry implements ISpellCatalogEntry {

        /**
         * Constructs a new SpellCatalogEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISpellCatalogEntry);

        /** SpellCatalogEntry spellId. */
        public spellId: number;

        /** SpellCatalogEntry name. */
        public name: string;

        /** SpellCatalogEntry spellType. */
        public spellType: number;

        /** SpellCatalogEntry manaCost. */
        public manaCost: number;

        /** SpellCatalogEntry reqLevel. */
        public reqLevel: number;

        /** SpellCatalogEntry reqMag. */
        public reqMag: number;

        /** SpellCatalogEntry reqInt. */
        public reqInt: number;

        /** SpellCatalogEntry learned. */
        public learned: boolean;

        /**
         * Creates a new SpellCatalogEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpellCatalogEntry instance
         */
        public static create(properties?: hbonline.ISpellCatalogEntry): hbonline.SpellCatalogEntry;

        /**
         * Encodes the specified SpellCatalogEntry message. Does not implicitly {@link hbonline.SpellCatalogEntry.verify|verify} messages.
         * @param message SpellCatalogEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISpellCatalogEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpellCatalogEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpellCatalogEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SpellCatalogEntry;

        /**
         * Gets the default type url for SpellCatalogEntry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LearnSpellRequest. */
    interface ILearnSpellRequest {

        /** LearnSpellRequest spellId */
        spellId?: (number|null);
    }

    /** Represents a LearnSpellRequest. */
    class LearnSpellRequest implements ILearnSpellRequest {

        /**
         * Constructs a new LearnSpellRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ILearnSpellRequest);

        /** LearnSpellRequest spellId. */
        public spellId: number;

        /**
         * Creates a new LearnSpellRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LearnSpellRequest instance
         */
        public static create(properties?: hbonline.ILearnSpellRequest): hbonline.LearnSpellRequest;

        /**
         * Encodes the specified LearnSpellRequest message. Does not implicitly {@link hbonline.LearnSpellRequest.verify|verify} messages.
         * @param message LearnSpellRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ILearnSpellRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LearnSpellRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LearnSpellRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.LearnSpellRequest;

        /**
         * Gets the default type url for LearnSpellRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SkillListUpdate. */
    interface ISkillListUpdate {

        /** SkillListUpdate skills */
        skills?: (hbonline.ISkillEntry[]|null);

        /** SkillListUpdate totalMastery */
        totalMastery?: (number|null);

        /** SkillListUpdate masteryCap */
        masteryCap?: (number|null);
    }

    /** Represents a SkillListUpdate. */
    class SkillListUpdate implements ISkillListUpdate {

        /**
         * Constructs a new SkillListUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISkillListUpdate);

        /** SkillListUpdate skills. */
        public skills: hbonline.ISkillEntry[];

        /** SkillListUpdate totalMastery. */
        public totalMastery: number;

        /** SkillListUpdate masteryCap. */
        public masteryCap: number;

        /**
         * Creates a new SkillListUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillListUpdate instance
         */
        public static create(properties?: hbonline.ISkillListUpdate): hbonline.SkillListUpdate;

        /**
         * Encodes the specified SkillListUpdate message. Does not implicitly {@link hbonline.SkillListUpdate.verify|verify} messages.
         * @param message SkillListUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISkillListUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SkillListUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillListUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SkillListUpdate;

        /**
         * Gets the default type url for SkillListUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SkillEntry. */
    interface ISkillEntry {

        /** SkillEntry skillId */
        skillId?: (number|null);

        /** SkillEntry name */
        name?: (string|null);

        /** SkillEntry mastery */
        mastery?: (number|null);
    }

    /** Represents a SkillEntry. */
    class SkillEntry implements ISkillEntry {

        /**
         * Constructs a new SkillEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISkillEntry);

        /** SkillEntry skillId. */
        public skillId: number;

        /** SkillEntry name. */
        public name: string;

        /** SkillEntry mastery. */
        public mastery: number;

        /**
         * Creates a new SkillEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillEntry instance
         */
        public static create(properties?: hbonline.ISkillEntry): hbonline.SkillEntry;

        /**
         * Encodes the specified SkillEntry message. Does not implicitly {@link hbonline.SkillEntry.verify|verify} messages.
         * @param message SkillEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISkillEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SkillEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SkillEntry;

        /**
         * Gets the default type url for SkillEntry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SkillUseRequest. */
    interface ISkillUseRequest {

        /** SkillUseRequest skillId */
        skillId?: (number|null);

        /** SkillUseRequest targetPosition */
        targetPosition?: (hbonline.IVec2|null);

        /** SkillUseRequest targetId */
        targetId?: (number|null);
    }

    /** Represents a SkillUseRequest. */
    class SkillUseRequest implements ISkillUseRequest {

        /**
         * Constructs a new SkillUseRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISkillUseRequest);

        /** SkillUseRequest skillId. */
        public skillId: number;

        /** SkillUseRequest targetPosition. */
        public targetPosition?: (hbonline.IVec2|null);

        /** SkillUseRequest targetId. */
        public targetId: number;

        /**
         * Creates a new SkillUseRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillUseRequest instance
         */
        public static create(properties?: hbonline.ISkillUseRequest): hbonline.SkillUseRequest;

        /**
         * Encodes the specified SkillUseRequest message. Does not implicitly {@link hbonline.SkillUseRequest.verify|verify} messages.
         * @param message SkillUseRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISkillUseRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SkillUseRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillUseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SkillUseRequest;

        /**
         * Gets the default type url for SkillUseRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SkillResultEvent. */
    interface ISkillResultEvent {

        /** SkillResultEvent skillId */
        skillId?: (number|null);

        /** SkillResultEvent success */
        success?: (boolean|null);

        /** SkillResultEvent message */
        message?: (string|null);

        /** SkillResultEvent newMastery */
        newMastery?: (number|null);

        /** SkillResultEvent itemGainedId */
        itemGainedId?: (number|null);
    }

    /** Represents a SkillResultEvent. */
    class SkillResultEvent implements ISkillResultEvent {

        /**
         * Constructs a new SkillResultEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ISkillResultEvent);

        /** SkillResultEvent skillId. */
        public skillId: number;

        /** SkillResultEvent success. */
        public success: boolean;

        /** SkillResultEvent message. */
        public message: string;

        /** SkillResultEvent newMastery. */
        public newMastery: number;

        /** SkillResultEvent itemGainedId. */
        public itemGainedId: number;

        /**
         * Creates a new SkillResultEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SkillResultEvent instance
         */
        public static create(properties?: hbonline.ISkillResultEvent): hbonline.SkillResultEvent;

        /**
         * Encodes the specified SkillResultEvent message. Does not implicitly {@link hbonline.SkillResultEvent.verify|verify} messages.
         * @param message SkillResultEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ISkillResultEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SkillResultEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SkillResultEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.SkillResultEvent;

        /**
         * Gets the default type url for SkillResultEvent
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CraftRequest. */
    interface ICraftRequest {

        /** CraftRequest recipeId */
        recipeId?: (number|null);
    }

    /** Represents a CraftRequest. */
    class CraftRequest implements ICraftRequest {

        /**
         * Constructs a new CraftRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ICraftRequest);

        /** CraftRequest recipeId. */
        public recipeId: number;

        /**
         * Creates a new CraftRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CraftRequest instance
         */
        public static create(properties?: hbonline.ICraftRequest): hbonline.CraftRequest;

        /**
         * Encodes the specified CraftRequest message. Does not implicitly {@link hbonline.CraftRequest.verify|verify} messages.
         * @param message CraftRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ICraftRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CraftRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CraftRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.CraftRequest;

        /**
         * Gets the default type url for CraftRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CraftResult. */
    interface ICraftResult {

        /** CraftResult success */
        success?: (boolean|null);

        /** CraftResult message */
        message?: (string|null);

        /** CraftResult itemId */
        itemId?: (number|null);

        /** CraftResult count */
        count?: (number|null);
    }

    /** Represents a CraftResult. */
    class CraftResult implements ICraftResult {

        /**
         * Constructs a new CraftResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ICraftResult);

        /** CraftResult success. */
        public success: boolean;

        /** CraftResult message. */
        public message: string;

        /** CraftResult itemId. */
        public itemId: number;

        /** CraftResult count. */
        public count: number;

        /**
         * Creates a new CraftResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CraftResult instance
         */
        public static create(properties?: hbonline.ICraftResult): hbonline.CraftResult;

        /**
         * Encodes the specified CraftResult message. Does not implicitly {@link hbonline.CraftResult.verify|verify} messages.
         * @param message CraftResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ICraftResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CraftResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CraftResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.CraftResult;

        /**
         * Gets the default type url for CraftResult
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuestAcceptRequest. */
    interface IQuestAcceptRequest {

        /** QuestAcceptRequest questId */
        questId?: (number|null);
    }

    /** Represents a QuestAcceptRequest. */
    class QuestAcceptRequest implements IQuestAcceptRequest {

        /**
         * Constructs a new QuestAcceptRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IQuestAcceptRequest);

        /** QuestAcceptRequest questId. */
        public questId: number;

        /**
         * Creates a new QuestAcceptRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestAcceptRequest instance
         */
        public static create(properties?: hbonline.IQuestAcceptRequest): hbonline.QuestAcceptRequest;

        /**
         * Encodes the specified QuestAcceptRequest message. Does not implicitly {@link hbonline.QuestAcceptRequest.verify|verify} messages.
         * @param message QuestAcceptRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IQuestAcceptRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestAcceptRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestAcceptRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.QuestAcceptRequest;

        /**
         * Gets the default type url for QuestAcceptRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuestTurnInRequest. */
    interface IQuestTurnInRequest {

        /** QuestTurnInRequest questId */
        questId?: (number|null);
    }

    /** Represents a QuestTurnInRequest. */
    class QuestTurnInRequest implements IQuestTurnInRequest {

        /**
         * Constructs a new QuestTurnInRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IQuestTurnInRequest);

        /** QuestTurnInRequest questId. */
        public questId: number;

        /**
         * Creates a new QuestTurnInRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestTurnInRequest instance
         */
        public static create(properties?: hbonline.IQuestTurnInRequest): hbonline.QuestTurnInRequest;

        /**
         * Encodes the specified QuestTurnInRequest message. Does not implicitly {@link hbonline.QuestTurnInRequest.verify|verify} messages.
         * @param message QuestTurnInRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IQuestTurnInRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestTurnInRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestTurnInRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.QuestTurnInRequest;

        /**
         * Gets the default type url for QuestTurnInRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuestListUpdate. */
    interface IQuestListUpdate {

        /** QuestListUpdate activeQuests */
        activeQuests?: (hbonline.IQuestEntry[]|null);

        /** QuestListUpdate availableQuestIds */
        availableQuestIds?: (number[]|null);
    }

    /** Represents a QuestListUpdate. */
    class QuestListUpdate implements IQuestListUpdate {

        /**
         * Constructs a new QuestListUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IQuestListUpdate);

        /** QuestListUpdate activeQuests. */
        public activeQuests: hbonline.IQuestEntry[];

        /** QuestListUpdate availableQuestIds. */
        public availableQuestIds: number[];

        /**
         * Creates a new QuestListUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestListUpdate instance
         */
        public static create(properties?: hbonline.IQuestListUpdate): hbonline.QuestListUpdate;

        /**
         * Encodes the specified QuestListUpdate message. Does not implicitly {@link hbonline.QuestListUpdate.verify|verify} messages.
         * @param message QuestListUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IQuestListUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestListUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestListUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.QuestListUpdate;

        /**
         * Gets the default type url for QuestListUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuestEntry. */
    interface IQuestEntry {

        /** QuestEntry questId */
        questId?: (number|null);

        /** QuestEntry name */
        name?: (string|null);

        /** QuestEntry description */
        description?: (string|null);

        /** QuestEntry questType */
        questType?: (number|null);

        /** QuestEntry state */
        state?: (number|null);

        /** QuestEntry progress */
        progress?: (number|null);

        /** QuestEntry targetCount */
        targetCount?: (number|null);

        /** QuestEntry rewardXp */
        rewardXp?: (number|null);

        /** QuestEntry rewardGold */
        rewardGold?: (number|Long|null);
    }

    /** Represents a QuestEntry. */
    class QuestEntry implements IQuestEntry {

        /**
         * Constructs a new QuestEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IQuestEntry);

        /** QuestEntry questId. */
        public questId: number;

        /** QuestEntry name. */
        public name: string;

        /** QuestEntry description. */
        public description: string;

        /** QuestEntry questType. */
        public questType: number;

        /** QuestEntry state. */
        public state: number;

        /** QuestEntry progress. */
        public progress: number;

        /** QuestEntry targetCount. */
        public targetCount: number;

        /** QuestEntry rewardXp. */
        public rewardXp: number;

        /** QuestEntry rewardGold. */
        public rewardGold: (number|Long);

        /**
         * Creates a new QuestEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestEntry instance
         */
        public static create(properties?: hbonline.IQuestEntry): hbonline.QuestEntry;

        /**
         * Encodes the specified QuestEntry message. Does not implicitly {@link hbonline.QuestEntry.verify|verify} messages.
         * @param message QuestEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IQuestEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.QuestEntry;

        /**
         * Gets the default type url for QuestEntry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuestProgressUpdate. */
    interface IQuestProgressUpdate {

        /** QuestProgressUpdate questId */
        questId?: (number|null);

        /** QuestProgressUpdate progress */
        progress?: (number|null);

        /** QuestProgressUpdate targetCount */
        targetCount?: (number|null);

        /** QuestProgressUpdate completed */
        completed?: (boolean|null);
    }

    /** Represents a QuestProgressUpdate. */
    class QuestProgressUpdate implements IQuestProgressUpdate {

        /**
         * Constructs a new QuestProgressUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IQuestProgressUpdate);

        /** QuestProgressUpdate questId. */
        public questId: number;

        /** QuestProgressUpdate progress. */
        public progress: number;

        /** QuestProgressUpdate targetCount. */
        public targetCount: number;

        /** QuestProgressUpdate completed. */
        public completed: boolean;

        /**
         * Creates a new QuestProgressUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestProgressUpdate instance
         */
        public static create(properties?: hbonline.IQuestProgressUpdate): hbonline.QuestProgressUpdate;

        /**
         * Encodes the specified QuestProgressUpdate message. Does not implicitly {@link hbonline.QuestProgressUpdate.verify|verify} messages.
         * @param message QuestProgressUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IQuestProgressUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestProgressUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestProgressUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.QuestProgressUpdate;

        /**
         * Gets the default type url for QuestProgressUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a QuestRewardNotification. */
    interface IQuestRewardNotification {

        /** QuestRewardNotification questId */
        questId?: (number|null);

        /** QuestRewardNotification questName */
        questName?: (string|null);

        /** QuestRewardNotification xpGained */
        xpGained?: (number|Long|null);

        /** QuestRewardNotification goldGained */
        goldGained?: (number|Long|null);

        /** QuestRewardNotification itemId */
        itemId?: (number|null);

        /** QuestRewardNotification itemCount */
        itemCount?: (number|null);
    }

    /** Represents a QuestRewardNotification. */
    class QuestRewardNotification implements IQuestRewardNotification {

        /**
         * Constructs a new QuestRewardNotification.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IQuestRewardNotification);

        /** QuestRewardNotification questId. */
        public questId: number;

        /** QuestRewardNotification questName. */
        public questName: string;

        /** QuestRewardNotification xpGained. */
        public xpGained: (number|Long);

        /** QuestRewardNotification goldGained. */
        public goldGained: (number|Long);

        /** QuestRewardNotification itemId. */
        public itemId: number;

        /** QuestRewardNotification itemCount. */
        public itemCount: number;

        /**
         * Creates a new QuestRewardNotification instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuestRewardNotification instance
         */
        public static create(properties?: hbonline.IQuestRewardNotification): hbonline.QuestRewardNotification;

        /**
         * Encodes the specified QuestRewardNotification message. Does not implicitly {@link hbonline.QuestRewardNotification.verify|verify} messages.
         * @param message QuestRewardNotification message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IQuestRewardNotification, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QuestRewardNotification message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuestRewardNotification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.QuestRewardNotification;

        /**
         * Gets the default type url for QuestRewardNotification
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FactionSelectRequest. */
    interface IFactionSelectRequest {

        /** FactionSelectRequest side */
        side?: (number|null);
    }

    /** Represents a FactionSelectRequest. */
    class FactionSelectRequest implements IFactionSelectRequest {

        /**
         * Constructs a new FactionSelectRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IFactionSelectRequest);

        /** FactionSelectRequest side. */
        public side: number;

        /**
         * Creates a new FactionSelectRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FactionSelectRequest instance
         */
        public static create(properties?: hbonline.IFactionSelectRequest): hbonline.FactionSelectRequest;

        /**
         * Encodes the specified FactionSelectRequest message. Does not implicitly {@link hbonline.FactionSelectRequest.verify|verify} messages.
         * @param message FactionSelectRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IFactionSelectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FactionSelectRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FactionSelectRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.FactionSelectRequest;

        /**
         * Gets the default type url for FactionSelectRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FactionSelectResponse. */
    interface IFactionSelectResponse {

        /** FactionSelectResponse success */
        success?: (boolean|null);

        /** FactionSelectResponse error */
        error?: (string|null);

        /** FactionSelectResponse side */
        side?: (number|null);
    }

    /** Represents a FactionSelectResponse. */
    class FactionSelectResponse implements IFactionSelectResponse {

        /**
         * Constructs a new FactionSelectResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IFactionSelectResponse);

        /** FactionSelectResponse success. */
        public success: boolean;

        /** FactionSelectResponse error. */
        public error: string;

        /** FactionSelectResponse side. */
        public side: number;

        /**
         * Creates a new FactionSelectResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FactionSelectResponse instance
         */
        public static create(properties?: hbonline.IFactionSelectResponse): hbonline.FactionSelectResponse;

        /**
         * Encodes the specified FactionSelectResponse message. Does not implicitly {@link hbonline.FactionSelectResponse.verify|verify} messages.
         * @param message FactionSelectResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IFactionSelectResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FactionSelectResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FactionSelectResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.FactionSelectResponse;

        /**
         * Gets the default type url for FactionSelectResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GuildCreateRequest. */
    interface IGuildCreateRequest {

        /** GuildCreateRequest name */
        name?: (string|null);
    }

    /** Represents a GuildCreateRequest. */
    class GuildCreateRequest implements IGuildCreateRequest {

        /**
         * Constructs a new GuildCreateRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGuildCreateRequest);

        /** GuildCreateRequest name. */
        public name: string;

        /**
         * Creates a new GuildCreateRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildCreateRequest instance
         */
        public static create(properties?: hbonline.IGuildCreateRequest): hbonline.GuildCreateRequest;

        /**
         * Encodes the specified GuildCreateRequest message. Does not implicitly {@link hbonline.GuildCreateRequest.verify|verify} messages.
         * @param message GuildCreateRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGuildCreateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildCreateRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildCreateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GuildCreateRequest;

        /**
         * Gets the default type url for GuildCreateRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GuildActionRequest. */
    interface IGuildActionRequest {

        /** GuildActionRequest action */
        action?: (number|null);

        /** GuildActionRequest targetName */
        targetName?: (string|null);
    }

    /** Represents a GuildActionRequest. */
    class GuildActionRequest implements IGuildActionRequest {

        /**
         * Constructs a new GuildActionRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGuildActionRequest);

        /** GuildActionRequest action. */
        public action: number;

        /** GuildActionRequest targetName. */
        public targetName: string;

        /**
         * Creates a new GuildActionRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildActionRequest instance
         */
        public static create(properties?: hbonline.IGuildActionRequest): hbonline.GuildActionRequest;

        /**
         * Encodes the specified GuildActionRequest message. Does not implicitly {@link hbonline.GuildActionRequest.verify|verify} messages.
         * @param message GuildActionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGuildActionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildActionRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GuildActionRequest;

        /**
         * Gets the default type url for GuildActionRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GuildInfo. */
    interface IGuildInfo {

        /** GuildInfo guildId */
        guildId?: (number|null);

        /** GuildInfo name */
        name?: (string|null);

        /** GuildInfo side */
        side?: (number|null);

        /** GuildInfo members */
        members?: (hbonline.IGuildMemberInfo[]|null);

        /** GuildInfo masterName */
        masterName?: (string|null);
    }

    /** Represents a GuildInfo. */
    class GuildInfo implements IGuildInfo {

        /**
         * Constructs a new GuildInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGuildInfo);

        /** GuildInfo guildId. */
        public guildId: number;

        /** GuildInfo name. */
        public name: string;

        /** GuildInfo side. */
        public side: number;

        /** GuildInfo members. */
        public members: hbonline.IGuildMemberInfo[];

        /** GuildInfo masterName. */
        public masterName: string;

        /**
         * Creates a new GuildInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildInfo instance
         */
        public static create(properties?: hbonline.IGuildInfo): hbonline.GuildInfo;

        /**
         * Encodes the specified GuildInfo message. Does not implicitly {@link hbonline.GuildInfo.verify|verify} messages.
         * @param message GuildInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGuildInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GuildInfo;

        /**
         * Gets the default type url for GuildInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GuildMemberInfo. */
    interface IGuildMemberInfo {

        /** GuildMemberInfo name */
        name?: (string|null);

        /** GuildMemberInfo rank */
        rank?: (number|null);

        /** GuildMemberInfo level */
        level?: (number|null);

        /** GuildMemberInfo online */
        online?: (boolean|null);
    }

    /** Represents a GuildMemberInfo. */
    class GuildMemberInfo implements IGuildMemberInfo {

        /**
         * Constructs a new GuildMemberInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGuildMemberInfo);

        /** GuildMemberInfo name. */
        public name: string;

        /** GuildMemberInfo rank. */
        public rank: number;

        /** GuildMemberInfo level. */
        public level: number;

        /** GuildMemberInfo online. */
        public online: boolean;

        /**
         * Creates a new GuildMemberInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildMemberInfo instance
         */
        public static create(properties?: hbonline.IGuildMemberInfo): hbonline.GuildMemberInfo;

        /**
         * Encodes the specified GuildMemberInfo message. Does not implicitly {@link hbonline.GuildMemberInfo.verify|verify} messages.
         * @param message GuildMemberInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGuildMemberInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildMemberInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildMemberInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GuildMemberInfo;

        /**
         * Gets the default type url for GuildMemberInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GuildActionResponse. */
    interface IGuildActionResponse {

        /** GuildActionResponse success */
        success?: (boolean|null);

        /** GuildActionResponse message */
        message?: (string|null);
    }

    /** Represents a GuildActionResponse. */
    class GuildActionResponse implements IGuildActionResponse {

        /**
         * Constructs a new GuildActionResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IGuildActionResponse);

        /** GuildActionResponse success. */
        public success: boolean;

        /** GuildActionResponse message. */
        public message: string;

        /**
         * Creates a new GuildActionResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildActionResponse instance
         */
        public static create(properties?: hbonline.IGuildActionResponse): hbonline.GuildActionResponse;

        /**
         * Encodes the specified GuildActionResponse message. Does not implicitly {@link hbonline.GuildActionResponse.verify|verify} messages.
         * @param message GuildActionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IGuildActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildActionResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.GuildActionResponse;

        /**
         * Gets the default type url for GuildActionResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PartyActionRequest. */
    interface IPartyActionRequest {

        /** PartyActionRequest action */
        action?: (number|null);

        /** PartyActionRequest targetName */
        targetName?: (string|null);
    }

    /** Represents a PartyActionRequest. */
    class PartyActionRequest implements IPartyActionRequest {

        /**
         * Constructs a new PartyActionRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPartyActionRequest);

        /** PartyActionRequest action. */
        public action: number;

        /** PartyActionRequest targetName. */
        public targetName: string;

        /**
         * Creates a new PartyActionRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyActionRequest instance
         */
        public static create(properties?: hbonline.IPartyActionRequest): hbonline.PartyActionRequest;

        /**
         * Encodes the specified PartyActionRequest message. Does not implicitly {@link hbonline.PartyActionRequest.verify|verify} messages.
         * @param message PartyActionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPartyActionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyActionRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PartyActionRequest;

        /**
         * Gets the default type url for PartyActionRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PartyActionResponse. */
    interface IPartyActionResponse {

        /** PartyActionResponse success */
        success?: (boolean|null);

        /** PartyActionResponse message */
        message?: (string|null);
    }

    /** Represents a PartyActionResponse. */
    class PartyActionResponse implements IPartyActionResponse {

        /**
         * Constructs a new PartyActionResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPartyActionResponse);

        /** PartyActionResponse success. */
        public success: boolean;

        /** PartyActionResponse message. */
        public message: string;

        /**
         * Creates a new PartyActionResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyActionResponse instance
         */
        public static create(properties?: hbonline.IPartyActionResponse): hbonline.PartyActionResponse;

        /**
         * Encodes the specified PartyActionResponse message. Does not implicitly {@link hbonline.PartyActionResponse.verify|verify} messages.
         * @param message PartyActionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPartyActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyActionResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PartyActionResponse;

        /**
         * Gets the default type url for PartyActionResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PartyUpdate. */
    interface IPartyUpdate {

        /** PartyUpdate members */
        members?: (hbonline.IPartyMemberInfo[]|null);

        /** PartyUpdate leaderObjectId */
        leaderObjectId?: (number|null);
    }

    /** Represents a PartyUpdate. */
    class PartyUpdate implements IPartyUpdate {

        /**
         * Constructs a new PartyUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPartyUpdate);

        /** PartyUpdate members. */
        public members: hbonline.IPartyMemberInfo[];

        /** PartyUpdate leaderObjectId. */
        public leaderObjectId: number;

        /**
         * Creates a new PartyUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyUpdate instance
         */
        public static create(properties?: hbonline.IPartyUpdate): hbonline.PartyUpdate;

        /**
         * Encodes the specified PartyUpdate message. Does not implicitly {@link hbonline.PartyUpdate.verify|verify} messages.
         * @param message PartyUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPartyUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PartyUpdate;

        /**
         * Gets the default type url for PartyUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PartyMemberInfo. */
    interface IPartyMemberInfo {

        /** PartyMemberInfo objectId */
        objectId?: (number|null);

        /** PartyMemberInfo name */
        name?: (string|null);

        /** PartyMemberInfo hp */
        hp?: (number|null);

        /** PartyMemberInfo maxHp */
        maxHp?: (number|null);

        /** PartyMemberInfo level */
        level?: (number|null);
    }

    /** Represents a PartyMemberInfo. */
    class PartyMemberInfo implements IPartyMemberInfo {

        /**
         * Constructs a new PartyMemberInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPartyMemberInfo);

        /** PartyMemberInfo objectId. */
        public objectId: number;

        /** PartyMemberInfo name. */
        public name: string;

        /** PartyMemberInfo hp. */
        public hp: number;

        /** PartyMemberInfo maxHp. */
        public maxHp: number;

        /** PartyMemberInfo level. */
        public level: number;

        /**
         * Creates a new PartyMemberInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyMemberInfo instance
         */
        public static create(properties?: hbonline.IPartyMemberInfo): hbonline.PartyMemberInfo;

        /**
         * Encodes the specified PartyMemberInfo message. Does not implicitly {@link hbonline.PartyMemberInfo.verify|verify} messages.
         * @param message PartyMemberInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPartyMemberInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyMemberInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyMemberInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PartyMemberInfo;

        /**
         * Gets the default type url for PartyMemberInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PartyInvite. */
    interface IPartyInvite {

        /** PartyInvite inviterObjectId */
        inviterObjectId?: (number|null);

        /** PartyInvite inviterName */
        inviterName?: (string|null);
    }

    /** Represents a PartyInvite. */
    class PartyInvite implements IPartyInvite {

        /**
         * Constructs a new PartyInvite.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPartyInvite);

        /** PartyInvite inviterObjectId. */
        public inviterObjectId: number;

        /** PartyInvite inviterName. */
        public inviterName: string;

        /**
         * Creates a new PartyInvite instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyInvite instance
         */
        public static create(properties?: hbonline.IPartyInvite): hbonline.PartyInvite;

        /**
         * Encodes the specified PartyInvite message. Does not implicitly {@link hbonline.PartyInvite.verify|verify} messages.
         * @param message PartyInvite message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPartyInvite, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyInvite message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyInvite
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PartyInvite;

        /**
         * Gets the default type url for PartyInvite
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PartyInviteResponse. */
    interface IPartyInviteResponse {

        /** PartyInviteResponse accept */
        accept?: (boolean|null);
    }

    /** Represents a PartyInviteResponse. */
    class PartyInviteResponse implements IPartyInviteResponse {

        /**
         * Constructs a new PartyInviteResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPartyInviteResponse);

        /** PartyInviteResponse accept. */
        public accept: boolean;

        /**
         * Creates a new PartyInviteResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PartyInviteResponse instance
         */
        public static create(properties?: hbonline.IPartyInviteResponse): hbonline.PartyInviteResponse;

        /**
         * Encodes the specified PartyInviteResponse message. Does not implicitly {@link hbonline.PartyInviteResponse.verify|verify} messages.
         * @param message PartyInviteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPartyInviteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PartyInviteResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PartyInviteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PartyInviteResponse;

        /**
         * Gets the default type url for PartyInviteResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeRequest. */
    interface ITradeRequest {

        /** TradeRequest targetId */
        targetId?: (number|null);
    }

    /** Represents a TradeRequest. */
    class TradeRequest implements ITradeRequest {

        /**
         * Constructs a new TradeRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeRequest);

        /** TradeRequest targetId. */
        public targetId: number;

        /**
         * Creates a new TradeRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeRequest instance
         */
        public static create(properties?: hbonline.ITradeRequest): hbonline.TradeRequest;

        /**
         * Encodes the specified TradeRequest message. Does not implicitly {@link hbonline.TradeRequest.verify|verify} messages.
         * @param message TradeRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeRequest;

        /**
         * Gets the default type url for TradeRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeIncoming. */
    interface ITradeIncoming {

        /** TradeIncoming requesterId */
        requesterId?: (number|null);

        /** TradeIncoming requesterName */
        requesterName?: (string|null);
    }

    /** Represents a TradeIncoming. */
    class TradeIncoming implements ITradeIncoming {

        /**
         * Constructs a new TradeIncoming.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeIncoming);

        /** TradeIncoming requesterId. */
        public requesterId: number;

        /** TradeIncoming requesterName. */
        public requesterName: string;

        /**
         * Creates a new TradeIncoming instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeIncoming instance
         */
        public static create(properties?: hbonline.ITradeIncoming): hbonline.TradeIncoming;

        /**
         * Encodes the specified TradeIncoming message. Does not implicitly {@link hbonline.TradeIncoming.verify|verify} messages.
         * @param message TradeIncoming message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeIncoming, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeIncoming message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeIncoming
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeIncoming;

        /**
         * Gets the default type url for TradeIncoming
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeResponse. */
    interface ITradeResponse {

        /** TradeResponse accept */
        accept?: (boolean|null);
    }

    /** Represents a TradeResponse. */
    class TradeResponse implements ITradeResponse {

        /**
         * Constructs a new TradeResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeResponse);

        /** TradeResponse accept. */
        public accept: boolean;

        /**
         * Creates a new TradeResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeResponse instance
         */
        public static create(properties?: hbonline.ITradeResponse): hbonline.TradeResponse;

        /**
         * Encodes the specified TradeResponse message. Does not implicitly {@link hbonline.TradeResponse.verify|verify} messages.
         * @param message TradeResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeResponse;

        /**
         * Gets the default type url for TradeResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeSetItem. */
    interface ITradeSetItem {

        /** TradeSetItem inventorySlot */
        inventorySlot?: (number|null);

        /** TradeSetItem count */
        count?: (number|null);
    }

    /** Represents a TradeSetItem. */
    class TradeSetItem implements ITradeSetItem {

        /**
         * Constructs a new TradeSetItem.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeSetItem);

        /** TradeSetItem inventorySlot. */
        public inventorySlot: number;

        /** TradeSetItem count. */
        public count: number;

        /**
         * Creates a new TradeSetItem instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeSetItem instance
         */
        public static create(properties?: hbonline.ITradeSetItem): hbonline.TradeSetItem;

        /**
         * Encodes the specified TradeSetItem message. Does not implicitly {@link hbonline.TradeSetItem.verify|verify} messages.
         * @param message TradeSetItem message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeSetItem, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeSetItem message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeSetItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeSetItem;

        /**
         * Gets the default type url for TradeSetItem
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeSetGold. */
    interface ITradeSetGold {

        /** TradeSetGold gold */
        gold?: (number|Long|null);
    }

    /** Represents a TradeSetGold. */
    class TradeSetGold implements ITradeSetGold {

        /**
         * Constructs a new TradeSetGold.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeSetGold);

        /** TradeSetGold gold. */
        public gold: (number|Long);

        /**
         * Creates a new TradeSetGold instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeSetGold instance
         */
        public static create(properties?: hbonline.ITradeSetGold): hbonline.TradeSetGold;

        /**
         * Encodes the specified TradeSetGold message. Does not implicitly {@link hbonline.TradeSetGold.verify|verify} messages.
         * @param message TradeSetGold message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeSetGold, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeSetGold message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeSetGold
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeSetGold;

        /**
         * Gets the default type url for TradeSetGold
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeConfirm. */
    interface ITradeConfirm {

        /** TradeConfirm confirmed */
        confirmed?: (boolean|null);
    }

    /** Represents a TradeConfirm. */
    class TradeConfirm implements ITradeConfirm {

        /**
         * Constructs a new TradeConfirm.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeConfirm);

        /** TradeConfirm confirmed. */
        public confirmed: boolean;

        /**
         * Creates a new TradeConfirm instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeConfirm instance
         */
        public static create(properties?: hbonline.ITradeConfirm): hbonline.TradeConfirm;

        /**
         * Encodes the specified TradeConfirm message. Does not implicitly {@link hbonline.TradeConfirm.verify|verify} messages.
         * @param message TradeConfirm message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeConfirm, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeConfirm message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeConfirm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeConfirm;

        /**
         * Gets the default type url for TradeConfirm
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeUpdate. */
    interface ITradeUpdate {

        /** TradeUpdate myItems */
        myItems?: (hbonline.ITradeSlot[]|null);

        /** TradeUpdate theirItems */
        theirItems?: (hbonline.ITradeSlot[]|null);

        /** TradeUpdate myGold */
        myGold?: (number|Long|null);

        /** TradeUpdate theirGold */
        theirGold?: (number|Long|null);

        /** TradeUpdate myConfirmed */
        myConfirmed?: (boolean|null);

        /** TradeUpdate theirConfirmed */
        theirConfirmed?: (boolean|null);
    }

    /** Represents a TradeUpdate. */
    class TradeUpdate implements ITradeUpdate {

        /**
         * Constructs a new TradeUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeUpdate);

        /** TradeUpdate myItems. */
        public myItems: hbonline.ITradeSlot[];

        /** TradeUpdate theirItems. */
        public theirItems: hbonline.ITradeSlot[];

        /** TradeUpdate myGold. */
        public myGold: (number|Long);

        /** TradeUpdate theirGold. */
        public theirGold: (number|Long);

        /** TradeUpdate myConfirmed. */
        public myConfirmed: boolean;

        /** TradeUpdate theirConfirmed. */
        public theirConfirmed: boolean;

        /**
         * Creates a new TradeUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeUpdate instance
         */
        public static create(properties?: hbonline.ITradeUpdate): hbonline.TradeUpdate;

        /**
         * Encodes the specified TradeUpdate message. Does not implicitly {@link hbonline.TradeUpdate.verify|verify} messages.
         * @param message TradeUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeUpdate;

        /**
         * Gets the default type url for TradeUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeSlot. */
    interface ITradeSlot {

        /** TradeSlot itemId */
        itemId?: (number|null);

        /** TradeSlot name */
        name?: (string|null);

        /** TradeSlot count */
        count?: (number|null);

        /** TradeSlot slotIndex */
        slotIndex?: (number|null);
    }

    /** Represents a TradeSlot. */
    class TradeSlot implements ITradeSlot {

        /**
         * Constructs a new TradeSlot.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeSlot);

        /** TradeSlot itemId. */
        public itemId: number;

        /** TradeSlot name. */
        public name: string;

        /** TradeSlot count. */
        public count: number;

        /** TradeSlot slotIndex. */
        public slotIndex: number;

        /**
         * Creates a new TradeSlot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeSlot instance
         */
        public static create(properties?: hbonline.ITradeSlot): hbonline.TradeSlot;

        /**
         * Encodes the specified TradeSlot message. Does not implicitly {@link hbonline.TradeSlot.verify|verify} messages.
         * @param message TradeSlot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeSlot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeSlot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeSlot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeSlot;

        /**
         * Gets the default type url for TradeSlot
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a TradeComplete. */
    interface ITradeComplete {

        /** TradeComplete success */
        success?: (boolean|null);

        /** TradeComplete message */
        message?: (string|null);
    }

    /** Represents a TradeComplete. */
    class TradeComplete implements ITradeComplete {

        /**
         * Constructs a new TradeComplete.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.ITradeComplete);

        /** TradeComplete success. */
        public success: boolean;

        /** TradeComplete message. */
        public message: string;

        /**
         * Creates a new TradeComplete instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TradeComplete instance
         */
        public static create(properties?: hbonline.ITradeComplete): hbonline.TradeComplete;

        /**
         * Encodes the specified TradeComplete message. Does not implicitly {@link hbonline.TradeComplete.verify|verify} messages.
         * @param message TradeComplete message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.ITradeComplete, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TradeComplete message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TradeComplete
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.TradeComplete;

        /**
         * Gets the default type url for TradeComplete
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PKStatusUpdate. */
    interface IPKStatusUpdate {

        /** PKStatusUpdate pkCount */
        pkCount?: (number|null);

        /** PKStatusUpdate ekCount */
        ekCount?: (number|null);

        /** PKStatusUpdate criminal */
        criminal?: (boolean|null);

        /** PKStatusUpdate criminalTimer */
        criminalTimer?: (number|null);
    }

    /** Represents a PKStatusUpdate. */
    class PKStatusUpdate implements IPKStatusUpdate {

        /**
         * Constructs a new PKStatusUpdate.
         * @param [properties] Properties to set
         */
        constructor(properties?: hbonline.IPKStatusUpdate);

        /** PKStatusUpdate pkCount. */
        public pkCount: number;

        /** PKStatusUpdate ekCount. */
        public ekCount: number;

        /** PKStatusUpdate criminal. */
        public criminal: boolean;

        /** PKStatusUpdate criminalTimer. */
        public criminalTimer: number;

        /**
         * Creates a new PKStatusUpdate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PKStatusUpdate instance
         */
        public static create(properties?: hbonline.IPKStatusUpdate): hbonline.PKStatusUpdate;

        /**
         * Encodes the specified PKStatusUpdate message. Does not implicitly {@link hbonline.PKStatusUpdate.verify|verify} messages.
         * @param message PKStatusUpdate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: hbonline.IPKStatusUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PKStatusUpdate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PKStatusUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): hbonline.PKStatusUpdate;

        /**
         * Gets the default type url for PKStatusUpdate
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
