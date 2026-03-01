import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ADMIN_EMAIL = 'groupvaleron@gmail.com'

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const path = req.nextUrl.pathname
    const isAdminPath = path.startsWith('/admin')
    const isDashboardPath = path.startsWith('/dashboard')
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    const userEmail = token.email as string
    const isAdmin = userEmail === ADMIN_EMAIL || (token.role as string) === 'admin'

    // Admin trying to access admin page - allow
    if (isAdminPath && isAdmin) {
      return NextResponse.next()
    }

    // Non-admin trying to access admin page - redirect to dashboard
    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Admin accessing dashboard - redirect to admin
    // (unless they're viewing a specific user's dashboard)
    if (isDashboardPath && isAdmin && !path.includes('/dashboard/user/')) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Regular user accessing dashboard - allow
    if (isDashboardPath && !isAdmin) {
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
