import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gift,
  ArrowRight,
  Ticket,
  Clock,
  ChevronRight,
  QrCode,
  Trophy,
  User,
  Users,
  Sparkles,
  ExternalLink,
  Heart,
  Facebook,
  Instagram,
  Youtube,
  X,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { NEXT_DRAW_AT } from '../data/mockData'
import { useCountdown } from '../hooks/useCountdown'

// Festival Pagoda / Temple Umbrella Crest Icon
export function FestivalTempleLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Finial (Stupa/Kalasam) */}
      <circle cx="50" cy="10" r="3.5" fill="#c28e18" />
      <path d="M48 13.5H52L53 19H47L48 13.5Z" fill="#c28e18" />
      <circle cx="50" cy="20.5" r="2.5" fill="#e5aa22" />

      {/* Tier 1 Roof / Parasol */}
      <path
        d="M50 21C42 21 34 26 27 32C33 34.5 41 36 50 36C59 36 67 34.5 73 32C66 26 58 21 50 21Z"
        fill="#720e1e"
      />
      <path
        d="M27 32C33 34.5 41 36 50 36C59 36 67 34.5 73 32L74 34.5C67.5 37 59 38.5 50 38.5C41 38.5 32.5 37 26 34.5L27 32Z"
        fill="#c28e18"
      />

      {/* Spire Pillars */}
      <rect x="43" y="38.5" width="4" height="6.5" rx="1" fill="#720e1e" />
      <rect x="53" y="38.5" width="4" height="6.5" rx="1" fill="#720e1e" />

      {/* Tier 2 Middle Roof */}
      <path
        d="M50 43C39 43 28 48 18 55C26 58 37 60 50 60C63 60 74 58 82 55C72 48 61 43 50 43Z"
        fill="#720e1e"
      />
      <path
        d="M18 55C26 58 37 60 50 60C63 60 74 58 82 55L83.5 58C75 61 63 63 50 63C37 63 25 61 16.5 58L18 55Z"
        fill="#c28e18"
      />

      {/* Tier 3 Base Pedestal */}
      <rect x="34" y="63" width="32" height="6" rx="1.5" fill="#720e1e" />
      <rect x="29" y="69" width="42" height="5" rx="1.5" fill="#c28e18" />
      <rect x="24" y="74" width="52" height="6" rx="2" fill="#720e1e" />
      <rect x="20" y="80" width="60" height="4" rx="2" fill="#e5aa22" />

      {/* Golden Hangings / Bells */}
      <circle cx="21" cy="57" r="2" fill="#c28e18" />
      <circle cx="35" cy="62" r="2" fill="#c28e18" />
      <circle cx="50" cy="63" r="2" fill="#c28e18" />
      <circle cx="65" cy="62" r="2" fill="#c28e18" />
      <circle cx="79" cy="57" r="2" fill="#c28e18" />
    </svg>
  )
}

export function HomePage() {
  const { data, nextDraw, getPrize } = useApp()
  const countdown = useCountdown(NEXT_DRAW_AT)
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined

  const [activeModal, setActiveModal] = useState<'about' | 'contact' | null>(null)

  // 4 Featured Prizes shown in the design
  const featuredPrizes = [
    {
      badge: '1st Prize',
      name: 'Premium Laptop',
      value: '₹58,000',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    },
    {
      badge: '2nd Prize',
      name: 'Smart TV',
      value: '₹42,000',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    },
    {
      badge: '3rd Prize',
      name: 'Special Gold Hamper',
      value: '₹75,000',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    },
    {
      badge: 'Bumper Prize',
      name: 'Gift Voucher',
      value: '₹10,000',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#140d10] font-sans-modern flex flex-col justify-between selection:bg-[#720e1e] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVIGATION BAR
      ─────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-black/8 bg-[#fbf9f5]/95 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <FestivalTempleLogo className="w-10 h-10 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#140d10] leading-none">
                Valanchery <span className="text-[#720e1e]">Festival</span>
              </span>
              <span className="font-cinzel text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.2em] text-[#8e6b1b] uppercase mt-1">
                SHOP • CELEBRATE • WIN TOGETHER
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#3a3235]">
            <Link to="/" className="relative text-[#140d10] font-bold hover:text-[#720e1e] transition py-1">
              Home
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#720e1e] rounded-full" />
            </Link>
            <Link to="/login" className="hover:text-[#720e1e] transition py-1">
              Check Pass
            </Link>
            <Link to="/winners" className="hover:text-[#720e1e] transition py-1">
              Winners
            </Link>
            <button
              onClick={() => setActiveModal('about')}
              className="hover:text-[#720e1e] transition py-1 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => setActiveModal('contact')}
              className="hover:text-[#720e1e] transition py-1 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#6e0e1e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#851327] shadow-sm shadow-[#6e0e1e]/25 active:scale-95"
            >
              <Ticket size={14} />
              <span>Register</span>
            </Link>

            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#140d10] transition hover:bg-white hover:border-black/30 active:scale-95"
            >
              <QrCode size={13} className="text-[#720e1e]" />
              <span>Check Pass</span>
            </Link>

            <Link
              to="/winners"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white/80 px-3 py-2 text-xs font-semibold text-[#140d10] transition hover:bg-white hover:border-black/30 active:scale-95"
            >
              <Trophy size={13} className="text-[#c28e18]" />
              <span>Winners</span>
            </Link>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white hover:border-black/30 active:scale-95"
              title="Admin Portal"
            >
              <User size={13} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f9f6ef] via-[#f7f3ea] to-[#f4eee2] py-8 sm:py-14 border-b border-black/6">
        {/* Left Festival Elephant Background Decoration */}
        <div className="absolute left-0 top-0 bottom-0 w-[240px] sm:w-[380px] lg:w-[480px] pointer-events-none opacity-25 sm:opacity-40 lg:opacity-95 mix-blend-multiply overflow-hidden z-0">
          <img
            src="/festival-elephant.jpg"
            alt="Kerala Festival Elephant"
            className="w-full h-full object-cover object-left-top mask-gradient-right"
            style={{
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            }}
          />
          {/* Handwritten Cursive Text: Nammude Valanchery Nammude Ulsavam */}
          <div className="absolute bottom-8 left-6 sm:left-12 -rotate-6 z-10 hidden sm:block">
            <p className="font-handwritten text-xl sm:text-3xl font-bold text-[#720e1e] leading-snug drop-shadow-sm">
              Nammude Valanchery
              <br />
              Nammude Ulsavam{' '}
              <span className="inline-block text-[#c28e18] text-2xl">♡</span>
            </p>
          </div>
        </div>

        {/* Right Night Fireworks Festival Background Decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-[240px] sm:w-[380px] lg:w-[480px] pointer-events-none opacity-20 sm:opacity-35 lg:opacity-90 mix-blend-multiply overflow-hidden z-0">
          <img
            src="/festival-night.jpg"
            alt="Night Fireworks Festival"
            className="w-full h-full object-cover object-right-top"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 100%)',
            }}
          />
          {/* Handwritten Script over Fireworks on Night Sky */}
          <div className="absolute top-8 right-6 sm:right-12 rotate-3 z-10 text-right hidden sm:block">
            <p className="font-handwritten text-lg sm:text-2xl font-bold text-[#e8c679] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              More Shopping
              <br />
              More Happiness
              <br />
              A Brighter Valanchery
            </p>
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Headlines, CTAs, Highlights */}
            <div className="lg:col-span-7 space-y-5 lg:pr-6">
              {/* Grand Shopping Festival Tag */}
              <div className="inline-flex items-center gap-2 font-cinzel text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#8e6b1b] uppercase">
                <span className="h-px w-6 bg-[#8e6b1b]" />
                GRAND SHOPPING FESTIVAL
                <span className="h-px w-6 bg-[#8e6b1b]" />
              </div>

              {/* Big Editorial Headline */}
              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#140d10] leading-[1.12] tracking-tight">
                Celebrate. Participate.
                <br />
                <span className="text-[#6e0e1e]">Win Grand Prizes.</span>
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4a4244] leading-relaxed max-w-lg font-medium">
                Scan your physical festival coupon QR code or register online to enter the lucky draw draws in Valanchery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6e0e1e] px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#851327] shadow-lg shadow-[#6e0e1e]/25 hover:shadow-xl active:scale-95"
                >
                  <Ticket size={16} />
                  <span>REGISTER COUPON</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-black/20 bg-white/90 px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#140d10] transition hover:bg-white hover:border-black/35 shadow-sm active:scale-95"
                >
                  <QrCode size={15} className="text-[#720e1e]" />
                  <span>CHECK DIGITAL PASS</span>
                </Link>
              </div>

              {/* Highlights Metric Bar */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t border-black/10">
                {/* Metric 1: Registered Count */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c28e18]/15 text-[#8e6b1b]">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-xl font-extrabold text-[#6e0e1e] leading-tight">
                      {data.participants.length}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black/60">
                      Registered
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-black/10" />

                {/* Metric 2: 10 Draws */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#720e1e]/10 text-[#720e1e]">
                    <Gift size={20} />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-xl font-extrabold text-[#140d10] leading-tight">
                      10
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black/60">
                      Draws Festival Season
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-black/10" />

                {/* Metric 3: 100% Free */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[#8e6b1b]">
                    <Sparkles size={19} />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-xl font-extrabold text-emerald-800 leading-tight">
                      100% Free
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black/60">
                      Public Entry
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Next Lucky Draw Floating Card */}
            <div className="lg:col-span-5 lg:pl-4">
              <div className="rounded-3xl border border-black/10 bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-xl shadow-black/8 relative transition hover:shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/6 pb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#8e6b1b]">
                    <Clock size={14} className="text-[#c28e18]" />
                    <span>NEXT LUCKY DRAW</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">15 Sep 2026</span>
                </div>

                {/* Spotlight Prize Box */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-black/6 bg-[#faf7f2] p-3.5 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6e0e1e]/10 text-[#6e0e1e]">
                      <Gift size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/50">Spotlight Prize</p>
                      <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#140d10] leading-snug">
                        {prize?.name ?? 'Gift Voucher'}
                      </h4>
                    </div>
                  </div>
                  <img
                    src="/spotlight-gift.jpg"
                    alt="Spotlight Prize Present"
                    className="h-14 w-14 rounded-xl object-cover border border-amber-200/50 shadow-sm shrink-0"
                  />
                </div>

                {/* Countdown 4 Blocks */}
                <div className="mt-5 grid grid-cols-4 gap-2.5 text-center">
                  {[
                    [countdown.days, 'Days'],
                    [countdown.hours, 'Hours'],
                    [countdown.minutes, 'Mins'],
                    [countdown.seconds, 'Secs'],
                  ].map(([val, label]) => (
                    <div
                      key={String(label)}
                      className="rounded-xl border border-black/8 bg-[#fbf9f5] py-2.5 px-1 shadow-inner transition hover:border-[#c28e18]/40"
                    >
                      <p className="font-serif-luxury text-xl sm:text-2xl font-black text-[#140d10] leading-none">
                        {String(val).padStart(2, '0')}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-black/50 mt-1.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Full Width Maroon CTA Button */}
                <div className="mt-6">
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e0e1e] py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#851327] shadow-md shadow-[#6e0e1e]/25 active:scale-98"
                  >
                    <span>Enter This Draw Now</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED PRIZES SECTION
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 border-b border-black/6 bg-[#fbf9f5]">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8e6b1b] uppercase">
                <span className="h-px w-5 bg-[#8e6b1b]" />
                FEATURED PRIZES
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#140d10] mt-1.5">
                Amazing Prizes Await You!
              </h2>
              <p className="text-xs sm:text-sm text-black/60 mt-1">
                Awarded live across all 10 festival draws
              </p>
            </div>

            <Link
              to="/winners"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6e0e1e] hover:text-[#851327] transition group"
            >
              <span>View Winners</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPrizes.map((p, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-black/10 bg-white p-3.5 transition duration-300 hover:shadow-xl hover:border-[#c28e18]/40 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Prize Badge Overlay on top right */}
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-[#d49b29] px-3 py-1 text-[10px] font-bold text-[#140d10] shadow-md uppercase tracking-wider">
                    {p.badge}
                  </span>
                </div>

                {/* Info Container */}
                <div className="mt-3.5 flex items-center justify-between gap-2 px-1 pb-1">
                  <div>
                    <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-[#140d10] group-hover:text-[#6e0e1e] transition">
                      {p.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-[#8e6b1b] mt-0.5">{p.value}</p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-slate-50 text-[#140d10] transition group-hover:bg-[#6e0e1e] group-hover:text-white group-hover:border-[#6e0e1e]">
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW IT WORKS SECTION
      ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-8 bg-[#f5f0e4] border-b border-black/6">
        {/* Left Decorative Architectural Sketch Note */}
        <div className="absolute left-4 sm:left-12 bottom-4 pointer-events-none opacity-40 lg:opacity-75 hidden sm:block">
          <p className="font-handwritten text-xl sm:text-3xl font-bold text-[#84192b] -rotate-12 leading-tight">
            A Stronger Valanchery
            <br />
            Together
          </p>
        </div>

        {/* Right Decorative Palm Sketch Note */}
        <div className="absolute right-4 sm:right-12 bottom-4 pointer-events-none opacity-40 lg:opacity-75 hidden sm:block">
          <p className="font-handwritten text-xl sm:text-3xl font-bold text-[#84192b] rotate-6 text-right leading-tight">
            Let's Celebrate
            <br />
            Together ♡
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8e6b1b] uppercase">
            <span className="h-px w-6 bg-[#8e6b1b]" />
            HOW IT WORKS
            <span className="h-px w-6 bg-[#8e6b1b]" />
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#140d10] mt-2">
            Join the Festival in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-black/60 mt-1.5">
            It's quick, easy and completely free!
          </p>

          {/* 3 Connected Steps */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/6 shadow-sm transition hover:bg-white hover:shadow-md">
              <div className="relative mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f3e7c8] to-[#fcf8ee] border border-[#c28e18]/40 text-[#8e6b1b] shadow-inner">
                  <Ticket size={28} />
                </div>
                <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#c28e18] text-xs font-black text-white shadow-md">
                  1
                </span>
              </div>
              <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#140d10]">
                Register Coupon
              </h4>
              <p className="text-xs text-black/60 leading-relaxed mt-1.5 max-w-xs">
                Scan your festival coupon QR code or register online.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/6 shadow-sm transition hover:bg-white hover:shadow-md">
              <div className="relative mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f3e7c8] to-[#fcf8ee] border border-[#c28e18]/40 text-[#8e6b1b] shadow-inner">
                  <QrCode size={28} />
                </div>
                <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#c28e18] text-xs font-black text-white shadow-md">
                  2
                </span>
              </div>
              <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#140d10]">
                Get Your Pass
              </h4>
              <p className="text-xs text-black/60 leading-relaxed mt-1.5 max-w-xs">
                Receive your digital lucky draw pass instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/6 shadow-sm transition hover:bg-white hover:shadow-md">
              <div className="relative mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f3e7c8] to-[#fcf8ee] border border-[#c28e18]/40 text-[#8e6b1b] shadow-inner">
                  <Gift size={28} />
                </div>
                <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#c28e18] text-xs font-black text-white shadow-md">
                  3
                </span>
              </div>
              <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-[#140d10]">
                Join the Lucky Draw
              </h4>
              <p className="text-xs text-black/60 leading-relaxed mt-1.5 max-w-xs">
                You're all set! Participate and stand a chance to win amazing prizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. RICH MAROON FOOTER
      ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#520b16] text-white py-10 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <FestivalTempleLogo className="w-10 h-10 brightness-150" />
            <div>
              <span className="font-serif-luxury text-xl font-bold tracking-tight text-white leading-none">
                Valanchery Festival
              </span>
              <p className="font-cinzel text-[8.5px] font-bold tracking-[0.2em] text-[#e8c679] uppercase mt-1">
                SHOP • CELEBRATE • WIN TOGETHER
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 font-medium">
            <Link to="/" className="hover:text-amber-300 transition">
              Home
            </Link>
            <button onClick={() => setActiveModal('about')} className="hover:text-amber-300 transition cursor-pointer">
              About
            </button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-amber-300 transition cursor-pointer">
              Contact
            </button>
            <Link to="/terms" className="hover:text-amber-300 transition">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-amber-300 transition">
              Privacy
            </Link>
          </nav>

          {/* Socials & Motto */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-white/80">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 transition"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center gap-1.5 text-xs text-[#e8c679] font-medium">
              <span>A Brighter Tomorrow, Together</span>
              <span className="text-amber-400">🍃</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50">
          <p>© 2026 Valanchery Festival. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Official Lucky Draw Portal · Valanchery, Kerala</p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          ABOUT & CONTACT MODALS
      ─────────────────────────────────────────────────────────────── */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-black/10">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-black transition"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <FestivalTempleLogo className="w-8 h-8" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#140d10]">
                About Valanchery Festival
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              Valanchery Festival 2026 is the grand community shopping and cultural festival celebrating local businesses,
              families, and togetherness in Valanchery, Malappuram.
              <br /><br />
              Participants receive physical festival coupons upon shopping at participating stores, which can be scanned
              or registered online to participate in 10 scheduled grand lucky draws with exciting prizes!
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#6e0e1e] px-4 py-2 text-xs font-bold text-white hover:bg-[#851327] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-black/10">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-black transition"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <FestivalTempleLogo className="w-8 h-8" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#140d10]">
                Festival Helpdesk & Contact
              </h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#6e0e1e] shrink-0" />
                <span>Festival Office, Main Road, Valanchery, Kerala 676552</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#6e0e1e] shrink-0" />
                <span>+91 97453 07450 / +91 85929 29295</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#6e0e1e] shrink-0" />
                <span>info@valancheryfestival.com</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#6e0e1e] px-4 py-2 text-xs font-bold text-white hover:bg-[#851327] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
