import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function pingpongActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  const stage = target.closest<HTMLElement>('[data-stage="true"]');
  const stageHeight = stage?.getBoundingClientRect().height || Number.parseFloat(stage?.style.height || '') || 200;
  const ball = target.firstElementChild as HTMLElement | null;
  const ballSize = ball?.getBoundingClientRect().height || Number.parseFloat(ball?.style.height || '') || 28;
  const top = -stageHeight / 2 + ballSize / 2;
  const floor = stageHeight / 2 - ballSize / 2;
  const bounceHeight = floor - top;

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  gsap.set(target, {
    x: 0,
    y: top,
    scale: 1,
    opacity: 1,
  });

  tl.to(target, {
    y: floor,
    duration: 1.1,
    ease: 'power2.in',
  })
    .to(target, {
      y: floor - bounceHeight * 0.52,
      duration: 0.42,
      ease: 'power2.out',
    })
    .to(target, {
      y: floor,
      duration: 0.34,
      ease: 'power2.in',
    })
    .to(target, {
      y: floor - bounceHeight * 0.25,
      duration: 0.28,
      ease: 'power2.out',
    })
    .to(target, {
      y: floor,
      duration: 0.23,
      ease: 'power2.in',
    })
    .to(target, {
      y: floor - bounceHeight * 0.1,
      duration: 0.18,
      ease: 'power2.out',
    })
    .to(target, {
      y: floor,
      duration: 0.16,
      ease: 'power2.in',
    });

  return tl;
}

export default pingpongActionScript;
