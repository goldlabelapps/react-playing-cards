import type { CSSProperties, ReactNode } from 'react';

export interface SoundFXProps {
  /** Optional width constraint. Default: '100%'. */
  width?: string | number;
  /** Optional height constraint. Default: '100%'. */
  height?: string | number;
  /** Additional CSS class names. */
  className?: string;
  /** Custom inline style overrides. */
  style?: CSSProperties;
  /** Title displayed at the top of the stage. Default: 'SOUND FX'. */
  title?: string;
  /** Optional callback triggered when the back action is invoked. */
  onBack?: () => void;
  /** Whether to render a dedicated inline back button (default: false). */
  showBackButton?: boolean;
  /** Optional children elements to overlay on stage. */
  children?: ReactNode;
}
