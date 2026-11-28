'use client';

import dynamic from 'next/dynamic';

const DynamicInteractiveStage = dynamic(
  () => import('./InteractiveStage').then((mod) => mod.InteractiveStage),
  {
    ssr: false,
    loading: () => null,
  }
);

export function StageWrapper() {
  return <DynamicInteractiveStage />;
}
