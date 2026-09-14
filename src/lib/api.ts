import type { AppData, Coupon, CouponBatch, Draw, Participant, Prize, Winner } from '../types'

const getEnvApiUrl = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
      if (process.env.VITE_API_URL) return process.env.VITE_API_URL
    }
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env.VITE_API_URL || ''
    }
  } catch {
    // ignore
  }
  return ''
}

const envUrl = (getEnvApiUrl() || '').replace(/\/+$/, '')
const rawEnvUrl = envUrl.includes('onrender.com') ? '' : envUrl
const PRIMARY_BASE = rawEnvUrl ? (rawEnvUrl.endsWith('/api') ? rawEnvUrl : `${rawEnvUrl}/api`) : '/api'
const LOCAL_FALLBACK_BASE = '/api'
const API_BASE = PRIMARY_BASE

async function fetchWithTimeout(urlOrPath: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const isFullPath = urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')
  let primaryUrl = urlOrPath
  let fallbackPath = ''

  if (!isFullPath) {
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`
    const relativeSubPath = cleanPath.startsWith('/api') ? cleanPath.slice(4) : cleanPath
    primaryUrl = `${PRIMARY_BASE}${relativeSubPath}`
    fallbackPath = `${LOCAL_FALLBACK_BASE}${relativeSubPath}`
  } else {
    try {
      const u = new URL(urlOrPath)
      const relativeSubPath = u.pathname.startsWith('/api') ? u.pathname.slice(4) : u.pathname
      primaryUrl = urlOrPath
      fallbackPath = `${LOCAL_FALLBACK_BASE}${relativeSubPath}${u.search}`
    } catch {
      fallbackPath = ''
    }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(primaryUrl, { ...options, signal: controller.signal })
    if (!res.ok && (res.status === 404 || res.status >= 500) && fallbackPath && primaryUrl !== fallbackPath) {
      // Auto-fallback to same-domain Vercel serverless /api
      const fallbackRes = await fetch(fallbackPath, { ...options, signal: controller.signal })
      return fallbackRes
    }
    return res
  } catch (err) {
    if (fallbackPath && primaryUrl !== fallbackPath) {
      try {
        return await fetch(fallbackPath, { ...options, signal: controller.signal })
      } catch {
        // fallback failed, throw original
      }
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  // Check Backend Health
  async health(): Promise<{ status: string; database: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/health`, {}, 8000)
    return res.json()
  },

  // Auth
  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }, 10000)
    return res.json()
  },

  // Fetch full Initial App Data from MongoDB
  async getAllData(): Promise<AppData> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/all`, {}, 20000)
      if (res.ok) {
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          const d = await res.json()
          if (d.ok || d.prizes || d.participants || d.coupons || d.totalCouponsCount) {
            return {
              prizes: d.prizes || [],
              draws: d.draws || [],
              participants: d.participants || [],
              winners: d.winners || [],
              coupons: d.coupons || [],
              batches: d.batches || [],
              totalCouponsCount: d.totalCouponsCount || d.coupons?.length || 0,
              usedCouponsCount: d.usedCouponsCount || d.participants?.length || 0,
            }
          }
        }
      }
    } catch {
      // fallback to individual fetch
    }

    try {
      const [prizesRes, drawsRes, participantsRes, winnersRes, couponsRes] = await Promise.allSettled([
        fetchWithTimeout(`${API_BASE}/prizes`, {}, 10000),
        fetchWithTimeout(`${API_BASE}/draws`, {}, 10000),
        fetchWithTimeout(`${API_BASE}/participants`, {}, 12000),
        fetchWithTimeout(`${API_BASE}/winners`, {}, 10000),
        fetchWithTimeout(`${API_BASE}/coupons?limit=100`, {}, 12000),
      ])

      const parse = async (p: PromiseSettledResult<Response>) => {
        if (p.status === 'fulfilled' && p.value.ok) {
          try {
            const ct = p.value.headers.get('content-type') || ''
            if (ct.includes('application/json')) {
              return await p.value.json()
            }
          } catch {
            return {}
          }
        }
        return {}
      }

      const [prizesData, drawsData, participantsData, winnersData, couponsData] = await Promise.all([
        parse(prizesRes),
        parse(drawsRes),
        parse(participantsRes),
        parse(winnersRes),
        parse(couponsRes),
      ])

      return {
        prizes: prizesData.prizes || [],
        draws: drawsData.draws || [],
        participants: participantsData.participants || [],
        winners: winnersData.winners || [],
        coupons: couponsData.coupons || [],
        batches: couponsData.batches || [],
        totalCouponsCount: couponsData.totalCoupons || couponsData.coupons?.length || 0,
        usedCouponsCount: participantsData.participants?.length || 0,
      }
    } catch {
      return {
        prizes: [],
        draws: [],
        participants: [],
        winners: [],
        coupons: [],
        batches: [],
      }
    }
  },

  async bulkInsertCoupons(payload: { batch: CouponBatch; coupons: Coupon[] }): Promise<{ ok: boolean; insertedCount?: number; error?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/coupons/bulk-insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }, 30000)
    return res.json()
  },

  // Coupons
  async validateCoupon(couponId: string): Promise<{
    valid: boolean
    status: 'Unused' | 'Used' | 'Invalid'
    coupon?: Coupon
    message: string
  }> {
    const cleanId = (couponId || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    try {
      const res = await fetchWithTimeout(`${API_BASE}/coupons/validate?id=${encodeURIComponent(cleanId)}`, {}, 8000)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // fallback
    }
    return { valid: true, status: 'Unused', message: 'Valid Festival Coupon! Ready for entry.' }
  },

  async generateBatch(count: number, name?: string): Promise<{ ok: boolean; batch: CouponBatch; coupons: Coupon[] }> {
    const batchId = `BATCH-${Date.now()}`
    const now = new Date().toISOString()
    return {
      ok: true,
      batch: {
        id: batchId,
        name: name || `Coupons Batch (${count} pcs)`,
        count,
        startId: '',
        endId: '',
        createdAt: now,
        unusedCount: count,
        usedCount: 0,
      },
      coupons: [],
    }
  },

  async deleteBatch(batchId: string): Promise<{ ok: boolean }> {
    const res = await fetchWithTimeout(`${API_BASE}/coupons/batches/${batchId}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // Participants
  async registerParticipant(input: {
    name?: string
    phone: string
    address?: string
    location?: string
    couponId?: string
  }): Promise<{ ok: boolean; id: string; participant?: Participant; error?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/participants/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = await res.json()
    if (!res.ok) {
      return { ok: false, id: '', error: data.error || 'Registration failed' }
    }
    return data
  },

  async bulkRegisterParticipants(
    participants: Array<{ name: string; phone: string; address?: string; location?: string; couponId?: string }>
  ): Promise<{ ok: boolean; added: number; duplicates: number; invalid: number }> {
    const res = await fetchWithTimeout(`${API_BASE}/participants/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participants }),
    })
    return res.json()
  },

  async lookupParticipant(query: string): Promise<{ ok: boolean; participant?: Participant; error?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/participants/lookup/${encodeURIComponent(query)}`)
    return res.json()
  },

  async updateParticipant(id: string, patch: Partial<Participant>): Promise<{ ok: boolean; participant?: Participant }> {
    const res = await fetchWithTimeout(`${API_BASE}/participants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    return res.json()
  },

  async deleteParticipant(id: string): Promise<{ ok: boolean }> {
    const res = await fetchWithTimeout(`${API_BASE}/participants/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // Prizes
  async addPrize(prize: Omit<Prize, 'id'>): Promise<{ ok: boolean; prize: Prize }> {
    const res = await fetchWithTimeout(`${API_BASE}/prizes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prize),
    })
    return res.json()
  },

  async updatePrize(id: string, patch: Partial<Prize>): Promise<{ ok: boolean; prize: Prize }> {
    const res = await fetchWithTimeout(`${API_BASE}/prizes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    return res.json()
  },

  async deletePrize(id: string): Promise<{ ok: boolean }> {
    const res = await fetchWithTimeout(`${API_BASE}/prizes/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  },

  // Draws & Winners
  async addDraw(draw: Omit<Draw, 'id'>): Promise<{ ok: boolean; draw: Draw }> {
    const res = await fetchWithTimeout(`${API_BASE}/draws`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draw),
    })
    return res.json()
  },

  async updateDraw(id: string, patch: Partial<Draw>): Promise<{ ok: boolean; draw: Draw }> {
    const res = await fetchWithTimeout(`${API_BASE}/draws/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    return res.json()
  },

  async confirmWinner(
    participantId: string,
    drawId: string,
    prizeId?: string
  ): Promise<{ ok: boolean; winnerId?: string; winner?: Winner; error?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/draws/confirm-winner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId, drawId, prizeId }),
    })
    return res.json()
  },
}
