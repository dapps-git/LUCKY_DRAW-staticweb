import { NextResponse } from 'next/server'
import { connectDB } from '../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, otp } = (await request.json()) || {}
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanOtp = (otp || '').trim()

    if (!cleanEmail || !cleanOtp) {
      return NextResponse.json({ ok: false, error: 'Email and OTP code are required' }, { status: 400 })
    }

    const db = await connectDB()
    const settingsCol = db.collection('admin_settings')
    const adminDoc = await settingsCol.findOne({ id: 'admin_credential' })

    if (!adminDoc || !adminDoc.otp || !adminDoc.otpExpires) {
      return NextResponse.json({ ok: false, error: 'No active OTP request found. Please request a new code.' }, { status: 400 })
    }

    if (new Date(adminDoc.otpExpires) < new Date()) {
      return NextResponse.json({ ok: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

    if (String(adminDoc.otp).trim() !== cleanOtp) {
      return NextResponse.json({ ok: false, error: 'Invalid OTP code. Please enter the 6-digit code sent to your email.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, message: 'OTP verified successfully' })
  } catch (err: any) {
    console.error('Verify OTP error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
