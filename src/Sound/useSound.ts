import { useState, useEffect, useCallback } from 'react';
import {
  soundManager,
  playSound,
  preloadSound,
  toggleAudio,
  isAudioMuted,
  type PlaySoundOptions,
} from './SoundManager';
import {
  SOUND_MANIFEST,
  SOUND_CATALOG,
  type SoundId,
  type SoundCategory,
  type SoundItem,
} from './soundCatalog';

export interface UseSoundReturn {
  play: (id: SoundId, options?: PlaySoundOptions) => Promise<unknown>;
  preload: (id: SoundId) => Promise<AudioBuffer | null>;
  isMuted: boolean;
  toggleMuted: () => boolean;
  setMuted: (muted: boolean) => boolean;
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  manifest: typeof SOUND_MANIFEST;
  catalog: Record<SoundId, SoundItem>;
}

export function useSound(): UseSoundReturn {
  const [muted, setMutedState] = useState<boolean>(() => isAudioMuted());
  const [masterVolume, setMasterVolumeState] = useState<number>(() => soundManager.getMasterVolume());

  // Listen to audio context unlock or state change if needed
  useEffect(() => {
    setMutedState(isAudioMuted());
  }, []);

  const handleToggleMuted = useCallback(() => {
    const next = toggleAudio();
    setMutedState(next);
    return next;
  }, []);

  const handleSetMuted = useCallback((val: boolean) => {
    const next = soundManager.setMuted(val);
    setMutedState(next);
    return next;
  }, []);

  const handleSetMasterVolume = useCallback((val: number) => {
    soundManager.setMasterVolume(val);
    setMasterVolumeState(val);
  }, []);

  return {
    play: playSound,
    preload: preloadSound,
    isMuted: muted,
    toggleMuted: handleToggleMuted,
    setMuted: handleSetMuted,
    masterVolume,
    setMasterVolume: handleSetMasterVolume,
    manifest: SOUND_MANIFEST,
    catalog: SOUND_CATALOG,
  };
}

export interface UseSoundCatalogFilterOptions {
  category?: SoundCategory | 'all';
  searchQuery?: string;
}

export function useSoundCatalog(options: UseSoundCatalogFilterOptions = {}) {
  const { category = 'all', searchQuery = '' } = options;

  const filteredSounds = SOUND_MANIFEST.sounds.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(q);
    const matchesId = item.id.toLowerCase().includes(q);
    const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));

    return matchesName || matchesId || matchesTags;
  });

  return {
    sounds: filteredSounds,
    categories: SOUND_MANIFEST.categories,
    totalCount: SOUND_MANIFEST.totalSounds,
    totalSize: SOUND_MANIFEST.totalSizeFormatted,
  };
}
