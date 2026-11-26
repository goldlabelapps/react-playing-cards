import type { CSSProperties } from 'react';
import { MACROMEDIA_FLASH_PATH, FLASH_RAYS } from './constants';

export interface MacromediaProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  showLogo?: boolean;
}

// Deterministic parallax star coordinates across wider canvas (-240 to 880, 0 to 360)
// To ensure smooth, seamless parallax drift as the fighter pans to the right
const FAR_STARS = [
  { x: -180, y: 45, r: 0.8, o: 0.5 },
  { x: -130, y: 120, r: 0.7, o: 0.4 },
  { x: -95, y: 280, r: 0.9, o: 0.6 },
  { x: -50, y: 80, r: 0.6, o: 0.35 },
  { x: -20, y: 220, r: 0.8, o: 0.5 },
  { x: 15, y: 40, r: 0.7, o: 0.45 },
  { x: 35, y: 170, r: 0.9, o: 0.6 },
  { x: 60, y: 310, r: 0.6, o: 0.4 },
  { x: 90, y: 95, r: 0.8, o: 0.55 },
  { x: 120, y: 240, r: 0.7, o: 0.4 },
  { x: 155, y: 60, r: 0.9, o: 0.65 },
  { x: 180, y: 190, r: 0.8, o: 0.5 },
  { x: 210, y: 330, r: 0.7, o: 0.4 },
  { x: 245, y: 110, r: 0.8, o: 0.5 },
  { x: 275, y: 45, r: 0.6, o: 0.35 },
  { x: 305, y: 260, r: 0.9, o: 0.6 },
  { x: 335, y: 85, r: 0.7, o: 0.45 },
  { x: 370, y: 215, r: 0.8, o: 0.55 },
  { x: 400, y: 50, r: 0.6, o: 0.4 },
  { x: 430, y: 320, r: 0.9, o: 0.6 },
  { x: 460, y: 140, r: 0.7, o: 0.45 },
  { x: 495, y: 75, r: 0.8, o: 0.5 },
  { x: 530, y: 270, r: 0.7, o: 0.4 },
  { x: 565, y: 115, r: 0.9, o: 0.65 },
  { x: 600, y: 340, r: 0.6, o: 0.35 },
  { x: 635, y: 90, r: 0.8, o: 0.55 },
  { x: 670, y: 230, r: 0.7, o: 0.45 },
  { x: 710, y: 65, r: 0.9, o: 0.6 },
  { x: 745, y: 295, r: 0.7, o: 0.4 },
  { x: 780, y: 160, r: 0.8, o: 0.5 },
  { x: 820, y: 40, r: 0.6, o: 0.35 },
  { x: 855, y: 250, r: 0.9, o: 0.6 },
];

const MID_STARS = [
  { x: -160, y: 85, r: 1.4, o: 0.75 },
  { x: -110, y: 230, r: 1.6, o: 0.85 },
  { x: -60, y: 150, r: 1.3, o: 0.7 },
  { x: 5, y: 70, r: 1.5, o: 0.8 },
  { x: 45, y: 280, r: 1.7, o: 0.9 },
  { x: 95, y: 130, r: 1.4, o: 0.75 },
  { x: 140, y: 50, r: 1.6, o: 0.85 },
  { x: 195, y: 260, r: 1.3, o: 0.7 },
  { x: 250, y: 175, r: 1.5, o: 0.8 },
  { x: 290, y: 320, r: 1.8, o: 0.9 },
  { x: 350, y: 65, r: 1.4, o: 0.75 },
  { x: 410, y: 240, r: 1.6, o: 0.85 },
  { x: 465, y: 95, r: 1.5, o: 0.8 },
  { x: 520, y: 310, r: 1.7, o: 0.9 },
  { x: 580, y: 160, r: 1.3, o: 0.7 },
  { x: 640, y: 45, r: 1.6, o: 0.85 },
  { x: 695, y: 275, r: 1.4, o: 0.75 },
  { x: 760, y: 120, r: 1.5, o: 0.8 },
  { x: 815, y: 300, r: 1.8, o: 0.9 },
];

const NEAR_STARS = [
  { x: -140, y: 190, r: 2.2, o: 0.95 },
  { x: -40, y: 100, r: 2.6, o: 1.0 },
  { x: 70, y: 220, r: 2.3, o: 0.9 },
  { x: 170, y: 120, r: 2.7, o: 1.0 },
  { x: 280, y: 270, r: 2.4, o: 0.95 },
  { x: 380, y: 80, r: 2.8, o: 1.0 },
  { x: 490, y: 210, r: 2.3, o: 0.9 },
  { x: 590, y: 135, r: 2.6, o: 1.0 },
  { x: 700, y: 255, r: 2.4, o: 0.95 },
  { x: 810, y: 90, r: 2.7, o: 1.0 },
];

export function Macromedia({
  width = '100%',
  height = '100%',
  color = '#4C979C',
  className,
  style,
  showLogo = false,
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
        overflow: 'hidden',
        background: '#040711',
        ...style,
      }}
    >
      <svg
        viewBox="0 0 640 360"
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: 540,
          overflow: 'visible',
        }}
        aria-label="Starfighter Cockpit HUD & Parallax Starfield"
      >
        <defs>
          {/* Deep space radial vignette */}
          <radialGradient id="cockpitVignette" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0a1024" stopOpacity="0" />
            <stop offset="70%" stopColor="#040711" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020409" stopOpacity="0.85" />
          </radialGradient>

          {/* Central HUD targeting aura */}
          <radialGradient id="hudHubAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="50%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          {/* Near star glow filter */}
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for Macromedia Flash burst (when enabled) */}
          <clipPath id="macromediaLogoClip">
            <path d={MACROMEDIA_FLASH_PATH} />
          </clipPath>
        </defs>

        {/* 1. PARALLAX STARFIELD LAYERS */}
        {/* Layer A: Distant Deep Space (Slow Shift) */}
        <g data-part="stars-far">
          {FAR_STARS.map((star, idx) => (
            <circle
              key={`far-${idx}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#cbd5e1"
              opacity={star.o}
            />
          ))}
        </g>

        {/* Layer B: Mid-Field Nebula & Medium Stars (Moderate Shift) */}
        <g data-part="stars-mid">
          {MID_STARS.map((star, idx) => (
            <circle
              key={`mid-${idx}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#93c5fd"
              opacity={star.o}
            />
          ))}
        </g>

        {/* Layer C: Near Stellar Objects & Speed Streaks (Fast Shift) */}
        <g data-part="stars-near" filter="url(#starGlow)">
          {NEAR_STARS.map((star, idx) => (
            <g key={`near-${idx}`}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#ffffff"
                opacity={star.o}
              />
              {/* Subtle 4-point diffraction spike on prominent near stars */}
              <line
                x1={star.x - star.r * 2.5}
                y1={star.y}
                x2={star.x + star.r * 2.5}
                y2={star.y}
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity={star.o * 0.7}
              />
              <line
                x1={star.x}
                y1={star.y - star.r * 2.5}
                x2={star.x}
                y2={star.y + star.r * 2.5}
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity={star.o * 0.7}
              />
            </g>
          ))}
        </g>

        {/* Cockpit canopy vignette overlay */}
        <rect width="640" height="360" fill="url(#cockpitVignette)" pointerEvents="none" />

        {/* 2. STARFIGHTER HUD RETICLE (CENTERED AT 320, 180) */}
        <g data-part="reticle" style={{ transformOrigin: '320px 180px' }}>
          {/* HUD Targeting Aura Glow */}
          <circle
            data-part="hud-aura"
            cx="320"
            cy="180"
            r="160"
            fill="url(#hudHubAura)"
            opacity="0.8"
          />

          {/* Outer Compass / Azimuth Ring */}
          <circle
            data-part="outer-ring"
            cx="320"
            cy="180"
            r="128"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.7"
          />

          {/* Rotating Rangefinder Reticle Ring */}
          <circle
            data-part="ring"
            cx="320"
            cy="180"
            r="96"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeDasharray="24 12 8 12"
            opacity="0.75"
            style={{ transformOrigin: '320px 180px' }}
          />

          {/* Inner Precision Targeting Circle */}
          <circle
            data-part="inner-ring"
            cx="320"
            cy="180"
            r="48"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            strokeDasharray="8 6"
            opacity="0.6"
          />

          {/* Central Target Focal Pip */}
          <circle
            data-part="center-pip"
            cx="320"
            cy="180"
            r="3.5"
            fill={color}
            opacity="0.9"
          />
          <circle
            cx="320"
            cy="180"
            r="8"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.4"
          />

          {/* Axis Alignment Crosshairs */}
          <g data-part="crosshairs" stroke={color} strokeWidth="1.5" opacity="0.65">
            <line x1="320" y1="44" x2="320" y2="76" />
            <line x1="320" y1="284" x2="320" y2="316" />
            <line x1="184" y1="180" x2="216" y2="180" />
            <line x1="424" y1="180" x2="456" y2="180" />
          </g>

          {/* Pitch Ladder & Horizon Ticks */}
          <g data-part="pitch-ladder" stroke="#64748b" strokeWidth="1.2" opacity="0.5">
            <line x1="284" y1="130" x2="306" y2="130" />
            <line x1="334" y1="130" x2="356" y2="130" />
            <line x1="284" y1="230" x2="306" y2="230" />
            <line x1="334" y1="230" x2="356" y2="230" />
          </g>

          {/* Star Wars Fighter Targeting Acquisition Brackets */}
          <g data-part="target-brackets" stroke={color} strokeWidth="2" fill="none" opacity="0.85">
            {/* Left Bracket */}
            <path
              data-part="bracket-left"
              d="M 276,160 L 260,160 L 260,200 L 276,200"
              style={{ transformOrigin: '320px 180px' }}
            />
            {/* Right Bracket */}
            <path
              data-part="bracket-right"
              d="M 364,160 L 380,160 L 380,200 L 364,200"
              style={{ transformOrigin: '320px 180px' }}
            />
          </g>

          {/* Corner Framing Markers (Rectangular Canopy Bounds) */}
          <g data-part="corner-markers" stroke="#475569" strokeWidth="2" fill="none" opacity="0.6">
            <path d="M 120,60 L 80,60 L 80,100" />
            <path d="M 520,60 L 560,60 L 560,100" />
            <path d="M 120,300 L 80,300 L 80,260" />
            <path d="M 520,300 L 560,300 L 560,260" />
          </g>

          {/* Cockpit HUD Flight Telemetry Readouts */}
          <g
            data-part="telemetry"
            fill={color}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              userSelect: 'none',
            }}
            opacity="0.8"
          >
            {/* Upper Right Flight Vectors */}
            <text x="550" y="52" textAnchor="end">
              AZM +028.4° // VEL 1.2c
            </text>
            {/* Upper Left Nav Heading */}
            <text x="90" y="52" textAnchor="start">
              HDG 084 // SYS: ONLINE
            </text>
            {/* Lower Right Targeting Acquisition */}
            <text data-part="telemetry-lock" x="550" y="318" textAnchor="end">
              TGT LOCK: ACQUIRED
            </text>
            {/* Lower Left Range Telemetry */}
            <text x="90" y="318" textAnchor="start">
              RANGE: 0482m
            </text>
          </g>
        </g>

        {/* 3. OPTIONAL MACROMEDIA FLASH BURST LOGO (HIDDEN BY DEFAULT) */}
        {showLogo && (
          <g data-part="emblem" transform="translate(64, 66)">
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
        )}
      </svg>
    </div>
  );
}

export default Macromedia;
