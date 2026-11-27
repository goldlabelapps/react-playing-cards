'use client';

import dynamic from 'next/dynamic';

const DynamicInteractiveStage = dynamic(
  () => import('./InteractiveStage').then((mod) => mod.InteractiveStage),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: 420,
          backgroundColor: '#0f172a',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 14,
        }}
      >
        Initialising vector stage surface...
      </div>
    ),
  }
);

export function StageWrapper() {
  return <DynamicInteractiveStage />;
}
