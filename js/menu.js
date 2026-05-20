const STORAGE = {
  high: 'si-highscore',
  last: 'si-lastscore',
  games: 'si-games-played',
  aliens: 'si-aliens-killed',
  ufos: 'si-ufos-hit',
  sound: 'si-sound',
};

export function formatScore(n) {
  return String(n).padStart(6, '0');
}

export function loadStats() {
  return {
    highScore: parseInt(localStorage.getItem(STORAGE.high) || '0', 10),
    lastScore: parseInt(localStorage.getItem(STORAGE.last) || '0', 10),
    gamesPlayed: parseInt(localStorage.getItem(STORAGE.games) || '0', 10),
    aliensKilled: parseInt(localStorage.getItem(STORAGE.aliens) || '0', 10),
    ufosHit: parseInt(localStorage.getItem(STORAGE.ufos) || '0', 10),
    soundOn: localStorage.getItem(STORAGE.sound) !== '0',
  };
}

export function saveLastScore(score) {
  localStorage.setItem(STORAGE.last, String(score));
}

export function incrementGamesPlayed() {
  const n = parseInt(localStorage.getItem(STORAGE.games) || '0', 10) + 1;
  localStorage.setItem(STORAGE.games, String(n));
  return n;
}

export function trackAlienKill() {
  const n = parseInt(localStorage.getItem(STORAGE.aliens) || '0', 10) + 1;
  localStorage.setItem(STORAGE.aliens, String(n));
}

export function trackUfoHit() {
  const n = parseInt(localStorage.getItem(STORAGE.ufos) || '0', 10) + 1;
  localStorage.setItem(STORAGE.ufos, String(n));
}

export class MenuUI {
  constructor(game) {
    this.game = game;
    this.overlay = document.getElementById('menu-overlay');
    this.app = document.getElementById('app');
    this.toast = document.getElementById('weapon-toast');
    this._bind();
    this.refreshWelcome();
    this.refreshAccount();
  }

  _bind() {
    document.getElementById('btn-play')?.addEventListener('click', () => this.startGame());
    document.getElementById('btn-account')?.addEventListener('click', () => this.showScreen('screen-account'));
    document.getElementById('btn-back-welcome')?.addEventListener('click', () => this.showScreen('screen-welcome'));
    document.getElementById('btn-leaderboard')?.addEventListener('click', () => {
      this.showScreen('screen-account');
      this.switchTab(document.querySelector('[data-tab="tab-stats"]'), 'tab-stats');
    });

    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => this.switchTab(tab, tab.dataset.tab));
    });

    const soundToggle = document.getElementById('toggle-sound');
    if (soundToggle) {
      const stats = loadStats();
      soundToggle.classList.toggle('on', stats.soundOn);
      soundToggle.addEventListener('click', () => {
        soundToggle.classList.toggle('on');
        const on = soundToggle.classList.contains('on');
        localStorage.setItem(STORAGE.sound, on ? '1' : '0');
        this.game.audio.enabled = on;
      });
    }
  }

  showScreen(id) {
    document.querySelectorAll('#menu-overlay .screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    if (id === 'screen-account') this.refreshAccount();
  }

  switchTab(btn, tabId) {
    document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    ['tab-stats', 'tab-ach', 'tab-settings'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === tabId ? 'block' : 'none';
    });
  }

  refreshWelcome() {
    const s = loadStats();
    const hi = document.getElementById('welcome-high');
    const last = document.getElementById('welcome-last');
    if (hi) hi.textContent = formatScore(s.highScore);
    if (last) last.textContent = formatScore(s.lastScore);
  }

  refreshAccount() {
    const s = loadStats();
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    set('acc-high', formatScore(s.highScore));
    set('acc-games', String(s.gamesPlayed));
    set('acc-aliens', String(s.aliensKilled));
    set('acc-ufos', String(s.ufosHit));
    set('acc-last', formatScore(s.lastScore));

    const badge = document.getElementById('acc-weapon-badge');
    if (badge) badge.textContent = this.game._activePowerupText?.() || 'Single';
  }

  startGame() {
    incrementGamesPlayed();
    this.overlay?.classList.add('hidden');
    this.app?.classList.remove('game-hidden');
    this.game.start();
  }

  showMenu() {
    this.refreshWelcome();
    this.refreshAccount();
    this.overlay?.classList.remove('hidden');
    this.app?.classList.add('game-hidden');
    this.showScreen('screen-welcome');
  }

  showPowerUp(label) {
    if (!this.toast) return;
    this.toast.textContent = label;
    this.toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this.toast.classList.remove('show'), 1800);
  }
}
