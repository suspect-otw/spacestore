import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define protected routes by role
const PROTECTED_ROUTES = {
  authenticated: ['/dashboard'],
  admin: ['/admin'],
  superAdmin: ['/super-admin']
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if the current path requires authentication
  const pathname = request.nextUrl.pathname
  
  // Check if user is trying to access any protected route
  const needsAuth = PROTECTED_ROUTES.authenticated.some(route => pathname.startsWith(route)) ||
                   PROTECTED_ROUTES.admin.some(route => pathname.startsWith(route)) ||
                   PROTECTED_ROUTES.superAdmin.some(route => pathname.startsWith(route))
  
  if (!user && needsAuth) {
    // User is not logged in and trying to access a protected route
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // For role-based protection (implemented when you add roles to your users)
  // Uncomment and modify this when you implement user roles
  /*
  if (user) {
    // Get user role from user.app_metadata.role or from a database query
    // Example: const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    // const userRole = userData?.role || 'user'
    
    // Check if user is trying to access admin routes
    const isAccessingAdminRoute = PROTECTED_ROUTES.admin.some(route => pathname.startsWith(route))
    if (isAccessingAdminRoute && userRole !== 'admin' && userRole !== 'superAdmin') {
      // Redirect non-admin users trying to access admin routes
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Check if user is trying to access super admin routes
    const isAccessingSuperAdminRoute = PROTECTED_ROUTES.superAdmin.some(route => pathname.startsWith(route))
    if (isAccessingSuperAdminRoute && userRole !== 'superAdmin') {
      // Redirect non-super-admin users trying to access super admin routes
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  */

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}