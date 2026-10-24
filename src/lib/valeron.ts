// Server-only client for the Valeron main app's customer portal API.
//
// Sign-in links are generated in Valeron (Settings → App Management) and only
// Valeron knows whether one is still valid, so every check goes there with the
// link's token as a bearer. The token never reaches the browser after sign-in —
// it lives inside the encrypted NextAuth JWT.

export const LINK_TOKEN_RE = /^[A-Za-z0-9_-]{43}$/

export type LinkKind = 'CUSTOMER' | 'TEMPORARY'

export interface PortalFilters {
  yearFrom?: number
  colors?: string[]
  auctionGrades?: string[]
}

export interface PortalMe {
  id: string
  kind: LinkKind
  /** What to greet them by. Empty = no name was given. */
  name: string
  expiresAt: string | null
  grades: string[]
  /** The filters the list opens with, set by Valeron for this link. */
  filters: PortalFilters | null
}

export type BidStatus = 'PENDING' | 'PLACED' | 'WON' | 'LOST' | 'CANCELLED'

export interface PortalLot {
  id: string
  brand: string | null
  model: string | null
  grade: string
  trim: string | null
  modelCode: string | null
  year: number | null
  regMonth: number | null
  auctionGrade: string | null
  color: string | null
  mileage: number | null
  transmission: string | null
  engine: string | null
  fuelType: string | null
  startPrice: number | null
  auctionName: string | null
  tradeAt: string | null
  auctioned: boolean
  photos: string[]
  sheet: string | null
  /** Starred by this customer. */
  watched: boolean
  /** Their bid request on this car, if any. Amount in Sri Lankan rupees. */
  bid: { maxBid: number; status: BidStatus; note: string | null } | null
}

type Result<T> = { ok: true; data: T } | { ok: false; status: number }

async function portalGet<T>(path: '/api/portal/me' | '/api/portal/lots', token: string): Promise<Result<T>> {
  const base = process.env.VALERON_API_URL?.trim().replace(/\/+$/, '')
  if (!base) {
    console.error('VALERON_API_URL is not set')
    return { ok: false, status: 500 }
  }
  try {
    const res = await fetch(`${base}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return { ok: false, status: res.status }
    return { ok: true, data: (await res.json()) as T }
  } catch (err) {
    console.error(`Valeron ${path} failed:`, err)
    return { ok: false, status: 502 }
  }
}

/** A customer action (star, bid request) — passes Valeron's answer straight back. */
export async function portalSend(
  path: '/api/portal/watchlist' | '/api/portal/bids',
  token: string,
  init: { method: 'POST' | 'DELETE'; body?: unknown; query?: Record<string, string> },
): Promise<{ status: number; body: unknown }> {
  const base = process.env.VALERON_API_URL?.trim().replace(/\/+$/, '')
  if (!base) return { status: 500, body: { error: 'Not configured' } }
  const url = new URL(`${base}${path}`)
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, v)
  try {
    const res = await fetch(url, {
      method: init.method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    return { status: res.status, body: await res.json().catch(() => ({})) }
  } catch (err) {
    console.error(`Valeron ${path} failed:`, err)
    return { status: 502, body: { error: 'Could not reach the server — try again' } }
  }
}

export const fetchPortalMe = (token: string) => portalGet<PortalMe>('/api/portal/me', token)
export const fetchPortalLots = (token: string) => portalGet<{ me: PortalMe; lots: PortalLot[] }>('/api/portal/lots', token)
