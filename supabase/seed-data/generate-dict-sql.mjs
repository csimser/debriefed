#!/usr/bin/env node
/**
 * Generate SQL INSERT statements from JSON crosswalk/dictionary files.
 * Output: dict-json-to-sql-migration.sql
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '../../src/lib/debriefed-token-saver');

// Helper: escape single quotes for SQL
function esc(str) {
  if (str == null) return 'NULL';
  return str.replace(/'/g, "''");
}

// Helper: format TEXT[] for Postgres
function pgArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  const items = arr.map(s => `"${esc(s)}"`).join(',');
  return `'{${items}}'`;
}

const lines = [];
const counts = {
  dict_mos_to_civilian: 0,
  dict_military_jargon: 0,
  dict_phrase_translations: 0,
};

lines.push('-- =============================================================================');
lines.push('-- Debriefed Dictionary Seed Data');
lines.push('-- Generated from src/lib/debriefed-token-saver/ JSON files');
lines.push(`-- Generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('-- REVIEW BEFORE EXECUTING — use Supabase SQL Editor or psql');
lines.push('-- =============================================================================');
lines.push('');
lines.push('BEGIN;');
lines.push('');

// ==========================================
// 1. dict_mos_to_civilian — MOS/AFSC/Rating crosswalks
// ==========================================
lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_mos_to_civilian');
lines.push('-- =============================================================================');
lines.push('');

function addMosCrosswalk(file, branch, dataKey) {
  const raw = JSON.parse(readFileSync(join(BASE, file), 'utf8'));
  const data = raw[dataKey];
  if (!data) {
    console.error(`No key "${dataKey}" in ${file}`);
    return;
  }

  lines.push(`-- ${branch} (${Object.keys(data).length} entries from ${file})`);

  for (const [code, entry] of Object.entries(data)) {
    const civilianTitles = entry.civilian_titles || [];
    const industries = entry.industries || [];
    // key_skills: not in JSON, leave empty (to be enriched later)
    const keySkills = [];

    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, civilian_titles, industries, key_skills)` +
      ` VALUES ('${esc(branch)}', '${esc(code)}', ${pgArray(civilianTitles)}, ${pgArray(industries)}, ${pgArray(keySkills)})` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_mos_to_civilian++;
  }
  lines.push('');
}

// Army
addMosCrosswalk('army-mos-crosswalk.json', 'Army', 'mos');

// Air Force
addMosCrosswalk('airforce-afsc-crosswalk.json', 'Air Force', 'afsc');

// Marines
addMosCrosswalk('marines-mos-crosswalk.json', 'Marines', 'mos');

// Navy
addMosCrosswalk('navy-rating-crosswalk.json', 'Navy', 'ratings');

// Coast Guard — has ratings, officer_designators, warrant_officer_specialties
addMosCrosswalk('coastguard-rating-crosswalk.json', 'Coast Guard', 'ratings');

// Coast Guard officer designators
{
  const raw = JSON.parse(readFileSync(join(BASE, 'coastguard-rating-crosswalk.json'), 'utf8'));
  const officers = raw.officer_designators || {};
  lines.push(`-- Coast Guard Officer Designators (${Object.keys(officers).length} entries)`);
  for (const [code, entry] of Object.entries(officers)) {
    const civilianTitles = entry.civilian_titles || [];
    const industries = entry.industries || [];
    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, civilian_titles, industries, key_skills)` +
      ` VALUES ('Coast Guard', '${esc(code)}', ${pgArray(civilianTitles)}, ${pgArray(industries)}, '{}')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_mos_to_civilian++;
  }

  const warrants = raw.warrant_officer_specialties || {};
  lines.push(`-- Coast Guard Warrant Officer Specialties (${Object.keys(warrants).length} entries)`);
  for (const [code, entry] of Object.entries(warrants)) {
    const civilianTitles = entry.civilian_titles || [];
    const industries = entry.industries || [];
    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, civilian_titles, industries, key_skills)` +
      ` VALUES ('Coast Guard', '${esc(code)}', ${pgArray(civilianTitles)}, ${pgArray(industries)}, '{}')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_mos_to_civilian++;
  }
  lines.push('');
}

// Space Force
addMosCrosswalk('spaceforce-specialty-crosswalk.json', 'Space Force', 'specialty_codes');

// Space Force emerging roles
{
  const raw = JSON.parse(readFileSync(join(BASE, 'spaceforce-specialty-crosswalk.json'), 'utf8'));
  const emerging = raw.emerging_space_roles?.roles || {};
  lines.push(`-- Space Force Emerging Roles (${Object.keys(emerging).length} entries)`);
  for (const [code, entry] of Object.entries(emerging)) {
    const civilianTitles = entry.civilian_titles || [];
    const industries = entry.industries || [];
    // Use a descriptive code for emerging roles
    const milCode = code.toUpperCase().replace(/_/g, '-');
    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, civilian_titles, industries, key_skills)` +
      ` VALUES ('Space Force', '${esc(milCode)}', ${pgArray(civilianTitles)}, ${pgArray(industries)}, '{}')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_mos_to_civilian++;
  }
  lines.push('');
}


// ==========================================
// 2. dict_military_jargon — terms, acronyms, ranks, equipment, unit types
// ==========================================
lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_military_jargon');
lines.push('-- =============================================================================');
lines.push('');

const termsData = JSON.parse(readFileSync(join(BASE, 'military-terms-dictionary.json'), 'utf8'));

// Acronyms
{
  const acronyms = termsData.acronyms || {};
  lines.push(`-- Acronyms (${Object.keys(acronyms).length} entries)`);
  for (const [term, definition] of Object.entries(acronyms)) {
    lines.push(
      `INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)` +
      ` VALUES ('${esc(term)}', '${esc(definition)}', 'all', 'Acronym')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_military_jargon++;
  }
  lines.push('');
}

// Terms
{
  const terms = termsData.terms || {};
  lines.push(`-- Military Terms (${Object.keys(terms).length} entries)`);
  for (const [term, definition] of Object.entries(terms)) {
    lines.push(
      `INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)` +
      ` VALUES ('${esc(term)}', '${esc(definition)}', 'all', 'Term')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_military_jargon++;
  }
  lines.push('');
}

// Ranks (branch-specific)
{
  const ranks = termsData.ranks || {};
  const branchMap = {
    navy: 'Navy',
    army: 'Army',
    air_force: 'Air Force',
    marines: 'Marines',
    coast_guard: 'Coast Guard',
  };

  for (const [branchKey, branchRanks] of Object.entries(ranks)) {
    const branchName = branchMap[branchKey] || branchKey;
    const rankEntries = Object.entries(branchRanks);
    lines.push(`-- ${branchName} Ranks (${rankEntries.length} entries)`);

    for (const [paygrade, info] of rankEntries) {
      // Format: "PO2 (Petty Officer Second Class)" -> "Senior Technician / Team Lead"
      const milTerm = `${info.abbrev} (${info.title})`;
      const civEquiv = info.civilian;
      lines.push(
        `INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)` +
        ` VALUES ('${esc(milTerm)}', '${esc(civEquiv)}', '${esc(branchName)}', 'Rank')` +
        ` ON CONFLICT DO NOTHING;`
      );
      counts.dict_military_jargon++;
    }
  }
  lines.push('');
}

// Equipment to civilian
{
  const equipment = termsData.equipment_to_civilian || {};
  lines.push(`-- Equipment Mappings (${Object.keys(equipment).length} entries)`);
  for (const [term, civEquiv] of Object.entries(equipment)) {
    lines.push(
      `INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)` +
      ` VALUES ('${esc(term)}', '${esc(civEquiv)}', 'all', 'Equipment')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_military_jargon++;
  }
  lines.push('');
}

// Unit types
{
  const unitTypes = termsData.unit_types || {};
  lines.push(`-- Unit Types (${Object.keys(unitTypes).length} entries)`);
  for (const [term, civEquiv] of Object.entries(unitTypes)) {
    lines.push(
      `INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)` +
      ` VALUES ('${esc(term)}', '${esc(civEquiv)}', 'all', 'Unit Type')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_military_jargon++;
  }
  lines.push('');
}


// ==========================================
// 3. dict_phrase_translations — action phrases
// ==========================================
lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_phrase_translations');
lines.push('-- =============================================================================');
lines.push('');

// Action phrases from military-terms-dictionary.json
{
  const phrases = termsData.action_phrases || {};
  lines.push(`-- Action Phrases (${Object.keys(phrases).length} entries)`);
  for (const [milPhrase, civPhrase] of Object.entries(phrases)) {
    lines.push(
      `INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)` +
      ` VALUES ('${esc(milPhrase)}', '${esc(civPhrase)}', 'all', 'Action Phrase')` +
      ` ON CONFLICT DO NOTHING;`
    );
    counts.dict_phrase_translations++;
  }
  lines.push('');
}


// ==========================================
// Finish
// ==========================================
lines.push('COMMIT;');
lines.push('');
lines.push('-- =============================================================================');
lines.push('-- SUMMARY');
lines.push(`-- dict_mos_to_civilian:   ${counts.dict_mos_to_civilian} INSERT statements`);
lines.push(`-- dict_military_jargon:   ${counts.dict_military_jargon} INSERT statements`);
lines.push(`-- dict_phrase_translations: ${counts.dict_phrase_translations} INSERT statements`);
lines.push(`-- TOTAL:                   ${counts.dict_mos_to_civilian + counts.dict_military_jargon + counts.dict_phrase_translations} INSERT statements`);
lines.push('-- =============================================================================');
lines.push('');
lines.push('-- NOTE: action-verbs-library.json contains ~1,186 categorized action verbs');
lines.push('-- These belong in dict_action_verbs table (separate schema, not generated here).');
lines.push('-- key_skills column left empty for dict_mos_to_civilian — can be enriched later.');

const outPath = join(__dirname, 'dict-json-to-sql-migration.sql');
writeFileSync(outPath, lines.join('\n'), 'utf8');

console.log('=== SQL Generation Complete ===');
console.log(`Output: ${outPath}`);
console.log(`dict_mos_to_civilian:   ${counts.dict_mos_to_civilian} inserts`);
console.log(`dict_military_jargon:   ${counts.dict_military_jargon} inserts`);
console.log(`dict_phrase_translations: ${counts.dict_phrase_translations} inserts`);
console.log(`TOTAL:                   ${counts.dict_mos_to_civilian + counts.dict_military_jargon + counts.dict_phrase_translations} inserts`);
