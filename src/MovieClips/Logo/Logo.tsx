import type { LogoProps } from '../../types';

export type { LogoProps } from '../../types';

export function Logo({
  text = 'Flash',
  color = '#ffffff',
  size = 28,
}: LogoProps) {
  return (
    <div
      aria-label="Logo"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  );
}

export default Logo;
