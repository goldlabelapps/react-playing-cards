import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function lightningActionScript({
  target,
  loop = true,
  onComplete,
  speed = 1,
}: ActionScriptOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: 0.5,
    onComplete,
  });

  tl.timeScale(speed);

  gsap.set(target, { opacity: 0.1, scale: 0.95, transformOrigin: 'center center' });

  tl.to(target, { opacity: 1, scale: 1.05, duration: 0.08, ease: 'rough' })
    .to(target, { opacity: 0.3, scale: 0.98, duration: 0.05 })
    .to(target, { opacity: 1, scale: 1.02, duration: 0.1 })
    .to(target, { opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.out' });

  return tl;
}

export default lightningActionScript;
