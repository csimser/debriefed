import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchOccupations, getOccupationSkills } from '@/lib/onet-api'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage, logActivity } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'
import { incrementUsage as incrementPeriodUsage } from '@/lib/usage-service'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
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

const SYSTEM_PROMPT = `You are an expert resume analyst who provides BRUTALLY HONEST assessments. You are known for being critical but fair - you never inflate scores to make candidates feel good.

Your philosophy:
- A 100% match is essentially impossible. Even excellent candidates rarely score above 85%.
- Missing a single REQUIRED qualification should significantly impact the score.
- You evaluate based on what's explicitly stated, not what you assume.
- You're helping candidates understand their REAL competitive position.

You understand military terminology and translate it appropriately, but you don't give bonus points for military service - you evaluate qualifications objectively.`

// Fetch O*NET skills for a job title (runs in background, doesn't block)
async function getOnetJobContext(jobTitle: string): Promise<string> {
  if (!jobTitle || jobTitle === 'Not specified') return ''

  try {
    const occupations = await searchOccupations(jobTitle, 3)
    if (!occupations || occupations.length === 0) return ''

    const topOccupation = occupations[0]
    const skills = await getOccupationSkills(topOccupation.code)

    if (skills && skills.length > 0) {
      const skillNames = skills.slice(0, 8).map(s => s.name).join(', ')
      return `
=== O*NET OCCUPATION DATA ===
Closest matching occupation: ${topOccupation.title} (${topOccupation.code})
Industry-standard skills: ${skillNames}
Use this to validate your keyword extraction - these skills are commonly required for this role type.
`
    }
  } catch (error) {
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
      .select('subscription_tier, email, target_role, target_industry, rating_mos, branch')
      .eq('user_id', user.id)
      .single()

    const targetRole = profile?.target_role || ''
    const targetIndustry = profile?.target_industry || ''

    // Build local crosswalk context for military occupation mapping
    let crosswalkContext = ''
    if (profile?.rating_mos) {
      const localResult = getCivilianJobs(profile.rating_mos, profile?.branch)
      if (localResult) {
        crosswalkContext = `\nMilitary Occupation Crosswalk: ${profile.rating_mos} maps to ${localResult.civilian_titles.join(', ')} (Industries: ${localResult.industries?.join(', ') || 'Various'})\n`
      }
    }

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
        new Promise<string>((resolve) => setTimeout(() => resolve(''), 3000))
      ])
    } catch {
      // Ignore O*NET failures
    }

    const prompt = `Analyze this resume against the job posting. Be CRITICAL and HONEST - do not inflate scores.

=== CANDIDATE PROFILE ===
${candidateProfile}
${targetRole ? `Target Role: ${targetRole}` : ''}
${targetIndustry ? `Target Industry: ${targetIndustry}` : ''}
${crosswalkContext}

=== RESUME CONTENT ===
${resumeText}

=== JOB POSTING ===
Title: ${jobPosting.title || 'Not specified'}
Company: ${jobPosting.company || 'Not specified'}
Description:
${jobPosting.description}
${onetContext}

=== STEP 1: EXTRACT ALL REQUIREMENTS FROM JOB POSTING ===

Read the job posting carefully and extract EVERY requirement mentioned. Categorize as:

**REQUIRED** (explicitly stated as required, must-have, essential, minimum qualifications):
- Technical skills (specific tools, software, platforms, languages)
- Certifications (PMP, Security+, AWS, etc.)
- Education level (degree type and field)
- Years of experience (exact number mentioned)
- Security clearance level
- Soft skills explicitly required

**PREFERRED** (nice-to-have, preferred, desired, bonus, plus):
- Any qualification marked as preferred
- "Experience with X is a plus"
- Advanced certifications beyond minimum

If a requirement is ambiguous, classify it as REQUIRED (be conservative).

=== STEP 2: SCORING METHODOLOGY (FOLLOW EXACTLY) ===

**SKILLS SCORE (30% weight):**
- Count REQUIRED technical skills from job posting
- Count how many the candidate has
- Score = (matched_required / total_required) * 70 + (matched_preferred / total_preferred) * 30
- Missing even ONE required skill = cap at 80%
- Missing 3+ required skills = cap at 60%

**EXPERIENCE SCORE (25% weight):**
- If job requires X years and candidate has >= X: score = 100
- If candidate has X-1 to X-2 years: score = 70
- If candidate has < X-2 years: score = 40
- If no requirement specified: score = 85 (benefit of doubt, but not 100)

**KEYWORDS SCORE (20% weight):**
- Extract actual phrases/terms from job posting
- Check for exact or near-exact matches in resume
- Score = (keywords_found / keywords_extracted) * 100
- Be strict - "project management" doesn't match "managed projects"

**EDUCATION SCORE (10% weight):**
- Meets or exceeds requirement: 100
- One level below (e.g., Bachelor's when Master's required): 60
- Two levels below: 30
- No requirement stated: 85

**CERTIFICATIONS SCORE (10% weight):**
- Has all required: 100
- Missing one required: 50
- Missing multiple required: 20
- No certs required: 100
- Has preferred certs: bonus up to +10 on base score

**CLEARANCE SCORE (5% weight, only if required):**
- Has required or higher: 100
- Can obtain (no disqualifiers): 60
- Cannot obtain: 0
- Not required: exclude from calculation

**OVERALL SCORE CALCULATION:**
weighted_average = (skills*0.30) + (experience*0.25) + (keywords*0.20) + (education*0.10) + (certifications*0.10) + (clearance*0.05 if applicable)

Then apply penalties:
- Missing ANY required skill: -5 from overall
- Missing required certification: -10 from overall
- Experience gap > 2 years: -10 from overall
- Missing required clearance: -20 from overall

Final score = max(weighted_average - total_penalties, 15)
Cap final score at 92 (100% is virtually impossible)

=== STEP 3: ASSESSMENT CATEGORIES ===

Based on final score:
- 80-92%: "Strong Candidate" - Very competitive, minor gaps only
- 65-79%: "Competitive" - Good foundation, addressable gaps
- 50-64%: "Needs Development" - Significant gaps, consider gaining qualifications
- Below 50%: "Consider Other Roles" - Major qualification gaps

=== STEP 4: SUGGESTIONS WITH IMPACT ===

For each suggestion, estimate realistic impact:
- Adding a missing REQUIRED skill to resume: +2-4%
- Rewriting a bullet to include keywords: +1-2%
- Adding a certification (if you have it): +3-5%
- These are cumulative but total improvement from suggestions is capped at +15%

=== OUTPUT FORMAT ===

Return ONLY valid JSON with this exact structure:

{
  "overallScore": <number 15-92, be harsh>,
  "assessmentLevel": "Strong Candidate" | "Competitive" | "Needs Development" | "Consider Other Roles",
  "categoryScores": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "keywords": <number 0-100>,
    "education": <number 0-100>,
    "certifications": <number 0-100>,
    "clearance": <number 0-100 or null if not required>
  },
  "extractedRequirements": {
    "requiredSkills": ["skill1", "skill2"],
    "preferredSkills": ["skill3"],
    "requiredCertifications": ["cert1"],
    "preferredCertifications": ["cert2"],
    "requiredExperienceYears": <number or null>,
    "requiredEducation": "Bachelor's in X" | null,
    "requiredClearance": "Secret" | null,
    "keyPhrases": ["phrase from job posting", "another key term"]
  },
  "categoryDetails": {
    "skills": {
      "required": ["from job posting"],
      "preferred": ["from job posting"],
      "matched": ["candidate has these"],
      "missingRequired": ["CRITICAL - candidate lacks"],
      "missingPreferred": ["nice to have"],
      "toHighlight": ["candidate has, should emphasize"],
      "toAdd": ["candidate might have, add if true"]
    },
    "education": {
      "required": "Bachelor's degree in Computer Science or related field",
      "candidateLevel": "Bachelor's in Business Administration",
      "meetsRequirement": false,
      "notes": "Related field requirement may be flexible"
    },
    "certifications": {
      "required": ["PMP"],
      "preferred": ["CAPM", "Agile"],
      "matched": [],
      "missingRequired": ["PMP"],
      "missingPreferred": ["CAPM", "Agile"],
      "notes": "Missing required PMP certification is a significant gap"
    },
    "experience": {
      "requiredYears": 5,
      "candidateYears": 3,
      "meetsRequirement": false,
      "gap": 2,
      "notes": "2 years short of requirement - significant gap"
    },
    "clearance": {
      "required": "Secret",
      "candidateLevel": "None",
      "meetsRequirement": false,
      "notes": "Will need to obtain Secret clearance"
    },
    "keywords": {
      "extracted": ["from job posting verbatim"],
      "found": ["in resume"],
      "missing": ["not in resume"]
    }
  },
  "bulletSuggestions": [
    {
      "experienceIndex": 0,
      "bulletIndex": 0,
      "original": "original bullet text",
      "suggested": "improved bullet - MUST preserve original meaning, only add keywords",
      "keywordsAdded": ["keyword1"],
      "action": "rewrite",
      "priority": "high",
      "estimatedImpact": "+1-2%"
    }
  ],
  "skillChanges": {
    "add": ["skill to add - only if candidate actually has it"],
    "highlight": ["existing skill to emphasize"],
    "remove": ["irrelevant skill"]
  },
  "gaps": [
    {
      "category": "certifications",
      "severity": "high",
      "item": "PMP",
      "description": "Missing required PMP certification",
      "canAddress": false,
      "addressSuggestion": "Consider obtaining PMP certification"
    },
    {
      "category": "experience",
      "severity": "medium",
      "item": "years",
      "description": "2 years short of 5-year requirement",
      "canAddress": false,
      "addressSuggestion": "Emphasize quality and scope of existing experience"
    }
  ],
  "strengths": [
    "Specific strength with context"
  ],
  "priorityActions": [
    {
      "action": "Add project management keywords to bullet points",
      "impact": "+2-3%",
      "difficulty": "Easy",
      "timeframe": "Immediate"
    },
    {
      "action": "Obtain PMP certification",
      "impact": "+5-8%",
      "difficulty": "Hard",
      "timeframe": "3-6 months"
    }
  ],
  "assessment": "2-3 sentence HONEST assessment. Don't sugarcoat. Example: 'This candidate has strong technical skills but lacks the required PMP certification and falls 2 years short on experience. Without addressing these gaps, this application would likely be screened out. Focus on the certification gap first.'",
  "competitivePosition": "Where this candidate likely stands: 'Would likely pass initial screening' OR 'May be filtered out due to missing requirements' OR 'Strong candidate for interviews'"
}

CRITICAL REMINDERS:
1. Be HARSH but FAIR. Don't give 80%+ unless candidate truly matches most requirements.
2. Missing REQUIRED items = major penalties. This is not negotiable.
3. A candidate missing 2-3 required skills should score 50-65%, not 75-85%.
4. Read the job posting CAREFULLY. Extract ACTUAL requirements, not generic assumptions.
5. "5+ years experience" means 5 is the minimum. 4 years = does not meet requirement.
6. Return ONLY valid JSON, no markdown.

SCORING CONSISTENCY RULES (MANDATORY):
- If missingRequired skills = 0, skills score MUST be 85-100%
- If missingRequired skills > 0, skills score MUST be capped based on count
- Category scores MUST mathematically align with matched/missing counts
- Do NOT give low scores if there are no missing required items

BULLET REWRITE RULES (ABSOLUTELY MANDATORY - DO NOT VIOLATE):
- NEVER fabricate, invent, or add experience the candidate doesn't have
- NEVER change the nature or scope of work (e.g., "maintenance" cannot become "cybersecurity")
- NEVER add responsibilities, achievements, skills, or technologies not in the original
- ONLY reframe existing experience with better keywords and action verbs
- The rewritten bullet must be a TRUE statement about what the candidate actually did
- If the original says "managed maintenance schedules", you can say "coordinated maintenance operations" but NOT "led cybersecurity vulnerability assessments"
- When in doubt, keep the original meaning intact and only improve phrasing
- Lying on a resume is fraud - your rewrites must be HONEST

JOB-SPECIFIC TAILORING:
- Frame bullet rewrites toward the specific job posting, not generic improvements
- Use keywords from THIS job description, not generic industry terms
- Consider the candidate's stated target role when suggesting improvements
- Same experience should be framed differently for different role types:
  * For admin roles: emphasize organization, coordination, documentation
  * For operations roles: emphasize efficiency, process improvement, cost savings
  * For management roles: emphasize leadership, budgets, team development
  * For technical roles: emphasize technical skills, systems, problem-solving`

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

    // Post-process to enforce scoring rules
    analysis = enforceScoring(analysis)

    // Track usage
    const inputTokens = response.usage?.input_tokens || 0
    const outputTokens = response.usage?.output_tokens || 0
    const tokensUsed = inputTokens + outputTokens
    await logApiUsage(user.id, 'job-match', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'job_matches')
    await incrementPeriodUsage(user.id, 'job_match_analysis')

    // Log activity
    await logActivity(user.id, 'job_analysis_run', {
      match_score: analysis.overallMatch?.score,
      key_matches: analysis.keyMatches?.length,
      tokens_used: tokensUsed,
    })

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

  if (content.experiences?.length > 0) {
    const totalYears = calculateTotalExperience(content.experiences)
    parts.push(`Total Years of Experience: ${totalYears}`)
  }

  if (content.contact?.clearance) {
    parts.push(`Security Clearance: ${content.contact.clearance}`)
  } else {
    parts.push(`Security Clearance: None stated`)
  }

  if (content.education?.length > 0) {
    const highestEdu = content.education[0]
    parts.push(`Highest Education: ${highestEdu.degree} in ${highestEdu.field_of_study}`)
  } else {
    parts.push(`Education: None stated`)
  }

  if (content.skills?.length > 0) {
    parts.push(`Skills Listed: ${content.skills.map((s: any) => s.name).join(', ')}`)
  } else {
    parts.push(`Skills: None listed`)
  }

  if (content.certifications?.length > 0) {
    parts.push(`Certifications: ${content.certifications.map((c: any) => c.name).join(', ')}`)
  } else {
    parts.push(`Certifications: None listed`)
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

  const formats = [
    /^(\d{4})-(\d{2})/,
    /^(\d{2})\/(\d{4})/,
  ]

  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      const year = parseInt(match[1].length === 4 ? match[1] : match[2])
      const month = parseInt(match[1].length === 4 ? match[2] : match[1]) - 1
      return new Date(year, month)
    }
  }

  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed
}

function buildResumeText(content: any): string {
  const parts: string[] = []

  if (content.contact) {
    const c = content.contact
    parts.push(`Name: ${c.first_name} ${c.last_name}`)
    if (c.email) parts.push(`Email: ${c.email}`)
    if (c.phone) parts.push(`Phone: ${c.phone}`)
    if (c.city) parts.push(`Location: ${c.city}, ${c.state}`)
    if (c.clearance) parts.push(`Security Clearance: ${c.clearance}`)
  }

  if (content.summary) {
    parts.push(`\nPROFESSIONAL SUMMARY:\n${content.summary}`)
  }

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

  if (content.certifications?.length > 0) {
    parts.push('\nCERTIFICATIONS:')
    content.certifications.forEach((c: any) => {
      parts.push(`• ${c.name}${c.issuing_org ? ` (${c.issuing_org})` : ''}`)
    })
  }

  if (content.skills?.length > 0) {
    parts.push('\nSKILLS:')
    parts.push(content.skills.map((s: any) => s.name).join(', '))
  }

  return parts.join('\n')
}

/**
 * Enforce strict scoring rules - this catches any AI leniency AND fixes inconsistencies
 */
function enforceScoring(analysis: any): any {
  const categoryScores = analysis.categoryScores || {}
  const categoryDetails = analysis.categoryDetails || {}

  // Count missing required items
  let missingRequiredSkills = 0
  let missingRequiredCerts = 0
  let experienceGap = 0
  let missingClearance = false

  // Skills analysis
  const skillsDetail = categoryDetails.skills || {}
  const matchedSkills = skillsDetail.matched?.length || 0
  const requiredSkills = skillsDetail.required?.length || 0
  const preferredSkills = skillsDetail.preferred?.length || 0
  missingRequiredSkills = skillsDetail.missingRequired?.length || 0
  const missingPreferredSkills = skillsDetail.missingPreferred?.length || 0

  // Certification analysis
  const certsDetail = categoryDetails.certifications || {}
  missingRequiredCerts = certsDetail.missingRequired?.length || 0
  const matchedCerts = certsDetail.matched?.length || 0
  const requiredCerts = certsDetail.required?.length || 0
  const noCertsRequired = !requiredCerts || requiredCerts === 0

  // Experience gap
  if (categoryDetails.experience) {
    const exp = categoryDetails.experience
    if (exp.requiredYears && exp.candidateYears < exp.requiredYears) {
      experienceGap = exp.requiredYears - exp.candidateYears
    }
  }

  // Clearance
  if (categoryDetails.clearance) {
    const cl = categoryDetails.clearance
    if (cl.required && cl.required !== 'None' && cl.required !== 'N/A' && !cl.meetsRequirement) {
      missingClearance = true
    }
  }

  // === FIX BUG 1: Recalculate skills score based on actual data ===
  // If 0 missing required skills, score should be high (85-100%)
  // The score formula: (matched_required/total_required)*70 + (matched_preferred/total_preferred)*30
  if (missingRequiredSkills === 0) {
    // No missing required skills = full points for required portion
    let recalculatedSkillScore = 70 // Base 70% for meeting all required

    // Add preferred skills portion
    if (preferredSkills > 0) {
      const preferredMatched = preferredSkills - missingPreferredSkills
      const preferredRatio = preferredMatched / preferredSkills
      recalculatedSkillScore += Math.round(preferredRatio * 30)
    } else {
      // No preferred skills listed = benefit of doubt
      recalculatedSkillScore += 20
    }

    // Ensure score is at least 85% if no required skills are missing
    categoryScores.skills = Math.max(recalculatedSkillScore, 85)
  } else {
    // Cap skills score based on how many required skills are missing
    const maxSkillScore = missingRequiredSkills >= 3 ? 50 : missingRequiredSkills >= 2 ? 65 : 80

    // Recalculate based on actual match ratio
    const totalRequired = requiredSkills || (matchedSkills + missingRequiredSkills)
    if (totalRequired > 0) {
      const matchRatio = matchedSkills / totalRequired
      const calculatedScore = Math.round(matchRatio * 100)
      categoryScores.skills = Math.min(calculatedScore, maxSkillScore)
    } else {
      categoryScores.skills = Math.min(categoryScores.skills || 0, maxSkillScore)
    }
  }

  // === FIX: Recalculate certifications score ===
  if (noCertsRequired) {
    categoryScores.certifications = 100 // No certs required = 100%
  } else if (missingRequiredCerts === 0) {
    categoryScores.certifications = 100 // Has all required = 100%
  } else {
    const maxCertScore = missingRequiredCerts >= 2 ? 30 : 50
    categoryScores.certifications = Math.min(categoryScores.certifications || 0, maxCertScore)
  }

  // === FIX: Recalculate experience score ===
  if (experienceGap === 0) {
    // Meets or exceeds requirement
    categoryScores.experience = categoryDetails.experience?.requiredYears ? 100 : 85
  } else {
    const maxExpScore = experienceGap >= 3 ? 40 : experienceGap >= 2 ? 60 : 75
    categoryScores.experience = Math.min(categoryScores.experience || 0, maxExpScore)
  }

  // === FIX: Recalculate education score ===
  if (categoryDetails.education) {
    const edu = categoryDetails.education
    const noEduRequired = !edu.required || edu.required === 'Not specified' || edu.required === 'N/A'
    if (noEduRequired) {
      categoryScores.education = 85 // No requirement = benefit of doubt
    } else if (edu.meetsRequirement) {
      categoryScores.education = 100
    }
    // If doesn't meet, keep AI's score (already penalized)
  }

  // === FIX: Recalculate clearance score ===
  if (categoryDetails.clearance) {
    const cl = categoryDetails.clearance
    const noClearanceRequired = !cl.required || cl.required === 'None' || cl.required === 'N/A'
    if (noClearanceRequired) {
      categoryScores.clearance = null // Exclude from calculation
    } else if (cl.meetsRequirement) {
      categoryScores.clearance = 100
    } else {
      categoryScores.clearance = 40 // Can potentially obtain
    }
  }

  // === FIX BUG 2: Recalculate overall score with correct weighted average ===
  const weights: Record<string, number> = {
    skills: 0.30,
    experience: 0.25,
    keywords: 0.20,
    education: 0.10,
    certifications: 0.10,
    clearance: 0.05
  }

  let totalWeight = 0
  let weightedScore = 0

  for (const [key, weight] of Object.entries(weights)) {
    const score = categoryScores[key]
    // Only include if score is a valid number (not null/undefined)
    if (score !== null && score !== undefined && typeof score === 'number') {
      weightedScore += score * weight
      totalWeight += weight
    }
  }

  // Calculate normalized weighted average
  // This ensures the average is out of 100, not out of totalWeight
  let baseScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 50

  // Apply penalties for missing REQUIRED items (on top of category score reductions)
  let totalPenalty = 0

  // Only apply additional penalties if there are significant gaps
  if (missingRequiredSkills >= 2) {
    totalPenalty += 5 // Additional penalty for multiple missing required skills
  }

  if (missingRequiredCerts >= 1) {
    totalPenalty += 5 // Additional penalty for missing required certification
  }

  if (experienceGap >= 2) {
    totalPenalty += 5 // Additional penalty for significant experience gap
  }

  if (missingClearance) {
    totalPenalty += 10 // Missing required clearance is serious
  }

  // Apply penalties and enforce caps
  let finalScore = Math.round(baseScore - totalPenalty)

  // Absolute caps
  finalScore = Math.max(finalScore, 15) // Floor at 15%
  finalScore = Math.min(finalScore, 92) // Ceiling at 92% (100% impossible)

  // Additional cap if missing multiple required items
  const totalMissingRequired = missingRequiredSkills + missingRequiredCerts + (experienceGap >= 2 ? 1 : 0) + (missingClearance ? 1 : 0)
  if (totalMissingRequired >= 3) {
    finalScore = Math.min(finalScore, 55)
  } else if (totalMissingRequired >= 2) {
    finalScore = Math.min(finalScore, 70)
  } else if (totalMissingRequired >= 1) {
    finalScore = Math.min(finalScore, 82)
  }

  analysis.overallScore = finalScore
  analysis.categoryScores = categoryScores

  // Set assessment level based on final score
  if (finalScore >= 80) {
    analysis.assessmentLevel = 'Strong Candidate'
  } else if (finalScore >= 65) {
    analysis.assessmentLevel = 'Competitive'
  } else if (finalScore >= 50) {
    analysis.assessmentLevel = 'Needs Development'
  } else {
    analysis.assessmentLevel = 'Consider Other Roles'
  }

  // Ensure competitive position is realistic
  if (totalMissingRequired >= 2) {
    analysis.competitivePosition = 'May be filtered out due to missing requirements'
  } else if (totalMissingRequired === 1 && missingRequiredCerts > 0) {
    analysis.competitivePosition = 'May be filtered out due to missing required certification'
  } else if (finalScore >= 75) {
    analysis.competitivePosition = 'Would likely pass initial screening'
  } else if (finalScore >= 60) {
    analysis.competitivePosition = 'Borderline - depends on applicant pool'
  } else {
    analysis.competitivePosition = 'Unlikely to pass initial screening without addressing gaps'
  }

  return analysis
}
