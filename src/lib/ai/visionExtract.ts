/**
 * Vision-based document extraction — browser ports of the old
 * /api/parse-linkedin-pdf and /api/import-resume/extract-text routes.
 *
 * Both run on the user's Anthropic key. File validation (type, magic bytes,
 * size) happens in the caller; only trivial sanity checks remain here.
 * DOCX parsing uses mammoth's browser build — free and fully local.
 */
// @ts-expect-error -- mammoth's browser bundle ships without type declarations
import mammoth from 'mammoth/mammoth.browser'
import {
  callWithEscalation,
  getAnthropicClient,
  trackTokens,
  type ModelUsed,
} from '@/lib/ai/client'

// 10MB file limit, expressed in base64 characters (4/3 expansion)
const MAX_BASE64_LENGTH = Math.ceil((10 * 1024 * 1024 * 4) / 3)

export interface LinkedInExperience {
  title: string
  company: string
  dates: string
  location: string
  duration: string
  bullets: string[]
}

export interface LinkedInEducation {
  school: string
  degree: string
  dates: string
}

export interface LinkedInProfileData {
  name: string
  headline: string
  location: string
  summary: string
  about: string
  skills: string[]
  certifications: string[]
  experience: LinkedInExperience[]
  education: LinkedInEducation[]
}

export interface ParseLinkedInPdfResult {
  profileData: LinkedInProfileData
  model_used: ModelUsed
}

/**
 * Extract structured profile data from a LinkedIn profile PDF —
 * port of POST /api/parse-linkedin-pdf.
 */
export async function parseLinkedInPdf(fileBase64: string): Promise<ParseLinkedInPdfResult> {
  if (!fileBase64) {
    throw new Error('No file uploaded')
  }

  // Clean base64 — strip data URL prefix if present
  let base64 = fileBase64
  if (base64.includes(',')) {
    base64 = base64.split(',')[1]
  }
  base64 = base64.replace(/\s/g, '')

  // Validate file size (max 10MB)
  if (base64.length > MAX_BASE64_LENGTH) {
    throw new Error('File too large. Maximum size is 10MB.')
  }

  // Check PDF magic bytes (%PDF → "JVBERi" in base64)
  if (!base64.startsWith('JVBERi')) {
    throw new Error('Invalid PDF file format.')
  }

  // Use Claude to extract profile data from the PDF
  const { response, model_used } = await callWithEscalation(
    getAnthropicClient(),
    {
      max_tokens: 3000,
      messages: [{
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
            text: `Extract ALL information from this LinkedIn profile PDF into JSON format. Be thorough and capture everything.

Return this exact JSON structure (fill in all fields you can find):
{
  "name": "Full Name",
  "headline": "The professional headline (usually contains | separators)",
  "location": "City, State or Country",
  "summary": "The complete About/Summary section text - include ALL of it",
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["certification1", "certification2"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "dates": "Start Date - End Date",
      "location": "Job Location",
      "duration": "X years Y months",
      "bullets": ["responsibility or achievement 1", "responsibility 2"]
    }
  ],
  "education": [
    {
      "school": "University/School Name",
      "degree": "Degree type and field",
      "dates": "Start - End years"
    }
  ]
}

Important:
- Extract the COMPLETE summary/about section, not just a snippet
- Include ALL experience entries, not just recent ones
- Include ALL skills listed under "Top Skills"
- Include any certifications you find
- For experience bullets, include key responsibilities and achievements mentioned

Return ONLY valid JSON, no other text.`
          }
        ]
      }],
    },
    { expectsJson: true }
  )

  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  const jsonText = (response.content[0] as { text: string }).text

  // Parse the JSON response
  let profileData
  try {
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      profileData = JSON.parse(jsonMatch[0])
    } else {
      throw new Error('No JSON found in response')
    }
  } catch (parseError) {
    console.error('Failed to parse profile JSON:', parseError)
    console.error('Raw response:', jsonText.substring(0, 500))
    throw new Error('Failed to parse profile data')
  }

  // Normalize the data structure
  const linkedInProfile: LinkedInProfileData = {
    name: profileData.name || '',
    headline: profileData.headline || '',
    location: profileData.location || '',
    summary: profileData.summary || '',
    about: profileData.summary || profileData.about || '',
    skills: Array.isArray(profileData.skills) ? profileData.skills : [],
    certifications: Array.isArray(profileData.certifications) ? profileData.certifications : [],
    experience: Array.isArray(profileData.experience) ? profileData.experience : [],
    education: Array.isArray(profileData.education) ? profileData.education : [],
  }

  return { profileData: linkedInProfile, model_used }
}

export interface ExtractResumeTextInput {
  /** Base64-encoded PDF (data URL prefix tolerated). */
  fileBase64?: string
  /** Media type of the base64 payload (expected: application/pdf). */
  mediaType?: string
  /** DOCX file, parsed locally with mammoth (no AI call). */
  docxFile?: File
}

export interface ExtractResumeTextResult {
  text: string
  pdfUsedAI: boolean
}

/**
 * Extract raw text from a resume file — port of POST /api/import-resume/extract-text.
 * PDFs go through Claude vision (handles scanned/image-based documents);
 * DOCX files are parsed locally with mammoth.
 */
export async function extractResumeText(input: ExtractResumeTextInput): Promise<ExtractResumeTextResult> {
  const { fileBase64, docxFile } = input

  if (!fileBase64 && !docxFile) {
    throw new Error('No file provided')
  }

  const isPDF = !!fileBase64

  let text = ''

  if (isPDF && fileBase64) {
    try {
      // Clean base64 — strip data URL prefix if present
      let base64 = fileBase64
      if (base64.includes(',')) {
        base64 = base64.split(',')[1]
      }
      base64 = base64.replace(/\s/g, '')

      // Check PDF magic bytes (%PDF → "JVBERi" in base64)
      if (!base64.startsWith('JVBERi')) {
        throw new Error('Invalid PDF file format.')
      }

      // PDF: use Haiku vision — handles scanned, image-based, and standard PDFs
      const { response } = await callWithEscalation(
        getAnthropicClient(),
        {
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
                  text: 'Extract all text from this document. Return only the raw text, preserving line breaks and section structure. Do not summarize or interpret.',
                },
              ],
            },
          ],
        },
        { expectsJson: false }
      )

      trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

      text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    } catch (pdfError: any) {
      if (pdfError?.message === 'Invalid PDF file format.') throw pdfError
      console.error('[ExtractText] PDF vision error:', pdfError?.message)
      throw new Error("We couldn't read this PDF. Try a DOCX, or paste your resume text directly.")
    }
  } else if (docxFile) {
    // DOCX: mammoth — free, local, works great
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: await docxFile.arrayBuffer() })
      text = result.value || ''
    } catch (docxError: any) {
      console.error('[ExtractText] DOCX parse error:', docxError?.message)
      throw new Error("We couldn't read this DOCX file. Try a PDF, or paste your resume text directly.")
    }
  }

  if (!text || text.trim().length < 30) {
    throw new Error("We couldn't extract enough text from this file. Try a DOCX, or paste your resume text directly.")
  }

  return {
    text: text.trim(),
    pdfUsedAI: isPDF,
  }
}
