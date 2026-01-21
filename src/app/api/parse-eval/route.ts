import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'

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

Your job is to identify and extract the strongest achievement bullets - statements that describe specific accomplishments, quantified results, and leadership examples.`

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
    const pdfText = await extractTextFromPDF(fileData)

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract text from PDF. Please ensure it is not a scanned image.' }, { status: 400 })
    }

    // Use Claude to extract bullets
    const prompt = `Extract achievement bullets from this ${getEvalTypeName(evalType)}.

DOCUMENT TEXT:
${pdfText.substring(0, 8000)} ${pdfText.length > 8000 ? '...[truncated]' : ''}

Instructions:
1. Find 5-15 of the STRONGEST achievement bullets
2. Focus on statements that include:
   - Quantified results (numbers, percentages, dollar amounts)
   - Leadership examples (led, managed, supervised)
   - Awards, recognition, or promotions mentioned
   - Specific accomplishments with impact
3. Extract the bullet as written (we'll translate it later)
4. Categorize each as: "leadership", "technical", or "achievement"

Return a JSON array with this structure:
[
  {
    "original": "exact text of the bullet from the document",
    "category": "leadership" | "technical" | "achievement"
  }
]

Return ONLY valid JSON, no markdown or explanation. If you cannot find any bullets, return an empty array [].`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (response.content[0] as { text: string }).text.trim()

    // Parse bullets from response
    let bullets: any[] = []
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        bullets = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // Return empty array instead of failing
    }

    // Save to database
    const { data: upload, error: uploadError } = await supabaseAdmin
      .from('eval_uploads')
      .insert({
        user_id: user.id,
        filename,
        eval_type: evalType,
        extracted_bullets: bullets,
        status: bullets.length > 0 ? 'complete' : 'failed',
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
      bullets,
      count: bullets.length,
    })
  } catch (error) {
    console.error('Eval parse error:', error)
    return NextResponse.json({ error: 'Failed to parse evaluation' }, { status: 500 })
  }
}

// Extract text from PDF using pdf-parse
async function extractTextFromPDF(base64Data: string): Promise<string> {
  try {
    // Dynamic import for pdf-parse (it has issues with static import in Next.js)
    const pdfParse = (await import('pdf-parse')).default

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
