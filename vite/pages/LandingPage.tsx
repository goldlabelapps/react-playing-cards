import { useState, useRef, useEffect } from 'react';
import { Flash } from '../../src/Flash';
import type { FlashHandle } from '../../src/types';

interface LandingPageProps {
  onNavigate?: (path: string) => void;
  showFab?: boolean;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const flashRef = useRef<FlashHandle>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close dialog on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDialogOpen) {
        setIsDialogOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDialogOpen]);

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

  const handleOpenExamples = () => {
    setIsDialogOpen(false);
    if (onNavigate) {
      onNavigate('/examples');
    } else {
      window.location.pathname = '/examples';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#070b14',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(76, 151, 156, 0.18), transparent 70%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        color: '#f8fafc',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Front & Center: Full-Bleed Flash Animation Stage */}
      <main
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flash
            ref={flashRef}
            movie="FlashStory"
            loop={true}
            autoPlay={true}
            width="100%"
            height="100%"
            color="transparent"
          />
        </div>
      </main>

      {/* Horizontally Centred Floating Action Button (FAB) Toggle hidden for cinematic cut screen */}

      {/* Popover Dialog Backdrop */}
      {isDialogOpen && (
        <div
          onClick={() => setIsDialogOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 11, 20, 0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 80,
          }}
        />
      )}

      {/* Popover Dialog Clip containing all project information */}
      {isDialogOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          style={{
            position: 'fixed',
            bottom: 92,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(480px, calc(100vw - 32px))',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            background: '#0d1527',
            border: '2px solid #2A2A2A',
            boxShadow: '5px 5px 0px 0px #2A2A2A',
            borderRadius: 12,
            padding: '24px',
            color: '#f8fafc',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            boxSizing: 'border-box',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1e293b',
              paddingBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src="/favicon.svg"
                alt="Modern Flash logo"
                style={{ width: 22, height: 22, borderRadius: 5 }}
              />
              <div>
                <h2
                  id="dialog-title"
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  Modern Flash
                </h2>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      background: 'rgba(76, 151, 156, 0.15)',
                      border: '1px solid rgba(76, 151, 156, 0.4)',
                      padding: '2px 6px',
                      borderRadius: 3,
                      color: '#4C979C',
                    }}
                  >
                    ZERO DOOMSCROLLING
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      background: '#1e293b',
                      padding: '2px 6px',
                      borderRadius: 3,
                      color: '#38bdf8',
                    }}
                  >
                    PORT 3800
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsDialogOpen(false)}
              aria-label="Close dialog"
              style={{
                background: '#1e293b',
                border: 'none',
                color: '#94a3b8',
                borderRadius: 4,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>

          {/* Interactive Playback Controls */}
          <div
            style={{
              background: '#070b14',
              borderRadius: 8,
              border: '1px solid #1e293b',
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#64748b',
                marginBottom: 10,
              }}
            >
              Stage Playback Controls
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handlePlayToggle}
                  style={{
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #334155',
                    borderRadius: 4,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>

                <button
                  onClick={handleRestart}
                  style={{
                    background: '#1e293b',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: 4,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  ↺ Replay
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Speed:</span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    style={{
                      background: speed === s ? '#15868F' : '#0f172a',
                      color: speed === s ? '#ffffff' : '#94a3b8',
                      border: speed === s ? '1px solid #2A2A2A' : '1px solid #1e293b',
                      borderRadius: 4,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Navigation CTA to /examples */}
          <div>
            <button
              onClick={handleOpenExamples}
              style={{
                width: '100%',
                background: '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0px 0px #2A2A2A',
                padding: '12px 18px',
                fontSize: 14,
                fontWeight: 800,
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minHeight: 44,
              }}
            >
              Open Studio & Prompt Exporter →
            </button>
          </div>

          {/* System & Architecture Info */}
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: '#94a3b8',
              borderTop: '1px solid #1e293b',
              paddingTop: 14,
            }}
          >
            <p style={{ margin: '0 0 6px 0' }}>
              <strong>Architecture:</strong> Vector graphics and GSAP ActionScript choreography for Next.js & WordPress.
            </p>
            <p style={{ margin: '0 0 6px 0' }}>
              <strong>Runtime:</strong> Dual distribution with tree-shakeable ESM (<code style={{ color: '#38bdf8' }}>dist/index.js</code>) and standalone WordPress bundle (<code style={{ color: '#38bdf8' }}>dist/flash-bundle.min.js</code>).
            </p>
            <p style={{ margin: 0, color: '#64748b' }}>
              Zero vertical scrolling. Single viewport runtime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
