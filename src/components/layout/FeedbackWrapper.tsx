'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FeedbackButton } from './FeedbackButton'

export function FeedbackWrapper() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ id: user.id, email: user.email || '' })
      }
    }
    getUser()
  }, [])

  return <FeedbackButton userId={user?.id} userEmail={user?.email} />
}
