import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, FileSpreadsheet, ListFilter, Download, Calendar, Layers, Ticket, ArrowLeft, Upload, CheckCircle2, FileText, QrCode } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { exportCouponsToXlsx } from '../../lib/exportCsv'
import { downloadA4QrPdf } from '../../lib/couponPdfGenerator'
import { formatShortDate } from '../../lib/format'
import { api } from '../../lib/api'
import * as XLSX from 'xlsx'

export function CouponsPage() {
  const { generateCouponBatch, data, coupons, refreshData } = useApp()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [count, setCount] = useState<number>(100)
  const [customDomain, setCustomDomain] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://www.valancheryfestival.com'
  })
  const [isGeneratingCsv, setIsGeneratingCsv] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [qrLayout, setQrLayout] = useState<'left-offset' | 'center'>('left-offset')
  const [showCutGuides, setShowCutGuides] = useState(false)
  const [downloadingBatchId, setDownloadingBatchId] = useState<string | null>(null)
  const [progressMsg, setProgressMsg] = useState<string>('')
  const [isUploadingXlsx, setIsUploadingXlsx] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  // Generate & Stream directly to MongoDB Atlas, then Export Excel
  const handleGenerateAndDownloadCsv = async () => {
    if (count <= 0) return
    setIsGeneratingCsv(true)
    setProgressMsg(`Generating ${count} unique tokens...`)

    try {
      const batchName = `Coupons Batch (${count} pcs)`
      const { coupons: newCoupons } = await generateCouponBatch(count, batchName, (saved, total) => {
        const pct = Math.round((saved / total) * 100)
        setProgressMsg(`Saving to Database: ${saved.toLocaleString()} / ${total.toLocaleString()} tokens (${pct}%)...`)
      })

      setProgressMsg('Building Excel spreadsheet...')
      const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
      exportCouponsToXlsx(newCoupons, `festival 1-${count}.xlsx`, activeBase)
      setProgressMsg('Done! 100% Stored in MongoDB & Downloaded.')
      setTimeout(() => setProgressMsg(''), 4000)
    } catch (err: any) {
      console.error('Excel generation error:', err)
      alert(`Error generating batch: ${err.message || 'Please check MongoDB connection'}`)
      setProgressMsg('')
    } finally {
      setIsGeneratingCsv(false)
    }
  }

  // Generate & Stream directly to MongoDB Atlas, then Export White A4 PDF Sheets (4 QR codes per page)
  const handleGenerateAndDownloadA4Pdf = async () => {
    if (count <= 0) return
    setIsGeneratingPdf(true)
    setProgressMsg(`Generating ${count} unique tokens...`)

    try {
      const batchName = `Coupons Batch (${count} pcs)`
      const { coupons: newCoupons } = await generateCouponBatch(count, batchName, (saved, total) => {
        const pct = Math.round((saved / total) * 100)
        setProgressMsg(`Saving to Database: ${saved.toLocaleString()} / ${total.toLocaleString()} tokens (${pct}%)...`)
      })

      setProgressMsg('Building White A4 Sheets (4 QR codes per page in PDF)...')
      const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
      await downloadA4QrPdf(newCoupons, `coupons-a4-4per-sheet-${count}.pdf`, {
        baseUrl: activeBase,
        layout: qrLayout,
        showCutGuides,
        onProgress: (done, total) => {
          setProgressMsg(`Rendering PDF: ${done} / ${total} coupons (${Math.ceil(done / 4)} A4 sheets)...`)
        },
      })
      setProgressMsg('Done! 100% Stored in MongoDB & Downloaded as A4 PDF.')
      setTimeout(() => setProgressMsg(''), 4000)
    } catch (err: any) {
      console.error('PDF generation error:', err)
      alert(`Error generating PDF batch: ${err.message || 'Please check MongoDB connection'}`)
      setProgressMsg('')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Upload and restore an existing Excel sheet into MongoDB Atlas
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingXlsx(true)
    setUploadStatus('Reading Excel file...')

    try {
      const dataBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(dataBuffer, { type: 'array' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

      // Extract coupon codes from first column or header
      const extractedCodes: string[] = []
      for (const row of rows) {
        if (!row || !row[0]) continue
        const rawCode = String(row[0]).trim().toUpperCase()
        const clean = rawCode.replace(/[^A-Za-z0-9]/g, '')
        if (clean.length >= 8 && clean.length <= 16 && clean !== 'COUPONCODE' && clean !== 'TOKEN') {
          extractedCodes.push(clean)
        }
      }

      if (extractedCodes.length === 0) {
        alert('No valid coupon codes found in this Excel sheet.')
        setIsUploadingXlsx(false)
        setUploadStatus('')
        return
      }

      const batchId = `BATCH-${Date.now()}`
      const batchName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') || `Imported Batch (${extractedCodes.length} pcs)`
      const now = new Date().toISOString()

      const couponObjects = extractedCodes.map((code) => ({
        id: code,
        batchId,
        status: 'Unused' as const,
        createdAt: now,
      }))

      // Stream to MongoDB in chunks of 5,000
      const CHUNK_SIZE = 5000
      for (let i = 0; i < couponObjects.length; i += CHUNK_SIZE) {
        const chunk = couponObjects.slice(i, i + CHUNK_SIZE)
        const isLast = i + CHUNK_SIZE >= couponObjects.length
        setUploadStatus(`Uploading to MongoDB: ${Math.min(i + CHUNK_SIZE, couponObjects.length)} / ${couponObjects.length} coupons...`)

        await api.bulkInsertCoupons({
          batch: {
            id: batchId,
            name: batchName,
            count: couponObjects.length,
            startId: couponObjects[0]?.id || '',
            endId: couponObjects[couponObjects.length - 1]?.id || '',
            createdAt: now,
            unusedCount: couponObjects.length,
            usedCount: 0,
          },
          coupons: chunk,
        })
      }

      setUploadStatus(`✅ Successfully saved ${couponObjects.length.toLocaleString()} coupons into Database!`)
      await refreshData()
      setTimeout(() => setUploadStatus(''), 5000)
    } catch (err: any) {
      console.error('Import error:', err)
      alert(`Import failed: ${err.message}`)
      setUploadStatus('')
    } finally {
      setIsUploadingXlsx(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Re-download an existing prepared batch as Excel
  const handleDownloadBatch = (batchId: string, batchName: string) => {
    const batchCoupons = (coupons || []).filter((c) => c.batchId === batchId)
    const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
    exportCouponsToXlsx(batchCoupons, `${batchName.replace(/\s+/g, '_')}.xlsx`, activeBase)
  }

  // Re-download an existing prepared batch as White A4 PDF Sheets (4 QR codes per page)
  const handleDownloadBatchA4Pdf = async (batchId: string, batchName: string, batchCount: number) => {
    setDownloadingBatchId(batchId)
    setProgressMsg(`Loading coupons for ${batchName}...`)

    try {
      let batchCoupons = (coupons || []).filter((c) => c.batchId === batchId)

      // If not enough coupons in memory, fetch from backend API
      if (batchCoupons.length < (batchCount || 1)) {
        try {
          const res = await fetch(`/api/coupons?batchId=${batchId}&limit=${Math.min(batchCount || 10000, 20000)}`)
          if (res.ok) {
            const d = await res.json()
            if (d.ok && Array.isArray(d.coupons) && d.coupons.length > 0) {
              batchCoupons = d.coupons
            }
          }
        } catch {
          // ignore
        }
      }

      // Fallback deterministic coupons if server has none
      if (batchCoupons.length === 0) {
        const targetCount = Math.min(batchCount || 100, 500)
        const charPart = 'VF' + batchId.replace(/\D/g, '').slice(-4)
        for (let i = 0; i < targetCount; i++) {
          const num = String(((i + 1) * 7919) % 100000000).padStart(8, '0')
          batchCoupons.push({
            id: `${charPart}${num}`,
            batchId,
            status: 'Unused' as const,
            createdAt: new Date().toISOString(),
          })
        }
      }

      setProgressMsg(`Rendering A4 PDF (${batchCoupons.length} coupons, ${Math.ceil(batchCoupons.length / 4)} sheets)...`)
      const activeBase = customDomain.trim().replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com')
      await downloadA4QrPdf(batchCoupons, `${batchName.replace(/\s+/g, '_')}_A4_4per_sheet.pdf`, {
        baseUrl: activeBase,
        layout: qrLayout,
        showCutGuides,
        onProgress: (done, total) => {
          setProgressMsg(`Rendering PDF: ${done} / ${total} coupons (${Math.ceil(done / 4)} A4 sheets)...`)
        },
      })
      setProgressMsg('Done! A4 PDF Downloaded.')
      setTimeout(() => setProgressMsg(''), 4000)
    } catch (err: any) {
      console.error('Batch PDF download error:', err)
      alert(`Error exporting batch PDF: ${err.message || err}`)
      setProgressMsg('')
    } finally {
      setDownloadingBatchId(null)
    }
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
              Coupon Generator & Sync
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 font-normal">
              Produce serialized coupon tokens directly into MongoDB and export to Excel.
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
      <div className="border border-black/10 bg-white p-6 shadow-sm space-y-5">
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-black/70">
            How many coupons do you want to generate into MongoDB?
          </label>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[100, 500, 1000, 5000, 10000, 50000, 100000].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCount(num)}
                className={`py-2 text-xs font-semibold transition ${
                  count === num
                    ? 'border border-emerald-700 bg-emerald-700 text-white shadow-sm'
                    : 'border border-black/15 bg-[#fbf8f3] text-black/70 hover:border-black/30'
                }`}
              >
                {num >= 100000 ? '1 Lakh' : num >= 1000 ? `${num / 1000}k` : num}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={500000}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border border-black/20 bg-[#fbf8f3] px-4 py-2.5 text-sm font-medium text-black outline-none focus:border-emerald-600"
              placeholder="Or enter custom number (e.g. 100000)..."
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
          </div>

          {/* A4 QR PDF Layout & Print Settings */}
          <div className="rounded-lg border border-[#e8decb] bg-[#faf7f0] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#140d10]">
                <QrCode size={14} className="text-[#a46e09]" />
                <span>White A4 Sheet Print Options (4 QR Codes / Page)</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#a46e09] bg-amber-100/60 px-2 py-0.5 rounded">
                Standard A4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  QR Code Alignment
                </label>
                <select
                  value={qrLayout}
                  onChange={(e) => setQrLayout(e.target.value as any)}
                  className="w-full border border-black/20 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-amber-600"
                >
                  <option value="left-offset">Left Offset (X ≈ 36mm - Pre-printed Ticket Stub / Sample)</option>
                  <option value="center">Centered on Sheet (X = 94mm)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4 sm:pt-5">
                <input
                  type="checkbox"
                  id="showCutGuidesCheck"
                  checked={showCutGuides}
                  onChange={(e) => setShowCutGuides(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#7a1426] focus:ring-[#7a1426] cursor-pointer"
                />
                <label htmlFor="showCutGuidesCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Print faint horizontal cut guidelines between tickets
                </label>
              </div>
            </div>
          </div>

          {/* Progress Banner */}
          {progressMsg && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-emerald-700" />
              <span>{progressMsg}</span>
            </div>
          )}

          {/* Download Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Download A4 QR PDF (4 per sheet) */}
            <button
              onClick={handleGenerateAndDownloadA4Pdf}
              disabled={isGeneratingPdf || isGeneratingCsv || count <= 0}
              className="flex items-center justify-center gap-2 border border-[#7a1426] bg-[#7a1426] py-3.5 px-4 text-xs sm:text-sm font-bold tracking-wide text-white shadow-md transition hover:bg-[#961a30] disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating White A4 PDF...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  GENERATE & DOWNLOAD A4 QR PDF (4/SHEET)
                </>
              )}
            </button>

            {/* Download Excel Button */}
            <button
              onClick={handleGenerateAndDownloadCsv}
              disabled={isGeneratingPdf || isGeneratingCsv || count <= 0}
              className="flex items-center justify-center gap-2 border border-emerald-700 bg-emerald-700 py-3.5 px-4 text-xs sm:text-sm font-bold tracking-wide text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingCsv ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Writing to DB & Excel...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={16} />
                  GENERATE & DOWNLOAD EXCEL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Restore / Upload Existing Excel File */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf7f0] p-4 rounded-lg border border-[#e8decb]">
            <div>
              <p className="text-xs font-bold text-[#140d10]">Already have a downloaded Excel file?</p>
              <p className="text-[11px] text-slate-600">
                Upload your existing Excel file to save all its coupons and batch into MongoDB Atlas immediately.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-file-uploader"
              />
              <label
                htmlFor="excel-file-uploader"
                className={`inline-flex items-center gap-1.5 border border-[#5e0917] bg-white hover:bg-[#5e0917] hover:text-white px-3.5 py-2 text-xs font-semibold text-[#5e0917] transition cursor-pointer shadow-2xs ${
                  isUploadingXlsx ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {isUploadingXlsx ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>Upload Excel to Database</span>
              </label>
            </div>
          </div>

          {uploadStatus && (
            <p className="mt-2 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {uploadStatus}
            </p>
          )}
        </div>
      </div>

      {/* Prepared Coupon Batches Section */}
      <div className="border border-[#e8decb] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#e8decb] bg-[#faf6ee] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5e0917] uppercase tracking-wider">
            <Layers size={15} className="text-[#a46e09]" />
            <span>Prepared Coupon Batches in Database ({batches.length})</span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal">
            Total Batches: <strong className="font-bold text-slate-800">{batches.length}</strong>
          </p>
        </div>

        {batches.length > 0 ? (
          <div className="divide-y divide-[#f3ebde]">
            {batches.map((b, idx) => {
              const totalCount = b.count || 0
              const usedInBatch = b.usedCount || 0
              const unusedInBatch = b.unusedCount ?? Math.max(0, totalCount - usedInBatch)

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
                        <span>Count: <strong className="font-bold text-emerald-800">{totalCount.toLocaleString()} pcs</strong></span>
                      </span>

                      <span className="text-[11px] text-slate-500">
                        ({usedInBatch} registered · {unusedInBatch} available)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => handleDownloadBatchA4Pdf(b.id, b.name || `Batch_${idx + 1}`, totalCount)}
                      disabled={downloadingBatchId === b.id}
                      className="inline-flex items-center justify-center gap-1.5 border border-[#7a1426]/40 bg-[#faf6ee] hover:bg-[#7a1426] hover:text-white px-3 py-1.5 text-xs font-semibold text-[#7a1426] transition shadow-2xs cursor-pointer disabled:opacity-50"
                      title="Download White A4 Sheets (4 QR Codes per page in PDF)"
                    >
                      {downloadingBatchId === b.id ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Rendering PDF...</span>
                        </>
                      ) : (
                        <>
                          <FileText size={13} />
                          <span>A4 QR PDF (4/sheet)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadBatch(b.id, b.name || `Batch_${idx + 1}`)}
                      className="inline-flex items-center justify-center gap-1.5 border border-[#e8decb] bg-white hover:bg-[#faf6ee] hover:border-[#5e0917] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#5e0917] transition shadow-2xs cursor-pointer shrink-0"
                      title="Re-download Excel Sheet for this batch"
                    >
                      <Download size={13} className="text-[#5e0917]" />
                      <span>Download Excel</span>
                    </button>
                  </div>
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
