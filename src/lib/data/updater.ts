/**
 * Bundled-data auto-updater.
 *
 * The dictionary + O*NET data ship with each build, but the canonical copies
 * live in the repo at public-data/ and are served raw from GitHub. On app
 * load (throttled to once a day) we compare the remote manifest version with
 * what we have; when the remote is newer, every table is fetched and stored
 * in the Cache API, where the data loader prefers it over the bundled files.
 *
 * Everything fails silent: offline, rate-limited, repo moved — the app keeps
 * using its bundled data.
 */
import { DATA_CACHE_NAME, clearDataMemo } from './files.client'

const REMOTE_BASE = 'https://raw.githubusercontent.com/csimser/debriefed/main/public-data'
const FETCH_TIMEOUT_MS = 5000
const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000 // once a day
const LAST_CHECK_KEY = 'debriefed:data-update-checked'
const INSTALLED_VERSION_KEY = 'debriefed:data-version'

interface DataManifest {
  version: string
  tables: { table: string; rows: number; file: string; bytes: number }[]
}

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

async function getLocalVersion(): Promise<string | null> {
  const installed = localStorage.getItem(INSTALLED_VERSION_KEY)
  if (installed) return installed
  try {
    const res = await fetchWithTimeout('/data/manifest.json')
    if (!res.ok) return null
    const manifest = (await res.json()) as DataManifest
    return manifest.version ?? null
  } catch {
    return null
  }
}

/**
 * Check for newer data and install it. Safe to call on every app load —
 * throttles itself and never throws.
 */
export async function checkForDataUpdate(): Promise<void> {
  if (typeof window === 'undefined' || typeof caches === 'undefined') return
  // Single-file build carries its data inline; updates come with new releases
  if (window.__DEBRIEFED_DATA__) return

  try {
    const lastChecked = Number(localStorage.getItem(LAST_CHECK_KEY) || 0)
    if (Date.now() - lastChecked < CHECK_INTERVAL_MS) return
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))

    const res = await fetchWithTimeout(`${REMOTE_BASE}/manifest.json`)
    if (!res.ok) return
    const remote = (await res.json()) as DataManifest
    if (!remote?.version || !Array.isArray(remote.tables)) return

    const localVersion = await getLocalVersion()
    if (localVersion === remote.version) return

    // Fetch every table; install only if ALL succeed (no torn updates)
    const cache = await caches.open(DATA_CACHE_NAME)
    const entries: { path: string; res: Response }[] = []
    for (const table of remote.tables) {
      const tableRes = await fetchWithTimeout(`${REMOTE_BASE}/${table.file}`)
      if (!tableRes.ok) return
      entries.push({ path: `/data/${table.file}`, res: tableRes })
    }
    for (const { path, res: tableRes } of entries) {
      await cache.put(path, tableRes)
    }
    await cache.put(
      '/data/manifest.json',
      new Response(JSON.stringify(remote), {
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    localStorage.setItem(INSTALLED_VERSION_KEY, remote.version)
    clearDataMemo()
    console.info(`[data-updater] installed data version ${remote.version}`)
  } catch {
    // Silent by design
  }
}
