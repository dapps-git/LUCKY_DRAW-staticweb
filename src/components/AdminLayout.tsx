import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
  Users,
  Dices,
  Sparkles,
  X,
  ExternalLink,
  QrCode,
  Ticket,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/coupons', label: 'Generate Coupons', icon: QrCode },
  { to: '/admin/coupons-directory', label: 'Coupons Directory', icon: Ticket },
  { to: '/admin/lucky-draw', label: 'Live Draw Stage', icon: Sparkles },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/lucky-draws', label: 'Draw List', icon: Dices },
  { to: '/admin/winners', label: 'Winner History', icon: Trophy },
]

export function AdminLayout() {
  const { logout } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const nav = (
    <div className="flex flex-1 flex-col justify-between px-3">
      <nav className="flex flex-col gap-1">
        <div className="mb-2 px-3 py-1 text-[10px] font-medium tracking-widest text-slate-400 uppercase">
          Control Menu
        </div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-wide transition rounded-lg ${
                isActive
                  ? 'bg-pink-50 text-[#FF0B6B] font-semibold'
                  : 'text-slate-600 hover:bg-pink-50/60 hover:text-[#FF0B6B]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={`shrink-0 ${isActive ? 'text-[#FF0B6B]' : 'text-slate-400'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="my-2 border-t border-slate-100" />

        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 text-xs font-normal text-slate-600 hover:bg-pink-50/60 hover:text-[#FF0B6B] transition rounded-lg"
        >
          <ExternalLink size={15} className="shrink-0 text-[#FF0B6B]" />
          <span>View Public Website</span>
        </Link>
      </nav>

      {/* Admin User Card at bottom of sidebar */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="p-2 bg-pink-50/60 border border-pink-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#FF0B6B] text-white font-medium flex items-center justify-center text-xs shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 leading-tight truncate">Admin</p>
              <p className="text-[10px] text-slate-400 font-normal truncate">Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-[#FF0B6B] hover:bg-pink-100/70 rounded-lg transition cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FCF9FA] text-slate-900 font-sans relative admin-scope">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-100 bg-white lg:flex shadow-xs">
        {/* Brand Header */}
        <div className="border-b border-slate-100 px-6 py-4 flex items-center">
          <p className="text-base font-bold text-slate-800 tracking-tight">2026</p>
        </div>
        <div className="flex-1 py-3 flex flex-col overflow-y-auto">{nav}</div>
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-slate-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <p className="text-base font-bold text-slate-800 tracking-tight">2026</p>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 py-3 flex flex-col overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="border border-slate-200 rounded-lg bg-white p-2 lg:hidden text-slate-700 hover:text-[#FF0B6B] hover:border-pink-200 transition"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#FF0B6B] hover:border-pink-200 rounded-lg transition shadow-none"
            >
              <span>Public Site</span>
              <ExternalLink size={12} />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <div className="flex items-center gap-2 bg-pink-50/70 border border-pink-100 rounded-full px-2.5 py-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF0B6B] text-white text-[10px]">
                  <User size={11} />
                </div>
                <p className="text-xs font-medium text-slate-700 pr-1">Admin</p>
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
