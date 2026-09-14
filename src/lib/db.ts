import { MongoClient, Db } from 'mongodb'

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0'

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 8000,
}

let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options)
  globalWithMongo._mongoClientPromise = client.connect()
}

const clientPromise = globalWithMongo._mongoClientPromise

export async function connectDB(): Promise<Db> {
  const client = await clientPromise
  return client.db('FESTIVAL')
}

export default clientPromise
