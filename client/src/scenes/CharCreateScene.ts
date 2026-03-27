import Phaser from 'phaser';
import { MessageHandler, CreateCharacterResponse } from '../network/MessageHandler';
import * as Proto from '../network/Protocol';

export class CharCreateScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharCreateScene' });
  }

  create(): void {
    const msgHandler = this.registry.get('msgHandler') as MessageHandler;
    const centerX = this.cameras.main.width / 2;

    this.add.text(centerX, 20, 'Create Character', {
      fontSize: '24px', color: '#FFD700',
    }).setOrigin(0.5);

    // Create DOM form for character creation
    const formHtml = `
      <div id="create-form" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); text-align:center; color:#fff; font-size:14px;">
        <input id="char-name" type="text" placeholder="Character Name" maxlength="10"
               style="display:block; margin:5px auto; padding:5px; width:200px;">
        <div style="margin:10px 0;">
          <label><input type="radio" name="gender" value="0" checked> Male</label>
          <label style="margin-left:15px;"><input type="radio" name="gender" value="1"> Female</label>
        </div>
        <div style="margin:5px 0;">
          Skin: <select id="skin-color"><option value="0">Light</option><option value="1">Medium</option><option value="2">Dark</option></select>
          Hair: <select id="hair-style">${Array.from({length:13}, (_,i) => `<option value="${i}">Style ${i+1}</option>`).join('')}</select>
        </div>
        <div style="margin:5px 0;">
          Hair Color: <select id="hair-color">${Array.from({length:8}, (_,i) => `<option value="${i}">Color ${i+1}</option>`).join('')}</select>
          Underwear: <select id="underwear-color">${Array.from({length:8}, (_,i) => `<option value="${i}">Color ${i+1}</option>`).join('')}</select>
        </div>
        <p style="margin:10px 0; font-size:12px;">Allocate 10 bonus points (base 10 each, total 70):</p>
        <div style="display:grid; grid-template-columns:80px 60px; gap:5px; justify-content:center;">
          <label>STR:</label><input id="stat-str" type="number" value="10" min="10" max="20" style="width:50px;">
          <label>VIT:</label><input id="stat-vit" type="number" value="10" min="10" max="20" style="width:50px;">
          <label>DEX:</label><input id="stat-dex" type="number" value="10" min="10" max="20" style="width:50px;">
          <label>INT:</label><input id="stat-int" type="number" value="10" min="10" max="20" style="width:50px;">
          <label>MAG:</label><input id="stat-mag" type="number" value="20" min="10" max="20" style="width:50px;">
          <label>CHR:</label><input id="stat-chr" type="number" value="10" min="10" max="20" style="width:50px;">
        </div>
        <p id="stat-total" style="margin:5px 0; font-size:12px;">Total: 70/70</p>
        <button id="create-btn" style="margin:10px 5px; padding:8px 20px; cursor:pointer;">Create</button>
        <button id="back-btn" style="margin:10px 5px; padding:8px 20px; cursor:pointer;">Back</button>
        <p id="create-error" style="color:red; margin-top:5px;"></p>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = formHtml;
    document.body.appendChild(div);

    // Stat total tracker
    const statInputs = ['str', 'vit', 'dex', 'int', 'mag', 'chr'].map(
      s => document.getElementById(`stat-${s}`) as HTMLInputElement
    );
    const updateTotal = () => {
      const total = statInputs.reduce((sum, el) => sum + (parseInt(el.value) || 0), 0);
      const el = document.getElementById('stat-total');
      if (el) {
        el.textContent = `Total: ${total}/70`;
        el.style.color = total === 70 ? '#4CAF50' : '#f44336';
      }
    };
    statInputs.forEach(el => el.addEventListener('input', updateTotal));

    document.getElementById('create-btn')?.addEventListener('click', () => {
      const name = (document.getElementById('char-name') as HTMLInputElement)?.value || '';
      const gender = parseInt((document.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value || '0');
      const skinColor = parseInt((document.getElementById('skin-color') as HTMLSelectElement)?.value || '0');
      const hairStyle = parseInt((document.getElementById('hair-style') as HTMLSelectElement)?.value || '0');
      const hairColor = parseInt((document.getElementById('hair-color') as HTMLSelectElement)?.value || '0');
      const underwearColor = parseInt((document.getElementById('underwear-color') as HTMLSelectElement)?.value || '0');

      const str = parseInt(statInputs[0].value) || 10;
      const vit = parseInt(statInputs[1].value) || 10;
      const dex = parseInt(statInputs[2].value) || 10;
      const intStat = parseInt(statInputs[3].value) || 10;
      const mag = parseInt(statInputs[4].value) || 10;
      const charisma = parseInt(statInputs[5].value) || 10;

      if (str + vit + dex + intStat + mag + charisma !== 70) {
        const el = document.getElementById('create-error');
        if (el) el.textContent = 'Stat points must total 70';
        return;
      }

      msgHandler.sendMessage(Proto.MSG_CREATE_CHARACTER_REQUEST, {
        name, gender, skinColor, hairStyle, hairColor, underwearColor,
        str, vit, dex, intStat, mag, charisma,
      });
    });

    document.getElementById('back-btn')?.addEventListener('click', () => {
      this.scene.start('CharSelectScene');
    });

    msgHandler.on(Proto.MSG_CREATE_CHAR_RESPONSE, (resp: CreateCharacterResponse) => {
      if (resp.success) {
        this.registry.set('characters', resp.characters);
        this.scene.start('CharSelectScene');
      } else {
        const el = document.getElementById('create-error');
        if (el) el.textContent = resp.error;
      }
    });

    this.events.on('shutdown', () => {
      div.remove();
    });
  }
}
