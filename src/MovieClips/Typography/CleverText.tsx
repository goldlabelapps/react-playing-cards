'use client';

import React, { useEffect, useState, useRef } from 'react';

export interface CleverTextOptions {
  id?: string;
  text?: string;
  markdown?: string;
  speed?: number; // milliseconds per character
  cursor?: string;
  onFinish?: () => void;
  active?: boolean;
}

export interface CleverTextProps {
  text?: string;
  markdown?: string;
  speed?: number;
  cursor?: string;
  active?: boolean;
  onFinish?: () => void;
  options?: CleverTextOptions;
  className?: string;
  style?: React.CSSProperties;
}

export function CleverText({
  text,
  markdown,
  speed,
  cursor,
  active,
  onFinish,
  options,
  className,
  style,
}: CleverTextProps) {
  const contentText = options?.text ?? options?.markdown ?? text ?? markdown ?? '';
  const charSpeed = options?.speed ?? speed ?? 30;
  const cursorChar = options?.cursor ?? cursor ?? '|';
  const finishCallback = options?.onFinish ?? onFinish;
  const isActive = options?.active ?? active ?? true;

  const [displayedLength, setDisplayedLength] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const onFinishRef = useRef(finishCallback);

  useEffect(() => {
    onFinishRef.current = finishCallback;
  }, [finishCallback]);

  useEffect(() => {
    setDisplayedLength(0);
    setIsFinished(false);
  }, [contentText]);

  useEffect(() => {
    if (!isActive) {
      setDisplayedLength(0);
      setIsFinished(false);
      return;
    }

    if (!contentText) {
      setIsFinished(true);
      return;
    }

    if (displayedLength >= contentText.length) {
      if (!isFinished) {
        setIsFinished(true);
        if (onFinishRef.current) {
          onFinishRef.current();
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedLength((prev) => prev + 1);
    }, charSpeed);

    return () => clearTimeout(timer);
  }, [displayedLength, contentText, charSpeed, isFinished, isActive]);

  const displayedText = contentText.slice(0, displayedLength);

  return (
    <span
      data-testid="clever-text"
      aria-label={contentText}
      className={className}
      style={{
        fontFamily: 'monospace, sans-serif',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        display: 'inline-block',
        ...style,
      }}
    >
      {displayedText}
      {!isFinished && (
        <span
          style={{
            display: 'inline-block',
            marginLeft: '2px',
            opacity: 0.8,
          }}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

export default CleverText;
