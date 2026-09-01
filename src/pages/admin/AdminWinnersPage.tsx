import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDate, maskPhone } from '../../lib/format'
import { LOCATIONS } from '../../data/mockData'
import { Search } from 'lucide-react'

export function AdminWinnersPage() {
  const { data, getParticipant, getPrize, getDraw } = useApp()
  const [q, setQ] = useState('')
  const [prize, setPrize] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const rows = useMemo(() => {
    return [...data.winners].reverse().filter((w) => {
      const p = getParticipant(w.participantId)
      const pr = getPrize(w.prizeId)
      if (!p || !pr) return false
      const hit = `${p.name} ${p.phone} ${pr.name}`.toLowerCase().includes(q.toLowerCase())
      return hit && (!prize || pr.id === prize) && (!location || p.location === location) && (!date || w.date === date)
    })
  }, [data.winners, q, prize, location, date, getParticipant, getPrize])

  return (
    <div>
      <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
        Official Winner Records
      </h1>
      <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
        Logged winners across completed Valanchery Festival 2026 lucky draws
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search winner name or phone…"
            className="w-full border border-black/15 bg-white px-3.5 py-2 text-xs font-light text-black outline-none transition focus:border-[#d4a017] sm:text-sm"
          />
          <Search className="pointer-events-none absolute right-3 top-2.5 text-black/40" size={15} />
        </div>

        <select
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          className="border border-black/15 bg-white px-3 py-2 text-xs font-light text-black outline-none sm:text-sm"
        >
          <option value="">All Prizes</option>
          {data.prizes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-black/15 bg-white px-3 py-2 text-xs font-light text-black outline-none sm:text-sm"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-black/15 bg-white px-3 py-2 text-xs font-light text-black outline-none sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto border border-black/10 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-xs font-light sm:text-sm">
          <thead className="border-b border-black/10 bg-[#f7f0e6] text-[11px] font-medium tracking-wider text-black/60 uppercase">
            <tr>
              <th className="px-4 py-3">Draw</th>
              <th className="px-4 py-3">Draw Date</th>
              <th className="px-4 py-3">Winner Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Prize Awarded</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => {
              const p = getParticipant(w.participantId)
              const pr = getPrize(w.prizeId)
              const d = getDraw(w.drawId)
              if (!p || !pr || !d) return null
              return (
                <tr key={w.id} className="border-b border-black/5 hover:bg-[#faf7f2]">
                  <td className="px-4 py-3 font-mono text-xs font-normal text-[#6b1020]">
                    #{String(d.number).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3 text-black/70">{formatDate(w.date)}</td>
                  <td className="px-4 py-3 font-medium text-[#140d10]">{p.name}</td>
                  <td className="px-4 py-3 text-black/70">{maskPhone(p.phone)}</td>
                  <td className="px-4 py-3 text-black/70">{p.location}</td>
                  <td className="px-4 py-3 text-[#6b1020]">{pr.name}</td>
                  <td className="px-4 py-3">
                    <span className="border border-emerald-600/40 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 uppercase">
                      {w.status}
                    </span>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-black/50">
                  No winner records matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
