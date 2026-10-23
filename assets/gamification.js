/**
 * Aim High - Gamification & Audio Engine
 * Designed for Gen-Z & Speed attention spans:
 * Instant feedback, dynamic combo multipliers, Web Audio synthesizer,
 * persistent XP, levels, daily streaks, soundboard, and particle effects.
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('aim_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('aim_sound_muted', this.muted);
    return this.muted;
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  playCombo(combo = 2) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const mult = Math.min(combo, 6);
    const chords = [
      587.33 * (1 + mult * 0.06),
      739.99 * (1 + mult * 0.06),
      880.00 * (1 + mult * 0.06)
    ];
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.14, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.45);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  playWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }
}

const sounds = new SoundFX();

const Gamification = {
  getProfile() {
    const raw = localStorage.getItem('aim_user_profile');
    const today = new Date().toISOString().split('T')[0];
    let data = {
      xp: 120,
      streak: 3,
      lastActive: today,
      avatar: '⚡',
      name: 'AimHighChampion',
      gamesPlayed: 4,
      badges: ['first_win', 'streak_3']
    };
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        data = { ...data, ...parsed };
        if (data.lastActive !== today) {
          const lastDate = new Date(data.lastActive);
          const currDate = new Date(today);
          const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            data.streak = (data.streak || 1) + 1;
          } else if (diffDays > 1) {
            data.streak = 1;
          }
          data.lastActive = today;
          this.saveProfile(data);
        }
      } catch(e) {}
    } else {
      this.saveProfile(data);
    }
    return data;
  },

  saveProfile(p) {
    try {
      localStorage.setItem('aim_user_profile', JSON.stringify(p));
    } catch(e) {}
  },

  addXP(points) {
    const p = this.getProfile();
    const oldLevel = this.getLevel(p.xp).level;
    p.xp += points;
    p.gamesPlayed = (p.gamesPlayed || 0) + 1;
    const newLevelInfo = this.getLevel(p.xp);
    const levelUp = newLevelInfo.level > oldLevel;
    if (levelUp && !p.badges.includes(`level_${newLevelInfo.level}`)) {
      p.badges.push(`level_${newLevelInfo.level}`);
    }
    this.saveProfile(p);
    return { newXP: p.xp, levelUp, levelInfo: newLevelInfo };
  },

  getLevel(xp) {
    const levels = [
      { level: 1, minXP: 0, title: 'English Novice', badge: '🐣' },
      { level: 2, minXP: 100, title: 'Word Scout', badge: '🔍' },
      { level: 3, minXP: 300, title: 'Grammar Ninja', badge: '🥷' },
      { level: 4, minXP: 600, title: 'Vocab Beast', badge: '🦁' },
      { level: 5, minXP: 1000, title: 'Fluent Prodigy', badge: '⚡' },
      { level: 6, minXP: 1600, title: 'Aim High Legend', badge: '👑' },
      { level: 7, minXP: 2500, title: 'English Apex Scholar', badge: '🌌' },
      { level: 8, minXP: 4000, title: 'Mythic Grandmaster', badge: '🏆' }
    ];
    let cur = levels[0];
    for (let l of levels) {
      if (xp >= l.minXP) cur = l;
    }
    const curIdx = levels.indexOf(cur);
    const next = levels[curIdx + 1] || { minXP: cur.minXP + 2000, title: 'Max Level' };
    const span = Math.max(1, next.minXP - cur.minXP);
    const progress = Math.min(100, Math.max(0, Math.round(((xp - cur.minXP) / span) * 100)));
    return { ...cur, nextXP: next.minXP, progress };
  },

  triggerSparks(x, y, color = '#38bdf8') {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'spark-particle';
      const angle = (Math.PI * 2 * i) / count;
      const velocity = Math.random() * 50 + 40;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;
      p.style.cssText = `
        position: fixed;
        left: ${x}px; top: ${y}px;
        width: 6px; height: 6px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px ${color};
        transform: translate(0, 0);
        transition: transform 0.6s cubic-bezier(0.1, 1, 0.1, 1), opacity 0.6s;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 600);
    }
  }
};

window.AimSounds = sounds;
window.AimGamification = Gamification;
