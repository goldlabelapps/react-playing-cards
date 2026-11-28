import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';
import { Stage } from './Stage';
import { Logo } from './MovieClips/Logo';
import { Pingpongball } from './MovieClips/Pingpongball';
import { SpriteMC } from './MovieClips/Sprite';
import { Blackjack } from './MovieClips/Blackjack';
import { PokerDice } from './MovieClips/PokerDice';
import { LightningBolt } from './MovieClips/LightningBolt';
import { Base, Rank, Suit } from './MovieClips/PlayingCards';
import { TitleText, AgentText } from './MovieClips/Typography';
import { StarWars } from './MovieClips/StarWars';
import { FlashStory } from './MovieClips/FlashStory';
import { GameMenu } from './MovieClips/GameMenu';
import { SoundFX } from './MovieClips/SoundFX';
import { getActionScript, corkScrew } from './ActionScript';
import type { FlashHandle, FlashProps, PromptSceneElement } from './types';

export const Flash = forwardRef<FlashHandle, FlashProps>(function Flash(
  {
    movie,
    scene,
    width = '100%',
    height = '100%',
    color = 'transparent',
    loop = false,
    autoPlay = true,
    speed = 1,
    debug = false,
    children,
    className,
    style,
    onComplete,
    onNavigate,
  },
  ref,
) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      timelineRef.current?.play();
    },
    pause: () => {
      timelineRef.current?.pause();
    },
    restart: () => {
      timelineRef.current?.restart();
    },
    seek: (position: number) => {
      timelineRef.current?.seek(position);
    },
    corkScrew: (direction, options) => {
      const target = targetRef.current;
      if (!target) return null;
      return corkScrew(target, direction, options);
    },
    corkscrew: (direction, options) => {
      const target = targetRef.current;
      if (!target) return null;
      return corkScrew(target, direction, options);
    },
  }));

  // Handle scene-based animations or movie-based ActionScripts
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    let tl: gsap.core.Timeline | null = null;

    if (scene && scene.elements.length > 0) {
      // Build master timeline from declarative prompt scene
      tl = gsap.timeline({
        repeat: loop ? -1 : 0,
        onComplete,
      });
      tl.timeScale(speed);

      scene.elements.forEach((element) => {
        const elNode = target.querySelector<HTMLElement>(`[data-element-id="${element.id}"]`);
        if (!elNode) return;

        const actionScript = getActionScript(element.animation.actionScript);
        if (actionScript) {
          const subTl = actionScript({
            target: elNode,
            loop: false,
            speed,
            params: element.animation.options,
          });
          tl?.add(subTl, element.animation.delay ?? 0);
        } else {
          // Default fade-and-scale entry
          tl?.fromTo(
            elNode,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: element.animation.duration ?? 0.8,
              ease: 'power2.out',
            },
            element.animation.delay ?? 0,
          );
        }
      });
    } else if (movie) {
      const actionScript = getActionScript(movie);
      if (actionScript) {
        tl = actionScript({
          target,
          loop,
          speed,
          onComplete,
        });
      }
    }

    if (tl) {
      timelineRef.current = tl;
      if (autoPlay) {
        tl.play();
      } else {
        tl.pause(0);
      }
    }

    return () => {
      tl?.kill();
      timelineRef.current = null;
      gsap.set(target, { clearProps: 'transform,opacity' });
    };
  }, [movie, scene, loop, autoPlay, speed, onComplete]);

  const renderSceneElement = (el: PromptSceneElement) => {
    const commonStyle = {
      position: 'absolute' as const,
      left: el.x !== undefined ? `${el.x}%` : '50%',
      top: el.y !== undefined ? `${el.y}%` : '50%',
      transform: `translate(-50%, -50%) scale(${el.scale ?? 1})`,
    };

    switch (el.type) {
      case 'card': {
        const suit = (el.props.suit as string) || 'S';
        const rank = (el.props.rank as string) || 'A';
        const cardColor = ['H', 'D'].includes(suit) ? '#dc2626' : '#0f172a';
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <div style={{ position: 'relative', width: 140, height: 196 }}>
              <Base width={140} height={196} />
              <Suit suit={suit} style={{ position: 'absolute', top: 12, right: 12, width: 48 }} />
              <Rank card={{ rank, suit, color: cardColor }} style={{ position: 'absolute', top: 12, left: 12, width: 36 }} />
            </div>
          </div>
        );
      }
      case 'ball':
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <Pingpongball color={(el.props.color as string) || '#C09F52'} size={(el.props.size as number) || 48} />
          </div>
        );
      case 'logo':
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <Logo text={(el.props.text as string) || 'Flash'} color={(el.props.color as string) || '#15868F'} size={(el.props.size as number) || 32} />
          </div>
        );
      case 'title':
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <TitleText text={(el.props.text as string) || 'Flash Animation'} color={(el.props.color as string) || '#ffffff'} />
          </div>
        );
      case 'lightning':
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <LightningBolt width="180px" height="300px" color={(el.props.color as string) || '#FCFF20'} />
          </div>
        );
      case 'sprite':
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <SpriteMC size={(el.props.size as number) || 80} />
          </div>
        );
      case 'starwars':
      case 'StarWars':
      case 'macromedia':
        return (
          <div key={el.id} data-element-id={el.id} style={commonStyle}>
            <StarWars color={(el.props.color as string) || '#E5252A'} />
          </div>
        );
      case 'flash-story':
      case 'story':
        return (
          <div key={el.id} data-element-id={el.id} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <FlashStory loop={loop} autoPlay={autoPlay} speed={speed} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (scene && scene.elements.length > 0) {
      return scene.elements.map(renderSceneElement);
    }

    if (children) {
      return children;
    }

    switch (movie) {
      case 'logo':
      case 'nx':
        return <Logo />;
      case 'pingpong':
        return <Pingpongball />;
      case 'playing-cards':
      case 'deal':
        return (
          <div style={{ position: 'relative', width: 140, height: 196 }}>
            <Base width={140} height={196} />
            <Suit suit="S" style={{ position: 'absolute', top: 12, right: 12, width: 48 }} />
            <Rank card={{ rank: 'A', suit: 'S', color: '#0f172a' }} style={{ position: 'absolute', top: 12, left: 12, width: 36 }} />
          </div>
        );
      case 'blackjack':
        return <Blackjack />;
      case 'poker-dice':
      case 'PokerDice':
        return <PokerDice />;
      case 'sprite':
      case 'sprite-demo':
        return <SpriteMC />;
      case 'lightning':
        return <LightningBolt />;
      case 'starwars':
      case 'StarWars':
      case 'macromedia':
        return <StarWars />;
      case 'agent-text':
      case 'AgentText':
        return <AgentText />;
      case 'sound-fx':
      case 'soundfx':
      case 'SoundFX':
        return <SoundFX />;
      case 'game-menu':
      case 'GameMenu':
        return <GameMenu onNavigate={onNavigate} />;
      case 'flash-story':
      case 'FlashStory':
        return (
          <FlashStory
            loop={loop}
            autoPlay={autoPlay}
            speed={speed}
            onComplete={onComplete}
            onNavigate={onNavigate}
          />
        );
      default:
        return (
          <FlashStory
            loop={loop}
            autoPlay={autoPlay}
            speed={speed}
            onComplete={onComplete}
            onNavigate={onNavigate}
          />
        );
    }
  };

  const stageColor = scene?.stage?.color || color;
  const stageWidth = scene?.stage?.width || width;
  const stageHeight = scene?.stage?.height || height;
  const viewBox = scene?.stage?.viewBox;

  return (
    <Stage
      ref={targetRef}
      width={stageWidth}
      height={stageHeight}
      color={stageColor}
      viewBox={viewBox}
      className={className}
      style={style}
    >
      {renderContent()}
      {debug && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            background: 'rgba(0,0,0,0.75)',
            color: '#10b981',
            fontFamily: 'monospace',
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 3,
            zIndex: 9999,
          }}
        >
          {scene ? `Scene: ${scene.title}` : `Movie: ${movie ?? 'custom'}`}
        </div>
      )}
    </Stage>
  );
});
