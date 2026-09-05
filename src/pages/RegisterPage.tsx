import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Gift,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Ticket,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { LOCATIONS, NEXT_DRAW_AT } from '../data/mockData'
import { isValidIndianPhone } from '../lib/format'
import { useCountdown } from '../hooks/useCountdown'
import { Confetti } from '../components/Confetti'

export function RegisterPage() {
  const { data, registerParticipant, nextDraw, getPrize, validateCoupon } = useApp()
  const countdown = useCountdown(NEXT_DRAW_AT)
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    location: '',
    couponId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successId, setSuccessId] = useState<string | null>(null)
  const [registeredCoupon, setRegisteredCoupon] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)

  // Live Token validation state
  const [isValidatingToken, setIsValidatingToken] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<{
    status: 'Idle' | 'Valid' | 'Used' | 'Invalid'
    message: string
  }>({ status: 'Idle', message: '' })

  // Auto-fill coupon / token from URL query params (e.g. /register?coupon=7492018401)
  useEffect(() => {
    const queryToken = searchParams.get('coupon') || searchParams.get('token')
    if (queryToken) {
      const cleanToken = queryToken.replace(/\D/g, '').trim()
      setForm((f) => ({ ...f, couponId: cleanToken }))
      checkToken(cleanToken)
    }
  }, [searchParams])

  // Live Token Validator function
  const checkToken = (tokenInput: string) => {
    const clean = tokenInput.replace(/\D/g, '').trim()
    if (!clean) {
      setTokenStatus({ status: 'Idle', message: '' })
      return
    }
    if (clean.length !== 10) {
      setTokenStatus({
        status: 'Invalid',
        message: 'Token ID must be exactly 10 digits.',
      })
      return
    }

    setIsValidatingToken(true)
    setTimeout(() => {
      const result = validateCoupon(clean)
      if (result.valid) {
        setTokenStatus({
          status: 'Valid',
          message: 'Valid Festival Coupon! Ready for entry.',
        })
      } else if (result.status === 'Used') {
        setTokenStatus({
          status: 'Used',
          message: result.message,
        })
      } else {
        setTokenStatus({
          status: 'Invalid',
          message: result.message,
        })
      }
      setIsValidatingToken(false)
    }, 250)
  }

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'couponId') {
      checkToken(value)
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Full name is required'
    if (!form.phone.trim()) next.phone = 'Mobile number is required'
    else if (!isValidIndianPhone(form.phone)) next.phone = 'Please enter a valid 10-digit Indian phone number'
    if (!form.address.trim()) next.address = 'Address is required'
    if (!form.location.trim()) next.location = 'Please select your location'

    // If coupon is entered, ensure it is strictly valid & unused
    if (form.couponId.trim()) {
      const cleanToken = form.couponId.replace(/\D/g, '').trim()
      if (cleanToken.length !== 10) {
        next.couponId = 'Token ID must be exactly 10 digits.'
      } else {
        const check = validateCoupon(cleanToken)
        if (!check.valid) {
          next.couponId = check.message
        }
      }
    }

    setErrors(next)
    if (Object.keys(next).length) return

    const result = registerParticipant({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      location: form.location,
      couponId: form.couponId.trim() || undefined,
    })

    if (!result.ok) {
      setErrors({ phone: result.error })
      return
    }

    setSuccessId(result.id)
    setRegisteredCoupon(form.couponId.trim() || null)
    setConfetti(true)
    setTimeout(() => setConfetti(false), 4500)
  }

  return (
    <div className="festival-hero min-h-screen text-white">
      <Confetti active={confetti} />

      {/* Header Navigation */}
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-white/10 px-3 py-3.5 sm:px-6 md:px-8">
        <Link to="/" className="font-display text-sm tracking-wider sm:text-base md:text-lg whitespace-nowrap">
          Valanchery Festival
        </Link>
        <nav className="flex items-center gap-2 text-[10px] font-light tracking-wider sm:gap-4 sm:text-xs md:gap-6 md:text-sm">
          <Link to="/register" className="border-b border-[#f3d48a] pb-0.5 text-[#f3d48a] whitespace-nowrap">
            REGISTER
          </Link>
          <Link to="/login" className="text-white/70 transition hover:text-[#f3d48a] whitespace-nowrap">
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

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-6 sm:px-6 md:gap-12 md:pb-16 md:pt-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display animate-fade-up text-3xl font-light leading-[1.1] tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">
            VALANCHERY
            <br />
            <span className="font-normal text-[#f3d48a]">FESTIVAL 2026</span>
          </h1>
          <p className="animate-fade-up mt-3 text-base font-light text-white/90 sm:text-lg md:text-xl">
            Celebrate. Participate. Win Big!
          </p>
          <p className="animate-fade-up mt-3 max-w-lg text-xs font-light leading-relaxed text-white/70 sm:text-sm">
            Join the town’s most awaited lucky draw. Register once with your physical festival coupon QR scan to enter grand prize draws.
          </p>

          <div className="animate-fade-up mt-6 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-8">
            <a
              href="#register"
              className="inline-flex items-center gap-2 border border-[#d4a017] bg-[#d4a017] px-6 py-3 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e] sm:text-sm"
            >
              REGISTER COUPON <ArrowRight size={15} />
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/25 bg-black/30 px-5 py-3 text-xs font-light tracking-widest text-white transition hover:border-[#f3d48a] hover:text-[#f3d48a] sm:text-sm"
            >
              CHECK PASS
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-4 text-xs font-light text-white/60">
            <div>
              <p className="font-mono text-sm font-normal text-[#f3d48a]">
                {data.participants.length}
              </p>
              <p className="text-[10px] tracking-wider uppercase">Registered</p>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <p className="font-mono text-sm font-normal text-[#f3d48a]">10 PRIZES</p>
              <p className="text-[10px] tracking-wider uppercase">Live Draws</p>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <p className="font-mono text-sm font-normal text-[#f3d48a]">100% FREE</p>
              <p className="text-[10px] tracking-wider uppercase">Community Entry</p>
            </div>
          </div>
        </div>

        {/* Hero Image Card */}
        <div className="animate-fade-up relative">
          <div className="animate-glow relative border border-[#d4a017]/40 bg-black/40">
            <img
              src="/coupon-template.jpg"
              alt="Valanchery Festival celebration"
              className="h-64 w-full object-cover sm:h-80 md:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0407] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 border border-white/15 bg-black/70 p-4 backdrop-blur-md">
              <p className="flex items-center gap-2 text-xs font-medium tracking-wide sm:text-sm">
                <Sparkles className="text-[#f3d48a]" size={16} /> Official Shopping Festival Coupons
              </p>
              <p className="mt-1 text-[11px] font-light text-white/70 sm:text-xs">
                Next Grand Prize: {prize?.name ?? 'Smartphone'} · Total 10 Grand Draws
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="border border-white/15 bg-black/40 p-5 md:p-8">
          <p className="text-[10px] tracking-[0.35em] text-[#f3d48a] uppercase">NEXT LUCKY DRAW COUNTDOWN</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="font-display text-xl font-light tracking-wide sm:text-2xl md:text-3xl">15 September 2026</p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-light text-white/80 sm:text-base">
                <Gift className="text-[#f3d48a]" size={18} /> Prize: <span className="font-normal text-[#f3d48a]">{prize?.name ?? 'Smartphone'}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-center sm:gap-3">
              {[
                [countdown.days, 'Days'],
                [countdown.hours, 'Hours'],
                [countdown.minutes, 'Minutes'],
                [countdown.seconds, 'Seconds'],
              ].map(([v, l]) => (
                <div key={String(l)} className="min-w-[56px] border border-white/15 bg-black/60 px-2.5 py-2.5 sm:min-w-[72px] sm:px-3 sm:py-3">
                  <p className="font-display text-lg font-light text-[#f3d48a] sm:text-2xl">{String(v).padStart(2, '0')}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/60 sm:text-[10px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="border-t border-black/10 bg-[#f7f0e6] px-4 py-12 text-[#140d10] sm:px-6 md:py-16">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <p className="text-[11px] font-medium tracking-[0.35em] text-[#9b1c32] uppercase">FESTIVAL ENTRY FORM</p>
            <h2 className="font-display mt-2 text-2xl font-light tracking-wide sm:text-3xl md:text-4xl text-[#140d10]">
              Register for the Lucky Draw
            </h2>
            <p className="mt-2 text-xs font-light text-black/60 sm:text-sm">
              Enter your physical coupon token ID or scan the QR code to register.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4 border border-black/10 bg-white p-6 shadow-xl sm:p-8">
            {/* Coupon / Token ID input */}
            <div className="rounded border border-[#d4a017]/40 bg-[#fdfaf5] p-4">
              <label className="block text-xs font-medium tracking-wide uppercase text-black/80">
                <span className="flex items-center gap-1.5">
                  <Ticket size={14} className="text-[#9b1c32]" />
                  10-Digit Coupon / Token ID (from QR scan)
                </span>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    maxLength={10}
                    value={form.couponId}
                    onChange={(e) => set('couponId', e.target.value)}
                    placeholder="e.g. 7492018403"
                    className="w-full border border-black/20 bg-white px-4 py-3 font-mono text-base tracking-widest text-black outline-none transition focus:border-[#d4a017]"
                  />
                  {isValidatingToken && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40">
                      <Loader2 size={18} className="animate-spin text-[#9b1c32]" />
                    </div>
                  )}
                </div>
              </label>

              {/* Token Validation Feedback */}
              {tokenStatus.status !== 'Idle' && !isValidatingToken && (
                <div
                  className={`mt-2.5 flex items-start gap-2 rounded p-2.5 text-xs ${
                    tokenStatus.status === 'Valid'
                      ? 'border border-emerald-500/30 bg-emerald-50 text-emerald-800'
                      : tokenStatus.status === 'Used'
                      ? 'border border-amber-500/30 bg-amber-50 text-amber-800'
                      : 'border border-red-500/30 bg-red-50 text-red-800'
                  }`}
                >
                  {tokenStatus.status === 'Valid' && <CheckCircle2 size={16} className="mt-0.5 text-emerald-600 shrink-0" />}
                  {tokenStatus.status === 'Used' && <Clock size={16} className="mt-0.5 text-amber-600 shrink-0" />}
                  {tokenStatus.status === 'Invalid' && <XCircle size={16} className="mt-0.5 text-red-600 shrink-0" />}
                  <div>
                    <p className="font-medium">
                      {tokenStatus.status === 'Valid' && 'Token Verified!'}
                      {tokenStatus.status === 'Used' && 'Coupon Already Used'}
                      {tokenStatus.status === 'Invalid' && 'Invalid Token'}
                    </p>
                    <p className="text-[11px] opacity-90">{tokenStatus.message}</p>
                  </div>
                </div>
              )}
              {errors.couponId && <p className="mt-1 text-xs font-light text-[#9b1c32]">{errors.couponId}</p>}
            </div>

            <label className="block text-xs font-medium tracking-wide uppercase text-black/70">
              Full Name *
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5 w-full border border-black/15 bg-[#fbf8f3] px-4 py-3 text-sm font-light text-black outline-none transition focus:border-[#d4a017]"
              />
              {errors.name && <p className="mt-1 text-xs font-light text-[#9b1c32]">{errors.name}</p>}
            </label>

            <label className="block text-xs font-medium tracking-wide uppercase text-black/70">
              Mobile Number (WhatsApp) *
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="10-digit mobile number"
                className="mt-1.5 w-full border border-black/15 bg-[#fbf8f3] px-4 py-3 text-sm font-light text-black outline-none transition focus:border-[#d4a017]"
              />
              {errors.phone && <p className="mt-1 text-xs font-light text-[#9b1c32]">{errors.phone}</p>}
            </label>

            <label className="block text-xs font-medium tracking-wide uppercase text-black/70">
              Address *
              <input
                type="text"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="House / Street / Locality"
                className="mt-1.5 w-full border border-black/15 bg-[#fbf8f3] px-4 py-3 text-sm font-light text-black outline-none transition focus:border-[#d4a017]"
              />
              {errors.address && <p className="mt-1 text-xs font-light text-[#9b1c32]">{errors.address}</p>}
            </label>

            <label className="block text-xs font-medium tracking-wide uppercase text-black/70">
              Location / Area *
              <select
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="mt-1.5 w-full border border-black/15 bg-[#fbf8f3] px-4 py-3 text-sm font-light text-black outline-none transition focus:border-[#d4a017]"
              >
                <option value="">Select your location</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-xs font-light text-[#9b1c32]">{errors.location}</p>}
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={tokenStatus.status === 'Used'}
                className="w-full border border-[#6b1020] bg-[#6b1020] py-3.5 text-xs font-medium tracking-widest text-white transition hover:bg-[#851629] disabled:opacity-50 sm:text-sm"
              >
                SUBMIT REGISTRATION
              </button>
            </div>

            <div className="pt-3 text-center text-xs font-light text-black/50">
              Already registered?{' '}
              <Link to="/login" className="text-[#6b1020] underline underline-offset-4">
                Check your ticket pass
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {successId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="animate-reveal w-full max-w-md border-2 border-[#d4a017] bg-white p-6 text-center text-[#140d10] shadow-2xl md:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-emerald-600 bg-emerald-50 text-emerald-600">
              <Check size={24} />
            </div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-[#9b1c32] uppercase mt-3">SUCCESS</p>
            <h3 className="font-display mt-1 text-2xl font-light tracking-wide text-[#140d10]">
              Registration Confirmed!
            </h3>
            <p className="mt-2 text-xs font-light text-black/70">
              You are officially registered for the Valanchery Festival 2026 Lucky Draw.
            </p>
            <div className="my-5 space-y-2 border border-[#d4a017]/40 bg-[#f7f0e6] p-4 text-left">
              <div>
                <p className="text-[10px] tracking-widest text-black/50 uppercase">PARTICIPANT ID</p>
                <p className="font-mono text-lg font-bold text-[#6b1020]">{successId}</p>
              </div>
              {registeredCoupon && (
                <div className="border-t border-black/10 pt-2">
                  <p className="text-[10px] tracking-widest text-black/50 uppercase">LINKED COUPON TOKEN</p>
                  <p className="font-mono text-sm font-medium text-black/80">{registeredCoupon}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/login"
                className="flex-1 border border-[#6b1020] bg-[#6b1020] py-2.5 text-xs font-medium tracking-widest text-white transition hover:bg-[#851629]"
              >
                VIEW DIGITAL PASS
              </Link>
              <button
                onClick={() => setSuccessId(null)}
                className="flex-1 border border-black/20 py-2.5 text-xs font-light tracking-widest text-black/80 transition hover:bg-black/5"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs font-light text-white/40">
        Valanchery Festival 2026 · Official Lucky Draw Committee · Malappuram, Kerala
      </footer>
    </div>
  )
}
