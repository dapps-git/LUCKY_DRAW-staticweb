import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, FileSpreadsheet, ListFilter, Download, Calendar, Layers, Ticket, ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { exportCouponsToXlsx } from '../../lib/exportCsv'
import { formatShortDate } from '../../lib/format'

export function CouponsPage() {
  const { generateCouponBatch, data, coupons } = useApp()
  const navigate = useNavigate()

  const [count, setCount] = useState<number>(100)
  const [customDomain, setCustomDomain] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://www.valancheryfestival.com'
  })
  const [isGeneratingCsv, setIsGeneratingCsv] = useState(false)

  // Generate & Download real Excel (.xlsx) with native clickable hyperlinks
  const handleGenerateAndDownloadCsv = async () => {
    if (count <= 0) return
    setIsGeneratingCsv(true)

    try {
      const batchName = `Coupons Batch (${count} pcs)`
      const { coupons: newCoupons } = await generateCouponBatch(count, batchName)

      const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
      exportCouponsToXlsx(newCoupons, `festival 1-${count}.xlsx`, activeBase)
    } catch (err) {
      console.error('Excel generation error:', err)
      alert('Error generating Excel file. Please try again.')
    } finally {
      setIsGeneratingCsv(false)
    }
  }

  // Re-download an existing prepared batch
  const handleDownloadBatch = (batchId: string, batchName: string) => {
    const batchCoupons = (coupons || []).filter((c) => c.batchId === batchId)
    if (batchCoupons.length === 0) {
      alert('No coupons found for this batch.')
      return
    }
    const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
    exportCouponsToXlsx(batchCoupons, `${batchName.replace(/\s+/g, '_')}.xlsx`, activeBase)
  }

  const batches = data.batches || []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Title & Link to Directory */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 border border-[#e8decb] bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
            title="Go back"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
              Coupon Excel Generator
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 font-normal">
              Produce serialized coupon tokens with live QR URLs and export directly to Excel.
            </p>
          </div>
        </div>

        <Link
          to="/admin/coupons-directory"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#7a1426] bg-[#7a1426] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#961a30] transition shadow-sm shrink-0"
        >
          <ListFilter size={14} />
          <span>All Coupons Directory</span>
        </Link>
      </div>

      {/* Main Generator Card */}
      <div className="border border-black/10 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-black/70">
            How many coupons do you want to generate?
          </label>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {[10, 50, 100, 500, 1000].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCount(num)}
                className={`py-2.5 text-xs font-medium transition ${
                  count === num
                    ? 'border border-emerald-700 bg-emerald-700 text-white shadow-sm'
                    : 'border border-black/15 bg-[#fbf8f3] text-black/70 hover:border-black/30'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={10000}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border border-black/20 bg-[#fbf8f3] px-4 py-2.5 text-sm font-medium text-black outline-none focus:border-emerald-600"
              placeholder="Or enter custom number..."
            />
            <span className="text-xs font-medium text-black/50">coupons</span>
          </div>

          {/* Website Domain for QR Codes */}
          <div>
            <label className="block text-[11px] font-semibold text-black/70 mb-1">
              QR Code Website Domain (Links point to this domain)
            </label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. https://www.valancheryfestival.com or http://localhost:5173"
              className="w-full border border-black/20 bg-[#fbf8f3] px-3 py-2 text-xs font-mono text-black outline-none focus:border-emerald-600"
            />
            <p className="text-[10px] text-black/50 mt-0.5">
              Current: QR scanner links will redirect to <code>{customDomain}/register?coupon=[ID]</code>
            </p>
          </div>

          {/* Download Excel Button */}
          <button
            onClick={handleGenerateAndDownloadCsv}
            disabled={isGeneratingCsv || count <= 0}
            className="flex w-full items-center justify-center gap-2 border border-emerald-700 bg-emerald-700 py-3.5 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingCsv ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating Excel Sheet...
              </>
            ) : (
              <>
                <FileSpreadsheet size={18} />
                GENERATE & DOWNLOAD EXCEL SHEET ({count} COUPONS)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prepared Coupon Batches Section */}
      <div className="border border-[#e8decb] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#e8decb] bg-[#faf6ee] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5e0917] uppercase tracking-wider">
            <Layers size={15} className="text-[#a46e09]" />
            <span>Prepared Coupon Batches ({batches.length})</span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal">
            Total Prepared: <strong className="font-bold text-slate-800">{(coupons || []).length}</strong> coupons
          </p>
        </div>

        {batches.length > 0 ? (
          <div className="divide-y divide-[#f3ebde]">
            {batches.map((b, idx) => {
              const batchCoupons = (coupons || []).filter((c) => c.batchId === b.id)
              const totalCount = b.count || batchCoupons.length
              const usedInBatch = batchCoupons.filter((c) => c.status === 'Used').length
              const unusedInBatch = totalCount - usedInBatch

              return (
                <div
                  key={b.id || idx}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fcfaf5] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#140d10]">{b.name || `Batch #${idx + 1}`}</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5">
                        {b.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar size={12} className="text-[#a46e09]" />
                        <span>Date: <strong className="font-semibold text-slate-700">{formatShortDate(b.createdAt)}</strong></span>
                      </span>

                      <span className="flex items-center gap-1 text-slate-500">
                        <Ticket size={12} className="text-[#a46e09]" />
                        <span>Count: <strong className="font-bold text-emerald-800">{totalCount} pcs</strong></span>
                      </span>

                      <span className="text-[11px] text-slate-500">
                        ({usedInBatch} used · {unusedInBatch} available)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadBatch(b.id, b.name || `Batch_${idx + 1}`)}
                    className="inline-flex items-center justify-center gap-1.5 border border-[#e8decb] bg-white hover:bg-[#faf6ee] hover:border-[#5e0917] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#5e0917] transition shadow-2xs cursor-pointer self-start sm:self-auto shrink-0"
                    title="Re-download Excel Sheet for this batch"
                  >
                    <Download size={13} className="text-[#5e0917]" />
                    <span>Download Excel</span>
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            <p>No coupon batches generated yet. Select a count above to generate your first batch.</p>
          </div>
        )}
      </div>
    </div>
  )
}
