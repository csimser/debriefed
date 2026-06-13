'use client'

import { useEffect, useState } from 'react'
import { ModalShell } from '@/components/ui/ModalShell'
import { Button } from '@/components/ui/Button'
import { KeySetupModal } from '@/components/settings/KeySetupModal'
import { getSettings, saveSettings, getApiKey } from '@/lib/storage'

/**
 * Shown once on first visit to the app. Both choices dismiss it — the
 * dictionary path needs zero setup and the app is fully usable either way.
 * The key can always be added later in Settings.
 */
export function FirstLaunchModal() {
  const [open, setOpen] = useState(false)
  const [showKeyEntry, setShowKeyEntry] = useState(false)

  useEffect(() => {
    const settings = getSettings()
    if (!settings.first_launch_seen && !getApiKey()) {
      setOpen(true)
    }
  }, [])

  const dismiss = () => {
    saveSettings({ first_launch_seen: true })
    setOpen(false)
  }

  if (showKeyEntry) {
    return (
      <KeySetupModal
        isOpen
        onClose={() => {
          setShowKeyEntry(false)
          dismiss()
        }}
        onKeySaved={dismiss}
        featureNote="AI enhancement is optional — everything works without it."
      />
    )
  }

  return (
    <ModalShell isOpen={open} onClose={dismiss} title="Debriefed works for free, no setup required.">
      <div className="space-y-4">
        <p className="text-sm text-text leading-relaxed">
          The built-in translation engine uses our 33,000+ entry dictionary to translate military
          experience into civilian language. This works fully offline and doesn&apos;t cost you
          anything.
        </p>
        <p className="text-sm text-text-muted leading-relaxed">
          Want higher-quality output? Add an Anthropic API key to enhance translations with Claude
          AI. About 2–6 cents per resume on your account. Your key stays on your device. Sign up at{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline"
          >
            console.anthropic.com
          </a>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button onClick={dismiss} className="flex-1">
            Use the dictionary (no key needed)
          </Button>
          <Button variant="secondary" onClick={() => setShowKeyEntry(true)} className="flex-1">
            Add an Anthropic key
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
