import mongoose, { Document, Schema, Types } from "mongoose"

export interface IStation extends Document {
  _id: Types.ObjectId
  stationNum: number
  stationName: string
  isActive: boolean
}

const stationSchema = new Schema<IStation>(
  {
    stationNum: { type: Number, required: true, unique: true },
    stationName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, optimisticConcurrency: true }
)

export default mongoose.model<IStation>("Station", stationSchema, "Station")
