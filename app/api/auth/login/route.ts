import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../../../src/lib/db'

export const dynamic = 'force-dynamic'

const DEFAULT_ADMIN_EMAIL = 'admin@valancheryfestival.com'
const DEFAULT_ADMIN_PASSWORD = 'Admin@2026'

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) || {}
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPass = (password || '').trim()

    if (!cleanEmail || !cleanPass) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 })
    }

    const db = await connectDB()
    const settingsCol = db.collection('admin_settings')
    const adminDoc = await settingsCol.findOne({ id: 'admin_credential' })

    // If custom password was set by admin
    if (adminDoc && adminDoc.isCustomPassword) {
      const storedEmail = (adminDoc.email || DEFAULT_ADMIN_EMAIL).trim().toLowerCase()
      const storedPass = (adminDoc.password || '').trim()

      let isMatch = false
      if (storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$') || storedPass.startsWith('$2y$')) {
        isMatch = await bcrypt.compare(cleanPass, storedPass)
      } else {
        // Legacy plain text check (auto-upgrades to bcrypt hash)
        isMatch = cleanPass === storedPass
        if (isMatch) {
          const newHash = await bcrypt.hash(cleanPass, 10)
          await settingsCol.updateOne({ id: 'admin_credential' }, { $set: { password: newHash } })
        }
      }

      if (cleanEmail === storedEmail && isMatch) {
        return NextResponse.json({ ok: true, role: 'admin' })
      }
      // Explicitly reject if custom password is set and password does not match (Default Admin@2026 will fail)
      return NextResponse.json({ ok: false, error: 'Invalid admin credentials' }, { status: 401 })
    }

    // Default credentials when no custom password has been set yet
    if (cleanEmail === DEFAULT_ADMIN_EMAIL && cleanPass === DEFAULT_ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true, role: 'admin' })
    }

    return NextResponse.json({ ok: false, error: 'Invalid admin credentials' }, { status: 401 })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
