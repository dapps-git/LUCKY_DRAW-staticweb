import { connectDB } from '../_db.js'

async function getNextParticipantId(collection) {
  const participants = await collection.find({}, { projection: { id: 1 } }).toArray()
  if (!participants.length) return 'VF2026-00101'

  let maxNum = 100
  for (const p of participants) {
    const match = (p.id || '').match(/\d+$/)
    if (match) {
      const num = parseInt(match[0], 10)
      if (num > maxNum) maxNum = num
    }
  }
  return `VF2026-${String(maxNum + 1).padStart(5, '0')}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const { name, phone: rawPhone, address, location, couponId: rawCoupon } = req.body || {}

    if (!rawPhone?.trim()) return res.status(400).json({ ok: false, error: 'Phone number is required' })

    const phone = rawPhone.replace(/\D/g, '').slice(-10)
    if (phone.length !== 10) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid 10-digit mobile number' })
    }

    // Clean and validate coupon code
    let cleanCoupon = ''
    if (rawCoupon) {
      cleanCoupon = rawCoupon.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase()
    }
    if (!cleanCoupon || cleanCoupon.length < 8 || cleanCoupon.length > 16) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid 13-character coupon code' })
    }

    const db = await connectDB()
    const participantsCol = db.collection('participants')
    const couponsCol = db.collection('coupons')
    const batchesCol = db.collection('couponbatches')

    // Check if coupon already used
    const usedBy = await participantsCol.findOne({ couponId: cleanCoupon })
    if (usedBy) {
      return res.status(400).json({ ok: false, error: 'This coupon is already taken.' })
    }

    const participantName = name?.trim() || `Shopper ${phone.slice(-4)}`
    const now = new Date().toISOString().slice(0, 10)
    let newParticipant = null

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const id = await getNextParticipantId(participantsCol)
        const doc = {
          id,
          name: participantName,
          phone,
          address: address?.trim() || 'Valanchery',
          location: location?.trim() || 'Valanchery',
          couponId: cleanCoupon,
          registeredAt: now,
          eligibility: 'Eligible',
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await participantsCol.insertOne(doc)
        newParticipant = doc
        break
      } catch (err) {
        if (err?.code === 11000 && attempt < 4) {
          await new Promise((r) => setTimeout(r, 50 * (attempt + 1)))
          continue
        }
        throw err
      }
    }

    // Update coupon state in DB
    if (cleanCoupon && newParticipant) {
      const existing = await couponsCol.findOne({ id: cleanCoupon })
      if (existing) {
        await couponsCol.updateOne(
          { id: cleanCoupon },
          {
            $set: {
              status: 'Used',
              usedAt: now,
              usedByParticipantId: newParticipant.id,
              usedByParticipantName: participantName,
              usedByParticipantPhone: phone,
            },
          }
        )
        await batchesCol.updateOne(
          { id: existing.batchId },
          { $inc: { unusedCount: -1, usedCount: 1 } }
        )
      } else {
        await couponsCol.insertOne({
          id: cleanCoupon,
          batchId: 'BATCH-EXTERNAL',
          status: 'Used',
          createdAt: now,
          usedAt: now,
          usedByParticipantId: newParticipant.id,
          usedByParticipantName: participantName,
          usedByParticipantPhone: phone,
        })
      }
    }

    res.status(201).json({ ok: true, id: newParticipant.id, participant: newParticipant })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ ok: false, error: err.message })
  }
}
