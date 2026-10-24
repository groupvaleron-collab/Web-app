import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isLinkSessionValid } from '@/lib/link-session'
import { portalSend } from '@/lib/valeron'

// Star / unstar a car. Valeron checks the car belongs to this link's grades.
export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!isLinkSessionValid(token) || !token?.linkToken) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const r = await portalSend('/api/portal/watchlist', token.linkToken, { method: 'POST', body })
  return NextResponse.json(r.body, { status: r.status })
}
