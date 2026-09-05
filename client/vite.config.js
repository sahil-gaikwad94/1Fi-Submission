import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev proxy passes /api requests to the Express server.
// In production, the Express server serves the built dist/ and /api itself on the same port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
