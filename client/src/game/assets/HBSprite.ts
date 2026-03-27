import type { Scene } from 'phaser';

/**
 * Enum representing different sprite types based on various item types in Helbreath.
 */
export enum SpriteType {
    Human = 'Human',
    Tiles = 'Tiles',
    Monster = 'Monster',
    EquipmentPack = 'EquipmentPack',
    HairAndUndies = 'HairAndUndies',
    Bows = 'Bows',
    Weapons = 'Weapons',
    Shields = 'Shields',
    Effect = 'Effect',
    Interface = 'Interface',
}

// ---------------------------------------------------------------------------
// Pivot data store
// ---------------------------------------------------------------------------

/**
 * Per-frame pivot information used for rendering alignment.
 */
export type PivotFrame = {
    pivotX: number;
    pivotY: number;
    width: number;
    height: number;
};

/**
 * Pivot data for a sprite file: an array of sprite sheets, each containing
 * an array of PivotFrame entries (one per frame).
 */
export type PivotData = {
    spriteSheetPivots: PivotFrame[][];
};

/** Module-level map from texture key to PivotData. */
const pivotDataMap = new Map<string, PivotData>();

/**
 * Retrieves pivot data previously registered under the given texture key.
 *
 * @param textureKey - The key used when the sprite was loaded (sprite name or custom texture key).
 * @returns The PivotData if found, or undefined.
 */
export function getPivotData(textureKey: string): PivotData | undefined {
    return pivotDataMap.get(textureKey);
}

// ---------------------------------------------------------------------------
// Internal types used during binary parsing
// ---------------------------------------------------------------------------

/**
 * Frame metadata parsed from sprite file binary data.
 * Contains position, dimensions, and pivot point information.
 */
type SpriteFrameMetadata = {
    left: number;
    top: number;
    width: number;
    height: number;
    pivotX: number;
    pivotY: number;
};

/**
 * Sprite metadata item containing frame metadata and image length.
 * Used during sprite file parsing.
 */
type SpriteMetaItem = {
    frames: SpriteFrameMetadata[];
    imageLength: number;
};

// ---------------------------------------------------------------------------
// HBSpriteFrame
// ---------------------------------------------------------------------------

/**
 * Represents a single frame within a sprite sheet.
 * Contains position, dimensions, pivot point, and texture information.
 */
export class HBSpriteFrame {
    /** The x coordinate of the frame within the sprite sheet */
    public readonly x: number;

    /** The y coordinate of the frame within the sprite sheet */
    public readonly y: number;

    /** The width of the frame in pixels */
    public readonly width: number;

    /** The height of the frame in pixels */
    public readonly height: number;

    /** The x coordinate of the pivot point relative to the frame's top-left corner */
    public readonly pivotX: number;

    /** The y coordinate of the pivot point relative to the frame's top-left corner */
    public readonly pivotY: number;

    /** The texture key used to identify the sprite sheet texture in Phaser */
    public readonly textureKey: string;

    /** The index of this frame within the sprite sheet */
    public readonly frameIndex: number;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        pivotX: number,
        pivotY: number,
        textureKey: string,
        frameIndex: number,
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pivotX = pivotX;
        this.pivotY = pivotY;
        this.textureKey = textureKey;
        this.frameIndex = frameIndex;
    }
}

// ---------------------------------------------------------------------------
// HBSpriteSheet
// ---------------------------------------------------------------------------

/**
 * Represents a sprite sheet containing multiple frames.
 * Handles texture creation and frame slicing.
 */
export class HBSpriteSheet {
    /** Array of frames contained in this sprite sheet */
    public readonly frames: HBSpriteFrame[];

    /** The texture key used to identify this sprite sheet in Phaser */
    public readonly textureKey: string;

    /** The name of the sprite (without index) */
    private readonly spriteName: string;

    /** The index of this sprite sheet within the sprite file */
    private readonly spriteSheetIndex: number;

    /** The Phaser scene this sheet is registered with */
    private readonly scene: Scene;

    constructor(
        scene: Scene,
        spriteName: string,
        spriteSheetIndex: number,
        frames: HBSpriteFrame[],
        spriteSheetImage: ImageBitmap,
        customTextureKey?: string,
    ) {
        this.scene = scene;
        this.frames = frames;
        this.spriteName = spriteName;
        this.spriteSheetIndex = spriteSheetIndex;

        // Build texture key: use custom key if provided, otherwise use {spriteName}-{spriteSheetIndex}
        this.textureKey = customTextureKey ?? `${spriteName}-${spriteSheetIndex}`;

        // Create texture from sprite sheet image
        this.createTexture(scene, spriteSheetImage, frames);
    }

    /**
     * Creates a Phaser texture from the sprite sheet ImageBitmap and slices it into individual frames.
     * Uses NEAREST filtering for pixel-perfect rendering.
     */
    private createTexture(scene: Scene, spriteSheetImage: ImageBitmap, frames: HBSpriteFrame[]): void {
        // Check if texture already exists
        if (scene.textures.exists(this.textureKey)) {
            return;
        }

        // Create canvas for the texture using the original sprite sheet image
        const canvas = document.createElement('canvas');
        canvas.width = spriteSheetImage.width;
        canvas.height = spriteSheetImage.height;
        const ctx = canvas.getContext('2d', { alpha: true });

        if (!ctx) {
            throw new Error('Failed to get canvas context for texture creation');
        }

        ctx.imageSmoothingEnabled = false;

        // Draw the entire sprite sheet onto the canvas
        ctx.drawImage(spriteSheetImage, 0, 0);

        // Add canvas as texture to Phaser
        scene.textures.addCanvas(this.textureKey, canvas);

        // Set texture filter to NEAREST for pixel-perfect rendering
        const texture = scene.textures.get(this.textureKey);
        if (texture.source && texture.source[0]) {
            const source = texture.source[0];
            source.scaleMode = 0; // Phaser.ScaleModes.NEAREST
        }

        // Add frames to the texture by slicing the sprite sheet
        frames.forEach((sprite, frameIndex) => {
            texture.add(String(frameIndex), 0, sprite.x, sprite.y, sprite.width, sprite.height);
        });
    }
}

// ---------------------------------------------------------------------------
// HBAnimation
// ---------------------------------------------------------------------------

/**
 * Creates and registers Phaser animations from sprite frames.
 */
class HBAnimation {
    /** The unique key used to identify this animation in Phaser's AnimationManager */
    public readonly animationKey: string;

    /** The cache key of the sprite file this animation belongs to */
    public readonly spriteCacheKey: string;

    /** The index of the sprite sheet within the sprite file */
    public readonly spriteSheetIndex: number;

    constructor(
        scene: Scene,
        spriteCacheKey: string,
        spriteSheetIndex: number,
        sprites: HBSpriteFrame[],
        frameRate = 10,
        repeat = -1,
    ) {
        this.spriteCacheKey = spriteCacheKey;
        this.spriteSheetIndex = spriteSheetIndex;

        const spriteName = spriteCacheKey.toLowerCase();
        this.animationKey = `${spriteName}-${spriteSheetIndex}`;

        // Register animation if it doesn't exist
        if (!scene.anims.exists(this.animationKey)) {
            this.registerAnimation(scene, sprites, frameRate, repeat);
        }
    }

    /**
     * Registers the animation with Phaser's AnimationManager.
     * Converts sprite frames into Phaser animation frames with custom pivot data.
     */
    private registerAnimation(
        scene: Scene,
        sprites: HBSpriteFrame[],
        frameRate: number,
        repeat: number,
    ): void {
        const frames = sprites.map((sprite) => ({
            key: sprite.textureKey,
            frame: String(sprite.frameIndex),
            customData: {
                pivotX: sprite.pivotX,
                pivotY: sprite.pivotY,
                width: sprite.width,
                height: sprite.height,
            },
        }));

        scene.anims.create({
            key: this.animationKey,
            frames: frames,
            frameRate: frameRate,
            repeat: repeat,
        });
    }
}

// ---------------------------------------------------------------------------
// Binary helpers
// ---------------------------------------------------------------------------

/** Size of the header in bytes (sprite count) */
const HEADER_SIZE = 2;

/** Reads a 16-bit signed integer from a DataView in little-endian format. */
const readInt16 = (view: DataView, offset: number) => view.getInt16(offset, true);

/** Reads a 32-bit signed integer from a DataView in little-endian format. */
const readInt32 = (view: DataView, offset: number) => view.getInt32(offset, true);

// ---------------------------------------------------------------------------
// HBSpriteFile
// ---------------------------------------------------------------------------

/**
 * Represents a Helbreath sprite file containing one or more sprite sheets.
 * Handles loading, parsing, and registering sprite sheets and animations with Phaser.
 */
export class HBSpriteFile {
    /** The name of the sprite file */
    public readonly fileName: string;

    /** The type of sprite (determines if animations should be created) */
    public readonly spriteType: SpriteType;

    /** Starting index for tile sprites (used for map tile texture naming) */
    public readonly tileStartIndex?: number;

    /** Array of sprite sheets loaded from this file */
    public spriteSheets: HBSpriteSheet[] = [];

    /** Array of animations created from the sprite sheets (empty for Tiles and Interface types) */
    public animations: HBAnimation[] = [];

    constructor(fileName: string, spriteType: SpriteType, tileStartIndex?: number) {
        this.fileName = fileName;
        this.spriteType = spriteType;
        this.tileStartIndex = tileStartIndex;
    }

    /**
     * Loads the sprite file from an ArrayBuffer, parses it, and creates sprite sheets and animations.
     *
     * This method:
     * 1. Parses the Helbreath SPR binary format
     * 2. Creates sprite sheets with textures
     * 3. Stores pivot data in the module-level map
     * 4. Creates animations (if sprite type supports them)
     *
     * @param scene - The Phaser scene to register textures/animations with
     * @param buffer - The raw ArrayBuffer of the SPR file
     */
    public async load(scene: Scene, buffer: ArrayBuffer): Promise<void> {
        const spriteName = this.fileName.toLowerCase();

        // Parse sprite file
        const parsedSprites = this.parseSprite(buffer, spriteName, this.tileStartIndex);

        // Process each sprite sheet
        const spriteSheets: HBSpriteSheet[] = [];

        for (let spriteSheetIndex = 0; spriteSheetIndex < parsedSprites.length; spriteSheetIndex++) {
            const parsedSprite = parsedSprites[spriteSheetIndex];

            // Convert sprite sheet image data to ImageBitmap
            const spriteSheetImage = await this.createImageFromPng(parsedSprite.imageData);

            try {
                const frames = parsedSprite.frames;

                // Determine texture naming
                // For tiles with a start index, use map-tile-{index} naming
                // Otherwise use the default {spriteName}-{spriteSheetIndex} naming
                const useCustomNaming = this.spriteType === SpriteType.Tiles && this.tileStartIndex !== undefined;
                const customTextureKey = useCustomNaming ? `map-tile-${this.tileStartIndex! + spriteSheetIndex}` : undefined;

                const spriteSheet = new HBSpriteSheet(
                    scene,
                    spriteName,
                    spriteSheetIndex,
                    frames,
                    spriteSheetImage,
                    customTextureKey,
                );
                spriteSheets.push(spriteSheet);
            } finally {
                spriteSheetImage.close();
            }
        }

        this.spriteSheets = spriteSheets;

        // Build pivot data and store in the module-level map
        const spriteSheetPivots: PivotFrame[][] = [];
        for (let spriteSheetIndex = 0; spriteSheetIndex < spriteSheets.length; spriteSheetIndex++) {
            const spriteSheet = spriteSheets[spriteSheetIndex];
            const framePivots: PivotFrame[] = spriteSheet.frames.map((frame) => ({
                pivotX: frame.pivotX,
                pivotY: frame.pivotY,
                width: frame.width,
                height: frame.height,
            }));
            spriteSheetPivots.push(framePivots);

            // For tiles, also register pivots using the textureKey for tile-based lookup
            if (this.spriteType === SpriteType.Tiles) {
                const textureKey = spriteSheet.textureKey;
                const texturePivotData: PivotData = {
                    spriteSheetPivots: [framePivots],
                };
                pivotDataMap.set(textureKey, texturePivotData);
            }
        }

        // Register pivot data under the sprite name
        const pivotData: PivotData = { spriteSheetPivots };
        pivotDataMap.set(spriteName, pivotData);

        // Create animations if sprite type is not Tiles or Interface
        if (this.spriteType !== SpriteType.Tiles && this.spriteType !== SpriteType.Interface) {
            const animations: HBAnimation[] = [];

            for (let spriteSheetIndex = 0; spriteSheetIndex < spriteSheets.length; spriteSheetIndex++) {
                const spriteSheet = spriteSheets[spriteSheetIndex];

                const animation = new HBAnimation(
                    scene,
                    this.fileName,
                    spriteSheetIndex,
                    spriteSheet.frames,
                    10, // frameRate
                    -1, // repeat
                );

                animations.push(animation);
            }

            this.animations = animations;
        } else {
            this.animations = [];
        }

        console.log(`Sprite loaded: ${this.fileName}`, this);
    }

    /**
     * Creates an ImageBitmap from PNG image data.
     */
    private async createImageFromPng(data: Uint8Array): Promise<ImageBitmap> {
        const buffer = data.byteOffset === 0 && data.byteLength === data.buffer.byteLength
            ? data.buffer
            : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : new Uint8Array(data).buffer;
        const blob = new Blob([arrayBuffer], { type: 'image/png' });

        try {
            return await createImageBitmap(blob);
        } catch (error) {
            throw new Error(`Failed to decode sprite PNG: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Parses a Helbreath sprite file from binary data.
     * The format consists of:
     * - Header: sprite count (2 bytes)
     * - For each sprite: frame count, image length, dimensions, and frame metadata
     * - PNG image data for each sprite sheet
     *
     * @param buffer - The binary data of the sprite file
     * @param spriteName - The name of the sprite (used for texture keys)
     * @param tileStartIndex - Optional starting index for tile texture naming
     * @returns Array of objects containing sprite frames and PNG image data for each sprite sheet
     */
    private parseSprite(buffer: ArrayBuffer, spriteName: string, tileStartIndex?: number): Array<{ frames: HBSpriteFrame[]; imageData: Uint8Array }> {
        const view = new DataView(buffer);
        let offset = 0;

        const spriteCount = readInt16(view, offset);
        offset += HEADER_SIZE;

        const meta: SpriteMetaItem[] = [];

        for (let i = 0; i < spriteCount; i += 1) {
            const frameCount = readInt16(view, offset);
            offset += 2;

            const imageLength = readInt32(view, offset);
            offset += 4;

            offset += 4; // width (unused in parser)
            offset += 4; // height (unused in parser)
            offset += 1; // startLocation placeholder byte

            const frames: SpriteFrameMetadata[] = [];

            for (let f = 0; f < frameCount; f += 1) {
                const left = readInt16(view, offset);
                offset += 2;
                const top = readInt16(view, offset);
                offset += 2;
                const width = readInt16(view, offset);
                offset += 2;
                const height = readInt16(view, offset);
                offset += 2;
                const pivotX = readInt16(view, offset);
                offset += 2;
                const pivotY = readInt16(view, offset);
                offset += 2;

                frames.push({ left, top, width, height, pivotX, pivotY });
            }

            meta.push({ frames, imageLength });
        }

        const sprites: Array<{ frames: HBSpriteFrame[]; imageData: Uint8Array }> = [];

        for (let i = 0; i < meta.length; i += 1) {
            offset += 4; // startLocation, not needed for sequential read
            const { imageLength, frames } = meta[i];

            const imageBuffer = buffer.slice(offset, offset + imageLength);
            offset += imageLength;

            // Create Uint8Array view - slice already returns a new ArrayBuffer, so this is safe
            const imageData = new Uint8Array(imageBuffer);

            // Build texture key for this sprite sheet
            // For tiles with a start index, use map-tile-{index} naming
            // Otherwise use the default {spriteName}-{i} naming
            const textureKey = tileStartIndex !== undefined
                ? `map-tile-${tileStartIndex + i}`
                : `${spriteName}-${i}`;

            // Build SpriteFrame instances directly
            const spriteFrames = frames.map((frame, frameIndex) => {
                return new HBSpriteFrame(
                    frame.left,
                    frame.top,
                    frame.width,
                    frame.height,
                    frame.pivotX,
                    frame.pivotY,
                    textureKey,
                    frameIndex,
                );
            });

            sprites.push({
                frames: spriteFrames,
                imageData,
            });
        }

        return sprites;
    }
}
