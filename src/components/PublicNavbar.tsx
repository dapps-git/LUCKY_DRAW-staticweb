import { Link } from './Link'
import { ArrowRight } from 'lucide-react'

interface PublicNavbarProps {
  active?: 'home' | 'register' | 'winners'
}

export function PublicNavbar({ active }: PublicNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md text-[#1F2937] border-b border-pink-100 px-4 sm:px-8 lg:px-12 py-3 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand Logo - Pure Typography Wordmark */}
        <Link to="/" className="flex flex-col justify-center group shrink-0 py-0.5">
          <span className="text-[11px] xs:text-xs sm:text-base font-light tracking-[0.22em] text-[#1E2937] uppercase leading-none group-hover:text-black transition">
            VALANCHERY
          </span>
          <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-medium tracking-[0.3em] text-[#FF0B6B] uppercase leading-tight mt-0.5">
            FESTIVAL 2026
          </span>
        </Link>

        {/* Navigation Links - Centered on Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-xs sm:text-[13px] font-medium text-slate-700 shrink-0">
          <Link
            to="/"
            className={`transition py-1 tracking-wide relative ${
              active === 'home'
                ? 'text-[#FF0B6B] font-bold after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#FF0B6B]'
                : 'hover:text-[#FF0B6B]'
            }`}
          >
            Home
          </Link>
          <a href="/#why-festival" className="hover:text-[#FF0B6B] transition py-1 tracking-wide">
            Why Festival
          </a>
          <a href="/#our-valanchery" className="hover:text-[#FF0B6B] transition py-1 tracking-wide">
            Our Town
          </a>
        </nav>

        {/* Right Action Button - Hidden on mobile view */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Pink Register Button with subtle rounded corners */}
          <a
            href="#register"
            className="inline-flex items-center gap-1.5 bg-[#FF0B6B] hover:bg-[#E0005C] text-white px-5 sm:px-6 py-2 text-xs font-semibold tracking-wider uppercase transition shadow-md shadow-[#FF0B6B]/25 active:scale-95 cursor-pointer whitespace-nowrap rounded-lg"
          >
            <span>Register Now</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </header>
  )
}

