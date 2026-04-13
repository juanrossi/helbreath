import { ASSET_BASE } from '../../env';

/**
 * HudBar — Phaser-rendered bottom bar using the Barra1024 spritesheet.
 *
 * All positions derived from the C++ DrawDialogBox_IconPannel/GaugePannel:
 *   EP client 640x480 coords + 192 x-offset for 1024 bar.
 *   Bar background origin at (0, 0) in bar-local space.
 *   All icon/bar y values are bar-local (screen_y - 423).
 */
export class HudBar {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;

  // Bar fill sprites (actual spritesheet frames, cropped for fill)
  private hpFillSprite!: Phaser.GameObjects.Image;
  private mpFillSprite!: Phaser.GameObjects.Image;
  private spFillSprite!: Phaser.GameObjects.Image;

  // Crop rects for dynamic fill
  private hpCropRect!: Phaser.Geom.Rectangle;
  private mpCropRect!: Phaser.Geom.Rectangle;
  private spCropRect!: Phaser.Geom.Rectangle;

  // Combat mode overlay (frame 5 = attack, hidden when REST)
  private attackIcon!: Phaser.GameObjects.Image;

  // Text labels
  private hpText!: Phaser.GameObjects.Text;
  private mpText!: Phaser.GameObjects.Text;
  private locationText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  // Button sprites (visual only, inside container)
  private buttons: Map<string, Phaser.GameObjects.Image> = new Map();
  private callbacks: Map<string, () => void> = new Map();

  // ── Layout constants ──────────────────────────────────────────────
  // All in native 1024-bar-local coordinates.
  // Derived: EP 640 coords + xoff=192, bar_y = 480-57 = 423
  private static readonly BAR_W = 1024;
  private static readonly BAR_H = 57;
  private static readonly XOFF = 192; // (1024-640)/2

  // HP fill: frame 12 at EP(23,437) -> 1024-local(215, 14)
  private static readonly HP_X = 23 + 192;  // 215
  private static readonly HP_Y = 437 - 423; // 14
  private static readonly HP_MAX_W = 101;

  // MP fill: frame 12 at EP(23,459) -> 1024-local(215, 36)
  private static readonly MP_X = 23 + 192;  // 215
  private static readonly MP_Y = 459 - 423; // 36
  private static readonly MP_MAX_W = 101;

  // SP fill: frame 13 at EP(147,435) -> 1024-local(339, 12)
  private static readonly SP_X = 147 + 192; // 339
  private static readonly SP_Y = 435 - 423; // 12
  private static readonly SP_MAX_W = 167;

  // HP number text: EP(85,441) -> 1024-local(277, 18)
  private static readonly HP_NUM_X = 85 + 192;  // 277
  private static readonly HP_NUM_Y = 441 - 423; // 18

  // MP number text: EP(85,463) -> 1024-local(277, 40)
  private static readonly MP_NUM_X = 85 + 192;  // 277
  private static readonly MP_NUM_Y = 463 - 423; // 40

  // Attack mode icon: frame 5 at EP(368,440) -> 1024-local(560, 17)
  private static readonly ATTACK_X = 368 + 192; // 560
  private static readonly ATTACK_Y = 440 - 423; // 17

  // Buttons: frame origins (top-left) at bar-local y=11, 37px spacing
  // EP coords: 412,449,486,523,560,597 (all y=434 -> bar-local 11)
  private static readonly BTN_Y = 434 - 423; // 11
  private static readonly BTN_POSITIONS: { key: string; frame: string; x: number }[] = [
    { key: 'character', frame: 'spr0_f6',  x: 412 + 192 }, // 604
    { key: 'inventory', frame: 'spr0_f7',  x: 449 + 192 }, // 641
    { key: 'magic',     frame: 'spr0_f8',  x: 486 + 192 }, // 678
    { key: 'skills',    frame: 'spr0_f9',  x: 523 + 192 }, // 715
    { key: 'chat',      frame: 'spr0_f10', x: 560 + 192 }, // 752
    { key: 'system',    frame: 'spr0_f11', x: 597 + 192 }, // 789
  ];

  private scale = 1;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  load(): void {
    if (!this.scene.textures.exists('barra1024')) {
      this.scene.load.atlas(
        'barra1024',
        `${ASSET_BASE}/assets/spritesheets/Barra1024.png`,
        `${ASSET_BASE}/assets/spritesheets/Barra1024.json`,
      );
    }
  }

  create(): void {
    const cam = this.scene.cameras.main;
    this.scale = cam.width / HudBar.BAR_W;
    const barScreenH = HudBar.BAR_H * this.scale;

    // Container: fixed to bottom of screen, scaled to fit game width.
    // Depth just needs to beat tree/NPC depths which use tileY * 100.
    // Map is max ~512 tiles, so max depth ≈ 51200. Use 90000.
    this.container = this.scene.add.container(0, cam.height - barScreenH);
    this.container.setScrollFactor(0);
    this.container.setScale(this.scale);
    this.container.setDepth(90000);

    // ── 1. Bar background (frame 14) ────────────────────────────────
    const bg = this.scene.add.image(0, 0, 'barra1024', 'spr0_f14')
      .setOrigin(0, 0);
    this.container.add(bg);

    // ── 2. HP / MP / SP bar fills ───────────────────────────────────
    this.hpFillSprite = this.scene.add.image(HudBar.HP_X, HudBar.HP_Y, 'barra1024', 'spr0_f12')
      .setOrigin(0, 0).setTint(0xff4444);
    this.hpCropRect = new Phaser.Geom.Rectangle(0, 0, HudBar.HP_MAX_W, 16);
    this.hpFillSprite.setCrop(this.hpCropRect);

    this.mpFillSprite = this.scene.add.image(HudBar.MP_X, HudBar.MP_Y, 'barra1024', 'spr0_f12')
      .setOrigin(0, 0).setTint(0x4466ff);
    this.mpCropRect = new Phaser.Geom.Rectangle(0, 0, HudBar.MP_MAX_W, 16);
    this.mpFillSprite.setCrop(this.mpCropRect);

    this.spFillSprite = this.scene.add.image(HudBar.SP_X, HudBar.SP_Y, 'barra1024', 'spr0_f13')
      .setOrigin(0, 0);
    this.spCropRect = new Phaser.Geom.Rectangle(0, 0, HudBar.SP_MAX_W, 11);
    this.spFillSprite.setCrop(this.spCropRect);

    this.container.add([this.hpFillSprite, this.mpFillSprite, this.spFillSprite]);

    // ── 3. Text labels ──────────────────────────────────────────────
    // In the container, everything is scaled by 0.625, so use larger
    // font sizes so they're readable on screen (~9-11px rendered).
    const numStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    };

    // HP value — C++ PutString_SprNum at (277, 18)
    this.hpText = this.scene.add.text(HudBar.HP_NUM_X, HudBar.HP_NUM_Y, '', numStyle)
      .setOrigin(0.5, 0);
    this.container.add(this.hpText);

    // MP value — C++ PutString_SprNum at (277, 40)
    this.mpText = this.scene.add.text(HudBar.MP_NUM_X, HudBar.MP_NUM_Y, '', numStyle)
      .setOrigin(0.5, 0);
    this.container.add(this.mpText);

    // Location text — in the brown text area below SP bar
    this.locationText = this.scene.add.text(
      HudBar.SP_X + HudBar.SP_MAX_W / 2, 38, '',
      { ...numStyle, fontSize: '14px', color: '#cccccc', strokeThickness: 2 },
    ).setOrigin(0.5, 0.5);
    this.container.add(this.locationText);

    // Level text — overlaid on the attack mode area
    this.levelText = this.scene.add.text(
      HudBar.ATTACK_X + 15, HudBar.ATTACK_Y + 14, '',
      { ...numStyle, fontSize: '20px', color: '#ffffff', strokeThickness: 4 },
    ).setOrigin(0.5, 0.5);

    // ── 4. Attack mode icon (frame 5) ───────────────────────────────
    // Shown when in combat mode, hidden in rest mode.
    // Frame 5 = red cross (attack), frame 4 = blue (safe attack)
    this.attackIcon = this.scene.add.image(
      HudBar.ATTACK_X, HudBar.ATTACK_Y, 'barra1024', 'spr0_f5',
    ).setOrigin(0, 0).setVisible(false);
    this.container.add(this.attackIcon);
    this.container.add(this.levelText);

    // ── 5. Button icons (visual only, in container) ────────────────
    // Buttons are NOT interactive Phaser objects because scrollFactor(0)
    // containers break Phaser's hit testing when the camera is scrolled.
    // Instead, handleClick() is called from the scene's pointerdown handler.
    for (const btn of HudBar.BTN_POSITIONS) {
      const img = this.scene.add.image(btn.x, HudBar.BTN_Y, 'barra1024', btn.frame)
        .setOrigin(0, 0);
      this.buttons.set(btn.key, img);
      this.container.add(img);
    }

    // Initial state
    this.setHP(1);
    this.setMP(1);
    this.setSP(0);
  }

  // ── Public API ──────────────────────────────────────────────────────

  private get ready(): boolean { return !!this.container; }

  updateHP(current: number, max: number): void {
    if (!this.ready) return;
    this.setHP(max > 0 ? Math.max(0, Math.min(current / max, 1)) : 0);
    this.hpText.setText(`${current}`);
  }

  updateMP(current: number, max: number): void {
    if (!this.ready) return;
    this.setMP(max > 0 ? Math.max(0, Math.min(current / max, 1)) : 0);
    this.mpText.setText(`${current}`);
  }

  updateEXP(ratio: number): void {
    if (!this.ready) return;
    this.setSP(Math.max(0, Math.min(ratio, 1)));
  }

  updateLocation(mapName: string, x: number, y: number): void {
    if (!this.ready) return;
    this.locationText.setText(`${mapName}(${x},${y})`);
  }

  updateLevel(level: number): void {
    if (!this.ready) return;
    this.levelText.setText(`${level}`);
  }

  /** Show/hide the attack mode icon (frame 5 = red cross). */
  updateCombatMode(isAttack: boolean): void {
    if (!this.ready) return;
    this.attackIcon.setVisible(isAttack);
  }

  on(buttonKey: string, callback: () => void): void {
    this.callbacks.set(buttonKey, callback);
  }

  getScreenHeight(): number {
    return HudBar.BAR_H * this.scale;
  }

  isInBarArea(gameY: number): boolean {
    return gameY >= this.scene.cameras.main.height - this.getScreenHeight();
  }

  /**
   * Handle a click at game coordinates (pointer.y already in game space).
   * Call this from the scene's pointerdown handler when isInBarArea is true.
   * Returns true if a button was clicked (so the caller can skip movement).
   */
  handleClick(gameX: number, gameY: number): boolean {
    if (!this.ready) return false;

    // Convert game coords to bar-local 1024-space coords
    const barTop = this.scene.cameras.main.height - this.getScreenHeight();
    const localX = (gameX) / this.scale;
    const localY = (gameY - barTop) / this.scale;

    // Check each button (36x44 hit area from top-left origin)
    for (const btn of HudBar.BTN_POSITIONS) {
      if (localX >= btn.x && localX <= btn.x + 36 &&
          localY >= HudBar.BTN_Y && localY <= HudBar.BTN_Y + 44) {
        // Visual feedback
        const img = this.buttons.get(btn.key);
        if (img) {
          img.setAlpha(0.6);
          this.scene.time.delayedCall(150, () => img.setAlpha(1));
        }
        // Fire callback
        const cb = this.callbacks.get(btn.key);
        if (cb) cb();
        return true;
      }
    }

    // Check attack mode icon area (toggle combat when clicking compass area)
    if (localX >= HudBar.ATTACK_X && localX <= HudBar.ATTACK_X + 43 &&
        localY >= HudBar.ATTACK_Y - 6 && localY <= HudBar.ATTACK_Y + 38) {
      const cb = this.callbacks.get('combatToggle');
      if (cb) cb();
      return true;
    }

    return false;
  }

  destroy(): void {
    if (this.container) this.container.destroy(true);
  }

  // ── Private fill helpers ────────────────────────────────────────────

  private setHP(ratio: number): void {
    this.hpCropRect.width = Math.round(HudBar.HP_MAX_W * ratio);
    this.hpFillSprite.setCrop(this.hpCropRect);
  }

  private setMP(ratio: number): void {
    this.mpCropRect.width = Math.round(HudBar.MP_MAX_W * ratio);
    this.mpFillSprite.setCrop(this.mpCropRect);
  }

  private setSP(ratio: number): void {
    this.spCropRect.width = Math.round(HudBar.SP_MAX_W * ratio);
    this.spFillSprite.setCrop(this.spCropRect);
  }
}
