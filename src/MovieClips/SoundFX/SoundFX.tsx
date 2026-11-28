import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  playSound,
  soundManager,
  SOUND_MANIFEST,
  type SoundItem,
  type SoundId,
  type SoundCategory,
} from '../../Sound';
import { Button as AppleButton } from '../../themes/apple';
import { LightningBolt } from '../LightningBolt';
import type { SoundFXProps } from './types';

/**
 * Procedural retro audio fallback using Web Audio API oscillators.
 * Guarantees audio playback even if asset network requests fail or run offline.
 */
function playSynthesizedFallback(
  id: string,
  ctx: AudioContext,
  registerStopper?: (stop: () => void) => void
) {
  const now = ctx.currentTime;
  const nodesToStop: Array<OscillatorNode | GainNode> = [];

  const cleanup = () => {
    nodesToStop.forEach((node) => {
      try {
        if ('stop' in node) (node as OscillatorNode).stop();
        node.disconnect();
      } catch {}
    });
  };

  registerStopper?.(cleanup);

  if (id.includes('coin')) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    nodesToStop.push(osc, gain);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (id.includes('laser')) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    nodesToStop.push(osc, gain);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } else if (id.includes('explosion')) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    nodesToStop.push(osc, gain);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } else if (id.includes('powerup') || id.includes('win') || id.includes('victory') || id.includes('jingle')) {
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      nodesToStop.push(osc, gain);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.22);
    });
  } else {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    nodesToStop.push(osc, gain);
    osc.type = 'square';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.setValueAtTime(880, now + 0.07);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }
}

const DEFAULT_PLAYLIST: SoundId[] = [
  'pickups/coin-01',
  'combat/laser-01',
  'arcade/kerching-01',
  'pickups/powerup-01',
  'jingles/win',
];

export function SoundFX({
  width = '100%',
  height = '100%',
  className,
  style,
  onBack,
  showBackButton = false,
  children,
}: SoundFXProps) {
  // Navigation tabs: 'explore' | 'playlist'
  const [activeTab, setActiveTab] = useState<'explore' | 'playlist'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSoundId, setActiveSoundId] = useState<SoundId | null>(null);

  // Saved playlist of sound IDs
  const [savedIds, setSavedIds] = useState<SoundId[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mwp_soundfx_playlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_PLAYLIST;
  });

  // Sequential playback state
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(-1);
  const stopSequenceRef = useRef(false);
  const activeSynthStoppers = useRef<Array<() => void>>([]);

  // Sync saved playlist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mwp_soundfx_playlist', JSON.stringify(savedIds));
      } catch {}
    }
  }, [savedIds]);

  // Ensure audio engine is unmuted on mount, and kill all sounds on unmount / exit
  useEffect(() => {
    soundManager.setMuted(false);
    return () => {
      stopSequenceRef.current = true;
      soundManager.stopAll();
      activeSynthStoppers.current.forEach((stop) => {
        try {
          stop();
        } catch {}
      });
      activeSynthStoppers.current = [];
    };
  }, []);

  // Filter sounds from the manifest (guaranteed unique by id)
  const filteredSounds = useMemo(() => {
    const list = SOUND_MANIFEST.sounds;
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  // Map of saved items
  const savedSounds = useMemo(() => {
    const map = new Map<SoundId, SoundItem>();
    SOUND_MANIFEST.sounds.forEach((s) => map.set(s.id, s));
    return savedIds
      .map((id) => map.get(id))
      .filter((s): s is SoundItem => Boolean(s));
  }, [savedIds]);

  // Single sound playback
  const handlePlaySound = useCallback(async (soundId: SoundId) => {
    setActiveSoundId(soundId);

    soundManager.setMuted(false);
    const ctx = soundManager.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }

    try {
      const instance = await playSound(soundId, {
        volume: 0.85,
        onEnded: () => {
          setActiveSoundId((prev) => (prev === soundId ? null : prev));
        },
      });

      if (!instance && ctx) {
        playSynthesizedFallback(soundId, ctx, (stop) => activeSynthStoppers.current.push(stop));
        setTimeout(() => {
          setActiveSoundId((prev) => (prev === soundId ? null : prev));
        }, 320);
      }
    } catch {
      if (ctx) {
        playSynthesizedFallback(soundId, ctx, (stop) => activeSynthStoppers.current.push(stop));
      }
      setTimeout(() => {
        setActiveSoundId((prev) => (prev === soundId ? null : prev));
      }, 320);
    }
  }, []);

  // Toggle sound in saved list
  const toggleSaveSound = useCallback((soundId: SoundId) => {
    setSavedIds((prev) => {
      if (prev.includes(soundId)) {
        return prev.filter((id) => id !== soundId);
      }
      return [...prev, soundId];
    });
  }, []);

  // Sequential playback runner
  const handleToggleSequence = useCallback(async () => {
    if (isPlayingSequence) {
      stopSequenceRef.current = true;
      setIsPlayingSequence(false);
      setSequenceIndex(-1);
      setActiveSoundId(null);
      return;
    }

    if (savedIds.length === 0) return;

    setIsPlayingSequence(true);
    stopSequenceRef.current = false;

    soundManager.setMuted(false);
    const ctx = soundManager.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }

    for (let i = 0; i < savedIds.length; i++) {
      if (stopSequenceRef.current) break;

      setSequenceIndex(i);
      const id = savedIds[i];
      setActiveSoundId(id);

      await new Promise<void>((resolve) => {
        let settled = false;
        const done = () => {
          if (!settled) {
            settled = true;
            resolve();
          }
        };

        playSound(id, {
          volume: 0.85,
          onEnded: done,
        })
          .then((instance) => {
            if (!instance && ctx) {
              playSynthesizedFallback(id, ctx, (stop) => activeSynthStoppers.current.push(stop));
              setTimeout(done, 320);
            }
          })
          .catch(() => {
            if (ctx) playSynthesizedFallback(id, ctx, (stop) => activeSynthStoppers.current.push(stop));
            setTimeout(done, 320);
          });

        // Safety cap so sequence never stalls
        setTimeout(done, 2500);
      });

      if (stopSequenceRef.current) break;

      // Clean Apple audio pacing between samples
      await new Promise((r) => setTimeout(r, 140));
    }

    setIsPlayingSequence(false);
    setSequenceIndex(-1);
    setActiveSoundId(null);
  }, [isPlayingSequence, savedIds]);

  return (
    <div
      className={`flash-sound-fx ${className ?? ''}`.trim()}
      role="region"
      aria-label="Sound FX Studio"
      style={{
        width,
        height,
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 20px',
        paddingTop: '96px', // Clear breathing space under Modern Flash button
        paddingBottom: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        userSelect: 'none',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        color: '#FFFFFF',
        ...style,
      }}
    >
      {/* Container Frame with Apple Frosted Glass Surface */}
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(28, 28, 30, 0.72)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Apple Segmented View Switcher & Action Header */}
        <header
          style={{
            padding: '16px 18px 12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Segmented Control Capsule */}
          <div
            role="tablist"
            style={{
              display: 'inline-flex',
              padding: '3px',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'explore'}
              onClick={() => setActiveTab('explore')}
              style={{
                border: 'none',
                background: activeTab === 'explore' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'explore' ? '#000000' : '#8E8E93',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                padding: '6px 14px',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              Library ({SOUND_MANIFEST.totalSounds})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'playlist'}
              onClick={() => setActiveTab('playlist')}
              style={{
                border: 'none',
                background: activeTab === 'playlist' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'playlist' ? '#000000' : '#8E8E93',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                padding: '6px 14px',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>Sequence</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: activeTab === 'playlist' ? '#000000' : 'rgba(255, 255, 255, 0.16)',
                  color: activeTab === 'playlist' ? '#FFFFFF' : '#8E8E93',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}
              >
                {savedIds.length}
              </span>
            </button>
          </div>

          {/* Sequential Playback Trigger */}
          <button
            type="button"
            onClick={handleToggleSequence}
            disabled={savedIds.length === 0}
            style={{
              border: 'none',
              backgroundColor: isPlayingSequence ? '#FF453A' : '#FCFF20',
              color: '#000000',
              fontSize: '13px',
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: '9999px',
              cursor: savedIds.length === 0 ? 'not-allowed' : 'pointer',
              opacity: savedIds.length === 0 ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: isPlayingSequence
                ? '0 0 14px rgba(255, 69, 58, 0.45)'
                : '0 2px 10px rgba(252, 255, 32, 0.35)',
              transition: 'all 0.18s ease',
            }}
          >
            <span>{isPlayingSequence ? '■ Stop' : '▶ Play Sequence'}</span>
          </button>
        </header>

        {/* Explore Mode Controls */}
        {activeTab === 'explore' && (
          <div
            style={{
              padding: '12px 18px 10px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Apple Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.28)',
                borderRadius: '12px',
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontSize: '14px', color: '#8E8E93', lineHeight: 1 }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: '#FFFFFF',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Horizontal Scrollable Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingBottom: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                style={{
                  whiteSpace: 'nowrap',
                  border: 'none',
                  backgroundColor: selectedCategory === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.08)',
                  color: selectedCategory === 'all' ? '#000000' : '#8E8E93',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.14s ease',
                }}
              >
                All
              </button>
              {SOUND_MANIFEST.categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      whiteSpace: 'nowrap',
                      border: 'none',
                      backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#000000' : '#8E8E93',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      transition: 'all 0.14s ease',
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Sound Item List Area (Zero Page Scrolling) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            scrollbarWidth: 'none',
          }}
        >
          {activeTab === 'explore' ? (
            filteredSounds.length > 0 ? (
              filteredSounds.map((item) => {
                const isPlaying = activeSoundId === item.id;
                const isSaved = savedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      backgroundColor: isPlaying
                        ? 'rgba(252, 255, 32, 0.12)'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isPlaying
                        ? '1px solid rgba(252, 255, 32, 0.45)'
                        : '1px solid rgba(255, 255, 255, 0.06)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Play trigger & Title */}
                    <button
                      type="button"
                      onClick={() => handlePlaySound(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'transparent',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        flex: 1,
                        textAlign: 'left',
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isPlaying ? '#FCFF20' : 'rgba(255, 255, 255, 0.12)',
                          color: isPlaying ? '#000000' : '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isPlaying ? '■' : '▶'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em' }}>
                          {item.name}
                        </span>
                        <div style={{ display: 'flex', gap: 6, fontSize: '11px', color: '#8E8E93' }}>
                          <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
                          <span>•</span>
                          <span>{item.durationSeconds}s</span>
                        </div>
                      </div>
                    </button>

                    {/* Quick Add/Remove Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => toggleSaveSound(item.id)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: isSaved ? '#FCFF20' : 'rgba(255, 255, 255, 0.08)',
                        color: isSaved ? '#000000' : '#8E8E93',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSaved ? '✓' : '+'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '48px 20px',
                  textAlign: 'center',
                  color: '#8E8E93',
                  fontSize: '14px',
                }}
              >
                No sound effects found.
              </div>
            )
          ) : savedSounds.length > 0 ? (
            savedSounds.map((item, idx) => {
              const isPlayingThis = isPlayingSequence
                ? sequenceIndex === idx
                : activeSoundId === item.id;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    backgroundColor: isPlayingThis
                      ? 'rgba(252, 255, 32, 0.14)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: isPlayingThis
                      ? '1px solid #FCFF20'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: isPlayingThis ? '0 0 16px rgba(252, 255, 32, 0.3)' : 'none',
                    transform: isPlayingThis ? 'scale(1.01)' : 'scale(1)',
                    transition: 'all 0.16s ease',
                  }}
                >
                  {/* Item index & sound trigger */}
                  <button
                    type="button"
                    onClick={() => handlePlaySound(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      flex: 1,
                      textAlign: 'left',
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isPlayingThis ? '#FCFF20' : 'rgba(255, 255, 255, 0.12)',
                        color: isPlayingThis ? '#000000' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isPlayingThis ? '▶' : `${idx + 1}`}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</span>
                      <span style={{ fontSize: '11px', color: '#8E8E93' }}>
                        {item.category} • {item.durationSeconds}s
                      </span>
                    </div>
                  </button>

                  {/* Remove action */}
                  <button
                    type="button"
                    onClick={() => toggleSaveSound(item.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#8E8E93',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                color: '#8E8E93',
                fontSize: '14px',
              }}
            >
              Empty sequence. Tap + in Library to add sounds.
            </div>
          )}
        </div>
      </div>

      {/* Optional Standalone Back Button */}
      {showBackButton && onBack && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <AppleButton
            size="md"
            label="Modern Flash"
            leadingIcon={
              <LightningBolt
                width="16px"
                height="28px"
                fillColor="#000000"
                frontColor="#FFFFFF"
                backColor="#111827"
                strokeColor="#000000"
              />
            }
            onClick={() => {
              stopSequenceRef.current = true;
              soundManager.stopAll();
              activeSynthStoppers.current.forEach((stop) => {
                try {
                  stop();
                } catch {}
              });
              activeSynthStoppers.current = [];
              onBack();
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}

export default SoundFX;
