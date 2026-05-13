// vite.config.cjs
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',      // ← skip transpilation
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',    // ← also for dependencies
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});