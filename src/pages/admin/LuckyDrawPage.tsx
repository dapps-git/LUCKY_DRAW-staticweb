import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { Toast } from '../../components/Toast'
import { useApp } from '../../context/AppContext'
import { GIFT_PRESETS } from '../../data/mockData'
import type { Participant, Prize } from '../../types'
import {
  Sparkles,
  Trophy,
  ArrowLeft,
  RotateCcw,
  Gift,
  Plus,
  ChevronDown,
  Check,
  ShieldCheck,
  X,
  Sparkle,
  Upload,
  Loader2,
} from 'lucide-react'

type Phase = 'ready' | 'spinning' | 'verifying' | 'reveal' | 'done'

export function LuckyDrawPage() {
  const {
    data,
    eligibleParticipants,
    winnerParticipantIds,
    nextDraw,
    getPrize,
    confirmWinner,
    addPrize,
    assignPrizeToDraw,
  } = useApp()
  const navigate = useNavigate()

  // Selected prize for current draw (defaults to draw's assigned prize)
  const defaultPrize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(null)
  const [showPrizeSelector, setShowPrizeSelector] = useState(false)
  const [showAddPrizeModal, setShowAddPrizeModal] = useState(false)

  // Sync selected prize id when nextDraw changes
  useEffect(() => {
    if (nextDraw && !selectedPrizeId) {
      setSelectedPrizeId(nextDraw.prizeId)
    }
  }, [nextDraw, selectedPrizeId])

  const activePrize: Prize | undefined = useMemo(() => {
    if (selectedPrizeId) {
      const found = getPrize(selectedPrizeId)
      if (found) return found
    }
    return defaultPrize
  }, [selectedPrizeId, getPrize, defaultPrize])

  // STRICT POOL: only active participants who have NOT won yet
  const pool = useMemo(
    () => eligibleParticipants.filter((p) => p.status === 'Active'),
    [eligibleParticipants],
  )

  const [phase, setPhase] = useState<Phase>('ready')
  const [display, setDisplay] = useState<Participant | null>(pool[0] ?? null)
  const [winner, setWinner] = useState<Participant | null>(null)
  const [progress, setProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [confirmAgain, setConfirmAgain] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [toast, setToast] = useState('')
  const [flash, setFlash] = useState(false)
  const timers = useRef<number[]>([])

  // New Gift Form State
  const [newGift, setNewGift] = useState({
    name: '',
    value: '',
    description: '',
    image: GIFT_PRESETS[0].image,
  })

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  // Keep display participant updated when pool changes and ready
  useEffect(() => {
    if (phase === 'ready' && pool.length > 0 && !display) {
      setDisplay(pool[0])
    }
  }, [pool, phase, display])

  const pickWinner = () => {
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const startDraw = () => {
    if (!pool.length || phase === 'spinning' || phase === 'verifying') return
    const chosen = pickWinner()
    if (!chosen) return

    setWinner(chosen)
    setPhase('spinning')
    setProgress(0)
    setShowModal(false)

    const duration = 5000
    const start = Date.now()
    let delay = 50

    const tick = () => {
      const elapsed = Date.now() - start
      setProgress(Math.min(100, (elapsed / duration) * 100))
      const idx = Math.floor(Math.random() * pool.length)
      setDisplay(pool[idx])

      if (elapsed < duration - 1400) {
        delay = Math.min(180, delay + 4)
        timers.current.push(window.setTimeout(tick, delay))
      } else if (elapsed < duration) {
        timers.current.push(window.setTimeout(tick, 280))
      } else {
        setDisplay(chosen)
        // Switch to verifying phase with spinner
        setPhase('verifying')
        timers.current.push(
          window.setTimeout(() => {
            setFlash(true)
            setPhase('reveal')
            timers.current.push(
              window.setTimeout(() => {
                setFlash(false)
                setPhase('done')
                setShowModal(true)
              }, 900),
            )
          }, 1800),
        )
      }
    }
    tick()
  }

  const resetSpin = () => {
    setConfirmAgain(false)
    setShowModal(false)
    setPhase('ready')
    setWinner(null)
    setProgress(0)
  }

  const handleSelectPrize = (prizeId: string) => {
    setSelectedPrizeId(prizeId)
    if (nextDraw) {
      assignPrizeToDraw(nextDraw.id, prizeId)
    }
    setShowPrizeSelector(false)
    setToast('Prize updated for this lucky draw!')
  }

  const handleSaveNewGift = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGift.name.trim()) return

    const newId = addPrize({
      name: newGift.name.trim(),
      value: newGift.value.trim() || '₹0',
      description: newGift.description.trim() || 'Valanchery Festival Special Prize',
      image: newGift.image,
      assignedDrawId: nextDraw?.id ?? null,
      status: 'Assigned',
    })

    if (nextDraw) {
      assignPrizeToDraw(nextDraw.id, newId)
    }
    setSelectedPrizeId(newId)
    setShowAddPrizeModal(false)
    setToast(`Gift "${newGift.name}" created and assigned to Draw!`)
    setNewGift({
      name: '',
      value: '',
      description: '',
      image: GIFT_PRESETS[0].image,
    })
  }

  if (!nextDraw || !activePrize) {
    return (
      <div className="space-y-4 font-['Montserrat',sans-serif]">
        <div className="flex items-center justify-start">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 border border-[#e8decb] bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
            title="Go back"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div className="border border-[#e8decb] bg-white p-8 text-center text-[#140d10] md:p-12 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f0e6] text-[#ad823e]">
            <Trophy size={28} />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#140d10]">
            All Scheduled Draws are Completed!
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm max-w-md mx-auto leading-relaxed">
            Check the Winners records for complete festival history or configure a new draw in Schedule.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <Link
              to="/admin/winners"
              className="border border-[#5e0917] bg-[#5e0917] px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-white transition hover:bg-[#720e1e] shadow-sm shadow-[#5e0917]/20"
            >
              View All Winners
            </Link>
            <Link
              to="/admin/dashboard"
              className="border border-slate-300 bg-[#fbf4ea] px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-slate-800 transition hover:bg-[#f6ebd8]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <Confetti active={phase === 'reveal' || phase === 'done'} />
      {flash && <div className="pointer-events-none absolute inset-0 z-20 bg-white animate-[flash_0.7s_ease]" />}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Decorative festive vector elements matching reference design */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Left tilted gift box line art */}
        <svg
          className="absolute left-6 lg:left-14 top-1/2 -translate-y-1/2 -rotate-12 w-28 h-28 sm:w-36 sm:h-36 text-[#ebd8c2] opacity-50 hidden md:block"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8v13" />
          <path d="M19 12H5" />
          <path d="M12 8a3 3 0 1 0-3-3c0 2 3 3 3 3z" />
          <path d="M12 8a3 3 0 1 1 3-3c0 2-3 3-3 3z" />
        </svg>

        {/* Right tilted gift box line art */}
        <svg
          className="absolute right-6 lg:right-14 top-1/2 -translate-y-1/2 rotate-12 w-28 h-28 sm:w-36 sm:h-36 text-[#ebd8c2] opacity-50 hidden md:block"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8v13" />
          <path d="M19 12H5" />
          <path d="M12 8a3 3 0 1 0-3-3c0 2 3 3 3 3z" />
          <path d="M12 8a3 3 0 1 1 3-3c0 2-3 3-3 3z" />
        </svg>

        {/* Soft pastel bokeh dots */}
        <div className="absolute left-[12%] top-[22%] h-3 w-3 rounded-full bg-[#f4cfd4] opacity-70" />
        <div className="absolute right-[16%] top-[25%] h-3 w-3 rounded-full bg-[#fae7cf] opacity-80" />
        <div className="absolute left-[14%] bottom-[28%] h-3 w-3 rounded-full bg-[#fae7cf] opacity-80" />
        <div className="absolute right-[14%] bottom-[25%] h-3 w-3 rounded-full bg-[#f4cfd4] opacity-70" />

        {/* Soft ribbon swirls */}
        <svg
          className="absolute left-[18%] bottom-[40%] w-12 h-12 text-[#f3d0d6] opacity-70 hidden sm:block"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M10 40 Q 25 10, 45 25" />
        </svg>
        <svg
          className="absolute right-[17%] bottom-[35%] w-14 h-14 text-[#f3d0d6] opacity-70 hidden sm:block"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M5 15 Q 25 40, 45 20" />
        </svg>
      </div>

      {/* Back to Dashboard Button */}
      <div className="relative z-10 w-full max-w-[440px] mb-3.5 flex items-center justify-start">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#5c0b17] transition bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-none border border-[#e8decb] shadow-xs cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Centered Card */}
      <div className="relative z-10 w-full max-w-[440px] rounded-none bg-[#fffdfa] p-7 sm:p-10 text-center shadow-[0_22px_50px_rgba(0,0,0,0.06)] border border-[#f5ece0]">
        {/* Draw Title */}
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#5c0b17]">
          Lucky Draw #{String(nextDraw.number).padStart(2, '0')}
        </h1>

        {/* Rose accent divider */}
        <div className="mx-auto mt-2 h-[2px] w-12 rounded-none bg-[#deb3ba]" />

        {/* Eligible Participants Count */}
        <p className="mt-2.5 text-xs sm:text-[13px] text-slate-500 font-normal">
          {pool.length} eligible participants in this draw
        </p>

        {/* Prize Image */}
        <div className="mt-6 mb-4 w-full h-44 sm:h-48 overflow-hidden rounded-none shadow-xs border border-[#eee4d6]">
          <img
            src={activePrize.image}
            alt={activePrize.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Prize Label & Name */}
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#ad823e] uppercase">
            CURRENT PRIZE
          </p>
          <p className="text-xl sm:text-[22px] font-bold text-[#5c0b17] mt-1">
            {activePrize.name} <span className="font-bold">({activePrize.value})</span>
          </p>

          {/* Change Prize Button */}
          {phase === 'ready' && (
            <button
              onClick={() => setShowPrizeSelector(true)}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c0b17] hover:text-white bg-[#fbf4ea] hover:bg-[#5c0b17] border border-[#e8decb] hover:border-[#5c0b17] px-3.5 py-1.5 transition cursor-pointer shadow-2xs"
            >
              <Gift size={13} className="text-[#ad823e]" />
              <span>Select Gift from Vault</span>
            </button>
          )}
        </div>

        {/* Ready Phase - Prominent START LIVE DRAW Button */}
        {phase === 'ready' && (
          <div className="mt-6">
            {pool.length > 0 ? (
              <button
                onClick={startDraw}
                className="w-full rounded-none bg-[#5e0917] hover:bg-[#720e1e] py-3.5 px-6 text-xs sm:text-[13px] font-bold tracking-widest uppercase text-white shadow-[0_8px_20px_rgba(94,9,23,0.35)] transition duration-150 active:scale-[0.98] cursor-pointer"
              >
                START LIVE DRAW
              </button>
            ) : (
              <p className="text-xs text-rose-700 font-medium py-2">
                No eligible participants remaining in the pool.
              </p>
            )}
          </div>
        )}

        {/* Spinning Phase in Card */}
        {phase === 'spinning' && display && (
          <div className="mt-6 border-t border-[#f0e6d6] pt-5 space-y-3">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#ad823e] uppercase animate-pulse">
              Selecting Winner…
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#5c0b17] tracking-tight truncate">
              {display.name}
            </p>
            {display.couponId && (
              <span className="inline-block font-mono text-xs font-bold text-slate-800 bg-[#f7f0e6] px-3 py-1 rounded-none border border-[#e8decb]">
                🎫 {display.couponId}
              </span>
            )}
            <div className="h-1.5 w-full bg-slate-200 overflow-hidden rounded-none mt-3">
              <div
                className="h-full bg-[#5e0917] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Verifying Phase with Spinner */}
        {phase === 'verifying' && display && (
          <div className="mt-6 border-t border-[#f0e6d6] pt-6 pb-2 space-y-3">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbf4ea] text-[#ad823e]">
                <Loader2 size={26} className="animate-spin" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider text-[#ad823e] uppercase">
              Verifying Winner & Token…
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#5c0b17] tracking-tight truncate">
              {display.name}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Checking tamper-proof certificate & coupon status in ledger…
            </p>
          </div>
        )}

        {/* Reveal / Done Phase in Card */}
        {(phase === 'reveal' || phase === 'done') && winner && (
          <div className="mt-6 border-t border-[#f0e6d6] pt-5 space-y-3">
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded-none uppercase tracking-wider">
              Winner Selected
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#5c0b17] tracking-tight">
              {winner.name}
            </p>
            {winner.couponId && (
              <p className="font-mono text-xs sm:text-sm font-bold text-[#8b1e2e]">
                🎫 Coupon: {winner.couponId}
              </p>
            )}
            <p className="font-mono text-xs font-bold text-slate-800">
              Phone: +91 {winner.phone}
            </p>

            <div className="pt-2 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 rounded-none bg-[#5e0917] hover:bg-[#720e1e] py-3 text-xs font-bold tracking-wider uppercase text-white shadow-md shadow-[#5e0917]/25 transition active:scale-95 cursor-pointer"
              >
                Confirm Winner
              </button>
              <button
                onClick={() => setConfirmAgain(true)}
                className="rounded-none border border-slate-300 py-3 px-4 text-xs font-semibold tracking-wider text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Re-spin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal - Festive Certificate Design */}
      {showModal && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto font-['Montserrat',sans-serif]">
          <div className="animate-reveal relative w-full max-w-2xl my-auto rounded-none border border-[#e8decb] bg-[#fffaf6] p-6 sm:p-9 text-[#140d10] shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden">
            {/* Background Decorative Floral & Bokeh Accents */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-40">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[#fde2e4] blur-2xl" />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#faecd6] blur-2xl" />
              <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-[#fde2e4] blur-2xl" />
              <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#faecd6] blur-2xl" />
            </div>

            {/* Top Bar: Brand & Festive Note */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#f3e5d7] pb-3 text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-[#5e0917] text-white font-bold text-xs shadow-xs">
                  VF
                </div>
                <div>
                  <p className="text-xs font-bold tracking-tight text-[#140d10] uppercase">
                    Valanchery Festival
                  </p>
                  <p className="text-[9px] tracking-widest text-[#ad823e] uppercase font-semibold">
                    Shop · Celebrate · Win Together
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <p className="font-serif italic text-xs text-[#720e1e] font-medium">
                  Thank you for being a part of our festival! ♡
                </p>
              </div>
            </div>

            {/* Center Trophy & Congratulations Header */}
            <div className="relative z-10 text-center mt-5 mb-4">
              {/* Golden Trophy with Laurel Icon */}
              <div className="mx-auto flex items-center justify-center gap-2">
                <span className="text-[#ad823e] text-lg select-none">🌿</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#fff3db] to-[#fce4ba] border border-[#e5c278] text-[#ad823e] shadow-sm">
                  <Trophy size={28} className="text-[#b58737] drop-shadow-xs" />
                </div>
                <span className="text-[#ad823e] text-lg select-none scale-x-[-1]">🌿</span>
              </div>

              {/* Congratulations Title */}
              <h2 className="mt-2 font-serif italic text-3xl sm:text-4xl font-bold tracking-tight text-[#5e0917]">
                Congratulations!
              </h2>

              {/* Subtitle with gold accent lines */}
              <div className="mt-1.5 flex items-center justify-center gap-3">
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#ad823e]" />
                <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#8c6727] uppercase">
                  LUCKY DRAW WINNER · DRAW #{String(nextDraw.number).padStart(2, '0')}
                </p>
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#ad823e]" />
              </div>
            </div>

            {/* Main Winner Card */}
            <div className="relative z-10 my-5 rounded-none border border-[#eddcd0] bg-white p-5 sm:p-6 shadow-md text-left">
              {/* Grand Prize Floating Badge on Card Top */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5e0917] px-4 py-1 text-[11px] font-bold tracking-wider uppercase text-white shadow-md shadow-[#5e0917]/25 border border-[#8a1a2e]">
                  <Gift size={12} className="text-[#fce4ba]" />
                  <span>Grand Prize Draw</span>
                </span>
              </div>

              {/* Winner Profile & Info Section */}
              <div className="mt-2 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Avatar with Golden Crown */}
                <div className="relative shrink-0">
                  <div className="absolute -top-3 -left-1 text-base select-none z-10 rotate-[-15deg] drop-shadow-xs">
                    👑
                  </div>
                  <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#f7d6dc] border-2 border-white shadow-sm text-[#720e1e] font-bold text-2xl">
                    {winner.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Winner Name, Phone & Coupon ID */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#140d10] truncate">
                    {winner.name}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1 text-xs">
                    <span className="font-semibold text-slate-800 tracking-wide">
                      +91 {winner.phone}
                    </span>
                  </div>

                  {/* Clean Inline Coupon ID without box */}
                  {winner.couponId && (
                    <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-xs">
                      <span className="text-[11px] font-semibold text-[#8c6727] tracking-wider uppercase">
                        Token ID:
                      </span>
                      <span className="font-mono font-bold text-xs tracking-wider text-[#5e0917]">
                        {winner.couponId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prize Inset Banner Box */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-none border border-[#f2ded6] bg-[#fbf2ef] p-3.5 sm:p-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src={activePrize.image}
                    alt={activePrize.name}
                    className="h-14 w-16 sm:h-16 sm:w-20 object-cover border border-[#e8decb] bg-white shrink-0 shadow-2xs"
                  />
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-[#8c6727] uppercase">
                      PRIZE WON
                    </p>
                    <p className="text-base sm:text-lg font-bold text-[#5e0917] leading-snug">
                      {activePrize.name}
                    </p>
                    {activePrize.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {activePrize.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="hidden sm:block h-10 w-[1px] bg-[#e4cdc4]" />

                <div className="text-center sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-[#f0dbd2] pt-2 sm:pt-0">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block sm:hidden">
                    Value
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#5e0917]">
                    {activePrize.value}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Participation Note */}
            <p className="relative z-10 text-center text-xs text-slate-500 font-medium">
              We appreciate your participation! Keep shopping, keep supporting local.
            </p>

            {/* Action Buttons */}
            <div className="relative z-10 mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                disabled={isConfirming}
                onClick={async () => {
                  setIsConfirming(true)
                  try {
                    const res = await confirmWinner(winner.id, nextDraw.id, activePrize.id)
                    if (res.ok) {
                      setShowModal(false)
                      setToast(`Winner "${winner.name}" officially confirmed with ${activePrize.name}!`)
                    } else {
                      setToast(res.error)
                    }
                  } finally {
                    setIsConfirming(false)
                  }
                }}
                className="w-full sm:w-auto min-w-[200px] rounded-full bg-[#5e0917] hover:bg-[#720e1e] py-3 px-6 text-xs sm:text-[13px] font-bold tracking-wider uppercase text-white transition duration-150 active:scale-95 cursor-pointer shadow-lg shadow-[#5e0917]/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConfirming ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>RECORDING WINNER…</span>
                  </>
                ) : (
                  <span>CONFIRM WINNER →</span>
                )}
              </button>

              <button
                disabled={isConfirming}
                onClick={() => setConfirmAgain(true)}
                className="w-full sm:w-auto rounded-full border border-[#d8c5b6] bg-white hover:bg-[#faf6f0] py-3 px-6 text-xs sm:text-[13px] font-bold tracking-wider uppercase text-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                SPIN AGAIN
              </button>
            </div>

            {/* Bottom Tagline Footer */}
            <div className="relative z-10 mt-6 pt-3 border-t border-[#f3e5d7] flex items-center justify-center gap-3 text-center">
              <div className="h-[1px] w-8 sm:w-16 bg-[#e2cebf]" />
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#8c6727] uppercase">
                VALANCHERY FESTIVAL · A BRIGHTER TOWN TOGETHER
              </p>
              <div className="h-[1px] w-8 sm:w-16 bg-[#e2cebf]" />
            </div>
          </div>
        </div>
      )}

      {/* Re-spin confirmation */}
      {confirmAgain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 font-['Montserrat',sans-serif]">
          <div className="w-full max-w-sm rounded-none border border-[#e8decb] bg-white p-6 sm:p-7 text-[#140d10] shadow-2xl">
            <h4 className="text-lg font-bold text-[#140d10]">Select another winner?</h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              This will discard the current draw result and allow you to re-spin the randomizer for another participant.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setConfirmAgain(false)}
                className="flex-1 rounded-none border border-slate-300 py-2.5 text-xs font-bold tracking-wider uppercase text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={resetSpin}
                className="flex-1 rounded-none bg-[#5e0917] hover:bg-[#720e1e] py-2.5 text-xs font-bold tracking-wider uppercase text-white transition active:scale-95 cursor-pointer shadow-md shadow-[#5e0917]/20"
              >
                Re-spin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prize / Gift Selector Modal */}
      {showPrizeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-none border border-[#e8decb] bg-white p-6 sm:p-7 text-[#140d10] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e8decb] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#140d10]">Choose Gift for this Draw</h3>
                <p className="text-xs text-slate-500">Select any gift from the vault to award in Lucky Draw #{nextDraw.number}</p>
              </div>
              <button onClick={() => setShowPrizeSelector(false)} className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.prizes.map((p) => {
                const isSelected = p.id === activePrize?.id
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPrize(p.id)}
                    className={`cursor-pointer border p-3.5 transition flex items-center gap-3 rounded-none ${
                      isSelected
                        ? 'border-[#5e0917] bg-[#fbf3f4] ring-2 ring-[#5e0917]'
                        : 'border-[#e8decb] hover:border-[#5e0917] hover:bg-[#fbf3f4]/40 bg-[#faf7f0]'
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="h-14 w-14 object-cover rounded-none border border-[#e8decb] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#140d10] truncate">{p.name}</p>
                        {isSelected && <Check size={14} className="text-[#5e0917] shrink-0" />}
                      </div>
                      <p className="text-xs font-mono font-bold text-[#5e0917] mt-0.5">{p.value}</p>
                      {p.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#e8decb] pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowPrizeSelector(false)
                  setShowAddPrizeModal(true)
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e0917] hover:underline cursor-pointer"
              >
                <Plus size={14} /> Add A Brand New Gift Instead
              </button>
              <button
                onClick={() => setShowPrizeSelector(false)}
                className="rounded-none border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Gift Modal */}
      {showAddPrizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-none border border-[#e8decb] bg-white p-6 sm:p-7 text-[#140d10] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e8decb] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#140d10]">Add New Gift</h3>
                <p className="text-xs text-slate-500">Create a gift instantly and assign it to the live draw</p>
              </div>
              <button onClick={() => setShowAddPrizeModal(false)} className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewGift} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">Gift / Prize Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5G Smartphone, Gold Coin, Electric Bike"
                  value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">Approximate Value *</label>
                <input
                  type="text"
                  placeholder="e.g. ₹25,000"
                  value={newGift.value}
                  onChange={(e) => setNewGift({ ...newGift, value: e.target.value })}
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">Description</label>
                <input
                  type="text"
                  placeholder="Short description of prize"
                  value={newGift.description}
                  onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                />
              </div>

              {/* Prize Photo Uploader & Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1.5">
                  Gift Photo / Image *
                </label>

                {/* File Upload Box */}
                <div className="border-2 border-dashed border-[#d8c59f] bg-[#faf7f0] p-3 text-center transition hover:bg-[#f5eedf]">
                  <input
                    type="file"
                    id="live-gift-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (evt) => {
                        const res = evt.target?.result as string
                        if (res) {
                          setNewGift((prev) => ({ ...prev, image: res }))
                        }
                      }
                      reader.readAsDataURL(file)
                    }}
                  />

                  {newGift.image ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="h-16 w-24 shrink-0 overflow-hidden border border-[#d8c59f] bg-white shadow-xs">
                        <img src={newGift.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-slate-800">Photo Attached</p>
                        <div className="mt-1 flex gap-2">
                          <label
                            htmlFor="live-gift-image-upload"
                            className="inline-flex items-center gap-1 bg-[#5e0917] hover:bg-[#720e1e] text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer shadow-xs transition active:scale-95"
                          >
                            <Upload size={11} /> Change
                          </label>
                          <button
                            type="button"
                            onClick={() => setNewGift((prev) => ({ ...prev, image: '' }))}
                            className="inline-flex items-center gap-1 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="live-gift-image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer py-1.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0e6d6] text-[#720e1e]">
                        <Upload size={15} />
                      </div>
                      <p className="mt-1 text-xs font-bold text-slate-800">Click to Upload Photo from Device</p>
                    </label>
                  )}
                </div>

                <div className="mt-2.5">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Or Select Preset Image
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-28 overflow-y-auto border border-[#e8decb] p-2 bg-white">
                    {GIFT_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewGift({
                            ...newGift,
                            image: preset.image,
                            name: newGift.name || preset.name,
                            value: newGift.value || preset.value,
                            description: newGift.description || preset.description,
                          })
                        }}
                        className={`relative border p-1 text-left transition cursor-pointer ${
                          newGift.image === preset.image ? 'border-[#5e0917] bg-[#fffbf2] ring-2 ring-[#5e0917]' : 'border-[#e8decb] bg-white'
                        }`}
                      >
                        <img src={preset.image} alt={preset.name} className="h-10 w-full object-cover" />
                        <p className="mt-1 text-[9px] truncate font-bold text-slate-800">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Or paste custom image URL"
                    value={newGift.image}
                    onChange={(e) => setNewGift({ ...newGift, image: e.target.value })}
                    className="w-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#e8decb]">
                <button
                  type="button"
                  onClick={() => setShowAddPrizeModal(false)}
                  className="flex-1 rounded-none border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-none bg-[#5e0917] hover:bg-[#720e1e] py-2.5 text-xs font-bold tracking-wider uppercase text-white transition active:scale-95 cursor-pointer shadow-md shadow-[#5e0917]/20"
                >
                  Save & Use for Draw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
