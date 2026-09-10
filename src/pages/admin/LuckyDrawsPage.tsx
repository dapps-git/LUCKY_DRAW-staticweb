import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/format'
import { PRIZE_IMAGES } from '../../data/mockData'
import { Plus, X, ArrowRight, Calendar, Users, Sparkles } from 'lucide-react'

export function LuckyDrawsPage() {
  const { data, getPrize, addDraw } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    number: data.draws.length + 1,
    date: new Date().toISOString().slice(0, 10),
    prizeId: data.prizes[0]?.id ?? '',
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8decb]/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
            Festival Lucky Draws
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Total {data.draws.length} scheduled grand prize draws for Valanchery Festival 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/lucky-draw"
            className="inline-flex items-center gap-1.5 rounded-none border border-[#e8decb] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#5e0917] hover:border-[#5e0917] transition shadow-xs"
          >
            <Sparkles size={14} className="text-[#ad823e]" />
            <span>Enter Live Stage</span>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-none bg-[#5e0917] hover:bg-[#720e1e] px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-sm shadow-[#5e0917]/20 transition active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create New Draw</span>
          </button>
        </div>
      </div>

      {/* Grid of Lucky Draws */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.draws.map((d) => {
          const prize = getPrize(d.prizeId)
          const isCompleted = d.status === 'Completed'
          return (
            <article
              key={d.id}
              className="group rounded-none border border-[#e8decb] bg-white shadow-xs hover:shadow-md transition duration-200 flex flex-col overflow-hidden"
            >
              {/* Image Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={prize?.image ?? PRIZE_IMAGES.festival}
                  alt={prize?.name ?? 'Prize'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Draw Tag */}
                <div className="absolute left-3 top-3 rounded-none bg-[#240a10]/85 backdrop-blur-xs border border-[#d4a017]/40 px-2.5 py-1 text-[10px] font-bold text-[#f3d48a] tracking-wider uppercase shadow-xs">
                  DRAW #{String(d.number).padStart(2, '0')}
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-3 right-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-[10px] font-bold tracking-wider uppercase shadow-xs backdrop-blur-xs ${
                      isCompleted
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#140d10] leading-snug truncate">
                    {prize?.name ?? 'Prize'}
                  </h2>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={13} className="text-[#ad823e]" />
                      <span>Draw Date: <strong className="font-semibold text-slate-700">{formatDate(d.date)}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <Users size={13} className="text-[#ad823e]" />
                      <span>Winners: <strong className="font-semibold text-slate-700">{d.winnerCount} participant</strong></span>
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-[#f0e6d6] pt-3.5">
                  <Link
                    to="/admin/lucky-draw"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#5e0917] hover:text-[#720e1e] transition group/btn"
                  >
                    <span>Live Stage</span>
                    <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                  <span className="font-mono text-xs font-bold text-slate-800 bg-[#faf7f0] px-2.5 py-1 rounded-none border border-[#e8decb]">
                    {prize?.value ?? '₹0'}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Create New Draw Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md my-auto rounded-none border border-[#e8decb] bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e8decb] pb-3.5">
              <div>
                <h3 className="text-lg font-bold text-[#140d10]">Create New Draw</h3>
                <p className="text-xs text-slate-500">Schedule a new lucky draw sequence</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                  Draw Sequence Number
                </label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                  Assigned Prize
                </label>
                <select
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                  value={form.prizeId}
                  onChange={(e) => setForm({ ...form, prizeId: e.target.value })}
                >
                  {data.prizes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-2 pt-2 border-t border-[#e8decb]">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-none border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-none bg-[#5e0917] hover:bg-[#720e1e] py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-sm shadow-[#5e0917]/20 transition active:scale-95 cursor-pointer"
                onClick={() => {
                  addDraw({ ...form, winnerCount: 1, status: 'Upcoming' })
                  setOpen(false)
                }}
              >
                Save Draw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
