import { connectDB } from '../_db.js'

export default async function handler(req, res) {
  try {
    const db = await connectDB()
    const participantsCol = db.collection('participants')
    const couponsCol = db.collection('coupons')

    // Fetch current participants and used coupons
    const participants = await participantsCol.find({}).toArray()
    const existingCouponIds = new Set(participants.map(p => p.couponId).filter(Boolean))
    const existingIds = new Set(participants.map(p => p.id))

    const usedCoupons = await couponsCol.find({ status: 'Used' }).toArray()

    // Find used coupons that don't have an entry in participants collection
    let nextCounter = 101
    const toInsert = []

    for (const c of usedCoupons) {
      if (!c.id || existingCouponIds.has(c.id)) {
        continue
      }

      let chosenId = c.usedByParticipantId
      if (!chosenId || existingIds.has(chosenId)) {
        while (existingIds.has(`VF2026-${String(nextCounter).padStart(5, '0')}`)) {
          nextCounter++
        }
        chosenId = `VF2026-${String(nextCounter).padStart(5, '0')}`
        nextCounter++
        // Update coupon so the ticket ID stays in sync
        await couponsCol.updateOne({ id: c.id }, { $set: { usedByParticipantId: chosenId } })
      }

      existingIds.add(chosenId)
      existingCouponIds.add(c.id)

      const regDate = c.usedAt || (c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : '2026-09-08')
      const doc = {
        id: chosenId,
        name: c.usedByParticipantName || 'Registered User',
        phone: (c.usedByParticipantPhone || '').replace(/\D/g, '').slice(-10),
        address: c.usedByAddress || 'Valanchery',
        location: c.usedByLocation || 'Valanchery',
        couponId: c.id,
        registeredAt: regDate,
        eligibility: 'Eligible',
        status: 'Active',
        createdAt: c.createdAt || new Date(),
        updatedAt: new Date(),
      }
      toInsert.push(doc)
    }

    if (toInsert.length > 0) {
      try {
        await participantsCol.insertMany(toInsert, { ordered: false })
      } catch (insertErr) {
        console.warn('Sync insert participants warning:', insertErr.message)
      }
    }

    // Return all participants sorted by registeredAt desc, createdAt desc, _id desc
    const allParticipants = await participantsCol.find({}).sort({ registeredAt: -1, createdAt: -1, _id: -1 }).toArray()
    res.status(200).json({ ok: true, participants: allParticipants, count: allParticipants.length })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
