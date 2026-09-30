import { Link } from 'react-router-dom'
import { AnimatedNumber } from '../../components/AnimatedNumber'
import { useApp } from '../../context/AppContext'
import { formatDate, formatShortDate, maskPhone } from '../../lib/format'
import { exportCouponsToXlsx } from '../../lib/exportCsv'
import { Sparkles, ArrowRight, Trophy, Ticket, Layers, Download, CheckCircle2, ListFilter, Users } from 'lucide-react'

export function DashboardPage() {
  const { data, coupons, batches, nextDraw, getPrize, getParticipant, getDraw, eligibleParticipants } = useApp()
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
  const recent = [...data.winners]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime() || b.id.localeCompare(a.id))
    .slice(0, 5)

  const allBatches = batches && batches.length > 0 ? batches : data.batches || []
  const totalFromBatches = allBatches.reduce((acc, b) => acc + (b.count || 0), 0)
  const totalCouponsCount = typeof data.totalCouponsCount === 'number' ? data.totalCouponsCount : totalFromBatches
  const usedCount = typeof data.usedCouponsCount === 'number' ? data.usedCouponsCount : data.participants.length
  const unusedCount = Math.max(0, totalCouponsCount - usedCount)

  const handleDownloadBatch = (batchId: string, batchName: string) => {
    const batchCoupons = (coupons || []).filter((c) => c.batchId === batchId)
    const activeBase = typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com'
    exportCouponsToXlsx(batchCoupons, `${batchName.replace(/\s+/g, '_')}.xlsx`, activeBase)
  }

  const cards = [
    { label: 'Total Prepared Coupons', value: totalCouponsCount, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-300', accent: 'border-l-4 border-l-[#5e0917]' },
    { label: 'Available (Unused)', value: unusedCount, color: 'text-amber-800', bg: 'bg-amber-50/40', border: 'border-amber-300/80', accent: 'border-l-4 border-l-[#d4a017]' },
    { label: 'Registered Participants', value: data.participants.length, color: 'text-emerald-800', bg: 'bg-emerald-50/40', border: 'border-emerald-300/80', accent: 'border-l-4 border-l-emerald-600' },
    { label: 'Prepared Batches', value: allBatches.length, color: 'text-[#5e0917]', bg: 'bg-white', border: 'border-black/10', accent: 'border-l-4 border-l-slate-700' },
    { label: 'Total Lucky Draws', value: data.draws.length, color: 'text-slate-900', bg: 'bg-white', border: 'border-black/10', accent: 'border-l-4 border-l-blue-600' },
    { label: 'Confirmed Winners', value: data.winners.length, color: 'text-[#5e0917]', bg: 'bg-white', border: 'border-black/10', accent: 'border-l-4 border-l-[#a46e09]' },
  ]

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-[#5e0917]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#140d10]">
              Festival Operations Dashboard
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium">
            Real-time live summary of prepared coupon batches, participant registrations, and lucky draws.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/coupons-directory"
            className="flex items-center gap-1.5 border border-[#5e0917] bg-[#5e0917] px-4 py-2 text-xs font-bold text-white hover:bg-[#7e0c1f] transition shadow-sm"
          >
            <ListFilter size={14} />
            <span>Coupons Directory</span>
          </Link>
          <Link
            to="/admin/coupons"
            className="flex items-center gap-1.5 border border-black/20 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-sm"
          >
            <Ticket size={14} className="text-[#c28e18]" />
            <span>Generate Batches</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className={`border ${c.border} ${c.bg} ${c.accent} p-4 shadow-xs transition hover:shadow-sm`}>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase">{c.label}</p>
            <p className={`mt-2 text-2xl sm:text-3xl font-black tracking-tight ${c.color}`}>
              <AnimatedNumber value={c.value} />
            </p>
          </div>
        ))}
      </div>

      {/* Prepared Coupon Batches in MongoDB Section */}
      <div className="border border-[#e8decb] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#e8decb] bg-[#faf6ee] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#5e0917] uppercase tracking-wider">
            <Layers size={17} className="text-[#a46e09]" />
            <span>Prepared Coupon Batches in Database ({allBatches.length} Batches)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-600">
              Total Database Tokens: <strong className="font-extrabold text-slate-900">{totalCouponsCount.toLocaleString()} pcs</strong>
            </span>
            <Link
              to="/admin/coupons"
              className="text-[#5e0917] font-bold underline hover:text-[#9b1c32] tracking-wide"
            >
              + Create New Batch
            </Link>
          </div>
        </div>

        {allBatches.length > 0 ? (
          <div className="divide-y divide-[#f3ebde]">
            {allBatches.map((b, idx) => {
              const count = b.count || (b.endId ? 10000 : 50)
              const usedInBatch = b.usedCount || 0
              const unusedInBatch = Math.max(0, count - usedInBatch)
              const percentageUsed = count > 0 ? Math.min(100, Math.round((usedInBatch / count) * 100)) : 0

              return (
                <div
                  key={b.id || idx}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:bg-[#fcfaf5] transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-sm text-[#140d10]">{b.name || `Batch #${idx + 1}`}</span>
                      <span className="font-mono text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-300">
                        {b.id}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                        {count.toLocaleString()} pcs total
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span>
                        Created: <strong className="font-bold text-slate-800">{formatShortDate(b.createdAt)}</strong>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-amber-900 font-bold text-xs">
                        <Users size={13} className="text-amber-700" />
                        <span>{usedInBatch.toLocaleString()} Registered</span>
                      </span>
                      <span>·</span>
                      <span className="text-slate-600 font-semibold">
                        {unusedInBatch.toLocaleString()} Available
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full max-w-xs h-1.5 bg-slate-200 overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/admin/coupons-directory`}
                      className="inline-flex items-center justify-center gap-1 border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition"
                    >
                      View Tokens
                    </Link>
                    <button
                      onClick={() => handleDownloadBatch(b.id, b.name || `Batch_${idx + 1}`)}
                      className="inline-flex items-center justify-center gap-1.5 border border-[#5e0917] bg-[#5e0917] hover:bg-[#7e0c1f] px-4 py-1.5 text-xs font-bold text-white transition cursor-pointer shadow-xs"
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
          <div className="p-8 text-center text-xs text-slate-500 font-medium">
            <p>No coupon batches found. Click "Generate Batches" above to create tokens in MongoDB.</p>
          </div>
        )}
      </div>

      {/* Next Draw Spotlight */}
      {nextDraw && prize && (
        <div className="border border-[#d4a017]/40 bg-gradient-to-br from-[#1b060d] via-[#240811] to-[#120408] text-white shadow-xl md:grid md:grid-cols-2 overflow-hidden">
          <div className="relative h-64 w-full bg-black/60 md:h-full min-h-[260px]">
            <img src={prize.image} alt={prize.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#240811]" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 border border-[#d4a017]/60 bg-[#d4a017]/15 px-3 py-1 text-[10px] font-extrabold tracking-widest text-[#f3d48a] uppercase">
                <Sparkles size={13} className="text-[#f3d48a]" /> NEXT SCHEDULED DRAW
              </div>
              <h2 className="mt-3.5 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Draw #{String(nextDraw.number).padStart(2, '0')}
              </h2>
              <div className="mt-3.5 space-y-1.5 text-xs text-white/85 sm:text-sm font-medium">
                <p>Scheduled Date: <strong className="font-bold text-white">{formatDate(nextDraw.date)}</strong></p>
                <p className="text-base sm:text-lg font-extrabold text-[#f3d48a]">Grand Prize: {prize.name}</p>
                <p className="text-xs text-white/70 font-semibold">{prize.value}</p>
              </div>
              <p className="mt-4 text-xs text-white/75 font-medium">
                <strong className="text-emerald-400 font-bold">{eligibleParticipants.length.toLocaleString()}</strong> Eligible participants in this raffle pool ({data.winners.length} past winners excluded).
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/admin/lucky-draw"
                className="inline-flex items-center gap-2 border border-[#d4a017] bg-[#d4a017] hover:bg-[#e5b32e] px-6 py-3 text-xs font-black tracking-widest text-[#140d10] transition shadow-md uppercase"
              >
                LAUNCH LIVE DRAW <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Winners Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#140d10]">Recent Confirmed Winners</h3>
            <p className="text-xs text-slate-500 font-medium">Latest verified winners across festival draws</p>
          </div>
          <Link
            to="/admin/winners"
            className="text-xs font-bold text-[#6b1020] underline underline-offset-4 hover:text-[#9b1c32]"
          >
            View all history →
          </Link>
        </div>

        <div className="overflow-x-auto border border-[#e8decb] bg-white shadow-xs">
          <table className="w-full min-w-[550px] text-left text-xs sm:text-sm">
            <thead className="border-b border-[#e8decb] bg-[#faf6ee] text-[11px] font-bold tracking-wider text-slate-700 uppercase">
              <tr>
                <th className="px-4 py-3.5">Winner Name</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Prize Won</th>
                <th className="px-4 py-3.5">Draw Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((w) => {
                const p = getParticipant(w.participantId)
                const pr = getPrize(w.prizeId)
                const nameDisplay = p?.name || 'Verified Winner'
                const phoneDisplay = p?.phone || '—'
                const prizeDisplay = pr?.name || 'Festival Prize'
                return (
                  <tr key={w.id} className="hover:bg-[#fcfaf5] transition font-medium">
                    <td className="px-4 py-3.5 font-bold text-[#140d10]">{nameDisplay}</td>
                    <td className="px-4 py-3.5 font-mono font-medium text-slate-700">{phoneDisplay}</td>
                    <td className="px-4 py-3.5 font-bold text-[#720e1e]">{prizeDisplay}</td>
                    <td className="px-4 py-3.5 text-slate-500">{formatDate(w.date)}</td>
                  </tr>
                )
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-500 font-medium">
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
