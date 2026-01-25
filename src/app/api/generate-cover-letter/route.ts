import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { withAISecurity, secureSystemPrompt, logAPIUsage } from '@/lib/ai-endpoint-wrapper'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const BASE_SYSTEM_PROMPT = `You are a cover letter writer who helps military veterans transition to civilian careers. You write like a real person, not like AI.

CRITICAL - ONE PAGE MAXIMUM:
- STRICT 300 word limit. Count carefully.
- 3-4 paragraphs total, no more
- Opening: 2-3 sentences
- Body: 1-2 paragraphs, 3-4 sentences each
- Closing: 1-2 sentences

BANNED PHRASES - NEVER USE THESE:
- Em dashes (—) or en dashes (–)
- "I am excited to apply" / "I'm excited to" / "I'm thrilled to"
- "I am confident that" / "I'm confident that"
- "I believe I would be a great fit"
- "passionate about" / "my passion for"
- "thrilled" / "eager" / "enthusiastic"
- "leverage my skills" / "leverage my experience"
- "hit the ground running"
- "proven track record"
- "team player" / "self-starter" / "go-getter"
- "dynamic environment" / "fast-paced"
- "utilize" / "utilization"
- "spearheaded" / "synergy" / "synergies"
- "aligns perfectly with" / "aligns with"
- "particularly resonates with"
- "I would welcome the opportunity"
- "showcases my ability" / "demonstrates my"
- "results-driven" / "detail-oriented"
- "think outside the box"
- "wear many hats" / "move the needle"
- "Your company's commitment to..."
- "makes me an ideal candidate"
- "contribute to your team's success"
- "unique opportunity" / "invaluable experience"
- "diverse background"
- Starting sentences with "Having..." or "As someone who..."
- Starting paragraphs with "Additionally," "Furthermore," "Moreover,"

TONE AND STYLE:
- Write like a competent professional, not a robot trying to impress
- Be direct and specific. No flowery language.
- Use short, punchy sentences mixed with longer ones
- Sound confident without being arrogant
- Be conversational but professional
- NEVER praise the company excessively
- Don't oversell or use superlatives
- Vary sentence structure. Don't start too many sentences with "I"
- Active voice throughout
- Quantify achievements with specific numbers

GOOD EXAMPLE:
"Your Program Manager posting caught my attention because it matches what I've spent 8 years doing: keeping complex projects on schedule while managing stakeholders who all think their priority is the only priority. Last year I cut a 490-day project timeline down to 86 days. I'd like to do the same kind of work for Lockheed Martin."

BAD EXAMPLE (DON'T DO THIS):
"I am excited to apply for the Program Manager position. I am confident that my proven track record of success in dynamic environments makes me an ideal candidate. I am passionate about leveraging my skills to contribute to your team's success."

MILITARY TRANSLATION:
- Translate ALL military jargon to civilian terms
- Don't over-explain military experience
- Focus on transferable outcomes, not processes
- Avoid mentioning rank unless directly relevant`

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
    { find: /I'm excited to/gi, replace: "I'm applying for" },
    { find: /I am excited to/gi, replace: "I am applying for" },
    { find: /I'm thrilled to/gi, replace: "I'm writing about" },
    { find: /I am thrilled to/gi, replace: "I am writing about" },
    { find: /aligns perfectly with/gi, replace: "matches" },
    { find: /aligns well with/gi, replace: "matches" },
    { find: /aligns with/gi, replace: "matches" },
    { find: /particularly resonates/gi, replace: "fits" },
    { find: /resonates with me/gi, replace: "interests me" },
    { find: /proven track record/gi, replace: "experience" },
    { find: /I'm confident that/gi, replace: "" },
    { find: /I am confident that/gi, replace: "" },
    { find: /I would welcome the opportunity/gi, replace: "I'd like" },
    { find: /showcases my ability/gi, replace: "shows I can" },
    { find: /demonstrates my/gi, replace: "shows my" },
    { find: /leverage my experience/gi, replace: "apply my experience" },
    { find: /leverage my skills/gi, replace: "apply my skills" },
    { find: /leverage/gi, replace: "use" },
    { find: /hit the ground running/gi, replace: "start contributing quickly" },
    { find: /dynamic environment/gi, replace: "workplace" },
    { find: /fast-paced environment/gi, replace: "busy workplace" },
    { find: /fast-paced/gi, replace: "busy" },
    { find: /^Furthermore,\s*/gim, replace: "" },
    { find: /^Moreover,\s*/gim, replace: "" },
    { find: /^Additionally,\s*/gim, replace: "" },
    { find: /passionate about/gi, replace: "focused on" },
    { find: /my passion for/gi, replace: "my focus on" },
    { find: /makes me an ideal candidate/gi, replace: "fits my background" },
    { find: /ideal candidate/gi, replace: "good fit" },
    { find: /unique opportunity/gi, replace: "role" },
    { find: /invaluable experience/gi, replace: "useful experience" },
    { find: /contribute to your team's success/gi, replace: "help the team" },
    { find: /I would be honored/gi, replace: "I'd like" },
    { find: /I am eager to/gi, replace: "I want to" },
    { find: /I'm eager to/gi, replace: "I want to" },
    { find: /eager to/gi, replace: "ready to" },
    { find: /thrilled to/gi, replace: "ready to" },
    { find: /enthusiastic about/gi, replace: "interested in" },
    { find: /utilize/gi, replace: "use" },
    { find: /utilization/gi, replace: "use" },
    { find: /spearheaded/gi, replace: "led" },
    { find: /synergy/gi, replace: "collaboration" },
    { find: /synergies/gi, replace: "efficiencies" },
    { find: /team player/gi, replace: "collaborative" },
    { find: /self-starter/gi, replace: "independent" },
    { find: /go-getter/gi, replace: "motivated" },
    { find: /results-driven/gi, replace: "focused" },
    { find: /detail-oriented/gi, replace: "thorough" },
  ]

  aiPhrases.forEach(({ find, replace }) => {
    cleaned = cleaned.replace(find, replace)
  })

  // Clean up any resulting double spaces or punctuation issues
  cleaned = cleaned.replace(/  +/g, ' ')
  cleaned = cleaned.replace(/,\s*,/g, ',')
  cleaned = cleaned.replace(/\.\s*,/g, '.')

  // Fix sentences that now start with lowercase after removal
  cleaned = cleaned.replace(/\.\s+([a-z])/g, (_, char) => `. ${char.toUpperCase()}`)

  return cleaned.trim()
}

/**
 * Validate cover letter quality and flag issues
 */
function validateCoverLetter(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const wordCount = text.split(/\s+/).length

  if (text.includes('—') || text.includes('–')) {
    issues.push('Contains em/en dashes')
  }
  if (wordCount > 400) {
    issues.push(`Too long (${wordCount} words, max 400)`)
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
  if (/I'm confident/i.test(text) || /I am confident/i.test(text)) {
    issues.push('Contains "I\'m confident"')
  }
  if (/leverage/i.test(text)) {
    issues.push('Contains "leverage"')
  }
  if (/utilize/i.test(text)) {
    issues.push('Contains "utilize"')
  }
  if (/spearheaded/i.test(text)) {
    issues.push('Contains "spearheaded"')
  }

  // Check for too many sentences starting with "I"
  const sentences = text.split(/[.!?]+/)
  const iStarts = sentences.filter(s => s.trim().match(/^I\s/)).length
  if (iStarts > 4) {
    issues.push(`Too many sentences starting with "I" (${iStarts})`)
  }

  return {
    valid: issues.length === 0,
    issues
  }
}

// Known company greeting patterns
const companyGreetings: Record<string, string> = {
  'booz allen': 'Dear Hiring Team',
  'booz allen hamilton': 'Dear Hiring Team',
  'lockheed martin': 'Dear Talent Acquisition Team',
  'northrop grumman': 'Dear Hiring Team',
  'general dynamics': 'Dear Recruiting Team',
  'raytheon': 'Dear Hiring Team',
  'bae systems': 'Dear Hiring Team',
  'leidos': 'Dear Hiring Team',
  'saic': 'Dear Hiring Team',
  'caci': 'Dear Hiring Team',
  'mantech': 'Dear Hiring Team',
  'peraton': 'Dear Hiring Team',
}

function getGreeting(companyName: string, hiringManagerName?: string): string {
  if (hiringManagerName?.trim()) {
    // Check if it looks like a full name or just a last name
    const parts = hiringManagerName.trim().split(/\s+/)
    if (parts.length >= 2) {
      // Full name - use "Dear FirstName LastName," format
      return `Dear ${hiringManagerName.trim()},`
    } else {
      // Single name - use "Dear Mr./Ms. Name," but we don't know gender, so just use the name
      return `Dear ${hiringManagerName.trim()},`
    }
  }

  const normalizedCompany = companyName.toLowerCase().trim()
  for (const [key, greeting] of Object.entries(companyGreetings)) {
    if (normalizedCompany.includes(key)) {
      return `${greeting},`
    }
  }

  return 'Dear Hiring Team,'
}

// Refinement instruction mappings
const toneInstructions: Record<string, string> = {
  professional: 'Write in a polished, professional tone. Balanced confidence without being stiff.',
  conversational: 'Write in a warm, personable tone. Still professional but more human and approachable. Use contractions.',
  assertive: 'Write in a direct, confident tone. Short sentences. No hedging language. Bold statements backed by facts.',
}

const lengthInstructions: Record<string, string> = {
  brief: 'STRICT 200 word maximum. Three short paragraphs. Every word must earn its place.',
  standard: 'STRICT 300 word maximum. Three to four paragraphs. Enough detail to be compelling but concise.',
  detailed: 'STRICT 400 word maximum. Four paragraphs. Include more context but absolutely no fluff.',
}

const industryInstructions: Record<string, string> = {
  defense: 'Tailor for defense contractors. Emphasize clearance, compliance experience, working with government stakeholders, mission focus. Mention relevant certifications.',
  private: 'Tailor for corporate roles. Focus on business impact, cost savings, efficiency gains, leadership. Translate all military terms.',
  federal: 'Tailor for federal government roles. Reference merit-based hiring. Can mention specific series/grades if relevant. Formal but not stiff.',
  startup: 'Tailor for startup/tech culture. More casual energy. Emphasize adaptability, wearing multiple hats, building things from scratch, moving fast.',
}

const openingInstructions: Record<string, string> = {
  achievement: 'Open with your single most impressive, quantified achievement that relates to this role. Make it specific and memorable.',
  connection: 'Open by connecting something specific about the company or role to your concrete experience.',
  problem: 'Open by identifying a problem this role solves and stating clearly that you solve that problem.',
  direct: 'Open with a simple, direct statement: what role you want, why you fit, one proof point.',
}

interface CoverLetterInput {
  userId?: string
  jobData: {
    company: string
    title: string
    description: string
  }
  userProfile?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    city?: string
    state?: string
    linkedin_url?: string
    branch?: string
    years_of_service?: string
    clearance?: string
  }
  experiences?: Array<{
    civilian_title?: string
    job_title?: string
    bullets?: Array<{
      translated_text?: string
      original_text?: string
    }>
  }>
  skills?: string[]
  hiringManagerName?: string
  tone?: string
  length?: string
  targetIndustry?: string
  emphasisAreas?: string[]
  openingStyle?: string
  selectedAchievements?: string[]
  isRegenerate?: boolean
}

export const POST = withAISecurity<CoverLetterInput>(
  { feature: 'cover_letters', inputType: 'cover_letter_context' },
  async (request, input, ctx) => {
    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not configured')
      return NextResponse.json({ error: 'API key not configured. Please contact support.' }, { status: 500 })
    }

    const {
      jobData,
      userProfile,
      experiences,
      skills,
      hiringManagerName,
      // Refinement options
      tone = 'professional',
      length = 'standard',
      targetIndustry = 'defense',
      emphasisAreas = [],
      openingStyle = 'achievement',
      selectedAchievements = [],
    } = input

    console.log('Cover letter request received:', {
      userId: ctx.userId,
      company: jobData?.company,
      title: jobData?.title,
      hasDescription: !!jobData?.description,
      tone,
      length,
      targetIndustry,
    })

    if (!jobData?.company || !jobData?.title || !jobData?.description) {
      console.error('Missing job details:', { company: jobData?.company, title: jobData?.title, hasDescription: !!jobData?.description })
      return NextResponse.json({ error: 'Missing job details: company, title, and description are required' }, { status: 400 })
    }

    // Build context from user profile
    const firstName = userProfile?.first_name || ''
    const lastName = userProfile?.last_name || ''
    const fullName = `${firstName} ${lastName}`.trim() || 'Applicant'
    const branch = userProfile?.branch || ''
    const yearsExp = userProfile?.years_of_service || ''
    const currentRole = experiences?.[0]?.civilian_title || experiences?.[0]?.job_title || ''
    const clearance = userProfile?.clearance || ''

    // Get achievements - prefer selected ones, fall back to auto-extracted
    let achievements: string[] = []
    if (selectedAchievements && selectedAchievements.length > 0) {
      achievements = selectedAchievements
    } else {
      achievements = experiences
        ?.flatMap((exp: any) =>
          exp.bullets
            ?.filter((b: any) => b.translated_text || b.original_text)
            .map((b: any) => b.translated_text || b.original_text) || []
        )
        .slice(0, 5) || []
    }

    const skillsList = skills?.slice(0, 10)?.join(', ') || ''
    const greeting = getGreeting(jobData.company, hiringManagerName)

    // Build refinement instructions
    const toneInstruction = toneInstructions[tone] || toneInstructions.professional
    const lengthInstruction = lengthInstructions[length] || lengthInstructions.standard
    const industryInstruction = industryInstructions[targetIndustry] || industryInstructions.defense
    const openingInstruction = openingInstructions[openingStyle] || openingInstructions.achievement

    // Get word limit based on length setting
    const wordLimits: Record<string, number> = {
      brief: 200,
      standard: 300,
      detailed: 400,
    }
    const maxWords = wordLimits[length] || 300

    const prompt = `Generate a cover letter for a ${jobData.title} position at ${jobData.company}.

APPLICANT PROFILE:
- Name: ${fullName}
- Years of experience: ${yearsExp}
- Branch: ${branch}
- Current/Recent role: ${currentRole}
- Clearance: ${clearance || 'Not specified'}
- Relevant skills: ${skillsList}
- Key achievements:
${achievements.map((a: string, i: number) => `  ${i + 1}. ${a}`).join('\n')}

JOB REQUIREMENTS (excerpt):
${jobData.description.substring(0, 2000)}

=== FORMATTING INSTRUCTIONS ===

WORD LIMIT: STRICT ${maxWords} word maximum. Count your words. Do not exceed this.

TONE: ${toneInstruction}

INDUSTRY CONTEXT: ${industryInstruction}

OPENING APPROACH: ${openingInstruction}

${emphasisAreas.length > 0 ? `EMPHASIZE THESE AREAS: ${emphasisAreas.join(', ')}.` : ''}

=== STRUCTURE (follow exactly) ===

1. Start with: "${greeting}"

2. OPENING PARAGRAPH (2-3 sentences):
   - ${openingInstruction}
   - State the specific role
   - NO generic enthusiasm. NO "I am excited to apply."

3. BODY PARAGRAPH(S) (3-5 sentences total):
   - Pick 2-3 specific requirements from the job posting
   - For each, give a concrete example with numbers
   - Don't say "I can do X" - say "I did X, here's what happened"
   - Mirror keywords from the job description naturally

4. CLOSING (1-2 sentences):
   - One clear call to action
   - No groveling, no "I would be honored" language
   - Keep it simple: "I'd like to discuss how my experience fits this role."

5. Sign off with:
Sincerely,

${fullName}

=== FINAL CHECKS ===
- Word count must be under ${maxWords}
- No em dashes (—)
- No banned phrases from the rules
- Varied sentence starters (not too many starting with "I")
- Active voice throughout
- Specific numbers and outcomes

Write the complete cover letter now:`

    console.log('Calling Anthropic API...')

    let response
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: secureSystemPrompt(BASE_SYSTEM_PROMPT),
        messages: [{ role: 'user', content: prompt }],
      })
      console.log('Anthropic API response received')
    } catch (apiError: any) {
      console.error('Anthropic API error:', {
        message: apiError.message,
        status: apiError.status,
        type: apiError.type,
      })

      if (apiError.status === 401) {
        return NextResponse.json({ error: 'Invalid API key. Please contact support.' }, { status: 500 })
      }
      if (apiError.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment and try again.' }, { status: 429 })
      }
      if (apiError.status === 400) {
        return NextResponse.json({ error: 'Invalid request. Please try again.' }, { status: 400 })
      }

      throw apiError
    }

    const textContent = response.content[0]
    if (textContent.type !== 'text') {
      console.error('Unexpected response type:', textContent.type)
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }

    let coverLetter = textContent.text.trim()

    // Post-process to catch any AI patterns that slipped through
    coverLetter = cleanCoverLetter(coverLetter)

    // Validate the result
    const validation = validateCoverLetter(coverLetter)
    if (!validation.valid) {
      console.warn('Cover letter validation issues:', validation.issues)
    }

    // Track token usage (feature count is handled by withAISecurity wrapper)
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
    await logAPIUsage(ctx.userId, 'generate-cover-letter', tokensUsed, 'claude-sonnet-4-20250514')

    console.log('Cover letter generated successfully, length:', coverLetter.length, 'words:', coverLetter.split(/\s+/).length)

    return NextResponse.json({
      coverLetter,
      wordCount: coverLetter.split(/\s+/).length,
      validationIssues: validation.issues.length > 0 ? validation.issues : undefined
    })
  }
)
