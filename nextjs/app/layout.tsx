import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://modern-flash.pro'),
  title: 'Modern Flash',
  description: 'Pure SVG Flash animation engine and ActionScript runtime for WordPress and Next.js.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <style>{`
          @media (max-width: 860px) {
            .mwp-layout-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f0f0f1',
          color: '#1e293b',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
          lineHeight: 1.6,
          boxSizing: 'border-box',
        }}
      >
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: -9999,
            top: 12,
            background: '#15868F',
            color: '#ffffff',
            padding: '10px 18px',
            zIndex: 9999,
            borderRadius: 6,
            fontWeight: 700,
            textDecoration: 'none',
          }}
          className="skip-link"
        >
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
