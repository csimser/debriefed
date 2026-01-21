'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm text-text-muted hover:text-status-red hover:bg-status-red-dim transition-all"
    >
      <span>⏻</span>
      <span className="font-heading uppercase tracking-wider text-xs">Sign Out</span>
    </button>
  )
}
