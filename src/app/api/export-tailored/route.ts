import { NextRequest, NextResponse, after } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { TemplateId, resolveTemplate, isTemplateFreeTier } from '@/lib/templates'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage, logActivity } from '@/lib/usage-tracking'
import { canUseFeature, incrementUsage, getUserTier, checkDailyLimit, isAdmin, getUserEmail } from '@/lib/usage-service'
import { trimForFederalLimit } from '@/lib/resume/federalTrimmer'
import React from 'react'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, format = 'pdf', resumeType = 'private', template: rawTemplate = 'classic_professional' } = await request.json()
    const template = resolveTemplate(rawTemplate)

    if (!content) {
      return NextResponse.json({ error: 'Missing resume content' }, { status: 400 })
    }

    // Validate content has some expected fields
    if (!content.contact && !content.experiences && !content.summary) {
      return NextResponse.json(
        { error: 'Invalid resume content structure - missing required sections' },
        { status: 400 }
      )
    }

    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format. Use pdf or docx.' }, { status: 400 })
    }

    // Check tier for template gating (free users get classic_professional + federal only)
    const tierInfo = await getUserTier(user.id)
    const isPaidUser = tierInfo.tier === 'core' || tierInfo.tier === 'full'

    if (!isPaidUser && !isTemplateFreeTier(template)) {
      return NextResponse.json({
        error: 'This template requires Core or Full tier.',
        limitReached: true,
        tier: tierInfo.tier
      }, { status: 403 })
    }

    // Check download usage limits (daily + period) — skip for admins
    // Uses 'downloads' feature (same counter as export-resume)
    const userEmail = await getUserEmail(user.id)
    const adminUser = isAdmin(userEmail)

    if (!adminUser) {
      const usageCheck = await canUseFeature(user.id, 'downloads')

      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.reason,
          limitReached: true,
          remaining: usageCheck.remaining,
          used: usageCheck.used,
          limit: usageCheck.limit,
        }, { status: 403 })
      }
    }

    // Filter out excluded and placeholder bullets before generating
    const isPlaceholder = (text: string) => {
      if (!text || text.trim() === '') return true
      const lower = text.trim().toLowerCase()
      return lower.includes('new bullet') || lower.includes('click to edit') || lower.includes('[x]')
    }
    const getBulletText = (b: any) => b.status === 'accepted' ? b.translated_text : (b.translated_text || b.original_text)

    const filteredContent = {
      ...content,
      experiences: content.experiences?.map((exp: any) => ({
        ...exp,
        bullets: exp.bullets?.filter((bullet: any) => {
          if (bullet.status === 'excluded') return false
          return !isPlaceholder(getBulletText(bullet))
        }),
      })),
    }

    // Apply federal 2-page trimmer
    const exportContent = resumeType === 'federal'
      ? trimForFederalLimit(filteredContent)
      : filteredContent

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    if (format === 'pdf') {
      const doc = React.createElement(ResumeDocument, {
        content: exportContent,
        resumeType: resumeType,
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

    // Get daily remaining for response headers
    const dailyCheck = await checkDailyLimit(user.id, 'downloads')

    // Return file to client first, then track usage
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `tailored-resume-${timestamp}.${extension}`

    // Increment usage INLINE — after() callbacks don't fire for binary/ArrayBuffer responses
    await incrementUsage(user.id, 'downloads')

    const remainingAfter = Math.max(0, dailyCheck.remaining - 1)

    const fileResponse = new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-User-Tier': tierInfo.tier,
        'X-Daily-Remaining': String(remainingAfter),
        'X-Daily-Limit': String(dailyCheck.limit),
      },
    })

    // Non-critical logging — safe in after() since it doesn't affect usage tracking
    after(async () => {
      try {
        await logApiUsage(user.id, 'export-tailored', 0, 'pdf-generation')
        await logActivity(user.id, 'resume_downloaded', {
          type: 'tailored',
          resume_type: resumeType,
          format,
          template,
          tier: tierInfo.tier,
        })
      } catch (err) {
        console.error('Post-response activity logging failed:', err)
      }
    })

    return fileResponse
  } catch (error: any) {
    console.error('Tailored export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate document. Please try again.' },
      { status: 500 }
    )
  }
}
