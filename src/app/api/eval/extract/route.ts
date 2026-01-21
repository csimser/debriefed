import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'

const anthropic = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
              text: `You are an expert at translating military performance evaluation bullets into civilian resume language.

This is a ${evalType || 'military evaluation'} document.

## IMPORTANT RULES:

### 1. FIX OCR ERRORS
The input may have OCR mistakes. Common issues to fix:
- Letters misread (0/O, 1/I/l, S/5, rn/m, etc.)
- Merged words or extra spaces
- Garbled text that should be common military terms
- Broken words from line wraps (rejoin them)
- Excessive asterisks (*, ***, ****) - remove them

### 2. REMOVE ALL MILITARY JARGON
Replace with civilian equivalents. Common translations:
- "EP" / "Early Promote" / "Must Promote" → omit or say "top performer"
- "CPO Mess" / "Mess" → "senior leadership team"
- "DCPO" / "LCPO" / "DIVO" → "department supervisor" or "division leader"
- "3M" / "3M system" → "maintenance management system"
- "CSMP" → "maintenance compliance program"
- "QA" / "QM" → "quality assurance"
- "ATG" / "AFLOAT" → "external training organization"
- Ranks (SMC, SCPO, CPO, PO1, SSG, etc.) → "senior leader" or omit
- "Deckplate" → "hands-on" or "frontline"
- "INSURV" → "federal inspection" or "readiness inspection"
- "FITREP" / "NCOER" / "OER" / "EVAL" → omit (it's a performance evaluation)
- "Liberty" → "leave" or omit
- "TAD" / "TDY" → "temporary assignment"
- "PCS" → "permanent relocation"
- "LPO" → "team lead" or "supervisor"
- "Work center" → "department" or "team"
- "Billet" → "position" or "role"
- "Quarterdeck" → "reception" or omit
- "Shipmate" → "team member" or "colleague"

### 3. REMOVE PROMOTION LANGUAGE
Remove phrases like:
- "EP contender" / "select now" / "fast track"
- "promote immediately" / "my #1 of X"
- Any ranking or comparison statements

### 4. PRESERVE METRICS
Keep all numbers, percentages, dollar amounts, and quantifiable achievements:
- Budget amounts ($2.3M, $500K)
- Personnel counts (12-member team, 45 Sailors)
- Percentages (98% readiness, 100% compliance)
- Time savings (reduced processing time by 40%)
- Scores (achieved 98.5 on inspection)

### 5. PROFESSIONAL CIVILIAN TONE
- Write in active voice
- Results-focused
- Suitable for civilian employers
- Concise: 1-2 sentences max per bullet
- Remove fluff and excessive superlatives

### 6. STAR FORMAT
Transform bullets into Situation-Task-Action-Result format where possible.

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

## EXAMPLE TRANSFORMATIONS:

BEFORE: "****Supervised 12 member DC team during INSURV prep--achieved ZERO discrepancies across 47 inspection items****"
AFTER: "Led 12-member safety compliance team through rigorous federal inspection preparation, achieving zero deficiencies across 47 audited items and earning commendation from inspection authority"

BEFORE: "Hand selected to represent the CPO Mess as DCPO, coordinated all deckplate training evolutions for 450+ Sailors"
AFTER: "Selected by senior leadership to serve as department supervisor, coordinating all frontline training programs for 450+ personnel"

BEFORE: "Maintained 100% CSMP compliance across 3 work centers--drove zone inspections achieving zone average of 98.5"
AFTER: "Maintained 100% maintenance compliance across 3 departments, driving inspection scores to 98.5 average"

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
      if (parsed.bullets && Array.isArray(parsed.bullets)) {
        result = parsed
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

    // Clean bullets - remove any PII that might have slipped through
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

      return {
        ...bullet,
        original: cleanText(bullet.original || ''),
        translated: cleanText(bullet.translated || ''),
        metrics: bullet.metrics || [],
        skills: bullet.skills || [],
      }
    }).filter(b => b.translated && b.translated.length > 10)

    // DO NOT store the image - only return extracted data
    // The original image data is discarded after this request completes

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 4000
    await logApiUsage(user.id, 'eval-extract', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'eval_uploads')

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
