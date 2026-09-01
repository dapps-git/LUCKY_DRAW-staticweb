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
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
      <div className="mb-2 px-3 py-1 text-[10px] tracking-[0.25em] text-[#d4a017] uppercase">MAIN MENU</div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 border-l-2 px-3 py-2.5 text-xs font-light tracking-wide transition ${
              isActive
                ? 'border-[#d4a017] bg-white/10 font-normal text-[#f3d48a]'
                : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}

      <div className="my-3 border-t border-white/10" />

      <Link
        to="/login"
        target="_blank"
        className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2 text-xs font-light text-white/60 hover:bg-white/5 hover:text-white"
      >
        <ExternalLink size={16} />
        Public User Portal
      </Link>

      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/admin/login')
        }}
        className="mt-auto mb-4 flex items-center gap-3 border border-white/10 px-3 py-2.5 text-xs font-light text-white/70 transition hover:border-red-400 hover:bg-red-950/30 hover:text-red-300"
      >
        <LogOut size={16} />
        Logout Admin
      </button>
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#f4eee6] text-[#140d10]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#12080c] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="text-[10px] tracking-[0.3em] text-[#d4a017]">VALANCHERY FESTIVAL</p>
          <p className="font-display text-lg font-light tracking-wider">Control Room 2026</p>
          <p className="mt-0.5 text-[11px] font-light text-white/40">Lucky Draw Management</p>
        </div>
        <div className="flex-1 py-4">{nav}</div>
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-[#12080c] text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-[#d4a017]">VALANCHERY</p>
                <p className="font-display text-base font-light">Festival Control</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-4">{nav}</div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-[#f4eee6]/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="border border-black/15 p-2 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <p className="text-xs font-medium tracking-wide text-[#6b1020] uppercase sm:text-sm">
              Valanchery Festival 2026 · Operations Console
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/register"
              target="_blank"
              className="hidden border border-black/15 px-3 py-1.5 text-xs font-light transition hover:border-[#6b1020] sm:inline-block"
            >
              Public View ↗
            </Link>
            <div className="flex h-8 w-8 items-center justify-center border border-[#6b1020] bg-[#6b1020] text-xs font-normal text-[#f3d48a]">
              A
            </div>
          </div>
        </header>

        <main className="page-enter px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
