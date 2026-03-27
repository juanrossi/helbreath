import type { GameObjects, Scene } from 'phaser';
import { getPivotData, type PivotFrame } from '../assets/HBSprite';

/**
 * Animation type enumeration for different animation behaviors.
 */
export enum AnimationType {
    /** Plays full range of sprites in sprite sheet (default behavior) */
    FullFrame = 'FullFrame',
    /** Plays directional sub-frames (used for player equipment) */
    DirectionalSubFrame = 'DirectionalSubFrame',
    /** Plays sub-frames with custom start index (used for Fire Wyvern) */
    SubFrame = 'SubFrame',
}

/**
 * Configuration object for creating a GameAsset instance.
 */
export type GameAssetConfig = {
    /** The x coordinate where the sprite should be positioned (in pixel coordinates) */
    x: number;

    /** The y coordinate where the sprite should be positioned (in pixel coordinates) */
    y: number;

    /** The name of the sprite file (without extension) */
    spriteName: string;

    /**
     * The index of the sprite sheet within the sprite file.
     * Optional when mapObject is true, required otherwise.
     */
    spriteSheetIndex?: number;

    /**
     * Whether this is a map object using the spriteName directly as texture key.
     * When true, texture key will be just the spriteName (e.g. "map-tile-100").
     */
    mapObject?: boolean;

    /**
     * The direction index (0-7) for directional sprites.
     * Equipment, except weapons and shields, have all 8 directions included in the sprite sheet.
     * We'll need to extract the correct frame range from the sprite sheet for given direction.
     */
    direction?: number;

    /** Number of frames per direction (default: 8) */
    framesPerDirection?: number;

    /** Specific frame index to display (if not provided, animation will play) */
    frameIndex?: number;

    /** Alpha transparency value (0-1) */
    alpha?: number;

    /** Frame rate for animation playback (default: 10) */
    frameRate?: number;

    /** Animation type (default: FullFrame) */
    animationType?: AnimationType;

    /** Starting frame index for SubFrame animations (default: 0) */
    animationFrameStartIndex?: number;

    /** Whether the animation should loop (default: true) */
    isLooping?: boolean;

    /** Optional callback invoked when the animation reaches a new frame (relative frame index 0-7 within direction) */
    onAnimationFrameChange?: (relativeFrameIndex: number) => void;
};

/**
 * Represents a single frame or animation that can be drawn on the scene.
 * Designed for Helbreath's sprite format with support for pivot points and directional animations.
 */
export class GameAsset {
    /** The Phaser sprite object that renders the asset */
    public readonly sprite: GameObjects.Sprite;

    /** The Phaser scene this asset belongs to */
    public scene: Scene;

    /** The base x coordinate before pivot offset is applied */
    private baseX: number;

    /** The base y coordinate before pivot offset is applied */
    private baseY: number;

    /** Array of pivot data for each frame in the sprite sheet */
    private spriteSheetPivots: PivotFrame[] | undefined;

    /** The starting frame index for the current direction (if directional) */
    private directionStartFrame?: number;

    /** The ending frame index for the current direction (if directional) */
    private directionEndFrame?: number;

    /** Whether the current animation should loop (true for looping, false for non-looping) */
    private isAnimationLooping: boolean = true;

    /** Animation type controlling frame playback behavior */
    private animationType: AnimationType = AnimationType.FullFrame;

    /** Starting frame index for SubFrame animations */
    private animationFrameStartIndex: number = 0;

    /** Re-entrancy guard to prevent infinite recursion when setCurrentFrame triggers ANIMATION_UPDATE */
    private _isHandlingFrameLimit: boolean = false;

    /** Whether this asset is non-animated (has a fixed frameIndex) */
    private isNonAnimated = false;

    /** The frame index for non-animated sprites */
    private fixedFrameIndex?: number;

    /** The sprite name (without extension) */
    private spriteName: string;

    /** The sprite sheet index within the sprite file */
    private spriteSheetIndex?: number;

    /** Callback from config, invoked when animation reaches a new frame (not invoked during construction) */
    private onAnimationFrameChangeCallback?: (relativeFrameIndex: number) => void;

    /** Guards callback invocation until construction completes (avoids accessing parent's this before super() returns) */
    private _constructionComplete = false;

    /** Previous frame index for detecting frame changes */
    private previousFrameIndex: number = -1;

    /**
     * Creates a new GameAsset instance.
     * Sets up the sprite, loads pivot data, configures animations, and registers frame-change listeners.
     *
     * @param scene - The Phaser scene to add the asset to
     * @param config - Configuration object specifying position, sprite, and animation settings
     */
    constructor(scene: Scene, config: GameAssetConfig) {
        this.scene = scene;
        this.baseX = config.x;
        this.baseY = config.y;
        this.spriteName = config.spriteName;
        this.spriteSheetIndex = config.spriteSheetIndex;

        // Validate spriteSheetIndex requirement
        if (!config.mapObject && config.spriteSheetIndex === undefined) {
            throw new Error('spriteSheetIndex is required when mapObject is not true');
        }

        // Build texture key based on whether this is a map object
        let textureKey: string;
        let animationKey: string;

        if (config.mapObject) {
            // Map objects use the spriteName directly (e.g. "map-tile-100")
            textureKey = config.spriteName;
            animationKey = config.spriteName;
        } else {
            // Standard sprite-sheet based lookup: {spriteName}-{spriteSheetIndex}
            textureKey = `${config.spriteName}-${config.spriteSheetIndex}`;
            animationKey = `${config.spriteName}-${config.spriteSheetIndex}`;
        }

        // Check if texture exists
        if (!scene.textures.exists(textureKey)) {
            throw new Error(`Texture "${textureKey}" does not exist`);
        }

        // Check if frame index exists in texture (if frameIndex is specified)
        if (config.frameIndex !== undefined) {
            const texture = scene.textures.get(textureKey);
            if (!texture.has(String(config.frameIndex))) {
                throw new Error(`Frame index ${config.frameIndex} does not exist in texture "${textureKey}"`);
            }
        }

        // Initialize animation type and looping behavior
        this.animationType = config.animationType ?? AnimationType.FullFrame;
        this.animationFrameStartIndex = config.animationFrameStartIndex ?? 0;
        this.isAnimationLooping = config.isLooping ?? true;

        // Calculate directional frame range if direction is specified
        if (config.direction !== undefined) {
            const framesPerDirection = config.framesPerDirection ?? 8;
            this.directionStartFrame = config.direction * framesPerDirection;
            this.directionEndFrame = this.directionStartFrame + framesPerDirection - 1;
        }

        // Store callback from config (not invoked during construction to avoid parent accessing this before super() returns)
        this.onAnimationFrameChangeCallback = config.onAnimationFrameChange;

        // Retrieve pivot data from the module-level pivot store
        this.loadPivotData(textureKey, config);

        // Create sprite at given coordinates
        if (config.frameIndex !== undefined) {
            this.sprite = scene.add.sprite(config.x, config.y, textureKey, config.frameIndex);
            this.applyPivotOffset(config.frameIndex);
            this.isNonAnimated = true;
            this.fixedFrameIndex = config.frameIndex;
        } else {
            this.sprite = scene.add.sprite(config.x, config.y, textureKey);
        }

        this.sprite.setOrigin(0, 0); // Set anchor point to top-left

        if (config.alpha !== undefined) {
            this.sprite.setAlpha(config.alpha);
        }

        // Set up animation event listeners for pivot correction and frame limiting
        this.sprite.on(Phaser.Animations.Events.ANIMATION_START, (_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            this.applyFramePivotOffset(frame);
            this.emitAnimationFrameChange(frame);
        });
        this.sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, (_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            this.applyFramePivotOffset(frame);
            this.handleDirectionalFrameLimit(frame);
            this.emitAnimationFrameChange(frame);
        });

        // Play animation if it exists
        if (config.frameIndex === undefined) {
            if (scene.anims.exists(animationKey)) {
                this.isAnimationLooping = true;
                this.sprite.play({
                    key: animationKey,
                    startFrame: this.directionStartFrame ?? 0,
                    frameRate: config.frameRate ?? 10,
                });
            } else {
                console.warn(`Animation key "${animationKey}" does not exist. Sprite created but not animating.`);
            }
        }

        this._constructionComplete = true;
    }

    /**
     * Loads pivot data from the module-level pivot store in HBSprite.
     *
     * For map objects the lookup key is the textureKey (e.g. "map-tile-100").
     * For regular sprites the lookup key is the spriteName (e.g. "wm").
     */
    private loadPivotData(textureKey: string, config: GameAssetConfig): void {
        if (config.mapObject) {
            // For map objects, pivot data is stored under the textureKey
            const pivotData = getPivotData(textureKey);
            if (pivotData && pivotData.spriteSheetPivots[0]) {
                this.spriteSheetPivots = pivotData.spriteSheetPivots[0];
            }
        } else {
            // For regular sprites, pivot data is stored under the spriteName
            const pivotData = getPivotData(config.spriteName);
            if (pivotData && config.spriteSheetIndex !== undefined && pivotData.spriteSheetPivots[config.spriteSheetIndex]) {
                this.spriteSheetPivots = pivotData.spriteSheetPivots[config.spriteSheetIndex];
            }
        }
    }

    /**
     * Applies pivot offset to sprite position based on the current animation frame.
     * Extracts the frame index from the animation frame and calls applyPivotOffset.
     *
     * @param frame - The current animation frame from Phaser's animation system
     */
    private applyFramePivotOffset(frame: Phaser.Animations.AnimationFrame): void {
        const frameName = frame.textureFrame ?? frame.frame?.name ?? frame.index;
        const frameIndex = typeof frameName === 'number' ? frameName : parseInt(frameName, 10);
        this.applyPivotOffset(frameIndex);
    }

    /**
     * Applies pivot offset to sprite position based on the frame index.
     * Looks up pivot data for the frame and adjusts sprite position accordingly.
     * Only applies offset if pivot data exists and frame dimensions are non-zero.
     *
     * @param frameIndex - The index of the frame to get pivot data for
     */
    private applyPivotOffset(frameIndex: number): void {
        if (!this.spriteSheetPivots) {
            return;
        }

        const pivotData = this.spriteSheetPivots[frameIndex];
        if (!pivotData) {
            return;
        }

        const pivotX = (pivotData.width !== 0 && pivotData.height !== 0) ? pivotData.pivotX : 0;
        const pivotY = (pivotData.width !== 0 && pivotData.height !== 0) ? pivotData.pivotY : 0;

        // Apply pivot offset: add pivot to base position
        this.sprite.setPosition(this.baseX + pivotX, this.baseY + pivotY);
    }

    /**
     * Handles directional frame limiting by wrapping back to the start frame when out of range.
     * This ensures that directional animations loop within their designated frame range.
     * Behavior depends on animation type:
     * - DirectionalSubFrame: Always applies frame limiting for looping within direction range
     * - SubFrame: Handles frame limiting with custom start index and frame count
     * - FullFrame: Only applies frame limiting for looping animations
     *
     * @param frame - The current animation frame from Phaser's animation system
     */
    private handleDirectionalFrameLimit(frame: Phaser.Animations.AnimationFrame): void {
        // Re-entrancy guard: setCurrentFrame triggers ANIMATION_UPDATE, which would re-enter here
        if (this._isHandlingFrameLimit) {
            return;
        }

        // Get current frame index
        const frameName = frame.textureFrame ?? frame.frame?.name ?? frame.index;
        const frameIndex = typeof frameName === 'number' ? frameName : parseInt(frameName, 10);

        // Handle DirectionalSubFrame animation type (player equipment)
        if (this.animationType === AnimationType.DirectionalSubFrame) {
            if (this.directionStartFrame === undefined || this.directionEndFrame === undefined) {
                return;
            }

            if (frameIndex < this.directionStartFrame || frameIndex > this.directionEndFrame) {
                const currentAnim = this.sprite.anims.currentAnim;
                if (currentAnim && currentAnim.frames) {
                    const pastEnd = frameIndex > this.directionEndFrame;
                    const targetFrameIndex = (!this.isAnimationLooping && pastEnd)
                        ? this.directionEndFrame
                        : this.directionStartFrame;
                    const targetFrame = currentAnim.frames.find((f: any) => {
                        const fIndex = typeof f.textureFrame === 'number' ? f.textureFrame :
                            (f.frame?.name ? parseInt(f.frame.name, 10) : f.index);
                        return fIndex === targetFrameIndex;
                    });

                    if (targetFrame) {
                        this._isHandlingFrameLimit = true;
                        try {
                            this.sprite.anims.setCurrentFrame(targetFrame);
                            if (!this.isAnimationLooping && pastEnd) {
                                this.sprite.anims.stop();
                            }
                        } finally {
                            this._isHandlingFrameLimit = false;
                        }
                    }
                }
            }
            return;
        }

        // Handle SubFrame animation type
        if (this.animationType === AnimationType.SubFrame) {
            if (this.directionStartFrame === undefined || this.directionEndFrame === undefined) {
                return;
            }

            const actualStartFrame = this.directionStartFrame + this.animationFrameStartIndex;
            const actualEndFrame = this.directionEndFrame + this.animationFrameStartIndex;

            if (frameIndex < actualStartFrame || frameIndex > actualEndFrame) {
                if (!this.isAnimationLooping) {
                    return;
                }
                const currentAnim = this.sprite.anims.currentAnim;
                const targetFrame = currentAnim?.frames?.find((f: Phaser.Animations.AnimationFrame) => f.index === actualStartFrame)
                    ?? currentAnim?.frames?.[actualStartFrame];
                if (targetFrame?.frame) {
                    this._isHandlingFrameLimit = true;
                    try {
                        this.sprite.anims.setCurrentFrame(targetFrame);
                    } finally {
                        this._isHandlingFrameLimit = false;
                    }
                }
            }
            return;
        }

        // Handle FullFrame animation type (default behavior)
        // Only apply frame limiting for looping animations
        if (!this.isAnimationLooping) {
            return;
        }

        if (this.directionStartFrame === undefined || this.directionEndFrame === undefined) {
            return;
        }

        if (frameIndex < this.directionStartFrame || frameIndex > this.directionEndFrame) {
            const currentAnim = this.sprite.anims.currentAnim;
            if (currentAnim && currentAnim.frames) {
                const targetFrame = currentAnim.frames.find((f: any) => {
                    const fIndex = typeof f.textureFrame === 'number' ? f.textureFrame :
                        (f.frame?.name ? parseInt(f.frame.name, 10) : f.index);
                    return fIndex === this.directionStartFrame;
                });

                if (targetFrame) {
                    this._isHandlingFrameLimit = true;
                    try {
                        this.sprite.anims.setCurrentFrame(targetFrame);
                    } finally {
                        this._isHandlingFrameLimit = false;
                    }
                }
            }
        }
    }

    /**
     * Called when the animation reaches a new frame.
     * Subclasses can override this to handle frame-specific logic (e.g., playing sounds at specific frames).
     *
     * @param relativeFrameIndex - Frame index relative to the current direction (0-7 for 8-frame directions)
     */
    protected onAnimationFrameChange(_relativeFrameIndex: number): void {
        // Default implementation does nothing
        // Subclasses can override this to handle frame changes
    }

    /**
     * Detects frame changes and invokes the protected hook and config callback.
     */
    private emitAnimationFrameChange(frame: Phaser.Animations.AnimationFrame): void {
        const frameName = frame.textureFrame ?? frame.frame?.name ?? frame.index;
        const absoluteFrameIndex = typeof frameName === 'number' ? frameName : parseInt(frameName, 10);

        if (absoluteFrameIndex === this.previousFrameIndex) {
            return;
        }
        this.previousFrameIndex = absoluteFrameIndex;

        // For SubFrame animations, account for animationFrameStartIndex so relative frame
        // is 0-based within the animation sequence
        const animationStartFrame = this.directionStartFrame !== undefined
            ? this.directionStartFrame + (this.animationType === AnimationType.SubFrame ? this.animationFrameStartIndex : 0)
            : 0;
        const relativeFrameIndex = this.directionStartFrame !== undefined
            ? absoluteFrameIndex - animationStartFrame
            : absoluteFrameIndex;

        this.onAnimationFrameChange(relativeFrameIndex);
        if (this._constructionComplete) {
            this.onAnimationFrameChangeCallback?.(relativeFrameIndex);
        }
    }

    /**
     * Called when a non-looping animation has finished playing.
     * Subclasses can override this to handle animation completion (e.g., for attack/death animations).
     */
    protected animationFinished(): void {
        // Default implementation does nothing
    }

    /**
     * Gets the current relative frame position (0-7) within the current direction.
     * Returns undefined if no animation is playing or direction frame ranges are not set.
     *
     * @returns The relative frame index (0-7) or undefined
     */
    public getCurrentRelativeFrame(): number | undefined {
        if (!this.sprite.anims?.isPlaying || this.directionStartFrame === undefined) {
            return undefined;
        }

        const currentFrame = this.sprite.anims.currentFrame;
        if (!currentFrame) {
            return undefined;
        }

        const frameName = currentFrame.textureFrame ?? currentFrame.frame?.name ?? currentFrame.index;
        const absoluteFrameIndex = typeof frameName === 'number' ? frameName : parseInt(frameName, 10);

        const animationStartFrame = this.directionStartFrame + (this.animationType === AnimationType.SubFrame ? this.animationFrameStartIndex : 0);
        return absoluteFrameIndex - animationStartFrame;
    }

    /**
     * Plays a specific animation with a specific direction.
     * This is an atomic operation that updates direction frame ranges, pivot data, and plays the animation.
     *
     * @param animationKey - The animation key to play (format: {name}-{index})
     * @param direction - The direction index (0-7)
     * @param frameRate - Optional frame rate for animation (default: 10)
     * @param relativeFrame - Optional relative frame position (0-7) to start from within the direction
     * @param repeat - Optional repeat count (0 = play once, undefined = loop)
     * @param framesPerDirection - Optional number of frames per direction (default: 8)
     * @param animationType - Optional animation type (default: current animation type)
     * @param animationFrameStartIndex - Optional starting frame index for SubFrame animations (default: 0)
     * @param isLooping - Optional looping behavior (default: true, or false if repeat is 0)
     */
    public playAnimationWithDirection(
        animationKey: string,
        direction: number,
        frameRate = 10,
        relativeFrame?: number,
        repeat?: number,
        framesPerDirection?: number,
        animationType?: AnimationType,
        animationFrameStartIndex?: number,
        isLooping?: boolean,
    ): void {
        if (!this.sprite || !this.sprite.anims) {
            return;
        }
        try {
            if (!this.scene.anims.exists(animationKey)) {
                console.warn(`Animation key "${animationKey}" does not exist`);
                return;
            }

            // Extract sprite name and sheet index from animation key
            // Format: {name}-{index}
            const match = animationKey.match(/^(.+)-(\d+)$/);
            if (match) {
                const spriteName = match[1];
                const spriteSheetIndex = parseInt(match[2], 10);

                // Update pivot data for the new spritesheet
                const pivotData = getPivotData(spriteName);
                if (pivotData && pivotData.spriteSheetPivots[spriteSheetIndex]) {
                    this.spriteSheetPivots = pivotData.spriteSheetPivots[spriteSheetIndex];
                } else {
                    this.spriteSheetPivots = undefined;
                }
            }

            // Update animation type and start index if provided
            if (animationType !== undefined) {
                this.animationType = animationType;
            }
            if (animationFrameStartIndex !== undefined) {
                this.animationFrameStartIndex = animationFrameStartIndex;
            }

            // Update direction frame ranges BEFORE playing
            const actualFramesPerDirection = framesPerDirection ?? 8;
            this.directionStartFrame = direction * actualFramesPerDirection;
            this.directionEndFrame = this.directionStartFrame + actualFramesPerDirection - 1;

            // Calculate the absolute frame index to start from
            let startFrame: number;
            if (this.animationType === AnimationType.SubFrame) {
                startFrame = this.directionStartFrame + this.animationFrameStartIndex;
                if (relativeFrame !== undefined) {
                    startFrame += Math.max(0, Math.min(actualFramesPerDirection - this.animationFrameStartIndex - 1, relativeFrame));
                }
            } else {
                startFrame = relativeFrame !== undefined
                    ? this.directionStartFrame + Math.max(0, Math.min(actualFramesPerDirection - 1, relativeFrame))
                    : this.directionStartFrame;
            }

            // Stop current animation if playing to ensure clean state
            if (this.sprite.anims.isPlaying) {
                this.sprite.anims.stop();
            }

            // Reset to frame 0 when starting from a non-zero frame to avoid carryover from previous animation
            if (startFrame > 0) {
                const anim = this.scene.anims.get(animationKey);
                const firstFrame = anim?.frames?.[0];
                if (firstFrame?.frame) {
                    this.sprite.anims.setCurrentFrame(firstFrame);
                }
            }

            // Play the animation from the correct starting frame
            const playConfig: Phaser.Types.Animations.PlayAnimationConfig = {
                key: animationKey,
                startFrame: startFrame,
                frameRate: frameRate,
            };

            // Only set repeat if explicitly provided
            if (repeat !== undefined) {
                playConfig.repeat = repeat;
            }

            // Track whether this animation should loop
            if (isLooping !== undefined) {
                this.isAnimationLooping = isLooping;
            } else {
                this.isAnimationLooping = repeat === undefined || repeat !== 0;
            }

            this.sprite.play(playConfig);
        } catch (error) {
            console.error(`Error playing animation with direction for GameAsset`, this, error);
        }
    }

    /**
     * Sets the position of the asset.
     * Updates baseX and baseY, and reapplies pivot offset if applicable.
     *
     * @param x - The new x coordinate (in pixel coordinates)
     * @param y - The new y coordinate (in pixel coordinates)
     */
    public setPosition(x: number, y: number): void {
        this.baseX = x;
        this.baseY = y;

        // Re-apply pivot offset based on current frame
        if (this.sprite.frame) {
            const frameName = this.sprite.frame.name;
            const frameIndex = typeof frameName === 'number' ? frameName : parseInt(frameName, 10);
            this.applyPivotOffset(frameIndex);
        } else {
            this.sprite.setPosition(x, y);
        }
    }

    /**
     * Sets the depth of the sprite for proper rendering order.
     * Higher depth values render on top of lower depth values.
     *
     * @param depth - The depth value to set
     */
    public setDepth(depth: number): void {
        this.sprite.setDepth(depth);
    }

    /**
     * Gets the current depth of the sprite.
     *
     * @returns The depth value
     */
    public getDepth(): number {
        return this.sprite.depth;
    }

    /**
     * Returns true if this asset's sprite animation is currently playing.
     *
     * @returns True when animation is playing, false when stopped or no animation exists
     */
    public isAnimationPlaying(): boolean {
        return this.sprite?.anims?.isPlaying ?? false;
    }

    /**
     * Sets the alpha transparency of the sprite.
     *
     * @param alpha - The alpha value (0-1)
     */
    public setAlpha(alpha: number): void {
        this.sprite.setAlpha(alpha);
    }

    /**
     * Sets the visibility of the sprite.
     *
     * @param visible - Whether the sprite should be visible
     */
    public setVisible(visible: boolean): void {
        this.sprite.setVisible(visible);
    }

    /**
     * Gets the bounding rectangle of the sprite in world coordinates.
     *
     * @returns A rectangle object with x, y, width, height
     */
    public getBounds(): { x: number; y: number; width: number; height: number } {
        const bounds = this.sprite.getBounds();
        return {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
        };
    }

    /**
     * Gets the current sprite name.
     * @returns The sprite name without extension
     */
    public getSpriteName(): string {
        return this.spriteName;
    }

    /**
     * Changes the sprite name for subsequent animations.
     * Used for sprite overrides in monster animations.
     * The actual texture change happens when playAnimationWithDirection is called.
     * @param newSpriteName - The new sprite name (without extension)
     */
    public setSpriteName(newSpriteName: string): void {
        this.spriteName = newSpriteName;
    }

    /**
     * Destroys the GameAsset and cleans up all associated resources.
     * Removes event listeners and destroys the sprite.
     */
    public destroy(): void {
        this.sprite.destroy();
    }
}
