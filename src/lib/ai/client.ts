/**
 * Browser-side Anthropic client.
 *
 * Debriefed has no backend — users bring their own Anthropic API key, which
 * is stored in localStorage (see Settings) and sent directly from the
 * browser to api.anthropic.com. `dangerouslyAllowBrowser` is appropriate
 * here precisely because the key belongs to the user of this browser; there
 * is no shared server secret to leak.
 */
import Anthropic from '@anthropic-ai/sdk'
import { getApiKey, getSettings, saveSettings } from '@/lib/storage'

export { PRIMARY_MODEL, ESCALATION_MODEL, callWithEscalation, getModelString } from '@/lib/ai-model'
export type { ModelUsed } from '@/lib/ai-model'

export class MissingApiKeyError extends Error {
  constructor() {
    super('No Anthropic API key configured')
    this.name = 'MissingApiKeyError'
  }
}

export function hasApiKey(): boolean {
  return !!getApiKey()
}

/** Returns a client bound to the user's stored key. Throws MissingApiKeyError when unset. */
export function getAnthropicClient(): Anthropic {
  const apiKey = getApiKey()
  if (!apiKey) throw new MissingApiKeyError()
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

export type AIErrorKind =
  | 'missing-key'
  | 'invalid-key'
  | 'rate-limit'
  | 'overloaded'
  | 'network'
  | 'unknown'

export interface ClassifiedAIError {
  kind: AIErrorKind
  /** User-facing message. */
  message: string
}

/** Maps SDK/network errors to user-facing messages for the error modal/toasts. */
export function classifyAIError(err: unknown): ClassifiedAIError {
  if (err instanceof MissingApiKeyError) {
    return { kind: 'missing-key', message: 'Add your Anthropic API key in Settings to use AI features.' }
  }
  if (err instanceof Anthropic.APIError) {
    if (err.status === 401) {
      return {
        kind: 'invalid-key',
        message: 'Your Anthropic API key was rejected. It may have been revoked — check it in Settings.',
      }
    }
    if (err.status === 429) {
      return {
        kind: 'rate-limit',
        message: 'Anthropic rate limit reached for your key. Wait a moment and try again.',
      }
    }
    if (err.status === 529 || err.status === 503) {
      return { kind: 'overloaded', message: 'Anthropic is temporarily overloaded. Try again shortly.' }
    }
    return { kind: 'unknown', message: `Anthropic error: ${err.message}` }
  }
  if (err instanceof Error && /fetch|network|Failed to fetch/i.test(err.message)) {
    return { kind: 'network', message: 'Could not reach Anthropic. Check your internet connection.' }
  }
  return { kind: 'unknown', message: 'Something went wrong calling the AI. Please try again.' }
}

/** Minimal 1-token ping to check a key works before saving it. */
export async function validateApiKey(key: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = new Anthropic({ apiKey: key.trim(), dangerouslyAllowBrowser: true })
    await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'ping' }],
    })
    return { ok: true }
  } catch (err) {
    const classified = classifyAIError(err)
    if (classified.kind === 'invalid-key') {
      return { ok: false, error: 'That key was rejected by Anthropic — double-check it and try again.' }
    }
    // Rate limit / overload still proves the key authenticates
    if (classified.kind === 'rate-limit' || classified.kind === 'overloaded') return { ok: true }
    return { ok: false, error: classified.message }
  }
}

/** Courtesy local token meter — Anthropic bills the user directly. */
export function trackTokens(tokens: number): void {
  if (!tokens) return
  try {
    const current = getSettings().tokens_used ?? 0
    saveSettings({ tokens_used: current + tokens })
  } catch {
    // Meter is best-effort only
  }
}
