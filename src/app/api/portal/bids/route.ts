import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isLinkSessionValid } from '@/lib/link-session'
import { portalSend } from '@/lib/valeron'

// "Bid on this car for me, up to ¥X" — and withdrawing it while nobody has acted.
// Valeron validates everything; this only carries the link's token.

async function linkToken(req: NextRequest) {
  const token = await getToken({ req })
  return isLinkSessionValid(token) && token?.linkToken ? token.linkToken : null
}

export async function POST(req: NextRequest) {
  const t = await linkToken(req)
  if (!t) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const r = await portalSend('/api/portal/bids', t, { method: 'POST', body: await req.json().catch(() => null) })
  return NextResponse.json(r.body, { status: r.status })
}

export async function DELETE(req: NextRequest) {
  const t = await linkToken(req)
  if (!t) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const lotId = req.nextUrl.searchParams.get('lotId') ?? ''
  const r = await portalSend('/api/portal/bids', t, { method: 'DELETE', query: { lotId } })
  return NextResponse.json(r.body, { status: r.status })
}
