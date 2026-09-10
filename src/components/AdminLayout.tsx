import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  CalendarClock,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Trophy,
  Upload,
  Users,
  Dices,
  Sparkles,
  X,
  ExternalLink,
  QrCode,
  Ticket,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import bgWebp from '../assets/bg.webp'
import mobileWebp from '../assets/mobile.webp'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/coupons', label: 'Generate Coupons', icon: QrCode },
  { to: '/admin/coupons-directory', label: 'Coupons Directory', icon: Ticket },
  { to: '/admin/lucky-draw', label: 'Live Draw Stage', icon: Sparkles },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/import', label: 'Import Excel', icon: Upload },
  { to: '/admin/lucky-draws', label: 'Draw List', icon: Dices },
  { to: '/admin/winners', label: 'Winner History', icon: Trophy },
  { to: '/admin/prizes', label: 'Prizes Vault', icon: Gift },
  { to: '/admin/draw-schedule', label: 'Schedule', icon: CalendarClock },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const { logout } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      <div className="mb-2 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-[#d4a017] uppercase">
        CONTROL MENU
      </div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-wide transition rounded-sm ${
              isActive
                ? 'bg-[#720e1e] font-semibold text-white shadow-sm border-l-2 border-[#d4a017]'
                : 'text-white/80 hover:bg-white/10 hover:text-white border-l-2 border-transparent'
            }`
          }
        >
          <Icon size={16} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}

      <div className="my-3 border-t border-white/10" />

      <Link
        to="/"
        target="_blank"
        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition rounded-sm"
      >
        <ExternalLink size={16} className="shrink-0 text-[#d4a017]" />
        <span>View Public Website</span>
      </Link>

      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/admin/login')
        }}
        className="mt-auto mb-3 flex items-center gap-3 border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-rose-400 hover:bg-rose-950/40 hover:text-rose-200 cursor-pointer rounded-sm"
      >
        <LogOut size={16} className="shrink-0" />
        <span>Logout Admin</span>
      </button>
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#140d10] font-sans relative admin-scope">
      {/* Background Image: Fixed behind Admin Panel Content for Festival Atmosphere */}
      <div
        className="fixed inset-0 bg-cover bg-center sm:hidden pointer-events-none z-0 opacity-25"
        style={{ backgroundImage: `url(${mobileWebp})` }}
      />
      <div
        className="fixed inset-0 bg-cover bg-center hidden sm:block pointer-events-none z-0 opacity-20"
        style={{ backgroundImage: `url(${bgWebp})` }}
      />

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#d4a017]/25 bg-[#240a10] text-white lg:flex shadow-xl">
        <div className="border-b border-white/10 px-5 py-4 flex items-center gap-3 bg-black/15">
          <div className="w-8 h-8 rounded-sm bg-[#d4a017]/25 border border-[#d4a017]/40 flex items-center justify-center text-[#f3d48a] font-bold text-xs">
            VF
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide leading-tight">Valanchery Festival</p>
            <p className="text-[10px] font-semibold text-[#d4a017]">Admin Portal · 2026</p>
          </div>
        </div>
        <div className="flex-1 py-4 flex flex-col overflow-y-auto">{nav}</div>
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[#d4a017]/25 bg-[#240a10] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-black/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-[#d4a017]/25 border border-[#d4a017]/40 flex items-center justify-center text-[#f3d48a] font-bold text-xs">
                  VF
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide leading-tight">Valanchery Festival</p>
                  <p className="text-[10px] font-semibold text-[#d4a017]">Admin Portal · 2026</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-4 flex flex-col overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e8decb] bg-white/85 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="border border-[#e8decb] bg-white p-2 lg:hidden text-slate-700 hover:text-[#720e1e] transition"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse status-dot" />
              <p className="text-xs font-bold tracking-wider text-[#720e1e] uppercase sm:text-xs">
                VALANCHERY FESTIVAL · ADMIN CONSOLE
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 border border-[#e8decb] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#720e1e] hover:border-[#720e1e] transition shadow-none"
            >
              <span>Public Site</span>
              <ExternalLink size={12} />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex h-7 w-7 items-center justify-center bg-[#720e1e] text-xs font-bold text-[#f3d48a]">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Admin Committee</p>
                <p className="text-[9px] text-slate-500 font-medium">Valanchery Portal</p>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 page-enter px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
