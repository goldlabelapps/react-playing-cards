import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import { playSound } from '../../Sound';
import { StarWars } from '../StarWars';
import { LightningBolt } from '../LightningBolt';
import { Blackjack } from '../Blackjack';
import { Pingpongball } from '../Pingpongball';
import { PokerDice } from '../PokerDice';
import { SpriteMC } from '../Sprite';
import { AgentText } from '../Typography/AgentText';
import { Button as AppleButton } from '../../themes/apple';
import type { GameMenuItem, GameMenuProps } from './types';

function PingpongStage() {
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ballRef.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(el, {
      y: 110,
      duration: 0.55,
      ease: 'power2.in',
    })
      .to(el, {
        scaleX: 1.4,
        scaleY: 0.6,
        duration: 0.08,
        ease: 'power1.out',
      })
      .to(el, {
        scaleX: 0.9,
        scaleY: 1.15,
        y: -110,
        duration: 0.55,
        ease: 'power2.out',
      })
      .to(el, {
        scaleX: 1.25,
        scaleY: 0.75,
        duration: 0.08,
        ease: 'power1.out',
      });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div ref={ballRef} style={{ position: 'relative', width: 56, height: 56 }}>
        <Pingpongball color="#F59E0B" size={56} style={{ filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.75))' }} />
      </div>
    </div>
  );
}

export function GameMenu({
  items: customItems,
  onNavigate,
  onSelectMovie,
  width = '100%',
  height = '100%',
  className,
  style,
  title: _title = 'GAME MENU',
  onBackToTop,
  onReplayStory: _onReplayStory,
  soundEnabled = true,
  children,
}: GameMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sound triggers
  const triggerSound = useCallback(
    (type: 'blip' | 'accept' | 'cancel') => {
      if (!soundEnabled) return;
      try {
        if (type === 'blip') {
          playSound('arcade/beep-01', { volume: 0.35 });
        } else if (type === 'accept') {
          playSound('pickups/coin-01', { volume: 0.45 });
        } else if (type === 'cancel') {
          playSound('ui/cancel-01', { volume: 0.4 });
        }
      } catch {
        // Audio context may require user interaction first
      }
    },
    [soundEnabled]
  );

  // Flash Logo Home Item
  const flashLogoItem: GameMenuItem = {
    id: 'flash-logo',
    label: 'Home',
    description: 'Return to stage home',
    badge: 'HOME',
    icon: '⚡',
    route: '/',
  };

  // Default menu covering primary options including the Flash logo
  const defaultItems: GameMenuItem[] = [
    flashLogoItem,
    {
      id: 'poker-dice',
      label: 'Poker Dice',
      description: 'Single die vector placeholder graphic',
      badge: 'DICE',
      icon: '🎲',
      movie: 'poker-dice',
    },
    {
      id: 'pingpong',
      label: 'Pingpong Ball',
      description: 'High-velocity vector ball rally across stage bounds',
      badge: 'ARCADE',
      icon: '🏓',
      movie: 'pingpong',
    },
  ];

  const rootItems = customItems
    ? customItems.some((it) => it.id === 'flash-logo' || it.id === 'flash-home')
      ? customItems
      : [flashLogoItem, ...customItems]
    : defaultItems;

  // Navigation state
  // navStack contains previous parent items. Empty means we are at top level.
  const [navStack, setNavStack] = useState<GameMenuItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeMovie, setActiveMovie] = useState<string | null>(null);

  // Active items at the current depth
  const currentItems =
    navStack.length === 0
      ? rootItems
      : navStack[navStack.length - 1].children ?? [];

  const currentSelectedItem = currentItems[selectedIndex] ?? currentItems[0];

  // Activate a specific menu item
  const activateItem = useCallback(
    (item: GameMenuItem) => {
      if (!item || item.disabled) return;

      triggerSound('accept');

      // If item has children, drill down into submenu
      if (item.children && item.children.length > 0) {
        setNavStack((prev) => [...prev, item]);
        setSelectedIndex(0);
        return;
      }

      // If item launches a movie demo
      if (item.movie) {
        if (onSelectMovie) {
          onSelectMovie(item.movie);
        }
        setActiveMovie(item.movie);
        return;
      }

      // If item navigates to route
      if (item.route) {
        if (onNavigate) {
          onNavigate(item.route);
        } else if (typeof window !== 'undefined') {
          window.location.pathname = item.route;
        }
        return;
      }

      // If item has custom action
      if (item.action) {
        item.action();
      }
    },
    [onNavigate, onSelectMovie, triggerSound]
  );

  // Red Button (Back, Cancel)
  const handleBack = useCallback(() => {
    triggerSound('cancel');

    // If currently previewing a movie demo, exit back to the menu
    if (activeMovie) {
      setActiveMovie(null);
      return;
    }

    // If inside a submenu, pop back up one level
    if (navStack.length > 0) {
      setNavStack((prev) => prev.slice(0, prev.length - 1));
      setSelectedIndex(0);
      return;
    }

    // At top level menu: trigger onBackToTop if provided
    if (onBackToTop) {
      onBackToTop();
    }
  }, [activeMovie, navStack.length, onBackToTop, triggerSound]);

  // Accept current keyboard selection
  const handleAccept = useCallback(() => {
    if (activeMovie) {
      handleBack();
      return;
    }
    if (currentSelectedItem) {
      activateItem(currentSelectedItem);
    }
  }, [activeMovie, handleBack, currentSelectedItem, activateItem]);

  // Navigate Up
  const handleMoveUp = useCallback(() => {
    if (activeMovie) return;
    triggerSound('blip');
    setSelectedIndex((prev) =>
      prev <= 0 ? currentItems.length - 1 : prev - 1
    );
  }, [activeMovie, currentItems.length, triggerSound]);

  // Navigate Down
  const handleMoveDown = useCallback(() => {
    if (activeMovie) return;
    triggerSound('blip');
    setSelectedIndex((prev) =>
      prev >= currentItems.length - 1 ? 0 : prev + 1
    );
  }, [activeMovie, currentItems.length, triggerSound]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMoveUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMoveDown();
          break;
        case 'Enter':
        case ' ':
        case 'a':
        case 'A':
          e.preventDefault();
          handleAccept();
          break;
        case 'Escape':
        case 'Backspace':
        case 'b':
        case 'B':
          e.preventDefault();
          handleBack();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMoveUp, handleMoveDown, handleAccept, handleBack]);

  // Fast GSAP entrance tween on mount or depth change
  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.16, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [navStack.length, activeMovie]);

  // Render movie demo preview when selected
  const renderActiveMovie = () => {
    switch (activeMovie) {
      case 'starwars':
      case 'macromedia':
        return <StarWars color="#E5252A" />;
      case 'lightning':
        return <LightningBolt width="160px" height="260px" color="#FCFF20" />;
      case 'blackjack':
        return <Blackjack />;
      case 'poker-dice':
      case 'PokerDice':
        return <PokerDice onComplete={() => setActiveMovie(null)} />;
      case 'pingpong':
        return <PingpongStage />;
      case 'sprite':
        return <SpriteMC size={90} />;
      case 'agent-text':
        return <AgentText title="Running `check apps/web contents`" status="active" />;
      case 'apple-button':
      case 'apple':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              width: '100%',
              maxWidth: '380px',
              padding: '16px',
              boxSizing: 'border-box',
            }}
          >
            <AppleButton size="fat" label="Primary Button" style={{ width: '100%' }} />
            <AppleButton size="fat" selected label="Selected Button" style={{ width: '100%' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flash-game-menu ${className ?? ''}`.trim()}
      style={{
        position: 'relative',
        width,
        height,
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(12px, 2vw, 24px)',
        boxSizing: 'border-box',
        color: '#f8fafc',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        userSelect: 'none',
        ...style,
      }}
      role="menu"
      aria-label="Video Game Navigation Menu"
    >
      {/* Main Display Stage Area (Zero Scrolling) */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'stretch',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {activeMovie ? (
          // In-Stage Movie Clip Preview
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderActiveMovie()}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
              }}
            >
              <AppleButton
                size="sm"
                selected
                label="Back"
                onClick={handleBack}
              />
            </div>
          </div>
        ) : (
          // Single Column Full-Width Apple Buttons (Zero Scrolling)
          <div
            style={{
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              ref={listRef}
              style={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {navStack.length > 0 && (
                <AppleButton
                  key="nav-back-button"
                  label="Back"
                  size="fat"
                  onClick={handleBack}
                  style={{ width: '100%', maxWidth: '400px' }}
                />
              )}
              {currentItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;

                if (item.id === 'flash-logo' || item.id === 'flash-home') {
                  return (
                    <a
                      key={item.id}
                      href={item.route ?? '/'}
                      aria-label={item.label || 'Home'}
                      title={item.label || 'Home'}
                      role="menuitem"
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#111827' : '#0a0f1d',
                        border: isSelected ? '2px solid #FCFF20' : '2px solid #2A2A2A',
                        boxShadow: isSelected
                          ? '0 0 18px rgba(252, 255, 32, 0.65), 3px 3px 0px 0px #FFB020'
                          : '3px 3px 0px 0px #2A2A2A, 0 4px 12px rgba(0, 0, 0, 0.4)',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        outline: 'none',
                        marginBottom: '8px',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        transition:
                          'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease, background-color 0.16s ease',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedIndex(idx);
                        activateItem(item);
                      }}
                      onMouseEnter={() => {
                        setSelectedIndex(idx);
                        triggerSound('blip');
                      }}
                    >
                      <LightningBolt
                        width="24px"
                        height="48px"
                        fillColor={isSelected ? '#FCFF20' : '#FFB020'}
                        frontColor="#FFFFFF"
                        backColor="#FFFFFF"
                        strokeColor="#000000"
                      />
                    </a>
                  );
                }

                return (
                  <AppleButton
                    key={item.id}
                    label={item.label}
                    size="fat"
                    selected={isSelected}
                    onClick={() => {
                      setSelectedIndex(idx);
                      activateItem(item);
                    }}
                    onMouseEnter={() => {
                      setSelectedIndex(idx);
                      triggerSound('blip');
                    }}
                    style={{ width: '100%', maxWidth: '400px' }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>

      {children}
    </div>
  );
}

export default GameMenu;
