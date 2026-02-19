#!/usr/bin/env node
/**
 * Generate FIXED dict_mos_to_civilian SQL with military_title column included.
 * Reads title from source JSON files.
 * Output: parts/part-01-mos-to-civilian.sql
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '../../src/lib/debriefed-token-saver');

const esc = s => s == null ? '' : s.replace(/'/g, "''");
const pgArr = arr => !arr?.length ? "'{}'" : `'{${arr.map(s => `"${esc(s)}"`).join(",")}}'`;

/** Normalize branch values for database consistency. Use ONLY these values in SQL. */
function normalizeBranch(branch) {
  const map = {
    'army': 'army', 'Army': 'army', 'ARMY': 'army', 'US Army': 'army', 'U.S. Army': 'army',
    'navy': 'navy', 'Navy': 'navy', 'NAVY': 'navy', 'US Navy': 'navy', 'U.S. Navy': 'navy',
    'air force': 'usaf', 'Air Force': 'usaf', 'USAF': 'usaf', 'AF': 'usaf', 'U.S. Air Force': 'usaf', 'air_force': 'usaf',
    'marine corps': 'usmc', 'Marine Corps': 'usmc', 'Marines': 'usmc', 'USMC': 'usmc', 'marines': 'usmc', 'U.S. Marine Corps': 'usmc',
    'coast guard': 'uscg', 'Coast Guard': 'uscg', 'USCG': 'uscg', 'CG': 'uscg', 'coast_guard': 'uscg', 'U.S. Coast Guard': 'uscg',
    'space force': 'ussf', 'Space Force': 'ussf', 'USSF': 'ussf', 'SF': 'ussf', 'space_force': 'ussf', 'U.S. Space Force': 'ussf',
    'general': 'general', 'General': 'general', 'all': 'general', 'All': 'general',
  };
  return map[branch] || branch.toLowerCase().replace(/\s+/g, '_');
}

const lines = [];
let count = 0;

lines.push('-- dict_mos_to_civilian');
lines.push('-- Run in Supabase SQL Editor');
lines.push('');
lines.push('BEGIN;');
lines.push('');

function addEntries(file, branch, dataKey) {
  const raw = JSON.parse(readFileSync(join(BASE, file), 'utf8'));
  const data = raw[dataKey];
  if (!data) { console.error(`No key "${dataKey}" in ${file}`); return; }

  const normalizedBranch = normalizeBranch(branch);
  lines.push(`-- ${branch} (${Object.keys(data).length} entries from ${file})`);

  for (const [code, entry] of Object.entries(data)) {
    const title = entry.title || '';
    const civilianTitles = entry.civilian_titles || [];
    const industries = entry.industries || [];
    const keySkills = entry.key_skills || [];

    if (!title) {
      console.warn(`WARNING: ${branch} ${code} has no title — skipping`);
      continue;
    }

    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, military_title, civilian_titles, industries, key_skills)` +
      ` VALUES ('${esc(normalizedBranch)}', '${esc(code)}', '${esc(title)}', ${pgArr(civilianTitles)}, ${pgArr(industries)}, ${pgArr(keySkills)})` +
      ` ON CONFLICT DO NOTHING;`
    );
    count++;
  }
  lines.push('');
}

// All branches
addEntries('army-mos-crosswalk.json', 'Army', 'mos');
addEntries('airforce-afsc-crosswalk.json', 'Air Force', 'afsc');
addEntries('marines-mos-crosswalk.json', 'Marines', 'mos');
addEntries('navy-rating-crosswalk.json', 'Navy', 'ratings');
addEntries('coastguard-rating-crosswalk.json', 'Coast Guard', 'ratings');

// Coast Guard officer designators
{
  const raw = JSON.parse(readFileSync(join(BASE, 'coastguard-rating-crosswalk.json'), 'utf8'));

  const officers = raw.officer_designators || {};
  const cgBranch = normalizeBranch('Coast Guard');
  lines.push(`-- Coast Guard Officer Designators (${Object.keys(officers).length} entries)`);
  for (const [code, entry] of Object.entries(officers)) {
    const title = entry.title || '';
    if (!title) { console.warn(`WARNING: Coast Guard officer ${code} has no title — skipping`); continue; }
    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, military_title, civilian_titles, industries, key_skills)` +
      ` VALUES ('${esc(cgBranch)}', '${esc(code)}', '${esc(title)}', ${pgArr(entry.civilian_titles || [])}, ${pgArr(entry.industries || [])}, '{}')` +
      ` ON CONFLICT DO NOTHING;`
    );
    count++;
  }

  const warrants = raw.warrant_officer_specialties || {};
  lines.push(`-- Coast Guard Warrant Officer Specialties (${Object.keys(warrants).length} entries)`);
  for (const [code, entry] of Object.entries(warrants)) {
    const title = entry.title || '';
    if (!title) { console.warn(`WARNING: Coast Guard warrant ${code} has no title — skipping`); continue; }
    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, military_title, civilian_titles, industries, key_skills)` +
      ` VALUES ('${esc(cgBranch)}', '${esc(code)}', '${esc(title)}', ${pgArr(entry.civilian_titles || [])}, ${pgArr(entry.industries || [])}, '{}')` +
      ` ON CONFLICT DO NOTHING;`
    );
    count++;
  }
  lines.push('');
}

// Space Force
addEntries('spaceforce-specialty-crosswalk.json', 'Space Force', 'specialty_codes');

// Space Force emerging roles (uses 'description' instead of 'title')
{
  const raw = JSON.parse(readFileSync(join(BASE, 'spaceforce-specialty-crosswalk.json'), 'utf8'));
  const emerging = raw.emerging_space_roles?.roles || {};
  const sfBranch = normalizeBranch('Space Force');
  lines.push(`-- Space Force Emerging Roles (${Object.keys(emerging).length} entries)`);
  for (const [code, entry] of Object.entries(emerging)) {
    const title = entry.description || code.replace(/_/g, ' ');
    const milCode = code.toUpperCase().replace(/_/g, '-');
    lines.push(
      `INSERT INTO dict_mos_to_civilian (branch, military_code, military_title, civilian_titles, industries, key_skills)` +
      ` VALUES ('${esc(sfBranch)}', '${esc(milCode)}', '${esc(title)}', ${pgArr(entry.civilian_titles || [])}, ${pgArr(entry.industries || [])}, '{}')` +
      ` ON CONFLICT DO NOTHING;`
    );
    count++;
  }
  lines.push('');
}

lines.push('COMMIT;');
lines.push('');
lines.push(`-- dict_mos_to_civilian: ${count} INSERT statements`);

const outPath = join(__dirname, 'parts', 'part-01-mos-to-civilian.sql');
writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`dict_mos_to_civilian: ${count} inserts → parts/part-01-mos-to-civilian.sql`);
