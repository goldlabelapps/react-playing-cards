import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['modern-flash'],
  serverExternalPackages: ['mysql2'],
  reactStrictMode: true,
  devIndicators: false,
};

export default withPWA(nextConfig);

