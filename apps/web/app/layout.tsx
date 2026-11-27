import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Modern Flash // Pure Vector SVG Animation Engine',
  description: 'Pure SVG Flash animation engine and natural language animation studio for Next.js, React, and WordPress.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#050a14',
          color: '#f8fafc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          lineHeight: 1.6,
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {/* Accessible Skip Link */}
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

        {children}
      </body>
    </html>
  );
}
