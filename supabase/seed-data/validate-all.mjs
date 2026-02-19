#!/usr/bin/env node
/**
 * Comprehensive validator for all 15 dict seed SQL files.
 * Parses every INSERT statement, extracts column values,
 * reports max lengths per column per table, and flags any
 * values exceeding safe VARCHAR limits.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const partsDir = join(__dirname, 'parts');

// Known VARCHAR limits from DB schema (user-reported)
// Tables without VARCHAR constraints use TEXT columns (no limit)
const VARCHAR_LIMITS = {
  dict_mos_to_civilian: {
    branch: 10,
    military_code: 10,
    military_title: 100,  // Likely TEXT but check conservatively
  },
  dict_military_jargon: {
    branch: 50,           // Likely TEXT
    category: 50,         // Likely TEXT
  },
  dict_eval_phrases: {
    branch: 50,           // Likely TEXT
    eval_type: 50,        // Likely TEXT
    performance_level: 50,// Likely TEXT
    category: 50,         // Likely TEXT
  },
  dict_phrase_translations: {
    branch: 50,
    category: 50,
  },
  dict_action_verbs: {
    // From CREATE TABLE in the SQL — all TEXT columns
  },
  dict_acronyms: {
    branch: 50,
    category: 50,
  },
  dict_ats_keywords: {},
  dict_professional_summaries: {},
  dict_bullet_patterns: {},
  dict_linkedin_keywords: {},
  dict_cover_letter_templates: {},
};

const files = readdirSync(partsDir)
  .filter(f => f.startsWith('part-') && f.endsWith('.sql'))
  .sort();

let totalInserts = 0;
let totalViolations = 0;
const maxLengths = {}; // table -> column -> max length
const violations = [];

for (const file of files) {
  const content = readFileSync(join(partsDir, file), 'utf8');
  const lines = content.split('\n');

  let fileInserts = 0;
  let hasBegin = false;
  let hasCommit = false;
  let hasUnsafe = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Safety checks
    if (trimmed === 'BEGIN;') hasBegin = true;
    if (trimmed === 'COMMIT;') hasCommit = true;
    if (/^\s*(UPDATE|DELETE|ALTER|DROP|TRUNCATE)\s/i.test(trimmed)) {
      hasUnsafe = true;
      violations.push({ file, issue: `UNSAFE: ${trimmed.substring(0, 80)}` });
    }

    // Parse INSERT statements
    const insertMatch = trimmed.match(
      /^INSERT INTO (\w+)\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)\s*ON CONFLICT/i
    );
    if (!insertMatch) continue;
    fileInserts++;

    const table = insertMatch[1];
    const columns = insertMatch[2].split(',').map(c => c.trim());
    const valuesStr = insertMatch[3];

    // Parse values - handle quoted strings, arrays, NULLs, casts
    const values = [];
    let i = 0;
    let current = '';
    let inQuote = false;
    let inArray = false;
    let depth = 0;

    while (i < valuesStr.length) {
      const ch = valuesStr[i];

      if (inQuote) {
        if (ch === "'" && valuesStr[i + 1] === "'") {
          current += "''";
          i += 2;
          continue;
        }
        if (ch === "'") {
          inQuote = false;
          current += ch;
          i++;
          continue;
        }
        current += ch;
        i++;
        continue;
      }

      if (ch === "'") {
        inQuote = true;
        current += ch;
        i++;
        continue;
      }

      if (ch === '(' || ch === '{') {
        depth++;
        current += ch;
        i++;
        continue;
      }
      if (ch === ')' || ch === '}') {
        depth--;
        current += ch;
        i++;
        continue;
      }

      if (ch === ',' && depth === 0) {
        values.push(current.trim());
        current = '';
        i++;
        continue;
      }

      current += ch;
      i++;
    }
    if (current.trim()) values.push(current.trim());

    // Track max lengths
    if (!maxLengths[table]) maxLengths[table] = {};

    for (let c = 0; c < columns.length && c < values.length; c++) {
      const col = columns[c];
      const val = values[c];

      if (!maxLengths[table][col]) maxLengths[table][col] = { max: 0, example: '', file: '' };

      // Extract plain string length (remove surrounding quotes)
      let strLen = 0;
      let strVal = '';
      if (val === 'NULL') {
        strLen = 0;
        strVal = 'NULL';
      } else if (val.startsWith("'") && !val.startsWith("'{")) {
        // Plain quoted string — remove surrounding quotes and unescape
        strVal = val.slice(1);
        // Find the closing quote (handle escaped quotes)
        const closeIdx = strVal.lastIndexOf("'");
        if (closeIdx >= 0) strVal = strVal.substring(0, closeIdx);
        strVal = strVal.replace(/''/g, "'");
        strLen = strVal.length;
      } else if (val.startsWith("'{") || val.startsWith("'\"")) {
        // PostgreSQL array — count is less relevant
        strLen = -1; // skip array columns
      } else {
        // Number, boolean, cast, etc
        strLen = -1;
      }

      if (strLen > maxLengths[table][col].max) {
        maxLengths[table][col].max = strLen;
        maxLengths[table][col].example = strVal.substring(0, 80);
        maxLengths[table][col].file = file;
      }
    }
  }

  totalInserts += fileInserts;

  // Transaction checks
  if (!hasBegin) violations.push({ file, issue: 'MISSING BEGIN;' });
  if (!hasCommit) violations.push({ file, issue: 'MISSING COMMIT;' });

  // ON CONFLICT check
  const insertLines = lines.filter(l => l.trim().startsWith('INSERT INTO'));
  const noConflict = insertLines.filter(l => !/ON CONFLICT/i.test(l));
  if (noConflict.length > 0) {
    violations.push({ file, issue: `${noConflict.length} INSERT(s) missing ON CONFLICT` });
  }

  console.log(`${file}: ${fileInserts} INSERTs, BEGIN=${hasBegin}, COMMIT=${hasCommit}${hasUnsafe ? ' ⚠️ UNSAFE' : ''}`);
}

console.log(`\n=== MAX STRING LENGTHS PER COLUMN ===`);
for (const [table, cols] of Object.entries(maxLengths).sort()) {
  console.log(`\n${table}:`);
  for (const [col, info] of Object.entries(cols).sort()) {
    if (info.max <= 0) continue; // skip arrays/numbers
    const flag = info.max > 10 ? ` ← CHECK IF VARCHAR` : '';
    console.log(`  ${col}: max ${info.max} chars${flag}  (ex: "${info.example}")  [${info.file}]`);
  }
}

console.log(`\n=== SPECIFIC VARCHAR VIOLATION CHECK ===`);
// The user confirmed dict_mos_to_civilian has branch VARCHAR(10) and military_code VARCHAR(10)
// Check all tables for common branch column — flag anything > 10 chars
let branchViolations = 0;
for (const file of files) {
  const content = readFileSync(join(partsDir, file), 'utf8');
  const lines = content.split('\n');
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    if (!line.trim().startsWith('INSERT INTO')) continue;

    // Check for 'Coast Guard' and 'Space Force' in any VALUES
    if (line.includes("'Coast Guard'") || line.includes("'Space Force'")) {
      branchViolations++;
    }
  }
}
console.log(`Lines with 'Coast Guard' or 'Space Force' as plain values: ${branchViolations}`);

console.log(`\n=== SUMMARY ===`);
console.log(`Total files: ${files.length}`);
console.log(`Total INSERTs: ${totalInserts}`);
console.log(`Violations: ${violations.length}`);
for (const v of violations) {
  console.log(`  ${v.file}: ${v.issue}`);
}
