'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface PageLengthIndicatorProps {
  contentHeight: number
  format: 'private' | 'federal'
}

export function PageLengthIndicator({ contentHeight, format }: PageLengthIndicatorProps) {
  // Approximate: 1 page = 1056px at 96dpi (11 inches)
  // With margins: usable height = ~960px
  const pageHeight = 960
  const estimatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight))
  const maxPages = 2
  const isOverLimit = format === 'federal' && estimatedPages > maxPages

  if (format !== 'federal') return null

  return (
    <div
      className={`text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
        isOverLimit
          ? 'bg-status-red/20 text-status-red'
          : 'bg-status-green/20 text-status-green'
      }`}
    >
      {isOverLimit ? (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>~{estimatedPages} pages — exceeds 2-page federal limit</span>
          <span className="text-text-dim ml-1">(auto-trimmed on export)</span>
        </>
      ) : (
        <>
          <span>+</span>
          <span>Page {Math.min(estimatedPages, maxPages)} of {maxPages}</span>
        </>
      )}
    </div>
  )
}

/**
 * Hook to measure content height of a ref element.
 * Returns a stable height value that updates on resize/mutation.
 */
export function useContentHeight(ref: React.RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0)

  const measure = useCallback(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight)
    }
  }, [ref])

  useEffect(() => {
    measure()

    // Re-measure on resize
    const observer = new ResizeObserver(measure)
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [measure, ref])

  return height
}
