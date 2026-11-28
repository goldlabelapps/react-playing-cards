import type { CSSProperties, ReactNode } from 'react';
import { gsap } from 'gsap';
import type { CorkScrewDirection, CorkScrewOptions } from './ActionScript/corkscrew';

export type GSAPTimeline = ReturnType<typeof gsap.timeline>;

/**
 * Imperative handle exposed via React ref for controlling Flash movie playback.
 */
export interface FlashHandle {
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (position: number) => void;
  corkScrew?: (
    direction?: CorkScrewDirection,
    options?: Omit<CorkScrewOptions, 'target' | 'direction'>
  ) => GSAPTimeline | null;
  corkscrew?: (
    direction?: CorkScrewDirection,
    options?: Omit<CorkScrewOptions, 'target' | 'direction'>
  ) => GSAPTimeline | null;
}

/**
 * Configuration options passed to an ActionScript timeline factory.
 */
export interface ActionScriptOptions {
  /** The target HTML or SVG element hosting the MovieClip visual elements. */
  target: HTMLElement | SVGElement;
  /** Whether the timeline animation should loop continuously. */
  loop?: boolean;
  /** Optional completion callback triggered when a non-looping animation completes. */
  onComplete?: () => void;
  /** Optional playback speed multiplier for GSAP timeline (default: 1). */
  speed?: number;
  /** Additional custom timeline parameters. */
  params?: Record<string, unknown>;
}

/**
 * Factory function signature for creating a GSAP Timeline.
 */
export type ActionScriptFactory = (options: ActionScriptOptions) => GSAPTimeline;

/**
 * Built-in standard MovieClip names provided by the Flash runtime.
 */
export type BuiltinMovie =
  | 'logo'
  | 'pingpong'
  | 'nx'
  | 'sprite'
  | 'sprite-demo'
  | 'playing-cards'
  | 'blackjack'
  | 'poker-dice'
  | 'PokerDice'
  | 'corkscrew'
  | 'twist'
  | 'flipInX'
  | 'deal'
  | 'lightning'
  | 'starwars'
  | 'StarWars'
  | 'macromedia'
  | 'flash-story'
  | 'FlashStory'
  | 'agent-text'
  | 'AgentText'
  | 'sound-fx'
  | 'soundfx'
  | 'SoundFX'
  | 'game-menu'
  | 'GameMenu';

export type { StarWarsProps, StarWarsProps as MacromediaProps } from './MovieClips/StarWars';
export type { FlashStoryProps } from './MovieClips/FlashStory';
export type { AgentTextProps } from './MovieClips/Typography';
export type { GameMenuProps, GameMenuItem } from './MovieClips/GameMenu';
export type { PokerDiceProps, PokerDiceFace } from './MovieClips/PokerDice';
export type { SoundFXProps } from './MovieClips/SoundFX';
export type { HomeBtnProps } from './components/HomeBtn';

/**
 * Props for the `<Blackjack />` MovieClip component.
 */
export interface BlackjackProps {
  title?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * Movie name supporting built-in autocomplete while remaining open for custom registrations.
 */
export type MovieName = BuiltinMovie | (string & {});

/**
 * Props for the `<Stage />` render surface component.
 */
export interface StageProps {
  /** Stage width constraint. */
  width?: CSSProperties['width'];
  /** Stage height constraint. */
  height?: CSSProperties['height'];
  /** Background stage color. */
  color?: string;
  /** SVG viewBox coordinate bounds for responsive vector scaling (e.g. "0 0 800 500"). */
  viewBox?: string;
  /** Children MovieClip components rendered inside the Stage. */
  children?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
  /** Custom inline styles. */
  style?: CSSProperties;
  /** Optional click or tap callback. */
  onClick?: () => void;
}

/**
 * Props for the public `<Flash />` component.
 */
export interface FlashProps {
  /** Name of the movie to render and animate (e.g. 'logo', 'pingpong', 'playing-cards'). */
  movie?: MovieName;
  /** Declarative prompt-generated scene description. */
  scene?: PromptScene;
  /** Viewport width of the Flash stage. */
  width?: CSSProperties['width'];
  /** Viewport height of the Flash stage. */
  height?: CSSProperties['height'];
  /** Background stage color. */
  color?: string;
  /** Whether the animation should loop continuously (default: false). */
  loop?: boolean;
  /** Whether the animation should automatically start playing on mount (default: true). */
  autoPlay?: boolean;
  /** Playback speed multiplier (default: 1). */
  speed?: number;
  /** Enable debug overlay showing movie name and execution status (default: false). */
  debug?: boolean;
  /** Custom children elements. */
  children?: ReactNode;
  /** Additional CSS class names for the container. */
  className?: string;
  /** Custom inline styles for the container. */
  style?: CSSProperties;
  /** Callback fired when the timeline completes. */
  onComplete?: () => void;
  /** Navigation callback for external routing. */
  onNavigate?: (path: string) => void;
  /** Callback triggered when a MovieClip is selected from GameMenu. Return true to handle routing externally. */
  onSelectMovie?: (movie: string) => boolean | void;
}

/**
 * Elements within a prompt-generated scene.
 */
export interface PromptSceneElement {
  id: string;
  type: 'card' | 'ball' | 'logo' | 'title' | 'lightning' | 'sprite' | 'starwars' | 'StarWars' | 'macromedia' | 'flash-story' | 'story';
  x?: number;
  y?: number;
  scale?: number;
  props: Record<string, unknown>;
  animation: {
    actionScript: string;
    delay?: number;
    duration?: number;
    options?: Record<string, unknown>;
  };
}

/**
 * Declarative specification of an SVG scene compiled from a natural language chat prompt.
 */
export interface PromptScene {
  id: string;
  prompt: string;
  title: string;
  description?: string;
  stage: {
    width?: string | number;
    height?: string | number;
    color?: string;
    viewBox?: string;
  };
  elements: PromptSceneElement[];
}

/**
 * Props for the `<Logo />` MovieClip component.
 */
export interface LogoProps {
  text?: string;
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export * from './themes/types';


/**
 * Props for the `<Pingpongball />` MovieClip component.
 */
export interface PingpongballProps {
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

export * from './themes/types';

