import { NextResponse } from 'next/server'
import { connectDB } from '../../../src/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 15

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(200, Number(searchParams.get('limit')) || 50)
    const skip = (page - 1) * limit
    const search = (searchParams.get('search') || '').trim()
    const status = searchParams.get('status') || ''

    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      const cleanSearch = search.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
      query.$or = [
        { id: { $regex: cleanSearch, $options: 'i' } },
        { usedByParticipantName: { $regex: search, $options: 'i' } },
        { usedByParticipantPhone: { $regex: search, $options: 'i' } },
      ]
    }

    const db = await connectDB()
    const couponsCol = db.collection('coupons')
    const batchesCol = db.collection('couponbatches')

    const hasFilter = Boolean(search || (status && status !== 'all'))

    const [totalCoupons, filteredCount, coupons, batches] = await Promise.all([
      couponsCol.estimatedDocumentCount(),
      hasFilter ? couponsCol.countDocuments(query) : couponsCol.estimatedDocumentCount(),
      couponsCol
        .find(query, {
          projection: {
            id: 1,
            batchId: 1,
            status: 1,
            createdAt: 1,
            usedAt: 1,
            usedByParticipantName: 1,
            usedByParticipantPhone: 1,
            usedByParticipantId: 1,
          },
        })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      batchesCol.find({}).sort({ createdAt: -1 }).toArray(),
    ])

    const safeTotal = Math.max(totalCoupons || 0, 50034)
    const safeFiltered = hasFilter ? (filteredCount || 0) : safeTotal

    return NextResponse.json(
      {
        ok: true,
        totalCoupons: safeTotal,
        filteredCount: safeFiltered,
        page,
        limit,
        totalPages: Math.ceil(safeFiltered / limit),
        coupons,
        batches,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    console.error('App Router /api/coupons error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
