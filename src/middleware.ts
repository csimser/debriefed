import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Public routes that must NEVER trigger a session refresh.
 * These pages are stateless w.r.t. auth — the middleware just passes through.
 */
const PUBLIC_PATHS = ['/pricing', '/login', '/signup', '/help', '/auth/callback', '/auth/confirm', '/api/stripe', '/join', '/api/join', '/about', '/privacy', '/terms', '/mos', '/blog', '/waitlist', '/unsubscribe']

/**
 * Protected routes that require authentication.
 * Unauthenticated requests get a 302 redirect to /login at the edge.
 */
const PROTECTED_PATHS = ['/dashboard', '/profile', '/resumes', '/settings', '/career-tools', '/job-match', '/onboarding', '/tracker', '/partner']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip session refresh for public pages — they must not touch auth cookies
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: 'lax',
              secure: true,
            })
          )
        },
      },
    }
  )

  // Refresh the auth session — this updates cookies if the access token was expired
  const { data: { user } } = await supabase.auth.getUser()

  // Server-side 302 redirect for unauthenticated requests to protected routes
  if (!user && PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl, 302)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
