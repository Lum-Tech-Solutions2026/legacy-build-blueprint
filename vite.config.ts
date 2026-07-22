import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"],
      manifest: {
        name: "Lum Tech Building Solutions",
        short_name: "Lum Tech",
        description: "Professional residential & commercial construction services in Pietermaritzburg, KZN.",
        theme_color: "#0A1624",
        background_color: "#0A1624",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Don't let the SW cache /admin or /auth - always fetch fresh so
        // logged-in admin data is never served stale from cache.
        navigateFallbackDenylist: [/^\/admin/, /^\/auth/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tugfihcysrphyxadpcrz\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api-cache",
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
