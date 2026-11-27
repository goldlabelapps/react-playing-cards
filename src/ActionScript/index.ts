import logoActionScript from './logo';
import pingpongActionScript from './pingpong';
import loadingActionScript from './loading';
import spriteActionScript from './sprite';
import corkscrewActionScript from './corkscrew';
import twistActionScript from './twist';
import flipInXActionScript from './flip';
import dealActionScript from './deal';
import lightningActionScript from './lightning';
import macromediaActionScript from './macromedia';
import flashStoryActionScript from './flashStory';
import agentTextActionScript from './agentText';
import { blackjackActionScript } from '../MovieClips/Blackjack';
import type { ActionScriptFactory, BuiltinMovie } from '../types';

export type { ActionScriptFactory } from '../types';
export {
  corkscrewActionScript,
  corkScrew,
  corkscrew,
  asMovieClip,
} from './corkscrew';
export type {
  CorkScrewDirection,
  CorkScrewOptions,
  FadeOptions,
  MovieClipInstance,
} from './corkscrew';
export { twistActionScript, twist } from './twist';
export type { TwistOptions } from './twist';
export { flipInXActionScript, flipInX } from './flip';
export type { FlipInXOptions } from './flip';
export { dealActionScript } from './deal';
export { lightningActionScript } from './lightning';
export { macromediaActionScript } from './macromedia';
export { flashStoryActionScript } from './flashStory';
export { agentTextActionScript } from './agentText';

const builtinRegistry: Record<string, ActionScriptFactory> = {
  pingpong: pingpongActionScript,
  logo: logoActionScript,
  nx: logoActionScript,
  loading: loadingActionScript,
  NXLoading: loadingActionScript,
  sprite: spriteActionScript,
  'sprite-demo': spriteActionScript,
  'playing-cards': dealActionScript,
  blackjack: blackjackActionScript,
  corkscrew: corkscrewActionScript as unknown as ActionScriptFactory,
  twist: twistActionScript as unknown as ActionScriptFactory,
  flipInX: flipInXActionScript as unknown as ActionScriptFactory,
  deal: dealActionScript,
  lightning: lightningActionScript,
  macromedia: macromediaActionScript,
  'flash-story': flashStoryActionScript,
  FlashStory: flashStoryActionScript,
  'agent-text': agentTextActionScript,
  AgentText: agentTextActionScript,
};

const customRegistry = new Map<string, ActionScriptFactory>();

/**
 * Register a custom ActionScript timeline factory under a given movie name.
 */
export function registerActionScript(name: string, factory: ActionScriptFactory): void {
  customRegistry.set(name, factory);
}

/**
 * Look up an ActionScript timeline factory by movie name.
 * Searches built-in registry first, then dynamic custom registry.
 */
export function getActionScript(movieName: string): ActionScriptFactory | undefined {
  if (Object.prototype.hasOwnProperty.call(builtinRegistry, movieName)) {
    return builtinRegistry[movieName as BuiltinMovie];
  }
  return customRegistry.get(movieName);
}

/**
 * Read-only object mapping of built-in ActionScripts.
 */
export const actionScripts = builtinRegistry;
