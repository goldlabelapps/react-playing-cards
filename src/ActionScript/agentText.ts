import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

/**
 * ActionScript choreography for AgentText:
 * Coordinates the rapid title text reveal and the repeating luminous sheen
 * sweeping across the agent status text.
 */
export function agentTextActionScript({
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

  // Locate the sheen element or fallback to target
  const sheenEl =
    target.querySelector<HTMLElement>('[data-agent-sheen="true"]') ?? target;
  const titleEl = target.querySelector<HTMLElement>('[data-agent-title="true"]');

  // Fast title reveal on start
  if (titleEl) {
    gsap.fromTo(
      titleEl,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' }
    );
  }

  // Smooth luminous sheen sweep across the text
  tl.fromTo(
    sheenEl,
    { backgroundPosition: '200% 0' },
    {
      backgroundPosition: '-50% 0',
      duration: 1.6,
      ease: 'power2.inOut',
    }
  );

  return tl;
}

export default agentTextActionScript;
