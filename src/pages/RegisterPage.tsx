import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Check,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Ticket,
  User,
  Phone,
  MapPin,
  Home,
  Camera,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { LOCATIONS } from '../data/mockData'
import { isValidIndianPhone } from '../lib/format'
import { Confetti } from '../components/Confetti'
import { QrScannerModal } from '../components/QrScannerModal'
import { extractCouponId, formatCouponDisplay } from '../lib/tokenHelper'

export function RegisterPage() {
  const { registerParticipant, validateCoupon, nextDraw, getPrize } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    location: 'Valanchery',
    couponId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successId, setSuccessId] = useState<string | null>(null)
  const [registeredCoupon, setRegisteredCoupon] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  // Live Token validation state
  const [isValidatingToken, setIsValidatingToken] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<{
    status: 'Idle' | 'Valid' | 'Used' | 'Invalid'
    message: string
  }>({ status: 'Idle', message: '' })

  // Auto-fill and validate coupon from URL query params (e.g. ?coupon=7492018401 or ?token=... or scanned URL)
  useEffect(() => {
    // Check all possible query keys or entire search string
    const rawParam =
      searchParams.get('coupon') ||
      searchParams.get('token') ||
      searchParams.get('id') ||
      searchParams.get('c') ||
      searchParams.get('code') ||
      window.location.search

    const extracted = extractCouponId(rawParam)
    if (extracted) {
      setForm((f) => ({ ...f, couponId: extracted }))
      checkToken(extracted)
    }
  }, [searchParams])

  // Live Token Validator function
  const checkToken = (tokenInput: string) => {
    const clean = extractCouponId(tokenInput) || tokenInput.replace(/\D/g, '').trim()
    if (!clean) {
      setTokenStatus({ status: 'Idle', message: '' })
      return
    }
    if (clean.length !== 10) {
      setTokenStatus({
        status: 'Invalid',
        message: 'Token must be a 10-digit number.',
      })
      return
    }

    setIsValidatingToken(true)
    setTimeout(() => {
      const result = validateCoupon(clean)
      if (result.valid) {
        setTokenStatus({
          status: 'Valid',
          message: 'Festival Coupon Verified! Ready for registration.',
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
    }, 150)
  }

  const handleCouponChange = (val: string) => {
    // If user pastes full URL or formatted string, extract 10-digit token
    const extracted = extractCouponId(val)
    const cleaned = extracted || val.replace(/\D/g, '').slice(0, 10)
    setForm((f) => ({ ...f, couponId: cleaned }))
    checkToken(cleaned)
  }

  const handleScanSuccess = (scannedToken: string) => {
    setForm((f) => ({ ...f, couponId: scannedToken }))
    checkToken(scannedToken)
    // Also update URL query without refreshing
    setSearchParams({ coupon: scannedToken }, { replace: true })
  }

  const clearCoupon = () => {
    setForm((f) => ({ ...f, couponId: '' }))
    setTokenStatus({ status: 'Idle', message: '' })
    setSearchParams({}, { replace: true })
  }

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Full name is required'
    if (!form.phone.trim()) next.phone = 'Mobile number is required'
    else if (!isValidIndianPhone(form.phone)) next.phone = 'Enter valid 10-digit phone number'
    if (!form.address.trim()) next.address = 'Address / Street is required'
    if (!form.location.trim()) next.location = 'Select location'

    // Validate coupon if entered
    if (form.couponId.trim()) {
      const cleanToken = extractCouponId(form.couponId) || form.couponId.replace(/\D/g, '').trim()
      if (cleanToken.length !== 10) {
        next.couponId = 'Token ID must be 10 digits.'
      } else {
        const check = validateCoupon(cleanToken)
        if (!check.valid) {
          next.couponId = check.message
        }
      }
    }

    setErrors(next)
    if (Object.keys(next).length) return

    setIsSubmitting(true)
    try {
      const result = await registerParticipant({
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="festival-hero min-h-screen sm:h-screen w-full text-white flex flex-col justify-between overflow-x-hidden sm:overflow-hidden select-none">
      <Confetti active={confetti} />

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Top Header Bar */}
      <header className="shrink-0 mx-auto w-full max-w-4xl flex items-center justify-between border-b border-white/10 px-3 py-2 sm:px-6">
        <Link to="/home" className="flex items-center gap-1.5 font-display text-sm tracking-wider sm:text-base text-white">
          <span className="text-[#f3d48a] font-normal">Valanchery</span> Festival
        </Link>
        <nav className="flex items-center gap-2 text-[11px] font-light tracking-wider sm:gap-4 sm:text-xs">
          <Link to="/home" className="text-white/70 hover:text-white transition">
            HOME
          </Link>
          <Link to="/login" className="text-white/70 hover:text-[#f3d48a] transition">
            CHECK PASS
          </Link>
          <Link to="/winners" className="text-white/70 hover:text-[#f3d48a] transition">
            WINNERS
          </Link>
          <Link
            to="/admin/login"
            className="border border-white/20 px-2 py-0.5 text-[10px] text-white/60 hover:text-[#f3d48a] hover:border-[#f3d48a] transition"
          >
            ADMIN
          </Link>
        </nav>
      </header>

      {/* Main Single-Viewport Mobile-Focused Registration Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-3 py-2 sm:px-4 max-w-lg mx-auto w-full">
        {/* Card Wrapper */}
        <div className="w-full rounded-xl border border-[#d4a017]/35 bg-[#14060b]/95 p-3.5 sm:p-5 shadow-2xl backdrop-blur-md">
          {/* Card Header */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#d4a017]/40 bg-[#d4a017]/10 text-[10px] font-medium tracking-widest text-[#f3d48a] uppercase">
              <Sparkles size={11} /> 10 Mega Grand Draws
            </div>
            <h1 className="font-display text-lg sm:text-2xl font-light tracking-wide text-white mt-1">
              Lucky Draw <span className="font-normal text-[#f3d48a]">Registration</span>
            </h1>
            <p className="text-[11px] font-light text-white/60 leading-tight">
              Next Prize: <span className="text-[#f3d48a]">{prize?.name ?? 'Smartphone'}</span> · Enter details below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-2.5 sm:space-y-3">
            {/* Coupon / Token ID Section */}
            <div className="rounded-lg border border-[#d4a017]/40 bg-[#250d15]/80 p-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1 text-[11px] font-medium tracking-wider text-[#f3d48a] uppercase">
                  <Ticket size={13} /> Coupon Token ID
                </label>
                {!form.couponId && (
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center gap-1 rounded bg-[#d4a017] px-2 py-0.5 text-[10px] font-bold text-black transition hover:bg-[#e5b32e]"
                  >
                    <Camera size={11} /> Scan QR
                  </button>
                )}
              </div>

              {/* If token is already present (e.g. from QR scan) */}
              {form.couponId ? (
                <div className="mt-1.5 flex items-center justify-between rounded border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-mono text-xs sm:text-sm font-bold tracking-wider text-emerald-300">
                        {formatCouponDisplay(form.couponId)}
                      </p>
                      <p className="text-[9px] text-emerald-400/80">Coupon Token Linked</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearCoupon}
                    className="text-[10px] text-white/60 hover:text-white underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                /* Manual Input */
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={form.couponId}
                    onChange={(e) => handleCouponChange(e.target.value)}
                    placeholder="10-digit coupon ID (e.g. 7492018403)"
                    className="w-full rounded border border-white/20 bg-black/60 px-3 py-1.5 text-xs sm:text-sm font-mono tracking-wider text-white placeholder-white/30 outline-none transition focus:border-[#d4a017]"
                  />
                  {isValidatingToken && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      <Loader2 size={14} className="animate-spin text-[#f3d48a]" />
                    </div>
                  )}
                </div>
              )}

              {/* Status feedback */}
              {tokenStatus.status !== 'Idle' && !isValidatingToken && !form.couponId && (
                <p
                  className={`mt-1 text-[10px] ${
                    tokenStatus.status === 'Valid'
                      ? 'text-emerald-400'
                      : tokenStatus.status === 'Used'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {tokenStatus.message}
                </p>
              )}
              {errors.couponId && <p className="mt-1 text-[10px] text-red-400">{errors.couponId}</p>}
            </div>

            {/* Full Name & Phone in 2 cols or compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <div>
                <label className="block text-[10px] font-light tracking-wider text-white/70 uppercase">
                  Full Name *
                </label>
                <div className="relative mt-0.5">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full rounded border border-white/15 bg-black/50 px-2.5 py-1.5 text-xs text-white placeholder-white/30 outline-none transition focus:border-[#d4a017]"
                  />
                </div>
                {errors.name && <p className="mt-0.5 text-[9px] text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-light tracking-wider text-white/70 uppercase">
                  Mobile (WhatsApp) *
                </label>
                <div className="relative mt-0.5">
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full rounded border border-white/15 bg-black/50 px-2.5 py-1.5 text-xs font-mono text-white placeholder-white/30 outline-none transition focus:border-[#d4a017]"
                  />
                </div>
                {errors.phone && <p className="mt-0.5 text-[9px] text-red-400">{errors.phone}</p>}
              </div>
            </div>

            {/* Location dropdown & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <div>
                <label className="block text-[10px] font-light tracking-wider text-white/70 uppercase">
                  Location / Area *
                </label>
                <select
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  className="mt-0.5 w-full rounded border border-white/15 bg-[#1a070e] px-2.5 py-1.5 text-xs text-white outline-none transition focus:border-[#d4a017]"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l} className="bg-[#18090f] text-white">
                      {l}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="mt-0.5 text-[9px] text-red-400">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-light tracking-wider text-white/70 uppercase">
                  Address / Locality *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="House / Street"
                  className="mt-0.5 w-full rounded border border-white/15 bg-black/50 px-2.5 py-1.5 text-xs text-white placeholder-white/30 outline-none transition focus:border-[#d4a017]"
                />
                {errors.address && <p className="mt-0.5 text-[9px] text-red-400">{errors.address}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={tokenStatus.status === 'Used' || isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 rounded border border-[#d4a017] bg-gradient-to-r from-[#d4a017] to-[#e5b32e] py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-widest text-[#140d10] transition hover:brightness-110 shadow-lg shadow-[#d4a017]/25 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>REGISTERING...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT REGISTRATION</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Bottom Quick Links */}
            <div className="flex items-center justify-between text-[10px] font-light text-white/60 pt-1">
              <Link to="/login" className="text-[#f3d48a] hover:underline">
                Check Pass Status →
              </Link>
              <Link to="/winners" className="text-white/60 hover:text-white">
                View Past Winners
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {successId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm">
          <div className="animate-reveal w-full max-w-sm rounded-xl border-2 border-[#d4a017] bg-[#1a080f] p-5 text-center text-white shadow-2xl">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500 bg-emerald-950/60 text-emerald-400">
              <Check size={22} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#f3d48a] uppercase mt-2.5">CONFIRMED</p>
            <h3 className="font-display text-xl font-light tracking-wide text-white mt-0.5">
              Registration Successful!
            </h3>
            <p className="mt-1 text-[11px] font-light text-white/70">
              You are entered in all 10 Valanchery Festival lucky draws.
            </p>

            <div className="my-3 space-y-1.5 rounded-lg border border-[#d4a017]/40 bg-black/50 p-3 text-left">
              <div>
                <p className="text-[9px] tracking-widest text-white/40 uppercase">PARTICIPANT ID</p>
                <p className="font-mono text-base font-bold text-[#f3d48a]">{successId}</p>
              </div>
              {registeredCoupon && (
                <div className="border-t border-white/10 pt-1">
                  <p className="text-[9px] tracking-widest text-white/40 uppercase">LINKED COUPON TOKEN</p>
                  <p className="font-mono text-xs text-white/90">{formatCouponDisplay(registeredCoupon)}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                to="/login"
                className="flex-1 rounded border border-[#d4a017] bg-[#d4a017] py-2 text-xs font-bold tracking-wider text-black transition hover:bg-[#e5b32e]"
              >
                VIEW PASS
              </Link>
              <button
                onClick={() => setSuccessId(null)}
                className="flex-1 rounded border border-white/20 py-2 text-xs font-light tracking-wider text-white/80 transition hover:bg-white/10"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Minimal Footer */}
      <footer className="shrink-0 py-1.5 text-center text-[10px] font-light text-white/40 border-t border-white/5">
        Valanchery Festival 2026 · Lucky Draw Entry Portal
      </footer>
    </div>
  )
}
