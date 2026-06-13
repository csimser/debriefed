'use client'

import { useState } from 'react'
import { ModalShell } from '@/components/ui/ModalShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useApiKey } from '@/hooks/useApiKey'

const CONSOLE_URL = 'https://console.anthropic.com'

interface ApiKeyWalkthroughProps {
  isOpen: boolean
  /** Cancel — closes the flow, leaves the user in Dictionary mode with no key saved. */
  onClose: () => void
  /** Called after a key is verified and saved. */
  onKeySaved?: () => void
}

/**
 * Multi-step walkthrough for getting an Anthropic API key and turning on
 * AI-enhanced mode. Reused by the first-launch modal and the Settings page.
 * Walks the user from "what you'll need" through account creation, adding
 * credit, creating the key, and pasting + verifying it — rather than just
 * showing a bare input field.
 */
export function ApiKeyWalkthrough({ isOpen, onClose, onKeySaved }: ApiKeyWalkthroughProps) {
  const { save } = useApiKey()
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const TOTAL = 5

  const handleClose = () => {
    // Reset so a re-open starts at the beginning.
    setStep(1)
    setDraft('')
    setShow(false)
    setError(null)
    onClose()
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await save(draft)
    setSaving(false)
    if (!result.ok) {
      setError(
        result.error ||
          'Could not verify that key. Likely causes: the key was mistyped, it has been revoked, or the account has no credit balance yet.',
      )
      return
    }
    setStep(1)
    setDraft('')
    setShow(false)
    onKeySaved?.()
    onClose()
  }

  const inputClass =
    'w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-base md:text-sm text-text font-mono focus:outline-none focus:border-gold/50 transition-colors'
  const numberedList = 'text-sm text-text-muted list-decimal pl-5 space-y-2 leading-relaxed'
  const link = 'text-gold hover:text-gold-bright underline'

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Add an Anthropic API key"
      maxWidth="max-w-lg"
    >
      <Card
        className="w-full p-6 md:p-6 rounded-t-2xl md:rounded-lg animate-fade-in safe-area-inset-bottom max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:hidden w-12 h-1 bg-border rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-2.5 py-1 rounded">
            Step {step} of {TOTAL}
          </span>
          <button
            onClick={handleClose}
            className="text-text-dim hover:text-text text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Step 1 — What you'll need */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
              What you&apos;ll need
            </h2>
            <p className="text-sm text-text leading-relaxed">
              To use AI-enhanced mode, you&apos;ll need an Anthropic API key. Here&apos;s how to get
              one — takes about 3 minutes.
            </p>

            <div>
              <p className="text-xs font-heading uppercase tracking-wider text-text-muted mb-2">
                You&apos;ll need
              </p>
              <ul className="text-sm text-text-muted list-disc pl-5 space-y-1">
                <li>An email address</li>
                <li>A credit card (you&apos;ll add $5 in starting credit)</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-heading uppercase tracking-wider text-text-muted mb-2">
                Cost expectation
              </p>
              <ul className="text-sm text-text-muted list-disc pl-5 space-y-1">
                <li>Each resume generation costs about $0.02 to $0.06</li>
                <li>$5 covers roughly 80 to 250 resume generations</li>
                <li>Most users spend less than $2 during their entire transition</li>
              </ul>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 2 — Create your Anthropic account */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
              Create your Anthropic account
            </h2>
            <ol className={numberedList}>
              <li>
                Open{' '}
                <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer" className={link}>
                  console.anthropic.com
                </a>{' '}
                in a new tab
              </li>
              <li>Click &quot;Sign up&quot; and create an account with your email</li>
              <li>Verify your email when Anthropic sends the confirmation</li>
            </ol>
            <p className="text-sm text-text-muted leading-relaxed">
              Once you&apos;re logged in, come back here and click Continue.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <button onClick={() => setStep(1)} className="text-xs text-text-muted hover:text-text">
                ← Back
              </button>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <a
                  href={CONSOLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-heading font-bold uppercase tracking-wider text-sm min-h-[44px] px-6 py-3 rounded-md bg-bg-tertiary border border-border text-text hover:border-border-bright transition-all"
                >
                  Open console.anthropic.com
                </a>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Add credit */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider">Add credit</h2>
            <ol className={numberedList}>
              <li>
                In the Anthropic console, click <strong className="text-text">Settings → Billing</strong>
              </li>
              <li>Click &quot;Add to credit balance&quot;</li>
              <li>Add $5 (this is the minimum and lasts most users their entire job search)</li>
              <li>Add your credit card and complete the payment</li>
            </ol>
            <p className="text-sm text-text-muted leading-relaxed">
              This is a one-time charge. Anthropic doesn&apos;t auto-bill you — you only pay for what
              you actually use, and you control when to add more credit.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <button onClick={() => setStep(2)} className="text-xs text-text-muted hover:text-text">
                ← Back
              </button>
              <Button onClick={() => setStep(4)}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 4 — Create your API key */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
              Create your API key
            </h2>
            <ol className={numberedList}>
              <li>
                In the Anthropic console, click <strong className="text-text">&quot;API Keys&quot;</strong>{' '}
                in the left sidebar
              </li>
              <li>Click &quot;Create Key&quot;</li>
              <li>Name it &quot;Debriefed&quot; (or anything you want)</li>
              <li>
                Copy the key — it starts with <span className="font-mono text-text">sk-ant-</span>
              </li>
            </ol>
            <div className="bg-gold-dim border border-gold/20 rounded-md p-3">
              <p className="text-sm text-text">
                <strong>Important:</strong> Anthropic only shows you the key once. Copy it before
                closing the window.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <button onClick={() => setStep(3)} className="text-xs text-text-muted hover:text-text">
                ← Back
              </button>
              <Button onClick={() => setStep(5)}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 5 — Paste and verify */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
              Paste and verify
            </h2>
            <p className="text-sm text-text leading-relaxed">Paste your Anthropic API key here:</p>

            <div className="flex gap-2">
              <input
                type={show ? 'text' : 'password'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="sk-ant-..."
                autoComplete="off"
                spellCheck={false}
                className={`${inputClass} flex-1`}
              />
              <Button variant="secondary" onClick={() => setShow((s) => !s)} className="text-xs">
                {show ? 'Hide' : 'Show'}
              </Button>
            </div>

            {error && (
              <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{error}</p>
              </div>
            )}

            <p className="text-xs text-text-muted leading-relaxed">
              Your key stays on your device. It&apos;s stored in your browser&apos;s local storage
              and only sent directly to Anthropic when you generate something. It never touches any
              server I run. Clear browser data to remove it.
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Only use Debriefed copies from the official GitHub releases or getdebriefed.co. A
              modified copy could potentially read your key.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <button
                onClick={() => setStep(4)}
                className="text-xs text-text-muted hover:text-text"
                disabled={saving}
              >
                ← Back
              </button>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="secondary" onClick={handleClose} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || !draft.trim()}>
                  {saving ? 'Verifying…' : 'Test connection and save'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </ModalShell>
  )
}
