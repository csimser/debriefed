import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { incrementUsage } from '@/lib/usage-service'
import type { FeatureName } from '@/lib/pricing-config'

const ALLOWED_FEATURES: Set<string> = new Set([
  'cover_letters',
  'job_match_analysis',
  'linkedin_profile_analysis',
])

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { feature } = await request.json()

    if (!feature || !ALLOWED_FEATURES.has(feature)) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 })
    }

    await incrementUsage(user.id, feature as FeatureName)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[track-usage] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
