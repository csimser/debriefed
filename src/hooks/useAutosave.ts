import { useEffect, useRef, useState, useCallback } from 'react'

export interface AutosaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null
  error: string | null
}

export function useAutosave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 1500 // 1.5 second debounce
) {
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>({
    status: 'idle',
    lastSaved: null,
    error: null,
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstRender = useRef(true)
  const previousData = useRef<string>(JSON.stringify(data))

  const save = useCallback(async (dataToSave: T) => {
    setAutosaveStatus(prev => ({ ...prev, status: 'saving', error: null }))

    try {
      await saveFn(dataToSave)
      setAutosaveStatus({
        status: 'saved',
        lastSaved: new Date(),
        error: null,
      })

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setAutosaveStatus(prev =>
          prev.status === 'saved' ? { ...prev, status: 'idle' } : prev
        )
      }, 2000)
    } catch (error) {
      setAutosaveStatus({
        status: 'error',
        lastSaved: null,
        error: error instanceof Error ? error.message : 'Failed to save',
      })
    }
  }, [saveFn])

  useEffect(() => {
    // Skip first render (initial load)
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Check if data actually changed
    const currentData = JSON.stringify(data)
    if (currentData === previousData.current) {
      return
    }
    previousData.current = currentData

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      save(data)
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, save])

  // Manual save function (for save button if you want one)
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    save(data)
  }, [data, save])

  return { autosaveStatus, saveNow }
}
