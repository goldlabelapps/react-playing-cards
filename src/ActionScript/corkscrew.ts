import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';
import { twist, type TwistOptions } from './twist';
import { flipInX, type FlipInXOptions } from './flip';

export type CorkScrewDirection = 'in' | 'out';

export interface CorkScrewOptions extends Partial<ActionScriptOptions> {
  /** Direction of the corkscrew: 'in' screws in and fades in, 'out' unscrews and fades out. */
  direction?: CorkScrewDirection;
  /** Duration of the animation in seconds (default: 1.2). */
  duration?: number;
  /** Number of complete 360-degree rotations (default: 2 = 720 deg). */
  rotations?: number;
  /** GSAP easing formula. */
  ease?: string;
  /** Delay before animation begins (default: 0). */
  delay?: number;
}

/**
 * corkscrewActionScript - ActionScript timeline factory driving a corkscrew animation.
 * The target spins along the Z-axis while scaling and adjusting opacity, mimicking
 * a screw threading in tightly or backing out smoothly.
 */
export function corkscrewActionScript({
  target,
  direction = 'in',
  duration = 1.2,
  rotations = 2,
  speed = 1,
  loop = false,
  onComplete,
  ease,
  delay = 0,
}: CorkScrewOptions) {
  if (!target) return null;

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  const totalDegrees = 360 * rotations;

  if (direction === 'in') {
    // Initial state: scaled down, transparent, spun backwards
    gsap.set(target, {
      autoAlpha: 0,
      scale: 0.2,
      rotation: -totalDegrees,
    });

    tl.to(target, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration,
      delay,
      ease: ease || 'power3.out',
    });
  } else {
    // Unscrew out: spinning forwards, scaling down, fading to transparent
    tl.to(target, {
      autoAlpha: 0,
      scale: 0.2,
      rotation: totalDegrees,
      duration,
      delay,
      ease: ease || 'power3.in',
    });
  }

  return tl;
}

/**
 * Functional ActionScript caller: corkScrew(target, 'in' | 'out', options)
 */
export function corkScrew(
  target: HTMLElement | string | null,
  direction: CorkScrewDirection = 'in',
  options?: Omit<CorkScrewOptions, 'target' | 'direction'>,
): gsap.core.Timeline | null {
  if (!target) return null;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;

  return corkscrewActionScript({
    target: el,
    direction,
    ...options,
  });
}

export const corkscrew = corkScrew;

export interface FadeOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  onComplete?: () => void;
  y?: number;
  scale?: number;
}

/**
 * MovieClip wrapper interface providing Flash-like method chaining:
 * moviName.corkScrew('in')
 * moviName.fadeOut()
 */
export interface MovieClipInstance {
  element: HTMLElement;
  corkScrew: (
    direction?: CorkScrewDirection,
    options?: Omit<CorkScrewOptions, 'target' | 'direction'>,
  ) => gsap.core.Timeline | null;
  corkscrew: (
    direction?: CorkScrewDirection,
    options?: Omit<CorkScrewOptions, 'target' | 'direction'>,
  ) => gsap.core.Timeline | null;
  fadeIn: (options?: FadeOptions | number) => gsap.core.Timeline | null;
  fadeOut: (options?: FadeOptions | number) => gsap.core.Timeline | null;
  twist: (options?: TwistOptions) => gsap.core.Timeline | null;
  flipInX: (options?: FlipInXOptions) => gsap.core.Timeline | null;
  play: () => void;
  pause: () => void;
  restart: () => void;
  timeline: gsap.core.Timeline | null;
}

/**
 * Wrap an HTMLElement into a Flash MovieClip instance supporting ActionScript methods.
 * Usage:
 *   const moviName = asMovieClip(logoRef.current);
 *   moviName.corkScrew('in');
 *   moviName.fadeOut(0.6);
 */
export function asMovieClip(target: HTMLElement | null): MovieClipInstance | null {
  if (!target) return null;

  let activeTl: gsap.core.Timeline | null = null;

  const instance: MovieClipInstance = {
    element: target,
    get timeline() {
      return activeTl;
    },
    corkScrew(direction = 'in', options) {
      activeTl?.kill();
      activeTl = corkScrew(target, direction, options);
      return activeTl;
    },
    corkscrew(direction = 'in', options) {
      return instance.corkScrew(direction, options);
    },
    fadeIn(opts) {
      activeTl?.kill();
      const resolved: FadeOptions = typeof opts === 'number' ? { duration: opts } : opts || {};
      const { duration = 0.8, delay = 0, ease = 'power2.out', onComplete, y, scale = 1 } = resolved;
      const tl = gsap.timeline({ onComplete });
      tl.fromTo(
        target,
        { autoAlpha: 0, y: y ?? 8, scale: scale * 0.95 },
        { autoAlpha: 1, y: 0, scale, duration, delay, ease },
      );
      activeTl = tl;
      return tl;
    },
    fadeOut(opts) {
      activeTl?.kill();
      const resolved: FadeOptions = typeof opts === 'number' ? { duration: opts } : opts || {};
      const { duration = 0.6, delay = 0, ease = 'power2.in', onComplete, y } = resolved;
      const tl = gsap.timeline({ onComplete });
      tl.to(
        target,
        { autoAlpha: 0, y: y ?? 0, duration, delay, ease },
      );
      activeTl = tl;
      return tl;
    },
    twist(options) {
      activeTl?.kill();
      activeTl = twist(target, options);
      return activeTl;
    },
    flipInX(options) {
      activeTl?.kill();
      activeTl = flipInX(target, options);
      return activeTl;
    },
    play() {
      activeTl?.play();
    },
    pause() {
      activeTl?.pause();
    },
    restart() {
      activeTl?.restart();
    },
  };

  return instance;
}

export default corkscrewActionScript;
