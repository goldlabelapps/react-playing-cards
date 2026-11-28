import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { gsap } from 'gsap';
import type { ThemedButtonProps } from '../types';
import { appleTheme } from './theme';
import {
  playSproingHover,
  playSproingPress,
  playSproingActivate,
  playSproingRest,
} from './sproing';

/**
 * Apple-styled button component.
 *
 * Implements Apple Human Interface design with custom theme palette:
 * - Primary accent: #FCFF20
 * - Secondary accent (rollovers, selected items): #FFFFFF
 * - Dark black typography: #000000
 * - Ultra-smooth pill geometry (border-radius: 9999px)
 * - Single-line layout calibrated for full width on mobile and desktop
 * - GSAP-driven sproing squash-and-stretch animation on rollover and activation
 */
export const Button = forwardRef<HTMLButtonElement, ThemedButtonProps>(function AppleButton(
  {
    variant = 'primary',
    size = 'fat',
    label,
    children,
    onClick,
    className,
    style,
    disabled = false,
    ariaLabel,
    leadingIcon,
    trailingIcon,
    selected = false,
    onMouseEnter,
    onMouseLeave,
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const internalRef = useRef<HTMLButtonElement | null>(null);
  const prevSelectedRef = useRef<boolean>(selected);

  const setButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  // Trigger sproing when selected state changes (e.g. keyboard navigation in GameMenu)
  useEffect(() => {
    const wasSelected = prevSelectedRef.current;
    prevSelectedRef.current = selected;

    if (disabled || !internalRef.current) return;

    if (selected && !wasSelected) {
      playSproingHover(internalRef.current);
    } else if (!selected && wasSelected && !isHovered) {
      playSproingRest(internalRef.current);
    }
  }, [selected, disabled, isHovered]);

  // Clean up any active GSAP tweens on unmount
  useEffect(() => {
    return () => {
      if (internalRef.current) {
        gsap.killTweensOf(internalRef.current);
      }
    };
  }, []);

  // Geometry calibration by size
  const sizeStyles: Record<
    'sm' | 'md' | 'lg' | 'fat',
    {
      minHeight: string;
      padding: string;
      fontSize: string;
      fontWeight: number;
      letterSpacing: string;
      gap: string;
    }
  > = {
    sm: {
      minHeight: '36px',
      padding: '8px 18px',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: '-0.012em',
      gap: '6px',
    },
    md: {
      minHeight: '44px',
      padding: '10px 24px',
      fontSize: '16px',
      fontWeight: 600,
      letterSpacing: '-0.016em',
      gap: '8px',
    },
    lg: {
      minHeight: '52px',
      padding: '12px 28px',
      fontSize: '17px',
      fontWeight: 700,
      letterSpacing: '-0.020em',
      gap: '10px',
    },
    fat: {
      minHeight: '56px',
      padding: '14px 32px',
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '-0.024em',
      gap: '12px',
    },
  };

  const currentSize = sizeStyles[size] ?? sizeStyles.fat;

  // Primary: #FCFF20, Secondary (rollover / selected): #FFFFFF, Text: #000000 (Black)
  const isHighlighted = selected || isHovered || isActive;

  let background = '#FCFF20';
  const color = '#000000';
  let border = '1px solid rgba(0, 0, 0, 0.12)';
  let boxShadow =
    '0 3px 12px rgba(252, 255, 32, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)';

  if (variant === 'primary') {
    if (disabled) {
      background = 'rgba(252, 255, 32, 0.3)';
      border = '1px solid rgba(0, 0, 0, 0.08)';
      boxShadow = 'none';
    } else if (isHighlighted) {
      // Secondary colour for rollovers, selected items, and active states
      background = '#FFFFFF';
      boxShadow =
        '0 4px 18px rgba(255, 255, 255, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.8)';
    } else {
      background = 'linear-gradient(180deg, #fdfd5e 0%, #FCFF20 100%)';
    }
  } else if (variant === 'secondary') {
    background = isHighlighted ? '#f5f5f7' : '#FFFFFF';
    border = '1px solid rgba(0, 0, 0, 0.12)';
    boxShadow = isHighlighted
      ? '0 4px 16px rgba(255, 255, 255, 0.5)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)';
  } else if (variant === 'frosted') {
    background = isHighlighted
      ? 'rgba(255, 255, 255, 0.45)'
      : 'rgba(252, 255, 32, 0.25)';
    border = '1px solid rgba(0, 0, 0, 0.15)';
    boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
  } else if (variant === 'outline') {
    background = isHighlighted ? '#FFFFFF' : 'transparent';
    border = '2px solid #FCFF20';
    boxShadow = 'none';
  }

  // Focus ring
  if (isFocused && !disabled) {
    boxShadow = `${boxShadow ? `${boxShadow}, ` : ''}0 0 0 4px ${appleTheme.palette.focusRing}`;
  }

  const computedStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: currentSize.minHeight,
    padding: currentSize.padding,
    borderRadius: appleTheme.radii.pill,
    fontFamily: appleTheme.typography.headlineFontFamily,
    fontSize: currentSize.fontSize,
    fontWeight: currentSize.fontWeight,
    letterSpacing: currentSize.letterSpacing,
    lineHeight: 1.2,
    color: disabled ? 'rgba(0, 0, 0, 0.35)' : color,
    background,
    border,
    boxShadow,
    transformOrigin: 'center center',
    willChange: 'transform',
    gap: currentSize.gap,
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <button
      ref={setButtonRef}
      type="button"
      className={`modern-flash-theme-apple-button ${className ?? ''}`.trim()}
      style={computedStyle}
      onClick={() => {
        if (disabled) return;
        playSproingActivate(internalRef.current, isHovered || selected);
        onClick?.();
      }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          setIsHovered(true);
          playSproingHover(internalRef.current);
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        setIsHovered(false);
        setIsActive(false);
        if (!disabled && !selected) {
          playSproingRest(internalRef.current);
        }
        onMouseLeave?.(e);
      }}
      onMouseDown={() => {
        if (disabled) return;
        setIsActive(true);
        playSproingPress(internalRef.current);
      }}
      onMouseUp={() => {
        if (!disabled) setIsActive(false);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          setIsActive(true);
          playSproingPress(internalRef.current);
        }
      }}
      onKeyUp={(e: KeyboardEvent<HTMLButtonElement>) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          setIsActive(false);
        }
      }}
      onFocus={(_e: FocusEvent<HTMLButtonElement>) => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
      role={selected !== undefined ? 'menuitem' : undefined}
      aria-selected={selected}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
    >
      {leadingIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{leadingIcon}</span>}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'inline-block',
        }}
      >
        {label ?? children}
      </span>
      {trailingIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{trailingIcon}</span>}
    </button>
  );
});

export default Button;
