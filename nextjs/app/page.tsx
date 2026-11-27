import { StageWrapper } from '../components/StageWrapper';

export const revalidate = 60;

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1200, margin: '20px auto', padding: '0 20px', boxSizing: 'border-box' }}>
      {/* Masthead Banner conforming to WordPress Modern Flash settings */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: '#15868F',
          borderRadius: 8,
          color: '#ffffff',
          marginBottom: 24,
          border: '2px solid #2A2A2A',
          boxShadow: '3px 3px 0 0 #2A2A2A',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 20,
              color: '#15868F',
              border: '2px solid #2A2A2A',
            }}
          >
            ⚡
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, color: '#ffffff', fontWeight: 700, lineHeight: 1.2 }}>
              Modern Flash
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#e0f2f1' }}>
              SVG Vector Animation Engine & ActionScript Runtime for WordPress
            </p>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          v1.0.0
        </div>
      </div>

      {/* Responsive Two-Column Layout */}
      <div
        className="mwp-layout-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Primary Column: Stage & Settings */}
        <div
          className="mwp-col-primary"
          style={{
            background: '#ffffff',
            border: '1px solid #ccd0d4',
            borderRadius: 8,
            padding: 24,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            color: '#1e293b',
          }}
        >
          <StageWrapper />

          <hr style={{ margin: '24px 0', border: 0, borderTop: '1px solid #e2e8f0' }} />

          <h3 style={{ marginTop: 0, fontSize: 16, color: '#1e293b' }}>
            Shortcode Usage Guide
          </h3>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Embed vector animations anywhere using declarative shortcodes:
          </p>
          <pre
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: 12,
              borderRadius: 6,
              fontSize: 12,
              overflowX: 'auto',
              margin: '0 0 10px',
              color: '#0f172a',
            }}
          >
            <code>[modern_flash prompt="Deal Ace of Spades with a 3D flip on dark slate stage" speed="1.2" loop="true"]</code>
          </pre>
          <pre
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: 12,
              borderRadius: 6,
              fontSize: 12,
              overflowX: 'auto',
              margin: 0,
              color: '#0f172a',
            }}
          >
            <code>[modern_flash movie="FlashStory" height="420px"]</code>
          </pre>
        </div>

        {/* Secondary Column: Runtime Telemetry */}
        <div className="mwp-col-secondary">
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #ccd0d4',
              borderRadius: 8,
              padding: 20,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              color: '#1e293b',
            }}
          >
            <h3
              style={{
                marginTop: 0,
                fontSize: 15,
                borderBottom: '2px solid #15868F',
                paddingBottom: 8,
                color: '#1e293b',
              }}
            >
              Runtime Telemetry
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: 12, color: '#1e293b' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <strong>Bundle Status</strong>
                  </td>
                  <td style={{ padding: '8px 4px' }}>
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>● Compiled</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <strong>Bundle Size</strong>
                  </td>
                  <td style={{ padding: '8px 4px' }}>539.0 KB</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <strong>Engine Target</strong>
                  </td>
                  <td style={{ padding: '8px 4px' }}>React 19 + GSAP 3</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <strong>Global Handle</strong>
                  </td>
                  <td style={{ padding: '8px 4px' }}>
                    <code>window.mwpFlash</code>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <strong>Active Hook</strong>
                  </td>
                  <td style={{ padding: '8px 4px' }}>
                    <code>DOMContentLoaded</code>
                  </td>
                </tr>
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '8px 4px' }}>
                    <strong>Supported Movies</strong>
                  </td>
                  <td style={{ padding: '8px 4px' }}>
                    <code>FlashStory</code>, <code>logo</code>, <code>starfighter</code>, <code>cardFlip</code>, <code>hudMacromedia</code>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{
                marginTop: 16,
                padding: 10,
                background: '#f0fdf4',
                borderLeft: '4px solid #15868F',
                fontSize: 11,
                color: '#166534',
              }}
            >
              The runtime bundle mounts directly into .mwp-flash-stage containers with zero layout shift.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
