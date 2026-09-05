/**
 * Helper to safely extract and sanitize 10-digit coupon tokens from:
 * - Direct 10-digit strings (e.g. "7492018403")
 * - Formatted strings (e.g. "7492 018 403", "7492-018-403")
 * - Full URLs (e.g. "http://localhost:5173/register?coupon=7492018403", "https://valancheryfestival.com/register?token=7492018403")
 * - Scanned QR code payloads
 */
export function extractCouponId(input?: string | null): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  // 1. Try URL parsing if it looks like a URL
  try {
    if (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('?') || trimmed.includes('=')) {
      const urlString = trimmed.startsWith('http') ? trimmed : `http://dummy.com/${trimmed.startsWith('?') ? trimmed : `?${trimmed}`}`
      const url = new URL(urlString)
      const paramVal =
        url.searchParams.get('coupon') ||
        url.searchParams.get('token') ||
        url.searchParams.get('id') ||
        url.searchParams.get('c') ||
        url.searchParams.get('t') ||
        url.searchParams.get('code')

      if (paramVal) {
        const digits = paramVal.replace(/\D/g, '')
        if (digits.length === 10) return digits
        if (digits.length > 10) return digits.slice(0, 10)
      }
    }
  } catch {
    // fallback to regex
  }

  // 2. Look for explicit 10 consecutive digits
  const match10 = trimmed.match(/\b\d{10}\b/)
  if (match10) {
    return match10[0]
  }

  // 3. Strip all non-digits and check if exactly 10 digits
  const allDigits = trimmed.replace(/\D/g, '')
  if (allDigits.length === 10) {
    return allDigits
  }

  // 4. If more than 10 digits (e.g., query string with phone or other digits), check if last or first 10 digits form a token
  if (allDigits.length > 10) {
    // If the input started with a 10-digit number
    const first10 = allDigits.slice(0, 10)
    return first10
  }

  return null
}

/**
 * Format 10-digit token into readable groups: "7492 018 403"
 */
export function formatCouponDisplay(couponId: string): string {
  const clean = couponId.replace(/\D/g, '')
  if (clean.length !== 10) return couponId
  return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
}
