// La Tournée : garde le jeu en cache pour qu'il s'ouvre sans réseau.
const CACHE = "tournee-fc02b5363c";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "icone-192.png", "icone-512.png", "icone-180.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // Réseau d'abord pour récupérer les mises à jour, cache si le réseau manque.
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; }).catch(() => caches.match(e.request, { ignoreSearch:true }).then(r => r || caches.match("index.html"))));
});
