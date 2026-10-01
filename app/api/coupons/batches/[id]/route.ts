import { NextResponse } from 'next/server'
import { connectDB } from '../../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Batch ID is required' }, { status: 400 })
    }

    const db = await connectDB()
    const batchesCol = db.collection('couponbatches')
    const couponsCol = db.collection('coupons')
    const participantsCol = db.collection('participants')
    const winnersCol = db.collection('winners')

    // 1. Find all coupons in this batch
    const batchCoupons = await couponsCol.find({ batchId: id }, { projection: { id: 1, serialNo: 1 } }).toArray()
    const couponIdentifiers = new Set<string>()
    batchCoupons.forEach((c: any) => {
      if (c.id) couponIdentifiers.add(String(c.id).toUpperCase())
      if (c.serialNo) couponIdentifiers.add(String(c.serialNo).toUpperCase())
    })
    const couponIdsArray = Array.from(couponIdentifiers)

    // 2. Find and delete participants registered with these coupons
    let deletedParticipantsCount = 0
    let deletedWinnersCount = 0

    if (couponIdsArray.length > 0) {
      const participantsToDelete = await participantsCol
        .find({ couponId: { $in: couponIdsArray } }, { projection: { id: 1 } })
        .toArray()

      const participantIds = participantsToDelete.map((p: any) => p.id).filter(Boolean)

      if (participantIds.length > 0) {
        const [partRes, winRes] = await Promise.all([
          participantsCol.deleteMany({ id: { $in: participantIds } }),
          winnersCol.deleteMany({ participantId: { $in: participantIds } }),
        ])
        deletedParticipantsCount = partRes.deletedCount
        deletedWinnersCount = winRes.deletedCount
      }
    }

    // 3. Delete batch metadata and all associated coupon tokens
    const [batchRes, couponsRes] = await Promise.all([
      batchesCol.deleteOne({ id }),
      couponsCol.deleteMany({ batchId: id }),
    ])

    return NextResponse.json(
      {
        ok: true,
        message: 'Batch, coupons, and registered participants deleted successfully',
        deletedBatches: batchRes.deletedCount,
        deletedCoupons: couponsRes.deletedCount,
        deletedParticipants: deletedParticipantsCount,
        deletedWinners: deletedWinnersCount,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        },
      }
    )
  } catch (err: any) {
    console.error('DELETE /api/coupons/batches/[id] error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
