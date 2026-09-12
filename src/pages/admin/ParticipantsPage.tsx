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
    <div className="space-y-5">
      {/* Header with Title, Back button and Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8decb]/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 border border-[#e8decb] bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
            title="Go back"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
              Participants Directory
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 font-normal">
              Comprehensive registry of all festival ticket holders and draw entrants.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 border border-[#e8decb] bg-white hover:bg-[#faf6ee] px-4 py-2 text-xs font-semibold text-slate-700 transition shadow-xs cursor-pointer active:scale-98"
            title="Export to Excel formatted CSV"
          >
            <Download size={14} className="text-[#5e0917]" /> EXPORT EXCEL (.CSV)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#5e0917] hover:bg-[#720e1e] px-4.5 py-2 text-xs font-bold tracking-wider uppercase text-white shadow-sm shadow-[#5e0917]/25 transition active:scale-98 cursor-pointer"
          >
            <Plus size={14} /> ADD ENTRANT
          </button>
        </div>
      </div>

      {/* Luxury KPI Metric Chips */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 border border-[#e8decb] bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e8decb] bg-[#faf6ee] text-[#5e0917]">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Registered</p>
            <p className="text-xl font-bold text-[#140d10]">{data.participants.length} <span className="text-xs font-normal text-slate-500">entries</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-emerald-200/80 bg-[#f9fdfa] p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">In Live Pool</p>
            <p className="text-xl font-bold text-emerald-900">{activeInPoolCount} <span className="text-xs font-normal text-emerald-700">eligible for draws</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-amber-200/80 bg-[#fffcf5] p-3.5 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-200 bg-amber-50 text-amber-700">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">Past Winners</p>
            <p className="text-xl font-bold text-amber-900">{data.winners.length} <span className="text-xs font-normal text-amber-700">awarded prizes</span></p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 border border-[#e8decb] bg-white p-3 shadow-xs">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            placeholder="Search coupon, phone number, name…"
            className="w-full border border-[#e8decb] bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#5e0917]"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={15} />
        </div>

        <select
          value={winnerFilter}
          onChange={(e) => {
            setWinnerFilter(e.target.value)
            setPage(1)
          }}
          className="border border-[#e8decb] bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#5e0917] cursor-pointer"
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
          className="border border-[#e8decb] bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#5e0917] cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition cursor-pointer"
            title="Clear all filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Table: Showing SL, Name, Phone Number, Coupon ID, Date, Draw Status & Actions */}
      <div className="overflow-hidden border border-[#e8decb] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="border-b border-[#e8decb] bg-[#faf6ee] text-[11px] font-bold tracking-wider text-[#5e0917] uppercase">
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
            <tbody className="divide-y divide-[#f3ebde]">
              {rows.map((p, idx) => {
                const slNo = (page - 1) * PAGE + idx + 1
                const winInfo = winnerMap.get(p.id)
                return (
                  <tr key={p.id} className="hover:bg-[#fcfaf5] transition-colors">
                    {/* SL Number */}
                    <td className="w-12 px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-500">
                      {slNo}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {p.name || 'Participant'}
                    </td>

                    {/* Number (Phone) */}
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900">
                      {p.phone}
                    </td>

                    {/* Coupon ID */}
                    <td className="px-4 py-3.5 font-mono text-xs">
                      {p.couponId ? (
                        <span className="inline-flex items-center gap-1.5 border border-[#e2cca0] bg-[#fffdf7] px-2.5 py-1 text-xs font-bold text-[#8a5b00] shadow-2xs">
                          <Ticket size={13} className="text-[#a46e09]" /> {p.couponId}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 font-medium whitespace-nowrap">
                      {formatShortDate(p.registeredAt || p.createdAt || '')}
                    </td>

                    {/* Draw Status */}
                    <td className="px-4 py-3.5">
                      {winInfo ? (
                        <span className="inline-flex items-center gap-1.5 border border-[#f0cfa0] bg-[#fff9ed] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#915403] shadow-2xs">
                          <Trophy size={13} className="text-[#b46800]" /> Won Draw #{String(winInfo.drawNumber).padStart(2, '0')}
                        </span>
                      ) : p.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 border border-[#b2e2c8] bg-[#f2faf5] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#136c42] shadow-2xs">
                          <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-500" /> In Live Pool
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 shadow-2xs">
                          {p.status}
                        </span>
                      )}
                    </td>

                    {/* Actions: View Details & Delete */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setView(p)}
                          className="inline-flex items-center gap-1 border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
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
                          className="inline-flex items-center gap-1 border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 text-[11px] font-semibold shadow-2xs transition cursor-pointer"
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
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-slate-500">
                    No participants found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary & Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8decb] bg-[#faf6ee]/50 px-4 py-3 text-xs text-slate-600 font-normal">
          <p>
            Showing <strong className="font-semibold text-slate-900">{filtered.length === 0 ? 0 : (page - 1) * PAGE + 1}</strong> to{' '}
            <strong className="font-semibold text-slate-900">{Math.min(page * PAGE, filtered.length)}</strong> of{' '}
            <strong className="font-semibold text-slate-900">{filtered.length}</strong> entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border border-[#e8decb] bg-white hover:bg-[#faf6ee] px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              Prev
            </button>
            <span className="px-2 text-xs font-semibold text-slate-700">
              {page} / {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="border border-[#e8decb] bg-white hover:bg-[#faf6ee] px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
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
              <div className="border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-medium">
                {addError}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Full Name *</label>
              <input
                required
                className="mt-1 w-full border border-[#e8decb] bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                placeholder="e.g. Muhammed Shafi"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Phone Number *</label>
              <input
                required
                className="mt-1 w-full border border-[#e8decb] bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                placeholder="10-digit mobile number"
                value={newParticipant.phone}
                onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Address</label>
              <input
                className="mt-1 w-full border border-[#e8decb] bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                placeholder="House / Street"
                value={newParticipant.address}
                onChange={(e) => setNewParticipant({ ...newParticipant, address: e.target.value })}
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#5e0917] hover:bg-[#720e1e] py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-sm transition cursor-pointer"
              >
                CONFIRM & REGISTER
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
              <div className="border border-[#e2cca0] bg-[#fffdf7] p-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Coupon Token ID</p>
                    <span className="inline-flex items-center gap-1 font-mono text-base font-bold text-[#8a5b00]">
                      <Ticket size={15} /> {view.couponId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 border border-[#b2e2c8] bg-[#f2faf5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#136c42]">
                      <span className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-500" /> {view.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Participant Details Grid */}
            <div className="grid grid-cols-2 gap-3.5 border border-[#e8decb] bg-white p-3.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                <p className="text-sm font-semibold text-[#140d10] mt-0.5">{view.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                <p className="font-mono text-sm font-semibold text-[#140d10] mt-0.5">{view.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{view.address || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered On</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5">{formatShortDate(view.registeredAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pool Status</p>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">
                  {view.status} · {view.eligibility}
                </p>
              </div>
            </div>

            {/* Winner Trophy Box if applicable */}
            {winnerMap.has(view.id) && (
              <div className="border border-[#f0cfa0] bg-[#fff9ed] p-3.5 text-amber-950 shadow-2xs">
                <p className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Trophy size={15} className="text-[#b46800]" /> Won Lucky Draw #{winnerMap.get(view.id)?.drawNumber}
                </p>
                <p className="mt-1 text-xs">
                  Prize: <strong className="font-semibold text-[#5e0917]">{winnerMap.get(view.id)?.prizeName}</strong>
                </p>
                <p className="mt-0.5 text-[11px] text-amber-800">
                  (Excluded from future draws according to the single-prize policy)
                </p>
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setView(null)}
                className="border border-[#e8decb] bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md border border-[#e8decb] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[#e8decb] pb-3">
          <h3 className="text-base font-bold text-[#5e0917]">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
