'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  BRANCHES,
  PAYGRADES,
  getRankFromPaygrade,
  getValidPaygradesForBranch,
} from '@/lib/constants/military'

interface StepProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onBack: () => void
  onComplete: () => void
  saving: boolean
  isFirstStep: boolean
  isLastStep: boolean
}

export function StepMilitary({ data, updateData, onNext, onBack, saving, isFirstStep }: StepProps) {
  const isValid = data.branch && data.paygrade && data.years_of_service

  // Get valid paygrades for selected branch
  const validPaygrades = getValidPaygradesForBranch(data.branch || '')

  // Auto-populate rank when branch or paygrade changes
  useEffect(() => {
    if (data.branch && data.paygrade) {
      const autoRank = getRankFromPaygrade(data.branch, data.paygrade)
      if (autoRank && autoRank !== data.rank) {
        updateData({ rank: autoRank })
      }
    }
  }, [data.branch, data.paygrade])

  const handleBranchChange = (branch: string) => {
    updateData({ branch })
    // If current paygrade is invalid for new branch, clear it
    if (data.paygrade && !getValidPaygradesForBranch(branch).includes(data.paygrade)) {
      updateData({ paygrade: '', rank: '' })
    } else if (data.paygrade) {
      // Auto-update rank for new branch
      const newRank = getRankFromPaygrade(branch, data.paygrade)
      if (newRank) {
        updateData({ rank: newRank })
      }
    }
  }

  const handlePaygradeChange = (paygrade: string) => {
    updateData({ paygrade })
    // Auto-populate rank
    if (data.branch) {
      const autoRank = getRankFromPaygrade(data.branch, paygrade)
      if (autoRank) {
        updateData({ rank: autoRank })
      }
    }
  }

  return (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider mb-2 text-center">
        Military Background
      </h2>
      <p className="text-text-muted text-center mb-8">
        Tell us about your service
      </p>

      <div className="space-y-4 max-w-md mx-auto">
        {/* Branch */}
        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            Branch of Service
          </label>
          <select
            value={data.branch || ''}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
          >
            <option value="">Select branch</option>
            {BRANCHES.map((branch) => (
              <option key={branch.value} value={branch.value}>{branch.label}</option>
            ))}
          </select>
        </div>

        {/* Paygrade & Rank */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
              Paygrade
            </label>
            <select
              value={data.paygrade || ''}
              onChange={(e) => handlePaygradeChange(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
            >
              <option value="">Select</option>
              {validPaygrades.map((pg) => (
                <option key={pg} value={pg}>{pg}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
              Rank
            </label>
            <input
              type="text"
              value={data.rank || ''}
              onChange={(e) => updateData({ rank: e.target.value })}
              placeholder="Auto-filled from paygrade"
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-muted/50"
            />
            {data.rank && (
              <p className="text-xs text-text-muted">
                You can edit if needed
              </p>
            )}
          </div>
        </div>

        {/* MOS/Rating */}
        <Input
          label="MOS / Rating / AFSC"
          value={data.mos_rating || ''}
          onChange={(e) => updateData({ mos_rating: e.target.value })}
          placeholder="e.g., DC, 11B, 3D0X2"
        />

        {/* Years of Service */}
        <Input
          label="Years of Service"
          type="number"
          value={data.years_of_service || ''}
          onChange={(e) => updateData({ years_of_service: e.target.value })}
          placeholder="e.g., 20"
        />

        {/* EAS Date */}
        <Input
          label="EAS / Retirement Date (optional)"
          type="date"
          value={data.eas_date || ''}
          onChange={(e) => updateData({ eas_date: e.target.value })}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack} disabled={isFirstStep}>
          ← Back
        </Button>
        <Button onClick={onNext} disabled={!isValid || saving}>
          {saving ? 'Saving...' : 'Continue →'}
        </Button>
      </div>
    </div>
  )
}
