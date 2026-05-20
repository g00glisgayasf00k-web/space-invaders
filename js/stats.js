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
