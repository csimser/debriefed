#!/usr/bin/env node
/**
 * For each column flagged as >10 chars, check the REAL DB max length.
 * If real DB already has long values, the column is TEXT (no worry).
 * If real DB only has short values, the column MIGHT be VARCHAR (risky).
 */
const SUPABASE_URL = 'https://zsnncxizrtcmzcuizexk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Columns we need to verify: table.column → our max length in seed data
const CHECKS = [
  { table: 'dict_phrase_translations', col: 'category', ourMax: 15 },
  { table: 'dict_eval_phrases', col: 'performance_level', ourMax: 13 },
  { table: 'dict_eval_phrases', col: 'category', ourMax: 13 },
  { table: 'dict_eval_phrases', col: 'eval_type', ourMax: 7 },
  { table: 'dict_action_verbs', col: 'category', ourMax: 22 },
  { table: 'dict_acronyms', col: 'category', ourMax: 12 },
  { table: 'dict_professional_summaries', col: 'rank_tier', ourMax: 15 },
  { table: 'dict_bullet_patterns', col: 'category', ourMax: 24 },
  { table: 'dict_bullet_patterns', col: 'rank_tier', ourMax: 15 },
];

async function main() {
  console.log('Checking real DB max lengths for flagged columns...\n');
  console.log('Column                                    | DB Max | Our Max | Risk');
  console.log('------------------------------------------|--------|---------|-----');

  for (const { table, col, ourMax } of CHECKS) {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=${col}&limit=1000`,
      { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
    );
    const data = await resp.json();
    let dbMax = 0;
    let dbMaxVal = '';
    for (const row of data) {
      const v = row[col];
      if (v && v.length > dbMax) { dbMax = v.length; dbMaxVal = v; }
    }

    const risk = ourMax > dbMax && dbMax < 10 ? '⚠️ RISKY' :
                 ourMax > dbMax && dbMax < 15 ? '⚡ MAYBE' : '✓ OK';

    const label = `${table}.${col}`;
    console.log(`${label.padEnd(42)}| ${String(dbMax).padStart(6)} | ${String(ourMax).padStart(7)} | ${risk} (DB: "${dbMaxVal}")`);
  }

  // Now try a direct INSERT test for the most risky column: performance_level
  console.log('\n=== TEST INSERT: dict_eval_phrases with long performance_level ===');
  const testResp = await fetch(`${SUPABASE_URL}/rest/v1/dict_eval_phrases`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      eval_phrase: '__test_varchar_check__',
      civilian_translation: 'test',
      eval_type: 'general',
      performance_level: 'Above Average',  // 13 chars — will this fail?
      category: 'test',
      branch: 'general',
    }),
  });
  const testStatus = testResp.status;
  const testBody = await testResp.text();
  console.log(`Status: ${testStatus}`);
  console.log(`Response: ${testBody.substring(0, 300)}`);

  // Clean up test row
  if (testStatus === 201 || testStatus === 200) {
    await fetch(
      `${SUPABASE_URL}/rest/v1/dict_eval_phrases?eval_phrase=eq.__test_varchar_check__`,
      {
        method: 'DELETE',
        headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
      }
    );
    console.log('Test row cleaned up.');
  }

  // Test action_verbs with long category
  console.log('\n=== TEST INSERT: dict_action_verbs with long category ===');
  const testResp2 = await fetch(`${SUPABASE_URL}/rest/v1/dict_action_verbs`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      verb: '__test_varchar__',
      category: 'Training & Development',  // 22 chars
      strength: 'strong',
    }),
  });
  console.log(`Status: ${testResp2.status}`);
  console.log(`Response: ${(await testResp2.text()).substring(0, 300)}`);

  // Clean up
  await fetch(
    `${SUPABASE_URL}/rest/v1/dict_action_verbs?verb=eq.__test_varchar__`,
    {
      method: 'DELETE',
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
    }
  );

  // Test bullet_patterns with long rank_tier and category
  console.log('\n=== TEST INSERT: dict_bullet_patterns with long values ===');
  const testResp3 = await fetch(`${SUPABASE_URL}/rest/v1/dict_bullet_patterns`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      pattern_name: '__test__',
      category: 'International Operations',  // 24 chars
      rank_tier: 'junior_enlisted',  // 15 chars
      pattern_template: 'test',
      example_military: 'test',
    }),
  });
  console.log(`Status: ${testResp3.status}`);
  console.log(`Response: ${(await testResp3.text()).substring(0, 300)}`);

  await fetch(
    `${SUPABASE_URL}/rest/v1/dict_bullet_patterns?pattern_name=eq.__test__`,
    {
      method: 'DELETE',
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
    }
  );
}

main().catch(console.error);
