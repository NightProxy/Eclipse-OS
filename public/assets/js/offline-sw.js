// public/service-worker.js
const CACHE_NAME = 'eclipse-os-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/vendors~main.chunk.js',
  '/static/css/main.chunk.css',
  // Add any other assets you want to cache here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const offlineMode = await getOfflineMode();
      if (offlineMode) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      return fetch(event.request);
    })()
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

async function getOfflineMode() {
  const offlineMode = await new Promise((resolve) => {
    const openRequest = indexedDB.open('settings', 1);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction('settings', 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('offlineMode');

      request.onsuccess = () => {
        resolve(request.result ? request.result.value : false);
      };

      request.onerror = () => {
        resolve(false);
      };
    };

    openRequest.onerror = () => {
      resolve(false);
    };
  });

  return offlineMode;
}
