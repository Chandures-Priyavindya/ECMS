import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import AlertModel from './models/Alert';
import EnergyConsumer from './models/EnergyConsumer';
import EnergyCollection from './models/EnergyCollection';

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
    const allAlerts = await AlertModel.find(); // all alerts
    const latestAlerts = [...allAlerts].sort((a, b) => b._id.getTimestamp().getTime() - a._id.getTimestamp().getTime()).slice(0, 3);

    res.json({
      alerts: latestAlerts,
      activeCount: allAlerts.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});


// GET top 5 energy consumers sorted by usage descending
app.get('/api/energy/top-consumers', async (req, res) => {
  try {
    const topConsumers = await EnergyConsumer.find().sort({ usage: -1 }).limit(5);
    res.json(topConsumers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top consumers' });
  }
});

// GET /api/energy/trend?range=7d or 30d
app.get('/api/energy/trend', async (req, res) => {
  const { range } = req.query; // "7d" or "30d"
  const days = range === '30d' ? 30 : 7;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1); // include today

  try {
    const trendData = await EnergyCollection.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate.toDateString()),
            $lte: new Date(endDate.toDateString())
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          kWh: { $sum: "$usage" }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          name: "$_id",
          kWh: 1,
          _id: 0
        }
      }
    ]);

    res.json(trendData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trend data" });
  }
});

// Define the Machine schema
const machineSchema = new mongoose.Schema({
  machineName: String,
  status: String,
  location: String,
});

// Create Machine model
const Machine = mongoose.model('Machine', machineSchema);

// POST route to insert a new machine
app.post('/api/machines', async (req, res) => {
  const { machineName, status, location } = req.body;
  try {
    const newMachine = new Machine({ machineName, status, location });
    await newMachine.save();
    res.status(200).json({ message: 'Machine inserted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to insert machine' });
  }
});
// GET route to fetch all machines
app.get('/api/machines', async (req, res) => {
  try {
    const machines = await Machine.find();  // Fetch all machines from the database
    res.status(200).json(machines); // Send the machines as a response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch machines' });
  }
});
