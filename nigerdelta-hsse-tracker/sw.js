// Bumped for the Phase 7 storage/offline rework: the app shell is now
// precached in full from a build-time manifest (see vite.config.js's
// precacheManifestPlugin), not just the root document and icons, so a
// first offline launch after install actually works.
const CACHE_VERSION = 'hsse-v2'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`
const SCOPE = self.registration.scope

const BASE_STATIC_ASSETS = [SCOPE, `${SCOPE}manifest.json`, `${SCOPE}icon-192.png`, `${SCOPE}icon-512.png`]

async function precacheManifestAssets() {
  try {
    const response = await fetch(`${SCOPE}precache-manifest.json`)
    if (!response.ok) return []
    const { assets } = await response.json()
    return (assets ?? []).map((path) => `${SCOPE}${path}`)
  } catch {
    // No manifest (e.g. local dev without a build) — the base static
    // assets below still get cached.
    return []
  }
}

// Install: cache the full app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const manifestAssets = await precacheManifestAssets()
      const cache = await caches.open(STATIC_CACHE)
      await cache.addAll([...new Set([...BASE_STATIC_ASSETS, ...manifestAssets])])
      await self.skipWaiting()
    })(),
  )
})

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

// Fetch: cache-first for static, network-first for dynamic (navigations, everything else)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Skip non-GET requests and cross-origin requests
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return

  const isStaticAsset = /\.(js|css|png|svg|ico|woff2?|json)$/.test(url.pathname)

  if (isStaticAsset) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((response) => {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then((c) => c.put(e.request, clone))
            return response
          }),
      ),
    )
    return
  }

  // Network-first for everything else (e.g. navigations), falling back to
  // the cached app shell so the app still loads offline.
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(DYNAMIC_CACHE).then((c) => c.put(e.request, clone))
        return response
      })
      .catch(() => caches.match(e.request).then((cached) => cached || caches.match(SCOPE))),
  )
})
