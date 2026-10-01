import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { GIFT_PRESETS } from '../../data/mockData'
import type { Prize } from '../../types'
import { Plus, X, Edit3, Trash2, Upload, ArrowLeft } from 'lucide-react'

export function PrizesPage() {
  const { data, addPrize, updatePrize, deletePrize } = useApp()
  const navigate = useNavigate()
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
        assignedDrawId: null,
        status: 'Available',
      })
    }
    setEdit(null)
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-pink-50 hover:text-[#FF0B6B] hover:border-pink-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition cursor-pointer shadow-none"
            title="Go back"
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Prizes Vault
            </h1>
            <p className="mt-0.5 text-xs text-slate-400 font-normal">
              Manage festival lucky draw gifts and prizes ({data.prizes.length} prizes).
            </p>
          </div>
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-4 py-2 text-xs font-semibold tracking-wide uppercase text-white shadow-xs shadow-pink-200 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Prize</span>
        </button>
      </div>

      {/* Grid of Prizes */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.prizes.map((p) => {
          return (
            <article
              key={p.id}
              className="group rounded-xl border border-slate-100 bg-white shadow-xs hover:shadow-md transition duration-200 flex flex-col overflow-hidden"
            >
              {/* Prize Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Value Pill Top Right */}
                <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-xs border border-pink-100 px-3 py-1 text-xs font-semibold font-mono text-[#FF0B6B] shadow-xs">
                  {p.value}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 leading-snug truncate">
                    {p.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description || 'Festival official grand prize reward'}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setEdit(p)}
                    className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-white px-3 py-1.5 text-xs font-medium text-[#FF0B6B] hover:bg-pink-50 transition cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deletePrize(p.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
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
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {edit.id ? 'Edit Prize' : 'Add New Prize'}
                </h3>
                <p className="text-xs text-slate-400">Configure prize details in the vault</p>
              </div>
              <button
                onClick={() => setEdit(null)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  Prize Name *
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                  placeholder="e.g. Smart 4K TV"
                  value={edit.name ?? ''}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                  placeholder="Details about prize"
                  value={edit.description ?? ''}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                  Approximate Value *
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                  placeholder="e.g. ₹45,000"
                  value={edit.value ?? ''}
                  onChange={(e) => setEdit({ ...edit, value: e.target.value })}
                />
              </div>

              {/* Prize Photo Uploader & Selector */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1.5">
                  Prize Photo / Image *
                </label>

                {/* File Upload Box */}
                <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50/30 p-4 text-center transition hover:bg-pink-50/50">
                  <input
                    type="file"
                    id="prize-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (evt) => {
                        const res = evt.target?.result as string
                        if (res) {
                          setEdit((prev) => (prev ? { ...prev, image: res } : null))
                        }
                      }
                      reader.readAsDataURL(file)
                    }}
                  />

                  {edit.image ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-pink-200 bg-white shadow-xs">
                        <img src={edit.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-semibold text-slate-800">Current Prize Photo</p>
                        <p className="text-[11px] text-slate-400 font-normal">Ready to save</p>
                        <div className="mt-2 flex gap-2">
                          <label
                            htmlFor="prize-image-upload"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] text-white px-3 py-1.5 text-xs font-medium cursor-pointer shadow-xs transition"
                          >
                            <Upload size={12} /> Change Photo
                          </label>
                          <button
                            type="button"
                            onClick={() => setEdit((prev) => (prev ? { ...prev, image: '' } : null))}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="prize-image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer py-2"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-[#FF0B6B]">
                        <Upload size={16} />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-800">Click to Upload Photo</p>
                      <p className="text-[11px] text-slate-400 font-normal">PNG, JPG, WEBP supported</p>
                    </label>
                  )}
                </div>

                {/* Preset Gallery Accordion */}
                <div className="mt-3">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Or Select from Presets
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-32 overflow-y-auto rounded-xl border border-slate-100 p-2 bg-white">
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
                        className={`relative rounded-lg border p-1 text-left transition cursor-pointer ${
                          edit.image === preset.image
                            ? 'border-[#FF0B6B] bg-pink-50 ring-1 ring-[#FF0B6B]'
                            : 'border-slate-100 bg-white hover:border-pink-200'
                        }`}
                      >
                        <img src={preset.image} alt={preset.name} className="h-9 w-full object-cover rounded" />
                        <p className="mt-1 text-[9px] truncate font-medium text-slate-700">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEdit(null)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold tracking-wide uppercase text-white shadow-xs shadow-pink-200 transition cursor-pointer"
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
