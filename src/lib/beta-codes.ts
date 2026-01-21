import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for admin operations
)

export interface BetaCode {
  id: string
  code: string
  tier: string
  max_uses: number
  current_uses: number
  expires_at: string | null
  is_active: boolean
  note: string | null
  created_at: string
}

export async function validateBetaCode(code: string): Promise<{
  valid: boolean
  tier?: string
  error?: string
}> {
  const { data, error } = await supabase
    .from('beta_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return { valid: false, error: 'Invalid code' }
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'Code has expired' }
  }

  // Check if max uses reached
  if (data.current_uses >= data.max_uses) {
    return { valid: false, error: 'Code has reached maximum uses' }
  }

  return { valid: true, tier: data.tier }
}

export async function redeemBetaCode(code: string, userId: string): Promise<{
  success: boolean
  tier?: string
  error?: string
}> {
  // First validate
  const validation = await validateBetaCode(code)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // Get the code record
  const { data: codeRecord } = await supabase
    .from('beta_codes')
    .select('id, tier')
    .eq('code', code.toUpperCase())
    .single()

  if (!codeRecord) {
    return { success: false, error: 'Code not found' }
  }

  // Check if user already redeemed this code
  const { data: existing } = await supabase
    .from('beta_redemptions')
    .select('id')
    .eq('code_id', codeRecord.id)
    .eq('user_id', userId)
    .single()

  if (existing) {
    return { success: false, error: 'You have already redeemed this code' }
  }

  // Create redemption record
  const { error: redemptionError } = await supabase
    .from('beta_redemptions')
    .insert({
      code_id: codeRecord.id,
      user_id: userId,
    })

  if (redemptionError) {
    return { success: false, error: 'Failed to redeem code' }
  }

  // Increment usage count
  await supabase.rpc('increment_beta_code_usage', { code_id: codeRecord.id })

  // Update user's tier
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ tier: codeRecord.tier })
    .eq('user_id', userId)

  if (updateError) {
    return { success: false, error: 'Failed to upgrade tier' }
  }

  return { success: true, tier: codeRecord.tier }
}

export function generateBetaCode(prefix: string = 'BETA'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No I, O, 0, 1 to avoid confusion
  let code = prefix + '-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
