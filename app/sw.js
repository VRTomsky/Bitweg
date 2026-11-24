// Service Worker fuer Bitweg: macht die Seite installierbar, zeigt sie auch ohne Netz
// und haelt die Zahl der Anfragen an GitHub klein.
//
// Online (bitweg.de):
//  - Seitenaufruf (index.html): "Netz zuerst", damit eine neue Version sofort gefunden wird.
//  - Alle anderen eigenen Dateien (JS, CSS, Schriften, Bilder): "Speicher zuerst".
//    Ein F5 schickt so nur 1-2 Anfragen statt ueber 80. Das ist wichtig, weil GitHub Pages
//    pro Internet-Adresse drosselt ("Rate limit exceeded") und in der Schule alle eine Adresse teilen.
//  - VERSION wird beim Veroeffentlichen durch den Git-Stand ersetzt (.github/workflows/pages.yml).
//    Neue Version = neuer Speicher, der alte wird geloescht.
// Lokal (server.py) bleibt alles "Netz zuerst", damit Aenderungen sofort sichtbar sind.

const VERSION = '__BUILD__';
const CACHE = `bitweg-${VERSION}`;
const CACHE_FIRST = !VERSION.startsWith('__') && !/^(127\.0\.0\.1|localhost)$/.test(self.location.hostname);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  } catch {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const shell = await caches.match('./index.html') || await caches.match('./');
      if (shell) return shell;
    }
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  // "no-cache": beim Server nachfragen (meist kurz "304, unveraendert"), sonst kaeme nach einer
  // neuen Version die alte Datei aus dem normalen Browser-Zwischenspeicher (GitHub: 10 Minuten gueltig).
  const res = await fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }));
  if (res.ok) cache.put(req, res.clone()).catch(() => {});
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Nur eigene Dateien, keine API-Aufrufe des lokalen Servers, nur GET
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/')) return;
  const page = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  e.respondWith(CACHE_FIRST && !page ? cacheFirst(req).catch(() => networkFirst(req)) : networkFirst(req));
});

// Erster Besuch: Die Seite war schon geladen, bevor dieser Service Worker lief. Die Seite schickt
// uns die Liste ihrer Dateien, wir legen sie aus dem normalen Browser-Speicher ab (keine neuen Anfragen).
self.addEventListener('message', e => {
  if (!CACHE_FIRST || e.data?.type !== 'warm' || !Array.isArray(e.data.urls)) return;
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const u of e.data.urls.slice(0, 200)) {
      try {
        const url = new URL(u);
        if (url.origin !== self.location.origin || url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname.includes('/api/')) continue;
        if (await cache.match(u)) continue;
        const res = await fetch(u);
        if (res.ok) await cache.put(u, res);
      } catch { /* egal */ }
    }
  })());
});
