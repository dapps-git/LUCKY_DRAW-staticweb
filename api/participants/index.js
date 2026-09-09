import { connectDB } from '../_db.js'

export default async function handler(req, res) {
  try {
    const db = await connectDB()
    const participants = await db.collection('participants').find({}).sort({ registeredAt: -1 }).toArray()
    res.status(200).json({ ok: true, participants })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
