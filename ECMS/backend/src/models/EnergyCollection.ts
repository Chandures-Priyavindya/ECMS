import mongoose, { Document, Schema } from "mongoose";

export interface EnergyDocument extends Document {
  usage: number;         // Energy in kWh
  date: Date;            // Date of usage
}

const EnergySchema: Schema<EnergyDocument> = new Schema({
  usage: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const EnergyCollection = mongoose.model<EnergyDocument>("EnergyUsage", EnergySchema);

export default EnergyCollection;
