import { connectDB } from '../_db.js'

function generateRandom13Char() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '23456789'
  let res = ''
  for (let i = 0; i < 5; i++) res += letters[Math.floor(Math.random() * letters.length)]
  for (let i = 0; i < 8; i++) res += digits[Math.floor(Math.random() * digits.length)]
  return res
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const count = Math.min(Math.max(1, Number(req.body?.count) || 10), 10000)
    const name = req.body?.name || `Batch ${new Date().toLocaleDateString('en-GB')} (${count} coupons)`
    const batchId = `BATCH-${Date.now()}`
    const now = new Date().toISOString()

    const db = await connectDB()
    const couponsCol = db.collection('coupons')
    const batchesCol = db.collection('couponbatches')

    const existingCoupons = await couponsCol.find({}, { projection: { id: 1 } }).toArray()
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
        status: 'Unused',
        createdAt: now,
      })
    }

    await couponsCol.insertMany(newCoupons)

    const batch = {
      id: batchId,
      name,
      count,
      startId: newCoupons[0]?.id || '',
      endId: newCoupons[newCoupons.length - 1]?.id || '',
      createdAt: now,
      unusedCount: count,
      usedCount: 0,
    }
    await batchesCol.insertOne(batch)

    res.status(201).json({ ok: true, batch, coupons: newCoupons })
  } catch (err) {
    console.error('Coupon generation error:', err)
    res.status(500).json({ ok: false, error: err.message })
  }
}
