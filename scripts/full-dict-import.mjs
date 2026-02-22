#!/usr/bin/env node
/**
 * Full Dictionary Import — All 10 dict_* Tables
 *
 * Merges ~42 ChatGPT-generated CSV files, deduplicates against the live
 * Supabase DB, validates, and inserts net-new rows. Additive only — no
 * TRUNCATE, no DELETE.
 *
 * Run:  node scripts/full-dict-import.mjs
 * Dry:  node scripts/full-dict-import.mjs --dry-run
 */

import { readFileSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// ============================================================================
// Supabase Setup
// ============================================================================

const SUPABASE_URL = 'https://zsnncxizrtcmzcuizexk.supabase.co';
let SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    const match = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    if (match) SUPABASE_KEY = match[1].trim();
  } catch { /* ignore */ }
}

if (!SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not found. Set it in .env.local or environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const DRY_RUN = process.argv.includes('--dry-run');
const TABLE_FILTER = process.argv.find(a => a.startsWith('--table='))?.split('=')[1] || null;
const CSV_DIR = resolve(process.cwd(), 'supabase/migrations');
const BATCH_SIZE = 100;

// ============================================================================
// Branch Normalization Map
// ============================================================================

const BRANCH_MAP = {
  army: 'army', ARMY: 'army', Army: 'army',
  navy: 'navy', NAVY: 'navy', Navy: 'navy', usn: 'navy', USN: 'navy',
  'air force': 'usaf', 'Air Force': 'usaf', USAF: 'usaf', usaf: 'usaf',
  'marine corps': 'usmc', 'Marine Corps': 'usmc', Marines: 'usmc', marines: 'usmc', USMC: 'usmc', usmc: 'usmc',
  'coast guard': 'uscg', 'Coast Guard': 'uscg', USCG: 'uscg', uscg: 'uscg',
  'space force': 'ussf', 'Space Force': 'ussf', USSF: 'ussf', ussf: 'ussf',
  general: 'general', General: 'general', '': 'general', all: 'general', All: 'general',
};

const ALLOWED_BRANCHES = new Set(['army', 'navy', 'usaf', 'usmc', 'uscg', 'ussf', 'general']);

function normalizeBranch(val) {
  if (!val || val.trim() === '') return 'general';
  const mapped = BRANCH_MAP[val.trim()];
  if (mapped) return mapped;
  // Fallback: lowercase and check
  const lower = val.trim().toLowerCase();
  if (ALLOWED_BRANCHES.has(lower)) return lower;
  return null; // invalid
}

// ============================================================================
// Table Configurations
// ============================================================================

/**
 * Each config defines:
 *   table       — Supabase table name
 *   dbColumns   — columns to insert (excludes id, created_at)
 *   csvSources  — ordered list of CSV filenames (later files override earlier for self-dedup)
 *   dedupKeys   — column(s) used for dedup (lowercased comparison)
 *   arrayColumns — columns that are TEXT[] (parsed from JSON arrays)
 *   jsonbColumns — columns that are JSONB objects
 *   boolColumns  — columns that are boolean
 *   branchColumn — column name for branch (if applicable, for normalization)
 *   skipCsvCols  — CSV columns to ignore when mapping to DB
 *   qualityChecks — function for per-row quality checks
 */

const TABLE_CONFIGS = [
  {
    table: 'dict_acronyms',
    dbColumns: ['acronym', 'full_term', 'civilian_explanation', 'branch', 'category'],
    csvSources: [
      'phase1_master_acronyms.csv',
      'dict_acronyms_rows.csv',
      'batch3_acronyms_additions.csv',
      'batch4_acronyms_additions.csv',
      'batch5_acronyms_additions.csv',
      'add_acronyms.csv',
      'clean/clean_acronyms.csv',
      'clean_acronyms_deduped.csv',
    ],
    dedupKeys: ['acronym', 'branch'],
    skipCsvCols: ['id', 'created_at'],
    branchColumn: 'branch',
    qualityChecks(row) {
      const issues = [];
      if (!row.acronym || !row.acronym.trim()) issues.push('Empty acronym');
      if (!row.full_term || !row.full_term.trim()) issues.push('Empty full_term');
      return issues;
    },
  },
  {
    table: 'dict_military_jargon',
    dbColumns: ['military_term', 'civilian_equivalent', 'context', 'category', 'example_military', 'example_civilian'],
    csvSources: [
      'phase1_master_military_jargon.csv',
      'dict_military_jargon_rows.csv',
      'batch3_jargon_additions.csv',
      'batch4_jargon_additions.csv',
      'batch5_jargon_additions.csv',
      'add_military_jargon.csv',
      'clean/clean_military_jargon.csv',
      'clean_jargon_deduped.csv',
    ],
    dedupKeys: ['military_term'],
    skipCsvCols: ['id', 'created_at', 'job_family'],
    maxLengths: { context: 50, category: 50 },
    qualityChecks(row) {
      const issues = [];
      if (!row.military_term || !row.military_term.trim()) issues.push('Empty military_term');
      if (!row.civilian_equivalent || !row.civilian_equivalent.trim()) issues.push('Empty civilian_equivalent');
      if (row.military_term && row.civilian_equivalent &&
          row.military_term.trim().toLowerCase() === row.civilian_equivalent.trim().toLowerCase()) {
        issues.push(`Identity translation: "${row.military_term}"`);
      }
      return issues;
    },
  },
  {
    table: 'dict_phrase_translations',
    dbColumns: ['military_phrase', 'civilian_phrase', 'branch', 'category', 'context_notes'],
    csvSources: [
      'phase1_master_phrase_translations.csv',
      'dict_phrase_translations_rows.csv',
      'batch4_phrase_additions.csv',
      'batch5_phrase_additions.csv',
      'add_phrase_translations.csv',
      'clean/clean_phrase_translations.csv',
      'clean_phrases_deduped.csv',
    ],
    dedupKeys: ['military_phrase'],
    skipCsvCols: ['id', 'created_at', 'job_family'],
    branchColumn: 'branch',
    qualityChecks(row) {
      const issues = [];
      if (!row.military_phrase || !row.military_phrase.trim()) issues.push('Empty military_phrase');
      if (!row.civilian_phrase || !row.civilian_phrase.trim()) issues.push('Empty civilian_phrase');
      if (row.military_phrase && row.civilian_phrase &&
          row.military_phrase.trim().toLowerCase() === row.civilian_phrase.trim().toLowerCase()) {
        issues.push(`Identity translation: "${row.military_phrase}"`);
      }
      return issues;
    },
  },
  {
    table: 'dict_mos_to_civilian',
    dbColumns: ['branch', 'military_code', 'military_title', 'civilian_titles', 'onet_codes', 'industries', 'key_skills', 'description'],
    csvSources: [
      'phase1_master_mos_to_civilian.csv',
      'dict_mos_to_civilian_rows.csv',
      'batch3_mos_to_civilian_additions.csv',
      'batch4_mos_to_civilian_additions.csv',
      'add_mos_to_civilian.csv',
      'clean/clean_mos_to_civilian.csv',
      'clean_mos_deduped.csv',
    ],
    dedupKeys: ['military_code', 'branch'],
    skipCsvCols: ['id', 'created_at'],
    branchColumn: 'branch',
    arrayColumns: ['civilian_titles', 'onet_codes', 'industries', 'key_skills'],
    qualityChecks(row) {
      const issues = [];
      if (!row.military_code || !row.military_code.trim()) issues.push('Empty military_code');
      if (!row.branch || !row.branch.trim()) issues.push('Empty branch');
      if (!row.civilian_titles || (Array.isArray(row.civilian_titles) && row.civilian_titles.length === 0)) {
        issues.push('Empty civilian_titles');
      }
      return issues;
    },
  },
  {
    table: 'dict_ats_keywords',
    dbColumns: ['industry', 'role_type', 'keywords', 'weight'],
    csvSources: [
      'phase1_master_ats_keywords.csv',
      'dict_ats_keywords_rows.csv',
    ],
    dedupKeys: ['industry', 'role_type'],
    skipCsvCols: ['id', 'created_at'],
    arrayColumns: ['keywords'],
    qualityChecks(row) {
      const issues = [];
      if (!row.industry || !row.industry.trim()) issues.push('Empty industry');
      if (!row.role_type || !row.role_type.trim()) issues.push('Empty role_type');
      return issues;
    },
  },
  {
    table: 'dict_soft_skills',
    dbColumns: ['military_context', 'civilian_skill', 'civilian_description', 'resume_phrase'],
    csvSources: [
      'phase1_master_soft_skills.csv',
      'dict_soft_skills_rows.csv',
    ],
    dedupKeys: ['military_context'],
    skipCsvCols: ['id', 'created_at'],
    qualityChecks(row) {
      const issues = [];
      if (!row.military_context || !row.military_context.trim()) issues.push('Empty military_context');
      return issues;
    },
  },
  {
    table: 'dict_gap_recommendations',
    dbColumns: ['gap_keyword', 'gap_category', 'recommendation_type', 'recommendation', 'related_certs', 'related_skills', 'free_resource_url', 'resource_name', 'estimated_time', 'estimated_cost', 'veteran_discount', 'veteran_discount_notes'],
    csvSources: [
      'phase1_master_gap_recommendations.csv',
      'dict_gap_recommendations_rows.csv',
    ],
    dedupKeys: ['gap_keyword'],
    skipCsvCols: ['id', 'created_at'],
    arrayColumns: ['related_certs', 'related_skills'],
    boolColumns: ['veteran_discount'],
    qualityChecks(row) {
      const issues = [];
      if (!row.gap_keyword || !row.gap_keyword.trim()) issues.push('Empty gap_keyword');
      return issues;
    },
  },
  {
    table: 'dict_professional_summaries',
    dbColumns: ['template_name', 'rank_tier', 'target_industry', 'target_role', 'template_text', 'example_output'],
    csvSources: [
      'phase1_master_professional_summaries.csv',
      'dict_professional_summaries_rows.csv',
    ],
    dedupKeys: ['template_name'],
    skipCsvCols: ['id', 'created_at'],
    qualityChecks(row) {
      const issues = [];
      if (!row.template_name || !row.template_name.trim()) issues.push('Empty template_name');
      return issues;
    },
  },
  {
    table: 'dict_cover_letter_templates',
    dbColumns: ['template_name', 'industry', 'role_type', 'opening_paragraph', 'body_paragraph_1', 'body_paragraph_2', 'closing_paragraph', 'placeholders', 'notes'],
    csvSources: [
      'phase1_master_cover_letter_templates.csv',
      'dict_cover_letter_templates_rows.csv',
    ],
    dedupKeys: ['template_name'],
    skipCsvCols: ['id', 'created_at'],
    jsonbColumns: ['placeholders'],
    qualityChecks(row) {
      const issues = [];
      if (!row.template_name || !row.template_name.trim()) issues.push('Empty template_name');
      return issues;
    },
  },
  {
    table: 'dict_linkedin_templates',
    dbColumns: ['section', 'template_name', 'target_role', 'target_industry', 'template_text', 'placeholders', 'tips'],
    csvSources: [
      'phase1_master_linkedin_templates.csv',
      'dict_linkedin_templates_rows.csv',
    ],
    dedupKeys: ['section', 'template_name'],
    skipCsvCols: ['id', 'created_at'],
    jsonbColumns: ['placeholders'],
    qualityChecks(row) {
      const issues = [];
      if (!row.section || !row.section.trim()) issues.push('Empty section');
      if (!row.template_name || !row.template_name.trim()) issues.push('Empty template_name');
      return issues;
    },
  },
];

// ============================================================================
// CSV Parser (handles quoted fields, embedded commas, multiline values)
// ============================================================================

function parseCSV(text) {
  const rows = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];
    // Handle multi-line quoted fields
    while ((line.match(/"/g) || []).length % 2 !== 0 && i + 1 < lines.length) {
      i++;
      line += '\n' + lines[i];
    }
    i++;
    if (line.trim() === '') continue;
    rows.push(parseCSVLine(line));
  }

  if (rows.length === 0) return { headers: [], data: [] };
  const headers = rows[0].map(h => h.trim());
  const data = rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, j) => {
      obj[h] = (row[j] || '').trim();
    });
    return obj;
  });
  return { headers, data };
}

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields.map(f => f.trim());
}

// ============================================================================
// Value Parsers
// ============================================================================

/** Parse a TEXT[] column from CSV string → JS array */
function parseArrayColumn(val) {
  if (!val || val.trim() === '' || val.trim() === '{}') return [];
  const trimmed = val.trim();

  // JSON array string: ["a","b","c"]
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(v => String(v).trim()).filter(Boolean);
    } catch { /* fall through */ }
  }

  // PostgreSQL array literal: {a,b,c}
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed.slice(1, -1).split(',').map(v => v.trim().replace(/^"|"$/g, '')).filter(Boolean);
  }

  // Comma-separated string
  return trimmed.split(',').map(v => v.trim()).filter(Boolean);
}

/** Parse a JSONB column from CSV string → JS object */
function parseJsonbColumn(val) {
  if (!val || val.trim() === '') return null;
  try {
    return JSON.parse(val.trim());
  } catch {
    return '__INVALID_JSON__';
  }
}

/** Parse a boolean column from CSV string → JS boolean */
function parseBoolColumn(val) {
  if (!val) return false;
  const lower = val.trim().toLowerCase();
  return lower === 'true' || lower === '1' || lower === 'yes' || lower === 't';
}

// ============================================================================
// Row Mapper — CSV row → DB row
// ============================================================================

function mapRow(csvRow, config) {
  const dbRow = {};
  const issues = [];

  for (const col of config.dbColumns) {
    let val = csvRow[col];

    // Branch normalization
    if (config.branchColumn && col === config.branchColumn) {
      const normalized = normalizeBranch(val);
      if (normalized === null) {
        issues.push(`Invalid branch: "${val}"`);
        dbRow[col] = val; // keep original for reporting
      } else {
        dbRow[col] = normalized;
      }
      continue;
    }

    // Array columns
    if (config.arrayColumns && config.arrayColumns.includes(col)) {
      dbRow[col] = parseArrayColumn(val);
      continue;
    }

    // JSONB columns
    if (config.jsonbColumns && config.jsonbColumns.includes(col)) {
      const parsed = parseJsonbColumn(val);
      if (parsed === '__INVALID_JSON__') {
        issues.push(`Invalid JSON in ${col}: "${(val || '').substring(0, 60)}..."`);
        dbRow[col] = null;
      } else {
        dbRow[col] = parsed;
      }
      continue;
    }

    // Boolean columns
    if (config.boolColumns && config.boolColumns.includes(col)) {
      dbRow[col] = parseBoolColumn(val);
      continue;
    }

    // Text columns — trim, truncate if maxLength defined, allow empty
    let text = val ? val.trim() : '';
    if (config.maxLengths && config.maxLengths[col] && text.length > config.maxLengths[col]) {
      text = text.substring(0, config.maxLengths[col]);
    }
    dbRow[col] = text;
  }

  return { dbRow, issues };
}

// ============================================================================
// Dedup Key Builder
// ============================================================================

function buildDedupKey(row, dedupKeys) {
  return dedupKeys.map(k => {
    const val = row[k];
    if (val === undefined || val === null) return '';
    return String(val).toLowerCase().trim();
  }).join('|');
}

// ============================================================================
// Process One Table
// ============================================================================

async function processTable(config) {
  const result = {
    table: config.table,
    filesRead: 0,
    filesSkipped: [],
    totalParsed: 0,
    afterSelfDedup: 0,
    qualityIssues: [],
    existingInDb: 0,
    netNew: 0,
    rows: [],
    insertErrors: [],
  };

  // ------------------------------------------------------------------
  // Step 1: Read & merge all CSV sources
  // ------------------------------------------------------------------
  const allRows = [];

  for (const filename of config.csvSources) {
    const filepath = resolve(CSV_DIR, filename);
    if (!existsSync(filepath)) {
      result.filesSkipped.push(filename);
      continue;
    }

    let raw;
    try {
      raw = readFileSync(filepath, 'utf8');
    } catch {
      result.filesSkipped.push(filename);
      continue;
    }

    const { headers, data } = parseCSV(raw);
    if (data.length === 0) {
      result.filesSkipped.push(filename);
      continue;
    }

    result.filesRead++;

    // Map each CSV row → DB row, skipping extra columns automatically
    for (const csvRow of data) {
      const { dbRow, issues } = mapRow(csvRow, config);
      if (issues.length > 0) {
        for (const issue of issues) {
          result.qualityIssues.push({ source: filename, issue, row: dbRow });
        }
      }
      allRows.push({ dbRow, source: filename });
    }
  }

  result.totalParsed = allRows.length;

  // ------------------------------------------------------------------
  // Step 2: Quality checks — remove bad rows
  // ------------------------------------------------------------------
  const cleanRows = [];
  for (const { dbRow, source } of allRows) {
    if (config.qualityChecks) {
      const issues = config.qualityChecks(dbRow);
      if (issues.length > 0) {
        for (const issue of issues) {
          result.qualityIssues.push({ source, issue, row: dbRow });
        }
        continue; // skip row
      }
    }

    // Check invalid branch (if applicable)
    if (config.branchColumn) {
      const branchVal = dbRow[config.branchColumn];
      if (branchVal && !ALLOWED_BRANCHES.has(branchVal)) {
        result.qualityIssues.push({
          source,
          issue: `Invalid branch after normalization: "${branchVal}"`,
          row: dbRow,
        });
        continue;
      }
    }

    // Check invalid JSON flagged during mapping
    if (config.jsonbColumns) {
      let hasInvalidJson = false;
      for (const col of config.jsonbColumns) {
        if (dbRow[col] === '__INVALID_JSON__') {
          hasInvalidJson = true;
          break;
        }
      }
      if (hasInvalidJson) continue;
    }

    cleanRows.push(dbRow);
  }

  // ------------------------------------------------------------------
  // Step 3: Self-dedup — last occurrence wins
  // ------------------------------------------------------------------
  const dedupMap = new Map();
  for (const row of cleanRows) {
    const key = buildDedupKey(row, config.dedupKeys);
    dedupMap.set(key, row);
  }
  const deduped = Array.from(dedupMap.values());
  result.afterSelfDedup = deduped.length;

  // ------------------------------------------------------------------
  // Step 4: Dedup against live DB
  // ------------------------------------------------------------------
  const selectCols = config.dedupKeys.join(', ');
  let existingKeys = new Set();

  // Supabase has a 1000-row default limit; paginate to get all rows
  let allExisting = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data: page, error } = await supabase
      .from(config.table)
      .select(selectCols)
      .range(from, from + pageSize - 1);

    if (error) {
      console.error(`  ERROR querying ${config.table}: ${error.message}`);
      break;
    }
    if (!page || page.length === 0) break;
    allExisting = allExisting.concat(page);
    if (page.length < pageSize) break;
    from += pageSize;
  }

  existingKeys = new Set(
    allExisting.map(r => buildDedupKey(r, config.dedupKeys))
  );
  result.existingInDb = allExisting.length;

  // Filter to net-new only
  const netNew = deduped.filter(row => {
    const key = buildDedupKey(row, config.dedupKeys);
    return !existingKeys.has(key);
  });

  result.netNew = netNew.length;
  result.rows = netNew;

  return result;
}

// ============================================================================
// Batch Insert
// ============================================================================

async function batchInsert(table, rows) {
  const errors = [];
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

    const { error } = await supabase.from(table).insert(batch);

    if (error) {
      errors.push({ batch: batchNum, error: error.message, count: batch.length });
      console.error(`    Batch ${batchNum}/${totalBatches} FAILED: ${error.message}`);
    } else {
      inserted += batch.length;
      if (totalBatches > 1) {
        process.stdout.write(`    Batch ${batchNum}/${totalBatches}: ${batch.length} rows inserted\r`);
      }
    }
  }

  if (rows.length > BATCH_SIZE) console.log(''); // newline after \r progress

  return { inserted, errors };
}

// ============================================================================
// Report Formatting
// ============================================================================

function printTableReport(r) {
  const w = 44;
  const line = '═'.repeat(w);
  const pad = (label, val) => {
    const s = `  ${label}: `;
    const v = typeof val === 'number' ? val.toLocaleString() : String(val);
    return `║${s}${' '.repeat(w - s.length - v.length)}${v}║`;
  };

  console.log(`╔${line}╗`);
  console.log(`║  ${r.table}${' '.repeat(w - 2 - r.table.length)}║`);
  console.log(`╠${line}╣`);
  console.log(pad('Source files read', r.filesRead));
  if (r.filesSkipped.length > 0) {
    console.log(pad('Files skipped', r.filesSkipped.length));
  }
  console.log(pad('Total rows parsed', r.totalParsed));
  console.log(pad('After self-dedup', r.afterSelfDedup));
  console.log(pad('Quality issues', r.qualityIssues.length));
  console.log(pad('Existing in DB', r.existingInDb));
  console.log(pad('NET NEW to import', r.netNew));
  console.log(`╚${line}╝`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  FULL DICTIONARY IMPORT — 10 Tables          ║');
  console.log(`║  Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE IMPORT'}${' '.repeat(DRY_RUN ? 17 : 20)}║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  const results = [];

  // ------------------------------------------------------------------
  // Phase 1: Parse, merge, validate, dedup all tables
  // ------------------------------------------------------------------
  const configs = TABLE_FILTER
    ? TABLE_CONFIGS.filter(c => c.table === TABLE_FILTER || c.table === `dict_${TABLE_FILTER}`)
    : TABLE_CONFIGS;

  if (configs.length === 0) {
    console.error(`No table matching "${TABLE_FILTER}". Available: ${TABLE_CONFIGS.map(c => c.table).join(', ')}`);
    process.exit(1);
  }

  if (TABLE_FILTER) console.log(`Filtering to: ${configs.map(c => c.table).join(', ')}\n`);

  for (const config of configs) {
    process.stdout.write(`Processing ${config.table}...`);
    const result = await processTable(config);
    results.push(result);
    console.log(` done (${result.netNew} net-new)`);
  }

  // ------------------------------------------------------------------
  // Phase 2: Validation Report
  // ------------------------------------------------------------------
  console.log('\n\n=== VALIDATION REPORT ===\n');

  let grandTotalParsed = 0;
  let grandTotalDeduped = 0;
  let grandTotalQuality = 0;
  let grandTotalExisting = 0;
  let grandTotalNetNew = 0;

  for (const r of results) {
    printTableReport(r);
    console.log('');

    grandTotalParsed += r.totalParsed;
    grandTotalDeduped += r.afterSelfDedup;
    grandTotalQuality += r.qualityIssues.length;
    grandTotalExisting += r.existingInDb;
    grandTotalNetNew += r.netNew;

    // Show quality issues (up to 5 per table)
    if (r.qualityIssues.length > 0) {
      const show = r.qualityIssues.slice(0, 5);
      for (const q of show) {
        console.log(`  [!] ${q.source}: ${q.issue}`);
      }
      if (r.qualityIssues.length > 5) {
        console.log(`  ... and ${r.qualityIssues.length - 5} more`);
      }
      console.log('');
    }

    // Show skipped files
    if (r.filesSkipped.length > 0) {
      console.log(`  Skipped files: ${r.filesSkipped.join(', ')}`);
      console.log('');
    }
  }

  // Grand total
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  GRAND TOTAL                                 ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Total rows parsed:     ${grandTotalParsed.toLocaleString().padStart(8)}             ║`);
  console.log(`║  After self-dedup:      ${grandTotalDeduped.toLocaleString().padStart(8)}             ║`);
  console.log(`║  Quality issues:        ${grandTotalQuality.toLocaleString().padStart(8)}             ║`);
  console.log(`║  Already in DB:         ${grandTotalExisting.toLocaleString().padStart(8)}             ║`);
  console.log(`║  NET NEW to import:     ${grandTotalNetNew.toLocaleString().padStart(8)}             ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  if (grandTotalNetNew === 0) {
    console.log('Nothing to import — all rows already exist in DB.');
    return;
  }

  if (DRY_RUN) {
    console.log('DRY RUN — skipping insert. Remove --dry-run to import.');
    return;
  }

  // ------------------------------------------------------------------
  // Phase 3: Import net-new rows
  // ------------------------------------------------------------------
  console.log('=== IMPORTING NET-NEW ROWS ===\n');

  let grandInserted = 0;
  let grandErrors = 0;

  for (const r of results) {
    if (r.rows.length === 0) {
      console.log(`  ${r.table}: 0 to insert — skipping`);
      continue;
    }

    console.log(`  ${r.table}: inserting ${r.rows.length} rows...`);
    const { inserted, errors } = await batchInsert(r.table, r.rows);
    r.insertErrors = errors;

    if (errors.length > 0) {
      console.log(`    ERRORS: ${errors.length} batches failed`);
      grandErrors += errors.reduce((sum, e) => sum + e.count, 0);
    }

    console.log(`    Inserted: ${inserted}`);
    grandInserted += inserted;
  }

  console.log(`\n  Total inserted: ${grandInserted}`);
  if (grandErrors > 0) {
    console.log(`  Total failed: ${grandErrors}`);
  }

  // ------------------------------------------------------------------
  // Phase 4: Post-import verification — final row counts
  // ------------------------------------------------------------------
  console.log('\n\n=== POST-IMPORT VERIFICATION ===\n');

  for (const config of configs) {
    // Use count query
    const { count, error } = await supabase
      .from(config.table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`  ${config.table}: ERROR — ${error.message}`);
    } else {
      console.log(`  ${config.table}: ${(count || 0).toLocaleString()} rows`);
    }
  }

  console.log('\n  Dictionary cache refreshes on next server restart / cold start.');
  console.log('  Run `npm run dev` to pick up new data.\n');
  console.log('Done.');
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
