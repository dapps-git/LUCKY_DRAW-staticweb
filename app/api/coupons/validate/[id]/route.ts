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
    const coupon = await db.collection('coupons').findOne({ id: clean })

    if (!coupon) {
      // Check if participant registered with this ID
      const p = await db.collection('participants').findOne({ couponId: clean })
      if (p) {
        return NextResponse.json({ valid: false, status: 'Used', coupon: { id: clean, status: 'Used', usedByParticipantName: p.name }, message: 'Coupon already registered' })
      }
      return NextResponse.json({ valid: true, status: 'Unused', coupon: { id: clean, status: 'Unused' }, message: 'Valid Festival Coupon! Ready for entry.' })
    }

    if (coupon.status === 'Used') {
      return NextResponse.json({ valid: false, status: 'Used', coupon, message: 'Coupon already registered' })
    }

    return NextResponse.json({ valid: true, status: 'Unused', coupon, message: 'Coupon is valid' })
  } catch (err: any) {
    return NextResponse.json({ valid: true, status: 'Unused', message: 'Valid Festival Coupon! Ready for entry.' })
  }
}
