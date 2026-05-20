'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface OptInPromptProps {
  userId: string
  dismissCount: number
}

const DISMISS_KEY = 'optin_dismiss_until'

export function OptInPrompt({ userId, dismissCount: initialDismissCount }: OptInPromptProps) {
  const [employerOptIn, setEmployerOptIn] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    if (initialDismissCount >= 3) return true
    try {
      const until = localStorage.getItem(DISMISS_KEY)
      if (until && Date.now() < parseInt(until, 10)) return true
    } catch {}
    return false
  })
  const supabase = createClient()

  if (dismissed) return null

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('profiles')
      .update({
        employer_sharing_opt_in: employerOptIn,
        marketing_opt_in: marketingOptIn,
        opt_in_prompted_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
    setDismissed(true)
  }

  const handleDismiss = () => {
    try {
      // Defer for 7 days via localStorage (no DB call needed)
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000))
    } catch {}
    setDismissed(true)
  }

  return (
    <Card className="p-5 border-gold/30 bg-gradient-to-r from-gold/5 to-transparent">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-heading text-base font-bold uppercase tracking-wider">Quick Preferences</h3>
          <p className="text-sm text-text-muted mt-1">
            Two quick options to help us serve you better. You can change these anytime in Settings.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-text-muted hover:text-text transition-colors text-sm whitespace-nowrap"
        >
          Not Now
        </button>
      </div>

      <div className="space-y-4 mb-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={employerOptIn}
            onChange={(e) => setEmployerOptIn(e.target.checked)}
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
            onChange={(e) => setMarketingOptIn(e.target.checked)}
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

      <Button onClick={handleSave} disabled={saving} size="sm">
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </Card>
  )
}
