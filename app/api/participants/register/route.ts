import { NextResponse } from 'next/server'
import { connectDB } from '../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, address, location, couponId } = body || {}
    if (!phone) {
      return NextResponse.json({ ok: false, error: 'Phone number is required' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    const cleanCouponId = couponId ? couponId.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : ''
    const db = await connectDB()
    const participantsCol = db.collection('participants')
    const couponsCol = db.collection('coupons')

    // Check if phone already registered with this coupon
    const existing = await participantsCol.findOne({
      phone: cleanPhone,
      couponId: cleanCouponId,
    })
    if (existing) {
      return NextResponse.json({ ok: true, id: existing.id, participant: existing })
    }

    // Next ID
    const count = await participantsCol.countDocuments()
    const participantId = `VF2026-${String(count + 1).padStart(5, '0')}`
    const now = new Date().toISOString()

    const newParticipant = {
      id: participantId,
      name: name || 'Festival Participant',
      phone: cleanPhone,
      address: address || '',
      location: location || '',
      couponId: cleanCouponId,
      registeredAt: now,
      createdAt: now,
      eligibility: 'Eligible',
      status: 'Active',
    }

    await participantsCol.insertOne(newParticipant)

    // Mark coupon as used in MongoDB
    if (cleanCouponId) {
      await couponsCol.updateOne(
        { id: cleanCouponId },
        {
          $set: {
            status: 'Used',
            usedAt: now,
            usedByParticipantId: participantId,
            usedByParticipantName: name || 'Festival Participant',
            usedByParticipantPhone: cleanPhone,
          },
        }
      )
    }

    return NextResponse.json({
      ok: true,
      id: participantId,
      participant: newParticipant,
    })
  } catch (err: any) {
    console.error('App Router /api/participants/register error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
