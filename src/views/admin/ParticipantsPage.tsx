import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOCATIONS } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { formatShortDate, isValidIndianPhone } from '../../lib/format'
import { formatParticipantsForExcelCsv, downloadCsvFile } from '../../lib/exportCsv'
import type { Participant, ParticipantStatus } from '../../types'
import {
  Search,
  Eye,
  Trash2,
  X,
  Trophy,
  Plus,
  Download,
  Users,
  CheckCircle2,
  Sparkles,
  Ticket,
  RotateCcw,
  ArrowLeft,
  User,
} from 'lucide-react'

const PAGE = 10

export function ParticipantsPage() {
  const { data, updateParticipant, deleteParticipant, registerParticipant, getPrize, getDraw } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [winnerFilter, setWinnerFilter] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<Participant | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [addError, setAddError] = useState('')

  // Map of participantId -> winner details
  const winnerMap = useMemo(() => {
    const map = new Map<string, { drawNumber: number; prizeName: string; date: string }>()
    data.winners.forEach((w) => {
      const draw = getDraw(w.drawId)
      const prize = getPrize(w.prizeId)
      map.set(w.participantId, {
        drawNumber: draw?.number ?? 0,
        prizeName: prize?.name ?? 'Prize',
        date: w.date,
      })
    })
    return map
  }, [data.winners, getDraw, getPrize])

  const filtered = useMemo(() => {
    return [...data.participants]
      .sort((a, b) => {
        // 1. Sort latest registered date/time first
        const timeA = new Date(a.createdAt || a.registeredAt || 0).getTime()
        const timeB = new Date(b.createdAt || b.registeredAt || 0).getTime()
        if (timeB !== timeA) return timeB - timeA

        const dateA = a.registeredAt || ''
        const dateB = b.registeredAt || ''
        if (dateB !== dateA) return dateB.localeCompare(dateA)

        return b.id.localeCompare(a.id, undefined, { numeric: true })
      })
      .filter((p) => {
        const isWinner = winnerMap.has(p.id)
        const hit = `${p.name} ${p.phone} ${p.couponId || ''}`.toLowerCase().includes(q.toLowerCase())
        const statusMatch = !status || p.status === status
        const winnerMatch =
          !winnerFilter ||
          (winnerFilter === 'winner' && isWinner) ||
          (winnerFilter === 'eligible' && !isWinner && p.status === 'Active')

        return hit && statusMatch && winnerMatch
      })
  }, [data.participants, q, status, winnerFilter, winnerMap])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE)

  const activeInPoolCount = data.participants.filter(
    (p) => p.status === 'Active' && !winnerMap.has(p.id)
  ).length

  const handleExportCsv = () => {
    const content = formatParticipantsForExcelCsv(filtered)
    downloadCsvFile(content, `Valanchery-Participants-Export-${filtered.length}.csv`)
  }

  const handleResetFilters = () => {
    setQ('')
    setStatus('')
    setWinnerFilter('')
    setPage(1)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    if (!newParticipant.name.trim()) {
      setAddError('Full name is required')
      return
    }
    if (!newParticipant.phone.trim() || !isValidIndianPhone(newParticipant.phone)) {
      setAddError('Please enter a valid 10-digit mobile number')
      return
    }
    const res = await registerParticipant({
      name: newParticipant.name.trim(),
      phone: newParticipant.phone.trim(),
      address: newParticipant.address.trim() || 'Valanchery',
    })
    if (!res.ok) {
      setAddError(res.error)
      return
    }
    setShowAddModal(false)
    setNewParticipant({ name: '', phone: '', address: '' })
  }

  const hasActiveFilters = Boolean(q || status || winnerFilter)

  return (
    <div className="space-y-5 font-sans">
      {/* Header with Title, Back button and Primary Actions */}
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
              Participants Directory
            </h1>
            <p className="mt-0.5 text-xs text-slate-400 font-normal">
              Registry of all festival ticket holders and entrants.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 px-3.5 py-2 text-xs font-medium text-[#FF0B6B] transition shadow-none cursor-pointer"
            title="Export to Excel formatted CSV"
          >
            <Download size={14} /> <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-4 py-2 text-xs font-semibold tracking-wide uppercase text-white shadow-xs shadow-pink-200 transition cursor-pointer"
          >
            <Plus size={14} /> <span>Add Entrant</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Chips */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-[#FF0B6B]">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400">Total Registered</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{data.participants.length} <span className="text-xs font-normal text-slate-400">entries</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-emerald-600">In Live Pool</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">{activeInPoolCount} <span className="text-xs font-normal text-emerald-600/70">eligible</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-amber-600">Past Winners</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-0.5">{data.winners.length} <span className="text-xs font-normal text-amber-600/70">awarded</span></p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xs">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            placeholder="Search coupon, phone, name…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#FF0B6B] focus:bg-white"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={14} />
        </div>

        <select
          value={winnerFilter}
          onChange={(e) => {
            setWinnerFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#FF0B6B] focus:bg-white transition cursor-pointer"
        >
          <option value="">All Draw Eligibility</option>
          <option value="eligible">In Live Pool (Eligible)</option>
          <option value="winner">Past Winners (Excluded)</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#FF0B6B] focus:bg-white transition cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition cursor-pointer"
            title="Clear all filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-slate-100 bg-pink-50/30 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">SL</th>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Coupon ID</th>
                <th className="px-4 py-3.5">Reg. Date</th>
                <th className="px-4 py-3.5">Draw Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p, idx) => {
                const slNo = (page - 1) * PAGE + idx + 1
                const winInfo = winnerMap.get(p.id)
                return (
                  <tr key={p.id} className="hover:bg-pink-50/15 transition-colors font-normal">
                    {/* SL Number */}
                    <td className="w-12 px-4 py-3.5 text-center font-mono text-xs text-slate-400">
                      {slNo}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {p.name || 'Participant'}
                    </td>

                    {/* Number (Phone) */}
                    <td className="px-4 py-3.5 font-mono text-xs font-medium text-slate-700">
                      {p.phone}
                    </td>

                    {/* Coupon ID */}
                    <td className="px-4 py-3.5 font-mono text-xs">
                      {p.couponId ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-pink-100 bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">
                          <Ticket size={12} className="text-[#FF0B6B]" /> {p.couponId}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-normal whitespace-nowrap">
                      {formatShortDate(p.registeredAt || p.createdAt || '')}
                    </td>

                    {/* Draw Status */}
                    <td className="px-4 py-3.5">
                      {winInfo ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                          <Trophy size={11} className="text-amber-600" /> Won Draw #{String(winInfo.drawNumber).padStart(2, '0')}
                        </span>
                      ) : p.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In Live Pool
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-medium text-rose-700">
                          {p.status}
                        </span>
                      )}
                    </td>

                    {/* Actions: View Details & Delete */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setView(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 px-2.5 py-1 text-xs font-medium text-[#FF0B6B] transition cursor-pointer"
                          title="View Participant Profile"
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete entry for "${p.name || p.phone}" permanently?`)) {
                              await deleteParticipant(p.id)
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 px-2.5 py-1 text-xs font-medium transition cursor-pointer"
                          title="Delete participant record"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-slate-400 font-normal">
                    No participants found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary & Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-pink-50/30 px-4 py-3 text-xs text-slate-500 font-normal">
          <p>
            Showing <span className="font-semibold text-slate-800">{filtered.length === 0 ? 0 : (page - 1) * PAGE + 1}</span> to{' '}
            <span className="font-semibold text-slate-800">{Math.min(page * PAGE, filtered.length)}</span> of{' '}
            <span className="font-semibold text-slate-800">{filtered.length}</span> entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-none"
            >
              Prev
            </button>
            <span className="px-2 text-xs font-medium text-slate-600">
              {page} / {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-none"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add Participant (Direct)">
          <form onSubmit={handleAddSubmit} className="space-y-3.5">
            {addError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-medium">
                {addError}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">Full Name *</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                placeholder="e.g. Muhammed Shafi"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">Phone Number *</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                placeholder="10-digit mobile number"
                value={newParticipant.phone}
                onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2.5 text-xs font-semibold tracking-wide uppercase text-white shadow-xs shadow-pink-200 transition cursor-pointer"
              >
                Confirm & Register
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal with Rich Participant Card */}
      {view && (
        <Modal onClose={() => setView(null)} title="Participant Details">
          <div className="space-y-4 text-xs">
            {/* Header Ticket Banner */}
            {view.couponId && (
              <div className="rounded-xl border border-pink-100 bg-pink-50/40 p-3.5 shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Coupon Token ID</p>
                    <span className="inline-flex items-center gap-1 font-mono text-base font-bold text-[#FF0B6B]">
                      <Ticket size={15} /> {view.couponId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {view.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Participant Details Grid */}
            <div className="grid grid-cols-2 gap-3.5 rounded-xl border border-slate-100 bg-white p-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Full Name</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{view.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Phone</p>
                <p className="font-mono text-sm font-semibold text-slate-800 mt-0.5">{view.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Registered On</p>
                <p className="text-xs font-normal text-slate-600 mt-0.5">{formatShortDate(view.registeredAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Pool Status</p>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {view.status} · {view.eligibility}
                </p>
              </div>
            </div>

            {/* Winner Trophy Box if applicable */}
            {winnerMap.has(view.id) && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-amber-950">
                <p className="flex items-center gap-1.5 font-semibold text-amber-900">
                  <Trophy size={14} className="text-amber-600" /> Won Lucky Draw #{winnerMap.get(view.id)?.drawNumber}
                </p>
                <p className="mt-1 text-xs">
                  Prize: <span className="font-semibold text-[#FF0B6B]">{winnerMap.get(view.id)?.prizeName}</span>
                </p>
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setView(null)}
                className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
