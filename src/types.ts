export type Eligibility = 'Eligible' | 'Ineligible'
export type ParticipantStatus = 'Active' | 'Inactive'
export type DrawStatus = 'Upcoming' | 'Live' | 'Completed'
export type PrizeStatus = 'Available' | 'Assigned' | 'Awarded'

export interface Participant {
  id: string
  name: string
  phone: string
  address: string
  location: string
  registeredAt: string
  eligibility: Eligibility
  status: ParticipantStatus
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
}
