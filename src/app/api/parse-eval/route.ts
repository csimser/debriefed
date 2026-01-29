export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'
import { translateMilitaryToCivilian, cleanEvalText } from '@/lib/constants/military-dictionary'
import { hasCriticalPII } from '@/lib/pii-scanner'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'

/**
 * Get role-specific guidance for bullet translation
 */
function getTargetRoleGuidance(targetRole: string, targetIndustry: string): string {
  const role = targetRole?.toLowerCase() || ''
  const industry = targetIndustry?.toLowerCase() || ''

  // Administrative / Support roles
  if (role.includes('admin') || role.includes('support') || role.includes('assistant') ||
      role.includes('coordinator') || role.includes('clerk') || role.includes('office')) {
    return `Emphasize: organization, coordination, documentation, scheduling, communication.
Use terms like: coordinated, organized, scheduled, documented, maintained records, processed, facilitated.
Avoid: IT/cyber terminology unless directly relevant.`
  }

  // Operations / Logistics roles
  if (role.includes('operations') || role.includes('logistics') || role.includes('supply') ||
      role.includes('warehouse') || role.includes('manufacturing') || industry.includes('logistics')) {
    return `Emphasize: process optimization, supply chain, inventory management, workflow efficiency.
Use terms like: streamlined, optimized, reduced costs, improved throughput, managed inventory.
Focus on: efficiency gains, cost savings, quality control, safety compliance.`
  }

  // IT / Cybersecurity roles
  if (role.includes('it') || role.includes('cyber') || role.includes('security') ||
      role.includes('network') || role.includes('software') || role.includes('tech') ||
      industry.includes('tech') || industry.includes('cyber')) {
    return `Emphasize: technical skills, security protocols, system administration, compliance.
Use terms like: implemented, configured, secured, monitored, troubleshot, automated.
Focus on: uptime, security posture, incident response, technical certifications.`
  }

  // Project Management roles
  if (role.includes('project') || role.includes('program') || role.includes('manager')) {
    return `Emphasize: project delivery, stakeholder management, budget oversight, team leadership.
Use terms like: delivered, managed, led cross-functional teams, tracked milestones, controlled budgets.
Focus on: on-time delivery, scope management, team development, strategic planning.`
  }

  // Default / General civilian
  return `Use general professional language suitable for any civilian employer.
Emphasize: leadership, results, teamwork, problem-solving, accountability.
Avoid defaulting to IT/cyber terminology - use context from the original bullet.`
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Admin client for database operations
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SYSTEM_PROMPT = `You are an expert at extracting achievement bullets from military performance evaluations and award citations.

You understand the format of:
- Navy FITREPs and Chief Evals
- Army NCOERs and OERs
- Air Force EPRs
- Award citations (NAM, COM, MSM, etc.)

Your job is to identify and extract the strongest achievement bullets - statements that describe specific accomplishments, quantified results, and leadership examples.

Be EXTREMELY aggressive about cleaning the input text.`

const EXTRACTION_PROMPT = `You are extracting achievement bullets from a military evaluation. Be EXTREMELY aggressive about:

1. REMOVING JUNK:
- Delete ALL asterisks (*, **, ***, ****)
- Delete ALL broken text fragments (random letters, partial words)
- Delete page numbers, headers, footers, form labels
- Delete signature blocks, dates, routing info
- Delete ranking statements like "RANKED 1 OF 5" or "TOP 10%"
- Delete any line under 30 characters
- Delete anything that looks like OCR garbage

2. TRANSLATING MILITARY JARGON (do this BEFORE returning):
Replace these terms automatically:
- "Sailor/Airman/Soldier/Marine" → "team member" or "professional"
- "Command" → "organization" or "department"
- "CO/XO/CMC" → "senior leadership" or "executive team"
- "Watch" → "shift" or "operational coverage"
- "Underway/deployment" → "operational period" or "field assignment"
- "INSURV/inspection" → "federal compliance audit" or "regulatory inspection"
- "Deckplate" → "frontline" or "hands-on"
- "Ship/boat/vessel" → "facility" or "operation"
- "Shipmate" → "colleague" or "team member"
- "Mission" → "objective" or "project"
- "Rate/rating/MOS" → "specialty" or "role"
- "Quarterdeck" → "reception" or "main entrance"
- "Liberty" → "time off"
- "TAD/TDY" → "temporary assignment"
- "PCS" → "relocation"
- "Quals/qualifications" → "certifications"
- All acronyms must be spelled out or translated to civilian equivalents

## TARGET ROLE GUIDANCE (if provided):
{TARGET_ROLE_GUIDANCE}

3. OUTPUT REQUIREMENTS:
- Return ONLY clean, civilian-ready bullets
- Each bullet must start with a strong action verb
- Each bullet must be a complete, professional sentence
- Preserve ALL numbers, percentages, and dollar amounts
- If you can't clean a bullet properly, skip it entirely`

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, fileData, evalType } = await request.json()

    if (!fileData || !evalType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check usage limits and get target role for context-aware translations
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, email, target_role, target_industry, rating_mos, branch')
      .eq('user_id', user.id)
      .single()

    const targetRole = profile?.target_role || ''
    const targetIndustry = profile?.target_industry || ''

    // Build local crosswalk context for better translations (no AI call needed)
    let crosswalkContext = ''
    if (profile?.rating_mos) {
      const localResult = getCivilianJobs(profile.rating_mos, profile?.branch)
      if (localResult) {
        crosswalkContext = `\nOCCUPATION CONTEXT: The candidate's specialty (${profile.rating_mos}) maps to: ${localResult.civilian_titles.join(', ')}. Industries: ${localResult.industries?.join(', ') || 'Various'}.\n`
      }
    }

    const { data: usage } = await supabaseAdmin
      .from('usage')
      .select('eval_uploads')
      .eq('user_id', user.id)
      .single()

    // Admin bypass
    if (!profile?.email || !ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      const rawTier = profile?.subscription_tier || 'free'
      const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
        rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

      const tierConfig = PRICING_TIERS[tier]
      const currentUploads = usage?.eval_uploads || 0
      const limit = tierConfig.limits.eval_uploads

      if (currentUploads >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} eval uploads. ${tier === 'free' ? 'Upgrade to Core for more.' : tier === 'core' ? 'Upgrade to Full for more.' : 'Monthly limit reached.'}`,
          limitReached: true,
          tier
        }, { status: 403 })
      }
    }

    // Decode base64 file and extract text (handles both PDF and images)
    let pdfText = await extractTextFromFile(fileData)

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract text from file. Please ensure it is readable.' }, { status: 400 })
    }

    // Pre-clean the extracted text
    const rawTextLength = pdfText.length
    pdfText = cleanEvalText(pdfText)
    console.log('Text before cleaning:', rawTextLength, 'after:', pdfText.length)

    // Use Claude to extract bullets with target role guidance
    const roleGuidance = getTargetRoleGuidance(targetRole, targetIndustry)
    const promptWithGuidance = EXTRACTION_PROMPT.replace('{TARGET_ROLE_GUIDANCE}', roleGuidance)
    const prompt = `${promptWithGuidance}

DOCUMENT TYPE: ${getEvalTypeName(evalType)}
${crosswalkContext}${targetRole ? `\nTARGET ROLE: ${targetRole}${targetIndustry ? ` in ${targetIndustry}` : ''}` : ''}

DOCUMENT TEXT:
${pdfText.substring(0, 8000)} ${pdfText.length > 8000 ? '...[truncated]' : ''}

Instructions:
1. Find 5-15 of the STRONGEST achievement bullets
2. Focus on statements that include:
   - Quantified results (numbers, percentages, dollar amounts)
   - Leadership examples (led, managed, supervised)
   - Awards, recognition, or promotions mentioned
   - Specific accomplishments with impact
3. Clean and translate each bullet to civilian language
4. Categorize each as: "leadership", "technical", or "achievement"

Return a JSON object with this structure:
{
  "bullets": [
    {
      "original": "the cleaned text from the document",
      "translated": "the civilian-translated version",
      "metrics": ["extracted numbers/percentages"],
      "skills": ["relevant civilian skills"],
      "category": "leadership" | "technical" | "achievement"
    }
  ],
  "evalPeriod": {
    "startDate": "YYYY-MM" or null if not found,
    "endDate": "YYYY-MM" or null if not found
  },
  "jobTitle": "Extracted job title/billet if visible" or null
}

Return ONLY valid JSON, no markdown or explanation. ALWAYS try to extract at least 3-5 bullets even if the text quality is poor. Only return an error if the text is completely unreadable with no achievement statements at all.`

    console.log('=== EVAL EXTRACTION DEBUG ===')
    console.log('Extracted text length:', pdfText.length)
    console.log('Extracted text preview:', pdfText.substring(0, 500))
    console.log('Eval type:', evalType)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (response.content[0] as { text: string }).text.trim()

    console.log('Raw Claude response:', text.substring(0, 1000))

    // Parse bullets from response
    let bullets: any[] = []
    let evalPeriod: { startDate: string | null; endDate: string | null } = { startDate: null, endDate: null }
    let jobTitle: string | null = null
    let parseError = null

    try {
      // Handle potential markdown code blocks
      let jsonText = text
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7)
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3)
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3)
      }
      jsonText = jsonText.trim()

      const parsed = JSON.parse(jsonText)

      // Check for error response
      if (parsed.error) {
        return NextResponse.json({ error: parsed.error, bullets: [] }, { status: 200 })
      }

      if (Array.isArray(parsed)) {
        bullets = parsed
      } else if (parsed.bullets && Array.isArray(parsed.bullets)) {
        bullets = parsed.bullets
        evalPeriod = parsed.evalPeriod || evalPeriod
        jobTitle = parsed.jobTitle || null
      }

      // Scan extracted text for critical PII (SSN, DODID) BEFORE returning
      const allText = bullets
        .map((b: any) => `${b.original || ''} ${b.translated || ''}`)
        .join(' ')

      const piiCheck = hasCriticalPII(allText)
      if (piiCheck.blocked) {
        return NextResponse.json({
          error: piiCheck.reason,
          piiBlocked: true,
          bullets: [],
        }, { status: 400 })
      }
    } catch (err) {
      console.error('JSON parse error:', err)
      parseError = err
      // Return empty array instead of failing
    }

    // Post-process bullets with our dictionary for any terms Claude missed
    const processedBullets = bullets.map(bullet => {
      const { translated: processedOriginal, unflaggedTerms: originalUnflagged } = translateMilitaryToCivilian(bullet.original || '')
      const { translated: processedTranslated, unflaggedTerms: translatedUnflagged } = translateMilitaryToCivilian(bullet.translated || bullet.original || '')

      return {
        ...bullet,
        original: processedOriginal,
        translated: processedTranslated,
        metrics: bullet.metrics || [],
        skills: bullet.skills || [],
        unflaggedTerms: [...new Set([...originalUnflagged, ...translatedUnflagged])],
      }
    }).filter(b => b.translated && b.translated.length > 20)

    // Save to database
    const { data: upload, error: uploadError } = await supabaseAdmin
      .from('eval_uploads')
      .insert({
        user_id: user.id,
        file_name: filename,
        eval_type: evalType,
        extracted_data: processedBullets,
        status: processedBullets.length > 0 ? 'complete' : 'failed',
      })
      .select()
      .single()

    if (uploadError) {
      console.error('Database error:', uploadError)
      return NextResponse.json({ error: 'Failed to save upload' }, { status: 500 })
    }

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 2000
    await logApiUsage(user.id, 'parse-eval', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'eval_uploads')

    return NextResponse.json({
      uploadId: upload.id,
      bullets: processedBullets,
      count: processedBullets.length,
      evalPeriod,
      jobTitle,
    })
  } catch (error) {
    console.error('Eval parse error:', error)
    return NextResponse.json({ error: 'Failed to parse evaluation' }, { status: 500 })
  }
}

// Detect media type from base64 header
function getMediaTypeFromBase64(base64: string): { mediaType: string; isImage: boolean } {
  if (base64.startsWith('JVBERi0')) return { mediaType: 'application/pdf', isImage: false }
  if (base64.startsWith('iVBORw0KGgo')) return { mediaType: 'image/png', isImage: true }
  if (base64.startsWith('/9j/')) return { mediaType: 'image/jpeg', isImage: true }
  if (base64.startsWith('R0lGOD')) return { mediaType: 'image/gif', isImage: true }
  if (base64.startsWith('UklGR')) return { mediaType: 'image/webp', isImage: true }
  // Default to PDF
  return { mediaType: 'application/pdf', isImage: false }
}

// Extract text from PDF or image using Claude's document/vision API
async function extractTextFromFile(base64Data: string): Promise<string> {
  // Strip data URL prefix if present (e.g., "data:application/pdf;base64,")
  let cleanBase64 = base64Data
  if (cleanBase64.includes(',')) {
    cleanBase64 = cleanBase64.split(',')[1]
  }
  // Remove any whitespace that might have been introduced
  cleanBase64 = cleanBase64.replace(/\s/g, '')

  // Detect file type from base64 header
  const { mediaType, isImage } = getMediaTypeFromBase64(cleanBase64)

  console.log('File base64 size:', cleanBase64.length, 'chars')
  console.log('Base64 starts with:', cleanBase64.substring(0, 20))
  console.log('Detected media type:', mediaType, 'isImage:', isImage)

  // Build content based on file type
  const fileContent = isImage
    ? {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: mediaType as 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp',
          data: cleanBase64,
        },
      }
    : {
        type: 'document' as const,
        source: {
          type: 'base64' as const,
          media_type: 'application/pdf' as const,
          data: cleanBase64,
        },
      }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          fileContent,
          {
            type: 'text',
            text: 'Extract ALL text from this military evaluation document. Return ONLY the raw text content exactly as it appears. Preserve all bullet points, rankings, dates, and performance comments. Do not summarize or modify - just extract the exact text.',
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  console.log('Extracted text length:', text.length)

  if (!text || text.trim().length === 0) {
    throw new Error('No text extracted - file may be scanned/image-based or corrupted')
  }

  return text
}

function getEvalTypeName(type: string): string {
  const names: Record<string, string> = {
    fitrep: 'Navy FITREP (Fitness Report)',
    chiefeval: 'Navy Chief Evaluation',
    ncoer: 'Army NCOER (Non-Commissioned Officer Evaluation Report)',
    oer: 'Officer Evaluation Report',
    epr: 'Air Force EPR (Enlisted Performance Report)',
    award: 'Military Award Citation',
  }
  return names[type] || 'Military Evaluation'
}
