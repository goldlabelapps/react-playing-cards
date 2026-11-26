import type { CSSProperties } from 'react';
import { MACROMEDIA_FLASH_PATH, FLASH_RAYS } from './constants';
import {
  BASE_FAR_STARS,
  BASE_MID_STARS,
  BASE_NEAR_STARS,
  generateSeamlessStarTiles,
} from './starsData';

export interface MacromediaProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  showLogo?: boolean;
}

// Generate horizontally tiled star arrays across multiple 640px periods
// for mathematically seamless infinite wraparound parallax
const SEAMLESS_FAR_STARS = generateSeamlessStarTiles(BASE_FAR_STARS, [-1, 2]);
const SEAMLESS_MID_STARS = generateSeamlessStarTiles(BASE_MID_STARS, [-1, 3]);
const SEAMLESS_NEAR_STARS = generateSeamlessStarTiles(BASE_NEAR_STARS, [-1, 5]);

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
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          overflow: 'hidden',
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

        {/* 1. PARALLAX STARFIELD LAYERS (STRETCHING FULL VERTICAL BOUNDS: -120 TO 480) */}
        {/* Layer A: Distant Deep Space (Slow Shift, repeats every 640px) */}
        <g data-part="stars-far">
          {SEAMLESS_FAR_STARS.map((star, idx) => (
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

        {/* Layer B: Mid-Field Nebula & Medium Stars (Moderate Shift, repeats every 1280px) */}
        <g data-part="stars-mid">
          {SEAMLESS_MID_STARS.map((star, idx) => (
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

        {/* Layer C: Near Stellar Objects & Speed Streaks (Fast Shift, repeats every 2560px) */}
        <g data-part="stars-near" filter="url(#starGlow)">
          {SEAMLESS_NEAR_STARS.map((star, idx) => (
            <g key={`near-${idx}`}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill="#ffffff"
                opacity={star.o}
              />
              {/* 4-point diffraction spike on prominent near stars */}
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

        {/* Full-bleed cockpit canopy vignette */}
        <rect
          x="-640"
          y="-140"
          width="2560"
          height="640"
          fill="url(#cockpitVignette)"
          pointerEvents="none"
        />

        {/* 2. STARFIGHTER HUD RETICLE & DYNAMIC TELEMETRY SYSTEM */}
        <g data-part="hud-assembly">
          {/* Main Reticle Assembly scaled to half size (0.5x), Centered at 320, 180 */}
          <g
            data-part="reticle"
            style={{
              transform: 'scale(0.5)',
              transformOrigin: '320px 180px',
            }}
          >
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
              strokeWidth="2.0"
              strokeDasharray="6 8"
              opacity="0.75"
            />

            {/* Rotating Rangefinder Reticle Ring */}
            <circle
              data-part="ring"
              cx="320"
              cy="180"
              r="96"
              fill="none"
              stroke={color}
              strokeWidth="2.2"
              strokeDasharray="24 12 8 12"
              opacity="0.85"
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
              strokeWidth="1.8"
              strokeDasharray="8 6"
              opacity="0.7"
              style={{ transformOrigin: '320px 180px' }}
            />

            {/* Central Target Focal Pip */}
            <circle
              data-part="center-pip"
              cx="320"
              cy="180"
              r="4.5"
              fill={color}
              opacity="0.95"
            />
            <circle
              cx="320"
              cy="180"
              r="10"
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              opacity="0.5"
            />

            {/* Axis Alignment Crosshairs */}
            <g data-part="crosshairs" stroke={color} strokeWidth="2.0" opacity="0.75">
              <line x1="320" y1="40" x2="320" y2="76" />
              <line x1="320" y1="284" x2="320" y2="320" />
              <line x1="180" y1="180" x2="216" y2="180" />
              <line x1="424" y1="180" x2="460" y2="180" />
            </g>

            {/* Dynamic Pitch Ladder (Pitches vertically and tilts with flight attitude) */}
            <g data-part="pitch-ladder" stroke={color} strokeWidth="1.8" opacity="0.75" style={{ transformOrigin: '320px 180px' }}>
              {/* +10° Climb Ladder Rung & Label */}
              <path d="M 276,120 L 302,120 L 302,126 M 338,126 L 338,120 L 364,120" fill="none" />
              <text x="268" y="123" textAnchor="end" fontSize="10" fill={color} stroke="none" fontWeight="700">
                +10
              </text>
              {/* +5° Climb Tick */}
              <line x1="290" y1="150" x2="304" y2="150" />
              <line x1="336" y1="150" x2="350" y2="150" />
              {/* 0° Artificial Horizon Bar & Label */}
              <line x1="256" y1="180" x2="288" y2="180" strokeDasharray="6 3" />
              <line x1="352" y1="180" x2="384" y2="180" strokeDasharray="6 3" />
              <text x="246" y="184" textAnchor="end" fontSize="10" fill={color} stroke="none" fontWeight="700">
                00
              </text>
              {/* -5° Dive Tick */}
              <line x1="290" y1="210" x2="304" y2="210" strokeDasharray="3 3" />
              <line x1="336" y1="210" x2="350" y2="210" strokeDasharray="3 3" />
              {/* -10° Dive Ladder Rung & Label */}
              <path d="M 276,240 L 302,240 L 302,234 M 338,234 L 338,240 L 364,240" strokeDasharray="4 3" fill="none" />
              <text x="268" y="244" textAnchor="end" fontSize="10" fill={color} stroke="none" fontWeight="700">
                -10
              </text>
            </g>

            {/* Star Wars Fighter Targeting Acquisition Brackets */}
            <g data-part="target-brackets" stroke={color} strokeWidth="2.8" fill="none" opacity="0.95">
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
          </g>

          {/* Corner Framing Markers (Rectangular Canopy Bounds) */}
          <g data-part="corner-markers" stroke="#475569" strokeWidth="2" fill="none" opacity="0.65">
            <path d="M 120,60 L 80,60 L 80,100" />
            <path d="M 520,60 L 560,60 L 560,100" />
            <path d="M 120,300 L 80,300 L 80,260" />
            <path d="M 520,300 L 560,300 L 560,260" />
          </g>

          {/* Cockpit HUD Dynamic Telemetry Metrics */}
          <g
            data-part="telemetry"
            fill={color}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              userSelect: 'none',
            }}
            opacity="0.85"
          >
            {/* Top Left: Nav Heading & Pitch Angle */}
            <text data-part="telemetry-heading" x="90" y="48" textAnchor="start">
              HDG 082° // SYS: ONLINE
            </text>
            <text data-part="telemetry-pitch" x="90" y="62" textAnchor="start">
              PCH +00.0° // ELEV: LVL
            </text>

            {/* Top Right: Dynamic Azimuth & Sublight Velocity / Thrust */}
            <text data-part="telemetry-azimuth" x="550" y="48" textAnchor="end">
              AZM +024.0° // VEC: R-PAN
            </text>
            <text data-part="telemetry-velocity" x="550" y="62" textAnchor="end">
              VEL 1.10c // THR 65%
            </text>

            {/* Mid Right: Real-time G-Force Acceleration Sensor */}
            <text data-part="telemetry-gforce" x="550" y="184" textAnchor="end" fill="#94a3b8">
              ACC +1.0G
            </text>

            {/* Bottom Left: Dynamic Rangefinder & Radar Sensor State */}
            <text data-part="telemetry-range" x="90" y="306" textAnchor="start">
              RNG 0940m // TGT DIST
            </text>
            <text data-part="telemetry-sensor" x="90" y="320" textAnchor="start" fill="#64748b">
              RADAR: ACQUIRED // 4-B
            </text>

            {/* Bottom Right: Target Acquisition Lock & Flight Computer */}
            <text data-part="telemetry-lock" x="550" y="306" textAnchor="end">
              TGT LOCK: ACQUIRED
            </text>
            <text data-part="telemetry-status" x="550" y="320" textAnchor="end" fill="#64748b">
              AUTO-TRIM: ENGAGED
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
