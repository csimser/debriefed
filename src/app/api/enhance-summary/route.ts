import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
