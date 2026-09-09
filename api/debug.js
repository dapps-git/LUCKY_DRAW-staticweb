import mongoose from 'mongoose'

export default async function handler(req, res) {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0'

  try {
    const startTime = Date.now()
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    const elapsed = Date.now() - startTime
    const collections = await mongoose.connection.db.listCollections().toArray()
    return res.status(200).json({
      success: true,
      elapsedMs: elapsed,
      readyState: mongoose.connection.readyState,
      collections: collections.map((c) => c.name),
      message: 'Connected to MongoDB Atlas from Vercel successfully!',
    })
  } catch (err) {
    return res.status(200).json({
      success: false,
      errorName: err?.name,
      errorMessage: err?.message,
      errorCode: err?.code,
      stack: err?.stack,
    })
  }
}
