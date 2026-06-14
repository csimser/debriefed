'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useApiKey } from '@/hooks/useApiKey'
import { validateApiKey } from '@/lib/ai/client'
import {
  clearAllData,
  exportAllData,
  getProfile,
  getSettings,
  importAllData,
  saveProfile,
} from '@/lib/storage'

function maskKey(key: string): string {
  return `sk-ant-••••${key.slice(-4)}`
}

export default function SettingsPage() {
  const router = useRouter()
  const { key, hasKey, loaded, save, clear } = useApiKey()

  const [loading, setLoading] = useState(true)

  // Profile card
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)

  // API key card
  const [editingKey, setEditingKey] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [showDraft, setShowDraft] = useState(false)
  const [keyBusy, setKeyBusy] = useState(false)
  const [keyStatus, setKeyStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [tokensUsed, setTokensUsed] = useState(0)

  // Data card
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<{ ok: boolean; message: string } | null>(null)

  // Danger zone
  const [showDeleteSection, setShowDeleteSection] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    const profile = getProfile()
    setFirstName(profile?.first_name || '')
    setLastName(profile?.last_name || '')
    setEmail(profile?.email || '')
    setTokensUsed(getSettings().tokens_used ?? 0)
    setLoading(false)
  }, [])

  const handleProfileSave = () => {
    saveProfile({
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      email: email.trim() || null,
    })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleTestKey = async () => {
    if (!key) return
    setKeyBusy(true)
    setKeyStatus(null)
    const result = await validateApiKey(key)
    setKeyStatus(
      result.ok
        ? { ok: true, message: 'Key works — Anthropic accepted it.' }
        : { ok: false, message: result.error || 'Key check failed.' },
    )
    setKeyBusy(false)
  }

  const handleSaveKey = async () => {
    setKeyBusy(true)
    setKeyStatus(null)
    const result = await save(keyDraft)
    setKeyBusy(false)
    if (!result.ok) {
      setKeyStatus({ ok: false, message: result.error || 'Could not verify that key.' })
      return
    }
    setKeyDraft('')
    setEditingKey(false)
    setKeyStatus({ ok: true, message: 'Key verified and saved to this browser.' })
  }

  const handleRemoveKey = () => {
    clear()
    setKeyStatus({ ok: true, message: 'Key removed from this browser.' })
  }

  const handleExport = () => {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debriefed-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (file: File) => {
    setImportStatus(null)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const result = importAllData(parsed)
      if (!result.ok) {
        setImportStatus({ ok: false, message: result.error || 'Import failed.' })
        return
      }
      setImportStatus({ ok: true, message: 'Backup restored — reloading...' })
      setTimeout(() => window.location.reload(), 800)
    } catch {
      setImportStatus({ ok: false, message: 'That file is not valid JSON.' })
    }
  }

  const handleDeleteEverything = () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm')
      return
    }
    clearAllData()
    router.push('/')
  }

  if (loading || !loaded) {
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

  const inputClass =
    'w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-base md:text-sm text-text focus:outline-none focus:border-gold/50 transition-colors'

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Settings</h1>

      {/* Anthropic API Key */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Anthropic API Key</h2>

        {hasKey && !editingKey ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-mono text-sm text-text">{key ? maskKey(key) : ''}</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={handleTestKey}
                  disabled={keyBusy}
                  className="text-xs whitespace-nowrap"
                >
                  {keyBusy ? 'Testing...' : 'Test'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => { setEditingKey(true); setKeyDraft(''); setKeyStatus(null) }}
                  className="text-xs whitespace-nowrap"
                >
                  Replace
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRemoveKey}
                  className="text-xs whitespace-nowrap border-status-red/50 text-status-red hover:bg-status-red/10"
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-text-muted">
                Rough usage this browser: ~{tokensUsed.toLocaleString()} tokens. This is a courtesy
                meter only — Anthropic bills your key directly, and most actions cost less than a cent.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">
              Optional — Debriefed works fully without a key. Add one and Claude enhances the
              dictionary output (and unlocks PDF reading). It runs on your own Anthropic API key, sent directly from your browser to
              Anthropic — Debriefed has no servers and no subscriptions. Create a key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-bright underline"
              >
                console.anthropic.com
              </a>{' '}
              and paste it below.
            </p>
            <div className="flex gap-2">
              <input
                type={showDraft ? 'text' : 'password'}
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder="sk-ant-..."
                autoComplete="off"
                spellCheck={false}
                className={`${inputClass} flex-1 font-mono`}
              />
              <Button variant="secondary" onClick={() => setShowDraft((s) => !s)} className="text-xs">
                {showDraft ? 'Hide' : 'Show'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveKey} disabled={keyBusy || !keyDraft.trim()} className="text-xs">
                {keyBusy ? 'Verifying...' : 'Verify & Save'}
              </Button>
              {hasKey && (
                <Button
                  variant="secondary"
                  onClick={() => { setEditingKey(false); setKeyDraft(''); setKeyStatus(null) }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {keyStatus && (
          <div
            className={`mt-4 rounded-md p-3 border ${
              keyStatus.ok
                ? 'bg-status-green/10 border-status-green/20'
                : 'bg-status-red-dim border-status-red/20'
            }`}
          >
            <p className={`text-sm ${keyStatus.ok ? 'text-status-green' : 'text-status-red'}`}>
              {keyStatus.message}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-muted">
            Your key lives only in this browser and is never included in data exports. For a
            guaranteed-authentic build, only download Debriefed from the official GitHub releases.
          </p>
        </div>
      </Card>

      {/* Profile */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Profile</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
            />
            <p className="text-xs text-text-muted mt-1">
              Used on your generated resumes and cover letters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleProfileSave} className="text-xs">
              Save Profile
            </Button>
            {profileSaved && <p className="text-xs text-status-green">Saved</p>}
          </div>
        </div>
      </Card>

      {/* Your Data */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Your Data</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-text font-medium">Export My Data</p>
              <p className="text-xs text-text-muted mt-0.5">
                Download everything — profile, resumes, experiences, applications — as a JSON
                backup. Your API key is never included.
              </p>
            </div>
            <Button variant="secondary" onClick={handleExport} className="text-xs whitespace-nowrap">
              Download JSON
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-text font-medium">Import a Backup</p>
              <p className="text-xs text-text-muted mt-0.5">
                Restore a Debriefed backup file into this browser.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs whitespace-nowrap"
            >
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImportFile(file)
                e.target.value = ''
              }}
            />
          </div>

          {importStatus && (
            <div
              className={`rounded-md p-3 border ${
                importStatus.ok
                  ? 'bg-status-green/10 border-status-green/20'
                  : 'bg-status-red-dim border-status-red/20'
              }`}
            >
              <p className={`text-sm ${importStatus.ok ? 'text-status-green' : 'text-status-red'}`}>
                {importStatus.message}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Community */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">Community</h2>

        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Join The Debrief — a free community for service members and veterans working the
            transition. Resume help, VA claims talk, job search, tool support. Veterans helping
            veterans. No cost, no upsell.
          </p>
          <a
            href="https://discord.gg/mfN7dqnsaY"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-bold uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2 min-h-[44px] bg-gold text-bg-primary hover:bg-gold-bright active:bg-gold-bright px-6 py-3 text-sm rounded-md"
          >
            Join The Debrief on Discord
          </a>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-status-red/20">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-status-red">Danger Zone</h2>

        {!showDeleteSection ? (
          <div>
            <p className="text-text-muted text-sm mb-4">
              Permanently delete all Debriefed data stored in this browser, including your API key.
              This cannot be undone — export a backup first if you want to keep anything.
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteSection(true)}
              className="border-status-red/50 text-status-red hover:bg-status-red/10"
            >
              Delete All Data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-4">
              <p className="text-sm text-status-red font-medium mb-2">Warning: This action is permanent</p>
              <p className="text-sm text-text-muted">Deleting your data will permanently remove:</p>
              <ul className="list-disc list-inside text-sm text-text-muted mt-2 space-y-1">
                <li>All your resumes and generated content</li>
                <li>Your profile and experience data</li>
                <li>Your application tracker history</li>
                <li>Your Anthropic API key</li>
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
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-base md:text-sm text-text font-mono"
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>

            {deleteError && (
              <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleDeleteEverything}
                disabled={deleteConfirmation !== 'DELETE'}
                className="bg-status-red hover:bg-status-red/80 border-status-red"
              >
                Delete Everything
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
