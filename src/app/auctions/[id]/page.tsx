'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  ArrowLeft, Calendar, Camera, ChevronLeft, ChevronRight, Clock, Download, ExternalLink, FileText, Gavel,
  MessageCircle, Phone, Share2,
} from 'lucide-react'
import { CarSkeleton } from '@/components/auctions/Skeletons'
import { COMPANY_PHONE_DISPLAY, WHATSAPP_URL } from '@/lib/contact'
import type { BidStatus, PortalLot } from '@/lib/valeron'
import {
  BID_LABEL, LIST_STATE_KEY, StarButton, auctionTime, downloadHref, enquiry, km, lkr, relative, shareImage, slug, titleOf, yen,
} from '@/components/auctions/lot-ui'

// One auction car on its own page (/auctions/<lot id>).
//
// Computer: photos and details on the left; on the right a panel that stays in
// view — when, the start price, "Ask about this car" first, then the optional
// bid request. Phone: photos, that panel, then the details. The photo frame keeps
// one shape whatever is in it, so nothing below it moves. The auction sheet is a
// different kind of thing — a document to read, not a photo to flick past — so it
// has its own card.

const PHOTO_POLL_MS = 30_000
const PHOTO_POLLS = 30

/** Download + Share for one image. "overlay" sits on a photo; "plain" in a card header. */
function ImageActions({ src, fileName, title, overlay = false }: { src: string; fileName: string; title: string; overlay?: boolean }) {
  const [note, setNote] = useState('')
  const share = async () => {
    const r = await shareImage(src, fileName, title)
    if (r === 'copied') setNote('Link copied')
    else if (r === 'failed') setNote('Couldn’t share')
    if (r === 'copied' || r === 'failed') setTimeout(() => setNote(''), 2000)
  }
  const btn = overlay
    ? 'p-2 rounded-full bg-white/90 shadow text-slate-800 hover:bg-white'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50'
  return (
    <div className="flex items-center gap-1.5">
      {note && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${overlay ? 'bg-slate-900/80 text-white' : 'text-emerald-700'}`}>{note}</span>}
      <a href={downloadHref(src, fileName)} className={btn} aria-label="Download" title="Download">
        <Download className="w-4 h-4" />{!overlay && <span className="hidden sm:inline">Download</span>}
      </a>
      <button type="button" onClick={share} className={btn} aria-label="Share" title="Share">
        <Share2 className="w-4 h-4" />{!overlay && <span className="hidden sm:inline">Share</span>}
      </button>
    </div>
  )
}

function Gallery({ lot }: { lot: PortalLot }) {
  const photos = lot.photos
  const [i, setI] = useState(0)
  const at = Math.min(i, Math.max(photos.length - 1, 0))
  const step = useCallback((d: number) => setI((x) => (photos.length ? (x + d + photos.length) % photos.length : 0)), [photos.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [step])

  return (
    <div className="space-y-3 min-w-0">
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
        {photos.length ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={photos[at]} src={photos[at]} alt={`${titleOf(lot)} — photo ${at + 1}`}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Camera className="w-8 h-8" />
            <p className="text-sm">Photos are on their way</p>
          </div>
        )}
        {photos.length > 1 && (
          <>
            <button onClick={() => step(-1)} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/90 shadow text-slate-800 hover:bg-white" aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => step(1)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/90 shadow text-slate-800 hover:bg-white" aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/75 text-white">
              {at + 1} / {photos.length}
            </span>
          </>
        )}
        {photos.length > 0 && (
          <div className="absolute top-3 right-3">
            <ImageActions
              overlay src={photos[at]} title={titleOf(lot)}
              fileName={`${slug(titleOf(lot))}-photo-${at + 1}.webp`}
            />
          </div>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {photos.map((src, n) => (
            <button
              key={src} onClick={() => setI(n)} aria-label={`Photo ${n + 1}`}
              className={`shrink-0 w-[4.5rem] h-[3.25rem] sm:w-20 sm:h-14 rounded-lg overflow-hidden ring-2 transition ${n === at ? 'ring-slate-900' : 'ring-transparent opacity-70 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** The auction sheet: a document to read, so it has its own card. */
function AuctionSheet({ src, title }: { src: string; title: string }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-100">
        <h2 className="font-bold text-slate-900 inline-flex items-center gap-2"><FileText className="w-4 h-4 text-slate-500" /> Auction sheet</h2>
        <div className="flex items-center gap-1">
          <ImageActions src={src} title={`${title} — auction sheet`} fileName={`${slug(title)}-auction-sheet.webp`} />
          <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50" title="Full size">
            <ExternalLink className="w-4 h-4" /><span className="hidden sm:inline">Full size</span>
          </a>
        </div>
      </div>
      <a href={src} target="_blank" rel="noopener noreferrer" className="block bg-slate-50" aria-label="Open the auction sheet full size">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Auction sheet" loading="lazy" className="w-full h-auto max-h-[80vh] object-contain mx-auto" />
      </a>
    </section>
  )
}

const STEPS = ['Requested', 'Bid placed', 'Result'] as const

/** Requested → Bid placed → Won / Not won. */
function BidTracker({ status }: { status: BidStatus }) {
  const reached = status === 'PENDING' ? 0 : status === 'PLACED' ? 1 : 2
  return (
    <ol className="grid grid-cols-3 gap-1.5">
      {STEPS.map((label, n) => {
        const done = n <= reached
        const text = n === 2 && status === 'WON' ? 'Won' : n === 2 && status === 'LOST' ? 'Not won' : label
        const bar = !done ? 'bg-slate-200' : n === 2 && status === 'WON' ? 'bg-emerald-600' : n === 2 && status === 'LOST' ? 'bg-slate-400' : 'bg-slate-900'
        return (
          <li key={label} className="min-w-0">
            <div className={`h-1 rounded-full ${bar}`} />
            <p className={`mt-1.5 text-[11px] font-semibold truncate ${done ? 'text-slate-900' : 'text-slate-400'}`}>{text}</p>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Optional: "bid for me, up to Rs X" — in rupees, what they think in; staff work
 * out the yen. Collapsed to one line until they open it.
 */
function BidRequest({ lot, onDone }: { lot: PortalLot; onDone: () => void }) {
  const bid = lot.bid?.status === 'CANCELLED' ? null : lot.bid
  const [editing, setEditing] = useState(!bid)
  const [amount, setAmount] = useState(bid ? bid.maxBid : 0)
  const [note, setNote] = useState(bid?.note ?? '')
  const [noteOpen, setNoteOpen] = useState(!!bid?.note)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (lot.auctioned && !bid) return null

  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!amount) return setError('Enter your maximum in rupees.')
    setBusy(true)
    setError('')
    const r = await fetch('/api/portal/bids', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lotId: lot.id, maxBid: amount, note: note.trim() || null }),
    })
    const res = await r.json().catch(() => null)
    setBusy(false)
    if (!r.ok) return setError(res?.error ?? 'Could not send. Please try again.')
    setEditing(false)
    onDone()
  }

  const cancel = async () => {
    setBusy(true)
    const r = await fetch(`/api/portal/bids?lotId=${encodeURIComponent(lot.id)}`, { method: 'DELETE' })
    const res = await r.json().catch(() => null)
    setBusy(false)
    if (!r.ok) return setError(res?.error ?? 'Could not cancel. Please call us.')
    onDone()
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-100">
        <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${bid ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
          <Gavel className="w-4 h-4" />
        </span>
        <span className="flex-1 min-w-0 font-semibold text-slate-900">Bid request</span>
        {bid && <span className="text-xs font-semibold text-slate-500">{BID_LABEL[bid.status]}</span>}
      </div>

      <div className="px-4 sm:px-5 pb-5 pt-1">
          {bid && !editing ? (
            <div className="space-y-4 pt-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-slate-500">Your maximum</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">{lkr(bid.maxBid)}</span>
              </div>
              <BidTracker status={bid.status} />
              {bid.note && <p className="text-sm text-slate-600">“{bid.note}”</p>}
              {bid.status === 'PENDING' && (
                <div className="flex gap-4 text-sm font-semibold">
                  <button onClick={() => setEditing(true)} disabled={busy} className="text-slate-700 hover:text-slate-900">Change</button>
                  <button onClick={cancel} disabled={busy} className="text-red-600 hover:text-red-700">Cancel request</button>
                </div>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          ) : (
            <form onSubmit={send} className="space-y-3 pt-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Your maximum (LKR)</span>
                <div className="relative mt-1.5">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-slate-400">Rs</span>
                  <input
                    inputMode="numeric"
                    value={amount ? amount.toLocaleString('en-US') : ''}
                    onChange={(e) => setAmount(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-xl font-bold tabular-nums text-slate-900 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 outline-none"
                  />
                </div>
              </label>
              {noteOpen ? (
                <textarea
                  value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2} placeholder="Note"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-100 outline-none resize-none text-sm"
                />
              ) : (
                <button type="button" onClick={() => setNoteOpen(true)} className="text-sm font-semibold text-slate-500 hover:text-slate-800">+ Add a note</button>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={busy || !amount} className="btn-primary flex-1 inline-flex items-center justify-center gap-2 py-3 disabled:opacity-50">
                  {bid ? 'Update' : 'Send request'}
                </button>
                {bid && (
                  <button type="button" onClick={() => { setEditing(false); setError('') }} className="px-4 rounded-xl border border-slate-200 text-sm font-semibold">
                    Back
                  </button>
                )}
              </div>
            </form>
          )}
      </div>
    </section>
  )
}

const upperEq = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && !!b && a.trim().toUpperCase() === b.trim().toUpperCase()

const SpecRow = ({ label, value }: { label: string; value: string | number | null | undefined }) =>
  value == null || value === '' ? null : (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-slate-100">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 text-right break-words">{value}</dd>
    </div>
  )

/** "RAIZE Z" → "Raize Z"; short or numbered parts ("CR-V", "NV100") stay as written. */
const nameCase = (s: string) =>
  s.split(' ').map((w) => (w.length <= 2 || /d/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase())).join(' ')

export default function AuctionCarPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lots, setLots] = useState<PortalLot[] | null>(null)
  const [error, setError] = useState('')
  const pollsLeft = useRef(PHOTO_POLLS)

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/portal/lots', { cache: 'no-store' })
      if (r.status === 401) {
        await signOut({ callbackUrl: '/auth/signin?error=LinkExpired' })
        return
      }
      if (!r.ok) throw new Error(String(r.status))
      setLots((await r.json()).lots)
      setError('')
    } catch {
      setError('We couldn’t load this car just now. Please try again in a moment.')
    }
  }, [])
  useEffect(() => { load() }, [load])

  const lot = useMemo(() => lots?.find((l) => l.id === params.id) ?? null, [lots, params.id])

  // Photos still being copied in Valeron — look again, as the list does.
  const waiting = !!lot && !lot.photos.length
  useEffect(() => {
    if (!waiting || pollsLeft.current <= 0) return
    const t = setTimeout(() => { pollsLeft.current -= 1; load() }, PHOTO_POLL_MS)
    return () => clearTimeout(t)
  }, [waiting, lots, load])

  // Back to the list where they left it when they came from it; else to the list.
  const back = () => {
    let fromList = false
    try { fromList = !!sessionStorage.getItem(LIST_STATE_KEY) } catch {}
    if (fromList && window.history.length > 1) router.back()
    else router.push('/auctions')
  }

  const toggleStar = async () => {
    if (!lot) return
    const on = !lot.watched
    const flip = (v: boolean) => setLots((ls) => ls?.map((l) => (l.id === lot.id ? { ...l, watched: v } : l)) ?? ls)
    flip(on)
    const r = await fetch('/api/portal/watchlist', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lotId: lot.id, on }),
    }).catch(() => null)
    if (!r?.ok) flip(!on)
  }

  if (!lots && !error) return <CarSkeleton />

  const backButton = (
    <button onClick={back} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
      <ArrowLeft className="w-4 h-4" /> Back to auctions
    </button>
  )

  if (!lot) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {backButton}
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-card">
          <h1 className="font-bold text-slate-900 text-lg mb-2">{error ? 'Something went wrong' : 'This car is no longer listed'}</h1>
          <p className="text-slate-500">{error || 'Its auction has finished, or it was taken off the list.'}</p>
        </div>
      </div>
    )
  }

  const rel = lot.tradeAt && !lot.auctioned ? relative(lot.tradeAt) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        {backButton}
        <StarButton on={lot.watched} onToggle={toggleStar} className="border border-slate-200 shadow-none" />
      </div>

      {/* Phone: photos → panel → details. Computer: photos + details left, the panel right and in view. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-x-10 lg:gap-y-6 items-start">
        <div className="min-w-0 lg:col-span-7">
          <Gallery lot={lot} />
        </div>

        <aside className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 space-y-4">
          {/* The listing at a glance — each fact once: who makes it and what it is,
              the start price and auction grade, when and where it's auctioned, then
              how to ask about it. Everything else is in Specifications. */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              {lot.brand && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{lot.brand}</p>}
              <h1 className="mt-1 text-2xl sm:text-[1.75rem] font-bold tracking-tight text-slate-900 leading-tight">
                {nameCase([lot.model, lot.grade].filter(Boolean).join(' '))}
              </h1>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Start price</p>
                  <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{lot.startPrice ? yen(lot.startPrice) : '—'}</p>
                </div>
                {lot.auctionGrade && (
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Auction grade</p>
                    <p className="text-3xl font-bold tracking-tight text-slate-900">{lot.auctionGrade}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 mx-5 sm:mx-6 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              {lot.auctioned ? <Clock className="w-5 h-5 text-slate-500 shrink-0" /> : <Calendar className="w-5 h-5 text-slate-500 shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 truncate">
                  {lot.auctioned ? 'Auctioned — result pending' : lot.tradeAt ? auctionTime(lot.tradeAt) : 'Date to be confirmed'}
                </p>
                <p className="text-xs text-slate-500 truncate">{[lot.auctionName, 'Sri Lanka time'].filter(Boolean).join(' · ')}</p>
              </div>
              {rel && <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white">{rel}</span>}
            </div>

            {/* Ask about it — the main button, with Call and WhatsApp beside it. */}
            <div className="flex gap-2.5 p-5 sm:p-6">
                <a
                  href={enquiry(lot)} target="_blank" rel="noopener noreferrer"
                  className="btn-primary flex-1 min-w-0 h-12 !py-0 inline-flex items-center justify-center gap-2 text-base"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" /> <span className="truncate">Ask about this car</span>
                </a>
                <a
                  href={`tel:${COMPANY_PHONE_DISPLAY.replace(/\s/g, '')}`} aria-label="Call us" title={`Call ${COMPANY_PHONE_DISPLAY}`}
                  className="shrink-0 w-12 h-12 grid place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"
                  className="shrink-0 w-12 h-12 grid place-items-center rounded-xl border border-slate-200 bg-white text-emerald-600 hover:bg-slate-50"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
          </section>

          {/* Step two: ask us to bid. */}
          <BidRequest key={`${lot.id}:${lot.bid?.status ?? ''}:${lot.bid?.maxBid ?? ''}`} lot={lot} onDone={load} />
        </aside>

        <div className="min-w-0 lg:col-span-7 space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white px-5 sm:px-6 py-4 sm:py-5">
            <h2 className="font-bold text-slate-900">Specifications</h2>
            <dl className="mt-2 grid sm:grid-cols-2 sm:gap-x-10">
              <SpecRow label="Year" value={lot.year ? `${lot.year}${lot.regMonth ? ` / ${String(lot.regMonth).padStart(2, '0')}` : ''}` : null} />
              <SpecRow label="Mileage" value={lot.mileage != null ? km(lot.mileage) : null} />
              <SpecRow label="Colour" value={lot.color && lot.color.charAt(0) + lot.color.slice(1).toLowerCase()} />
              <SpecRow label="Transmission" value={lot.transmission} />
              <SpecRow label="Engine" value={lot.engine} />
              <SpecRow label="Fuel" value={lot.fuelType} />
              <SpecRow label="Model code" value={lot.modelCode} />
              {/* The trim only when it says more than the grade already in the title. */}
              <SpecRow label="Trim" value={upperEq(lot.trim, lot.grade) ? null : lot.trim} />
            </dl>
          </section>
          {lot.sheet && <AuctionSheet src={lot.sheet} title={titleOf(lot)} />}
          <p className="text-xs text-slate-400">Ref {lot.id}</p>
        </div>
      </div>
    </div>
  )
}
