/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const hbonline = $root.hbonline = (() => {

    /**
     * Namespace hbonline.
     * @exports hbonline
     * @namespace
     */
    const hbonline = {};

    hbonline.LoginRequest = (function() {

        /**
         * Properties of a LoginRequest.
         * @memberof hbonline
         * @interface ILoginRequest
         * @property {string|null} [username] LoginRequest username
         * @property {string|null} [password] LoginRequest password
         * @property {boolean|null} [register] LoginRequest register
         */

        /**
         * Constructs a new LoginRequest.
         * @memberof hbonline
         * @classdesc Represents a LoginRequest.
         * @implements ILoginRequest
         * @constructor
         * @param {hbonline.ILoginRequest=} [properties] Properties to set
         */
        function LoginRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginRequest username.
         * @member {string} username
         * @memberof hbonline.LoginRequest
         * @instance
         */
        LoginRequest.prototype.username = "";

        /**
         * LoginRequest password.
         * @member {string} password
         * @memberof hbonline.LoginRequest
         * @instance
         */
        LoginRequest.prototype.password = "";

        /**
         * LoginRequest register.
         * @member {boolean} register
         * @memberof hbonline.LoginRequest
         * @instance
         */
        LoginRequest.prototype.register = false;

        /**
         * Creates a new LoginRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.LoginRequest
         * @static
         * @param {hbonline.ILoginRequest=} [properties] Properties to set
         * @returns {hbonline.LoginRequest} LoginRequest instance
         */
        LoginRequest.create = function create(properties) {
            return new LoginRequest(properties);
        };

        /**
         * Encodes the specified LoginRequest message. Does not implicitly {@link hbonline.LoginRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.LoginRequest
         * @static
         * @param {hbonline.ILoginRequest} message LoginRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            if (message.register != null && Object.hasOwnProperty.call(message, "register"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.register);
            return writer;
        };

        /**
         * Decodes a LoginRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.LoginRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.LoginRequest} LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.LoginRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.password = reader.string();
                        break;
                    }
                case 3: {
                        message.register = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LoginRequest
         * @function getTypeUrl
         * @memberof hbonline.LoginRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.LoginRequest";
        };

        return LoginRequest;
    })();

    hbonline.LoginResponse = (function() {

        /**
         * Properties of a LoginResponse.
         * @memberof hbonline
         * @interface ILoginResponse
         * @property {boolean|null} [success] LoginResponse success
         * @property {string|null} [error] LoginResponse error
         * @property {Array.<hbonline.ICharacterSummary>|null} [characters] LoginResponse characters
         * @property {string|null} [token] LoginResponse token
         */

        /**
         * Constructs a new LoginResponse.
         * @memberof hbonline
         * @classdesc Represents a LoginResponse.
         * @implements ILoginResponse
         * @constructor
         * @param {hbonline.ILoginResponse=} [properties] Properties to set
         */
        function LoginResponse(properties) {
            this.characters = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginResponse success.
         * @member {boolean} success
         * @memberof hbonline.LoginResponse
         * @instance
         */
        LoginResponse.prototype.success = false;

        /**
         * LoginResponse error.
         * @member {string} error
         * @memberof hbonline.LoginResponse
         * @instance
         */
        LoginResponse.prototype.error = "";

        /**
         * LoginResponse characters.
         * @member {Array.<hbonline.ICharacterSummary>} characters
         * @memberof hbonline.LoginResponse
         * @instance
         */
        LoginResponse.prototype.characters = $util.emptyArray;

        /**
         * LoginResponse token.
         * @member {string} token
         * @memberof hbonline.LoginResponse
         * @instance
         */
        LoginResponse.prototype.token = "";

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.LoginResponse
         * @static
         * @param {hbonline.ILoginResponse=} [properties] Properties to set
         * @returns {hbonline.LoginResponse} LoginResponse instance
         */
        LoginResponse.create = function create(properties) {
            return new LoginResponse(properties);
        };

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link hbonline.LoginResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.LoginResponse
         * @static
         * @param {hbonline.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            if (message.characters != null && message.characters.length)
                for (let i = 0; i < message.characters.length; ++i)
                    $root.hbonline.CharacterSummary.encode(message.characters[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.token);
            return writer;
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.LoginResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.error = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.characters && message.characters.length))
                            message.characters = [];
                        message.characters.push($root.hbonline.CharacterSummary.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        message.token = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LoginResponse
         * @function getTypeUrl
         * @memberof hbonline.LoginResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.LoginResponse";
        };

        return LoginResponse;
    })();

    hbonline.CharacterSummary = (function() {

        /**
         * Properties of a CharacterSummary.
         * @memberof hbonline
         * @interface ICharacterSummary
         * @property {number|null} [id] CharacterSummary id
         * @property {string|null} [name] CharacterSummary name
         * @property {number|null} [level] CharacterSummary level
         * @property {number|null} [gender] CharacterSummary gender
         * @property {number|null} [side] CharacterSummary side
         * @property {string|null} [mapName] CharacterSummary mapName
         * @property {hbonline.IAppearance|null} [appearance] CharacterSummary appearance
         */

        /**
         * Constructs a new CharacterSummary.
         * @memberof hbonline
         * @classdesc Represents a CharacterSummary.
         * @implements ICharacterSummary
         * @constructor
         * @param {hbonline.ICharacterSummary=} [properties] Properties to set
         */
        function CharacterSummary(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharacterSummary id.
         * @member {number} id
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.id = 0;

        /**
         * CharacterSummary name.
         * @member {string} name
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.name = "";

        /**
         * CharacterSummary level.
         * @member {number} level
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.level = 0;

        /**
         * CharacterSummary gender.
         * @member {number} gender
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.gender = 0;

        /**
         * CharacterSummary side.
         * @member {number} side
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.side = 0;

        /**
         * CharacterSummary mapName.
         * @member {string} mapName
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.mapName = "";

        /**
         * CharacterSummary appearance.
         * @member {hbonline.IAppearance|null|undefined} appearance
         * @memberof hbonline.CharacterSummary
         * @instance
         */
        CharacterSummary.prototype.appearance = null;

        /**
         * Creates a new CharacterSummary instance using the specified properties.
         * @function create
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {hbonline.ICharacterSummary=} [properties] Properties to set
         * @returns {hbonline.CharacterSummary} CharacterSummary instance
         */
        CharacterSummary.create = function create(properties) {
            return new CharacterSummary(properties);
        };

        /**
         * Encodes the specified CharacterSummary message. Does not implicitly {@link hbonline.CharacterSummary.verify|verify} messages.
         * @function encode
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {hbonline.ICharacterSummary} message CharacterSummary message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharacterSummary.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.level);
            if (message.gender != null && Object.hasOwnProperty.call(message, "gender"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.gender);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.side);
            if (message.mapName != null && Object.hasOwnProperty.call(message, "mapName"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.mapName);
            if (message.appearance != null && Object.hasOwnProperty.call(message, "appearance"))
                $root.hbonline.Appearance.encode(message.appearance, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a CharacterSummary message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.CharacterSummary} CharacterSummary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharacterSummary.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.CharacterSummary();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.level = reader.int32();
                        break;
                    }
                case 4: {
                        message.gender = reader.int32();
                        break;
                    }
                case 5: {
                        message.side = reader.int32();
                        break;
                    }
                case 6: {
                        message.mapName = reader.string();
                        break;
                    }
                case 7: {
                        message.appearance = $root.hbonline.Appearance.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for CharacterSummary
         * @function getTypeUrl
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CharacterSummary.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.CharacterSummary";
        };

        return CharacterSummary;
    })();

    hbonline.CreateCharacterRequest = (function() {

        /**
         * Properties of a CreateCharacterRequest.
         * @memberof hbonline
         * @interface ICreateCharacterRequest
         * @property {string|null} [name] CreateCharacterRequest name
         * @property {number|null} [gender] CreateCharacterRequest gender
         * @property {number|null} [skinColor] CreateCharacterRequest skinColor
         * @property {number|null} [hairStyle] CreateCharacterRequest hairStyle
         * @property {number|null} [hairColor] CreateCharacterRequest hairColor
         * @property {number|null} [underwearColor] CreateCharacterRequest underwearColor
         * @property {number|null} [str] CreateCharacterRequest str
         * @property {number|null} [vit] CreateCharacterRequest vit
         * @property {number|null} [dex] CreateCharacterRequest dex
         * @property {number|null} [intStat] CreateCharacterRequest intStat
         * @property {number|null} [mag] CreateCharacterRequest mag
         * @property {number|null} [charisma] CreateCharacterRequest charisma
         */

        /**
         * Constructs a new CreateCharacterRequest.
         * @memberof hbonline
         * @classdesc Represents a CreateCharacterRequest.
         * @implements ICreateCharacterRequest
         * @constructor
         * @param {hbonline.ICreateCharacterRequest=} [properties] Properties to set
         */
        function CreateCharacterRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateCharacterRequest name.
         * @member {string} name
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.name = "";

        /**
         * CreateCharacterRequest gender.
         * @member {number} gender
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.gender = 0;

        /**
         * CreateCharacterRequest skinColor.
         * @member {number} skinColor
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.skinColor = 0;

        /**
         * CreateCharacterRequest hairStyle.
         * @member {number} hairStyle
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.hairStyle = 0;

        /**
         * CreateCharacterRequest hairColor.
         * @member {number} hairColor
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.hairColor = 0;

        /**
         * CreateCharacterRequest underwearColor.
         * @member {number} underwearColor
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.underwearColor = 0;

        /**
         * CreateCharacterRequest str.
         * @member {number} str
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.str = 0;

        /**
         * CreateCharacterRequest vit.
         * @member {number} vit
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.vit = 0;

        /**
         * CreateCharacterRequest dex.
         * @member {number} dex
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.dex = 0;

        /**
         * CreateCharacterRequest intStat.
         * @member {number} intStat
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.intStat = 0;

        /**
         * CreateCharacterRequest mag.
         * @member {number} mag
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.mag = 0;

        /**
         * CreateCharacterRequest charisma.
         * @member {number} charisma
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         */
        CreateCharacterRequest.prototype.charisma = 0;

        /**
         * Creates a new CreateCharacterRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {hbonline.ICreateCharacterRequest=} [properties] Properties to set
         * @returns {hbonline.CreateCharacterRequest} CreateCharacterRequest instance
         */
        CreateCharacterRequest.create = function create(properties) {
            return new CreateCharacterRequest(properties);
        };

        /**
         * Encodes the specified CreateCharacterRequest message. Does not implicitly {@link hbonline.CreateCharacterRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {hbonline.ICreateCharacterRequest} message CreateCharacterRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCharacterRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.gender != null && Object.hasOwnProperty.call(message, "gender"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.gender);
            if (message.skinColor != null && Object.hasOwnProperty.call(message, "skinColor"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.skinColor);
            if (message.hairStyle != null && Object.hasOwnProperty.call(message, "hairStyle"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.hairStyle);
            if (message.hairColor != null && Object.hasOwnProperty.call(message, "hairColor"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.hairColor);
            if (message.underwearColor != null && Object.hasOwnProperty.call(message, "underwearColor"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.underwearColor);
            if (message.str != null && Object.hasOwnProperty.call(message, "str"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.str);
            if (message.vit != null && Object.hasOwnProperty.call(message, "vit"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.vit);
            if (message.dex != null && Object.hasOwnProperty.call(message, "dex"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.dex);
            if (message.intStat != null && Object.hasOwnProperty.call(message, "intStat"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.intStat);
            if (message.mag != null && Object.hasOwnProperty.call(message, "mag"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.mag);
            if (message.charisma != null && Object.hasOwnProperty.call(message, "charisma"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.charisma);
            return writer;
        };

        /**
         * Decodes a CreateCharacterRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.CreateCharacterRequest} CreateCharacterRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCharacterRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.CreateCharacterRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.gender = reader.int32();
                        break;
                    }
                case 3: {
                        message.skinColor = reader.int32();
                        break;
                    }
                case 4: {
                        message.hairStyle = reader.int32();
                        break;
                    }
                case 5: {
                        message.hairColor = reader.int32();
                        break;
                    }
                case 6: {
                        message.underwearColor = reader.int32();
                        break;
                    }
                case 7: {
                        message.str = reader.int32();
                        break;
                    }
                case 8: {
                        message.vit = reader.int32();
                        break;
                    }
                case 9: {
                        message.dex = reader.int32();
                        break;
                    }
                case 10: {
                        message.intStat = reader.int32();
                        break;
                    }
                case 11: {
                        message.mag = reader.int32();
                        break;
                    }
                case 12: {
                        message.charisma = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for CreateCharacterRequest
         * @function getTypeUrl
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateCharacterRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.CreateCharacterRequest";
        };

        return CreateCharacterRequest;
    })();

    hbonline.CreateCharacterResponse = (function() {

        /**
         * Properties of a CreateCharacterResponse.
         * @memberof hbonline
         * @interface ICreateCharacterResponse
         * @property {boolean|null} [success] CreateCharacterResponse success
         * @property {string|null} [error] CreateCharacterResponse error
         * @property {Array.<hbonline.ICharacterSummary>|null} [characters] CreateCharacterResponse characters
         */

        /**
         * Constructs a new CreateCharacterResponse.
         * @memberof hbonline
         * @classdesc Represents a CreateCharacterResponse.
         * @implements ICreateCharacterResponse
         * @constructor
         * @param {hbonline.ICreateCharacterResponse=} [properties] Properties to set
         */
        function CreateCharacterResponse(properties) {
            this.characters = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateCharacterResponse success.
         * @member {boolean} success
         * @memberof hbonline.CreateCharacterResponse
         * @instance
         */
        CreateCharacterResponse.prototype.success = false;

        /**
         * CreateCharacterResponse error.
         * @member {string} error
         * @memberof hbonline.CreateCharacterResponse
         * @instance
         */
        CreateCharacterResponse.prototype.error = "";

        /**
         * CreateCharacterResponse characters.
         * @member {Array.<hbonline.ICharacterSummary>} characters
         * @memberof hbonline.CreateCharacterResponse
         * @instance
         */
        CreateCharacterResponse.prototype.characters = $util.emptyArray;

        /**
         * Creates a new CreateCharacterResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {hbonline.ICreateCharacterResponse=} [properties] Properties to set
         * @returns {hbonline.CreateCharacterResponse} CreateCharacterResponse instance
         */
        CreateCharacterResponse.create = function create(properties) {
            return new CreateCharacterResponse(properties);
        };

        /**
         * Encodes the specified CreateCharacterResponse message. Does not implicitly {@link hbonline.CreateCharacterResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {hbonline.ICreateCharacterResponse} message CreateCharacterResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCharacterResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            if (message.characters != null && message.characters.length)
                for (let i = 0; i < message.characters.length; ++i)
                    $root.hbonline.CharacterSummary.encode(message.characters[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a CreateCharacterResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.CreateCharacterResponse} CreateCharacterResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCharacterResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.CreateCharacterResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.error = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.characters && message.characters.length))
                            message.characters = [];
                        message.characters.push($root.hbonline.CharacterSummary.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for CreateCharacterResponse
         * @function getTypeUrl
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateCharacterResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.CreateCharacterResponse";
        };

        return CreateCharacterResponse;
    })();

    hbonline.EnterGameRequest = (function() {

        /**
         * Properties of an EnterGameRequest.
         * @memberof hbonline
         * @interface IEnterGameRequest
         * @property {number|null} [characterId] EnterGameRequest characterId
         */

        /**
         * Constructs a new EnterGameRequest.
         * @memberof hbonline
         * @classdesc Represents an EnterGameRequest.
         * @implements IEnterGameRequest
         * @constructor
         * @param {hbonline.IEnterGameRequest=} [properties] Properties to set
         */
        function EnterGameRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterGameRequest characterId.
         * @member {number} characterId
         * @memberof hbonline.EnterGameRequest
         * @instance
         */
        EnterGameRequest.prototype.characterId = 0;

        /**
         * Creates a new EnterGameRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {hbonline.IEnterGameRequest=} [properties] Properties to set
         * @returns {hbonline.EnterGameRequest} EnterGameRequest instance
         */
        EnterGameRequest.create = function create(properties) {
            return new EnterGameRequest(properties);
        };

        /**
         * Encodes the specified EnterGameRequest message. Does not implicitly {@link hbonline.EnterGameRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {hbonline.IEnterGameRequest} message EnterGameRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.characterId != null && Object.hasOwnProperty.call(message, "characterId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.characterId);
            return writer;
        };

        /**
         * Decodes an EnterGameRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.EnterGameRequest} EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.EnterGameRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.characterId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for EnterGameRequest
         * @function getTypeUrl
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterGameRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.EnterGameRequest";
        };

        return EnterGameRequest;
    })();

    hbonline.DeleteCharacterRequest = (function() {

        /**
         * Properties of a DeleteCharacterRequest.
         * @memberof hbonline
         * @interface IDeleteCharacterRequest
         * @property {number|null} [characterId] DeleteCharacterRequest characterId
         */

        /**
         * Constructs a new DeleteCharacterRequest.
         * @memberof hbonline
         * @classdesc Represents a DeleteCharacterRequest.
         * @implements IDeleteCharacterRequest
         * @constructor
         * @param {hbonline.IDeleteCharacterRequest=} [properties] Properties to set
         */
        function DeleteCharacterRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeleteCharacterRequest characterId.
         * @member {number} characterId
         * @memberof hbonline.DeleteCharacterRequest
         * @instance
         */
        DeleteCharacterRequest.prototype.characterId = 0;

        /**
         * Creates a new DeleteCharacterRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {hbonline.IDeleteCharacterRequest=} [properties] Properties to set
         * @returns {hbonline.DeleteCharacterRequest} DeleteCharacterRequest instance
         */
        DeleteCharacterRequest.create = function create(properties) {
            return new DeleteCharacterRequest(properties);
        };

        /**
         * Encodes the specified DeleteCharacterRequest message. Does not implicitly {@link hbonline.DeleteCharacterRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {hbonline.IDeleteCharacterRequest} message DeleteCharacterRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCharacterRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.characterId != null && Object.hasOwnProperty.call(message, "characterId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.characterId);
            return writer;
        };

        /**
         * Decodes a DeleteCharacterRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.DeleteCharacterRequest} DeleteCharacterRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCharacterRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.DeleteCharacterRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.characterId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for DeleteCharacterRequest
         * @function getTypeUrl
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeleteCharacterRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.DeleteCharacterRequest";
        };

        return DeleteCharacterRequest;
    })();

    hbonline.DeleteCharacterResponse = (function() {

        /**
         * Properties of a DeleteCharacterResponse.
         * @memberof hbonline
         * @interface IDeleteCharacterResponse
         * @property {boolean|null} [success] DeleteCharacterResponse success
         * @property {string|null} [error] DeleteCharacterResponse error
         * @property {Array.<hbonline.ICharacterSummary>|null} [characters] DeleteCharacterResponse characters
         */

        /**
         * Constructs a new DeleteCharacterResponse.
         * @memberof hbonline
         * @classdesc Represents a DeleteCharacterResponse.
         * @implements IDeleteCharacterResponse
         * @constructor
         * @param {hbonline.IDeleteCharacterResponse=} [properties] Properties to set
         */
        function DeleteCharacterResponse(properties) {
            this.characters = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeleteCharacterResponse success.
         * @member {boolean} success
         * @memberof hbonline.DeleteCharacterResponse
         * @instance
         */
        DeleteCharacterResponse.prototype.success = false;

        /**
         * DeleteCharacterResponse error.
         * @member {string} error
         * @memberof hbonline.DeleteCharacterResponse
         * @instance
         */
        DeleteCharacterResponse.prototype.error = "";

        /**
         * DeleteCharacterResponse characters.
         * @member {Array.<hbonline.ICharacterSummary>} characters
         * @memberof hbonline.DeleteCharacterResponse
         * @instance
         */
        DeleteCharacterResponse.prototype.characters = $util.emptyArray;

        /**
         * Creates a new DeleteCharacterResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {hbonline.IDeleteCharacterResponse=} [properties] Properties to set
         * @returns {hbonline.DeleteCharacterResponse} DeleteCharacterResponse instance
         */
        DeleteCharacterResponse.create = function create(properties) {
            return new DeleteCharacterResponse(properties);
        };

        /**
         * Encodes the specified DeleteCharacterResponse message. Does not implicitly {@link hbonline.DeleteCharacterResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {hbonline.IDeleteCharacterResponse} message DeleteCharacterResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCharacterResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            if (message.characters != null && message.characters.length)
                for (let i = 0; i < message.characters.length; ++i)
                    $root.hbonline.CharacterSummary.encode(message.characters[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a DeleteCharacterResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.DeleteCharacterResponse} DeleteCharacterResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCharacterResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.DeleteCharacterResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.error = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.characters && message.characters.length))
                            message.characters = [];
                        message.characters.push($root.hbonline.CharacterSummary.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for DeleteCharacterResponse
         * @function getTypeUrl
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeleteCharacterResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.DeleteCharacterResponse";
        };

        return DeleteCharacterResponse;
    })();

    hbonline.Vec2 = (function() {

        /**
         * Properties of a Vec2.
         * @memberof hbonline
         * @interface IVec2
         * @property {number|null} [x] Vec2 x
         * @property {number|null} [y] Vec2 y
         */

        /**
         * Constructs a new Vec2.
         * @memberof hbonline
         * @classdesc Represents a Vec2.
         * @implements IVec2
         * @constructor
         * @param {hbonline.IVec2=} [properties] Properties to set
         */
        function Vec2(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Vec2 x.
         * @member {number} x
         * @memberof hbonline.Vec2
         * @instance
         */
        Vec2.prototype.x = 0;

        /**
         * Vec2 y.
         * @member {number} y
         * @memberof hbonline.Vec2
         * @instance
         */
        Vec2.prototype.y = 0;

        /**
         * Creates a new Vec2 instance using the specified properties.
         * @function create
         * @memberof hbonline.Vec2
         * @static
         * @param {hbonline.IVec2=} [properties] Properties to set
         * @returns {hbonline.Vec2} Vec2 instance
         */
        Vec2.create = function create(properties) {
            return new Vec2(properties);
        };

        /**
         * Encodes the specified Vec2 message. Does not implicitly {@link hbonline.Vec2.verify|verify} messages.
         * @function encode
         * @memberof hbonline.Vec2
         * @static
         * @param {hbonline.IVec2} message Vec2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vec2.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y);
            return writer;
        };

        /**
         * Decodes a Vec2 message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.Vec2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.Vec2} Vec2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vec2.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.Vec2();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.x = reader.int32();
                        break;
                    }
                case 2: {
                        message.y = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for Vec2
         * @function getTypeUrl
         * @memberof hbonline.Vec2
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Vec2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.Vec2";
        };

        return Vec2;
    })();

    hbonline.Appearance = (function() {

        /**
         * Properties of an Appearance.
         * @memberof hbonline
         * @interface IAppearance
         * @property {number|null} [gender] Appearance gender
         * @property {number|null} [skinColor] Appearance skinColor
         * @property {number|null} [hairStyle] Appearance hairStyle
         * @property {number|null} [hairColor] Appearance hairColor
         * @property {number|null} [underwearColor] Appearance underwearColor
         * @property {number|null} [bodyArmor] Appearance bodyArmor
         * @property {number|null} [armArmor] Appearance armArmor
         * @property {number|null} [leggings] Appearance leggings
         * @property {number|null} [helm] Appearance helm
         * @property {number|null} [weapon] Appearance weapon
         * @property {number|null} [shield] Appearance shield
         * @property {number|null} [cape] Appearance cape
         * @property {number|null} [boots] Appearance boots
         * @property {number|null} [apprColor] Appearance apprColor
         */

        /**
         * Constructs a new Appearance.
         * @memberof hbonline
         * @classdesc Represents an Appearance.
         * @implements IAppearance
         * @constructor
         * @param {hbonline.IAppearance=} [properties] Properties to set
         */
        function Appearance(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Appearance gender.
         * @member {number} gender
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.gender = 0;

        /**
         * Appearance skinColor.
         * @member {number} skinColor
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.skinColor = 0;

        /**
         * Appearance hairStyle.
         * @member {number} hairStyle
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.hairStyle = 0;

        /**
         * Appearance hairColor.
         * @member {number} hairColor
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.hairColor = 0;

        /**
         * Appearance underwearColor.
         * @member {number} underwearColor
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.underwearColor = 0;

        /**
         * Appearance bodyArmor.
         * @member {number} bodyArmor
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.bodyArmor = 0;

        /**
         * Appearance armArmor.
         * @member {number} armArmor
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.armArmor = 0;

        /**
         * Appearance leggings.
         * @member {number} leggings
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.leggings = 0;

        /**
         * Appearance helm.
         * @member {number} helm
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.helm = 0;

        /**
         * Appearance weapon.
         * @member {number} weapon
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.weapon = 0;

        /**
         * Appearance shield.
         * @member {number} shield
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.shield = 0;

        /**
         * Appearance cape.
         * @member {number} cape
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.cape = 0;

        /**
         * Appearance boots.
         * @member {number} boots
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.boots = 0;

        /**
         * Appearance apprColor.
         * @member {number} apprColor
         * @memberof hbonline.Appearance
         * @instance
         */
        Appearance.prototype.apprColor = 0;

        /**
         * Creates a new Appearance instance using the specified properties.
         * @function create
         * @memberof hbonline.Appearance
         * @static
         * @param {hbonline.IAppearance=} [properties] Properties to set
         * @returns {hbonline.Appearance} Appearance instance
         */
        Appearance.create = function create(properties) {
            return new Appearance(properties);
        };

        /**
         * Encodes the specified Appearance message. Does not implicitly {@link hbonline.Appearance.verify|verify} messages.
         * @function encode
         * @memberof hbonline.Appearance
         * @static
         * @param {hbonline.IAppearance} message Appearance message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Appearance.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gender != null && Object.hasOwnProperty.call(message, "gender"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.gender);
            if (message.skinColor != null && Object.hasOwnProperty.call(message, "skinColor"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.skinColor);
            if (message.hairStyle != null && Object.hasOwnProperty.call(message, "hairStyle"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.hairStyle);
            if (message.hairColor != null && Object.hasOwnProperty.call(message, "hairColor"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.hairColor);
            if (message.underwearColor != null && Object.hasOwnProperty.call(message, "underwearColor"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.underwearColor);
            if (message.bodyArmor != null && Object.hasOwnProperty.call(message, "bodyArmor"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.bodyArmor);
            if (message.armArmor != null && Object.hasOwnProperty.call(message, "armArmor"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.armArmor);
            if (message.leggings != null && Object.hasOwnProperty.call(message, "leggings"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.leggings);
            if (message.helm != null && Object.hasOwnProperty.call(message, "helm"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.helm);
            if (message.weapon != null && Object.hasOwnProperty.call(message, "weapon"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.weapon);
            if (message.shield != null && Object.hasOwnProperty.call(message, "shield"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.shield);
            if (message.cape != null && Object.hasOwnProperty.call(message, "cape"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.cape);
            if (message.boots != null && Object.hasOwnProperty.call(message, "boots"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.boots);
            if (message.apprColor != null && Object.hasOwnProperty.call(message, "apprColor"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.apprColor);
            return writer;
        };

        /**
         * Decodes an Appearance message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.Appearance
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.Appearance} Appearance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Appearance.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.Appearance();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.gender = reader.int32();
                        break;
                    }
                case 2: {
                        message.skinColor = reader.int32();
                        break;
                    }
                case 3: {
                        message.hairStyle = reader.int32();
                        break;
                    }
                case 4: {
                        message.hairColor = reader.int32();
                        break;
                    }
                case 5: {
                        message.underwearColor = reader.int32();
                        break;
                    }
                case 6: {
                        message.bodyArmor = reader.int32();
                        break;
                    }
                case 7: {
                        message.armArmor = reader.int32();
                        break;
                    }
                case 8: {
                        message.leggings = reader.int32();
                        break;
                    }
                case 9: {
                        message.helm = reader.int32();
                        break;
                    }
                case 10: {
                        message.weapon = reader.int32();
                        break;
                    }
                case 11: {
                        message.shield = reader.int32();
                        break;
                    }
                case 12: {
                        message.cape = reader.int32();
                        break;
                    }
                case 13: {
                        message.boots = reader.int32();
                        break;
                    }
                case 14: {
                        message.apprColor = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for Appearance
         * @function getTypeUrl
         * @memberof hbonline.Appearance
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Appearance.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.Appearance";
        };

        return Appearance;
    })();

    hbonline.ChatRequest = (function() {

        /**
         * Properties of a ChatRequest.
         * @memberof hbonline
         * @interface IChatRequest
         * @property {number|null} [type] ChatRequest type
         * @property {string|null} [message] ChatRequest message
         * @property {string|null} [target] ChatRequest target
         */

        /**
         * Constructs a new ChatRequest.
         * @memberof hbonline
         * @classdesc Represents a ChatRequest.
         * @implements IChatRequest
         * @constructor
         * @param {hbonline.IChatRequest=} [properties] Properties to set
         */
        function ChatRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatRequest type.
         * @member {number} type
         * @memberof hbonline.ChatRequest
         * @instance
         */
        ChatRequest.prototype.type = 0;

        /**
         * ChatRequest message.
         * @member {string} message
         * @memberof hbonline.ChatRequest
         * @instance
         */
        ChatRequest.prototype.message = "";

        /**
         * ChatRequest target.
         * @member {string} target
         * @memberof hbonline.ChatRequest
         * @instance
         */
        ChatRequest.prototype.target = "";

        /**
         * Creates a new ChatRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ChatRequest
         * @static
         * @param {hbonline.IChatRequest=} [properties] Properties to set
         * @returns {hbonline.ChatRequest} ChatRequest instance
         */
        ChatRequest.create = function create(properties) {
            return new ChatRequest(properties);
        };

        /**
         * Encodes the specified ChatRequest message. Does not implicitly {@link hbonline.ChatRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ChatRequest
         * @static
         * @param {hbonline.IChatRequest} message ChatRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.target != null && Object.hasOwnProperty.call(message, "target"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.target);
            return writer;
        };

        /**
         * Decodes a ChatRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ChatRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ChatRequest} ChatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ChatRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                case 3: {
                        message.target = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ChatRequest
         * @function getTypeUrl
         * @memberof hbonline.ChatRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ChatRequest";
        };

        return ChatRequest;
    })();

    hbonline.ChatMessage = (function() {

        /**
         * Properties of a ChatMessage.
         * @memberof hbonline
         * @interface IChatMessage
         * @property {number|null} [objectId] ChatMessage objectId
         * @property {string|null} [senderName] ChatMessage senderName
         * @property {number|null} [type] ChatMessage type
         * @property {string|null} [message] ChatMessage message
         * @property {hbonline.IVec2|null} [position] ChatMessage position
         */

        /**
         * Constructs a new ChatMessage.
         * @memberof hbonline
         * @classdesc Represents a ChatMessage.
         * @implements IChatMessage
         * @constructor
         * @param {hbonline.IChatMessage=} [properties] Properties to set
         */
        function ChatMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatMessage objectId.
         * @member {number} objectId
         * @memberof hbonline.ChatMessage
         * @instance
         */
        ChatMessage.prototype.objectId = 0;

        /**
         * ChatMessage senderName.
         * @member {string} senderName
         * @memberof hbonline.ChatMessage
         * @instance
         */
        ChatMessage.prototype.senderName = "";

        /**
         * ChatMessage type.
         * @member {number} type
         * @memberof hbonline.ChatMessage
         * @instance
         */
        ChatMessage.prototype.type = 0;

        /**
         * ChatMessage message.
         * @member {string} message
         * @memberof hbonline.ChatMessage
         * @instance
         */
        ChatMessage.prototype.message = "";

        /**
         * ChatMessage position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.ChatMessage
         * @instance
         */
        ChatMessage.prototype.position = null;

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @function create
         * @memberof hbonline.ChatMessage
         * @static
         * @param {hbonline.IChatMessage=} [properties] Properties to set
         * @returns {hbonline.ChatMessage} ChatMessage instance
         */
        ChatMessage.create = function create(properties) {
            return new ChatMessage(properties);
        };

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link hbonline.ChatMessage.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ChatMessage
         * @static
         * @param {hbonline.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.senderName != null && Object.hasOwnProperty.call(message, "senderName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.senderName);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.message);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ChatMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.senderName = reader.string();
                        break;
                    }
                case 3: {
                        message.type = reader.int32();
                        break;
                    }
                case 4: {
                        message.message = reader.string();
                        break;
                    }
                case 5: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ChatMessage
         * @function getTypeUrl
         * @memberof hbonline.ChatMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ChatMessage";
        };

        return ChatMessage;
    })();

    hbonline.EnterGameResponse = (function() {

        /**
         * Properties of an EnterGameResponse.
         * @memberof hbonline
         * @interface IEnterGameResponse
         * @property {hbonline.IPlayerContents|null} [player] EnterGameResponse player
         * @property {hbonline.IMapInfo|null} [mapInfo] EnterGameResponse mapInfo
         * @property {Array.<hbonline.IEntityInfo>|null} [nearbyPlayers] EnterGameResponse nearbyPlayers
         * @property {Array.<hbonline.IEntityInfo>|null} [nearbyNpcs] EnterGameResponse nearbyNpcs
         */

        /**
         * Constructs a new EnterGameResponse.
         * @memberof hbonline
         * @classdesc Represents an EnterGameResponse.
         * @implements IEnterGameResponse
         * @constructor
         * @param {hbonline.IEnterGameResponse=} [properties] Properties to set
         */
        function EnterGameResponse(properties) {
            this.nearbyPlayers = [];
            this.nearbyNpcs = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterGameResponse player.
         * @member {hbonline.IPlayerContents|null|undefined} player
         * @memberof hbonline.EnterGameResponse
         * @instance
         */
        EnterGameResponse.prototype.player = null;

        /**
         * EnterGameResponse mapInfo.
         * @member {hbonline.IMapInfo|null|undefined} mapInfo
         * @memberof hbonline.EnterGameResponse
         * @instance
         */
        EnterGameResponse.prototype.mapInfo = null;

        /**
         * EnterGameResponse nearbyPlayers.
         * @member {Array.<hbonline.IEntityInfo>} nearbyPlayers
         * @memberof hbonline.EnterGameResponse
         * @instance
         */
        EnterGameResponse.prototype.nearbyPlayers = $util.emptyArray;

        /**
         * EnterGameResponse nearbyNpcs.
         * @member {Array.<hbonline.IEntityInfo>} nearbyNpcs
         * @memberof hbonline.EnterGameResponse
         * @instance
         */
        EnterGameResponse.prototype.nearbyNpcs = $util.emptyArray;

        /**
         * Creates a new EnterGameResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {hbonline.IEnterGameResponse=} [properties] Properties to set
         * @returns {hbonline.EnterGameResponse} EnterGameResponse instance
         */
        EnterGameResponse.create = function create(properties) {
            return new EnterGameResponse(properties);
        };

        /**
         * Encodes the specified EnterGameResponse message. Does not implicitly {@link hbonline.EnterGameResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {hbonline.IEnterGameResponse} message EnterGameResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.player != null && Object.hasOwnProperty.call(message, "player"))
                $root.hbonline.PlayerContents.encode(message.player, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.mapInfo != null && Object.hasOwnProperty.call(message, "mapInfo"))
                $root.hbonline.MapInfo.encode(message.mapInfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.nearbyPlayers != null && message.nearbyPlayers.length)
                for (let i = 0; i < message.nearbyPlayers.length; ++i)
                    $root.hbonline.EntityInfo.encode(message.nearbyPlayers[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.nearbyNpcs != null && message.nearbyNpcs.length)
                for (let i = 0; i < message.nearbyNpcs.length; ++i)
                    $root.hbonline.EntityInfo.encode(message.nearbyNpcs[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes an EnterGameResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.EnterGameResponse} EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.EnterGameResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.player = $root.hbonline.PlayerContents.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.mapInfo = $root.hbonline.MapInfo.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        if (!(message.nearbyPlayers && message.nearbyPlayers.length))
                            message.nearbyPlayers = [];
                        message.nearbyPlayers.push($root.hbonline.EntityInfo.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        if (!(message.nearbyNpcs && message.nearbyNpcs.length))
                            message.nearbyNpcs = [];
                        message.nearbyNpcs.push($root.hbonline.EntityInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for EnterGameResponse
         * @function getTypeUrl
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterGameResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.EnterGameResponse";
        };

        return EnterGameResponse;
    })();

    hbonline.PlayerContents = (function() {

        /**
         * Properties of a PlayerContents.
         * @memberof hbonline
         * @interface IPlayerContents
         * @property {number|null} [objectId] PlayerContents objectId
         * @property {string|null} [name] PlayerContents name
         * @property {string|null} [mapName] PlayerContents mapName
         * @property {hbonline.IVec2|null} [position] PlayerContents position
         * @property {number|null} [direction] PlayerContents direction
         * @property {hbonline.IAppearance|null} [appearance] PlayerContents appearance
         * @property {number|null} [level] PlayerContents level
         * @property {number|Long|null} [experience] PlayerContents experience
         * @property {number|null} [hp] PlayerContents hp
         * @property {number|null} [maxHp] PlayerContents maxHp
         * @property {number|null} [mp] PlayerContents mp
         * @property {number|null} [maxMp] PlayerContents maxMp
         * @property {number|null} [sp] PlayerContents sp
         * @property {number|null} [maxSp] PlayerContents maxSp
         * @property {number|null} [str] PlayerContents str
         * @property {number|null} [vit] PlayerContents vit
         * @property {number|null} [dex] PlayerContents dex
         * @property {number|null} [intStat] PlayerContents intStat
         * @property {number|null} [mag] PlayerContents mag
         * @property {number|null} [charisma] PlayerContents charisma
         * @property {number|null} [luPool] PlayerContents luPool
         * @property {number|null} [side] PlayerContents side
         * @property {number|Long|null} [gold] PlayerContents gold
         * @property {number|null} [pkCount] PlayerContents pkCount
         * @property {number|null} [ekCount] PlayerContents ekCount
         * @property {number|null} [hunger] PlayerContents hunger
         * @property {number|null} [adminLevel] PlayerContents adminLevel
         * @property {boolean|null} [introShown] PlayerContents introShown
         */

        /**
         * Constructs a new PlayerContents.
         * @memberof hbonline
         * @classdesc Represents a PlayerContents.
         * @implements IPlayerContents
         * @constructor
         * @param {hbonline.IPlayerContents=} [properties] Properties to set
         */
        function PlayerContents(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerContents objectId.
         * @member {number} objectId
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.objectId = 0;

        /**
         * PlayerContents name.
         * @member {string} name
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.name = "";

        /**
         * PlayerContents mapName.
         * @member {string} mapName
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.mapName = "";

        /**
         * PlayerContents position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.position = null;

        /**
         * PlayerContents direction.
         * @member {number} direction
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.direction = 0;

        /**
         * PlayerContents appearance.
         * @member {hbonline.IAppearance|null|undefined} appearance
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.appearance = null;

        /**
         * PlayerContents level.
         * @member {number} level
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.level = 0;

        /**
         * PlayerContents experience.
         * @member {number|Long} experience
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.experience = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PlayerContents hp.
         * @member {number} hp
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.hp = 0;

        /**
         * PlayerContents maxHp.
         * @member {number} maxHp
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.maxHp = 0;

        /**
         * PlayerContents mp.
         * @member {number} mp
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.mp = 0;

        /**
         * PlayerContents maxMp.
         * @member {number} maxMp
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.maxMp = 0;

        /**
         * PlayerContents sp.
         * @member {number} sp
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.sp = 0;

        /**
         * PlayerContents maxSp.
         * @member {number} maxSp
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.maxSp = 0;

        /**
         * PlayerContents str.
         * @member {number} str
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.str = 0;

        /**
         * PlayerContents vit.
         * @member {number} vit
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.vit = 0;

        /**
         * PlayerContents dex.
         * @member {number} dex
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.dex = 0;

        /**
         * PlayerContents intStat.
         * @member {number} intStat
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.intStat = 0;

        /**
         * PlayerContents mag.
         * @member {number} mag
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.mag = 0;

        /**
         * PlayerContents charisma.
         * @member {number} charisma
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.charisma = 0;

        /**
         * PlayerContents luPool.
         * @member {number} luPool
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.luPool = 0;

        /**
         * PlayerContents side.
         * @member {number} side
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.side = 0;

        /**
         * PlayerContents gold.
         * @member {number|Long} gold
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.gold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PlayerContents pkCount.
         * @member {number} pkCount
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.pkCount = 0;

        /**
         * PlayerContents ekCount.
         * @member {number} ekCount
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.ekCount = 0;

        /**
         * PlayerContents hunger.
         * @member {number} hunger
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.hunger = 0;

        /**
         * PlayerContents adminLevel.
         * @member {number} adminLevel
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.adminLevel = 0;

        /**
         * PlayerContents introShown.
         * @member {boolean} introShown
         * @memberof hbonline.PlayerContents
         * @instance
         */
        PlayerContents.prototype.introShown = false;

        /**
         * Creates a new PlayerContents instance using the specified properties.
         * @function create
         * @memberof hbonline.PlayerContents
         * @static
         * @param {hbonline.IPlayerContents=} [properties] Properties to set
         * @returns {hbonline.PlayerContents} PlayerContents instance
         */
        PlayerContents.create = function create(properties) {
            return new PlayerContents(properties);
        };

        /**
         * Encodes the specified PlayerContents message. Does not implicitly {@link hbonline.PlayerContents.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PlayerContents
         * @static
         * @param {hbonline.IPlayerContents} message PlayerContents message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerContents.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.mapName != null && Object.hasOwnProperty.call(message, "mapName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.mapName);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.direction);
            if (message.appearance != null && Object.hasOwnProperty.call(message, "appearance"))
                $root.hbonline.Appearance.encode(message.appearance, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.level);
            if (message.experience != null && Object.hasOwnProperty.call(message, "experience"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.experience);
            if (message.hp != null && Object.hasOwnProperty.call(message, "hp"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.hp);
            if (message.maxHp != null && Object.hasOwnProperty.call(message, "maxHp"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.maxHp);
            if (message.mp != null && Object.hasOwnProperty.call(message, "mp"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.mp);
            if (message.maxMp != null && Object.hasOwnProperty.call(message, "maxMp"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.maxMp);
            if (message.sp != null && Object.hasOwnProperty.call(message, "sp"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.sp);
            if (message.maxSp != null && Object.hasOwnProperty.call(message, "maxSp"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.maxSp);
            if (message.str != null && Object.hasOwnProperty.call(message, "str"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.str);
            if (message.vit != null && Object.hasOwnProperty.call(message, "vit"))
                writer.uint32(/* id 16, wireType 0 =*/128).int32(message.vit);
            if (message.dex != null && Object.hasOwnProperty.call(message, "dex"))
                writer.uint32(/* id 17, wireType 0 =*/136).int32(message.dex);
            if (message.intStat != null && Object.hasOwnProperty.call(message, "intStat"))
                writer.uint32(/* id 18, wireType 0 =*/144).int32(message.intStat);
            if (message.mag != null && Object.hasOwnProperty.call(message, "mag"))
                writer.uint32(/* id 19, wireType 0 =*/152).int32(message.mag);
            if (message.charisma != null && Object.hasOwnProperty.call(message, "charisma"))
                writer.uint32(/* id 20, wireType 0 =*/160).int32(message.charisma);
            if (message.luPool != null && Object.hasOwnProperty.call(message, "luPool"))
                writer.uint32(/* id 21, wireType 0 =*/168).int32(message.luPool);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 22, wireType 0 =*/176).int32(message.side);
            if (message.gold != null && Object.hasOwnProperty.call(message, "gold"))
                writer.uint32(/* id 23, wireType 0 =*/184).int64(message.gold);
            if (message.pkCount != null && Object.hasOwnProperty.call(message, "pkCount"))
                writer.uint32(/* id 24, wireType 0 =*/192).int32(message.pkCount);
            if (message.ekCount != null && Object.hasOwnProperty.call(message, "ekCount"))
                writer.uint32(/* id 25, wireType 0 =*/200).int32(message.ekCount);
            if (message.hunger != null && Object.hasOwnProperty.call(message, "hunger"))
                writer.uint32(/* id 26, wireType 0 =*/208).int32(message.hunger);
            if (message.adminLevel != null && Object.hasOwnProperty.call(message, "adminLevel"))
                writer.uint32(/* id 27, wireType 0 =*/216).int32(message.adminLevel);
            if (message.introShown != null && Object.hasOwnProperty.call(message, "introShown"))
                writer.uint32(/* id 28, wireType 0 =*/224).bool(message.introShown);
            return writer;
        };

        /**
         * Decodes a PlayerContents message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PlayerContents
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PlayerContents} PlayerContents
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerContents.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PlayerContents();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.mapName = reader.string();
                        break;
                    }
                case 4: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.direction = reader.int32();
                        break;
                    }
                case 6: {
                        message.appearance = $root.hbonline.Appearance.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.level = reader.int32();
                        break;
                    }
                case 8: {
                        message.experience = reader.int64();
                        break;
                    }
                case 9: {
                        message.hp = reader.int32();
                        break;
                    }
                case 10: {
                        message.maxHp = reader.int32();
                        break;
                    }
                case 11: {
                        message.mp = reader.int32();
                        break;
                    }
                case 12: {
                        message.maxMp = reader.int32();
                        break;
                    }
                case 13: {
                        message.sp = reader.int32();
                        break;
                    }
                case 14: {
                        message.maxSp = reader.int32();
                        break;
                    }
                case 15: {
                        message.str = reader.int32();
                        break;
                    }
                case 16: {
                        message.vit = reader.int32();
                        break;
                    }
                case 17: {
                        message.dex = reader.int32();
                        break;
                    }
                case 18: {
                        message.intStat = reader.int32();
                        break;
                    }
                case 19: {
                        message.mag = reader.int32();
                        break;
                    }
                case 20: {
                        message.charisma = reader.int32();
                        break;
                    }
                case 21: {
                        message.luPool = reader.int32();
                        break;
                    }
                case 22: {
                        message.side = reader.int32();
                        break;
                    }
                case 23: {
                        message.gold = reader.int64();
                        break;
                    }
                case 24: {
                        message.pkCount = reader.int32();
                        break;
                    }
                case 25: {
                        message.ekCount = reader.int32();
                        break;
                    }
                case 26: {
                        message.hunger = reader.int32();
                        break;
                    }
                case 27: {
                        message.adminLevel = reader.int32();
                        break;
                    }
                case 28: {
                        message.introShown = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PlayerContents
         * @function getTypeUrl
         * @memberof hbonline.PlayerContents
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerContents.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PlayerContents";
        };

        return PlayerContents;
    })();

    hbonline.MapInfo = (function() {

        /**
         * Properties of a MapInfo.
         * @memberof hbonline
         * @interface IMapInfo
         * @property {string|null} [name] MapInfo name
         * @property {number|null} [width] MapInfo width
         * @property {number|null} [height] MapInfo height
         * @property {Uint8Array|null} [collisionGrid] MapInfo collisionGrid
         */

        /**
         * Constructs a new MapInfo.
         * @memberof hbonline
         * @classdesc Represents a MapInfo.
         * @implements IMapInfo
         * @constructor
         * @param {hbonline.IMapInfo=} [properties] Properties to set
         */
        function MapInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MapInfo name.
         * @member {string} name
         * @memberof hbonline.MapInfo
         * @instance
         */
        MapInfo.prototype.name = "";

        /**
         * MapInfo width.
         * @member {number} width
         * @memberof hbonline.MapInfo
         * @instance
         */
        MapInfo.prototype.width = 0;

        /**
         * MapInfo height.
         * @member {number} height
         * @memberof hbonline.MapInfo
         * @instance
         */
        MapInfo.prototype.height = 0;

        /**
         * MapInfo collisionGrid.
         * @member {Uint8Array} collisionGrid
         * @memberof hbonline.MapInfo
         * @instance
         */
        MapInfo.prototype.collisionGrid = $util.newBuffer([]);

        /**
         * Creates a new MapInfo instance using the specified properties.
         * @function create
         * @memberof hbonline.MapInfo
         * @static
         * @param {hbonline.IMapInfo=} [properties] Properties to set
         * @returns {hbonline.MapInfo} MapInfo instance
         */
        MapInfo.create = function create(properties) {
            return new MapInfo(properties);
        };

        /**
         * Encodes the specified MapInfo message. Does not implicitly {@link hbonline.MapInfo.verify|verify} messages.
         * @function encode
         * @memberof hbonline.MapInfo
         * @static
         * @param {hbonline.IMapInfo} message MapInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.height);
            if (message.collisionGrid != null && Object.hasOwnProperty.call(message, "collisionGrid"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.collisionGrid);
            return writer;
        };

        /**
         * Decodes a MapInfo message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.MapInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.MapInfo} MapInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapInfo.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.MapInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.width = reader.int32();
                        break;
                    }
                case 3: {
                        message.height = reader.int32();
                        break;
                    }
                case 4: {
                        message.collisionGrid = reader.bytes();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for MapInfo
         * @function getTypeUrl
         * @memberof hbonline.MapInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MapInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.MapInfo";
        };

        return MapInfo;
    })();

    hbonline.MotionRequest = (function() {

        /**
         * Properties of a MotionRequest.
         * @memberof hbonline
         * @interface IMotionRequest
         * @property {number|null} [direction] MotionRequest direction
         * @property {number|null} [action] MotionRequest action
         * @property {hbonline.IVec2|null} [position] MotionRequest position
         * @property {number|null} [targetId] MotionRequest targetId
         * @property {number|null} [spellId] MotionRequest spellId
         */

        /**
         * Constructs a new MotionRequest.
         * @memberof hbonline
         * @classdesc Represents a MotionRequest.
         * @implements IMotionRequest
         * @constructor
         * @param {hbonline.IMotionRequest=} [properties] Properties to set
         */
        function MotionRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MotionRequest direction.
         * @member {number} direction
         * @memberof hbonline.MotionRequest
         * @instance
         */
        MotionRequest.prototype.direction = 0;

        /**
         * MotionRequest action.
         * @member {number} action
         * @memberof hbonline.MotionRequest
         * @instance
         */
        MotionRequest.prototype.action = 0;

        /**
         * MotionRequest position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.MotionRequest
         * @instance
         */
        MotionRequest.prototype.position = null;

        /**
         * MotionRequest targetId.
         * @member {number} targetId
         * @memberof hbonline.MotionRequest
         * @instance
         */
        MotionRequest.prototype.targetId = 0;

        /**
         * MotionRequest spellId.
         * @member {number} spellId
         * @memberof hbonline.MotionRequest
         * @instance
         */
        MotionRequest.prototype.spellId = 0;

        /**
         * Creates a new MotionRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.MotionRequest
         * @static
         * @param {hbonline.IMotionRequest=} [properties] Properties to set
         * @returns {hbonline.MotionRequest} MotionRequest instance
         */
        MotionRequest.create = function create(properties) {
            return new MotionRequest(properties);
        };

        /**
         * Encodes the specified MotionRequest message. Does not implicitly {@link hbonline.MotionRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.MotionRequest
         * @static
         * @param {hbonline.IMotionRequest} message MotionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MotionRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.direction);
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.action);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.targetId);
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.spellId);
            return writer;
        };

        /**
         * Decodes a MotionRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.MotionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.MotionRequest} MotionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MotionRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.MotionRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.direction = reader.int32();
                        break;
                    }
                case 2: {
                        message.action = reader.int32();
                        break;
                    }
                case 3: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.targetId = reader.int32();
                        break;
                    }
                case 5: {
                        message.spellId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for MotionRequest
         * @function getTypeUrl
         * @memberof hbonline.MotionRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MotionRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.MotionRequest";
        };

        return MotionRequest;
    })();

    hbonline.MotionEvent = (function() {

        /**
         * Properties of a MotionEvent.
         * @memberof hbonline
         * @interface IMotionEvent
         * @property {number|null} [objectId] MotionEvent objectId
         * @property {number|null} [ownerType] MotionEvent ownerType
         * @property {number|null} [action] MotionEvent action
         * @property {number|null} [direction] MotionEvent direction
         * @property {hbonline.IVec2|null} [position] MotionEvent position
         * @property {hbonline.IVec2|null} [destination] MotionEvent destination
         * @property {number|null} [speed] MotionEvent speed
         * @property {hbonline.IAppearance|null} [appearance] MotionEvent appearance
         * @property {string|null} [name] MotionEvent name
         * @property {number|null} [status] MotionEvent status
         */

        /**
         * Constructs a new MotionEvent.
         * @memberof hbonline
         * @classdesc Represents a MotionEvent.
         * @implements IMotionEvent
         * @constructor
         * @param {hbonline.IMotionEvent=} [properties] Properties to set
         */
        function MotionEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MotionEvent objectId.
         * @member {number} objectId
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.objectId = 0;

        /**
         * MotionEvent ownerType.
         * @member {number} ownerType
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.ownerType = 0;

        /**
         * MotionEvent action.
         * @member {number} action
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.action = 0;

        /**
         * MotionEvent direction.
         * @member {number} direction
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.direction = 0;

        /**
         * MotionEvent position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.position = null;

        /**
         * MotionEvent destination.
         * @member {hbonline.IVec2|null|undefined} destination
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.destination = null;

        /**
         * MotionEvent speed.
         * @member {number} speed
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.speed = 0;

        /**
         * MotionEvent appearance.
         * @member {hbonline.IAppearance|null|undefined} appearance
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.appearance = null;

        /**
         * MotionEvent name.
         * @member {string} name
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.name = "";

        /**
         * MotionEvent status.
         * @member {number} status
         * @memberof hbonline.MotionEvent
         * @instance
         */
        MotionEvent.prototype.status = 0;

        /**
         * Creates a new MotionEvent instance using the specified properties.
         * @function create
         * @memberof hbonline.MotionEvent
         * @static
         * @param {hbonline.IMotionEvent=} [properties] Properties to set
         * @returns {hbonline.MotionEvent} MotionEvent instance
         */
        MotionEvent.create = function create(properties) {
            return new MotionEvent(properties);
        };

        /**
         * Encodes the specified MotionEvent message. Does not implicitly {@link hbonline.MotionEvent.verify|verify} messages.
         * @function encode
         * @memberof hbonline.MotionEvent
         * @static
         * @param {hbonline.IMotionEvent} message MotionEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MotionEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.ownerType != null && Object.hasOwnProperty.call(message, "ownerType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.ownerType);
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.action);
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.direction);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.destination != null && Object.hasOwnProperty.call(message, "destination"))
                $root.hbonline.Vec2.encode(message.destination, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.speed);
            if (message.appearance != null && Object.hasOwnProperty.call(message, "appearance"))
                $root.hbonline.Appearance.encode(message.appearance, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.name);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.status);
            return writer;
        };

        /**
         * Decodes a MotionEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.MotionEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.MotionEvent} MotionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MotionEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.MotionEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.ownerType = reader.int32();
                        break;
                    }
                case 3: {
                        message.action = reader.int32();
                        break;
                    }
                case 4: {
                        message.direction = reader.int32();
                        break;
                    }
                case 5: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.destination = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.speed = reader.int32();
                        break;
                    }
                case 8: {
                        message.appearance = $root.hbonline.Appearance.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.name = reader.string();
                        break;
                    }
                case 10: {
                        message.status = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for MotionEvent
         * @function getTypeUrl
         * @memberof hbonline.MotionEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MotionEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.MotionEvent";
        };

        return MotionEvent;
    })();

    hbonline.PlayerAppear = (function() {

        /**
         * Properties of a PlayerAppear.
         * @memberof hbonline
         * @interface IPlayerAppear
         * @property {number|null} [objectId] PlayerAppear objectId
         * @property {string|null} [name] PlayerAppear name
         * @property {hbonline.IVec2|null} [position] PlayerAppear position
         * @property {number|null} [direction] PlayerAppear direction
         * @property {hbonline.IAppearance|null} [appearance] PlayerAppear appearance
         * @property {number|null} [action] PlayerAppear action
         * @property {number|null} [level] PlayerAppear level
         * @property {number|null} [side] PlayerAppear side
         * @property {number|null} [status] PlayerAppear status
         * @property {number|null} [pkCount] PlayerAppear pkCount
         */

        /**
         * Constructs a new PlayerAppear.
         * @memberof hbonline
         * @classdesc Represents a PlayerAppear.
         * @implements IPlayerAppear
         * @constructor
         * @param {hbonline.IPlayerAppear=} [properties] Properties to set
         */
        function PlayerAppear(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerAppear objectId.
         * @member {number} objectId
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.objectId = 0;

        /**
         * PlayerAppear name.
         * @member {string} name
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.name = "";

        /**
         * PlayerAppear position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.position = null;

        /**
         * PlayerAppear direction.
         * @member {number} direction
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.direction = 0;

        /**
         * PlayerAppear appearance.
         * @member {hbonline.IAppearance|null|undefined} appearance
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.appearance = null;

        /**
         * PlayerAppear action.
         * @member {number} action
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.action = 0;

        /**
         * PlayerAppear level.
         * @member {number} level
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.level = 0;

        /**
         * PlayerAppear side.
         * @member {number} side
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.side = 0;

        /**
         * PlayerAppear status.
         * @member {number} status
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.status = 0;

        /**
         * PlayerAppear pkCount.
         * @member {number} pkCount
         * @memberof hbonline.PlayerAppear
         * @instance
         */
        PlayerAppear.prototype.pkCount = 0;

        /**
         * Creates a new PlayerAppear instance using the specified properties.
         * @function create
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {hbonline.IPlayerAppear=} [properties] Properties to set
         * @returns {hbonline.PlayerAppear} PlayerAppear instance
         */
        PlayerAppear.create = function create(properties) {
            return new PlayerAppear(properties);
        };

        /**
         * Encodes the specified PlayerAppear message. Does not implicitly {@link hbonline.PlayerAppear.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {hbonline.IPlayerAppear} message PlayerAppear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerAppear.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.direction);
            if (message.appearance != null && Object.hasOwnProperty.call(message, "appearance"))
                $root.hbonline.Appearance.encode(message.appearance, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.action);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.level);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.side);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.status);
            if (message.pkCount != null && Object.hasOwnProperty.call(message, "pkCount"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.pkCount);
            return writer;
        };

        /**
         * Decodes a PlayerAppear message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PlayerAppear} PlayerAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerAppear.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PlayerAppear();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.direction = reader.int32();
                        break;
                    }
                case 5: {
                        message.appearance = $root.hbonline.Appearance.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.action = reader.int32();
                        break;
                    }
                case 7: {
                        message.level = reader.int32();
                        break;
                    }
                case 8: {
                        message.side = reader.int32();
                        break;
                    }
                case 9: {
                        message.status = reader.int32();
                        break;
                    }
                case 10: {
                        message.pkCount = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PlayerAppear
         * @function getTypeUrl
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerAppear.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PlayerAppear";
        };

        return PlayerAppear;
    })();

    hbonline.PlayerDisappear = (function() {

        /**
         * Properties of a PlayerDisappear.
         * @memberof hbonline
         * @interface IPlayerDisappear
         * @property {number|null} [objectId] PlayerDisappear objectId
         */

        /**
         * Constructs a new PlayerDisappear.
         * @memberof hbonline
         * @classdesc Represents a PlayerDisappear.
         * @implements IPlayerDisappear
         * @constructor
         * @param {hbonline.IPlayerDisappear=} [properties] Properties to set
         */
        function PlayerDisappear(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerDisappear objectId.
         * @member {number} objectId
         * @memberof hbonline.PlayerDisappear
         * @instance
         */
        PlayerDisappear.prototype.objectId = 0;

        /**
         * Creates a new PlayerDisappear instance using the specified properties.
         * @function create
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {hbonline.IPlayerDisappear=} [properties] Properties to set
         * @returns {hbonline.PlayerDisappear} PlayerDisappear instance
         */
        PlayerDisappear.create = function create(properties) {
            return new PlayerDisappear(properties);
        };

        /**
         * Encodes the specified PlayerDisappear message. Does not implicitly {@link hbonline.PlayerDisappear.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {hbonline.IPlayerDisappear} message PlayerDisappear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerDisappear.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            return writer;
        };

        /**
         * Decodes a PlayerDisappear message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PlayerDisappear} PlayerDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerDisappear.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PlayerDisappear();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PlayerDisappear
         * @function getTypeUrl
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PlayerDisappear.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PlayerDisappear";
        };

        return PlayerDisappear;
    })();

    hbonline.NpcAppear = (function() {

        /**
         * Properties of a NpcAppear.
         * @memberof hbonline
         * @interface INpcAppear
         * @property {number|null} [objectId] NpcAppear objectId
         * @property {string|null} [name] NpcAppear name
         * @property {number|null} [npcType] NpcAppear npcType
         * @property {hbonline.IVec2|null} [position] NpcAppear position
         * @property {number|null} [direction] NpcAppear direction
         * @property {number|null} [action] NpcAppear action
         * @property {number|null} [status] NpcAppear status
         */

        /**
         * Constructs a new NpcAppear.
         * @memberof hbonline
         * @classdesc Represents a NpcAppear.
         * @implements INpcAppear
         * @constructor
         * @param {hbonline.INpcAppear=} [properties] Properties to set
         */
        function NpcAppear(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NpcAppear objectId.
         * @member {number} objectId
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.objectId = 0;

        /**
         * NpcAppear name.
         * @member {string} name
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.name = "";

        /**
         * NpcAppear npcType.
         * @member {number} npcType
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.npcType = 0;

        /**
         * NpcAppear position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.position = null;

        /**
         * NpcAppear direction.
         * @member {number} direction
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.direction = 0;

        /**
         * NpcAppear action.
         * @member {number} action
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.action = 0;

        /**
         * NpcAppear status.
         * @member {number} status
         * @memberof hbonline.NpcAppear
         * @instance
         */
        NpcAppear.prototype.status = 0;

        /**
         * Creates a new NpcAppear instance using the specified properties.
         * @function create
         * @memberof hbonline.NpcAppear
         * @static
         * @param {hbonline.INpcAppear=} [properties] Properties to set
         * @returns {hbonline.NpcAppear} NpcAppear instance
         */
        NpcAppear.create = function create(properties) {
            return new NpcAppear(properties);
        };

        /**
         * Encodes the specified NpcAppear message. Does not implicitly {@link hbonline.NpcAppear.verify|verify} messages.
         * @function encode
         * @memberof hbonline.NpcAppear
         * @static
         * @param {hbonline.INpcAppear} message NpcAppear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NpcAppear.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.npcType != null && Object.hasOwnProperty.call(message, "npcType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.npcType);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.direction);
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.action);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.status);
            return writer;
        };

        /**
         * Decodes a NpcAppear message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.NpcAppear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.NpcAppear} NpcAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NpcAppear.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.NpcAppear();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.npcType = reader.int32();
                        break;
                    }
                case 4: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.direction = reader.int32();
                        break;
                    }
                case 6: {
                        message.action = reader.int32();
                        break;
                    }
                case 7: {
                        message.status = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for NpcAppear
         * @function getTypeUrl
         * @memberof hbonline.NpcAppear
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NpcAppear.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.NpcAppear";
        };

        return NpcAppear;
    })();

    hbonline.NpcDisappear = (function() {

        /**
         * Properties of a NpcDisappear.
         * @memberof hbonline
         * @interface INpcDisappear
         * @property {number|null} [objectId] NpcDisappear objectId
         */

        /**
         * Constructs a new NpcDisappear.
         * @memberof hbonline
         * @classdesc Represents a NpcDisappear.
         * @implements INpcDisappear
         * @constructor
         * @param {hbonline.INpcDisappear=} [properties] Properties to set
         */
        function NpcDisappear(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NpcDisappear objectId.
         * @member {number} objectId
         * @memberof hbonline.NpcDisappear
         * @instance
         */
        NpcDisappear.prototype.objectId = 0;

        /**
         * Creates a new NpcDisappear instance using the specified properties.
         * @function create
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {hbonline.INpcDisappear=} [properties] Properties to set
         * @returns {hbonline.NpcDisappear} NpcDisappear instance
         */
        NpcDisappear.create = function create(properties) {
            return new NpcDisappear(properties);
        };

        /**
         * Encodes the specified NpcDisappear message. Does not implicitly {@link hbonline.NpcDisappear.verify|verify} messages.
         * @function encode
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {hbonline.INpcDisappear} message NpcDisappear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NpcDisappear.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            return writer;
        };

        /**
         * Decodes a NpcDisappear message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.NpcDisappear} NpcDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NpcDisappear.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.NpcDisappear();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for NpcDisappear
         * @function getTypeUrl
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NpcDisappear.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.NpcDisappear";
        };

        return NpcDisappear;
    })();

    hbonline.NpcMotion = (function() {

        /**
         * Properties of a NpcMotion.
         * @memberof hbonline
         * @interface INpcMotion
         * @property {number|null} [objectId] NpcMotion objectId
         * @property {number|null} [action] NpcMotion action
         * @property {number|null} [direction] NpcMotion direction
         * @property {hbonline.IVec2|null} [position] NpcMotion position
         * @property {hbonline.IVec2|null} [destination] NpcMotion destination
         * @property {number|null} [speed] NpcMotion speed
         * @property {string|null} [name] NpcMotion name
         * @property {number|null} [npcType] NpcMotion npcType
         */

        /**
         * Constructs a new NpcMotion.
         * @memberof hbonline
         * @classdesc Represents a NpcMotion.
         * @implements INpcMotion
         * @constructor
         * @param {hbonline.INpcMotion=} [properties] Properties to set
         */
        function NpcMotion(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NpcMotion objectId.
         * @member {number} objectId
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.objectId = 0;

        /**
         * NpcMotion action.
         * @member {number} action
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.action = 0;

        /**
         * NpcMotion direction.
         * @member {number} direction
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.direction = 0;

        /**
         * NpcMotion position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.position = null;

        /**
         * NpcMotion destination.
         * @member {hbonline.IVec2|null|undefined} destination
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.destination = null;

        /**
         * NpcMotion speed.
         * @member {number} speed
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.speed = 0;

        /**
         * NpcMotion name.
         * @member {string} name
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.name = "";

        /**
         * NpcMotion npcType.
         * @member {number} npcType
         * @memberof hbonline.NpcMotion
         * @instance
         */
        NpcMotion.prototype.npcType = 0;

        /**
         * Creates a new NpcMotion instance using the specified properties.
         * @function create
         * @memberof hbonline.NpcMotion
         * @static
         * @param {hbonline.INpcMotion=} [properties] Properties to set
         * @returns {hbonline.NpcMotion} NpcMotion instance
         */
        NpcMotion.create = function create(properties) {
            return new NpcMotion(properties);
        };

        /**
         * Encodes the specified NpcMotion message. Does not implicitly {@link hbonline.NpcMotion.verify|verify} messages.
         * @function encode
         * @memberof hbonline.NpcMotion
         * @static
         * @param {hbonline.INpcMotion} message NpcMotion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NpcMotion.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.action);
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.direction);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.destination != null && Object.hasOwnProperty.call(message, "destination"))
                $root.hbonline.Vec2.encode(message.destination, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.speed);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.name);
            if (message.npcType != null && Object.hasOwnProperty.call(message, "npcType"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.npcType);
            return writer;
        };

        /**
         * Decodes a NpcMotion message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.NpcMotion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.NpcMotion} NpcMotion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NpcMotion.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.NpcMotion();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.action = reader.int32();
                        break;
                    }
                case 3: {
                        message.direction = reader.int32();
                        break;
                    }
                case 4: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.destination = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.speed = reader.int32();
                        break;
                    }
                case 7: {
                        message.name = reader.string();
                        break;
                    }
                case 8: {
                        message.npcType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for NpcMotion
         * @function getTypeUrl
         * @memberof hbonline.NpcMotion
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NpcMotion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.NpcMotion";
        };

        return NpcMotion;
    })();

    hbonline.Notification = (function() {

        /**
         * Properties of a Notification.
         * @memberof hbonline
         * @interface INotification
         * @property {string|null} [message] Notification message
         * @property {number|null} [type] Notification type
         */

        /**
         * Constructs a new Notification.
         * @memberof hbonline
         * @classdesc Represents a Notification.
         * @implements INotification
         * @constructor
         * @param {hbonline.INotification=} [properties] Properties to set
         */
        function Notification(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Notification message.
         * @member {string} message
         * @memberof hbonline.Notification
         * @instance
         */
        Notification.prototype.message = "";

        /**
         * Notification type.
         * @member {number} type
         * @memberof hbonline.Notification
         * @instance
         */
        Notification.prototype.type = 0;

        /**
         * Creates a new Notification instance using the specified properties.
         * @function create
         * @memberof hbonline.Notification
         * @static
         * @param {hbonline.INotification=} [properties] Properties to set
         * @returns {hbonline.Notification} Notification instance
         */
        Notification.create = function create(properties) {
            return new Notification(properties);
        };

        /**
         * Encodes the specified Notification message. Does not implicitly {@link hbonline.Notification.verify|verify} messages.
         * @function encode
         * @memberof hbonline.Notification
         * @static
         * @param {hbonline.INotification} message Notification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Notification.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
            return writer;
        };

        /**
         * Decodes a Notification message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.Notification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.Notification} Notification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Notification.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.Notification();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                case 2: {
                        message.type = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for Notification
         * @function getTypeUrl
         * @memberof hbonline.Notification
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Notification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.Notification";
        };

        return Notification;
    })();

    hbonline.MapChangeResponse = (function() {

        /**
         * Properties of a MapChangeResponse.
         * @memberof hbonline
         * @interface IMapChangeResponse
         * @property {string|null} [mapName] MapChangeResponse mapName
         * @property {hbonline.IVec2|null} [position] MapChangeResponse position
         * @property {number|null} [direction] MapChangeResponse direction
         */

        /**
         * Constructs a new MapChangeResponse.
         * @memberof hbonline
         * @classdesc Represents a MapChangeResponse.
         * @implements IMapChangeResponse
         * @constructor
         * @param {hbonline.IMapChangeResponse=} [properties] Properties to set
         */
        function MapChangeResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MapChangeResponse mapName.
         * @member {string} mapName
         * @memberof hbonline.MapChangeResponse
         * @instance
         */
        MapChangeResponse.prototype.mapName = "";

        /**
         * MapChangeResponse position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.MapChangeResponse
         * @instance
         */
        MapChangeResponse.prototype.position = null;

        /**
         * MapChangeResponse direction.
         * @member {number} direction
         * @memberof hbonline.MapChangeResponse
         * @instance
         */
        MapChangeResponse.prototype.direction = 0;

        /**
         * Creates a new MapChangeResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {hbonline.IMapChangeResponse=} [properties] Properties to set
         * @returns {hbonline.MapChangeResponse} MapChangeResponse instance
         */
        MapChangeResponse.create = function create(properties) {
            return new MapChangeResponse(properties);
        };

        /**
         * Encodes the specified MapChangeResponse message. Does not implicitly {@link hbonline.MapChangeResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {hbonline.IMapChangeResponse} message MapChangeResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapChangeResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.mapName != null && Object.hasOwnProperty.call(message, "mapName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.mapName);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.direction);
            return writer;
        };

        /**
         * Decodes a MapChangeResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.MapChangeResponse} MapChangeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapChangeResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.MapChangeResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.mapName = reader.string();
                        break;
                    }
                case 2: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.direction = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for MapChangeResponse
         * @function getTypeUrl
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MapChangeResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.MapChangeResponse";
        };

        return MapChangeResponse;
    })();

    hbonline.DamageEvent = (function() {

        /**
         * Properties of a DamageEvent.
         * @memberof hbonline
         * @interface IDamageEvent
         * @property {number|null} [attackerId] DamageEvent attackerId
         * @property {number|null} [targetId] DamageEvent targetId
         * @property {number|null} [targetType] DamageEvent targetType
         * @property {number|null} [damage] DamageEvent damage
         * @property {boolean|null} [critical] DamageEvent critical
         * @property {boolean|null} [miss] DamageEvent miss
         * @property {number|null} [targetHp] DamageEvent targetHp
         * @property {number|null} [targetMaxHp] DamageEvent targetMaxHp
         */

        /**
         * Constructs a new DamageEvent.
         * @memberof hbonline
         * @classdesc Represents a DamageEvent.
         * @implements IDamageEvent
         * @constructor
         * @param {hbonline.IDamageEvent=} [properties] Properties to set
         */
        function DamageEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DamageEvent attackerId.
         * @member {number} attackerId
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.attackerId = 0;

        /**
         * DamageEvent targetId.
         * @member {number} targetId
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.targetId = 0;

        /**
         * DamageEvent targetType.
         * @member {number} targetType
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.targetType = 0;

        /**
         * DamageEvent damage.
         * @member {number} damage
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.damage = 0;

        /**
         * DamageEvent critical.
         * @member {boolean} critical
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.critical = false;

        /**
         * DamageEvent miss.
         * @member {boolean} miss
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.miss = false;

        /**
         * DamageEvent targetHp.
         * @member {number} targetHp
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.targetHp = 0;

        /**
         * DamageEvent targetMaxHp.
         * @member {number} targetMaxHp
         * @memberof hbonline.DamageEvent
         * @instance
         */
        DamageEvent.prototype.targetMaxHp = 0;

        /**
         * Creates a new DamageEvent instance using the specified properties.
         * @function create
         * @memberof hbonline.DamageEvent
         * @static
         * @param {hbonline.IDamageEvent=} [properties] Properties to set
         * @returns {hbonline.DamageEvent} DamageEvent instance
         */
        DamageEvent.create = function create(properties) {
            return new DamageEvent(properties);
        };

        /**
         * Encodes the specified DamageEvent message. Does not implicitly {@link hbonline.DamageEvent.verify|verify} messages.
         * @function encode
         * @memberof hbonline.DamageEvent
         * @static
         * @param {hbonline.IDamageEvent} message DamageEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DamageEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.attackerId != null && Object.hasOwnProperty.call(message, "attackerId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.attackerId);
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.targetId);
            if (message.targetType != null && Object.hasOwnProperty.call(message, "targetType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.targetType);
            if (message.damage != null && Object.hasOwnProperty.call(message, "damage"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.damage);
            if (message.critical != null && Object.hasOwnProperty.call(message, "critical"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.critical);
            if (message.miss != null && Object.hasOwnProperty.call(message, "miss"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.miss);
            if (message.targetHp != null && Object.hasOwnProperty.call(message, "targetHp"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.targetHp);
            if (message.targetMaxHp != null && Object.hasOwnProperty.call(message, "targetMaxHp"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.targetMaxHp);
            return writer;
        };

        /**
         * Decodes a DamageEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.DamageEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.DamageEvent} DamageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DamageEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.DamageEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.attackerId = reader.int32();
                        break;
                    }
                case 2: {
                        message.targetId = reader.int32();
                        break;
                    }
                case 3: {
                        message.targetType = reader.int32();
                        break;
                    }
                case 4: {
                        message.damage = reader.int32();
                        break;
                    }
                case 5: {
                        message.critical = reader.bool();
                        break;
                    }
                case 6: {
                        message.miss = reader.bool();
                        break;
                    }
                case 7: {
                        message.targetHp = reader.int32();
                        break;
                    }
                case 8: {
                        message.targetMaxHp = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for DamageEvent
         * @function getTypeUrl
         * @memberof hbonline.DamageEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DamageEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.DamageEvent";
        };

        return DamageEvent;
    })();

    hbonline.StatUpdate = (function() {

        /**
         * Properties of a StatUpdate.
         * @memberof hbonline
         * @interface IStatUpdate
         * @property {number|null} [hp] StatUpdate hp
         * @property {number|null} [maxHp] StatUpdate maxHp
         * @property {number|null} [mp] StatUpdate mp
         * @property {number|null} [maxMp] StatUpdate maxMp
         * @property {number|null} [sp] StatUpdate sp
         * @property {number|null} [maxSp] StatUpdate maxSp
         * @property {number|Long|null} [experience] StatUpdate experience
         * @property {number|null} [level] StatUpdate level
         * @property {number|null} [luPool] StatUpdate luPool
         * @property {number|null} [str] StatUpdate str
         * @property {number|null} [vit] StatUpdate vit
         * @property {number|null} [dex] StatUpdate dex
         * @property {number|null} [intStat] StatUpdate intStat
         * @property {number|null} [mag] StatUpdate mag
         * @property {number|null} [charisma] StatUpdate charisma
         * @property {number|Long|null} [gold] StatUpdate gold
         */

        /**
         * Constructs a new StatUpdate.
         * @memberof hbonline
         * @classdesc Represents a StatUpdate.
         * @implements IStatUpdate
         * @constructor
         * @param {hbonline.IStatUpdate=} [properties] Properties to set
         */
        function StatUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StatUpdate hp.
         * @member {number} hp
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.hp = 0;

        /**
         * StatUpdate maxHp.
         * @member {number} maxHp
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.maxHp = 0;

        /**
         * StatUpdate mp.
         * @member {number} mp
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.mp = 0;

        /**
         * StatUpdate maxMp.
         * @member {number} maxMp
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.maxMp = 0;

        /**
         * StatUpdate sp.
         * @member {number} sp
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.sp = 0;

        /**
         * StatUpdate maxSp.
         * @member {number} maxSp
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.maxSp = 0;

        /**
         * StatUpdate experience.
         * @member {number|Long} experience
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.experience = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * StatUpdate level.
         * @member {number} level
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.level = 0;

        /**
         * StatUpdate luPool.
         * @member {number} luPool
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.luPool = 0;

        /**
         * StatUpdate str.
         * @member {number} str
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.str = 0;

        /**
         * StatUpdate vit.
         * @member {number} vit
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.vit = 0;

        /**
         * StatUpdate dex.
         * @member {number} dex
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.dex = 0;

        /**
         * StatUpdate intStat.
         * @member {number} intStat
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.intStat = 0;

        /**
         * StatUpdate mag.
         * @member {number} mag
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.mag = 0;

        /**
         * StatUpdate charisma.
         * @member {number} charisma
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.charisma = 0;

        /**
         * StatUpdate gold.
         * @member {number|Long} gold
         * @memberof hbonline.StatUpdate
         * @instance
         */
        StatUpdate.prototype.gold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new StatUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.StatUpdate
         * @static
         * @param {hbonline.IStatUpdate=} [properties] Properties to set
         * @returns {hbonline.StatUpdate} StatUpdate instance
         */
        StatUpdate.create = function create(properties) {
            return new StatUpdate(properties);
        };

        /**
         * Encodes the specified StatUpdate message. Does not implicitly {@link hbonline.StatUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.StatUpdate
         * @static
         * @param {hbonline.IStatUpdate} message StatUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hp != null && Object.hasOwnProperty.call(message, "hp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.hp);
            if (message.maxHp != null && Object.hasOwnProperty.call(message, "maxHp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.maxHp);
            if (message.mp != null && Object.hasOwnProperty.call(message, "mp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.mp);
            if (message.maxMp != null && Object.hasOwnProperty.call(message, "maxMp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.maxMp);
            if (message.sp != null && Object.hasOwnProperty.call(message, "sp"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.sp);
            if (message.maxSp != null && Object.hasOwnProperty.call(message, "maxSp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.maxSp);
            if (message.experience != null && Object.hasOwnProperty.call(message, "experience"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.experience);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.level);
            if (message.luPool != null && Object.hasOwnProperty.call(message, "luPool"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.luPool);
            if (message.str != null && Object.hasOwnProperty.call(message, "str"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.str);
            if (message.vit != null && Object.hasOwnProperty.call(message, "vit"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.vit);
            if (message.dex != null && Object.hasOwnProperty.call(message, "dex"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.dex);
            if (message.intStat != null && Object.hasOwnProperty.call(message, "intStat"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.intStat);
            if (message.mag != null && Object.hasOwnProperty.call(message, "mag"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.mag);
            if (message.charisma != null && Object.hasOwnProperty.call(message, "charisma"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.charisma);
            if (message.gold != null && Object.hasOwnProperty.call(message, "gold"))
                writer.uint32(/* id 16, wireType 0 =*/128).int64(message.gold);
            return writer;
        };

        /**
         * Decodes a StatUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.StatUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.StatUpdate} StatUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.StatUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.hp = reader.int32();
                        break;
                    }
                case 2: {
                        message.maxHp = reader.int32();
                        break;
                    }
                case 3: {
                        message.mp = reader.int32();
                        break;
                    }
                case 4: {
                        message.maxMp = reader.int32();
                        break;
                    }
                case 5: {
                        message.sp = reader.int32();
                        break;
                    }
                case 6: {
                        message.maxSp = reader.int32();
                        break;
                    }
                case 7: {
                        message.experience = reader.int64();
                        break;
                    }
                case 8: {
                        message.level = reader.int32();
                        break;
                    }
                case 9: {
                        message.luPool = reader.int32();
                        break;
                    }
                case 10: {
                        message.str = reader.int32();
                        break;
                    }
                case 11: {
                        message.vit = reader.int32();
                        break;
                    }
                case 12: {
                        message.dex = reader.int32();
                        break;
                    }
                case 13: {
                        message.intStat = reader.int32();
                        break;
                    }
                case 14: {
                        message.mag = reader.int32();
                        break;
                    }
                case 15: {
                        message.charisma = reader.int32();
                        break;
                    }
                case 16: {
                        message.gold = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for StatUpdate
         * @function getTypeUrl
         * @memberof hbonline.StatUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StatUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.StatUpdate";
        };

        return StatUpdate;
    })();

    hbonline.DeathEvent = (function() {

        /**
         * Properties of a DeathEvent.
         * @memberof hbonline
         * @interface IDeathEvent
         * @property {number|null} [objectId] DeathEvent objectId
         * @property {number|null} [objectType] DeathEvent objectType
         * @property {number|null} [killerId] DeathEvent killerId
         * @property {string|null} [killerName] DeathEvent killerName
         * @property {hbonline.IVec2|null} [position] DeathEvent position
         */

        /**
         * Constructs a new DeathEvent.
         * @memberof hbonline
         * @classdesc Represents a DeathEvent.
         * @implements IDeathEvent
         * @constructor
         * @param {hbonline.IDeathEvent=} [properties] Properties to set
         */
        function DeathEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeathEvent objectId.
         * @member {number} objectId
         * @memberof hbonline.DeathEvent
         * @instance
         */
        DeathEvent.prototype.objectId = 0;

        /**
         * DeathEvent objectType.
         * @member {number} objectType
         * @memberof hbonline.DeathEvent
         * @instance
         */
        DeathEvent.prototype.objectType = 0;

        /**
         * DeathEvent killerId.
         * @member {number} killerId
         * @memberof hbonline.DeathEvent
         * @instance
         */
        DeathEvent.prototype.killerId = 0;

        /**
         * DeathEvent killerName.
         * @member {string} killerName
         * @memberof hbonline.DeathEvent
         * @instance
         */
        DeathEvent.prototype.killerName = "";

        /**
         * DeathEvent position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.DeathEvent
         * @instance
         */
        DeathEvent.prototype.position = null;

        /**
         * Creates a new DeathEvent instance using the specified properties.
         * @function create
         * @memberof hbonline.DeathEvent
         * @static
         * @param {hbonline.IDeathEvent=} [properties] Properties to set
         * @returns {hbonline.DeathEvent} DeathEvent instance
         */
        DeathEvent.create = function create(properties) {
            return new DeathEvent(properties);
        };

        /**
         * Encodes the specified DeathEvent message. Does not implicitly {@link hbonline.DeathEvent.verify|verify} messages.
         * @function encode
         * @memberof hbonline.DeathEvent
         * @static
         * @param {hbonline.IDeathEvent} message DeathEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeathEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.objectType != null && Object.hasOwnProperty.call(message, "objectType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.objectType);
            if (message.killerId != null && Object.hasOwnProperty.call(message, "killerId"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.killerId);
            if (message.killerName != null && Object.hasOwnProperty.call(message, "killerName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.killerName);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a DeathEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.DeathEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.DeathEvent} DeathEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeathEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.DeathEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.objectType = reader.int32();
                        break;
                    }
                case 3: {
                        message.killerId = reader.int32();
                        break;
                    }
                case 4: {
                        message.killerName = reader.string();
                        break;
                    }
                case 5: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for DeathEvent
         * @function getTypeUrl
         * @memberof hbonline.DeathEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeathEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.DeathEvent";
        };

        return DeathEvent;
    })();

    hbonline.RespawnEvent = (function() {

        /**
         * Properties of a RespawnEvent.
         * @memberof hbonline
         * @interface IRespawnEvent
         * @property {hbonline.IVec2|null} [position] RespawnEvent position
         * @property {number|null} [direction] RespawnEvent direction
         * @property {string|null} [mapName] RespawnEvent mapName
         * @property {number|null} [hp] RespawnEvent hp
         * @property {number|null} [mp] RespawnEvent mp
         * @property {number|null} [sp] RespawnEvent sp
         */

        /**
         * Constructs a new RespawnEvent.
         * @memberof hbonline
         * @classdesc Represents a RespawnEvent.
         * @implements IRespawnEvent
         * @constructor
         * @param {hbonline.IRespawnEvent=} [properties] Properties to set
         */
        function RespawnEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RespawnEvent position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.RespawnEvent
         * @instance
         */
        RespawnEvent.prototype.position = null;

        /**
         * RespawnEvent direction.
         * @member {number} direction
         * @memberof hbonline.RespawnEvent
         * @instance
         */
        RespawnEvent.prototype.direction = 0;

        /**
         * RespawnEvent mapName.
         * @member {string} mapName
         * @memberof hbonline.RespawnEvent
         * @instance
         */
        RespawnEvent.prototype.mapName = "";

        /**
         * RespawnEvent hp.
         * @member {number} hp
         * @memberof hbonline.RespawnEvent
         * @instance
         */
        RespawnEvent.prototype.hp = 0;

        /**
         * RespawnEvent mp.
         * @member {number} mp
         * @memberof hbonline.RespawnEvent
         * @instance
         */
        RespawnEvent.prototype.mp = 0;

        /**
         * RespawnEvent sp.
         * @member {number} sp
         * @memberof hbonline.RespawnEvent
         * @instance
         */
        RespawnEvent.prototype.sp = 0;

        /**
         * Creates a new RespawnEvent instance using the specified properties.
         * @function create
         * @memberof hbonline.RespawnEvent
         * @static
         * @param {hbonline.IRespawnEvent=} [properties] Properties to set
         * @returns {hbonline.RespawnEvent} RespawnEvent instance
         */
        RespawnEvent.create = function create(properties) {
            return new RespawnEvent(properties);
        };

        /**
         * Encodes the specified RespawnEvent message. Does not implicitly {@link hbonline.RespawnEvent.verify|verify} messages.
         * @function encode
         * @memberof hbonline.RespawnEvent
         * @static
         * @param {hbonline.IRespawnEvent} message RespawnEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RespawnEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.direction);
            if (message.mapName != null && Object.hasOwnProperty.call(message, "mapName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.mapName);
            if (message.hp != null && Object.hasOwnProperty.call(message, "hp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.hp);
            if (message.mp != null && Object.hasOwnProperty.call(message, "mp"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.mp);
            if (message.sp != null && Object.hasOwnProperty.call(message, "sp"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.sp);
            return writer;
        };

        /**
         * Decodes a RespawnEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.RespawnEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.RespawnEvent} RespawnEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RespawnEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.RespawnEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.direction = reader.int32();
                        break;
                    }
                case 3: {
                        message.mapName = reader.string();
                        break;
                    }
                case 4: {
                        message.hp = reader.int32();
                        break;
                    }
                case 5: {
                        message.mp = reader.int32();
                        break;
                    }
                case 6: {
                        message.sp = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for RespawnEvent
         * @function getTypeUrl
         * @memberof hbonline.RespawnEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RespawnEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.RespawnEvent";
        };

        return RespawnEvent;
    })();

    hbonline.LogoutRequest = (function() {

        /**
         * Properties of a LogoutRequest.
         * @memberof hbonline
         * @interface ILogoutRequest
         * @property {boolean|null} [cancel] LogoutRequest cancel
         */

        /**
         * Constructs a new LogoutRequest.
         * @memberof hbonline
         * @classdesc Represents a LogoutRequest.
         * @implements ILogoutRequest
         * @constructor
         * @param {hbonline.ILogoutRequest=} [properties] Properties to set
         */
        function LogoutRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogoutRequest cancel.
         * @member {boolean} cancel
         * @memberof hbonline.LogoutRequest
         * @instance
         */
        LogoutRequest.prototype.cancel = false;

        /**
         * Creates a new LogoutRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.LogoutRequest
         * @static
         * @param {hbonline.ILogoutRequest=} [properties] Properties to set
         * @returns {hbonline.LogoutRequest} LogoutRequest instance
         */
        LogoutRequest.create = function create(properties) {
            return new LogoutRequest(properties);
        };

        /**
         * Encodes the specified LogoutRequest message. Does not implicitly {@link hbonline.LogoutRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.LogoutRequest
         * @static
         * @param {hbonline.ILogoutRequest} message LogoutRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogoutRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cancel != null && Object.hasOwnProperty.call(message, "cancel"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.cancel);
            return writer;
        };

        /**
         * Decodes a LogoutRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.LogoutRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.LogoutRequest} LogoutRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogoutRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.LogoutRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.cancel = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LogoutRequest
         * @function getTypeUrl
         * @memberof hbonline.LogoutRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LogoutRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.LogoutRequest";
        };

        return LogoutRequest;
    })();

    hbonline.LogoutResponse = (function() {

        /**
         * Properties of a LogoutResponse.
         * @memberof hbonline
         * @interface ILogoutResponse
         * @property {number|null} [secondsRemaining] LogoutResponse secondsRemaining
         * @property {boolean|null} [cancelled] LogoutResponse cancelled
         * @property {string|null} [reason] LogoutResponse reason
         */

        /**
         * Constructs a new LogoutResponse.
         * @memberof hbonline
         * @classdesc Represents a LogoutResponse.
         * @implements ILogoutResponse
         * @constructor
         * @param {hbonline.ILogoutResponse=} [properties] Properties to set
         */
        function LogoutResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogoutResponse secondsRemaining.
         * @member {number} secondsRemaining
         * @memberof hbonline.LogoutResponse
         * @instance
         */
        LogoutResponse.prototype.secondsRemaining = 0;

        /**
         * LogoutResponse cancelled.
         * @member {boolean} cancelled
         * @memberof hbonline.LogoutResponse
         * @instance
         */
        LogoutResponse.prototype.cancelled = false;

        /**
         * LogoutResponse reason.
         * @member {string} reason
         * @memberof hbonline.LogoutResponse
         * @instance
         */
        LogoutResponse.prototype.reason = "";

        /**
         * Creates a new LogoutResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.LogoutResponse
         * @static
         * @param {hbonline.ILogoutResponse=} [properties] Properties to set
         * @returns {hbonline.LogoutResponse} LogoutResponse instance
         */
        LogoutResponse.create = function create(properties) {
            return new LogoutResponse(properties);
        };

        /**
         * Encodes the specified LogoutResponse message. Does not implicitly {@link hbonline.LogoutResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.LogoutResponse
         * @static
         * @param {hbonline.ILogoutResponse} message LogoutResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogoutResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.secondsRemaining != null && Object.hasOwnProperty.call(message, "secondsRemaining"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.secondsRemaining);
            if (message.cancelled != null && Object.hasOwnProperty.call(message, "cancelled"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.cancelled);
            if (message.reason != null && Object.hasOwnProperty.call(message, "reason"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.reason);
            return writer;
        };

        /**
         * Decodes a LogoutResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.LogoutResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.LogoutResponse} LogoutResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogoutResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.LogoutResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.secondsRemaining = reader.int32();
                        break;
                    }
                case 2: {
                        message.cancelled = reader.bool();
                        break;
                    }
                case 3: {
                        message.reason = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LogoutResponse
         * @function getTypeUrl
         * @memberof hbonline.LogoutResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LogoutResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.LogoutResponse";
        };

        return LogoutResponse;
    })();

    hbonline.DismissIntroRequest = (function() {

        /**
         * Properties of a DismissIntroRequest.
         * @memberof hbonline
         * @interface IDismissIntroRequest
         */

        /**
         * Constructs a new DismissIntroRequest.
         * @memberof hbonline
         * @classdesc Represents a DismissIntroRequest.
         * @implements IDismissIntroRequest
         * @constructor
         * @param {hbonline.IDismissIntroRequest=} [properties] Properties to set
         */
        function DismissIntroRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new DismissIntroRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.DismissIntroRequest
         * @static
         * @param {hbonline.IDismissIntroRequest=} [properties] Properties to set
         * @returns {hbonline.DismissIntroRequest} DismissIntroRequest instance
         */
        DismissIntroRequest.create = function create(properties) {
            return new DismissIntroRequest(properties);
        };

        /**
         * Encodes the specified DismissIntroRequest message. Does not implicitly {@link hbonline.DismissIntroRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.DismissIntroRequest
         * @static
         * @param {hbonline.IDismissIntroRequest} message DismissIntroRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DismissIntroRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Decodes a DismissIntroRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.DismissIntroRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.DismissIntroRequest} DismissIntroRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DismissIntroRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.DismissIntroRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for DismissIntroRequest
         * @function getTypeUrl
         * @memberof hbonline.DismissIntroRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DismissIntroRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.DismissIntroRequest";
        };

        return DismissIntroRequest;
    })();

    hbonline.EntityInfo = (function() {

        /**
         * Properties of an EntityInfo.
         * @memberof hbonline
         * @interface IEntityInfo
         * @property {number|null} [objectId] EntityInfo objectId
         * @property {number|null} [entityType] EntityInfo entityType
         * @property {string|null} [name] EntityInfo name
         * @property {hbonline.IVec2|null} [position] EntityInfo position
         * @property {number|null} [direction] EntityInfo direction
         * @property {number|null} [action] EntityInfo action
         * @property {number|null} [status] EntityInfo status
         * @property {hbonline.IAppearance|null} [appearance] EntityInfo appearance
         * @property {number|null} [npcType] EntityInfo npcType
         * @property {number|null} [level] EntityInfo level
         * @property {number|null} [side] EntityInfo side
         */

        /**
         * Constructs a new EntityInfo.
         * @memberof hbonline
         * @classdesc Represents an EntityInfo.
         * @implements IEntityInfo
         * @constructor
         * @param {hbonline.IEntityInfo=} [properties] Properties to set
         */
        function EntityInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EntityInfo objectId.
         * @member {number} objectId
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.objectId = 0;

        /**
         * EntityInfo entityType.
         * @member {number} entityType
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.entityType = 0;

        /**
         * EntityInfo name.
         * @member {string} name
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.name = "";

        /**
         * EntityInfo position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.position = null;

        /**
         * EntityInfo direction.
         * @member {number} direction
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.direction = 0;

        /**
         * EntityInfo action.
         * @member {number} action
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.action = 0;

        /**
         * EntityInfo status.
         * @member {number} status
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.status = 0;

        /**
         * EntityInfo appearance.
         * @member {hbonline.IAppearance|null|undefined} appearance
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.appearance = null;

        /**
         * EntityInfo npcType.
         * @member {number} npcType
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.npcType = 0;

        /**
         * EntityInfo level.
         * @member {number} level
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.level = 0;

        /**
         * EntityInfo side.
         * @member {number} side
         * @memberof hbonline.EntityInfo
         * @instance
         */
        EntityInfo.prototype.side = 0;

        /**
         * Creates a new EntityInfo instance using the specified properties.
         * @function create
         * @memberof hbonline.EntityInfo
         * @static
         * @param {hbonline.IEntityInfo=} [properties] Properties to set
         * @returns {hbonline.EntityInfo} EntityInfo instance
         */
        EntityInfo.create = function create(properties) {
            return new EntityInfo(properties);
        };

        /**
         * Encodes the specified EntityInfo message. Does not implicitly {@link hbonline.EntityInfo.verify|verify} messages.
         * @function encode
         * @memberof hbonline.EntityInfo
         * @static
         * @param {hbonline.IEntityInfo} message EntityInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EntityInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.entityType != null && Object.hasOwnProperty.call(message, "entityType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.entityType);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.direction);
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.action);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.status);
            if (message.appearance != null && Object.hasOwnProperty.call(message, "appearance"))
                $root.hbonline.Appearance.encode(message.appearance, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.npcType != null && Object.hasOwnProperty.call(message, "npcType"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.npcType);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.level);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.side);
            return writer;
        };

        /**
         * Decodes an EntityInfo message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.EntityInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.EntityInfo} EntityInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EntityInfo.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.EntityInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.entityType = reader.int32();
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.direction = reader.int32();
                        break;
                    }
                case 6: {
                        message.action = reader.int32();
                        break;
                    }
                case 7: {
                        message.status = reader.int32();
                        break;
                    }
                case 8: {
                        message.appearance = $root.hbonline.Appearance.decode(reader, reader.uint32());
                        break;
                    }
                case 9: {
                        message.npcType = reader.int32();
                        break;
                    }
                case 10: {
                        message.level = reader.int32();
                        break;
                    }
                case 11: {
                        message.side = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for EntityInfo
         * @function getTypeUrl
         * @memberof hbonline.EntityInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EntityInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.EntityInfo";
        };

        return EntityInfo;
    })();

    hbonline.ItemInstance = (function() {

        /**
         * Properties of an ItemInstance.
         * @memberof hbonline
         * @interface IItemInstance
         * @property {number|null} [itemId] ItemInstance itemId
         * @property {string|null} [name] ItemInstance name
         * @property {number|null} [count] ItemInstance count
         * @property {number|null} [durability] ItemInstance durability
         * @property {number|null} [maxDurability] ItemInstance maxDurability
         * @property {number|null} [slotIndex] ItemInstance slotIndex
         */

        /**
         * Constructs a new ItemInstance.
         * @memberof hbonline
         * @classdesc Represents an ItemInstance.
         * @implements IItemInstance
         * @constructor
         * @param {hbonline.IItemInstance=} [properties] Properties to set
         */
        function ItemInstance(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemInstance itemId.
         * @member {number} itemId
         * @memberof hbonline.ItemInstance
         * @instance
         */
        ItemInstance.prototype.itemId = 0;

        /**
         * ItemInstance name.
         * @member {string} name
         * @memberof hbonline.ItemInstance
         * @instance
         */
        ItemInstance.prototype.name = "";

        /**
         * ItemInstance count.
         * @member {number} count
         * @memberof hbonline.ItemInstance
         * @instance
         */
        ItemInstance.prototype.count = 0;

        /**
         * ItemInstance durability.
         * @member {number} durability
         * @memberof hbonline.ItemInstance
         * @instance
         */
        ItemInstance.prototype.durability = 0;

        /**
         * ItemInstance maxDurability.
         * @member {number} maxDurability
         * @memberof hbonline.ItemInstance
         * @instance
         */
        ItemInstance.prototype.maxDurability = 0;

        /**
         * ItemInstance slotIndex.
         * @member {number} slotIndex
         * @memberof hbonline.ItemInstance
         * @instance
         */
        ItemInstance.prototype.slotIndex = 0;

        /**
         * Creates a new ItemInstance instance using the specified properties.
         * @function create
         * @memberof hbonline.ItemInstance
         * @static
         * @param {hbonline.IItemInstance=} [properties] Properties to set
         * @returns {hbonline.ItemInstance} ItemInstance instance
         */
        ItemInstance.create = function create(properties) {
            return new ItemInstance(properties);
        };

        /**
         * Encodes the specified ItemInstance message. Does not implicitly {@link hbonline.ItemInstance.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ItemInstance
         * @static
         * @param {hbonline.IItemInstance} message ItemInstance message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemInstance.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.itemId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            if (message.durability != null && Object.hasOwnProperty.call(message, "durability"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.durability);
            if (message.maxDurability != null && Object.hasOwnProperty.call(message, "maxDurability"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.maxDurability);
            if (message.slotIndex != null && Object.hasOwnProperty.call(message, "slotIndex"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.slotIndex);
            return writer;
        };

        /**
         * Decodes an ItemInstance message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ItemInstance
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ItemInstance} ItemInstance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemInstance.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ItemInstance();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.count = reader.int32();
                        break;
                    }
                case 4: {
                        message.durability = reader.int32();
                        break;
                    }
                case 5: {
                        message.maxDurability = reader.int32();
                        break;
                    }
                case 6: {
                        message.slotIndex = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ItemInstance
         * @function getTypeUrl
         * @memberof hbonline.ItemInstance
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemInstance.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ItemInstance";
        };

        return ItemInstance;
    })();

    hbonline.InventoryUpdate = (function() {

        /**
         * Properties of an InventoryUpdate.
         * @memberof hbonline
         * @interface IInventoryUpdate
         * @property {Array.<hbonline.IItemInstance>|null} [items] InventoryUpdate items
         * @property {Array.<hbonline.IItemInstance>|null} [equipment] InventoryUpdate equipment
         * @property {number|Long|null} [gold] InventoryUpdate gold
         */

        /**
         * Constructs a new InventoryUpdate.
         * @memberof hbonline
         * @classdesc Represents an InventoryUpdate.
         * @implements IInventoryUpdate
         * @constructor
         * @param {hbonline.IInventoryUpdate=} [properties] Properties to set
         */
        function InventoryUpdate(properties) {
            this.items = [];
            this.equipment = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InventoryUpdate items.
         * @member {Array.<hbonline.IItemInstance>} items
         * @memberof hbonline.InventoryUpdate
         * @instance
         */
        InventoryUpdate.prototype.items = $util.emptyArray;

        /**
         * InventoryUpdate equipment.
         * @member {Array.<hbonline.IItemInstance>} equipment
         * @memberof hbonline.InventoryUpdate
         * @instance
         */
        InventoryUpdate.prototype.equipment = $util.emptyArray;

        /**
         * InventoryUpdate gold.
         * @member {number|Long} gold
         * @memberof hbonline.InventoryUpdate
         * @instance
         */
        InventoryUpdate.prototype.gold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new InventoryUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.InventoryUpdate
         * @static
         * @param {hbonline.IInventoryUpdate=} [properties] Properties to set
         * @returns {hbonline.InventoryUpdate} InventoryUpdate instance
         */
        InventoryUpdate.create = function create(properties) {
            return new InventoryUpdate(properties);
        };

        /**
         * Encodes the specified InventoryUpdate message. Does not implicitly {@link hbonline.InventoryUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.InventoryUpdate
         * @static
         * @param {hbonline.IInventoryUpdate} message InventoryUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InventoryUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.items != null && message.items.length)
                for (let i = 0; i < message.items.length; ++i)
                    $root.hbonline.ItemInstance.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.equipment != null && message.equipment.length)
                for (let i = 0; i < message.equipment.length; ++i)
                    $root.hbonline.ItemInstance.encode(message.equipment[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.gold != null && Object.hasOwnProperty.call(message, "gold"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.gold);
            return writer;
        };

        /**
         * Decodes an InventoryUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.InventoryUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.InventoryUpdate} InventoryUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InventoryUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.InventoryUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.items && message.items.length))
                            message.items = [];
                        message.items.push($root.hbonline.ItemInstance.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.equipment && message.equipment.length))
                            message.equipment = [];
                        message.equipment.push($root.hbonline.ItemInstance.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.gold = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for InventoryUpdate
         * @function getTypeUrl
         * @memberof hbonline.InventoryUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        InventoryUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.InventoryUpdate";
        };

        return InventoryUpdate;
    })();

    hbonline.GroundItemAppear = (function() {

        /**
         * Properties of a GroundItemAppear.
         * @memberof hbonline
         * @interface IGroundItemAppear
         * @property {number|null} [groundId] GroundItemAppear groundId
         * @property {number|null} [itemId] GroundItemAppear itemId
         * @property {string|null} [name] GroundItemAppear name
         * @property {number|null} [count] GroundItemAppear count
         * @property {hbonline.IVec2|null} [position] GroundItemAppear position
         */

        /**
         * Constructs a new GroundItemAppear.
         * @memberof hbonline
         * @classdesc Represents a GroundItemAppear.
         * @implements IGroundItemAppear
         * @constructor
         * @param {hbonline.IGroundItemAppear=} [properties] Properties to set
         */
        function GroundItemAppear(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GroundItemAppear groundId.
         * @member {number} groundId
         * @memberof hbonline.GroundItemAppear
         * @instance
         */
        GroundItemAppear.prototype.groundId = 0;

        /**
         * GroundItemAppear itemId.
         * @member {number} itemId
         * @memberof hbonline.GroundItemAppear
         * @instance
         */
        GroundItemAppear.prototype.itemId = 0;

        /**
         * GroundItemAppear name.
         * @member {string} name
         * @memberof hbonline.GroundItemAppear
         * @instance
         */
        GroundItemAppear.prototype.name = "";

        /**
         * GroundItemAppear count.
         * @member {number} count
         * @memberof hbonline.GroundItemAppear
         * @instance
         */
        GroundItemAppear.prototype.count = 0;

        /**
         * GroundItemAppear position.
         * @member {hbonline.IVec2|null|undefined} position
         * @memberof hbonline.GroundItemAppear
         * @instance
         */
        GroundItemAppear.prototype.position = null;

        /**
         * Creates a new GroundItemAppear instance using the specified properties.
         * @function create
         * @memberof hbonline.GroundItemAppear
         * @static
         * @param {hbonline.IGroundItemAppear=} [properties] Properties to set
         * @returns {hbonline.GroundItemAppear} GroundItemAppear instance
         */
        GroundItemAppear.create = function create(properties) {
            return new GroundItemAppear(properties);
        };

        /**
         * Encodes the specified GroundItemAppear message. Does not implicitly {@link hbonline.GroundItemAppear.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GroundItemAppear
         * @static
         * @param {hbonline.IGroundItemAppear} message GroundItemAppear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GroundItemAppear.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.groundId != null && Object.hasOwnProperty.call(message, "groundId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.groundId);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.itemId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.count);
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.hbonline.Vec2.encode(message.position, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a GroundItemAppear message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GroundItemAppear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GroundItemAppear} GroundItemAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GroundItemAppear.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GroundItemAppear();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.groundId = reader.int32();
                        break;
                    }
                case 2: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.count = reader.int32();
                        break;
                    }
                case 5: {
                        message.position = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GroundItemAppear
         * @function getTypeUrl
         * @memberof hbonline.GroundItemAppear
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GroundItemAppear.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GroundItemAppear";
        };

        return GroundItemAppear;
    })();

    hbonline.GroundItemDisappear = (function() {

        /**
         * Properties of a GroundItemDisappear.
         * @memberof hbonline
         * @interface IGroundItemDisappear
         * @property {number|null} [groundId] GroundItemDisappear groundId
         */

        /**
         * Constructs a new GroundItemDisappear.
         * @memberof hbonline
         * @classdesc Represents a GroundItemDisappear.
         * @implements IGroundItemDisappear
         * @constructor
         * @param {hbonline.IGroundItemDisappear=} [properties] Properties to set
         */
        function GroundItemDisappear(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GroundItemDisappear groundId.
         * @member {number} groundId
         * @memberof hbonline.GroundItemDisappear
         * @instance
         */
        GroundItemDisappear.prototype.groundId = 0;

        /**
         * Creates a new GroundItemDisappear instance using the specified properties.
         * @function create
         * @memberof hbonline.GroundItemDisappear
         * @static
         * @param {hbonline.IGroundItemDisappear=} [properties] Properties to set
         * @returns {hbonline.GroundItemDisappear} GroundItemDisappear instance
         */
        GroundItemDisappear.create = function create(properties) {
            return new GroundItemDisappear(properties);
        };

        /**
         * Encodes the specified GroundItemDisappear message. Does not implicitly {@link hbonline.GroundItemDisappear.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GroundItemDisappear
         * @static
         * @param {hbonline.IGroundItemDisappear} message GroundItemDisappear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GroundItemDisappear.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.groundId != null && Object.hasOwnProperty.call(message, "groundId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.groundId);
            return writer;
        };

        /**
         * Decodes a GroundItemDisappear message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GroundItemDisappear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GroundItemDisappear} GroundItemDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GroundItemDisappear.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GroundItemDisappear();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.groundId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GroundItemDisappear
         * @function getTypeUrl
         * @memberof hbonline.GroundItemDisappear
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GroundItemDisappear.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GroundItemDisappear";
        };

        return GroundItemDisappear;
    })();

    hbonline.ItemPickupRequest = (function() {

        /**
         * Properties of an ItemPickupRequest.
         * @memberof hbonline
         * @interface IItemPickupRequest
         * @property {number|null} [groundId] ItemPickupRequest groundId
         */

        /**
         * Constructs a new ItemPickupRequest.
         * @memberof hbonline
         * @classdesc Represents an ItemPickupRequest.
         * @implements IItemPickupRequest
         * @constructor
         * @param {hbonline.IItemPickupRequest=} [properties] Properties to set
         */
        function ItemPickupRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemPickupRequest groundId.
         * @member {number} groundId
         * @memberof hbonline.ItemPickupRequest
         * @instance
         */
        ItemPickupRequest.prototype.groundId = 0;

        /**
         * Creates a new ItemPickupRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ItemPickupRequest
         * @static
         * @param {hbonline.IItemPickupRequest=} [properties] Properties to set
         * @returns {hbonline.ItemPickupRequest} ItemPickupRequest instance
         */
        ItemPickupRequest.create = function create(properties) {
            return new ItemPickupRequest(properties);
        };

        /**
         * Encodes the specified ItemPickupRequest message. Does not implicitly {@link hbonline.ItemPickupRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ItemPickupRequest
         * @static
         * @param {hbonline.IItemPickupRequest} message ItemPickupRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemPickupRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.groundId != null && Object.hasOwnProperty.call(message, "groundId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.groundId);
            return writer;
        };

        /**
         * Decodes an ItemPickupRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ItemPickupRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ItemPickupRequest} ItemPickupRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemPickupRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ItemPickupRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.groundId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ItemPickupRequest
         * @function getTypeUrl
         * @memberof hbonline.ItemPickupRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemPickupRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ItemPickupRequest";
        };

        return ItemPickupRequest;
    })();

    hbonline.ItemUseRequest = (function() {

        /**
         * Properties of an ItemUseRequest.
         * @memberof hbonline
         * @interface IItemUseRequest
         * @property {number|null} [slotIndex] ItemUseRequest slotIndex
         */

        /**
         * Constructs a new ItemUseRequest.
         * @memberof hbonline
         * @classdesc Represents an ItemUseRequest.
         * @implements IItemUseRequest
         * @constructor
         * @param {hbonline.IItemUseRequest=} [properties] Properties to set
         */
        function ItemUseRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemUseRequest slotIndex.
         * @member {number} slotIndex
         * @memberof hbonline.ItemUseRequest
         * @instance
         */
        ItemUseRequest.prototype.slotIndex = 0;

        /**
         * Creates a new ItemUseRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ItemUseRequest
         * @static
         * @param {hbonline.IItemUseRequest=} [properties] Properties to set
         * @returns {hbonline.ItemUseRequest} ItemUseRequest instance
         */
        ItemUseRequest.create = function create(properties) {
            return new ItemUseRequest(properties);
        };

        /**
         * Encodes the specified ItemUseRequest message. Does not implicitly {@link hbonline.ItemUseRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ItemUseRequest
         * @static
         * @param {hbonline.IItemUseRequest} message ItemUseRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemUseRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.slotIndex != null && Object.hasOwnProperty.call(message, "slotIndex"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.slotIndex);
            return writer;
        };

        /**
         * Decodes an ItemUseRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ItemUseRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ItemUseRequest} ItemUseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemUseRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ItemUseRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.slotIndex = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ItemUseRequest
         * @function getTypeUrl
         * @memberof hbonline.ItemUseRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemUseRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ItemUseRequest";
        };

        return ItemUseRequest;
    })();

    hbonline.ItemEquipRequest = (function() {

        /**
         * Properties of an ItemEquipRequest.
         * @memberof hbonline
         * @interface IItemEquipRequest
         * @property {number|null} [slotIndex] ItemEquipRequest slotIndex
         * @property {number|null} [equipSlot] ItemEquipRequest equipSlot
         */

        /**
         * Constructs a new ItemEquipRequest.
         * @memberof hbonline
         * @classdesc Represents an ItemEquipRequest.
         * @implements IItemEquipRequest
         * @constructor
         * @param {hbonline.IItemEquipRequest=} [properties] Properties to set
         */
        function ItemEquipRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemEquipRequest slotIndex.
         * @member {number} slotIndex
         * @memberof hbonline.ItemEquipRequest
         * @instance
         */
        ItemEquipRequest.prototype.slotIndex = 0;

        /**
         * ItemEquipRequest equipSlot.
         * @member {number} equipSlot
         * @memberof hbonline.ItemEquipRequest
         * @instance
         */
        ItemEquipRequest.prototype.equipSlot = 0;

        /**
         * Creates a new ItemEquipRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ItemEquipRequest
         * @static
         * @param {hbonline.IItemEquipRequest=} [properties] Properties to set
         * @returns {hbonline.ItemEquipRequest} ItemEquipRequest instance
         */
        ItemEquipRequest.create = function create(properties) {
            return new ItemEquipRequest(properties);
        };

        /**
         * Encodes the specified ItemEquipRequest message. Does not implicitly {@link hbonline.ItemEquipRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ItemEquipRequest
         * @static
         * @param {hbonline.IItemEquipRequest} message ItemEquipRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemEquipRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.slotIndex != null && Object.hasOwnProperty.call(message, "slotIndex"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.slotIndex);
            if (message.equipSlot != null && Object.hasOwnProperty.call(message, "equipSlot"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.equipSlot);
            return writer;
        };

        /**
         * Decodes an ItemEquipRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ItemEquipRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ItemEquipRequest} ItemEquipRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemEquipRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ItemEquipRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.slotIndex = reader.int32();
                        break;
                    }
                case 2: {
                        message.equipSlot = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ItemEquipRequest
         * @function getTypeUrl
         * @memberof hbonline.ItemEquipRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemEquipRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ItemEquipRequest";
        };

        return ItemEquipRequest;
    })();

    hbonline.ItemDropRequest = (function() {

        /**
         * Properties of an ItemDropRequest.
         * @memberof hbonline
         * @interface IItemDropRequest
         * @property {number|null} [slotIndex] ItemDropRequest slotIndex
         * @property {number|null} [count] ItemDropRequest count
         */

        /**
         * Constructs a new ItemDropRequest.
         * @memberof hbonline
         * @classdesc Represents an ItemDropRequest.
         * @implements IItemDropRequest
         * @constructor
         * @param {hbonline.IItemDropRequest=} [properties] Properties to set
         */
        function ItemDropRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ItemDropRequest slotIndex.
         * @member {number} slotIndex
         * @memberof hbonline.ItemDropRequest
         * @instance
         */
        ItemDropRequest.prototype.slotIndex = 0;

        /**
         * ItemDropRequest count.
         * @member {number} count
         * @memberof hbonline.ItemDropRequest
         * @instance
         */
        ItemDropRequest.prototype.count = 0;

        /**
         * Creates a new ItemDropRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ItemDropRequest
         * @static
         * @param {hbonline.IItemDropRequest=} [properties] Properties to set
         * @returns {hbonline.ItemDropRequest} ItemDropRequest instance
         */
        ItemDropRequest.create = function create(properties) {
            return new ItemDropRequest(properties);
        };

        /**
         * Encodes the specified ItemDropRequest message. Does not implicitly {@link hbonline.ItemDropRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ItemDropRequest
         * @static
         * @param {hbonline.IItemDropRequest} message ItemDropRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ItemDropRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.slotIndex != null && Object.hasOwnProperty.call(message, "slotIndex"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.slotIndex);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.count);
            return writer;
        };

        /**
         * Decodes an ItemDropRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ItemDropRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ItemDropRequest} ItemDropRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ItemDropRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ItemDropRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.slotIndex = reader.int32();
                        break;
                    }
                case 2: {
                        message.count = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ItemDropRequest
         * @function getTypeUrl
         * @memberof hbonline.ItemDropRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ItemDropRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ItemDropRequest";
        };

        return ItemDropRequest;
    })();

    hbonline.StatAllocRequest = (function() {

        /**
         * Properties of a StatAllocRequest.
         * @memberof hbonline
         * @interface IStatAllocRequest
         * @property {number|null} [statType] StatAllocRequest statType
         * @property {number|null} [points] StatAllocRequest points
         */

        /**
         * Constructs a new StatAllocRequest.
         * @memberof hbonline
         * @classdesc Represents a StatAllocRequest.
         * @implements IStatAllocRequest
         * @constructor
         * @param {hbonline.IStatAllocRequest=} [properties] Properties to set
         */
        function StatAllocRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StatAllocRequest statType.
         * @member {number} statType
         * @memberof hbonline.StatAllocRequest
         * @instance
         */
        StatAllocRequest.prototype.statType = 0;

        /**
         * StatAllocRequest points.
         * @member {number} points
         * @memberof hbonline.StatAllocRequest
         * @instance
         */
        StatAllocRequest.prototype.points = 0;

        /**
         * Creates a new StatAllocRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.StatAllocRequest
         * @static
         * @param {hbonline.IStatAllocRequest=} [properties] Properties to set
         * @returns {hbonline.StatAllocRequest} StatAllocRequest instance
         */
        StatAllocRequest.create = function create(properties) {
            return new StatAllocRequest(properties);
        };

        /**
         * Encodes the specified StatAllocRequest message. Does not implicitly {@link hbonline.StatAllocRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.StatAllocRequest
         * @static
         * @param {hbonline.IStatAllocRequest} message StatAllocRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatAllocRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.statType != null && Object.hasOwnProperty.call(message, "statType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.statType);
            if (message.points != null && Object.hasOwnProperty.call(message, "points"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.points);
            return writer;
        };

        /**
         * Decodes a StatAllocRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.StatAllocRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.StatAllocRequest} StatAllocRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatAllocRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.StatAllocRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.statType = reader.int32();
                        break;
                    }
                case 2: {
                        message.points = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for StatAllocRequest
         * @function getTypeUrl
         * @memberof hbonline.StatAllocRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StatAllocRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.StatAllocRequest";
        };

        return StatAllocRequest;
    })();

    hbonline.ShopOpen = (function() {

        /**
         * Properties of a ShopOpen.
         * @memberof hbonline
         * @interface IShopOpen
         * @property {number|null} [npcId] ShopOpen npcId
         * @property {string|null} [shopName] ShopOpen shopName
         * @property {Array.<hbonline.IShopItem>|null} [items] ShopOpen items
         */

        /**
         * Constructs a new ShopOpen.
         * @memberof hbonline
         * @classdesc Represents a ShopOpen.
         * @implements IShopOpen
         * @constructor
         * @param {hbonline.IShopOpen=} [properties] Properties to set
         */
        function ShopOpen(properties) {
            this.items = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShopOpen npcId.
         * @member {number} npcId
         * @memberof hbonline.ShopOpen
         * @instance
         */
        ShopOpen.prototype.npcId = 0;

        /**
         * ShopOpen shopName.
         * @member {string} shopName
         * @memberof hbonline.ShopOpen
         * @instance
         */
        ShopOpen.prototype.shopName = "";

        /**
         * ShopOpen items.
         * @member {Array.<hbonline.IShopItem>} items
         * @memberof hbonline.ShopOpen
         * @instance
         */
        ShopOpen.prototype.items = $util.emptyArray;

        /**
         * Creates a new ShopOpen instance using the specified properties.
         * @function create
         * @memberof hbonline.ShopOpen
         * @static
         * @param {hbonline.IShopOpen=} [properties] Properties to set
         * @returns {hbonline.ShopOpen} ShopOpen instance
         */
        ShopOpen.create = function create(properties) {
            return new ShopOpen(properties);
        };

        /**
         * Encodes the specified ShopOpen message. Does not implicitly {@link hbonline.ShopOpen.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ShopOpen
         * @static
         * @param {hbonline.IShopOpen} message ShopOpen message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShopOpen.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.npcId != null && Object.hasOwnProperty.call(message, "npcId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.npcId);
            if (message.shopName != null && Object.hasOwnProperty.call(message, "shopName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.shopName);
            if (message.items != null && message.items.length)
                for (let i = 0; i < message.items.length; ++i)
                    $root.hbonline.ShopItem.encode(message.items[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a ShopOpen message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ShopOpen
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ShopOpen} ShopOpen
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShopOpen.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ShopOpen();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.npcId = reader.int32();
                        break;
                    }
                case 2: {
                        message.shopName = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.items && message.items.length))
                            message.items = [];
                        message.items.push($root.hbonline.ShopItem.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ShopOpen
         * @function getTypeUrl
         * @memberof hbonline.ShopOpen
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ShopOpen.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ShopOpen";
        };

        return ShopOpen;
    })();

    hbonline.ShopItem = (function() {

        /**
         * Properties of a ShopItem.
         * @memberof hbonline
         * @interface IShopItem
         * @property {number|null} [itemId] ShopItem itemId
         * @property {string|null} [name] ShopItem name
         * @property {number|Long|null} [price] ShopItem price
         * @property {number|null} [itemType] ShopItem itemType
         */

        /**
         * Constructs a new ShopItem.
         * @memberof hbonline
         * @classdesc Represents a ShopItem.
         * @implements IShopItem
         * @constructor
         * @param {hbonline.IShopItem=} [properties] Properties to set
         */
        function ShopItem(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShopItem itemId.
         * @member {number} itemId
         * @memberof hbonline.ShopItem
         * @instance
         */
        ShopItem.prototype.itemId = 0;

        /**
         * ShopItem name.
         * @member {string} name
         * @memberof hbonline.ShopItem
         * @instance
         */
        ShopItem.prototype.name = "";

        /**
         * ShopItem price.
         * @member {number|Long} price
         * @memberof hbonline.ShopItem
         * @instance
         */
        ShopItem.prototype.price = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * ShopItem itemType.
         * @member {number} itemType
         * @memberof hbonline.ShopItem
         * @instance
         */
        ShopItem.prototype.itemType = 0;

        /**
         * Creates a new ShopItem instance using the specified properties.
         * @function create
         * @memberof hbonline.ShopItem
         * @static
         * @param {hbonline.IShopItem=} [properties] Properties to set
         * @returns {hbonline.ShopItem} ShopItem instance
         */
        ShopItem.create = function create(properties) {
            return new ShopItem(properties);
        };

        /**
         * Encodes the specified ShopItem message. Does not implicitly {@link hbonline.ShopItem.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ShopItem
         * @static
         * @param {hbonline.IShopItem} message ShopItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShopItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.itemId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.price != null && Object.hasOwnProperty.call(message, "price"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.price);
            if (message.itemType != null && Object.hasOwnProperty.call(message, "itemType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.itemType);
            return writer;
        };

        /**
         * Decodes a ShopItem message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ShopItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ShopItem} ShopItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShopItem.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ShopItem();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.price = reader.int64();
                        break;
                    }
                case 4: {
                        message.itemType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ShopItem
         * @function getTypeUrl
         * @memberof hbonline.ShopItem
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ShopItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ShopItem";
        };

        return ShopItem;
    })();

    hbonline.ShopBuyRequest = (function() {

        /**
         * Properties of a ShopBuyRequest.
         * @memberof hbonline
         * @interface IShopBuyRequest
         * @property {number|null} [npcId] ShopBuyRequest npcId
         * @property {number|null} [itemId] ShopBuyRequest itemId
         * @property {number|null} [count] ShopBuyRequest count
         */

        /**
         * Constructs a new ShopBuyRequest.
         * @memberof hbonline
         * @classdesc Represents a ShopBuyRequest.
         * @implements IShopBuyRequest
         * @constructor
         * @param {hbonline.IShopBuyRequest=} [properties] Properties to set
         */
        function ShopBuyRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShopBuyRequest npcId.
         * @member {number} npcId
         * @memberof hbonline.ShopBuyRequest
         * @instance
         */
        ShopBuyRequest.prototype.npcId = 0;

        /**
         * ShopBuyRequest itemId.
         * @member {number} itemId
         * @memberof hbonline.ShopBuyRequest
         * @instance
         */
        ShopBuyRequest.prototype.itemId = 0;

        /**
         * ShopBuyRequest count.
         * @member {number} count
         * @memberof hbonline.ShopBuyRequest
         * @instance
         */
        ShopBuyRequest.prototype.count = 0;

        /**
         * Creates a new ShopBuyRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ShopBuyRequest
         * @static
         * @param {hbonline.IShopBuyRequest=} [properties] Properties to set
         * @returns {hbonline.ShopBuyRequest} ShopBuyRequest instance
         */
        ShopBuyRequest.create = function create(properties) {
            return new ShopBuyRequest(properties);
        };

        /**
         * Encodes the specified ShopBuyRequest message. Does not implicitly {@link hbonline.ShopBuyRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ShopBuyRequest
         * @static
         * @param {hbonline.IShopBuyRequest} message ShopBuyRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShopBuyRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.npcId != null && Object.hasOwnProperty.call(message, "npcId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.npcId);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.itemId);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            return writer;
        };

        /**
         * Decodes a ShopBuyRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ShopBuyRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ShopBuyRequest} ShopBuyRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShopBuyRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ShopBuyRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.npcId = reader.int32();
                        break;
                    }
                case 2: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 3: {
                        message.count = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ShopBuyRequest
         * @function getTypeUrl
         * @memberof hbonline.ShopBuyRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ShopBuyRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ShopBuyRequest";
        };

        return ShopBuyRequest;
    })();

    hbonline.ShopSellRequest = (function() {

        /**
         * Properties of a ShopSellRequest.
         * @memberof hbonline
         * @interface IShopSellRequest
         * @property {number|null} [npcId] ShopSellRequest npcId
         * @property {number|null} [slotIndex] ShopSellRequest slotIndex
         * @property {number|null} [count] ShopSellRequest count
         */

        /**
         * Constructs a new ShopSellRequest.
         * @memberof hbonline
         * @classdesc Represents a ShopSellRequest.
         * @implements IShopSellRequest
         * @constructor
         * @param {hbonline.IShopSellRequest=} [properties] Properties to set
         */
        function ShopSellRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShopSellRequest npcId.
         * @member {number} npcId
         * @memberof hbonline.ShopSellRequest
         * @instance
         */
        ShopSellRequest.prototype.npcId = 0;

        /**
         * ShopSellRequest slotIndex.
         * @member {number} slotIndex
         * @memberof hbonline.ShopSellRequest
         * @instance
         */
        ShopSellRequest.prototype.slotIndex = 0;

        /**
         * ShopSellRequest count.
         * @member {number} count
         * @memberof hbonline.ShopSellRequest
         * @instance
         */
        ShopSellRequest.prototype.count = 0;

        /**
         * Creates a new ShopSellRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.ShopSellRequest
         * @static
         * @param {hbonline.IShopSellRequest=} [properties] Properties to set
         * @returns {hbonline.ShopSellRequest} ShopSellRequest instance
         */
        ShopSellRequest.create = function create(properties) {
            return new ShopSellRequest(properties);
        };

        /**
         * Encodes the specified ShopSellRequest message. Does not implicitly {@link hbonline.ShopSellRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ShopSellRequest
         * @static
         * @param {hbonline.IShopSellRequest} message ShopSellRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShopSellRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.npcId != null && Object.hasOwnProperty.call(message, "npcId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.npcId);
            if (message.slotIndex != null && Object.hasOwnProperty.call(message, "slotIndex"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.slotIndex);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            return writer;
        };

        /**
         * Decodes a ShopSellRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ShopSellRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ShopSellRequest} ShopSellRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShopSellRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ShopSellRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.npcId = reader.int32();
                        break;
                    }
                case 2: {
                        message.slotIndex = reader.int32();
                        break;
                    }
                case 3: {
                        message.count = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ShopSellRequest
         * @function getTypeUrl
         * @memberof hbonline.ShopSellRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ShopSellRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ShopSellRequest";
        };

        return ShopSellRequest;
    })();

    hbonline.ShopResponse = (function() {

        /**
         * Properties of a ShopResponse.
         * @memberof hbonline
         * @interface IShopResponse
         * @property {boolean|null} [success] ShopResponse success
         * @property {string|null} [error] ShopResponse error
         */

        /**
         * Constructs a new ShopResponse.
         * @memberof hbonline
         * @classdesc Represents a ShopResponse.
         * @implements IShopResponse
         * @constructor
         * @param {hbonline.IShopResponse=} [properties] Properties to set
         */
        function ShopResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ShopResponse success.
         * @member {boolean} success
         * @memberof hbonline.ShopResponse
         * @instance
         */
        ShopResponse.prototype.success = false;

        /**
         * ShopResponse error.
         * @member {string} error
         * @memberof hbonline.ShopResponse
         * @instance
         */
        ShopResponse.prototype.error = "";

        /**
         * Creates a new ShopResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.ShopResponse
         * @static
         * @param {hbonline.IShopResponse=} [properties] Properties to set
         * @returns {hbonline.ShopResponse} ShopResponse instance
         */
        ShopResponse.create = function create(properties) {
            return new ShopResponse(properties);
        };

        /**
         * Encodes the specified ShopResponse message. Does not implicitly {@link hbonline.ShopResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.ShopResponse
         * @static
         * @param {hbonline.IShopResponse} message ShopResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ShopResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            return writer;
        };

        /**
         * Decodes a ShopResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.ShopResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.ShopResponse} ShopResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ShopResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.ShopResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.error = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for ShopResponse
         * @function getTypeUrl
         * @memberof hbonline.ShopResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ShopResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.ShopResponse";
        };

        return ShopResponse;
    })();

    hbonline.SpellCastRequest = (function() {

        /**
         * Properties of a SpellCastRequest.
         * @memberof hbonline
         * @interface ISpellCastRequest
         * @property {number|null} [spellId] SpellCastRequest spellId
         * @property {number|null} [targetId] SpellCastRequest targetId
         * @property {hbonline.IVec2|null} [targetPosition] SpellCastRequest targetPosition
         */

        /**
         * Constructs a new SpellCastRequest.
         * @memberof hbonline
         * @classdesc Represents a SpellCastRequest.
         * @implements ISpellCastRequest
         * @constructor
         * @param {hbonline.ISpellCastRequest=} [properties] Properties to set
         */
        function SpellCastRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SpellCastRequest spellId.
         * @member {number} spellId
         * @memberof hbonline.SpellCastRequest
         * @instance
         */
        SpellCastRequest.prototype.spellId = 0;

        /**
         * SpellCastRequest targetId.
         * @member {number} targetId
         * @memberof hbonline.SpellCastRequest
         * @instance
         */
        SpellCastRequest.prototype.targetId = 0;

        /**
         * SpellCastRequest targetPosition.
         * @member {hbonline.IVec2|null|undefined} targetPosition
         * @memberof hbonline.SpellCastRequest
         * @instance
         */
        SpellCastRequest.prototype.targetPosition = null;

        /**
         * Creates a new SpellCastRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.SpellCastRequest
         * @static
         * @param {hbonline.ISpellCastRequest=} [properties] Properties to set
         * @returns {hbonline.SpellCastRequest} SpellCastRequest instance
         */
        SpellCastRequest.create = function create(properties) {
            return new SpellCastRequest(properties);
        };

        /**
         * Encodes the specified SpellCastRequest message. Does not implicitly {@link hbonline.SpellCastRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SpellCastRequest
         * @static
         * @param {hbonline.ISpellCastRequest} message SpellCastRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpellCastRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.spellId);
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.targetId);
            if (message.targetPosition != null && Object.hasOwnProperty.call(message, "targetPosition"))
                $root.hbonline.Vec2.encode(message.targetPosition, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a SpellCastRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SpellCastRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SpellCastRequest} SpellCastRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpellCastRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SpellCastRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.spellId = reader.int32();
                        break;
                    }
                case 2: {
                        message.targetId = reader.int32();
                        break;
                    }
                case 3: {
                        message.targetPosition = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SpellCastRequest
         * @function getTypeUrl
         * @memberof hbonline.SpellCastRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SpellCastRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SpellCastRequest";
        };

        return SpellCastRequest;
    })();

    hbonline.SpellEffectEvent = (function() {

        /**
         * Properties of a SpellEffectEvent.
         * @memberof hbonline
         * @interface ISpellEffectEvent
         * @property {number|null} [casterId] SpellEffectEvent casterId
         * @property {number|null} [spellId] SpellEffectEvent spellId
         * @property {number|null} [targetId] SpellEffectEvent targetId
         * @property {hbonline.IVec2|null} [casterPosition] SpellEffectEvent casterPosition
         * @property {hbonline.IVec2|null} [targetPosition] SpellEffectEvent targetPosition
         * @property {number|null} [damage] SpellEffectEvent damage
         * @property {number|null} [healAmount] SpellEffectEvent healAmount
         * @property {boolean|null} [miss] SpellEffectEvent miss
         * @property {number|null} [spriteId] SpellEffectEvent spriteId
         * @property {number|null} [soundId] SpellEffectEvent soundId
         */

        /**
         * Constructs a new SpellEffectEvent.
         * @memberof hbonline
         * @classdesc Represents a SpellEffectEvent.
         * @implements ISpellEffectEvent
         * @constructor
         * @param {hbonline.ISpellEffectEvent=} [properties] Properties to set
         */
        function SpellEffectEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SpellEffectEvent casterId.
         * @member {number} casterId
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.casterId = 0;

        /**
         * SpellEffectEvent spellId.
         * @member {number} spellId
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.spellId = 0;

        /**
         * SpellEffectEvent targetId.
         * @member {number} targetId
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.targetId = 0;

        /**
         * SpellEffectEvent casterPosition.
         * @member {hbonline.IVec2|null|undefined} casterPosition
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.casterPosition = null;

        /**
         * SpellEffectEvent targetPosition.
         * @member {hbonline.IVec2|null|undefined} targetPosition
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.targetPosition = null;

        /**
         * SpellEffectEvent damage.
         * @member {number} damage
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.damage = 0;

        /**
         * SpellEffectEvent healAmount.
         * @member {number} healAmount
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.healAmount = 0;

        /**
         * SpellEffectEvent miss.
         * @member {boolean} miss
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.miss = false;

        /**
         * SpellEffectEvent spriteId.
         * @member {number} spriteId
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.spriteId = 0;

        /**
         * SpellEffectEvent soundId.
         * @member {number} soundId
         * @memberof hbonline.SpellEffectEvent
         * @instance
         */
        SpellEffectEvent.prototype.soundId = 0;

        /**
         * Creates a new SpellEffectEvent instance using the specified properties.
         * @function create
         * @memberof hbonline.SpellEffectEvent
         * @static
         * @param {hbonline.ISpellEffectEvent=} [properties] Properties to set
         * @returns {hbonline.SpellEffectEvent} SpellEffectEvent instance
         */
        SpellEffectEvent.create = function create(properties) {
            return new SpellEffectEvent(properties);
        };

        /**
         * Encodes the specified SpellEffectEvent message. Does not implicitly {@link hbonline.SpellEffectEvent.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SpellEffectEvent
         * @static
         * @param {hbonline.ISpellEffectEvent} message SpellEffectEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpellEffectEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.casterId != null && Object.hasOwnProperty.call(message, "casterId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.casterId);
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.spellId);
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.targetId);
            if (message.casterPosition != null && Object.hasOwnProperty.call(message, "casterPosition"))
                $root.hbonline.Vec2.encode(message.casterPosition, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.targetPosition != null && Object.hasOwnProperty.call(message, "targetPosition"))
                $root.hbonline.Vec2.encode(message.targetPosition, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.damage != null && Object.hasOwnProperty.call(message, "damage"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.damage);
            if (message.healAmount != null && Object.hasOwnProperty.call(message, "healAmount"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.healAmount);
            if (message.miss != null && Object.hasOwnProperty.call(message, "miss"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.miss);
            if (message.spriteId != null && Object.hasOwnProperty.call(message, "spriteId"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.spriteId);
            if (message.soundId != null && Object.hasOwnProperty.call(message, "soundId"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.soundId);
            return writer;
        };

        /**
         * Decodes a SpellEffectEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SpellEffectEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SpellEffectEvent} SpellEffectEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpellEffectEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SpellEffectEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.casterId = reader.int32();
                        break;
                    }
                case 2: {
                        message.spellId = reader.int32();
                        break;
                    }
                case 3: {
                        message.targetId = reader.int32();
                        break;
                    }
                case 4: {
                        message.casterPosition = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.targetPosition = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.damage = reader.int32();
                        break;
                    }
                case 7: {
                        message.healAmount = reader.int32();
                        break;
                    }
                case 8: {
                        message.miss = reader.bool();
                        break;
                    }
                case 9: {
                        message.spriteId = reader.int32();
                        break;
                    }
                case 10: {
                        message.soundId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SpellEffectEvent
         * @function getTypeUrl
         * @memberof hbonline.SpellEffectEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SpellEffectEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SpellEffectEvent";
        };

        return SpellEffectEvent;
    })();

    hbonline.BuffUpdate = (function() {

        /**
         * Properties of a BuffUpdate.
         * @memberof hbonline
         * @interface IBuffUpdate
         * @property {number|null} [objectId] BuffUpdate objectId
         * @property {number|null} [spellId] BuffUpdate spellId
         * @property {string|null} [name] BuffUpdate name
         * @property {number|null} [statType] BuffUpdate statType
         * @property {number|null} [amount] BuffUpdate amount
         * @property {number|null} [remainingSeconds] BuffUpdate remainingSeconds
         * @property {boolean|null} [removed] BuffUpdate removed
         */

        /**
         * Constructs a new BuffUpdate.
         * @memberof hbonline
         * @classdesc Represents a BuffUpdate.
         * @implements IBuffUpdate
         * @constructor
         * @param {hbonline.IBuffUpdate=} [properties] Properties to set
         */
        function BuffUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BuffUpdate objectId.
         * @member {number} objectId
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.objectId = 0;

        /**
         * BuffUpdate spellId.
         * @member {number} spellId
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.spellId = 0;

        /**
         * BuffUpdate name.
         * @member {string} name
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.name = "";

        /**
         * BuffUpdate statType.
         * @member {number} statType
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.statType = 0;

        /**
         * BuffUpdate amount.
         * @member {number} amount
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.amount = 0;

        /**
         * BuffUpdate remainingSeconds.
         * @member {number} remainingSeconds
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.remainingSeconds = 0;

        /**
         * BuffUpdate removed.
         * @member {boolean} removed
         * @memberof hbonline.BuffUpdate
         * @instance
         */
        BuffUpdate.prototype.removed = false;

        /**
         * Creates a new BuffUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.BuffUpdate
         * @static
         * @param {hbonline.IBuffUpdate=} [properties] Properties to set
         * @returns {hbonline.BuffUpdate} BuffUpdate instance
         */
        BuffUpdate.create = function create(properties) {
            return new BuffUpdate(properties);
        };

        /**
         * Encodes the specified BuffUpdate message. Does not implicitly {@link hbonline.BuffUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.BuffUpdate
         * @static
         * @param {hbonline.IBuffUpdate} message BuffUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BuffUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.spellId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.statType != null && Object.hasOwnProperty.call(message, "statType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.statType);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.amount);
            if (message.remainingSeconds != null && Object.hasOwnProperty.call(message, "remainingSeconds"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.remainingSeconds);
            if (message.removed != null && Object.hasOwnProperty.call(message, "removed"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.removed);
            return writer;
        };

        /**
         * Decodes a BuffUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.BuffUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.BuffUpdate} BuffUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BuffUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.BuffUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.spellId = reader.int32();
                        break;
                    }
                case 3: {
                        message.name = reader.string();
                        break;
                    }
                case 4: {
                        message.statType = reader.int32();
                        break;
                    }
                case 5: {
                        message.amount = reader.int32();
                        break;
                    }
                case 6: {
                        message.remainingSeconds = reader.int32();
                        break;
                    }
                case 7: {
                        message.removed = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for BuffUpdate
         * @function getTypeUrl
         * @memberof hbonline.BuffUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BuffUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.BuffUpdate";
        };

        return BuffUpdate;
    })();

    hbonline.SpellListUpdate = (function() {

        /**
         * Properties of a SpellListUpdate.
         * @memberof hbonline
         * @interface ISpellListUpdate
         * @property {Array.<hbonline.ILearnedSpell>|null} [spells] SpellListUpdate spells
         */

        /**
         * Constructs a new SpellListUpdate.
         * @memberof hbonline
         * @classdesc Represents a SpellListUpdate.
         * @implements ISpellListUpdate
         * @constructor
         * @param {hbonline.ISpellListUpdate=} [properties] Properties to set
         */
        function SpellListUpdate(properties) {
            this.spells = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SpellListUpdate spells.
         * @member {Array.<hbonline.ILearnedSpell>} spells
         * @memberof hbonline.SpellListUpdate
         * @instance
         */
        SpellListUpdate.prototype.spells = $util.emptyArray;

        /**
         * Creates a new SpellListUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.SpellListUpdate
         * @static
         * @param {hbonline.ISpellListUpdate=} [properties] Properties to set
         * @returns {hbonline.SpellListUpdate} SpellListUpdate instance
         */
        SpellListUpdate.create = function create(properties) {
            return new SpellListUpdate(properties);
        };

        /**
         * Encodes the specified SpellListUpdate message. Does not implicitly {@link hbonline.SpellListUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SpellListUpdate
         * @static
         * @param {hbonline.ISpellListUpdate} message SpellListUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpellListUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.spells != null && message.spells.length)
                for (let i = 0; i < message.spells.length; ++i)
                    $root.hbonline.LearnedSpell.encode(message.spells[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a SpellListUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SpellListUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SpellListUpdate} SpellListUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpellListUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SpellListUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.spells && message.spells.length))
                            message.spells = [];
                        message.spells.push($root.hbonline.LearnedSpell.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SpellListUpdate
         * @function getTypeUrl
         * @memberof hbonline.SpellListUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SpellListUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SpellListUpdate";
        };

        return SpellListUpdate;
    })();

    hbonline.LearnedSpell = (function() {

        /**
         * Properties of a LearnedSpell.
         * @memberof hbonline
         * @interface ILearnedSpell
         * @property {number|null} [spellId] LearnedSpell spellId
         * @property {string|null} [name] LearnedSpell name
         * @property {number|null} [manaCost] LearnedSpell manaCost
         * @property {number|null} [cooldownMs] LearnedSpell cooldownMs
         * @property {number|null} [spellType] LearnedSpell spellType
         * @property {number|null} [spriteId] LearnedSpell spriteId
         */

        /**
         * Constructs a new LearnedSpell.
         * @memberof hbonline
         * @classdesc Represents a LearnedSpell.
         * @implements ILearnedSpell
         * @constructor
         * @param {hbonline.ILearnedSpell=} [properties] Properties to set
         */
        function LearnedSpell(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LearnedSpell spellId.
         * @member {number} spellId
         * @memberof hbonline.LearnedSpell
         * @instance
         */
        LearnedSpell.prototype.spellId = 0;

        /**
         * LearnedSpell name.
         * @member {string} name
         * @memberof hbonline.LearnedSpell
         * @instance
         */
        LearnedSpell.prototype.name = "";

        /**
         * LearnedSpell manaCost.
         * @member {number} manaCost
         * @memberof hbonline.LearnedSpell
         * @instance
         */
        LearnedSpell.prototype.manaCost = 0;

        /**
         * LearnedSpell cooldownMs.
         * @member {number} cooldownMs
         * @memberof hbonline.LearnedSpell
         * @instance
         */
        LearnedSpell.prototype.cooldownMs = 0;

        /**
         * LearnedSpell spellType.
         * @member {number} spellType
         * @memberof hbonline.LearnedSpell
         * @instance
         */
        LearnedSpell.prototype.spellType = 0;

        /**
         * LearnedSpell spriteId.
         * @member {number} spriteId
         * @memberof hbonline.LearnedSpell
         * @instance
         */
        LearnedSpell.prototype.spriteId = 0;

        /**
         * Creates a new LearnedSpell instance using the specified properties.
         * @function create
         * @memberof hbonline.LearnedSpell
         * @static
         * @param {hbonline.ILearnedSpell=} [properties] Properties to set
         * @returns {hbonline.LearnedSpell} LearnedSpell instance
         */
        LearnedSpell.create = function create(properties) {
            return new LearnedSpell(properties);
        };

        /**
         * Encodes the specified LearnedSpell message. Does not implicitly {@link hbonline.LearnedSpell.verify|verify} messages.
         * @function encode
         * @memberof hbonline.LearnedSpell
         * @static
         * @param {hbonline.ILearnedSpell} message LearnedSpell message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LearnedSpell.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.spellId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.manaCost != null && Object.hasOwnProperty.call(message, "manaCost"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.manaCost);
            if (message.cooldownMs != null && Object.hasOwnProperty.call(message, "cooldownMs"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.cooldownMs);
            if (message.spellType != null && Object.hasOwnProperty.call(message, "spellType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.spellType);
            if (message.spriteId != null && Object.hasOwnProperty.call(message, "spriteId"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.spriteId);
            return writer;
        };

        /**
         * Decodes a LearnedSpell message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.LearnedSpell
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.LearnedSpell} LearnedSpell
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LearnedSpell.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.LearnedSpell();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.spellId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.manaCost = reader.int32();
                        break;
                    }
                case 4: {
                        message.cooldownMs = reader.int32();
                        break;
                    }
                case 5: {
                        message.spellType = reader.int32();
                        break;
                    }
                case 6: {
                        message.spriteId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LearnedSpell
         * @function getTypeUrl
         * @memberof hbonline.LearnedSpell
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LearnedSpell.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.LearnedSpell";
        };

        return LearnedSpell;
    })();

    hbonline.SpellCatalog = (function() {

        /**
         * Properties of a SpellCatalog.
         * @memberof hbonline
         * @interface ISpellCatalog
         * @property {Array.<hbonline.ISpellCatalogEntry>|null} [spells] SpellCatalog spells
         */

        /**
         * Constructs a new SpellCatalog.
         * @memberof hbonline
         * @classdesc Represents a SpellCatalog.
         * @implements ISpellCatalog
         * @constructor
         * @param {hbonline.ISpellCatalog=} [properties] Properties to set
         */
        function SpellCatalog(properties) {
            this.spells = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SpellCatalog spells.
         * @member {Array.<hbonline.ISpellCatalogEntry>} spells
         * @memberof hbonline.SpellCatalog
         * @instance
         */
        SpellCatalog.prototype.spells = $util.emptyArray;

        /**
         * Creates a new SpellCatalog instance using the specified properties.
         * @function create
         * @memberof hbonline.SpellCatalog
         * @static
         * @param {hbonline.ISpellCatalog=} [properties] Properties to set
         * @returns {hbonline.SpellCatalog} SpellCatalog instance
         */
        SpellCatalog.create = function create(properties) {
            return new SpellCatalog(properties);
        };

        /**
         * Encodes the specified SpellCatalog message. Does not implicitly {@link hbonline.SpellCatalog.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SpellCatalog
         * @static
         * @param {hbonline.ISpellCatalog} message SpellCatalog message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpellCatalog.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.spells != null && message.spells.length)
                for (let i = 0; i < message.spells.length; ++i)
                    $root.hbonline.SpellCatalogEntry.encode(message.spells[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Decodes a SpellCatalog message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SpellCatalog
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SpellCatalog} SpellCatalog
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpellCatalog.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SpellCatalog();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.spells && message.spells.length))
                            message.spells = [];
                        message.spells.push($root.hbonline.SpellCatalogEntry.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SpellCatalog
         * @function getTypeUrl
         * @memberof hbonline.SpellCatalog
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SpellCatalog.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SpellCatalog";
        };

        return SpellCatalog;
    })();

    hbonline.SpellCatalogEntry = (function() {

        /**
         * Properties of a SpellCatalogEntry.
         * @memberof hbonline
         * @interface ISpellCatalogEntry
         * @property {number|null} [spellId] SpellCatalogEntry spellId
         * @property {string|null} [name] SpellCatalogEntry name
         * @property {number|null} [spellType] SpellCatalogEntry spellType
         * @property {number|null} [manaCost] SpellCatalogEntry manaCost
         * @property {number|null} [reqLevel] SpellCatalogEntry reqLevel
         * @property {number|null} [reqMag] SpellCatalogEntry reqMag
         * @property {number|null} [reqInt] SpellCatalogEntry reqInt
         * @property {boolean|null} [learned] SpellCatalogEntry learned
         */

        /**
         * Constructs a new SpellCatalogEntry.
         * @memberof hbonline
         * @classdesc Represents a SpellCatalogEntry.
         * @implements ISpellCatalogEntry
         * @constructor
         * @param {hbonline.ISpellCatalogEntry=} [properties] Properties to set
         */
        function SpellCatalogEntry(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SpellCatalogEntry spellId.
         * @member {number} spellId
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.spellId = 0;

        /**
         * SpellCatalogEntry name.
         * @member {string} name
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.name = "";

        /**
         * SpellCatalogEntry spellType.
         * @member {number} spellType
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.spellType = 0;

        /**
         * SpellCatalogEntry manaCost.
         * @member {number} manaCost
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.manaCost = 0;

        /**
         * SpellCatalogEntry reqLevel.
         * @member {number} reqLevel
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.reqLevel = 0;

        /**
         * SpellCatalogEntry reqMag.
         * @member {number} reqMag
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.reqMag = 0;

        /**
         * SpellCatalogEntry reqInt.
         * @member {number} reqInt
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.reqInt = 0;

        /**
         * SpellCatalogEntry learned.
         * @member {boolean} learned
         * @memberof hbonline.SpellCatalogEntry
         * @instance
         */
        SpellCatalogEntry.prototype.learned = false;

        /**
         * Creates a new SpellCatalogEntry instance using the specified properties.
         * @function create
         * @memberof hbonline.SpellCatalogEntry
         * @static
         * @param {hbonline.ISpellCatalogEntry=} [properties] Properties to set
         * @returns {hbonline.SpellCatalogEntry} SpellCatalogEntry instance
         */
        SpellCatalogEntry.create = function create(properties) {
            return new SpellCatalogEntry(properties);
        };

        /**
         * Encodes the specified SpellCatalogEntry message. Does not implicitly {@link hbonline.SpellCatalogEntry.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SpellCatalogEntry
         * @static
         * @param {hbonline.ISpellCatalogEntry} message SpellCatalogEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpellCatalogEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.spellId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.spellType != null && Object.hasOwnProperty.call(message, "spellType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.spellType);
            if (message.manaCost != null && Object.hasOwnProperty.call(message, "manaCost"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.manaCost);
            if (message.reqLevel != null && Object.hasOwnProperty.call(message, "reqLevel"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.reqLevel);
            if (message.reqMag != null && Object.hasOwnProperty.call(message, "reqMag"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.reqMag);
            if (message.reqInt != null && Object.hasOwnProperty.call(message, "reqInt"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.reqInt);
            if (message.learned != null && Object.hasOwnProperty.call(message, "learned"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.learned);
            return writer;
        };

        /**
         * Decodes a SpellCatalogEntry message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SpellCatalogEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SpellCatalogEntry} SpellCatalogEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpellCatalogEntry.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SpellCatalogEntry();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.spellId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.spellType = reader.int32();
                        break;
                    }
                case 4: {
                        message.manaCost = reader.int32();
                        break;
                    }
                case 5: {
                        message.reqLevel = reader.int32();
                        break;
                    }
                case 6: {
                        message.reqMag = reader.int32();
                        break;
                    }
                case 7: {
                        message.reqInt = reader.int32();
                        break;
                    }
                case 8: {
                        message.learned = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SpellCatalogEntry
         * @function getTypeUrl
         * @memberof hbonline.SpellCatalogEntry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SpellCatalogEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SpellCatalogEntry";
        };

        return SpellCatalogEntry;
    })();

    hbonline.LearnSpellRequest = (function() {

        /**
         * Properties of a LearnSpellRequest.
         * @memberof hbonline
         * @interface ILearnSpellRequest
         * @property {number|null} [spellId] LearnSpellRequest spellId
         */

        /**
         * Constructs a new LearnSpellRequest.
         * @memberof hbonline
         * @classdesc Represents a LearnSpellRequest.
         * @implements ILearnSpellRequest
         * @constructor
         * @param {hbonline.ILearnSpellRequest=} [properties] Properties to set
         */
        function LearnSpellRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LearnSpellRequest spellId.
         * @member {number} spellId
         * @memberof hbonline.LearnSpellRequest
         * @instance
         */
        LearnSpellRequest.prototype.spellId = 0;

        /**
         * Creates a new LearnSpellRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.LearnSpellRequest
         * @static
         * @param {hbonline.ILearnSpellRequest=} [properties] Properties to set
         * @returns {hbonline.LearnSpellRequest} LearnSpellRequest instance
         */
        LearnSpellRequest.create = function create(properties) {
            return new LearnSpellRequest(properties);
        };

        /**
         * Encodes the specified LearnSpellRequest message. Does not implicitly {@link hbonline.LearnSpellRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.LearnSpellRequest
         * @static
         * @param {hbonline.ILearnSpellRequest} message LearnSpellRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LearnSpellRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.spellId != null && Object.hasOwnProperty.call(message, "spellId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.spellId);
            return writer;
        };

        /**
         * Decodes a LearnSpellRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.LearnSpellRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.LearnSpellRequest} LearnSpellRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LearnSpellRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.LearnSpellRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.spellId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for LearnSpellRequest
         * @function getTypeUrl
         * @memberof hbonline.LearnSpellRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LearnSpellRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.LearnSpellRequest";
        };

        return LearnSpellRequest;
    })();

    hbonline.SkillListUpdate = (function() {

        /**
         * Properties of a SkillListUpdate.
         * @memberof hbonline
         * @interface ISkillListUpdate
         * @property {Array.<hbonline.ISkillEntry>|null} [skills] SkillListUpdate skills
         * @property {number|null} [totalMastery] SkillListUpdate totalMastery
         * @property {number|null} [masteryCap] SkillListUpdate masteryCap
         */

        /**
         * Constructs a new SkillListUpdate.
         * @memberof hbonline
         * @classdesc Represents a SkillListUpdate.
         * @implements ISkillListUpdate
         * @constructor
         * @param {hbonline.ISkillListUpdate=} [properties] Properties to set
         */
        function SkillListUpdate(properties) {
            this.skills = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SkillListUpdate skills.
         * @member {Array.<hbonline.ISkillEntry>} skills
         * @memberof hbonline.SkillListUpdate
         * @instance
         */
        SkillListUpdate.prototype.skills = $util.emptyArray;

        /**
         * SkillListUpdate totalMastery.
         * @member {number} totalMastery
         * @memberof hbonline.SkillListUpdate
         * @instance
         */
        SkillListUpdate.prototype.totalMastery = 0;

        /**
         * SkillListUpdate masteryCap.
         * @member {number} masteryCap
         * @memberof hbonline.SkillListUpdate
         * @instance
         */
        SkillListUpdate.prototype.masteryCap = 0;

        /**
         * Creates a new SkillListUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.SkillListUpdate
         * @static
         * @param {hbonline.ISkillListUpdate=} [properties] Properties to set
         * @returns {hbonline.SkillListUpdate} SkillListUpdate instance
         */
        SkillListUpdate.create = function create(properties) {
            return new SkillListUpdate(properties);
        };

        /**
         * Encodes the specified SkillListUpdate message. Does not implicitly {@link hbonline.SkillListUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SkillListUpdate
         * @static
         * @param {hbonline.ISkillListUpdate} message SkillListUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SkillListUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skills != null && message.skills.length)
                for (let i = 0; i < message.skills.length; ++i)
                    $root.hbonline.SkillEntry.encode(message.skills[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.totalMastery != null && Object.hasOwnProperty.call(message, "totalMastery"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.totalMastery);
            if (message.masteryCap != null && Object.hasOwnProperty.call(message, "masteryCap"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.masteryCap);
            return writer;
        };

        /**
         * Decodes a SkillListUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SkillListUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SkillListUpdate} SkillListUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SkillListUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SkillListUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.skills && message.skills.length))
                            message.skills = [];
                        message.skills.push($root.hbonline.SkillEntry.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.totalMastery = reader.int32();
                        break;
                    }
                case 3: {
                        message.masteryCap = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SkillListUpdate
         * @function getTypeUrl
         * @memberof hbonline.SkillListUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SkillListUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SkillListUpdate";
        };

        return SkillListUpdate;
    })();

    hbonline.SkillEntry = (function() {

        /**
         * Properties of a SkillEntry.
         * @memberof hbonline
         * @interface ISkillEntry
         * @property {number|null} [skillId] SkillEntry skillId
         * @property {string|null} [name] SkillEntry name
         * @property {number|null} [mastery] SkillEntry mastery
         */

        /**
         * Constructs a new SkillEntry.
         * @memberof hbonline
         * @classdesc Represents a SkillEntry.
         * @implements ISkillEntry
         * @constructor
         * @param {hbonline.ISkillEntry=} [properties] Properties to set
         */
        function SkillEntry(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SkillEntry skillId.
         * @member {number} skillId
         * @memberof hbonline.SkillEntry
         * @instance
         */
        SkillEntry.prototype.skillId = 0;

        /**
         * SkillEntry name.
         * @member {string} name
         * @memberof hbonline.SkillEntry
         * @instance
         */
        SkillEntry.prototype.name = "";

        /**
         * SkillEntry mastery.
         * @member {number} mastery
         * @memberof hbonline.SkillEntry
         * @instance
         */
        SkillEntry.prototype.mastery = 0;

        /**
         * Creates a new SkillEntry instance using the specified properties.
         * @function create
         * @memberof hbonline.SkillEntry
         * @static
         * @param {hbonline.ISkillEntry=} [properties] Properties to set
         * @returns {hbonline.SkillEntry} SkillEntry instance
         */
        SkillEntry.create = function create(properties) {
            return new SkillEntry(properties);
        };

        /**
         * Encodes the specified SkillEntry message. Does not implicitly {@link hbonline.SkillEntry.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SkillEntry
         * @static
         * @param {hbonline.ISkillEntry} message SkillEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SkillEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skillId != null && Object.hasOwnProperty.call(message, "skillId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.skillId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.mastery != null && Object.hasOwnProperty.call(message, "mastery"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.mastery);
            return writer;
        };

        /**
         * Decodes a SkillEntry message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SkillEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SkillEntry} SkillEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SkillEntry.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SkillEntry();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.skillId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.mastery = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SkillEntry
         * @function getTypeUrl
         * @memberof hbonline.SkillEntry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SkillEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SkillEntry";
        };

        return SkillEntry;
    })();

    hbonline.SkillUseRequest = (function() {

        /**
         * Properties of a SkillUseRequest.
         * @memberof hbonline
         * @interface ISkillUseRequest
         * @property {number|null} [skillId] SkillUseRequest skillId
         * @property {hbonline.IVec2|null} [targetPosition] SkillUseRequest targetPosition
         * @property {number|null} [targetId] SkillUseRequest targetId
         */

        /**
         * Constructs a new SkillUseRequest.
         * @memberof hbonline
         * @classdesc Represents a SkillUseRequest.
         * @implements ISkillUseRequest
         * @constructor
         * @param {hbonline.ISkillUseRequest=} [properties] Properties to set
         */
        function SkillUseRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SkillUseRequest skillId.
         * @member {number} skillId
         * @memberof hbonline.SkillUseRequest
         * @instance
         */
        SkillUseRequest.prototype.skillId = 0;

        /**
         * SkillUseRequest targetPosition.
         * @member {hbonline.IVec2|null|undefined} targetPosition
         * @memberof hbonline.SkillUseRequest
         * @instance
         */
        SkillUseRequest.prototype.targetPosition = null;

        /**
         * SkillUseRequest targetId.
         * @member {number} targetId
         * @memberof hbonline.SkillUseRequest
         * @instance
         */
        SkillUseRequest.prototype.targetId = 0;

        /**
         * Creates a new SkillUseRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.SkillUseRequest
         * @static
         * @param {hbonline.ISkillUseRequest=} [properties] Properties to set
         * @returns {hbonline.SkillUseRequest} SkillUseRequest instance
         */
        SkillUseRequest.create = function create(properties) {
            return new SkillUseRequest(properties);
        };

        /**
         * Encodes the specified SkillUseRequest message. Does not implicitly {@link hbonline.SkillUseRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SkillUseRequest
         * @static
         * @param {hbonline.ISkillUseRequest} message SkillUseRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SkillUseRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skillId != null && Object.hasOwnProperty.call(message, "skillId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.skillId);
            if (message.targetPosition != null && Object.hasOwnProperty.call(message, "targetPosition"))
                $root.hbonline.Vec2.encode(message.targetPosition, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.targetId);
            return writer;
        };

        /**
         * Decodes a SkillUseRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SkillUseRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SkillUseRequest} SkillUseRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SkillUseRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SkillUseRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.skillId = reader.int32();
                        break;
                    }
                case 2: {
                        message.targetPosition = $root.hbonline.Vec2.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.targetId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SkillUseRequest
         * @function getTypeUrl
         * @memberof hbonline.SkillUseRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SkillUseRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SkillUseRequest";
        };

        return SkillUseRequest;
    })();

    hbonline.SkillResultEvent = (function() {

        /**
         * Properties of a SkillResultEvent.
         * @memberof hbonline
         * @interface ISkillResultEvent
         * @property {number|null} [skillId] SkillResultEvent skillId
         * @property {boolean|null} [success] SkillResultEvent success
         * @property {string|null} [message] SkillResultEvent message
         * @property {number|null} [newMastery] SkillResultEvent newMastery
         * @property {number|null} [itemGainedId] SkillResultEvent itemGainedId
         */

        /**
         * Constructs a new SkillResultEvent.
         * @memberof hbonline
         * @classdesc Represents a SkillResultEvent.
         * @implements ISkillResultEvent
         * @constructor
         * @param {hbonline.ISkillResultEvent=} [properties] Properties to set
         */
        function SkillResultEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SkillResultEvent skillId.
         * @member {number} skillId
         * @memberof hbonline.SkillResultEvent
         * @instance
         */
        SkillResultEvent.prototype.skillId = 0;

        /**
         * SkillResultEvent success.
         * @member {boolean} success
         * @memberof hbonline.SkillResultEvent
         * @instance
         */
        SkillResultEvent.prototype.success = false;

        /**
         * SkillResultEvent message.
         * @member {string} message
         * @memberof hbonline.SkillResultEvent
         * @instance
         */
        SkillResultEvent.prototype.message = "";

        /**
         * SkillResultEvent newMastery.
         * @member {number} newMastery
         * @memberof hbonline.SkillResultEvent
         * @instance
         */
        SkillResultEvent.prototype.newMastery = 0;

        /**
         * SkillResultEvent itemGainedId.
         * @member {number} itemGainedId
         * @memberof hbonline.SkillResultEvent
         * @instance
         */
        SkillResultEvent.prototype.itemGainedId = 0;

        /**
         * Creates a new SkillResultEvent instance using the specified properties.
         * @function create
         * @memberof hbonline.SkillResultEvent
         * @static
         * @param {hbonline.ISkillResultEvent=} [properties] Properties to set
         * @returns {hbonline.SkillResultEvent} SkillResultEvent instance
         */
        SkillResultEvent.create = function create(properties) {
            return new SkillResultEvent(properties);
        };

        /**
         * Encodes the specified SkillResultEvent message. Does not implicitly {@link hbonline.SkillResultEvent.verify|verify} messages.
         * @function encode
         * @memberof hbonline.SkillResultEvent
         * @static
         * @param {hbonline.ISkillResultEvent} message SkillResultEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SkillResultEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.skillId != null && Object.hasOwnProperty.call(message, "skillId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.skillId);
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
            if (message.newMastery != null && Object.hasOwnProperty.call(message, "newMastery"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.newMastery);
            if (message.itemGainedId != null && Object.hasOwnProperty.call(message, "itemGainedId"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.itemGainedId);
            return writer;
        };

        /**
         * Decodes a SkillResultEvent message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.SkillResultEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.SkillResultEvent} SkillResultEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SkillResultEvent.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.SkillResultEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.skillId = reader.int32();
                        break;
                    }
                case 2: {
                        message.success = reader.bool();
                        break;
                    }
                case 3: {
                        message.message = reader.string();
                        break;
                    }
                case 4: {
                        message.newMastery = reader.int32();
                        break;
                    }
                case 5: {
                        message.itemGainedId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for SkillResultEvent
         * @function getTypeUrl
         * @memberof hbonline.SkillResultEvent
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SkillResultEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.SkillResultEvent";
        };

        return SkillResultEvent;
    })();

    hbonline.CraftRequest = (function() {

        /**
         * Properties of a CraftRequest.
         * @memberof hbonline
         * @interface ICraftRequest
         * @property {number|null} [recipeId] CraftRequest recipeId
         */

        /**
         * Constructs a new CraftRequest.
         * @memberof hbonline
         * @classdesc Represents a CraftRequest.
         * @implements ICraftRequest
         * @constructor
         * @param {hbonline.ICraftRequest=} [properties] Properties to set
         */
        function CraftRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CraftRequest recipeId.
         * @member {number} recipeId
         * @memberof hbonline.CraftRequest
         * @instance
         */
        CraftRequest.prototype.recipeId = 0;

        /**
         * Creates a new CraftRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.CraftRequest
         * @static
         * @param {hbonline.ICraftRequest=} [properties] Properties to set
         * @returns {hbonline.CraftRequest} CraftRequest instance
         */
        CraftRequest.create = function create(properties) {
            return new CraftRequest(properties);
        };

        /**
         * Encodes the specified CraftRequest message. Does not implicitly {@link hbonline.CraftRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.CraftRequest
         * @static
         * @param {hbonline.ICraftRequest} message CraftRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CraftRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.recipeId != null && Object.hasOwnProperty.call(message, "recipeId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.recipeId);
            return writer;
        };

        /**
         * Decodes a CraftRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.CraftRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.CraftRequest} CraftRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CraftRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.CraftRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.recipeId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for CraftRequest
         * @function getTypeUrl
         * @memberof hbonline.CraftRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CraftRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.CraftRequest";
        };

        return CraftRequest;
    })();

    hbonline.CraftResult = (function() {

        /**
         * Properties of a CraftResult.
         * @memberof hbonline
         * @interface ICraftResult
         * @property {boolean|null} [success] CraftResult success
         * @property {string|null} [message] CraftResult message
         * @property {number|null} [itemId] CraftResult itemId
         * @property {number|null} [count] CraftResult count
         */

        /**
         * Constructs a new CraftResult.
         * @memberof hbonline
         * @classdesc Represents a CraftResult.
         * @implements ICraftResult
         * @constructor
         * @param {hbonline.ICraftResult=} [properties] Properties to set
         */
        function CraftResult(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CraftResult success.
         * @member {boolean} success
         * @memberof hbonline.CraftResult
         * @instance
         */
        CraftResult.prototype.success = false;

        /**
         * CraftResult message.
         * @member {string} message
         * @memberof hbonline.CraftResult
         * @instance
         */
        CraftResult.prototype.message = "";

        /**
         * CraftResult itemId.
         * @member {number} itemId
         * @memberof hbonline.CraftResult
         * @instance
         */
        CraftResult.prototype.itemId = 0;

        /**
         * CraftResult count.
         * @member {number} count
         * @memberof hbonline.CraftResult
         * @instance
         */
        CraftResult.prototype.count = 0;

        /**
         * Creates a new CraftResult instance using the specified properties.
         * @function create
         * @memberof hbonline.CraftResult
         * @static
         * @param {hbonline.ICraftResult=} [properties] Properties to set
         * @returns {hbonline.CraftResult} CraftResult instance
         */
        CraftResult.create = function create(properties) {
            return new CraftResult(properties);
        };

        /**
         * Encodes the specified CraftResult message. Does not implicitly {@link hbonline.CraftResult.verify|verify} messages.
         * @function encode
         * @memberof hbonline.CraftResult
         * @static
         * @param {hbonline.ICraftResult} message CraftResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CraftResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.itemId);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.count);
            return writer;
        };

        /**
         * Decodes a CraftResult message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.CraftResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.CraftResult} CraftResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CraftResult.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.CraftResult();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                case 3: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 4: {
                        message.count = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for CraftResult
         * @function getTypeUrl
         * @memberof hbonline.CraftResult
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CraftResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.CraftResult";
        };

        return CraftResult;
    })();

    hbonline.QuestAcceptRequest = (function() {

        /**
         * Properties of a QuestAcceptRequest.
         * @memberof hbonline
         * @interface IQuestAcceptRequest
         * @property {number|null} [questId] QuestAcceptRequest questId
         */

        /**
         * Constructs a new QuestAcceptRequest.
         * @memberof hbonline
         * @classdesc Represents a QuestAcceptRequest.
         * @implements IQuestAcceptRequest
         * @constructor
         * @param {hbonline.IQuestAcceptRequest=} [properties] Properties to set
         */
        function QuestAcceptRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuestAcceptRequest questId.
         * @member {number} questId
         * @memberof hbonline.QuestAcceptRequest
         * @instance
         */
        QuestAcceptRequest.prototype.questId = 0;

        /**
         * Creates a new QuestAcceptRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.QuestAcceptRequest
         * @static
         * @param {hbonline.IQuestAcceptRequest=} [properties] Properties to set
         * @returns {hbonline.QuestAcceptRequest} QuestAcceptRequest instance
         */
        QuestAcceptRequest.create = function create(properties) {
            return new QuestAcceptRequest(properties);
        };

        /**
         * Encodes the specified QuestAcceptRequest message. Does not implicitly {@link hbonline.QuestAcceptRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.QuestAcceptRequest
         * @static
         * @param {hbonline.IQuestAcceptRequest} message QuestAcceptRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuestAcceptRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.questId != null && Object.hasOwnProperty.call(message, "questId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.questId);
            return writer;
        };

        /**
         * Decodes a QuestAcceptRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.QuestAcceptRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.QuestAcceptRequest} QuestAcceptRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuestAcceptRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.QuestAcceptRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.questId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for QuestAcceptRequest
         * @function getTypeUrl
         * @memberof hbonline.QuestAcceptRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QuestAcceptRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.QuestAcceptRequest";
        };

        return QuestAcceptRequest;
    })();

    hbonline.QuestTurnInRequest = (function() {

        /**
         * Properties of a QuestTurnInRequest.
         * @memberof hbonline
         * @interface IQuestTurnInRequest
         * @property {number|null} [questId] QuestTurnInRequest questId
         */

        /**
         * Constructs a new QuestTurnInRequest.
         * @memberof hbonline
         * @classdesc Represents a QuestTurnInRequest.
         * @implements IQuestTurnInRequest
         * @constructor
         * @param {hbonline.IQuestTurnInRequest=} [properties] Properties to set
         */
        function QuestTurnInRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuestTurnInRequest questId.
         * @member {number} questId
         * @memberof hbonline.QuestTurnInRequest
         * @instance
         */
        QuestTurnInRequest.prototype.questId = 0;

        /**
         * Creates a new QuestTurnInRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.QuestTurnInRequest
         * @static
         * @param {hbonline.IQuestTurnInRequest=} [properties] Properties to set
         * @returns {hbonline.QuestTurnInRequest} QuestTurnInRequest instance
         */
        QuestTurnInRequest.create = function create(properties) {
            return new QuestTurnInRequest(properties);
        };

        /**
         * Encodes the specified QuestTurnInRequest message. Does not implicitly {@link hbonline.QuestTurnInRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.QuestTurnInRequest
         * @static
         * @param {hbonline.IQuestTurnInRequest} message QuestTurnInRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuestTurnInRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.questId != null && Object.hasOwnProperty.call(message, "questId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.questId);
            return writer;
        };

        /**
         * Decodes a QuestTurnInRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.QuestTurnInRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.QuestTurnInRequest} QuestTurnInRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuestTurnInRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.QuestTurnInRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.questId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for QuestTurnInRequest
         * @function getTypeUrl
         * @memberof hbonline.QuestTurnInRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QuestTurnInRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.QuestTurnInRequest";
        };

        return QuestTurnInRequest;
    })();

    hbonline.QuestListUpdate = (function() {

        /**
         * Properties of a QuestListUpdate.
         * @memberof hbonline
         * @interface IQuestListUpdate
         * @property {Array.<hbonline.IQuestEntry>|null} [activeQuests] QuestListUpdate activeQuests
         * @property {Array.<number>|null} [availableQuestIds] QuestListUpdate availableQuestIds
         */

        /**
         * Constructs a new QuestListUpdate.
         * @memberof hbonline
         * @classdesc Represents a QuestListUpdate.
         * @implements IQuestListUpdate
         * @constructor
         * @param {hbonline.IQuestListUpdate=} [properties] Properties to set
         */
        function QuestListUpdate(properties) {
            this.activeQuests = [];
            this.availableQuestIds = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuestListUpdate activeQuests.
         * @member {Array.<hbonline.IQuestEntry>} activeQuests
         * @memberof hbonline.QuestListUpdate
         * @instance
         */
        QuestListUpdate.prototype.activeQuests = $util.emptyArray;

        /**
         * QuestListUpdate availableQuestIds.
         * @member {Array.<number>} availableQuestIds
         * @memberof hbonline.QuestListUpdate
         * @instance
         */
        QuestListUpdate.prototype.availableQuestIds = $util.emptyArray;

        /**
         * Creates a new QuestListUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.QuestListUpdate
         * @static
         * @param {hbonline.IQuestListUpdate=} [properties] Properties to set
         * @returns {hbonline.QuestListUpdate} QuestListUpdate instance
         */
        QuestListUpdate.create = function create(properties) {
            return new QuestListUpdate(properties);
        };

        /**
         * Encodes the specified QuestListUpdate message. Does not implicitly {@link hbonline.QuestListUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.QuestListUpdate
         * @static
         * @param {hbonline.IQuestListUpdate} message QuestListUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuestListUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.activeQuests != null && message.activeQuests.length)
                for (let i = 0; i < message.activeQuests.length; ++i)
                    $root.hbonline.QuestEntry.encode(message.activeQuests[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.availableQuestIds != null && message.availableQuestIds.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (let i = 0; i < message.availableQuestIds.length; ++i)
                    writer.int32(message.availableQuestIds[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Decodes a QuestListUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.QuestListUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.QuestListUpdate} QuestListUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuestListUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.QuestListUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.activeQuests && message.activeQuests.length))
                            message.activeQuests = [];
                        message.activeQuests.push($root.hbonline.QuestEntry.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.availableQuestIds && message.availableQuestIds.length))
                            message.availableQuestIds = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.availableQuestIds.push(reader.int32());
                        } else
                            message.availableQuestIds.push(reader.int32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for QuestListUpdate
         * @function getTypeUrl
         * @memberof hbonline.QuestListUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QuestListUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.QuestListUpdate";
        };

        return QuestListUpdate;
    })();

    hbonline.QuestEntry = (function() {

        /**
         * Properties of a QuestEntry.
         * @memberof hbonline
         * @interface IQuestEntry
         * @property {number|null} [questId] QuestEntry questId
         * @property {string|null} [name] QuestEntry name
         * @property {string|null} [description] QuestEntry description
         * @property {number|null} [questType] QuestEntry questType
         * @property {number|null} [state] QuestEntry state
         * @property {number|null} [progress] QuestEntry progress
         * @property {number|null} [targetCount] QuestEntry targetCount
         * @property {number|null} [rewardXp] QuestEntry rewardXp
         * @property {number|Long|null} [rewardGold] QuestEntry rewardGold
         */

        /**
         * Constructs a new QuestEntry.
         * @memberof hbonline
         * @classdesc Represents a QuestEntry.
         * @implements IQuestEntry
         * @constructor
         * @param {hbonline.IQuestEntry=} [properties] Properties to set
         */
        function QuestEntry(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuestEntry questId.
         * @member {number} questId
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.questId = 0;

        /**
         * QuestEntry name.
         * @member {string} name
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.name = "";

        /**
         * QuestEntry description.
         * @member {string} description
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.description = "";

        /**
         * QuestEntry questType.
         * @member {number} questType
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.questType = 0;

        /**
         * QuestEntry state.
         * @member {number} state
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.state = 0;

        /**
         * QuestEntry progress.
         * @member {number} progress
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.progress = 0;

        /**
         * QuestEntry targetCount.
         * @member {number} targetCount
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.targetCount = 0;

        /**
         * QuestEntry rewardXp.
         * @member {number} rewardXp
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.rewardXp = 0;

        /**
         * QuestEntry rewardGold.
         * @member {number|Long} rewardGold
         * @memberof hbonline.QuestEntry
         * @instance
         */
        QuestEntry.prototype.rewardGold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new QuestEntry instance using the specified properties.
         * @function create
         * @memberof hbonline.QuestEntry
         * @static
         * @param {hbonline.IQuestEntry=} [properties] Properties to set
         * @returns {hbonline.QuestEntry} QuestEntry instance
         */
        QuestEntry.create = function create(properties) {
            return new QuestEntry(properties);
        };

        /**
         * Encodes the specified QuestEntry message. Does not implicitly {@link hbonline.QuestEntry.verify|verify} messages.
         * @function encode
         * @memberof hbonline.QuestEntry
         * @static
         * @param {hbonline.IQuestEntry} message QuestEntry message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuestEntry.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.questId != null && Object.hasOwnProperty.call(message, "questId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.questId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
            if (message.questType != null && Object.hasOwnProperty.call(message, "questType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.questType);
            if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.state);
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.progress);
            if (message.targetCount != null && Object.hasOwnProperty.call(message, "targetCount"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.targetCount);
            if (message.rewardXp != null && Object.hasOwnProperty.call(message, "rewardXp"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.rewardXp);
            if (message.rewardGold != null && Object.hasOwnProperty.call(message, "rewardGold"))
                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.rewardGold);
            return writer;
        };

        /**
         * Decodes a QuestEntry message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.QuestEntry
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.QuestEntry} QuestEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuestEntry.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.QuestEntry();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.questId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.description = reader.string();
                        break;
                    }
                case 4: {
                        message.questType = reader.int32();
                        break;
                    }
                case 5: {
                        message.state = reader.int32();
                        break;
                    }
                case 6: {
                        message.progress = reader.int32();
                        break;
                    }
                case 7: {
                        message.targetCount = reader.int32();
                        break;
                    }
                case 8: {
                        message.rewardXp = reader.int32();
                        break;
                    }
                case 9: {
                        message.rewardGold = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for QuestEntry
         * @function getTypeUrl
         * @memberof hbonline.QuestEntry
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QuestEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.QuestEntry";
        };

        return QuestEntry;
    })();

    hbonline.QuestProgressUpdate = (function() {

        /**
         * Properties of a QuestProgressUpdate.
         * @memberof hbonline
         * @interface IQuestProgressUpdate
         * @property {number|null} [questId] QuestProgressUpdate questId
         * @property {number|null} [progress] QuestProgressUpdate progress
         * @property {number|null} [targetCount] QuestProgressUpdate targetCount
         * @property {boolean|null} [completed] QuestProgressUpdate completed
         */

        /**
         * Constructs a new QuestProgressUpdate.
         * @memberof hbonline
         * @classdesc Represents a QuestProgressUpdate.
         * @implements IQuestProgressUpdate
         * @constructor
         * @param {hbonline.IQuestProgressUpdate=} [properties] Properties to set
         */
        function QuestProgressUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuestProgressUpdate questId.
         * @member {number} questId
         * @memberof hbonline.QuestProgressUpdate
         * @instance
         */
        QuestProgressUpdate.prototype.questId = 0;

        /**
         * QuestProgressUpdate progress.
         * @member {number} progress
         * @memberof hbonline.QuestProgressUpdate
         * @instance
         */
        QuestProgressUpdate.prototype.progress = 0;

        /**
         * QuestProgressUpdate targetCount.
         * @member {number} targetCount
         * @memberof hbonline.QuestProgressUpdate
         * @instance
         */
        QuestProgressUpdate.prototype.targetCount = 0;

        /**
         * QuestProgressUpdate completed.
         * @member {boolean} completed
         * @memberof hbonline.QuestProgressUpdate
         * @instance
         */
        QuestProgressUpdate.prototype.completed = false;

        /**
         * Creates a new QuestProgressUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.QuestProgressUpdate
         * @static
         * @param {hbonline.IQuestProgressUpdate=} [properties] Properties to set
         * @returns {hbonline.QuestProgressUpdate} QuestProgressUpdate instance
         */
        QuestProgressUpdate.create = function create(properties) {
            return new QuestProgressUpdate(properties);
        };

        /**
         * Encodes the specified QuestProgressUpdate message. Does not implicitly {@link hbonline.QuestProgressUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.QuestProgressUpdate
         * @static
         * @param {hbonline.IQuestProgressUpdate} message QuestProgressUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuestProgressUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.questId != null && Object.hasOwnProperty.call(message, "questId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.questId);
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.progress);
            if (message.targetCount != null && Object.hasOwnProperty.call(message, "targetCount"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.targetCount);
            if (message.completed != null && Object.hasOwnProperty.call(message, "completed"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.completed);
            return writer;
        };

        /**
         * Decodes a QuestProgressUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.QuestProgressUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.QuestProgressUpdate} QuestProgressUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuestProgressUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.QuestProgressUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.questId = reader.int32();
                        break;
                    }
                case 2: {
                        message.progress = reader.int32();
                        break;
                    }
                case 3: {
                        message.targetCount = reader.int32();
                        break;
                    }
                case 4: {
                        message.completed = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for QuestProgressUpdate
         * @function getTypeUrl
         * @memberof hbonline.QuestProgressUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QuestProgressUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.QuestProgressUpdate";
        };

        return QuestProgressUpdate;
    })();

    hbonline.QuestRewardNotification = (function() {

        /**
         * Properties of a QuestRewardNotification.
         * @memberof hbonline
         * @interface IQuestRewardNotification
         * @property {number|null} [questId] QuestRewardNotification questId
         * @property {string|null} [questName] QuestRewardNotification questName
         * @property {number|Long|null} [xpGained] QuestRewardNotification xpGained
         * @property {number|Long|null} [goldGained] QuestRewardNotification goldGained
         * @property {number|null} [itemId] QuestRewardNotification itemId
         * @property {number|null} [itemCount] QuestRewardNotification itemCount
         */

        /**
         * Constructs a new QuestRewardNotification.
         * @memberof hbonline
         * @classdesc Represents a QuestRewardNotification.
         * @implements IQuestRewardNotification
         * @constructor
         * @param {hbonline.IQuestRewardNotification=} [properties] Properties to set
         */
        function QuestRewardNotification(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QuestRewardNotification questId.
         * @member {number} questId
         * @memberof hbonline.QuestRewardNotification
         * @instance
         */
        QuestRewardNotification.prototype.questId = 0;

        /**
         * QuestRewardNotification questName.
         * @member {string} questName
         * @memberof hbonline.QuestRewardNotification
         * @instance
         */
        QuestRewardNotification.prototype.questName = "";

        /**
         * QuestRewardNotification xpGained.
         * @member {number|Long} xpGained
         * @memberof hbonline.QuestRewardNotification
         * @instance
         */
        QuestRewardNotification.prototype.xpGained = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * QuestRewardNotification goldGained.
         * @member {number|Long} goldGained
         * @memberof hbonline.QuestRewardNotification
         * @instance
         */
        QuestRewardNotification.prototype.goldGained = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * QuestRewardNotification itemId.
         * @member {number} itemId
         * @memberof hbonline.QuestRewardNotification
         * @instance
         */
        QuestRewardNotification.prototype.itemId = 0;

        /**
         * QuestRewardNotification itemCount.
         * @member {number} itemCount
         * @memberof hbonline.QuestRewardNotification
         * @instance
         */
        QuestRewardNotification.prototype.itemCount = 0;

        /**
         * Creates a new QuestRewardNotification instance using the specified properties.
         * @function create
         * @memberof hbonline.QuestRewardNotification
         * @static
         * @param {hbonline.IQuestRewardNotification=} [properties] Properties to set
         * @returns {hbonline.QuestRewardNotification} QuestRewardNotification instance
         */
        QuestRewardNotification.create = function create(properties) {
            return new QuestRewardNotification(properties);
        };

        /**
         * Encodes the specified QuestRewardNotification message. Does not implicitly {@link hbonline.QuestRewardNotification.verify|verify} messages.
         * @function encode
         * @memberof hbonline.QuestRewardNotification
         * @static
         * @param {hbonline.IQuestRewardNotification} message QuestRewardNotification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QuestRewardNotification.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.questId != null && Object.hasOwnProperty.call(message, "questId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.questId);
            if (message.questName != null && Object.hasOwnProperty.call(message, "questName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.questName);
            if (message.xpGained != null && Object.hasOwnProperty.call(message, "xpGained"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.xpGained);
            if (message.goldGained != null && Object.hasOwnProperty.call(message, "goldGained"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.goldGained);
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.itemId);
            if (message.itemCount != null && Object.hasOwnProperty.call(message, "itemCount"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.itemCount);
            return writer;
        };

        /**
         * Decodes a QuestRewardNotification message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.QuestRewardNotification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.QuestRewardNotification} QuestRewardNotification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QuestRewardNotification.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.QuestRewardNotification();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.questId = reader.int32();
                        break;
                    }
                case 2: {
                        message.questName = reader.string();
                        break;
                    }
                case 3: {
                        message.xpGained = reader.int64();
                        break;
                    }
                case 4: {
                        message.goldGained = reader.int64();
                        break;
                    }
                case 5: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 6: {
                        message.itemCount = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for QuestRewardNotification
         * @function getTypeUrl
         * @memberof hbonline.QuestRewardNotification
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        QuestRewardNotification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.QuestRewardNotification";
        };

        return QuestRewardNotification;
    })();

    hbonline.FactionSelectRequest = (function() {

        /**
         * Properties of a FactionSelectRequest.
         * @memberof hbonline
         * @interface IFactionSelectRequest
         * @property {number|null} [side] FactionSelectRequest side
         */

        /**
         * Constructs a new FactionSelectRequest.
         * @memberof hbonline
         * @classdesc Represents a FactionSelectRequest.
         * @implements IFactionSelectRequest
         * @constructor
         * @param {hbonline.IFactionSelectRequest=} [properties] Properties to set
         */
        function FactionSelectRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FactionSelectRequest side.
         * @member {number} side
         * @memberof hbonline.FactionSelectRequest
         * @instance
         */
        FactionSelectRequest.prototype.side = 0;

        /**
         * Creates a new FactionSelectRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.FactionSelectRequest
         * @static
         * @param {hbonline.IFactionSelectRequest=} [properties] Properties to set
         * @returns {hbonline.FactionSelectRequest} FactionSelectRequest instance
         */
        FactionSelectRequest.create = function create(properties) {
            return new FactionSelectRequest(properties);
        };

        /**
         * Encodes the specified FactionSelectRequest message. Does not implicitly {@link hbonline.FactionSelectRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.FactionSelectRequest
         * @static
         * @param {hbonline.IFactionSelectRequest} message FactionSelectRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FactionSelectRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.side);
            return writer;
        };

        /**
         * Decodes a FactionSelectRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.FactionSelectRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.FactionSelectRequest} FactionSelectRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FactionSelectRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.FactionSelectRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.side = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for FactionSelectRequest
         * @function getTypeUrl
         * @memberof hbonline.FactionSelectRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FactionSelectRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.FactionSelectRequest";
        };

        return FactionSelectRequest;
    })();

    hbonline.FactionSelectResponse = (function() {

        /**
         * Properties of a FactionSelectResponse.
         * @memberof hbonline
         * @interface IFactionSelectResponse
         * @property {boolean|null} [success] FactionSelectResponse success
         * @property {string|null} [error] FactionSelectResponse error
         * @property {number|null} [side] FactionSelectResponse side
         */

        /**
         * Constructs a new FactionSelectResponse.
         * @memberof hbonline
         * @classdesc Represents a FactionSelectResponse.
         * @implements IFactionSelectResponse
         * @constructor
         * @param {hbonline.IFactionSelectResponse=} [properties] Properties to set
         */
        function FactionSelectResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FactionSelectResponse success.
         * @member {boolean} success
         * @memberof hbonline.FactionSelectResponse
         * @instance
         */
        FactionSelectResponse.prototype.success = false;

        /**
         * FactionSelectResponse error.
         * @member {string} error
         * @memberof hbonline.FactionSelectResponse
         * @instance
         */
        FactionSelectResponse.prototype.error = "";

        /**
         * FactionSelectResponse side.
         * @member {number} side
         * @memberof hbonline.FactionSelectResponse
         * @instance
         */
        FactionSelectResponse.prototype.side = 0;

        /**
         * Creates a new FactionSelectResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.FactionSelectResponse
         * @static
         * @param {hbonline.IFactionSelectResponse=} [properties] Properties to set
         * @returns {hbonline.FactionSelectResponse} FactionSelectResponse instance
         */
        FactionSelectResponse.create = function create(properties) {
            return new FactionSelectResponse(properties);
        };

        /**
         * Encodes the specified FactionSelectResponse message. Does not implicitly {@link hbonline.FactionSelectResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.FactionSelectResponse
         * @static
         * @param {hbonline.IFactionSelectResponse} message FactionSelectResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FactionSelectResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.side);
            return writer;
        };

        /**
         * Decodes a FactionSelectResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.FactionSelectResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.FactionSelectResponse} FactionSelectResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FactionSelectResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.FactionSelectResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.error = reader.string();
                        break;
                    }
                case 3: {
                        message.side = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for FactionSelectResponse
         * @function getTypeUrl
         * @memberof hbonline.FactionSelectResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FactionSelectResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.FactionSelectResponse";
        };

        return FactionSelectResponse;
    })();

    hbonline.GuildCreateRequest = (function() {

        /**
         * Properties of a GuildCreateRequest.
         * @memberof hbonline
         * @interface IGuildCreateRequest
         * @property {string|null} [name] GuildCreateRequest name
         */

        /**
         * Constructs a new GuildCreateRequest.
         * @memberof hbonline
         * @classdesc Represents a GuildCreateRequest.
         * @implements IGuildCreateRequest
         * @constructor
         * @param {hbonline.IGuildCreateRequest=} [properties] Properties to set
         */
        function GuildCreateRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildCreateRequest name.
         * @member {string} name
         * @memberof hbonline.GuildCreateRequest
         * @instance
         */
        GuildCreateRequest.prototype.name = "";

        /**
         * Creates a new GuildCreateRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.GuildCreateRequest
         * @static
         * @param {hbonline.IGuildCreateRequest=} [properties] Properties to set
         * @returns {hbonline.GuildCreateRequest} GuildCreateRequest instance
         */
        GuildCreateRequest.create = function create(properties) {
            return new GuildCreateRequest(properties);
        };

        /**
         * Encodes the specified GuildCreateRequest message. Does not implicitly {@link hbonline.GuildCreateRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GuildCreateRequest
         * @static
         * @param {hbonline.IGuildCreateRequest} message GuildCreateRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildCreateRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            return writer;
        };

        /**
         * Decodes a GuildCreateRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GuildCreateRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GuildCreateRequest} GuildCreateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildCreateRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GuildCreateRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GuildCreateRequest
         * @function getTypeUrl
         * @memberof hbonline.GuildCreateRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GuildCreateRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GuildCreateRequest";
        };

        return GuildCreateRequest;
    })();

    hbonline.GuildActionRequest = (function() {

        /**
         * Properties of a GuildActionRequest.
         * @memberof hbonline
         * @interface IGuildActionRequest
         * @property {number|null} [action] GuildActionRequest action
         * @property {string|null} [targetName] GuildActionRequest targetName
         */

        /**
         * Constructs a new GuildActionRequest.
         * @memberof hbonline
         * @classdesc Represents a GuildActionRequest.
         * @implements IGuildActionRequest
         * @constructor
         * @param {hbonline.IGuildActionRequest=} [properties] Properties to set
         */
        function GuildActionRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildActionRequest action.
         * @member {number} action
         * @memberof hbonline.GuildActionRequest
         * @instance
         */
        GuildActionRequest.prototype.action = 0;

        /**
         * GuildActionRequest targetName.
         * @member {string} targetName
         * @memberof hbonline.GuildActionRequest
         * @instance
         */
        GuildActionRequest.prototype.targetName = "";

        /**
         * Creates a new GuildActionRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.GuildActionRequest
         * @static
         * @param {hbonline.IGuildActionRequest=} [properties] Properties to set
         * @returns {hbonline.GuildActionRequest} GuildActionRequest instance
         */
        GuildActionRequest.create = function create(properties) {
            return new GuildActionRequest(properties);
        };

        /**
         * Encodes the specified GuildActionRequest message. Does not implicitly {@link hbonline.GuildActionRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GuildActionRequest
         * @static
         * @param {hbonline.IGuildActionRequest} message GuildActionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildActionRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.targetName != null && Object.hasOwnProperty.call(message, "targetName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetName);
            return writer;
        };

        /**
         * Decodes a GuildActionRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GuildActionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GuildActionRequest} GuildActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildActionRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GuildActionRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.action = reader.int32();
                        break;
                    }
                case 2: {
                        message.targetName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GuildActionRequest
         * @function getTypeUrl
         * @memberof hbonline.GuildActionRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GuildActionRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GuildActionRequest";
        };

        return GuildActionRequest;
    })();

    hbonline.GuildInfo = (function() {

        /**
         * Properties of a GuildInfo.
         * @memberof hbonline
         * @interface IGuildInfo
         * @property {number|null} [guildId] GuildInfo guildId
         * @property {string|null} [name] GuildInfo name
         * @property {number|null} [side] GuildInfo side
         * @property {Array.<hbonline.IGuildMemberInfo>|null} [members] GuildInfo members
         * @property {string|null} [masterName] GuildInfo masterName
         */

        /**
         * Constructs a new GuildInfo.
         * @memberof hbonline
         * @classdesc Represents a GuildInfo.
         * @implements IGuildInfo
         * @constructor
         * @param {hbonline.IGuildInfo=} [properties] Properties to set
         */
        function GuildInfo(properties) {
            this.members = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildInfo guildId.
         * @member {number} guildId
         * @memberof hbonline.GuildInfo
         * @instance
         */
        GuildInfo.prototype.guildId = 0;

        /**
         * GuildInfo name.
         * @member {string} name
         * @memberof hbonline.GuildInfo
         * @instance
         */
        GuildInfo.prototype.name = "";

        /**
         * GuildInfo side.
         * @member {number} side
         * @memberof hbonline.GuildInfo
         * @instance
         */
        GuildInfo.prototype.side = 0;

        /**
         * GuildInfo members.
         * @member {Array.<hbonline.IGuildMemberInfo>} members
         * @memberof hbonline.GuildInfo
         * @instance
         */
        GuildInfo.prototype.members = $util.emptyArray;

        /**
         * GuildInfo masterName.
         * @member {string} masterName
         * @memberof hbonline.GuildInfo
         * @instance
         */
        GuildInfo.prototype.masterName = "";

        /**
         * Creates a new GuildInfo instance using the specified properties.
         * @function create
         * @memberof hbonline.GuildInfo
         * @static
         * @param {hbonline.IGuildInfo=} [properties] Properties to set
         * @returns {hbonline.GuildInfo} GuildInfo instance
         */
        GuildInfo.create = function create(properties) {
            return new GuildInfo(properties);
        };

        /**
         * Encodes the specified GuildInfo message. Does not implicitly {@link hbonline.GuildInfo.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GuildInfo
         * @static
         * @param {hbonline.IGuildInfo} message GuildInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.guildId != null && Object.hasOwnProperty.call(message, "guildId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.guildId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.side != null && Object.hasOwnProperty.call(message, "side"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.side);
            if (message.members != null && message.members.length)
                for (let i = 0; i < message.members.length; ++i)
                    $root.hbonline.GuildMemberInfo.encode(message.members[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.masterName != null && Object.hasOwnProperty.call(message, "masterName"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.masterName);
            return writer;
        };

        /**
         * Decodes a GuildInfo message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GuildInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GuildInfo} GuildInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildInfo.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GuildInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.guildId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.side = reader.int32();
                        break;
                    }
                case 4: {
                        if (!(message.members && message.members.length))
                            message.members = [];
                        message.members.push($root.hbonline.GuildMemberInfo.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        message.masterName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GuildInfo
         * @function getTypeUrl
         * @memberof hbonline.GuildInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GuildInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GuildInfo";
        };

        return GuildInfo;
    })();

    hbonline.GuildMemberInfo = (function() {

        /**
         * Properties of a GuildMemberInfo.
         * @memberof hbonline
         * @interface IGuildMemberInfo
         * @property {string|null} [name] GuildMemberInfo name
         * @property {number|null} [rank] GuildMemberInfo rank
         * @property {number|null} [level] GuildMemberInfo level
         * @property {boolean|null} [online] GuildMemberInfo online
         */

        /**
         * Constructs a new GuildMemberInfo.
         * @memberof hbonline
         * @classdesc Represents a GuildMemberInfo.
         * @implements IGuildMemberInfo
         * @constructor
         * @param {hbonline.IGuildMemberInfo=} [properties] Properties to set
         */
        function GuildMemberInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildMemberInfo name.
         * @member {string} name
         * @memberof hbonline.GuildMemberInfo
         * @instance
         */
        GuildMemberInfo.prototype.name = "";

        /**
         * GuildMemberInfo rank.
         * @member {number} rank
         * @memberof hbonline.GuildMemberInfo
         * @instance
         */
        GuildMemberInfo.prototype.rank = 0;

        /**
         * GuildMemberInfo level.
         * @member {number} level
         * @memberof hbonline.GuildMemberInfo
         * @instance
         */
        GuildMemberInfo.prototype.level = 0;

        /**
         * GuildMemberInfo online.
         * @member {boolean} online
         * @memberof hbonline.GuildMemberInfo
         * @instance
         */
        GuildMemberInfo.prototype.online = false;

        /**
         * Creates a new GuildMemberInfo instance using the specified properties.
         * @function create
         * @memberof hbonline.GuildMemberInfo
         * @static
         * @param {hbonline.IGuildMemberInfo=} [properties] Properties to set
         * @returns {hbonline.GuildMemberInfo} GuildMemberInfo instance
         */
        GuildMemberInfo.create = function create(properties) {
            return new GuildMemberInfo(properties);
        };

        /**
         * Encodes the specified GuildMemberInfo message. Does not implicitly {@link hbonline.GuildMemberInfo.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GuildMemberInfo
         * @static
         * @param {hbonline.IGuildMemberInfo} message GuildMemberInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildMemberInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.rank != null && Object.hasOwnProperty.call(message, "rank"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.rank);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.level);
            if (message.online != null && Object.hasOwnProperty.call(message, "online"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.online);
            return writer;
        };

        /**
         * Decodes a GuildMemberInfo message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GuildMemberInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GuildMemberInfo} GuildMemberInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildMemberInfo.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GuildMemberInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.rank = reader.int32();
                        break;
                    }
                case 3: {
                        message.level = reader.int32();
                        break;
                    }
                case 4: {
                        message.online = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GuildMemberInfo
         * @function getTypeUrl
         * @memberof hbonline.GuildMemberInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GuildMemberInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GuildMemberInfo";
        };

        return GuildMemberInfo;
    })();

    hbonline.GuildActionResponse = (function() {

        /**
         * Properties of a GuildActionResponse.
         * @memberof hbonline
         * @interface IGuildActionResponse
         * @property {boolean|null} [success] GuildActionResponse success
         * @property {string|null} [message] GuildActionResponse message
         */

        /**
         * Constructs a new GuildActionResponse.
         * @memberof hbonline
         * @classdesc Represents a GuildActionResponse.
         * @implements IGuildActionResponse
         * @constructor
         * @param {hbonline.IGuildActionResponse=} [properties] Properties to set
         */
        function GuildActionResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildActionResponse success.
         * @member {boolean} success
         * @memberof hbonline.GuildActionResponse
         * @instance
         */
        GuildActionResponse.prototype.success = false;

        /**
         * GuildActionResponse message.
         * @member {string} message
         * @memberof hbonline.GuildActionResponse
         * @instance
         */
        GuildActionResponse.prototype.message = "";

        /**
         * Creates a new GuildActionResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.GuildActionResponse
         * @static
         * @param {hbonline.IGuildActionResponse=} [properties] Properties to set
         * @returns {hbonline.GuildActionResponse} GuildActionResponse instance
         */
        GuildActionResponse.create = function create(properties) {
            return new GuildActionResponse(properties);
        };

        /**
         * Encodes the specified GuildActionResponse message. Does not implicitly {@link hbonline.GuildActionResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.GuildActionResponse
         * @static
         * @param {hbonline.IGuildActionResponse} message GuildActionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildActionResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            return writer;
        };

        /**
         * Decodes a GuildActionResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.GuildActionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.GuildActionResponse} GuildActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildActionResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.GuildActionResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for GuildActionResponse
         * @function getTypeUrl
         * @memberof hbonline.GuildActionResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GuildActionResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.GuildActionResponse";
        };

        return GuildActionResponse;
    })();

    hbonline.PartyActionRequest = (function() {

        /**
         * Properties of a PartyActionRequest.
         * @memberof hbonline
         * @interface IPartyActionRequest
         * @property {number|null} [action] PartyActionRequest action
         * @property {string|null} [targetName] PartyActionRequest targetName
         */

        /**
         * Constructs a new PartyActionRequest.
         * @memberof hbonline
         * @classdesc Represents a PartyActionRequest.
         * @implements IPartyActionRequest
         * @constructor
         * @param {hbonline.IPartyActionRequest=} [properties] Properties to set
         */
        function PartyActionRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyActionRequest action.
         * @member {number} action
         * @memberof hbonline.PartyActionRequest
         * @instance
         */
        PartyActionRequest.prototype.action = 0;

        /**
         * PartyActionRequest targetName.
         * @member {string} targetName
         * @memberof hbonline.PartyActionRequest
         * @instance
         */
        PartyActionRequest.prototype.targetName = "";

        /**
         * Creates a new PartyActionRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.PartyActionRequest
         * @static
         * @param {hbonline.IPartyActionRequest=} [properties] Properties to set
         * @returns {hbonline.PartyActionRequest} PartyActionRequest instance
         */
        PartyActionRequest.create = function create(properties) {
            return new PartyActionRequest(properties);
        };

        /**
         * Encodes the specified PartyActionRequest message. Does not implicitly {@link hbonline.PartyActionRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PartyActionRequest
         * @static
         * @param {hbonline.IPartyActionRequest} message PartyActionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyActionRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.targetName != null && Object.hasOwnProperty.call(message, "targetName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.targetName);
            return writer;
        };

        /**
         * Decodes a PartyActionRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PartyActionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PartyActionRequest} PartyActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyActionRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PartyActionRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.action = reader.int32();
                        break;
                    }
                case 2: {
                        message.targetName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PartyActionRequest
         * @function getTypeUrl
         * @memberof hbonline.PartyActionRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PartyActionRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PartyActionRequest";
        };

        return PartyActionRequest;
    })();

    hbonline.PartyActionResponse = (function() {

        /**
         * Properties of a PartyActionResponse.
         * @memberof hbonline
         * @interface IPartyActionResponse
         * @property {boolean|null} [success] PartyActionResponse success
         * @property {string|null} [message] PartyActionResponse message
         */

        /**
         * Constructs a new PartyActionResponse.
         * @memberof hbonline
         * @classdesc Represents a PartyActionResponse.
         * @implements IPartyActionResponse
         * @constructor
         * @param {hbonline.IPartyActionResponse=} [properties] Properties to set
         */
        function PartyActionResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyActionResponse success.
         * @member {boolean} success
         * @memberof hbonline.PartyActionResponse
         * @instance
         */
        PartyActionResponse.prototype.success = false;

        /**
         * PartyActionResponse message.
         * @member {string} message
         * @memberof hbonline.PartyActionResponse
         * @instance
         */
        PartyActionResponse.prototype.message = "";

        /**
         * Creates a new PartyActionResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.PartyActionResponse
         * @static
         * @param {hbonline.IPartyActionResponse=} [properties] Properties to set
         * @returns {hbonline.PartyActionResponse} PartyActionResponse instance
         */
        PartyActionResponse.create = function create(properties) {
            return new PartyActionResponse(properties);
        };

        /**
         * Encodes the specified PartyActionResponse message. Does not implicitly {@link hbonline.PartyActionResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PartyActionResponse
         * @static
         * @param {hbonline.IPartyActionResponse} message PartyActionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyActionResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            return writer;
        };

        /**
         * Decodes a PartyActionResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PartyActionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PartyActionResponse} PartyActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyActionResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PartyActionResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PartyActionResponse
         * @function getTypeUrl
         * @memberof hbonline.PartyActionResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PartyActionResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PartyActionResponse";
        };

        return PartyActionResponse;
    })();

    hbonline.PartyUpdate = (function() {

        /**
         * Properties of a PartyUpdate.
         * @memberof hbonline
         * @interface IPartyUpdate
         * @property {Array.<hbonline.IPartyMemberInfo>|null} [members] PartyUpdate members
         * @property {number|null} [leaderObjectId] PartyUpdate leaderObjectId
         */

        /**
         * Constructs a new PartyUpdate.
         * @memberof hbonline
         * @classdesc Represents a PartyUpdate.
         * @implements IPartyUpdate
         * @constructor
         * @param {hbonline.IPartyUpdate=} [properties] Properties to set
         */
        function PartyUpdate(properties) {
            this.members = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyUpdate members.
         * @member {Array.<hbonline.IPartyMemberInfo>} members
         * @memberof hbonline.PartyUpdate
         * @instance
         */
        PartyUpdate.prototype.members = $util.emptyArray;

        /**
         * PartyUpdate leaderObjectId.
         * @member {number} leaderObjectId
         * @memberof hbonline.PartyUpdate
         * @instance
         */
        PartyUpdate.prototype.leaderObjectId = 0;

        /**
         * Creates a new PartyUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.PartyUpdate
         * @static
         * @param {hbonline.IPartyUpdate=} [properties] Properties to set
         * @returns {hbonline.PartyUpdate} PartyUpdate instance
         */
        PartyUpdate.create = function create(properties) {
            return new PartyUpdate(properties);
        };

        /**
         * Encodes the specified PartyUpdate message. Does not implicitly {@link hbonline.PartyUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PartyUpdate
         * @static
         * @param {hbonline.IPartyUpdate} message PartyUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.members != null && message.members.length)
                for (let i = 0; i < message.members.length; ++i)
                    $root.hbonline.PartyMemberInfo.encode(message.members[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.leaderObjectId != null && Object.hasOwnProperty.call(message, "leaderObjectId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.leaderObjectId);
            return writer;
        };

        /**
         * Decodes a PartyUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PartyUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PartyUpdate} PartyUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PartyUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.members && message.members.length))
                            message.members = [];
                        message.members.push($root.hbonline.PartyMemberInfo.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.leaderObjectId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PartyUpdate
         * @function getTypeUrl
         * @memberof hbonline.PartyUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PartyUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PartyUpdate";
        };

        return PartyUpdate;
    })();

    hbonline.PartyMemberInfo = (function() {

        /**
         * Properties of a PartyMemberInfo.
         * @memberof hbonline
         * @interface IPartyMemberInfo
         * @property {number|null} [objectId] PartyMemberInfo objectId
         * @property {string|null} [name] PartyMemberInfo name
         * @property {number|null} [hp] PartyMemberInfo hp
         * @property {number|null} [maxHp] PartyMemberInfo maxHp
         * @property {number|null} [level] PartyMemberInfo level
         */

        /**
         * Constructs a new PartyMemberInfo.
         * @memberof hbonline
         * @classdesc Represents a PartyMemberInfo.
         * @implements IPartyMemberInfo
         * @constructor
         * @param {hbonline.IPartyMemberInfo=} [properties] Properties to set
         */
        function PartyMemberInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyMemberInfo objectId.
         * @member {number} objectId
         * @memberof hbonline.PartyMemberInfo
         * @instance
         */
        PartyMemberInfo.prototype.objectId = 0;

        /**
         * PartyMemberInfo name.
         * @member {string} name
         * @memberof hbonline.PartyMemberInfo
         * @instance
         */
        PartyMemberInfo.prototype.name = "";

        /**
         * PartyMemberInfo hp.
         * @member {number} hp
         * @memberof hbonline.PartyMemberInfo
         * @instance
         */
        PartyMemberInfo.prototype.hp = 0;

        /**
         * PartyMemberInfo maxHp.
         * @member {number} maxHp
         * @memberof hbonline.PartyMemberInfo
         * @instance
         */
        PartyMemberInfo.prototype.maxHp = 0;

        /**
         * PartyMemberInfo level.
         * @member {number} level
         * @memberof hbonline.PartyMemberInfo
         * @instance
         */
        PartyMemberInfo.prototype.level = 0;

        /**
         * Creates a new PartyMemberInfo instance using the specified properties.
         * @function create
         * @memberof hbonline.PartyMemberInfo
         * @static
         * @param {hbonline.IPartyMemberInfo=} [properties] Properties to set
         * @returns {hbonline.PartyMemberInfo} PartyMemberInfo instance
         */
        PartyMemberInfo.create = function create(properties) {
            return new PartyMemberInfo(properties);
        };

        /**
         * Encodes the specified PartyMemberInfo message. Does not implicitly {@link hbonline.PartyMemberInfo.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PartyMemberInfo
         * @static
         * @param {hbonline.IPartyMemberInfo} message PartyMemberInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyMemberInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.objectId != null && Object.hasOwnProperty.call(message, "objectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.hp != null && Object.hasOwnProperty.call(message, "hp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.hp);
            if (message.maxHp != null && Object.hasOwnProperty.call(message, "maxHp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.maxHp);
            if (message.level != null && Object.hasOwnProperty.call(message, "level"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.level);
            return writer;
        };

        /**
         * Decodes a PartyMemberInfo message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PartyMemberInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PartyMemberInfo} PartyMemberInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyMemberInfo.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PartyMemberInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.objectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.hp = reader.int32();
                        break;
                    }
                case 4: {
                        message.maxHp = reader.int32();
                        break;
                    }
                case 5: {
                        message.level = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PartyMemberInfo
         * @function getTypeUrl
         * @memberof hbonline.PartyMemberInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PartyMemberInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PartyMemberInfo";
        };

        return PartyMemberInfo;
    })();

    hbonline.PartyInvite = (function() {

        /**
         * Properties of a PartyInvite.
         * @memberof hbonline
         * @interface IPartyInvite
         * @property {number|null} [inviterObjectId] PartyInvite inviterObjectId
         * @property {string|null} [inviterName] PartyInvite inviterName
         */

        /**
         * Constructs a new PartyInvite.
         * @memberof hbonline
         * @classdesc Represents a PartyInvite.
         * @implements IPartyInvite
         * @constructor
         * @param {hbonline.IPartyInvite=} [properties] Properties to set
         */
        function PartyInvite(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyInvite inviterObjectId.
         * @member {number} inviterObjectId
         * @memberof hbonline.PartyInvite
         * @instance
         */
        PartyInvite.prototype.inviterObjectId = 0;

        /**
         * PartyInvite inviterName.
         * @member {string} inviterName
         * @memberof hbonline.PartyInvite
         * @instance
         */
        PartyInvite.prototype.inviterName = "";

        /**
         * Creates a new PartyInvite instance using the specified properties.
         * @function create
         * @memberof hbonline.PartyInvite
         * @static
         * @param {hbonline.IPartyInvite=} [properties] Properties to set
         * @returns {hbonline.PartyInvite} PartyInvite instance
         */
        PartyInvite.create = function create(properties) {
            return new PartyInvite(properties);
        };

        /**
         * Encodes the specified PartyInvite message. Does not implicitly {@link hbonline.PartyInvite.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PartyInvite
         * @static
         * @param {hbonline.IPartyInvite} message PartyInvite message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyInvite.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.inviterObjectId != null && Object.hasOwnProperty.call(message, "inviterObjectId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.inviterObjectId);
            if (message.inviterName != null && Object.hasOwnProperty.call(message, "inviterName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.inviterName);
            return writer;
        };

        /**
         * Decodes a PartyInvite message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PartyInvite
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PartyInvite} PartyInvite
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyInvite.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PartyInvite();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.inviterObjectId = reader.int32();
                        break;
                    }
                case 2: {
                        message.inviterName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PartyInvite
         * @function getTypeUrl
         * @memberof hbonline.PartyInvite
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PartyInvite.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PartyInvite";
        };

        return PartyInvite;
    })();

    hbonline.PartyInviteResponse = (function() {

        /**
         * Properties of a PartyInviteResponse.
         * @memberof hbonline
         * @interface IPartyInviteResponse
         * @property {boolean|null} [accept] PartyInviteResponse accept
         */

        /**
         * Constructs a new PartyInviteResponse.
         * @memberof hbonline
         * @classdesc Represents a PartyInviteResponse.
         * @implements IPartyInviteResponse
         * @constructor
         * @param {hbonline.IPartyInviteResponse=} [properties] Properties to set
         */
        function PartyInviteResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PartyInviteResponse accept.
         * @member {boolean} accept
         * @memberof hbonline.PartyInviteResponse
         * @instance
         */
        PartyInviteResponse.prototype.accept = false;

        /**
         * Creates a new PartyInviteResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.PartyInviteResponse
         * @static
         * @param {hbonline.IPartyInviteResponse=} [properties] Properties to set
         * @returns {hbonline.PartyInviteResponse} PartyInviteResponse instance
         */
        PartyInviteResponse.create = function create(properties) {
            return new PartyInviteResponse(properties);
        };

        /**
         * Encodes the specified PartyInviteResponse message. Does not implicitly {@link hbonline.PartyInviteResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PartyInviteResponse
         * @static
         * @param {hbonline.IPartyInviteResponse} message PartyInviteResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PartyInviteResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accept != null && Object.hasOwnProperty.call(message, "accept"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.accept);
            return writer;
        };

        /**
         * Decodes a PartyInviteResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PartyInviteResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PartyInviteResponse} PartyInviteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PartyInviteResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PartyInviteResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.accept = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PartyInviteResponse
         * @function getTypeUrl
         * @memberof hbonline.PartyInviteResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PartyInviteResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PartyInviteResponse";
        };

        return PartyInviteResponse;
    })();

    hbonline.TradeRequest = (function() {

        /**
         * Properties of a TradeRequest.
         * @memberof hbonline
         * @interface ITradeRequest
         * @property {number|null} [targetId] TradeRequest targetId
         */

        /**
         * Constructs a new TradeRequest.
         * @memberof hbonline
         * @classdesc Represents a TradeRequest.
         * @implements ITradeRequest
         * @constructor
         * @param {hbonline.ITradeRequest=} [properties] Properties to set
         */
        function TradeRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeRequest targetId.
         * @member {number} targetId
         * @memberof hbonline.TradeRequest
         * @instance
         */
        TradeRequest.prototype.targetId = 0;

        /**
         * Creates a new TradeRequest instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeRequest
         * @static
         * @param {hbonline.ITradeRequest=} [properties] Properties to set
         * @returns {hbonline.TradeRequest} TradeRequest instance
         */
        TradeRequest.create = function create(properties) {
            return new TradeRequest(properties);
        };

        /**
         * Encodes the specified TradeRequest message. Does not implicitly {@link hbonline.TradeRequest.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeRequest
         * @static
         * @param {hbonline.ITradeRequest} message TradeRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.targetId);
            return writer;
        };

        /**
         * Decodes a TradeRequest message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeRequest} TradeRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.targetId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeRequest
         * @function getTypeUrl
         * @memberof hbonline.TradeRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeRequest";
        };

        return TradeRequest;
    })();

    hbonline.TradeIncoming = (function() {

        /**
         * Properties of a TradeIncoming.
         * @memberof hbonline
         * @interface ITradeIncoming
         * @property {number|null} [requesterId] TradeIncoming requesterId
         * @property {string|null} [requesterName] TradeIncoming requesterName
         */

        /**
         * Constructs a new TradeIncoming.
         * @memberof hbonline
         * @classdesc Represents a TradeIncoming.
         * @implements ITradeIncoming
         * @constructor
         * @param {hbonline.ITradeIncoming=} [properties] Properties to set
         */
        function TradeIncoming(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeIncoming requesterId.
         * @member {number} requesterId
         * @memberof hbonline.TradeIncoming
         * @instance
         */
        TradeIncoming.prototype.requesterId = 0;

        /**
         * TradeIncoming requesterName.
         * @member {string} requesterName
         * @memberof hbonline.TradeIncoming
         * @instance
         */
        TradeIncoming.prototype.requesterName = "";

        /**
         * Creates a new TradeIncoming instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeIncoming
         * @static
         * @param {hbonline.ITradeIncoming=} [properties] Properties to set
         * @returns {hbonline.TradeIncoming} TradeIncoming instance
         */
        TradeIncoming.create = function create(properties) {
            return new TradeIncoming(properties);
        };

        /**
         * Encodes the specified TradeIncoming message. Does not implicitly {@link hbonline.TradeIncoming.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeIncoming
         * @static
         * @param {hbonline.ITradeIncoming} message TradeIncoming message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeIncoming.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requesterId != null && Object.hasOwnProperty.call(message, "requesterId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requesterId);
            if (message.requesterName != null && Object.hasOwnProperty.call(message, "requesterName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.requesterName);
            return writer;
        };

        /**
         * Decodes a TradeIncoming message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeIncoming
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeIncoming} TradeIncoming
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeIncoming.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeIncoming();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.requesterId = reader.int32();
                        break;
                    }
                case 2: {
                        message.requesterName = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeIncoming
         * @function getTypeUrl
         * @memberof hbonline.TradeIncoming
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeIncoming.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeIncoming";
        };

        return TradeIncoming;
    })();

    hbonline.TradeResponse = (function() {

        /**
         * Properties of a TradeResponse.
         * @memberof hbonline
         * @interface ITradeResponse
         * @property {boolean|null} [accept] TradeResponse accept
         */

        /**
         * Constructs a new TradeResponse.
         * @memberof hbonline
         * @classdesc Represents a TradeResponse.
         * @implements ITradeResponse
         * @constructor
         * @param {hbonline.ITradeResponse=} [properties] Properties to set
         */
        function TradeResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeResponse accept.
         * @member {boolean} accept
         * @memberof hbonline.TradeResponse
         * @instance
         */
        TradeResponse.prototype.accept = false;

        /**
         * Creates a new TradeResponse instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeResponse
         * @static
         * @param {hbonline.ITradeResponse=} [properties] Properties to set
         * @returns {hbonline.TradeResponse} TradeResponse instance
         */
        TradeResponse.create = function create(properties) {
            return new TradeResponse(properties);
        };

        /**
         * Encodes the specified TradeResponse message. Does not implicitly {@link hbonline.TradeResponse.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeResponse
         * @static
         * @param {hbonline.ITradeResponse} message TradeResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accept != null && Object.hasOwnProperty.call(message, "accept"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.accept);
            return writer;
        };

        /**
         * Decodes a TradeResponse message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeResponse} TradeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.accept = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeResponse
         * @function getTypeUrl
         * @memberof hbonline.TradeResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeResponse";
        };

        return TradeResponse;
    })();

    hbonline.TradeSetItem = (function() {

        /**
         * Properties of a TradeSetItem.
         * @memberof hbonline
         * @interface ITradeSetItem
         * @property {number|null} [inventorySlot] TradeSetItem inventorySlot
         * @property {number|null} [count] TradeSetItem count
         */

        /**
         * Constructs a new TradeSetItem.
         * @memberof hbonline
         * @classdesc Represents a TradeSetItem.
         * @implements ITradeSetItem
         * @constructor
         * @param {hbonline.ITradeSetItem=} [properties] Properties to set
         */
        function TradeSetItem(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeSetItem inventorySlot.
         * @member {number} inventorySlot
         * @memberof hbonline.TradeSetItem
         * @instance
         */
        TradeSetItem.prototype.inventorySlot = 0;

        /**
         * TradeSetItem count.
         * @member {number} count
         * @memberof hbonline.TradeSetItem
         * @instance
         */
        TradeSetItem.prototype.count = 0;

        /**
         * Creates a new TradeSetItem instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeSetItem
         * @static
         * @param {hbonline.ITradeSetItem=} [properties] Properties to set
         * @returns {hbonline.TradeSetItem} TradeSetItem instance
         */
        TradeSetItem.create = function create(properties) {
            return new TradeSetItem(properties);
        };

        /**
         * Encodes the specified TradeSetItem message. Does not implicitly {@link hbonline.TradeSetItem.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeSetItem
         * @static
         * @param {hbonline.ITradeSetItem} message TradeSetItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeSetItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.inventorySlot != null && Object.hasOwnProperty.call(message, "inventorySlot"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.inventorySlot);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.count);
            return writer;
        };

        /**
         * Decodes a TradeSetItem message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeSetItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeSetItem} TradeSetItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeSetItem.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeSetItem();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.inventorySlot = reader.int32();
                        break;
                    }
                case 2: {
                        message.count = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeSetItem
         * @function getTypeUrl
         * @memberof hbonline.TradeSetItem
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeSetItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeSetItem";
        };

        return TradeSetItem;
    })();

    hbonline.TradeSetGold = (function() {

        /**
         * Properties of a TradeSetGold.
         * @memberof hbonline
         * @interface ITradeSetGold
         * @property {number|Long|null} [gold] TradeSetGold gold
         */

        /**
         * Constructs a new TradeSetGold.
         * @memberof hbonline
         * @classdesc Represents a TradeSetGold.
         * @implements ITradeSetGold
         * @constructor
         * @param {hbonline.ITradeSetGold=} [properties] Properties to set
         */
        function TradeSetGold(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeSetGold gold.
         * @member {number|Long} gold
         * @memberof hbonline.TradeSetGold
         * @instance
         */
        TradeSetGold.prototype.gold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new TradeSetGold instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeSetGold
         * @static
         * @param {hbonline.ITradeSetGold=} [properties] Properties to set
         * @returns {hbonline.TradeSetGold} TradeSetGold instance
         */
        TradeSetGold.create = function create(properties) {
            return new TradeSetGold(properties);
        };

        /**
         * Encodes the specified TradeSetGold message. Does not implicitly {@link hbonline.TradeSetGold.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeSetGold
         * @static
         * @param {hbonline.ITradeSetGold} message TradeSetGold message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeSetGold.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gold != null && Object.hasOwnProperty.call(message, "gold"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.gold);
            return writer;
        };

        /**
         * Decodes a TradeSetGold message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeSetGold
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeSetGold} TradeSetGold
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeSetGold.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeSetGold();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.gold = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeSetGold
         * @function getTypeUrl
         * @memberof hbonline.TradeSetGold
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeSetGold.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeSetGold";
        };

        return TradeSetGold;
    })();

    hbonline.TradeConfirm = (function() {

        /**
         * Properties of a TradeConfirm.
         * @memberof hbonline
         * @interface ITradeConfirm
         * @property {boolean|null} [confirmed] TradeConfirm confirmed
         */

        /**
         * Constructs a new TradeConfirm.
         * @memberof hbonline
         * @classdesc Represents a TradeConfirm.
         * @implements ITradeConfirm
         * @constructor
         * @param {hbonline.ITradeConfirm=} [properties] Properties to set
         */
        function TradeConfirm(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeConfirm confirmed.
         * @member {boolean} confirmed
         * @memberof hbonline.TradeConfirm
         * @instance
         */
        TradeConfirm.prototype.confirmed = false;

        /**
         * Creates a new TradeConfirm instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeConfirm
         * @static
         * @param {hbonline.ITradeConfirm=} [properties] Properties to set
         * @returns {hbonline.TradeConfirm} TradeConfirm instance
         */
        TradeConfirm.create = function create(properties) {
            return new TradeConfirm(properties);
        };

        /**
         * Encodes the specified TradeConfirm message. Does not implicitly {@link hbonline.TradeConfirm.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeConfirm
         * @static
         * @param {hbonline.ITradeConfirm} message TradeConfirm message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeConfirm.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.confirmed != null && Object.hasOwnProperty.call(message, "confirmed"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.confirmed);
            return writer;
        };

        /**
         * Decodes a TradeConfirm message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeConfirm
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeConfirm} TradeConfirm
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeConfirm.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeConfirm();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.confirmed = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeConfirm
         * @function getTypeUrl
         * @memberof hbonline.TradeConfirm
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeConfirm.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeConfirm";
        };

        return TradeConfirm;
    })();

    hbonline.TradeUpdate = (function() {

        /**
         * Properties of a TradeUpdate.
         * @memberof hbonline
         * @interface ITradeUpdate
         * @property {Array.<hbonline.ITradeSlot>|null} [myItems] TradeUpdate myItems
         * @property {Array.<hbonline.ITradeSlot>|null} [theirItems] TradeUpdate theirItems
         * @property {number|Long|null} [myGold] TradeUpdate myGold
         * @property {number|Long|null} [theirGold] TradeUpdate theirGold
         * @property {boolean|null} [myConfirmed] TradeUpdate myConfirmed
         * @property {boolean|null} [theirConfirmed] TradeUpdate theirConfirmed
         */

        /**
         * Constructs a new TradeUpdate.
         * @memberof hbonline
         * @classdesc Represents a TradeUpdate.
         * @implements ITradeUpdate
         * @constructor
         * @param {hbonline.ITradeUpdate=} [properties] Properties to set
         */
        function TradeUpdate(properties) {
            this.myItems = [];
            this.theirItems = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeUpdate myItems.
         * @member {Array.<hbonline.ITradeSlot>} myItems
         * @memberof hbonline.TradeUpdate
         * @instance
         */
        TradeUpdate.prototype.myItems = $util.emptyArray;

        /**
         * TradeUpdate theirItems.
         * @member {Array.<hbonline.ITradeSlot>} theirItems
         * @memberof hbonline.TradeUpdate
         * @instance
         */
        TradeUpdate.prototype.theirItems = $util.emptyArray;

        /**
         * TradeUpdate myGold.
         * @member {number|Long} myGold
         * @memberof hbonline.TradeUpdate
         * @instance
         */
        TradeUpdate.prototype.myGold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * TradeUpdate theirGold.
         * @member {number|Long} theirGold
         * @memberof hbonline.TradeUpdate
         * @instance
         */
        TradeUpdate.prototype.theirGold = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * TradeUpdate myConfirmed.
         * @member {boolean} myConfirmed
         * @memberof hbonline.TradeUpdate
         * @instance
         */
        TradeUpdate.prototype.myConfirmed = false;

        /**
         * TradeUpdate theirConfirmed.
         * @member {boolean} theirConfirmed
         * @memberof hbonline.TradeUpdate
         * @instance
         */
        TradeUpdate.prototype.theirConfirmed = false;

        /**
         * Creates a new TradeUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeUpdate
         * @static
         * @param {hbonline.ITradeUpdate=} [properties] Properties to set
         * @returns {hbonline.TradeUpdate} TradeUpdate instance
         */
        TradeUpdate.create = function create(properties) {
            return new TradeUpdate(properties);
        };

        /**
         * Encodes the specified TradeUpdate message. Does not implicitly {@link hbonline.TradeUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeUpdate
         * @static
         * @param {hbonline.ITradeUpdate} message TradeUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.myItems != null && message.myItems.length)
                for (let i = 0; i < message.myItems.length; ++i)
                    $root.hbonline.TradeSlot.encode(message.myItems[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.theirItems != null && message.theirItems.length)
                for (let i = 0; i < message.theirItems.length; ++i)
                    $root.hbonline.TradeSlot.encode(message.theirItems[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.myGold != null && Object.hasOwnProperty.call(message, "myGold"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.myGold);
            if (message.theirGold != null && Object.hasOwnProperty.call(message, "theirGold"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.theirGold);
            if (message.myConfirmed != null && Object.hasOwnProperty.call(message, "myConfirmed"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.myConfirmed);
            if (message.theirConfirmed != null && Object.hasOwnProperty.call(message, "theirConfirmed"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.theirConfirmed);
            return writer;
        };

        /**
         * Decodes a TradeUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeUpdate} TradeUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.myItems && message.myItems.length))
                            message.myItems = [];
                        message.myItems.push($root.hbonline.TradeSlot.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.theirItems && message.theirItems.length))
                            message.theirItems = [];
                        message.theirItems.push($root.hbonline.TradeSlot.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.myGold = reader.int64();
                        break;
                    }
                case 4: {
                        message.theirGold = reader.int64();
                        break;
                    }
                case 5: {
                        message.myConfirmed = reader.bool();
                        break;
                    }
                case 6: {
                        message.theirConfirmed = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeUpdate
         * @function getTypeUrl
         * @memberof hbonline.TradeUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeUpdate";
        };

        return TradeUpdate;
    })();

    hbonline.TradeSlot = (function() {

        /**
         * Properties of a TradeSlot.
         * @memberof hbonline
         * @interface ITradeSlot
         * @property {number|null} [itemId] TradeSlot itemId
         * @property {string|null} [name] TradeSlot name
         * @property {number|null} [count] TradeSlot count
         * @property {number|null} [slotIndex] TradeSlot slotIndex
         */

        /**
         * Constructs a new TradeSlot.
         * @memberof hbonline
         * @classdesc Represents a TradeSlot.
         * @implements ITradeSlot
         * @constructor
         * @param {hbonline.ITradeSlot=} [properties] Properties to set
         */
        function TradeSlot(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeSlot itemId.
         * @member {number} itemId
         * @memberof hbonline.TradeSlot
         * @instance
         */
        TradeSlot.prototype.itemId = 0;

        /**
         * TradeSlot name.
         * @member {string} name
         * @memberof hbonline.TradeSlot
         * @instance
         */
        TradeSlot.prototype.name = "";

        /**
         * TradeSlot count.
         * @member {number} count
         * @memberof hbonline.TradeSlot
         * @instance
         */
        TradeSlot.prototype.count = 0;

        /**
         * TradeSlot slotIndex.
         * @member {number} slotIndex
         * @memberof hbonline.TradeSlot
         * @instance
         */
        TradeSlot.prototype.slotIndex = 0;

        /**
         * Creates a new TradeSlot instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeSlot
         * @static
         * @param {hbonline.ITradeSlot=} [properties] Properties to set
         * @returns {hbonline.TradeSlot} TradeSlot instance
         */
        TradeSlot.create = function create(properties) {
            return new TradeSlot(properties);
        };

        /**
         * Encodes the specified TradeSlot message. Does not implicitly {@link hbonline.TradeSlot.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeSlot
         * @static
         * @param {hbonline.ITradeSlot} message TradeSlot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeSlot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.itemId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.count);
            if (message.slotIndex != null && Object.hasOwnProperty.call(message, "slotIndex"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.slotIndex);
            return writer;
        };

        /**
         * Decodes a TradeSlot message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeSlot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeSlot} TradeSlot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeSlot.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeSlot();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 2: {
                        message.name = reader.string();
                        break;
                    }
                case 3: {
                        message.count = reader.int32();
                        break;
                    }
                case 4: {
                        message.slotIndex = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeSlot
         * @function getTypeUrl
         * @memberof hbonline.TradeSlot
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeSlot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeSlot";
        };

        return TradeSlot;
    })();

    hbonline.TradeComplete = (function() {

        /**
         * Properties of a TradeComplete.
         * @memberof hbonline
         * @interface ITradeComplete
         * @property {boolean|null} [success] TradeComplete success
         * @property {string|null} [message] TradeComplete message
         */

        /**
         * Constructs a new TradeComplete.
         * @memberof hbonline
         * @classdesc Represents a TradeComplete.
         * @implements ITradeComplete
         * @constructor
         * @param {hbonline.ITradeComplete=} [properties] Properties to set
         */
        function TradeComplete(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TradeComplete success.
         * @member {boolean} success
         * @memberof hbonline.TradeComplete
         * @instance
         */
        TradeComplete.prototype.success = false;

        /**
         * TradeComplete message.
         * @member {string} message
         * @memberof hbonline.TradeComplete
         * @instance
         */
        TradeComplete.prototype.message = "";

        /**
         * Creates a new TradeComplete instance using the specified properties.
         * @function create
         * @memberof hbonline.TradeComplete
         * @static
         * @param {hbonline.ITradeComplete=} [properties] Properties to set
         * @returns {hbonline.TradeComplete} TradeComplete instance
         */
        TradeComplete.create = function create(properties) {
            return new TradeComplete(properties);
        };

        /**
         * Encodes the specified TradeComplete message. Does not implicitly {@link hbonline.TradeComplete.verify|verify} messages.
         * @function encode
         * @memberof hbonline.TradeComplete
         * @static
         * @param {hbonline.ITradeComplete} message TradeComplete message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TradeComplete.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            return writer;
        };

        /**
         * Decodes a TradeComplete message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.TradeComplete
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.TradeComplete} TradeComplete
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TradeComplete.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.TradeComplete();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.success = reader.bool();
                        break;
                    }
                case 2: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for TradeComplete
         * @function getTypeUrl
         * @memberof hbonline.TradeComplete
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TradeComplete.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.TradeComplete";
        };

        return TradeComplete;
    })();

    hbonline.PKStatusUpdate = (function() {

        /**
         * Properties of a PKStatusUpdate.
         * @memberof hbonline
         * @interface IPKStatusUpdate
         * @property {number|null} [pkCount] PKStatusUpdate pkCount
         * @property {number|null} [ekCount] PKStatusUpdate ekCount
         * @property {boolean|null} [criminal] PKStatusUpdate criminal
         * @property {number|null} [criminalTimer] PKStatusUpdate criminalTimer
         */

        /**
         * Constructs a new PKStatusUpdate.
         * @memberof hbonline
         * @classdesc Represents a PKStatusUpdate.
         * @implements IPKStatusUpdate
         * @constructor
         * @param {hbonline.IPKStatusUpdate=} [properties] Properties to set
         */
        function PKStatusUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PKStatusUpdate pkCount.
         * @member {number} pkCount
         * @memberof hbonline.PKStatusUpdate
         * @instance
         */
        PKStatusUpdate.prototype.pkCount = 0;

        /**
         * PKStatusUpdate ekCount.
         * @member {number} ekCount
         * @memberof hbonline.PKStatusUpdate
         * @instance
         */
        PKStatusUpdate.prototype.ekCount = 0;

        /**
         * PKStatusUpdate criminal.
         * @member {boolean} criminal
         * @memberof hbonline.PKStatusUpdate
         * @instance
         */
        PKStatusUpdate.prototype.criminal = false;

        /**
         * PKStatusUpdate criminalTimer.
         * @member {number} criminalTimer
         * @memberof hbonline.PKStatusUpdate
         * @instance
         */
        PKStatusUpdate.prototype.criminalTimer = 0;

        /**
         * Creates a new PKStatusUpdate instance using the specified properties.
         * @function create
         * @memberof hbonline.PKStatusUpdate
         * @static
         * @param {hbonline.IPKStatusUpdate=} [properties] Properties to set
         * @returns {hbonline.PKStatusUpdate} PKStatusUpdate instance
         */
        PKStatusUpdate.create = function create(properties) {
            return new PKStatusUpdate(properties);
        };

        /**
         * Encodes the specified PKStatusUpdate message. Does not implicitly {@link hbonline.PKStatusUpdate.verify|verify} messages.
         * @function encode
         * @memberof hbonline.PKStatusUpdate
         * @static
         * @param {hbonline.IPKStatusUpdate} message PKStatusUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PKStatusUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pkCount != null && Object.hasOwnProperty.call(message, "pkCount"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pkCount);
            if (message.ekCount != null && Object.hasOwnProperty.call(message, "ekCount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.ekCount);
            if (message.criminal != null && Object.hasOwnProperty.call(message, "criminal"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.criminal);
            if (message.criminalTimer != null && Object.hasOwnProperty.call(message, "criminalTimer"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.criminalTimer);
            return writer;
        };

        /**
         * Decodes a PKStatusUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof hbonline.PKStatusUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {hbonline.PKStatusUpdate} PKStatusUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PKStatusUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.hbonline.PKStatusUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.pkCount = reader.int32();
                        break;
                    }
                case 2: {
                        message.ekCount = reader.int32();
                        break;
                    }
                case 3: {
                        message.criminal = reader.bool();
                        break;
                    }
                case 4: {
                        message.criminalTimer = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Gets the default type url for PKStatusUpdate
         * @function getTypeUrl
         * @memberof hbonline.PKStatusUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PKStatusUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/hbonline.PKStatusUpdate";
        };

        return PKStatusUpdate;
    })();

    return hbonline;
})();

export { $root as default };
