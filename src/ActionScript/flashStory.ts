import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

/**
 * ActionScript choreography for FlashStory:
 * Coordinates the electric surge, gentle hover floating, voltage micro-flickers,
 * and high-voltage pulsing of the iconic Flash lightning bolt.
 */
export function flashStoryActionScript({
  target,
  loop = true,
  onComplete,
  speed = 1,
}: ActionScriptOptions): gsap.core.Timeline {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: 0.2,
    onComplete,
  });

  tl.timeScale(speed);

  // Set initial coordinates
  gsap.set(target, { transformOrigin: 'center center' });

  // Floating bob with rhythmic electric surge and micro-flicker
  tl.to(target, {
    y: -8,
    scale: 1.02,
    duration: 1.4,
    ease: 'sine.inOut',
  })
    // Voltage twitch
    .to(target, {
      opacity: 0.85,
      scale: 0.99,
      duration: 0.05,
    })
    .to(target, {
      opacity: 1,
      scale: 1.04,
      duration: 0.08,
      ease: 'power2.out',
    })
    .to(target, {
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: 'sine.inOut',
    })
    // Second gentle floating crest
    .to(target, {
      y: 6,
      scale: 0.99,
      duration: 1.2,
      ease: 'sine.inOut',
    })
    .to(target, {
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'sine.inOut',
    });

  return tl;
}

export default flashStoryActionScript;
