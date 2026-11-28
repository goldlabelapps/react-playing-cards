import type { CSSProperties } from 'react';

export type PokerDiceFace = 'A' | 'K' | 'Q' | 'J' | '10' | '9';

export interface PokerDiceProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  soundEnabled?: boolean;
}
