import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import couponsRouter from '../server/src/routes/coupons.js'
import participantsRouter from '../server/src/routes/participants.js'
import prizesRouter from '../server/src/routes/prizes.js'
import drawsRouter from '../server/src/routes/draws.js'
import winnersRouter from '../server/src/routes/winners.js'
import authRouter from '../server/src/routes/auth.js'

const app = express()
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0'

app.use(cors())
app.use(express.json({ limit: '10mb' }))

let isConnected = false
app.use(async (_req, _res, next) => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
      })
      isConnected = true
    } catch (err) {
      console.error('MongoDB serverless connection error:', err)
    }
  }
  next()
})

app.use('/api/coupons', couponsRouter)
app.use('/coupons', couponsRouter)
app.use('/api/participants', participantsRouter)
app.use('/participants', participantsRouter)
app.use('/api/prizes', prizesRouter)
app.use('/prizes', prizesRouter)
app.use('/api/draws', drawsRouter)
app.use('/draws', drawsRouter)
app.use('/api/winners', winnersRouter)
app.use('/winners', winnersRouter)
app.use('/api/auth', authRouter)
app.use('/auth', authRouter)

app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

export default app
