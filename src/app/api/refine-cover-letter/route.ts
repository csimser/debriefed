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

/**
 * Post-process cover letter to remove any AI patterns that slipped through
 */
function cleanCoverLetter(text: string): string {
  let cleaned = text

  // Remove em dashes and replace with appropriate punctuation
  cleaned = cleaned.replace(/—/g, ', ')
  cleaned = cleaned.replace(/–/g, ', ')

  // Remove double spaces
  cleaned = cleaned.replace(/  +/g, ' ')

  // Fix common AI phrases (backup check)
  const aiPhrases: Array<{ find: RegExp; replace: string }> = [
    { find: /I'm excited to/gi, replace: "I'm applying to" },
    { find: /I am excited to/gi, replace: "I am applying to" },
    { find: /I'm thrilled to/gi, replace: "I'm writing to" },
    { find: /aligns perfectly with/gi, replace: "matches" },
    { find: /aligns well with/gi, replace: "matches" },
    { find: /aligns with/gi, replace: "matches" },
    { find: /particularly resonates/gi, replace: "fits" },
    { find: /resonates with me/gi, replace: "interests me" },
    { find: /proven track record/gi, replace: "experience" },
    { find: /I'm confident that/gi, replace: "I believe" },
    { find: /I am confident that/gi, replace: "I believe" },
    { find: /I would welcome the opportunity/gi, replace: "I'd like" },
    { find: /showcases my ability/gi, replace: "shows I can" },
    { find: /demonstrates my/gi, replace: "shows my" },
    { find: /leverage my experience/gi, replace: "use my experience" },
    { find: /leverage my skills/gi, replace: "use my skills" },
    { find: /hit the ground running/gi, replace: "start contributing quickly" },
    { find: /dynamic environment/gi, replace: "workplace" },
    { find: /fast-paced environment/gi, replace: "busy workplace" },
    { find: /fast-paced/gi, replace: "busy" },
    { find: /^Furthermore,\s*/gim, replace: "" },
    { find: /^Moreover,\s*/gim, replace: "" },
    { find: /^Additionally,\s*/gim, replace: "" },
    { find: /passionate about/gi, replace: "interested in" },
    { find: /my passion for/gi, replace: "my interest in" },
    { find: /makes me an ideal candidate/gi, replace: "fits my background" },
    { find: /ideal candidate/gi, replace: "good fit" },
    { find: /unique opportunity/gi, replace: "opportunity" },
    { find: /invaluable experience/gi, replace: "useful experience" },
    { find: /contribute to your team's success/gi, replace: "help the team" },
    { find: /I would be honored/gi, replace: "I'd like" },
    { find: /I am eager to/gi, replace: "I want to" },
    { find: /I'm eager to/gi, replace: "I want to" },
  ]

  aiPhrases.forEach(({ find, replace }) => {
    cleaned = cleaned.replace(find, replace)
  })

  // Clean up any resulting double spaces or punctuation issues
  cleaned = cleaned.replace(/  +/g, ' ')
  cleaned = cleaned.replace(/,\s*,/g, ',')
  cleaned = cleaned.replace(/\.\s*,/g, '.')

  return cleaned.trim()
}

/**
 * Validate cover letter quality and flag issues
 */
function validateCoverLetter(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  if (text.includes('—') || text.includes('–')) {
    issues.push('Contains em/en dashes')
  }
  if (text.length > 2500) {
    issues.push('Too long (over ~500 words)')
  }
  if (/excited to apply/i.test(text)) {
    issues.push('Contains "excited to apply"')
  }
  if (/passionate about/i.test(text)) {
    issues.push('Contains "passionate about"')
  }
  if (/proven track record/i.test(text)) {
    issues.push('Contains "proven track record"')
  }
  if (/aligns (perfectly |well )?with/i.test(text)) {
    issues.push('Contains "aligns with" phrase')
  }

  // Check for too many sentences starting with "I"
  const sentences = text.split(/[.!?]+/)
  const iStarts = sentences.filter(s => s.trim().match(/^I\s/)).length
  if (iStarts > 5) {
    issues.push(`Too many sentences starting with "I" (${iStarts})`)
  }

  return {
    valid: issues.length === 0,
    issues
  }
}

const REFINE_SYSTEM_PROMPT = `You are a cover letter editor. You refine existing cover letters to make them better while maintaining their core message and the applicant's voice.

CRITICAL RULES - NEVER use these phrases:
- Em dashes (—) - use commas or periods instead
- "I'm excited to..." or "I'm thrilled to..."
- "...aligns perfectly with..." or "...aligns with..."
- "passionate about", "proven track record", "I'm confident"
- "ideal candidate", "would welcome the opportunity"
- "leverage my experience", "hit the ground running"
- "dynamic environment", "fast-paced"
- Starting paragraphs with "Additionally," "Furthermore," or "Moreover,"

Keep the same structure, greeting, and sign-off unless specifically asked to change them.
Output only the refined cover letter, no explanation or commentary.`

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Pre-check usage limits before processing
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, email')
      .eq('user_id', user.id)
      .single()

    const { data: usage } = await supabaseAdmin
      .from('usage')
      .select('cover_letters')
      .eq('user_id', user.id)
      .single()

    // Admin bypass
    if (!profile?.email || !ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      const rawTier = profile?.subscription_tier || 'free'
      const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
        rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

      const tierConfig = PRICING_TIERS[tier]
      const currentCount = usage?.cover_letters || 0
      const limit = tierConfig.limits.cover_letters

      if (currentCount >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} cover letter${limit !== 1 ? 's' : ''}. ${tier === 'free' ? 'Upgrade to Core for more.' : tier === 'core' ? 'Upgrade to Full for more.' : 'Monthly limit reached.'}`,
          limitReached: true,
          tier
        }, { status: 403 })
      }
    }

    const { action, currentLetter, jobTitle, companyName } = await request.json()

    if (!currentLetter || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Refining cover letter:', { action, letterLength: currentLetter.length })

    // Build the refinement prompt based on action
    const refinementPrompts: Record<string, string> = {
      shorter: `Take this cover letter and cut it down by 30-40%. Remove any sentence that doesn't directly prove qualification for the role. Keep the strongest points only. Maintain the greeting and sign-off.

Current cover letter:
${currentLetter}

Output the shortened version:`,

      stronger: `Rewrite ONLY the opening paragraph of this cover letter to be more compelling. Lead with the most impressive specific achievement mentioned in the letter. Make it impossible to stop reading. Keep everything else the same.

Current cover letter:
${currentLetter}

Output the full letter with the improved opening:`,

      numbers: `Add more specific numbers, percentages, dollar amounts, and timeframes to this cover letter. Replace vague claims with quantified results. If achievements don't have numbers, add realistic-sounding specifics based on the context (e.g., "managed a team" becomes "managed a team of 12"). Keep the same structure.

Current cover letter:
${currentLetter}

Output the version with more numbers:`,
    }

    const prompt = refinementPrompts[action]
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    let response
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: REFINE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      })
    } catch (apiError: any) {
      console.error('Anthropic API error:', apiError.message)
      if (apiError.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please wait and try again.' }, { status: 429 })
      }
      throw apiError
    }

    const textContent = response.content[0]
    if (textContent.type !== 'text') {
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }

    let refined = textContent.text.trim()

    // Post-process to catch any AI patterns
    refined = cleanCoverLetter(refined)

    // Validate the result
    const validation = validateCoverLetter(refined)

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 1000
    await logApiUsage(user.id, 'refine-cover-letter', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'cover_letters')

    console.log('Cover letter refined successfully')

    return NextResponse.json({
      refined,
      validationIssues: validation.issues.length > 0 ? validation.issues : undefined
    })
  } catch (error: any) {
    console.error('Cover letter refinement error:', error.message)
    return NextResponse.json({
      error: `Failed to refine cover letter: ${error.message || 'Unknown error'}`
    }, { status: 500 })
  }
}
