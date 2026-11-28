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
        padding: 0,
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000000',
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
          loop={false}
          autoPlay={true}
          width="100%"
          height="100%"
          color="transparent"
          onNavigate={(path) => {
            window.location.href = path;
          }}
        />
      ) : null}
    </figure>
  );
}

export default InteractiveStage;
