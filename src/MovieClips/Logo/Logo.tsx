import type { LogoProps } from '../../types';
import { MACROMEDIA_FLASH_PATH } from '../Macromedia/constants';

export type { LogoProps } from '../../types';

export function Logo({
  text = 'Flash',
  color = '#4C979C',
  size = 48,
}: LogoProps) {
  return (
    <div
      aria-label={`Logo ${text}`}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <svg
        width={size * 4}
        height={size * 1.8}
        viewBox="0 0 512 216"
        style={{ overflow: 'visible' }}
      >
        <g fill={color} fillRule="nonzero">
          <path d={MACROMEDIA_FLASH_PATH} id="flashIconBlack" />
        </g>
      </svg>
      {text && text !== 'Flash' && (
        <span
          style={{
            marginTop: 8,
            color,
            fontSize: Math.max(12, size * 0.4),
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

export default Logo;
