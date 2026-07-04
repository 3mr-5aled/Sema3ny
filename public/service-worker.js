// Service Worker for EntQha PWA
// Version 1.0.0

const CACHE_NAME = "EntQha-v2"
const STATIC_CACHE = "EntQha-static-v2"
const DYNAMIC_CACHE = "EntQha-dynamic-v2"
const API_CACHE = "EntQha-api-v2"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/app-icon.png",
  "/nav-logo.png",
  "/logo.png",
  "/launchericon-192x192.png",
  "/launchericon-512x512.png",
]

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache (for API calls)
  networkFirst: async (request) => {
    try {
      const response = await fetch(request)
      const cache = await caches.open(API_CACHE)
      cache.put(request, response.clone())
      return response
    } catch (error) {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
      // Return offline page for navigation requests
      if (request.mode === "navigate") {
        return caches.match("/offline")
      }
      throw error
    }
  },

  // Cache first, fallback to network (for static assets)
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    try {
      const response = await fetch(request)
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
      return response
    } catch (error) {
      console.error("Cache first strategy failed:", error)
      throw error
    }
  },

  // Network only (for authentication, POST/PUT/DELETE)
  networkOnly: async (request) => {
    return fetch(request)
  },
}

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...")
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[Service Worker] Caching static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== STATIC_CACHE &&
              name !== DYNAMIC_CACHE &&
              name !== API_CACHE
            )
          })
          .map((name) => {
            console.log("[Service Worker] Deleting old cache:", name)
            return caches.delete(name)
          }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - apply caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests for caching
  if (request.method !== "GET") {
    event.respondWith(CACHE_STRATEGIES.networkOnly(request))
    return
  }

  // API requests - network first
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(CACHE_STRATEGIES.networkFirst(request))
    return
  }

  // Authentication requests - network only
  if (url.pathname.startsWith("/auth/")) {
    event.respondWith(CACHE_STRATEGIES.networkOnly(request))
    return
  }

  // Static assets - cache first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/)
  ) {
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request))
    return
  }

  // Pages - network first, fallback to cache
  event.respondWith(CACHE_STRATEGIES.networkFirst(request))
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync:", event.tag)

  if (event.tag === "sync-offline-actions") {
    event.waitUntil(syncOfflineActions())
  }
})

// Sync offline actions when connection is restored
async function syncOfflineActions() {
  try {
    // Get pending actions from IndexedDB or localStorage
    // This would be implemented based on your offline storage strategy
    console.log("[Service Worker] Syncing offline actions...")

    // Example: Replay failed API calls
    // const pendingActions = await getPendingActions()
    // for (const action of pendingActions) {
    //   await fetch(action.url, action.options)
    // }

    return Promise.resolve()
  } catch (error) {
    console.error("[Service Worker] Sync failed:", error)
    return Promise.reject(error)
  }
}

// Push notifications (for future implementation)
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received")

  const options = {
    body: event.data ? event.data.text() : "New notification",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/launchericon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/launchericon-192x192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("EntQha", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked")
  event.notification.close()

  event.waitUntil(clients.openWindow("/"))
})

// Message handler for communication with main app
self.addEventListener("message", (event) => {
  console.log("[Service Worker] Message received:", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls)
      }),
    )
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)))
      }),
    )
  }
})
