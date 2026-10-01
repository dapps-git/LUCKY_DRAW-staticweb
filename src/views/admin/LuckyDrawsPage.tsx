import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/format'
import { GIFT_PRESETS, PRIZE_IMAGES } from '../../data/mockData'
import { Plus, X, ArrowRight, Calendar, Users, Sparkles, ArrowLeft, Trash2, Upload, Gift } from 'lucide-react'

export function LuckyDrawsPage() {
  const { data, getPrize, addDraw, deleteDraw, addPrize } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // Form State
  const [giftName, setGiftName] = useState('')
  const [giftDescription, setGiftDescription] = useState('')
  const [giftValue, setGiftValue] = useState('')
  const [drawDate, setDrawDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [giftImage, setGiftImage] = useState(GIFT_PRESETS[0].image)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleOpenModal = () => {
    setGiftName('')
    setGiftDescription('')
    setGiftValue('')
    setDrawDate(new Date().toISOString().slice(0, 10))
    setGiftImage(GIFT_PRESETS[0].image)
    setOpen(true)
  }

  // Cloudinary / Image Uploader
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      // Try Cloudinary direct unsigned upload if cloud name is available, otherwise convert to optimized DataURL
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'luckydraw_prizes')

      // Cloudinary upload attempt
      try {
        const cloudRes = await fetch('https://api.cloudinary.com/v1_1/dappstech/image/upload', {
          method: 'POST',
          body: formData,
        })
        if (cloudRes.ok) {
          const cloudData = await cloudRes.json()
          if (cloudData.secure_url) {
            setGiftImage(cloudData.secure_url)
            setIsUploadingImage(false)
            return
          }
        }
      } catch {
        // Fallback to FileReader
      }

      // Local fallback
      const reader = new FileReader()
      reader.onload = (evt) => {
        const res = evt.target?.result as string
        if (res) setGiftImage(res)
        setIsUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setIsUploadingImage(false)
    }
  }

  const handleSaveDraw = () => {
    const name = giftName.trim()
    if (!name) {
      alert('Please enter a prize name.')
      return
    }

    const value = giftValue.trim() || '₹0'
    const description = giftDescription.trim() || 'Festival official prize'
    const image = giftImage || GIFT_PRESETS[0].image

    const prizeId = addPrize({
      name,
      description,
      value,
      image,
      assignedDrawId: null,
      status: 'Available',
    })

    addDraw({
      number: data.draws.length + 1,
      date: drawDate || new Date().toISOString().slice(0, 10),
      prizeId,
      winnerCount: 1,
      status: 'Upcoming',
    })

    setOpen(false)
  }

  const handleDelete = (drawId: string, drawNo: number) => {
    if (window.confirm('Are you sure you want to remove this prize draw?')) {
      deleteDraw(drawId)
    }
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
              Draw List
            </h1>
            <p className="mt-0.5 text-xs text-slate-400 font-normal">
              Gifts and prizes for lucky draws ({data.draws.length} total).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/lucky-draw"
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200 bg-white px-3.5 py-2 text-xs font-medium text-[#FF0B6B] hover:bg-pink-50 transition shadow-none"
          >
            <Sparkles size={14} />
            <span>Enter Live Stage</span>
          </Link>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] px-4 py-2 text-xs font-semibold tracking-wide uppercase text-white shadow-xs shadow-pink-200 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Draw</span>
          </button>
        </div>
      </div>

      {/* Listing of Lucky Draws */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-xs overflow-hidden">
        {data.draws.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.draws.map((d, idx) => {
              const prize = getPrize(d.prizeId)
              return (
                <div
                  key={d.id || idx}
                  className="p-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-pink-50/15 transition"
                >
                  {/* Left: Thumbnail & Draw info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={prize?.image ?? PRIZE_IMAGES.festival}
                      alt={prize?.name ?? 'Prize'}
                      className="h-12 w-12 rounded-lg object-cover border border-pink-100 shrink-0"
                    />

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-semibold text-slate-800 truncate">
                          {prize?.name ?? 'Prize'}
                        </h2>
                        <span className="font-mono text-xs font-medium text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                          {prize?.value ?? '₹0'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-normal">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{formatDate(d.date)}</span>
                        </span>
                        {prize?.description && (
                          <>
                            <span>·</span>
                            <span className="text-slate-400 truncate max-w-xs">{prize.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(d.id, d.number)}
                      className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-normal">
            <p>No draws added yet. Click "Create Draw" to add a new gift.</p>
          </div>
        )}
      </div>

      {/* Create New Prize & Draw Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Add Prize Draw</h3>
                <p className="text-xs text-slate-400 font-normal">Create gift details for the live lucky draw</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Prize Name */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1">
                  Prize / Gift Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Double-Door Refrigerator, Smart TV, Laptop"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the prize"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                />
              </div>

              {/* Price & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1">
                    Prize Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹32,000"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                    value={giftValue}
                    onChange={(e) => setGiftValue(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1">
                    Draw Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
                    value={drawDate}
                    onChange={(e) => setDrawDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Photo Upload with Cloudinary Support */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-1">
                  Prize Image
                </label>

                <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50/20 p-3 text-center">
                  <input
                    type="file"
                    id="draw-gift-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={giftImage} alt="Preview" className="h-12 w-14 object-cover rounded-lg border border-pink-200 bg-white shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-medium text-slate-800">
                          {isUploadingImage ? 'Uploading image...' : 'Photo Selected'}
                        </p>
                        <p className="text-[10px] text-slate-400">Stores directly in Cloudinary / CDN</p>
                      </div>
                    </div>

                    <label
                      htmlFor="draw-gift-image-upload"
                      className={`inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 text-[#FF0B6B] px-3 py-1.5 text-xs font-medium cursor-pointer transition ${
                        isUploadingImage ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <Upload size={12} /> {isUploadingImage ? 'Uploading…' : 'Upload'}
                    </label>
                  </div>
                </div>

                {/* Preset Quick Selector */}
                <div className="mt-2.5">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                    Or Select Preset Image:
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto rounded-lg border border-slate-100 p-1.5 bg-white">
                    {GIFT_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setGiftImage(preset.image)
                          if (!giftName) setGiftName(preset.name)
                          if (!giftValue) setGiftValue(preset.value)
                          if (!giftDescription) setGiftDescription(preset.description || '')
                        }}
                        className={`rounded-lg border p-1 text-center transition cursor-pointer ${
                          giftImage === preset.image
                            ? 'border-[#FF0B6B] bg-pink-50 ring-1 ring-[#FF0B6B]'
                            : 'border-slate-100 hover:border-pink-200'
                        }`}
                      >
                        <img src={preset.image} alt={preset.name} className="h-8 w-full object-cover rounded" />
                        <p className="mt-0.5 text-[8px] truncate font-medium text-slate-700">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2 text-xs font-semibold tracking-wide uppercase text-white shadow-xs shadow-pink-200 transition cursor-pointer"
                onClick={handleSaveDraw}
              >
                Save Prize Draw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

