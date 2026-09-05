import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Check,
  CheckCircle2,
  XCircle,
  Loader2,
  Ticket,
  Camera,
  ArrowRight,
  Home,
  ShieldAlert,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { LOCATIONS } from '../data/mockData'
import { isValidIndianPhone } from '../lib/format'
import { Confetti } from '../components/Confetti'
import { QrScannerModal } from '../components/QrScannerModal'
import { extractCouponId, formatCouponDisplay } from '../lib/tokenHelper'

export function RegisterPage() {
  const { registerParticipant, validateCouponAsync } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Live Token validation state
  const [isValidatingToken, setIsValidatingToken] = useState(false)
  const [tokenStatus, setTokenStatus] = useState<{
    status: 'Idle' | 'Valid' | 'Used' | 'Invalid'
    message: string
  }>({ status: 'Idle', message: '' })

  // Auto-fill and validate coupon from URL query params (e.g. ?coupon=7492018401)
  useEffect(() => {
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

  // Live Token Validator function (Async server + local check)
  const checkToken = async (tokenInput: string) => {
    const clean = extractCouponId(tokenInput) || tokenInput.replace(/\D/g, '').trim()
    if (!clean) {
      setTokenStatus({ status: 'Idle', message: '' })
      return
    }
    if (clean.length !== 10) {
      setTokenStatus({
        status: 'Invalid',
        message: 'Coupon token must be exactly 10 digits.',
      })
      return
    }

    setIsValidatingToken(true)
    try {
      const result = await validateCouponAsync(clean)
      if (result.valid) {
        setTokenStatus({
          status: 'Valid',
          message: 'Valid Festival Coupon! Ready for registration.',
        })
      } else if (result.status === 'Used') {
        setTokenStatus({
          status: 'Used',
          message: result.message || 'This coupon has already been redeemed and cannot be used again.',
        })
      } else {
        setTokenStatus({
          status: 'Invalid',
          message: result.message || 'Invalid coupon token.',
        })
      }
    } catch {
      setTokenStatus({ status: 'Valid', message: 'Coupon ready for entry.' })
    } finally {
      setIsValidatingToken(false)
    }
  }

  const handleCouponChange = (val: string) => {
    const extracted = extractCouponId(val)
    const cleaned = extracted || val.replace(/\D/g, '').slice(0, 10)
    setForm((f) => ({ ...f, couponId: cleaned }))
    checkToken(cleaned)
  }

  const handleScanSuccess = (scannedToken: string) => {
    setForm((f) => ({ ...f, couponId: scannedToken }))
    checkToken(scannedToken)
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
        const check = await validateCouponAsync(cleanToken)
        if (!check.valid) {
          next.couponId = check.message
          setTokenStatus({
            status: check.status === 'Used' ? 'Used' : 'Invalid',
            message: check.message,
          })
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
    <div className="min-h-screen bg-[#f8f6f0] text-slate-900 flex flex-col justify-between overflow-x-hidden select-none">
      <Confetti active={confetti} />

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Clean Mobile-Friendly Top Navbar */}
      <header className="shrink-0 w-full border-b border-black/10 bg-white/90 backdrop-blur-md px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link to="/home" className="flex items-center gap-1.5 font-display text-sm font-semibold tracking-wide text-[#7a1426]">
            Valanchery <span className="text-[#c28e18] font-bold">Festival</span>
          </Link>
          <nav className="flex items-center gap-3 text-[11px] font-medium tracking-wide">
            <Link to="/home" className="text-slate-600 hover:text-black transition">
              Home
            </Link>
            <Link to="/login" className="text-[#7a1426] font-semibold hover:underline transition">
              Check Pass
            </Link>
            <Link
              to="/admin/login"
              className="rounded border border-black/20 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 hover:border-black hover:text-black transition"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Single-Screen Light-Theme Registration Form Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-3 py-3 sm:px-4 max-w-lg mx-auto w-full">
        {/* Card Wrapper */}
        <div className="w-full rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-lg">
          {/* Card Header */}
          <div className="text-center mb-3">
            <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Lucky Draw Registration
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-2.5">
            {/* Coupon / Token ID Section */}
            <div className="rounded-xl border border-[#d4a017]/30 bg-[#fdfbf7] p-2.5">
              <div className="flex items-center justify-between mb-1">
                <label className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[#7a1426] uppercase">
                  <Ticket size={13} className="text-[#c28e18]" /> Coupon Token ID
                </label>
                {!form.couponId && (
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center gap-1 rounded bg-[#c28e18] px-2 py-0.5 text-[10px] font-bold text-white transition hover:bg-[#a67912]"
                  >
                    <Camera size={11} /> Scan QR
                  </button>
                )}
              </div>

              {/* Dynamic Token Display based on verification status */}
              {form.couponId ? (
                <div>
                  {/* Valid Token State */}
                  {tokenStatus.status === 'Valid' && (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-600/30 bg-emerald-50 px-2.5 py-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-mono text-xs font-bold tracking-wider text-emerald-900">
                            {formatCouponDisplay(form.couponId)}
                          </p>
                          <p className="text-[9px] font-medium text-emerald-700">Verified Festival Coupon</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearCoupon}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* ALREADY USED State */}
                  {tokenStatus.status === 'Used' && (
                    <div className="rounded-lg border border-red-500/40 bg-red-50 px-2.5 py-2 text-left">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-1.5">
                          <XCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-mono text-xs font-bold tracking-wider text-red-900">
                              {formatCouponDisplay(form.couponId)}
                            </p>
                            <p className="text-[10px] font-bold text-red-700 mt-0.5">COUPON ALREADY REDEEMED</p>
                            <p className="text-[10px] text-red-600 leading-tight mt-0.5">
                              {tokenStatus.message || 'This coupon has already been used and cannot be registered again.'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={clearCoupon}
                          className="text-[10px] text-red-700 hover:text-red-900 underline font-semibold shrink-0 ml-2"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Invalid Token State */}
                  {tokenStatus.status === 'Invalid' && (
                    <div className="flex items-center justify-between rounded-lg border border-red-500/40 bg-red-50 px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert size={15} className="text-red-600 shrink-0" />
                        <div>
                          <p className="font-mono text-xs font-bold text-red-900">{form.couponId}</p>
                          <p className="text-[9px] text-red-700">{tokenStatus.message || 'Invalid coupon token'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearCoupon}
                        className="text-[10px] text-red-700 underline"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Validating Spinner */}
                  {isValidatingToken && (
                    <div className="flex items-center gap-2 py-1 text-xs text-slate-600">
                      <Loader2 size={13} className="animate-spin text-[#c28e18]" />
                      <span className="text-[10px]">Verifying coupon...</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual Input */
                <div className="relative">
                  <input
                    type="text"
                    value={form.couponId}
                    onChange={(e) => handleCouponChange(e.target.value)}
                    placeholder="10-digit coupon code"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono tracking-wider text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
                  />
                  {isValidatingToken && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      <Loader2 size={13} className="animate-spin text-[#c28e18]" />
                    </div>
                  )}
                </div>
              )}

              {errors.couponId && <p className="mt-1 text-[10px] font-medium text-red-600">{errors.couponId}</p>}
            </div>

            {/* Full Name & Phone in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Your Name"
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
                />
                {errors.name && <p className="mt-0.5 text-[9px] font-medium text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Mobile (WhatsApp) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
                />
                {errors.phone && <p className="mt-0.5 text-[9px] font-medium text-red-600">{errors.phone}</p>}
              </div>
            </div>

            {/* Location dropdown & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Location *
                </label>
                <select
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none transition focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
                >
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="mt-0.5 text-[9px] font-medium text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Address / Locality *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="House / Street"
                  className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
                />
                {errors.address && <p className="mt-0.5 text-[9px] font-medium text-red-600">{errors.address}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1.5">
              <button
                type="submit"
                disabled={tokenStatus.status === 'Used' || tokenStatus.status === 'Invalid' || isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#7a1426] bg-[#7a1426] py-2.5 text-xs font-bold tracking-wider text-white transition hover:bg-[#961a30] shadow-md shadow-[#7a1426]/20 disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>REGISTERING...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT REGISTRATION</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal with direct button to Home page */}
      {successId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-[#d4a017]/40 bg-white p-5 text-center text-slate-900 shadow-2xl animate-fade-up">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check size={20} />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-2">
              Registration Successful!
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              You are officially registered for the Valanchery Festival Lucky Draw.
            </p>

            <div className="my-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
              <div>
                <p className="text-[9px] tracking-widest text-slate-500 uppercase font-semibold">PARTICIPANT ID</p>
                <p className="font-mono text-sm font-bold text-[#7a1426]">{successId}</p>
              </div>
              {registeredCoupon && (
                <div className="border-t border-slate-200 pt-1.5 mt-1.5">
                  <p className="text-[9px] tracking-widest text-slate-500 uppercase font-semibold">COUPON CODE</p>
                  <p className="font-mono text-xs text-slate-800">{formatCouponDisplay(registeredCoupon)}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/home')}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-[#7a1426] bg-[#7a1426] py-2 text-xs font-bold text-white transition hover:bg-[#961a30]"
              >
                <Home size={13} /> GO TO HOME
              </button>
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                VIEW PASS
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Bottom Footer */}
      <footer className="shrink-0 py-2 text-center text-[10px] font-medium text-slate-400">
        Valanchery Festival 2026
      </footer>
    </div>
  )
}
