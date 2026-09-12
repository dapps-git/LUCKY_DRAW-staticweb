import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Ticket,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  QrCode,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Calendar,
  Filter,
  Check,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../lib/format'
import { formatCouponDisplay } from '../../lib/tokenHelper'

const PAGE_SIZE = 50

export function CouponsDirectoryPage() {
  const { coupons, data } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Unused' | 'Used'>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Map couponId -> participant details for fast lookup
  const participantMap = useMemo(() => {
    const map = new Map<string, typeof data.participants[0]>()
    data.participants.forEach((p) => {
      if (p.couponId) {
        map.set(p.couponId.replace(/[^A-Za-z0-9]/g, '').toUpperCase(), p)
      }
    })
    return map
  }, [data.participants])

  // Aggregate all coupons: coupons list + any participants with couponId that might not be in coupons list
  const allCoupons = useMemo(() => {
    const map = new Map<string, {
      id: string
      batchId?: string
      status: 'Unused' | 'Used'
      createdAt: string
      usedAt?: string
      participantName?: string
      participantPhone?: string
      participantAddress?: string
      participantLocation?: string
      participantTicketId?: string
    }>()

    // 1. Add from coupons list
    ;(coupons || []).forEach((c) => {
      const cleanId = c.id.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
      const p = participantMap.get(cleanId)
      const isUsed = c.status === 'Used' || Boolean(p)

      map.set(cleanId, {
        id: c.id,
        batchId: c.batchId,
        status: isUsed ? 'Used' : 'Unused',
        createdAt: c.createdAt,
        usedAt: c.usedAt || p?.registeredAt,
        participantName: p?.name || c.usedByParticipantName,
        participantPhone: p?.phone || c.usedByParticipantPhone,
        participantAddress: p?.address,
        participantLocation: p?.location,
        participantTicketId: p?.id || c.usedByParticipantId,
      })
    })

    // 2. Also ensure any participant with couponId is included
    data.participants.forEach((p) => {
      if (p.couponId) {
        const cleanId = p.couponId.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        if (!map.has(cleanId)) {
          map.set(cleanId, {
            id: p.couponId,
            status: 'Used',
            createdAt: p.registeredAt,
            usedAt: p.registeredAt,
            participantName: p.name,
            participantPhone: p.phone,
            participantAddress: p.address,
            participantLocation: p.location,
            participantTicketId: p.id,
          })
        }
      }
    })

    return Array.from(map.values())
  }, [coupons, participantMap, data.participants])

  // Filter and sort (latest date first)
  const filteredCoupons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return allCoupons
      .filter((item) => {
        // Status filter (Active = Unused, Inactive = Used)
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false
        }

        // Date filter
        if (dateFilter) {
          const itemDate = (item.usedAt || item.createdAt || '').slice(0, 10)
          if (itemDate !== dateFilter) {
            return false
          }
        }

        // Search query
        if (q) {
          const matchId = item.id.toLowerCase().includes(q)
          const matchName = (item.participantName || '').toLowerCase().includes(q)
          const matchPhone = (item.participantPhone || '').toLowerCase().includes(q)
          const matchLoc = (item.participantLocation || '').toLowerCase().includes(q)
          const matchAddr = (item.participantAddress || '').toLowerCase().includes(q)
          const matchTicket = (item.participantTicketId || '').toLowerCase().includes(q)
          return matchId || matchName || matchPhone || matchLoc || matchAddr || matchTicket
        }

        return true
      })
      .sort((a, b) => {
        // Latest date first
        const dateA = a.usedAt || a.createdAt || ''
        const dateB = b.usedAt || b.createdAt || ''
        return dateB.localeCompare(dateA)
      })
  }, [allCoupons, searchQuery, statusFilter, dateFilter])

  // Counts
  const totalCount = allCoupons.length
  const activeCount = allCoupons.filter((c) => c.status === 'Unused').length
  const usedCount = allCoupons.filter((c) => c.status === 'Used').length

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / PAGE_SIZE))
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCoupons.slice(start, start + PAGE_SIZE)
  }, [filteredCoupons, currentPage])

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(code)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
            Coupons Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Complete list of all generated festival coupons with live registration status, user details, and search.
          </p>
        </div>

        {/* Link back to generator */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/coupons"
            className="flex items-center gap-1.5 rounded-lg border border-black/20 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Ticket size={14} className="text-[#c28e18]" />
            Generate New Batch
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => {
            setStatusFilter('all')
            setCurrentPage(1)
          }}
          className={`cursor-pointer rounded-xl border p-3 sm:p-4 transition ${
            statusFilter === 'all'
              ? 'border-[#7a1426] bg-[#7a1426]/5 shadow-sm'
              : 'border-black/10 bg-white hover:border-black/20'
          }`}
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Coupons</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</p>
        </div>

        <div
          onClick={() => {
            setStatusFilter('Unused')
            setCurrentPage(1)
          }}
          className={`cursor-pointer rounded-xl border p-3 sm:p-4 transition ${
            statusFilter === 'Unused'
              ? 'border-emerald-600 bg-emerald-50 shadow-sm'
              : 'border-black/10 bg-white hover:border-emerald-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Active (Unused)</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-800 mt-0.5">{activeCount}</p>
        </div>

        <div
          onClick={() => {
            setStatusFilter('Used')
            setCurrentPage(1)
          }}
          className={`cursor-pointer rounded-xl border p-3 sm:p-4 transition ${
            statusFilter === 'Used'
              ? 'border-red-500 bg-red-50 shadow-sm'
              : 'border-black/10 bg-white hover:border-red-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-red-700 uppercase tracking-wider">Inactive (Used / Registered)</p>
          <p className="text-xl sm:text-2xl font-bold text-red-800 mt-0.5">{usedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-black/10 bg-white p-3 sm:p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search coupon ID, customer name, mobile, locality..."
              className="w-full rounded-lg border border-slate-300 bg-[#fdfbf7] pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-slate-300 bg-[#fdfbf7] px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#c28e18]"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="Unused">Active / Unused ({activeCount})</option>
              <option value="Used">Inactive / Used ({usedCount})</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-3 flex gap-2">
            <div className="relative flex-1">
              <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-lg border border-slate-300 bg-[#fdfbf7] pl-8 pr-2 py-2 text-xs text-slate-800 outline-none focus:border-[#c28e18]"
              />
            </div>
            {(searchQuery || statusFilter !== 'all' || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setDateFilter('')
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results summary & Pagination header */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <p>
            Showing <span className="font-semibold text-slate-800">{filteredCoupons.length}</span> coupons{' '}
            {filteredCoupons.length > PAGE_SIZE && `(Page ${currentPage} of ${totalPages})`}
          </p>
          <span className="text-[11px] text-slate-400">Sorted: Latest First • 50 per page</span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-black/10 bg-[#fbf8f3] text-[10px] font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Coupon ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered Participant</th>
                <th className="px-4 py-3">Mobile (WhatsApp)</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">QR Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Ticket size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-sm text-slate-700">No coupons found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((item, index) => {
                  const globalIdx = (currentPage - 1) * PAGE_SIZE + index + 1
                  const isUsed = item.status === 'Used'

                  return (
                    <tr
                      key={item.id + index}
                      className={`hover:bg-slate-50/80 transition ${isUsed ? 'bg-white' : 'bg-[#fafcf9]'}`}
                    >
                      {/* Index */}
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{globalIdx}</td>

                      {/* Coupon ID */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold tracking-wider text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {formatCouponDisplay(item.id)}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCouponCode(item.id)}
                            title="Copy code"
                            className="p-1 text-slate-400 hover:text-slate-700 transition"
                          >
                            {copiedId === item.id ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {isUsed ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-700">
                            <XCircle size={11} className="text-red-600" />
                            Inactive • Used
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            Active • Unused
                          </span>
                        )}
                      </td>

                      {/* Registered Participant Name & Ticket ID */}
                      <td className="px-4 py-3">
                        {isUsed ? (
                          <div>
                            <p className="font-semibold text-slate-900 flex items-center gap-1">
                              <User size={12} className="text-[#7a1426]" />
                              {item.participantName || 'Registered Customer'}
                            </p>
                            {item.participantTicketId && (
                              <p className="font-mono text-[10px] font-medium text-[#7a1426] mt-0.5">
                                Ticket: {item.participantTicketId}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">— Not registered yet —</span>
                        )}
                      </td>

                      {/* Mobile Number */}
                      <td className="px-4 py-3 font-mono">
                        {isUsed && item.participantPhone ? (
                          <a
                            href={`tel:${item.participantPhone}`}
                            className="text-slate-800 hover:text-[#7a1426] font-medium flex items-center gap-1"
                          >
                            <Phone size={11} className="text-slate-400" />
                            {item.participantPhone}
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-4 py-3">
                        {isUsed ? (
                          <div className="max-w-xs text-slate-700">
                            <p className="text-xs font-medium text-slate-700 truncate">
                              {item.participantAddress || '—'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-slate-600 text-[11px]">
                        {item.usedAt ? (
                          <div>
                            <span className="font-medium text-slate-800">
                              {formatShortDate(item.usedAt)}
                            </span>
                            <p className="text-[9px] text-slate-400">Registered</p>
                          </div>
                        ) : (
                          <div>
                            <span>{formatShortDate(item.createdAt)}</span>
                            <p className="text-[9px] text-slate-400">Generated</p>
                          </div>
                        )}
                      </td>

                      {/* Action QR */}
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/qr/${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#c28e18] hover:text-[#7a1426] hover:underline"
                        >
                          <QrCode size={12} />
                          <span>QR</span>
                          <ExternalLink size={10} />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (50 per page) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-[#fbf8f3] px-4 py-3">
            <p className="text-xs text-slate-600">
              Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
              <span className="font-bold text-slate-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <ChevronLeft size={13} />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
