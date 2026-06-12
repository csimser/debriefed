'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ModalShell } from '@/components/ui/ModalShell'
import { saveSettings } from '@/lib/storage'

export function DictionaryIntroModal() {
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = () => {
    setDismissed(true)
    saveSettings({ dictionary_intro_shown: true })
  }

  return (
    <ModalShell isOpen={!dismissed} onClose={handleDismiss} title="Translation Dictionary">
      <div className="bg-bg-card border-t md:border border-border rounded-t-2xl md:rounded-lg w-full shadow-xl">
        {/* Mobile drag indicator */}
        <div className="md:hidden w-12 h-1 bg-border rounded-full mx-auto mt-3" />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-center mb-4">
            Translation Dictionary
          </h2>

          {/* Body */}
          <div className="space-y-3 text-sm text-text-muted leading-relaxed mb-6">
            <p>
              Debriefed translates military jargon to civilian language using a dictionary built and maintained by veterans. The dictionary ships with the app, so the core tools work entirely offline — no AI required, no cost, no account.
            </p>
            <p>
              For deeper AI-powered features, you can connect your own Anthropic API key in Settings. Dictionary translations are always free.
            </p>
            <p className="text-text font-medium">
              Everything stays in your browser. Your data never leaves your device.
            </p>
          </div>

          {/* Buttons — stack on mobile */}
          <div className="flex flex-col-reverse md:flex-row gap-3 safe-area-inset-bottom">
            <Button
              onClick={handleDismiss}
              fullWidthMobile
              className="flex-1"
            >
              Got It
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
