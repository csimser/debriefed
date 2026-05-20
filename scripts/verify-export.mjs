#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'supabase', 'seed-data', 'dictionary-export');

const manifest = JSON.parse(readFileSync(join(DIR, 'manifest.json'), 'utf8'));
const files = readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== 'manifest.json');

let allOk = true;
const seen = new Set();
console.log('Per-file check:');
for (const m of manifest.tables) {
  const path = join(DIR, m.file);
  let rows;
  try {
    rows = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.log(`  FAIL ${m.file}: ${e.message}`);
    allOk = false;
    continue;
  }
  if (!Array.isArray(rows)) {
    console.log(`  FAIL ${m.file}: not an array`);
    allOk = false;
    continue;
  }
  const sample = rows[0];
  const sampleOk = !sample || (typeof sample === 'object' && !Array.isArray(sample));
  const match = rows.length === m.rows ? 'OK' : `MISMATCH (manifest=${m.rows})`;
  console.log(`  ${match === 'OK' && sampleOk ? 'PASS' : 'FAIL'} ${m.file}: ${rows.length} rows ${match}`);
  if (match !== 'OK' || !sampleOk) allOk = false;
  seen.add(m.file);
}

const extras = files.filter((f) => !seen.has(f));
if (extras.length) {
  console.log(`\nExtra files in dir not in manifest: ${extras.join(', ')}`);
}

const missing = manifest.tables.map((t) => t.file).filter((f) => !files.includes(f));
if (missing.length) {
  console.log(`\nManifest lists files that don't exist: ${missing.join(', ')}`);
  allOk = false;
}

const total = manifest.tables.reduce((s, t) => s + t.rows, 0);
console.log(`\nFiles found:  ${files.length}`);
console.log(`Manifest says: ${manifest.tables.length} tables, ${manifest.total_rows} rows`);
console.log(`Recomputed:   ${total} rows`);
console.log(`\nOverall: ${allOk && total === manifest.total_rows ? 'PASS' : 'FAIL'}`);
process.exit(allOk && total === manifest.total_rows ? 0 : 1);
