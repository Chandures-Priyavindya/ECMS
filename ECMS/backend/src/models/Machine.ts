import mongoose, { Document, Schema } from 'mongoose';

// Define the Machine interface for the document
interface Machine extends Document {
  machineName: string;
  status: 'Active' | 'Maintenance' | 'Inactive' | 'Warning';
  location: string;
  kWh: number;
}

// Define the schema for the Machine model
const machineSchema: Schema = new Schema(
  {
    machineName: { type: String, required: true },
    status: { type: String, required: true, enum: ['Active', 'Maintenance', 'Inactive', 'Warning'] },
    location: { type: String, required: true },
    kWh: { type: Number, required: true }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Machine model using the schema and interface
const Machine = mongoose.model<Machine>('Machine', machineSchema);

export default Machine;
