import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { Toast } from '../../components/Toast'
import { useApp } from '../../context/AppContext'
import { GIFT_PRESETS } from '../../data/mockData'
import type { Participant, Prize, Draw } from '../../types'
import {
  Sparkles,
  Trophy,
  ArrowLeft,
  RotateCcw,
  Gift,
  Plus,
  Check,
  CheckCircle2,
  X,
  Upload,
  Loader2,
  Users,
} from 'lucide-react'

type Phase = 'ready' | 'spinning' | 'verifying' | 'reveal' | 'done'

export function LuckyDrawPage() {
  const {
    data,
    eligibleParticipants,
    nextDraw,
    getPrize,
    confirmWinner,
    addPrize,
    assignPrizeToDraw,
    addDraw,
  } = useApp()
  const navigate = useNavigate()

  // Selected prize for current draw
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(null)
  const [showPrizeSelector, setShowPrizeSelector] = useState(false)
  const [showAddPrizeModal, setShowAddPrizeModal] = useState(false)

  // Current active draw fallback so it NEVER blocks
  const activeDraw: Draw = useMemo(() => {
    if (nextDraw) return nextDraw
    if (data.draws.length > 0) return data.draws[0]
    return {
      id: 'live-draw',
      number: (data.winners?.length || 0) + 1,
      date: new Date().toISOString().slice(0, 10),
      prizeId: data.prizes[0]?.id || 'default-prize',
      status: 'Upcoming',
      winnerCount: 1,
    }
  }, [nextDraw, data.draws, data.winners])

  // Current active prize fallback
  const activePrize: Prize = useMemo(() => {
    if (selectedPrizeId) {
      const found = getPrize(selectedPrizeId)
      if (found) return found
    }
    if (nextDraw) {
      const found = getPrize(nextDraw.prizeId)
      if (found) return found
    }
    if (data.prizes.length > 0) return data.prizes[0]
    return {
      id: 'default-prize',
      name: 'Grand Lucky Prize',
      value: '₹50,000',
      image: GIFT_PRESETS[0].image,
      description: 'Official Grand Festival Prize',
      assignedDrawId: null,
      status: 'Available',
    }
  }, [selectedPrizeId, getPrize, nextDraw, data.prizes])

  // Eligible pool: all active participants
  const pool = useMemo(() => {
    if (eligibleParticipants.length > 0) {
      return eligibleParticipants.filter((p) => p.status === 'Active')
    }
    return data.participants.filter((p) => p.status === 'Active')
  }, [eligibleParticipants, data.participants])

  // Map of participantId -> list of past wins with prize names
  const previousWinsMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{ drawId: string; drawNumber?: number; prizeName: string; date: string }>
    >()
    data.winners.forEach((w) => {
      const prize = getPrize(w.prizeId)
      const draw = data.draws.find((d) => d.id === w.drawId)
      const existing = map.get(w.participantId) || []
      existing.push({
        drawId: w.drawId,
        drawNumber: draw?.number,
        prizeName: prize?.name || 'Prize',
        date: w.date,
      })
      map.set(w.participantId, existing)
    })
    return map
  }, [data.winners, data.draws, getPrize])

  const [phase, setPhase] = useState<Phase>('ready')
  const [display, setDisplay] = useState<Participant | null>(pool[0] ?? null)
  const [winner, setWinner] = useState<Participant | null>(null)
  const [confirmedWinnerInfo, setConfirmedWinnerInfo] = useState<{
    winner: Participant
    prize: Prize
    drawNumber: number
  } | null>(null)
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

    const duration = 4500
    const start = Date.now()
    let delay = 50
    let stepCount = 0

    const tick = () => {
      const elapsed = Date.now() - start
      setProgress(Math.min(100, (elapsed / duration) * 100))
      
      // Cycle through pool smoothly even if pool size is 2
      const idx = pool.length > 1 ? stepCount % pool.length : 0
      stepCount++
      setDisplay(pool[idx])

      if (elapsed < duration - 1200) {
        delay = Math.min(180, delay + 4)
        timers.current.push(window.setTimeout(tick, delay))
      } else if (elapsed < duration) {
        timers.current.push(window.setTimeout(tick, 250))
      } else {
        setDisplay(chosen)
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
              }, 800),
            )
          }, 1500),
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

  const handleConfirmWinner = async () => {
    if (!winner || !activePrize) return
    setIsConfirming(true)
    try {
      const drawIdToUse = activeDraw?.id || 'live-draw'
      const res = await confirmWinner(winner.id, drawIdToUse, activePrize.id)
      if (res.ok) {
        setConfirmedWinnerInfo({
          winner,
          prize: activePrize,
          drawNumber: activeDraw?.number || 1,
        })
        setShowModal(false)
        setToast(`Winner "${winner.name}" officially recorded!`)
      } else {
        setToast(res.error || 'Failed to record winner')
      }
    } finally {
      setIsConfirming(false)
    }
  }

  const handleSelectPrize = (prizeId: string) => {
    setSelectedPrizeId(prizeId)
    if (activeDraw?.id && activeDraw.id !== 'live-draw') {
      assignPrizeToDraw(activeDraw.id, prizeId)
    }
    setShowPrizeSelector(false)
    setToast('Prize selected for spinning!')
  }

  const handleSaveNewGift = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGift.name.trim()) return

    const newId = addPrize({
      name: newGift.name.trim(),
      value: newGift.value.trim() || '₹0',
      description: newGift.description.trim() || 'Lucky Draw Prize',
      image: newGift.image,
      assignedDrawId: activeDraw?.id ?? null,
      status: 'Available',
    })

    setSelectedPrizeId(newId)
    setShowAddPrizeModal(false)
    setToast(`Gift "${newGift.name}" added and ready for live draw!`)
    setNewGift({
      name: '',
      value: '',
      description: '',
      image: GIFT_PRESETS[0].image,
    })
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <Confetti active={phase === 'reveal' || phase === 'done'} />
      {flash && <div className="pointer-events-none absolute inset-0 z-20 bg-white animate-[flash_0.6s_ease]" />}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Top Controls Bar */}
      <div className="relative z-10 w-full max-w-[460px] mb-4 flex items-center justify-between gap-3">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#FF0B6B] transition bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrizeSelector(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF0B6B] hover:bg-pink-50 bg-white border border-pink-200 px-3 py-1.5 rounded-lg transition cursor-pointer shadow-2xs"
          >
            <Gift size={13} />
            <span>Select Gift</span>
          </button>
        </div>
      </div>

      {/* Main Centered Stage Card */}
      <div className="relative z-10 w-full max-w-[460px] rounded-2xl bg-white p-6 sm:p-8 text-center shadow-lg shadow-pink-500/5 border border-pink-100">
        {/* Draw Header */}
        <div className="flex items-center justify-center gap-2">
          <span className="rounded-md bg-pink-50 border border-pink-100 px-2.5 py-0.5 text-xs font-semibold text-[#FF0B6B] uppercase">
            Live Draw #{String(activeDraw.number).padStart(2, '0')}
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Lucky Draw Stage
        </h1>

        <p className="mt-1 text-xs text-slate-400 font-normal">
          {pool.length} participants eligible in this live draw
        </p>

        {/* Prize Showcase Card */}
        <div className="mt-5 rounded-xl border border-pink-100 bg-pink-50/20 p-3.5 space-y-2.5">
          <div className="w-full h-44 sm:h-48 overflow-hidden rounded-lg bg-white border border-pink-100 shadow-2xs relative">
            <img
              src={activePrize.image}
              alt={activePrize.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 right-2.5 rounded-md bg-white/95 backdrop-blur-xs border border-pink-100 px-2.5 py-0.5 text-xs font-semibold font-mono text-[#FF0B6B] shadow-2xs">
              {activePrize.value}
            </div>
          </div>

          <div className="flex items-center justify-between text-left">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Current Gift</p>
              <h2 className="text-sm font-semibold text-slate-800">{activePrize.name}</h2>
            </div>
            {phase === 'ready' && (
              <button
                onClick={() => setShowPrizeSelector(true)}
                className="text-xs font-medium text-[#FF0B6B] hover:underline cursor-pointer"
              >
                Change
              </button>
            )}
          </div>
        </div>

        {/* Ready Phase - Spin Button */}
        {phase === 'ready' && !confirmedWinnerInfo && (
          <div className="mt-6">
            {pool.length > 0 ? (
              <button
                onClick={startDraw}
                className="w-full rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-3 px-6 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-md shadow-pink-300 transition duration-150 active:scale-[0.99] cursor-pointer"
              >
                Start Live Draw
              </button>
            ) : (
              <p className="text-xs text-slate-400 font-normal py-2">
                No active participants registered in database.
              </p>
            )}
          </div>
        )}

        {/* Spinning Phase */}
        {phase === 'spinning' && display && (
          <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
            <p className="text-xs font-semibold text-[#FF0B6B] uppercase tracking-wider animate-pulse">
              Selecting Winner…
            </p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight truncate">
              {display.name}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {display.couponId && (
                <span className="inline-block font-mono text-xs font-medium text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-100">
                  🎫 {display.couponId}
                </span>
              )}
              {previousWinsMap.has(display.id) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  <Trophy size={11} className="text-amber-600" />
                  Already Won ({previousWinsMap.get(display.id)!.length}x)
                </span>
              )}
            </div>
            <div className="h-1.5 w-full bg-slate-100 overflow-hidden rounded-full mt-3">
              <div
                className="h-full bg-[#FF0B6B] transition-all duration-75 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Verifying Phase */}
        {phase === 'verifying' && display && (
          <div className="mt-6 border-t border-slate-100 pt-5 pb-2 space-y-3">
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-[#FF0B6B]">
                <Loader2 size={22} className="animate-spin" />
              </div>
            </div>
            <p className="text-xs font-semibold text-[#FF0B6B] uppercase">
              Verifying Winner & Token…
            </p>
            <p className="text-xl font-bold text-slate-900 tracking-tight truncate">
              {display.name}
            </p>
            {previousWinsMap.has(display.id) && (
              <p className="text-xs text-amber-700 font-medium">
                🏆 Previous Winner: Won {previousWinsMap.get(display.id)!.map((p) => p.prizeName).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Confirmed Phase */}
        {confirmedWinnerInfo ? (
          <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Winner Confirmed & Saved
            </span>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {confirmedWinnerInfo.winner.name}
            </p>
            {confirmedWinnerInfo.winner.couponId && (
              <p className="font-mono text-xs font-medium text-[#FF0B6B]">
                🎫 Coupon: {confirmedWinnerInfo.winner.couponId}
              </p>
            )}
            <p className="font-mono text-xs text-slate-500 font-normal">
              Phone: +91 {confirmedWinnerInfo.winner.phone}
            </p>
            {previousWinsMap.get(confirmedWinnerInfo.winner.id)?.length ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                <Trophy size={13} className="text-amber-600" />
                <span>Awarded {previousWinsMap.get(confirmedWinnerInfo.winner.id)!.length} total prizes</span>
              </div>
            ) : null}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setConfirmedWinnerInfo(null)
                  setWinner(null)
                  setPhase('ready')
                }}
                className="w-full rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2.5 text-xs font-semibold tracking-wide text-white shadow-xs transition cursor-pointer"
              >
                Spin Next Winner / Draw
              </button>
              <div className="flex gap-2">
                <Link
                  to="/admin/winners"
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition text-center"
                >
                  View Winners
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition text-center"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Reveal / Done Phase in Card */
          (phase === 'reveal' || phase === 'done') && winner && (
            <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase">
                  Winner Selected
                </span>
                {previousWinsMap.has(winner.id) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md uppercase">
                    <Trophy size={10} className="text-amber-600" />
                    Already Won ({previousWinsMap.get(winner.id)!.length}x)
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">
                {winner.name}
              </p>
              {winner.couponId && (
                <p className="font-mono text-xs font-medium text-[#FF0B6B]">
                  🎫 Coupon: {winner.couponId}
                </p>
              )}
              <p className="font-mono text-xs text-slate-500 font-normal">
                Phone: +91 {winner.phone}
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2.5 text-xs font-semibold tracking-wide text-white shadow-xs transition cursor-pointer"
                >
                  Confirm Winner
                </button>
                <button
                  onClick={() => setConfirmAgain(true)}
                  className="rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Re-spin
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg my-auto rounded-2xl border border-pink-100 bg-white p-6 sm:p-7 text-center shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF0B6B]">
                <Sparkles size={14} />
                <span>Winner Announcement</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Trophy icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-[#FF0B6B]">
              <Trophy size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Congratulations!
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 font-normal">
                Lucky Draw Winner Selected
              </p>
            </div>

            {/* Winner info box */}
            <div className="rounded-xl border border-pink-100 bg-pink-50/20 p-4 text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900">{winner.name}</h3>
              <p className="text-xs text-slate-600 font-medium">+91 {winner.phone}</p>
              {winner.couponId && (
                <p className="text-xs font-mono font-medium text-[#FF0B6B]">Token ID: {winner.couponId}</p>
              )}
            </div>

            {/* Previous Win notice if already won */}
            {previousWinsMap.has(winner.id) && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                  <Trophy size={14} className="text-amber-600 shrink-0" />
                  <span>Already Won in Previous Draw</span>
                </div>
                <p className="text-[11px] text-amber-800 font-normal leading-relaxed">
                  This participant has previously won:{' '}
                  <strong>{previousWinsMap.get(winner.id)!.map((p) => p.prizeName).join(', ')}</strong>.
                  They are eligible and can be awarded this gift as well!
                </p>
              </div>
            )}

            {/* Prize won box */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left">
              <img
                src={activePrize.image}
                alt={activePrize.name}
                className="h-12 w-14 object-cover rounded-lg border border-pink-100 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-slate-400 uppercase">Prize Won</p>
                <p className="text-xs font-semibold text-slate-800 truncate">{activePrize.name}</p>
                <p className="text-xs font-mono font-semibold text-[#FF0B6B]">{activePrize.value}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                disabled={isConfirming}
                onClick={handleConfirmWinner}
                className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2.5 text-xs font-semibold tracking-wide text-white transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConfirming ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-white" />
                    <span>Recording…</span>
                  </>
                ) : (
                  <span>Confirm Winner</span>
                )}
              </button>

              <button
                disabled={isConfirming}
                onClick={() => setConfirmAgain(true)}
                className="rounded-lg border border-slate-200 py-2.5 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Spin Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-spin confirmation */}
      {confirmAgain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-xl space-y-3">
            <h4 className="text-base font-semibold text-slate-900">Select another winner?</h4>
            <p className="text-xs text-slate-500 font-normal">
              This will discard the current draw result and spin the randomizer for another participant.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setConfirmAgain(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={resetSpin}
                className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold text-white cursor-pointer"
              >
                Re-spin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prize / Gift Selector Modal */}
      {showPrizeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Choose Gift for Live Draw</h3>
                <p className="text-xs text-slate-400 font-normal">Select any gift to award in this spin</p>
              </div>
              <button onClick={() => setShowPrizeSelector(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 max-h-72 overflow-y-auto">
              {data.prizes.map((p) => {
                const isSelected = p.id === activePrize?.id
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPrize(p.id)}
                    className={`cursor-pointer border p-3 transition flex items-center gap-3 rounded-xl ${
                      isSelected
                        ? 'border-[#FF0B6B] bg-pink-50/50 ring-1 ring-[#FF0B6B]'
                        : 'border-slate-100 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded-lg border border-pink-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                        {isSelected && <Check size={14} className="text-[#FF0B6B] shrink-0" />}
                      </div>
                      <p className="text-xs font-mono font-medium text-[#FF0B6B] mt-0.5">{p.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowPrizeSelector(false)
                  setShowAddPrizeModal(true)
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF0B6B] hover:underline cursor-pointer"
              >
                <Plus size={14} /> Add New Gift
              </button>
              <button
                onClick={() => setShowPrizeSelector(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Gift Modal */}
      {showAddPrizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Add New Gift</h3>
                <p className="text-xs text-slate-400 font-normal">Create a gift instantly for live spinning</p>
              </div>
              <button onClick={() => setShowAddPrizeModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewGift} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase mb-1">Gift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5G Smartphone, Gold Coin, Electric Bike"
                  value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase mb-1">Approximate Value *</label>
                <input
                  type="text"
                  placeholder="e.g. ₹25,000"
                  value={newGift.value}
                  onChange={(e) => setNewGift({ ...newGift, value: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B]"
                />
              </div>

              {/* Photo & Presets */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase mb-1">
                  Gift Photo
                </label>

                <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50/20 p-3 text-center">
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
                        if (res) setNewGift((prev) => ({ ...prev, image: res }))
                      }
                      reader.readAsDataURL(file)
                    }}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={newGift.image} alt="Preview" className="h-12 w-14 object-cover rounded-lg border border-pink-200 bg-white shrink-0" />
                      <p className="text-xs font-medium text-slate-800">Photo Attached</p>
                    </div>

                    <label
                      htmlFor="live-gift-image-upload"
                      className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 text-[#FF0B6B] px-3 py-1.5 text-xs font-medium cursor-pointer transition"
                    >
                      <Upload size={12} /> Upload
                    </label>
                  </div>
                </div>

                <div className="mt-2.5">
                  <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">
                    Or Select Preset:
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto rounded-lg border border-slate-100 p-1.5 bg-white">
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
                        className={`rounded-lg border p-1 text-center transition cursor-pointer ${
                          newGift.image === preset.image ? 'border-[#FF0B6B] bg-pink-50 ring-1 ring-[#FF0B6B]' : 'border-slate-100 hover:border-pink-200'
                        }`}
                      >
                        <img src={preset.image} alt={preset.name} className="h-8 w-full object-cover rounded" />
                        <p className="mt-0.5 text-[8px] truncate font-medium text-slate-700">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPrizeModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                >
                  Save & Use
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
