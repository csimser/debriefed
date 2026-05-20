#!/usr/bin/env node
/**
 * Seeds a fresh Supabase database from the JSON snapshots in supabase/seed-data/.
 *
 * Loads all 24 dict_* tables from supabase/seed-data/dictionary-export/ plus
 * admin_settings from supabase/seed-data/admin-settings.json.
 *
 * Reads credentials from .env.local — needs SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
 * Tables are inserted in FK-safe order. Columns that reference auth.users are nulled
 * out before insert because a fresh deployment has no users yet (the rows themselves
 * are still useful as historical reference data).
 *
 * Usage:
 *   node scripts/seed-database.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const DICT_DIR = join(REPO_ROOT, 'supabase', 'seed-data', 'dictionary-export');
const ADMIN_FILE = join(REPO_ROOT, 'supabase', 'seed-data', 'admin-settings.json');
const BATCH_SIZE = 500;

// FK-safe order: submissions before submission_upvotes (upvotes references submissions.id).
// Everything else is reference data with no inter-dict FKs.
const TABLE_ORDER = [
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
  'dict_submissions',
  'dict_submission_upvotes',
];

// Columns that FK to auth.users — nulled before insert because a fresh DB has no users.
const AUTH_FK_COLUMNS = {
  dict_missing_terms_log: ['user_id'],
  dict_submissions: ['user_id', 'reviewed_by'],
  dict_submission_upvotes: ['user_id'],
};

function getVar(env, k) {
  const line = env.split('\n').find((l) => l.startsWith(k + '='));
  return line?.split('=').slice(1).join('=').trim();
}

const env = readFileSync(join(REPO_ROOT, '.env.local'), 'utf8');
const url = getVar(env, 'NEXT_PUBLIC_SUPABASE_URL');
const key = getVar(env, 'SUPABASE_SERVICE_ROLE_KEY');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function stripAuthFks(rows, table) {
  const cols = AUTH_FK_COLUMNS[table];
  if (!cols || rows.length === 0) return rows;
  return rows.map((row) => {
    const out = { ...row };
    for (const c of cols) if (c in out) out[c] = null;
    return out;
  });
}

async function loadTable(table, filePath) {
  if (!existsSync(filePath)) return { table, status: 'skipped', reason: 'file not found', rows: 0 };
  const raw = JSON.parse(readFileSync(filePath, 'utf8'));
  const rows = stripAuthFks(raw, table);
  if (rows.length === 0) return { table, status: 'empty', rows: 0 };

  let inserted = 0;
  const errors = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'id' });
    if (error) {
      errors.push(`batch ${i}-${i + batch.length - 1}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }
  return {
    table,
    status: errors.length ? (inserted ? 'partial' : 'failed') : 'ok',
    rows: inserted,
    total: rows.length,
    errors,
  };
}

const results = [];

console.log('Seeding dictionary tables...');
for (const table of TABLE_ORDER) {
  process.stdout.write(`  ${table}... `);
  const r = await loadTable(table, join(DICT_DIR, `${table}.json`));
  results.push(r);
  console.log(
    r.status === 'ok'
      ? `${r.rows} rows`
      : r.status === 'empty'
      ? '0 rows (empty)'
      : r.status === 'skipped'
      ? `skipped (${r.reason})`
      : `${r.status.toUpperCase()} (${r.rows}/${r.total}) — ${r.errors.join('; ')}`,
  );
}

console.log('\nSeeding admin_settings...');
process.stdout.write('  admin_settings... ');
const adminResult = await loadTable('admin_settings', ADMIN_FILE);
results.push(adminResult);
console.log(
  adminResult.status === 'ok'
    ? `${adminResult.rows} rows`
    : adminResult.status === 'empty'
    ? '0 rows (empty)'
    : adminResult.status === 'skipped'
    ? `skipped (${adminResult.reason})`
    : `${adminResult.status.toUpperCase()} — ${adminResult.errors.join('; ')}`,
);

const totalOk = results.filter((r) => r.status === 'ok').length;
const totalRows = results.reduce((s, r) => s + (r.rows || 0), 0);
const failed = results.filter((r) => r.status === 'failed' || r.status === 'partial');

console.log(`\nDone. ${totalOk}/${results.length} tables loaded cleanly, ${totalRows} rows total.`);
if (failed.length) {
  console.log(`\n${failed.length} table(s) had errors:`);
  for (const f of failed) console.log(`  - ${f.table}: ${f.errors.join('; ')}`);
  process.exit(1);
}
