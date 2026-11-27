import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { flashStoryActionScript } from '../../ActionScript/flashStory';
import { AgentText } from '../Typography/AgentText';

export interface FlashStoryProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  initialChapter?: number;
  frontColor?: string;
  backColor?: string;
  strokeColor?: string;
  children?: ReactNode;
  /** Counter formatting style ('short' or 'verbose'). Default: 'verbose'. */
  counterStyle?: 'short' | 'verbose';
  /** Horizontal alignment on the stage ('left' | 'center' | 'right'). Default: 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Sequence of messages to cycle through after 'Hello world'. */
  messages?: string[];
  /** On message transition callback. */
  onMessageChange?: (message: string, durationSeconds: number) => void;
}

export const DEFAULT_STORY_MESSAGES: string[] = [
  'Thinking ...',
  'Running check apps/web contents`',
  'Inspecting src/MovieClips/FlashStory/FlashStory.tsx',
  'Synthesising vector stage choreographies',
  'Running verify-hygiene.py',
  'Compiling dist/flash-bundle.min.js',
  'Verifying type safety across workspace',
  'Analysing antigravity_thinking.mov telemetry',
  'Synchronising GreenSock timeline keyframes',
  'Executing next build static export pass',
];

/**
 * Returns a random duration in seconds between min and max (inclusive).
 */
function getRandomDuration(min: number = 1, max: number = 3): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function FlashStory({
  width = '100%',
  height = '100%',
  className,
  style,
  autoPlay = true,
  loop = true,
  speed = 1,
  children,
  counterStyle = 'verbose',
  align = 'left',
  messages = DEFAULT_STORY_MESSAGES,
  onMessageChange,
}: FlashStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Message sequence state:
  // Step 0: "Hello world" for 5 seconds
  // Step 1+: Sequence of different messages with random 5-10s durations
  const [step, setStep] = useState<number>(0);
  const [currentTitle, setCurrentTitle] = useState<string>('Hello world');
  const [currentDuration, setCurrentDuration] = useState<number>(5);
  const [startTime, setStartTime] = useState<number>(() => Date.now());

  // ActionScript timeline loop
  useEffect(() => {
    const target = contentRef.current;
    if (!target) return;

    if (!autoPlay) return;

    const timeline = flashStoryActionScript({
      target,
      loop,
      speed,
    });

    return () => {
      timeline.kill();
    };
  }, [autoPlay, loop, speed]);

  // Handle message cycling sequence
  useEffect(() => {
    if (!autoPlay) return;

    const delayMs = (currentDuration * 1000) / Math.max(0.1, speed);

    const timer = setTimeout(() => {
      if (!loop && step >= messages.length) {
        return;
      }

      const nextStep = step + 1;
      const nextMsgIndex = (nextStep - 1) % messages.length;
      const nextTitle = messages[nextMsgIndex];
      const nextDur = getRandomDuration(5, 10);

      setStep(nextStep);
      setCurrentTitle(nextTitle);
      setCurrentDuration(nextDur);
      setStartTime(Date.now());

      if (onMessageChange) {
        onMessageChange(nextTitle, nextDur);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [autoPlay, loop, speed, step, currentDuration, messages, onMessageChange]);

  const justifyMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  } as const;

  return (
    <div
      ref={containerRef}
      className={`flash-story-stage ${className ?? ''}`.trim()}
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: justifyMap[align] ?? 'flex-start',
        padding: align === 'left' ? '0 clamp(16px, 3vw, 28px)' : align === 'right' ? '0 clamp(16px, 3vw, 28px)' : 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: justifyMap[align] ?? 'flex-start',
          transformOrigin: align === 'left' ? 'left center' : 'center center',
        }}
      >
        {children ?? (
          <AgentText
            key={step}
            title={currentTitle}
            startTime={startTime}
            counterStyle={counterStyle}
            speed={speed}
            active={autoPlay}
          />
        )}
      </div>
    </div>
  );
}

export default FlashStory;

