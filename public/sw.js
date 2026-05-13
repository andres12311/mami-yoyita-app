const CACHE_NAME = 'mami-yoyita-v1';
const STATIC_ASSETS = [
  '/mami-yoyita-app/',
  '/mami-yoyita-app/index.html',
  '/mami-yoyita-app/index.css',
  '/mami-yoyita-app/icon-192.svg',
  '/mami-yoyita-app/icon-512.svg'
];

// Instalar: cachear archivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first para datos dinámicos, cache-first para estáticos
self.addEventListener('fetch', (event) => {
  // No cachear peticiones a Firebase/APIs
  if (event.request.url.includes('firestore') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guardar copia en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Si no hay red, buscar en caché
        return caches.match(event.request);
      })
  );
});
