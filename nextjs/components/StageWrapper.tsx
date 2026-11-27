'use client';

import dynamic from 'next/dynamic';

const DynamicInteractiveStage = dynamic(
  () => import('./InteractiveStage').then((mod) => mod.InteractiveStage),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#070b14',
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        Modern Flash
      </div>
    ),
  }
);

export function StageWrapper() {
  return <DynamicInteractiveStage />;
}
