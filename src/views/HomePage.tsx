import { useState } from 'react'
import { Link } from '../components/Link'
import {
  ArrowRight,
  Gift,
  Play,
  X,
} from 'lucide-react'
import couponBannerImg from '../assets/festival-coupon-banner.png'
import heroBannerFull from '../assets/hero-banner-full.png'
import { PublicNavbar } from '../components/PublicNavbar'
import { HomeRegisterSection } from '../components/HomeRegisterSection'

export function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  return (
    <div className="w-full bg-[#F3F4F6] text-[#1E2937] font-sans select-none scroll-smooth min-h-screen overflow-x-hidden">
      {/* 1. White Festival Navbar */}
      <PublicNavbar active="home" />

      {/* Main Page Content Container */}
      <main className="pt-14 sm:pt-16 pb-16 w-full overflow-x-hidden">
        {/* ─────────────────────────────────────────────────────────────
            FOLD 1: 100% FULL-WIDTH VIBRANT HERO BANNER (Edge-to-Edge)
        ─────────────────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden shadow-xl bg-[#FF0B6B]">
          {/* Background Full Hero Banner Image across 100% viewport width */}
          <div
            className="w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] bg-cover bg-center sm:bg-right-bottom relative flex flex-col justify-center"
            style={{
              backgroundImage: `url(${typeof heroBannerFull === 'string' ? heroBannerFull : (heroBannerFull as any)?.src || '/hero-banner-full.png'})`,
              backgroundPosition: 'right center',
              backgroundSize: 'cover',
            }}
          >
            {/* Soft Gradient Veil for left text legibility without obscuring the right bags */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0B6B]/90 via-[#FF0B6B]/55 to-transparent sm:via-[#FF0B6B]/30 lg:to-transparent pointer-events-none" />

            {/* Inner Content Alignment matching the Navbar max-width */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 relative z-10 py-10 sm:py-14">
              {/* Top Right Handwriting Sticker */}
              <div className="hidden md:block absolute top-2 right-4 lg:right-8 text-right z-20 pointer-events-none">
                <p className="font-script text-white/95 text-xl lg:text-2xl font-bold tracking-wide -rotate-3 drop-shadow-md leading-tight">
                  Local Business<br />Stronger Together ♡
                </p>
              </div>

              {/* Text on the Center Pink Bag */}
              <div className="hidden lg:block absolute bottom-[8%] right-[22%] xl:right-[24%] z-20 pointer-events-none transform -rotate-6">
                <p className="font-script text-white text-3xl xl:text-4xl font-extrabold tracking-wide drop-shadow-lg text-center leading-tight">
                  Shop<br />Local ♡
                </p>
              </div>

              {/* Hero Content (Left-Aligned exactly as mockup) */}
              <div className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4 text-white">
                {/* Script Subtitle */}
                <p className="font-script text-white text-2xl sm:text-3xl lg:text-4xl font-bold italic tracking-wide drop-shadow-md">
                  Shop Local Support Local Win Together ♡
                </p>

                {/* Clean Semi-Bold Montserrat Headline */}
                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05] drop-shadow-md">
                  Valanchery<br />Festival 2026
                </h1>

                {/* Tagline */}
                <p className="text-white/95 text-xs sm:text-sm lg:text-base font-normal tracking-wide drop-shadow-xs">
                  Shop Local &nbsp;•&nbsp; Support Local &nbsp;•&nbsp; Win Together
                </p>

                {/* Action Buttons */}
                <div className="pt-2 sm:pt-4 flex items-center">
                  <a
                    href="#register"
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#FF0B6B] px-7 sm:px-9 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg transition active:scale-95 cursor-pointer rounded-lg"
                  >
                    <span>Register Now</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Width Inner Content Container */}
        <div className="w-full pt-4 sm:pt-6 space-y-4 sm:space-y-6">
          {/* ─────────────────────────────────────────────────────────────
              FOLD 2: FESTIVAL SPECIAL COUPON BANNER (Flush, No Empty Space)
          ─────────────────────────────────────────────────────────────── */}
          <section className="relative w-full bg-gradient-to-r from-white via-[#FFF5F8] to-white border-y sm:border border-pink-200/90 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-xs overflow-hidden rounded-none">
            {/* Soft pink confetti sparkles in background */}
            <div className="absolute top-2 left-1/4 text-pink-300/40 text-sm select-none">✦</div>
            <div className="absolute bottom-2 left-1/3 text-amber-300/50 text-xs select-none">★</div>
            <div className="absolute top-4 right-1/4 text-purple-300/40 text-sm select-none">✦</div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-center relative z-10">
              {/* Left Column: Refined Light Title */}
              <div className="order-1 lg:order-1 lg:col-span-4 space-y-1 text-center lg:text-left w-full">
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight leading-snug text-[#1E2937]">
                  Exclusive<br className="hidden sm:inline" />
                  <span className="text-[#FF0B6B] font-semibold"> Festival Coupons</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Save more. Shop more. Support local.
                </p>
              </div>

              {/* Script Motto & Shopping Bags Illustration: Placed ABOVE coupon on mobile */}
              <div className="order-2 lg:order-3 lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right space-y-2.5">
                <p className="font-script text-[#FF0B6B] text-2xl sm:text-3xl font-bold leading-snug">
                  Shop Local<br />Save More<br />Support Valanchery ♡
                </p>
                {/* Bags Visual Cluster */}
                <div className="w-28 sm:w-36 overflow-hidden">
                  <img
                    src="/shopping-bags.png"
                    alt="Valanchery Festival Shopping Bags"
                    className="w-full h-auto drop-shadow-md"
                  />
                </div>
              </div>

              {/* Center Column: Prominent Large Official Lucky Draw Coupon Ticket */}
              <div className="order-3 lg:order-2 lg:col-span-5 flex items-center justify-center w-full">
                <div className="relative group w-full max-w-[420px] sm:max-w-[480px]">
                  {/* Large Official Coupon Card Container */}
                  <div className="relative overflow-hidden bg-white border-2 border-[#FF0B6B] shadow-2xl p-2 sm:p-2.5 transition transform group-hover:scale-101 duration-300 rounded-none">
                    {/* Top Header Tag Row */}
                    <div className="bg-[#FF0B6B] text-white px-3 py-1 flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Gift size={13} className="text-[#FFD600]" />
                        <span>LUCKY DRAW 2026</span>
                      </div>
                      <span className="bg-[#FFD600] text-[#1E2937] px-2 py-0.5 font-black text-[9px]">OFFICIAL</span>
                    </div>

                    {/* High-Resolution Official Coupon Graphic */}
                    <div className="border border-pink-100 overflow-hidden bg-white">
                      <img
                        src={typeof couponBannerImg === 'string' ? couponBannerImg : (couponBannerImg as any)?.src || '/festival-coupon-banner.png'}
                        alt="Valanchery Lucky Draw Official Coupon"
                        className="w-full h-auto max-h-[140px] sm:max-h-[160px] object-contain block mx-auto"
                      />
                    </div>
                  </div>

                  {/* Floating Sparkle Accents */}
                  <div className="absolute -top-2 -right-2 text-[#FFD600] text-sm animate-pulse">✨</div>
                  <div className="absolute -bottom-2 -left-2 text-[#FF0B6B] text-sm">✦</div>
                </div>
              </div>
            </div>
          </section>





          {/* ─────────────────────────────────────────────────────────────
              FOLD 4: "WHY SHOP LOCAL?" (Balanced, Centered, Premium Layout)
          ─────────────────────────────────────────────────────────────── */}
          <section id="why-festival" className="scroll-mt-20 relative w-full bg-gradient-to-r from-white via-[#FFF5F8] to-white border-y border-pink-100 py-8 sm:py-12 shadow-xs overflow-hidden rounded-none">
            {/* Soft pink organic background swoosh on right */}
            <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 bg-gradient-to-l from-[#FFE4F2]/40 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-9 bg-[#FF0B6B] shrink-0" />
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-[#1E2937]">
                      Why Shop Local?
                    </h2>
                    <div className="h-1 w-14 bg-[#FF0B6B] mt-1.5" />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-1">
                  Your support helps local businesses grow, creates more opportunities, and builds a stronger, happier Valanchery.
                </p>
              </div>

              {/* Right Column: Direct High-Quality Collage Image Asset */}
              <div className="lg:col-span-6 flex justify-center items-center py-2">
                <img
                  src="/why-shop-local-collage.png"
                  alt="Valanchery Festival Local Markets"
                  className="w-full max-w-[420px] sm:max-w-[480px] h-auto object-contain block drop-shadow-sm"
                />
              </div>
            </div>
          </section>





          {/* ─────────────────────────────────────────────────────────────
              FOLD 5: 📝 LIVE REGISTRATION FORM (DIRECTLY ON HOME PAGE)
          ─────────────────────────────────────────────────────────────── */}
          <div id="register" className="scroll-mt-20">
            <HomeRegisterSection />
          </div>


          {/* ─────────────────────────────────────────────────────────────
              FOLD 6: 🏘️ "OUR TOWN" HERITAGE
          ─────────────────────────────────────────────────────────────── */}
          <section id="our-valanchery" className="scroll-mt-20 bg-gradient-to-r from-[#1E2937] via-[#2A1B28] to-[#1E2937] text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-lg rounded-none">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight leading-tight text-white">
                More Than Shopping. <span className="font-semibold text-pink-300">It's Our Valanchery.</span>
              </h2>
              <p className="font-script text-pink-300 text-2xl sm:text-3xl font-bold">
                “Local shops. Local people. Local happiness.”
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-xl mx-auto">
                Shop with pride across Valanchery's registered stores, collect your official serial-numbered coupon tickets, and celebrate with the whole town!
              </p>
              <div className="pt-3">
                <a
                  href="#register"
                  className="inline-flex items-center gap-2 bg-[#FF0B6B] hover:bg-[#E0005C] text-white px-7 py-3 text-xs sm:text-sm font-semibold rounded-lg shadow-md transition active:scale-95 cursor-pointer"
                >
                  <span>Register Coupon</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>


      {/* ─────────────────────────────────────────────────────────────
          EVENT VIDEO MODAL
      ─────────────────────────────────────────────────────────────── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-black overflow-hidden border border-white/20 shadow-2xl rounded-none">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition rounded-none"
            >
              <X size={18} />
            </button>
            <div className="p-8 sm:p-12 text-center text-white space-y-4">
              <div className="w-16 h-16 bg-[#FF0B6B] text-white mx-auto flex items-center justify-center shadow-lg rounded-none">
                <Play size={24} className="fill-current ml-1" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black">Valanchery Festival 2026 Promo</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Official teaser video for Valanchery Shopping Festival Season 2. Shop local, support local, and win bumper rewards!
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 text-xs font-bold border border-white/20 transition rounded-none"
                >
                  Close Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────
          MINIMALIST COMMUNITY FOOTER
      ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-white text-[#1E2937] border-t border-slate-200 py-10 px-4 sm:px-8 font-sans">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-[#FF0B6B] font-script text-2xl sm:text-3xl font-bold">
            Shop Local • Support Local ♡
          </p>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal max-w-3xl mx-auto">
            Celebrate local shopping, discover exciting offers, and be part of something bigger with our Valanchery festival experience. Explore exclusive deals from local businesses, enter your coupon for a chance to win exciting rewards, and support the brands that make our community special. Every purchase helps local businesses grow while giving you more opportunities to save, shop, and celebrate. Join us in creating a stronger, happier Valanchery by shopping local and celebrating together.
          </p>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>© 2026 Valanchery Festival Merchants Committee. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-medium">Official Lucky Draw Portal · Valanchery</span>
              <span>•</span>
              <Link to="/admin/login" className="text-slate-400 hover:text-[#FF0B6B] transition underline underline-offset-2">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
