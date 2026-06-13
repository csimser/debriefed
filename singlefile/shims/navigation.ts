/**
 * next/navigation shim for the single-file build.
 *
 * The app pages were written for the Next.js App Router; in Debriefed.html
 * they run on a hash router instead (file:// has no real paths). This module
 * is aliased in place of 'next/navigation' by singlefile/vite.config.ts.
 *
 * Hash format: #/career-tools/?tool=linkedin
 */
import { useSyncExternalStore } from 'react'

function parseHash(): { pathname: string; search: string } {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [pathPart, queryPart] = raw.split('?')
  let pathname = pathPart || '/'
  if (!pathname.startsWith('/')) pathname = '/' + pathname
  // normalize trailing slash like the Next build (except root)
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1)
  return { pathname, search: queryPart ? `?${queryPart}` : '' }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function toHash(href: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href
  return `#${href.startsWith('/') ? href : `/${href}`}`
}

export function navigate(href: string, replace = false): void {
  const hash = toHash(href)
  if (!hash.startsWith('#')) {
    window.location.href = hash
    return
  }
  if (replace) {
    const url = new URL(window.location.href)
    url.hash = hash
    window.history.replaceState(null, '', url)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => parseHash().pathname, () => '/')
}

// Cache the parsed params so the returned reference is stable while the query
// string is unchanged. Real next/navigation memoizes useSearchParams the same
// way; without this, every render produces a fresh URLSearchParams object,
// which makes effects that depend on `searchParams` (e.g. TopNav's
// close-menu-on-route-change effect) re-run on every render and instantly
// dismiss menus that were just opened.
let cachedSearch: string | null = null
let cachedParams = new URLSearchParams()

export function useSearchParams(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, () => parseHash().search, () => '')
  if (search !== cachedSearch) {
    cachedSearch = search
    cachedParams = new URLSearchParams(search)
  }
  return cachedParams
}

export function useRouter() {
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, true),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => {},
    prefetch: () => {},
  }
}

export function redirect(href: string): never {
  navigate(href, true)
  throw new Error('NEXT_REDIRECT')
}

export function notFound(): never {
  navigate('/', true)
  throw new Error('NEXT_NOT_FOUND')
}
