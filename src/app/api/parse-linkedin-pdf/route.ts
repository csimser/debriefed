import { NextRequest, NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage } from '@/lib/usage-tracking'
import { canUseFeature, incrementUsage, isAdmin, getUserEmail } from '@/lib/usage-service'
import { callWithEscalation, getModelString } from '@/lib/ai-model'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Check usage limits (centralized admin check with case normalization)
    const userEmail = await getUserEmail(user.id)
    if (!isAdmin(userEmail)) {
      const usageCheck = await canUseFeature(user.id, 'linkedin_profile_analysis')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.reason || 'LinkedIn profile upload limit reached. Upgrade your plan for more.',
          limitReached: true,
        }, { status: 403 })
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF files are accepted.' }, { status: 400 })
    }

    // Validate file extension
    const fileName = file.name?.toLowerCase() || ''
    if (!fileName.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid file extension. Only .pdf files are accepted.' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    // Convert to buffer and validate PDF magic bytes
    const buffer = Buffer.from(await file.arrayBuffer())

    // Check PDF magic bytes (%PDF)
    const pdfMagic = buffer.slice(0, 4).toString()
    if (pdfMagic !== '%PDF') {
      return NextResponse.json({ error: 'Invalid PDF file format.' }, { status: 400 })
    }

    const base64 = buffer.toString('base64')

    console.log('Parsing PDF with Claude, file size:', buffer.length)

    // Use Claude to extract profile data from the PDF
    const { response, model_used } = await callWithEscalation(
      anthropic,
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

    const jsonText = (response.content[0] as { text: string }).text

    console.log('Claude response length:', jsonText.length)

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
      return NextResponse.json({ error: 'Failed to parse profile data' }, { status: 500 })
    }

    // Normalize the data structure
    const linkedInProfile = {
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

    console.log('Parsed profile:', {
      name: linkedInProfile.name,
      headlineLength: linkedInProfile.headline?.length,
      summaryLength: linkedInProfile.summary?.length,
      experienceCount: linkedInProfile.experience?.length,
      skillsCount: linkedInProfile.skills?.length,
    })

    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 3000

    // Return response to client first, then track usage
    const jsonResponse = NextResponse.json({ profileData: linkedInProfile, model_used })

    after(async () => {
      try {
        await logApiUsage(user.id, 'parse-linkedin-pdf', tokensUsed, getModelString(model_used))
        if (linkedInProfile.name || linkedInProfile.experience?.length > 0) {
          await incrementUsage(user.id, 'linkedin_profile_analysis')
        }
      } catch (err) {
        console.error('Post-response usage tracking failed:', err)
      }
    })

    return jsonResponse
  } catch (error: any) {
    console.error('LinkedIn PDF parse error:', error)
    return NextResponse.json({
      error: 'Failed to parse PDF. Please try again.'
    }, { status: 500 })
  }
}
