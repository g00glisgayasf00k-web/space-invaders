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

  playerBullet: {
    pixels: [[1],[1],[1]],
    color: COLORS.yellow,
    width: 1,
    height: 3,
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

export function drawPixelSprite(ctx, sprite, x, y, scale, frameIndex = 0) {
  const pixels = sprite.frames
    ? sprite.frames[frameIndex % sprite.frames.length]
    : sprite.pixels;
  const color = sprite.color;

  ctx.fillStyle = color;
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      if (pixels[row][col]) {
        ctx.fillRect(
          Math.floor(x + col * scale),
          Math.floor(y + row * scale),
          Math.ceil(scale),
          Math.ceil(scale)
        );
      }
    }
  }
}

export function drawAlienBullet(ctx, x, y, scale, frame) {
  const pattern = [
    [1,0],
    [0,1],
    [1,0],
    [0,1],
    [1,0],
    [0,1],
    [1,0],
  ];
  ctx.fillStyle = COLORS.pink;
  const offset = frame % 2;
  for (let i = 0; i < pattern.length; i++) {
    const col = (pattern[i][0] ? 0 : 1) ^ offset;
    ctx.fillRect(
      Math.floor(x + col * scale),
      Math.floor(y + i * scale),
      Math.ceil(scale),
      Math.ceil(scale)
    );
  }
}

export function drawPlayerBulletTrail(ctx, bullet, scale) {
  const trailLen = 4;
  ctx.fillStyle = COLORS.yellow;
  for (let i = 1; i <= trailLen; i++) {
    const ty = bullet.y + bullet.vy * i * 0.8;
    const tx = bullet.x + bullet.vx * i * 0.8;
    ctx.fillRect(Math.floor(tx), Math.floor(ty), Math.ceil(scale), Math.ceil(scale));
  }
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(Math.floor(bullet.x), Math.floor(bullet.y), Math.ceil(scale), Math.ceil(scale));
}
