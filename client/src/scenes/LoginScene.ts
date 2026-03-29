import Phaser from 'phaser';
import { WebSocketClient } from '../network/WebSocketClient';
import { MessageHandler, LoginResponse } from '../network/MessageHandler';
import * as Proto from '../network/Protocol';
import { WS_BASE } from '../env';

export class LoginScene extends Phaser.Scene {
  private ws!: WebSocketClient;
  private msgHandler!: MessageHandler;

  constructor() {
    super({ key: 'LoginScene' });
  }

  create(): void {
    // Initialize network
    const wsUrl = `${WS_BASE}/ws`;
    this.ws = new WebSocketClient(wsUrl, (type, data) => {
      this.msgHandler.handleMessage(type, data);
    });
    this.msgHandler = new MessageHandler(this.ws);

    // Store references for other scenes
    this.registry.set('ws', this.ws);
    this.registry.set('msgHandler', this.msgHandler);

    this.msgHandler.on(Proto.MSG_LOGIN_RESPONSE, (resp: LoginResponse) => {
      if (resp.success) {
        this.registry.set('characters', resp.characters);
        if (resp.token) {
          localStorage.setItem('hb_token', resp.token);
          this.registry.set('authToken', resp.token);
        }
        this.scene.start('CharSelectScene');
      } else {
        this.showError(resp.error);
      }
    });

    // Create DOM login form
    this.createLoginUI();

    this.ws.connect();
  }

  private createLoginUI(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title
    this.add.text(centerX, centerY - 120, 'Helbreath.xyz', {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Username label + input area
    this.add.text(centerX - 80, centerY - 50, 'Username:', {
      fontSize: '14px', color: '#fff',
    });

    this.add.text(centerX - 80, centerY - 10, 'Password:', {
      fontSize: '14px', color: '#fff',
    });

    // Create HTML overlay for input fields
    const formHtml = `
      <div id="login-form" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); text-align:center;">
        <input id="username" type="text" placeholder="Username" maxlength="20"
               style="display:block; margin:5px auto; padding:5px; width:200px; font-size:14px;"><br>
        <input id="password" type="password" placeholder="Password" maxlength="30"
               style="display:block; margin:5px auto; padding:5px; width:200px; font-size:14px;"><br>
        <button id="login-btn" style="margin:5px; padding:8px 20px; cursor:pointer;">Login</button>
        <button id="register-btn" style="margin:5px; padding:8px 20px; cursor:pointer;">Register</button>
        <p id="login-error" style="color:red; margin-top:10px;"></p>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = formHtml;
    document.body.appendChild(div);

    document.getElementById('login-btn')?.addEventListener('click', () => this.doLogin(false));
    document.getElementById('register-btn')?.addEventListener('click', () => this.doLogin(true));

    // Enter key triggers login
    document.getElementById('password')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.doLogin(false);
    });

    // Clean up form when leaving scene
    this.events.on('shutdown', () => {
      div.remove();
    });
  }

  private doLogin(register: boolean): void {
    const username = (document.getElementById('username') as HTMLInputElement)?.value || '';
    const password = (document.getElementById('password') as HTMLInputElement)?.value || '';

    if (username.length < 3 || password.length < 6) {
      this.showError('Username min 3 chars, password min 6 chars');
      return;
    }

    this.msgHandler.sendMessage(Proto.MSG_LOGIN_REQUEST, {
      username,
      password,
      register,
    });
  }

  private showError(msg: string): void {
    const el = document.getElementById('login-error');
    if (el) el.textContent = msg;
  }
}
