import type { AppData, Coupon, CouponBatch, Draw, Participant, Prize, Winner } from '../types'

const rawUrl = (import.meta.env.VITE_API_URL || 'https://tweaki.pw/festival').replace(/\/+$/, '')
const API_BASE = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3500): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  // Check Backend Health
  async health(): Promise<{ status: string; database: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/health`)
    return res.json()
  },

  // Auth
  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return res.json()
  },

  // Fetch full Initial App Data from MongoDB
  async getAllData(): Promise<AppData> {
    const [prizesRes, drawsRes, participantsRes, winnersRes, couponsRes] = await Promise.all([
      fetchWithTimeout(`${API_BASE}/prizes`),
      fetchWithTimeout(`${API_BASE}/draws`),
      fetchWithTimeout(`${API_BASE}/participants`),
      fetchWithTimeout(`${API_BASE}/winners`),
      fetchWithTimeout(`${API_BASE}/coupons`),
    ])

    const [prizesData, drawsData, participantsData, winnersData, couponsData] = await Promise.all([
      prizesRes.json(),
      drawsRes.json(),
      participantsRes.json(),
      winnersRes.json(),
      couponsRes.json(),
    ])

    return {
      prizes: prizesData.prizes || [],
      draws: drawsData.draws || [],
      participants: participantsData.participants || [],
      winners: winnersData.winners || [],
      coupons: couponsData.coupons || [],
      batches: couponsData.batches || [],
    }
  },

  // Coupons
  async validateCoupon(couponId: string): Promise<{
    valid: boolean
    status: 'Unused' | 'Used' | 'Invalid'
    coupon?: Coupon
    message: string
  }> {
    const res = await fetchWithTimeout(`${API_BASE}/coupons/validate/${encodeURIComponent(couponId)}`)
    return res.json()
  },

  async generateBatch(count: number, name?: string): Promise<{ ok: boolean; batch: CouponBatch; coupons: Coupon[] }> {
    const res = await fetchWithTimeout(`${API_BASE}/coupons/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, name }),
    })
    return res.json()
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
