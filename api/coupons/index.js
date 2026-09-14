import { connectDB } from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const db = await connectDB()
    const couponsCol = db.collection('coupons')
    const batchesCol = db.collection('couponbatches')

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(500, Number(req.query.limit) || 50)
    const skip = (page - 1) * limit
    const search = (req.query.search || '').trim()
    const status = req.query.status || ''

    const query = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      const cleanSearch = search.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
      query.$or = [
        { id: { $regex: cleanSearch, $options: 'i' } },
        { usedByParticipantName: { $regex: search, $options: 'i' } },
        { usedByParticipantPhone: { $regex: search, $options: 'i' } },
      ]
    }

    const [totalCoupons, filteredCount, coupons, batches] = await Promise.all([
      couponsCol.countDocuments(),
      couponsCol.countDocuments(query),
      couponsCol.find(query, { projection: { id: 1, batchId: 1, status: 1, createdAt: 1, usedAt: 1, usedByParticipantName: 1, usedByParticipantPhone: 1, usedByParticipantId: 1 } }).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      batchesCol.find({}).sort({ createdAt: -1 }).toArray(),
    ])

    res.status(200).json({
      ok: true,
      totalCoupons,
      filteredCount,
      page,
      limit,
      coupons: coupons || [],
      batches: batches || [],
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
