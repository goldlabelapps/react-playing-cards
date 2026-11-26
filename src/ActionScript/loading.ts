import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function loadingActionScript({
  target,
  loop = true,
  onComplete,
  speed = 1,
}: ActionScriptOptions): gsap.core.Timeline {
  const root = (target.querySelector('[data-loading-mc="true"]') as HTMLElement) || target;
  const core = root.querySelector('[data-loading-core="true"]');
  const aura = root.querySelector('[data-loading-aura="true"]');

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  if (core) {
    gsap.set(core, { scale: 1, transformOrigin: 'center center' });
    tl.to(
      core,
      {
        scale: 1.15,
        rotation: 360,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
      },
      0,
    );
  } else {
    // Default spinner rotation on target
    tl.to(target, {
      rotation: 360,
      duration: 1.5,
      ease: 'none',
      repeat: loop ? -1 : 0,
      transformOrigin: 'center center',
    });
  }

  if (aura) {
    tl.to(
      aura,
      {
        scale: 1.25,
        opacity: 0.9,
        duration: 1.8,
        ease: 'sine.inOut',
        yoyo: true,
      },
      0,
    );
  }

  return tl;
}

export default loadingActionScript;
