'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Calendar, Camera, Check, ChevronDown, Clock, FilterX, Gauge, MessageCircle, RefreshCw,
  RotateCcw, SlidersHorizontal, Star, X,
} from 'lucide-react'
import { ListSkeleton } from '@/components/auctions/Skeletons'
import { WHATSAPP_URL } from '@/lib/contact'
import type { PortalLot, PortalMe } from '@/lib/valeron'
import { BidBadge, LIST_STATE_KEY, SL_TZ, StarButton, km, relative, slClock, titleOf, yen } from '@/components/auctions/lot-ui'

// Upcoming auction lots for the grades on this person's link. They come from
// Valeron's stored Auction Watch feed (our own photos and auction sheets), never
// from the auction site live. Customers can star cars and ask us to bid; both are
// sent to Valeron, where staff see them on the account.
//
// A car opens on its own page (/auctions/<id>). The list keeps its filters and
// scroll position in sessionStorage, so coming Back lands where they left off.

/** While photos are still being copied: look again every 30 s, for up to 15 min. */
const PHOTO_POLL_MS = 30_000
const PHOTO_POLLS = 30

const gradeOf = (l: PortalLot) => [l.brand, l.model, l.grade].filter(Boolean).join(' ')
const upper = (s: string | null | undefined) => (s ?? '').trim().toUpperCase()

/** The auction day in Sri Lanka time — "2026-10-26" — or "" when the date isn't known yet. */
const dayKey = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-CA', { timeZone: SL_TZ }) : '')
/** A day key as a date at noon UTC, so formatting it in any zone lands on the same day. */
const dayDate = (key: string) => new Date(`${key}T12:00:00Z`)
const timeOf = slClock
function dayWord(key: string) {
  const today = dayKey(new Date().toISOString())
  const tomorrow = dayKey(new Date(Date.now() + 86_400_000).toISOString())
  return key === today ? 'Today' : key === tomorrow ? 'Tomorrow' : null
}

/** Swatch colours for the colour filter — matched by the word in the auction's colour name. */
const SWATCH: [string, string][] = [
  ['WHITE', '#ffffff'], ['PEARL', '#f4f1ea'], ['BLACK', '#111827'], ['SILVER', '#c0c6cc'], ['GRAY', '#6b7280'],
  ['GREY', '#6b7280'], ['RED', '#dc2626'], ['BLUE', '#2563eb'], ['NAVY', '#1e3a8a'], ['GREEN', '#16a34a'],
  ['BROWN', '#7c4a2d'], ['BEIGE', '#d6c4a1'], ['GOLD', '#c9a227'], ['YELLOW', '#facc15'], ['ORANGE', '#f97316'],
  ['PURPLE', '#7c3aed'], ['PINK', '#ec4899'],
]
const swatchOf = (c: string) => SWATCH.find(([w]) => c.includes(w))?.[1] ?? '#cbd5e1'

type Sort = 'soonest' | 'price' | 'year' | 'mileage'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'soonest', label: 'Soonest auction' },
  { value: 'price', label: 'Lowest start price' },
  { value: 'year', label: 'Newest first' },
  { value: 'mileage', label: 'Lowest mileage' },
]
const MILEAGES = [10_000, 20_000, 30_000, 50_000, 80_000, 100_000]

interface Filters {
  model: string
  /** A day key, or null for every day. */
  day: string | null
  yearFrom: number | null
  yearTo: number | null
  mileageMax: number | null
  auctionGrades: string[]
  colors: string[]
  gearboxes: string[]
  starred: boolean
  sort: Sort
}
const NO_FILTERS: Filters = {
  model: 'all', day: null, yearFrom: null, yearTo: null, mileageMax: null,
  auctionGrades: [], colors: [], gearboxes: [], starred: false, sort: 'soonest',
}

/** The filters Valeron set for this link — what the list opens with, and what "Reset" goes back to. */
const linkDefaults = (f: PortalMe['filters']): Filters => ({
  ...NO_FILTERS,
  yearFrom: f?.yearFrom ?? null,
  colors: (f?.colors ?? []).map(upper),
  auctionGrades: (f?.auctionGrades ?? []).map(upper),
})
const sameFilters = (a: Filters, b: Filters) => JSON.stringify(a) === JSON.stringify(b)

function matches(l: PortalLot, f: Filters) {
  if (f.model !== 'all' && gradeOf(l) !== f.model) return false
  if (f.day != null && dayKey(l.tradeAt) !== f.day) return false
  if (f.yearFrom && (l.year ?? 0) < f.yearFrom) return false
  if (f.yearTo && (l.year ?? Infinity) > f.yearTo) return false
  if (f.mileageMax != null && (l.mileage ?? Infinity) > f.mileageMax) return false
  if (f.gearboxes.length && !f.gearboxes.includes(upper(l.transmission))) return false
  if (f.auctionGrades.length && !f.auctionGrades.includes(upper(l.auctionGrade))) return false
  // "WHITE" also finds "PEARL WHITE".
  if (f.colors.length && !f.colors.some((c) => upper(l.color).includes(c))) return false
  if (f.starred && !l.watched) return false
  return true
}

interface Option { value: string; label: React.ReactNode; count?: number }

/**
 * One filter as a compact field — "AUCTION GRADE  S, 5 ▾" — the same idea as
 * Valeron's auction filter bar: every filter in view at once as a labelled
 * dropdown, a picked one tinted so what's filtering the list reads at a glance.
 * `multiple` holds a list (empty = everything); single holds one value ('' = everything).
 */
function FilterSelect(props: {
  label: string
  options: Option[]
  allLabel?: string
  /** Always holds a value (sort) — never tinted, no "all" entry. */
  required?: boolean
} & (
  | { multiple: true; value: string[]; onChange: (v: string[]) => void }
  | { multiple?: false; value: string; onChange: (v: string) => void }
)) {
  const { label, options, allLabel = 'All', required = false } = props
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const picked = props.multiple ? props.value : props.value ? [props.value] : []
  const active = !required && picked.length > 0
  const show = (v: string) => options.find((o) => o.value === v)?.label ?? v

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  const pick = (v: string) => {
    if (props.multiple) props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v])
    else { props.onChange(v); setOpen(false) }
  }

  return (
    <div ref={box} className="relative min-w-0">
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className={`w-full h-[2.375rem] flex items-center gap-2 pl-2.5 pr-1.5 rounded-lg border text-left transition-colors ${
          active ? 'border-slate-900 bg-slate-900/[0.04]' : 'border-slate-200 bg-white hover:border-slate-300'
        } ${open ? 'ring-2 ring-slate-200' : ''}`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-none">{label}</span>
          <span className={`mt-0.5 flex items-center gap-1.5 text-[13px] leading-tight truncate ${active || required ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
            {picked.length ? (
              <>
                <span className="inline-flex items-center gap-1.5 truncate">{show(picked[0])}</span>
                {picked.length > 1 && (
                  <span className="shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">+{picked.length - 1}</span>
                )}
              </>
            ) : allLabel}
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1.5 left-0 min-w-full w-max max-w-[18rem] max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 animate-scale-in">
          {!required && (
            <button
              type="button" onClick={() => (props.multiple ? props.onChange([]) : pick(''))}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-slate-50 ${!picked.length ? 'font-semibold text-slate-900' : 'text-slate-500'}`}
            >
              {props.multiple && <Box on={!picked.length} />}
              {allLabel}
            </button>
          )}
          {options.map((o) => {
            const on = picked.includes(o.value)
            return (
              <button
                key={o.value} type="button" onClick={() => pick(o.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-slate-50 ${on ? 'font-semibold text-slate-900' : 'text-slate-700'} ${o.count === 0 ? 'opacity-50' : ''}`}
              >
                {props.multiple ? <Box on={on} /> : <Check className={`w-4 h-4 ${on ? 'text-slate-900' : 'invisible'}`} />}
                <span className="flex-1 inline-flex items-center gap-1.5">{o.label}</span>
                {o.count != null && <span className="text-xs text-slate-400 tabular-nums">{o.count}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** A checkbox's look, for the multi-pick menus. */
const Box = ({ on }: { on: boolean }) => (
  <span className={`w-4 h-4 shrink-0 grid place-items-center rounded border ${on ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
    {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
  </span>
)

/** A colour's name with its swatch — "● White". */
const ColorLabel = ({ c }: { c: string }) => (
  <>
    <span className="w-3 h-3 shrink-0 rounded-full border border-slate-300" style={{ background: swatchOf(c) }} />
    {c.charAt(0) + c.slice(1).toLowerCase()}
  </>
)

/**
 * The auction days as one segmented bar — "All days", then a tile per day with
 * its car count under the other filters — like the auction site's own day strip.
 * Picking a day applies at once; every day stays in view to compare.
 */
function DayStrip({ all, days, value, onPick }: {
  all: number
  days: { key: string; n: number }[]
  value: string | null
  onPick: (key: string | null) => void
}) {
  const tiles = [
    { key: null as string | null, top: 'All days', n: all },
    ...days.map((d) => {
      const date = d.key ? dayDate(d.key) : null
      const word = d.key ? dayWord(d.key) : null
      return {
        key: d.key as string | null,
        top: date
          ? `${word ?? date.toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'short' })} · ${date.toLocaleDateString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' })}`
          : 'Date TBC',
        n: d.n,
      }
    }),
  ]
  return (
    <div
      className="grid rounded-xl border border-slate-200 bg-white overflow-x-auto divide-x divide-slate-200 shadow-card"
      style={{ gridTemplateColumns: `repeat(${tiles.length}, minmax(6rem, 1fr))` }}
    >
      {tiles.map((t) => {
        const on = t.key === value
        const empty = t.n === 0 && t.key !== null
        return (
          <button
            key={t.key ?? 'all'} type="button" disabled={empty} onClick={() => onPick(t.key)}
            className={`min-w-0 px-2 py-1.5 text-center transition-colors ${
              on ? 'bg-slate-900 text-white' : empty ? 'text-slate-400 bg-slate-50/60 cursor-default' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className={`block truncate text-[11px] sm:text-xs font-semibold ${on ? 'text-slate-300' : 'text-slate-500'}`}>{t.top}</span>
            <span className="block text-base font-bold leading-tight">
              {t.n}
              <span className={`hidden sm:inline ml-1 text-xs font-medium ${on ? 'text-slate-300' : 'text-slate-500'}`}>{t.n === 1 ? 'car' : 'cars'}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** The filters in force, one chip each — × clears just that one — and Clear all. */
function FilterChips({ items, onClearAll }: { items: { key: string; label: React.ReactNode; clear: () => void }[]; onClearAll: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
      {items.map((i) => (
        <span key={i.key} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          {i.label}
          <button onClick={i.clear} className="p-0.5 rounded-full hover:bg-slate-200 text-slate-500" aria-label="Remove filter">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll} disabled={!items.length}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 disabled:text-slate-300 disabled:hover:text-slate-300"
      >
        <FilterX className="w-3.5 h-3.5" /> Clear all
      </button>
    </div>
  )
}

function LotCard({ lot, onOpen, onStar }: { lot: PortalLot; onOpen: () => void; onStar: () => void }) {
  const rel = lot.tradeAt && !lot.auctioned ? relative(lot.tradeAt) : null
  return (
    <div
      role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter') onOpen() }}
      className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card hover:shadow-soft hover:border-slate-300 transition-all cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {lot.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lot.photos[0]} alt={titleOf(lot)} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
            <Camera className="w-7 h-7" />
            <span className="text-xs">Photos on their way</span>
          </div>
        )}
        {lot.auctionGrade && (
          <span className="absolute top-3 left-3 min-w-[2rem] h-8 px-2 grid place-items-center rounded-lg bg-slate-900/85 backdrop-blur text-white text-sm font-bold shadow">
            {lot.auctionGrade}
          </span>
        )}
        <StarButton on={lot.watched} onToggle={onStar} className="absolute top-2.5 right-2.5" />
        {lot.tradeAt && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur text-white">
            <Clock className="w-3.5 h-3.5" />
            {lot.auctioned ? 'Result pending' : `${timeOf(lot.tradeAt)}${rel ? ` · ${rel}` : ''}`}
          </span>
        )}
        {lot.photos.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-slate-900/75 backdrop-blur text-white">
            <Camera className="w-3.5 h-3.5" /> {lot.photos.length}
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-slate-900 leading-snug">{[lot.brand, lot.model, lot.grade].filter(Boolean).join(' ')}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {[lot.year && `${lot.year}${lot.regMonth ? `/${String(lot.regMonth).padStart(2, '0')}` : ''}`, lot.mileage != null && km(lot.mileage), lot.transmission]
              .filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          {lot.color && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-slate-300" style={{ background: swatchOf(upper(lot.color)) }} />
              {lot.color}
            </span>
          )}
          {lot.engine && <span className="inline-flex items-center gap-1.5"><Gauge className="w-4 h-4 text-slate-400" />{lot.engine}</span>}
        </div>
        {lot.bid && <div><BidBadge bid={lot.bid} /></div>}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
          <p className="text-xs text-slate-500 truncate">{lot.auctionName ?? 'Auction'}</p>
          {lot.startPrice ? (
            <p className="text-right shrink-0">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400">Start</span>
              <span className="font-bold text-slate-900">{yen(lot.startPrice)}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function AuctionsPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<{ me: PortalMe; lots: PortalLot[] } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [defaults, setDefaults] = useState<Filters>(NO_FILTERS)
  // A phone gets one compact bar; the filters open in a sheet from the bottom.
  const [sheet, setSheet] = useState(false)
  const router = useRouter()
  const pollsLeft = useRef(PHOTO_POLLS)
  const scrollTo = useRef<number | null>(null)
  const defaultsApplied = useRef(false)

  const load = useCallback(async (quiet = false) => {
    if (!quiet) {
      setLoading(true)
      setError('')
    }
    try {
      const r = await fetch('/api/portal/lots', { cache: 'no-store' })
      if (r.status === 401) {
        await signOut({ callbackUrl: '/auth/signin?error=LinkExpired' })
        return
      }
      if (!r.ok) throw new Error(String(r.status))
      const d: { me: PortalMe; lots: PortalLot[] } = await r.json()
      setData(d)
      // The filters Valeron set for this link, once — after that they're the customer's.
      if (!defaultsApplied.current) {
        defaultsApplied.current = true
        const f = linkDefaults(d.me.filters)
        setDefaults(f)
        let kept: { filters: Filters; scrollY: number } | null = null
        try {
          const raw = sessionStorage.getItem(LIST_STATE_KEY)
          kept = raw ? JSON.parse(raw) : null
          sessionStorage.removeItem(LIST_STATE_KEY)
        } catch {}
        setFilters(kept?.filters ? { ...NO_FILTERS, ...kept.filters } : f)
        if (kept?.scrollY) scrollTo.current = kept.scrollY
      }
    } catch {
      if (!quiet) setError('We couldn’t load the auctions just now. Please try again in a moment.')
    } finally {
      if (!quiet) setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  // Back from a car: once the list has drawn, return to where they were.
  useEffect(() => {
    if (!data || scrollTo.current == null) return
    const y = scrollTo.current
    scrollTo.current = null
    requestAnimationFrame(() => window.scrollTo({ top: y }))
  }, [data])

  const openCar = (id: string) => {
    try { sessionStorage.setItem(LIST_STATE_KEY, JSON.stringify({ filters, scrollY: window.scrollY })) } catch {}
    router.push(`/auctions/${encodeURIComponent(id)}`)
  }

  // A grade asked for minutes ago is still having its photos copied in Valeron.
  const waiting = !!data?.lots.some((l) => !l.photos.length)
  useEffect(() => {
    if (!waiting || pollsLeft.current <= 0) return
    const t = setTimeout(() => {
      pollsLeft.current -= 1
      load(true)
    }, PHOTO_POLL_MS)
    return () => clearTimeout(t)
  }, [waiting, data, load])

  // The session check runs every few minutes; a revoked link signs out here too.
  useEffect(() => {
    if (session?.invalid) signOut({ callbackUrl: '/auth/signin?error=LinkExpired' })
  }, [session?.invalid])

  const toggleStar = async (lot: PortalLot) => {
    const on = !lot.watched
    const flip = (v: boolean) =>
      setData((d) => d && { ...d, lots: d.lots.map((l) => (l.id === lot.id ? { ...l, watched: v } : l)) })
    flip(on)
    const r = await fetch('/api/portal/watchlist', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lotId: lot.id, on }),
    }).catch(() => null)
    if (!r?.ok) flip(!on)
  }

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }))

  // Soonest auction first; a car with no date yet goes last.
  const lots = useMemo(
    () => [...(data?.lots ?? [])].sort((a, b) => (a.tradeAt ?? '~').localeCompare(b.tradeAt ?? '~')),
    [data],
  )
  const options = useMemo(() => {
    const count = (f: (l: PortalLot) => string) => {
      const m = new Map<string, number>()
      for (const l of lots) { const v = f(l); if (v) m.set(v, (m.get(v) ?? 0) + 1) }
      return m
    }
    const grades = count((l) => upper(l.auctionGrade))
    const colors = count((l) => upper(l.color))
    const gearboxes = count((l) => upper(l.transmission))
    return {
      models: Array.from(count(gradeOf)).sort((a, b) => a[0].localeCompare(b[0])),
      years: Array.from(new Set(lots.map((l) => l.year).filter((y): y is number => !!y))).sort((a, b) => b - a),
      auctionGrades: Array.from(grades).sort(([a], [b]) => (a === 'S' ? -1 : b === 'S' ? 1 : Number(b) - Number(a))),
      colors: Array.from(colors).sort((a, b) => a[0].localeCompare(b[0])),
      gearboxes: Array.from(gearboxes).sort((a, b) => a[0].localeCompare(b[0])),
    }
  }, [lots])
  // Every filter but the day, so each day's count says how many of THESE cars it has.
  const undated = useMemo(() => lots.filter((l) => matches(l, { ...filters, day: null })), [lots, filters])
  // Every day from today to the last auction day — a day with no auctions (a
  // Sunday) still shows, with 0, so the week reads as a calendar, not a gap.
  const days = useMemo(() => {
    const count = new Map<string, number>()
    const dated = lots.map((l) => dayKey(l.tradeAt)).filter(Boolean).sort()
    if (dated.length) {
      const last = dated[dated.length - 1]
      for (let key = dayKey(new Date().toISOString()); key <= last; ) {
        count.set(key, 0)
        key = dayKey(new Date(dayDate(key).getTime() + 86_400_000).toISOString())
      }
    }
    for (const l of lots) count.set(dayKey(l.tradeAt), count.get(dayKey(l.tradeAt)) ?? 0)
    for (const l of undated) count.set(dayKey(l.tradeAt), (count.get(dayKey(l.tradeAt)) ?? 0) + 1)
    return Array.from(count, ([key, n]) => ({ key, n })).sort((a, b) => (a.key || '~').localeCompare(b.key || '~'))
  }, [lots, undated])
  const shown = useMemo(() => {
    const list = filters.day == null ? undated : undated.filter((l) => dayKey(l.tradeAt) === filters.day)
    const by: Record<Sort, ((a: PortalLot, b: PortalLot) => number) | null> = {
      soonest: null,
      price: (a, b) => (a.startPrice || Infinity) - (b.startPrice || Infinity),
      year: (a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.regMonth ?? 0) - (a.regMonth ?? 0),
      mileage: (a, b) => (a.mileage ?? Infinity) - (b.mileage ?? Infinity),
    }
    const cmp = by[filters.sort]
    return cmp ? [...list].sort(cmp) : list
  }, [undated, filters.day, filters.sort])
  // By day while sorted by auction time; one list for any other order.
  const groups = useMemo(() => {
    if (filters.sort !== 'soonest') return [{ key: null as string | null, items: shown }]
    const by = new Map<string, PortalLot[]>()
    for (const l of shown) by.set(dayKey(l.tradeAt), [...(by.get(dayKey(l.tradeAt)) ?? []), l])
    return Array.from(by, ([key, items]) => ({ key: key as string | null, items }))
  }, [shown, filters.sort])
  const starredCount = lots.filter((l) => l.watched).length
  const datedDays = days.filter((d) => d.key).length

  const atDefaults = sameFilters({ ...filters, day: null, model: 'all', starred: false, sort: 'soonest' }, defaults)
  const hasDefaults = !sameFilters(defaults, NO_FILTERS)

  if (loading && !data) return <ListSkeleton />

  const name = data?.me.name?.trim()
  const short = (key: string) => {
    const d = dayDate(key)
    return `${dayWord(key) ?? d.toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'short' })} ${d.toLocaleDateString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' })}`
  }
  const dayTitle = (key: string) => {
    if (!key) return 'Date to be confirmed'
    const full = dayDate(key).toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })
    const word = dayWord(key)
    return word ? `${word} · ${full}` : full
  }
  const list = (vals: string[], show: (v: string) => string = (v) => v) =>
    vals.length <= 2 ? vals.map(show).join(', ') : `${vals.slice(0, 2).map(show).join(', ')} +${vals.length - 2}`
  const cap = (c: string) => c.charAt(0) + c.slice(1).toLowerCase()
  const kmShort = (n: number) => `${n / 1000}k km`

  const chips = [
    filters.day != null && { key: 'day', label: `Day: ${filters.day ? short(filters.day) : 'Date TBC'}`, clear: () => set('day', null) },
    filters.model !== 'all' && { key: 'model', label: filters.model, clear: () => set('model', 'all') },
    (filters.yearFrom || filters.yearTo) && {
      key: 'year',
      label: `Year: ${filters.yearFrom && filters.yearTo ? `${filters.yearFrom}–${filters.yearTo}` : filters.yearFrom ? `${filters.yearFrom}+` : `up to ${filters.yearTo}`}`,
      clear: () => setFilters((f) => ({ ...f, yearFrom: null, yearTo: null })),
    },
    filters.auctionGrades.length > 0 && { key: 'grade', label: `Grade: ${list(filters.auctionGrades)}`, clear: () => set('auctionGrades', []) },
    filters.colors.length > 0 && { key: 'colour', label: `Colour: ${list(filters.colors, cap)}`, clear: () => set('colors', []) },
    filters.mileageMax != null && { key: 'km', label: `Up to ${kmShort(filters.mileageMax)}`, clear: () => set('mileageMax', null) },
    filters.gearboxes.length > 0 && { key: 'gear', label: `Gearbox: ${list(filters.gearboxes, cap)}`, clear: () => set('gearboxes', []) },
    filters.starred && { key: 'star', label: 'Starred only', clear: () => set('starred', false) },
    filters.sort !== 'soonest' && { key: 'sort', label: `Sort: ${SORTS.find((s) => s.value === filters.sort)?.label}`, clear: () => set('sort', 'soonest') },
  ].filter((c): c is { key: string; label: string; clear: () => void } => !!c)

  const yearOptions = options.years.map((y) => ({ value: String(y), label: String(y) }))
  // The fields, once — laid out as the desktop panel's grid or the phone sheet's list.
  const fields = (
    <>
      {options.models.length > 1 && (
        <div className="sm:col-span-1">
          <FilterSelect
            label="Model" value={filters.model === 'all' ? '' : filters.model} allLabel="All models"
            onChange={(v) => set('model', v || 'all')}
            options={options.models.map(([m, n]) => ({ value: m, label: m, count: n }))}
          />
        </div>
      )}
      <FilterSelect
        label="Year from" value={filters.yearFrom ? String(filters.yearFrom) : ''} allLabel="Any"
        onChange={(v) => set('yearFrom', v ? Number(v) : null)} options={yearOptions}
      />
      <FilterSelect
        label="Year to" value={filters.yearTo ? String(filters.yearTo) : ''} allLabel="Any"
        onChange={(v) => set('yearTo', v ? Number(v) : null)} options={yearOptions}
      />
      <FilterSelect
        multiple label="Auction grade" value={filters.auctionGrades} allLabel="All grades"
        onChange={(v) => set('auctionGrades', v)}
        options={options.auctionGrades.map(([g, n]) => ({ value: g, label: g, count: n }))}
      />
      <FilterSelect
        multiple label="Colour" value={filters.colors} allLabel="All colours"
        onChange={(v) => set('colors', v)}
        options={options.colors.map(([c, n]) => ({ value: c, label: <ColorLabel c={c} />, count: n }))}
      />
      <FilterSelect
        label="Mileage" value={filters.mileageMax != null ? String(filters.mileageMax) : ''} allLabel="Any"
        onChange={(v) => set('mileageMax', v ? Number(v) : null)}
        options={MILEAGES.map((m) => ({ value: String(m), label: `Up to ${kmShort(m)}` }))}
      />
      {options.gearboxes.length > 1 && (
        <FilterSelect
          multiple label="Gearbox" value={filters.gearboxes} allLabel="Any"
          onChange={(v) => set('gearboxes', v)}
          options={options.gearboxes.map(([g, n]) => ({ value: g, label: cap(g), count: n }))}
        />
      )}
      {starredCount > 0 && (
        <FilterSelect
          label="Show" value={filters.starred ? 'starred' : ''} allLabel="All cars"
          onChange={(v) => set('starred', v === 'starred')}
          options={[{ value: 'starred', label: <><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Starred only</>, count: starredCount }]}
        />
      )}
    </>
  )
  const sortField = (
    <FilterSelect
      required label="Sort by" value={filters.sort}
      onChange={(v) => set('sort', v as Sort)}
      options={SORTS.map((s) => ({ value: s.value, label: s.label }))}
    />
  )
  // Filters in force, not counting the day (the day strip shows that) or the sort.
  const activeCount = chips.filter((c) => c.key !== 'day' && c.key !== 'sort').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
        <div>
          {name && <p className="text-sm font-medium text-slate-500">Welcome back, {name}</p>}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Upcoming auctions</h1>
          {data && lots.length > 0 && (
            <p className="text-sm text-slate-500 mt-1">
              {lots.length} {lots.length === 1 ? 'car' : 'cars'} across {datedDays} auction {datedDays === 1 ? 'day' : 'days'} · Sri Lanka time
            </p>
          )}
        </div>
        <button
          onClick={() => { pollsLeft.current = PHOTO_POLLS; load() }}
          disabled={loading}
          aria-label="Refresh"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 text-sm font-medium disabled:opacity-60 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {error && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {lots.length > 0 && (
        <>
          {/* Phone: one compact bar — Filters (n) · Sort · count. The filters open in a sheet. */}
          <div className="sm:hidden mb-3 space-y-2">
            <div className="flex items-stretch gap-2">
              <button
                onClick={() => setSheet(true)}
                className={`shrink-0 inline-flex items-center gap-2 px-3 h-[2.375rem] rounded-lg border text-sm font-semibold ${
                  activeCount ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeCount > 0 && <span className="min-w-[1.25rem] h-5 px-1 grid place-items-center rounded-full bg-white text-slate-900 text-[11px] font-bold">{activeCount}</span>}
              </button>
              <div className="flex-1 min-w-0">{sortField}</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              {activeCount > 0 ? (
                <button onClick={() => setFilters(NO_FILTERS)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <FilterX className="w-3.5 h-3.5" /> Clear filters
                </button>
              ) : <span />}
              <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">{shown.length}</span> of {lots.length} cars</p>
            </div>
          </div>

          {sheet && (
            <div className="sm:hidden fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Filters">
              <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSheet(false)} />
              <div className="absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col rounded-t-3xl bg-white shadow-2xl animate-slide-up">
                <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-200" />
                    <p className="font-bold text-slate-900">Filters</p>
                  </div>
                  <button onClick={() => setSheet(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close filters">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">{fields}</div>
                <div className="flex gap-2 px-5 py-4 border-t border-slate-100">
                  <button
                    onClick={() => setFilters((f) => ({ ...NO_FILTERS, day: f.day, sort: f.sort }))}
                    className="px-4 h-12 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                  >
                    Clear
                  </button>
                  <button onClick={() => setSheet(false)} className="btn-primary flex-1 h-12">
                    Show {shown.length} {shown.length === 1 ? 'car' : 'cars'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Larger screens: every filter in view as a labelled dropdown; applied at once. */}
          <div className="hidden sm:block rounded-xl border border-slate-200 bg-white shadow-card p-2.5 mb-3">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {fields}
              {sortField}
            </div>

            {/* One bar: the filters in force (× each, Clear all) · back to recommended · the count. */}
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100">
              <div className="flex-1 min-w-0">
                <FilterChips items={chips} onClearAll={() => setFilters(NO_FILTERS)} />
              </div>
              {hasDefaults && !atDefaults && (
                <button
                  onClick={() => setFilters((f) => ({ ...defaults, day: f.day, model: f.model, starred: f.starred, sort: f.sort }))}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  title="The filters we picked for you"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Recommended
                </button>
              )}
              <p className="ml-auto text-sm text-slate-500 whitespace-nowrap">
                <span className="font-bold text-slate-900">{shown.length}</span> of {lots.length} cars
              </p>
            </div>
          </div>

          {/* Auction days. */}
          {days.length > 0 && (
            <div className="mb-5">
              <DayStrip all={undated.length} days={days} value={filters.day} onPick={(k) => set('day', k)} />
            </div>
          )}
        </>
      )}

      {data && !shown.length ? (
        <div className="text-center bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-card">
          <h2 className="font-bold text-slate-900 mb-2">{lots.length ? 'No cars match these filters' : 'No upcoming auctions right now'}</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {lots.length ? 'Try another day, or clear a filter.' : 'New cars are added every day. Check back soon, or ask us to keep an eye out for you.'}
          </p>
          {lots.length ? (
            <button onClick={() => setFilters(NO_FILTERS)} className="btn-primary">Show all cars</button>
          ) : (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Message us
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(({ key, items }) => (
            <section key={key ?? 'all'}>
              {key !== null && (
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {dayTitle(key)}
                  </h2>
                  <span className="text-sm text-slate-500">{items.length} {items.length === 1 ? 'car' : 'cars'}</span>
                  <span className="flex-1 h-px bg-slate-200" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {items.map((l) => <LotCard key={l.id} lot={l} onOpen={() => openCar(l.id)} onStar={() => toggleStar(l)} />)}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  )
}
