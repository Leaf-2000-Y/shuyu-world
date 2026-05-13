import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/shulin-world/',
  assetsInclude: ['**/*.md'],
  server: {
    host: '0.0.0.0',
    port: 5180,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 600,
  },
});