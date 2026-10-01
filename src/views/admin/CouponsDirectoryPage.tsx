import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Ticket,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Check,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatShortDate } from '../../lib/format'
import { formatCouponDisplay } from '../../lib/tokenHelper'
import { exportCouponsToXlsx } from '../../lib/exportCsv'

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

  const handleDownloadPageExcel = () => {
    if (displayCoupons.length === 0) return
    exportCouponsToXlsx(displayCoupons, `coupons-page-${currentPage}.xlsx`)
  }

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

  // Aggregate stats from active batches
  const batchesTotal = (data.batches || []).reduce((acc, b) => acc + (b.count || 0), 0)
  const totalCount = batchesTotal > 0 ? batchesTotal : (typeof data.totalCouponsCount === 'number' ? data.totalCouponsCount : (serverTotal || 0))
  const usedCount = data.usedCouponsCount ?? data.participants?.length ?? 0
  const activeCount = Math.max(0, totalCount - usedCount)

  // Filtered total count
  const effectiveFilteredCount =
    statusFilter === 'Used'
      ? usedCount
      : statusFilter === 'Unused'
      ? activeCount
      : (searchQuery.trim() ? (serverTotal ?? totalCount) : totalCount)

  const totalPages = Math.max(1, Math.ceil(effectiveFilteredCount / PAGE_SIZE))

  // Combine items for display from real server records
  const displayCoupons = useMemo(() => {
    if (serverCoupons.length > 0) {
      return serverCoupons.map((c) => {
        const cleanId = (c.id || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const cleanSerial = (c.serialNo || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const p = participantMap.get(cleanId) || (cleanSerial ? participantMap.get(cleanSerial) : undefined)
        const isUsed = c.status === 'Used' || Boolean(p)
        return {
          id: c.id,
          serialNo: c.serialNo,
          prefix: c.prefix,
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
    }

    // If local coupons list has items (e.g. from generated batch in current session)
    if (coupons && coupons.length > 0) {
      return coupons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((c) => {
        const cleanId = (c.id || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const cleanSerial = (c.serialNo || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const p = participantMap.get(cleanId) || (cleanSerial ? participantMap.get(cleanSerial) : undefined)
        const isUsed = c.status === 'Used' || Boolean(p)
        return {
          id: c.id,
          serialNo: c.serialNo,
          prefix: c.prefix,
          batchId: c.batchId,
          status: isUsed ? ('Used' as const) : ('Unused' as const),
          createdAt: c.createdAt,
          usedAt: c.usedAt || p?.registeredAt,
          participantName: p?.name || (c as any).usedByParticipantName,
          participantPhone: p?.phone || (c as any).usedByParticipantPhone,
          participantAddress: p?.address,
          participantLocation: p?.location,
          participantTicketId: p?.id || (c as any).usedByParticipantId,
        }
      })
    }

    return []
  }, [serverCoupons, coupons, participantMap, currentPage])

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(code)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-5 font-sans">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Coupons Directory
          </h1>
          <p className="mt-0.5 text-xs text-slate-400 font-normal">
            Database of all generated coupons with registration status and participant details.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPageExcel}
            disabled={displayCoupons.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 text-[#FF0B6B] px-3.5 py-2 text-xs font-medium transition shadow-none disabled:opacity-50 cursor-pointer"
            title="Download Excel spreadsheet for visible coupons"
          >
            <FileSpreadsheet size={14} />
            <span>Export Page ({displayCoupons.length})</span>
          </button>

          <Link
            to="/admin/coupons"
            className="flex items-center gap-1.5 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-3.5 py-2 text-xs font-medium text-white transition shadow-xs shadow-pink-200"
          >
            <Ticket size={14} />
            <span>Generate Batches</span>
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
          className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition ${
            statusFilter === 'all'
              ? 'border-[#FF0B6B] bg-pink-50/50 shadow-xs'
              : 'border-slate-100 bg-white hover:border-pink-200'
          }`}
        >
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Coupons</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalCount.toLocaleString()}</p>
        </div>

        <div
          onClick={() => {
            setStatusFilter('Unused')
            setCurrentPage(1)
          }}
          className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition ${
            statusFilter === 'Unused'
              ? 'border-amber-400 bg-amber-50/60 shadow-xs'
              : 'border-slate-100 bg-white hover:border-amber-300'
          }`}
        >
          <p className="text-[10px] sm:text-[11px] font-medium text-amber-600 uppercase tracking-wider">Available (Unused)</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{activeCount.toLocaleString()}</p>
        </div>

        <div
          onClick={() => {
            setStatusFilter('Used')
            setCurrentPage(1)
          }}
          className={`cursor-pointer rounded-xl border p-3.5 sm:p-4 transition ${
            statusFilter === 'Used'
              ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
              : 'border-slate-100 bg-white hover:border-emerald-300'
          }`}
        >
          <p className="text-[10px] sm:text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Registered</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{usedCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search serial (A000001), code, participant..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 font-medium outline-none focus:border-[#FF0B6B] focus:bg-white transition"
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-slate-700">{displayCoupons.length}</span> coupons (Page {currentPage} of {totalPages})
            </span>
            {isLoadingServer && <Loader2 size={12} className="animate-spin text-[#FF0B6B]" />}
          </div>
          <span>50 per page</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead className="border-b border-slate-100 bg-pink-50/30 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Serial No</th>
                <th className="px-4 py-3">Registration Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered Participant</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayCoupons.map((item, idx) => {
                const rowNum = (currentPage - 1) * PAGE_SIZE + idx + 1
                const isRegistered = item.status === 'Used'

                return (
                  <tr key={item.id || idx} className="hover:bg-pink-50/15 transition font-normal">
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{rowNum}</td>

                    <td className="px-4 py-3">
                      {item.serialNo ? (
                        <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {item.serialNo}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {formatCouponDisplay(item.id)}
                        </span>
                        <button
                          onClick={() => copyCouponCode(item.id)}
                          className="text-slate-400 hover:text-[#FF0B6B] p-1 rounded transition cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedId === item.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                          <Ticket size={11} className="text-amber-500" />
                          Unregistered
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {item.participantName ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <User size={12} className="text-[#FF0B6B]" />
                            <span>{item.participantName}</span>
                          </div>
                          {item.participantLocation && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <MapPin size={10} />
                              <span>{item.participantLocation}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal italic">Available</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {item.participantPhone ? (
                        <div className="flex items-center gap-1 font-mono text-slate-700">
                          <Phone size={11} className="text-emerald-600" />
                          <span>{item.participantPhone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      <div className="space-y-0.5">
                        <div className="font-normal text-[11px]">
                          {formatShortDate(item.usedAt || item.createdAt)}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {isRegistered ? 'Registered' : 'Generated'}
                        </span>
                      </div>
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
          <div className="border-t border-slate-100 bg-pink-50/30 px-4 py-3 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span className="text-slate-500 font-normal">
              Page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
