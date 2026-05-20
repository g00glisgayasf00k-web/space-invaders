import { formatScore, loadStats, saveLastScore, incrementGamesPlayed, trackAlienKill, trackUfoHit } from './stats.js';
import { isLoggedIn, fetchMyRank } from './api.js';

export { formatScore, loadStats, saveLastScore, incrementGamesPlayed, trackAlienKill, trackUfoHit };

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
        localStorage.setItem('si-sound', on ? '1' : '0');
        this.game.audio.enabled = on;
      });
    }
  }

  showScreen(id) {
    document.querySelectorAll('#menu-overlay .screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    if (id === 'screen-account') this.refreshAccount();
    if (id === 'screen-welcome') this.refreshWelcome();
  }

  switchTab(btn, tabId) {
    document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    ['tab-stats', 'tab-ach', 'tab-settings'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === tabId ? 'block' : 'none';
    });
  }

  async refreshWelcome() {
    const s = loadStats();
    const hi = document.getElementById('welcome-high');
    const games = document.getElementById('welcome-games');
    const last = document.getElementById('welcome-last');
    const rank = document.getElementById('welcome-rank');
    const rankWrap = document.getElementById('welcome-rank-wrap');

    if (hi) hi.textContent = formatScore(s.highScore);
    if (games) games.textContent = String(s.gamesPlayed);
    if (last) last.textContent = s.lastScore > 0 ? formatScore(s.lastScore) : '------';

    if (isLoggedIn()) {
      if (rankWrap) rankWrap.style.display = 'block';
      try {
        const data = await fetchMyRank();
        if (rank) rank.textContent = data?.rank ? `#${data.rank}` : '—';
      } catch {
        if (rank) rank.textContent = '—';
      }
    } else if (rankWrap) {
      rankWrap.style.display = 'none';
    }
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

  showToast(text) {
    if (!this.toast) return;
    this.toast.textContent = text;
    this.toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this.toast.classList.remove('show'), 1800);
  }

  showPowerUp(label) {
    this.showToast(label);
  }
}
