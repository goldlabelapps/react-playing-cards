import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://modern-flash.pro'),
  title: 'Modern Flash for Next.js',
  description: 'SVG Flash animation engine and ActionScript runtime for Next.js and React.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <style>{`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #ffffff;
            color: #111827;
            line-height: 1.5;
          }
          .skip-link {
            position: absolute;
            top: -100px;
            left: 16px;
            padding: 8px 16px;
            background: #111827;
            color: #ffffff;
            z-index: 100;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
          }
          .skip-link:focus {
            top: 16px;
          }
        `}</style>
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
          <header role="banner" style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>
              Modern Flash for Next.js
            </h1>
            <p style={{ margin: 0, color: '#4b5563', fontSize: 14 }}>
              SVG vector animation engine and ActionScript runtime
            </p>
          </header>

          <main id="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
