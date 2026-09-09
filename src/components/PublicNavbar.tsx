import { Link } from 'react-router-dom'

interface PublicNavbarProps {
  active?: 'home' | 'register' | 'winners'
}

export function PublicNavbar({ active }: PublicNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#2a130c]/95 backdrop-blur-md text-white border-b border-[#c28e18]/25 px-3 sm:px-12 py-2.5 sm:py-3.5 shadow-md shadow-black/15">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-6">
        {/* Brand Tagline */}
        <Link to="/" className="flex items-center shrink min-w-0 group">
          <span className="font-cinzel text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-normal tracking-[0.14em] sm:tracking-[0.22em] text-[#e8c679]/90 uppercase hover:text-white transition truncate">
            SHOP • CELEBRATE • WIN TOGETHER
          </span>
        </Link>

        {/* Navigation Links - Centered on Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-white/85 shrink-0">
          <Link
            to="/"
            className={`transition py-1 tracking-wide ${
              active === 'home' ? 'text-[#e5aa22] font-semibold' : 'hover:text-[#e5aa22]'
            }`}
          >
            Home
          </Link>
          <a href="/#why-festival" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            Why Festival
          </a>
          <a href="/#coupon-journey" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            The Coupon
          </a>
          <a href="/#shop-local" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            Shop Local
          </a>
          <a href="/#our-valanchery" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            Our Town
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#d49b29] to-[#b87e14] hover:from-[#e5aa22] hover:to-[#c98c17] text-[#1c0c07] px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-semibold tracking-wide transition shadow-sm active:scale-95 whitespace-nowrap"
          >
            Register Now
          </Link>

          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/15 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white/80 hover:text-white transition whitespace-nowrap"
            title="Admin Portal"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
