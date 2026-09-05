import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ADMIN_EMAIL, ADMIN_PASSWORD, seedData } from '../data/mockData'
import { nextParticipantId } from '../lib/format'
import { createCouponBatch } from '../lib/couponPdfGenerator'
import type { AppData, Coupon, CouponBatch, Draw, Participant, Prize, Winner } from '../types'

const AUTH_KEY = 'vf2026_admin_auth'
const DATA_KEY = 'vf2026_app_data_v3'

interface CouponValidationResult {
  valid: boolean
  status: 'Unused' | 'Used' | 'Invalid'
  coupon?: Coupon
  message: string
}

interface AppContextValue {
  data: AppData
  isAdmin: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  registerParticipant: (input: Omit<Participant, 'id' | 'registeredAt' | 'eligibility' | 'status'>) =>
    | { ok: true; id: string }
    | { ok: false; error: string }
  bulkRegisterParticipants: (
    inputs: Array<Omit<Participant, 'id' | 'registeredAt' | 'eligibility' | 'status'>>,
  ) => { added: number; duplicates: number; invalid: number }
  updateParticipant: (id: string, patch: Partial<Participant>) => void
  deleteParticipant: (id: string) => void
  addPrize: (prize: Omit<Prize, 'id'>) => string
  updatePrize: (id: string, patch: Partial<Prize>) => void
  deletePrize: (id: string) => void
  assignPrizeToDraw: (drawId: string, prizeId: string) => void
  addDraw: (draw: Omit<Draw, 'id'>) => void
  updateDraw: (id: string, patch: Partial<Draw>) => void
  confirmWinner: (participantId: string, drawId: string, customPrizeId?: string) =>
    | { ok: true; winnerId: string }
    | { ok: false; error: string }
  getPrize: (id: string) => Prize | undefined
  getParticipant: (id: string) => Participant | undefined
  getDraw: (id: string) => Draw | undefined
  nextDraw: Draw | undefined
  eligibleParticipants: Participant[]
  winnerParticipantIds: Set<string>
  // Coupon System Methods
  coupons: Coupon[]
  batches: CouponBatch[]
  generateCouponBatch: (count: number, name?: string) => { batch: CouponBatch; coupons: Coupon[] }
  validateCoupon: (couponId: string) => CouponValidationResult
  deleteCouponBatch: (batchId: string) => void
  resetToDefaultData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) {
      // Fallback check old key
      const oldRaw = localStorage.getItem('vf2026_app_data_v2')
      if (oldRaw) {
        const parsedOld = JSON.parse(oldRaw) as AppData
        return {
          ...seedData,
          ...parsedOld,
          coupons: seedData.coupons || [],
          batches: seedData.batches || [],
        }
      }
      return seedData
    }
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.participants?.length) return seedData

    // Merge missing seed items
    const existingIds = new Set(parsed.participants.map((p) => p.id))
    const missing = seedData.participants.filter((p) => !existingIds.has(p.id))
    
    return {
      ...seedData,
      ...parsed,
      participants: [...parsed.participants, ...missing],
      coupons: parsed.coupons?.length ? parsed.coupons : (seedData.coupons || []),
      batches: parsed.batches?.length ? parsed.batches : (seedData.batches || []),
    }
  } catch {
    return seedData
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(AUTH_KEY) === '1')
  const [data, setData] = useState<AppData>(loadData)

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  }, [data])

  const value = useMemo<AppContextValue>(() => {
    const getPrize = (id: string) => data.prizes.find((p) => p.id === id)
    const getParticipant = (id: string) => data.participants.find((p) => p.id === id)
    const getDraw = (id: string) => data.draws.find((d) => d.id === id)

    const coupons = data.coupons || []
    const batches = data.batches || []

    // WINNER EXCLUSION: Any participant who has already won is strictly excluded from future draws
    const winnerParticipantIds = new Set(data.winners.map((w) => w.participantId))
    const eligibleParticipants = data.participants.filter(
      (p) => p.eligibility === 'Eligible' && p.status === 'Active' && !winnerParticipantIds.has(p.id),
    )

    const nextDraw = [...data.draws]
      .filter((d) => d.status === 'Upcoming')
      .sort((a, b) => a.date.localeCompare(b.date))[0]

    const validateCoupon = (couponId: string): CouponValidationResult => {
      const cleanId = couponId.replace(/\D/g, '').trim()
      if (!cleanId || cleanId.length !== 10) {
        return { valid: false, status: 'Invalid', message: 'Token ID must be exactly 10 digits.' }
      }
      const found = coupons.find((c) => c.id === cleanId)
      if (!found) {
        return { valid: false, status: 'Invalid', message: 'This coupon / token ID does not exist in the system.' }
      }
      if (found.status === 'Used') {
        const usedDate = found.usedAt ? ` on ${found.usedAt}` : ''
        return {
          valid: false,
          status: 'Used',
          coupon: found,
          message: `This coupon has already been used${usedDate}${found.usedByParticipantName ? ` by ${found.usedByParticipantName}` : ''}.`,
        }
      }
      return { valid: true, status: 'Unused', coupon: found, message: 'Valid coupon! Ready for registration.' }
    }

    return {
      data,
      isAdmin,
      coupons,
      batches,
      login: (email, password) => {
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          localStorage.setItem(AUTH_KEY, '1')
          setIsAdmin(true)
          return true
        }
        return false
      },
      logout: () => {
        localStorage.removeItem(AUTH_KEY)
        setIsAdmin(false)
      },
      validateCoupon,
      generateCouponBatch: (count: number, name?: string) => {
        const existingIds = new Set(coupons.map((c) => c.id))
        const { coupons: newCoupons, batch } = createCouponBatch(count, existingIds, name)

        setData((prev) => ({
          ...prev,
          batches: [batch, ...(prev.batches || [])],
          coupons: [...(prev.coupons || []), ...newCoupons],
        }))

        return { batch, coupons: newCoupons }
      },
      deleteCouponBatch: (batchId: string) => {
        setData((prev) => ({
          ...prev,
          batches: (prev.batches || []).filter((b) => b.id !== batchId),
          coupons: (prev.coupons || []).filter((c) => c.batchId !== batchId),
        }))
      },
      registerParticipant: (input) => {
        const phone = input.phone.replace(/\D/g, '').slice(-10)
        if (data.participants.some((p) => p.phone.slice(-10) === phone)) {
          return { ok: false, error: 'This phone number is already registered.' }
        }

        // Validate coupon if provided
        let cleanCouponId = ''
        if (input.couponId) {
          cleanCouponId = input.couponId.replace(/\D/g, '').trim()
          const check = validateCoupon(cleanCouponId)
          if (!check.valid) {
            return { ok: false, error: check.message }
          }
        }

        const id = nextParticipantId(data.participants.map((p) => p.id))
        const participant: Participant = {
          ...input,
          phone,
          id,
          couponId: cleanCouponId || undefined,
          registeredAt: new Date().toISOString().slice(0, 10),
          eligibility: 'Eligible',
          status: 'Active',
        }

        // Mark coupon as used if redeemed
        const now = new Date().toISOString().slice(0, 10)
        const updatedCoupons = cleanCouponId
          ? coupons.map((c) =>
              c.id === cleanCouponId
                ? {
                    ...c,
                    status: 'Used' as const,
                    usedAt: now,
                    usedByParticipantId: id,
                    usedByParticipantName: input.name.trim(),
                    usedByParticipantPhone: phone,
                  }
                : c
            )
          : coupons

        // Update batch counts if applicable
        const targetCoupon = cleanCouponId ? coupons.find((c) => c.id === cleanCouponId) : null
        const updatedBatches = targetCoupon
          ? batches.map((b) =>
              b.id === targetCoupon.batchId
                ? {
                    ...b,
                    unusedCount: Math.max(0, b.unusedCount - 1),
                    usedCount: b.usedCount + 1,
                  }
                : b
            )
          : batches

        setData((prev) => ({
          ...prev,
          participants: [...prev.participants, participant],
          coupons: updatedCoupons,
          batches: updatedBatches,
        }))

        return { ok: true, id }
      },
      bulkRegisterParticipants: (inputs) => {
        const existingPhones = new Set(data.participants.map((p) => p.phone.replace(/\D/g, '').slice(-10)))
        const existingIds = [...data.participants.map((p) => p.id)]
        const newParticipants: Participant[] = []
        let duplicates = 0
        let invalid = 0

        inputs.forEach((input) => {
          const phone = input.phone.replace(/\D/g, '').slice(-10)
          if (phone.length < 10) {
            invalid++
            return
          }
          if (existingPhones.has(phone)) {
            duplicates++
            return
          }
          existingPhones.add(phone)
          const id = nextParticipantId(existingIds)
          existingIds.push(id)
          newParticipants.push({
            name: input.name.trim(),
            phone,
            address: input.address.trim() || 'Valanchery',
            location: input.location.trim() || 'Valanchery',
            couponId: input.couponId ? input.couponId.replace(/\D/g, '').trim() : undefined,
            id,
            registeredAt: new Date().toISOString().slice(0, 10),
            eligibility: 'Eligible',
            status: 'Active',
          })
        })

        if (newParticipants.length > 0) {
          setData((prev) => ({
            ...prev,
            participants: [...prev.participants, ...newParticipants],
          }))
        }

        return { added: newParticipants.length, duplicates, invalid }
      },
      updateParticipant: (id, patch) => {
        setData((prev) => ({
          ...prev,
          participants: prev.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
      deleteParticipant: (id) => {
        setData((prev) => ({
          ...prev,
          participants: prev.participants.filter((p) => p.id !== id),
          winners: prev.winners.filter((w) => w.participantId !== id),
        }))
      },
      addPrize: (prize) => {
        const id = `prize-${Date.now()}`
        const newPrize: Prize = { ...prize, id }
        setData((prev) => ({ ...prev, prizes: [...prev.prizes, newPrize] }))
        return id
      },
      updatePrize: (id, patch) => {
        setData((prev) => ({
          ...prev,
          prizes: prev.prizes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
      deletePrize: (id) => {
        setData((prev) => ({ ...prev, prizes: prev.prizes.filter((p) => p.id !== id) }))
      },
      assignPrizeToDraw: (drawId, prizeId) => {
        setData((prev) => ({
          ...prev,
          draws: prev.draws.map((d) => (d.id === drawId ? { ...d, prizeId } : d)),
          prizes: prev.prizes.map((p) =>
            p.id === prizeId ? { ...p, assignedDrawId: drawId, status: 'Assigned' as const } : p,
          ),
        }))
      },
      addDraw: (draw) => {
        const id = `draw-${Date.now()}`
        setData((prev) => ({ ...prev, draws: [...prev.draws, { ...draw, id }] }))
      },
      updateDraw: (id, patch) => {
        setData((prev) => ({
          ...prev,
          draws: prev.draws.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        }))
      },
      confirmWinner: (participantId, drawId, customPrizeId) => {
        // Validation: Ensure participant hasn't already won
        if (winnerParticipantIds.has(participantId)) {
          return { ok: false, error: 'This participant has already won a prize in a previous draw!' }
        }

        const draw = data.draws.find((d) => d.id === drawId)
        if (!draw) return { ok: false, error: 'Draw not found.' }

        const awardedPrizeId = customPrizeId || draw.prizeId
        const winnerId = `win-${Date.now()}`
        const winner: Winner = {
          id: winnerId,
          drawId,
          participantId,
          prizeId: awardedPrizeId,
          date: new Date().toISOString().slice(0, 10),
          status: 'Confirmed',
        }

        setData((prev) => ({
          ...prev,
          winners: [...prev.winners, winner],
          draws: prev.draws.map((d) =>
            d.id === drawId ? { ...d, prizeId: awardedPrizeId, status: 'Completed' as const } : d,
          ),
          prizes: prev.prizes.map((p) =>
            p.id === awardedPrizeId ? { ...p, status: 'Awarded' as const, assignedDrawId: drawId } : p,
          ),
        }))

        return { ok: true, winnerId }
      },
      getPrize,
      getParticipant,
      getDraw,
      nextDraw,
      eligibleParticipants,
      winnerParticipantIds,
      resetToDefaultData: () => {
        localStorage.removeItem(DATA_KEY)
        localStorage.removeItem('vf2026_app_data_v2')
        setData(seedData)
      },
    }
  }, [data, isAdmin])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
