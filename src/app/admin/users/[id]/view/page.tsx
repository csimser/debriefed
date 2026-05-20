import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminViewUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Verify admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminProfile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!adminProfile?.is_admin) redirect('/dashboard')

  // Fetch target user profile
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('user_id', id)
    .single()

  if (!profile) redirect('/admin/users')

  // Log admin view (fire and forget)
  try {
    await serviceClient.from('activity_log').insert({
      user_id: user.id,
      action: 'admin_viewed_user_detail',
      details: {
        admin_email: adminProfile.email,
        target_user_id: id,
        target_email: profile.email,
        timestamp: new Date().toISOString(),
      },
    })
  } catch { /* ignore logging errors */ }

  // Fetch all data in parallel
  const [
    { data: resumes },
    { data: experiences },
    { data: subscription },
    { data: feedback },
    { data: usageTrackingRows },
    { data: apiUsage },
    { data: tokenSum },
    { data: activityLog },
    { data: evalUploads },
  ] = await Promise.all([
    serviceClient
      .from('resumes')
      .select('id, name, template, resume_type, created_at, updated_at')
      .eq('user_id', id)
      .order('updated_at', { ascending: false }),
    serviceClient
      .from('experience')
      .select('*, experience_bullets(*)')
      .eq('user_id', id)
      .order('sort_order', { ascending: true }),
    serviceClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', id)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    serviceClient
      .from('user_feedback')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
    serviceClient
      .from('usage_tracking')
      .select('feature, count')
      .eq('user_id', id),
    serviceClient
      .from('api_usage')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
    serviceClient
      .from('api_usage')
      .select('tokens_used')
      .eq('user_id', id),
    serviceClient
      .from('activity_log')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(30),
    serviceClient
      .from('eval_uploads')
      .select('id, file_name, status, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
  ])

  // Aggregate usage stats
  const usageStats: Record<string, number> = {
    resumes_created: resumes?.length || 0,
    cover_letters: 0,
    job_matches: 0,
    eval_uploads: 0,
    bullet_rewrites: 0,
    ai_summaries: 0,
    private_downloads: 0,
    federal_downloads: 0,
  }
  for (const row of usageTrackingRows || []) {
    const count = row.count || 0
    switch (row.feature) {
      case 'cover_letters': usageStats.cover_letters += count; break
      case 'job_match_analysis': usageStats.job_matches += count; break
      case 'eval_uploads': usageStats.eval_uploads += count; break
      case 'bullet_translations': usageStats.bullet_rewrites += count; break
      case 'ai_summaries': usageStats.ai_summaries += count; break
      case 'private_resumes': usageStats.private_downloads += count; break
      case 'federal_resumes': usageStats.federal_downloads += count; break
    }
  }

  const totalTokensUsed = tokenSum?.reduce((sum, row) => sum + (row.tokens_used || 0), 0) || 0

  const userName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'No Name Set'

  return (
    <div className="space-y-6">
      {/* Read-Only Banner */}
      <div className="bg-status-blue/15 border-2 border-status-blue rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-blue/30 flex items-center justify-center text-status-blue font-bold text-lg">
            {(profile.first_name?.[0] || profile.email?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <div className="text-status-blue font-bold text-lg">
              Viewing as: {profile.email}
            </div>
            <div className="text-status-blue/70 text-sm">
              Read-Only Admin View &mdash; {userName}
            </div>
          </div>
        </div>
        <Link
          href={`/admin/users/${id}`}
          className="bg-status-blue/20 hover:bg-status-blue/30 text-status-blue px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          &larr; Back to Admin Panel
        </Link>
      </div>

      {/* User Header */}
      <Card className="p-6 bg-navy/20 border-navy/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-heading text-2xl font-bold">{userName}</h1>
              {profile.is_admin && <Badge variant="red">Admin</Badge>}
              <Badge
                variant={
                  profile.tier === 'full' ? 'gold'
                    : profile.tier === 'core' ? 'green'
                    : 'default'
                }
              >
                {profile.tier?.toUpperCase() || 'FREE'}
              </Badge>
              {profile.suspended ? (
                <Badge variant="red">Suspended</Badge>
              ) : (
                <Badge variant="green">Active</Badge>
              )}
            </div>
            <p className="text-text-muted font-mono">{profile.email}</p>
            <p className="text-text-dim text-sm mt-1">User ID: {profile.user_id}</p>
          </div>
          <div className="text-right text-sm text-text-muted">
            <p>Joined {new Date(profile.created_at).toLocaleDateString()}</p>
            <p>Last updated {new Date(profile.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Subscription Info */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Subscription
            </h2>
            {subscription ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Plan</label>
                  <p className="text-sm font-medium">
                    <Badge variant={subscription.tier === 'full' ? 'gold' : 'green'}>
                      {subscription.tier?.toUpperCase()}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Status</label>
                  <p className="text-sm">
                    <Badge variant={subscription.status === 'active' ? 'green' : 'amber'}>
                      {subscription.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Started</label>
                  <p className="text-sm">{subscription.started_at ? new Date(subscription.started_at).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Expires</label>
                  <p className="text-sm">
                    {subscription.expires_at ? (
                      <>
                        {new Date(subscription.expires_at).toLocaleDateString()}
                        {new Date(subscription.expires_at) < new Date() && (
                          <Badge variant="red" className="ml-2">Expired</Badge>
                        )}
                      </>
                    ) : '—'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Source</label>
                  <p className="text-sm text-text-muted">
                    {subscription.stripe_customer_id === 'admin_grant' ? 'Admin Grant' : 'Stripe'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-text-muted">No active subscription (Free tier)</p>
            )}
          </Card>

          {/* Contact Info */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="First Name" value={profile.first_name} />
              <InfoField label="Last Name" value={profile.last_name} />
              <InfoField label="Email" value={profile.email} />
              <InfoField label="Phone" value={profile.phone} />
              <InfoField label="City" value={profile.city} />
              <InfoField label="State" value={profile.state} />
              <InfoField label="ZIP" value={profile.zip} />
              <InfoField label="LinkedIn" value={profile.linkedin_url} isLink />
            </div>
          </Card>

          {/* Military Info */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Military Background
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Branch" value={profile.branch} />
              <InfoField label="Rank" value={profile.rank} />
              <InfoField label="Paygrade" value={profile.paygrade} />
              <InfoField label="Rating/MOS" value={profile.rating_mos} />
              <InfoField label="Years of Service" value={profile.years_of_service?.toString()} />
              <InfoField label="Clearance" value={profile.clearance} />
              <InfoField label="EAS Date" value={profile.eas_date} />
              <InfoField label="SkillBridge Start" value={profile.skillbridge_start} />
              <InfoField label="SkillBridge End" value={profile.skillbridge_end} />
            </div>
          </Card>

          {/* Career Goals */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Career Goals
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Target Industry" value={profile.target_industry} />
              <InfoField label="Target Role" value={profile.target_role} />
            </div>
            {profile.professional_summary && (
              <div className="mt-4">
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
                  Professional Summary
                </label>
                <p className="text-sm text-text-muted bg-bg-tertiary p-3 rounded">
                  {profile.professional_summary}
                </p>
              </div>
            )}
          </Card>

          {/* Resumes */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Resumes ({resumes?.length || 0})
            </h2>
            {!resumes || resumes.length === 0 ? (
              <p className="text-text-muted">No resumes created</p>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div key={resume.id} className="p-4 bg-bg-tertiary rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{resume.name}</div>
                        <div className="text-xs text-text-muted">
                          {resume.template} &bull; {resume.resume_type} &bull; Updated{' '}
                          {new Date(resume.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Experiences & Bullets */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Experiences ({experiences?.length || 0})
            </h2>
            {!experiences || experiences.length === 0 ? (
              <p className="text-text-muted">No experiences entered</p>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="p-4 bg-bg-tertiary rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gold">{exp.job_title}</div>
                        <div className="text-sm text-text-muted">{exp.organization}</div>
                        {exp.location && (
                          <div className="text-xs text-text-dim">{exp.location}</div>
                        )}
                      </div>
                      <div className="text-right text-xs text-text-muted">
                        {exp.start_date && (
                          <div>
                            {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            {' - '}
                            {exp.is_current
                              ? 'Present'
                              : exp.end_date
                              ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : 'Present'}
                          </div>
                        )}
                      </div>
                    </div>

                    {exp.duties_description && (
                      <p className="text-sm text-text-muted mb-3 italic">
                        {exp.duties_description}
                      </p>
                    )}

                    {exp.experience_bullets && exp.experience_bullets.length > 0 && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-border/50">
                        <div className="text-xs text-text-dim uppercase tracking-wider">
                          Bullets ({exp.experience_bullets.length})
                        </div>
                        {exp.experience_bullets.map((bullet: any) => (
                          <div key={bullet.id} className="text-sm space-y-1 pl-3 border-l-2 border-border">
                            <div className="text-text-muted">
                              <span className="text-xs text-text-dim mr-2">Original:</span>
                              {bullet.original_text}
                            </div>
                            {bullet.translated_text && (
                              <div className="text-status-green">
                                <span className="text-xs text-text-dim mr-2">Translated:</span>
                                {bullet.translated_text}
                              </div>
                            )}
                            {bullet.is_from_eval && (
                              <Badge variant="amber" className="text-xs">From Eval</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Eval Uploads */}
          {evalUploads && evalUploads.length > 0 && (
            <Card className="p-6">
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
                Eval Uploads ({evalUploads.length})
              </h2>
              <div className="space-y-2">
                {evalUploads.map((upload: any) => (
                  <div key={upload.id} className="flex items-center justify-between p-3 bg-bg-tertiary rounded">
                    <div>
                      <span className="text-sm">{upload.file_name}</span>
                      <Badge variant={upload.status === 'completed' ? 'green' : 'amber'} className="ml-2 text-xs">
                        {upload.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-text-dim">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Feedback */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Feedback ({feedback?.length || 0})
            </h2>
            {!feedback || feedback.length === 0 ? (
              <p className="text-text-muted">No feedback submitted</p>
            ) : (
              <div className="space-y-3">
                {feedback.map((item: any) => (
                  <div key={item.id} className="p-4 bg-bg-tertiary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          item.category === 'bug' ? 'red'
                            : item.category === 'feature' ? 'green'
                            : 'default'
                        }
                      >
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === 'new' ? 'amber' : item.status === 'resolved' ? 'green' : 'default'}>
                          {item.status}
                        </Badge>
                        <span className="text-xs text-text-dim">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted">{item.message}</p>
                    {item.page_url && (
                      <p className="text-xs text-text-dim mt-1">Page: {item.page_url}</p>
                    )}
                    {item.admin_response && (
                      <div className="mt-2 p-2 bg-status-blue/10 border border-status-blue/20 rounded text-sm">
                        <span className="text-xs text-status-blue uppercase tracking-wider">Admin Response:</span>
                        <p className="text-text-muted mt-1">{item.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Feature Usage */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Feature Usage
            </h2>
            <div className="space-y-3">
              <UsageStat label="Resumes Created" value={usageStats.resumes_created} />
              <UsageStat label="Private Downloads" value={usageStats.private_downloads} />
              <UsageStat label="Federal Downloads" value={usageStats.federal_downloads} />
              <UsageStat label="Cover Letters" value={usageStats.cover_letters} />
              <UsageStat label="Job Matches" value={usageStats.job_matches} />
              <UsageStat label="Eval Uploads" value={usageStats.eval_uploads} />
              <UsageStat label="AI Summaries" value={usageStats.ai_summaries} />
              <UsageStat label="Bullet Rewrites" value={usageStats.bullet_rewrites} />
            </div>
          </Card>

          {/* API Usage */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              API Usage
            </h2>
            <div className="mb-4 p-3 bg-navy/20 rounded-lg">
              <div className="text-sm text-text-muted">Total Tokens Used</div>
              <div className="text-2xl font-bold text-gold">{totalTokensUsed.toLocaleString()}</div>
            </div>
            {!apiUsage || apiUsage.length === 0 ? (
              <p className="text-text-muted text-sm">No API usage recorded</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {apiUsage.map((entry: any) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 bg-bg-tertiary rounded text-sm">
                    <div>
                      <span className="font-mono text-gold text-xs">{entry.endpoint}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs">{entry.tokens_used.toLocaleString()}</span>
                      <div className="text-xs text-text-dim">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Account Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Onboarding</span>
                {profile.onboarding_completed ? (
                  <Badge variant="green">Completed</Badge>
                ) : (
                  <Badge variant="amber">Pending</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Account</span>
                {profile.suspended ? (
                  <Badge variant="red">Suspended</Badge>
                ) : (
                  <Badge variant="green">Active</Badge>
                )}
              </div>
              {profile.suspended && profile.suspend_reason && (
                <div>
                  <span className="text-xs text-text-dim">Reason:</span>
                  <p className="text-sm text-status-red">{profile.suspend_reason}</p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Resumes</span>
                <span className="font-mono">{resumes?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Tokens</span>
                <span className="font-mono">{totalTokensUsed.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Activity Log */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Recent Activity
            </h2>
            {!activityLog || activityLog.length === 0 ? (
              <p className="text-text-muted text-sm">No activity recorded</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activityLog.map((entry: any) => (
                  <div key={entry.id} className="p-2 bg-bg-tertiary rounded text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-gold text-xs">{entry.action}</span>
                      <span className="text-xs text-text-dim">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {entry.details?.admin_email && (
                      <div className="text-xs text-text-muted mt-1">
                        by {entry.details.admin_email}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoField({
  label,
  value,
  isLink,
}: {
  label: string
  value: string | null | undefined
  isLink?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
        {label}
      </label>
      {value ? (
        isLink ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm">{value}</p>
        )
      ) : (
        <p className="text-sm text-text-dim">&mdash;</p>
      )}
    </div>
  )
}

function UsageStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="font-mono font-bold text-gold">{value}</span>
    </div>
  )
}
