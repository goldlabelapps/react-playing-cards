import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { playSound } from '../../Sound';
import { Button as AppleButton } from '../../themes/apple';
import type { PokerDiceFace, PokerDiceProps } from './types';

const FACES: PokerDiceFace[] = ['A', 'K', 'Q', 'J', '10', '9'];

const FACE_CONFIG: Record<PokerDiceFace, { label: string; colour: string; sub: string }> = {
  A: { label: 'A', colour: '#F59E0B', sub: 'Ace' },
  K: { label: 'K', colour: '#EF4444', sub: 'King' },
  Q: { label: 'Q', colour: '#10B981', sub: 'Queen' },
  J: { label: 'J', colour: '#3B82F6', sub: 'Jack' },
  '10': { label: '10', colour: '#8B5CF6', sub: 'Ten' },
  '9': { label: '9', colour: '#64748B', sub: 'Nine' },
};

interface DieState {
  id: number;
  face: PokerDiceFace;
  held: boolean;
}

interface HandEvaluation {
  name: string;
  points: number;
  description: string;
}

function evaluateHand(faces: PokerDiceFace[]): HandEvaluation {
  const counts: Record<string, number> = {};
  for (const f of faces) {
    counts[f] = (counts[f] || 0) + 1;
  }
  const quantities = Object.values(counts).sort((a, b) => b - a);

  // 5 of a Kind
  if (quantities[0] === 5) {
    const rank = Object.keys(counts)[0];
    return { name: 'Five of a Kind', points: 1000, description: `Five ${FACE_CONFIG[rank as PokerDiceFace]?.sub ?? rank}s` };
  }

  // 4 of a Kind
  if (quantities[0] === 4) {
    return { name: 'Four of a Kind', points: 600, description: 'Four matching dice' };
  }

  // Full House
  if (quantities[0] === 3 && quantities[1] === 2) {
    return { name: 'Full House', points: 400, description: 'Three of a kind plus a pair' };
  }

  // Straights: A-K-Q-J-10 or K-Q-J-10-9
  const uniqueFaces = Array.from(new Set(faces));
  if (uniqueFaces.length === 5) {
    const hasA = uniqueFaces.includes('A');
    const hasK = uniqueFaces.includes('K');
    const hasQ = uniqueFaces.includes('Q');
    const hasJ = uniqueFaces.includes('J');
    const has10 = uniqueFaces.includes('10');
    const has9 = uniqueFaces.includes('9');

    if (hasA && hasK && hasQ && hasJ && has10) {
      return { name: 'High Straight', points: 500, description: 'Ace through Ten sequence' };
    }
    if (hasK && hasQ && hasJ && has10 && has9) {
      return { name: 'Low Straight', points: 450, description: 'King through Nine sequence' };
    }
  }

  // 3 of a Kind
  if (quantities[0] === 3) {
    return { name: 'Three of a Kind', points: 300, description: 'Three matching dice' };
  }

  // 2 Pair
  if (quantities[0] === 2 && quantities[1] === 2) {
    return { name: 'Two Pair', points: 200, description: 'Two distinct pairs' };
  }

  // 1 Pair
  if (quantities[0] === 2) {
    return { name: 'One Pair', points: 100, description: 'Single matching pair' };
  }

  return { name: 'High Card', points: 50, description: 'No matching combination' };
}

function getRandomFace(): PokerDiceFace {
  return FACES[Math.floor(Math.random() * FACES.length)];
}

export function PokerDice({
  width = '100%',
  height = '100%',
  className,
  style,
  soundEnabled = true,
}: PokerDiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [dice, setDice] = useState<DieState[]>([
    { id: 0, face: 'A', held: false },
    { id: 1, face: 'K', held: false },
    { id: 2, face: 'Q', held: false },
    { id: 3, face: 'J', held: false },
    { id: 4, face: '10', held: false },
  ]);

  const [rollsLeft, setRollsLeft] = useState<number>(3);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [lastHand, setLastHand] = useState<HandEvaluation | null>(null);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);

  const triggerSound = useCallback(
    (soundId: string, vol = 0.4) => {
      if (!soundEnabled) return;
      try {
        playSound(soundId as any, { volume: vol });
      } catch {
        // Audio context may require previous gesture
      }
    },
    [soundEnabled]
  );

  const toggleHold = (id: number) => {
    if (isRolling || rollsLeft === 3 || roundCompleted) return;
    triggerSound('arcade/beep-01', 0.25);
    setDice((prev) =>
      prev.map((d) => (d.id === id ? { ...d, held: !d.held } : d))
    );
  };

  const rollDice = () => {
    if (isRolling || rollsLeft <= 0 || roundCompleted) return;

    setIsRolling(true);
    triggerSound('movement/swipe-01', 0.45);

    const nextRolls = rollsLeft - 1;
    setRollsLeft(nextRolls);

    // Dynamic tumble animation for all unheld dice
    dice.forEach((die, idx) => {
      if (die.held) return;
      const el = diceRefs.current[idx];
      if (!el) return;

      gsap.fromTo(
        el,
        { rotation: -25, scale: 0.88, y: -16 },
        {
          rotation: 0,
          scale: 1,
          y: 0,
          duration: 0.42,
          ease: 'power2.out',
          stagger: 0.04,
        }
      );
    });

    // Rapid face shuffle during tumble
    let shuffleCount = 0;
    const interval = setInterval(() => {
      shuffleCount += 1;
      setDice((prev) =>
        prev.map((d) => (d.held ? d : { ...d, face: getRandomFace() }))
      );

      if (shuffleCount >= 6) {
        clearInterval(interval);
        // Final faces determined
        setDice((prev) => {
          const finalDice = prev.map((d) =>
            d.held ? d : { ...d, face: getRandomFace() }
          );

          if (nextRolls === 0) {
            // Round finished: evaluate hand
            const evalResult = evaluateHand(finalDice.map((d) => d.face));
            setLastHand(evalResult);
            setTotalScore((s) => s + evalResult.points);
            setRoundCompleted(true);
            triggerSound('pickups/coin-01', 0.55);
          }

          return finalDice;
        });
        setIsRolling(false);
      }
    }, 60);
  };

  const startNextRound = () => {
    triggerSound('arcade/beep-01', 0.35);
    setDice([
      { id: 0, face: getRandomFace(), held: false },
      { id: 1, face: getRandomFace(), held: false },
      { id: 2, face: getRandomFace(), held: false },
      { id: 3, face: getRandomFace(), held: false },
      { id: 4, face: getRandomFace(), held: false },
    ]);
    setRollsLeft(3);
    setLastHand(null);
    setRoundCompleted(false);
    setRoundNumber((r) => r + 1);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (roundCompleted) {
          startNextRound();
        } else {
          rollDice();
        }
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = Number.parseInt(e.key, 10) - 1;
        toggleHold(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      ref={containerRef}
      className={`poker-dice-stage ${className ?? ''}`.trim()}
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(14px, 2.5vw, 28px)',
        backgroundColor: '#064e3b',
        backgroundImage: 'radial-gradient(ellipse at center, #065f46 0%, #064e3b 65%, #022c22 100%)',
        borderRadius: 12,
        border: '2px solid rgba(255, 255, 255, 0.15)',
        boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.65)',
        color: '#f8fafc',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
        ...style,
      }}
      role="region"
      aria-label="Poker Dice Stage"
    >
      {/* Top Banner and Score Bar */}
      <header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#FDE047',
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Poker Dice
          </h2>
          <span style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: 600 }}>
            Round {roundNumber} &bull; Rolls Left: {rollsLeft}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '6px 14px',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>SCORE</span>
          <span
            style={{
              fontSize: 'clamp(16px, 2vw, 22px)',
              fontWeight: 800,
              color: '#34D399',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {totalScore}
          </span>
        </div>
      </header>

      {/* Center Table Surface & 5 Dice */}
      <section
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          minHeight: 0,
        }}
      >
        {/* Dice Tray */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 1.8vw, 16px)',
            flexWrap: 'wrap',
          }}
        >
          {dice.map((die, idx) => {
            const conf = FACE_CONFIG[die.face];
            const isHeld = die.held;

            return (
              <div
                key={die.id}
                ref={(el) => {
                  diceRefs.current[idx] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={`Die ${idx + 1}: ${conf.sub}, ${isHeld ? 'Held' : 'Not Held'}`}
                onClick={() => toggleHold(die.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleHold(die.id);
                  }
                }}
                style={{
                  position: 'relative',
                  width: 'clamp(58px, 11vw, 78px)',
                  height: 'clamp(58px, 11vw, 78px)',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  backgroundImage: isHeld
                    ? 'linear-gradient(145deg, #FEF08A 0%, #FDE047 100%)'
                    : 'linear-gradient(145deg, #FFFFFF 0%, #E2E8F0 100%)',
                  border: isHeld ? '3px solid #EAB308' : '2px solid #334155',
                  boxShadow: isHeld
                    ? '0 0 16px rgba(234, 179, 8, 0.75), 0 8px 12px rgba(0,0,0,0.4)'
                    : '0 6px 12px rgba(0, 0, 0, 0.35)',
                  transform: isHeld ? 'translateY(-6px)' : 'none',
                  transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
                  cursor: rollsLeft === 3 || roundCompleted ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                }}
              >
                {/* Die Rank Graphic */}
                <span
                  style={{
                    fontSize: 'clamp(26px, 4.5vw, 36px)',
                    fontWeight: 900,
                    lineHeight: 1,
                    color: conf.colour,
                    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}
                >
                  {conf.label}
                </span>

                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginTop: 2,
                  }}
                >
                  {conf.sub}
                </span>

                {/* Held Badge */}
                {isHeld && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      backgroundColor: '#CA8A04',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      letterSpacing: '0.06em',
                      border: '1px solid #FEF08A',
                    }}
                  >
                    HELD
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hand Outcome Banner */}
        {roundCompleted && lastHand ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(5, 11, 20, 0.78)',
              border: '2px solid #FDE047',
              borderRadius: 8,
              padding: '10px 20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(16px, 2.2vw, 20px)',
                fontWeight: 800,
                color: '#FDE047',
                letterSpacing: '0.04em',
              }}
            >
              {lastHand.name} (+{lastHand.points} pts)
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{lastHand.description}</span>
          </div>
        ) : (
          <div style={{ height: '38px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#A7F3D0', fontWeight: 600 }}>
              {rollsLeft === 3
                ? 'Tap Roll Dice to begin round'
                : 'Tap dice to toggle Hold, then roll again'}
            </span>
          </div>
        )}
      </section>

      {/* Footer Controls */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          paddingTop: '8px',
        }}
      >
        {roundCompleted ? (
          <AppleButton
            size="fat"
            label="Next Round"
            onClick={startNextRound}
            style={{ minWidth: '180px' }}
          />
        ) : (
          <AppleButton
            size="fat"
            label={rollsLeft === 3 ? 'Roll Dice' : `Roll (${rollsLeft} Left)`}
            onClick={rollDice}
            disabled={isRolling}
            style={{ minWidth: '180px' }}
          />
        )}
      </footer>
    </div>
  );
}

export default PokerDice;
