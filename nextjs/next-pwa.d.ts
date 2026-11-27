declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  export interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    clientsClaim?: boolean;
    cleanupOutdatedCaches?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    customWorkerDir?: string;
    buildExcludes?: (string | RegExp)[];
    publicExcludes?: string[];
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
  }

  function withPWA(
    pwaConfig?: PWAConfig
  ): (nextConfig?: NextConfig) => NextConfig;

  export default withPWA;
}
