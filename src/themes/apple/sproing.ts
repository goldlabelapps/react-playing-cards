import { gsap } from 'gsap';

/**
 * Calibration tokens for the AppleButton GSAP sproing animation.
 *
 * Uses squash-and-stretch spring physics driven by GSAP timelines rather than
 * ad-hoc CSS transitions or keyframes.
 */
export const SPROING_CONFIG = {
  hover: {
    squashDuration: 0.06,
    squashScaleX: 1.045,
    squashScaleY: 0.96,
    squashY: -1,
    reboundDuration: 0.42,
    targetScaleX: 1.025,
    targetScaleY: 1.025,
    targetY: -2,
    ease: 'elastic.out(1.25, 0.42)',
  },
  press: {
    duration: 0.07,
    scaleX: 1.04,
    scaleY: 0.92,
    y: 1,
    ease: 'power2.out',
  },
  activate: {
    squashDuration: 0.055,
    squashScaleX: 1.06,
    squashScaleY: 0.92,
    squashY: 1,
    reboundDuration: 0.48,
    ease: 'elastic.out(1.4, 0.35)',
  },
  rest: {
    duration: 0.26,
    ease: 'power3.out',
  },
} as const;

/**
 * Checks whether the user has requested reduced motion via system preferences.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Plays the rollover / selection sproing animation on an AppleButton element.
 */
export function playSproingHover(element: HTMLElement | null): gsap.core.Timeline | null {
  if (!element) return null;
  gsap.killTweensOf(element);

  if (prefersReducedMotion()) {
    gsap.set(element, { scaleX: 1, scaleY: 1, y: 0 });
    return null;
  }

  const { hover } = SPROING_CONFIG;
  const tl = gsap.timeline();
  tl.to(element, {
    scaleX: hover.squashScaleX,
    scaleY: hover.squashScaleY,
    y: hover.squashY,
    duration: hover.squashDuration,
    ease: 'power2.out',
    transformOrigin: 'center center',
  }).to(element, {
    scaleX: hover.targetScaleX,
    scaleY: hover.targetScaleY,
    y: hover.targetY,
    duration: hover.reboundDuration,
    ease: hover.ease,
    transformOrigin: 'center center',
  });

  return tl;
}

/**
 * Plays the tactile compression squash when a pointer or key presses the button down.
 */
export function playSproingPress(element: HTMLElement | null): gsap.core.Tween | null {
  if (!element) return null;
  gsap.killTweensOf(element);

  if (prefersReducedMotion()) {
    gsap.set(element, { scaleX: 1, scaleY: 1, y: 0 });
    return null;
  }

  const { press } = SPROING_CONFIG;
  return gsap.to(element, {
    scaleX: press.scaleX,
    scaleY: press.scaleY,
    y: press.y,
    duration: press.duration,
    ease: press.ease,
    transformOrigin: 'center center',
  });
}

/**
 * Plays the activation sproing rebound when the button is clicked or triggered.
 */
export function playSproingActivate(
  element: HTMLElement | null,
  settleHovered = false
): gsap.core.Timeline | null {
  if (!element) return null;
  gsap.killTweensOf(element);

  if (prefersReducedMotion()) {
    gsap.set(element, { scaleX: 1, scaleY: 1, y: 0 });
    return null;
  }

  const { activate, hover } = SPROING_CONFIG;
  const targetScaleX = settleHovered ? hover.targetScaleX : 1;
  const targetScaleY = settleHovered ? hover.targetScaleY : 1;
  const targetY = settleHovered ? hover.targetY : 0;

  const tl = gsap.timeline();
  tl.to(element, {
    scaleX: activate.squashScaleX,
    scaleY: activate.squashScaleY,
    y: activate.squashY,
    duration: activate.squashDuration,
    ease: 'power2.out',
    transformOrigin: 'center center',
  }).to(element, {
    scaleX: targetScaleX,
    scaleY: targetScaleY,
    y: targetY,
    duration: activate.reboundDuration,
    ease: activate.ease,
    transformOrigin: 'center center',
  });

  return tl;
}

/**
 * Returns the button smoothly to its neutral resting transform.
 */
export function playSproingRest(element: HTMLElement | null): gsap.core.Tween | null {
  if (!element) return null;
  gsap.killTweensOf(element);

  if (prefersReducedMotion()) {
    gsap.set(element, { scaleX: 1, scaleY: 1, y: 0 });
    return null;
  }

  const { rest } = SPROING_CONFIG;
  return gsap.to(element, {
    scaleX: 1,
    scaleY: 1,
    y: 0,
    duration: rest.duration,
    ease: rest.ease,
    transformOrigin: 'center center',
  });
}
