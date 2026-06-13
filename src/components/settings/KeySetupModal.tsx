'use client'

import { useState } from 'react'
import { ModalShell } from '@/components/ui/ModalShell'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useApiKey } from '@/hooks/useApiKey'

interface KeySetupModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a key is saved successfully — re-run the blocked action. */
  onKeySaved?: () => void
  /** Optional context line, e.g. "Cover letters use Claude to write a draft." */
  featureNote?: string
}

/**
 * Shown when an AI feature is used without an Anthropic API key configured.
 * Non-AI features (resume editor, dictionary translator, MOS explorer,
 * exports) never trigger this.
 */
export function KeySetupModal({ isOpen, onClose, onKeySaved, featureNote }: KeySetupModalProps) {
  const { save } = useApiKey()
  const [draft, setDraft] = useState('')
  const [show, setShow] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const result = await save(draft)
    setSaving(false)
    if (!result.ok) {
      setError(result.error ?? 'Could not verify that key.')
      return
    }
    setDraft('')
    onClose()
    onKeySaved?.()
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Add an Anthropic API key (optional)">
      <div className="space-y-4">
        <p className="text-sm text-text-muted">
          {featureNote ?? 'AI enhancement is optional — the dictionary engine works without it.'}{' '}
          Debriefed has no servers and no subscriptions — AI runs on your own Anthropic API key,
          sent directly from your browser to Anthropic. You pay Anthropic only for what you use
          (about 2–6 cents per resume).
        </p>

        <ol className="text-sm text-text-muted list-decimal pl-5 space-y-1">
          <li>
            Create a key at{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              console.anthropic.com
            </a>{' '}
            (free to set up)
          </li>
          <li>Paste it below — it&apos;s checked with a quick test call, then saved</li>
        </ol>

        <div className="flex gap-2">
          <Input
            type={show ? 'text' : 'password'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            spellCheck={false}
            className="flex-1 font-mono text-sm"
          />
          <Button variant="secondary" type="button" onClick={() => setShow((s) => !s)}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </div>

        {error && <p className="text-sm text-status-red">{error}</p>}

        <p className="text-xs text-text-muted">
          Your key is stored only in this browser and never leaves your device except to call
          Anthropic. To keep it that way, use Debriefed from{' '}
          <a href="https://getdebriefed.co" className="underline">
            getdebriefed.co
          </a>{' '}
          or a download from our official GitHub releases — that guarantees you&apos;re running
          the real, unmodified app.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Not now
          </Button>
          <Button onClick={handleSave} disabled={saving || !draft.trim()}>
            {saving ? 'Verifying…' : 'Save key'}
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
