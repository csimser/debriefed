#!/usr/bin/env node
/**
 * Builds the bundled data files from the canonical dictionary export.
 *
 * Input:  supabase/seed-data/dictionary-export/*.json  (full Supabase export)
 * Output: public-data/*.json                           (committed, served raw from GitHub
 *                                                       for the in-app auto-updater)
 *
 * Transforms:
 *  - excludes community/ops tables (submissions, upvotes, missing-terms log)
 *  - strips `id` + `created_at` except where code looks rows up by id
 *  - minifies
 *  - derives onet-occupations.json (distinct code/title pairs from the DoD crosswalk)
 *  - writes manifest.json with row counts + content hash for update checks
 *
 * Run: node scripts/build-data.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const SRC = 'supabase/seed-data/dictionary-export'
const OUT = 'public-data'

const EXCLUDED = new Set([
  'dict_missing_terms_log',
  'dict_submissions',
  'dict_submission_upvotes',
])

// Tables whose rows are referenced by id in code (templateFiller etc.) keep their ids.
const KEEP_ID = new Set([
  'dict_cover_letter_templates',
  'dict_resume_templates',
  'dict_linkedin_templates',
])

const srcManifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'))
fs.mkdirSync(OUT, { recursive: true })

const outTables = []
let totalRows = 0
const hash = crypto.createHash('sha256')

for (const entry of srcManifest.tables) {
  if (EXCLUDED.has(entry.table)) continue
  const rows = JSON.parse(fs.readFileSync(path.join(SRC, entry.file), 'utf8'))
  const keepId = KEEP_ID.has(entry.table)
  const cleaned = rows.map((row) => {
    const { id, created_at, updated_at, ...rest } = row
    return keepId ? { id, ...rest } : rest
  })
  const outName = entry.table.replace(/^dict_/, '') + '.json'
  const body = JSON.stringify(cleaned)
  fs.writeFileSync(path.join(OUT, outName), body)
  hash.update(body)
  outTables.push({ table: entry.table, rows: cleaned.length, file: outName, bytes: body.length })
  totalRows += cleaned.length
}

// O*NET occupation titles: distinct (onet_code, onet_title) from the DoD crosswalk.
// This is the local replacement for the O*NET /veterans/search keyword API.
const crosswalk = JSON.parse(fs.readFileSync(path.join(SRC, 'dict_onet_crosswalk.json'), 'utf8'))
const occupations = new Map()
for (const row of crosswalk) {
  if (
    row.onet_code &&
    row.onet_title &&
    /^\d{2}-\d{4}\.\d{2}$/.test(row.onet_code) &&
    !occupations.has(row.onet_code)
  ) {
    occupations.set(row.onet_code, row.onet_title)
  }
}
const occList = [...occupations.entries()]
  .map(([code, title]) => ({ code, title }))
  .sort((a, b) => a.code.localeCompare(b.code))
const occBody = JSON.stringify(occList)
fs.writeFileSync(path.join(OUT, 'onet-occupations.json'), occBody)
hash.update(occBody)
outTables.push({
  table: 'onet_occupations',
  rows: occList.length,
  file: 'onet-occupations.json',
  bytes: occBody.length,
})

const manifest = {
  // Bump when the source export is refreshed; the updater compares versions.
  version: `${srcManifest.exported_at.slice(0, 10)}.${hash.digest('hex').slice(0, 8)}`,
  source_exported_at: srcManifest.exported_at,
  total_rows: totalRows + occList.length,
  tables: outTables,
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))

// Mirror into public/data/ so the static export serves the files at /data/*
const PUBLIC_DATA = path.join('public', 'data')
fs.rmSync(PUBLIC_DATA, { recursive: true, force: true })
fs.mkdirSync(PUBLIC_DATA, { recursive: true })
for (const f of fs.readdirSync(OUT)) {
  fs.copyFileSync(path.join(OUT, f), path.join(PUBLIC_DATA, f))
}

const totalBytes = outTables.reduce((s, t) => s + t.bytes, 0)
console.log(`✓ ${outTables.length} files, ${manifest.total_rows} rows, ${(totalBytes / 1024 / 1024).toFixed(1)} MB → ${OUT}/`)
console.log(`  version: ${manifest.version}`)
console.log(`  occupations: ${occList.length}`)
