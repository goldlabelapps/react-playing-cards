import type { CSSProperties } from 'react';
import { MACROMEDIA_FLASH_PATH, FLASH_RAYS } from './constants';

export interface MacromediaProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export function Macromedia({
  width = '100%',
  height = '100%',
  color = '#4C979C',
  className,
  style,
}: MacromediaProps) {
  return (
    <div
      className={className}
      data-movieclip="macromedia"
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 512 230"
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: 400,
          overflow: 'visible',
        }}
        aria-label="Macromedia Flash Stage Animation"
      >
        <defs>
          {/* Holographic linear gradient for the energy beam sweep across the Flash rays */}
          <linearGradient id="macromediaBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Radial aura glow centered at the Flash starburst hub (256, 114) */}
          <radialGradient id="macromediaHubAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="55%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          {/* Clip path matching the exact 1990s Macromedia Flash icon */}
          <clipPath id="macromediaLogoClip">
            <path d={MACROMEDIA_FLASH_PATH} />
          </clipPath>
        </defs>

        {/* Stage background glow */}
        <circle
          data-part="aura"
          cx="256"
          cy="114"
          r="160"
          fill="url(#macromediaHubAura)"
        />

        {/* Technical Alignment Reticle & Hub Rings */}
        <g data-part="reticle" opacity="0.65">
          <circle
            cx="256"
            cy="114"
            r="120"
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle
            data-part="ring"
            cx="256"
            cy="114"
            r="95"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            strokeDasharray="20 12 6 12"
            opacity="0.5"
          />
          {/* Central hub focal point */}
          <circle cx="256" cy="114" r="3" fill={color} opacity="0.8" />

          {/* Axis Alignment Crosshairs */}
          <line x1="256" y1="10" x2="256" y2="28" stroke="#64748b" strokeWidth="2" />
          <line x1="256" y1="200" x2="256" y2="218" stroke="#64748b" strokeWidth="2" />
          <line x1="140" y1="114" x2="158" y2="114" stroke="#64748b" strokeWidth="2" />
          <line x1="354" y1="114" x2="372" y2="114" stroke="#64748b" strokeWidth="2" />

          {/* Technical Corner Framing Markers */}
          <path d="M 60,30 L 40,30 L 40,50" fill="none" stroke="#475569" strokeWidth="2" />
          <path d="M 452,30 L 472,30 L 472,50" fill="none" stroke="#475569" strokeWidth="2" />
          <path d="M 60,200 L 40,200 L 40,180" fill="none" stroke="#475569" strokeWidth="2" />
          <path d="M 452,200 L 472,200 L 472,180" fill="none" stroke="#475569" strokeWidth="2" />
        </g>

        {/* Authentic 1990s Macromedia Flash Icon */}
        <g data-part="emblem">
          {/* Individual animated vector rays of the authentic Flash burst */}
          {FLASH_RAYS.map((pathD, idx) => (
            <path
              key={idx}
              data-part={`ray-${idx + 1}`}
              d={pathD}
              fill={color}
              style={{
                transformOrigin: '256px 114px',
              }}
            />
          ))}

          {/* Energy Beam Sweep traversing across the Flash starburst */}
          <g clipPath="url(#macromediaLogoClip)">
            <rect
              data-part="beam"
              x="120"
              y="20"
              width="80"
              height="190"
              fill="url(#macromediaBeamGrad)"
              transform="skewX(-28)"
              opacity="0"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default Macromedia;
