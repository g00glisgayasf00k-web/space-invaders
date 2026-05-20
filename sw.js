const CACHE = 'space-invaders-v5';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/menu.css',
  './js/main.js',
  './js/menu.js',
  './js/game.js',
  './js/powerups.js',
  './js/api.js',
  './js/auth-ui.js',
  './js/leaderboard-ui.js',
  './js/stats.js',
  './js/sprites.js',
  './js/audio.js',
  './js/input.js',
  './manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
      return cached || fetched;
    })
  );
});
