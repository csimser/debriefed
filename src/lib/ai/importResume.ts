/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Resume text parsing — browser port of the old /api/import-resume route.
 *
 * Sends extracted resume text to Claude (user's key) for full structured
 * parsing, then normalizes the result and maps military job titles to
 * civilian titles via the bundled local crosswalk.
 */
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import {
  callWithEscalation,
  getAnthropicClient,
  trackTokens,
  type ModelUsed,
} from '@/lib/ai/client'

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

export interface ParsedContact {
  first_name?: string | null
  last_name?: string | null
  phone: string | null
  city: string | null
  state: string | null
  linkedin_url: string | null
}

export interface ParsedExperience {
  job_title?: string | null
  civilian_title?: string | null
  organization?: string | null
  employment_type?: string | null
  city?: string | null
  state?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  bullets: string[]
}

export interface ParsedEducation {
  degree_type?: string | null
  field_of_study?: string | null
  school_name?: string | null
  graduation_year?: string | null
}

export interface ParsedCertification {
  name: string
  issuing_organization?: string | null
}

export interface ParsedSkill {
  name: string
  category: string
}

export interface ParsedMilitaryInfo {
  branch: string | null
  rank: string | null
}

export interface ParsedResume {
  contact: ParsedContact
  professional_summary: string | null
  experiences: ParsedExperience[]
  education: ParsedEducation[]
  certifications: ParsedCertification[]
  skills: ParsedSkill[]
  military_info: ParsedMilitaryInfo
  model_used: ModelUsed
}

/**
 * Parse full resume text using Haiku AI.
 * Mirrors the old POST /api/import-resume behavior.
 */
export async function parseResumeText(resumeText: string): Promise<ParsedResume> {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short to parse.')
  }

  // Send full resume text to Haiku for comprehensive parsing
  const truncatedText = resumeText.substring(0, 12000)
  const { response, model_used } = await callWithEscalation(
    getAnthropicClient(),
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

  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  // Parse response
  const textContent = response.content.find(c => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Failed to parse resume')
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
    throw new Error('Failed to parse resume data')
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
        if (localResult && localResult.civilian_titles?.length > 0) {
          if (!exp.civilian_title || exp.civilian_title === exp.job_title) {
            exp.civilian_title = localResult.civilian_titles[0]
          }
        }
      }
    }
  }

  return {
    contact: parsed.contact || { phone: null, city: null, state: null, linkedin_url: null },
    professional_summary: parsed.professional_summary || null,
    experiences,
    education: cleanEducation,
    certifications: cleanCerts,
    skills: cleanSkills,
    military_info: parsed.military_info || { branch: null, rank: null },
    model_used,
  }
}
