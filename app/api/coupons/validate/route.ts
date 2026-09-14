import { NextResponse } from 'next/server'
import { connectDB } from '../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || searchParams.get('couponId') || ''
    if (!id) {
      return NextResponse.json({ valid: false, status: 'Invalid', message: 'Coupon ID required' }, { status: 400 })
    }

    const clean = id.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    const db = await connectDB()
    const coupon = await db.collection('coupons').findOne({ id: clean })

    if (!coupon) {
      return NextResponse.json({ valid: false, status: 'Invalid', message: 'Coupon not found' }, { status: 404 })
    }

    if (coupon.status === 'Used') {
      return NextResponse.json({ valid: false, status: 'Used', coupon, message: 'Coupon already registered' })
    }

    return NextResponse.json({ valid: true, status: 'Unused', coupon, message: 'Coupon is valid' })
  } catch (err: any) {
    return NextResponse.json({ valid: false, status: 'Invalid', message: err.message }, { status: 500 })
  }
}
