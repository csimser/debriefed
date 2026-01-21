import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildSystemPrompt(): string {
  return `You write elevator pitches that sound like actual humans talking - not AI, not corporate robots, not LinkedIn influencers.

BANNED PHRASES - NEVER USE THESE:
- "I turn [X] into [Y]" or any variation
- "chaos into systems" / "systems into results"
- "what really drives me"
- "big picture" / "moving parts" / "the weeds"
- "passionate about"
- "results-driven" / "detail-oriented" / "team player"
- "leverage my experience"
- "hit the ground running"
- "make an impact"
- "bring value"
- "strategic thinker"
- "proven track record"
- "unique combination of skills"
- Any sentence starting with "What really..." or "I'm particularly proud of..."
- "challenging projects" / "complex operations"
- "honed my skills"
- "synergy" / "cutting-edge" / "game-changer" / "revolutionize"
- "world-class" / "best-in-class"

STRUCTURE RULES:
1. Start with WHO YOU ARE in plain language (name, current situation in 5-10 words max)
2. ONE concrete achievement with a specific number - just state it, don't frame it
3. What you're looking for - be direct
4. If call-to-action requested: Ask ONE specific question

BAD EXAMPLE (what NOT to write):
"I turn chaos into systems and systems into results. After 20 years as a Navy Senior Chief, I'm transitioning into program management where I can apply the strategic planning and leadership skills I've honed managing complex operations. In the Navy, I led a 30-person team through comprehensive training programs with a 100% pass rate, and I'm particularly proud of implementing process improvements that cut project timelines from 490 days down to 86 days..."

WHY IT'S BAD:
- Opens with a cliché
- "honed" is corporate speak
- "I'm particularly proud of" is filler
- Too many qualifiers and setup
- Doesn't sound like anyone actually talks

GOOD EXAMPLE (what TO write):
"I'm Chris - 20 years in the Navy, now moving into program management. Last year I cut a 490-day process down to 86 days by rebuilding how my team tracked milestones. That's the kind of thing I want to do full-time. What does your company's PM team structure look like?"

WHY IT'S GOOD:
- Plain language intro
- Achievement stated directly without preamble
- Clear ask
- Sounds like a real person
- Under 60 words

TONE GUIDANCE:
- Read it out loud - would a normal person say this?
- If it sounds like a LinkedIn post, rewrite it
- Short sentences. Contractions. Natural pauses.
- One impressive number is better than three mediocre ones
- Don't explain WHY you're good - just show it with a fact`
}

function categorizeAchievements(experiences: any[], profile: any): Record<string, any[]> {
  const allBullets = experiences?.flatMap(exp =>
    exp.bullets?.map((b: any) => ({
      text: b.translated_text || b.original_text || '',
      company: exp.company,
      title: exp.title
    })) || []
  ) || []

  const categories: Record<string, any[]> = {
    efficiency: [],
    leadership: [],
    training: [],
    technical: [],
    entrepreneurship: [],
    scope: []
  }

  allBullets.forEach(bullet => {
    const text = bullet.text.toLowerCase()

    // Efficiency: timeline reductions, cost savings, process improvements
    if (/reduced|cut|decreased|saved|improved|from \d+ to \d+|streamlined|eliminated/i.test(text) &&
        /days?|hours?|time|cost|\$|percent|%/i.test(text)) {
      categories.efficiency.push(bullet)
    }

    // Leadership: team management, supervision, mentoring
    if (/led|managed|supervised|mentored|coached|directed|oversaw/i.test(text) &&
        /team|personnel|people|staff|members|sailors|employees/i.test(text)) {
      categories.leadership.push(bullet)
    }

    // Training: pass rates, certifications earned, programs developed
    if (/trained|training|certification|qualified|pass rate|graduated|program|curriculum/i.test(text)) {
      categories.training.push(bullet)
    }

    // Technical: systems, tools, implementations
    if (/implemented|deployed|built|developed|designed|configured|system|software|database/i.test(text)) {
      categories.technical.push(bullet)
    }

    // Scope: budget, scale, large numbers
    if (/\$\d+|\d+\s*million|\d+\s*budget|operations|multi-/i.test(text)) {
      categories.scope.push(bullet)
    }
  })

  // Entrepreneurship: from side_business if available
  if (profile?.side_business) {
    categories.entrepreneurship.push({
      text: `Owns and operates ${profile.side_business}`,
      company: profile.side_business,
      title: 'Owner'
    })
  }

  return categories
}

function buildUserPrompt(params: {
  targetRole: string
  targetIndustry: string
  duration: string
  context: string
  tone: string
  achievementAngle: string
  includeCallToAction: boolean
  mentionVeteranStatus: boolean
  profile: any
  experiences: any[]
  certifications: any[]
  skills: any[]
}): string {
  const {
    targetRole,
    targetIndustry,
    duration,
    context,
    tone,
    achievementAngle,
    includeCallToAction,
    mentionVeteranStatus,
    profile,
    experiences,
    certifications,
    skills
  } = params

  // Strict word limits
  const wordLimits: Record<string, { min: number; max: number }> = {
    '30': { min: 50, max: 75 },
    '60': { min: 100, max: 130 },
    'networking': { min: 80, max: 110 }
  }

  const limits = wordLimits[duration] || { min: 50, max: 75 }

  // Context templates - these are structural guides
  const contextTemplates: Record<string, string> = {
    'career-fair': `STRUCTURE FOR CAREER FAIR:
1. "[Name] - [background in 5 words]"
2. "[One achievement with number]"
3. "Looking for [specific role type]"
4. [If CTA: "What roles are you hiring for?"]`,

    'networking': `STRUCTURE FOR NETWORKING:
1. Casual intro with name
2. What you did (one specific thing)
3. What you're exploring now
4. [If CTA: Open-ended question about THEM]`,

    'interview-intro': `STRUCTURE FOR "TELL ME ABOUT YOURSELF":
1. Current situation (transitioning from X)
2. One achievement that's relevant to THIS job
3. Why this role/company interests you
4. [No CTA needed - they'll ask follow-ups]`,

    'linkedin-connect': `STRUCTURE FOR LINKEDIN:
1. One sentence: who you are + why reaching out
2. One specific thing you noticed about them/their work
3. Clear ask (coffee chat, advice, introduction)
Keep under 50 words.`,

    'informational': `STRUCTURE FOR INFORMATIONAL INTERVIEW:
1. Brief background (you're learning, not selling)
2. Why you're interested in their field
3. [CTA: Specific question about their career path]`
  }

  // Tone modifiers - affect word choice, not structure
  const toneModifiers: Record<string, string> = {
    'confident': 'Use declarative statements. No hedging ("I think", "kind of", "maybe"). State facts.',
    'conversational': 'Use contractions. Shorter sentences. OK to use "honestly" or "look" as transitions.',
    'formal': 'Slightly longer sentences. No slang. But still sound human, not robotic.',
    'enthusiastic': 'Can show energy but NOT through exclamation points or "passionate". Show it through specific details you find interesting.'
  }

  // Get first name for natural speech
  const firstName = profile?.first_name || 'I'

  // Categorize achievements by angle type
  const achievementsByCategory = categorizeAchievements(experiences, profile)

  // Get achievements for selected angle
  const selectedAchievements = achievementsByCategory[achievementAngle] || []

  // Fallback to any achievement with numbers if selected category is empty
  const fallbackAchievements = experiences?.flatMap(exp =>
    exp.bullets?.filter((b: any) => {
      const text = b.translated_text || b.original_text || ''
      return /\d+%|\d+\s*(days?|people|team|million|percent)/i.test(text)
    }).map((b: any) => ({
      text: b.translated_text || b.original_text,
      company: exp.company,
      title: exp.title
    }))
  ).filter(Boolean) || []

  // Choose which achievements to use
  const achievementsToUse = selectedAchievements.length > 0
    ? selectedAchievements.slice(0, 3)
    : fallbackAchievements.slice(0, 3)

  // Angle-specific instructions
  const angleInstructions: Record<string, string> = {
    'efficiency': 'Focus on a PROCESS IMPROVEMENT achievement - timeline reductions, cost savings, or efficiency gains. Lead with the before/after numbers.',
    'leadership': 'Focus on a TEAM LEADERSHIP achievement - how many people you led, developed, or mentored. Emphasize the human element.',
    'training': 'Focus on a TRAINING achievement - pass rates, programs you built, or people you qualified. Show you can develop others.',
    'technical': 'Focus on a TECHNICAL achievement - systems you built or implemented, tools you mastered. Show technical competence.',
    'entrepreneurship': 'Focus on your BUSINESS OWNERSHIP experience - what you built, revenue generated, or problems you solved as an owner.',
    'scope': 'Focus on the SCALE of your operations - budget managed, operations overseen, or scope of responsibility. Show you can handle big things.'
  }

  // Key credentials (only mention impressive ones)
  const notableCreds = certifications?.filter((c: any) =>
    /PMP|MBA|CPA|PE|CISSP|Six Sigma|Scrum/i.test(c.name || '')
  ).map((c: any) => c.name) || []

  // Build "DO NOT use" list from other categories
  const otherCategoryAchievements = Object.keys(achievementsByCategory)
    .filter(k => k !== achievementAngle)
    .map(k => achievementsByCategory[k][0]?.text?.slice(0, 50))
    .filter(Boolean)
    .join(', ')

  return `Write an elevator pitch. STRICT REQUIREMENTS:

PERSON:
- Name: ${firstName}
- Background: ${profile?.rank || 'Veteran'}, ${profile?.years_of_service || '20'} years, ${profile?.branch || 'military'}
- Target: ${targetRole}${targetIndustry ? ` in ${targetIndustry}` : ''}
- Notable credentials: ${[...notableCreds].join(', ') || 'None to highlight'}
${profile?.side_business ? `- Side Business: ${profile.side_business}` : ''}

ACHIEVEMENT ANGLE: ${achievementAngle.toUpperCase()}
${angleInstructions[achievementAngle] || ''}

ACHIEVEMENTS FOR THIS ANGLE (use ONE of these):
${achievementsToUse.length > 0
    ? achievementsToUse.map((a: any, i: number) => `${i + 1}. ${a.text}`).join('\n')
    : '- No specific achievements found for this angle - create a general statement'}

${otherCategoryAchievements ? `DO NOT use achievements about: ${otherCategoryAchievements}` : ''}

PARAMETERS:
- Length: ${limits.min}-${limits.max} words MAXIMUM. Count them.
- Context: ${context}
- Tone: ${tone} - ${toneModifiers[tone] || ''}
- Mention military/veteran: ${mentionVeteranStatus ? 'Yes, briefly' : 'No'}
- End with call-to-action: ${includeCallToAction ? 'Yes - ONE question' : 'No'}

${contextTemplates[context] || ''}

FINAL CHECKS BEFORE OUTPUTTING:
□ Does it highlight a ${achievementAngle.toUpperCase()} achievement specifically?
□ Does it sound like someone talking, not writing?
□ Is it under ${limits.max} words?
□ Did you avoid ALL banned phrases from the system prompt?
□ Would you actually say this out loud without cringing?
□ If there's a question at the end, is it about THEM, not you?

Output ONLY the pitch. No quotes. No labels. No word count.`
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
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
      .select('ai_summaries')
      .eq('user_id', user.id)
      .single()

    // Admin bypass
    if (!profile?.email || !ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      const rawTier = profile?.subscription_tier || 'free'
      const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
        rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

      const tierConfig = PRICING_TIERS[tier]
      const currentCount = usage?.ai_summaries || 0
      const limit = tierConfig.limits.elevator_pitch

      if (currentCount >= limit) {
        // Free tier: elevator pitch is paywalled (limit is 0)
        if (limit === 0) {
          return NextResponse.json({
            error: 'Elevator pitch is available for Core and Full subscribers. Upgrade to unlock this feature.',
            limitReached: true,
            paywalled: true,
            tier
          }, { status: 403 })
        }

        return NextResponse.json({
          error: `You've used all ${limit} elevator pitch${limit !== 1 ? 'es' : ''}. ${tier === 'core' ? 'Upgrade to Full for more.' : 'Monthly limit reached.'}`,
          limitReached: true,
          tier
        }, { status: 403 })
      }
    }

    const body = await request.json()
    const {
      targetRole,
      targetIndustry,
      duration,
      context,
      tone,
      achievementAngle,
      includeCallToAction,
      mentionVeteranStatus,
      profileData
    } = body

    if (!targetRole) {
      return NextResponse.json({ error: 'Target role is required' }, { status: 400 })
    }

    const { profile: userProfile, experiences, certifications, skills } = profileData || {}

    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt({
      targetRole,
      targetIndustry: targetIndustry || '',
      duration: duration || '30',
      context: context || 'career-fair',
      tone: tone || 'confident',
      achievementAngle: achievementAngle || 'efficiency',
      includeCallToAction: includeCallToAction !== false,
      mentionVeteranStatus: mentionVeteranStatus !== false,
      profile: userProfile || {},
      experiences: experiences || [],
      certifications: certifications || [],
      skills: skills || []
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const pitch = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    // Log for debugging
    console.log('Elevator pitch generation:', {
      targetRole,
      duration,
      context,
      tone,
      achievementAngle,
      wordCount: pitch.split(/\s+/).filter(Boolean).length,
    })

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 500
    await logApiUsage(user.id, 'elevator-pitch', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'ai_summaries')

    return NextResponse.json({ pitch })
  } catch (error: any) {
    console.error('Elevator pitch generation error:', error)
    return NextResponse.json({
      error: 'Failed to generate pitch: ' + (error.message || 'Unknown error')
    }, { status: 500 })
  }
}
