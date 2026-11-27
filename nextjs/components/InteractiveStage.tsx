'use client';

import { useState, useEffect } from 'react';
import { Flash } from 'modern-flash';

export function InteractiveStage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <figure
      style={{
        margin: 0,
        position: 'relative',
        width: '100%',
        height: 420,
        backgroundColor: '#0f172a',
        borderRadius: 6,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {mounted ? (
        <Flash
          movie="FlashStory"
          speed={1}
          loop={true}
          autoPlay={true}
          width="100%"
          height="100%"
          color="transparent"
        />
      ) : (
        <div style={{ color: '#94a3b8', fontSize: 14 }}>
          Initialising vector stage surface...
        </div>
      )}
    </figure>
  );
}

export default InteractiveStage;
