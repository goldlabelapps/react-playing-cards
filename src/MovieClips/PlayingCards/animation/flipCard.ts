import { gsap } from 'gsap';

const duration = 1;

const setToHidden = (target: string | Element) => {
  return gsap.set(target, {
    rotationY: 90,
  });
};

const setToShown = (target: string | Element) => {
  return gsap.set(target, {
    rotationY: 0,
  });
};

const hide = (target: string | Element, callback?: () => void) => {
  return gsap.to(target, {
    duration: 0.5 * duration,
    rotationY: -90,
    onComplete: callback,
  });
};

const show = (target: string | Element, callback?: () => void) => {
  return gsap.to(target, {
    duration: 0.5 * duration,
    rotationY: 0,
    onComplete: callback,
  });
};

export const flipCard = (animation: string, target: string | Element, callback?: () => void) => {
  switch (animation) {
    case 'setToShown':
      return setToShown(target);
    case 'setToHidden':
      return setToHidden(target);
    case 'hide':
      return hide(target, callback);
    case 'show':
      return show(target, callback);
    default:
      return null;
  }
};
