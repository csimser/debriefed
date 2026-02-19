import Anthropic from '@anthropic-ai/sdk'

export const PRIMARY_MODEL = 'claude-haiku-4-5-20251001'
export const ESCALATION_MODEL = 'claude-sonnet-4-5-20250929'

export type ModelUsed = 'haiku' | 'sonnet'

interface EscalationResult {
  response: Anthropic.Message
  model_used: ModelUsed
}

/**
 * Call Claude with Haiku first, escalate to Sonnet if quality is poor.
 *
 * Quality checks:
 * - Response text under 20 chars → escalate
 * - Response was truncated (stop_reason: 'max_tokens') → escalate
 * - Response contains ```json in a text-expected context → escalate
 *
 * @param client - Anthropic SDK instance
 * @param params - Same params as anthropic.messages.create() minus 'model'
 * @param options.expectsJson - Set true for routes expecting JSON output
 */
export async function callWithEscalation(
  client: Anthropic,
  params: Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>,
  options?: { expectsJson?: boolean }
): Promise<EscalationResult> {
  let response = await client.messages.create({
    ...params,
    model: PRIMARY_MODEL,
  })

  const textBlock = response.content[0]
  const text = textBlock?.type === 'text' ? textBlock.text : ''

  const needsEscalation =
    text.length < 20 ||
    response.stop_reason === 'max_tokens' ||
    (!options?.expectsJson && text.includes('```json'))

  if (needsEscalation) {
    response = await client.messages.create({
      ...params,
      model: ESCALATION_MODEL,
    })
    return { response, model_used: 'sonnet' }
  }

  return { response, model_used: 'haiku' }
}

/** Get the full model ID string for logging */
export function getModelString(model_used: ModelUsed): string {
  return model_used === 'haiku' ? PRIMARY_MODEL : ESCALATION_MODEL
}
