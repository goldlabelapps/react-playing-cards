import { appleTheme } from './apple';
import type { ThemeDefinition } from './types';

export * from './types';
export { appleTheme } from './apple';
export { Button as AppleButton } from './apple/Button';
export {
  SPROING_CONFIG,
  playSproingHover,
  playSproingPress,
  playSproingActivate,
  playSproingRest,
} from './apple/sproing';

/**
 * Universal Theme Registry indexed by theme slug.
 */
export const themes: Record<string, ThemeDefinition> = {
  apple: appleTheme,
};

/**
 * Resolves a theme definition by its slug. Defaults to 'apple' if unrecognized.
 */
export function getTheme(slug: string): ThemeDefinition {
  const normalized = slug.trim().toLowerCase();
  return themes[normalized] ?? appleTheme;
}

/**
 * Returns an array of all registered theme definitions.
 */
export function listThemes(): ThemeDefinition[] {
  return Object.values(themes);
}
