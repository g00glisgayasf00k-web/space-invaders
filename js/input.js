export class InputManager {
  constructor() {
    this.keys = {};
    this.touchLeft = false;
    this.touchRight = false;
    this.touchFire = false;
    this.firePressed = false;

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this._bindTouchButtons();
    this._bindTouchDrag();
  }

  _bindTouchButtons() {
    const left = document.getElementById('btn-left');
    const right = document.getElementById('btn-right');
    const fire = document.getElementById('btn-fire');

    const bind = (el, setter) => {
      if (!el) return;
      const on = (v) => (e) => { e.preventDefault(); setter(v); };
      el.addEventListener('touchstart', on(true), { passive: false });
      el.addEventListener('touchend', on(false), { passive: false });
      el.addEventListener('touchcancel', on(false), { passive: false });
      el.addEventListener('mousedown', on(true));
      el.addEventListener('mouseup', on(false));
      el.addEventListener('mouseleave', on(false));
    };

    bind(left, (v) => { this.touchLeft = v; });
    bind(right, (v) => { this.touchRight = v; });
    bind(fire, (v) => { this.touchFire = v; });
  }

  _bindTouchDrag() {
    const zone = document.getElementById('touch-zone');
    if (!zone) return;
    let active = false;

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      active = true;
      this._handleTouchMove(e);
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (active) this._handleTouchMove(e);
    }, { passive: false });

    zone.addEventListener('touchend', () => { active = false; });
  }

  _handleTouchMove(e) {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (touch.clientX - rect.left) / rect.width;
    this.touchLeft = ratio < 0.35;
    this.touchRight = ratio > 0.65;
  }

  isLeft() {
    return this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchLeft;
  }

  isRight() {
    return this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchRight;
  }

  consumeFire() {
    const fire = this.keys['Space'] || this.keys['KeyZ'] || this.touchFire;
    if (fire && !this.firePressed) {
      this.firePressed = true;
      return true;
    }
    if (!fire) this.firePressed = false;
    return false;
  }

  isPause() {
    return this.keys['KeyP'] || this.keys['Escape'];
  }
}
