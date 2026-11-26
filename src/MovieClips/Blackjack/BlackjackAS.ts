'use client';

import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../../types';

export function blackjackActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions): gsap.core.Timeline {
  const root =
    (target.querySelector('[data-blackjack-mc="true"]') as HTMLElement) || target;

  const cards = root.querySelectorAll<HTMLElement>('[data-blackjack-card="true"]');
  const targetCardInner = root.querySelector<HTMLElement>('[data-blackjack-card-inner="true"]');
  const badge = root.querySelector<HTMLElement>('[data-blackjack-badge="true"]');
  const title = root.querySelector<HTMLElement>('[data-blackjack-title="true"]');

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: 1.5,
    onComplete,
  });

  tl.timeScale(speed);

  // Initial setup: hide card and badge
  gsap.set(cards, {
    opacity: 0,
    scale: 0.4,
    y: -80,
    transformOrigin: 'center center',
  });

  // Set the dynamic card inner element to initial face-down rotation (180deg)
  if (targetCardInner) {
    gsap.set(targetCardInner, {
      rotationY: 180,
      transformOrigin: 'center center',
    });
  }

  if (badge) {
    gsap.set(badge, { opacity: 0, scale: 0, y: 10 });
  }

  if (title) {
    gsap.set(title, { opacity: 0, y: -10 });
    tl.to(title, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0);
  }

  // Deal single card to front & center
  if (cards[0]) {
    tl.to(
      cards[0],
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.2)',
      },
      0.3,
    );
  }

  // FLIP OVER THE DYNAMIC USER-SELECTED CARD (180deg -> 0deg)
  if (targetCardInner) {
    tl.to(
      targetCardInner,
      {
        rotationY: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      0.7,
    );
  }

  // Reveal score / demo badge
  if (badge) {
    tl.to(
      badge,
      {
        opacity: 1,
        scale: 1.15,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      },
      1.3,
    ).to(
      badge,
      {
        scale: 1,
        duration: 0.2,
        ease: 'power1.out',
      },
      1.7,
    );
  }

  return tl;
}

export default blackjackActionScript;
