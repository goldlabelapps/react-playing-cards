import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function spriteActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  const stage = target.closest<HTMLElement>('[data-stage="true"]');
  const stageWidth = stage?.getBoundingClientRect().width || Number.parseFloat(stage?.style.width || '') || 300;
  const spriteSize = 64;
  const startX = -stageWidth / 2 + spriteSize / 2;
  const endX = stageWidth / 2 - spriteSize / 2;

  const setSpriteState = (direction: string, moving: boolean) => {
    target.setAttribute('data-direction', direction);
    target.setAttribute('data-moving', String(moving));
  };

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
    onStart: () => setSpriteState('E', true),
    onRepeat: () => setSpriteState('E', true),
  });

  tl.timeScale(speed);

  gsap.set(target, {
    x: startX,
    y: 0,
    scale: 1,
    opacity: 1,
  });

  tl.call(() => setSpriteState('E', true))
    .to(target, {
      x: endX,
      duration: 3,
      ease: 'power1.inOut',
    })
    .call(() => setSpriteState('S', false))
    .to({}, { duration: 0.25 })
    .call(() => setSpriteState('W', false))
    .to({}, { duration: 0.25 })
    .call(() => setSpriteState('W', true))
    .to(target, {
      x: startX,
      duration: 3,
      ease: 'power1.inOut',
    })
    .call(() => setSpriteState('S', false))
    .to({}, { duration: 0.25 })
    .call(() => setSpriteState('E', false))
    .to({}, { duration: 0.25 });

  return tl;
}

export default spriteActionScript;
