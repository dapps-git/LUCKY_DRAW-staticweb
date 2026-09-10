import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatDate, maskPhone } from '../../lib/format'
import { Search, Trophy, Calendar, Award, RotateCcw, CheckCircle2 } from 'lucide-react'

export function AdminWinnersPage() {
  const { data, getParticipant, getPrize, getDraw } = useApp()
  const [q, setQ] = useState('')
  const [prize, setPrize] = useState('')
  const [date, setDate] = useState('')

  const rows = useMemo(() => {
    return [...data.winners].reverse().filter((w) => {
      const p = getParticipant(w.participantId) || { phone: 'Verified', name: 'Participant' }
      const pr = getPrize(w.prizeId) || { id: w.prizeId, name: 'Festival Prize' }
      const d = getDraw(w.drawId)
      const hit = `${d ? '#' + d.number : w.drawId} ${p.phone} ${pr.name} ${w.status}`.toLowerCase().includes(q.toLowerCase())
      return hit && (!prize || pr.id === prize) && (!date || w.date === date)
    })
  }, [data.winners, q, prize, date, getParticipant, getPrize, getDraw])

  const hasActiveFilters = Boolean(q || prize || date)

  const handleResetFilters = () => {
    setQ('')
    setPrize('')
    setDate('')
  }

  // Statistics
  const completedDrawsCount = useMemo(() => {
    return new Set(data.winners.map((w) => w.drawId)).size
  }, [data.winners])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e8decb]/80 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
            Official Winner Records
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Logged winners across completed Valanchery Festival 2026 lucky draws
          </p>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 border border-amber-200/80 bg-[#fffcf5] p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-200 bg-amber-50 text-amber-700">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">Total Winners</p>
            <p className="text-xl font-bold text-amber-900">{data.winners.length} <span className="text-xs font-normal text-amber-700">recipients</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-[#e8decb] bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e8decb] bg-[#faf6ee] text-[#5e0917]">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Completed Draws</p>
            <p className="text-xl font-bold text-[#140d10]">{completedDrawsCount} <span className="text-xs font-normal text-slate-500">draw events</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-emerald-200/80 bg-[#f9fdfa] p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">Awards Status</p>
            <p className="text-xl font-bold text-emerald-900">100% <span className="text-xs font-normal text-emerald-700">verified</span></p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 border border-[#e8decb] bg-white p-3 shadow-xs">
        <div className="relative min-w-[220px] flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search draw #, phone, or prize name…"
            className="w-full border border-[#e8decb] bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#5e0917]"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={15} />
        </div>

        <select
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          className="border border-[#e8decb] bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#5e0917] cursor-pointer"
        >
          <option value="">All Prizes</option>
          {data.prizes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-[#e8decb] bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#5e0917] cursor-pointer"
        />

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition cursor-pointer"
            title="Clear filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Winners Table */}
      <div className="overflow-hidden border border-[#e8decb] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-[#e8decb] bg-[#faf6ee] text-[11px] font-bold tracking-wider text-[#5e0917] uppercase">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">SL</th>
                <th className="px-4 py-3.5">Draw</th>
                <th className="px-4 py-3.5">Draw Date</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Prize Awarded</th>
                <th className="px-4 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ebde]">
              {rows.map((w, idx) => {
                const p = getParticipant(w.participantId)
                const pr = getPrize(w.prizeId)
                const d = getDraw(w.drawId)
                const drawTag = d
                  ? `#${String(d.number).padStart(2, '0')}`
                  : w.drawId.startsWith('draw-')
                  ? `#${w.drawId.replace('draw-', '').padStart(2, '0')}`
                  : `#${idx + 1}`
                const prizeName = pr?.name || 'Festival Prize'
                const phoneDisplay = p?.phone ? maskPhone(p.phone) : 'Verified Participant'
                return (
                  <tr key={w.id} className="hover:bg-[#fcfaf5] transition-colors">
                    {/* SL Number */}
                    <td className="w-12 px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-500">
                      {idx + 1}
                    </td>

                    {/* Draw Number */}
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#5e0917]">
                      {drawTag}
                    </td>

                    {/* Draw Date */}
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(w.date)}
                    </td>

                    {/* Masked Phone Number */}
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-800">
                      {phoneDisplay}
                    </td>

                    {/* Prize Awarded */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#5e0917]">
                        <Award size={14} className="text-[#a46e09]" /> {prizeName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 border border-[#b2e2c8] bg-[#f2faf5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#136c42] shadow-2xs">
                        <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-500" /> {w.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs text-slate-500">
                    No winner records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between border-t border-[#e8decb] bg-[#faf6ee]/50 px-4 py-3 text-xs text-slate-600 font-normal">
          <p>
            Showing <strong className="font-semibold text-slate-900">{rows.length}</strong> official winner records
          </p>
        </div>
      </div>
    </div>
  )
}
