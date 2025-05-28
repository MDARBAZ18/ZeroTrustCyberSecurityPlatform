import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import json from '@rollup/plugin-json';

export default defineConfig({
  plugins: [
    react(),
    json({
      exclude: 'artifacts/**',
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5180,
    cors: true,
    strictPort: true,
    hmr: {
      overlay: false,
    },
    allowedHosts: [
      '.trycloudflare.com', // NOTE: no wildcard * — use leading dot
    ],
  },
  preview: {
    host: true,
    port: 5180,
  },
  build: {
    rollupOptions: {
      external: id => id.includes('artifacts'),
    },
  },
});
