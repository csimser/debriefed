import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchOccupations, getOccupationSkills } from '@/lib/onet-api'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'
import crypto from 'crypto'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Create cache key from resume + job description
function createCacheKey(resumeContent: any, jobDescription: string): string {
  const contentHash = crypto
    .createHash('md5')
    .update(JSON.stringify(resumeContent) + jobDescription)
    .digest('hex')
  return `job_match:${contentHash}`
}

// In-memory cache with TTL (24 hours)
const analysisCache = new Map<string, { result: any; expires: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Clean expired cache entries periodically
function cleanCache() {
  const now = Date.now()
  for (const [key, value] of analysisCache.entries()) {
    if (value.expires < now) {
      analysisCache.delete(key)
    }
  }
}
// Clean cache every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanCache, 60 * 60 * 1000)
}

const SYSTEM_PROMPT = `You are an expert resume analyst and career coach specializing in helping military veterans transition to civilian careers. You analyze resumes against job postings with precision and provide actionable feedback.

Your analysis is thorough, honest, and constructive. You identify both strengths and gaps, and provide specific suggestions for improvement. You understand military terminology and how to translate it for civilian employers.

You are meticulous about extracting requirements from job postings and matching them against candidate qualifications.`

// Fetch O*NET skills for a job title (runs in background, doesn't block)
async function getOnetJobContext(jobTitle: string): Promise<string> {
  if (!jobTitle || jobTitle === 'Not specified') return ''

  try {
    // Search for matching occupations
    const occupations = await searchOccupations(jobTitle, 3)
    if (!occupations || occupations.length === 0) return ''

    // Get skills for the top match
    const topOccupation = occupations[0]
    const skills = await getOccupationSkills(topOccupation.code)

    if (skills && skills.length > 0) {
      const skillNames = skills.slice(0, 8).map(s => s.name).join(', ')
      return `
=== O*NET OCCUPATION DATA ===
Closest matching occupation: ${topOccupation.title} (${topOccupation.code})
Key skills for this occupation: ${skillNames}
Use this O*NET data to inform your skills matching - these are industry-standard skills for this type of role.
`
    }
  } catch (error) {
    // Silently fail - O*NET is an enhancement, not required
    console.log('O*NET job context fetch failed, proceeding without')
  }
  return ''
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeContent, jobPosting } = await request.json()

    if (!resumeContent || !jobPosting?.description) {
      return NextResponse.json({ error: 'Missing resume or job description' }, { status: 400 })
    }

    // Pre-check usage limits before processing
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, email')
      .eq('user_id', user.id)
      .single()

    const { data: usage } = await supabaseAdmin
      .from('usage')
      .select('job_matches')
      .eq('user_id', user.id)
      .single()

    // Admin bypass
    if (!profile?.email || !ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      const rawTier = profile?.subscription_tier || 'free'
      const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
        rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

      const tierConfig = PRICING_TIERS[tier]
      const currentCount = usage?.job_matches || 0
      const limit = tierConfig.limits.job_match_analysis

      if (currentCount >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} job match anal${limit !== 1 ? 'yses' : 'ysis'}. ${tier === 'free' ? 'Upgrade to Core for more.' : tier === 'core' ? 'Upgrade to Full for more.' : 'Monthly limit reached.'}`,
          limitReached: true,
          tier
        }, { status: 403 })
      }
    }

    // Check cache first (only after limit check passes)
    const cacheKey = createCacheKey(resumeContent, jobPosting.description)
    const cached = analysisCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      console.log('Job match cache hit')
      return NextResponse.json({ analysis: cached.result, cached: true })
    }

    // Build resume text from content
    const resumeText = buildResumeText(resumeContent)
    const candidateProfile = buildCandidateProfile(resumeContent)

    // Fetch O*NET context for job title (async, with timeout)
    let onetContext = ''
    try {
      onetContext = await Promise.race([
        getOnetJobContext(jobPosting.title || ''),
        new Promise<string>((resolve) => setTimeout(() => resolve(''), 3000)) // 3s timeout
      ])
    } catch {
      // Ignore O*NET failures
    }

    const prompt = `Analyze this candidate's resume against the job posting and provide a comprehensive match analysis.

=== CANDIDATE PROFILE ===
${candidateProfile}

=== RESUME CONTENT ===
${resumeText}

=== JOB POSTING ===
Title: ${jobPosting.title || 'Not specified'}
Company: ${jobPosting.company || 'Not specified'}
Description:
${jobPosting.description}
${onetContext}

=== ANALYSIS INSTRUCTIONS ===
Perform a comprehensive analysis covering:

1. SKILLS MATCH - Extract ALL required/preferred skills from the job posting. Compare against candidate's skills.
   - Calculate score: (matched skills / required skills) * 100
   - If job lists no specific required skills, score = 100
   - Consider transferable skills (leadership, management, communication apply broadly)
   - Identify skills to HIGHLIGHT, ADD, or REMOVE

2. EXPERIENCE/BULLETS - Analyze each bullet point against job requirements:
   - Suggest rewording bullets to include job keywords naturally
   - Mark bullets as "include" (relevant) or "exclude" (not relevant)

3. CERTIFICATIONS - Check if job requires/prefers specific certifications:
   - If NO certifications required in job posting: score = 100, meetsRequirement = true
   - If certifications required: score = (matched / required) * 100
   - Flag any missing required certifications

4. EDUCATION - Check education requirements:
   - If NO education requirement specified: score = 100, meetsRequirement = true
   - If requirement exists: compare candidate's highest degree
   - meetsRequirement = true if candidate meets or exceeds

5. YEARS OF EXPERIENCE:
   - If job does NOT specify years required: requiredYears = 0, score = 100, meetsRequirement = true
   - If job specifies years: score = min(100, (candidateYears / requiredYears) * 100)
   - meetsRequirement = true if candidateYears >= requiredYears

6. SECURITY CLEARANCE - CRITICAL LOGIC:
   - If job does NOT require clearance: required = null, score = 100, meetsRequirement = true
   - If job requires clearance AND candidate has it or higher: score = 100, meetsRequirement = true
   - If job requires clearance AND candidate lacks it: score = 0, meetsRequirement = false
   - Clearance hierarchy: None < Public Trust < Secret < Top Secret < TS/SCI

7. WEIGHTED MATCH SCORE - Calculate final score:
   - Skills: 30%
   - Experience: 25%
   - Keywords: 20%
   - Education: 10%
   - Certifications: 10%
   - Clearance: 5% (only if required, otherwise exclude from calculation)

Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "categoryScores": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "keywords": <number 0-100>,
    "education": <number 0-100>,
    "certifications": <number 0-100>,
    "clearance": <number 0-100 or null if not required>
  },
  "categoryDetails": {
    "skills": {
      "required": ["skill1", "skill2"],
      "matched": ["skill1"],
      "missing": ["skill2"],
      "toHighlight": ["skill1"],
      "toAdd": ["skill2"],
      "toRemove": ["irrelevant_skill"]
    },
    "education": {
      "required": "Bachelor's degree or equivalent",
      "candidateLevel": "Bachelor's",
      "meetsRequirement": true,
      "notes": "Candidate meets education requirement"
    },
    "certifications": {
      "required": ["PMP", "CAPM"],
      "matched": ["PMP"],
      "missing": ["CAPM"],
      "notes": "Has PMP which is primary requirement"
    },
    "experience": {
      "requiredYears": 5,
      "candidateYears": 8,
      "meetsRequirement": true,
      "notes": "Exceeds experience requirement"
    },
    "clearance": {
      "required": "Secret",
      "candidateLevel": "Top Secret",
      "meetsRequirement": true,
      "notes": "Exceeds clearance requirement"
    }
  },
  "bulletSuggestions": [
    {
      "experienceIndex": 0,
      "bulletIndex": 0,
      "original": "original bullet text",
      "suggested": "improved bullet text with keywords",
      "keywordsAdded": ["keyword1", "keyword2"],
      "action": "rewrite",
      "priority": "high"
    },
    {
      "experienceIndex": 0,
      "bulletIndex": 2,
      "original": "irrelevant bullet",
      "suggested": null,
      "keywordsAdded": [],
      "action": "exclude",
      "priority": "low"
    }
  ],
  "skillChanges": {
    "add": ["skill to add to resume"],
    "highlight": ["existing skill to emphasize"],
    "remove": ["skill irrelevant to this job"]
  },
  "gaps": [
    {
      "category": "certifications",
      "severity": "medium",
      "description": "Missing CAPM certification mentioned as preferred"
    }
  ],
  "strengths": [
    "8 years of operations experience exceeds 5 year requirement",
    "Active Top Secret clearance exceeds requirement",
    "PMP certification directly matches job requirement"
  ],
  "priorityActions": [
    "Add project management keywords to bullet points",
    "Highlight PMP certification prominently",
    "Consider obtaining CAPM certification"
  ],
  "assessment": "2-3 sentence summary of overall match quality and top recommendations"
}

CRITICAL SCORING RULES - FOLLOW EXACTLY:
1. If clearance is NOT required by job: set clearance.required = null, clearance.meetsRequirement = true, categoryScores.clearance = null
2. If certifications are NOT required by job: set certifications.required = [], categoryScores.certifications = 100, certifications.meetsRequirement = true
3. If experience years are NOT specified: set experience.requiredYears = 0, categoryScores.experience = 100, experience.meetsRequirement = true
4. If education is NOT specified: set education.required = "Not specified", categoryScores.education = 100, education.meetsRequirement = true
5. Skills score = (matchedSkills.length / requiredSkills.length) * 100, minimum 0
6. Extract SPECIFIC keywords from the job posting (tools, technologies, methodologies, soft skills)
7. Provide actionable bullet rewrites that sound natural, not keyword-stuffed
8. Priority actions should be the 3 most impactful changes
9. Return ONLY valid JSON, no markdown code blocks or explanation

REALISTIC SCORING GUIDELINES:
- Be critical and honest. A perfect 100% match is extremely rare and should never be awarded.
- Strong candidates typically score 70-85%. Reserve 90%+ only for candidates who EXCEED requirements.
- Missing even 1 required skill should impact the skills score significantly.
- Keywords score should reflect actual term coverage, not inflate for similar concepts.
- Experience score: if candidate has fewer years than required, score should reflect the gap.
- Education: having a higher degree than required doesn't add extra points (cap at 100).
- The overall score should realistically represent how competitive this candidate would be.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (response.content[0] as { text: string }).text.trim()

    // Parse JSON from response
    let analysis
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response:', text)
      return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 })
    }

    // Post-process to fix common scoring logic errors
    analysis = normalizeScores(analysis)

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 4000
    await logApiUsage(user.id, 'job-match', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'job_matches')

    // Cache the result
    analysisCache.set(cacheKey, {
      result: analysis,
      expires: Date.now() + CACHE_TTL,
    })

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Job match error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

function buildCandidateProfile(content: any): string {
  const parts: string[] = []

  // Total years of experience
  if (content.experiences?.length > 0) {
    const totalYears = calculateTotalExperience(content.experiences)
    parts.push(`Total Years of Experience: ${totalYears}`)
  }

  // Clearance
  if (content.contact?.clearance) {
    parts.push(`Security Clearance: ${content.contact.clearance}`)
  }

  // Education summary
  if (content.education?.length > 0) {
    const highestEdu = content.education[0]
    parts.push(`Highest Education: ${highestEdu.degree} in ${highestEdu.field_of_study}`)
  }

  // All skills
  if (content.skills?.length > 0) {
    parts.push(`Skills: ${content.skills.map((s: any) => s.name).join(', ')}`)
  }

  // All certifications
  if (content.certifications?.length > 0) {
    parts.push(`Certifications: ${content.certifications.map((c: any) => c.name).join(', ')}`)
  }

  return parts.join('\n')
}

function calculateTotalExperience(experiences: any[]): number {
  let totalMonths = 0
  const now = new Date()

  for (const exp of experiences) {
    if (!exp.start_date) continue

    const start = parseDate(exp.start_date)
    const end = exp.is_current ? now : (exp.end_date ? parseDate(exp.end_date) : now)

    if (start && end) {
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
      totalMonths += Math.max(0, months)
    }
  }

  return Math.round(totalMonths / 12)
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null

  // Handle various formats: "2020-01", "01/2020", "January 2020", etc.
  const formats = [
    /^(\d{4})-(\d{2})/, // 2020-01
    /^(\d{2})\/(\d{4})/, // 01/2020
  ]

  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      const year = parseInt(match[1].length === 4 ? match[1] : match[2])
      const month = parseInt(match[1].length === 4 ? match[2] : match[1]) - 1
      return new Date(year, month)
    }
  }

  // Try parsing as-is
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed
}

function buildResumeText(content: any): string {
  const parts: string[] = []

  // Contact
  if (content.contact) {
    const c = content.contact
    parts.push(`Name: ${c.first_name} ${c.last_name}`)
    if (c.email) parts.push(`Email: ${c.email}`)
    if (c.phone) parts.push(`Phone: ${c.phone}`)
    if (c.city) parts.push(`Location: ${c.city}, ${c.state}`)
    if (c.clearance) parts.push(`Security Clearance: ${c.clearance}`)
  }

  // Summary
  if (content.summary) {
    parts.push(`\nPROFESSIONAL SUMMARY:\n${content.summary}`)
  }

  // Experience
  if (content.experiences?.length > 0) {
    parts.push('\nEXPERIENCE:')
    content.experiences.forEach((exp: any, expIdx: number) => {
      parts.push(`\n[Experience ${expIdx}]`)
      parts.push(`${exp.civilian_title || exp.job_title} at ${exp.organization}`)
      parts.push(`${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date}`)
      exp.bullets?.forEach((bullet: any, bulletIdx: number) => {
        parts.push(`[Bullet ${bulletIdx}] • ${bullet.translated_text || bullet.original_text}`)
      })
    })
  }

  // Education
  if (content.education?.length > 0) {
    parts.push('\nEDUCATION:')
    content.education.forEach((edu: any) => {
      const degree = edu.degree || edu.degree_type || ''
      const field = edu.field_of_study || ''
      const school = edu.institution || edu.school_name || ''
      parts.push(`${degree} in ${field} - ${school}`)
      if (edu.graduation_date || edu.graduation_year) {
        parts.push(`Graduated: ${edu.graduation_date || edu.graduation_year}`)
      }
    })
  }

  // Certifications
  if (content.certifications?.length > 0) {
    parts.push('\nCERTIFICATIONS:')
    content.certifications.forEach((c: any) => {
      parts.push(`• ${c.name}${c.issuing_org ? ` (${c.issuing_org})` : ''}`)
    })
  }

  // Skills
  if (content.skills?.length > 0) {
    parts.push('\nSKILLS:')
    parts.push(content.skills.map((s: any) => s.name).join(', '))
  }

  return parts.join('\n')
}

// Normalize scores to fix common AI scoring errors
function normalizeScores(analysis: any): any {
  const categoryScores = analysis.categoryScores || {}
  const categoryDetails = analysis.categoryDetails || {}

  // Fix clearance scoring
  if (categoryDetails.clearance) {
    const clearance = categoryDetails.clearance
    // If no clearance required, should always meet requirement
    if (!clearance.required || clearance.required === 'None' || clearance.required === 'N/A') {
      clearance.meetsRequirement = true
      clearance.notes = clearance.notes || 'No clearance required'
      categoryScores.clearance = null // null means not applicable
    }
  } else {
    // No clearance section means no clearance required
    categoryScores.clearance = null
  }

  // Fix certifications scoring
  if (categoryDetails.certifications) {
    const certs = categoryDetails.certifications
    // If no certifications required, score should be 100
    if (!certs.required || certs.required.length === 0) {
      categoryScores.certifications = 100
      certs.meetsRequirement = true
      certs.notes = certs.notes || 'No certifications required'
    } else {
      // Calculate proper score based on matched/required ratio
      const matched = certs.matched?.length || 0
      const required = certs.required?.length || 1
      categoryScores.certifications = Math.round((matched / required) * 100)
    }
  } else {
    categoryScores.certifications = 100
  }

  // Fix experience scoring
  if (categoryDetails.experience) {
    const exp = categoryDetails.experience
    // If no experience requirement specified, score should be 100
    if (!exp.requiredYears || exp.requiredYears === 0 || exp.requiredYears === 'N/A') {
      exp.requiredYears = 0
      exp.meetsRequirement = true
      categoryScores.experience = 100
      exp.notes = exp.notes || 'No specific experience requirement'
    } else if (exp.candidateYears >= exp.requiredYears) {
      exp.meetsRequirement = true
      categoryScores.experience = 100
    } else {
      // Partial credit for having some experience
      categoryScores.experience = Math.round((exp.candidateYears / exp.requiredYears) * 100)
    }
  }

  // Fix education scoring
  if (categoryDetails.education) {
    const edu = categoryDetails.education
    // If no education requirement specified, score should be 100
    if (!edu.required || edu.required === 'Not specified' || edu.required === 'N/A') {
      edu.meetsRequirement = true
      categoryScores.education = 100
      edu.notes = edu.notes || 'No specific education requirement'
    } else if (edu.meetsRequirement) {
      categoryScores.education = 100
    }
  }

  // Fix skills scoring - calculate based on matched/required ratio
  if (categoryDetails.skills) {
    const skills = categoryDetails.skills
    const matched = skills.matched?.length || 0
    const required = skills.required?.length || 1
    if (required === 0) {
      categoryScores.skills = 100
    } else {
      categoryScores.skills = Math.round((matched / required) * 100)
    }
  }

  // Recalculate overall score with correct weights
  const weights = {
    skills: 0.30,
    experience: 0.25,
    keywords: 0.20,
    education: 0.10,
    certifications: 0.10,
    clearance: 0.05
  }

  let totalWeight = 0
  let weightedScore = 0

  // Skills
  if (typeof categoryScores.skills === 'number') {
    weightedScore += categoryScores.skills * weights.skills
    totalWeight += weights.skills
  }

  // Experience
  if (typeof categoryScores.experience === 'number') {
    weightedScore += categoryScores.experience * weights.experience
    totalWeight += weights.experience
  }

  // Keywords
  if (typeof categoryScores.keywords === 'number') {
    weightedScore += categoryScores.keywords * weights.keywords
    totalWeight += weights.keywords
  }

  // Education
  if (typeof categoryScores.education === 'number') {
    weightedScore += categoryScores.education * weights.education
    totalWeight += weights.education
  }

  // Certifications
  if (typeof categoryScores.certifications === 'number') {
    weightedScore += categoryScores.certifications * weights.certifications
    totalWeight += weights.certifications
  }

  // Clearance - only include if required (not null)
  if (categoryScores.clearance !== null && typeof categoryScores.clearance === 'number') {
    weightedScore += categoryScores.clearance * weights.clearance
    totalWeight += weights.clearance
  }

  // Calculate normalized overall score
  if (totalWeight > 0) {
    const rawScore = Math.round(weightedScore / totalWeight)
    // Cap at 95% - no resume is ever a perfect match
    // Even exceptional candidates typically score 75-90%
    // Reserve 90%+ only for candidates who clearly exceed all requirements
    analysis.overallScore = Math.min(rawScore, 95)
  }

  // Also cap individual category scores at 100 (they shouldn't exceed this)
  for (const key of Object.keys(categoryScores)) {
    if (typeof categoryScores[key] === 'number' && categoryScores[key] > 100) {
      categoryScores[key] = 100
    }
  }

  analysis.categoryScores = categoryScores
  analysis.categoryDetails = categoryDetails

  return analysis
}
