import {
  isLoggedIn,
  getStoredUser,
  login,
  register,
  logout,
  checkOnline,
  fetchMyRank,
} from './api.js';

export class AuthUI {
  constructor(menu) {
    this.menu = menu;
    this.online = false;
    this._bind();
    this.init();
  }

  async init() {
    this.online = await checkOnline();
    this._updateAuthChrome();
    if (isLoggedIn()) await this._refreshRank();
  }

  _bind() {
    document.getElementById('btn-login-screen')?.addEventListener('click', () => {
      this.menu.showScreen('screen-auth');
      this._showAuthTab('login');
    });

    document.getElementById('btn-back-auth')?.addEventListener('click', () => {
      this.menu.showScreen('screen-welcome');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      logout();
      this.menu.showToast('Logged out');
      this._updateAuthChrome();
      this.menu.refreshWelcome();
    });

    document.getElementById('auth-tab-login')?.addEventListener('click', () => this._showAuthTab('login'));
    document.getElementById('auth-tab-register')?.addEventListener('click', () => this._showAuthTab('register'));

    document.getElementById('form-login')?.addEventListener('submit', (e) => this._onLogin(e));
    document.getElementById('form-register')?.addEventListener('submit', (e) => this._onRegister(e));
  }

  _showAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    const loginTab = document.getElementById('auth-tab-login');
    const regTab = document.getElementById('auth-tab-register');
    const isLogin = tab === 'login';
    if (loginForm) loginForm.style.display = isLogin ? 'block' : 'none';
    if (regForm) regForm.style.display = isLogin ? 'none' : 'block';
    loginTab?.classList.toggle('active', isLogin);
    regTab?.classList.toggle('active', !isLogin);
    this._setAuthError('');
  }

  _setAuthError(msg) {
    const el = document.getElementById('auth-error');
    if (el) {
      el.textContent = msg;
      el.style.display = msg ? 'block' : 'none';
    }
  }

  async _onLogin(e) {
    e.preventDefault();
    if (!this.online) {
      this._setAuthError('Server offline — scores need the deployed site');
      return;
    }
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    try {
      await login(email, password);
      this._setAuthError('');
      this.menu.showToast(`Welcome, ${getStoredUser().username}!`);
      this._updateAuthChrome();
      await this._refreshRank();
      this.menu.refreshWelcome();
      this.menu.showScreen('screen-welcome');
    } catch (err) {
      this._setAuthError(err.message);
    }
  }

  async _onRegister(e) {
    e.preventDefault();
    if (!this.online) {
      this._setAuthError('Server offline — use the live Render URL');
      return;
    }
    const username = document.getElementById('reg-username')?.value;
    const email = document.getElementById('reg-email')?.value;
    const password = document.getElementById('reg-password')?.value;
    try {
      await register(username, email, password);
      this._setAuthError('');
      this.menu.showToast(`Account created — hi ${getStoredUser().username}!`);
      this._updateAuthChrome();
      this.menu.showScreen('screen-welcome');
      this.menu.refreshWelcome();
    } catch (err) {
      this._setAuthError(err.message);
    }
  }

  async _refreshRank() {
    const rankEl = document.getElementById('welcome-rank');
    if (!rankEl || !isLoggedIn()) return;
    try {
      const data = await fetchMyRank();
      if (data?.rank) {
        rankEl.textContent = `#${data.rank}`;
      } else {
        rankEl.textContent = '—';
      }
    } catch {
      rankEl.textContent = '—';
    }
  }

  _updateAuthChrome() {
    const user = getStoredUser();
    const loggedIn = isLoggedIn();
    const loginBtn = document.getElementById('btn-login-screen');
    const logoutBtn = document.getElementById('btn-logout');
    const userLine = document.getElementById('welcome-user-line');
    const offline = document.getElementById('auth-offline-note');

    if (loginBtn) loginBtn.style.display = loggedIn ? 'none' : 'block';
    if (logoutBtn) logoutBtn.style.display = loggedIn ? 'block' : 'none';
    if (userLine) userLine.style.display = loggedIn ? 'block' : 'none';
    if (offline) offline.style.display = this.online ? 'none' : 'block';

    const nameEl = document.getElementById('welcome-username');
    const avatar = document.getElementById('acc-avatar');
    const accName = document.getElementById('acc-name');
    if (loggedIn && user) {
      const initials = user.username.slice(0, 2).toUpperCase();
      if (nameEl) nameEl.textContent = user.username;
      if (avatar) avatar.textContent = initials;
      if (accName) accName.textContent = user.username;
    } else {
      if (nameEl) nameEl.textContent = '';
      if (avatar) avatar.textContent = '??';
      if (accName) accName.textContent = 'Guest';
    }
  }

}
