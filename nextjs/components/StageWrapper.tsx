'use client';

import dynamic from 'next/dynamic';
import type { FlashScene } from '../lib/db';

const DynamicInteractiveStage = dynamic(
  () => import('./InteractiveStage').then((mod) => mod.InteractiveStage),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: 480,
          background: '#070b14',
          borderRadius: 16,
          border: '2px solid #2A2A2A',
          boxShadow: '4px 4px 0 0 #2A2A2A',
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

export function StageWrapper({ initialScenes }: { initialScenes: FlashScene[] }) {
  return <DynamicInteractiveStage initialScenes={initialScenes} />;
}
