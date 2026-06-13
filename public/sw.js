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
const CACHE_VERSION = 'v2'
const RUNTIME_CACHE = `debriefed-runtime-${CACHE_VERSION}`

// App shell + fonts precached so core routes work offline after first visit
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
  '/help/',
  '/manifest.json',
  // fonts (latin subsets; generated list — keep in sync with public/fonts/)
  '/fonts/ui/inter-400.woff2',
  '/fonts/ui/inter-500.woff2',
  '/fonts/ui/inter-600.woff2',
  '/fonts/ui/jetbrainsmono-400.woff2',
  '/fonts/ui/jetbrainsmono-500.woff2',
  '/fonts/ui/rajdhani-400.woff2',
  '/fonts/ui/rajdhani-500.woff2',
  '/fonts/ui/rajdhani-600.woff2',
  '/fonts/ui/rajdhani-700.woff2',
  '/fonts/pdf/bitter-400.ttf',
  '/fonts/pdf/bitter-400i.ttf',
  '/fonts/pdf/bitter-700.ttf',
  '/fonts/pdf/cormorantgaramond-400.ttf',
  '/fonts/pdf/cormorantgaramond-400i.ttf',
  '/fonts/pdf/cormorantgaramond-700.ttf',
  '/fonts/pdf/dmsans-400.ttf',
  '/fonts/pdf/dmsans-400i.ttf',
  '/fonts/pdf/dmsans-700.ttf',
  '/fonts/pdf/dmserifdisplay-400.ttf',
  '/fonts/pdf/karla-400.ttf',
  '/fonts/pdf/karla-400i.ttf',
  '/fonts/pdf/karla-700.ttf',
  '/fonts/pdf/lato-400.ttf',
  '/fonts/pdf/lato-400i.ttf',
  '/fonts/pdf/lato-700.ttf',
  '/fonts/pdf/librebaskerville-400.ttf',
  '/fonts/pdf/librebaskerville-400i.ttf',
  '/fonts/pdf/librebaskerville-700.ttf',
  '/fonts/pdf/merriweather-400.ttf',
  '/fonts/pdf/merriweather-400i.ttf',
  '/fonts/pdf/merriweather-700.ttf',
  '/fonts/pdf/nunitosans-400.ttf',
  '/fonts/pdf/nunitosans-400i.ttf',
  '/fonts/pdf/nunitosans-700.ttf',
  '/fonts/pdf/opensans-400.ttf',
  '/fonts/pdf/opensans-400i.ttf',
  '/fonts/pdf/opensans-700.ttf',
  '/fonts/pdf/sourcesans3-400.ttf',
  '/fonts/pdf/sourcesans3-400i.ttf',
  '/fonts/pdf/sourcesans3-700.ttf',
  '/fonts/pdf/sourceserif4-400.ttf',
  '/fonts/pdf/sourceserif4-400i.ttf',
  '/fonts/pdf/sourceserif4-700.ttf',
]

/** Precache every bundled data file listed in the data manifest. */
async function precacheData(cache) {
  try {
    const res = await fetch('/data/manifest.json')
    if (!res.ok) return
    const manifest = await res.json()
    await cache.put('/data/manifest.json', new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } }))
    for (const table of manifest.tables || []) {
      try {
        const fileRes = await fetch(`/data/${table.file}`)
        if (fileRes.ok) await cache.put(`/data/${table.file}`, fileRes)
      } catch {
        // individual table failures are non-fatal; runtime caching covers them
      }
    }
  } catch {
    // offline install or manifest missing — runtime caching covers it
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then(async (cache) => {
        await cache.addAll(PRECACHE_URLS).catch(() => {})
        await precacheData(cache)
      })
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

  // Immutable build assets + fonts: cache-first
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/fonts/')) {
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
