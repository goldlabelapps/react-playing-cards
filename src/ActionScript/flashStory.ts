import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

/**
 * ActionScript choreography for FlashStory:
 * Coordinates the ambient stage presence for the FlashStory sequence.
 */
export function flashStoryActionScript({
  target,
  loop = true,
  onComplete,
  speed = 1,
}: ActionScriptOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  gsap.set(target, { transformOrigin: 'center center' });

  // Subtle ambient breathing for the stage
  tl.to(target, {
    opacity: 0.96,
    duration: 3,
    ease: 'sine.inOut',
  }).to(target, {
    opacity: 1,
    duration: 3,
    ease: 'sine.inOut',
  });

  return tl;
}

export default flashStoryActionScript;
