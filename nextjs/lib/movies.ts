import type { BuiltinMovie } from 'modern-flash';

export const SITE_URL = 'https://modern-flash.pro';
export const SITE_NAME = 'Modern Flash';
export const SITE_DESCRIPTION =
  'Vector graphics, GSAP ActionScript choreography, and zero-scroll Flash stage runtimes for Next.js and React.';

export interface MovieRouteConfig {
  slug: string;
  movie: BuiltinMovie;
  title: string;
  description: string;
  keywords: string[];
  showHomeButton: boolean;
  loop: boolean;
  speed: number;
}

export const MOVIE_ROUTES: readonly MovieRouteConfig[] = [
  {
    slug: 'menu',
    movie: 'GameMenu',
    title: 'Game Menu',
    description:
      'Interactive keyboard and pointer stage menu with retro sound effects and spring physics.',
    keywords: ['Modern Flash', 'Game Menu', 'Navigation', 'GSAP', 'Next.js'],
    showHomeButton: false,
    loop: false,
    speed: 1,
  },
  {
    slug: 'poker-dice',
    movie: 'PokerDice',
    title: 'Poker Dice',
    description:
      'Interactive five-die poker dice stage with vector graphics, physics, and retro audio.',
    keywords: ['Modern Flash', 'Poker Dice', 'Vector Game', 'GSAP', 'SVG'],
    showHomeButton: true,
    loop: false,
    speed: 1,
  },
  {
    slug: 'sound-fx',
    movie: 'SoundFX',
    title: 'Sound FX',
    description:
      'Interactive retro sound effects laboratory powered by the Web Audio API.',
    keywords: ['Modern Flash', 'Sound FX', 'Web Audio API', 'SFX', 'Soundboard'],
    showHomeButton: true,
    loop: false,
    speed: 1,
  },
  {
    slug: 'blackjack',
    movie: 'blackjack',
    title: 'Blackjack',
    description:
      'Vector playing cards and blackjack stage powered by Modern Flash and GSAP ActionScript.',
    keywords: ['Modern Flash', 'Blackjack', 'Playing Cards', 'SVG', 'GSAP'],
    showHomeButton: true,
    loop: false,
    speed: 1,
  },
  {
    slug: 'starwars',
    movie: 'StarWars',
    title: 'Star Wars',
    description:
      'Classic vector starburst emblem and ActionScript timeline showcase.',
    keywords: ['Modern Flash', 'Starburst', 'Vector Graphics', 'ActionScript'],
    showHomeButton: true,
    loop: true,
    speed: 1,
  },
  {
    slug: 'lightning',
    movie: 'lightning',
    title: 'Lightning Bolt',
    description:
      'Vector lightning bolt MovieClip animated with GSAP ActionScript.',
    keywords: ['Modern Flash', 'Lightning Bolt', 'MovieClip', 'SVG'],
    showHomeButton: true,
    loop: true,
    speed: 1,
  },
  {
    slug: 'pingpong',
    movie: 'pingpong',
    title: 'Ping Pong',
    description:
      'Squash-and-stretch vector ball rally driven by GSAP ActionScript physics.',
    keywords: ['Modern Flash', 'Ping Pong', 'GSAP', 'Animation'],
    showHomeButton: true,
    loop: true,
    speed: 1,
  },
  {
    slug: 'playing-cards',
    movie: 'playing-cards',
    title: 'Playing Cards',
    description:
      'Vector Ace of Spades deal and 3D flip ActionScript demonstration.',
    keywords: ['Modern Flash', 'Playing Cards', 'SVG', 'ActionScript'],
    showHomeButton: true,
    loop: true,
    speed: 1,
  },
  {
    slug: 'sprite',
    movie: 'sprite',
    title: 'Sprite',
    description:
      'Vector character sprite walk cycle running on the Modern Flash stage.',
    keywords: ['Modern Flash', 'Sprite', 'Walk Cycle', 'SVG Animation'],
    showHomeButton: true,
    loop: true,
    speed: 1,
  },
  {
    slug: 'logo',
    movie: 'logo',
    title: 'Logo',
    description:
      'Modern Flash vector brand mark and ActionScript timeline showcase.',
    keywords: ['Modern Flash', 'Logo', 'Vector', 'Brand Mark'],
    showHomeButton: true,
    loop: true,
    speed: 1,
  },
  {
    slug: 'agent-text',
    movie: 'AgentText',
    title: 'Agent Text',
    description:
      'Animated agent telemetry typography MovieClip on the Modern Flash stage.',
    keywords: ['Modern Flash', 'Agent Text', 'Typography', 'MovieClip'],
    showHomeButton: true,
    loop: false,
    speed: 1,
  },
] as const;

const MOVIE_ROUTE_MAP = new Map<string, MovieRouteConfig>(
  MOVIE_ROUTES.map((entry) => [entry.slug, entry])
);

export function getMovieBySlug(slug: string): MovieRouteConfig | undefined {
  return MOVIE_ROUTE_MAP.get(slug.toLowerCase());
}
