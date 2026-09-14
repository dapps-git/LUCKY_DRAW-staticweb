import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) || {}
    const cleanEmail = (email || '').trim().toLowerCase()

    if (
      (cleanEmail === 'admin@valancheryfestival.com' && password === 'admin123') ||
      (cleanEmail === 'valancheryfestival@gmail.com' && password === 'festival2026')
    ) {
      return NextResponse.json({ ok: true, role: 'admin' })
    }

    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
