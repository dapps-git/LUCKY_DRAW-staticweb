import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Loader2,
  FileSpreadsheet,
  ListFilter,
  Download,
  Calendar,
  Layers,
  Ticket,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Users,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { exportCouponsToXlsx } from '../../lib/exportCsv'
import { formatShortDate } from '../../lib/format'
import { api } from '../../lib/api'
import * as XLSX from 'xlsx'

export function CouponsPage() {
  const { generateCouponBatch, deleteCouponBatch, data, coupons, refreshData } = useApp()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [count, setCount] = useState<number>(100)
  const [isGeneratingCsv, setIsGeneratingCsv] = useState(false)
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null)
  const [progressMsg, setProgressMsg] = useState<string>('')
  const [isUploadingXlsx, setIsUploadingXlsx] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const handleDeleteBatch = async (batchId: string, batchName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${batchName}" and all its coupon tokens from MongoDB?`)) {
      return
    }
    setDeletingBatchId(batchId)
    try {
      await deleteCouponBatch(batchId)
      await refreshData()
    } catch (err: any) {
      alert('Failed to delete batch: ' + (err.message || err))
    } finally {
      setDeletingBatchId(null)
    }
  }

  // Generate & Stream directly to MongoDB Atlas, then Export Excel
  const handleGenerateAndDownloadCsv = async () => {
    if (count <= 0) return
    setIsGeneratingCsv(true)
    const perPrefix = Math.floor(count / 4)
    setProgressMsg(`Generating ${count.toLocaleString()} coupons (${perPrefix.toLocaleString()} each for A, B, C, D)...`)

    try {
      const batchName = `Coupons Batch (${count.toLocaleString()} pcs)`
      const { coupons: newCoupons } = await generateCouponBatch(count, batchName, (saved, total) => {
        const pct = Math.round((saved / total) * 100)
        setProgressMsg(`Saving to MongoDB: ${saved.toLocaleString()} / ${total.toLocaleString()} coupons (${pct}%)...`)
      })

      setProgressMsg('Building 8-column Excel spreadsheet (A/B/C/D)...')
      const fileName = `Coupons_1-${count}_(A-D).xlsx`
      exportCouponsToXlsx(newCoupons, fileName)
      setProgressMsg('Done! 100% Stored in MongoDB & Downloaded as Excel.')
      setTimeout(() => setProgressMsg(''), 4000)
    } catch (err: any) {
      console.error('Excel generation error:', err)
      alert(`Error generating batch: ${err.message || 'Please check MongoDB connection'}`)
      setProgressMsg('')
    } finally {
      setIsGeneratingCsv(false)
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

      // Extract coupon codes and serial numbers from 8-column layout or single column
      const extractedCoupons: Array<{ id: string; serialNo?: string; prefix?: string }> = []
      const headerRow = rows[0] || []
      const is8ColLayout = headerRow.some(
        (h: any) => String(h).includes('Sl No') || String(h).includes('Reg Code')
      )

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r]
        if (!row) continue

        if (is8ColLayout || row.length >= 8) {
          // Col 0 & 1 (A)
          const sl1 = String(row[0] || '').trim().toUpperCase()
          const code1 = String(row[1] || '').trim().toUpperCase().replace(/[^A-Za-z0-9]/g, '')
          if (code1.length >= 6 && !code1.includes('REGCODE')) {
            extractedCoupons.push({ id: code1, serialNo: sl1 || undefined, prefix: 'A' })
          }

          // Col 2 & 3 (B)
          const sl2 = String(row[2] || '').trim().toUpperCase()
          const code2 = String(row[3] || '').trim().toUpperCase().replace(/[^A-Za-z0-9]/g, '')
          if (code2.length >= 6 && !code2.includes('REGCODE')) {
            extractedCoupons.push({ id: code2, serialNo: sl2 || undefined, prefix: 'B' })
          }

          // Col 4 & 5 (C)
          const sl3 = String(row[4] || '').trim().toUpperCase()
          const code3 = String(row[5] || '').trim().toUpperCase().replace(/[^A-Za-z0-9]/g, '')
          if (code3.length >= 6 && !code3.includes('REGCODE')) {
            extractedCoupons.push({ id: code3, serialNo: sl3 || undefined, prefix: 'C' })
          }

          // Col 6 & 7 (D)
          const sl4 = String(row[6] || '').trim().toUpperCase()
          const code4 = String(row[7] || '').trim().toUpperCase().replace(/[^A-Za-z0-9]/g, '')
          if (code4.length >= 6 && !code4.includes('REGCODE')) {
            extractedCoupons.push({ id: code4, serialNo: sl4 || undefined, prefix: 'D' })
          }
        } else {
          // Fallback single column
          for (let c = 0; c < row.length; c++) {
            const raw = String(row[c] || '').trim().toUpperCase().replace(/[^A-Za-z0-9]/g, '')
            if (raw.length >= 6 && !raw.includes('COUPON') && !raw.includes('TOKEN')) {
              extractedCoupons.push({ id: raw })
            }
          }
        }
      }

      if (extractedCoupons.length === 0) {
        alert('No valid coupon codes found in this Excel sheet.')
        setIsUploadingXlsx(false)
        setUploadStatus('')
        return
      }

      const batchId = `BATCH-${Date.now()}`
      const batchName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') || `Imported Batch (${extractedCoupons.length} pcs)`
      const now = new Date().toISOString()

      const couponObjects = extractedCoupons.map((c) => ({
        id: c.id,
        serialNo: c.serialNo,
        prefix: c.prefix,
        batchId,
        status: 'Unused' as const,
        createdAt: now,
      }))

      // Stream to MongoDB in chunks of 5,000
      const CHUNK_SIZE = 5000
      for (let i = 0; i < couponObjects.length; i += CHUNK_SIZE) {
        const chunk = couponObjects.slice(i, i + CHUNK_SIZE)
        setUploadStatus(`Uploading to MongoDB: ${Math.min(i + CHUNK_SIZE, couponObjects.length)} / ${couponObjects.length} coupons...`)

        await api.bulkInsertCoupons({
          batch: {
            id: batchId,
            name: batchName,
            count: couponObjects.length,
            startId: couponObjects[0]?.serialNo || couponObjects[0]?.id || '',
            endId: couponObjects[couponObjects.length - 1]?.serialNo || couponObjects[couponObjects.length - 1]?.id || '',
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
  const handleDownloadBatch = async (batchId: string, batchName: string, batchCount: number) => {
    let batchCoupons = (coupons || []).filter((c) => c.batchId === batchId)

    if (batchCoupons.length < (batchCount || 1)) {
      try {
        const res = await fetch(`/api/coupons?batchId=${batchId}&limit=${Math.min(batchCount || 10000, 50000)}`)
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

    exportCouponsToXlsx(batchCoupons, `${batchName.replace(/\s+/g, '_')}.xlsx`)
  }

  const batches = data.batches || []

  return (
    <div className="mx-auto max-w-4xl space-y-6 font-sans">
      {/* Title & Link to Directory */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-pink-50 hover:text-[#FF0B6B] hover:border-pink-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition rounded-lg cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Coupon Generator
            </h1>
            <p className="mt-0.5 text-xs text-slate-400 font-normal">
              Generate sequential coupons and export directly to Excel.
            </p>
          </div>
        </div>

        <Link
          to="/admin/coupons-directory"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 px-3.5 py-2 text-xs font-medium text-[#FF0B6B] transition shrink-0"
        >
          <ListFilter size={14} />
          <span>Coupons Directory</span>
        </Link>
      </div>

      {/* Main Generator Card */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="space-y-4">
          <label className="block text-xs font-medium text-slate-600">
            Select Quantity
          </label>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[100, 500, 1000, 5000, 10000, 50000, 100000].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCount(num)}
                className={`py-2 text-xs font-medium transition rounded-lg cursor-pointer ${
                  count === num
                    ? 'bg-[#FF0B6B] text-white'
                    : 'border border-pink-100 bg-pink-50/40 text-slate-700 hover:bg-pink-50 hover:text-[#FF0B6B]'
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
              min={4}
              step={4}
              max={500000}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#FF0B6B] focus:bg-white transition"
              placeholder="Enter quantity..."
            />
            <span className="text-xs font-normal text-slate-400 shrink-0">coupons</span>
          </div>

          {/* Progress Banner */}
          {progressMsg && (
            <div className="rounded-lg border border-pink-200 bg-pink-50 p-3 text-xs font-medium text-[#FF0B6B] flex items-center gap-2">
              <Loader2 size={15} className="animate-spin text-[#FF0B6B]" />
              <span>{progressMsg}</span>
            </div>
          )}

          {/* Download Action Button */}
          <div className="pt-1">
            <button
              onClick={handleGenerateAndDownloadCsv}
              disabled={isGeneratingCsv || count <= 0}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#FF0B6B] hover:bg-[#E0095E] py-2.5 px-5 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingCsv ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Generating & Saving...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={15} />
                  Generate & Download Excel ({count.toLocaleString()} pcs)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prepared Coupon Batches Section */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-pink-50/30 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Layers size={14} className="text-[#FF0B6B]" />
            <span>Prepared Batches ({batches.length})</span>
          </div>
        </div>

        {batches.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {batches.map((b, idx) => {
              const totalCount = b.count || 0
              const usedInBatch = b.usedCount || 0
              const unusedInBatch = b.unusedCount ?? Math.max(0, totalCount - usedInBatch)

              return (
                <div
                  key={b.id || idx}
                  className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-pink-50/15 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-800">{b.name || `Batch #${idx + 1}`}</span>
                      <span className="font-mono text-[10px] text-pink-600 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded-md">
                        {b.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-normal">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{formatShortDate(b.createdAt)}</span>
                      </span>

                      <span>·</span>

                      <span className="flex items-center gap-1">
                        <Ticket size={12} className="text-[#FF0B6B]" />
                        <span className="font-medium text-slate-700">{totalCount.toLocaleString()} pcs</span>
                      </span>

                      <span>·</span>

                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-100 px-1.5 py-0.5 text-amber-700 font-medium text-[10px]">
                        <Users size={11} className="text-amber-500" />
                        <span>{usedInBatch} Registered</span>
                      </span>

                      <span className="text-slate-400 text-[11px]">
                        ({unusedInBatch.toLocaleString()} available)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => handleDownloadBatch(b.id, b.name || `Batch_${idx + 1}`, totalCount)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-pink-200 bg-white hover:bg-pink-50 px-3 py-1.5 text-xs font-medium text-[#FF0B6B] transition cursor-pointer shrink-0"
                      title="Download Excel Sheet"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBatch(b.id, b.name || `Batch #${idx + 1}`)}
                      disabled={deletingBatchId === b.id}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition cursor-pointer shrink-0 disabled:opacity-50"
                      title="Delete this batch"
                    >
                      {deletingBatchId === b.id ? (
                        <Loader2 size={13} className="animate-spin text-red-600" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-normal">
            <p>No coupon batches generated yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
