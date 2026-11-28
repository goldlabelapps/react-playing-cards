import type { CSSProperties, ReactNode, MouseEvent } from 'react';

/**
 * Standard colour palette definition for a Modern Flash theme.
 */
export interface ThemePalette {
  /** Primary accent colour (e.g. system interactive blue). */
  primary: string;
  /** Primary hover state colour. */
  primaryHover: string;
  /** Primary active/pressed state colour. */
  primaryActive: string;
  /** Primary specular glow or shadow tint. */
  primaryGlow: string;
  /** Secondary background or button colour. */
  secondary: string;
  /** Secondary hover state colour. */
  secondaryHover: string;
  /** Stage background colour. */
  background: string;
  /** Light mode background colour. */
  backgroundLight: string;
  /** Surface container colour. */
  surface: string;
  /** Elevated surface container colour. */
  surfaceElevated: string;
  /** Frosted glass surface backdrop colour. */
  surfaceFrosted: string;
  /** Primary text colour. */
  textPrimary: string;
  /** Secondary text colour. */
  textSecondary: string;
  /** Muted/tertiary text colour. */
  textMuted: string;
  /** Subtle border and divider colour. */
  border: string;
  /** Light mode border colour. */
  borderLight: string;
  /** Accessible focus ring indicator colour. */
  focusRing: string;
  /** Semantic error and warning accents. */
  error: string;
  success: string;
  warning: string;
}

/**
 * Spacing scale definition.
 */
export interface ThemeSpacing {
  xs: string | number;
  sm: string | number;
  md: string | number;
  lg: string | number;
  xl: string | number;
  xxl: string | number;
}

/**
 * Typography token definitions.
 */
export interface ThemeTypography {
  fontFamily: string;
  headlineFontFamily: string;
  monoFontFamily: string;
  weights: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
}

/**
 * Border radii scale definition.
 */
export interface ThemeRadii {
  xs: string | number;
  sm: string | number;
  md: string | number;
  lg: string | number;
  pill: string | number;
}

/**
 * Shadows and specular highlights.
 */
export interface ThemeShadows {
  subtle: string;
  elevated: string;
  glow: string;
  insetBevel: string;
}

/**
 * Form field design token specifications.
 */
export interface ThemeFormFieldStyles {
  minHeight: string | number;
  borderRadius: string | number;
  background: string;
  border: string;
  color: string;
  fontSize: string;
  padding: string;
  focusBorder: string;
  focusRing: string;
}

/**
 * Complete Theme definition contract.
 */
export interface ThemeDefinition {
  /** Unique URL-friendly slug identifier for the theme (e.g. 'apple'). */
  slug: string;
  /** Human-readable display name (e.g. 'Apple'). */
  displayName: string;
  /** Colour palette definition. */
  palette: ThemePalette;
  /** Spacing scale. */
  spacing: ThemeSpacing;
  /** Typography specifications. */
  typography: ThemeTypography;
  /** Border radii scale. */
  radii: ThemeRadii;
  /** Shadows and elevation tokens. */
  shadows: ThemeShadows;
  /** Form field token defaults. */
  formFields: ThemeFormFieldStyles;
}

/**
 * Props for themed button components.
 */
export interface ThemedButtonProps {
  /** Button visual style variant. Default: 'primary'. */
  variant?: 'primary' | 'secondary' | 'frosted' | 'outline';
  /** Button size geometry. Default: 'fat'. */
  size?: 'sm' | 'md' | 'lg' | 'fat';
  /** Text label displayed inside the button. */
  label?: string;
  /** Child nodes rendered alongside or in place of label. */
  children?: ReactNode;
  /** Click action handler. */
  onClick?: () => void;
  /** Additional CSS class names. */
  className?: string;
  /** Contained inline styles. */
  style?: CSSProperties;
  /** Disabled state flag. */
  disabled?: boolean;
  /** Accessible aria label. */
  ariaLabel?: string;
  /** Leading icon node. */
  leadingIcon?: ReactNode;
  /** Trailing icon node. */
  trailingIcon?: ReactNode;
  /** Selected or active item state flag. */
  selected?: boolean;
  /** Hover state change callbacks. */
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement>) => void;
}
