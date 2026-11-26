'use client';

import * as React from 'react';
import { SpriteArtwork, type SpriteArtworkProps } from './SpriteArtwork';

export interface SpriteMCProps extends SpriteArtworkProps {
  moving?: boolean;
  fps?: number;
}

type Direction = NonNullable<SpriteArtworkProps['direction']>;

export function SpriteMC({
  direction: propDirection = 'E',
  frame: controlledFrame,
  size = 64,
  moving: propMoving = true,
  fps = 8,
  colors,
}: SpriteMCProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [directionState, setDirectionState] = React.useState<Direction>(propDirection);
  const [movingState, setMovingState] = React.useState<boolean>(propMoving);
  const [internalFrame, setInternalFrame] = React.useState(0);

  React.useEffect(() => {
    setDirectionState(propDirection);
  }, [propDirection]);

  React.useEffect(() => {
    setMovingState(propMoving);
  }, [propMoving]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targetEl = el.closest<HTMLElement>('[data-direction]') || el.parentElement;
    if (!targetEl) return;

    const syncState = () => {
      const dir = targetEl.getAttribute('data-direction') as Direction | null;
      const mov = targetEl.getAttribute('data-moving');
      if (dir) {
        setDirectionState(dir);
      }
      if (mov !== null) {
        setMovingState(mov === 'true');
      }
    };

    syncState();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'data-direction' || mutation.attributeName === 'data-moving')) {
          syncState();
        }
      }
    });

    observer.observe(targetEl, {
      attributes: true,
      attributeFilter: ['data-direction', 'data-moving'],
    });

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (controlledFrame !== undefined || !movingState) {
      setInternalFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setInternalFrame((prev) => (prev + 1) % 4);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [controlledFrame, movingState, fps]);

  const activeFrame = controlledFrame !== undefined ? controlledFrame : internalFrame;

  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      <SpriteArtwork
        direction={directionState}
        frame={activeFrame}
        size={size}
        colors={colors}
      />
    </div>
  );
}

export default SpriteMC;
