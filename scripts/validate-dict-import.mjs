#!/usr/bin/env node
/**
 * Dictionary Import Validator
 *
 * Validates 4 CSV files against DB schema and live data before importing.
 * Run: node scripts/validate-dict-import.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// ============================================================================
// Config
// ============================================================================

const SUPABASE_URL = 'https://zsnncxizrtcmzcuizexk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  // Try reading from .env.local
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    const match = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    if (match) {
      process.env.SUPABASE_SERVICE_ROLE_KEY = match[1].trim();
    }
  } catch { /* ignore */ }
}

const supabase = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const CSV_DIR = resolve(process.cwd(), 'supabase/migrations');

const ALLOWED_BRANCHES = new Set([
  'navy', 'army', 'usmc', 'uscg', 'usaf', 'usn', 'general', 'all', 'ussf',
]);

// Schema definitions: { column: maxLength | null (unlimited) }
const SCHEMAS = {
  phrase_translations: {
    columns: {
      military_phrase: null,
      civilian_phrase: null,
      branch: 10,
      category: 50,
      context_notes: null,
    },
    table: 'dict_phrase_translations',
    dedupKey: 'military_phrase',
  },
  military_jargon: {
    columns: {
      military_term: 255,
      civilian_equivalent: 255,
      context: 50,
      category: 50,
      example_military: null,
      example_civilian: null,
    },
    table: 'dict_military_jargon',
    dedupKey: 'military_term',
  },
  acronyms: {
    columns: {
      acronym: 20,
      full_term: 255,
      civilian_explanation: 255,
      branch: 10,
      category: 50,
    },
    table: 'dict_acronyms',
    dedupKeys: ['acronym', 'branch'],
  },
  mos_to_civilian: {
    columns: {
      branch: 10,
      military_code: 20,
      military_title: 100,
      civilian_titles: null,
      onet_codes: null,
      industries: null,
      key_skills: null,
      description: null,
    },
    table: 'dict_mos_to_civilian',
    dedupKeys: ['military_code', 'branch'],
  },
};

// ============================================================================
// CSV Parser (handles quoted fields with commas)
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
  const headers = rows[0];
  const data = rows.slice(1).map((row, idx) => {
    const obj = {};
    headers.forEach((h, j) => {
      obj[h] = (row[j] || '').trim();
    });
    obj.__row = idx + 2; // 1-indexed, +1 for header
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
// Step 1: Schema Validation
// ============================================================================

function validateSchema(name, headers, data, schema) {
  const violations = [];
  const expectedCols = Object.keys(schema.columns);

  // Check for extra columns
  for (const h of headers) {
    if (!expectedCols.includes(h)) {
      violations.push(`Extra column not in table schema: "${h}"`);
    }
  }

  // Check for missing required columns
  for (const col of expectedCols) {
    if (!headers.includes(col)) {
      // context_notes, example_military, example_civilian, etc. are optional
      const optional = ['context_notes', 'example_military', 'example_civilian',
                        'onet_codes', 'industries', 'key_skills', 'description'];
      if (!optional.includes(col)) {
        violations.push(`Missing column: "${col}"`);
      }
    }
  }

  // Check varchar limits, branch, category per row
  for (const row of data) {
    for (const [col, maxLen] of Object.entries(schema.columns)) {
      const val = row[col] || '';
      if (maxLen !== null && val.length > maxLen) {
        violations.push(`Row ${row.__row}: "${col}" exceeds ${maxLen} chars (${val.length}): "${val.substring(0, 50)}..."`);
      }
    }

    // Branch check
    if (row.branch !== undefined && row.branch !== '') {
      const branchLower = row.branch.toLowerCase();
      if (!ALLOWED_BRANCHES.has(branchLower)) {
        violations.push(`Row ${row.__row}: Invalid branch "${row.branch}"`);
      }
      if (row.branch !== branchLower) {
        violations.push(`Row ${row.__row}: Branch not lowercase: "${row.branch}" (should be "${branchLower}")`);
      }
    }

    // Category check (lowercase)
    if (row.category !== undefined && row.category !== '') {
      if (row.category !== row.category.toLowerCase()) {
        violations.push(`Row ${row.__row}: Category not lowercase: "${row.category}" (should be "${row.category.toLowerCase()}")`);
      }
    }

    // Context check (lowercase for jargon)
    if (row.context !== undefined && row.context !== '') {
      if (row.context !== row.context.toLowerCase()) {
        violations.push(`Row ${row.__row}: Context not lowercase: "${row.context}" (should be "${row.context.toLowerCase()}")`);
      }
    }
  }

  return violations;
}

// ============================================================================
// Step 2: Duplicate Detection
// ============================================================================

async function checkDuplicates(schema, data) {
  const table = schema.table;
  const duplicates = [];

  if (schema.dedupKey) {
    // Single key dedup (phrase_translations, military_jargon)
    const col = schema.dedupKey;
    const { data: existing, error } = await supabase
      .from(table)
      .select(col);

    if (error) {
      console.error(`  ERROR querying ${table}: ${error.message}`);
      return { duplicates: [], existingCount: 0, error: error.message };
    }

    const existingSet = new Set(
      (existing || []).map(r => (r[col] || '').toLowerCase().trim())
    );

    for (const row of data) {
      const val = (row[col] || '').toLowerCase().trim();
      if (existingSet.has(val)) {
        duplicates.push({ row: row.__row, key: row[col] });
      }
    }

    return { duplicates, existingCount: (existing || []).length, error: null };
  }

  if (schema.dedupKeys) {
    // Composite key dedup (acronyms, mos_to_civilian)
    const [key1, key2] = schema.dedupKeys;
    const { data: existing, error } = await supabase
      .from(table)
      .select(`${key1}, ${key2}`);

    if (error) {
      console.error(`  ERROR querying ${table}: ${error.message}`);
      return { duplicates: [], existingCount: 0, error: error.message };
    }

    const existingSet = new Set(
      (existing || []).map(r =>
        `${(r[key1] || '').toLowerCase().trim()}|${(r[key2] || '').toLowerCase().trim()}`
      )
    );

    for (const row of data) {
      const composite = `${(row[key1] || '').toLowerCase().trim()}|${(row[key2] || '').toLowerCase().trim()}`;
      if (existingSet.has(composite)) {
        duplicates.push({ row: row.__row, key: `${row[key1]}+${row[key2]}` });
      }
    }

    return { duplicates, existingCount: (existing || []).length, error: null };
  }

  return { duplicates: [], existingCount: 0, error: null };
}

// ============================================================================
// Step 3: Data Quality Checks
// ============================================================================

function checkQuality(name, data) {
  const issues = [];

  for (const row of data) {
    switch (name) {
      case 'phrase_translations':
        if (!row.military_phrase || row.military_phrase.trim() === '') {
          issues.push(`Row ${row.__row}: Empty military_phrase`);
        }
        if (!row.civilian_phrase || row.civilian_phrase.trim() === '') {
          issues.push(`Row ${row.__row}: Empty civilian_phrase`);
        }
        if (row.military_phrase && row.civilian_phrase &&
            row.military_phrase.trim().toLowerCase() === row.civilian_phrase.trim().toLowerCase()) {
          issues.push(`Row ${row.__row}: civilian_phrase identical to military_phrase: "${row.military_phrase}"`);
        }
        break;

      case 'military_jargon':
        if (!row.military_term || row.military_term.trim() === '') {
          issues.push(`Row ${row.__row}: Empty military_term`);
        }
        if (!row.civilian_equivalent || row.civilian_equivalent.trim() === '') {
          issues.push(`Row ${row.__row}: Empty civilian_equivalent`);
        }
        if (row.military_term && row.civilian_equivalent &&
            row.military_term.trim().toLowerCase() === row.civilian_equivalent.trim().toLowerCase()) {
          issues.push(`Row ${row.__row}: civilian_equivalent identical to military_term: "${row.military_term}"`);
        }
        break;

      case 'acronyms':
        if (!row.acronym || row.acronym.trim() === '') {
          issues.push(`Row ${row.__row}: Empty acronym`);
        }
        if (!row.full_term || row.full_term.trim() === '') {
          issues.push(`Row ${row.__row}: Empty full_term`);
        }
        break;

      case 'mos_to_civilian':
        if (!row.military_code || row.military_code.trim() === '') {
          issues.push(`Row ${row.__row}: Empty military_code`);
        }
        if (!row.branch || row.branch.trim() === '') {
          issues.push(`Row ${row.__row}: Empty branch (required for mos_to_civilian)`);
        }
        break;
    }

    // Branch value check for all types
    if (row.branch && row.branch.trim() !== '') {
      if (!ALLOWED_BRANCHES.has(row.branch.toLowerCase().trim())) {
        issues.push(`Row ${row.__row}: Invalid branch value "${row.branch}"`);
      }
    }
  }

  return issues;
}

// ============================================================================
// Step 4+5: Report + Clean Files
// ============================================================================

async function main() {
  console.log('=== DICTIONARY IMPORT VALIDATION ===\n');

  const files = {
    phrase_translations: 'add_phrase_translations.csv',
    military_jargon: 'add_military_jargon.csv',
    acronyms: 'add_acronyms.csv',
    mos_to_civilian: 'add_mos_to_civilian.csv',
  };

  let allSafe = true;
  const results = {};

  for (const [name, filename] of Object.entries(files)) {
    console.log(`--- ${filename} ---`);
    const filepath = resolve(CSV_DIR, filename);
    let raw;
    try {
      raw = readFileSync(filepath, 'utf8');
    } catch (e) {
      console.log(`  FILE NOT FOUND: ${filepath}`);
      allSafe = false;
      continue;
    }

    const { headers, data } = parseCSV(raw);
    const schema = SCHEMAS[name];

    console.log(`  Total rows: ${data.length}`);
    console.log(`  Columns: ${headers.join(', ')}`);

    // Step 1: Schema validation
    const violations = validateSchema(name, headers, data, schema);
    console.log(`  Schema valid: ${violations.length === 0 ? 'YES' : 'NO'}`);
    if (violations.length > 0) {
      console.log(`  Schema violations (${violations.length}):`);
      for (const v of violations.slice(0, 20)) {
        console.log(`    - ${v}`);
      }
      if (violations.length > 20) {
        console.log(`    ... and ${violations.length - 20} more`);
      }
      allSafe = false;
    }

    // Step 2: Duplicate detection
    console.log(`  Checking duplicates against ${schema.table}...`);
    const { duplicates, existingCount, error } = await checkDuplicates(schema, data);
    if (error) {
      console.log(`  Duplicate check ERROR: ${error}`);
      allSafe = false;
    } else {
      console.log(`  Existing rows in DB: ${existingCount}`);
      console.log(`  Duplicates found: ${duplicates.length}`);
      if (duplicates.length > 0 && duplicates.length <= 20) {
        for (const d of duplicates) {
          console.log(`    - Row ${d.row}: "${d.key}"`);
        }
      } else if (duplicates.length > 20) {
        for (const d of duplicates.slice(0, 10)) {
          console.log(`    - Row ${d.row}: "${d.key}"`);
        }
        console.log(`    ... and ${duplicates.length - 10} more`);
      }
    }

    // Step 3: Quality checks
    const qualityIssues = checkQuality(name, data);
    console.log(`  Quality issues: ${qualityIssues.length}`);
    if (qualityIssues.length > 0) {
      for (const q of qualityIssues.slice(0, 20)) {
        console.log(`    - ${q}`);
      }
      if (qualityIssues.length > 20) {
        console.log(`    ... and ${qualityIssues.length - 20} more`);
      }
    }

    // Calculate clean rows
    const dupRows = new Set(duplicates.map(d => d.row));
    const qualityRows = new Set(
      qualityIssues
        .map(q => {
          const m = q.match(/Row (\d+)/);
          return m ? parseInt(m[1]) : null;
        })
        .filter(Boolean)
    );

    // Rows that are identical (military=civilian) should be removed
    const identicalRows = new Set();
    for (const q of qualityIssues) {
      if (q.includes('identical to')) {
        const m = q.match(/Row (\d+)/);
        if (m) identicalRows.add(parseInt(m[1]));
      }
    }

    const willInsert = data.filter(r =>
      !dupRows.has(r.__row) && !identicalRows.has(r.__row)
    );

    console.log(`  Will insert: ${willInsert.length} new rows`);
    console.log('');

    results[name] = {
      filename, data, headers, violations, duplicates,
      qualityIssues, willInsert, dupRows, identicalRows,
    };
  }

  // ============================================================================
  // Summary
  // ============================================================================

  console.log('\n=== VALIDATION REPORT SUMMARY ===\n');

  for (const [name, r] of Object.entries(results)) {
    console.log(`${r.filename}`);
    console.log(`  Total rows: ${r.data.length}`);
    console.log(`  Schema valid: ${r.violations.length === 0 ? 'YES' : 'NO'}`);
    if (r.violations.length > 0) {
      console.log(`  Violations: ${r.violations.length}`);
    }
    console.log(`  Duplicates vs live DB: ${r.duplicates.length} rows already exist`);
    console.log(`  Quality issues: ${r.qualityIssues.length} flagged`);
    console.log(`  Will insert: ${r.willInsert.length} new rows`);
    console.log('');
  }

  // Determine safe
  const hasSchemaIssues = Object.values(results).some(r => r.violations.length > 0);
  const hasCriticalQuality = Object.values(results).some(r =>
    r.qualityIssues.some(q => q.includes('Empty'))
  );

  if (hasSchemaIssues) {
    console.log('SAFE TO IMPORT: NO');
    console.log('  Reason: Schema violations found — fix before importing');
    allSafe = false;
  } else if (hasCriticalQuality) {
    console.log('SAFE TO IMPORT: NO (with warnings)');
    console.log('  Reason: Empty required fields found — review quality issues');
    allSafe = false;
  } else {
    console.log('SAFE TO IMPORT: YES (after removing duplicates)');
    allSafe = true;
  }

  // ============================================================================
  // Step 5: Generate Clean Files
  // ============================================================================

  console.log('\n=== GENERATING CLEAN IMPORT FILES ===\n');

  const cleanDir = resolve(process.cwd(), 'supabase/migrations/clean');
  try {
    const { mkdirSync } = await import('fs');
    mkdirSync(cleanDir, { recursive: true });
  } catch { /* already exists */ }

  for (const [name, r] of Object.entries(results)) {
    const cleanRows = r.willInsert;
    if (cleanRows.length === 0) {
      console.log(`${r.filename}: 0 rows — skipping`);
      continue;
    }

    // Build CSV with same headers (excluding __row)
    const csvHeaders = r.headers.join(',');
    const csvRows = cleanRows.map(row => {
      return r.headers.map(h => {
        const val = row[h] || '';
        // Quote if contains comma, newline, or double quote
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          return '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(',');
    });

    const csvContent = [csvHeaders, ...csvRows].join('\n') + '\n';
    const cleanPath = resolve(cleanDir, `clean_${r.filename.replace('add_', '')}`);
    writeFileSync(cleanPath, csvContent);
    console.log(`${r.filename} → clean_${r.filename.replace('add_', '')}: ${cleanRows.length} rows`);
  }

  console.log(`\nClean files written to: ${cleanDir}`);
  console.log('\nDone.');
}

main().catch(console.error);
