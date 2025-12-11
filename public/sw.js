// TBW AI – simple PWA cache

const CACHE_NAME = "tbw-ai-v20";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/tbw-logo.png",
  "/tbw-logo-512.png",
  "/tbw-logo-1024.png",
  "/intro.mp4",
  "/hero-paris-desktop.jpg",
  "/hero-paris-mobile.jpg",
  "/hero-zadar.jpg",
  "/hero-split.jpg",
  "/hero-zagreb.jpg",
  "/hero-karlovac.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // statika – cache first
  if (
    CORE_ASSETS.some((a) => request.url.includes(a)) ||
    ["image", "style", "script"].includes(request.destination)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return resp;
          })
      )
    );
    return;
  }

  // ostalo – network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
