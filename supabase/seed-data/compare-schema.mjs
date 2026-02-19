#!/usr/bin/env node
/**
 * Compare REAL Supabase column names against what each part file INSERTs.
 * Finds every mismatch: missing columns, extra columns, wrong column names.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const partsDir = join(__dirname, 'parts');

// REAL column names from live Supabase (excluding id and created_at which are auto-generated)
const REAL_SCHEMA = {
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

const files = readdirSync(partsDir)
  .filter(f => f.startsWith('part-') && f.endsWith('.sql') && f !== 'part-00-schema-fix.sql')
  .sort();

let totalMismatches = 0;

for (const file of files) {
  const content = readFileSync(join(partsDir, file), 'utf8');
  const lines = content.split('\n');

  // Find first INSERT to get table and columns
  let foundTable = null;
  let foundCols = null;

  for (const line of lines) {
    const m = line.match(/INSERT INTO (\w+)\s*\(([^)]+)\)/);
    if (m) {
      foundTable = m[1];
      foundCols = m[2].split(',').map(c => c.trim());
      break;
    }
  }

  if (!foundTable) {
    console.log(`\n=== ${file} === NO INSERT FOUND`);
    continue;
  }

  console.log(`\n=== ${file} → ${foundTable} ===`);

  const realCols = REAL_SCHEMA[foundTable];
  if (!realCols) {
    console.log(`  ⚠️  TABLE NOT IN REAL SCHEMA: ${foundTable}`);
    totalMismatches++;
    continue;
  }

  // Compare
  const insertSet = new Set(foundCols);
  const realSet = new Set(realCols);

  const extraInInsert = foundCols.filter(c => !realSet.has(c));
  const missingFromInsert = realCols.filter(c => !insertSet.has(c));

  if (extraInInsert.length === 0 && missingFromInsert.length === 0) {
    console.log(`  ✓ Columns match perfectly: ${foundCols.join(', ')}`);
  } else {
    if (extraInInsert.length > 0) {
      console.log(`  ✗ EXTRA columns in INSERT (not in DB): ${extraInInsert.join(', ')}`);
      totalMismatches++;
    }
    if (missingFromInsert.length > 0) {
      console.log(`  ⚠  Missing from INSERT (in DB, nullable): ${missingFromInsert.join(', ')}`);
    }
    console.log(`  INSERT cols: ${foundCols.join(', ')}`);
    console.log(`  REAL DB cols: ${realCols.join(', ')}`);
  }

  // Check column order (may matter if values are positional)
  // Also count total inserts
  let insertCount = 0;
  for (const line of lines) {
    if (line.trim().startsWith('INSERT INTO')) insertCount++;
  }
  console.log(`  ${insertCount} INSERT statements`);
}

console.log(`\n========================================`);
console.log(`Total column mismatches: ${totalMismatches}`);
if (totalMismatches === 0) {
  console.log('✓ ALL FILES MATCH REAL DATABASE SCHEMA');
} else {
  console.log('✗ FIX THE MISMATCHES ABOVE');
}
