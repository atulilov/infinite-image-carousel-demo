const CACHE_NAME = "infinite-carousel-v1";
const STATIC_CACHE_URLS = [
  "/",
  "/offline",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/badge.png",
];

// Install event - cache static assets
self.addEventListener("install", event => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log("Static assets cached");
        return self.skipWaiting();
      })
      .catch(error => {
        console.error("Cache installation failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - simplified caching for production PWA
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle app shell and navigation requests
  if (url.origin === self.location.origin) {
    event.respondWith(handleAppRequest(request));
  }
  // Let external requests (like Picsum images) go through normally
  // Next.js handles its own asset caching in production
});

// Simplified strategy for app shell and navigation
async function handleAppRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);

    // Cache successful responses for offline use
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache:", error);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // For navigation requests, show offline page
    if (request.mode === "navigate") {
      const offlineResponse = await caches.match("/offline");
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    return new Response("Offline", { status: 503 });
  }
}
