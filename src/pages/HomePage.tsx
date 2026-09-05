import { Link } from 'react-router-dom'
import {
  Gift,
  Sparkles,
  ArrowRight,
  QrCode,
  ShieldCheck,
  Trophy,
  Users,
  Award,
  Clock,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { NEXT_DRAW_AT } from '../data/mockData'
import { useCountdown } from '../hooks/useCountdown'

export function HomePage() {
  const { data, nextDraw, getPrize } = useApp()
  const countdown = useCountdown(NEXT_DRAW_AT)
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined

  return (
    <div className="festival-hero min-h-screen text-white">
      {/* Header Navigation */}
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 px-3 py-3.5 sm:px-6 md:px-8">
        <Link to="/" className="font-display text-sm tracking-wider sm:text-base md:text-lg whitespace-nowrap">
          Valanchery Festival
        </Link>
        <nav className="flex items-center gap-2 text-[10px] font-light tracking-wider sm:gap-4 sm:text-xs md:gap-6 md:text-sm">
          <Link to="/register" className="border border-[#d4a017] bg-[#d4a017] px-2.5 py-1 text-black font-medium transition hover:bg-[#e5b32e] whitespace-nowrap">
            REGISTER
          </Link>
          <Link to="/login" className="text-white/70 transition hover:text-[#f3d48a] whitespace-nowrap">
            CHECK PASS
          </Link>
          <Link to="/winners" className="text-white/70 transition hover:text-[#f3d48a] whitespace-nowrap">
            WINNERS
          </Link>
          <Link
            to="/admin/login"
            className="border border-white/20 px-2 py-0.5 text-[10px] text-white/60 transition hover:border-[#f3d48a] hover:text-[#f3d48a] sm:px-2.5 sm:py-1 sm:text-[11px] whitespace-nowrap"
          >
            ADMIN
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-6 sm:px-6 md:gap-12 md:pb-16 md:pt-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#d4a017]/40 bg-[#d4a017]/10 px-3 py-1 text-[11px] text-[#f3d48a] font-medium tracking-widest uppercase rounded-full mb-3">
            <Sparkles size={13} /> Official Grand Lucky Draw
          </div>
          <h1 className="font-display animate-fade-up text-3xl font-light leading-[1.1] tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">
            VALANCHERY
            <br />
            <span className="font-normal text-[#f3d48a]">FESTIVAL 2026</span>
          </h1>
          <p className="animate-fade-up mt-3 text-base font-light text-white/90 sm:text-lg md:text-xl">
            Celebrate. Participate. Win Big!
          </p>
          <p className="animate-fade-up mt-3 max-w-lg text-xs font-light leading-relaxed text-white/70 sm:text-sm">
            Join the town’s most awaited shopping festival lucky draw. Scan your physical festival coupon QR code or enter your token to participate in 10 bumper prize draws.
          </p>

          <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border border-[#d4a017] bg-[#d4a017] px-6 py-3.5 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e] sm:text-sm shadow-lg shadow-[#d4a017]/20"
            >
              REGISTER COUPON <ArrowRight size={15} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/25 bg-black/30 px-5 py-3.5 text-xs font-light tracking-widest text-white transition hover:border-[#f3d48a] hover:text-[#f3d48a] sm:text-sm"
            >
              CHECK PASS
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-4 text-xs font-light text-white/60">
            <div>
              <p className="font-mono text-sm font-normal text-[#f3d48a]">
                {data.participants.length}
              </p>
              <p className="text-[10px] tracking-wider uppercase">Registered</p>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <p className="font-mono text-sm font-normal text-[#f3d48a]">10 PRIZES</p>
              <p className="text-[10px] tracking-wider uppercase">Live Draws</p>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <p className="font-mono text-sm font-normal text-[#f3d48a]">100% FREE</p>
              <p className="text-[10px] tracking-wider uppercase">Community Entry</p>
            </div>
          </div>
        </div>

        {/* Hero Image Card */}
        <div className="animate-fade-up relative">
          <div className="animate-glow relative border border-[#d4a017]/40 bg-black/40">
            <img
              src="/coupon-template.jpg"
              alt="Valanchery Festival celebration"
              className="h-64 w-full object-cover sm:h-80 md:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0407] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 border border-white/15 bg-black/70 p-4 backdrop-blur-md">
              <p className="flex items-center gap-2 text-xs font-medium tracking-wide sm:text-sm">
                <Sparkles className="text-[#f3d48a]" size={16} /> Official Shopping Festival Coupons
              </p>
              <p className="mt-1 text-[11px] font-light text-white/70 sm:text-xs">
                Next Grand Prize: {prize?.name ?? 'Smartphone'} · Total 10 Grand Draws
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="border border-white/15 bg-black/40 p-5 md:p-8">
          <p className="text-[10px] tracking-[0.35em] text-[#f3d48a] uppercase">NEXT LUCKY DRAW COUNTDOWN</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-display text-xl font-light tracking-wide sm:text-2xl md:text-3xl">15 September 2026</p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-light text-white/80 sm:text-base">
                <Gift className="text-[#f3d48a]" size={18} /> Prize: <span className="font-normal text-[#f3d48a]">{prize?.name ?? 'Smartphone'}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-center sm:gap-3">
              {[
                [countdown.days, 'Days'],
                [countdown.hours, 'Hours'],
                [countdown.minutes, 'Minutes'],
                [countdown.seconds, 'Seconds'],
              ].map(([v, l]) => (
                <div key={String(l)} className="min-w-[56px] border border-white/15 bg-black/60 px-2.5 py-2.5 sm:min-w-[72px] sm:px-3 sm:py-3">
                  <p className="font-display text-lg font-light text-[#f3d48a] sm:text-2xl">{String(v).padStart(2, '0')}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/60 sm:text-[10px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prize Showcase Section */}
      <section className="border-t border-white/10 bg-black/30 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-[11px] font-medium tracking-[0.35em] text-[#f3d48a] uppercase">PRIZES & REWARDS</p>
            <h2 className="font-display mt-2 text-2xl font-light tracking-wide sm:text-3xl md:text-4xl text-white">
              10 Mega Festival Draws
            </h2>
            <p className="mt-2 text-xs font-light text-white/60 sm:text-sm max-w-md mx-auto">
              Every single coupon registered gets entered in all 10 upcoming festival draws throughout the season.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {data.prizes.slice(0, 4).map((p) => (
              <div key={p.id} className="border border-white/10 bg-black/40 p-4 transition hover:border-[#d4a017]/50">
                <img src={p.image} alt={p.name} className="h-28 w-full object-cover rounded" />
                <h4 className="font-display text-sm font-light text-white mt-3">{p.name}</h4>
                <p className="font-mono text-xs text-[#f3d48a]">{p.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border border-[#d4a017] bg-[#d4a017] px-8 py-3 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e]"
            >
              REGISTER YOUR COUPON NOW <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs font-light text-white/40">
        Valanchery Festival 2026 · Official Lucky Draw Committee · Malappuram, Kerala
      </footer>
    </div>
  )
}
