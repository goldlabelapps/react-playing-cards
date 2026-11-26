'use client';

export interface SpriteArtworkProps {
  direction?: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  frame?: number;
  size?: number;
  colors?: {
    shirt?: string;
    pants?: string;
    skin?: string;
  };
}

export function SpriteArtwork({
  direction = 'S',
  frame = 0,
  size = 64,
  colors = {},
}: SpriteArtworkProps) {
  const shirtColor = colors.shirt || '#3b82f6';
  const pantsColor = colors.pants || '#1e3a8a';
  const skinColor = colors.skin || '#fca5a5';

  // Calculate walking oscillation based on frame
  const bounce = (frame % 2) * 2;
  const legOffset = (frame % 4 - 1.5) * 4;

  const isFacingWest = direction.includes('W');
  const isFacingEast = direction.includes('E');
  const isFacingSide = isFacingEast || isFacingWest;
  const isFacingNorth = direction.includes('N');

  const transformScaleX = isFacingWest ? -1 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `scaleX(${transformScaleX}) translateY(${-bounce}px)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="16" ry="4" fill="rgba(0,0,0,0.25)" />

      {/* Left Leg / Back Leg */}
      <rect
        x={isFacingSide ? 26 + legOffset : 24 + legOffset}
        y="42"
        width="6"
        height="14"
        rx="2"
        fill={pantsColor}
      />

      {/* Right Leg / Front Leg */}
      <rect
        x={isFacingSide ? 32 - legOffset : 34 - legOffset}
        y="42"
        width="6"
        height="14"
        rx="2"
        fill={pantsColor}
      />

      {/* Torso / Shirt */}
      <rect
        x={isFacingSide ? 22 : 20}
        y="24"
        width={isFacingSide ? 20 : 24}
        height="20"
        rx="4"
        fill={shirtColor}
      />

      {/* Back Arm (for side profile) or Left Arm (front) */}
      {!isFacingSide && (
        <rect
          x={14 - legOffset * 0.5}
          y="24"
          width="5"
          height="16"
          rx="2"
          fill={skinColor}
        />
      )}

      {/* Front / Main Arm */}
      <rect
        x={isFacingSide ? 30 + legOffset * 0.5 : 45 + legOffset * 0.5}
        y="24"
        width="5"
        height="16"
        rx="2"
        fill={skinColor}
      />

      {/* Head */}
      <rect
        x={isFacingSide ? 24 : 22}
        y="6"
        width="20"
        height="18"
        rx="4"
        fill={skinColor}
      />

      {/* Cap / Hair visor peak when facing side (East / West) */}
      {isFacingSide && (
        <rect x="38" y="6" width="6" height="4" rx="1" fill={shirtColor} />
      )}

      {/* Eyes */}
      {!isFacingNorth && (
        <>
          {isFacingSide ? (
            /* Profile Eyes: Shifted towards the front (right) edge */
            <>
              <rect x="36" y="12" width="3" height="4" fill="#0f172a" />
              <rect x="41" y="12" width="2" height="3" fill="#0f172a" opacity="0.6" />
            </>
          ) : (
            /* Front Facing Eyes (South) */
            <>
              <rect x="26" y="12" width="3" height="4" fill="#0f172a" />
              <rect x="35" y="12" width="3" height="4" fill="#0f172a" />
            </>
          )}
        </>
      )}
    </svg>
  );
}

export default SpriteArtwork;
