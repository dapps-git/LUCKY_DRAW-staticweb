import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { GIFT_PRESETS, PRIZE_IMAGES } from '../../data/mockData'
import type { Prize, PrizeStatus } from '../../types'
import { Plus, X, Sparkles, Tag, Dices, Edit3, Trash2 } from 'lucide-react'

export function PrizesPage() {
  const { data, addPrize, updatePrize, deletePrize, getDraw } = useApp()
  const [edit, setEdit] = useState<Partial<Prize> | null>(null)

  const save = () => {
    if (!edit?.name) return
    if (edit.id) {
      updatePrize(edit.id, edit)
    } else {
      addPrize({
        name: edit.name,
        description: edit.description ?? '',
        value: edit.value ?? '₹0',
        image: edit.image ?? GIFT_PRESETS[0].image,
        assignedDrawId: edit.assignedDrawId ?? null,
        status: (edit.status as PrizeStatus) ?? 'Available',
      })
    }
    setEdit(null)
  }

  const awardedCount = data.prizes.filter((p) => p.status === 'Awarded').length
  const availableCount = data.prizes.filter((p) => p.status !== 'Awarded').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8decb]/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
            Festival Prizes Vault
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Total {data.prizes.length} prizes configured · <strong className="text-emerald-700 font-semibold">{awardedCount} Awarded</strong> · <strong className="text-amber-700 font-semibold">{availableCount} Available</strong>
          </p>
        </div>
        <button
          onClick={() =>
            setEdit({
              name: '',
              description: '',
              value: '',
              image: GIFT_PRESETS[0].image,
              status: 'Available',
            })
          }
          className="inline-flex items-center gap-1.5 rounded-none bg-[#5e0917] hover:bg-[#720e1e] px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-sm shadow-[#5e0917]/20 transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New Prize</span>
        </button>
      </div>

      {/* Grid of Prizes */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.prizes.map((p) => {
          const draw = p.assignedDrawId ? getDraw(p.assignedDrawId) : undefined
          return (
            <article
              key={p.id}
              className="group rounded-none border border-[#e8decb] bg-white shadow-xs hover:shadow-md transition duration-200 flex flex-col overflow-hidden"
            >
              {/* Prize Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Status Badge */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-[10px] font-bold tracking-wider uppercase shadow-xs backdrop-blur-xs ${
                      p.status === 'Awarded'
                        ? 'bg-emerald-600/90 text-white'
                        : p.status === 'Assigned'
                        ? 'bg-blue-600/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Value Pill Top Right */}
                <div className="absolute top-3 right-3 rounded-none bg-white/90 backdrop-blur-xs border border-[#e8decb] px-3 py-1 text-xs font-bold font-mono text-[#5e0917] shadow-xs">
                  {p.value}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#140d10] leading-snug truncate">
                    {p.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.description || 'Valanchery Festival official grand prize reward'}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                    <Dices size={13} className="text-[#ad823e]" />
                    <span>
                      Assigned:{' '}
                      <strong className="font-semibold text-slate-800">
                        {draw ? `Draw #${String(draw.number).padStart(2, '0')}` : 'Unassigned'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#f0e6d6] pt-3.5">
                  <button
                    onClick={() => setEdit(p)}
                    className="inline-flex items-center gap-1 rounded-none border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deletePrize(p.id)}
                    className="inline-flex items-center gap-1 rounded-none border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Edit / Add Modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-none border border-[#e8decb] bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e8decb] pb-3.5">
              <div>
                <h3 className="text-lg font-bold text-[#140d10]">
                  {edit.id ? 'Edit Prize' : 'Add New Prize'}
                </h3>
                <p className="text-xs text-slate-500">Configure prize details in the festival vault</p>
              </div>
              <button
                onClick={() => setEdit(null)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                  Prize Name *
                </label>
                <input
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                  placeholder="e.g. Smart 4K TV"
                  value={edit.name ?? ''}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                  Description
                </label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                  placeholder="Details about prize"
                  value={edit.description ?? ''}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                  Approximate Value *
                </label>
                <input
                  className="mt-1 w-full rounded-none border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                  placeholder="e.g. ₹45,000"
                  value={edit.value ?? ''}
                  onChange={(e) => setEdit({ ...edit, value: e.target.value })}
                />
              </div>

              {/* Gift Preset Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Pick an Image Preset or Enter Custom Link
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-36 overflow-y-auto rounded-none border border-[#e8decb] p-2 bg-[#faf7f0]">
                  {GIFT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEdit({
                          ...edit,
                          image: preset.image,
                          name: edit.name || preset.name,
                          value: edit.value || preset.value,
                          description: edit.description || preset.description,
                        })
                      }}
                      className={`relative border p-1 text-left transition rounded-none cursor-pointer ${
                        edit.image === preset.image
                          ? 'border-[#5e0917] bg-white ring-2 ring-[#5e0917]'
                          : 'border-[#e8decb] bg-white'
                      }`}
                    >
                      <img src={preset.image} alt={preset.name} className="h-10 w-full object-cover rounded-none" />
                      <p className="mt-1 text-[9px] truncate font-bold text-slate-800">{preset.name}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#5e0917]"
                    placeholder="Or enter image URL"
                    value={edit.image ?? ''}
                    onChange={(e) => setEdit({ ...edit, image: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 pt-2 border-t border-[#e8decb]">
              <button
                onClick={() => setEdit(null)}
                className="flex-1 rounded-none border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex-1 rounded-none bg-[#5e0917] hover:bg-[#720e1e] py-2.5 text-xs font-bold tracking-wider uppercase text-white shadow-sm shadow-[#5e0917]/20 transition active:scale-95 cursor-pointer"
              >
                Save Prize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
