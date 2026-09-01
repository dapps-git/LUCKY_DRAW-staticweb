import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/format'
import { PRIZE_IMAGES } from '../../data/mockData'
import { Plus, X } from 'lucide-react'

export function LuckyDrawsPage() {
  const { data, getPrize, addDraw } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    number: data.draws.length + 1,
    date: '2026-12-30',
    prizeId: data.prizes[0]?.id ?? '',
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
            Festival Lucky Draws
          </h1>
          <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
            Total 10 scheduled grand prize draws for Valanchery Festival 2026
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 border border-[#6b1020] bg-[#6b1020] px-4 py-2 text-xs font-medium tracking-wider text-white transition hover:bg-[#851629]"
        >
          <Plus size={15} /> CREATE NEW DRAW
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.draws.map((d) => {
          const prize = getPrize(d.prizeId)
          return (
            <article key={d.id} className="border border-black/10 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative h-36 w-full bg-black/60">
                <img
                  src={prize?.image ?? PRIZE_IMAGES.festival}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 border border-[#d4a017] bg-black/70 px-2 py-0.5 text-[10px] font-light text-[#f3d48a]">
                  DRAW #{String(d.number).padStart(2, '0')}
                </div>
                <div className="absolute bottom-2 right-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${
                      d.status === 'Completed'
                        ? 'border border-emerald-500 bg-emerald-950/80 text-emerald-300'
                        : 'border border-[#d4a017] bg-black/80 text-[#f3d48a]'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="font-display text-lg font-light text-[#140d10]">{prize?.name ?? 'Prize'}</h2>
                <p className="mt-1 text-xs font-light text-black/60">Draw Date: {formatDate(d.date)}</p>
                <p className="mt-0.5 text-xs font-light text-black/50">Winners: {d.winnerCount} participant</p>

                <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-xs font-light">
                  <Link to="/admin/lucky-draw" className="text-[#6b1020] underline underline-offset-4">
                    Live Stage →
                  </Link>
                  <span className="text-black/40">{prize?.value}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md border-2 border-black/20 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-display text-lg font-light">Create New Draw</h3>
              <button onClick={() => setOpen(false)} className="text-black/50 hover:text-black">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-black/60 uppercase">Draw Sequence Number</label>
                <input
                  type="number"
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2 outline-none"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-black/60 uppercase">Scheduled Date</label>
                <input
                  type="date"
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2 outline-none"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-black/60 uppercase">Assigned Prize</label>
                <select
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2 outline-none"
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
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border border-black/20 py-2 text-xs font-light text-black hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                className="flex-1 border border-[#6b1020] bg-[#6b1020] py-2 text-xs font-medium text-white hover:bg-[#851629]"
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
