import { useState } from 'react'
import { Loader2, Trash2, CheckCircle2, FileSpreadsheet, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCouponsForExcelCsv, downloadCsvFile } from '../../lib/exportCsv'

export function CouponsPage() {
  const { coupons, batches, generateCouponBatch, deleteCouponBatch } = useApp()

  const [count, setCount] = useState<number>(100)
  const [customDomain, setCustomDomain] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://www.valancheryfestival.com'
  })
  const [isGeneratingCsv, setIsGeneratingCsv] = useState(false)
  const [sampleCoupons, setSampleCoupons] = useState<Array<{ id: string; qrUrl: string }>>([])

  // Generate & Download Excel (CSV) with id & clickable imageUrl
  const handleGenerateAndDownloadCsv = async () => {
    if (count <= 0) return
    setIsGeneratingCsv(true)

    try {
      const batchName = `Coupons Batch (${count} pcs)`
      const { coupons: newCoupons } = await generateCouponBatch(count, batchName)

      // Set sample coupons for live table preview
      const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
      setSampleCoupons(
        newCoupons.slice(0, 3).map((c) => ({
          id: c.id,
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`${activeBase}/register?coupon=${c.id}`)}`,
        }))
      )

      const csvContent = formatCouponsForExcelCsv(newCoupons, activeBase)
      downloadCsvFile(csvContent, `festival 1-${count}.csv`)
    } catch (err) {
      console.error('CSV generation error:', err)
      alert('Error generating Excel/CSV. Please try again.')
    } finally {
      setIsGeneratingCsv(false)
    }
  }

  // Download existing batch CSV
  const handleDownloadBatchCsv = (batchId: string, batchCount: number) => {
    const batchCoupons = coupons.filter((c) => c.batchId === batchId)
    if (batchCoupons.length === 0) return

    const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
    const csvContent = formatCouponsForExcelCsv(batchCoupons, activeBase)
    downloadCsvFile(csvContent, `festival 1-${batchCoupons.length || batchCount}.csv`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
          Coupon Excel Generator
        </h1>
        <p className="mt-1 text-xs text-black/60 sm:text-sm">
          Generate unique, collision-free 13-character festival coupons and download directly as an <strong>Excel Sheet (CSV with id & clickable QR scanner image URL)</strong>.
        </p>
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

          {/* Excel Format Note */}
          <div className="rounded border border-emerald-600/20 bg-emerald-50/60 p-3 text-[11px] text-emerald-900">
            <p className="font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-700" /> Excel Sheet Structure (100% Unique & Clickable):
            </p>
            <div className="mt-2 overflow-x-auto rounded border border-emerald-200 bg-white">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-emerald-100/60 font-mono font-bold text-emerald-900">
                  <tr>
                    <th className="p-2 border-r border-emerald-200">id</th>
                    <th className="p-2">imageUrl (Clickable QR Scanner Link)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 font-mono text-[10px]">
                  {sampleCoupons.length > 0 ? (
                    sampleCoupons.map((s) => (
                      <tr key={s.id} className="hover:bg-emerald-50/40">
                        <td className="p-2 font-bold text-slate-900 border-r border-emerald-100">{s.id}</td>
                        <td className="p-2 text-blue-600 underline truncate max-w-xs">
                          <a href={s.qrUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-800">
                            {s.qrUrl.slice(0, 45)}... <ExternalLink size={10} />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td className="p-2 font-bold text-slate-900 border-r border-emerald-100">6JF8D9FD8849J</td>
                        <td className="p-2 text-blue-600 underline">https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=...</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900 border-r border-emerald-100">4H5J65J4J3J4H5</td>
                        <td className="p-2 text-blue-600 underline">https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=...</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[10px] text-emerald-800/80">
              💡 When clicked in Excel or Google Sheets, each link opens the high-resolution QR scanner image directly in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Batches List (Clean & Simple) */}
      {batches.length > 0 && (
        <div className="border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="border-b border-black/10 pb-3 text-xs font-semibold uppercase tracking-wider text-black/70">
            Previous Batches
          </h2>

          <div className="mt-3 divide-y divide-black/5">
            {batches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between py-3 text-xs text-black/80"
              >
                <div>
                  <p className="font-medium text-[#140d10]">{b.name}</p>
                  <p className="text-[11px] text-black/50">
                    {b.count} coupons · Created {new Date(b.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadBatchCsv(b.id, b.count)}
                    disabled={isGeneratingCsv}
                    className="inline-flex items-center gap-1.5 border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-emerald-800 cursor-pointer"
                    title="Download Excel Sheet"
                  >
                    <FileSpreadsheet size={13} /> Download Excel
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete batch "${b.name}"?`)) {
                        deleteCouponBatch(b.id)
                      }
                    }}
                    className="border border-black/15 p-1.5 text-black/50 hover:border-red-400 hover:text-red-600 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
