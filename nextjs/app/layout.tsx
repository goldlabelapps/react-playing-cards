import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://modern-flash.pro'),
  title: 'Modern Flash for Next.js',
  description: 'SVG Flash animation engine and ActionScript runtime for Next.js and React.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Modern Flash',
  },
};

export const viewport: Viewport = {
  themeColor: '#052841',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <style>{`
          * {
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            height: 100dvh;
            margin: 0;
            padding: 0;
            overflow: hidden;
            overscroll-behavior: none;
            background-color: #070b14;
            color: #ffffff;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
        <main id="main-content" style={{ width: '100vw', height: '100dvh', overflow: 'hidden' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
