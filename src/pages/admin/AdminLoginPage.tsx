import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { useApp } from '../../context/AppContext'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../data/mockData'
import { Lock, ArrowLeft, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import bgWebp from '../../assets/bg.webp'
import mobileWebp from '../../assets/mobile.webp'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!login(email, password)) {
      setError('Invalid admin credentials. Please try again.')
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/admin/dashboard'), 1000)
  }

  const fillDemoAdmin = () => {
    setEmail(ADMIN_EMAIL)
    setPassword(ADMIN_PASSWORD)
    setError('')
  }

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none text-[#140d10] font-sans admin-scope">
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

      <Confetti active={success} />
      {success && <div className="pointer-events-none absolute inset-0 bg-white/40 animate-[flash_0.8s_ease] z-40" />}

      {/* Top Bar */}
      <header className="relative z-10 w-full px-5 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-800 hover:text-[#720e1e] transition font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back to Festival</span>
        </Link>
        <span className="text-[10px] tracking-[0.25em] text-[#8e6b1b] uppercase font-bold">
          OFFICIAL CONTROL
        </span>
      </header>

      {/* Center Login Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[360px]">
          {/* Sharp Luxury Light Card - Flat No Shadow */}
          <div className="bg-white border border-[#e8decb] p-6 sm:p-7 shadow-none rounded-none">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.25em] text-[#8e6b1b] uppercase">
                <span className="h-px w-3 bg-[#8e6b1b]" />
                ADMIN CONSOLE
                <span className="h-px w-3 bg-[#8e6b1b]" />
              </div>

              <h1 className="text-xl font-bold text-[#140d10] tracking-tight">
                Valanchery Festival
              </h1>
              <p className="text-xs text-slate-500">
                Control Room & Lucky Draw Engine
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="mt-6 space-y-3.5">
              {/* Admin Email */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={13} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@valancheryfestival.com"
                    className="w-full bg-white border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#720e1e] rounded-none shadow-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={13} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#720e1e] rounded-none shadow-none"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="border border-red-300 bg-red-50 p-2.5 text-center text-xs text-red-700 rounded-none">
                  {error}
                </div>
              )}

              {success && (
                <div className="border border-emerald-300 bg-emerald-50 p-2.5 text-center text-xs text-emerald-800 flex items-center justify-center gap-1.5 rounded-none">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Credentials verified. Entering dashboard…</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={success}
                  className="w-full flex items-center justify-center gap-2 bg-[#720e1e] hover:bg-[#891326] py-2.5 text-xs font-bold tracking-wider text-white transition active:scale-[0.99] rounded-none shadow-none disabled:opacity-50 cursor-pointer"
                >
                  <span>ACCESS DASHBOARD</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Auto-fill demo credentials */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-[11px] text-[#720e1e] hover:text-[#891326] transition underline underline-offset-4 font-semibold"
                >
                  Auto-fill demo admin credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[10px] text-slate-500">
        Protected festival system · Authorized committee members only
      </footer>
    </div>
  )
}

