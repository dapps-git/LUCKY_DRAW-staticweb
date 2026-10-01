import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDate, monthLabel } from '../../lib/format'
import { Plus, X } from 'lucide-react'

export function DrawSchedulePage() {
  const { data, getPrize, addDraw } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    number: data.draws.length + 1,
    date: '2026-12-30',
    prizeId: data.prizes[0]?.id ?? '',
  })

  const groups = useMemo(() => {
    const map = new Map<string, typeof data.draws>()
    ;[...data.draws]
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((d) => {
        const key = monthLabel(d.date)
        map.set(key, [...(map.get(key) ?? []), d])
      })
    return [...map.entries()]
  }, [data.draws])

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Draw Schedule Timeline
          </h1>
          <p className="mt-0.5 text-xs text-slate-400 font-normal">
            Calendar timeline of all lucky draws
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-3.5 py-2 text-xs font-medium text-white transition cursor-pointer"
        >
          <Plus size={14} /> Add Draw
        </button>
      </div>

      <div className="mt-6 space-y-8">
        {groups.map(([month, draws]) => (
          <section key={month}>
            <div className="border-b border-pink-100 pb-2">
              <h2 className="text-sm font-semibold text-[#FF0B6B] uppercase tracking-wider">
                {month}
              </h2>
            </div>
            <div className="relative mt-4 border-l-2 border-pink-200 pl-6 space-y-4">
              {draws.map((d) => {
                const prize = getPrize(d.prizeId)
                return (
                  <div key={d.id} className="relative">
                    <span className="absolute -left-[31px] top-3.5 h-2.5 w-2.5 rounded-full border border-white bg-[#FF0B6B]" />
                    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-[#FF0B6B] uppercase">
                          Draw #{String(d.number).padStart(2, '0')}
                        </p>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase ${
                            d.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-pink-50 text-pink-700 border border-pink-100'
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                      <p className="mt-1 text-base font-semibold text-slate-800">
                        {formatDate(d.date).replace(/ \d{4}/, '')}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 font-normal">
                        Prize: <span className="font-medium text-slate-800">{prize?.name}</span> ({prize?.value})
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-pink-100 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-800">Add Draw to Schedule</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-[#FF0B6B]"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Prize</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-[#FF0B6B]"
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
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-medium text-white transition cursor-pointer"
                onClick={() => {
                  addDraw({ ...form, winnerCount: 1, status: 'Upcoming' })
                  setOpen(false)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

