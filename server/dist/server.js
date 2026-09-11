import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';
import couponsRouter from './routes/coupons.js';
import participantsRouter from './routes/participants.js';
import prizesRouter from './routes/prizes.js';
import drawsRouter from './routes/draws.js';
import winnersRouter from './routes/winners.js';
import authRouter from './routes/auth.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0';
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// Universal Health & Root Handler
app.use((req, res, next) => {
    const p = req.path.toLowerCase();
    if (p === '/health' || p.endsWith('/health') || p === '/api/health') {
        return res.json({
            status: 'online',
            service: 'Valanchery Festival Lucky Draw API',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString(),
        });
    }
    if (p === '/' ||
        p === '' ||
        p === '/festival' ||
        p === '/festival/' ||
        p === '/api' ||
        p === '/api/' ||
        p === '/festival/api' ||
        p === '/festival/api/') {
        return res.json({
            status: 'online',
            service: 'Valanchery Festival Lucky Draw API',
            database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            endpoints: {
                health: '/health',
                coupons: '/coupons',
                participants: '/participants',
                prizes: '/prizes',
                draws: '/draws',
                winners: '/winners',
            },
            timestamp: new Date().toISOString(),
        });
    }
    next();
});
// Routes
app.use('/api/coupons', couponsRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/prizes', prizesRouter);
app.use('/api/draws', drawsRouter);
app.use('/api/winners', winnersRouter);
app.use('/api/auth', authRouter);
app.use('/coupons', couponsRouter);
app.use('/participants', participantsRouter);
app.use('/prizes', prizesRouter);
app.use('/draws', drawsRouter);
app.use('/winners', winnersRouter);
app.use('/auth', authRouter);
app.use('/festival/api/coupons', couponsRouter);
app.use('/festival/api/participants', participantsRouter);
app.use('/festival/api/prizes', prizesRouter);
app.use('/festival/api/draws', drawsRouter);
app.use('/festival/api/winners', winnersRouter);
app.use('/festival/api/auth', authRouter);
app.use('/festival/coupons', couponsRouter);
app.use('/festival/participants', participantsRouter);
app.use('/festival/prizes', prizesRouter);
app.use('/festival/draws', drawsRouter);
app.use('/festival/winners', winnersRouter);
app.use('/festival/auth', authRouter);
// Database Connection & Server Start
async function startServer() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log('✅ Connected to MongoDB Atlas (Database: FESTIVAL)');
        // Seed database if empty
        await seedDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Valanchery Festival Backend running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        // Fallback: Start express server anyway so it handles requests with informative error
        app.listen(PORT, () => {
            console.log(`⚠️ Server running in offline/unconnected mode on http://localhost:${PORT}`);
        });
    }
}
startServer();
export default app;
