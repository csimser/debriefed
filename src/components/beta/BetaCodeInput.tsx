'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface BetaCodeInputProps {
  onValidCode?: (tier: string) => void
  onCodeChange?: (code: string) => void
  userId?: string
  mode: 'validate' | 'redeem'
}

export function BetaCodeInput({ onValidCode, onCodeChange, userId, mode }: BetaCodeInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleCodeChange = (value: string) => {
    const upperCode = value.toUpperCase()
    setCode(upperCode)
    onCodeChange?.(upperCode)
  }

  const handleSubmit = async () => {
    if (!code.trim()) return

    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      if (mode === 'validate') {
        const res = await fetch('/api/beta/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code.trim() }),
        })
        const data = await res.json()

        if (data.valid) {
          setStatus({ type: 'success', message: `Valid! Grants ${data.plan?.toUpperCase() || 'FULL'} access` })
          // Store in localStorage for redemption after email verification
          localStorage.setItem('pendingBetaCode', code.trim().toUpperCase())
          onValidCode?.(data.plan)
        } else {
          setStatus({ type: 'error', message: data.error || 'Invalid code' })
        }
      } else {
        // Redeem mode
        const res = await fetch('/api/beta/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code.trim(), userId }),
        })
        const data = await res.json()

        if (data.success) {
          setStatus({ type: 'success', message: data.message || `Upgraded to ${data.tier?.toUpperCase()}!` })
          onValidCode?.(data.tier)
          // Dispatch custom event to update TierBadge
          window.dispatchEvent(new CustomEvent('tier-updated'))
          // Reload after a brief delay to refresh all tier-dependent UI
          setTimeout(() => window.location.reload(), 1500)
        } else {
          setStatus({ type: 'error', message: data.error || 'Redemption failed' })
        }
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="BETA-XXXXXXXX"
          className="font-mono uppercase"
        />
        <Button onClick={handleSubmit} disabled={loading || !code.trim()}>
          {loading ? '...' : mode === 'validate' ? 'Check' : 'Redeem'}
        </Button>
      </div>

      {status.type && (
        <div className={`p-3 rounded-md ${
          status.type === 'success'
            ? 'bg-status-green-dim border border-status-green/20'
            : 'bg-status-red-dim border border-status-red/20'
        }`}>
          <p className={`text-sm ${
            status.type === 'success' ? 'text-status-green' : 'text-status-red'
          }`}>
            {status.message}
          </p>
        </div>
      )}
    </div>
  )
}
