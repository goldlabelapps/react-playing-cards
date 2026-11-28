'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Flash,
  HomeBtn,
  PokerDice,
  SoundFX,
  soundManager,
  type MovieName,
} from 'modern-flash';

export interface InteractiveStageProps {
  movie?: MovieName;
  slug?: string;
  loop?: boolean;
  speed?: number;
  showHomeButton?: boolean;
}

export function InteractiveStage({
  movie = 'FlashStory',
  slug,
  loop = false,
  speed = 1,
  showHomeButton = false,
}: InteractiveStageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [homeSelected, setHomeSelected] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      soundManager.stopAll();
    };
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      soundManager.stopAll();
      router.push(path);
    },
    [router]
  );

  const handleSelectMovie = useCallback(
    (selectedMovie: string) => {
      soundManager.stopAll();
      router.push(`/${selectedMovie.toLowerCase()}`);
      return true;
    },
    [router]
  );

  const handleReturnToMenu = useCallback(() => {
    soundManager.stopAll();
    router.push('/menu');
  }, [router]);

  useEffect(() => {
    if (!showHomeButton || slug === 'poker-dice') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleReturnToMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHomeButton, slug, handleReturnToMenu]);

  const renderStageContent = () => {
    if (!mounted) {
      return null;
    }

    if (slug === 'poker-dice') {
      return (
        <PokerDice
          style={{ paddingTop: '88px' }}
          onHomeFocusChange={setHomeSelected}
          onComplete={handleReturnToMenu}
        />
      );
    }

    if (slug === 'sound-fx') {
      return <SoundFX onBack={handleReturnToMenu} />;
    }

    return (
      <Flash
        movie={movie}
        speed={speed}
        loop={loop}
        autoPlay={true}
        width="100%"
        height="100%"
        color="transparent"
        onNavigate={handleNavigate}
        onSelectMovie={handleSelectMovie}
      />
    );
  };

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
      {mounted && showHomeButton && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '400px',
            padding: '0 clamp(12px, 2vw, 24px)',
            boxSizing: 'border-box',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <HomeBtn
            size="fat"
            selected={homeSelected}
            onClick={handleReturnToMenu}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </div>
      )}
      {renderStageContent()}
    </figure>
  );
}

export default InteractiveStage;
