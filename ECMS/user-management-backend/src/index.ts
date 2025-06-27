import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import AlertModel from './models/Alert';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

  // GET all alerts
app.get('/api/alerts', async (req, res) => {
  const alerts = await AlertModel.find();
  res.json(alerts);
});

// POST a new alert
app.post('/api/alerts', async (req, res) => {
  const newAlert = new AlertModel(req.body);
  await newAlert.save();
  res.json(newAlert);
});

app.get('/api/alerts/latest', async (req, res) => {
  try {
    const alerts = await AlertModel.find()
      .sort({ _id: -1 })       // newest first
      .limit(3);               // only last 3

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest alerts' });
  }
});