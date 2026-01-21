'use client'

interface PageLengthIndicatorProps {
  contentHeight: number  // In pixels
  format: 'private' | 'federal'
}

export function PageLengthIndicator({ contentHeight, format }: PageLengthIndicatorProps) {
  // Approximate: 1 page = 1056px at 96dpi (11 inches)
  // With margins: usable height = ~960px
  const pageHeight = 960
  const estimatedPages = Math.ceil(contentHeight / pageHeight)
  const maxPages = format === 'federal' ? 2 : 2
  const isOverLimit = estimatedPages > maxPages

  return (
    <div
      className={`text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
        isOverLimit
          ? 'bg-status-red/20 text-status-red'
          : 'bg-status-green/20 text-status-green'
      }`}
    >
      <span>{isOverLimit ? '!' : '+'}</span>
      <span>
        ~{estimatedPages} page{estimatedPages !== 1 ? 's' : ''}
        {isOverLimit && format === 'federal' && ' (Federal limit: 2)'}
      </span>
    </div>
  )
}

/**
 * Hook to measure content height
 */
export function useContentHeight(ref: React.RefObject<HTMLElement | null>) {
  const getHeight = () => ref.current?.scrollHeight || 0
  return getHeight
}
