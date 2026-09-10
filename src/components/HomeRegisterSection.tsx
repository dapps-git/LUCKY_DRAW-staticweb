import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Ticket,
  Camera,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { isValidIndianPhone } from '../lib/format'
import { Confetti } from './Confetti'
import { QrScannerModal } from './QrScannerModal'
import { extractCouponId, formatCouponDisplay } from '../lib/tokenHelper'
import bgWebp from '../assets/bg.webp'
import mobileWebp from '../assets/mobile.webp'

export function HomeRegisterSection() {
  const { registerParticipant, validateCouponAsync } = useApp()

  const [form, setForm] = useState({
    phone: '',
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

  // Auto-fill from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawParam =
      params.get('coupon') ||
      params.get('token') ||
      params.get('id') ||
      params.get('c') ||
      params.get('code')

    const extracted = extractCouponId(rawParam)
    if (extracted) {
      setForm((f) => ({ ...f, couponId: extracted }))
      checkToken(extracted)
    }
  }, [])

  const checkToken = async (tokenInput: string) => {
    const clean = extractCouponId(tokenInput) || tokenInput.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase()
    if (!clean) {
      setTokenStatus({ status: 'Idle', message: '' })
      return
    }
    if (clean.length < 8 || clean.length > 16) {
      setTokenStatus({
        status: 'Invalid',
        message: 'Please enter a valid 13-character coupon code.',
      })
      return
    }

    setIsValidatingToken(true)
    try {
      const result = await validateCouponAsync(clean)
      if (result.valid) {
        setTokenStatus({
          status: 'Valid',
          message: 'Valid Festival Coupon! Ready for entry.',
        })
      } else if (result.status === 'Used') {
        setTokenStatus({
          status: 'Used',
          message: 'This coupon is already taken.',
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
    const cleaned = extracted || val.replace(/[^A-Za-z0-9]/g, '').slice(0, 16).toUpperCase()
    setForm((f) => ({ ...f, couponId: cleaned }))
    checkToken(cleaned)
  }

  const handleScanSuccess = (scannedToken: string) => {
    setForm((f) => ({ ...f, couponId: scannedToken }))
    checkToken(scannedToken)
  }

  const clearCoupon = () => {
    setForm((f) => ({ ...f, couponId: '' }))
    setTokenStatus({ status: 'Idle', message: '' })
  }

  const [formError, setFormError] = useState('')

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setFormError('')
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }
  }

  const resetForm = () => {
    setSuccessId(null)
    setRegisteredCoupon(null)
    setForm({ phone: '', couponId: '' })
    setTokenStatus({ status: 'Idle', message: '' })
    setErrors({})
    setFormError('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setFormError('')

    const next: Record<string, string> = {}

    // 1. Coupon ID validation
    if (!form.couponId.trim()) {
      next.couponId = 'Coupon code is required'
    } else {
      const cleanToken = extractCouponId(form.couponId) || form.couponId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase()
      if (cleanToken.length < 8 || cleanToken.length > 16) {
        next.couponId = 'Please enter a valid 13-character coupon code.'
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

    // 2. Phone validation
    if (!form.phone.trim()) {
      next.phone = 'Mobile number is required'
    } else if (!isValidIndianPhone(form.phone)) {
      next.phone = 'Enter valid 10-digit mobile number'
    }

    setErrors(next)
    if (Object.keys(next).length) return

    setIsSubmitting(true)
    try {
      const cleanToken = extractCouponId(form.couponId) || form.couponId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase()
      const result = await registerParticipant({
        name: `Shopper ${form.phone.trim().slice(-4)}`,
        phone: form.phone.trim(),
        address: 'Valanchery',
        location: 'Valanchery',
        couponId: cleanToken,
      })

      if (!result.ok) {
        if (result.error.toLowerCase().includes('coupon')) {
          setErrors({ couponId: result.error })
          setTokenStatus({ status: 'Used', message: result.error })
        } else if (result.error.toLowerCase().includes('phone') || result.error.toLowerCase().includes('mobile')) {
          setErrors({ phone: result.error })
        } else {
          setFormError(result.error)
        }
        return
      }

      setSuccessId(result.id)
      setRegisteredCoupon(cleanToken)
      setConfetti(true)
      setTimeout(() => setConfetti(false), 4500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="register"
      className="scroll-mt-12 sm:scroll-mt-16 relative py-8 sm:py-12 px-3 sm:px-4 flex flex-col justify-center items-center overflow-hidden border-t border-[#e8decb]"
    >
      {/* Background Image: Mobile Portrait (<640px) */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden z-0"
        style={{
          backgroundImage: `url(${mobileWebp})`,
        }}
      />
      {/* Background Image: Desktop / Tablet (>=640px) */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-[length:100%_100%] hidden sm:block z-0"
        style={{
          backgroundImage: `url(${bgWebp})`,
        }}
      />

      <Confetti active={confetti} />

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Card Wrapper - Compact, Clean, Centered */}
      <div className="relative z-10 w-full max-w-[375px] sm:max-w-[400px] mx-auto my-auto">
        <div className="w-full border border-[#c28e18]/40 bg-white p-5 sm:p-6 shadow-2xl rounded-sm">
          {/* Card Header */}
          <div className="text-center mb-4">
            <h2 className="text-sm sm:text-base font-bold text-[#140d10] tracking-normal">
              Register Your Pass
            </h2>
          </div>

          {successId ? (
            /* Success State */
            <div className="text-center space-y-3 py-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 size={28} />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#140d10]">
                  Registration Confirmed!
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  You are officially entered into the Valanchery Lucky Draw.
                </p>
              </div>

              <div className="border border-[#e8decb] bg-[#faf6ee] p-3 text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Participant ID:</span>
                  <span className="font-mono font-bold text-[#5e0917]">{successId}</span>
                </div>
                {registeredCoupon && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Coupon Token:</span>
                    <span className="font-mono font-bold text-[#8a5b00]">🎫 {registeredCoupon}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-700 font-bold">In Live Pool</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-1.5 border border-[#e8decb] bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  <RotateCcw size={12} /> Register Another
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={submit} className="space-y-4">
              {formError && (
                <div className="border border-red-200 bg-red-50 p-2 text-[11px] text-red-700 font-medium">
                  {formError}
                </div>
              )}

              {/* 1. Coupon Token ID Section */}
              <div className="rounded-none border border-[#d4a017]/50 bg-[#fdfbf7] p-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#720e1e] uppercase">
                    <Ticket size={13} className="text-[#c28e18]" /> COUPON TOKEN ID *
                  </label>
                  {!form.couponId && (
                    <button
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      className="flex items-center gap-1 rounded-none bg-[#c28e18] px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white transition hover:bg-[#a67912] cursor-pointer"
                    >
                      <Camera size={12} /> Scan QR
                    </button>
                  )}
                </div>

                {/* Dynamic Token Display based on verification status */}
                {form.couponId ? (
                  <div>
                    {/* Valid Token State */}
                    {tokenStatus.status === 'Valid' && (
                      <div className="flex items-center justify-between rounded-none border border-emerald-600/30 bg-emerald-50 px-2.5 py-1.5">
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
                          className="text-[10px] text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    )}

                    {/* ALREADY USED State */}
                    {tokenStatus.status === 'Used' && (
                      <div className="rounded-none border border-red-500/40 bg-red-50 px-2.5 py-2 text-left">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-1.5">
                            <XCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-mono text-xs font-bold tracking-wider text-red-900">
                                {formatCouponDisplay(form.couponId)}
                              </p>
                              <p className="text-[10px] font-bold text-red-700 mt-0.5">COUPON IS ALREADY TAKEN</p>
                              <p className="text-[10px] text-red-600 leading-tight mt-0.5">
                                This coupon has already been redeemed.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={clearCoupon}
                            className="text-[10px] text-red-700 underline font-semibold cursor-pointer shrink-0 ml-2"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}

                    {/* INVALID Token State */}
                    {tokenStatus.status === 'Invalid' && (
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={form.couponId}
                            onChange={(e) => handleCouponChange(e.target.value)}
                            placeholder="e.g. 7492018401"
                            className="w-full rounded-none border border-red-300 bg-white px-2.5 py-2 font-mono text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-red-500"
                          />
                          <button
                            type="button"
                            onClick={clearCoupon}
                            className="absolute right-2 top-2 text-[9px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            CLEAR
                          </button>
                        </div>
                        <p className="text-[10px] text-red-600">{tokenStatus.message}</p>
                      </div>
                    )}

                    {/* Idle State */}
                    {tokenStatus.status === 'Idle' && (
                      <input
                        type="text"
                        value={form.couponId}
                        onChange={(e) => handleCouponChange(e.target.value)}
                        placeholder="Enter coupon ID (e.g. 7492018401)"
                        className="w-full rounded-none border border-[#d4a017]/35 bg-white px-3 py-2 font-mono text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#c28e18]"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={form.couponId}
                      onChange={(e) => handleCouponChange(e.target.value)}
                      placeholder="Enter 13-character coupon code"
                      className="w-full rounded-none border border-[#d4a017]/35 bg-white px-3 py-2 font-mono text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#c28e18]"
                    />
                    {isValidatingToken && (
                      <Loader2 size={13} className="animate-spin text-slate-400 absolute right-2.5 top-2.5" />
                    )}
                  </div>
                )}

                {errors.couponId && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.couponId}</p>
                )}
              </div>

              {/* 2. Mobile Phone Number */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-800 mb-1.5 text-left">
                  Mobile Number *
                </label>
                <div className="flex border border-slate-300 focus-within:border-[#720e1e]">
                  <span className="inline-flex items-center rounded-none border-r border-slate-300 bg-[#f7f0e6] px-3 text-xs font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-none bg-white px-3 py-2 font-mono text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-[10px] text-red-600 text-left">{errors.phone}</p>
                )}
                <p className="mt-1 text-[10px] text-slate-500 text-left">
                  Winners are directly notified on this phone number.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none border border-[#500b14] bg-[#610a17] hover:bg-[#720e1e] py-2.5 sm:py-3 text-xs sm:text-[13px] font-bold tracking-wider uppercase text-white shadow-sm transition active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Validating & Entering…</span>
                    </>
                  ) : (
                    <>
                      <span>ENTER LUCKY DRAW</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <ShieldCheck size={13} className="text-[#c28e18]" />
                <span>Official Valanchery Festival 2026 Portal</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
