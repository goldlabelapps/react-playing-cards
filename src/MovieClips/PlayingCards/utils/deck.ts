import type { CardData } from '../types';

export const getShuffledDeck = (): CardData[] => {
  function shuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const deck: CardData[] = [];
  const suits = ['S', 'H', 'C', 'D'];

  for (const suit of suits) {
    for (let i = 1; i < 14; i++) {
      let rank: string = `${i}`;
      if (i === 1) rank = 'A';
      if (i === 11) rank = 'J';
      if (i === 12) rank = 'Q';
      if (i === 13) rank = 'K';
      deck.push({
        id: `${suit}_${rank}`,
        suit,
        rank,
      });
    }
  }

  return shuffle(deck);
};
