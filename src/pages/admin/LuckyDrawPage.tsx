import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { Toast } from '../../components/Toast'
import { useApp } from '../../context/AppContext'
import { GIFT_PRESETS } from '../../data/mockData'
import { maskPhone } from '../../lib/format'
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
} from 'lucide-react'

type Phase = 'ready' | 'spinning' | 'reveal' | 'done'

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
    if (!pool.length || phase === 'spinning') return
    const chosen = pickWinner()
    if (!chosen) return

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
      <div className="border border-black/10 bg-white p-8 text-center text-[#140d10] md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f0e6] text-[#d4a017]">
          <Trophy size={28} />
        </div>
        <h2 className="font-display mt-4 text-2xl font-light">All Scheduled Draws are Completed!</h2>
        <p className="mt-2 text-xs font-light text-black/60 sm:text-sm">
          Check the Winners records for complete festival history or configure a new draw in Schedule.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/admin/winners"
            className="border border-[#6b1020] bg-[#6b1020] px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-white transition hover:bg-[#851629]"
          >
            View All Winners
          </Link>
          <Link
            to="/admin/dashboard"
            className="border border-black/20 bg-[#f7f0e6] px-5 py-2.5 text-xs font-light tracking-wider uppercase text-black transition hover:bg-black/5"
          >
            Dashboard
          </Link>
        </div>
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

        {/* Gift Switcher Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-white/60">Active Grand Prize:</span>
          <span className="font-medium text-[#f3d48a]">🎁 {activePrize.name} ({activePrize.value})</span>
          
          {phase === 'ready' && (
            <div className="inline-flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setShowPrizeSelector(true)}
                className="inline-flex items-center gap-1 border border-[#d4a017]/60 bg-[#d4a017]/10 px-2.5 py-1 text-[11px] font-light text-[#f3d48a] transition hover:bg-[#d4a017]/25"
              >
                <Gift size={12} /> Choose Gift <ChevronDown size={11} />
              </button>
              <button
                onClick={() => setShowAddPrizeModal(true)}
                className="inline-flex items-center gap-1 border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-light text-white transition hover:border-[#f3d48a] hover:text-[#f3d48a]"
              >
                <Plus size={12} /> Add New Gift
              </button>
            </div>
          )}
        </div>

        {/* Live Pool Count and Winner Validation Info */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-light text-white/60">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="font-medium text-white">{pool.length}</strong> eligible participants in live pool
          </span>
          {winnerParticipantIds.size > 0 && (
            <span className="border-l border-white/15 pl-3 text-white/40">
              ({winnerParticipantIds.size} past winners excluded from winning again)
            </span>
          )}
        </div>
      </div>

      {/* Draw Stage Screen */}
      <div className="relative mx-auto mt-8 max-w-xl">
        <div
          className={`relative border-2 border-[#d4a017]/60 bg-gradient-to-b from-[#2a0c14] to-[#0f0407] p-6 text-center sm:p-8 md:p-12 ${
            phase === 'ready' || phase === 'spinning' ? 'animate-glow' : ''
          }`}
        >
          {phase === 'ready' && (
            <div className="py-2">
              {/* Prize Preview Banner */}
              <div className="mx-auto mb-6 max-w-xs overflow-hidden border border-[#d4a017]/40 bg-black/40">
                <img
                  src={activePrize.image}
                  alt={activePrize.name}
                  className="h-32 w-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="p-2.5 text-center bg-black/70 border-t border-white/10">
                  <p className="text-[10px] tracking-wider text-white/50 uppercase">CURRENT PRIZE</p>
                  <p className="font-display text-sm text-[#f3d48a]">{activePrize.name}</p>
                </div>
              </div>

              <p className="text-[11px] tracking-[0.35em] text-[#f3d48a] uppercase">READY FOR DRAW</p>
              <h2 className="font-display mt-2 text-xl font-light tracking-wide text-white sm:text-2xl md:text-3xl">
                START THE LIVE DRAW
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs font-light leading-relaxed text-white/60 sm:text-sm">
                The algorithm will randomly spin through all {pool.length} registered eligible entries and select 1 winner.
              </p>

              {pool.length > 0 ? (
                <button
                  onClick={startDraw}
                  className="mt-6 border border-[#d4a017] bg-[#d4a017] px-8 py-3.5 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e] sm:text-sm shadow-lg shadow-[#d4a017]/20"
                >
                  LAUNCH RANDOMIZER
                </button>
              ) : (
                <div className="mt-6 border border-red-500/40 bg-red-950/40 p-4 text-xs font-light text-red-200">
                  No eligible participants remaining in the pool. All registered participants have already won or are inactive.
                </div>
              )}
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
              <div className="mt-8 h-1.5 w-full overflow-hidden bg-white/10">
                <div className="h-full bg-[#d4a017] transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-light text-white/40">
                <Sparkles size={13} className="text-[#f3d48a] animate-spin" />
                Randomizing across {pool.length} participants…
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
                <img src={activePrize.image} alt={activePrize.name} className="h-36 w-full object-cover" />
              </div>
              <p className="mt-3 text-xs font-light text-white/50 uppercase">AWARDED GRAND PRIZE</p>
              <p className="text-base font-light text-[#f3d48a] sm:text-lg">🎁 {activePrize.name.toUpperCase()} ({activePrize.value})</p>
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
              The draw selected the following participant. Confirm to record this officially into the festival winners list and grant this prize.
            </p>

            <div className="my-5 border border-black/10 bg-[#f7f0e6] p-4 text-left">
              <p className="text-[10px] font-medium tracking-wider text-black/50 uppercase">Winner</p>
              <p className="font-display text-xl font-normal text-[#140d10]">{winner.name}</p>
              <p className="text-xs font-light text-black/70">Phone: {maskPhone(winner.phone)}</p>
              <p className="text-xs font-light text-black/70">Location: {winner.location}</p>
              <p className="text-xs font-mono text-[#6b1020]">ID: {winner.id}</p>

              <div className="mt-3 border-t border-black/10 pt-2">
                <p className="text-[10px] font-medium tracking-wider text-black/50 uppercase">Awarded Prize</p>
                <p className="text-sm font-medium text-[#6b1020]">{activePrize.name} ({activePrize.value})</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  const res = confirmWinner(winner.id, nextDraw.id, activePrize.id)
                  if (res.ok) {
                    setShowModal(false)
                    setToast(`Winner "${winner.name}" officially confirmed with ${activePrize.name}!`)
                  } else {
                    setToast(res.error)
                  }
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

      {/* Prize / Gift Selector Modal */}
      {showPrizeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto border-2 border-[#d4a017] bg-white p-6 text-[#140d10] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <h3 className="font-display text-xl font-light">Choose Gift for this Draw</h3>
                <p className="text-xs font-light text-black/60">Select any prize to be awarded in Lucky Draw #{nextDraw.number}</p>
              </div>
              <button onClick={() => setShowPrizeSelector(false)} className="text-black/50 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.prizes.map((p) => {
                const isSelected = p.id === activePrize.id
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPrize(p.id)}
                    className={`cursor-pointer border p-3 transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#d4a017] bg-[#f7f0e6]'
                        : 'border-black/10 hover:border-black/30 bg-white'
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="h-14 w-14 object-cover border border-black/10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#140d10] truncate">{p.name}</p>
                        {isSelected && <Check size={14} className="text-[#6b1020] shrink-0" />}
                      </div>
                      <p className="text-xs font-mono text-[#6b1020]">{p.value}</p>
                      <p className="text-[10px] text-black/50 uppercase">{p.status}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowPrizeSelector(false)
                  setShowAddPrizeModal(true)
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b1020] hover:underline"
              >
                <Plus size={14} /> Add A Brand New Gift Instead
              </button>
              <button
                onClick={() => setShowPrizeSelector(false)}
                className="border border-black/20 px-4 py-2 text-xs font-light text-black hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Gift Modal */}
      {showAddPrizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-[#d4a017] bg-white p-6 text-[#140d10] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <h3 className="font-display text-xl font-light">Add New Gift (Frontend Only)</h3>
                <p className="text-xs font-light text-black/60">Create a gift instantly and assign it to the live draw</p>
              </div>
              <button onClick={() => setShowAddPrizeModal(false)} className="text-black/50 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewGift} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-black/70 uppercase">Gift / Prize Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5G Smartphone, Gold Coin, Electric Bike"
                  value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                  className="mt-1 w-full border border-black/20 bg-[#faf8f5] px-3 py-2 text-xs font-light outline-none focus:border-[#d4a017]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-black/70 uppercase">Approximate Value *</label>
                <input
                  type="text"
                  placeholder="e.g. ₹25,000"
                  value={newGift.value}
                  onChange={(e) => setNewGift({ ...newGift, value: e.target.value })}
                  className="mt-1 w-full border border-black/20 bg-[#faf8f5] px-3 py-2 text-xs font-light outline-none focus:border-[#d4a017]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-black/70 uppercase">Description</label>
                <input
                  type="text"
                  placeholder="Short description of prize"
                  value={newGift.description}
                  onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                  className="mt-1 w-full border border-black/20 bg-[#faf8f5] px-3 py-2 text-xs font-light outline-none focus:border-[#d4a017]"
                />
              </div>

              {/* Quick Image Preset Selector */}
              <div>
                <label className="block text-[11px] font-medium text-black/70 uppercase mb-1">
                  Choose Gift Image Preset or Custom URL
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-36 overflow-y-auto border border-black/10 p-2 bg-[#f7f0e6]">
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
                      className={`relative border p-1 text-left transition ${
                        newGift.image === preset.image ? 'border-[#6b1020] bg-white ring-2 ring-[#d4a017]' : 'border-black/10 bg-white'
                      }`}
                    >
                      <img src={preset.image} alt={preset.name} className="h-12 w-full object-cover" />
                      <p className="mt-1 text-[9px] truncate font-medium text-black/80">{preset.name}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Or paste custom image URL here"
                    value={newGift.image}
                    onChange={(e) => setNewGift({ ...newGift, image: e.target.value })}
                    className="w-full border border-black/20 bg-[#faf8f5] px-3 py-1.5 text-[11px] font-light outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowAddPrizeModal(false)}
                  className="flex-1 border border-black/20 py-2.5 text-xs font-light text-black hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 border border-[#6b1020] bg-[#6b1020] py-2.5 text-xs font-medium tracking-wider text-white hover:bg-[#851629]"
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
