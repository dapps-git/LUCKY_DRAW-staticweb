import { Link } from 'react-router-dom'
import {
  Gift,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Ticket,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { NEXT_DRAW_AT } from '../data/mockData'
import { useCountdown } from '../hooks/useCountdown'

export function HomePage() {
  const { data, nextDraw, getPrize } = useApp()
  const countdown = useCountdown(NEXT_DRAW_AT)
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-900 font-sans flex flex-col justify-between select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 font-display text-base sm:text-lg font-bold tracking-tight text-[#7a1426]">
            Valanchery <span className="text-[#c28e18]">Festival</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-5 text-xs font-semibold">
            <Link
              to="/register"
              className="rounded-lg bg-[#7a1426] px-3 py-1.5 text-white transition hover:bg-[#961a30] shadow-sm shadow-[#7a1426]/20"
            >
              Register
            </Link>
            <Link to="/login" className="text-slate-700 hover:text-[#7a1426] transition">
              Check Pass
            </Link>
            <Link to="/winners" className="text-slate-700 hover:text-[#7a1426] transition">
              Winners
            </Link>
            <Link
              to="/admin/login"
              className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-600 hover:border-slate-400 transition"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Festival Introduction & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c28e18]/30 bg-[#fdfaf2] px-3 py-1 text-[11px] font-bold text-[#c28e18] uppercase tracking-wider">
              <Sparkles size={12} /> Grand Shopping Festival
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Celebrate. Participate. <span className="text-[#7a1426]">Win Grand Prizes.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
              Scan your physical festival coupon QR code or register online to enter the lucky draw draws in Valanchery.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#7a1426] px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-[#961a30] shadow-md shadow-[#7a1426]/25"
              >
                <Ticket size={15} /> REGISTER COUPON <ArrowRight size={14} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                CHECK DIGITAL PASS
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-5 pt-4 border-t border-slate-200 text-xs">
              <div>
                <p className="font-mono text-base font-bold text-[#7a1426]">{data.participants.length}</p>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Registered</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <p className="font-mono text-base font-bold text-[#c28e18]">10 Draws</p>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Festival Season</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <p className="font-mono text-base font-bold text-emerald-700">100% Free</p>
                <p className="text-[10px] uppercase font-semibold text-slate-500">Public Entry</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Draw Countdown Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-[#c28e18] uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> NEXT LUCKY DRAW
                </span>
                <span className="text-[11px] font-semibold text-slate-500">15 Sep 2026</span>
              </div>

              {/* Next Prize Spotlight */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fdfbf7] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#7a1426]/10 text-[#7a1426]">
                  <Gift size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Spotlight Prize</p>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {prize?.name ?? 'Flagship Smartphone'}
                  </p>
                </div>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 text-center mt-4">
                {[
                  [countdown.days, 'Days'],
                  [countdown.hours, 'Hours'],
                  [countdown.minutes, 'Mins'],
                  [countdown.seconds, 'Secs'],
                ].map(([v, l]) => (
                  <div key={String(l)} className="rounded-xl border border-slate-200 bg-slate-50 py-2">
                    <p className="font-mono text-lg font-bold text-[#7a1426]">{String(v).padStart(2, '0')}</p>
                    <p className="text-[9px] uppercase font-semibold text-slate-500">{l}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <Link
                  to="/register"
                  className="text-xs font-bold text-[#7a1426] hover:underline flex items-center justify-center gap-1"
                >
                  Enter This Draw Now <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Prizes Preview */}
        <section className="mt-10 sm:mt-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">Featured Prizes</h2>
              <p className="text-xs text-slate-500">Awarded live across all 10 festival draws</p>
            </div>
            <Link to="/winners" className="text-xs font-semibold text-[#7a1426] hover:underline">
              View Winners →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {data.prizes.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="group rounded-xl border border-black/10 bg-white p-3 transition hover:shadow-md hover:border-[#c28e18]/40"
              >
                <div className="overflow-hidden rounded-lg bg-slate-100 h-24 sm:h-28">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900 mt-2 truncate">{p.name}</h4>
                <p className="font-mono text-[11px] font-bold text-[#c28e18] mt-0.5">{p.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="shrink-0 border-t border-slate-200 bg-white py-3 px-4 text-center text-xs text-slate-500">
        Valanchery Festival 2026 · Lucky Draw Portal
      </footer>
    </div>
  )
}
