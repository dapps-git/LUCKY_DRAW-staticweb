import { Router } from 'express'

const router = Router()

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@valancheryfestival.com').toLowerCase().trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2026'

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (email?.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ ok: true, message: 'Authenticated successfully' })
  }
  return res.status(401).json({ ok: false, error: 'Invalid admin credentials' })
})

export default router
