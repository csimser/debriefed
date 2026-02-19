#!/usr/bin/env node
/**
 * Split dict-json-to-sql-migration.sql into per-table files under parts/
 * Each file wrapped in BEGIN/COMMIT, max ~500 lines.
 * If a table exceeds 500 INSERTs, split into part-XXa, part-XXb, etc.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const partsDir = join(__dirname, 'parts');
mkdirSync(partsDir, { recursive: true });

const sql = readFileSync(join(__dirname, 'dict-json-to-sql-migration.sql'), 'utf8');
const lines = sql.split('\n');

// Table detection: find all INSERT INTO <table> lines and group them
const tableOrder = [
  'dict_mos_to_civilian',
  'dict_military_jargon',
  'dict_phrase_translations',
  'dict_eval_phrases',
  'dict_action_verbs',
  'dict_acronyms',
  'dict_ats_keywords',
  'dict_professional_summaries',
  'dict_bullet_patterns',
  'dict_linkedin_keywords',
  'dict_cover_letter_templates',
];

const tableNames = {
  'dict_mos_to_civilian': 'part-01-mos-to-civilian',
  'dict_military_jargon': 'part-02-military-jargon',
  'dict_phrase_translations': 'part-03-phrase-translations',
  'dict_eval_phrases': 'part-04-eval-phrases',
  'dict_action_verbs': 'part-05-action-verbs',
  'dict_acronyms': 'part-06-acronyms',
  'dict_ats_keywords': 'part-07-ats-keywords',
  'dict_professional_summaries': 'part-08-professional-summaries',
  'dict_bullet_patterns': 'part-09-bullet-patterns',
  'dict_linkedin_keywords': 'part-10-linkedin-keywords',
  'dict_cover_letter_templates': 'part-11-cover-letter-templates',
};

// Collect INSERT statements and nearby comments per table
const tableInserts = {};
for (const t of tableOrder) tableInserts[t] = [];

// Also collect CREATE TABLE statements (for action_verbs)
const createStatements = {};

let currentComments = [];

for (const line of lines) {
  // Track comment blocks
  if (line.startsWith('--')) {
    currentComments.push(line);
    continue;
  }

  // Skip empty lines, BEGIN, COMMIT
  if (line.trim() === '' || line.trim() === 'BEGIN;' || line.trim() === 'COMMIT;') {
    if (currentComments.length > 0) currentComments = [];
    continue;
  }

  // CREATE TABLE
  if (line.startsWith('CREATE TABLE')) {
    const match = line.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/);
    if (match) {
      // Collect the full CREATE TABLE statement (may span multiple lines but in our case it's one block)
      createStatements[match[1]] = [...currentComments, line];
    }
    currentComments = [];
    continue;
  }

  // INSERT INTO
  if (line.startsWith('INSERT INTO')) {
    const match = line.match(/INSERT INTO (\w+)/);
    if (match && tableInserts[match[1]]) {
      // Add any preceding comments (section headers)
      if (currentComments.length > 0) {
        tableInserts[match[1]].push(...currentComments);
        currentComments = [];
      }
      tableInserts[match[1]].push(line);
    } else {
      currentComments = [];
    }
    continue;
  }

  // Other lines (like continuation of CREATE TABLE, or the closing paren)
  // Check if we're in a CREATE TABLE context
  for (const [tbl, stmts] of Object.entries(createStatements)) {
    if (stmts.length > 0 && !stmts[stmts.length - 1].includes(';')) {
      stmts.push(line);
      break;
    }
  }
  currentComments = [];
}

const MAX_LINES = 500;

function writeFile(filename, tableDisplayName, insertLines, prefix = []) {
  const out = [];
  out.push(`-- ${tableDisplayName}`);
  out.push(`-- ${insertLines.filter(l => l.startsWith('INSERT')).length} INSERT statements`);
  out.push(`-- Run in Supabase SQL Editor`);
  out.push('');
  out.push('BEGIN;');
  out.push('');
  if (prefix.length > 0) {
    out.push(...prefix);
    out.push('');
  }
  out.push(...insertLines);
  out.push('');
  out.push('COMMIT;');

  const path = join(partsDir, filename);
  writeFileSync(path, out.join('\n') + '\n', 'utf8');
  const insertCount = insertLines.filter(l => l.startsWith('INSERT')).length;
  console.log(`  ${filename}: ${out.length} lines, ${insertCount} INSERTs`);
}

console.log('=== Splitting into per-table files ===\n');

for (const table of tableOrder) {
  const baseName = tableNames[table];
  const allLines = tableInserts[table];
  const insertOnly = allLines.filter(l => l.startsWith('INSERT'));
  const prefix = createStatements[table] || [];

  if (insertOnly.length <= MAX_LINES) {
    // Single file
    writeFile(`${baseName}.sql`, table, allLines, prefix);
  } else {
    // Split into chunks
    const chunkSize = 400; // Leave room for headers
    let chunkIdx = 0;
    let currentChunk = [];
    let insertsInChunk = 0;

    for (const line of allLines) {
      currentChunk.push(line);
      if (line.startsWith('INSERT')) insertsInChunk++;

      if (insertsInChunk >= chunkSize) {
        const suffix = String.fromCharCode(97 + chunkIdx); // a, b, c...
        writeFile(
          `${baseName}-${suffix}.sql`,
          `${table} (part ${suffix})`,
          currentChunk,
          chunkIdx === 0 ? prefix : []
        );
        currentChunk = [];
        insertsInChunk = 0;
        chunkIdx++;
      }
    }

    // Write remaining
    if (currentChunk.length > 0) {
      const suffix = String.fromCharCode(97 + chunkIdx);
      writeFile(
        `${baseName}-${suffix}.sql`,
        `${table} (part ${suffix})`,
        currentChunk,
        chunkIdx === 0 ? prefix : []
      );
    }
  }
}

console.log('\nDone! Run files in order (part-01 through part-11) in Supabase SQL Editor.');
