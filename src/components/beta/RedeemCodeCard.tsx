'use client'

import { Card } from '@/components/ui/Card'
import { BetaCodeInput } from './BetaCodeInput'

interface RedeemCodeCardProps {
  userId?: string
  currentPlan?: string
}

export function RedeemCodeCard({ userId, currentPlan }: RedeemCodeCardProps) {
  // Don't show if no user or already upgraded
  if (!userId || (currentPlan && currentPlan !== 'free')) {
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="text-gold">◈</span> Have a Code?
      </h3>
      <p className="text-sm text-text-muted mb-4">
        Enter your access code to unlock premium features.
      </p>
      <BetaCodeInput
        mode="redeem"
        userId={userId}
        onValidCode={() => {
          window.location.reload() // Refresh to show new plan
        }}
      />
    </Card>
  )
}
