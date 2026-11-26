import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export interface FlipInXOptions extends Partial<ActionScriptOptions> {
  /** Duration of the flip-in animation in seconds (default: 0.55). */
  duration?: number;
  /** 3D Perspective in pixels for the X-axis flip (default: 600). */
  perspective?: number;
  /** Initial rotation angle along the X axis in degrees (default: -90). */
  rotationX?: number;
  /** GSAP easing curve (default: 'back.out(1.5)'). */
  ease?: string;
  /** Delay before animation begins in seconds (default: 0). */
  delay?: number;
  /** Whether to repeat the flip with a reverse-then-enter spin cycle (default: false). */
  repeat?: boolean | number;
  /** Delay in seconds before repeating the spin animation (default: 3). */
  repeatDelay?: number;
  /** Duration of the reverse flip-out phase in seconds (default: 0.4). */
  reverseDuration?: number;
  /** Easing for the reverse flip-out phase (default: 'power2.in'). */
  reverseEase?: string;
}

/**
 * flipInXActionScript - ActionScript timeline factory animating a target in
 * from a full-width, zero-height starting posture that flips into view along the X-axis.
 * When `repeat` is enabled, introduces a delay (default: 3s), reverses the animation out,
 * and brings it back in to create an X-axis spin cycle.
 */
export function flipInXActionScript({
  target,
  duration = 0.55,
  perspective = 600,
  rotationX = -90,
  speed = 1,
  ease = 'back.out(1.5)',
  delay = 0,
  repeat = false,
  repeatDelay = 3,
  reverseDuration = 0.4,
  reverseEase = 'power2.in',
  onComplete,
}: FlipInXOptions): gsap.core.Timeline | null {
  if (!target) return null;

  gsap.set(target, {
    transformPerspective: perspective,
    transformOrigin: '50% 50%',
    scaleY: 0,
    scaleX: 1,
    rotationX,
    autoAlpha: 0,
  });

  const tl = gsap.timeline({
    delay,
    onComplete,
  });

  tl.timeScale(speed);

  tl.to(target, {
    scaleY: 1,
    scaleX: 1,
    rotationX: 0,
    autoAlpha: 1,
    duration,
    ease,
  });

  const repeatCount = typeof repeat === 'number' ? repeat : repeat ? -1 : 0;
  if (repeatCount !== 0) {
    const loopTl = gsap.timeline({
      repeat: repeatCount,
      repeatDelay,
    });

    // Reversing it first: fold out to zero height along X axis
    loopTl.to(target, {
      scaleY: 0,
      scaleX: 1,
      rotationX,
      autoAlpha: 0,
      duration: reverseDuration,
      ease: reverseEase,
    });

    // Bringing it back in: unfold to full height along X axis
    loopTl.to(target, {
      scaleY: 1,
      scaleX: 1,
      rotationX: 0,
      autoAlpha: 1,
      duration,
      ease,
    });

    tl.add(loopTl, `+=${repeatDelay}`);
  }

  return tl;
}

/**
 * Functional ActionScript caller: flipInX(target, options)
 */
export function flipInX(
  target: HTMLElement | string | null,
  options?: FlipInXOptions,
): gsap.core.Timeline | null {
  if (!target) return null;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;

  return flipInXActionScript({
    target: el,
    ...options,
  });
}

export default flipInXActionScript;
