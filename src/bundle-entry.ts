import React from 'react';
import { createRoot } from 'react-dom/client';
import { Flash } from './Flash';
import { Stage } from './Stage';
import { parsePrompt } from './PromptEngine';
import { actionScripts, registerActionScript, getActionScript, corkScrew, asMovieClip } from './ActionScript';
import * as PlayingCards from './MovieClips/PlayingCards';
import { FlashStory } from './MovieClips/FlashStory';
import { soundManager, FlashSound, playSound, SOUND_MANIFEST, SOUND_CATALOG } from './Sound';
import type { MovieName, PromptScene } from './types';

interface MountOptions {
  movie?: MovieName;
  prompt?: string;
  scene?: PromptScene;
  width?: string | number;
  height?: string | number;
  color?: string;
  loop?: boolean;
  autoPlay?: boolean;
  speed?: number;
}

/**
 * Universal mount function for WordPress mwp-flash and vanilla browser embedding.
 */
export function mount(element: HTMLElement, options: MountOptions = {}) {
  const root = createRoot(element);

  const scene = options.prompt ? parsePrompt(options.prompt) : options.scene;

  root.render(
    React.createElement(Flash, {
      movie: options.movie,
      scene,
      width: options.width ?? '100%',
      height: options.height ?? '320px',
      color: options.color ?? 'transparent',
      loop: options.loop ?? true,
      autoPlay: options.autoPlay ?? true,
      speed: options.speed ?? 1,
    }),
  );

  return {
    destroy: () => root.unmount(),
  };
}

/**
 * Auto-discovery runner: Scans document for .mwp-flash-stage or [data-flash-movie]
 */
export function autoMount() {
  if (typeof document === 'undefined') return;

  const containers = document.querySelectorAll<HTMLElement>('.mwp-flash-stage, [data-flash-stage="true"]');
  containers.forEach((el) => {
    const movie = (el.getAttribute('data-movie') || 'FlashStory') as MovieName;
    const prompt = el.getAttribute('data-prompt') || undefined;
    const color = el.getAttribute('data-color') || undefined;
    const loop = el.getAttribute('data-loop') !== 'false';
    const autoPlay = el.getAttribute('data-autoplay') !== 'false';
    const speed = parseFloat(el.getAttribute('data-speed') || '1');
    const width = el.getAttribute('data-width') || el.style.width || undefined;
    const height = el.getAttribute('data-height') || el.style.minHeight || el.style.height || undefined;

    mount(el, { movie, prompt, color, loop, autoPlay, speed, width, height });
  });
}

// Auto mount on DOMContentLoaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  // Attach to global window for WordPress mwp-flash runtime
  (window as unknown as { mwpFlash: unknown }).mwpFlash = {
    mount,
    autoMount,
    Flash,
    Stage,
    FlashStory,
    parsePrompt,
    actionScripts,
    registerActionScript,
    getActionScript,
    corkScrew,
    asMovieClip,
    PlayingCards,
    sound: soundManager,
    Sound: FlashSound,
    playSound,
    soundCatalog: SOUND_CATALOG,
    soundManifest: SOUND_MANIFEST,
  };
}

export {
  Flash,
  Stage,
  FlashStory,
  parsePrompt,
  actionScripts,
  registerActionScript,
  getActionScript,
  corkScrew,
  asMovieClip,
  PlayingCards,
  soundManager,
  FlashSound,
  playSound,
  SOUND_CATALOG,
  SOUND_MANIFEST,
};
