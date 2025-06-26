// db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI missing in .env');
}

const client = new MongoClient(uri);
let connectedClient = null;

export default async function connectDB() {
  if (!connectedClient) {
    await client.connect();
    connectedClient = client;
  }

  return connectedClient; 
}
