import { ItemInstanceData } from '../../network/MessageHandler';
import { ItemSpriteExtractor } from '../../utils/ItemSpriteExtractor';

export interface CharacterData {
  name: string;
  level: number;
  exp: number;
  hp: number; maxHp: number;
  mp: number; maxMp: number;
  sp: number; maxSp: number;
  str: number; vit: number; dex: number;
  int: number; mag: number; chr: number;
  luPool: number;
  ekCount: number;
  equipment: ItemInstanceData[];
  xpForLevel: (level: number) => number;
}

export interface CharacterCallbacks {
  onUnequip: (equipSlot: number) => void;
  onEquipFromBag: (bagSlot: number) => void;
  onAllocStat: (statType: number, points: number) => void;
  onClose: () => void;
  onRefreshPortrait: (cb: (url: string | null) => void) => void;
}

const RING_SIZE = 36;
const PORTRAIT_W = 140;
const PORTRAIT_H = 196;
// Extra space below portrait for accessory row (necklace + 2 rings)
const PORTRAIT_AREA_H = PORTRAIT_H + RING_SIZE + 14;

const SLOT_NAMES = ['', 'Weapon', 'Shield', 'Helm', 'Body', 'Legs', 'Boots', 'Cape', 'Neck', 'Ring L', 'Ring R'];

// Accessory row: 3 slots centered below portrait
const _accLeft = Math.round((PORTRAIT_W - RING_SIZE * 3 - 8) / 2);
// Ring positions around the portrait (top-left of the RING_SIZExRING_SIZE ring div)
const RING_POSITIONS: Array<{ slot: number; top: string; left: string }> = [
  { slot: 3, top: '0px',    left: `${(PORTRAIT_W - RING_SIZE) / 2}px` },  // Helm – top center
  { slot: 1, top: '68px',   left: '0px' },                                  // Weapon – left
  { slot: 4, top: '68px',   left: `${(PORTRAIT_W - RING_SIZE) / 2}px` },  // Body – center
  { slot: 2, top: '68px',   left: `${PORTRAIT_W - RING_SIZE}px` },         // Shield – right
  { slot: 5, top: '136px',  left: '4px' },                                  // Legs – lower-left
  { slot: 7, top: '136px',  left: `${PORTRAIT_W - RING_SIZE}px` },         // Cape – lower-right
  { slot: 6, top: '160px',  left: `${(PORTRAIT_W - RING_SIZE) / 2}px` },  // Boots – bottom center
  // Accessory row below portrait
  { slot: 9,  top: `${PORTRAIT_H + 4}px`, left: `${_accLeft}px` },               // Ring L
  { slot: 8,  top: `${PORTRAIT_H + 4}px`, left: `${_accLeft + RING_SIZE + 4}px` }, // Necklace
  { slot: 10, top: `${PORTRAIT_H + 4}px`, left: `${_accLeft + (RING_SIZE + 4) * 2}px` }, // Ring R
];

const PANEL_STYLE = [
  'position:fixed',
  'top:50%',
  'left:20px',
  'transform:translateY(-50%)',
  'z-index:200',
  'background:linear-gradient(135deg,#1a1208 0%,#0e0c05 50%,#1a1208 100%)',
  'color:#e8d5b0',
  'padding:10px',
  'font-size:11px',
  'font-family:serif',
  'width:420px',
  'border:2px solid #7a5a2a',
  'border-radius:6px',
  'box-shadow:0 0 20px rgba(0,0,0,0.8)',
  'user-select:none',
].join(';');

export class CharacterInfoPanel {
  private el: HTMLDivElement;
  private callbacks: CharacterCallbacks;
  private extractor: ItemSpriteExtractor;
  private female: boolean;
  private tooltip: HTMLDivElement;
  private portraitImg: HTMLImageElement | null = null;

  constructor(extractor: ItemSpriteExtractor, female: boolean, callbacks: CharacterCallbacks) {
    this.extractor = extractor;
    this.female = female;
    this.callbacks = callbacks;

    this.el = document.createElement('div');
    this.el.id = 'stats-panel';
    this.el.style.cssText = PANEL_STYLE;

    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = [
      'position:fixed', 'z-index:300',
      'background:rgba(10,8,5,0.95)', 'border:1px solid #7a5a2a',
      'color:#e8d5b0', 'padding:4px 8px', 'font-size:10px', 'font-family:serif',
      'border-radius:3px', 'pointer-events:none', 'display:none', 'white-space:nowrap',
    ].join(';');
    document.body.appendChild(this.tooltip);
  }

  show(data: CharacterData): void {
    this.rebuild(data);
    if (!this.el.parentElement) document.body.appendChild(this.el);
    // Only fall back to canvas snapshot if dialogtext portrait wasn't available
    if (this.portraitImg && !this.portraitImg.src) {
      this.callbacks.onRefreshPortrait((url) => {
        if (this.portraitImg && url) this.portraitImg.src = url;
      });
    }
  }

  hide(): void {
    this.el.remove();
    this.tooltip.style.display = 'none';
  }

  get visible(): boolean { return !!this.el.parentElement; }

  refresh(data: CharacterData): void {
    if (this.visible) this.rebuild(data);
  }

  private rebuild(data: CharacterData): void {
    this.el.innerHTML = '';
    this.portraitImg = null;

    // ── Header ──────────────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;border-bottom:1px solid #7a5a2a;padding-bottom:5px;';
    header.innerHTML = `
      <span style="color:#e8c87a;font-size:13px;font-weight:bold;letter-spacing:1px;">Character Info.</span>
      <button id="char-close" style="background:none;border:1px solid #7a5a2a;color:#e8d5b0;cursor:pointer;padding:2px 8px;border-radius:3px;font-size:11px;">✕</button>
    `;
    this.el.appendChild(header);
    header.querySelector('#char-close')!.addEventListener('click', () => this.callbacks.onClose());

    // ── Name & Status row ────────────────────────────────────────────────────
    const nameRow = document.createElement('div');
    nameRow.style.cssText = 'display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;font-size:11px;border-bottom:1px solid #3a2a1a;padding-bottom:4px;';
    nameRow.innerHTML = `
      <span style="color:#fff;font-weight:bold;">${data.name}</span>
      <span style="color:#c0a060;">Name &amp; Status</span>
    `;
    this.el.appendChild(nameRow);

    // ── Equipment & Characteristics section header ───────────────────────────
    const eqHeader = document.createElement('div');
    eqHeader.style.cssText = 'text-align:center;color:#c0a060;font-size:10px;letter-spacing:1px;margin-bottom:6px;';
    eqHeader.textContent = 'Equipment & Characteristics';
    this.el.appendChild(eqHeader);

    // ── Two-column body ──────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.style.cssText = 'display:flex;gap:10px;margin-bottom:6px;';

    // Left column: portrait + equipment rings
    const leftCol = document.createElement('div');
    leftCol.style.cssText = `position:relative;width:${PORTRAIT_W + 20}px;flex-shrink:0;`;

    const portraitArea = document.createElement('div');
    portraitArea.style.cssText = [
      `width:${PORTRAIT_W}px`,
      `height:${PORTRAIT_AREA_H}px`,
      'position:relative',
      'background:linear-gradient(135deg,#1e1810,#0c0a08)',
      'border:1px solid #3a2a1a',
      'border-radius:4px',
      'overflow:visible',
      'margin:0 auto',
    ].join(';');

    // Portrait image — dialogtext.spr sheet 0, fallback to canvas snapshot
    const img = document.createElement('img');
    img.style.cssText = `width:${PORTRAIT_W}px;height:${PORTRAIT_H}px;object-fit:contain;display:block;image-rendering:pixelated;border-radius:3px;`;
    img.alt = '';
    const dialogUrl = this.extractor.getPortraitDataURL(this.female);
    if (dialogUrl) img.src = dialogUrl;
    this.portraitImg = img;
    portraitArea.appendChild(img);

    // Equipment rings overlaid on portrait
    for (const { slot, top, left } of RING_POSITIONS) {
      const eq = data.equipment.find(e => e.slotIndex === slot);
      this.buildRing(portraitArea, slot, eq, top, left, data);
    }

    leftCol.appendChild(portraitArea);
    body.appendChild(leftCol);

    // Right column: stats
    const rightCol = document.createElement('div');
    rightCol.style.cssText = 'flex:1;min-width:0;';

    // Stats table
    const statsTable = document.createElement('div');
    statsTable.style.cssText = 'font-size:10px;line-height:1.6;';

    const addRow = (label: string, value: string, valueColor = '#e8d5b0') => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;padding:1px 4px;border-bottom:1px solid #1a1208;';
      row.innerHTML = `<span style="color:#a08060;">${label}</span><span style="color:${valueColor};font-weight:bold;">${value}</span>`;
      statsTable.appendChild(row);
    };

    const currentLevelXP = data.xpForLevel(data.level);
    const nextLevelXP = data.xpForLevel(data.level + 1);
    const xpIntoLevel = data.exp - currentLevelXP;
    const xpNeeded = Math.max(nextLevelXP - currentLevelXP, 1);

    addRow('Level', String(data.level), '#FFD700');
    addRow('EXP', data.exp.toLocaleString());
    addRow('Next EXP', nextLevelXP.toLocaleString());

    // XP progress mini-bar
    const xpPct = Math.min(Math.round((xpIntoLevel / xpNeeded) * 100), 100);
    const xpBar = document.createElement('div');
    xpBar.style.cssText = 'padding:2px 4px;margin-bottom:2px;';
    xpBar.innerHTML = `<div style="height:5px;background:#1a1208;border:1px solid #3a2a1a;border-radius:2px;overflow:hidden;"><div style="height:100%;width:${xpPct}%;background:linear-gradient(to right,#b06000,#e08020);"></div></div>`;
    statsTable.appendChild(xpBar);

    addRow('Health', `${data.hp}/${data.maxHp}`, '#e74c3c');
    addRow('Mana', `${data.mp}/${data.maxMp}`, '#3498db');
    addRow('Stamina', `${data.sp}/${data.maxSp}`, '#2ecc71');
    addRow('EK.Count', String(data.ekCount));

    if (data.luPool > 0) {
      const luBanner = document.createElement('div');
      luBanner.style.cssText = 'margin:4px 0;padding:3px;background:rgba(155,89,182,0.15);border:1px solid #9b59b6;border-radius:2px;color:#d4a0ff;text-align:center;font-size:9px;';
      luBanner.textContent = `${data.luPool} Stat Point${data.luPool !== 1 ? 's' : ''}`;
      statsTable.appendChild(luBanner);
    }

    rightCol.appendChild(statsTable);
    body.appendChild(rightCol);
    this.el.appendChild(body);

    // ── Stats grid ───────────────────────────────────────────────────────────
    const statsGrid = document.createElement('div');
    statsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:5px;background:rgba(0,0,0,0.3);border:1px solid #3a2a1a;border-radius:3px;';

    const stats = [
      { key: 1, name: 'Str.', val: data.str },
      { key: 4, name: 'Int.', val: data.int },
      { key: 2, name: 'Vit.', val: data.vit },
      { key: 3, name: 'Dex.', val: data.dex },
      { key: 5, name: 'Mag.', val: data.mag },
      { key: 6, name: 'Chr.', val: data.chr },
    ];
    const btnStyle = 'font-size:8px;cursor:pointer;padding:1px 4px;border:1px solid #5a3a1a;border-radius:2px;background:#2a1a08;color:#c8a870;margin-left:2px;';

    for (const stat of stats) {
      const cell = document.createElement('div');
      cell.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:2px 4px;background:rgba(0,0,0,0.25);border-radius:2px;font-size:10px;';
      cell.innerHTML = `<span><span style="color:#a08060;">${stat.name}</span> <strong style="color:#fff;">${stat.val}</strong></span>`;
      if (data.luPool > 0) {
        const btn = document.createElement('button');
        btn.style.cssText = btnStyle;
        btn.textContent = '+1';
        btn.addEventListener('click', () => this.callbacks.onAllocStat(stat.key, 1));
        cell.appendChild(btn);
      }
      statsGrid.appendChild(cell);
    }
    this.el.appendChild(statsGrid);
  }

  private buildRing(
    parent: HTMLElement,
    slot: number,
    eq: ItemInstanceData | undefined,
    top: string,
    left: string,
    data: CharacterData,
  ): void {
    const hasItem = !!eq;
    const ring = document.createElement('div');
    ring.style.cssText = [
      'position:absolute',
      `top:${top}`,
      `left:${left}`,
      `width:${RING_SIZE}px`,
      `height:${RING_SIZE}px`,
      'border-radius:50%',
      'border:2px solid ' + (hasItem ? '#c8a020' : '#6a5030'),
      'background:' + (hasItem ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)'),
      'overflow:hidden',
      'cursor:' + (hasItem ? 'pointer' : 'copy'),
      'z-index:2',
      'box-sizing:border-box',
      // Drop zone highlight transition
      'transition:border-color 0.15s',
    ].join(';');

    if (hasItem) {
      ring.innerHTML = this.extractor.renderItemInCell(eq!.itemId, RING_SIZE, this.female);
      ring.addEventListener('mouseenter', (e) => {
        let tip = eq!.name;
        if (eq!.maxDurability > 0) tip += ` (${eq!.durability}/${eq!.maxDurability})`;
        tip += `\nClick to unequip`;
        this.tooltip.textContent = tip;
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${e.clientX + 12}px`;
        this.tooltip.style.top = `${e.clientY + 12}px`;
      });
      ring.addEventListener('mouseleave', () => { this.tooltip.style.display = 'none'; });
      ring.addEventListener('click', () => this.callbacks.onUnequip(slot));
    } else {
      // Empty slot label
      const lbl = document.createElement('div');
      lbl.style.cssText = 'position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-size:7px;color:#6a5030;white-space:nowrap;';
      lbl.textContent = SLOT_NAMES[slot]!;
      parent.appendChild(lbl);
    }

    // Drop zone for drag-and-drop from inventory
    ring.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
      ring.style.borderColor = '#FFD700';
      ring.style.background = 'rgba(255,215,0,0.15)';
    });
    ring.addEventListener('dragleave', () => {
      ring.style.borderColor = hasItem ? '#c8a020' : '#6a5030';
      ring.style.background = hasItem ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)';
    });
    ring.addEventListener('drop', (e) => {
      e.preventDefault();
      ring.style.borderColor = hasItem ? '#c8a020' : '#6a5030';
      ring.style.background = hasItem ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)';
      const bagSlot = parseInt(e.dataTransfer!.getData('text/plain'));
      if (!isNaN(bagSlot)) this.callbacks.onEquipFromBag(bagSlot);
    });

    parent.appendChild(ring);
  }

  destroy(): void {
    this.el.remove();
    this.tooltip.remove();
  }
}
