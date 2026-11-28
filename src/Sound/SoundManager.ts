/**
 * Modern Flash Sound Manager & Web Audio API Engine
 * Provides sample playback with caching, volume envelopes, stereo panning,
 * procedural Star Wars fighter audio integration, and Macromedia Flash ActionScript
 * Sound class compatibility.
 */

import { SOUND_CATALOG, type SoundId, type SoundCategory, type SoundItem, SOUND_MANIFEST } from './soundCatalog';
import {
  setFighterAudioMuted,
  isFighterAudioMuted,
  toggleFighterAudio,
  playFighterZoomSound,
  playLaserShootSound,
  playTargetingLockBeep,
  startCockpitAmbient,
  stopCockpitAmbient,
  unlockAudioContext as unlockFighterAudioContext,
} from './fighterAudio';

export interface PlaySoundOptions {
  offset?: number;       // starting offset in seconds (default: 0)
  volume?: number;       // 0.0 to 1.0 (default: 1.0)
  loop?: boolean;         // default: false
  pan?: number;          // -1.0 (left) to 1.0 (right) (default: 0)
  playbackRate?: number; // 0.25 to 4.0 (default: 1.0)
  onEnded?: () => void;
}

export interface ActiveSoundInstance {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  pannerNode?: StereoPannerNode;
  stop: () => void;
}

class ModernSoundManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private bufferCache = new Map<string, AudioBuffer>();
  private pendingFetches = new Map<string, Promise<AudioBuffer | null>>();
  private activeInstances = new Set<ActiveSoundInstance>();
  private categoryGains = new Map<SoundCategory, GainNode>();
  private masterVolume = 0.8;
  private basePath = '';
  private muted = false;

  constructor() {
    // Initialise audio on first user gesture if in browser
    if (typeof window !== 'undefined') {
      const handleFirstInteraction = () => {
        this.getAudioContext();
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
      window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });
    }
  }

  /**
   * Configure base URL prefix for sound assets (e.g. for subpath deployments).
   */
  public setBasePath(path: string): void {
    this.basePath = path.endsWith('/') ? path.slice(0, -1) : path;
  }

  /**
   * Lazily initializes and returns the Web Audio API context.
   */
  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();

        // Dynamics compressor to ensure clear transients with zero digital clipping
        this.compressor = this.audioCtx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-8, this.audioCtx.currentTime);
        this.compressor.knee.setValueAtTime(6, this.audioCtx.currentTime);
        this.compressor.ratio.setValueAtTime(3.5, this.audioCtx.currentTime);
        this.compressor.attack.setValueAtTime(0.002, this.audioCtx.currentTime);
        this.compressor.release.setValueAtTime(0.15, this.audioCtx.currentTime);
        this.compressor.connect(this.audioCtx.destination);

        this.masterGain = this.audioCtx.createGain();
        const initialGain = this.isMuted() ? 0 : this.masterVolume;
        this.masterGain.gain.setValueAtTime(initialGain, this.audioCtx.currentTime);
        this.masterGain.connect(this.compressor);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Retrieves or creates a category gain node for sub-mix control.
   */
  private getCategoryGain(category: SoundCategory): GainNode | null {
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return null;

    if (!this.categoryGains.has(category)) {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.0, ctx.currentTime);
      gain.connect(this.masterGain);
      this.categoryGains.set(category, gain);
    }

    return this.categoryGains.get(category) ?? null;
  }

  /**
   * Preload an individual audio buffer into memory.
   */
  public async loadSound(id: SoundId): Promise<AudioBuffer | null> {
    const item = SOUND_CATALOG[id];
    if (!item) {
      console.warn(`[Modern Flash Sound] Sound id "${id}" not found in catalog.`);
      return null;
    }

    if (this.bufferCache.has(item.path)) {
      return this.bufferCache.get(item.path)!;
    }

    if (this.pendingFetches.has(item.path)) {
      return this.pendingFetches.get(item.path)!;
    }

    const fetchPromise = (async () => {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return null;

        const resolvedUrl = this.basePath ? `${this.basePath}${item.path}` : item.path;
        const response = await fetch(resolvedUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} loading ${resolvedUrl}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        this.bufferCache.set(item.path, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`[Modern Flash Sound] Failed to load "${item.path}":`, err);
        return null;
      } finally {
        this.pendingFetches.delete(item.path);
      }
    })();

    this.pendingFetches.set(item.path, fetchPromise);
    return fetchPromise;
  }

  /**
   * Preload an entire category of sounds (e.g. 'ui' or 'combat').
   */
  public async preloadCategory(category: SoundCategory): Promise<void> {
    const ids = Object.keys(SOUND_CATALOG).filter(
      (id) => SOUND_CATALOG[id as SoundId].category === category
    ) as SoundId[];

    await Promise.all(ids.map((id) => this.loadSound(id)));
  }

  /**
   * Play a curated sound effect by catalog ID.
   */
  public async play(
    id: SoundId,
    options: PlaySoundOptions = {}
  ): Promise<ActiveSoundInstance | null> {
    const ctx = this.getAudioContext();
    if (!ctx || this.isMuted()) return null;

    const buffer = await this.loadSound(id);
    if (!buffer) return null;

    const item = SOUND_CATALOG[id];
    const categoryGain = this.getCategoryGain(item.category);
    if (!categoryGain) return null;

    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop ?? false;
    if (options.playbackRate !== undefined) {
      source.playbackRate.setValueAtTime(options.playbackRate, now);
    }

    const gainNode = ctx.createGain();
    const volume = Math.max(0, Math.min(1, options.volume ?? 1));
    gainNode.gain.setValueAtTime(volume, now);

    let pannerNode: StereoPannerNode | undefined;
    if (options.pan !== undefined && typeof ctx.createStereoPanner === 'function') {
      pannerNode = ctx.createStereoPanner();
      pannerNode.pan.setValueAtTime(Math.max(-1, Math.min(1, options.pan)), now);
      source.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(categoryGain);
    } else {
      source.connect(gainNode);
      gainNode.connect(categoryGain);
    }

    const instance: ActiveSoundInstance = {
      source,
      gainNode,
      pannerNode,
      stop: () => {
        try {
          source.stop();
          source.disconnect();
        } catch {}
        this.activeInstances.delete(instance);
      },
    };

    source.onended = () => {
      this.activeInstances.delete(instance);
      options.onEnded?.();
    };

    this.activeInstances.add(instance);
    source.start(now, Math.max(0, options.offset ?? 0));
    return instance;
  }

  /**
   * Stop all currently playing audio instances.
   */
  public stopAll(): void {
    for (const inst of Array.from(this.activeInstances)) {
      inst.stop();
    }
    this.activeInstances.clear();
  }

  /**
   * Set master volume (0.0 to 1.0).
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.audioCtx && !this.isMuted()) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioCtx.currentTime);
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Mute / Unmute all sound output across both procedural and sample engines.
   */
  public setMuted(muted: boolean): boolean {
    this.muted = muted;
    setFighterAudioMuted(muted);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.masterVolume, this.audioCtx.currentTime);
    }
    if (!muted) {
      this.getAudioContext();
    }
    return muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMuted(): boolean {
    const nextState = !this.isMuted();
    return this.setMuted(nextState);
  }

  /**
   * Set category-specific volume.
   */
  public setCategoryVolume(category: SoundCategory, volume: number): void {
    const gain = this.getCategoryGain(category);
    if (gain && this.audioCtx) {
      gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioCtx.currentTime);
    }
  }

  /**
   * Access the full sound manifest metadata.
   */
  public getManifest() {
    return SOUND_MANIFEST;
  }

  public getCatalog(): Record<SoundId, SoundItem> {
    return SOUND_CATALOG;
  }
}

export const soundManager = new ModernSoundManager();

/**
 * Macromedia Flash ActionScript Sound Class Compatibility
 * Recreates the classic ActionScript `new Sound()` OOP interface
 * powered by the Modern Flash Web Audio API engine.
 *
 * Example:
 * ```ts
 * const click = new FlashSound();
 * click.attachSound('ui/click-01');
 * click.start(0, 1);
 * click.setVolume(85);
 * ```
 */
export class FlashSound {
  private attachedId: SoundId | null = null;
  private currentInstance: ActiveSoundInstance | null = null;
  private volumePercent = 100;
  private panValue = 0; // -100 to 100

  constructor(targetSoundId?: SoundId) {
    if (targetSoundId) {
      this.attachSound(targetSoundId);
    }
  }

  public attachSound(id: SoundId): void {
    this.attachedId = id;
    soundManager.loadSound(id).catch(() => {});
  }

  public start(secondOffset: number = 0, loops: number = 1): void {
    if (!this.attachedId) return;

    soundManager.play(this.attachedId, {
      offset: secondOffset,
      volume: this.volumePercent / 100,
      loop: loops > 1,
      pan: this.panValue / 100,
    }).then((inst) => {
      this.currentInstance = inst;
    });
  }

  public stop(): void {
    if (this.currentInstance) {
      this.currentInstance.stop();
      this.currentInstance = null;
    }
  }

  public setVolume(volume: number): void {
    this.volumePercent = Math.max(0, Math.min(100, volume));
    if (this.currentInstance && soundManager.getAudioContext()) {
      this.currentInstance.gainNode.gain.setValueAtTime(
        this.volumePercent / 100,
        soundManager.getAudioContext()!.currentTime
      );
    }
  }

  public getVolume(): number {
    return this.volumePercent;
  }

  public setPan(pan: number): void {
    this.panValue = Math.max(-100, Math.min(100, pan));
    if (this.currentInstance?.pannerNode && soundManager.getAudioContext()) {
      this.currentInstance.pannerNode.pan.setValueAtTime(
        this.panValue / 100,
        soundManager.getAudioContext()!.currentTime
      );
    }
  }

  public getPan(): number {
    return this.panValue;
  }
}

// Re-export procedural audio functions for 100% backward compatibility
export {
  playFighterZoomSound,
  playLaserShootSound,
  playTargetingLockBeep,
  startCockpitAmbient,
  stopCockpitAmbient,
  setFighterAudioMuted,
  isFighterAudioMuted,
  toggleFighterAudio,
  unlockFighterAudioContext,
};

/**
 * Convenient standalone global helper functions
 */
export function playSound(id: SoundId, options?: PlaySoundOptions) {
  return soundManager.play(id, options);
}

export function preloadSound(id: SoundId) {
  return soundManager.loadSound(id);
}

export function toggleAudio() {
  return soundManager.toggleMuted();
}

export function isAudioMuted() {
  return soundManager.isMuted();
}

export function stopAllSounds(): void {
  soundManager.stopAll();
}
