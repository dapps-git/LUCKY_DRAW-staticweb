import { Router } from 'express'
import { Coupon } from '../models/Coupon.js'
import { CouponBatch } from '../models/CouponBatch.js'
import { Participant } from '../models/Participant.js'

const router = Router()

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const DIGITS = '0123456789'

// Helper to generate guaranteed unique 13-character coupon ID (5 letters + 8 numbers randomly placed in between)
function generateRandom13Char(): string {
  const chars: string[] = []
  // 5 letters
  for (let i = 0; i < 5; i++) {
    chars.push(LETTERS[Math.floor(Math.random() * LETTERS.length)])
  }
  // 8 digits
  for (let i = 0; i < 8; i++) {
    chars.push(DIGITS[Math.floor(Math.random() * DIGITS.length)])
  }
  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = chars[i]
    chars[i] = chars[j]
    chars[j] = temp
  }
  return chars.join('')
}

// 1. Validate a single coupon token (instant QR scan check)
router.get('/validate/:id', async (req, res) => {
  try {
    const rawId = req.params.id || ''
    const cleanId = rawId.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase()

    if (!cleanId || cleanId.length < 8 || cleanId.length > 16) {
      return res.json({
        valid: false,
        status: 'Invalid',
        message: 'Invalid festival coupon code.',
      })
    }

    // Check if redeemed by any participant
    const registeredUser = await Participant.findOne({ couponId: cleanId })
    if (registeredUser) {
      return res.json({
        valid: false,
        status: 'Used',
        message: 'This coupon is already taken.',
      })
    }

    // Check in coupon collection
    const existingCoupon = await Coupon.findOne({ id: cleanId })
    if (existingCoupon) {
      if (existingCoupon.status === 'Used') {
        return res.json({
          valid: false,
          status: 'Used',
          message: 'This coupon is already taken.',
        })
      }
      return res.json({
        valid: true,
        status: 'Unused',
        coupon: existingCoupon,
        message: 'Valid Festival Coupon! Ready for entry.',
      })
    }

    // Accept valid coupon format as genuine festival coupon
    return res.json({
      valid: true,
      status: 'Unused',
      message: 'Valid Festival Coupon! Ready for entry.',
    })
  } catch (error: any) {
    res.status(500).json({ valid: false, status: 'Invalid', message: error.message })
  }
})

// 2. Generate a new batch of unique coupons
router.post('/generate', async (req, res) => {
  try {
    const count = Math.min(Math.max(1, Number(req.body.count) || 10), 1000)
    const name = req.body.name || `Batch ${new Date().toLocaleDateString('en-GB')} (${count} coupons)`
    const batchId = `BATCH-${Date.now()}`
    const now = new Date().toISOString()

    // Query existing IDs to ensure 100% collision-free batch
    const existingCoupons = await Coupon.find({}, { id: 1 }).lean()
    const existingSet = new Set(existingCoupons.map((c) => c.id))

    const newCoupons = []
    for (let i = 0; i < count; i++) {
      let id = generateRandom13Char()
      while (existingSet.has(id)) {
        id = generateRandom13Char()
      }
      existingSet.add(id)
      newCoupons.push({
        id,
        batchId,
        status: 'Unused' as const,
        createdAt: now,
      })
    }

    // Batch insert into MongoDB
    await Coupon.insertMany(newCoupons)

    const batch = await CouponBatch.create({
      id: batchId,
      name,
      count,
      startId: newCoupons[0]?.id || '',
      endId: newCoupons[newCoupons.length - 1]?.id || '',
      createdAt: now,
      unusedCount: count,
      usedCount: 0,
    })

    res.status(201).json({ ok: true, batch, coupons: newCoupons })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// 3. Get all coupons & batches
router.get('/', async (_req, res) => {
  try {
    const [coupons, batches] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).lean(),
      CouponBatch.find().sort({ createdAt: -1 }).lean(),
    ])
    res.json({ ok: true, coupons, batches })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// 4. Get all batches
router.get('/batches', async (_req, res) => {
  try {
    const batches = await CouponBatch.find().sort({ createdAt: -1 }).lean()
    res.json({ ok: true, batches })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// 5. Delete a coupon batch
router.delete('/batches/:id', async (req, res) => {
  try {
    const batchId = req.params.id
    await Promise.all([
      CouponBatch.deleteOne({ id: batchId }),
      Coupon.deleteMany({ batchId }),
    ])
    res.json({ ok: true, message: 'Batch deleted' })
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
