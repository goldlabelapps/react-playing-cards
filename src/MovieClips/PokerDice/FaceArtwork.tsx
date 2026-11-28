import type { CubeFaceId, DiceFaceValue } from './types';

interface FaceArtworkProps {
  faceId: CubeFaceId;
  value: DiceFaceValue;
  lightIntensity: number;
  pipColor?: string;
}

const PIP_LAYOUTS: Record<1 | 2 | 3 | 4 | 5 | 6, ReadonlyArray<[number, number]>> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [26, 26],
    [50, 50],
    [74, 74],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [27, 27],
    [73, 27],
    [50, 50],
    [27, 73],
    [73, 73],
  ],
  6: [
    [28, 24],
    [72, 24],
    [28, 50],
    [72, 50],
    [28, 76],
    [72, 76],
  ],
};

const POKER_FACE_STYLE: Record<
  'A' | 'K' | 'Q' | 'J' | '10' | '9',
  { accent: string; suit: string; caption: string }
> = {
  A: { accent: '#DC2626', suit: '♠', caption: 'ACE' },
  K: { accent: '#B45309', suit: '♥', caption: 'KING' },
  Q: { accent: '#9333EA', suit: '♦', caption: 'QUEEN' },
  J: { accent: '#1D4ED8', suit: '♣', caption: 'JACK' },
  '10': { accent: '#0F172A', suit: '♠', caption: 'TEN' },
  '9': { accent: '#0F172A', suit: '♥', caption: 'NINE' },
};

/**
 * Renders the vector artwork for a single cube face inside a 100x100 local
 * coordinate system. The 3D engine projects this group onto the cube surface.
 */
export function FaceArtwork({
  faceId,
  value,
  lightIntensity,
  pipColor,
}: FaceArtworkProps) {
  // Custom face configuration object
  if (typeof value === 'object' && value !== null) {
    if (value.render) {
      return <>{value.render({ faceId, lightIntensity, pipColor: value.pipColor ?? pipColor })}</>;
    }

    const ink = value.color ?? pipColor ?? '#0F172A';
    return (
      <g>
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="10"
          fill="none"
          stroke={ink}
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        {value.label && (
          <text
            x="50"
            y={value.sublabel ? '54' : '61'}
            textAnchor="middle"
            fill={ink}
            fontSize={value.label.length > 3 ? '24' : '38'}
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {value.label}
          </text>
        )}
        {value.sublabel && (
          <text
            x="50"
            y="78"
            textAnchor="middle"
            fill={ink}
            fillOpacity="0.72"
            fontSize="12"
            fontWeight="700"
            letterSpacing="1.2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {value.sublabel}
          </text>
        )}
      </g>
    );
  }

  // Numeric standard die pips (1 to 6)
  if (typeof value === 'number') {
    const coords = PIP_LAYOUTS[value];
    const isAce = value === 1;
    const fill = pipColor ?? (isAce ? '#DC2626' : '#0F172A');
    const radius = isAce ? 13.5 : 8.5;

    return (
      <g>
        <rect
          x="7"
          y="7"
          width="86"
          height="86"
          rx="12"
          fill="none"
          stroke="#0F172A"
          strokeOpacity="0.1"
          strokeWidth="1.5"
        />
        {coords.map(([cx, cy], idx) => (
          <g key={idx}>
            <circle cx={cx} cy={cy} r={radius} fill={fill} />
            <circle
              cx={cx - radius * 0.25}
              cy={cy - radius * 0.25}
              r={radius * 0.26}
              fill="#FFFFFF"
              fillOpacity="0.28"
            />
          </g>
        ))}
      </g>
    );
  }

  // Classic Poker Dice ranks (A, K, Q, J, 10, 9)
  const meta = POKER_FACE_STYLE[value];
  const ink = pipColor ?? meta.accent;

  return (
    <g>
      {/* Subtle inner border frame */}
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="10"
        fill="none"
        stroke={ink}
        strokeOpacity="0.22"
        strokeWidth="2"
      />

      {/* Top-left and bottom-right corner suit pips */}
      <text
        x="18"
        y="26"
        textAnchor="middle"
        fill={ink}
        fontSize="15"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {meta.suit}
      </text>
      <text
        x="82"
        y="84"
        textAnchor="middle"
        fill={ink}
        fontSize="15"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {meta.suit}
      </text>

      {/* Primary rank glyph */}
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fill={ink}
        fontSize={value === '10' ? '38' : '44'}
        fontWeight="900"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        {value}
      </text>

      {/* Rank caption */}
      <text
        x="50"
        y="81"
        textAnchor="middle"
        fill={ink}
        fillOpacity="0.7"
        fontSize="10"
        fontWeight="700"
        letterSpacing="1.6"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {meta.caption}
      </text>
    </g>
  );
}
