import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { MACROMEDIA_FLASH_PATH } from '../StarWars/constants';
import {
  appleTheme,
  Button as AppleButton,
  playSproingHover,
  playSproingPress,
  playSproingRest,
} from '../../themes/apple';
import {
  buildCornerBevelPaths,
  DEFAULT_CAMERA,
  FACE_TARGET_ROTATIONS,
  getFrontMostFace,
  projectCube,
  shadeHexColor,
} from './cubeEngine';
import { FaceArtwork } from './FaceArtwork';
import type {
  CubeFaceId,
  DiceFaceMap,
  DiceFaceValue,
  PokerDiceHandle,
  PokerDiceProps,
  RollOptions,
  Rotation3D,
} from './types';

export type {
  Camera3D,
  CubeFaceId,
  CustomFaceConfig,
  DiceFaceMap,
  DiceFaceValue,
  FaceRenderContext,
  PokerDiceFace,
  PokerDiceHandle,
  PokerDiceProps,
  ProjectedFace,
  RollOptions,
  Rotation3D,
  Vec2,
  Vec3,
} from './types';

export const DEFAULT_POKER_FACES: DiceFaceMap = {
  front: 'A',
  right: 'K',
  top: 'Q',
  left: 'J',
  bottom: '10',
  back: '9',
};

export const STANDARD_PIP_FACES: DiceFaceMap = {
  front: 1,
  back: 6,
  right: 2,
  left: 5,
  top: 3,
  bottom: 4,
};

const ALL_FACE_IDS: readonly CubeFaceId[] = [
  'front',
  'right',
  'top',
  'left',
  'bottom',
  'back',
];

interface EngineState extends Rotation3D {
  liftY: number;
  scale: number;
}

const VIEWBOX_SIZE = 320;
const HALF_CUBE_SIZE = 58;

/**
 * PokerDice 3D MovieClip
 *
 * Driven by a lightweight, zero-dependency JavaScript 3D cube projection engine
 * and GSAP animation timelines. Renders pure SVG with perspective projection,
 * back-face culling, painter's algorithm depth sorting, and directional lighting.
 */
export const PokerDice = forwardRef<PokerDiceHandle, PokerDiceProps>(
  function PokerDice(
    {
      size = 320,
      width = '100%',
      height = '100%',
      className,
      style,
      color = '#FFFFFF',
      pipColor,
      strokeColor,
      cornerRadius = 12,
      faces,
      initialRotation,
      rotation,
      focalLength = DEFAULT_CAMERA.focalLength,
      cameraDistance = DEFAULT_CAMERA.distance,
      autoSpin = true,
      interactive = true,
      showControls = true,
      onRollComplete,
      onFaceChange,
      onHomeFocusChange,
      onComplete,
    },
    ref,
  ) {
    const [facePreset, setFacePreset] = useState<'poker' | 'pips'>('poker');
    const [isAutoSpinning, setIsAutoSpinning] = useState(autoSpin);
    const [controlsOpen, setControlsOpen] = useState(false);
    const [triggerHovered, setTriggerHovered] = useState(false);
    const [rollHovered, setRollHovered] = useState(false);
    const [focusTarget, setFocusTarget] = useState<'home' | 'settings' | 'roll'>('roll');

    const popoverRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const iconSvgRef = useRef<SVGSVGElement | null>(null);

    const activeFaces: DiceFaceMap = useMemo(() => {
      const base = facePreset === 'poker' ? DEFAULT_POKER_FACES : STANDARD_PIP_FACES;
      return { ...base, ...faces };
    }, [facePreset, faces]);

    const engineStateRef = useRef<EngineState>({
      rx: initialRotation?.rx ?? -24,
      ry: initialRotation?.ry ?? 34,
      rz: initialRotation?.rz ?? 0,
      liftY: 0,
      scale: 1,
    });

    const [renderState, setRenderState] = useState<EngineState>(() => ({
      ...engineStateRef.current,
    }));

    const activeTweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
    const dragRef = useRef<{
      active: boolean;
      pointerId: number;
      lastX: number;
      lastY: number;
    }>({
      active: false,
      pointerId: -1,
      lastX: 0,
      lastY: 0,
    });

    const lastReportedFaceRef = useRef<CubeFaceId>(
      getFrontMostFace(engineStateRef.current),
    );

    const syncRender = useCallback(() => {
      const current = { ...engineStateRef.current };
      setRenderState(current);

      const frontFace = getFrontMostFace(current);
      if (frontFace !== lastReportedFaceRef.current) {
        lastReportedFaceRef.current = frontFace;
        onFaceChange?.(frontFace);
      }
    }, [onFaceChange]);

    const stopMotion = useCallback(() => {
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
        activeTweenRef.current = null;
      }
    }, []);

    const spinTo = useCallback(
      (target: Partial<Rotation3D>, duration = 0.75) => {
        stopMotion();
        setIsAutoSpinning(false);
        const state = engineStateRef.current;

        activeTweenRef.current = gsap.to(state, {
          rx: target.rx ?? state.rx,
          ry: target.ry ?? state.ry,
          rz: target.rz ?? state.rz,
          liftY: 0,
          scale: 1,
          duration,
          ease: 'power3.out',
          onUpdate: syncRender,
        });
      },
      [stopMotion, syncRender],
    );

    const spinAxis = useCallback(
      (axis: 'x' | 'y' | 'z', degrees = 90, duration = 0.55) => {
        stopMotion();
        setIsAutoSpinning(false);
        const state = engineStateRef.current;
        const prop = axis === 'x' ? 'rx' : axis === 'y' ? 'ry' : 'rz';

        activeTweenRef.current = gsap.to(state, {
          [prop]: state[prop] + degrees,
          duration,
          ease: 'power2.inOut',
          onUpdate: syncRender,
        });
      },
      [stopMotion, syncRender],
    );

    const rollToFace = useCallback(
      (faceId: CubeFaceId, options?: RollOptions) => {
        stopMotion();
        setIsAutoSpinning(false);

        const duration = options?.duration ?? 1.15;
        const spins = options?.spins ?? 2;
        const target = FACE_TARGET_ROTATIONS[faceId];
        const state = engineStateRef.current;

        // Add full 360-degree turns so the die tumbles vigorously before landing
        const currentCyclesX = Math.round(state.rx / 360);
        const currentCyclesY = Math.round(state.ry / 360);
        const currentCyclesZ = Math.round(state.rz / 360);

        const targetRx = (currentCyclesX + spins) * 360 + target.rx;
        const targetRy = (currentCyclesY + spins) * 360 + target.ry;
        const targetRz = (currentCyclesZ + (spins > 0 ? 1 : 0)) * 360 + target.rz;

        const tl = gsap.timeline({
          onUpdate: syncRender,
          onComplete: () => {
            onRollComplete?.(faceId, activeFaces[faceId]);
          },
        });

        // Rotation across all three axes
        tl.to(
          state,
          {
            rx: targetRx,
            ry: targetRy,
            rz: targetRz,
            duration,
            ease: 'power3.out',
          },
          0,
        );

        // Parabolic lift and landing bounce
        tl.to(
          state,
          {
            liftY: -36,
            scale: 1.08,
            duration: duration * 0.42,
            ease: 'power2.out',
          },
          0,
        ).to(
          state,
          {
            liftY: 0,
            scale: 1,
            duration: duration * 0.58,
            ease: 'bounce.out',
          },
          duration * 0.42,
        );

        activeTweenRef.current = tl;
      },
      [activeFaces, onRollComplete, stopMotion, syncRender],
    );

    const roll = useCallback(
      (options?: RollOptions): CubeFaceId => {
        const randomFace =
          ALL_FACE_IDS[Math.floor(Math.random() * ALL_FACE_IDS.length)];
        rollToFace(randomFace, options);
        return randomFace;
      },
      [rollToFace],
    );

    useImperativeHandle(
      ref,
      () => ({
        spinTo,
        spinAxis,
        roll,
        rollToFace,
        getRotation: () => ({
          rx: engineStateRef.current.rx,
          ry: engineStateRef.current.ry,
          rz: engineStateRef.current.rz,
        }),
        stop: stopMotion,
      }),
      [roll, rollToFace, spinAxis, spinTo, stopMotion],
    );

    // Controlled rotation prop updates via GSAP
    useEffect(() => {
      if (!rotation) {
        return;
      }
      spinTo(rotation, 0.4);
    }, [rotation?.rx, rotation?.ry, rotation?.rz, spinTo]);

    // Continuous 3-axis auto-spin powered by GSAP ticker
    useEffect(() => {
      if (!isAutoSpinning) {
        return;
      }
      stopMotion();

      const tick = (_time: number, deltaTime: number) => {
        const dt = Math.min(deltaTime, 50) / 1000;
        engineStateRef.current.rx += 32 * dt;
        engineStateRef.current.ry += 48 * dt;
        engineStateRef.current.rz += 18 * dt;
        syncRender();
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
      };
    }, [isAutoSpinning, stopMotion, syncRender]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        stopMotion();
      };
    }, [stopMotion]);

    // GSAP popover entrance and Macromedia clip rotation feedback
    useEffect(() => {
      if (iconSvgRef.current) {
        gsap.to(iconSvgRef.current, {
          rotation: controlsOpen ? 45 : 0,
          scale: controlsOpen ? 1.08 : 1,
          duration: 0.28,
          ease: 'back.out(1.7)',
        });
      }

      if (controlsOpen && popoverRef.current) {
        gsap.fromTo(
          popoverRef.current,
          { xPercent: -50, opacity: 0, y: 12, scale: 0.94 },
          { xPercent: -50, opacity: 1, y: 0, scale: 1, duration: 0.24, ease: 'power3.out' },
        );
      }
    }, [controlsOpen]);

    // Sync top Modern Flash HomeBtn selected state and Macromedia trigger sproing
    useEffect(() => {
      onHomeFocusChange?.(focusTarget === 'home');
      if (triggerRef.current) {
        if (focusTarget === 'settings') {
          playSproingHover(triggerRef.current);
        } else if (!triggerHovered) {
          playSproingRest(triggerRef.current);
        }
      }
    }, [focusTarget, onHomeFocusChange, triggerHovered]);

    useEffect(() => {
      return () => {
        onHomeFocusChange?.(false);
      };
    }, [onHomeFocusChange]);

    // Keyboard navigation: Roll die (initial) <- Macromedia settings <- Modern Flash (top)
    useEffect(() => {
      if (!showControls) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
          case 'Backspace': {
            event.preventDefault();
            if (controlsOpen) {
              setControlsOpen(false);
              setFocusTarget('settings');
              return;
            }
            if (event.key === 'Backspace' && focusTarget === 'home') {
              onComplete?.();
              return;
            }
            setFocusTarget((prev) =>
              prev === 'roll' ? 'settings' : prev === 'settings' ? 'home' : 'roll',
            );
            break;
          }
          case 'ArrowRight':
          case 'ArrowDown': {
            event.preventDefault();
            if (controlsOpen) {
              setControlsOpen(false);
            }
            setFocusTarget((prev) =>
              prev === 'home' ? 'settings' : prev === 'settings' ? 'roll' : 'home',
            );
            break;
          }
          case 'Enter':
          case ' ': {
            event.preventDefault();
            if (focusTarget === 'roll') {
              setControlsOpen(false);
              roll();
            } else if (focusTarget === 'settings') {
              setControlsOpen((prev) => !prev);
            } else if (focusTarget === 'home') {
              setControlsOpen(false);
              onComplete?.();
            }
            break;
          }
          case 'Escape': {
            event.preventDefault();
            if (controlsOpen) {
              setControlsOpen(false);
            } else {
              onComplete?.();
            }
            break;
          }
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [controlsOpen, focusTarget, onComplete, roll, showControls]);

    // Close popover on outside click
    useEffect(() => {
      if (!controlsOpen) {
        return;
      }

      const handleOutsidePointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (
          target &&
          !popoverRef.current?.contains(target) &&
          !triggerRef.current?.contains(target)
        ) {
          setControlsOpen(false);
        }
      };

      window.addEventListener('pointerdown', handleOutsidePointerDown);
      return () => {
        window.removeEventListener('pointerdown', handleOutsidePointerDown);
      };
    }, [controlsOpen]);

    // Pointer drag-to-orbit handler
    const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
      if (!interactive) {
        return;
      }
      stopMotion();
      setIsAutoSpinning(false);
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
      };
    };

    const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
      if (!dragRef.current.active) {
        return;
      }
      const dx = event.clientX - dragRef.current.lastX;
      const dy = event.clientY - dragRef.current.lastY;
      dragRef.current.lastX = event.clientX;
      dragRef.current.lastY = event.clientY;

      if (event.shiftKey) {
        engineStateRef.current.rz += dx * 0.7;
      } else {
        engineStateRef.current.ry -= dx * 0.65;
        engineStateRef.current.rx += dy * 0.65;
      }
      syncRender();
    };

    const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
      if (dragRef.current.active && dragRef.current.pointerId === event.pointerId) {
        dragRef.current.active = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }
    };

    const cornerRatio = Math.max(0, Math.min(0.28, (cornerRadius / 12) * 0.14));

    const projectedFaces = useMemo(
      () =>
        projectCube({
          halfSize: HALF_CUBE_SIZE * renderState.scale,
          rotation: renderState,
          camera: {
            focalLength,
            distance: cameraDistance,
            cx: VIEWBOX_SIZE / 2,
            cy: VIEWBOX_SIZE / 2 - 12,
          },
          offset: { x: 0, y: renderState.liftY, z: 0 },
          cornerRatio,
        }),
      [cameraDistance, cornerRatio, focalLength, renderState],
    );

    const cornerBevels = useMemo(
      () => buildCornerBevelPaths(projectedFaces, cornerRatio),
      [projectedFaces, cornerRatio],
    );

    const frontFaceId = useMemo(
      () => getFrontMostFace(renderState),
      [renderState],
    );

    const shadowScale = Math.max(0.65, 1 + renderState.liftY / 110);
    const shadowOpacity = Math.max(0.18, 0.36 + renderState.liftY / 160);

    const normalizeDeg = (deg: number) => {
      const mod = ((Math.round(deg) % 360) + 360) % 360;
      return `${mod}°`;
    };

    const facePillStyle = (isFront: boolean): React.CSSProperties => ({
      minHeight: '36px',
      padding: '6px 8px',
      borderRadius: appleTheme.radii.pill,
      border: isFront
        ? `1px solid ${appleTheme.palette.primary}`
        : '1px solid rgba(255, 255, 255, 0.16)',
      background: isFront
        ? appleTheme.palette.primary
        : appleTheme.palette.surfaceFrosted,
      color: isFront ? appleTheme.palette.textPrimary : '#FFFFFF',
      fontSize: '13px',
      fontWeight: appleTheme.typography.weights.bold,
      fontFamily: appleTheme.typography.fontFamily,
      letterSpacing: '-0.01em',
      cursor: 'pointer',
      boxShadow: isFront ? appleTheme.shadows.insetBevel : 'none',
    });

    return (
      <div
        className={`flash-poker-dice ${className ?? ''}`.trim()}
        role="region"
        aria-label="3D Poker Dice Engine"
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          boxSizing: 'border-box',
          userSelect: 'none',
          overflow: 'hidden',
          ...style,
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            role="img"
            aria-label={`3D die showing ${String(
              typeof activeFaces[frontFaceId] === 'object'
                ? activeFaces[frontFaceId].label ?? frontFaceId
                : activeFaces[frontFaceId],
            )}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              touchAction: 'none',
              cursor: interactive ? 'grab' : 'default',
              overflow: 'visible',
            }}
          >
          <defs>
            <radialGradient id="pokerDiceFloorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0F172A" stopOpacity={shadowOpacity} />
              <stop offset="65%" stopColor="#0F172A" stopOpacity={shadowOpacity * 0.4} />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dynamic ground contact shadow */}
          <ellipse
            cx={VIEWBOX_SIZE / 2}
            cy={VIEWBOX_SIZE - 40}
            rx={86 * shadowScale}
            ry={20 * shadowScale}
            fill="url(#pokerDiceFloorShadow)"
          />

          {/* Exact corner bevel patches for shared 2-face and 3-face junctions */}
          {cornerBevels.length > 0 && (
            <g>
              {cornerBevels.map((patch) => {
                const faceValue: DiceFaceValue = activeFaces[patch.primaryFaceId];
                const baseHex =
                  typeof faceValue === 'object' && faceValue.background
                    ? faceValue.background
                    : color;
                const bevelFill = shadeHexColor(
                  baseHex,
                  Math.max(0.38, patch.lightIntensity * 0.92),
                );

                return (
                  <path
                    key={patch.key}
                    d={patch.path}
                    fill={bevelFill}
                    stroke={bevelFill}
                    strokeWidth={0.75}
                    strokeLinejoin="round"
                  />
                );
              })}
            </g>
          )}

          {/* 3D projected rounded cube faces (back-to-front painter's order) */}
          <g>
            {projectedFaces.map((face) => {
              const faceValue: DiceFaceValue = activeFaces[face.id];
              const baseHex =
                typeof faceValue === 'object' && faceValue.background
                  ? faceValue.background
                  : color;
              const shadedFill = shadeHexColor(baseHex, face.lightIntensity);

              return (
                <g key={face.id}>
                  <path
                    d={face.roundedPath}
                    fill={shadedFill}
                    stroke={strokeColor ?? shadedFill}
                    strokeWidth={strokeColor ? 2.5 : 0.75}
                    strokeLinejoin="round"
                  />
                  <g transform={face.svgMatrix}>
                    <FaceArtwork
                      faceId={face.id}
                      value={faceValue}
                      lightIntensity={face.lightIntensity}
                      pipColor={pipColor}
                    />
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
        </div>

        {showControls && (
          <>
            {/* Apple frosted-glass controls popover centred above the Macromedia trigger */}
            {controlsOpen && (
              <div
                ref={popoverRef}
                role="dialog"
                aria-label="3D Poker Dice Controls"
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '108px',
                  zIndex: 25,
                  width: 'min(360px, calc(100vw - 32px))',
                  padding: appleTheme.spacing.md,
                  borderRadius: appleTheme.radii.lg,
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  background: 'rgba(29, 29, 31, 0.5)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: appleTheme.shadows.elevated,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  color: '#FFFFFF',
                  fontFamily: appleTheme.typography.fontFamily,
                }}
              >
                {/* Popover header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="160 32 192 164"
                      aria-hidden="true"
                    >
                      <path
                        d={MACROMEDIA_FLASH_PATH}
                        fill={appleTheme.palette.primary}
                        fillRule="nonzero"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: appleTheme.typography.sizes.sm,
                        fontWeight: appleTheme.typography.weights.bold,
                        letterSpacing: '-0.015em',
                      }}
                    >
                      3D Dice Controls
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setControlsOpen(false)}
                    aria-label="Close 3D Dice Controls"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: appleTheme.radii.pill,
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      background: appleTheme.palette.surfaceFrosted,
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: appleTheme.typography.weights.semibold,
                      lineHeight: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* 3-axis spin controls */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}
                >
                  <AppleButton
                    variant="secondary"
                    size="sm"
                    label="Spin X"
                    onClick={() => spinAxis('x', 90)}
                  />
                  <AppleButton
                    variant="secondary"
                    size="sm"
                    label="Spin Y"
                    onClick={() => spinAxis('y', 90)}
                  />
                  <AppleButton
                    variant="secondary"
                    size="sm"
                    label="Spin Z"
                    onClick={() => spinAxis('z', 90)}
                  />
                </div>

                {/* Mode toggles */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: !faces ? 'repeat(2, 1fr)' : '1fr',
                    gap: '8px',
                  }}
                >
                  <AppleButton
                    variant={isAutoSpinning ? 'primary' : 'secondary'}
                    size="sm"
                    label={isAutoSpinning ? 'Stop Spin' : 'Auto Spin'}
                    onClick={() => setIsAutoSpinning((prev) => !prev)}
                  />
                  {!faces && (
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      label={facePreset === 'poker' ? 'Pips (1-6)' : 'Poker (A-9)'}
                      onClick={() =>
                        setFacePreset((prev) => (prev === 'poker' ? 'pips' : 'poker'))
                      }
                    />
                  )}
                </div>

                {/* Direct face targeting pill buttons */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '6px',
                  }}
                >
                  {ALL_FACE_IDS.map((faceId) => {
                    const val = activeFaces[faceId];
                    const label =
                      typeof val === 'object' ? val.label ?? faceId : String(val);
                    const isFront = faceId === frontFaceId;

                    return (
                      <button
                        key={faceId}
                        type="button"
                        onClick={() => spinTo(FACE_TARGET_ROTATIONS[faceId], 0.65)}
                        aria-label={`Show ${faceId} face (${label})`}
                        style={facePillStyle(isFront)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Engine telemetry readout */}
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: appleTheme.typography.monoFontFamily,
                    color: 'rgba(255, 255, 255, 0.65)',
                    letterSpacing: '0.02em',
                    textAlign: 'center',
                  }}
                >
                  X: {normalizeDeg(renderState.rx)} | Y: {normalizeDeg(renderState.ry)} | Z:{' '}
                  {normalizeDeg(renderState.rz)} | Face: {frontFaceId.toUpperCase()}
                </div>
              </div>
            )}

            {/* Centred Macromedia settings button with Roll button to its right, raised above the bottom edge */}
            <div
              style={{
                flexShrink: 0,
                zIndex: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                paddingBottom: '40px',
              }}
            >
              <button
                ref={triggerRef}
                type="button"
                onClick={() => {
                  setFocusTarget('settings');
                  setControlsOpen((prev) => !prev);
                }}
                onMouseEnter={() => {
                  setTriggerHovered(true);
                  setFocusTarget('settings');
                  if (triggerRef.current) {
                    playSproingHover(triggerRef.current);
                  }
                }}
                onMouseLeave={() => {
                  setTriggerHovered(false);
                  if (triggerRef.current && focusTarget !== 'settings') {
                    playSproingRest(triggerRef.current);
                  }
                }}
                onPointerDown={() => {
                  if (triggerRef.current) {
                    playSproingPress(triggerRef.current);
                  }
                }}
                onPointerUp={() => {
                  if (triggerRef.current) {
                    playSproingRest(triggerRef.current);
                  }
                }}
                aria-label={controlsOpen ? 'Hide 3D Dice Controls' : 'Show 3D Dice Controls'}
                aria-expanded={controlsOpen}
                aria-haspopup="dialog"
                style={{
                  width: '48px',
                  height: '48px',
                  padding: '9px',
                  borderRadius: appleTheme.radii.pill,
                  border:
                    controlsOpen || triggerHovered || focusTarget === 'settings'
                      ? '1.5px solid rgba(255, 255, 255, 0.7)'
                      : '1.5px solid rgba(255, 255, 255, 0.28)',
                  background:
                    controlsOpen || triggerHovered || focusTarget === 'settings'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'transparent',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background 0.16s ease, border-color 0.16s ease',
                }}
              >
                <svg
                  ref={iconSvgRef}
                  width="26"
                  height="26"
                  viewBox="160 32 192 164"
                  aria-hidden="true"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d={MACROMEDIA_FLASH_PATH}
                    fill={
                      controlsOpen || triggerHovered || focusTarget === 'settings'
                        ? 'rgba(255, 255, 255, 0.92)'
                        : 'rgba(255, 255, 255, 0.65)'
                    }
                    fillRule="nonzero"
                  />
                </svg>
              </button>

              <AppleButton
                variant="outline"
                size="md"
                label="Roll"
                selected={focusTarget === 'roll'}
                style={{
                  background:
                    rollHovered || focusTarget === 'roll'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'transparent',
                  border:
                    rollHovered || focusTarget === 'roll'
                      ? '1.5px solid rgba(255, 255, 255, 0.7)'
                      : '1.5px solid rgba(255, 255, 255, 0.28)',
                  color:
                    rollHovered || focusTarget === 'roll'
                      ? 'rgba(255, 255, 255, 0.92)'
                      : 'rgba(255, 255, 255, 0.65)',
                  boxShadow: 'none',
                }}
                leadingIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
                  </svg>
                }
                onMouseEnter={() => {
                  setRollHovered(true);
                  setFocusTarget('roll');
                }}
                onMouseLeave={() => setRollHovered(false)}
                onClick={() => {
                  setFocusTarget('roll');
                  setControlsOpen(false);
                  roll();
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  },
);

export default PokerDice;
