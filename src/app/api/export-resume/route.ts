import { NextRequest, NextResponse, after } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { TEMPLATES, TemplateId, resolveTemplate } from '@/lib/templates'
import { logActivity, logApiUsage } from '@/lib/usage-tracking'
import { getUserTier } from '@/lib/usage-service'
import { trimForFederalLimit } from '@/lib/resume/federalTrimmer'
import React from 'react'

// Admin client for resume fetch (bypasses RLS)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    const body = await request.json()
    const { resumeId, format, template: rawTemplate = 'classic_professional' } = body
    const template = resolveTemplate(rawTemplate)

    if (!resumeId || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    // Check if template is locked for free-tier users
    if (TEMPLATES[template]?.free === false) {
      const tier = await getUserTier(userId)
      if (tier === 'free') {
        return NextResponse.json(
          { error: 'Upgrade to Core to use this template', limitReached: true, tier: 'free' },
          { status: 403 }
        )
      }
    }

    // Fetch resume - verify it belongs to the authenticated user
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', userId)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const resumeType = resume.resume_type || 'private'

    // Apply federal 2-page trimmer
    const exportContent = resumeType === 'federal'
      ? trimForFederalLimit(resume.content)
      : resume.content

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    if (format === 'pdf') {
      const doc = React.createElement(ResumeDocument, {
        content: exportContent,
        resumeType,
        template,
      })
      const pdfInstance = pdf(doc as any)
      const blob = await pdfInstance.toBlob()
      arrayBuffer = await blob.arrayBuffer()
      contentType = 'application/pdf'
      extension = 'pdf'
    } else {
      const buffer = await generateDocx(exportContent, resumeType, template)
      arrayBuffer = new Uint8Array(buffer).buffer
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
    }

    const filename = `${resume.name || 'resume'}.${extension}`

    const response = new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

    // Defer usage tracking to after response is sent
    after(async () => {
      try {
        await logActivity(userId, 'resume_downloaded', {
          resume_id: resumeId,
          resume_name: resume.name,
          resume_type: resumeType,
          format,
          template,
        })
        await logApiUsage(userId, 'export-resume', 0, 'pdf-generation')
      } catch (err) {
        console.error('Post-response usage tracking failed:', err)
      }
    })

    return response
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
