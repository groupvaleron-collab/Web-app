'use client'

import { Calendar, Clock, Gavel, Star } from 'lucide-react'
import { whatsappWith } from '@/lib/contact'
import type { BidStatus, PortalLot } from '@/lib/valeron'

// What the auction list and a car's own page share: formatting, the star, the
// bid badge and the auction-time chip.

export const SL_TZ = 'Asia/Colombo'

/** Sri Lanka time, read the local way: "8:30 am". */
export const slClock = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { timeZone: SL_TZ, hour: 'numeric', minute: '2-digit', hour12: true })
/** "Tue 27 Oct, 8:30 am" — Sri Lanka time. */
export const auctionTime = (iso: string) =>
  `${new Date(iso).toLocaleDateString('en-GB', { timeZone: SL_TZ, weekday: 'short', day: 'numeric', month: 'short' })}, ${slClock(iso)}`

export function relative(iso: string) {
  const mins = Math.round((Date.parse(iso) - Date.now()) / 60_000)
  if (mins <= 0) return null
  if (mins < 60) return `in ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `in ${hours} h`
  return `in ${Math.round(hours / 24)} days`
}

export const yen = (n: number) => `¥${n.toLocaleString('en-US')}`
/** Bid requests are in rupees — what customers think in; staff work out the yen. */
export const lkr = (n: number) => `Rs ${n.toLocaleString('en-US')}`
export const km = (n: number) => `${n.toLocaleString('en-US')} km`
export const titleOf = (l: PortalLot) => [l.year, l.brand, l.model, l.grade].filter(Boolean).join(' ')

export const BID_LABEL: Record<BidStatus, string> = {
  PENDING: 'Bid requested',
  PLACED: 'Bid placed',
  WON: 'Won',
  LOST: 'Not won',
  CANCELLED: 'Cancelled',
}
export const BID_STYLE: Record<BidStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  PLACED: 'bg-sky-50 text-sky-800 border-sky-200',
  WON: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  LOST: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
}

/** WhatsApp, pre-filled with the car — the Ref is what staff search for. */
export function enquiry(l: PortalLot) {
  const bits = [titleOf(l), l.auctionGrade && `auction grade ${l.auctionGrade}`, l.mileage != null && km(l.mileage), l.color]
    .filter(Boolean).join(', ')
  return whatsappWith(`Hi, I'm interested in this auction car: ${bits}. Ref ${l.id}`)
}

export function StarButton({ on, onToggle, className = '' }: { on: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      aria-label={on ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={on}
      className={`p-2 rounded-full bg-white/95 shadow hover:scale-105 transition-transform ${className}`}
    >
      <Star className={`w-5 h-5 ${on ? 'fill-amber-400 text-amber-500' : 'text-slate-500'}`} />
    </button>
  )
}

export function BidBadge({ bid }: { bid: NonNullable<PortalLot['bid']> }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${BID_STYLE[bid.status]}`}>
      <Gavel className="w-3.5 h-3.5" />
      {BID_LABEL[bid.status]} · up to {lkr(bid.maxBid)}
    </span>
  )
}

export function AuctionStatus({ lot }: { lot: PortalLot }) {
  if (lot.auctioned) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Auctioned — result pending
      </span>
    )
  }
  if (!lot.tradeAt) return null
  const rel = relative(lot.tradeAt)
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
      <Calendar className="w-3.5 h-3.5" />
      {auctionTime(lot.tradeAt)}{rel ? ` · ${rel}` : ''}
    </span>
  )
}

/** Where the list keeps its place while a car's page is open, so Back returns to it. */
export const LIST_STATE_KEY = 'auctions:list'

/** "toyota-raize-z" — for downloaded file names. */
export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'car'

/**
 * A download link for one of our stored images. They live in a public Supabase
 * bucket, which serves the file as an attachment when asked with ?download=<name>
 * — a plain <a download> is ignored for another origin.
 */
export const downloadHref = (src: string, fileName: string) =>
  `${src}${src.includes('?') ? '&' : '?'}download=${encodeURIComponent(fileName)}`

/**
 * Share the image itself where the device can (the phone's share sheet —
 * WhatsApp, Viber…), else its link, else copy the link.
 */
export async function shareImage(src: string, fileName: string, title: string): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  try {
    const blob = await (await fetch(src)).blob()
    const file = new File([blob], fileName, { type: blob.type || 'image/webp' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title })
      return 'shared'
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 'cancelled'
  }
  try {
    if (navigator.share) {
      await navigator.share({ title, url: src })
      return 'shared'
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 'cancelled'
  }
  try {
    await navigator.clipboard.writeText(src)
    return 'copied'
  } catch {
    return 'failed'
  }
}
