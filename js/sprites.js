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

  // Sleek fighter — 1=hull, 2=cockpit, 3=engine glow
  player: {
    pixels: [
      [0,0,0,0,0,1,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0,0,0],
      [0,0,0,1,1,2,1,1,0,0,0,0,0],
      [0,0,1,1,1,1,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,0,1,3,3,3,1,0,1,0,0,0],
    ],
    palette: {
      1: COLORS.yellow,
      2: '#7df9ff',
      3: '#ff6b35',
    },
    width: 13,
    height: 7,
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

export function drawPlayerShip(ctx, sprite, x, y, scale = 1) {
  const pixels = sprite.pixels;
  const palette = sprite.palette || { 1: sprite.color || COLORS.yellow };
  const ox = snap(x);
  const oy = snap(y);
  const s = Math.max(1, snap(scale));

  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      const v = pixels[row][col];
      if (v) {
        ctx.fillStyle = palette[v] || COLORS.yellow;
        ctx.fillRect(ox + col * s, oy + row * s, s, s);
      }
    }
  }
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

export function drawPlayerBullet(ctx, bullet, scale = 1) {
  const s = Math.max(1, snap(scale));
  const x = snap(bullet.x) - 1;
  const y = snap(bullet.y);
  ctx.fillStyle = COLORS.yellow;
  ctx.fillRect(x, y, 3, s * 3);
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(x + 1, y, s, s);
}

export function drawPowerupPickup(ctx, pickup, scale = 1, anim = 0) {
  const s = Math.max(1, snap(scale));
  const ox = snap(pickup.x);
  const oy = snap(pickup.y);
  const pulse = anim % 2 === 0;
  const color = pickup.color;

  ctx.fillStyle = pulse ? color : '#ffffff';
  ctx.fillRect(ox, oy + s, s * 3, s);
  ctx.fillRect(ox + s, oy, s, s * 5);
  ctx.fillRect(ox + s * 2, oy + s, s, s * 3);
  ctx.fillStyle = '#000';
  ctx.fillRect(ox + s, oy + s * 2, s, s);
}
