import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QrCode, Search, Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, maskPhone } from '../lib/format'
import type { Participant } from '../types'

export function PublicUserLoginPage() {
  const { data, nextDraw, getPrize, getDraw } = useApp()
  const [query, setQuery] = useState('')
  const [, setSearched] = useState(false)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [error, setError] = useState('')

  const upcomingPrize = nextDraw ? getPrize(nextDraw.prizeId) : undefined

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSearched(true)

    const clean = query.trim().toLowerCase()
    if (!clean) {
      setError('Please enter your Mobile Number or Participant ID')
      setParticipant(null)
      return
    }

    const digitsOnly = clean.replace(/\D/g, '')

    const found = data.participants.find((p) => {
      const matchId = p.id.toLowerCase() === clean
      const matchPhone = digitsOnly && p.phone.replace(/\D/g, '').endsWith(digitsOnly.slice(-10))
      return matchId || matchPhone
    })

    if (found) {
      setParticipant(found)
      setError('')
    } else {
      setParticipant(null)
      setError('No registration found with this phone number or ID. Please check or register now.')
    }
  }

  // Quick demo helper to test with sample participant
  const loadDemoUser = () => {
    const demo = data.participants[0]
    if (demo) {
      setQuery(demo.phone)
      setParticipant(demo)
      setSearched(true)
      setError('')
    }
  }

  return (
    <div className="festival-hero min-h-screen text-white">
      {/* Top Bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 px-3 py-3.5 sm:px-6 md:px-8">
        <Link to="/register" className="font-display text-sm tracking-wider sm:text-base md:text-lg whitespace-nowrap">
          Valanchery Festival
        </Link>
        <nav className="flex items-center gap-2 text-[10px] font-light tracking-wider sm:gap-4 sm:text-xs md:gap-6 md:text-sm">
          <Link to="/register" className="text-white/70 transition hover:text-[#f3d48a] whitespace-nowrap">
            REGISTER
          </Link>
          <Link to="/login" className="border-b border-[#f3d48a] pb-0.5 text-[#f3d48a] whitespace-nowrap">
            CHECK PASS
          </Link>
          <Link to="/winners" className="text-white/70 transition hover:text-[#f3d48a] whitespace-nowrap">
            WINNERS
          </Link>
          <Link
            to="/admin/login"
            className="border border-white/20 px-2 py-0.5 text-[10px] text-white/60 transition hover:border-[#f3d48a] hover:text-[#f3d48a] sm:px-2.5 sm:py-1 sm:text-[11px] whitespace-nowrap"
          >
            ADMIN
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-14">
        {/* Title */}
        <div className="text-center">
          <p className="animate-fade-up text-[11px] tracking-[0.35em] text-[#f3d48a]">PARTICIPANT ACCESS</p>
          <h1 className="font-display animate-fade-up mt-2 text-2xl font-light tracking-wide sm:text-3xl md:text-5xl">
            Check Your Lucky Draw Pass
          </h1>
          <p className="animate-fade-up mt-3 text-xs font-light text-white/70 sm:text-sm md:text-base">
            Enter your 10-digit mobile number or Festival ID to verify your entry and live eligibility.
          </p>
        </div>

        {/* Search Card */}
        <div className="animate-fade-up mx-auto mt-8 max-w-xl border border-white/15 bg-black/40 p-6 md:p-8">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-light tracking-widest text-white/70 uppercase">
                Mobile Number or Participant ID
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. 9876543210 or VF2026-00101"
                    className="w-full border border-white/20 bg-black/50 px-4 py-3 text-sm font-light text-white placeholder-white/30 outline-none transition focus:border-[#d4a017]"
                  />
                  <Search className="pointer-events-none absolute right-3 top-3.5 text-white/40" size={16} />
                </div>
                <button
                  type="submit"
                  className="border border-[#d4a017] bg-[#d4a017] px-6 py-3 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e]"
                >
                  VERIFY PASS
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-red-500/40 bg-red-950/30 p-3 text-xs font-light text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between pt-2 text-xs font-light text-white/50">
              <button
                type="button"
                onClick={loadDemoUser}
                className="text-[#f3d48a] underline underline-offset-4 hover:text-white"
              >
                Auto-fill demo user (Saleel)
              </button>
              <Link to="/register" className="hover:text-white">
                Not registered yet? <span className="text-[#f3d48a]">Register now →</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Digital Ticket Result */}
        {participant && (() => {
          const winRecord = data.winners.find((w) => w.participantId === participant.id)
          const wonPrize = winRecord ? getPrize(winRecord.prizeId) : undefined
          const wonDraw = winRecord ? getDraw(winRecord.drawId) : undefined

          return (
            <div className="animate-reveal mx-auto mt-10 max-w-2xl border-2 border-[#d4a017]/60 bg-gradient-to-b from-[#240b12] to-[#0d0407] p-6 shadow-2xl md:p-8">
              {/* Ticket Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  {winRecord ? (
                    <span className="inline-flex items-center gap-1.5 border border-amber-400/80 bg-amber-400/20 px-2.5 py-1 text-[11px] font-medium tracking-widest text-amber-300 animate-pulse">
                      <Trophy size={13} /> OFFICIAL FESTIVAL WINNER
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 border border-emerald-500/50 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-light tracking-widest text-emerald-300">
                      <ShieldCheck size={13} /> {participant.eligibility.toUpperCase()} · IN LIVE POOL
                    </span>
                  )}
                  <h2 className="font-display mt-3 text-xl font-light tracking-wide text-white md:text-3xl">
                    {participant.name}
                  </h2>
                  <p className="mt-1 text-xs font-light text-white/60">Registered on {formatDate(participant.registeredAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest text-white/40">ENTRY PASS ID</p>
                  <p className="font-mono text-base font-light tracking-wider text-[#f3d48a] md:text-xl">
                    {participant.id}
                  </p>
                </div>
              </div>

              {/* Winner Announcement Banner */}
              {winRecord && wonPrize && (
                <div className="mt-6 border-2 border-[#d4a017] bg-[#2a0d16] p-4 text-center">
                  <p className="text-[10px] tracking-[0.35em] text-[#f3d48a] uppercase">CONGRATULATIONS WINNER</p>
                  <h3 className="font-display mt-1 text-xl text-white sm:text-2xl">
                    Won Draw #{wonDraw ? String(wonDraw.number).padStart(2, '0') : ''} · {wonPrize.name}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-[#f3d48a]">{wonPrize.value}</p>
                  <p className="mt-2 text-xs font-light text-white/60">
                    Confirmed on {formatDate(winRecord.date)} · Contact committee to claim your prize
                  </p>
                </div>
              )}

              {/* Ticket Body Grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="border border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] tracking-widest text-white/40 uppercase">Mobile Number</p>
                  <p className="mt-1 text-sm font-light text-white">{maskPhone(participant.phone)}</p>
                </div>
                <div className="border border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] tracking-widest text-white/40 uppercase">Festival Location</p>
                  <p className="mt-1 text-sm font-light text-white">{participant.location}</p>
                </div>
                <div className="border border-white/10 bg-black/30 p-4 sm:col-span-2">
                  <p className="text-[10px] tracking-widest text-white/40 uppercase">Registered Address</p>
                  <p className="mt-1 text-sm font-light text-white/80">{participant.address}</p>
                </div>
              </div>

              {/* Upcoming Draw Status (only if not won) */}
              {!winRecord && nextDraw && (
                <div className="mt-6 border border-[#d4a017]/30 bg-[#d4a017]/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-light tracking-widest text-[#f3d48a]">
                    <Sparkles size={14} /> ELIGIBLE FOR UPCOMING DRAW
                  </div>
                  <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-light text-white">
                      Draw #{String(nextDraw.number).padStart(2, '0')} · {upcomingPrize?.name ?? 'Grand Prize'}
                    </p>
                    <p className="text-xs font-light text-[#f3d48a]">Draw Date: {formatDate(nextDraw.date)}</p>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
                <div className="flex items-center gap-2 text-xs font-light text-white/60">
                  <QrCode size={16} className="text-[#f3d48a]" /> Verified Digital Entry Pass
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/winners"
                    className="inline-flex items-center gap-1.5 border border-white/20 px-4 py-2 text-xs font-light tracking-wider text-white transition hover:border-[#f3d48a] hover:text-[#f3d48a]"
                  >
                    <Trophy size={13} /> Winners List
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 border border-[#d4a017] bg-[#d4a017] px-4 py-2 text-xs font-medium tracking-wider text-[#140d10] transition hover:bg-[#e5b32e]"
                  >
                    Register Another <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Feature Highlights */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="border border-white/10 bg-black/20 p-6">
            <p className="text-xs font-light tracking-widest text-[#f3d48a]">01. 100% TRANSPARENT</p>
            <h3 className="mt-2 text-sm font-light tracking-wide text-white uppercase">Automated Live Draw</h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-white/60">
              Draws are conducted live with full cryptographic random selection across all eligible entries.
            </p>
          </div>
          <div className="border border-white/10 bg-black/20 p-6">
            <p className="text-xs font-light tracking-widest text-[#f3d48a]">02. MULTIPLE CHANCES</p>
            <h3 className="mt-2 text-sm font-light tracking-wide text-white uppercase">Valid for 10 Grand Draws</h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-white/60">
              One-time registration keeps your ticket eligible for every upcoming festival draw in 2026.
            </p>
          </div>
          <div className="border border-white/10 bg-black/20 p-6">
            <p className="text-xs font-light tracking-widest text-[#f3d48a]">03. INSTANT VERIFICATION</p>
            <h3 className="mt-2 text-sm font-light tracking-wide text-white uppercase">SMS & Portal Tracking</h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-white/60">
              Winners are announced live and verified directly with registered mobile phone numbers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 py-6 text-center text-xs font-light text-white/40">
        Valanchery Festival Lucky Draw 2026 · Malappuram, Kerala
      </footer>
    </div>
  )
}
