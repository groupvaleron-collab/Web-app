import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isLinkSessionValid } from '@/lib/link-session'

// Sign-in is by link only (src/lib/auth.ts). A session whose link was revoked,
// rotated or has expired is sent back to the sign-in page.
//
// /admin and /dashboard are retired: the Web-app admin panel is replaced by
// Valeron (links and data are managed there), and the old dashboard reads this
// app's own tables, which a link session has no rows in. Both go to /auctions.

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // The import calculator is hidden for now — its links are removed and a typed
  // URL goes home. Delete this (and '/calculator' in the matcher) to bring it back.
  if (path === '/calculator' || path.startsWith('/calculator/')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const token = await getToken({ req })

  if (!isLinkSessionValid(token)) {
    const signin = new URL('/auth/signin', req.url)
    if (token) signin.searchParams.set('error', 'LinkExpired')
    return NextResponse.redirect(signin)
  }

  if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auctions', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auctions/:path*', '/dashboard/:path*', '/admin/:path*', '/calculator/:path*'],
}
