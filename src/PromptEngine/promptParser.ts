import type { PromptScene } from '../types';

/**
 * Built-in recipe templates for standard prompt archetypes.
 */
export const PROMPT_PRESETS: Record<string, (prompt: string) => PromptScene> = {
  flashStory: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: 'The Story of Flash',
    description: 'The iconic Flash lightning bolt with suitable vector animation recounting the heritage of Flash.',
    stage: {
      width: '100%',
      height: 440,
      color: '#070b14',
    },
    elements: [
      {
        id: 'story-1',
        type: 'flash-story',
        x: 50,
        y: 50,
        scale: 1,
        props: {},
        animation: {
          actionScript: 'flash-story',
          delay: 0,
          duration: 2,
        },
      },
    ],
  }),

  dealCards: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: 'Ace of Spades Deal & Flip',
    description: 'A vector playing card dealt into the centre of the stage with a 3D flip reveal.',
    stage: {
      width: '100%',
      height: 380,
      color: '#0f172a',
    },
    elements: [
      {
        id: 'card-1',
        type: 'card',
        x: 50,
        y: 50,
        scale: 1,
        props: { suit: 'S', rank: 'A' },
        animation: {
          actionScript: 'deal',
          delay: 0.1,
          duration: 1.2,
        },
      },
    ],
  }),

  lightningStorm: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: 'Electric Lightning Surge',
    description: 'High-voltage procedural vector lightning bolt striking with glowing atmospheric title.',
    stage: {
      width: '100%',
      height: 400,
      color: '#050b14',
    },
    elements: [
      {
        id: 'bolt-1',
        type: 'lightning',
        x: 50,
        y: 45,
        scale: 0.9,
        props: { color: '#38bdf8' },
        animation: {
          actionScript: 'lightning',
          delay: 0,
          duration: 1.5,
        },
      },
      {
        id: 'title-1',
        type: 'title',
        x: 50,
        y: 85,
        scale: 1,
        props: { text: 'HIGH VOLTAGE', color: '#38bdf8' },
        animation: {
          actionScript: 'twist',
          delay: 0.4,
          duration: 1,
        },
      },
    ],
  }),

  logoCorkscrew: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: '3D Diamond Corkscrew',
    description: 'Goldlabel diamond logo executing an elastic 3D corkscrew spin onto the stage.',
    stage: {
      width: '100%',
      height: 320,
      color: '#111827',
    },
    elements: [
      {
        id: 'logo-1',
        type: 'logo',
        x: 50,
        y: 50,
        scale: 1.2,
        props: { text: 'FLASH', color: '#15868F', size: 36 },
        animation: {
          actionScript: 'corkscrew',
          delay: 0.2,
          duration: 1.6,
        },
      },
    ],
  }),

  pingpong: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: 'High Velocity Pingpong',
    description: 'Vector pingpong ball rallying back and forth across the stage surface.',
    stage: {
      width: '100%',
      height: 300,
      color: '#1e293b',
    },
    elements: [
      {
        id: 'ball-1',
        type: 'ball',
        x: 50,
        y: 50,
        scale: 1,
        props: { color: '#f59e0b', size: 48 },
        animation: {
          actionScript: 'pingpong',
          delay: 0,
          duration: 2,
        },
      },
    ],
  }),

  spriteWalk: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: 'Character Walk Cycle',
    description: 'Animated 8-frame pixel character traversing across the canvas.',
    stage: {
      width: '100%',
      height: 320,
      color: '#0f172a',
    },
    elements: [
      {
        id: 'sprite-1',
        type: 'sprite',
        x: 50,
        y: 50,
        scale: 1.2,
        props: { size: 96 },
        animation: {
          actionScript: 'sprite',
          delay: 0,
          duration: 2.5,
        },
      },
    ],
  }),

  macromedia: (prompt) => ({
    id: `scene-${Date.now()}`,
    prompt,
    title: 'Flash Engine',
    description: 'Authentic 1990s Flash starburst rays assemble and laser light beam sweep.',
    stage: {
      width: '100%',
      height: 400,
      color: '#070b14',
    },
    elements: [
      {
        id: 'macromedia-1',
        type: 'macromedia',
        x: 50,
        y: 50,
        scale: 1,
        props: { color: '#4C979C' },
        animation: {
          actionScript: 'macromedia',
          delay: 0,
          duration: 2.2,
        },
      },
    ],
  }),
};

/**
 * Parse a chat prompt into a structured SVG animation scene.
 */
export function parsePrompt(prompt: string): PromptScene {
  const p = prompt.toLowerCase();

  // Match keyword intents
  if (p.includes('story') || p.includes('flash') || p.includes('bolt') || p.includes('lightning')) {
    return PROMPT_PRESETS.flashStory(prompt);
  }

  if (p.includes('macromedia')) {
    return PROMPT_PRESETS.macromedia(prompt);
  }

  if (p.includes('ball') || p.includes('pingpong') || p.includes('bounce') || p.includes('rally')) {
    return PROMPT_PRESETS.pingpong(prompt);
  }

  if (p.includes('logo') || p.includes('diamond') || p.includes('spin') || p.includes('corkscrew')) {
    return PROMPT_PRESETS.logoCorkscrew(prompt);
  }

  if (p.includes('walk') || p.includes('character') || p.includes('sprite')) {
    return PROMPT_PRESETS.spriteWalk(prompt);
  }

  if (p.includes('card') || p.includes('deck') || p.includes('blackjack') || p.includes('deal') || p.includes('ace')) {
    const isHearts = p.includes('heart');
    const isDiamonds = p.includes('diamond');
    const isClubs = p.includes('club');
    const suit = isHearts ? 'H' : isDiamonds ? 'D' : isClubs ? 'C' : 'S';

    let rank = 'A';
    if (p.includes('king')) rank = 'K';
    else if (p.includes('queen')) rank = 'Q';
    else if (p.includes('jack')) rank = 'J';
    else if (p.includes('10')) rank = '10';

    return {
      id: `scene-${Date.now()}`,
      prompt,
      title: `${rank} of ${suit === 'S' ? 'Spades' : suit === 'H' ? 'Hearts' : suit === 'D' ? 'Diamonds' : 'Clubs'} Deal`,
      description: 'Vector playing card deal and 3D reveal sequence compiled from chat prompt.',
      stage: {
        width: '100%',
        height: 380,
        color: p.includes('green') ? '#064e3b' : p.includes('blue') ? '#0f172a' : '#1e1e1e',
      },
      elements: [
        {
          id: 'card-1',
          type: 'card',
          x: 50,
          y: 50,
          scale: 1,
          props: { suit, rank },
          animation: {
            actionScript: p.includes('twist') ? 'twist' : p.includes('flip') ? 'flipInX' : 'deal',
            delay: 0.1,
            duration: 1.2,
          },
        },
      ],
    };
  }

  // Fallback: Custom composed title + card scene
  return {
    id: `scene-${Date.now()}`,
    prompt,
    title: 'Custom Prompt Animation',
    description: `Animation compiled from prompt: "${prompt}"`,
    stage: {
      width: '100%',
      height: 350,
      color: '#0b1120',
    },
    elements: [
      {
        id: 'title-custom',
        type: 'title',
        x: 50,
        y: 40,
        props: { text: prompt.length > 25 ? `${prompt.slice(0, 25)}...` : prompt, color: '#f8fafc' },
        animation: {
          actionScript: 'twist',
          delay: 0.1,
          duration: 1,
        },
      },
      {
        id: 'card-custom',
        type: 'card',
        x: 50,
        y: 65,
        props: { suit: 'S', rank: 'A' },
        animation: {
          actionScript: 'deal',
          delay: 0.5,
          duration: 1.2,
        },
      },
    ],
  };
}
