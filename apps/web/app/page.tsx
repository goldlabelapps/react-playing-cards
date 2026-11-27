import { getScenes } from '../lib/db';
import { StageWrapper } from '../components/StageWrapper';

export const revalidate = 60;

export default async function HomePage() {
  const scenes = await getScenes();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Masthead Banner */}
      <header
        role="banner"
        style={{
          borderBottom: '2px solid #1e293b',
          background: 'rgba(7, 11, 20, 0.85)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#15868F',
                border: '2px solid #2A2A2A',
                boxShadow: '2px 2px 0 0 #2A2A2A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: '#ffffff',
                fontSize: 18,
              }}
            >
              ⚡
            </div>
            <div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                Modern Flash
              </span>
              <span style={{ marginLeft: 8, fontSize: 11, color: '#15868F', fontWeight: 700, background: '#0e2433', padding: '2px 8px', borderRadius: 999 }}>
                v1.0.0
              </span>
            </div>
          </div>

          <nav aria-label="Main Navigation" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="https://github.com/goldlabelapps/modern-flash"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0 0 #2A2A2A',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                minHeight: 40,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              GitHub Repository
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px', width: '100%', boxSizing: 'border-box' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 48px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Pure Vector Animation for React and WordPress
          </h1>
          <p style={{ fontSize: 17, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
            The classic Flash authoring model reimagined with modern web standards. Pure SVG graphics driven by GreenSock timelines, available as an npm package and a native WordPress plugin.
          </p>
        </div>

        {/* Interactive Flash Stage Surface */}
        <StageWrapper initialScenes={scenes} />

        {/* Dual-Ecosystem Integration Grid */}
        <section aria-labelledby="dual-ecosystem-heading" style={{ marginTop: 64 }}>
          <h2 id="dual-ecosystem-heading" style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: '#f8fafc' }}>
            Dual-Ecosystem Integration
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* React & Next.js Card */}
            <div
              style={{
                background: '#0d1527',
                border: '2px solid #2A2A2A',
                boxShadow: '4px 4px 0 0 #2A2A2A',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>⚛️</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#f8fafc' }}>React & Next.js</h3>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
                Install via pnpm or npm and import components with full TypeScript support:
              </p>
              <pre
                style={{
                  background: '#070b14',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  padding: 14,
                  fontSize: 12,
                  color: '#e2e8f0',
                  overflowX: 'auto',
                }}
              >
{`import { Flash, parsePrompt } from 'modern-flash';

export function Hero() {
  const scene = parsePrompt('Deal Ace of Spades');
  return <Flash scene={scene} loop={true} autoPlay={true} />;
}`}
              </pre>
            </div>

            {/* WordPress Card */}
            <div
              style={{
                background: '#0d1527',
                border: '2px solid #2A2A2A',
                boxShadow: '4px 4px 0 0 #2A2A2A',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🔌</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#f8fafc' }}>WordPress Plugin</h3>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
                Activate Modern Flash in WordPress and embed declarative stages with shortcodes:
              </p>
              <pre
                style={{
                  background: '#070b14',
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  padding: 14,
                  fontSize: 12,
                  color: '#e2e8f0',
                  overflowX: 'auto',
                }}
              >
{`[modern_flash prompt="Deal Ace of Spades with a 3D flip" speed="1.2" loop="true"]

<!-- Automatically mounts in .mwp-flash-stage containers with zero layout shift -->`}
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer
        role="contentinfo"
        style={{
          borderTop: '2px solid #1e293b',
          background: '#070b14',
          marginTop: 64,
          padding: '28px 24px',
          textAlign: 'center',
          fontSize: 13,
          color: '#64748b',
        }}
      >
        <p style={{ margin: 0 }}>
          Modern Flash is an open-source project by Goldlabel°. Distributed under the MIT Licence.
        </p>
      </footer>
    </div>
  );
}
