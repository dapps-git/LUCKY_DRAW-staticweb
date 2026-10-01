import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { useApp } from '../../context/AppContext'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../data/mockData'
import { Lock, ArrowLeft, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const ok = await login(email, password)
      if (!ok) {
        setError('Invalid admin credentials. Please check email and password.')
        setLoading(false)
        return
      }
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true })
      }, 400)
    } catch {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  const fillDemoAdmin = () => {
    setEmail(ADMIN_EMAIL)
    setPassword(ADMIN_PASSWORD)
    setError('')
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
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
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

              {/* Auto-fill demo credentials */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-xs text-[#FF0B6B] hover:text-[#E0095E] transition font-medium cursor-pointer"
                >
                  Auto-fill demo credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[11px] text-slate-400 font-normal">
        Lucky Draw 2026 Admin Portal
      </footer>
    </div>
  )
}


