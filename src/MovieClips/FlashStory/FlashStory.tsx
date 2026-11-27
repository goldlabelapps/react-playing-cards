import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { LightningBolt } from '../LightningBolt';
import { flashStoryActionScript } from '../../ActionScript/flashStory';

export interface FlashStoryChapter {
  year: string;
  era: string;
  title: string;
  narrative: string;
  themeColor: string;
}

export const FLASH_STORY_CHAPTERS: FlashStoryChapter[] = [
  {
    year: '1996',
    era: 'Origins',
    title: 'FutureSplash Animator',
    narrative:
      'Charlie Jackson and Jonathan Gay create FutureSplash Animator. Lightweight vector drawings and frame-based motion arrive on the early World Wide Web.',
    themeColor: '#38bdf8',
  },
  {
    year: '1997',
    era: 'Transformation',
    title: 'Macromedia Flash',
    narrative:
      'Acquired by Macromedia and rebranded as Flash. The iconic lightning bolt emblem and ActionScript runtime spark a revolution in interactive web experiences.',
    themeColor: '#15868F',
  },
  {
    year: '2005',
    era: 'Golden Age',
    title: 'The Creative Web Standard',
    narrative:
      'Installed on over ninety-eight percent of connected desktop browsers globally, powering classic web games, digital cartoons, and interactive multimedia.',
    themeColor: '#f59e0b',
  },
  {
    year: '2020',
    era: 'Transition',
    title: 'The Enduring Heritage',
    narrative:
      'The browser plugin steps aside as native standards mature, leaving an indelible legacy of interactive expression and vector animation choreography.',
    themeColor: '#e11d48',
  },
  {
    year: '2026',
    era: 'Renaissance',
    title: 'Modern Flash',
    narrative:
      'The classic authoring model reborn in pure SVG vectors, GreenSock ActionScript timelines, and native React and WordPress runtime engines.',
    themeColor: '#10b981',
  },
];

export interface FlashStoryProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  initialChapter?: number;
}

export function FlashStory({
  width = '100%',
  height = '100%',
  className,
  style,
  autoPlay = true,
  loop = true,
  speed = 1,
  initialChapter = 0,
}: FlashStoryProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(initialChapter);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const containerRef = useRef<HTMLDivElement>(null);
  const boltContainerRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<SVGCircleElement>(null);
  const timerRef = useRef<number | null>(null);

  const currentChapter = FLASH_STORY_CHAPTERS[activeChapterIndex];

  // Electric strike impulse when changing chapters
  const triggerElectricSurge = useCallback(() => {
    if (!boltContainerRef.current) return;

    const target = boltContainerRef.current;
    const tl = gsap.timeline();

    tl.to(target, {
      scale: 1.08,
      filter: 'drop-shadow(0 0 35px #ffffff) drop-shadow(0 0 60px ' + currentChapter.themeColor + ')',
      duration: 0.08,
      ease: 'power4.out',
    })
      .to(target, {
        scale: 0.96,
        filter: 'drop-shadow(0 0 15px ' + currentChapter.themeColor + ')',
        duration: 0.06,
      })
      .to(target, {
        scale: 1.03,
        duration: 0.08,
      })
      .to(target, {
        scale: 1,
        filter: 'drop-shadow(0 0 25px ' + currentChapter.themeColor + ')',
        duration: 0.25,
        ease: 'power2.out',
      });

    if (glowRingRef.current) {
      gsap.fromTo(
        glowRingRef.current,
        { scale: 0.8, opacity: 0.9, transformOrigin: 'center center' },
        { scale: 1.35, opacity: 0, duration: 0.55, ease: 'power2.out' }
      );
    }
  }, [currentChapter.themeColor]);

  // Navigate to specific chapter
  const goToChapter = useCallback(
    (index: number) => {
      setActiveChapterIndex(index);
      triggerElectricSurge();
    },
    [triggerElectricSurge]
  );

  const nextChapter = useCallback(() => {
    setActiveChapterIndex((prev) => {
      if (prev < FLASH_STORY_CHAPTERS.length - 1) {
        return prev + 1;
      }
      return loop ? 0 : prev;
    });
    triggerElectricSurge();
  }, [loop, triggerElectricSurge]);

  const prevChapter = useCallback(() => {
    setActiveChapterIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return loop ? FLASH_STORY_CHAPTERS.length - 1 : 0;
    });
    triggerElectricSurge();
  }, [loop, triggerElectricSurge]);

  // Ambient lightning ActionScript timeline loop
  useEffect(() => {
    const target = boltContainerRef.current;
    if (!target) return;

    const timeline = flashStoryActionScript({
      target,
      loop: true,
      speed,
    });

    return () => {
      timeline.kill();
    };
  }, [speed]);

  // Auto-play chapter progression timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(2500, Math.round(5500 / speed));
    timerRef.current = window.setInterval(() => {
      nextChapter();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, nextChapter]);

  return (
    <div
      ref={containerRef}
      className={`flash-story-stage ${className ?? ''}`.trim()}
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 16px',
        boxSizing: 'border-box',
        color: '#f8fafc',
        userSelect: 'none',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(21, 134, 143, 0.16), transparent 75%)',
        ...style,
      }}
    >
      {/* Background Energy Grid & Shockwave Rings */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        viewBox="0 0 600 600"
      >
        <defs>
          <radialGradient id="electricHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={currentChapter.themeColor} stopOpacity="0.25" />
            <stop offset="60%" stopColor={currentChapter.themeColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="240" r="180" fill="url(#electricHalo)" />
        <circle
          ref={glowRingRef}
          cx="300"
          cy="240"
          r="140"
          fill="none"
          stroke={currentChapter.themeColor}
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.35"
        />
        {/* Subtle radial radar coordinate lines */}
        <line x1="160" y1="240" x2="440" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="300" y1="100" x2="300" y2="380" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>

      {/* Chapter Indicator Header Badge */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'rgba(7, 11, 20, 0.85)',
            border: '2px solid #2A2A2A',
            boxShadow: '3px 3px 0 0 #2A2A2A',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentChapter.themeColor,
              boxShadow: `0 0 8px ${currentChapter.themeColor}`,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            The Story of Flash
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
            {activeChapterIndex + 1} / {FLASH_STORY_CHAPTERS.length}
          </span>
        </div>
      </header>

      {/* Central Visual Stage: Animated Lightning Bolt */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: 180,
          maxHeight: 320,
          cursor: 'pointer',
        }}
        onClick={triggerElectricSurge}
        title="Click to trigger electric energy surge"
      >
        <div
          ref={boltContainerRef}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `drop-shadow(0 0 24px ${currentChapter.themeColor})`,
            transition: 'filter 0.4s ease',
            transformOrigin: 'center center',
          }}
        >
          <LightningBolt
            width="145px"
            height="260px"
            frontColor={currentChapter.themeColor}
            backColor="#070b14"
            strokeColor="#ffffff"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* Narrative Card: Chapter Details */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 620,
          background: 'rgba(13, 21, 39, 0.92)',
          border: '2px solid #2A2A2A',
          boxShadow: '4px 4px 0 0 #2A2A2A',
          borderRadius: 12,
          padding: '16px 20px',
          boxSizing: 'border-box',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Title and Era Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                background: currentChapter.themeColor,
                color: '#ffffff',
                fontWeight: 900,
                fontSize: 13,
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid #2A2A2A',
              }}
            >
              {currentChapter.year}
            </span>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
              {currentChapter.title}
            </h3>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#94a3b8',
            }}
          >
            {currentChapter.era}
          </span>
        </div>

        {/* Narrative Description */}
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.55,
            color: '#cbd5e1',
          }}
        >
          {currentChapter.narrative}
        </p>

        {/* Chapter Progress Scrubber & Playback Controls */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {/* Chapter Scrubber Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {FLASH_STORY_CHAPTERS.map((ch, idx) => {
              const isCurrent = idx === activeChapterIndex;
              return (
                <button
                  key={ch.year}
                  type="button"
                  onClick={() => goToChapter(idx)}
                  style={{
                    background: isCurrent ? currentChapter.themeColor : '#0f172a',
                    color: isCurrent ? '#ffffff' : '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title={`Jump to ${ch.year} (${ch.title})`}
                >
                  {ch.year}
                </button>
              );
            })}
          </div>

          {/* Stepper Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={prevChapter}
              style={{
                background: '#1e293b',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: 4,
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 32,
              }}
              title="Previous chapter"
            >
              ← Prev
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? '#15868F' : '#334155',
                color: '#ffffff',
                border: '1px solid #2A2A2A',
                borderRadius: 4,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 32,
              }}
              title={isPlaying ? 'Pause story' : 'Play story'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type="button"
              onClick={nextChapter}
              style={{
                background: '#1e293b',
                color: '#ffffff',
                border: '1px solid #334155',
                borderRadius: 4,
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 32,
              }}
              title="Next chapter"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashStory;
