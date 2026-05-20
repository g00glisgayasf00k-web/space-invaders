import { SpaceInvadersGame } from './game.js';
import { MenuUI } from './menu.js';

const canvas = document.getElementById('game');
const game = new SpaceInvadersGame(canvas);
const menu = new MenuUI(game);
game.setMenu(menu);
game.run();

document.body.addEventListener('touchmove', (e) => {
  if (e.target === document.getElementById('touch-zone')) return;
  if (e.target.closest('.controls')) return;
  if (e.target.closest('.menu-overlay')) return;
}, { passive: true });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
