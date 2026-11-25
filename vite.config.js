import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-192-maskable.png', 'icons/icon-512-maskable.png'],
      manifest: {
        name: 'NotesHub — Free Notes and Study PDFs',
        short_name: 'NotesHub',
        description: 'Discover and share free study notes for any subject and learning level.',
        id: '/',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        background_color: '#f8f6ef',
        theme_color: '#f8f6ef',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/samples\//],
        runtimeCaching: [
          { urlPattern: /^https:\/\/[^/]+\.supabase\.co\//, handler: 'NetworkOnly' },
          { urlPattern: /\.pdf(?:\?.*)?$/i, handler: 'NetworkOnly' },
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: { host: '0.0.0.0' },
});