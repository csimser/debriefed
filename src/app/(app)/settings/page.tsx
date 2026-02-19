'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { UpgradeLink } from '@/components/modals/UpgradeModal'
import { Button } from '@/components/ui/Button'


interface UserProfile {
  email: string
  first_name: string
  last_name: string
  plan: string
  created_at: string
  plan_expires_at: string | null
  employer_sharing_opt_in: boolean | null
  marketing_opt_in: boolean | null
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Opt-in preferences
  const [employerOptIn, setEmployerOptIn] = useState<boolean>(false)
  const [marketingOptIn, setMarketingOptIn] = useState<boolean>(false)
  const [optInLoading, setOptInLoading] = useState(false)
  const [optInSuccess, setOptInSuccess] = useState(false)

  // Account deletion
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteSection, setShowDeleteSection] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('email, first_name, last_name, plan, created_at, plan_expires_at, employer_sharing_opt_in, marketing_opt_in')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setEmployerOptIn(profileData.employer_sharing_opt_in === true)
        setMarketingOptIn(profileData.marketing_opt_in === true)
      }
      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleOptInSave = async () => {
    setOptInLoading(true)
    setOptInSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({
        employer_sharing_opt_in: employerOptIn,
        marketing_opt_in: marketingOptIn,
        opt_in_prompted_at: new Date().toISOString(),
      })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

    if (!error) {
      setOptInSuccess(true)
      setTimeout(() => setOptInSuccess(false), 3000)
    }
    setOptInLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm')
      return
    }

    setDeleteLoading(true)
    setDeleteError('')

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      })

      const data = await response.json()

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account')
        setDeleteLoading(false)
        return
      }

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push('/?deleted=true')
    } catch {
      setDeleteError('An error occurred. Please try again.')
      setDeleteLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanDisplay = (plan: string, expiresAt: string | null) => {
    if (expiresAt) {
      const expires = new Date(expiresAt)
      const now = new Date()
      if (expires > now) {
        const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        const planNames: Record<string, string> = { core: 'Core', full: 'Full Access' }
        return `${planNames[plan] || plan} - ${daysLeft}d remaining`
      }
      return 'Free (expired)'
    }
    const planNames: Record<string, string> = {
      free: 'Free',
      core: 'Core',
      full: 'Full Access'
    }
    return planNames[plan] || 'Free'
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-tertiary rounded w-48"></div>
          <div className="h-48 bg-bg-tertiary rounded"></div>
          <div className="h-48 bg-bg-tertiary rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Account Settings</h1>

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Account Information</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">First Name</label>
              <p className="text-text">{profile?.first_name || '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Last Name</label>
              <p className="text-text">{profile?.last_name || '-'}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Email</label>
            <p className="text-text">{profile?.email || '-'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Plan</label>
              <p className="text-gold font-medium">
                {profile ? getPlanDisplay(profile.plan, profile.plan_expires_at) : '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Member Since</label>
              <p className="text-text">{profile?.created_at ? formatDate(profile.created_at) : '-'}</p>
            </div>
          </div>
        </div>

        {profile?.plan === 'free' && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Current plan: <span className="text-text font-medium">Free</span>
            </p>
            <UpgradeLink
              className="px-4 py-2 bg-gold text-bg-primary font-heading text-xs font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors"
            >
              Upgrade →
            </UpgradeLink>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-muted">
            Name and email cannot be changed after registration as they appear on your generated resumes.
          </p>
        </div>
      </Card>

      {/* Email & Privacy */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Email & Privacy</h2>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={employerOptIn}
              onChange={(e) => { setEmployerOptIn(e.target.checked); setOptInSuccess(false) }}
              className="mt-0.5 rounded border-border"
            />
            <div>
              <span className="text-sm text-text group-hover:text-gold transition-colors font-medium">
                It&apos;s OK to share my profile with SkillBridge organizations and employers
              </span>
              <p className="text-xs text-text-muted mt-0.5">
                Your name, email address, skills, certifications, clearance level, and target role may be shared with vetted employers and SkillBridge host companies actively hiring veterans. You can opt out anytime in Settings.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => { setMarketingOptIn(e.target.checked); setOptInSuccess(false) }}
              className="mt-0.5 rounded border-border"
            />
            <div>
              <span className="text-sm text-text group-hover:text-gold transition-colors font-medium">
                It&apos;s OK to send me updates about Debriefed and career resources
              </span>
              <p className="text-xs text-text-muted mt-0.5">
                We&apos;ll occasionally email you about new features, career tips, and transition resources. No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </label>
        </div>

        {optInSuccess && (
          <div className="mt-4 bg-status-green/10 border border-status-green/20 rounded-md p-3">
            <p className="text-sm text-status-green">Preferences saved!</p>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={handleOptInSave} disabled={optInLoading}>
            {optInLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="p-6 border-status-red/20">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-status-red">Danger Zone</h2>

        {!showDeleteSection ? (
          <div>
            <p className="text-text-muted text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteSection(true)}
              className="border-status-red/50 text-status-red hover:bg-status-red/10"
            >
              Delete Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-4">
              <p className="text-sm text-status-red font-medium mb-2">Warning: This action is permanent</p>
              <p className="text-sm text-text-muted">
                Deleting your account will permanently remove:
              </p>
              <ul className="list-disc list-inside text-sm text-text-muted mt-2 space-y-1">
                <li>All your resumes and generated content</li>
                <li>Your profile and experience data</li>
                <li>Your account credentials</li>
                <li>All usage history</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text font-mono"
                placeholder="DELETE"
              />
            </div>

            {deleteError && (
              <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                className="bg-status-red hover:bg-status-red/80 border-status-red"
              >
                {deleteLoading ? 'Deleting...' : 'Delete My Account'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteSection(false)
                  setDeleteConfirmation('')
                  setDeleteError('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
