/**
 * Build-time (Node) loader for the bundled data files.
 *
 * Used by the static-export data layers (`mos-page-data`, sitemap) during
 * `next build`. Reads straight from the committed `public-data/` directory —
 * the same files the browser loader fetches from `/data/` at runtime.
 */
import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), 'public-data')

const memo = new Map<string, unknown>()

export function loadDataFileSync<T>(file: string): T {
  if (memo.has(file)) return memo.get(file) as T
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')) as T
  memo.set(file, data)
  return data
}
