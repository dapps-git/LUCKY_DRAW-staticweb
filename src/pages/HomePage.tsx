import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  Gift,
  QrCode,
  ShoppingBag,
  Sparkles,
  Store,
  Trophy,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Heart,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import bgWebp from '../assets/bg.webp'
import mobileWebp from '../assets/mobile.webp'
import { PublicNavbar } from '../components/PublicNavbar'

// Festival Pagoda / Temple Umbrella Crest Icon
export function FestivalTempleLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="10" r="3.5" fill="#c28e18" />
      <path d="M48 13.5H52L53 19H47L48 13.5Z" fill="#c28e18" />
      <circle cx="50" cy="20.5" r="2.5" fill="#e5aa22" />

      {/* Tier 1 Roof */}
      <path
        d="M50 21C42 21 34 26 27 32C33 34.5 41 36 50 36C59 36 67 34.5 73 32C66 26 58 21 50 21Z"
        fill="#720e1e"
      />
      <path
        d="M27 32C33 34.5 41 36 50 36C59 36 67 34.5 73 32L74 34.5C67.5 37 59 38.5 50 38.5C41 38.5 32.5 37 26 34.5L27 32Z"
        fill="#c28e18"
      />

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

      {/* Tier 3 Pedestal */}
      <rect x="34" y="63" width="32" height="6" rx="1.5" fill="#720e1e" />
      <rect x="29" y="69" width="42" height="5" rx="1.5" fill="#c28e18" />
      <rect x="24" y="74" width="52" height="6" rx="2" fill="#720e1e" />
      <rect x="20" y="80" width="60" height="4" rx="2" fill="#e5aa22" />

      {/* Bells */}
      <circle cx="21" cy="57" r="2" fill="#c28e18" />
      <circle cx="35" cy="62" r="2" fill="#c28e18" />
      <circle cx="50" cy="63" r="2" fill="#c28e18" />
      <circle cx="65" cy="62" r="2" fill="#c28e18" />
      <circle cx="79" cy="57" r="2" fill="#c28e18" />
    </svg>
  )
}

// Shopping Categories
const shoppingCategories = [
  {
    icon: '👗',
    title: 'Fashion & Apparel',
    desc: 'Textile showrooms, bridal boutiques, traditional silks, designer readymades & kidswear.',
    popular: 'Bridal & Daily Wear',
  },
  {
    icon: '💍',
    title: 'Jewellery & Gold',
    desc: 'Renowned gold houses, 916 hallmarks, diamond collections & heritage ornaments.',
    popular: 'Traditional Kerala Sets',
  },
  {
    icon: '📱',
    title: 'Electronics & Mobiles',
    desc: 'Authorized smartphone outlets, laptops, LED televisions & smart home appliances.',
    popular: 'Smartphones & Gadgets',
  },
  {
    icon: '🛒',
    title: 'Supermarkets & Hypermarkets',
    desc: 'Multi-floor shopping marts, fresh farm produce, groceries & everyday household provisions.',
    popular: 'Daily Essentials',
  },
  {
    icon: '👟',
    title: 'Footwear & Bags',
    desc: 'Branded casuals, ethnic sandals, leather shoes, sports gear & travel luggage.',
    popular: 'Comfort & Style',
  },
  {
    icon: '🏠',
    title: 'Home & Lifestyle',
    desc: 'Contemporary furniture, bedroom decor, modular kitchenware & premium furnishings.',
    popular: 'Interior & Living',
  },
  {
    icon: '🍰',
    title: 'Food & Bakery',
    desc: 'Legendary Malabar bakeries, authentic tea corners, confectionery & family restaurants.',
    popular: 'Malabar Delicacies',
  },
  {
    icon: '💄',
    title: 'Beauty & Wellness',
    desc: 'Cosmetics boutiques, personal care products, Ayurvedic wellness & beauty studios.',
    popular: 'Grooming & Glow',
  },
]

// The 5-Step Coupon Journey
const couponJourneySteps = [
  {
    step: '01',
    action: 'SHOP',
    icon: ShoppingBag,
    title: 'Shop at Participating Stores',
    desc: 'Visit any registered store, supermarket, or showroom in Valanchery during the festival season.',
    badge: 'Any Store in Valanchery',
  },
  {
    step: '02',
    action: 'GET YOUR COUPON',
    icon: Tag,
    title: 'Collect Your Physical Coupon',
    desc: 'Receive your sealed official festival lucky draw coupon with a unique serial number and verification code.',
    badge: 'Unique Draw Code',
  },
  {
    step: '03',
    action: 'REGISTER',
    icon: QrCode,
    title: 'Register Online in 30s',
    desc: 'Scan the ticket QR or enter your coupon number and mobile on this portal to confirm your entry.',
    badge: 'Instant SMS Confirmation',
  },
  {
    step: '04',
    action: 'ENTER THE DRAW',
    icon: ShieldCheck,
    title: 'Enrolled in 10 Mega Draws',
    desc: 'Your ticket is verified and automatically enrolled into 10 scheduled bumper draws throughout the festival.',
    badge: '10 Chances to Win',
  },
  {
    step: '05',
    action: 'WIN',
    icon: Trophy,
    title: 'Celebrate Live & Win',
    desc: 'Watch transparent live draw announcements and take home gold coins, vehicles, and luxury home prizes!',
    badge: 'Grand Bumper Prizes',
  },
]

export function HomePage() {
  return (
    <div className="w-full bg-[#f9f5ed] text-[#140d10] font-sans-modern select-none scroll-smooth">
      {/* ─────────────────────────────────────────────────────────────
          FOLD 1: PRISTINE HERO SECTION (100VH / 100DVH FULLSCREEN)
      ─────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between relative overflow-hidden">
        {/* Background Image: Mobile Portrait (<640px) */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:hidden z-0"
          style={{
            backgroundImage: `url(${mobileWebp})`,
          }}
        />
        {/* Background Image: Desktop / Tablet (>=640px) */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[length:100%_100%] hidden sm:block z-0"
          style={{
            backgroundImage: `url(${bgWebp})`,
          }}
        />

        {/* 1. Fixed Brown Festival Navbar */}
        <PublicNavbar active="home" />

        {/* 2. Hero Headline & Button */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-12 flex-1 flex items-center">
          <div className="max-w-[240px] xs:max-w-[280px] sm:max-w-xl py-6 sm:py-16 space-y-3.5 sm:space-y-7">
            {/* Grand Shopping Festival Tag */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 font-cinzel text-[9px] xs:text-[10px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.25em] text-[#8e6b1b] uppercase">
              <span className="h-px w-3 sm:w-8 bg-[#8e6b1b]" />
              GRAND SHOPPING FESTIVAL
              <span className="h-px w-3 sm:w-8 bg-[#8e6b1b]" />
            </div>

            {/* Two-Tone Elegant Headline */}
            <h1 className="font-serif-luxury text-3xl xs:text-4xl sm:text-7xl lg:text-[84px] font-normal tracking-tight leading-[1.08] sm:leading-[1.04]">
              <span className="text-[#0d281e]">Valanchery</span>
              <br />
              <span className="text-[#720e1e]">Festival</span>
            </h1>

            {/* Register Now Button */}
            <div className="pt-1 sm:pt-2">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-[#720e1e] hover:bg-[#891326] px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white transition active:scale-95 cursor-pointer shadow-none"
              >
                <span>Register Now</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Hero Bottom Prompt & Scroll Indicator */}
        <div className="relative z-10 w-full px-5 sm:px-10 py-3 sm:py-4 flex items-center justify-between text-[10px] sm:text-xs text-black/70 sm:text-black/55">
          <p className="font-serif-luxury text-black/80 sm:text-black/65 font-semibold">Official Lucky Draw Portal · Valanchery</p>
          <a
            href="#why-festival"
            className="inline-flex items-center gap-1.5 text-[#720e1e] font-semibold hover:text-[#8e1b2f] transition group"
          >
            <span>Explore Festival</span>
            <ChevronDown size={14} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: 🛍️ WHY VALANCHERY FESTIVAL? (SHOPPING TOWN)
      ─────────────────────────────────────────────────────────────── */}
      <section id="why-festival" className="relative py-16 sm:py-24 px-5 sm:px-12 bg-[#fdfaf3] border-t border-[#c28e18]/20">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#8e6b1b] uppercase">
              <span className="h-px w-6 bg-[#8e6b1b]" />
              VALANCHERY AS A SHOPPING TOWN
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#140d10] font-normal tracking-tight leading-tight">
              Why Valanchery Festival?
            </h2>
            <p className="font-serif-luxury text-lg sm:text-2xl text-[#720e1e] italic leading-snug">
              One Town. Hundreds of Shops. Thousands of Chances to Win.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
              From everyday shopping to special purchases, Valanchery brings local businesses and shoppers together.
              During the festival, shop at participating stores, collect your official festival coupon, and unlock a chance
              to win extraordinary prizes across 10 scheduled mega lucky draws.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              There is already a rich variety of shopping businesses and commercial establishments in Valanchery — including
              sprawling shopping complexes, premier textile & clothing stores, multi-floor supermarkets, jewellery houses,
              and dedicated retailers serving central Malabar.
            </p>
          </div>

          {/* 4 Town Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-12">
            <div className="bg-white p-6 sm:p-7 border border-[#e5d8c3] shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f9f3ea] flex items-center justify-center text-2xl mb-4">
                🏬
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#140d10]">
                Commercial Center
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Hundreds of trusted local retailers, shopping complexes, and trade establishments under one vibrant town network.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-[#e5d8c3] shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f9f3ea] flex items-center justify-center text-2xl mb-4">
                🎟️
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#140d10]">
                Official Draw Coupon
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every qualifying shopping purchase rewards you with an official serialized festival lucky draw coupon.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-[#e5d8c3] shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f9f3ea] flex items-center justify-center text-2xl mb-4">
                🎁
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#140d10]">
                10 Bumper Draws
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Win gold sovereigns, automobiles, smart electronics, and household gifts across 10 transparent draws.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-[#e5d8c3] shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f9f3ea] flex items-center justify-center text-2xl mb-4">
                🤝
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#140d10]">
                Uniting Our Town
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Strengthening local merchants, supporting hometown enterprise, and celebrating the warmth of Valanchery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: 🎟️ THE VISUAL IDENTITY: THE COUPON JOURNEY
      ─────────────────────────────────────────────────────────────── */}
      <section id="coupon-journey" className="relative py-16 sm:py-24 px-5 sm:px-12 bg-[#200d08] text-white overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#c28e18]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-0 w-96 h-96 bg-[#720e1e]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#e5aa22] uppercase">
              <span className="h-px w-6 bg-[#e5aa22]" />
              THE HEART OF THE FESTIVAL
              <span className="h-px w-6 bg-[#e5aa22]" />
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal tracking-tight text-white">
              Shopping Bag → Coupon → Lucky Draw → Prize
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto pt-1 leading-relaxed">
              The festival coupon is the true visual and emotional identity of Valanchery Festival.
              Here is how your everyday local shopping effortlessly turns into bumper celebration rewards.
            </p>
          </div>

          {/* 5-Step Visual Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5 mt-12 sm:mt-16 relative">
            {couponJourneySteps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="relative bg-white/5 border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:bg-white/10 transition group"
                >
                  {/* Top: Step number & Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-cinzel text-xs font-bold tracking-widest text-[#e5aa22]">
                        STEP {step.step}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#e5aa22]/15 text-[#e5aa22] flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                    </div>

                    <span className="inline-block font-cinzel text-[10px] font-bold tracking-wider text-[#e5aa22] uppercase mb-1">
                      {step.action}
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/65 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom: Badge */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-medium text-[#e5aa22]/90 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-[#e5aa22]" />
                      {step.badge}
                    </span>
                  </div>

                  {/* Arrow for Desktop between cards */}
                  {idx < couponJourneySteps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#e5aa22] pointer-events-none">
                      →
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Coupon Anatomy Showcase Mockup */}
          <div className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-[#2c140c] via-[#3a1b10] to-[#2c140c] border border-[#c28e18]/40 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Ticket Graphic representation */}
              <div className="w-full sm:w-1/2 bg-[#fcf9f2] text-[#1c0c07] p-5 border-2 border-dashed border-[#c28e18] shadow-inner relative">
                <div className="flex items-center justify-between border-b border-[#c28e18]/30 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <FestivalTempleLogo className="w-6 h-6" />
                    <div>
                      <span className="font-serif-luxury text-xs font-bold block leading-none text-[#720e1e]">
                        VALANCHERY FESTIVAL
                      </span>
                      <span className="text-[8px] font-cinzel text-slate-500 tracking-wider uppercase">
                        Official Lucky Draw Pass
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold font-mono text-[#c28e18] bg-[#f2e6cf] px-2 py-0.5">
                    2026
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-600 text-[10px]">Coupon Serial Number:</p>
                  <p className="font-mono text-base font-bold tracking-widest text-[#720e1e]">
                    VAL-2026-98421
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[9px] text-slate-500">
                    <span>Valid for all 10 Draws</span>
                    <span className="text-emerald-700 font-semibold">● Verified Seal</span>
                  </div>
                </div>
              </div>

              {/* Description & Action */}
              <div className="w-full sm:w-1/2 space-y-3 text-left">
                <span className="font-cinzel text-[10px] font-bold tracking-wider text-[#e5aa22] uppercase">
                  HOW TO CHECK YOUR PASS
                </span>
                <h4 className="font-serif-luxury text-xl font-bold text-white leading-tight">
                  Have a Coupon in Hand?
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Enter your physical coupon number and phone number online to confirm registration, view scheduled draws,
                  and verify your draw eligibility.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 bg-[#d49b29] hover:bg-[#e5aa22] text-[#1c0c07] px-4 py-2 text-xs font-bold transition active:scale-95"
                  >
                    <span>Register Coupon</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: 🏪 SHOP VALANCHERY (SHOP LOCAL DIRECTORY)
      ─────────────────────────────────────────────────────────────── */}
      <section id="shop-local" className="relative py-16 sm:py-24 px-5 sm:px-12 bg-[#f8f4ec]">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#8e6b1b] uppercase">
              <span className="h-px w-6 bg-[#8e6b1b]" />
              SHOP LOCAL • SUPPORT LOCAL
              <span className="h-px w-6 bg-[#8e6b1b]" />
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#140d10] font-normal tracking-tight">
              Shop Valanchery
            </h2>
            <p className="font-serif-luxury text-lg sm:text-2xl text-[#8e6b1b] italic">
              Your favourite stores. Your hometown. Your chance to win.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto pt-1 leading-relaxed">
              Every shopping visit to Valanchery's local merchants fuels our town economy and earns you entries
              into the grand lucky draw. Explore participating shopping categories below.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
            {shoppingCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white p-6 border border-[#e4d7c0] hover:border-[#c28e18] shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#140d10] group-hover:text-[#720e1e] transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#8e6b1b]">
                    {cat.popular}
                  </span>
                  <span className="text-slate-400 group-hover:text-[#720e1e] transition font-bold">
                    Participating →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Local Merchant Callout Banner */}
          <div className="mt-12 bg-[#2a130c] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#c28e18]/30">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-cinzel text-[10px] text-[#e5aa22] tracking-widest uppercase font-bold">
                MERCHANTS OF VALANCHERY
              </span>
              <h4 className="font-serif-luxury text-xl sm:text-2xl font-normal text-white">
                Are you a store or commercial establishment in Valanchery?
              </h4>
              <p className="text-xs text-white/70">
                Join the official festival merchants network and distribute coupons to your valuable shoppers.
              </p>
            </div>
            <Link
              to="/admin/login"
              className="shrink-0 bg-[#d49b29] hover:bg-[#e5aa22] text-[#1c0c07] px-5 py-2.5 text-xs font-bold transition active:scale-95 whitespace-nowrap"
            >
              Merchant & Admin Desk
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: 🏘️ "OUR VALANCHERY" (EMOTIONAL IDENTITY & PRIDE)
      ─────────────────────────────────────────────────────────────── */}
      <section id="our-valanchery" className="relative py-16 sm:py-24 px-5 sm:px-12 bg-gradient-to-b from-[#2a130c] via-[#1f0d07] to-[#140603] text-white">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#e5aa22] uppercase">
            <span className="h-px w-6 bg-[#e5aa22]" />
            OUR VALANCHERY
            <span className="h-px w-6 bg-[#e5aa22]" />
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-white tracking-tight leading-tight">
            More Than Shopping. It's Our Valanchery.
          </h2>

          <p className="text-sm sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
            Valanchery has long been a meeting point for trade, people, and everyday life in central Malabar.
            Its commercial character and local market culture make shopping here an integral part of the town’s identity.
          </p>

          {/* Simple Emotional Crest */}
          <div className="pt-4 pb-2">
            <div className="inline-block border-y border-[#c28e18]/40 py-3 px-8 sm:px-12">
              <p className="font-serif-luxury text-xl sm:text-3xl text-[#f3d690] italic tracking-wide">
                “Local shops. Local people. Local happiness.”
              </p>
            </div>
          </div>

          {/* Final Call to Action Box */}
          <div className="pt-6 max-w-lg mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 sm:p-7 backdrop-blur-sm space-y-4">
              <h4 className="font-serif-luxury text-lg font-bold text-white">
                Ready to Enter the Draw?
              </h4>
              <p className="text-xs text-white/70">
                Register your coupon code with your phone number to secure your chances in upcoming draws.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#720e1e] hover:bg-[#891326] px-8 py-3 text-xs sm:text-sm font-semibold text-white transition active:scale-95 shadow-lg shadow-[#720e1e]/30"
                >
                  <span>Register Your Pass</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: RICH COMPREHENSIVE FOOTER
      ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#140603] text-white/80 border-t border-white/10 pt-12 pb-8 px-5 sm:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
            {/* Col 1: Brand & Crest */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <FestivalTempleLogo className="w-8 h-8 brightness-125" />
                <div>
                  <span className="font-serif-luxury text-base font-bold text-white block leading-tight">
                    Valanchery Festival
                  </span>
                  <span className="font-cinzel text-[8px] tracking-widest text-[#e5aa22] uppercase">
                    2026 Celebration
                  </span>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed text-[11px]">
                The grand shopping and cultural festival celebrating local businesses, shoppers, and community togetherness in Valanchery.
              </p>
              <p className="text-[#e5aa22] font-cinzel text-[9px] tracking-wider uppercase font-semibold">
                Shop Local • Support Local
              </p>
            </div>

            {/* Col 2: Festival Highlights */}
            <div className="space-y-2.5">
              <h5 className="font-cinzel text-[11px] font-bold text-[#e5aa22] tracking-wider uppercase">
                Festival Highlights
              </h5>
              <ul className="space-y-1.5 text-white/70">
                <li>
                  <a href="#why-festival" className="hover:text-white transition">
                    Why Valanchery Festival
                  </a>
                </li>
                <li>
                  <a href="#coupon-journey" className="hover:text-white transition">
                    How The Coupon Works
                  </a>
                </li>
                <li>
                  <a href="#shop-local" className="hover:text-white transition">
                    Participating Stores
                  </a>
                </li>
                <li>
                  <a href="#our-valanchery" className="hover:text-white transition">
                    Our Town Heritage
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Portals */}
            <div className="space-y-2.5">
              <h5 className="font-cinzel text-[11px] font-bold text-[#e5aa22] tracking-wider uppercase">
                Lucky Draw Portals
              </h5>
              <ul className="space-y-1.5 text-white/70">
                <li>
                  <Link to="/register" className="hover:text-white transition">
                    Register New Coupon
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-white transition">
                    Merchant & Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Town Helpdesk */}
            <div className="space-y-2.5">
              <h5 className="font-cinzel text-[11px] font-bold text-[#e5aa22] tracking-wider uppercase">
                Festival Helpdesk
              </h5>
              <div className="space-y-2 text-[11px] text-white/65">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#e5aa22] shrink-0 mt-0.5" />
                  <span>Main Road, Valanchery, Malappuram, Kerala 676552</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#e5aa22] shrink-0" />
                  <span>+91 97453 07450 / +91 85929 29295</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#e5aa22] shrink-0" />
                  <span>info@valancheryfestival.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-white/50 gap-2">
            <p>© 2026 Valanchery Festival Merchants Committee. All rights reserved.</p>
            <p className="font-serif-luxury text-white/70">Official Lucky Draw Portal · Valanchery, Malappuram</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

