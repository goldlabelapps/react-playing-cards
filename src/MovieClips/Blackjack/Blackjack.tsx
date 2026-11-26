'use client';

import { useState, useEffect, useRef } from 'react';
import type { BlackjackProps } from '../../types';
import { blackjackActionScript } from './BlackjackAS';

export type CardSuit = 'S' | 'H' | 'D' | 'C';
export type CardRank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

const SUIT_SYMBOLS: Record<CardSuit, string> = {
  S: '♠',
  H: '♥',
  D: '♦',
  C: '♣',
};

const SUIT_NAMES: Record<CardSuit, string> = {
  S: 'Spades',
  H: 'Hearts',
  D: 'Diamonds',
  C: 'Clubs',
};

const SUIT_COLORS: Record<CardSuit, string> = {
  S: '#0f172a',
  H: '#dc2626',
  D: '#dc2626',
  C: '#0f172a',
};

const RANKS: CardRank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS: CardSuit[] = ['S', 'H', 'D', 'C'];

export function Blackjack({
  title = 'BLACKJACK 21',
  width = '100%',
  height = '100%',
}: BlackjackProps) {
  const [phase, setPhase] = useState<'pick' | 'deal'>('pick');
  const [selectedRank, setSelectedRank] = useState<CardRank>('A');
  const [selectedSuit, setSelectedSuit] = useState<CardSuit>('S');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === 'deal' && containerRef.current) {
      const tl = blackjackActionScript({
        target: containerRef.current,
        loop: false,
      });
      return () => {
        tl.kill();
      };
    }
  }, [phase, selectedRank, selectedSuit]);

  const handleStartDeal = () => {
    setPhase('deal');
  };

  const handleReset = () => {
    setPhase('pick');
  };

  return (
    <div
      ref={containerRef}
      data-blackjack-mc="true"
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 16px',
        backgroundColor: '#064e3b', // Casino green felt
        backgroundImage: 'radial-gradient(ellipse at center, #047857 0%, #064e3b 70%, #022c22 100%)',
        borderRadius: '16px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
        userSelect: 'none',
        minHeight: '480px',
      }}
    >
      {/* Table Header Banner */}
      <div
        data-blackjack-title="true"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fef08a',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}
        >
          {phase === 'pick' ? 'DYNAMIC ANIMATION DEMO' : 'PAYS 3 TO 2 • DEALER MUST DRAW TO 16'}
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#fbbf24',
            textShadow: '0 2px 4px rgba(0,0,0,0.7), 0 0 10px rgba(251,191,36,0.3)',
            textAlign: 'center',
          }}
        >
          {phase === 'pick' ? 'Pick a Card' : title}
        </h2>
      </div>

      {/* PHASE 1: PICK A CARD SCREEN */}
      {phase === 'pick' && (
        <div
          ref={cardRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '380px',
            backgroundColor: 'rgba(2, 44, 34, 0.75)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#a7f3d0', textAlign: 'center', fontWeight: 500 }}>
            Select a rank and suit. Flash will animate your card being flipped over dynamically!
          </div>

          {/* Suit Selection */}
          <div style={{ width: '100%' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
              Select Suit:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
              {SUITS.map((suit) => {
                const isSelected = selectedSuit === suit;
                return (
                  <button
                    key={suit}
                    type="button"
                    onClick={() => setSelectedSuit(suit)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.1)',
                      color: isSelected ? SUIT_COLORS[suit] : '#ffffff',
                      fontSize: '18px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{SUIT_SYMBOLS[suit]}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600 }}>{SUIT_NAMES[suit]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rank Selection */}
          <div style={{ width: '100%' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
              Select Rank:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', justifyContent: 'center' }}>
              {RANKS.map((rank) => {
                const isSelected = selectedRank === rank;
                return (
                  <button
                    key={rank}
                    type="button"
                    onClick={() => setSelectedRank(rank)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: isSelected ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                      color: isSelected ? '#78350f' : '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {rank}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px' }}>
            <button
              type="button"
              onClick={handleStartDeal}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                backgroundColor: '#fbbf24',
                color: '#78350f',
                border: 'none',
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(251,191,36,0.5)',
                transition: 'transform 0.15s ease',
              }}
            >
              Deal & Flip Card →
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: SINGLE FLIP CARD FRONT AND CENTER */}
      {phase === 'deal' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            gap: '16px',
            margin: 'auto 0',
          }}
        >
          {/* Single Dynamic Card (Front & Center) */}
          <div
            data-blackjack-card="true"
            data-blackjack-target-card="true"
            style={{
              width: '140px',
              height: '196px',
              perspective: '1000px',
            }}
          >
            <div
              data-blackjack-card-inner="true"
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Card Back (Visible when rotationY = 180) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '12px',
                  backgroundColor: '#991b1b',
                  border: '2px solid #ffffff',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #7f1d1d 0, #7f1d1d 10px, #991b1b 10px, #991b1b 20px)',
                  boxSizing: 'border-box',
                }}
              />
              {/* Card Front (Visible when rotationY = 0) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  boxSizing: 'border-box',
                  color: SUIT_COLORS[selectedSuit],
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>
                  {selectedRank}{SUIT_SYMBOLS[selectedSuit]}
                </div>
                <div style={{ fontSize: '52px', alignSelf: 'center', lineHeight: 1 }}>
                  {SUIT_SYMBOLS[selectedSuit]}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    lineHeight: 1,
                    transform: 'rotate(180deg)',
                    alignSelf: 'flex-end',
                  }}
                >
                  {selectedRank}{SUIT_SYMBOLS[selectedSuit]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Area: Action/Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >

        {/* Phase Action Control or Winner Badge */}
        {phase === 'deal' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              data-blackjack-badge="true"
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: '#fbbf24',
                color: '#78350f',
                fontSize: '12px',
                fontWeight: 900,
                letterSpacing: '0.05em',
                boxShadow: '0 0 15px rgba(251,191,36,0.6), 0 2px 6px rgba(0,0,0,0.4)',
                border: '2px solid #fef08a',
              }}
            >
              ★ FLIPPED {selectedRank}{SUIT_SYMBOLS[selectedSuit]} ★
            </div>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ↺ Pick Another
            </button>
          </div>
        ) : (
          <div
            style={{
              fontSize: '11px',
              color: '#a7f3d0',
              fontWeight: 600,
            }}
          >
            Step 1 of 2: Pick your card
          </div>
        )}
      </div>
    </div>
  );
}

export default Blackjack;
