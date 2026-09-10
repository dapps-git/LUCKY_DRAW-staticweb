import { Link } from 'react-router-dom'

interface PublicNavbarProps {
  active?: 'home' | 'register' | 'winners'
}

export function PublicNavbar({ active }: PublicNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#20100a]/95 backdrop-blur-md text-white border-b border-[#3d2015] px-4 sm:px-10 lg:px-14 py-2.5 sm:py-3 shadow-md shadow-black/25">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-6">
        {/* Brand Tagline */}
        <Link to="/" className="flex items-center shrink min-w-0 group">
          <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#dfb86c] uppercase hover:text-white transition truncate">
            SHOP · CELEBRATE · WIN TOGETHER
          </span>
        </Link>

        {/* Navigation Links - Centered on Desktop */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs sm:text-[13px] font-medium text-white/90 shrink-0">
          <Link
            to="/"
            className={`transition py-1 tracking-wide relative ${
              active === 'home'
                ? 'text-[#e5aa22] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e5aa22]'
                : 'hover:text-[#e5aa22]'
            }`}
          >
            Home
          </Link>
          <a href="/#why-festival" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            Why Festival
          </a>
          <a href="/#shop-local" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            Shop Local
          </a>
          <a href="/#our-valanchery" className="hover:text-[#e5aa22] transition py-1 tracking-wide">
            Our Town
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#register"
            className="inline-flex items-center justify-center bg-[#e5a93b] hover:bg-[#d99829] text-[#1c0c07] px-3.5 sm:px-4 py-1.5 text-xs sm:text-[13px] font-bold tracking-wide rounded-md transition shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Register Now
          </a>
        </div>
      </div>
    </header>
  )
}

