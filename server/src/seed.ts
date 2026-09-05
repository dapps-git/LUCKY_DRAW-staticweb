import { Coupon } from './models/Coupon.js'
import { CouponBatch } from './models/CouponBatch.js'
import { Participant } from './models/Participant.js'
import { Prize } from './models/Prize.js'
import { Draw } from './models/Draw.js'
import { Winner } from './models/Winner.js'

export const seedPrizes = [
  {
    id: 'prize-tv',
    name: 'Smart TV',
    description: '55-inch 4K Ultra HD smart television for the festival home.',
    value: '₹42,000',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-01',
    status: 'Awarded' as const,
  },
  {
    id: 'prize-voucher',
    name: 'Gift Voucher',
    description: 'Festival shopping voucher valid at all partner stores.',
    value: '₹10,000',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-02',
    status: 'Awarded' as const,
  },
  {
    id: 'prize-laptop',
    name: 'Premium Laptop',
    description: 'High-speed 16GB RAM laptop for work, study and celebration.',
    value: '₹58,000',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-03',
    status: 'Assigned' as const,
  },
  {
    id: 'prize-phone',
    name: 'Flagship Smartphone',
    description: 'Flagship 5G smartphone — the upcoming grand lucky draw prize.',
    value: '₹35,000',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-04',
    status: 'Assigned' as const,
  },
  {
    id: 'prize-fridge',
    name: 'Double-Door Refrigerator',
    description: 'Energy-efficient frost-free refrigerator for home.',
    value: '₹32,000',
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-05',
    status: 'Assigned' as const,
  },
  {
    id: 'prize-washer',
    name: 'Washing Machine',
    description: 'Fully automatic inverter front-load washing machine.',
    value: '₹28,000',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-06',
    status: 'Assigned' as const,
  },
  {
    id: 'prize-festival',
    name: 'Special Gold Hamper',
    description: 'Grand festive gold coin hamper and celebration voucher.',
    value: '₹75,000',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
    assignedDrawId: 'draw-10',
    status: 'Assigned' as const,
  },
]

export const seedDraws = [
  { id: 'draw-01', number: 1, date: '2026-08-15', prizeId: 'prize-tv', winnerCount: 1, status: 'Completed' as const },
  { id: 'draw-02', number: 2, date: '2026-08-30', prizeId: 'prize-voucher', winnerCount: 1, status: 'Completed' as const },
  { id: 'draw-03', number: 3, date: '2026-09-15', prizeId: 'prize-laptop', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-04', number: 4, date: '2026-09-30', prizeId: 'prize-phone', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-05', number: 5, date: '2026-10-15', prizeId: 'prize-fridge', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-06', number: 6, date: '2026-10-30', prizeId: 'prize-washer', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-07', number: 7, date: '2026-11-15', prizeId: 'prize-laptop', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-08', number: 8, date: '2026-11-30', prizeId: 'prize-tv', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-09', number: 9, date: '2026-12-15', prizeId: 'prize-phone', winnerCount: 1, status: 'Upcoming' as const },
  { id: 'draw-10', number: 10, date: '2026-12-30', prizeId: 'prize-festival', winnerCount: 1, status: 'Upcoming' as const },
]

export const seedParticipants = [
  { id: 'VF2026-00101', name: 'Muhammed Saleel', phone: '9876543210', address: 'Near Town Juma Masjid, Main Road', location: 'Valanchery', registeredAt: '2026-06-12', couponId: '7492018401', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00102', name: 'Aisha Rahman', phone: '9745123489', address: 'Rahman Manzil, Kottakkal Road', location: 'Malappuram', registeredAt: '2026-06-14', couponId: '7492018402', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00103', name: 'Fathima Nihala', phone: '9895012345', address: 'House No. 12, Railway Station Road', location: 'Tirur', registeredAt: '2026-06-18', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00104', name: 'Abdul Kareem', phone: '9847123456', address: 'Kareem Stores, Market Junction', location: 'Valanchery', registeredAt: '2026-06-20', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00105', name: 'Sneha Krishnan', phone: '9995432109', address: 'Krishna Nivas, Temple Road', location: 'Kuttippuram', registeredAt: '2026-06-22', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00106', name: 'Mohammed Irshad', phone: '8089123456', address: 'Irshad Villa, Bypass', location: 'Edappal', registeredAt: '2026-06-25', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00107', name: 'Diya Fathima', phone: '9567123401', address: 'Fathima Cottage, College Road', location: 'Ponnani', registeredAt: '2026-07-01', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00108', name: 'Vishnu Prasad', phone: '9447123890', address: 'Prasad House, NH 66', location: 'Kottakkal', registeredAt: '2026-07-04', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00109', name: 'Shahana Sherin', phone: '8129345670', address: 'Sherin Mahal, Mini Bypass', location: 'Valanchery', registeredAt: '2026-07-08', eligibility: 'Eligible' as const, status: 'Active' as const },
  { id: 'VF2026-00110', name: 'Nabeel Rahman', phone: '9746011122', address: 'Rahman Quarters, Bus Stand', location: 'Perinthalmanna', registeredAt: '2026-07-11', eligibility: 'Eligible' as const, status: 'Active' as const },
]

export const seedWinners = [
  { id: 'win-01', drawId: 'draw-01', participantId: 'VF2026-00101', prizeId: 'prize-tv', date: '2026-08-15', status: 'Confirmed' as const },
  { id: 'win-02', drawId: 'draw-02', participantId: 'VF2026-00102', prizeId: 'prize-voucher', date: '2026-08-30', status: 'Confirmed' as const },
]

export async function seedDatabase() {
  try {
    const prizeCount = await Prize.countDocuments()
    if (prizeCount === 0) {
      await Prize.insertMany(seedPrizes)
      console.log('✅ Seeded default festival prizes')
    }

    const drawCount = await Draw.countDocuments()
    if (drawCount === 0) {
      await Draw.insertMany(seedDraws)
      console.log('✅ Seeded 10 festival draws')
    }

    const participantCount = await Participant.countDocuments()
    if (participantCount === 0) {
      await Participant.insertMany(seedParticipants)
      console.log('✅ Seeded initial participants')
    }

    const winnerCount = await Winner.countDocuments()
    if (winnerCount === 0) {
      await Winner.insertMany(seedWinners)
      console.log('✅ Seeded winners')
    }

    const batchCount = await CouponBatch.countDocuments()
    if (batchCount === 0) {
      const batchId = 'BATCH-SEED-01'
      const now = new Date().toISOString()
      const coupons = []
      for (let i = 1; i <= 10; i++) {
        const id = `74920184${String(i).padStart(2, '0')}`
        const isUsed = i <= 2
        coupons.push({
          id,
          batchId,
          status: isUsed ? ('Used' as const) : ('Unused' as const),
          createdAt: now,
          usedAt: isUsed ? '2026-08-05' : undefined,
          usedByParticipantId: i === 1 ? 'VF2026-00101' : i === 2 ? 'VF2026-00102' : undefined,
          usedByParticipantName: i === 1 ? 'Muhammed Saleel' : i === 2 ? 'Aisha Rahman' : undefined,
          usedByParticipantPhone: i === 1 ? '9876543210' : i === 2 ? '9745123489' : undefined,
        })
      }
      await Coupon.insertMany(coupons)
      await CouponBatch.create({
        id: batchId,
        name: 'Launch Promotional Batch (10 Coupons)',
        count: 10,
        startId: '7492018401',
        endId: '7492018410',
        createdAt: now,
        unusedCount: 8,
        usedCount: 2,
      })
      console.log('✅ Seeded launch coupon batch')
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}
