import type { CSSProperties, ReactNode } from 'react';

export interface GameMenuItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
  shortcut?: string;
  /** Submenu children for hierarchical navigation. */
  children?: GameMenuItem[];
  /** Optional custom action callback. */
  action?: () => void;
  /** Optional route path to navigate to (e.g. '/examples', '/sounds'). */
  route?: string;
  /** Optional MovieClip to preview/launch inside the stage. */
  movie?: string;
  /** Whether the item is disabled. */
  disabled?: boolean;
}

export interface GameMenuProps {
  /** Menu hierarchy tree. Uses standard default app navigation if omitted. */
  items?: GameMenuItem[];
  /** Navigation callback for external routing. */
  onNavigate?: (path: string) => void;
  /** Callback triggered when a MovieClip demo is selected. Return true to handle navigation externally. */
  onSelectMovie?: (movie: string) => boolean | void;
  /** Stage width constraint. Default: '100%'. */
  width?: string | number;
  /** Stage height constraint. Default: '100%'. */
  height?: string | number;
  /** Additional CSS class names. */
  className?: string;
  /** Custom inline style overrides. */
  style?: CSSProperties;
  /** Custom top-level menu title. */
  title?: string;
  /** Callback when user returns to top level menu. */
  onBackToTop?: () => void;
  /** Callback when user chooses to restart or replay the agent text sequence. */
  onReplayStory?: () => void;
  /** Whether retro sound effects are enabled (default: true). */
  soundEnabled?: boolean;
  /** Custom children elements to overlay. */
  children?: ReactNode;
}
