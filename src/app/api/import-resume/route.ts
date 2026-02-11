import { NextRequest, NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage } from '@/lib/usage-tracking'
import { ADMIN_BYPASS_EMAILS } from '@/lib/pricing-config'
import { canUseFeature, incrementUsage } from '@/lib/usage-service'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'

const anthropic = new Anthropic()

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const EXTRACTION_PROMPT = `Extract ALL information from this resume. Return ONLY valid JSON with this structure. Extract whatever exists - leave fields as null if not found:

{
  "contact": {
    "phone": "string or null",
    "city": "string or null",
    "state": "2-letter state code or null",
    "linkedin_url": "string or null"
  },
  "professional_summary": "string or null - the summary/objective paragraph at the top",
  "experiences": [
    {
      "job_title": "exact title from resume",
      "civilian_title": "translated civilian title if military, otherwise same as job_title",
      "organization": "company or military unit name",
      "employment_type": "military or civilian - infer from context",
      "city": "string or null",
      "state": "2-letter state code or null",
      "start_date": "YYYY-MM-DD format, use -01 for day if only month/year shown",
      "end_date": "YYYY-MM-DD or null if current",
      "is_current": true or false,
      "bullets": ["each accomplishment bullet as a string"]
    }
  ],
  "education": [
    {
      "degree_type": "High School, Associate, Bachelor, Master, Doctorate, or Trade/Technical",
      "field_of_study": "string or null",
      "school_name": "string",
      "graduation_year": "YYYY string or null"
    }
  ],
  "certifications": [
    {
      "name": "certification name",
      "issuing_organization": "issuer or null"
    }
  ],
  "skills": [
    {
      "name": "skill name",
      "category": "technical, professional, leadership, or software"
    }
  ],
  "clearance": "None | Confidential | Secret | Top Secret | TS/SCI | null",
  "military_info": {
    "branch": "Army | Navy | Air Force | Marines | Coast Guard | Space Force | null",
    "rank": "string or null",
    "years_of_service": number or null
  }
}

Rules:
- Extract EVERY job, even if formatting varies
- If multiple certs are listed on one line, split them into separate entries
- If a skill contains "|" or "/", split into separate skills. Example: "IT | Cybersecurity Compliance" becomes two skills: {"name":"IT","category":"technical"} and {"name":"Cybersecurity Compliance","category":"technical"}. Keep "&" together (e.g. "Training & Development" is one skill).
- For military resumes, set employment_type to "military" for military jobs
- Infer city/state from location if provided
- If dates show "Mar. 2006" convert to "2006-03-01"
- If dates show "2006" alone, use "2006-01-01"
- If dates show "Present" or "Current" set end_date to null and is_current to true
- Do NOT include first_name, last_name, or email (these are locked fields)
- Return ONLY the JSON, no markdown, no backticks, no explanation`

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

    // Check resume import usage limit (admin bypass handled inside canUseFeature)
    if (!profile?.email || !ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      const usageCheck = await canUseFeature(user.id, 'resume_imports')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.reason || 'Resume import limit reached. Upgrade your plan for more.',
          limitReached: true,
        }, { status: 403 })
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const shouldSave = formData.get('save') === 'true'

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
    console.log('Save to database:', shouldSave)

    // Post-process: validate/supplement civilian titles using local crosswalk
    if (result.experiences && Array.isArray(result.experiences)) {
      for (const exp of result.experiences) {
        if (exp.employment_type === 'military' && exp.job_title) {
          const codeMatch = exp.job_title.match(/\b(\d{2}[A-Z]\d?|\d{4}|[A-Z]{2,4}|\d[A-Z]\d+X?\d*)\b/)
          if (codeMatch) {
            const localResult = getCivilianJobs(
              codeMatch[1],
              result.military_info?.branch || undefined
            )
            if (localResult && localResult.civilian_titles?.length > 0) {
              if (!exp.civilian_title || exp.civilian_title === exp.job_title) {
                exp.civilian_title = localResult.civilian_titles[0]
              }
            }
          }
        }
      }
    }

    // Post-process: split skills that contain "|" or "/"
    if (result.skills && Array.isArray(result.skills)) {
      const expanded: any[] = []
      for (const skill of result.skills) {
        const name = typeof skill === 'string' ? skill : skill.name
        const category = typeof skill === 'string' ? 'general' : (skill.category || 'general')
        if (/[|/]/.test(name)) {
          const parts = name.split(/[|/]/).map((s: string) => s.trim()).filter(Boolean)
          for (const part of parts) {
            expanded.push({ name: part, category })
          }
        } else {
          expanded.push({ name, category })
        }
      }
      result.skills = expanded
    }

    // Save to database if requested
    if (shouldSave) {
      await saveToDatabase(user.id, result)
    }

    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 4000
    const hasUsableData = result && (result.experiences?.length > 0 || result.skills?.length > 0 || result.professional_summary)

    // Return response to client first, then track usage
    const jsonResponse = NextResponse.json({
      success: true,
      saved: shouldSave,
      data: result,
      extractedTextLength: resumeText.length,
    })

    after(async () => {
      try {
        await logApiUsage(user.id, 'import-resume', tokensUsed, 'claude-sonnet-4-20250514')
        if (hasUsableData) {
          await incrementUsage(user.id, 'resume_imports')
        }
      } catch (err) {
        console.error('Post-response usage tracking failed:', err)
      }
    })

    return jsonResponse
  } catch (error: any) {
    console.error('Resume import error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to import resume' }, { status: 500 })
  }
}

/**
 * Save parsed resume data to database.
 * Only updates fields that have non-null values.
 */
async function saveToDatabase(userId: string, parsed: any) {
  // 1. Update profile - only fields that aren't null
  const profileUpdate: Record<string, any> = {}
  if (parsed.contact?.phone) profileUpdate.phone = parsed.contact.phone
  if (parsed.contact?.city) profileUpdate.city = parsed.contact.city
  if (parsed.contact?.state) profileUpdate.state = parsed.contact.state
  if (parsed.contact?.linkedin_url) profileUpdate.linkedin_url = parsed.contact.linkedin_url
  if (parsed.professional_summary) profileUpdate.professional_summary = parsed.professional_summary
  if (parsed.military_info?.branch) profileUpdate.branch = parsed.military_info.branch
  if (parsed.military_info?.rank) profileUpdate.rank = parsed.military_info.rank
  if (parsed.military_info?.years_of_service) {
    profileUpdate.years_of_service = parsed.military_info.years_of_service
  }
  if (parsed.clearance && parsed.clearance !== 'None') {
    const clearanceMap: Record<string, string> = {
      'Confidential': 'confidential',
      'Secret': 'secret',
      'Top Secret': 'top_secret',
      'TS/SCI': 'ts_sci',
    }
    profileUpdate.clearance = clearanceMap[parsed.clearance] || parsed.clearance.toLowerCase()
  }

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update(profileUpdate)
      .eq('user_id', userId)
    if (error) console.error('Profile update failed:', error)
    else console.log('Profile updated:', Object.keys(profileUpdate))
  }

  // 2. Insert experiences with bullets
  if (parsed.experiences?.length) {
    for (let i = 0; i < parsed.experiences.length; i++) {
      const exp = parsed.experiences[i]
      const isMilitary = exp.employment_type === 'military'

      const { data: expData, error: expError } = await supabaseAdmin
        .from('experience')
        .insert({
          user_id: userId,
          job_title: exp.job_title,
          civilian_title: exp.civilian_title || exp.job_title,
          organization: isMilitary ? exp.organization : null,
          company_name: !isMilitary ? exp.organization : null,
          location: exp.city && exp.state ? `${exp.city}, ${exp.state}` : null,
          employment_type: exp.employment_type || 'civilian',
          city: exp.city || null,
          state: exp.state || null,
          start_date: exp.start_date || null,
          end_date: exp.is_current ? null : exp.end_date || null,
          is_current: exp.is_current || false,
          sort_order: i,
          hours_per_week: 40,
        })
        .select()
        .single()

      if (expError) {
        console.error(`Experience ${i} insert failed:`, expError)
        continue
      }

      // Insert bullets for this experience
      if (expData && exp.bullets?.length) {
        const bulletInserts = exp.bullets.map((bullet: string, j: number) => ({
          experience_id: expData.id,
          original_text: bullet,
          translated_text: bullet,
          status: 'accepted',
          sort_order: j,
        }))
        const { error: bulletError } = await supabaseAdmin
          .from('experience_bullets')
          .insert(bulletInserts)
        if (bulletError) console.error(`Bullets for experience ${i} failed:`, bulletError)
      }
    }
    console.log(`Saved ${parsed.experiences.length} experiences`)
  }

  // 3. Insert education
  if (parsed.education?.length) {
    const eduInserts = parsed.education.map((edu: any, idx: number) => ({
      user_id: userId,
      school_name: edu.school_name || edu.institution || null,
      degree_type: edu.degree_type || edu.degree || null,
      field_of_study: edu.field_of_study || null,
      graduation_year: edu.graduation_year || null,
      gpa: edu.gpa || null,
      sort_order: idx,
    }))
    const { error } = await supabaseAdmin.from('education').insert(eduInserts)
    if (error) console.error('Education insert failed:', error)
    else console.log(`Saved ${eduInserts.length} education entries`)
  }

  // 4. Insert certifications
  if (parsed.certifications?.length) {
    const certInserts = parsed.certifications.map((cert: any, idx: number) => ({
      user_id: userId,
      name: cert.name,
      issuing_organization: cert.issuing_organization || cert.issuing_org || null,
      issue_date: cert.issue_date || cert.date_earned || null,
      expiration_date: cert.expiration_date || null,
      sort_order: idx,
    }))
    const { error } = await supabaseAdmin.from('certifications').insert(certInserts)
    if (error) console.error('Certifications insert failed:', error)
    else console.log(`Saved ${certInserts.length} certifications`)
  }

  // 5. Insert skills
  if (parsed.skills?.length) {
    const skillInserts = parsed.skills.map((skill: any, idx: number) => ({
      user_id: userId,
      name: typeof skill === 'string' ? skill : skill.name,
      category: typeof skill === 'string' ? 'general' : (skill.category || 'general'),
      sort_order: idx,
    }))
    const { error } = await supabaseAdmin.from('skills').insert(skillInserts)
    if (error) console.error('Skills insert failed:', error)
    else console.log(`Saved ${skillInserts.length} skills`)
  }

  console.log('=== DATABASE SAVE COMPLETE ===')
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
