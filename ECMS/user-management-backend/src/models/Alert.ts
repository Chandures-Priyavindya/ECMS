import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  severity: String,
  alertType: String,
  machine: String,
  status: String,
  time: String
});

const AlertModel = mongoose.model('Alert', alertSchema);
export default AlertModel;
