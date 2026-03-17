/**
 * Service Worker for Noodle NextJS
 * Handles push notifications and offline functionality
 */

const CACHE_NAME = 'noodle-cache-v1';

// Handle push events
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: '🍜 Noodle',
        body: event.data.text(),
      };
    }
  }

  const title = data.title || '🍜 Noodle';
  const options = {
    body: data.body || 'New notification',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    data: data.data || {},
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction ?? true,
    actions: [
      {
        action: 'view',
        title: 'ดูออเดอร์',
      },
      {
        action: 'dismiss',
        title: 'ปิด',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Default action or 'view' - open the order page
  const urlToOpen = event.notification.data?.url || '/admin/orders';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/icon.png',
        '/badge.png',
      ]);
    })
  );
});

// Handle activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Handle fetch event - basic offline support
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // If offline and resource not in cache, return offline page
      if (event.request.destination === 'document') {
        return caches.match('/');
      }
    })
  );
});
