const { MongoClient } = require('mongodb');
require('dotenv').config(); // To use .env file for MongoDB URI

// MongoDB Atlas URI (replace this with your own MongoDB URI)
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const insertData = async () => {
  try {
    await client.connect();

    const database = client.db('test'); // Use your database name
    const collection = database.collection('machine-consumers'); // The collection you created

    // Insert mock data (or actual machine data)
    const data = [
      { machineName: 'Compressor C-102', usage: 95 },
      { machineName: 'Assembly Line B', usage: 85 },
      { machineName: 'HVAC System', usage: 78 },
      { machineName: 'Packaging Unit P1', usage: 65 },
      { machineName: 'Conveyor Belt A', usage: 50 },
    ];

    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents`);

  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await client.close();
  }
};

insertData();
