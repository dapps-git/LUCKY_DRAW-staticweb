import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { Toast } from '../../components/Toast'
import { useApp } from '../../context/AppContext'
import { DEMO_STATS } from '../../data/mockData'
import { maskPhone } from '../../lib/format'
import type { Participant } from '../../types'
import { Sparkles, Trophy, ArrowLeft, RotateCcw, Check } from 'lucide-react'

type Phase = 'ready' | 'spinning' | 'reveal' | 'done'

export function LuckyDrawPage() {
  const { eligibleParticipants, nextDraw, getPrize, confirmWinner } = useApp()
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
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
  const [toast, setToast] = useState('')
  const [flash, setFlash] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const pickWinner = () => pool[Math.floor(Math.random() * pool.length)]

  const startDraw = () => {
    if (!pool.length || phase === 'spinning') return
    const chosen = pickWinner()
    setWinner(chosen)
    setPhase('spinning')
    setProgress(0)
    setShowModal(false)

    const duration = 6500
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
        setFlash(true)
        setPhase('reveal')
        timers.current.push(
          window.setTimeout(() => {
            setFlash(false)
            setPhase('done')
            setShowModal(true)
          }, 900),
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

  if (!nextDraw || !prize) {
    return (
      <div className="border border-black/10 bg-white p-8 text-center text-[#140d10] md:p-12">
        <p className="font-display text-2xl font-light">All scheduled draws are completed.</p>
        <p className="mt-2 text-xs font-light text-black/60">
          Check the Winners section for complete history or create a new draw.
        </p>
        <Link
          to="/admin/dashboard"
          className="mt-6 inline-block border border-black/20 bg-[#f7f0e6] px-5 py-2.5 text-xs font-light tracking-wider uppercase text-black transition hover:bg-black/5"
        >
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] overflow-hidden border border-white/10 bg-[#090507] p-4 text-white sm:p-6 md:p-10">
      <Confetti active={phase === 'reveal' || phase === 'done'} />
      {flash && <div className="pointer-events-none absolute inset-0 z-20 bg-white animate-[flash_0.7s_ease]" />}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Top Header */}
      <div className="relative mx-auto max-w-4xl text-center">
        <Link
          to="/admin/dashboard"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-light text-white/50 transition hover:text-[#f3d48a] sm:absolute sm:left-0 sm:top-0"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <p className="text-[10px] tracking-[0.4em] text-[#f3d48a] uppercase">LIVE STAGE SELECTION</p>
        <h1 className="font-display mt-2 text-2xl font-light tracking-wider sm:text-3xl md:text-5xl">
          LUCKY DRAW #{String(nextDraw.number).padStart(2, '0')}
        </h1>
        <p className="mt-2 text-sm font-light text-[#f3d48a] sm:text-lg">
          🎁 {prize.name.toUpperCase()} ({prize.value})
        </p>
        <p className="mt-1 text-xs font-light text-white/50">
          {DEMO_STATS.totalParticipants.toLocaleString('en-IN')} eligible entries in live pool
        </p>
      </div>

      {/* Draw Stage Screen */}
      <div className="relative mx-auto mt-8 max-w-xl">
        <div
          className={`relative border-2 border-[#d4a017]/60 bg-gradient-to-b from-[#2a0c14] to-[#0f0407] p-6 text-center sm:p-8 md:p-12 ${
            phase === 'ready' || phase === 'spinning' ? 'animate-glow' : ''
          }`}
        >
          {phase === 'ready' && (
            <div className="py-4">
              <p className="text-[11px] tracking-[0.35em] text-[#f3d48a] uppercase">READY FOR DRAW</p>
              <h2 className="font-display mt-3 text-xl font-light tracking-wide text-white sm:text-2xl md:text-3xl">
                START THE LIVE DRAW
              </h2>
              <p className="mx-auto mt-3 max-w-md text-xs font-light leading-relaxed text-white/60 sm:text-sm">
                The algorithm will cycle through all registered participants and randomly lock on a single lucky winner.
              </p>
              <button
                onClick={startDraw}
                className="mt-8 border border-[#d4a017] bg-[#d4a017] px-8 py-3.5 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e] sm:text-sm"
              >
                LAUNCH RANDOMIZER
              </button>
            </div>
          )}

          {phase === 'spinning' && display && (
            <div className="py-4">
              <p className="text-[10px] tracking-[0.35em] text-[#f3d48a] uppercase">SELECTING RANDOM WINNER…</p>
              <div className={`mt-6 ${progress < 80 ? 'animate-slot' : ''}`}>
                <p className="font-display text-2xl font-light uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
                  {display.name}
                </p>
                <p className="mt-2 font-mono text-sm tracking-wider text-white/70 sm:text-base">
                  {maskPhone(display.phone)}
                </p>
                <p className="mt-1 text-xs font-light tracking-wider text-[#f3d48a] uppercase">
                  {display.location}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 h-1 w-full overflow-hidden bg-white/10">
                <div className="h-full bg-[#d4a017] transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-6 text-xs font-light text-white/40">
                Randomizing… Please hold on
              </div>
            </div>
          )}

          {(phase === 'reveal' || phase === 'done') && winner && (
            <div className="animate-reveal py-2">
              <span className="inline-block border border-[#d4a017] bg-[#d4a017]/10 px-3 py-1 text-[10px] tracking-[0.35em] text-[#f3d48a] uppercase">
                WINNER SELECTED
              </span>
              <h2 className="font-display mt-4 text-2xl font-light uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
                {winner.name}
              </h2>
              <p className="mt-2 font-mono text-sm font-light tracking-widest text-white/80 sm:text-base">
                {maskPhone(winner.phone)}
              </p>
              <p className="mt-1 text-xs font-light tracking-wider text-[#f3d48a] uppercase">
                {winner.location} · ID: {winner.id}
              </p>

              <div className="mx-auto mt-6 max-w-xs border border-white/20">
                <img src={prize.image} alt={prize.name} className="h-36 w-full object-cover" />
              </div>
              <p className="mt-3 text-xs font-light text-white/50 uppercase">AWARDED GRAND PRIZE</p>
              <p className="text-base font-light text-[#f3d48a] sm:text-lg">🎁 {prize.name.toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && winner && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4">
          <div className="animate-reveal w-full max-w-md border-2 border-[#d4a017] bg-white p-6 text-[#140d10] shadow-2xl md:p-8">
            <p className="text-[10px] font-medium tracking-[0.3em] text-[#9b1c32] uppercase">RESULT READY</p>
            <h3 className="font-display mt-1 text-2xl font-light tracking-wide text-[#140d10]">
              Confirm Draw Winner
            </h3>
            <p className="mt-2 text-xs font-light text-black/60">
              The draw selected the following participant. Confirm to record this officially into the festival winners list.
            </p>

            <div className="my-5 border border-black/10 bg-[#f7f0e6] p-4 text-left">
              <p className="text-[10px] font-medium tracking-wider text-black/50 uppercase">Winner</p>
              <p className="font-display text-xl font-normal text-[#140d10]">{winner.name}</p>
              <p className="text-xs font-light text-black/70">Phone: {maskPhone(winner.phone)}</p>
              <p className="text-xs font-light text-black/70">Location: {winner.location}</p>

              <div className="mt-3 border-t border-black/10 pt-2">
                <p className="text-[10px] font-medium tracking-wider text-black/50 uppercase">Prize</p>
                <p className="text-sm font-medium text-[#6b1020]">{prize.name} ({prize.value})</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  confirmWinner(winner.id, nextDraw.id)
                  setShowModal(false)
                  setToast('Winner officially confirmed and saved!')
                }}
                className="flex-1 border border-[#6b1020] bg-[#6b1020] py-3 text-xs font-medium tracking-widest text-white transition hover:bg-[#851629]"
              >
                CONFIRM WINNER
              </button>
              <button
                onClick={() => setConfirmAgain(true)}
                className="flex-1 border border-black/20 py-3 text-xs font-light tracking-widest text-black/80 transition hover:bg-black/5"
              >
                SPIN AGAIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-spin confirmation */}
      {confirmAgain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm border border-black/20 bg-white p-6 text-[#140d10] shadow-2xl">
            <h4 className="font-display text-lg font-light">Select another winner?</h4>
            <p className="mt-2 text-xs font-light text-black/60">
              This will discard the current draw result and allow you to re-spin the randomizer.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setConfirmAgain(false)}
                className="flex-1 border border-black/20 py-2.5 text-xs font-light text-black transition hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={resetSpin}
                className="flex-1 border border-[#6b1020] bg-[#6b1020] py-2.5 text-xs font-medium text-white transition hover:bg-[#851629]"
              >
                Re-spin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
