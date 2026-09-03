const CACHE_VERSION = 'hsse-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`
const SCOPE = self.registration.scope

const STATIC_ASSETS = [SCOPE, `${SCOPE}manifest.json`, `${SCOPE}icon-192.png`, `${SCOPE}icon-512.png`]

// Install: cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
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

  const isStaticAsset = STATIC_ASSETS.includes(e.request.url) || /\.(js|css|png|svg|ico|woff2?)$/.test(url.pathname)

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

  // Network-first for everything else
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

// Background Sync for queued reports
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-reports') {
    e.waitUntil(syncQueuedReports())
  }
})

async function syncQueuedReports() {
  // This app stores reports directly in localStorage (no backend API to POST to),
  // so there is nothing to replay here — just tell open tabs connectivity is back
  // so they can flip any locally-queued reports to submitted.
  const clients = await self.clients.matchAll()
  clients.forEach((client) => {
    client.postMessage({ type: 'SYNC_COMPLETE', message: 'Queued reports submitted' })
  })
}

self.addEventListener('message', (event) => {
  if (event.data === 'SYNC_QUEUE') {
    event.waitUntil(syncQueuedReports())
  }
})
