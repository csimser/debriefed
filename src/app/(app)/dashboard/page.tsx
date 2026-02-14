import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit, getSubscriptionInfo } from '@/lib/usage-service'
import { GovComputerBanner } from '@/components/layout/GovComputerBanner'
import { IncompleteProfileBanner } from '@/components/layout/IncompleteProfileBanner'
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
        supabase.from('profiles').select('first_name, last_name, branch, rank, rating_mos, years_of_service, target_role, eas_date, tier, onboarding_skipped').eq('user_id', user.id).single(),
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

  const daysUntilEAS = profile?.eas_date
    ? Math.ceil((new Date(profile.eas_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

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
        {daysUntilEAS && daysUntilEAS > 0 && (
          <Card variant="glow" className="px-6 py-4 text-center">
            <div className="font-mono text-3xl font-bold text-gold">{daysUntilEAS}</div>
            <div className="font-heading text-xs uppercase tracking-wider text-text-muted">Days to EAS</div>
          </Card>
        )}
      </div>

      {/* Government Computer Notice */}
      <GovComputerBanner />

      {/* Incomplete Profile Banner (skipped onboarding) */}
      <IncompleteProfileBanner
        show={!!(profile?.onboarding_skipped && (!profile?.first_name || !profile?.last_name || !profile?.branch || !profile?.rank))}
      />

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          icon="◫"
          color="blue"
          value={resumeCount?.toString() || '0'}
          label="Resumes Created"
        />
        <StatCard
          icon="◈"
          color="green"
          value={(jobMatchUsage.used || 0).toString()}
          label="Jobs Analyzed"
        />
        <StatCard
          icon="◎"
          color="gold"
          value={`${profileComplete}%`}
          label="Profile Complete"
        />
      </div>

      {/* Upgrade Banner - shows for free users at 50%+ usage */}
      {!isPaid && (jobMatchUsage.used || 0) + (coverLetterUsage.used || 0) + (privateDownloadUsage.used || 0) > 0 && (
        <UpgradeBanner
          feature="features"
          tier={tier}
          variant="banner"
          coreLimit={15}
        />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Usage Limits */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider">Usage Limits</h2>
            <TierBadge tier={tier} />
          </div>
          <div className="space-y-4">
            <UsageMeter
              label="Private Resume Downloads"
              current={privateDownloadUsage.used || 0}
              limit={privateDownloadUsage.limit || 1}
            />
            <UsageMeter
              label="Federal Resume Downloads"
              current={federalDownloadUsage.used || 0}
              limit={federalDownloadUsage.limit || 1}
            />
            <UsageMeter
              label="Job Match Analyses"
              current={jobMatchUsage.used || 0}
              limit={jobMatchUsage.limit || 1}
            />
            <UsageMeter
              label="Cover Letters"
              current={coverLetterUsage.used || 0}
              limit={coverLetterUsage.limit || 1}
            />
            <UsageMeter
              label="LinkedIn Analyses"
              current={linkedinUsage.used || 0}
              limit={linkedinUsage.limit || 1}
            />
          </div>
          {!isPaid && (
            <div className="mt-6 pt-6 border-t border-border">
              <Link href="/pricing">
                <Button variant="secondary" size="sm">Upgrade for More →</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/resumes" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <span className="text-gold">◫</span> Build Resume
              </Button>
            </Link>
            <Link href="/job-match" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <span className="text-gold">◈</span> Match to Job
              </Button>
            </Link>
            <Link href="/career-tools" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <span className="text-gold">◇</span> Career Tools
              </Button>
            </Link>
            <Link href="/profile" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <span className="text-gold">◎</span> Complete Profile
              </Button>
            </Link>
            <Link href="/help" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <span className="text-gold">?</span> Help Center
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  )
}

function StatCard({ icon, color, value, label }: { icon: string; color: string; value: string; label: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-status-blue-dim text-status-blue',
    green: 'bg-status-green-dim text-status-green',
    gold: 'bg-gold-dim text-gold',
  }
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <div className="font-mono text-2xl font-bold">{value}</div>
          <div className="font-heading text-xs uppercase tracking-wider text-text-muted">{label}</div>
        </div>
      </div>
    </Card>
  )
}

function TierBadge({ tier }: { tier: string }) {
  const getTierStyle = () => {
    switch (tier) {
      case 'pro':
      case 'full':
        return 'bg-gold text-bg-primary'
      case 'core':
      case 'basic':
        return 'bg-gold/20 text-gold border border-gold/30'
      default:
        return 'bg-bg-tertiary text-text-muted border border-border'
    }
  }

  const getTierLabel = () => {
    switch (tier) {
      case 'pro':
      case 'full':
        return 'FULL'
      case 'core':
      case 'basic':
        return 'CORE'
      default:
        return 'FREE'
    }
  }

  return (
    <span className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider ${getTierStyle()}`}>
      {getTierLabel()} TIER
    </span>
  )
}

function UsageMeter({ label, current, limit }: { label: string; current: number; limit: number }) {
  const isUnlimited = limit === -1 || limit >= 999999
  const pct = isUnlimited ? 0 : Math.min((current / limit) * 100, 100)
  const isNearLimit = !isUnlimited && current >= limit * 0.8
  const isAtLimit = !isUnlimited && current >= limit

  const formatLimit = (l: number) => (l === -1 || l >= 999999) ? '∞' : l.toString()

  const getBarColor = () => {
    if (isAtLimit) return 'bg-status-red'
    if (isNearLimit) return 'bg-status-amber'
    return 'bg-status-green'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-text-muted">{label}</span>
        <span className={`font-mono text-xs ${isAtLimit ? 'text-status-red' : 'text-text-muted'}`}>
          {current}/{formatLimit(limit)}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div className={`h-full ${getBarColor()} transition-all`} style={{ width: `${pct}%` }} />
        </div>
      )}
      {isUnlimited && (
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div className="h-full bg-gold/30 w-full" />
        </div>
      )}
    </div>
  )
}
