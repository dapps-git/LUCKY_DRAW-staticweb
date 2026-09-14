import { connectDB } from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { id, couponId } = req.query || {}
    const rawTarget = id || couponId || req.url?.split('/')?.pop()?.split('?')?.[0]
    if (!rawTarget) {
      return res.status(400).json({ valid: false, status: 'Invalid', message: 'Coupon ID required' })
    }

    const clean = rawTarget.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    const db = await connectDB()
    const coupon = await db.collection('coupons').findOne({ id: clean })

    if (!coupon) {
      return res.status(404).json({ valid: false, status: 'Invalid', message: 'Coupon not found' })
    }

    if (coupon.status === 'Used') {
      return res.json({ valid: false, status: 'Used', coupon, message: 'Coupon already registered' })
    }

    return res.json({ valid: true, status: 'Unused', coupon, message: 'Coupon is valid' })
  } catch (err) {
    return res.status(500).json({ valid: false, status: 'Invalid', message: err.message })
  }
}
