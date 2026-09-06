import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        short_name: 'Tanvir.ai',
        name: 'Tanvir Ahmed - AI/ML Engineer & Researcher Portfolio',
        icons: [
          { src: 'favicon.svg', type: 'image/svg+xml', sizes: 'any' },
          { src: 'icon-192.png', type: 'image/png', sizes: '192x192' },
          { src: 'icon-512.png', type: 'image/png', sizes: '512x512' },
          { src: 'icon-maskable-512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' }
        ],
        start_url: '/',
        id: '/',
        background_color: '#07090e',
        theme_color: '#00f0ff',
        display: 'standalone',
        orientation: 'portrait'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}']
      }
    })
  ],
  server: {
    port: 3000,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});
