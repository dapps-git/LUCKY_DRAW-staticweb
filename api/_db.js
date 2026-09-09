import mongoose from 'mongoose'

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0'

let isConnected = false

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection
  }
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  isConnected = true
  return mongoose.connection
}
