#!/usr/bin/env node
/**
 * Concatenate all part SQL files into the main migration file.
 * - Strips existing COMMIT and trailing summary from main file
 * - Appends each part file with section headers
 * - Adds final COMMIT and grand total summary
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mainFile = join(__dirname, 'dict-json-to-sql-migration.sql');

// Read main file
let main = readFileSync(mainFile, 'utf8');

// Remove trailing COMMIT; and summary comments
const commitIdx = main.lastIndexOf('\nCOMMIT;');
if (commitIdx !== -1) {
  main = main.substring(0, commitIdx);
}

// Count existing inserts
const existingInserts = (main.match(/^INSERT /gm) || []).length;

// Part files in order, with their table names
const parts = [
  { file: 'part1.sql', tables: ['dict_acronyms', 'dict_ats_keywords'] },
  { file: 'part2-summaries.sql', tables: ['dict_professional_summaries'] },
  { file: 'part2-patterns.sql', tables: ['dict_bullet_patterns'] },
  { file: 'part2-patterns-extra.sql', tables: ['dict_bullet_patterns (additional)'] },
  { file: 'part3-linkedin.sql', tables: ['dict_linkedin_keywords'] },
  { file: 'part3-linkedin-extra.sql', tables: ['dict_linkedin_keywords (additional)'] },
  { file: 'part3-linkedin-final.sql', tables: ['dict_linkedin_keywords (final)'] },
  { file: 'part3-coverletter.sql', tables: ['dict_cover_letter_templates'] },
  { file: 'part3-coverletter-extra.sql', tables: ['dict_cover_letter_templates (additional)'] },
  { file: 'part3-coverletter-final.sql', tables: ['dict_cover_letter_templates (final)'] },
];

let newInserts = 0;
const tableCounts = {};

for (const { file, tables } of parts) {
  const content = readFileSync(join(__dirname, file), 'utf8');

  // Count inserts in this part
  const partInserts = (content.match(/^INSERT /gm) || []).length;
  newInserts += partInserts;

  // Track per-table
  for (const t of tables) {
    const baseName = t.replace(/ \(.*\)$/, '');
    tableCounts[baseName] = (tableCounts[baseName] || 0) + partInserts;
  }

  // Strip any BEGIN/COMMIT from part files
  let cleaned = content
    .replace(/^BEGIN;\s*\n/gm, '')
    .replace(/\nCOMMIT;\s*$/gm, '')
    .trim();

  main += '\n\n' + cleaned + '\n';
}

// Add COMMIT
main += '\nCOMMIT;\n';

// Add grand total summary
main += '\n-- =============================================================================\n';
main += '-- GRAND TOTAL SUMMARY\n';
main += `-- Generated: ${new Date().toISOString().split('T')[0]}\n`;
main += '-- =============================================================================\n';
main += `-- Existing tables (from earlier runs):   ${existingInserts} INSERT statements\n`;
main += '-- New tables added in this expansion:\n';
for (const [table, count] of Object.entries(tableCounts)) {
  main += `--   ${table.padEnd(35)} ${count} INSERT statements\n`;
}
main += `-- New INSERT statements:                 ${newInserts}\n`;
main += `-- GRAND TOTAL:                           ${existingInserts + newInserts} INSERT statements\n`;
main += '-- =============================================================================\n';

writeFileSync(mainFile, main, 'utf8');

console.log('=== Concatenation Complete ===');
console.log(`Existing inserts: ${existingInserts}`);
console.log(`New inserts:      ${newInserts}`);
console.log(`Grand total:      ${existingInserts + newInserts}`);
console.log('Per-table new counts:');
for (const [table, count] of Object.entries(tableCounts)) {
  console.log(`  ${table}: ${count}`);
}
