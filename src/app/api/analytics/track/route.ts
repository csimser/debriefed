import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

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

    const supabase = await createClient()

    // Get user_id if logged in (optional)
    const { data: { user } } = await supabase.auth.getUser()
    const user_id = user?.id || null

    // Get IP and hash it for privacy
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
    const ip_hash = hashIP(ip)

    // Insert page view
    await supabase.from('page_views').insert({
      path,
      session_id,
      user_id,
      referrer: referrer || null,
      user_agent: user_agent || null,
      ip_hash,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return NextResponse.json({ success: true }) // Don't expose errors
  }
}
