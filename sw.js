const CACHE_NAME = 'travel-checklist-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './china-checklist.html',
  './japan-checklist.html',
  './korea-checklist.html',
  './tokyo.html',
  './osaka.html',
  './kyoto.html',
  './hokkaido.html',
  './okinawa.html',
  './fukuoka.html',
  './seoul.html',
  './busan.html',
  './jeju.html',
  './shanghai.html',
  './beijing.html',
  './data.json',
  './calculator.html'
];

// Install: cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        // Cache successful GET responses for future offline use
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.method === 'GET'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If both cache and network fail, return a simple offline fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
