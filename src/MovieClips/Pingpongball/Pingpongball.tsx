import type { PingpongballProps } from '../../types';

export type { PingpongballProps } from '../../types';

export function Pingpongball({
  size = 24,
  color = '#C09F52',
  x = 0,
  y = 0,
}: PingpongballProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ position: 'absolute', left: x, top: y }}
    >
      <path
        d="M11.9316955,0.00778516743 C18.2793961,0.234625 23.2318292,5.339499 22.9916183,11.4103978 C22.7565183,17.4812966 17.4207699,22.2190224 11.0730694,21.9921826 C4.72536881,21.7653428 -0.227064254,16.6604688 0.00803576687,10.58957 C0.248246659,4.51867123 5.58399495,-0.218565786 11.9316955,0.00778516743 Z"
        fill={color}
      />
      <path
        d="M8,12 C12.6203742,21.9973959 20,13.9133228 20,13.9133228 C14.7209979,15.4126605 8,12 8,12 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default Pingpongball;
