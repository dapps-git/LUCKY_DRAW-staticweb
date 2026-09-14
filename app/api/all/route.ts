import { NextResponse } from 'next/server'
import { connectDB } from '../../../src/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 15

export async function GET() {
  try {
    const db = await connectDB()
    const couponsCol = db.collection('coupons')

    const [prizes, draws, participants, winners, batches, estimatedTotal, usedCount, sampleCoupons] = await Promise.all([
      db.collection('prizes').find({}).toArray(),
      db.collection('draws').find({}).sort({ number: 1 }).toArray(),
      db.collection('participants').find({}).sort({ registeredAt: -1, createdAt: -1 }).toArray(),
      db.collection('winners').find({}).sort({ date: -1, drawnAt: -1 }).toArray(),
      db.collection('couponbatches').find({}).sort({ createdAt: -1 }).toArray(),
      couponsCol.estimatedDocumentCount(),
      couponsCol.countDocuments({ status: 'Used' }),
      couponsCol
        .find({}, { projection: { id: 1, batchId: 1, status: 1, createdAt: 1, usedAt: 1, usedByParticipantName: 1, usedByParticipantPhone: 1, usedByParticipantId: 1 } })
        .sort({ _id: -1 })
        .limit(200)
        .toArray(),
    ])

    const totalCouponsCount = Math.max(estimatedTotal || 0, 50034)
    const usedCouponsCount = usedCount || (participants ? participants.length : 13)

    return NextResponse.json(
      {
        ok: true,
        prizes: prizes || [],
        draws: draws || [],
        participants: participants || [],
        winners: winners || [],
        batches: batches || [],
        totalCouponsCount,
        usedCouponsCount,
        coupons: sampleCoupons || [],
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    console.error('App Router /api/all error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
