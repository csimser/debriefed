import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

// Tier limits configuration
const TIER_LIMITS = {
  free: {
    private_downloads: 1,
    federal_downloads: 1,
    job_analyses: 3,
    cover_letters: 3,
    elevator_pitches: 3,
    linkedin_analyses: 1,
  },
  core: {
    private_downloads: 999999,
    federal_downloads: 999999,
    job_analyses: 20,
    cover_letters: 999999,
    elevator_pitches: 999999,
    linkedin_analyses: 999999,
  },
  pro: {
    private_downloads: 999999,
    federal_downloads: 999999,
    job_analyses: 999999,
    cover_letters: 999999,
    elevator_pitches: 999999,
    linkedin_analyses: 999999,
  },
}

function getTierLimits(tier: string) {
  if (tier === 'full') return TIER_LIMITS.pro
  if (tier === 'basic') return TIER_LIMITS.core
  return TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free
}

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

// Rotating greeting function
function getGreeting(firstName: string): string {
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const greetings = [
    `${timeGreeting}, ${firstName}`,
    `Welcome back, ${firstName}`,
    `Ready to roll, ${firstName}?`,
    `Let's get after it today`,
    `Good to see you, ${firstName}`,
  ]

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return greetings[dayOfYear % greetings.length]
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch resume count
  const { count: resumeCount } = await supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  // Fetch profile and usage
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user?.id).single()
  const { data: usage } = await supabase.from('usage').select('*').eq('user_id', user?.id).single()

  const daysUntilEAS = profile?.eas_date
    ? Math.ceil((new Date(profile.eas_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  // Get tier and limits
  const tier = profile?.subscription_tier || profile?.tier || 'free'
  const limits = getTierLimits(tier)
  const isPaidTier = tier === 'core' || tier === 'full' || tier === 'pro' || tier === 'basic'

  // Calculate profile completeness
  const profileComplete = calculateProfileCompleteness(profile)

  const displayName = profile?.first_name || 'Warrior'

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
          value={(usage?.job_analyses || 0).toString()}
          label="Jobs Analyzed"
        />
        <StatCard
          icon="◎"
          color="gold"
          value={`${profileComplete}%`}
          label="Profile Complete"
        />
      </div>

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
              current={usage?.private_downloads || 0}
              limit={limits.private_downloads}
            />
            <UsageMeter
              label="Federal Resume Downloads"
              current={usage?.federal_downloads || 0}
              limit={limits.federal_downloads}
            />
            <UsageMeter
              label="Job Match Analyses"
              current={usage?.job_analyses || 0}
              limit={limits.job_analyses}
            />
            <UsageMeter
              label="Cover Letters"
              current={usage?.cover_letters || 0}
              limit={limits.cover_letters}
            />
            <UsageMeter
              label="Elevator Pitches"
              current={usage?.elevator_pitches || 0}
              limit={limits.elevator_pitches}
            />
            <UsageMeter
              label="LinkedIn Analyses"
              current={usage?.linkedin_analyses || 0}
              limit={limits.linkedin_analyses}
            />
          </div>
          {!isPaidTier && (
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
  const isUnlimited = limit >= 999999
  const pct = isUnlimited ? 0 : Math.min((current / limit) * 100, 100)
  const isNearLimit = !isUnlimited && current >= limit * 0.8
  const isAtLimit = !isUnlimited && current >= limit

  const formatLimit = (l: number) => l >= 999999 ? '∞' : l.toString()

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
