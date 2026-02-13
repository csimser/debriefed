import { NextRequest, NextResponse, after } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { TemplateId, resolveTemplate } from '@/lib/templates'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage, logActivity } from '@/lib/usage-tracking'
import { canUseFeature, incrementUsage, getUserTier } from '@/lib/usage-service'
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

    // Tailored resumes require Core tier or above (free tier gate)
    const tierInfo = await getUserTier(user.id)
    if (tierInfo.tier === 'free') {
      return NextResponse.json({
        error: 'Tailored resumes require Core tier.',
        limitReached: true,
        tier: 'free'
      }, { status: 403 })
    }

    // Check usage limit via usage_tracking (single source of truth)
    // canUseFeature handles: admin bypass, period limits, daily limits
    // Tailored resumes count against private_resumes
    const usageCheck = await canUseFeature(user.id, 'private_resumes')

    if (!usageCheck.allowed) {
      return NextResponse.json({
        error: usageCheck.reason,
        limitReached: true,
        remaining: usageCheck.remaining,
        used: usageCheck.used,
        limit: usageCheck.limit,
      }, { status: 403 })
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

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    if (format === 'pdf') {
      const doc = React.createElement(ResumeDocument, {
        content: filteredContent,
        resumeType: resumeType,
        template,
      })
      const pdfInstance = pdf(doc as any)
      const blob = await pdfInstance.toBlob()
      arrayBuffer = await blob.arrayBuffer()
      contentType = 'application/pdf'
      extension = 'pdf'
    } else {
      const buffer = await generateDocx(filteredContent, resumeType, template)
      arrayBuffer = new Uint8Array(buffer).buffer
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
    }

    // Return file to client first, then track usage
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `tailored-resume-${timestamp}.${extension}`

    const fileResponse = new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

    // Defer usage tracking to after response is sent
    after(async () => {
      try {
        // Increment usage in usage_tracking + daily_usage (single source of truth)
        await incrementUsage(user.id, 'private_resumes')

        await logApiUsage(user.id, 'export-tailored', 0, 'pdf-generation')
        await logActivity(user.id, 'resume_downloaded', {
          type: 'tailored',
          resume_type: resumeType,
          format,
          template,
          tier: tierInfo.tier,
        })
      } catch (err) {
        console.error('Post-response usage tracking failed:', err)
      }
    })

    return fileResponse
  } catch (error: any) {
    console.error('Tailored export error:', error)
    return NextResponse.json(
      { error: `Failed to generate document: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
