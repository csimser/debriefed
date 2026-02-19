import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit, getSubscriptionInfo } from '@/lib/usage-service'
import { GovComputerBanner } from '@/components/layout/GovComputerBanner'
import { IncompleteProfileBanner } from '@/components/layout/IncompleteProfileBanner'
import { OptInPrompt } from '@/components/layout/OptInPrompt'
import { CommunityMissionWidget } from '@/components/dashboard/CommunityMissionWidget'
import Link from 'next/link'

// Profile fields for completeness calculation
const PROFILE_FIELDS = [
  'first_name',
  'last_name',
  'branch',
  'rank',
  'rating_mos',
  'years_of_service',
  'target_role',
  'eas_date',
]

function calculateProfileCompleteness(profile: Record<string, unknown> | null): number {
  if (!profile) return 0

  let completed = 0
  for (const field of PROFILE_FIELDS) {
    const value = profile[field]
    if (value && value !== '' && value !== null) {
      completed++
    }
  }

  return Math.round((completed / PROFILE_FIELDS.length) * 100)
}

function getGreeting(firstName?: string): string {
  const hour = new Date().getHours()
  let timeGreeting
  if (hour < 12) {
    timeGreeting = 'Welcome back'
  } else if (hour < 17) {
    timeGreeting = 'Welcome back'
  } else {
    timeGreeting = 'Welcome back'
  }

  return firstName
    ? `${timeGreeting}, ${firstName}`
    : timeGreeting
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const defaultSubscription = { tier: 'free' as const, tierName: 'Free', expiresAt: null, daysRemaining: null, isActive: true }
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }

  // Run ALL queries in parallel — they all only need user.id
  const [
    { count: resumeCount },
    { data: profile },
    subscriptionInfo,
    jobMatchUsage,
    coverLetterUsage,
    linkedinUsage,
    privateDownloadUsage,
    federalDownloadUsage,
  ] = user?.id
    ? await Promise.all([
        supabase.from('resumes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('profiles').select('first_name, last_name, branch, rank, rating_mos, years_of_service, target_role, eas_date, tier, onboarding_skipped, employer_sharing_opt_in, marketing_opt_in, opt_in_dismiss_count').eq('user_id', user.id).single(),
        getSubscriptionInfo(user.id),
        checkLimit(user.id, 'job_match_analysis'),
        checkLimit(user.id, 'cover_letters'),
        checkLimit(user.id, 'linkedin_profile_analysis'),
        checkLimit(user.id, 'private_resumes'),
        checkLimit(user.id, 'federal_resumes'),
      ])
    : [
        { count: 0 }, { data: null },
        defaultSubscription,
        defaultUsage, defaultUsage, defaultUsage, defaultUsage, defaultUsage,
      ]

  const tier = subscriptionInfo.tier
  const isPaid = tier === 'core' || tier === 'full'

  // Calculate profile completeness
  const profileComplete = calculateProfileCompleteness(profile)

  const displayName = profile?.first_name || ''

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">
            {getGreeting(displayName)}
          </h1>
          <p className="text-text-muted mt-1">Mission Status: Active</p>
        </div>
      </div>

      {/* Government Computer Notice */}
      <GovComputerBanner />

      {/* Incomplete Profile Banner (skipped onboarding) */}
      <IncompleteProfileBanner
        show={!!(profile?.onboarding_skipped && (!profile?.first_name || !profile?.last_name || !profile?.branch || !profile?.rank))}
      />

      {/* Opt-In Prompt (existing users who haven't been asked) */}
      {user?.id && profile?.employer_sharing_opt_in === null && profile?.marketing_opt_in === null && (
        <OptInPrompt userId={user.id} dismissCount={profile?.opt_in_dismiss_count || 0} />
      )}

      {/* Feedback Banner */}
      <div className="bg-gold-dim border border-gold/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-gold text-xl">💡</span>
          <div className="flex-1">
            <p className="text-sm">
              <strong>Welcome!</strong> This is a new platform and we&apos;re actively improving it.
              Please report any bugs or feature suggestions using the{' '}
              <span className="text-gold font-medium">Feedback</span> button or email{' '}
              <a href="mailto:support@getdebriefed.co" className="text-gold hover:underline">
                support@getdebriefed.co
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Community Callout */}
      <div className="p-5 border-2 border-gold/30 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent rounded-xl">
        <h2 className="font-heading text-base md:text-lg font-bold uppercase tracking-wider text-gold mb-2">
          Why is Debriefed free?
        </h2>
        <p className="text-sm text-text-muted mb-1">
          Because veterans like you contribute translations to our dictionary. That dictionary replaces expensive AI — keeping resume building, job matching, cover letters, and LinkedIn optimization free for everyone.
        </p>
        <p className="text-sm font-semibold text-text mb-4">
          The more you contribute, the better it gets for every veteran.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/career-tools?tool=community"
            className="px-4 py-2 bg-gold text-bg-primary rounded-lg font-heading font-bold uppercase text-xs tracking-wider hover:bg-gold-bright transition-colors"
          >
            Contribute a Translation →
          </Link>
        </div>
      </div>

      {/* Mission Checklist */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Your Mission Checklist</h2>
        <div className="space-y-3">
          <ChecklistItem
            done={profileComplete >= 100}
            label="Complete your profile"
            href="/profile"
          />
          <ChecklistItem
            done={(resumeCount || 0) > 0}
            label="Create a resume"
            href="/resumes"
          />
          <ChecklistItem
            done={(jobMatchUsage.used || 0) > 0}
            label="Run a job match"
            href="/job-match"
          />
          <ChecklistItem
            done={(coverLetterUsage.used || 0) > 0}
            label="Generate a cover letter"
            href="/career-tools"
          />
          <ChecklistItem
            done={(linkedinUsage.used || 0) > 0}
            label="Optimize your LinkedIn"
            href="/career-tools"
          />
        </div>
      </Card>

      {/* Community Mission Widget */}
      <CommunityMissionWidget />

      {/* Upgrade Banner - shows for free users at 50%+ usage */}
      {!isPaid && (jobMatchUsage.used || 0) + (coverLetterUsage.used || 0) + (privateDownloadUsage.used || 0) > 0 && (
        <UpgradeBanner
          feature="features"
          tier={tier}
          variant="banner"
          coreLimit={15}
        />
      )}

    </div>
  )
}

function ChecklistItem({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-gold/20 text-gold' : 'bg-bg-tertiary text-text-muted'
      }`}>
        {done ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="w-2 h-2 rounded-full bg-text-muted/40" />
        )}
      </div>
      {done ? (
        <span className="text-sm text-text">{label}</span>
      ) : (
        <Link href={href} className="text-sm text-gold hover:text-gold-bright font-medium transition-colors">
          {label} →
        </Link>
      )}
    </div>
  )
}
