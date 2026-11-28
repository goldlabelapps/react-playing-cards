import type { CSSProperties, ReactNode } from 'react';

export type CubeFaceId = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

export type PokerDiceFace = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | 1 | 2 | 3 | 4 | 5 | 6;

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  rx: number;
  ry: number;
  rz: number;
}

export interface Camera3D {
  focalLength: number;
  distance: number;
  cx: number;
  cy: number;
}

export interface ProjectedFace {
  id: CubeFaceId;
  corners: [Vec2, Vec2, Vec2, Vec2];
  pointsString: string;
  center: Vec2;
  depth: number;
  normal: Vec3;
  lightIntensity: number;
  svgMatrix: string;
  visible: boolean;
}

export interface FaceRenderContext {
  faceId: CubeFaceId;
  lightIntensity: number;
  pipColor?: string;
}

export interface CustomFaceConfig {
  label?: string;
  sublabel?: string;
  color?: string;
  background?: string;
  pipColor?: string;
  render?: (context: FaceRenderContext) => ReactNode;
}

export type DiceFaceValue = PokerDiceFace | CustomFaceConfig;

export type DiceFaceMap = Record<CubeFaceId, DiceFaceValue>;

export interface RollOptions {
  duration?: number;
  spins?: number;
}

export interface PokerDiceHandle {
  spinTo: (rotation: Partial<Rotation3D>, duration?: number) => void;
  spinAxis: (axis: 'x' | 'y' | 'z', degrees?: number, duration?: number) => void;
  roll: (options?: RollOptions) => CubeFaceId;
  rollToFace: (faceId: CubeFaceId, options?: RollOptions) => void;
  getRotation: () => Rotation3D;
  stop: () => void;
}

export interface PokerDiceProps {
  size?: number | string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  color?: string;
  pipColor?: string;
  strokeColor?: string;
  faces?: Partial<DiceFaceMap>;
  initialRotation?: Partial<Rotation3D>;
  rotation?: Partial<Rotation3D>;
  focalLength?: number;
  cameraDistance?: number;
  autoSpin?: boolean;
  interactive?: boolean;
  showControls?: boolean;
  soundEnabled?: boolean;
  statusMessage?: string;
  durationSeconds?: number;
  onRollComplete?: (faceId: CubeFaceId, faceValue: DiceFaceValue) => void;
  onFaceChange?: (faceId: CubeFaceId) => void;
  onComplete?: () => void;
}
