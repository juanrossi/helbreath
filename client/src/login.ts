/**
 * Pre-Phaser HTTP-based authentication module.
 * Handles login/register via REST API before any game assets are loaded.
 */
import { API_BASE } from './env';

export interface AuthResult {
  token: string;
  characters: CharacterInfo[];
}

export interface CharacterInfo {
  id: number;
  name: string;
  level: number;
  gender: number;
  side: number;
  mapName: string;
}

function getApiBase(): string {
  return API_BASE;
}

async function fetchCharacters(token: string): Promise<CharacterInfo[]> {
  const resp = await fetch(`${getApiBase()}/api/characters`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error('Token expired');
  const data = await resp.json();
  return data.characters || [];
}

/**
 * Authenticates the user via HTTP before Phaser is initialized.
 * If a valid session token exists in localStorage, validates it and returns.
 * Otherwise shows a login form and waits for successful authentication.
 */
export async function authenticateUser(): Promise<AuthResult> {
  return new Promise((resolve) => {
    // Check for existing session
    const existingToken = localStorage.getItem('hb_token');
    if (existingToken) {
      fetchCharacters(existingToken).then(chars => {
        resolve({ token: existingToken, characters: chars });
      }).catch(() => {
        localStorage.removeItem('hb_token');
        showLoginForm(resolve);
      });
      return;
    }
    showLoginForm(resolve);
  });
}

const formStyles = `
  .auth-container { position:fixed; inset:0; background:#0a0a1a; display:flex; align-items:center; justify-content:center; font-family:'Segoe UI',Arial,sans-serif; }
  .auth-box { background:#1a1a2e; padding:40px; border-radius:8px; border:1px solid #333; min-width:360px; text-align:center; }
  .auth-title { color:#FFD700; margin:0 0 8px 0; font-size:28px; }
  .auth-subtitle { color:#888; margin:0 0 24px 0; font-size:13px; }
  .auth-input { display:block; width:100%; padding:10px; margin:8px 0; font-size:14px; background:#0a0a1a; color:#fff; border:1px solid #444; border-radius:4px; box-sizing:border-box; }
  .auth-input:focus { border-color:#FFD700; outline:none; }
  .auth-btn { padding:10px 25px; margin:5px; cursor:pointer; color:white; border:none; border-radius:4px; font-size:14px; transition:opacity 0.15s; }
  .auth-btn:hover { opacity:0.85; }
  .auth-btn:disabled { opacity:0.5; cursor:default; }
  .auth-btn-primary { background:#2c5f2d; }
  .auth-btn-secondary { background:#2d3c5f; }
  .auth-error { color:#ff4444; margin-top:15px; min-height:20px; font-size:13px; }
  .auth-link { color:#7799cc; cursor:pointer; font-size:13px; margin-top:12px; display:inline-block; }
  .auth-link:hover { color:#99bbee; text-decoration:underline; }
  .auth-label { display:block; text-align:left; color:#aaa; font-size:11px; margin:10px 0 2px 2px; }
`;

function showLoginForm(onSuccess: (result: AuthResult) => void): void {
  const container = document.createElement('div');
  container.id = 'login-container';

  const style = document.createElement('style');
  style.textContent = formStyles;
  container.appendChild(style);

  function renderLogin(): void {
    container.querySelectorAll('.auth-container').forEach(el => el.remove());

    const wrap = document.createElement('div');
    wrap.className = 'auth-container';
    wrap.innerHTML = `
      <div class="auth-box">
        <h1 class="auth-title">Helbreath.xyz</h1>
        <p class="auth-subtitle">Enter your credentials to play</p>
        <input id="login-username" class="auth-input" type="text" placeholder="Username" maxlength="20" autocomplete="username">
        <input id="login-password" class="auth-input" type="password" placeholder="Password" maxlength="30" autocomplete="current-password">
        <div style="margin-top:15px;">
          <button id="login-btn" class="auth-btn auth-btn-primary">Login</button>
        </div>
        <p id="login-error" class="auth-error"></p>
        <span id="show-register" class="auth-link">Don't have an account? Register</span>
      </div>
    `;
    container.appendChild(wrap);

    const doLogin = async () => {
      const username = (document.getElementById('login-username') as HTMLInputElement).value.trim();
      const password = (document.getElementById('login-password') as HTMLInputElement).value;
      const errorEl = document.getElementById('login-error')!;

      if (username.length < 3 || password.length < 6) {
        errorEl.textContent = 'Username min 3 chars, password min 6 chars';
        return;
      }

      const btn = document.getElementById('login-btn') as HTMLButtonElement;
      btn.disabled = true;

      try {
        const resp = await fetch(`${getApiBase()}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, register: false }),
        });
        const data = await resp.json();

        if (data.success) {
          localStorage.setItem('hb_token', data.token);
          container.remove();
          onSuccess({ token: data.token, characters: data.characters || [] });
        } else {
          errorEl.textContent = data.error || 'Login failed';
          btn.disabled = false;
        }
      } catch (_err) {
        errorEl.textContent = 'Connection failed. Is the server running?';
        btn.disabled = false;
      }
    };

    document.getElementById('login-btn')!.addEventListener('click', doLogin);
    document.getElementById('login-password')!.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });
    document.getElementById('show-register')!.addEventListener('click', renderRegister);
    (document.getElementById('login-username') as HTMLInputElement).focus();
  }

  function renderRegister(): void {
    container.querySelectorAll('.auth-container').forEach(el => el.remove());

    const wrap = document.createElement('div');
    wrap.className = 'auth-container';
    wrap.innerHTML = `
      <div class="auth-box">
        <h1 class="auth-title">Helbreath.xyz</h1>
        <p class="auth-subtitle">Create a new account</p>
        <label class="auth-label" for="reg-username">Username</label>
        <input id="reg-username" class="auth-input" type="text" placeholder="3-20 alphanumeric characters" maxlength="20" autocomplete="username">
        <label class="auth-label" for="reg-email">Email</label>
        <input id="reg-email" class="auth-input" type="email" placeholder="your@email.com" maxlength="255" autocomplete="email">
        <label class="auth-label" for="reg-password">Password</label>
        <input id="reg-password" class="auth-input" type="password" placeholder="Minimum 6 characters" maxlength="30" autocomplete="new-password">
        <label class="auth-label" for="reg-confirm">Confirm Password</label>
        <input id="reg-confirm" class="auth-input" type="password" placeholder="Re-enter your password" maxlength="30" autocomplete="new-password">
        <div style="margin-top:15px;">
          <button id="register-btn" class="auth-btn auth-btn-secondary">Create Account</button>
        </div>
        <p id="reg-error" class="auth-error"></p>
        <span id="show-login" class="auth-link">Already have an account? Login</span>
      </div>
    `;
    container.appendChild(wrap);

    const doRegister = async () => {
      const username = (document.getElementById('reg-username') as HTMLInputElement).value.trim();
      const email = (document.getElementById('reg-email') as HTMLInputElement).value.trim();
      const password = (document.getElementById('reg-password') as HTMLInputElement).value;
      const confirm = (document.getElementById('reg-confirm') as HTMLInputElement).value;
      const errorEl = document.getElementById('reg-error')!;

      if (username.length < 3) {
        errorEl.textContent = 'Username must be at least 3 characters';
        return;
      }
      if (!email || !email.includes('@')) {
        errorEl.textContent = 'Please enter a valid email address';
        return;
      }
      if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        return;
      }
      if (password !== confirm) {
        errorEl.textContent = 'Passwords do not match';
        return;
      }

      const btn = document.getElementById('register-btn') as HTMLButtonElement;
      btn.disabled = true;

      try {
        const resp = await fetch(`${getApiBase()}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, register: true }),
        });
        const data = await resp.json();

        if (data.success) {
          localStorage.setItem('hb_token', data.token);
          container.remove();
          onSuccess({ token: data.token, characters: data.characters || [] });
        } else {
          errorEl.textContent = data.error || 'Registration failed';
          btn.disabled = false;
        }
      } catch (_err) {
        errorEl.textContent = 'Connection failed. Is the server running?';
        btn.disabled = false;
      }
    };

    document.getElementById('register-btn')!.addEventListener('click', doRegister);
    document.getElementById('reg-confirm')!.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doRegister();
    });
    document.getElementById('show-login')!.addEventListener('click', renderLogin);
    (document.getElementById('reg-username') as HTMLInputElement).focus();
  }

  document.body.appendChild(container);
  renderLogin();
}
