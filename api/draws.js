import { connectDB } from './_db.js'

export default async function handler(_req, res) {
  try {
    const db = await connectDB()
    const draws = await db.collection('draws').find({}).toArray()
    res.status(200).json({ ok: true, draws })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
