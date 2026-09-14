import { connectDB } from './_db.js'

export default async function handler(_req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (_req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const db = await connectDB()
    const couponsCol = db.collection('coupons')

    const [prizes, draws, participants, winners, batches, totalCoupons, registeredCoupons, sampleCoupons] = await Promise.all([
      db.collection('prizes').find({}).toArray(),
      db.collection('draws').find({}).sort({ number: 1 }).toArray(),
      db.collection('participants').find({}).sort({ registeredAt: -1, createdAt: -1 }).toArray(),
      db.collection('winners').find({}).sort({ date: -1, drawnAt: -1 }).toArray(),
      db.collection('couponbatches').find({}).sort({ createdAt: -1 }).toArray(),
      couponsCol.countDocuments(),
      couponsCol.countDocuments({ status: 'Used' }),
      // Lightweight sample for initial render (registered + recent unused)
      couponsCol.find({}, { projection: { id: 1, batchId: 1, status: 1, createdAt: 1, usedAt: 1, usedByParticipantName: 1, usedByParticipantPhone: 1, usedByParticipantId: 1 } }).sort({ createdAt: -1 }).limit(1000).toArray(),
    ])

    return res.status(200).json({
      ok: true,
      prizes: prizes || [],
      draws: draws || [],
      participants: participants || [],
      winners: winners || [],
      batches: batches || [],
      totalCouponsCount: totalCoupons || 0,
      usedCouponsCount: registeredCoupons || participants.length || 0,
      coupons: sampleCoupons || [],
    })
  } catch (err) {
    console.error('API /api/all error:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}
