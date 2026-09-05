import { useEffect, useRef, useState } from 'react'
import { Download, Loader2, QrCode, Trash2, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { generateCouponsPdf, renderCouponToCanvas } from '../../lib/couponPdfGenerator'

export function CouponsPage() {
  const { coupons, batches, generateCouponBatch, deleteCouponBatch } = useApp()

  const [count, setCount] = useState<number>(10)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  // Live Canvas Preview
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [previewId, setPreviewId] = useState<string>('7492018401')

  useEffect(() => {
    if (!previewCanvasRef.current) return
    renderCouponToCanvas(previewId, previewCanvasRef.current).catch(console.error)
  }, [previewId])

  // Direct Generate & Download in One Click
  const handleGenerateAndDownload = async () => {
    if (count <= 0) return
    setIsGenerating(true)
    setProgress(0)

    try {
      // 1. Create the unique coupons in state
      const batchName = `Coupons Batch (${count} pcs)`
      const { batch, coupons: newCoupons } = generateCouponBatch(count, batchName)

      // Update live preview with first coupon of this new batch
      if (newCoupons[0]) {
        setPreviewId(newCoupons[0].id)
      }

      // 2. Generate and download PDF
      const pdfBlob = await generateCouponsPdf(newCoupons, {
        onProgress: (processed, total) => {
          setProgress(Math.round((processed / total) * 100))
        },
      })

      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Valanchery_Festival_Coupons_${count}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Download existing batch
  const handleDownloadBatch = async (batchId: string, batchName: string) => {
    const batchCoupons = coupons.filter((c) => c.batchId === batchId)
    if (batchCoupons.length === 0) return

    setIsGenerating(true)
    setProgress(0)

    try {
      const pdfBlob = await generateCouponsPdf(batchCoupons, {
        onProgress: (processed, total) => {
          setProgress(Math.round((processed / total) * 100))
        },
      })

      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${batchName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-light tracking-wide text-[#140d10] sm:text-3xl">
          Coupon Generator
        </h1>
        <p className="mt-1 text-xs text-black/60 sm:text-sm">
          Select the number of coupons to generate and download a single print-ready PDF with unique QR codes & barcodes.
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
                    ? 'border border-[#6b1020] bg-[#6b1020] text-white shadow-sm'
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
              className="w-full border border-black/20 bg-[#fbf8f3] px-4 py-2.5 text-sm font-medium text-black outline-none focus:border-[#d4a017]"
              placeholder="Or enter custom number..."
            />
            <span className="text-xs font-medium text-black/50">coupons</span>
          </div>

          {/* Download Button */}
          <button
            onClick={handleGenerateAndDownload}
            disabled={isGenerating || count <= 0}
            className="flex w-full items-center justify-center gap-2 border border-[#6b1020] bg-[#6b1020] py-3.5 text-sm font-semibold tracking-wider text-white shadow-md transition hover:bg-[#851629] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating PDF ({progress}%)...
              </>
            ) : (
              <>
                <Download size={18} />
                GENERATE & DOWNLOAD {count} COUPONS (PDF)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-black/70">
            Coupon Live Preview
          </h2>
          <span className="font-mono text-xs font-bold text-[#6b1020]">
            Sample ID: {previewId}
          </span>
        </div>

        <div className="mt-4 flex justify-center overflow-hidden rounded border border-black/10 bg-slate-900 p-2">
          <canvas
            ref={previewCanvasRef}
            className="max-h-[220px] w-full object-contain"
          />
        </div>

        <p className="mt-2 text-center text-[11px] text-black/50">
          ✓ Unique QR code placed in left box · Unique 10-digit ID & barcode below · Links to registration
        </p>
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
                    onClick={() => handleDownloadBatch(b.id, b.name)}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 border border-[#6b1020] bg-[#6b1020] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#851629]"
                  >
                    <Download size={13} /> Download PDF
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete batch "${b.name}"?`)) {
                        deleteCouponBatch(b.id)
                      }
                    }}
                    className="border border-black/15 p-1.5 text-black/50 hover:border-red-400 hover:text-red-600"
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
