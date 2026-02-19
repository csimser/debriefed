#!/usr/bin/env node
/**
 * Fix ALL branch/context values across ALL part files to match
 * the REAL Supabase database values (lowercase abbreviations).
 * Also fix eval_type values to match real DB.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const partsDir = join(__dirname, 'parts');

// === COLUMN-SPECIFIC value mappings ===
// These replacements ONLY apply inside SQL VALUES(), not in comments or column names

// Branch column replacements (applies to: dict_mos_to_civilian, dict_phrase_translations,
// dict_eval_phrases, dict_acronyms, and context column of dict_military_jargon)
const BRANCH_MAP = {
  'Army': 'army',
  'Navy': 'navy',
  'Air Force': 'usaf',
  'Marines': 'usmc',
  'Marine Corps': 'usmc',
  'Coast Guard': 'uscg',
  'Space Force': 'ussf',
  'all': 'general',
  'General': 'general',
  'All': 'general',
};

// eval_type replacements (real DB: fitrep, general, ncoer)
const EVAL_TYPE_MAP = {
  'FITREP': 'fitrep',
  'NCOER': 'ncoer',
  'OER': 'general',
  'OPR': 'general',
  'EPR': 'general',
};

// performance_level replacements (real DB: high, mid, top)
const PERF_LEVEL_MAP = {
  'Early Promote': 'top',
  'Must Promote': 'high',
  'Promotable': 'mid',
  'Progressing': 'mid',
  'Top': 'top',
  'High': 'high',
  'Mid': 'mid',
};

// action_verbs strength (real DB: medium, standard, strong)
const STRENGTH_MAP = {
  'power': 'strong',
  'Power': 'strong',
};

const files = readdirSync(partsDir)
  .filter(f => f.startsWith('part-') && f.endsWith('.sql') && f !== 'part-00-schema-fix.sql')
  .sort();

let totalReplacements = 0;

for (const file of files) {
  let content = readFileSync(join(partsDir, file), 'utf8');
  let fileReplacements = 0;

  // Determine which table this file inserts into
  const tableMatch = content.match(/INSERT INTO (\w+)/);
  const table = tableMatch ? tableMatch[1] : '';

  // Apply branch replacements to files that have branch or context columns
  const hasBranch = ['dict_mos_to_civilian', 'dict_phrase_translations',
    'dict_eval_phrases', 'dict_acronyms'].includes(table);
  const hasContext = table === 'dict_military_jargon';

  if (hasBranch || hasContext) {
    for (const [from, to] of Object.entries(BRANCH_MAP)) {
      // Only replace inside VALUES — match the pattern: , 'Value', or ('Value',
      // Use global regex for each
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`'${escaped}'`, 'g');
      const before = content;
      content = content.replace(regex, (match, offset) => {
        // Check this is inside a VALUES() clause (not a comment)
        const lineStart = content.lastIndexOf('\n', offset);
        const line = content.substring(lineStart, offset + match.length + 50);
        if (line.includes('INSERT INTO') || line.includes('VALUES')) {
          fileReplacements++;
          return `'${to}'`;
        }
        // Also replace if on an INSERT line
        if (line.includes("'")) {
          fileReplacements++;
          return `'${to}'`;
        }
        return match;
      });
    }
  }

  // Apply eval_type fixes for dict_eval_phrases
  if (table === 'dict_eval_phrases') {
    for (const [from, to] of Object.entries(EVAL_TYPE_MAP)) {
      const regex = new RegExp(`'${from}'`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, `'${to}'`);
        fileReplacements += matches.length;
      }
    }

    for (const [from, to] of Object.entries(PERF_LEVEL_MAP)) {
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`'${escaped}'`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, `'${to}'`);
        fileReplacements += matches.length;
      }
    }
  }

  // Apply strength fixes for dict_action_verbs
  if (table === 'dict_action_verbs') {
    for (const [from, to] of Object.entries(STRENGTH_MAP)) {
      const regex = new RegExp(`'${from}'`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, `'${to}'`);
        fileReplacements += matches.length;
      }
    }
  }

  if (fileReplacements > 0) {
    writeFileSync(join(partsDir, file), content, 'utf8');
    console.log(`${file}: ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
  } else {
    console.log(`${file}: no changes needed`);
  }
}

console.log(`\nTotal replacements: ${totalReplacements}`);
