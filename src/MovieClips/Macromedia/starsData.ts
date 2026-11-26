/**
 * Procedural deterministic starfield data for Star Wars fighter cockpit HUD.
 * Coordinates span x: [0, 640) and y: [-120, 480) to stretch completely
 * to the top and bottom of the stage under all aspect ratios.
 * Replicated across multiple horizontal tiles of width 640 for seamless looping.
 */

export interface StarPoint {
  x: number;
  y: number;
  r: number;
  o: number;
}

export const BASE_FAR_STARS: StarPoint[] = [
  { x: 18, y: -95, r: 0.8, o: 0.45 },
  { x: 75, y: -40, r: 0.7, o: 0.4 },
  { x: 135, y: -110, r: 0.9, o: 0.5 },
  { x: 210, y: -65, r: 0.6, o: 0.35 },
  { x: 290, y: -105, r: 0.8, o: 0.5 },
  { x: 375, y: -30, r: 0.7, o: 0.4 },
  { x: 440, y: -85, r: 0.9, o: 0.55 },
  { x: 515, y: -50, r: 0.6, o: 0.35 },
  { x: 590, y: -115, r: 0.8, o: 0.45 },

  { x: 25, y: 20, r: 0.7, o: 0.45 },
  { x: 60, y: 75, r: 0.8, o: 0.55 },
  { x: 105, y: 130, r: 0.6, o: 0.35 },
  { x: 145, y: 45, r: 0.9, o: 0.6 },
  { x: 185, y: 165, r: 0.7, o: 0.4 },
  { x: 230, y: 90, r: 0.8, o: 0.5 },
  { x: 270, y: 25, r: 0.6, o: 0.35 },
  { x: 315, y: 140, r: 0.9, o: 0.65 },
  { x: 355, y: 65, r: 0.7, o: 0.4 },
  { x: 395, y: 185, r: 0.8, o: 0.55 },
  { x: 435, y: 110, r: 0.6, o: 0.35 },
  { x: 480, y: 35, r: 0.9, o: 0.6 },
  { x: 520, y: 155, r: 0.7, o: 0.4 },
  { x: 565, y: 80, r: 0.8, o: 0.5 },
  { x: 615, y: 170, r: 0.6, o: 0.35 },

  { x: 30, y: 230, r: 0.8, o: 0.5 },
  { x: 80, y: 300, r: 0.7, o: 0.4 },
  { x: 125, y: 215, r: 0.9, o: 0.6 },
  { x: 170, y: 335, r: 0.6, o: 0.35 },
  { x: 215, y: 260, r: 0.8, o: 0.5 },
  { x: 260, y: 320, r: 0.7, o: 0.4 },
  { x: 300, y: 225, r: 0.9, o: 0.65 },
  { x: 345, y: 290, r: 0.6, o: 0.35 },
  { x: 390, y: 350, r: 0.8, o: 0.5 },
  { x: 430, y: 245, r: 0.7, o: 0.4 },
  { x: 475, y: 315, r: 0.9, o: 0.6 },
  { x: 525, y: 235, r: 0.6, o: 0.35 },
  { x: 570, y: 340, r: 0.8, o: 0.55 },
  { x: 620, y: 275, r: 0.7, o: 0.4 },

  { x: 40, y: 390, r: 0.8, o: 0.45 },
  { x: 110, y: 445, r: 0.7, o: 0.4 },
  { x: 190, y: 410, r: 0.9, o: 0.55 },
  { x: 275, y: 460, r: 0.6, o: 0.35 },
  { x: 360, y: 395, r: 0.8, o: 0.5 },
  { x: 445, y: 450, r: 0.7, o: 0.4 },
  { x: 535, y: 415, r: 0.9, o: 0.6 },
  { x: 605, y: 470, r: 0.6, o: 0.35 },
];

export const BASE_MID_STARS: StarPoint[] = [
  { x: 45, y: -80, r: 1.5, o: 0.8 },
  { x: 165, y: -55, r: 1.3, o: 0.7 },
  { x: 310, y: -90, r: 1.6, o: 0.85 },
  { x: 460, y: -60, r: 1.4, o: 0.75 },
  { x: 585, y: -85, r: 1.7, o: 0.9 },

  { x: 50, y: 60, r: 1.4, o: 0.75 },
  { x: 130, y: 145, r: 1.6, o: 0.85 },
  { x: 220, y: 40, r: 1.3, o: 0.7 },
  { x: 330, y: 120, r: 1.5, o: 0.8 },
  { x: 420, y: 70, r: 1.7, o: 0.9 },
  { x: 510, y: 150, r: 1.4, o: 0.75 },
  { x: 600, y: 35, r: 1.6, o: 0.85 },

  { x: 70, y: 250, r: 1.3, o: 0.7 },
  { x: 160, y: 310, r: 1.5, o: 0.8 },
  { x: 250, y: 220, r: 1.7, o: 0.9 },
  { x: 350, y: 330, r: 1.4, o: 0.75 },
  { x: 440, y: 240, r: 1.6, o: 0.85 },
  { x: 530, y: 320, r: 1.3, o: 0.7 },
  { x: 610, y: 230, r: 1.5, o: 0.8 },

  { x: 95, y: 410, r: 1.6, o: 0.85 },
  { x: 235, y: 440, r: 1.4, o: 0.75 },
  { x: 385, y: 420, r: 1.7, o: 0.9 },
  { x: 520, y: 450, r: 1.5, o: 0.8 },
];

export const BASE_NEAR_STARS: StarPoint[] = [
  { x: 110, y: -70, r: 2.4, o: 0.95 },
  { x: 380, y: -50, r: 2.7, o: 1.0 },
  { x: 550, y: -75, r: 2.3, o: 0.9 },

  { x: 80, y: 85, r: 2.5, o: 0.95 },
  { x: 260, y: 140, r: 2.8, o: 1.0 },
  { x: 470, y: 55, r: 2.4, o: 0.9 },

  { x: 140, y: 270, r: 2.6, o: 1.0 },
  { x: 360, y: 210, r: 2.3, o: 0.9 },
  { x: 570, y: 290, r: 2.7, o: 1.0 },

  { x: 210, y: 430, r: 2.5, o: 0.95 },
  { x: 480, y: 415, r: 2.8, o: 1.0 },
];

/**
 * Generates horizontally tiled star points across multiple 640px blocks
 * for mathematically seamless, infinite wraparound looping.
 */
export function generateSeamlessStarTiles(
  baseStars: StarPoint[],
  tileRange: [number, number]
): StarPoint[] {
  const result: StarPoint[] = [];
  const [startTile, endTile] = tileRange;
  const TILE_WIDTH = 640;

  for (let tile = startTile; tile <= endTile; tile++) {
    const offsetX = tile * TILE_WIDTH;
    for (const star of baseStars) {
      result.push({
        x: star.x + offsetX,
        y: star.y,
        r: star.r,
        o: star.o,
      });
    }
  }

  return result;
}
