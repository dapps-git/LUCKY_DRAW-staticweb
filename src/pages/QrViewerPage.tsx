import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import QRCode from 'qrcode'
import { Download, ArrowRight, Ticket, CheckCircle2 } from 'lucide-react'
import { formatCouponDisplay } from '../lib/tokenHelper'

export function QrViewerPage() {
  const { couponId } = useParams<{ couponId: string }>()
  const cleanId = (couponId || '').trim().toUpperCase()

  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.valancheryfestival.com'
  const registerUrl = `${baseUrl}/register?coupon=${cleanId}`

  useEffect(() => {
    if (!cleanId) return
    QRCode.toDataURL(registerUrl, {
      width: 600,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch(console.error)
  }, [cleanId, registerUrl])

  const downloadQrPng = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `coupon-qr-${cleanId}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (!cleanId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f0] p-4 text-center">
        <div className="rounded-2xl border border-black/10 bg-white p-6 max-w-sm shadow-lg">
          <p className="text-sm font-semibold text-red-600">No coupon ID provided.</p>
          <Link to="/register" className="mt-4 inline-block text-xs font-bold text-[#7a1426] underline">
            Go to Registration
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-900 flex flex-col justify-between p-4 sm:p-6">
      <header className="mx-auto max-w-md w-full flex items-center justify-between pb-4">
        <Link to="/home" className="font-display text-sm font-bold tracking-wide text-[#7a1426]">
          Valanchery <span className="text-[#c28e18]">Festival 2026</span>
        </Link>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
          <CheckCircle2 size={12} /> Official Ticket QR
        </span>
      </header>

      <main className="mx-auto max-w-md w-full flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl text-center space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c28e18]">Festival Lucky Draw</span>
            <h1 className="font-display text-xl font-bold text-slate-900 mt-0.5">Coupon QR Scanner</h1>
          </div>

          {/* QR Code Container */}
          <div className="mx-auto max-w-[280px] rounded-xl border-2 border-dashed border-slate-200 bg-white p-3 shadow-inner">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR Code for ${cleanId}`} className="w-full h-auto object-contain rounded-lg" />
            ) : (
              <div className="w-[250px] h-[250px] flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          {/* Formatted Token ID */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Coupon Token ID</p>
            <p className="font-mono text-base font-bold tracking-widest text-[#7a1426] mt-0.5">
              {formatCouponDisplay(cleanId)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Link
              to={`/register?coupon=${cleanId}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#7a1426] bg-[#7a1426] py-3 text-xs font-bold tracking-wider text-white shadow-md transition hover:bg-[#961a30]"
            >
              <span>REGISTER WITH THIS COUPON</span>
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={downloadQrPng}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={14} />
              <span>DOWNLOAD HIGH-RES QR (PNG)</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-slate-400 pt-4">
        Valanchery Festival 2026 · Official Ticket Portal
      </footer>
    </div>
  )
}
