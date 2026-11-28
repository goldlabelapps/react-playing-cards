import {
  useState,
  forwardRef,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { LightningBolt } from '../../MovieClips/LightningBolt';
import { playSound } from '../../Sound';
import type { HomeBtnProps } from './types';

export const HomeBtn = forwardRef<HTMLButtonElement, HomeBtnProps>(function HomeBtn(
  {
    label = 'Modern Flash',
    size = 'md',
    onClick,
    selected = false,
    disabled = false,
    className,
    style,
    ariaLabel,
    leadingIcon,
    soundEnabled = true,
    onMouseEnter,
    onMouseLeave,
    children,
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isHighlighted = selected || isHovered || isActive;

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
      iconWidth: string;
      iconHeight: string;
    }
  > = {
    sm: {
      minHeight: '36px',
      padding: '6px 16px',
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '-0.012em',
      gap: '6px',
      iconWidth: '14px',
      iconHeight: '24px',
    },
    md: {
      minHeight: '44px',
      padding: '10px 22px',
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '-0.016em',
      gap: '8px',
      iconWidth: '16px',
      iconHeight: '28px',
    },
    lg: {
      minHeight: '50px',
      padding: '12px 26px',
      fontSize: '17px',
      fontWeight: 700,
      letterSpacing: '-0.020em',
      gap: '10px',
      iconWidth: '18px',
      iconHeight: '30px',
    },
    fat: {
      minHeight: '56px',
      padding: '14px 30px',
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '-0.024em',
      gap: '12px',
      iconWidth: '20px',
      iconHeight: '34px',
    },
  };

  const currentSize = sizeStyles[size] ?? sizeStyles.md;

  // Inverted colour contract:
  // Default: Black background (#000000), White text (#FFFFFF), White icon (#FFFFFF)
  // Rollover / Selected: White background (#FFFFFF), Black text (#000000), Black icon (#000000)
  const backgroundColor = isHighlighted ? '#FFFFFF' : '#000000';
  const textColor = isHighlighted ? '#000000' : '#FFFFFF';
  const borderColor = isHighlighted ? 'rgba(0, 0, 0, 0.16)' : 'transparent';
  const boltFillColor = isHighlighted ? '#000000' : '#FFFFFF';

  const defaultIcon = (
    <LightningBolt
      width={currentSize.iconWidth}
      height={currentSize.iconHeight}
      color={boltFillColor}
      frontColor={isHighlighted ? '#FFFFFF' : '#111827'}
      backColor={isHighlighted ? '#111827' : '#111827'}
      strokeColor={boltFillColor}
    />
  );

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    minHeight: currentSize.minHeight,
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    fontWeight: currentSize.fontWeight,
    letterSpacing: currentSize.letterSpacing,
    lineHeight: 1,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
    borderRadius: '9999px',
    border: `1px solid ${borderColor}`,
    backgroundColor,
    color: textColor,
    boxShadow: isHighlighted
      ? '0 4px 18px rgba(255, 255, 255, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.8)'
      : 'none',
    transform: isActive ? 'scale(0.97)' : isHighlighted ? 'scale(1.02)' : 'scale(1)',
    transition:
      'background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, transform 0.12s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    outline: isFocused ? '2px solid #FFFFFF' : 'none',
    outlineOffset: '2px',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
    textDecoration: 'none',
    ...style,
  };

  const handlePointerEnter = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsHovered(true);
    if (soundEnabled) {
      try {
        playSound('ui/hover-01', { volume: 0.18 });
      } catch {}
    }
    onMouseEnter?.(e);
  };

  const handlePointerLeave = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    setIsActive(false);
    onMouseLeave?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="button"
      aria-label={ariaLabel || label}
      aria-pressed={selected}
      disabled={disabled}
      className={`flash-home-btn ${className ?? ''}`.trim()}
      style={baseStyle}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => !disabled && setIsActive(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        setIsActive(false);
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginRight: currentSize.gap,
        }}
        aria-hidden="true"
      >
        {leadingIcon !== undefined ? leadingIcon : defaultIcon}
      </span>
      <span>{children ?? label}</span>
    </button>
  );
});

export default HomeBtn;
