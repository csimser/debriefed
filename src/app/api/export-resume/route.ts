import { NextRequest, NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { TemplateId } from '@/lib/templates'
import { PRICING_TIERS, DAILY_RATE_LIMITS, ADMIN_BYPASS_EMAILS, TierId } from '@/lib/pricing-config'
import { getUserTier as getAuthoritativeTier } from '@/lib/usage-service'
import { logActivity, logApiUsage } from '@/lib/usage-tracking'
import React from 'react'

// Admin client for database operations (bypasses RLS)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Authenticate user - get userId from session, NOT from request body
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    const body = await request.json()
    const { resumeId, format, template = 'clean' } = body

    // DEBUG logging
    console.log('=== EXPORT DEBUG ===')
    console.log('Received:', { resumeId, userId, format, template })

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

    // Check usage limit based on resume type
    const resumeType = resume.resume_type || 'private'

    const { data: usage } = await supabaseAdmin
      .from('usage')
      .select('private_downloads, federal_downloads, monthly_private_downloads, monthly_federal_downloads, daily_private_downloads, daily_federal_downloads, monthly_reset_date, daily_reset_date')
      .eq('user_id', userId)
      .single()

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('user_id', userId)
      .single()

    // Admin bypass
    if (profile?.email && ADMIN_BYPASS_EMAILS.includes(profile.email)) {
      console.log('Admin bypass for:', profile.email)
    } else {
      // Determine tier using centralized function (checks subscriptions table first)
      const tierInfo = await getAuthoritativeTier(userId)
      const tier: TierId = tierInfo.tier

      const tierConfig = PRICING_TIERS[tier]

      // Expired tier: allow downloads (skip limit checks)
      if (tier === 'expired') {
        // Downloads are allowed for expired tier, skip all limit checks
      }
      // Free tier logic
      else if (tier === 'free') {
        const privateDownloads = usage?.private_downloads || 0
        const federalDownloads = usage?.federal_downloads || 0

        if (resumeType === 'federal') {
          if (federalDownloads >= 1) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'federal_resume',
              tier: 'free',
              current_usage: federalDownloads,
              limit: 1,
            })
            return NextResponse.json({
              error: 'Federal resumes require Core tier.',
              limitReached: true,
              tier: 'free'
            }, { status: 403 })
          }
        } else {
          if (privateDownloads >= tierConfig.limits.private_resumes) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'private_resume',
              tier: 'free',
              current_usage: privateDownloads,
              limit: tierConfig.limits.private_resumes,
            })
            return NextResponse.json({
              error: 'You\'ve used your free resume download. Upgrade to Core for more.',
              limitReached: true,
              tier: 'free'
            }, { status: 403 })
          }
        }
      }
      // Core tier logic
      else if (tier === 'core') {
        const privateDownloads = usage?.private_downloads || 0
        const federalDownloads = usage?.federal_downloads || 0
        const privateLimit = tierConfig.limits.private_resumes
        const federalLimit = tierConfig.limits.federal_resumes

        // Check daily limits for Core tier
        const now = new Date()
        const dailyResetDate = usage?.daily_reset_date ? new Date(usage.daily_reset_date) : null
        const needsDailyReset = !dailyResetDate || dailyResetDate <= now
        const dailyPrivate = needsDailyReset ? 0 : (usage?.daily_private_downloads || 0)
        const dailyFederal = needsDailyReset ? 0 : (usage?.daily_federal_downloads || 0)
        const dailyLimit = DAILY_RATE_LIMITS.core.private_resumes

        if (resumeType === 'federal') {
          if (dailyFederal >= dailyLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'federal_resume',
              tier: 'core',
              limit_type: 'daily',
              current_usage: dailyFederal,
              limit: dailyLimit,
            })
            return NextResponse.json({
              error: 'Daily federal resume limit reached. Resets at midnight.',
              limitReached: true,
              tier: 'core',
              isDailyLimit: true
            }, { status: 403 })
          }
          if (federalDownloads >= federalLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'federal_resume',
              tier: 'core',
              current_usage: federalDownloads,
              limit: federalLimit,
            })
            return NextResponse.json({
              error: `You've used all ${federalLimit} federal resumes. Upgrade to Full for more.`,
              limitReached: true,
              tier: 'core'
            }, { status: 403 })
          }
        } else {
          if (dailyPrivate >= dailyLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'private_resume',
              tier: 'core',
              limit_type: 'daily',
              current_usage: dailyPrivate,
              limit: dailyLimit,
            })
            return NextResponse.json({
              error: 'Daily resume download limit reached. Resets at midnight.',
              limitReached: true,
              tier: 'core',
              isDailyLimit: true
            }, { status: 403 })
          }
          if (privateDownloads >= privateLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'private_resume',
              tier: 'core',
              current_usage: privateDownloads,
              limit: privateLimit,
            })
            return NextResponse.json({
              error: `You've used all ${privateLimit} resume downloads. Upgrade to Full for more.`,
              limitReached: true,
              tier: 'core'
            }, { status: 403 })
          }
        }
      }
      // Full tier logic - monthly and daily limits
      else if (tier === 'full') {
        const now = new Date()
        const monthlyResetDate = usage?.monthly_reset_date ? new Date(usage.monthly_reset_date) : null
        const dailyResetDate = usage?.daily_reset_date ? new Date(usage.daily_reset_date) : null

        // Check if monthly counters need reset
        const needsMonthlyReset = !monthlyResetDate || monthlyResetDate <= now
        const needsDailyReset = !dailyResetDate || dailyResetDate <= now

        const monthlyPrivate = needsMonthlyReset ? 0 : (usage?.monthly_private_downloads || 0)
        const monthlyFederal = needsMonthlyReset ? 0 : (usage?.monthly_federal_downloads || 0)
        const dailyPrivate = needsDailyReset ? 0 : (usage?.daily_private_downloads || 0)
        const dailyFederal = needsDailyReset ? 0 : (usage?.daily_federal_downloads || 0)

        const monthlyLimit = tierConfig.limits.private_resumes // 30
        const dailyLimit = DAILY_RATE_LIMITS.full.private_resumes // 10

        if (resumeType === 'federal') {
          if (dailyFederal >= dailyLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'federal_resume',
              tier: 'full',
              limit_type: 'daily',
              current_usage: dailyFederal,
              limit: dailyLimit,
            })
            return NextResponse.json({
              error: 'Daily federal resume limit reached. Resets at midnight.',
              limitReached: true,
              tier: 'full',
              isDailyLimit: true
            }, { status: 403 })
          }
          if (monthlyFederal >= monthlyLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'federal_resume',
              tier: 'full',
              limit_type: 'monthly',
              current_usage: monthlyFederal,
              limit: monthlyLimit,
            })
            return NextResponse.json({
              error: 'Monthly federal resume limit reached.',
              limitReached: true,
              tier: 'full',
              isMonthlyLimit: true
            }, { status: 403 })
          }
        } else {
          if (dailyPrivate >= dailyLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'private_resume',
              tier: 'full',
              limit_type: 'daily',
              current_usage: dailyPrivate,
              limit: dailyLimit,
            })
            return NextResponse.json({
              error: 'Daily resume download limit reached. Resets at midnight.',
              limitReached: true,
              tier: 'full',
              isDailyLimit: true
            }, { status: 403 })
          }
          if (monthlyPrivate >= monthlyLimit) {
            await logActivity(userId, 'feature_limit_reached', {
              feature: 'private_resume',
              tier: 'full',
              limit_type: 'monthly',
              current_usage: monthlyPrivate,
              limit: monthlyLimit,
            })
            return NextResponse.json({
              error: 'Monthly resume download limit reached.',
              limitReached: true,
              tier: 'full',
              isMonthlyLimit: true
            }, { status: 403 })
          }
        }
      }
    }

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    if (format === 'pdf') {
      const doc = React.createElement(ResumeDocument, {
        content: resume.content,
        resumeType: resume.resume_type || 'private',
        template: template as TemplateId,
      })
      const pdfInstance = pdf(doc as any)
      const blob = await pdfInstance.toBlob()
      arrayBuffer = await blob.arrayBuffer()
      contentType = 'application/pdf'
      extension = 'pdf'
    } else {
      const buffer = await generateDocx(resume.content, resume.resume_type || 'private', template as TemplateId)
      // Convert Node Buffer to ArrayBuffer properly
      arrayBuffer = new Uint8Array(buffer).buffer
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
    }

    // Determine tier for usage increment
    const rawTier = profile?.subscription_tier || 'free'
    const tier: TierId = ['core', 'full', 'expired'].includes(rawTier) ? rawTier as TierId :
      rawTier === 'pro' ? 'full' : rawTier === 'basic' ? 'core' : 'free'
    const isPaidTier = tier !== 'free' && tier !== 'expired'

    // Increment usage based on resume type and tier
    if (resumeType === 'federal') {
      await supabaseAdmin.rpc('increment_federal_downloads', { p_user_id: userId })
    } else {
      await supabaseAdmin.rpc('increment_private_downloads', { p_user_id: userId })
    }

    // For Core and Full tiers, also increment monthly and daily counters
    if (tier === 'core' || tier === 'full') {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      nextMonth.setDate(1)
      nextMonth.setHours(0, 0, 0, 0)

      if (resumeType === 'federal') {
        await supabaseAdmin.rpc('increment_monthly_federal_downloads', {
          p_user_id: userId,
          p_reset_date: nextMonth.toISOString()
        })
        await supabaseAdmin.rpc('increment_daily_federal_downloads', {
          p_user_id: userId,
          p_reset_date: tomorrow.toISOString()
        })
      } else {
        await supabaseAdmin.rpc('increment_monthly_private_downloads', {
          p_user_id: userId,
          p_reset_date: nextMonth.toISOString()
        })
        await supabaseAdmin.rpc('increment_daily_private_downloads', {
          p_user_id: userId,
          p_reset_date: tomorrow.toISOString()
        })
      }
    }

    // For free tier users, mark the resume as downloaded (locks editing)
    if (!isPaidTier) {
      await supabaseAdmin
        .from('resumes')
        .update({ downloaded_at: new Date().toISOString() })
        .eq('id', resumeId)
    }

    // Log activity and API usage
    await logActivity(userId, 'resume_downloaded', {
      resume_id: resumeId,
      resume_name: resume.name,
      resume_type: resumeType,
      format,
      template,
      tier,
    })

    await logApiUsage(userId, 'export-resume', 0, 'pdf-generation')

    // Return file
    const filename = `${resume.name || 'resume'}.${extension}`

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
