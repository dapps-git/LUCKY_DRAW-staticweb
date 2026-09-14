import { connectDB } from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const { batch, coupons } = req.body || {}
    if (!coupons || !Array.isArray(coupons) || coupons.length === 0) {
      return res.status(400).json({ ok: false, error: 'Coupons array is required' })
    }

    const db = await connectDB()
    const couponsCol = db.collection('coupons')
    const batchesCol = db.collection('couponbatches')

    // Bulk insert chunk with duplicate ignoring
    try {
      await couponsCol.insertMany(coupons, { ordered: false })
    } catch (insertErr) {
      // Ignore duplicate key errors if some already exist
      if (!insertErr.writeErrors && !insertErr.insertedDocs) {
        throw insertErr
      }
    }

    // If batch object is provided, upsert batch
    if (batch && batch.id) {
      await batchesCol.updateOne(
        { id: batch.id },
        {
          $set: {
            id: batch.id,
            name: batch.name || `Batch ${batch.id}`,
            count: batch.count || coupons.length,
            startId: batch.startId || coupons[0]?.id || '',
            endId: batch.endId || coupons[coupons.length - 1]?.id || '',
            createdAt: batch.createdAt || new Date().toISOString(),
            unusedCount: batch.unusedCount ?? batch.count ?? coupons.length,
            usedCount: batch.usedCount ?? 0,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      )
    }

    return res.status(200).json({
      ok: true,
      insertedCount: coupons.length,
      batchId: batch?.id,
    })
  } catch (err) {
    console.error('Bulk insert error:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}
