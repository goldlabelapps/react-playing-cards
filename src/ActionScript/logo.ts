import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function logoActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  gsap.set(target, {
    autoAlpha: 0,
    y: 12,
    scale: 0.9,
  });

  tl.to(target, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    ease: 'power2.out',
  });

  return tl;
}

export default logoActionScript;
