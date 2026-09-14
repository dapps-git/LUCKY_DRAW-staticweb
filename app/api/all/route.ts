import { NextResponse } from 'next/server'
import { connectDB } from '../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
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
      couponsCol.find({}, { projection: { id: 1, batchId: 1, status: 1, createdAt: 1, usedAt: 1, usedByParticipantName: 1, usedByParticipantPhone: 1, usedByParticipantId: 1 } }).sort({ createdAt: -1 }).limit(1000).toArray(),
    ])

    return NextResponse.json(
      {
        ok: true,
        prizes: prizes || [],
        draws: draws || [],
        participants: participants || [],
        winners: winners || [],
        batches: batches || [],
        totalCouponsCount: totalCoupons || 0,
        usedCouponsCount: registeredCoupons || (participants ? participants.length : 0),
        coupons: sampleCoupons || [],
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      }
    )
  } catch (err: any) {
    console.error('App Router /api/all error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
