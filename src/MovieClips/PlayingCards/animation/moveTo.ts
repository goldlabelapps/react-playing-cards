import { gsap } from 'gsap';

const duration = 1;

const initCard = (card: string | Element) => {
  return gsap.set(card, {
    opacity: 1,
    scale: 0.25,
    rotation: -30,
    x: -100,
    y: -150,
  });
};

const muckCard = (card: string | Element, callback?: () => void) => {
  return gsap.to(card, {
    duration: 1 * duration,
    scale: 0.25,
    rotation: -30,
    x: -150,
    y: -200,
    onComplete: callback,
  });
};

const dealRiverFirst = (card: string | Element) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: 155,
    y: -75,
    scale: 0.33,
  });
};

const dealRiverSecond = (card: string | Element, callback?: () => void) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: 225,
    y: -75,
    scale: 0.33,
    onComplete: callback,
  });
};

const dealFlopThird = (card: string | Element, callback?: () => void) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: 85,
    y: -75,
    scale: 0.33,
    onComplete: callback,
  });
};

const dealFlopSecond = (card: string | Element) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: 15,
    y: -75,
    scale: 0.33,
  });
};

const dealFlopFirst = (card: string | Element) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: -55,
    y: -75,
    scale: 0.33,
  });
};

const makeVisible = (card: string | Element) => {
  return gsap.set(card, {
    opacity: 1,
  });
};

const dealFirst = (card: string | Element) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: -10,
    y: 110,
    scale: 0.8,
  });
};

const dealSecond = (card: string | Element, callback?: () => void) => {
  return gsap.to(card, {
    rotation: 0,
    duration: 1 * duration,
    x: 160,
    y: 110,
    scale: 0.8,
    onComplete: callback,
  });
};

const placeInDeck = (card: string | Element) => {
  return gsap.set(card, {
    scale: 0.25,
    x: -75,
    y: -100,
  });
};

const dealFirstCard = (card: string | Element, callback?: () => void) => {
  return gsap.to(card, {
    duration: 0.5 * duration,
    x: 275,
    y: 165,
    scale: 0.75,
    onComplete: callback,
  });
};

export const moveTo = (animation: string, card: string | Element, callback?: () => void) => {
  switch (animation) {
    case 'makeVisible':
      return makeVisible(card);
    case 'dealSecond':
      return dealSecond(card, callback);
    case 'dealFirst':
      return dealFirst(card);
    case 'initCard':
      return initCard(card);
    case 'placeInDeck':
      return placeInDeck(card);
    case 'dealFirstCard':
      return dealFirstCard(card, callback);
    case 'dealFlopFirst':
      return dealFlopFirst(card);
    case 'dealFlopSecond':
      return dealFlopSecond(card);
    case 'dealFlopThird':
      return dealFlopThird(card, callback);
    case 'dealRiverFirst':
      return dealRiverFirst(card);
    case 'dealRiverSecond':
      return dealRiverSecond(card, callback);
    case 'muckCard':
      return muckCard(card, callback);
    default:
      return null;
  }
};
