import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    target: 'es2020',        // ✅ ensures destructuring is supported
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',      // ✅ also for dependency pre‑bundling
    },
  },
});