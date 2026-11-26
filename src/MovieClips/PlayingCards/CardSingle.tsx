import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { flipCard } from './animation';
import { Base, CardBack, Rank, Suit } from './graphics';
import type { CardSingleProps, CardStatus } from './types';

const styles: Record<string, CSSProperties> = {
  cardContainer: {
    opacity: 0,
    width: 200,
    position: 'absolute',
  },
  back: {
    zIndex: 25,
  },
  base: {
    zIndex: 50,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  rank: {
    zIndex: 100,
    position: 'absolute',
    left: 20,
    top: 20,
    width: 60,
  },
  suit: {
    zIndex: 150,
    position: 'absolute',
    top: 8,
    right: 5,
    width: 120,
  },
};

export const CardSingle: React.FC<CardSingleProps> = ({
  id,
  card,
  initialState = 'face-down',
  className,
  style,
}) => {
  const [cardStatus, setCardStatus] = useState<CardStatus>(initialState);

  useEffect(() => {
    if (cardStatus === 'face-down') {
      flipCard('setToHidden', `#${id}-card-face`);
      flipCard('setToShown', `#${id}-card-back`);
    }
    if (cardStatus === 'turn-face-up') {
      flipCard('hide', `#${id}-card-back`, () => setCardStatus('show_face'));
    }
    if (cardStatus === 'show_face') {
      flipCard('show', `#${id}-card-face`, () => setCardStatus('finished'));
    }
  }, [cardStatus, id]);

  return (
    <div
      id={id}
      className={className}
      style={{ ...styles.cardContainer, ...style }}
    >
      <div id={`${id}-card-face`}>
        <Suit card={card} style={styles.suit} />
        <Rank card={card} style={styles.rank} />
        <Base card={card} style={styles.base} />
      </div>
      <CardBack
        style={styles.back}
        id={`${id}-card-back`}
        color={card.backColor}
      />
    </div>
  );
};

export default CardSingle;
