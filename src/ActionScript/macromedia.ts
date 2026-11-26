import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function macromediaActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: loop ? 1.4 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  const aura = target.querySelector('[data-part="aura"]');
  const reticle = target.querySelector('[data-part="reticle"]');
  const ring = target.querySelector('[data-part="ring"]');
  const rays = target.querySelectorAll('[data-part^="ray-"]');
  const beam = target.querySelector('[data-part="beam"]');

  // Baseline initial state centered at Flash logo hub (256px, 114px)
  if (aura) gsap.set(aura, { opacity: 0, scale: 0.35, transformOrigin: '256px 114px' });
  if (reticle) gsap.set(reticle, { opacity: 0, scale: 1.25, transformOrigin: '256px 114px' });
  if (ring) gsap.set(ring, { opacity: 0, rotation: -140, transformOrigin: '256px 114px' });
  if (rays.length) {
    rays.forEach((ray, i) => {
      gsap.set(ray, {
        opacity: 0,
        scale: 0.15,
        rotation: (i % 2 === 0 ? -60 : 60),
        transformOrigin: '256px 114px',
      });
    });
  }
  if (beam) gsap.set(beam, { x: -120, opacity: 0 });

  // 1. Technical reticle and hub rings construct
  if (reticle) {
    tl.to(reticle, {
      opacity: 0.7,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0);
  }

  if (ring) {
    tl.to(ring, {
      opacity: 0.65,
      rotation: 0,
      duration: 0.85,
      ease: 'power3.out',
    }, 0.1);
  }

  if (aura) {
    tl.to(aura, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'power2.out',
    }, 0.2);
  }

  // 2. The 7 rays of the authentic 1990s Flash burst snap into position
  if (rays.length) {
    tl.to(rays, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      stagger: 0.045,
      ease: 'back.out(2.4)',
    }, 0.3);
  }

  // 3. High-energy beam sweep across the assembled Flash starburst
  if (beam) {
    tl.fromTo(
      beam,
      { x: -60, opacity: 0 },
      {
        x: 360,
        opacity: 0.9,
        duration: 0.75,
        ease: 'power2.inOut',
      },
      0.75,
    ).to(beam, { opacity: 0, duration: 0.15 }, 1.4);
  }

  return tl;
}

export default macromediaActionScript;
