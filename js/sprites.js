// Pixel-art sprite definitions matching the reference sheet
// 1 = draw pixel, 0 = transparent

export const COLORS = {
  green: '#39ff14',
  blue: '#00bfff',
  pink: '#ff69b4',
  yellow: '#ffff00',
  orange: '#ff8c00',
  purple: '#bf5fff',
  white: '#ffffff',
  black: '#000000',
};

export const SPRITES = {
  alienA: {
    frames: [
      [
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,0,1],
        [1,0,1,0,0,1,0,1],
        [0,0,0,1,1,0,0,0],
        [0,0,1,0,0,1,0,0],
      ],
      [
        [0,0,0,1,1,0,0,0],
        [0,1,1,1,1,1,0,0],
        [1,1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1,1],
        [0,1,0,1,1,0,1,0],
        [1,0,0,1,1,0,0,1],
        [0,0,1,1,1,1,0,0],
        [0,0,1,0,0,1,0,0],
      ],
    ],
    color: COLORS.green,
    points: 10,
    width: 8,
    height: 8,
  },

  alienB: {
    frames: [
      [
        [0,0,1,0,0,0,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,1,0,0,0,0],
        [1,1,0,1,1,1,0,1,1,0,0],
        [1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,0,1,0,1,1,0,0,0],
        [0,1,0,1,1,1,0,1,0,0,0],
        [1,0,0,0,0,0,0,0,0,1,0],
      ],
      [
        [0,0,1,0,0,0,1,0,0,0,0],
        [0,0,0,1,1,1,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0,0,0],
        [1,1,0,1,1,1,0,1,1,0,0],
        [1,1,1,1,1,1,1,1,1,1,0],
        [0,0,1,1,0,1,1,0,0,0,0],
        [0,1,0,1,1,1,0,1,0,0,0],
        [0,0,1,0,0,0,1,0,0,0,0],
      ],
    ],
    color: COLORS.blue,
    points: 20,
    width: 11,
    height: 8,
  },

  alienC: {
    frames: [
      [
        [0,0,0,0,1,1,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0,0,0],
        [0,1,1,0,1,1,0,1,1,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,0,0],
        [1,0,1,1,1,1,1,1,0,1,0,0],
        [1,0,1,0,0,0,0,1,0,1,0,0],
        [0,0,0,1,1,0,1,1,0,0,0,0],
      ],
      [
        [0,0,0,0,1,1,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0,0,0],
        [0,1,1,0,1,1,0,1,1,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,1,0,1,0,0,0,0],
        [0,1,0,0,0,0,0,0,1,0,0,0],
        [1,0,1,0,0,0,0,1,0,1,0,0],
      ],
    ],
    color: COLORS.pink,
    points: 30,
    width: 12,
    height: 8,
  },

  player: {
    pixels: [
      [0,0,0,0,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    color: COLORS.yellow,
    width: 13,
    height: 5,
  },

  ufo: {
    pixels: [
      [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [0,0,1,1,0,1,1,1,1,0,1,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0],
      [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    ],
    color: COLORS.orange,
    width: 16,
    height: 7,
  },

  bunker: {
    pixels: [
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
    ],
    color: COLORS.purple,
    width: 23,
    height: 12,
  },

  explosion: {
    frames: [
      [
        [0,0,1,0,0,0,1,0,0],
        [0,1,0,1,0,1,0,1,0],
        [1,0,0,0,1,0,0,0,1],
        [0,1,0,1,0,1,0,1,0],
        [0,0,1,0,0,0,1,0,0],
      ],
      [
        [0,1,0,0,0,0,0,1,0],
        [1,0,1,0,0,0,1,0,1],
        [0,0,0,1,1,1,0,0,0],
        [1,0,1,0,0,0,1,0,1],
        [0,1,0,0,0,0,0,1,0],
      ],
    ],
    color: COLORS.orange,
    width: 9,
    height: 5,
  },
};

/** Snap to integer pixel grid — prevents blurry / offset pixels */
export function snap(v) {
  return v | 0;
}

export function drawPixelSprite(ctx, sprite, x, y, scale = 1, frameIndex = 0) {
  const pixels = sprite.frames
    ? sprite.frames[frameIndex % sprite.frames.length]
    : sprite.pixels;
  const ox = snap(x);
  const oy = snap(y);
  const s = Math.max(1, snap(scale));

  ctx.fillStyle = sprite.color;
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      if (pixels[row][col]) {
        ctx.fillRect(ox + col * s, oy + row * s, s, s);
      }
    }
  }
}

export function drawAlienBullet(ctx, x, y, scale = 1, frame = 0) {
  const pattern = [
    [1, 0],
    [0, 1],
    [1, 0],
    [0, 1],
    [1, 0],
    [0, 1],
    [1, 0],
  ];
  const ox = snap(x);
  const oy = snap(y);
  const s = Math.max(1, snap(scale));
  const offset = frame % 2;

  ctx.fillStyle = COLORS.pink;
  for (let i = 0; i < pattern.length; i++) {
    const col = (pattern[i][0] ? 0 : 1) ^ offset;
    ctx.fillRect(ox + col * s, oy + i * s, s, s);
  }
}

export function drawPlayerBulletTrail(ctx, bullet, scale = 1) {
  const s = Math.max(1, snap(scale));
  const trailLen = 4;

  ctx.fillStyle = COLORS.yellow;
  for (let i = 1; i <= trailLen; i++) {
    const tx = snap(bullet.x + bullet.vx * i * 0.06);
    const ty = snap(bullet.y + bullet.vy * i * 0.06);
    ctx.fillRect(tx, ty, s, s);
  }
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(snap(bullet.x), snap(bullet.y), s, s);
}
