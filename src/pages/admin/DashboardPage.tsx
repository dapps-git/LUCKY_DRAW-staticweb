import { Link } from 'react-router-dom'
import { AnimatedNumber } from '../../components/AnimatedNumber'
import { useApp } from '../../context/AppContext'
import { formatDate, maskPhone } from '../../lib/format'
import { Sparkles, ArrowRight, Trophy } from 'lucide-react'

export function DashboardPage() {
  const { data, nextDraw, getPrize, getParticipant, getDraw, eligibleParticipants } = useApp()
  const prize = nextDraw ? getPrize(nextDraw.prizeId) : undefined
  const recent = [...data.winners].reverse().slice(0, 4)

  const cards = [
    ['Total Registered', data.participants.length],
    ['Total Lucky Draws', data.draws.length],
    ['Completed Draws', data.draws.filter((d) => d.status === 'Completed').length],
    ['Total Winners', data.winners.length],
    ['Prizes In Vault', data.prizes.length],
  ] as const

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
          Festival Operations Dashboard
        </h1>
        <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
          Real-time summary of participant registrations and lucky draws.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="border border-black/10 bg-white p-4 shadow-sm md:p-5">
            <p className="text-[11px] font-light tracking-wider text-black/50 uppercase">{label}</p>
            <p className="mt-2 font-display text-2xl font-light text-[#6b1020] sm:text-3xl">
              <AnimatedNumber value={value} />
            </p>
          </div>
        ))}
      </div>

      {/* Next Draw Spotlight */}
      {nextDraw && prize && (
        <div className="mt-8 border-2 border-[#d4a017]/50 bg-[#12080c] text-white shadow-xl md:grid md:grid-cols-2">
          <div className="relative h-64 w-full bg-black/60 md:h-full">
            <img src={prize.image} alt={prize.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#12080c]" />
          </div>
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-1.5 border border-[#d4a017]/50 bg-[#d4a017]/10 px-2.5 py-1 text-[10px] tracking-widest text-[#f3d48a]">
              <Sparkles size={13} /> NEXT SCHEDULED DRAW
            </div>
            <h2 className="font-display mt-3 text-2xl font-light tracking-wide sm:text-3xl md:text-4xl">
              Draw #{String(nextDraw.number).padStart(2, '0')}
            </h2>
            <div className="mt-3 space-y-1 text-xs font-light text-white/70 sm:text-sm">
              <p>Scheduled Date: {formatDate(nextDraw.date)}</p>
              <p className="text-base font-light text-[#f3d48a]">Grand Prize: {prize.name}</p>
              <p className="text-xs text-white/50">{prize.value}</p>
            </div>
            <p className="mt-4 text-xs font-light text-white/60">
              {eligibleParticipants.length} Eligible participants in this raffle pool ({data.winners.length} past winners excluded).
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/admin/lucky-draw"
                className="inline-flex items-center gap-2 border border-[#d4a017] bg-[#d4a017] px-6 py-3 text-xs font-medium tracking-widest text-[#140d10] transition hover:bg-[#e5b32e]"
              >
                LAUNCH LIVE DRAW <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Winners Table */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-light tracking-wide text-[#140d10]">Recent Winners</h3>
            <p className="text-xs font-light text-black/50">Latest confirmed winners across festival draws</p>
          </div>
          <Link
            to="/admin/winners"
            className="text-xs font-light text-[#6b1020] underline underline-offset-4 hover:text-[#9b1c32]"
          >
            View all history →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto border border-black/10 bg-white shadow-sm">
          <table className="w-full min-w-[650px] text-left text-xs font-light sm:text-sm">
            <thead className="border-b border-black/10 bg-[#f7f0e6] text-[11px] font-medium tracking-wider text-black/60 uppercase">
              <tr>
                <th className="px-4 py-3">Winner Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Prize Won</th>
                <th className="px-4 py-3">Draw Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((w) => {
                const p = getParticipant(w.participantId)
                const pr = getPrize(w.prizeId)
                const draw = getDraw(w.drawId)
                if (!p || !pr || !draw) return null
                return (
                  <tr key={w.id} className="border-b border-black/5 hover:bg-[#faf7f2]">
                    <td className="px-4 py-3 font-medium text-[#140d10]">{p.name}</td>
                    <td className="px-4 py-3 text-black/70">{maskPhone(p.phone)}</td>
                    <td className="px-4 py-3 text-black/70">{p.location}</td>
                    <td className="px-4 py-3 text-[#6b1020]">{pr.name}</td>
                    <td className="px-4 py-3 text-black/60">{formatDate(w.date)}</td>
                  </tr>
                )
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-black/50">
                    No completed draws yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="sr-only">{eligibleParticipants.length}</p>
    </div>
  )
}
