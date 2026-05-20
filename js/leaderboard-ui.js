import { fetchLeaderboard, isLoggedIn, getStoredUser } from './api.js';
import { formatScore } from './stats.js';

export class LeaderboardUI {
  constructor(menu) {
    this.menu = menu;
    document.getElementById('btn-leaderboard')?.addEventListener('click', () => this.open());
    document.getElementById('btn-back-from-leaderboard')?.addEventListener('click', () => {
      this.menu.showScreen('screen-welcome');
    });
  }

  async open() {
    this.menu.showScreen('screen-leaderboard');
    const list = document.getElementById('leaderboard-list');
    const status = document.getElementById('leaderboard-status');
    if (!list) return;

    list.innerHTML = '';
    if (status) status.textContent = 'Loading...';

    try {
      const rows = await fetchLeaderboard(25);
      if (status) status.textContent = rows.length ? 'Top pilots worldwide' : 'No scores yet — be the first!';

      if (!rows.length) {
        list.innerHTML = '<p class="lb-empty">Play logged in to appear here</p>';
        return;
      }

      const me = getStoredUser()?.username?.toLowerCase();
      list.innerHTML = rows
        .map((row) => {
          const highlight = isLoggedIn() && me === row.username.toLowerCase() ? ' lb-me' : '';
          const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : row.rank;
          return `<div class="lb-row${highlight}">
            <span class="lb-rank">${medal}</span>
            <span class="lb-name">${escapeHtml(row.username)}</span>
            <span class="lb-score">${formatScore(row.score)}</span>
            <span class="lb-lvl">W${row.level}</span>
          </div>`;
        })
        .join('');
    } catch (err) {
      if (status) status.textContent = 'Could not load leaderboard';
      list.innerHTML = `<p class="lb-empty">${escapeHtml(err.message)}</p>`;
    }
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
