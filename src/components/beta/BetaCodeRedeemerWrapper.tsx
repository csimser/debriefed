'use client'

import { BetaCodeRedeemer } from './BetaCodeRedeemer'

interface BetaCodeRedeemerWrapperProps {
  userId: string
}

/**
 * Client wrapper for BetaCodeRedeemer to use in server component layouts.
 */
export function BetaCodeRedeemerWrapper({ userId }: BetaCodeRedeemerWrapperProps) {
  return <BetaCodeRedeemer userId={userId} />
}
