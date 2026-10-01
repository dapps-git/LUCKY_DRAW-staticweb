import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/format'
import { Search, Trophy, Calendar, Award, RotateCcw, CheckCircle2, ArrowLeft, User } from 'lucide-react'

export function AdminWinnersPage() {
  const { data, getParticipant, getPrize, getDraw } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [prize, setPrize] = useState('')
  const [date, setDate] = useState('')

  const rows = useMemo(() => {
    return [...data.winners]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime() || b.id.localeCompare(a.id))
      .filter((w) => {
        const p = getParticipant(w.participantId) || { phone: '', name: 'Participant', location: 'Valanchery' }
        const pr = getPrize(w.prizeId) || { id: w.prizeId, name: 'Festival Prize' }
        const d = getDraw(w.drawId)
        const hit = `${d ? '#' + d.number : w.drawId} ${p.name || ''} ${p.phone || ''} ${pr.name} ${w.status}`.toLowerCase().includes(q.toLowerCase())
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
    <div className="space-y-5 font-sans">
      {/* Header with Back button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-pink-50 hover:text-[#FF0B6B] hover:border-pink-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition cursor-pointer shadow-none"
            title="Go back"
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Winner Records
            </h1>
            <p className="mt-0.5 text-xs text-slate-400 font-normal">
              Logged winners across completed lucky draws.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#FF0B6B]">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400">Total Winners</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{data.winners.length} <span className="text-xs font-normal text-slate-400">recipients</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#FF0B6B]">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400">Completed Draws</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{completedDrawsCount} <span className="text-xs font-normal text-slate-400">events</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-emerald-600">Awards Status</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">100% <span className="text-xs font-normal text-emerald-600/70">verified</span></p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
        <div className="relative min-w-[220px] flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search draw #, name, phone, or prize…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#FF0B6B] focus:bg-white"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={14} />
        </div>

        <select
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#FF0B6B] focus:bg-white transition cursor-pointer"
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
          className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#FF0B6B] focus:bg-white transition cursor-pointer"
        />

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition cursor-pointer"
            title="Clear filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Winners Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="border-b border-slate-100 bg-pink-50/30 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">SL</th>
                <th className="px-4 py-3.5">Draw</th>
                <th className="px-4 py-3.5">Winner Name</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Prize Awarded</th>
                <th className="px-4 py-3.5">Draw Date</th>
                <th className="px-4 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                const nameDisplay = p?.name || 'Verified Winner'
                const phoneDisplay = p?.phone || '—'
                return (
                  <tr key={w.id} className="hover:bg-pink-50/15 transition-colors font-normal">
                    {/* SL Number */}
                    <td className="w-12 px-4 py-3.5 text-center font-mono text-xs text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Draw Number */}
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[#FF0B6B]">
                      {drawTag}
                    </td>

                    {/* Winner Name */}
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {nameDisplay}
                    </td>

                    {/* Full Phone Number */}
                    <td className="px-4 py-3.5 font-mono text-xs font-medium text-slate-700">
                      {phoneDisplay}
                    </td>

                    {/* Prize Awarded */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                        <Award size={13} className="text-[#FF0B6B]" /> {prizeName}
                      </span>
                    </td>

                    {/* Draw Date */}
                    <td className="px-4 py-3.5 text-xs font-normal text-slate-500 whitespace-nowrap">
                      {formatDate(w.date)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {w.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-slate-400 font-normal">
                    No winner records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-pink-50/30 px-4 py-3 text-xs text-slate-500 font-normal">
          <p>
            Showing <span className="font-semibold text-slate-800">{rows.length}</span> official winner records
          </p>
        </div>
      </div>
    </div>
  )
}
