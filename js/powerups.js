export const POWERUP_DURATION = 10;

export const POWERUP = {
  DOUBLE: 'double',
  TRIPLE: 'triple',
  RAPID: 'rapid',
  LIFE: 'life',
  SCORE: 'score',
  SHIELD: 'shield',
};

/** Weighted loot table when UFO is destroyed */
export const UFO_LOOT = [
  { type: POWERUP.DOUBLE, weight: 22 },
  { type: POWERUP.TRIPLE, weight: 14 },
  { type: POWERUP.RAPID, weight: 20 },
  { type: POWERUP.LIFE, weight: 10 },
  { type: POWERUP.SCORE, weight: 18 },
  { type: POWERUP.SHIELD, weight: 16 },
];

export function rollPowerup() {
  const total = UFO_LOOT.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const entry of UFO_LOOT) {
    r -= entry.weight;
    if (r <= 0) return entry.type;
  }
  return POWERUP.DOUBLE;
}

export const POWERUP_LABELS = {
  [POWERUP.DOUBLE]: 'DOUBLE SHOT',
  [POWERUP.TRIPLE]: 'TRIPLE SHOT',
  [POWERUP.RAPID]: 'RAPID FIRE',
  [POWERUP.LIFE]: 'EXTRA LIFE',
  [POWERUP.SCORE]: 'BONUS 500',
  [POWERUP.SHIELD]: 'SHIELD',
};

export const POWERUP_COLORS = {
  [POWERUP.DOUBLE]: '#4ade80',
  [POWERUP.TRIPLE]: '#60a5fa',
  [POWERUP.RAPID]: '#f97316',
  [POWERUP.LIFE]: '#f472b6',
  [POWERUP.SCORE]: '#facc15',
  [POWERUP.SHIELD]: '#a78bfa',
};
