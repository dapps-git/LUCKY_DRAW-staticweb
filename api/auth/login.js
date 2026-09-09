export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  const { email, password } = req.body || {}
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@valancheryfestival.com').toLowerCase().trim()
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2026'

  if (email?.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true, message: 'Authenticated' })
  }
  res.status(401).json({ ok: false, error: 'Invalid credentials' })
}
