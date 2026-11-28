import { useEffect } from 'react';
import { AgentText } from '../Typography/AgentText';
import type { PokerDiceProps } from './types';

export type { PokerDiceProps } from './types';

/**
 * PokerDice placeholder graphic
 *
 * Renders a crisp vector placeholder graphic of a single die
 * alongside an AgentText message indicating work in progress.
 */
export function PokerDice({
  size = 180,
  width = '100%',
  height = '100%',
  className,
  style,
  color,
  pipColor,
  statusMessage = 'Work In Progress',
  durationSeconds = 5,
  onComplete,
}: PokerDiceProps) {
  useEffect(() => {
    if (!onComplete) return;
    const timer = setTimeout(() => {
      onComplete();
    }, durationSeconds * 1000);

    return () => clearTimeout(timer);
  }, [onComplete, durationSeconds]);

  return (
    <div
      className={`flash-poker-dice ${className ?? ''}`.trim()}
      role="region"
      aria-label="Poker Dice Placeholder"
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        position: 'relative',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        role="img"
        aria-label="Single die placeholder graphic"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={typeof size === 'number' ? size : size}
          height={typeof size === 'number' ? size : size}
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45))',
          }}
        >
          <defs>
            {/* Ground contact shadow */}
            <radialGradient
              id="dieShadow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Top Face Gradient */}
            <linearGradient
              id="topFace"
              x1="62"
              y1="44"
              x2="194"
              y2="120"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={color || '#FFFFFF'} />
              <stop offset="100%" stopColor={color ? '#D8E2DC' : '#E2E8F0'} />
            </linearGradient>

            {/* Left Face Gradient */}
            <linearGradient
              id="leftFace"
              x1="62"
              y1="82"
              x2="128"
              y2="204"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={color ? '#C5D3CB' : '#CBD5E1'} />
              <stop offset="100%" stopColor={color ? '#94A89D' : '#94A3B8'} />
            </linearGradient>

            {/* Right Face Gradient */}
            <linearGradient
              id="rightFace"
              x1="128"
              y1="82"
              x2="194"
              y2="204"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={color ? '#94A89D' : '#94A3B8'} />
              <stop offset="100%" stopColor={color ? '#6E8276' : '#64748B'} />
            </linearGradient>

            {/* Pip Recess Shadow Gradient */}
            <radialGradient id="pipGlow" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={pipColor || '#EF4444'} stopOpacity="0.95" />
              <stop offset="100%" stopColor={pipColor ? '#7F1D1D' : '#991B1B'} />
            </radialGradient>

            <radialGradient id="pipDark" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={pipColor || '#334155'} />
              <stop offset="100%" stopColor={pipColor ? '#000000' : '#0F172A'} />
            </radialGradient>
          </defs>

          {/* Floor shadow */}
          <ellipse cx="128" cy="216" rx="84" ry="24" fill="url(#dieShadow)" />

          {/* Die Body Group */}
          <g stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
            {/* Left Face */}
            <polygon
              points="62,82 128,120 128,204 62,166"
              fill="url(#leftFace)"
            />

            {/* Right Face */}
            <polygon
              points="128,120 194,82 194,166 128,204"
              fill="url(#rightFace)"
            />

            {/* Top Face */}
            <polygon
              points="62,82 128,44 194,82 128,120"
              fill="url(#topFace)"
            />
          </g>

          {/* Pips with exact isometric projections */}

          {/* Top Face: 1 Red Pip (Ace) */}
          <g transform="matrix(66, -38, 66, 38, 62, 82)">
            <circle
              cx="0.5"
              cy="0.5"
              r="0.16"
              fill="url(#pipGlow)"
              stroke="#7F1D1D"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Left Face: 2 Pips */}
          <g transform="matrix(66, 38, 0, 84, 62, 82)">
            <circle
              cx="0.32"
              cy="0.32"
              r="0.1"
              fill="url(#pipDark)"
              stroke="#0F172A"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="0.68"
              cy="0.68"
              r="0.1"
              fill="url(#pipDark)"
              stroke="#0F172A"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Right Face: 3 Pips */}
          <g transform="matrix(66, -38, 0, 84, 128, 120)">
            <circle
              cx="0.25"
              cy="0.25"
              r="0.09"
              fill="url(#pipDark)"
              stroke="#0F172A"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="0.5"
              cy="0.5"
              r="0.09"
              fill="url(#pipDark)"
              stroke="#0F172A"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="0.75"
              cy="0.75"
              r="0.09"
              fill="url(#pipDark)"
              stroke="#0F172A"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>

      {/* AgentText Status Notification */}
      <AgentText
        title={statusMessage}
        status="active"
        counterStyle="verbose"
        fontSize="16px"
      />
    </div>
  );
}

export default PokerDice;
