type LoaderProps = {
  label?: string;
  /** Full-viewport overlay screen, or an inline block inside a card/section */
  variant?: 'screen' | 'inline';
};

function Orb({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const dim = size === 'lg' ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-12 h-12';
  return (
    <div className={`relative ${dim}`} role="status" aria-label="Loading">
      {/* soft glow */}
      <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-xl animate-loader-pulse" />
      {/* outer conic sweep */}
      <div className="absolute inset-0 rounded-full loader-sweep animate-loader-spin" />
      {/* counter-rotating dashed ring */}
      <div className="absolute inset-[18%] rounded-full border border-dashed border-slate-400/60 animate-loader-spin-reverse" />
      {/* core */}
      <div className="absolute inset-[36%] rounded-full bg-gradient-to-br from-slate-900 to-slate-700 shadow-[0_0_18px_rgba(56,189,248,0.55)]">
        <div className="absolute inset-[30%] rounded-full bg-sky-400 animate-loader-pulse" />
      </div>
    </div>
  );
}

export default function Loader({ label = 'Loading', variant = 'screen' }: LoaderProps) {
  if (variant === 'inline') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 sm:py-14">
        <Orb size="sm" />
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500">{label}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-slate-50 px-6">
      {/* grid + vignette backdrop */}
      <div className="absolute inset-0 bg-grid-pattern [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] max-w-[90vw] max-h-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative flex w-full max-w-xs flex-col items-center gap-6 animate-fade-in">
        <Orb />
        <div className="w-full text-center">
          <p className="font-display text-sm sm:text-base font-semibold tracking-[0.25em] uppercase text-slate-800">
            {label}
          </p>
          <div className="mx-auto mt-4 h-[3px] w-40 sm:w-48 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-sky-500 to-transparent animate-loader-scan" />
          </div>
        </div>
      </div>
    </div>
  );
}
