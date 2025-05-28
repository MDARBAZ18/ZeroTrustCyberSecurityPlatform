import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173,
    cors: true,
    strictPort: true,
    allowedHosts: [
      '.trycloudflare.com', // NOTE: no wildcard * — use leading dot
    ],
  },
  preview: {
    host: true,
    port: 5173,
  },
});
