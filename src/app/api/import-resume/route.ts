import { NextRequest, NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage } from '@/lib/usage-tracking'
import { canUseFeature, incrementUsage, isAdmin, getUserEmail } from '@/lib/usage-service'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { callWithEscalation, getModelString, type ModelUsed } from '@/lib/ai-model'

const anthropic = new Anthropic()

const RESUME_PROMPT = `You are a resume parser. Extract ALL structured data from this resume text. Return a single JSON object with these exact keys:

{
  "contact": {
    "first_name": "string or null",
    "last_name": "string or null",
    "phone": "string or null",
    "city": "string or null",
    "state": "2-letter state code or null",
    "linkedin_url": "full URL or null"
  },
  "professional_summary": "string or null (the summary/objective paragraph if present)",
  "experiences": [
    {
      "job_title": "exact title from resume",
      "civilian_title": "translated civilian title if military, otherwise same as job_title",
      "organization": "company or military unit name",
      "employment_type": "military or civilian",
      "city": "string or null",
      "state": "2-letter code or null",
      "start_date": "YYYY-MM-DD or null",
      "end_date": "YYYY-MM-DD or null",
      "is_current": true/false,
      "bullets": ["accomplishment strings"]
    }
  ],
  "education": [
    {
      "degree_type": "e.g. Bachelor, Master, MBA, Associate, Doctorate, High School, Certificate",
      "field_of_study": "string or null",
      "school_name": "string",
      "graduation_year": "YYYY or null"
    }
  ],
  "certifications": [
    {
      "name": "certification name",
      "issuing_organization": "issuer or null"
    }
  ],
  "skills": [
    { "name": "skill name", "category": "technical or leadership or general" }
  ],
  "military_info": {
    "branch": "Army, Navy, Air Force, Marines, Coast Guard, Space Force, or null",
    "rank": "string or null"
  }
}

Rules:
- Extract EVERY job entry even if formatting varies
- For dates: "Mar. 2006" → "2006-03-01", "2006" alone → "2006-01-01", "Present"/"Current" → end_date: null, is_current: true
- For military jobs, set employment_type to "military"
- Education: only include REAL degrees (Bachelor, Master, MBA, Associate, Doctorate, High School, Certificate). Do NOT create entries for professional training, certifications, or military schools — those go in certifications.
- Certifications: include professional licenses, military training completions, and certificates. Include the issuing organization if stated.
- Skills: extract actual skill names only. Do NOT include section headers, page numbers, formatting artifacts, or individual words from paragraph text. Each skill should be a real, recognizable competency (e.g. "Project Management", "Python", "Budget Analysis").
- Extract the person's first_name and last_name from the resume header
- Do NOT include SSNs or email addresses in the output
- Return ONLY a JSON object, no markdown, no backticks, no explanation`

/**
 * Parse full resume text using Haiku AI.
 * Counts against the resume_imports usage limit.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resumeText } = body

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({
        error: 'Resume text is too short to parse.',
      }, { status: 400 })
    }

    // Check resume import usage limit (centralized admin check with case normalization)
    const userEmail = await getUserEmail(user.id)
    if (!isAdmin(userEmail)) {
      const usageCheck = await canUseFeature(user.id, 'resume_imports')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: "You've used all your free imports. Upgrade to Core for unlimited imports.",
          limitReached: true,
          remaining: usageCheck.remaining,
          limit: usageCheck.limit,
          used: usageCheck.used,
        }, { status: 403 })
      }
    }

    // Send full resume text to Haiku for comprehensive parsing
    const truncatedText = resumeText.substring(0, 12000)
    const { response, model_used } = await callWithEscalation(
      anthropic,
      {
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `${RESUME_PROMPT}\n\nRESUME TEXT:\n${truncatedText}${resumeText.length > 12000 ? '\n...[truncated]' : ''}`,
          },
        ],
      },
      { expectsJson: true }
    )

    // Parse response
    const textContent = response.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
    }

    let parsed: any
    try {
      let jsonText = textContent.text.trim()
      if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7)
      if (jsonText.startsWith('```')) jsonText = jsonText.slice(3)
      if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3)
      jsonText = jsonText.trim()

      parsed = JSON.parse(jsonText)
    } catch {
      console.error('JSON parse error for resume extraction:', textContent.text.substring(0, 500))
      return NextResponse.json({ error: 'Failed to parse resume data' }, { status: 500 })
    }

    console.log('[ImportResume] Haiku parsed resume sections:', {
      contact: !!parsed.contact,
      summary: !!parsed.professional_summary,
      experiences: parsed.experiences?.length || 0,
      education: parsed.education?.length || 0,
      certifications: parsed.certifications?.length || 0,
      skills: parsed.skills?.length || 0,
      military: !!parsed.military_info,
    })

    // Normalize arrays
    const experiences = Array.isArray(parsed.experiences) ? parsed.experiences : []
    const education = Array.isArray(parsed.education) ? parsed.education : []
    const certifications = Array.isArray(parsed.certifications) ? parsed.certifications : []
    const skills = Array.isArray(parsed.skills) ? parsed.skills : []

    // Clean up experiences: ensure bullets is always an array of non-empty strings
    for (const exp of experiences) {
      if (!Array.isArray(exp.bullets)) {
        exp.bullets = []
      } else {
        exp.bullets = exp.bullets.filter((b: any) => typeof b === 'string' && b.trim().length > 0)
      }
    }

    // Filter out empty education entries
    const cleanEducation = education.filter((edu: any) =>
      edu.school_name || edu.degree_type || edu.field_of_study
    )

    // Filter out empty certifications
    const cleanCerts = certifications.filter((cert: any) =>
      cert.name && cert.name.trim().length > 0
    )

    // Filter out garbage skills (too short, too long, or look like headers)
    const cleanSkills = skills.filter((skill: any) => {
      const name = typeof skill === 'string' ? skill : skill?.name
      if (!name || typeof name !== 'string') return false
      const trimmed = name.trim()
      return trimmed.length >= 2 && trimmed.length <= 80 && !/^\d+$/.test(trimmed)
    }).map((skill: any) => {
      if (typeof skill === 'string') return { name: skill.trim(), category: 'general' }
      return { name: skill.name.trim(), category: skill.category || 'general' }
    })

    // Post-process: civilian titles via local crosswalk
    for (const exp of experiences) {
      if (exp.employment_type === 'military' && exp.job_title) {
        const codeMatch = exp.job_title.match(/\b(\d{2}[A-Z]\d?|\d{4}|[A-Z]{2,4}|\d[A-Z]\d+X?\d*)\b/)
        if (codeMatch) {
          const localResult = getCivilianJobs(codeMatch[1], parsed.military_info?.branch || undefined)
          if (localResult?.civilian_titles?.length > 0) {
            if (!exp.civilian_title || exp.civilian_title === exp.job_title) {
              exp.civilian_title = localResult.civilian_titles[0]
            }
          }
        }
      }
    }

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0) || 2000
    const hasUsableData = experiences.length > 0 || cleanEducation.length > 0 || cleanSkills.length > 0

    const jsonResponse = NextResponse.json({
      success: true,
      contact: parsed.contact || { phone: null, city: null, state: null, linkedin_url: null },
      professional_summary: parsed.professional_summary || null,
      experiences,
      education: cleanEducation,
      certifications: cleanCerts,
      skills: cleanSkills,
      military_info: parsed.military_info || { branch: null, rank: null },
      model_used,
    })

    after(async () => {
      try {
        await logApiUsage(user.id, 'import-resume', tokensUsed, getModelString(model_used))
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
    return NextResponse.json({ error: error?.message || 'Failed to parse resume' }, { status: 500 })
  }
}
