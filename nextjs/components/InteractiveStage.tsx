'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { Flash, parsePrompt } from 'modern-flash';
import type { FlashHandle, MovieName } from 'modern-flash';
import type { FlashScene } from '../lib/db';
import { createSceneAction } from '../app/actions';

interface InteractiveStageProps {
  initialScenes: FlashScene[];
}

export function InteractiveStage({ initialScenes }: InteractiveStageProps) {
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState('The Story of Flash: Iconic lightning bolt vector animation');
  const [activeMovie, setActiveMovie] = useState<MovieName>('FlashStory');
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scenes, setScenes] = useState<FlashScene[]>(initialScenes);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const flashRef = useRef<FlashHandle>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scene = prompt ? parsePrompt(prompt) : undefined;

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

  const handleSelectScene = (item: FlashScene) => {
    setPrompt(item.prompt);
    setActiveMovie(item.movie as MovieName);
    setSpeed(item.speed);
    setIsPlaying(true);
    flashRef.current?.restart();
  };

  const handleSaveScene = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('prompt', prompt);
    formData.set('movie', activeMovie);
    formData.set('speed', speed.toString());

    startTransition(async () => {
      const res = await createSceneAction(formData);
      if (res.success) {
        setStatusMessage('Scene persisted to database.');
        setScenes((prev) => [
          {
            id: 'temp-' + Date.now(),
            title: (formData.get('title') as string) || prompt.slice(0, 24),
            prompt,
            movie: activeMovie,
            speed,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage('Could not persist scene.');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Interactive Vector Surface Card */}
      <div
        style={{
          background: '#070b14',
          borderRadius: 16,
          border: '2px solid #2A2A2A',
          boxShadow: '4px 4px 0 0 #2A2A2A',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Stage Chrome Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: '#0d1527',
            borderBottom: '2px solid #2A2A2A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em' }}>
              STAGE SURFACE // GSAP ACTIONCRIPT
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Speed: {speed}x</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ width: 90, accentColor: '#15868F' }}
              aria-label="Playback speed"
            />
          </div>
        </div>

        {/* Viewport Render Surface */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, #0f1c3f 0%, #070b14 75%)',
          }}
        >
          {mounted ? (
            <Flash
              ref={flashRef}
              movie={activeMovie}
              scene={scene}
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

        {/* Action Controls Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: '#0d1527',
            borderTop: '2px solid #2A2A2A',
            gap: 12,
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
                boxShadow: '3px 3px 0 0 #2A2A2A',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              style={{
                background: '#1e293b',
                color: '#f8fafc',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0 0 #2A2A2A',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Restart
            </button>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { label: 'Flash Story', p: 'The Story of Flash: Iconic lightning bolt vector animation', m: 'FlashStory' },
              { label: 'Ace Flip', p: 'Deal Ace of Spades with a 3D flip on dark slate stage', m: 'logo' },
              { label: 'Starfighter', p: 'Starfighter hyperspace jump with rotating shield matrix', m: 'starfighter' },
              { label: 'HUD Radar', p: 'Classic vector telemetry HUD radar sweep', m: 'hudMacromedia' },
              { label: 'Card Flip', p: 'Royal flush spread across emerald felt', m: 'cardFlip' },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={() => {
                  setPrompt(btn.p);
                  setActiveMovie(btn.m as MovieName);
                  setIsPlaying(true);
                }}
                style={{
                  background: prompt === btn.p ? '#15868F' : '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  minHeight: 36,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt Form & Save Card */}
      <div
        style={{
          background: '#0d1527',
          borderRadius: 12,
          border: '2px solid #2A2A2A',
          boxShadow: '4px 4px 0 0 #2A2A2A',
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 18, color: '#f8fafc', margin: '0 0 12px', fontWeight: 700 }}>
          Natural Language Prompt Engine
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
          Type a descriptive scene to recompile the SVG stage on the fly, or save it to MariaDB for persistence.
        </p>

        <form onSubmit={handleSaveScene} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Deal King of Hearts with 3D flip on dark stage"
              style={{
                flex: 1,
                minWidth: 260,
                background: '#070b14',
                color: '#f8fafc',
                border: '2px solid #334155',
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 14,
                minHeight: 44,
              }}
              aria-label="Scene prompt"
            />

            <input
              type="text"
              name="title"
              placeholder="Scene title (optional)"
              style={{
                width: 220,
                background: '#070b14',
                color: '#f8fafc',
                border: '2px solid #334155',
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 14,
                minHeight: 44,
              }}
              aria-label="Scene title"
            />

            <button
              type="submit"
              disabled={isPending}
              style={{
                background: '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0 0 #2A2A2A',
                borderRadius: 6,
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPending ? 'Saving...' : 'Save to DB'}
            </button>
          </div>

          {statusMessage && (
            <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>{statusMessage}</div>
          )}
        </form>
      </div>

      {/* Persistent Scene Gallery */}
      <section aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" style={{ fontSize: 20, color: '#f8fafc', margin: '0 0 16px', fontWeight: 700 }}>
          Saved Scenes // Shared Persistence
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {scenes.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectScene(item)}
              style={{
                background: prompt === item.prompt ? '#101c38' : '#0d1527',
                border: prompt === item.prompt ? '2px solid #15868F' : '1px solid #1e293b',
                borderRadius: 8,
                padding: 18,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 120,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{item.title}</h3>
                  <span style={{ fontSize: 11, color: '#64748b', background: '#070b14', padding: '2px 6px', borderRadius: 4 }}>
                    {item.movie}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {item.prompt}
                </p>
              </div>

              <div style={{ marginTop: 12, fontSize: 11, color: '#15868F', fontWeight: 600 }}>
                Click to load on stage →
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
