import { useState, useMemo } from 'react';
import {
  playSound,
  useSound,
  type SoundId,
  type SoundCategory,
  type SoundItem,
} from '../../src/Sound';

interface SoundboardPageProps {
  onNavigate?: (path: string) => void;
}

export function SoundboardPage({ onNavigate }: SoundboardPageProps) {
  const { isMuted, toggleMuted, masterVolume, setMasterVolume, manifest } = useSound();
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSoundId, setActiveSoundId] = useState<SoundId | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSounds = useMemo(() => {
    return manifest.sounds.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesId = item.id.toLowerCase().includes(q);
      const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesName || matchesId || matchesTags;
    });
  }, [manifest.sounds, selectedCategory, searchQuery]);

  const handlePlay = async (sound: SoundItem) => {
    setActiveSoundId(sound.id);
    await playSound(sound.id, {
      onEnded: () => {
        setActiveSoundId((prev) => (prev === sound.id ? null : prev));
      },
    });
  };

  const handleCopyCode = (id: SoundId) => {
    const code = `playSound('${id}');`;
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 20px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          marginBottom: 28,
          borderBottom: '1px solid #1e293b',
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/');
                else window.location.pathname = '/';
              }}
              style={{
                background: '#0f172a',
                color: '#94a3b8',
                border: '1px solid #334155',
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              ← Back to Home
            </button>
            <div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#38bdf8',
                  margin: 0,
                }}
              >
                Soundboard & Audio Asset Explorer
              </h1>
              <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: 13 }}>
                Curated retro sound library, single-format AAC architecture (.m4a), and Web Audio API engine
              </p>
            </div>
          </div>

          {/* Navigation & Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/examples');
                else window.location.pathname = '/examples';
              }}
              style={{
                background: '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0px 0px #2A2A2A',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Open Studio Prompter →
            </button>
            <span
              style={{
                fontSize: 12,
                background: '#1e293b',
                padding: '6px 10px',
                borderRadius: 4,
                color: '#10b981',
                fontWeight: 600,
              }}
            >
              {manifest.totalSounds} SOUNDS ({manifest.totalSizeFormatted})
            </span>
          </div>
        </div>

        {/* Global Audio Control Toolbar */}
        <div
          style={{
            marginTop: 20,
            background: '#0d1527',
            border: '1px solid #1e293b',
            borderRadius: 8,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={toggleMuted}
              style={{
                background: isMuted ? '#ef4444' : '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '2px 2px 0px 0px #2A2A2A',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {isMuted ? '🔇 Audio Muted' : '🔊 Audio Active'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                style={{ cursor: 'pointer', width: 90 }}
              />
              <span style={{ fontSize: 12, color: '#f8fafc', width: 34 }}>
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Telemetry pill */}
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
            <span>Format: <strong>.m4a (AAC)</strong></span>
            <span>Zero redundant formats</span>
            <span>Web Audio API dynamic compressor</span>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Search box */}
          <input
            type="text"
            placeholder="Search sounds by name, tag, or identifier (e.g. 'click', 'laser', 'coin', 'ready')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#0d1527',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 14,
              color: '#ffffff',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                background: selectedCategory === 'all' ? '#15868F' : '#0d1527',
                color: selectedCategory === 'all' ? '#ffffff' : '#94a3b8',
                border: selectedCategory === 'all' ? '2px solid #2A2A2A' : '1px solid #1e293b',
                boxShadow: selectedCategory === 'all' ? '2px 2px 0px 0px #2A2A2A' : 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All Sounds ({manifest.totalSounds})
            </button>

            {manifest.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: selectedCategory === cat.id ? '#15868F' : '#0d1527',
                  color: selectedCategory === cat.id ? '#ffffff' : '#94a3b8',
                  border: selectedCategory === cat.id ? '2px solid #2A2A2A' : '1px solid #1e293b',
                  boxShadow: selectedCategory === cat.id ? '2px 2px 0px 0px #2A2A2A' : 'none',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{cat.name}</span>
                <span
                  style={{
                    fontSize: 10,
                    opacity: 0.8,
                    background: 'rgba(0,0,0,0.25)',
                    padding: '2px 5px',
                    borderRadius: 3,
                  }}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sound Cards Grid */}
      <section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filteredSounds.map((sound) => {
            const isPlaying = activeSoundId === sound.id;
            return (
              <div
                key={sound.id}
                style={{
                  background: '#0d1527',
                  border: isPlaying ? '2px solid #38bdf8' : '1px solid #1e293b',
                  boxShadow: isPlaying ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                  borderRadius: 8,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.12)',
                        padding: '2px 6px',
                        borderRadius: 3,
                      }}
                    >
                      {sound.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      {sound.sizeFormatted}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#f8fafc',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {sound.name}
                  </h3>

                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'monospace',
                      color: '#94a3b8',
                      marginBottom: 8,
                    }}
                  >
                    {sound.id}
                  </div>

                  {/* Metadata Specs */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      fontSize: 11,
                      color: '#64748b',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>⏱ {sound.durationSeconds}s</span>
                    <span>•</span>
                    <span>{sound.sampleRate} Hz</span>
                    <span>•</span>
                    <span>{sound.channels === 1 ? 'Mono' : 'Stereo'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => handlePlay(sound)}
                    style={{
                      flex: 1,
                      background: isPlaying ? '#38bdf8' : '#15868F',
                      color: isPlaying ? '#070b14' : '#ffffff',
                      border: '2px solid #2A2A2A',
                      boxShadow: '2px 2px 0px 0px #2A2A2A',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      minHeight: 40,
                    }}
                  >
                    {isPlaying ? '■ Playing...' : '▶ Play Sound'}
                  </button>

                  <button
                    onClick={() => handleCopyCode(sound.id)}
                    title="Copy ActionScript / TS usage code"
                    style={{
                      background: copiedId === sound.id ? '#10b981' : '#1e293b',
                      color: copiedId === sound.id ? '#ffffff' : '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      minHeight: 40,
                    }}
                  >
                    {copiedId === sound.id ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSounds.length === 0 && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: 15,
            }}
          >
            No sound effects match query "{searchQuery}" in category "{selectedCategory}".
          </div>
        )}
      </section>
    </div>
  );
}

export default SoundboardPage;
