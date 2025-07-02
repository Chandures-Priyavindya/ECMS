import express from 'express';
import { addUser, getUsers } from '../controllers/userController';
import EnergyConsumer from '../models/EnergyConsumer';

const router = express.Router();

router.post('/add', addUser);
router.get('/', getUsers);

router.get("/top-consumers", async (req, res) => {
  try {
    const consumers = await EnergyConsumer.find(); // or your relevant query
    const totalUsage = consumers.reduce((acc, c) => acc + c.usage, 0);
    res.json({
      consumers: consumers,
      totalUsage: totalUsage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top consumers" });
  }
});



export default router;
