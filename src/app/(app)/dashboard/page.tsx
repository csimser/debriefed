import { createClient } from '@/lib/supabase/server'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { GovComputerBanner } from '@/components/layout/GovComputerBanner'
import { MilCalcBanner } from '@/components/layout/MilCalcBanner'
import { IncompleteProfileBanner } from '@/components/layout/IncompleteProfileBanner'
import { OptInPrompt } from '@/components/layout/OptInPrompt'
import { PaymentSuccessBanner } from '@/components/paywall/PaymentSuccessBanner'
import { PlanIntentCheckout } from '@/components/paywall/PlanIntentCheckout'
import { ResumeHero } from '@/components/dashboard/ResumeHero'
import { ProfileProgress } from '@/components/dashboard/ProfileProgress'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { DashboardChecklist } from '@/components/dashboard/DashboardChecklist'
import { checkLimit, getSubscriptionInfo } from '@/lib/usage-service'
import Link from 'next/link'

// Expanded profile fields for completeness — ordered by impact priority (highest first)
const PROFILE_FIELDS = [
  { key: 'rating_mos', label: 'Add your MOS to unlock tailored job matches', href: '/profile', priority: 10 },
  { key: 'professional_summary', label: 'Add a professional summary for stronger resumes', href: '/profile', priority: 8 },
  { key: 'target_role', label: 'Set your target role for better job matching', href: '/profile', priority: 7 },
  { key: 'target_industry', label: 'Set your target industry for better recommendations', href: '/profile', priority: 5 },
  { key: 'branch', label: 'Add your military branch', href: '/profile', priority: 3 },
  { key: 'rank', label: 'Add your rank', href: '/profile', priority: 3 },
  { key: 'years_of_service', label: 'Add years of service', href: '/profile', priority: 2 },
  { key: 'eas_date', label: 'Set your EAS date for transition planning', href: '/profile', priority: 2 },
  { key: 'first_name', label: 'Add your first name', href: '/profile', priority: 1 },
  { key: 'last_name', label: 'Add your last name', href: '/profile', priority: 1 },
]

function getProfileCompleteness(profile: Record<string, unknown> | null) {
  if (!profile) return { completeness: 0, nextAction: PROFILE_FIELDS[0] }

  const missing: typeof PROFILE_FIELDS = []
  let completed = 0

  for (const field of PROFILE_FIELDS) {
    const value = profile[field.key]
    if (value && value !== '' && value !== null) {
      completed++
    } else {
      missing.push(field)
    }
  }

  const completeness = Math.round((completed / PROFILE_FIELDS.length) * 100)
  // Highest priority missing field = most impactful next action
  const nextAction = missing.sort((a, b) => b.priority - a.priority)[0] || null

  return { completeness, nextAction }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const paymentSuccess = params.payment === 'success'
  const planIntent = typeof params.plan === 'string' ? params.plan : null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const defaultSubscription = { tier: 'free' as const, tierName: 'Free', expiresAt: null, daysRemaining: null, isActive: true }
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }

  // Helper: query usage_tracking directly for display counts
  async function getFeatureUsageCount(userId: string, feature: string): Promise<number> {
    const { data } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature)
    return data?.reduce((sum, row) => sum + (row.count || 0), 0) || 0
  }

  // Run ALL queries in parallel
  const [
    { data: latestResumes },
    { count: resumeCount },
    { data: profile },
    subscriptionInfo,
    jobMatchCheck,
    coverLetterCheck,
    linkedinUsed,
    translationsUsed,
    privateResumeCheck,
    federalResumeCheck,
  ] = user?.id
    ? await Promise.all([
        supabase.from('resumes').select('id, name, template, resume_type, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(1),
        supabase.from('resumes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('profiles').select('first_name, last_name, branch, rank, years_of_service, eas_date, rating_mos, professional_summary, target_industry, target_role, tier, onboarding_skipped, employer_sharing_opt_in, marketing_opt_in, opt_in_dismiss_count').eq('user_id', user.id).single(),
        getSubscriptionInfo(user.id),
        checkLimit(user.id, 'job_match_analysis'),
        checkLimit(user.id, 'cover_letters'),
        getFeatureUsageCount(user.id, 'linkedin_profile_analysis'),
        getFeatureUsageCount(user.id, 'bullet_translations'),
        checkLimit(user.id, 'private_resumes'),
        checkLimit(user.id, 'federal_resumes'),
      ])
    : [
        { data: null }, { count: 0 }, { data: null },
        defaultSubscription,
        defaultUsage, defaultUsage,
        0, 0, defaultUsage, defaultUsage,
      ]

  const latestResume = latestResumes?.[0] || null
  const jobMatchUsed = jobMatchCheck.used
  const coverLetterUsed = coverLetterCheck.used

  const tier = subscriptionInfo.tier
  const isPaid = tier === 'core' || tier === 'full'
  const isExpired = tier === 'expired'

  const { completeness, nextAction } = getProfileCompleteness(profile)
  const displayName = profile?.first_name || ''
  const showIncompleteProfile = !!(profile?.onboarding_skipped && (!profile?.first_name || !profile?.last_name || !profile?.branch || !profile?.rank))
  const showOptIn = !!(user?.id && profile?.employer_sharing_opt_in === null && profile?.marketing_opt_in === null)

  // UpgradeBanner: only show when a limit is actually hit
  const anyLimitHit = !isPaid && (
    jobMatchCheck.remaining === 0 ||
    coverLetterCheck.remaining === 0 ||
    privateResumeCheck.remaining === 0 ||
    federalResumeCheck.remaining === 0
  )

  const checklist = [
    { done: completeness >= 100, label: 'Complete your profile', href: '/profile' },
    { done: (resumeCount || 0) > 0, label: 'Create a resume', href: '/resumes' },
    { done: jobMatchUsed > 0, label: 'Run a job match', href: '/job-match' },
    { done: coverLetterUsed > 0, label: 'Generate a cover letter', href: '/career-tools' },
    { done: linkedinUsed > 0, label: 'Optimize your LinkedIn', href: '/career-tools' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">
          {displayName ? `Welcome back, ${displayName}` : 'Welcome back'}
        </h1>
        <p className="text-text-muted text-sm mt-1">Mission Status: Active</p>
      </div>

      {/* Expired renewal banner */}
      {isExpired && (
        <div className="p-4 rounded border border-gold/30 bg-gold/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-gold font-heading uppercase tracking-wider text-sm">Your Access Has Ended</p>
            <p className="text-white/50 text-xs mt-1">
              Renew within 7 days for 20% off &mdash; use code <strong className="text-white/70">RENEW20</strong>
            </p>
          </div>
          <Link href="/pricing" className="px-4 py-2 bg-gold text-bg-primary font-heading text-sm font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors whitespace-nowrap">
            Renew Access &rarr;
          </Link>
        </div>
      )}

      {/* Banner slot — max 1 visible at a time */}
      {paymentSuccess ? (
        <PaymentSuccessBanner tier={tier} />
      ) : planIntent ? (
        <PlanIntentCheckout plan={planIntent} currentTier={tier} />
      ) : showIncompleteProfile ? (
        <IncompleteProfileBanner show />
      ) : showOptIn ? (
        <OptInPrompt userId={user!.id} dismissCount={profile?.opt_in_dismiss_count || 0} />
      ) : (
        <GovComputerBanner />
      )}

      {/* MilCalc cross-promo — dismissible, independent of banner slot */}
      <MilCalcBanner />

      {/* Hero — latest resume or create CTA */}
      <ResumeHero resume={latestResume} />

      {/* Profile progress + Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        <ProfileProgress completeness={completeness} nextAction={nextAction} />
        <QuickStats stats={{ resumes: resumeCount || 0, jobsAnalyzed: jobMatchUsed, translations: translationsUsed }} />
      </div>

      {/* Mission Checklist — auto-collapses when >3 items complete */}
      <DashboardChecklist items={checklist} />

      {/* Community Mission — compact single line */}
      <div className="flex items-center gap-2 p-3 rounded-lg border border-gold/10 bg-gold/[0.02]">
        <span className="text-xs">&#128293;</span>
        <span className="text-xs text-text-muted flex-1">Help fellow veterans &mdash; submit military-to-civilian translations</span>
        <Link href="/career-tools?tool=community" className="text-xs font-heading font-bold uppercase tracking-wider text-gold hover:text-gold-bright transition-colors whitespace-nowrap">
          Help Translate &rarr;
        </Link>
      </div>

      {/* Upgrade Banner — only when a limit is actually hit */}
      {anyLimitHit && (
        <UpgradeBanner feature="AI features" tier={tier} variant="banner" />
      )}
    </div>
  )
}
