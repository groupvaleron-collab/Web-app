// Loading placeholders shaped like the page that's coming — the header, the
// filter bar and a grid of cards, or a car's photo and panel — so the page
// doesn't jump when the data lands and the wait reads as "nearly there".

const Bar = ({ className = '' }: { className?: string }) => <div className={`rounded-lg bg-slate-200/80 ${className}`} />

export function ListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-pulse" aria-busy="true" aria-label="Loading auctions">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div className="space-y-2.5">
          <Bar className="h-3.5 w-36" />
          <Bar className="h-8 w-64" />
          <Bar className="h-3.5 w-52" />
        </div>
        <Bar className="h-10 w-10 sm:w-28 rounded-xl" />
      </div>
      {/* Phone: one compact bar. Larger: the filter panel. */}
      <Bar className="sm:hidden h-12 w-full rounded-2xl mb-4" />
      <div className="hidden sm:block rounded-2xl border border-slate-200 bg-white p-4 mb-4">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }, (_, i) => <Bar key={i} className="h-11 rounded-xl" />)}
        </div>
      </div>
      <Bar className="h-14 w-full rounded-2xl mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-[4/3] bg-slate-200/80" />
            <div className="p-4 space-y-3">
              <Bar className="h-4 w-3/4" />
              <Bar className="h-3.5 w-1/2" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <Bar className="h-3.5 w-20" />
                <Bar className="h-5 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CarSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse" aria-busy="true" aria-label="Loading car">
      <div className="flex items-center justify-between mb-5">
        <Bar className="h-4 w-36" />
        <Bar className="h-10 w-10 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-7 min-w-0 space-y-3">
          <div className="aspect-[4/3] rounded-2xl bg-slate-200/80" />
          <div className="flex gap-2">{Array.from({ length: 5 }, (_, i) => <Bar key={i} className="h-14 w-20 shrink-0" />)}</div>
        </div>
        <div className="lg:col-span-5 min-w-0 space-y-4">
          <Bar className="h-6 w-40" />
          <Bar className="h-9 w-3/4" />
          <Bar className="h-4 w-1/2" />
          <Bar className="h-24 w-full rounded-2xl" />
          <Bar className="h-14 w-full rounded-xl" />
          <Bar className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
