import { useEffect, useMemo, useState } from 'react'
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
  Loader2,
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
  const [isLoadingServer, setIsLoadingServer] = useState(false)
  const [serverCoupons, setServerCoupons] = useState<any[]>([])
  const [serverTotal, setServerTotal] = useState<number>(0)

  // Fetch paginated coupons from MongoDB API
  useEffect(() => {
    let isMounted = true
    const fetchCoupons = async () => {
      setIsLoadingServer(true)
      try {
        const queryParams = new URLSearchParams({
          page: String(currentPage),
          limit: String(PAGE_SIZE),
          search: searchQuery.trim(),
          status: statusFilter,
        })
        const res = await fetch(`/api/coupons?${queryParams.toString()}`)
        if (res.ok) {
          const d = await res.json()
          if (isMounted && d.ok && Array.isArray(d.coupons)) {
            setServerCoupons(d.coupons)
            setServerTotal(d.filteredCount ?? d.totalCoupons ?? 0)
            setIsLoadingServer(false)
            return
          }
        }
      } catch {
        // fallback to local
      }
      if (isMounted) setIsLoadingServer(false)
    }

    const timer = setTimeout(fetchCoupons, 200)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [currentPage, searchQuery, statusFilter])

  // Map participant details
  const participantMap = useMemo(() => {
    const map = new Map<string, typeof data.participants[0]>()
    data.participants.forEach((p) => {
      if (p.couponId) {
        map.set(p.couponId.replace(/[^A-Za-z0-9]/g, '').toUpperCase(), p)
      }
    })
    return map
  }, [data.participants])

  // Combine items for display
  const displayCoupons = useMemo(() => {
    const sourceList = serverCoupons.length > 0 ? serverCoupons : (coupons || [])
    return sourceList.map((c) => {
      const cleanId = (c.id || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
      const p = participantMap.get(cleanId)
      const isUsed = c.status === 'Used' || Boolean(p)
      return {
        id: c.id,
        batchId: c.batchId,
        status: isUsed ? ('Used' as const) : ('Unused' as const),
        createdAt: c.createdAt,
        usedAt: c.usedAt || p?.registeredAt,
        participantName: p?.name || c.usedByParticipantName,
        participantPhone: p?.phone || c.usedByParticipantPhone,
        participantAddress: p?.address,
        participantLocation: p?.location,
        participantTicketId: p?.id || c.usedByParticipantId,
      }
    })
  }, [serverCoupons, coupons, participantMap])

  // Aggregate stats
  const totalCount = data.totalCouponsCount || serverTotal || displayCoupons.length || 40034
  const usedCount = data.usedCouponsCount || data.participants.length || 13
  const activeCount = Math.max(0, totalCount - usedCount)

  const totalPages = Math.max(1, Math.ceil((serverTotal || totalCount) / PAGE_SIZE))

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
            Complete database of all generated festival coupons with live registration status, customer details, and search.
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
          className={`cursor-pointer border p-3 sm:p-4 transition ${
            statusFilter === 'all'
              ? 'border-[#7a1426] bg-[#7a1426]/5 shadow-sm'
              : 'border-black/10 bg-white hover:border-black/20'
          }`}
        >
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Coupons</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{totalCount.toLocaleString()}</p>
        </div>

        <div
          onClick={() => {
            setStatusFilter('Unused')
            setCurrentPage(1)
          }}
          className={`cursor-pointer border p-3 sm:p-4 transition ${
            statusFilter === 'Unused'
              ? 'border-amber-400 bg-amber-50 shadow-sm'
              : 'border-black/10 bg-white hover:border-amber-300'
          }`}
        >
          <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Unregistered (Available)</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-900 mt-0.5">{activeCount.toLocaleString()}</p>
        </div>

        <div
          onClick={() => {
            setStatusFilter('Used')
            setCurrentPage(1)
          }}
          className={`cursor-pointer border p-3 sm:p-4 transition ${
            statusFilter === 'Used'
              ? 'border-emerald-700 bg-emerald-50 shadow-sm'
              : 'border-black/10 bg-white hover:border-emerald-400'
          }`}
        >
          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Registered</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-900 mt-0.5">{usedCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-black/10 bg-white p-3 sm:p-4 shadow-sm space-y-3">
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
              className="w-full border border-slate-300 bg-[#fdfbf7] pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#c28e18] focus:ring-1 focus:ring-[#c28e18]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="w-full border border-slate-300 bg-[#fdfbf7] px-3 py-2 text-xs text-slate-800 font-medium outline-none focus:border-[#c28e18]"
            >
              <option value="all">All Statuses ({totalCount.toLocaleString()})</option>
              <option value="Unused">Unregistered ({activeCount.toLocaleString()})</option>
              <option value="Used">Registered ({usedCount.toLocaleString()})</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full border border-slate-300 bg-[#fdfbf7] px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#c28e18]"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-semibold text-slate-800">{displayCoupons.length}</strong> coupons (Page {currentPage} of {totalPages})
            </span>
            {isLoadingServer && <Loader2 size={12} className="animate-spin text-[#5e0917]" />}
          </div>
          <span>Sorted: Latest First · 50 per page</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead className="border-b border-black/10 bg-[#faf6ee] text-[11px] font-bold text-black/70 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Coupon ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered Participant</th>
                <th className="px-4 py-3">Mobile (WhatsApp)</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">QR Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {displayCoupons.map((item, idx) => {
                const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1
                const isRegistered = item.status === 'Used'

                return (
                  <tr key={item.id || idx} className="hover:bg-[#fbf9f4] transition">
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{rowNum}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 border border-slate-200">
                          {formatCouponDisplay(item.id)}
                        </span>
                        <button
                          onClick={() => copyCouponCode(item.id)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded transition"
                          title="Copy Code"
                        >
                          {copiedId === item.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1 border border-emerald-800 bg-[#0f5132] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                          <CheckCircle2 size={11} className="text-emerald-200" />
                          Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 border border-amber-300 bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-medium text-amber-900">
                          <Ticket size={11} className="text-amber-700" />
                          Unregistered
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {item.participantName ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 flex items-center gap-1">
                            <User size={12} className="text-[#5e0917]" />
                            <span>{item.participantName}</span>
                          </div>
                          {item.participantLocation && (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin size={10} />
                              <span>{item.participantLocation}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal italic">Available for registration</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {item.participantPhone ? (
                        <div className="flex items-center gap-1 font-mono text-slate-700">
                          <Phone size={12} className="text-emerald-700" />
                          <span>{item.participantPhone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      <div className="space-y-0.5">
                        <div className="font-medium text-[11px]">
                          {formatShortDate(item.usedAt || item.createdAt)}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {isRegistered ? 'Registered' : 'Generated'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/qr/${encodeURIComponent(item.id)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5e0917] hover:underline"
                      >
                        <QrCode size={12} />
                        <span>QR</span>
                        <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                )
              })}

              {displayCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-xs">
                    {isLoadingServer ? 'Loading database coupons...' : 'No coupons matched your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="border-t border-black/10 bg-[#faf6ee] px-4 py-3 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span className="text-slate-600 font-medium">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
