import mongoose, { Document, Schema, Types } from "mongoose"

export enum TableStatus {
  ORDER = "ORDER",
  PAYMENT = "PAYMENT",
  CLEAN = "CLEAN",
  COMPLETE = "COMPLETE",
}

export interface ITableRequest extends Document {
  _id: Types.ObjectId
  tableNum: number
  sectionNum: number
  tableStatus?: TableStatus | null
  requestCount: number
}

const tableRequestSchema = new Schema<ITableRequest>(
  {
    tableNum: { type: Number, required: true, unique: true },
    sectionNum: { type: Number, required: true },
    tableStatus: { type: String, enum: Object.values(TableStatus) },
    requestCount: { type: Number, default: 1 },
  },
  { timestamps: true, optimisticConcurrency: true }
)

export default mongoose.model<ITableRequest>("TableRequest", tableRequestSchema, "TableRequest")
