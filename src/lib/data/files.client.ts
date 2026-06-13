/**
 * Browser-side loader for the bundled data files (dictionary tables,
 * O*NET occupations).
 *
 * Resolution order per file:
 *   1. `window.__DEBRIEFED_DATA__` — the single-file build injects every
 *      data file into this object at build time
 *   2. Cache API copy refreshed by the auto-updater (newer than the bundle)
 *   3. `fetch('/data/<file>')` — static assets deployed with the PWA
 *
 * Results are memoized per session.
 */

declare global {
  interface Window {
    __DEBRIEFED_DATA__?: Record<string, unknown>
  }
}

export const DATA_CACHE_NAME = 'debriefed-data-v1'

const memo = new Map<string, unknown>()

export async function loadDataFile<T>(file: string): Promise<T> {
  if (memo.has(file)) return memo.get(file) as T

  // 1. Embedded data (single-file build)
  if (typeof window !== 'undefined' && window.__DEBRIEFED_DATA__?.[file] !== undefined) {
    const data = window.__DEBRIEFED_DATA__[file] as T
    memo.set(file, data)
    return data
  }

  // 2. Auto-updated copy in the Cache API (may be newer than the deploy)
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open(DATA_CACHE_NAME)
      const hit = await cache.match(`/data/${file}`)
      if (hit) {
        const data = (await hit.json()) as T
        memo.set(file, data)
        return data
      }
    } catch {
      // Cache API unavailable (private browsing etc.) — fall through
    }
  }

  // 3. Bundled static asset
  const res = await fetch(`/data/${file}`)
  if (!res.ok) throw new Error(`Failed to load data file ${file}: ${res.status}`)
  const data = (await res.json()) as T
  memo.set(file, data)
  return data
}

/** Drop the in-memory copies (used after the auto-updater installs new data). */
export function clearDataMemo(): void {
  memo.clear()
}
