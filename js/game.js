import {
  SPRITES,
  COLORS,
  drawPixelSprite,
  drawPlayerShip,
  drawAlienBullet,
  drawPlayerBullet,
  drawPowerupPickup,
  snap,
} from './sprites.js';
import { AudioManager } from './audio.js';
import { InputManager } from './input.js';
import { trackAlienKill, trackUfoHit, saveLastScore, loadStats } from './menu.js';
import {
  POWERUP,
  POWERUP_DURATION,
  POWERUP_LABELS,
  POWERUP_COLORS,
  rollPowerup,
} from './powerups.js';

const GAME_WIDTH = 224;
const GAME_HEIGHT = 256;
const UFO_POINTS = [50, 100, 150, 300];
const BULLET_W = 4;
const BULLET_H = 8;
const MAX_BULLETS_NORMAL = 3;
const MAX_BULLETS_RAPID = 8;

export class SpaceInvadersGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.audio = new AudioManager();
    const stats = loadStats();
    this.audio.enabled = stats.soundOn;
    this.input = new InputManager();
    this.menu = null;
    this.scale = 3;
    this.lastTime = 0;
    this.animFrame = 0;
    this.state = 'menu';
    this.pauseLatch = false;

    this.reset();
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  reset() {
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('si-highscore') || '0', 10);
    this.lives = 3;
    this.level = 1;
    this._resetPowerups();

    const pw = SPRITES.player.width;
    const ph = SPRITES.player.height;
    this.player = {
      x: GAME_WIDTH / 2 - pw / 2,
      y: GAME_HEIGHT - ph - 16,
      width: pw,
      height: ph,
      speed: 95,
      cooldown: 0,
    };

    this.bullets = [];
    this.alienBullets = [];
    this.explosions = [];
    this.drops = [];
    this.ufo = null;
    this.ufoTimer = 8 + Math.random() * 12;

    this._initAliens();
    this._initBunkers();

    this.alienDir = 1;
    this.alienMoveTimer = 0;
    this.alienShootTimer = 1.5;
    this.alienAnimFrame = 0;
    this.alienSoundsThisStep = 0;
    this._applyLevelSpeed();
  }

  _resetPowerups() {
    this.spread = 0;
    this.rapidFire = false;
    this.shield = false;
    this.timers = { spread: 0, rapid: 0, shield: 0 };
  }

  setMenu(menu) {
    this.menu = menu;
  }

  _applyLevelSpeed() {
    const lv = this.level;
    this.alienMoveInterval = Math.max(0.07, 0.72 - lv * 0.055);
    this.alienSpeed = 7 + lv * 3.5;
    this.alienStepDown = 6 + Math.min(4, lv);
    this.alienShootBase = Math.max(0.35, 1.6 - lv * 0.12);
  }

  _initAliens() {
    this.aliens = [];
    const rows = [
      { type: 'alienC', cols: 11, y: 32 },
      { type: 'alienC', cols: 11, y: 48 },
      { type: 'alienB', cols: 11, y: 64 },
      { type: 'alienB', cols: 11, y: 80 },
      { type: 'alienA', cols: 11, y: 96 },
    ];
    const spacing = 16;
    const startX = (GAME_WIDTH - (11 - 1) * spacing) / 2 - 4;

    for (const row of rows) {
      for (let c = 0; c < row.cols; c++) {
        this.aliens.push({
          type: row.type,
          x: startX + c * spacing,
          y: row.y,
          alive: true,
        });
      }
    }
  }

  _initBunkers() {
    this.bunkers = [];
    const bunkerW = SPRITES.bunker.width;
    const gap = (GAME_WIDTH - 4 * bunkerW) / 5;
    for (let i = 0; i < 4; i++) {
      const pixels = SPRITES.bunker.pixels.map((row) => [...row]);
      this.bunkers.push({
        x: gap + i * (bunkerW + gap),
        y: GAME_HEIGHT - 72,
        pixels,
        width: bunkerW,
        height: SPRITES.bunker.height,
      });
    }
  }

  _resize() {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight - 120;
    const aspect = GAME_WIDTH / GAME_HEIGHT;
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    this.displayWidth = Math.floor(w);
    this.displayHeight = Math.floor(h);
    this.scale = this.displayWidth / GAME_WIDTH;
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.canvas.style.width = `${this.displayWidth}px`;
    this.canvas.style.height = `${this.displayHeight}px`;
  }

  start() {
    this.audio.unlock();
    this.reset();
    this.state = 'playing';
    this._updateHud();
  }

  _spreadLabel() {
    return ['SINGLE', 'DOUBLE', 'TRIPLE'][this.spread] || 'SINGLE';
  }

  _activePowerupText() {
    const parts = [];
    if (this.spread > 0 && this.timers.spread > 0) parts.push(this._spreadLabel());
    if (this.rapidFire && this.timers.rapid > 0) parts.push('RAPID');
    if (this.shield && this.timers.shield > 0) parts.push('SHIELD');
    return parts.length ? parts.join('+') : 'SINGLE';
  }

  _updateHud() {
    document.getElementById('score').textContent = String(this.score).padStart(6, '0');
    document.getElementById('high-score').textContent = String(this.highScore).padStart(6, '0');
    document.getElementById('level').textContent = String(this.level);
    const livesEl = document.getElementById('lives');
    if (livesEl) livesEl.textContent = '♥'.repeat(Math.min(this.lives, 9)) || '—';
    const weaponEl = document.getElementById('weapon');
    if (weaponEl) weaponEl.textContent = this._activePowerupText();
  }

  _livingAliens() {
    return this.aliens.filter((a) => a.alive);
  }

  _alienBounds() {
    const living = this._livingAliens();
    if (!living.length) return null;
    let minX = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const a of living) {
      const sprite = SPRITES[a.type];
      minX = Math.min(minX, a.x);
      maxX = Math.max(maxX, a.x + sprite.width);
      maxY = Math.max(maxY, a.y + sprite.height);
    }
    return { minX, maxX, maxY };
  }

  _speedUpAliens() {
    const living = this._livingAliens().length;
    const total = this.aliens.length;
    const ratio = 1 - living / total;
    const lv = this.level;
    this.alienMoveInterval = Math.max(0.05, (0.72 - lv * 0.055) - ratio * 0.55);
    this.alienSpeed = (7 + lv * 3.5) + ratio * 16;
  }

  _rectHit(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  /** Swept bullet collision — fixes fast bullets passing through targets */
  _bulletHitsBox(bullet, bx, by, bw, bh) {
    const x0 = bullet.px ?? bullet.x;
    const y0 = bullet.py ?? bullet.y;
    const x1 = bullet.x;
    const y1 = bullet.y;
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = x0 + (x1 - x0) * t - BULLET_W / 2;
      const cy = y0 + (y1 - y0) * t - BULLET_H;
      if (this._rectHit(cx, cy, BULLET_W, BULLET_H, bx, by, bw, bh)) return true;
    }
    return false;
  }

  _alienHitbox(a) {
    const sp = SPRITES[a.type];
    const pad = 0;
    return { x: a.x + pad, y: a.y + pad, w: sp.width - pad * 2, h: sp.height - pad * 2 };
  }

  _moveAliens() {
    const bounds = this._alienBounds();
    if (!bounds) return;

    let hitEdge = false;
    if (this.alienDir > 0 && bounds.maxX >= GAME_WIDTH - 4) hitEdge = true;
    if (this.alienDir < 0 && bounds.minX <= 4) hitEdge = true;

    if (hitEdge) {
      this.alienDir *= -1;
      for (const a of this.aliens) {
        if (a.alive) a.y += this.alienStepDown;
      }
      if (bounds.maxY >= this.player.y - 8) {
        this._gameOver();
        return;
      }
    } else {
      for (const a of this.aliens) {
        if (a.alive) a.x += this.alienDir * this.alienSpeed * 0.5;
      }
    }

    this.alienAnimFrame++;
    if (this.alienSoundsThisStep < 4) {
      this.audio.alienMove();
      this.alienSoundsThisStep++;
    }
    this._speedUpAliens();
  }

  _alienShoot() {
    const living = this._livingAliens();
    if (!living.length) return;
    const shooters = living.filter((a) => !this.alienBullets.some((b) => b.owner === a));
    const pool = shooters.length ? shooters : living;
    const alien = pool[Math.floor(Math.random() * pool.length)];
    const sprite = SPRITES[alien.type];
    this.alienBullets.push({
      x: alien.x + sprite.width / 2,
      y: alien.y + sprite.height,
      vy: 65 + this.level * 12,
      owner: alien,
      frame: 0,
    });
  }

  _spawnUfo() {
    if (this.ufo) return;
    const fromLeft = Math.random() < 0.5;
    this.ufo = {
      x: fromLeft ? -20 : GAME_WIDTH + 4,
      y: 28,
      dir: fromLeft ? 1 : -1,
      speed: 32 + this.level * 5,
      points: UFO_POINTS[Math.floor(Math.random() * UFO_POINTS.length)],
    };
    this.audio.ufo();
  }

  _spawnDrop(x, y, type) {
    this.drops.push({
      x: x - 2,
      y: y + 4,
      vy: 38,
      type,
      color: POWERUP_COLORS[type],
      w: 7,
      h: 7,
    });
  }

  _applyPowerup(type) {
    const label = POWERUP_LABELS[type];
    this.menu?.showPowerUp(label);

    switch (type) {
      case POWERUP.DOUBLE:
        this.spread = Math.max(this.spread, 1);
        this.timers.spread = POWERUP_DURATION;
        break;
      case POWERUP.TRIPLE:
        this.spread = 2;
        this.timers.spread = POWERUP_DURATION;
        break;
      case POWERUP.RAPID:
        this.rapidFire = true;
        this.timers.rapid = POWERUP_DURATION;
        break;
      case POWERUP.SHIELD:
        this.shield = true;
        this.timers.shield = POWERUP_DURATION;
        break;
      case POWERUP.LIFE:
        this.lives = Math.min(9, this.lives + 1);
        break;
      case POWERUP.SCORE:
        this.score += 500;
        break;
      default:
        break;
    }
    this._updateHud();
    this.menu?.refreshAccount();
  }

  _tickPowerups(dt) {
    if (this.timers.spread > 0) {
      this.timers.spread -= dt;
      if (this.timers.spread <= 0) {
        this.spread = 0;
        this.timers.spread = 0;
      }
    }
    if (this.timers.rapid > 0) {
      this.timers.rapid -= dt;
      if (this.timers.rapid <= 0) {
        this.rapidFire = false;
        this.timers.rapid = 0;
      }
    }
    if (this.timers.shield > 0) {
      this.timers.shield -= dt;
      if (this.timers.shield <= 0) {
        this.shield = false;
        this.timers.shield = 0;
      }
    }
  }

  _maxBullets() {
    return this.rapidFire ? MAX_BULLETS_RAPID : MAX_BULLETS_NORMAL;
  }

  _fireCooldown() {
    return this.rapidFire ? 0.11 : 0.38;
  }

  _firePlayer() {
    if (this.player.cooldown > 0) return;
    if (this.bullets.length >= this._maxBullets()) return;

    const cx = this.player.x + this.player.width / 2;
    const cy = this.player.y;
    const speed = 220;

    const patterns = [
      [{ vx: 0, vy: -speed }],
      [
        { vx: -22, vy: -speed },
        { vx: 22, vy: -speed },
      ],
      [
        { vx: -48, vy: -speed },
        { vx: 0, vy: -speed },
        { vx: 48, vy: -speed },
      ],
    ];
    const angles = patterns[this.spread] || patterns[0];

    for (const a of angles) {
      if (this.bullets.length >= this._maxBullets()) break;
      this.bullets.push({
        x: cx,
        y: cy,
        px: cx,
        py: cy,
        vx: a.vx,
        vy: a.vy,
      });
    }
    this.player.cooldown = this._fireCooldown();
    this.audio.shoot();
  }

  _destroyUfo() {
    if (!this.ufo) return;
    const u = this.ufo;
    this.score += u.points;
    this._addExplosion(u.x + 6, u.y + 2);
    trackUfoHit();
    this._spawnDrop(u.x + SPRITES.ufo.width / 2 - 2, u.y + 3, rollPowerup());
    this.ufo = null;
  }

  _addExplosion(x, y) {
    this.explosions.push({ x, y, timer: 0.4, frame: 0 });
    this.audio.explosion();
  }

  _hitBunker(px, py) {
    for (const bunker of this.bunkers) {
      const col = Math.floor(px - bunker.x);
      const row = Math.floor(py - bunker.y);
      if (col >= 0 && col < bunker.width && row >= 0 && row < bunker.height) {
        if (bunker.pixels[row][col]) {
          bunker.pixels[row][col] = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const r = row + dr, c = col + dc;
              if (r >= 0 && r < bunker.height && c >= 0 && c < bunker.width && Math.random() < 0.55) {
                bunker.pixels[r][c] = 0;
              }
            }
          }
          return true;
        }
      }
    }
    return false;
  }

  _updatePlaying(dt) {
    this._tickPowerups(dt);

    if (this.input.isLeft()) this.player.x -= this.player.speed * dt;
    if (this.input.isRight()) this.player.x += this.player.speed * dt;
    this.player.x = Math.max(4, Math.min(GAME_WIDTH - this.player.width - 4, this.player.x));
    if (this.player.cooldown > 0) this.player.cooldown -= dt;
    if (this.input.consumeFire()) this._firePlayer();

    this.ufoTimer -= dt;
    if (this.ufoTimer <= 0) {
      this._spawnUfo();
      this.ufoTimer = 12 + Math.random() * 18;
    }
    if (this.ufo) {
      this.ufo.x += this.ufo.dir * this.ufo.speed * dt;
      if (this.ufo.x < -24 || this.ufo.x > GAME_WIDTH + 8) this.ufo = null;
    }

    this.alienMoveTimer -= dt;
    if (this.alienMoveTimer <= 0) {
      this.alienSoundsThisStep = 0;
      this._moveAliens();
      this.alienMoveTimer = this.alienMoveInterval;
    }

    this.alienShootTimer -= dt;
    if (this.alienShootTimer <= 0) {
      this._alienShoot();
      this.alienShootTimer = Math.max(
        0.3,
        this.alienShootBase - (1 - this._livingAliens().length / this.aliens.length) * 0.5
      );
    }

    for (const b of this.bullets) {
      b.px = b.x;
      b.py = b.y;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }
    this.bullets = this.bullets.filter((b) => b.y > -12 && b.x > -12 && b.x < GAME_WIDTH + 12);

    for (const d of this.drops) {
      d.y += d.vy * dt;
      if (this._rectHit(
        this.player.x + 2,
        this.player.y + 2,
        this.player.width - 4,
        this.player.height - 2,
        d.x,
        d.y,
        d.w,
        d.h
      )) {
        this._applyPowerup(d.type);
        d.y = 9999;
      }
    }
    this.drops = this.drops.filter((d) => d.y < GAME_HEIGHT + 12);

    for (const b of this.alienBullets) {
      b.y += b.vy * dt;
      b.frame += dt * 12;
    }
    this.alienBullets = this.alienBullets.filter((b) => b.y < GAME_HEIGHT + 8);

    for (const b of this.bullets) {
      let hit = false;

      if (this.ufo) {
        const uw = SPRITES.ufo.width;
        const uh = SPRITES.ufo.height;
        if (this._bulletHitsBox(b, this.ufo.x, this.ufo.y, uw, uh)) {
          this._destroyUfo();
          hit = true;
        }
      }

      if (!hit) {
        for (const a of this.aliens) {
          if (!a.alive) continue;
          const box = this._alienHitbox(a);
          if (this._bulletHitsBox(b, box.x, box.y, box.w, box.h)) {
            a.alive = false;
            this.score += SPRITES[a.type].points;
            trackAlienKill();
            this._addExplosion(a.x, a.y);
            hit = true;
            break;
          }
        }
      }

      if (!hit) {
        const bx = b.x;
        const by = b.y;
        if (this._hitBunker(bx, by) || this._hitBunker(bx, by - 3)) hit = true;
      }
      if (hit) b.y = -999;
    }
    this.bullets = this.bullets.filter((b) => b.y > -100);

    for (const b of this.alienBullets) {
      if (!this.shield && this._rectHit(
        b.x - 2,
        b.y - 2,
        4,
        8,
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      )) {
        this._playerHit();
        b.y = 9999;
        continue;
      }
      if (this._hitBunker(b.x, b.y)) b.y = 9999;
    }
    this.alienBullets = this.alienBullets.filter((b) => b.y < GAME_HEIGHT + 8);

    for (const e of this.explosions) {
      e.timer -= dt;
      e.frame += dt * 10;
    }
    this.explosions = this.explosions.filter((e) => e.timer > 0);

    if (!this._livingAliens().length) {
      this.state = 'levelclear';
      this.levelClearTimer = 2;
      this.audio.levelUp();
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('si-highscore', String(this.highScore));
    }
    this._updateHud();
  }

  _playerHit() {
    if (this.shield) {
      this.shield = false;
      this.timers.shield = 0;
      this._addExplosion(this.player.x + 4, this.player.y);
      this._updateHud();
      return;
    }

    this.lives--;
    this._addExplosion(this.player.x, this.player.y);
    this.audio.playerHit();
    this._resetPowerups();
    this.bullets = [];
    this.alienBullets = [];
    this._updateHud();
    if (this.lives <= 0) {
      this._gameOver();
    } else {
      this.player.x = GAME_WIDTH / 2 - this.player.width / 2;
    }
  }

  _gameOver() {
    this.state = 'gameover';
    this.gameOverTimer = 3;
    saveLastScore(this.score);
    this.audio.gameOver();
  }

  _nextLevel() {
    this.level++;
    this._applyLevelSpeed();
    this._initAliens();
    this.bunkers.forEach((b) => {
      b.pixels = SPRITES.bunker.pixels.map((row) => [...row]);
    });
    this.bullets = [];
    this.alienBullets = [];
    this.drops = [];
    this.alienMoveTimer = 0;
    this.state = 'playing';
    this._updateHud();
  }

  update(dt) {
    this.animFrame += dt;

    if (this.input.isPause()) {
      if (!this.pauseLatch && this.state === 'playing') this.state = 'paused';
      else if (!this.pauseLatch && this.state === 'paused') this.state = 'playing';
      this.pauseLatch = true;
    } else {
      this.pauseLatch = false;
    }

    if (this.state === 'menu' || this.state === 'paused') return;

    if (this.state === 'levelclear') {
      this.levelClearTimer -= dt;
      if (this.levelClearTimer <= 0) this._nextLevel();
      return;
    }

    if (this.state === 'gameover') {
      this.gameOverTimer -= dt;
      return;
    }

    this._updatePlaying(dt);
  }

  _drawBackground() {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    for (let i = 0; i < 40; i++) {
      const sx = (i * 47 + Math.floor(this.animFrame * 10)) % GAME_WIDTH;
      const sy = (i * 31) % (GAME_HEIGHT - 40);
      ctx.fillStyle = i % 5 === 0 ? '#333' : '#1a1a1a';
      ctx.fillRect(sx, sy, 1, 1);
    }
  }

  _drawBunker(bunker) {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.purple;
    for (let row = 0; row < bunker.height; row++) {
      for (let col = 0; col < bunker.width; col++) {
        if (bunker.pixels[row][col]) {
          ctx.fillRect(snap(bunker.x) + col, snap(bunker.y) + row, 1, 1);
        }
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    this._drawBackground();

    if (this.state === 'menu') return;

    for (const b of this.bunkers) this._drawBunker(b);

    for (const a of this.aliens) {
      if (!a.alive) continue;
      drawPixelSprite(ctx, SPRITES[a.type], a.x, a.y, 1, this.alienAnimFrame);
    }

    if (this.ufo) {
      drawPixelSprite(ctx, SPRITES.ufo, this.ufo.x, this.ufo.y, 1);
    }

    for (const d of this.drops) {
      drawPowerupPickup(ctx, d, 1, Math.floor(this.animFrame * 6));
    }

    const blink = this.state !== 'gameover' || Math.floor(this.animFrame * 4) % 2 === 0;
    if (blink) {
      if (this.shield && Math.floor(this.animFrame * 8) % 2 === 0) {
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          snap(this.player.x) - 1,
          snap(this.player.y) - 1,
          this.player.width + 2,
          this.player.height + 2
        );
      }
      drawPlayerShip(ctx, SPRITES.player, this.player.x, this.player.y, 1);
    }

    for (const b of this.bullets) {
      drawPlayerBullet(ctx, b, 1);
    }
    for (const b of this.alienBullets) {
      drawAlienBullet(ctx, b.x, b.y, 1, Math.floor(b.frame));
    }

    for (const e of this.explosions) {
      drawPixelSprite(ctx, SPRITES.explosion, e.x, e.y, 1, Math.floor(e.frame));
    }

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, GAME_WIDTH, 18);
    ctx.fillStyle = COLORS.white;
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE ${String(this.score).padStart(6, '0')}`, 4, 12);

    if (this.state === 'paused') this._drawCenterText('PAUSED', 14);
    if (this.state === 'levelclear') this._drawCenterText(`WAVE ${this.level} CLEAR!`, 12);
    if (this.state === 'gameover') this._drawCenterText('GAME OVER', 14);
  }

  _drawCenterText(text, size, y = GAME_HEIGHT / 2) {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.white;
    ctx.font = `${size}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(text, GAME_WIDTH / 2, y);
  }

  tick(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000 || 0);
    this.lastTime = timestamp;

    if (this.state === 'gameover' && this.gameOverTimer <= 0) {
      this.state = 'menu';
      this.menu?.showMenu();
    }

    if (this.state !== 'menu') {
      this.update(dt);
      this.draw();
    }
    requestAnimationFrame((t) => this.tick(t));
  }

  run() {
    this._updateHud();
    requestAnimationFrame((t) => this.tick(t));
  }
}
