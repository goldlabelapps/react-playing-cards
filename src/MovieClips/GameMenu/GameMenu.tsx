import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import { playSound } from '../../Sound';
import { Macromedia } from '../Macromedia';
import { LightningBolt } from '../LightningBolt';
import { Blackjack } from '../Blackjack';
import { Pingpongball } from '../Pingpongball';
import { SpriteMC } from '../Sprite';
import { AgentText } from '../Typography/AgentText';
import type { GameMenuItem, GameMenuProps } from './types';

export function GameMenu({
  items: customItems,
  onNavigate,
  onSelectMovie,
  width = '100%',
  height = '100%',
  className,
  style,
  title = 'GAME MENU',
  onBackToTop,
  onReplayStory,
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

  // Default menu tree covering the whole application
  const defaultItems: GameMenuItem[] = [
    {
      id: 'demos',
      label: 'Vector Demos',
      description: 'Interactive ActionScript vector animations',
      badge: '5 CLIPS',
      icon: '⚡',
      children: [
        {
          id: 'macromedia',
          label: 'Macromedia Starburst',
          description: 'Classic 1996 vector starburst emblem and laser sweep',
          badge: 'RETRO',
          icon: '✦',
          movie: 'macromedia',
        },
        {
          id: 'lightning',
          label: 'Lightning Surge',
          description: 'High-voltage electric discharge vector animation',
          badge: 'SURGE',
          icon: '⚡',
          movie: 'lightning',
        },
        {
          id: 'blackjack',
          label: 'Blackjack 21',
          description: 'Interactive playing card dealing table and score engine',
          badge: 'CARDS',
          icon: '♠',
          movie: 'blackjack',
        },
        {
          id: 'pingpong',
          label: 'Ping Pong Rally',
          description: 'High-velocity vector ball rally across stage bounds',
          badge: 'ARCADE',
          icon: '🏓',
          movie: 'pingpong',
        },
        {
          id: 'sprite',
          label: 'Animated Sprite',
          description: 'Retro 8-bit character animation cycle',
          badge: '8-BIT',
          icon: '👾',
          movie: 'sprite',
        },
      ],
    },
    {
      id: 'studio',
      label: 'Prompt Engine Studio',
      description: 'Natural language prompt to vector animation compiler',
      badge: 'EXPORTER',
      icon: '✨',
      route: '/examples',
    },
    {
      id: 'soundboard',
      label: 'Soundboard & SFX Library',
      description: 'Explore 108 curated arcade, UI, combat, and retro audio clips',
      badge: '108 SFX',
      icon: '🔊',
      route: '/sounds',
    },
    {
      id: 'agent',
      label: 'Agent Telemetry',
      description: 'Simulate background agent task status telemetry',
      badge: 'STORY',
      icon: '🤖',
      action: () => {
        if (onReplayStory) {
          onReplayStory();
        }
      },
    },
    {
      id: 'options',
      label: 'Display & Audio Options',
      description: 'Configure runtime options and sound effects',
      badge: 'SETUP',
      icon: '⚙️',
      children: [
        {
          id: 'test-sfx',
          label: 'Audition Coin Sound',
          description: 'Play retro arcade pickup audio trigger',
          badge: 'TEST',
          icon: '🪙',
          action: () => {
            playSound('pickups/coin-01', { volume: 0.6 });
          },
        },
        {
          id: 'test-jump',
          label: 'Audition Movement SFX',
          description: 'Play dynamic jump audio trigger',
          badge: 'TEST',
          icon: '💨',
          action: () => {
            playSound('movement/jump-01', { volume: 0.5 });
          },
        },
        {
          id: 'zero-scroll',
          label: 'Anti-Scrolling Invariant',
          description: 'Single viewport Flash runtime eliminating all scrolling',
          badge: 'CANVAS',
          icon: '🛡️',
        },
      ],
    },
  ];

  const rootItems = customItems ?? defaultItems;

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

  // Breadcrumb path display
  const breadcrumb = [
    title,
    ...navStack.map((item) => item.label.toUpperCase()),
  ].join(' > ');

  // Green Button (OK, Forward, Accept)
  const handleAccept = useCallback(() => {
    if (activeMovie) {
      // If previewing movie, accept restarts it
      triggerSound('accept');
      return;
    }

    if (!currentSelectedItem || currentSelectedItem.disabled) return;

    triggerSound('accept');

    // If item has children, drill down into submenu
    if (currentSelectedItem.children && currentSelectedItem.children.length > 0) {
      setNavStack((prev) => [...prev, currentSelectedItem]);
      setSelectedIndex(0);
      return;
    }

    // If item launches a movie demo
    if (currentSelectedItem.movie) {
      if (onSelectMovie) {
        onSelectMovie(currentSelectedItem.movie);
      }
      setActiveMovie(currentSelectedItem.movie);
      return;
    }

    // If item navigates to route
    if (currentSelectedItem.route) {
      if (onNavigate) {
        onNavigate(currentSelectedItem.route);
      } else if (typeof window !== 'undefined') {
        window.location.pathname = currentSelectedItem.route;
      }
      return;
    }

    // If item has custom action
    if (currentSelectedItem.action) {
      currentSelectedItem.action();
    }
  }, [
    activeMovie,
    currentSelectedItem,
    onNavigate,
    onSelectMovie,
    triggerSound,
  ]);

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
      case 'macromedia':
        return <Macromedia color="#E5252A" />;
      case 'lightning':
        return <LightningBolt width="160px" height="260px" frontColor="#38bdf8" />;
      case 'blackjack':
        return <Blackjack />;
      case 'pingpong':
        return <Pingpongball color="#C09F52" size={48} />;
      case 'sprite':
        return <SpriteMC size={90} />;
      case 'agent-text':
        return <AgentText title="Running `check apps/web contents`" status="active" />;
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
      {/* Top HUD Header: Breadcrumb & Level indicator */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #1e293b',
          paddingBottom: 8,
          marginBottom: 10,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              background: '#15868F',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid #2A2A2A',
            }}
          >
            MODERN FLASH
          </span>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#38bdf8',
            }}
          >
            {breadcrumb}
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#64748b',
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {activeMovie
            ? 'PREVIEW MODE'
            : navStack.length === 0
              ? 'TOP LEVEL'
              : `LEVEL ${navStack.length}`}
        </div>
      </header>

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
              background: 'rgba(7, 11, 20, 0.7)',
              border: '2px solid #2A2A2A',
              boxShadow: '4px 4px 0px 0px #2A2A2A',
              borderRadius: 8,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 12,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94a3b8',
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid #334155',
              }}
            >
              RUNNING CLIP: {activeMovie.toUpperCase()}
            </div>

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
          </div>
        ) : (
          // Video Game Menu Split: Items List on Left, Telemetry HUD on Right
          <>
            {/* Left Column: Menu Items List */}
            <div
              ref={listRef}
              style={{
                flex: '1 1 55%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 8,
                overflow: 'hidden',
              }}
            >
              {currentItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const hasChildren = Boolean(item.children?.length);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedIndex(idx);
                      // Second click on already selected item acts as accept
                      if (isSelected) {
                        handleAccept();
                      } else {
                        triggerSound('blip');
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: isSelected
                        ? 'linear-gradient(90deg, rgba(21, 134, 143, 0.35) 0%, rgba(13, 21, 39, 0.95) 100%)'
                        : '#0d1527',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      border: isSelected ? '2px solid #15868F' : '2px solid #1e293b',
                      borderLeft: isSelected ? '6px solid #15868F' : '2px solid #1e293b',
                      boxShadow: isSelected
                        ? '3px 3px 0px 0px #15868F'
                        : '2px 2px 0px 0px #070b14',
                      borderRadius: 6,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                      minHeight: 46,
                      boxSizing: 'border-box',
                    }}
                    role="menuitem"
                    aria-selected={isSelected}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontSize: 14,
                          color: isSelected ? '#38bdf8' : '#64748b',
                          fontWeight: 800,
                        }}
                      >
                        {isSelected ? '▶' : '•'}
                      </span>
                      {item.icon && (
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                      )}
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: isSelected ? 800 : 600,
                            letterSpacing: '-0.01em',
                            color: isSelected ? '#ffffff' : '#e2e8f0',
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            background: isSelected
                              ? 'rgba(56, 189, 248, 0.2)'
                              : '#1e293b',
                            color: isSelected ? '#38bdf8' : '#64748b',
                            padding: '2px 6px',
                            borderRadius: 3,
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: isSelected ? '#10b981' : '#475569',
                          }}
                        >
                          ›
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Context HUD Telemetry */}
            <div
              style={{
                flex: '1 1 45%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#070b14',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0px 0px #2A2A2A',
                borderRadius: 8,
                padding: '16px',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#64748b',
                    marginBottom: 8,
                  }}
                >
                  TARGET SELECTION
                </div>

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {currentSelectedItem?.icon} {currentSelectedItem?.label}
                </div>

                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: '#94a3b8',
                    margin: '0 0 12px 0',
                  }}
                >
                  {currentSelectedItem?.description ??
                    'Navigate quickly across application vectors without scrolling.'}
                </p>

                {currentSelectedItem?.children && (
                  <div
                    style={{
                      fontSize: 11,
                      color: '#10b981',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'inline-block',
                    }}
                  >
                    Submenu containing {currentSelectedItem.children.length} options
                  </div>
                )}

                {currentSelectedItem?.route && (
                  <div
                    style={{
                      fontSize: 11,
                      color: '#38bdf8',
                      fontWeight: 700,
                      background: 'rgba(56, 189, 248, 0.12)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'inline-block',
                    }}
                  >
                    Direct Route: {currentSelectedItem.route}
                  </div>
                )}

                {currentSelectedItem?.movie && (
                  <div
                    style={{
                      fontSize: 11,
                      color: '#f59e0b',
                      fontWeight: 700,
                      background: 'rgba(245, 158, 11, 0.12)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'inline-block',
                    }}
                  >
                    Stage MovieClip: {currentSelectedItem.movie}
                  </div>
                )}
              </div>

              <div
                style={{
                  borderTop: '1px solid #1e293b',
                  paddingTop: 10,
                  fontSize: 11,
                  color: '#64748b',
                  lineHeight: 1.4,
                }}
              >
                No scrolling. Pure bounded stage navigation. Press Green to proceed or Red to return.
              </div>
            </div>
          </>
        )}
      </main>

      {/* Video Game Controller Bar: Directional controls, Green (OK) and Red (Back) buttons */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          borderTop: '2px solid #1e293b',
          paddingTop: 12,
          marginTop: 10,
          flexShrink: 0,
        }}
      >
        {/* Directional Pad Navigation Affordance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleMoveUp}
            aria-label="Move selection up"
            style={{
              background: '#0d1527',
              color: '#ffffff',
              border: '2px solid #2A2A2A',
              boxShadow: '2px 2px 0px 0px #2A2A2A',
              borderRadius: 6,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            ▲
          </button>
          <button
            onClick={handleMoveDown}
            aria-label="Move selection down"
            style={{
              background: '#0d1527',
              color: '#ffffff',
              border: '2px solid #2A2A2A',
              boxShadow: '2px 2px 0px 0px #2A2A2A',
              borderRadius: 6,
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            ▼
          </button>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#64748b',
              marginLeft: 4,
            }}
          >
            NAVIGATE [↑ / ↓]
          </span>
        </div>

        {/* Action Buttons: Red Button (Back) and Green Button (Accept) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Red Button: Back / Cancel */}
          <button
            onClick={handleBack}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: '2px solid #2A2A2A',
              boxShadow: '3px 3px 0px 0px #2A2A2A',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 44,
              transition: 'transform 0.08s ease',
            }}
            aria-label="Back or cancel"
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#7f1d1d',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              B
            </span>
            <span>BACK</span>
          </button>

          {/* Green Button: OK / Forward / Accept */}
          <button
            onClick={handleAccept}
            style={{
              background: '#10b981',
              color: '#ffffff',
              border: '2px solid #2A2A2A',
              boxShadow: '3px 3px 0px 0px #2A2A2A',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 44,
              transition: 'transform 0.08s ease',
            }}
            aria-label="OK, forward, or accept"
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#064e3b',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              A
            </span>
            <span>{currentSelectedItem?.children ? 'FORWARD' : 'ACCEPT'}</span>
          </button>
        </div>
      </footer>

      {children}
    </div>
  );
}

export default GameMenu;
