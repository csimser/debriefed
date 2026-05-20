import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // 'lax' is required — government browsers block 'none' (third-party)
        sameSite: 'lax',
        secure: true,
      },
    }
  )
}
