import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Load from .env files
  const env = loadEnv(mode, '.', 'VITE_');
  
  // Use process.env directly for GitHub Actions (runtime env vars)
  // Fallback to env from .env files
  const apiKey = process.env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
  
  return {
    base: '/Corporate-Ranker/',
    build: {
      outDir: 'docs',
    },
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
