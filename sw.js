const CACHE_NAME = 'mami-yoyita-v2';
const STATIC_ASSETS = [
  '/mami-yoyita-app/',
  '/mami-yoyita-app/index.html',
  '/mami-yoyita-app/index.css',
  '/mami-yoyita-app/icon-192.svg',
  '/mami-yoyita-app/icon-512.svg'
];

// Solo cachear respuestas de nuestro propio dominio (anti cache-poisoning)
const TRUSTED_ORIGINS = [
  'https://andres12311.github.io',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
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

// Fetch: network-first con protección anti cache-poisoning
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // SOLO procesar peticiones GET (las POST no se cachean)
  if (event.request.method !== 'GET') return;

  // NO cachear peticiones a Firebase/APIs/Auth
  if (url.hostname.includes('firestore') || 
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('identitytoolkit') ||
      url.hostname.includes('securetoken')) {
    return;
  }

  // SOLO cachear respuestas de orígenes de confianza
  const isTrusted = TRUSTED_ORIGINS.some(origin => event.request.url.startsWith(origin));
  
  if (!isTrusted) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear respuestas exitosas y del tipo correcto
        if (response.ok && response.type === 'basic' || response.type === 'cors') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
