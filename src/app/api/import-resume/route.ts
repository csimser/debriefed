import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage } from '@/lib/usage-tracking'
import { ADMIN_BYPASS_EMAILS } from '@/lib/pricing-config'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'

const anthropic = new Anthropic()

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const EXTRACTION_PROMPT = `You are an expert resume parser. Extract structured data from the following resume.

## INSTRUCTIONS:
1. Extract ALL information you can find, being thorough but accurate
2. For work experience, capture each job with its bullets/accomplishments
3. Determine if each job is military or civilian based on context clues:
   - Military indicators: USS, military rank, base/post names, branches (Army, Navy, Air Force, Marines, Coast Guard), military acronyms
   - Civilian indicators: regular company names, civilian job titles
4. Preserve the original text of accomplishment bullets
5. Parse dates in YYYY-MM format where possible
6. Do NOT include first_name, last_name, or email in the response (these are locked fields)

## OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "contact": {
    "phone": "string or null",
    "city": "string or null",
    "state": "2-letter state code or null",
    "linkedin_url": "string or null"
  },
  "professional_summary": "string or null - the summary/objective section if present",
  "experiences": [
    {
      "employment_type": "military" or "civilian",
      "job_title": "original job title",
      "civilian_title": "translated civilian title if military, otherwise same as job_title",
      "organization": "company/unit name",
      "city": "string or null",
      "state": "2-letter state code or null",
      "start_date": "YYYY-MM or null",
      "end_date": "YYYY-MM or null (null if current)",
      "is_current": boolean,
      "bullets": ["accomplishment 1", "accomplishment 2", ...]
    }
  ],
  "education": [
    {
      "degree": "Bachelor's, Master's, etc.",
      "field_of_study": "Computer Science, etc.",
      "institution": "school name",
      "graduation_date": "YYYY-MM or YYYY",
      "gpa": "string or null"
    }
  ],
  "certifications": [
    {
      "name": "certification name",
      "issuing_org": "issuing organization",
      "date_earned": "YYYY-MM or null",
      "expiration_date": "YYYY-MM or null"
    }
  ],
  "skills": ["skill1", "skill2", ...],
  "clearance": "None | Confidential | Secret | Top Secret | TS/SCI | null",
  "military_info": {
    "branch": "Army | Navy | Air Force | Marines | Coast Guard | Space Force | null",
    "rank": "string or null",
    "years_of_service": number or null
  }
}

Return ONLY the JSON object, no other text or markdown formatting.
If you cannot parse something, use null rather than guessing.`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for admin bypass check
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('user_id', user.id)
      .single()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file type
    const isPDF = file.type === 'application/pdf'
    const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!isPDF && !isDOCX) {
      return NextResponse.json({ error: 'Please upload a PDF or DOCX file' }, { status: 400 })
    }

    // Extract text from file
    let resumeText = ''

    try {
      if (isPDF) {
        resumeText = await extractTextFromPDF(file)
      } else if (isDOCX) {
        resumeText = await extractTextFromDOCX(file)
      }
    } catch (extractError: any) {
      console.error('File extraction failed:', extractError)
      return NextResponse.json({
        error: `Could not read file: ${extractError?.message || 'Unknown extraction error'}. Try a different format.`
      }, { status: 400 })
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({
        error: 'Could not extract text from file. Please ensure it is not a scanned image or try a different format.'
      }, { status: 400 })
    }

    // Use Claude to parse the resume
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `${EXTRACTION_PROMPT}

## RESUME TEXT:
${resumeText.substring(0, 15000)}${resumeText.length > 15000 ? '\n...[truncated]' : ''}`
        }
      ]
    })

    // Parse the response
    const textContent = response.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
    }

    let result
    try {
      // Handle potential markdown code blocks
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

      result = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json({ error: 'Failed to parse resume data' }, { status: 500 })
    }

    // LOCKED FIELDS: first_name, last_name, email are set at registration
    // and must not be overwritten by resume import per platform policy
    if (result.contact) {
      delete result.contact.first_name
      delete result.contact.last_name
      delete result.contact.email
    }

    console.log('=== RESUME PARSE RESULT ===')
    console.log('Contact fields:', result.contact ? Object.keys(result.contact).filter(k => result.contact[k]) : 'none')
    console.log('Professional summary:', result.professional_summary ? 'yes' : 'no')
    console.log('Experiences:', result.experiences?.length || 0)
    console.log('Education:', result.education?.length || 0)
    console.log('Certifications:', result.certifications?.length || 0)
    console.log('Skills:', result.skills?.length || 0)
    console.log('Military info:', result.military_info || 'none')
    console.log('Clearance:', result.clearance || 'none')

    // Post-process: validate/supplement civilian titles using local crosswalk
    if (result.experiences && Array.isArray(result.experiences)) {
      console.log('Experiences to import:', result.experiences.length)

      for (const exp of result.experiences) {
        if (exp.employment_type === 'military' && exp.job_title) {
          // Try to extract MOS/rating from job title and look up civilian equivalent
          const codeMatch = exp.job_title.match(/\b(\d{2}[A-Z]\d?|\d{4}|[A-Z]{2,4}|\d[A-Z]\d+X?\d*)\b/)
          if (codeMatch) {
            const localResult = getCivilianJobs(
              codeMatch[1],
              result.military_info?.branch || undefined
            )
            if (localResult && localResult.civilian_titles?.length > 0) {
              // Use local crosswalk civilian title if AI didn't provide one or gave a generic one
              if (!exp.civilian_title || exp.civilian_title === exp.job_title) {
                exp.civilian_title = localResult.civilian_titles[0]
              }
            }
          }
        }
      }
    }

    // Log what fields will be available for profile update
    const profileFieldsAvailable = []
    if (result.contact?.phone) profileFieldsAvailable.push('phone')
    if (result.contact?.city) profileFieldsAvailable.push('city')
    if (result.contact?.state) profileFieldsAvailable.push('state')
    if (result.contact?.linkedin_url) profileFieldsAvailable.push('linkedin_url')
    if (result.professional_summary) profileFieldsAvailable.push('professional_summary')
    if (result.military_info?.branch) profileFieldsAvailable.push('branch')
    if (result.military_info?.rank) profileFieldsAvailable.push('rank')
    if (result.clearance) profileFieldsAvailable.push('clearance')
    console.log('Profile fields available for update:', profileFieldsAvailable)
    console.log('Education entries:', result.education?.length || 0)
    console.log('Certifications:', result.certifications?.length || 0)
    console.log('Skills:', result.skills?.length || 0)

    // Track API usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 4000
    await logApiUsage(user.id, 'import-resume', tokensUsed, 'claude-sonnet-4-20250514')

    return NextResponse.json({
      success: true,
      data: result,
      extractedTextLength: resumeText.length,
    })
  } catch (error: any) {
    console.error('Resume import error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to import resume' }, { status: 500 })
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')

  console.log('PDF size:', arrayBuffer.byteLength, 'bytes')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64,
            },
          },
          {
            type: 'text',
            text: 'Extract ALL text from this resume PDF. Return ONLY the raw text content, preserving the structure (name, contact info, experience, education, skills). Do not summarize or modify - just extract the exact text.',
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  console.log('Extracted text length:', text.length)

  if (!text || text.trim().length === 0) {
    throw new Error('Could not extract text from PDF')
  }

  return text
}

async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const mammoth = require('mammoth')
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) })
    return result.value || ''
  } catch (error) {
    console.error('DOCX parse error:', error)
    return ''
  }
}
