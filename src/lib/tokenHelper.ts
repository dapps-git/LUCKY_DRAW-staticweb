/**
 * Helper to safely extract and sanitize 13-character (5 letters + 8 digits)
 * or 10-digit coupon tokens from:
 * - Direct strings (e.g. "VFKLM74920184", "VFKLM-7492-0184", "7492018403")
 * - Full URLs (e.g. "http://localhost:5173/register?coupon=VFKLM74920184")
 * - Scanned QR code payloads
 */
export function extractCouponId(input?: string | null): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  // 1. Try URL parsing if it looks like a URL or query string
  try {
    if (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('?') || trimmed.includes('=')) {
      const urlString = trimmed.startsWith('http')
        ? trimmed
        : `http://dummy.com/${trimmed.startsWith('?') ? trimmed : `?${trimmed}`}`
      const url = new URL(urlString)
      const paramVal =
        url.searchParams.get('coupon') ||
        url.searchParams.get('token') ||
        url.searchParams.get('id') ||
        url.searchParams.get('c') ||
        url.searchParams.get('t') ||
        url.searchParams.get('code')

      if (paramVal) {
        const clean = paramVal.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        if (clean.length === 13 || clean.length === 10) return clean
        if (clean.length > 13) return clean.slice(0, 13)
        if (clean.length >= 8) return clean
      }
    }
  } catch {
    // fallback
  }

  // 2. Look for 13-character code (5 letters + 8 digits or 13 alphanumeric)
  const cleanAlphanumeric = trimmed.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  if (cleanAlphanumeric.length === 13) {
    return cleanAlphanumeric
  }

  // 3. Match 13-char regex within string
  const match13 = trimmed.toUpperCase().match(/\b[A-Z0-9]{13}\b/)
  if (match13) {
    return match13[0]
  }

  // 4. Backward compatibility: 10 digits
  if (cleanAlphanumeric.length === 10) {
    return cleanAlphanumeric
  }
  const match10 = trimmed.match(/\b\d{10}\b/)
  if (match10) {
    return match10[0]
  }

  // 5. If string starts with 13 alphanumeric chars
  if (cleanAlphanumeric.length > 13) {
    return cleanAlphanumeric.slice(0, 13)
  }

  return cleanAlphanumeric.length >= 8 ? cleanAlphanumeric : null
}

/**
 * Format coupon token into readable groups:
 * 13-char (5 letters + 8 numbers): "VFKLM 7492 0184"
 * 10-digit: "7492 018 403"
 */
export function formatCouponDisplay(couponId: string): string {
  if (!couponId) return ''
  const clean = couponId.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

  // 13 characters (e.g. VFKLM74920184 -> VFKLM 7492 0184)
  if (clean.length === 13) {
    return `${clean.slice(0, 5)} ${clean.slice(5, 9)} ${clean.slice(9)}`
  }

  // 10 digits (e.g. 7492018401 -> 7492 018 401)
  if (clean.length === 10) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
  }

  return clean
}
