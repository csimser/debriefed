import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { withAISecurity, secureSystemPrompt } from '@/lib/ai-endpoint-wrapper'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const BASE_SYSTEM_PROMPT = `You are a cover letter writer who helps military veterans transition to civilian careers. You write like a real person, not like AI.

CRITICAL RULES - NEVER use these phrases or patterns:
- Em dashes (—) - use commas or periods instead
- "I'm excited to..." or "I'm thrilled to..."
- "...aligns perfectly with..." or "...aligns with..."
- "...particularly resonates with..."
- "...passionate about..." or "my passion for..."
- "I'm confident that..."
- "I would welcome the opportunity..."
- "...showcases my ability to..."
- "...demonstrates my..."
- "proven track record"
- "results-driven"
- "leverage my experience"
- "hit the ground running"
- "think outside the box"
- "synergy" or "synergies"
- "dynamic environment"
- "fast-paced"
- "self-starter"
- "team player"
- "go-getter"
- "wear many hats"
- "move the needle"
- Starting sentences with "Having..." or "As someone who..."
- Starting paragraphs with "Additionally," "Furthermore," or "Moreover,"
- "Your company's commitment to..."
- "...makes me an ideal candidate..."
- "...contribute to your team's success..."
- "I believe I would be a great fit..."
- "unique opportunity"
- "invaluable experience"
- "diverse background"

TONE AND STYLE:
- Write like a competent professional, not a robot trying to impress
- Be direct and specific, not flowery
- Use short, punchy sentences mixed with longer ones for rhythm
- Sound confident without being arrogant
- Be conversational but professional
- Avoid sycophantic praise of the company
- Don't oversell or use superlatives
- Vary sentence structure - don't start too many sentences with "I"

STRUCTURE:
- Opening: State the role and make ONE compelling hook (a specific achievement). Two to three sentences max. No generic enthusiasm.
- Body (2 paragraphs max): Connect specific experience to specific job requirements. Use concrete numbers and outcomes. Don't say "I can do X" - say "I did X, here's what happened."
- Closing: One sentence asking for an interview. No groveling.

LENGTH: Maximum 300 words. Shorter is better.

MILITARY TRANSLATION:
- Translate all military jargon to civilian terms
- Don't over-explain military experience
- Focus on transferable outcomes, not military processes
- Avoid mentioning rank unless directly relevant

EXAMPLE OF GOOD WRITING:
"Your Program Manager posting caught my attention because it matches what I've spent 20 years doing in the Navy: keeping complex projects on schedule while managing dozens of stakeholders who all think their priority is the only priority. Last year I cut a 490-day project timeline down to 86 days. I'd like to do the same kind of work for Booz Allen."

"I built a training program for 30 people from scratch. Everyone passed, and 95% hit advanced proficiency benchmarks. That took clear planning, daily tracking, and adjusting the approach when something wasn't working."`

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
  if (text.length > 2000) {
    issues.push('Too long (over ~400 words)')
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
  if (/Dear Hiring Manager[,:]?/i.test(text)) {
    issues.push('Uses generic "Dear Hiring Manager"')
  }
  if (/To Whom It May Concern/i.test(text)) {
    issues.push('Uses outdated "To Whom It May Concern"')
  }
  if (/aligns (perfectly |well )?with/i.test(text)) {
    issues.push('Contains "aligns with" phrase')
  }
  if (/I'm confident/i.test(text) || /I am confident/i.test(text)) {
    issues.push('Contains "I\'m confident"')
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
    return `Dear ${hiringManagerName.trim()},`
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
  brief: 'Keep it under 200 words. Three short paragraphs max. Every word must earn its place.',
  standard: 'Target 250-300 words. Four paragraphs. Enough detail to be compelling.',
  detailed: 'Up to 400 words allowed. Include more context and examples. Still no fluff.',
}

const industryInstructions: Record<string, string> = {
  defense: 'Tailor for defense contractors. Emphasize clearance, compliance experience, working with government stakeholders, mission focus. Mention relevant certifications.',
  private: 'Tailor for corporate roles. Focus on business impact, cost savings, efficiency gains, leadership. Translate all military terms.',
  federal: 'Tailor for federal government roles. Reference merit-based hiring. Can mention specific series/grades if relevant. Formal but not stiff.',
  startup: 'Tailor for startup/tech culture. More casual energy. Emphasize adaptability, wearing multiple hats, building things from scratch, moving fast.',
}

const openingInstructions: Record<string, string> = {
  achievement: 'Open with your single most impressive, quantified achievement that relates to this role.',
  connection: 'Open by connecting something specific about the company/role to your experience.',
  problem: 'Open by identifying a problem this role solves and stating you solve that problem.',
  direct: 'Open with a simple, direct statement: what role, why you fit, one proof point.',
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

JOB REQUIREMENTS:
${jobData.description.substring(0, 2500)}

TONE: ${toneInstruction}

LENGTH: ${lengthInstruction}

INDUSTRY CONTEXT: ${industryInstruction}

OPENING APPROACH: ${openingInstruction}

${emphasisAreas.length > 0 ? `EMPHASIZE THESE AREAS: ${emphasisAreas.join(', ')}. Make sure to highlight experience in these specific areas.` : ''}

INSTRUCTIONS - Follow these rules strictly:

1. Start with the greeting: "${greeting}"

2. NO em dashes (—). Use periods or commas instead.

3. DO NOT use these phrases:
   - "excited to apply", "thrilled to", "passionate about"
   - "proven track record", "aligns perfectly", "I'm confident"
   - "ideal candidate", "would welcome the opportunity"
   - "showcases my ability", "demonstrates my"
   - "leverage my experience", "hit the ground running"
   - "dynamic environment", "fast-paced"
   - Don't start paragraphs with "Additionally," "Furthermore," or "Moreover,"

4. Opening paragraph: ${openingInstruction} Two to three sentences max. No generic enthusiasm.

5. Middle paragraph(s): Pick 2-3 specific requirements from the job posting. For each, give a concrete example of doing that work. Use numbers. Don't say "I can do X" - say "I did X, here's what happened."

6. Closing: One sentence asking for an interview. No groveling, no "I would be honored" language.

7. Sign off with:
Sincerely,
${fullName}

Write the complete cover letter now:`

    console.log('Calling Anthropic API...')

    let response
    try {
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
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

    // Usage tracking is handled by the withAISecurity wrapper

    console.log('Cover letter generated successfully, length:', coverLetter.length)

    return NextResponse.json({
      coverLetter,
      validationIssues: validation.issues.length > 0 ? validation.issues : undefined
    })
  }
)
