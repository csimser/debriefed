'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ModalShell } from '@/components/ui/ModalShell'
import { createClient } from '@/lib/supabase/client'

const LS_KEY = 'dictionary_intro_dismissed'

interface DictionaryIntroModalProps {
  userId: string
}

export function DictionaryIntroModal({ userId }: DictionaryIntroModalProps) {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check localStorage on mount — prevents re-showing if DB update failed previously
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(LS_KEY) === 'true') {
      setDismissed(true)
    }
  }, [])

  const markShown = async () => {
    // localStorage fallback — survives even if DB update fails
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_KEY, 'true')
    }

    console.log('[dictionary-intro] Updating dictionary_intro_shown for user:', userId)
    const { error } = await supabase
      .from('profiles')
      .update({ dictionary_intro_shown: true })
      .eq('user_id', userId)

    if (error) {
      console.error('[dictionary-intro] Failed to update dictionary_intro_shown:', error.message, error)
    } else {
      console.log('[dictionary-intro] Successfully updated dictionary_intro_shown')
    }
  }

  const handleDismiss = async () => {
    setDismissed(true)
    await markShown()
  }

  const handleContribute = async () => {
    setDismissed(true)
    await markShown()
    router.push('/career-tools?tool=community')
  }

  return (
    <ModalShell isOpen={!dismissed} onClose={handleDismiss} title="Community Dictionary">
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
            Community Dictionary
          </h2>

          {/* Body */}
          <div className="space-y-3 text-sm text-text-muted leading-relaxed mb-6">
            <p>
              Debriefed translates military jargon to civilian language using a dictionary built and maintained by veterans like you. The free tier is powered almost entirely by this dictionary — it&apos;s what makes Debriefed accessible to every veteran, regardless of budget.
            </p>
            <p>
              If you ever see a wrong or missing translation, you can submit a correction or add a new term right from the app.
            </p>
            <p className="text-text font-medium">
              Your submissions help every veteran who comes after you.
            </p>
            <p>
              Contributing is always free — submissions never cost credits.
            </p>
          </div>

          {/* Buttons — stack on mobile */}
          <div className="flex flex-col-reverse md:flex-row gap-3 safe-area-inset-bottom">
            <Button
              variant="secondary"
              onClick={handleDismiss}
              fullWidthMobile
              className="flex-1"
            >
              Got It
            </Button>
            <Button
              onClick={handleContribute}
              fullWidthMobile
              className="flex-1"
            >
              Contribute Now
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
