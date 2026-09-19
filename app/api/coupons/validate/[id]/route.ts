import { NextResponse } from 'next/server'
import { connectDB } from '../../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ valid: false, status: 'Invalid', message: 'Coupon ID required' }, { status: 400 })
    }

    const clean = id.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    const db = await connectDB()

    // 1. Check if participant already used this coupon
    const p = await db.collection('participants').findOne({ couponId: clean })
    if (p) {
      return NextResponse.json({
        valid: false,
        status: 'Used',
        coupon: { id: clean, status: 'Used', usedByParticipantName: p.name, usedAt: p.registeredAt },
        message: 'This coupon has already been used and is no longer valid.',
      })
    }

    // 2. Check coupon collection
    const coupon = await db.collection('coupons').findOne({ id: clean })
    if (coupon) {
      if (coupon.status === 'Used') {
        return NextResponse.json({
          valid: false,
          status: 'Used',
          coupon,
          message: 'This coupon has already been used and is no longer valid.',
        })
      }
      return NextResponse.json({
        valid: true,
        status: 'Unused',
        coupon,
        message: 'Valid Festival Coupon! Ready for registration.',
      })
    }

    // 3. If coupons collection has records, reject unknown codes
    const totalCoupons = await db.collection('coupons').estimatedDocumentCount()
    if (totalCoupons > 0) {
      return NextResponse.json({
        valid: false,
        status: 'Invalid',
        message: 'This coupon was not found in the festival database.',
      })
    }

    return NextResponse.json({
      valid: true,
      status: 'Unused',
      coupon: { id: clean, status: 'Unused' },
      message: 'Valid Festival Coupon! Ready for registration.',
    })
  } catch (err: any) {
    return NextResponse.json({ valid: false, status: 'Invalid', message: err.message || 'Validation error' }, { status: 500 })
  }
}
