import Phaser from 'phaser';
import { ITEM_DEFS } from '../constants/ItemDefs';
import { ASSET_BASE } from '../env';

/** CSS properties that render an item sprite from the item-pack atlas. */
export interface ItemSpriteCSS {
  width: string;
  height: string;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundSize: string;
  backgroundRepeat: string;
}

/** Slot-level info for scaled rendering inside a fixed-size cell. */
export interface ItemCellStyle {
  css: ItemSpriteCSS;
  /** scale factor to fit inside the cell (<=1) */
  scale: number;
}

/** Fallback color per item type for items without inventory sprites. */
const TYPE_COLOR: Record<string, string> = {
  weapon: '#a0a0b0',
  shield: '#7090b0',
  helm: '#b08860',
  body: '#806040',
  leggings: '#705030',
  boots: '#604020',
  cape: '#805080',
  potion: '#cc4444',
  material: '#888860',
  necklace: '#c0a040',
  ring: '#d0b060',
  misc: '#666666',
};

export class ItemSpriteExtractor {
  constructor(private scene: Phaser.Scene) {}

  /**
   * Returns CSS for displaying an item's inventory sprite.
   * Uses item-packb for female gender when female overrides are defined.
   * Returns null if the item has no inventory sprite data.
   */
  getItemCSS(itemId: number, female = false): ItemSpriteCSS | null {
    const def = ITEM_DEFS.get(itemId);
    if (!def) return null;

    const hasFemaleOverride = def.inventorySheetIndexFemale !== undefined;
    const sheetIdx = (female && hasFemaleOverride)
      ? def.inventorySheetIndexFemale!
      : def.inventorySheetIndex;
    const spriteIdx = (female && hasFemaleOverride)
      ? (def.inventorySpriteIndexFemale ?? def.inventorySpriteIndex)
      : def.inventorySpriteIndex;

    if (sheetIdx === undefined || spriteIdx === undefined) return null;

    const frameName = `spr${sheetIdx}_f${spriteIdx}`;
    // item-packb is the female version of item-pack (same frame names, female sprite content)
    const preferredAtlas = female ? 'item-packb' : 'item-pack';

    let frame = this.scene.textures.getFrame(preferredAtlas, frameName);
    let atlasKey = preferredAtlas;

    if (!frame) {
      // Try the alternate atlas
      const altAtlas = preferredAtlas === 'item-pack' ? 'item-packb' : 'item-pack';
      frame = this.scene.textures.getFrame(altAtlas, frameName);
      atlasKey = altAtlas;
    }

    if (!frame) {
      // Try item2-pack for overflow sprites
      frame = this.scene.textures.getFrame('item2-pack', frameName);
      atlasKey = 'item2-pack';
    }

    if (!frame) return null;

    return {
      width: `${frame.cutWidth}px`,
      height: `${frame.cutHeight}px`,
      backgroundImage: `url('${ASSET_BASE}/assets/spritesheets/${atlasKey}.png')`,
      backgroundPosition: `-${frame.cutX}px -${frame.cutY}px`,
      backgroundSize: `${frame.source.width}px ${frame.source.height}px`,
      backgroundRepeat: 'no-repeat',
    };
  }

  /**
   * Returns the CSS + scale factor for rendering in a fixed-size cell.
   * The scale shrinks sprites larger than cellSize to fit.
   */
  getItemCellStyle(itemId: number, cellSize: number, female = false): ItemCellStyle | null {
    const css = this.getItemCSS(itemId, female);
    if (!css) return null;
    const w = parseInt(css.width);
    const h = parseInt(css.height);
    // Scale to fill cell — allow upscaling (up to 3x for tiny sprites) but cap to fit
    const scale = Math.min(3, (cellSize - 4) / Math.max(w, h));
    return { css, scale };
  }

  /** Returns an HTML string for displaying the item sprite inside a cell div. */
  renderItemInCell(itemId: number, cellSize: number, female = false): string {
    const style = this.getItemCellStyle(itemId, cellSize, female);
    if (!style) {
      // Fallback: colored box with abbreviated item name
      const def = ITEM_DEFS.get(itemId);
      const type = def?.type ?? 'misc';
      const color = TYPE_COLOR[type] ?? '#666';
      const abbr = def ? def.name.replace(/[^A-Z0-9+]/g, '').substring(0, 3) || def.name.substring(0, 2) : '?';
      return `<div style="width:${cellSize}px;height:${cellSize}px;background:${color};display:flex;align-items:center;justify-content:center;box-sizing:border-box;opacity:0.85;">
        <span style="color:#fff;font-size:8px;font-weight:bold;text-shadow:1px 1px 0 #000;text-align:center;line-height:1;word-break:break-all;">${abbr}</span>
      </div>`;
    }

    const { css, scale } = style;
    const w = parseInt(css.width);
    const h = parseInt(css.height);
    const scaledW = Math.round(w * scale);
    const scaledH = Math.round(h * scale);
    const offsetX = Math.round((cellSize - scaledW) / 2);
    const offsetY = Math.round((cellSize - scaledH) / 2);

    const innerStyle = [
      `width:${w}px`,
      `height:${h}px`,
      `background-image:${css.backgroundImage}`,
      `background-position:${css.backgroundPosition}`,
      `background-size:${css.backgroundSize}`,
      `background-repeat:no-repeat`,
      `transform:scale(${scale})`,
      `transform-origin:top left`,
      `position:absolute`,
      `top:${offsetY}px`,
      `left:${offsetX}px`,
    ].join(';');

    return `<div style="position:absolute;top:0;left:0;width:${cellSize}px;height:${cellSize}px;overflow:hidden;"><div style="${innerStyle}"></div></div>`;
  }

  /**
   * Returns a data URL for the character portrait from dialogtext.spr sheet 0.
   * Sheet 0 contains class portraits at 270×376px.
   * Returns null if the texture has not been loaded yet.
   */
  getPortraitDataURL(female: boolean): string | null {
    const sheetKey = 'dialogtext-0';
    if (!this.scene.textures.exists(sheetKey)) return null;

    const texture = this.scene.textures.get(sheetKey);
    // Use frame 1 for female if it exists, otherwise frame 0
    const frames = texture.frames as Record<string, Phaser.Textures.Frame>;
    const frameKey = (female && frames['1']) ? '1' : '0';
    const frame = frames[frameKey];
    if (!frame) return null;

    const src = texture.source[0]?.image as HTMLCanvasElement | undefined;
    if (!src) return null;

    const canvas = document.createElement('canvas');
    canvas.width = frame.cutWidth;
    canvas.height = frame.cutHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, 0, 0, frame.cutWidth, frame.cutHeight);
    return canvas.toDataURL();
  }

  getFallbackColor(itemId: number): string {
    const type = ITEM_DEFS.get(itemId)?.type ?? 'misc';
    return TYPE_COLOR[type] ?? '#666';
  }

  getItemName(itemId: number): string {
    return ITEM_DEFS.get(itemId)?.name ?? `Item #${itemId}`;
  }
}
