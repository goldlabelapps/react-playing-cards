import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['modern-flash'],
  serverExternalPackages: ['mysql2'],
  reactStrictMode: true,
};

export default nextConfig;
