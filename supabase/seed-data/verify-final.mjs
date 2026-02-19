#!/usr/bin/env node
/**
 * Final verification:
 * 1. Show distinct values per column per file
 * 2. Flag any string > 10 chars in known short-string columns
 * 3. Confirm column names match real DB
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const partsDir = join(__dirname, 'parts');

// Real DB schema
const REAL_COLS = {
  dict_mos_to_civilian: ['branch', 'military_code', 'military_title', 'civilian_titles', 'onet_codes', 'industries', 'key_skills', 'description'],
  dict_military_jargon: ['military_term', 'civilian_equivalent', 'context', 'category', 'example_military', 'example_civilian'],
  dict_phrase_translations: ['military_phrase', 'civilian_phrase', 'branch', 'category', 'context_notes'],
  dict_eval_phrases: ['eval_phrase', 'civilian_translation', 'eval_type', 'performance_level', 'category', 'branch'],
  dict_action_verbs: ['verb', 'category', 'strength', 'avoid_in', 'best_for'],
  dict_acronyms: ['acronym', 'full_term', 'civilian_explanation', 'branch', 'category'],
  dict_ats_keywords: ['industry', 'role_type', 'keywords', 'weight'],
  dict_professional_summaries: ['template_name', 'rank_tier', 'target_industry', 'target_role', 'template_text', 'example_output'],
  dict_bullet_patterns: ['pattern_name', 'category', 'rank_tier', 'pattern_template', 'example_military', 'example_output', 'required_fields', 'optional_fields'],
  dict_linkedin_keywords: ['military_skill', 'linkedin_keywords', 'industry', 'priority'],
  dict_cover_letter_templates: ['template_name', 'industry', 'role_type', 'opening_paragraph', 'body_paragraph_1', 'body_paragraph_2', 'closing_paragraph', 'placeholders', 'notes'],
};

// Columns that should be short (branch-like), not long text
const SHORT_COLS = ['branch', 'context', 'eval_type', 'performance_level', 'strength', 'weight', 'priority', 'rank_tier', 'category'];

function parseValues(valuesStr) {
  const values = [];
  let i = 0, current = '', inQuote = false, depth = 0;
  while (i < valuesStr.length) {
    const ch = valuesStr[i];
    if (inQuote) {
      if (ch === "'" && valuesStr[i + 1] === "'") { current += "''"; i += 2; continue; }
      if (ch === "'") { inQuote = false; current += ch; i++; continue; }
      current += ch; i++; continue;
    }
    if (ch === "'") { inQuote = true; current += ch; i++; continue; }
    if (ch === '(' || ch === '{') { depth++; current += ch; i++; continue; }
    if (ch === ')' || ch === '}') { depth--; current += ch; i++; continue; }
    if (ch === ',' && depth === 0) { values.push(current.trim()); current = ''; i++; continue; }
    current += ch; i++;
  }
  if (current.trim()) values.push(current.trim());
  return values;
}

function extractString(val) {
  if (val === 'NULL') return null;
  if (val.startsWith("'") && !val.startsWith("'{")) {
    let s = val.slice(1);
    const ci = s.lastIndexOf("'");
    if (ci >= 0) s = s.substring(0, ci);
    return s.replace(/''/g, "'");
  }
  return null;
}

const files = readdirSync(partsDir)
  .filter(f => f.startsWith('part-') && f.endsWith('.sql') && f !== 'part-00-schema-fix.sql')
  .sort();

let errors = 0;

for (const file of files) {
  const content = readFileSync(join(partsDir, file), 'utf8');
  const lines = content.split('\n');

  const tableMatch = content.match(/INSERT INTO (\w+)\s*\(([^)]+)\)/);
  if (!tableMatch) { console.log(`\n=== ${file} === NO INSERTS`); continue; }

  const table = tableMatch[1];
  const cols = tableMatch[2].split(',').map(c => c.trim());
  const realCols = REAL_COLS[table];

  console.log(`\n=== ${file} → ${table} ===`);

  // Column name check
  const extraCols = cols.filter(c => !new Set(realCols).has(c));
  if (extraCols.length > 0) {
    console.log(`  ✗ EXTRA COLUMNS NOT IN DB: ${extraCols.join(', ')}`);
    errors++;
  }

  // Collect distinct values per column
  const distinctVals = {};
  const maxLens = {};
  cols.forEach(c => { distinctVals[c] = new Set(); maxLens[c] = { len: 0, val: '' }; });

  let insertCount = 0;
  for (const line of lines) {
    const m = line.match(/INSERT INTO \w+\s*\([^)]+\)\s*VALUES\s*\((.+)\)\s*ON CONFLICT/);
    if (!m) continue;
    insertCount++;

    const values = parseValues(m[1]);
    for (let i = 0; i < cols.length && i < values.length; i++) {
      const str = extractString(values[i]);
      if (str !== null && SHORT_COLS.includes(cols[i])) {
        distinctVals[cols[i]].add(str);
        if (str.length > maxLens[cols[i]].len) {
          maxLens[cols[i]] = { len: str.length, val: str };
        }
      }
    }
  }

  // Show distinct values for short columns
  for (const col of cols) {
    if (!SHORT_COLS.includes(col)) continue;
    const vals = [...distinctVals[col]].sort();
    const max = maxLens[col];
    const flag = max.len > 10 ? ' ⚠️ >10 CHARS' : '';
    console.log(`  ${col} (max ${max.len}): ${JSON.stringify(vals)}${flag}`);
    if (max.len > 10) errors++;
  }

  console.log(`  ${insertCount} INSERTs, columns: ${cols.join(', ')}`);
}

console.log(`\n========================================`);
if (errors === 0) {
  console.log('✓ ALL VALUES MATCH REAL DB CONVENTIONS');
  console.log('✓ NO STRINGS >10 CHARS IN SHORT COLUMNS');
} else {
  console.log(`✗ ${errors} ISSUES FOUND — FIX THEM`);
}
