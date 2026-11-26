import type { CSSProperties, SVGProps } from 'react';

export type CardSuit = 'S' | 'D' | 'H' | 'C' | string;
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | string;

export interface CardData {
  id?: string;
  suit: CardSuit;
  rank: CardRank;
  color?: string;
  backColor?: string;
}

export interface CardGraphicProps extends SVGProps<SVGSVGElement> {
  card?: CardData;
  color?: string;
  suit?: string;
}

export type CardStatus = 'face-down' | 'turn-face-up' | 'show_face' | 'finished' | string;

export interface CardSingleProps {
  id: string;
  card: CardData;
  status?: CardStatus;
  initialState?: CardStatus;
  className?: string;
  style?: CSSProperties;
}
