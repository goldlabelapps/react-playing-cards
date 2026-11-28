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
import {
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
const HALF_CUBE_SIZE = 62;

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
      color = '#F8FAFC',
      pipColor,
      strokeColor = '#0F172A',
      faces,
      initialRotation,
      rotation,
      focalLength = DEFAULT_CAMERA.focalLength,
      cameraDistance = DEFAULT_CAMERA.distance,
      autoSpin = false,
      interactive = true,
      showControls = true,
      onRollComplete,
      onFaceChange,
    },
    ref,
  ) {
    const [facePreset, setFacePreset] = useState<'poker' | 'pips'>('poker');
    const [isAutoSpinning, setIsAutoSpinning] = useState(autoSpin);

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
        }),
      [cameraDistance, focalLength, renderState],
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

    const buttonBaseStyle: React.CSSProperties = {
      minHeight: '36px',
      padding: '6px 12px',
      borderRadius: '6px',
      border: '2px solid #2A2A2A',
      background: '#FFFFFF',
      color: '#0F172A',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '2px 2px 0px 0px #2A2A2A',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    };

    const primaryButtonStyle: React.CSSProperties = {
      ...buttonBaseStyle,
      minHeight: '44px',
      padding: '8px 18px',
      background: '#15868F',
      color: '#FFFFFF',
      fontSize: '13px',
      boxShadow: '3px 3px 0px 0px #2A2A2A',
    };

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
          justifyContent: 'center',
          gap: '12px',
          position: 'relative',
          userSelect: 'none',
          overflow: 'hidden',
          ...style,
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
            maxHeight: showControls ? '68%' : '100%',
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

          {/* 3D projected cube faces (back-to-front painter's order) */}
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
                  <polygon
                    points={face.pointsString}
                    fill={shadedFill}
                    stroke={strokeColor}
                    strokeWidth="3.5"
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

        {showControls && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '460px',
              padding: '0 12px',
            }}
          >
            {/* Primary roll & spin controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => roll()}
                style={primaryButtonStyle}
              >
                Roll Die
              </button>
              <button
                type="button"
                onClick={() => spinAxis('x', 90)}
                style={buttonBaseStyle}
              >
                Spin X
              </button>
              <button
                type="button"
                onClick={() => spinAxis('y', 90)}
                style={buttonBaseStyle}
              >
                Spin Y
              </button>
              <button
                type="button"
                onClick={() => spinAxis('z', 90)}
                style={buttonBaseStyle}
              >
                Spin Z
              </button>
              <button
                type="button"
                onClick={() => setIsAutoSpinning((prev) => !prev)}
                style={{
                  ...buttonBaseStyle,
                  background: isAutoSpinning ? '#0F172A' : '#FFFFFF',
                  color: isAutoSpinning ? '#FFFFFF' : '#0F172A',
                }}
              >
                {isAutoSpinning ? 'Stop Spin' : 'Auto Spin'}
              </button>
              {!faces && (
                <button
                  type="button"
                  onClick={() =>
                    setFacePreset((prev) => (prev === 'poker' ? 'pips' : 'poker'))
                  }
                  style={buttonBaseStyle}
                >
                  {facePreset === 'poker' ? 'Use Pips (1-6)' : 'Use Poker (A-9)'}
                </button>
              )}
            </div>

            {/* Direct face targeting buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
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
                    style={{
                      ...buttonBaseStyle,
                      minHeight: '32px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      background: isFront ? '#15868F' : '#F8FAFC',
                      color: isFront ? '#FFFFFF' : '#0F172A',
                    }}
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
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: '#94A3B8',
                letterSpacing: '0.3px',
              }}
            >
              X: {normalizeDeg(renderState.rx)} | Y: {normalizeDeg(renderState.ry)} | Z:{' '}
              {normalizeDeg(renderState.rz)} | Face: {frontFaceId.toUpperCase()} (drag to
              orbit, shift+drag for Z)
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default PokerDice;
