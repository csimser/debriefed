import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { translateMilitaryToCivilian } from '@/lib/constants/military-dictionary'
import { hasCriticalPII, redactMinorPII } from '@/lib/pii-scanner'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { canUseFeature, incrementUsage as incrementPeriodUsage, isAdmin, getUserEmail } from '@/lib/usage-service'

const anthropic = new Anthropic()

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const EXTRACTION_PROMPT = `You are extracting achievement bullets from a military evaluation image. Be EXTREMELY aggressive about:

1. REMOVING JUNK:
- Delete ALL asterisks (*, **, ***, ****)
- Delete ALL broken text fragments (random letters, partial words)
- Delete page numbers, headers, footers, form labels
- Delete signature blocks, dates, routing info
- Delete ranking statements like "RANKED 1 OF 5" or "TOP 10%"
- Delete any line under 30 characters
- Delete anything that looks like OCR garbage

2. FIX OCR ERRORS:
The input may have OCR mistakes. Common issues to fix:
- Letters misread (0/O, 1/I/l, S/5, rn/m, etc.)
- Merged words or extra spaces
- Garbled text that should be common military terms
- Broken words from line wraps (rejoin them)

3. TRANSLATING MILITARY JARGON:
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
- "CPO Mess" / "Mess" → "senior leadership team"
- "DCPO" / "LCPO" / "DIVO" → "department supervisor" or "division leader"
- "3M" / "3M system" → "maintenance management system"
- "CSMP" → "maintenance compliance program"
- "ATG" / "AFLOAT" → "external training organization"
- Ranks (SMC, SCPO, CPO, PO1, SSG, etc.) → "senior leader" or omit
- All acronyms must be spelled out or translated to civilian equivalents

4. REMOVE PROMOTION LANGUAGE:
Remove phrases like:
- "EP contender" / "select now" / "fast track"
- "promote immediately" / "my #1 of X"
- Any ranking or comparison statements

5. OUTPUT REQUIREMENTS:
- Return ONLY clean, civilian-ready bullets
- Each bullet must start with a strong action verb
- Each bullet must be a complete, professional sentence
- Preserve ALL numbers, percentages, and dollar amounts
- If you can't clean a bullet properly, skip it entirely
- Write in active voice, results-focused
- Suitable for civilian employers
- Concise: 1-2 sentences max per bullet

6. STAR FORMAT:
Transform bullets into Situation-Task-Action-Result format where possible.

## EXAMPLE TRANSFORMATIONS:

BEFORE: "****Supervised 12 member DC team during INSURV prep--achieved ZERO discrepancies across 47 inspection items****"
AFTER: "Led 12-member safety compliance team through rigorous federal inspection preparation, achieving zero deficiencies across 47 audited items and earning commendation from inspection authority"

BEFORE: "Hand selected to represent the CPO Mess as DCPO, coordinated all deckplate training evolutions for 450+ Sailors"
AFTER: "Selected by senior leadership to serve as department supervisor, coordinating all frontline training programs for 450+ personnel"

BEFORE: "Maintained 100% CSMP compliance across 3 work centers--drove zone inspections achieving zone average of 98.5"
AFTER: "Maintained 100% maintenance compliance across 3 departments, driving inspection scores to 98.5 average"`

/**
 * Get role-specific guidance for bullet translation
 */
function getTargetRoleGuidance(targetRole: string, targetIndustry: string): string {
  const role = targetRole?.toLowerCase() || ''
  const industry = targetIndustry?.toLowerCase() || ''

  // Administrative / Support roles
  if (role.includes('admin') || role.includes('support') || role.includes('assistant') ||
      role.includes('coordinator') || role.includes('clerk') || role.includes('office')) {
    return `- Emphasize: organization, coordination, documentation, scheduling, communication
- Use terms like: coordinated, organized, scheduled, documented, maintained records, processed, facilitated
- Translate military leadership as: office management, team coordination, process improvement
- Focus on: efficiency, accuracy, attention to detail, customer service, multi-tasking`
  }

  // Operations / Logistics roles
  if (role.includes('operations') || role.includes('logistics') || role.includes('supply') ||
      role.includes('warehouse') || role.includes('manufacturing') || industry.includes('logistics')) {
    return `- Emphasize: process optimization, supply chain, inventory management, workflow efficiency
- Use terms like: streamlined, optimized, reduced costs, improved throughput, managed inventory
- Translate military logistics as: supply chain management, vendor relations, asset tracking
- Focus on: efficiency gains, cost savings, quality control, safety compliance`
  }

  // IT / Cybersecurity roles
  if (role.includes('it') || role.includes('cyber') || role.includes('security') ||
      role.includes('network') || role.includes('software') || role.includes('tech') ||
      industry.includes('tech') || industry.includes('cyber')) {
    return `- Emphasize: technical skills, security protocols, system administration, compliance
- Use terms like: implemented, configured, secured, monitored, troubleshot, automated
- Translate military systems as: network infrastructure, information systems, security operations
- Focus on: uptime, security posture, incident response, technical certifications`
  }

  // Project Management roles
  if (role.includes('project') || role.includes('program') || role.includes('manager')) {
    return `- Emphasize: project delivery, stakeholder management, budget oversight, team leadership
- Use terms like: delivered, managed, led cross-functional teams, tracked milestones, controlled budgets
- Translate military operations as: project phases, resource allocation, risk management
- Focus on: on-time delivery, scope management, team development, strategic planning`
  }

  // Healthcare roles
  if (role.includes('health') || role.includes('medical') || role.includes('nurse') ||
      industry.includes('health') || industry.includes('medical')) {
    return `- Emphasize: patient care, compliance, safety protocols, medical terminology familiarity
- Use terms like: administered, monitored, documented, ensured compliance, coordinated care
- Translate military medical as: clinical operations, patient outcomes, regulatory compliance
- Focus on: patient safety, quality of care, HIPAA awareness, emergency response`
  }

  // Human Resources roles
  if (role.includes('hr') || role.includes('human resources') || role.includes('recruiting') ||
      role.includes('talent')) {
    return `- Emphasize: personnel management, training, policy compliance, employee development
- Use terms like: recruited, trained, developed, counseled, managed performance, ensured compliance
- Translate military personnel work as: talent management, employee relations, policy administration
- Focus on: retention, development programs, conflict resolution, organizational culture`
  }

  // Default / General civilian
  return `- Use general professional language suitable for any civilian employer
- Emphasize: leadership, results, teamwork, problem-solving, accountability
- Avoid IT/cyber-specific terminology unless the bullet specifically relates to technology
- Focus on: measurable results, transferable skills, professional growth`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pre-check usage limits and get target role for context-aware translations
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('target_role, target_industry, rating_mos, branch')
      .eq('user_id', user.id)
      .single()

    const targetRole = profile?.target_role || ''
    const targetIndustry = profile?.target_industry || ''

    // Build local crosswalk context for better translations (no AI call needed)
    let crosswalkContext = ''
    if (profile?.rating_mos) {
      const localResult = getCivilianJobs(profile.rating_mos, profile?.branch)
      if (localResult) {
        crosswalkContext = `\n## OCCUPATION CONTEXT (from crosswalk data)
The candidate's military specialty (${profile.rating_mos}) maps to these civilian roles: ${localResult.civilian_titles.join(', ')}
Industries: ${localResult.industries?.join(', ') || 'Various'}
Use this context to make translations more relevant to their career path.\n`
      }
    }

    // Check usage limits (period + daily) via canUseFeature
    const userEmail = await getUserEmail(user.id)
    if (!isAdmin(userEmail)) {
      const usageCheck = await canUseFeature(user.id, 'eval_uploads')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.reason || 'Usage limit reached',
          limitReached: true,
          details: {
            remaining: usageCheck.remaining,
            limit: usageCheck.limit,
            used: usageCheck.used,
          }
        }, { status: 403 })
      }
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const evalType = formData.get('evalType') as string

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaType = imageFile.type as 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp'

    // Use Claude Vision to extract and translate text
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `${EXTRACTION_PROMPT}

This is a ${evalType || 'military evaluation'} document.
${crosswalkContext}${targetRole || targetIndustry ? `
## TARGET CAREER CONTEXT
The candidate is targeting: ${targetRole || 'general civilian'}${targetIndustry ? ` in ${targetIndustry}` : ''}.

IMPORTANT: Tailor translations toward this target role:
${getTargetRoleGuidance(targetRole, targetIndustry)}
` : ''}

## OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "bullets": [
    {
      "original": "The raw text extracted from the eval (cleaned of OCR artifacts)",
      "translated": "The STAR-formatted civilian version",
      "metrics": ["$2.3M budget", "12 personnel", "98% readiness"],
      "skills": ["Project Management", "Team Leadership", "Budget Management"]
    }
  ],
  "evalPeriod": {
    "startDate": "YYYY-MM" or null if not found,
    "endDate": "YYYY-MM" or null if not found
  },
  "jobTitle": "Extracted job title/billet if visible" or null
}

If the image is too garbled to extract anything useful, return: {"error": "Unable to extract clean bullets from this document. Please try a clearer scan."}

Return ONLY the JSON object, no other text or markdown formatting.`,
            },
          ],
        },
      ],
    })

    // Parse the response
    const textContent = response.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 })
    }

    let result = {
      bullets: [] as Array<{
        original: string
        translated: string
        metrics: string[]
        skills: string[]
        unflaggedTerms?: string[]
      }>,
      evalPeriod: { startDate: null as string | null, endDate: null as string | null },
      jobTitle: null as string | null,
    }

    try {
      // Try to parse as JSON - handle potential markdown code blocks
      let jsonText = textContent.text.trim()
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

      if (parsed.bullets && Array.isArray(parsed.bullets)) {
        result = parsed

        // Scan extracted text for critical PII (SSN, DODID) BEFORE returning
        const allText = parsed.bullets
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
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // If not valid JSON, try to extract bullets manually
      const lines = textContent.text
        .split('\n')
        .map(line => line.replace(/^[-•*]+\s*/, '').replace(/\*+/g, '').trim())
        .filter(line => line.length > 20 && !line.startsWith('{') && !line.startsWith('}'))

      result.bullets = lines.slice(0, 10).map(line => ({
        original: line,
        translated: line,
        metrics: [],
        skills: [],
      }))
    }

    // Post-process bullets with our dictionary for any terms Claude missed
    result.bullets = result.bullets.map(bullet => {
      const cleanText = (text: string) => {
        // Remove SSN patterns (XXX-XX-XXXX)
        text = text.replace(/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, '[REDACTED]')
        // Remove DOD ID patterns (10 digits)
        text = text.replace(/\b\d{10}\b/g, '[REDACTED]')
        // Remove DOB patterns preceded by keywords
        text = text.replace(/\b(born|DOB|dob|Date of Birth|D\.O\.B)[:\s]*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi, '')
        // Remove phone numbers
        text = text.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '')
        // Remove excessive asterisks
        text = text.replace(/\*{2,}/g, '')
        // Clean up multiple spaces
        text = text.replace(/\s{2,}/g, ' ')
        return text.trim()
      }

      const cleanedOriginal = cleanText(bullet.original || '')
      const cleanedTranslated = cleanText(bullet.translated || '')

      // Apply military dictionary translation
      const { translated: processedOriginal, unflaggedTerms: originalUnflagged } = translateMilitaryToCivilian(cleanedOriginal)
      const { translated: processedTranslated, unflaggedTerms: translatedUnflagged } = translateMilitaryToCivilian(cleanedTranslated)

      return {
        ...bullet,
        original: processedOriginal,
        translated: processedTranslated,
        metrics: bullet.metrics || [],
        skills: bullet.skills || [],
        unflaggedTerms: [...new Set([...originalUnflagged, ...translatedUnflagged])],
      }
    }).filter(b => b.translated && b.translated.length > 10)

    // DO NOT store the image - only return extracted data
    // The original image data is discarded after this request completes

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 4000
    await logApiUsage(user.id, 'eval-extract', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'eval_uploads')
    await incrementPeriodUsage(user.id, 'eval_uploads')

    return NextResponse.json({
      ...result,
      evalType,
      extractedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: error?.message || 'Extraction failed' },
      { status: 500 }
    )
  }
}
