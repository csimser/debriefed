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

// Post-generation cleanup to catch AI patterns (preserves paragraph breaks)
function cleanLinkedInContent(text: string): string {
  let cleaned = text

  // Remove bullet points and their formatting
  cleaned = cleaned.replace(/^[\s]*[•\-\*]\s*/gm, '')

  // Remove common AI phrases
  const aiPhrases = [
    /I transform [^.]+\./gi,
    /results-driven/gi,
    /passionate about/gi,
    /leverage my/gi,
    /track record speaks/gi,
    /unique combination/gi,
    /proven ability to/gi,
    /I bring a unique/gi,
    /revolutionize/gi,
    /game-?changer/gi,
    /synergy/gi,
    /cutting-?edge/gi,
    /best-in-class/gi,
    /world-?class/gi,
    /I'd welcome the opportunity to/gi,
    /contribute to your organization's success/gi,
    /excited about the possibility/gi,
    /would be honored to/gi,
  ]

  aiPhrases.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '')
  })

  // Clean up double spaces (but preserve newlines)
  cleaned = cleaned.replace(/ {2,}/g, ' ')

  // Clean up spaces around newlines
  cleaned = cleaned.replace(/ *\n */g, '\n')

  // Remove any trailing incomplete sentences
  const trimmed = cleaned.trim()
  if (trimmed.endsWith(',') || trimmed.endsWith(' and') || trimmed.endsWith(' or')) {
    const lastPeriod = trimmed.lastIndexOf('.')
    if (lastPeriod > 0) {
      return trimmed.slice(0, lastPeriod + 1)
    }
  }

  return trimmed
}

// Ensure proper paragraph formatting
function formatAboutSection(text: string): string {
  // If already has paragraph breaks, clean them up
  if (text.includes('\n\n')) {
    return text
      .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines
      .trim()
  }

  // If it's one long paragraph, try to split it intelligently
  const sentences = text.split(/(?<=[.!?])\s+/)

  if (sentences.length >= 6) {
    // Group into 3 paragraphs
    const para1 = sentences.slice(0, 2).join(' ')
    const para2 = sentences.slice(2, -2).join(' ')
    const para3 = sentences.slice(-2).join(' ')
    return `${para1}\n\n${para2}\n\n${para3}`
  }

  return text.trim()
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pre-check usage limits before processing
    const { data: dbProfile } = await supabaseAdmin
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
    if (!dbProfile?.email || !ADMIN_BYPASS_EMAILS.includes(dbProfile.email)) {
      const rawTier = dbProfile?.subscription_tier || 'free'
      const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
        rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

      const tierConfig = PRICING_TIERS[tier]
      const currentCount = usage?.ai_summaries || 0
      // Use elevator_pitch limit as a proxy for LinkedIn content generation
      const limit = tierConfig.limits.elevator_pitch

      if (limit === 0) {
        return NextResponse.json({
          error: 'LinkedIn content generation is available for Core and Full subscribers. Upgrade to unlock this feature.',
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

    const {
      targetRole,
      userProfile,
      experiences,
      skills,
      certifications,
      education,
      // Refinement options
      tone = 'professional',
      aboutLength = 'standard',
      emphasis = [],
      regenerateOnly,
    } = await request.json()

    const rank = userProfile?.rank || 'Senior military leader'
    const years = userProfile?.years_of_service || '20'
    const branch = userProfile?.branch || 'Military'

    // Extract certifications
    const certList = certifications?.map((c: any) => c.name || c).filter(Boolean) || []
    const certString = certList.length > 0 ? certList.join(', ') : 'None listed'

    // Extract education with full details
    const eduList = education?.map((e: any) => {
      const degreeType = e.degree_type === 'master' ? "Master's" :
                         e.degree_type === 'bachelor' ? "Bachelor's" :
                         e.degree_type === 'associate' ? "Associate's" :
                         e.degree_type || 'Degree'
      const field = e.field_of_study || ''
      return field ? `${degreeType} in ${field}` : degreeType
    }).filter(Boolean) || []
    const eduString = eduList.length > 0 ? eduList.join(', ') : 'Not specified'

    // Extract experience bullets
    const experienceBullets = experiences?.flatMap((exp: any) =>
      exp.bullets?.map((b: any) => b.translated_text || b.original_text) || []
    ) || []

    const experienceCount = experiences?.length || 0
    const hasLimitedData = experienceCount < 2 || experienceBullets.length < 3

    // Format experience for prompt
    const experienceText = experiences?.map((exp: any) => `
${exp.title || 'Role'} at ${exp.company || 'Organization'}:
${exp.bullets?.map((b: any) => b.translated_text || b.original_text).join('; ') || 'No specific achievements listed'}
`).join('\n') || 'Limited experience data'

    // Tone instructions
    const toneInstructions: Record<string, string> = {
      professional: 'Write in a polished, corporate-appropriate tone. Sound confident but not arrogant.',
      conversational: 'Write in a warm, approachable tone. Use contractions. Sound human and relatable.',
      bold: 'Write in a direct, confident tone. Short punchy sentences. No fluff. Get to the point.',
    }

    // Length instructions
    const lengthInstructions: Record<string, string> = {
      concise: 'Keep the About section under 150 words. Be brief and impactful. 3 short paragraphs.',
      standard: 'Target 200-250 words for the About section. 3 well-developed paragraphs.',
      detailed: 'Write a comprehensive About section of 300-350 words with more context. 3 substantial paragraphs.',
    }

    // Emphasis instructions
    const emphasisText = emphasis.length > 0
      ? `EMPHASIZE these aspects in the content: ${emphasis.join(', ')}`
      : ''

    let headline = ''
    let summary = ''

    // Generate headline if needed
    if (!regenerateOnly || regenerateOnly === 'headline') {
      const headlinePrompt = `Create a LinkedIn headline for someone targeting: ${targetRole}

THEIR DATA:
- Rank/Title: ${rank}
- Years: ${years} years experience
- Branch: ${branch}
- Certifications: ${certString}
- Education: ${eduString}
- Experience entries: ${experienceCount}

RULES:
- Max 220 characters
- Include their ACTUAL credentials (PMP, MBA, etc.) - don't skip these if they have them
- Include "Veteran" since they're transitioning
- NO made-up percentages or vague metrics like "100% success" or "driving results"
- NO buzzwords: "transforming", "driving", "passionate", "results-driven", "leveraging"
- Format: [Target Role] | [Real Credential if any] | [Specialty] | Veteran

${toneInstructions[tone] || ''}

GOOD EXAMPLES:
"Operations Manager | PMP | MBA | 20 Years Leading High-Stakes Programs | Military Veteran"
"Program Manager | PMP Certified | Process Improvement & Team Development | Navy Veteran"
"Senior Operations Leader | MBA | Building Teams That Deliver Under Pressure | Veteran"

BAD EXAMPLES (don't do this):
"Operations Leader | Driving 86% Improvements | 100% Success Rates | Transforming Organizations"
"Results-Driven Leader | Passionate About Excellence | Strategic Visionary"

Generate ONLY the headline, nothing else.`

      const headlineResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: headlinePrompt }],
      })

      headline = (headlineResponse.content[0] as { text: string }).text.trim()
      // Remove quotes if wrapped
      headline = headline.replace(/^["']|["']$/g, '')
      // Ensure max length
      if (headline.length > 220) {
        headline = headline.substring(0, 217) + '...'
      }
    }

    // Generate about section if needed
    if (!regenerateOnly || regenerateOnly === 'about') {
      const aboutPrompt = `Write a LinkedIn About section for someone targeting: ${targetRole}

THEIR DATA:
- Background: ${rank} with ${years} years in ${branch}
- Certifications: ${certString}
- Education: ${eduString}
- Skills: ${skills?.slice(0, 10).join(', ') || 'None listed'}

EXPERIENCE:
${experienceText}

NOTE: This person has ${experienceCount} experience entries in their profile.
${hasLimitedData ?
  'Since they have limited experience data entered, focus on their years of service, certifications, and skill areas rather than specific achievements. Do NOT make up statistics or achievements.' :
  'Use their actual achievements and metrics from the experience data above.'}

TONE: ${toneInstructions[tone] || toneInstructions.professional}
LENGTH: ${lengthInstructions[aboutLength] || lengthInstructions.standard}
${emphasisText}

FORMAT REQUIREMENT - USE EXACTLY THIS STRUCTURE WITH LINE BREAKS:

[Opening paragraph - 2-3 sentences about who you are and what you do. Don't start with "I am a..." - start with something specific about what you believe or do.]

[blank line]

[Middle paragraph - 3-4 sentences about your background, credentials, and key strengths. Naturally mention certifications and education if they have them.]

[blank line]

[Closing paragraph - 2-3 sentences about what you're looking for. End simply.]

CLOSING OPTIONS (pick one that fits the tone):
- "Open to connecting with operations leaders and hiring managers."
- "Let's talk."
- "Always happy to connect with fellow veterans and industry professionals."
- "Reach out if you're building a team that values execution over excuses."
- "Looking forward to my next challenge."

DO NOT USE these generic AI endings:
- "I'd welcome the opportunity to connect and discuss..."
- "...contribute to your organization's success"
- "...excited about the possibility of..."
- "...would be honored to..."

CRITICAL RULES:
- MUST have 3 distinct paragraphs separated by blank lines (use \\n\\n between paragraphs)
- NO BULLET POINTS - paragraphs only
- NO made-up statistics or vague percentages
- NO buzzwords: "transform", "leverage", "drive results", "passionate", "revolutionize"
- Sound like a real person wrote this, not AI
- Max 2,600 characters

Generate the About section with proper paragraph breaks.`

      const aboutResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: aboutPrompt }],
      })

      summary = (aboutResponse.content[0] as { text: string }).text.trim()
      // Remove quotes if wrapped
      summary = summary.replace(/^["']|["']$/g, '')
      // Clean AI patterns (but preserve newlines)
      summary = cleanLinkedInContent(summary)
      // Ensure paragraph formatting
      summary = formatAboutSection(summary)
      // Ensure max length
      if (summary.length > 2600) {
        // Cut at last complete sentence before limit
        const truncated = summary.substring(0, 2600)
        const lastPeriod = truncated.lastIndexOf('.')
        if (lastPeriod > 2000) {
          summary = truncated.substring(0, lastPeriod + 1)
        }
      }
    }

    console.log('LinkedIn generation:', {
      targetRole,
      experienceCount,
      hasLimitedData,
      tone,
      aboutLength,
      emphasis,
      regenerateOnly,
      headlineLength: headline.length,
      summaryLength: summary.length,
    })

    // Track usage - estimate tokens based on what was generated
    const tokensUsed = 1800 // Approximation for both headline and about calls
    await logApiUsage(user.id, 'generate-linkedin', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'ai_summaries')

    return NextResponse.json({
      headline,
      summary,
    })
  } catch (error) {
    console.error('LinkedIn generation error:', error)
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 })
  }
}
