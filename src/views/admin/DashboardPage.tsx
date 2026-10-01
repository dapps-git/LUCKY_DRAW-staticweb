import { Link } from 'react-router-dom'
import { AnimatedNumber } from '../../components/AnimatedNumber'
import { useApp } from '../../context/AppContext'
import { formatDate, formatShortDate } from '../../lib/format'
import { exportCouponsToXlsx } from '../../lib/exportCsv'
import { Sparkles, ArrowRight, Trophy, Ticket, Layers, Download, Users, QrCode, Eye, UserCheck, Dices } from 'lucide-react'

export function DashboardPage() {
  const { data, coupons, batches, nextDraw, getPrize, getParticipant, eligibleParticipants } = useApp()
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
  const recent = [...data.winners]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime() || b.id.localeCompare(a.id))
    .slice(0, 5)

  const allBatches = batches && batches.length > 0 ? batches : data.batches || []
  const totalFromBatches = allBatches.reduce((acc, b) => acc + (b.count || 0), 0)
  const totalCouponsCount = totalFromBatches > 0 ? totalFromBatches : (typeof data.totalCouponsCount === 'number' ? data.totalCouponsCount : 0)
  const usedCount = typeof data.usedCouponsCount === 'number' ? data.usedCouponsCount : data.participants.length
  const unusedCount = Math.max(0, totalCouponsCount - usedCount)

  const handleDownloadBatch = (batchId: string, batchName: string) => {
    const batchCoupons = (coupons || []).filter((c) => c.batchId === batchId)
    exportCouponsToXlsx(batchCoupons, `${batchName.replace(/\s+/g, '_')}.xlsx`)
  }

  const cards = [
    {
      label: 'TOTAL PREPARED COUPONS',
      value: totalCouponsCount,
      color: 'text-slate-900',
      iconColor: 'text-[#FF0B6B]',
      iconBg: 'bg-pink-50',
      accent: 'border-l-4 border-l-[#FF0B6B]',
      icon: Ticket,
    },
    {
      label: 'AVAILABLE (UNUSED)',
      value: unusedCount,
      color: 'text-amber-500',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      accent: 'border-l-4 border-l-amber-400',
      icon: Users,
    },
    {
      label: 'REGISTERED PARTICIPANTS',
      value: data.participants.length,
      color: 'text-emerald-600',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
      accent: 'border-l-4 border-l-emerald-500',
      icon: UserCheck,
    },
    {
      label: 'PREPARED BATCHES',
      value: allBatches.length,
      color: 'text-slate-900',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50',
      accent: 'border-l-4 border-l-purple-500',
      icon: Layers,
    },
    {
      label: 'TOTAL LUCKY DRAWS',
      value: data.draws.length,
      color: 'text-slate-900',
      iconColor: 'text-sky-500',
      iconBg: 'bg-sky-50',
      accent: 'border-l-4 border-l-sky-500',
      icon: Dices,
    },
    {
      label: 'CONFIRMED WINNERS',
      value: data.winners.length,
      color: 'text-[#FF0B6B]',
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
      accent: 'border-l-4 border-l-[#FF0B6B]',
      icon: Trophy,
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-[#FF0B6B] rounded-full inline-block shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Operations Dashboard
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400 font-normal pl-3.5">
            Real-time summary of coupon batches, registrations, and lucky draws.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/coupons-directory"
            className="flex items-center gap-2 bg-[#FF0B6B] hover:bg-[#E0095E] px-3.5 py-2 text-xs font-medium text-white rounded-lg shadow-xs shadow-pink-200 transition"
          >
            <Ticket size={14} />
            <span>Coupons Directory</span>
          </Link>
          <Link
            to="/admin/coupons"
            className="flex items-center gap-2 border border-pink-200 bg-white hover:bg-pink-50 px-3.5 py-2 text-xs font-medium text-[#FF0B6B] rounded-lg transition"
          >
            <QrCode size={14} />
            <span>Generate Batches</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className={`bg-white rounded-xl p-4 border border-slate-100 shadow-xs transition hover:shadow-sm ${c.accent}`}
            >
              <div className={`w-7 h-7 rounded-lg ${c.iconBg} ${c.iconColor} flex items-center justify-center mb-2.5`}>
                <Icon size={15} />
              </div>
              <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase leading-snug">{c.label}</p>
              <p className={`mt-1.5 text-2xl font-bold tracking-tight ${c.color}`}>
                <AnimatedNumber value={c.value} />
              </p>
            </div>
          )
        })}
      </div>

      {/* Prepared Coupon Batches in Database Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
            <div className="w-6 h-6 rounded-md bg-pink-50 text-[#FF0B6B] flex items-center justify-center">
              <Layers size={14} />
            </div>
            <span>Coupon Batches ({allBatches.length} Batches)</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-normal">
              Total Database Tokens: <strong className="font-semibold text-slate-700">{totalCouponsCount.toLocaleString()} pcs</strong>
            </span>
            <Link
              to="/admin/coupons"
              className="text-[#FF0B6B] font-medium hover:underline tracking-wide"
            >
              + Create Batch
            </Link>
          </div>
        </div>

        {allBatches.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {allBatches.map((b, idx) => {
              const count = b.count || (b.endId ? 10000 : 50)
              const usedInBatch = b.usedCount || 0
              const unusedInBatch = Math.max(0, count - usedInBatch)
              const percentageUsed = count > 0 ? Math.min(100, Math.round((usedInBatch / count) * 100)) : 0

              return (
                <div
                  key={b.id || idx}
                  className="px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-pink-50/15 transition"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs sm:text-sm text-slate-800">{b.name || `Coupons Batch (${count.toLocaleString()} pcs)`}</span>
                      <span className="font-mono text-[10px] font-normal text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                        {b.id}
                      </span>
                      <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {count.toLocaleString()} pcs total
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-normal">
                      <span>
                        Created: <span className="font-medium text-slate-600">{formatShortDate(b.createdAt)}</span>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-slate-600 font-medium text-xs">
                        <Users size={12} className="text-amber-500" />
                        <span>{usedInBatch.toLocaleString()} Registered</span>
                      </span>
                      <span>·</span>
                      <span className="text-slate-500 font-normal">
                        {unusedInBatch.toLocaleString()} Available
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full max-w-xs h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#FF0B6B] transition-all duration-300 rounded-full"
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/admin/coupons-directory`}
                      className="inline-flex items-center justify-center gap-1.5 border border-pink-200 bg-white hover:bg-pink-50 px-3 py-1.5 text-xs font-medium text-[#FF0B6B] rounded-lg transition shadow-none"
                    >
                      <Eye size={13} />
                      <span>View Tokens</span>
                    </Link>
                    <button
                      onClick={() => handleDownloadBatch(b.id, b.name || `Batch_${idx + 1}`)}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#FF0B6B] hover:bg-[#E0095E] px-3.5 py-1.5 text-xs font-medium text-white rounded-lg transition cursor-pointer shadow-xs shadow-pink-200"
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
          <div className="p-8 text-center text-xs text-slate-400 font-normal">
            <p>No coupon batches found. Click "Generate Batches" above to create tokens in database.</p>
          </div>
        )}
      </div>

      {/* Next Draw Spotlight */}
      {nextDraw && prize && (
        <div className="rounded-xl border border-pink-100 bg-white shadow-xs md:grid md:grid-cols-2 overflow-hidden">
          <div className="relative h-60 w-full bg-slate-100 md:h-full min-h-[240px]">
            <img src={prize.image} alt={prize.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-white" />
          </div>
          <div className="p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-[#FF0B6B] uppercase">
                <Sparkles size={12} className="text-[#FF0B6B]" /> Next Draw
              </div>
              <h2 className="mt-2.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Draw #{String(nextDraw.number).padStart(2, '0')}
              </h2>
              <div className="mt-2.5 space-y-1 text-xs text-slate-600 sm:text-sm font-normal">
                <p>Scheduled Date: <strong className="font-semibold text-slate-800">{formatDate(nextDraw.date)}</strong></p>
                <p className="text-sm sm:text-base font-bold text-[#FF0B6B]">Prize: {prize.name}</p>
                <p className="text-xs text-slate-400 font-normal">{prize.value}</p>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-normal">
                <strong className="text-emerald-600 font-semibold">{eligibleParticipants.length.toLocaleString()}</strong> Eligible participants ({data.winners.length} past winners excluded).
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/admin/lucky-draw"
                className="inline-flex items-center gap-2 bg-[#FF0B6B] hover:bg-[#E0095E] px-5 py-2.5 text-xs font-semibold tracking-wider text-white rounded-lg transition shadow-xs shadow-pink-200 uppercase"
              >
                Launch Live Draw <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Winners Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-800">Recent Confirmed Winners</h3>
            <p className="text-xs text-slate-400 font-normal">Latest verified winners across festival draws</p>
          </div>
          <Link
            to="/admin/winners"
            className="text-xs font-medium text-[#FF0B6B] hover:underline"
          >
            View all history →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-xs">
          <table className="w-full min-w-[550px] text-left text-xs">
            <thead className="border-b border-slate-100 bg-pink-50/30 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Winner Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Prize Won</th>
                <th className="px-4 py-3">Draw Date</th>
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
                  <tr key={w.id} className="hover:bg-pink-50/20 transition font-normal">
                    <td className="px-4 py-3 font-semibold text-slate-800">{nameDisplay}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{phoneDisplay}</td>
                    <td className="px-4 py-3 font-medium text-[#FF0B6B]">{prizeDisplay}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(w.date)}</td>
                  </tr>
                )
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400 font-normal">
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
