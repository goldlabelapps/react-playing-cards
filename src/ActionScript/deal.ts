import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function dealActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: 1,
    onComplete,
  });

  tl.timeScale(speed);

  gsap.set(target, {
    y: -300,
    x: 0,
    scale: 0.5,
    rotation: -25,
    opacity: 0,
    transformOrigin: 'center center',
  });

  tl.to(target, {
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: 0,
    duration: 0.8,
    ease: 'power3.out',
  })
    .to(target, {
      rotationY: 180,
      duration: 0.6,
      ease: 'power2.inOut',
    }, '+=0.2');

  return tl;
}

export default dealActionScript;
