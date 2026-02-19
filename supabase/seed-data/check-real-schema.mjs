#!/usr/bin/env node
/**
 * Connect to the REAL Supabase database and get actual column info
 * for every dictionary table. Uses the REST API directly.
 */

const SUPABASE_URL = 'https://zsnncxizrtcmzcuizexk.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzbm5jeGl6cnRjbXpjdWl6ZXhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU4NDQ4MCwiZXhwIjoyMDg0MTYwNDgwfQ.lKrMhxRzYDwOXgQaNRsUEzvjJRrPwq6BizxhcW7sqgk';

const tables = [
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

// Method 1: Use RPC to query information_schema for column details
async function getColumnDetails(table) {
  const query = `
    SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = '${table}'
    ORDER BY ordinal_position
  `;

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!resp.ok) {
    return null; // RPC not available, fallback below
  }
  return resp.json();
}

// Method 2: Fetch one row to see columns, and also check if table exists
async function getOneRow(table) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    return { error: `${resp.status}: ${text.substring(0, 200)}` };
  }
  return { data: await resp.json() };
}

// Method 3: Use PostgREST schema introspection (OPTIONS request)
async function getTableSchema(table) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'OPTIONS',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
  });

  // Check for definition header
  const def = resp.headers.get('content-profile');
  return { status: resp.status, headers: Object.fromEntries(resp.headers.entries()) };
}

// Method 4: Direct SQL via pg_catalog
async function getSchemaViaSQL() {
  // Use Supabase SQL endpoint (available with service role key)
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dict_schema`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });

  if (!resp.ok) return null;
  return resp.json();
}

async function main() {
  console.log('Connecting to Supabase...\n');

  for (const table of tables) {
    console.log(`=== ${table} ===`);

    const result = await getOneRow(table);

    if (result.error) {
      console.log(`  ERROR: ${result.error}`);
      continue;
    }

    if (result.data && result.data.length > 0) {
      const columns = Object.keys(result.data[0]);
      console.log(`  Columns (${columns.length}): ${columns.join(', ')}`);
      // Show value types/lengths for each column
      for (const col of columns) {
        const val = result.data[0][col];
        const type = val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val;
        const preview = val === null ? 'NULL' : typeof val === 'string' ? `"${val.substring(0, 60)}"` : JSON.stringify(val).substring(0, 60);
        console.log(`    ${col}: ${type} = ${preview}`);
      }
    } else {
      console.log(`  EMPTY TABLE (no rows to inspect)`);
      // Try to get column names from PostgREST definition
      const defResp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=0`, {
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'count=exact',
        },
      });
      const range = defResp.headers.get('content-range');
      console.log(`  Content-Range: ${range}`);

      // Try inserting a dummy to see what columns are expected (via error)
      const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({}),
      });
      const insertErr = await insertResp.text();
      console.log(`  Insert probe: ${insertErr.substring(0, 300)}`);
    }

    console.log('');
  }
}

main().catch(console.error);
