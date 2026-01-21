import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // Public routes - check if logged in user trying to access auth pages
  const authRoutes = ['/login', '/signup']
  if (authRoutes.includes(pathname)) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // Public routes that don't need any auth check
  const publicRoutes = ['/', '/forgot-password', '/reset-password', '/pricing', '/about', '/contact', '/auth']
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return supabaseResponse
  }

  // Protected app routes - require authentication
  const protectedRoutes = ['/dashboard', '/resumes', '/profile', '/job-match', '/career-tools', '/cover-letter', '/linkedin', '/onboarding']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // Admin routes - require authentication AND admin status
  if (pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Only check admin status for /admin routes
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
  }

  // All other routes - just pass through
  return supabaseResponse
}

export const config = {
  matcher: [
    // Only run middleware on page routes, not static assets or API routes
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}
