import type {
  Camera3D,
  CubeFaceId,
  ProjectedFace,
  Rotation3D,
  Vec2,
  Vec3,
} from './types';

export interface CubeFaceDefinition {
  id: CubeFaceId;
  center: Vec3;
  normal: Vec3;
  u: Vec3;
  v: Vec3;
}

const DEG_TO_RAD = Math.PI / 180;

/**
 * Right-handed coordinate system aligned with SVG screen space:
 * +X right, +Y down, +Z into the screen (away from the camera).
 * Camera sits at (0, 0, -distance) looking towards +Z.
 */
export const CUBE_FACE_DEFINITIONS: readonly CubeFaceDefinition[] = [
  {
    id: 'front',
    center: { x: 0, y: 0, z: -1 },
    normal: { x: 0, y: 0, z: -1 },
    u: { x: 1, y: 0, z: 0 },
    v: { x: 0, y: 1, z: 0 },
  },
  {
    id: 'back',
    center: { x: 0, y: 0, z: 1 },
    normal: { x: 0, y: 0, z: 1 },
    u: { x: -1, y: 0, z: 0 },
    v: { x: 0, y: 1, z: 0 },
  },
  {
    id: 'right',
    center: { x: 1, y: 0, z: 0 },
    normal: { x: 1, y: 0, z: 0 },
    u: { x: 0, y: 0, z: 1 },
    v: { x: 0, y: 1, z: 0 },
  },
  {
    id: 'left',
    center: { x: -1, y: 0, z: 0 },
    normal: { x: -1, y: 0, z: 0 },
    u: { x: 0, y: 0, z: -1 },
    v: { x: 0, y: 1, z: 0 },
  },
  {
    id: 'top',
    center: { x: 0, y: -1, z: 0 },
    normal: { x: 0, y: -1, z: 0 },
    u: { x: 1, y: 0, z: 0 },
    v: { x: 0, y: 0, z: -1 },
  },
  {
    id: 'bottom',
    center: { x: 0, y: 1, z: 0 },
    normal: { x: 0, y: 1, z: 0 },
    u: { x: 1, y: 0, z: 0 },
    v: { x: 0, y: 0, z: 1 },
  },
] as const;

/**
 * Exact Euler rotations (in degrees, Rz * Ry * Rx order) that orient each face
 * squarely towards the camera with its local up/down axis upright.
 */
export const FACE_TARGET_ROTATIONS: Record<CubeFaceId, Rotation3D> = {
  front: { rx: 0, ry: 0, rz: 0 },
  back: { rx: 0, ry: 180, rz: 0 },
  right: { rx: 0, ry: 90, rz: 0 },
  left: { rx: 0, ry: -90, rz: 0 },
  top: { rx: 90, ry: 0, rz: 0 },
  bottom: { rx: -90, ry: 0, rz: 0 },
};

export const DEFAULT_CAMERA: Camera3D = {
  focalLength: 520,
  distance: 420,
  cx: 160,
  cy: 160,
};

export const DEFAULT_LIGHT_DIR: Vec3 = normalizeVec3({
  x: -0.35,
  y: -0.55,
  z: -0.75,
});

export function addVec3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subVec3(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scaleVec3(v: Vec3, scalar: number): Vec3 {
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

export function dotVec3(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function normalizeVec3(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len === 0) {
    return { x: 0, y: 0, z: -1 };
  }
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

/**
 * Rotates a 3D vector around X, then Y, then Z (angles in degrees).
 */
export function rotateVec3(v: Vec3, rotation: Rotation3D): Vec3 {
  const radX = rotation.rx * DEG_TO_RAD;
  const radY = rotation.ry * DEG_TO_RAD;
  const radZ = rotation.rz * DEG_TO_RAD;

  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);
  const cosZ = Math.cos(radZ);
  const sinZ = Math.sin(radZ);

  // Rotate around X
  const y1 = v.y * cosX - v.z * sinX;
  const z1 = v.y * sinX + v.z * cosX;
  const x1 = v.x;

  // Rotate around Y
  const x2 = x1 * cosY + z1 * sinY;
  const z2 = -x1 * sinY + z1 * cosY;
  const y2 = y1;

  // Rotate around Z
  const x3 = x2 * cosZ - y2 * sinZ;
  const y3 = x2 * sinZ + y2 * cosZ;
  const z3 = z2;

  return { x: x3, y: y3, z: z3 };
}

/**
 * Perspective projection from 3D space onto 2D SVG screen coordinates.
 */
export function projectPoint(point: Vec3, camera: Camera3D): Vec2 {
  const depth = Math.max(1, camera.distance + point.z);
  const factor = camera.focalLength / depth;
  return {
    x: camera.cx + point.x * factor,
    y: camera.cy + point.y * factor,
  };
}

export interface ProjectCubeOptions {
  halfSize: number;
  rotation: Rotation3D;
  camera?: Camera3D;
  lightDir?: Vec3;
  offset?: Vec3;
}

/**
 * Projects all 6 cube faces, performs true perspective back-face culling,
 * calculates directional lighting, and sorts visible faces back-to-front.
 */
export function projectCube({
  halfSize,
  rotation,
  camera = DEFAULT_CAMERA,
  lightDir = DEFAULT_LIGHT_DIR,
  offset = { x: 0, y: 0, z: 0 },
}: ProjectCubeOptions): ProjectedFace[] {
  const cameraPos: Vec3 = { x: 0, y: 0, z: -camera.distance };
  const projectedFaces: ProjectedFace[] = [];

  for (const face of CUBE_FACE_DEFINITIONS) {
    const normal = rotateVec3(face.normal, rotation);
    const u = rotateVec3(face.u, rotation);
    const v = rotateVec3(face.v, rotation);
    const worldCenter = addVec3(
      scaleVec3(rotateVec3(face.center, rotation), halfSize),
      offset,
    );

    // Perspective-accurate back-face culling: check if normal faces the camera
    const toCamera = subVec3(cameraPos, worldCenter);
    const visible = dotVec3(normal, toCamera) > 0;
    if (!visible) {
      continue;
    }

    const uHalf = scaleVec3(u, halfSize);
    const vHalf = scaleVec3(v, halfSize);

    // 4 face corners in local TL, TR, BR, BL order
    const tl3d = subVec3(subVec3(worldCenter, uHalf), vHalf);
    const tr3d = subVec3(addVec3(worldCenter, uHalf), vHalf);
    const br3d = addVec3(addVec3(worldCenter, uHalf), vHalf);
    const bl3d = addVec3(subVec3(worldCenter, uHalf), vHalf);

    const tl = projectPoint(tl3d, camera);
    const tr = projectPoint(tr3d, camera);
    const br = projectPoint(br3d, camera);
    const bl = projectPoint(bl3d, camera);

    const center2d = projectPoint(worldCenter, camera);
    const right2d = projectPoint(addVec3(worldCenter, uHalf), camera);
    const down2d = projectPoint(addVec3(worldCenter, vHalf), camera);

    // Compute affine SVG matrix mapping local 100x100 face space onto this quad
    const a = (right2d.x - center2d.x) / 50;
    const b = (right2d.y - center2d.y) / 50;
    const c = (down2d.x - center2d.x) / 50;
    const d = (down2d.y - center2d.y) / 50;
    const e = center2d.x - 50 * a - 50 * c;
    const f = center2d.y - 50 * b - 50 * d;

    const svgMatrix = `matrix(${a.toFixed(4)}, ${b.toFixed(4)}, ${c.toFixed(4)}, ${d.toFixed(4)}, ${e.toFixed(2)}, ${f.toFixed(2)})`;
    const pointsString = `${tl.x.toFixed(2)},${tl.y.toFixed(2)} ${tr.x.toFixed(2)},${tr.y.toFixed(2)} ${br.x.toFixed(2)},${br.y.toFixed(2)} ${bl.x.toFixed(2)},${bl.y.toFixed(2)}`;

    // Directional diffuse lighting clamped between ambient floor and full key light
    const rawDot = dotVec3(normal, lightDir);
    const lightIntensity = Math.max(0.45, Math.min(1, 0.58 + rawDot * 0.42));

    projectedFaces.push({
      id: face.id,
      corners: [tl, tr, br, bl],
      pointsString,
      center: center2d,
      depth: worldCenter.z,
      normal,
      lightIntensity,
      svgMatrix,
      visible: true,
    });
  }

  // Painter's algorithm: furthest Z drawn first, nearest Z drawn last
  projectedFaces.sort((f1, f2) => f2.depth - f1.depth);
  return projectedFaces;
}

/**
 * Returns the CubeFaceId currently pointing most directly towards the camera.
 */
export function getFrontMostFace(rotation: Rotation3D): CubeFaceId {
  let bestFace: CubeFaceId = 'front';
  let smallestZ = Infinity;

  for (const face of CUBE_FACE_DEFINITIONS) {
    const normal = rotateVec3(face.normal, rotation);
    if (normal.z < smallestZ) {
      smallestZ = normal.z;
      bestFace = face.id;
    }
  }

  return bestFace;
}

/**
 * Scales a hex colour by a directional lighting intensity factor.
 */
export function shadeHexColor(hex: string, intensity: number): string {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return hex;
  }

  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const r = clamp(parseInt(full.slice(0, 2), 16) * intensity);
  const g = clamp(parseInt(full.slice(2, 4), 16) * intensity);
  const b = clamp(parseInt(full.slice(4, 6), 16) * intensity);

  return `rgb(${r}, ${g}, ${b})`;
}
