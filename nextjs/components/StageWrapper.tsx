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
          background: '#070b14',
          borderRadius: 8,
          border: '2px solid #2A2A2A',
          boxShadow: '3px 3px 0 0 #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Initialising Vector Stage Surface...
      </div>
    ),
  }
);

export function StageWrapper() {
  return <DynamicInteractiveStage />;
}
