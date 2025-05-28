import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD
import json from '@rollup/plugin-json';

export default defineConfig({
  plugins: [
    react(),
    json({
      exclude: 'artifacts/**',
    }),
  ],
=======

export default defineConfig({
  plugins: [react()],
>>>>>>> 6314d33ae7be63cad8151236506c7612a441e77e
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
<<<<<<< HEAD
    port: 5180,
    cors: true,
    strictPort: true,
    hmr: {
      overlay: false,
    },
=======
    port: 5173,
    cors: true,
    strictPort: true,
>>>>>>> 6314d33ae7be63cad8151236506c7612a441e77e
    allowedHosts: [
      '.trycloudflare.com', // NOTE: no wildcard * — use leading dot
    ],
  },
  preview: {
    host: true,
<<<<<<< HEAD
    port: 5180,
  },
  build: {
    rollupOptions: {
      external: id => id.includes('artifacts'),
    },
=======
    port: 5173,
>>>>>>> 6314d33ae7be63cad8151236506c7612a441e77e
  },
});
