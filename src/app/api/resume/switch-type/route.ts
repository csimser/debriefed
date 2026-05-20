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

  const { resumeId, newType } = await request.json()

  if (!resumeId || !newType || !['private', 'federal'].includes(newType)) {
    return NextResponse.json({ error: 'Invalid resumeId or newType' }, { status: 400 })
  }

  // Fetch the current resume to check ownership and current type
  const { data: resume, error: fetchError } = await supabase
    .from('resumes')
    .select('id, user_id, resume_type')
    .eq('id', resumeId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // If type isn't changing, no limit check needed
  if (resume.resume_type === newType) {
    return NextResponse.json({ ok: true })
  }

  const targetFeature: FeatureName = newType === 'federal' ? 'federal_resumes' : 'private_resumes'

  // Admin bypass
  const userEmail = await getUserEmail(user.id)
  if (!isAdmin(userEmail)) {
    const usageCheck = await canUseFeature(user.id, targetFeature)
    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: usageCheck.reason || `You've reached your ${newType} resume limit. Upgrade for more.`,
        limitReached: true,
        remaining: usageCheck.remaining,
        limit: usageCheck.limit,
      }, { status: 403 })
    }
  }

  // Update the resume type
  const { error: updateError } = await supabase
    .from('resumes')
    .update({ resume_type: newType, updated_at: new Date().toISOString() })
    .eq('id', resumeId)

  if (updateError) {
    console.error('Resume type switch failed:', updateError)
    return NextResponse.json({ error: 'Failed to switch resume type' }, { status: 500 })
  }

  const response = NextResponse.json({ ok: true })

  after(async () => {
    try {
      await incrementUsage(user.id, targetFeature)
    } catch (err) {
      console.error(`Post-response usage increment failed (${targetFeature}):`, err)
    }
  })

  return response
}
