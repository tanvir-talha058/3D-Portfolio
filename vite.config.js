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
        short_name: 'Tanvir Ahmed',
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
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        // generateSW registers a catch-all NavigationRoute that serves
        // index.html for every navigation-mode request by default. Without
        // this, the resume PDF's iframe preview, "Full Tab", and Download
        // links (ResumeModal.jsx) all silently load the app shell instead
        // of the PDF once the service worker is installed — the site has
        // no client-side routing, so nothing actually needs that fallback
        // to reach index.html; it only needs to not swallow real files.
        navigateFallbackDenylist: [/\.pdf$/i]
      }
    })
  ],
  server: {
    port: 3000,
    open: false
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          lucide: ['lucide-react']
        }
      }
    }
  }
});
