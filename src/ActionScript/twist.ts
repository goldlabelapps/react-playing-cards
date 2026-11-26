import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export interface TwistOptions extends Partial<ActionScriptOptions> {
  /** Duration of an active nod motion in seconds (default: 0.4). */
  duration?: number;
  /** Pause duration in seconds between clockwise and counter-clockwise motions (default: 2.0). */
  waitDuration?: number;
  /** Max scale multiplier during the single grow phase (default: 1.03). */
  scaleMax?: number;
  /** Maximum rotation angle in degrees for the tilt (default: 2). */
  rotation?: number;
  /** Vertical travel distance during the peak phase in px (default: -1.5). */
  y?: number;
  /** Ease formula for the tweens (default: 'power2.out'). */
  ease?: string;
  /** Delay before animation begins in seconds (default: 0). */
  delay?: number;
}

/**
 * twistActionScript - ActionScript timeline factory driving a subtle, single grow/shrink tilt animation.
 * The choreography performs: clockwise nod (single grow/shrink) -> wait -> counter-clockwise nod (single grow/shrink) -> wait -> repeat.
 */
export function twistActionScript({
  target,
  duration = 0.4,
  waitDuration = 2.0,
  scaleMax = 1.03,
  rotation = 2,
  y = -1.5,
  speed = 1,
  loop = true,
  ease = 'power2.out',
  delay = 0,
  onComplete,
}: TwistOptions): gsap.core.Timeline | null {
  if (!target) return null;

  gsap.set(target, { transformOrigin: 'center center' });

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    delay,
    onComplete,
  });

  tl.timeScale(speed);

  const half = duration / 2;

  // 1. Clockwise nod with single subtle grow/shrink
  tl.to(target, {
    scale: scaleMax,
    rotation,
    y,
    duration: half,
    ease,
  })
    .to(target, {
      scale: 1,
      rotation: 0,
      y: 0,
      duration: half,
      ease: 'power2.inOut',
    })
    // 2. Wait
    .to({}, { duration: waitDuration })
    // 3. Counter-clockwise nod with single subtle grow/shrink
    .to(target, {
      scale: scaleMax,
      rotation: -rotation,
      y,
      duration: half,
      ease,
    })
    .to(target, {
      scale: 1,
      rotation: 0,
      y: 0,
      duration: half,
      ease: 'power2.inOut',
    })
    // 4. Wait
    .to({}, { duration: waitDuration });

  return tl;
}

/**
 * Functional ActionScript caller: twist(target, options)
 */
export function twist(
  target: HTMLElement | string | null,
  options?: TwistOptions,
): gsap.core.Timeline | null {
  if (!target) return null;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;

  return twistActionScript({
    target: el,
    ...options,
  });
}

export default twistActionScript;
