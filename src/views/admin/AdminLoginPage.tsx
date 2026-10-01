import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { useApp } from '../../context/AppContext'
import { ADMIN_EMAIL } from '../../data/mockData'
import { api } from '../../lib/api'
import {
  Lock,
  ArrowLeft,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1) // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const ok = await login(email, password)
      if (!ok) {
        setError('Invalid admin credentials. Please check your email and password.')
        setLoading(false)
        return
      }
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true })
      }, 400)
    } catch {
      setError('Login failed. Please check your connection and try again.')
      setLoading(false)
    }
  }



  const openForgotModal = () => {
    setForgotEmail(email || ADMIN_EMAIL)
    setForgotOtp('')
    setNewPassword('')
    setConfirmPassword('')
    setForgotError('')
    setForgotSuccessMessage('')
    setForgotStep(1)
    setShowForgotModal(true)
  }

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotEmail.trim()) {
      setForgotError('Please enter the admin email address')
      return
    }

    setForgotLoading(true)
    try {
      const res = await api.forgotPassword(forgotEmail.trim())
      if (res.ok) {
        setForgotStep(2)
        setForgotSuccessMessage(res.message || `OTP sent to ${forgotEmail.trim()}`)
      } else {
        setForgotError(res.error || 'Failed to send OTP. Please check email address.')
      }
    } catch (err: any) {
      setForgotError(err.message || 'Connection error. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotOtp.trim() || forgotOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit OTP received in your email')
      return
    }

    setForgotLoading(true)
    try {
      const res = await api.verifyOtp(forgotEmail.trim(), forgotOtp.trim())
      if (res.ok) {
        setForgotStep(3)
        setForgotSuccessMessage('OTP verified! Now choose your new admin password.')
      } else {
        setForgotError(res.error || 'Invalid or expired OTP code.')
      }
    } catch (err: any) {
      setForgotError(err.message || 'Verification error. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    if (!newPassword.trim() || newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.')
      return
    }

    setForgotLoading(true)
    try {
      const res = await api.resetPassword(forgotEmail.trim(), forgotOtp.trim(), newPassword.trim())
      if (res.ok) {
        setEmail(forgotEmail.trim())
        setPassword(newPassword.trim())
        setShowForgotModal(false)
        setError('')
        alert('Password reset successfully! Default password (Admin@2026) is now disabled. Please log in with your new password.')
      } else {
        setForgotError(res.error || 'Failed to update password. Please try again.')
      }
    } catch (err: any) {
      setForgotError(err.message || 'Password update failed. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none text-[#1E2937] font-sans bg-gradient-to-br from-[#FFF5F8] via-[#FFF0F5] to-white">
      <Confetti active={success} />
      {success && <div className="pointer-events-none absolute inset-0 bg-white/40 animate-[flash_0.8s_ease] z-40" />}

      {/* Top Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#FF0B6B] transition font-medium"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Center Login Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[380px]">
          {/* White + Pink Card with rounded corners */}
          <div className="bg-white border border-pink-100 p-7 sm:p-8 shadow-lg shadow-pink-500/5 rounded-xl">
            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-[#1E2937] tracking-tight">
                Lucky Draw 2026
              </h1>
              <p className="text-xs text-slate-400 font-normal">
                Admin Authentication
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="mt-6 space-y-4">
              {/* Admin Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Admin Email
                </label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#FF0B6B] transition bg-white">
                  <span className="bg-slate-50 px-3 py-2 text-slate-400 border-r border-slate-200 flex items-center justify-center">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none font-medium bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={openForgotModal}
                    className="text-[11px] font-medium text-[#FF0B6B] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#FF0B6B] transition bg-white">
                  <span className="bg-slate-50 px-3 py-2 text-slate-400 border-r border-slate-200 flex items-center justify-center">
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none font-medium bg-white"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 p-2.5 text-center text-xs text-red-700 rounded-lg font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="border border-emerald-200 bg-emerald-50 p-2.5 text-center text-xs text-emerald-800 flex items-center justify-center gap-1.5 rounded-lg font-medium">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Logging in…</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF0B6B] hover:bg-[#E0095E] py-2.5 text-xs font-semibold tracking-wide text-white uppercase rounded-lg shadow-xs shadow-pink-200 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Verifying…' : 'Access Dashboard'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>


            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password OTP Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm my-auto rounded-2xl border border-pink-100 bg-white p-6 shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <KeyRound size={15} className="text-[#FF0B6B]" />
                <span>Reset Admin Password</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Stepper indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className={`font-medium ${forgotStep === 1 ? 'text-[#FF0B6B] font-semibold' : ''}`}>1. Email</span>
              <span>→</span>
              <span className={`font-medium ${forgotStep === 2 ? 'text-[#FF0B6B] font-semibold' : ''}`}>2. OTP Code</span>
              <span>→</span>
              <span className={`font-medium ${forgotStep === 3 ? 'text-[#FF0B6B] font-semibold' : ''}`}>3. New Password</span>
            </div>

            {forgotError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-1.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccessMessage && !forgotError && (
              <div className="p-2.5 rounded-lg bg-pink-50 border border-pink-200 text-[#FF0B6B] text-xs flex items-start gap-1.5">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[#FF0B6B]" />
                <span>{forgotSuccessMessage}</span>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                    Registered Admin Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@valancheryfestival.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] transition"
                    required
                  />
                  <p className="mt-1 text-[10px] text-slate-400 font-normal">
                    A 6-digit OTP verification code will be sent to this email via Nodemailer.
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <span>Send OTP Code</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-center font-mono text-base tracking-widest font-bold text-[#FF0B6B] outline-none focus:border-[#FF0B6B] transition"
                    required
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Sent to: {forgotEmail}</span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={forgotLoading}
                      className="text-[#FF0B6B] hover:underline cursor-pointer font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || forgotOtp.length !== 6}
                    className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Verifying…</span>
                      </>
                    ) : (
                      <span>Verify Code</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] transition"
                    required
                  />
                </div>

                <p className="text-[10px] text-slate-400 font-normal leading-normal">
                  ⚠️ Once saved, default password (<strong>Admin@2026</strong>) will be disabled permanently. Only your new password will be accepted.
                </p>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(2)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Updating…</span>
                      </>
                    ) : (
                      <span>Save New Password</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[11px] text-slate-400 font-normal">
        Lucky Draw 2026 Admin Portal
      </footer>
    </div>
  )
}
