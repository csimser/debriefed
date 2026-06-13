/**
 * Debriefed service worker — offline support for the PWA.
 *
 * Strategy:
 *  - /_next/static/*  → cache-first (content-hashed, immutable)
 *  - /data/*          → handled by the in-app auto-updater via its own
 *                       Cache (debriefed-data-v1); here network-falling-
 *                       back-to-cache so a fresh deploy still serves
 *  - pages & other same-origin GETs → stale-while-revalidate
 *  - cross-origin (api.anthropic.com etc.) → never intercepted
 *
 * Bump CACHE_VERSION to invalidate the runtime cache on deploy.
 */
const CACHE_VERSION = 'v1'
const RUNTIME_CACHE = `debriefed-runtime-${CACHE_VERSION}`

// Minimal shell so core app routes work offline after first visit
const PRECACHE_URLS = [
  '/',
  '/dashboard/',
  '/profile/',
  '/resumes/',
  '/career-tools/',
  '/job-match/',
  '/tracker/',
  '/settings/',
  '/onboarding/',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('debriefed-runtime-') && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Immutable build assets: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const hit = await cache.match(request)
        if (hit) return hit
        const res = await fetch(request)
        if (res.ok) cache.put(request, res.clone())
        return res
      }),
    )
    return
  }

  // Bundled data: network first (the updater keeps its own newer copies)
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          const res = await fetch(request)
          if (res.ok) cache.put(request, res.clone())
          return res
        } catch {
          const hit = await cache.match(request)
          if (hit) return hit
          throw new Error('offline and uncached: ' + url.pathname)
        }
      }),
    )
    return
  }

  // Pages and the rest: stale-while-revalidate
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
      const cached = await cache.match(request)
      const network = fetch(request)
        .then((res) => {
          if (res.ok) cache.put(request, res.clone())
          return res
        })
        .catch(() => undefined)
      return cached || (await network) || caches.match('/')
    }),
  )
})
