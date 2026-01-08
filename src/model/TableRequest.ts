import mongoose, { Document, Schema, Types } from "mongoose"

export enum TableStatus {
  NONE = "NONE",
  ORDER = "ORDER",
  PAYMENT = "PAYMENT",
  CLEAN = "CLEAN",
}

export interface ITableRequest extends Document {
  _id: Types.ObjectId
  tableNum: number
  stationNum: number
  tableStatus?: TableStatus | null
  isCompleted: boolean
  requestCount: number
}

const tableRequestSchema = new Schema<ITableRequest>(
  {
    tableNum: { type: Number, required: true, unique: true },
    stationNum: { type: Number, required: true },
    tableStatus: { type: String, enum: Object.values(TableStatus), default: TableStatus.NONE },
    isCompleted: { type: Boolean, default: false },
    requestCount: { type: Number, default: 1 },
  },
  { timestamps: true, optimisticConcurrency: true }
)

export default mongoose.model<ITableRequest>("TableRequest", tableRequestSchema, "TableRequest")
