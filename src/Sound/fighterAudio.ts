/**
 * Star Wars Fighter Cockpit Sound Synthesizer
 * Built using the Web Audio API for zero-dependency, authentic procedural audio.
 * Synthesizes:
 * 1. Twin-Ion / Sublight fighter zoom flyby (resonant bandpass noise + doppler frequency sweep + stereo pan)
 * 2. Targeting computer HUD lock-on chirps (frequency-modulated dual-tone bleeps)
 * 3. Cockpit sub-light engine ambient rumble (low-frequency filtered hum)
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;
let ambientEngineNodes: {
  osc: OscillatorNode;
  gain: GainNode;
  filter: BiquadFilterNode;
} | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.35, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Creates a white/pink noise buffer for jet/engine turbulence.
 */
function createNoiseBuffer(ctx: AudioContext, duration: number = 3): AudioBuffer {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Simple 1-pole filter to give pinkish noise character
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  return buffer;
}

/**
 * Plays the iconic fighter zoom/whoosh flyby sound.
 * Features resonant frequency swooping, engine roar, and directional panning.
 */
export function playFighterZoomSound(panDirection: number = 0.4): void {
  const ctx = getAudioContext();
  if (!ctx || !masterGain || isMuted) return;

  const now = ctx.currentTime;
  const duration = 2.4;

  // 1. Noise Source (engine jet exhaust roar)
  const noiseBuffer = createNoiseBuffer(ctx, duration);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  // 2. Resonant Bandpass Filter (creates the characteristic howling jet/ion sound)
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(4.5, now);
  // Frequency sweep: starts mid, roars high during pan, decays to low rumble
  filter.frequency.setValueAtTime(280, now);
  filter.frequency.exponentialRampToValueAtTime(1450, now + 0.7);
  filter.frequency.exponentialRampToValueAtTime(820, now + 1.4);
  filter.frequency.exponentialRampToValueAtTime(220, now + duration);

  // 3. Dual Carrier Oscillators for sublight engine whine
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(110, now);
  osc1.frequency.exponentialRampToValueAtTime(240, now + 0.65);
  osc1.frequency.exponentialRampToValueAtTime(95, now + duration);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // 4. Stereo Panner (pans along with the camera / starfield pan)
  let panner: StereoPannerNode | null = null;
  if (typeof ctx.createStereoPanner === 'function') {
    panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(-0.3, now);
    panner.pan.linearRampToValueAtTime(panDirection, now + 1.2);
  }

  // 5. Volume Envelope
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.42, now + 0.45);
  noiseGain.gain.exponentialRampToValueAtTime(0.002, now + duration);

  // Connect graph
  noiseSource.connect(filter);
  filter.connect(noiseGain);
  osc1.connect(oscGain);

  const mixer = ctx.createGain();
  noiseGain.connect(mixer);
  oscGain.connect(mixer);

  if (panner) {
    mixer.connect(panner);
    panner.connect(masterGain);
  } else {
    mixer.connect(masterGain);
  }

  noiseSource.start(now);
  osc1.start(now);
  noiseSource.stop(now + duration);
  osc1.stop(now + duration);
}

/**
 * Plays the targeting computer acquisition/lock chirp.
 */
export function playTargetingLockBeep(freq: number = 1320): void {
  const ctx = getAudioContext();
  if (!ctx || !masterGain || isMuted) return;

  const now = ctx.currentTime;
  const duration = 0.085;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Starts continuous low cockpit ambient rumble.
 */
export function startCockpitAmbient(): void {
  const ctx = getAudioContext();
  if (!ctx || !masterGain || ambientEngineNodes) return;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(55, ctx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(140, ctx.currentTime);

  gain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start();
  ambientEngineNodes = { osc, gain, filter };
}

/**
 * Stops cockpit ambient rumble.
 */
export function stopCockpitAmbient(): void {
  if (ambientEngineNodes) {
    try {
      ambientEngineNodes.osc.stop();
      ambientEngineNodes.osc.disconnect();
    } catch {}
    ambientEngineNodes = null;
  }
}

/**
 * Mute / Unmute audio controls.
 */
export function setFighterAudioMuted(muted: boolean): boolean {
  isMuted = muted;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.35, audioCtx.currentTime);
  }
  if (!isMuted) {
    getAudioContext();
  }
  return isMuted;
}

export function toggleFighterAudio(): boolean {
  return setFighterAudioMuted(!isMuted);
}

export function isFighterAudioMuted(): boolean {
  return isMuted;
}

export function unlockAudioContext(): void {
  getAudioContext();
}
