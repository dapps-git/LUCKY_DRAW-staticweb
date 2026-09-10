import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, FileSpreadsheet, ListFilter } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { exportCouponsToXlsx } from '../../lib/exportCsv'

export function CouponsPage() {
  const { generateCouponBatch } = useApp()

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Title & Link to Directory */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#140d10]">
            Coupon Excel Generator
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Select the quantity to generate unique 13-character coupons and download directly as an Excel Sheet.
          </p>
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
    </div>
  )
}
