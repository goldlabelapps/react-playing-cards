import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Standalone UMD / IIFE bundle for WordPress mwp-flash and zero-dependency embedding
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/bundle-entry.ts'),
      name: 'mwpFlash',
      formats: ['iife'],
      fileName: () => 'flash-bundle.min.js',
    },
  },
});
