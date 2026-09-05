export type Eligibility = 'Eligible' | 'Ineligible'
export type ParticipantStatus = 'Active' | 'Inactive'
export type DrawStatus = 'Upcoming' | 'Live' | 'Completed'
export type PrizeStatus = 'Available' | 'Assigned' | 'Awarded'
export type CouponStatus = 'Unused' | 'Used'

export interface Participant {
  id: string
  name: string
  phone: string
  address: string
  location: string
  registeredAt: string
  eligibility: Eligibility
  status: ParticipantStatus
  couponId?: string
}

export interface Coupon {
  id: string // 10-digit unique string e.g. "7294018253"
  batchId: string
  status: CouponStatus
  createdAt: string
  usedAt?: string
  usedByParticipantId?: string
  usedByParticipantName?: string
  usedByParticipantPhone?: string
}

export interface CouponBatch {
  id: string
  name: string
  count: number
  startId: string
  endId: string
  createdAt: string
  unusedCount: number
  usedCount: number
}

export interface Prize {
  id: string
  name: string
  description: string
  value: string
  image: string
  assignedDrawId: string | null
  status: PrizeStatus
}

export interface Draw {
  id: string
  number: number
  date: string
  prizeId: string
  winnerCount: number
  status: DrawStatus
}

export interface Winner {
  id: string
  drawId: string
  participantId: string
  prizeId: string
  date: string
  status: 'Confirmed'
}

export interface AppData {
  participants: Participant[]
  prizes: Prize[]
  draws: Draw[]
  winners: Winner[]
  coupons?: Coupon[]
  batches?: CouponBatch[]
}

