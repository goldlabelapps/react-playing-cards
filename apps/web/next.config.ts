import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['modern-flash'],
  serverExternalPackages: ['mysql2'],
  reactStrictMode: true,
};

export default nextConfig;
