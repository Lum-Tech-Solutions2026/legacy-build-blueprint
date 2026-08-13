/// <reference lib="webworker" />
// Custom service worker (built via vite-plugin-pwa's injectManifest strategy)
// so we can add real push notification handling on top of the usual
// precache/offline behavior. self.__WB_MANIFEST is replaced at build time
// with the list of files to precache.

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Supabase API calls: try the network first, fall back to cache when offline
registerRoute(
  ({ url }) => url.origin === "https://tugfihcysrphyxadpcrz.supabase.co",
  new NetworkFirst({
    cacheName: "supabase-api-cache",
    networkTimeoutSeconds: 5,
  })
);

// SPA navigation fallback - never serve the cached shell for /admin or /auth,
// so logged-in admin data is always fetched fresh.
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), {
    denylist: [/^\/admin/, /^\/auth/],
  })
);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// --- Web Push ---
self.addEventListener("push", (event: PushEvent) => {
  let data: { title?: string; body?: string; url?: string } = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Lum Tech Building Solutions", body: event.data?.text() || "" };
  }

  const title = data.title || "Lum Tech Building Solutions";
  const options: NotificationOptions = {
    body: data.body || "",
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: { url: data.url || "/admin" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/admin";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client && client.url.includes(targetUrl)) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
