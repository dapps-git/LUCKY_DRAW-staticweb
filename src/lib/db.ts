import mongoose from 'mongoose'
import { Db } from 'mongodb'

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0'

let cachedDb: Db | null = null

export async function connectDB(): Promise<Db> {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    })
  }

  const db = mongoose.connection.db
  if (!db) {
    throw new Error('Database connection failed: mongoose.connection.db is undefined')
  }

  cachedDb = db
  return cachedDb
}
