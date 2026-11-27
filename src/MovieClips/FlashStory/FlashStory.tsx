import { useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { LightningBolt } from '../LightningBolt';
import { flashStoryActionScript } from '../../ActionScript/flashStory';

export interface FlashStoryProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  initialChapter?: number;
  frontColor?: string;
  backColor?: string;
  strokeColor?: string;
}

export function FlashStory({
  width = '100%',
  height = '100%',
  className,
  style,
  autoPlay = true,
  loop = true,
  speed = 1,
  frontColor = '#15868F',
  backColor = '#070b14',
  strokeColor = '#ffffff',
}: FlashStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boltContainerRef = useRef<HTMLDivElement>(null);

  // Electric strike impulse on interaction
  const triggerElectricSurge = useCallback(() => {
    if (!boltContainerRef.current) return;

    const target = boltContainerRef.current;
    const tl = gsap.timeline();

    tl.to(target, {
      scale: 1.08,
      filter: `drop-shadow(0 0 35px #ffffff) drop-shadow(0 0 60px ${frontColor})`,
      duration: 0.08,
      ease: 'power4.out',
    })
      .to(target, {
        scale: 0.96,
        filter: `drop-shadow(0 0 15px ${frontColor})`,
        duration: 0.06,
      })
      .to(target, {
        scale: 1.03,
        duration: 0.08,
      })
      .to(target, {
        scale: 1,
        filter: `drop-shadow(0 0 25px ${frontColor})`,
        duration: 0.25,
        ease: 'power2.out',
      });
  }, [frontColor]);

  // Ambient lightning ActionScript timeline loop
  useEffect(() => {
    const target = boltContainerRef.current;
    if (!target) return;

    if (!autoPlay) return;

    const timeline = flashStoryActionScript({
      target,
      loop,
      speed,
    });

    return () => {
      timeline.kill();
    };
  }, [autoPlay, loop, speed]);

  return (
    <div
      ref={containerRef}
      className={`flash-story-stage ${className ?? ''}`.trim()}
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        ref={boltContainerRef}
        onClick={triggerElectricSurge}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          filter: `drop-shadow(0 0 24px ${frontColor})`,
          transition: 'filter 0.4s ease',
          transformOrigin: 'center center',
        }}
        title="Lightning Bolt"
      >
        <LightningBolt
          width="145px"
          height="260px"
          frontColor={frontColor}
          backColor={backColor}
          strokeColor={strokeColor}
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
}

export default FlashStory;

