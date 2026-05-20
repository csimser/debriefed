'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function BlogPostTracker({ slug, category }: { slug: string; category: string }) {
  useEffect(() => {
    trackEvent('blog_post_viewed', { slug, category })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
