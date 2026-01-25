import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pre-check usage limits before processing
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, email')
      .eq('user_id', user.id)
      .single()

    const { data: usage } = await supabaseAdmin
      .from('usage')
      .select('ai_summaries')
      .eq('user_id', user.id)
      .single()

    // Admin bypass
    if (!userProfile?.email || !ADMIN_BYPASS_EMAILS.includes(userProfile.email)) {
      const rawTier = userProfile?.subscription_tier || 'free'
      const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
        rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

      const tierConfig = PRICING_TIERS[tier]
      const currentCount = usage?.ai_summaries || 0
      // Use elevator_pitch limit as a proxy for AI summaries (both are AI text generation)
      const limit = tierConfig.limits.elevator_pitch

      if (limit === 0) {
        return NextResponse.json({
          error: 'Summary enhancement is available for Core and Full subscribers. Upgrade to unlock this feature.',
          limitReached: true,
          paywalled: true,
          tier
        }, { status: 403 })
      }

      if (currentCount >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} AI generation${limit !== 1 ? 's' : ''}. ${tier === 'core' ? 'Upgrade to Full for more.' : 'Monthly limit reached.'}`,
          limitReached: true,
          tier
        }, { status: 403 })
      }
    }

    const { summary, profile } = await request.json()

    if (!summary) {
      return NextResponse.json({ error: 'Missing summary text' }, { status: 400 })
    }

    const prompt = `Refine this professional summary. Make it more compelling while keeping the same general message and length. Do not use clichés like "Results-driven" or "Detail-oriented professional." Keep military-to-civilian translations accurate.

CURRENT SUMMARY:
${summary}

CONTEXT:
- ${profile?.rank || 'Veteran'} in the ${profile?.branch || 'military'}
- ${profile?.yearsOfService || '10+'} years of service
- Rating/MOS: ${profile?.mos || 'N/A'}
- Target Role: ${profile?.targetRole || 'Not specified'}
- Target Industry: ${profile?.targetIndustry || 'Not specified'}

REQUIREMENTS:
1. Keep approximately the same length (2-4 sentences)
2. Use strong, active voice
3. Avoid clichés and buzzwords
4. Highlight leadership and transferable skills
5. Make it sound confident but not arrogant

Return ONLY the improved summary, nothing else.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    })

    const enhanced = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 400
    await logApiUsage(user.id, 'enhance-summary', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'ai_summaries')

    return NextResponse.json({ enhanced })
  } catch (error) {
    console.error('Enhancement error:', error)
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 })
  }
}
