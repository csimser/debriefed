import { NextRequest, NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { TemplateId } from '@/lib/templates'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { logApiUsage, incrementUsage, logActivity } from '@/lib/usage-tracking'
import { PRICING_TIERS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'
import React from 'react'

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

    const { content, format = 'pdf', resumeType = 'private', template = 'clean' } = await request.json()

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

    // Check usage limits before processing
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier, email')
      .eq('user_id', user.id)
      .single()

    const { data: usage } = await supabaseAdmin
      .from('usage')
      .select('private_downloads, federal_or_tailored_used, monthly_private_downloads, daily_private_downloads, monthly_reset_date, daily_reset_date')
      .eq('user_id', user.id)
      .single()

    // Determine tier
    const rawTier = profile?.subscription_tier || 'free'
    const tier: TierId = ['core', 'full'].includes(rawTier) ? rawTier as TierId :
      rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'

    // Admin bypass
    if (!profile?.email || !ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      const tierConfig = PRICING_TIERS[tier]
      const privateDownloads = usage?.private_downloads || 0
      const federalOrTailoredUsed = usage?.federal_or_tailored_used || false

      // Free tier: tailored resumes use the flex slot
      if (tier === 'free') {
        if (federalOrTailoredUsed) {
          return NextResponse.json({
            error: 'You\'ve used your free federal/tailored resume. Upgrade to Core for more.',
            limitReached: true,
            tier: 'free'
          }, { status: 403 })
        }
      }
      // Core tier: tailored resumes count against private_resumes limit
      else if (tier === 'core') {
        const limit = tierConfig.limits.private_resumes
        if (privateDownloads >= limit) {
          return NextResponse.json({
            error: `You've used all ${limit} resume downloads. Upgrade to Full for more.`,
            limitReached: true,
            tier: 'core'
          }, { status: 403 })
        }
      }
      // Full tier: monthly and daily limits
      else if (tier === 'full') {
        const now = new Date()
        const monthlyResetDate = usage?.monthly_reset_date ? new Date(usage.monthly_reset_date) : null
        const dailyResetDate = usage?.daily_reset_date ? new Date(usage.daily_reset_date) : null

        const needsMonthlyReset = !monthlyResetDate || monthlyResetDate <= now
        const needsDailyReset = !dailyResetDate || dailyResetDate <= now

        const monthlyPrivate = needsMonthlyReset ? 0 : (usage?.monthly_private_downloads || 0)
        const dailyPrivate = needsDailyReset ? 0 : (usage?.daily_private_downloads || 0)

        const monthlyLimit = tierConfig.limits.private_resumes // 30
        const dailyLimit = 10

        if (dailyPrivate >= dailyLimit) {
          return NextResponse.json({
            error: 'Daily resume download limit reached. Resets at midnight.',
            limitReached: true,
            tier: 'full',
            isDailyLimit: true
          }, { status: 403 })
        }
        if (monthlyPrivate >= monthlyLimit) {
          return NextResponse.json({
            error: 'Monthly resume download limit reached.',
            limitReached: true,
            tier: 'full',
            isMonthlyLimit: true
          }, { status: 403 })
        }
      }
    }

    // Filter out excluded bullets before generating
    const filteredContent = {
      ...content,
      experiences: content.experiences?.map((exp: any) => ({
        ...exp,
        bullets: exp.bullets?.filter((bullet: any) => bullet.status !== 'excluded'),
      })),
    }

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    if (format === 'pdf') {
      console.log('Generating PDF from content with template:', template)
      const doc = React.createElement(ResumeDocument, {
        content: filteredContent,
        resumeType: resumeType,
        template: template as TemplateId,
      })
      const pdfInstance = pdf(doc as any)
      const blob = await pdfInstance.toBlob()
      arrayBuffer = await blob.arrayBuffer()
      contentType = 'application/pdf'
      extension = 'pdf'
      console.log('PDF generated, size:', arrayBuffer.byteLength)
    } else {
      console.log('Generating DOCX from content with template:', template)
      const buffer = await generateDocx(filteredContent, resumeType, template as TemplateId)
      // Convert Node Buffer to ArrayBuffer properly
      arrayBuffer = new Uint8Array(buffer).buffer
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
      console.log('DOCX generated, size:', arrayBuffer.byteLength)
    }

    // Increment usage based on tier
    // Tailored resumes count against resume_downloads (private_resumes limit)
    if (tier === 'free') {
      // For free tier, mark the flex slot as used
      await supabaseAdmin
        .from('usage')
        .update({ federal_or_tailored_used: true })
        .eq('user_id', user.id)
    } else {
      // For paid tiers, increment private downloads
      await supabaseAdmin.rpc('increment_private_downloads', { p_user_id: user.id })
    }

    // For Full tier, also increment monthly and daily counters
    if (tier === 'full') {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      nextMonth.setDate(1)
      nextMonth.setHours(0, 0, 0, 0)

      await supabaseAdmin.rpc('increment_monthly_private_downloads', {
        p_user_id: user.id,
        p_reset_date: nextMonth.toISOString()
      })
      await supabaseAdmin.rpc('increment_daily_private_downloads', {
        p_user_id: user.id,
        p_reset_date: tomorrow.toISOString()
      })
    }

    // Track API usage and activity
    await logApiUsage(user.id, 'export-tailored', 0, 'pdf-generation')
    await logActivity(user.id, 'resume_downloaded', {
      type: 'tailored',
      resume_type: resumeType,
      format,
      template,
      tier,
    })

    // Return file
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `tailored-resume-${timestamp}.${extension}`

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('Tailored export error:', error)
    return NextResponse.json(
      { error: `Failed to generate document: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
