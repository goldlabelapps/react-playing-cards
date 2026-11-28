import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export interface HomeBtnProps {
  /** Optional custom button label (default: 'Modern Flash'). */
  label?: string;
  /** Button sizing geometry ('sm' | 'md' | 'lg' | 'fat'). Default: 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'fat';
  /** Click action handler. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Whether the button is currently in selected state. */
  selected?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Custom CSS classes. */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
  /** Accessible label. */
  ariaLabel?: string;
  /** Custom leading icon (defaults to the LightningBolt icon that inverts with colours). */
  leadingIcon?: ReactNode;
  /** Whether rollover acoustic micro-tick is enabled (default: true). */
  soundEnabled?: boolean;
  /** Pointer enter callback. */
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Pointer leave callback. */
  onMouseLeave?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Custom child elements (overrides label if provided). */
  children?: ReactNode;
}
