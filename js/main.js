import { SpaceInvadersGame } from './game.js';

const canvas = document.getElementById('game');
const game = new SpaceInvadersGame(canvas);
game.run();

// Start button
const startBtn = document.getElementById('btn-start');
if (startBtn) {
  const press = () => { startBtn.dataset.pressed = 'true'; };
  startBtn.addEventListener('click', press);
  startBtn.addEventListener('touchstart', (e) => { e.preventDefault(); press(); }, { passive: false });
}

// Prevent pull-to-refresh and bounce on mobile
document.body.addEventListener('touchmove', (e) => {
  if (e.target === document.getElementById('touch-zone')) return;
  if (e.target.closest('.controls')) return;
}, { passive: true });

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
