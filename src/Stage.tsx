import { forwardRef, type CSSProperties } from 'react';
import type { StageProps } from './types';

export const Stage = forwardRef<HTMLDivElement, StageProps>(function Stage(
  {
    width = '100%',
    height = '100%',
    color = 'transparent',
    viewBox,
    children,
    className,
    style: customStyle,
    onClick,
  },
  ref,
) {
  const stageStyle: CSSProperties = {
    width,
    height,
    minHeight: 120,
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    ...customStyle,
  };

  return (
    <div
      ref={ref}
      className={`flash-stage ${className ?? ''}`.trim()}
      style={stageStyle}
      onClick={onClick}
      role="region"
      aria-label="Flash SVG Animation Stage"
    >
      {viewBox ? (
        <svg
          viewBox={viewBox}
          className="flash-stage-svg"
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          {children}
        </svg>
      ) : (
        children
      )}
    </div>
  );
});
