import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  Gift,
  Store,
  Trophy,
  Users,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import bgWebp from '../assets/bg.webp'
import mobileWebp from '../assets/mobile.webp'
import couponBannerImg from '../assets/festival-coupon-banner.png'
import { PublicNavbar } from '../components/PublicNavbar'
import { HomeRegisterSection } from '../components/HomeRegisterSection'

// Festival Pagoda / Temple Umbrella Crest Icon
export function FestivalTempleLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="10" r="3.5" fill="#c28e18" />
      <path d="M50 14V22" stroke="#c28e18" strokeWidth="2.5" strokeLinecap="round" />

      {/* Tier 1 Dome */}
      <path
        d="M26 34C26 34 36 22 50 22C64 22 74 34 74 34C68 31 58 30 50 30C42 30 32 31 26 34Z"
        fill="#720e1e"
      />
      <path
        d="M22 36C22 36 34 32 50 32C66 32 78 36 78 36C70 34 60 33 50 33C40 33 30 34 22 36Z"
        fill="#e5aa22"
      />

      {/* Tier 2 Mid Roof */}
      <path
        d="M18 48C18 48 30 36 50 36C70 36 82 48 82 48C74 45 62 44 50 44C38 44 26 45 18 48Z"
        fill="#720e1e"
      />
      <path
        d="M14 51C14 51 28 46 50 46C72 46 86 51 86 51C76 49 64 48 50 48C36 48 24 49 14 51Z"
        fill="#c28e18"
      />

      {/* Tier 3 Main Broad Roof */}
      <path
        d="M10 63C10 63 26 51 50 51C74 51 90 63 90 63C80 60 66 59 50 59C34 59 20 60 10 63Z"
        fill="#720e1e"
      />
      <path
        d="M6 66C6 66 24 61 50 61C76 61 94 66 94 66C82 64 68 63 50 63C32 63 18 64 6 66Z"
        fill="#e5aa22"
      />

      {/* Tier 3 Pedestal */}
      <rect x="34" y="63" width="32" height="6" rx="1.5" fill="#720e1e" />
      <rect x="29" y="69" width="42" height="5" rx="1.5" fill="#c28e18" />
    </svg>
  )
}

// Shopping Categories with Store Counts
const shoppingCategories = [
  {
    count: '85+ Showrooms',
    title: 'Fashion & Apparel',
    desc: 'Textile showrooms, bridal boutiques, traditional silks, designer readymades & kidswear.',
    popular: 'Bridal & Daily Wear',
  },
  {
    count: '40+ Jewellers',
    title: 'Jewellery & Gold',
    desc: 'Renowned gold houses, 916 hallmarks, diamond collections & heritage ornaments.',
    popular: 'Traditional Kerala Sets',
  },
  {
    count: '60+ Outlets',
    title: 'Electronics & Mobiles',
    desc: 'Authorized smartphone outlets, laptops, LED televisions & smart home appliances.',
    popular: 'Smartphones & Gadgets',
  },
  {
    count: '35+ Marts',
    title: 'Supermarkets & Marts',
    desc: 'Multi-floor shopping marts, fresh farm produce, groceries & everyday household provisions.',
    popular: 'Daily Essentials',
  },
  {
    count: '45+ Outlets',
    title: 'Footwear & Bags',
    desc: 'Branded casuals, ethnic sandals, leather shoes, sports gear & travel luggage.',
    popular: 'Comfort & Style',
  },
  {
    count: '30+ Studios',
    title: 'Home & Lifestyle',
    desc: 'Contemporary furniture, bedroom decor, modular kitchenware & premium furnishings.',
    popular: 'Interior & Living',
  },
  {
    count: '50+ Eateries',
    title: 'Food & Bakery',
    desc: 'Legendary Malabar bakeries, authentic tea corners, confectionery & family restaurants.',
    popular: 'Malabar Delicacies',
  },
  {
    count: '25+ Salons',
    title: 'Beauty & Wellness',
    desc: 'Cosmetics boutiques, personal care products, Ayurvedic wellness & beauty studios.',
    popular: 'Grooming & Glow',
  },
]

export function HomePage() {
  return (
    <div className="w-full bg-[#faf7f0] text-[#140d10] font-sans select-none scroll-smooth">
      {/* ─────────────────────────────────────────────────────────────
          FOLD 1: PRISTINE HERO SECTION (LAPTOP / DESKTOP VIEW)
      ─────────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen lg:h-[100dvh] lg:min-h-[720px] lg:max-h-[960px] flex flex-col justify-between overflow-hidden">
        {/* Background Image: Mobile Portrait (<640px) */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:hidden z-0"
          style={{
            backgroundImage: `url(${mobileWebp})`,
          }}
        />
        {/* Background Image: Desktop / Tablet (>=640px) */}
        <div
          className="absolute inset-0 bg-cover bg-center hidden sm:block z-0"
          style={{
            backgroundImage: `url(${bgWebp})`,
          }}
        />

        {/* 1. Fixed Brown Festival Navbar */}
        <PublicNavbar active="home" />

        {/* 2. Hero Body: Title & Action (Left) + Glowing Banner Display (Center/Bottom) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-14 sm:pt-16 lg:pt-18 flex-1 flex flex-col justify-start gap-2 sm:gap-3">
          {/* Title & CTA: Positioned cleanly below top tree leaves on mobile */}
          <div className="max-w-xl space-y-1.5 sm:space-y-2.5 pt-[115px] xs:pt-[135px] sm:pt-4 lg:pt-6">
            {/* Grand Shopping Festival Tag */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#3e342f] uppercase">
              <span className="h-px w-5 sm:w-8 bg-[#5c4e46]" />
              VALANCHERY FESTIVAL 2026
              <span className="h-px w-5 sm:w-8 bg-[#5c4e46]" />
            </div>

            {/* Two-Tone Serif Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[66px] font-bold tracking-tight leading-[0.98]">
              <span className="text-[#0d3830]">Valanchery</span>
              <br />
              <span className="text-[#720e1e]">Festival 2026</span>
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-[#2b2420] font-medium tracking-wide pt-0.5">
              Shop Local &nbsp;·&nbsp; Support Local &nbsp;·&nbsp; Win Together
            </p>

            {/* Register Now Button */}
            <div className="pt-1 sm:pt-2">
              <a
                href="#register"
                className="group inline-flex items-center gap-2.5 bg-[#720e1e] hover:bg-[#881326] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white rounded-lg transition active:scale-95 cursor-pointer shadow-lg shadow-[#720e1e]/25"
              >
                <span>REGISTER NOW</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Center/Lower Coupon Banner with Rainbow Glow Border - Vertically Stretched */}
          <div className="w-full max-w-[620px] sm:max-w-[760px] lg:max-w-[860px] mx-auto my-1 sm:my-2">
            <div className="p-[2.5px] sm:p-[3px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00d2ff] via-[#ea00d9] via-[#fa709a] via-[#fee140] to-[#38ef7d] shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <div className="rounded-[9.5px] sm:rounded-[13px] overflow-hidden leading-none bg-white">
                <img
                  src={couponBannerImg}
                  alt="Kerala Vyapari Vyavasayi Ekopana Samithi - Valanchery Shopping Festival Season 2 Official Coupon"
                  className="w-full h-[180px] xs:h-[205px] sm:h-[260px] md:h-[295px] lg:h-[315px] object-fill block"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom 4-Feature Bar (Resting on Pedestal Steps) - Sleek & Compact */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-2 sm:pb-4">
          <div className="bg-[#f8f5ee]/95 backdrop-blur-md border border-[#e2d5bf] rounded-lg shadow-sm px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-3">
            {/* Feature 1 */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center sm:justify-start">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#720e1e] shrink-0 stroke-[1.5]" />
              <div className="text-left leading-none space-y-0.5">
                <div className="text-[9px] sm:text-[10px] font-bold text-[#1f1510]">Exclusive</div>
                <div className="text-[8px] sm:text-[8.5px] font-medium text-[#5c4a3f]">Offers</div>
              </div>
            </div>

            <div className="h-4 w-px bg-[#ded3be] shrink-0 hidden xs:block" />

            {/* Feature 2 */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center sm:justify-start">
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#720e1e] shrink-0 stroke-[1.5]" />
              <div className="text-left leading-none space-y-0.5">
                <div className="text-[9px] sm:text-[10px] font-bold text-[#1f1510]">Support</div>
                <div className="text-[8px] sm:text-[8.5px] font-medium text-[#5c4a3f]">Local Business</div>
              </div>
            </div>

            <div className="h-4 w-px bg-[#ded3be] shrink-0 hidden xs:block" />

            {/* Feature 3 */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center sm:justify-start">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#720e1e] shrink-0 stroke-[1.5]" />
              <div className="text-left leading-none space-y-0.5">
                <div className="text-[9px] sm:text-[10px] font-bold text-[#1f1510]">Win</div>
                <div className="text-[8px] sm:text-[8.5px] font-medium text-[#5c4a3f]">Exciting Prizes</div>
              </div>
            </div>

            <div className="h-4 w-px bg-[#ded3be] shrink-0 hidden xs:block" />

            {/* Feature 4 */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center sm:justify-start">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#720e1e] shrink-0 stroke-[1.5]" />
              <div className="text-left leading-none space-y-0.5">
                <div className="text-[9px] sm:text-[10px] font-bold text-[#1f1510]">A Stronger</div>
                <div className="text-[8px] sm:text-[8.5px] font-medium text-[#5c4a3f]">Valanchery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: 📝 LIVE REGISTRATION FORM (DIRECTLY ON HOME PAGE)
      ─────────────────────────────────────────────────────────────── */}
      <HomeRegisterSection />


      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: 🛍️ WHY VALANCHERY FESTIVAL? (UNBOXED CLEAN LAYOUT)
      ─────────────────────────────────────────────────────────────── */}
      <section
        id="why-festival"
        className="scroll-mt-16 sm:scroll-mt-20 relative py-16 sm:py-24 px-5 sm:px-12 bg-[#faf7f0] border-t border-[#e8decb]"
      >
        <div className="mx-auto max-w-7xl">
          {/* Centered Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8e6b1b] uppercase">
              <span className="h-px w-6 sm:w-12 bg-[#8e6b1b]" />
              VALANCHERY AS A SHOPPING TOWN
              <span className="h-px w-6 sm:w-12 bg-[#8e6b1b]" />
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl text-[#140d10] font-bold tracking-tight leading-tight">
              Why Valanchery Festival?
            </h2>

            <p className="text-base sm:text-xl text-[#720e1e] font-medium leading-snug">
              One Town. Hundreds of Shops. Thousands of Chances to Win.
            </p>
          </div>

          {/* 4 Town Highlights - Unboxed Clean Editorial Presentation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mt-12 sm:mt-16">
            {/* Highlight 1: Commercial Center */}
            <div className="flex flex-col items-start space-y-3 group">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#8e6b1b] uppercase bg-[#f5ede0] px-2.5 py-1">
                  500+ STORES
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#140d10] group-hover:text-[#720e1e] transition">
                Commercial Center
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Hundreds of trusted local retailers, shopping complexes, and trade establishments under one vibrant town network.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#8e6b1b] flex items-center gap-1">
                <span>Central Malabar Hub</span>
                <span>→</span>
              </div>
            </div>

            {/* Highlight 2: Official Draw Coupon */}
            <div className="flex flex-col items-start space-y-3 group">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#720e1e] uppercase bg-[#fbece7] px-2.5 py-1">
                  OFFICIAL PASS
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#140d10] group-hover:text-[#720e1e] transition">
                Official Draw Coupon
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Every qualifying shopping purchase rewards you with an official serialized festival lucky draw coupon.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#720e1e] flex items-center gap-1">
                <span>Tamper-Proof Code</span>
                <span>→</span>
              </div>
            </div>

            {/* Highlight 3: 10 Bumper Draws */}
            <div className="flex flex-col items-start space-y-3 group">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#9b6e14] uppercase bg-[#f9f1de] px-2.5 py-1">
                  10 DRAWS
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#140d10] group-hover:text-[#720e1e] transition">
                10 Bumper Draws
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Win gold sovereigns, automobiles, smart electronics, and household gifts across 10 transparent scheduled draws.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#9b6e14] flex items-center gap-1">
                <span>Transparent Draws</span>
                <span>→</span>
              </div>
            </div>

            {/* Highlight 4: Uniting Our Town */}
            <div className="flex flex-col items-start space-y-3 group">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#1b6b33] uppercase bg-[#edf6ee] px-2.5 py-1">
                  COMMUNITY
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#140d10] group-hover:text-[#720e1e] transition">
                Uniting Our Town
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Strengthening local merchants, supporting hometown enterprise, and celebrating the warmth of Valanchery.
              </p>
              <div className="pt-1 text-[11px] font-semibold text-[#1b6b33] flex items-center gap-1">
                <span>Shop Local · Support</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: 🏪 SHOP VALANCHERY (CLEAN UNBOXED SHOPPING TILES)
      ─────────────────────────────────────────────────────────────── */}
      <section
        id="shop-local"
        className="scroll-mt-16 sm:scroll-mt-20 relative py-16 sm:py-24 px-5 sm:px-12 bg-[#f6f2e9] border-t border-[#e8decb]"
      >
        <div className="mx-auto max-w-7xl">
          {/* Centered Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8e6b1b] uppercase">
              <span className="h-px w-6 sm:w-12 bg-[#8e6b1b]" />
              SHOP LOCAL • SUPPORT LOCAL
              <span className="h-px w-6 sm:w-12 bg-[#8e6b1b]" />
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl text-[#140d10] font-bold tracking-tight leading-tight">
              Shop Valanchery
            </h2>

            <p className="text-base sm:text-xl text-[#8e6b1b] font-medium leading-snug">
              Your favourite stores. Your hometown. Your chance to win.
            </p>
          </div>

          {/* Categories Grid (8 Unboxed Clean Items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 mt-12 sm:mt-16">
            {shoppingCategories.map((cat) => {
              return (
                <div
                  key={cat.title}
                  className="flex flex-col justify-between space-y-3 group p-1"
                >
                  <div>
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-[#8e6b1b] bg-[#ece4d4] px-2.5 py-1 uppercase tracking-wider">
                        {cat.count}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#140d10] group-hover:text-[#720e1e] transition leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-[#8e6b1b]">
                    <span>{cat.popular}</span>
                    <span className="text-slate-400 group-hover:text-[#720e1e] transition">→</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Local Merchant Callout Banner (Clean, Light) */}
          <div className="mt-14 max-w-4xl mx-auto bg-[#ede4d3] text-[#140d10] p-6 sm:p-8 border border-[#d8cbb4]">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-[#8e6b1b] tracking-wider uppercase font-bold">
                MERCHANTS OF VALANCHERY
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#140d10]">
                Are you a store or commercial establishment in Valanchery?
              </h3>
              <p className="text-xs text-slate-600 max-w-xl">
                Join the official festival merchants network and distribute lucky draw coupons to your valuable shoppers. Contact festival committee for merchant registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: 🏘️ "OUR VALANCHERY" (LIGHT THEME & UNBOXED)
      ─────────────────────────────────────────────────────────────── */}
      <section
        id="our-valanchery"
        className="scroll-mt-16 sm:scroll-mt-20 relative py-20 sm:py-28 px-5 sm:px-12 bg-[#faf7f0] border-t border-[#e8decb] text-[#140d10]"
      >
        <div className="mx-auto max-w-3xl text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8e6b1b] uppercase">
            <span className="h-px w-6 sm:w-12 bg-[#8e6b1b]" />
            OUR VALANCHERY
            <span className="h-px w-6 sm:w-12 bg-[#8e6b1b]" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#140d10] tracking-tight leading-tight">
            More Than Shopping. It's Our Valanchery.
          </h2>

          {/* Unboxed Heritage Motto */}
          <div className="py-2 space-y-2">
            <p className="text-xl sm:text-3xl font-semibold text-[#720e1e] tracking-wide">
              “Local shops. Local people. Local happiness.”
            </p>
            <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#8e6b1b] uppercase">
              The Heart of Valanchery Shopping Festival
            </p>
          </div>

          {/* Clean Unboxed Call to Action */}
          <div className="pt-6 max-w-md mx-auto space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#140d10]">
              Ready to Enter the Draw?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Register your coupon code with your phone number to secure your chances in 10 upcoming mega lucky draws.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#720e1e] hover:bg-[#891326] px-8 py-3 text-xs sm:text-sm font-semibold text-white transition active:scale-95 shadow-md shadow-[#720e1e]/20"
              >
                <span>Register Your Pass</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: LIGHT THEME COMPREHENSIVE FOOTER
      ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#f2ece0] text-[#3d2b20] border-t border-[#ded3be] pt-14 pb-10 px-5 sm:px-12 font-sans">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#ded3be] text-xs">
            {/* Col 1: Brand & Crest */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <FestivalTempleLogo className="w-8 h-8" />
                <div>
                  <span className="text-base font-bold text-[#140d10] block leading-tight">
                    Valanchery Festival
                  </span>
                  <span className="text-[8px] tracking-widest text-[#8e6b1b] uppercase font-semibold">
                    2026 Celebration
                  </span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                The grand shopping and cultural festival celebrating local businesses, shoppers, and community togetherness in Valanchery.
              </p>
              <p className="text-[#8e6b1b] text-[9px] tracking-wider uppercase font-bold">
                Shop Local • Support Local
              </p>
            </div>

            {/* Col 2: Festival Highlights */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#720e1e] tracking-wider uppercase">
                Festival Highlights
              </h4>
              <ul className="space-y-2 text-slate-700">
                <li>
                  <a href="#why-festival" className="hover:text-[#720e1e] transition">
                    Why Valanchery Festival
                  </a>
                </li>
                <li>
                  <a href="#shop-local" className="hover:text-[#720e1e] transition">
                    Participating Stores
                  </a>
                </li>
                <li>
                  <a href="#our-valanchery" className="hover:text-[#720e1e] transition">
                    Our Town Heritage
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Portals */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#720e1e] tracking-wider uppercase">
                Lucky Draw Portals
              </h4>
              <ul className="space-y-2 text-slate-700">
                <li>
                  <Link to="/register" className="hover:text-[#720e1e] transition">
                    Register New Coupon
                  </Link>
                </li>
                <li>
                  <a href="#why-festival" className="hover:text-[#720e1e] transition">
                    Festival Information
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Town Helpdesk */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#720e1e] tracking-wider uppercase">
                Festival Helpdesk
              </h4>
              <div className="space-y-2 text-[11px] text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#8e6b1b] shrink-0 mt-0.5" />
                  <span>Main Road, Valanchery, Malappuram, Kerala 676552</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#8e6b1b] shrink-0" />
                  <span>+91 97453 07450 / +91 85929 29295</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#8e6b1b] shrink-0" />
                  <span>info@valancheryfestival.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
            <p>© 2026 Valanchery Festival Merchants Committee. All rights reserved.</p>
            <div className="text-center sm:text-right">
              <p className="text-slate-600 font-medium">Official Lucky Draw Portal · Valanchery, Malappuram</p>
              <Link to="/admin/login" className="text-[9px] text-slate-400 hover:text-slate-600 transition block mt-0.5">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


