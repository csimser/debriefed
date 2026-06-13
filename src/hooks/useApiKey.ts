'use client'

import { useCallback, useEffect, useState } from 'react'
import { getApiKey, setApiKey as storeApiKey, clearApiKey as removeApiKey } from '@/lib/storage'
import { validateApiKey } from '@/lib/ai/client'

/**
 * React access to the user's Anthropic API key (localStorage-backed).
 * `hasKey` is false during the first render (SSR/hydration) and settles
 * after mount.
 */
export function useApiKey() {
  const [key, setKey] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setKey(getApiKey())
    setLoaded(true)
  }, [])

  const save = useCallback(async (newKey: string): Promise<{ ok: boolean; error?: string }> => {
    const trimmed = newKey.trim()
    if (!/^sk-ant-/.test(trimmed)) {
      return { ok: false, error: 'Anthropic keys start with sk-ant- — check you copied the whole key.' }
    }
    const result = await validateApiKey(trimmed)
    if (!result.ok) return result
    storeApiKey(trimmed)
    setKey(trimmed)
    return { ok: true }
  }, [])

  const clear = useCallback(() => {
    removeApiKey()
    setKey(null)
  }, [])

  return { key, hasKey: !!key, loaded, save, clear }
}
