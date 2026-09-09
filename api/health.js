import { connectDB } from './_db.js'

export default async function handler(_req, res) {
  try {
    await connectDB()
    res.status(200).json({ status: 'online', database: 'connected', timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ status: 'offline', error: err.message })
  }
}
