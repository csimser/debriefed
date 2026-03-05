#!/usr/bin/env node
/**
 * Query REAL branch/context values from every dict table that has them.
 * Also query information_schema for ALL VARCHAR columns and their limits.
 */

const SUPABASE_URL = 'https://zsnncxizrtcmzcuizexk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function query(table, columns) {
  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${columns}&limit=1000`,
    {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    }
  );
  if (!resp.ok) return { error: `${resp.status} ${await resp.text()}` };
  return { data: await resp.json() };
}

async function main() {
  console.log('=== STEP 1: Distinct branch/context values in REAL DB ===\n');

  // Tables with branch column
  const branchTables = [
    'dict_mos_to_civilian',
    'dict_phrase_translations',
    'dict_eval_phrases',
    'dict_acronyms',
  ];

  for (const table of branchTables) {
    const { data, error } = await query(table, 'branch');
    if (error) { console.log(`${table}: ERROR ${error}`); continue; }
    const distinct = [...new Set(data.map(r => r.branch))].sort();
    console.log(`${table} (${data.length} rows sampled):`);
    console.log(`  branch values: ${JSON.stringify(distinct)}`);
  }

  // dict_military_jargon uses context, not branch
  {
    const { data, error } = await query('dict_military_jargon', 'context');
    if (error) { console.log(`dict_military_jargon: ERROR ${error}`); }
    else {
      const distinct = [...new Set(data.map(r => r.context))].sort();
      console.log(`dict_military_jargon (${data.length} rows sampled):`);
      console.log(`  context values: ${JSON.stringify(distinct)}`);
    }
  }

  // dict_eval_phrases also check eval_type and performance_level
  {
    const { data } = await query('dict_eval_phrases', 'eval_type,performance_level');
    if (data) {
      const types = [...new Set(data.map(r => r.eval_type))].sort();
      const levels = [...new Set(data.map(r => r.performance_level))].sort();
      console.log(`dict_eval_phrases eval_type values: ${JSON.stringify(types)}`);
      console.log(`dict_eval_phrases performance_level values: ${JSON.stringify(levels)}`);
    }
  }

  // dict_action_verbs: check category and strength
  {
    const { data } = await query('dict_action_verbs', 'category,strength');
    if (data) {
      const cats = [...new Set(data.map(r => r.category))].sort();
      const strengths = [...new Set(data.map(r => r.strength))].sort();
      console.log(`dict_action_verbs category values: ${JSON.stringify(cats)}`);
      console.log(`dict_action_verbs strength values: ${JSON.stringify(strengths)}`);
    }
  }

  // dict_ats_keywords: check weight
  {
    const { data } = await query('dict_ats_keywords', 'weight');
    if (data) {
      const weights = [...new Set(data.map(r => r.weight))].sort();
      console.log(`dict_ats_keywords weight values: ${JSON.stringify(weights)}`);
    }
  }

  // dict_linkedin_keywords: check priority
  {
    const { data } = await query('dict_linkedin_keywords', 'priority');
    if (data) {
      const priorities = [...new Set(data.map(r => r.priority))].sort();
      console.log(`dict_linkedin_keywords priority values: ${JSON.stringify(priorities)}`);
    }
  }

  // dict_bullet_patterns: check rank_tier
  {
    const { data } = await query('dict_bullet_patterns', 'rank_tier,category');
    if (data) {
      const tiers = [...new Set(data.map(r => r.rank_tier))].sort();
      const cats = [...new Set(data.map(r => r.category))].sort();
      console.log(`dict_bullet_patterns rank_tier values: ${JSON.stringify(tiers)}`);
      console.log(`dict_bullet_patterns category values: ${JSON.stringify(cats)}`);
    }
  }

  // dict_professional_summaries: check rank_tier
  {
    const { data } = await query('dict_professional_summaries', 'rank_tier');
    if (data) {
      const tiers = [...new Set(data.map(r => r.rank_tier))].sort();
      console.log(`dict_professional_summaries rank_tier values: ${JSON.stringify(tiers)}`);
    }
  }

  console.log('\n=== STEP 2: ALL VARCHAR columns in dict_* tables ===\n');

  // Query information_schema via PostgREST RPC — but we can't do raw SQL directly.
  // Instead, query each table for all rows and check max string lengths from existing data.
  const allTables = [
    'dict_mos_to_civilian', 'dict_military_jargon', 'dict_phrase_translations',
    'dict_eval_phrases', 'dict_action_verbs', 'dict_acronyms', 'dict_ats_keywords',
    'dict_professional_summaries', 'dict_bullet_patterns', 'dict_linkedin_keywords',
    'dict_cover_letter_templates',
  ];

  for (const table of allTables) {
    const { data, error } = await query(table, '*');
    if (error || !data || data.length === 0) continue;

    const maxLengths = {};
    for (const row of data) {
      for (const [col, val] of Object.entries(row)) {
        if (typeof val !== 'string') continue;
        if (!maxLengths[col] || val.length > maxLengths[col].len) {
          maxLengths[col] = { len: val.length, val: val.substring(0, 60) };
        }
      }
    }

    console.log(`${table} (${data.length} rows):`);
    for (const [col, info] of Object.entries(maxLengths)) {
      if (col === 'id' || col === 'created_at') continue;
      console.log(`  ${col}: max ${info.len} chars → "${info.val}"`);
    }
  }
}

main().catch(console.error);
