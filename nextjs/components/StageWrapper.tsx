'use client';

import dynamic from 'next/dynamic';
import type { InteractiveStageProps } from './InteractiveStage';

const DynamicInteractiveStage = dynamic(
  () => import('./InteractiveStage').then((mod) => mod.InteractiveStage),
  {
    ssr: false,
    loading: () => null,
  }
);

export function StageWrapper(props: InteractiveStageProps) {
  return <DynamicInteractiveStage {...props} />;
}
