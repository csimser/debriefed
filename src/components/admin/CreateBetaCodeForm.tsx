'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function CreateBetaCodeForm() {
  const [code, setCode] = useState('')
  const [tier, setTier] = useState('core')
  const [maxUses, setMaxUses] = useState('1')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let newCode = 'BETA-'
    for (let i = 0; i < 8; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCode(newCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/admin/beta-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.toUpperCase(),
        tier,
        max_uses: parseInt(maxUses),
        note,
      }),
    })

    if (res.ok) {
      setCode('')
      setNote('')
      setMaxUses('1')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-2">
        <label className="block text-xs text-text-muted uppercase mb-1">Code</label>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="BETA-XXXXXXXX"
            className="flex-1 bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text font-mono focus:outline-none focus:border-gold"
            required
          />
          <Button type="button" variant="secondary" onClick={generateCode}>
            Generate
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-text-muted uppercase mb-1">Tier</label>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-gold"
        >
          <option value="core">Core ($35, 30 days)</option>
          <option value="full">Full ($75, 90 days)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-text-muted uppercase mb-1">Max Uses</label>
        <input
          type="number"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          min="1"
          className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-gold"
          required
        />
      </div>

      <div className="flex items-end">
        <Button type="submit" disabled={loading || !code} className="w-full">
          {loading ? 'Creating...' : 'Create Code'}
        </Button>
      </div>

      <div className="md:col-span-5">
        <label className="block text-xs text-text-muted uppercase mb-1">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Reddit launch codes"
          className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-gold"
        />
      </div>
    </form>
  )
}
