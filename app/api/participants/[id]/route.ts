import { NextResponse } from 'next/server'
import { connectDB } from '../../../../src/lib/db'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = await connectDB()
    const { _id, ...updateFields } = body
    await db.collection('participants').updateOne({ id }, { $set: updateFields })
    const updated = await db.collection('participants').findOne({ id })
    return NextResponse.json({ ok: true, participant: updated })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await connectDB()
    await db.collection('participants').deleteOne({ id })
    return NextResponse.json({ ok: true, message: 'Participant deleted' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
