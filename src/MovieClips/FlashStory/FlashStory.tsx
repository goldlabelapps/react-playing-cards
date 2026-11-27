import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { flashStoryActionScript } from '../../ActionScript/flashStory';
import { AgentText } from '../Typography/AgentText';
import { GameMenu } from '../GameMenu';

export interface StoryTaskItem {
  id: string;
  title: string;
  duration: number; // in seconds
  status: 'active' | 'completed';
  startTime: number;
}

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
  /** Maximum number of stacked tasks to retain on stage (default: 12). */
  maxItems?: number;
  /** Sequence of messages to cycle through. */
  messages?: string[];
  /** On message transition callback. */
  onMessageChange?: (message: string, durationSeconds: number) => void;
  /** Completion callback when all messages in the pool have executed (when loop is false). */
  onComplete?: () => void;
  /** Whether to automatically show the GameMenu when the story sequence has finished (default: true). */
  showGameMenu?: boolean;
  /** Navigation callback passed down to GameMenu. */
  onNavigate?: (path: string) => void;
}

export const DEFAULT_STORY_MESSAGES: string[] = [
  'Thinking ...',
  'Starting Game Menu',
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
  loop = false,
  speed = 1,
  children,
  counterStyle = 'verbose',
  align = 'left',
  maxItems = 12,
  messages = DEFAULT_STORY_MESSAGES,
  onMessageChange,
  onComplete,
  showGameMenu = true,
  onNavigate,
}: FlashStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isStoryComplete, setIsStoryComplete] = useState<boolean>(false);

  // Stack of sequential tasks:
  // Starts directly with the first message and cycles through with random 5-10s durations,
  // adding each new instance as the previous completes.
  const [tasks, setTasks] = useState<StoryTaskItem[]>(() => {
    const firstTitle = messages[0] ?? 'Thinking ...';
    const firstDur = getRandomDuration();
    return [
      {
        id: 'task-0',
        title: firstTitle,
        duration: firstDur,
        status: 'active',
        startTime: Date.now(),
      },
    ];
  });
  const [step, setStep] = useState<number>(0);

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

  // Handle message cycling sequence and instance stacking
  useEffect(() => {
    if (!autoPlay) return;

    const activeTask = tasks[tasks.length - 1];
    if (!activeTask || activeTask.status !== 'active') return;

    const delayMs = (activeTask.duration * 1000) / Math.max(0.1, speed);

    const timer = setTimeout(() => {
      // Once we reach the end of the list and loop is false, complete the final task and stop
      if (!loop && step >= messages.length - 1) {
        setTasks((prev) =>
          prev.map((t, idx) => (idx === prev.length - 1 ? { ...t, status: 'completed' as const } : t))
        );
        setIsStoryComplete(true);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const nextStep = step + 1;
      const nextMsgIndex = nextStep % messages.length;
      const nextTitle = messages[nextMsgIndex];
      const nextDur = getRandomDuration();
      const nextTask: StoryTaskItem = {
        id: `task-${nextStep}`,
        title: nextTitle,
        duration: nextDur,
        status: 'active',
        startTime: Date.now(),
      };

      setStep(nextStep);
      setTasks((prev) => {
        // Mark previous active task completed
        const updated = prev.map((t, idx) =>
          idx === prev.length - 1 ? { ...t, status: 'completed' as const } : t
        );
        const nextList = [...updated, nextTask];
        return nextList.length > maxItems ? nextList.slice(nextList.length - maxItems) : nextList;
      });

      if (onMessageChange) {
        onMessageChange(nextTitle, nextDur);
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [autoPlay, loop, speed, step, tasks, messages, maxItems, onMessageChange]);

  const handleReplayStory = () => {
    setIsStoryComplete(false);
    setStep(0);
    const firstTitle = messages[0] ?? 'Thinking ...';
    const firstDur = getRandomDuration();
    setTasks([
      {
        id: `task-${Date.now()}`,
        title: firstTitle,
        duration: firstDur,
        status: 'active',
        startTime: Date.now(),
      },
    ]);
  };

  if (isStoryComplete && showGameMenu) {
    return (
      <GameMenu
        onNavigate={onNavigate}
        onReplayStory={handleReplayStory}
        width={width}
        height={height}
        className={className}
        style={style}
      />
    );
  }

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
        alignItems: 'flex-start',
        justifyContent: justifyMap[align] ?? 'flex-start',
        padding:
          align === 'left'
            ? 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)'
            : align === 'right'
              ? 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)'
              : 'clamp(24px, 4vw, 40px) 0',
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
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '8px',
          width: '100%',
          maxWidth: '850px',
          transformOrigin: align === 'left' ? 'left top' : 'center top',
        }}
      >
        {children ??
          tasks.map((task) => (
            <AgentText
              key={task.id}
              title={task.title}
              status={task.status}
              active={task.status === 'active' && autoPlay}
              elapsedSeconds={task.status === 'completed' ? task.duration : undefined}
              startTime={task.status === 'active' ? task.startTime : undefined}
              counterStyle={counterStyle}
              speed={speed}
            />
          ))}
      </div>
    </div>
  );
}

export default FlashStory;

