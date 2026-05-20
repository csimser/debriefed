import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Ensure analytics_events table exists (runs once per cold start)
let tableChecked = false
async function ensureTable() {
  if (tableChecked) return
  await serviceClient.rpc('exec_sql', {
    sql: `CREATE TABLE IF NOT EXISTS analytics_events (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid,
      event text NOT NULL,
      properties jsonb DEFAULT '{}',
      created_at timestamptz DEFAULT now()
    )`
  }).catch(() => {
    // If exec_sql RPC doesn't exist, try direct insert — table may already exist
  })
  tableChecked = true
}

export async function POST(req: NextRequest) {
  try {
    const { event, properties, timestamp } = await req.json()
    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 })
    }

    await ensureTable()

    // Get user ID if authenticated (optional — anonymous events are fine)
    let userId: string | null = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch {
      // Anonymous event
    }

    await serviceClient.from('analytics_events').insert({
      user_id: userId,
      event,
      properties: { ...properties, client_timestamp: timestamp },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // Never fail client-side
  }
}
