import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ADMIN_EMAIL, ADMIN_PASSWORD, seedData } from '../data/mockData'
import { nextParticipantId } from '../lib/format'
import { createCouponBatch } from '../lib/couponPdfGenerator'
import { api } from '../lib/api'
import { extractCouponId } from '../lib/tokenHelper'
import type { AppData, Coupon, CouponBatch, Draw, Participant, Prize, Winner } from '../types'

const AUTH_KEY = 'vf2026_admin_auth'
const DATA_KEY = 'vf2026_app_data_v5'

const DUMMY_IDS = new Set([
  'VF2026-00101',
  'VF2026-00102',
  'VF2026-00103',
  'VF2026-00104',
  'VF2026-00105',
  'VF2026-00106',
  'VF2026-00107',
  'VF2026-00108',
  'VF2026-00109',
  'VF2026-00110',
])

const DUMMY_PHONES = new Set([
  '9876543210',
  '9745123489',
  '9895012345',
  '9847123456',
  '9995432109',
  '8089123456',
  '9567123401',
  '9447123890',
  '8129345670',
  '9746011122',
])

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
    // Clear out old legacy cache keys that held dummy users
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('vf2026_app_data_v1')
      localStorage.removeItem('vf2026_app_data_v2')
      localStorage.removeItem('vf2026_app_data_v3')
      localStorage.removeItem('vf2026_app_data_v4')
    }

    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DATA_KEY) : null
    if (!raw) return seedData
    const parsed = JSON.parse(raw) as AppData

    // Strictly filter out any dummy users or seed winners from stored state
    const cleanParticipants = (parsed.participants || []).filter(
      (p) => !DUMMY_IDS.has(p.id) && !DUMMY_PHONES.has((p.phone || '').replace(/\D/g, '').slice(-10))
    )
    const cleanWinners = (parsed.winners || []).filter(
      (w) => !DUMMY_IDS.has(w.participantId) && w.id !== 'win-01' && w.id !== 'win-02'
    )
    const cleanCoupons = (parsed.coupons || []).filter((c) => c.batchId !== 'BATCH-SEED-01')
    const cleanBatches = (parsed.batches || []).filter((b) => b.id !== 'BATCH-SEED-01')

    return {
      ...seedData,
      ...parsed,
      participants: cleanParticipants,
      winners: cleanWinners,
      coupons: cleanCoupons,
      batches: cleanBatches,
    }
  } catch {
    return seedData
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => (typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_KEY) === '1' : false))
  const [data, setData] = useState<AppData>(loadLocalData)
  const [isOnline, setIsOnline] = useState(false)

  // Fetch data from MongoDB Atlas and auto-sync in real-time
  const refreshData = async () => {
    try {
      const serverData = await api.getAllData()
      const cleanParticipants = (serverData.participants || []).filter(
        (p) => !DUMMY_IDS.has(p.id) && !DUMMY_PHONES.has((p.phone || '').replace(/\D/g, '').slice(-10))
      )
      const cleanWinners = (serverData.winners || []).filter(
        (w) => !DUMMY_IDS.has(w.participantId) && w.id !== 'win-01' && w.id !== 'win-02'
      )
      setData((prev) => {
        // Only update state if participant count or data actually changed to prevent jitter
        if (
          prev.participants?.length === cleanParticipants.length &&
          (prev.winners?.length || 0) === cleanWinners.length &&
          (prev.coupons?.length || 0) === (serverData.coupons?.length || 0) &&
          (prev.draws?.length || 0) === (serverData.draws?.length || 0)
        ) {
          return prev
        }
        return {
          ...serverData,
          participants: cleanParticipants,
          winners: cleanWinners,
        }
      })
      setIsOnline(true)
    } catch (err) {
      console.warn('Backend offline, using local state:', err)
      setIsOnline(false)
    }
  }

  useEffect(() => {
    refreshData()
    // Real-time polling every 3 seconds to auto-load new participants registered from anywhere
    const timer = setInterval(refreshData, 3000)
    const onFocus = () => refreshData()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
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
      const cleanId = extractCouponId(couponId) || (couponId ? couponId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase() : '')
      if (!cleanId || cleanId.length < 8 || cleanId.length > 16) {
        return { valid: false, status: 'Invalid', message: 'Token ID must be a valid 13-character festival code.' }
      }

      // Check if already used by any participant
      const registeredUser = data.participants.find((p) => p.couponId === cleanId)
      if (registeredUser) {
        return {
          valid: false,
          status: 'Used',
          message: 'This coupon is already taken.',
        }
      }

      // Check in coupons list
      const found = coupons.find((c) => c.id === cleanId)
      if (found) {
        if (found.status === 'Used') {
          return {
            valid: false,
            status: 'Used',
            coupon: found,
            message: 'This coupon is already taken.',
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
        const cleanId = extractCouponId(couponId) || (couponId ? couponId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase() : '')
        if (cleanId.length >= 8 && cleanId.length <= 16) {
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

        let cleanCouponId = ''
        if (input.couponId) {
          cleanCouponId = extractCouponId(input.couponId) || input.couponId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase()
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

        const existingIds = [...data.participants.map((p) => p.id)]
        const newParticipants: Participant[] = []
        let invalid = 0

        inputs.forEach((input) => {
          const phone = input.phone.replace(/\D/g, '').slice(-10)
          if (phone.length < 10) {
            invalid++
            return
          }
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

        return { added: newParticipants.length, duplicates: 0, invalid }
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
