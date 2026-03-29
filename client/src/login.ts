/**
 * Pre-Phaser HTTP-based authentication module.
 * Handles login/register via REST API before any game assets are loaded.
 */

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
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  return isLocal ? `http://${host}:8080` : '';
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
 * If a valid session token exists in sessionStorage, validates it and returns.
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

function showLoginForm(onSuccess: (result: AuthResult) => void): void {
  const container = document.createElement('div');
  container.id = 'login-container';
  container.innerHTML = `
    <div style="position:fixed; inset:0; background:#0a0a1a; display:flex; align-items:center; justify-content:center; font-family:sans-serif;">
      <div style="background:#1a1a2e; padding:40px; border-radius:8px; border:1px solid #333; min-width:350px; text-align:center;">
        <h1 style="color:#FFD700; margin:0 0 30px 0; font-size:28px;">Helbreath.xyz</h1>
        <input id="login-username" type="text" placeholder="Username" maxlength="20"
          style="display:block; width:100%; padding:10px; margin:8px 0; font-size:14px; background:#0a0a1a; color:#fff; border:1px solid #444; border-radius:4px; box-sizing:border-box;">
        <input id="login-password" type="password" placeholder="Password" maxlength="30"
          style="display:block; width:100%; padding:10px; margin:8px 0; font-size:14px; background:#0a0a1a; color:#fff; border:1px solid #444; border-radius:4px; box-sizing:border-box;">
        <div style="margin-top:15px;">
          <button id="login-btn" style="padding:10px 25px; margin:5px; cursor:pointer; background:#2c5f2d; color:white; border:none; border-radius:4px; font-size:14px;">Login</button>
          <button id="register-btn" style="padding:10px 25px; margin:5px; cursor:pointer; background:#2d3c5f; color:white; border:none; border-radius:4px; font-size:14px;">Register</button>
        </div>
        <p id="login-error" style="color:#ff4444; margin-top:15px; min-height:20px;"></p>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const doAuth = async (register: boolean) => {
    const username = (document.getElementById('login-username') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    if (username.length < 3 || password.length < 6) {
      document.getElementById('login-error')!.textContent = 'Username min 3 chars, password min 6 chars';
      return;
    }

    // Disable buttons during request
    const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
    const registerBtn = document.getElementById('register-btn') as HTMLButtonElement;
    loginBtn.disabled = true;
    registerBtn.disabled = true;

    try {
      const resp = await fetch(`${getApiBase()}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, register }),
      });
      const data = await resp.json();

      if (data.success) {
        localStorage.setItem('hb_token', data.token);
        container.remove();
        onSuccess({ token: data.token, characters: data.characters || [] });
      } else {
        document.getElementById('login-error')!.textContent = data.error || 'Login failed';
        loginBtn.disabled = false;
        registerBtn.disabled = false;
      }
    } catch (_err) {
      document.getElementById('login-error')!.textContent = 'Connection failed. Is the server running?';
      loginBtn.disabled = false;
      registerBtn.disabled = false;
    }
  };

  document.getElementById('login-btn')!.addEventListener('click', () => doAuth(false));
  document.getElementById('register-btn')!.addEventListener('click', () => doAuth(true));
  document.getElementById('login-password')!.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doAuth(false);
  });

  // Focus username input
  (document.getElementById('login-username') as HTMLInputElement).focus();
}
