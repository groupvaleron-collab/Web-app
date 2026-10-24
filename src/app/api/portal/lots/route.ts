import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isLinkSessionValid } from '@/lib/link-session'
import { fetchPortalLots } from '@/lib/valeron'

// The signed-in link's auction lots, fetched from Valeron with the link token
// kept in the session JWT. Valeron re-checks the link on every call, so a revoked
// link stops here at once (401 → the page signs out).

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!isLinkSessionValid(token) || !token?.linkToken) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }
  const res = await fetchPortalLots(token.linkToken)
  if (!res.ok) {
    const status = res.status === 401 ? 401 : 502
    return NextResponse.json({ error: status === 401 ? 'This link is no longer valid' : 'Could not load auctions' }, { status })
  }
  return NextResponse.json(res.data, { headers: { 'Cache-Control': 'no-store' } })
}
