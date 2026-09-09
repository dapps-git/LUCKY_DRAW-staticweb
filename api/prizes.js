import { connectDB } from './_db.js'

export default async function handler(_req, res) {
  try {
    const db = await connectDB()
    const prizes = await db.collection('prizes').find({}).toArray()
    res.status(200).json({ ok: true, prizes })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
