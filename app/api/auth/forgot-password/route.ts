import { NextResponse } from 'next/server'
import { connectDB } from '../../../../src/lib/db'
import { sendOtpEmail } from '../../../../src/lib/mailer'

export const dynamic = 'force-dynamic'

const DEFAULT_ADMIN_EMAIL = 'admin@valancheryfestival.com'

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) || {}
    const cleanEmail = (email || '').trim().toLowerCase()

    if (!cleanEmail) {
      return NextResponse.json({ ok: false, error: 'Admin email is required' }, { status: 400 })
    }

    const db = await connectDB()
    const settingsCol = db.collection('admin_settings')
    const adminDoc = await settingsCol.findOne({ id: 'admin_credential' })
    const activeEmail = (adminDoc?.email || DEFAULT_ADMIN_EMAIL).trim().toLowerCase()

    // Accept registered admin email or default admin email
    if (cleanEmail !== activeEmail && cleanEmail !== DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Email does not match admin registered address' }, { status: 404 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await settingsCol.updateOne(
      { id: 'admin_credential' },
      {
        $set: {
          id: 'admin_credential',
          email: cleanEmail,
          otp,
          otpExpires,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    )

    // Send email via nodemailer
    const mailRes = await sendOtpEmail(cleanEmail, otp)
    if (!mailRes.ok) {
      return NextResponse.json({ ok: false, error: mailRes.error || 'Failed to send OTP email' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      expiresIn: 600,
    })
  } catch (err: any) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
