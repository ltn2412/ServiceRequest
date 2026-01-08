import mongoose, { Document, Schema, Types } from "mongoose"
import { IStation } from "./Station"
const { ObjectId } = Schema.Types

export interface ITable extends Document {
  _id: Types.ObjectId
  tableNum: number
  section: Types.ObjectId | IStation
  isActive: boolean
}

const tableSchema = new Schema<ITable>(
  {
    tableNum: { type: Number, required: true, unique: true },
    section: { type: ObjectId, ref: "Station", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, optimisticConcurrency: true }
)

export default mongoose.model<ITable>("Table", tableSchema, "Table")
