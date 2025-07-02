// db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'myapp';

let dbInstance = null;

const connectDB = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    dbInstance = client.db(DB_NAME); 
    console.log('MongoDB connected successfully.');
    return dbInstance;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw new Error('Database connection failed.');
  }
};

export default connectDB;


