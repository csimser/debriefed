/**
 * Eval bullet extraction — browser ports of the old /api/parse-eval and
 * /api/eval/extract routes.
 *
 * `parseEval` is the single-pass PDF/image path (jargon dictionary injected
 * into the prompt); `extractEvalImage` is the image-only path with its own
 * OCR-focused prompt. Both run Claude vision on the user's key, then
 * post-process with the bundled dictionary, PII redaction, and OCR cleanup.
 * Nothing is persisted here — callers save history locally from the
 * returned data.
 */
import { translateMilitaryToCivilian } from '@/lib/constants/military-dictionary'
import { dictionaryTranslate } from '@/lib/translation-engine'
import { hasCriticalPII } from '@/lib/pii-scanner'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import militaryTermsDictionary from '@/lib/debriefed-token-saver/military-terms-dictionary.json'
import actionVerbsLibrary from '@/lib/debriefed-token-saver/action-verbs-library.json'
import { getProfile } from '@/lib/storage'
import {
  callWithEscalation,
  getAnthropicClient,
  trackTokens,
  type ModelUsed,
} from '@/lib/ai/client'

/**
 * Build compact jargon reference from the token-saver dictionary.
 * Injected into the extraction prompt so Claude has the full translation table.
 */
function buildJargonReference(): string {
  const sections: string[] = []

  const acronymList = Object.entries(militaryTermsDictionary.acronyms)
    .map(([k, v]) => `${k} → ${v}`)
    .join(', ')
  sections.push(`ACRONYM TRANSLATIONS:\n${acronymList}`)

  const termList = Object.entries(militaryTermsDictionary.terms)
    .map(([k, v]) => `${k} → ${v}`)
    .join(', ')
  sections.push(`TERM TRANSLATIONS:\n${termList}`)

  const unitList = Object.entries(militaryTermsDictionary.unit_types)
    .map(([k, v]) => `${k} → ${v}`)
    .join(', ')
  sections.push(`UNIT SIZE TRANSLATIONS:\n${unitList}`)

  const equipList = Object.entries(militaryTermsDictionary.equipment_to_civilian)
    .map(([k, v]) => `${k} → ${v}`)
    .join(', ')
  sections.push(`EQUIPMENT TRANSLATIONS:\n${equipList}`)

  const phraseList = Object.entries(militaryTermsDictionary.action_phrases)
    .map(([k, v]) => `${k} → ${v}`)
    .join(', ')
  sections.push(`EVAL PHRASE TRANSLATIONS:\n${phraseList}`)

  return sections.join('\n\n')
}

function buildActionVerbReference(): string {
  return Object.entries(actionVerbsLibrary)
    .filter(([key]) => key !== 'meta')
    .map(([, data]: [string, any]) => {
      const topVerbs = (data as any).verbs.slice(0, 12).join(', ')
      return `- ${(data as any).description}: ${topVerbs}`
    })
    .join('\n')
}

// Pre-built references (loaded once at module init from JSON dictionaries)
const JARGON_REFERENCE = buildJargonReference()
const ACTION_VERB_REFERENCE = buildActionVerbReference()

/**
 * Get role-specific guidance for bullet translation (parse-eval variant)
 */
function getParseEvalRoleGuidance(targetRole: string, targetIndustry: string): string {
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

const SYSTEM_PROMPT = `You are an expert military-to-civilian resume writer who specializes in extracting accomplishment bullets from military performance evaluations and award citations.

You understand the format of:
- Navy FITREPs and Chief Evals
- Army NCOERs and OERs
- Air Force EPRs
- Award citations (NAM, COM, MSM, etc.)

Your job is to extract every meaningful accomplishment and translate it into a strong, quantified civilian resume bullet.`

const EXTRACTION_PROMPT = `Extract accomplishment bullets from this military evaluation document. Follow these rules precisely:

## 1. EXTRACT EVERY ACCOMPLISHMENT
- Find ALL quantifiable accomplishments, results, awards, and leadership examples
- Focus on statements with numbers, percentages, dollar amounts, timelines, or personnel counts
- Include awards and recognition mentioned
- Combine related accomplishments if they tell one story
- Skip filler language ("he/she is a", "demonstrated ability to", "proven track record")
- Skip bullets with no measurable impact or specific accomplishment
- If the same accomplishment appears in multiple sections, extract it only once

## 2. TRANSLATE TO CIVILIAN LANGUAGE
Remove ALL military jargon, acronyms, and terminology. Use this comprehensive translation dictionary — if a term appears here, you MUST use the civilian translation provided:

${JARGON_REFERENCE}

Rules:
- NEVER leave military acronyms unexplained in the translated bullet
- If a term is not in this dictionary, translate it to the closest civilian equivalent
- Do NOT use "Sailor", "Marine", "Airman", "Soldier" — use "team member", "employee", or "professional"
- Translate ALL rank references to civilian equivalents (e.g., CPO → Department Supervisor, LT → Senior Manager, SGT → Team Lead)

## 3. FORMAT AS STRONG RESUME BULLETS
Each bullet must follow this pattern:
[Strong Action Verb] + [What was done] + [Scope/Scale] + [Result/Impact]

Choose action verbs from these categories based on the bullet content:
${ACTION_VERB_REFERENCE}

Example input: "Led 42 work centers through INSURV prep, reducing CSMP backlog from 400 to 86 actions"
Example output: "Directed maintenance readiness program across 42 departments, reducing compliance backlog by 78% (from 400 to 86 outstanding items) ahead of federal regulatory inspection"

## 4. PRESERVE TRUTH
- Keep numbers, percentages, dollar amounts, and timelines EXACTLY as stated
- Do NOT fabricate or embellish numbers, outcomes, or accomplishments
- If the eval says "significantly improved" with no number, use "improved" without a fake statistic
- Only extract what is actually stated or directly implied in the eval

## TARGET ROLE GUIDANCE (if provided):
{TARGET_ROLE_GUIDANCE}`

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

/** Shared OCR/PII cleanup applied to every extracted bullet. */
function cleanText(text: string): string {
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
  // Fix OCR concatenation: insert space between letter→digit and digit→letter boundaries
  text = text.replace(/([a-zA-Z])(\d)/g, '$1 $2')
  text = text.replace(/(\d)([a-zA-Z])/g, (match, digit, letter) => {
    if (/^[MBKk%]$/.test(letter)) return match
    if (/^(st|nd|rd|th)/.test(text.slice(text.indexOf(match) + match.length - 1))) return match
    return `${digit} ${letter}`
  })
  // Remove duplicate consecutive phrases (OCR artifact)
  text = text.replace(/\b((?:\S+\s+){2,}\S+)\s+\1\b/gi, '$1')
  text = text.replace(/\b(\S+\s+\S+)\s+\1\b/gi, '$1')
  // Clean up multiple spaces
  text = text.replace(/\s{2,}/g, ' ')
  return text.trim()
}

/** Split concatenated metric strings and fix letter/digit OCR joins. */
function cleanMetrics(metrics: string[]): string[] {
  if (!metrics || !Array.isArray(metrics)) return []
  const cleaned: string[] = []
  for (const m of metrics) {
    const parts = m.split(/(?<=[a-zA-Z])\s*(?=\d+\s+[a-zA-Z])/).map(s => s.trim()).filter(Boolean)
    if (parts.length > 1) {
      cleaned.push(...parts)
    } else {
      cleaned.push(m.replace(/([a-zA-Z])(\d)/g, '$1 $2').replace(/(\d)([a-zA-Z])/g, '$1 $2').trim())
    }
  }
  return cleaned
}

export interface EvalParseInput {
  fileBase64: string
  mediaType: string
  fileName?: string
  evalType?: string
}

export interface EvalBullet {
  original: string
  translated: string
  metrics: string[]
  skills: string[]
  category?: string
  unflaggedTerms?: string[]
}

export interface EvalParseResult {
  bullets: EvalBullet[]
  count: number
  evalPeriod?: { startDate: string | null; endDate: string | null }
  jobTitle?: string
  piiWarning?: string
  model_used: ModelUsed
}

/**
 * Single-pass eval extraction (PDF or image) — port of POST /api/parse-eval.
 * Returns everything the caller needs to save eval history locally; nothing
 * is persisted here.
 */
export async function parseEval(input: EvalParseInput): Promise<EvalParseResult> {
  const { fileBase64, evalType } = input

  if (!fileBase64 || !evalType) {
    throw new Error('Missing required fields')
  }

  // Profile context for role-aware translations (local storage, may be null)
  const profile = getProfile()
  const targetRole = (profile?.target_role as string) || ''
  const targetIndustry = (profile?.target_industry as string) || ''

  // Build local crosswalk context for better translations (no AI call needed)
  let crosswalkContext = ''
  if (profile?.rating_mos) {
    const localResult = getCivilianJobs(profile.rating_mos, profile?.branch || undefined)
    if (localResult) {
      crosswalkContext = `\nOCCUPATION CONTEXT: The candidate's specialty (${profile.rating_mos}) maps to: ${localResult.civilian_titles.join(', ')}. Industries: ${localResult.industries?.join(', ') || 'Various'}.\n`
    }
  }

  // Clean base64 data — strip data URL prefix if present
  let cleanBase64 = fileBase64
  if (cleanBase64.includes(',')) {
    cleanBase64 = cleanBase64.split(',')[1]
  }
  cleanBase64 = cleanBase64.replace(/\s/g, '')

  // Detect file type
  const { mediaType, isImage } = getMediaTypeFromBase64(cleanBase64)

  // Build the document/image content block for vision
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

  // Build the full extraction + translation prompt
  const roleGuidance = getParseEvalRoleGuidance(targetRole, targetIndustry)
  const promptWithGuidance = EXTRACTION_PROMPT.replace('{TARGET_ROLE_GUIDANCE}', roleGuidance)

  const textPrompt = `${promptWithGuidance}

DOCUMENT TYPE: ${getEvalTypeName(evalType)}
${crosswalkContext}${targetRole ? `\nTARGET ROLE: ${targetRole}${targetIndustry ? ` in ${targetIndustry}` : ''}` : ''}

Extract 5-15 of the strongest accomplishment bullets from the attached document. For each bullet, return:
- "original": the relevant text from the eval (cleaned of OCR junk, asterisks, form labels)
- "translated": the civilian resume bullet version (fully translated, action verb first)
- "metrics": array of extracted numbers/percentages/dollar amounts
- "skills": array of relevant civilian skills demonstrated
- "category": "leadership", "technical", or "achievement"

Return a JSON object:
{
  "bullets": [
    {
      "original": "cleaned text from the document",
      "translated": "civilian resume bullet version",
      "metrics": ["42 departments", "78% reduction"],
      "skills": ["Program Management", "Process Improvement"],
      "category": "leadership"
    }
  ],
  "evalPeriod": {
    "startDate": "YYYY-MM or null",
    "endDate": "YYYY-MM or null"
  },
  "jobTitle": "extracted job title or null"
}

Return ONLY valid JSON, no markdown or explanation. ALWAYS extract at least 3-5 bullets even if document quality is poor. Only return an error JSON if the document is completely unreadable: {"error": "description"}`

  // Single-pass: send document directly with full extraction + translation prompt
  const { response, model_used } = await callWithEscalation(
    getAnthropicClient(),
    {
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            fileContent,
            {
              type: 'text',
              text: textPrompt,
            },
          ],
        },
      ],
    },
    { expectsJson: true }
  )

  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  const text = (response.content[0] as { text: string }).text.trim()

  // Parse bullets from response
  let bullets: any[] = []
  let evalPeriod: { startDate: string | null; endDate: string | null } = { startDate: null, endDate: null }
  let jobTitle: string | null = null
  let piiWarning: string | null = null
  let documentError: string | null = null

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

    // Check for error response (the old route returned { error, bullets: [] })
    if (parsed.error) {
      documentError = parsed.error
    }

    if (Array.isArray(parsed)) {
      bullets = parsed
    } else if (parsed.bullets && Array.isArray(parsed.bullets)) {
      bullets = parsed.bullets
      evalPeriod = parsed.evalPeriod || evalPeriod
      jobTitle = parsed.jobTitle || null
    }

    // Scan extracted text for critical PII (SSN, DODID) — warn, don't block
    // PII patterns are auto-redacted by cleanText() during post-processing below
    const allText = bullets
      .map((b: any) => `${b.original || ''} ${b.translated || ''}`)
      .join(' ')

    const piiCheck = hasCriticalPII(allText)
    if (piiCheck.blocked) {
      const detected = (piiCheck.reason || '').replace(/\.\s*Please redact and retry\.?/, '')
      piiWarning = `We detected personal information in your document (${detected}). It has been automatically redacted. Your original document was not stored.`
    }
  } catch (err) {
    console.error('JSON parse error:', err)
    // Return empty array instead of failing
  }

  if (documentError) {
    throw new Error(documentError)
  }

  // Post-process bullets with our dictionary for any terms Claude missed
  const processedBullets = (await Promise.all(bullets.map(async (bullet) => {
    const cleanedOriginal = cleanText(bullet.original || '')
    const cleanedTranslated = cleanText(bullet.translated || bullet.original || '')

    // Use shared translation engine (phrase-first + jargon + constants)
    const [dictOriginal, dictTranslated] = await Promise.all([
      dictionaryTranslate(cleanedOriginal),
      dictionaryTranslate(cleanedTranslated),
    ])
    const processedOriginal = dictOriginal.translated
    const processedTranslated = dictTranslated.translated
    // Legacy function for unflagged term detection
    const { unflaggedTerms: originalUnflagged } = translateMilitaryToCivilian(processedOriginal)
    const { unflaggedTerms: translatedUnflagged } = translateMilitaryToCivilian(processedTranslated)

    return {
      ...bullet,
      original: processedOriginal,
      translated: processedTranslated,
      metrics: cleanMetrics(bullet.metrics),
      skills: bullet.skills || [],
      unflaggedTerms: [...new Set([...originalUnflagged, ...translatedUnflagged])],
    }
  }))).filter(b => b.translated && b.translated.length > 20)

  return {
    bullets: processedBullets,
    count: processedBullets.length,
    evalPeriod,
    jobTitle: jobTitle || undefined,
    ...(piiWarning ? { piiWarning } : {}),
    model_used,
  }
}

const IMAGE_EXTRACTION_PROMPT = `You are extracting achievement bullets from a military evaluation image. Be EXTREMELY aggressive about:

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
 * Get role-specific guidance for bullet translation (eval/extract variant)
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

/**
 * Image-only eval extraction — port of POST /api/eval/extract.
 * The upload modal uses this for image files (parseEval handles PDFs).
 */
export async function extractEvalImage(input: EvalParseInput): Promise<EvalParseResult> {
  const { fileBase64, mediaType, evalType } = input

  if (!fileBase64) {
    throw new Error('No image provided')
  }

  // Validate image format is supported by Claude Vision
  const supportedImageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  if (!supportedImageTypes.includes(mediaType)) {
    throw new Error(`Unsupported image format (${mediaType || 'unknown'}). Please convert to PNG or JPEG first, or take a screenshot of the document.`)
  }

  // Profile context for role-aware translations (local storage, may be null)
  const profile = getProfile()
  const targetRole = (profile?.target_role as string) || ''
  const targetIndustry = (profile?.target_industry as string) || ''

  // Build local crosswalk context for better translations (no AI call needed)
  let crosswalkContext = ''
  if (profile?.rating_mos) {
    const localResult = getCivilianJobs(profile.rating_mos, profile?.branch || undefined)
    if (localResult) {
      crosswalkContext = `\n## OCCUPATION CONTEXT (from crosswalk data)
The candidate's military specialty (${profile.rating_mos}) maps to these civilian roles: ${localResult.civilian_titles.join(', ')}
Industries: ${localResult.industries?.join(', ') || 'Various'}
Use this context to make translations more relevant to their career path.\n`
    }
  }

  // Clean base64 data — strip data URL prefix if present
  let base64 = fileBase64
  if (base64.includes(',')) {
    base64 = base64.split(',')[1]
  }
  base64 = base64.replace(/\s/g, '')

  // Use Claude Vision to extract and translate text
  const { response, model_used } = await callWithEscalation(
    getAnthropicClient(),
    {
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `${IMAGE_EXTRACTION_PROMPT}

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
    },
    { expectsJson: true }
  )

  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  // Parse the response
  const textContent = response.content.find(c => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Failed to extract text')
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
  let piiWarning: string | null = null
  let documentError: string | null = null

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

    // Check for error response (the old route returned { error, bullets: [] })
    if (parsed.error) {
      documentError = parsed.error
    }

    if (parsed.bullets && Array.isArray(parsed.bullets)) {
      result = parsed

      // Scan extracted text for critical PII (SSN, DODID) BEFORE returning
      const allText = parsed.bullets
        .map((b: any) => `${b.original || ''} ${b.translated || ''}`)
        .join(' ')

      const piiCheck = hasCriticalPII(allText)
      if (piiCheck.blocked) {
        const detected = (piiCheck.reason || '').replace(/\.\s*Please redact and retry\.?/, '')
        piiWarning = `We detected personal information in your document (${detected}). It has been automatically redacted. Your original document was not stored.`
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

  if (documentError) {
    throw new Error(documentError)
  }

  // Post-process bullets with our dictionary for any terms Claude missed
  result.bullets = await Promise.all(result.bullets.map(async (bullet) => {
    const cleanedOriginal = cleanText(bullet.original || '')
    const cleanedTranslated = cleanText(bullet.translated || '')

    // Apply shared translation engine (phrase-first + jargon + constants)
    const [dictOriginal, dictTranslated] = await Promise.all([
      dictionaryTranslate(cleanedOriginal),
      dictionaryTranslate(cleanedTranslated),
    ])
    const processedOriginal = dictOriginal.translated
    const processedTranslated = dictTranslated.translated
    // Also run legacy function for unflagged term detection
    const { unflaggedTerms: originalUnflagged } = translateMilitaryToCivilian(processedOriginal)
    const { unflaggedTerms: translatedUnflagged } = translateMilitaryToCivilian(processedTranslated)

    return {
      ...bullet,
      original: processedOriginal,
      translated: processedTranslated,
      metrics: cleanMetrics(bullet.metrics),
      skills: bullet.skills || [],
      unflaggedTerms: [...new Set([...originalUnflagged, ...translatedUnflagged])],
    }
  })).then(bullets => bullets.filter(b => b.translated && b.translated.length > 10))

  // DO NOT store the image - only return extracted data
  // The original image data is discarded after this call completes

  return {
    bullets: result.bullets,
    count: result.bullets.length,
    evalPeriod: result.evalPeriod,
    jobTitle: result.jobTitle || undefined,
    ...(piiWarning ? { piiWarning } : {}),
    model_used,
  }
}
