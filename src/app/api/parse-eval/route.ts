export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'
import { translateMilitaryToCivilian, cleanEvalText } from '@/lib/constants/military-dictionary'

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

    // Check usage limits before processing
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, email')
      .eq('user_id', user.id)
      .single()

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

    // Decode base64 PDF and extract text
    let pdfText = await extractTextFromPDF(fileData)

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract text from PDF. Please ensure it is not a scanned image.' }, { status: 400 })
    }

    // Pre-clean the extracted text
    pdfText = cleanEvalText(pdfText)

    // Use Claude to extract bullets
    const prompt = `${EXTRACTION_PROMPT}

DOCUMENT TYPE: ${getEvalTypeName(evalType)}

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

Return JSON array:
[
  {
    "original": "the cleaned text from the document",
    "translated": "the civilian-translated version",
    "metrics": ["extracted numbers/percentages"],
    "skills": ["relevant civilian skills"],
    "category": "leadership" | "technical" | "achievement"
  }
]

Return ONLY valid JSON, no markdown or explanation. If the text is too garbled to extract anything useful, return: {"error": "Unable to extract clean bullets from this document. Please try a clearer scan."}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (response.content[0] as { text: string }).text.trim()

    // Parse bullets from response
    let bullets: any[] = []
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
        filename,
        eval_type: evalType,
        extracted_bullets: processedBullets,
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
    })
  } catch (error) {
    console.error('Eval parse error:', error)
    return NextResponse.json({ error: 'Failed to parse evaluation' }, { status: 500 })
  }
}

// Extract text from PDF using pdf-parse
async function extractTextFromPDF(base64Data: string): Promise<string> {
  try {
    // Use require for pdf-parse (works better with Next.js)
    const pdfParse = require('pdf-parse/lib/pdf-parse.js')

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')

    // Parse PDF
    const data = await pdfParse(buffer)

    return data.text || ''
  } catch (error) {
    console.error('PDF parse error:', error)
    return ''
  }
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
