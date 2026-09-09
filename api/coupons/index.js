import { connectDB } from '../_db.js'

export default async function handler(_req, res) {
  try {
    const db = await connectDB()
    const [coupons, batches] = await Promise.all([
      db.collection('coupons').find({}).sort({ createdAt: -1 }).toArray(),
      db.collection('couponbatches').find({}).sort({ createdAt: -1 }).toArray(),
    ])
    res.status(200).json({ ok: true, coupons, batches })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
