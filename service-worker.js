
const CACHE_NAME = 'workshop-accountant-cache-v5';
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
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap'
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
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => caches.match(event.request));
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
