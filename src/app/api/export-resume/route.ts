import { NextRequest, NextResponse, after } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { TemplateId, resolveTemplate } from '@/lib/templates'
import { FeatureName } from '@/lib/pricing-config'
import { canUseFeature, incrementUsage, getUserTier } from '@/lib/usage-service'
import { logActivity, logApiUsage } from '@/lib/usage-tracking'
import React from 'react'

// Admin client for resume fetch (bypasses RLS) and free-tier resume lock
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

    // Check usage limit via usage_tracking (single source of truth)
    // canUseFeature handles: admin bypass, tier lookup, period limits, daily limits
    const resumeType = resume.resume_type || 'private'
    const feature: FeatureName = resumeType === 'federal' ? 'federal_resumes' : 'private_resumes'
    const usageCheck = await canUseFeature(userId, feature)

    if (!usageCheck.allowed) {
      await logActivity(userId, 'feature_limit_reached', {
        feature,
        current_usage: usageCheck.used,
        limit: usageCheck.limit,
      })
      return NextResponse.json({
        error: usageCheck.reason,
        limitReached: true,
        remaining: usageCheck.remaining,
        used: usageCheck.used,
        limit: usageCheck.limit,
      }, { status: 403 })
    }

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    if (format === 'pdf') {
      const doc = React.createElement(ResumeDocument, {
        content: resume.content,
        resumeType: resume.resume_type || 'private',
        template,
      })
      const pdfInstance = pdf(doc as any)
      const blob = await pdfInstance.toBlob()
      arrayBuffer = await blob.arrayBuffer()
      contentType = 'application/pdf'
      extension = 'pdf'
    } else {
      const buffer = await generateDocx(resume.content, resume.resume_type || 'private', template)
      arrayBuffer = new Uint8Array(buffer).buffer
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
    }

    // Capture tier info before response for the after() callback
    const tierInfo = await getUserTier(userId)
    const isPaidTier = tierInfo.tier === 'core' || tierInfo.tier === 'full'

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
        // Increment usage in usage_tracking + daily_usage (single source of truth)
        await incrementUsage(userId, feature)

        // For free tier users, mark the resume as downloaded (locks editing)
        if (!isPaidTier) {
          await supabaseAdmin
            .from('resumes')
            .update({ downloaded_at: new Date().toISOString() })
            .eq('id', resumeId)
        }

        await logActivity(userId, 'resume_downloaded', {
          resume_id: resumeId,
          resume_name: resume.name,
          resume_type: resumeType,
          format,
          template,
          tier: tierInfo.tier,
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
