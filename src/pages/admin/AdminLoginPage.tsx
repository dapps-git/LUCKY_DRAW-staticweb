import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Confetti } from '../../components/Confetti'
import { useApp } from '../../context/AppContext'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../data/mockData'
import { Lock, ArrowLeft } from 'lucide-react'

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
    setTimeout(() => navigate('/admin/dashboard'), 1200)
  }

  const fillDemoAdmin = () => {
    setEmail(ADMIN_EMAIL)
    setPassword(ADMIN_PASSWORD)
    setError('')
  }

  return (
    <div className="festival-hero relative flex min-h-screen items-center justify-center px-4 py-8">
      <Confetti active={success} />
      {success && <div className="pointer-events-none absolute inset-0 bg-white/80 animate-[flash_0.8s_ease]" />}

      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-xs font-light tracking-wider text-white/60 transition hover:text-[#f3d48a]"
          >
            <ArrowLeft size={14} /> Back to Public Site
          </Link>
          <span className="text-[10px] tracking-[0.3em] text-[#f3d48a] uppercase">OFFICIAL CONTROL</span>
        </div>

        <div className="border border-white/15 bg-black/45 p-6 shadow-2xl md:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center border border-[#d4a017]/40 bg-[#d4a017]/10 text-[#f3d48a]">
              <Lock size={18} />
            </div>
            <p className="mt-3 text-[10px] tracking-[0.35em] text-[#f3d48a] uppercase">ADMIN CONSOLE</p>
            <h1 className="font-display mt-1 text-2xl font-light tracking-wide text-white sm:text-3xl">
              Valanchery Festival
            </h1>
            <p className="mt-1 text-xs font-light text-white/50">Control Room & Lucky Draw Engine</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-xs font-light tracking-wider text-white/70 uppercase">
              Admin Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@valancheryfestival.com"
                className="mt-1.5 w-full border border-white/20 bg-black/40 px-4 py-3 text-sm font-light text-white placeholder-white/25 outline-none transition focus:border-[#d4a017]"
              />
            </label>

            <label className="block text-xs font-light tracking-wider text-white/70 uppercase">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full border border-white/20 bg-black/40 px-4 py-3 text-sm font-light text-white placeholder-white/25 outline-none transition focus:border-[#d4a017]"
              />
            </label>

            {error && (
              <div className="border border-red-500/40 bg-red-950/30 p-3 text-xs font-light text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="animate-reveal border border-emerald-500/40 bg-emerald-950/30 p-3 text-center text-xs font-light text-emerald-200">
                Credentials verified. Entering control room…
              </div>
            )}

            <button
              type="submit"
              disabled={success}
              className="w-full border border-[#d4a017] bg-[#d4a017] py-3.5 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e] disabled:opacity-50"
            >
              ACCESS DASHBOARD
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-[11px] font-light tracking-wider text-[#f3d48a] underline underline-offset-4 hover:text-white"
              >
                Auto-fill demo admin credentials
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] font-light text-white/30">
          Protected festival system · Authorized committee members only
        </p>
      </div>
    </div>
  )
}
