import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canUseFeature, incrementUsage, isAdmin, getUserEmail } from '@/lib/usage-service'
import type { FeatureName } from '@/lib/pricing-config'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, template, resume_type, content } = body

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    return NextResponse.json({ error: 'Name must be at least 3 characters' }, { status: 400 })
  }

  const type = resume_type === 'federal' ? 'federal' : 'private'
  const feature: FeatureName = type === 'federal' ? 'federal_resumes' : 'private_resumes'

  // Admin bypass
  const userEmail = await getUserEmail(user.id)
  if (!isAdmin(userEmail)) {
    const usageCheck = await canUseFeature(user.id, feature)
    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: usageCheck.reason || `Resume creation limit reached. Upgrade your plan for more.`,
        limitReached: true,
        remaining: usageCheck.remaining,
        limit: usageCheck.limit,
      }, { status: 403 })
    }
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      name: name.trim(),
      template: template || 'classic_professional',
      resume_type: type,
      content: content || {},
    })
    .select()
    .single()

  if (error) {
    console.error('Resume creation failed:', error)
    return NextResponse.json({ error: error.message || 'Failed to create resume' }, { status: 500 })
  }

  const response = NextResponse.json({ data })

  after(async () => {
    try {
      await incrementUsage(user.id, feature)
    } catch (err) {
      console.error(`Post-response usage increment failed (${feature}):`, err)
    }
  })

  return response
}
