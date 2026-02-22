import { NextRequest, NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage } from '@/lib/usage-tracking'
import { canUseFeature, incrementUsage, isAdmin, getUserEmail } from '@/lib/usage-service'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { translateTerm } from '@/lib/debriefed-token-saver/termLookup'
import { callWithEscalation, getModelString } from '@/lib/ai-model'
import { captureFullTextOutput, type CaptureContext } from '@/lib/ai-translation-capture'

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
      .select('subscription_tier, email, rating_mos, branch')
      .eq('user_id', user.id)
      .single()

    // Admin bypass using centralized isAdmin check (handles case normalization)
    const userEmail = await getUserEmail(user.id)
    if (!isAdmin(userEmail)) {
      const usageCheck = await canUseFeature(user.id, 'ai_summaries')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.reason || 'AI summary limit reached. Upgrade your plan for more.',
          limitReached: true,
        }, { status: 403 })
      }
    }

    const { summary, profile } = await request.json()

    if (!summary) {
      return NextResponse.json({ error: 'Missing summary text' }, { status: 400 })
    }

    // Build crosswalk context from local data (no AI call needed)
    let crosswalkContext = ''
    const mosCode = profile?.mos || userProfile?.rating_mos
    const branchName = profile?.branch || userProfile?.branch
    if (mosCode) {
      const localResult = getCivilianJobs(mosCode, branchName)
      if (localResult) {
        crosswalkContext = `\nCivilian Role Context: ${mosCode} maps to ${localResult.civilian_titles.join(', ')} (Industries: ${localResult.industries?.join(', ') || 'Various'}). Use these civilian titles as reference for appropriate terminology.`
      }
    }

    // Pre-translate known military terms in the summary
    const knownTranslations: string[] = []
    const words = summary.split(/\s+/)
    for (const word of words) {
      const cleaned = word.replace(/[^a-zA-Z0-9/-]/g, '')
      if (cleaned.length >= 2) {
        const translation = translateTerm(cleaned)
        if (translation) {
          knownTranslations.push(`"${cleaned}" → "${translation}"`)
        }
      }
    }
    const termContext = knownTranslations.length > 0
      ? `\nKnown translations (apply these): ${knownTranslations.join(', ')}`
      : ''

    // Check if targeting defense/government industry
    const targetIndustry = profile?.targetIndustry || 'Not specified'
    const isDefenseIndustry = targetIndustry.toLowerCase().includes('defense') ||
      targetIndustry.toLowerCase().includes('government') ||
      targetIndustry.toLowerCase().includes('federal') ||
      targetIndustry.toLowerCase().includes('contractor') ||
      targetIndustry.toLowerCase().includes('dod')

    // Build industry-specific guidance
    let industryGuidance = ''
    if (isDefenseIndustry) {
      industryGuidance = `
DEFENSE/GOVERNMENT INDUSTRY EXCEPTION:
Since the target industry is ${targetIndustry}, military terminology IS acceptable.
You may use military ranks, branch names, and service-related language.
Emphasize: clearance level, defense programs, government contracting experience, mission accomplishment.`
    } else {
      industryGuidance = `
MILITARY-TO-CIVILIAN TRANSLATION RULES (MANDATORY):
The target industry is "${targetIndustry}" - write as if the person has always worked in this industry.
- NEVER use military ranks (Petty Officer, Sergeant, Chief, etc.) — translate to civilian equivalents like "Senior Operations Leader", "Team Supervisor", "Department Manager"
- NEVER use military terms like "deployment", "command", "MOS", "rating", "enlisted", "commissioned", "watch", "underway"
- NEVER mention military branch names (U.S. Navy, Army, etc.)
- ALWAYS translate to civilian equivalents:
  * Military ranks → "Senior Leader", "Operations Manager", "Team Lead"
  * "Led a division of sailors/soldiers/airmen" → "Led a team of employees" or "Led a team of professionals"
  * "20 years naval service" → "20 years of experience"
  * "deployment" → "field assignment" or "operational period"
  * "command" → "organization" or "department"

INDUSTRY-SPECIFIC KEYWORDS for ${targetIndustry}:
- Use terminology and keywords that hiring managers in ${targetIndustry} expect to see
- Frame all experience in terms relevant to ${targetIndustry}`
    }

    const prompt = `Refine this professional summary for someone targeting: ${targetIndustry}

CURRENT SUMMARY:
${summary}

CONTEXT:
- Years of experience: ${profile?.yearsOfService || '10+'}
- Target Role: ${profile?.targetRole || 'Not specified'}
- Target Industry: ${targetIndustry}
${crosswalkContext}${termContext}
${industryGuidance}

REQUIREMENTS:
1. Keep approximately the same length (2-4 sentences)
2. Use strong, active voice
3. Avoid clichés and buzzwords like "Results-driven" or "Detail-oriented professional"
4. Highlight leadership and transferable skills
5. Make it sound confident but not arrogant
6. Use industry-specific keywords for ${targetIndustry}

Return ONLY the improved summary, nothing else.`

    const { response, model_used } = await callWithEscalation(
      anthropic,
      {
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      },
      { expectsJson: false }
    )

    const enhanced = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 400

    // Return response to client first, then track usage
    const jsonResponse = NextResponse.json({ enhanced, model_used })

    after(async () => {
      try {
        await logApiUsage(user.id, 'enhance-summary', tokensUsed, getModelString(model_used))
        if (enhanced && enhanced.trim().length > 10) {
          await incrementUsage(user.id, 'ai_summaries')
        }
        // Capture for dictionary pipeline
        const captureCtx: CaptureContext = {
          userId: user.id,
          branch: userProfile?.branch || undefined,
          targetIndustry: targetIndustry || undefined,
          targetRole: profile?.targetRole || undefined,
          modelUsed: model_used,
        }
        captureFullTextOutput(
          'summary_generation',
          `Summary for ${targetIndustry || 'general'}`,
          enhanced,
          captureCtx
        )
      } catch (err) {
        console.error('Post-response usage tracking failed:', err)
      }
    })

    return jsonResponse
  } catch (error) {
    console.error('Enhancement error:', error)
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 })
  }
}
