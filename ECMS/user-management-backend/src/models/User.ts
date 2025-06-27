import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  role: String,
  department: String,
});

export default mongoose.model('User', userSchema);
