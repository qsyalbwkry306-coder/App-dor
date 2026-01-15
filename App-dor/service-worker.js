
const CACHE_NAME = 'workshop-accountant-cache-v7';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.tsx',
  './components/Dashboard.tsx',
  './components/OrderManagement.tsx',
  './components/Accounting.tsx',
  './components/Inventory.tsx',
  './components/AIAssistant.tsx',
  './services/geminiService.ts',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache files:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
