import { Link } from 'react-router-dom'
import { AnimatedNumber } from '../../components/AnimatedNumber'
import { useApp } from '../../context/AppContext'
import { formatDate, formatShortDate, maskPhone } from '../../lib/format'
import { exportCouponsToXlsx } from '../../lib/exportCsv'
import { Sparkles, ArrowRight, Trophy, Ticket, Layers, Download, CheckCircle2, ListFilter } from 'lucide-react'

export function DashboardPage() {
  const { data, coupons, batches, nextDraw, getPrize, getParticipant, getDraw, eligibleParticipants } = useApp()
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
  const recent = [...data.winners]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime() || b.id.localeCompare(a.id))
    .slice(0, 5)

  const allCoupons = coupons || []
  const allBatches = batches || data.batches || []
  const usedCount = allCoupons.filter((c) => c.status === 'Used').length || data.participants.length
  const totalCouponsCount = allCoupons.length > 0 ? allCoupons.length : allBatches.reduce((acc, b) => acc + (b.count || 0), 0) || 10034
  const unusedCount = Math.max(0, totalCouponsCount - usedCount)

  const handleDownloadBatch = (batchId: string, batchName: string) => {
    const batchCoupons = allCoupons.filter((c) => c.batchId === batchId)
    if (batchCoupons.length === 0) {
      alert('Generating export for batch ' + batchId)
    }
    const activeBase = typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com'
    exportCouponsToXlsx(batchCoupons, `${batchName.replace(/\s+/g, '_')}.xlsx`, activeBase)
  }

  const cards = [
    { label: 'Total Prepared Coupons', value: totalCouponsCount, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-300' },
    { label: 'Available (Unused)', value: unusedCount, color: 'text-amber-800', bg: 'bg-amber-50/50', border: 'border-amber-300' },
    { label: 'Registered Participants', value: data.participants.length, color: 'text-emerald-800', bg: 'bg-emerald-50/50', border: 'border-emerald-300' },
    { label: 'Prepared Batches', value: allBatches.length, color: 'text-[#5e0917]', bg: 'bg-white', border: 'border-black/10' },
    { label: 'Total Lucky Draws', value: data.draws.length, color: 'text-slate-900', bg: 'bg-white', border: 'border-black/10' },
    { label: 'Confirmed Winners', value: data.winners.length, color: 'text-[#5e0917]', bg: 'bg-white', border: 'border-black/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
            Festival Operations Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Real-time live summary of prepared coupon batches, participant registrations, and lucky draws.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/coupons-directory"
            className="flex items-center gap-1.5 border border-[#5e0917] bg-[#5e0917] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#7e0c1f] transition shadow-sm"
          >
            <ListFilter size={14} />
            <span>Coupons Directory</span>
          </Link>
          <Link
            to="/admin/coupons"
            className="flex items-center gap-1.5 border border-black/20 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Ticket size={14} className="text-[#c28e18]" />
            <span>Generate Batches</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className={`border ${c.border} ${c.bg} p-4 shadow-sm`}>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase">{c.label}</p>
            <p className={`mt-2 text-2xl sm:text-3xl font-bold ${c.color}`}>
              <AnimatedNumber value={c.value} />
            </p>
          </div>
        ))}
      </div>

      {/* Prepared Coupon Batches in MongoDB Section */}
      <div className="border border-[#e8decb] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#e8decb] bg-[#faf6ee] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5e0917] uppercase tracking-wider">
            <Layers size={16} className="text-[#a46e09]" />
            <span>Prepared Coupon Batches in Database ({allBatches.length} Batches)</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-600">
              Total Database Tokens: <strong className="font-bold text-slate-900">{totalCouponsCount} pcs</strong>
            </span>
            <Link
              to="/admin/coupons"
              className="text-[#5e0917] font-semibold underline hover:text-[#9b1c32]"
            >
              + Create New Batch
            </Link>
          </div>
        </div>

        {allBatches.length > 0 ? (
          <div className="divide-y divide-[#f3ebde]">
            {allBatches.map((b, idx) => {
              const batchCoupons = allCoupons.filter((c) => c.batchId === b.id)
              const count = b.count || batchCoupons.length
              const usedInBatch = batchCoupons.filter((c) => c.status === 'Used').length || (b.usedCount || 0)
              const unusedInBatch = Math.max(0, count - usedInBatch)

              return (
                <div
                  key={b.id || idx}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fcfaf5] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#140d10]">{b.name || `Batch #${idx + 1}`}</span>
                      <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-200">
                        {b.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span>
                        Created: <strong className="font-semibold text-slate-800">{formatShortDate(b.createdAt)}</strong>
                      </span>
                      <span>
                        Total: <strong className="font-bold text-emerald-800">{count} pcs</strong>
                      </span>
                      <span className="text-slate-500">
                        ({usedInBatch} registered · {unusedInBatch} available)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/coupons-directory`}
                      className="inline-flex items-center justify-center gap-1 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
                    >
                      View Tokens
                    </Link>
                    <button
                      onClick={() => handleDownloadBatch(b.id, b.name || `Batch_${idx + 1}`)}
                      className="inline-flex items-center justify-center gap-1.5 border border-[#5e0917] bg-[#5e0917] hover:bg-[#7e0c1f] px-3.5 py-1.5 text-xs font-semibold text-white transition cursor-pointer"
                      title="Download Excel Sheet for this batch"
                    >
                      <Download size={13} />
                      <span>Download Excel</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            <p>No coupon batches found. Click "Generate Batches" above to create tokens in MongoDB.</p>
          </div>
        )}
      </div>

      {/* Next Draw Spotlight */}
      {nextDraw && prize && (
        <div className="border-2 border-[#d4a017]/50 bg-[#12080c] text-white shadow-xl md:grid md:grid-cols-2">
          <div className="relative h-64 w-full bg-black/60 md:h-full">
            <img src={prize.image} alt={prize.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#12080c]" />
          </div>
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-1.5 border border-[#d4a017]/50 bg-[#d4a017]/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#f3d48a]">
              <Sparkles size={13} /> NEXT SCHEDULED DRAW
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Draw #{String(nextDraw.number).padStart(2, '0')}
            </h2>
            <div className="mt-3 space-y-1 text-xs text-white/80 sm:text-sm">
              <p>Scheduled Date: <strong className="font-semibold text-white">{formatDate(nextDraw.date)}</strong></p>
              <p className="text-base font-bold text-[#f3d48a]">Grand Prize: {prize.name}</p>
              <p className="text-xs text-white/60">{prize.value}</p>
            </div>
            <p className="mt-4 text-xs text-white/70">
              {eligibleParticipants.length} Eligible participants in this raffle pool ({data.winners.length} past winners excluded).
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/admin/lucky-draw"
                className="inline-flex items-center gap-2 border border-[#d4a017] bg-[#d4a017] px-6 py-3 text-xs font-bold tracking-widest text-[#140d10] transition hover:bg-[#e5b32e]"
              >
                LAUNCH LIVE DRAW <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Winners Table */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#140d10]">Recent Confirmed Winners</h3>
            <p className="text-xs text-slate-500">Latest confirmed winners across festival draws</p>
          </div>
          <Link
            to="/admin/winners"
            className="text-xs font-semibold text-[#6b1020] underline underline-offset-4 hover:text-[#9b1c32]"
          >
            View all history →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto border border-black/10 bg-white shadow-sm">
          <table className="w-full min-w-[550px] text-left text-xs sm:text-sm">
            <thead className="border-b border-black/10 bg-[#f7f0e6] text-[11px] font-semibold tracking-wider text-black/70 uppercase">
              <tr>
                <th className="px-4 py-3">Winner Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Prize Won</th>
                <th className="px-4 py-3">Draw Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((w) => {
                const p = getParticipant(w.participantId)
                const pr = getPrize(w.prizeId)
                const nameDisplay = p?.name || 'Verified Winner'
                const phoneDisplay = p?.phone || '—'
                const prizeDisplay = pr?.name || 'Festival Prize'
                return (
                  <tr key={w.id} className="border-b border-black/5 hover:bg-[#faf7f2]">
                    <td className="px-4 py-3 font-semibold text-[#140d10]">{nameDisplay}</td>
                    <td className="px-4 py-3 font-mono font-medium text-black/80">{phoneDisplay}</td>
                    <td className="px-4 py-3 font-medium text-[#6b1020]">{prizeDisplay}</td>
                    <td className="px-4 py-3 text-black/60">{formatDate(w.date)}</td>
                  </tr>
                )
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-xs text-black/50">
                    No completed draws yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
