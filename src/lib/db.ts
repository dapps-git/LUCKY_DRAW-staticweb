import { MongoClient, Db } from 'mongodb'

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://dappstech2025_db_user:dapps1234@cluster0.ecrnbjn.mongodb.net/FESTIVAL?retryWrites=true&w=majority&appName=Cluster0'

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  if (!client) {
    client = new MongoClient(uri, options)
  }
  clientPromise = client.connect()
}

export async function connectDB(): Promise<Db> {
  const client = await clientPromise
  return client.db('FESTIVAL')
}

export default clientPromise
