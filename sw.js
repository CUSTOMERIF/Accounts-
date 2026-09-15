const CACHE = 'foods-accounts-shell-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const target = new URL(request.url);
  // Chỉ cache bộ vỏ GitHub; không cache dữ liệu Google Apps Script.
  if (target.origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
