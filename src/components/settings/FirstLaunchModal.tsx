'use client'

import { useEffect, useState } from 'react'
import { ModalShell } from '@/components/ui/ModalShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ApiKeyWalkthrough } from '@/components/settings/ApiKeyWalkthrough'
import { getSettings, saveSettings, getApiKey } from '@/lib/storage'

/**
 * Shown once on first visit to the app. It explains both modes before asking
 * the user to choose — both choices dismiss it. Dictionary mode needs zero
 * setup and the app is fully usable either way; a key can always be added
 * later in Settings.
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
      <ApiKeyWalkthrough
        isOpen
        onClose={() => {
          setShowKeyEntry(false)
          dismiss()
        }}
        onKeySaved={dismiss}
      />
    )
  }

  return (
    <ModalShell isOpen={open} onClose={dismiss} title="Welcome to Debriefed" maxWidth="max-w-lg">
      <Card
        className="w-full p-6 md:p-6 rounded-t-2xl md:rounded-lg animate-fade-in safe-area-inset-bottom max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:hidden w-12 h-1 bg-border rounded-full mx-auto mb-4" />

        <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-3">
          Welcome to Debriefed
        </h2>
        <p className="text-sm text-text leading-relaxed mb-5">
          Debriefed translates your military experience into civilian resume language. It works two
          ways:
        </p>

        <div className="space-y-4">
          <div className="bg-bg-secondary border border-border rounded-md p-4">
            <p className="font-heading text-sm font-bold uppercase tracking-wider mb-1.5">
              📖 Dictionary mode <span className="text-text-muted normal-case font-normal">(free, no setup)</span>
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              Uses a built-in 33,000+ entry military translation dictionary to convert your bullets,
              evals, and MOS descriptions to civilian language. Works offline. No account, no credit
              card, nothing to sign up for.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border rounded-md p-4">
            <p className="font-heading text-sm font-bold uppercase tracking-wider mb-1.5">
              ✨ AI-enhanced mode <span className="text-text-muted normal-case font-normal">(optional)</span>
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              Adds Anthropic&apos;s Claude AI on top of the dictionary translation for more polished,
              context-aware output. You bring your own API key from Anthropic — they charge about 2
              to 6 cents per resume generation. Your key stays on your device.
            </p>
          </div>
        </div>

        <p className="text-sm text-text-muted leading-relaxed mt-4">
          You can switch between modes any time. You can add a key later from Settings. Most people
          start with Dictionary mode.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 pt-5">
          <Button onClick={dismiss} className="flex-1">
            Use Dictionary mode
          </Button>
          <Button variant="secondary" onClick={() => setShowKeyEntry(true)} className="flex-1">
            Add an Anthropic key
          </Button>
        </div>
      </Card>
    </ModalShell>
  )
}
