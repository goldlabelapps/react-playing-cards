'use client';

import { useState, useRef, useEffect } from 'react';
import { Flash } from 'modern-flash';
import type { FlashHandle } from 'modern-flash';

export function InteractiveStage() {
  const [mounted, setMounted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoMount, setAutoMount] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const flashRef = useRef<FlashHandle>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      flashRef.current?.pause();
      setIsPlaying(false);
    } else {
      flashRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    flashRef.current?.restart();
    setIsPlaying(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div>
      {/* Live Vector Stage Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 420,
          background: 'radial-gradient(ellipse at center, #0f1c3f 0%, #070b14 75%)',
          borderRadius: 8,
          border: '2px solid #2A2A2A',
          boxShadow: '3px 3px 0 0 #2A2A2A',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {mounted ? (
          <Flash
            ref={flashRef}
            movie="FlashStory"
            speed={speed}
            loop={true}
            autoPlay={isPlaying}
            width="100%"
            height="100%"
            color="transparent"
          />
        ) : (
          <div style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>
            Initialising Vector Stage Surface...
          </div>
        )}
      </div>

      {/* Stage Playback Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '10px 14px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handlePlayToggle}
            style={{
              background: '#15868F',
              color: '#ffffff',
              border: '2px solid #2A2A2A',
              boxShadow: '2px 2px 0 0 #2A2A2A',
              borderRadius: 4,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 36,
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            style={{
              background: '#ffffff',
              color: '#1e293b',
              border: '2px solid #2A2A2A',
              boxShadow: '2px 2px 0 0 #2A2A2A',
              borderRadius: 4,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 36,
            }}
          >
            Restart
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Playback: {speed}x</span>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            style={{ width: 100, accentColor: '#15868F' }}
            aria-label="Playback speed slider"
          />
        </div>
      </div>

      {/* Runtime Engine Configuration Form matching SettingsController */}
      <form onSubmit={handleSave}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>
          Runtime Engine Configuration
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
          Configure defaults for vector stage embedding and ActionScript execution.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#1e293b' }}>
            Default Playback Speed
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="5.0"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value) || 1)}
            style={{
              padding: '6px 10px',
              border: '1px solid #8c8f94',
              borderRadius: 4,
              fontSize: 14,
              width: 120,
            }}
          />
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Playback multiplier for ActionScript choreographies (e.g. 1.0 = normal, 1.5 = faster).
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1e293b', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoMount}
              onChange={(e) => setAutoMount(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#15868F' }}
            />
            Automatically scan DOM for .mwp-flash-stage elements on DOMContentLoaded
          </label>
        </div>

        <button
          type="submit"
          style={{
            background: '#15868F',
            color: '#ffffff',
            border: '2px solid #2A2A2A',
            boxShadow: '2px 2px 0 0 #2A2A2A',
            padding: '8px 18px',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Save Configuration
        </button>

        {savedNotice && (
          <span style={{ marginLeft: 12, fontSize: 13, color: '#059669', fontWeight: 600 }}>
            ✓ Configuration saved
          </span>
        )}
      </form>
    </div>
  );
}

export default InteractiveStage;
