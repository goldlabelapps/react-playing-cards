import { useState, useRef } from 'react';
import { HomeBtn } from '../../src/components/HomeBtn';
import { Flash } from '../../src/Flash';
import { parsePrompt } from '../../src/PromptEngine';
import type { FlashHandle, PromptScene } from '../../src/types';

const PRESET_PROMPTS = [
  'The Story of Flash: Iconic lightning bolt vector animation',
  'Flash Engine with 1990s starburst emblem and laser beam',
  'Deal Ace of Spades with a 3D flip on dark slate stage',
  'Electric lightning surge with glowing title text',
  '3D goldlabel diamond logo executing an elastic corkscrew',
  'High velocity pingpong rally across the stage',
  'Animated character walk cycle',
  'Deal King of Hearts with an elastic twist',
];

interface ExamplesPageProps {
  onNavigate?: (path: string) => void;
}

export function ExamplesPage({ onNavigate }: ExamplesPageProps) {
  const [promptInput, setPromptInput] = useState(PRESET_PROMPTS[0]);
  const [activeScene, setActiveScene] = useState<PromptScene>(() => parsePrompt(PRESET_PROMPTS[0]));
  const [speed, setSpeed] = useState(1);
  const [exportTab, setExportTab] = useState<'nextjs' | 'wordpress' | 'json'>('nextjs');
  const flashRef = useRef<FlashHandle>(null);

  const handleGenerate = (promptText: string) => {
    const scene = parsePrompt(promptText);
    setActiveScene(scene);
    flashRef.current?.restart();
  };

  const getNextJsSnippet = () => {
    return `// In your Next.js application
import { Flash } from 'modern-flash';

export default function MyAnimation() {
  return (
    <Flash
      scene={${JSON.stringify(activeScene, null, 2)}}
      speed={${speed}}
      loop={true}
      autoPlay={true}
    />
  );
}`;
  };

  const getWordPressSnippet = () => {
    return `<!-- In WordPress with Modern Flash plugin installed -->
[modern_flash prompt="${activeScene.prompt.replace(/"/g, '&quot;')}" width="100%" height="380px" speed="${speed}" loop="true" autoplay="true"]`;
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', minHeight: '100vh', overflowY: 'auto' }}>
      {/* Header */}
      <header style={{ marginBottom: 32, borderBottom: '1px solid #1e293b', paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <HomeBtn
                size="sm"
                onClick={() => {
                  if (onNavigate) onNavigate('/');
                  else window.location.pathname = '/';
                }}
              />
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#38bdf8', margin: 0 }}>
                Modern Flash
              </h1>
            </div>
            <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
              Prompt-driven vector graphics and GSAP ActionScript choreography for Next.js & WordPress
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('/sounds');
                else window.location.pathname = '/sounds';
              }}
              style={{
                background: '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '2px 2px 0px 0px #2A2A2A',
                padding: '6px 12px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              🔊 Soundboard (108)
            </button>
            <span style={{ fontSize: 12, background: '#1e293b', padding: '6px 10px', borderRadius: 4, color: '#38bdf8', fontWeight: 600 }}>
              ROUTE: /examples
            </span>
            <span style={{ fontSize: 12, background: '#1e293b', padding: '6px 10px', borderRadius: 4, color: '#10b981', fontWeight: 600 }}>
              PORT 3800
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {/* Chat Prompt Box */}
        <section style={{ background: '#1e293b', padding: 20, borderRadius: 8, border: '1px solid #334155' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#cbd5e1', marginBottom: 8 }}>
            Chat Prompt / Animation Directive:
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate(promptInput);
              }}
              placeholder="e.g. Flash Engine with starburst emblem"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 15,
                borderRadius: 6,
                border: '2px solid #475569',
                background: '#0f172a',
                color: '#ffffff',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleGenerate(promptInput)}
              style={{
                background: '#15868F',
                color: '#ffffff',
                border: '2px solid #2A2A2A',
                boxShadow: '3px 3px 0px 0px #2A2A2A',
                padding: '0 24px',
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 6,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Generate Animation
            </button>
          </div>

          {/* Quick Presets */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Quick prompts:</span>
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(p);
                  handleGenerate(p);
                }}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Studio Stage Canvas */}
        <section style={{ background: '#0f172a', borderRadius: 8, border: '2px solid #334155', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>Stage Preview: </span>
              <span style={{ color: '#38bdf8', fontSize: 13 }}>{activeScene.title}</span>
            </div>
            {/* Playback Controls */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={() => flashRef.current?.play()}
                style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
              >
                ▶ Play
              </button>
              <button
                onClick={() => flashRef.current?.pause()}
                style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
              >
                ⏸ Pause
              </button>
              <button
                onClick={() => flashRef.current?.restart()}
                style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
              >
                ↺ Restart
              </button>
              <label style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>Speed: {speed}x</label>
              <input
                type="range"
                min="0.25"
                max="2.5"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
          </div>

          {/* Flash Component Instance */}
          <div style={{ position: 'relative', width: '100%', height: 420 }}>
            <Flash
              ref={flashRef}
              scene={activeScene}
              speed={speed}
              loop={true}
              autoPlay={true}
              debug={true}
            />
          </div>
        </section>

        {/* Dual Integration Exporter */}
        <section style={{ background: '#1e293b', padding: 20, borderRadius: 8, border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Dual Integration Exporter</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setExportTab('nextjs')}
                style={{
                  background: exportTab === 'nextjs' ? '#15868F' : '#0f172a',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Next.js Component
              </button>
              <button
                onClick={() => setExportTab('wordpress')}
                style={{
                  background: exportTab === 'wordpress' ? '#15868F' : '#0f172a',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                WordPress Shortcode
              </button>
              <button
                onClick={() => setExportTab('json')}
                style={{
                  background: exportTab === 'json' ? '#15868F' : '#0f172a',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Scene JSON
              </button>
            </div>
          </div>

          <pre
            style={{
              background: '#0a0f1d',
              padding: 16,
              borderRadius: 6,
              fontSize: 13,
              color: '#38bdf8',
              overflowX: 'auto',
              border: '1px solid #1e293b',
              lineHeight: 1.5,
            }}
          >
            {exportTab === 'nextjs'
              ? getNextJsSnippet()
              : exportTab === 'wordpress'
              ? getWordPressSnippet()
              : JSON.stringify(activeScene, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}

export default ExamplesPage;
