import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ADMIN_EMAIL, ADMIN_PASSWORD, seedData } from '../data/mockData'
import { nextParticipantId } from '../lib/format'
import type { AppData, Draw, Participant, Prize, Winner } from '../types'

const AUTH_KEY = 'vf2026_admin_auth'
const DATA_KEY = 'vf2026_app_data'

interface AppContextValue {
  data: AppData
  isAdmin: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  registerParticipant: (input: Omit<Participant, 'id' | 'registeredAt' | 'eligibility' | 'status'>) =>
    | { ok: true; id: string }
    | { ok: false; error: string }
  updateParticipant: (id: string, patch: Partial<Participant>) => void
  deleteParticipant: (id: string) => void
  addPrize: (prize: Omit<Prize, 'id'>) => void
  updatePrize: (id: string, patch: Partial<Prize>) => void
  deletePrize: (id: string) => void
  addDraw: (draw: Omit<Draw, 'id'>) => void
  updateDraw: (id: string, patch: Partial<Draw>) => void
  confirmWinner: (participantId: string, drawId: string) => void
  getPrize: (id: string) => Prize | undefined
  getParticipant: (id: string) => Participant | undefined
  getDraw: (id: string) => Draw | undefined
  nextDraw: Draw | undefined
  eligibleParticipants: Participant[]
}

const AppContext = createContext<AppContextValue | null>(null)

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) return seedData
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.participants?.length) return seedData

    // Merge any missing seed participants so new data shows up immediately
    const existingIds = new Set(parsed.participants.map((p) => p.id))
    const missing = seedData.participants.filter((p) => !existingIds.has(p.id))
    if (missing.length > 0) {
      const merged: AppData = {
        ...seedData,
        ...parsed,
        participants: [...parsed.participants, ...missing],
      }
      return merged
    }

    return parsed
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
    const eligibleParticipants = data.participants.filter(
      (p) => p.eligibility === 'Eligible' && p.status === 'Active',
    )
    const nextDraw = [...data.draws]
      .filter((d) => d.status === 'Upcoming')
      .sort((a, b) => a.date.localeCompare(b.date))[0]

    return {
      data,
      isAdmin,
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
      registerParticipant: (input) => {
        const phone = input.phone.replace(/\D/g, '').slice(-10)
        if (data.participants.some((p) => p.phone.slice(-10) === phone)) {
          return { ok: false, error: 'This phone number is already registered.' }
        }
        const id = nextParticipantId(data.participants.map((p) => p.id))
        const participant: Participant = {
          ...input,
          phone,
          id,
          registeredAt: new Date().toISOString().slice(0, 10),
          eligibility: 'Eligible',
          status: 'Active',
        }
        setData((prev) => ({ ...prev, participants: [...prev.participants, participant] }))
        return { ok: true, id }
      },
      updateParticipant: (id, patch) => {
        setData((prev) => ({
          ...prev,
          participants: prev.participants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
      deleteParticipant: (id) => {
        setData((prev) => ({ ...prev, participants: prev.participants.filter((p) => p.id !== id) }))
      },
      addPrize: (prize) => {
        const id = `prize-${Date.now()}`
        setData((prev) => ({ ...prev, prizes: [...prev.prizes, { ...prize, id }] }))
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
      confirmWinner: (participantId, drawId) => {
        const draw = data.draws.find((d) => d.id === drawId)
        if (!draw) return
        const winner: Winner = {
          id: `win-${Date.now()}`,
          drawId,
          participantId,
          prizeId: draw.prizeId,
          date: new Date().toISOString().slice(0, 10),
          status: 'Confirmed',
        }
        setData((prev) => ({
          ...prev,
          winners: [...prev.winners, winner],
          draws: prev.draws.map((d) => (d.id === drawId ? { ...d, status: 'Completed' as const } : d)),
          prizes: prev.prizes.map((p) =>
            p.id === draw.prizeId ? { ...p, status: 'Awarded' as const } : p,
          ),
        }))
      },
      getPrize,
      getParticipant,
      getDraw,
      nextDraw,
      eligibleParticipants,
    }
  }, [data, isAdmin])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
