import { ItemInstanceData } from '../../network/MessageHandler';
import { ItemSpriteExtractor } from '../../utils/ItemSpriteExtractor';

const CELL_SIZE = 44;
const COLS = 8;
const ROWS = 7;
const TOTAL_SLOTS = COLS * ROWS;

export interface InventoryCallbacks {
  onEquip: (slotIndex: number) => void;
  onUnequip: (equipSlot: number) => void;
  onUse: (slotIndex: number) => void;
  onDrop: (slotIndex: number) => void;
  onClose: () => void;
}

// Slots 1-7: Weapon,Shield,Helm,Body,Legs,Boots,Cape; 8=Necklace, 9=RingL, 10=RingR
const SLOT_NAMES = ['', 'Weapon', 'Shield', 'Helm', 'Body', 'Legs', 'Boots', 'Cape', 'Neck', 'Ring L', 'Ring R'];

// Panel width: grid needs COLS*CELL + (COLS-1)*gap2 + 2*pad4 + 2*border1, plus panel padding 2*12
const PANEL_WIDTH = COLS * CELL_SIZE + (COLS - 1) * 2 + 2 * 4 + 2 + 2 * 12;

const PANEL_STYLE = [
  'position:fixed',
  'top:50%',
  'right:20px',
  'transform:translateY(-50%)',
  'z-index:200',
  'background:linear-gradient(135deg,#2a1a0a 0%,#1a0e05 50%,#2a1a0a 100%)',
  'color:#e8d5b0',
  'padding:12px',
  'font-size:11px',
  'font-family:serif',
  `width:${PANEL_WIDTH}px`,
  'border:2px solid #7a5a2a',
  'border-radius:6px',
  'box-shadow:0 0 20px rgba(0,0,0,0.8),inset 0 0 30px rgba(0,0,0,0.3)',
  'user-select:none',
].join(';');

export class InventoryBagPanel {
  private el: HTMLDivElement;
  private callbacks: InventoryCallbacks;
  private extractor: ItemSpriteExtractor;
  private female: boolean;
  private tooltip: HTMLDivElement;
  private contextMenu: HTMLDivElement | null = null;

  constructor(extractor: ItemSpriteExtractor, female: boolean, callbacks: InventoryCallbacks) {
    this.extractor = extractor;
    this.female = female;
    this.callbacks = callbacks;

    this.el = document.createElement('div');
    this.el.id = 'inventory-panel';
    this.el.style.cssText = PANEL_STYLE;

    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = [
      'position:fixed',
      'z-index:300',
      'background:rgba(10,8,5,0.95)',
      'border:1px solid #7a5a2a',
      'color:#e8d5b0',
      'padding:4px 8px',
      'font-size:10px',
      'font-family:serif',
      'border-radius:3px',
      'pointer-events:none',
      'display:none',
      'white-space:nowrap',
    ].join(';');
    document.body.appendChild(this.tooltip);

    // Dismiss context menu on outside click
    document.addEventListener('click', (e) => {
      if (this.contextMenu && !this.contextMenu.contains(e.target as Node)) {
        this.dismissContextMenu();
      }
    });
  }

  show(items: ItemInstanceData[], equipment: ItemInstanceData[], gold: number): void {
    this.rebuild(items, equipment, gold);
    if (!this.el.parentElement) document.body.appendChild(this.el);
  }

  hide(): void {
    this.el.remove();
    this.tooltip.style.display = 'none';
    this.dismissContextMenu();
  }

  get visible(): boolean {
    return !!this.el.parentElement;
  }

  refresh(items: ItemInstanceData[], equipment: ItemInstanceData[], gold: number): void {
    if (this.visible) this.rebuild(items, equipment, gold);
  }

  private rebuild(items: ItemInstanceData[], equipment: ItemInstanceData[], gold: number): void {
    this.el.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid #7a5a2a;padding-bottom:6px;';
    header.innerHTML = `
      <span style="color:#e8c87a;font-size:13px;font-weight:bold;letter-spacing:1px;">Inventory</span>
      <button id="inv-close" style="background:none;border:1px solid #7a5a2a;color:#e8d5b0;cursor:pointer;padding:2px 8px;border-radius:3px;font-size:11px;">✕</button>
    `;
    this.el.appendChild(header);
    header.querySelector('#inv-close')!.addEventListener('click', () => this.callbacks.onClose());

    // Equipment strip (compact horizontal layout)
    const eqSection = document.createElement('div');
    eqSection.style.cssText = 'margin-bottom:8px;padding:6px;background:rgba(0,0,0,0.3);border-radius:3px;border:1px solid #5a3a1a;';
    eqSection.innerHTML = '<div style="color:#c0a060;margin-bottom:5px;font-size:10px;letter-spacing:1px;">EQUIPPED</div>';

    // Row 1: armor/weapon slots 1-7
    const eqGrid = document.createElement('div');
    eqGrid.style.cssText = `display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px;`;

    for (let slot = 1; slot <= 7; slot++) {
      eqGrid.appendChild(this.buildEquipCell(slot, equipment));
    }
    eqSection.appendChild(eqGrid);

    // Row 2: accessory slots (necklace=8, ring-left=9, ring-right=10)
    const accGrid = document.createElement('div');
    accGrid.style.cssText = `display:grid;grid-template-columns:repeat(7,1fr);gap:4px;`;
    // Empty spacers for alignment, then 3 accessory slots centered
    for (let i = 0; i < 2; i++) {
      const spacer = document.createElement('div');
      spacer.style.cssText = `width:${CELL_SIZE}px;height:${CELL_SIZE}px;`;
      accGrid.appendChild(spacer);
    }
    for (let slot = 8; slot <= 10; slot++) {
      accGrid.appendChild(this.buildEquipCell(slot, equipment));
    }
    eqSection.appendChild(accGrid);
    this.el.appendChild(eqSection);

    // Inventory grid
    const gridSection = document.createElement('div');
    gridSection.style.cssText = 'margin-bottom:8px;';

    const grid = document.createElement('div');
    grid.style.cssText = `display:grid;grid-template-columns:repeat(${COLS},${CELL_SIZE}px);gap:2px;background:rgba(0,0,0,0.2);padding:4px;border:1px solid #3a2a1a;border-radius:3px;`;

    // Map items by slotIndex
    const itemMap = new Map<number, ItemInstanceData>();
    for (const item of items) itemMap.set(item.slotIndex, item);

    // Determine slot count (at least TOTAL_SLOTS, expand if needed)
    let maxSlot = TOTAL_SLOTS - 1;
    for (const item of items) maxSlot = Math.max(maxSlot, item.slotIndex);
    const slotCount = maxSlot + 1;

    for (let slot = 0; slot < slotCount; slot++) {
      const item = itemMap.get(slot);
      const cell = document.createElement('div');
      cell.style.cssText = [
        `width:${CELL_SIZE}px`,
        `height:${CELL_SIZE}px`,
        'position:relative',
        'background:rgba(0,0,0,0.35)',
        'border:1px solid #3a2a1a',
        'border-radius:3px',
        'cursor:' + (item ? 'pointer' : 'default'),
      ].join(';');

      if (item) {
        cell.innerHTML += this.extractor.renderItemInCell(item.itemId, CELL_SIZE, this.female);

        // Count badge for stackables
        if (item.count > 1) {
          const badge = document.createElement('div');
          badge.style.cssText = 'position:absolute;bottom:1px;right:2px;font-size:9px;color:#FFD700;text-shadow:1px 1px 0 #000;pointer-events:none;font-weight:bold;z-index:1;';
          badge.textContent = String(item.count);
          cell.appendChild(badge);
        }

        // Drag support
        cell.setAttribute('draggable', 'true');
        cell.addEventListener('dragstart', (e) => {
          e.dataTransfer!.setData('text/plain', String(item.slotIndex));
          e.dataTransfer!.effectAllowed = 'move';
          cell.style.opacity = '0.5';
        });
        cell.addEventListener('dragend', () => { cell.style.opacity = '1'; });

        cell.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
        cell.addEventListener('mouseleave', () => this.hideTooltip());
        cell.addEventListener('dblclick', () => {
          this.callbacks.onEquip(item.slotIndex);
        });
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.showContextMenu(e, item);
        });
      }

      grid.appendChild(cell);
    }

    gridSection.appendChild(grid);
    this.el.appendChild(gridSection);

    // Gold display
    const goldDiv = document.createElement('div');
    goldDiv.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:4px 6px;background:rgba(0,0,0,0.3);border-radius:3px;border:1px solid #5a3a1a;';
    goldDiv.innerHTML = `
      <span style="color:#c0a060;font-size:10px;letter-spacing:1px;">GOLD</span>
      <span style="color:#FFD700;font-weight:bold;">${gold.toLocaleString()}</span>
    `;
    this.el.appendChild(goldDiv);
  }

  private showTooltip(e: MouseEvent, item: ItemInstanceData): void {
    let text = item.name;
    if (item.maxDurability > 0) text += `\nDurability: ${item.durability}/${item.maxDurability}`;
    if (item.count > 1) text += `\nCount: ${item.count}`;
    this.tooltip.textContent = text;
    this.tooltip.style.display = 'block';
    this.positionTooltip(e);
  }

  private positionTooltip(e: MouseEvent): void {
    const x = Math.min(e.clientX + 12, window.innerWidth - 160);
    const y = Math.min(e.clientY + 12, window.innerHeight - 60);
    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
  }

  private hideTooltip(): void {
    this.tooltip.style.display = 'none';
  }

  private showContextMenu(e: MouseEvent, item: ItemInstanceData): void {
    this.dismissContextMenu();
    const menu = document.createElement('div');
    menu.style.cssText = [
      'position:fixed',
      'z-index:400',
      'background:linear-gradient(135deg,#2a1a0a,#1a0e05)',
      'border:1px solid #7a5a2a',
      'color:#e8d5b0',
      'font-size:11px',
      'font-family:serif',
      'border-radius:3px',
      'overflow:hidden',
      'min-width:100px',
    ].join(';');

    const addOption = (label: string, action: () => void) => {
      const opt = document.createElement('div');
      opt.style.cssText = 'padding:6px 12px;cursor:pointer;border-bottom:1px solid #3a2a1a;';
      opt.textContent = label;
      opt.addEventListener('mouseenter', () => { opt.style.background = 'rgba(122,90,42,0.3)'; });
      opt.addEventListener('mouseleave', () => { opt.style.background = ''; });
      opt.addEventListener('click', () => {
        action();
        this.dismissContextMenu();
      });
      menu.appendChild(opt);
    };

    addOption('Use', () => this.callbacks.onUse(item.slotIndex));
    addOption('Equip', () => this.callbacks.onEquip(item.slotIndex));
    addOption('Drop', () => this.callbacks.onDrop(item.slotIndex));

    const x = Math.min(e.clientX, window.innerWidth - 120);
    const y = Math.min(e.clientY, window.innerHeight - 100);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    document.body.appendChild(menu);
    this.contextMenu = menu;
  }

  private buildEquipCell(slot: number, equipment: ItemInstanceData[]): HTMLDivElement {
    const eq = equipment.find(e => e.slotIndex === slot);
    const cell = document.createElement('div');
    cell.style.cssText = [
      `width:${CELL_SIZE}px`,
      `height:${CELL_SIZE}px`,
      'position:relative',
      'background:rgba(0,0,0,0.4)',
      'border:1px solid ' + (eq ? '#7a5a2a' : '#3a2a1a'),
      'border-radius:4px',
      'cursor:' + (eq ? 'pointer' : 'default'),
      'overflow:hidden',
    ].join(';');

    const slotLabel = document.createElement('div');
    slotLabel.style.cssText = 'position:absolute;bottom:1px;left:0;right:0;text-align:center;font-size:7px;color:#8a6a3a;pointer-events:none;z-index:2;';
    slotLabel.textContent = (SLOT_NAMES[slot] ?? '').substring(0, 5);
    cell.appendChild(slotLabel);

    if (eq) {
      cell.innerHTML += this.extractor.renderItemInCell(eq.itemId, CELL_SIZE, this.female);
      // Re-append label on top of sprite (innerHTML wipes it)
      cell.appendChild(slotLabel);
      cell.addEventListener('mouseenter', (e) => this.showTooltip(e, eq));
      cell.addEventListener('mouseleave', () => this.hideTooltip());
      cell.addEventListener('click', () => this.callbacks.onUnequip(slot));
    }

    return cell;
  }

  private dismissContextMenu(): void {
    if (this.contextMenu) {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }

  destroy(): void {
    this.el.remove();
    this.tooltip.remove();
    this.dismissContextMenu();
  }
}
