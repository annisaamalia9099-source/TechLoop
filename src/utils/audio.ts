// Web Audio API motion graphics background music synthesizer + Web Speech API voiceover narrator

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private currentStep = 0;
  private masterGain: GainNode | null = null;

  // Modern tech motion-graphics progression in D minor / F major:
  // Dm7 -> Bbmaj7 -> Fmaj7 -> C9
  private chords = [
    { root: 73.42, notes: [146.83, 220.00, 261.63, 349.23] }, // Dm7 (D2, D3, A3, C4, F4)
    { root: 58.27, notes: [116.54, 233.08, 293.66, 349.23] }, // Bbmaj7 (Bb1, Bb2, D4, F4)
    { root: 87.31, notes: [174.61, 261.63, 329.63, 392.00] }, // Fmaj7 (F2, F3, C4, E4, G4)
    { root: 65.41, notes: [130.81, 196.00, 246.94, 293.66] }, // C9 (C2, C3, G3, B3, D4)
  ];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.playNextBar();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playNextBar() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const bar = this.chords[this.currentStep % this.chords.length];
    const now = this.ctx.currentTime;
    const barDuration = 2.4; // seconds per chord (100 BPM groove)

    // 1. Warm Synth Pad Chords
    bar.notes.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.003, now); // soft chorus detune

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.setValueAtTime(1.5, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + barDuration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + barDuration);
      osc2.stop(now + barDuration);
    });

    // 2. Warm Bass Pluck
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    const bassFilter = this.ctx.createBiquadFilter();

    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(bar.root, now);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(280, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.start(now);
    bassOsc.stop(now + 1.2);

    // 3. Subtle dynamic rim/hi-hat click on off-beat for tech motion feel
    [0.6, 1.2, 1.8].forEach((offset) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + offset;
      const noise = this.ctx.createOscillator();
      const noiseGain = this.ctx.createGain();
      const noiseFilter = this.ctx.createBiquadFilter();

      noise.type = 'square';
      noise.frequency.setValueAtTime(800 + Math.random() * 200, t);
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3500, t);

      noiseGain.gain.setValueAtTime(0.001, t);
      noiseGain.gain.linearRampToValueAtTime(0.015, t + 0.005);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noise.start(t);
      noise.stop(t + 0.06);
    });

    this.currentStep++;
    this.timer = window.setTimeout(() => {
      this.playNextBar();
    }, barDuration * 1000 - 50);
  }
}

export const ambientMusic = new AmbientSynthesizer();

export function speakNarration(
  text: string,
  lang: 'id-ID' | 'en-US' = 'id-ID',
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  // Google ad female tone: warm, natural, friendly, non-robotic
  utterance.rate = 1.02;
  utterance.pitch = 1.08;

  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize high-quality natural Indonesian female voices (Google Bahasa Indonesia, Gadis, Natural)
    const femaleVoice = 
      voices.find((v) => v.lang.startsWith('id') && (v.name.toLowerCase().includes('gadis') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))) ||
      voices.find((v) => v.lang.startsWith('id')) ||
      voices.find((v) => v.name.toLowerCase().includes('google') && v.lang.startsWith('id')) ||
      voices.find((v) => v.name.toLowerCase().includes('female'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    getVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      getVoice();
    };
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopNarration() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Sound effects using Web Audio API
let soundCtx: AudioContext | null = null;

function getSoundContext(): AudioContext {
  if (!soundCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    soundCtx = new AudioCtx();
  }
  if (soundCtx.state === 'suspended') {
    soundCtx.resume();
  }
  return soundCtx;
}

export function playBubbleSendSound() {
  try {
    const ctx = getSoundContext();
    const now = ctx.currentTime;

    // Pleasant quick "swoosh-pop" when user sends message
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {
    // Ignore audio context autoplay errors
  }
}

export function playBubbleReceiveSound() {
  try {
    const ctx = getSoundContext();
    const now = ctx.currentTime;

    // Telegram dual notification chime (musical bubble "bloop-ping")
    [
      { freq: 659.25, time: 0, dur: 0.22, vol: 0.18 },
      { freq: 987.77, time: 0.07, dur: 0.32, vol: 0.24 }
    ].forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(vol, now + time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (e) {
    // Ignore audio errors
  }
}

export function playSwooshTransition() {
  try {
    const ctx = getSoundContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  } catch (e) {
    // Ignore audio errors
  }
}

export function playSuccessChime() {
  try {
    const ctx = getSoundContext();
    const now = ctx.currentTime;

    // Harmonious major triad chime (C6, E6, G6)
    [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.45);
    });
  } catch (e) {
    // Ignore audio errors
  }
}

export function playClickBeep() {
  try {
    const ctx = getSoundContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {
    // Ignore audio errors
  }
}
