import {
  SPRITES,
  COLORS,
  drawPixelSprite,
  drawAlienBullet,
  drawPlayerBulletTrail,
} from './sprites.js';
import { AudioManager } from './audio.js';
import { InputManager } from './input.js';

const GAME_WIDTH = 224;
const GAME_HEIGHT = 256;
const PIXEL_SCALE = 3;

const UFO_POINTS = [50, 100, 150, 300];

export class SpaceInvadersGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = new AudioManager();
    this.input = new InputManager();
    this.scale = PIXEL_SCALE;
    this.lastTime = 0;
    this.animFrame = 0;
    this.state = 'title'; // title, playing, paused, gameover, levelclear
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
    this.weaponLevel = 0; // 0=single, 1=double, 2=triple
    this.weaponTimer = 0;

    this.player = {
      x: GAME_WIDTH / 2 - 6,
      y: GAME_HEIGHT - 24,
      width: 13,
      speed: 90,
      cooldown: 0,
    };

    this.bullets = [];
    this.alienBullets = [];
    this.explosions = [];
    this.ufo = null;
    this.ufoTimer = 8 + Math.random() * 12;

    this._initAliens();
    this._initBunkers();

    this.alienDir = 1;
    this.alienSpeed = 8;
    this.alienStepDown = 8;
    this.alienMoveTimer = 0;
    this.alienMoveInterval = 0.8;
    this.alienShootTimer = 1.5;
    this.alienAnimFrame = 0;
    this.alienSoundsThisStep = 0;
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

  _updateHud() {
    document.getElementById('score').textContent = String(this.score).padStart(6, '0');
    document.getElementById('high-score').textContent = String(this.highScore).padStart(6, '0');
    document.getElementById('level').textContent = String(this.level);
    const livesEl = document.getElementById('lives');
    if (livesEl) livesEl.textContent = '♥'.repeat(this.lives) || '—';
    const weaponNames = ['SINGLE', 'DOUBLE', 'TRIPLE'];
    const weaponEl = document.getElementById('weapon');
    if (weaponEl) weaponEl.textContent = weaponNames[this.weaponLevel] || 'SINGLE';
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
    this.alienMoveInterval = Math.max(0.12, 0.8 - ratio * 0.65 - (this.level - 1) * 0.05);
    this.alienSpeed = 8 + ratio * 18 + (this.level - 1) * 2;
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
      vy: 70 + this.level * 8,
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
      speed: 35,
      points: UFO_POINTS[Math.floor(Math.random() * UFO_POINTS.length)],
    };
    this.audio.ufo();
  }

  _firePlayer() {
    if (this.player.cooldown > 0) return;
    const cx = this.player.x + this.player.width / 2;
    const cy = this.player.y;
    const speed = 200;

    const angles = [
      [{ vx: 0, vy: -speed }],
      [
        { vx: -25, vy: -speed },
        { vx: 25, vy: -speed },
      ],
      [
        { vx: -55, vy: -speed },
        { vx: 0, vy: -speed },
        { vx: 55, vy: -speed },
      ],
    ][this.weaponLevel];

    for (const a of angles) {
      this.bullets.push({ x: cx, y: cy, vx: a.vx, vy: a.vy });
    }
    this.player.cooldown = 0.35;
    this.audio.shoot();
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
          // damage surrounding pixels
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const r = row + dr, c = col + dc;
              if (r >= 0 && r < bunker.height && c >= 0 && c < bunker.width && Math.random() < 0.6) {
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

  _rectHit(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  _updatePlaying(dt) {
    if (this.weaponTimer > 0) {
      this.weaponTimer -= dt;
      if (this.weaponTimer <= 0) this.weaponLevel = 0;
    }

    // Player movement
    if (this.input.isLeft()) this.player.x -= this.player.speed * dt;
    if (this.input.isRight()) this.player.x += this.player.speed * dt;
    this.player.x = Math.max(4, Math.min(GAME_WIDTH - this.player.width - 4, this.player.x));
    if (this.player.cooldown > 0) this.player.cooldown -= dt;
    if (this.input.consumeFire()) this._firePlayer();

    // UFO
    this.ufoTimer -= dt;
    if (this.ufoTimer <= 0) {
      this._spawnUfo();
      this.ufoTimer = 12 + Math.random() * 18;
    }
    if (this.ufo) {
      this.ufo.x += this.ufo.dir * this.ufo.speed * dt;
      if (this.ufo.x < -24 || this.ufo.x > GAME_WIDTH + 8) this.ufo = null;
    }

    // Alien movement
    this.alienMoveTimer -= dt;
    if (this.alienMoveTimer <= 0) {
      this.alienSoundsThisStep = 0;
      this._moveAliens();
      this.alienMoveTimer = this.alienMoveInterval;
    }

    this.alienShootTimer -= dt;
    if (this.alienShootTimer <= 0) {
      this._alienShoot();
      this.alienShootTimer = Math.max(0.4, 1.8 - this.level * 0.1 - (1 - this._livingAliens().length / this.aliens.length));
    }

    // Bullets
    for (const b of this.bullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }
    this.bullets = this.bullets.filter((b) => b.y > -8 && b.x > -8 && b.x < GAME_WIDTH + 8);

    for (const b of this.alienBullets) {
      b.y += b.vy * dt;
      b.frame += dt * 12;
    }
    this.alienBullets = this.alienBullets.filter((b) => b.y < GAME_HEIGHT + 8);

    // Collisions — player bullets
    for (const b of this.bullets) {
      let hit = false;

      if (this.ufo && this._rectHit(b.x - 1, b.y - 1, 3, 3, this.ufo.x, this.ufo.y, SPRITES.ufo.width, SPRITES.ufo.height)) {
        this.score += this.ufo.points;
        this._addExplosion(this.ufo.x + 4, this.ufo.y);
        this.ufo = null;
        hit = true;
      }

      if (!hit) {
        for (const a of this.aliens) {
          if (!a.alive) continue;
          const sp = SPRITES[a.type];
          if (this._rectHit(b.x, b.y, 2, 4, a.x, a.y, sp.width, sp.height)) {
            a.alive = false;
            this.score += sp.points;
            this._addExplosion(a.x, a.y);
            hit = true;
            break;
          }
        }
      }

      if (!hit && this._hitBunker(b.x, b.y)) hit = true;
      if (hit) b.y = -999;
    }
    this.bullets = this.bullets.filter((b) => b.y > -100);

    // Alien bullets vs player / bunkers
    const pw = SPRITES.player.width;
    const ph = SPRITES.player.height;
    for (const b of this.alienBullets) {
      if (this._rectHit(b.x - 1, b.y - 1, 3, 6, this.player.x, this.player.y, pw, ph)) {
        this._playerHit();
        b.y = 9999;
        continue;
      }
      if (this._hitBunker(b.x, b.y)) b.y = 9999;
    }
    this.alienBullets = this.alienBullets.filter((b) => b.y < GAME_HEIGHT + 8);

    // Explosions
    for (const e of this.explosions) {
      e.timer -= dt;
      e.frame += dt * 10;
    }
    this.explosions = this.explosions.filter((e) => e.timer > 0);

    // Level complete
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
    this.lives--;
    this._addExplosion(this.player.x, this.player.y);
    this.audio.playerHit();
    this.weaponLevel = 0;
    this.weaponTimer = 0;
    this.bullets = [];
    this.alienBullets = [];
    this._updateHud();
    if (this.lives <= 0) {
      this._gameOver();
    } else {
      this.player.x = GAME_WIDTH / 2 - 6;
    }
  }

  _gameOver() {
    this.state = 'gameover';
    this.gameOverTimer = 3;
    this.audio.gameOver();
  }

  _nextLevel() {
    this.level++;
    this.weaponLevel = Math.min(2, this.weaponLevel + 1);
    this.weaponTimer = 20;
    this.alienMoveInterval = Math.max(0.12, 0.8 - (this.level - 1) * 0.05);
    this._initAliens();
    this.bullets = [];
    this.alienBullets = [];
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

    if (this.state === 'title' || this.state === 'paused') return;

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

    // starfield
    ctx.fillStyle = '#111';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 47 + Math.floor(this.animFrame * 10)) % GAME_WIDTH;
      const sy = (i * 31) % (GAME_HEIGHT - 40);
      if (i % 5 === 0) ctx.fillStyle = '#333';
      else ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(sx, sy, 1, 1);
    }
  }

  _drawBunker(bunker) {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.purple;
    for (let row = 0; row < bunker.height; row++) {
      for (let col = 0; col < bunker.width; col++) {
        if (bunker.pixels[row][col]) {
          ctx.fillRect(bunker.x + col, bunker.y + row, 1, 1);
        }
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    this._drawBackground();

    if (this.state === 'title') {
      this._drawTitle();
      return;
    }

    // Bunkers
    for (const b of this.bunkers) this._drawBunker(b);

    // Aliens
    for (const a of this.aliens) {
      if (!a.alive) continue;
      const sprite = SPRITES[a.type];
      drawPixelSprite(ctx, sprite, a.x, a.y, 1, this.alienAnimFrame);
    }

    // UFO
    if (this.ufo) {
      drawPixelSprite(ctx, SPRITES.ufo, this.ufo.x, this.ufo.y, 1);
    }

    // Player
    if (this.state !== 'gameover' || Math.floor(this.animFrame * 4) % 2 === 0) {
      drawPixelSprite(ctx, SPRITES.player, this.player.x, this.player.y, 1);
    }

    // Bullets
    for (const b of this.bullets) {
      drawPlayerBulletTrail(ctx, b, 1);
    }
    for (const b of this.alienBullets) {
      drawAlienBullet(ctx, b.x, b.y, 1, Math.floor(b.frame));
    }

    // Explosions
    for (const e of this.explosions) {
      drawPixelSprite(ctx, SPRITES.explosion, e.x, e.y, 1, Math.floor(e.frame));
    }

    // HUD line
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, GAME_WIDTH, 18);
    ctx.fillStyle = COLORS.white;
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE ${String(this.score).padStart(6, '0')}`, 4, 12);

    if (this.state === 'paused') this._drawCenterText('PAUSED', 14);
    if (this.state === 'levelclear') this._drawCenterText(`LEVEL ${this.level - 1} CLEAR!`, 12);
    if (this.state === 'gameover') this._drawCenterText('GAME OVER', 14);
  }

  _drawTitle() {
    this._drawCenterText('SPACE', 28);
    this._drawCenterText('INVADERS', 22);
    this.ctx.fillStyle = COLORS.green;
    this._drawCenterText('TAP OR PRESS SPACE', 10, GAME_HEIGHT / 2 + 30);
    this._drawCenterText('TO START', 10, GAME_HEIGHT / 2 + 44);
    if (this.highScore > 0) {
      this.ctx.fillStyle = COLORS.yellow;
      this._drawCenterText(`HIGH ${this.highScore}`, 8, GAME_HEIGHT / 2 + 70);
    }
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

    if (this.state === 'title') {
      if (this.input.consumeFire()) {
        this.start();
      }
      const startBtn = document.getElementById('btn-start');
      if (startBtn?.dataset.pressed === 'true') {
        startBtn.dataset.pressed = 'false';
        this.start();
      }
    }

    if (this.state === 'gameover' && this.gameOverTimer <= 0) {
      if (this.input.consumeFire()) this.state = 'title';
    }

    this.update(dt);
    this.draw();
    requestAnimationFrame((t) => this.tick(t));
  }

  run() {
    this._updateHud();
    requestAnimationFrame((t) => this.tick(t));
  }
}
