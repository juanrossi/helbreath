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
         * Encodes the specified Vec2 message, length delimited. Does not implicitly {@link hbonline.Vec2.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.Vec2
         * @static
         * @param {hbonline.IVec2} message Vec2 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Vec2.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a Vec2 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.Vec2
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.Vec2} Vec2
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Vec2.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Vec2 message.
         * @function verify
         * @memberof hbonline.Vec2
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Vec2.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            return null;
        };

        /**
         * Creates a Vec2 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.Vec2
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.Vec2} Vec2
         */
        Vec2.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.Vec2)
                return object;
            let message = new $root.hbonline.Vec2();
            if (object.x != null)
                message.x = object.x | 0;
            if (object.y != null)
                message.y = object.y | 0;
            return message;
        };

        /**
         * Creates a plain object from a Vec2 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.Vec2
         * @static
         * @param {hbonline.Vec2} message Vec2
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Vec2.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.x = 0;
                object.y = 0;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            return object;
        };

        /**
         * Converts this Vec2 to JSON.
         * @function toJSON
         * @memberof hbonline.Vec2
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Vec2.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified Appearance message, length delimited. Does not implicitly {@link hbonline.Appearance.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.Appearance
         * @static
         * @param {hbonline.IAppearance} message Appearance message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Appearance.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes an Appearance message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.Appearance
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.Appearance} Appearance
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Appearance.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Appearance message.
         * @function verify
         * @memberof hbonline.Appearance
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Appearance.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gender != null && message.hasOwnProperty("gender"))
                if (!$util.isInteger(message.gender))
                    return "gender: integer expected";
            if (message.skinColor != null && message.hasOwnProperty("skinColor"))
                if (!$util.isInteger(message.skinColor))
                    return "skinColor: integer expected";
            if (message.hairStyle != null && message.hasOwnProperty("hairStyle"))
                if (!$util.isInteger(message.hairStyle))
                    return "hairStyle: integer expected";
            if (message.hairColor != null && message.hasOwnProperty("hairColor"))
                if (!$util.isInteger(message.hairColor))
                    return "hairColor: integer expected";
            if (message.underwearColor != null && message.hasOwnProperty("underwearColor"))
                if (!$util.isInteger(message.underwearColor))
                    return "underwearColor: integer expected";
            if (message.bodyArmor != null && message.hasOwnProperty("bodyArmor"))
                if (!$util.isInteger(message.bodyArmor))
                    return "bodyArmor: integer expected";
            if (message.armArmor != null && message.hasOwnProperty("armArmor"))
                if (!$util.isInteger(message.armArmor))
                    return "armArmor: integer expected";
            if (message.leggings != null && message.hasOwnProperty("leggings"))
                if (!$util.isInteger(message.leggings))
                    return "leggings: integer expected";
            if (message.helm != null && message.hasOwnProperty("helm"))
                if (!$util.isInteger(message.helm))
                    return "helm: integer expected";
            if (message.weapon != null && message.hasOwnProperty("weapon"))
                if (!$util.isInteger(message.weapon))
                    return "weapon: integer expected";
            if (message.shield != null && message.hasOwnProperty("shield"))
                if (!$util.isInteger(message.shield))
                    return "shield: integer expected";
            if (message.cape != null && message.hasOwnProperty("cape"))
                if (!$util.isInteger(message.cape))
                    return "cape: integer expected";
            if (message.boots != null && message.hasOwnProperty("boots"))
                if (!$util.isInteger(message.boots))
                    return "boots: integer expected";
            if (message.apprColor != null && message.hasOwnProperty("apprColor"))
                if (!$util.isInteger(message.apprColor))
                    return "apprColor: integer expected";
            return null;
        };

        /**
         * Creates an Appearance message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.Appearance
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.Appearance} Appearance
         */
        Appearance.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.Appearance)
                return object;
            let message = new $root.hbonline.Appearance();
            if (object.gender != null)
                message.gender = object.gender | 0;
            if (object.skinColor != null)
                message.skinColor = object.skinColor | 0;
            if (object.hairStyle != null)
                message.hairStyle = object.hairStyle | 0;
            if (object.hairColor != null)
                message.hairColor = object.hairColor | 0;
            if (object.underwearColor != null)
                message.underwearColor = object.underwearColor | 0;
            if (object.bodyArmor != null)
                message.bodyArmor = object.bodyArmor | 0;
            if (object.armArmor != null)
                message.armArmor = object.armArmor | 0;
            if (object.leggings != null)
                message.leggings = object.leggings | 0;
            if (object.helm != null)
                message.helm = object.helm | 0;
            if (object.weapon != null)
                message.weapon = object.weapon | 0;
            if (object.shield != null)
                message.shield = object.shield | 0;
            if (object.cape != null)
                message.cape = object.cape | 0;
            if (object.boots != null)
                message.boots = object.boots | 0;
            if (object.apprColor != null)
                message.apprColor = object.apprColor | 0;
            return message;
        };

        /**
         * Creates a plain object from an Appearance message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.Appearance
         * @static
         * @param {hbonline.Appearance} message Appearance
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Appearance.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.gender = 0;
                object.skinColor = 0;
                object.hairStyle = 0;
                object.hairColor = 0;
                object.underwearColor = 0;
                object.bodyArmor = 0;
                object.armArmor = 0;
                object.leggings = 0;
                object.helm = 0;
                object.weapon = 0;
                object.shield = 0;
                object.cape = 0;
                object.boots = 0;
                object.apprColor = 0;
            }
            if (message.gender != null && message.hasOwnProperty("gender"))
                object.gender = message.gender;
            if (message.skinColor != null && message.hasOwnProperty("skinColor"))
                object.skinColor = message.skinColor;
            if (message.hairStyle != null && message.hasOwnProperty("hairStyle"))
                object.hairStyle = message.hairStyle;
            if (message.hairColor != null && message.hasOwnProperty("hairColor"))
                object.hairColor = message.hairColor;
            if (message.underwearColor != null && message.hasOwnProperty("underwearColor"))
                object.underwearColor = message.underwearColor;
            if (message.bodyArmor != null && message.hasOwnProperty("bodyArmor"))
                object.bodyArmor = message.bodyArmor;
            if (message.armArmor != null && message.hasOwnProperty("armArmor"))
                object.armArmor = message.armArmor;
            if (message.leggings != null && message.hasOwnProperty("leggings"))
                object.leggings = message.leggings;
            if (message.helm != null && message.hasOwnProperty("helm"))
                object.helm = message.helm;
            if (message.weapon != null && message.hasOwnProperty("weapon"))
                object.weapon = message.weapon;
            if (message.shield != null && message.hasOwnProperty("shield"))
                object.shield = message.shield;
            if (message.cape != null && message.hasOwnProperty("cape"))
                object.cape = message.cape;
            if (message.boots != null && message.hasOwnProperty("boots"))
                object.boots = message.boots;
            if (message.apprColor != null && message.hasOwnProperty("apprColor"))
                object.apprColor = message.apprColor;
            return object;
        };

        /**
         * Converts this Appearance to JSON.
         * @function toJSON
         * @memberof hbonline.Appearance
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Appearance.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link hbonline.LoginRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.LoginRequest
         * @static
         * @param {hbonline.ILoginRequest} message LoginRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.LoginRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.LoginRequest} LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginRequest message.
         * @function verify
         * @memberof hbonline.LoginRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            if (message.register != null && message.hasOwnProperty("register"))
                if (typeof message.register !== "boolean")
                    return "register: boolean expected";
            return null;
        };

        /**
         * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.LoginRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.LoginRequest} LoginRequest
         */
        LoginRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.LoginRequest)
                return object;
            let message = new $root.hbonline.LoginRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.password != null)
                message.password = String(object.password);
            if (object.register != null)
                message.register = Boolean(object.register);
            return message;
        };

        /**
         * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.LoginRequest
         * @static
         * @param {hbonline.LoginRequest} message LoginRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.username = "";
                object.password = "";
                object.register = false;
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            if (message.register != null && message.hasOwnProperty("register"))
                object.register = message.register;
            return object;
        };

        /**
         * Converts this LoginRequest to JSON.
         * @function toJSON
         * @memberof hbonline.LoginRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
            return writer;
        };

        /**
         * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link hbonline.LoginResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.LoginResponse
         * @static
         * @param {hbonline.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginResponse message.
         * @function verify
         * @memberof hbonline.LoginResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.characters != null && message.hasOwnProperty("characters")) {
                if (!Array.isArray(message.characters))
                    return "characters: array expected";
                for (let i = 0; i < message.characters.length; ++i) {
                    let error = $root.hbonline.CharacterSummary.verify(message.characters[i]);
                    if (error)
                        return "characters." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.LoginResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.LoginResponse} LoginResponse
         */
        LoginResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.LoginResponse)
                return object;
            let message = new $root.hbonline.LoginResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.error != null)
                message.error = String(object.error);
            if (object.characters) {
                if (!Array.isArray(object.characters))
                    throw TypeError(".hbonline.LoginResponse.characters: array expected");
                message.characters = [];
                for (let i = 0; i < object.characters.length; ++i) {
                    if (typeof object.characters[i] !== "object")
                        throw TypeError(".hbonline.LoginResponse.characters: object expected");
                    message.characters[i] = $root.hbonline.CharacterSummary.fromObject(object.characters[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.LoginResponse
         * @static
         * @param {hbonline.LoginResponse} message LoginResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.characters = [];
            if (options.defaults) {
                object.success = false;
                object.error = "";
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.characters && message.characters.length) {
                object.characters = [];
                for (let j = 0; j < message.characters.length; ++j)
                    object.characters[j] = $root.hbonline.CharacterSummary.toObject(message.characters[j], options);
            }
            return object;
        };

        /**
         * Converts this LoginResponse to JSON.
         * @function toJSON
         * @memberof hbonline.LoginResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified CharacterSummary message, length delimited. Does not implicitly {@link hbonline.CharacterSummary.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {hbonline.ICharacterSummary} message CharacterSummary message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharacterSummary.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a CharacterSummary message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.CharacterSummary} CharacterSummary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharacterSummary.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharacterSummary message.
         * @function verify
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharacterSummary.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.gender != null && message.hasOwnProperty("gender"))
                if (!$util.isInteger(message.gender))
                    return "gender: integer expected";
            if (message.side != null && message.hasOwnProperty("side"))
                if (!$util.isInteger(message.side))
                    return "side: integer expected";
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                if (!$util.isString(message.mapName))
                    return "mapName: string expected";
            if (message.appearance != null && message.hasOwnProperty("appearance")) {
                let error = $root.hbonline.Appearance.verify(message.appearance);
                if (error)
                    return "appearance." + error;
            }
            return null;
        };

        /**
         * Creates a CharacterSummary message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.CharacterSummary} CharacterSummary
         */
        CharacterSummary.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.CharacterSummary)
                return object;
            let message = new $root.hbonline.CharacterSummary();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.level != null)
                message.level = object.level | 0;
            if (object.gender != null)
                message.gender = object.gender | 0;
            if (object.side != null)
                message.side = object.side | 0;
            if (object.mapName != null)
                message.mapName = String(object.mapName);
            if (object.appearance != null) {
                if (typeof object.appearance !== "object")
                    throw TypeError(".hbonline.CharacterSummary.appearance: object expected");
                message.appearance = $root.hbonline.Appearance.fromObject(object.appearance);
            }
            return message;
        };

        /**
         * Creates a plain object from a CharacterSummary message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.CharacterSummary
         * @static
         * @param {hbonline.CharacterSummary} message CharacterSummary
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharacterSummary.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                object.name = "";
                object.level = 0;
                object.gender = 0;
                object.side = 0;
                object.mapName = "";
                object.appearance = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.gender != null && message.hasOwnProperty("gender"))
                object.gender = message.gender;
            if (message.side != null && message.hasOwnProperty("side"))
                object.side = message.side;
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                object.mapName = message.mapName;
            if (message.appearance != null && message.hasOwnProperty("appearance"))
                object.appearance = $root.hbonline.Appearance.toObject(message.appearance, options);
            return object;
        };

        /**
         * Converts this CharacterSummary to JSON.
         * @function toJSON
         * @memberof hbonline.CharacterSummary
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharacterSummary.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified CreateCharacterRequest message, length delimited. Does not implicitly {@link hbonline.CreateCharacterRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {hbonline.ICreateCharacterRequest} message CreateCharacterRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCharacterRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a CreateCharacterRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.CreateCharacterRequest} CreateCharacterRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCharacterRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateCharacterRequest message.
         * @function verify
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateCharacterRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.gender != null && message.hasOwnProperty("gender"))
                if (!$util.isInteger(message.gender))
                    return "gender: integer expected";
            if (message.skinColor != null && message.hasOwnProperty("skinColor"))
                if (!$util.isInteger(message.skinColor))
                    return "skinColor: integer expected";
            if (message.hairStyle != null && message.hasOwnProperty("hairStyle"))
                if (!$util.isInteger(message.hairStyle))
                    return "hairStyle: integer expected";
            if (message.hairColor != null && message.hasOwnProperty("hairColor"))
                if (!$util.isInteger(message.hairColor))
                    return "hairColor: integer expected";
            if (message.underwearColor != null && message.hasOwnProperty("underwearColor"))
                if (!$util.isInteger(message.underwearColor))
                    return "underwearColor: integer expected";
            if (message.str != null && message.hasOwnProperty("str"))
                if (!$util.isInteger(message.str))
                    return "str: integer expected";
            if (message.vit != null && message.hasOwnProperty("vit"))
                if (!$util.isInteger(message.vit))
                    return "vit: integer expected";
            if (message.dex != null && message.hasOwnProperty("dex"))
                if (!$util.isInteger(message.dex))
                    return "dex: integer expected";
            if (message.intStat != null && message.hasOwnProperty("intStat"))
                if (!$util.isInteger(message.intStat))
                    return "intStat: integer expected";
            if (message.mag != null && message.hasOwnProperty("mag"))
                if (!$util.isInteger(message.mag))
                    return "mag: integer expected";
            if (message.charisma != null && message.hasOwnProperty("charisma"))
                if (!$util.isInteger(message.charisma))
                    return "charisma: integer expected";
            return null;
        };

        /**
         * Creates a CreateCharacterRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.CreateCharacterRequest} CreateCharacterRequest
         */
        CreateCharacterRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.CreateCharacterRequest)
                return object;
            let message = new $root.hbonline.CreateCharacterRequest();
            if (object.name != null)
                message.name = String(object.name);
            if (object.gender != null)
                message.gender = object.gender | 0;
            if (object.skinColor != null)
                message.skinColor = object.skinColor | 0;
            if (object.hairStyle != null)
                message.hairStyle = object.hairStyle | 0;
            if (object.hairColor != null)
                message.hairColor = object.hairColor | 0;
            if (object.underwearColor != null)
                message.underwearColor = object.underwearColor | 0;
            if (object.str != null)
                message.str = object.str | 0;
            if (object.vit != null)
                message.vit = object.vit | 0;
            if (object.dex != null)
                message.dex = object.dex | 0;
            if (object.intStat != null)
                message.intStat = object.intStat | 0;
            if (object.mag != null)
                message.mag = object.mag | 0;
            if (object.charisma != null)
                message.charisma = object.charisma | 0;
            return message;
        };

        /**
         * Creates a plain object from a CreateCharacterRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.CreateCharacterRequest
         * @static
         * @param {hbonline.CreateCharacterRequest} message CreateCharacterRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateCharacterRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.name = "";
                object.gender = 0;
                object.skinColor = 0;
                object.hairStyle = 0;
                object.hairColor = 0;
                object.underwearColor = 0;
                object.str = 0;
                object.vit = 0;
                object.dex = 0;
                object.intStat = 0;
                object.mag = 0;
                object.charisma = 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.gender != null && message.hasOwnProperty("gender"))
                object.gender = message.gender;
            if (message.skinColor != null && message.hasOwnProperty("skinColor"))
                object.skinColor = message.skinColor;
            if (message.hairStyle != null && message.hasOwnProperty("hairStyle"))
                object.hairStyle = message.hairStyle;
            if (message.hairColor != null && message.hasOwnProperty("hairColor"))
                object.hairColor = message.hairColor;
            if (message.underwearColor != null && message.hasOwnProperty("underwearColor"))
                object.underwearColor = message.underwearColor;
            if (message.str != null && message.hasOwnProperty("str"))
                object.str = message.str;
            if (message.vit != null && message.hasOwnProperty("vit"))
                object.vit = message.vit;
            if (message.dex != null && message.hasOwnProperty("dex"))
                object.dex = message.dex;
            if (message.intStat != null && message.hasOwnProperty("intStat"))
                object.intStat = message.intStat;
            if (message.mag != null && message.hasOwnProperty("mag"))
                object.mag = message.mag;
            if (message.charisma != null && message.hasOwnProperty("charisma"))
                object.charisma = message.charisma;
            return object;
        };

        /**
         * Converts this CreateCharacterRequest to JSON.
         * @function toJSON
         * @memberof hbonline.CreateCharacterRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateCharacterRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified CreateCharacterResponse message, length delimited. Does not implicitly {@link hbonline.CreateCharacterResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {hbonline.ICreateCharacterResponse} message CreateCharacterResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCharacterResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a CreateCharacterResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.CreateCharacterResponse} CreateCharacterResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCharacterResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateCharacterResponse message.
         * @function verify
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateCharacterResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.characters != null && message.hasOwnProperty("characters")) {
                if (!Array.isArray(message.characters))
                    return "characters: array expected";
                for (let i = 0; i < message.characters.length; ++i) {
                    let error = $root.hbonline.CharacterSummary.verify(message.characters[i]);
                    if (error)
                        return "characters." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CreateCharacterResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.CreateCharacterResponse} CreateCharacterResponse
         */
        CreateCharacterResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.CreateCharacterResponse)
                return object;
            let message = new $root.hbonline.CreateCharacterResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.error != null)
                message.error = String(object.error);
            if (object.characters) {
                if (!Array.isArray(object.characters))
                    throw TypeError(".hbonline.CreateCharacterResponse.characters: array expected");
                message.characters = [];
                for (let i = 0; i < object.characters.length; ++i) {
                    if (typeof object.characters[i] !== "object")
                        throw TypeError(".hbonline.CreateCharacterResponse.characters: object expected");
                    message.characters[i] = $root.hbonline.CharacterSummary.fromObject(object.characters[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateCharacterResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.CreateCharacterResponse
         * @static
         * @param {hbonline.CreateCharacterResponse} message CreateCharacterResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateCharacterResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.characters = [];
            if (options.defaults) {
                object.success = false;
                object.error = "";
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.characters && message.characters.length) {
                object.characters = [];
                for (let j = 0; j < message.characters.length; ++j)
                    object.characters[j] = $root.hbonline.CharacterSummary.toObject(message.characters[j], options);
            }
            return object;
        };

        /**
         * Converts this CreateCharacterResponse to JSON.
         * @function toJSON
         * @memberof hbonline.CreateCharacterResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateCharacterResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified EnterGameRequest message, length delimited. Does not implicitly {@link hbonline.EnterGameRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {hbonline.IEnterGameRequest} message EnterGameRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes an EnterGameRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.EnterGameRequest} EnterGameRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterGameRequest message.
         * @function verify
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterGameRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.characterId != null && message.hasOwnProperty("characterId"))
                if (!$util.isInteger(message.characterId))
                    return "characterId: integer expected";
            return null;
        };

        /**
         * Creates an EnterGameRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.EnterGameRequest} EnterGameRequest
         */
        EnterGameRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.EnterGameRequest)
                return object;
            let message = new $root.hbonline.EnterGameRequest();
            if (object.characterId != null)
                message.characterId = object.characterId | 0;
            return message;
        };

        /**
         * Creates a plain object from an EnterGameRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.EnterGameRequest
         * @static
         * @param {hbonline.EnterGameRequest} message EnterGameRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterGameRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.characterId = 0;
            if (message.characterId != null && message.hasOwnProperty("characterId"))
                object.characterId = message.characterId;
            return object;
        };

        /**
         * Converts this EnterGameRequest to JSON.
         * @function toJSON
         * @memberof hbonline.EnterGameRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterGameRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified DeleteCharacterRequest message, length delimited. Does not implicitly {@link hbonline.DeleteCharacterRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {hbonline.IDeleteCharacterRequest} message DeleteCharacterRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCharacterRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a DeleteCharacterRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.DeleteCharacterRequest} DeleteCharacterRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCharacterRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeleteCharacterRequest message.
         * @function verify
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeleteCharacterRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.characterId != null && message.hasOwnProperty("characterId"))
                if (!$util.isInteger(message.characterId))
                    return "characterId: integer expected";
            return null;
        };

        /**
         * Creates a DeleteCharacterRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.DeleteCharacterRequest} DeleteCharacterRequest
         */
        DeleteCharacterRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.DeleteCharacterRequest)
                return object;
            let message = new $root.hbonline.DeleteCharacterRequest();
            if (object.characterId != null)
                message.characterId = object.characterId | 0;
            return message;
        };

        /**
         * Creates a plain object from a DeleteCharacterRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.DeleteCharacterRequest
         * @static
         * @param {hbonline.DeleteCharacterRequest} message DeleteCharacterRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeleteCharacterRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.characterId = 0;
            if (message.characterId != null && message.hasOwnProperty("characterId"))
                object.characterId = message.characterId;
            return object;
        };

        /**
         * Converts this DeleteCharacterRequest to JSON.
         * @function toJSON
         * @memberof hbonline.DeleteCharacterRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeleteCharacterRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified DeleteCharacterResponse message, length delimited. Does not implicitly {@link hbonline.DeleteCharacterResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {hbonline.IDeleteCharacterResponse} message DeleteCharacterResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCharacterResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a DeleteCharacterResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.DeleteCharacterResponse} DeleteCharacterResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCharacterResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeleteCharacterResponse message.
         * @function verify
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeleteCharacterResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.characters != null && message.hasOwnProperty("characters")) {
                if (!Array.isArray(message.characters))
                    return "characters: array expected";
                for (let i = 0; i < message.characters.length; ++i) {
                    let error = $root.hbonline.CharacterSummary.verify(message.characters[i]);
                    if (error)
                        return "characters." + error;
                }
            }
            return null;
        };

        /**
         * Creates a DeleteCharacterResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.DeleteCharacterResponse} DeleteCharacterResponse
         */
        DeleteCharacterResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.DeleteCharacterResponse)
                return object;
            let message = new $root.hbonline.DeleteCharacterResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.error != null)
                message.error = String(object.error);
            if (object.characters) {
                if (!Array.isArray(object.characters))
                    throw TypeError(".hbonline.DeleteCharacterResponse.characters: array expected");
                message.characters = [];
                for (let i = 0; i < object.characters.length; ++i) {
                    if (typeof object.characters[i] !== "object")
                        throw TypeError(".hbonline.DeleteCharacterResponse.characters: object expected");
                    message.characters[i] = $root.hbonline.CharacterSummary.fromObject(object.characters[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a DeleteCharacterResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.DeleteCharacterResponse
         * @static
         * @param {hbonline.DeleteCharacterResponse} message DeleteCharacterResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeleteCharacterResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.characters = [];
            if (options.defaults) {
                object.success = false;
                object.error = "";
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.characters && message.characters.length) {
                object.characters = [];
                for (let j = 0; j < message.characters.length; ++j)
                    object.characters[j] = $root.hbonline.CharacterSummary.toObject(message.characters[j], options);
            }
            return object;
        };

        /**
         * Converts this DeleteCharacterResponse to JSON.
         * @function toJSON
         * @memberof hbonline.DeleteCharacterResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeleteCharacterResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified EnterGameResponse message, length delimited. Does not implicitly {@link hbonline.EnterGameResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {hbonline.IEnterGameResponse} message EnterGameResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterGameResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes an EnterGameResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.EnterGameResponse} EnterGameResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterGameResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterGameResponse message.
         * @function verify
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterGameResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.player != null && message.hasOwnProperty("player")) {
                let error = $root.hbonline.PlayerContents.verify(message.player);
                if (error)
                    return "player." + error;
            }
            if (message.mapInfo != null && message.hasOwnProperty("mapInfo")) {
                let error = $root.hbonline.MapInfo.verify(message.mapInfo);
                if (error)
                    return "mapInfo." + error;
            }
            if (message.nearbyPlayers != null && message.hasOwnProperty("nearbyPlayers")) {
                if (!Array.isArray(message.nearbyPlayers))
                    return "nearbyPlayers: array expected";
                for (let i = 0; i < message.nearbyPlayers.length; ++i) {
                    let error = $root.hbonline.EntityInfo.verify(message.nearbyPlayers[i]);
                    if (error)
                        return "nearbyPlayers." + error;
                }
            }
            if (message.nearbyNpcs != null && message.hasOwnProperty("nearbyNpcs")) {
                if (!Array.isArray(message.nearbyNpcs))
                    return "nearbyNpcs: array expected";
                for (let i = 0; i < message.nearbyNpcs.length; ++i) {
                    let error = $root.hbonline.EntityInfo.verify(message.nearbyNpcs[i]);
                    if (error)
                        return "nearbyNpcs." + error;
                }
            }
            return null;
        };

        /**
         * Creates an EnterGameResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.EnterGameResponse} EnterGameResponse
         */
        EnterGameResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.EnterGameResponse)
                return object;
            let message = new $root.hbonline.EnterGameResponse();
            if (object.player != null) {
                if (typeof object.player !== "object")
                    throw TypeError(".hbonline.EnterGameResponse.player: object expected");
                message.player = $root.hbonline.PlayerContents.fromObject(object.player);
            }
            if (object.mapInfo != null) {
                if (typeof object.mapInfo !== "object")
                    throw TypeError(".hbonline.EnterGameResponse.mapInfo: object expected");
                message.mapInfo = $root.hbonline.MapInfo.fromObject(object.mapInfo);
            }
            if (object.nearbyPlayers) {
                if (!Array.isArray(object.nearbyPlayers))
                    throw TypeError(".hbonline.EnterGameResponse.nearbyPlayers: array expected");
                message.nearbyPlayers = [];
                for (let i = 0; i < object.nearbyPlayers.length; ++i) {
                    if (typeof object.nearbyPlayers[i] !== "object")
                        throw TypeError(".hbonline.EnterGameResponse.nearbyPlayers: object expected");
                    message.nearbyPlayers[i] = $root.hbonline.EntityInfo.fromObject(object.nearbyPlayers[i]);
                }
            }
            if (object.nearbyNpcs) {
                if (!Array.isArray(object.nearbyNpcs))
                    throw TypeError(".hbonline.EnterGameResponse.nearbyNpcs: array expected");
                message.nearbyNpcs = [];
                for (let i = 0; i < object.nearbyNpcs.length; ++i) {
                    if (typeof object.nearbyNpcs[i] !== "object")
                        throw TypeError(".hbonline.EnterGameResponse.nearbyNpcs: object expected");
                    message.nearbyNpcs[i] = $root.hbonline.EntityInfo.fromObject(object.nearbyNpcs[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an EnterGameResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.EnterGameResponse
         * @static
         * @param {hbonline.EnterGameResponse} message EnterGameResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterGameResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.nearbyPlayers = [];
                object.nearbyNpcs = [];
            }
            if (options.defaults) {
                object.player = null;
                object.mapInfo = null;
            }
            if (message.player != null && message.hasOwnProperty("player"))
                object.player = $root.hbonline.PlayerContents.toObject(message.player, options);
            if (message.mapInfo != null && message.hasOwnProperty("mapInfo"))
                object.mapInfo = $root.hbonline.MapInfo.toObject(message.mapInfo, options);
            if (message.nearbyPlayers && message.nearbyPlayers.length) {
                object.nearbyPlayers = [];
                for (let j = 0; j < message.nearbyPlayers.length; ++j)
                    object.nearbyPlayers[j] = $root.hbonline.EntityInfo.toObject(message.nearbyPlayers[j], options);
            }
            if (message.nearbyNpcs && message.nearbyNpcs.length) {
                object.nearbyNpcs = [];
                for (let j = 0; j < message.nearbyNpcs.length; ++j)
                    object.nearbyNpcs[j] = $root.hbonline.EntityInfo.toObject(message.nearbyNpcs[j], options);
            }
            return object;
        };

        /**
         * Converts this EnterGameResponse to JSON.
         * @function toJSON
         * @memberof hbonline.EnterGameResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterGameResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
            return writer;
        };

        /**
         * Encodes the specified PlayerContents message, length delimited. Does not implicitly {@link hbonline.PlayerContents.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.PlayerContents
         * @static
         * @param {hbonline.IPlayerContents} message PlayerContents message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerContents.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerContents message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.PlayerContents
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.PlayerContents} PlayerContents
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerContents.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerContents message.
         * @function verify
         * @memberof hbonline.PlayerContents
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerContents.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                if (!$util.isString(message.mapName))
                    return "mapName: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.appearance != null && message.hasOwnProperty("appearance")) {
                let error = $root.hbonline.Appearance.verify(message.appearance);
                if (error)
                    return "appearance." + error;
            }
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.experience != null && message.hasOwnProperty("experience"))
                if (!$util.isInteger(message.experience) && !(message.experience && $util.isInteger(message.experience.low) && $util.isInteger(message.experience.high)))
                    return "experience: integer|Long expected";
            if (message.hp != null && message.hasOwnProperty("hp"))
                if (!$util.isInteger(message.hp))
                    return "hp: integer expected";
            if (message.maxHp != null && message.hasOwnProperty("maxHp"))
                if (!$util.isInteger(message.maxHp))
                    return "maxHp: integer expected";
            if (message.mp != null && message.hasOwnProperty("mp"))
                if (!$util.isInteger(message.mp))
                    return "mp: integer expected";
            if (message.maxMp != null && message.hasOwnProperty("maxMp"))
                if (!$util.isInteger(message.maxMp))
                    return "maxMp: integer expected";
            if (message.sp != null && message.hasOwnProperty("sp"))
                if (!$util.isInteger(message.sp))
                    return "sp: integer expected";
            if (message.maxSp != null && message.hasOwnProperty("maxSp"))
                if (!$util.isInteger(message.maxSp))
                    return "maxSp: integer expected";
            if (message.str != null && message.hasOwnProperty("str"))
                if (!$util.isInteger(message.str))
                    return "str: integer expected";
            if (message.vit != null && message.hasOwnProperty("vit"))
                if (!$util.isInteger(message.vit))
                    return "vit: integer expected";
            if (message.dex != null && message.hasOwnProperty("dex"))
                if (!$util.isInteger(message.dex))
                    return "dex: integer expected";
            if (message.intStat != null && message.hasOwnProperty("intStat"))
                if (!$util.isInteger(message.intStat))
                    return "intStat: integer expected";
            if (message.mag != null && message.hasOwnProperty("mag"))
                if (!$util.isInteger(message.mag))
                    return "mag: integer expected";
            if (message.charisma != null && message.hasOwnProperty("charisma"))
                if (!$util.isInteger(message.charisma))
                    return "charisma: integer expected";
            if (message.luPool != null && message.hasOwnProperty("luPool"))
                if (!$util.isInteger(message.luPool))
                    return "luPool: integer expected";
            if (message.side != null && message.hasOwnProperty("side"))
                if (!$util.isInteger(message.side))
                    return "side: integer expected";
            if (message.gold != null && message.hasOwnProperty("gold"))
                if (!$util.isInteger(message.gold) && !(message.gold && $util.isInteger(message.gold.low) && $util.isInteger(message.gold.high)))
                    return "gold: integer|Long expected";
            if (message.pkCount != null && message.hasOwnProperty("pkCount"))
                if (!$util.isInteger(message.pkCount))
                    return "pkCount: integer expected";
            if (message.ekCount != null && message.hasOwnProperty("ekCount"))
                if (!$util.isInteger(message.ekCount))
                    return "ekCount: integer expected";
            if (message.hunger != null && message.hasOwnProperty("hunger"))
                if (!$util.isInteger(message.hunger))
                    return "hunger: integer expected";
            if (message.adminLevel != null && message.hasOwnProperty("adminLevel"))
                if (!$util.isInteger(message.adminLevel))
                    return "adminLevel: integer expected";
            return null;
        };

        /**
         * Creates a PlayerContents message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.PlayerContents
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.PlayerContents} PlayerContents
         */
        PlayerContents.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.PlayerContents)
                return object;
            let message = new $root.hbonline.PlayerContents();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.mapName != null)
                message.mapName = String(object.mapName);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.PlayerContents.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.appearance != null) {
                if (typeof object.appearance !== "object")
                    throw TypeError(".hbonline.PlayerContents.appearance: object expected");
                message.appearance = $root.hbonline.Appearance.fromObject(object.appearance);
            }
            if (object.level != null)
                message.level = object.level | 0;
            if (object.experience != null)
                if ($util.Long)
                    (message.experience = $util.Long.fromValue(object.experience)).unsigned = false;
                else if (typeof object.experience === "string")
                    message.experience = parseInt(object.experience, 10);
                else if (typeof object.experience === "number")
                    message.experience = object.experience;
                else if (typeof object.experience === "object")
                    message.experience = new $util.LongBits(object.experience.low >>> 0, object.experience.high >>> 0).toNumber();
            if (object.hp != null)
                message.hp = object.hp | 0;
            if (object.maxHp != null)
                message.maxHp = object.maxHp | 0;
            if (object.mp != null)
                message.mp = object.mp | 0;
            if (object.maxMp != null)
                message.maxMp = object.maxMp | 0;
            if (object.sp != null)
                message.sp = object.sp | 0;
            if (object.maxSp != null)
                message.maxSp = object.maxSp | 0;
            if (object.str != null)
                message.str = object.str | 0;
            if (object.vit != null)
                message.vit = object.vit | 0;
            if (object.dex != null)
                message.dex = object.dex | 0;
            if (object.intStat != null)
                message.intStat = object.intStat | 0;
            if (object.mag != null)
                message.mag = object.mag | 0;
            if (object.charisma != null)
                message.charisma = object.charisma | 0;
            if (object.luPool != null)
                message.luPool = object.luPool | 0;
            if (object.side != null)
                message.side = object.side | 0;
            if (object.gold != null)
                if ($util.Long)
                    (message.gold = $util.Long.fromValue(object.gold)).unsigned = false;
                else if (typeof object.gold === "string")
                    message.gold = parseInt(object.gold, 10);
                else if (typeof object.gold === "number")
                    message.gold = object.gold;
                else if (typeof object.gold === "object")
                    message.gold = new $util.LongBits(object.gold.low >>> 0, object.gold.high >>> 0).toNumber();
            if (object.pkCount != null)
                message.pkCount = object.pkCount | 0;
            if (object.ekCount != null)
                message.ekCount = object.ekCount | 0;
            if (object.hunger != null)
                message.hunger = object.hunger | 0;
            if (object.adminLevel != null)
                message.adminLevel = object.adminLevel | 0;
            return message;
        };

        /**
         * Creates a plain object from a PlayerContents message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.PlayerContents
         * @static
         * @param {hbonline.PlayerContents} message PlayerContents
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerContents.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.name = "";
                object.mapName = "";
                object.position = null;
                object.direction = 0;
                object.appearance = null;
                object.level = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.experience = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.experience = options.longs === String ? "0" : 0;
                object.hp = 0;
                object.maxHp = 0;
                object.mp = 0;
                object.maxMp = 0;
                object.sp = 0;
                object.maxSp = 0;
                object.str = 0;
                object.vit = 0;
                object.dex = 0;
                object.intStat = 0;
                object.mag = 0;
                object.charisma = 0;
                object.luPool = 0;
                object.side = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.gold = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.gold = options.longs === String ? "0" : 0;
                object.pkCount = 0;
                object.ekCount = 0;
                object.hunger = 0;
                object.adminLevel = 0;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                object.mapName = message.mapName;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.appearance != null && message.hasOwnProperty("appearance"))
                object.appearance = $root.hbonline.Appearance.toObject(message.appearance, options);
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.experience != null && message.hasOwnProperty("experience"))
                if (typeof message.experience === "number")
                    object.experience = options.longs === String ? String(message.experience) : message.experience;
                else
                    object.experience = options.longs === String ? $util.Long.prototype.toString.call(message.experience) : options.longs === Number ? new $util.LongBits(message.experience.low >>> 0, message.experience.high >>> 0).toNumber() : message.experience;
            if (message.hp != null && message.hasOwnProperty("hp"))
                object.hp = message.hp;
            if (message.maxHp != null && message.hasOwnProperty("maxHp"))
                object.maxHp = message.maxHp;
            if (message.mp != null && message.hasOwnProperty("mp"))
                object.mp = message.mp;
            if (message.maxMp != null && message.hasOwnProperty("maxMp"))
                object.maxMp = message.maxMp;
            if (message.sp != null && message.hasOwnProperty("sp"))
                object.sp = message.sp;
            if (message.maxSp != null && message.hasOwnProperty("maxSp"))
                object.maxSp = message.maxSp;
            if (message.str != null && message.hasOwnProperty("str"))
                object.str = message.str;
            if (message.vit != null && message.hasOwnProperty("vit"))
                object.vit = message.vit;
            if (message.dex != null && message.hasOwnProperty("dex"))
                object.dex = message.dex;
            if (message.intStat != null && message.hasOwnProperty("intStat"))
                object.intStat = message.intStat;
            if (message.mag != null && message.hasOwnProperty("mag"))
                object.mag = message.mag;
            if (message.charisma != null && message.hasOwnProperty("charisma"))
                object.charisma = message.charisma;
            if (message.luPool != null && message.hasOwnProperty("luPool"))
                object.luPool = message.luPool;
            if (message.side != null && message.hasOwnProperty("side"))
                object.side = message.side;
            if (message.gold != null && message.hasOwnProperty("gold"))
                if (typeof message.gold === "number")
                    object.gold = options.longs === String ? String(message.gold) : message.gold;
                else
                    object.gold = options.longs === String ? $util.Long.prototype.toString.call(message.gold) : options.longs === Number ? new $util.LongBits(message.gold.low >>> 0, message.gold.high >>> 0).toNumber() : message.gold;
            if (message.pkCount != null && message.hasOwnProperty("pkCount"))
                object.pkCount = message.pkCount;
            if (message.ekCount != null && message.hasOwnProperty("ekCount"))
                object.ekCount = message.ekCount;
            if (message.hunger != null && message.hasOwnProperty("hunger"))
                object.hunger = message.hunger;
            if (message.adminLevel != null && message.hasOwnProperty("adminLevel"))
                object.adminLevel = message.adminLevel;
            return object;
        };

        /**
         * Converts this PlayerContents to JSON.
         * @function toJSON
         * @memberof hbonline.PlayerContents
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerContents.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified MapInfo message, length delimited. Does not implicitly {@link hbonline.MapInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.MapInfo
         * @static
         * @param {hbonline.IMapInfo} message MapInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a MapInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.MapInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.MapInfo} MapInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MapInfo message.
         * @function verify
         * @memberof hbonline.MapInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MapInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.collisionGrid != null && message.hasOwnProperty("collisionGrid"))
                if (!(message.collisionGrid && typeof message.collisionGrid.length === "number" || $util.isString(message.collisionGrid)))
                    return "collisionGrid: buffer expected";
            return null;
        };

        /**
         * Creates a MapInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.MapInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.MapInfo} MapInfo
         */
        MapInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.MapInfo)
                return object;
            let message = new $root.hbonline.MapInfo();
            if (object.name != null)
                message.name = String(object.name);
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.collisionGrid != null)
                if (typeof object.collisionGrid === "string")
                    $util.base64.decode(object.collisionGrid, message.collisionGrid = $util.newBuffer($util.base64.length(object.collisionGrid)), 0);
                else if (object.collisionGrid.length >= 0)
                    message.collisionGrid = object.collisionGrid;
            return message;
        };

        /**
         * Creates a plain object from a MapInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.MapInfo
         * @static
         * @param {hbonline.MapInfo} message MapInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MapInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.name = "";
                object.width = 0;
                object.height = 0;
                if (options.bytes === String)
                    object.collisionGrid = "";
                else {
                    object.collisionGrid = [];
                    if (options.bytes !== Array)
                        object.collisionGrid = $util.newBuffer(object.collisionGrid);
                }
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.collisionGrid != null && message.hasOwnProperty("collisionGrid"))
                object.collisionGrid = options.bytes === String ? $util.base64.encode(message.collisionGrid, 0, message.collisionGrid.length) : options.bytes === Array ? Array.prototype.slice.call(message.collisionGrid) : message.collisionGrid;
            return object;
        };

        /**
         * Converts this MapInfo to JSON.
         * @function toJSON
         * @memberof hbonline.MapInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MapInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified MotionRequest message, length delimited. Does not implicitly {@link hbonline.MotionRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.MotionRequest
         * @static
         * @param {hbonline.IMotionRequest} message MotionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MotionRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a MotionRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.MotionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.MotionRequest} MotionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MotionRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MotionRequest message.
         * @function verify
         * @memberof hbonline.MotionRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MotionRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isInteger(message.action))
                    return "action: integer expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.targetId != null && message.hasOwnProperty("targetId"))
                if (!$util.isInteger(message.targetId))
                    return "targetId: integer expected";
            if (message.spellId != null && message.hasOwnProperty("spellId"))
                if (!$util.isInteger(message.spellId))
                    return "spellId: integer expected";
            return null;
        };

        /**
         * Creates a MotionRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.MotionRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.MotionRequest} MotionRequest
         */
        MotionRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.MotionRequest)
                return object;
            let message = new $root.hbonline.MotionRequest();
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.action != null)
                message.action = object.action | 0;
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.MotionRequest.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.targetId != null)
                message.targetId = object.targetId | 0;
            if (object.spellId != null)
                message.spellId = object.spellId | 0;
            return message;
        };

        /**
         * Creates a plain object from a MotionRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.MotionRequest
         * @static
         * @param {hbonline.MotionRequest} message MotionRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MotionRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.direction = 0;
                object.action = 0;
                object.position = null;
                object.targetId = 0;
                object.spellId = 0;
            }
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.targetId != null && message.hasOwnProperty("targetId"))
                object.targetId = message.targetId;
            if (message.spellId != null && message.hasOwnProperty("spellId"))
                object.spellId = message.spellId;
            return object;
        };

        /**
         * Converts this MotionRequest to JSON.
         * @function toJSON
         * @memberof hbonline.MotionRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MotionRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified MotionEvent message, length delimited. Does not implicitly {@link hbonline.MotionEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.MotionEvent
         * @static
         * @param {hbonline.IMotionEvent} message MotionEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MotionEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a MotionEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.MotionEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.MotionEvent} MotionEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MotionEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MotionEvent message.
         * @function verify
         * @memberof hbonline.MotionEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MotionEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.ownerType != null && message.hasOwnProperty("ownerType"))
                if (!$util.isInteger(message.ownerType))
                    return "ownerType: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isInteger(message.action))
                    return "action: integer expected";
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.destination != null && message.hasOwnProperty("destination")) {
                let error = $root.hbonline.Vec2.verify(message.destination);
                if (error)
                    return "destination." + error;
            }
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (!$util.isInteger(message.speed))
                    return "speed: integer expected";
            if (message.appearance != null && message.hasOwnProperty("appearance")) {
                let error = $root.hbonline.Appearance.verify(message.appearance);
                if (error)
                    return "appearance." + error;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            return null;
        };

        /**
         * Creates a MotionEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.MotionEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.MotionEvent} MotionEvent
         */
        MotionEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.MotionEvent)
                return object;
            let message = new $root.hbonline.MotionEvent();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.ownerType != null)
                message.ownerType = object.ownerType | 0;
            if (object.action != null)
                message.action = object.action | 0;
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.MotionEvent.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.destination != null) {
                if (typeof object.destination !== "object")
                    throw TypeError(".hbonline.MotionEvent.destination: object expected");
                message.destination = $root.hbonline.Vec2.fromObject(object.destination);
            }
            if (object.speed != null)
                message.speed = object.speed | 0;
            if (object.appearance != null) {
                if (typeof object.appearance !== "object")
                    throw TypeError(".hbonline.MotionEvent.appearance: object expected");
                message.appearance = $root.hbonline.Appearance.fromObject(object.appearance);
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.status != null)
                message.status = object.status | 0;
            return message;
        };

        /**
         * Creates a plain object from a MotionEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.MotionEvent
         * @static
         * @param {hbonline.MotionEvent} message MotionEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MotionEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.ownerType = 0;
                object.action = 0;
                object.direction = 0;
                object.position = null;
                object.destination = null;
                object.speed = 0;
                object.appearance = null;
                object.name = "";
                object.status = 0;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.ownerType != null && message.hasOwnProperty("ownerType"))
                object.ownerType = message.ownerType;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.destination != null && message.hasOwnProperty("destination"))
                object.destination = $root.hbonline.Vec2.toObject(message.destination, options);
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = message.speed;
            if (message.appearance != null && message.hasOwnProperty("appearance"))
                object.appearance = $root.hbonline.Appearance.toObject(message.appearance, options);
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this MotionEvent to JSON.
         * @function toJSON
         * @memberof hbonline.MotionEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MotionEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified PlayerAppear message, length delimited. Does not implicitly {@link hbonline.PlayerAppear.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {hbonline.IPlayerAppear} message PlayerAppear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerAppear.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a PlayerAppear message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.PlayerAppear} PlayerAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerAppear.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerAppear message.
         * @function verify
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerAppear.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.appearance != null && message.hasOwnProperty("appearance")) {
                let error = $root.hbonline.Appearance.verify(message.appearance);
                if (error)
                    return "appearance." + error;
            }
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isInteger(message.action))
                    return "action: integer expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.side != null && message.hasOwnProperty("side"))
                if (!$util.isInteger(message.side))
                    return "side: integer expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.pkCount != null && message.hasOwnProperty("pkCount"))
                if (!$util.isInteger(message.pkCount))
                    return "pkCount: integer expected";
            return null;
        };

        /**
         * Creates a PlayerAppear message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.PlayerAppear} PlayerAppear
         */
        PlayerAppear.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.PlayerAppear)
                return object;
            let message = new $root.hbonline.PlayerAppear();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.PlayerAppear.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.appearance != null) {
                if (typeof object.appearance !== "object")
                    throw TypeError(".hbonline.PlayerAppear.appearance: object expected");
                message.appearance = $root.hbonline.Appearance.fromObject(object.appearance);
            }
            if (object.action != null)
                message.action = object.action | 0;
            if (object.level != null)
                message.level = object.level | 0;
            if (object.side != null)
                message.side = object.side | 0;
            if (object.status != null)
                message.status = object.status | 0;
            if (object.pkCount != null)
                message.pkCount = object.pkCount | 0;
            return message;
        };

        /**
         * Creates a plain object from a PlayerAppear message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.PlayerAppear
         * @static
         * @param {hbonline.PlayerAppear} message PlayerAppear
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerAppear.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.name = "";
                object.position = null;
                object.direction = 0;
                object.appearance = null;
                object.action = 0;
                object.level = 0;
                object.side = 0;
                object.status = 0;
                object.pkCount = 0;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.appearance != null && message.hasOwnProperty("appearance"))
                object.appearance = $root.hbonline.Appearance.toObject(message.appearance, options);
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.side != null && message.hasOwnProperty("side"))
                object.side = message.side;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.pkCount != null && message.hasOwnProperty("pkCount"))
                object.pkCount = message.pkCount;
            return object;
        };

        /**
         * Converts this PlayerAppear to JSON.
         * @function toJSON
         * @memberof hbonline.PlayerAppear
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerAppear.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified PlayerDisappear message, length delimited. Does not implicitly {@link hbonline.PlayerDisappear.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {hbonline.IPlayerDisappear} message PlayerDisappear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerDisappear.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a PlayerDisappear message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.PlayerDisappear} PlayerDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerDisappear.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerDisappear message.
         * @function verify
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerDisappear.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            return null;
        };

        /**
         * Creates a PlayerDisappear message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.PlayerDisappear} PlayerDisappear
         */
        PlayerDisappear.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.PlayerDisappear)
                return object;
            let message = new $root.hbonline.PlayerDisappear();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            return message;
        };

        /**
         * Creates a plain object from a PlayerDisappear message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.PlayerDisappear
         * @static
         * @param {hbonline.PlayerDisappear} message PlayerDisappear
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerDisappear.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.objectId = 0;
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            return object;
        };

        /**
         * Converts this PlayerDisappear to JSON.
         * @function toJSON
         * @memberof hbonline.PlayerDisappear
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerDisappear.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified NpcAppear message, length delimited. Does not implicitly {@link hbonline.NpcAppear.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.NpcAppear
         * @static
         * @param {hbonline.INpcAppear} message NpcAppear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NpcAppear.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a NpcAppear message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.NpcAppear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.NpcAppear} NpcAppear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NpcAppear.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NpcAppear message.
         * @function verify
         * @memberof hbonline.NpcAppear
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NpcAppear.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.npcType != null && message.hasOwnProperty("npcType"))
                if (!$util.isInteger(message.npcType))
                    return "npcType: integer expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isInteger(message.action))
                    return "action: integer expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            return null;
        };

        /**
         * Creates a NpcAppear message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.NpcAppear
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.NpcAppear} NpcAppear
         */
        NpcAppear.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.NpcAppear)
                return object;
            let message = new $root.hbonline.NpcAppear();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.npcType != null)
                message.npcType = object.npcType | 0;
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.NpcAppear.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.action != null)
                message.action = object.action | 0;
            if (object.status != null)
                message.status = object.status | 0;
            return message;
        };

        /**
         * Creates a plain object from a NpcAppear message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.NpcAppear
         * @static
         * @param {hbonline.NpcAppear} message NpcAppear
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NpcAppear.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.name = "";
                object.npcType = 0;
                object.position = null;
                object.direction = 0;
                object.action = 0;
                object.status = 0;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.npcType != null && message.hasOwnProperty("npcType"))
                object.npcType = message.npcType;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this NpcAppear to JSON.
         * @function toJSON
         * @memberof hbonline.NpcAppear
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NpcAppear.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified NpcDisappear message, length delimited. Does not implicitly {@link hbonline.NpcDisappear.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {hbonline.INpcDisappear} message NpcDisappear message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NpcDisappear.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a NpcDisappear message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.NpcDisappear} NpcDisappear
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NpcDisappear.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NpcDisappear message.
         * @function verify
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NpcDisappear.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            return null;
        };

        /**
         * Creates a NpcDisappear message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.NpcDisappear} NpcDisappear
         */
        NpcDisappear.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.NpcDisappear)
                return object;
            let message = new $root.hbonline.NpcDisappear();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            return message;
        };

        /**
         * Creates a plain object from a NpcDisappear message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.NpcDisappear
         * @static
         * @param {hbonline.NpcDisappear} message NpcDisappear
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NpcDisappear.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.objectId = 0;
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            return object;
        };

        /**
         * Converts this NpcDisappear to JSON.
         * @function toJSON
         * @memberof hbonline.NpcDisappear
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NpcDisappear.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
            return writer;
        };

        /**
         * Encodes the specified NpcMotion message, length delimited. Does not implicitly {@link hbonline.NpcMotion.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.NpcMotion
         * @static
         * @param {hbonline.INpcMotion} message NpcMotion message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NpcMotion.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NpcMotion message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.NpcMotion
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.NpcMotion} NpcMotion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NpcMotion.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NpcMotion message.
         * @function verify
         * @memberof hbonline.NpcMotion
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NpcMotion.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isInteger(message.action))
                    return "action: integer expected";
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.destination != null && message.hasOwnProperty("destination")) {
                let error = $root.hbonline.Vec2.verify(message.destination);
                if (error)
                    return "destination." + error;
            }
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (!$util.isInteger(message.speed))
                    return "speed: integer expected";
            return null;
        };

        /**
         * Creates a NpcMotion message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.NpcMotion
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.NpcMotion} NpcMotion
         */
        NpcMotion.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.NpcMotion)
                return object;
            let message = new $root.hbonline.NpcMotion();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.action != null)
                message.action = object.action | 0;
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.NpcMotion.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.destination != null) {
                if (typeof object.destination !== "object")
                    throw TypeError(".hbonline.NpcMotion.destination: object expected");
                message.destination = $root.hbonline.Vec2.fromObject(object.destination);
            }
            if (object.speed != null)
                message.speed = object.speed | 0;
            return message;
        };

        /**
         * Creates a plain object from a NpcMotion message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.NpcMotion
         * @static
         * @param {hbonline.NpcMotion} message NpcMotion
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NpcMotion.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.action = 0;
                object.direction = 0;
                object.position = null;
                object.destination = null;
                object.speed = 0;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.destination != null && message.hasOwnProperty("destination"))
                object.destination = $root.hbonline.Vec2.toObject(message.destination, options);
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = message.speed;
            return object;
        };

        /**
         * Converts this NpcMotion to JSON.
         * @function toJSON
         * @memberof hbonline.NpcMotion
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NpcMotion.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified Notification message, length delimited. Does not implicitly {@link hbonline.Notification.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.Notification
         * @static
         * @param {hbonline.INotification} message Notification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Notification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a Notification message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.Notification
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.Notification} Notification
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Notification.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Notification message.
         * @function verify
         * @memberof hbonline.Notification
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Notification.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            return null;
        };

        /**
         * Creates a Notification message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.Notification
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.Notification} Notification
         */
        Notification.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.Notification)
                return object;
            let message = new $root.hbonline.Notification();
            if (object.message != null)
                message.message = String(object.message);
            if (object.type != null)
                message.type = object.type | 0;
            return message;
        };

        /**
         * Creates a plain object from a Notification message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.Notification
         * @static
         * @param {hbonline.Notification} message Notification
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Notification.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.message = "";
                object.type = 0;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            return object;
        };

        /**
         * Converts this Notification to JSON.
         * @function toJSON
         * @memberof hbonline.Notification
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Notification.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified MapChangeResponse message, length delimited. Does not implicitly {@link hbonline.MapChangeResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {hbonline.IMapChangeResponse} message MapChangeResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MapChangeResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a MapChangeResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.MapChangeResponse} MapChangeResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MapChangeResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MapChangeResponse message.
         * @function verify
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MapChangeResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                if (!$util.isString(message.mapName))
                    return "mapName: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            return null;
        };

        /**
         * Creates a MapChangeResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.MapChangeResponse} MapChangeResponse
         */
        MapChangeResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.MapChangeResponse)
                return object;
            let message = new $root.hbonline.MapChangeResponse();
            if (object.mapName != null)
                message.mapName = String(object.mapName);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.MapChangeResponse.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.direction != null)
                message.direction = object.direction | 0;
            return message;
        };

        /**
         * Creates a plain object from a MapChangeResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.MapChangeResponse
         * @static
         * @param {hbonline.MapChangeResponse} message MapChangeResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MapChangeResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.mapName = "";
                object.position = null;
                object.direction = 0;
            }
            if (message.mapName != null && message.hasOwnProperty("mapName"))
                object.mapName = message.mapName;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            return object;
        };

        /**
         * Converts this MapChangeResponse to JSON.
         * @function toJSON
         * @memberof hbonline.MapChangeResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MapChangeResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified EntityInfo message, length delimited. Does not implicitly {@link hbonline.EntityInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.EntityInfo
         * @static
         * @param {hbonline.IEntityInfo} message EntityInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EntityInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes an EntityInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.EntityInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.EntityInfo} EntityInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EntityInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EntityInfo message.
         * @function verify
         * @memberof hbonline.EntityInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EntityInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.entityType != null && message.hasOwnProperty("entityType"))
                if (!$util.isInteger(message.entityType))
                    return "entityType: integer expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.direction != null && message.hasOwnProperty("direction"))
                if (!$util.isInteger(message.direction))
                    return "direction: integer expected";
            if (message.action != null && message.hasOwnProperty("action"))
                if (!$util.isInteger(message.action))
                    return "action: integer expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.appearance != null && message.hasOwnProperty("appearance")) {
                let error = $root.hbonline.Appearance.verify(message.appearance);
                if (error)
                    return "appearance." + error;
            }
            if (message.npcType != null && message.hasOwnProperty("npcType"))
                if (!$util.isInteger(message.npcType))
                    return "npcType: integer expected";
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.side != null && message.hasOwnProperty("side"))
                if (!$util.isInteger(message.side))
                    return "side: integer expected";
            return null;
        };

        /**
         * Creates an EntityInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.EntityInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.EntityInfo} EntityInfo
         */
        EntityInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.EntityInfo)
                return object;
            let message = new $root.hbonline.EntityInfo();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.entityType != null)
                message.entityType = object.entityType | 0;
            if (object.name != null)
                message.name = String(object.name);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.EntityInfo.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            if (object.direction != null)
                message.direction = object.direction | 0;
            if (object.action != null)
                message.action = object.action | 0;
            if (object.status != null)
                message.status = object.status | 0;
            if (object.appearance != null) {
                if (typeof object.appearance !== "object")
                    throw TypeError(".hbonline.EntityInfo.appearance: object expected");
                message.appearance = $root.hbonline.Appearance.fromObject(object.appearance);
            }
            if (object.npcType != null)
                message.npcType = object.npcType | 0;
            if (object.level != null)
                message.level = object.level | 0;
            if (object.side != null)
                message.side = object.side | 0;
            return message;
        };

        /**
         * Creates a plain object from an EntityInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.EntityInfo
         * @static
         * @param {hbonline.EntityInfo} message EntityInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EntityInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.entityType = 0;
                object.name = "";
                object.position = null;
                object.direction = 0;
                object.action = 0;
                object.status = 0;
                object.appearance = null;
                object.npcType = 0;
                object.level = 0;
                object.side = 0;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.entityType != null && message.hasOwnProperty("entityType"))
                object.entityType = message.entityType;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            if (message.direction != null && message.hasOwnProperty("direction"))
                object.direction = message.direction;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = message.action;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.appearance != null && message.hasOwnProperty("appearance"))
                object.appearance = $root.hbonline.Appearance.toObject(message.appearance, options);
            if (message.npcType != null && message.hasOwnProperty("npcType"))
                object.npcType = message.npcType;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.side != null && message.hasOwnProperty("side"))
                object.side = message.side;
            return object;
        };

        /**
         * Converts this EntityInfo to JSON.
         * @function toJSON
         * @memberof hbonline.EntityInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EntityInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified ChatRequest message, length delimited. Does not implicitly {@link hbonline.ChatRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.ChatRequest
         * @static
         * @param {hbonline.IChatRequest} message ChatRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a ChatRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.ChatRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.ChatRequest} ChatRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatRequest message.
         * @function verify
         * @memberof hbonline.ChatRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.target != null && message.hasOwnProperty("target"))
                if (!$util.isString(message.target))
                    return "target: string expected";
            return null;
        };

        /**
         * Creates a ChatRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.ChatRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.ChatRequest} ChatRequest
         */
        ChatRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.ChatRequest)
                return object;
            let message = new $root.hbonline.ChatRequest();
            if (object.type != null)
                message.type = object.type | 0;
            if (object.message != null)
                message.message = String(object.message);
            if (object.target != null)
                message.target = String(object.target);
            return message;
        };

        /**
         * Creates a plain object from a ChatRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.ChatRequest
         * @static
         * @param {hbonline.ChatRequest} message ChatRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = 0;
                object.message = "";
                object.target = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.target != null && message.hasOwnProperty("target"))
                object.target = message.target;
            return object;
        };

        /**
         * Converts this ChatRequest to JSON.
         * @function toJSON
         * @memberof hbonline.ChatRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
         * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link hbonline.ChatMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof hbonline.ChatMessage
         * @static
         * @param {hbonline.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
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
         * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof hbonline.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {hbonline.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatMessage message.
         * @function verify
         * @memberof hbonline.ChatMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                if (!$util.isInteger(message.objectId))
                    return "objectId: integer expected";
            if (message.senderName != null && message.hasOwnProperty("senderName"))
                if (!$util.isString(message.senderName))
                    return "senderName: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.hbonline.Vec2.verify(message.position);
                if (error)
                    return "position." + error;
            }
            return null;
        };

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof hbonline.ChatMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {hbonline.ChatMessage} ChatMessage
         */
        ChatMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.hbonline.ChatMessage)
                return object;
            let message = new $root.hbonline.ChatMessage();
            if (object.objectId != null)
                message.objectId = object.objectId | 0;
            if (object.senderName != null)
                message.senderName = String(object.senderName);
            if (object.type != null)
                message.type = object.type | 0;
            if (object.message != null)
                message.message = String(object.message);
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".hbonline.ChatMessage.position: object expected");
                message.position = $root.hbonline.Vec2.fromObject(object.position);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof hbonline.ChatMessage
         * @static
         * @param {hbonline.ChatMessage} message ChatMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.objectId = 0;
                object.senderName = "";
                object.type = 0;
                object.message = "";
                object.position = null;
            }
            if (message.objectId != null && message.hasOwnProperty("objectId"))
                object.objectId = message.objectId;
            if (message.senderName != null && message.hasOwnProperty("senderName"))
                object.senderName = message.senderName;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.hbonline.Vec2.toObject(message.position, options);
            return object;
        };

        /**
         * Converts this ChatMessage to JSON.
         * @function toJSON
         * @memberof hbonline.ChatMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

    return hbonline;
})();

export { $root as default };
