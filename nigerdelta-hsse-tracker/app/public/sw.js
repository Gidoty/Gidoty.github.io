const CACHE_VERSION = 'hsse-tracker-v1'
const SCOPE = self.registration.scope
const APP_SHELL = [SCOPE, `${SCOPE}manifest.json`, `${SCOPE}icon-192.png`, `${SCOPE}icon-512.png`]

const DB_NAME = 'hsse-tracker-offline'
const STORE_NAME = 'pending-reports'

function openQueueDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function queueRequest(request) {
  const db = await openQueueDb()
  const body = await request.clone().text()
  const entry = {
    url: request.url,
    method: request.method,
    headers: [...request.headers.entries()],
    body,
    queuedAt: Date.now(),
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function replayQueue() {
  const db = await openQueueDb()
  const entries = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

  for (const entry of entries) {
    try {
      await fetch(entry.url, {
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
      })
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(entry.id)
    } catch {
      // Still offline — leave it queued and try again next time.
    }
  }
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    if (request.url.includes('/api/')) {
      event.respondWith(
        fetch(request.clone()).catch(async () => {
          await queueRequest(request)
          return new Response(
            JSON.stringify({ queued: true, message: 'Saved on-device. Will submit when you are back online.' }),
            { status: 202, headers: { 'Content-Type': 'application/json' } },
          )
        }),
      )
    }
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(SCOPE)),
    )
    return
  }

  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request)),
    )
    return
  }

  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
            return response
          }),
      ),
    )
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(replayQueue())
  }
})

self.addEventListener('message', (event) => {
  if (event.data === 'SYNC_QUEUE') {
    event.waitUntil(replayQueue())
  }
})
