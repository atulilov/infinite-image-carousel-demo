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

// Fetch event - implement caching strategies
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/_next/")) {
    // Next.js assets - cache first strategy
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.hostname === "picsum.photos") {
    // External images - cache first with network fallback
    event.respondWith(cacheFirstWithNetworkFallback(request));
  } else if (url.origin === self.location.origin) {
    // Same origin requests - network first with cache fallback
    event.respondWith(networkFirstStrategy(request));
  }
});

// Cache first strategy - good for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return new Response("Network error", { status: 408 });
  }
}

// Network first strategy - good for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache:", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cache and network failed, return offline page for navigation requests
    if (request.mode === "navigate") {
      const offlineResponse = await caches.match("/offline");
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    return new Response("Offline", { status: 503 });
  }
}

// Cache first with network fallback for images
async function cacheFirstWithNetworkFallback(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      // Only cache successful responses
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Image caching failed:", error);
    // Return a placeholder or cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return a simple placeholder response for failed image requests
    return new Response("", {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Background sync for when connection is restored
self.addEventListener("sync", event => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered");
    event.waitUntil(
      // Perform any background tasks here
      self.registration.showNotification("Back online!", {
        body: "Your connection has been restored.",
        icon: "/icon-192x192.png",
        badge: "/badge.png",
      })
    );
  }
});

// Handle push notifications (for future use)
self.addEventListener("push", event => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icon-192x192.png",
        badge: "/badge.png",
      })
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
