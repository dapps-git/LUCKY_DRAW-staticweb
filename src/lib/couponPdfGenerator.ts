import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import type { Coupon, CouponBatch } from '../types'

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const DIGITS = '0123456789'

// Helper to generate 13-character ID with 5 letters and 8 numbers randomly mixed in between (e.g. A1D3S123F89K2)
function generateMixed13Char(): string {
  const chars: string[] = []
  // 5 letters
  for (let i = 0; i < 5; i++) {
    chars.push(LETTERS[Math.floor(Math.random() * LETTERS.length)])
  }
  // 8 digits
  for (let i = 0; i < 8; i++) {
    chars.push(DIGITS[Math.floor(Math.random() * DIGITS.length)])
  }
  // Fisher-Yates shuffle so letters and numbers are randomly placed in between
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = chars[i]
    chars[i] = chars[j]
    chars[j] = temp
  }
  return chars.join('')
}

// Generate guaranteed unique 13-character coupon ID
export function generateUniqueCouponId(existingIds: Set<string>): string {
  while (true) {
    const id = generateMixed13Char()
    if (!existingIds.has(id)) {
      existingIds.add(id)
      return id
    }
  }
}

// Generate a batch of unique coupons
export function createCouponBatch(
  count: number,
  existingIds: Set<string>,
  batchName?: string
): { coupons: Coupon[]; batch: CouponBatch } {
  const batchId = `BATCH-${Date.now()}`
  const now = new Date().toISOString()
  const coupons: Coupon[] = []

  for (let i = 0; i < count; i++) {
    const id = generateUniqueCouponId(existingIds)
    coupons.push({
      id,
      batchId,
      status: 'Unused',
      createdAt: now,
    })
  }

  const batch: CouponBatch = {
    id: batchId,
    name: batchName || `Batch ${new Date().toLocaleDateString('en-GB')} (${count} coupons)`,
    count,
    startId: coupons[0]?.id || '',
    endId: coupons[coupons.length - 1]?.id || '',
    createdAt: now,
    unusedCount: count,
    usedCount: 0,
  }

  return { coupons, batch }
}

// Cached template image
let cachedTemplateImg: HTMLImageElement | null = null

export async function loadTemplateImage(src = '/coupon-template.jpg'): Promise<HTMLImageElement> {
  if (cachedTemplateImg && cachedTemplateImg.src.includes(src)) {
    return cachedTemplateImg
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      cachedTemplateImg = img
      resolve(img)
    }
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

// Generate QR Code data URL for registration link
export async function createQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 280,
    color: {
      dark: '#111827',
      light: '#ffffff',
    },
  })
}

// Generate Barcode SVG / Canvas Data URL for 10-digit ID
export function createBarcodeDataUrl(couponId: string): string {
  const canvas = document.createElement('canvas')
  JsBarcode(canvas, couponId, {
    format: 'CODE128',
    width: 1.8,
    height: 40,
    displayValue: false, // We will print custom styled text
    margin: 0,
    background: 'transparent',
    lineColor: '#111827',
  })
  return canvas.toDataURL('image/png')
}

// Render single coupon canvas preview (high resolution)
export async function renderCouponToCanvas(
  couponId: string,
  targetCanvas?: HTMLCanvasElement,
  baseUrl = window.location.origin
): Promise<HTMLCanvasElement> {
  const template = await loadTemplateImage()
  const canvas = targetCanvas || document.createElement('canvas')
  canvas.width = template.naturalWidth || 1750
  canvas.height = template.naturalHeight || 700
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // Draw background template
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height)

  const w = canvas.width
  const h = canvas.height

  // 1. Generate & Draw QR Code inside the left white box
  // Box position coordinates: x: 3.1% to 13.4% (w ~ 10.3%), y: 35.8% to 61.2% (h ~ 25.4%)
  const regUrl = `${baseUrl}/register?coupon=${couponId}`
  const qrDataUrl = await createQrDataUrl(regUrl)
  const qrImg = new Image()
  await new Promise((resolve) => {
    qrImg.onload = resolve
    qrImg.src = qrDataUrl
  })

  // Fit QR neatly inside the rounded white box on the left
  const qrX = w * 0.034
  const qrY = h * 0.365
  const qrSize = Math.min(w * 0.098, h * 0.24)
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

  // 2. Generate & Draw Barcode directly below the box
  const barcodeDataUrl = createBarcodeDataUrl(couponId)
  const barcodeImg = new Image()
  await new Promise((resolve) => {
    barcodeImg.onload = resolve
    barcodeImg.src = barcodeDataUrl
  })

  const barcodeX = w * 0.024
  const barcodeY = h * 0.625
  const barcodeW = w * 0.118
  const barcodeH = h * 0.075
  ctx.drawImage(barcodeImg, barcodeX, barcodeY, barcodeW, barcodeH)

  // 3. Draw formatted Coupon ID Text below barcode (spaced out like "K V V E S 7 4 9 2 0 1 8 4")
  ctx.fillStyle = '#111827'
  ctx.font = `bold ${Math.round(h * 0.026)}px "Courier New", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  // Spaced format: "K V V E S 7 4 9 2 0 1 8 4"
  const formattedId = couponId.split('').join(' ')
  ctx.fillText(formattedId, barcodeX + barcodeW / 2, barcodeY + barcodeH + 3)

  return canvas
}

// Generate multi-coupon PDF with high efficiency and small footprint
export async function generateCouponsPdf(
  coupons: Coupon[],
  options?: {
    baseUrl?: string
    onProgress?: (processed: number, total: number) => void
  }
): Promise<Blob> {
  const baseUrl = options?.baseUrl || window.location.origin
  const total = coupons.length

  // Ticket Dimensions in mm (210mm x 84mm - landscape ticket aspect ratio)
  const ticketWidthMm = 210
  const ticketHeightMm = 84

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [ticketWidthMm, ticketHeightMm],
    compress: true,
  })

  // Pre-load base template image data
  const template = await loadTemplateImage()

  for (let i = 0; i < total; i++) {
    const coupon = coupons[i]
    if (i > 0) {
      pdf.addPage([ticketWidthMm, ticketHeightMm], 'landscape')
    }

    // Render single ticket canvas
    const canvas = await renderCouponToCanvas(coupon.id, undefined, baseUrl)
    const ticketDataUrl = canvas.toDataURL('image/jpeg', 0.88)

    // Add to PDF page
    pdf.addImage(ticketDataUrl, 'JPEG', 0, 0, ticketWidthMm, ticketHeightMm, undefined, 'FAST')

    if (options?.onProgress) {
      options.onProgress(i + 1, total)
    }

    // Yield execution to keep UI responsive on large batches
    if (i % 10 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return pdf.output('blob')
}
