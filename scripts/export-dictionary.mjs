#!/usr/bin/env node
/**
 * Exports every dict_* table from Supabase to supabase/seed-data/dictionary-export/.
 *
 * One JSON file per table (sorted by id, deterministic for diff-friendly commits).
 * Reads credentials from .env.local — needs SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
 * Paginates in 1000-row pages to handle tables larger than PostgREST's default cap.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DIR = join(REPO_ROOT, 'supabase', 'seed-data', 'dictionary-export');
const PAGE_SIZE = 1000;

const TABLES = [
  'dict_acronyms',
  'dict_action_verbs',
  'dict_ats_keywords',
  'dict_bullet_patterns',
  'dict_cert_funding',
  'dict_cover_letter_templates',
  'dict_eval_phrases',
  'dict_funding_programs',
  'dict_gap_recommendations',
  'dict_industry_framing',
  'dict_linkedin_keywords',
  'dict_linkedin_templates',
  'dict_military_jargon',
  'dict_missing_terms_log',
  'dict_mos_to_civilian',
  'dict_onet_crosswalk',
  'dict_phrase_translations',
  'dict_professional_summaries',
  'dict_quantification_helpers',
  'dict_rank_equivalents',
  'dict_resume_templates',
  'dict_soft_skills',
  'dict_submission_upvotes',
  'dict_submissions',
];

const env = readFileSync(join(REPO_ROOT, '.env.local'), 'utf8');
const getVar = (k) =>
  env.split('\n').find((l) => l.startsWith(k + '='))?.split('=').slice(1).join('=').trim();

const url = getVar('NEXT_PUBLIC_SUPABASE_URL');
const key = getVar('SUPABASE_SERVICE_ROLE_KEY');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

mkdirSync(OUT_DIR, { recursive: true });

async function exportTable(table) {
  const all = [];
  let from = 0;
  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id', { ascending: true })
      .range(from, to);
    if (error) throw new Error(`${table} @ ${from}: ${error.message}`);
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  const outPath = join(OUT_DIR, `${table}.json`);
  writeFileSync(outPath, JSON.stringify(all, null, 2) + '\n');
  return { table, rows: all.length, path: outPath };
}

const results = [];
for (const table of TABLES) {
  process.stdout.write(`Exporting ${table}... `);
  const r = await exportTable(table);
  results.push(r);
  console.log(`${r.rows} rows`);
}

const manifest = {
  exported_at: new Date().toISOString(),
  source_url: url,
  tables: results.map(({ table, rows }) => ({ table, rows, file: `${table}.json` })),
  total_rows: results.reduce((s, r) => s + r.rows, 0),
};
writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(`\nDone. ${manifest.total_rows} rows across ${results.length} tables.`);
console.log(`Output: ${OUT_DIR}`);

// Also export admin_settings to a separate seed file (consumed by seed-database.mjs).
process.stdout.write(`Exporting admin_settings... `);
const adminRes = await exportTable('admin_settings');
const adminPath = join(REPO_ROOT, 'supabase', 'seed-data', 'admin-settings.json');
const adminRows = JSON.parse(readFileSync(adminRes.path, 'utf8'));
writeFileSync(adminPath, JSON.stringify(adminRows, null, 2) + '\n');
// Remove the duplicate copy from dictionary-export/ (admin_settings is not a dict_* table).
try { unlinkSync(adminRes.path); } catch {}
console.log(`${adminRes.rows} rows -> ${adminPath}`);
