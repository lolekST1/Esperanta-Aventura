// Service worker — gra działa w pełni offline po pierwszym otwarciu.
//
// Kod (HTML/JS/CSS) idzie strategią "najpierw sieć": gdy jest internet,
// zawsze bierzemy najświeższą wersję i dokładamy do cache; offline —
// spadamy na to, co jest w cache. Bez tego stara wersja gry potrafiła
// zostać w PWA nawet po wdrożeniu poprawki, dopóki ktoś nie zamknął
// i nie otworzył aplikacji kilka razy (mylące przy debugowaniu na żywo).
const CACHE = "esperanta-aventuro-v18";
const ASSETS = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/main.js",
  "js/game.js",
  "js/map.js",
  "js/story.js",
  "js/audio.js",
  "js/data/zones.js",
  "js/data/story.js",
  "assets/icon.svg",
];

const CODE_PATTERN = /\.(js|css|html)$/;

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
  const isCode = e.request.mode === "navigate" || CODE_PATTERN.test(new URL(e.request.url).pathname);

  if (isCode) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request)));
  }
});
