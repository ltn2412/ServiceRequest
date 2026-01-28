import mongoose, { Document, Schema, Types } from "mongoose"

export enum ServiceStatus {
  ORDER = "ORDER",
  PAYMENT = "PAYMENT",
  CLEAN = "CLEAN",
}

export interface ITableRequest extends Document {
  _id: Types.ObjectId
  tableNum: number
  stationNum: number
  serviceStatus: ServiceStatus[]
  isCompleted: boolean
  requestCount: number
}

const tableRequestSchema = new Schema<ITableRequest>(
  {
    tableNum: { type: Number, required: true },
    stationNum: { type: Number, required: true },
    serviceStatus: {
      type: [String],
      enum: Object.values(ServiceStatus),
      default: [],
    },
    isCompleted: { type: Boolean, default: false },
    requestCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
)

export default mongoose.model<ITableRequest>("TableRequest", tableRequestSchema, "TableRequest")
