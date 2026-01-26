import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

// Service client for inserting analytics (bypasses RLS for anonymous visitors)
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple hash function for IP privacy
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + 'debriefed-salt').digest('hex').substring(0, 16)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, session_id, referrer, user_agent } = body

    if (!path || !session_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try to get user_id if logged in (use regular client for auth check)
    let user_id = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      user_id = user?.id || null
    } catch {
      // User not logged in, that's fine
    }

    // Get IP and hash it for privacy
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
    const ip_hash = hashIP(ip)

    // Insert page view using SERVICE CLIENT (bypasses RLS for anonymous visitors)
    const { error } = await serviceClient.from('page_views').insert({
      path,
      session_id,
      user_id,
      referrer: referrer || null,
      user_agent: user_agent || null,
      ip_hash,
    })

    if (error) {
      console.error('Page view insert error:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return NextResponse.json({ success: true }) // Don't expose errors
  }
}
