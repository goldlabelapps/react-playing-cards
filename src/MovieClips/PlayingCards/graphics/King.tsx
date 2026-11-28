import type { ReactElement } from 'react';
import type { CardGraphicProps } from '../types';

const makeGraphic = ({ card: _card, ...svgProps }: CardGraphicProps, svg: ReactElement) => {
  return (
    <svg {...svgProps} viewBox="0 0 60 94">
      {svg}
    </svg>
  );
};

export function King(props: CardGraphicProps) {
  return makeGraphic(
    props,
    <g stroke="#0A0B09" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* Raised royal broadsword behind right shoulder */}
      <g>
        <path
          d="M49.5,11 L52,5 L54.5,11 L54.2,52 L49.8,52 Z"
          fill="#FFFFFE"
        />
        <line x1="52" y1="9" x2="52" y2="50" stroke="#3C779B" strokeWidth="1" />
        {/* Gold crossguard and pommel */}
        <path
          d="M44.5,52 L59,52 L59,55.5 L44.5,55.5 Z"
          fill="#F5CB3C"
        />
        <rect x="50" y="55.5" width="4" height="8" rx="1" fill="#D9252A" />
        <circle cx="52" cy="65.5" r="2.8" fill="#F5CB3C" />
      </g>

      {/* Outer crimson royal cloak and shoulders */}
      <path
        d="M5,92 L7,63 C8,54 14,49 22,47 L38,47 C46,49 52,54 53,63 L55,92 Z"
        fill="#D9252A"
      />

      {/* Royal blue surcoat centre panel */}
      <path
        d="M15,92 L17,53 L43,53 L45,92 Z"
        fill="#3C779B"
      />

      {/* Gold royal diagonal sash & vertical centre trim */}
      <path
        d="M16,56 L22,52 L44,80 L44,92 L38,92 L16,64 Z"
        fill="#F5CB3C"
      />
      <rect x="27.5" y="52" width="5" height="40" fill="#F5CB3C" />

      {/* Crimson & gold geometric robe stripes */}
      <path
        d="M10,68 L16,68 L15,92 L8,92 Z"
        fill="#F5CB3C"
      />
      <path
        d="M44,68 L50,68 L52,92 L45,92 Z"
        fill="#F5CB3C"
      />

      {/* White ermine collar & lapels */}
      <path
        d="M15,50 L30,58 L45,50 L42,46 L30,51 L18,46 Z"
        fill="#FFFFFE"
      />

      {/* Chest heart medallion */}
      <path
        d="M30,74 C27.2,71.2 24.5,69.2 24.5,66.8 C24.5,65.2 25.8,64 27.3,64 C28.4,64 29.3,64.6 30,65.6 C30.7,64.6 31.6,64 32.7,64 C34.2,64 35.5,65.2 35.5,66.8 C35.5,69.2 32.8,71.2 30,74 Z"
        fill="#D9252A"
      />

      {/* Gold curled hair locks framing face */}
      <path
        d="M17,22 C12,24 10,30 11,37 C11.5,41 13,44 15.5,45.5 L19,43 L19,24 Z"
        fill="#F5CB3C"
      />
      <path
        d="M43,22 C48,24 50,30 49,37 C48.5,41 47,44 44.5,45.5 L41,43 L41,24 Z"
        fill="#F5CB3C"
      />
      {/* Hair curl accents */}
      <path d="M13.5,31 C12.5,34 13.5,37 15.5,38" fill="none" strokeWidth="1.1" />
      <path d="M46.5,31 C47.5,34 46.5,37 44.5,38" fill="none" strokeWidth="1.1" />

      {/* Face */}
      <path
        d="M18,22 L42,22 L42,36 C42,43 36.8,48 30,48 C23.2,48 18,43 18,36 Z"
        fill="#FFFFFE"
      />

      {/* Facial features: eyebrows, eyes, nose */}
      <path d="M21.5,27.5 Q24.5,25.8 27.5,27.2" fill="none" strokeWidth="1.3" />
      <path d="M32.5,27.2 Q35.5,25.8 38.5,27.5" fill="none" strokeWidth="1.3" />
      <circle cx="24.5" cy="30.2" r="1.4" fill="#0A0B09" stroke="none" />
      <circle cx="35.5" cy="30.2" r="1.4" fill="#0A0B09" stroke="none" />
      <path d="M30,28.5 L29,34.5 L31.2,34.8" fill="none" strokeWidth="1.2" />

      {/* Full sculpted royal beard */}
      <path
        d="M17.5,35 C17,43 21.5,51.5 30,52.5 C38.5,51.5 43,43 42.5,35 C40.5,38 38,39.5 35.5,39.5 L24.5,39.5 C22,39.5 19.5,38 17.5,35 Z"
        fill="#F5CB3C"
      />
      {/* Beard texture curls */}
      <path d="M23,44 Q26,47.5 30,47.5 Q34,47.5 37,44" fill="none" strokeWidth="1.1" />
      <path d="M26,48.5 Q30,50.5 34,48.5" fill="none" strokeWidth="1.1" />

      {/* Regal curling moustache & mouth */}
      <path
        d="M30,37.8 C27.5,36.2 23.5,36.5 21,39.2 C23.5,40.4 27.2,39.8 30,39.2 C32.8,39.8 36.5,40.4 39,39.2 C36.5,36.5 32.5,36.2 30,37.8 Z"
        fill="#FFFFFE"
      />
      <path d="M27.5,41.6 Q30,42.8 32.5,41.6" fill="none" stroke="#D9252A" strokeWidth="1.3" />

      {/* Crown velvet interior cap */}
      <path
        d="M17,17 L21,9 L30,13 L39,9 L43,17 Z"
        fill="#D9252A"
      />

      {/* Ornate gold royal crown */}
      <path
        d="M15,22 L13,9 L22,15 L30,5 L38,15 L47,9 L45,22 Z"
        fill="#F5CB3C"
      />
      {/* Crown headband with jewels */}
      <rect x="15" y="18.5" width="30" height="4.2" rx="1" fill="#3C779B" />
      <circle cx="22" cy="20.6" r="1.3" fill="#F5CB3C" stroke="none" />
      <circle cx="30" cy="20.6" r="1.5" fill="#D9252A" stroke="none" />
      <circle cx="38" cy="20.6" r="1.3" fill="#F5CB3C" stroke="none" />

      {/* Crown tip pearls / finials */}
      <circle cx="13" cy="7.5" r="2" fill="#F5CB3C" />
      <circle cx="30" cy="3.8" r="2.3" fill="#F5CB3C" />
      <circle cx="47" cy="7.5" r="2" fill="#F5CB3C" />

      {/* Hand gripping sword hilt */}
      <path
        d="M44,54 C44,51.8 46.2,50.5 48.5,51.2 L52.5,52.2 C53.8,52.6 54.2,54.8 53,55.8 L48,57 C45.8,57.5 44,56 44,54 Z"
        fill="#FFFFFE"
      />
    </g>
  );
}

export default King;
