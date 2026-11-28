import type { ThemeDefinition } from '../types';

/**
 * Modern Apple theme definition for Modern Flash.
 *
 * Implements Apple's signature design language:
 * - Fluid SF Pro typography stack with optical tracking
 * - System Blue interactive accent with subtle specular gradients
 * - Tactile pill geometry with 9999px border-radius
 * - Frosted glass surfaces with backdrop blur
 * - High-contrast accessible focus outlines
 */
export const appleTheme: ThemeDefinition = {
  slug: 'apple',
  displayName: 'Apple',
  palette: {
    primary: '#FCFF20',
    primaryHover: '#fdfd5e',
    primaryActive: '#fdfd5e',
    primaryGlow: 'rgba(252, 255, 32, 0.45)',
    secondary: '#FFFFFF',
    secondaryHover: '#f5f5f7',
    background: '#000000',
    backgroundLight: '#ffffff',
    surface: '#1d1d1f',
    surfaceElevated: '#2d2d2f',
    surfaceFrosted: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#000000',
    textSecondary: '#1d1d1f',
    textMuted: '#4a4a4f',
    border: 'rgba(0, 0, 0, 0.16)',
    borderLight: 'rgba(0, 0, 0, 0.12)',
    focusRing: 'rgba(252, 255, 32, 0.55)',
    error: '#ff453a',
    success: '#30d158',
    warning: '#ffd60a',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif',
    headlineFontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif',
    monoFontFamily: 'SF Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    sizes: {
      xs: '12px',
      sm: '14px',
      md: '17px',
      lg: '21px',
      xl: '28px',
      xxl: '40px',
    },
  },
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '18px',
    pill: '9999px',
  },
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.24)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.38)',
    glow: '0 4px 20px rgba(255, 255, 255, 0.55)',
    insetBevel: 'inset 0 1px 1px rgba(255, 255, 255, 0.45)',
  },
  formFields: {
    minHeight: '48px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    color: '#000000',
    fontSize: '17px',
    padding: '12px 16px',
    focusBorder: '#FFFFFF',
    focusRing: '0 0 0 4px rgba(255, 255, 255, 0.5)',
  },
};

export default appleTheme;
