import mongoose from "mongoose";
import dotenv from "dotenv";
import EnergyCollection from "../backend/src/models/EnergyCollection";

dotenv.config();

async function seedEnergyData() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDB");

  const today = new Date("2025-07-01");
  const data = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    data.push({
      usage: Math.floor(Math.random() * 200) + 50, // usage between 50–250 kWh
      date,
    });
  }

  await EnergyCollection.insertMany(data);
  console.log("Inserted 30 days of energy usage.");
  await mongoose.disconnect();
}

seedEnergyData();
