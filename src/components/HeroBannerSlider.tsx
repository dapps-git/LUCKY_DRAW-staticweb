import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BANNERS = [
  {
    id: 'banner-festival',
    src: '/banner-festival.png',
    alt: 'Valanchery Festival 2026 - Shop Local, Support Local, Win Together',
  },
  {
    id: 'banner-prizes',
    src: '/banner-prizes.png',
    alt: 'Win Exciting Prizes - Cars, Scooters, Home Appliances & Gold',
  },
  {
    id: 'banner-support-local',
    src: '/banner-support-local.png',
    alt: 'Support Local Business - Celebrate Valanchery Merchants & Shops',
  },
]

export function HeroBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  return (
    <div
      className="w-full max-w-[960px] mx-auto my-2 sm:my-3.5 relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with gold accent border and ambient shadow */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-[#e5a93b]/60 bg-slate-900 shadow-xl shadow-amber-950/20">
        {/* Slides Track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div key={banner.id} className="w-full shrink-0 relative aspect-[1024/379] bg-slate-950">
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover select-none"
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Prev Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 z-10"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 z-10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
          {BANNERS.map((banner, idx) => (
            <button
              key={banner.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-[#fee140]'
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
