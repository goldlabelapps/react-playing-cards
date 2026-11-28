import { Jack, King, Queen, Rank, Suit } from '../PlayingCards/graphics';
import type { CardSuit } from '../PlayingCards/types';
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

type PokerRank = 'A' | 'K' | 'Q' | 'J' | '10' | '9';

const POKER_FACE_META: Record<
  PokerRank,
  { accent: string; suit: CardSuit }
> = {
  A: { accent: '#111827', suit: 'S' },
  K: { accent: '#D9252A', suit: 'H' },
  Q: { accent: '#D9252A', suit: 'D' },
  J: { accent: '#111827', suit: 'C' },
  '10': { accent: '#111827', suit: 'S' },
  '9': { accent: '#D9252A', suit: 'H' },
};

const CARD_PIP_POSITIONS: Record<
  '9' | '10',
  ReadonlyArray<{ x: number; y: number; invert?: boolean }>
> = {
  '9': [
    { x: 32, y: 17 },
    { x: 56, y: 17 },
    { x: 32, y: 34 },
    { x: 56, y: 34 },
    { x: 44, y: 44 },
    { x: 32, y: 54, invert: true },
    { x: 56, y: 54, invert: true },
    { x: 32, y: 71, invert: true },
    { x: 56, y: 71, invert: true },
  ],
  '10': [
    { x: 31, y: 16 },
    { x: 57, y: 16 },
    { x: 44, y: 25 },
    { x: 31, y: 34 },
    { x: 57, y: 34 },
    { x: 31, y: 54, invert: true },
    { x: 57, y: 54, invert: true },
    { x: 44, y: 63, invert: true },
    { x: 31, y: 72, invert: true },
    { x: 57, y: 72, invert: true },
  ],
};

function SuitGlyph({
  suit,
  color,
  x,
  y,
  size,
  invert = false,
}: {
  suit: CardSuit;
  color: string;
  x: number;
  y: number;
  size: number;
  invert?: boolean;
}) {
  // The Spade path in PlayingCards/graphics/Suit.tsx points downwards; flip it upright.
  const shouldFlip = (suit === 'S') !== invert;
  const cx = x + size / 2;
  const cy = y + size / 2;

  return (
    <g transform={shouldFlip ? `rotate(180 ${cx} ${cy})` : undefined}>
      <Suit
        card={{ rank: 'A', suit, color }}
        x={x}
        y={y}
        width={size}
        height={size}
      />
    </g>
  );
}

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

  // Classic Poker Dice ranks (A, K, Q, J, 10, 9) using PlayingCards vector graphics
  const meta = POKER_FACE_META[value];
  const ink = pipColor ?? meta.accent;
  const cardData = { rank: value, suit: meta.suit, color: ink };

  return (
    <g>
      {/* Top-left rank & suit corner index */}
      <Rank card={cardData} x={10.5} y={10.5} width={10.5} height={16.5} />
      <SuitGlyph suit={meta.suit} color={ink} x={10.75} y={28.5} size={10} />

      {/* Bottom-right mirrored rank & suit corner index */}
      <g transform="rotate(180 50 50)">
        <Rank card={cardData} x={10.5} y={10.5} width={10.5} height={16.5} />
        <SuitGlyph suit={meta.suit} color={ink} x={10.75} y={28.5} size={10} />
      </g>

      {/* Centre artwork */}
      {value === 'A' && (
        <SuitGlyph suit={meta.suit} color={ink} x={24} y={24} size={52} />
      )}

      {(value === 'K' || value === 'Q' || value === 'J') && (
        <g>
          <rect
            x="25"
            y="14"
            width="50"
            height="72"
            rx="4"
            fill="#FFFFFF"
            fillOpacity="0.65"
            stroke={ink}
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          {value === 'K' && <King x={28} y={17} width={44} height={66} />}
          {value === 'Q' && <Queen x={27} y={18} width={46} height={64} />}
          {value === 'J' && <Jack x={27} y={18} width={46} height={64} />}
        </g>
      )}

      {(value === '9' || value === '10') && (
        <g>
          {CARD_PIP_POSITIONS[value].map((pip, idx) => (
            <SuitGlyph
              key={idx}
              suit={meta.suit}
              color={ink}
              x={pip.x}
              y={pip.y}
              size={12}
              invert={pip.invert}
            />
          ))}
        </g>
      )}
    </g>
  );
}
