import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { GIFT_PRESETS, PRIZE_IMAGES } from '../../data/mockData'
import type { Prize, PrizeStatus } from '../../types'
import { Plus, X, Sparkles, Check } from 'lucide-react'

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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
            Festival Prizes Vault
          </h1>
          <p className="mt-1 text-xs font-light text-black/60 sm:text-sm">
            Total {data.prizes.length} prizes configured ({data.prizes.filter((p) => p.status === 'Awarded').length} awarded,{' '}
            {data.prizes.filter((p) => p.status !== 'Awarded').length} available)
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
          className="inline-flex items-center gap-1.5 border border-[#6b1020] bg-[#6b1020] px-4 py-2 text-xs font-medium tracking-wider text-white transition hover:bg-[#851629]"
        >
          <Plus size={15} /> ADD NEW PRIZE
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.prizes.map((p) => {
          const draw = p.assignedDrawId ? getDraw(p.assignedDrawId) : undefined
          return (
            <article key={p.id} className="border border-black/10 bg-white shadow-sm hover:shadow-md transition">
              <div className="relative h-44 w-full bg-black/60 overflow-hidden">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`border px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${
                      p.status === 'Awarded'
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
                        : 'border-[#d4a017] bg-black/80 text-[#f3d48a]'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-display text-xl font-light text-[#140d10]">{p.name}</h2>
                <p className="mt-1 text-xs font-light text-black/60 line-clamp-2">{p.description}</p>
                <p className="mt-3 font-mono text-sm font-medium text-[#6b1020]">{p.value}</p>
                <p className="mt-1 text-xs font-light text-black/50">
                  Assigned: {draw ? `Draw #${String(draw.number).padStart(2, '0')}` : 'Unassigned'}
                </p>

                <div className="mt-4 flex gap-3 border-t border-black/10 pt-3 text-xs font-light">
                  <button
                    onClick={() => setEdit(p)}
                    className="text-black/80 underline underline-offset-4 hover:text-black"
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-700 underline underline-offset-4 hover:text-red-900"
                    onClick={() => deletePrize(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-black/20 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-display text-lg font-light">{edit.id ? 'Edit Prize' : 'Add Prize (Frontend)'}</h3>
              <button onClick={() => setEdit(null)} className="text-black/50 hover:text-black">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-black/60 uppercase">Prize Name *</label>
                <input
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#d4a017]"
                  placeholder="e.g. Smart 4K TV"
                  value={edit.name ?? ''}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-black/60 uppercase">Description</label>
                <textarea
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#d4a017]"
                  placeholder="Details about prize"
                  value={edit.description ?? ''}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-black/60 uppercase">Approximate Value *</label>
                <input
                  className="mt-1 w-full border border-black/20 bg-white px-3 py-2 outline-none focus:border-[#d4a017]"
                  placeholder="e.g. ₹45,000"
                  value={edit.value ?? ''}
                  onChange={(e) => setEdit({ ...edit, value: e.target.value })}
                />
              </div>

              {/* Gift Preset Selector */}
              <div>
                <label className="block text-black/60 uppercase mb-1">Pick an Image Preset or Enter Custom Link</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-36 overflow-y-auto border border-black/10 p-2 bg-[#f7f0e6]">
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
                      className={`relative border p-1 text-left transition ${
                        edit.image === preset.image ? 'border-[#6b1020] bg-white ring-2 ring-[#d4a017]' : 'border-black/10 bg-white'
                      }`}
                    >
                      <img src={preset.image} alt={preset.name} className="h-10 w-full object-cover" />
                      <p className="mt-1 text-[9px] truncate font-medium text-black/80">{preset.name}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    className="w-full border border-black/20 bg-white px-3 py-1.5 text-xs outline-none"
                    placeholder="Or enter image URL"
                    value={edit.image ?? ''}
                    onChange={(e) => setEdit({ ...edit, image: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setEdit(null)}
                className="flex-1 border border-black/20 py-2 text-xs font-light text-black hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex-1 border border-[#6b1020] bg-[#6b1020] py-2 text-xs font-medium text-white hover:bg-[#851629]"
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
