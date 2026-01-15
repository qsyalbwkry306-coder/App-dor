
const CACHE_NAME = 'workshop-accountant-cache-v2';
const urlsToCache = [
  '.',
  'index.html',
  'index.tsx',
  'css/style.css',
  'js/App.tsx',
  'js/constants.tsx',
  'js/types.ts',
  'js/components/Dashboard.tsx',
  'js/components/OrderManagement.tsx',
  'js/components/Accounting.tsx',
  'js/components/Inventory.tsx',
  'js/components/AIAssistant.tsx',
  'js/services/geminiService.ts',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Using addAll which is atomic, if one fetch fails, all fail.
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache files during install:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              if(!event.request.url.startsWith('https://esm.sh/')) return response;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
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
