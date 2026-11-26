"use client";

import React, { useEffect, useRef } from 'react';

export interface BlingTextProps {
  text?: string;
  fontSize?: number | string;
  textColor?: string;
  shineColor?: string;
  speed?: number;
  repeatDelay?: number;
  loop?: boolean;
  letterSpacing?: number | string;
  fontFamily?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  className?: string;
  style?: React.CSSProperties;
  onFinish?: () => void;
}

export function BlingText({
  text = 'BLING',
  fontSize = '2rem',
  textColor = 'rgba(255, 255, 255, 0.7)',
  shineColor = 'rgba(255, 255, 255, 1)',
  speed = 1,
  repeatDelay = 0.8,
  loop = true,
  letterSpacing,
  fontFamily,
  fontWeight,
  className,
  style,
  onFinish,
}: BlingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (!containerRef.current) return;
    const shineEl = containerRef.current.querySelector<HTMLElement>('[data-bling-shine="true"]');
    const textEl = containerRef.current.querySelector<HTMLElement>('[data-bling-text="true"]');

    if (!shineEl || !textEl) return;

    let killed = false;
    let timeline: ReturnType<typeof import("gsap").gsap.timeline> | null = null;

    import('gsap').then((mod) => {
      const gsap = mod.gsap || mod.default || mod;
      if (killed || !shineEl || !textEl || !gsap || typeof gsap.timeline !== 'function') return;

      gsap.set(shineEl, { xPercent: -100 });
      gsap.set(textEl, { scale: 1, transformOrigin: 'center center' });

      timeline = gsap.timeline({
        repeat: loop ? -1 : 0,
        repeatDelay,
        onComplete: () => {
          if (onFinishRef.current) {
            onFinishRef.current();
          }
        },
      });

      timeline.timeScale(speed);

      timeline.to(
        shineEl,
        {
          xPercent: 200,
          duration: 1.4,
          ease: 'power2.inOut',
        },
        0
      );

      timeline.to(
        textEl,
        {
          scale: 1.015,
          duration: 0.7,
          ease: 'sine.out',
          yoyo: true,
          repeat: 1,
        },
        0
      );
    }).catch(() => {
      // Ignore if gsap loading fails in non-browser envs
    });

    return () => {
      killed = true;
      if (timeline && typeof timeline.kill === 'function') {
        timeline.kill();
      }
    };
  }, [text, speed, loop, repeatDelay]);

  return (
    <span
      ref={containerRef}
      data-bling-component="true"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        data-bling-text="true"
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight: fontWeight ?? style?.fontWeight ?? 800,
          fontFamily: fontFamily ?? style?.fontFamily ?? 'inherit',
          letterSpacing: letterSpacing ?? style?.letterSpacing ?? '-0.025em',
          color: textColor,
          backgroundImage: `linear-gradient(
            110deg,
            ${textColor} 0%,
            ${textColor} 40%,
            ${shineColor} 50%,
            ${textColor} 60%,
            ${textColor} 100%
          )`,
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          overflow: 'hidden',
        }}
      >
        {text}
        <span
          data-bling-shine="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 25%,
              ${shineColor} 50%,
              rgba(255, 255, 255, 0.1) 75%,
              transparent 100%
            )`,
            mixBlendMode: 'overlay',
            transform: 'translateX(-100%)',
          }}
        />
      </span>
    </span>
  );
}

export default BlingText;
