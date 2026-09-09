import { connectDB } from './_db.js'

export default async function handler(req, res) {
  try {
    const db = await connectDB()
    const winnersCol = db.collection('winners')
    if (req.method === 'POST') {
      const doc = { ...req.body, createdAt: new Date() }
      await winnersCol.insertOne(doc)
      return res.status(201).json({ ok: true, winner: doc })
    }
    const winners = await winnersCol.find({}).sort({ createdAt: -1 }).toArray()
    res.status(200).json({ ok: true, winners })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
