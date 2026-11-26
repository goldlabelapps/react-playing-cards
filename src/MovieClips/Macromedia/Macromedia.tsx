import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { playLaserShootSound } from '../../Sound/fighterAudio';
import { MACROMEDIA_FLASH_PATH, FLASH_RAYS } from './constants';
import {
  BASE_FAR_STARS,
  BASE_MID_STARS,
  BASE_NEAR_STARS,
} from './starsData';

export interface MacromediaProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  showLogo?: boolean;
}

export function Macromedia({
  width = '100%',
  height = '100%',
  color = '#4C979C',
  className,
  style,
  showLogo = false,
}: MacromediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
  });
  const [hovered, setHovered] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
  });
  const [laserActive, setLaserActive] = useState(false);
  const fireTimeoutRef = useRef<number | null>(null);

  // Weapon fire trigger: shoots twin laser cannons towards the reticle crosshair
  const handleFire = useCallback(() => {
    playLaserShootSound();
    setLaserActive(true);

    if (containerRef.current) {
      const bracketLeft = containerRef.current.querySelector('[data-part="bracket-left"]');
      const bracketRight = containerRef.current.querySelector('[data-part="bracket-right"]');

      if (bracketLeft && bracketRight) {
        gsap.fromTo(
          [bracketLeft, bracketRight],
          { scale: 0.78 },
          { scale: 1, duration: 0.22, ease: 'back.out(2.5)' }
        );
      }
    }

    if (fireTimeoutRef.current) window.clearTimeout(fireTimeoutRef.current);
    fireTimeoutRef.current = window.setTimeout(() => {
      setLaserActive(false);
    }, 150);
  }, []);

  // Global keyboard input listener for Arrow keys, WASD, and Spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setKeys((k) => ({ ...k, space: true }));
        handleFire();
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        setKeys((k) => ({ ...k, up: true }));
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setKeys((k) => ({ ...k, down: true }));
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        setKeys((k) => ({ ...k, left: true }));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        setKeys((k) => ({ ...k, right: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setKeys((k) => ({ ...k, space: false }));
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        setKeys((k) => ({ ...k, up: false }));
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setKeys((k) => ({ ...k, down: false }));
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setKeys((k) => ({ ...k, left: false }));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setKeys((k) => ({ ...k, right: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleFire]);

  // Real-time interactive flight response: reticle banking, pitch ladder, and telemetry updates
  useEffect(() => {
    if (!containerRef.current) return;
    const reticleEl = containerRef.current.querySelector('[data-part="reticle"]');
    const pitchLadderEl = containerRef.current.querySelector('[data-part="pitch-ladder"]');
    const starfieldEl = containerRef.current.querySelector('[data-part="starfield-static"]');

    const telemetryPitch = containerRef.current.querySelector('[data-part="telemetry-pitch"]');
    const telemetryAzimuth = containerRef.current.querySelector('[data-part="telemetry-azimuth"]');
    const telemetryVelocity = containerRef.current.querySelector('[data-part="telemetry-velocity"]');
    const telemetryGforce = containerRef.current.querySelector('[data-part="telemetry-gforce"]');

    let targetX = 0;
    let targetRot = 0;
    let starfieldShiftX = 0;

    if (keys.left && !keys.right) {
      targetX = -26;
      targetRot = -7.5;
      starfieldShiftX = 14;
      if (telemetryAzimuth) telemetryAzimuth.textContent = 'AZM -018.5° // VEC: L-BANK';
    } else if (keys.right && !keys.left) {
      targetX = 26;
      targetRot = 7.5;
      starfieldShiftX = -14;
      if (telemetryAzimuth) telemetryAzimuth.textContent = 'AZM +018.5° // VEC: R-BANK';
    } else {
      if (telemetryAzimuth) telemetryAzimuth.textContent = 'AZM +000.0° // VEC: HOLD';
    }

    let targetY = 0;
    let ladderShiftY = 0;

    if (keys.up && !keys.down) {
      targetY = -18;
      ladderShiftY = 16;
      if (telemetryPitch) telemetryPitch.textContent = 'PCH +10.0° // ELEV: CLMB';
    } else if (keys.down && !keys.up) {
      targetY = 18;
      ladderShiftY = -16;
      if (telemetryPitch) telemetryPitch.textContent = 'PCH -10.0° // ELEV: DIVE';
    } else {
      if (telemetryPitch) telemetryPitch.textContent = 'PCH +00.0° // ELEV: LVL';
    }

    const isSteering = keys.left || keys.right || keys.up || keys.down;
    if (telemetryVelocity) {
      telemetryVelocity.textContent = isSteering ? 'VEL 0.65c // THR 45%' : 'VEL 0.00c // THR 0%';
    }
    if (telemetryGforce) {
      telemetryGforce.textContent = isSteering ? 'ACC +1.4G' : 'ACC +0.0G';
    }

    if (reticleEl) {
      gsap.to(reticleEl, {
        x: targetX,
        y: targetY,
        rotation: targetRot,
        duration: isSteering ? 0.22 : 0.35,
        ease: isSteering ? 'power2.out' : 'sine.out',
      });
    }

    if (pitchLadderEl) {
      gsap.to(pitchLadderEl, {
        y: ladderShiftY,
        duration: isSteering ? 0.22 : 0.35,
        ease: isSteering ? 'power2.out' : 'sine.out',
      });
    }

    if (starfieldEl) {
      gsap.to(starfieldEl, {
        x: starfieldShiftX,
        duration: isSteering ? 0.25 : 0.4,
        ease: isSteering ? 'power2.out' : 'sine.out',
      });
    }
  }, [keys]);

  // Directional button dynamic styling helper
  const getDirectionBtnStyle = (dir: 'up' | 'down' | 'left' | 'right'): CSSProperties => {
    const isPressed = keys[dir];
    const isHover = hovered[dir];

    return {
      pointerEvents: 'auto',
      minWidth: dir === 'up' || dir === 'down' ? 56 : 44,
      minHeight: 32,
      padding: '4px 8px',
      fontFamily: 'inherit',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: isPressed || isHover ? '#ffffff' : '#94a3b8',
      backgroundColor: isPressed
        ? '#15868F'
        : isHover
          ? 'rgba(30, 41, 59, 0.95)'
          : 'rgba(15, 23, 42, 0.85)',
      border: isPressed
        ? '2px solid #38bdf8'
        : isHover
          ? '2px solid #4C979C'
          : '2px solid #334155',
      boxShadow: isPressed
        ? '0 0 10px rgba(56, 189, 248, 0.7), inset 1px 1px 2px rgba(0,0,0,0.5)'
        : isHover
          ? '0 0 6px rgba(76, 151, 156, 0.4)'
          : '2px 2px 0px 0px #1e293b',
      transform: isPressed ? 'scale(0.92)' : 'scale(1)',
      borderRadius: 4,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      transition: 'background-color 0.08s, border-color 0.08s, box-shadow 0.08s, transform 0.08s',
    };
  };

  return (
    <div
      ref={containerRef}
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
      {/* 1. PARALLAX STARFIELD & COCKPIT VIGNETTE (FULL-BLEED COVER LAYER) */}
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
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Deep space radial vignette */}
          <radialGradient id="cockpitVignette" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0a1024" stopOpacity="0" />
            <stop offset="70%" stopColor="#040711" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020409" stopOpacity="0.85" />
          </radialGradient>

          {/* Near star glow filter */}
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. DEEP SPACE STARFIELD (STOPPED & AT REST) */}
        <g data-part="starfield-static">
          {/* Layer A: Distant Deep Space Stars */}
          <g data-part="stars-far">
            {BASE_FAR_STARS.map((star, idx) => (
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

          {/* Layer B: Mid-Field Stars */}
          <g data-part="stars-mid">
            {BASE_MID_STARS.map((star, idx) => (
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

          {/* Layer C: Near Stellar Objects with 4-Point Diffraction Spikes */}
          <g data-part="stars-near" filter="url(#starGlow)">
            {BASE_NEAR_STARS.map((star, idx) => (
              <g key={`near-${idx}`}>
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="#ffffff"
                  opacity={star.o}
                />
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
      </svg>

      {/* 2. RESPONSIVE COCKPIT HUD RETICLE & DYNAMIC TELEMETRY GAME FRAME (UNIFORM FIT) */}
      <svg
        viewBox="0 0 640 360"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
        aria-label="Starfighter Cockpit HUD & Dynamic Telemetry"
      >
        <defs>
          {/* Clip path for Macromedia Flash burst (when enabled) */}
          <clipPath id="macromediaLogoClip">
            <path d={MACROMEDIA_FLASH_PATH} />
          </clipPath>
        </defs>

        {/* 2. CENTRAL STARFIGHTER HUD RETICLE ASSEMBLY (CENTERED) */}
        <g data-part="hud-assembly">
          {/* Main Reticle Assembly scaled to half size (0.5x), Centered at 320, 180 */}
          <g
            data-part="reticle"
            style={{
              transform: 'scale(0.5)',
              transformOrigin: '320px 180px',
            }}
          >
            {/* Axis Alignment Crosshairs */}
            <g data-part="crosshairs" stroke={color} strokeWidth="2.0" opacity="0.75">
              <line x1="320" y1="40" x2="320" y2="76" />
              <line x1="320" y1="284" x2="320" y2="320" />
              <line x1="180" y1="180" x2="216" y2="180" />
              <line x1="424" y1="180" x2="460" y2="180" />
            </g>

            {/* Dynamic Pitch Ladder (Level at rest, centered at 320, 180) */}
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

            {/* Twin Laser Bolt Bursts (Active when firing) */}
            {laserActive && (
              <g data-part="laser-burst" pointerEvents="none">
                {/* Left primary laser bolt */}
                <line
                  x1="264"
                  y1="230"
                  x2="312"
                  y2="184"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.95"
                />
                <line
                  x1="264"
                  y1="230"
                  x2="312"
                  y2="184"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Right primary laser bolt */}
                <line
                  x1="376"
                  y1="230"
                  x2="328"
                  y2="184"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.95"
                />
                <line
                  x1="376"
                  y1="230"
                  x2="328"
                  y2="184"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Impact convergence flash */}
                <circle cx="320" cy="180" r="14" fill="#38bdf8" opacity="0.6" />
                <circle cx="320" cy="180" r="6" fill="#ffffff" opacity="0.95" />
              </g>
            )}

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

      {/* 3. TOP VIEWPORT HUD: First Two HUD Elements (Top-Left & Top-Right) */}
      <div
        data-part="hud-top"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '16px 20px',
          pointerEvents: 'none',
          boxSizing: 'border-box',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color,
          userSelect: 'none',
          zIndex: 10,
        }}
      >
        {/* First HUD Element (Top-Left): Nav Heading & Pitch Angle */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <svg
            data-part="corner-markers"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M 36,2 L 2,2 L 2,36" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
            <span data-part="telemetry-heading">HDG 082° // SYS: READY</span>
            <span data-part="telemetry-pitch">PCH +00.0° // ELEV: LVL</span>
          </div>
        </div>

        {/* Second HUD Element (Top-Right): Dynamic Azimuth & Sublight Velocity */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginTop: 2 }}>
            <span data-part="telemetry-azimuth">AZM +000.0° // VEC: HOLD</span>
            <span data-part="telemetry-velocity">VEL 0.00c // THR 0%</span>
          </div>
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M 0,2 L 34,2 L 34,36" />
          </svg>
        </div>
      </div>

      {/* MID-RIGHT VIEWPORT HUD: Real-time G-Force Sensor */}
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#94a3b8',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span data-part="telemetry-gforce">ACC +0.0G</span>
      </div>

      {/* 4. BOTTOM VIEWPORT HUD: Interactive Controls (Bottom-Left Spacebar & Bottom-Right Directional Cluster) */}
      <div
        data-part="hud-bottom"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '16px 20px',
          pointerEvents: 'none',
          boxSizing: 'border-box',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color,
          userSelect: 'none',
          zIndex: 10,
        }}
      >
        {/* Bottom-Left: Spacebar Shoot Control */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M 36,34 L 2,34 L 2,0" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Hidden telemetry hooks to maintain ActionScript / test contract */}
            <span data-part="telemetry-range" style={{ display: 'none' }}>RNG HOLD // STATIONARY</span>
            <span data-part="telemetry-sensor" style={{ display: 'none' }}>RADAR: ACQUIRED // 4-B</span>

            <button
              type="button"
              data-control="fire"
              onClick={handleFire}
              onMouseEnter={() => setHovered((prev) => ({ ...prev, space: true }))}
              onMouseLeave={() => setHovered((prev) => ({ ...prev, space: false }))}
              style={{
                pointerEvents: 'auto',
                minWidth: 150,
                minHeight: 38,
                padding: '6px 14px',
                fontFamily: 'inherit',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: keys.space || hovered.space ? '#ffffff' : '#e2e8f0',
                backgroundColor: keys.space
                  ? '#15868F'
                  : hovered.space
                    ? 'rgba(30, 41, 59, 0.95)'
                    : 'rgba(15, 23, 42, 0.85)',
                border: keys.space
                  ? '2px solid #38bdf8'
                  : hovered.space
                    ? '2px solid #4C979C'
                    : '2px solid #334155',
                boxShadow: keys.space
                  ? '0 0 14px rgba(56, 189, 248, 0.8), inset 1px 1px 2px rgba(0,0,0,0.5)'
                  : hovered.space
                    ? '0 0 8px rgba(76, 151, 156, 0.5)'
                    : '3px 3px 0px 0px #1e293b',
                transform: keys.space ? 'scale(0.95)' : 'scale(1)',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'background-color 0.08s, border-color 0.08s, box-shadow 0.08s, transform 0.08s',
              }}
              aria-label="Fire Lasers (Spacebar)"
            >
              <span style={{ fontSize: '14px', lineHeight: 1 }}>⎵</span>
              <span>SPACEBAR // FIRE</span>
            </button>
            <span style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.08em' }}>
              WEAPONS: DUAL PHOTON CANNONS
            </span>
          </div>
        </div>

        {/* Bottom-Right: 4 Directional Controls Cluster */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Hidden telemetry hooks to maintain ActionScript / test contract */}
            <span data-part="telemetry-lock" style={{ display: 'none' }}>TGT LOCK: STANDBY</span>
            <span data-part="telemetry-status" style={{ display: 'none' }}>AUTO-TRIM: REST</span>

            {/* Row 1: Up Key */}
            <button
              type="button"
              data-control="up"
              style={getDirectionBtnStyle('up')}
              onMouseEnter={() => setHovered((prev) => ({ ...prev, up: true }))}
              onMouseLeave={() => setHovered((prev) => ({ ...prev, up: false }))}
              onMouseDown={() => setKeys((prev) => ({ ...prev, up: true }))}
              onMouseUp={() => setKeys((prev) => ({ ...prev, up: false }))}
              onTouchStart={() => setKeys((prev) => ({ ...prev, up: true }))}
              onTouchEnd={() => setKeys((prev) => ({ ...prev, up: false }))}
              aria-label="Pitch Climb (Up Arrow)"
            >
              ▲ UP
            </button>

            {/* Row 2: Left, Down, Right Keys */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                data-control="left"
                style={getDirectionBtnStyle('left')}
                onMouseEnter={() => setHovered((prev) => ({ ...prev, left: true }))}
                onMouseLeave={() => setHovered((prev) => ({ ...prev, left: false }))}
                onMouseDown={() => setKeys((prev) => ({ ...prev, left: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, left: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, left: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, left: false }))}
                aria-label="Bank Port (Left Arrow)"
              >
                ◀ L
              </button>

              <button
                type="button"
                data-control="down"
                style={getDirectionBtnStyle('down')}
                onMouseEnter={() => setHovered((prev) => ({ ...prev, down: true }))}
                onMouseLeave={() => setHovered((prev) => ({ ...prev, down: false }))}
                onMouseDown={() => setKeys((prev) => ({ ...prev, down: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, down: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, down: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, down: false }))}
                aria-label="Pitch Dive (Down Arrow)"
              >
                ▼ DN
              </button>

              <button
                type="button"
                data-control="right"
                style={getDirectionBtnStyle('right')}
                onMouseEnter={() => setHovered((prev) => ({ ...prev, right: true }))}
                onMouseLeave={() => setHovered((prev) => ({ ...prev, right: false }))}
                onMouseDown={() => setKeys((prev) => ({ ...prev, right: true }))}
                onMouseUp={() => setKeys((prev) => ({ ...prev, right: false }))}
                onTouchStart={() => setKeys((prev) => ({ ...prev, right: true }))}
                onTouchEnd={() => setKeys((prev) => ({ ...prev, right: false }))}
                aria-label="Bank Starboard (Right Arrow)"
              >
                ▶ R
              </button>
            </div>

            <span style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.08em', marginTop: 2 }}>
              NAV: MANUAL VECTOR
            </span>
          </div>

          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M 0,34 L 34,34 L 34,0" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Macromedia;
