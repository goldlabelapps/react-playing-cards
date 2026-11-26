import React, { forwardRef } from 'react';

export interface TitleTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text content to display, typically an event title or headline. */
  text: string;
  /** Primary text color (default: #000000). */
  color?: string;
  /** Text alignment across multiple lines (default: 'center'). */
  align?: 'center' | 'left' | 'right';
  /** Whether to dynamically scale typography down for longer multi-line titles (default: true). */
  autoSize?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TitleText - Responsive typographic MovieClip designed for promotional headlines.
 * Automatically wraps multi-line titles and scales font size based on text length
 * to ensure optimal visual balance on constrained stages (e.g. mobile viewports).
 */
export const TitleText = forwardRef<HTMLDivElement, TitleTextProps>(
  function TitleText(
    {
      text,
      color = '#000000',
      align = 'center',
      autoSize = true,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    // Dynamic typography scaling based on character length for optimal multi-line balance
    let fontSize = '1.75rem';
    let lineHeight = 1.2;
    const len = text ? text.trim().length : 0;

    if (autoSize) {
      if (len > 60) {
        fontSize = '1.125rem';
        lineHeight = 1.35;
      } else if (len > 35) {
        fontSize = '1.35rem';
        lineHeight = 1.3;
      } else if (len > 20) {
        fontSize = '1.5rem';
        lineHeight = 1.25;
      }
    }

    return (
      <div
        ref={ref}
        data-testid="flash-title-text"
        className={className}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '320px',
          padding: '0 1.25rem',
          textAlign: align,
          color,
          fontSize,
          fontWeight: 800,
          lineHeight,
          letterSpacing: '-0.025em',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0,
          ...style,
        }}
        {...rest}
      >
        {text}
      </div>
    );
  },
);

TitleText.displayName = 'TitleText';
export default TitleText;
