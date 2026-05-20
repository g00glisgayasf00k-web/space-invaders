export class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.unlocked = false;
  }

  unlock() {
    if (this.unlocked) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.unlocked = true;
    } catch {
      this.enabled = false;
    }
  }

  beep(freq, duration, type = 'square', volume = 0.08) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  shoot() { this.beep(880, 0.06); }
  alienMove() { this.beep(55 + Math.random() * 30, 0.03, 'square', 0.04); }
  explosion() { this.beep(120, 0.15, 'sawtooth', 0.1); }
  ufo() { this.beep(200, 0.08, 'sine', 0.05); }
  playerHit() { this.beep(80, 0.3, 'sawtooth', 0.12); }
  gameOver() {
    [440, 330, 220].forEach((f, i) => setTimeout(() => this.beep(f, 0.2), i * 200));
  }
  levelUp() { this.beep(660, 0.1); this.beep(880, 0.15); }
}
