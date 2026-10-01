import { NextResponse } from 'next/server'
import { connectDB } from '../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = (await request.json()) || {}
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanOtp = (otp || '').trim()
    const cleanPass = (newPassword || '').trim()

    if (!cleanEmail || !cleanOtp || !cleanPass) {
      return NextResponse.json({ ok: false, error: 'Email, OTP, and new password are required' }, { status: 400 })
    }

    if (cleanPass.length < 6) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    const db = await connectDB()
    const settingsCol = db.collection('admin_settings')
    const adminDoc = await settingsCol.findOne({ id: 'admin_credential' })

    if (!adminDoc || !adminDoc.otp || !adminDoc.otpExpires) {
      return NextResponse.json({ ok: false, error: 'No active OTP request found. Please request a new code.' }, { status: 400 })
    }

    if (new Date(adminDoc.otpExpires) < new Date()) {
      return NextResponse.json({ ok: false, error: 'OTP has expired. Please request a new code.' }, { status: 400 })
    }

    if (String(adminDoc.otp).trim() !== cleanOtp) {
      return NextResponse.json({ ok: false, error: 'Invalid OTP code. Password was not changed.' }, { status: 400 })
    }

    // Set new custom password and invalidate OTP
    await settingsCol.updateOne(
      { id: 'admin_credential' },
      {
        $set: {
          id: 'admin_credential',
          email: cleanEmail,
          password: cleanPass,
          isCustomPassword: true, // Flags that default Admin@2026 is no longer valid
          otp: null,
          otpExpires: null,
          passwordChangedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      ok: true,
      message: 'Password reset successfully! Default password is now disabled. Please log in with your new password.',
    })
  } catch (err: any) {
    console.error('Reset password error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
