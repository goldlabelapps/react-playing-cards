import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { gsap } from 'gsap';
import { agentTextActionScript } from '../../ActionScript/agentText';

export interface AgentTextProps {
  /** The markdown title or status description string (e.g. 'Thinking ...', 'Running `check apps/web contents`'). */
  title?: string;
  /** Backward-compatible alias for title. */
  text?: string;
  /** Controlled elapsed seconds. If not provided, an internal timer calculates from startTime. */
  elapsedSeconds?: number;
  /** Start timestamp in milliseconds for uncontrolled timer (default: Date.now()). */
  startTime?: number;
  /** Counter formatting style: 'short' ('3m 33s', '23s') or 'verbose' ('23 secs'). Default: 'short'. */
  counterStyle?: 'short' | 'verbose';
  /** Custom formatter function for elapsed seconds. */
  formatCounter?: (seconds: number) => string;
  /** Current status of the agent task: 'active' (in-progress), 'completed' (finished), or 'idle'. */
  status?: 'active' | 'completed' | 'idle';
  /** Whether the counter and animation are actively running (default: true). */
  active?: boolean;
  /** Whether the sheen animation loops while running (default: true). */
  loop?: boolean;
  /** Playback speed multiplier (default: 1). */
  speed?: number;
  /** Base text colour (default: '#94a3b8'). */
  textColor?: string;
  /** Luminous sheen sweep peak colour (default: '#ffffff'). */
  sheenColor?: string;
  /** Whether to render the elapsed time counter (default: true). */
  showCounter?: boolean;
  /** Whether to render the right caret chevron '>' (default: true). */
  showChevron?: boolean;
  /** Font size (default: '14px'). */
  fontSize?: string | number;
  /** Font family (default: system geometric sans-serif stack matching Antigravity). */
  fontFamily?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  onComplete?: () => void;
}

export interface AgentTextHandle {
  element: HTMLDivElement | null;
  getElapsedSeconds: () => number;
  resetTimer: () => void;
}

/**
 * Lightweight inline markdown renderer for title strings.
 * Parses inline code (`code`), bold (**bold**), and italic (*italic*).
 */
function renderInlineMarkdown(rawText: string): ReactNode {
  const tokens = rawText.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, index) => {
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={index}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '1px 5px',
            borderRadius: 3,
            fontSize: '0.92em',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={index} style={{ fontWeight: 600 }}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

function defaultFormatElapsed(seconds: number, style: 'short' | 'verbose'): string {
  if (seconds < 60) {
    return style === 'verbose' ? `${seconds} secs` : `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${mins}m ${remainingSecs}s`;
}

/**
 * AgentText MovieClip:
 * Replicates the Antigravity background task telemetry status bar.
 * Renders an inline markdown title string, an animated repeating luminous sheen,
 * and an automatic or controlled live elapsed duration counter with trailing chevron.
 */
export const AgentText = forwardRef<AgentTextHandle, AgentTextProps>(function AgentText(
  {
    title,
    text,
    status,
    elapsedSeconds: controlledSeconds,
    startTime: initialStartTime,
    counterStyle = 'short',
    formatCounter,
    active = true,
    loop = true,
    speed = 1,
    textColor = '#94a3b8',
    sheenColor = '#ffffff',
    showCounter = true,
    showChevron = true,
    fontSize = '14px',
    fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    className,
    style,
    onClick,
    onComplete,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLSpanElement>(null);
  const [internalStart, setInternalStart] = useState<number>(() => initialStartTime ?? Date.now());
  const [elapsed, setElapsed] = useState<number>(0);

  const displayTitle = title ?? text ?? 'Thinking ...';

  useImperativeHandle(ref, () => ({
    element: containerRef.current,
    getElapsedSeconds: () => (controlledSeconds !== undefined ? controlledSeconds : elapsed),
    resetTimer: () => {
      setInternalStart(Date.now());
      setElapsed(0);
    },
  }));

  const isTaskActive = status !== undefined ? status === 'active' : active;
  const isSheenActive = isTaskActive && loop !== false;

  // Track live elapsed time counter
  useEffect(() => {
    if (initialStartTime !== undefined) {
      setInternalStart(initialStartTime);
      setElapsed(Math.max(0, Math.floor((Date.now() - initialStartTime) / 1000)));
    }
  }, [initialStartTime]);

  useEffect(() => {
    if (controlledSeconds !== undefined) {
      setElapsed(controlledSeconds);
      return;
    }

    if (!isTaskActive) return;

    // Immediately calculate initial offset
    const calc = () => Math.max(0, Math.floor((Date.now() - internalStart) / 1000));
    setElapsed(calc());

    const interval = setInterval(() => {
      setElapsed(calc());
    }, 1000);

    return () => clearInterval(interval);
  }, [controlledSeconds, isTaskActive, internalStart]);

  // Fast text entrance reveal on mount or title change
  useEffect(() => {
    const el = titleContainerRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, x: -6 },
      { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' }
    );
  }, [displayTitle]);

  // Sheen animation ActionScript timeline
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    if (!isSheenActive) return;

    const timeline = agentTextActionScript({
      target,
      loop,
      speed,
      onComplete,
    });

    return () => {
      timeline.kill();
    };
  }, [isSheenActive, loop, speed, onComplete]);

  const formattedTime = formatCounter
    ? formatCounter(elapsed)
    : defaultFormatElapsed(elapsed, counterStyle);

  return (
    <div
      ref={containerRef}
      className={`agent-text-clip ${className ?? ''}`.trim()}
      onClick={onClick}
      role="status"
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 12px',
        fontSize,
        fontFamily,
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
        userSelect: 'none',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Title Text with Repeating Luminous Sheen */}
      <span
        ref={titleContainerRef}
        data-agent-sheen="true"
        data-agent-title="true"
        style={
          isSheenActive
            ? {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 450,
                background: `linear-gradient(90deg, ${textColor} 0%, ${textColor} 32%, ${sheenColor} 50%, ${textColor} 68%, ${textColor} 100%)`,
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                willChange: 'background-position',
              }
            : {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 450,
                color: textColor,
                opacity: status === 'completed' ? 0.75 : 0.9,
              }
        }
      >
        {renderInlineMarkdown(displayTitle)}
      </span>

      {/* Trailing Counter & Chevron Container */}
      {(showCounter || showChevron) && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: textColor,
            fontWeight: 400,
            whiteSpace: 'nowrap',
          }}
        >
          {showCounter && (
            <span
              data-agent-counter="true"
              style={{
                fontVariantNumeric: 'tabular-nums',
                color: textColor,
                opacity: isTaskActive ? 0.9 : 0.65,
              }}
            >
              {formattedTime}
            </span>
          )}

          {showChevron && (
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                display: 'inline-block',
                opacity: isTaskActive ? 0.75 : 0.45,
                transform: 'translateY(0.5px)',
              }}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </span>
      )}
    </div>
  );
});

AgentText.displayName = 'AgentText';
export default AgentText;
