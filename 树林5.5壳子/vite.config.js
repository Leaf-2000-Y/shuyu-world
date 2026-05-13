import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages serves from root, no subdirectory needed
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5180,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});


