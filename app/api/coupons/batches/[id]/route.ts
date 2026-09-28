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

    // Delete batch metadata and all associated coupon tokens
    const [batchRes, couponsRes] = await Promise.all([
      batchesCol.deleteOne({ id }),
      couponsCol.deleteMany({ batchId: id }),
    ])

    return NextResponse.json(
      {
        ok: true,
        message: 'Batch and associated coupons deleted successfully',
        deletedBatches: batchRes.deletedCount,
        deletedCoupons: couponsRes.deletedCount,
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
