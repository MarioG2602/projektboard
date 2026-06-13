const CACHE_NAME = "projektboard-v18";
const APP_SHELL = ["./", "./index.html", "./data-core.js", "./sync-core.js", "./manifest.webmanifest", "./icons/projektboard-192.png", "./icons/projektboard-512.png"];
const CACHEABLE_DESTINATIONS = new Set([
  "document",
  "style",
  "script",
  "font",
  "image",
  "manifest",
]);

function isSupabaseRequest(url) {
  return url.hostname === "supabase.co" || url.hostname.endsWith(".supabase.co");
}

function canCache(request, url) {
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    !isSupabaseRequest(url) &&
    !request.headers.has("authorization") &&
    CACHEABLE_DESTINATIONS.has(request.destination)
  );
}

async function cacheResponse(request, response) {
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.add("./index.html");
      await Promise.allSettled(APP_SHELL.filter((url) => url !== "./index.html").map((url) => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!canCache(request, url)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match("./index.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => cacheResponse(request, response))
    )
  );
});
