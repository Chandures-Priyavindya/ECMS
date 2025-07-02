import mongoose from 'mongoose';

const EnergyConsumerSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "Building A"
  usage: { type: Number, required: true },  // e.g. 450 (kWh)
});

export default mongoose.model('EnergyConsumer', EnergyConsumerSchema);
