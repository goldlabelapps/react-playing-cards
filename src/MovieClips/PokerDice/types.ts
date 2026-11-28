import type { CSSProperties } from 'react';

export type PokerDiceFace = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | 1 | 2 | 3 | 4 | 5 | 6;

export interface PokerDiceProps {
  size?: number | string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  color?: string;
  pipColor?: string;
  soundEnabled?: boolean;
  statusMessage?: string;
  durationSeconds?: number;
  onComplete?: () => void;
}
