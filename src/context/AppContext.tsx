import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ADMIN_EMAIL, ADMIN_PASSWORD, seedData } from '../data/mockData'
import { nextParticipantId } from '../lib/format'
import { createCouponBatch } from '../lib/couponPdfGenerator'
import { api } from '../lib/api'
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
  isOnline: boolean
  login: (email: string, password: string) => Promise<boolean> | boolean
  logout: () => void
  registerParticipant: (input: Omit<Participant, 'id' | 'registeredAt' | 'eligibility' | 'status'>) => Promise<{ ok: true; id: string } | { ok: false; error: string }>
  bulkRegisterParticipants: (
    inputs: Array<Omit<Participant, 'id' | 'registeredAt' | 'eligibility' | 'status'>>,
  ) => Promise<{ added: number; duplicates: number; invalid: number }>
  updateParticipant: (id: string, patch: Partial<Participant>) => void
  deleteParticipant: (id: string) => void
  addPrize: (prize: Omit<Prize, 'id'>) => string
  updatePrize: (id: string, patch: Partial<Prize>) => void
  deletePrize: (id: string) => void
  assignPrizeToDraw: (drawId: string, prizeId: string) => void
  addDraw: (draw: Omit<Draw, 'id'>) => void
  updateDraw: (id: string, patch: Partial<Draw>) => void
  confirmWinner: (participantId: string, drawId: string, customPrizeId?: string) => Promise<{ ok: true; winnerId: string } | { ok: false; error: string }>
  getPrize: (id: string) => Prize | undefined
  getParticipant: (id: string) => Participant | undefined
  getDraw: (id: string) => Draw | undefined
  nextDraw: Draw | undefined
  eligibleParticipants: Participant[]
  winnerParticipantIds: Set<string>
  // Coupon System Methods
  coupons: Coupon[]
  batches: CouponBatch[]
  generateCouponBatch: (count: number, name?: string) => Promise<{ batch: CouponBatch; coupons: Coupon[] }>
  validateCoupon: (couponId: string) => CouponValidationResult
  validateCouponAsync: (couponId: string) => Promise<CouponValidationResult>
  deleteCouponBatch: (batchId: string) => void
  resetToDefaultData: () => void
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

function loadLocalData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) return seedData
    const parsed = JSON.parse(raw) as AppData
    return {
      ...seedData,
      ...parsed,
      coupons: parsed.coupons?.length ? parsed.coupons : (seedData.coupons || []),
      batches: parsed.batches?.length ? parsed.batches : (seedData.batches || []),
    }
  } catch {
    return seedData
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(AUTH_KEY) === '1')
  const [data, setData] = useState<AppData>(loadLocalData)
  const [isOnline, setIsOnline] = useState(false)

  // Fetch initial data from MongoDB Atlas
  const refreshData = async () => {
    try {
      const serverData = await api.getAllData()
      if (serverData.prizes.length || serverData.draws.length || serverData.participants.length) {
        setData(serverData)
        setIsOnline(true)
      }
    } catch (err) {
      console.warn('Backend offline, using local state:', err)
      setIsOnline(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Keep local backup
  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  }, [data])

  const value = useMemo<AppContextValue>(() => {
    const getPrize = (id: string) => data.prizes.find((p) => p.id === id)
    const getParticipant = (id: string) => data.participants.find((p) => p.id === id)
    const getDraw = (id: string) => data.draws.find((d) => d.id === id)

    const coupons = data.coupons || []
    const batches = data.batches || []

    const winnerParticipantIds = new Set(data.winners.map((w) => w.participantId))
    const eligibleParticipants = data.participants.filter(
      (p) => p.eligibility === 'Eligible' && p.status === 'Active' && !winnerParticipantIds.has(p.id),
    )

    const nextDraw = [...data.draws]
      .filter((d) => d.status === 'Upcoming')
      .sort((a, b) => a.date.localeCompare(b.date))[0]

    const validateCoupon = (couponId: string): CouponValidationResult => {
      const cleanId = couponId ? couponId.replace(/\D/g, '').trim() : ''
      if (!cleanId || cleanId.length !== 10) {
        return { valid: false, status: 'Invalid', message: 'Token ID must be a 10-digit festival code.' }
      }

      // Check if already used by any participant
      const registeredUser = data.participants.find((p) => p.couponId === cleanId)
      if (registeredUser) {
        return {
          valid: false,
          status: 'Used',
          message: `This coupon has already been redeemed by ${registeredUser.name}.`,
        }
      }

      // Check in coupons list
      const found = coupons.find((c) => c.id === cleanId)
      if (found) {
        if (found.status === 'Used') {
          const usedDate = found.usedAt ? ` on ${found.usedAt}` : ''
          return {
            valid: false,
            status: 'Used',
            coupon: found,
            message: `This coupon has already been used${usedDate}${found.usedByParticipantName ? ` by ${found.usedByParticipantName}` : ''}.`,
          }
        }
        return { valid: true, status: 'Unused', coupon: found, message: 'Valid Festival Coupon! Ready for entry.' }
      }

      return {
        valid: true,
        status: 'Unused',
        message: 'Valid Festival Coupon! Ready for entry.',
      }
    }

    const validateCouponAsync = async (couponId: string): Promise<CouponValidationResult> => {
      const localCheck = validateCoupon(couponId)
      if (!localCheck.valid && localCheck.status === 'Used') {
        return localCheck
      }

      try {
        const cleanId = couponId ? couponId.replace(/\D/g, '').trim() : ''
        if (cleanId.length === 10) {
          const res = await api.validateCoupon(cleanId)
          if (res && (res.status === 'Used' || res.status === 'Invalid' || res.valid)) {
            return res
          }
        }
      } catch {
        // fallback to local check
      }
      return localCheck
    }

    return {
      data,
      isAdmin,
      isOnline,
      coupons,
      batches,
      refreshData,
      login: async (email, password) => {
        try {
          const res = await api.login(email, password)
          if (res.ok) {
            localStorage.setItem(AUTH_KEY, '1')
            setIsAdmin(true)
            return true
          }
        } catch {
          // fallback
        }
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
      validateCouponAsync,
      generateCouponBatch: async (count: number, name?: string) => {
        try {
          const res = await api.generateBatch(count, name)
          if (res.ok) {
            setData((prev) => ({
              ...prev,
              batches: [res.batch, ...(prev.batches || [])],
              coupons: [...(prev.coupons || []), ...res.coupons],
            }))
            return { batch: res.batch, coupons: res.coupons }
          }
        } catch (e) {
          console.warn('API generate batch failed, falling back to local:', e)
        }

        const existingIds = new Set(coupons.map((c) => c.id))
        const { coupons: newCoupons, batch } = createCouponBatch(count, existingIds, name)
        setData((prev) => ({
          ...prev,
          batches: [batch, ...(prev.batches || [])],
          coupons: [...(prev.coupons || []), ...newCoupons],
        }))
        return { batch, coupons: newCoupons }
      },
      deleteCouponBatch: async (batchId: string) => {
        try {
          await api.deleteBatch(batchId)
        } catch {
          // ignore
        }
        setData((prev) => ({
          ...prev,
          batches: (prev.batches || []).filter((b) => b.id !== batchId),
          coupons: (prev.coupons || []).filter((c) => c.batchId !== batchId),
        }))
      },
      registerParticipant: async (input) => {
        const phone = input.phone.replace(/\D/g, '').slice(-10)

        // Local duplicate check
        if (data.participants.some((p) => p.phone.slice(-10) === phone)) {
          return { ok: false, error: 'This phone number is already registered.' }
        }

        let cleanCouponId = ''
        if (input.couponId) {
          cleanCouponId = input.couponId.replace(/\D/g, '').trim()
          const check = validateCoupon(cleanCouponId)
          if (!check.valid) {
            return { ok: false, error: check.message }
          }
        }

        try {
          const apiRes = await api.registerParticipant({
            name: input.name.trim(),
            phone,
            address: input.address.trim(),
            location: input.location,
            couponId: cleanCouponId || undefined,
          })

          if (apiRes.ok && apiRes.participant) {
            setData((prev) => {
              const now = new Date().toISOString().slice(0, 10)
              const updatedCoupons = cleanCouponId
                ? (prev.coupons || []).map((c) =>
                    c.id === cleanCouponId
                      ? {
                          ...c,
                          status: 'Used' as const,
                          usedAt: now,
                          usedByParticipantId: apiRes.id,
                          usedByParticipantName: input.name.trim(),
                          usedByParticipantPhone: phone,
                        }
                      : c
                  )
                : prev.coupons

              return {
                ...prev,
                participants: [apiRes.participant!, ...prev.participants],
                coupons: updatedCoupons,
              }
            })
            return { ok: true, id: apiRes.id }
          } else if (!apiRes.ok && apiRes.error) {
            return { ok: false, error: apiRes.error }
          }
        } catch (e) {
          console.warn('API register error, saving locally:', e)
        }

        // Fallback local save
        const id = nextParticipantId(data.participants.map((p) => p.id))
        const now = new Date().toISOString().slice(0, 10)
        const participant: Participant = {
          ...input,
          phone,
          id,
          couponId: cleanCouponId || undefined,
          registeredAt: now,
          eligibility: 'Eligible',
          status: 'Active',
        }

        let updatedCoupons = coupons
        if (cleanCouponId) {
          const existing = coupons.find((c) => c.id === cleanCouponId)
          if (existing) {
            updatedCoupons = coupons.map((c) =>
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
          } else {
            updatedCoupons = [
              ...coupons,
              {
                id: cleanCouponId,
                batchId: 'BATCH-EXTERNAL',
                status: 'Used' as const,
                createdAt: now,
                usedAt: now,
                usedByParticipantId: id,
                usedByParticipantName: input.name.trim(),
                usedByParticipantPhone: phone,
              },
            ]
          }
        }

        setData((prev) => ({
          ...prev,
          participants: [participant, ...prev.participants],
          coupons: updatedCoupons,
        }))

        return { ok: true, id }
      },
      bulkRegisterParticipants: async (inputs) => {
        try {
          const res = await api.bulkRegisterParticipants(inputs)
          if (res.ok) {
            await refreshData()
            return res
          }
        } catch {
          // fallback
        }

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
            participants: [...newParticipants, ...prev.participants],
          }))
        }

        return { added: newParticipants.length, duplicates, invalid }
      },
      updateParticipant: (id, patch) => {
        api.updateParticipant(id, patch).catch(() => {})
        setData((prev) => ({
          ...prev,
          participants: prev.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
      deleteParticipant: (id) => {
        api.deleteParticipant(id).catch(() => {})
        setData((prev) => ({
          ...prev,
          participants: prev.participants.filter((p) => p.id !== id),
          winners: prev.winners.filter((w) => w.participantId !== id),
        }))
      },
      addPrize: (prize) => {
        const id = `prize-${Date.now()}`
        api.addPrize(prize).catch(() => {})
        const newPrize: Prize = { ...prize, id }
        setData((prev) => ({ ...prev, prizes: [...prev.prizes, newPrize] }))
        return id
      },
      updatePrize: (id, patch) => {
        api.updatePrize(id, patch).catch(() => {})
        setData((prev) => ({
          ...prev,
          prizes: prev.prizes.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
      deletePrize: (id) => {
        api.deletePrize(id).catch(() => {})
        setData((prev) => ({ ...prev, prizes: prev.prizes.filter((p) => p.id !== id) }))
      },
      assignPrizeToDraw: (drawId, prizeId) => {
        api.updateDraw(drawId, { prizeId }).catch(() => {})
        api.updatePrize(prizeId, { assignedDrawId: drawId, status: 'Assigned' }).catch(() => {})
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
        api.addDraw(draw).catch(() => {})
        setData((prev) => ({ ...prev, draws: [...prev.draws, { ...draw, id }] }))
      },
      updateDraw: (id, patch) => {
        api.updateDraw(id, patch).catch(() => {})
        setData((prev) => ({
          ...prev,
          draws: prev.draws.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        }))
      },
      confirmWinner: async (participantId, drawId, customPrizeId) => {
        if (winnerParticipantIds.has(participantId)) {
          return { ok: false, error: 'This participant has already won a prize in a previous draw!' }
        }

        const draw = data.draws.find((d) => d.id === drawId)
        if (!draw) return { ok: false, error: 'Draw not found.' }

        const awardedPrizeId = customPrizeId || draw.prizeId
        const winnerId = `win-${Date.now()}`
        const now = new Date().toISOString().slice(0, 10)

        try {
          const res = await api.confirmWinner(participantId, drawId, awardedPrizeId)
          if (res.ok && res.winner) {
            await refreshData()
            return { ok: true, winnerId: res.winnerId || winnerId }
          }
        } catch {
          // fallback
        }

        const winner: Winner = {
          id: winnerId,
          drawId,
          participantId,
          prizeId: awardedPrizeId,
          date: now,
          status: 'Confirmed',
        }

        setData((prev) => ({
          ...prev,
          winners: [winner, ...prev.winners],
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
  }, [data, isAdmin, isOnline])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
