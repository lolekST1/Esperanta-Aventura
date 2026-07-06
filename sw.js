// Service worker — gra działa w pełni offline po pierwszym otwarciu.
const CACHE = "esperanta-aventuro-v2";
const ASSETS = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/main.js",
  "js/game.js",
  "js/map.js",
  "js/audio.js",
  "js/data/zones.js",
  "assets/icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
