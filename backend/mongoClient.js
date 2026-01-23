import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
if (!uri) {
  console.warn('MONGODB_URI not set. Using default: mongodb://localhost:27017');
}

export const client = new MongoClient(uri);

export async function connect() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    return client.db(process.env.MONGODB_DB || 'edumanage');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

export default connect;
