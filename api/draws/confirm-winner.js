import { connectDB } from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const { participantId, drawId, prizeId } = req.body || {}
    if (!participantId || !drawId) {
      return res.status(400).json({ ok: false, error: 'Participant and Draw IDs are required' })
    }

    const db = await connectDB()
    const winnersCol = db.collection('winners')
    const drawsCol = db.collection('draws')
    const prizesCol = db.collection('prizes')

    // Check if participant already won
    const alreadyWon = await winnersCol.findOne({ participantId })
    if (alreadyWon) {
      return res.status(400).json({ ok: false, error: 'This participant has already won in a previous draw!' })
    }

    const draw = await drawsCol.findOne({ id: drawId })
    const awardedPrizeId = prizeId || draw?.prizeId
    const winnerId = `win-${Date.now()}`
    const now = new Date().toISOString().slice(0, 10)

    const doc = {
      id: winnerId,
      drawId,
      participantId,
      prizeId: awardedPrizeId,
      date: now,
      status: 'Confirmed',
      drawnAt: new Date(),
      createdAt: new Date(),
    }

    await winnersCol.insertOne(doc)

    if (drawId) {
      await drawsCol.updateOne(
        { id: drawId },
        { $set: { status: 'Completed', prizeId: awardedPrizeId, completedAt: now } }
      )
    }

    if (awardedPrizeId) {
      await prizesCol.updateOne(
        { id: awardedPrizeId },
        { $set: { status: 'Awarded', assignedDrawId: drawId } }
      )
    }

    return res.status(200).json({ ok: true, winnerId, winner: doc })
  } catch (err) {
    console.error('Confirm winner error:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
}
